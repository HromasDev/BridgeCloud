import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
const apiUrl = process.env.VITE_API_URL;

console.log(apiUrl);


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: apiUrl,
			},
		},
	},
})
