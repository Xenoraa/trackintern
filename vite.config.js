import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 3000,
    open: true
  },
  css: {
    // Disable lightningcss for Windows 32-bit compatibility
    transformer: 'postcss',
    postcss: './postcss.config.js'
  },
  build: {
    cssMinify: false // Disable CSS minification for compatibility
  }
})