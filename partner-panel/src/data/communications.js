// FICTIONAL SAMPLE DATA — conversations, notifications, activity and support requests.
// MAKHORIZON contacts are team identities for the demo, not real individuals.

export const supportCategories = ['Quotations', 'Orders', 'Shipments', 'Documents', 'Account & access', 'Other']

const m = (id, at, from, senderName, body) => ({ id, at, from, senderName, body })

export const conversations = (t) => [
  {
    id: 'CV-01', partnerId: 'PT-001', contact: 'Operations Team', department: 'Logistics operations', related: { kind: 'shipment', id: 'SHP-2026-002' }, unread: 2,
    messages: [
      m('MS-01', t(-12, '08:10'), 'makhorizon', 'Operations Team', 'Consignment 1 has been loaded at Mombasa. We will share updates as the vessel progresses.'),
      m('MS-02', t(-11, '09:30'), 'partner', 'Ahmed Abdi Farah', 'Thank you. The certificate of origin and bill of lading are uploaded in Documents.'),
      m('MS-03', t(-2, '10:05'), 'makhorizon', 'Operations Team', 'Consignment 2 is at customs. We still need the commercial invoice for ORD-2026-003 to complete clearance.'),
      m('MS-04', t(-1, '16:40'), 'makhorizon', 'Operations Team', 'Could you upload the invoice today if possible? It has been added as a requested document.'),
    ],
  },
  {
    id: 'CV-02', partnerId: 'PT-001', contact: 'Trade Coordination', department: 'Trade & partnerships', related: { kind: 'quotation', id: 'QUO-2026-003' }, unread: 1,
    messages: [
      m('MS-05', t(-14, '17:00'), 'partner', 'Ahmed Abdi Farah', 'We have submitted our quotation for the pulses and grains opportunity.'),
      m('MS-06', t(-2, '11:25'), 'makhorizon', 'Trade Coordination', 'Thank you. We have requested a revision — please split the price per product and confirm origins. Details are on the quotation page.'),
    ],
  },
  {
    id: 'CV-03', partnerId: 'PT-001', contact: 'Procurement Team', department: 'Procurement', related: { kind: 'order', id: 'ORD-2026-002' }, unread: 0,
    messages: [
      m('MS-07', t(-3, '14:10'), 'makhorizon', 'Procurement Team', 'Order ORD-2026-002 for the distribution pilot is ready for your confirmation.'),
      m('MS-08', t(-3, '15:00'), 'partner', 'Ahmed Abdi Farah', 'Received, we will review the service schedule and confirm shortly.'),
    ],
  },
  {
    id: 'CV-04', partnerId: 'PT-001', contact: 'Finance Team', department: 'Finance', related: { kind: 'order', id: 'ORD-2026-004' }, unread: 0,
    messages: [
      m('MS-09', t(-60, '10:00'), 'makhorizon', 'Finance Team', 'The commercial invoice for ORD-2026-004 has been approved.'),
      m('MS-10', t(-60, '11:15'), 'partner', 'Ahmed Abdi Farah', 'Thank you for confirming.'),
    ],
  },
  // Another partner's conversation — hidden.
  { id: 'CV-05', partnerId: 'PT-002', contact: 'Procurement Team', department: 'Procurement', related: null, unread: 1, messages: [m('MS-11', t(-1, '10:00'), 'makhorizon', 'Procurement Team', 'Hello Samira.')] },
]

export const notifications = (t) => [
  { id: 'NT-01', partnerId: 'PT-001', type: 'quotation', title: 'A revision was requested', description: 'Trade Coordination requested changes to QUO-2026-003.', at: t(-2, '11:20'), read: false, link: '/quotations/QUO-2026-003' },
  { id: 'NT-02', partnerId: 'PT-001', type: 'document', title: 'A document requires attention', description: 'Commercial invoice requested for ORD-2026-003.', at: t(-2, '10:00'), read: false, link: '/documents?doc=DOC-2026-008' },
  { id: 'NT-03', partnerId: 'PT-001', type: 'message', title: 'You received a new message', description: 'Operations Team: Could you upload the invoice today if possible?', at: t(-1, '16:40'), read: false, link: '/messages?c=CV-01' },
  { id: 'NT-04', partnerId: 'PT-001', type: 'order', title: 'Order awaiting your confirmation', description: 'ORD-2026-002 — Corridor distribution pilot.', at: t(-3, '14:05'), read: false, link: '/orders/ORD-2026-002' },
  { id: 'NT-05', partnerId: 'PT-001', type: 'quotation', title: 'Your quotation is under review', description: 'QUO-2026-002 is being reviewed by MAKHORIZON.', at: t(-5, '10:15'), read: true, link: '/quotations/QUO-2026-002' },
  { id: 'NT-06', partnerId: 'PT-001', type: 'shipment', title: 'A shipment status has changed', description: 'SHP-2026-003 moved to Customs Clearance.', at: t(-2, '10:00'), read: true, link: '/shipments/SHP-2026-003' },
  { id: 'NT-07', partnerId: 'PT-001', type: 'shipment', title: 'Shipment delayed', description: 'SHP-2026-006 missed its transhipment connection.', at: t(-7, '11:00'), read: true, link: '/shipments/SHP-2026-006' },
  { id: 'NT-08', partnerId: 'PT-001', type: 'order', title: 'Your order has been confirmed', description: 'ORD-2026-001 is now in progress.', at: t(-15, '08:00'), read: true, link: '/orders/ORD-2026-001' },
  { id: 'NT-09', partnerId: 'PT-002', type: 'message', title: 'New message', description: 'Hidden from other partners.', at: t(-1, '10:00'), read: false, link: '/messages' },
]

export const activity = (t) => [
  { id: 'AC-08', partnerId: 'PT-001', at: t(-1, '17:10'), message: 'Quotation QUO-2026-004 submitted', status: 'Submitted', link: '/quotations/QUO-2026-004' },
  { id: 'AC-07', partnerId: 'PT-001', at: t(-2, '11:20'), message: 'Revision requested on QUO-2026-003', status: 'Revision Requested', link: '/quotations/QUO-2026-003' },
  { id: 'AC-06', partnerId: 'PT-001', at: t(-2, '10:00'), message: 'SHP-2026-003 moved to Customs Clearance', status: 'Customs Clearance', link: '/shipments/SHP-2026-003' },
  { id: 'AC-05', partnerId: 'PT-001', at: t(-2, '10:00'), message: 'Commercial invoice requested for ORD-2026-003', status: 'Requested', link: '/documents?doc=DOC-2026-008' },
  { id: 'AC-04', partnerId: 'PT-001', at: t(-3, '14:05'), message: 'Order ORD-2026-002 issued for your confirmation', status: 'Awaiting Confirmation', link: '/orders/ORD-2026-002' },
  { id: 'AC-03', partnerId: 'PT-001', at: t(-5, '10:15'), message: 'QUO-2026-002 moved to Under Review', status: 'Under Review', link: '/quotations/QUO-2026-002' },
  { id: 'AC-02', partnerId: 'PT-001', at: t(-7, '11:00'), message: 'SHP-2026-006 reported as delayed', status: 'Delayed', link: '/shipments/SHP-2026-006' },
  { id: 'AC-01', partnerId: 'PT-001', at: t(-15, '08:00'), message: 'Order ORD-2026-001 confirmed and in progress', status: 'In Progress', link: '/orders/ORD-2026-001' },
]
