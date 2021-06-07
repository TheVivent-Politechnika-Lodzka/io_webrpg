import { useContext } from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { Redirect, withRouter } from 'react-router';
import { eraseCookie } from './Socket';
import UserContext from './UserContext';

const Player = (props) => {
	const [user, setUser] = useContext(UserContext);

	const logout = () => {
		setUser({
			logged: false,
			name: 'nuk tuk',
			id: 'your mom',
			email: 'none',
		});
		eraseCookie('id');
		window.location.reload()
	};

	if (!user.logged) {
		return <Redirect to="/login" />;
	}

	return (
		<Container>
			<Row>
				<Col>id: </Col>
				<Col>{props.match.params.id}</Col>
			</Row>
			<Row>
				<Col>Hello</Col>
				<Col>{props.match.params.id}</Col>
			</Row>
			<Row>
				<Col>
					<Button active variant="primary" onClick={logout}>
						Wyloguj
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default withRouter(Player);
