const SocketMessages = require('../SocketMessages');
const db = require('./../DatabaseConn');

async function getGames(user) {
	var to_return;

	await db.dbFind('games', { gmID: user.id.toString() }).then((val) => {
		to_return = {
			type: SocketMessages.GET_GAMES_RESULT,
			games: val,
		};
	});

	return to_return;
}

module.exports = {
	getGames: getGames,
};
