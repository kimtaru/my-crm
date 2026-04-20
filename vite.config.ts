import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@mycrm-ui/components': path.resolve(__dirname, '../mycrm-ui/packages/components/src/index.ts'),
      '@mycrm-ui/react': path.resolve(__dirname, '../mycrm-ui/packages/react/src/index.ts'),
      '@mycrm-ui/table': path.resolve(__dirname, '../mycrm-ui/packages/table/src/index.ts'),
      '@mycrm-ui/react-table': path.resolve(__dirname, '../mycrm-ui/packages/react-table/src/index.ts'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
