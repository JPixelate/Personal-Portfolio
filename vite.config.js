import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Trigger reload

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Use terser for better minification (better than esbuild for production)
    minify: 'terser',
    cssMinify: true,
    target: 'esnext',
    // Enable source maps for debugging (can be disabled for production)
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
        passes: 2, // Run compression twice for better results
      },
      mangle: {
        safari10: true, // Fix Safari 10 issues
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    rollupOptions: {
      output: {
        // Improved manual chunking strategy
        manualChunks(id) {
          // Separate node_modules into logical chunks
          if (id.includes('node_modules')) {
            // React core libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Animation libraries
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            // Icon library
            if (id.includes('lucide-react')) {
              return 'lucide-react';
            }
            // 3D libraries (largest dependency)
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-core';
            }
            // AI/ML libraries
            if (id.includes('@google/generative-ai')) {
              return 'ai-vendor';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // Markdown
            if (id.includes('react-markdown')) {
              return 'markdown';
            }
            // Everything else
            return 'vendor';
          }
        },
        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  // Enable tree-shaking
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [],
  },
})
