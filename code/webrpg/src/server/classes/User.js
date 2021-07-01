const { Room, rooms } = require('./Room');
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
		var users = []
		for (var user of this.currentRoom.users) {
			users.push({
				...user,
				sheets: this.currentRoom.sheets[user._id].sheets.sheets
			})
		}

		this.connection.sendUTF(JSON.stringify({
			type: SM.GAME_GET_ALL_PLAYERS,
			players: users,
		}))
	}

	getChat(){
		this.connection.sendUTF(JSON.stringify({
			type: SM.GAME_GET_CHAT,
			chat: this.currentRoom.chat
		}))
	}

	getActivePlayers(){
		var active = []
		for (const player of this.currentRoom.activeUsers){
			active.push(player.id)
		}

		this.connection.sendUTF(JSON.stringify({
			type: SM.GAME_GET_ACTIVE_PLAYERS,
			active_players: active
		}))
	}

	switchRoom(roomID) {
		// wyjście z obecnego pokoju
		this.exitRoom(this);

		const sendNudes = () => {
			this.getAllPlayers()
			this.getChat()
			// this.getActivePlayers()
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

		// dołączenie do pokoju
		this.currentRoom = rooms[roomID];
		this.currentRoom.addActiveUser(this)
		
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
