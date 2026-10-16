// FICTIONAL SAMPLE DATA. `quantity` is the target current stock; seed.js adds an
// opening-balance movement so that movement history always sums to the quantity.
export const inventoryCategories = ['Packaging', 'Food Commodities', 'Agricultural Produce', 'Construction Materials', 'Electrical Equipment', 'Hardware', 'Warehouse Supplies']
export const inventoryUnits = ['pcs', 'bags', 'cartons', 'rolls', 'bundles', 'units', 'tonnes', 'pallets']
export const movementTypes = ['Received', 'Issued', 'Adjustment']

export const inventory = (d) => [
  { id: 'IT-001', name: 'Woven PP bags 50 kg', sku: 'PKG-PP50', category: 'Packaging', description: 'White woven polypropylene, laminated.', quantity: 18000, unit: 'pcs', minStock: 5000, cost: 52, price: 75, supplierId: 'SP-003', location: 'Warehouse A · Bay 1', createdAt: d(-180) },
  { id: 'IT-002', name: 'Export cartons 60×40×40 cm', sku: 'PKG-CTN64', category: 'Packaging', description: '5-ply corrugated.', quantity: 3200, unit: 'pcs', minStock: 4000, cost: 95, price: 140, supplierId: 'SP-003', location: 'Warehouse A · Bay 1', createdAt: d(-180) },
  { id: 'IT-003', name: 'Stretch film 23 µm', sku: 'PKG-STR23', category: 'Packaging', description: '', quantity: 140, unit: 'rolls', minStock: 50, cost: 2100, price: null, supplierId: 'SP-003', location: 'Warehouse A · Bay 2', createdAt: d(-170) },
  { id: 'IT-004', name: 'Long-grain rice 25 kg', sku: 'FD-RICE25', category: 'Food Commodities', description: '5% broken, Indian origin.', quantity: 320, unit: 'bags', minStock: 200, cost: 1950, price: 2600, supplierId: 'SP-002', location: 'Warehouse B · Dry store', createdAt: d(-130) },
  { id: 'IT-005', name: 'Red lentils 50 kg', sku: 'FD-LENT50', category: 'Food Commodities', description: '', quantity: 40, unit: 'bags', minStock: 60, cost: 4900, price: 6300, supplierId: 'SP-002', location: 'Warehouse B · Dry store', createdAt: d(-125) },
  { id: 'IT-006', name: 'Mixed spices 10 kg carton', sku: 'FD-SPC10', category: 'Food Commodities', description: '', quantity: 0, unit: 'cartons', minStock: 20, cost: 4200, price: 5600, supplierId: 'SP-002', location: 'Warehouse B · Dry store', createdAt: d(-125) },
  { id: 'IT-007', name: 'Portland cement CEM II 50 kg', sku: 'CON-CEM50', category: 'Construction Materials', description: 'Remaining stock from ORD-2026-001.', quantity: 900, unit: 'bags', minStock: 300, cost: 820, price: 1050, supplierId: 'SP-001', location: 'Yard · Covered area', createdAt: d(-70) },
  { id: 'IT-008', name: 'Steel rebar B500 12 mm', sku: 'CON-RB12', category: 'Construction Materials', description: '12 m lengths, 2-tonne bundles.', quantity: 25, unit: 'bundles', minStock: 10, cost: 152000, price: 178000, supplierId: 'SP-001', location: 'Yard · Open area', createdAt: d(-160) },
  { id: 'IT-009', name: 'Solar lantern', sku: 'ELC-SOL01', category: 'Electrical Equipment', description: 'USB charging output.', quantity: 260, unit: 'pcs', minStock: 100, cost: 3100, price: 3900, supplierId: 'SP-006', location: 'Warehouse A · Bay 3', createdAt: d(-110) },
  { id: 'IT-010', name: 'Electrical cable 2.5 mm, 100 m', sku: 'ELC-CBL25', category: 'Electrical Equipment', description: '', quantity: 18, unit: 'rolls', minStock: 25, cost: 8800, price: 11000, supplierId: 'SP-006', location: 'Warehouse A · Bay 3', createdAt: d(-110) },
  { id: 'IT-011', name: 'Portable generator 3 kVA', sku: 'ELC-GEN3K', category: 'Electrical Equipment', description: 'Petrol, single phase.', quantity: 6, unit: 'units', minStock: 4, cost: 58000, price: 72000, supplierId: 'SP-006', location: 'Warehouse A · Bay 3', createdAt: d(-100) },
  { id: 'IT-012', name: 'Jute bags 60 kg', sku: 'PKG-JUTE60', category: 'Packaging', description: 'For coffee exports.', quantity: 1200, unit: 'pcs', minStock: 500, cost: 210, price: 290, supplierId: 'SP-007', location: 'Warehouse A · Bay 2', createdAt: d(-120) },
  { id: 'IT-013', name: 'Wooden pallets (EUR)', sku: 'WH-PAL01', category: 'Warehouse Supplies', description: '', quantity: 85, unit: 'pcs', minStock: 40, cost: 2400, price: null, supplierId: '', location: 'Yard · Covered area', createdAt: d(-180) },
  { id: 'IT-014', name: 'Hulled sesame seed 25 kg', sku: 'AGR-SES25', category: 'Agricultural Produce', description: '', quantity: 75, unit: 'bags', minStock: 40, cost: 7100, price: 8900, supplierId: 'SP-007', location: 'Warehouse B · Dry store', createdAt: d(-90) },
  { id: 'IT-015', name: 'Tarpaulin 6×8 m', sku: 'WH-TARP68', category: 'Warehouse Supplies', description: '', quantity: 34, unit: 'pcs', minStock: 20, cost: 3600, price: null, supplierId: '', location: 'Yard · Covered area', createdAt: d(-150) },
  { id: 'IT-016', name: 'Assorted fasteners carton', sku: 'HW-FST01', category: 'Hardware', description: 'Bolts, nuts and washers.', quantity: 0, unit: 'cartons', minStock: 10, cost: 9500, price: 12500, supplierId: '', location: 'Warehouse A · Bay 4', createdAt: d(-45) },
]

// Movements after the opening balance. Adjustment quantities are signed.
export const movements = (d) => [
  { itemId: 'IT-001', date: d(-60), type: 'Received', quantity: 10000, reason: 'Purchase from Ningbo Packaging', reference: 'PO-0412' },
  { itemId: 'IT-001', date: d(-30), type: 'Issued', quantity: 6000, reason: 'Supplied to client order', reference: 'ORD-2026-003' },
  { itemId: 'IT-002', date: d(-40), type: 'Issued', quantity: 2500, reason: 'Supplied to client', reference: 'ORD-2026-012' },
  { itemId: 'IT-002', date: d(-12), type: 'Issued', quantity: 800, reason: 'Supplied to client', reference: 'ORD-2026-012' },
  { itemId: 'IT-004', date: d(-25), type: 'Received', quantity: 400, reason: 'Partial arrival', reference: 'ORD-2026-003' },
  { itemId: 'IT-004', date: d(-10), type: 'Issued', quantity: 280, reason: 'Delivered to Horn Trade Supplies', reference: 'ORD-2026-003' },
  { itemId: 'IT-005', date: d(-20), type: 'Issued', quantity: 60, reason: 'Sold to local retailer', reference: '' },
  { itemId: 'IT-006', date: d(-35), type: 'Issued', quantity: 18, reason: 'Re-export to Dubai', reference: 'ORD-2026-005' },
  { itemId: 'IT-006', date: d(-14), type: 'Adjustment', quantity: -2, reason: 'Damaged cartons written off', reference: '' },
  { itemId: 'IT-007', date: d(-62), type: 'Received', quantity: 1500, reason: 'Surplus from cement order', reference: 'ORD-2026-001' },
  { itemId: 'IT-007', date: d(-18), type: 'Issued', quantity: 600, reason: 'Sold to Tadjoura Building Materials', reference: '' },
  { itemId: 'IT-009', date: d(-45), type: 'Issued', quantity: 140, reason: 'Retail sale', reference: '' },
  { itemId: 'IT-010', date: d(-22), type: 'Issued', quantity: 30, reason: 'Supplied to client', reference: 'ORD-2026-006' },
  { itemId: 'IT-011', date: d(-28), type: 'Issued', quantity: 4, reason: 'Supplied to client', reference: 'ORD-2026-006' },
  { itemId: 'IT-012', date: d(-50), type: 'Issued', quantity: 800, reason: 'Coffee bagging', reference: 'ORD-2026-002' },
  { itemId: 'IT-013', date: d(-8), type: 'Adjustment', quantity: 5, reason: 'Stock count correction', reference: 'COUNT-Q3' },
  { itemId: 'IT-014', date: d(-15), type: 'Received', quantity: 60, reason: 'Purchase from Addis Coffee Growers Union', reference: 'PO-0431' },
  { itemId: 'IT-016', date: d(-6), type: 'Issued', quantity: 12, reason: 'Supplied to client', reference: 'ORD-2026-004' },
]
