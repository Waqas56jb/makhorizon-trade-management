import {
  ArrowLeftRight,
  Building2,
  FileText,
  Globe,
  Handshake,
  Lightbulb,
  Route,
  Truck,
} from 'lucide-react'
import { images } from './images'

/**
 * Services with a dedicated detail page. Copy describes what each service
 * involves without promising outcomes; scope is always confirmed per inquiry.
 */
export const detailedServices = [
  {
    slug: 'logistics-coordination',
    title: 'Logistics Coordination',
    icon: Route,
    image: images.portCranes,
    heroImage: images.portYard,
    summary:
      'Helping businesses plan how goods move from origin to destination and keeping the parties involved aligned along the way.',
    headline: 'Bringing order to the moving parts of a shipment.',
    intro: [
      'A single consignment can involve a supplier, a freight provider, a port or airport, an inland carrier and a receiving business — each working to its own timeline. Logistics coordination is about making sure those parties are working from the same information.',
      'MAKHORIZON works with clients to understand what needs to move, when, and between which locations, then helps organise communication with the relevant providers so that each stage is planned rather than improvised. The exact scope of coordination is agreed with each client at the start of a discussion.',
    ],
    focusAreas: [
      { title: 'Shipment planning', text: 'Clarifying cargo details, timing, origin, destination and handover points before goods are dispatched.' },
      { title: 'Provider communication', text: 'Helping relay requirements between the client and the logistics providers involved in a movement.' },
      { title: 'Milestone follow-up', text: 'Following up on agreed stages so the client has a clear picture of where a shipment stands.' },
      { title: 'Issue escalation', text: 'Raising questions or delays with the right party early, so they can be addressed promptly.' },
    ],
    beneficiaries: [
      'Importers managing several suppliers or shipments at once',
      'Exporters sending goods into regional markets for the first time',
      'Businesses without an in-house logistics team',
      'Companies looking for a Djibouti-based point of contact for coordination',
    ],
    workflow: [
      { title: 'Understand the movement', text: 'We discuss the goods, quantities, origin, destination and any timing constraints.' },
      { title: 'Map the parties', text: 'Together we identify the suppliers, carriers and receivers involved and their responsibilities.' },
      { title: 'Agree a coordination plan', text: 'We confirm which stages MAKHORIZON will help coordinate and how updates will be shared.' },
      { title: 'Coordinate and follow up', text: 'We maintain communication with the relevant parties through the agreed stages of the shipment.' },
    ],
    prepare: [
      'A description of the goods and their packaging',
      'Approximate weight, volume or number of units',
      'Origin and destination locations',
      'Preferred dispatch or arrival window',
      'Contacts or providers already involved, if any',
    ],
    faqs: [
      { q: 'Does MAKHORIZON operate its own vessels, aircraft or trucks?', a: 'The company focuses on coordination and business support. Where transport is needed, the arrangement and the providers involved are discussed and confirmed directly with each client.' },
      { q: 'Can you coordinate a shipment that is already in progress?', a: 'Possibly. Share the current status, the parties involved and what support you need, and the team can discuss whether and how it can help.' },
      { q: 'How are updates shared during coordination?', a: 'The communication method and frequency are agreed at the start of each engagement so they suit the client and the shipment.' },
    ],
    related: ['cargo-transportation', 'document-coordination', 'import-export'],
  },
  {
    slug: 'import-export',
    title: 'Import & Export Support',
    icon: ArrowLeftRight,
    image: images.containerStack,
    heroImage: images.containerYard,
    summary:
      'Structured support for businesses buying goods from abroad or selling into new markets, from first discussions to commercial follow-up.',
    headline: 'A clearer path for goods crossing borders.',
    intro: [
      'Importing and exporting involves more than moving cargo. Businesses need to understand the commercial terms, the parties on the other side of the transaction, the logistics involved, and the paperwork that accompanies the goods.',
      'MAKHORIZON supports clients through the practical side of cross-border trade: clarifying the requirement, helping connect with counterparts, organising the logistics conversation and following up on the commercial process. Requirements that depend on specific regulations, licences or customs procedures are discussed case by case and, where needed, handled together with the appropriate licensed providers.',
    ],
    focusAreas: [
      { title: 'Import requirements', text: 'Understanding what a business wants to bring in, from where, and under what commercial expectations.' },
      { title: 'Export opportunities', text: 'Helping producers and traders explore how their goods could reach buyers in other markets.' },
      { title: 'Trade terms discussion', text: 'Supporting clear communication on delivery terms, responsibilities and timelines between parties.' },
      { title: 'Process follow-up', text: 'Keeping the commercial process moving with structured follow-up between buyer and seller.' },
    ],
    beneficiaries: [
      'Importers sourcing goods for regional markets',
      'Exporters looking for buyers beyond their home market',
      'Traders using Djibouti as a regional gateway',
      'SMEs taking their first steps into international trade',
    ],
    workflow: [
      { title: 'Define direction and goods', text: 'Confirm whether the requirement is an import, export or both, and what is being traded.' },
      { title: 'Review the commercial picture', text: 'Discuss counterparts, expected volumes, terms and the markets involved.' },
      { title: 'Align logistics and documents', text: 'Identify what transport and documentation the transaction is likely to need.' },
      { title: 'Follow the transaction through', text: 'Support communication between the parties through the agreed stages.' },
    ],
    prepare: [
      'Whether you are importing, exporting, or both',
      'Product names, specifications or HS codes if known',
      'Countries or cities of origin and destination',
      'Target quantities and how often you expect to trade',
      'Existing suppliers or buyers you already work with',
    ],
    faqs: [
      { q: 'Do you handle customs clearance?', a: 'Customs-related requirements are discussed case by case. Where a licensed customs broker or another specialist is required, this will be made clear during the discussion.' },
      { q: 'Can you help with both imports and exports?', a: 'Yes, inquiries in either direction are welcome. The type of support that is appropriate is confirmed once the requirement is understood.' },
      { q: 'Is there a minimum shipment size?', a: 'No fixed minimum has been published. Share your expected volumes and the team can discuss whether the requirement is a good fit.' },
    ],
    related: ['trade-support', 'supplier-partnerships', 'document-coordination'],
  },
  {
    slug: 'cargo-transportation',
    title: 'Cargo Transportation Coordination',
    shortTitle: 'Cargo Transportation',
    icon: Truck,
    image: images.truckHighway,
    heroImage: images.truckMono,
    summary:
      'Coordinating the transport arrangements needed to move goods by sea, air or road with the appropriate providers.',
    headline: 'Connecting the right transport to the right cargo.',
    intro: [
      'Different goods call for different ways of moving them. Containerised cargo, break-bulk, time-sensitive consignments and inland deliveries each involve different providers, equipment and lead times.',
      'MAKHORIZON helps clients think through the transport options relevant to their cargo and coordinates with the carriers and providers involved. Transport is performed by those specialised providers; MAKHORIZON focuses on organising the requirement, the communication and the follow-up. Specific modes, routes and timings are always confirmed with the client before anything is arranged.',
    ],
    focusAreas: [
      { title: 'Sea freight conversations', text: 'Discussing containerised or other ocean cargo needs and the providers that may suit them.' },
      { title: 'Air freight options', text: 'Exploring air transport for time-sensitive or high-value consignments where appropriate.' },
      { title: 'Inland and road movements', text: 'Coordinating onward road transport between ports, warehouses and final destinations.' },
      { title: 'Handover planning', text: 'Clarifying pickup, transfer and delivery points so responsibilities are understood at each stage.' },
    ],
    beneficiaries: [
      'Businesses moving goods into or through the Horn of Africa',
      'Shippers comparing transport approaches for a new route',
      'Companies needing onward inland transport after arrival',
      'Traders with mixed or irregular cargo types',
    ],
    workflow: [
      { title: 'Profile the cargo', text: 'Understand the nature, dimensions, weight and handling needs of the goods.' },
      { title: 'Consider transport options', text: 'Discuss which modes and provider types may be appropriate for the movement.' },
      { title: 'Confirm the arrangement', text: 'Agree the transport approach, parties and responsibilities with the client.' },
      { title: 'Coordinate the movement', text: 'Communicate with providers through pickup, transit and delivery as agreed.' },
    ],
    prepare: [
      'Cargo type, packaging and any special handling needs',
      'Dimensions and gross weight, or container type and count',
      'Pickup and delivery addresses or locations',
      'Whether the cargo is time-sensitive',
      'Any preferred carriers or existing arrangements',
    ],
    faqs: [
      { q: 'Can you give me a freight price on this website?', a: 'No. Transport costs depend on cargo, route, timing and provider availability. Submit a quote request with your details and the team can discuss the requirement directly.' },
      { q: 'Which transport modes do you work with?', a: 'Sea, air and road movements can all be discussed. Whether a particular mode or route is feasible is confirmed for each inquiry.' },
      { q: 'Do you offer live shipment tracking?', a: 'Live tracking is not offered through this website. How shipment updates are shared is agreed directly with each client.' },
    ],
    related: ['logistics-coordination', 'document-coordination', 'import-export'],
  },
  {
    slug: 'trade-support',
    title: 'International Trade Support',
    icon: Globe,
    image: images.worldMap,
    heroImage: images.earthNight,
    summary:
      'Commercial groundwork for businesses exploring new markets, products or trading relationships across borders.',
    headline: 'Groundwork for doing business across borders.',
    intro: [
      'Before goods move, businesses need clarity: is there demand, who are the potential counterparts, what are the practical steps, and what questions need answering first? International trade support addresses that early, commercial stage.',
      'MAKHORIZON helps clients structure their thinking about a market or trade opportunity, organise the information they need, and prepare for conversations with potential partners. The aim is to help businesses make informed decisions — not to replace professional legal, tax or regulatory advice, which should be sought where required.',
    ],
    focusAreas: [
      { title: 'Market exploration', text: 'Discussing a target market and the practical questions to answer before entering it.' },
      { title: 'Opportunity framing', text: 'Turning a general trade idea into a defined requirement that partners can respond to.' },
      { title: 'Commercial preparation', text: 'Helping prepare information and questions ahead of supplier or buyer discussions.' },
      { title: 'Ongoing relationship support', text: 'Supporting structured communication as trading relationships develop over time.' },
    ],
    beneficiaries: [
      'Businesses assessing a new regional or international market',
      'Investors and entrepreneurs exploring trade-related ventures',
      'Producers considering their first export markets',
      'Organisations seeking a Djibouti-based commercial contact',
    ],
    workflow: [
      { title: 'Clarify the objective', text: 'Understand what the business wants to achieve and in which markets.' },
      { title: 'Identify the key questions', text: 'Outline the commercial, logistical and practical questions that need answers.' },
      { title: 'Prepare for engagement', text: 'Organise the information needed for productive conversations with counterparts.' },
      { title: 'Support next steps', text: 'Help coordinate follow-up as the opportunity is explored further.' },
    ],
    prepare: [
      'The market or region you are interested in',
      'Products or sectors involved',
      'Your timeline and current stage of planning',
      'What decision you are trying to make',
      'Any research or contacts you already have',
    ],
    faqs: [
      { q: 'Do you provide legal or regulatory advice?', a: 'No. Trade support focuses on commercial and practical groundwork. Legal, tax and regulatory questions should be addressed by qualified professionals.' },
      { q: 'Which markets can you support?', a: 'The company’s focus is on Djibouti, the wider region and international markets connected to it. Whether a specific market can be supported is discussed per inquiry.' },
      { q: 'Can you help if my idea is still at an early stage?', a: 'Yes. Early-stage discussions are welcome — share what you have and the team can talk through the next practical steps.' },
    ],
    related: ['import-export', 'supplier-partnerships', 'logistics-coordination'],
  },
  {
    slug: 'supplier-partnerships',
    title: 'Supplier & Buyer Connections',
    icon: Handshake,
    image: images.handshake,
    heroImage: images.meetingTable,
    summary:
      'Helping suppliers, manufacturers, buyers and distributors find relevant counterparts and open well-prepared conversations.',
    headline: 'Introductions built on preparation, not chance.',
    intro: [
      'Finding the right counterpart is often the hardest part of trade. Suppliers need serious buyers; buyers need suppliers who can meet their specifications; both need confidence that the other side is a good fit before investing time.',
      'MAKHORIZON helps businesses describe what they are looking for, explores potential matches, and supports introductions between parties where there appears to be a genuine fit. Introductions are not guarantees of a transaction: due diligence, negotiation and final decisions remain with the parties themselves.',
    ],
    focusAreas: [
      { title: 'Supplier discovery', text: 'Helping buyers articulate their specifications so relevant suppliers can be approached.' },
      { title: 'Buyer outreach', text: 'Helping suppliers and producers present their offer to potential buyers and distributors.' },
      { title: 'Structured introductions', text: 'Preparing both sides with the information needed for a productive first conversation.' },
      { title: 'Follow-up support', text: 'Keeping communication organised after an introduction while the parties evaluate the fit.' },
    ],
    beneficiaries: [
      'Buyers seeking reliable suppliers for specific products',
      'Manufacturers and producers looking for regional buyers',
      'Distributors searching for products to represent',
      'Traders building a network of commercial contacts',
    ],
    workflow: [
      { title: 'Describe the need', text: 'Share what you are looking to buy, sell or distribute, and your requirements.' },
      { title: 'Explore potential matches', text: 'MAKHORIZON considers counterparts that may align with your requirement.' },
      { title: 'Prepare the introduction', text: 'Both parties receive the context needed for a meaningful first conversation.' },
      { title: 'Support the dialogue', text: 'Communication is followed up while the parties assess the opportunity.' },
    ],
    prepare: [
      'Product specifications, standards or certifications required',
      'Target volumes and frequency of orders',
      'Preferred supplier or buyer regions',
      'Your company profile and trading history, if available',
      'Any deal-breakers or non-negotiable requirements',
    ],
    faqs: [
      { q: 'Do you guarantee that an introduction will lead to a deal?', a: 'No. Introductions are made where there appears to be a fit, but evaluating counterparts, negotiating and deciding remain the responsibility of each party.' },
      { q: 'Can I propose my company as a supplier?', a: 'Yes. Use the partnership form or contact page to share your company profile, products and the markets you are interested in.' },
      { q: 'Will my information be shared with other parties?', a: 'Details are only shared with potential counterparts as part of an agreed introduction. See the privacy policy for more information.' },
    ],
    related: ['trade-support', 'import-export', 'logistics-coordination'],
  },
  {
    slug: 'document-coordination',
    title: 'Shipment & Document Coordination',
    shortTitle: 'Document Coordination',
    icon: FileText,
    image: images.documents,
    heroImage: images.signing,
    summary:
      'Organising the documents that accompany traded goods so the right paperwork is prepared, shared and tracked between parties.',
    headline: 'The paperwork that keeps trade moving.',
    intro: [
      'Commercial invoices, packing lists, transport documents, certificates of origin and other papers often pass between several parties. Missing, inconsistent or late documents are a frequent source of delay.',
      'MAKHORIZON helps clients keep track of which documents a shipment is likely to require, who is responsible for preparing them, and whether they have been shared with the right parties. Document requirements vary by product, origin and destination; where official filings or licensed services are required, these are handled by the appropriate authorities or licensed professionals.',
    ],
    focusAreas: [
      { title: 'Document checklists', text: 'Identifying the documents a transaction is likely to involve and who should provide them.' },
      { title: 'Consistency checks', text: 'Helping spot mismatches between invoices, packing lists and shipment details before they cause issues.' },
      { title: 'Document flow', text: 'Coordinating how documents are shared between suppliers, buyers and logistics providers.' },
      { title: 'Record keeping', text: 'Helping clients keep shipment paperwork organised for reference and follow-up.' },
    ],
    beneficiaries: [
      'Importers receiving goods from multiple suppliers',
      'Exporters preparing paperwork for unfamiliar markets',
      'Businesses that have experienced document-related delays',
      'Teams that need a single point of coordination for paperwork',
    ],
    workflow: [
      { title: 'Review the shipment', text: 'Understand the goods, the parties and the route the documents must follow.' },
      { title: 'Build the checklist', text: 'Outline the documents likely to be needed and assign responsibilities.' },
      { title: 'Collect and compare', text: 'Help gather documents and check that key details are consistent.' },
      { title: 'Share and follow up', text: 'Coordinate document flow to the relevant parties and follow up on gaps.' },
    ],
    prepare: [
      'Draft or existing commercial invoices and packing lists',
      'Details of buyer, seller and any intermediaries',
      'Origin, destination and transport mode',
      'Product descriptions and any certification requirements',
      'Deadlines linked to dispatch or arrival',
    ],
    faqs: [
      { q: 'Can MAKHORIZON issue official certificates or permits?', a: 'No. Official documents are issued by the relevant authorities or accredited bodies. MAKHORIZON helps coordinate and organise the paperwork process.' },
      { q: 'Which documents will my shipment need?', a: 'That depends on the goods, origin, destination and transport mode. Share your shipment details and the requirement can be discussed directly.' },
      { q: 'Can you review documents I have already prepared?', a: 'You can share them as part of an inquiry, and the team can discuss what kind of coordination support would be useful.' },
    ],
    related: ['logistics-coordination', 'import-export', 'cargo-transportation'],
  },
]

/** All eight services shown on the home page and services overview. */
export const allServices = [
  ...detailedServices.slice(0, 3).map((s) => ({ ...s, to: `/services/${s.slug}` })),
  { ...detailedServices[4], to: `/services/${detailedServices[4].slug}` },
  { ...detailedServices[3], to: `/services/${detailedServices[3].slug}` },
  {
    slug: 'commercial-partnerships',
    title: 'Commercial Partnerships',
    icon: Building2,
    image: images.meetingLaptops,
    summary:
      'Exploring long-term collaboration with suppliers, distributors, logistics providers and other businesses that share a growth agenda.',
    to: '/partnerships',
    linkLabel: 'Explore partnerships',
  },
  { ...detailedServices[5], to: `/services/${detailedServices[5].slug}` },
  {
    slug: 'business-opportunity-facilitation',
    title: 'Business Opportunity Facilitation',
    icon: Lightbulb,
    image: images.officeTowers,
    summary:
      'Helping businesses assess and shape trade-related opportunities into practical next steps that can be discussed with partners.',
    to: '/trade-solutions#opportunity-assessment',
    linkLabel: 'See trade solutions',
  },
]

export const useCases = [
  {
    title: 'A regional importer adding a new product line',
    text: 'An importer wants to bring a new category of goods into the region. They need help describing specifications for suppliers, understanding likely documents, and planning the first shipment.',
    services: ['Supplier & Buyer Connections', 'Document Coordination'],
  },
  {
    title: 'A producer exploring export buyers',
    text: 'A producer has capacity to sell beyond its home market but no established buyer network. It wants to prepare a clear offer and explore conversations with potential distributors.',
    services: ['International Trade Support', 'Supplier & Buyer Connections'],
  },
  {
    title: 'A business moving goods through Djibouti',
    text: 'A company needs its cargo coordinated from arrival through to inland delivery and wants a local point of contact to keep the parties aligned.',
    services: ['Logistics Coordination', 'Cargo Transportation'],
  },
]

export const getServiceBySlug = (slug) => detailedServices.find((s) => s.slug === slug)
