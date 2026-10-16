import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../components/common/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'
import SmartImage from '../components/common/SmartImage'
import CTASection from '../components/sections/CTASection'
import FAQAccordion from '../components/sections/FAQAccordion'
import PageHero from '../components/sections/PageHero'
import ProcessTimeline from '../components/sections/ProcessTimeline'
import { servicesFaqs } from '../data/faqs'
import { images } from '../data/images'
import { allServices, useCases } from '../data/services'
import { cn } from '../lib/utils'
import Seo from '../lib/Seo'

const engagementSteps = [
  { title: 'Initial inquiry', text: 'You contact us through the quote or contact form with an outline of your requirement.' },
  { title: 'Discovery discussion', text: 'We talk through the goods, markets, parties and timing to understand what is needed.' },
  { title: 'Scope confirmation', text: 'We agree which services apply, what MAKHORIZON will coordinate and what others will provide.' },
  { title: 'Coordinated support', text: 'We deliver the agreed support and keep communication organised throughout.' },
]

function ServiceRow({ service, index }) {
  const Icon = service.icon
  const reversed = index % 2 === 1
  const points = service.focusAreas?.slice(0, 3).map((f) => f.title)
  return (
    <Reveal as="article" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16" id={service.slug}>
      <Link
        to={service.to}
        tabIndex={-1}
        aria-hidden="true"
        className={cn('group media-zoom relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-card)]', reversed && 'lg:order-2')}
      >
        <SmartImage image={service.image} sizes="(min-width:1024px) 45vw, 100vw" className="h-full w-full" />
        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 font-display text-lg text-navy">
          {String(index + 1).padStart(2, '0')}
        </span>
      </Link>
      <div className={cn(reversed && 'lg:order-1')}>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-gold">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="display-md mt-6">{service.title}</h3>
        <p className="mt-4 leading-relaxed">{service.summary}</p>
        {points && (
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm font-medium text-navy">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        )}
        <Link to={service.to} className="link-underline mt-8 text-sm">
          {service.linkLabel ?? `Explore ${service.shortTitle ?? service.title}`}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Reveal>
  )
}

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        description="Explore MAKHORIZON's services: logistics coordination, import and export support, cargo transportation coordination, supplier and buyer connections, trade support and document coordination."
      />
      <PageHero
        eyebrow="Our services"
        title="Support across the trade journey."
        intro="From commercial groundwork and introductions to coordinating cargo and paperwork, MAKHORIZON helps businesses bring structure to international trade."
        image={images.containerYard}
        breadcrumbs={[{ label: 'Services' }]}
      >
        <ButtonLink to="/request-quote" arrow>
          Request a Quote
        </ButtonLink>
        <ButtonLink to="/contact" variant="outline-light">
          Ask a question
        </ButtonLink>
      </PageHero>

      {/* Introduction */}
      <section className="section pb-0">
        <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-24">
          <SectionHeading eyebrow="Introduction" title="Practical help, scoped to your requirement." />
          <Reveal className="space-y-5">
            <p className="lead">
              Every trade requirement is different. Rather than fixed packages, MAKHORIZON offers areas of support that can be combined
              according to what a business actually needs.
            </p>
            <p>
              Our focus is coordination and commercial support. Where a project needs licensed or specialised services — such as transport
              operations, customs brokerage or certification — those are provided by the appropriate professionals, and we are clear about
              that from the start.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Detailed service cards */}
      <section className="section" aria-labelledby="all-services-heading">
        <div className="container-site">
          <h2 id="all-services-heading" className="sr-only">
            All services
          </h2>
          <div className="space-y-20 lg:space-y-28">
            {allServices.map((s, i) => (
              <ServiceRow key={s.slug} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section bg-white" aria-labelledby="use-cases-heading">
        <div className="container-site">
          <SectionHeading
            eyebrow="Typical use cases"
            title={<span id="use-cases-heading">How businesses might use our services.</span>}
            intro="Illustrative scenarios showing how different services can work together. These are examples, not client case studies."
          />
          <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
            {useCases.map((u, i) => (
              <RevealItem key={u.title} as="article" className="flex flex-col rounded-[var(--radius-card)] border border-line bg-ivory/50 p-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">Scenario {i + 1}</span>
                <h3 className="heading-sm mt-4">{u.title}</h3>
                <p className="mt-3 flex-1 text-[0.94rem] leading-relaxed">{u.text}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Relevant services">
                  {u.services.map((s) => (
                    <li key={s} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-navy">
                      {s}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Engagement */}
      <section className="section" aria-labelledby="engagement-heading">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="How engagement works"
            title={<span id="engagement-heading">A clear, conversational process.</span>}
          />
          <ProcessTimeline steps={engagementSteps} className="mt-20" />
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-white" aria-labelledby="services-faq-heading">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="FAQs" title={<span id="services-faq-heading">Questions about our services</span>} />
          <Reveal>
            <FAQAccordion items={servicesFaqs} />
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="Request a quote"
        title="Tell us what you need to trade or move."
        text="Share the details of your requirement and the team can discuss which services would be relevant."
        image={images.truckHighway}
      />
    </>
  )
}
