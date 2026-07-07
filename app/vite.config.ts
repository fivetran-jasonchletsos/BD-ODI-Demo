import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This repo is local-only for now (not deployed to GitHub Pages), so the
// app is always served from the root path.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
