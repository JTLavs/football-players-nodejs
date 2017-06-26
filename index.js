var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
var assert = require("assert")
var express = require("express")
var path = require("path")
var bodyParser = require("body-parser")

var app = express();
var port = 3700;
var mongoLink = 'mongodb://localhost:27017'
var weeksOne = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
var weeksTwo = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38]
var countriesOne = ["England", "Scotland", "Wales", "N.Ireland", "R.Of Ireland", "France", "Germany", "Belgium", "Spain",
                "Portugal", "Italy", "Switzerland", "USA", "Chile", "Argentina", "Brazil", "Russia", "Austria", "Poland",
				"Netherlands"]
var countriesTwo =	["Ivory Coast", "Denmark", "Japan", "China", "Australia", "South Korea", "Armenia", "Turkey", 
				"Israel", "Slovakia", "Slovenia", "Ukraine"]

app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug')

MongoClient.connect(mongoLink, (err, database) => {
	if(err) return console.log(err)
	db = database
	app.listen(port, () => {
		console.log("<<<<<<<<< Server started. Listening on port 3700")
	})
})

app.get('/create-collection', (req,res) =>{
	db.createCollection('footballPlayers', function(err, result){
		if(err) return console.log(err)
		console.log('<<<<<<<<<<< Collection created')
	})
})
app.get('/matches', (req,res)=>{
	console.log('<<<<<<<<<<< Redirecting from matches to matches/1')
	res.redirect('/matches/1')
})

app.get('/' , (req, res) => {
	console.log('<<<<<<<<<<< Redirecting from / to matches/1')
	res.redirect('/matches/1')
});
app.get('/players' , (req, res) => {
	console.log('<<<<<<<<<<< Redirecting from /players to players/Arsenal')
	res.redirect('/players/Arsenal')
});
app.get('/player/:id' , (req, res) => {
	console.log(req.params)
	var id = new ObjectId(req.params.id)
	db.collection('footballPlayers').find({'_id' : id}).toArray(function (err, result){
	if(err) return console.log(err)
	res.render('player.pug', {'thePlayer' : result[0]})
	})
});
app.get('/goal/:id/:action/:type', (req, res)=>{
	var id = new ObjectId(req.params.id)
	var type = req.params.type
	var action = req.params.action
	
	if(action == 'a')
		//dont want goals to increase for minute type or penalties as would mean inaccurate total
		if(type.indexOf('_') != -1 || type == 'pens')
		    db.collection('footballPlayers').update(
			    {'_id': id}, { $inc : {type : 1}}, (err)=>{
				    if (err) return console.log(err)
			    })
		else
		    db.collection('footballPlayers').update(
			    {'_id': id}, { $inc : {'goals' : 1, type : 1}}, (err)=>{
				    if (err) return console.log(err)		
			    })

	if(action == 's')
		//dont want goals to decrease for minute type or penalties as would mean inaccurate total
		if(type.indexOf('_') != -1 || type == 'pens')
		    db.collection('footballPlayers').update(
			    {'_id': id}, { $inc : {type : -1}}, (err)=>{
				    if (err) return console.log(err)
			    })
		else
		    db.collection('footballPlayers').update(
			    {'_id': id}, { $inc : {'goals' : -1, type : -1}}, (err)=>{
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
	console.log("<<<<<<<<<<<<<<< Getting week "+ week)
	res.render('matches.pug', {'FootballMatches' : result, 'nextweek' : nextWeek, 'previousweek' : previousWeek,
		'weeksOne' : weeksOne, 'weeksTwo' : weeksTwo, 'countriesOne' : countriesOne, 'countriesTwo': countriesTwo})
	})
})
app.get('/players/:team', (req, res)=>{
	var exactTeam = req.params.team.replace('-', ' ')
	console.log("<<<<<<<<<<< Getting players for "+exactTeam)
	db.collection('footballPlayers').find({'team' : exactTeam}).toArray(function (err, result){
		res.render('players.pug', 
		            {footballPlayers : result, 'weeksOne' : weeksOne, 'weeksTwo' : weeksTwo,
		             'countriesOne' : countriesOne, 'countriesTwo': countriesTwo, 'team' : exactTeam}
				  )
	})
});
