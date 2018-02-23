const express = require('express');
const app = express();
app.use(express.static("public"));

const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs'); // générateur de template 
	


app.get('/', (req, res) => {console.log('la route route get / = ' + req.url)

	let cursor = db.collection('adresse').find().toArray((err, resultat)=>{
 	if (err) return console.log(err)
 		//console.log(resultat)
 		 res.render('index.ejs', {adresses: resultat, cle:"" ,ordre:"asc" })

  	}) 
})	

let db;

MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	 if (err) return console.log(err)
	 db = database.db('carnet_adresse')
	// lancement du serveur Express sur le port 8081
	 app.listen(8081, () => {
	 	console.log('connexion à la BD et on écoute sur le port 8081')
	 })
})



app.post('/ajouter', (req, res) => {
 db.collection('adresse').save(req.body, (err, result) => {
	 if (err) return console.log(err)
		 console.log('sauvegarder dans la BD')
		 res.redirect('/')
	 })
})


app.get('/detruire/:id', (req, res) => {

let id = req.params.id;
let critere = ObjectID(req.params.id);//console.log(critere)console.log(id)

	db.collection('adresse').findOneAndDelete({
		//_id réfère à l'objet présent dans adr
		"_id": ObjectID(req.params.id)}, (err, resultat) => {

	if (err) return console.log(err)
		res.redirect('/')
	})
})



app.get('/trier-:cle-:ordre', (req, res) => {

	let cle = req.params.cle;
	let ordre = (req.params.ordre == 'asc' ? 1 : -1);
	let ordreModuler;
	let cursor = db.collection('adresse').find().sort(cle,ordre).toArray((err, resultat)=>{ 
		ordreModuler = (req.params.ordre == 'asc' ? "desc" : "asc");

		console.log(req.params.ordre)
 		res.render('fonction.ejs', 
 			{
 				adresses: resultat, 
 				cle:cle, 
 				ordre:ordreModuler
 			})
 		
 		
	})
})


/*
app.post('/modifier', (req, res) => {
		console.log('req.body' + req.body)
		if (req.body['_id'] != __________)
		{ 
			console.log('sauvegarde') 
			let oModif = {
			"_id": ObjectID(req.body['_id']), 
			nom: req.body._____,
			prenom:req.body.______, 
			telephone:req.body._______,
			courriel:req.body.______
		}

		let util = require("util");
			console.log('util = ' + util.inspect(oModif));
		}else{

		console.log('insert')
		console.log(req.body)
		
		let oModif = {
			nom: req.body.______,
			prenom:req.body.______, 
			telephone:req.body._______
		}

		 db.collection('adresse').save(oModif, (err, result) => {
	 if (err) return console.log(err)
	 console.log('sauvegarder dans la BD')
	 res.redirect('/list')
 })
	 }
})*/

