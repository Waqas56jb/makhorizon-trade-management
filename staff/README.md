# MAKHORIZON Logistics & Trade — Staff Portal (`staff/`)

The employee portal for MAKHORIZON Logistics & Trade. Staff can see their assigned tasks, orders and shipments, record operational updates, register document details and read notifications.

This is a **frontend-only demo** using fictional data. **No backend or Supabase connection is needed.**

## Quick start

```bash
cd staff
npm install
npm run dev        # http://localhost:5175
npm run build      # production build into dist/
npm run preview    # serve the build at http://localhost:4175
npm run lint       # oxlint (includes an undefined-identifier check)
```

Requires Node.js 20.19+ (developed on Node 24).

## Demo login

| Field    | Value                   |
| -------- | ----------------------- |
| Email    | `staff@makhorizon.demo` |
| Password | `StaffDemo123!`         |

You sign in as **Ahmed Hassan, Logistics Coordinator, Operations, Djibouti**. This is a **fictional demo employee**.

> **Not production security.** Credentials are checked in the browser. The "session" stores only the demo employee id in `localStorage`, and no password or token is stored. Every route except `/login` redirects to the login page without a session. The logic is isolated in `src/services/authService.js` and `src/lib/auth.jsx`, so it can be replaced with real backend authentication.

## Routes

| Route | Page |
| ----- | ---- |
| `/login` | Staff sign-in (with show/hide password) |
| `/dashboard` | Greeting, today's summary, overdue warning, tasks for today, shipments needing updates, recent activity |
| `/my-tasks`, `/tasks/:id` | Task cards with quick filters (due today, overdue, open, completed), search, status/priority/due-by filters; task details with instructions, notes, progress, history |
| `/my-orders`, `/orders/:id` | Assigned orders (read-focused); operational updates and limited status changes |
| `/my-shipments`, `/shipments/:id` | Assigned shipments with "action needed" indicators; permitted status updates, notes, required-documents checklist |
| `/documents`, `/documents/:id` | Document register: add records, preview a selected file, provide requested files, edit/delete own drafts |
| `/notifications` | Notification centre with unread filter and mark as read |
| `/profile` | Employee details; only display name and phone are editable |
| `/help` | Short how-to guides and an FAQ |
| `*` | Not found (also shown for records not assigned to you) |

## What staff can and cannot do

**Tasks**
- Allowed changes: To Do → In Progress or Blocked; In Progress → Completed or Blocked; Blocked → In Progress. A completed task cannot change again.
- Blocking requires a reason, and completion notes are optional.
- Completing records a completion timestamp.
- Tasks that need administrator review show **Pending review** after completion. They are never marked approved, and no administrator is actually notified.

**Orders**
- Staff can read their assigned orders and add operational updates.
- Prices are never shown.
- Status changes are limited to operational steps (Processing, Awaiting Documents, Ready for Dispatch).
- Staff cannot delete, cancel or complete orders.

**Shipments**
- Permitted transitions: Planned → Ready for Dispatch → In Transit → Arrived → Delivered. Any active shipment can be marked **Delayed**, and a reason is required.
- Every update records the previous status, the new status, a timestamp, the employee and an optional note.
- **Mark delivered** asks for confirmation. Arrived or Delivered records today's date as the actual date if none is set.
- There is no GPS or live carrier tracking.

**Documents**
- Document details (metadata) are kept separate from the file.
- A chosen file is previewed in the browser (images, PDF, text) and is **not uploaded**. Temporary preview URLs are revoked after use.
- Financial and commercial types (invoice, quotation, purchase document, contract, receipt) are **protected**: staff cannot edit or delete them.
- Staff can edit their own Draft / Pending Review records, delete their own drafts (with confirmation), and provide the file for **Requested** documents.

**Visibility**
- Staff see only records assigned to them. The demo data includes a second employee (Fatouma Ali) whose records are hidden from Ahmed to show this.

> These restrictions are **demo UI behaviour only**. In production, the Node.js backend and Supabase Row Level Security must enforce authorization on the server.

## Mock data and persistence

- The fictional data is in `src/data/`: 3 employees, 11 tasks (9 for Ahmed), 8 orders (6 for Ahmed), 8 shipments (6 for Ahmed), 14 document records and 7 stored notifications. "Due today", "overdue" and "shipment update needed" notifications are generated from the data. All references between records are consistent.
- Dates are generated relative to the first load, so due and overdue states stay meaningful.
- Changes (task and shipment updates, notes, document records, notification read state, profile edits) are kept under the `localStorage` key `mkh-staff-demo-data`. That key holds no passwords, tokens or file contents. It is **not synchronised with the admin panel**.
- **Reset demo data** (on My Profile or Help) restores the original sample.

## Architecture

```
src/
  components/
    layout/   AppLayout (sidebar + mobile drawer), Sidebar, Header (search, notifications, profile menu), nav
    tasks/    TaskCard, TaskActions (shared status rules)
    forms/    FormModal, NoteForm, StatusUpdateModal, DocumentForm (file preview)
    ui/       Button, Fields, Badge (status + priority), Card, DataTable (+mobile cards, pagination),
              FilterBar, Modal/ConfirmDialog, Toast, PageHeader, History, RelatedList, States, ResetDemoData
  data/       Fictional seed data + seed builder
  hooks/      useMine (my records), useListState, useConfirmAction, useDismiss, usePageTitle, useFormat
  lib/        store (demo persistence), selectors (visibility, due/overdue, attention rules), auth, dates, schemas
  pages/      One file per route (lazy-loaded)
  services/   authService, taskService, operationsService (orders + shipments), documentService, accountService
```

The generic UI building blocks are shared with the admin panel's design system, copied rather than imported, so each app stays independent. Pages never change data directly; they call the async service functions. To connect the backend, replace the bodies of the service functions with HTTP calls to the Node.js server. The signatures already return Promises.

## Libraries

| Package | Why |
| ------- | --- |
| `react`, `react-dom`, `react-router-dom` | UI and routing |
| `tailwindcss`, `@tailwindcss/vite` | Styling with the MAKHORIZON design tokens (dev dependency) |
| `lucide-react` | Icons |
| `react-hook-form`, `zod`, `@hookform/resolvers` | Forms and validation |

There are no chart, toast, date or animation libraries; those helpers are small in-house modules.

## Backend integration needed later

1. **Authentication** and server-side sessions (replace `authService.js`).
2. **Data API:** replace `taskService`, `operationsService` and `accountService` with calls to the Node.js server.
3. **Authorization:** enforce assignment and permission rules on the server and in Supabase RLS.
4. **Document storage:** connect `documentService` (`attachFile` / `getFileUrl`) to Supabase Storage.
5. **Notifications:** deliver assignments and instruction updates from the server. Today they are generated in the browser.
6. **Admin review:** make Pending-review tasks visible to administrators for approval.
7. **Shared data:** synchronise updates with the admin panel.

## Known limitations

- Data lives in one browser only; nothing is shared between users or devices.
- Selected files are lost when the page reloads.
- Deploying `dist/` needs an SPA fallback to `index.html`. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included.
