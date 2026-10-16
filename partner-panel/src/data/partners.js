// FICTIONAL SAMPLE DATA — partner companies and their portal users.
// Websites and emails use the reserved ".example" domain so no real business is referenced.

export const businessCategories = ['Import & Export', 'Freight Forwarding', 'Packaging Supply', 'Construction Materials', 'Agricultural Products', 'Industrial Equipment', 'Distribution', 'Other']
export const communicationMethods = ['Email', 'Phone', 'Portal messages']
export const teamRoles = ['Company Owner', 'Manager', 'Staff Member', 'Viewer']

export const partners = () => [
  {
    id: 'PT-001',
    companyName: 'East Africa Trade Partners Ltd.',
    registrationNumber: 'KE-PVT-2019-48213',
    country: 'Kenya',
    city: 'Nairobi',
    address: 'Mombasa Road Business Park, Block C, Nairobi',
    contactName: 'Ahmed Abdi Farah',
    email: 'info@eatp.example',
    phone: '+254 20 765 4321',
    website: 'www.eatp.example',
    category: 'Import & Export',
    description: 'Regional supplier of packaging, agricultural and general trade goods serving buyers across East Africa and the Horn of Africa.',
    preferredContact: 'Portal messages',
    partnerSince: '2024-03-01',
    tier: 'Approved partner',
    logoName: '',
  },
  // A second partner, used to demonstrate that records of other partners stay hidden.
  {
    id: 'PT-002',
    companyName: 'Red Sea Supply Co.',
    registrationNumber: 'DJ-RCS-2021-0912',
    country: 'Djibouti',
    city: 'Djibouti',
    address: 'Rue de Venise, Djibouti',
    contactName: 'Samira Daher',
    email: 'contact@redseasupply.example',
    phone: '+253 21 00 00 00',
    website: '',
    category: 'Construction Materials',
    description: '',
    preferredContact: 'Email',
    partnerSince: '2025-01-15',
    tier: 'Approved partner',
    logoName: '',
  },
]

export const users = (d) => [
  { id: 'TM-001', partnerId: 'PT-001', name: 'Ahmed Abdi Farah', email: 'partner@makhorizon.demo', role: 'Company Owner', status: 'Active', lastActive: d(0), invitedAt: '' },
  { id: 'TM-002', partnerId: 'PT-001', name: 'Grace Wanjiru', email: 'grace.wanjiru@eatp.example', role: 'Manager', status: 'Active', lastActive: d(-1), invitedAt: '' },
  { id: 'TM-003', partnerId: 'PT-001', name: 'Yusuf Omar', email: 'yusuf.omar@eatp.example', role: 'Staff Member', status: 'Active', lastActive: d(-6), invitedAt: '' },
  { id: 'TM-004', partnerId: 'PT-001', name: 'Linda Achieng', email: 'linda.achieng@eatp.example', role: 'Viewer', status: 'Invitation Pending', lastActive: '', invitedAt: d(-3) },
  { id: 'TM-005', partnerId: 'PT-002', name: 'Samira Daher', email: 'samira@redseasupply.example', role: 'Company Owner', status: 'Active', lastActive: d(-2), invitedAt: '' },
]
