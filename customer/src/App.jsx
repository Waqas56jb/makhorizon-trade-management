import { lazy, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

const RELOAD_KEY = 'mkh-chunk-reload'
const loaders = []

/**
 * Code-split page that survives a flaky connection: a failed download is retried
 * once, then the page reloads once (which also recovers when a new deploy has
 * replaced the old chunk files). After that the route's ErrorBoundary takes over.
 */
function lazyPage(load) {
  let loaded = null
  const remember = (module) => (loaded = module)
  loaders.push(() => load().then(remember))
  return lazy(() => {
    // Already downloaded (e.g. by the background prefetch): hand React the module
    // synchronously so it renders without flashing the loading screen.
    if (loaded) return { then: (resolve) => resolve(loaded) }
    return load()
      .catch(() => new Promise((resolve) => setTimeout(resolve, 1500)).then(load))
      .then((module) => {
        try {
          sessionStorage.removeItem(RELOAD_KEY)
        } catch {
          // Storage unavailable: nothing to clear.
        }
        return remember(module)
      })
      .catch((error) => {
        let reloaded = false
        try {
          reloaded = sessionStorage.getItem(RELOAD_KEY) === '1'
          sessionStorage.setItem(RELOAD_KEY, '1')
        } catch {
          reloaded = true
        }
        if (!reloaded) {
          window.location.reload()
          return new Promise(() => {})
        }
        throw error
      })
  })
}

/** Downloads every other page in the background once the browser is idle, so later navigation is instant. */
function usePrefetchPages() {
  useEffect(() => {
    if (navigator.connection?.saveData) return
    let cancelled = false
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1200))
    const start = () =>
      idle(async () => {
        for (const load of loaders) {
          if (cancelled) return
          await load().catch(() => {})
        }
      })
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener('load', start)
    }
  }, [])
}

// The home page ships in the main bundle; every other route is code-split.
const About = lazyPage(() => import('./pages/About'))
const Services = lazyPage(() => import('./pages/Services'))
const ServiceDetail = lazyPage(() => import('./pages/ServiceDetail'))
const TradeSolutions = lazyPage(() => import('./pages/TradeSolutions'))
const Partnerships = lazyPage(() => import('./pages/Partnerships'))
const RequestQuote = lazyPage(() => import('./pages/RequestQuote'))
const Contact = lazyPage(() => import('./pages/Contact'))
const PrivacyPolicy = lazyPage(() => import('./pages/PrivacyPolicy'))
const Terms = lazyPage(() => import('./pages/Terms'))
const NotFound = lazyPage(() => import('./pages/NotFound'))

export default function App() {
  usePrefetchPages()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="trade-solutions" element={<TradeSolutions />} />
        <Route path="partnerships" element={<Partnerships />} />
        <Route path="request-quote" element={<RequestQuote />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
