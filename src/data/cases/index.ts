import type { GameCase } from '../types'
import { case001 } from './case001'

/** Kézzel írott esetek – ide kerül minden új statikus eset. */
export const staticCases: GameCase[] = [case001]

/** Összes elérhető eset: statikus + generált (localStorage). */
export function allCases(custom: Record<string, GameCase> = {}): GameCase[] {
  return [...staticCases, ...Object.values(custom)]
}

export function getCaseById(id: string, custom: Record<string, GameCase> = {}): GameCase | undefined {
  return allCases(custom).find((c) => c.id === id)
}
