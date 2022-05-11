import React from 'react'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

const UsernameContext = React.createContext()

function useUsername() {
	const storedUsername =
		localStorage.getItem('username') ||
		uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: '', length: 2 })

	const [username, setUsername] = React.useState(storedUsername)

	const storeUsername = (username) => {
		localStorage.setItem('username', username)
		setUsername(username)
	}

	return {
		username,
		storeUsername,
	}
}

export function UsernameProvider({ children }) {
	const usernameState = useUsername()

	return <UsernameContext.Provider value={usernameState}>{children}</UsernameContext.Provider>
}

export default function UsernameConsumer() {
	return React.useContext(UsernameContext)
}
