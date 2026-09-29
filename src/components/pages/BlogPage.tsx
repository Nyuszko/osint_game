import { PenLine } from 'lucide-react'
import type { BlogPageData, Website } from '../../data/types'
import { PView } from '../rich/RichView'

export function BlogPage({ page, site }: { page: BlogPageData; site: Website }) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <PenLine className={`size-6 ${site.accent}`} />
        <div>
          <h1 className="font-mono text-xl font-bold text-zinc-50">{site.domain}</h1>
          <div className="text-xs text-zinc-500">{page.owner} személyes blogja</div>
        </div>
      </div>

      <div className="mt-6 space-y-10 pb-8">
        {page.posts.map((bp) => (
          <article key={bp.id}>
            <h2 className="text-2xl leading-snug font-bold text-zinc-50">{bp.title}</h2>
            <div className="mt-1 font-mono text-xs text-zinc-600">{bp.date}</div>
            <div className="mt-4 border-l-2 border-white/10 pl-4">
              <PView paras={bp.body} className="space-y-3 text-[15px] text-zinc-300" />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
