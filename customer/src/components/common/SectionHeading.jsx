import { cn } from '../../lib/utils'
import { Reveal } from './Reveal'

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  as: Heading = 'h2',
  size = 'lg',
  className,
  children,
}) {
  const centered = align === 'center'
  return (
    <Reveal className={cn('max-w-3xl', centered && 'mx-auto text-center', className)}>
      {eyebrow && <p className={cn('eyebrow mb-5', centered && 'justify-center')}>{eyebrow}</p>}
      <Heading className={size === 'lg' ? 'display-lg' : 'display-md'}>{title}</Heading>
      {intro && <p className={cn('lead mt-6', centered && 'mx-auto max-w-2xl')}>{intro}</p>}
      {children}
    </Reveal>
  )
}
