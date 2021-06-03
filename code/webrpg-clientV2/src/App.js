import 'bootstrap/dist/css/bootstrap.min.css'; // css bootstrapa
import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './navigation/Navigation';
import MainPage from './other/MainPage';
import UserContext from './other/UserContext';
import Player from './other/Player';
import Login from './other/Login';
import Register from './other/Register';
import Games from './other/Games';
import Game from './game/Game';

const App = () => {
	// const user = useState({ logged: false, name: 'nuk tuk', id: 'your mom' });
	const user = useState({ logged: true, name: 'nuk tuk', id: 'your mom' });

	return (
		<UserContext.Provider value={user}>
			<Container fluid>
				<Router>
					<header>
						<Navigation />
					</header>
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
				</Router>
			</Container>
		</UserContext.Provider>
	);
};

ReactDOM.render(
	<StrictMode>
		<App />
	</StrictMode>,
	document.getElementById('root')
);
