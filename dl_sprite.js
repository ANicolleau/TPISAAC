//  npm install --save image-downloader pour const download
// npm install images-downloader --save
//npm install --save console-png

const axios = require('axios');


// pour dl les images
const download = require('images-downloader').images

//pour afficher les images dans la console
const pngStringify = require('console-png')
const fs = require('fs')

// option pour dl, essayer de mettre le tableau de sprites
// créer le même chemin dans ton dossier ou tu mets le scripts img/characters et img/boss pour save les images
// on stocke les url ici
let spritCharacter = {
    url : []
}

let spritBoss = {
    url: []
}

let compteur = 0

const destChar = './img/boss'
const destBoss = './img/characters'
let imageChar = __dirname +'/img/characters/image_'

// Init
let api_char = 'https://isaac.jamesmcfadden.co.uk/api/v1/character'
let api_boss = 'https://isaac.jamesmcfadden.co.uk/api/v1/boss?page='

let boss =  axios.get(api_boss + 1 )
let boss2 = axios.get(api_boss + 2)
let personnage = axios.get(api_char)


function getDataName (values, nbData, obj){
    for (let name of values[nbData].data.data) {
        obj.push(name.sprite_url)
    }
}

// Récupération des urls
Promise.all([boss, boss2, personnage])
.then(function (values){
    getDataName(values, 0, spritBoss.url)
    getDataName(values, 1, spritBoss.url)
    getDataName(values, 2, spritCharacter.url)
//    console.log(spritCharacter)
//    console.log(spritBoss)
    },    
)
.then(function(values){
    download(spritCharacter.url, destBoss)
    .then(result => {
        console.log('Images downloaded', result);	
    }).then(function(values){
        for(let i=0; i<10000; i++){
            //permet de vérifier si les images éxiste est les renommes à partir de 1
            fs.stat(imageChar+i+'.png', function(err,stat){
                if(err == null && compteur < 14){
                    compteur += 1
                    fs.rename(imageChar+i+'.png',imageChar+compteur+'.png')
                    console.log(compteur)
                    
                }
                
            })
        }
        
    }).then(function(values){
        for(let i = 1; i<14;i++){
        const image = require('fs').readFileSync(__dirname + '/img/characters/image_'+i+'.png')
 
    pngStringify(image, function(err, string){
        if (err) throw err;
        console.log(string);
    })
    }
})
    .catch(error => console.log("downloaded error", error))
}).catch(function(err){
    console.log(err)
})




// faire vérification pour que les images ne se dl pas si elles éxistent
// Afficher plusieurs images dans la console, à l'heure actuelle une seule (boucle for ? mais ducoup rename les images en 1,2,3,4... ?)


