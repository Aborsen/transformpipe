---
title: Note di rilascio che le persone leggono davvero
description: "Scrivi note di rilascio, non un log di commit — le sei categorie di Keep a Changelog, cosa conta come cambiamento che rompe la compatibilità"
updated: 2026-09-09
date: 2026-08-14
tag: Workflow
keywords: note di rilascio, changelog in markdown, keep a changelog, formato changelog, modello note di rilascio, versionamento semantico breaking change, conventional commits changelog, generatore di changelog
---

La maggior parte dei changelog è un log di commit con gli hash tolti. "Rifattorizzato il gestore dei token." "Aggiornata una dipendenza." "Risolto un caso limite nel parser." Ogni riga è vera, e nessuna aiuta chi deve decidere se aggiornare questa settimana. Le note di rilascio sono un documento diverso con un compito diverso: dicono cosa è cambiato per chi legge, cosa si rompe e cosa fare a riguardo.

### In breve

Keep a Changelog offre sei categorie di cambiamento — Added, Changed, Deprecated, Removed, Fixed, Security — e un'intestazione `Unreleased` che rende l'abitudine duratura, perché c'è sempre un posto dove mettere la riga mentre il cambiamento è ancora fresco (verificato su keepachangelog.com, il 9 settembre 2026). Il versionamento semantico dice al lettore quanta attenzione prestare, ma solo se il progetto ha scritto da qualche parte cosa significa per lui un cambiamento che rompe la compatibilità. I generatori — le note di rilascio automatiche di GitHub, release-please, semantic-release, git-cliff, changesets, auto-changelog — assemblano la lista a partire dai commit o dai file di changeset, e nessuno di loro può scrivere le due frasi che spiegano perché questa versione esiste e chi può saltarla. Tieni il file nel repository come Markdown, scrivi tu la parte umana, e convertilo quando qualcuno fuori dal repository ha bisogno di un link.

L'attrito non è che scrivere un changelog sia difficile. È che nessuno ha deciso per chi è. Un file che deve servire chi sta isolando una regressione, il cliente che decide se aggiornare durante un weekend, e l'integratore il cui parser sta per rompersi non servirà bene nessuno dei tre, perché quei tre lettori vogliono cose diverse dalle stesse dodici righe.

Il secondo attrito è il momento in cui si scrive. Note di rilascio scritte la notte del rilascio vengono ricostruite dal `git log`, e la ricostruzione è dove le ragioni si perdono: chi scrive la riga vede che un valore predefinito è cambiato e non ricorda più quale ticket di supporto lo ha reso necessario. A quel punto la sola cosa economica che resta è una lista, e quindi è una lista quello che finisce per essere spedito.

## Cosa va nelle note di rilascio, e cosa va nel log dei commit

Il log dei commit registra come il codice è arrivato a questo punto, per chi dovrà isolare una regressione fra diciotto mesi. Le note di rilascio sono per qualcuno che non ha mai visto il codice e ha dieci secondi.

| Il cambiamento | Log dei commit | Note di rilascio |
| --- | --- | --- |
| Logica di ritentativo riscritta | `refactor(http): replace retry loop with backoff` | Le richieste fallite vengono ritentate tre volte, con un ritardo crescente. Niente da configurare. |
| Chiave di configurazione rinominata | `feat: rename apiKey to api_key` | `apiKey` adesso è `api_key`. Il vecchio nome funziona ancora e scrive un avviso nei log. |
| Parser delle tabelle corretto | `fix: off-by-one in table row parser` | Le tabelle a colonna singola non perdono più la loro ultima riga. |

Tre prove per una riga candidata: il comportamento di chi legge cambia, avrebbe potuto imbattersi nel bug, oppure noterebbe la differenza senza che gliela si segnali. Una riga che fallisce tutte e tre resta nel log dei commit. Anche i refactor interni e gli aggiornamenti di dipendenze che non cambiano niente di osservabile restano lì.

Keep a Changelog fa lo stesso argomento dalla direzione opposta, e avverte contro l'uso di un diff del log dei commit come changelog: è pieno di commit di merge, titoli oscuri e modifiche alla documentazione che seppelliscono quello per cui il lettore era venuto (verificato su keepachangelog.com, il 9 settembre 2026). Non è una lamentela sull'igiene dei commit. Un messaggio di commit scritto bene resta comunque scritto per un revisore che ha il diff aperto accanto, e chi legge le note di rilascio non ha nessun diff e nessuna intenzione di trovarne uno.

C'è un terzo documento che vale la pena separare, perché è quello più spesso infilato di nascosto in un changelog: la guida all'aggiornamento. Una voce di changelog è una riga e un link. Una guida all'aggiornamento è una pagina con esempi di codice, un ordine delle operazioni, e il dettaglio sul svuotare prima la coda. Mescolarli significa che chi scorre in cerca di rotture deve leggere il tutorial, e chi fa la migrazione deve trovare il tutorial dentro una lista.

## Le sei categorie di cambiamento, e cosa va sotto ognuna

Keep a Changelog 1.1.0 definisce sei categorie, e il motivo per partire da lì invece di inventarne una propria non è estetico: le categorie sono conseguenze, quindi chi legge e si preoccupa di una di esse può leggere un titolo e andarsene. La specifica ha licenza MIT, e i suoi principi guida sono brevi — i changelog sono per gli umani, ogni versione riceve una voce, i cambiamenti sono raggruppati per tipo, versioni e sezioni sono linkabili, ordine dal più recente, le date di rilascio sono indicate, e si segue il versionamento semantico (verificato su keepachangelog.com, il 9 settembre 2026).

| Categoria | Cosa ci va | Cosa non ci va | Cosa ne fa il lettore |
| --- | --- | --- | --- |
| Added | Nuovi endpoint, impostazioni, comandi, schermate, formati accettati, permessi | Una nuova classe interna; un nuovo test; un nuovo passaggio di build | La legge se l'aspettava, altrimenti la salta |
| Changed | Valori predefiniti, limiti, tempistiche, ordine di ordinamento, testi, forma dell'output, codici di errore | Una riscrittura con lo stesso comportamento osservabile | Verifica se un'assunzione che aveva fatto vale ancora |
| Deprecated | Qualunque cosa funzioni ancora e abbia una fine dichiarata | Qualcosa che non ti piace ma che non hai in programma di rimuovere | Pianifica il lavoro prima della data indicata |
| Removed | Endpoint, flag, chiavi di configurazione, formati, supporto a piattaforme e runtime | Codice interno morto che nessuno poteva chiamare | Si ferma, legge la riga di migrazione, pianifica l'aggiornamento |
| Fixed | Un comportamento sbagliato in cui un lettore potrebbe plausibilmente essere incappato | Un bug introdotto e corretto dentro la stessa versione | Capisce se ne era affetto, e da quando |
| Security | Vulnerabilità corrette, con la gravità e cosa era esposto | Un irrigidimento a cui nessuno era esposto — quello è Changed | Applica la patch subito, o spiega a qualcuno perché no |

### Added

Una nuova capacità, descritta come una cosa che il lettore può fare adesso invece che una cosa che tu hai costruito. "Gli export si possono filtrare per intervallo di date" è una voce; "aggiunto il supporto al filtro per intervallo di date nel servizio di export" è un rapporto di stato. Added è la sezione che le persone scorrono per ultima e la più facile da riempire troppo, perché ogni ticket chiuso sembra un'aggiunta. Se nessuno fuori dal team può raggiungerla, non è ancora un'aggiunta.

### Changed

La sezione più sottoutilizzata e più costosa. Changed è dove i valori predefiniti si spostano, i limiti si stringono, i timeout si accorciano, i codici di errore diventano più specifici e l'ordine di ordinamento si inverte — niente di tutto questo è una correzione di bug, e tutto questo può rompere chi ha scritto codice contro il vecchio comportamento. Ogni riga di Changed dovrebbe portare il vecchio valore e quello nuovo, perché "migliorato il rate limiting" non dice al lettore niente su cui possa agire, mentre "il margine di burst è 60 richieste, sceso da 120" gli dice esattamente se preoccuparsi.

### Deprecated

Una deprecazione senza data non è una deprecazione, è un'opinione. La voce ha bisogno di tre cose: cosa è deprecato, cosa usare al suo posto, e quando smette di funzionare — una versione, una data, o entrambe. Deprecated è anche la sola sezione che descrive qualcosa che non è ancora successo, il che è il motivo per cui è quella che i lettori saltano e quella che costa più cara quando lo fanno.

### Removed

La sezione che decide se un aggiornamento è sicuro, quindi va vicino all'inizio della voce qualunque cosa suggerisca l'ordine della specifica. Ogni riga ha bisogno del sostituto e della forma del lavoro: non solo che `/v1/export` è sparito, ma che `/v2/exports` restituisce lo stesso corpo con `id` come stringa. Una riga di Removed senza sostituto va bene quando davvero non ce n'è uno, e allora va detto chiaramente invece di lasciare che il lettore ne cerchi uno.

### Fixed

Fixed viene letta da chi sta capendo se un problema che aveva era proprio questo problema. Questo rende la condizione interessata più utile del meccanismo: "i caricamenti oltre 2 GB fallivano in silenzio su connessioni più lente di 1 Mbps" permette al lettore di confrontare il proprio sintomo, mentre "corretta una race condition nel gestore del caricamento a blocchi" non lo permette. Se una correzione cambia un comportamento su cui qualcuno aveva imparato a contare, appartiene anche a Changed, o invece di Fixed.

### Security

Indica la gravità, cosa poteva fare un attaccante, e se l'exploit richiedeva l'autenticazione. Se usi identificatori CVE o una scala di gravità, usali con coerenza, perché chi decide se applicare la patch fuori orario sta facendo aritmetica del rischio e ha bisogno dei dati in ingresso. Le voci di Security sono anche quelle più spesso lette da qualcuno che non è un cliente — un revisore, un questionario di procurement, un team di sicurezza — quindi sopravvivono al rilascio per anni.

### La sezione Unreleased come abitudine di lavoro

Keep a Changelog metta un'intestazione `Unreleased` in cima così i lettori vedono cosa sta arrivando e rilasciare diventa una questione di spostare contenuto piuttosto che scriverlo (verificato su keepachangelog.com, il 9 settembre 2026). L'abitudine conta più del titolo. Quando `Unreleased` esiste, la pull request che cambia un valore predefinito può aggiungere la riga che lo descrive, revisionata dalla stessa persona che revisiona il cambiamento, nel momento in cui entrambi ancora ricordano perché.

Questo trasforma una domanda difficile — cosa è cambiato nelle ultime sei settimane — in cinquanta domande facili. Dà anche alla revisione qualcosa da intercettare: una pull request che cambia un comportamento osservabile e non tocca nessuna riga di changelog è un'omissione visibile, il che è l'applicazione più economica possibile. Il costo sono i conflitti di merge, perché tutti modificano le stesse righe in cima allo stesso file. Due cose li riducono: tenere la voce più recente in cima a ogni sottosezione così le aggiunte finiscono in un solo posto, oppure passare a un file per cambiamento, che è il problema che changesets esiste per risolvere.

### Raggruppa per impatto, non per componente

Dividere le note in `auth-service`, `billing-worker` e `web` descrive come è stato diviso il lavoro, non come arriva al lettore. Chi si chiede se questo rilascio rompe la sua integrazione deve leggere ogni sezione, e non ne leggerà nessuna.

Keep a Changelog elenca Added per primo, ma niente impone quell'ordine. Removed e Changed rispondono alla domanda con cui arriva la maggior parte dei lettori, quindi guidano l'elenco, poi Security, poi Fixed, poi Added. La specifica è una struttura, non un foglio di stile.

In un monorepo dove i team consumano i pacchetti gli uni degli altri, note per componente sono la risposta migliore: ogni lettore possiede un servizio e vuole solo la sua sezione. Di solito due documenti risolvono la questione — raggruppamento per componente per chi costruisce, raggruppamento per impatto per chi usa — e il secondo deriva spesso dal primo abbastanza da rendere sensato organizzare la fonte in quel modo.

### Un formato di changelog da copiare

La struttura è Markdown semplice, ed è proprio questo il punto: fa il diff, si revisiona e si convertisce.

```markdown
## [Unreleased]

## [1.4.0] - 2026-08-14

### Removed
- The `/v1/export` endpoint. Use `/v2/exports`; the response is identical
  apart from `id`, now a string.

### Changed
- Session cookies last 30 days instead of 7. Existing sessions are unaffected.

### Fixed
- Uploads over 2 GB no longer fail silently on slow connections.

[Unreleased]: https://example.com/compare/v1.4.0...HEAD
[1.4.0]: https://example.com/compare/v1.3.0...v1.4.0
```

Le date ISO 8601 si ordinano correttamente e non si possono leggere male tra regioni diverse, il che è il motivo per cui la specifica le richiede (verificato su keepachangelog.com, il 9 settembre 2026). I riferimenti ai link in fondo puntano ogni versione al proprio diff, e tenerli come link in stile riferimento invece che URL inline mantiene le voci leggibili nel file grezzo — che è dove la maggior parte delle persone le leggerà.

Due dettagli evitano discussioni più avanti. Usa `## [1.4.0]` invece di un titolo di primo livello per ogni versione, così il file ha un solo titolo e ogni versione sta allo stesso livello; un sito di documentazione che rende il file altrimenti produrrebbe una pagina con più titoli in competizione. E tieni tutta la storia in un solo file finché non diventa davvero ingestibile, a quel punto archivia per anno piuttosto che per versione principale, perché i lettori cercano per data.

## Versioni, cambiamenti che rompono la compatibilità, e i commit sotto

Un numero di versione è una promessa su quanta attenzione leggere. Semantic Versioning 2.0.0 lo dichiara in una riga ciascuno: MAJOR per cambiamenti incompatibili dell'API, MINOR per funzionalità aggiunta in modo compatibile all'indietro, PATCH per correzioni di bug compatibili all'indietro (verificato su semver.org, il 9 settembre 2026).

| Incremento | Cosa promette al lettore | Cosa dovrebbe fare |
| --- | --- | --- |
| PATCH | Niente da cui dipende è cambiato di forma | Aggiorna, legge solo Fixed e Security |
| MINOR | Esistono cose nuove; le vecchie si comportano come prima | Aggiorna, scorre Added per quello che aspettava |
| MAJOR | Qualcosa da cui potrebbe dipendere è sparito o diverso | Legge Removed e Changed per intero, pianifica il lavoro |

La promessa vale solo se il progetto ha detto quale è la sua superficie pubblica. La specifica è esplicita sul fatto che il software che usa il versionamento semantico deve dichiarare un'API pubblica, nel codice o nella documentazione, e che la dichiarazione dovrebbe essere precisa e completa (verificato su semver.org, il 9 settembre 2026). La maggior parte dei progetti salta questo passaggio, e allora ogni discussione su se un cambiamento rompesse la compatibilità diventa una discussione sulle intenzioni.

### Cosa conta come cambiamento che rompe la compatibilità per questo progetto

Questa è la sola domanda sulla versione che un lettore ha davvero, e nessuna specifica può risponderle, perché "incompatibile" dipende da cosa hai promesso. Scrivi la risposta una volta, nella guida per chi contribuisce, e la conversazione sul rilascio diventa breve. Una lista ragionevole di cosa considerare:

- Rimuovere o rinominare qualunque cosa richiamabile: un endpoint, un flag, una chiave di configurazione, una funzione esportata, il nome di un evento.
- Rimuovere un campo da una risposta, o cambiarne il tipo. Aggiungerne uno di solito è sicuro; rendere obbligatorio un campo opzionale non lo è.
- Irrigidire la validazione, così un input che prima veniva accettato adesso viene rifiutato.
- Cambiare un valore predefinito, quando il vecchio valore stava facendo un lavoro per chi non lo aveva mai impostato.
- Cambiare un codice di errore, uno stato di uscita, o la forma di un corpo di errore su cui chi chiama fa dei rami.
- Abbandonare il supporto a un runtime, a un sistema operativo o a una versione di database.
- Cambiare l'ordine dell'output, quando niente prometteva quell'ordine ma tutti ci facevano affidamento.
- Correggere un bug in un modo che rimuove un comportamento su cui delle persone avevano costruito qualcosa. Questo caso è genuinamente controverso, e la gestione onesta è nominarlo sia in Changed che in Fixed, e dire chi è coinvolto.

Poi le cose che accendono discussioni con regolarità e vale la pena decidere in anticipo: il formato dei log, i nomi delle metriche, i nomi delle classi HTML, lo schema del database per chiunque lo interroghi direttamente, e qualunque cosa raggiungibile tramite reflection o un'interfaccia a plugin. Se quelle non fanno parte della superficie pubblica, dillo prima che qualcuno ne dipenda.

### Versione zero, e la via di fuga delle pre-release

La versione principale zero è per lo sviluppo iniziale: qualunque cosa può cambiare in qualunque momento, e l'API pubblica non dovrebbe essere considerata stabile (verificato su semver.org, il 9 settembre 2026). È una licenza vera a muoversi, e scade nel momento in cui qualcuno metta la cosa in produzione. Se sei su `0.x` e il changelog ha smesso di menzionare cambiamenti che rompono la compatibilità perché sono permessi, il numero di versione adesso nasconde informazioni al lettore invece di dargliele.

Gli identificatori di pre-release — la parte dopo un trattino — servono a spedire a chi ha accettato il rischio, e i metadati di build dopo un segno più vengono ignorati del tutto quando si confrontano le versioni (verificato su semver.org, il 9 settembre 2026). Nessuno dei due sostituisce una voce di changelog. Chi aggiorna a `2.0.0-rc.1` ha ancora bisogno della lista, e probabilmente ne ha bisogno più di chiunque altro.

### Conventional Commits come lato dell'input

Se un generatore deve scrivere la lista, qualcosa deve dirgli quali commit contano. Conventional Commits 1.0.0 è la risposta abituale: un messaggio nella forma `<type>[optional scope]: <description>`, con un corpo e dei footer opzionali. Nomina `feat` e `fix` e ne permette altri, suggerendo `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` e `test`. I cambiamenti che rompono la compatibilità si segnalano con un footer `BREAKING CHANGE:` oppure con un `!` prima dei due punti, e la mappatura sulle versioni è diretta: `fix` è un PATCH, `feat` è un MINOR, e un cambiamento che rompe la compatibilità di qualunque tipo è un MAJOR (verificato su conventionalcommits.org, il 9 settembre 2026).

Vale la pena adottarlo, e vale la pena essere onesti su cosa compra. Rende possibile la generazione: uno strumento può ordinare i commit in sezioni e calcolare la prossima versione senza nessuno in mezzo. Non rende buone le note. La convenzione vincola il prefisso, non la frase dopo, e `feat(export): add dateFrom param to POST /exports` è un commit conforme alla convenzione e una riga di changelog scarsa.

### Cosa la convenzione non risolve

Quattro lacune, tutte visibili nell'output generato:

- **Il destinatario della frase.** Una descrizione di commit è scritta per chi legge il diff. Niente nella convenzione chiede all'autore di scrivere per un cliente, quindi nessuno lo fa.
- **Un cambiamento, più commit.** Un cambiamento visibile all'utente arriva spesso come quattro commit in due settimane. Un generatore produce quattro righe; il lettore ne aveva bisogno di una.
- **Gravità e urgenza.** Non esiste un tipo `security:` nella specifica, e nessun modo per dire "critico, applica la patch stanotte" in un prefisso. Quel giudizio lo aggiunge una persona dopo, o non lo aggiunge nessuno.
- **Titoli da squash-merge.** Su un repository che fa squash, il titolo della pull request diventa il messaggio di commit e quindi diventa la riga di changelog. È un argomento per revisionare i titoli delle pull request come testo pubblicato, oppure un argomento per non generare le note a partire da essi.

## I generatori di changelog, a confronto

Sono tutti gratuiti. La differenza interessante è cosa legge ciascuno, perché è quello che fissa i limiti di ciò che può sapere.

| Strumento | Legge | Produce | Non può sapere | Licenza |
| --- | --- | --- | --- | --- |
| Note di rilascio automatiche di GitHub | Le pull request unite, le loro etichette e i contributori | Un corpo di rilascio sulla release di GitHub, categorizzato per etichetta | Qualunque cosa assente da un titolo o da un'etichetta di pull request; se un cambiamento ti rompe qualcosa | Parte di GitHub |
| release-please | La storia git, cercando messaggi Conventional Commit | Una pull request di rilascio, un changelog aggiornato, incrementi di versione nei file linguistici, tag e release di GitHub | Qualunque cosa non in un messaggio di commit; non pubblica su registri | Apache 2.0 |
| semantic-release | Messaggi di commit (convenzioni Angular per default) e tag git | La prossima versione, le note di rilascio, un tag git, una pubblicazione su registro e una release GitHub | Qualunque cosa non in un messaggio di commit; non scrive nessun file di changelog senza il plugin | MIT |
| git-cliff | La storia git, tramite conventional commits o parser regex propri | Un file di changelog nella forma che dice il template | Qualunque cosa non in un messaggio di commit | Apache 2.0 o MIT |
| changesets | File Markdown di changeset scritti a mano da chi contribuisce | Incrementi di versione, changelog e pubblicazione in un monorepo | Qualunque cosa per cui nessuno ha scritto un changeset | MIT |
| auto-changelog | Tag git, storia dei commit, commit di merge e parole chiave che chiudono issue | Un file di changelog in forma compatta, Keep a Changelog o JSON | Qualunque cosa non in un commit, un merge o un'issue collegata | MIT |

### Le note di rilascio generate automaticamente da GitHub

Integrate nella pagina di release di GitHub come alternativa automatizzata a scrivere il corpo a mano: produce una panoramica delle pull request unite, una lista di contributori e un link al changelog. Un file `.github/release.yml` la controlla — dichiari le categorie e le etichette di pull request che rientrano in ognuna, e puoi escludere pull request per etichetta o per autore, globalmente o per categoria (verificato su docs.github.com, il 9 settembre 2026).

**Cosa non può sapere:** qualunque cosa non sia in un titolo o in un'etichetta. Questo la rende esattamente tanto buona quanto i tuoi titoli di pull request, e non ha nessun concetto di cambiamento che rompe la compatibilità a meno che tu non crei un'etichetta apposita e ricordi di applicarla. **Usalo quando** il pubblico sono già sviluppatori che leggono il repository, e l'alternativa è nessuna nota per niente.

### release-please

Analizza la storia git in cerca di messaggi Conventional Commit e apre una pull request di rilascio che mantiene aggiornata mentre il lavoro viene unito; al merge aggiorna il changelog, incrementa le versioni nei file specifici per linguaggio, crea i tag e la release GitHub. Non pubblica sui gestori di pacchetti e non gestisce una gestione dei branch complessa; esiste un'action raccomandata, `googleapis/release-please-action`. Licenza Apache 2.0 (verificato su github.com/googleapis/release-please, il 9 settembre 2026).

**Cosa non può sapere:** qualunque cosa assente dai messaggi di commit. **Usalo quando** vuoi che il changelog venga revisionato prima di essere spedito. La pull request di rilascio è la superficie di revisione, ed è lo strumento fra questi che invita davvero qualcuno a modificare il testo generato prima che qualcun altro lo legga — proprio la proprietà che serve a un team a cui importa della prosa.

### semantic-release

Determina il prossimo numero di versione, genera le note di rilascio e pubblica il pacchetto, guidato dai messaggi di commit sotto una convenzione formalizzata (Angular per default) e dai tag git per trovare l'ultimo rilascio. Si configura tramite plugin, e i quattro attivi per default sono `commit-analyzer`, `release-notes-generator`, `npm` e `github`; scrivere un `CHANGELOG.md` nel repository richiede `@semantic-release/changelog`, che non è tra questi. Licenza MIT (verificato su github.com/semantic-release/semantic-release e semantic-release.gitbook.io, il 9 settembre 2026).

**Cosa non può sapere:** qualunque cosa assente dai messaggi di commit — e per progetto non c'è nessun passaggio umano, quindi niente viene modificato lungo la strada. **Usalo quando** il rilascio dovrebbe essere una conseguenza del merge e nessuno dovrebbe dover decidere niente. È un beneficio genuino ed è anche il compromesso: rilasci completamente automatizzati e note di rilascio scritte a mano tirano in direzioni opposte, e la maggior parte dei team la risolve pubblicando le note generate per gli sviluppatori e scrivendo una pagina umana separata per tutti gli altri.

### git-cliff

Un generatore di changelog scritto in Rust che segue Conventional Commits e aggiunge parser regex propri per storie che non lo fanno. La configurazione vive in `cliff.toml`, dove definisci parser e gruppi di commit, e la forma dell'output è un template: usa Tera, la cui sintassi si basa su Jinja2 e sui template di Django. Disponibile da crates.io, npm, PyPI e Docker, e a doppia licenza Apache 2.0 o MIT (verificato su github.com/orhun/git-cliff e git-cliff.org, il 9 settembre 2026).

**Cosa non può sapere:** qualunque cosa assente dai messaggi di commit. **Usalo quando** hai una storia esistente che non segue nessuna convenzione, o quando l'output deve corrispondere a un formato che qualcun altro ha specificato — i parser regex e il template insieme colpiscono quasi ogni forma, cosa che nessuno degli altri promette davvero.

### changesets

Il caso strano, e il motivo per cui vale la pena guardarlo. Invece di leggere i commit, legge file Markdown che chi contribuisce scrive deliberatamente: un changeset dichiara quali pacchetti sono cambiati, quanto incrementare ognuno, e cosa dire a riguardo. Da questi incrementa le versioni, scrive i changelog e pubblica, con i monorepo e i pacchetti interdipendenti come obiettivo esplicito. Licenza MIT (verificato su github.com/changesets/changesets, il 9 settembre 2026).

**Cosa non può sapere:** qualunque cosa per cui nessuno ha scritto un changeset. **Usalo quando** le note contano più dell'automazione. Chiedere a chi scrive la frase nel momento in cui fa il cambiamento è tutta l'idea, ed evita sia i conflitti di merge di un blocco `Unreleased` condiviso sia il problema del pubblico dei messaggi di commit. Il costo è un passaggio che le persone dimenticano, motivo per cui i team che lo adottano di solito aggiungono un controllo che fa fallire una pull request senza changeset.

### auto-changelog

Uno strumento a riga di comando che genera un changelog dai tag git e dalla storia dei commit, inclusi i commit di merge e le issue chiuse per parola chiave, con output in forma compatta, Keep a Changelog o JSON. Non richiede nessuna convenzione di commit, usa template con Handlebars, supporta GitHub, GitLab, BitBucket e Azure DevOps, e segnerà i cambiamenti che rompono la compatibilità se gli dai un `--breaking-pattern` che corrisponde a come i tuoi messaggi li segnalano. Licenza MIT (verificato su github.com/cookpete/auto-changelog, l'8 settembre 2026).

**Cosa non può sapere:** qualunque cosa non in un commit, un merge o un'issue collegata. **Usalo quando** hai ereditato un repository con anni di storia disordinata e vuoi qualcosa di ragionevole oggi, senza riscrivere i commit di nessuno o adottare prima una convenzione.

## Cosa lascia fuori un changelog generato

La generazione è la risposta ovvia, ed è quella giusta per la lista dei cambiamenti. Dove fallisce è tutto quello che non è una lista, e i fallimenti sono coerenti abbastanza da poterli nominare.

**Il motivo per cui il rilascio esiste.** Dodici voci non dicono al lettore che questo è il rilascio che corregge i timeout degli export di cui tutti si sono lamentati. Due frasi in cima alla voce lo fanno. Nessuno strumento può scriverle, perché il motivo vive nei ticket di supporto e nelle conversazioni, non nei commit.

**Chi dovrebbe saltarlo.** "Se non usi l'integrazione SAML, qui non c'è niente per te" fa risparmiare più tempo al lettore di qualunque altra frase in un changelog, ed è la frase che un generatore non produrrà mai, perché produrla richiede sapere cosa un lettore potrebbe non usare.

**La gravità, in entrambe le direzioni.** L'output generato appiattisce tutto a una riga per commit. Una patch di sicurezza e una correzione di un tooltip sembrano identiche, e il lettore deve capire quale è quale dal testo. Segnare le due voci che contano è un lavoro per una persona.

**I problemi conosciuti.** Il bug con cui hai spedito, deliberatamente, perché l'alternativa era far slittare il rilascio. Non appare in nessun commit, perché non è stato corretto. Lasciarlo fuori significa che il primo che ci si imbatte apre un ticket, e il secondo, e l'undicesimo.

**Le scuse, dove sono dovute.** Se l'ultimo rilascio ha rotto qualcosa in produzione per i clienti, le note del rilascio successivo sono dove questo viene riconosciuto. Il silenzio si legge come non essersene accorti.

**Cosa costa.** Metti in bilancio la parte umana a meno di un'ora per rilascio per una persona nominata, più la revisione della riga di changelog dentro ogni pull request, che è un'occhiata piuttosto che un compito. Questo è tutto il conto, ed è il motivo per cui l'argomento per l'automazione completa vince di solito per default piuttosto che per merito. Il costo di non pagarlo è distribuito e più difficile da vedere: ticket di supporto che sono in realtà domande sul changelog, clienti bloccati tre versioni indietro perché nessuno poteva dirgli se aggiornare fosse sicuro, e integratori che scoprono un campo rimosso da un errore invece che da te.

L'accordo che funziona è entrambi. Fai assemblare la lista a un generatore a partire dai commit o dai changeset, poi fai aggiungere a una persona il riassunto, segnare le gravità, aggiungere i problemi conosciuti e controllare che ogni riga di Removed abbia dove indirizzare il lettore. Prima bozza generata, passaggio finale umano. Nessuna delle due metà è opzionale, e la seconda metà è quella che viene lasciata cadere.

## Chi legge un rilascio, e cosa serve a ciascuno

Una pagina di rilascio serve diverse persone che arrivano con domande diverse. Nominarle rende evidenti le omissioni, perché la maggior parte dei changelog risponde alla prima domanda e ignora le altre due.

| Lettore | Arriva chiedendo | Ha bisogno sulla pagina | Se ne va senza |
| --- | --- | --- | --- |
| Chi aggiorna | Devo aggiornare adesso? | Se qualcosa si rompe, la dimensione del cambiamento, e un motivo per disturbarsi | Resta sulla vecchia versione indefinitamente |
| L'integratore | Il mio codice funzionerà ancora? | Ogni rimozione e cambio di comportamento, nominati esattamente come li nomina il suo codice | Lo scopre da un 4xx in produzione |
| L'operatore | Cosa succede quando lo distribuisco? | Migrazioni, riavvii, cambi di configurazione, spostamenti di risorse, rollback | Incontra la migrazione dello schema durante il deploy |

### Chi aggiorna

Qualcuno sulla versione 1.2 che decide se spendere un pomeriggio sulla 1.4. Ha bisogno prima di tutto di un sì o un no sulla rottura, poi di una frase sul motivo per cui il rilascio esiste. Se sta saltando versioni ha bisogno delle voci di tutto ciò che sta in mezzo, il che è un argomento per un solo file con tutta la storia piuttosto che una pagina per rilascio. Le note che guidano con le nuove funzionalità stanno rispondendo alla domanda che questo lettore si è fatto per secondo.

### L'integratore

Qualcuno il cui codice chiama il tuo. Non gli interessa di cosa parla il rilascio; gli interessa se qualcuno dei sei o sette nomi da cui dipende appare in Removed o in Changed. Questo lettore è il motivo per cui le voci devono usare l'identificatore esatto — `api_key`, `POST /v2/exports`, `EXPORT_TIMEOUT_MS` — perché cercherà nella pagina la stringa che il suo codice contiene. Una prosa che dice "l'impostazione di configurazione dell'export" è impossibile da cercare e quindi inutile per lui.

### L'operatore

Qualcuno che lo distribuisce. Le sue domande riguardano appena il software: serve una migrazione, serve un riavvio, cambia l'uso di memoria o di connessioni, si può tornare indietro dopo che la migrazione è stata eseguita, e la vecchia versione continua a funzionare mentre entrambe sono attive. Quasi nessun changelog risponde a queste domande, ed è l'omissione che trasforma un aggiornamento di routine in un incidente. Un breve blocco "Distribuire questo rilascio" in cima a qualunque voce che ne ha bisogno è sufficiente.

## Scrivi la voce, non il titolo del ticket

Un modello di note di rilascio aiuta solo se le righe dentro sono scritte per un lettore:

- Guida con il nome che conosce — l'endpoint, l'impostazione, la voce di menu — non il modulo che lo contiene.
- Dì cosa è vero adesso. "Gli export vengono eseguiti in background" batte "Cambiato gli export per eseguirli in background".
- Nomina le cose esattamente come appaiono nel prodotto: `api_key`, non "l'impostazione della chiave API".
- Dai a ogni riga che rompe la compatibilità un'azione e una scadenza. "Passa a `/v2/exports` prima della 3.0" è una nota. "Endpoint deprecato" è una scusa.
- Una riga per cambiamento. Se ha bisogno di tre frasi, linka a una pagina con spazio per loro.

I numeri reali stanno bene qui — dimensioni, timeout, conteggi di ritentativi, date. "Prestazioni migliorate" è riempimento, perché il lettore non può verificarlo e non può agire su di esso.

### Le istruzioni di migrazione come parte della voce

Una riga di Removed o Changed che descrive la destinazione ma non il viaggio ha spostato il lavoro sul lettore, che ha meno contesto di quanto ne hai tu. La correzione è piccola: due o tre righe in più, indentate sotto la voce, che dicono cosa cambiare e cosa succede se non lo si fa.

```markdown
### Removed
- `GET /v1/export`. Use `GET /v2/exports`. The response body is identical
  apart from `id`, now a string rather than an integer. Requests to the old
  path return 410 with a `Link` header pointing at the replacement.

  **Migrating:** change the path, and stop parsing `id` as an integer.
  The official clients do both for you from 2.2 onwards, so upgrading the
  client first is the shorter route.

### Deprecated
- `apiKey` in `config.yaml`, in favour of `api_key`. Both are read in all
  1.x releases; the old name logs a warning at startup. It is removed in
  2.0, not before 1 March 2027.
```

Tre cose lo fanno funzionare. Nomina la modalità di fallimento, così un lettore può riconoscerla nei propri log. Dà una data e non solo una versione, perché "prima della 2.0" è impossibile da pianificare quando nessuno sa quando arriverà la 2.0. E offre prima la strada più economica, che è quello che vuole davvero un lettore con un pomeriggio a disposizione.

### Avvisi di deprecazione che sopravvivono all'essere ignorati

Una deprecazione è un messaggio inviato a qualcuno che è occupato, quindi presumi che venga perso. La versione che funziona arriva tre volte: nelle note di rilascio quando comincia, nel software stesso come avviso che nomina il sostituto, e di nuovo nelle note di rilascio quando la rimozione arriva. Ripeti la voce in Deprecated in ogni rilascio intermedio. Chi aggiorna dalla 1.1 alla 1.9 in un solo salto legge una voce, e deve essere quella ancora in piedi.

Due modalità di fallimento vale la pena evitare. Un avviso senza sostituto nominato — "questa impostazione è deprecata" — manda il lettore a cercare, e troverà un post su un forum piuttosto che la tua documentazione. E una rimozione che arriva prima di quanto annunciato distrugge il valore di ogni futura deprecazione che scriverai, perché le date smettono di essere informazione.

## Come far funzionare un processo di note di rilascio nel tempo

1. **Nomina un responsabile per rilascio.** Una rotazione va bene e una responsabilità condivisa no, perché un changelog senza responsabile lo scrive chiunque se ne accorga per ultimo, la sera del rilascio, dal `git log`.
2. **Scrivi la voce nella pull request che fa il cambiamento**, sia come riga sotto `Unreleased` sia come file di changeset, così la descrizione è scritta da chi sa il perché e revisionata da chi revisiona il cambiamento.
3. **Scrivi cosa conta come cambiamento che rompe la compatibilità per il tuo progetto, e dove finisce la superficie pubblica.** Senza questo, ogni rilascio ripete lo stesso argomento e la risposta varia con chi è più stanco.
4. **Rendi visibile in revisione l'omissione.** Un controllo che fa fallire una pull request che tocca un comportamento pubblico senza nessuna riga di changelog costa un pomeriggio da costruire e rimuove per sempre la conversazione sull'applicazione della regola.
5. **Dai a ogni riga di Removed e Deprecated un'azione e una data.** Entrambe le metà sono portanti: l'azione dice al lettore cosa cambiare, la data gli dice per quando deve essere fatto, e solo la coppia delle due è qualcosa che un team può metterci dentro uno sprint.
6. **Tieni il file nel repository, in Markdown, e derivane tutto il resto** — una sola fonte che fa il diff e si revisiona, [come dovrebbe vivere lì il resto della documentazione](/blog/documentation-that-lives-in-the-repo), con la versione sul sito, l'email e la pagina di rilascio come rese piuttosto che copie.
7. **Fai leggere a qualcuno fuori dal team la sezione in alto prima che venga spedita.** Il supporto è il lettore ideale: se non riesce a capire cosa è cambiato, non ci riusciranno nemmeno i clienti a cui deve rispondere, e lo scoprirai dai ticket.

## Da CHANGELOG.md a una pagina che puoi inviare

Il file nel repository serve chi legge il repository. Supporto, vendite e clienti hanno bisogno di un link, ed è lì che le note di rilascio di solito si bloccano.

Trascinare `CHANGELOG.md` su TransformPipe ti dà un unico file `.html` autosufficiente — stili inline, nessuno script, nessuna richiesta di rete — da allegare a un'email o pubblicare come pagina in sola lettura. Vale la pena capire questa proprietà prima di inviare qualcosa: [un unico file che non chiede niente alla rete](/blog/self-contained-html-explained) si apre uguale su un laptop senza connessione così come sul tuo, e continuerà ad apririsi fra cinque anni. Revocare quel link più avanti blocca solo uno che hai già inviato, cosa che [condividere un documento Markdown come link](/blog/share-a-markdown-document-as-a-link) copre per intero. Se il rilascio arriva anche con una nota di accompagnamento e una guida all'aggiornamento, trascinarle tutte e tre insieme [le incatena in un unico documento](/blog/merging-many-markdown-files) nell'ordine giusto.

Per un rilascio tagliato dalla CI, la stessa cosa funziona senza supervisione:

```bash
node cli/tp.mjs push CHANGELOG.md --name "Release 1.4.0" --share link
```

La GitHub Action copre la metà lato pull request, pubblicando il Markdown che una pull request ha cambiato e commentando i link — vedi [pubblicare Markdown da GitHub Actions](/blog/publish-markdown-from-github-actions). Un generatore che apre una pull request di rilascio si sposa bene con questo: le note vengono revisionate come testo mentre il diff è ancora aperto, e la pagina pubblicata viene dal file che è stato approvato piuttosto che da una copia che qualcuno ha incollato.

Prima di tutto questo, un breve controllo sulla sezione in alto:

- [ ] Ogni riga di Removed e Changed dice al lettore cosa fare.
- [ ] Nessuna riga nomina un file, un modulo o un numero di ticket che il lettore non può vedere.
- [ ] La versione e la data corrispondono al tag.
- [ ] I cambiamenti che rompono la compatibilità e le correzioni di sicurezza sono segnati come tali, non lasciati allo stesso livello del resto.
- [ ] Qualcuno fuori dal team lo ha letto e saprebbe dire cosa è cambiato.

Apri il tuo changelog e leggi la sua sezione più recente come farebbe un cliente. Taglia le righe che falliscono le tre prove, aggiungi l'azione mancante a ogni cambiamento che rompe la compatibilità, scrivi le due frasi che nessun generatore può scrivere, poi convertilo e invia il link — [trasformare quel Markdown in un file HTML autosufficiente](/) richiede tanto tempo quanto leggere questo paragrafo, gratis, nel browser, senza niente caricato quando hai fatto l'accesso.

## Domande frequenti

### Qual è la differenza tra un changelog e le note di rilascio?

Un changelog è il file cumulativo, con la versione più recente prima, che registra ogni rilascio. Le note di rilascio sono quanto vale una versione, scritte per un pubblico particolare e che spesso portano un riassunto e indicazioni di migrazione che il file non ha. In pratica il changelog è la fonte e le note di rilascio sono una resa di una sua sezione.

### Devo usare Keep a Changelog?

No, ma le sue sei categorie sono un punto di partenza migliore di qualunque cosa inventerai sotto pressione di tempo, e i lettori che le hanno già viste altrove sanno già dove guardare. La specifica è breve e con licenza MIT (verificato su keepachangelog.com, il 9 settembre 2026). Le parti che vale la pena tenere comunque sono il raggruppamento per conseguenza, un'intestazione `Unreleased`, e le date ISO.

### Devo generare il mio changelog dai messaggi di commit?

Genera la lista, scrivi il riassunto. Strumenti come release-please, git-cliff e semantic-release ordineranno i conventional commit in sezioni e calcoleranno la versione, il che rimuove la metà noiosa del lavoro. Non possono dire perché il rilascio esiste, quali voci sono urgenti, o chi può saltarlo, e sono proprio le righe che i lettori ricordano.

### Cosa conta come cambiamento che rompe la compatibilità?

Il versionamento semantico definisce MAJOR come un cambiamento incompatibile dell'API e richiede che tu dichiari la tua API pubblica con precisione (verificato su semver.org, il 9 settembre 2026), quindi la risposta dipende da cosa hai promesso. Rimuovere o rinominare qualunque cosa richiamabile, cambiare il tipo di un campo, irrigidire la validazione e abbandonare il supporto a un runtime rompono la compatibilità quasi ovunque. Scrivi la tua lista prima della discussione, non durante.

### Dove dovrebbe vivere il changelog, nel repository o sul sito?

Nel repository, come `CHANGELOG.md`, perché è lì che fa il diff e viene revisionato insieme al cambiamento che l'ha causato. Pubblica da lì verso ovunque siano i lettori — un sito, una pagina di rilascio, un file inviato per email — piuttosto che mantenere una seconda copia, che si allontanerà nel giro di due rilasci.

### Quanto dovrebbe essere lunga una singola voce?

Una riga per la maggior parte dei cambiamenti, più due o tre righe indentate per qualunque cosa richieda una migrazione. Se una voce ha bisogno di un paragrafo ha bisogno di una pagina: linka a quella pagina dalla voce e tieni la lista scorribile, perché il compito della lista è aiutare qualcuno a decidere se leggere oltre.

### I servizi interni hanno bisogno di note di rilascio?

Sì, e sono più economiche da scrivere, perché sai esattamente chi sono i tuoi lettori e come chiamano le cose. I team che consumano il tuo servizio hanno bisogno delle stesse tre risposte — cosa si è rotto, cosa è cambiato, cosa fare a riguardo — e un messaggio in un canale che scorre via non è un changelog.
