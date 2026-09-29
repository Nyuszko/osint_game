export const normalizeUrl = (raw: string): string =>
  raw
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')

export function parseGameUrl(url: string): { domain: string; path: string; query: URLSearchParams } {
  const withProto = url.includes('://') ? url : `http://${url}`
  const u = new URL(withProto)
  return { domain: u.hostname, path: u.pathname.replace(/\/+$/, ''), query: u.searchParams }
}

export const fullUrl = (domain: string, path: string): string =>
  path ? `${domain}${path.startsWith('/') ? path : `/${path}`}` : domain

export const searchUrl = (domain: string, q: string): string =>
  `${domain}/kereses?q=${encodeURIComponent(q)}`
