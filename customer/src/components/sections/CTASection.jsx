import { images } from '../../data/images'
import { ButtonLink } from '../common/Button'
import { Reveal } from '../common/Reveal'
import SmartImage from '../common/SmartImage'

export default function CTASection({
  eyebrow = 'Business inquiries',
  title = 'Let’s Discuss Your Next Trade Opportunity.',
  text = 'Share your requirement and the MAKHORIZON team can talk through how it may be able to help — from first questions to coordinated next steps.',
  image = images.containersNight,
  primary = { label: 'Request a Quote', to: '/request-quote' },
  secondary = { label: 'Contact Our Team', to: '/contact' },
  className = 'py-20 lg:py-28',
}) {
  return (
    <section className={className}>
      <div className="container-site">
        <Reveal className="on-dark relative isolate overflow-hidden rounded-[var(--radius-card)] bg-midnight px-6 py-16 text-white sm:px-12 lg:px-20 lg:py-24">
          <SmartImage image={image} decorative className="absolute inset-0 -z-10 h-full w-full opacity-45" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/40" aria-hidden="true" />
          <svg className="absolute -right-24 -top-24 -z-10 h-96 w-96 text-gold/20" viewBox="0 0 200 200" fill="none" aria-hidden="true">
            <circle cx="100" cy="100" r="98" stroke="currentColor" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" />
            <circle cx="100" cy="100" r="42" stroke="currentColor" />
          </svg>
          <div className="max-w-2xl">
            <p className="eyebrow mb-5">{eyebrow}</p>
            <h2 className="display-lg text-white">{title}</h2>
            <p className="lead mt-6 text-white/75">{text}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to={primary.to} arrow>
                {primary.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink to={secondary.to} variant="outline-light">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
