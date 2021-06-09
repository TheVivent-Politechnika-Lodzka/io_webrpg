import { w3cwebsocket } from 'websocket';

function setCookie(name, value, days) {
	var expires = '';
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
	}
	document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
function getCookie(name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
function eraseCookie(name) {
	document.cookie =
		name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

class Socket {
	constructor() {
		this.socket = new w3cwebsocket(
			`ws://${process.env.SOCKET_SERVER}:8000`
		);
		this.functions = {};
		this.msgs = [];

		this.socket.onopen = () => {
			while (this.msgs.length > 0) {
				this.send(this.msgs.pop());
			}
			console.log('Ustanowiono połączenie');
		};

		this.socket.onmessage = (message) => {
			const msg = JSON.parse(message.data);
			const type = msg.type;
			delete msg.type;
			this.functions[type](msg);
		};
	}

	registerOnMessageEvent = (type, fun) => {
		this.functions[type] = fun;
	};

	send = (msg) => {
		if (this.socket.readyState !== 1) {
			this.msgs.push(msg);
		} else {
			this.socket.send(msg);
		}
	};

	sendJSON = (msg) => {
		this.send(JSON.stringify(msg));
	};
}

export default Socket;
export { setCookie, getCookie, eraseCookie };
