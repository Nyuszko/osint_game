import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameCase } from '../data/types'
import { scoreOf, rankOf } from '../lib/score'
import { dailyCode, todayKey } from '../lib/daily'
import { sfx } from '../lib/sfx'

export type Screen = 'menu' | 'playing' | 'won' | 'lost'

export interface Toast {
  id: number
  kind: 'clue' | 'connection' | 'objective' | 'info' | 'error'
  title: string
  text?: string
}

/** Egy lezárt (megoldott vagy bukta) nyomozás eredménye. */
export interface CaseRecord {
  code: string
  title: string
  won: boolean
  score: number
  rank: string
  minutes: number
  clues: number
  clueTotal: number
  conns: number
  connTotal: number
  hints: number
  attempts: number
  at: number
}

interface GameStore {
  // ---- perzisztált állapot ----
  screen: Screen
  caseId: string | null
  history: string[]
  hIndex: number
  discovered: string[]
  connections: string[]
  completedObjectives: string[]
  notes: string
  attempts: number
  answers: Record<string, string>
  startedAt: number | null
  customCases: Record<string, GameCase>
  /** Tippelt (de még fel nem fedezett) nyomok id-i az aktuális aktában. */
  hints: string[]
  /** Lezárt nyomozások eredményei – statisztikához. */
  records: CaseRecord[]
  /** Napi akták állapota: dátumkulcs → kimenetel. */
  dailyDone: Record<string, 'won' | 'lost'>

  // ---- efemer állapot ----
  toasts: Toast[]
  modalOpen: boolean

  // ---- akciók ----
  startCase: (c: GameCase) => void
  resumeCase: () => void
  restartCase: (c: GameCase) => void
  backToMenu: () => void
  navigate: (url: string) => void
  back: () => void
  forward: () => void
  discoverClue: (clueId: string, c: GameCase) => void
  makeConnection: (connId: string, c: GameCase) => void
  completeObjective: (id: string, title: string) => void
  useHint: (c: GameCase) => void
  setNotes: (v: string) => void
  setAnswer: (qid: string, oid: string) => void
  setModalOpen: (v: boolean) => void
  submit: (c: GameCase) => void
  addCustomCase: (c: GameCase) => void
  removeCustomCase: (id: string) => void
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: number) => void
}

const toastId = () => Date.now() + Math.random()

const MAX_RECORDS = 200

/** Rekord + napi állapot frissítése a nyomozás lezárásakor. */
function withRecord(
  c: GameCase,
  won: boolean,
  st: Pick<GameStore, 'discovered' | 'connections' | 'attempts' | 'hints' | 'startedAt' | 'records' | 'dailyDone'>,
): Pick<GameStore, 'records' | 'dailyDone'> {
  const minutes = st.startedAt ? Math.max(1, Math.round((Date.now() - st.startedAt) / 60000)) : 0
  const score = won ? scoreOf(st.discovered.length, st.connections.length, st.attempts, st.hints.length) : 0
  const rec: CaseRecord = {
    code: c.code,
    title: c.title,
    won,
    score,
    rank: won ? rankOf(score).rank : '–',
    minutes,
    clues: st.discovered.length,
    clueTotal: c.clues.length,
    conns: st.connections.length,
    connTotal: c.connections.length,
    hints: st.hints.length,
    attempts: st.attempts,
    at: Date.now(),
  }
  const dailyDone = { ...st.dailyDone }
  if (c.id === `gen-${dailyCode()}`) dailyDone[todayKey()] = won ? 'won' : 'lost'
  return { records: [...st.records, rec].slice(-MAX_RECORDS), dailyDone }
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: 'menu',
      caseId: null,
      history: [],
      hIndex: 0,
      discovered: [],
      connections: [],
      completedObjectives: [],
      notes: '',
      attempts: 0,
      answers: {},
      startedAt: null,
      customCases: {},
      hints: [],
      records: [],
      dailyDone: {},

      toasts: [],
      modalOpen: false,

      startCase: (c) =>
        set({
          screen: 'playing',
          caseId: c.id,
          history: [c.homeUrl],
          hIndex: 0,
          discovered: [],
          connections: [],
          completedObjectives: [],
          notes: '',
          attempts: 0,
          answers: {},
          startedAt: Date.now(),
          hints: [],
          modalOpen: false,
          toasts: [],
        }),

      resumeCase: () => {
        if (get().caseId) set({ screen: 'playing', modalOpen: false })
      },

      restartCase: (c) => get().startCase(c),

      backToMenu: () => set({ screen: 'menu', modalOpen: false }),

      navigate: (url) => {
        const st = get()
        const u = url.trim()
        if (!u) return
        if (st.history[st.hIndex] === u) return
        let hist = [...st.history.slice(0, st.hIndex + 1), u]
        let idx = hist.length - 1
        if (hist.length > 60) {
          hist = hist.slice(hist.length - 60)
          idx = hist.length - 1
        }
        set({ history: hist, hIndex: idx })
      },

      back: () => {
        const { hIndex } = get()
        if (hIndex > 0) set({ hIndex: hIndex - 1 })
      },

      forward: () => {
        const { hIndex, history } = get()
        if (hIndex < history.length - 1) set({ hIndex: hIndex + 1 })
      },

      discoverClue: (clueId, c) => {
        const st = get()
        if (st.caseId !== c.id) return
        if (st.discovered.includes(clueId)) return
        const clue = c.clues.find((x) => x.id === clueId)
        if (!clue) return
        set({ discovered: [...st.discovered, clueId] })
        sfx('clue')
        get().pushToast({
          kind: 'clue',
          title: clue.deduction ? 'Új következtetés!' : 'Új nyom!',
          text: clue.title,
        })
      },

      makeConnection: (connId, c) => {
        const st = get()
        if (st.caseId !== c.id) return
        if (st.connections.includes(connId)) return
        const conn = c.connections.find((x) => x.id === connId)
        if (!conn) return
        if (!st.discovered.includes(conn.clueA) || !st.discovered.includes(conn.clueB)) return
        set({ connections: [...st.connections, connId] })
        sfx('connection')
        get().pushToast({ kind: 'connection', title: 'Összefüggés felfedezve!', text: conn.insight })
        const clue = c.clues.find((x) => x.id === conn.resultClueId)
        if (clue && !get().discovered.includes(clue.id)) {
          set({ discovered: [...get().discovered, clue.id] })
          get().pushToast({
            kind: 'clue',
            title: 'Új következtetés!',
            text: clue.title,
          })
        }
      },

      completeObjective: (id, title) => {
        const st = get()
        if (st.completedObjectives.includes(id)) return
        set({ completedObjectives: [...st.completedObjectives, id] })
        sfx('objective')
        get().pushToast({ kind: 'objective', title: 'Célkitűzés teljesült', text: title })
      },

      useHint: (c) => {
        const st = get()
        if (st.caseId !== c.id) return
        const candidates = c.clues.filter(
          (x) => !x.deduction && !st.discovered.includes(x.id) && !st.hints.includes(x.id),
        )
        if (candidates.length === 0) {
          get().pushToast({ kind: 'info', title: 'Nincs kérhető tipp', text: 'Minden közvetlen nyomot felfedeztél.' })
          return
        }
        const clue = candidates[0]
        set({ hints: [...st.hints, clue.id] })
        sfx('hint')
        get().pushToast({
          kind: 'info',
          title: 'Tipp a központból',
          text: `A(z) „${clue.title}” nyomot itt érdemes keresned: ${clue.source}`,
        })
      },

      setNotes: (v) => set({ notes: v }),

      setAnswer: (qid, oid) => set({ answers: { ...get().answers, [qid]: oid } }),

      setModalOpen: (v) => set({ modalOpen: v }),

      submit: (c) => {
        const st = get()
        const correct = c.finalQuestions.filter((q) => {
          const opt = q.options.find((o) => o.id === st.answers[q.id])
          return opt?.correct
        }).length
        if (correct === c.finalQuestions.length) {
          set({ screen: 'won', modalOpen: false, ...withRecord(c, true, get()) })
          sfx('win')
          const o = c.objectives.find((x) => x.id === 'obj_submit')
          if (o) get().completeObjective(o.id, o.title)
        } else {
          const attempts = st.attempts + 1
          set({ attempts })
          if (attempts >= 3) {
            set({ screen: 'lost', modalOpen: false, ...withRecord(c, false, get()) })
            sfx('lose')
          } else {
            sfx('error')
            get().pushToast({
              kind: 'error',
              title: `Hibás beküldés (${correct}/${c.finalQuestions.length} helyes)`,
              text: `Maradt még ${3 - attempts} kísérlet. Nézd át újra a nyomokat!`,
            })
          }
        }
      },

      addCustomCase: (c) => set({ customCases: { ...get().customCases, [c.id]: c } }),

      removeCustomCase: (id) => {
        const next = { ...get().customCases }
        delete next[id]
        set({ customCases: next })
        if (get().caseId === id) {
          set({ screen: 'menu', caseId: null })
        }
      },

      pushToast: (t) => set({ toasts: [...get().toasts, { ...t, id: toastId() }] }),

      dismissToast: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
    }),
    {
      name: 'casefile-v1',
      partialize: (s) => ({
        screen: s.screen,
        caseId: s.caseId,
        history: s.history,
        hIndex: s.hIndex,
        discovered: s.discovered,
        connections: s.connections,
        completedObjectives: s.completedObjectives,
        notes: s.notes,
        attempts: s.attempts,
        answers: s.answers,
        startedAt: s.startedAt,
        customCases: s.customCases,
        hints: s.hints,
        records: s.records,
        dailyDone: s.dailyDone,
      }),
    },
  ),
)
