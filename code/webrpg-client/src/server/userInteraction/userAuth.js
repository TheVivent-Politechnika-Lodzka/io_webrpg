const db = require('../DatabaseConn');
const SocketMessages = require('../SocketMessages');

const sha256 = require('crypto-js/sha256'); //import do szyfrowania
const Base64 = require('crypto-js/enc-base64'); //import do kodowania

function hashPassword(passwd) {
	return Base64.stringify(sha256(passwd));
}

async function login(data) {
	const email = data.email;
	const password = hashPassword(data.password);

	var to_return;

	await db.dbFind('users', { email: email }).then((val) => {
		val = val[0];
		if (val.passwordHash == password) {
			delete val.passwordHash;
			to_return = {
				type: SocketMessages.LOGIN_ATTEMPT_RESULT,
				logged: true,
				id: val._id,
				name: val.username,
				email: val.email,
			};
		} else {
			to_return = {
				type: SocketMessages.LOGIN_ATTEMPT_RESULT,
				logged: false,
			};
		}
	});

	return to_return;
}

async function register(data) {
	var { email, name, password } = data;
	password = hashPassword(password);

	var to_return;

	await db.dbFind('users', { email: email }).then(async (val) => {
		if (!val.length) {
			await db
				.dbInsert('users', {
					username: name,
					email: email,
					passwordHash: password,
				})
				.then((val2) => {
					if (val2.result.ok) {
						data = val2.ops[0];
						to_return = {
							type: SocketMessages.REGISTER_ATTEMPT_RESULT,
							logged: true,
							id: data._id,
							name: data.username,
							email: data.email,
						};
					} else {
						to_return = {
							type: SocketMessages.REGISTER_ATTEMPT_RESULT,
							logged: false,
						};
					}
				});
		} else {
			to_return = {
				type: SocketMessages.REGISTER_ATTEMPT_RESULT,
				logged: false,
				email: 'exists',
			};
		}
	});

	return to_return;
}

module.exports = {
	login: login,
	register: register,
};
