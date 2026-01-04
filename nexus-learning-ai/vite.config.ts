import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // Base must be '/' for Vercel
    base: '/',
    // Explicitly point to the public directory
    publicDir: 'public',
    define: {
      // Safely expose API keys to the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')
    },
    build: {
      // Force output to 'dist'
      outDir: 'dist',
      // Clean old builds
      emptyOutDir: true,
      sourcemap: false
    }
  };
});