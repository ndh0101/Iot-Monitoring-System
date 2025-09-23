import { useState } from 'react';
import avatar from '../documents/avatar.jpg'; // ảnh trong folder documents

export default function Profile(){
  const [form, setForm] = useState({
    name: 'Nguyễn Duy Hoàng',
	msv: 'B22DCCN334',
	class: 'D22HTTT05',
    email: 'duyhoang.edu.green@gmail.com',
    phone: '0364837982',
    github: 'github.com/ndh0101/Iot-Monitoring-System',
	document: 'https://docs.google.com/document/d/1kfpZckfvKEXumeIe_i1_A_z45pZUAfNsSOnFImFtRf8/edit?usp=sharing',
	apidocument: 'http://localhost:8080/api-docs',
  })
  function set(key, value){ 
    setForm(f => ({...f, [key]: value})) 
  }

  return (
    <div>
      <div className="header"><h1>Profile</h1></div>
      <div className="card" style={{maxWidth:1600}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 200px', gap:20, alignItems:'start'}}>
          
          {/* Cột trái */}
			<div style={{flex:1, display:'grid', gap:16}}>
			<label style={{fontWeight:'bold'}}>
				Họ và tên
				<input 
				className="input" disabled 
				value={form.name} 
				onChange={e=>set('name', e.target.value)} 
				style={{marginTop:4}} 
				/>
			</label>
			<label style={{fontWeight:'bold'}}>
				Mã sinh viên
				<input 
				className="input" disabled 
				value={form.msv} 
				onChange={e=>set('name', e.target.value)} 
				style={{marginTop:4}} 
				/>
			</label>
			<label style={{fontWeight:'bold'}}>
				Lớp
				<input 
				className="input" disabled 
				value={form.class} 
				onChange={e=>set('name', e.target.value)} 
				style={{marginTop:4}} 
				/>
			</label>
			<label style={{fontWeight:'bold'}}>
				Email
				<input 
				className="input" disabled
				value={form.email} 
				onChange={e=>set('email', e.target.value)} 
				style={{marginTop:4}} 
				/>
			</label>
			<label style={{fontWeight:'bold'}}>
				SĐT
				<input 
				className="input" disabled
				value={form.phone} 
				onChange={e=>set('phone', e.target.value)} 
				style={{marginTop:4}} 
				/>
			</label>
			<label style={{fontWeight:'bold'}}>
				Github
				<input 
				className="input" disabled
				value={form.github} 
				onChange={e=>set('link', e.target.value)} 
				style={{marginTop:4}} 
				/>
			</label>
			<label style={{fontWeight:'bold'}}>
				Tài liệu
				<input 
				className="input" disabled
				value={form.document} 
				onChange={e=>set('link', e.target.value)} 
				style={{marginTop:4}} 
				/>
			</label>
			<label style={{fontWeight:'bold'}}>
				API Document
				<input 
				className="input" disabled
				value={form.apidocument} 
				onChange={e=>set('link', e.target.value)} 
				style={{marginTop:4}} 
				/>
			</label>
			</div>

          {/* Cột phải */}
		  <div style={{marginTop:16}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
            <img src={avatar} alt="Ảnh đại diện" style={{width:100, height:100, borderRadius:'50%', objectFit:'cover'}} />
            <span style={{fontWeight:'bold'}}>Ảnh đại diện</span>
          </div>
		  </div>
        </div>
      </div>
    </div>
  )
}
