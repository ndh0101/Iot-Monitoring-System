let socket
const listeners = new Set()
const pendingMessages = []

export function connect(url = 'ws://localhost:8080'){
	if(socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return socket
	socket = new WebSocket(url)
	socket.onopen = () => {
		console.log('WS connected')
		while(pendingMessages.length){
			const msg = pendingMessages.shift()
			try{ socket.send(msg); console.log('WS flush:', msg) }
			catch(err){ console.error('WS flush error', err); break }
		}
	}
	socket.onclose = () => console.log('WS disconnected')
	socket.onmessage = (event) => {
		try{
			const data = JSON.parse(event.data)
			listeners.forEach(l => l(data))
		}catch(err){
			console.error('WS parse error', err)
		}
	}
	return socket
}

export function sendAction(action){
	const payload = JSON.stringify(action)
	if(socket && socket.readyState === WebSocket.OPEN){
		console.log('WS send:', payload)
		socket.send(payload)
		return true
	}
	if(!socket || socket.readyState === WebSocket.CLOSED){
		connect()
	}
	console.log('WS queue:', payload)
	pendingMessages.push(payload)
	return false
}

export function onMessage(handler){
	listeners.add(handler)
	return () => listeners.delete(handler)
} 