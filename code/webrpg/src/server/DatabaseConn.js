const { MongoClient } = require('mongodb');

var globalClient;

/**
 * function that connects server to database
 * SHOULD BE ONLY CALLED ONCE
 */
async function dbConnect() {
	const user = process.env.DB_USER;
	const pass = process.env.DB_PASS;
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
/**
 * equivalent of simple SELECT with WHERE(SQL)
 * @param {string} collection
 * @param {JSON} querry
 */
async function dbFind(collection, querry) {
	var results;
	try {
		const cursor = await globalClient.collection(collection).find(querry);
		results = await cursor.toArray();
	} catch (e) {
		console.error(e);
	}
	return results;
}

//client -> MongoClient
//collection -> string
// insert -> JSON
/**
 * equivalent of INSERT INTO (SQL)
 * @param {string} collection
 * @param {JSON} querry
 */
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
/**
 * equivalent of UPDATE (SQL)
 * @param {string} collection
 * @param {JSON} search_querry
 * @param {JSON} update_querry
 */
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

/**
 * equivalent of complex SELECT (SQL)
 * @param {string} collection
 * @param {Array[JSON]} querry
 */
async function dbAggregate(collection, querry) {
	try {
		const cursor = await globalClient
			.collection(collection)
			.aggregate(querry);
		var results = await cursor.toArray();
	} catch (e) {
		console.error(e);
	}
	return results;
}

module.exports = {
	dbConnect: dbConnect,
	dbFind: dbFind,
	dbInsert: dbInsert,
	dbUpdate: dbUpdate,
	dbAggregate: dbAggregate,
};
