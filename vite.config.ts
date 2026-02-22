import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'd3-vendor': ['d3', 'd3-geo', 'd3-hierarchy', 'd3-sankey', 'd3-scale', 'd3-shape'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
  },
})
