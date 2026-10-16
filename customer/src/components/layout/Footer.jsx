import { ArrowRight, ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company } from '../../data/company'
import { footerNav } from '../../data/navigation'
import { allServices } from '../../data/services'
import Logo from '../common/Logo'

// Evaluated when the bundle loads, so the copyright year is always current.
const YEAR = new Date().getFullYear()

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-gold">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.to + l.label}>
            <Link to={l.to} className="text-sm text-white/70 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const serviceLinks = allServices.map((s) => ({ label: s.shortTitle ?? s.title, to: s.to.split('#')[0] }))
  // De-duplicate links that point to the same page (e.g. partnership services).
  const uniqueServiceLinks = serviceLinks.filter((l, i, arr) => arr.findIndex((x) => x.to === l.to) === i)

  return (
    <footer className="on-dark relative overflow-hidden bg-midnight text-white">
      {/* Partnership CTA band */}
      <div className="border-b border-white/10">
        <div className="container-site flex flex-col items-start justify-between gap-8 py-14 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Partnerships</p>
            <p className="display-md text-white">Exploring a supplier, distribution or logistics collaboration?</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/partnerships" className="btn btn-gold">
              Propose a partnership
              <ArrowRight className="btn-arrow h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/contact" className="btn btn-outline-light">
              Contact the team
            </Link>
          </div>
        </div>
      </div>

      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div className="max-w-sm">
          <Logo imgClassName="h-16 sm:h-20" />
          <p className="mt-6 text-sm leading-relaxed text-white/65">{company.description}</p>
        </div>
        <FooterColumn title="Company" links={footerNav.company} />
        <FooterColumn title="Services" links={uniqueServiceLinks} />
        <div>
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-gold">Contact</h2>
          <address className="mt-5 space-y-4 not-italic">
            <p className="flex items-start gap-3 text-sm text-white/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>
                {company.address.building}, {company.address.floor}
                <br />
                {company.address.city}
              </span>
            </p>
            {company.phone && (
              <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-white/75 hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {company.phone}
              </a>
            )}
            {company.email && (
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-sm text-white/75 hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {company.email}
              </a>
            )}
          </address>
          <Link to="/contact" className="link-underline mt-6 text-sm">
            Send an inquiry
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {company.social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-4">
              {company.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {YEAR} {company.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerNav.legal.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-white">
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              Back to top
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
