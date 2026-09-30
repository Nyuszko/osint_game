import { describe, expect, it } from 'vitest'
import { rankOf, scoreOf, HINT_COST } from '../lib/score'

describe('scoreOf', () => {
  it('tökéletes, tipp nélküli nyomozás alapértéke', () => {
    expect(scoreOf(19, 6, 0)).toBe(4 * 120 + 19 * 15 + 6 * 25)
  })
  it('a hibás beküldések levonódnak', () => {
    expect(scoreOf(19, 6, 2)).toBe(scoreOf(19, 6, 0) - 80)
  })
  it('minden tipp HINT_COST pontba kerül', () => {
    expect(scoreOf(10, 3, 0, 4)).toBe(scoreOf(10, 3, 0) - 4 * HINT_COST)
  })
  it('nem megy nullára', () => {
    expect(scoreOf(0, 0, 99, 99)).toBe(0)
  })
})

describe('rankOf', () => {
  it('küszöbök', () => {
    expect(rankOf(999).rank).toBe('S')
    expect(rankOf(620).rank).toBe('S')
    expect(rankOf(619).rank).toBe('A')
    expect(rankOf(520).rank).toBe('A')
    expect(rankOf(519).rank).toBe('B')
    expect(rankOf(400).rank).toBe('B')
    expect(rankOf(399).rank).toBe('C')
  })
})
