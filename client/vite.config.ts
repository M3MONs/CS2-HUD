import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react'

const BACKEND_URL = 'http://localhost:8000';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: BACKEND_URL,
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
