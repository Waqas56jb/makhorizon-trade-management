// FICTIONAL SAMPLE DATA — quotations submitted by partners to MAKHORIZON.
export const quotationStatuses = ['Draft', 'Submitted', 'Under Review', 'Revision Requested', 'Accepted', 'Rejected', 'Expired']
export const currencies = ['USD', 'EUR', 'DJF']
export const paymentTermsOptions = ['30% advance, 70% before shipment', '50% advance, 50% on delivery', 'Net 30 days after delivery', 'Letter of credit at sight', 'Other (see conditions)']

const h = (at, status, by, note = '') => ({ at, status, by, note })
const MK = 'MAKHORIZON'
const ME = 'Ahmed Abdi Farah'

export const quotations = (d, t) => [
  {
    id: 'QUO-2026-001', partnerId: 'PT-001', opportunityId: 'OPP-2026-001', title: 'Corrugated cartons and pallet wrap — 6-month supply',
    description: 'Double-wall cartons in three sizes plus 23 micron stretch wrap, delivered in monthly lots.', unitPrice: 1.32, quantity: 48000, unit: 'carton', currency: 'USD', taxRate: 0, additionalCosts: 4200,
    deliveryDuration: '3 weeks per lot', deliveryTerms: 'DAP Djibouti Free Zone, monthly lots.', validUntil: d(20), paymentTerms: '30% advance, 70% before shipment', conditions: 'Price fixed for the 6-month period.',
    notes: 'Samples were sent with our previous round.', attachments: [{ name: 'carton-specification.pdf', size: 482000, type: 'application/pdf' }],
    status: 'Accepted', createdAt: t(-36, '09:10'), submittedAt: t(-35, '11:40'), updatedAt: t(-24, '15:05'), version: 1,
    history: [h(t(-35, '11:40'), 'Submitted', ME), h(t(-33, '10:00'), 'Under Review', MK), h(t(-24, '15:05'), 'Accepted', MK, 'Order ORD-2026-001 created.')],
    feedback: [{ at: t(-24, '15:05'), from: 'Procurement Team', message: 'Accepted. Order ORD-2026-001 has been created for the first lots.' }],
  },
  {
    id: 'QUO-2026-002', partnerId: 'PT-001', opportunityId: 'OPP-2026-002', title: 'Jebel Ali – Djibouti consolidation service',
    description: 'Weekly consolidation with LCL and FCL options, including document preparation.', unitPrice: 1450, quantity: 30, unit: 'TEU', currency: 'USD', taxRate: 0, additionalCosts: 2500,
    deliveryDuration: 'Weekly sailings, 6–8 days transit', deliveryTerms: 'Port to port; destination handling quoted separately.', validUntil: d(25), paymentTerms: 'Net 30 days after delivery', conditions: 'Subject to carrier space availability.',
    notes: 'We can also handle LCL at a per-CBM rate if preferred.', attachments: [{ name: 'rate-card-2026.xlsx', size: 64000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }],
    status: 'Under Review', createdAt: t(-9, '14:00'), submittedAt: t(-8, '09:20'), updatedAt: t(-5, '10:15'), version: 1,
    history: [h(t(-8, '09:20'), 'Submitted', ME), h(t(-5, '10:15'), 'Under Review', MK)],
    feedback: [],
  },
  {
    id: 'QUO-2026-003', partnerId: 'PT-001', opportunityId: 'OPP-2026-004', title: 'Red kidney beans and yellow split peas',
    description: 'Sortex-cleaned product in 50 kg PP bags, phytosanitary certificate per container.', unitPrice: 980, quantity: 240, unit: 'tonne', currency: 'USD', taxRate: 0, additionalCosts: 3600,
    deliveryDuration: '5–6 weeks from confirmation', deliveryTerms: 'CFR Djibouti port.', validUntil: d(14), paymentTerms: 'Letter of credit at sight', conditions: '',
    notes: '', attachments: [{ name: 'phytosanitary-sample.pdf', size: 210000, type: 'application/pdf' }],
    status: 'Revision Requested', createdAt: t(-15, '10:00'), submittedAt: t(-14, '16:30'), updatedAt: t(-2, '11:20'), version: 1,
    history: [h(t(-14, '16:30'), 'Submitted', ME), h(t(-10, '09:00'), 'Under Review', MK), h(t(-2, '11:20'), 'Revision Requested', MK, 'Please split pricing per product and confirm origin.')],
    feedback: [{ at: t(-2, '11:20'), from: 'Trade Coordination', message: 'Please provide separate prices for kidney beans and split peas, confirm the origin country for each, and resubmit. The phytosanitary sample also needs the current season’s date.' }],
  },
  {
    id: 'QUO-2026-004', partnerId: 'PT-001', opportunityId: 'OPP-2026-003', title: 'Bagged cement — partial quantity',
    description: 'Portland cement 42.5N in 50 kg bags, 900 t in three staged deliveries.', unitPrice: 112, quantity: 900, unit: 'tonne', currency: 'USD', taxRate: 0, additionalCosts: 0,
    deliveryDuration: '3 staged deliveries over 8 weeks', deliveryTerms: 'CFR Djibouti port.', validUntil: d(30), paymentTerms: '50% advance, 50% on delivery', conditions: 'Partial quantity (cement only).',
    notes: 'Rebar is not included in this quotation.', attachments: [],
    status: 'Submitted', createdAt: t(-2, '08:45'), submittedAt: t(-1, '17:10'), updatedAt: t(-1, '17:10'), version: 1,
    history: [h(t(-1, '17:10'), 'Submitted', ME)],
    feedback: [],
  },
  {
    id: 'QUO-2026-005', partnerId: 'PT-001', opportunityId: 'OPP-2026-005', title: 'Forklifts and pallet jacks',
    description: 'Four 3 t diesel forklifts and twelve manual pallet jacks with 12-month warranty.', unitPrice: 26500, quantity: 4, unit: 'forklift', currency: 'USD', taxRate: 0, additionalCosts: 3800,
    deliveryDuration: '8 weeks', deliveryTerms: '', validUntil: d(40), paymentTerms: '', conditions: '',
    notes: '', attachments: [],
    status: 'Draft', createdAt: t(-3, '15:30'), submittedAt: '', updatedAt: t(-3, '15:30'), version: 1,
    history: [h(t(-3, '15:30'), 'Draft', ME, 'Draft saved')],
    feedback: [],
  },
  {
    id: 'QUO-2026-006', partnerId: 'PT-001', opportunityId: 'OPP-2026-007', title: 'Insulated cartons and liners',
    description: 'Insulated cartons with food-grade liners.', unitPrice: 2.65, quantity: 12000, unit: 'set', currency: 'EUR', taxRate: 0, additionalCosts: 1200,
    deliveryDuration: '4 weeks', deliveryTerms: 'CFR Djibouti port.', validUntil: d(-20), paymentTerms: 'Net 30 days after delivery', conditions: '',
    notes: '', attachments: [],
    status: 'Rejected', createdAt: t(-46, '10:00'), submittedAt: t(-45, '12:00'), updatedAt: t(-31, '09:30'), version: 1,
    history: [h(t(-45, '12:00'), 'Submitted', ME), h(t(-40, '10:00'), 'Under Review', MK), h(t(-31, '09:30'), 'Rejected', MK)],
    feedback: [{ at: t(-31, '09:30'), from: 'Procurement Team', message: 'Thank you for your offer. Another offer was selected on lead time. We look forward to future opportunities.' }],
  },
  {
    id: 'QUO-2026-007', partnerId: 'PT-001', opportunityId: 'OPP-2026-008', title: 'Office laptops and monitors',
    description: '35 business laptops and monitors.', unitPrice: 1180, quantity: 35, unit: 'workstation', currency: 'USD', taxRate: 0, additionalCosts: 900,
    deliveryDuration: '5 weeks', deliveryTerms: 'DAP Djibouti City.', validUntil: d(-60), paymentTerms: '50% advance, 50% on delivery', conditions: '',
    notes: '', attachments: [],
    status: 'Expired', createdAt: t(-95, '10:00'), submittedAt: t(-94, '10:30'), updatedAt: t(-60, '00:00'), version: 1,
    history: [h(t(-94, '10:30'), 'Submitted', ME), h(t(-60, '00:00'), 'Expired', 'System', 'Validity date passed without a decision.')],
    feedback: [],
  },
  {
    id: 'QUO-2026-008', partnerId: 'PT-001', opportunityId: 'OPP-2026-006', title: 'Corridor distribution — pilot phase',
    description: 'Pilot distribution service for 3 months along the Djibouti corridor.', unitPrice: 4200000, quantity: 3, unit: 'month', currency: 'DJF', taxRate: 10, additionalCosts: 350000,
    deliveryDuration: 'Service starts within 2 weeks of confirmation', deliveryTerms: 'Monthly service fee, delivery reports weekly.', validUntil: d(35), paymentTerms: 'Net 30 days after delivery', conditions: 'Fuel surcharge reviewed monthly.',
    notes: '', attachments: [{ name: 'network-overview.pdf', size: 1240000, type: 'application/pdf' }],
    status: 'Accepted', createdAt: t(-22, '09:00'), submittedAt: t(-21, '10:00'), updatedAt: t(-3, '14:00'), version: 2,
    history: [h(t(-21, '10:00'), 'Submitted', ME), h(t(-15, '09:00'), 'Revision Requested', MK, 'Please add the tax line.'), h(t(-12, '11:30'), 'Submitted', ME, 'Version 2 submitted'), h(t(-3, '14:00'), 'Accepted', MK, 'Order ORD-2026-002 issued for confirmation.')],
    feedback: [{ at: t(-3, '14:00'), from: 'Trade Coordination', message: 'Accepted. Please review and confirm order ORD-2026-002.' }],
  },
  {
    id: 'QUO-2026-009', partnerId: 'PT-001', opportunityId: 'OPP-2026-009', title: 'Packaging — first supply round',
    description: 'Corrugated cartons for the first warehouse supply round.', unitPrice: 1.28, quantity: 16000, unit: 'carton', currency: 'USD', taxRate: 0, additionalCosts: 1500,
    deliveryDuration: '4 weeks', deliveryTerms: 'DAP Djibouti Free Zone.', validUntil: d(-100), paymentTerms: '30% advance, 70% before shipment', conditions: '',
    notes: '', attachments: [],
    status: 'Accepted', createdAt: t(-140, '10:00'), submittedAt: t(-139, '10:00'), updatedAt: t(-128, '10:00'), version: 1,
    history: [h(t(-139, '10:00'), 'Submitted', ME), h(t(-128, '10:00'), 'Accepted', MK)],
    feedback: [],
  },
  {
    id: 'QUO-2026-010', partnerId: 'PT-001', opportunityId: 'OPP-2026-010', title: 'Refined sugar, 50 kg bags',
    description: 'ICUMSA 45 refined sugar, 120 t lot.', unitPrice: 612, quantity: 120, unit: 'tonne', currency: 'USD', taxRate: 0, additionalCosts: 2400,
    deliveryDuration: '6 weeks', deliveryTerms: 'CFR Djibouti port.', validUntil: d(-90), paymentTerms: 'Letter of credit at sight', conditions: '',
    notes: '', attachments: [],
    status: 'Accepted', createdAt: t(-120, '10:00'), submittedAt: t(-119, '10:00'), updatedAt: t(-108, '10:00'), version: 1,
    history: [h(t(-119, '10:00'), 'Submitted', ME), h(t(-108, '10:00'), 'Accepted', MK)],
    feedback: [],
  },
  // Another partner's quotation — never visible to East Africa Trade Partners.
  {
    id: 'QUO-2026-011', partnerId: 'PT-002', opportunityId: 'OPP-2026-003', title: 'Rebar supply', description: '', unitPrice: 690, quantity: 420, unit: 'tonne', currency: 'USD', taxRate: 0, additionalCosts: 0,
    deliveryDuration: '', deliveryTerms: '', validUntil: d(30), paymentTerms: '', conditions: '', notes: '', attachments: [],
    status: 'Submitted', createdAt: t(-4, '10:00'), submittedAt: t(-4, '10:00'), updatedAt: t(-4, '10:00'), version: 1, history: [h(t(-4, '10:00'), 'Submitted', 'Samira Daher')], feedback: [],
  },
]
