const SocketMessages = require('../SocketMessages');
const db = require('./../DatabaseConn');

async function getGames(user) {
	var to_return

	await db
		.dbFind('games', { playerIDs: { $elemMatch: {userId: user.id} } })
		.then((res) => {
			// res.map((element)=>{
				
			// })
			to_return = {
				type: SocketMessages.GET_GAMES_RESULT,
				games: res,
			};
		});

	return to_return
}

module.exports = {
	getGames: getGames,
};
