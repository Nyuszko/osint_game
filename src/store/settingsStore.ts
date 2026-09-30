import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Settings {
  /** Hangeffektek bekapcsolva. */
  sound: boolean
  /** Animációk csökkentése. */
  reducedMotion: boolean
  /** Az első indítás bemutatója lejátszva. */
  tutorialDone: boolean
}

interface SettingsStore extends Settings {
  update: (s: Partial<Settings>) => void
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      sound: true,
      reducedMotion: false,
      tutorialDone: false,
      update: (s) => set(s),
    }),
    { name: 'casefile-settings-v1' },
  ),
)
