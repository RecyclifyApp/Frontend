import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
	return (
		<div className='defaultLayout'>
			<Navbar />
			<Outlet />
		</div>
	)
}

export default App
