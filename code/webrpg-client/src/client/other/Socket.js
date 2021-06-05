import { w3cwebsocket } from 'websocket';

class Socket {
	constructor() {
		this.socket = new w3cwebsocket('ws://192.168.0.21:8000');
		this.functions = {};

		this.socket.onopen = () => {
			console.log('Ustanowiono połączenie');
		};

		this.socket.onmessage = (message) => {
			const msg = JSON.parse(message.data);
			console.log(msg);
			const type = msg.type;
			delete msg.type;
			this.functions[type](msg);
		};
	}

	registerOnMessageEvent = (type, fun) => {
		this.functions[type] = fun;
	};

	send = (msg) => {
		this.socket.send(msg);
	};

    sendJSON = (msg) => {
        this.socket.send(JSON.stringify(msg))
    }
}

export default Socket;
