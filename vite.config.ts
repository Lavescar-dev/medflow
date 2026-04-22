import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { MODULES, getModulePath } from './src/app/moduleRegistry'

const DEMO_ACCESS_ROUTE = '/demo-access'

function staticRouteEntriesPlugin() {
  return {
    name: 'medflow-static-route-entries',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexFile = path.join(distDir, 'index.html')
      const notFoundFile = path.join(distDir, '404.html')

      if (!existsSync(indexFile)) {
        return
      }

      copyFileSync(indexFile, notFoundFile)

      const routePaths = new Set<string>([
        DEMO_ACCESS_ROUTE,
        ...MODULES.map((module) => getModulePath(module.name)),
      ])

      for (const routePath of routePaths) {
        const normalizedPath = routePath.replace(/^\/+|\/+$/g, '')
        if (!normalizedPath) {
          continue
        }

        const routeDir = path.join(distDir, normalizedPath)
        mkdirSync(routeDir, { recursive: true })
        copyFileSync(indexFile, path.join(routeDir, 'index.html'))
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    staticRouteEntriesPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
