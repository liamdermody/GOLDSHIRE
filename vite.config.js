import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
  // Using a custom domain? Keep base default.
  // If this is a project page (URL contains /REPO/), set: base: '/GOLDSHIRE/'
})
