import { useId, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Responsive, self-hosted image with lazy loading, the image's srcSet, a soft
 * fade-in, and a branded fallback panel if the file cannot be loaded.
 */
export default function SmartImage({
  image,
  src: srcProp,
  alt: altProp,
  className,
  imgClassName,
  priority = false,
  sizes = '100vw',
  decorative = false,
}) {
  const src = srcProp ?? image?.src
  const srcSet = srcProp ? undefined : image?.srcSet
  const alt = decorative ? '' : (altProp ?? image?.alt ?? '')
  const [status, setStatus] = useState('loading')
  const patternId = `fallback-grid-${useId().replace(/:/g, '')}`
  // Only default to `relative` when the caller hasn't positioned the wrapper itself.
  const positioned = /(^|\s)(absolute|fixed)(\s|$)/.test(className ?? '')

  return (
    <div className={cn('overflow-hidden bg-navy/10', !positioned && 'relative', className)}>
      {status === 'error' || !src ? (
        <div
          role={decorative ? undefined : 'img'}
          aria-label={decorative ? undefined : alt}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy to-midnight"
        >
          <svg className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden="true">
            <defs>
              <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0v28" fill="none" stroke="#C7A66A" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
          <ImageOff className="relative h-7 w-7 text-gold/70" aria-hidden="true" />
        </div>
      ) : (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            status === 'loaded' || priority ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
