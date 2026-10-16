// FICTIONAL SAMPLE DATA — orders issued by MAKHORIZON to partners.
export const orderStatuses = ['Awaiting Confirmation', 'Confirmed', 'In Progress', 'Ready for Dispatch', 'Dispatched', 'Delivered', 'Completed', 'On Hold', 'Cancelled']
export const ACTIVE_ORDER_STATUSES = ['Awaiting Confirmation', 'Confirmed', 'In Progress', 'Ready for Dispatch', 'Dispatched', 'On Hold']

const h = (at, status, note = '') => ({ at, status, note })
const note = (id, at, author, by, message, type = 'note') => ({ id, at, author, by, message, type })

export const orders = (d, t) => [
  {
    id: 'ORD-2026-001', partnerId: 'PT-001', title: 'Corrugated packaging — lots 1 to 3', quotationId: 'QUO-2026-001', orderDate: d(-23), currency: 'USD',
    items: [
      { description: 'Double-wall carton, size A (60×40×40 cm)', quantity: 12000, unit: 'carton', unitPrice: 1.38 },
      { description: 'Double-wall carton, size B (40×30×30 cm)', quantity: 12000, unit: 'carton', unitPrice: 1.26 },
      { description: 'Stretch pallet wrap, 23 micron', quantity: 300, unit: 'roll', unitPrice: 14.5 },
    ],
    deliveryLocation: 'Djibouti Free Zone, Warehouse 7', deliveryInstructions: 'Deliver on pallets, maximum height 1.8 m. Notify the warehouse 48 hours before arrival.', deliveryDeadline: d(18),
    status: 'In Progress', confirmedAt: t(-22, '10:30'),
    history: [h(t(-23, '09:00'), 'Awaiting Confirmation', 'Order issued by MAKHORIZON'), h(t(-22, '10:30'), 'Confirmed', 'Confirmed by partner'), h(t(-15, '08:00'), 'In Progress', 'Production started')],
    notes: [note('ON-01', t(-15, '08:05'), 'makhorizon', 'Operations Team', 'Thank you — please share the packing list before dispatch.'), note('ON-02', t(-14, '09:20'), 'partner', 'Ahmed Abdi Farah', 'Noted. Packing list will follow once lot 1 is palletised.')],
  },
  {
    id: 'ORD-2026-002', partnerId: 'PT-001', title: 'Corridor distribution — pilot (3 months)', quotationId: 'QUO-2026-008', orderDate: d(-3), currency: 'DJF',
    items: [
      { description: 'Monthly distribution service fee', quantity: 3, unit: 'month', unitPrice: 4200000 },
      { description: 'Set-up and route planning', quantity: 1, unit: 'service', unitPrice: 350000 },
      { description: 'Tax (10%) on monthly service fee', quantity: 1, unit: 'line', unitPrice: 1260000 },
    ],
    deliveryLocation: 'Djibouti corridor (Djibouti – Dire Dawa – Hargeisa)', deliveryInstructions: 'Weekly delivery reports to the Operations Team.', deliveryDeadline: d(14),
    status: 'Awaiting Confirmation', confirmedAt: '',
    history: [h(t(-3, '14:05'), 'Awaiting Confirmation', 'Order issued by MAKHORIZON')],
    notes: [],
  },
  {
    id: 'ORD-2026-003', partnerId: 'PT-001', title: 'Packaging — first supply round', quotationId: 'QUO-2026-009', orderDate: d(-30), currency: 'USD',
    items: [{ description: 'Double-wall carton, size A', quantity: 16000, unit: 'carton', unitPrice: 1.28 }],
    deliveryLocation: 'Djibouti Free Zone, Warehouse 7', deliveryInstructions: 'Two consignments; second consignment by road from Port of Djibouti.', deliveryDeadline: d(6),
    status: 'Dispatched', confirmedAt: t(-29, '11:00'),
    history: [h(t(-30, '10:00'), 'Awaiting Confirmation'), h(t(-29, '11:00'), 'Confirmed'), h(t(-24, '08:00'), 'In Progress'), h(t(-14, '16:00'), 'Ready for Dispatch'), h(t(-12, '07:30'), 'Dispatched')],
    notes: [note('ON-03', t(-12, '07:45'), 'makhorizon', 'Operations Team', 'Commercial invoice still needed for customs — please upload it in Documents.')],
  },
  {
    id: 'ORD-2026-004', partnerId: 'PT-001', title: 'Refined sugar — 120 t lot', quotationId: 'QUO-2026-010', orderDate: d(-105), currency: 'USD',
    items: [{ description: 'Refined sugar ICUMSA 45, 50 kg bags', quantity: 120, unit: 'tonne', unitPrice: 612 }, { description: 'Inland handling', quantity: 1, unit: 'service', unitPrice: 2400 }],
    deliveryLocation: 'Port of Djibouti', deliveryInstructions: '', deliveryDeadline: d(-60),
    status: 'Delivered', confirmedAt: t(-104, '10:00'),
    history: [h(t(-105, '10:00'), 'Awaiting Confirmation'), h(t(-104, '10:00'), 'Confirmed'), h(t(-95, '10:00'), 'In Progress'), h(t(-80, '10:00'), 'Dispatched'), h(t(-63, '15:00'), 'Delivered')],
    notes: [],
  },
  {
    id: 'ORD-2026-005', partnerId: 'PT-001', title: 'Framework order — pallet wrap top-up', quotationId: '', orderDate: d(-150), currency: 'USD',
    items: [{ description: 'Stretch pallet wrap, 23 micron', quantity: 400, unit: 'roll', unitPrice: 13.9 }],
    deliveryLocation: 'Djibouti Free Zone, Warehouse 7', deliveryInstructions: '', deliveryDeadline: d(-125),
    status: 'Completed', confirmedAt: t(-149, '10:00'),
    history: [h(t(-150, '10:00'), 'Awaiting Confirmation'), h(t(-149, '10:00'), 'Confirmed'), h(t(-127, '10:00'), 'Delivered'), h(t(-120, '10:00'), 'Completed')],
    notes: [],
  },
  {
    id: 'ORD-2026-006', partnerId: 'PT-001', title: 'Sample consignment — split peas', quotationId: '', orderDate: d(-40), currency: 'USD',
    items: [{ description: 'Yellow split peas (sample lot), 50 kg bags', quantity: 18, unit: 'tonne', unitPrice: 905 }],
    deliveryLocation: 'Port of Djibouti', deliveryInstructions: 'Hold at port pending quality inspection.', deliveryDeadline: d(-5),
    status: 'On Hold', confirmedAt: t(-39, '10:00'),
    history: [h(t(-40, '10:00'), 'Awaiting Confirmation'), h(t(-39, '10:00'), 'Confirmed'), h(t(-25, '10:00'), 'Dispatched'), h(t(-7, '11:00'), 'On Hold', 'Vessel delayed at transhipment; delivery on hold.')],
    notes: [],
  },
  // Another partner's order — hidden.
  {
    id: 'ORD-2026-007', partnerId: 'PT-002', title: 'Rebar lot', quotationId: '', orderDate: d(-10), currency: 'USD', items: [{ description: 'Rebar', quantity: 100, unit: 'tonne', unitPrice: 690 }],
    deliveryLocation: 'Djibouti', deliveryInstructions: '', deliveryDeadline: d(20), status: 'Confirmed', confirmedAt: t(-9, '10:00'), history: [h(t(-9, '10:00'), 'Confirmed')], notes: [],
  },
]
