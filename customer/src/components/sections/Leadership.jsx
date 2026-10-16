import { MapPin, Quote, UserRound } from 'lucide-react'
import { company } from '../../data/company'
import { ceoMessage } from '../../data/content'
import { cn } from '../../lib/utils'
import Notice from '../common/Notice'
import { Reveal } from '../common/Reveal'
import SmartImage from '../common/SmartImage'

/** Neutral, clearly labelled placeholder until the genuine CEO portrait is supplied. */
function PortraitPlaceholder() {
  return (
    <div
      role="img"
      aria-label={`Portrait placeholder for ${company.ceo.name}. Official photograph to be supplied.`}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-navy-700 to-midnight"
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
        <defs>
          <pattern id="ceo-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0v32" fill="none" stroke="#C7A66A" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ceo-grid)" />
      </svg>
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-gold/40 bg-white/5">
        <UserRound className="h-16 w-16 text-gold/70" strokeWidth={1.2} aria-hidden="true" />
      </div>
      <p className="relative mt-6 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-white/60">Official portrait to be supplied</p>
    </div>
  )
}

export default function Leadership({ className, headingLevel = 'h2' }) {
  const Heading = headingLevel
  return (
    <section className={cn('section', className)} aria-labelledby="leadership-heading">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)]">
            {company.ceo.portrait ? (
              <SmartImage src={company.ceo.portrait} alt={`Portrait of ${company.ceo.name}, ${company.ceo.title}`} width={784} sizes="(min-width:1024px) 40vw, 90vw" className="h-full w-full" imgClassName="object-[center_25%]" />
            ) : (
              <PortraitPlaceholder />
            )}
          </div>
          <div className="absolute -bottom-6 left-6 right-6 rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-card sm:left-auto sm:right-[-1.5rem] sm:w-72">
            <p className="font-display text-2xl text-navy">{company.ceo.name}</p>
            <p className="mt-1 text-sm">{company.ceo.title}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-deep">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {company.ceo.location}
            </p>
          </div>
        </Reveal>

        <Reveal className="pt-8 lg:pt-0">
          <p className="eyebrow mb-5">Leadership</p>
          <Heading id="leadership-heading" className="display-lg">
            A message from our CEO
          </Heading>
          <div className="relative mt-8">
            <Quote className="absolute -left-1 -top-2 h-10 w-10 text-gold/30" aria-hidden="true" />
            <blockquote className="space-y-5 pl-12">
              {ceoMessage.map((p) => (
                <p key={p.slice(0, 24)} className="font-display text-[1.45rem] leading-snug text-navy lg:text-[1.6rem]">
                  {p}
                </p>
              ))}
              <footer className="pt-2 text-sm font-semibold text-navy">
                — {company.ceo.name}, <span className="font-normal text-body">{company.ceo.title}</span>
              </footer>
            </blockquote>
          </div>
          <Notice className="mt-10 max-w-xl" title="Proposed website copy">
            This message is draft copy prepared for the website and is pending review and approval by the CEO.
          </Notice>
        </Reveal>
      </div>
    </section>
  )
}
