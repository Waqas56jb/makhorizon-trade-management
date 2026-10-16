import { Check } from 'lucide-react'
import { ButtonLink } from '../components/common/Button'
import Notice from '../components/common/Notice'
import { Reveal, RevealGroup, RevealItem } from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'
import SmartImage from '../components/common/SmartImage'
import PartnershipForm from '../components/forms/PartnershipForm'
import FAQAccordion from '../components/sections/FAQAccordion'
import PageHero from '../components/sections/PageHero'
import ProcessTimeline from '../components/sections/ProcessTimeline'
import { partnershipFaqs } from '../data/faqs'
import { images } from '../data/images'
import { partnerAudiences, partnershipProcess, partnershipTypes } from '../data/partnerships'
import { cn } from '../lib/utils'
import Seo from '../lib/Seo'

export default function Partnerships() {
  return (
    <>
      <Seo
        title="Partnerships"
        description="MAKHORIZON welcomes partnership discussions with suppliers, importers, exporters, buyers, distributors, logistics providers, commercial partners and potential investors."
      />
      <PageHero
        eyebrow="Partnerships"
        title="Let’s build trade relationships that last."
        intro="MAKHORIZON Logistics & Trade welcomes relevant discussions with organisations across the trade and logistics value chain — regionally and internationally."
        image={images.handshake}
        breadcrumbs={[{ label: 'Partnerships' }]}
      >
        <ButtonLink to="#partnership-form" arrow>
          Submit an inquiry
        </ButtonLink>
        <ButtonLink to="#partnership-types" variant="outline-light">
          Partnership types
        </ButtonLink>
      </PageHero>

      {/* Audiences strip */}
      <section className="border-b border-line bg-white py-10">
        <div className="container-site">
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-body">We welcome conversations with</p>
          <RevealGroup as="ul" gap={0.04} className="flex flex-wrap justify-center gap-3">
            {partnerAudiences.map(({ label, icon: Icon }) => (
              <RevealItem as="li" key={label} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy">
                <Icon className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                {label}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Types */}
      <section id="partnership-types" className="section scroll-mt-24" aria-labelledby="types-heading">
        <div className="container-site">
          <SectionHeading
            eyebrow="Types of partnership"
            title={<span id="types-heading">Where collaboration could make sense.</span>}
            intro="These are the kinds of partnership discussions MAKHORIZON is open to. They describe interest, not existing partnerships."
          />
          <div className="mt-16 space-y-6">
            {partnershipTypes.map((p, i) => {
              const Icon = p.icon
              return (
                <Reveal
                  as="article"
                  key={p.id}
                  id={p.id}
                  className="group grid scroll-mt-32 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white lg:grid-cols-[0.42fr_0.58fr]"
                >
                  <div className={cn('media-zoom relative aspect-[16/9] overflow-hidden lg:aspect-auto', i % 2 === 1 && 'lg:order-2')}>
                    <SmartImage image={p.image} width={900} sizes="(min-width:1024px) 40vw, 100vw" className="h-full min-h-full w-full" />
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-gold">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="display-md text-[1.9rem]">{p.title}</h3>
                    </div>
                    <p className="mt-5 leading-relaxed">{p.text}</p>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-gold-deep">Useful to share</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2 text-sm font-medium text-navy">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    {p.id === 'investors' && (
                      <Notice className="mt-6">
                        MAKHORIZON does not present any investment offering or solicit investment through this website.
                      </Notice>
                    )}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="on-dark section bg-navy text-white" aria-labelledby="partner-process-heading">
        <div className="container-site">
          <Reveal className="max-w-3xl">
            <p className="eyebrow mb-5">Partnership process</p>
            <h2 id="partner-process-heading" className="display-lg text-white">
              From introduction to next steps.
            </h2>
          </Reveal>
          <ProcessTimeline steps={partnershipProcess} dark className="mt-16" />
        </div>
      </section>

      {/* Form */}
      <section id="partnership-form" className="section scroll-mt-24" aria-labelledby="form-heading">
        <div className="container-site grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Partnership inquiry"
              title={<span id="form-heading">Introduce your organisation.</span>}
              intro="Tell us who you are and what kind of collaboration you have in mind. Clear, specific proposals help the team respond meaningfully."
            />
            <Reveal className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] lg:block">
              <SmartImage image={images.meetingTable} width={800} sizes="35vw" className="h-full w-full" />
            </Reveal>
          </div>
          <Reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card sm:p-10">
            <Notice className="mb-8" title="Frontend demo">
              This form validates your entries locally but does not send them anywhere yet. It will deliver inquiries once the website is
              connected to the company’s backend.
            </Notice>
            <PartnershipForm />
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-white" aria-labelledby="partner-faq-heading">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="FAQs" title={<span id="partner-faq-heading">Partnership questions</span>} />
          <Reveal>
            <FAQAccordion items={partnershipFaqs} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
