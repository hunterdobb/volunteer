import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'silent',
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  plugins: [react()],
})
