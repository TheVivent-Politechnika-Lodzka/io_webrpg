import { useContext, useState } from 'react';
import { FloatingLabel, Form, Row, Col, Button } from 'react-bootstrap';
import SocketContext from '../libs/socket/SocketContext';

const Password = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword1, setNewPassword1] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const socket = useContext(SocketContext);

	//TODO: żeby to faktycznie działało (komunikacja z serwerem)

	return (
		<Form className="border border-dark rounded my-1 p-1">
			<Row>
				<Col>
					<FloatingLabel
						controlId="floatingInput"
						label="Stare hasło"
						className="mb-3"
					>
						<Form.Control
							type="password"
							placeholder="Stare hasło"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel
						controlId="floatingInput"
						label="Nowe hasło"
						className="mb-3"
					>
						<Form.Control
							type="password"
							placeholder="Nowe hasło"
							value={newPassword1}
							onChange={(e) => setNewPassword1(e.target.value)}
						/>
					</FloatingLabel>
				</Col>
			</Row>
			<Row>
				<Col>
					<FloatingLabel
						controlId="floatingInput"
						label="Powtórz nowe hasło"
						className="mb-3"
					>
						<Form.Control
							type="password"
							placeholder="Powtórz nowe hasło"
							value={newPassword2}
							onChange={(e) => setNewPassword2(e.target.value)}
						/>
					</FloatingLabel>
				</Col>
			</Row>

			<Row>
				<Col>
					<Button
						active
						variant="success"
						className="mb-2"
						style={{ fontSize: '1.5rem' }}
					>
						Zapisz
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default Password;
