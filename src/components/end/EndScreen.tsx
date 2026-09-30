import { useState } from 'react'
import { ArrowLeft, FileWarning, RotateCcw, Share2, ShieldCheck, Trophy } from 'lucide-react'
import { useCase } from '../../state/caseContext'
import { useGameStore } from '../../store/gameStore'
import { scoreOf, rankOf } from '../../lib/score'

export function EndScreen() {
  const c = useCase()
  const screen = useGameStore((s) => s.screen)
  const discovered = useGameStore((s) => s.discovered)
  const connections = useGameStore((s) => s.connections)
  const attempts = useGameStore((s) => s.attempts)
  const hints = useGameStore((s) => s.hints)
  const startedAt = useGameStore((s) => s.startedAt)
  const restart = useGameStore((s) => s.restartCase)
  const backToMenu = useGameStore((s) => s.backToMenu)
  const pushToast = useGameStore((s) => s.pushToast)

  const won = screen === 'won'
  // Az időt csak egyszer számoljuk ki (a képernyő megnyitásakor), hogy a render tisztán maradjon.
  const [minutes] = useState(() => (startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : 0))
  const score = scoreOf(discovered.length, connections.length, attempts, hints.length)
  const { rank, cls } = rankOf(score)
  const perfectClues = discovered.length === c.clues.length

  const share = async () => {
    const lines = [
      `CASEFILE · ${c.code} · „${c.title}”`,
      `Rang: ${rank} (${score} pont) · ~${minutes} perc`,
      `Nyomok ${discovered.length}/${c.clues.length} · Összefüggések ${connections.length}/${c.connections.length} · Tipp: ${hints.length} · Hibás beküldés: ${attempts}`,
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      pushToast({ kind: 'info', title: 'Eredmény a vágólapon', text: 'Illeszd be bárhova, és oszd meg!' })
    } catch {
      pushToast({ kind: 'error', title: 'Nem sikerült másolni', text: 'A böngésző nem engedte a vágólap használatát.' })
    }
  }

  return (
    <div className="bg-grid thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {won ? (
          <div className="animate-slide-up text-center">
            <ShieldCheck className="mx-auto size-16 text-emerald-400" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50">ÜGY LEZÁRVA</h1>
            <p className="mt-1 font-mono text-sm text-zinc-500">{c.code} · {c.title}</p>

            <div className={`mx-auto mt-6 flex size-28 items-center justify-center rounded-2xl border-2 text-6xl font-black ${cls}`}>
              {rank}
            </div>
            <div className="mt-2 text-xs tracking-wide text-zinc-500 uppercase">nyomozói rang</div>

            <div className="panel mx-auto mt-6 max-w-sm rounded-xl p-4 text-left text-sm">
              <Row label="Helyes válaszok" value="4 × 120" />
              <Row label="Felfedezett nyomok" value={`${discovered.length} × 15`} />
              <Row label="Összefüggések" value={`${connections.length} × 25`} />
              <Row label="Hibás beküldések" value={`−${attempts} × 40`} />
              <Row label="Tippek" value={`−${hints.length} × 30`} />
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 font-bold text-amber-300">
                <span>Összpontszám</span>
                <span className="font-mono text-lg">{score}</span>
              </div>
              {perfectClues && (
                <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-amber-400/10 py-1.5 text-xs font-semibold text-amber-300">
                  <Trophy className="size-3.5" /> Tökéletes nyomozás – minden nyom megvan!
                </div>
              )}
              <div className="mt-2 text-center text-[11px] text-zinc-600">eltelt idő: ~{minutes} perc</div>
            </div>
          </div>
        ) : (
          <div className="animate-slide-up text-center">
            <FileWarning className="mx-auto size-16 text-red-400" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50">A NYOMOZÁS ELAKADT</h1>
            <p className="mt-1 font-mono text-sm text-zinc-500">{c.code} · {c.title}</p>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-zinc-400">
              Három hibás jelentés után a központ lezárta az aktát. A nyomok azonban még ott vannak – érdemes újra
              átolvasni a profilokat, a leveleket és a fórumot, majd összekapcsolni a darabokat.
            </p>
            <div className="panel mx-auto mt-6 max-w-sm rounded-xl p-4 text-sm">
              <Row label="Felfedezett nyomok" value={`${discovered.length}/${c.clues.length}`} />
              <Row label="Összefüggések" value={`${connections.length}/${c.connections.length}`} />
            </div>
          </div>
        )}

        {(won || discovered.length > 0) && (
          <div className="panel mt-8 rounded-xl p-5">
            <h2 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              {won ? 'Az eset összefoglalója' : 'Amit eddig tudsz'}
            </h2>
            <div className="mt-3 space-y-3">
              {(won ? c.solutionRecap : c.briefing).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-zinc-400">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3 pb-6">
          <button
            onClick={() => restart(c)}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow transition-colors hover:bg-amber-400"
          >
            <RotateCcw className="size-4" /> Újrajátszás
          </button>
          {won && (
            <button
              onClick={share}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow transition-colors hover:bg-violet-400"
            >
              <Share2 className="size-4" /> Eredmény megosztása
            </button>
          )}
          <button
            onClick={backToMenu}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/30 hover:text-zinc-100"
          >
            <ArrowLeft className="size-4" /> Vissza az aktákhoz
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-zinc-400">
      <span>{label}</span>
      <span className="font-mono text-zinc-200">{value}</span>
    </div>
  )
}
