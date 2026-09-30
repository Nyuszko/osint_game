import { Lock, MessagesSquare } from 'lucide-react'
import type { ChatMsg, ChatPageData, Website } from '../../data/types'
import { RichView } from '../rich/RichView'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Bubble({ msg }: { msg: ChatMsg }) {
  const mine = msg.from === 'me'
  return (
    <div className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          mine ? 'bg-sky-500/30 text-sky-200' : 'bg-violet-500/30 text-violet-200'
        }`}
      >
        {initials(msg.author)}
      </span>
      <div className={`max-w-[80%] ${mine ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-3.5 py-2.5 text-left text-sm leading-relaxed ${
            mine
              ? 'rounded-br-sm bg-sky-500/15 text-zinc-200'
              : 'rounded-bl-sm bg-zinc-800/80 text-zinc-200'
          }`}
        >
          <RichView segs={msg.body} />
        </div>
        <div className="mt-1 font-mono text-[10px] text-zinc-600">
          {msg.author} · {msg.time}
        </div>
      </div>
    </div>
  )
}

export function ChatPage({ page, site }: { page: ChatPageData; site: Website }) {
  return (
    <div className="animate-fade-in overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60">
      <div className="flex items-center gap-3 border-b border-white/10 bg-zinc-900/60 px-4 py-3">
        <MessagesSquare className={`size-4 shrink-0 ${site.accent}`} />
        <span className="flex size-9 items-center justify-center rounded-full bg-violet-500/30 text-xs font-bold text-violet-200">
          {initials(page.partner)}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-100">{page.partner}</div>
          <div className="truncate font-mono text-[11px] text-zinc-500">{page.partnerHandle}</div>
        </div>
        <div className="ml-auto hidden text-right font-mono text-[10px] text-zinc-600 sm:block">
          fiók: {page.account}
          <div className="flex items-center justify-end gap-1 text-emerald-400/80">
            <Lock className="size-3" /> titkosított
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {page.messages.map((m) => (
          <Bubble key={m.id} msg={m} />
        ))}
      </div>
    </div>
  )
}
