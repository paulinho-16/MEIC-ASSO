import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UpProvider } from './hooks/up';
import Groups from "./pages/Groups";

function App() {
	return (
		<UpProvider>
			<Groups />
		</UpProvider>
	)
}

export default App
