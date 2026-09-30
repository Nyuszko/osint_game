// ---- Rich text (szöveg + kattintható nyomok + belső linkek) ----

export interface RichSeg {
  text: string
  /** clue id – kattintható bizonyíték */
  ev?: string
  /** belső url – kattintható link a hamis interneten */
  link?: string
  strong?: boolean
  mono?: boolean
}

export type RichText = RichSeg[]

/** Sima szöveg szegmens */
export const T = (text: string): RichSeg => ({ text })

/** Félkövér szegmens */
export const B = (text: string): RichSeg => ({ text, strong: true })

/** Kattintható bizonyíték (nyom) szegmens */
export const E = (clueId: string, text: string): RichSeg => ({ text, ev: clueId })

/** Kattintható belső link szegmens */
export const L = (text: string, url: string): RichSeg => ({ text, link: url })

/** Segédfüggvény sima stringekhez */
export const RT = (...segs: (RichSeg | string)[]): RichText =>
  segs.map((s) => (typeof s === 'string' ? { text: s } : s))

// ---- Fotók (mind determinisztikusan generált SVG) ----

export type PhotoKind =
  | 'landscape'
  | 'lake'
  | 'cabin'
  | 'city'
  | 'portrait'
  | 'night'
  | 'train'
  | 'abstract'
  | 'office'

export interface PhotoData {
  id: string
  kind: PhotoKind
  caption?: RichText
  geotag?: { label: string; clue?: string }
  comments?: { author: string; body: RichText }[]
}

// ---- Tartalom-típusok ----

export interface PostData {
  id: string
  author: string
  handle: string
  time: string
  body: RichText
  likes?: number
  photo?: PhotoData
  replyTo?: { handle: string; body: RichText }
}

export interface RepoData {
  name: string
  desc: RichText
  lang: string
  stars: number
  updated: string
  archived?: boolean
}

export interface ForumPost {
  author: string
  handle: string
  time: string
  body: RichText
  op?: boolean
}

export interface ForumThread {
  id: string
  title: string
  replies: number
  pinned?: boolean
  posts: ForumPost[]
}

export interface EmailData {
  id: string
  from: string
  fromEmail: string
  subject: string
  date: string
  body: RichText
  attachment?: { name: string; clue?: string }
  unread?: boolean
  phishing?: boolean
}

export interface ChatMsg {
  id: string
  /** 'me' = a megfigyelt fiók tulajdonosa, 'them' = a partner */
  from: 'me' | 'them'
  author: string
  time: string
  body: RichText
}

export interface MapPin {
  id: string
  x: number // 0–100 %
  y: number // 0–100 %
  label: string
  kind: 'office' | 'home' | 'cabin' | 'station' | 'poi'
  info: RichText
}

export interface ProjectData {
  name: string
  tagline: string
  desc: RichText
  status: string
}

// ---- Oldalak ----

interface PageBase {
  url: string
  title: string
  siteName: string
}

export interface SearchPageData extends PageBase {
  kind: 'search'
}

export interface ProfilePageData extends PageBase {
  kind: 'profile'
  variant: 'dev' | 'social'
  displayName: string
  handle: string
  avatarSeed: string
  bio: RichText
  meta: { label: string; value: RichText }[]
  posts?: PostData[]
  repos?: RepoData[]
}

export interface ForumPageData extends PageBase {
  kind: 'forum'
  boardName: string
  threads: ForumThread[]
}

export interface WebmailPageData extends PageBase {
  kind: 'webmail'
  account: string
  emails: EmailData[]
}

export interface ChatPageData extends PageBase {
  kind: 'chat'
  account: string
  partner: string
  partnerHandle: string
  messages: ChatMsg[]
}

export interface GalleryPageData extends PageBase {
  kind: 'gallery'
  owner: string
  album: string
  photos: PhotoData[]
}

export interface NewsPageData extends PageBase {
  kind: 'news'
  headline: string
  lead: string
  author: string
  date: string
  body: RichText[]
  related?: { label: string; url: string }[]
}

export interface CompanyPageData extends PageBase {
  kind: 'company'
  hero: string
  about: RichText[]
  projects: ProjectData[]
  contact: string
}

export interface BlogPageData extends PageBase {
  kind: 'blog'
  owner: string
  posts: { id: string; title: string; date: string; body: RichText[] }[]
}

export interface MapPageData extends PageBase {
  kind: 'map'
  region: string
  pins: MapPin[]
}

export type PageData =
  | SearchPageData
  | ProfilePageData
  | ForumPageData
  | WebmailPageData
  | ChatPageData
  | GalleryPageData
  | NewsPageData
  | CompanyPageData
  | BlogPageData
  | MapPageData

// ---- Weboldalak ----

export interface Website {
  domain: string
  name: string
  icon: string // ikon-kulcs, ld. components/pages/SiteIcon
  accent: string // tailwind szín-osztály tag
  pages: PageData[]
}

// ---- Nyomok, kapcsolatok, célkitűzések ----

export type ClueCategory = 'szemely' | 'hely' | 'munka' | 'kapcsolat' | 'indok' | 'egyeb'

export interface Clue {
  id: string
  title: string
  description: string
  source: string
  category: ClueCategory
  /** Csak következtetés útján szerezhető (párosítás eredménye) */
  deduction?: boolean
}

export interface Connection {
  id: string
  clueA: string
  clueB: string
  resultClueId: string
  insight: string
}

export interface Objective {
  id: string
  title: string
  requiredClueIds: string[]
}

export interface FinalOption {
  id: string
  label: string
  correct?: boolean
  /** Csak akkor elérhető, ha ez a nyom megvan */
  requiresClue?: string
}

export interface FinalQuestion {
  id: string
  prompt: string
  options: FinalOption[]
}

// ---- Az eset ----

export interface GameCase {
  id: string
  code: string
  title: string
  tagline: string
  briefing: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  homeUrl: string
  searchDomain: string
  /** Kezdő könyvjelzők (pl. az áldozat fiókjai) – url-ek. */
  bookmarks: string[]
  websites: Website[]
  clues: Clue[]
  connections: Connection[]
  objectives: Objective[]
  finalQuestions: FinalQuestion[]
  solutionRecap: string[]
}
