#!/usr/bin/node node

/*
Modules:
commander
axios
sqlite
path
*/


// https://www.npmjs.com/package/commander
// http://www.sqlitetutorial.net/sqlite-nodejs/connect/


const program = require('commander');
const sqlite3 = require('sqlite3').verbose();
 
program
  .version('0.1.0')
  .option('init', 'Initialise les Bases de données')
  .option('-C, --characters-list', 'Affiche la liste des personnages')
  .parse(process.argv);
 
if (program.init) init();
if (program.charactersList) console.log("list perso")

const axios = require("axios");
const url = "https://isaac.jamesmcfadden.co.uk/api/v1/"
let data = {
    bosses:[],
    characters:[],
    items:[]
};

const boss1 = axios.get(url+'boss?page=1')
const boss2 = axios.get(url+'boss?page=2')
const character = axios.get(url+'character')
const item1 = axios.get(url+'item?page=1');
const item2 = axios.get(url+'item?page=2');
const item3 = axios.get(url+'item?page=3');
const item4 = axios.get(url+'item?page=4');
const item5 = axios.get(url+'item?page=5');
const item6 = axios.get(url+'item?page=6');
const item7 = axios.get(url+'item?page=7');
const item8 = axios.get(url+'item?page=8');
const item9 = axios.get(url+'item?page=9');


const path = require('path')
const dbPath = path.resolve(__dirname, 'toto.db')
const db = new sqlite3.Database(dbPath)


Promise.all([boss1, boss2, character, item1, item2, item3, item4, item5, item6, item7, item8, item9 ])
.then(function (response){
    getData(data.bosses, response[0])
    getData(data.bosses, response[1])
    getData(data.characters, response[2])
    for(let i=3; i<12; i++)
        getData(data.items, response[i])
}).catch(function (response){

})

function getData(variable ,response){
    for(let tmp of response.data.data){
        variable.push(tmp.name) 
    }
}



function createDB(){
    let sql = `CREATE TABLE characters (
        character_id integer PRIMARY KEY,
        name text NOT NULL
        );`;
    try{
        db.run(sql)
    }catch(e){
        console.log(e.message)
    }
}


function insertDB(name){
    let sql = `INSERT INTO characters (name)
        VALUES
        ('`+name+`');`;
    try{
        db.run(sql)
    }catch(e){
        console.log(e.message)
    }
}

function init(){
    createDB()
    data.name.forEach(insertDB(this))
    db.close()
}

let sql3 = `SELECT
        character_id,
        name
        FROM
        characters;`

db.all(sql3, [], (err, rows) => {
    if (err) {
    throw err;
    }
    rows.forEach((row) => {
    console.log(row);
    });
});


/*
axios.get(url+'character')
.then(function (response){
    test.character=response.data.data
    console.log(test)
}).catch(function (response){
    console.log(response)
});
*/

/*
Arguments

npm install commander --save


*/

/* Intéraction avec l'utilisateur : https://github.com/SBoudrias/Inquirer.js/ */

/* https://www.npmjs.com/package/sqlite SQLitei */ 