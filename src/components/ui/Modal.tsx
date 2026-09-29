import type { ReactNode } from 'react'

export function Modal({
  open,
  onClose,
  children,
  className = 'max-w-lg',
}: {
  open: boolean
  onClose?: () => void
  children: ReactNode
  className?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`panel animate-slide-up thin-scroll relative max-h-[88vh] w-full overflow-y-auto rounded-xl p-6 shadow-2xl shadow-black/60 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
