import Draggable from 'react-draggable';
import { Button, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import useBreakpoint from 'bootstrap-5-breakpoint-react-hook'; //eslint-disable-line
import CharacterContext from './CharacterContext';
import MaterialIcon from 'material-icons-react';
import SocketContext from '../libs/socket/SocketContext';
import SocketMessages from '../libs/socket/SocketMessages';
import { GlobalHotKeys, configure } from 'react-hotkeys';

const CharacterPanel = () => {
	const currentBreakpoint = useBreakpoint();
	const [isMobile, setIsMobile] = useState(false);
	const [sheetId] = useContext(CharacterContext);
	const [sheet, setSheet] = useState({});
	const [sheetModified, setSheetModified] = useState(false);
	const [timer, setTimer] = useState(0);
	const socket = useContext(SocketContext);
	configure({ ignoreTags: [] });

	useEffect(() => {
		socket.registerOnMessageEvent(SocketMessages.GAME_GET_SHEET, (data) => {
			setSheet(data.sheet);
		});
	}, []);

	useEffect(() => {
		const isMobile = ['xs', 'sm'].includes(currentBreakpoint);
		setIsMobile(isMobile);
	}, [currentBreakpoint]);

	useEffect(() => {
		// jeżeli jeszcze nie ma sheetId, to nic nie rób
		if (typeof sheetId === 'undefined') return;

		// save'uj jak zmieniasz kartę postaci // buguje przechodzenie między postaciami :(
		// if (Object.keys(sheet).length !== 0) saveSheet();

		// żądaj nowej karty postaci
		socket.sendJSON({
			type: SocketMessages.GAME_GET_SHEET,
			user_id: sheetId.user,
			sheet_id: sheetId.sheet,
		});

		setSheetModified(false);
	}, [sheetId]);

	useEffect(() => {
		if (sheetModified == false) return;

		setTimer(30);
	}, [sheetModified]);

	useEffect(() => {
		// jeżeli jeszcze nie ma sheetId, to nic nie rób
		if (typeof sheetId === 'undefined') return;
		// jak skończyło się odliczanie, zapisz
		if (timer == 0) {
			saveSheet();
			return;
		}

		const tim = setTimeout(() => {
			setTimer((old) => old - 1);
		}, 1000);

		return () => clearTimeout(tim);
	}, [timer]);

	const setContent = (content) => {
		const new_character = {
			id: sheet.id,
			name: sheet.name,
			content: content,
		};
		setSheet(new_character);
		setSheetModified(true);
	};

	const setName = (name) => {
		const new_character = {
			id: sheet.id,
			name: name,
			content: sheet.content,
		};
		setSheet(new_character);
		setSheetModified(true);
	};

	const saveSheet = () => {
		socket.sendJSON({
			type: SocketMessages.GAME_SAVE_SHEET,
			user: sheetId.user,
			sheet: sheet,
		});
		setSheetModified(false);
	};

	const keyMap = {
		SAVE: 'ctrl+s',
	};

	const handlers = {
		SAVE: (event) => {
			event.preventDefault();
			saveSheet();
		},
	};

	if (Object.keys(sheet).length === 0)
		return <h2>Wybierz postać z panelu postaci</h2>;

	return (
		<Draggable
			disabled={isMobile}
			position={isMobile ? { x: 0, y: 0 } : null}
			bounds="parent"
			handle="#sheet-handle"
			defaultPosition={{ x: 0, y: 0 }}
			onStart={() => {
				document
					.getElementById('sheet-handle')
					.classList.remove('grab');
				document
					.getElementById('sheet-handle')
					.classList.add('grabbing');
			}}
			onStop={() => {
				document
					.getElementById('sheet-handle')
					.classList.remove('grabbing');
				document.getElementById('sheet-handle').classList.add('grab');
			}}
		>
			<div
				style={{
					width: isMobile ? '100%' : '85%',
					height: isMobile ? '95%' : '65%',
				}}
				className="bg-cardTextarea twoButton"
			>
				<div
					id="sheet-handle"
					className="p-1 bg-light grab rounded-top"
					style={{ height: '6%' }}
				>
					<div className="float-start h-100 text-center">
						<Form.Control
							className="h-100"
							type="text"
							placeholder="Imię"
							required
							value={sheet.name}
							onChange={(e) => setName(e.target.value)}
							style={{ background: '#b7905262', border: 'none' }}
						/>
					</div>
					<div className="float-end h-100 pt-0">
						{sheetModified ? (
							<Button
								variant="link"
								className="h-100 px-3 pt-0 pe-0 text-center"
								onClick={() => saveSheet()}
							>
								<MaterialIcon icon="save" size="tiny" />
							</Button>
						) : null}
					</div>
				</div>
				<div style={{ height: '94%' }}>
					<GlobalHotKeys
						keyMap={keyMap}
						handlers={handlers}
						allowChanges={true}
					/>
					<textarea
						className="font-monospace bg-cardTextarea m-0 p-0"
						style={{
							width: '100%',
							height: '100%',
							resize: 'none',
							whiteSpace: 'nowrap',
						}}
						value={sheet.content}
						onChange={(e) => setContent(e.target.value)}
					></textarea>
				</div>
			</div>
		</Draggable>
	);
};

export default CharacterPanel;
