import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // COOP 헤더 제거
      'Cross-Origin-Opener-Policy': '',
      'Cross-Origin-Embedder-Policy': '',
    },
  }
})
