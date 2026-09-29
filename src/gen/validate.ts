import type { GameCase, RichText } from '../data/types'

export interface CaseIssues {
  clueId: string
  problem: string
}

function collectRich(rt: RichText, out: { evs: string[]; links: string[] }) {
  for (const seg of rt) {
    if (seg.ev) out.evs.push(seg.ev)
    if (seg.link) out.links.push(seg.link)
  }
}

function deepWalk(obj: unknown, out: { evs: string[]; links: string[] }) {
  if (Array.isArray(obj)) {
    if (obj.length > 0 && obj.every((x) => typeof x === 'object' && x !== null && 'text' in x)) {
      collectRich(obj as RichText, out)
    }
    for (const item of obj) deepWalk(item, out)
  } else if (obj && typeof obj === 'object') {
    for (const v of Object.values(obj as Record<string, unknown>)) deepWalk(v, out)
  }
}

export interface WalkResult {
  evidence: Map<string, Set<string>>
  links: Map<string, Set<string>>
  knownUrls: Set<string>
}

/** Összegyűjti az eset összes nyom- és linkhivatkozását. */
export function walkCase(c: GameCase): WalkResult {
  const evidence = new Map<string, Set<string>>()
  const links = new Map<string, Set<string>>()
  const knownUrls = new Set<string>()

  const addEv = (clueId: string, url: string) => {
    if (!evidence.has(clueId)) evidence.set(clueId, new Set())
    evidence.get(clueId)!.add(url)
  }
  const addLink = (from: string, to: string) => {
    if (!links.has(from)) links.set(from, new Set())
    links.get(from)!.add(to)
  }

  for (const site of c.websites) {
    for (const page of site.pages) {
      knownUrls.add(page.url)
      const out = { evs: [] as string[], links: [] as string[] }
      deepWalk(page, out)
      for (const ev of out.evs) addEv(ev, page.url)
      for (const l of out.links) addLink(page.url, l)
      if (page.kind === 'news') for (const r of page.related ?? []) addLink(page.url, r.url)
    }
  }

  for (const b of c.bookmarks ?? []) addLink(c.homeUrl, b)

  const searchPageUrl = c.websites.find((w) => w.domain === c.searchDomain)?.pages[0]?.url ?? c.homeUrl
  for (const site of c.websites) {
    for (const page of site.pages) {
      if (page.kind === 'webmail' || page.kind === 'search') continue
      addLink(searchPageUrl, page.url)
    }
  }

  return { evidence, links, knownUrls }
}

/**
 * Teljes érvényesség-ellenőrzés: minden hivatkozás létezik, és az eset
 * végigjátszható (minden statikus nyom és következtetés elérhető).
 */
export function validateCase(c: GameCase): string[] {
  const errors: string[] = []
  const clueIds = new Set(c.clues.map((x) => x.id))
  const { evidence, links, knownUrls } = walkCase(c)

  for (const conn of c.connections) {
    if (!clueIds.has(conn.clueA)) errors.push(`${c.code}: ${conn.id}: ismeretlen clueA (${conn.clueA})`)
    if (!clueIds.has(conn.clueB)) errors.push(`${c.code}: ${conn.id}: ismeretlen clueB (${conn.clueB})`)
    if (!clueIds.has(conn.resultClueId)) errors.push(`${c.code}: ${conn.id}: ismeretlen resultClueId`)
  }
  for (const o of c.objectives) {
    for (const id of o.requiredClueIds) {
      if (!clueIds.has(id)) errors.push(`${c.code}: ${o.id}: ismeretlen requiredClue (${id})`)
    }
  }
  for (const q of c.finalQuestions) {
    const corrects = q.options.filter((o) => o.correct)
    if (corrects.length !== 1) errors.push(`${c.code}: ${q.id}: ${corrects.length} helyes válasz (pontosan 1 kell)`)
    for (const o of q.options) {
      if (o.requiresClue && !clueIds.has(o.requiresClue))
        errors.push(`${c.code}: ${q.id}/${o.id}: ismeretlen requiresClue (${o.requiresClue})`)
    }
  }
  for (const clue of c.clues) {
    if (clue.deduction && !c.connections.some((x) => x.resultClueId === clue.id)) {
      errors.push(`${c.code}: ${clue.id}: deduction clue-t senki nem gyártja`)
    }
  }
  if (!knownUrls.has(c.homeUrl)) errors.push(`${c.code}: homeUrl nem található (${c.homeUrl})`)

  // elérhetőség (BFS)
  const reachable = new Set<string>([c.homeUrl])
  const queue = [c.homeUrl]
  while (queue.length > 0) {
    const cur = queue.shift()!
    const out = links.get(cur)
    if (!out) continue
    for (const next of out) {
      if (!reachable.has(next)) {
        reachable.add(next)
        queue.push(next)
      }
    }
  }

  const staticClues = c.clues.filter((x) => !x.deduction)
  for (const clue of staticClues) {
    const pages = evidence.get(clue.id)
    if (!pages || pages.size === 0) {
      errors.push(`${c.code}: ${clue.id}: sehol nem található az oldalakon`)
      continue
    }
    if (![...pages].some((p) => reachable.has(p))) {
      errors.push(`${c.code}: ${clue.id}: csak elérhetetlen oldalon van`)
    }
  }

  const haveClue = new Set(
    staticClues.filter((x) => [...(evidence.get(x.id) ?? [])].some((p) => reachable.has(p))).map((x) => x.id),
  )
  let changed = true
  while (changed) {
    changed = false
    for (const conn of c.connections) {
      if (haveClue.has(conn.resultClueId)) continue
      if (haveClue.has(conn.clueA) && haveClue.has(conn.clueB)) {
        haveClue.add(conn.resultClueId)
        changed = true
      }
    }
  }
  for (const clue of c.clues) {
    if (clue.deduction && !haveClue.has(clue.id)) {
      errors.push(`${c.code}: ${clue.id}: nem vezethető le a játszható nyomokból`)
    }
  }
  for (const q of c.finalQuestions) {
    const correct = q.options.find((o) => o.correct)!
    if (correct.requiresClue && !haveClue.has(correct.requiresClue)) {
      errors.push(`${c.code}: ${q.id}: a helyes válasz zárolása nem oldható fel (${correct.requiresClue})`)
    }
  }

  return errors
}
