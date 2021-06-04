import {
	Col,
	Container,
	Form,
	Row,
	Button,
	InputGroup,
	FormControl,
} from 'react-bootstrap';

import { Link } from 'react-router-dom';

const Register = () => {
	return (
		<Row className="justify-content-center h-100">
			<Col xs="12" sm="8" md="5" xl="3">
				<Form className="p-3 my-5 bg-info rounded-3">
					<Container fluid>
						<Row>
							<Col>
								<InputGroup className="mb-2">
									<InputGroup.Text className="w-25">
										E-mail:
									</InputGroup.Text>
									<FormControl
										id="inlineFormInputGroup"
										placeholder="e-mail"
									/>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col>
								<InputGroup className="mb-2">
									<InputGroup.Text className="w-25">
										Nazwa:
									</InputGroup.Text>
									<FormControl
										id="inlineFormInputGroup"
										placeholder="nazwa użytkownika"
									/>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col>
								<InputGroup className="mb-2">
									<InputGroup.Text className="w-25">
										Hasło:
									</InputGroup.Text>
									<FormControl
										type="password"
										id="inlineFormInputGroup"
										placeholder="hasło"
									/>
								</InputGroup>
							</Col>
						</Row>
						<Row>
							<Col>
								<InputGroup className="mb-2">
									<InputGroup.Text className="w-25">
										Hasło:
									</InputGroup.Text>
									<FormControl
										type="password"
										id="inlineFormInputGroup"
										placeholder="powtórz hasło"
									/>
								</InputGroup>
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
