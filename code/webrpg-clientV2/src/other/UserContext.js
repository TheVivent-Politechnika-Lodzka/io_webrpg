import { createContext } from 'react';

const UserContext = createContext([
	{ logged: true, name: null, id: null },
	() => {},
]);

export default UserContext;
