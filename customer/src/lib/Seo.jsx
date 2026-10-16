import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { company, IS_PLACEHOLDER_DOMAIN, SITE_URL } from '../data/company'
import { images } from '../data/images'

const DEFAULT_IMAGE = images.portAerial.og

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Client-side page metadata. This is a single-page app, so crawlers that do not
 * execute JavaScript only see the defaults in index.html. See README → SEO.
 */
export default function Seo({ title, description, image = DEFAULT_IMAGE, noindex = false }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${company.name}` : `${company.name} | Djibouti Trade & Logistics Coordination`
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
    const desc = description || company.description
    // Keep the placeholder domain out of search indexes until it is replaced.
    const robots = noindex || IS_PLACEHOLDER_DOMAIN ? 'noindex, nofollow' : 'index, follow'

    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('name', 'robots', robots)
    setCanonical(url)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', image)
  }, [title, description, image, noindex, pathname])

  return null
}
