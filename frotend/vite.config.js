import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: le navigateur ne parle qu'à http://localhost:5173.
// Tout ce qui est API / média / checkout / auth est proxysé vers Django (même origine,
// donc cookies de session + CSRF fonctionnent sans CORS).
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/media': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/static': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/payment/checkout': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/payment/webhook': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/booking/confirmation': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/circuit/confirmation': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
});
