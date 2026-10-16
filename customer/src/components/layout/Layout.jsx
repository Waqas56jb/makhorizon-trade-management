import { Suspense } from 'react'
import { motion } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
import { EASE } from '../../lib/motion'
import { ErrorBoundary, LoadingState } from '../common/States'
import AnnouncementBar from './AnnouncementBar'
import Footer from './Footer'
import Navbar from './Navbar'
import { BackToTop, ScrollToTop } from './ScrollManager'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[100] rounded bg-gold px-4 py-2 font-semibold text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <div className="relative z-[var(--z-header)]">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main id="main-content" tabIndex={-1} className="outline-none">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<LoadingState />}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <BackToTop />
    </>
  )
}
