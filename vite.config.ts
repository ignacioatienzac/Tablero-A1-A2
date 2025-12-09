import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base' configura las rutas como relativas ('./') en lugar de absolutas ('/').
  // Esto es CRUCIAL para que la app cargue en GitHub Pages (ej: usuario.github.io/mi-juego/)
  // ya que evita que el navegador busque los archivos en la raíz del dominio.
  base: './', 
})