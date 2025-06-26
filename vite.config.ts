import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/video_feed': 'http://localhost:5000',
      // otras rutas que quieras proxiar
    },
  },
  base: '/chadwi/'
})