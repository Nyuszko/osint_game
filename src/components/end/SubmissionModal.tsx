import { FileText, Lock, Send, X } from 'lucide-react'
import { useCase } from '../../state/caseContext'
import { useCaseActions } from '../../state/useCaseActions'
import { useGameStore } from '../../store/gameStore'
import { Modal } from '../ui/Modal'

export function SubmissionModal() {
  const c = useCase()
  const open = useGameStore((s) => s.modalOpen)
  const setOpen = useGameStore((s) => s.setModalOpen)
  const answers = useGameStore((s) => s.answers)
  const setAnswer = useGameStore((s) => s.setAnswer)
  const attempts = useGameStore((s) => s.attempts)
  const discovered = useGameStore((s) => s.discovered)
  const { submit } = useCaseActions()

  const allAnswered = c.finalQuestions.every((q) => answers[q.id])
  const attemptsLeft = 3 - attempts

  return (
    <Modal open={open} onClose={() => setOpen(false)} className="max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50">
            <FileText className="size-5 text-amber-400" /> Záró jelentés
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            {c.code} · hátralévő beküldési kísérlet:{' '}
            <span className={attemptsLeft === 1 ? 'font-bold text-red-300' : 'font-bold text-amber-300'}>
              {attemptsLeft}
            </span>
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="cursor-pointer text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {c.finalQuestions.map((q, qi) => (
          <fieldset key={q.id}>
            <legend className="text-sm font-semibold text-zinc-200">
              <span className="mr-2 font-mono text-xs text-amber-400">{qi + 1}.</span>
              {q.prompt}
            </legend>
            <div className="mt-2 space-y-1.5">
              {q.options.map((o) => {
                const locked = !!o.requiresClue && !discovered.includes(o.requiresClue)
                const selected = answers[q.id] === o.id
                if (locked) {
                  return (
                    <div
                      key={o.id}
                      className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-white/5 bg-zinc-950/50 px-3 py-2 text-xs text-zinc-600"
                      title="Ehhez a válaszhoz további nyom(ok) szükségesek"
                    >
                      <Lock className="size-3.5 shrink-0" />
                      Zárolt – további nyom(ok) kellenek hozzá
                    </div>
                  )
                }
                return (
                  <button
                    key={o.id}
                    onClick={() => setAnswer(q.id, o.id)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs leading-relaxed transition-all ${
                      selected
                        ? 'border-amber-400/60 bg-amber-400/10 text-amber-100'
                        : 'border-white/10 bg-zinc-900/50 text-zinc-300 hover:border-white/25'
                    }`}
                  >
                    <span
                      className={`size-3.5 shrink-0 rounded-full border-2 ${
                        selected ? 'border-amber-400 bg-amber-400' : 'border-zinc-600'
                      }`}
                    />
                    {o.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <p className="text-[11px] text-zinc-600">
          {allAnswered ? 'Minden kérdés megválaszolva.' : 'Válaszolj minden kérdésre a beküldéshez.'}
        </p>
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow transition-all hover:bg-amber-400 disabled:cursor-default disabled:opacity-30"
        >
          <Send className="size-4" /> Beküldés
        </button>
      </div>
    </Modal>
  )
}
