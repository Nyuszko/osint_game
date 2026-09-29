import { CaseProvider } from './state/caseContext'
import { useGameStore } from './store/gameStore'
import { StartScreen } from './components/shell/StartScreen'
import { GameLayout } from './components/shell/GameLayout'
import { EndScreen } from './components/end/EndScreen'
import { Toasts } from './components/ui/Toasts'

function Screens() {
  const screen = useGameStore((s) => s.screen)
  return (
    <>
      {screen === 'menu' && <StartScreen />}
      {screen === 'playing' && <GameLayout />}
      {(screen === 'won' || screen === 'lost') && <EndScreen />}
    </>
  )
}

export default function App() {
  return (
    <div className="h-full bg-zinc-950 text-zinc-200 antialiased">
      <CaseProvider>
        <Screens />
      </CaseProvider>
      <Toasts />
    </div>
  )
}
