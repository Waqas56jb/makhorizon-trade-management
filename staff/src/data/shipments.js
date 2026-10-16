// FICTIONAL SAMPLE DATA — internal coordination records, not live carrier tracking.
export const shipmentStatuses = ['Planned', 'Ready for Dispatch', 'In Transit', 'Arrived', 'Delivered', 'Delayed', 'Cancelled']
export const transportModes = ['Sea', 'Air', 'Road', 'Other']

/** Operational updates staff may record. Cancellation stays with the administrator. */
export const staffShipmentTransitions = {
  Planned: ['Ready for Dispatch', 'Delayed'],
  'Ready for Dispatch': ['In Transit', 'Delayed'],
  'In Transit': ['Arrived', 'Delayed'],
  Arrived: ['Delivered', 'Delayed'],
  Delayed: ['Ready for Dispatch', 'In Transit', 'Arrived'],
  Delivered: [],
  Cancelled: [],
}

const ev = (at, from, to, by, note = '') => ({ at, from, to, by, note })

export const shipments = (d, t) => [
  {
    id: 'SH-201', reference: 'SHP-2026-061', orderId: 'OR-101', assignedTo: 'EM-001', origin: 'Kochi, India', destination: 'Djibouti', mode: 'Sea', carrier: 'Sample Arabian Sea Line', trackingRef: 'BL-COK-11872',
    departureDate: d(-11), expectedArrival: d(3), actualArrival: '', status: 'In Transit', notes: 'Inland delivery to client warehouse to be arranged on arrival.',
    requiredDocs: [{ name: 'Bill of lading', documentId: 'DC-301' }, { name: 'Packing list', documentId: 'DC-302' }, { name: 'Certificate of origin', documentId: 'DC-307' }],
    events: [ev(t(-16, '10:00'), null, 'Planned', 'Ahmed Hassan', 'Booking confirmed'), ev(t(-11, '08:30'), 'Planned', 'In Transit', 'Ahmed Hassan', 'Departed Kochi')],
  },
  {
    id: 'SH-202', reference: 'SHP-2026-062', orderId: 'OR-102', assignedTo: 'EM-001', origin: 'Addis Ababa, Ethiopia', destination: 'Djibouti Port', mode: 'Road', carrier: 'Djibouti Inland Haulage SARL', trackingRef: '',
    departureDate: d(-20), expectedArrival: d(-17), actualArrival: d(-16), status: 'Arrived', notes: 'Containers 1–2 at port awaiting feeder vessel.',
    requiredDocs: [{ name: 'Phytosanitary certificate (container 1)', documentId: 'DC-303' }, { name: 'Phytosanitary certificate (container 2)', documentId: '' }],
    events: [ev(t(-24, '09:00'), null, 'Planned', 'Ahmed Hassan'), ev(t(-20, '06:45'), 'Planned', 'In Transit', 'Ahmed Hassan'), ev(t(-16, '14:10'), 'In Transit', 'Arrived', 'Ahmed Hassan', 'Received at port gate')],
  },
  {
    id: 'SH-203', reference: 'SHP-2026-063', orderId: 'OR-102', assignedTo: 'EM-001', origin: 'Djibouti', destination: 'Jebel Ali, UAE', mode: 'Sea', carrier: 'Sample Gulf Feeder', trackingRef: 'BL-DJI-90233',
    departureDate: d(4), expectedArrival: d(9), actualArrival: '', status: 'Ready for Dispatch', notes: '',
    requiredDocs: [{ name: 'Commercial invoice', documentId: 'DC-304' }, { name: 'Bill of lading', documentId: '' }],
    events: [ev(t(-10, '11:00'), null, 'Planned', 'Ahmed Hassan'), ev(t(-2, '10:05'), 'Planned', 'Ready for Dispatch', 'Ahmed Hassan', 'Documents prepared except bill of lading')],
  },
  {
    id: 'SH-204', reference: 'SHP-2026-064', orderId: 'OR-104', assignedTo: 'EM-001', origin: 'Jebel Ali, UAE', destination: 'Mombasa, Kenya', mode: 'Sea', carrier: 'Sample East Africa Express', trackingRef: 'BL-JEA-55190',
    departureDate: d(-25), expectedArrival: d(-8), actualArrival: '', status: 'Delayed', notes: 'Revised arrival date not yet confirmed by carrier.',
    requiredDocs: [{ name: 'Bill of lading', documentId: 'DC-314' }],
    events: [ev(t(-30, '09:00'), null, 'Planned', 'Ahmed Hassan'), ev(t(-25, '07:15'), 'Planned', 'In Transit', 'Ahmed Hassan'), ev(t(-7, '11:30'), 'In Transit', 'Delayed', 'Ahmed Hassan', 'Missed connection at transhipment port')],
  },
  {
    id: 'SH-205', reference: 'SHP-2026-065', orderId: 'OR-105', assignedTo: 'EM-001', origin: 'Ningbo, China', destination: 'Djibouti', mode: 'Sea', carrier: '', trackingRef: '',
    departureDate: d(5), expectedArrival: d(27), actualArrival: '', status: 'Planned', notes: 'Vessel booking requested; awaiting confirmation.',
    requiredDocs: [{ name: 'Booking confirmation', documentId: '' }],
    events: [ev(t(-5, '15:00'), null, 'Planned', 'Ahmed Hassan', 'Booking requested')],
  },
  {
    id: 'SH-206', reference: 'SHP-2026-058', orderId: 'OR-106', assignedTo: 'EM-001', origin: 'Djibouti', destination: 'Dubai, UAE', mode: 'Sea', carrier: 'Sample Gulf Feeder', trackingRef: 'BL-DJI-77310',
    departureDate: d(-70), expectedArrival: d(-64), actualArrival: d(-63), status: 'Delivered', notes: '',
    requiredDocs: [{ name: 'Delivery receipt', documentId: 'DC-310' }],
    events: [ev(t(-75, '09:00'), null, 'Planned', 'Ahmed Hassan'), ev(t(-70, '06:00'), 'Planned', 'In Transit', 'Ahmed Hassan'), ev(t(-63, '16:20'), 'In Transit', 'Delivered', 'Ahmed Hassan', 'Signed delivery receipt received')],
  },
  // Another employee's shipments — not visible to Ahmed.
  {
    id: 'SH-207', reference: 'SHP-2026-066', orderId: 'OR-107', assignedTo: 'EM-002', origin: 'Djibouti', destination: 'Dakar, Senegal', mode: 'Sea', carrier: '', trackingRef: '',
    departureDate: d(14), expectedArrival: d(36), actualArrival: '', status: 'Planned', notes: '', requiredDocs: [],
    events: [ev(t(-3, '10:00'), null, 'Planned', 'Fatouma Ali')],
  },
  {
    id: 'SH-208', reference: 'SHP-2026-067', orderId: 'OR-108', assignedTo: 'EM-002', origin: 'Djibouti', destination: 'Berbera, Somalia', mode: 'Road', carrier: 'Sample Coastal Haulage', trackingRef: '',
    departureDate: d(-1), expectedArrival: d(2), actualArrival: '', status: 'In Transit', notes: '', requiredDocs: [],
    events: [ev(t(-4, '10:00'), null, 'Planned', 'Fatouma Ali'), ev(t(-1, '05:30'), 'Planned', 'In Transit', 'Fatouma Ali')],
  },
]
