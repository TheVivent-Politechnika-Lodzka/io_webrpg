import { useContext, useState } from 'react';
import { FloatingLabel, Form, Row, Col, Button } from 'react-bootstrap';
import SocketContext from '../libs/socket/SocketContext';
import UserContext from '../libs/user/UserContext';

const Email = () => {
	const [user] = useContext(UserContext);
	const [email, setEmail] = useState(user.email);
	const socket = useContext(SocketContext);

	//TODO: żeby to faktycznie działało (komunikacja z serwerem)

	return (
		<Form className="border border-dark rounded my-1 p-1">
			<Row className="align-items-center">
				<Col xs="10">
					<FloatingLabel
						controlId="floatingInput"
						label="Adres E-mail"
						className="mb-3"
					>
						<Form.Control
							type="email"
							placeholder="Adres E-mail"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</FloatingLabel>
				</Col>
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

export default Email;
