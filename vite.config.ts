import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Add this import

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This tells Vite that @ translates to the /src folder
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
  }
});