import { Link } from 'react-router-dom'
import logoSrc from '../../assets/brand/logo.webp'
import markSrc from '../../assets/brand/logo-mark.webp'
import { cn } from '../../lib/utils'

// Intrinsic sizes of the exported assets, used to reserve space and avoid layout shift.
const LOGO = { width: 640, height: 173 }
const MARK = { width: 240, height: 186 }

/**
 * Official MAKHORIZON logo (background removed). It is designed for dark
 * surfaces, so it is always placed on navy: header, mobile menu and footer.
 */
export function LogoMark({ className }) {
  return <img src={markSrc} width={MARK.width} height={MARK.height} alt="" aria-hidden="true" className={cn('h-auto shrink-0', className)} />
}

export default function Logo({ className, imgClassName = 'h-12', onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="MAKHORIZON Logistics & Trade — home"
      className={cn('group inline-flex shrink-0 items-center', className)}
    >
      <img
        src={logoSrc}
        width={LOGO.width}
        height={LOGO.height}
        alt="MAKHORIZON Global Logistics & Trade"
        decoding="async"
        fetchPriority="high"
        className={cn(
          'w-auto select-none transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-[1.02]',
          imgClassName,
        )}
        draggable="false"
      />
    </Link>
  )
}
