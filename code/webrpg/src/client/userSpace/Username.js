import { useContext, useState } from 'react';
import {
	FloatingLabel,
	Form,
	Row,
	Col,
	Button,
	Container,
} from 'react-bootstrap';
import SocketContext from '../libs/socket/SocketContext';
import UserContext from '../libs/user/UserContext';

const Username = () => {
	const [user] = useContext(UserContext);
	const [username, setUsername] = useState(user.username);
	const socket = useContext(SocketContext);

	//TODO: żeby to faktycznie działało (komunikacja z serwerem)

	return (
		<Form className="border border-dark rounded my-1 p-1">
			<Row className="align-items-center">
				<Col>
					<Container className="text-center p-3">
						<FloatingLabel
							controlId="floatingInput"
							label="Nazwa użytkownika"
							className=" w-75"
						>
							<Form.Control
								type="text"
								placeholder="Nazwa użytkownika"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</FloatingLabel>
					</Container>
				</Col>
					<Button
						active
						variant="success"
						className="w-50"
						style={{ fontSize: '1.5rem' }}
					>
						Zapisz
					</Button>
				<Col>
				</Col>
			</Row>
		</Form>
	);
};

export default Username;
