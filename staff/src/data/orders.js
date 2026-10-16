// FICTIONAL SAMPLE DATA. Staff see operational order details only — no prices.
export const orderStatuses = ['Confirmed', 'Processing', 'Awaiting Documents', 'Ready for Dispatch', 'Completed', 'Cancelled']

/** Operational status changes staff may report. Completion and cancellation stay with the administrator. */
export const staffOrderTransitions = {
  Confirmed: ['Processing'],
  Processing: ['Awaiting Documents', 'Ready for Dispatch'],
  'Awaiting Documents': ['Processing', 'Ready for Dispatch'],
  'Ready for Dispatch': ['Awaiting Documents'],
  Completed: [],
  Cancelled: [],
}

export const orders = (d, t) => [
  {
    id: 'OR-101', number: 'ORD-2026-041', assignedTo: 'EM-001',
    client: { company: 'Horn Trade Supplies', contact: 'Amina Hassan', country: 'Djibouti' },
    orderDate: d(-38), expectedDate: d(12), origin: 'Kochi, India', destination: 'Djibouti', cargo: 'Long-grain rice, 25 kg bags', quantity: '40 tonnes', status: 'Processing', updatedAt: t(-1, '15:20'),
    history: [{ at: t(-38, '09:00'), status: 'Confirmed', by: 'Mako Mohamed Bouh', note: 'Order confirmed' }, { at: t(-30, '11:15'), status: 'Processing', by: 'Ahmed Hassan', note: 'Supplier confirmed loading date' }],
    updates: [{ id: 'U1', at: t(-1, '15:20'), by: 'Ahmed Hassan', text: 'Packing list received from supplier and filed.' }],
  },
  {
    id: 'OR-102', number: 'ORD-2026-042', assignedTo: 'EM-001',
    client: { company: 'Abyssinia Agro Exports PLC', contact: 'Yonas Tesfaye', country: 'Ethiopia' },
    orderDate: d(-62), expectedDate: d(10), origin: 'Addis Ababa, Ethiopia', destination: 'Jebel Ali, UAE', cargo: 'Washed Arabica coffee, 60 kg jute bags', quantity: '3 containers', status: 'Awaiting Documents', updatedAt: t(-2, '10:05'),
    history: [{ at: t(-62, '09:30'), status: 'Confirmed', by: 'Mako Mohamed Bouh', note: '' }, { at: t(-45, '14:00'), status: 'Processing', by: 'Ahmed Hassan', note: '' }, { at: t(-12, '16:40'), status: 'Awaiting Documents', by: 'Ahmed Hassan', note: 'Phytosanitary certificate for container 2 outstanding' }],
    updates: [{ id: 'U1', at: t(-2, '10:05'), by: 'Ahmed Hassan', text: 'Containers 1–2 at port. Container 2 certificate still pending inspection.' }],
  },
  {
    id: 'OR-103', number: 'ORD-2026-043', assignedTo: 'EM-001',
    client: { company: 'Tadjoura Building Materials', contact: 'Farah Ali Omar', country: 'Djibouti' },
    orderDate: d(-9), expectedDate: d(30), origin: 'Iskenderun, Turkey', destination: 'Djibouti', cargo: 'Steel rebar B500, 12 mm', quantity: '120 tonnes', status: 'Confirmed', updatedAt: t(-9, '12:00'),
    history: [{ at: t(-9, '12:00'), status: 'Confirmed', by: 'Mako Mohamed Bouh', note: 'Supplier advance pending' }],
    updates: [],
  },
  {
    id: 'OR-104', number: 'ORD-2026-044', assignedTo: 'EM-001',
    client: { company: 'Rift Valley Distributors Ltd', contact: 'Daniel Mwangi', country: 'Kenya' },
    orderDate: d(-55), expectedDate: d(-5), origin: 'Jebel Ali, UAE', destination: 'Nairobi, Kenya', cargo: 'Small generators and electrical cable', quantity: '140 units', status: 'Processing', updatedAt: t(-7, '11:30'),
    history: [{ at: t(-55, '10:00'), status: 'Confirmed', by: 'Mako Mohamed Bouh', note: '' }, { at: t(-40, '09:20'), status: 'Processing', by: 'Ahmed Hassan', note: '' }],
    updates: [{ id: 'U1', at: t(-7, '11:30'), by: 'Ahmed Hassan', text: 'Carrier reported missed transhipment connection. Awaiting revised schedule.' }],
  },
  {
    id: 'OR-105', number: 'ORD-2026-045', assignedTo: 'EM-001',
    client: { company: 'Lianhe Industrial Trading Co.', contact: 'Chen Wei', country: 'China' },
    orderDate: d(-14), expectedDate: d(34), origin: 'Ningbo, China', destination: 'Djibouti', cargo: 'Hardware and fasteners, palletised', quantity: '2 containers', status: 'Ready for Dispatch', updatedAt: t(-3, '09:45'),
    history: [{ at: t(-14, '10:10'), status: 'Confirmed', by: 'Mako Mohamed Bouh', note: '' }, { at: t(-8, '13:00'), status: 'Processing', by: 'Ahmed Hassan', note: '' }, { at: t(-3, '09:45'), status: 'Ready for Dispatch', by: 'Ahmed Hassan', note: 'Goods ready at origin warehouse' }],
    updates: [],
  },
  {
    id: 'OR-106', number: 'ORD-2026-038', assignedTo: 'EM-001',
    client: { company: 'Gulf Coast Foods LLC', contact: 'Sara Al-Mansoori', country: 'United Arab Emirates' },
    orderDate: d(-88), expectedDate: d(-50), origin: 'Djibouti', destination: 'Dubai, UAE', cargo: 'Dried pulses (re-export)', quantity: '18 tonnes', status: 'Completed', updatedAt: t(-49, '17:00'),
    history: [{ at: t(-88, '09:00'), status: 'Confirmed', by: 'Mako Mohamed Bouh', note: '' }, { at: t(-80, '10:00'), status: 'Processing', by: 'Ahmed Hassan', note: '' }, { at: t(-49, '17:00'), status: 'Completed', by: 'Mako Mohamed Bouh', note: 'Delivery confirmed by client' }],
    updates: [],
  },
  // Assigned to another employee — must not appear for Ahmed.
  {
    id: 'OR-107', number: 'ORD-2026-046', assignedTo: 'EM-002',
    client: { company: 'Sahel Commodities SARL', contact: 'Fatima Diallo', country: 'Senegal' },
    orderDate: d(-6), expectedDate: d(40), origin: 'Djibouti', destination: 'Dakar, Senegal', cargo: 'Packaging materials', quantity: '30 bales', status: 'Confirmed', updatedAt: t(-6, '10:00'),
    history: [{ at: t(-6, '10:00'), status: 'Confirmed', by: 'Mako Mohamed Bouh', note: '' }],
    updates: [],
  },
  {
    id: 'OR-108', number: 'ORD-2026-047', assignedTo: 'EM-002',
    client: { company: 'Berbera Retail Group', contact: 'Hodan Abdi', country: 'Somalia' },
    orderDate: d(-11), expectedDate: d(4), origin: 'Djibouti', destination: 'Berbera, Somalia', cargo: 'Packaged food goods', quantity: '600 cartons', status: 'Processing', updatedAt: t(-1, '09:00'),
    history: [{ at: t(-11, '10:00'), status: 'Confirmed', by: 'Mako Mohamed Bouh', note: '' }, { at: t(-4, '10:00'), status: 'Processing', by: 'Fatouma Ali', note: '' }],
    updates: [],
  },
]
