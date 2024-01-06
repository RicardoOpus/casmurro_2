import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: {
        name: 'Casmurro',
        short_name: 'Casmurro',
        description: 'Escreva com paixão, organize com precisão',
        theme_color: '#161618',
        icons: [
          {
            src: './images/favicon.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: './',
});
