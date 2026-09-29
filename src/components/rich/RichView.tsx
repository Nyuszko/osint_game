import { Check } from 'lucide-react'
import type { RichText } from '../../data/types'
import { useGameStore } from '../../store/gameStore'
import { useCaseActions } from '../../state/useCaseActions'

/** RichText megjelenítő: kattintható nyomok + belső linkek. */
export function RichView({ segs }: { segs: RichText }) {
  const { discoverClue } = useCaseActions()
  const navigate = useGameStore((s) => s.navigate)
  const discovered = useGameStore((s) => s.discovered)

  return (
    <>
      {segs.map((seg, i) => {
        if (seg.ev) {
          const found = discovered.includes(seg.ev)
          return (
            <button
              key={i}
              onClick={() => discoverClue(seg.ev!)}
              title={found ? 'Ez a nyom már a birtokodban van' : 'Nyom felfedezése'}
              className={
                'inline cursor-pointer rounded-sm underline decoration-dotted underline-offset-2 transition-colors ' +
                (found
                  ? 'text-emerald-300 decoration-emerald-500/50 hover:bg-emerald-400/10'
                  : 'text-amber-300 decoration-amber-500/60 hover:bg-amber-400/10')
              }
            >
              {seg.text}
              {found && <Check className="mb-0.5 ml-0.5 inline-block size-3" />}
            </button>
          )
        }
        if (seg.link) {
          return (
            <button
              key={i}
              onClick={() => navigate(seg.link!)}
              className="inline cursor-pointer text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 transition-colors hover:text-cyan-200"
            >
              {seg.text}
            </button>
          )
        }
        if (seg.strong) {
          return (
            <strong key={i} className="font-semibold text-zinc-100">
              {seg.text}
            </strong>
          )
        }
        return <span key={i}>{seg.text}</span>
      })}
    </>
  )
}

/** Több bekezdéses RichText. */
export function PView({ paras, className = 'space-y-3' }: { paras: RichText[]; className?: string }) {
  return (
    <div className={className}>
      {paras.map((p, i) => (
        <p key={i} className="leading-relaxed">
          <RichView segs={p} />
        </p>
      ))}
    </div>
  )
}
