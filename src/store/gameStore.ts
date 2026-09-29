import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameCase } from '../data/types'

export type Screen = 'menu' | 'playing' | 'won' | 'lost'

export interface Toast {
  id: number
  kind: 'clue' | 'connection' | 'objective' | 'info' | 'error'
  title: string
  text?: string
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
        get().pushToast({ kind: 'objective', title: 'Célkitűzés teljesült', text: title })
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
          set({ screen: 'won', modalOpen: false })
          const o = c.objectives.find((x) => x.id === 'obj_submit')
          if (o) get().completeObjective(o.id, o.title)
        } else {
          const attempts = st.attempts + 1
          set({ attempts })
          if (attempts >= 3) {
            set({ screen: 'lost', modalOpen: false })
          } else {
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
      }),
    },
  ),
)
