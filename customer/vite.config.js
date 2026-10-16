import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { sitemapRoutes } from './src/data/routes.js'

const PLACEHOLDER_SITE_URL = 'https://www.makhorizon.example'

/**
 * Emits sitemap.xml and robots.txt at build time using VITE_SITE_URL, so the
 * production domain is configured in one place (.env) instead of hardcoded.
 */
function seoFiles(siteUrl, allowIndexing) {
  return {
    name: 'makhorizon-seo-files',
    apply: 'build',
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const urls = sitemapRoutes
        .map(
          (r) =>
            `  <url>\n    <loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
        )
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: allowIndexing
          ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
          : `# Indexing disabled until VITE_SITE_URL is set to the confirmed production domain.\nUser-agent: *\nDisallow: /\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || PLACEHOLDER_SITE_URL).replace(/\/$/, '')
  const allowIndexing = siteUrl !== PLACEHOLDER_SITE_URL

  return {
    plugins: [react(), tailwindcss(), seoFiles(siteUrl, allowIndexing)],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) return 'forms'
              if (id.includes('motion') || id.includes('framer')) return 'motion'
              if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react'
            }
          },
        },
      },
    },
  }
})
