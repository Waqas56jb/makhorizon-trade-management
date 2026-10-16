import { motion } from 'motion/react'
import { EASE, viewportOnce } from '../../lib/motion'
import { cn } from '../../lib/utils'
import { RevealGroup, RevealItem } from '../common/Reveal'

/**
 * Responsive step sequence: vertical timeline on mobile, horizontal stepper
 * with an animated connecting line on large screens.
 */
export default function ProcessTimeline({ steps, dark = false, className }) {
  return (
    <div className={cn('relative', className)}>
      {/* Horizontal connector (desktop) */}
      <div className={cn('absolute left-0 right-0 top-7 hidden h-px lg:block', dark ? 'bg-white/15' : 'bg-line')} aria-hidden="true">
        <motion.div
          className="h-full origin-left bg-gold"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </div>

      <RevealGroup as="ol" gap={0.12} className={cn('grid gap-10 lg:gap-8', steps.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4')}>
        {steps.map((step, i) => (
          <RevealItem as="li" key={step.title ?? step.label} className="relative flex gap-6 lg:block">
            {/* Vertical connector (mobile) */}
            {i < steps.length - 1 && (
              <span
                className={cn('absolute left-7 top-14 -bottom-10 w-px lg:hidden', dark ? 'bg-white/15' : 'bg-line')}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border font-display text-xl',
                dark ? 'border-gold/50 bg-midnight text-gold' : 'border-gold/60 bg-ivory text-gold-deep',
              )}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="pt-2 lg:pt-8">
              <h3 className={cn('heading-sm', dark && 'text-white')}>{step.title ?? step.label}</h3>
              <p className={cn('mt-3 text-[0.94rem] leading-relaxed', dark && 'text-white/70')}>{step.text}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
