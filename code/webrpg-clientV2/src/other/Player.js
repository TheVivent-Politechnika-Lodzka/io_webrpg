import { withRouter } from 'react-router';

const Player = (props) => {
	return <h1>{props.match.params.id}</h1>;
};

export default withRouter(Player);
