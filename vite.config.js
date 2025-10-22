import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
          'pdf-vendor': ['html2pdf.js', 'jspdf'],
          'office-vendor': ['xlsx'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'stripe-vendor': ['@stripe/stripe-js', 'stripe'],
          'clerk-vendor': ['@clerk/clerk-react'],
          'icons': ['lucide-react'],
          'utils': ['zustand', 'react-hot-toast']
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
