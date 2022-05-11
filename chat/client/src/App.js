import React from 'react'
import { UsernameProvider } from './hooks/username'
import Chat from './pages/Chat'

function App() {
	return (
		<UsernameProvider>
			<Chat />
		</UsernameProvider>
	)
}

export default App
