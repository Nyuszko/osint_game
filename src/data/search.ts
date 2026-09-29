import type { GameCase, RichText } from './types'

export interface SearchEntry {
  url: string
  title: string
  site: string
  snippet: string
  keywords: string[]
}

const plain = (rt: RichText | undefined): string => (rt ?? []).map((s) => s.text).join('')

/** Keresőindex építése az eset oldalairól (a webmail privát, azt nem indexeljük). */
export function buildIndex(c: GameCase): SearchEntry[] {
  const entries: SearchEntry[] = []
  for (const site of c.websites) {
    for (const p of site.pages) {
      switch (p.kind) {
        case 'search':
          break
        case 'profile':
          entries.push({
            url: p.url,
            title: `${p.displayName} (${p.handle})`,
            site: site.name,
            snippet: plain(p.bio),
            keywords: [p.displayName, p.handle, site.domain, p.variant === 'dev' ? 'fejlesztő' : 'közösségi'],
          })
          break
        case 'forum':
          for (const th of p.threads) {
            entries.push({
              url: p.url,
              title: th.title,
              site: site.name,
              snippet: plain(th.posts[0]?.body),
              keywords: [th.title, ...th.posts.map((x) => x.author), 'fórum'],
            })
          }
          break
        case 'gallery':
          entries.push({
            url: p.url,
            title: `${p.album} – ${p.owner}`,
            site: site.name,
            snippet: plain(p.photos[0]?.caption),
            keywords: ['fotó', 'album', p.owner, ...p.photos.map((x) => x.geotag?.label ?? '')],
          })
          break
        case 'news':
          entries.push({
            url: p.url,
            title: p.headline,
            site: site.name,
            snippet: p.lead,
            keywords: [p.author, 'hír', 'cikk'],
          })
          break
        case 'company':
          entries.push({
            url: p.url,
            title: `${site.name} – hivatalos oldal`,
            site: site.name,
            snippet: p.hero,
            keywords: [site.name, ...p.projects.map((x) => x.name), 'cég'],
          })
          break
        case 'blog':
          for (const bp of p.posts) {
            entries.push({
              url: p.url,
              title: bp.title,
              site: site.name,
              snippet: plain(bp.body[0]),
              keywords: [p.owner, 'blog'],
            })
          }
          break
        case 'map':
          entries.push({
            url: p.url,
            title: `${p.region} – interaktív térkép`,
            site: site.name,
            snippet: `Pozíciók: ${p.pins.map((x) => x.label).join(' · ')}`,
            keywords: ['térkép', p.region, ...p.pins.map((x) => x.label)],
          })
          break
        case 'webmail':
          break
      }
    }
  }
  return entries
}

/** Egyszerű szavakra bontott pontozott keresés. */
export function searchEntries(entries: SearchEntry[], qRaw: string): SearchEntry[] {
  const q = qRaw.trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/)
  const scored = entries
    .map((e) => {
      const title = e.title.toLowerCase()
      const kws = e.keywords.map((k) => k.toLowerCase())
      const hay = `${title} ${e.snippet.toLowerCase()} ${kws.join(' ')}`
      let score = 0
      for (const t of tokens) {
        if (title.includes(t)) score += 3
        else if (kws.some((k) => k.includes(t))) score += 2
        else if (hay.includes(t)) score += 1
      }
      return { e, score }
    })
    .filter((x) => x.score > 0)
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 12).map((x) => x.e)
}
