// FICTIONAL SAMPLE DATA. Stored notifications; "due today", "overdue" and
// "shipment update needed" alerts are generated from tasks/shipments in lib/selectors.js.
export const notifications = (t) => [
  { id: 'NT-01', employeeId: 'EM-001', at: t(0, '08:10'), type: 'assigned', title: 'New task assigned', description: 'TSK-1101 · Confirm vessel booking for SHP-2026-065', link: '/tasks/TK-01', read: false },
  { id: 'NT-02', employeeId: 'EM-001', at: t(-1, '17:05'), type: 'instructions', title: 'Instructions updated', description: 'TSK-1105 · Include the bill of lading reference in the dispatch checklist.', link: '/tasks/TK-05', read: false },
  { id: 'NT-03', employeeId: 'EM-001', at: t(-1, '11:40'), type: 'document', title: 'Document information requested', description: 'Certificate of origin — rice (SHP-2026-061)', link: '/documents/DC-307', read: false },
  { id: 'NT-04', employeeId: 'EM-001', at: t(-2, '09:15'), type: 'assigned', title: 'New task assigned', description: 'TSK-1108 · Arrange inland delivery for rice consignment', link: '/tasks/TK-08', read: true },
  { id: 'NT-05', employeeId: 'EM-001', at: t(-3, '15:00'), type: 'assigned', title: 'New task assigned', description: 'TSK-1107 · Request mill test certificates for rebar', link: '/tasks/TK-07', read: true },
  { id: 'NT-06', employeeId: 'EM-001', at: t(-4, '08:30'), type: 'instructions', title: 'Operational instructions', description: 'Weekly coordination meeting moves to Thursday at 09:00.', link: '', read: true },
  { id: 'NT-07', employeeId: 'EM-002', at: t(-1, '08:00'), type: 'assigned', title: 'New task assigned', description: 'TSK-1110 · Confirm truck arrival in Berbera', link: '/tasks/TK-11', read: false },
]
