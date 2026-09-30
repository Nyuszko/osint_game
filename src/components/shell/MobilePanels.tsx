import { useState, type ReactNode } from 'react'
import { FolderSearch, Sparkles, X } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { CasePanel } from '../panels/CasePanel'
import { RightPanel } from '../panels/RightPanel'

type Side = 'case' | 'tools'
type DrawerSide = 'left' | 'right'

/** Mobilon elérhetetlen oldalsávok helyett: úszó gombok + slide-over drawer. */
export function MobilePanels() {
  const [open, setOpen] = useState<Side | null>(null)
  const discovered = useGameStore((s) => s.discovered)

  return (
    <>
      {/* úszó gombok */}
      <div className="fixed right-3 bottom-3 z-40 flex flex-col gap-2 md:hidden">
        <button
          onClick={() => setOpen('case')}
          title="Akta adatai"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-zinc-900/90 text-amber-300 shadow-lg backdrop-blur transition-colors hover:bg-zinc-800"
        >
          <FolderSearch className="size-5" />
        </button>
        <button
          onClick={() => setOpen('tools')}
          title="Nyomok, jegyzet, kapcsolás"
          className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-zinc-900/90 text-violet-300 shadow-lg backdrop-blur transition-colors hover:bg-zinc-800"
        >
          <Sparkles className="size-5" />
          {discovered.length > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-violet-500 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
              {discovered.length}
            </span>
          )}
        </button>
      </div>

      {/* drawerek */}
      {open === 'case' && (
        <Drawer side="left" title="Akta" onClose={() => setOpen(null)}>
          <div className="p-4">
            <CasePanel />
          </div>
        </Drawer>
      )}
      {open === 'tools' && (
        <Drawer side="right" title="Nyomozási eszközök" onClose={() => setOpen(null)}>
          <RightPanel />
        </Drawer>
      )}
    </>
  )
}

function Drawer({
  side,
  title,
  onClose,
  children,
}: {
  side: DrawerSide
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        aria-label="Bezárás"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 cursor-pointer bg-black/60 backdrop-blur-sm"
      />
      <div
        className={`absolute inset-y-0 flex w-[88%] max-w-sm flex-col border-white/10 bg-zinc-950 shadow-2xl ${
          side === 'left' ? 'left-0 border-r animate-slide-in-left' : 'right-0 border-l animate-slide-in-right'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">{title}</span>
          <button
            onClick={onClose}
            title="Bezárás"
            className="cursor-pointer rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="thin-scroll min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
