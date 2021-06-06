// import 'bootstrap/dist/css/bootstrap.min.css'; // css bootstrapa
import './App.scss';
import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import UserContext from './other/UserContext';
import Navigation from './navigation/Navigation';
import MainPage from './other/MainPage';
import Player from './other/Player';
import Login from './other/Login';
import Register from './other/Register';
import Games from './other/Games';
import Game from './game/Game';
import SocketContext from './other/SocketContext';
import Socket from './other/Socket';

// const socket = new W3CWebSocket('ws://192.168.0.21:8000');
const socket = new Socket();

const App = () => {
	const user = useState({
		logged: false,
		name: 'nuk tuk',
		id: 'your mom',
		email: 'none',
	});
	// const user = useState({ logged: true, name: 'nuk tuk', id: 'your mom' });

	// useEffect(() => {
	// 	socket.onopen = () => {
	// 		console.log('Ustanowiono połączenie');
	// 	};
	// 	socket.onmessage = (message) => {
	// 		const msg = JSON.parse(message.data);
	// 		console.log(msg);
	// 		if (msg.type === SocketMessages.LOGIN_ATTEMPT_RESULT) {
	// 			user[1](msg);
	// 		}
	// 	};
	// }, []);

	return (
		<SocketContext.Provider value={socket}>
			<UserContext.Provider value={user}>
				<Container fluid>
					<Router>
						<header>
							<Navigation />
						</header>
						<article>
							<Switch>
								<Route path="/games">
									<Games />
								</Route>
								<Route path="/game/:id">
									<Game />
								</Route>
								<Route path="/register">
									<Register />
								</Route>
								<Route path="/login">
									<Login />
								</Route>
								<Route path="/user/:id">
									<Player />
								</Route>
								<Route path="/">
									<MainPage />
								</Route>
							</Switch>
						</article>
					</Router>
				</Container>
			</UserContext.Provider>
		</SocketContext.Provider>
	);
};

ReactDOM.render(
	// <StrictMode>
	<App />,
	// </StrictMode>,
	document.getElementById('root')
);
