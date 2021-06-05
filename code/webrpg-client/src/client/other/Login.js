import { SHA256 } from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import { useContext, useEffect, useState } from 'react';
import {
	Col,
	Container,
	Form,
	Row,
	Button,
	FormControl,
} from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import SocketContext from './SocketContext';
import SocketMessages from './SocketMessages';
import UserContext from './UserContext';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const socket = useContext(SocketContext);
	const [user, setUser] = useContext(UserContext);

	useEffect(() => {
		socket.registerOnMessageEvent(
			SocketMessages.LOGIN_ATTEMPT_RESULT,
			(msg) => {
				setUser(msg);
			}
		);
	}, []); //eslint-disable-line

	const sendForm = () => {
		let tmp = Base64.stringify(SHA256(password));
		socket.sendJSON({
			type: SocketMessages.LOGIN_ATTEMPT,
			email: email,
			password: tmp,
		});
	};

	if (user.name == email) {
		return <Redirect to={`/user/${user.id}`} />;
	}

	return (
		<Row className="justify-content-center h-100">
			<Col xs="12" sm="8" md="5" xl="3">
				<Form
					className="p-3 my-5 bg-info rounded-3"
					onSubmit={(e) => {
						e.preventDefault();
						sendForm(e.target);
					}}
				>
					<Container fluid>
						<Row>
							<Col>
								<Form.Group className="form-floating">
									<FormControl
										type="email"
										id="loginFormMail"
										name="mail"
										placeholder="e-mail"
										required
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
									<Form.Label>Adres e-mail:</Form.Label>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group className="form-floating my-2">
									<FormControl
										type="password"
										id="loginFormPassword"
										name="password"
										placeholder="hasło"
										required
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
									/>
									<Form.Label>Hasło:</Form.Label>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col className="text-center">
								<Button
									variant="primary"
									type="submit"
									className="w-75 fs-5
                                "
								>
									Zaloguj
								</Button>
							</Col>
						</Row>
						<Row>
							<Col
								xs="12"
								md="7"
								className="text-center text-lg-start mt-2"
							>
								Nie masz konta?
								<span> </span>
								<Link to="./register">Zarejestruj się</Link>
							</Col>
							<Col
								xs="12"
								md="5"
								className="text-center text-lg-end mt-2"
							>
								<Link to="./register">Zapomniałeś hasła?</Link>
							</Col>
						</Row>
					</Container>
				</Form>
			</Col>
		</Row>
	);
};

export default Login;
