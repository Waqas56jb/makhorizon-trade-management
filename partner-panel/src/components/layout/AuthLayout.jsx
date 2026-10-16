import { ShieldCheck } from 'lucide-react'
import logoSrc from '../../assets/brand/logo.webp'

/** Shared two-panel layout for the sign-in and password pages. */
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="on-dark relative hidden overflow-hidden bg-midnight p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <svg className="absolute -bottom-40 -right-40 h-[36rem] w-[36rem] text-gold/10" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          {[96, 76, 56, 36].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} stroke="currentColor" />
          ))}
        </svg>
        <img src={logoSrc} alt="MAKHORIZON Global Logistics & Trade" width="640" height="173" className="relative h-14 w-auto self-start" />
        <div className="relative max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Partner portal</p>
          <p className="mt-4 text-3xl font-semibold leading-tight">Your partnership with MAKHORIZON, in one place.</p>
          <p className="mt-4 text-sm leading-relaxed text-white/65">Review trade opportunities, submit quotations, follow orders and shipments, and exchange documents with our coordination team.</p>
          <ul className="mt-8 space-y-2 text-sm text-white/75">
            {['Trade opportunities and quotations', 'Orders, shipments and documents', 'Direct messages with our teams'].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative flex items-center gap-2 text-xs text-white/45">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          MAKHORIZON Logistics &amp; Trade · Salam Tower, 5th Floor, Djibouti
        </p>
      </div>
      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center rounded-xl bg-midnight p-4 lg:hidden">
            <img src={logoSrc} alt="MAKHORIZON Global Logistics & Trade" width="640" height="173" className="h-11 w-auto" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
