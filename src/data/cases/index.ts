import type { GameCase } from '../types'
import { case001 } from './case001'
import { case002 } from './case002'

/** Kézzel írott esetek – ide kerül minden új statikus eset. */
export const staticCases: GameCase[] = [case001, case002]

/** Összes elérhető eset: statikus + generált (localStorage). */
export function allCases(custom: Record<string, GameCase> = {}): GameCase[] {
  return [...staticCases, ...Object.values(custom)]
}

export function getCaseById(id: string, custom: Record<string, GameCase> = {}): GameCase | undefined {
  return allCases(custom).find((c) => c.id === id)
}
