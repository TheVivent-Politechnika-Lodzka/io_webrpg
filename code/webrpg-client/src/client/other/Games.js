import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SocketContext from './SocketContext';
import SocketMessages from './SocketMessages';
import UserContext from './UserContext';

const Games = () => {
	const [listOfGames, setListOfGames] = useState([]);
	const [status, setStatus] = useState({ loading: true });
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);

	const refreshGames =  () => {
		socket.sendJSON(
			Object.assign(
				{
					type: SocketMessages.GET_GAMES,
				},
				user
			)
		);
	};

	useEffect(refreshGames, []);

	return (
		<Container>
			<Row>
				{status.loading ? (
					<Col className="text-center mt-3">
						<h1>Loading...</h1>
					</Col>
				) : (
					// console.log("test")
					listOfGames.map((game) => {
						console.log(game);
					})
				)}
			</Row>
		</Container>
	);
};

export default Games;
