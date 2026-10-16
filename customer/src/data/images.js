// Photography originally from Unsplash (https://unsplash.com/license — free for
// commercial use, no attribution required). The files are self-hosted in
// public/images at 640, 1024 and 1600px wide, so pages never depend on a third-party
// image CDN being reachable from the visitor's network. Replace with company-owned
// photography (especially genuine Djibouti port imagery) when available.

const IMAGE_WIDTHS = [640, 1024, 1600]

const local = (key, w) => `/images/${key}-${w}.webp`

/**
 * `og` stays an absolute Unsplash URL: social networks fetch it from their own servers
 * and need a full URL, which the static build cannot know before VITE_SITE_URL is set.
 */
const img = (key, id, alt) => ({
  src: local(key, 1024),
  srcSet: IMAGE_WIDTHS.map((w) => `${local(key, w)} ${w}w`).join(', '),
  og: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=630&q=80`,
  alt,
})

export const images = {
  portAerial: img(
    'portAerial', '1606185540834-d6e7483ee1a4',
    'Aerial view of a loaded container ship guided by tugboats beside a busy port terminal',
  ),
  portCranes: img('portCranes', '1578575437130-527eed3abbec', 'Container ship berthed beneath ship-to-shore gantry cranes'),
  portYard: img(
    'portYard', '1494412574643-ff11b0a5c1c3',
    'Aerial view of a container terminal with stacked cargo containers and gantry cranes',
  ),
  containerYard: img('containerYard', '1494412651409-8963ce7935a7', 'Rows of colourful shipping containers in a large port yard'),
  containerStack: img('containerStack', '1494961104209-3c223057bd26', 'Stacked shipping containers in yellow, blue and red'),
  containersNight: img('containersNight', '1590496793929-36417d3117de', 'Overhead night view of a container terminal lit by floodlights'),
  shipAtSea: img('shipAtSea', '1605745341112-85968b19335b', 'Container vessel fully loaded with cargo sailing at sea'),
  truckHighway: img('truckHighway', '1601584115197-04ecc0da31d7', 'Cargo truck travelling along an open highway under a blue sky'),
  truckMountain: img('truckMountain', '1519003722824-194d4455a60c', 'Freight truck driving through a mountain valley road'),
  truckMono: img('truckMono', '1473445730015-841f29a9490b', 'Black-and-white photograph of a cargo truck on a road beneath dramatic clouds'),
  airCargo: img('airCargo', '1542296332-2e4473faf563', 'Cargo aircraft on an airport apron at sunset with ground handling vehicles'),
  planeSky: img('planeSky', '1570710891163-6d3b5c47248b', 'Aircraft flying among white clouds'),
  warehouseAisle: img('warehouseAisle', '1553413077-190dd305871c', 'Long warehouse aisle lined with tall shelves of packed goods'),
  warehousePallets: img('warehousePallets', '1587293852726-70cdb56c2866', 'Palletised cartons stored on warehouse racking'),
  warehouseFloor: img('warehouseFloor', '1586528116311-ad8dd3c8310d', 'Wide view of a distribution warehouse with organised storage racks'),
  warehouseTeam: img('warehouseTeam', '1589792923962-537704632910', 'Warehouse team handling cartons on a logistics floor'),
  depotAerial: img('depotAerial', '1565891741441-64926e441838', 'Aerial view of a logistics depot with loading bays and parked trailers'),
  handshake: img('handshake', '1521791136064-7986c2920216', 'Two business professionals shaking hands across a table'),
  signing: img('signing', '1450101499163-c8848c66ca85', 'Professional reviewing and signing business documents'),
  documents: img('documents', '1554224155-6726b3ff858f', 'Business paperwork, forms and a calculator on a desk'),
  meetingLaptops: img('meetingLaptops', '1454165804606-c3d57bc86b40', 'Colleagues taking notes during a working meeting with laptops'),
  meetingTable: img('meetingTable', '1517048676732-d65bc937f952', 'Business team in discussion around a meeting table'),
  earthNight: img('earthNight', '1451187580459-43490279c0fa', 'View of Earth from space at night showing illuminated cities'),
  worldMap: img('worldMap', '1526778548025-fa2f459cd5c1', 'Wooden world map mounted on a wall'),
  officeTowers: img('officeTowers', '1486406146926-c627a92ad1ab', 'Looking up at modern glass office towers'),
  briefcase: img('briefcase', '1529400971008-f566de0e6dfc', 'Business traveller walking with a leather briefcase'),
}
