import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'
import SmartImage from '../common/SmartImage'

/** Photographic service card used on the home page and services overview. */
export function ServiceImageCard({ service, index, className }) {
  const Icon = service.icon
  return (
    <Link
      to={service.to}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow duration-500 hover:shadow-lift',
        className,
      )}
    >
      <div className="media-zoom relative aspect-[4/3] overflow-hidden">
        <SmartImage image={service.image} sizes="(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 via-transparent to-midnight/35" />
        {index !== undefined && (
          <span className="absolute left-5 top-4 font-display text-3xl text-white/90">{String(index + 1).padStart(2, '0')}</span>
        )}
        <span className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-navy">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="heading-sm">{service.title}</h3>
        <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed">{service.summary}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy">
          <span className="link-underline">{service.linkLabel ?? 'Learn more'}</span>
          <ArrowUpRight
            className="h-4 w-4 text-gold-deep transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}

/** Compact related-service card used at the bottom of detail pages. */
export function ServiceMiniCard({ service }) {
  const Icon = service.icon
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group flex h-full items-start gap-5 rounded-[var(--radius-card)] border border-line bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-card"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ivory text-gold-deep transition-colors group-hover:bg-navy group-hover:text-gold">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="flex-1">
        <span className="heading-sm block">{service.title}</span>
        <span className="mt-2 block text-sm leading-relaxed">{service.summary}</span>
      </span>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-navy/40 transition-colors group-hover:text-gold-deep" aria-hidden="true" />
    </Link>
  )
}
