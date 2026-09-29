import { CheckCircle2, ChevronDown, Circle, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import { useCase } from '../../state/caseContext'
import { useGameStore } from '../../store/gameStore'

export function CasePanel() {
  const c = useCase()
  const discovered = useGameStore((s) => s.discovered)
  const completed = useGameStore((s) => s.completedObjectives)
  const attempts = useGameStore((s) => s.attempts)
  const backToMenu = useGameStore((s) => s.backToMenu)
  const [briefOpen, setBriefOpen] = useState(true)

  const doneCount = completed.length + (attempts > 0 && !completed.includes('obj_submit') ? 1 : 0)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-widest text-amber-400">{c.code}</span>
          <button
            onClick={backToMenu}
            className="inline-flex cursor-pointer items-center gap-1 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
          >
            <FolderOpen className="size-3" /> akták
          </button>
        </div>
        <h1 className="mt-1 text-lg leading-tight font-bold text-zinc-50">{c.title}</h1>
        <p className="mt-1 text-xs text-zinc-500">{c.tagline}</p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[10px] tracking-wide text-zinc-600 uppercase">nehézség</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`size-1.5 rounded-full ${n <= c.difficulty ? 'bg-amber-400' : 'bg-zinc-800'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => setBriefOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between text-xs font-semibold tracking-wide text-zinc-400 uppercase transition-colors hover:text-zinc-200"
        >
          Rövidítés
          <ChevronDown className={`size-3.5 transition-transform ${briefOpen ? 'rotate-180' : ''}`} />
        </button>
        {briefOpen && (
          <div className="animate-fade-in mt-2 space-y-2 rounded-lg border border-white/5 bg-zinc-900/50 p-3">
            {c.briefing.map((b, i) => (
              <p key={i} className="text-xs leading-relaxed text-zinc-400">
                {b}
              </p>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Célkitűzések
          <span className="font-mono text-[10px] text-zinc-600">
            {doneCount}/{c.objectives.length}
          </span>
        </div>
        <ul className="mt-2 space-y-1.5">
          {c.objectives.map((o) => {
            const done =
              o.id === 'obj_submit'
                ? attempts > 0 && completed.includes('obj_submit')
                : completed.includes(o.id)
            return (
              <li
                key={o.id}
                className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-xs leading-relaxed transition-colors ${
                  done ? 'text-emerald-300' : 'text-zinc-400'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle className="mt-0.5 size-3.5 shrink-0 text-zinc-700" />
                )}
                <span className={done ? 'line-through decoration-emerald-500/40' : ''}>{o.title}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-lg border border-white/5 bg-zinc-900/50 p-3">
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>Nyomok</span>
          <span className="font-mono">
            {discovered.length}/{c.clues.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
            style={{ width: `${(discovered.length / c.clues.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="mt-auto text-[10px] leading-relaxed text-zinc-700">
        Tipp: a kiemelt szövegrészek kattintható nyomok. Két nyomot a jobb oldali panelen köthetsz össze.
      </p>
    </div>
  )
}
