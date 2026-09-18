---
title: La documentazione che vive accanto al codice
description: "Perché la documentazione nel repository resta più vera: i quattro tipi di documenti, una cartella che scala, la review che intercetta la deriva, dove fallisce."
updated: 2026-09-09
date: 2026-07-29
tag: Workflow
keywords: documentazione in markdown, docs as code, modello di readme, come scrivere un buon readme, documentazione interna aziendale, docs in git, diataxis, architecture decision record, struttura della cartella docs, file contributing, markdownlint, vale prose linter
---

La wiki dice che il servizio ascolta sulla porta 8080. È passata alla 8443 la primavera scorsa. Nessuno ha mentito: chi ha spostato la porta ha modificato un file di configurazione, un test e un manifest di deploy, e nessuno di questi era vicino alla frase che ora è sbagliata.

Questo è l'argomento a favore dei docs as code. Il Markdown nel repository non rende un documento corretto. Mette la frase sbagliata davanti a chi sta per renderla sbagliata, mentre il file è ancora aperto.

Non è una vittoria gratuita, e la maggior parte delle squadre che ci provano finisce con una cartella `docs/` che nessuno apre. La differenza tra i due risultati non è lo strumento. È se i documenti sono ordinati per ciò che il lettore è venuto a fare, se qualcuno è indicato come responsabile di ciascuno, e se la review che intercetta una porta sbagliata è la stessa che intercetta un nome di funzione sbagliato.

### In breve

Metti nel repository tutto ciò che un commit può rendere falso, e fai la review del paragrafo nella stessa pull request del comportamento che descrive — questo è l'intero meccanismo, e tutto il resto lo sostiene. Ordina i file secondo i quattro tipi di documentazione così che chi legge sappia quale file risponde alla sua domanda, tieni le decisioni come registri datati invece che come documenti di progetto, e lascia che `CODEOWNERS`, un linter Markdown, un linter di prosa e un controllo dei link fermino la build sugli errori più a buon mercato. Poi pubblica le pagine renderizzate, perché chi ha più bisogno della documentazione spesso non può clonare un repository, e non dovrebbe doverlo fare.

## Cosa dà davvero il repository

**La stessa review.** Una pull request che cambia il comportamento e non tocca nessuna documentazione è un'omissione visibile — chi fa la review vede il vuoto mentre la modifica è ancora davanti a lui. Correggere la wiki dopo è un compito separato, e i compiti separati perdono contro qualunque cosa stia bruciando in quel momento.

**La stessa storia.** `git log -S'8080' -- docs/` trova il commit che ha aggiunto o rimosso una stringa, il che data la frase che è diventata sbagliata. `git blame` restituisce il commit dietro un paragrafo, e da lì la pull request e il ragionamento che la prosa non ha mai raccontato. Le cronologie delle wiki conservano revisioni, raramente decisioni.

**Gli stessi strumenti.** I documenti in git sono file di testo: grep li trova, e un controllo dei link può fermare la build su un percorso relativo morto. La documentazione di una funzione non ancora rilasciata sta nel branch insieme al codice ed esce quando quello viene unito — non una settimana prima, non un mese dopo.

**Gli stessi indirizzi.** Un link relativo da un file a un altro è un percorso che uno strumento può risolvere e una build può far fallire. Un link a una wiki è un URL, e una pagina wiki rinominata lascia ogni link verso di essa a puntare sul nulla, scoperto mesi dopo da un lettore che pensa che il documento sia stato cancellato di proposito.

**Lo stesso rilascio.** La documentazione che si unisce insieme al codice non può descrivere una versione non ancora uscita, e non può restare indietro rispetto a una già uscita. Su una wiki, la pagina e il deploy sono due eventi che qualcuno deve ricordarsi di far coincidere, e il divario tra i due è esattamente dove vive il numero di porta sbagliato.

Il limite onesto: niente di tutto questo obbliga qualcuno a scrivere il documento. Rende visibile il non averlo scritto, il che è una pretesa più piccola di quella che l'attivismo per i docs as code fa di solito.

## I quattro tipi di documentazione, e perché mescolarli li nasconde tutti

La maggior parte della documentazione interna è impossibile da trovare per un motivo che non ha niente a che fare con la ricerca. Una pagina chiamata “Per iniziare” si apre come una lezione, diventa un elenco di chiavi di configurazione tre schermate più sotto, e finisce con due paragrafi sul perché la squadra ha scelto Postgres. Ogni parte è accurata. Niente è trovabile, perché chi cerca la chiave di configurazione non apre una pagina chiamata “Per iniziare”, e chi sta imparando il sistema smette di leggere alla tabella.

Diátaxis è il framework che dà un nome al problema. È il lavoro di Daniele Procida, e identifica quattro tipi di documentazione che servono quattro bisogni diversi del lettore: tutorial, guide pratiche, riferimento tecnico e spiegazione (verificato su diataxis.fr, il 9 settembre 2026). L'affermazione che lo rende utile non è che esistano quattro categorie. È che un singolo documento può servire bene solo una di esse, e che un documento che cerca di servirne due non ne serve nessuna.

| Tipo | Orientato a | La domanda del lettore | Come si presenta | Come va storto |
| --- | --- | --- | --- | --- |
| Tutorial | Apprendimento | “Insegnami questo” | Un'attività pratica dal nulla a un risultato che funziona | Presume un passo che il principiante non ha fatto, e lui perde sicurezza |
| Guida pratica | Un obiettivo | “Come faccio X?” | Indicazioni attraverso un problema, per chi è già competente | Si ferma a spiegare, e il lettore competente perde il filo |
| Riferimento | Informazione | “Quali sono le opzioni?” | Descrizione neutra del meccanismo, che rispecchia la struttura del codice | Consiglia, ipotizza o vende, e smette di essere affidabile |
| Spiegazione | Comprensione | “Perché è fatto così?” | Trattazione discorsiva che permette la riflessione, letta lontano dal lavoro | Si trasforma in istruzioni che nessuno segue |

Le distinzioni sono più nette di quanto sembrino. Diátaxis è esplicito sul fatto che le guide pratiche sono del tutto distinte dai tutorial e che le due cose sono confuse di continuo: un tutorial serve chi apprende e non sa ancora cosa vuole, mentre una guida pratica serve il lavoro di chi è già competente e sa cosa vuole. Il riferimento deve essere austero — il suo compito è la certezza, e la linea del sito per descriverlo è che il materiale di riferimento non si legge quasi mai, si consulta, con una struttura che rispecchia quella del prodotto (verificato su diataxis.fr, il 9 settembre 2026). La spiegazione è quella senza un confine naturale, motivo per cui si estende su tutto il resto se glielo lasci fare.

**Cosa cambia in un repository.** Ordinare per tipo è quasi gratuito quando i documenti sono file. Una cartella per tipo è la mossa ovvia:

```
docs/
  tutorials/       first-deploy.md
  how-to/          rotate-the-signing-key.md, restore-from-backup.md
  reference/       configuration.md, http-api.md, error-codes.md
  explanation/     why-we-left-the-monolith.md
  decisions/       0007-postgres-over-dynamodb.md
```

Se quattro cartelle sono più cerimonia di quanto il tuo repository merita, funziona la versione più economica: dai a ogni file un nome secondo il suo tipo e non mescolare i tipi al suo interno. `restore-from-backup.md` è una guida pratica e non dovrebbe contenere nessun paragrafo che spiega il formato del backup; la spiegazione ha un file suo e un link. Il test è una sola frase — se non riesci a dire quale dei quattro tipi sia un documento, sono due documenti.

**Perché questa è la sezione che ripaga.** Gli altri fallimenti di questo pezzo sono recuperabili. Una frase invecchiata si corregge appena qualcuno se ne accorge; un linter mancante si aggiunge in un pomeriggio. Un insieme di documentazione ordinato per squadra, per servizio o per l'ordine in cui è stato scritto resta introvabile per sempre, perché niente in esso dice al lettore dove guardare, e la risposta abituale — aggiungere una pagina che indicizza le altre pagine — crea un quinto documento che invecchia anche lui.

## Una cartella docs che scala

I repository falliscono la documentazione in due direzioni. Uno mette tutto nel README finché non arriva a quattromila parole e nessuno legge oltre il comando di installazione. L'altro crea `docs/` il primo giorno, la riempie di tre abbozzi e un `architecture.md` che descrive un progetto abbandonato al secondo mese. Quello che funziona è un piccolo numero di file con compiti distinti, ognuno dei quali qualcuno può riconoscere quando è sbagliato.

| File | Cos'è | Chi lo scrive | Cosa lo rende sbagliato |
| --- | --- | --- | --- |
| `README.md` | L'indice e la strada più corta verso una copia funzionante | Chi cambia il setup | Un comando che non funziona più |
| `docs/` | Tutto ciò che è diventato troppo grande per il README, ordinato per tipo | Chi cambia il comportamento | Un commit al codice che descrive |
| `docs/decisions/` | Un registro datato per ogni decisione architetturale | Chi ha preso la decisione | Niente — un registro superato resta vero sul proprio momento |
| `CONTRIBUTING.md` | Come proporre una modifica e cosa verrà controllato | I maintainer | Un cambiamento al processo di review o alla toolchain |
| `CHANGELOG.md` | Cosa è cambiato per un lettore, per ogni rilascio | Chi rilascia | Un rilascio che esce senza una voce |
| `CODEOWNERS` | A chi viene chiesto di fare la review di quali percorsi | I team lead | Una squadra rinominata, una persona che se ne va |

**Il README è un indice, non un manuale.** Il suo compito è portare uno sconosciuto a una copia funzionante e poi indicare tutto il resto. Ogni sezione che supera una schermata diventa un file in `docs/` con un puntatore di una riga lasciato al suo posto. Questa è la regola strutturale più affidabile di tutte, perché un README che resta corto resta letto, e un README che nessuno legge è dove le istruzioni di setup sbagliate si nascondono più a lungo.

**`docs/` contiene ciò che un commit può rendere falso.** Chiavi di configurazione, comportamento dell'API, passi di deploy, codici di errore, il runbook per l'allarme che chiama alle tre di notte. Sono i documenti la cui falsità è causata da una modifica al codice, motivo esatto per cui stanno accanto a esso. Qualunque cosa la cui falsità sia causata da una decisione invece che da un commit non guadagna niente da git.

### I registri di decisione, e perché battono un documento di progetto

Un documento di progetto descrive un sistema come qualcuno sperava che fosse, in una data che il documento raramente porta con sé, e diventa sbagliato alla prima modifica del piano. Nessuno lo aggiorna, perché aggiornarlo significa riscrivere una narrazione, e nessuno lo cancella, perché potrebbe ancora essere giusto in qualche punto.

Un architectural decision record ha una forma diversa. Cattura una singola decisione e la sua motivazione — una scelta di progetto giustificata che risponde a un requisito architetturalmente significativo — insieme ai compromessi e alle conseguenze che ha portato con sé. La pratica è stata rilanciata da Michael Nygard in un post del 2011, “Documenting Architecture Decisions”, e il formato si basa su un lavoro precedente di Zdun e altri sulle decisioni architetturali sostenibili (verificato su adr.github.io, il 9 settembre 2026). Il modello di Nygard è quello da cui parte la maggior parte delle squadre; MADR — Markdown Architectural Decision Records — è un modello più snello per lo stesso compito, con doppia licenza MIT o CC0 (verificato su adr.github.io, il 9 settembre 2026).

```markdown
# 7. Postgres over DynamoDB for the ledger

- Status: accepted
- Date: 2026-03-04
- Deciders: payments team

## Context

We need transactional writes across the ledger and the balance
cache. The rest of the estate is DynamoDB.

## Decision

Postgres, on the managed instance the billing service already uses.

## Consequences

One more datastore to operate, and a second connection pool in the
worker. In exchange, the double-write bug that closed BILL-412
becomes structurally impossible rather than tested for.
```

Il motivo per cui un registro sopravvive a un documento di progetto è che non è mai sbagliato. È un'affermazione su cosa una squadra sapeva e ha scelto in una data. Quando la decisione viene ribaltata, non modifichi il registro 7 — scrivi il registro 12, segni il 7 come superato, e collega i due. Il risultato è una cartella che si legge come una storia del ragionamento, che è ciò di cui un nuovo ingegnere ha davvero bisogno e ciò che `git log` non dà mai del tutto, perché un commit registra cosa è cambiato e non cosa è stato rifiutato.

Numerare i file (`0007-postgres-over-dynamodb.md`) li mantiene ordinati e dà a ognuno un nome stabile da citare in una pull request. Tienili corti. Un registro che richiede un'ora per essere scritto non verrà scritto, e i quattro titoli qui sopra bastano a rispondere alla domanda di qui a un anno, che è sempre qualche versione di “perché diavolo è fatto così”.

### CONTRIBUTING, e i controlli che dovrebbe nominare

`CONTRIBUTING.md` può stare nella radice del repository, in `docs/`, o in `.github/`, e GitHub mostra un link a esso quando qualcuno apre una pull request o una issue, oltre che nella barra laterale del repository (verificato su docs.github.com, il 9 settembre 2026). Quel posizionamento è tutto il suo valore: è l'unico documento che un contributore alle prime armi vede nel momento in cui ne ha bisogno.

Limitalo a ciò che un contributore deve fare, non a ciò in cui il progetto crede. I passi per eseguire i test, la convenzione dei messaggi di commit se ce n'è una, cosa controllerà la CI e quindi cosa farà fallire il processo, quanto dura di solito la review, e dove chiedere. Se la tua documentazione vive in `docs/`, è anche qui che lo dici — un contributore che non sa che i documenti sono nel repository non andrà a cercarli.

### CHANGELOG, e perché non è il log dei commit

Il changelog è l'unico file della cartella scritto per qualcuno fuori dal repository. Keep a Changelog è la convenzione che vale la pena adottare, in parte per le sue sei categorie — Added, Changed, Deprecated, Removed, Fixed, Security — e soprattutto per il suo argomento secondo cui un log dei commit fa un pessimo changelog perché è pieno di rumore: commit di merge, titoli oscuri, oscillazioni della documentazione (verificato su keepachangelog.com, il 9 settembre 2026). Un commit documenta un passo nell'evoluzione del codice sorgente. Una voce di changelog documenta una differenza degna di nota, spesso a cavallo di più commit, per un lettore che non ha mai visto il codice. [Trasformare quel file in note che le persone leggono davvero](/blog/release-notes-from-markdown) è un mestiere separato, e il modo in cui fallisce è sempre lo stesso: spedire il diff invece della conseguenza.

## Gli strumenti, a confronto

Puoi far girare un insieme di documentazione da un repository senza nessun generatore: file Markdown, un convertitore quando serve una pagina a qualcuno, e niente da mantenere. Questo smette di funzionare nel punto in cui i lettori hanno bisogno di navigazione, ricerca fra i documenti, e un URL stabile per pagina. Gli strumenti qui sotto sono quelli che vale la pena conoscere prima di scegliere.

| Strumento | Cosa richiede | Cosa costruisce | Licenza | A chi si adatta |
| --- | --- | --- | --- | --- |
| Markdown semplice più un convertitore | Niente, se il convertitore gira nel browser | Un file HTML autonomo per documento | Varia secondo il convertitore | Una manciata di runbook e README; documenti con un destinatario preciso |
| MkDocs | Python | Un sito HTML statico da Markdown e un file YAML di configurazione | BSD 2-Clause | Progetti Python che vogliono un sito di documentazione nel giro di un pomeriggio |
| Material for MkDocs | Python, come tema di MkDocs | Lo stesso sito, con ricerca integrata, navigazione e social card | MIT, con accesso anticipato alle nuove funzioni per gli sponsor | Squadre che vogliono che sembri giusto senza scrivere CSS |
| Docusaurus | Node.js, React | Un sito statico con pagine MDX e documentazione versionata | MIT (la sua documentazione è Creative Commons) | Documentazione di prodotto che deve servire più versioni rilasciate insieme |
| Sphinx con MyST | Python | HTML, LaTeX per PDF, ePub e Texinfo da un'unica fonte | BSD 2-Clause; MyST-Parser è MIT | Riferimento API generato dal codice, e qualunque cosa richieda un PDF |
| Hugo | Niente oltre al binario; scritto in Go | Un sito statico di qualsiasi forma, non solo documentazione | Apache 2.0 | Documentazione che condivide un sito con pagine di marketing |
| mdBook | Niente oltre al binario; scritto in Rust | Un libro online con capitoli e un indice | MPL 2.0 | Materiale lineare — manuali, guide, formazione |
| Docsify | Un server web; carica da un CDN | Nessun file statico: renderizza il Markdown nel browser | MIT | Una cartella `docs/` che vuoi servire senza aggiungere un passaggio di build |

Verificato su mkdocs.org e github.com/mkdocs/mkdocs, squidfunk.github.io/mkdocs-material, docusaurus.io e github.com/facebook/docusaurus, sphinx-doc.org e github.com/sphinx-doc/sphinx, github.com/executablebooks/MyST-Parser, gohugo.io, github.com/rust-lang/mdBook e github.com/docsifyjs/docsify, il 9 settembre 2026.

**MkDocs** è la distanza più corta tra una cartella di Markdown e un sito di documentazione: un file YAML, un comando, HTML statico in uscita (verificato su mkdocs.org, il 9 settembre 2026). È scritto in Python e ha licenza BSD 2-Clause. Se il tuo progetto è già Python, non c'è niente da discutere.

**Material for MkDocs** è un tema piuttosto che un generatore, ed è il motivo per cui la maggior parte delle persone incontra MkDocs. Fornisce ricerca, navigazione responsive e generazione di social card senza che tu debba scrivere CSS, con licenza MIT, e un programma Insiders che dà agli sponsor accesso anticipato alle nuove funzioni (verificato su squidfunk.github.io, il 9 settembre 2026). Il compromesso è che il tuo sito somiglierà a moltissimi altri siti, cosa che per la documentazione interna è una qualità.

**Docusaurus** è costruito su React e MDX e produce file HTML statici, con il versionamento dei documenti come funzione di prima classe (verificato su docusaurus.io, il 9 settembre 2026). Il versionamento è il motivo per sceglierlo: se supporti tre rilasci e ognuno ha bisogno del proprio albero di documentazione, niente altro qui lo fa con altrettanta pulizia. Il costo è una toolchain Node e la possibilità che la tua documentazione acquisisca componenti React, che sono codice, il che significa che la documentazione ora ha una build che può rompersi.

**Sphinx** è il più vecchio e il più capace, genera HTML, LaTeX per PDF, ePub e Texinfo da un'unica fonte, ed è BSD 2-Clause e scritto in Python (verificato su sphinx-doc.org e github.com/sphinx-doc/sphinx, il 9 settembre 2026). Il suo markup nativo è reStructuredText, che è una barriera vera per i contributori che conoscono solo Markdown; MyST-Parser la rimuove aggiungendo a Sphinx un parser CommonMark estesso, con licenza MIT, costruito su markdown-it-py (verificato su github.com/executablebooks/MyST-Parser, il 9 settembre 2026). Scegli questo quando serve un riferimento API generato e un PDF dalla stessa fonte.

**Hugo** è un singolo binario Go con licenza Apache 2.0 che costruisce siti statici di qualsiasi forma, documentazione compresa (verificato su gohugo.io, il 9 settembre 2026). Scegli questo quando la documentazione è una sezione di un sito più grande, o quando nessuno vuole gestire un ambiente Python o Node sulla macchina di build.

**mdBook** è un'utilità Rust, con licenza MPL 2.0, che trasforma il Markdown in un libro online (verificato su github.com/rust-lang/mdBook, il 9 settembre 2026). I libri sono lineari, il che è esattamente sbagliato per il riferimento ed esattamente giusto per un manuale o un corso di formazione che ti aspetti venga letto dall'inizio alla fine.

**Docsify** è quello strano: non costruisce niente. Carica da un CDN, renderizza il tuo Markdown nel browser al momento della richiesta, e non produce nessun HTML costruito staticamente, con licenza MIT (verificato su github.com/docsifyjs/docsify, il 9 settembre 2026). Questo elimina del tutto il passaggio di build, al prezzo di un sito il cui contenuto è invisibile a qualunque cosa non esegua JavaScript.

**E nessun generatore affatto** resta una risposta reale, più spesso di quanto l'elenco qui sopra suggerisca. Se hai undici file Markdown e ogni tanto la necessità di darne uno a una persona che non usa git, un convertitore e un link battono una pipeline di build che devi mantenere verde. La soglia è la navigazione: nel momento in cui un lettore deve muoversi tra documenti senza conoscerne i nomi dei file, vuoi un generatore, e [le tre domande che decidono se l'hai superata](/blog/static-site-generator-or-converter) vale la pena rispondervi prima di installarne uno.

## La review è ciò che mantiene vero un documento

Ogni meccanismo di questo pezzo si riduce a un'unica abitudine: il paragrafo cambia nella stessa pull request del comportamento. Tutto il resto esiste per far sì che quell'abitudine resista quando la persona è stanca e il rilascio è di venerdì.

**La modifica ai documenti viaggia insieme alla modifica al codice.** Non una issue di follow-up, non un ticket nello sprint successivo. Chi fa la review e vede una chiave di configurazione rinominata senza nessuna modifica sotto `docs/reference/` ne chiede una, e chiederla costa un commento. La stessa richiesta una settimana dopo costa una riunione, e la settimana dopo ancora non costa niente perché nessuno se lo ricorda più.

**`CODEOWNERS` mette un nome sulla cartella.** Il file vive in `.github/`, nella radice del repository o in `docs/` — GitHub cerca in quest'ordine e usa il primo che trova — e ai proprietari del codice viene automaticamente chiesta la review quando una pull request tocca i percorsi di loro competenza, anche se non sulle pull request in bozza. Diventa un cancello solo quando un amministratore attiva le review obbligatorie e richiede l'approvazione dei code owner. La sintassi somiglia a quella di gitignore, e vince l'ultimo pattern che corrisponde, il che sorprende parecchie persone (verificato su docs.github.com, il 9 settembre 2026).

```
/docs/reference/http-api.md   @acme/platform
/docs/how-to/                 @acme/sre
/docs/decisions/              @acme/architecture
```

Due regole lo rendono utile invece che decorativo. Possiedi cartelle, non l'intero albero, perché un solo proprietario su `docs/` significa che ogni modifica alla documentazione aspetta le stesse tre persone, e la coda insegna a tutti a evitarla. E tieni a mente la regola dell'ultimo match: un pattern ampio in fondo al file scavalca silenziosamente ogni pattern specifico sopra di esso.

**Il linting intercetta ciò in cui la review è debole.** Chi fa la review legge per il significato e perde la struttura. Le macchine fanno il contrario.

| Controllo | Strumento | Cosa intercetta | Licenza |
| --- | --- | --- | --- |
| Struttura Markdown | markdownlint | Livelli di intestazione che saltano, marcatori di lista incoerenti, spazi finali, fence non chiusi | MIT |
| Prosa | Vale | Deriva terminologica, parole vietate, regole di stile dalla tua guida | MIT |
| Link | lychee | Percorsi relativi morti, ancore rotte, URL esterni che non si risolvono più | Apache 2.0 o MIT |

markdownlint è un controllore di stile Node.js per Markdown e CommonMark con più di sessanta regole integrate, con licenza MIT, eseguito tramite `markdownlint-cli2` o una GitHub Action (verificato su github.com/DavidAnson/markdownlint, il 9 settembre 2026). Attivane un piccolo insieme e lascia il resto spento — un insieme di documentazione che fa fallire la CI sulla lunghezza delle righe insegna ai contributori ad aggiungere `<!-- markdownlint-disable -->` e a smettere di leggere l'output.

Vale è un linter di prosa consapevole del markup, con licenza MIT, che capisce la struttura del documento invece di fare pattern-matching sul testo grezzo, e legge le sue regole da un `.vale.ini` nel repository. Puoi partire da stili pubblicati — quelli di Microsoft e di Google tra gli altri — o scrivere il tuo in YAML (verificato su vale.sh, il 9 settembre 2026). Le regole che vale la pena avere per prime riguardano la terminologia, non lo stile: un'unica grafia del nome del tuo prodotto, un'unica parola per la cosa che continui a chiamare in tre modi diversi.

lychee è un controllore di link asincrono e veloce scritto in Rust, con doppia licenza Apache 2.0 o MIT, con una `lycheeverse/lychee-action` ufficiale per i workflow (verificato su github.com/lycheeverse/lychee, il 9 settembre 2026). Esegui i link interni a ogni pull request e i link esterni secondo una pianificazione — i controlli esterni falliscono per motivi che non hanno niente a che fare con la tua modifica, e un controllo obbligatorio instabile viene ignorato, poi rimosso.

**Fai fallire la build, ma solo su ciò che un lettore noterebbe.** Un link relativo rotto è un lettore che incontra un 404, quindi dovrebbe bloccare un merge. Un punto finale mancante in un elenco a punti no, quindi non dovrebbe. L'elenco dei controlli bloccanti è una promessa su cosa non raggiungerà mai un lettore, e ogni voce che non rispetta quella soglia rende meno credibile l'intero elenco.

## L'invecchiamento, e perché “ultimo controllo” batte un numero di versione

Un documento non annuncia di essere diventato sbagliato. Sta lì, sicuro di sé. La contromisura non è la disciplina — sono metadati che rendono visibile l'età, e una cadenza che agisce su di essi.

Metti un piccolo blocco di front matter in testa a qualunque cosa invecchi secondo una pianificazione:

```markdown
---
title: Restoring the ledger from backup
owner: payments
last-checked: 2026-09-09
review: quarterly
---
```

Tre campi, ognuno con un compito. `owner` è una squadra, non una persona, perché le persone cambiano squadra e un nome che se n'è andato è peggio di nessun nome. `last-checked` è la data in cui qualcuno ha letto il documento e confermato che funzionava ancora — non la data dell'ultimo commit, che cambia quando correggi un errore di battitura e non dice niente al lettore. `review` è per quanto tempo la frase è considerata attendibile.

**Perché “ultimo controllo” batte un numero di versione.** Un numero di versione dice al lettore quale rilascio il documento descriveva. Non gli dice se qualcuno l'ha guardato da allora, e invecchia nel modo più ingannevole possibile: un documento marcato `v4.2` accanto a un prodotto `v4.9` appare obsoleto anche quando ogni parola è ancora valida, mentre un documento senza nessun marchio appare attuale per sempre. Una data è inequivocabile. “Ultimo controllo 14 mesi fa” è un fatto su cui il lettore può agire senza sapere niente del tuo ritmo di rilascio, ed è lo stesso fatto sia che tu rilasci ogni settimana sia due volte l'anno. Convertitori e generatori di siti statici trattano il front matter in modo diverso — alcuni lo eliminano, alcuni lo renderizzano come un paragrafo di righe `chiave: valore` in testa alla pagina — quindi vale la pena sapere [cosa fa la tua toolchain con l'intestazione](/blog/front-matter-and-what-converters-do-with-it) prima di contare sul fatto che venga mostrata.

**La cadenza deve essere piccola abbastanza da succedere davvero.** Una review trimestrale di quaranta documenti è una giornata che nessuno ha. Una review trimestrale dei sei documenti che fanno chiamare qualcuno di notte è un'ora, e quei sei sono dove l'essere sbagliati costa più caro. Ordina per conseguenza: prima i runbook e le istruzioni di setup, poi il riferimento, infine la spiegazione — la spiegazione invecchia lentamente perché i motivi per cui un sistema è fatto in un certo modo cambiano raramente senza un registro di decisione a segnarlo.

**Abitudini che mantengono l'onestà.**

- [ ] Le modifiche alla documentazione viaggiano nella stessa pull request del comportamento che descrivono.
- [ ] Ogni documento nomina un proprietario; `CODEOWNERS` lo fa senza bisogno di una riunione.
- [ ] Riscrivi il paragrafo sbagliato invece di aggiungere una correzione sotto di esso.
- [ ] Qualunque cosa invecchi secondo una pianificazione porta la data dell'ultimo controllo.
- [ ] I documenti che nessuno manterrà vengono cancellati, non etichettati “potrebbe non essere aggiornato”.

L'ultima causa più discussioni ed è quella che conta di più. Una pagina cancellata manda il lettore a chiedere a una persona; una pagina invecchiata lo manda con sicurezza alla porta sbagliata. La mossa intermedia — un banner che dice “questa pagina potrebbe non essere aggiornata” — è la peggiore delle tre, perché trasferisce il rischio a un lettore senza nessun modo di valutarlo e lascia la squadra sentire che il problema è stato gestito.

**Un altro fallimento che vale la pena nominare.** Le istruzioni di setup marciscono più in fretta di qualunque altra cosa e vengono scoperte per ultime, perché solo i nuovi arrivati le eseguono e un nuovo arrivato presume che la colpa sia sua. Passeranno due ore prima di chiedere. La correzione è a buon mercato e nessuno la fa: chi entra dopo corregge il README come prima pull request, mentre il dolore è ancora fresco e prima di aver imparato gli aggiustamenti che rendono invisibile l'errore.

## Dove i docs as code cadono, e cosa funziona davvero invece

Ecco la parte che l'attivismo lascia fuori. Le persone che hanno più bisogno della documentazione interna sono spesso quelle che non riescono a raggiungerla.

Il responsabile del supporto ha bisogno del percorso di escalation nel momento in cui un cliente sta urlando. Un nuovo designer ha bisogno della guida di onboarding prima che i suoi account esistano. Un venditore ha bisogno della risposta a “fa SSO” nel mezzo di una chiamata. GitHub renderizza bene il Markdown, ma arrivare a quel rendering costa un account, l'accesso al repository e un giro di SSO, e un albero di file chiede a chi non è un ingegnere di usare lo strumento di documentazione interno di qualcun altro. “Apri una pull request contro i docs” è una frase che chiude la conversazione. Viene sentita come *questo non è per te*, e viene sentita correttamente, perché chi la dice ha appena descritto a qualcuno il cui lavoro è rispondere ai ticket un flusso di lavoro con dentro un branch, un fork, una review e una coda di merge.

La ricerca è il secondo vuoto, ed è peggiore di quanto sembri. La ricerca aziendale indicizza la wiki, il drive condiviso e il sistema dei ticket. La ricerca nel codice attraversa davvero i repository di un'organizzazione, ma classifica per codice, e chiede al lettore di indovinare quale repository contenga la risposta — un'indovinata che un ingegnere fa correttamente e nessun altro. Il risultato è un insieme di documentazione completo, corretto e invisibile alla maggior parte dell'azienda.

Il terzo è il carico della review. Una correzione di battitura diventa un branch, una pull request e un'attesa. Gli ingegneri quasi non se ne accorgono; chi scrive due volte l'anno rinuncia, e la sua conoscenza resta nella sua testa. Questa è una perdita reale, non piccola — l'addetto al supporto che ha risposto alla stessa domanda quaranta volte sa qualcosa che nessun ingegnere sa, e il percorso di contribuzione che hai costruito garantisce che non lo scriverà mai.

**Cosa funziona davvero.** Tre cose, in ordine di quanto rendono.

Primo, dividi per ciò che può rendere falso un documento, non per chi lo ha scritto.

| Documento | Dove appartiene | Cosa lo rende sbagliato |
| --- | --- | --- |
| Setup, configurazione, comportamento dell'API, deploy | Il repository | Un commit |
| Runbook | Il repository, pubblicato come pagina | Una rinomina nel codice che chiamano |
| Percorsi di escalation, onboarding, “come chiedo X” | La wiki, o dove già vive il supporto | Un cambiamento di processo, non un commit |
| Politica HR, note di riunione, registri di decisioni | La wiki | Una decisione, non un commit |

Spostare quell'ultimo gruppo in git compra solo attrito. Spostare il primo gruppo fuori da git compra deriva.

Secondo, pubblica le pagine renderizzate, così che la fonte di verità e la superficie di lettura siano cose diverse. Il lettore ottiene un URL; il repository conserva il file. Nessuno fuori dalla squadra impara mai cos'è un branch.

Terzo, fai in modo che il percorso di contribuzione corrisponda al contributore. Un ingegnere manda una pull request. Un addetto al supporto manda un messaggio al canale nominato in `CODEOWNERS`, o apre una issue da un modello, e qualcuno già dentro il repository scrive il paragrafo. La conoscenza è ciò che vuoi, non il commit git — insistere sul secondo è come perdi il primo.

**La pubblicazione, in concreto.** La fonte di verità non deve essere la superficie di lettura. Renderizza il Markdown e dai alle persone una pagina. Può essere piccola come lasciare cadere il file su TransformPipe e inviare l'HTML autonomo, oppure [pubblicare un link di sola lettura](/blog/share-a-markdown-document-as-a-link): “chiunque abbia il link” per un runbook pubblico, “solo questi indirizzi” per qualunque cosa interna. Revocare elimina il token, quindi un link già inviato smette di funzionare. Scala fino a [una GitHub Action che pubblica il Markdown che una pull request ha modificato](/blog/publish-markdown-from-github-actions), o un passaggio `tp push` [nello script di rilascio](/blog/markdown-to-html-from-the-command-line).

Un file autonomo conta più di quanto sembri qui. Una pagina che prende il suo foglio di stile da un CDN smette di sembrare giusta nel momento in cui qualcuno la apre su un aereo, e dice a chi la apre qualcosa su dove è stato il file. Un file solo con gli stili incorporati si apre uguale ovunque, anche da un allegato email su un portatile senza connessione, che è la situazione che un runbook di escalation ha più probabilità di incontrare.

Sappi quando questa non è la forma giusta. Una pagina per documento si adatta a un documento con un destinatario: un runbook, un registro di decisione, note di rilascio, un README destinato a un cliente. Un insieme che ha superato la soglia di navigazione descritta prima vuole un generatore invece, e la pagina è un supplemento a esso piuttosto che un sostituto.

## Come decidere cosa vive dove

1. **Chiediti cosa renderebbe sbagliato il documento.** Se la risposta è un commit, appartiene al repository, perché è il solo posto dove la modifica e la frase si incontrano. Se la risposta è una decisione o una conversazione, git compra attrito e costa il pubblico.
2. **Nomina quale dei quattro tipi è, prima di scriverne una riga.** Un documento che non riesci a classificare è due documenti, e spedirlo come uno garantisce che nessuno dei suoi due lettori lo trovi.
3. **Dai a ogni documento un proprietario e una data.** Un documento senza proprietario è uno a cui nessuno viene chiesto conto, e uno senza data è uno che nessuno può giudicare; entrambi sopravvivono alla review all'infinito perché non c'è niente di concreto a cui obiettare.
4. **Metti la review dove avviene la modifica.** I documenti nella stessa pull request del comportamento costano un commento; i documenti in un ticket di follow-up costano uno sprint e di solito non arrivano mai.
5. **Automatizza solo ciò che un lettore noterebbe.** Un link morto e un nome di prodotto sbagliato valgono il far fallire una build. La lunghezza delle righe no, e una build che fallisce su di essa insegna alle persone a disattivare il controllo che intercetta anche il link morto.
6. **Scegli un generatore in base a cosa si rompe senza di esso.** Se nessuno si perde senza navigazione e ricerca, un convertitore e un link sono meno da mantenere di una build; se i lettori non trovano il secondo documento, il generatore serviva già due mesi fa.
7. **Dai a chi non è ingegnere una superficie di lettura e un percorso di contribuzione che non sia git.** Altrimenti la documentazione è corretta, aggiornata, e letta dalle otto persone che l'hanno scritta.

## Conclusione

La wiki va alla deriva perché non è dove avviene la modifica; il repository tiene perché lo è. Questo è l'intero argomento, e sopravvive al contatto con la realtà solo se chi non può usare git ottiene comunque una pagina che può aprire. Scegli il documento più sbagliato oggi — di solito le istruzioni di setup — correggilo in un branch, fanne la review come si fa con il codice, e poi manda a chi ne aveva bisogno la settimana scorsa un link invece che un percorso di repository. [Convertire il Markdown in un file HTML autonomo](/) richiede più o meno lo stesso tempo di allegarlo, avviene nel tuo browser senza che niente venga caricato, e l'insieme completo delle opzioni è in [la documentazione](/docs).

## FAQ

### Cos'è Diátaxis, e devo adottarlo tutto?

Diátaxis è un framework di documentazione di Daniele Procida che ordina la documentazione in tutorial, guide pratiche, riferimento e spiegazione secondo il bisogno del lettore (verificato su diataxis.fr, il 9 settembre 2026). Non devi adottarne la struttura di cartelle o il vocabolario. La parte utile è il test: nomina quale dei quattro tipi è un documento prima di scriverlo, e dividilo se non riesci.

### La documentazione deve vivere nello stesso repository del codice che descrive?

Per qualunque cosa un commit possa rendere sbagliata, sì — è l'intero meccanismo, e un repository di documentazione separato reintroduce esattamente il vuoto che stavi cercando di chiudere. Per la documentazione che attraversa molti servizi, un repository separato è difendibile, ma aspettati la stessa deriva che aveva la wiki, perché la modifica e la frase sono di nuovo in pull request diverse.

### Qual è la differenza tra un ADR e un documento di progetto?

Un documento di progetto descrive un sistema previsto e diventa sbagliato quando il piano cambia. Un architectural decision record cattura una decisione, il suo contesto e le sue conseguenze in una data, e resta vero per sempre perché è un'affermazione su un momento (verificato su adr.github.io, il 9 settembre 2026). Sostituisci un registro con uno nuovo invece di modificarlo.

### Serve un generatore di siti statici per la documentazione interna?

Non finché i lettori non hanno bisogno di muoversi tra documenti senza conoscerne i nomi dei file. Sotto quella soglia, file Markdown più un convertitore sono meno da mantenere e non rompono mai la build. Sopra di essa, scegli dalla tabella qui sopra in base a cosa la tua squadra usa già — le squadre Python puntano a MkDocs, quelle Node a Docusaurus, e chi vuole un solo binario a Hugo o mdBook.

### Come evito che la documentazione invecchi senza uno scrittore a tempo pieno?

Rendi visibile l'età e rendi piccola la review. Una data `last-checked` nel front matter dice al lettore ciò che un numero di versione non può, e una passata trimestrale solo sui documenti la cui falsità fa chiamare qualcuno di notte è un'ora invece di una giornata. Cancella ciò che nessuno manterrà invece di etichettarlo come dubbio.

### Come leggono la documentazione tenuta in un repository le persone che non sono ingegneri?

Dai loro una pagina renderizzata, non un percorso di repository. Pubblicare il Markdown come file HTML autonomo o come link di sola lettura significa che ottengono un URL che si apre ovunque, senza account, senza accesso al repository e senza niente da installare — e per le contribuzioni, indirizzali attraverso il canale nominato in `CODEOWNERS` invece che attraverso una pull request.

### Quali linter vale la pena metter nella CI per la documentazione?

Tre, e solo su regole che un lettore noterebbe: markdownlint per la struttura, Vale per la terminologia, e un controllore di link come lychee per i percorsi morti (verificato su github.com/DavidAnson/markdownlint, vale.sh e github.com/lycheeverse/lychee, il 9 settembre 2026). Esegui i controlli dei link interni a ogni pull request e quelli esterni secondo una pianificazione, perché un URL esterno che fallisce di martedì non ha niente a che fare con la tua modifica.
