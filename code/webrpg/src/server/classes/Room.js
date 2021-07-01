const ObjectId = require('mongodb').ObjectId;
const db = require('../DatabaseConn');
const SM = require('../SocketMessages')

// const test = {
// 	gamename: '',
// 	gm: { id: 'id', username: 'username' },
// 	players: {
// 		id1: {
// 			username: 'username',
// 			charsheets: [
// 				{ name: '', text: '' },
// 				{ name: '', text: '' },
// 			],
// 		},
// 		id2: {
// 			username: 'username2',
// 			charsheets: [{ name: '', text: '' }],
// 		},
// 	},
// 	chat: [{ username: 'tekst' }, { username2: 'tekst' }],
// };

async function fetchData(id) {
    var to_return
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

    return to_return
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
		this.sheets = {}
	}

	async init() {
		await fetchData(this.id).then((data)=>{ 
            data = data[0]

            this.gamename = data.gameName;
            this.chat = data.chat;
            this.users = data.players;
            this.gm = data.gm

			// załaduj karty postaci:
			for (const user of this.users) {
				var sheet = data.characterSheets.find(x => JSON.stringify(x.player) == JSON.stringify(user._id))
				this.sheets[user._id] = {
					username: user.username,
					sheets: sheet
				}
			}

        })


	}

	sendActiveUsers(){
		for (const user of this.activeUsers){
			user.getActivePlayers();
		}
	}

	addActiveUser(user){
		this.activeUsers.push(user);

		this.sendActiveUsers();
	}

	removePlayer(user) {
		for (var i = this.activeUsers.length; i--; ) {
			if (this.activeUsers[i] === user) this.activeUsers.splice(i, 1);
		}

        // jeżeli w pokoju nie ma graczy, to wywal pokój
        if (this.activeUsers.length == 0) {
			this.saveRoom().then(()=>{
				delete rooms[this.id]
			})
		}
		else{
			this.sendActiveUsers()
		}
	}

	async saveRoom(){
		// zapisz chat
		await db.dbUpdate('games', 
			{ _id: this.id },
			{$set: {
				chat: this.chat
			}}
		)
	}

	pushChatMessage(username, message) {
		// wyślij wszystkim nową wiadomość na chacie
		for (var user of this.activeUsers) {
			user.connection.sendUTF(JSON.stringify({
				type: SM.GAME_MESSAGE_CHAT,
				username: username,
				message: message,
			}))
		}

		// zachowaj ostatnie 27 ostatnich wiadomości
		// (Pan Damian tak zarządził)
		// Tak, to moje zalecenie :) ~Pan Damian 2k21 koloryzowane
		if (this.chat.length >= 27){
			this.chat.shift()
		}

		// zapisz nową wiadomość
		this.chat.push({
			username: username,
			content: message,
		})
	}
}

module.exports = {
	Room: Room,
	rooms: rooms,
};