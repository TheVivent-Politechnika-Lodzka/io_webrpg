import { Container, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../img/logo.png';
import UserContext from '../other/UserContext';

const Navigation = () => {
	return (
		<Navbar className="px-2" bg="lime" expand="lg">
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
						<LinkContainer to="/">
							<Nav.Link>Strona główna</Nav.Link>
						</LinkContainer>
						{/* Wyświetl zamiast zaloguj się imię, jeżeli jesteś zalogowany */}
						<UserContext.Consumer>
							{([user]) =>
								!user.logged ? (
									<LinkContainer to="/login">
										<Nav.Link>Zaloguj się</Nav.Link>
									</LinkContainer>
								) : (
									<LinkContainer to={`/user/${user.id}`}>
										<Nav.Link>{user.username}</Nav.Link>
									</LinkContainer>
								)
							}
						</UserContext.Consumer>
						{/* Wyświetl opcję twoje gry, gdy jesteś zalogowany */}
						<UserContext.Consumer>
							{([user]) =>
								user.logged ? (
									<LinkContainer to="/games">
										<Nav.Link>Twoje Gry</Nav.Link>
									</LinkContainer>
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
