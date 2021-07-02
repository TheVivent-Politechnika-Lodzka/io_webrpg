import Draggable from 'react-draggable';
import { Button, FloatingLabel, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import useBreakpoint from 'bootstrap-5-breakpoint-react-hook'; //eslint-disable-line
import CharacterContext from './CharacterContext';
import MaterialIcon from 'material-icons-react';

const CharacterPanel = () => {
	const currentBreakpoint = useBreakpoint();
	const [isMobile, setIsMobile] = useState(false);
	const [sheets, setSheets] = useContext(CharacterContext);
    const [character, setCharacter] = useState({})
	const [sheetModified, setSheetModified] = useState(true);

    useEffect(()=>{
        if (Object.keys(sheets).length === 0) return
        setCharacter(sheets.sheets[sheets.index])
    }, [sheets])

	useEffect(() => {
		const isMobile = ['xs', 'sm'].includes(currentBreakpoint);
		setIsMobile(isMobile);
	}, [currentBreakpoint]);

	const setContent = (content) => {
		const new_character = {
			name: character.name,
			content: content,
		};
		setCharacter(new_character);
		setSheetModified(true);
	};

	const setName = (name) => {
		const new_character = {
			name: name,
			content: character.content,
		};
		setCharacter(new_character);
		setSheetModified(true);
	};

	const saveSheet = () => {
		console.log("I'm saving");
        var new_sheets = {...sheets}
        new_sheets.sheets[sheets.index] = character
        setSheets(new_sheets)
        setSheetModified(false);
	};

	if (Object.keys(character).length === 0)
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
                        <FloatingLabel label="Imię" className="m-3">
                            <Form.Control
                                type="text"
                                placeholder="Imię"
                                required
                                value={character.name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                style={{ background: '#b7905262' }}
                            />
                        </FloatingLabel>
					</div>
					<div className="float-end h-100">
						{sheetModified ? (
							<Button
								variant="link"
								className="h-100 px-3 mx-1 text-center"
								onClick={() => saveSheet()}
							>
								<MaterialIcon icon="save" size="tiny" />
							</Button>
						) : null}
					</div>
				</div>
				<div style={{ height: '94%' }}>
					<textarea
						className="font-monospace bg-cardTextarea m-0 p-0"
						style={{
							width: '100%',
							height: '100%',
							resize: 'none',
							whiteSpace: 'nowrap',
						}}
						value={character.content}
						onChange={(e) => setContent(e.target.value)}
					></textarea>
				</div>
			</div>
		</Draggable>
	);
};

export default CharacterPanel;
