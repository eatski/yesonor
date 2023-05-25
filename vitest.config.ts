import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  test: {
    alias: {
        '@': './src',
    },
    testTimeout: 10000
  },
})