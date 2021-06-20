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
import MaterialIcon from 'material-icons-react';

const Username = () => {
	const [user] = useContext(UserContext);
	const [username, setUsername] = useState(user.username);
	const socket = useContext(SocketContext);

	//TODO: żeby to faktycznie działało (komunikacja z serwerem)

	return (
		<Form className="border border-dark rounded my-1 p-1">
			<Row className="align-items-center">
				<Col xs="10" className="ps-3">
					<FloatingLabel
						controlId="floatingInput"
						label="Nazwa użytkownika"
						className=" w-100"
					>
						<Form.Control
							type="text"
							placeholder="Nazwa użytkownika"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-100 mx-0"
						/>
					</FloatingLabel>
				</Col>
				<Col xs="2" className="ps-3 text-center">
					<Button
						active
						variant="success"
						className="w-100 mx-0 pt-3"
					>
						<div className="d-none d-md-block">
							<MaterialIcon icon="save" size="large" />
						</div>
						<div className="d-none d-sm-block d-md-none">
							<MaterialIcon icon="save" size="medium" />
						</div>
						<div className="d-block d-sm-none me-5">
							<MaterialIcon icon="save" size="tiny" />
						</div>
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default Username;
