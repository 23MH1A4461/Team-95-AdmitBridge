import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Port 5174 as defined in System Architecture (see root README.md)
    port: 5174
  },
  test: {
    environment: 'jsdom',
    globals: true
  }
})
