import { mulberry32, hashSeed } from '../lib/hash'

/** Determinisztikus RNG seed-kódból (pl. „K7F2Q”), így ugyanaz a kód = ugyanaz az eset. */
export class Rng {
  private r: () => number
  constructor(seed: string) {
    this.r = mulberry32(hashSeed('casefile:' + seed))
  }
  next(): number {
    return this.r()
  }
  int(min: number, max: number): number {
    return min + Math.floor(this.r() * (max - min + 1))
  }
  chance(p: number): boolean {
    return this.r() < p
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.r() * arr.length)]
  }
  shuffle<T>(arr: readonly T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.r() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  pickMany<T>(arr: readonly T[], n: number): T[] {
    return this.shuffle(arr).slice(0, n)
  }
}

/** Zavaró karakterek (0/O, 1/I) nélküli kódtár. */
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Véletlen, megosztható esetkód, pl. „K7F2Q”. */
export function randomSeedCode(len = 5): string {
  let s = ''
  for (let i = 0; i < len; i++) {
    s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return s
}

export const SEED_RE = /^[A-Z0-9]{4,8}$/
