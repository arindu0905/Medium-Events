import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Shared code from the public site (palette); keeps both apps visually identical
      '@site': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
});
