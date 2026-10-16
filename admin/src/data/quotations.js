// FICTIONAL SAMPLE DATA — totals are always derived from line items (see lib/calc.js).
export const quotationStatuses = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired']

export const quotations = (d) => [
  {
    id: 'QT-001', number: 'QT-2026-001', clientId: 'CL-003', issueDate: d(-150), expiryDate: d(-120), currency: 'DJF', status: 'Accepted',
    description: 'Supply of Portland cement CEM II 42.5 from Turkey, CIF Djibouti.',
    items: [{ description: 'Portland cement CEM II 42.5 (50 kg bags), per tonne', quantity: 250, unitPrice: 17500 }, { description: 'Coordination and documentation fee', quantity: 1, unitPrice: 475000 }],
    taxRate: 0, additionalCharge: 0, notes: 'Price valid subject to vessel availability.',
  },
  {
    id: 'QT-002', number: 'QT-2026-002', clientId: 'CL-002', issueDate: d(-95), expiryDate: d(-65), currency: 'USD', status: 'Accepted',
    description: 'Export coordination for washed Arabica coffee, Djibouti to Jebel Ali.',
    items: [{ description: 'Coffee export coordination, per container', quantity: 3, unitPrice: 11800 }, { description: 'Document coordination', quantity: 1, unitPrice: 3100 }],
    taxRate: 0, additionalCharge: 0, notes: '',
  },
  {
    id: 'QT-003', number: 'QT-2026-003', clientId: 'CL-001', issueDate: d(-70), expiryDate: d(-40), currency: 'DJF', status: 'Accepted',
    description: 'Long-grain rice import from India.',
    items: [{ description: 'Long-grain rice (25 kg bags), per tonne', quantity: 40, unitPrice: 76000 }, { description: 'Inland delivery to warehouse', quantity: 1, unitPrice: 160000 }],
    taxRate: 0, additionalCharge: 0, notes: '',
  },
  {
    id: 'QT-004', number: 'QT-2026-004', clientId: 'CL-006', issueDate: d(-12), expiryDate: d(4), currency: 'USD', status: 'Sent',
    description: 'Woven PP bags and export cartons for Nairobi distribution.',
    items: [{ description: 'Woven PP bags 50 kg, per 1,000', quantity: 60, unitPrice: 145 }, { description: 'Export cartons, per 1,000', quantity: 20, unitPrice: 310 }],
    taxRate: 0, additionalCharge: 850, notes: 'Additional charge covers consolidation at origin.',
  },
  {
    id: 'QT-005', number: 'QT-2026-005', clientId: 'CL-004', issueDate: d(-8), expiryDate: d(22), currency: 'EUR', status: 'Sent',
    description: 'Spare-parts distribution feasibility and first consignment coordination.',
    items: [{ description: 'Market feasibility discussion and partner introductions', quantity: 1, unitPrice: 4200 }, { description: 'First consignment coordination', quantity: 1, unitPrice: 2600 }],
    taxRate: 0, additionalCharge: 0, notes: '',
  },
  {
    id: 'QT-006', number: 'QT-2026-006', clientId: 'CL-005', issueDate: d(-3), expiryDate: d(27), currency: 'DJF', status: 'Draft',
    description: 'Re-export of spices to Dubai.',
    items: [{ description: 'Mixed spices, per tonne', quantity: 12, unitPrice: 420000 }],
    taxRate: 10, additionalCharge: 0, notes: 'Tax rate to be confirmed.',
  },
  {
    id: 'QT-007', number: 'QT-2026-007', clientId: 'CL-007', issueDate: d(-48), expiryDate: d(-18), currency: 'DJF', status: 'Rejected',
    description: 'Solar lanterns and cables for retail.',
    items: [{ description: 'Solar lanterns', quantity: 800, unitPrice: 3900 }, { description: 'Electrical cable 2.5 mm, per 100 m roll', quantity: 120, unitPrice: 11000 }],
    taxRate: 0, additionalCharge: 0, notes: 'Client chose a local supplier.',
  },
  {
    id: 'QT-008', number: 'QT-2026-008', clientId: 'CL-010', issueDate: d(-35), expiryDate: d(-5), currency: 'USD', status: 'Sent',
    description: 'Sesame seed sourcing for Dakar.',
    items: [{ description: 'Hulled sesame seed, per tonne', quantity: 20, unitPrice: 1650 }],
    taxRate: 0, additionalCharge: 0, notes: '',
  },
  {
    id: 'QT-009', number: 'QT-2026-009', clientId: 'CL-008', issueDate: d(-40), expiryDate: d(-10), currency: 'DJF', status: 'Accepted',
    description: 'Djibouti port coordination for hardware consignment.',
    items: [{ description: 'Port coordination and inland delivery, per container', quantity: 2, unitPrice: 690000 }],
    taxRate: 0, additionalCharge: 120000, notes: '',
  },
  {
    id: 'QT-010', number: 'QT-2026-010', clientId: 'CL-001', issueDate: d(-6), expiryDate: d(6), currency: 'DJF', status: 'Sent',
    description: 'Red lentils import, second quarter.',
    items: [{ description: 'Red lentils (50 kg bags), per tonne', quantity: 25, unitPrice: 98000 }],
    taxRate: 0, additionalCharge: 90000, notes: '',
  },
]
