import { Button } from 'bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Redirect } from 'react-router';
import SocketContext from './SocketContext';
import SocketMessages from './SocketMessages';
import UserContext from './UserContext';

const Games = () => {
	const [state, setState] = useState({ listOfGames: [], loading: true });
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);

	if (!user.logged) {
		return <Redirect to="/" />;
	}

	const refreshGames = () => {
		setState({ loading: true });
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
	useEffect(() => {
		socket.registerOnMessageEvent(
			SocketMessages.GET_GAMES_RESULT,
			(msg) => {
				setState({ listOfGames: msg.games, loading: false });
			}
		);
	}, []);

	return (
		<Container>
			{state.loading ? (
				<Row>
					<Col className="text-center mt-3">
						<h1>Loading...</h1>
					</Col>
				</Row>
			) : (
				<Row xs={1} md={3} xl={5}>
					{state.listOfGames.map((game) => (
						<Col key={game._id} className="mt-3">
							<Card style={{ height: '250px' }}>
								<Card.Header>{game.gameName}</Card.Header>
								<Card.Body>
									<Card.Subtitle>{game._id}</Card.Subtitle>
								</Card.Body>
                                {/* <Button></Button> */}
							</Card>
						</Col>
					))}
					<Col>
						<Card>
							<Card.Body></Card.Body>
						</Card>
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default Games;
