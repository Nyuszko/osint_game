import type { GameCase } from '../data/types'
import { validateCase } from '../gen/validate'

/** Akták lementése és betöltése JSON fájlként (megosztáshoz, szerkesztéshez). */

export function exportCaseJson(c: GameCase): void {
  const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${c.code.replace(/[^\w-]+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Szöveges JSON-ból GameCase – olvasható hibával dob, ha nem érvényes. */
export function parseCaseJson(text: string): GameCase {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('A fájl nem érvényes JSON.')
  }
  if (!isRecord(data)) throw new Error('A JSON nem egy aktát ír le (objektumot várok).')
  const d = data as Partial<GameCase>
  const missing = (['code', 'title', 'briefing', 'websites', 'clues', 'connections', 'objectives', 'finalQuestions'] as const).filter(
    (k) => d[k] === undefined,
  )
  if (missing.length > 0) throw new Error(`Hiányzó mezők: ${missing.join(', ')}`)
  if (!Array.isArray(d.websites) || d.websites.length === 0) throw new Error('Nincs egy weblap sem az aktában.')
  if (!Array.isArray(d.clues) || d.clues.length === 0) throw new Error('Nincs egy nyom sem az aktában.')

  const c: GameCase = {
    id: typeof d.id === 'string' && d.id ? d.id : `custom-${Date.now().toString(36)}`,
    code: String(d.code),
    title: String(d.title),
    tagline: typeof d.tagline === 'string' ? d.tagline : '',
    briefing: d.briefing as string[],
    difficulty: (typeof d.difficulty === 'number' && d.difficulty >= 1 && d.difficulty <= 5 ? d.difficulty : 3) as GameCase['difficulty'],
    homeUrl: typeof d.homeUrl === 'string' ? d.homeUrl : d.websites[0].pages[0]?.url ?? '',
    searchDomain: typeof d.searchDomain === 'string' ? d.searchDomain : '',
    bookmarks: Array.isArray(d.bookmarks) ? d.bookmarks : [],
    websites: d.websites as GameCase['websites'],
    clues: d.clues as GameCase['clues'],
    connections: d.connections as GameCase['connections'],
    objectives: d.objectives as GameCase['objectives'],
    finalQuestions: d.finalQuestions as GameCase['finalQuestions'],
    solutionRecap: Array.isArray(d.solutionRecap) ? d.solutionRecap : [],
  }

  const errors = validateCase(c)
  if (errors.length > 0) throw new Error('Az akta nem játszható végig:\n' + errors.join('\n'))
  return c
}
