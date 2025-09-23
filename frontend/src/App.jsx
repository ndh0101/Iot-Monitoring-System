import { NavLink, Route, Routes } from 'react-router-dom'
import ActionHistory from './pages/ActionHistory.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DataSensor from './pages/DataSensor.jsx'
import Profile from './pages/Profile.jsx'

export default function App(){
	return (
		<div className="app">
			<aside className="sidebar">
				<h2 style={{margin:0}}>Admin Iot</h2>
				<NavLink to="/" end>Dashboard</NavLink>
				<NavLink to="/sensor">Data Sensor</NavLink>
				<NavLink to="/actions">Action History</NavLink>
				<NavLink to="/profile">Profile</NavLink>
			</aside>
			<main className="content">
				<Routes>
					<Route path="/" element={<Dashboard/>} />
					<Route path="/sensor" element={<DataSensor/>} />
					<Route path="/actions" element={<ActionHistory/>} />
					<Route path="/profile" element={<Profile/>} />
				</Routes>
			</main>
		</div>
	)
} 