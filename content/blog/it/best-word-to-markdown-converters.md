---
title: "I migliori convertitori da Word a Markdown nel 2026: ogni modo per convertire Word in Markdown"
description: Confronta i modi per convertire Word in Markdown nel 2026 — browser, Pandoc, mammoth, Google Docs e i plugin per Word — e cosa perde un .docx nel viaggio.
date: 2026-09-08
tag: Conversione
keywords: convertire word in markdown, convertitore docx markdown, word in markdown online, miglior convertitore word markdown, convertire docx in markdown da riga di comando, documento word in markdown senza caricare, pandoc docx markdown, mammoth docx markdown
---

Un `.docx` è un archivio zip pieno di XML. Decomprimilo e ottieni `document.xml` per il testo, `styles.xml` per gli stili con nome, `numbering.xml` per gli elenchi, una cartella `media` per le immagini, e una manciata di parti che descrivono le relazioni fra tutto questo. Markdown è un file di testo con dentro degli asterischi. Convertire fra i due non è una traduzione. È una decisione, presa da qualunque strumento tu abbia scelto, su quali parti di quell'archivio contano e quali finiscono per terra.

La decisione di solito è invisibile finché non leggi l'output. Le intestazioni sono arrivate. I paragrafi sono arrivati. Poi l'elenco numerato parte da 1, riparte da 1 a metà, e i sotto-elementi si sono appiattiti al livello principale. La tabella è arrivata come pipe ma la cella d'intestazione unita non ha sopravvissuto al viaggio. La citazione in evidenza nella casella di testo è semplicemente assente, e niente da nessuna parte ti ha detto che se n'era andata.

Ogni strumento di questa pagina perde qualcosa. Quello che li separa è cosa perdono, se lo dicono, e se il file ha lasciato la tua macchina lungo il percorso. Sono tre domande diverse e le pagine dei fornitori non ne rispondono a nessuna.

Questo è un confronto dei modi per portare un documento Word dentro Markdown: convertitori da browser, Pandoc, la libreria mammoth e la sua build per browser, Google Docs e i suoi add-on, un plugin che vive dentro Word stesso, e la strada del copia-incolla, che funziona meglio di quanto dovrebbe avere diritto di fare. Poi la parte onesta — l'elenco delle cose in un `.docx` per cui Markdown non ha sintassi, e cosa fa ogni strumento quando ne incontra una.

### In breve

Per un documento che ti serve adesso, usa un convertitore da browser: nessuna installazione, e con uno strumento lato browser il file non viene mai caricato, il che conta quando il documento è un contratto e non un README. Per un repository pieno di documenti, o per qualunque cosa richieda modifiche tracciate e immagini estratte, installa Pandoc — è l'unico strumento qui con opzioni vere per entrambe le cose. Per la conversione dentro il tuo codice, mammoth è la libreria su cui è costruito quasi tutto il resto, e la sua stessa documentazione ti dice di generare HTML e convertire quello in Markdown invece di usare il suo scrittore Markdown. E accetta le perdite in anticipo: font, margini, salti di pagina, caselle di testo e commenti non hanno equivalente Markdown, quindi nessuno strumento può conservarli e ogni strumento che dichiara di poterlo fare sta descrivendo qualcos'altro.

## Perché convertire un .docx non è un solo lavoro

Leggere un file Word significa fare quattro cose in sequenza. Decomprimi l'archivio. Percorri l'XML, risolvendo lo stile e la numerazione di ogni paragrafo confrontandoli con altre parti dell'archivio. Decidi cosa diventa ogni elemento risolto — un'intestazione, un elemento di elenco, una riga di tabella, o niente. Poi serializzi tutto questo in Markdown, il che significa scegliere una variante, perché il CommonMark puro non ha tabelle né testo barrato.

Uno strumento può essere attento a uno di questi passaggi e trascurato sul successivo. Il secondo passaggio è dove avviene la maggior parte del danno, e succede per un motivo che vale la pena capire: in un `.docx`, il significato è conservato per riferimento. Un'intestazione non è marcata come intestazione. È un paragrafo il cui `w:pStyle` nomina uno stile, e la definizione di quello stile — dentro `styles.xml` — è quella che dice che è Heading 1. Un elemento di elenco è un paragrafo che porta un elemento `w:numPr` con un `w:numId` e un `w:ilvl`, e se quello è un punto elenco o un numero vive in `numbering.xml`, in un livello il cui `w:numFmt` dice `bullet` oppure dice `decimal`.

Quell'indirezione è il motivo per cui due documenti identici sullo schermo convertono in modo diverso. Se qualcuno ha costruito le proprie intestazioni selezionando il testo e rendendolo grassetto a 18pt, non c'è nessun riferimento di stile da risolvere, e ogni convertitore qui ti darà un paragrafo. L'add-on di Google Docs lo dice nel proprio README — un testo che è semplicemente grassetto e grande converte come un paragrafo normale. Non è un bug del convertitore. Non c'è mai stata nessuna intestazione nel file.

Il quarto passaggio decide la variante, e valgono le stesse regole di [Markdown verso HTML nell'altra direzione](/blog/best-markdown-to-html-converters). Tabelle, testo barrato ed elenchi di attività sono GitHub Flavored Markdown, non CommonMark. Le note a piè di pagina non sono in nessuna delle due specifiche. Quindi il supporto alle tabelle di un convertitore è un'affermazione sulla sua variante di output, non su quanto bene ha letto il tuo documento, e le due cose vengono confuse costantemente.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| TransformPipe | Un documento, adesso, senza caricarlo | Legge il `.docx` nel browser; intestazioni, elenchi, link e tabelle come Markdown | Gratis |
| Pandoc | Lotti, pipeline e modifiche tracciate | `--track-changes`, `--extract-media`, ~40 formati | Gratis, GPL |
| mammoth | Conversione dentro il tuo codice | Build per Node e per browser; mappa di stile da Word a elementi | Gratis, BSD-2-Clause |
| MarkItDown | Alimentare molti tipi di file a una pipeline di testo | CLI e libreria Python, molti formati in ingresso, Markdown in uscita | Gratis, MIT |
| Google Docs (nativo) | Un documento già in Drive | File → Scarica → Markdown (.md), e Copia come Markdown | Gratis con un account Google |
| Add-on Docs to Markdown | Convertire parte di un Google Doc | Barra laterale in Docs; converte una selezione, non solo il file | Gratis, Apache 2.0 |
| Writage | Chi non lascerà Word | Apri e salva Markdown dalla barra multifunzione di Word | 29 $ + IVA, personale, una tantum |
| Copia e incolla | Pochi paragrafi, subito | Gli appunti HTML portano la struttura; un editor attento all'incolla la converte | Gratis |
| Salva come pagina web di Word | Tirare fuori HTML da Word senza un convertitore | Word scrive l'HTML, tu converti quello | Incluso con Word |
| LibreOffice, headless | Vecchi file `.doc` e formati inusuali | `soffice --convert-to docx` come primo passaggio | Gratis, MPL 2.0 |
| python-docx | Leggere l'XML da solo | Crea, legge e aggiorna `.docx` da Python | Gratis, MIT |

## I migliori modi per convertire Word in Markdown nel 2026

### TransformPipe — il migliore per un documento che non vuoi caricare

TransformPipe legge il `.docx` nel tuo browser e ti restituisce Markdown. Da disconnesso, il file non viene mai mandato da nessuna parte: viene letto dalla pagina, convertito sulla tua macchina, e il risultato è tuo. Non c'è installazione né account richiesto.

Sotto il cofano fa esattamente quello che raccomanda la documentazione di mammoth — mammoth trasforma l'archivio in HTML, e un passaggio separato di HTML verso Markdown trasforma quello in Markdown. Sono due conversioni invece di una, ed è la disposizione che gli stessi autori della libreria suggeriscono, perché l'HTML ha un elemento per la maggior parte delle cose che un `.docx` contiene e Markdown no.

| Pro | Contro |
| --- | --- |
| Niente viene caricato quando non hai fatto l'accesso | È il browser a fare il lavoro, quindi un documento molto grande è limitato dalla macchina |
| Nessuna installazione, nessun terminale, nessun account | Un documento alla volta, non una directory |
| Intestazioni, elenchi, link, tabelle, grassetto e corsivo arrivano bene | Le modifiche tracciate si risolvono nel testo accettato; cancellazioni e commenti non arrivano |
| Il Markdown è modificabile sul posto prima di scaricarlo | Nessuna opzione per estrarre le immagini in una cartella |

**Prezzo:** gratis. Un account aggiunge cronologia, condivisione e un'API, anche questi gratis.

**Dettagli tecnici e funzioni**

- Accetta `.docx`; il vecchio `.doc` binario è un formato diverso e va convertito prima
- mammoth legge l'archivio, poi l'HTML viene convertito in GitHub Flavored Markdown — tabelle e testo barrato compresi
- L'HTML grezzo che sopravvive al viaggio passa attraverso un sanificatore con un'allow-list fissa prima di essere mai renderizzato
- Si scarica come `.md`, o come file HTML autonomo se il Markdown è stato solo una tappa
- La stessa conversione è disponibile da un'API REST, una CLI, una GitHub Action e un server MCP

**Per chi è?** Per chiunque abbia un documento che preferirebbe non mandare al server di uno straniero — un contratto, la nota di un paziente, un piano non ancora annunciato, un rapporto interno. L'affermazione sulla privacy è del tipo che puoi controllare piuttosto che prendere per fede: apri la scheda di rete e guarda che non succeda niente mentre converte.

### Pandoc — il migliore per lotti, immagini e modifiche tracciate

Pandoc è un convertitore di documenti da riga di comando scritto in Haskell che legge e scrive circa quaranta formati. Il suo lettore `.docx` è il più configurabile disponibile ovunque, ed è l'unico strumento di questa pagina con una risposta documentata per le modifiche tracciate.

| Pro | Contro |
| --- | --- |
| `--track-changes` accetta `accept`, `reject` o `all` | Richiede un'installazione e un terminale |
| `--extract-media` scrive le immagini in una directory | La sua variante Markdown non è GFM a meno che non lo chiedi |
| Scriptabile, quindi cento file sono lo stesso lavoro di uno | Gli stili personalizzati richiedono una mappatura che scrivi tu |
| Legge il `.docx` e lo scrive pure, quindi i viaggi di andata e ritorno sono possibili | Il manuale è lungo e i flag sono molti |

**Prezzo:** gratis, licenza GPL.

**Dettagli tecnici e funzioni**

- `--track-changes=accept` è il default e elabora inserimenti e cancellazioni; `reject` li ignora; `all` include inserimenti, cancellazioni e commenti avvolti in span (verificato su pandoc.org, l'8 settembre 2026)
- `--extract-media=DIR` tira fuori le immagini dall'archivio in una cartella, o in uno zip se ne nomini uno
- La variante di output è esplicita: `-t gfm` per GitHub Flavored Markdown, `-t commonmark`, oppure il dialetto esteso proprio di Pandoc con sintassi per le note
- `--wrap=none` gli impedisce di far ricadere i paragrafi a 72 colonne, che è il primo flag che quasi tutti vogliono e l'ultimo che trovano
- I filtri Lua ti permettono di riscrivere il documento a metà conversione, prima che venga serializzato

**Per chi è?** Per chiunque converta più di un file, chiunque abbia bisogno delle immagini su disco invece che perse, e chiunque tratti con un documento passato per una revisione. `--track-changes=all` è la cosa più simile a una vera risposta per un manoscritto marcato, e nessuno strumento da browser offre un equivalente.

### mammoth — il migliore per la conversione dentro il tuo codice

mammoth è una libreria che convertisce `.docx` in HTML, con build per Node e per il browser. È quello che un numero sorprendente di strumenti "Word verso Markdown" si scopre essere, una volta guardato bene.

La sua idea distintiva è la mappa di stile. Invece di indovinare, mammoth fa corrispondere gli stili con nome di Word a elementi HTML: `p[style-name='Heading 1'] => h1`, e puoi estendere la mappa per qualunque stile aziendale usi la tua organizzazione. È il meccanismo che fa convertire correttamente un documento con uno stile personalizzato "Titolo capitolo", e l'assenza di quel meccanismo è il motivo per cui gli altri strumenti non lo fanno.

| Pro | Contro |
| --- | --- |
| Gira in Node e nel browser — `mammoth.browser.js` è incluso nel pacchetto | Produce HTML; il passaggio verso Markdown è tuo |
| Le mappe di stile gestiscono correttamente gli stili Word personalizzati | Il suo stesso scrittore Markdown è deprecato dai suoi autori |
| Riporta cosa non è riuscito a mappare, in un array `messages` | Nessun layout di pagina, perché l'HTML non ha pagine |
| È incluso una CLI per conversioni occasionali | Solo JavaScript |

**Prezzo:** gratis, licenza BSD-2-Clause.

**Dettagli tecnici e funzioni**

- `mammoth.convertToHtml({arrayBuffer})` nel browser, `{path}` in Node
- `convertToMarkdown` esiste e il README segna il supporto Markdown come deprecato, raccomandando HTML più una libreria separata di HTML verso Markdown al suo posto
- L'array `messages` su ogni risultato elenca gli stili non riconosciuti e gli elementi non gestiti — l'unico resoconto leggibile da macchina di cosa un convertitore ha scartato, fra tutti gli strumenti qui
- Le immagini possono essere incorporate come data URI o passate a una callback così le scrivi dove vuoi
- La forma da riga di comando è `mammoth documento.docx output.html`

**Per chi è?** Per gli sviluppatori che costruiscono la conversione dentro un'applicazione, specialmente nel browser dove non c'è nessun'altra vera opzione. Leggi l'array `messages` e mostralo ai tuoi utenti; è la differenza fra un convertitore e un convertitore di cui ci si può fidare.

### MarkItDown — il migliore per alimentare una pipeline piuttosto che una persona

MarkItDown è uno strumento Python di Microsoft che convertisce molti tipi di file in Markdown — Word, PowerPoint, Excel, PDF, HTML, CSV, JSON, EPUB e altro — con una CLI e un'API di libreria.

È insolitamente onesto sul proprio scopo. Il README dice che esiste per convertire file in Markdown da usare con modelli linguistici e pipeline di analisi del testo, e che sebbene l'output sia spesso presentabile, è pensato per essere consumato da strumenti e potrebbe non essere l'opzione migliore per una conversione ad alta fedeltà destinata a un lettore umano. Credi a quella frase. Ti dice esattamente quando usarlo e quando no.

| Pro | Contro |
| --- | --- |
| Un comando per una dozzina di formati in ingresso | L'output è pensato per macchine, secondo i suoi stessi autori |
| Libreria e CLI, quindi entra in una pipeline Python | Richiede Python e un gestore di pacchetti |
| Attivamente sviluppato e ampiamente usato | Meno controllo sui dettagli del `.docx` rispetto a Pandoc |
| Gestisce anche archivi e immagini | Non lo strumento per un documento che qualcuno leggerà con attenzione |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- `markitdown percorso-al-file.docx > documento.md`, oppure `-o` per nominare l'output
- I formati elencati nel README includono PDF, PowerPoint, Word, Excel, immagini con OCR, audio con trascrizione, HTML, CSV, JSON, XML, ZIP, URL di YouTube ed EPUB
- Disponibile come libreria Python per l'uso dentro uno script piuttosto che da una shell

**Per chi è?** Per chiunque stia assemblando un corpus. Se il Markdown finisce in un indice di recupero o in un prompt, la fedeltà sotto il livello di "le parole sono nell'ordine giusto" non conta e questa è la strada più veloce per arrivarci. Se una persona leggerà l'output, usa qualcos'altro.

### Google Docs — il migliore quando il documento è già in Drive

Google Docs ha un'esportazione Markdown nativa. File → Scarica → Markdown (.md) scrive un file `.md`, e cliccando col tasto destro su una selezione compare Copia come Markdown, con Incolla da Markdown per il viaggio di ritorno (verificato su support.google.com, l'8 settembre 2026).

Il tranello è la strada d'ingresso. Un `.docx` sul tuo portatile deve essere caricato su Drive e aperto in Docs prima che tutto questo si applichi, e l'importazione di Docs stessa è già una conversione con le proprie perdite. Stai facendo girare due conversioni e controllandone solo la seconda.

| Pro | Contro |
| --- | --- |
| Nessuna installazione, e nessuno strumento terzo coinvolto | Il `.docx` deve essere caricato su Google prima |
| Copia come Markdown funziona su una selezione, non solo su un file intero | L'importazione `.docx` di Docs è una conversione a sé |
| Incolla da Markdown rende possibile il viaggio di ritorno | Nessuna opzione: ottieni quello che dà |
| Gratis con un account che probabilmente hai già | I commenti vivono in Docs e non escono nel Markdown |

**Prezzo:** gratis con un account Google.

**Dettagli tecnici e funzioni**

- File → Scarica → Markdown (.md) per il documento intero
- Copia come Markdown con un clic destro, per una parte di esso
- Incolla da Markdown converte il Markdown nella formattazione di Docs in ingresso

**Per chi è?** Per chiunque i cui documenti vivano già in Google Docs. Se il tuo `.docx` è su disco ed è confidenziale, caricarlo per convertirlo è lo scambio sbagliato, e questa è l'unica opzione della pagina che richiede esattamente quello. Lo stesso avvertimento vale per i documenti che arrivano da qualunque editor ospitato — [cosa sopravvive a un'esportazione da Notion, Obsidian o Confluence](/blog/markdown-from-notion-obsidian-and-confluence) è una versione della stessa domanda.

### Docs to Markdown — il migliore per convertire parte di un Google Doc

Docs to Markdown, conosciuto anche col nome del suo repository gd2md-html, è un add-on per Google Docs scritto in Apps Script. Si apre come una barra laterale e converte il documento, o solo la selezione, in Markdown o HTML.

| Pro | Contro |
| --- | --- |
| Converte una selezione, cosa che l'esportazione nativa non può fare | Solo Google Docs |
| Open source, e chiede permessi minimi | Non accetta contributi, secondo il repository |
| Precede l'esportazione nativa e fa ancora cose che quella non fa | Richiede lo stesso passaggio di caricamento su Drive |
| Scrive HTML oltre a Markdown | Le intestazioni devono essere veri stili di intestazione, non testo grassetto e grande |

**Prezzo:** gratis, licenza Apache 2.0.

**Dettagli tecnici e funzioni**

- Installato dal Google Workspace Marketplace; gira come barra laterale in Docs
- Chiede solo accesso al documento corrente e permesso di creare una barra laterale
- Il suo README è esplicito sul fatto che un testo semplicemente grassetto e grande converte come un paragrafo normale

**Per chi è?** Per chi scrive bozze in Docs e pubblica su una piattaforma Markdown, e per chiunque abbia bisogno di una sezione piuttosto che un file intero.

### Writage — il migliore per chi non lascerà Word

Writage è un plugin che si installa in Microsoft Word e aggiunge Markdown alle finestre di dialogo Apri e Salva come di Word stesso, con una scheda Writage nella barra multifunzione. È l'unica opzione qui che funziona nel modo che un utente Word si aspetta: File, Salva come, Markdown.

| Pro | Contro |
| --- | --- |
| Markdown diventa un formato che Word stesso legge e scrive | A pagamento, e per utente |
| Nessuna seconda applicazione, nessun terminale, nessun caricamento | Solo build Windows e macOS — nessun Word sul web |
| Viaggi di andata e ritorno: apri Markdown in Word, salvalo di nuovo | Legato a Word, quindi nessuna conversione batch di una directory |
| Prova completamente funzionale prima di pagare | Un altro add-in in un'applicazione che ne ha spesso già diversi |

**Prezzo:** 29 $ + IVA per una licenza personale, una tantum e perpetua, con aggiornamenti gratuiti per dodici mesi dall'acquisto; le licenze commerciali sono 145 $ + IVA per cinque utenti, anche questa una tantum. È disponibile una prova gratuita di 14 giorni con funzionalità completa (verificato su writage.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Si installa come add-in di Word; il download è offerto come `.msi` per Windows e `.pkg` per macOS
- Aggiunge Markdown alle finestre Apri e Salva come di Word, e una scheda Writage alla barra multifunzione
- La licenza si attiva da quella scheda incollando un codice

**Per chi è?** Per scrittori ed editor la cui intera giornata di lavoro è in Word e che pubblicano su un sistema Markdown. Se l'alternativa è insegnare a una squadra di autori non tecnici a usare un terminale, trenta dollari a testa non sono la parte costosa del progetto.

### Copia e incolla tramite gli appunti HTML — meglio di quanto sembri

Quando copi da Word, gli appunti portano diverse rappresentazioni della stessa selezione, e una di queste è HTML. Incolla quello in un editor che capisce gli appunti HTML e li converte — moltissimi editor Markdown lo fanno, e così i box di commento di GitHub — e le intestazioni, gli elenchi, il grassetto, il corsivo, i link e spesso le tabelle arrivano come Markdown.

| Pro | Contro |
| --- | --- |
| Istantaneo, e non richiede niente installato | Le immagini non arrivano; sono riferimenti a un appunti, non file |
| Conserva la struttura inline sorprendentemente bene | Dipende interamente dalla gestione dell'incolla dell'editor di destinazione |
| Funziona su una selezione, quindi puoi prendere una sezione | I documenti lunghi significano scorrere, selezionare e sperare |
| Nessun file lascia la tua macchina | Nessun resoconto di cosa è stato scartato |

**Prezzo:** gratis.

**Per chi è?** Per chiunque sposti poche centinaia di parole. È la strada più veloce per una sezione di un documento e la peggiore per uno intero, e il modo in cui fallisce è silenzioso: il testo arriva, le immagini no, e nessuno se ne accorge finché la pagina non è pubblicata.

### Salva come pagina web di Word, poi HTML verso Markdown

Word può scrivere HTML da solo. Salva come, e scegli Pagina web, filtrata — l'opzione filtrata è quella che lascia fuori la maggior parte dell'XML proprio di Word. Poi converti quell'HTML in Markdown con qualunque strumento tu preferisca.

Questa è una strada in due passaggi e vale la pena conoscerla perché Word è l'unico programma che capisce perfettamente il proprio documento. Quello che produce è HTML verboso con moltissimo stile inline, che un buon convertitore da HTML a Markdown scarta, lasciando la struttura.

| Pro | Contro |
| --- | --- |
| Word stesso fa la lettura, quindi niente viene interpretato male | Due passaggi, e il file intermedio è grande |
| Le immagini vengono scritte in una cartella accanto all'HTML | L'output non filtrato porta enormi quantità di marcatura Word |
| Nessun software terzo al primo passaggio | Serve Word, e un secondo strumento per il secondo passaggio |

**Prezzo:** incluso con Word.

**Per chi è?** Per chiunque abbia Word aperto, un documento che altri convertitori hanno rovinato, e un passaggio di HTML verso Markdown già disponibile. È anche la strada da provare quando gli stili personalizzati di un documento battono tutto il resto, perché Word li risolve prima di scrivere l'HTML. Se vai per questa strada, sanifica l'HTML prima di fidartene — [l'HTML grezzo da qualunque fonte merita lo stesso trattamento](/blog/sanitising-markdown-safely).

### LibreOffice, headless — il pre-processore per file vecchi e insoliti

LibreOffice non è un convertitore Markdown e merita una riga comunque, perché è la risposta affidabile al file che nessun altro strumento leggerà. Il vecchio formato binario `.doc`, `.rtf`, file WordPerfect, un `.odt` mandato da una macchina Linux: `soffice --headless --convert-to docx vecchiofile.doc` produce un `.docx`, e tutto il resto di questa pagina può poi leggerlo.

| Pro | Contro |
| --- | --- |
| Legge formati che nient'altro in questa lista tocca | Due conversioni, quindi due insiemi di perdite |
| Scriptabile e headless, quindi entra in una pipeline | Un'installazione grande per un passaggio di pre-elaborazione |
| Gratuito e open source | Il suo output `.docx` è la sua interpretazione, non l'originale |

**Prezzo:** gratis, licenza MPL 2.0.

**Per chi è?** Per chiunque abbia un archivio di file più vecchi del formato `.docx` stesso. Converti prima in `.docx`, poi converti quello, e aspettati che il primo passaggio sia dove arrivano le sorprese.

### python-docx — per quando vuoi prendere tu le decisioni

python-docx crea, legge e aggiorna file `.docx` da Python. Non ha uno scrittore Markdown né uno scrittore HTML, e questo è il punto: ti dà paragrafi, run, stili e tabelle come oggetti, e cosa emetti è interamente affar tuo.

| Pro | Contro |
| --- | --- |
| Controllo completo su cosa diventa cosa | Sei tu a scrivere il convertitore |
| Legge e scrive, quindi può anche modificare i documenti | Nessun output Markdown di alcun tipo |
| Ben documentato e consolidato da tempo | Vale la pena solo per una regola che nessun convertitore implementa |

**Prezzo:** gratis, licenza MIT.

**Per chi è?** Per squadre con una regola aziendale che nessun convertitore conosce — uno stile specifico che deve diventare uno shortcode specifico, un formato di tabella da rimodellare, una struttura di documento che mappa su un modello di contenuto. Se il tuo bisogno è ordinario, questo è molto più lavoro di quanto valga.

## Cosa porta un .docx che Markdown non può esprimere

Questa è la sezione che una pagina di un fornitore non scriverà, perché non c'è modo di scriverla che suoni bene. Markdown ha una dozzina di costrutti. Un `.docx` ne ha centinaia. La conversione è lossy per definizione, e l'unica domanda utile è a quali perdite stai accettando di andare incontro. [L'inventario completo, con un verdetto su ogni voce](/blog/what-not-to-keep-from-a-docx), va oltre il riassunto qui sotto.

**Font, dimensioni e colori.** Markdown non ha sintassi per il tipo di carattere, la dimensione in punti o il colore. Non "supporto scarso" — nessuno. Ogni convertitore qui li scarta, e quelli che sembrano non farlo stanno emettendo HTML grezzo con un attributo `style`, che è un documento diverso in un involucro a forma di Markdown. Se il significato del documento dipende dalla sua tipografia, convertirlo in Markdown distrugge il significato e conserva le parole.

**Margini, formato pagina e salti di pagina.** Markdown non ha pagine. Un documento impaginato per A4 con margini speculari e un salto di pagina prima di ogni capitolo diventa un unico flusso continuo. Pandoc può emettere un carattere di avanzamento pagina o un blocco grezzo per un salto di pagina, ed è un marcatore per un passaggio successivo da interpretare, non un salto di pagina. Non c'è niente da rompere.

**Intestazioni di pagina, piè di pagina e numeri di pagina.** Questi vivono nelle proprie parti dell'archivio e si riferiscono a un concetto — la pagina — che non esiste dall'altra parte. Vengono scartati silenziosamente da tutto. Nessuno li rimpiange finché un documento con "Riservato — pagina 3 di 12" nel piè di pagina non viene ripubblicato senza.

**Modifiche tracciate.** Questa è quella che costa denaro. Un documento revisionato contiene sia l'originale che la revisione, marcati come inserimenti e cancellazioni. Un convertitore senza un'opinione su di essi ti darà tipicamente il testo accettato, il che significa che le cancellazioni di qualcuno sono sparite, e con esse il loro ragionamento. `--track-changes` di Pandoc è l'unico controllo documentato in questa pagina: `accept`, `reject`, oppure `all` per tenere tutto avvolto in span. Se un documento è passato per una revisione legale, convertilo con `all` e leggi il risultato prima di buttare via il `.docx`.

**Commenti.** I commenti sono una conversazione attaccata a intervalli di testo, e Markdown non ha un'ancora a cui attaccarli. Il manuale di Pandoc dichiara che `accept` e `reject` ignorano entrambi i commenti e solo `all` li include. mammoth li lascia fuori a meno che tu non aggiunga da solo una mappatura di stile `comment-reference`, cosa che il suo README documenta e che quasi nessuno fa. Tutto il resto li scarta senza dirlo. Il thread di revisione su un documento è spesso la cosa più preziosa che contiene, ed è la prima cosa a sparire.

**Note a piè di pagina e di chiusura.** Queste almeno hanno un posto dove atterrare, ma solo in alcune varianti. Le note non sono in CommonMark e non nella specifica GFM, quindi esistono come estensioni — il dialetto Markdown proprio di Pandoc ha una sintassi per le note, e un convertitore che punta al CommonMark stretto deve metterle inline, aggiungerle come paragrafi ordinari, oppure scartarle. Converti un documento con note e guarda il fondo dell'output prima di impegnarti.

**Caselle di testo, forme e SmartArt.** Una casella di testo non è nel flusso del documento; è un oggetto grafico con del testo dentro. Il testo può stare ovunque nell'XML rispetto a dove appare sulla pagina, e comunemente svanisce del tutto. È la perdita più difficile da credere per la gente, perché la citazione in evidenza era proprio lì sullo schermo. Cerca nell'output una frase che sai stava in una casella di testo. Se manca, non era mai stata nel testo.

**Tabelle oltre una griglia semplice.** Una tabella semplice converte. Una tabella con celle unite, tabelle annidate, una cella che contiene un elenco puntato, o una riga di intestazione che si estende su due colonne non convertono, perché la sintassi delle tabelle Markdown è una griglia di celle singole senza estensione e senza contenuto a blocchi. I convertitori appiattiscono quello che possono e scartano il resto, e il risultato di solito sembra plausibile mentre è sbagliato. [Le tabelle sono la cosa più comune a rompersi in entrambe le direzioni](/blog/markdown-tables-that-survive-conversion), e l'unico controllo affidabile è contare le colonne.

**Numerazione, e perché dipende da un file dentro l'archivio.** Merita un paragrafo a sé perché spiega la lamentela più comune sulla conversione dei `.docx`. Un elenco numerato in Word è un insieme di paragrafi che portano ciascuno un `w:numId` e un livello di indentazione; la numerazione vera e propria — se è decimale o in numeri romani minuscoli o un punto elenco, dove riparte, come si annidano i livelli — è definita in `numbering.xml`. Leggi il codice sorgente di mammoth e vedi la conseguenza direttamente: un livello di elenco viene trattato come ordinato quando il suo `w:numFmt` è qualunque cosa diversa da `bullet`, e quando la parte di numerazione non si trova, la libreria ricade su un default vuoto. Con un default vuoto, la ricerca della numerazione di un paragrafo non restituisce niente, il paragrafo smette di corrispondere alla regola che l'avrebbe fatto diventare un elemento di elenco, e viene emesso come un paragrafo ordinario.

Ecco perché lo stesso strumento converte perfettamente gli elenchi di un documento e riduce quelli di un altro a testo semplice. Non è lo strumento a essere incoerente. Un archivio aveva una parte di numerazione e l'altro no, oppure faceva riferimento a definizioni di numerazione che non conteneva — cosa che succede ai documenti assemblati da script, esportati da altre applicazioni, o riparati da Word dopo un crash. Se gli elenchi di un documento convertito arrivano come paragrafi, decomprimi il `.docx` e cerca `word/numbering.xml` prima di dare la colpa al convertitore. E controlla l'annidamento su quello che sopravvive, perché [l'indentazione degli elenchi e i ritorni a capo sono la propria trappola separata](/blog/markdown-line-breaks-and-lists) una volta scritto il Markdown.

**Campi, riferimenti incrociati e un indice.** Un indice di Word è un campo che Word calcola. Convertito, diventa qualunque testo fosse nella cache del campo l'ultima volta che Word l'ha aggiornato — un'istantanea con numeri di pagina dentro, che puntano a pagine che non esistono più. I riferimenti incrociati fanno la stessa fine. Elimina l'indice convertito e lascia che il tuo renderer Markdown ne costruisca uno nuovo.

## Come scegliere

1. **Decidi dove il file può andare prima di scegliere uno strumento.** Un README si può caricare ovunque. Un contratto firmato, un bilancio non ancora pubblicato o qualunque cosa con il nome di un paziente non possono, e scegliere un convertitore online per uno di questi è una divulgazione, non una conversione. La conversione lato browser è l'unica opzione che tiene il file sulla macchina, e puoi verificarlo guardando la scheda di rete.
2. **Conta i documenti.** Un file non giustifica installare Haskell. Duecento file non giustificano una scheda del browser e una persona che ci clicca dentro. Il costo dell'installazione si paga una volta, quello del clic si paga ogni volta, il che ribalta la risposta da qualche parte fra cinque e cinquanta file.
3. **Stabilisci se il documento è stato revisionato.** Se ha modifiche tracciate o commenti, la maggior parte degli strumenti li risolverà silenziosamente e tu perderai la revisione. `--track-changes=all` di Pandoc è il modo documentato per conservarli, e se non usi Pandoc devi accettare che la revisione è persa.
4. **Controlla le immagini prima di eliminare la fonte.** Markdown riferisce le immagini; non le contiene. Un convertitore che le incorpora come data URI ti dà un unico file enorme, uno che le estrae ti dà una cartella di cui tenere traccia, e uno che non fa nessuna delle due ti dà Markdown che punta al nulla. Scopri quale hai, poi tieni il `.docx`.
5. **Converti un documento rappresentativo e leggilo tutto.** Non la prima schermata. Le tabelle, gli elenchi numerati, le note, le caselle di testo, e una ricerca per una frase che sai stava in una didascalia. Dieci minuti qui vale più di ogni tabella di confronto, questa compresa, perché i tuoi documenti non sono uguali a quelli di nessun altro.
6. **Presumi che vorrai di nuovo l'originale.** La conversione è a una sola direzione per tutto quello nella sezione onesta sopra. Archivia il `.docx` da qualche parte dove puoi trovarlo, perché il giorno in cui qualcuno chiede cosa diceva il paragrafo eliminato è il giorno in cui scopri che la risposta stava solo nel file che hai buttato via.

## Conclusione

Non c'è un modo senza perdite per convertire Word in Markdown, e gli strumenti buoni sono quelli specifici sulle proprie perdite piuttosto che silenziosi. [La guida passo per passo copre i passaggi e la checklist](/blog/convert-docx-to-markdown) per cosa controllare nel risultato. Per un documento singolo, la strada onesta più corta è un convertitore che gira nel tuo browser, che è quello che fa [la conversione da Word a Markdown di TransformPipe](/word-to-markdown) — gratis, senza installazione, e da disconnesso il `.docx` non lascia mai la tua macchina. Per una directory di file, immagini da estrarre o un documento passato per una revisione, installa Pandoc e imparane `--track-changes` ed `--extract-media`; niente altro in questa pagina si avvicina. Per la conversione dentro la tua applicazione, usa mammoth, leggi il suo array `messages`, e segui il suo consiglio di generare prima HTML — [come funzionano le mappe di stile di mammoth, e dove si inseriscono docx4js, docxtemplater e Pandoc](/blog/mammoth-js-and-docx-parsers) è la prossima lettura se questa è la strada che stai prendendo. E qualunque tu scelga, tieni l'originale, perché i font, i salti di pagina, i commenti e la casella di testo che non hai notato non torneranno.

## Domande frequenti

### Come posso convertire Word in Markdown gratis?

Ogni opzione di questa pagina tranne Writage è gratuita. Un convertitore da browser è la strada più veloce per un file e non richiede un'installazione; Pandoc è gratuito con licenza GPL per la riga di comando; mammoth e MarkItDown sono librerie gratuite. Se il documento è già in Google Docs, File → Scarica → Markdown (.md) non costa niente nemmeno lì.

### Posso convertire un .docx in Markdown senza caricarlo?

Sì, e vale la pena insistere per qualunque cosa confidenziale. Un convertitore che gira nel browser legge il file con JavaScript sulla tua stessa macchina e non lo manda mai da nessuna parte, cosa che puoi confermare aprendo la scheda di rete mentre converte. Pandoc e mammoth girano in locale per definizione. Google Docs è l'eccezione: richiede di caricare prima il file su Drive.

### Perché i miei elenchi numerati sono venuti fuori come paragrafi normali?

Quasi certamente perché al `.docx` mancava, o faceva riferimento in modo sbagliato a, `numbering.xml`, la parte dell'archivio che definisce come appare ogni livello di elenco. Senza quello, un convertitore non può dire che quei paragrafi erano elementi di elenco, quindi li emette come paragrafi. Decomprimi il file e cerca `word/numbering.xml` prima di dare per scontato che la colpa sia del convertitore.

### Cosa succede alle modifiche tracciate e ai commenti?

La maggior parte dei convertitori accetta silenziosamente le modifiche e scarta i commenti, quindi ottieni testo pulito e perdi la revisione. Pandoc è l'eccezione: `--track-changes` accetta `accept`, `reject` o `all`, e il suo manuale dichiara che solo `all` include i commenti. Se la cronologia di revisione di un documento conta, convertilo con `all` e tieni comunque l'originale.

### Le tabelle sopravvivono a una conversione da Word a Markdown?

Le griglie semplici sì. Celle unite, tabelle annidate, righe di intestazione che si estendono e celle che contengono elenchi no, perché la sintassi delle tabelle Markdown non ha modo di esprimere nessuna di queste cose. Converti un documento con la tua tabella peggiore dentro e conta le colonne nell'output prima di decidere che lo strumento funziona.

### Le immagini arriveranno?

Non automaticamente, e non come parte del Markdown, perché Markdown si limita sempre a riferire un file immagine. `--extract-media` di Pandoc le scrive in una directory, mammoth può incorporarle come data URI o passarle al tuo codice, e il copia-incolla le perde del tutto. Qualunque cosa tu usi, controlla le immagini prima di eliminare il `.docx`.

### Pandoc o un convertitore da browser è meglio per convertire Word in Markdown?

Rispondono a domande diverse. Pandoc è meglio ogni volta che c'è più di un file, immagini da estrarre, o modifiche tracciate da conservare, e costa un'installazione e un terminale. Un convertitore da browser è meglio per un documento che vuoi convertito adesso senza caricarlo, e non ha opzioni da imparare. La maggior parte delle persone ha bisogno di entrambi, in momenti diversi.
