const db = require('./DatabaseConn');
const userAuth = require('./userInteraction/userAuth');
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

const typesDef = {
	USER_EVENT: 'userevent',
	CONTENT_CHANGE: 'contentchange',
};

wsServer.on('request', function (request) {
	var userID = getUniqueID();
	console.log(
		userID + 'connected'
		// new Date() +
		// 	' Recieved a new connection from origin ' +
		// 	request.origin +
		// 	'.'
	);
	// You can rewrite this part of the code to accept only the requests from allowed origin
	const connection = request.accept(null, request.origin);
	clients[userID] = connection;
	// console.log(
	// 	'connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients)
	// );
	// sendMessage('cześć, to wiadomość z serwera');

	connection.on('message', function (message) {
		if (message.type === 'utf8') {
			const dataFromClient = JSON.parse(message.utf8Data);
			const type = dataFromClient.type;
			delete dataFromClient.type;

			switch (type) {
				case SocketMessages.LOGIN_ATTEMPT:
					userAuth.login(dataFromClient).then((val) => {
						this.sendUTF(JSON.stringify(val));
					});
					break;
				case SocketMessages.REGISTER_ATTEMPT:
					userAuth.register(dataFromClient).then((val) => {
						this.sendUTF(JSON.stringify(val));
					});
					break;
			}

			// if (dataFromClient.type === SocketMessages.REGISTER_ATTEMPT) {
			// 	let email = dataFromClient.email;
			// 	let password = dataFromClient.password;
			// 	let name = dataFromClient.name;
			// 	console.log(`rejestracja = ${name} - ${email} : ${password}`);

			// 	// db.dbFind('users', {_id: 1}).then((val) => console.log(val))

			// 	db.dbInsert('users', {
			// 		_id: 3,
			// 		username: name,
			// 		email: email,
			// 		passwordHash: password,
			// 	});

			// 	this.sendUTF(
			// 		JSON.stringify({
			// 			type: SocketMessages.REGISTER_ATTEMPT_RESULT,
			// 			logged: true,
			// 			name: email,
			// 			id: password,
			// 		})
			// 	);
			// }
			// const json = { type: dataFromClient.type };
			// if (dataFromClient.type === typesDef.USER_EVENT) {
			// 	users[userID] = dataFromClient;
			// 	userActivity.push(
			// 		`${dataFromClient.username} joined to edit the document`
			// 	);
			// 	json.data = { users, userActivity };
			// } else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
			// 	editorContent = dataFromClient.content;
			// 	json.data = { editorContent, userActivity };
			// }
			// sendMessage(JSON.stringify(json));
		}
	});

	// user disconnected
	connection.on('close', function (connection) {
		console.log(new Date() + ' Peer ' + userID + ' disconnected.');
		// const json = { type: typesDef.USER_EVENT };
		// userActivity.push(`${users[userID].username} left the document`);
		// json.data = { users, userActivity };
		delete clients[userID];
		delete users[userID];
		// sendMessage(JSON.stringify(json));
	});
});
