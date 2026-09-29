import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { buildIndex, searchEntries } from '../../data/search'
import { useCase } from '../../state/caseContext'
import { useGameStore } from '../../store/gameStore'
import { searchUrl } from '../../lib/url'
import { SiteIcon } from './SiteIcon'

const POPULAR = ['Alex Carter', 'Nightjar', 'Kővölgyi-tó', 'off-grid', 'Helios Labs', 'Tényfészek']

export function SearchPage({ q }: { q: string }) {
  const c = useCase()
  const navigate = useGameStore((s) => s.navigate)
  const [input, setInput] = useState(q)

  const index = useMemo(() => buildIndex(c), [c])
  const results = useMemo(() => (q ? searchEntries(index, q) : []), [index, q])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = input.trim()
    if (v) navigate(searchUrl(c.searchDomain, v))
  }

  return (
    <div className={q ? '' : 'flex min-h-[60vh] flex-col items-center justify-center'}>
      <div className={q ? 'mb-6' : 'mb-8 text-center'}>
        <div className={`flex items-center gap-2 ${q ? '' : 'justify-center'}`}>
          <Search className="size-7 text-cyan-300" />
          <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Spotlight
          </span>
        </div>
        {q && <div className="mt-1 text-xs text-zinc-500">„{q}” keresésének eredményei</div>}
      </div>

      <form onSubmit={submit} className={q ? '' : 'w-full max-w-xl'}>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-2.5 transition-colors focus-within:border-cyan-400/50">
          <Search className="size-4 shrink-0 text-zinc-500" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Keress a fiktív neten..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600"
          />
        </div>
      </form>

      {!q && (
        <div className="mt-6 flex max-w-xl flex-wrap justify-center gap-2">
          {POPULAR.map((p) => (
            <button
              key={p}
              onClick={() => {
                setInput(p)
                navigate(searchUrl(c.searchDomain, p))
              }}
              className="cursor-pointer rounded-full border border-white/10 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {q && (
        <div className="mt-2 space-y-1">
          {results.length === 0 && (
            <div className="rounded-lg border border-white/5 bg-zinc-900/40 p-6 text-center text-sm text-zinc-500">
              Nincs találat. Próbálj másik kifejezést.
            </div>
          )}
          {results.map((r) => (
            <button
              key={r.url + r.title}
              onClick={() => navigate(r.url)}
              className="block w-full cursor-pointer rounded-lg border border-transparent p-4 text-left transition-colors hover:border-white/10 hover:bg-zinc-900/50"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <SiteIcon name={iconForSite(c, r.site)} className="size-3.5" />
                <span>{r.site}</span>
                <span className="text-zinc-700">›</span>
                <span className="truncate font-mono">{r.url}</span>
              </div>
              <div className="mt-1 text-base font-medium text-cyan-300 group-hover:underline">{r.title}</div>
              <div className="mt-1 line-clamp-2 text-sm text-zinc-400">{r.snippet}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function iconForSite(caseData: ReturnType<typeof useCase>, siteName: string): string {
  const w = caseData.websites.find((x) => x.name === siteName)
  return w?.icon ?? 'search'
}
