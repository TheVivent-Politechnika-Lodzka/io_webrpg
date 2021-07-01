import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';
import UserContext from '../libs/user/UserContext';
import {
	Row,
	Col,
	Form,
	InputGroup,
	Button,
} from 'react-bootstrap';
import MaterialIcon from 'material-icons-react';
import ResizeObserver from 'react-resize-observer';
import { useContext, useEffect, useState } from 'react';

const Chat = () => {
	const [message, setMessage] = useState('');
	const [chat, setChat] = useState([]);
	const [height, setHeight] = useState("calc(100% - 50px)")
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);

	useEffect(() => {
		socket.registerOnMessageEvent(SocketMessages.GAME_GET_CHAT, (data) => {
			setChat(data.chat);
		});

		socket.registerOnMessageEvent(
			SocketMessages.GAME_MESSAGE_CHAT,
			(data) => {
				console.log(chat);
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

	const sendMessage = () => {
		socket.sendJSON({
			type: SocketMessages.GAME_MESSAGE_CHAT,
			username: user.username,
			message: message,
		});

		setMessage('');
	};

	return (
		<Form
			className="h-100"
			onSubmit={(e) => {
				e.preventDefault();
				sendMessage(e.target);
			}}
		>
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
								<div className="text-justify text-wrap w-100 px-2" key={index}>
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
						onResize={(rect)=>{
							setHeight(`${rect.height - 50}px`)
						}}
					/>

				</Col>
			</Row>
		</Form>
	);
};

export default Chat;
