# MAKHORIZON Logistics & Trade — Admin Panel (`admin/`)

A management dashboard for MAKHORIZON Logistics & Trade. It covers clients, suppliers, quotations, orders, shipments, inventory, finances, documents, partners and reports.

This is a **frontend-only demo**. All data is fictional sample data held in the browser, and **no backend or Supabase connection is needed** to run it.

## Quick start

```bash
cd admin
npm install
npm run dev        # http://localhost:5174
npm run build      # production build into dist/
npm run preview    # serve the build at http://localhost:4174
npm run lint       # oxlint
```

Requires Node.js 20.19+ (developed on Node 24).

## Demo login

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `admin@makhorizon.demo` |
| Password | `DemoAdmin123!`         |

> **This is not production authentication.** Credentials are checked in the browser. The "session" is a flag in `localStorage`, and no password is ever stored. Every route except `/login` redirects to the login page when there is no demo session. The logic is isolated in `src/services/authService.js` (plus `src/lib/auth.jsx` for the React context and route guard), so it can be replaced with real backend authentication, such as Supabase Auth, without touching the pages.

The login email can be changed under **Settings → Profile**. The password stays fixed.

## Routes

| Route | Purpose |
| ----- | ------- |
| `/login` | Demo sign-in |
| `/dashboard` | Key figures, income vs expenses, orders by status, deadlines, recent activity, low-stock warning |
| `/clients`, `/clients/:id` | Client list (search, filters, sort, CSV) and details with quotations, orders, invoices, transactions |
| `/suppliers`, `/suppliers/:id` | Supplier list and details with purchases, payables, supplied items, documents |
| `/quotations`, `/quotations/new`, `/quotations/:id`, `/quotations/:id/edit` | Quotations with line items, automatic totals, status changes, print, create order |
| `/orders`, `/orders/:id` | Orders with status history, related quotation, shipments, invoices, documents |
| `/shipments`, `/shipments/:id` | Shipments with progress indicator, status updates, notes, documents |
| `/inventory`, `/inventory/:id` | Stock levels, stock movements (received / issued / adjustment), movement history |
| `/finances` | Tabs: overview, income & expense records, invoices |
| `/finances/invoices/:id` | Printable invoice, payments (partial allowed), cancel / issue |
| `/documents`, `/documents/:id` | Document register (metadata) with optional local file preview |
| `/partners`, `/partners/:id` | Partner directory with an opportunity log |
| `/reports` | Period reports, CSV exports, print layout |
| `/settings` | Company profile, preferences, conversion rates, profile, reset demo data |

Unknown routes and deleted records show a "not found" page.

## Business rules

All figures come from one set of functions (`src/lib/calc.js` and `src/lib/analytics.js`), so the dashboard, modules and reports always agree.

- **Quotation and invoice totals** = Σ(quantity × unit price) + tax % + additional charge. Negative quantities and prices are rejected.
- **Quotation status:** a Sent or Draft quotation past its expiry date shows as **Expired**. An order can be created only from an Accepted quotation, and it copies the client, description, currency and amount.
- **Invoice status** is stored as Draft / Unpaid / Cancelled. **Paid**, **Partially Paid** and **Overdue** are derived from payments and the due date.
- **Payments** cannot exceed the outstanding balance. Each payment also creates a linked income record, so there is one source for recorded income.
- **Client outstanding balance** = the sum of outstanding amounts on that client's invoices.
- **Supplier payable** = pending expense records linked to that supplier.
- **Inventory:** quantity changes only through stock movements, and no movement may take stock below zero. Adjustments can be negative. Stock status (In / Low / Out of Stock) comes from each item's minimum level.
- **Shipments** must reference an existing order. Marking a shipment Arrived or Delivered records today's date as the actual date if none is set.
- **Deletes** are blocked when related records exist (for example, a client with orders, or an invoice with payments). The message suggests the safe alternative, such as marking it Inactive or cancelling it.
- **Currency:** DJF is the default primary currency (configurable). USD and EUR records are converted using **illustrative fixed rates** in Settings. These are not live exchange rates.

## Mock data and persistence

- The sample dataset is in `src/data/*.js`: 10 clients, 8 suppliers, 10 quotations, 12 orders, 9 shipments, 16 inventory items with movement history, 24 income/expense records, 11 invoices with 7 payments, 12 documents and 6 partners. **All companies, people and contact details are fictional.** The records reference each other consistently.
- Dates are generated relative to the day the data is first loaded, so overdue invoices, upcoming arrivals and expiring quotations stay realistic.
- Changes are saved to `localStorage` under the key `mkh-admin-demo-data`. That key holds demo records and settings only, never passwords or files. Use **Settings → Reset demo data** to restore the original sample.

## Architecture

```
src/
  components/
    layout/   AppLayout, Sidebar, nav, GlobalSearch, HeaderMenus (notifications, profile)
    ui/       Button, Fields, Badge, Card/DetailList/StatCard, DataTable (+Pagination), FilterBar,
              Modal/ConfirmDialog, Toast, PageHeader/Breadcrumbs, States, RowActions, RelatedTable,
              Timeline, PrintDocument
    forms/    FormModal, ContactForms, TradeForms, InventoryForms, FinanceForms, DocumentForm, LineItemsEditor
    charts/   Charts (Recharts; palette validated for colour-blind separation and contrast)
  data/       Fictional seed data + seed builder
  hooks/      useListState, useConfirmAction, useFormat, useLookups, useUrlIntent, useDismiss, usePageTitle
  lib/        store (external store + persistence), calc, analytics, notifications, csv, dates, schemas, auth
  pages/      One file per screen (lazy-loaded)
  services/   Mock services — the only layer that changes data
```

Pages never modify data directly. They call async functions in `src/services/` (`clientService`, `quotationService`, `orderService`, `shipmentService`, `inventoryService`, `financeService`, `documentService`, `partnerService`, `settingsService`). These functions simulate network latency, validate business rules and return Promises. To connect the backend, replace their bodies with HTTP calls that keep the same signatures.

## Libraries

| Package | Why |
| ------- | --- |
| `react`, `react-dom`, `react-router-dom` | UI and routing (React 19, React Router 7) |
| `tailwindcss`, `@tailwindcss/vite` | Styling with shared design tokens (dev dependency) |
| `lucide-react` | Icons |
| `recharts` | The two dashboard/report charts |
| `react-hook-form`, `zod`, `@hookform/resolvers` | Forms and validation |

Toasts, modals, CSV export and date helpers are small in-house modules, so no extra packages are needed.

## Backend integrations needed later

1. **Authentication:** replace `authService.js` with real sign-in, sessions and server-side access control.
2. **Data API:** replace each service in `src/services/` with HTTP calls (for example, the Node.js server in `server/`, backed by Supabase).
3. **Document storage:** replace `attachFile` / `getFileUrl` in `documentService.js` with Supabase Storage or similar. Today, files stay in browser memory for the current tab only.
4. **Settings persistence:** store company settings and preferences server-side.
5. **Notifications:** they are generated from data in the browser today. Email, SMS or push delivery would need a backend.
6. **Exchange rates:** replace the illustrative fixed rates if real conversions are required.

## Known limitations

- This is single-user browser storage, so data isn't shared between devices or users.
- There are no roles or permissions, by design for this phase.
- Printing uses the browser print dialog. No PDF files are generated.
- The finance module is a record-keeping view, not an accounting, tax, payroll or banking system.
- Deploying `dist/` requires an SPA fallback to `index.html` (for example, Netlify `_redirects` or Vercel rewrites).
