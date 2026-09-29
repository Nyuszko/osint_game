import { useMemo, useState } from 'react'
import { Building2, Compass, Home, MapPin as MapPinIcon, TrainFront, Tent, Waves } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MapPageData, MapPin, Website } from '../../data/types'
import { RichView } from '../rich/RichView'

const PIN_STYLE: Record<MapPin['kind'], { icon: LucideIcon; cls: string }> = {
  office: { icon: Building2, cls: 'border-amber-400/50 bg-amber-400/15 text-amber-300' },
  home: { icon: Home, cls: 'border-sky-400/50 bg-sky-400/15 text-sky-300' },
  cabin: { icon: Tent, cls: 'border-violet-400/50 bg-violet-400/15 text-violet-300' },
  station: { icon: TrainFront, cls: 'border-zinc-400/50 bg-zinc-400/15 text-zinc-300' },
  poi: { icon: Waves, cls: 'border-cyan-400/50 bg-cyan-400/15 text-cyan-300' },
}

export function MapPage({ page, site }: { page: MapPageData; site: Website }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected: MapPin | null = page.pins.find((p) => p.id === selectedId) ?? null

  const mapSvg = useMemo(() => <MapBackground />, [])

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Compass className={`size-6 ${site.accent}`} />
        <div>
          <h1 className="text-xl font-bold text-zinc-50">{page.region}</h1>
          <div className="text-xs text-zinc-500">
            {site.name} · kattints a jelölőkre a részletekért
          </div>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10">
        <div className="relative aspect-[5/3] w-full">
          {mapSvg}
          {page.pins.map((pin) => {
            const st = PIN_STYLE[pin.kind]
            const active = pin.id === selectedId
            return (
              <button
                key={pin.id}
                onClick={() => setSelectedId(pin.id)}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                className="group absolute -translate-x-1/2 -translate-y-full cursor-pointer"
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all ${st.cls} ${
                    active ? 'scale-125 ring-2 ring-white/50' : 'group-hover:scale-110'
                  }`}
                >
                  <st.icon className="size-4" />
                </span>
                <span className="mt-1 block rounded bg-black/60 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-zinc-200 backdrop-blur-sm">
                  {pin.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 min-h-[110px]">
        {selected ? (
          <div className="panel animate-fade-in rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className={`flex size-7 items-center justify-center rounded-full border ${PIN_STYLE[selected.kind].cls}`}>
                {(() => {
                  const Icon = PIN_STYLE[selected.kind].icon
                  return <Icon className="size-4" />
                })()}
              </span>
              <h3 className="font-semibold text-zinc-100">{selected.label}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              <RichView segs={selected.info} />
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-white/10 p-4 text-sm text-zinc-600">
            <MapPinIcon className="size-4" /> Válassz egy jelölőt a térképen.
          </div>
        )}
      </div>
    </div>
  )
}

function MapBackground() {
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {/* alap */}
      <rect width="100" height="60" fill="#101a14" />
      {/* erdőségek (ÉNy) */}
      <circle cx="14" cy="12" r="10" fill="#14301f" />
      <circle cx="24" cy="8" r="8" fill="#14301f" />
      <circle cx="8" cy="24" r="7" fill="#123021" />
      <circle cx="20" cy="20" r="6" fill="#123021" />
      {/* tó */}
      <path
        d="M24 24 C30 18, 44 20, 46 28 C48 36, 40 44, 30 42 C22 40, 20 30, 24 24 Z"
        fill="#123047"
        stroke="#1d4a63"
        strokeWidth="0.6"
      />
      {/* utak */}
      <path d="M96 34 C80 36, 66 40, 52 46 C48 48, 46 52, 45 58" stroke="#2a2f36" strokeWidth="1.6" fill="none" />
      <path d="M45 58 C38 50, 30 40, 22 30 C18 24, 16 18, 15 12" stroke="#262b31" strokeWidth="1.1" fill="none" strokeDasharray="2 1.4" />
      <path d="M52 46 C56 40, 60 36, 70 34" stroke="#23282e" strokeWidth="1" fill="none" />
      {/* városblokkok (Korosfalu, K) */}
      {[
        [82, 30], [86, 34], [90, 30], [84, 38], [88, 40], [92, 36], [80, 34],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="3" rx="0.4" fill="#1c2128" stroke="#2c3138" strokeWidth="0.2" />
      ))}
      {/* Fenyvesfalu (D) */}
      {[
        [50, 60], [42, 62], [46, 66], [54, 64],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y - 6} width="3" height="2.4" rx="0.4" fill="#1c2128" stroke="#2c3138" strokeWidth="0.2" />
      ))}
      {/* fák ikonok az erdőben */}
      {[8, 14, 20, 26, 11, 17, 23].map((x, i) => (
        <polygon key={i} points={`${x},${8 + (i % 3) * 5} ${x - 1.4},${11 + (i % 3) * 5} ${x + 1.4},${11 + (i % 3) * 5}`} fill="#1d4429" />
      ))}
      {/* észak-jelző */}
      <g>
        <text x="95" y="7" fill="#52525b" fontSize="4" fontFamily="monospace" textAnchor="middle">É</text>
        <path d="M95 8 L95 12 M93.6 9.6 L95 8 L96.4 9.6" stroke="#52525b" strokeWidth="0.4" fill="none" />
      </g>
    </svg>
  )
}
