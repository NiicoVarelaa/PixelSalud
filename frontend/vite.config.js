import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // ⚠️ Asegúrate de que esta URL coincida EXACTAMENTE con la que te dio Cloudflare/el túnel
    allowedHosts: [
      'sarah-recommended-supplement-steve.trycloudflare.com',
      'chess-aviation-thereafter-helping.trycloudflare.com'  
    ]
  },
})
