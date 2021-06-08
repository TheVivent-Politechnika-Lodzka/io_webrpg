import { useContext, useEffect, useState } from 'react';
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	Modal,
	ButtonGroup,
} from 'react-bootstrap';
import { Redirect } from 'react-router';
import { getCookie } from './Socket';
import SocketContext from './SocketContext';
import SocketMessages from './SocketMessages';
import UserContext from './UserContext';

const Games = () => {
	const [state, setState] = useState({
		listOfGames: [], // lista gier
		loading: true, // flaga "czy się ładuje"
		moreModal: -1, // index gry do wyświetlenia w modalu (-1 oznacza nie wyświetlaj)
	});
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);

	const refreshGames = () => {
		//ustaw flagę "ładuję" na true
		setState((prevState) => ({ ...prevState, loading: true }));
		// wyślij prośbę o przesłanie gierek
		socket.sendJSON({
			type: SocketMessages.GET_GAMES,
		});
	};

	// funkcją ustawiająca która gra ma być wyświetlona w modalu
	const toggleModal = (index) => {
		setState((prevState) => ({
			...prevState,
			moreModal: index,
		}));
	};

	// przypisz event nasłuchujący zwróconych gier
	useEffect(() => {
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
	useEffect(refreshGames, []); // pobierz gry przy pierwszym załadowaniu

	// jeżeli użytkownik nie jest zalogowany, to
	// przekieruj na stronę główną
	if (!user.logged) {
		// jeżeli jest ustawione cookie, to user pewnie jest zalogowany
		// tylko auto-logowanie jeszcze się nie odbyło
		if (!getCookie('id')) {
			return <Redirect to="/" />;
		}
	}

	// ustaw obecny modal (chodzi, żeby była krótsza zmienna przy wyświetlaniu modalu)
	var currModal = state.listOfGames[state.moreModal];

	console.log(state.listOfGames);

	return (
		<Container>
			{state.loading ? (
				<Row>
					<Col className="text-center mt-3">
						<h1>Loading...</h1>
					</Col>
				</Row>
			) : (
				<Row xs={1} sm={2} md={2} lg={3} xl={4}>
					{state.listOfGames.map((game, index) => (
						<Col key={game._id} className="my-3">
							<Card style={{ height: '400px' }}>
								<Card.Header>{game.gameName}</Card.Header>
								<Card.Body>
									<Card.Subtitle>{game._id}</Card.Subtitle>
								</Card.Body>
								{/* <div className="d-grid gap-2"></div> */}
								<Container fluid className="text-center p-3">
									{/* <Row xs={2} sm={2} md={2} lg={2} xl={2}>
										<Col className="text-center"> */}
									<ButtonGroup className="text-center w-100">
										<Button
											className="p-3"
											style={{ height: '100px' }}
											size="lg"
											active
											variant="primary"
											onClick={() => toggleModal(index)}
										>
											Więcej
										</Button>
										{/* </Col>
										<Col className="text-center"> */}
										<Button
											className="p-3"
											style={{ height: '100px' }}
											size="lg"
											active
											variant="success"
											onClick={() => toggleModal(index)}
										>
											Dołącz
										</Button>
									</ButtonGroup>
									{/* </Col>
									</Row> */}
								</Container>
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

			{currModal ? (
				<Modal show={state.moreModal != -1} onHide={() => toggleModal(-1)}>
					<Modal.Header>{currModal.gameName}</Modal.Header>
					sdfsdafasdfasdfasdf
				</Modal>
			) : null}
		</Container>
	);
};

export default Games;
