import React from 'react'

const UpContext = React.createContext()

function useUp() {
	const search = window.location.search;
	let up = new URLSearchParams(search).get('up');
	if (!up) up = '201806461';

	return { up };
}

export function UpProvider({ children }) {
	const up = useUp();

	return <UpContext.Provider value={up}>{children}</UpContext.Provider>
}

export default function UsernameConsumer() {
	return React.useContext(UpContext)
}
