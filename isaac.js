const axios = require('axios');

let data = {
    bossName : [],
    characterName : [],
    itemName : [],
    monsterName : []

}


function getDataName (values, nbData, obj){
    for (let name of values[nbData].data.data) {
        obj.push(name.name)
    }

}

let boss =  axios.get('https://isaac.jamesmcfadden.co.uk/api/v1/boss?page=1')
let boss2 = axios.get('https://isaac.jamesmcfadden.co.uk/api/v1/boss?page=2')
let personnage = axios.get('https://isaac.jamesmcfadden.co.uk/api/v1/character')
let item1 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=1')
let item2 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=2')
let item3 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=3')
let item4 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=4')
let item5 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=5')
let item6 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=6')
let item7 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=7')
let item8 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=8')
let item9 = axios.get('http://isaac.jamesmcfadden.co.uk/api/v1/item?page=9')
let monster1 = axios.get('https://isaac.jamesmcfadden.co.uk/api/v1/monster?page=1')
let monster2 = axios.get('https://isaac.jamesmcfadden.co.uk/api/v1/monster?page=2')
let monster3 = axios.get('https://isaac.jamesmcfadden.co.uk/api/v1/monster?page=3')
let monster4 = axios.get('https://isaac.jamesmcfadden.co.uk/api/v1/monster?page=4')


Promise.all([boss, boss2, personnage, item1, item2, item3, item4, item5, item6, item7, item8, item9, monster1, monster2, monster3, monster4])
    .then(function (values){
        getDataName(values, 0, data.bossName)
        getDataName(values, 1, data.bossName)
        getDataName(values, 2, data.characterName)
        getDataName(values, 3, data.itemName)
        getDataName(values, 4, data.itemName)
        getDataName(values, 5, data.itemName)
        getDataName(values, 6, data.itemName)
        getDataName(values, 7, data.itemName)
        getDataName(values, 8, data.itemName)
        getDataName(values, 9, data.itemName)
        getDataName(values, 10, data.itemName)
        getDataName(values, 11, data.itemName)
        getDataName(values, 12, data.monsterName)
        getDataName(values, 13, data.monsterName)
        getDataName(values, 14, data.monsterName)
        getDataName(values, 15, data.monsterName)
        console.log(data)
    })

// asciify pour les sprites

/*Promise.all([boss, boss2, personnage])
    .then(function (values){
        for (let nameBoss of values[0].data.data){
            data.bossName.push(nameBoss.name)
        }
        for (let nameBoss of values[1].data.data){
            data.bossName.push(nameBoss.name)
        }
        for (let nameCharacter of values[2].data.data){
            data.characterName.push(nameCharacter.name)
        }
            console.log(data)
    })*/






/*axios.get('https://isaac.jamesmcfadden.co.uk/api/v1/boss')
    .then(function(bosses) {
        boss = bosses.data
        console.log(boss)
    })
    .catch(function (error){
    console.log(error)
})*/