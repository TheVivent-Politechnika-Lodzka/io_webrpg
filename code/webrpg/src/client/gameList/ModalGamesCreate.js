import {
	Modal,
	Form,
	FormControl,
	InputGroup,
	Container,
	Button,
} from 'react-bootstrap';
import { useContext, useState } from 'react';
import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';

const ModalGamesCreate = ({ display, toggleModal }) => {
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
			toggleModal();
		}

		setValidated(true); //nie mam pojęcia jak to działa, ale dzięki temu ładnie koloruje :)
	};

	return (
		<Modal show={display} onHide={() => toggleModal()}>
			<Modal.Header className="fs-4 bg-modal fw-bolder">
				Stwórz pokój
			</Modal.Header>
			<Modal.Body className="bg-modal">
				<p className="m-3">
					Aby stworzyć nowy pokój należy podać jego nazwę i wcisnąć
					przycisk znajdujący się poniżej.
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
								maxLength="37"
								style={{ background: '#E3D4B762' }}
							/>
							<Form.Control.Feedback type="invalid">
								Nazwa może się składać z liter alfabetu
								łacińskiego oraz cyfr arabskich i rzymskich.
								Maksymalnie 37 znaków.
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Container className="text-center px-3 mb-4">
						<Button
							type="submit"
							className="w-100 bg-primary"
							variant="success"
						>
							Stwórz teraz!
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
