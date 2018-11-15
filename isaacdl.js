//  npm install --save image-downloader pour const download
// npm install images-downloader --save
//npm install --save console-png

const program = require('commander');
const axios = require('axios');
// pour dl les images
const download = require('images-downloader').images
//pour afficher les images dans la console
const pngStringify = require('console-png')
const fs = require('fs')
const resizeImage = require('resize-image')


program
  .version('0.1.0')
  .option('init', 'Télécharge les images')
  .option('sprites', '--characters-sprites', 'Affiche les sprites des personnages')
  .parse(process.argv);

  if(program.init) init();
  if(program.sprites) sprites();

  // Init
/* option pour dl, essayer de mettre le tableau de sprites
créer le même chemin dans ton dossier ou tu mets le scripts img/characters et img/boss pour save les images
 on stocke les url ici*/

let spritCharacter = {
    url : []
}

let spritBoss = {
    url: []
}

let compteur = 0
const destChar = './img/boss'
const destBoss = './img/characters'







function getDataName (values, nbData, obj){
    for (let name of values[nbData].data.data) {
        obj.push(name.sprite_url)
    }
}

function init(){
	downloadsprites(rename)
	console.log('1')
}
function downloadsprites (callback1,callback2){

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
		return download(spritCharacter.url, destBoss)

	})
	
	.then(result => {
		console.log('Images downloaded', result);	
		callback1(result)
		callback2
	})

}

function rename(object){
	let imageChar = __dirname +'/img/characters/image_'
	console.log('début rename')
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
/*	.then(function(values){
		
		
	})*/



function sprites(){
	for(let i = 0; i<13;i++){
        const image = require('fs').readFileSync(__dirname + '/img/characters/image_'+i+'.png')

        pngStringify(image, function(err, string){
            if (err) throw err;
            console.log(string);
        })
    }

}

function resize(){
let img = new Image()


img.onload= function () {
  let data = resizeImage.resize(img, 200, 100, resizeImage.PNG);
  console.log(data);
};
for(let i = 0; i<13;i++){
	const image = require('fs').readFileSync(__dirname + '/img/characters/image_'+i+'.png')
	img.src = image;
}
}



// Récupération des urls





// faire vérification pour que les images ne se dl pas si elles éxistent
// Afficher plusieurs images dans la console, à l'heure actuelle une seule (boucle for ? mais ducoup rename les images en 1,2,3,4... ?)


