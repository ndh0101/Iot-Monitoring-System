import { useEffect, useState } from 'react'

const API_BASE = ''
async function fetchJson(url){
	const res = await fetch(url)
	if(!res.ok) throw new Error(await res.text())
	return res.json()
}

export default function ActionHistory(){
	const [rows, setRows] = useState([])
	const [page, setPage] = useState(1)
	const [size, setPageSize] = useState(10)
	const [info, setInfo] = useState({ numPage: 1 })
	const [search, setSearch] = useState('')
	const [searchBy, setSearchBy] = useState('id')
	const [sortBy, setSortBy] = useState('id')
	const [order, setOrder] = useState('DESC')
	const [device, setDevice] = useState('all')
	const [status, setStatus] = useState('all')
	const [error, setError] = useState('')

	useEffect(() => { load(page, size) }, [page, size, sortBy, order, device, status])

	async function load(page, size){
		setError('')
		try {
			let data
			const params = `page=${page}&size=${size}&sortBy=${sortBy}&order=${order}&device=${device}&status=${status}`
			if(search){
				// search mode
				data = await fetchJson(`${API_BASE}/api/action/search?type=${searchBy}&search=${encodeURIComponent(search)}&${params}`)
				setRows(data.getActionSearch ?? [])
				setInfo(data.getActionSearchInfo ?? { numPage: 1 })
			}else{
				// normal load
				data = await fetchJson(`${API_BASE}/api/action/data?${params}`)
				setRows(data.getActionPage ?? [])
				setInfo(data.getActionInfo ?? { numPage: 1 })
			}
		} catch (e) {
			setError(String(e.message || e))
		}
	}
	async function onSearch(e){
		e.preventDefault()
		setPage(1)
		load(1, size)
	}
	function formatTime(timeStr){
		if(!timeStr) return ''
		const d = new Date(timeStr)
		const pad = n => n.toString().padStart(2, '0')
		return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
	}

	function getDeviceLabel(deviceId){
		const labels = {
			'fan': 'Quạt',
			'air': 'Điều hòa', 
			'lamp': 'Đèn'
		}
		return labels[deviceId] || deviceId
	}

	return (
		<div>
			<div className="header"><h1>Action History</h1></div>
			<div className="card">
				{/* Search + Sort + Filter UI */}
				<div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginBottom:16,flexWrap:'wrap',gap:16}}>
				{/* Left: Search */}
				<div style={{display:'flex',gap:16,alignItems:'end',flexWrap:'wrap'}}>
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

				{/* Right: Sort + Filter */}
				<div style={{display:'flex',gap:16,alignItems:'end',flexWrap:'wrap'}}>
					<div>
					<label style={{display:'block',marginBottom:4,fontWeight:500}}>Sắp xếp theo:</label>
					<select className="input" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:150}}>
						<option value="id">ID</option>
						<option value="time">Thời gian</option>
					</select>
					</div>
					<div>
					<label style={{display:'block',marginBottom:4,fontWeight:500}}>Thứ tự:</label>
					<select className="input" value={order} onChange={e=>setOrder(e.target.value)} style={{width:120}}>
						<option value="ASC">Tăng dần</option>
						<option value="DESC">Giảm dần</option>
					</select>
					</div>
					<div>
					<label style={{display:'block',marginBottom:4,fontWeight:500}}>Thiết bị:</label>
					<select className="input" value={device} onChange={e=>{ setDevice(e.target.value); setPage(1) }} style={{width:150}}>
						<option value="all">Tất cả</option>
						<option value="lamp">Đèn</option>
						<option value="air">Điều hòa</option>
						<option value="fan">Quạt</option>
					</select>
					</div>
					<div>
					<label style={{display:'block',marginBottom:4,fontWeight:500}}>Trạng thái:</label>
					<select className="input" value={status} onChange={e=>{ setStatus(e.target.value); setPage(1) }} style={{width:120}}>
						<option value="all">Tất cả</option>
						<option value="on">Bật</option>
						<option value="off">Tắt</option>
					</select>
					</div>
				</div>
				</div>
				{/* Error */}
				{error && <div style={{color:'#b91c1c',marginBottom:8}}>Lỗi: {error}</div>}
				{/* Table */}
				<table className="table">
					<thead>
						<tr style={{background:'#1E2F62',color:'white'}}>
							<th>ID</th>
							<th>Thiết bị</th>
							<th>Hành động</th>
							<th>Thời gian thực hiện</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((r,i)=> (
							<tr key={i}>
								<td>{r.id}</td>
								<td>{getDeviceLabel(r.device_id)}</td>
								<td>{r.status === 'on' ? 'Bật' : 'Tắt'}</td>
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
							<option value="20">20</option>
							<option value="50">50</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	)
}
