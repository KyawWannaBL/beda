import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  base: './', // Ensures assets are found relative to index.html on mobile
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-native': 'react-native-web',
      'expo-modules-core': path.resolve(__dirname, 'node_modules/expo-modules-core'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js', '.json']
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      // Treat react-native as external if alias isn't enough for some sub-deps
      external: [], 
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
    }
  }
});