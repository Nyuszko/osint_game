import { describe, expect, it } from 'vitest'
import { normalizeUrl, parseGameUrl, fullUrl, searchUrl } from '../lib/url'

describe('normalizeUrl', () => {
  it('levágja a protokollt és a záró perjeleket', () => {
    expect(normalizeUrl('  https://korosnivel.forum/  ')).toBe('korosnivel.forum')
    expect(normalizeUrl('http://napi.pulzus/cikk/arviz/')).toBe('napi.pulzus/cikk/arviz')
  })
})

describe('parseGameUrl', () => {
  it('ékezetes path-t is nyersen ad vissza (nem percent-kódolva)', () => {
    expect(parseGameUrl('csevegohely.social/@feketetó/uzenetek').path).toBe('/@feketetó/uzenetek')
  })

  it('domain + query felbontás', () => {
    const { domain, query } = parseGameUrl('spotlight.kereso/kereses?q=Nightjar')
    expect(domain).toBe('spotlight.kereso')
    expect(query.get('q')).toBe('Nightjar')
  })
})

describe('fullUrl / searchUrl', () => {
  it('path összeállítás', () => {
    expect(fullUrl('terkep.elo', '/korosfalu')).toBe('terkep.elo/korosfalu')
    expect(fullUrl('spotlight.kereso', '')).toBe('spotlight.kereso')
  })
  it('kereső URL kódolja a queryt', () => {
    expect(searchUrl('spotlight.kereso', 'kővölgyi tó')).toContain('q=k%C5%91v%C3%B6lgyi')
  })
})
