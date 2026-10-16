// FICTIONAL SAMPLE DATA — shipment records entered by the MAKHORIZON team.
// Not live carrier tracking: no GPS positions, no carrier integration.

/** Timeline stages, in order. A shipment's `stage` is the index of the last stage reached. */
export const SHIPMENT_STAGES = ['Order Confirmed', 'Preparing Shipment', 'Dispatched', 'In Transit', 'Customs Clearance', 'Out for Delivery', 'Delivered']
export const shipmentStatuses = ['Preparing Shipment', 'Dispatched', 'In Transit', 'Customs Clearance', 'Out for Delivery', 'Delivered', 'Delayed']
export const shippingMethods = ['Sea freight', 'Air freight', 'Road freight']

const ev = (at, stage, note = '') => ({ at, stage, note })

export const shipments = (d, t) => [
  {
    id: 'SHP-2026-001', partnerId: 'PT-001', orderId: 'ORD-2026-001', origin: 'Nairobi, Kenya', destination: 'Djibouti Free Zone', method: 'Road freight', carrier: '', trackingRef: '',
    dispatchDate: d(5), eta: d(12), deliveredOn: '', status: 'Preparing Shipment', stage: 1, delayed: false,
    deliveryNotes: 'Lot 1 being palletised. Packing list requested before dispatch.',
    events: [ev(t(-22, '10:30'), 0), ev(t(-4, '09:00'), 1, 'Palletising started')],
  },
  {
    id: 'SHP-2026-002', partnerId: 'PT-001', orderId: 'ORD-2026-003', origin: 'Mombasa, Kenya', destination: 'Port of Djibouti', method: 'Sea freight', carrier: 'Sample Indian Ocean Line', trackingRef: 'BL-MBA-204871',
    dispatchDate: d(-12), eta: d(2), deliveredOn: '', status: 'In Transit', stage: 3, delayed: false,
    deliveryNotes: 'Consignment 1 of 2. Customs clearance at Djibouti to follow arrival.',
    events: [ev(t(-29, '11:00'), 0), ev(t(-20, '08:00'), 1), ev(t(-12, '07:30'), 2, 'Loaded at Mombasa'), ev(t(-11, '18:00'), 3, 'Vessel departed')],
  },
  {
    id: 'SHP-2026-003', partnerId: 'PT-001', orderId: 'ORD-2026-003', origin: 'Port of Djibouti', destination: 'Djibouti Free Zone, Warehouse 7', method: 'Road freight', carrier: 'Sample Djibouti Haulage', trackingRef: 'DJH-77120',
    dispatchDate: d(-6), eta: d(1), deliveredOn: '', status: 'Customs Clearance', stage: 4, delayed: false,
    deliveryNotes: 'Consignment 2 of 2. Awaiting commercial invoice to complete customs.',
    events: [ev(t(-29, '11:00'), 0), ev(t(-9, '09:00'), 1), ev(t(-6, '08:00'), 2), ev(t(-6, '14:00'), 3), ev(t(-2, '10:00'), 4, 'Customs documents lodged')],
  },
  {
    id: 'SHP-2026-004', partnerId: 'PT-001', orderId: 'ORD-2026-004', origin: 'Jeddah, Saudi Arabia', destination: 'Port of Djibouti', method: 'Sea freight', carrier: 'Sample Red Sea Feeder', trackingRef: 'BL-JED-11930',
    dispatchDate: d(-80), eta: d(-64), deliveredOn: d(-63), status: 'Delivered', stage: 6, delayed: false,
    deliveryNotes: 'Delivered and signed for at the port warehouse.',
    events: [ev(t(-104, '10:00'), 0), ev(t(-90, '10:00'), 1), ev(t(-80, '10:00'), 2), ev(t(-79, '10:00'), 3), ev(t(-66, '10:00'), 4), ev(t(-64, '08:00'), 5), ev(t(-63, '15:00'), 6, 'Delivery receipt signed')],
  },
  {
    id: 'SHP-2026-005', partnerId: 'PT-001', orderId: 'ORD-2026-005', origin: 'Nairobi, Kenya', destination: 'Djibouti Free Zone', method: 'Road freight', carrier: 'Sample Corridor Trucking', trackingRef: '',
    dispatchDate: d(-133), eta: d(-127), deliveredOn: d(-127), status: 'Delivered', stage: 6, delayed: false,
    deliveryNotes: '',
    events: [ev(t(-149, '10:00'), 0), ev(t(-140, '10:00'), 1), ev(t(-133, '10:00'), 2), ev(t(-132, '10:00'), 3), ev(t(-129, '10:00'), 4), ev(t(-128, '10:00'), 5), ev(t(-127, '10:00'), 6)],
  },
  {
    id: 'SHP-2026-006', partnerId: 'PT-001', orderId: 'ORD-2026-006', origin: 'Dar es Salaam, Tanzania', destination: 'Port of Djibouti', method: 'Sea freight', carrier: 'Sample East Africa Express', trackingRef: 'BL-DAR-55018',
    dispatchDate: d(-25), eta: d(-5), deliveredOn: '', status: 'Delayed', stage: 3, delayed: true,
    deliveryNotes: 'Missed connection at transhipment port. A revised arrival date has not been confirmed yet.',
    events: [ev(t(-39, '10:00'), 0), ev(t(-30, '10:00'), 1), ev(t(-25, '10:00'), 2), ev(t(-24, '10:00'), 3), ev(t(-7, '11:00'), 3, 'Delayed — missed transhipment connection')],
  },
  // Another partner's shipment — hidden.
  {
    id: 'SHP-2026-007', partnerId: 'PT-002', orderId: 'ORD-2026-007', origin: 'Djibouti', destination: 'Djibouti', method: 'Road freight', carrier: '', trackingRef: '',
    dispatchDate: d(3), eta: d(4), deliveredOn: '', status: 'Preparing Shipment', stage: 1, delayed: false, deliveryNotes: '', events: [ev(t(-9, '10:00'), 0)],
  },
]
