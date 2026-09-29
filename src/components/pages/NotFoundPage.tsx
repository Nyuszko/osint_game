import { SearchX } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { useCase } from '../../state/caseContext'

export function NotFoundPage({ url }: { url: string }) {
  const navigate = useGameStore((s) => s.navigate)
  const c = useCase()
  return (
    <div className="animate-fade-in flex min-h-[60vh] flex-col items-center justify-center text-center">
      <SearchX className="size-14 text-zinc-700" />
      <h1 className="mt-4 text-xl font-semibold text-zinc-300">Ez a cím nem elérhető</h1>
      <p className="mt-1 font-mono text-sm text-zinc-600">DNS-hiba · {url}</p>
      <p className="mt-3 max-w-sm text-sm text-zinc-500">
        Nincs ilyen oldal a fiktív neten. Próbáld meg a{' '}
        <button
          onClick={() => navigate(c.homeUrl)}
          className="cursor-pointer text-cyan-300 underline decoration-dotted underline-offset-2 hover:text-cyan-200"
        >
          Spotlight keresőt
        </button>
        .
      </p>
    </div>
  )
}
