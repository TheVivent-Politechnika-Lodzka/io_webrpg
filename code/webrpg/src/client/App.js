// import 'bootstrap/dist/css/bootstrap.min.css'; // css bootstrapa
import './App.scss';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import UserContext from './libs/user/UserContext';
import Navigation from './navigation/Navigation';
import MainPage from './landingPage/MainPage';
import Profile from './userSpace/Profile';
import Login from './userAuthentication/Login';
import Register from './userAuthentication/Register';
import Games from './gameList/Games';
import Game from './game/Game';
import SocketContext from './libs/socket/SocketContext';
import Socket from './libs/socket/Socket';
import SocketMessages from './libs/socket/SocketMessages';
import dotenv from 'dotenv';

dotenv.config();

// const socket = new W3CWebSocket('ws://192.168.0.21:8000');
const socket = new Socket();

const App = () => {
	// defaultowy 'user'. istnieje jako odniesienie jakich danych spodziewać się z usera
	const user = useState({
		logged: false,
		username: 'nuk tuk',
		id: 'your mom',
		email: 'none',
	});

	// rejestracja eventu auto-logowania
	useEffect(() => {
		socket.registerOnMessageEvent(SocketMessages.AUTO_LOGIN, (msg) => {
			user[1](msg);
		});
	}, []);

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
									<Profile />
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

// wyświetl aplikację
ReactDOM.render(
	// <StrictMode>
	<App />,
	// </StrictMode>,
	document.getElementById('root')
);
