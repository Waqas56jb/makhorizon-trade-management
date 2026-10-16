import { motion } from 'motion/react'
import { EASE } from '../../lib/motion'
import { cn } from '../../lib/utils'
import Breadcrumbs from '../common/Breadcrumbs'
import SmartImage from '../common/SmartImage'

/** Dark, image-led hero used at the top of every inner page. */
export default function PageHero({ eyebrow, title, intro, image, breadcrumbs, children, size = 'md', align = 'left' }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-midnight text-white">
      {image && (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <SmartImage image={image} priority decorative className="h-full w-full" />
        </motion.div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-midnight/35" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-midnight/80 via-transparent to-midnight/50" aria-hidden="true" />

      <div
        className={cn(
          'container-site relative pt-[calc(var(--header-h)+3.5rem)]',
          size === 'lg' ? 'pb-24 lg:pb-32 lg:pt-[calc(var(--header-h)+6rem)]' : 'pb-16 lg:pb-24 lg:pt-[calc(var(--header-h)+5rem)]',
          align === 'center' && 'text-center',
        )}
      >
        {breadcrumbs && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className={cn('mb-8', align === 'center' && 'flex justify-center')}>
            <Breadcrumbs items={breadcrumbs} />
          </motion.div>
        )}
        <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
          {eyebrow && (
            <motion.p
              className={cn('eyebrow mb-6', align === 'center' && 'justify-center')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            className="display-xl text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
          >
            {title}
          </motion.h1>
          {intro && (
            <motion.p
              className={cn('lead mt-7 max-w-2xl text-white/80', align === 'center' && 'mx-auto')}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.34, ease: EASE }}
            >
              {intro}
            </motion.p>
          )}
          {children && (
            <motion.div
              className={cn('mt-10 flex flex-wrap gap-3', align === 'center' && 'justify-center')}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.46, ease: EASE }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
