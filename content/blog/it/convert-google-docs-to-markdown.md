---
title: "Come convertire Google Docs in Markdown: ogni strada e cosa costa"
description: "Google Docs ora esporta Markdown da solo. Cosa conserva Scarica come Markdown, quando la strada .docx è migliore, e cosa Markdown non può contenere"
date: 2026-09-04
tag: Conversione
keywords: google docs in markdown, convertire google docs in markdown, esportare google docs come markdown, google docs export markdown, docs in markdown con immagini, scaricare google doc come md, componente aggiuntivo docs to markdown, google docs markdown commenti
---

Un Google Doc non è un file. È un modello di documento che vive sui server di Google, e ogni modo di portarlo sul tuo disco è un export — un rendering con perdite di quel modello in un'altra forma. Markdown è la forma più piccola nel menu. Ha sei livelli di intestazione, enfasi, elenchi, link, codice e, se la variante è quella giusta, tabelle. Tutto il resto nel tuo documento deve essere scartato, appiattito o simulato.

Il più delle volte è esattamente quello che vuoi. Hai scritto la bozza dove stavano i commenti e i collaboratori, e ora deve vivere in un repository, in un sito statico o in un wiki, come testo che un diff può leggere. L'attrito è che le perdite sono silenziose. Scarichi il `.md`, dai un'occhiata alla prima schermata, vedi le tue intestazioni, e ti accorgi solo tre settimane dopo che la tabella dell'appendice ha perso la sua intestazione unita, che le immagini sono sparite, e che i quattordici commenti non risolti — la ragione per cui qualcuno teneva a questo documento — non sono mai esistiti affatto nell'export.

Ci sono cinque strade d'uscita, e perdono cose diverse. L'export Markdown nativo, il download `.docx` convertito dopo, il download HTML compresso, un componente aggiuntivo che gira dentro Docs, e la clipboard. Questo testo parla di quale usare, e delle specifiche funzioni di Google Docs che nessuna strada può portare, perché Markdown non ha sintassi per esse.

### In breve

Se il documento è testo — intestazioni, paragrafi, elenchi, link, un po' di enfasi — usa l'export nativo: **File → Scarica → Markdown (.md)**, che Google ha aggiunto insieme all'importazione Markdown, Copia come Markdown e Incolla da Markdown (verificato su workspaceupdates.googleblog.com, il 8 settembre 2026). Se ha immagini, tabelle con celle unite, o note a piè di pagina che devi conservare, scaricalo come **`.docx` e convertilo**, oppure come **HTML compresso**, perché entrambi portano una struttura per la quale l'export `.md` non ha dove metterla. Commenti, suggerimenti, interruzioni di pagina, intestazioni, piè di pagina e disegni non vengono persi da un cattivo convertitore — Markdown semplicemente non ha sintassi per nessuno di essi, quindi risolvi i commenti e accetta i suggerimenti prima di esportare qualunque cosa.

## Perché tirare fuori Markdown da un Google Doc è più complicato di quanto sembri

La difficoltà parte da dove vive davvero il contenuto. Il testo di un Google Doc sta in un posto, i suoi commenti stanno in un altro, e le sue modifiche suggerite stanno in un terzo. Non è una metafora: commenti e risposte sono risorse separate nell'API Drive, non parte del corpo del documento, e ogni commento è ancorato a una regione di una revisione particolare oppure non ancorato e collegato al file nel suo insieme (verificato su developers.google.com, il 8 settembre 2026). I suggerimenti sono memorizzati dentro il documento ma come uno strato parallelo, ed è per questo che leggere un documento programmaticamente ti costringe a scegliere una modalità di visualizzazione — la modalità `SUGGESTIONS_INLINE` dell'API è la sola i cui indici puoi usare per una modifica successiva, e `PREVIEW_SUGGESTIONS_ACCEPTED` ti dà il testo come si leggerebbe se ogni suggerimento fosse stato accettato (verificato su developers.google.com, il 8 settembre 2026).

Un export deve scegliere uno strato e buttare via gli altri. Scegli il corpo del testo. Quindi la conversazione di revisione — che è la parte di un Google Doc in cui Word, Markdown e tutto il resto sono peggio — è sparita prima ancora che la conversione inizi. Nessuno strumento in questa pagina può cambiarlo, e qualunque strumento che dichiara di conservare i tuoi commenti li sta mettendo in un file separato, oppure sta descrivendo qualcosa d'altro.

Il secondo problema è che Markdown non è un solo obiettivo. Il CommonMark puro non ha tabelle, non ha barrato e non ha elenchi di attività; GitHub Flavored Markdown aggiunge tutti e tre; le note a piè di pagina non sono in nessuna delle due specifiche ed esistono solo come estensione. Quindi "conserva le tabelle?" è in parte una domanda sull'esportatore e in parte una domanda su quale variante scrive, e le due si confondono in ogni confronto che leggerai. La stessa pagina di aiuto di Google descrive la sintassi che gestisce in Docs come intestazioni a sei livelli, corsivo, grassetto, grassetto-e-corsivo, barrato e link (verificato su support.google.com, il 8 settembre 2026) — un elenco corto, e una descrizione onesta delle ambizioni dell'export nativo.

Il terzo problema sono le immagini. Un file `.md` è un unico file di testo. Non c'è una cartella accanto, nessun archivio attorno, e la sintassi delle immagini di Markdown è un percorso o un URL — contiene un riferimento, mai i byte. Qualunque export Markdown a file singolo deve quindi o puntare a dove l'immagine vive ancora, o inserirla in linea come blob codificato, o lasciare un vuoto. Nessuna delle tre è quello che volevi, ed è per questo che il documento pieno di immagini è il caso in cui l'export nativo smette di essere la risposta giusta. [I percorsi relativi e cosa si rompe quando il file si sposta](/blog/images-and-links-that-still-work) è la versione generale di questo problema, e si applica con tutta la sua forza nel momento in cui un Google Doc diventa un `.md` in un repository.

## Confronto rapido: il bigliettino

| Strada | Ideale per | Cosa conserva | Cosa perde | Prezzo |
| --- | --- | --- | --- | --- |
| File → Scarica → Markdown (.md) | Un documento di testo, subito | Intestazioni, elenchi, link, enfasi, barrato, tabelle semplici | Immagini come file, commenti, suggerimenti, layout di pagina | Gratis con un account Google |
| File → Scarica → Word (.docx), poi convertire | Immagini, tabelle complesse, lotti, qualunque cosa scriptata | Quello che conserva il secondo convertitore; immagini come file veri | Commenti e suggerimenti restano assenti | Gratis; il convertitore può richiedere un'installazione |
| File → Scarica → Pagina web (.html, compresso) | Documenti dove le immagini contano più di tutto | Struttura HTML completa più una cartella di immagini | Niente che Markdown volesse, ma convertisci due volte | Gratis con un account Google |
| Componente aggiuntivo Docs to Markdown | Convertire parte di un documento | Note a piè di pagina, celle di tabella unite, struttura delle intestazioni | Le immagini diventano segnaposto di percorso da riempire tu | Gratis, Apache 2.0 |
| Copia come Markdown (clic destro) | Pochi paragrafi | Formattazione in linea e link | Tutto quello non selezionato; le immagini | Gratis, disattivato di default |
| Copia e incolla in un editor Markdown | Una sezione, in uno strumento che già usi | Quello che il gestore di incolla dell'editor di destinazione capisce | Varia enormemente per editor | Gratis |
| API Docs + Apps Script | Molti documenti, secondo un calendario | Qualunque cosa scrivi codice per conservare | Qualunque cosa non scrivi codice per conservare | Gratis; lo scrivi tu |
| Export dell'API Drive verso `text/markdown` | Automatizzare l'export nativo | Lo stesso di File → Scarica | Lo stesso di File → Scarica | Gratis; si applica una quota API |

## L'export Markdown nativo, e cosa conserva davvero

Google Docs esporta Markdown da solo. Il percorso è File → Scarica → Markdown (.md), e arriva con tre compagni: l'importazione Markdown, così un `.md` aperto con File → Apri diventa un Doc; Copia come Markdown nel menu del clic destro per una selezione; e Incolla da Markdown per il viaggio di ritorno (verificato su support.google.com, il 8 settembre 2026). Importazione ed export sono attivi di default. La coppia copia e incolla è disattivata di default, e si trova sotto Strumenti → Preferenze → Attiva Markdown (verificato su workspaceupdates.googleblog.com, il 8 settembre 2026). Se Copia come Markdown non è nel tuo menu contestuale, questa impostazione è la ragione.

Lo stesso export è disponibile al codice. I file di Google Docs possono essere esportati tramite l'API Drive verso nove tipi MIME — `.docx`, `.odt`, `.rtf`, `.pdf`, `text/plain`, `text/html`, HTML compresso, EPUB e `text/markdown` (verificato su developers.google.com, il 8 settembre 2026). Quest'ultimo è l'export nativo attraverso una porta diversa, il che conta se vuoi lo stesso risultato senza che una persona clicchi un menu.

| Pro | Contro |
| --- | --- |
| Nessuna installazione, nessun componente aggiuntivo, nessuna terza parte in mezzo | Le immagini sono il punto debole: un singolo `.md` non ha cartella dove metterle |
| L'intero documento in un'unica azione | Niente è selezionabile — è il documento o niente |
| Va e viene: importare un `.md` in Docs lo trasforma di nuovo in un Doc | Commenti e suggerimenti sono assenti, senza nessun avviso che ci fossero |
| Scriptabile tramite l'API Drive con il tipo di export `text/markdown` | Nessuna opzione affatto: nessuna scelta di variante, nessuna cartella immagini, nessun front matter |
| Gratis con l'account che hai già | Layout di pagina, intestazioni, piè di pagina e interruzioni di sezione non hanno dove andare |

**Prezzo:** gratis con un account Google.

**Dettagli tecnici e funzioni**

- File → Scarica → Markdown (.md) per l'intero documento; il file è testo UTF-8 semplice
- Clic destro → Copia come Markdown per una selezione, una volta che Strumenti → Preferenze → Attiva Markdown è spuntata
- Clic destro → Incolla da Markdown convertono il Markdown nella clipboard in formattazione Docs
- File → Apri → Carica, oppure Drive → Apri con → Google Documenti, importa un file `.md` come Doc
- L'API Drive esibisce la stessa conversione come tipo MIME di export `text/markdown`

**Per chi è?** Per chiunque il cui documento sia genuinamente testo. Un appunto di riunione, una specifica, una bozza di blog, un README scritto in Docs perché lì stavano i revisori. Se puoi scorrere tutto il documento e vedere solo intestazioni, paragrafi, elenchi, link e qualche tabella occasionale, questa è la strada e tutto quello che segue è lavoro superfluo.

## Scaricare come .docx, poi convertire il .docx

L'altra strada è lasciare che Google produca un `.docx` e affidarlo a un convertitore costruito per il compito. Sembra la via più lunga ed è spesso migliore, per una ragione: un `.docx` è un archivio zip con una cartella `media` dentro, quindi le immagini sopravvivono alla prima tappa del viaggio come file veri. La seconda tappa ha allora dove metterle.

Apre anche la porta a ogni opzione che l'export nativo non ha. Il lettore `.docx` di Pandoc accetta `--extract-media` per scrivere le immagini incorporate in una cartella e riscrivere i link di conseguenza, e `--track-changes` con `accept`, `reject` o `all` per decidere cosa succede ai segni di revisione — la sola risposta documentata alle modifiche tracciate in questa pagina. È gratuito e con licenza GPL, scritto in Haskell, e richiede un'installazione. Un convertitore nel browser fa lo stesso primo passo senza installazione: legge il `.docx` sulla tua stessa macchina e restituisce Markdown, che è quello che fa [la conversione da Word a Markdown di TransformPipe](/word-to-markdown), e quello che fa con cura variabile [il campo più ampio dei convertitori `.docx`](/blog/best-word-to-markdown-converters).

| Pro | Contro |
| --- | --- |
| Le immagini arrivano come file veri dentro l'archivio, quindi un convertitore può estrarle | Due conversioni invece di una, e due occasioni di perdere qualcosa |
| Opzioni reali: estrazione immagini, scelta della variante, gestione tabelle | Il `.docx` è un file intermedio di cui devi tenere traccia |
| Scriptabile e lavorabile a lotti — una cartella di file `.docx` è un ciclo di shell | Chi scrive il `.docx` di Google ha le sue stranezze da ereditare |
| Funziona con gli strumenti che la tua build ha già | Commenti e suggerimenti restano assenti: Google li ha scartati al download |
| Scegli tu il convertitore, quindi scegli tu i suoi compromessi | Più passaggi da spiegare a chi vuole solo il testo |

**Prezzo:** gratis. Pandoc è gratuito e con licenza GPL; un convertitore lato browser non costa niente e non richiede installazione.

**Dettagli tecnici e funzioni**

- File → Scarica → Microsoft Word (.docx) produce un archivio Office Open XML standard
- Le intestazioni sopravvivono come paragrafi che portano un riferimento `w:pStyle`, che è quello che i convertitori cercano
- `pandoc --from docx --to gfm --extract-media=./media report.docx -o report.md` scrive le immagini fuori accanto al testo
- `--track-changes=accept` risolve i segni di revisione nel testo accettato invece di lasciare markup nella prosa
- Un `.docx` si apre anche in Word, LibreOffice e altro, il che lo rende un checkpoint utile

**Per chi è?** Per chiunque abbia immagini, per chiunque converta più di un documento, e per chiunque abbia bisogno che l'output soddisfi un obiettivo specifico — un sito di documentazione con una cartella immagini rigida, un repository con un linter, un wiki che accetta solo CommonMark. Anche per chiunque voglia ispezionare l'intermedio: se il Markdown è sbagliato, puoi aprire il `.docx` e vedere se il problema era l'export di Google o il tuo convertitore.

## Scaricare come HTML compresso quando le immagini contano più di tutto

File → Scarica → Pagina web (.html, compresso) ti dà un archivio contenente il documento come HTML e le sue immagini come file separati in una cartella. Questo è l'export a più alta fedeltà che Google offre del documento visibile, ed è quello da usare quando le immagini sono il punto — una revisione di design, un manuale pieno di screenshot, un report con grafici incollati dentro.

Ti trovi allora con un problema da HTML a Markdown, che è ben risolto. [I convertitori da HTML a Markdown](/blog/best-html-to-markdown-converters) gestiscono tutti gli elementi strutturali; il lavoro sta nel buttare via gli stili in linea di Google, che sono estesi, e nel correggere i percorsi delle immagini così puntino a dove le immagini sono finite.

| Pro | Contro |
| --- | --- |
| Le immagini escono come file in una cartella, con nome ed intere | L'HTML di Google è pesante di stili in linea e nomi di classe generati |
| L'HTML ha un elemento per quasi tutto quello che Docs può esprimere | Due conversioni, e la seconda richiede configurazione |
| Le tabelle arrivano come vero markup `<table>`, celle unite incluse | I nomi dei file immagine sono di Google, non tuoi, e i percorsi vanno riscritti |
| Facile da ispezionare: apri l'HTML in un browser e vedi esattamente cosa hai | Lo zip è un contenitore da spacchettare, un passaggio in più in uno script |

**Prezzo:** gratis con un account Google.

**Dettagli tecnici e funzioni**

- L'archivio contiene un file `.html` e una cartella di immagini
- Disponibile tramite l'API Drive come tipo di export HTML compresso oltre che dal menu
- Gli elementi di intestazione sono veri tag `<h1>`–`<h6>`, quindi la struttura delle intestazioni converte in modo netto
- Le tabelle sono tabelle HTML, il che significa che `colspan` e `rowspan` sopravvivono almeno fino all'HTML — [cosa succede dopo](/blog/markdown-tables-that-survive-conversion) dipende interamente dalla variante Markdown in cui stai scrivendo
- Gli attributi di stile sono in linea su quasi ogni elemento e possono essere scartati senza problemi

**Per chi è?** Documenti pieni di screenshot, e chiunque voglia vedere cosa Google pensa che il documento contenga prima di decidere cosa conservare. L'HTML è prolisso ed è onesto: quello che è nel file è quello che era nel documento.

## Le strade che non passano da File → Scarica

Tre vie d'uscita che non toccano mai il menu di download. Esistono perché a volte vuoi parte di un documento, o lo vuoi subito, o lo vuoi per duecento documenti senza una persona nel mezzo.

### Docs to Markdown, il componente aggiuntivo

Docs to Markdown, conosciuto dal nome del suo repository gd2md-html, è un componente aggiuntivo di Google Docs che si apre come una barra laterale e converte il documento — o solo la selezione — in Markdown o HTML. È gratuito e con licenza Apache 2.0, installato dal Google Workspace Marketplace, e chiede solo due permessi: accesso al documento corrente, e il permesso di creare una barra laterale (verificato su github.com/evbacher/gd2md-html, il 8 settembre 2026).

È più attento alla struttura del documento rispetto all'export nativo, e insolitamente onesto sui propri limiti. Le note a piè di pagina convertono in note a piè di pagina Markdown standard. Le tabelle convertono in tabelle HTML anche nell'output Markdown, ed è così che conserva righe e colonne unite; una tabella a cella singola diventa un blocco di codice. Le immagini diventano percorsi segnaposto nella forma `images/image1.png`, e la documentazione ti dice chiaramente che devi spostare le immagini sul tuo server e cambiare i percorsi — e avvisa che l'ordine delle immagini nello zip non è sempre l'ordine in cui appaiono nel documento, quindi controllale tutte. Le equazioni fanno scattare un avviso rosso che suggerisce MathJax o LaTeX se la tua piattaforma di pubblicazione li supporta. E, come con ogni convertitore da `.docx` e da Docs, le intestazioni convertono solo se sono veri stili di intestazione: un testo semplicemente in grassetto e grande converte come un paragrafo normale.

| Pro | Contro |
| --- | --- |
| Convertisce una selezione, cosa che File → Scarica non può fare | Solo Google Docs, e devi installarlo |
| Note a piè di pagina e celle di tabella unite sopravvivono | Le celle unite sopravvivono come HTML dentro il tuo Markdown, che non ogni renderer accetta |
| Avvisa su cosa non ha potuto convertire invece di fallire in silenzio | Le immagini sono segnaposto: devi ancora fornire tu i file |
| Gratuito e open source, con un ambito di permessi ristretto | Un documento alla volta, in una barra laterale |

**Prezzo:** gratis, con licenza Apache 2.0.

**Per chi è?** Persone che pubblicano regolarmente da Docs, specialmente verso una piattaforma che vuole note a piè di pagina. Anche per chiunque abbia bisogno di una sola sezione di un documento lungo piuttosto che dell'intero — questo da solo è una ragione per installarlo.

### Copia e incolla, tramite la clipboard HTML

Copiare da un Google Doc mette due cose nella clipboard: testo semplice e una variante HTML. La variante HTML porta la struttura — intestazioni come elementi di intestazione, elenchi come elenchi, link come ancore, grassetto come `<b>` o uno stile. Un editor con un gestore di incolla che legge quella variante e la convertisce può trasformare una selezione incollata in Markdown senza che nessun file lasci nessun posto.

Funziona molto meglio di quanto dovrebbe, ed è la strada più veloce che esista per pochi paragrafi. Dove si rompe è prevedibile. Gli editor differiscono enormemente in quello che i loro gestori di incolla capiscono: alcuni convertono intestazioni, elenchi e link e scartano tutto il resto; alcuni incollano la variante di testo semplice e perdono tutta la struttura; alcuni incollano HTML grezzo dentro il tuo file Markdown. Le immagini non arrivano mai come file — nel migliore dei casi ottieni un riferimento a un URL di Google che funziona solo mentre hai fatto l'accesso, e nel peggiore niente. E l'HTML di Google mette stili in linea su quasi tutto, quindi un gestore ingenuo produce Markdown pieno di tag `<span>`.

| Pro | Contro |
| --- | --- |
| Istantaneo, senza download e senza installazione | Il comportamento dipende interamente dall'editor di destinazione |
| Conserva formattazione in linea e link sorprendentemente bene | Le immagini non arrivano mai come file |
| Funziona su una selezione di qualunque dimensione, anche un solo paragrafo | I documenti lunghi sono tediosi e facili da sbagliare |
| Copia come Markdown fa la conversione dentro Docs stesso, se attivata | Gli stili in linea di Google filtrano attraverso i gestori di incolla più deboli |

**Prezzo:** gratis. Copia come Markdown richiede prima Strumenti → Preferenze → Attiva Markdown spuntata.

**Per chi è?** Per chiunque sposti una sezione, non un documento. Se stai incollando più di qualche schermata, stai facendo a mano quello che File → Scarica fa in un'azione.

### Le API Docs e Drive, per molti documenti

Se la risposta deve funzionare senza una persona, ci sono due livelli. Quello a basso sforzo è l'endpoint di export dell'API Drive con il tipo MIME `text/markdown`: ottieni esattamente l'export nativo, per qualunque documento tu possa leggere, in uno script. È sufficiente per la maggior parte dell'automazione, ed eredita ogni limite dell'export nativo.

Quello ad alto sforzo è l'API Docs, che ti dà il documento come JSON strutturato — un corpo di elementi strutturali, paragrafi che portano stili con nome, tabelle come righe di celle, elenchi risolti contro le proprietà degli elenchi. Scrivi tu il Markdown, il che significa che decidi tu cosa diventa un'interruzione di pagina, cosa succede a uno smart chip, se un suggerimento è accettato o respinto, e dove vanno le immagini. È lavoro reale, ed è la sola strada dove le perdite sono scelte tue invece che impostazioni predefinite di qualcun altro.

| Pro | Contro |
| --- | --- |
| Gira secondo un calendario, su qualunque numero di documenti | Stai scrivendo e mantenendo un convertitore |
| L'API Docs esibisce lo stato dei suggerimenti, quindi puoi scegliere accetta o rifiuta | Ambiti OAuth, quote e credenziali da gestire |
| Controlli completamente la strategia per le immagini | Ogni funzione di Docs che ti scordi è un bug silenzioso |
| I commenti sono raggiungibili tramite l'API Drive, in un file separato | Niente di tutto questo è rapido |

**Prezzo:** gratis; si applicano quote API.

**Per chi è?** Team la cui documentazione vive genuinamente in Docs e deve apparire in un repository o un sito continuamente. Se è una migrazione una tantum di trenta documenti, la strada `.docx` e un ciclo di shell battono di gran lunga lo scrivere questo.

## Cosa ha Google Docs e per cui Markdown non ha sintassi

Questa è la parte che nessun export può risolvere, e la parte che vale la pena leggere prima di dare la colpa a un convertitore. Gli elementi sotto non sono fallimenti di conversione. Sono funzioni senza equivalente Markdown, quindi ogni strumento le scarta, le appiattisce in qualcosa d'altro, o emette HTML e spera che il tuo renderer lo permetta.

| Funzione di Google Docs | Equivalente Markdown più vicino | Cosa succede davvero |
| --- | --- | --- |
| Commenti e risposte | Nessuno | Scartati. Sono risorse Drive separate, non contenuto del documento |
| Modifiche suggerite | Nessuno | Appiattite a una sola versione del testo, di solito con i suggerimenti accettati |
| Interruzioni di pagina | Un'interruzione tematica, `---` | Una linea orizzontale su una pagina che non ha pagine, o niente affatto |
| Intestazioni e piè di pagina | Nessuno | Scartati, numeri di pagina inclusi |
| Interruzioni di sezione e colonne | Nessuno | Scartate; il testo multicolonna diventa una colonna nell'ordine di lettura |
| Disegni e grafici inseriti | Un riferimento a un'immagine | Un'immagine nel migliore dei casi, un vuoto nel peggiore; non più modificabile |
| Smart chip (persone, date, file) | Testo semplice o un link | Ridotti alla loro etichetta, o a un link che solo i colleghi possono aprire |
| Equazioni | Nessuno in CommonMark o GFM | Scartate, oppure emesse come LaTeX se la tua piattaforma lo rende |
| Indice | Un elenco di link scritto a mano | Uno scatto statico che smette di corrispondere nel momento in cui modifichi un'intestazione |
| Segnalibri e link interni | Ancore di intestazione | Rotti a meno che le regole di slug del tuo renderer corrispondano alle ancore nell'export |
| Note a piè di pagina | Un'estensione, in nessuna specifica | Dipende interamente dallo strumento e dal renderer all'altra estremità |
| Font, colori, spaziatura, margini | Nessuno | Scartati, che di solito è la ragione per cui volevi Markdown |

Tre di queste meritano di essere dette a voce alta.

**I commenti sono la perdita più grande e la meno visibile.** Un Google Doc che è passato per una vera revisione è metà corpo di testo e metà conversazione a margine, e la conversazione a margine è dove sono state prese le decisioni. Esportalo e conservi la metà che una macchina può confrontare in un diff. Se quei thread contano, risolvili prima, oppure copia quelli che contano nel documento come testo prima di esportare. Non c'è nessuna strada in questa pagina che li conserva, e non c'è nessun avviso quando spariscono.

**I suggerimenti vanno gestiti prima di esportare, non dopo.** Un documento in modalità suggerimenti contiene due letture di sé stesso. Un export ne scegli una — di solito quella accettata — e non potrai dire dal Markdown quali frasi erano una proposta di qualcuno e quali erano state concordate. Accetta o rifiuta tutto, poi esporta. Se non puoi, usa la strada `.docx` con `--track-changes=all` di Pandoc, che almeno mette l'informazione di revisione nell'output dove puoi vederla.

**I link interni si rompono in un modo che non noterai.** Le ancore delle intestazioni in Markdown sono generate da qualunque cosa renda il file, usando le proprie regole di slug, e quelle regole differiscono tra GitHub, un generatore di siti statici e un convertitore lato browser. Un riferimento incrociato che funzionava in Docs diventa un link verso un'ancora che non esiste, e un link interno rotto fallisce in silenzio: la pagina semplicemente non si muove. Controlla ogni link interno dopo una conversione, oppure eliminali e usa i titoli delle sezioni nella prosa invece.

## Come scegliere

1. **Guarda il documento prima di scegliere una strada.** Scorrilo da capo a fondo e conta immagini, tabelle con celle unite, note a piè di pagina, e qualunque cosa disegnata piuttosto che digitata. Zero di tutte e quattro significa che l'export nativo è giusto e tutto il resto è lavoro sprecato; una o più significa la strada `.docx` o HTML compresso, perché l'export nativo non ha dove metterle.
2. **Occupati prima dello strato di revisione.** Risolvi i commenti, accetta o rifiuta i suggerimenti, e togli il documento dalla modalità suggerimenti. Fallo dopo l'export e stai riconciliando due documenti a mano; fallo prima e l'export è semplicemente corretto.
3. **Decidi dove vivranno le immagini prima di convertire.** Un file Markdown contiene riferimenti, non immagini, quindi ti serve una cartella e una convenzione di percorso. `--extract-media` di Pandoc ne scegli una per te; il componente aggiuntivo ti dà segnaposto `images/image1.png` da riempire; l'export nativo non ti dà né l'una né l'altra, motivo per cui il documento pieno di immagini esce come `.docx` o HTML compresso.
4. **Fai corrispondere la variante alla destinazione.** Se la destinazione rende solo CommonMark, le tue tabelle e il barrato non appariranno, per quanto bene siano convertiti. Stabilisci cosa supporta la piattaforma che riceve, poi converti in quello, non in quello che lo strumento scrive di default.
5. **Converti un documento rappresentativo e leggilo tutto.** Non la prima schermata — l'appendice, le tabelle, le note a piè di pagina, i link interni. Dieci minuti sul documento peggiore che hai ti dicono più di qualunque confronto, questo incluso, ed è il solo modo per catturare le cose che sono fallite in silenzio.
6. **Chiediti se il documento dovrebbe restare in Docs.** Se viene revisionato da persone che non apriranno mai una pull request, esportarlo in Markdown una volta al mese è un tapis roulant. Convertisci quello che deve vivere nel repository e lascia il resto dove stanno i revisori.

## Conclusione

Tirare fuori Markdown da Google Docs è ora un problema risolto per il testo e uno irrisolto per tutto il resto. File → Scarica → Markdown (.md) è gratuito, nativo e corretto per un documento fatto di intestazioni, paragrafi, elenchi e link; per immagini, tabelle unite e note a piè di pagina, scarica il `.docx` o l'HTML compresso e convertilo con uno strumento che ha opzioni — Pandoc se vuoi uno script, [una conversione da Word a Markdown](/word-to-markdown) lato browser se lo vuoi fatto adesso senza che il file lasci la tua macchina. E tratta commenti, suggerimenti, interruzioni di pagina, intestazioni, piè di pagina e disegni come cose di cui occuparti in Docs prima di esportare, perché nessun convertitore può portarli e quelli che dichiarano di farlo stanno descrivendo qualcosa d'altro. Lo stesso avvertimento vale per ogni editor ospitato: [cosa conserva un export da Notion, Obsidian o Confluence](/blog/markdown-from-notion-obsidian-and-confluence) è la stessa domanda con risposte diverse.

## Domande frequenti

### Google Docs può esportare Markdown in modo nativo?

Sì. File → Scarica → Markdown (.md) scrive un file `.md`, e File → Apri ne importa uno indietro come Doc; entrambi sono attivi di default (verificato su workspaceupdates.googleblog.com, il 8 settembre 2026). Copia come Markdown e Incolla da Markdown sono disponibili anche nel menu del clic destro, ma sono disattivati finché non spunti Strumenti → Preferenze → Attiva Markdown.

### Perché le mie immagini sono assenti dal Markdown esportato?

Perché un file `.md` è un unico file di testo senza una cartella accanto, e la sintassi delle immagini di Markdown contiene un percorso, non l'immagine. Per ottenere le immagini come file veri, scarica il documento come `.docx` e convertilo con qualcosa che estrae i contenuti multimediali, oppure scaricalo come HTML compresso, che arriva con una cartella di immagini nell'archivio.

### I commenti e i suggerimenti arrivano nella conversione?

No, su nessuna strada. Commenti e risposte sono memorizzati come risorse Drive separate piuttosto che come contenuto del documento, quindi un export del corpo del testo non può includerli; i suggerimenti sono uno strato parallelo che l'export appiattisce a una sola lettura. Risolvi i commenti e accetta o rifiuta i suggerimenti prima di esportare.

### È meglio scaricare come .docx e convertire, oppure usare l'export Markdown?

Usa l'export Markdown per un documento di testo — è un'unica azione e non c'è un secondo strumento da sbagliare. Usa la strada `.docx` quando hai bisogno di immagini estratte in una cartella, controllo sulla variante di output, modifiche tracciate gestite esplicitamente, o la stessa conversione ripetuta su molti file in uno script.

### Come convertire solo parte di un Google Doc?

Due modi. Seleziona il testo e usa Copia come Markdown, dopo aver attivato Markdown in Strumenti → Preferenze, poi incollalo dove deve andare. Oppure installa il componente aggiuntivo Docs to Markdown, che converte una selezione da una barra laterale — e nota il suo stesso avviso: una tabella deve essere selezionata per intero o il componente non vedrà l'elemento tabella che la contiene.

### Perché le mie intestazioni sono uscite come paragrafi normali?

Perché non erano mai state intestazioni. Se qualcuno ha reso una riga grassetto e a 18pt invece di applicare lo stile Titolo 1, non c'è nessuna intestazione nel documento che un convertitore possa trovare, e il componente aggiuntivo Docs to Markdown lo dice esattamente nella propria documentazione. Applica veri stili di intestazione in Docs, poi esporta di nuovo.

### Posso automatizzare la conversione da Google Docs a Markdown per molti documenti?

Sì, a due livelli di sforzo. L'API Drive può esportare qualunque Doc direttamente verso il tipo `text/markdown`, che ti dà l'export nativo in uno script (verificato su developers.google.com, il 8 settembre 2026). Per il controllo su immagini, suggerimenti e funzioni specifiche di Docs, leggi il documento tramite l'API Docs come JSON strutturato e genera tu il Markdown — considerevolmente più lavoro, e la sola strada dove scegli tu le perdite.
