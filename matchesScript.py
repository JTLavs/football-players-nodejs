from pymongo import MongoClient
import pymongo
#name team position country league
decision = raw_input('Do you want to delete?')
print pymongo.version
matches = [("Arsenal", "Leicester"),
		("Brighton", "Manchester City"),
		("Chelsea", "Burnley"),
		("Crystal Palace", "Huddersfield"),
		("Everton", "Stoke"),
		("Manchester United", "West Ham"),
		("Newcastle", "Tottenham Hotspur"),
		("Southampton", "Swansea"),
		("Watford", "Liverpool"),
		("West Brom", "Bournemouth")]

client = MongoClient('localhost', 27017)

db = client.admin
collection = db.footballMatches

if decision == 'y':
	collection.delete_many({})
	print("Collection erased")
else:
	for match in matches:
		matchInsert = {"hometeam" : match[0], "awayteam" : match[1], "homegls" : 0, "awaygls": 0, "matchweek" : 1, 'done' : 'N'}
		resultId  = collection.insert_one(matchInsert)
		print ("Inserted match. ID: ", resultId)
