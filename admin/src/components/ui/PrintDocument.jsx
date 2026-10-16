import logoMark from '../../assets/brand/logo-mark.webp'
import { formatMoney } from '../../hooks/useFormat'
import { documentTotals, lineTotal } from '../../lib/calc'

/** Printable quotation / invoice layout with company branding. */
export default function PrintDocument({ kind, number, company, client, meta, doc, status, notes, footnote }) {
  const t = documentTotals(doc)
  return (
    <article className="print-area card mx-auto w-full max-w-4xl p-6 sm:p-10">
      <header className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-midnight p-2">
            <img src={logoMark} alt="" width="240" height="186" className="h-auto w-full" />
          </span>
          <div>
            <p className="text-lg font-bold tracking-wide text-navy">{company.name}</p>
            <p className="text-xs text-muted">{company.address}</p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">{kind}</p>
          <p className="num text-xl font-semibold">{number}</p>
          <p className="mt-1 text-xs text-muted">Status: {status}</p>
        </div>
      </header>

      <section className="grid gap-6 py-6 sm:grid-cols-2">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted">Prepared for</p>
          {client ? (
            <div className="mt-1 text-sm">
              <p className="font-semibold">{client.company}</p>
              <p>{client.name}</p>
              <p className="text-muted">{[client.address, client.country].filter(Boolean).join(', ')}</p>
              <p className="text-muted">{client.email}</p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted">Client record not found</p>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:justify-self-end">
          {meta.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd className="num font-medium sm:text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {doc.description && <p className="mb-4 text-sm">{doc.description}</p>}

      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col" className="text-right">Qty</th>
              <th scope="col" className="text-right">Unit price</th>
              <th scope="col" className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((i, idx) => (
              <tr key={idx}>
                <td>{i.description}</td>
                <td className="num text-right">{Number(i.quantity).toLocaleString('en-US')}</td>
                <td className="num text-right whitespace-nowrap">{formatMoney(i.unitPrice, doc.currency)}</td>
                <td className="num text-right whitespace-nowrap">{formatMoney(lineTotal(i), doc.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="num ml-auto mt-4 w-full max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatMoney(t.subtotal, doc.currency)}</dd>
        </div>
        {t.tax > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted">Tax ({doc.taxRate}%)</dt>
            <dd>{formatMoney(t.tax, doc.currency)}</dd>
          </div>
        )}
        {t.charge > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted">Additional charge</dt>
            <dd>{formatMoney(t.charge, doc.currency)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatMoney(t.total, doc.currency)}</dd>
        </div>
      </dl>

      {notes && (
        <section className="mt-8 border-t border-line pt-4 text-sm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted">Notes</p>
          <p className="mt-1 whitespace-pre-line">{notes}</p>
        </section>
      )}
      <p className="mt-8 text-[0.7rem] text-muted">{footnote}</p>
    </article>
  )
}
