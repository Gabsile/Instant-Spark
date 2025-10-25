import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configure esbuild to treat .js files as JSX during dependency scanning
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  esbuild: {
    // Fallback loader for transforms
    loader: 'jsx'
  }
})
