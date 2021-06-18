import { withRouter } from 'react-router';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useContext, useState } from 'react';
import UserContext from '../libs/user/UserContext';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../libs/socket/Socket';
import useBreakpoint from 'bootstrap-5-breakpoint-react-hook';

const Game = (props) => {
	const id = props.match.params.id;
	const currentBreakpoint = useBreakpoint();
	const [user] = useContext(UserContext);
	const [panelState, setPanelState] = useState({ isBig: false });

	const togglePanelState = () => {
		setPanelState({ isBig: !panelState.isBig });
	};

	// jeżeli użytkownik nie jest zalogowany, to
	// przekieruj na stronę główną
	if (!user.logged) {
		// jeżeli jest ustawione cookie, to user pewnie jest zalogowany
		// tylko auto-logowanie jeszcze się nie odbyło
		if (!getCookie('id')) {
			return <Redirect to="/" />;
		}
	}

	return (
		<Container fluid className="p-0 m-0 game">
			<Row className="p-0 m-0 h-100 overflow-hidden">
				<Col className="h-100 m-0">{id}</Col>
				<Col
					xs={{ span: 12, order: 'first' }}
					md={{ span: 5, order: 'last' }}
					lg="4"
					xl="3"
					className="m-0 gamePanel"
				>
					{!['xs', 'sm'].includes(currentBreakpoint) ||
					panelState.isBig
						? 'panel'
						: null}
					{['xs', 'sm'].includes(currentBreakpoint) ? (
						<Button
							active
							variant="primary"
							className="w-100"
							onClick={() => togglePanelState()}
						>
							≡
						</Button>
					) : null}
				</Col>
			</Row>
		</Container>
	);
};

export default withRouter(Game);
