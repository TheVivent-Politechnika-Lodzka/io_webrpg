import { useContext } from 'react';
import { Col, Container, Row, Button, Image } from 'react-bootstrap';
import { Redirect, withRouter } from 'react-router';
import { eraseCookie } from '../libs/socket/Socket';
import UserContext from '../libs/user/UserContext';
import Username from './Username';
import Email from './Email';
import Password from './Password';

const Profile = (props) => {
	const [user, setUser] = useContext(UserContext);

	const logout = () => {
		setUser({
			logged: false,
			...user,
		});
		eraseCookie('id');
		window.location.reload();
	};

	console.log(user);

	if (!user.logged) {
		return <Redirect to="/login" />;
	}

	return (
		<Container className="mt-3">
			<Row>
				<Col xs="12" lg="4" className="text-center">
					<Image
						src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
						roundedCircle
					/>
					<div></div>
					<Button
						active
						variant="primary"
						onClick={logout}
						className="my-2"
					>
						Wyloguj
					</Button>
				</Col>
				<Col>
					<Username />
					<Email />
					<Password />
				</Col>
			</Row>
		</Container>
	);
};

export default withRouter(Profile);
