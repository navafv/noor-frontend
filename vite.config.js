import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifestFilename: 'manifest.json', // Use existing manifest filename
      manifest: false, // Tell plugin to use the existing manifest.json in /public
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jsx}'], // Cache all standard assets
        // Cache API calls to improve startup speed (notifications, students, courses)
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/v1/notifications'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-notifications',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 }, // 24 hours
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/v1/students'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-students',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
            },
          },
        ],
      },
      // Note: Setting devOptions.enabled to true will allow you to test in development.
      // devOptions: { enabled: true },
    }),
  ],
  server: {
    host: true, // Needed for Docker
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
});