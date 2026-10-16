import LegalDocument from '../components/sections/LegalDocument'
import { company } from '../data/company'
import Seo from '../lib/Seo'

const sections = [
  {
    id: 'usage',
    title: 'Website usage',
    body: [
      `These draft terms govern your use of the website operated by ${company.name} (“MAKHORIZON”). By using the website, you agree to use it lawfully and in a way that does not interfere with its operation or with other users.`,
      'You must not attempt to gain unauthorised access to the website, introduce malicious code, or submit false or misleading information through its forms.',
    ],
  },
  {
    id: 'accuracy',
    title: 'Accuracy of information',
    body: [
      'Content on this website is provided for general information about MAKHORIZON and its areas of activity. While care is taken to keep it accurate, it may be incomplete or change over time, and some content is draft copy pending company approval.',
      'Nothing on this website constitutes legal, customs, tax, financial or regulatory advice.',
    ],
  },
  {
    id: 'inquiries',
    title: 'Service inquiries',
    body: [
      'Submitting a quote request, contact message or partnership inquiry does not create a contract or any obligation on either party. The availability, scope, feasibility and cost of any service are confirmed only through direct discussion and, where applicable, written agreement.',
    ],
  },
  {
    id: 'commercial',
    title: 'Commercial discussions',
    body: [
      'Where MAKHORIZON facilitates introductions between businesses, each party remains responsible for its own due diligence, negotiations and decisions. Introductions are not guarantees of a transaction or of any counterpart’s performance.',
    ],
  },
  {
    id: 'third-party-links',
    title: 'Third-party links',
    body: [
      'The website may include links to or content from third-party websites. MAKHORIZON is not responsible for the content, availability or practices of those websites.',
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual property',
    body: [
      'The website’s text, design and brand elements belong to MAKHORIZON or its licensors. Photography is used under the licence terms of its providers. You may not reproduce website content for commercial purposes without permission.',
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of responsibility',
    body: [
      'To the extent permitted by applicable law, MAKHORIZON is not liable for losses arising from reliance on general website content or from temporary unavailability of the website. Nothing in these terms limits liability that cannot be limited under applicable law.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact information',
    body: [`Questions about these terms can be sent through the contact page. MAKHORIZON is based at ${company.address.full}.`],
  },
]

export default function Terms() {
  return (
    <>
      <Seo title="Terms of Use" description="Draft terms of use for the MAKHORIZON Logistics & Trade website." />
      <LegalDocument
        title="Terms of Use"
        intro="The conditions for using this website and submitting inquiries."
        breadcrumb="Terms of Use"
        sections={sections}
        updated="October 2026"
      />
    </>
  )
}
