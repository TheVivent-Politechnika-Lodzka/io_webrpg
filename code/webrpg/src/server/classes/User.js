const { rooms, Room } = require('./Room');
const SM = require('../SocketMessages')

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

	getAllPlayers(){
		this.connection.sendUTF(JSON.stringify({
			type: SM.GAME_GET_ALL_PLAYERS,
			users: this.currentRoom.usersANDsheets
		}))
	}

	getChat(){
		this.connection.sendUTF(JSON.stringify({
			type: SM.GAME_GET_CHAT,
			users: this.currentRoom.chat
		}))
	}

	switchRoom(roomID) {
		// wyjście z obecnego pokoju
		this.exitRoom(this);

		const sendNudes = () => {
			this.getAllPlayers()
			this.getChat()
		}
		
		var newRoom = false;
		// przed dołączeniem do nowego pokoju
		// sprawdź czy istnieje i ew utwórz
		if (!rooms[roomID]) {
			newRoom = true
			rooms[roomID] = new Room(roomID);
			rooms[roomID].init().then(()=>{
				sendNudes()
			});
		}

		if (!newRoom) {
			sendNudes();
		}

		// dołączenie do pokoju
		this.currentRoom = rooms[roomID];
		this.currentRoom.activeUsers.push(this);

	}

	exitRoom() {
		if (this.currentRoom == null) return;

		try {
			this.currentRoom.exitRoom(this);
		} finally {
			this.currentRoom = null;
		}

	}
}

module.exports = {
	User: User,
	users: users,
};
