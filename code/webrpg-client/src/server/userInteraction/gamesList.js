const SocketMessages = require('../SocketMessages');
const db = require('./../DatabaseConn');

async function getGames(data) {
	var to_return;

	await db
		.dbFind('games', { gmID: data.id })
		.then(
			(val) =>
				(to_return = 
					{ type: SocketMessages.GET_GAMES_RESULT,
                    games: val }

				)
		);

	return to_return;
}

module.exports = {
	getGames: getGames,
};
