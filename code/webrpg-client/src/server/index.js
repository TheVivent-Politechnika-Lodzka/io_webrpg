const db = require('./DatabaseConn');
var ObjectId = require('mongodb').ObjectId;
const userAuth = require('./userInteraction/userAuth');
const gameList = require('./userInteraction/gamesList');
const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
	httpServer: server,
});

db.dbConnect();

// const db = databaseConn.dbConnect()
const SocketMessages = require('./SocketMessages');

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const users = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];

// Generates unique ID for every new connection
const getUniqueID = () => {
	const s4 = () =>
		Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	return s4() + s4() + '-' + s4();
};

const sendMessage = (json) => {
	// We are sending the current data to all connected clients
	Object.keys(clients).map((client) => {
		clients[client].sendUTF(json);
	});
};

wsServer.on('request', function (request) {
	var userID = getUniqueID();
	console.log(userID + ' connected');
	// You can rewrite this part of the code to accept only the requests from allowed origin
	const connection = request.accept(null, request.origin);
	clients[userID] = connection;

	if (request.cookies[0]) {
		const id = request.cookies[0].value;
		db.dbFind('users', { _id: ObjectId(id) }).then((res) => {
			const { _id, username, email } = res[0];
			users[userID] = {
				id: _id,
				username: username,
				email: email,
			};

			connection.sendUTF(
				JSON.stringify({
					type: SocketMessages.AUTO_LOGIN,
					logged: true,
					...users[userID],
				})
			);
		});
	}

	connection.on('message', function (message) {
		if (message.type === 'utf8') {
			const dataFromClient = JSON.parse(message.utf8Data);
			const type = dataFromClient.type;
			delete dataFromClient.type;

			// rzeczy a propos logowania
			switch (type) {
				case SocketMessages.LOGIN_ATTEMPT:
					userAuth.login(dataFromClient).then((val) => {
						console.log('User logged in');
						this.sendUTF(JSON.stringify(val));
					});
					break;
				case SocketMessages.REGISTER_ATTEMPT:
					userAuth.register(dataFromClient).then((val) => {
						console.log('User registered');
						this.sendUTF(JSON.stringify(val));
					});
					break;
			}

			// rzeczy a propos zalogowanego użytkownika
			if (users[userID] === undefined) {
				return
			} // przejdzie dalej, tylko jeżeli użytkownik jest zalogowany
			
			switch (type) {
				case SocketMessages.GET_GAMES:
					gameList.getGames(dataFromClient).then((val) => {
						console.log('user loaded games list');
						// console.log(val)
						this.sendUTF(JSON.stringify(val));
					});
					break;
			}
		}
	});

	// user disconnected
	connection.on('close', function (connection) {
		console.log(userID + ' disconnected.');
		// const json = { type: typesDef.USER_EVENT };
		// userActivity.push(`${users[userID].username} left the document`);
		// json.data = { users, userActivity };
		delete clients[userID];
		delete users[userID];
		// sendMessage(JSON.stringify(json));
	});
});
