import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { EASE } from '../../lib/motion'
import { cn } from '../../lib/utils'

function FAQItem({ item, open, onToggle, idBase }) {
  const buttonId = `${idBase}-btn`
  const panelId = `${idBase}-panel`
  return (
    <div className="border-b border-line">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="text-[1.02rem] font-semibold leading-snug text-navy transition-colors group-hover:text-gold-deep">{item.q}</span>
          <span
            className={cn(
              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500',
              open ? 'rotate-45 border-navy bg-navy text-white' : 'border-line text-navy group-hover:border-navy',
            )}
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-7 pr-12 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQAccordion({ items, defaultOpen = 0, className }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)
  const baseId = useId()
  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item, i) => (
        <FAQItem
          key={item.q}
          item={item}
          idBase={`${baseId}-${i}`}
          open={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  )
}
