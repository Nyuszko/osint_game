// ============================================================
// „Végtelen akták” generátor
// Determinisztikus: ugyanaz a kód (pl. K7F2Q) mindig ugyanazt az
// esetet adja. Minden név, cég és helyszín KITALÁLT.
// ============================================================

import type {
  ChatMsg,
  Clue,
  Connection,
  EmailData,
  FinalQuestion,
  ForumThread,
  GameCase,
  Objective,
  PhotoData,
  PostData,
  RepoData,
  RichSeg,
} from '../data/types'
import { B, E, L, RT, T } from '../data/rich'
import { Rng, SEED_RE } from './rng'
import { validateCase } from './validate'
import {
  COMPANIES,
  FIRST_NAMES,
  FORUM_HANDLES,
  HELIOS_LIKE,
  HR_FIRST,
  HR_LAST,
  LAKES,
  LAST_NAMES,
  NEWS_AUTHORS,
  OUTLETS,
  PHISH_FROMS,
  PROJECTS,
  PROJECT_TAGLINES,
  SPOTS,
  VILLAGES,
} from './pools'

export type CaseVariant = 'missing' | 'fraud' | 'identity' | 'bec'

function lo(s: string): string {
  return s.toLowerCase()
}

function outletSlug(name: string): string {
  return lo(name).replace(/[^a-z]+/g, '')
}

// ------------------------------------------------------------
// Nevek és alapadatok
// ------------------------------------------------------------

interface Names {
  victim: { first: string; last: string; full: string; social: string; forum: string; mail: string }
  company: { name: string; domain: string; street: string }
  project: { name: string; tagline: string }
  pm: { full: string; handle: string }
  contact: { first: string; last: string; outlet: string; outletDesc: string; email: string }
  relative: { first: string; relation: string; email: string }
  hr: { full: string; company: string }
  place: { lake: string; village: string; spot: string; spotShort: string; coords: string }
  secretMail: string
}

function pickNames(rng: Rng): Names {
  const first = rng.pick(FIRST_NAMES)
  const last = rng.pick(LAST_NAMES)
  const full = `${last} ${first}`
  const company = rng.pick(COMPANIES)
  const slug = lo(company).replace(/[^a-z]+/g, '')
  const outlet = rng.pick(OUTLETS)
  const contactFirst = rng.pick(FIRST_NAMES)
  const contactLast = rng.pick(LAST_NAMES)
  const relFirst = rng.pick(FIRST_NAMES.filter((x) => x !== first))
  const spot = rng.pick(SPOTS)

  return {
    victim: {
      first,
      last,
      full,
      social: `@${lo(first)}_${lo(last)}`,
      forum: `${lo(first)}_${lo(last).slice(0, 6)}${rng.int(10, 99)}`,
      mail: `${lo(first)}.${lo(last)}@mail.${slug}.hu`,
    },
    company: {
      name: `${company} Kft.`,
      domain: `${slug}.hu`,
      street: `Iparpark u. ${rng.int(2, 18)}.`,
    },
    project: { name: rng.pick(PROJECTS), tagline: rng.pick(PROJECT_TAGLINES) },
    pm: {
      full: `${rng.pick(LAST_NAMES)} ${rng.pick(FIRST_NAMES)}`,
      handle: `@${lo(rng.pick(FIRST_NAMES))}_${lo(rng.pick(LAST_NAMES).slice(0, 5))}`,
    },
    contact: {
      first: contactFirst,
      last: contactLast,
      outlet: outlet.name,
      outletDesc: outlet.desc,
      email: `${lo(contactLast)}.${lo(contactFirst)[0]}@${outletSlug(outlet.name)}.hu`,
    },
    relative: {
      first: relFirst,
      relation: rng.pick(['bátyja', 'húga', 'öccse', 'nővére']),
      email: `${lo(relFirst)}.${lo(last)}@csaladipost.hu`,
    },
    hr: { full: `${rng.pick(HR_LAST)} ${rng.pick(HR_FIRST)}`, company: rng.pick(HELIOS_LIKE) },
    place: {
      lake: rng.pick(LAKES),
      village: rng.pick(VILLAGES),
      spot: spot.label,
      spotShort: spot.gen,
      coords: `46.${rng.int(700, 880)}°É, 17.${rng.int(400, 700)}°K`,
    },
    secretMail: `${lo(first)[0]}.${lo(last)}${rng.int(10, 99)}@zsebpost.hu`,
  }
}

// ------------------------------------------------------------
// Közös nyomváz (minden sablonban azonos szerkezet)
// ------------------------------------------------------------

const CLUE_IDS = {
  commit: 'c_commit',
  proj: 'c_proj',
  misuse: 'c_misuse',
  threat: 'c_threat',
  burnout: 'c_burnout',
  pm: 'c_pm',
  offer: 'c_offer',
  family: 'c_family',
  coords: 'c_coords',
  ticket: 'c_ticket',
  cabin: 'c_cabin',
  offgrid: 'c_offgrid',
  kl: 'c_kl',
  press: 'c_press',
  seen: 'c_seen',
  mapcabin: 'c_mapcabin',
  dLeak: 'd_leak',
  dLocation: 'd_location',
  dReason: 'd_reason',
} as const

interface QSpec {
  prompts: [string, string, string, string]
  correct: [string, string, string, string]
  requires: [string, string, string, string]
  distractors: [string[], string[], string[], string[]]
}

function buildConnections(): Connection[] {
  return [
    {
      id: 'cn_leak',
      clueA: CLUE_IDS.misuse,
      clueB: CLUE_IDS.kl,
      resultClueId: CLUE_IDS.dLeak,
      insight: 'Az adatvisszaélés + a titokzatos „K.L.” = a leleplezés a sajtónak készült.',
    },
    {
      id: 'cn_loc',
      clueA: CLUE_IDS.coords,
      clueB: CLUE_IDS.cabin,
      resultClueId: CLUE_IDS.dLocation,
      insight: 'A koordináták pont a füstös rejtőzködőhelyet jelölik: megvan a hollét!',
    },
    {
      id: 'cn_why',
      clueA: CLUE_IDS.misuse,
      clueB: CLUE_IDS.threat,
      resultClueId: CLUE_IDS.dReason,
      insight: 'Akit leleplezne, azt fenyegetik. Nem szabadna maradnia – elrejtőzött.',
    },
  ]
}

function buildObjectives(): Objective[] {
  return [
    { id: 'obj_online', title: 'Vizsgáld át a főszemély online nyomait', requiredClueIds: [CLUE_IDS.commit, CLUE_IDS.burnout] },
    { id: 'obj_work', title: 'Derítsd ki, min dolgozott', requiredClueIds: [CLUE_IDS.proj, CLUE_IDS.misuse] },
    { id: 'obj_contact', title: 'Azonosítsd a titokzatos kapcsolattartót', requiredClueIds: [CLUE_IDS.press, CLUE_IDS.kl] },
    { id: 'obj_place', title: 'Szűkítsd be a kulcs-helyszínt', requiredClueIds: [CLUE_IDS.ticket, CLUE_IDS.coords, CLUE_IDS.cabin] },
    { id: 'obj_why', title: 'Állítsd össze az ügy valódi okát', requiredClueIds: [CLUE_IDS.dReason] },
    { id: 'obj_submit', title: 'Küldd be a záró jelentést', requiredClueIds: [] },
  ]
}

function buildQuestions(q: QSpec): FinalQuestion[] {
  const ids = ['q1', 'q2', 'q3', 'q4']
  return ids.map((qid, i) => ({
    id: `q_${qid}`,
    prompt: q.prompts[i],
    options: [
      { id: `${qid}_a`, label: q.distractors[i][0] },
      { id: `${qid}_b`, label: q.correct[i], correct: true, requiresClue: q.requires[i] },
      { id: `${qid}_c`, label: q.distractors[i][1] },
      { id: `${qid}_d`, label: q.distractors[i][2] },
    ],
  }))
}

function clueList(n: Names, texts: Record<string, { title: string; description: string }>): Clue[] {
  const meta: Record<string, { source: string; category: Clue['category'] }> = {
    [CLUE_IDS.commit]: { source: 'DevKapcsolat', category: 'munka' },
    [CLUE_IDS.proj]: { source: `${n.company.name} oldala`, category: 'munka' },
    [CLUE_IDS.misuse]: { source: 'személyes blog', category: 'indok' },
    [CLUE_IDS.threat]: { source: 'személyes blog', category: 'indok' },
    [CLUE_IDS.burnout]: { source: 'Csevegőhely', category: 'egyeb' },
    [CLUE_IDS.pm]: { source: 'Csevegőhely', category: 'kapcsolat' },
    [CLUE_IDS.offer]: { source: 'webmail', category: 'egyeb' },
    [CLUE_IDS.family]: { source: 'webmail', category: 'szemely' },
    [CLUE_IDS.coords]: { source: 'webmail', category: 'hely' },
    [CLUE_IDS.ticket]: { source: 'Csevegőhely', category: 'hely' },
    [CLUE_IDS.cabin]: { source: 'Képmegosztó', category: 'hely' },
    [CLUE_IDS.offgrid]: { source: 'KorosNivel Fórum', category: 'egyeb' },
    [CLUE_IDS.kl]: { source: 'Csevegőhely – üzenetek', category: 'kapcsolat' },
    [CLUE_IDS.press]: { source: 'KorosNivel Fórum', category: 'kapcsolat' },
    [CLUE_IDS.seen]: { source: 'hírportál', category: 'hely' },
    [CLUE_IDS.mapcabin]: { source: 'Térkép.Élő', category: 'hely' },
    [CLUE_IDS.dLeak]: { source: 'Következtetés', category: 'kapcsolat' },
    [CLUE_IDS.dLocation]: { source: 'Következtetés', category: 'hely' },
    [CLUE_IDS.dReason]: { source: 'Következtetés', category: 'indok' },
  }
  const out: Clue[] = []
  for (const [id, m] of Object.entries(meta)) {
    const t = texts[id]
    if (!t) throw new Error(`Hiányzó clue-szöveg: ${id}`)
    out.push({
      id,
      title: t.title,
      description: t.description,
      source: m.source,
      category: m.category,
      deduction: id.startsWith('d_'),
    })
  }
  return out
}

// ------------------------------------------------------------
// Dátumok (közös fiktív idővonal)
// ------------------------------------------------------------

const DATES = {
  commit: 'szept. 08.',
  burnout: 'szept. 10. · 21:47',
  ticket: 'szept. 11. · 07:12',
  pmRow: 'szept. 09. · 18:30',
  flavor: 'aug. 28. · 12:05',
  family: 'szept. 15. · 08:21',
  secret: 'szept. 13. · 03:44',
  offer: 'szept. 09. · 10:02',
  newsletter: 'szept. 08. · 16:40',
  phish: 'szept. 08. · 05:00',
  newsDate: '2026. szept. 14.',
  blogMain: '2026. szept. 12.',
  blogHobby: '2026. aug. 30.',
  forum1: 'szept. 03.',
  forum2: 'szept. 06.',
  forum3: 'aug. 30.',
}

// ------------------------------------------------------------
// Oldal-építő
// ------------------------------------------------------------

function searchSite(): GameCase['websites'][number] {
  return {
    domain: 'spotlight.kereso',
    name: 'Spotlight kereső',
    icon: 'search',
    accent: 'text-cyan-300',
    pages: [{ kind: 'search', url: 'spotlight.kereso', title: 'Spotlight – kereső', siteName: 'Spotlight' }],
  }
}

interface CoreOpts {
  devHandleUrl: string
  socialUrl: string
  mailUrl: string
  galleryUrl: string
  newsUrl: string
  blogUrl: string
  dm: { url: string; partner: string; handle: string; messages: ChatMsg[] }
  bioSegs: RichSeg[]
  posts: PostData[]
  repos: RepoData[]
  threads: ForumThread[]
  emails: EmailData[]
  photos: PhotoData[]
  news: { headline: string; lead: string; author: string; body: RichSeg[][]; related: { label: string; url: string }[] }
  company: { hero: string; about: RichSeg[][]; projects: { name: string; tagline: string; status: string; desc: RichSeg[] }[]; contact: string }
  blog: { id: string; title: string; date: string; body: RichSeg[][] }[]
  pins: { id: string; x: number; y: number; label: string; kind: 'office' | 'home' | 'cabin' | 'station' | 'poi'; info: RichSeg[] }[]
}

function buildSites(n: Names, rng: Rng, opts: CoreOpts): GameCase['websites'] {
  return [
    searchSite(),
    {
      domain: 'devkapcsolat.io',
      name: 'DevKapcsolat',
      icon: 'code',
      accent: 'text-emerald-300',
      pages: [
        {
          kind: 'profile',
          variant: 'dev',
          url: `devkapcsolat.io/${opts.devHandleUrl}`,
          title: `${n.victim.full} – DevKapcsolat`,
          siteName: 'DevKapcsolat',
          displayName: n.victim.full,
          handle: opts.devHandleUrl,
          avatarSeed: `dev-${n.victim.full}`,
          bio: opts.bioSegs,
          meta: [
            { label: 'Hely', value: RT('Korosfalu, HU') },
            { label: 'Csatlakozott', value: RT('2019. március') },
            { label: 'Státusz', value: RT('Fiók inaktív (utolsó aktivitás: szept. 11.)') },
          ],
          repos: opts.repos,
        },
      ],
    },
    {
      domain: 'csevegohely.social',
      name: 'Csevegőhely',
      icon: 'message',
      accent: 'text-sky-300',
      pages: [
        {
          kind: 'profile',
          variant: 'social',
          url: opts.socialUrl,
          title: `${n.victim.full} (${n.victim.social}) – Csevegőhely`,
          siteName: 'Csevegőhely',
          displayName: n.victim.full,
          handle: n.victim.social,
          avatarSeed: `soc-${n.victim.full}`,
          bio: RT('kód, kávé, csend. | ', T(n.company.name), ' | Korosfalu · ', L('üzenetek', opts.dm.url)),
          meta: [
            { label: 'Követők', value: RT(String(rng.int(300, 2400))) },
            { label: 'Követett', value: RT(String(rng.int(80, 400))) },
            { label: 'Hely', value: RT('Korosfalu, HU') },
          ],
          posts: opts.posts,
        },
        {
          kind: 'chat',
          url: opts.dm.url,
          title: `Közvetlen üzenetek – ${opts.dm.partner} – Csevegőhely`,
          siteName: 'Csevegőhely',
          account: n.victim.social,
          partner: opts.dm.partner,
          partnerHandle: opts.dm.handle,
          messages: opts.dm.messages,
        },
      ],
    },
    {
      domain: 'korosnivel.forum',
      name: 'KorosNivel Fórum',
      icon: 'forum',
      accent: 'text-lime-300',
      pages: [
        {
          kind: 'forum',
          url: 'korosnivel.forum',
          title: 'KorosNivel Fórum',
          siteName: 'KorosNivel Fórum',
          boardName: 'Életmód / Off-grid & kiköltözés',
          threads: opts.threads,
        },
      ],
    },
    {
      domain: opts.mailUrl,
      name: 'Webmail',
      icon: 'mail',
      accent: 'text-violet-300',
      pages: [
        {
          kind: 'webmail',
          url: opts.mailUrl,
          title: 'Webmail – Beérkezett üzenetek',
          siteName: 'Webmail',
          account: n.victim.mail,
          emails: opts.emails,
        },
      ],
    },
    {
      domain: 'kepmegoszto.hu',
      name: 'Képmegosztó',
      icon: 'image',
      accent: 'text-pink-300',
      pages: [
        {
          kind: 'gallery',
          url: opts.galleryUrl,
          title: `Őszi vizek – ${n.place.lake} – Képmegosztó`,
          siteName: 'Képmegosztó',
          owner: 'pixelvadasz',
          album: `Őszi vizek – ${n.place.lake}`,
          photos: opts.photos,
        },
      ],
    },
    {
      domain: 'napi.pulzus',
      name: 'Napi Pulzus',
      icon: 'news',
      accent: 'text-red-300',
      pages: [
        {
          kind: 'news',
          url: opts.newsUrl,
          title: `${opts.news.headline} – Napi Pulzus`,
          siteName: 'Napi Pulzus',
          headline: opts.news.headline,
          lead: opts.news.lead,
          author: opts.news.author,
          date: DATES.newsDate,
          body: opts.news.body,
          related: opts.news.related,
        },
      ],
    },
    {
      domain: n.company.domain,
      name: n.company.name,
      icon: 'building',
      accent: 'text-amber-300',
      pages: [
        {
          kind: 'company',
          url: n.company.domain,
          title: `${n.company.name} – hivatalos oldal`,
          siteName: n.company.name,
          hero: opts.company.hero,
          about: opts.company.about,
          projects: opts.company.projects,
          contact: `${n.company.street}, Korosfalu · +36-1-555-0${rng.int(100, 999)} (fiktív)`,
        },
      ],
    },
    {
      domain: opts.blogUrl,
      name: opts.blogUrl,
      icon: 'pen',
      accent: 'text-teal-300',
      pages: [
        {
          kind: 'blog',
          url: opts.blogUrl,
          title: `${n.victim.full} blogja`,
          siteName: opts.blogUrl,
          owner: n.victim.full,
          posts: opts.blog,
        },
      ],
    },
    {
      domain: 'terkep.elo',
      name: 'Térkép.Élő',
      icon: 'map',
      accent: 'text-green-300',
      pages: [
        {
          kind: 'map',
          url: 'terkep.elo/korosfalu',
          title: `Korosfalu és a ${n.place.lake} – Térkép.Élő`,
          siteName: 'Térkép.Élő',
          region: `Korosfalu és a ${n.place.lake}`,
          pins: opts.pins,
        },
      ],
    },
  ]
}

// ------------------------------------------------------------
// A három történet-vázlat
// ------------------------------------------------------------

interface Pack {
  title: string
  tagline: string
  briefing: string[]
  texts: Record<string, { title: string; description: string }>
  q: QSpec
  recap: string[]
}

function missingPack(n: Names, rng: Rng): Pack {
  return {
    title: rng.pick(['Az eltűnt fejlesztő', 'Némajáték', 'A kapcsolás']),
    tagline: 'Egy fejlesztő eltűnik. Az internet emlékezik.',
    briefing: [
      `A ${rng.int(24, 34)} éves szoftverfejlesztő ${n.victim.full} szeptember 11-én eltűnt a korosfalui lakásából. A család aggódik, a munkaadó hallgat.`,
      'Az online térben viszont mindenki hagy nyomot: profilok, posztok, levelek, fotók, fórumüzenetek.',
      'Kutass a fiktív interneten, kösd össze a nyomokat, és küldd be a záró jelentést: hová rejtőzött, kivel beszélt, min dolgozott, és miért tűnt el.',
      'Minden szereplő és helyszín kitalált.',
    ],
    texts: {
      [CLUE_IDS.commit]: {
        title: 'Rejtélyes utolsó commit',
        description: `Az utolsó commit a ${n.project.name} repóban: „refactor: a naplózási hátsó ajtó eltávolítása”. Röviddel ezután archiválták a repót.`,
      },
      [CLUE_IDS.proj]: {
        title: `${n.project.name} – adatgyűjtő rendszer`,
        description: `A(z) ${n.company.name} zászlóshajó-projektje „bármilyen forrásból” gyűjti és kapcsolja össze a munkavállalói adatokat.`,
      },
      [CLUE_IDS.misuse]: {
        title: 'Tiltott adatgyűjtés a rendszerben',
        description: `A blogbejegyzés szerint a „névtelenített” adatokat a(z) ${n.project.name} rejtetten összekapcsolta, és külső partnereknek továbbította.`,
      },
      [CLUE_IDS.threat]: {
        title: 'Ismeretlen fenyegetések',
        description: 'A blog szerint az ügy kezdete óta ismeretlen számokról fenyegető üzenetek érkeznek, és kétszer is ott fordult a kilincs.',
      },
      [CLUE_IDS.burnout]: {
        title: 'Kiégség jelei',
        description: 'A hírfolyamon hetek óta kiégésről ír a fejlesztő. Sokan ezért hiszik, hogy csak elment pihenni.',
      },
      [CLUE_IDS.pm]: {
        title: `${n.pm.full} nyomása`,
        description: `A projektvezető nyilvánosan szúrta ki a „csapatellenes” lépéseket; a válasz szerint ${n.pm.full} „az adatokat akarja, mindenáron”.`,
      },
      [CLUE_IDS.offer]: {
        title: `${n.hr.company} ajánlata`,
        description: `${n.hr.full} (HR) versenyeztető ajánlatot küldött: 25%-kal magasabb fizetés, szept. 15-i határidővel.`,
      },
      [CLUE_IDS.family]: {
        title: `${n.relative.first} aggódó levele`,
        description: `A ${n.relative.relation} hetek óta nem tudja felhívni, és levelezésben közölte: ha ez így megy tovább, személyesen keresi fel.`,
      },
      [CLUE_IDS.coords]: {
        title: 'Koordináták a titkos postafiókból',
        description: `Egy ${n.secretMail} címről küldött levél koordinátákat ad: ${n.place.coords} – a ${n.place.lake} északnyugati partja.`,
      },
      [CLUE_IDS.ticket]: {
        title: 'Vonatjegy a zsebben',
        description: `Szept. 11-én „néhány napra kikapcsolok” felirattal fotózott fel egy Korosfalu → ${n.place.village} vasútjegyet.`,
      },
      [CLUE_IDS.cabin]: {
        title: `Füst a ${n.place.spotShort}ból`,
        description: `Egy fotós szerint a ${n.place.lake} északnyugati partján álló, évek óta üres ${n.place.spot}ből mostanában füst száll fel – valaki ott lakik.`,
      },
      [CLUE_IDS.offgrid]: {
        title: 'Off-grid kutatás a fórumon',
        description: 'A KorosNivel fórumon off-grid életről kérdezett: napelem, kút, jelmentes völgyek – hetekkel az eltűnése előtt.',
      },
      [CLUE_IDS.kl]: {
        title: 'A titokzatos „K.L.”',
        description: 'A csevegő üzeneteiben egy „K.L.” figurával egyeztetett: Ő az, akivel a témáról beszélt.',
      },
      [CLUE_IDS.press]: {
        title: `${n.contact.last} ${n.contact.first[0]}. – oknyomozó újságíró`,
        description: `A fórumon feltűnt a(z) ${n.contact.outlet} (${n.contact.outletDesc}) újságírója: „bátran írj – diszkréten, titkosítva”.`,
      },
      [CLUE_IDS.seen]: {
        title: `Utolsó látmány: ${n.place.village} állomás`,
        description: `A hírcikk szerint az utolsó hiteles látmány szept. 11-én a ${n.place.village.toLowerCase()}i vasútállomás kameráin készült; a tó felé indult gyalog.`,
      },
      [CLUE_IDS.mapcabin]: {
        title: `A ${n.place.spotShort} a térképen`,
        description: `A térkép pontosan a koordinátáknál jelöl egy „${n.place.spot} – használaton kívüli” pontot a tó északnyugati partján.`,
      },
      [CLUE_IDS.dLeak]: {
        title: 'Leleplezésre készült',
        description: `Az anyag ${n.contact.last} ${n.contact.first}hez, a(z) ${n.contact.outlet} újságírójához került – innen a titkolózás.`,
      },
      [CLUE_IDS.dLocation]: {
        title: `Rejtőzködés a ${n.place.spotShort}ban`,
        description: `A koordináták és a füstös ${n.place.spotShort} egybeesnek: ott bujkál, a ${n.place.lake} északnyugati partján.`,
      },
      [CLUE_IDS.dReason]: {
        title: 'Az eltűnés oka: leleplezés + fenyegetés',
        description: 'Azért tűnt el, mert leleplezte a tiltott adatgyűjtést; a fenyegetések miatt biztonságos búvóhelyen várta, míg az anyag célba ér.',
      },
    },
    q: {
      prompts: [
        'Hová rejtőzött el?',
        'Kivel tartotta a kapcsolatot az eltűnése előtt?',
        'Min dolgozott az eltűnése előtt?',
        'Miért tűnt el?',
      ],
      correct: [
        `A ${n.place.lake} északnyugati partján álló ${n.place.spot}ba`,
        `${n.contact.last} ${n.contact.first} – a(z) ${n.contact.outlet} újságírója`,
        `A ${n.project.name} adatgyűjtő rendszeren`,
        'Mert leleplezte a tiltott adatgyűjtést, és fenyegetve érezte magát',
      ],
      requires: [CLUE_IDS.dLocation, CLUE_IDS.press, CLUE_IDS.proj, CLUE_IDS.dReason],
      distractors: [
        [`A ${n.hr.company} új irodájába költözött`, 'Külföldre szökött egy rejtélyes állás miatt', 'A korosfalui lakásában rejtőzködik tovább'],
        [`${n.pm.full} projektvezető`, `${n.hr.full} (${n.hr.company}, HR)`, 'Egy ismeretlen kriptobefektető'],
        ['Egy böngészős játékmotoron', 'Egy banki API-átalakításon', 'Egy kriptotőzsde backendjén'],
        ['Kiégett, csak pihenőre ment', 'Adósságai elől menekült', 'Egy jól fizető külföldi állás miatt költözött'],
      ],
    },
    recap: [
      `${n.victim.full} a(z) ${n.company.name} ${n.project.name} nevű adatgyűjtő rendszerén dolgozott: a rendszer „névtelenített” munkavállalói adatokat gyűjtött, majd rejtetten összekapcsolta és továbbította külső partnereknek.`,
      `Amikor szólt a visszaélésről, a projektvezető, ${n.pm.full} leültette, hogy „ne bonyolítsa”. Nem ő volt az egyetlen ellenség: ismeretlen számokról fenyegető üzenetek érkeztek.`,
      `Ekkor oknyomozó újságíróhoz fordult: ${n.contact.last} ${n.contact.first}hez, a(z) ${n.contact.outlet} munkatársához, akinek átadta a dokumentumokat.`,
      `Szeptember 11-én vonattal ${n.place.village}re utazott, majd a ${n.place.lake} északnyugati partján álló, évek óta üresen álló ${n.place.spot}ba húzódott vissza, ahol jelmentes búvóhelyen várta, míg az anyag napvilágot lát.`,
      'A hírportál tévesen kiégésre gyanakodott; valójában egy leleplezésre készülő informátor rejtőzött el szándékosan.',
    ],
  }
}

function fraudPack(n: Names, rng: Rng): Pack {
  return {
    title: rng.pick(['A fekete főkönyv', 'Eltűnt könyvelő', 'Tisztességes számlák']),
    tagline: 'Egy elemző eltűnik. A számlák beszélnek.',
    briefing: [
      `${n.victim.full}, a(z) ${n.company.name} senior pénzügyi rendszerelemzője szeptember 11-én nem jelent meg munkahelyén, azóta nem elérhető.`,
      'A cég „szabadságot” említ, a család azt mondja: egy hangot sem hallott tőle. Az online térben viszont ott a nyom.',
      'Kutass: hová rejtőzött, kivel beszélt, milyen rendszerben talált szabálytalanságot, és miért hallgat most.',
      'Minden szereplő és helyszín kitalált.',
    ],
    texts: {
      [CLUE_IDS.commit]: {
        title: 'Gyanús adatmigráció',
        description: `Az utolsó commit a ${n.project.name} repóban: „hotfix: duplikált kifizetési napló eltávolítása” – majd archiválás.`,
      },
      [CLUE_IDS.proj]: {
        title: `${n.project.name} – pénzügyi automatizálás`,
        description: `A(z) ${n.company.name} rendszere automatikusan egyeztet és utal – ${n.project.tagline} keretében.`,
      },
      [CLUE_IDS.misuse]: {
        title: 'Fantombeszállítók a rendszerben',
        description: 'A blogbejegyzés szerint a rendszerben tucatnyi nem létező beszállító szerepel; a kifizetések egyetlen rejtett számlához futnak be.',
      },
      [CLUE_IDS.threat]: {
        title: 'Ismeretlen fenyegetések',
        description: 'A blog szerint azóta, hogy szólt belsőleg, ismeretlen számok hívogatják, és kétszer is ott volt a kilincs a lakásában.',
      },
      [CLUE_IDS.burnout]: {
        title: 'Kiégség jelei',
        description: 'A hírfolyamon hetek óta kiégésről írt. Sokan ezért hiszik, hogy csak elment pihenni.',
      },
      [CLUE_IDS.pm]: {
        title: `${n.pm.full} nyomása`,
        description: `A pénzügyi vezető nyilvánosan szúrta ki, hogy „nem kell mindent felnagyítani”; a válasz szerint ${n.pm.full} „a naplókat akarja, mindenáron”.`,
      },
      [CLUE_IDS.offer]: {
        title: `${n.hr.company} ajánlata`,
        description: `${n.hr.full} (HR) versenyeztető ajánlatot küldött: 25%-kal magasabb fizetés, szept. 15-i határidővel.`,
      },
      [CLUE_IDS.family]: {
        title: `${n.relative.first} aggódó levele`,
        description: `A ${n.relative.relation} hetek óta nem tudja felhívni, és levelezésben közölte: ha ez így megy tovább, személyesen keresi fel.`,
      },
      [CLUE_IDS.coords]: {
        title: 'Koordináták a titkos postafiókból',
        description: `Egy ${n.secretMail} címről küldött levél koordinátákat ad: ${n.place.coords} – a ${n.place.lake} északnyugati partja.`,
      },
      [CLUE_IDS.ticket]: {
        title: 'Vonatjegy a zsebben',
        description: `Szept. 11-én „néhány napra kikapcsolok” felirattal fotózott fel egy Korosfalu → ${n.place.village} vasútjegyet.`,
      },
      [CLUE_IDS.cabin]: {
        title: `Füst a ${n.place.spotShort}ból`,
        description: `Egy fotós szerint a ${n.place.lake} északnyugati partján álló, évek óta üres ${n.place.spot}ből mostanában füst száll fel.`,
      },
      [CLUE_IDS.offgrid]: {
        title: 'Off-grid kutatás a fórumon',
        description: 'A KorosNivel fórumon off-grid életről kérdezett: napelem, kút, jelmentes völgyek – hetekkel az eltűnése előtt.',
      },
      [CLUE_IDS.kl]: {
        title: 'A titokzatos „K.L.”',
        description: 'A csevegő üzeneteiben egy „K.L.” figurával egyeztetett: Ő az, akivel a témáról beszélt.',
      },
      [CLUE_IDS.press]: {
        title: `${n.contact.last} ${n.contact.first[0]}. – oknyomozó újságíró`,
        description: `A fórumon feltűnt a(z) ${n.contact.outlet} (${n.contact.outletDesc}) újságírója: „bátran írj – diszkréten, titkosítva”.`,
      },
      [CLUE_IDS.seen]: {
        title: `Utolsó látmány: ${n.place.village} állomás`,
        description: `A hírcikk szerint az utolsó hiteles látmány szept. 11-én a ${n.place.village.toLowerCase()}i vasútállomás kameráin készült; a tó felé indult gyalog.`,
      },
      [CLUE_IDS.mapcabin]: {
        title: `A ${n.place.spotShort} a térképen`,
        description: `A térkép pontosan a koordinátáknál jelöl egy „${n.place.spot} – használaton kívüli” pontot a tó északnyugati partján.`,
      },
      [CLUE_IDS.dLeak]: {
        title: 'A naplók újságíróhoz kerültek',
        description: `A bizonyíték ${n.contact.last} ${n.contact.first}nél, a(z) ${n.contact.outlet}nél van – innen a titkolózás.`,
      },
      [CLUE_IDS.dLocation]: {
        title: `Rejtőzködés a ${n.place.spotShort}ban`,
        description: `A koordináták és a füstös ${n.place.spotShort} egybeesnek: ott bujkál, a ${n.place.lake} északnyugati partján.`,
      },
      [CLUE_IDS.dReason]: {
        title: 'Az eltűnés oka: leleplezés + fenyegetés',
        description: 'Azért tűnt el, mert fantombeszállító-számlázási csalást leplezett le; a fenyegetések miatt biztonságos búvóhelyen várja, míg az anyag célba ér.',
      },
    },
    q: {
      prompts: [
        'Hová rejtőzött el?',
        'Kivel tartotta a kapcsolatot az eltűnése előtt?',
        'Milyen rendszerben talált szabálytalanságot?',
        'Miért tűnt el?',
      ],
      correct: [
        `A ${n.place.lake} északnyugati partján álló ${n.place.spot}ba`,
        `${n.contact.last} ${n.contact.first} – a(z) ${n.contact.outlet} újságírója`,
        `A ${n.project.name} pénzügyi automatizálási rendszerben`,
        'Mert fantombeszállító-számlákon áramlott ki a pénz, és fenyegették',
      ],
      requires: [CLUE_IDS.dLocation, CLUE_IDS.press, CLUE_IDS.proj, CLUE_IDS.dReason],
      distractors: [
        [`A ${n.hr.company} új irodájába költözött`, 'Külföldre szökött a céges kártyával', 'A korosfalui lakásában rejtőzködik tovább'],
        [`${n.pm.full} pénzügyi vezető`, `${n.hr.full} (${n.hr.company}, HR)`, 'Egy ismeretlen kriptobefektető'],
        ['A bérszámfejtő modulban', 'Az ügyfélportál regisztrációjában', 'A raktári alkalmazásban'],
        ['Kiégett, csak pihenőre ment', 'Adósságai elől menekült', 'Egy jól fizető külföldi állás miatt költözött'],
      ],
    },
    recap: [
      `${n.victim.full} a(z) ${n.company.name} ${n.project.name} rendszerét karbantarta, amelyben tucatnyi fantombeszállítót talált: a kifizetések egyetlen rejtett számlához futottak be.`,
      `Amikor szólt belsőleg, a pénzügyi vezető, ${n.pm.full} „ne felnagyítsd”-dal intsintézte el; közben ismeretlen számokról fenyegető üzenetek érkeztek.`,
      `Ekkor oknyomozó újságíróhoz fordult: ${n.contact.last} ${n.contact.first}hez, a(z) ${n.contact.outlet} munkatársához, akinek átadta a naplókat.`,
      `Szeptember 11-én vonattal ${n.place.village}re utazott, majd a ${n.place.lake} északnyugati partján álló ${n.place.spot}ba húzódott vissza, ahol jelmentes búvóhelyen várta, míg az anyag napvilágot lát.`,
      'A hírportál tévesen kiégésre gyanakodott; valójában egy csalást leleplező belső ember rejtőzött el szándékosan.',
    ],
  }
}

function identityPack(n: Names, rng: Rng): Pack {
  return {
    title: rng.pick(['Aki nem az, akinek látszik', 'Hamis profil', 'A jóhiszemű csalogató']),
    tagline: 'Egy profil hazudik. Nézz mögé.',
    briefing: [
      `Egy „toborzó” profil ${n.victim.full} nevét használva írt meg tucatnyi embert Korosfalun. A profilt néhány napja törölték.`,
      'A nyomok azonban megmaradtak: profilok, posztok, levelek, fotók, fórumüzenetek.',
      'Kutass: hol szervezte a csaló a találkozókat, ki segíti a leleplezést, mi árulja el, hogy nem a valódi személy a profil mögött, és mi a cél.',
      'Minden szereplő és helyszín kitalált.',
    ],
    texts: {
      [CLUE_IDS.commit]: {
        title: 'A valódi profil',
        description: `A DevKapcsolat-profil bizonyítja, hogy a valódi ${n.victim.full} évek óta aktív szakember – és nem ő az a „toborzó”.`,
      },
      [CLUE_IDS.proj]: {
        title: 'A valódi munkahely',
        description: `A(z) ${n.company.name} oldala megerősíti: ${n.victim.full} valóban itt dolgozik – nem ő állt kapcsolatban az áldozatokkal.`,
      },
      [CLUE_IDS.misuse]: {
        title: 'A blog leleplezése',
        description: `${n.victim.full} blogján írta: a nevében ismeretlen „toborzói” profilok léteznek, és személyes adatokat, díjakat kérnek az emberektől.`,
      },
      [CLUE_IDS.threat]: {
        title: 'Ismeretlen fenyegetések',
        description: 'A blog szerint azóta, hogy szólt az ügyben, ismeretlen számokról fenyegetik: „ne kavart volna”.',
      },
      [CLUE_IDS.burnout]: {
        title: 'A valódi profil hangja',
        description: 'A hírfolyam bejegyzései őszinték, személyesek – a hamis „toborzó” profil soha nem így írt.',
      },
      [CLUE_IDS.pm]: {
        title: `${n.pm.full} nyilatkozata`,
        description: `A projektvezető kijelentette a posztok alatt: „${n.victim.full} nálunk dolgozik, és nincs toborzócsatornája.”`,
      },
      [CLUE_IDS.offer]: {
        title: `${n.hr.company} ajánlata`,
        description: `${n.hr.full} (HR) levele bizonyítja: a valódi ${n.victim.full}nak komoly, hivatalos ajánlata van – nem „gyors kezdésre” táborozott.`,
      },
      [CLUE_IDS.family]: {
        title: `${n.relative.first} levele`,
        description: `A ${n.relative.relation} azt írja: hetek óta „mindenki” a nevet használja valami gyanús toborzási oldalon.`,
      },
      [CLUE_IDS.coords]: {
        title: 'Koordináták a titkos postafiókból',
        description: `Egy ${n.secretMail} címről küldött levél találkozóhely-koordinátát ad: ${n.place.coords} – a ${n.place.lake} északnyugati partja.`,
      },
      [CLUE_IDS.ticket]: {
        title: 'Vonatjegy a zsebben',
        description: `Szept. 11-én fotózott fel egy Korosfalu → ${n.place.village} vasútjegyet – ezen a napon szervezte a csaló a „személyes állásinterjúkat”.`,
      },
      [CLUE_IDS.cabin]: {
        title: `Füst a ${n.place.spotShort}ból`,
        description: `Egy fotós szerint a ${n.place.lake} északnyugati partján álló, évek óta üres ${n.place.spot}ből mostanában füst száll fel.`,
      },
      [CLUE_IDS.offgrid]: {
        title: 'Az igazi profil fórumozása',
        description: `A valódi ${n.victim.full} a fórumon off-grid életről kérdezett – személyes, konkrét stílusban.`,
      },
      [CLUE_IDS.kl]: {
        title: 'A titokzatos „K.L.”',
        description: 'A csevegő üzeneteiben egy „K.L.” figurával egyeztetett: Ő az, akivel a témáról beszélt.',
      },
      [CLUE_IDS.press]: {
        title: `${n.contact.last} ${n.contact.first[0]}. – oknyomozó újságíró`,
        description: `A(z) ${n.contact.outlet} (${n.contact.outletDesc}) újságírója a fórumon jelezte: többen is jelentették a hamis profilt, gyűjti az ügyet.`,
      },
      [CLUE_IDS.seen]: {
        title: `Utolsó látmány: ${n.place.village} állomás`,
        description: `A hírcikk szerint a gyanúsított „toborzót” szept. 11-én a ${n.place.village.toLowerCase()}i vasútállomás kamerái rögzítették; a tó felé indult.`,
      },
      [CLUE_IDS.mapcabin]: {
        title: `A ${n.place.spotShort} a térképen`,
        description: `A térkép pontosan a koordinátáknál jelöl egy „${n.place.spot} – használaton kívüli” pontot: ide invitálta az áldozatait.`,
      },
      [CLUE_IDS.dLeak]: {
        title: 'Az ügy a szerkesztőségnél van',
        description: `Az összegyűjtött jelek ${n.contact.last} ${n.contact.first}nél, a(z) ${n.contact.outlet}nél vannak – a nyilvánosság néha védőpáncél.`,
      },
      [CLUE_IDS.dLocation]: {
        title: `Találkozó a ${n.place.spotShort}nál`,
        description: `A koordináták és a füstös ${n.place.spotShort} egybeesnek: ide szervezte a „személyes állásinterjúkat”.`,
      },
      [CLUE_IDS.dReason]: {
        title: 'A cél: adat- és díjkicsalás',
        description: 'A hamis profil „belebirodalmi díjat” és személyes adatokat kért – előleg- és adathalász-séma hamis identitás mögé bújva.',
      },
    },
    q: {
      prompts: [
        'Hol szervezte a csaló a találkozókat?',
        'Ki segít leleplezni az ügyet?',
        'Mi árulja el, hogy a „toborzó” nem a valódi személy?',
        'Mi a csaló célja?',
      ],
      correct: [
        `A ${n.place.lake} északnyugati partján álló ${n.place.spot}nál`,
        `${n.contact.last} ${n.contact.first} – a(z) ${n.contact.outlet} újságírója`,
        `A valódi ${n.victim.full} profilja és munkahelye – nem ő az`,
        'Személyes adatok és „belebirodalmi díjak” kicsalása',
      ],
      requires: [CLUE_IDS.dLocation, CLUE_IDS.press, CLUE_IDS.proj, CLUE_IDS.dReason],
      distractors: [
        [`A ${n.hr.company} irodájában`, 'Egy bevásárlóközpont kávézójában', 'Kizárólag online videóhívásban'],
        [`${n.pm.full} projektvezető`, `${n.hr.full} (${n.hr.company}, HR)`, 'Egy kriptobefektető'],
        ['A profil profilképe önmagában', 'A hibás nyelvtan az üzenetekben', 'A profilkép EXIF-adatai'],
        ['Romantikus kapcsolat kialakítása', 'Vallási közösség építése', 'Játékfiókok visszavétele'],
      ],
    },
    recap: [
      `Ismeretlenek ${n.victim.full} nevét és fotóit használva hamis „toborzói” profilt hoztak létre, és tucatnyi embert kerestek meg „gyors kezdéssel” ígért munkákkal.`,
      `A valódi ${n.victim.full} – a(z) ${n.company.name} szakembere – blogján jelezte, hogy nem áll kapcsolatban ezekkel a profilokkal; közben fenyegető üzeneteket kapott.`,
      `${n.contact.last} ${n.contact.first}, a(z) ${n.contact.outlet} oknyomozó újságírója gyűjtötte össze az áldozatok jelzéseit.`,
      `A csaló szeptember 11-én ${n.place.village}re utazott, és a ${n.place.lake} északnyugati partján álló ${n.place.spot}nál szervezte a „személyes állásinterjúkat”.`,
      'A cél személyes adatok és „belebirodalmi díjak” kicsalása volt – klasszikus előleg- és adathalász-séma hamis identitás mögé bújva.',
    ],
  }
}

function becPack(n: Names, rng: Rng): Pack {
  return {
    title: rng.pick(['Az átutaló', 'Főnök nevében', 'A hetedik számla']),
    tagline: 'Hamis vezetői levelek, rejtett utalások. Egy bennfentes hallgat.',
    briefing: [
      `${n.victim.full}, a(z) ${n.company.name} fizetési rendszerének üzemeltetésért felelős szakembere szeptember 11-én eltűnt: nem jelentkezett, a telefonja is elérhetetlen.`,
      'A cég rendben lévő „szabadságot” lát, a család pánikban van. Az online térben viszont ott vannak a nyomok: levelek, posztok, beszélgetések, fotók.',
      'Kutass: hová rejtőzött, kivel beszélt, milyen visszaélést talált a rendszerben, és miért kellett eltűnnie.',
      'Minden szereplő és helyszín kitalált.',
    ],
    texts: {
      [CLUE_IDS.commit]: {
        title: 'Utolsó commit: hamis utalási sablon',
        description: `Az utolsó commit a ${n.project.name} repóban: „security: hamis vezetői utalási sablon letiltása” – röviddel ezután a repót archiválták.`,
      },
      [CLUE_IDS.proj]: {
        title: `${n.project.name} – automatikus fizetési motor`,
        description: `A(z) ${n.company.name} rendszere a „vezetői e-mail utasítások” alapján önállóan utal – ${n.project.tagline} keretében.`,
      },
      [CLUE_IDS.misuse]: {
        title: 'Hamis vezetői levelek – kifizetések idegen számlára',
        description: 'A blogbejegyzés szerint a vezér nevében érkező, de hamis címről küldött levelekre a rendszer magától utalt; a pénz egyetlen, korábban sosem látott számlára futott be.',
      },
      [CLUE_IDS.threat]: {
        title: 'Ismeretlen fenyegetések',
        description: 'A blog szerint mióta jelezte a szabálytalanságot, ismeretlen számok hívogatják, és kétszer is ott fordult a kilincs a lakásában.',
      },
      [CLUE_IDS.burnout]: {
        title: 'Kiégség jelei',
        description: 'A hírfolyamon hetek óta kiégésről írt. Sokan ezért hiszik, hogy csak elment pihenni.',
      },
      [CLUE_IDS.pm]: {
        title: `${n.pm.full} nyomása`,
        description: `A pénzügyi vezető nyilvánosan szúrta ki, hogy „nem kell mindent felnagyítani”; a válasz szerint ${n.pm.full} „a naplókat akarja, mindenáron”.`,
      },
      [CLUE_IDS.offer]: {
        title: `${n.hr.company} ajánlata`,
        description: `${n.hr.full} (HR) versenyeztető ajánlatot küldött: 25%-kal magasabb fizetés, szept. 15-i határidővel.`,
      },
      [CLUE_IDS.family]: {
        title: `${n.relative.first} aggódó levele`,
        description: `A ${n.relative.relation} hetek óta nem tudja felhívni, és levelezésben közölte: ha ez így megy tovább, személyesen keresi fel.`,
      },
      [CLUE_IDS.coords]: {
        title: 'Koordináták a titkos postafiókból',
        description: `Egy ${n.secretMail} címről küldött levél koordinátákat ad: ${n.place.coords} – a ${n.place.lake} északnyugati partja.`,
      },
      [CLUE_IDS.ticket]: {
        title: 'Vonatjegy a zsebben',
        description: `Szept. 11-én „néhány napra kikapcsolok” felirattal fotózott fel egy Korosfalu → ${n.place.village} vasútjegyet.`,
      },
      [CLUE_IDS.cabin]: {
        title: `Füst a ${n.place.spotShort}ból`,
        description: `Egy fotós szerint a ${n.place.lake} északnyugati partján álló, évek óta üres ${n.place.spot}ből mostanában füst száll fel – valaki ott lakik.`,
      },
      [CLUE_IDS.offgrid]: {
        title: 'Off-grid kutatás a fórumon',
        description: 'A KorosNivel fórumon off-grid életről kérdezett: napelem, kút, jelmentes völgyek – hetekkel az eltűnése előtt.',
      },
      [CLUE_IDS.kl]: {
        title: 'A titokzatos „K.L.”',
        description: 'A csevegő üzeneteiben egy „K.L.” figurával egyeztetett: Ő az, akivel a témáról beszélt.',
      },
      [CLUE_IDS.press]: {
        title: `${n.contact.last} ${n.contact.first[0]}. – oknyomozó újságíró`,
        description: `A fórumon feltűnt a(z) ${n.contact.outlet} (${n.contact.outletDesc}) újságírója: „bátran írj – diszkréten, titkosítva”.`,
      },
      [CLUE_IDS.seen]: {
        title: `Utolsó látmány: ${n.place.village} állomás`,
        description: `A hírcikk szerint az utolsó hiteles látmány szept. 11-én a ${n.place.village.toLowerCase()}i vasútállomás kameráin készült; a tó felé indult gyalog.`,
      },
      [CLUE_IDS.mapcabin]: {
        title: `A ${n.place.spotShort} a térképen`,
        description: `A térkép pontosan a koordinátáknál jelöl egy „${n.place.spot} – használaton kívüli” pontot a tó északnyugati partján.`,
      },
      [CLUE_IDS.dLeak]: {
        title: 'Leleplezésre készült',
        description: `Az anyag ${n.contact.last} ${n.contact.first}hez, a(z) ${n.contact.outlet} újságírójához került – innen a titkolózás.`,
      },
      [CLUE_IDS.dLocation]: {
        title: `Rejtőzködés a ${n.place.spotShort}ban`,
        description: `A koordináták és a füstös ${n.place.spotShort} egybeesnek: ott bujkál, a ${n.place.lake} északnyugati partján.`,
      },
      [CLUE_IDS.dReason]: {
        title: 'Az eltűnés oka: leleplezés + fenyegetés',
        description: 'Azért tűnt el, mert leleplezte a hamis vezetői levelekre futó kifizetéseket; a fenyegetések miatt biztonságos búvóhelyen várta, míg az anyag célba ér.',
      },
    },
    q: {
      prompts: [
        'Hová rejtőzött el?',
        'Kivel tartotta a kapcsolatot az eltűnése előtt?',
        'Milyen rendszert használtak ki a támadók?',
        'Miért tűnt el?',
      ],
      correct: [
        `A ${n.place.lake} északnyugati partján álló ${n.place.spot}ba`,
        `${n.contact.last} ${n.contact.first} – a(z) ${n.contact.outlet} újságírója`,
        `A ${n.project.name} automatikus fizetési motoron`,
        'Mert leleplezte a hamis vezetői levelekre futó kifizetéseket, és fenyegetve érezte magát',
      ],
      requires: [CLUE_IDS.dLocation, CLUE_IDS.press, CLUE_IDS.proj, CLUE_IDS.dReason],
      distractors: [
        [`A ${n.hr.company} új irodájába költözött`, 'Külföldre szökött egy rejtélyes állás miatt', 'A korosfalui lakásában rejtőzködik tovább'],
        [`${n.pm.full} pénzügyi vezető`, `${n.hr.full} (${n.hr.company}, HR)`, 'Egy ismeretlen kriptobefektető'],
        ['A cég e-mail szerverén', 'A beléptetőrendszeren', 'A webshop fizetési felületén'],
        ['Kiégett, csak pihenőre ment', 'Adósságai elől menekült', 'Egy jól fizető külföldi állás miatt költözött'],
      ],
    },
    recap: [
      `${n.victim.full} a(z) ${n.company.name} ${n.project.name} nevű fizetési motorját üzemeltette: a rendszer a „vezetői e-mail utasításokra” önállóan utalt.`,
      `Csalók a vezér nevében – de hamis címről – utalást rendeltek el; a pénz egyetlen korábban sosem látott számlára futott be. ${n.victim.full} ezt dokumentálta, majd belsőleg szólt.`,
      `A válasz lenyugtatás helyett nyomás és fenyegetés volt. Ekkor oknyomozó újságíróhoz fordult: ${n.contact.last} ${n.contact.first}hez, a(z) ${n.contact.outlet} munkatársához, akinek átadta a naplókat.`,
      `Szeptember 11-én vonattal ${n.place.village}re utazott, majd a ${n.place.lake} északnyugati partján álló, évek óta üresen álló ${n.place.spot}ba húzódott vissza, ahol jelmentes búvóhelyen várta, míg az anyag napvilágot lát.`,
      'A hírportál tévesen kiégésre gyanakodott; valójában egy business e-mail compromise (BEC) visszaélést leleplező informátor rejtőzött el szándékosan.',
    ],
  }
}

// ------------------------------------------------------------
// Oldaltartalmak
// ------------------------------------------------------------

function buildCore(n: Names, rng: Rng, noise: number) {
  const socialUrl = `csevegohely.social/${n.victim.social}`
  const devHandleUrl = n.victim.social
  const mailUrl = `mail.${n.company.domain}`

  // ---- feed posztok ----
  const burnoutLine = rng.pick([
    RT('Két hét szabadnap nélkül. ', E(CLUE_IDS.burnout, 'A kiégésemet már a főnököm is látja a távolból'), ', de a sprint meg a sprint. Szünet kell.'),
    RT('Harmadik crunch ebben a negyedévben. ', E(CLUE_IDS.burnout, 'Ez így nem fog jóra menni, ezt már én is érzem'), '.'),
    RT('A kávé már nem segít. ', E(CLUE_IDS.burnout, 'Komolyan gondolkodom a teljes leálláson'), ', csak bírnom kell még egy kicsit.'),
  ])
  const ticketCaption = rng.pick(['Egy út.', 'Odafele.', 'Visszafelé nem tudom mikor.'])
  const posts: PostData[] = [
    { id: 'p-1', author: n.victim.full, handle: n.victim.social, time: DATES.burnout, likes: rng.int(30, 200), body: burnoutLine },
    {
      id: 'p-2',
      author: n.victim.full,
      handle: n.victim.social,
      time: DATES.ticket,
      likes: rng.int(50, 250),
      body: RT(
        'Néhány napra kikapcsolok. ',
        E(CLUE_IDS.ticket, `Jelmentes völgyek, egyirányú vonatjegy a zsebben ${n.place.village}ig.`),
        ' A hétvégén még írok valamit a blogon.',
      ),
      photo: { id: 'ph-train', kind: 'train', caption: RT(`Korosfalu → ${n.place.village}. ${ticketCaption}`) },
    },
    {
      id: 'p-3',
      author: n.victim.full,
      handle: n.victim.social,
      time: DATES.pmRow,
      likes: rng.int(20, 90),
      body: RT(
        `${n.pm.handle} A „csapatjáték” nálam azt jelenti, hogy nem nézem el, `,
        E(CLUE_IDS.pm, `amit a(z) ${n.project.name} az emberekről kiszippant és továbbít`),
        '. Hétfőn beszéljük. Munkaidőben.',
      ),
      replyTo: {
        handle: n.pm.handle,
        body: RT('Kedden leadás. Ne csinálj csapatellenes mókákat, kérlek. A projekt fontosabb, mint a lelked.'),
      },
    },
    {
      id: 'p-4',
      author: n.victim.full,
      handle: n.victim.social,
      time: DATES.flavor,
      likes: rng.int(80, 300),
      body: RT(
        rng.pick([
          'Új monitor nap. A kábelezés megint győzött.',
          'Ma a nyomtatót sikerült életre kelteni. Kis győzelem.',
          'A kollégák szerint a naptárappal kezdjek. Nem fogom.',
        ]),
      ),
    },
  ]

  // ---- devprofil ----
  const commitText = rng.pick([
    'Utolsó commit: „refactor: a naplózási hátsó ajtó eltávolítása” – röviddel ezután archiválva.',
    'Utolsó commit: „hotfix: rejtett export-kapcsoló kikapcsolása” – majd a repó archiválva.',
    'Utolsó commit: „security: csendes naplózás kivétele” – ezután minden ág zárolva.',
  ])
  const repos: RepoData[] = [
    {
      name: n.project.name.toLowerCase() + '-core',
      archived: true,
      lang: rng.pick(['TypeScript', 'Go', 'Kotlin']),
      stars: rng.int(50, 400),
      updated: DATES.commit,
      desc: RT(`A(z) ${n.project.name} magja (privát mirror). `, E(CLUE_IDS.commit, commitText)),
    },
    {
      name: rng.pick(['oldalso-motor', 'jegyzettomb', 'tablakezelo']),
      lang: 'Python',
      stars: rng.int(5, 60),
      updated: 'aug. 30.',
      desc: RT('Régi hobbi projekt. Működik, ha simogatod.'),
    },
  ]

  // ---- fórum ----
  const forumHelper = rng.pick(FORUM_HANDLES)
  const threads: ForumThread[] = [
    {
      id: 'th-1',
      title: 'Kiköltözés jelmentes völgybe – na de hogyan kezdjem?',
      replies: 3,
      pinned: true,
      posts: [
        {
          op: true,
          author: n.victim.forum,
          handle: n.victim.forum,
          time: DATES.forum1,
          body: RT(
            'Sziasztok! Gondolkodom egy ~1 hónapos „digital detox” kiköltözésben. ',
            E(CLUE_IDS.offgrid, 'Mire figyeljek? Napelem, víz, és hogy tényleg ne legyen jel a völgyben?'),
            ' Előre is köszi.',
          ),
        },
        {
          author: forumHelper,
          handle: forumHelper,
          time: DATES.forum1,
          body: RT(`Napelem + 12 V hűtő, esővíz-gyűjtő. A ${n.place.lake} környékén van pár régi ${n.place.spot}, oda a jel nehezen jut le.`),
        },
        {
          author: 'szkeptikus_bela',
          handle: 'szkeptikus_bela',
          time: DATES.forum1,
          body: RT('Figyi, a munkahelyed is olvassa a fórumot. Nem egyszerűbb egy jó hosszú séta?'),
        },
      ],
    },
    {
      id: 'th-2',
      title: 'Elméleti kérdés: ha valaki tud olyat egy nagy cégről, amit nem kellene...',
      replies: 3,
      posts: [
        {
          op: true,
          author: n.victim.forum,
          handle: n.victim.forum,
          time: DATES.forum2,
          body: RT('Hipotetikus szituáció: ha valaki tud olyat egy cégről, ami az embereket érinti, és ezt nem kellene tudnia... kivel érdemes megosztani?'),
        },
        {
          author: `${n.contact.last} ${n.contact.first[0]}. (${n.contact.outlet})`,
          handle: `press_${outletSlug(n.contact.outlet).slice(0, 8)}`,
          time: DATES.forum2,
          body: RT(
            'Üzenem, akinek ez ismerős: oknyomozó újságíró vagyok, forrásvédelemmel dolgozom. ',
            E(CLUE_IDS.press, `Bátran írj: ${n.contact.email} – diszkréten, titkosítva.`),
            ' A nyilvánosság néha védőpáncél is.',
          ),
        },
        {
          author: n.victim.forum,
          handle: n.victim.forum,
          time: DATES.forum2,
          body: RT('Köszönöm. ', B('Jelzem: a témáról csak egy emberrel folytatom a beszélgetést.'), ' Ennyi.'),
        },
      ],
    },
    {
      id: 'th-3',
      title: 'Felújítás a művelődési háznál – ki fizeti?',
      replies: 11,
      posts: [
        {
          op: true,
          author: 'kertesz_anna',
          handle: 'kertesz_anna',
          time: DATES.forum3,
          body: RT('A tetőt mostanra kell csinálni, de az önkormányzat szerint „jövőre járhatóbb”. Vélemények?'),
        },
        { author: 'szkeptikus_bela', handle: 'szkeptikus_bela', time: DATES.forum3, body: RT('„Jövőre” = soha, mint mindenhol.') },
      ],
    },
  ]
  if (noise >= 1) {
    threads.push({
      id: 'th-4',
      title: 'Ki tud ajánlani jó kemencevarró mestert?',
      replies: 4,
      posts: [
        { op: true, author: forumHelper, handle: forumHelper, time: 'szept. 01.', body: RT('A régi kemence reped, varratni kellene. Ajánlások?') },
        { author: 'furesz_tibi', handle: 'furesz_tibi', time: 'szept. 01.', body: RT('Nálunk a Kovács bácsi dolgozott, korrekt ár.') },
      ],
    })
  }
  if (noise >= 2) {
    threads.push({
      id: 'th-5',
      title: 'Gombászok: idén számítani lehet a rókagombára?',
      replies: 6,
      posts: [
        { op: true, author: 'erdo_jaró', handle: 'erdo_jaro', time: 'szept. 03.', body: RT('Az esők után jó szelesedés várható a fenyvesekben. Ki volt már odalent?') },
        { author: 'szkeptikus_bela', handle: 'szkeptikus_bela', time: 'szept. 03.', body: RT('A helyek titkát őrzni kell. Kérdezz-googlezz.') },
      ],
    })
  }
  if (noise >= 3) {
    threads.push({
      id: 'th-6',
      title: 'VITA: a régi híd helyére körforgalom kellene?',
      replies: 31,
      posts: [
        { op: true, author: 'sofor_imi', handle: 'sofor_imi', time: 'szept. 05.', body: RT('A híd szűk, a körforgalom megoldaná a reggeli dugót. Vélemények?') },
        { author: 'kertesz_anna', handle: 'kertesz_anna', time: 'szept. 05.', body: RT('Egy faluban körforgalom? Hová, a templom köré?') },
        { author: 'sofor_imi', handle: 'sofor_imi', time: 'szept. 05.', body: RT('Még egy tábla és mindenki boldog.') },
      ],
    })
  }

  // ---- emailek ----
  const phish = rng.pick(PHISH_FROMS)
  const emails: EmailData[] = [
    {
      id: 'em-1',
      from: `${n.relative.first} ${n.victim.last}`,
      fromEmail: n.relative.email,
      subject: 'Felveszed végre a telefont?',
      date: DATES.family,
      unread: true,
      body: RT(
        'Haver!',
        '\n\n',
        'Hetek óta nem veszed fel a telefont. ',
        E(CLUE_IDS.family, 'Ha ez a „kikapcsolós” dolog megint ilyen hosszú lesz, személyesen beugrom Korosfalura.'),
        '\n\n',
        'Hívj vissza, akár jel nélkül is.',
      ),
    },
    {
      id: 'em-2',
      from: '(nincs feladó)',
      fromEmail: n.secretMail,
      subject: '(nincs tárgy)',
      date: DATES.secret,
      unread: true,
      body: RT(
        'Ha ezt a címet látod, akkor a régi fiók még él.',
        '\n\n',
        E(CLUE_IDS.coords, `Minden fontos: ${n.place.coords}. Csak ha sürgős, és csak annak, aki tudja, hol van a fenyves.`),
        '\n\n',
        'Ne válaszolj erre a címre.',
      ),
    },
    {
      id: 'em-3',
      from: n.hr.full,
      fromEmail: `${lo(n.hr.full.split(' ')[1])}@${outletSlug(n.hr.company)}.hu`,
      subject: `Állásajánlat – senior szerep (${n.hr.company})`,
      date: DATES.offer,
      body: RT(
        'Kedves Alex!',
        '\n\n',
        'A múlt heti beszélgetés után lelkesen jelentettem, hogy a csapat szeretne veled dolgozni. ',
        E(CLUE_IDS.offer, 'A hivatalos ajánlatot szept. 15-ig benyújtjuk: 25%-kal magasabb bér, távmunka, új platform.'),
        '\n\n',
        'Számolj, gondolkodj, és jelezz.',
      ),
    },
    {
      id: 'em-4',
      from: `${n.company.name} Értesítő`,
      fromEmail: `newsletter@${n.company.domain}`,
      subject: 'Q3 roadmap-előzetes – csapatkörlevél',
      date: DATES.newsletter,
      body: RT(
        'Kedves Kollégák!',
        '\n\n',
        `A(z) ${n.project.name} migrációja ütemterv szerint halad. Részletek a belső wikiben.`,
        '\n\n',
        'Kellemes munkát!',
      ),
    },
    {
      id: 'em-5',
      phishing: true,
      from: phish.from,
      fromEmail: phish.email,
      subject: 'FIGYELEM: fiókja 24 órán belül lejár!',
      date: DATES.phish,
      body: RT(
        'Tisztelt Felhasználó!',
        '\n\n',
        'Fiókja biztonsági ellenőrzése miatt 24 órán belül kattintson az alábbi linkre.',
        '\n\n',
        B('KATTINTSON IDE AZONNAL'),
        '\n\n',
        'Üdvözlettel, Támogatás',
      ),
    },
  ]
  if (noise >= 1) {
    emails.push({
      id: 'em-6',
      from: 'KriptoNyereség Klub',
      fromEmail: 'nyerj@kriptoklub-biztonsagos.info',
      subject: 'Végre: 340% hozam 3 hónap alatt?',
      date: 'szept. 07. · 19:02',
      body: RT('Korlátozott helyek!', '\n\n', B('Befektess most, és vedd vissza kétszeresen.'), '\n\n', 'Ez nem befektetési tanácsadás. Egyáltalán nem.'),
    })
  }
  if (noise >= 2) {
    emails.push({
      id: 'em-7',
      from: 'SzuperSorsolás',
      fromEmail: 'nyertes@szupersorsolas-tegnap.net',
      subject: 'Ön nyert! (utolsó felszólítás)',
      date: 'szept. 08. · 08:47',
      body: RT('Kedves Címzett!', '\n\n', 'E-mail címét sorsoláson találtuk. ', B('Küldd el a lakcímedet az ajándékért.'), '\n\n', 'Üdv: Díj-osztály'),
    })
  }
  if (noise >= 3) {
    const phish2 = rng.pick(PHISH_FROMS.filter((p) => p.email !== phish.email))
    emails.push({
      id: 'em-8',
      phishing: true,
      from: phish2.from,
      fromEmail: phish2.email,
      subject: 'CSOMAGJÁT VÁM-ELLENŐRZÉS ALATT TARTJUK',
      date: 'szept. 08. · 21:15',
      body: RT('Tisztelt Ügyfél!', '\n\n', 'Csomagja átvételehez ', B('adja meg bankkártya-adatait az azonosításhoz'), '.', '\n\n', 'Posta Ügyfélszolgálat'),
    })
    emails.push({
      id: 'em-9',
      from: 'Értesítő+',
      fromEmail: 'hirlevel@ertesito-plus-hirek.info',
      subject: 'Ezt a 7 szokást minden lakótárs utálja!',
      date: 'szept. 09. · 06:30',
      body: RT('Kattints a listáért!', '\n\n', 'Egy kattintás = egy támogatás. Vagy kettő. Minden így működik.'),
    })
  }

  // ---- galéria ----
  const photos: PhotoData[] = [
    {
      id: 'ph-lake',
      kind: 'lake',
      caption: RT(`Hajnali köd a ${n.place.lake} felett. Csend, csak a víz.`),
      geotag: { label: `${n.place.lake}, déli part` },
    },
    {
      id: 'ph-cabin',
      kind: 'cabin',
      caption: RT(`Ez a régi ${n.place.spot} évekig üresen állt. `, E(CLUE_IDS.cabin, 'A múlt héten viszont füstöt láttam a kéményéből – valaki ott lakik.')),
      geotag: { label: `${n.place.lake}, északnyugati part` },
      comments: [
        { author: 'turista_eva', body: RT('Mi?! Ott nem volt áram húsz éve!') },
        { author: 'pixelvadasz', body: RT('Így van. Valószínű napelemes. Egy alak sétált a parton, de messze volt.') },
      ],
    },
    { id: 'ph-town', kind: 'city', caption: RT('Korosfalu a dombról, naplementekor.'), geotag: { label: 'Korosfalu' } },
    { id: 'ph-abstract', kind: 'abstract', caption: RT('Kísérlet: hosszú záridő a vízen.') },
  ]

  // ---- blog ----
  const misuseText = rng.pick([
    `rájöttem, hogy a „névtelenített” adatokat a(z) ${n.project.name} rejtetten összekapcsolja, és külső partnereknek továbbítja`,
    `kiderült: a rendszer fantombeszállítókat fizet ki, a naplók egyetlen rejtett számlához futnak be`,
    `arra jöttem, hogy a nevem alatt ismeretlen „toborzói” profilok léteznek, és adatokat kérnek az emberektől`,
  ])
  const threatText = rng.pick([
    'ismeretlen számokról fenyegető üzeneteket kapok, és a lakásom ajtajában kétszer is fordult a kilincs',
    'névtelen hívások zaklatnak, és egy autó napokig állt az utcán a bejáratom előtt',
    'megfenyegettek, hogy „ne kavartam volna” – és a postafiókom valaki kinyitva hagyta',
  ])
  const blog = [
    {
      id: 'bp-last',
      title: rng.pick(['Miért nem jelentkezem (egyelőre)', 'Néhány mondat, mielőtt eltűnöm', 'Ez a bejegyzés ütemezve van']),
      date: DATES.blogMain,
      body: [
        RT('Ha ezt olvasod, akkor én már nem vagyok elérhető. Nem történt baj – csak egy időre le kell állnom.'),
        RT('Két éve dolgozom a ', L(n.company.name + 'nál', n.company.domain), '. Augusztusban ', E(CLUE_IDS.misuse, misuseText), '. Ez nem az, amit aláírtam.'),
        RT('Szóltam belsőleg. A válasz: „ne bonyolítsd”. Azóta ', E(CLUE_IDS.threat, threatText), '.'),
        RT('Az anyag egy olyan embernél van, akiben megbízom. Ha velem bármi történik, ő tudni fogja, mi a teendő.'),
      ],
    },
    {
      id: 'bp-hobby',
      title: rng.pick(['ESP32 kutyaeledel-automata – 3. rész', 'A növényöntözés végre automatizálva', 'Vonatjegy-statisztikám idén']),
      date: DATES.blogHobby,
      body: [RT('Rövid bejegyzés: a harmadik verzió végül nem robbant fel, ami önmagában siker.'), RT('A részletek a repóban.')],
    },
  ]

  // ---- hír ----
  const news = {
    headline: `${n.victim.full} eltűnt Korosfaluból – a család aggódik`,
    lead: `${n.victim.full} szeptember 11-én hagyta el lakását; azóta nem jelentkezett.`,
    author: rng.pick(NEWS_AUTHORS),
    body: [
      RT(
        `${n.victim.full} korosfalui szakember szeptember 11-én hagyta el lakását; munkaadója, a `,
        L(n.company.name, n.company.domain),
        ' a távollétét „tervezett szabadságként” írta le lapunknak.',
      ),
      RT('A család szerint hetekkel korábban is furcsán viselkedett: hangoztatta, hogy „kikapcsol egy időre”.'),
      RT(
        E(CLUE_IDS.seen, `Az utolsó hiteles látmány szeptember 11-én, a ${n.place.village.toLowerCase()}i vasútállomás kameráin készült.`),
        ' Onnan gyalogosan, a tó irányában látták elindulni.',
      ),
      RT('A rendőrség nyomozást indított; a család minden információt vár.'),
    ],
    related: [
      { label: `Interaktív térkép: ${n.place.lake} környéke`, url: 'terkep.elo/korosfalu' },
      { label: `${n.victim.full} profilja a DevKapcsolaton`, url: `devkapcsolat.io/${devHandleUrl}` },
    ],
  }

  // ---- cég ----
  const company = {
    hero: `${n.company.name} – adat, ami dolgozik.`,
    about: [
      RT(`A(z) ${n.company.name} 2015-ben alakult Korosfaluban. Negyvenfős csapatunk ${n.project.tagline} megoldásokat fejleszt közép- és nagyvállalatoknak.`),
      RT('Mottónk: „Az adat akkor ér valamit, ha dolgozik.”'),
    ],
    projects: [
      {
        name: n.project.name,
        tagline: n.project.tagline,
        status: rng.pick(['2.1 – aktív fejlesztés', '3.0 – aktív fejlesztés', '1.9 – bővítés alatt']),
        desc: RT(
          `A(z) ${n.project.name} `,
          E(
            CLUE_IDS.proj,
            'bármilyen forrásból – naptárakból, üzenetekből, dokumentumokból – egységesítve gyűjti és kapcsolja össze a munkavállalói adatokat',
          ),
          ' a vezetői riportokhoz.',
        ),
      },
      {
        name: rng.pick(['NeonLedger', 'SzámLedger', 'Bérgép']),
        tagline: 'Számlázó- és könyvelőrendszer',
        status: 'stabil',
        desc: RT('Tíz éve megbízhatóan számláz. A könyvelők imádják.'),
      },
      {
        name: rng.pick(['Villanás', 'Pulzusmérő', 'Éberpilóta']),
        tagline: 'Szervermonitorozás',
        status: 'béta',
        desc: RT('Valós idejű riasztások, ha a szerverpark élete veszélyben van.'),
      },
    ],
    contact: `${n.company.street}, Korosfalu`,
  }

  // ---- térkép ----
  const pins = [
    {
      id: 'pin-office',
      x: 74,
      y: 40,
      label: `${n.company.name} (Iparpark)`,
      kind: 'office' as const,
      info: RT(`${n.company.street}. A fejlesztői emelet szept. 11. óta üresen áll.`),
    },
    {
      id: 'pin-home',
      x: 57,
      y: 63,
      label: 'Lakás (Belső körút)',
      kind: 'home' as const,
      info: RT('A szomszédok szerint szept. 11-én reggel gyalogszerrel indult el, hátizsákkal.'),
    },
    {
      id: 'pin-station',
      x: 45,
      y: 72,
      label: `${n.place.village} állomás`,
      kind: 'station' as const,
      info: RT('Kisállomás, egy vágány. Innen a tó gyalog kb. 40 perc.'),
    },
    {
      id: 'pin-lake',
      x: 33,
      y: 36,
      label: n.place.lake,
      kind: 'poi' as const,
      info: RT('Horgásztó és kirándulóhely. Az északnyugati part csak ösvényen érhető el.'),
    },
    {
      id: 'pin-cabin',
      x: 17,
      y: 20,
      label: `Régi ${n.place.spot}`,
      kind: 'cabin' as const,
      info: RT(E(CLUE_IDS.mapcabin, `A térkép jelölése: „${n.place.spot} – használaton kívüli”.`), ` A koordináták (${n.place.coords}) pontosan ide esnek.`),
    },
  ]

  const bioSegs = RT(
    'Full-stack szakember a ',
    L(n.company.name + 'nél', n.company.domain),
    '. Adatfolyamok, billentyűzetek, csend. Jelenleg: ',
    B('szabadság.'),
  )

  // ---- közvetlen üzenetek (Csevegőhely DM) ----
  const dmUrl = `${socialUrl}/uzenetek`
  const dm: CoreOpts['dm'] = {
    url: dmUrl,
    partner: 'K. L.',
    handle: '@kl_forrasvedo',
    messages: [
      {
        id: 'dm-1',
        from: 'me',
        author: n.victim.full,
        time: 'szept. 05. · 22:10',
        body: RT('Na. Úgy döntöttem, beszélek. De csak egy emberrel.'),
      },
      {
        id: 'dm-2',
        from: 'them',
        author: 'K. L.',
        time: 'szept. 05. · 22:12',
        body: RT('Jó, hogy itt látod magad – ez a csatorna nem naplóz. Beszélj.'),
      },
      {
        id: 'dm-3',
        from: 'me',
        author: n.victim.full,
        time: 'szept. 05. · 22:14',
        body: RT(
          'A fórumos mondatom komoly volt: ',
          E(CLUE_IDS.kl, 'a témáról csak veled folytatom, K.L. – mert te forrásként név nélkül kezelsz'),
          '. De előbb garanciát kérek.',
        ),
      },
      {
        id: 'dm-4',
        from: 'them',
        author: 'K. L.',
        time: 'szept. 05. · 22:19',
        body: RT('Garancia: titkosított csatorna, ellenőrzött tények, forrásvédelem. Ha jön az anyag, én védem.'),
      },
      {
        id: 'dm-5',
        from: 'me',
        author: n.victim.full,
        time: 'szept. 06. · 07:03',
        body: RT('A dokumentumok hamarosan megérkeznek. Utána egy időre eltűnöm.'),
      },
      {
        id: 'dm-6',
        from: 'them',
        author: 'K. L.',
        time: 'szept. 06. · 07:41',
        body: RT('Csak ne tűnj el nyomtalanul. Ha biztonságban vagy, jelizz egy rövid jelzéssel.'),
      },
    ],
  }

  return {
    socialUrl,
    devHandleUrl,
    mailUrl,
    galleryUrl: 'kepmegoszto.hu/pixelvadasz/osz-vizek',
    newsUrl: 'napi.pulzus/cikk/eltunt-szakember',
    blogUrl: lo(n.victim.first) + lo(n.victim.last) + '.dev',
    dm,
    bioSegs,
    posts,
    repos,
    threads,
    emails,
    photos,
    news,
    company,
    blog,
    pins,
  }
}

// ------------------------------------------------------------
// Összeállítás
// ------------------------------------------------------------

export interface GenerateOptions {
  variant?: CaseVariant | 'random'
  level?: 2 | 3 | 4 | 5
}

export function generateCase(code: string, opts: GenerateOptions = {}): GameCase {
  if (!SEED_RE.test(code)) throw new Error(`Érvénytelen esetkód: ${code}`)
  const rng = new Rng(code)
  const variant: CaseVariant =
    !opts.variant || opts.variant === 'random'
      ? rng.pick(['missing', 'fraud', 'identity', 'bec'] as const)
      : opts.variant
  const level = opts.level ?? 2
  // 0 = tiszta, 1 = extra tévutak (3), 2 = sok tévút (4), 3 = extrém zaj (5)
  const noise = Math.max(0, Math.min(3, level - 2))

  const n = pickNames(rng)
  const pack =
    variant === 'missing'
      ? missingPack(n, rng)
      : variant === 'fraud'
        ? fraudPack(n, rng)
        : variant === 'identity'
          ? identityPack(n, rng)
          : becPack(n, rng)
  const core = buildCore(n, rng, noise)

  const gameCase: GameCase = {
    id: `gen-${code}`,
    code: `AKTA-${code}`,
    title: pack.title,
    tagline: pack.tagline,
    briefing: pack.briefing,
    difficulty: level as GameCase['difficulty'],
    homeUrl: 'spotlight.kereso',
    searchDomain: 'spotlight.kereso',
    bookmarks: [core.mailUrl, `devkapcsolat.io/${core.devHandleUrl}`, core.socialUrl, 'korosnivel.forum'],
    websites: buildSites(n, rng, core),
    clues: clueList(n, pack.texts),
    connections: buildConnections(),
    objectives: buildObjectives(),
    finalQuestions: buildQuestions(pack.q),
    solutionRecap: pack.recap,
  }

  const errors = validateCase(gameCase)
  if (errors.length > 0) {
    throw new Error(`Generált eset (${code}) hibás:\n` + errors.join('\n'))
  }
  return gameCase
}
