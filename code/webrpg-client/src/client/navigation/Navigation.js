import { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../img/logo.png';
import UserContext from '../other/UserContext';

const Navigation = () => {
	const [user] = useContext(UserContext);

	return (
		<Navbar className="px-2" bg="lime" expand="lg">
			<Container fluid>
				<LinkContainer to="/">
					<Navbar.Brand>
						<img
							style={{ height: '2em' }}
							src={logo}
							className="d-inline-block allign-top"
							alt="webRPG"
						/>
					</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<LinkContainer to="/">
							<Nav.Link>Strona główna</Nav.Link>
						</LinkContainer>

						{/* jeżeli użytkownik nie jest zalogowany wyświetle "zaloguj"
							w przeciwnym wypadku wyświetl jego nick */}
						{!user.logged ? (
							<LinkContainer to="/login">
								<Nav.Link>Zaloguj się</Nav.Link>
							</LinkContainer>
						) : (
							<LinkContainer to={`/user/${user.id}`}>
								<Nav.Link>{user.username}</Nav.Link>
							</LinkContainer>
						)}

						{/* jeżeli użytkownik jest zalogowany wyświetl "twoje gry" */}
						{user.logged ? (
							<LinkContainer to="/games">
								<Nav.Link>Twoje Gry</Nav.Link>
							</LinkContainer>
						) : null}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Navigation;
