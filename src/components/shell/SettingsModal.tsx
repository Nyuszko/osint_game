import { Settings as SettingsIcon, Volume2, VolumeX, Zap, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useSettings } from '../../store/settingsStore'

function Toggle({
  on,
  onChange,
  icon,
  label,
  hint,
}: {
  on: boolean
  onChange: (v: boolean) => void
  icon: React.ReactNode
  label: string
  hint: string
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-white/5 bg-zinc-900/50 p-3 text-left transition-colors hover:border-white/15"
    >
      <span className="shrink-0 text-zinc-400">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-zinc-200">{label}</span>
        <span className="block text-[11px] text-zinc-500">{hint}</span>
      </span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? 'bg-amber-500' : 'bg-zinc-700'}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${on ? 'left-4.5' : 'left-0.5'}`}
        />
      </span>
    </button>
  )
}

/** Beállítások ablak – hang, animáció, adattörlés. */
export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { sound, reducedMotion, update } = useSettings()
  const [confirming, setConfirming] = useState(false)

  const wipe = () => {
    localStorage.removeItem('casefile-v1')
    localStorage.removeItem('casefile-settings-v1')
    location.reload()
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="panel animate-slide-up w-full max-w-md rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SettingsIcon className="size-5 text-zinc-300" />
            <h2 className="text-lg font-bold text-zinc-50">Beállítások</h2>
          </div>
          <button
            onClick={onClose}
            title="Bezárás"
            className="cursor-pointer rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <Toggle
            on={sound}
            onChange={(v) => update({ sound: v })}
            icon={sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            label="Hangeffektek"
            hint="Generált hangok nyomoknál, győzelemnél és buktánál"
          />
          <Toggle
            on={reducedMotion}
            onChange={(v) => update({ reducedMotion: v })}
            icon={<Zap className="size-4" />}
            label="Animációk csökkentése"
            hint="Mozgó felületek kikapcsolása (a rendszer beállítását is figyelembe vesszük)"
          />
        </div>

        <div className="mt-4 border-t border-white/5 pt-4">
          {confirming ? (
            <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-3">
              <p className="text-xs text-red-300">
                Biztosan? Ez törli az összes nyomozásod, statisztikádat és saját aktádat.
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={wipe}
                  className="cursor-pointer rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-400"
                >
                  Igen, mindent törlöm
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  className="cursor-pointer rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-white/30"
                >
                  Mégse
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-white/5 p-3 text-left text-xs text-zinc-500 transition-colors hover:border-red-400/30 hover:text-red-300"
            >
              <Trash2 className="size-4 shrink-0" />
              Nyomozási haladás törlése
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
