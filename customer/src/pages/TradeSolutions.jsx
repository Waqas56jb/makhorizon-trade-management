import { motion } from 'motion/react'
import { Check, TriangleAlert } from 'lucide-react'
import { ButtonLink } from '../components/common/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'
import SmartImage from '../components/common/SmartImage'
import CTASection from '../components/sections/CTASection'
import FAQAccordion from '../components/sections/FAQAccordion'
import PageHero from '../components/sections/PageHero'
import { tradeFaqs } from '../data/faqs'
import { images } from '../data/images'
import { tradeSolutions, tradeWorkflow } from '../data/tradeSolutions'
import { EASE, viewportOnce } from '../lib/motion'
import { cn } from '../lib/utils'
import Seo from '../lib/Seo'

function IllustratedWorkflow() {
  return (
    <div className="relative">
      {/* Connecting route line (desktop) */}
      <svg className="absolute left-0 top-[2.1rem] hidden h-6 w-full lg:block" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M40 12 C 200 -4, 300 28, 500 12 S 800 -4, 960 12"
          fill="none"
          stroke="#C7A66A"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.8, ease: EASE }}
        />
      </svg>
      <RevealGroup as="ol" gap={0.12} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {tradeWorkflow.map((s, i) => (
          <RevealItem as="li" key={s.label} className="relative text-center">
            <span className="relative z-10 mx-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border border-gold/60 bg-midnight font-display text-2xl text-gold">
              {i + 1}
            </span>
            <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-white">{s.label}</h3>
            <p className="mx-auto mt-2 max-w-[14rem] text-sm leading-relaxed text-white/70">{s.text}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}

export default function TradeSolutions() {
  return (
    <>
      <Seo
        title="Trade Solutions"
        description="How MAKHORIZON supports sourcing discussions, buyer and seller introductions, import/export planning, freight and document coordination, and commercial opportunity assessment."
      />
      <PageHero
        eyebrow="Trade solutions"
        title="A structured way to approach import, export and commercial coordination."
        intro="Trade succeeds when the commercial, logistical and administrative pieces fit together. These solutions describe how MAKHORIZON can help businesses think through and coordinate each part."
        image={images.depotAerial}
        breadcrumbs={[{ label: 'Trade Solutions' }]}
      >
        <ButtonLink to="/request-quote" arrow>
          Start an inquiry
        </ButtonLink>
      </PageHero>

      {/* Important note */}
      <section className="pt-14">
        <div className="container-site">
          <Reveal className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-white p-6 sm:flex-row sm:items-start sm:p-8">
            <TriangleAlert className="h-6 w-6 shrink-0 text-gold-deep" aria-hidden="true" />
            <div>
              <h2 className="heading-sm">Everything is confirmed directly</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed">
                Specific services, feasibility, routes, schedules, prices and commercial arrangements depend on each requirement and must be
                confirmed directly with MAKHORIZON. This website does not offer live shipment tracking, real-time freight rates or guaranteed
                sourcing.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Solutions */}
      <section className="section" aria-labelledby="solutions-heading">
        <div className="container-site">
          <SectionHeading
            eyebrow="Six areas of focus"
            title={<span id="solutions-heading">How we can help businesses trade.</span>}
            intro="Each area can stand alone or form part of a wider engagement, depending on where a business is in its trade journey."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {tradeSolutions.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal
                  as="article"
                  key={s.id}
                  id={s.id}
                  className={cn(
                    'group grid scroll-mt-32 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white sm:grid-cols-[0.9fr_1.1fr] md:grid-cols-1 xl:grid-cols-[0.9fr_1.1fr]',
                  )}
                >
                  <div className="media-zoom relative aspect-[16/10] overflow-hidden sm:aspect-auto md:aspect-[16/10] xl:aspect-auto">
                    <SmartImage image={s.image} width={700} sizes="(min-width:1280px) 22vw, (min-width:768px) 45vw, 100vw" className="h-full min-h-full w-full" />
                    <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-navy">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="p-7 lg:p-8">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="heading-sm mt-3">{s.title}</h3>
                    <p className="mt-3 text-[0.93rem] leading-relaxed">{s.text}</p>
                    <ul className="mt-5 space-y-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-2.5 text-sm font-medium text-navy">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Illustrated workflow */}
      <section className="on-dark section relative overflow-hidden bg-midnight text-white" aria-labelledby="workflow-heading">
        <SmartImage image={images.containersNight} decorative width={1800} className="absolute inset-0 h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/85 to-midnight" aria-hidden="true" />
        <div className="container-site relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-5 justify-center">Illustrated workflow</p>
            <h2 id="workflow-heading" className="display-lg text-white">
              How a trade engagement can come together.
            </h2>
            <p className="lead mt-6 text-white/70">
              A simplified view. Not every engagement involves every stage — the scope is always agreed with you.
            </p>
          </Reveal>
          <div className="mt-16">
            <IllustratedWorkflow />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section" aria-labelledby="trade-faq-heading">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Good to know" title={<span id="trade-faq-heading">Before you get in touch</span>} />
          <Reveal>
            <FAQAccordion items={tradeFaqs} />
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="Inquiry"
        title="Have a trade requirement in mind?"
        text="Describe what you want to source, sell or move, and the MAKHORIZON team can discuss what may be feasible."
        image={images.portYard}
      />
    </>
  )
}
