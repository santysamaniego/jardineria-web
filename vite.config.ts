import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno según el modo (development/production)
  // process.env estará disponible durante el build si es necesario
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Esto asegura que process.env.API_KEY no rompa el build si alguna librería lo referencia,
      // aunque nosotros usamos import.meta.env.VITE_API_KEY principalmente.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    server: {
      port: 5173,
      host: true
    }
  };
});