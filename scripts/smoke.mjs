/**
 * Fej nélküli füstteszt: végigkattintja a játék fő útját.
 * Futtatás: előbb `npm run preview`, aztán `node scripts/smoke.mjs`
 */
import puppeteer from 'puppeteer-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.BASE_URL ?? 'http://localhost:4173/osint_game/'

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 900 })

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push('console: ' + msg.text())
})
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const text = (t) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 8000 }, t)
const clickByText = async (sel, t) => {
  const ok = await page.evaluate(
    (sel, t) => {
      const els = [...document.querySelectorAll(sel)]
      const el = els.find((e) => e.textContent?.includes(t))
      if (el) {
        el.click()
        return true
      }
      return false
    },
    sel,
    t,
  )
  if (!ok) throw new Error(`Nem található: ${sel} "${t}"`)
}

try {
  // 0) első indítási bemutató (ha megjelenik), kihagyása
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === 'kihagyom')
    btn?.click()
  })
  await sleep(300)

  // 1) menü betölt
  await page.goto(BASE, { waitUntil: 'networkidle0' })
  await text('CASEFILE')
  await text('Az eltűnt fejlesztő')
  await text('Napi akta')
  console.log('OK  menü betölt')

  // 1a) napi akta elindul
  await clickByText('button', 'Napi nyomozás indítása')
  await page.waitForSelector('input[placeholder^="Keress"]', { timeout: 8000 })
  console.log('OK  napi akta elindult')
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[title]')].find((b) => b.title === 'Vissza az aktákhoz')
    btn?.click()
  })
  await text('CASE-001')
  console.log('OK  vissza a menüből a napi akta után')

  // 1b) generátor: új akta létrehozása és indítása
  await clickByText('button', 'Új akta generálása')
  await sleep(600)
  const genCode = await page.evaluate(() => {
    const el = [...document.querySelectorAll('span')].find((s) => s.textContent?.startsWith('AKTA-'))
    return el?.textContent ?? null
  })
  if (!genCode) throw new Error('Nem generálódott AKTA-kód a menüben')
  await page.waitForSelector('input[placeholder^="Keress"]', { timeout: 8000 })
  console.log('OK  generátor: ' + genCode + ' elindult')

  // 1c) chat (DM) oldal a generált esetben
  const socialUrl = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[title]')].find((b) => b.title?.startsWith('csevegohely.social/@'))
    return btn?.title ?? null
  })
  if (!socialUrl) throw new Error('Nem található Csevegőhely könyvjelző')
  await page.type('input[placeholder="Cím vagy keresés..."]', socialUrl + '/uzenetek')
  await page.keyboard.press('Enter')
  await text('titkosított')
  await text('K. L.')
  console.log('OK  chat oldal betölt (DM: K. L.)')

  // vissza a menübe
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[title]')].find((b) => b.title === 'Vissza az aktákhoz')
    btn?.click()
  })
  await text('CASE-001')
  await text(genCode)
  console.log('OK  generált akta megjelenik a menüben')

  // 2) eset indítása
  await clickByText('button', 'Nyomozás indítása')
  await text('Spotlight')
  await page.waitForSelector('input[placeholder^="Keress"]', { timeout: 8000 })
  console.log('OK  eset indult, kereső betölt')

  // 3) navigáció a címsávval Alex feedjére
  await page.type('input[placeholder="Cím vagy keresés..."]', 'csevegohely.social/@alex_carter')
  await page.keyboard.press('Enter')
  await text('kód, kávé, kutyák')
  console.log('OK  navigáció: feed betölt')

  // 4) nyom felfedezése
  const before = await page.evaluate(() => window.localStorage.getItem('casefile-v1'))
  await clickByText('button', 'A kiégésemet már a főnököm is látja a távolból')
  await sleep(400)
  await text('Új nyom!')
  const after = await page.evaluate(() => window.localStorage.getItem('casefile-v1'))
  if (before === after) throw new Error('A nyom felfedezés nem írta a store-t')
  console.log('OK  nyom felfedezve + toast megjelent')

  // 4b) tipp kérése
  await clickByText('button', 'Tipp kérése')
  await text('Tipp a központból')
  console.log('OK  tipp rendszer működik')

  // 5) kereső működik
  await clickByText('button', 'spotlight.kereso')
  await page.waitForSelector('input[placeholder^="Keress"]', { timeout: 8000 })
  await page.type('input[placeholder="Keress a fiktív neten..."]', 'Nightjar')
  await page.keyboard.press('Enter')
  await text('keresésének eredményei')
  await text('NeonByte Kft.')
  console.log('OK  keresés eredményes')

  // 6) találatra kattintás → cégoldal
  await clickByText('button', 'NeonByte Kft. – hivatalos oldal')
  await text('adat, ami dolgozik')
  await clickByText('button', 'bármilyen forrásból – naptárakból, üzenetekből, dokumentumokból')
  await sleep(300)
  console.log('OK  cégoldal + nyom')

  // 7) böngésző vissza gomb
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[title]')].find((b) => b.title === 'Vissza')
    btn?.click()
  })
  await text('keresésének eredményei')
  console.log('OK  vissza-navigáció')

  // 8) térkép pin
  await page.type('input[placeholder="Cím vagy keresés..."]', 'terkep.elo/korosfalu')
  await page.keyboard.press('Enter')
  await text('kattints a jelölőkre')
  await clickByText('button', 'Régi erdészeti faház')
  await text('használaton kívüli')
  console.log('OK  térkép pin + info')

  // 9) beküldő modal: zárolt opciók látszanak
  await clickByText('button', 'Jelentés beadása')
  await text('Záró jelentés')
  const lockedCount = await page.evaluate(
    () => [...document.querySelectorAll('div')].filter((d) => d.textContent === 'Zárolt – további nyom(ok) kellenek hozzá').length,
  )
  if (lockedCount < 2) throw new Error('Vártunk legalább 2 zárolt opciót, kaptunk: ' + lockedCount)
  console.log('OK  záró jelentés modal, zárolt opciók:', lockedCount)

  await page.keyboard.press('Escape')
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.querySelector('svg.lucide-x'))
    btn?.click()
  })
  await sleep(200)

  // 10) mobil: drawerek elérhetők és működnek
  await page.setViewport({ width: 390, height: 844 })
  await sleep(400)
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[title]')].find((b) => b.title === 'Nyomok, jegyzet, kapcsolás')
    if (!btn) throw new Error('Mobil: nincs tools gomb')
    btn.click()
  })
  await text('NYOMOZÁSI ESZKÖZÖK')
  await text('Jegyzet')
  console.log('OK  mobil: tools drawer nyílik')
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[aria-label]')].find((b) => b.ariaLabel === 'Bezárás')
    btn?.click()
  })
  await sleep(300)
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[title]')].find((b) => b.title === 'Akta adatai')
    if (!btn) throw new Error('Mobil: nincs akta gomb')
    btn.click()
  })
  await text('AKTA')
  await text('RÖVIDÍTÉS')
  console.log('OK  mobil: akta drawer nyílik')
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button[aria-label]')].find((b) => b.ariaLabel === 'Bezárás')
    btn?.click()
  })
  await sleep(200)

  console.log('\nMINDEN FÜSTTESZT ZÖLD')
} catch (e) {
  errors.push('futás: ' + e.message)
}

if (errors.length > 0) {
  console.error('\nHIBÁK:')
  for (const e of errors) console.error(' - ' + e)
  await browser.close()
  process.exit(1)
}
await browser.close()
