// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/webhook': {
        target: 'https://ventures01.app.n8n.cloud',
        changeOrigin: true,
        secure: true,
        base : '/pitchtank/'
      }
    }
  }
})
