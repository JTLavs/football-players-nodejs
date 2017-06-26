from pymongo import MongoClient
#name country position
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

team = "Manchester City"
for player in players:

	playerInsert = {"name" : player[0], "team" : team, "position" : player[2], "country": player[1], "league" : "Premier League", "goals" : 0, 
			  "gamesplayed" : 0, "cleansheets" : 0, "00_15" : 0, "16_30" : 0, "31_45" : 0, "46_60" : 0, "61_75" : 0, "76_90" : 0, "headers" : 0,
			  "pens" : 0, "leftfoot" : 0, "rightfoot" : 0}
	resultId  = collection.insert_one(playerInsert)
	print ("Inserted player. ID: ", resultId)
