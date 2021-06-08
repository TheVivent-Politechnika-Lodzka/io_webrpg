const SocketMessages = require('../SocketMessages');
const db = require('./../DatabaseConn');

async function getGames(user) {
	var to_return

	await db
		.dbFind('games', { playerIDs: { $elemMatch: {userId: user.id} } })
		.then((res) => {
			to_return = {
				type: SocketMessages.GET_GAMES_RESULT,
				games: res,
			};
		});

	// await test(user)

	return to_return
}

async function test(user) {
	await db.dbAggregate('games', [
		{$match: {playerIDs: {$elemMatch : {userId: user.id}}}},
		{$lookup: {
			from: 'users',
			localField: 'gmID',
			foreignField: '_id',
			as: 'test'
		}}
	]).then((res)=>{
		console.log(res[0].test[0])
	})
}


module.exports = {
	getGames: getGames,
};
