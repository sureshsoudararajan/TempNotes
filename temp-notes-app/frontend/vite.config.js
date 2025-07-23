import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure this is set correctly for your deployment
  define: {
    // This is important for some libraries that might expect process.env.NODE_ENV
    // Vite automatically handles import.meta.env.VITE_*, but some older libs might use process.env
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    '__DEFINES__': {},
  },
})