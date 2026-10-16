import { Compass, Eye } from 'lucide-react'
import { ButtonLink } from '../components/common/Button'
import Notice from '../components/common/Notice'
import { Reveal, RevealGroup, RevealItem } from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'
import SmartImage from '../components/common/SmartImage'
import CTASection from '../components/sections/CTASection'
import Leadership from '../components/sections/Leadership'
import PageHero from '../components/sections/PageHero'
import TradeMap from '../components/sections/TradeMap'
import { company } from '../data/company'
import { coreValues, mission, tradeApproach, vision, whyDjibouti } from '../data/content'
import { images } from '../data/images'
import Seo from '../lib/Seo'

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Learn about MAKHORIZON Logistics & Trade, a Djibouti-based company focused on logistics coordination, import-export support and international business partnerships."
      />
      <PageHero
        eyebrow="About MAKHORIZON"
        title="Building trade relationships from Djibouti."
        intro="MAKHORIZON Logistics & Trade is a Djibouti-based company helping businesses coordinate logistics, pursue import and export opportunities, and build reliable commercial relationships."
        image={images.portYard}
        breadcrumbs={[{ label: 'About Us' }]}
        size="lg"
      />

      {/* Company introduction */}
      <section className="section">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeading eyebrow="Company introduction" title="A young company with a clear focus." />
            <Reveal className="mt-8 space-y-5">
              <p className="lead">
                MAKHORIZON Logistics &amp; Trade is a startup based at {company.address.full}. It was created to support businesses that
                want to trade across borders — whether they are sourcing goods, selling into new markets or moving cargo through the region.
              </p>
              <p>
                The company brings together logistics coordination and commercial support. That means helping clients with the practical
                side of moving goods, while also helping them find and communicate with the suppliers, buyers and partners that make trade
                possible.
              </p>
            </Reveal>
          </div>
          <Reveal className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]">
              <SmartImage image={images.shipAtSea} width={700} sizes="(min-width:1024px) 22vw, 45vw" className="h-full w-full" />
            </div>
            <div className="mt-12 aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]">
              <SmartImage image={images.meetingLaptops} width={700} sizes="(min-width:1024px) 22vw, 45vw" className="h-full w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Background & purpose */}
      <section className="section bg-white">
        <div className="container-site grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <SectionHeading eyebrow="Background and purpose" title="Why MAKHORIZON exists." />
          <RevealGroup className="grid gap-8 sm:grid-cols-2">
            {[
              {
                t: 'Trade involves many parties',
                d: 'Suppliers, buyers, carriers, agents and authorities all play a part. Businesses benefit from someone who helps keep those conversations organised.',
              },
              {
                t: 'New markets raise new questions',
                d: 'Companies entering unfamiliar markets need practical groundwork before committing to suppliers, buyers or shipments.',
              },
              {
                t: 'Relationships drive opportunity',
                d: 'Many trade opportunities begin with the right introduction. MAKHORIZON aims to help create those connections responsibly.',
              },
              {
                t: 'Djibouti is a natural base',
                d: 'Its position on major shipping lanes and its role as a regional gateway make it a meaningful place to build a trade business.',
              },
            ].map((item, i) => (
              <RevealItem key={item.t} className="border-t border-line pt-6">
                <span className="font-display text-2xl text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="heading-sm mt-3">{item.t}</h3>
                <p className="mt-2 text-[0.94rem] leading-relaxed">{item.d}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" aria-labelledby="mission-heading">
        <div className="container-site">
          <SectionHeading align="center" eyebrow="Mission and vision" title={<span id="mission-heading">What guides our work.</span>} />
          <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-2">
            {[
              { icon: Compass, label: 'Our mission', text: mission },
              { icon: Eye, label: 'Our vision', text: vision },
            ].map(({ icon: Icon, label, text }, i) => (
              <RevealItem
                key={label}
                className={
                  i === 0
                    ? 'on-dark rounded-[var(--radius-card)] bg-navy p-10 text-white lg:p-14'
                    : 'rounded-[var(--radius-card)] border border-line bg-white p-10 lg:p-14'
                }
              >
                <Icon className={i === 0 ? 'h-8 w-8 text-gold' : 'h-8 w-8 text-gold-deep'} strokeWidth={1.4} aria-hidden="true" />
                <h3 className={`mt-6 text-xs font-bold uppercase tracking-[0.22em] ${i === 0 ? 'text-gold' : 'text-gold-deep'}`}>{label}</h3>
                <p className={`mt-4 font-display text-[1.75rem] leading-snug ${i === 0 ? 'text-white' : 'text-navy'}`}>{text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Notice className="mx-auto mt-8 max-w-2xl" title="Proposed brand copy">
            The mission and vision statements are drafted from the company brief and are pending review and approval by MAKHORIZON.
          </Notice>
        </div>
      </section>

      {/* Core values */}
      <section className="section bg-white" aria-labelledby="values-heading">
        <div className="container-site">
          <SectionHeading
            eyebrow="Core values"
            title={<span id="values-heading">The principles we work by.</span>}
            intro="Values matter most in how they show up day to day — in how we prepare, communicate and treat the parties we work with."
          />
          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.06}>
            {coreValues.map(({ icon: Icon, title, text }) => (
              <RevealItem
                key={title}
                className="group rounded-[var(--radius-card)] border border-line p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory text-gold-deep transition-colors duration-500 group-hover:bg-navy group-hover:text-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="heading-sm mt-6">{title}</h3>
                <p className="mt-2 text-[0.94rem] leading-relaxed">{text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Approach */}
      <section className="section overflow-hidden" aria-labelledby="approach-heading">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] sm:aspect-[4/3] lg:aspect-[4/5]">
            <SmartImage image={images.signing} width={1000} sizes="(min-width:1024px) 45vw, 100vw" className="h-full w-full" />
          </Reveal>
          <div>
            <SectionHeading eyebrow="Our approach" title={<span id="approach-heading">How we approach international trade.</span>} />
            <RevealGroup as="ol" className="mt-10 space-y-8">
              {tradeApproach.map((a, i) => (
                <RevealItem as="li" key={a.title} className="flex gap-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60 font-display text-lg text-gold-deep">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="heading-sm">{a.title}</h3>
                    <p className="mt-2 text-[0.94rem] leading-relaxed">{a.text}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Why Djibouti */}
      <section className="on-dark section bg-midnight text-white" aria-labelledby="djibouti-heading">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
            <Reveal>
              <p className="eyebrow mb-5">Why Djibouti matters</p>
              <h2 id="djibouti-heading" className="display-lg text-white">
                A gateway position at the heart of our ambition.
              </h2>
            </Reveal>
            <Reveal>
              <p className="lead text-white/75">
                Djibouti’s location has long made it a meeting point for maritime trade. For MAKHORIZON, it is the starting point for
                regional ambitions — close to the trade flows and relationships the company wants to support.
              </p>
            </Reveal>
          </div>
          <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/10 md:grid-cols-3">
            {whyDjibouti.map((w) => (
              <RevealItem key={w.title} className="bg-midnight p-8 lg:p-10">
                <h3 className="heading-sm text-white">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{w.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-16">
            <TradeMap />
          </Reveal>
        </div>
      </section>

      <Leadership />

      {/* Partnership philosophy */}
      <section className="section bg-white" aria-labelledby="philosophy-heading">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="Partnership philosophy"
              title={<span id="philosophy-heading">Partnerships built for the long term.</span>}
              intro="We believe the most valuable trade relationships are built over time, through consistent communication, fair arrangements and a shared interest in each other’s success."
            />
            <Reveal className="mt-8 space-y-4">
              {[
                'We are transparent about what we can and cannot do.',
                'We look for arrangements that work for every party involved.',
                'We value introductions that are well prepared and genuinely relevant.',
                'We aim to grow alongside the businesses we work with.',
              ].map((p) => (
                <p key={p} className="flex items-start gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal className="mt-10">
              <ButtonLink to="/partnerships" variant="navy" arrow>
                Partnership opportunities
              </ButtonLink>
            </Reveal>
          </div>
          <Reveal className="aspect-square overflow-hidden rounded-[var(--radius-card)]">
            <SmartImage image={images.handshake} width={900} sizes="(min-width:1024px) 40vw, 100vw" className="h-full w-full" />
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="Work with us"
        title="Discuss a business opportunity with MAKHORIZON."
        text="Whether you are importing, exporting, sourcing or exploring a partnership, the team is ready to start a conversation."
        image={images.portCranes}
      />
    </>
  )
}
