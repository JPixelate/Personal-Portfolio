import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',
    cssMinify: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('lucide-react')) return 'lucide-react';
            if (id.includes('three') || id.includes('@react-three')) return 'three-core';
            return 'vendor';
          }
        }
      }
    }
  }
})
