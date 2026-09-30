/**
 * Képernyőképek készítése a README-hez.
 * Futtatás: előbb `npm run preview`, aztán `node scripts/screenshots.mjs`
 * Kimenet: docs/screenshots/*.png
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const BASE = process.env.BASE_URL ?? 'http://localhost:4173/osint_game/'
const OUT = new URL('../docs/screenshots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const text = (t) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 10000 }, t)
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

// 1) Menü
await page.goto(BASE, { waitUntil: 'networkidle0' })
await text('CASEFILE')
await sleep(600)
await page.screenshot({ path: OUT + 'menu.png' })
console.log('OK  docs/screenshots/menu.png')

// 2) Játékmenet: eset indítása, navigáció Alex feedjére, nyom felfedezése
await clickByText('button', 'Nyomozás indítása')
await page.waitForSelector('input[placeholder^="Keress"]', { timeout: 8000 })
await page.type('input[placeholder="Cím vagy keresés..."]', 'csevegohely.social/@alex_carter')
await page.keyboard.press('Enter')
await text('kód, kávé, kutyák')
await clickByText('button', 'A kiégésemet már a főnököm is látja a távolból')
await text('Új nyom!')
await sleep(600)
await page.screenshot({ path: OUT + 'jatek.png' })
console.log('OK  docs/screenshots/jatek.png')

await browser.close()
console.log('KÉSZ')
