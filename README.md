# CASEFILE – fiktív OSINT nyomozós játék

A CASEFILE egy böngészőben futó nyomozós játék: fiktív weboldalakat, profilekat, leveleket, fórumokat és térképet túrsz át, hogy összekapcsold a nyomokat és megoldhasd az ügyet.

> **Fontos:** a játékban minden szereplő, cég, helyszín és esemény **kitalált**. Valós személyekről vagy szervezetekről nem gyűjt adatot a játék – ez egy tisztán fikciós, oktatási szórakoztató projekt.

## Játékmenet

- **Hamis internet:** kereső (Spotlight), devprofil, közösségi feed, fórum, webmail, képgaléria (generált fotókkal), hírportál, cégoldal, blog és interaktív térkép – mindegyik kattintható **nyomokat** rejt.
- **Nyomok és összefüggések:** a kiemelt szövegrészekre kattintva nyomokat fedezel fel; két nyomot a jobb oldali panelen **összekapcsolhatsz**, és a helyes párosok következtetést adnak.
- **Célkitűzések** automatikusan teljesülnek, ahogy haladsz.
- **Záró jelentés:** 4 feleletválasztós kérdés – de a helyes válasz csak akkor nyílik fel, ha megtaláltad a hozzá tartozó nyomot. 3 hibás beküldés = bukta, siker esetén pontszám + nyomozói rang (S/A/B/C).
- **Végtelen akták:** a menüben generálhatsz véletlen ügyeket. A generátor determinisztikus: ugyanaz az **esetkód** (pl. `K7F2Q`) mindig ugyanazt az aktát adja, így megoszthatod a barátaiddal.
- A haladás (nyomok, jegyzetek, állás) a böngésző **localStorage**-ában tárolódik, nem kell hozzá szerver.

## Futtatás helyben

Előfeltétel: [Node.js](https://nodejs.org) 20+ (ajánlott 22+).

```bash
npm install
npm run dev
```

Ezután nyisd meg: **http://localhost:5173/osint_game/**

Éles build és előnézet:

```bash
npm run build
npm run preview   # http://localhost:4173/osint_game/
```

## Beépített ellenőrző szkriptek

```bash
npm run verify     # minden eset végigjárhatóság-ellenőrzése
npm run gen-test   # 30 véletlen kód generálása + validálása
npm run smoke      # fejnélküli böngészős füstteszt (Edge szükséges hozzá)
npm run sim        # játékmenet-szimuláció (győzelem/bukta útvonal)
```

A `verify` a CI-ban is fut: hibás, megoldhatatlan eset esetén a build nem megy ki.

## Publikálás GitHub Pages-re

A repó tartalmaz egy kész GitHub Actions workflow-t (`.github/workflows/deploy.yml`), amely minden `main` ágra pusholáskor buildel és kiteszi az oldalt.

1. **Hozz létre egy publikus repót** a GitHubon néven `osint_game` (ha más nevet adsz neki, lásd lentebb!).
2. A projekt mappájában:

   ```bash
   git init
   git add .
   git commit -m "CASEFILE MVP"
   git branch -M main
   git remote add origin https://github.com/FELHASZNALONEVED/osint_game.git
   git push -u origin main
   ```

3. A repóban: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Néhány perc múlva elérhető: `https://FELHASZNALONEVED.github.io/osint_game/`

### Ha más nevet adsz a repónak

Nyisd meg a `vite.config.ts` fájlt, és írd át a `base` értékét a repo nevére:

```ts
base: '/uj-repo-neved/',
```

A Pages URL ekkor: `https://FELHASZNALONEVED.github.io/uj-repo-neved/`

## Hol van a játéktartalom? (bővítési útmutató)

Minden tartalom **adatvezérelt** – a motorhoz nem kell nyúlnod új eset hozzáadásához.

| Mit | Hol |
|---|---|
| Kézzel írott esetek | `src/data/cases/` – egy eset = egy fájl (pl. `case001.ts`), regisztrálás: `src/data/cases/index.ts` |
| Eset típusai (Page, Clue, Connection…) | `src/data/types.ts` |
| Generátor: történet-sablonok | `src/gen/generate.ts` (`missingPack`, `fraudPack`, `identityPack`) |
| Generátor: nevek, cégek, helyek | `src/gen/pools.ts` |
| Megoldhatóság-ellenőrző | `src/gen/validate.ts` (futtatás: `npm run verify`) |
| Kereső | automatikus – a `src/data/search.ts` az eset oldalairól épít indexet |
| UI / oldal-renderelők | `src/components/` |

### Új kézzel írott eset hozzáadása

1. Másold le a `src/data/cases/case001.ts` fájlt, pl. `case002.ts`, és írd át a tartalmát (a `GameCase` típus vezet – a mezők maguktól értelmezhetők).
2. Add hozzá a listához: `src/data/cases/index.ts` → `staticCases: [case001, case002]`.
3. Futtass `npm run verify`-t – ha zöld, az eset garantáltan végigjátszható.

### Új generátor-sablon hozzáadása

1. A `src/gen/generate.ts`-ben írj egy új `xxxPack(n, rng)` függvényt a meglévők mintájára (cím, briefing, 19 nyomszöveg, 4 zárókérdés, recap).
2. Vedd fel a `CaseVariant` unióba és a `generateCase` elágazásába.
3. `npm run gen-test` – sok seeden ellenőrzi, hogy minden generált változat megoldható.

## Technológia

- [Vite](https://vite.dev) + React 19 + TypeScript
- Tailwind CSS v4, lucide-react ikonok
- Zustand (perzisztens játékállapot)
- Saját, seed-alapú procedurális generátor + beépített megoldhatóság-validátor
- Teljesen offline futó: a „fotók” determinisztikusan generált SVG-k, nincs külső kérés

## Tervezett bővítések

- Több sablon (eltűnt háziállat, business e-mail compromise, Deepfake-ügy…)
- Időkorlátos ranglista-mód
- Saját szerkesztő eszköz esetekhez
