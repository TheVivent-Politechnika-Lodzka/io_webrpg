import { Button, Modal, Table } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ModalGamesInfo = ({ currModal, toggleModal }) => {
	return (
		<Modal show={true} onHide={() => toggleModal(-1)}>
			<Modal.Header className="fs-3">{currModal.gameName}</Modal.Header>
			<Modal.Body>
				Członkowie pokoju:
				<div>GM: {currModal.gm.username}</div>
				{currModal.players.map((player) => (
					<div key={player._id} className="mx-3">
						- {player.username}
					</div>
				))}
				<Table responsive className="mt-3">
					<thead className="text-center fs-4">
						<tr>
							<th colSpan="2">Numer Pokoju</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<div
									className="text-center"
									style={{ marginTop: '7px' }}
									id="idGameCode"
								>
									<p>{currModal._id}</p>
								</div>
							</td>
							<td className="w-50">
								<CopyToClipboard text={currModal._id}>
									<Button
										className="w-100 "
										active
										variant="outline-lime"
									>
										Kopiuj
									</Button>
								</CopyToClipboard>
							</td>
						</tr>
						<tr></tr>
					</tbody>
				</Table>
			</Modal.Body>
		</Modal>
	);
};

export default ModalGamesInfo;
