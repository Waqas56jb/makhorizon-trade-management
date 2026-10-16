import { motion } from 'motion/react'
import { ArrowRight, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/common/Button'
import SmartImage from '../components/common/SmartImage'
import { images } from '../data/images'
import { EASE } from '../lib/motion'
import Seo from '../lib/Seo'

const quickLinks = [
  { label: 'Services', to: '/services' },
  { label: 'Trade Solutions', to: '/trade-solutions' },
  { label: 'Partnerships', to: '/partnerships' },
  { label: 'Request a Quote', to: '/request-quote' },
]

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you are looking for could not be found." noindex />
      <section className="on-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-midnight text-white">
        <SmartImage image={images.shipAtSea} decorative priority width={1920} className="absolute inset-0 -z-10 h-full w-full opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/50" aria-hidden="true" />
        <div className="container-site pb-20 pt-[calc(var(--header-h)+5rem)]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="max-w-2xl">
            <p className="eyebrow mb-6">
              <Compass className="h-4 w-4" aria-hidden="true" /> Error 404
            </p>
            <h1 className="display-xl text-white">This page has drifted off course.</h1>
            <p className="lead mt-6 text-white/75">
              The page you are looking for may have moved or no longer exists. Let’s get you back to familiar waters.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/" arrow>
                Back to home
              </ButtonLink>
              <ButtonLink to="/contact" variant="outline-light">
                Contact the company
              </ButtonLink>
            </div>
            <nav aria-label="Popular pages" className="mt-14 border-t border-white/10 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">Popular pages</p>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                {quickLinks.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="link-underline text-sm">
                      {l.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </div>
      </section>
    </>
  )
}
