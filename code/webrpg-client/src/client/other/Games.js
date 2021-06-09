import { useContext, useEffect, useState } from 'react';
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	Modal,
	ButtonGroup,
	Table,
	Image,
} from 'react-bootstrap';
import { Redirect } from 'react-router';
import { getCookie } from './Socket';
import SocketContext from './SocketContext';
import SocketMessages from './SocketMessages';
import UserContext from './UserContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import img1 from '../img/3dfigure/hifa1.png';
import img2 from '../img/3dfigure/hifa2.png';
import img3 from '../img/3dfigure/lemotien1.png';
import img4 from '../img/3dfigure/lemotien2.png';
import img5 from '../img/3dfigure/ulgrim1.png';
import img6 from '../img/3dfigure/ulgrim2.png';
import img7 from '../img/3dfigure/xorim1.png';
import img8 from '../img/3dfigure/xorim2.png';
import img9 from '../img/3dfigure/yggrasil1.png';
import img10 from '../img/3dfigure/yggrasil2.png';

const Games = () => {
	const [state, setState] = useState({
		listOfGames: [], // lista gier
		loading: true, // flaga "czy się ładuje"
		moreModal: -1, // index gry do wyświetlenia w modalu (-1 oznacza nie wyświetlaj)
	});
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);

	const images = [
		img1,
		img2,
		img3,
		img4,
		img5,
		img6,
		img7,
		img8,
		img9,
		img10,
	];
	const randomIndex = Math.floor(Math.random() * images.length);
	const selectedPicture = images[randomIndex];

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
								<Container></Container>
								<Card.Body
									className="bgCardImages"
									style={{
										backgroundImage: `url(${selectedPicture})`,
									}}
								>
									{/* <Image fluid src={selectedPicture}>
	
									</Image> */}
									{/* <Card.Subtitle>{game._id}</Card.Subtitle> */}
									<Container className="h-75"></Container>
									<Container
										fluid
										className="text-center p-3"
										fixed="bottom"
									>
										<ButtonGroup
											className="text-center w-100"
											style={{ height: '70px' }}
										>
											<Button
												className="p-3"
												size="lg"
												active
												variant="primary"
												onClick={() =>
													toggleModal(index)
												}
											>
												Więcej
											</Button>
											<Button
												className="p-3"
												size="lg"
												active
												variant="success"
												onClick={() =>
													toggleModal(index)
												}
											>
												Dołącz
											</Button>
										</ButtonGroup>
									</Container>
								</Card.Body>
							</Card>
						</Col>
					))}
					<Col className="mt-3 mb-3 mb-sm-0">
						<Card style={{ height: '399px' }}>
							<Card.Body className="p-0">
								<Container fluid className="text-center h-100">
									<ButtonGroup className="text-center h-100 w-100">
										<Button
											className="w-50"
											// style={{ height: '100px' }}
											size="lg"
											active
											variant="primary"
											// onClick={() => toggleModal(index)}
										>
											Stwórz nowy pokój
										</Button>

										<Button
											className="w-50"
											// style={{ height: '100px' }}
											size="lg"
											active
											variant="success"
											// onClick={() => toggleModal(index)}
										>
											Dołącz do nowego pokoju
										</Button>
									</ButtonGroup>
								</Container>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			)}

			{currModal ? (
				<Modal
					show={state.moreModal != -1}
					onHide={() => toggleModal(-1)}
				>
					<Modal.Header className="fs-3">
						{currModal.gameName}
					</Modal.Header>
					<Modal.Body>
						Członkowie pokoju:
						<div>GM: {currModal.gm.username}</div>
						{currModal.players.map((player) => (
							<div key={player._id} className="mx-3">- {player.username}</div>
						))}
						<Table responsive className="mt-3">
							<thead className="text-center fs-4">
								<tr>
									<th colSpan="2">Numer Pokoju</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<div
											className="text-center"
											style={{ 'marginTop': '7px' }}
											id="idGameCode"
										>
											<p>{currModal._id}</p>
										</div>
									</td>
									<td className="w-50">
										<CopyToClipboard text={currModal._id}>
											<Button
												className="w-100 "
												active
												variant="outline-lime"
											>
												Kopiuj
											</Button>
										</CopyToClipboard>
									</td>
								</tr>
								<tr></tr>
							</tbody>
						</Table>
					</Modal.Body>
				</Modal>
			) : null}
		</Container>
	);
};

export default Games;
