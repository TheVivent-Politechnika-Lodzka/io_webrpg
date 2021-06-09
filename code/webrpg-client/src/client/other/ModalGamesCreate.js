import {
	Modal,
	Form,
	FormControl,
	InputGroup,
	Container,
	Button,
} from 'react-bootstrap';
import { useContext, useState } from 'react';
import SocketContext from './SocketContext';
import SocketMessages from './SocketMessages';

const ModalGamesCreate = ({ toggleModal }) => {
	const [name, setName] = useState('');
	const [validated, setValidated] = useState(false);
	const socket = useContext(SocketContext);

	const createGame = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity() === true) {
			socket.sendJSON({
				type: SocketMessages.GAMES_CREATE,
				name: name,
			});
            toggleModal()
		}

		setValidated(true); //nie mam pojęcia jak to działa, ale dzięki temu ładnie koloruje :)
	};

	return (
		<Modal show={true} onHide={() => toggleModal()}>
			<Modal.Header className="fs-4">Stwórz pokój</Modal.Header>
			<Modal.Body>
				<p className="m-3">
					Aby dołączyć do już istniejącego pokoju wpisz jego numer w
					poniższym okienku:
				</p>
				<Form noValidate validated={validated} onSubmit={createGame}>
					<Form.Group className="form-floating m-3">
						{/* <Form.Label>kod gry</Form.Label> to nie działa jak powinno */}
						<InputGroup hasValidation>
							<FormControl
								required
								type="text"
								id="createGameCode"
								placeholder="nazwa gry"
								value={name}
								onChange={(e) => setName(e.target.value)}
								pattern="[a-zA-Z\d]+"
							/>
							<Form.Control.Feedback type="invalid">
								Nazwa może się składać z liter alfabetu
								łacińskiego oraz cyfr arabskich i rzymskich
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Container className="text-center px-3 mb-4">
						<Button
							type="submit"
							className="w-100"
							variant="success"
						>
							Dołącz teraz!
						</Button>
					</Container>
				</Form>
			</Modal.Body>
			{/* 			
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					createGame();
				}}
			>
				<Form.Group className="form-floating m-3">
					<FormControl
						type="text"
						id="createGameName"
						placeholder="nazwa gry"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Form.Label>nazwa gry</Form.Label>
				</Form.Group>
			</Form> */}
		</Modal>
	);
};

export default ModalGamesCreate;
