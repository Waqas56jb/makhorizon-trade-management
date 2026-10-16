import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useLocation, useNavigationType } from 'react-router-dom'
import useScrolled from '../../hooks/useScrolled'

/**
 * Scrolls to the top on navigation, or to the #hash target when present.
 * Hash targets on lazily loaded pages are retried briefly until they render.
 * Browser back/forward (POP) keeps the browser's own scroll restoration.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    if (navType === 'POP' && !hash) return
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }
    let tries = 0
    let timer
    const attempt = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (tries++ < 20) {
        timer = setTimeout(attempt, 100)
      }
    }
    attempt()
    return () => clearTimeout(timer)
  }, [pathname, hash, navType])

  return null
}

export function BackToTop() {
  const visible = useScrolled(900)
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-navy text-white shadow-lift transition-colors hover:bg-gold hover:text-midnight sm:bottom-8 sm:right-8"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
