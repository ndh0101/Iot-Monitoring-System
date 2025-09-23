import react from '@vitejs/plugin-react'

export default {
	plugins: [react()],
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
				ws: true
			}
		}
	}
} 