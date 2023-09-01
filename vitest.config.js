import path from 'path'
import { defineVitestConfig } from 'nuxt-vitest/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineVitestConfig({
  plugins: [
    AutoImport({
      imports: ['vitest'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '~': path.resolve(__dirname, './client'),
      '#imports': path.resolve(__dirname, './.nuxt/imports.d.ts'),
    },
  },
})
