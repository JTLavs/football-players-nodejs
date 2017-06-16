var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var assert = require("assert")
var express = require("express")
var path = require("path")
var bodyParser = require("body-parser")

var app = express();
var port = 3700;
var mongoLink = 'mongodb://localhost:27017'

app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug')

MongoClient.connect(mongoLink, (err, database) => {
	if(err) return console.log(err)
	db = database
	app.listen(port, () => {
		console.log("Listening on port 3700..")
	})
})

app.get('/create-collection', (req,res) =>{
	db.createCollection('footballPlayers', function(err, result){
		if(err) return console.log(err)
		console.log('Collection created')
	})
})
app.get('/matches', (req,res)=>{
	res.redirect('/matches/1')
})

app.get('/' , (req, res) => {
	res.redirect('/matches/1')
});
app.get('/players' , (req, res) => {
	db.collection('footballPlayers').find().sort({'goals': -1}).toArray(function (err, result){
	if(err) return console.log(err)
	res.render('index.pug', {'footballPlayers' : result})
	})
});
app.get('/player/:id' , (req, res) => {
	console.log(req.params)
	var id = new ObjectId(req.params.id)
	console.log(req.query.id)
	db.collection('footballPlayers').find({'_id' : id}).toArray(function (err, result){
	if(err) return console.log(err)
	console.log(result)
	res.render('player.pug', {'thePlayer' : result[0]})
	})
});
app.get('/goal/:id/:action', (req, res)=>{
	var id = new ObjectId(req.params.id)
	var action = req.params.action
	
	if(action == 'a')
		db.collection('footballPlayers').update(
			{'_id': id}, { $inc : {'goals' : 1}}, (err)=>{
				if (err) return console.log(err)
				
			})
	if(action== 's')
		db.collection('footballPlayers').update(
			{'_id': id}, { $inc : {'goals' : -1}}, (err)=>{
				if (err) return console.log(err)	
			})
	res.redirect('/view/'+id)
})
app.get('/match/:week/g/:team/:id', (req, res)=>{
	var team = req.params.team
	var week = req.params.week
	var id = new ObjectId(req.params.id)
	if(team == 'a'){
		db.collection('footballMatches').update(
		{'_id': id}, { $inc : {'awaygls' : 1}}, (err)=>{
				if (err) return console.log(err)	
	})
	}
	if(team == 'h'){
		console.log('homegoal')
		db.collection('footballMatches').update(
			{'_id': id}, { $inc : {'homegls' : 1}}, (err)=>{
				if (err) return console.log(err)	
		})
	}
	res.redirect('/matches/'+week)
})

app.get('/match/:week/ft/:id', (req, res)=>{
	var id = new ObjectId(req.params.id)
	var week = req.params.week
	db.collection('footballMatches').update(
		{'_id': id}, {$set : {'done' : 'Y'}}, (err)=>{
			if (err) return console.log(err)		
		})
	res.redirect('/matches/'+week)
})

app.get('/delete/:id', (req, res)=>{
	var id = new ObjectId(req.params.id)
	db.collection('footballPlayers').remove({'_id': id}, (err, result) => {
		if (err) return console.log(err)
		res.redirect('/')
	})
});
app.post('/add', (req, res)=>{
	req.body.goals = 0;
	req.body.gamesplayed = 0;
	req.body.cleansheets = 0;
	db.collection('footballPlayers').save(req.body, (err, result) => {
		if (err) return console.log(err)
		res.redirect('/')
	})
});

app.get('/matches/:week',(req, res)=>{
	var week = (req.params.week-0)
	var nextWeek = week + 1
	var previousWeek = week - 1
	db.collection('footballMatches').find({'matchweek' : week}).toArray(function (err, result){
	if(err) return console.log(err)
	console.log(week)
	res.render('matches.pug', {'FootballMatches' : result, 'nextweek' : nextWeek, 'previousweek' : previousWeek})
	})
})
app.get('/team', (req, res)=>{
	if(req.query.team == 'all'){
			res.redirect('/');
	}else
	{
		db.collection('footballPlayers').find({'team' : req.query.team}).toArray(function (err, result){
		res.render('index.pug', {footballPlayers : result});
		})
	}
});
