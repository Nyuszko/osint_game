import type { GameCase } from '../types'
import { B, E, L, RT } from '../rich'

// ============================================================
// CASE-001 – Az eltűnt fejlesztő
// Minden szereplő, cég és hely KITALÁLT.
// ============================================================

export const case001: GameCase = {
  id: 'case-001',
  code: 'CASE-001',
  title: 'Az eltűnt fejlesztő',
  tagline: 'Egy fejlesztő eltűnik. Az internet emlékezik.',
  difficulty: 2,
  homeUrl: 'spotlight.kereso',
  searchDomain: 'spotlight.kereso',
  bookmarks: [
    'mail.nebula.hu',
    'devkapcsolat.io/@alexcarter',
    'csevegohely.social/@alex_carter',
    'korosnivel.forum',
  ],
  briefing: [
    'A 27 éves szoftverfejlesztő Alex Carter szeptember 11-én eltűnt a korosfalui lakásából. A család aggódik, a munkaadó hallgat.',
    'Az online térben viszont mindenki hagy nyomot: profilok, posztok, levelek, fotók, fórumüzenetek.',
    'Kutass a fiktív interneten, kösd össze a nyomokat, és küldd be a záró jelentést: hová ment Alex, kivel beszélt, min dolgozott, és miért tűnt el.',
    'Minden szereplő és helyszín kitalált.',
  ],
  solutionRecap: [
    'Alex Carter a NeonByte Kft. Nightjar nevű adatgyűjtő rendszerén dolgozott: a rendszer „névtelenített" munkavállalói adatokat gyűjtött, majd rejtetten összekapcsolta és továbbította külső partnereknek.',
    'Amikor Alex szólt a visszaélésről, a projektvezető, Vincze Gergő leültette, hogy „ne bonyolítsa". Nem ő volt az egyetlen ellenség: ismeretlen számokról fenyegető üzenetek érkeztek Alexnek.',
    'Alex oknyomozó újságíróhoz fordult: K. Lénához, a Tényfészek munkatársához, akivel titkosítva levelezett, és akinek átadta a dokumentumokat.',
    'Szeptember 11-én vonattal Fenyvesfalura utazott, majd a Kővölgyi-tó északnyugati partján álló, évek óta üresen álló erdészeti faházba húzódott vissza, ahol napelemes, jelmentes búvóhelyen várta, míg az anyag napvilágot lát.',
    'A hírportál tévesen kiégésre gyanakodott; valójában egy leleplezésre készülő informátor rejtőzött el szándékosan.',
  ],
  clues: [
    {
      id: 'clue_commit',
      title: 'Rejtélyes utolsó commit',
      description:
        'Alex utolsó commit-üzenete a nightjar-core repóban: „refactor: a naplózási hátsó ajtó eltávolítása". Röviddel ezután a repót archiválták.',
      source: 'devkapcsolat.io',
      category: 'munka',
    },
    {
      id: 'clue_nightjar_desc',
      title: 'Nightjar – adatgyűjtő rendszer',
      description:
        'A NeonByte Kft. zászlóshajó-projektje „bármilyen forrásból" gyűjti és kapcsolja össze a munkavállalói adatokat a vezetői riportokhoz.',
      source: 'neonbyte.hu',
      category: 'munka',
    },
    {
      id: 'clue_data_misuse',
      title: 'Tiltott adatgyűjtés a Nightjarban',
      description:
        'Alex blogja szerint a „névtelenített" adatokat a rendszer rejtetten összekapcsolta, és külső partnereknek továbbította – nem ez volt aláírva.',
      source: 'alexcarter.dev',
      category: 'indok',
    },
    {
      id: 'clue_threat',
      title: 'Ismeretlen fenyegetések',
      description:
        'Alex szerint az ügy kezdete óta ismeretlen számokról fenyegető üzeneteket kap, és kétszer is ott fordult a kilincs a lakásában.',
      source: 'alexcarter.dev',
      category: 'indok',
    },
    {
      id: 'clue_burnout',
      title: 'Kiégség jelei',
      description:
        'Alex hírfolyamán hetek óta kiégésről írt. Sokan ezért hiszik, hogy csak elment pihenni.',
      source: 'csevegohely.social',
      category: 'egyeb',
    },
    {
      id: 'clue_greg_pressure',
      title: 'Vincze Gergő nyomása',
      description:
        'A projektvezető nyilvánosan szúrta ki Alex „csapatellenes" lépéseit; Alex szerint Gergő „az adatokat akarja, mindenáron".',
      source: 'csevegohely.social',
      category: 'kapcsolat',
    },
    {
      id: 'clue_helios_offer',
      title: 'Helios Labs ajánlata',
      description:
        'A Helios Labs HR-es, Varsányi Márta versenyeztető ajánlatot küldött: 25%-kal magasabb fizetés, szept. 15-i határidővel.',
      source: 'mail.nebula.hu',
      category: 'egyeb',
    },
    {
      id: 'clue_brother_worry',
      title: 'Dániel aggódó levele',
      description:
        'Alex bátyja, Dániel hetek óta nem tudta felhívni őt, és levelezésben közölte: ha ez így megy tovább, személyesen keresi fel.',
      source: 'mail.nebula.hu',
      category: 'szemely',
    },
    {
      id: 'clue_coordinates',
      title: 'Koordináták a titkos postafiókból',
      description:
        'Egy a.carter74@zsebpost.hu címről küldött levél: „46.812°É, 17.647°K. Csak ha sürgős." – a Kővölgyi-tó északnyugati partja.',
      source: 'mail.nebula.hu',
      category: 'hely',
    },
    {
      id: 'clue_train_ticket',
      title: 'Vonatjegy Fenyvesfalura',
      description:
        'Szept. 11-én Alex „néhány napra kikapcsolok" felirattal fotózott fel egy Korosfalu → Fenyvesfalu vasútjegyet.',
      source: 'csevegohely.social',
      category: 'hely',
    },
    {
      id: 'clue_cabin_photo',
      title: 'Füst a Kővölgyi-tavi faházból',
      description:
        'Egy fotós szerint a tó északnyugati partján álló, évek óta üres erdészeti faházból mostanában füst száll fel – valaki ott lakik.',
      source: 'kepmegoszto.hu',
      category: 'hely',
    },
    {
      id: 'clue_offgrid_forum',
      title: 'Off-grid kutatás a fórumon',
      description:
        'Alex a KorosNivel fórumon off-grid életről kérdezett: napelem, kút, jelmentes völgyek – hetekkel az eltűnése előtt.',
      source: 'korosnivel.forum',
      category: 'egyeb',
    },
    {
      id: 'clue_kl_initials',
      title: 'A titokzatos „K.L."',
      description:
        'Alex fórumozótársainak csak annyit árult el: „a témáról csak egy emberrel beszélek: K.L."',
      source: 'korosnivel.forum',
      category: 'kapcsolat',
    },
    {
      id: 'clue_lena_journalist',
      title: 'K. Léna, oknyomozó újságíró',
      description:
        'A fórumon feltűnt K. Léna, a Tényfészek oknyomozó újságírója: „bátran írj – diszkréten, titkosítva".',
      source: 'korosnivel.forum',
      category: 'kapcsolat',
    },
    {
      id: 'clue_last_seen_station',
      title: 'Utolsó látmány: Fenyvesfalu állomás',
      description:
        'A hírcikk szerint az utolsó hiteles látmány szept. 11-én a fenyvesfalui vasútállomás kameráin készült; a tó felé indult gyalog.',
      source: 'napi.pulzus',
      category: 'hely',
    },
    {
      id: 'clue_map_cabin_pin',
      title: 'A faház a térképen',
      description:
        'A térkép pontosan a koordinátáknál jelöl egy „régi erdészeti faház – használaton kívüli" pontot a tó északnyugati partján.',
      source: 'terkep.elo',
      category: 'hely',
    },
    // ---- Következtetések (párosítás eredménye) ----
    {
      id: 'ded_leak',
      title: 'Alex leleplezésre készült',
      description:
        'Alex a Nightjar-ügy anyagát K. Lénához, a Tényfészek újságírójához akarta eljuttatni – innen a titkolózás.',
      source: 'Következtetés',
      category: 'kapcsolat',
      deduction: true,
    },
    {
      id: 'ded_location',
      title: 'Alex a faházban rejtőzik',
      description:
        'A koordináták és a füstös faház egybeesnek: Alex a Kővölgyi-tó északnyugati partján lévő faházban bujkál.',
      source: 'Következtetés',
      category: 'hely',
      deduction: true,
    },
    {
      id: 'ded_reason',
      title: 'Az eltűnés oka: leleplezés + fenyegetés',
      description:
        'Alex azért tűnt el, mert leleplezte a Nightjar tiltott adatgyűjtését; a fenyegetések miatt biztonságos búvóhelyen várta, míg az anyag célba ér.',
      source: 'Következtetés',
      category: 'indok',
      deduction: true,
    },
  ],
  connections: [
    {
      id: 'conn-leak',
      clueA: 'clue_data_misuse',
      clueB: 'clue_kl_initials',
      resultClueId: 'ded_leak',
      insight: 'Az adatvisszaélés + a titokzatos „K.L." = Alex a sajtónak készült leleplezni az ügyet.',
    },
    {
      id: 'conn-location',
      clueA: 'clue_coordinates',
      clueB: 'clue_cabin_photo',
      resultClueId: 'ded_location',
      insight: 'A koordináták pont a füstös faházat jelölik: megvan a búvóhely!',
    },
    {
      id: 'conn-reason',
      clueA: 'clue_data_misuse',
      clueB: 'clue_threat',
      resultClueId: 'ded_reason',
      insight: 'Akit leleplezne, azt fenyegetik. Alex nem pihenre ment – elrejtőzött.',
    },
  ],
  objectives: [
    {
      id: 'obj_online',
      title: 'Vizsgáld át Alex online nyomait',
      requiredClueIds: ['clue_commit', 'clue_burnout'],
    },
    {
      id: 'obj_work',
      title: 'Derítsd ki, min dolgozott Alex',
      requiredClueIds: ['clue_nightjar_desc', 'clue_data_misuse'],
    },
    {
      id: 'obj_contact',
      title: 'Azonosítsd a titokzatos kapcsolattartót',
      requiredClueIds: ['clue_lena_journalist', 'clue_kl_initials'],
    },
    {
      id: 'obj_place',
      title: 'Szűkítsd be az eltűnés helyszínét',
      requiredClueIds: ['clue_train_ticket', 'clue_coordinates', 'clue_cabin_photo'],
    },
    {
      id: 'obj_why',
      title: 'Állítsd össze az eltűnés valódi okát',
      requiredClueIds: ['ded_reason'],
    },
    {
      id: 'obj_submit',
      title: 'Küldd be a záró jelentést',
      requiredClueIds: [],
    },
  ],
  finalQuestions: [
    {
      id: 'q_where',
      prompt: 'Hová rejtőzött el Alex?',
      options: [
        { id: 'q_where_a', label: 'A Helios Labs új irodájába költözött' },
        { id: 'q_where_b', label: 'A Kővölgyi-tó északnyugati partján álló faházba', correct: true, requiresClue: 'ded_location' },
        { id: 'q_where_c', label: 'Külföldre szökött egy rejtélyes állás miatt' },
        { id: 'q_where_d', label: 'A korosfalui lakásában rejtőzködik tovább' },
      ],
    },
    {
      id: 'q_who',
      prompt: 'Kivel tartotta a kapcsolatot az eltűnése előtt?',
      options: [
        { id: 'q_who_a', label: 'Vincze Gergő projektvezetővel' },
        { id: 'q_who_b', label: 'K. Lénával, a Tényfészek újságírójával', correct: true, requiresClue: 'clue_lena_journalist' },
        { id: 'q_who_c', label: 'Varsányi Márta, a Helios Labs HR-esével' },
        { id: 'q_who_d', label: 'Egy ismeretlen kriptobefektetővel' },
      ],
    },
    {
      id: 'q_what',
      prompt: 'Min dolgozott Alex az eltűnése előtt?',
      options: [
        { id: 'q_what_a', label: 'Egy böngészős játékmotoron' },
        { id: 'q_what_b', label: 'A Nightjar adatgyűjtő rendszeren', correct: true, requiresClue: 'clue_nightjar_desc' },
        { id: 'q_what_c', label: 'Egy banki API-átalakításon' },
        { id: 'q_what_d', label: 'Egy kriptotőzsde backendjén' },
      ],
    },
    {
      id: 'q_why',
      prompt: 'Miért tűnt el Alex?',
      options: [
        { id: 'q_why_a', label: 'Kiégett, csak pihenőre ment' },
        { id: 'q_why_b', label: 'Adósságai elől menekült' },
        { id: 'q_why_c', label: 'Mert leleplezte a Nightjar tiltott adatgyűjtését, és fenyegetve érezte magát', correct: true, requiresClue: 'ded_reason' },
        { id: 'q_why_d', label: 'Egy jól fizető külföldi állás miatt költözött' },
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
      domain: 'devkapcsolat.io',
      name: 'DevKapcsolat',
      icon: 'code',
      accent: 'text-emerald-300',
      pages: [
        {
          kind: 'profile',
          variant: 'dev',
          url: 'devkapcsolat.io/@alexcarter',
          title: 'Alex Carter – DevKapcsolat',
          siteName: 'DevKapcsolat',
          displayName: 'Alex Carter',
          handle: '@alexcarter',
          avatarSeed: 'alex-dev-7',
          bio: RT(
            'Full-stack fejlesztő a ',
            L('NeonByte Kft.-nél', 'neonbyte.hu'),
            '. Adatfolyamok, billentyűzetek, kutyák. Jelenleg: ',
            B('szabadság.'),
          ),
          meta: [
            { label: 'Hely', value: RT('Korosfalu, HU') },
            { label: 'Csatlakozott', value: RT('2019. március') },
            { label: 'Státusz', value: RT('Fiók inaktív (utolsó aktivitás: szept. 11.)') },
          ],
          repos: [
            {
              name: 'nightjar-core',
              archived: true,
              lang: 'TypeScript',
              stars: 214,
              updated: 'szept. 08.',
              desc: RT(
                'A Nightjar adatfolyam-magja (privát mirror). ',
                E(
                  'clue_commit',
                  'Utolsó commit: „refactor: a naplózási hátsó ajtó eltávolítása” – röviddel ezután archiválva.',
                ),
              ),
            },
            {
              name: 'kutyaeledel-2000',
              lang: 'C++',
              stars: 41,
              updated: 'aug. 30.',
              desc: RT('ESP32-s automata kutyaeledel-adagoló. Működik. A kutyám trónkövetelő.'),
            },
            {
              name: 'inga-oramutato',
              lang: 'Rust',
              stars: 7,
              updated: '2025.',
              desc: RT('LCP-inga-óramutató terminálra. Senki nem kérte. Senki nem használja. Szeretem.'),
            },
          ],
        },
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
          url: 'csevegohely.social/@alex_carter',
          title: 'Alex Carter (@alex_carter) – Csevegőhely',
          siteName: 'Csevegőhely',
          displayName: 'Alex Carter',
          handle: '@alex_carter',
          avatarSeed: 'alex-soc-3',
          bio: RT('kód, kávé, kutyák. néha fák is. | NeonByte | Korosfalu'),
          meta: [
            { label: 'Követők', value: RT('1 204') },
            { label: 'Követett', value: RT('312') },
            { label: 'Hely', value: RT('Korosfalu, HU') },
          ],
          posts: [
            {
              id: 'p-1',
              author: 'Alex Carter',
              handle: '@alex_carter',
              time: 'szept. 10. · 21:47',
              likes: 86,
              body: RT(
                'Két hét szabadnap nélkül, és még „csak félig vagyunk lemaradva”. ',
                E('clue_burnout', 'A kiégésemet már a főnököm is látja a távolból'),
                ', de a sprint meg a sprint. Szünet kell. Hamarosan.',
              ),
            },
            {
              id: 'p-2',
              author: 'Alex Carter',
              handle: '@alex_carter',
              time: 'szept. 11. · 07:12',
              likes: 154,
              body: RT(
                'Néhány napra kikapcsolok. ',
                E('clue_train_ticket', 'Jelmentes völgyek, egyirányú vonatjegy a zsebben.'),
                ' A hétvégén még write-upolok valamit a blogon.',
              ),
              photo: {
                id: 'ph-train',
                kind: 'train',
                caption: RT('Korosfalu → Fenyvesfalu. Egy út.'),
              },
            },
            {
              id: 'p-3',
              author: 'Alex Carter',
              handle: '@alex_carter',
              time: 'szept. 09. · 18:30',
              likes: 47,
              body: RT(
                '@vincze_gergo A „csapatjáték” nálam azt jelenti, hogy nem nézem el, ',
                E('clue_greg_pressure', 'amit a Nightjar az emberekről kiszippant és továbbít'),
                '. Hétfőn beszéljük. Munkaidőben.',
              ),
              replyTo: {
                handle: '@vincze_gergo',
                body: RT(
                  'Alex, kedden leadás. Ne csinálj csapatellenes mókákat, kérlek. A projekt fontosabb, mint a lelked.',
                ),
              },
            },
            {
              id: 'p-4',
              author: 'Alex Carter',
              handle: '@alex_carter',
              time: 'aug. 28. · 12:05',
              likes: 203,
              body: RT('Új monitor nap. A kábelezés megint győzött. Harcolok tovább.'),
            },
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
          boardName: 'Életmód / Off-grid & kiköltözés',
          threads: [
            {
              id: 'th-1',
              title: 'Kiköltözés jelmentes völgybe – na de hogyan kezdjem?',
              replies: 3,
              pinned: true,
              posts: [
                {
                  op: true,
                  author: 'alex_carter87',
                  handle: 'alex_carter87',
                  time: 'szept. 03. · 20:11',
                  body: RT(
                    'Sziasztok! Városi gyerekként gondolkodom egy ~1 hónapos „digital detox” kiköltözésben. ',
                    E(
                      'clue_offgrid_forum',
                      'Mire figyeljek? Napelem, víz, és hogy tényleg ne legyen jel a völgyben?',
                    ),
                    ' Előre is köszi.',
                  ),
                },
                {
                  author: 'offgrid_elemei',
                  handle: 'offgrid_elemei',
                  time: 'szept. 03. · 21:02',
                  body: RT(
                    'Napelem + 12 V hűtő, esővíz-gyűjtő. A Kővölgyi-tó környékén van pár régi erdészeti faház, oda a jel nehezen jut le.',
                  ),
                },
                {
                  author: 'szkeptikus_bela',
                  handle: 'szkeptikus_bela',
                  time: 'szept. 04. · 08:40',
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
                  author: 'alex_carter87',
                  handle: 'alex_carter87',
                  time: 'szept. 06. · 23:58',
                  body: RT(
                    'Hipotetikus szituáció: ha valaki tud olyat egy cégről, ami az emberek adatait érinti, és ezt nem kellene tudnia... kivel érdemes megosztani?',
                  ),
                },
                {
                  author: 'Léna K. (Tényfészek)',
                  handle: 'lena_k_tenyfesz',
                  time: 'szept. 07. · 06:15',
                  body: RT(
                    'Üzenem, akinek ez a szituáció ismerős: oknyomozó újságíró vagyok, forrásvédelemmel dolgozom. ',
                    E(
                      'clue_lena_journalist',
                      'Bátran írj: lena.k@tenyfesz.hu – diszkréten, titkosítva.',
                    ),
                    ' A nyilvánosság néha védőpáncél is.',
                  ),
                },
                {
                  author: 'alex_carter87',
                  handle: 'alex_carter87',
                  time: 'szept. 07. · 07:02',
                  body: RT(
                    'Köszönöm. ',
                    E(
                      'clue_kl_initials',
                      'Jelzem: a témáról csak egy emberrel folytatom a beszélgetést: K.L.',
                    ),
                    ' Ennyi.',
                  ),
                },
                {
                  author: 'pixelvadasz',
                  handle: 'pixelvadasz',
                  time: 'szept. 07. · 09:44',
                  body: RT('Gyanús csend volt itt mostanában... Sok sikert, akárki vagy.'),
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
                  time: 'aug. 30. · 10:20',
                  body: RT('A tetőt mostanra kell csinálni, de az önkormányzat szerint „jövőre járhatóbb”. Vélemények?'),
                },
                {
                  author: 'szkeptikus_bela',
                  handle: 'szkeptikus_bela',
                  time: 'aug. 30. · 11:05',
                  body: RT('„Jövőre” = soha, mint mindenhol. Alapítványt csináljunk.'),
                },
              ],
            },
          ],
        },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'mail.nebula.hu',
      name: 'Nebula Webmail',
      icon: 'mail',
      accent: 'text-violet-300',
      pages: [
        {
          kind: 'webmail',
          url: 'mail.nebula.hu',
          title: 'Nebula Webmail – Beérkezett üzenetek',
          siteName: 'Nebula Webmail',
          account: 'alex.carter@nebula.hu',
          emails: [
            {
              id: 'em-1',
              from: 'Dániel Carter',
              fromEmail: 'dan.carter@cartermail.hu',
              subject: 'Felveszed végre a telefont?',
              date: 'szept. 15. · 08:21',
              unread: true,
              body: RT(
                'Haver!',
                '\n\n',
                'Hetek óta nem veszed fel a telefont, a szobatársad szerint se látott. Anya is ideges már. ',
                E(
                  'clue_brother_worry',
                  'Ha ez a „kikapcsolós” dolog megint ilyen hosszú lesz, személyesen beugrom Korosfalura.',
                ),
                '\n\n',
                'Hívj vissza, akár jel nélkül is. – Dániel',
              ),
            },
            {
              id: 'em-2',
              from: '(nincs feladó)',
              fromEmail: 'a.carter74@zsebpost.hu',
              subject: '(nincs tárgy)',
              date: 'szept. 13. · 03:44',
              unread: true,
              body: RT(
                'Ha ezt a címet látod, akkor a régi fiók még él.',
                '\n\n',
                E(
                  'clue_coordinates',
                  'Minden fontos: 46.812°É, 17.647°K. Csak ha sürgős, és csak annak, aki tudja, hol van a fenyves.',
                ),
                '\n\n',
                'Ne válaszolj erre a címre.',
              ),
            },
            {
              id: 'em-3',
              from: 'Varsányi Márta',
              fromEmail: 'm.varsanyi@helioslabs.hu',
              subject: 'Állásajánlat – Senior Data Engineer (Helios Labs)',
              date: 'szept. 09. · 10:02',
              body: RT(
                'Kedves Alex!',
                '\n\n',
                'A múlt heti beszélgetésünk után lelkesen jelentettem, hogy a csapat szeretné veled folytatni. ',
                E(
                  'clue_helios_offer',
                  'A hivatalos ajánlatot szept. 15-ig benyújtjuk: 25%-kal magasabb bér, távmunka, új adatplatform.',
                ),
                '\n\n',
                'Számolj, gondolkodj, és jelezz. Üdv: Márta (Helios Labs, HR)',
              ),
            },
            {
              id: 'em-4',
              from: 'NeonByte Értesítő',
              fromEmail: 'newsletter@neonbyte.hu',
              subject: 'Q3 roadmap-előzetes – csapatkörlevél',
              date: 'szept. 08. · 16:40',
              body: RT(
                'Kedves Kollégák!',
                '\n\n',
                'A Nightjar 2.1 migrációja ütemterv szerint halad, a vezetői riport modul tesztüzemben. Részletek a belső wikiben.',
                '\n\n',
                'Kellemes munkát! – NeonByte Kommunikáció',
              ),
            },
            {
              id: 'em-5',
              phishing: true,
              from: 'Biztonság figyelmeztetés',
              fromEmail: 'no-reply@nebula-biztonsag.info',
              subject: 'FIGYELEM: fiókja 24 órán belül lejár!',
              date: 'szept. 08. · 05:00',
              body: RT(
                'Tisztelt Felhasználó!',
                '\n\n',
                'Fiókja biztonsági ellenőrzése miatt 24 órán belül kattintson az alábbi linkre, különben fiókja véglegesen törlésre kerül.',
                '\n\n',
                B('KATTINTSON IDE AZONNAL'),
                '\n\n',
                'Üdvözlettel, Nebula Biztonság Csapat',
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
          url: 'kepmegoszto.hu/pixelvadasz/osz-vizek',
          title: 'Őszi vizek – Kővölgy – Képmegosztó',
          siteName: 'Képmegosztó',
          owner: 'pixelvadasz',
          album: 'Őszi vizek – Kővölgy',
          photos: [
            {
              id: 'ph-lake',
              kind: 'lake',
              caption: RT('Hajnali köd a Kővölgyi-tó felett. Csend, csak a víz.'),
              geotag: { label: 'Kővölgyi-tó, déli part' },
            },
            {
              id: 'ph-cabin',
              kind: 'cabin',
              caption: RT(
                'Ez a régi erdészeti faház évekig üresen állt. ',
                E('clue_cabin_photo', 'A múlt héten viszont füstöt láttam a kéményéből – valaki ott lakik.'),
              ),
              geotag: { label: 'Kővölgyi-tó, északnyugati part' },
              comments: [
                { author: 'turista_eva', body: RT('Mi?! Ott nem volt áram húsz éve!') },
                {
                  author: 'pixelvadasz',
                  body: RT('Így van. Valószínű napelemes. Egy alak sétált a parton a fotón, de messze volt.'),
                },
              ],
            },
            {
              id: 'ph-town',
              kind: 'city',
              caption: RT('Korosfalu a dombról, naplementekor.'),
              geotag: { label: 'Korosfalu' },
            },
            {
              id: 'ph-abstract',
              kind: 'abstract',
              caption: RT('Kísérlet: hosszú záridő a vízen.'),
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
          url: 'napi.pulzus/cikk/eltunt-fejleszto',
          title: 'Eltűnt egy fiatal fejlesztő Korosfaluból – Napi Pulzus',
          siteName: 'Napi Pulzus',
          headline: 'Eltűnt egy fiatal fejlesztő Korosfaluból – a család aggódik',
          lead: 'Alex Carter (27) szeptember 11-én hagyta el lakását; azóta nem jelentkezett.',
          author: 'Tóth Borbála',
          date: '2026. szept. 14.',
          body: [
            RT(
              'Alex Carter korosfalui szoftverfejlesztő szeptember 11-én hagyta el lakását; munkaadója, a ',
              L('NeonByte Kft.', 'neonbyte.hu'),
              ' a távollétét „tervezett szabadságként” írta le lapunknak.',
            ),
            RT(
              'A család szerint a fiatal férfi hetekkel korábban is furcsán viselkedett: hangoztatta, hogy „kikapcsol egy időre”, és kevesebbet beszélt a munkájáról.',
            ),
            RT(
              E(
                'clue_last_seen_station',
                'Az utolsó hiteles látmány szeptember 11-én, a fenyvesfalui vasútállomás kameráin készült.',
              ),
              ' Onnan gyalogosan, a tó irányában látták elindulni.',
            ),
            RT('A rendőrség nyomozást indított; a család minden információt vár.'),
          ],
          related: [
            { label: 'Interaktív térkép: Kővölgyi-tó környéke', url: 'terkep.elo/korosfalu' },
            { label: 'Alex Carter profilja a DevKapcsolaton', url: 'devkapcsolat.io/@alexcarter' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'neonbyte.hu',
      name: 'NeonByte Kft.',
      icon: 'building',
      accent: 'text-amber-300',
      pages: [
        {
          kind: 'company',
          url: 'neonbyte.hu',
          title: 'NeonByte Kft. – adat, ami dolgozik',
          siteName: 'NeonByte Kft.',
          hero: 'NeonByte Kft. – adat, ami dolgozik.',
          about: [
            RT(
              'A NeonByte 2015-ben alakult Korosfaluban. Negyvenfős csapatunk vállalati adatgyűjtő és -elemző megoldásokat fejleszt közép- és nagyvállalatoknak.',
            ),
            RT('Mottónk: „Az adat akkor ér valamit, ha dolgozik.”'),
          ],
          projects: [
            {
              name: 'Nightjar',
              tagline: 'Vállalati adatgyűjtő platform',
              status: '2.1 – aktív fejlesztés',
              desc: RT(
                'A Nightjar ',
                E(
                  'clue_nightjar_desc',
                  'bármilyen forrásból – naptárakból, üzenetekből, dokumentumokból – egységesítve gyűjti és kapcsolja össze a munkavállalói adatokat',
                ),
                ' a vezetői riportokhoz.',
              ),
            },
            {
              name: 'NeonLedger',
              tagline: 'Számlázó- és könyvelőrendszer',
              status: 'stabil',
              desc: RT('Tíz éve megbízhatóan számláz. A fejlesztők emlegetik, a könyvelők imádják.'),
            },
            {
              name: 'Villanás',
              tagline: 'Szervermonitorozás',
              status: 'béta',
              desc: RT('Valós idejű riasztások, ha a szerverpark élete veszélyben van.'),
            },
          ],
          contact: 'Iparpark u. 7., Korosfalu · +36-1-555-0142 (fiktív) · hello@neonbyte.hu',
        },
      ],
    },
    // ------------------------------------------------------------
    {
      domain: 'alexcarter.dev',
      name: 'alexcarter.dev',
      icon: 'pen',
      accent: 'text-teal-300',
      pages: [
        {
          kind: 'blog',
          url: 'alexcarter.dev',
          title: 'Alex Carter blogja',
          siteName: 'alexcarter.dev',
          owner: 'Alex Carter',
          posts: [
            {
              id: 'bp-last',
              title: 'Miért nem jelentkezem (egyelőre)',
              date: '2026. szept. 12.',
              body: [
                RT('Ha ezt olvasod, akkor én már nem vagyok elérhető. Nem történt baj – csak egy időre le kell állnom.'),
                RT(
                  'Két éve dolgozom a ',
                  L('NeonByte', 'neonbyte.hu'),
                  ' Nightjar projektjén. Augusztusban ',
                  E(
                    'clue_data_misuse',
                    'rájöttem, hogy a „névtelenített” munkavállalói adatokat a rendszer rejtetten összekapcsolja, és külső partnereknek továbbítja',
                  ),
                  '. Ez nem az, amit aláírtam.',
                ),
                RT(
                  'Szóltam belsőleg. A válasz: „ne bonyolítsd”. Azóta ',
                  E('clue_threat', 'ismeretlen számokról fenyegető üzeneteket kapok'),
                  ', és a lakásom ajtajában kétszer is fordult a kilincs.',
                ),
                RT(
                  'Az anyag egy olyan embernél van, akiben megbízom. Ha velem bármi történik, ő tudni fogja, mi a teendő.',
                ),
              ],
            },
            {
              id: 'bp-feeder',
              title: 'ESP32 kutyaeledel-automata – 3. rész',
              date: '2026. aug. 30.',
              body: [
                RT('A harmadik verzió végül nem lőtte ki a konyhaszekrényt, ami önmagában siker.'),
                RT(
                  'Az adagoló most már mérleggel is rendelkezik, így a trónkövetelő kutya nem tudja kiszeretni a másik adagját.',
                ),
              ],
            },
          ],
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
          title: 'Korosfalu és a Kővölgyi-tó – Térkép.Élő',
          siteName: 'Térkép.Élő',
          region: 'Korosfalu és a Kővölgyi-tó',
          pins: [
            {
              id: 'pin-office',
              x: 74,
              y: 40,
              label: 'NeonByte Kft. (Iparpark)',
              kind: 'office',
              info: RT('Iparpark u. 7. A fejlesztői emelet szept. 11. óta Alex nélkül dolgozik.'),
            },
            {
              id: 'pin-home',
              x: 57,
              y: 63,
              label: 'Alex lakása (Belső körút 12.)',
              kind: 'home',
              info: RT('A szomszédok szerint szept. 11-én reggel gyalogszerrel indult el, hátizsákkal.'),
            },
            {
              id: 'pin-station',
              x: 45,
              y: 72,
              label: 'Fenyvesfalu állomás',
              kind: 'station',
              info: RT('Kisállomás, egy vágány. Innen a tó gyalog kb. 40 perc.'),
            },
            {
              id: 'pin-lake',
              x: 33,
              y: 36,
              label: 'Kővölgyi-tó',
              kind: 'poi',
              info: RT('Horgásztó és kirándulóhely. Az északnyugati part csak ösvényen érhető el.'),
            },
            {
              id: 'pin-cabin',
              x: 17,
              y: 20,
              label: 'Régi erdészeti faház',
              kind: 'cabin',
              info: RT(
                E(
                  'clue_map_cabin_pin',
                  'A térkép jelölése: „régi erdészeti faház – használaton kívüli”.',
                ),
                ' A koordináták (46.812°É, 17.647°K) pontosan ide esnek.',
              ),
            },
          ],
        },
      ],
    },
  ],
}
