import { useEffect, useState } from 'react'
const API_BASE = ''
async function fetchJson(url){
	const res = await fetch(url)
	if(!res.ok) throw new Error(await res.text())
	return res.json()
}

export default function DataSensor(){
	const [rows, setRows] = useState([])
	const [page, setPage] = useState(1)
	const [info, setInfo] = useState({ numPage: 1 })
	const [search, setSearch] = useState('')
	const [searchBy, setSearchBy] = useState('id')
	const [error, setError] = useState('')
	const [size, setPageSize] = useState(10)
	const [sortBy, setSortBy] = useState('id')
	const [order, setOrder] = useState('DESC')

	useEffect(() => { load(page, size) }, [page, size, sortBy, order])

	async function load(page, size){
		setError('')
		try {
			let data
			if(search){ 
				// search mode
				data = await fetchJson(`${API_BASE}/api/sensor/search?type=${searchBy}&search=${encodeURIComponent(search)}&page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`)
				setRows(data.getSearch ?? [])
				setInfo(data.getSearchInfo ?? { numPage: 1 })
			}else{
				// normal load
				data = await fetchJson(`${API_BASE}/api/sensor/data?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`)
				setRows(data.getPage ?? [])
				setInfo(data.getInfo ?? { numPage: 1 })
			}
		}catch(e){
			setError(String(e.message || e))
		}
	}

	async function onSearch(e){
		e.preventDefault()
		load(1, size)
		setPage(1)
	}

	function formatTime(timeStr){
		if(!timeStr) return ''
		const d = new Date(timeStr)
		const pad = n => n.toString().padStart(2, '0')
		return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
	}

	return (
		<div>
			<div className="header"><h1>Data Sensor</h1></div>
			<div className="card">
				{/* Search UI */}
				<div style={{display:'flex',gap:16,alignItems:'end',marginBottom:16,flexWrap:'wrap'}}>
					<div>
						<label style={{display:'block',marginBottom:4,fontWeight:500}}>Tìm kiếm:</label>
						<input 
							className="input" 
							placeholder="Tìm kiếm theo thông số" 
							value={search} 
							onChange={e=>setSearch(e.target.value)} 
							style={{width:150}}
						/>
					</div>
					<div>
						<label style={{display:'block',marginBottom:4,fontWeight:500}}>Tìm kiếm theo:</label>
						<select 
							className="input" 
							value={searchBy} 
							onChange={e=>setSearchBy(e.target.value)}
							style={{width:120}}
						>
							<option value="id">ID</option>
							<option value="temperature">Nhiệt độ</option>
							<option value="humidity">Độ ẩm</option>
							<option value="light">Ánh sáng</option>
							<option value="time">Thời gian</option>
						</select>
					</div>
					<button 
						onClick={onSearch}
						style={{
							background:'#1E2F62',
							color:'white',
							border:'none',
							padding:'10px 20px',
							borderRadius:'8px',
							cursor:'pointer',
							fontWeight:500
						}}
					>
						Tìm kiếm
					</button>
				</div>

				{/* Sort UI */}
				<div style={{display:'flex',gap:16,alignItems:'end',marginBottom:16,flexWrap:'wrap'}}>
					<div>
						<label style={{display:'block',marginBottom:4,fontWeight:500}}>Sắp xếp theo:</label>
						<select 
							className="input" 
							value={sortBy} 
							onChange={e=>setSortBy(e.target.value)}
							style={{width:150}}
						>
							<option value="id">ID</option>
							<option value="temperature">Nhiệt độ</option>
							<option value="humidity">Độ ẩm</option>
							<option value="light">Ánh sáng</option>
							<option value="time">Thời gian</option>
						</select>
					</div>
					<div>
						<label style={{display:'block',marginBottom:4,fontWeight:500}}>Thứ tự:</label>
						<select 
							className="input" 
							value={order} 
							onChange={e=>setOrder(e.target.value)}
							style={{width:120}}
						>
							<option value="ASC">Tăng dần</option>
							<option value="DESC">Giảm dần</option>
						</select>
					</div>
				</div>

				{/* Error */}
				{error && <div style={{color:'#b91c1c',marginBottom:8}}>Lỗi: {error}</div>}

				{/* Table */}
				<table className="table">
					<thead>
						<tr style={{background:'#1E2F62',color:'white'}}>
							<th>ID</th>
							<th>Nhiệt độ</th>
							<th>Độ ẩm</th>
							<th>Ánh sáng</th>
							<th>Thời gian</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((r,i)=> (
							<tr key={i}>
								<td>{r.id}</td>
								<td>{r.temperature}°C</td>
								<td>{r.humidity}%</td>
								<td>{r.light} Lux</td>
								<td>{formatTime(r.time)}</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Pagination */}
				<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16}}>
					<div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
						<button onClick={()=> setPage(1)} disabled={page<=1}>First</button>
						<button onClick={()=> setPage(p=> Math.max(1,p-1))} disabled={page<=1}>Previous</button>
						<span>Page: </span>
							<input
							type="number"
							value={page}
							min={1}
							max={info.numPage}
							onChange={e => {
								let val = Number(e.target.value)
								if (isNaN(val)) return
								if (val < 1) val = 0
								if (val > info.numPage) val = info.numPage
								setPage(val)
							}}
							style={{width:40,textAlign:'center'}}
							/>
							<span>of {info.numPage}</span>
						<button onClick={()=> setPage(p=> Math.min(info.numPage,p+1))} disabled={page>=info.numPage}>Next</button>
						<button onClick={()=> setPage(info.numPage)} disabled={page>=info.numPage}>Last</button>
					</div>
					<div style={{display:'flex',alignItems:'center',gap:8}}>
						<span>Page size:</span>
						<select value={size} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1) }}>
							<option value="10">10</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	)
}
