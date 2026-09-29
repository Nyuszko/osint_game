import { ArrowUpRight } from 'lucide-react'
import type { NewsPageData, Website } from '../../data/types'
import { PView } from '../rich/RichView'
import { useGameStore } from '../../store/gameStore'

export function NewsPage({ page, site }: { page: NewsPageData; site: Website }) {
  const navigate = useGameStore((s) => s.navigate)

  return (
    <article className="animate-fade-in">
      <div className="border-b-2 border-red-400/60 pb-2">
        <span className={`font-mono text-sm font-bold tracking-widest uppercase ${site.accent}`}>{site.name}</span>
        <span className="ml-3 text-xs text-zinc-600">független helyi hírportál</span>
      </div>

      <h1 className="mt-5 text-3xl leading-tight font-bold text-zinc-50">{page.headline}</h1>
      <p className="mt-3 text-lg leading-relaxed text-zinc-400">{page.lead}</p>

      <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
        <span className="font-semibold text-zinc-400">{page.author}</span>
        <span>·</span>
        <span className="font-mono">{page.date}</span>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <PView paras={page.body} className="space-y-4 text-[15px]" />

      {page.related && page.related.length > 0 && (
        <div className="mt-8 rounded-xl border border-white/5 bg-zinc-900/40 p-4">
          <div className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">Kapcsolódó</div>
          <div className="mt-2 space-y-1.5">
            {page.related.map((r) => (
              <button
                key={r.url}
                onClick={() => navigate(r.url)}
                className="flex w-full cursor-pointer items-center gap-1.5 text-sm text-cyan-300 transition-colors hover:text-cyan-200"
              >
                <ArrowUpRight className="size-3.5 shrink-0" />
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
