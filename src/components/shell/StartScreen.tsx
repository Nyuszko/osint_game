import { useState } from 'react'
import { FolderSearch, Play, RotateCcw, Shuffle, Sparkles, Trash2, TriangleAlert } from 'lucide-react'
import { allCases } from '../../data/cases'
import { useGameStore } from '../../store/gameStore'
import { generateCase } from '../../gen/generate'
import { randomSeedCode, SEED_RE } from '../../gen/rng'
import type { CaseVariant } from '../../gen/generate'

function GeneratorPanel() {
  const addCustomCase = useGameStore((s) => s.addCustomCase)
  const startCase = useGameStore((s) => s.startCase)
  const [level, setLevel] = useState<2 | 3>(2)
  const [variant, setVariant] = useState<CaseVariant | 'random'>('random')
  const [seedInput, setSeedInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const create = (code: string) => {
    setError(null)
    try {
      const c = generateCase(code, { variant, level })
      addCustomCase(c)
      startCase(c)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="panel rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-violet-300" />
        <h2 className="text-lg font-bold text-zinc-50">Végtelen akták</h2>
        <span className="rounded-full bg-violet-400/10 px-2 py-0.5 font-mono text-[10px] text-violet-300">
          generátor
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
        Véletlen generált, mindig megoldható ügyek. A <strong className="text-zinc-400">esetkód</strong> (pl.
        K7F2Q) meghatározza az aktát: ugyanazzal a kóddal bárkinél ugyanaz generálódik – oszd meg a barátaiddal!
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value as CaseVariant | 'random')}
          className="cursor-pointer rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-2 text-xs text-zinc-200"
        >
          <option value="random">Véletlen sablon</option>
          <option value="missing">Eltűnt személy</option>
          <option value="fraud">Pénzügyi csalás</option>
          <option value="identity">Hamis identitás</option>
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(Number(e.target.value) as 2 | 3)}
          className="cursor-pointer rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-2 text-xs text-zinc-200"
        >
          <option value={2}>Bevezető (kevesebb csapda)</option>
          <option value={3}>Haladó (több tévút)</option>
        </select>
        <button
          onClick={() => create(randomSeedCode())}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-sm font-bold text-white shadow transition-colors hover:bg-violet-400"
        >
          <Shuffle className="size-4" /> Új akta generálása
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          value={seedInput}
          onChange={(e) => setSeedInput(e.target.value.toUpperCase())}
          placeholder="esetkód, pl. K7F2Q"
          spellCheck={false}
          className="w-44 rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 font-mono text-xs tracking-widest text-zinc-200 placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-600"
        />
        <button
          onClick={() => {
            const code = seedInput.trim()
            if (!SEED_RE.test(code)) {
              setError('A kód 4–8 betű/szám legyen (0/O és 1/I nélkül generálunk).')
              return
            }
            create(code)
          }}
          className="cursor-pointer rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-white/30 hover:text-zinc-100"
        >
          Betöltés kóddal
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}

function CustomCasesList() {
  const customCases = useGameStore((s) => s.customCases)
  const removeCustomCase = useGameStore((s) => s.removeCustomCase)
  const startCase = useGameStore((s) => s.startCase)
  const entries = Object.values(customCases)

  if (entries.length === 0) return null
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Generált aktáid</h3>
      {entries.map((c) => (
        <div key={c.id} className="panel flex flex-wrap items-center gap-3 rounded-xl p-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-violet-300">{c.code}</span>
              <span className="text-sm font-semibold text-zinc-100">{c.title}</span>
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-zinc-600">
              {c.clues.length} nyom · {c.websites.length} oldal · nehézség {c.difficulty}/5
            </div>
          </div>
          <button
            onClick={() => startCase(c)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-violet-400"
          >
            <Play className="size-3.5" /> Indítás
          </button>
          <button
            onClick={() => removeCustomCase(c.id)}
            title="Aktatörlés"
            className="cursor-pointer rounded-lg p-2 text-zinc-600 transition-colors hover:bg-white/5 hover:text-red-300"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export function StartScreen() {
  const customCases = useGameStore((s) => s.customCases)
  const caseId = useGameStore((s) => s.caseId)
  const discovered = useGameStore((s) => s.discovered)
  const completed = useGameStore((s) => s.completedObjectives)
  const screen = useGameStore((s) => s.screen)
  const startCase = useGameStore((s) => s.startCase)
  const resumeCase = useGameStore((s) => s.resumeCase)
  const restartCase = useGameStore((s) => s.restartCase)

  const cases = allCases(customCases)

  return (
    <div className="thin-scroll h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-14">
        <header className="text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-6 py-4">
            <FolderSearch className="size-9 text-amber-400" />
            <div className="text-left">
              <h1 className="text-4xl font-black tracking-[0.18em] text-amber-400">CASEFILE</h1>
              <p className="font-mono text-[11px] tracking-wide text-zinc-500">
                fiktív osint-nyomozós játék
              </p>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
            Nyomozóként fiktív weboldalakat, profilekat, leveleket és fórumokat túrsz át, hogy összekapcsold a
            nyomokat és megoldhasd az ügyet. Minden szereplő és helyszín <strong className="text-zinc-300">kitalált</strong>.
          </p>
        </header>

        <GeneratorPanel />
        <CustomCasesList />

        <div className="mt-10 space-y-4">
          <h3 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Kézzel írott esetek</h3>
          {cases.map((c) => {
            const isCurrent = caseId === c.id
            const hasProgress = isCurrent && (discovered.length > 0 || completed.length > 0)
            const finished = isCurrent && screen === 'won'
            return (
              <div
                key={c.id}
                className="panel animate-slide-up rounded-xl p-5 transition-all hover:border-white/15"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold tracking-widest text-amber-400">{c.code}</span>
                      {finished && (
                        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          megoldva
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-zinc-50">{c.title}</h2>
                    <p className="mt-0.5 text-sm text-zinc-500">{c.tagline}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
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

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-600">
                  <span>{c.clues.length} nyom</span>
                  <span>· {c.objectives.length} célkitűzés</span>
                  <span>· {c.websites.length} fiktív oldal</span>
                </div>

                {hasProgress && (
                  <div className="mt-3 rounded-lg border border-white/5 bg-zinc-950/50 px-3 py-2 font-mono text-[11px] text-zinc-500">
                    haladás: {discovered.length}/{c.clues.length} nyom · {completed.length}/{c.objectives.length} célkitűzés
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {hasProgress ? (
                    <>
                      <button
                        onClick={resumeCase}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 shadow transition-colors hover:bg-amber-400"
                      >
                        <Play className="size-4" /> Folytatás
                      </button>
                      <button
                        onClick={() => restartCase(c)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/30 hover:text-zinc-100"
                      >
                        <RotateCcw className="size-4" /> Újrakezdés
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startCase(c)}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 shadow transition-colors hover:bg-amber-400"
                    >
                      <Play className="size-4" /> Nyomozás indítása
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <footer className="mt-12 pb-6 text-center text-[11px] leading-relaxed text-zinc-700">
          CASEFILE MVP · minden név, személy, cég és esemény kitalált ·
          <br />
          a nyomozás állapota a böngésződben (localStorage) tárolódik
        </footer>
      </div>
    </div>
  )
}
