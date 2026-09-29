import { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { useCase } from './caseContext'

/** Store-akciók az aktuális esethez kötve – komponensek kényelmi rétege. */
export function useCaseActions() {
  const c = useCase()
  const discover = useGameStore((s) => s.discoverClue)
  const connect = useGameStore((s) => s.makeConnection)
  const submit = useGameStore((s) => s.submit)

  return useMemo(
    () => ({
      discoverClue: (id: string) => discover(id, c),
      makeConnection: (id: string) => connect(id, c),
      submit: () => submit(c),
    }),
    [c, discover, connect, submit],
  )
}
