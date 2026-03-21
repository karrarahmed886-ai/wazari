import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// للنشر على GitHub Pages (مشروع تحت /اسم-المستودع/) عيّن في CI أو .env.local:
// VITE_BASE_URL=/wazari/
const base =
  process.env.VITE_BASE_URL ||
  (process.env.GITHUB_PAGES === 'true' ? '/wazari/' : '/')

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true
  }
})
