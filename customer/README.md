# MAKHORIZON Logistics & Trade — Public Website (`customer/`)

The public corporate website for MAKHORIZON Logistics & Trade, a Djibouti-based logistics, import-export and trade partnership company. It is a multi-page React single-page application. It runs entirely in the browser, using local content files and simulated form submissions. **No backend is required to run it.**

## Quick start

```bash
cd customer
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally (http://localhost:4173)
npm run lint       # oxlint
```

Requires Node.js 20.19+ (developed on Node 24).

## Configuration

Copy `.env.example` to `.env` and set:

| Variable        | Purpose |
| --------------- | ------- |
| `VITE_SITE_URL` | Confirmed production domain, without a trailing slash (e.g. `https://www.example.com`). Used for canonical URLs, Open Graph URLs, `sitemap.xml` and `robots.txt`. |

While `VITE_SITE_URL` is unset, the site uses the placeholder domain `https://www.makhorizon.example`. In that state every page sets `noindex, nofollow` and the generated `robots.txt` disallows crawling, so the placeholder can't be indexed by mistake.

## Routes

| Route | Page |
| ----- | ---- |
| `/` | Home: hero, introduction, services, why MAKHORIZON, process, trade vision map, partnerships, CEO, CTA, FAQ, updates sign-up |
| `/about` | Company introduction, purpose, mission and vision, values, approach, why Djibouti, CEO, partnership philosophy |
| `/services` | Services overview, use cases, engagement process, FAQs |
| `/services/logistics-coordination` | Service detail |
| `/services/import-export` | Service detail |
| `/services/cargo-transportation` | Service detail |
| `/services/trade-support` | Service detail |
| `/services/supplier-partnerships` | Service detail |
| `/services/document-coordination` | Service detail |
| `/trade-solutions` | Trade solution areas, illustrated workflow, FAQs |
| `/partnerships` | Partnership types, process, partnership inquiry form, FAQs |
| `/request-quote` | Three-step quotation request form |
| `/contact` | Office details, contact form, location illustration |
| `/privacy-policy` | Draft privacy policy |
| `/terms` | Draft terms of use |
| `*` | Custom 404 page |

## Updating content

All business content lives in `src/data/`. Most updates need no component changes.

| File | Contents |
| ---- | -------- |
| `company.js` | Name, CEO, address, announcement message, and the phone, email, hours and social fields (`null` hides them) |
| `services.js` | All service copy: summaries, detail pages, workflows, FAQs, related services |
| `content.js` | Differentiators, process steps, mission, vision, values, CEO message |
| `faqs.js` | FAQ sets for each page |
| `partnerships.js` | Partner audiences, partnership types and process |
| `tradeSolutions.js` | Trade solution areas and workflow |
| `navigation.js` | Header and footer menus |
| `images.js` | All photography, in one place |
| `routes.js` | Indexable routes, used for `sitemap.xml` |

**CEO portrait:** `company.ceo.portrait` points to `src/assets/brand/ceo-portrait.webp`, an optimized version of the supplied `public/ceo.jpg` with overlay remnants cropped from the top edge. To change it, replace that file or point the field at another image. If the field is set to `null`, a labelled placeholder appears instead.

**Adding contact details:** set `company.phone`, `company.email` and `company.businessHours`. They appear in the footer and on the contact page as soon as they are set.

## Project structure

```
src/
  components/
    common/     Logo (official logo), Button, SmartImage, Reveal, SectionHeading, Breadcrumbs, Notice, States (loading/error/boundary)
    layout/     Layout, AnnouncementBar, Navbar (desktop dropdown), MobileNavigation, Footer, ScrollManager
    sections/   PageHero, ServiceCard, ProcessTimeline, FAQAccordion, CTASection, Leadership, TradeMap, LegalDocument
    forms/      Fields, QuoteForm, ContactForm, PartnershipForm, NewsletterSignup, FormFeedback, schemas (Zod)
  data/         Content and configuration (see above)
  hooks/        useScrolled, useLockBodyScroll, useDemoSubmit
  lib/          Seo (page metadata), motion presets, utils
  pages/        One file per route
  services/     inquiryService.js: the mock submission layer
  styles/       index.css: Tailwind v4 design tokens and component classes
```

The design tokens (colours, fonts, radii, shadows, easing, container widths) are defined once in the `@theme` block in `src/styles/index.css`.

## Libraries

| Package | Why |
| ------- | --- |
| `react`, `react-dom` | UI framework (React 19) |
| `react-router-dom` | Client-side routing with lazy-loaded route chunks |
| `motion` | Page, reveal, dropdown, drawer and accordion animations; honours `prefers-reduced-motion` via `MotionConfig reducedMotion="user"` |
| `lucide-react` | Interface icons |
| `react-hook-form`, `zod`, `@hookform/resolvers` | Form state and schema validation |
| `tailwindcss`, `@tailwindcss/vite` | Styling with design tokens (dev dependency) |
| `oxlint` | Linting (dev dependency, from the Vite template) |

No toast, carousel, chart, map or 3D libraries are used. The trade map is a static SVG generated from public-domain Natural Earth land data (`src/data/worldDots.js`).

## Frontend demo behaviour (needs backend integration)

All four forms validate entries locally, then call `src/services/inquiryService.js`. That module simulates a network delay and returns a demo reference. **Nothing is sent or stored, and nothing is written to `localStorage`.** Every success message says plainly that the company has not received anything.

To connect a real API, replace the `simulate()` calls in `inquiryService.js` with real requests and set `DEMO_MODE = false`:

- `submitQuoteRequest`: quote form (`/request-quote`)
- `submitContactMessage`: contact form (`/contact`)
- `submitPartnershipInquiry`: partnership form (`/partnerships`)
- `subscribeToUpdates`: business-updates sign-up (home page)

The UI expects `{ ok, reference }`. Then remove the "Frontend demo" notices from the pages and update the success copy in `components/forms/FormFeedback.jsx` and `NewsletterSignup.jsx`.

## SEO

- Each page sets its title, description, canonical URL, robots directive, Open Graph and Twitter tags at runtime (`src/lib/Seo.jsx`).
- `sitemap.xml` and `robots.txt` are generated at build time from `src/data/routes.js` and `VITE_SITE_URL` (see `vite.config.js`).
- **Limitation:** this is a client-rendered SPA. Crawlers that don't execute JavaScript, and most social-preview scrapers, only see the defaults in `index.html`. If search visibility becomes important, consider prerendering (e.g. a static prerender step) or moving to an SSR/SSG framework.
- No structured data is emitted yet. Organization schema should be added once official details (logo, domain, contact points) are confirmed.

## Deployment

Any static host works. Deploy `dist/`. Because the site uses client-side routing, the host must serve `index.html` for unknown paths:

- **Netlify:** `public/_redirects` is included.
- **Vercel:** `vercel.json` is included.
- **Other hosts (Nginx, Apache, S3/CloudFront):** configure an SPA fallback to `/index.html`.

## Assets and content awaiting the company

- **CEO portrait:** supplied and in use. A higher-resolution, professionally shot photo would look sharper on large screens.
- **Logo:** the supplied `public/logo.jpg` is the source. The site uses a background-removed version (`src/assets/brand/logo.webp`), plus the globe emblem (`logo-mark.webp`) for the favicons and the loading screen. The logo is designed for dark backgrounds, so the header (including the scrolled state), mobile menu and footer are navy. A vector (SVG) logo from the designer would be ideal for print and very large sizes.
- **Phone, email, business hours, social profiles:** all hidden until they are supplied.
- **Production domain:** set `VITE_SITE_URL`.
- **Djibouti photography:** current images are generic logistics photos from Unsplash (free licence). Genuine Djibouti or company photos are recommended.
- **Copy marked as draft:** the CEO message, the mission and vision, and the Privacy Policy and Terms of Use need company approval, and legal review for the two policy documents.
