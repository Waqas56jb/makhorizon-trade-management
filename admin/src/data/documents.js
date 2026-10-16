// FICTIONAL SAMPLE DATA — metadata only. No real files are bundled with the demo.
export const documentTypes = ['Quotations', 'Invoices', 'Purchase Documents', 'Shipping Documents', 'Contracts', 'Receipts', 'Other Trade Documents']
export const relatedTypes = [
  { value: 'client', label: 'Client' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'order', label: 'Order' },
  { value: 'shipment', label: 'Shipment' },
  { value: 'partner', label: 'Partner' },
]

export const documents = (d) => [
  { id: 'DC-001', name: 'Quotation QT-2026-001', type: 'Quotations', relatedType: 'client', relatedId: 'CL-003', uploadDate: d(-150), fileName: 'QT-2026-001.pdf', fileSize: 184320, description: 'Signed quotation for cement supply.' },
  { id: 'DC-002', name: 'Bill of lading — cement vessel', type: 'Shipping Documents', relatedType: 'shipment', relatedId: 'SH-001', uploadDate: d(-99), fileName: 'BL-MER-44821.pdf', fileSize: 412000, description: 'Original BL scan.' },
  { id: 'DC-003', name: 'Supply contract — Anatolia Steel & Cement', type: 'Contracts', relatedType: 'supplier', relatedId: 'SP-001', uploadDate: d(-115), fileName: 'contract-anatolia-2026.pdf', fileSize: 905000, description: 'Framework supply terms for cement and rebar.' },
  { id: 'DC-004', name: 'Commercial invoice — coffee export', type: 'Invoices', relatedType: 'order', relatedId: 'OR-002', uploadDate: d(-40), fileName: 'INV-2026-002.pdf', fileSize: 152000, description: '' },
  { id: 'DC-005', name: 'Phytosanitary certificate (container 1)', type: 'Shipping Documents', relatedType: 'shipment', relatedId: 'SH-002', uploadDate: d(-18), fileName: 'phyto-cert-c1.jpg', fileSize: 1240000, description: 'Certificate for container 2 still pending.' },
  { id: 'DC-006', name: 'Purchase order PO-0425 — rice', type: 'Purchase Documents', relatedType: 'supplier', relatedId: 'SP-002', uploadDate: d(-33), fileName: 'PO-0425.pdf', fileSize: 98000, description: '' },
  { id: 'DC-007', name: 'Packing list — rice consignment', type: 'Shipping Documents', relatedType: 'shipment', relatedId: 'SH-004', uploadDate: d(-11), fileName: 'packing-list-cok-11872.xlsx', fileSize: 46000, description: '' },
  { id: 'DC-008', name: 'Payment receipt TRF-88544', type: 'Receipts', relatedType: 'client', relatedId: 'CL-003', uploadDate: d(-28), fileName: 'receipt-TRF-88544.pdf', fileSize: 71000, description: 'Final cement payment.' },
  { id: 'DC-009', name: 'Carrier delay notice', type: 'Other Trade Documents', relatedType: 'shipment', relatedId: 'SH-005', uploadDate: d(-7), fileName: 'delay-notice-jea-55190.pdf', fileSize: 64000, description: 'Notice of missed transhipment connection.' },
  { id: 'DC-010', name: 'Haulage agreement — Djibouti Inland Haulage', type: 'Contracts', relatedType: 'supplier', relatedId: 'SP-004', uploadDate: d(-160), fileName: 'haulage-agreement.pdf', fileSize: 530000, description: '' },
  { id: 'DC-011', name: 'Order confirmation — steel rebar', type: 'Purchase Documents', relatedType: 'order', relatedId: 'OR-007', uploadDate: d(-23), fileName: 'ORD-2026-007-confirmation.pdf', fileSize: 120000, description: '' },
  { id: 'DC-012', name: 'Introductory profile — Corridor Logistics', type: 'Other Trade Documents', relatedType: 'partner', relatedId: 'PT-001', uploadDate: d(-30), fileName: 'corridor-logistics-profile.pdf', fileSize: 2100000, description: 'Company profile shared by the partner.' },
]
