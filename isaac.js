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

const statCharacters={
"???":{
health:"B, B, B",
damage:"3.5*(1.05)",
 tears:"+0",
 shotspeed:"1",
 range:"23.75",
 speed:"1.1",
 luck:"0",
 startingpickup:"None",
 startingitem:"The Poop"
},Azazel:{
health:"N, N, N",
damage:"3.5*(1.50)",
 tears:"+0.5, *1/3",
 shotspeed:"1",
 range:"17.75",
 speed:"1.25",
 luck:"0",
 startingpickup:"The Fool",
 startingitem:"Brimstone, Flight"
},Cain:{
health:"R, R",
damage:"3.5*(1.20)",
 tears:"+0",
 shotspeed:"1",
 range:"17.75",
 speed:"1.3",
 luck:"0",
 startingpickup:"x1 keys, Paper Clip",
 startingitem:"Lucky Foot"
},Eden:{
health:"random",
damage:"3.5*(1.00) +/- 1.00",
 tears:"+/- 0.75",
 shotspeed:"1+/- 0.25",
 range:"23.75+/-5.00",
 speed:"1.0+/-0.15",
 luck:"0+/-1",
 startingpickup:"x0-2 bombs, x0-1 keys, x0-5 coins, x0-1 trinket, pill, or card",
 startingitem:"Random active item, Random passive item"
},Eve:{
health:"R, R",
damage:"3.5*(0.75)(*1.00atR)",
 tears:"+0",
 shotspeed:"1",
 range:"23.75",
 speed:"1.23",
 luck:"0",
 startingpickup:"None",
 startingitem:"Whore of Babylon, Dead Bird, Razor Blade"
},Isaac:{
 health:"R, R, R",
damage:"3.5*(1.00)",
 tears:"+0",
 shotspeed:"1",
 range:"23.75",
 speed:"1.0",
 luck:"0",
 startingpickup:"x1 bombs",
 startingitem:"The D6"
},Judas:{
health:"R",
damage:"3.5*(1.35)",
 tears:"+0",
 shotspeed:"1",
 range:"23.75",
 speed:"1.0",
 luck:"0",
 startingpickup:"x3 coins",
 startingitem:"The Book of Belial"
},Keeper:{
health:"G, G",
damage:"3.5*(1.20)",
 tears:"+18",
 shotspeed:"1",
 range:"23.75",
 speed:"0.85",
 luck:"-2",
 startingpickup:"x1 bombs, x1 coins, Store Key",
 startingitem:"Triple Shot, Wooden Nickel"
},Lazarus:{
health:"R, N, N",
damage:"3.5*(1.00)",
 tears:"+0",
 shotspeed:"1",
 range:"23.75",
 speed:"1.0",
 luck:"0",
 startingpickup:"None",
 startingitem:"Anemic"
},Lilith:{
health:"R",
damage:"3.5*(1.35)",
 tears:"+0",
 shotspeed:"1",
 range:"23.75",
 speed:"1.0",
 luck:"0",
 startingpickup:"x3 coins",
 startingitem:"Blindfolded, Incubus, Cambion Conception, Box of Friends"
},Magdalene:{
health:"R, R, R, R",
damage:"3.5*(1.00)",
 tears:"+0",
 shotspeed:"1",
 range:"23.75",
 speed:"0.85",
 luck:"0",
 startingpickup:"x1 Speed Up pill",
 startingitem:"Yum Heart"
},Samson:{
health:"R, R, R",
damage:"3.5*(1.35)",
 tears:"-0.05",
 shotspeed:"1.31",
 range:"28.75",
 speed:"1.1",
 luck:"0",
 startingpickup:"Child's Heart",
 startingitem:"Bloody Lust"
},"The Lost":{
health:"No health",
damage:"3.5*(1.00)",
 tears:"+0",
 shotspeed:"1",
 range:"23.75",
 speed:"1.0",
 luck:"0",
 startingpickup:"x1 coins",
 startingitem:"Flight, Spectral tears, D4, Holy Mantle"
}
}

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

function afficherCharacter(){
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

}



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
