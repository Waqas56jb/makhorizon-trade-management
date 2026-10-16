import { motion } from 'motion/react'
import { fadeUp, stagger, viewportOnce } from '../../lib/motion'

/** Scroll-triggered entrance. Use `as` to keep semantic elements. */
export function Reveal({ as = 'div', variants = fadeUp, delay = 0, className, children, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Parent that staggers child <RevealItem> entrances. */
export function RevealGroup({ as = 'div', gap = 0.08, className, children, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp className={className} initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger(gap)} {...rest}>
      {children}
    </Comp>
  )
}

export function RevealItem({ as = 'div', variants = fadeUp, className, children, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp className={className} variants={variants} {...rest}>
      {children}
    </Comp>
  )
}
