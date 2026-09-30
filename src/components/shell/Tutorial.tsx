import { useState } from 'react'
import { ArrowRight, Link2, MousePointerClick, Search, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useSettings } from '../../store/settingsStore'

interface Step {
  icon: LucideIcon
  title: string
  text: string
}

const STEPS: Step[] = [
  {
    icon: Search,
    title: '1/4 · Kutass a fiktív neten',
    text: 'A játékban egy hamis internetet túrsz át. Írj a böngésző címsorába (pl. „korosnivel.forum”), vagy használj keresést és könyvjelzőket. A folytatás a localStorage-odba mentődik.',
  },
  {
    icon: MousePointerClick,
    title: '2/4 · Kattints a nyomokra',
    text: 'Az oldalakon a kiemelt, aláhúzott szövegrészekre kattintva nyomokat fedezel fel. A nyomok a jobb oldali panelban gyűlnek össze – és a célkitűzések automatikusan teljesülnek.',
  },
  {
    icon: Link2,
    title: '3/4 · Kösd össze a darabokat',
    text: 'Két megtalált nyomot a „Kapcsolás” fülön párosíthatsz. A helyes párosok következtetést adnak – elakadás esetén pedig kérhetsz tippet is (pontlevonással).',
  },
  {
    icon: FileText,
    title: '4/4 · Add be a jelentést',
    text: 'Ha szerinted megvan a kép, add be a záró jelentést: 4 kérdés, de a helyes válaszok csak a megtalált nyomokkal nyílnak fel. 3 hibás beküldés = bukta. Sok sikert, nyomozó!',
  },
]

/** Első indításkor mutatkozó rövid bemutató. */
export function Tutorial() {
  const tutorialDone = useSettings((s) => s.tutorialDone)
  const update = useSettings((s) => s.update)
  const [step, setStep] = useState(0)

  if (tutorialDone) return null
  const s = STEPS[step]
  const Icon = s.icon

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="panel animate-slide-up w-full max-w-md rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-amber-400/10">
            <Icon className="size-6 text-amber-400" />
          </span>
          <h2 className="text-lg font-bold text-zinc-50">{s.title}</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.text}</p>
        <div className="mt-4 flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={`size-1.5 rounded-full ${i === step ? 'bg-amber-400' : 'bg-zinc-700'}`} />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => update({ tutorialDone: true })}
            className="cursor-pointer text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            kihagyom
          </button>
          <button
            onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : update({ tutorialDone: true }))}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-zinc-950 shadow transition-colors hover:bg-amber-400"
          >
            {step < STEPS.length - 1 ? 'Tovább' : 'Kezdem a nyomozást'} <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
