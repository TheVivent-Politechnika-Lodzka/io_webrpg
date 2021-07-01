import { Button, Modal, Container, Table, Col, Row } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MaterialIcon from 'material-icons-react';

const ModalGamesInfo = ({ display, currModal, toggleModal }) => {
	if (!display) {
		return null;
	}

	return (
		<Modal show={display} onHide={() => toggleModal(-1)}>
			<Modal.Header className="fs-3 bg-modal fw-bolder">
				{currModal.gameName}
			</Modal.Header>
			<Modal.Body className="bg-modal text-center">
				<Container>
					<Row>
						<Col>
							<p className="fw-bolder fs-6 mb-0">
								Członkowie pokoju:
							</p>
						</Col>
						<Col>
							<div>
								<MaterialIcon icon="grade" />
								<p
									className="fw-bolder fst-italic"
									style={{ display: 'inline' }}
								>
									GM: {currModal.gm.username}
								</p>
								<MaterialIcon icon="grade" />
							</div>
							{currModal.players.map((player) => (
								<div
									key={player._id}
									className="mx-3 fw-bold fw-light"
								>
									- {player.username}
								</div>
							))}
						</Col>
					</Row>
				</Container>
				<Container>
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
				</Container>
			</Modal.Body>
		</Modal>
	);
};

export default ModalGamesInfo;
