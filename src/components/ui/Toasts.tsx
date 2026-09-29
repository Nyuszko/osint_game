import { useEffect } from 'react'
import { AlertTriangle, CheckCircle2, Info, Link2, Search, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import type { Toast } from '../../store/gameStore'

const ICONS: Record<Toast['kind'], { icon: LucideIcon; cls: string }> = {
  clue: { icon: Search, cls: 'text-amber-300' },
  connection: { icon: Link2, cls: 'text-violet-300' },
  objective: { icon: CheckCircle2, cls: 'text-emerald-300' },
  info: { icon: Info, cls: 'text-cyan-300' },
  error: { icon: AlertTriangle, cls: 'text-red-300' },
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useGameStore((s) => s.dismissToast)
  const { icon: Icon, cls } = ICONS[toast.kind]

  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), 5600)
    return () => clearTimeout(t)
  }, [toast.id, dismiss])

  return (
    <div className="panel animate-slide-in-right pointer-events-auto flex w-80 items-start gap-3 rounded-lg px-4 py-3 shadow-lg shadow-black/50">
      <Icon className={`mt-0.5 size-5 shrink-0 ${cls}`} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-zinc-100">{toast.title}</div>
        {toast.text && <div className="mt-0.5 text-xs leading-relaxed text-zinc-400">{toast.text}</div>}
      </div>
      <button
        onClick={() => dismiss(toast.id)}
        className="cursor-pointer text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}

export function Toasts() {
  const toasts = useGameStore((s) => s.toasts)
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[70] space-y-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
