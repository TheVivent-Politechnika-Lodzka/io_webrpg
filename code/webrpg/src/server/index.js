const db = require('./DatabaseConn');
const SocketMessages = require('./SocketMessages');
const webSocketServer = require('websocket').server;
const http = require('http');
var ObjectId = require('mongodb').ObjectId;
const dotenv = require('dotenv');
const { User, users } = require('./classes/User');
const { room } = require('./classes/Room');
const MessageHandler = require('./messageHandling/MainHandler');
dotenv.config();

// konfiguracja
const webSocketsServerPort = process.env.SERVER_PORT;

// odpalenie websocket server
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
	httpServer: server,
});

// połączenie z bazą
db.dbConnect();

// wszystkie connections są tutaj
const clients = {};

// generator unikalnych id
const getUniqueID = () => {
	const s4 = () =>
		Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	return s4() + s4() + '-' + s4();
};

// obsługa połączeń
wsServer.on('request', function (request) {
	var userID = getUniqueID(); // stwórz id
	console.log(userID + ' connected');

	// przyjęcie połązenia i zapisanie go
	// można/trzeba będzie ogarnąć akceptowanie, żeby tylko nasi klienci mogli się podłączyć
	const connection = request.accept(null, request.origin);
	clients[userID] = connection;

	// jeżeli dostanę ciastko, to pewnie z id do auto-zalogowania
	if (request.cookies[0] && request.cookies[0].value) {
		const id = request.cookies[0].value;
		// auto-logowanie
		MessageHandler[SocketMessages.AUTO_LOGIN](
			{ id: id },
			connection,
			userID
		);
	}

	connection.on('message', function (message) {
		if (message.type !== 'utf8') return;
		const dataFromClient = JSON.parse(message.utf8Data);
		const type = dataFromClient.type;
		delete dataFromClient.type;

		// wywołaj odpowiednią funkcję do danego zapytania
		MessageHandler[type](dataFromClient, this, userID);
	});

	// obsługa zakończenia połączenia
	connection.on('close', function (connection) {
		console.log(userID + ' disconnected.');

		// tu pewnie będzie obsługa "nagłego" wychodzenia z pokoju
		
		if(users[userID]){
			users[userID].exitRoom()
		}

		// trzeba wyczyścić, bo tego pana już nie ma
		delete clients[userID];
		delete users[userID];
	});
});
