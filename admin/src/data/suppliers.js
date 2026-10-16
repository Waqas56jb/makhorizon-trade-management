// FICTIONAL SAMPLE DATA
export const supplierCategories = [
  'Construction Materials',
  'Food Commodities',
  'Agricultural Produce',
  'Packaging',
  'Electrical Equipment',
  'Freight Forwarding',
  'Transport Services',
  'Port & Handling Services',
  'Other',
]

export const suppliers = (d) => [
  { id: 'SP-001', contactName: 'Mehmet Yilmaz', company: 'Anatolia Steel & Cement A.S.', email: 'export@anatolia-sc.example', phone: '+90 212 555 0140', country: 'Turkey', address: 'Istanbul', category: 'Construction Materials', status: 'Active', notes: 'Cement and rebar. 30% advance, balance before loading.', createdAt: d(-200) },
  { id: 'SP-002', contactName: 'Priya Nair', company: 'Malabar Spice & Grain Exporters', email: 'priya@malabar-grain.example', phone: '+91 484 555 2231', country: 'India', address: 'Kochi, Kerala', category: 'Food Commodities', status: 'Active', notes: 'Rice, lentils and spices.', createdAt: d(-185) },
  { id: 'SP-003', contactName: 'Zhang Li', company: 'Ningbo Packaging Industries', email: 'sales@ningbo-pack.example', phone: '+86 574 5551 2045', country: 'China', address: 'Ningbo', category: 'Packaging', status: 'Active', notes: 'Woven polypropylene bags and cartons.', createdAt: d(-160) },
  { id: 'SP-004', contactName: 'Ahmed Yusuf', company: 'Djibouti Inland Haulage SARL', email: 'ops@dj-haulage.example', phone: '+253 77 60 11 25', country: 'Djibouti', address: 'PK12, Djibouti', category: 'Transport Services', status: 'Active', notes: 'Road haulage Djibouti–Addis corridor.', createdAt: d(-175) },
  { id: 'SP-005', contactName: 'Elena Rossi', company: 'Mediterranea Freight Forwarding Srl', email: 'elena.rossi@mediterranea-ff.example', phone: '+39 010 555 7781', country: 'Italy', address: 'Genoa', category: 'Freight Forwarding', status: 'Active', notes: '', createdAt: d(-140) },
  { id: 'SP-006', contactName: 'Khalid Rahman', company: 'Jebel Trading Electricals FZE', email: 'khalid@jebel-electricals.example', phone: '+971 4 555 8810', country: 'United Arab Emirates', address: 'Jebel Ali Free Zone', category: 'Electrical Equipment', status: 'Active', notes: 'Cables, solar lanterns, small generators.', createdAt: d(-110) },
  { id: 'SP-007', contactName: 'Tigist Alemu', company: 'Addis Coffee Growers Union', email: 'tigist@addis-coffee.example', phone: '+251 11 555 6620', country: 'Ethiopia', address: 'Addis Ababa', category: 'Agricultural Produce', status: 'Active', notes: 'Washed Arabica, grade 2.', createdAt: d(-130) },
  { id: 'SP-008', contactName: 'Omar Farah', company: 'Harbour Handling Services', email: 'omar@harbour-handling.example', phone: '', country: 'Djibouti', address: '', category: 'Port & Handling Services', status: 'Inactive', notes: 'Used for two consignments earlier this year.', createdAt: d(-220) },
]
