import { Button } from 'bootstrap';
import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Redirect, withRouter } from 'react-router';
import UserContext from './UserContext';

const Player = (props) => {
	const [user, setUser] = useContext(UserContext);

	const logout = () => {
		setUser({ logged: false });
	};

	if (!user.logged) {
		return <Redirect to="/login" />;
	}

	return (
		<Container fluid>
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
						test
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default withRouter(Player);
