const { Room, rooms } = require('./Room');
const SM = require('../SocketMessages');

var users = {};

class User {
	// przyjmuje websocket conn oraz
	// dane z bazy
	constructor(connection, userData) {
		// połączenie websocket
		this.connection = connection;
		// dane użytkownika
		this.id = userData.id;
		this.username = userData.username;
		this.email = userData.email;
		// aktualny pokój
		this.currentRoom = null;
	}

	getSheet(id) {
		// to coś szuka karty postaci o podanym id
		// wśród kart postaci gracza
		const sheet = this.currentRoom.sheets[this.id].sheets.sheets.find(
			(x) => x.id == id
		);
		this.connection.sendUTF(
			JSON.stringify({
				type: SM.GAME_GET_SHEET,
				sheet: sheet,
			})
		);
	}

	saveSheet(sheet) {
		var same_name = true;

		// znajdź index w tablicy gdzie znajduje się karta do nadpisania
		const index = this.currentRoom.sheets[this.id].sheets.sheets.findIndex(
			(x) => x.id == sheet.id
		);
		same_name =
			this.currentRoom.sheets[this.id].sheets.sheets[index].name ==
			sheet.name;
		// nadpisz
		this.currentRoom.sheets[this.id].sheets.sheets[index] = sheet;

		// powiadom wszystkich graczy, jeżeli zmieniłeś imię postaci
		if (!same_name) {
			for (const user of this.currentRoom.activeUsers) {
				user.getAllPlayers();
			}
		}
	}

	getAllPlayers() {
		var users = [];
		// zlistuj wszystkich graczy i ich postaci
		for (var user of this.currentRoom.users) {
			var tmp = [];
			// weź tylko id i nazwy postaci z kart (content zostaw w spokoju)
			for (const sheet of this.currentRoom.sheets[user._id].sheets
				.sheets) {
				// console.log(sheet.name)
				tmp.push({
					id: sheet.id,
					name: sheet.name,
				});
			}
			users.push({
				...user,
				sheets: tmp,
			});
		}

		// wyślij ten chaos
		this.connection.sendUTF(
			JSON.stringify({
				type: SM.GAME_GET_ALL_PLAYERS,
				players: users,
			})
		);
	}

	getChat() {
		this.connection.sendUTF(
			JSON.stringify({
				type: SM.GAME_GET_CHAT,
				chat: this.currentRoom.chat,
			})
		);
	}

	getActivePlayers() {
		var active = [];
		for (const player of this.currentRoom.activeUsers) {
			active.push(player.id);
		}

		this.connection.sendUTF(
			JSON.stringify({
				type: SM.GAME_GET_ACTIVE_PLAYERS,
				active_players: active,
			})
		);
	}

	getGmId() {
		const gmId = this.currentRoom.gm._id;
		this.connection.sendUTF(
			JSON.stringify({
				type: SM.GAME_GET_GM,
				gmId: gmId,
			})
		);
	}

	switchRoom(roomID) {
		// wyjście z obecnego pokoju
		this.exitRoom(this);

		const sendNudes = () => {
			this.getAllPlayers();
			this.getChat();
			this.getGmId();
		};

		var newRoom = false;
		// przed dołączeniem do nowego pokoju
		// sprawdź czy istnieje i ew utwórz
		if (!rooms[roomID]) {
			newRoom = true;
			rooms[roomID] = new Room(roomID);
			rooms[roomID].init().then(() => {
				sendNudes();
			});
		}

		// dołączenie do pokoju
		this.currentRoom = rooms[roomID];
		this.currentRoom.addActiveUser(this);

		// wyślij info do gracza
		if (!newRoom) sendNudes();
	}

	exitRoom() {
		if (this.currentRoom == null) return;

		try {
			this.currentRoom.removePlayer(this);
		} finally {
			this.currentRoom = null;
		}
	}
}

module.exports = {
	User: User,
	users: users,
};
