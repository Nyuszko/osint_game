import { normalizeUrl, parseGameUrl, fullUrl } from '../../lib/url'
import { useCase } from '../../state/caseContext'
import { useGameStore } from '../../store/gameStore'
import type { PageData, Website } from '../../data/types'
import { SearchPage } from './SearchPage'
import { ProfilePage } from './ProfilePage'
import { ForumPage } from './ForumPage'
import { WebmailPage } from './WebmailPage'
import { ChatPage } from './ChatPage'
import { GalleryPage } from './GalleryPage'
import { NewsPage } from './NewsPage'
import { CompanyPage } from './CompanyPage'
import { BlogPage } from './BlogPage'
import { MapPage } from './MapPage'
import { NotFoundPage } from './NotFoundPage'

function PageBody({ page, site }: { page: PageData; site: Website }) {
  switch (page.kind) {
    case 'search':
      return null // a SearchPage query-paramétert kap, lent kezeljük
    case 'profile':
      return <ProfilePage page={page} site={site} />
    case 'forum':
      return <ForumPage page={page} site={site} />
    case 'webmail':
      return <WebmailPage page={page} site={site} />
    case 'chat':
      return <ChatPage page={page} site={site} />
    case 'gallery':
      return <GalleryPage page={page} site={site} />
    case 'news':
      return <NewsPage page={page} site={site} />
    case 'company':
      return <CompanyPage page={page} site={site} />
    case 'blog':
      return <BlogPage page={page} site={site} />
    case 'map':
      return <MapPage page={page} site={site} />
  }
}

export function PageRouter() {
  const c = useCase()
  const url = useGameStore((s) => s.history[s.hIndex] ?? '') || c.homeUrl

  const { domain, path, query } = parseGameUrl(normalizeUrl(url))
  const site = c.websites.find((w) => w.domain === domain)

  let body: React.ReactNode
  if (!site) {
    body = <NotFoundPage url={domain + path} />
  } else {
    const exact = fullUrl(domain, path)
    const page =
      site.pages.find((p) => normalizeUrl(p.url) === exact) ??
      site.pages.find((p) => normalizeUrl(p.url) === site.domain)
    if (!page) {
      body = <NotFoundPage url={exact} />
    } else if (page.kind === 'search') {
      body = <SearchPage q={query.get('q') ?? ''} />
    } else {
      body = <PageBody page={page} site={site} />
    }
  }

  return (
    <div key={url} className="mx-auto max-w-3xl animate-fade-in px-5 py-6">
      {body}
    </div>
  )
}
