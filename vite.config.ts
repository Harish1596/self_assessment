import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': process.env.RECALL_API_TARGET ?? 'http://127.0.0.1:3001' } },
  preview: { proxy: { '/api': process.env.RECALL_API_TARGET ?? 'http://127.0.0.1:3001' } },
});
