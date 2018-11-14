//npm install --save console-png
//https://www.npmjs.com/package/console-png?activeTab=readme

//npm install axios


const axios = require('axios');
const pngStringify = require('console-png')

// il te faut une image appelé blue_baby dans le dossier /img/character pour que ça fonctionne
const image = require('fs').readFileSync(__dirname + '/img/characters/blue_baby.png')


//init
const options = {
    fit: 'box',
    width: 20,
    height: 5,
}

let data = {
    bossName : [],
    characterName : [],
    itemName : [],
    monsterName : []

}

let api_boss = 'https://isaac.jamesmcfadden.co.uk/api/v1/boss?page='
let api_char = 'https://isaac.jamesmcfadden.co.uk/api/v1/character'
let api_item = 'http://isaac.jamesmcfadden.co.uk/api/v1/item?page='
let api_monster = 'https://isaac.jamesmcfadden.co.uk/api/v1/monster?page='


function getDataName (values, nbData, obj){
    for (let name of values[nbData].data.data) {
        obj.push(name.name)
    }

}

let boss =  axios.get(api_boss + 1 )
let boss2 = axios.get(api_boss + 2)
let personnage = axios.get(api_char)
let item1 = axios.get(api_item + 1)
let item2 = axios.get(api_item + 2)
let item3 = axios.get(api_item + 3)
let item4 = axios.get(api_item + 4)
let item5 = axios.get(api_item + 5)
let item6 = axios.get(api_item + 6)
let item7 = axios.get(api_item + 7)
let item8 = axios.get(api_item + 8)
let item9 = axios.get(api_item + 9)
let monster1 = axios.get(api_monster + 1)
let monster2 = axios.get(api_monster + 2)
let monster3 = axios.get(api_monster + 3)
let monster4 = axios.get(api_monster + 4)


Promise.all([boss, boss2, personnage, item1, item2, item3, item4, item5, item6, item7, item8, item9, monster1, monster2, monster3, monster4])
    .then(function (values){
        getDataName(values, 0, data.bossName)
        getDataName(values, 1, data.bossName)
        getDataName(values, 2, data.characterName)
        for(let i=3; i<12; i++){
        getDataName(values, i, data.itemName)
        }
        for(let i = 11; i<16 ; i++){} 
        getDataName(values, 12, data.monsterName)
        getDataName(values, 13, data.monsterName)
        getDataName(values, 14, data.monsterName)
        getDataName(values, 15, data.monsterName)
        console.log(data)
        }

      
        
    )
    
    pngStringify(image, function(err, string){
        if (err) throw err;
        console.log(string);
    })