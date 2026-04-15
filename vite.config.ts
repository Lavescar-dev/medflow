import { copyFileSync, existsSync } from 'node:fs'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function spaFallbackPlugin() {
  return {
    name: 'medflow-spa-fallback',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexFile = path.join(distDir, 'index.html')
      const notFoundFile = path.join(distDir, '404.html')

      if (existsSync(indexFile)) {
        copyFileSync(indexFile, notFoundFile)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    spaFallbackPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
