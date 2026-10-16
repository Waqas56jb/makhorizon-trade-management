import { lazy, Suspense, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink, TextLink } from '../components/common/Button'
import { Reveal, RevealGroup, RevealItem } from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'
import SmartImage from '../components/common/SmartImage'
import CTASection from '../components/sections/CTASection'
import FAQAccordion from '../components/sections/FAQAccordion'
import Leadership from '../components/sections/Leadership'
import ProcessTimeline from '../components/sections/ProcessTimeline'
import { ServiceImageCard } from '../components/sections/ServiceCard'
import TradeMap from '../components/sections/TradeMap'
import { company } from '../data/company'
import { differentiators, processSteps } from '../data/content'
import { homeFaqs } from '../data/faqs'
import { images } from '../data/images'
import { partnerAudiences } from '../data/partnerships'
import { allServices } from '../data/services'
import { EASE } from '../lib/motion'
import Seo from '../lib/Seo'

// Lazy so the form libraries are only fetched when the sign-up scrolls near.
const NewsletterSignup = lazy(() => import('../components/forms/NewsletterSignup'))

const heroLines = [
  ['Connecting', 'Markets.'],
  ['Moving', 'Trade', 'Forward.'],
]

const heroHighlights = ['Logistics coordination', 'Import & export support', 'Supplier & buyer connections', 'Trade partnerships']

function HeroRouteLines() {
  // Purely decorative flowing lines behind the hero copy.
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {[
        'M-40 700 C 300 560, 520 760, 820 600 S 1300 380, 1500 440',
        'M-40 780 C 360 680, 640 820, 940 700 S 1320 560, 1500 600',
        'M600 -20 C 760 180, 980 220, 1180 160 S 1420 60, 1500 120',
      ].map((d, i) => (
        <g key={d}>
          <motion.path
            d={d}
            fill="none"
            stroke="#C7A66A"
            strokeOpacity="0.28"
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.6, delay: 0.6 + i * 0.3, ease: EASE }}
          />
          <path d={d} fill="none" stroke="#C7A66A" strokeOpacity="0.55" strokeWidth="1.2" className="route-dash" />
        </g>
      ))}
    </svg>
  )
}

function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%'])

  let wordIndex = 0

  return (
    <section ref={ref} className="on-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-midnight text-white">
      <motion.div className="absolute inset-0 -z-10 will-change-transform" style={{ y: imgY }}>
        <motion.div
          className="h-[115%] w-full"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: EASE }}
        >
          <SmartImage image={images.portAerial} priority className="h-full w-full" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight/95 via-midnight/70 to-midnight/20" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight via-midnight/10 to-midnight/60" aria-hidden="true" />
      <div className="absolute inset-0 -z-10">
        <HeroRouteLines />
      </div>

      <motion.div
        style={{ y: contentY }}
        className="container-site flex flex-1 flex-col justify-center pb-16 pt-[calc(var(--header-h)+4rem)] lg:pb-24"
      >
        <motion.p
          className="eyebrow mb-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          Djibouti · Logistics &amp; International Trade
        </motion.p>
        <h1 className="display-xl max-w-4xl text-white" aria-label={company.tagline}>
          {heroLines.map((line, li) => (
            <span key={li} className="block overflow-hidden pb-[0.08em]" aria-hidden="true">
              {line.map((word) => {
                const i = wordIndex++
                return (
                  <motion.span
                    key={word}
                    className={`mr-[0.22em] inline-block ${li === 1 ? 'italic text-gold-light' : ''}`}
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                )
              })}
            </span>
          ))}
        </h1>
        <motion.p
          className="lead mt-8 max-w-2xl text-white/80"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
        >
          MAKHORIZON Logistics &amp; Trade helps businesses explore international trade opportunities, coordinate logistics, and build
          reliable commercial relationships across regional and global markets.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        >
          <ButtonLink to="/request-quote" arrow>
            Discuss Your Trade Requirements
          </ButtonLink>
          <ButtonLink to="/services" variant="outline-light">
            Explore Our Services
          </ButtonLink>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative border-t border-white/10 bg-midnight/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <div className="container-site flex items-center justify-between gap-8 py-5">
          <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-2 text-[0.78rem] font-medium text-white/75 md:flex md:flex-wrap md:gap-x-10">
            {heroHighlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
          <a href="#introduction" className="group hidden shrink-0 items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white sm:flex">
            Scroll
            <span className="relative h-10 w-px overflow-hidden bg-white/20" aria-hidden="true">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-gold" />
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  )
}

function Introduction() {
  return (
    <section id="introduction" className="section overflow-hidden">
      <div className="container-site grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative ml-auto aspect-[4/5] w-[82%] overflow-hidden rounded-[var(--radius-card)]">
            <SmartImage image={images.portCranes} sizes="(min-width:1024px) 40vw, 80vw" className="h-full w-full" />
          </div>
          <div className="absolute bottom-[-2rem] left-0 aspect-square w-[46%] overflow-hidden rounded-[var(--radius-card)] border-[6px] border-ivory shadow-lift">
            <SmartImage image={images.handshake} sizes="(min-width:1024px) 22vw, 45vw" className="h-full w-full" />
          </div>
          <div className="absolute left-[6%] top-8 max-w-[13rem] rounded-[var(--radius-card)] bg-navy p-5 text-white shadow-lift">
            <MapPin className="h-5 w-5 text-gold" aria-hidden="true" />
            <p className="mt-3 font-display text-xl leading-tight">Based in Djibouti</p>
            <p className="mt-1 text-xs text-white/70">{company.address.full}</p>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="Who we are"
            title="A Djibouti-based partner for trade and logistics."
            intro="MAKHORIZON Logistics & Trade is a young company focused on helping businesses navigate international trade — coordinating logistics, supporting import and export activity, and connecting suppliers, buyers and partners."
          />
          <Reveal className="mt-6 space-y-5">
            <p>
              From our base in Djibouti, we work with businesses that want to trade more confidently across the region and beyond. Our role
              is to bring structure to the process: understanding what a client needs, connecting the right parties, and keeping
              communication organised as a transaction moves forward.
            </p>
            <div className="grid gap-4 border-l-2 border-gold pl-6 sm:grid-cols-2">
              <p className="text-sm">
                <strong className="block text-base font-semibold text-navy">Clear value</strong>
                One point of contact for the commercial and logistical sides of trade.
              </p>
              <p className="text-sm">
                <strong className="block text-base font-semibold text-navy">Grounded approach</strong>
                Every requirement is discussed and confirmed directly — nothing is assumed.
              </p>
            </div>
            <div className="pt-4">
              <TextLink to="/about">More about MAKHORIZON</TextLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ServicesOverview() {
  return (
    <section className="section bg-white" aria-labelledby="services-heading">
      <div className="container-site">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title={<span id="services-heading">Services built around how trade really works.</span>}
            intro="Eight areas of support, from the first commercial conversation to coordinating the goods and paperwork that follow."
          />
          <Reveal>
            <ButtonLink to="/services" variant="outline" arrow>
              View all services
            </ButtonLink>
          </Reveal>
        </div>
        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4" gap={0.06}>
          {allServices.map((s, i) => (
            <RevealItem key={s.slug}>
              <ServiceImageCard service={s} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function WhyChoose() {
  return (
    <section className="on-dark section relative overflow-hidden bg-navy text-white">
      <div className="absolute inset-y-0 right-0 hidden w-[38%] lg:block">
        <SmartImage image={images.containerYard} decorative sizes="38vw" className="h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-navy/10" />
      </div>
      <div className="container-site relative">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-5">Why MAKHORIZON</p>
            <h2 className="display-lg text-white">What clients and partners can expect from us.</h2>
            <p className="lead mt-6 text-white/75">
              We are a new company, and we prefer to be specific about how we work rather than make claims we cannot yet support.
            </p>
          </Reveal>
        </div>
        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/10 sm:grid-cols-2 lg:max-w-[62rem] lg:grid-cols-3">
          {differentiators.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title} className="group bg-navy p-8 transition-colors duration-500 hover:bg-navy-700">
              <Icon className="h-7 w-7 text-gold transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="heading-sm mt-6 text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="section" aria-labelledby="process-heading">
      <div className="container-site">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title={<span id="process-heading">From first conversation to follow-up.</span>}
          intro="A typical import or export engagement follows four broad stages. The steps involved in each project depend on the requirement and the scope agreed with you."
        />
        <ProcessTimeline steps={processSteps} className="mt-20" />
        <Reveal className="mt-16 text-center">
          <ButtonLink to="/request-quote" variant="navy" arrow>
            Share your requirements
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}

function GlobalVision() {
  return (
    <section className="on-dark section relative overflow-hidden bg-midnight text-white" aria-labelledby="vision-heading">
      <div className="container-site grid items-center gap-14 lg:grid-cols-[0.72fr_1.28fr]">
        <Reveal>
          <p className="eyebrow mb-5">Global trade vision</p>
          <h2 id="vision-heading" className="display-lg text-white">
            From Djibouti, toward regional and global markets.
          </h2>
          <p className="lead mt-6 text-white/75">
            Djibouti sits where the Red Sea meets the Gulf of Aden — a natural meeting point between Africa, the Middle East, Asia and
            Europe. MAKHORIZON’s ambition is to help businesses use that position to build lasting trade relationships.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/partnerships" arrow>
              Explore partnerships
            </ButtonLink>
            <ButtonLink to="/about" variant="outline-light">
              Why Djibouti
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <TradeMap />
        </Reveal>
      </div>
    </section>
  )
}

function PartnershipOpportunities() {
  return (
    <section className="section" aria-labelledby="partners-heading">
      <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Partnership opportunities"
            title={<span id="partners-heading">Open to the conversations that build trade.</span>}
            intro="MAKHORIZON welcomes relevant discussions with organisations across the trade and logistics value chain. If you see a potential fit, we would like to hear from you."
          />
          <RevealGroup as="ul" className="mt-10 grid grid-cols-2 gap-3" gap={0.05}>
            {partnerAudiences.map(({ label, icon: Icon }) => (
              <RevealItem
                as="li"
                key={label}
                className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-white px-4 py-3.5 text-sm font-semibold text-navy"
              >
                <Icon className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                {label}
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/partnerships" variant="navy" arrow>
              Partnership inquiries
            </ButtonLink>
            <ButtonLink to="/contact" variant="outline">
              Contact the team
            </ButtonLink>
          </Reveal>
        </div>
        <Reveal className="group relative min-h-[26rem] overflow-hidden rounded-[var(--radius-card)] lg:min-h-full">
          <SmartImage image={images.meetingTable} sizes="(min-width:1024px) 45vw, 100vw" className="media-zoom absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent" />
          <div className="on-dark absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
            <p className="font-display text-3xl leading-tight sm:text-4xl">“Long-term relationships matter more than single transactions.”</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Our partnership philosophy</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FAQSection() {
  return (
    <section className="section bg-white" aria-labelledby="faq-heading">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Questions"
            title={<span id="faq-heading">Frequently asked questions</span>}
            intro="Answers to common questions about working with MAKHORIZON. For anything else, the team is happy to talk."
          />
          <Reveal className="mt-8">
            <Link to="/contact" className="link-underline text-sm">
              Ask a different question
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <Reveal>
          <FAQAccordion items={homeFaqs} />
        </Reveal>
      </div>
    </section>
  )
}

function Updates() {
  return (
    <section className="border-t border-line bg-ivory-dark/60 py-16 lg:py-20" aria-labelledby="updates-heading">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-4">Business updates</p>
          <h2 id="updates-heading" className="display-md">
            Stay informed as MAKHORIZON grows.
          </h2>
          <p className="mt-4 max-w-lg">Occasional updates on services, partnership opportunities and company news.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Suspense fallback={<div className="h-[5.5rem]" aria-hidden="true" />}>
            <NewsletterSignup />
          </Suspense>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Seo
        description="MAKHORIZON Logistics & Trade is a Djibouti-based company helping businesses coordinate logistics, support import and export, connect with suppliers and buyers, and build international trade partnerships."
        image={images.portAerial.og}
      />
      <Hero />
      <Introduction />
      <ServicesOverview />
      <WhyChoose />
      <Process />
      <GlobalVision />
      <PartnershipOpportunities />
      <Leadership className="bg-white" />
      <CTASection />
      <FAQSection />
      <Updates />
    </>
  )
}
