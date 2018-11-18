# TPISAAC


Nous avions pour projet en cours de NodeJS de créer un script nous permettant de récupérer des informations à partir d'une API et de proposer un certain nombre de fonctionnalité grâce aux données récupérées, tout ça ce passe dans un terminal.

Notre script (isaac.js) récupère les données de l'API du jeu The Binding of Isaac (https://bindingofisaac.docs.apiary.io/). Mais cette API est très peu fourni et les données sont souvent pas reliées.

Avant de pouvoir être lancé, ce script nécessite l'installation de plusieurs modules :
Path : npm install --save path
Commander : npm install commander --save
Sqlite3 : npm install sqlite3
Axios : npm install axios
Inquirer : npm install inquirer
File-system : npm install file-system --save
Images-Downloader :  npm install images-downloader --save
Console-png : npm install -g console-png
Rimraf : npm install rimraf

Nous lui avons donné plusieurs fonctionnalités. Lorsqu'on lance le script (node isaac.js) il faudra ajouter derrière un -h pour voir la liste des fonctionnalités, mais nous la postons aussi ici.
-I : Initialise les bases de données, crée des répertoires et télécharge les sprites à l'interieur.
-C : Montre la liste des personnages.
-c : Amène vers la selection d'un personnage et affiche le          sprite du personnage en question.
-B : Montre la liste des boss.
-U : Supprime la base de données.
-T : Supprime les répertoires créés.
-S : Affiche le sprite de tous les personnages.
