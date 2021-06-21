const { rooms, Room } = require('./Room');

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

	switchRoom(roomID) {
		// wyjście z obecnego pokoju
		this.exitRoom(this);

		// przed dołączeniem do nowego pokoju
		// sprawdź czy istnieje i ew utwórz
		if (!rooms[roomID]) {
			rooms[roomID] = new Room(roomID);
			rooms[roomID].init();
		}

		// dołączenie do pokoju
		this.currentRoom = rooms[roomID];
		this.currentRoom.activeUsers.push(this);

	}

	exitRoom() {
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
