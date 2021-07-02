
const db = require('../DatabaseConn');
const SocketMessages = require('../SocketMessages');
const SM = SocketMessages;
const { users, User } = require('../classes/User');
const sha256 = require('crypto-js/sha256'); //import do szyfrowania
const Base64 = require('crypto-js/enc-base64'); //import do kodowania
const ObjectId = require('mongodb').ObjectId;
const sheet = require('./sheet')

function hashPassword(passwd) {
	return Base64.stringify(sha256(passwd));
}

const MessageHandler = {};

// rejestracja nowych meesagów wygląda tak:
// MessageHandler[SM.<typ_message'a>] = async (data, conn, userID) => {}
// async jest bardzo ważny !!!
// w funkcji można zrobić wszystko normalnie jak się chce


// ############################
// # userAuthController       #
// ############################
MessageHandler[SM.LOGIN_ATTEMPT] = async (data, conn, userID) => {
	const email = data.email;
	const password = hashPassword(data.password);

	db.dbFind('users', { email: email }).then((val) => {
		val = val[0];
		if (val.passwordHash == password) {
			delete val.passwordHash;
			val = {
				type: SM.LOGIN_ATTEMPT_RESULT,
				logged: true,
				id: val._id,
				username: val.username,
				email: val.email,
			};
			console.log('User logged');
			users[userID] = new User(conn, val);
			conn.sendUTF(JSON.stringify(val));
		} else {
			conn.sendUTF(
				JSON.stringify({
					type: SM.LOGIN_ATTEMPT_RESULT,
					logged: false,
				})
			);
		}
	});
};

MessageHandler[SM.REGISTER_ATTEMPT] = async (data, conn, userID) => {
	const { email, name } = data;
	const password = hashPassword(data.password);

	db.dbFind('users', { email: email }).then((val) => {
		// jeżeli użytkownik nie istnieje w bazie
		if (!val.length) {
			db.dbInsert('users', {
				username: name,
				email: email,
				passwordHash: password,
			}).then((val2) => {
				data = val2.ops[0];
				data = {
					type: SM.REGISTER_ATTEMPT_RESULT,
					logged: true,
					id: data._id,
					username: data.username,
					email: data.email,
				};
				console.log('User registered');
				users[userID] = new User(conn, data);
				conn.sendUTF(JSON.stringify(data));
			});
		}
		// jeżeli użytkownik jest już zarejestrowany
		else {
			conn.sendUTF(
				JSON.stringify({
					type: SM.REGISTER_ATTEMPT_RESULT,
					logged: false,
					email: 'exists',
				})
			);
		}
	});
};

// ############################
// # gamesListController      #
// ############################
MessageHandler[SM.GET_GAMES] = async (data, conn, userID) => {
	const user = users[userID];

	db.dbAggregate('games', [
		{ $match: { playerIDs: { $elemMatch: { $eq: user.id } } } },
		{
			// zamień id gma na usera
			$lookup: {
				from: 'users',
				localField: 'gmID',
				foreignField: '_id',
				as: 'gm',
			},
		},
		{
			// zamień id graczy na userów
			$lookup: {
				from: 'users',
				localField: 'playerIDs',
				foreignField: '_id',
				as: 'players',
			},
		},
		{
			// filtruj, żeby tylko potrzebne pola były zwrócone
			$project: {
				_id: 1,
				gameName: 1,
				'gm._id': 1,
				'gm.username': 1,
				'players._id': 1,
				'players.username': 1,
			},
		},
		{
			// wywal żeby gm nie był w tablicy
			$unwind: '$gm',
		},
	]).then((res) => {
		console.log('user listed games');
		conn.sendUTF(
			JSON.stringify({
				type: SM.GET_GAMES_RESULT,
				games: res,
			})
		);
	});
};

MessageHandler[SM.GAMES_JOIN] = async (data, conn, userID) => {
	const user = users[userID];
	const gameCode = data.code;

	db.dbUpdate(
		'games',
		{ _id: ObjectId(gameCode) }, // znajdź grę
		{ $push: {
			playerIDs: user.id,
			characterSheets: {
				player: user.id,
				sheets: [
					{
						id: 0,
						name: "empty",
						content: sheet,
					}
				]
			}
			}
		} // dołącz gracza
	).then(() => {
		conn.sendUTF(
			JSON.stringify({
				type: SM.GAMES_REFRESH,
			})
		);
	});
};

MessageHandler[SM.GAMES_CREATE] = async (data, conn, userID) => {
	const user = users[userID];
	const gameName = data.name;

	db.dbInsert('games', {
		gameName: gameName,
		gmID: user.id,
		playerIDs: [user.id],
		characterSheets: [{
			player: user.id,
			sheets: [
				{
					id: 0,
					name: "empty",
					content: sheet,
				}
			]
		}],
		uploads: [],
		chat: [],
	}).then((res) => {
		conn.sendUTF(
			JSON.stringify({
				type: SM.GAMES_REFRESH,
				result: res.result.ok,
			})
		);
	});
};

// ############################
// # autoLogin                #
// ############################
MessageHandler[SM.AUTO_LOGIN] = async (data, conn, userID) => {
	db.dbFind('users', { _id: ObjectId(data.id) }).then((res) => {
		const { _id, username, email } = res[0];
		const tmp = {
			type: SocketMessages.AUTO_LOGIN,
			logged: true,
			id: _id,
			username: username,
			email: email,
		};

        console.log("user się auto-zalogował")

		users[userID] = new User(conn, tmp);
		conn.sendUTF(JSON.stringify(tmp));
	});
};

// ############################
// # gameController           #
// ############################
MessageHandler[SM.GAME_JOIN] = async (data, conn, userID) => {
    var user = users[userID]
    console.log('user wszedł do pokoju')
    user.switchRoom(data.room_id)
}

MessageHandler[SM.GAME_EXIT] = async (data, conn, userID) => {
    const user = users[userID]
    console.log('user wyszedł z pokoju')
    user.exitRoom()
}

MessageHandler[SM.GAME_MESSAGE_CHAT] = async (data, conn, userID) => {
	const user = users[userID]
	user.currentRoom.pushChatMessage(data.username, data.message)
}

MessageHandler[SM.GAME_GET_SHEET] = async (data, conn, userID) => {
	const user = users[userID]
	user.getSheet(data.id)
}

MessageHandler[SM.GAME_SAVE_SHEET] = async (data, conn, userID) => {
	const user = users[userID]
	user.saveSheet(data.sheet)
}

module.exports = MessageHandler;
