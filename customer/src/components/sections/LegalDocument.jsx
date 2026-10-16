import Notice from '../common/Notice'
import PageHero from './PageHero'
import { images } from '../../data/images'

/** Shared layout for draft legal pages with a sticky table of contents. */
export default function LegalDocument({ title, intro, breadcrumb, sections, updated }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} intro={intro} image={images.documents} breadcrumbs={[{ label: breadcrumb }]} />
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-20">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">On this page</p>
            <ol className="mt-4 space-y-2 border-l border-line">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-sm text-body transition-colors hover:border-gold hover:text-navy">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="prose-legal max-w-[var(--container-prose)]">
            <Notice title="Draft — requires review">
              This document is draft website copy. It must be reviewed by MAKHORIZON and qualified legal counsel against the company’s actual
              practices and applicable laws before it is relied upon or published as final.
            </Notice>
            {updated && <p className="mt-6 text-sm">Draft prepared: {updated}</p>}
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-32">
                <h2>
                  {i + 1}. {s.title}
                </h2>
                {s.body.map((block, j) =>
                  Array.isArray(block) ? (
                    <ul key={j}>
                      {block.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j}>{block}</p>
                  ),
                )}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  )
}
