import { ClipboardList, FileCheck2, Handshake, PackageSearch, Route, TrendingUp } from 'lucide-react'
import { images } from './images'

export const tradeSolutions = [
  {
    id: 'sourcing',
    icon: PackageSearch,
    title: 'Sourcing and supplier discussions',
    text: 'Clarifying product specifications, quality expectations and volumes so that conversations with potential suppliers start from a clear brief.',
    points: ['Defining the product brief', 'Identifying supplier questions', 'Supporting early supplier conversations'],
    image: images.warehouseAisle,
  },
  {
    id: 'introductions',
    icon: Handshake,
    title: 'Buyer and seller introductions',
    text: 'Exploring potential counterparts and supporting introductions where there appears to be a genuine commercial fit between the parties.',
    points: ['Preparing both parties', 'Structured first conversations', 'Organised follow-up'],
    image: images.handshake,
  },
  {
    id: 'planning',
    icon: ClipboardList,
    title: 'Import / export planning',
    text: 'Thinking through the practical sequence of a trade — from order and production timing to dispatch, transport and receipt.',
    points: ['Mapping the trade sequence', 'Identifying responsibilities', 'Flagging items to confirm'],
    image: images.meetingLaptops,
  },
  {
    id: 'freight',
    icon: Route,
    title: 'Freight and logistics coordination',
    text: 'Coordinating with the providers involved in moving goods by sea, air or road, according to the arrangement agreed with the client.',
    points: ['Transport requirement profiling', 'Provider communication', 'Milestone follow-up'],
    image: images.portYard,
  },
  {
    id: 'documents',
    icon: FileCheck2,
    title: 'Document coordination',
    text: 'Helping organise the commercial and shipping documents a transaction requires and keeping them consistent between parties.',
    points: ['Document checklists', 'Consistency checks', 'Document flow between parties'],
    image: images.documents,
  },
  {
    id: 'opportunity-assessment',
    icon: TrendingUp,
    title: 'Commercial opportunity assessment',
    text: 'Helping businesses frame a trade idea, identify the key questions and decide on practical next steps before committing resources.',
    points: ['Framing the opportunity', 'Listing open questions', 'Agreeing next steps'],
    image: images.officeTowers,
  },
]

export const tradeWorkflow = [
  { label: 'Inquiry', text: 'You share the requirement and the markets involved.' },
  { label: 'Assessment', text: 'We discuss feasibility and what needs to be confirmed.' },
  { label: 'Connection', text: 'Relevant counterparts and providers are approached.' },
  { label: 'Coordination', text: 'Logistics and documents are organised as agreed.' },
  { label: 'Follow-up', text: 'The commercial process is followed through with the parties.' },
]
