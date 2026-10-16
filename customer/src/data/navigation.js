export const mainNav = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  {
    label: 'Services',
    to: '/services',
    children: [
      { label: 'Logistics Coordination', to: '/services/logistics-coordination', description: 'Planning and aligning the parties behind a shipment' },
      { label: 'Import & Export Support', to: '/services/import-export', description: 'Structured support for cross-border trade' },
      { label: 'Cargo Transportation', to: '/services/cargo-transportation', description: 'Coordinating the movement of goods' },
      { label: 'International Trade Support', to: '/services/trade-support', description: 'Commercial groundwork for new markets' },
      { label: 'Supplier & Buyer Connections', to: '/services/supplier-partnerships', description: 'Introductions between trading parties' },
      { label: 'Document Coordination', to: '/services/document-coordination', description: 'Organising shipment and trade paperwork' },
    ],
  },
  { label: 'Trade Solutions', to: '/trade-solutions' },
  { label: 'Partnerships', to: '/partnerships' },
  { label: 'Contact', to: '/contact' },
]

export const footerNav = {
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Trade Solutions', to: '/trade-solutions' },
    { label: 'Partnerships', to: '/partnerships' },
    { label: 'Request a Quote', to: '/request-quote' },
    { label: 'Contact', to: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Use', to: '/terms' },
  ],
}
