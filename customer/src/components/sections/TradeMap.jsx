import { motion } from 'motion/react'
import { LAT_MAX, MAP_HEIGHT, MAP_SCALE, MAP_WIDTH, worldDotsPath } from '../../data/worldDots'
import { EASE, viewportOnce } from '../../lib/motion'
import { cn } from '../../lib/utils'

const project = (lon, lat) => [(lon + 180) * MAP_SCALE, (LAT_MAX - lat) * MAP_SCALE]

const HUB = { label: 'Djibouti', lon: 43.15, lat: 11.59 }

// Broad regions only — illustrative of ambition, not operating routes.
const REGIONS = [
  { label: 'Europe', lon: 10, lat: 50, dx: -8, anchor: 'end' },
  { label: 'Gulf', lon: 54, lat: 25, dx: 8, anchor: 'start' },
  { label: 'South Asia', lon: 78, lat: 21, dx: 8, anchor: 'start' },
  { label: 'East Asia', lon: 116, lat: 33, dx: 8, anchor: 'start' },
  { label: 'East Africa', lon: 37, lat: -4, dx: 8, anchor: 'start' },
  { label: 'West Africa', lon: -2, lat: 9, dx: -8, anchor: 'end' },
  { label: 'Americas', lon: -78, lat: 36, dx: -8, anchor: 'end' },
]

function arcPath([x1, y1], [x2, y2]) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dist = Math.hypot(x2 - x1, y2 - y1)
  const lift = Math.min(dist * 0.32, 140)
  return `M${x1} ${y1} Q${mx} ${my - lift} ${x2} ${y2}`
}

export default function TradeMap({ dark = true, className }) {
  const hub = project(HUB.lon, HUB.lat)
  const dotColor = dark ? 'rgb(255 255 255 / 0.3)' : 'rgb(23 43 58 / 0.25)'
  const labelColor = dark ? 'rgb(255 255 255 / 0.85)' : 'rgb(23 43 58 / 0.8)'

  return (
    <figure className={cn('relative', className)}>
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-labelledby="trade-map-title trade-map-desc"
      >
        <title id="trade-map-title">Illustrative map of Djibouti’s connection to world regions</title>
        <desc id="trade-map-desc">
          A decorative dotted world map with curved lines from Djibouti toward Europe, the Gulf, South Asia, East Asia, East Africa,
          West Africa and the Americas. The lines express ambition and do not represent operating shipping routes.
        </desc>
        <path d={worldDotsPath} stroke={dotColor} strokeWidth="2.6" strokeLinecap="round" fill="none" />

        {REGIONS.map((r, i) => {
          const p = project(r.lon, r.lat)
          const d = arcPath(hub, p)
          return (
            <g key={r.label}>
              <motion.path
                d={d}
                fill="none"
                stroke="#C7A66A"
                strokeOpacity="0.35"
                strokeWidth="1.4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 1.8, delay: 0.2 + i * 0.12, ease: EASE }}
              />
              <path d={d} fill="none" stroke="#C7A66A" strokeWidth="1.4" className="route-dash" strokeOpacity="0.9" />
              <circle cx={p[0]} cy={p[1]} r="4" fill="#C7A66A" />
              <text
                x={p[0] + r.dx}
                y={p[1] + 4}
                textAnchor={r.anchor}
                fill={labelColor}
                className="hidden sm:inline"
                style={{ font: '700 13px var(--font-sans)', letterSpacing: '0.08em' }}
              >
                {r.label.toUpperCase()}
              </text>
            </g>
          )
        })}

        <circle cx={hub[0]} cy={hub[1]} r="6" fill="#C7A66A" className="pulse-ring" />
        <circle cx={hub[0]} cy={hub[1]} r="6" fill="#C7A66A" stroke={dark ? '#101E2A' : '#F5F3EE'} strokeWidth="2" />
        <text x={hub[0] + 10} y={hub[1] + 20} fill={dark ? '#fff' : '#172B3A'} className="map-hub-label" style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, letterSpacing: '0.1em' }}>
          DJIBOUTI
        </text>
      </svg>
      {/* On small screens the in-map labels are too small to read, so list the regions instead. */}
      <ul className="mt-5 flex flex-wrap gap-2 sm:hidden" aria-hidden="true">
        {REGIONS.map((r) => (
          <li
            key={r.label}
            className={cn('rounded-full border px-3 py-1 text-[0.7rem] font-semibold', dark ? 'border-white/15 text-white/75' : 'border-line text-navy')}
          >
            {r.label}
          </li>
        ))}
      </ul>
      <figcaption className={cn('mt-4 text-xs', dark ? 'text-white/55' : 'text-body')}>
        Illustrative only. Lines express MAKHORIZON’s regional and international ambition and do not represent verified or operating routes.
      </figcaption>
    </figure>
  )
}
