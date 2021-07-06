const ObjectId = require('mongodb').ObjectId;
const db = require('../DatabaseConn');
const SM = require('../SocketMessages');
const defaultSheet = require('../messageHandling/sheet');

async function fetchData(id) {
	var to_return;
	await db
		.dbAggregate('games', [
			{
				$match: {
					_id: { $eq: id },
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'gmID',
					foreignField: '_id',
					as: 'gm',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'playerIDs',
					foreignField: '_id',
					as: 'players',
				},
			},
			{
				$project: {
					_id: 1,
					gameName: 1,
					gm: {
						_id: 1,
						username: 1,
					},
					chat: 1,
					players: {
						_id: 1,
						username: 1,
					},
					characterSheets: 1,
				},
			},
		])
		.then((res) => {
			to_return = res;
		});

	return to_return;
}

var rooms = {};

class Room {
	constructor(roomID) {
		// this.removePlayer = this.removePlayer.bind(this);

		// proste dane (id, nazwa, itp)
		this.id = ObjectId(roomID);
		this.gamename;
		this.gm;
		// chat
		this.chat = []; //lista push musi dbać o maksymalny rozmiar chatu (50 ostatnich wpisów?)

		// lista graczy
		this.activeUsers = [];
		this.users = [];

		// gracze i ich karty postaci:
		this.sheets = {};
	}

	async init() {
		await fetchData(this.id).then((data) => {
			data = data[0];

			this.gamename = data.gameName;
			this.chat = data.chat;
			this.users = data.players;
			this.gm = data.gm[0];

			// załaduj karty postaci:
			for (const user of this.users) {
				var sheet = data.characterSheets.find(
					(x) => JSON.stringify(x.player) == JSON.stringify(user._id)
				);
				this.sheets[user._id] = {
					username: user.username,
					sheets: sheet,
				};
			}
		});
	}

	getSheet(userID, sheetID) {
		const sheet = this.sheets[userID].sheets.sheets.find(
			(x) => JSON.stringify(x.id) == sheetID
		);

		return sheet;
	}

	saveSheet(userID, sheet) {
		var same_name = true;

		// znajdź index w tablicy gdzie znajduje się karta do nadpisania
		const index = this.sheets[userID].sheets.sheets.findIndex(
			(x) => x.id == sheet.id
		);

		// jeżeli próba zapisu karty postaci której już nie ma
		if (index == -1) {
			return;
		}

		same_name = this.sheets[userID].sheets.sheets[index].name == sheet.name;
		// nadpisz
		this.sheets[userID].sheets.sheets[index] = sheet;

		// powiadom wszystkich graczy, jeżeli zmieniłeś imię postaci
		if (!same_name) {
			for (const user of this.activeUsers) {
				user.getAllPlayers();
			}
		}
	}

	addSheet(userID) {
		var highestId = 0;
		var sheets = this.sheets[userID].sheets.sheets;
		for (const sheet of sheets) {
			if (sheet.id > highestId) highestId = sheet.id;
		}
		sheets.push({
			id: ++highestId,
			name: 'empty',
			content: defaultSheet,
		});

		for (const user of this.activeUsers) {
			user.getAllPlayers();
		}
	}

	deleteSheet(userID, sheetID) {
		for (var i = this.sheets[userID].sheets.sheets.length; i--; ) {
			if (this.sheets[userID].sheets.sheets[i].id === sheetID) {
				this.sheets[userID].sheets.sheets.splice(i, 1);
				break;
			}
		}

		for (const user of this.activeUsers) {
			user.getAllPlayers();
		}
	}

	sendActiveUsers() {
		for (const user of this.activeUsers) {
			user.getActivePlayers();
		}
	}

	addActiveUser(user) {
		this.activeUsers.push(user);

		this.sendActiveUsers();
	}

	removePlayer(user) {
		for (var i = this.activeUsers.length; i--; ) {
			if (this.activeUsers[i] === user) this.activeUsers.splice(i, 1);
		}

		// jeżeli w pokoju nie ma graczy, to wywal pokój
		if (this.activeUsers.length == 0) {
			this.saveRoom().then(() => {
				delete rooms[this.id];
			});
		} else {
			this.sendActiveUsers();
		}
	}

	async saveRoom() {
		var tmp = [];
		for (const user of this.users) {
			const sheets = this.sheets[user._id].sheets.sheets;
			tmp.push({
				player: user._id,
				sheets: sheets,
			});
		}

		// zapisz pokój
		await db.dbUpdate(
			'games',
			{ _id: this.id },
			{
				$set: {
					chat: this.chat,
					characterSheets: tmp,
				},
			}
		);
	}

	pushChatMessage(username, message) {
		// wyślij wszystkim nową wiadomość na chacie
		for (var user of this.activeUsers) {
			user.connection.sendUTF(
				JSON.stringify({
					type: SM.GAME_MESSAGE_CHAT,
					username: username,
					message: message,
				})
			);
		}

		// zachowaj ostatnie 27 ostatnich wiadomości
		// (Pan Damian tak zarządził)
		// Tak, to moje zalecenie :) ~Pan Damian 2k21 koloryzowane
		if (this.chat.length >= 27) {
			this.chat.shift();
		}

		// zapisz nową wiadomość
		this.chat.push({
			username: username,
			content: message,
		});
	}
}

module.exports = {
	Room: Room,
	rooms: rooms,
};
