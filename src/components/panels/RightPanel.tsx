import { useMemo, useState } from 'react'
import {
  AtSign,
  Briefcase,
  Flame,
  Link2,
  MapPin,
  NotebookPen,
  Search,
  Sparkles,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ClueCategory } from '../../data/types'
import { useCase } from '../../state/caseContext'
import { useCaseActions } from '../../state/useCaseActions'
import { useGameStore } from '../../store/gameStore'

const CAT: Record<ClueCategory, { icon: LucideIcon; cls: string; label: string }> = {
  szemely: { icon: User, cls: 'text-sky-300', label: 'személy' },
  hely: { icon: MapPin, cls: 'text-emerald-300', label: 'helyszín' },
  munka: { icon: Briefcase, cls: 'text-amber-300', label: 'munka' },
  kapcsolat: { icon: AtSign, cls: 'text-violet-300', label: 'kapcsolat' },
  indok: { icon: Flame, cls: 'text-red-300', label: 'motívum' },
  egyeb: { icon: Search, cls: 'text-zinc-400', label: 'egyéb' },
}

type Tab = 'clues' | 'notes' | 'link'

export function RightPanel() {
  const [tab, setTab] = useState<Tab>('clues')
  const discovered = useGameStore((s) => s.discovered)
  const connections = useGameStore((s) => s.connections)
  const c = useCase()

  const remaining = c.connections.filter(
    (x) => !connections.includes(x.id) && discovered.includes(x.clueA) && discovered.includes(x.clueB),
  ).length

  const tabs: { id: Tab; label: string; badge?: number | string }[] = [
    { id: 'clues', label: 'Nyomok', badge: discovered.length },
    { id: 'notes', label: 'Jegyzet' },
    { id: 'link', label: 'Kapcsolás', badge: remaining > 0 ? remaining : undefined },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 px-2 py-2.5 text-xs font-semibold transition-colors ${
              tab === t.id
                ? 'border-b-2 border-amber-400 bg-white/[0.03] text-amber-300'
                : 'border-b-2 border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {t.label}
            {t.badge !== undefined && t.badge !== 0 && (
              <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 font-mono text-[10px] text-amber-300">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto thin-scroll">
        {tab === 'clues' && <CluesList />}
        {tab === 'notes' && <NotesTab />}
        {tab === 'link' && <LinkTab />}
      </div>
    </div>
  )
}

function CluesList() {
  const discovered = useGameStore((s) => s.discovered)
  const c = useCase()
  const clues = c.clues.filter((x) => discovered.includes(x.id))

  if (clues.length === 0) {
    return (
      <div className="p-4 text-xs leading-relaxed text-zinc-600">
        Még nincs nyomod. Az oldalakon a <span className="text-amber-300/80 underline decoration-dotted">kiemelt szövegrészekre</span> kattintva
        fedezhetsz fel nyomokat.
      </div>
    )
  }

  return (
    <div className="space-y-2 p-3">
      {clues.map((clue) => {
        const cat = CAT[clue.category]
        return (
          <div
            key={clue.id}
            className={`animate-slide-up rounded-lg border p-3 ${
              clue.deduction ? 'border-violet-400/30 bg-violet-400/5' : 'border-white/5 bg-zinc-900/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {clue.deduction ? (
                <Sparkles className="size-3.5 shrink-0 text-violet-300" />
              ) : (
                <cat.icon className={`size-3.5 shrink-0 ${cat.cls}`} />
              )}
              <span className={`text-xs font-bold ${clue.deduction ? 'text-violet-200' : 'text-zinc-100'}`}>
                {clue.title}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-400">{clue.description}</p>
            <div className="mt-1.5 font-mono text-[10px] text-zinc-600">{clue.source}</div>
          </div>
        )
      })}
    </div>
  )
}

function NotesTab() {
  const notes = useGameStore((s) => s.notes)
  const setNotes = useGameStore((s) => s.setNotes)
  return (
    <div className="flex h-full flex-col p-3">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Írd ide a nyomozás megjegyzéseit... (automatikus mentés)"
        className="min-h-[300px] w-full flex-1 resize-none rounded-lg border border-white/5 bg-zinc-950/60 p-3 font-mono text-xs leading-relaxed text-zinc-300 placeholder:text-zinc-700 focus:border-amber-400/30"
      />
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-700">
        <span className="inline-flex items-center gap-1">
          <NotebookPen className="size-3" /> automatikus mentés
        </span>
        <span className="font-mono">{notes.length} karakter</span>
      </div>
    </div>
  )
}

function LinkTab() {
  const c = useCase()
  const discovered = useGameStore((s) => s.discovered)
  const connections = useGameStore((s) => s.connections)
  const pushToast = useGameStore((s) => s.pushToast)
  const { makeConnection } = useCaseActions()

  const available = useMemo(
    () => c.clues.filter((x) => discovered.includes(x.id) && !x.deduction),
    [c.clues, discovered],
  )
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const connect = () => {
    if (!a || !b) return
    if (a === b) {
      pushToast({ kind: 'info', title: 'Két különböző nyomot válassz!' })
      return
    }
    const conn = c.connections.find(
      (x) =>
        !connections.includes(x.id) &&
        ((x.clueA === a && x.clueB === b) || (x.clueA === b && x.clueB === a)),
    )
    if (conn) {
      makeConnection(conn.id)
      setA('')
      setB('')
    } else {
      pushToast({
        kind: 'info',
        title: 'Nincs új összefüggés',
        text: 'Ez a két nyom együtt egyelőre nem vezet sejthez.',
      })
    }
  }

  const remaining = c.connections.filter(
    (x) => !connections.includes(x.id) && discovered.includes(x.clueA) && discovered.includes(x.clueB),
  ).length

  return (
    <div className="space-y-3 p-3">
      <p className="text-[11px] leading-relaxed text-zinc-500">
        Válassz két nyomot, és nézd meg, milyen <span className="text-violet-300">összefüggés</span> rejlik köztük. A
        helyes párosok következtetést adnak.
      </p>

      {remaining > 0 && (
        <div className="rounded-lg border border-violet-400/30 bg-violet-400/10 px-3 py-2 text-[11px] text-violet-200">
          {remaining} párosítás vár feldolgozásra a meglévő nyomokból!
        </div>
      )}

      <div className="space-y-2">
        <select
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="w-full cursor-pointer rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-2 text-xs text-zinc-200"
        >
          <option value="">1. nyom választása...</option>
          {available.map((x) => (
            <option key={x.id} value={x.id}>
              {x.title}
            </option>
          ))}
        </select>
        <div className="flex justify-center">
          <Link2 className="size-4 text-zinc-700" />
        </div>
        <select
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="w-full cursor-pointer rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-2 text-xs text-zinc-200"
        >
          <option value="">2. nyom választása...</option>
          {available.map((x) => (
            <option key={x.id} value={x.id}>
              {x.title}
            </option>
          ))}
        </select>
        <button
          onClick={connect}
          disabled={!a || !b}
          className="w-full cursor-pointer rounded-lg bg-violet-500 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-violet-400 disabled:cursor-default disabled:opacity-30"
        >
          Összekapcsolás
        </button>
      </div>

      {connections.length > 0 && (
        <div className="space-y-2 border-t border-white/5 pt-3">
          <div className="text-[10px] font-semibold tracking-wide text-zinc-500 uppercase">Felfedezett összefüggések</div>
          {connections.map((connId) => {
            const conn = c.connections.find((x) => x.id === connId)
            if (!conn) return null
            const result = c.clues.find((x) => x.id === conn.resultClueId)
            return (
              <div key={connId} className="animate-slide-up rounded-lg border border-violet-400/30 bg-violet-400/5 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-200">
                  <Link2 className="size-3" /> {result?.title}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">{conn.insight}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
