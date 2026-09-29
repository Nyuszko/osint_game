/**
 * Eset-ellenőrző: minden statikus és generált esetnél ellenőrzi, hogy
 * végigjátszható-e (cílszó: sosem legyen megoldhatatlan akta).
 *
 * Futtatás: npx tsx scripts/verify-case.ts
 */
import { staticCases } from '../src/data/cases'
import { validateCase } from '../src/gen/validate'

let failed = false
for (const c of staticCases) {
  const errs = validateCase(c)
  if (errs.length === 0) {
    console.log(`OK   ${c.code} – ${c.title} (${c.clues.length} nyom, ${c.connections.length} kapcsolat)`)
  } else {
    failed = true
    console.error(`HIBA ${c.code} – ${c.title}:`)
    for (const e of errs) console.error('  - ' + e)
  }
}
process.exit(failed ? 1 : 0)
