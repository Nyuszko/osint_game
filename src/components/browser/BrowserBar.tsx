import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  FolderOpen,
  Home,
  RotateCcw,
  Search,
} from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { useCase } from '../../state/caseContext'
import { normalizeUrl, parseGameUrl, searchUrl } from '../../lib/url'
import { SiteIcon } from '../pages/SiteIcon'

export function BrowserBar() {
  const c = useCase()
  const history = useGameStore((s) => s.history)
  const hIndex = useGameStore((s) => s.hIndex)
  const navigate = useGameStore((s) => s.navigate)
  const back = useGameStore((s) => s.back)
  const forward = useGameStore((s) => s.forward)
  const backToMenu = useGameStore((s) => s.backToMenu)
  const restartCase = useGameStore((s) => s.restartCase)
  const setModalOpen = useGameStore((s) => s.setModalOpen)

  const url = history[hIndex] ?? c.homeUrl
  const [addr, setAddr] = useState(url)
  const [lastUrl, setLastUrl] = useState(url)
  // Ha a játék navigál (vissza/előre/klikk), szinkronizáljuk a címsort render közben.
  if (url !== lastUrl) {
    setLastUrl(url)
    setAddr(url)
  }

  const bookmarkUrls = (() => {
    const visitedDomains = new Set(history.map((u) => parseGameUrl(normalizeUrl(u)).domain))
    const caseBm = (c.bookmarks ?? []).filter((u) => {
      const d = parseGameUrl(normalizeUrl(u)).domain
      return c.websites.some((w) => w.domain === d) || visitedDomains.has(d)
    })
    const visitedUrls = history.filter((u) => {
      const d = parseGameUrl(normalizeUrl(u)).domain
      return !caseBm.some((b) => parseGameUrl(normalizeUrl(b)).domain === d)
    })
    const seenDomains = new Set<string>()
    const out: string[] = []
    for (const u of [...caseBm, ...visitedUrls]) {
      const d = parseGameUrl(normalizeUrl(u)).domain
      if (seenDomains.has(d)) continue
      seenDomains.add(d)
      out.push(u)
      if (out.length >= 10) break
    }
    return out
  })()

  const go = (e: React.FormEvent) => {
    e.preventDefault()
    const v = normalizeUrl(addr)
    if (!v) return
    const known = c.websites.some((w) => v === w.domain || v.startsWith(w.domain + '/'))
    if (known) navigate(v)
    else navigate(searchUrl(c.searchDomain, v))
  }

  return (
    <header className="z-20 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          onClick={backToMenu}
          title="Vissza az aktákhoz"
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
        >
          <FolderOpen className="size-5 text-amber-400" />
          <span className="hidden text-sm font-bold tracking-widest text-amber-400 sm:block">CASEFILE</span>
          <span className="hidden font-mono text-[10px] text-zinc-600 lg:block">{c.code}</span>
        </button>

        <div className="mx-1 flex items-center gap-0.5">
          <button
            onClick={back}
            disabled={hIndex === 0}
            title="Vissza"
            className="cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200 disabled:cursor-default disabled:opacity-30"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            onClick={forward}
            disabled={hIndex >= history.length - 1}
            title="Előre"
            className="cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200 disabled:cursor-default disabled:opacity-30"
          >
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => navigate(c.homeUrl)}
            title="Kezdőlap"
            className="cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200"
          >
            <Home className="size-4" />
          </button>
        </div>

        <form onSubmit={go} className="min-w-0 flex-1">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-3.5 py-1.5 transition-colors focus-within:border-cyan-400/50">
            <Search className="size-3.5 shrink-0 text-zinc-600" />
            <input
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              onFocus={(e) => e.target.select()}
              spellCheck={false}
              className="w-full bg-transparent font-mono text-[13px] text-zinc-200 placeholder:text-zinc-600"
              placeholder="Cím vagy keresés..."
            />
          </div>
        </form>

        <button
          onClick={() => {
            if (confirm('Biztosan újrakezded az esetet? Minden haladásod elvész.'))
              restartCase(c)
          }}
          title="Eset újrakezdése"
          className="cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-red-300"
        >
          <RotateCcw className="size-4" />
        </button>

        <button
          onClick={() => setModalOpen(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-zinc-950 shadow transition-all hover:bg-amber-400 hover:shadow-amber-500/20"
        >
          <FileText className="size-4" />
          <span className="hidden sm:block">Jelentés beadása</span>
        </button>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto px-3 pb-1.5 thin-scroll">
        {bookmarkUrls.map((u) => {
          const d = parseGameUrl(normalizeUrl(u)).domain
          const w = c.websites.find((x) => x.domain === d)
          if (!w) return null
          return (
            <button
              key={u}
              onClick={() => navigate(u)}
              title={u}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/5 bg-zinc-900/60 px-2.5 py-1 text-[11px] text-zinc-400 transition-colors hover:border-white/15 hover:text-zinc-200"
            >
              <SiteIcon name={w.icon} className={`size-3 ${w.accent}`} />
              {u === w.domain ? w.domain : u.replace(w.domain + '/', '')}
            </button>
          )
        })}
      </div>
    </header>
  )
}
