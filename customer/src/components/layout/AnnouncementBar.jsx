import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company } from '../../data/company'

export default function AnnouncementBar() {
  const { message, linkLabel, linkTo } = company.announcement
  if (!message) return null
  return (
    <div className="on-dark border-b border-white/10 bg-midnight text-white/80">
      <div className="container-site flex min-h-10 flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-center text-[0.75rem] font-medium tracking-wide">
        <p>{message}</p>
        {linkTo && (
          <Link to={linkTo} className="group inline-flex items-center gap-1.5 font-semibold text-gold hover:text-gold-light">
            {linkLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  )
}
