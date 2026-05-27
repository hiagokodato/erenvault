import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'react'
          if (id.includes('/react-router-dom/')) return 'router'
          if (id.includes('/@tanstack/react-query/')) return 'query'
          if (id.includes('/@supabase/')) return 'supabase'
          if (id.includes('/framer-motion/')) return 'motion'
          if (id.includes('/lucide-react/')) return 'ui'
          return 'vendor'
        },
      },
    },
  },
})
