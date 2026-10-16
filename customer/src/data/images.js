// Photography sourced from Unsplash (https://unsplash.com/license — free for
// commercial use, no attribution required). Each ID was checked for availability
// and subject matter during the build. Replace with company-owned photography
// (especially genuine Djibouti port imagery) when available.

const unsplash = (id) => `https://images.unsplash.com/photo-${id}`

const img = (id, alt) => ({ src: unsplash(id), alt })

export const images = {
  portAerial: img(
    '1606185540834-d6e7483ee1a4',
    'Aerial view of a loaded container ship guided by tugboats beside a busy port terminal',
  ),
  portCranes: img('1578575437130-527eed3abbec', 'Container ship berthed beneath ship-to-shore gantry cranes'),
  portYard: img(
    '1494412574643-ff11b0a5c1c3',
    'Aerial view of a container terminal with stacked cargo containers and gantry cranes',
  ),
  containerYard: img('1494412651409-8963ce7935a7', 'Rows of colourful shipping containers in a large port yard'),
  containerStack: img('1494961104209-3c223057bd26', 'Stacked shipping containers in yellow, blue and red'),
  containersNight: img('1590496793929-36417d3117de', 'Overhead night view of a container terminal lit by floodlights'),
  shipAtSea: img('1605745341112-85968b19335b', 'Container vessel fully loaded with cargo sailing at sea'),
  truckHighway: img('1601584115197-04ecc0da31d7', 'Cargo truck travelling along an open highway under a blue sky'),
  truckMountain: img('1519003722824-194d4455a60c', 'Freight truck driving through a mountain valley road'),
  truckMono: img('1473445730015-841f29a9490b', 'Black-and-white photograph of a cargo truck on a road beneath dramatic clouds'),
  airCargo: img('1542296332-2e4473faf563', 'Cargo aircraft on an airport apron at sunset with ground handling vehicles'),
  planeSky: img('1570710891163-6d3b5c47248b', 'Aircraft flying among white clouds'),
  warehouseAisle: img('1553413077-190dd305871c', 'Long warehouse aisle lined with tall shelves of packed goods'),
  warehousePallets: img('1587293852726-70cdb56c2866', 'Palletised cartons stored on warehouse racking'),
  warehouseFloor: img('1586528116311-ad8dd3c8310d', 'Wide view of a distribution warehouse with organised storage racks'),
  warehouseTeam: img('1589792923962-537704632910', 'Warehouse team handling cartons on a logistics floor'),
  depotAerial: img('1565891741441-64926e441838', 'Aerial view of a logistics depot with loading bays and parked trailers'),
  handshake: img('1521791136064-7986c2920216', 'Two business professionals shaking hands across a table'),
  signing: img('1450101499163-c8848c66ca85', 'Professional reviewing and signing business documents'),
  documents: img('1554224155-6726b3ff858f', 'Business paperwork, forms and a calculator on a desk'),
  meetingLaptops: img('1454165804606-c3d57bc86b40', 'Colleagues taking notes during a working meeting with laptops'),
  meetingTable: img('1517048676732-d65bc937f952', 'Business team in discussion around a meeting table'),
  earthNight: img('1451187580459-43490279c0fa', 'View of Earth from space at night showing illuminated cities'),
  worldMap: img('1526778548025-fa2f459cd5c1', 'Wooden world map mounted on a wall'),
  officeTowers: img('1486406146926-c627a92ad1ab', 'Looking up at modern glass office towers'),
  briefcase: img('1529400971008-f566de0e6dfc', 'Business traveller walking with a leather briefcase'),
}
