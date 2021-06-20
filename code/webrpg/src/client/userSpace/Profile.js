import { useContext } from 'react';
import { Col, Container, Row, Button, Image } from 'react-bootstrap';
import { Redirect, withRouter } from 'react-router';
import { eraseCookie } from '../libs/socket/Socket';
import UserContext from '../libs/user/UserContext';
import Username from './Username';
import Email from './Email';
import Password from './Password';
import MaterialIcon, { colorPalette } from 'material-icons-react';

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
						className="w-75 mt-5"
					/>
					<Button
						active
						variant="primary"
						onClick={logout}
						className="my-2"
					>
						Wyloguj
						<div className="ps-2 pt-2">
							<MaterialIcon icon="logout" size='small' color="#ffffff" />
						</div>
					</Button>
				</Col>
				<Col>
					<Container className="profileBox p-3">
						<Username />
						<Email />
						<Password />
					</Container>
				</Col>
			</Row>
		</Container>
	);
};

export default withRouter(Profile);
