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

const db_name = "./isaac.db"
const api_character = 'https://isaac.jamesmcfadden.co.uk/api/v1/character'
const api_boss = 'https://isaac.jamesmcfadden.co.uk/api/v1/boss?page='
let object = {
    character_names:[],
    bosses_names:[]
}

// Program

commander
  .version('0.1.0')
  .option('-I, --init', 'Initialise the database')
  .option('-C, --list-characters', 'Show characters list')
  .option('-c, --character', 'Show stat from a character')
  .option('-B, --list-bosses', 'Show bosses list')
  .option('-U, --uninstall', 'Remove the database') 
  .parse(process.argv);
 
if (commander.init) Init();
if (commander.uninstall) fs.unlinkSync(db_name), console.log("file remove");
if (commander.listCharacters) ListCharacters();
if (commander.character) ChoixCharacter();
if (commander.listBosses) ListBosses();


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
        startingitem text
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
                startingitem = "`+stat[i].startingitem+`"
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
          
        });
    });

    CloseDB(database)
}