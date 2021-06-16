const ObjectId = require('mongodb').ObjectId;
const SocketMessages = require('../SocketMessages');
const db = require('../DatabaseConn');

/**
 * returns a list of user's games, ready to be displayed in Games
 * @param user
 * @returns {Array} list of games
 * @async
 */
async function getGames(user) {
	var to_return;

	await db
		.dbAggregate('games', [
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
		])
		.then((res) => {
			to_return = {
				type: SocketMessages.GET_GAMES_RESULT,
				games: res,
			};
		});

	return to_return;
}

// TODO: zwracanie czy usera przypadkiem już nie ma w grze(wtedy nie trzeba wysyłać, powiadomienia o konieczności refreshu)
/**
 * assignes user to game
 * @param user
 * @param {string} gameCode
 * @returns null
 */
async function joinGame(user, gameCode) {
	console.log(gameCode);
	await db.dbUpdate(
		'games',

		{ _id: ObjectId(gameCode) },
		{ $push: { playerIDs: user.id } }
	);
}

/**
 * Creates game in database
 * @param user
 * @param {string} gameName
 * @returns {boolean} success status
 */
async function createGame(user, gameName) {
	var to_return;

	await db
		.dbInsert('games', {
			gameName: gameName,
			gmID: user.id,
			playerIDs: [user.id],
			characterSheets: [],
			uploads: [],
			chat: [],
		})
		.then((res) => {
			to_return = res.result.ok;
		});

	return to_return;
}

module.exports = {
	getGames: getGames,
	joinGame: joinGame,
	createGame: createGame,
};
