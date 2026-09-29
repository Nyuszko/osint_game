/**
 * Játékmenet-szimuláció a store-on: győzelem- és bukta-útvonal.
 * Futtatás: npx tsx scripts/sim-play.ts
 */
import { case001 } from '../src/data/cases/case001'
import { useGameStore } from '../src/store/gameStore'

let failed = false
const check = (cond: boolean, msg: string) => {
  if (cond) console.log('OK  ' + msg)
  else {
    failed = true
    console.error('HIBA ' + msg)
  }
}

const s = useGameStore

// ---- Győzelem-útvonal ----
s.getState().startCase(case001)
check(s.getState().screen === 'playing', 'eset elindult')

for (const clue of case001.clues.filter((x) => !x.deduction)) {
  s.getState().discoverClue(clue.id, case001)
}
check(s.getState().discovered.length === case001.clues.filter((x) => !x.deduction).length, 'összes statikus nyom felfedezve')

for (const conn of case001.connections) {
  s.getState().makeConnection(conn.id, case001)
}
check(s.getState().connections.length === case001.connections.length, 'összes kapcsolat megvan')
const dedIds = case001.clues.filter((x) => x.deduction).map((x) => x.id)
check(dedIds.every((id) => s.getState().discovered.includes(id)), 'minden következtetés levezetve')

// objektív-ellenőrzés (mint a watcher)
for (const o of case001.objectives) {
  if (o.id === 'obj_submit') continue
  if (o.requiredClueIds.every((id) => s.getState().discovered.includes(id))) {
    s.getState().completeObjective(o.id, o.title)
  }
}
check(s.getState().completedObjectives.length === case001.objectives.length - 1, '5/6 célkitűzés kész a beküldés előtt')

for (const q of case001.finalQuestions) {
  const correct = q.options.find((o) => o.correct)!
  s.getState().setAnswer(q.id, correct.id)
}
s.getState().submit(case001)
check(s.getState().screen === 'won', 'helyes válaszokkal győzelem')

// ---- Bukta-útvonal ----
s.getState().restartCase(case001)
check(s.getState().discovered.length === 0 && s.getState().screen === 'playing', 'újrakezdés töröl')
check(s.getState().history[0] === case001.homeUrl, 'újrakezdés után kezdőoldal')

// zárolt válasz nem adható le sikeresen: hibás beküldések
const wrong = case001.finalQuestions[0]
const wrongOpt = wrong.options.find((o) => !o.correct)!
s.getState().setAnswer(wrong.id, wrongOpt.id)
for (const q of case001.finalQuestions.slice(1)) {
  const opt = q.options.find((o) => !o.correct)!
  s.getState().setAnswer(q.id, opt.id)
}
s.getState().submit(case001)
s.getState().submit(case001)
check(s.getState().screen === 'playing' && s.getState().attempts === 2, '2 hibás után még játékban')
s.getState().submit(case001)
check(s.getState().screen === 'lost', '3 hibás után bukta')

// ---- Navigáció ----
s.getState().startCase(case001)
s.getState().navigate('a.dev')
s.getState().navigate('b.dev')
s.getState().back()
check(s.getState().history[s.getState().hIndex] === 'a.dev', 'vissza-navigáció')
s.getState().forward()
check(s.getState().history[s.getState().hIndex] === 'b.dev', 'előre-navigáció')
s.getState().navigate('c.dev')
check(s.getState().history.length === 4 && s.getState().history[3] === 'c.dev', 'új navigáció a végére fűz')

process.exit(failed ? 1 : 0)
