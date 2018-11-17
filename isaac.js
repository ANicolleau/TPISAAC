#!/usr/bin/node node

/*
Modules :
commander
axios
sqlite3

*/

// VARIABLES

const commander = require('commander')
const sqlite3 = require('sqlite3').verbose()
const axios = require('axios')
const inquirer = require('inquirer');
const db_name = "./isaac.db"
const api_character = 'https://isaac.jamesmcfadden.co.uk/api/v1/character'
let object = {
    character_names:[]
}

// Program

commander
  .version('0.1.0')
  .option('-I, --init', 'Initialise le programme')
  .option('-C, --list-characters', 'Affiche la liste des personnages')
  .parse(process.argv);
 
if (commander.init) Init();
if (commander.listCharacters) ListCharacters();


// Functions

function Init(){
    let database = OpenDB()

    axios.get(api_character).then((response)=>{
        for(let i = 0; i<response.data.data.length; i++){
            object.character_names.push(response.data.data[i].name)
        }
    }).then(()=>{
        CreateSqlCharacters(database)
    })
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
    CloseDB(database)
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

