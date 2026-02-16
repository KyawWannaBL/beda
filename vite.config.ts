// vite.config.ts
export default defineConfig({
  // ... existing config
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-icons': ['lucide-react'],
          'vendor-ui': ['framer-motion', '@radix-ui/react-dialog'],
          'vendor-db': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Raises limit to 1MB to hide the warning
  },
});