import { Building2 } from 'lucide-react'
import type { CompanyPageData, Website } from '../../data/types'
import { PView, RichView } from '../rich/RichView'

export function CompanyPage({ page, site }: { page: CompanyPageData; site: Website }) {
  return (
    <div className="animate-fade-in">
      <div className="rounded-xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-zinc-900 to-zinc-950 p-8">
        <div className="flex items-center gap-3">
          <Building2 className={`size-8 ${site.accent}`} />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">{site.name}</h1>
        </div>
        <p className="mt-3 text-lg text-zinc-300">{page.hero}</p>
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">Rólunk</h2>
        <PView paras={page.about} className="mt-2 space-y-3 text-[15px] text-zinc-300" />
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">Termékeink</h2>
        <div className="mt-3 grid gap-3 pb-8 sm:grid-cols-2">
          {page.projects.map((pr) => (
            <div
              key={pr.name}
              className="rounded-xl border border-white/5 bg-zinc-900/50 p-4 transition-colors hover:border-white/15"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-mono text-base font-bold text-zinc-100">{pr.name}</h3>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">{pr.status}</span>
              </div>
              <div className="mt-0.5 text-xs text-zinc-500">{pr.tagline}</div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                <RichView segs={pr.desc} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-4 font-mono text-xs text-zinc-500">{page.contact}</footer>
    </div>
  )
}
