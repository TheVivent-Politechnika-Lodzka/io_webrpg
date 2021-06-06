const { MongoClient } = require('mongodb');

var globalClient;

async function dbConnect() {
	const user = 'App';
	const pass = 'lcgVMoJseuoZL8bn';
	const uri =
		'mongodb+srv://' +
		user +
		':' +
		pass +
		'@webrpg.dd0ee.mongodb.net/webRPG_db?retryWrites=true&w=majority';

	var client = new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	try {
		// Connect to the MongoDB cluster
		await client.connect();
	} catch (e) {
		console.error(e);
	}

	globalClient = client.db('webRPG_db');
}

//client -> MongoClient
//collection -> string
// querry -> MQL querry (JSON based, can be empty?)
async function dbFind(collection, querry) {
	try {
		const cursor = globalClient.collection(collection).find(querry);
		var results = await cursor.toArray();
	} catch (e) {
		console.error(e);
	}
	return results;
}

//client -> MongoClient
//collection -> string
// insert -> JSON
async function dbInsert(collection, insert) {
	//await listDatabases(client)

	try {
		var result = await globalClient
			.collection(collection)
			.insertOne(insert);
	} catch (e) {
		console.error(e);
	}
	return result;
}

//client -> MongoClient
//collection -> string
// updateSearchQuerry -> MQL querry (JSON based)
// updateStatement -> MQL querry ({$set : {field : value}})
async function dbUpdate(collection, updateSearchQuerry, updateStatement) {
	try {
		var result = await globalClient
			.collection(collection)
			.updateMany(updateSearchQuerry, updateStatement);
	} catch (e) {
		console.error(e);
	}
	return result;
}

// dbConnect();
module.exports = {
	dbConnect: dbConnect,
	dbFind: dbFind,
	dbInsert: dbInsert,
	dbUpdate: dbUpdate,
};
