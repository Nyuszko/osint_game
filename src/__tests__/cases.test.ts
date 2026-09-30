import { describe, expect, it } from 'vitest'
import { case001 } from '../data/cases/case001'
import { case002 } from '../data/cases/case002'
import { generateCase } from '../gen/generate'
import { validateCase } from '../gen/validate'

describe('validateCase – kézi esetek', () => {
  it('CASE-001 hibátlan', () => {
    expect(validateCase(case001)).toEqual([])
  })
  it('CASE-002 hibátlan', () => {
    expect(validateCase(case002)).toEqual([])
  })
})

describe('validateCase – generált esetek', () => {
  it('minden sablon és szint megoldható marad', () => {
    for (const variant of ['missing', 'fraud', 'identity', 'bec'] as const) {
      for (const level of [2, 3, 4, 5] as const) {
        const c = generateCase('TEST1', { variant, level })
        expect(validateCase(c), `${c.code} ${variant} L${level}`).toEqual([])
      }
    }
  })
})

describe('sérült eset felismerése', () => {
  it('törölt nyom hibát ad', () => {
    const broken = { ...case001, clues: case001.clues.slice(1) }
    expect(validateCase(broken).length).toBeGreaterThan(0)
  })
})
