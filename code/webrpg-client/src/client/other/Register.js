import { useContext, useEffect, useState } from 'react';
import {
	Col,
	Container,
	Form,
	Row,
	Button,
	FormControl,
} from 'react-bootstrap';
import Base64 from 'crypto-js/enc-base64';
import { Link, Redirect } from 'react-router-dom';
import SocketMessages from '../../server/SocketMessages';
import SocketContext from './SocketContext';
import UserContext from './UserContext';
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
				console.log('witam z register');
				setUser(msg);
			}
		);
	}, []); //eslint-disable-line

	const register = () => {
		if (password != passwordRepeat) {
			setIsPassSame(false);
			return;
		}
		let passwd = Base64.stringify(SHA256(password));

		socket.sendJSON({
			type: SocketMessages.REGISTER_ATTEMPT,
			email: email,
			name: name,
			password: passwd,
		});
	};

	if (user.name == email) {
		return <Redirect to={`/user/user.id`} />;
	}

	return (
		<Row className="justify-content-center h-100">
			<Col xs="12" sm="8" md="5" xl="3">
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
								<Form.Group className="form-floating">
									<FormControl
										type="email"
										id="registerFormEmail"
										placeholder="e-mail"
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
										id="registerFormNick"
										placeholder="nazwa użytkownika"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
									/>
									<Form.Label>Nazwa użytkownika:</Form.Label>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group className="form-floating ">
									<FormControl
										type="password"
										id="registerFormPassword"
										placeholder="hasło"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className={
											isPassSame ? null : 'is-invalid'
										}
									/>
									<Form.Label>Hasło:</Form.Label>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group className="form-floating my-2">
									<FormControl
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
									/>
									<Form.Label>Powtórz hasło:</Form.Label>
								</Form.Group>
							</Col>
						</Row>
						<Row>
							<Col className="text-center">
								<Button
									variant="primary"
									type="submit"
									className="w-75 fs-5"
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
