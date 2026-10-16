import ceoPortrait from '../assets/brand/ceo-portrait.webp'

// Central company configuration. Only confirmed information is filled in.
// Fields set to null are hidden throughout the site until real values are supplied.
export const company = {
  name: 'MAKHORIZON Logistics & Trade',
  legalName: 'MAKHORIZON LOGISTICS & TRADE',
  shortName: 'MAKHORIZON',
  tagline: 'Connecting Markets. Moving Trade Forward.',
  description:
    'A Djibouti-based company focused on logistics coordination, import-export support, supplier and buyer connections, and international business partnerships.',

  ceo: {
    name: 'Mako Mohamed Bouh',
    title: 'CEO, MAKHORIZON Logistics & Trade',
    location: 'Djibouti',
    // Supplied by the company (source: public/ceo.jpg, overlay remnants cropped from the top edge).
    portrait: ceoPortrait,
  },

  address: {
    building: 'Salam Tower',
    floor: '5th Floor',
    city: 'Djibouti',
    country: 'Djibouti',
    full: 'Salam Tower, 5th Floor, Djibouti',
  },

  // Not yet supplied — intentionally null so nothing is invented.
  phone: null,
  email: null,
  businessHours: null,
  registrationNumber: null,

  // Add confirmed profiles as { label: 'LinkedIn', href: 'https://…' }.
  social: [],

  announcement: {
    message: 'Connecting Djibouti to regional and global trade opportunities.',
    linkLabel: 'Start a conversation',
    linkTo: '/contact',
  },
}

// Production site URL, configured through VITE_SITE_URL (see .env.example).
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.makhorizon.example').replace(/\/$/, '')
export const IS_PLACEHOLDER_DOMAIN = !import.meta.env.VITE_SITE_URL
