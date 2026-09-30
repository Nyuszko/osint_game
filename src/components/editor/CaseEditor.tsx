import { useMemo, useState } from 'react'
import { Save, TriangleAlert, X } from 'lucide-react'
import type { FinalQuestion, GameCase } from '../../data/types'
import { validateCase } from '../../gen/validate'

const inputCls =
  'w-full rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">{title}</h3>
      {children}
    </section>
  )
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] text-zinc-500">{label}</span>
      {children}
    </label>
  )
}

/** Akta-műhely: meglévő akta szövegeinek átszerkesztése saját aktaként. */
export function CaseEditor({
  template,
  onSave,
  onClose,
}: {
  template: GameCase
  onSave: (c: GameCase) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<GameCase>(() => ({
    ...template,
    id: `custom-${Date.now().toString(36)}`,
    code: template.code.startsWith('CASE-') ? 'SZAJT-01' : template.code,
  }))
  const [errors, setErrors] = useState<string[] | null>(null)

  const set = <K extends keyof GameCase>(key: K, value: GameCase[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const setClue = (i: number, field: 'title' | 'description', value: string) =>
    setDraft((d) => {
      const clues = [...d.clues]
      clues[i] = { ...clues[i], [field]: value }
      return { ...d, clues }
    })

  const setInsight = (i: number, value: string) =>
    setDraft((d) => {
      const connections = [...d.connections]
      connections[i] = { ...connections[i], insight: value }
      return { ...d, connections }
    })

  const setObjective = (i: number, value: string) =>
    setDraft((d) => {
      const objectives = [...d.objectives]
      objectives[i] = { ...objectives[i], title: value }
      return { ...d, objectives }
    })

  const setQuestion = (i: number, patch: Partial<FinalQuestion>) =>
    setDraft((d) => {
      const finalQuestions = [...d.finalQuestions]
      finalQuestions[i] = { ...finalQuestions[i], ...patch }
      return { ...d, finalQuestions }
    })

  const setOption = (qi: number, oi: number, value: string) =>
    setDraft((d) => {
      const finalQuestions = [...d.finalQuestions]
      const q = finalQuestions[qi]
      const options = [...q.options]
      options[oi] = { ...options[oi], label: value }
      finalQuestions[qi] = { ...q, options }
      return { ...d, finalQuestions }
    })

  const setCorrect = (qi: number, oi: number) =>
    setDraft((d) => {
      const finalQuestions = [...d.finalQuestions]
      const q = finalQuestions[qi]
      const prev = q.options.find((o) => o.correct)
      const options = q.options.map((o, j) => ({
        ...o,
        correct: j === oi,
        requiresClue: j === oi ? prev?.requiresClue : undefined,
      }))
      finalQuestions[qi] = { ...q, options }
      return { ...d, finalQuestions }
    })

  const clueTitle = useMemo(() => new Map(draft.clues.map((c) => [c.id, c.title])), [draft.clues])

  const save = () => {
    const errs = validateCase(draft)
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    onSave(draft)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-3">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-amber-400 uppercase">Akta-műhely</h2>
          <p className="text-[11px] text-zinc-600">
            Sablon: {template.code} · {template.title} – az oldalak és nyom-elhelyezés változatlan, a szövegeket
            szerkesztheted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 transition-colors hover:bg-amber-400"
          >
            <Save className="size-4" /> Mentés
          </button>
          <button
            onClick={onClose}
            title="Bezárás mentés nélkül"
            className="cursor-pointer rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {errors && (
        <div className="mx-5 mt-3 flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <div>
            <div className="font-semibold">Az akta így nem menthető:</div>
            <ul className="mt-1 list-inside list-disc space-y-0.5 font-mono text-[10px]">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="thin-scroll flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <Section title="Alapok">
          <div className="grid gap-2 sm:grid-cols-3">
            <Labeled label="Aktakód">
              <input value={draft.code} onChange={(e) => set('code', e.target.value)} className={inputCls} />
            </Labeled>
            <Labeled label="Cím">
              <input value={draft.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
            </Labeled>
            <Labeled label="Nehézség (1–5)">
              <select
                value={draft.difficulty}
                onChange={(e) => set('difficulty', Number(e.target.value) as GameCase['difficulty'])}
                className={`${inputCls} cursor-pointer`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Labeled>
          </div>
          <Labeled label="Alcím">
            <input value={draft.tagline} onChange={(e) => set('tagline', e.target.value)} className={inputCls} />
          </Labeled>
          <Labeled label="Rövidítés (soronként egy bekezdés)">
            <textarea
              value={draft.briefing.join('\n')}
              onChange={(e) => set('briefing', e.target.value.split('\n'))}
              rows={4}
              className={`${inputCls} resize-y font-mono`}
            />
          </Labeled>
        </Section>

        <Section title="Nyomok">
          <div className="space-y-2">
            {draft.clues.map((clue, i) => (
              <div
                key={clue.id}
                className={`rounded-lg border p-2.5 ${
                  clue.deduction ? 'border-violet-400/20 bg-violet-400/5' : 'border-white/5 bg-zinc-900/40'
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-zinc-600">{clue.id}</span>
                  {clue.deduction && (
                    <span className="rounded-full bg-violet-400/15 px-1.5 py-0.5 text-[9px] text-violet-300">
                      következtetés
                    </span>
                  )}
                </div>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  <input
                    value={clue.title}
                    onChange={(e) => setClue(i, 'title', e.target.value)}
                    placeholder="cím"
                    className={inputCls}
                  />
                  <input
                    value={clue.description}
                    onChange={(e) => setClue(i, 'description', e.target.value)}
                    placeholder="leírás"
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Összefüggések">
          <div className="space-y-2">
            {draft.connections.map((conn, i) => (
              <div key={conn.id} className="rounded-lg border border-white/5 bg-zinc-900/40 p-2.5">
                <div className="mb-1 font-mono text-[10px] text-zinc-600">
                  {clueTitle.get(conn.clueA)} + {clueTitle.get(conn.clueB)} → {clueTitle.get(conn.resultClueId)}
                </div>
                <input
                  value={conn.insight}
                  onChange={(e) => setInsight(i, e.target.value)}
                  placeholder="felismerés szövege"
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Célkitűzések">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {draft.objectives.map((obj, i) => (
              <input
                key={obj.id}
                value={obj.title}
                onChange={(e) => setObjective(i, e.target.value)}
                className={inputCls}
              />
            ))}
          </div>
        </Section>

        <Section title="Záró jelentés kérdései">
          <div className="space-y-3">
            {draft.finalQuestions.map((q, qi) => (
              <div key={q.id} className="rounded-lg border border-white/5 bg-zinc-900/40 p-3">
                <input
                  value={q.prompt}
                  onChange={(e) => setQuestion(qi, { prompt: e.target.value })}
                  placeholder="kérdés"
                  className={inputCls}
                />
                <div className="mt-2 space-y-1.5">
                  {q.options.map((o, oi) => (
                    <div key={o.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={!!o.correct}
                        onChange={() => setCorrect(qi, oi)}
                        title="Ez a helyes válasz"
                        className="size-3.5 shrink-0 cursor-pointer accent-emerald-400"
                      />
                      <input
                        value={o.label}
                        onChange={(e) => setOption(qi, oi, e.target.value)}
                        className={inputCls}
                      />
                      {o.requiresClue && (
                        <span className="shrink-0 rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[9px] text-amber-300">
                          zárolt
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Megoldás összefoglaló (soroként egy bekezdés)">
          <textarea
            value={draft.solutionRecap.join('\n')}
            onChange={(e) => set('solutionRecap', e.target.value.split('\n'))}
            rows={5}
            className={`${inputCls} resize-y font-mono`}
          />
        </Section>
      </div>
    </div>
  )
}
