// Public, indexable routes. Shared by the router-facing data and the build-time
// sitemap generator in vite.config.js, so keep this file free of React imports.
export const serviceSlugs = [
  'logistics-coordination',
  'import-export',
  'cargo-transportation',
  'trade-support',
  'supplier-partnerships',
  'document-coordination',
]

export const sitemapRoutes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  ...serviceSlugs.map((slug) => ({ path: `/services/${slug}`, priority: '0.8', changefreq: 'monthly' })),
  { path: '/trade-solutions', priority: '0.8', changefreq: 'monthly' },
  { path: '/partnerships', priority: '0.8', changefreq: 'monthly' },
  { path: '/request-quote', priority: '0.7', changefreq: 'yearly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
]
