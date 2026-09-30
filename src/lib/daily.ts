import { hashSeed } from './hash'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Lokális dátumkulcs, pl. „2026-09-30” – a napi akta állapotához. */
export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * A nap esetkódja: mindenkinél ugyanaz az ügy az adott napon.
 * A kód a dátumból determinisztikusan számolva keletkezik.
 */
export function dailyCode(d = new Date()): string {
  let h = hashSeed('casefile-napi:' + todayKey(d))
  let s = ''
  for (let i = 0; i < 5; i++) {
    s += CODE_CHARS[h % CODE_CHARS.length]
    h = Math.floor(h / CODE_CHARS.length) + 7919
  }
  return s
}
