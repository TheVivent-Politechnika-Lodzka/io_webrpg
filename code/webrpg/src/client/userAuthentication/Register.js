import { useContext, useEffect, useState } from 'react';
import {
	Col,
	Container,
	Form,
	Row,
	Button,
	FloatingLabel,
} from 'react-bootstrap';
import Base64 from 'crypto-js/enc-base64';
import { Link, Redirect } from 'react-router-dom';
import SocketMessages from '../../server/SocketMessages';
import SocketContext from '../libs/socket/SocketContext';
import UserContext from '../libs/user/UserContext';
import { SHA256 } from 'crypto-js';

const Register = () => {
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [user, setUser] = useContext(UserContext);
	const socket = useContext(SocketContext);

	const [isPassSame, setIsPassSame] = useState(true);

	useEffect(() => {
		setIsPassSame(true);
	}, [password, passwordRepeat]);

	useEffect(() => {
		socket.registerOnMessageEvent(
			SocketMessages.REGISTER_ATTEMPT_RESULT,
			(msg) => {
				if (msg.logged) setUser(msg);
				else {
					if (msg.email == 'exists') console.log('email istnieje');
				}
			}
		);
	}, []); //eslint-disable-line

	const register = () => {
		if (password != passwordRepeat) {
			setIsPassSame(false);
			return;
		}
		let passwd = Base64.stringify(SHA256(password));

		console.log('próba rejestracji');

		socket.sendJSON({
			type: SocketMessages.REGISTER_ATTEMPT,
			email: email,
			name: name,
			password: passwd,
		});
	};

	if (user.logged) {
		return <Redirect to={`/user/${user.id}`} />;
	}

	return (
		<Row className="justify-content-center mx-0">
			<Col xs="11" sm="10" md="6" xl="5">
				<Form
					className="p-3 my-5 bg-info rounded-3"
					onSubmit={(e) => {
						e.preventDefault();
						register();
					}}
				>
					<Container fluid>
						<Row>
							<Col>
								<FloatingLabel
									controlId="floatingPassword"
									label="Adres e-mail:"
									className="m-3"
								>
									<Form.Control
										type="email"
										id="registerFormEmail"
										placeholder="e-mail"
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
								<FloatingLabel
									controlId="ruchomaNazwa"
									label="Nazwa użytkownika:"
									className="m-3"
								>
									<Form.Control
										id="registerFormNick"
										placeholder="nazwa użytkownika"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										style={{ background: '#b7905262' }}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col>
								<FloatingLabel
									controlId="ruchomeHasło"
									label="Hasło:"
									className="m-3"
								>
									<Form.Control
										type="password"
										id="registerFormPassword"
										placeholder="hasło"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										style={{ background: '#b7905262' }}
										className={
											isPassSame ? null : 'is-invalid'
										}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col>
								<FloatingLabel
									controlId="ruchomePowtórzHasło"
									label="Powtórz hasło:"
									className="m-3"
								>
									<Form.Control
										type="password"
										id="registerFormRepeatPassword"
										placeholder="powtórz hasło"
										value={passwordRepeat}
										onChange={(e) =>
											setPasswordRepeat(e.target.value)
										}
										className={
											isPassSame ? null : 'is-invalid'
										}
										style={{ background: '#b7905262' }}
									/>
								</FloatingLabel>
							</Col>
						</Row>
						<Row>
							<Col className="text-center">
								<Button
									variant="primary"
									type="submit"
									className="w-75 fs-5 m-3"
								>
									Zarejestruj
								</Button>
							</Col>
						</Row>
						<Row>
							<Col className="text-start mt-2">
								Masz już konto?
								<span> </span>
								<Link to="./login">Zaloguj się</Link>
							</Col>
						</Row>
					</Container>
				</Form>
			</Col>
		</Row>
	);
};

export default Register;
