import {
	Modal,
	Form,
	FormControl,
	InputGroup,
	Button,
	Container,
} from 'react-bootstrap';
import { useContext, useState } from 'react';
import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';

const ModalGamesJoin = ({ display, toggleModal }) => {
	const [code, setCode] = useState('');
	const [validated, setValidated] = useState(false);
	const socket = useContext(SocketContext);

	const joinGame = (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		if (form.checkValidity() === true) {
			socket.sendJSON({
				type: SocketMessages.GAMES_JOIN,
				code: code,
			});
			toggleModal();
		}

		setValidated(true); //nie mam pojęcia jak to działa, ale dzięki temu ładnie koloruje :)
	};

	return (
		<Modal show={display} onHide={() => toggleModal()}>
			<Modal.Header className="fs-4 bg-modal fw-bolder">
				Dołączanie
			</Modal.Header>
			<Modal.Body className="bg-modal">
				<p className="m-3">
					Aby dołączyć do już istniejącego pokoju wpisz jego numer w
					poniższym okienku:
				</p>
				<Form noValidate validated={validated} onSubmit={joinGame}>
					<Form.Group className="form-floating m-3">
						{/* <Form.Label>kod gry</Form.Label> to nie działa jak powinno */}
						<InputGroup hasValidation>
							<FormControl
								required
								type="text"
								id="joinGameCode"
								placeholder="kod gry"
								value={code}
								onChange={(e) => setCode(e.target.value)}
								pattern="[a-f\d]{24}"
								style={{ background: '#E3D4B762' }}
							/>
							<Form.Control.Feedback type="invalid">
								To nie wygląda jak numer pokoju
							</Form.Control.Feedback>
						</InputGroup>
					</Form.Group>
					<Container className="text-center px-3 mb-4">
						<Button
							type="submit"
							className="w-100 bg-primary"
							variant="success"
						>
							Dołącz teraz!
						</Button>
					</Container>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default ModalGamesJoin;
