import { useContext, useEffect, useState } from 'react';
import UserContext from '../libs/user/UserContext';
import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';
import MaterialIcon from 'material-icons-react';
import { Container, Accordion, Button } from 'react-bootstrap';
import CharacterContext from './CharacterContext';

const PlayersPanel = () => {
	const [players, setPlayers] = useState([]);
	const [activePlayers, setActivePlayers] = useState([]);
	const [gmId, setGmId] = useState('');
	const socket = useContext(SocketContext);
	const [user] = useContext(UserContext);
	const [sheetId, setSheetId] = useContext(CharacterContext);

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

		socket.registerOnMessageEvent(SocketMessages.GAME_GET_GM, (data) => {
			setGmId(data.gmId);
		});
	}, []); //eslint-disable-line

	const deleteSheet = (userId, sheetId) => {
		socket.sendJSON({
			type: SocketMessages.GAME_DELETE_SHEET,
			user: userId,
			sheet: sheetId,
		});
	};

	const addSheet = (userId) => {
		socket.sendJSON({
			type: SocketMessages.GAME_ADD_SHEET,
			user: userId,
		});
	};

	if (players.length == 0 || gmId == '') return <div>Loading...</div>;

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
								{player.username}{' '}
								{player._id == gmId ? '👑' : null}
							</div>
						</Accordion.Header>
						<Accordion.Body>
							{player.sheets.map((sheet) => (
								<div key={sheet.id}>
									{player._id == user.id ||
									user.id == gmId ? (
										<div>
											<Button
												variant="link"
												onClick={() =>
													setSheetId({
														sheet: sheet.id,
														user: player._id,
													})
												}
												className="w-75"
											>
												{sheet.name}
											</Button>
											<Button
												variant="link"
												onClick={() =>
													deleteSheet(
														player._id,
														sheet.id
													)
												}
												className="pt-3 w-25 playerPanelButtonShadow"
											>
												<MaterialIcon icon="delete" />
											</Button>
											<hr></hr>
										</div>
									) : (
										<span>- {sheet.name}</span>
									)}
								</div>
							))}
							{user.id == gmId ? (
								<div>
									<Button
										variant="link"
										onClick={() => addSheet(player._id)}
										className="w-100 bg-cardAdd pt-3 playerPanelButtonShadow"
									>
										<MaterialIcon icon="add" />
									</Button>
								</div>
							) : null}
						</Accordion.Body>
					</Accordion.Item>
				))}
			</Accordion>
		</Container>
	);
};

export default PlayersPanel;
