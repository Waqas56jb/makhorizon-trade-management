import { z } from 'zod'

const name = z.string().trim().min(2, 'Please enter your full name.').max(100, 'Please keep this under 100 characters.')
const email = z
  .string()
  .trim()
  .min(1, 'Please enter your email address.')
  .email('Please enter a valid email address, e.g. name@company.com.')
const optionalPhone = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^\+?[\d\s()-]{6,20}$/.test(v), 'Please enter a valid phone number, including the country code.')
const requiredSelect = (msg) => z.string().min(1, msg)
const consent = z.boolean().refine((v) => v === true, 'Please confirm you agree so the inquiry can be handled.')
const optionalText = (max = 200) => z.string().trim().max(max, `Please keep this under ${max} characters.`).optional()

export const inquiryTypes = [
  'Import support',
  'Export support',
  'Logistics coordination',
  'Cargo transportation coordination',
  'Supplier or buyer connection',
  'Document coordination',
  'General trade inquiry',
]

export const tradeDirections = ['Import', 'Export', 'Both import and export', 'Not applicable']

export const timeframes = ['As soon as possible', 'Within 1 month', '1–3 months', '3–6 months', 'Flexible / exploring']

export const quoteSchema = z.object({
  fullName: name,
  company: z.string().trim().min(2, 'Please enter your company name.').max(120),
  email,
  phone: optionalPhone,
  country: z.string().trim().min(2, 'Please enter your country.').max(80),
  inquiryType: requiredSelect('Please choose the type of inquiry.'),
  direction: requiredSelect('Please choose a direction, or “Not applicable”.'),
  cargo: z
    .string()
    .trim()
    .min(10, 'Please describe the products or cargo in at least 10 characters.')
    .max(1000, 'Please keep this under 1,000 characters.'),
  origin: z.string().trim().min(2, 'Please enter the origin country or location.').max(120),
  destination: z.string().trim().min(2, 'Please enter the destination country or location.').max(120),
  quantity: optionalText(120),
  timeframe: z.string().optional(),
  details: optionalText(2000),
  consent,
})

export const quoteSteps = [
  { title: 'Your details', fields: ['fullName', 'company', 'email', 'phone', 'country'] },
  { title: 'Trade requirement', fields: ['inquiryType', 'direction', 'cargo', 'origin', 'destination'] },
  { title: 'Additional details', fields: ['quantity', 'timeframe', 'details', 'consent'] },
]

export const contactCategories = [
  'General inquiry',
  'Import / export requirement',
  'Logistics coordination',
  'Supplier or buyer opportunity',
  'Partnership proposal',
  'Other',
]

export const contactSchema = z.object({
  fullName: name,
  email,
  company: optionalText(120),
  category: requiredSelect('Please choose an inquiry category.'),
  subject: z.string().trim().min(3, 'Please add a short subject.').max(150),
  message: z.string().trim().min(20, 'Please write a message of at least 20 characters.').max(3000),
  consent,
})

export const partnershipSchema = z.object({
  fullName: name,
  organisation: z.string().trim().min(2, 'Please enter your organisation’s name.').max(120),
  email,
  country: z.string().trim().min(2, 'Please enter your country.').max(80),
  partnershipType: requiredSelect('Please choose a partnership type.'),
  website: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(v), 'Please enter a valid website address.'),
  message: z.string().trim().min(30, 'Please describe your proposal in at least 30 characters.').max(3000),
  consent,
})

export const newsletterSchema = z.object({ email })
