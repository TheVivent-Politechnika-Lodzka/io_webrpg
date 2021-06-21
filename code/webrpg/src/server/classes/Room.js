const ObjectId = require('mongodb').ObjectId;
const db = require('../DatabaseConn');

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
		// proste dane (id, nazwa, itp)
		this.id = ObjectId(roomID);
		this.gamename;
        this.gm;
		// chat
		this.chat = []; //lista push musi dbać o maksymalny rozmiar chatu (50 ostatnich wpisów?)

		// lista graczy
		this.activeUsers = [];
		this.usersANDsheets = {};
	}

	init() {
		fetchData(this.id).then((data)=>{
            data = data[0]

            this.gamename = data.gameName;
            this.chat = data.chat;
            this.usersANDsheets = data.players;
            this.gm = data.gm

            // console.log("gamename: " + this.gamename)
            // console.log("chat:")
            // console.log(this.chat)
            // console.log("gm:")
            // console.log(this.gm)
            
            // # to nie jest gitara:
            // console.log("usersANDsheets:")
            // console.log(this.usersANDsheets)
        })


	}

	exitRoom(user) {
		for (var i = this.activeUsers.length; i--; ) {
			if (this.activeUsers[i] === user) this.activeUsers.splice(i, 1);
		}

        // jeżeli w pokoju nie ma graczy, to wywal pokój
        if (this.activeUsers.length == 0) {
			delete rooms[this.id]
		}
	}
}

module.exports = {
	Room: Room,
	rooms: rooms,
};

