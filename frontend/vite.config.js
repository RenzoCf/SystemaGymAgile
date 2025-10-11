import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite accesos externos (necesario para ngrok)
    port: 5173, // asegúrate de que sea el mismo puerto que usas con ngrok
    allowedHosts: ['coralie-nonelicited-justifyingly.ngrok-free.dev'], // tu dominio de ngrok
    cors: true // permite peticiones desde otros dispositivos
  }
});
