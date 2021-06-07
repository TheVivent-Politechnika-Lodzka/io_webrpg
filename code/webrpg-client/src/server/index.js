const db = require('./DatabaseConn');
const userAuth = require('./userInteraction/userAuth');
const gameList = require('./userInteraction/gamesList');
const SocketMessages = require('./SocketMessages');
const webSocketServer = require('websocket').server;
const http = require('http');
var ObjectId = require('mongodb').ObjectId;

// konfiguracja
const webSocketsServerPort = 8000;

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
// wszyscy zalogowani użytkownicy są tutaj
// [indexy pokrywają się z indexami clients]
const users = {};

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
		// komunikacja odbywa się na utf8 - będzie może trzeba przejść na Base64
		// ale na razie jest git
		if (message.type === 'utf8') {
			const dataFromClient = JSON.parse(message.utf8Data);
			const type = dataFromClient.type;
			delete dataFromClient.type;

			// rzeczy a propos logowania
			switch (type) {
				case SocketMessages.LOGIN_ATTEMPT: // próba zalogwania
					userAuth.login(dataFromClient).then((val) => {
						console.log('User logged in');
						this.sendUTF(JSON.stringify(val));
					});
					break;
				case SocketMessages.REGISTER_ATTEMPT: // próba rejestracji
					userAuth.register(dataFromClient).then((val) => {
						console.log('User registered');
						this.sendUTF(JSON.stringify(val));
					});
					break;
			}

			// rzeczy a propos zalogowanego użytkownika
			if (users[userID] === undefined) {
				return;
			} // przejdzie dalej, tylko jeżeli użytkownik jest zalogowany

			switch (type) {
				case SocketMessages.GET_GAMES: // pobranie gier
					gameList.getGames(users[userID]).then((val) => {
						console.log('user loaded games list');
						this.sendUTF(JSON.stringify(val));
					});
					break;
			}
		}
	});

	// obsługa zakończenia połączenia
	connection.on('close', function (connection) {
		console.log(userID + ' disconnected.');

		// tu pewnie będzie obsługa "nagłego" wychodzenia z pokoju

		// trzeba wyczyścić, bo tego pana już nie ma
		delete clients[userID];
		delete users[userID];
	});
});
