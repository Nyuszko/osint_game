import { useState } from 'react'
import { ChevronDown, Pin } from 'lucide-react'
import type { ForumPageData, Website } from '../../data/types'
import { RichView } from '../rich/RichView'
import { Avatar } from './ProfilePage'

export function ForumPage({ page, site }: { page: ForumPageData; site: Website }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set([page.threads[0]?.id].filter(Boolean) as string[]))

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="animate-fade-in px-1">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className={`flex size-10 items-center justify-center rounded-lg bg-zinc-900 ${site.accent}`}>
          <span className="font-mono text-lg font-bold">K</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-50">{site.name}</h1>
          <div className="text-xs text-zinc-500">{page.boardName}</div>
        </div>
      </div>

      <div className="mt-4 space-y-3 pb-8">
        {page.threads.map((th) => {
          const isOpen = open.has(th.id)
          return (
            <div key={th.id} className="overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50">
              <button
                onClick={() => toggle(th.id)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-900"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {th.pinned && <Pin className="size-3.5 shrink-0 text-lime-300" />}
                    <span className="truncate text-sm font-semibold text-zinc-100">{th.title}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    {th.posts.length} hozzászólás · utolsó: {th.posts[th.posts.length - 1]?.time}
                  </div>
                </div>
                <ChevronDown className={`size-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="animate-fade-in space-y-3 border-t border-white/5 px-4 py-4">
                  {th.posts.map((p, i) => (
                    <div key={i} className="flex gap-3">
                      <Avatar seed={p.handle} name={p.author} size="size-9" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-sm font-semibold ${p.op ? 'text-lime-300' : 'text-zinc-200'}`}>
                            {p.author}
                          </span>
                          {p.op && (
                            <span className="rounded bg-lime-400/10 px-1.5 py-0.5 text-[10px] font-medium text-lime-300">
                              témanyitó
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-zinc-600">{p.time}</span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-zinc-300">
                          <RichView segs={p.body} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
