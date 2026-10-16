import { FileText, MapPin, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Notice from '../components/common/Notice'
import { Reveal } from '../components/common/Reveal'
import QuoteForm from '../components/forms/QuoteForm'
import PageHero from '../components/sections/PageHero'
import { company } from '../data/company'
import { images } from '../data/images'
import Seo from '../lib/Seo'

const tips = [
  'A clear description of the goods, including packaging',
  'Estimated quantity, weight or number of containers',
  'Origin and destination as precisely as possible',
  'Your preferred timeframe and any fixed deadlines',
]

export default function RequestQuote() {
  return (
    <>
      <Seo
        title="Request a Quote"
        description="Request a quotation or discussion with MAKHORIZON Logistics & Trade for import, export, logistics coordination, supplier connections or document coordination."
      />
      <PageHero
        eyebrow="Request a quote"
        title="Tell us about your trade requirement."
        intro="Complete the three short steps below. The more detail you share, the more useful the first conversation can be."
        image={images.portCranes}
        breadcrumbs={[{ label: 'Request a Quote' }]}
      />

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <Reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-card sm:p-10 lg:p-12">
            <Notice className="mb-10" title="Frontend demo mode">
              This form checks your entries locally and simulates a submission. No request is sent to MAKHORIZON until the website is
              connected to its backend, and nothing you type is stored in your browser.
            </Notice>
            <QuoteForm />
          </Reveal>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Quote request guidance">
            <Reveal className="on-dark rounded-[var(--radius-card)] bg-navy p-8 text-white">
              <FileText className="h-6 w-6 text-gold" aria-hidden="true" />
              <h2 className="heading-sm mt-5 text-white">Helpful details to include</h2>
              <ul className="mt-5 space-y-3">
                {tips.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-white/75">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="rounded-[var(--radius-card)] border border-line bg-white p-8">
              <ShieldCheck className="h-6 w-6 text-gold-deep" aria-hidden="true" />
              <h2 className="heading-sm mt-5">How your information is used</h2>
              <p className="mt-3 text-sm leading-relaxed">
                Details submitted through this form are intended only for reviewing and responding to your inquiry. Read the{' '}
                <Link to="/privacy-policy" className="font-semibold text-navy underline underline-offset-2 hover:text-gold-deep">
                  privacy policy
                </Link>{' '}
                for more.
              </p>
            </Reveal>
            <Reveal className="rounded-[var(--radius-card)] border border-line bg-white p-8">
              <MapPin className="h-6 w-6 text-gold-deep" aria-hidden="true" />
              <h2 className="heading-sm mt-5">Prefer a general conversation?</h2>
              <p className="mt-3 text-sm leading-relaxed">
                MAKHORIZON is based at {company.address.full}. You can also{' '}
                <Link to="/contact" className="font-semibold text-navy underline underline-offset-2 hover:text-gold-deep">
                  send a general message
                </Link>
                .
              </p>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  )
}
