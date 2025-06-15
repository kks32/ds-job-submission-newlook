import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
  base: process.env.NODE_ENV === 'production' ? '/mpm/' : '/',
  server: {
    port: 3000,
    host: true
  }
})