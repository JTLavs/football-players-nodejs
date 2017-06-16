from pymongo import MongoClient
#name team position country league
players = [("David Silva", "Spain", "MF"),
		("Kevin De Bruyne", "Belgium", "MF"),
		("Fernandinho", "Brazil", "MF"),
		("Yaya Toure", "Ivory Coast", "MF"),
		("Sergio Aguero", "Argentina", "ST"),
		("Gabriel Jesus", "Brazil", "ST"),
		("Vincent Kompany", "Belgium", "DF"),
		("Claudio Bravo", "Chile", "GK"),
		("Raheem Sterling", "England", "MF")]

client = MongoClient('localhost', 27017)

db = client.admin
collection = db.footballPlayers

for player in players:
	goals = 0
	cleansheets = 0
	gamesplayed = 0
	team = "Manchester City"
	playerInsert = {"name" : player[0], "team" : team, "position" : player[2], "country": player[1], "league" : "Premier League", "goals" : goals, 
			  "gamesplayed" : gamesplayed, "cleansheets" : cleansheets}
	resultId  = collection.insert_one(playerInsert)
	print ("Inserted player. ID: ", resultId)
