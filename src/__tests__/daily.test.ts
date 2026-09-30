import { describe, expect, it } from 'vitest'
import { dailyCode, todayKey } from '../lib/daily'
import { SEED_RE } from '../gen/rng'

describe('todayKey', () => {
  it('nulla-kiegitelt YYYY-MM-DD alak', () => {
    expect(todayKey(new Date(2026, 8, 3))).toBe('2026-09-03')
  })
})

describe('dailyCode', () => {
  it('azonos naphoz azonos kód', () => {
    expect(dailyCode(new Date(2026, 8, 30))).toBe(dailyCode(new Date(2026, 8, 30)))
  })
  it('különböző napokhoz különböző kód (nagy valószínűséggel)', () => {
    const a = dailyCode(new Date(2026, 8, 30))
    const b = dailyCode(new Date(2026, 9, 1))
    expect(a).not.toBe(b)
  })
  it('a kód érvényes esetkód', () => {
    expect(SEED_RE.test(dailyCode(new Date(2026, 8, 30)))).toBe(true)
  })
})
