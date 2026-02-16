import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. Define Global Constants
  define: {
    __ROUTE_MESSAGING_ENABLED__: JSON.stringify(true), // or your logic here
  },

  resolve: {
    alias: {
      // 2. Setup Aliases 
      // This allows you to use @/pages instead of ../../../pages
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // 3. Optimization for Enterprise scale
    outDir: 'dist',
    sourcemap: false, // Set to true only for debugging production
    rollupOptions: {
      output: {
        // Manual chunking helps with the "Duplicate Class" or large bundle issues
        // by splitting vendor code (like Lucide, Radix, Supabase) into separate files
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-slot', 'lucide-react', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Prevent build failure on minor warnings, but keep it strict for errors
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 3000,
    strictPort: true,
    host: true, // Needed for Docker or network testing
  },
});