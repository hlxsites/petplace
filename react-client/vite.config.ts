import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/react-test/',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/react-[name]-[hash].js',
        chunkFileNames: 'assets/react-[name]-[hash].js',
        assetFileNames: 'assets/react.[ext]',
      }
    }
  },
  plugins: [react()],
})