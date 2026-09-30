import { useSettings } from '../store/settingsStore'

/** Web Audio API-val generált hangeffektek – nincs külső fájl, offline is fut. */

export type Sfx = 'clue' | 'connection' | 'objective' | 'hint' | 'win' | 'lose' | 'error'

let ctx: AudioContext | null = null

function ensureCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.05) {
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, c.currentTime + start)
  gain.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(c.currentTime + start)
  osc.stop(c.currentTime + start + dur + 0.05)
}

const MELODIES: Record<Sfx, { f: number; d: number; t?: OscillatorType }[]> = {
  clue: [
    { f: 660, d: 0.12 },
    { f: 880, d: 0.18 },
  ],
  connection: [
    { f: 523, d: 0.1 },
    { f: 659, d: 0.1, t: 'triangle' },
    { f: 784, d: 0.22, t: 'triangle' },
  ],
  objective: [
    { f: 440, d: 0.1 },
    { f: 660, d: 0.2 },
  ],
  hint: [
    { f: 700, d: 0.1, t: 'triangle' },
    { f: 560, d: 0.16, t: 'triangle' },
  ],
  win: [
    { f: 523, d: 0.12 },
    { f: 659, d: 0.12 },
    { f: 784, d: 0.12 },
    { f: 1047, d: 0.3 },
  ],
  lose: [
    { f: 330, d: 0.16, t: 'sawtooth' },
    { f: 262, d: 0.16, t: 'sawtooth' },
    { f: 196, d: 0.32, t: 'sawtooth' },
  ],
  error: [
    { f: 220, d: 0.14, t: 'square' },
    { f: 185, d: 0.2, t: 'square' },
  ],
}

export function sfx(kind: Sfx): void {
  if (!useSettings.getState().sound) return
  const c = ensureCtx()
  if (!c) return
  let t = 0
  for (const note of MELODIES[kind]) {
    tone(c, note.f, t, note.d, note.t)
    t += note.d * 0.8
  }
}
