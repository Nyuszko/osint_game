import { describe, expect, it } from 'vitest'
import { Rng, randomSeedCode, SEED_RE } from '../gen/rng'

describe('Rng', () => {
  it('azonos seed → azonos sorozat', () => {
    const a = new Rng('K7F2Q')
    const b = new Rng('K7F2Q')
    const seqA = Array.from({ length: 20 }, () => a.next())
    const seqB = Array.from({ length: 20 }, () => b.next())
    expect(seqA).toEqual(seqB)
  })
  it('eltérő seed → eltérő sorozat', () => {
    const a = new Rng('AAAAA')
    const b = new Rng('BBBBB')
    expect(Array.from({ length: 10 }, () => a.next())).not.toEqual(Array.from({ length: 10 }, () => b.next()))
  })
  it('int a zárt intervallumban marad', () => {
    const r = new Rng('TEST1')
    for (let i = 0; i < 200; i++) {
      const v = r.int(3, 7)
      expect(v).toBeGreaterThanOrEqual(3)
      expect(v).toBeLessThanOrEqual(7)
    }
  })
})

describe('randomSeedCode', () => {
  it('hossz és karakterkészlet', () => {
    for (let i = 0; i < 50; i++) {
      const code = randomSeedCode()
      expect(SEED_RE.test(code)).toBe(true)
      expect(code).not.toMatch(/[01OI]/)
    }
  })
})
