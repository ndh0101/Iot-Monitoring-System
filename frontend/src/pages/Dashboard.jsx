import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FaFan, FaLightbulb, FaSnowflake } from "react-icons/fa"
import { SensorAPI } from '../services/api.js'
import { connect, onMessage, sendAction } from '../services/ws.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip)

function pad(n){ return n.toString().padStart(2,'0') }
function hhmmss(date){
	const d = typeof date === 'string' ? new Date(date) : date
	return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default function Dashboard(){
	const chartRef = useRef(null)
	const chartInstanceRef = useRef(null)
	const [kpi, setKpi] = useState({ temperature: 0, humidity: 0, light: 0 })
	// Khởi tạo state từ localStorage
	const [state, setState] = useState(() => {
		const saved = localStorage.getItem("deviceState")
		return saved ? JSON.parse(saved) : { fan: false, air: false, lamp: false }
	})

	// Mỗi khi state thay đổi thì lưu vào localStorage
	useEffect(() => {
		localStorage.setItem("deviceState", JSON.stringify(state))
	}, [state])

	useEffect(() => {
		connect()
		const off = onMessage((data) => {
			if(data.temperature > 0){
				setKpi({ temperature: data.temperature, humidity: data.humidity, light: data.light })
				appendPoint({ t: new Date(), temp: data.temperature, hum: data.humidity, light: data.light })
			}
		})
		return off
	}, [])

	useEffect(() => {
		connect()
		const off = onMessage((data) => {
			if(['fan','air','lamp'].includes(data.device_id)){
				setState(s => ({...s, [data.device_id]: data.status === 'on'}))
			}
		})
		return off
	}, [])

	useEffect(() => {
		SensorAPI.getPage(1).then((data) => {
			if(Array.isArray(data.getPage) && data.getPage[0]){
				const row = data.getPage[0]
				setKpi({ temperature: row.temperature, humidity: row.humidity, light: row.light })
				appendPoint({ t: new Date(row.time || Date.now()), temp: row.temperature, hum: row.humidity, light: row.light })
			}
		})
	}, [])

	useEffect(() => {
		if(!chartRef.current) return
		if(chartInstanceRef.current){ chartInstanceRef.current.destroy() }
		const ctx = chartRef.current.getContext('2d')
		chartInstanceRef.current = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{ label: 'Nhiệt độ', data: [], yAxisID: 'y1', borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.2)', tension:.3 },
					{ label: 'Độ ẩm', data: [], yAxisID: 'y1', borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,.2)', tension:.3 },
					{ label: 'Ánh sáng', data: [], yAxisID: 'y2', borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,.2)', tension:.3 }
				]
			},
			options: {
				responsive: true,
				plugins: { legend: { position: 'top' }, tooltip: { mode: 'index', intersect: false } },
				scales: {
					x: { type: 'category' },
					y1: { type: 'linear', position: 'left', min:0, max:100, ticks: { stepSize: 20 } },
					y2: { type: 'linear', position: 'right', min:0, max:1024, ticks: { stepSize: 200 }, grid: { drawOnChartArea: false } }
				}
			}
		})
		return () => chartInstanceRef.current?.destroy()
	}, [])

	function appendPoint(p){
		const chart = chartInstanceRef.current
		if(!chart) return
		const labels = chart.data.labels
		const ds = chart.data.datasets
		const label = hhmmss(p.t)
		labels.push(label)
		if(labels.length > 8) labels.shift()
		ds[0].data.push(p.temp)
		ds[1].data.push(p.hum)
		ds[2].data.push(p.light)
		ds.forEach(d => { if(d.data.length > 8) d.data.shift() })
		chart.update('none')
	}

	const format = useMemo(() => ({
		t: `${kpi.temperature}°C`,
		h: `${kpi.humidity}%`,
		l: `${kpi.light} Lux`
	}), [kpi])

	function toggle(device){
		const next = !state[device]
		setState(s => ({...s, [device]: next}))
		sendAction({ device_id: device, status: next ? 'on' : 'off', time: new Date().toLocaleString('sv-SE').replace('T',' ').slice(0,19) })
	}

	function StatusBar({ value, max, type }) {
		let color = '#22c55e' // xanh
		if (type === 'temperature') {
			if (value > 35) color = '#ef4444'
			else if (value > 25) color = '#eab308'
		} else if (type === 'humidity') {
			if (value < 20 || value > 85) color = '#ef4444'
			else if (value < 40 || value > 70) color = '#eab308'
		} else if (type === 'light') {
			if (value < 100 || value > 800) color = '#ef4444'
			else if (value < 200 || value > 600) color = '#eab308'
		}

		return (
			<div style={{ height: 6, background: '#e5e7eb', borderRadius: 4, marginTop: 4 }}>
			<div style={{
			  	width: `${Math.min(100, (value / max) * 100)}%`,
				background: color,
				height: '100%',
				borderRadius: 4,
				transition: 'width .3s ease'
			}} />
			</div>
		)
	}

	return (
		<div>
			<div className="header"><h1>Dashboard</h1></div>
			<div className="kpi">
				<div className="card">
					Nhiệt độ: {format.t}
					<StatusBar value={kpi.temperature} max={100} type="temperature" />
				</div>
				<div className="card">
					Độ ẩm: {format.h}
					<StatusBar value={kpi.humidity} max={100} type="humidity" />
				</div>
				<div className="card">
					Ánh sáng: {format.l}
					<StatusBar value={kpi.light} max={1024} type="light" />
				</div>
			</div>
			<div className="row">
				<div className="card" style={{flex:1,minHeight:300}}>
					<h3 style={{marginTop:0}}>Frequency</h3>
					<canvas ref={chartRef} height="120" />
				</div>
				<div className="right">
					<div className="toggle">
						<FaFan size={40} className={state.fan ? "spin" : ""} style={{color: state.fan ? "#3b82f6" : "#9ca3af"}} />
						<span>Quạt</span>
						<input className="switch" type="checkbox" checked={state.fan} onChange={() => toggle('fan')} />
					</div>
					<div className="toggle">
						<FaSnowflake size={40} className={state.air ? "pulse" : ""} style={{color: state.air ? "#06b6d4" : "#9ca3af"}} />
						<span>Điều hòa</span>
						<input className="switch" type="checkbox" checked={state.air} onChange={() => toggle('air')} />
					</div>
					<div className="toggle">
						<FaLightbulb size={40} style={{color: state.lamp ? "#facc15" : "#9ca3af"}} />
						<span>Đèn</span>
						<input className="switch" type="checkbox" checked={state.lamp} onChange={() => toggle('lamp')} />
					</div>
				</div>
			</div>
		</div>
	)
}