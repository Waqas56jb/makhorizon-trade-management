export const cn = (...classes) => classes.filter(Boolean).join(' ')

const IMG_WIDTHS = [480, 800, 1200, 1600, 2200]

/** Builds src/srcSet for an Unsplash base URL using its on-the-fly resizing. */
export function unsplashSources(src, { width = 1200, ratio } = {}) {
  if (!src || !src.includes('images.unsplash.com')) return { src }
  const build = (w) => {
    const params = new URLSearchParams({ auto: 'format', fit: 'crop', q: '75', w: String(w) })
    if (ratio) params.set('h', String(Math.round(w / ratio)))
    return `${src}?${params.toString()}`
  }
  return {
    src: build(width),
    srcSet: IMG_WIDTHS.map((w) => `${build(w)} ${w}w`).join(', '),
  }
}
