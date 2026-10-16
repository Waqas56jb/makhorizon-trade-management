import LegalDocument from '../components/sections/LegalDocument'
import { company } from '../data/company'
import Seo from '../lib/Seo'

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    body: [
      `This draft privacy policy explains how ${company.name} (“MAKHORIZON”, “we”, “us”) intends to handle personal information submitted through this website. MAKHORIZON is based at ${company.address.full}.`,
    ],
  },
  {
    id: 'information',
    title: 'Information you may submit',
    body: [
      'When you use the forms on this website, you may provide information such as:',
      [
        'Your name, company or organisation name, and job-related details',
        'Business contact details, such as email address and, optionally, phone number',
        'Your country and business location',
        'Details of your trade, logistics or partnership inquiry, including product descriptions, origins, destinations, quantities and timeframes',
        'Any other information you choose to include in a message',
      ],
      'Please avoid submitting sensitive personal information or confidential commercial information that is not needed for an initial inquiry.',
    ],
  },
  {
    id: 'purpose',
    title: 'Purpose of processing inquiries',
    body: [
      'Information submitted through the website is intended to be used to:',
      [
        'Review and respond to quotation requests, contact messages and partnership inquiries',
        'Understand your requirement and discuss relevant services',
        'Keep records of business correspondence',
        'Improve the website and the way inquiries are handled',
      ],
    ],
  },
  {
    id: 'communications',
    title: 'Contact and business communications',
    body: [
      'If you submit an inquiry, MAKHORIZON may contact you using the details you provide in order to respond to it. Marketing or update emails should only be sent where you have asked to receive them, and you should be able to unsubscribe at any time.',
    ],
  },
  {
    id: 'sharing',
    title: 'Data sharing and security',
    body: [
      'Personal information is not intended to be sold. It may be shared where necessary to respond to your inquiry — for example, with potential counterparts as part of an introduction you have agreed to, or with service providers that support the company’s operations.',
      'Reasonable technical and organisational measures should be applied to protect submitted information. No method of transmission or storage can be guaranteed to be completely secure.',
    ],
  },
  {
    id: 'retention',
    title: 'Data retention',
    body: [
      'Inquiry information should be kept only for as long as it is needed for the purposes described above, or as required for legal, accounting or record-keeping reasons. Specific retention periods are to be confirmed by the company.',
    ],
  },
  {
    id: 'third-parties',
    title: 'Third-party services',
    body: [
      'This website currently loads fonts from Google Fonts and photography from Unsplash, which means your browser connects to those services when you visit. These providers may process technical information such as your IP address according to their own privacy policies.',
      'Additional services — for example, hosting, analytics, email delivery or form processing — may be introduced when the website is connected to a backend. This policy should be updated to reflect them.',
      'At present, the website’s forms operate in demonstration mode and do not transmit submitted information to MAKHORIZON.',
    ],
  },
  {
    id: 'requests',
    title: 'Your requests and privacy inquiries',
    body: [
      'Depending on applicable law, you may have rights to request access to, correction of, or deletion of your personal information, or to object to certain processing.',
      'To make a privacy request or ask a question about this policy, please use the contact page and select “General inquiry”. Dedicated privacy contact details will be added once confirmed.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: ['This policy may be updated as the website and the company’s data practices develop. The current version will always be available on this page.'],
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <Seo title="Privacy Policy" description="Draft privacy policy for the MAKHORIZON Logistics & Trade website." />
      <LegalDocument
        title="Privacy Policy"
        intro="How information submitted through this website is intended to be handled."
        breadcrumb="Privacy Policy"
        sections={sections}
        updated="October 2026"
      />
    </>
  )
}
