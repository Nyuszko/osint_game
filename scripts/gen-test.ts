/**
 * Generátor-tömeges teszt: sok különböző kóddal generál és validál.
 * Futtatás: npx tsx scripts/gen-test.ts [db]
 */
import { generateCase } from '../src/gen/generate'
import { validateCase } from '../src/gen/validate'
import { randomSeedCode } from '../src/gen/rng'

const count = Number(process.argv[2] ?? 30)
let failed = false
const seenVariants = new Map<string, number>()

for (let i = 0; i < count; i++) {
  const code = randomSeedCode()
  const level = i % 2 === 0 ? 2 : 3
  try {
    const c = generateCase(code, { variant: 'random', level })
    const errs = validateCase(c)
    const variant = c.tagline.includes('fejlesztő') ? 'missing' : c.tagline.includes('számlák') ? 'fraud' : 'identity'
    seenVariants.set(variant, (seenVariants.get(variant) ?? 0) + 1)
    if (errs.length > 0) {
      failed = true
      console.error(`HIBA ${code}:`)
      for (const e of errs) console.error('  - ' + e)
    } else {
      console.log(`OK   ${c.code} (${level}) – ${c.title} · ${c.clues.length} nyom · ${c.websites.length} oldal`)
    }
  } catch (e) {
    failed = true
    console.error(`KIVÉTEL ${code}: ${e instanceof Error ? e.message : String(e)}`)
  }
}

console.log(`\nSablon-eloszlás: ${[...seenVariants.entries()].map(([k, v]) => `${k}=${v}`).join(', ')}`)
process.exit(failed ? 1 : 0)
