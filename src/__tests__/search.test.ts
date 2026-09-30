import { describe, expect, it } from 'vitest'
import { buildIndex, searchEntries } from '../data/search'
import { case001 } from '../data/cases/case001'

describe('buildIndex / searchEntries', () => {
  it('a webmail privát: nincs indexelve', () => {
    const idx = buildIndex(case001)
    expect(idx.some((e) => e.url.includes('mail.'))).toBe(false)
  })

  it('talál a cím és a kulcsszavak alapján', () => {
    const idx = buildIndex(case001)
    const hits = searchEntries(idx, 'Nightjar')
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.some((h) => h.url === 'neonbyte.hu' || h.snippet.includes('Nightjar'))).toBe(true)
  })

  it('üres keresésre nincs találat', () => {
    expect(searchEntries(buildIndex(case001), '   ')).toEqual([])
  })
})
