import { useContext, useEffect, useState } from 'react';
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	ButtonGroup,
	Img,
} from 'react-bootstrap';
import { Redirect } from 'react-router';
import { getCookie } from '../libs/socket/Socket';
import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';
import UserContext from '../libs/user/UserContext';
import ModalGamesInfo from './ModalGamesInfo';
import ModalGamesCreate from './ModalGamesCreate';
import ModalGamesJoin from './ModalGamesJoin';
import { LinkContainer } from 'react-router-bootstrap';
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
		createModal: false,
		joinModal: false,
	});
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);

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
		// przypisz event każący refreshować gry
		socket.registerOnMessageEvent(SocketMessages.GAMES_REFRESH, () => {
			refreshGames();
		});
	}, []); //eslint-disable-line

	useEffect(() => {
		// pobierz gry
		if (user.logged) {
			refreshGames();
		}
	}, [user]);

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

	const refreshGames = () => {
		//ustaw flagę "ładuję" na true
		setState((prevState) => ({ ...prevState, loading: true }));
		// wyślij prośbę o przesłanie gierek
		socket.sendJSON({
			type: SocketMessages.GET_GAMES,
		});
	};

	// funkcja ustawiająca która gra ma być wyświetlona w modalu
	const toggleModalInfo = (index) => {
		setState((prevState) => ({
			...prevState,
			moreModal: index,
		}));
	};

	const toggleModalCreate = () => {
		setState((prevState) => ({
			...prevState,
			createModal: !state.createModal,
		}));
	};

	const toggleModalJoin = () => {
		setState((prevState) => ({
			...prevState,
			joinModal: !state.joinModal,
		}));
	};

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
	var infoModal = state.listOfGames[state.moreModal];

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
							<Card style={{background: "#0000000f"}}>
								{/* <Card.Header className="fs-6">
									{game.gameName}
								</Card.Header> */}
								<div className="imgGames">
									<img
										src={
											images[
												Math.floor(
													Math.random() *
														images.length
												)
											]
										}
										className="card-img-top"
										alt="..."
									/>
								</div>
								<Card.Body className="bgCardImages mb-0">
									<h5 className="card-title">
										{game.gameName}
									</h5>
									<Container
										fluid
										className="text-center p-3"
										fixed="bottom"
									>
										<ButtonGroup
											className="text-center w-100 twoButton"
											style={{ height: '4em' }}
										>
											<Button
												className="p-3"
												size="lg"
												active
												variant="primary"
												onClick={() =>
													toggleModalInfo(index)
												}
											>
												Więcej
											</Button>
											<LinkContainer
												to={`/game/${game._id}`}
												style={{background: "#000005f"}}
											>
												<Button
													className="p-3"
													size="lg"
													active
													variant="success"
												>
													Dołącz
												</Button>
											</LinkContainer>
										</ButtonGroup>
									</Container>
								</Card.Body>
							</Card>
						</Col>
					))}
					<Col className="mt-3 mb-3 mb-sm-0">
						<Card style={{ height: '450px', background: "#0000000f" }}>
							<Card.Body className="p-0">
								<Container fluid className="text-center h-100">
									<ButtonGroup className="text-center h-100 w-100">
										<Button
											className="w-50"
											size="lg"
											active
											variant="primary"
											onClick={() => toggleModalCreate()}
										>
											Stwórz nowy pokój
										</Button>

										<Button
											className="w-50"
											size="lg"
											active
											variant="success"
											onClick={() => toggleModalJoin()}
										>
											Dołącz do istniejącego pokoju
										</Button>
									</ButtonGroup>
								</Container>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			)}

			<ModalGamesInfo
				display={!!infoModal}
				currModal={infoModal}
				toggleModal={toggleModalInfo}
			/>

			<ModalGamesCreate
				display={state.createModal}
				toggleModal={toggleModalCreate}
			/>

			<ModalGamesJoin
				display={state.joinModal}
				toggleModal={toggleModalJoin}
			/>
		</Container>
	);
};

export default Games;
