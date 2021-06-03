import { Container, Navbar, Nav } from 'react-bootstrap';
import logo from '../img/logo.png';
import UserContext from '../other/UserContext';

const Navigation = () => {
	return (
		<Navbar bg="light" expand="lg">
			<Container fluid>
				<Navbar.Brand href="/">
					<img
						style={{ height: '2em' }}
						src={logo}
						className="d-inline-block allign-top"
						alt="webRPG"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="/">Strona główna</Nav.Link>
						{/* Wyświetl zamiast zaloguj się imię, jeżeli jesteś zalogowany */}
						<UserContext.Consumer>
							{([user]) =>
								!user.logged ? (
									<Nav.Link href="/login">
										Zaloguj się
									</Nav.Link>
								) : (
									<Nav.Link href={`/user/${user.id}`}>
										{user.name}
									</Nav.Link>
								)
							}
						</UserContext.Consumer>
						{/* Wyświetl opcję twoje gry, gdy jesteś zalogowany */}
						<UserContext.Consumer>
							{([user]) =>
								user.logged ? (
									<Nav.Link href="/games">Twoje Gry</Nav.Link>
								) : null
							}
						</UserContext.Consumer>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Navigation;
