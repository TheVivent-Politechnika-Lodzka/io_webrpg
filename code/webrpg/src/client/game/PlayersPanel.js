import { useContext, useEffect, useState } from 'react';
import UserContext from '../libs/user/UserContext';
import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';
import MaterialIcon from 'material-icons-react';
import { Container, Accordion } from 'react-bootstrap';

const PlayersPanel = () => {
	const [players, setPlayers] = useState([]);
	const [activePlayers, setActivePlayers] = useState([]);
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext)

	useEffect(() => {
		socket.registerOnMessageEvent(
			SocketMessages.GAME_GET_ALL_PLAYERS,
			(data) => {
				setPlayers(data.players);
			}
		);

		socket.registerOnMessageEvent(
			SocketMessages.GAME_GET_ACTIVE_PLAYERS,
			(data) => {
				setActivePlayers(data.active_players);
			}
		);
	}, []); //eslint-disable-line

	if (players.length == 0) return <div>Loading...</div>;

	return (
		<Container className="m-0 p-0 w-100">
			<h1 className="text-center mt-4 mb-3">Lista Graczy</h1>
			<Accordion defaultActiveKey={user.id} flush={true}>
				{players.map((player) => (
					<Accordion.Item key={player._id} eventKey={player._id}>
						<Accordion.Header>
							<div className="w-25 d-inline-block pt-1 mt-2 ps-2">
								<div
									className={
										activePlayers.includes(player._id)
											? 'd-none'
											: null
									}
									style={{ verticalAlign: 'bottom' }}
								>
									<MaterialIcon
										icon="fiber_manual_record"
										color="#E74C3C"
									/>
								</div>

								<div
									className={
										activePlayers.includes(player._id)
											? null
											: 'd-none'
									}
								>
									<MaterialIcon
										icon="fiber_manual_record"
										color="#2ECC71"
									/>
								</div>
							</div>
							<div
								className="w-75 d-inline-block  mt-2"
								style={{ verticalAlign: 'top' }}
							>
								{player.username}
								{/* [{player._id}] */}
							</div>
						</Accordion.Header>
						<Accordion.Body>
							{console.log(player.sheets)}
							{player.sheets.map((sheet, index)=>(
								<div key={index}>- {sheet.name}</div>
							))}
						</Accordion.Body>
					</Accordion.Item>
				))}
			</Accordion>
		</Container>
	);
};

export default PlayersPanel;
