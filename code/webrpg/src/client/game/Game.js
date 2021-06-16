import { withRouter } from 'react-router';

const Game = (props) => {
	const id = props.match.params.id;

	return <h1>Gra o id: {id}</h1>;
};

export default withRouter(Game);
