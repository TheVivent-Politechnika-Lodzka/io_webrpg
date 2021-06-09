const SocketMessages = require('../SocketMessages');
const db = require('./../DatabaseConn');

// async function getGames(user) {
// 	var to_return;

// 	await db
// 		.dbFind('games', { playerIDs: { $elemMatch: { $eq: user.id } } })
// 		.then((res) => {
// 			to_return = {
// 				type: SocketMessages.GET_GAMES_RESULT,
// 				games: res,
// 			};
// 		});


// 	return to_return;
// }

async function getGames(user) {
	var to_return

	await db
		.dbAggregate('games', [
			{ $match: { playerIDs: { $elemMatch: { $eq : user.id } } } },
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
				// zamień id graczy na usera
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
					"gm._id": 1,
					"gm.username": 1,
					"players._id": 1,
					"players.username": 1,
				}
			},
			{
				// wywal żeby gm nie był w tablicy
				$unwind : "$gm"
			}
		])
		.then((res) => {
			to_return = {
				type: SocketMessages.GET_GAMES_RESULT,
				games: res,
			};
		});
	
	return to_return;
}

module.exports = {
	getGames: getGames,
};
