import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';
import UserContext from '../libs/user/UserContext';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import MaterialIcon from 'material-icons-react';
import ResizeObserver from 'react-resize-observer';
import { useContext, useEffect, useState } from 'react';
import { GlobalHotKeys, configure } from 'react-hotkeys';

const Chat = () => {
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState([]);
	const [height, setHeight] = useState('calc(100% - 50px)');
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);
	configure({ ignoreTags: [] });

	useEffect(() => {
		socket.registerOnMessageEvent(SocketMessages.GAME_GET_CHAT, (data) => {
			setChat(data.chat);
		});

		socket.registerOnMessageEvent(
			SocketMessages.GAME_MESSAGE_CHAT,
			(data) => {
				setChat((old) => [
					...old,
					{
						username: data.username,
						content: data.message,
					},
				]);
			}
		);
	}, []); //eslint-disable-line

	const rollShortcut = (e) => {
		if (e.ctrlKey && e.which == 68) {
			e.preventDefault();
			setMessage('/roll 100');
			sendMessage();
		}
	};

	const sendMessage = (isShortcut = false) => {
		var _username = user.username;
		var _message = message;

		if (isShortcut) _message = '/roll 100';

		if (['/', '-', '.'].includes(_message.charAt(0))) {
			// podziel polecenie na tablicę
			_message = _message.substring(1).split(' ');
			// sprawdź czy polecenie istnieje
			if (!['roll', 'dice'].includes(_message[0])) {
				// TODO: jak(jeżeli) będą alerty, to tu zrobić 🎲
				return;
			}
			// sprawdź i ustal maksymalną wartość do wylosowania
			if (_message.length == 2 && !isNaN(_message[1]))
				_message[1] = parseInt(_message[1]);
			else _message[1] = 100;

			_username = `🎲${_username}`;
			_message = `🎲${_message[1]} ➜ ${Math.floor(
				Math.random() * _message[1]
			)}`;
		}

		socket.sendJSON({
			type: SocketMessages.GAME_MESSAGE_CHAT,
			username: _username,
			message: _message,
		});

		setMessage('');
	};

	const keyMap = {
		ROLL: 'ctrl+d',
	};

	const handlers = {
		ROLL: (event) => {
			event.preventDefault();
			sendMessage(true);
		},
	};

	return (
		<Form
			className="h-100"
			onSubmit={(e) => {
				e.preventDefault();
				sendMessage();
			}}
		>
			<GlobalHotKeys
				keyMap={keyMap}
				handlers={handlers}
				allowChanges={true}
			/>
			<Row className="h-100">
				<Col className="h-100">
					<div
						className="d-flex"
						style={{
							height: height,
							flexDirection: 'column-reverse',
							position: 'relative',
							overflowY: 'auto',
							overflowX: 'hidden',
						}}
					>
						{chat
							.slice(0)
							.reverse()
							.map((entry, index) => (
								<div
									className="text-justify text-wrap w-100 px-2"
									key={index}
								>
									[{entry.username}]: {entry.content}
								</div>
							))}
					</div>

					<InputGroup
						style={{ height: '39.76px', background: '#00000000' }}
						className="m-1"
					>
						<Form.Control
							type="text"
							name="message"
							placeholder="wiadomość"
							required
							value={message}
							autoComplete="off"
							onChange={(e) => setMessage(e.target.value)}
							style={{ background: '#b7905262' }}
						/>
						<InputGroup.Text
							style={{ background: '#00000000' }}
							className="m-0 p-0"
						>
							<Button type="submit" className="text-center">
								<MaterialIcon icon="send" size="tiny" />
							</Button>
						</InputGroup.Text>
					</InputGroup>

					<ResizeObserver
						onResize={(rect) => {
							setHeight(`${rect.height - 50}px`);
						}}
					/>
				</Col>
			</Row>
		</Form>
	);
};

export default Chat;
