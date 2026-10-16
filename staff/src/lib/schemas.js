import { z } from 'zod'

// Reusable Zod building blocks for forms.
export const required = (label, max = 150) => z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`)
export const optional = (max = 500) => z.string().trim().max(max, `Please keep this under ${max} characters.`).optional().or(z.literal(''))
export const email = z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.')
export const phone = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^\+?[\d\s()-]{6,20}$/.test(v), 'Enter a valid phone number.')
export const choice = (label) => z.string().min(1, `Please select ${label}.`)
export const date = (label) => z.string().min(1, `${label} is required.`).regex(/^\d{4}-\d{2}-\d{2}$/, `Enter a valid date.`)
export const optionalDate = z.string().optional().or(z.literal(''))

const toNumber = (v) => (v === '' || v === null || v === undefined ? undefined : Number(v))

/** Required number with optional bounds. */
export const number = (label, { min = 0, integer = false, allowNegative = false } = {}) => {
  let n = z.number({ error: `${label} is required.` }).refine((v) => Number.isFinite(v), `${label} must be a number.`)
  if (!allowNegative) n = n.refine((v) => v >= min, min === 0 ? `${label} cannot be negative.` : `${label} must be at least ${min}.`)
  if (integer) n = n.refine((v) => Number.isInteger(v), `${label} must be a whole number.`)
  return z.preprocess(toNumber, n)
}

export const optionalNumber = (label) =>
  z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z
      .number()
      .nullable()
      .refine((v) => v === null || (Number.isFinite(v) && v >= 0), `${label} cannot be negative.`),
  )

export const url = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(v), 'Enter a valid website address.')

export const lineItems = z
  .array(
    z.object({
      description: required('Description', 200),
      quantity: number('Quantity'),
      unitPrice: number('Unit price'),
    }),
  )
  .min(1, 'Add at least one line item.')
