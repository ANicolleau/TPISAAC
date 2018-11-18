#!/usr/bin/node node

/*
Modules :
commander
axios
sqlite3
inquirer
fs
*/


// VARIABLES

const commander = require('commander')
const sqlite3 = require('sqlite3').verbose()
const axios = require('axios')
const inquirer = require('inquirer');
const fs = require("fs");
const download = require('images-downloader').images
const pngStringify = require('console-png')

const db_name = "./isaac.db"
const api_character = 'https://isaac.jamesmcfadden.co.uk/api/v1/character'
const api_boss = 'https://isaac.jamesmcfadden.co.uk/api/v1/boss?page='
let object = {
    character_names:[],
    bosses_names:[]
}

// VARIABLES ANTOINE
let spritCharacter = {
    url : []
}

let spritBoss = {
    url: []
}

let compteur = 0
const destBoss = './img/boss'
const destChar = './img/characters'



// Program

commander
  .version('0.1.0')
  .option('-I, --init', 'Initialise the database + les sprites')
  .option('-C, --list-characters', 'Show characters list')
  .option('-c, --character', 'Show stat from a character')
  .option('-B, --list-bosses', 'Show bosses list')
  .option('-U, --uninstall', 'Remove the database')
  .option('-S --charSprites', 'Affiche les sprites des personnages')
  .parse(process.argv);
 
if (commander.init) Init();
if (commander.uninstall) fs.unlinkSync(db_name), console.log("file remove");
if (commander.listCharacters) ListCharacters();
if (commander.character) ChoixCharacter();
if (commander.listBosses) ListBosses();
if (commander.charSprites) spritesChar();


// Functions

function Init(){
    try {
        if (!fs.existsSync(db_name)) {
            let database = OpenDB()
            const promise_character = axios.get(api_character)
            const promise_boss1 = axios.get(api_boss+"1")
            const promise_boss2 = axios.get(api_boss+"2")

            Promise.all([promise_character, promise_boss1, promise_boss2])
            .then((response)=>{
                for(let i = 0; i<response[0].data.data.length; i++){
                    object.character_names.push(response[0].data.data[i].name)
                }
                for(let i = 0; i<response[1].data.data.length; i++){
                    object.bosses_names.push(response[1].data.data[i].name)
                }
                for(let i = 0; i<response[2].data.data.length; i++){
                    object.bosses_names.push(response[2].data.data[i].name)
                }
            }).then(()=>{
                CreateSqlCharacters(database)
                CreateSqlBosses(database)
            }).then(()=>{
                CloseDB(database)
            })
        }else{
            console.log("Database already exists !")
        }
    } catch(err) { 
        console.error(err)
    }
    downloadsprites(renameChar, renameBoss)
}

function CreateSqlCharacters(database){
    let sqlcreate = `CREATE TABLE characters (
        characters_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text NOT NULL,
        health text,
        damage text,
        tears text,
        shotspeed text,
        range text,
        speed text,
        startingpickup text,
        startingitem text,
        sprite image
    )`
    
    database.run(sqlcreate, (err) => {
        if (err) {
          throw err;
        }
        console.log("Create")
        InsertSqlCharacters(database)
    });
}

function CreateSqlBosses(database){
    let sqlcreate = `CREATE TABLE bosses (
        characters_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text NOT NULL
    )`
    
    database.run(sqlcreate, (err) => {
        if (err) {
          throw err;
        }
        console.log("Create")
        InsertSqlBosses(database)
    });
}

function InsertSqlCharacters(database){
    let placeholders = object.character_names.map((value) => '(?)').join(',');
    let sqlinsert = `INSERT INTO characters (
        name)
       VALUES`+ placeholders

    database.run(sqlinsert, object.character_names, (err) => {
        if (err) {
          throw err;
        }
        console.log("Insert")
        UpdateSqlCharacters(database)
        
    });
}

function InsertSqlBosses(database){
    let placeholders = object.bosses_names.map((value) => '(?)').join(',');
    let sqlinsert = `INSERT INTO bosses (
        name)
       VALUES`+ placeholders

    database.run(sqlinsert, object.bosses_names, (err) => {
        if (err) {
          throw err;
        }
        console.log("Insert")
    });
}

function UpdateSqlCharacters(database){
    const stat = require('./stat.json')

    for(let i in stat){
        let sqlupdate = `UPDATE characters
            SET health = "`+stat[i].health+`",
                damage = "`+stat[i].damage+`",
                tears = "`+stat[i].tears+`",
                shotspeed = "`+stat[i].shotspeed+`",
                range = "`+stat[i].range+`",
                speed = "`+stat[i].speed+`",
                startingpickup = "`+stat[i].startingpickup+`",
                startingitem = "`+stat[i].startingitem+`",
                sprite = "`+stat[i].sprite+`"
            WHERE
                name = "`+i+`";`
    
        database.run(sqlupdate, (err) => {
            if (err) {
            throw err;
            }
            console.log("Update")
        });
    }
}


function ListCharacters(){
    let database = OpenDB()

    let sqlselect = `SELECT * FROM characters`

    database.all(sqlselect, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.name);
        });
    });

    CloseDB(database)
    
}

function ListBosses(){
    let database = OpenDB()

    let sqlselect = `SELECT * FROM bosses`

    database.all(sqlselect, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.name);
        });
    });

    CloseDB(database)
}

function CloseDB(database){
    database.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        //console.log('Close the database connection.');
    });
}

function OpenDB(){
    let database = new sqlite3.Database(db_name, (err) => {
        if (err) {
          console.error(err.message);
        }
        //console.log('Connected to the isaac database.');
    });
    
    return database
}

function ChoixCharacter(){
    const choice = ["???",
    "Azazel",
    "Cain",
    "Eden",
    "Eve",
    "Isaac",
    "Judas",
    "Keeper",
    "Lazarus",
    "Lilith",
    "Magdalene",
    "Samson",
    "The Lost"]
    inquirer
    .prompt([{ type: 'list', name: 'Character', message: 'Choose the character', choices: choice}])
    .then(answers => {SelectCharacter(answers.Character)})
}

function SelectCharacter(name){
    let database = OpenDB()

    let sqlselect = `SELECT * FROM characters WHERE name = "`+name+`";`

    database.all(sqlselect, [], (err, rows) => {
        if (err) {
          throw err;
        }
        rows.forEach((row) => {
          console.log(row.name);
          console.log("Health : "+row.health);
          console.log("Damage : "+row.damage);
          console.log("Tears : "+row.tears);
          console.log("Shot Speed : "+row.shotspeed);
          console.log("Range : "+row.range);
          console.log("Speed : "+row.speed);
          console.log("Starting PickUp : "+row.startingpickup);
          console.log("Starting Item : "+row.startingitem);
          unSprite(row.sprite)
          
        });
    });

    CloseDB(database)
}

function getDataName (values, nbData, obj){
    for (let name of values[nbData].data.data) {
        obj.push(name.sprite_url)
    }
}
function downloadsprites (callback1, callback2){

    let api_char = 'https://isaac.jamesmcfadden.co.uk/api/v1/character'
    let api_boss = 'https://isaac.jamesmcfadden.co.uk/api/v1/boss?page='
    
    let boss =  axios.get(api_boss + 1 )
    let boss2 = axios.get(api_boss + 2)
    let personnage = axios.get(api_char)
        Promise.all([boss, boss2, personnage])
        .then(function (values){
            getDataName(values, 0, spritBoss.url)
            getDataName(values, 1, spritBoss.url)
            getDataName(values, 2, spritCharacter.url)
            },    
        ).then(function(values){
            return download(spritCharacter.url, destChar)
        })
        .then(result => {
            console.log('Images Characters downloaded', result);	
            callback1(result)
        }).then(function(values){
            return download(spritBoss.url,destBoss)
        }).then(result => {
            console.log('Images Boss downloaded', result);	
            callback2(result)
        })
}

function renameChar(object){
	let imageChar = __dirname +'/img/characters/image_'
	console.log('début rename personnage')
	for(let i=0; i<object.length; i++){
		let s = object[i].filename
		if( s.charAt( 0 ) === '.' )
   			s = s.slice( 1 );
		//permet de vérifier si les images éxiste est les renommes à partir de 1
		fs.rename(__dirname+s, imageChar+i+'.png', (err) => {
			if (err) throw err;
			console.log('Rename complete!');
		  });		
	}

}

function renameBoss(object){
	let imageBoss = __dirname +'/img/boss/image_'
	console.log('début rename boss')
	for(let i=0; i<object.length; i++){
		let s = object[i].filename
		if( s.charAt( 0 ) === '.' )
   			s = s.slice( 1 );
		//permet de vérifier si les images éxiste est les renommes à partir de 1
		fs.rename(__dirname+s, imageBoss+i+'.png', (err) => {
			if (err) throw err;
			console.log('Rename complete!');
		  });		
	}

}

function spritesChar(){
	for(let i = 0; i<13;i++){
        const image = require('fs').readFileSync(__dirname + '/img/characters/image_'+i+'.png')

        pngStringify(image, function(err, string){
            if (err) throw err;
            console.log(string);
        })
    }

}

function unSprite(obj){
        const image = require('fs').readFileSync(__dirname + obj + '.png')

        pngStringify(image, function(err, string){
            if (err) throw err;
            console.log(string);
        })

}



