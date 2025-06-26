import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/chadwi/',
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/video_feed': 'http://localhost:5000',
      // otras rutas que quieras proxiar
    },
  },
})