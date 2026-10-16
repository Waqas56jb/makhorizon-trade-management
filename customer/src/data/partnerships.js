import { Boxes, Factory, Landmark, Ship, Store, Truck, Users, Waypoints } from 'lucide-react'
import { images } from './images'

// Audiences MAKHORIZON welcomes discussions with. No existing partnerships are implied.
export const partnerAudiences = [
  { label: 'Suppliers', icon: Factory },
  { label: 'Importers', icon: Boxes },
  { label: 'Exporters', icon: Ship },
  { label: 'Buyers', icon: Users },
  { label: 'Distributors', icon: Store },
  { label: 'Logistics providers', icon: Truck },
  { label: 'Commercial partners', icon: Waypoints },
  { label: 'Potential investors', icon: Landmark },
]

export const partnershipTypes = [
  {
    id: 'suppliers',
    title: 'Supplier Partnerships',
    icon: Factory,
    image: images.warehousePallets,
    text: 'Manufacturers, producers and wholesalers can introduce their products and capacity. MAKHORIZON is interested in understanding what you supply, your standards, and the markets you would like to reach.',
    points: ['Product range and specifications', 'Production or supply capacity', 'Target markets and buyers'],
  },
  {
    id: 'buyers',
    title: 'Buyer & Importer Inquiries',
    icon: Boxes,
    image: images.containerYard,
    text: 'Businesses looking to source goods for regional or international markets can share their requirements and discuss how MAKHORIZON may help explore suitable supply options.',
    points: ['Products and volumes sought', 'Quality and compliance requirements', 'Delivery locations and timing'],
  },
  {
    id: 'distributors',
    title: 'Distributor Opportunities',
    icon: Store,
    image: images.warehouseTeam,
    text: 'Distributors with networks in their markets can start a conversation about representing products or collaborating on regional distribution, subject to mutual fit.',
    points: ['Territories and channels covered', 'Product categories of interest', 'Existing distribution capabilities'],
  },
  {
    id: 'logistics',
    title: 'Logistics Collaboration',
    icon: Truck,
    image: images.depotAerial,
    text: 'Freight forwarders, carriers, warehouse operators and other logistics providers are welcome to discuss how their services could complement MAKHORIZON’s coordination work.',
    points: ['Services and modes offered', 'Geographic coverage', 'Approach to collaboration'],
  },
  {
    id: 'investors',
    title: 'Investor & Strategic Inquiries',
    icon: Landmark,
    image: images.officeTowers,
    text: 'Investors and strategic partners interested in trade and logistics in the region are invited to start an exploratory conversation. No investment offering is made through this website; any discussion would take place directly and privately.',
    points: ['Your organisation and interests', 'Sectors or themes of focus', 'Preferred way to continue the discussion'],
  },
]

export const partnershipProcess = [
  { title: 'Introduce your organisation', text: 'Share who you are, what you do and the kind of collaboration you have in mind.' },
  { title: 'Initial review', text: 'The MAKHORIZON team reviews the inquiry to understand whether there may be a fit.' },
  { title: 'Exploratory conversation', text: 'Where appropriate, both sides discuss objectives, capabilities and expectations.' },
  { title: 'Define next steps', text: 'If there is mutual interest, the parties agree how to take the discussion forward.' },
]

export const partnershipCategories = [
  'Supplier partnership',
  'Buyer / importer inquiry',
  'Distributor opportunity',
  'Logistics collaboration',
  'Investor / strategic inquiry',
  'Other commercial partnership',
]
