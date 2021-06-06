import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router';
import SocketContext from './SocketContext';
import SocketMessages from './SocketMessages';
import UserContext from './UserContext';

const Games = () => {
	const [state, setState] = useState({
		listOfGames: [], // lista gier
		loading: true, // flaga "czy się ładuję"
		moreModal: -1, // index gry do wyświetlenia w modalu (-1 oznacza nie wyświetlaj)
	});
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);

	const refreshGames = () => {
        //ustaw flagę "ładuję" na true
		setState((prevState) => ({ ...prevState, loading: true }));
		// wyślij prośbę o przesłanie gierek
        socket.sendJSON(
			Object.assign(
				{
					type: SocketMessages.GET_GAMES,
				},
				user
			)
		);
	};

    // funkcją ustawiająca która gra ma być wyświetlona w modalu
	const toggleModal = (index) => {
		setState((prevState) => ({
			...prevState,
			moreModal: index,
		}));
	};

	useEffect(refreshGames, []); // pobierz gry przy pierwszym załadowaniu
	useEffect(() => {
        // przypisz event nasłuchujący zwróconych gier
		socket.registerOnMessageEvent(
			SocketMessages.GET_GAMES_RESULT,
			(msg) => {
				setState((prevState) => ({
					...prevState,
					listOfGames: msg.games,
					loading: false,
				}));
			}
		);
	}, []);

    // jeżeli użytkownik nie jest zalogowany, to
    // przekieruj na stronę główną
	if (!user.logged) {
		return <Redirect to="/" />;
	}

    // ustaw obecny modal (chodzi, żeby była krótsza zmienna przy wyświetlaniu modalu)
	var currModal = state.listOfGames[state.moreModal];
	
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
					{state.listOfGames.map((game, index) => (
						<Col key={game._id} className="mt-3">
							<Card style={{ height: '250px' }}>
								<Card.Header>{game.gameName}</Card.Header>
								<Card.Body>
									<Card.Subtitle>{game._id}</Card.Subtitle>
								</Card.Body>
								<Button
									active
									variant="primary"
									onClick={() => toggleModal(index)}
								>
									Więcej
								</Button>
							</Card>
						</Col>
					))}
					<Col className="mt-3">
						<Card bg="lime" style={{ height: '250px' }}>
							<Card.Body>+</Card.Body>
						</Card>
					</Col>
				</Row>
			)}

			<Modal show={state.moreModal != -1} onHide={() => toggleModal(-1)}>
				{currModal ? (
					<Modal.Header>{currModal.gameName}</Modal.Header>
				) : null}
			</Modal>
		</Container>
	);
};

export default Games;
