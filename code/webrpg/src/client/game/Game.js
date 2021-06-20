import { withRouter } from 'react-router';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../libs/user/UserContext';
import { Redirect } from 'react-router-dom';
import { getCookie } from '../libs/socket/Socket';
import useBreakpoint from 'bootstrap-5-breakpoint-react-hook'; //eslint-disable-line

const Game = (props) => {
	const id = props.match.params.id;
	const currentBreakpoint = useBreakpoint();
	const [user] = useContext(UserContext);
	const [panelState, setPanelState] = useState({
		isMobile: false,
		isBig: false,
	});

	// aktualizacja czy w trybie mobilnym
	useEffect(() => {
		const isMobile = ['xs', 'sm'].includes(currentBreakpoint);
		setPanelState({
			...panelState,
			isMobile: isMobile,
		});
	}, [currentBreakpoint]);

	// aktualizacja czy kliknięto przycisk powiększenia panelu w trybie mobilnym
	const togglePanelState = () => {
		setPanelState({
			...panelState,
			isBig: !panelState.isBig,
		});
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
				{/* main area */}
				<Col className="h-100 m-0">{id}</Col>

				{/* panel */}
				<Col
					xs={{ span: 12, order: 'first' }}
					md={{ span: 5, order: 'last' }}
					lg="4"
					xl="3"
					className={`m-0 p-0 gamePanel ${
						panelState.isBig ? 'h-100' : null
					}`}
				>
					<Container fluid className="h-100 m-0 p-0">
						{/* tutaj cała zawartość panelu */}
						{!panelState.isMobile || panelState.isBig ? (
							<span>
								<Row
									className="m-0 p-0"
									style={{
										height: '65%',
										backgroundColor: 'red',
									}}
								>
									<Col>zawartość (nicki itp)</Col>
								</Row>
								<Row
									className="m-0 p-0"
									style={{
										height: `${
											30 + (panelState.isMobile ? 0 : 5)
										}%`,
										backgroundColor: 'green',
									}}
								>
									<Col>chat</Col>
								</Row>
							</span>
						) : null}

						<Row
							className="m-0 p-0"
							style={{
								height: `${5 - (panelState.isMobile ? 0 : 5)}%`,
								backgroundColor: 'blue',
							}}
						>
							<Col>
								{/* przycisk do pokazywania / ukrywania panelu w trybie mobilnym */}
								{panelState.isMobile ? (
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
				</Col>
			</Row>
		</Container>
	);
};

export default withRouter(Game);
