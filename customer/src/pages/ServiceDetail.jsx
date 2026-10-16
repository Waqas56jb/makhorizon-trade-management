import { useState } from 'react'
import { Check, ClipboardList, Copy, Users } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { ButtonLink } from '../components/common/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'
import SmartImage from '../components/common/SmartImage'
import CTASection from '../components/sections/CTASection'
import FAQAccordion from '../components/sections/FAQAccordion'
import PageHero from '../components/sections/PageHero'
import ProcessTimeline from '../components/sections/ProcessTimeline'
import { ServiceMiniCard } from '../components/sections/ServiceCard'
import { getServiceBySlug } from '../data/services'
import Seo from '../lib/Seo'
import NotFound from './NotFound'

function PrepareChecklist({ items, serviceTitle }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    const text = `Information to prepare — ${serviceTitle} (MAKHORIZON Logistics & Trade)\n${items.map((i) => `• ${i}`).join('\n')}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-card lg:p-10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-gold-deep" aria-hidden="true" />
          <h2 className="heading-sm">Information to prepare</h2>
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-navy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy list'}
        </button>
      </div>
      <p className="mt-3 text-sm">Having these details ready makes the first conversation more productive.</p>
      <ul className="mt-6 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[0.95rem] text-navy">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ivory">
              <Check className="h-3 w-3 text-gold-deep" aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Checklist copied to clipboard' : ''}
      </span>
      <ButtonLink to="/request-quote" variant="navy" arrow className="mt-8 w-full">
        Request a quote
      </ButtonLink>
    </div>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)
  if (!service) return <NotFound />

  const Icon = service.icon
  const related = service.related.map(getServiceBySlug).filter(Boolean)

  return (
    <>
      <Seo title={service.title} description={service.summary} image={`${service.heroImage.src}?auto=format&fit=crop&w=1200&h=630&q=80`} />
      <PageHero
        eyebrow={service.title}
        title={service.headline}
        intro={service.summary}
        image={service.heroImage}
        breadcrumbs={[{ label: 'Services', to: '/services' }, { label: service.shortTitle ?? service.title }]}
      >
        <ButtonLink to="/request-quote" arrow>
          Request a discussion
        </ButtonLink>
        <ButtonLink to="/services" variant="outline-light">
          All services
        </ButtonLink>
      </PageHero>

      {/* Description + checklist */}
      <section className="section">
        <div className="container-site grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <div>
            <Reveal>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-gold">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="display-lg mt-8">What this service involves</h2>
              <div className="mt-8 space-y-5">
                {service.intro.map((p, i) => (
                  <p key={i} className={i === 0 ? 'lead' : ''}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
            <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
              {service.focusAreas.map((f) => (
                <RevealItem key={f.title} className="bg-white p-7">
                  <h3 className="heading-sm">{f.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed">{f.text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <PrepareChecklist items={service.prepare} serviceTitle={service.title} />
          </Reveal>
        </div>
      </section>

      {/* Who may benefit */}
      <section className="section bg-white" aria-labelledby="benefit-heading">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal className="media-zoom relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
            <SmartImage image={service.image} width={1000} sizes="(min-width:1024px) 45vw, 100vw" className="h-full w-full" />
          </Reveal>
          <div>
            <SectionHeading eyebrow="Who may benefit" title={<span id="benefit-heading">Who this is designed for.</span>} />
            <RevealGroup as="ul" className="mt-10 space-y-4">
              {service.beneficiaries.map((b) => (
                <RevealItem as="li" key={b} className="flex items-start gap-4 border-b border-line pb-4">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
                  <span className="font-medium text-navy">{b}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="on-dark section bg-navy text-white" aria-labelledby="workflow-heading">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <p className="eyebrow mb-5">Typical workflow</p>
            <h2 id="workflow-heading" className="display-lg text-white">
              How {service.shortTitle ?? service.title} usually works.
            </h2>
            <p className="lead mt-6 text-white/70">The exact steps for your project are agreed during the initial discussion.</p>
          </Reveal>
          <ProcessTimeline steps={service.workflow} dark className="mt-16" />
        </div>
      </section>

      {/* FAQs */}
      <section className="section" aria-labelledby="detail-faq-heading">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="FAQs" title={<span id="detail-faq-heading">Common questions</span>} />
          <Reveal>
            <FAQAccordion items={service.faqs} />
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="section bg-white pb-0" aria-labelledby="related-heading">
        <div className="container-site">
          <SectionHeading eyebrow="Related services" title={<span id="related-heading">Often combined with</span>} size="md" />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <RevealItem key={r.slug}>
                <ServiceMiniCard service={r} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <div className="bg-white">
        <CTASection
          eyebrow="Next step"
          title={`Discuss your ${(service.shortTitle ?? service.title).toLowerCase()} requirement.`}
          text="Send us the details and the team can talk through what support would be appropriate."
          image={service.heroImage}
        />
      </div>
    </>
  )
}
