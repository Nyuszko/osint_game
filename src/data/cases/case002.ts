import type { GameCase } from '../types'
import { B, E, L, RT } from '../rich'

// ============================================================
// CASE-002 – A hamis gyűjtő
// Minden szereplő, cég és hely KITALÁLT.
// ============================================================

export const case002: GameCase = {
  id: 'case-002',
  code: 'CASE-002',
  title: 'A hamis gyűjtő',
  tagline: 'Árvíz sújtja a vidéket. A segélyezők közé csaló bújkál.',
  difficulty: 3,
  homeUrl: 'spotlight.kereso',
  searchDomain: 'spotlight.kereso',
  bookmarks: [
    'mail.muvhaz.kf',
    'csevegohely.social/@arviz_segely_kf',
    'napi.pulzus/cikk/fenyvesfalui-arviz',
    'korosnivel.forum',
  ],
  briefing: [
    'Szeptember elején kiöntött a Fenyves-patak: Fenyvesfalu részben víz alatt áll. A szolidaritás nagy – és ezt valaki kihasználja.',
    'A „Korosfalui Árvízsegély” néven futó online gyűjtés ezreket kapott be, de egyetlen károsult sem látott belőle segélyt. Az alapítvány a hivatalos nyilvántartásban nem létezik.',
    'Kutass a fiktív interneten: ki áll a gyűjtés mögött, mi árulja el, hogy előre megírt séma, és honnan vannak a „katasztrófafotók”.',
    'Minden szereplő és helyszín kitalált.',
  ],
  solutionRecap: [
    'A „Korosfalui Árvízsegély” augusztus 28-án, három nappal az árvíz ELŐTT kezdett gyűjteni – a „természeti katasztrófa” a kampány indítása után történt.',
    'A gyűjtésen mutogatott katasztrófafotók valójában pixelvadasz augusztusi, a Kővölgyi-tónál készült viharfelhő-képei voltak, engedély nélkül beillesztve.',
    'A FolyóPay fizetési fiók tulaja egyéni vállalkozóként Mákvölgyi Csongor; ő válaszolgat a fórumon „csongi_watt” néven, és a márciusi, leleplezett „szárcsapat-gyűjtésnél” ugyanezt a felszólító sablont használta.',
    'A „raktárként” feltüntetett fenyvesfalui üzlethelyiség évek óta üresen áll – a segélyszállítmányok sosem léteztek.',
    'A pénz a Csongi Bt.-n át magánszámlára futott be: klasszikus, több fordulóra ismételt hamis adománygyűjtési séma.',
  ],
  clues: [
    {
      id: 'clue_flood_date',
      title: 'Az árvíz időpontja: szeptember 2–3.',
      description:
        'A hírportál szerint a Fenyves-patak szeptember 2-án éjjel kiöntött; szeptember 3-án délutánra állt le az eső.',
      source: 'napi.pulzus',
      category: 'egyeb',
    },
    {
      id: 'clue_campaign_start',
      title: 'A gyűjtés augusztus 28-án indult',
      description:
        'Az „Árvízsegély” első bejegyzése augusztus 28-án kelt: „felkészülünk a viharokra” – öt nappal az árvíz előtt.',
      source: 'csevegohely.social',
      category: 'egyeb',
    },
    {
      id: 'clue_stolen_photos',
      title: 'A „katasztrófafotók” ismerősek',
      description:
        'A gyűjtő posztjainak fotóin sehol nincs víz a házaknál – csak sötét viharfelhők és egy tó. A kommentekben többen írták: ezeket a képeket már látták valahol.',
      source: 'csevegohely.social',
      category: 'egyeb',
    },
    {
      id: 'clue_payment_recipient',
      title: 'A kedvezményezett: „Csongi Bt.”',
      description:
        'Az utalási adatok szerint a támogatás nem alapítványnak, hanem a „Csongi Bt.” nevű cégnek megy, FolyóPay fizetési linken.',
      source: 'csevegohely.social',
      category: 'kapcsolat',
    },
    {
      id: 'clue_no_aid',
      title: 'Senki nem kapott segélyt',
      description:
        'Fórumozók szerint egyetlen károsult sem látott az „Árvízsegélytől” semmit, pedig a gyűjtés már milliós. A „raktár” címére kiküldött helyi is üres helyiséget talált.',
      source: 'korosnivel.forum',
      category: 'indok',
    },
    {
      id: 'clue_csongor_handle',
      title: 'A szervező: „csongi_watt”',
      description:
        'A kritikákra nem az alapítvány, hanem egy „csongi_watt” nevű fiók válaszolgat agresszíven; a fórumozók szerint „ugyanaz a stílus, mint márciusban”.',
      source: 'korosnivel.forum',
      category: 'szemely',
    },
    {
      id: 'clue_gallery_original',
      title: 'A fotók eredetije: augusztusi Kővölgy',
      description:
        'pixelvadasz felismerte a képeit: augusztusban, a Kővölgyi-tónál készítette őket, viharfelhős időben – engedély nélkül használták.',
      source: 'kepmegoszto.hu',
      category: 'egyeb',
    },
    {
      id: 'clue_template_reuse',
      title: 'Ugyanaz a felszólító sablon',
      description:
        'A Művelődési Ház postafiókjában az „Árvízsegély” együttműködési kérése szó szerint egyezik a márciusi „Fenyvesi Szárnyasok” levelével – ugyanazokkal a mondatokkal.',
      source: 'mail.muvhaz.kf',
      category: 'indok',
    },
    {
      id: 'clue_previous_scam',
      title: 'Márciusban már futott egy ugyanilyen gyűjtés',
      description:
        'A „Fenyvesi Szárnyasok” márciusi „szárcsapat-gyűjtése” lelepleződött: az adatok egy magánszámlára mentek, az ügy nyomozása jelenleg is tart.',
      source: 'mail.muvhaz.kf',
      category: 'indok',
    },
    {
      id: 'clue_account_holder',
      title: 'A FolyóPay-fiók tulaja',
      description:
        'A FolyóPay átláthatósági oldala szerint a gyűjtéshez használt fiók tulaja egyéni vállalkozóként Mákvölgyi Csongor – alapítványi regisztráció nélkül.',
      source: 'folyopay.hu',
      category: 'szemely',
    },
    {
      id: 'clue_map_warehouse',
      title: 'A „raktár” a térképen',
      description:
        'A térkép szerint a gyűjtő által megadott raktárcím (Fenyvesfalu, Petőfi u. 2.) egy régi pékség: az üzlethelyiség évek óta kiadó, üresen áll.',
      source: 'terkep.elo',
      category: 'hely',
    },
    // ---- Következtetések (párosítás eredménye) ----
    {
      id: 'ded_dates',
      title: 'A gyűjtés az árvíz előtt indult',
      description:
        'Az „Árvízsegély” augusztus 28-án, öt nappal a szeptember 2-i árvíz előtt kezdett gyűjteni: a katasztrófa a forgatókönyv része volt.',
      source: 'Következtetés',
      category: 'egyeb',
      deduction: true,
    },
    {
      id: 'ded_photos',
      title: 'A fotók lopott, augusztusi képek',
      description:
        'A gyűjtő „katasztrófafotói” pixelvadasz augusztusi Kővölgyi-tavi viharfelhő-képei – engedély nélkül beillesztve, víz nélkül.',
      source: 'Következtetés',
      category: 'egyeb',
      deduction: true,
    },
    {
      id: 'ded_identity',
      title: 'A gyűjtő: Mákvölgyi Csongor',
      description:
        'A FolyóPay-fiók tulaja (Mákvölgyi Csongor) és a fórumon válaszolgató „csongi_watt” azonos személy: ő vezeti a hamis gyűjtést.',
      source: 'Következtetés',
      category: 'szemely',
      deduction: true,
    },
    {
      id: 'ded_scheme',
      title: 'Ismert séma: a márciusi csalás megismételve',
      description:
        'Az „Árvízsegély” a leleplezett márciusi „szárnyasos” gyűjtés újra futtatása: ugyanaz a sablon, ugyanaz a módszer, más címkékkel.',
      source: 'Következtetés',
      category: 'indok',
      deduction: true,
    },
  ],
  connections: [
    {
      id: 'conn-dates',
      clueA: 'clue_campaign_start',
      clueB: 'clue_flood_date',
      resultClueId: 'ded_dates',
      insight: 'A gyűjtés augusztus 28-án indult, az árvíz pedig szeptember 2-án jött: előre megírt forgatókönyv.',
    },
    {
      id: 'conn-photos',
      clueA: 'clue_stolen_photos',
      clueB: 'clue_gallery_original',
      resultClueId: 'ded_photos',
      insight: 'A kommentek gyanúja + pixelvadasz felismerése: a fotók lopott, augusztusi Kővölgyi képek.',
    },
    {
      id: 'conn-identity',
      clueA: 'clue_csongor_handle',
      clueB: 'clue_account_holder',
      resultClueId: 'ded_identity',
      insight: 'A fizetési fiók tulaja és a „csongi_watt” fórumfiók: a gyűjtő személye megvan.',
    },
    {
      id: 'conn-scheme',
      clueA: 'clue_template_reuse',
      clueB: 'clue_previous_scam',
      resultClueId: 'ded_scheme',
      insight: 'Ugyanaz a levélsablon + a leleplezett márciusi gyűjtés: ismert séma fut újra.',
    },
  ],
  objectives: [
    {
      id: 'obj_online',
      title: 'Vizsgáld át a gyűjtés online felületét',
      requiredClueIds: ['clue_campaign_start', 'clue_payment_recipient'],
    },
    {
      id: 'obj_timeline',
      title: 'Állítsd össze az időrendet',
      requiredClueIds: ['clue_flood_date', 'ded_dates'],
    },
    {
      id: 'obj_photos',
      title: 'Derítsd ki a fotók eredetét',
      requiredClueIds: ['clue_gallery_original', 'ded_photos'],
    },
    {
      id: 'obj_identity',
      title: 'Azonosítsd a gyűjtőt',
      requiredClueIds: ['clue_csongor_handle', 'clue_account_holder', 'ded_identity'],
    },
    {
      id: 'obj_scheme',
      title: 'Állítsd össze a séma teljes képét',
      requiredClueIds: ['clue_no_aid', 'clue_map_warehouse', 'ded_scheme'],
    },
    {
      id: 'obj_submit',
      title: 'Küldd be a záró jelentést',
      requiredClueIds: [],
    },
  ],
  finalQuestions: [
    {
      id: 'q_who',
      prompt: 'Ki áll a hamis gyűjtés mögött?',
      options: [
        { id: 'q_who_a', label: 'A Művelődési Ház gondnoka' },
        { id: 'q_who_b', label: 'Mákvölgyi Csongor, a „Csongi Bt.” tulaja', correct: true, requiresClue: 'ded_identity' },
        { id: 'q_who_c', label: 'pixelvadasz, a fotós' },
        { id: 'q_who_d', label: 'A FolyóPay vezetője' },
      ],
    },
    {
      id: 'q_timing',
      prompt: 'Mi árulja el, hogy a „katasztrófa” előre megírt forgatókönyv volt?',
      options: [
        { id: 'q_timing_a', label: 'A gyűjtés három nappal az árvíz ELŐTT indult', correct: true, requiresClue: 'ded_dates' },
        { id: 'q_timing_b', label: 'Az árvíz után azonnal leállították a gyűjtést' },
        { id: 'q_timing_c', label: 'A fórumon túl gyorsan válaszoltak' },
        { id: 'q_timing_d', label: 'A raktár túl kicsi volt a segélyekhez' },
      ],
    },
    {
      id: 'q_photos',
      prompt: 'Honnan valók a gyűjtésen mutogatott „katasztrófafotók”?',
      options: [
        { id: 'q_photos_a', label: 'Drónfelvétel az elárasztott Fenyvesfaluból' },
        { id: 'q_photos_b', label: 'Külföldi hírportál archívuma' },
        { id: 'q_photos_c', label: 'pixelvadasz augusztusi, Kővölgyi-tavi viharfelhő-képei', correct: true, requiresClue: 'ded_photos' },
        { id: 'q_photos_d', label: 'Mesterséges intelligenciával generált képek' },
      ],
    },
    {
      id: 'q_scheme',
      prompt: 'Mi az ügy lényege?',
      options: [
        { id: 'q_scheme_a', label: 'Egy leleplezett márciusi adománycsalás megismétlése, új névvel és lopott fotókkal', correct: true, requiresClue: 'ded_scheme' },
        { id: 'q_scheme_b', label: 'Valódi gyűjtés, csak rossz szervezéssel' },
        { id: 'q_scheme_c', label: 'Egy versenytárs cég lejáratási kampánya' },
        { id: 'q_scheme_d', label: 'Adathalászat bankkártyaadatokért, pénz nélkül' },
      ],
    },
  ],
  websites: [
    // ------------------------------------------------------------
    {
      domain: 'spotlight.kereso',
      name: 'Spotlight kereső',
      icon: 'search',
      accent: 'text-cyan-300',
      pages: [
        { kind: 'search', url: 'spotlight.kereso', title: 'Spotlight – kereső', siteName: 'Spotlight' },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'csevegohely.social',
      name: 'Csevegőhely',
      icon: 'message',
      accent: 'text-sky-300',
      pages: [
        {
          kind: 'profile',
          variant: 'social',
          url: 'csevegohely.social/@arviz_segely_kf',
          title: 'Korosfalui Árvízsegély (@arviz_segely_kf) – Csevegőhely',
          siteName: 'Csevegőhely',
          displayName: 'Korosfalui Árvízsegély',
          handle: '@arviz_segely_kf',
          avatarSeed: 'arviz-1',
          bio: RT(
            'Hivatalos gyűjtés a fenyvesfalui árvízkárosultakért. ',
            B('Minden forint a helyére kerül.'),
            ' Uta.lás: ',
            L('folyopay.hu/arvizsegely', 'folyopay.hu'),
          ),
          meta: [
            { label: 'Követők', value: RT('3 411') },
            { label: 'Létrehozva', value: RT('2026. augusztus 27.') },
            { label: 'Hely', value: RT('Korosfalu, HU') },
          ],
          posts: [
            {
              id: 'p-1',
              author: 'Korosfalui Árvízsegély',
              handle: '@arviz_segely_kf',
              time: 'aug. 28. · 09:15',
              likes: 412,
              body: RT(
                'Elindult a gyűjtés: ',
                E(
                  'clue_campaign_start',
                  '„Felkészülünk a szeptemberi viharokra – minden felajánlást most fogadunk, hogy készen álljunk.”',
                ),
                ' Oszd meg, ha szíveden viseled a vidéket!',
              ),
              photo: {
                id: 'ph-storm',
                kind: 'night',
                caption: RT('Sötét felhők a vidék felett. Készülünk. #árvízsegély'),
              },
            },
            {
              id: 'p-2',
              author: 'Korosfalui Árvízsegély',
              handle: '@arviz_segely_kf',
              time: 'szept. 03. · 08:40',
              likes: 1289,
              body: RT(
                'Sajnos bekövetkezett. Elárasztotta a patak Fenyvesfalut. ',
                E(
                  'clue_stolen_photos',
                  'Képeink a helyszínről – ezerkétszáz jelzés, hogy minden eddigi támogatást most azonnal segélyre fordítunk.',
                ),
                ' Tovább gyűjtünk!',
              ),
              photo: {
                id: 'ph-flood',
                kind: 'lake',
                caption: RT('A víz mögöttünk van, de a munka csak most kezdődik.'),
                comments: [
                  { author: 'fenyvesi_bela', body: RT('Várjunk... ez a Kővölgy, nem a Fenyves? Itt nincs víz a házaknál.') },
                  { author: 'kertesz_anna', body: RT('Ezt a fotót látom máshol is. Augusztusban?') },
                ],
              },
            },
            {
              id: 'p-3',
              author: 'Korosfalui Árvízsegély',
              handle: '@arviz_segely_kf',
              time: 'szept. 05. · 19:22',
              likes: 341,
              body: RT(
                'Áttörés az 1 millió forintos összegben! Uta.lási cél: ',
                E(
                  'clue_payment_recipient',
                  'Csongi Bt. – FolyóPay gyorslink (a „segélyelosztás működési alapja”).',
                ),
                ' Köszönünk mindent!',
              ),
            },
            {
              id: 'p-4',
              author: 'Korosfalui Árvízsegély',
              handle: '@arviz_segely_kf',
              time: 'szept. 08. · 11:02',
              likes: 89,
              body: RT(
                'A raktárunk Fenyvesfalun, Petőfi u. 2. alatt működik, naponta 8–16 óráig tudsz átvenni csomagot. Kérjük, csak károsultak jelentkezzenek.',
              ),
            },
          ],
        },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'napi.pulzus',
      name: 'Napi Pulzus',
      icon: 'news',
      accent: 'text-red-300',
      pages: [
        {
          kind: 'news',
          url: 'napi.pulzus/cikk/fenyvesfalui-arviz',
          title: 'Kiöntött a Fenyves-patak – Napi Pulzus',
          siteName: 'Napi Pulzus',
          headline: 'Kiöntött a Fenyves-patak: harminc ház víz alatt Fenyvesfalun',
          lead: 'Szeptember 2-án éjjel öntött ki a patak; a károk felmérése zajlik.',
          author: 'Tóth Borbála',
          date: '2026. szept. 04.',
          body: [
            RT(
              'Szeptember 2-án éjjel ',
              E('clue_flood_date', 'kiöntött a Fenyves-patak: harminc ház pincéje került víz alá Fenyvesfalun.'),
              ' Szeptember 3-án délutánra állt el az eső; a károk felmérése zajlik.',
            ),
            RT(
              'A helyi közösség összefog: a ',
              L('Művelődési Ház', 'mail.muvhaz.kf'),
              ' gyűjtőpontot szervezett, ahova adományt lehet vinni.',
            ),
            RT('Az önkormányzat szerint az állami kárenyhítés iránti kérelmeket jövő héten lehet benyújtani.'),
          ],
          related: [
            { label: 'Korosfalui Árvízsegély – közösségi oldala', url: 'csevegohely.social/@arviz_segely_kf' },
            { label: 'Térkép: Fenyvesfalu és környéke', url: 'terkep.elo/korosfalu' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------
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
          boardName: 'Helyi ügyek / Közélet',
          threads: [
            {
              id: 'th-1',
              title: 'Hallott már valaki az „Árvízsegélytől”??',
              replies: 5,
              pinned: true,
              posts: [
                {
                  op: true,
                  author: 'fenyvesi_bela',
                  handle: 'fenyvesi_bela',
                  time: 'szept. 07. · 20:31',
                  body: RT(
                    'Milliók gyűltek, de ',
                    E(
                      'clue_no_aid',
                      'egyedüli károsultként egy forintot sem láttam belőle. A „raktár” címén (Petőfi u. 2.) üres üzlet fogadott.',
                    ),
                    ' Valaki kapott már innen bármit?',
                  ),
                },
                {
                  author: 'kertesz_anna',
                  handle: 'kertesz_anna',
                  time: 'szept. 07. · 20:58',
                  body: RT('Én ott lakom a szomszéd utcában. Az a pékség évek óta üresen áll. Se raklap, se autó.'),
                },
                {
                  author: 'csongi_watt',
                  handle: 'csongi_watt',
                  time: 'szept. 07. · 21:14',
                  body: RT(
                    'A segélyek kiosztása ütemezetten zajlik. A pletykaterjesztést jogi úton rendezzük.',
                  ),
                },
                {
                  author: 'szkeptikus_bela',
                  handle: 'szkeptikus_bela',
                  time: 'szept. 08. · 07:12',
                  body: RT(
                    'Hoppá. ',
                    E(
                      'clue_csongor_handle',
                      'Az alapítvány nevében egy „csongi_watt” nevű magánfiók válaszolgat – ugyanígy írt márciusban is a „szárnyasok” alatt.',
                    ),
                  ),
                },
                {
                  author: 'pixelvadasz',
                  handle: 'pixelvadasz',
                  time: 'szept. 08. · 08:03',
                  body: RT('Azokat a fotókat ismerem... na aztán kinek a képei vannak a bejegyzésekben?!'),
                },
              ],
            },
            {
              id: 'th-2',
              title: 'Árvízi segítség – hova vihetem a tartós élelmiszert?',
              replies: 3,
              posts: [
                {
                  op: true,
                  author: 'turista_eva',
                  handle: 'turista_eva',
                  time: 'szept. 04. · 10:22',
                  body: RT('A Művelődési Ház gyűjtőpontja működik, nyolc-tizenhat óráig várják a csomagokat.'),
                },
                {
                  author: 'fenyvesi_bela',
                  handle: 'fenyvesi_bela',
                  time: 'szept. 04. · 11:05',
                  body: RT('Köszönöm, onnan ma már kaptunk is. Igazi segítség, személyesen.'),
                },
              ],
            },
          ],
        },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'mail.muvhaz.kf',
      name: 'Művelődési Ház webmail',
      icon: 'mail',
      accent: 'text-violet-300',
      pages: [
        {
          kind: 'webmail',
          url: 'mail.muvhaz.kf',
          title: 'Művelődési Ház – Beérkezett üzenetek',
          siteName: 'Művelődési Ház webmail',
          account: 'iroda@muvhaz.kf (megosztva a nyomozással)',
          emails: [
            {
              id: 'em-1',
              from: 'Korosfalui Árvízsegély',
              fromEmail: 'kapcsolat@arvizsegely-kf.hu',
              subject: 'Együttműködési felkérés – árvízi segélygyűjtés',
              date: 'szept. 03. · 14:26',
              unread: true,
              body: RT(
                'Tisztelt Művelődési Ház!',
                '\n\n',
                'Közösségünk a fenyvesfalui árvízkárosultakért gyűjt. ',
                E(
                  'clue_template_reuse',
                  'Kérjük kedvesen: „Csatlakozzon intézménye is a kezdeményezéshez, és legyen átvételi pontunk – közösen többre megyünk!”',
                ),
                ' Várjuk válaszukat.',
                '\n\n',
                'Üdvözlettel: Árvízsegély csapat',
              ),
            },
            {
              id: 'em-2',
              from: 'Fenyvesi Szárnyasok',
              fromEmail: 'info@fenyvesi-szarnyasok.hu',
              subject: 'Együttműködési felkérés – szárcsapat-segély',
              date: 'márc. 12. · 10:11',
              body: RT(
                'Tisztelt Művelődési Ház!',
                '\n\n',
                'Kérjük kedvesen: „Csatlakozzon intézménye is a kezdeményezéshez, és legyen átvételi pontunk – közösen többre megyünk!”',
                '\n\n',
                'Üdvözlettel: Szárnyasok csapat',
              ),
            },
            {
              id: 'em-3',
              from: 'Csendőrség? Nem: Rendőrség',
              fromEmail: 'hivatalos@rendor-ugyek.info',
              subject: 'FIGYELMEZTETÉS: tartozása van!',
              date: 'márc. 14. · 06:40',
              phishing: true,
              body: RT(
                'Tisztelt Címzett!',
                '\n\n',
                'Azonnal egyenlítse ki tartozását a mellékelt linken, különben ügyet indítunk.',
                '\n\n',
                B('KATTINTSON IDE'),
              ),
            },
            {
              id: 'em-4',
              from: 'Napi Pulzus – szerkesztőség',
              fromEmail: 'b.toth@napi.pulzus',
              subject: 'Kérdés a márciusi ügyről',
              date: 'márc. 20. · 12:05',
              body: RT(
                'Kedves Iroda!',
                '\n\n',
                'Cikket írunk arról, hogy ',
                E(
                  'clue_previous_scam',
                  'a márciusi „szárcsapat-gyűjtés” teljes összege egy magánszámlára érkezett; a „Fenyvesi Szárnyasok” nem szerepel a hivatalos nyilvántartásban.',
                ),
                ' Kérnénk esetleges levelüket, amelyet a szervezőktől kaptak.',
                '\n\n',
                'T. B.',
              ),
            },
          ],
        },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'kepmegoszto.hu',
      name: 'Képmegosztó',
      icon: 'image',
      accent: 'text-pink-300',
      pages: [
        {
          kind: 'gallery',
          url: 'kepmegoszto.hu/pixelvadasz/vihar-kovolgy',
          title: 'Vihar a Kővölgy felett – Képmegosztó',
          siteName: 'Képmegosztó',
          owner: 'pixelvadasz',
          album: 'Vihar a Kővölgy felett',
          photos: [
            {
              id: 'ph-storm-orig',
              kind: 'night',
              caption: RT(
                'Augusztusi viharfelhők a Kővölgyi-tó felett. ',
                E(
                  'clue_gallery_original',
                  '„Ez a kép! Pontosan ez szerepel az „Árvízsegély” hirdetésében – aug. 21-én csináltam, itt, a tónál.”',
                ),
              ),
              geotag: { label: 'Kővölgyi-tó, nyugati part' },
              comments: [
                { author: 'turista_eva', body: RT('Az a szürke felhőforma tényleg nem árvizes utcát mutat.') },
                {
                  author: 'pixelvadasz',
                  body: RT('Se vízkár, se Fenyvesfalu. A képeimről a vízjelet levágták, a kompozíció ugyanaz.'),
                },
              ],
            },
            {
              id: 'ph-lake-2',
              kind: 'lake',
              caption: RT('Ugyanaz a part naposban – összehasonlítás kedvéért.'),
              geotag: { label: 'Kővölgyi-tó, nyugati part' },
            },
            {
              id: 'ph-town-2',
              kind: 'city',
              caption: RT('Korosfalu a dombról. A Fenyves-patak völgye a háttérben.'),
              geotag: { label: 'Korosfalu' },
            },
          ],
        },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'folyopay.hu',
      name: 'FolyóPay',
      icon: 'building',
      accent: 'text-amber-300',
      pages: [
        {
          kind: 'company',
          url: 'folyopay.hu',
          title: 'FolyóPay – a pénz folyjon',
          siteName: 'FolyóPay',
          hero: 'FolyóPay – a pénz folyjon.',
          about: [
            RT('A FolyóPay gyorsfizetési linkeket biztosít kisvállalkozásoknak és közösségeknek 2019 óta.'),
            RT('Átláthatósági alapelveink szerint minden gyűjtőfiók tulajosa nyilvánosan kereshető.'),
          ],
          projects: [
            {
              name: 'Gyorslink',
              tagline: 'Fizetési link percek alatt',
              status: 'stabil',
              desc: RT('Oszd meg a linket, mi elintézzük a többit. Díj: 1,9%.'),
            },
            {
              name: 'Átláthatósági kereső',
              tagline: 'Ki áll a fiók mögött?',
              status: 'stabil',
              desc: RT(
                'Minden gyűjtőfiókhoz nyilvános tulajdonos tartozik. Példa a keresésre: ',
                E(
                  'clue_account_holder',
                  '„arvizsegely” fiók → tulaj: Mákvölgyi Csongor (egyéni vállalkozó, reg.: 2026. aug. 26.)',
                ),
                '.',
              ),
            },
            {
              name: 'Visszatérítés-védelem',
              tagline: 'Kvíz a biztonságról',
              status: 'béta',
              desc: RT('Tanuld meg felismerni a csalárd gyűjtéseket játékosan.'),
            },
          ],
          contact: 'Ügyfélszolgálat: segitseg@folyopay.hu · 06-1-555-0777 (fiktív)',
        },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'terkep.elo',
      name: 'Térkép.Élő',
      icon: 'map',
      accent: 'text-green-300',
      pages: [
        {
          kind: 'map',
          url: 'terkep.elo/korosfalu',
          title: 'Korosfalu, Fenyvesfalu és a Kővölgyi-tó – Térkép.Élő',
          siteName: 'Térkép.Élő',
          region: 'Korosfalu, Fenyvesfalu és a Kővölgyi-tó',
          pins: [
            {
              id: 'pin-haz',
              x: 62,
              y: 48,
              label: 'Művelődési Ház (gyűjtőpont)',
              kind: 'poi',
              info: RT('Tartós élelmiszer és tisztítószer gyűjtés, 8–16 óráig. Az árvízi segélyek valódi bázisa.'),
            },
            {
              id: 'pin-flood',
              x: 78,
              y: 70,
              label: 'Fenyvesfalu (elárasztott rész)',
              kind: 'poi',
              info: RT('A Fenyves-patak szeptember 2-án éjjel itt öntött ki. A pincékben még áll a víz.'),
            },
            {
              id: 'pin-warehouse',
              x: 84,
              y: 56,
              label: 'Petőfi u. 2. – „Árvízsegély raktár”',
              kind: 'home',
              info: RT(
                E(
                  'clue_map_warehouse',
                  'A térkép jelölése: „régi pékség – üzlethelyiség kiadó”. A gyűjtő által megadott raktárcím évek óta üres.',
                ),
                ' A fórumon is ezt erősítették meg a helyiek.',
              ),
            },
            {
              id: 'pin-lake',
              x: 25,
              y: 25,
              label: 'Kővölgyi-tó',
              kind: 'poi',
              info: RT('Horgásztó a dombságban. Innen származnak a „katasztrófafotók”.'),
            },
          ],
        },
      ],
    },
  ],
}
