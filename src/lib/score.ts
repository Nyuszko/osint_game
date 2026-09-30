/** Pontozás és rang – közösen használva a végső képernyő és a store között. */

export const HINT_COST = 30

export function scoreOf(clueCount: number, connCount: number, attempts: number, hintsUsed = 0): number {
  const raw = 4 * 120 + clueCount * 15 + connCount * 25 - attempts * 40 - hintsUsed * HINT_COST
  return Math.max(0, raw)
}

export function rankOf(score: number): { rank: 'S' | 'A' | 'B' | 'C'; cls: string } {
  if (score >= 620) return { rank: 'S', cls: 'text-amber-300 border-amber-400/50 bg-amber-400/10' }
  if (score >= 520) return { rank: 'A', cls: 'text-emerald-300 border-emerald-400/50 bg-emerald-400/10' }
  if (score >= 400) return { rank: 'B', cls: 'text-sky-300 border-sky-400/50 bg-sky-400/10' }
  return { rank: 'C', cls: 'text-zinc-300 border-zinc-500/50 bg-zinc-500/10' }
}
