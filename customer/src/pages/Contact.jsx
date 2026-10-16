import { useState } from 'react'
import { Building2, Check, Clock, Copy, Handshake, Mail, Phone } from 'lucide-react'
import { ButtonLink } from '../components/common/Button'
import Notice from '../components/common/Notice'
import { Reveal, RevealGroup, RevealItem } from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'
import ContactForm from '../components/forms/ContactForm'
import { contactCategories } from '../components/forms/schemas'
import PageHero from '../components/sections/PageHero'
import { company } from '../data/company'
import { images } from '../data/images'
import Seo from '../lib/Seo'

function CopyAddress() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${company.name}, ${company.address.full}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-gold hover:text-gold"
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {copied ? 'Address copied' : 'Copy address'}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Address copied to clipboard' : ''}
      </span>
    </button>
  )
}

/** Lightweight, API-free location illustration of Djibouti on the Gulf of Tadjoura. */
function LocationIllustration() {
  return (
    <figure className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-[#e9eef2]">
      <svg viewBox="0 0 600 380" className="h-auto w-full" role="img" aria-labelledby="loc-title loc-desc">
        <title id="loc-title">Stylised location illustration</title>
        <desc id="loc-desc">A simplified, not-to-scale illustration marking Djibouti City on the coast of the Gulf of Tadjoura.</desc>
        <defs>
          <pattern id="loc-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0v30" fill="none" stroke="#172B3A" strokeOpacity=".06" />
          </pattern>
        </defs>
        {/* Sea */}
        <rect width="600" height="380" fill="#dfe7ed" />
        <rect width="600" height="380" fill="url(#loc-grid)" />
        {/* Stylised landmass with gulf inlet */}
        <path
          d="M0 120 C 80 110, 140 150, 210 170 C 260 185, 300 175, 340 190 C 380 205, 400 240, 450 240 C 500 240, 540 220, 600 230 L600 380 L0 380 Z"
          fill="#f5f3ee"
          stroke="#172B3A"
          strokeOpacity=".15"
        />
        <path d="M0 250 C 120 260, 220 300, 330 290 S 520 310, 600 300" fill="none" stroke="#172B3A" strokeOpacity=".08" strokeDasharray="4 6" />
        <text x="120" y="80" fill="#536170" style={{ font: 'italic 500 18px var(--font-display)' }}>
          Gulf of Tadjoura
        </text>
        <text x="430" y="120" fill="#536170" style={{ font: 'italic 500 18px var(--font-display)' }}>
          Gulf of Aden
        </text>
        {/* Marker */}
        <circle cx="430" cy="236" r="10" fill="#C7A66A" className="pulse-ring" />
        <circle cx="430" cy="236" r="8" fill="#172B3A" stroke="#C7A66A" strokeWidth="3" />
        <g transform="translate(300 268)">
          <rect width="220" height="64" rx="6" fill="#101E2A" />
          <text x="16" y="27" fill="#fff" style={{ font: '700 14px var(--font-sans)', letterSpacing: '.04em' }}>
            MAKHORIZON
          </text>
          <text x="16" y="47" fill="#C7A66A" style={{ font: '500 12px var(--font-sans)' }}>
            Salam Tower, 5th Floor · Djibouti
          </text>
        </g>
      </svg>
      <figcaption className="border-t border-line bg-white px-5 py-3 text-xs text-body">
        Illustration only — not to scale. Detailed directions can be provided on request.
      </figcaption>
    </figure>
  )
}

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        description="Contact MAKHORIZON Logistics & Trade at Salam Tower, 5th Floor, Djibouti, about logistics, import-export, supplier opportunities or partnerships."
      />
      <PageHero
        eyebrow="Contact"
        title="Start a conversation with our team."
        intro="Whether you have a specific trade requirement or a general question, we would be glad to hear from you."
        image={images.officeTowers}
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <aside className="space-y-6" aria-label="Contact details">
            <Reveal className="on-dark rounded-[var(--radius-card)] bg-navy p-8 text-white">
              <Building2 className="h-6 w-6 text-gold" aria-hidden="true" />
              <h2 className="heading-sm mt-5 text-white">Our office</h2>
              <address className="mt-3 not-italic leading-relaxed text-white/80">
                {company.name}
                <br />
                {company.address.building}, {company.address.floor}
                <br />
                {company.address.city}
              </address>
              <CopyAddress />
              {(company.phone || company.email) && (
                <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                  {company.phone && (
                    <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                      <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                      {company.phone}
                    </a>
                  )}
                  {company.email && (
                    <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-sm text-white/80 hover:text-white">
                      <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
                      {company.email}
                    </a>
                  )}
                </div>
              )}
            </Reveal>

            <Reveal className="rounded-[var(--radius-card)] border border-line bg-white p-8">
              <Clock className="h-6 w-6 text-gold-deep" aria-hidden="true" />
              <h2 className="heading-sm mt-5">Business hours</h2>
              <p className="mt-3 text-sm leading-relaxed">
                {company.businessHours ?? 'Business hours will be published here once confirmed by the company.'}
              </p>
            </Reveal>

            <Reveal>
              <LocationIllustration />
            </Reveal>
          </aside>

          <div>
            <Reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card sm:p-10">
              <h2 className="display-md">Send us a message</h2>
              <p className="mt-3">Choose the category that best describes your inquiry so it can be directed appropriately.</p>
              <Notice className="mb-8 mt-6" title="Frontend demo">
                Messages are validated locally but not sent until the website is connected to the company’s backend.
              </Notice>
              <ContactForm />
            </Reveal>

            <div className="mt-12">
              <SectionHeading eyebrow="Inquiry categories" title="What you can contact us about" size="md" />
              <RevealGroup as="ul" className="mt-6 flex flex-wrap gap-2.5" gap={0.04}>
                {contactCategories.map((c) => (
                  <RevealItem as="li" key={c} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-navy">
                    {c}
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="pb-20 lg:pb-28">
        <div className="container-site">
          <Reveal className="flex flex-col items-start justify-between gap-8 rounded-[var(--radius-card)] border border-gold/40 bg-white p-8 sm:p-12 lg:flex-row lg:items-center">
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                <Handshake className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="display-md">Interested in partnering with MAKHORIZON?</h2>
                <p className="mt-2">Suppliers, distributors, logistics providers and strategic partners can use our dedicated partnership form.</p>
              </div>
            </div>
            <ButtonLink to="/partnerships" variant="navy" arrow className="shrink-0">
              Partnership inquiries
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  )
}
