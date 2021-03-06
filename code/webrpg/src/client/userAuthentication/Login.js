import { SHA256 } from 'crypto-js'; //import do szyfrowania
import Base64 from 'crypto-js/enc-base64'; //import do kodowania
import { useContext, useEffect, useState } from 'react';
import {
	Col,
	Container,
	Form,
	Row,
	Button,
	FloatingLabel,
} from 'react-bootstrap'; //importy z reactBootstrap
import { Link, Redirect } from 'react-router-dom';
import { setCookie } from '../libs/socket/Socket';
import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';
import UserContext from '../libs/user/UserContext';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [keepSignedIn, setKeepSignedIn] = useState(true);
	const socket = useContext(SocketContext);
	const [user, setUser] = useContext(UserContext);

	// setUser zgodnie z UserContext
	useEffect(() => {
		socket.registerOnMessageEvent(
			SocketMessages.LOGIN_ATTEMPT_RESULT,
			(msg) => {
				if (keepSignedIn) {
					setCookie('id', msg.id, 3);
				}
				setUser(msg);
			}
		);
	}, []); //eslint-disable-line

	// wysyłanie zaszyfrowanego formularza z email i haslo JSON
	const sendForm = () => {
		let tmp = Base64.stringify(SHA256(password));
		socket.sendJSON({
			type: SocketMessages.LOGIN_ATTEMPT,
			email: email,
			password: tmp,
		});
	};

	if (user.logged) {
		return <Redirect to={`/user/${user.id}`} />;
	}

	return (
		<Row className="justify-content-center mx-0">
			<Col xs="11" sm="10" md="6" xl="5">
				<Form
					className="p-3 my-5  rounded-3 loginBox"
					onSubmit={(e) => {
						e.preventDefault();
						sendForm(e.target);
					}}
				>
					<Container fluid>
						<Row>
							<Col>
								<FloatingLabel label="Email" className="m-3">
									<Form.Control
										className="loginInput"
										type="email"
										name="mail"
										placeholder="e-mail"
										required
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										style={{ background: '#b7905262' }}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col>
								<FloatingLabel label="Hasło" className="m-3">
									<Form.Control
										className="loginInput"
										type="password"
										name="password"
										placeholder="hasło"
										required
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										style={{ background: '#b7905262' }}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Check
									type="checkbox"
									checked={keepSignedIn}
									onChange={(e) =>
										setKeepSignedIn(e.target.checked)
									}
									label="Pozostaw zalogowanym"
								/>
							</Col>
						</Row>
						<Row>
							<Col className="text-center">
								<Button
									variant="primary"
									type="submit"
									className="w-75 fs-5 m-3"
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
							{/* <Col
								xs="12"
								md="5"
								className="text-center text-lg-end mt-2"
							>
								<Link to="./register">Zapomniałeś hasła?</Link>
							</Col> */}
						</Row>
					</Container>
				</Form>
			</Col>
		</Row>
	);
};

export default Login;
