import {resolve} from 'node:path'
import {defineConfig} from 'vite'

export default defineConfig({
  base: './',
  root: 'src',
  build: {
    outDir: resolve(__dirname, 'release'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    assetsInlineLimit: 8192,
  },
  worker: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  plugins: [],
})
