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

import MaterialIcon from 'material-icons-react';

const Password = () => {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword1, setNewPassword1] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const socket = useContext(SocketContext);

	//TODO: żeby to faktycznie działało (komunikacja z serwerem)

	return (
		<Form className="border border-dark rounded my-1 p-1">
			<Row className="align-items-center d-flex align-items-stretch">
				<Col xs="9" md="10">
					<Container className="w-100 p-0">
						<Row className="my-2">
							<Col className="ps-3">
								<FloatingLabel label="Stare hasło">
									<Form.Control
										type="password"
										placeholder="Stare hasło"
										value={oldPassword}
										onChange={(e) =>
											setOldPassword(e.target.value)
										}
										style={{ background: '#b7905262' }}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row className="my-2">
							<Col className="ps-3">
								<FloatingLabel label="Nowe hasło">
									<Form.Control
										type="password"
										placeholder="Nowe hasło"
										value={newPassword1}
										onChange={(e) =>
											setNewPassword1(e.target.value)
										}
										style={{ background: '#b7905262' }}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row className="my-2">
							<Col className="ps-3">
								<FloatingLabel label="Powtórz nowe hasło">
									<Form.Control
										type="password"
										placeholder="Powtórz nowe hasło"
										value={newPassword2}
										onChange={(e) =>
											setNewPassword2(e.target.value)
										}
										style={{ background: '#b7905262' }}
									/>
								</FloatingLabel>
							</Col>
						</Row>

						<Row>
							<Col></Col>
						</Row>
					</Container>
				</Col>
				<Col md="2" xs="3" className="ps-0 text-center">
					<Button
						active
						variant="success"
						className="w-100 mx-0 pt-3 h-100 p-0 bg-primary"
						style={{ fontSize: '1.5rem' }}
					>
						<div className="d-none d-md-block m-0 p-0">
							<MaterialIcon icon="save" size="large" />
						</div>
						<div className="d-none d-sm-block d-md-none m-0 p-0">
							<MaterialIcon icon="save" size="medium" />
						</div>
						<div className="d-block d-sm-none m-0 p-0">
							<MaterialIcon icon="save" size="tiny" />
						</div>
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default Password;
