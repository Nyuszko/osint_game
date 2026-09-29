import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { GameCase } from '../data/types'
import { getCaseById } from '../data/cases'
import { useGameStore } from '../store/gameStore'

const CaseCtx = createContext<GameCase | null>(null)

/** Mindig renderel; a useCase() csak aktív eset mellett használható. */
export function CaseProvider({ children }: { children: ReactNode }) {
  const caseId = useGameStore((s) => s.caseId)
  const customCases = useGameStore((s) => s.customCases)
  const gameCase = useMemo(() => (caseId ? getCaseById(caseId, customCases) ?? null : null), [caseId, customCases])
  return <CaseCtx.Provider value={gameCase}>{children}</CaseCtx.Provider>
}

export function useCase(): GameCase {
  const c = useContext(CaseCtx)
  if (!c) throw new Error('useCase: nincs aktív eset')
  return c
}
