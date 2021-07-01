import { useContext, useEffect, useState } from 'react';
import UserContext from '../libs/user/UserContext';
import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';
import MaterialIcon from 'material-icons-react';

const PlayersPanel = () => {
	const [players, setPlayers] = useState([]);
	const [activePlayers, setActivePlayers] = useState([]);
	const socket = useContext(SocketContext);

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
	}, []);

	// useEffect(()=>{
	//     console.log(activePlayers)
	// }, [activePlayers])

	if (players.length == 0) return <div>Loading...</div>;

	return (
		<div>
			{players.map((player) => (
				<div key={player._id}>
					<div className="w-25 d-inline-block">

						<div
							className={
								activePlayers.includes(player._id)
									? 'd-none'
									: null
							}
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

						{/* <MaterialIcon
							icon="fiber_manual_record"
							color={
								activePlayers.includes(player._id)
									? '#2ECC71'
									: '#E74C3C'
							}
						/> */}
					</div>
					<div className="w-75 d-inline-block">
						{player.username} [{player._id}]
					</div>
				</div>
			))}
		</div>
	);
};

export default PlayersPanel;
