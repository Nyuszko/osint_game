import { useEffect } from 'react'
import { BrowserBar } from '../browser/BrowserBar'
import { CasePanel } from '../panels/CasePanel'
import { RightPanel } from '../panels/RightPanel'
import { PageRouter } from '../pages/PageRouter'
import { SubmissionModal } from '../end/SubmissionModal'
import { MobilePanels } from './MobilePanels'
import { useCase } from '../../state/caseContext'
import { useGameStore } from '../../store/gameStore'

/** Objektív-figyelő: nyom megtalálásakor ellenőrzi a célkitűzéseket. */
function ObjectiveWatcher() {
  const c = useCase()
  const discovered = useGameStore((s) => s.discovered)
  const completed = useGameStore((s) => s.completedObjectives)
  const complete = useGameStore((s) => s.completeObjective)

  useEffect(() => {
    for (const o of c.objectives) {
      if (o.id === 'obj_submit') continue
      if (o.requiredClueIds.length === 0) continue
      if (!completed.includes(o.id) && o.requiredClueIds.every((id) => discovered.includes(id))) {
        complete(o.id, o.title)
      }
    }
  }, [discovered, completed, c, complete])

  return null
}

export function GameLayout() {
  return (
    <div className="flex h-full flex-col">
      <BrowserBar />
      <div className="flex min-h-0 flex-1">
        <aside className="thin-scroll hidden w-72 shrink-0 overflow-y-auto border-r border-white/5 bg-zinc-950/60 p-4 md:block">
          <CasePanel />
        </aside>
        <main className="thin-scroll bg-grid min-w-0 flex-1 overflow-y-auto">
          <PageRouter />
        </main>
        <aside className="hidden w-80 shrink-0 border-l border-white/5 bg-zinc-950/60 lg:block">
          <RightPanel />
        </aside>
      </div>
      <SubmissionModal />
      <MobilePanels />
      <ObjectiveWatcher />
    </div>
  )
}
