import { useState } from 'react'
import { AlertTriangle, Inbox, Paperclip, ShieldAlert } from 'lucide-react'
import type { EmailData, WebmailPageData, Website } from '../../data/types'
import { RichView } from '../rich/RichView'
import { useCaseActions } from '../../state/useCaseActions'

function EmailRow({
  email,
  active,
  onClick,
}: {
  email: EmailData
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full cursor-pointer items-start gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors ${
        active ? 'bg-violet-400/10' : 'hover:bg-zinc-900/70'
      }`}
    >
      <span
        className={`mt-1.5 size-2 shrink-0 rounded-full ${
          email.unread ? 'bg-violet-400' : 'bg-transparent'
        }`}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          {email.phishing && <AlertTriangle className="size-3.5 shrink-0 text-red-400" />}
          <span className={`truncate text-sm ${email.unread ? 'font-semibold text-zinc-100' : 'text-zinc-300'}`}>
            {email.from}
          </span>
        </span>
        <span className={`mt-0.5 block truncate text-xs ${email.unread ? 'text-zinc-300' : 'text-zinc-500'}`}>
          {email.subject}
        </span>
      </span>
      <span className="shrink-0 font-mono text-[10px] text-zinc-600">{email.date}</span>
    </button>
  )
}

export function WebmailPage({ page, site }: { page: WebmailPageData; site: Website }) {
  const [selectedId, setSelectedId] = useState<string>(
    () => (page.emails.find((e) => e.unread) ?? page.emails[0])?.id ?? '',
  )
  const { discoverClue } = useCaseActions()
  const selected = page.emails.find((e) => e.id === selectedId) ?? page.emails[0]

  return (
    <div className="animate-fade-in overflow-hidden rounded-xl border border-white/10 bg-zinc-950/60">
      <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900/60 px-4 py-2.5">
        <Inbox className={`size-4 ${site.accent}`} />
        <span className="text-sm font-semibold text-zinc-200">Beérkezett üzenetek</span>
        <span className="font-mono text-xs text-zinc-500">· {page.account}</span>
      </div>

      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="border-white/5 md:border-r">
          {page.emails.map((e) => (
            <EmailRow key={e.id} email={e} active={e.id === selected?.id} onClick={() => setSelectedId(e.id)} />
          ))}
        </div>

        {selected && (
          <div className="animate-fade-in min-h-[420px] p-5">
            <h2 className="text-lg font-semibold text-zinc-50">{selected.subject}</h2>
            <div className="mt-1 text-xs text-zinc-500">
              <span className="text-zinc-400">{selected.from}</span>{' '}
              <span className="font-mono">&lt;{selected.fromEmail}&gt;</span> · {selected.date}
            </div>

            {selected.phishing && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
                <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                Gyanús levél! Ez adathalászati kísérletnek tűnik – az ilyen üzenetek linkjeire soha ne kattints.
              </div>
            )}

            <div className="mt-4 text-sm leading-relaxed whitespace-pre-line text-zinc-300">
              <RichView segs={selected.body} />
            </div>

            {selected.attachment && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    if (selected.attachment?.clue) discoverClue(selected.attachment.clue)
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/5 px-3 py-2 text-xs text-amber-200 transition-colors hover:bg-amber-400/15"
                >
                  <Paperclip className="size-3.5" />
                  {selected.attachment.name}
                  <span className="text-[10px] text-amber-400/70">– megnyitás</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
