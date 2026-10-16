# MAKHORIZON Logistics & Trade — Partner Portal (`partner-panel/`)

The portal for approved MAKHORIZON business partners, suppliers and trade partners. Partners can:

- browse trade opportunities and submit quotations
- confirm orders and follow shipments
- exchange documents and messages with MAKHORIZON
- manage their company profile and team

This is a **frontend-only demo** with fictional data. **No backend, Supabase project or API key is needed.**

## Quick start

```bash
cd partner-panel
npm install
npm run dev        # http://localhost:5176
npm run build      # production build into dist/
npm run preview    # serve the build at http://localhost:4176
npm run lint       # oxlint
npm test           # unit tests for quotation maths and helpers (Node's built-in test runner)
```

Requires Node.js 20.19+ (developed on Node 24).

## Demo login

| Field    | Value                     |
| -------- | ------------------------- |
| Email    | `partner@makhorizon.demo` |
| Password | `PartnerDemo123!`         |

You sign in as **Ahmed Abdi Farah**, Company Owner of **East Africa Trade Partners Ltd.**, a fictional partner company.

> **Not production security.**
> - Credentials are checked in the browser.
> - The demo session stores only the user id and partner id: in `sessionStorage` by default, or in `localStorage` with **Remember me**.
> - No password or token is stored.
> - All authentication code is in `src/services/authService.js` and `src/lib/auth.jsx`, ready to be replaced by Supabase Auth.

## Routes

| Route | Page |
| ----- | ---- |
| `/login`, `/forgot-password` | Sign-in (show/hide password, remember me, validation); demo password-reset confirmation (no email is sent) |
| `/dashboard` | Welcome, KPIs, recent orders, active shipments, pending actions, quick actions, recent messages, activity feed |
| `/opportunities`, `/opportunities/:id` | Illustrative opportunities: search, category, region and status filters, sort, grid or list view, "Load more". The details page has a **Submit Quotation** button. |
| `/quotations`, `/quotations/new`, `/quotations/:id` | List with search, filters, date range and sorting. A structured form (sections A–E) with live totals, drafts, confirmation and file selection. Detail page with breakdown, history, feedback and the revision workflow. |
| `/orders`, `/orders/:id` | Orders list; details with items, documents, shipments, history, **Confirm order**, notes and clarification requests |
| `/shipments`, `/shipments/:id` | Shipments list; details with a seven-stage timeline and **Copy Tracking Reference** |
| `/documents` | Document register: upload modal (`?upload=1`), details modal (`?doc=ID`), provide requested files |
| `/messages` | Two-pane inbox (list, then conversation on mobile) |
| `/notifications` | All or unread filter, mark read or unread, mark all read, open the related record |
| `/company-profile` | View and edit the company profile, with a local logo preview |
| `/users` | Team members: invite (simulated), change role, remove with confirmation |
| `/settings` | Tabs: Account, Notifications, Security (demo password form), Preferences (table density, reset demo data) |
| `/help` | Searchable FAQs, a demo support form that returns a `SUP-YYYY-NNN` reference, and your requests |
| `*` | 404. Records that belong to another partner show the same "not found" page. |

Every route except `/login` and `/forgot-password` redirects to `/login` without a demo session.

## Business rules in the demo

**Quotations**
- Only open opportunities accept quotations. "Closing Soon" means the opportunity closes within 7 days.
- Totals are calculated as follows. Negative values are rejected. No currency conversion is applied: USD, EUR and DJF are display and record values only.
  - subtotal = unit price × quantity
  - total = subtotal + tax % + additional costs
- Partners can edit only **drafts**.
- When MAKHORIZON requests a revision, the partner can submit a new version and the previous figures are kept in **Previous versions**.
- Accepted, rejected and expired quotations are locked.
- Unsaved form text is kept in `sessionStorage` while you navigate. Files are never stored.

**Orders**
- Partners can confirm an order that is **Awaiting Confirmation**, after a confirmation dialog.
- Partners can add notes and clarification requests. A clarification request also appears in **Messages**.
- Amounts, terms and internal statuses are read-only.

**Shipments**
- Read-only records with a seven-stage timeline. Only the stages a record has actually reached are marked complete, and delays are flagged.
- There is no live GPS, carrier integration or real-time update.

**Documents**
- Only metadata is saved. Selected files are **not uploaded**.
- A file chosen in this tab can be downloaded again until the page reloads; it uses a temporary object URL.
- Sample records have no real files and no external links.

**Messages**
- Messages are stored locally. No email or WhatsApp is used, and replies are never auto-generated.

**Team**
- Invitations are simulated, and invited members show **Invitation Pending**.
- Owners and Managers can manage the team.
- You can't change your own role or remove yourself, and at least one owner must remain.

**Visibility**
- The demo data includes a second partner, Red Sea Supply Co. Its quotations, orders, shipments, documents and conversations never appear for East Africa Trade Partners.

> These rules are **UI demo behaviour only**. Frontend filtering is not security. In production the Node.js backend and Supabase Row Level Security must enforce authorization using the authenticated user's identity.

## Mock data and persistence

- **Fictional data in `src/data/`:**
  - 2 partners and 5 users
  - 10 opportunities
  - 11 quotations, 7 orders and 7 shipments
  - 12 documents, 5 conversations and 9 notifications
  - activity history

  The records reference each other consistently: quotations point to opportunities, orders to quotations, shipments to orders, and documents to their records.
- Dates are generated relative to the first load, so deadlines stay meaningful.
- Changes are saved to `localStorage` under `mkh-partner-demo-data`. That key never contains passwords, tokens or file contents.
- **Settings → Preferences → Reset demo data** restores the original sample.
- The collapsed-sidebar preference is a separate UI-only key.

## Architecture

```
src/
  components/
    layout/     AppLayout (collapsible sidebar + mobile drawer), Sidebar, Topbar (search, NotificationMenu, user menu), AuthLayout, nav
    ui/         Button, Fields, Controls (Switch, Tabs, DemoNotice), Card, KpiCard, Badge/StatusBadge, DataTable (+Pagination, mobile cards),
                FilterBar/SearchInput, Modal/ConfirmDialog, Toast, PageHeader/Breadcrumbs, States (Empty/Error/Loading), ErrorBoundary,
                FilePicker, Timelines (ActivityTimeline, StatusHistory, ShipmentTimeline), ResetDemoData
    documents/  Upload and details modals
    forms/      FormModal
  data/         Fictional seed data + seed builder
  hooks/        usePartnerData (records visible to the partner + derived counts), useListState, useConfirmAction, useDismiss, usePageTitle
  lib/          store (demo persistence), auth (AuthProvider, ProtectedRoute), selectors, quotation (totals and rules),
                format (currency, dates, references), dates, schemas (zod), utils
  pages/        One file per route (lazy-loaded)
  services/     authService, opportunityService, quotationService, orderService, shipmentService, documentService,
                messageService, notificationService, partnerProfileService, teamService, supportService, settingsService
```

Pages never change data directly. They call async service functions, which simulate latency, check ownership, validate and commit. To connect the backend, replace each service function's body with an HTTP or Supabase call. The signatures already return Promises.

## Backend integration needed later

| Service | Future integration |
| ------- | ------------------ |
| `authService` | Supabase Auth: sign-in, sign-out, session, password reset email, password change |
| `opportunityService` | `GET /api/opportunities`, `GET /api/opportunities/:id` |
| `quotationService` | Create or update drafts, submit, submit revisions, delete drafts; server-side numbering and validation |
| `orderService` | List and details, `POST /orders/:id/confirm`, notes and clarification requests |
| `shipmentService` | Shipment records fed by MAKHORIZON operations and, later, logistics integrations |
| `documentService` | Supabase Storage uploads and signed download URLs; metadata API; review workflow |
| `messageService` | Conversations and messages API, realtime delivery, read receipts |
| `notificationService` | Server-generated notifications (realtime), read state, email preferences |
| `partnerProfileService` | Partner profile API; logo upload to storage |
| `teamService` | Invitation emails, role management and authorization rules |
| `supportService` | Support ticket creation and tracking |
| `settingsService` | User settings API; Supabase Auth `updateUser` for passwords |

## Libraries

| Package | Why |
| ------- | --- |
| `react`, `react-dom`, `react-router-dom` | UI and routing |
| `tailwindcss`, `@tailwindcss/vite` | Styling with MAKHORIZON design tokens (dev dependency) |
| `lucide-react` | Icons |
| `react-hook-form`, `zod`, `@hookform/resolvers` | Forms and validation |

Recharts was not added because no chart was genuinely needed. The dashboard uses KPI tiles and lists instead.

## Known limitations

- Data lives in one browser only. Nothing is shared between users, devices or the admin and staff panels.
- Selected files and logo previews are lost on reload. Sample documents cannot be downloaded.
- Language and time-zone settings are saved but the interface is English only.
- Deploying `dist/` needs a fallback that serves `index.html` for every route. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included.
