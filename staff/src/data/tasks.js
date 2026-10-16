// FICTIONAL SAMPLE DATA
export const taskStatuses = ['To Do', 'In Progress', 'Completed', 'Blocked']
export const taskPriorities = ['Low', 'Normal', 'High', 'Urgent']
export const PRIORITY_RANK = { Urgent: 0, High: 1, Normal: 2, Low: 3 }

const h = (at, from, to, by, note = '') => ({ at, from, to, by, note })
const ADMIN = 'EM-ADM'

export const tasks = (d, t) => [
  {
    id: 'TK-01', reference: 'TSK-1101', title: 'Confirm vessel booking for SHP-2026-065', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(0, '08:10'), dueDate: d(0), priority: 'High', status: 'To Do',
    description: 'The carrier has offered space on a vessel departing Ningbo in five days. Confirm the booking so the hardware consignment can be planned.',
    instructions: 'Check the departure date with Lianhe Industrial before confirming. Record the booking reference on the shipment once received.',
    orderId: 'OR-105', shipmentId: 'SH-205', documentIds: ['DC-306'], requiresApproval: false, supportsProgress: false, progress: 0,
    history: [h(t(0, '08:10'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned')], notes: [],
  },
  {
    id: 'TK-02', reference: 'TSK-1102', title: 'Obtain certificate of origin for rice consignment', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(-3, '09:00'), dueDate: d(0), priority: 'Urgent', status: 'In Progress',
    description: 'The certificate of origin is required before the rice can be cleared on arrival in Djibouti.',
    instructions: 'Ask the supplier in Kochi for a scanned copy today and register it under Documents, linked to SHP-2026-061.',
    orderId: 'OR-101', shipmentId: 'SH-201', documentIds: ['DC-307', 'DC-305'], requiresApproval: false, supportsProgress: true, progress: 40,
    history: [h(t(-3, '09:00'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned'), h(t(-2, '10:30'), 'To Do', 'In Progress', 'Ahmed Hassan')],
    notes: [{ id: 'N1', at: t(-1, '14:00'), by: 'Ahmed Hassan', text: 'Supplier says the chamber of commerce will issue it tomorrow.' }],
  },
  {
    id: 'TK-03', reference: 'TSK-1103', title: 'Follow up phytosanitary certificate for container 2', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(-12, '11:00'), dueDate: d(-2), priority: 'High', status: 'Blocked', blockedReason: 'Waiting for a Ministry inspection slot for container 2.',
    description: 'Container 2 of the coffee export cannot be loaded until its phytosanitary certificate is issued.',
    instructions: 'Contact the exporter daily. Escalate to the administrator if no slot is available by the end of the week.',
    orderId: 'OR-102', shipmentId: 'SH-202', documentIds: ['DC-303'], requiresApproval: false, supportsProgress: false, progress: 0,
    history: [h(t(-12, '11:00'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned'), h(t(-10, '09:00'), 'To Do', 'In Progress', 'Ahmed Hassan'), h(t(-4, '16:00'), 'In Progress', 'Blocked', 'Ahmed Hassan', 'Waiting for a Ministry inspection slot for container 2.')],
    notes: [],
  },
  {
    id: 'TK-04', reference: 'TSK-1104', title: 'Send delay update to Rift Valley Distributors', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(-6, '10:00'), dueDate: d(-1), priority: 'Urgent', status: 'To Do',
    description: 'Shipment SHP-2026-064 has missed its transhipment connection. The client needs an update on the situation.',
    instructions: 'Share only confirmed information from the carrier. Do not promise a new arrival date until it is confirmed in writing.',
    orderId: 'OR-104', shipmentId: 'SH-204', documentIds: ['DC-308'], requiresApproval: false, supportsProgress: false, progress: 0,
    history: [h(t(-6, '10:00'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned')], notes: [],
  },
  {
    id: 'TK-05', reference: 'TSK-1105', title: 'Prepare dispatch checklist for Jebel Ali feeder', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(-5, '09:30'), dueDate: d(2), priority: 'Normal', status: 'In Progress',
    description: 'Prepare the checklist for loading containers 1–2 on the feeder vessel to Jebel Ali.',
    instructions: 'Use the standard checklist: seals, weights, documents, gate-in time. Updated: include the bill of lading reference once issued.',
    orderId: 'OR-102', shipmentId: 'SH-203', documentIds: ['DC-304', 'DC-311'], requiresApproval: false, supportsProgress: true, progress: 60,
    history: [h(t(-5, '09:30'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned'), h(t(-4, '08:45'), 'To Do', 'In Progress', 'Ahmed Hassan')],
    notes: [],
  },
  {
    id: 'TK-06', reference: 'TSK-1106', title: 'Verify packing list against commercial invoice', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(-2, '13:00'), dueDate: d(3), priority: 'Normal', status: 'To Do',
    description: 'Check that quantities and descriptions on the rice packing list match the supplier invoice.',
    instructions: 'Report any difference in the notes. This task is reviewed by the administrator after you complete it.',
    orderId: 'OR-101', shipmentId: 'SH-201', documentIds: ['DC-302', 'DC-305'], requiresApproval: true, supportsProgress: false, progress: 0,
    history: [h(t(-2, '13:00'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned')], notes: [],
  },
  {
    id: 'TK-07', reference: 'TSK-1107', title: 'Request mill test certificates for rebar', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(-3, '15:00'), dueDate: d(6), priority: 'Low', status: 'To Do',
    description: 'The client requires mill test certificates for the steel rebar before shipment.',
    instructions: 'Request them from the supplier through the usual email thread.',
    orderId: 'OR-103', shipmentId: '', documentIds: ['DC-309'], requiresApproval: false, supportsProgress: false, progress: 0,
    history: [h(t(-3, '15:00'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned')], notes: [],
  },
  {
    id: 'TK-08', reference: 'TSK-1108', title: 'Arrange inland delivery for rice consignment', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(-2, '09:15'), dueDate: d(5), priority: 'High', status: 'To Do',
    description: 'Book a truck to move the rice from the port to the client warehouse after arrival.',
    instructions: 'Use the approved haulage provider. Confirm the client’s receiving hours before booking.',
    orderId: 'OR-101', shipmentId: 'SH-201', documentIds: [], requiresApproval: false, supportsProgress: false, progress: 0,
    history: [h(t(-2, '09:15'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned')], notes: [],
  },
  {
    id: 'TK-09', reference: 'TSK-1098', title: 'Close out delivery file for Gulf Coast Foods', assignedTo: 'EM-001', assignedBy: ADMIN, assignedAt: t(-66, '10:00'), dueDate: d(-60), priority: 'Normal', status: 'Completed', completedAt: t(-61, '16:30'),
    description: 'Collect the signed delivery receipt and file it with the order.',
    instructions: 'Scan the receipt and register it under Documents.',
    orderId: 'OR-106', shipmentId: 'SH-206', documentIds: ['DC-310'], requiresApproval: false, supportsProgress: false, progress: 100,
    history: [h(t(-66, '10:00'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned'), h(t(-64, '09:00'), 'To Do', 'In Progress', 'Ahmed Hassan'), h(t(-61, '16:30'), 'In Progress', 'Completed', 'Ahmed Hassan', 'Receipt filed')],
    notes: [],
  },
  // Another employee's tasks — not visible to Ahmed.
  {
    id: 'TK-10', reference: 'TSK-1109', title: 'Register packaging specification for Sahel order', assignedTo: 'EM-002', assignedBy: ADMIN, assignedAt: t(-2, '10:00'), dueDate: d(1), priority: 'Normal', status: 'To Do',
    description: 'Register the packaging specification document.', instructions: '', orderId: 'OR-107', shipmentId: 'SH-207', documentIds: [], requiresApproval: false, supportsProgress: false, progress: 0,
    history: [h(t(-2, '10:00'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned')], notes: [],
  },
  {
    id: 'TK-11', reference: 'TSK-1110', title: 'Confirm truck arrival in Berbera', assignedTo: 'EM-002', assignedBy: ADMIN, assignedAt: t(-1, '08:00'), dueDate: d(2), priority: 'High', status: 'In Progress',
    description: 'Confirm arrival with the haulier.', instructions: '', orderId: 'OR-108', shipmentId: 'SH-208', documentIds: [], requiresApproval: false, supportsProgress: false, progress: 0,
    history: [h(t(-1, '08:00'), null, 'To Do', 'Mako Mohamed Bouh', 'Task assigned')], notes: [],
  },
]
