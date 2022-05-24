import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UsernameProvider } from './hooks/username'
import Groups from "./pages/Groups";

function App() {
	return (
		<UsernameProvider>
			<Groups />
		</UsernameProvider>
	)
}

export default App
