---
title: "Ogni alternativa a Pandoc che vale la pena conoscere, ordinata per il motivo per cui la cerchi"
description: "Pandoc resta ineguagliato per DOCX, EPUB, citazioni e PDF impaginato. Se serve solo HTML, ecco le alternative, ordinate per il motivo della ricerca"
date: 2026-08-14
tag: Conversione
keywords: pandoc markdown in html, pandoc standalone html, alternativa a pandoc, pandoc senza installare, convertire markdown senza pandoc, markdown in docx, markdown in pdf
---

Nessuno cerca un'alternativa a Pandoc perché Pandoc sia scadente. Lo cercano perché volevano un file HTML e si sono ritrovati a leggere di variabili di template, o perché il flag per il PDF ha chiesto una distribuzione TeX, o perché non c'è un terminale sulla macchina dove vive il documento. Lo strumento non è il problema. Lo è la distanza fra lo strumento e il lavoro.

### In breve

Pandoc è la risposta giusta ogni volta che dalla pipeline esce qualcosa di diverso da HTML — DOCX, EPUB, LaTeX, un PDF impaginato, una bibliografia — e niente altro in questa pagina gli si avvicina su quel terreno. Se HTML è l'unico output, l'alternativa giusta dipende dal motivo per cui la stai cercando: **un convertitore nel browser** se vuoi niente da installare e un file solo finito, **marked o markdown-it** se la conversione avviene dentro codice che già usi, **un'API ospitata o una GitHub Action** se avviene in CI e non vuoi un passaggio di installazione pacchetti nel runner, **un generatore di siti statici** se la risposta è un sito invece che un documento. La parte onesta è in fondo: quattro lavori in cui ogni sostituto qui fallisce e conviene installare Pandoc.

## L'attrito, nominato con precisione

Convertire Markdown in HTML con Pandoc è una riga. Non è lì che sta il costo.

Il costo è la seconda riga. Un semplice `pandoc -t html` restituisce un frammento — titoli e paragrafi senza doctype, senza `<head>`, niente che un browser tratti come una pagina. `--standalone` lo corregge avvolgendo il tuo contenuto nel template di default di Pandoc, deliberatamente spoglio, e nel momento in cui vuoi che assomigli a qualcosa sei dentro `--css` per un foglio di stile, `-V` per le variabili di template, oppure `--template` con un file scritto nel linguaggio di template proprio di Pandoc: `$body$`, `$for(author)$`, `$if(toc)$`. Nessun altro strumento legge quel file. Ora fa parte della tua build, e qualcuno deve mantenerlo.

Poi c'è il problema del foglio di stile. `--css` lascia un file HTML che ha bisogno di un secondo file accanto, il che è esattamente sbagliato se il piano era mandare la pagina per email a un collega. Pandoc può incorporare gli asset invece, ma il flag che lo fa è stato rinominato fra le versioni maggiori, quindi controlla `pandoc --help` invece di una risposta di un forum di quattro anni fa.

Niente di tutto questo è difficile. È una quantità di configurazione reale per una pagina sola, e la quantità non si riduce quando il lavoro è piccolo. Questa asimmetria è l'intero motivo per cui esiste questo articolo.

## In cosa Pandoc è ineguagliato

Prima di tutto, sii onesto con lui, perché il resoconto onesto è anche quello utile — ti dice quando smettere di leggere.

Pandoc legge un documento in una rappresentazione interna e riscrive quella rappresentazione in un altro formato. L'indirezione è il trucco: nessuno ha dovuto scrivere un convertitore da Markdown a DOCX, perché ogni reader può alimentare ogni writer. Questa singola decisione di progetto è il motivo per cui l'elenco dei formati arriva a dozzine di voci, e per cui nessuno strumento più piccolo lo ha mai raggiunto.

**Una matrice di formati.** Un file sorgente, diversi output, mantenuti allineati. HTML per il sito, DOCX per il revisore che corregge in Word, EPUB per il lettore in treno. Ogni alternativa qui sotto fa bene un output. Pandoc fa la matrice.

**La scrittura accademica.** Matematica, riferimenti incrociati, figure numerate, e `--citeproc` con un file BibTeX e uno stile CSL, così la bibliografia si formatta da sola in qualunque stile di casa richieda la rivista. Nient'altro in questo articolo ha un processore di citazioni.

**L'output Word in uno stile aziendale.** `--reference-doc` prende font, stili dei titoli e spaziatura da un `.docx` esistente e li applica al tuo. Se un template è arrivato da un team legale o marketing, quel flag è l'intero motivo per installare Pandoc.

**I filtri.** Un filtro Lua o JSON riscrive il documento mentre è ancora un albero — rinumera ogni tabella, togli una sezione, riscrivi ogni link interno, promuovi ogni titolo di un livello. Fare la stessa cosa con un'espressione regolare sull'HTML finito funziona finché non smette di farlo.

```bash
pandoc -f gfm -t docx notes.md -o notes.docx
pandoc -f gfm -t epub book.md -o book.epub
pandoc -f gfm --citeproc --bibliography=refs.bib paper.md -o paper.pdf
```

La terza riga porta un avvertimento che vale la pena conoscere prima di digitarla. Markdown in PDF non è uno dei writer di Pandoc. Pandoc crea un PDF affidando il documento a un motore separato, e il default è un motore TeX, quindi quella pipeline di solito significa installare anche una distribuzione TeX — un'installazione molto più grande di Pandoc stesso, e il motivo più comune per cui qualcuno decide che Pandoc è più di quanto volesse. `--pdf-engine` può puntare invece a un motore basato su HTML o su Typst, molto più piccolo e che gestisce matematica e impaginazione in modo diverso.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| Pandoc | Qualunque output diverso da HTML | Decine di formati, template, filtri Lua, `--citeproc` | Gratis, GPL |
| Pandoc in Docker | Mantenere la matrice senza installarla | L'immagine ufficiale, eseguita contro una directory montata | Gratis, GPL |
| TransformPipe | Un file solo finito, niente da installare, niente caricato | HTML autonomo con stili inline, convertito nel browser | Gratis |
| Dillinger | Scrivere bozze dove non c'è niente installato | Editor nel browser, export HTML e PDF, sincronizza con Drive e Dropbox | Gratis, MIT |
| StackEdit | Scrivere in un browser senza connessione | Editor nel browser, funziona offline una volta caricato, sincronizza e pubblica | Gratis, Apache 2.0 |
| Typora | Un'app desktop invece di un comando | Modifica WYSIWYG, export in HTML, PDF e Word | 14,99 $ una tantum |
| Obsidian | Esportare da note che già tieni | Vault locale; export PDF nell'app, HTML tramite plugin | Gratis; licenza commerciale a pagamento opzionale |
| VS Code | Convertire il file che hai già aperto | Anteprima basata su markdown-it, export tramite estensioni | Gratis |
| marked | Conversione dentro un'app JavaScript | Piccolo, veloce, GFM già pronto | Gratis, MIT |
| markdown-it | Conformità alla specifica e plugin | Conforme a CommonMark, sfugge l'HTML grezzo di default | Gratis, MIT |
| remark / rehype | Cambiare il documento, non solo renderizzarlo | Un AST che puoi percorrere, più un sanitizzatore nella pipeline | Gratis, MIT |
| Python-Markdown | Uno script di build Python | API di estensione matura, il motore sotto MkDocs | Gratis, BSD |
| markdown-it-py | CommonMark in Python | Un porting di markdown-it, stessa forma di plugin | Gratis, MIT |
| mistune | Velocità in Python | Python puro, veloce, basato su plugin | Gratis, BSD |
| cmark-gfm | Un binario minuscolo dentro una build | GFM in C, frammento in uscita, nessun runtime da installare | Gratis, open source |
| API ospitata, CLI, GitHub Action | CI senza un passaggio di pacchetti | Conversione come richiesta o come passo di workflow | Livello gratuito; account richiesto per le chiavi |
| Generatori di siti statici | Un sito invece di un documento | Navigazione, template, feed, molte pagine insieme | Gratis |
| API Markdown di GitHub | Renderizzare GFM esattamente come lo renderizza GitHub | Endpoint HTTP che restituisce un frammento HTML | Gratis, con limite di frequenza |

## Le alternative, per il motivo per cui le cerchi

Ognuna delle sezioni sotto risponde a una frase diversa. Trova la tua e salta il resto. Se vuoi il campo più ampio invece della domanda a forma di Pandoc, [il confronto completo fra convertitori](/blog/best-markdown-to-html-converters) copre gli stessi strumenti con pesi diversi.

### Pandoc stesso — la base con cui ti stai misurando

Merita una sezione propria, perché metà di chi cerca un'alternativa sta in realtà cercando il permesso di continuare a usare questo.

| Pro | Contro |
| --- | --- |
| Converte fra formati che nient'altro tocca | Un binario da installare, e un terminale in cui digitare |
| `--standalone` produce un documento intero, non un frammento | I template sono un linguaggio che solo Pandoc legge |
| I filtri riscrivono il documento come albero | L'output PDF ha bisogno di un motore separato, spesso TeX |
| `--sandbox` limita l'accesso al filesystem per input non fidati | L'HTML grezzo passa dritto: nessuna sanificazione |

**Prezzo:** gratis, licenza GPL.

**Dettagli tecnici e funzionalità**

- Scritto in Haskell, distribuito come binario singolo per le piattaforme principali
- Il proprio dialetto esteso di default, con reader CommonMark e GFM selezionabili da flag
- `--standalone` per un documento completo; un flag separato incorpora immagini e CSS
- `--citeproc`, `--bibliography` e stili CSL per i riferimenti
- Filtri Lua e JSON per riscrivere l'albero sintattico astratto a metà conversione

**Per chi è?** Per chiunque il cui documento debba diventare qualcosa di diverso da una pagina web, ora o entro i prossimi mesi. Il linguaggio di template è un prezzo giusto per la matrice di formati. È un prezzo ingiusto per un README.

### TransformPipe — niente da installare, e un file che si apre ovunque

Un convertitore nel browser è adatto a un documento che non fa affatto parte di una build. Apri una pagina, ci trascini sopra il file `.md`, e scarichi HTML. Vale la pena sapere [quali convertitori online caricano il tuo file e quali no](/blog/best-online-document-converters) prima di sceglierne uno. Da disconnesso, niente viene caricato: il file viene letto, analizzato e renderizzato sulla tua macchina, cosa che puoi confermare guardando la scheda di rete non fare niente mentre lavora.

| Pro | Contro |
| --- | --- |
| Niente da installare, e nessun terminale | Un documento alla volta, o più concatenati in uno — non un sito |
| L'export è un file solo autonomo con gli stili inline | Nessun linguaggio di template, quindi i layout sono quelli offerti |
| Da disconnesso, il file non lascia mai la macchina | Il lavoro lo fa il browser, quindi un file molto grande è limitato dalla macchina |
| Sanifica secondo un'unica lista di elementi ammessi, sia nel browser che sul server | Niente fuori da HTML: nessun DOCX, nessun EPUB, nessun PDF impaginato |

**Prezzo:** gratis. Registrarsi aggiunge cronologia delle conversioni, link di condivisione e chiavi API, e anche questo non costa niente.

**Dettagli tecnici e funzionalità**

- Legge GitHub Flavored Markdown, quindi tabelle, liste di attività, barrato e codice tra fence sopravvivono
- Ciò che si scarica è una pagina intera: un doctype, un `<head>`, il CSS dentro un blocco `<style>`, e nessuna richiesta esterna
- Qualunque HTML grezzo nella fonte viene filtrato secondo una lista fissa di elementi ammessi lungo il percorso
- Salva come `.html`, `.md` o testo semplice; un PDF esce dalla finestra di stampa del browser invece che da un motore TeX
- Converte anche HTML, Word, CSV/TSV e JSON di nuovo in Markdown
- Lo stesso convertitore è raggiungibile in altri quattro modi: un'API REST, una CLI, una GitHub Action e un server MCP

**Per chi è?** Per chiunque il prossimo passo sia "manda questo a una persona", e per chiunque su una macchina dove installare un binario è una decisione di qualcun altro. È il sostituto più vicino a `pandoc --standalone --embed-resources`, senza l'installazione e senza il template.

### Dillinger e StackEdit — quando stai ancora scrivendo il documento

Entrambi sono editor Markdown nel browser con export, ed entrambi sono la risposta giusta a una domanda diversa: non "converti questo file" ma "scrivi questo documento e ottieni HTML alla fine". Dillinger esporta HTML e PDF e sincronizza con Dropbox, Google Drive, OneDrive e GitHub. StackEdit continua a funzionare senza connessione una volta caricato, e pubblica verso diverse destinazioni quando ne ha una.

| Pro | Contro |
| --- | --- |
| Scrivi ed esporta senza lasciare il browser | Editor prima di tutto: nessuno dei due è pensato per convertire file che già hai |
| Sincronizzazione cloud verso i soliti posti | Il documento passa per un servizio ospitato |
| Gratis e open source | Lo stile dell'export è dello strumento, non tuo |
| StackEdit funziona offline una volta caricato | La sintassi estesa di StackEdit può viaggiare male verso altri parser |

**Prezzo:** gratis. Dillinger ha licenza MIT; StackEdit ha licenza Apache 2.0.

**Dettagli tecnici e funzionalità**

- Anteprima dal vivo accanto alla fonte, con le solite comodità da editor
- Export in HTML e PDF dal browser, nessuna installazione locale
- Destinazioni di sincronizzazione e pubblicazione tra cui Drive, Dropbox, OneDrive e GitHub
- I documenti vivono nello storage del browser o nell'account collegato, non sul tuo filesystem di default

**Per chi è?** Per chi compone adesso invece di convertire più tardi. Se il file esiste già su disco e vuoi solo HTML da esso, un convertitore è una strada più corta di un editor.

### Typora — un'applicazione desktop invece di un comando

La risposta senza terminale per chi scrive Markdown ogni giorno. Typora sostituisce la sintassi con il suo rendering mentre digiti, tiene i file sul tuo disco, ed esporta HTML, PDF e Word da un menu.

| Pro | Contro |
| --- | --- |
| Comodo per scrivere per ore | A pagamento, e solo desktop |
| Esporta HTML, PDF e Word con temi | Non è uno strumento batch né un passo di build |
| I file restano sulla tua macchina | Il WYSIWYG nasconde la sintassi, cosa che dispiace a certi autori |

**Prezzo:** 14,99 dollari senza tasse, un acquisto una tantum che copre fino a tre dispositivi, con una prova gratuita di 15 giorni (verificato su typora.io, l'8 settembre 2026).

**Dettagli tecnici e funzionalità**

- Modifica WYSIWYG su file `.md` semplici nel filesystem locale
- Export in HTML, PDF, Word e diversi altri formati dal menu dell'applicazione
- I temi sono CSS, quindi lo stile dell'export è modificabile senza un linguaggio di template
- Gestisce tabelle, note a piè di pagina, matematica e diagrammi come funzioni dell'editor

**Per chi è?** Per chiunque scriva Markdown ogni giorno e voglia un'applicazione invece di un comando. Copre gli output HTML, PDF e Word di Pandoc per un documento alla volta, con un mouse, e non ne copre nessuno in uno script.

### Obsidian — esportare dalle note che già tieni

Non un convertitore, ma spesso il motivo per cui a qualcuno non ne serve uno: il documento è già in un vault di file Markdown locali, e l'export è a un clic di menu. L'export PDF arriva con l'applicazione. L'export HTML arriva da plugin della comunità, il che è una distinzione reale — il prodotto principale non lo promette.

| Pro | Contro |
| --- | --- |
| File locali, nessun caricamento, funziona offline | L'export HTML dipende da un plugin della comunità, non dall'app principale |
| Export PDF integrato | I wiki link e gli embed sono sintassi Obsidian, non GFM |
| Gratis per uso personale e commerciale | Non è una pipeline: gli export avvengono quando una persona clicca |

**Prezzo:** gratis per qualunque uso, incluso quello commerciale; licenze commerciali opzionali vendute su base annuale (verificato su obsidian.md, l'8 settembre 2026).

**Dettagli tecnici e funzionalità**

- I vault sono directory ordinarie di file `.md`, quindi qualunque altro strumento può leggerli anche lui
- `[[wiki link]]`, embed e callout sono estensioni: controlla cosa ne fa il tuo parser di destinazione
- L'ecosistema di plugin copre export, pubblicazione e generazione di siti
- Niente lascia la macchina a meno di attivare un servizio di sincronizzazione o pubblicazione

**Per chi è?** Per chi ha già il proprio Markdown in un vault. L'avvertimento è la sintassi: una nota piena di `[[wiki link]]` convertita da un parser GFM rigoroso produce parentesi quadre doppie letterali nell'output, perché quelle parentesi non sono Markdown.

### VS Code — la strada più corta se il file è già aperto

Il riquadro di anteprima in VS Code è markdown-it sotto il cofano, e l'export arriva tramite estensioni invece che dall'editor stesso. Per un README già aperto in una scheda, questo batte l'installare qualunque cosa.

| Pro | Contro |
| --- | --- |
| Già installato, per la maggior parte degli sviluppatori | L'export richiede un'estensione, e le estensioni variano in qualità |
| Il comportamento dell'anteprima corrisponde alla gestione CommonMark di markdown-it | Lo stile dell'anteprima non è lo stile dell'export |
| Le estensioni coprono HTML, PDF e slide | Converte quello che è aperto: non un batch, non una build |

**Prezzo:** gratis.

**Dettagli tecnici e funzionalità**

- Anteprima integrata renderizzata da markdown-it, con le funzioni GFM attive per l'anteprima
- Le estensioni di export avvolgono il frammento in un documento e incorporano o collegano un foglio di stile — quale dei due dipende dall'estensione
- Le impostazioni del workspace possono aggiungere un foglio di stile di anteprima personalizzato
- Niente viene caricato: la conversione avviene nel processo dell'editor

**Per chi è?** Per gli sviluppatori che hanno bisogno del file attualmente nell'editor e nient'altro oltre a quello. Controlla cosa mette l'estensione intorno al frammento prima di mandare il risultato a qualcuno, perché "sembrava giusto nell'anteprima" non è la stessa affermazione di "si apre giusto sul portatile di qualcun altro".

### marked e markdown-it — la strada JavaScript

Se la conversione appartiene dentro codice che già usi, una libreria è più piccola di un binario e più facile da ragionarci sopra. marked è piccolo e veloce con GFM attivo di default. markdown-it è conforme a CommonMark, ha un sistema di plugin strutturato, e sfugge l'HTML grezzo a meno che tu non gli dica altrimenti — che è il default più sicuro dei due.

| Pro | Contro |
| --- | --- |
| Una dipendenza sola, nessuna installazione separata da documentare | Entrambi restituiscono un frammento: il wrapper è compito tuo |
| L'HTML intorno all'output è HTML che hai scritto tu, non un template ereditato | Nessuna matrice di formati — solo HTML |
| markdown-it sfugge l'HTML grezzo di default | La qualità dei plugin varia nell'ecosistema |
| Gira sia in Node che nel browser | Evidenziazione della sintassi e sanificazione sono decisioni separate |

**Prezzo:** gratis, entrambi con licenza MIT.

**Dettagli tecnici e funzionalità**

- marked: GFM di default, renderer personalizzati per tipo di nodo, un lexer richiamabile per ottenere token invece di HTML
- markdown-it: supera la suite CommonMark, `html: false` di default, regole aggiungibili e riordinabili
- Nessuno dei due sanifica per te; la risposta documentata è un sanitizzatore dedicato sull'output
- Entrambi sono il motore dentro strumenti più grandi, quindi bug report e casi limite sono ben collaudati

**Per chi è?** Per qualunque progetto che abbia già una build Node. [Il confronto JavaScript completo](/blog/markdown-to-html-in-javascript) tratta le differenze per bene, e [convertire da un terminale](/blog/markdown-to-html-from-the-command-line) ha lo script wrapper per intero — una quindicina di righe, che è la misura onesta di quanto valga per te `--standalone` di Pandoc.

### remark e rehype — quando serve cambiare il documento

L'ecosistema unified analizza Markdown in un AST, ti lascia riscriverlo, poi renderizza. È l'unica alternativa qui che compete con i filtri Lua di Pandoc, e compete bene.

| Pro | Contro |
| --- | --- |
| Un vero albero sintattico che puoi percorrere, interrogare e riscrivere | L'opzione più pesante di questa pagina |
| rehype-sanitize è un passo della pipeline, non un ripensamento | La pipeline richiede un apprendimento vero |
| Plugin per GFM, front matter, titoli, link | Eccessivo per trasformare un file in una pagina sola |
| Alimenta MDX e Docusaurus, quindi è ben rodato | Resta solo HTML alla fine |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzionalità**

- Due formati di albero — mdast per Markdown, hast per HTML — e un plugin per convertire l'uno nell'altro
- remark-gfm per tabelle e liste di attività; remark-frontmatter per l'intestazione YAML
- Gli stessi alberi sono usati per costruire linter, formattatori e codemod sulla prosa
- La sanificazione avviene sull'albero, prima che esista l'HTML, il che è più rigoroso del filtrare stringhe

**Per chi è?** Per i team che devono alterare il documento in transito: riscrivere ogni link relativo, estrarre i titoli per la navigazione, imporre uno stile di casa. Se stavi per usare un filtro Lua, questo è il sostituto.

### Python-Markdown, markdown-it-py e mistune — la strada Python

Stessa logica in un linguaggio diverso. Python-Markdown è l'opzione matura con un ampio catalogo di estensioni ed è il motore sotto MkDocs. markdown-it-py è un porting di markdown-it, quindi porta conformità a CommonMark e la stessa forma di plugin. mistune è quello veloce.

| Pro | Contro |
| --- | --- |
| Si inserisce naturalmente se la build è già Python | Output a frammento in tutti e tre i casi |
| L'API di estensione di Python-Markdown è ben documentata e molto usata | Python-Markdown non è conforme a CommonMark in ogni dettaglio |
| markdown-it-py dà conformità alla specifica e un modello di plugin familiare | Tre librerie significano tre insiemi di casi limite |
| mistune è abbastanza rapido per batch grandi | Evidenziazione e sanificazione restano da organizzare da soli |

**Prezzo:** gratis. Python-Markdown ha licenza BSD, markdown-it-py ha licenza MIT, mistune ha licenza BSD.

**Dettagli tecnici e funzionalità**

- Python-Markdown: estensioni ufficiali per tabelle, note a piè di pagina, liste di attributi e indice
- markdown-it-py: un porting del parser JavaScript, usato dove il comportamento CommonMark deve corrispondere
- mistune: Python puro con un sistema di plugin, nessuna dipendenza compilata
- Tutti e tre restituiscono una stringa, quindi il wrapper del documento è un template nel tuo stesso codice

**Per chi è?** Per progetti Python, build di documentazione e qualunque cosa già importi da PyPI. Prova prima un documento con dentro una tabella: le tre librerie non sono d'accordo sulle tabelle, perché in tutte e tre sono un'estensione invece che sintassi di base.

### cmark-gfm — il binario piccolo dentro una build

Il fork di GitHub dell'implementazione di riferimento di CommonMark, scritto in C, con le estensioni GFM aggiunte. È rapido, non ha nessun runtime da installare accanto, e restituisce un frammento senza stile e senza wrapper.

| Pro | Contro |
| --- | --- |
| Minuscolo e veloce, nessun runtime di linguaggio richiesto | Solo frammento: niente che somigli a `--standalone` |
| Implementa le estensioni GFM, tabelle incluse | Le estensioni sono quello che c'è nella scatola e non di più |
| Sensato dentro un Makefile o un'immagine container | Lo compili tu o trovi un pacchetto per la tua piattaforma |

**Prezzo:** gratis, open source — cmark ha licenza BSD, e il fork cmark-gfm di GitHub porta il suo proprio avviso.

**Dettagli tecnici e funzionalità**

- CommonMark più le estensioni GFM: tabelle, liste di attività, barrato, autolink, note a piè di pagina come opzione
- Una libreria C oltre a un binario da riga di comando, quindi si incorpora in altri programmi
- I flag controllano la gestione dell'HTML grezzo, il che conta per input non fidati
- Nessun templating, nessun CSS, nessuna incorporazione di asset — per progetto

**Per chi è?** Per build che forniscono già il proprio layout e hanno bisogno solo del corpo. È la cosa più vicina alla velocità di Pandoc e alla comodità del binario singolo, senza niente della sua ampiezza.

### Un'API ospitata, una CLI o una GitHub Action — CI senza un passaggio di pacchetti

Il caso CI è un problema a parte. Installare Pandoc in un runner è un passo che scarica un binario a ogni job, e TeX in un runner è peggio. Le alternative sono una richiesta a un'API, una CLI senza dipendenze, oppure un passo di workflow che fa la conversione al posto tuo.

| Pro | Contro |
| --- | --- |
| Niente installato nel runner, quindi niente da mettere in cache o fissare | Un'API significa che il documento lascia la macchina |
| Un passo di workflow solo, e la stessa conversione della pagina web | Una chiave nei secret del repository da creare e ruotare |
| L'output è un file completo e autonomo, pronto da pubblicare | Solo HTML: una release che ha bisogno di un PDF ha comunque bisogno di un motore |
| La CLI non ha un albero di dipendenze da controllare | Un servizio ospitato è una dipendenza che non controlli |

**Prezzo:** livello gratuito; serve un account per emettere chiavi API.

**Dettagli tecnici e funzionalità**

- Endpoint REST che prende Markdown e restituisce un documento HTML completo
- Una CLI senza dipendenze, per un runner che ha una shell e nient'altro
- Una GitHub Action per convertire a ogni push, a ogni merge o a ogni tag di release
- Un server MCP, per il caso in cui a fare la conversione sia un modello invece che una persona

**Per chi è?** Per chiunque ricostruisca una pagina a ogni commit. [Pubblicare da un workflow](/blog/publish-markdown-from-github-actions) percorre la versione con pull request, dove l'output è allegato alla PR invece che distribuito. Lo scambio sulla privacy è reale e vale la pena dirlo chiaramente: una conversione nel browser tiene il file in locale, una chiamata API no.

### Pandoc in Docker — saltare l'installazione, mantenere la matrice

*Pandoc senza installare* di solito significa una di due cose. La prima è un front-end web che esegue Pandoc sul server di qualcun altro, il che va bene per un README pubblico ed è sbagliato per una bozza di contratto. La seconda è l'immagine container ufficiale, che tiene pulita la tua macchina e mantiene ogni formato.

```bash
docker run --rm -v "$PWD:/data" pandoc/core -f gfm -t html -s README.md -o README.html
```

| Pro | Contro |
| --- | --- |
| L'intera matrice di formati, niente installato sull'host | Hai installato Docker invece, che è più grande |
| Riproducibile: l'immagine fissa la versione per tutti | I volumi montati e i permessi dei file diventano un tuo problema |
| Esistono immagini varianti per le pipeline LaTeX più pesanti | Più lento per esecuzione di un binario locale |

**Prezzo:** gratis, licenza GPL.

**Per chi è?** Per i team che vogliono un Pandoc fissato su più macchine, e per chiunque su un portatile bloccato che ha Docker ma non un gestore di pacchetti. È il compromesso onesto: salti l'installazione senza consegnare il tuo documento a uno sconosciuto.

### Generatori di siti statici — la risposta quando volevi un sito

Hugo, Eleventy, MkDocs, Docusaurus e Jekyll trasformano tutti Markdown in HTML, e nessuno di essi è un convertitore nel senso di questa pagina. Ognuno è un sistema di build. Vuole una directory, un file di configurazione, un insieme di template e una destinazione di deploy; in cambio restituisce navigazione, ricerca, feed e link incrociati su tutte le pagine insieme.

| Pro | Contro |
| --- | --- |
| Navigazione e template su molti documenti | Macchinario decisamente eccessivo per un file solo |
| Build rapide, documentazione approfondita, distribuiti ovunque | Un file di configurazione e un passo di build da mantenere per sempre |
| Temi, plugin e una storia di deployment | L'output è una directory di pagine, non un file da mandare per email |

**Prezzo:** gratis. Hugo ha licenza Apache 2.0; Eleventy, Docusaurus e Jekyll hanno licenza MIT; MkDocs ha licenza BSD.

**Dettagli tecnici e funzionalità**

- Ognuno porta con sé un motore Markdown: Goldmark in Hugo, markdown-it in Eleventy di default, Python-Markdown in MkDocs
- Il front matter guida titoli, date, tag e ordine di navigazione
- L'output è un albero di directory di HTML con asset condivisi, pensato per essere servito
- Il deployment fa parte del modello: un comando di build e un host

**Per chi è?** Per chiunque il cui output sia un insieme di pagine che si richiamano a vicenda. Un file solo e un destinatario solo è la forma sbagliata per un generatore del tutto — quel lavoro vuole un documento, non un sito web.

### L'API Markdown di GitHub — GFM renderizzato esattamente come lo renderizza GitHub

Un endpoint HTTP che prende Markdown e restituisce HTML. È il solo modo di ottenere il rendering proprio di GitHub senza fare screen-scraping di una pagina, e l'output è un frammento avvolto in niente.

| Pro | Contro |
| --- | --- |
| Comportamento GitHub Flavored Markdown byte per byte | Il documento viene caricato su GitHub per essere renderizzato |
| Nessuna installazione: una richiesta HTTP | Limitato in frequenza, e serve l'autenticazione per alzare il limite |
| Utile per verificare cosa fa davvero GFM | Output a frammento, con i nomi di classe di GitHub su alcuni elementi |

**Prezzo:** gratis, con limite di frequenza.

**Per chi è?** Per chiunque debba far corrispondere con precisione il rendering di GitHub, e per nessuno a cui serva una pagina finita. Trattalo come un'implementazione di riferimento da chiamare, non come una strada di export.

## I lavori che richiedono davvero Pandoc

Questa è la sezione che una pagina di confronto di solito omette, quindi eccola senza le riserve. Quattro lavori non andrebbero tentati con niente di quanto sopra.

**Qualunque cosa con una bibliografia.** Se il documento cita fonti e le citazioni vanno formattate secondo uno stile, `--citeproc` con un file BibTeX e uno stile CSL è lo strumento. Non c'è sostituto in questa pagina. Farlo a mano significa mantenere un elenco di riferimenti che invecchia male la prima volta che un coautore riordina una sezione.

**Un PDF impaginato con un vero layout di pagina.** Righe orfane, figure da posizionare, numeri di pagina, riferimenti incrociati che dicono "vedi pagina 14". La stampa in PDF dal browser dà un documento leggibile e non uno impaginato, perché il browser sta disponendo una pagina web e poi tagliandola in pagine. Se l'output deve sembrare composto, affidarlo tramite Pandoc a un motore TeX o Typst è la strada, e l'installazione extra è il prezzo.

**DOCX nel template di qualcun altro.** Quando arriva un template `.docx` con font, stili dei titoli e spaziatura obbligatori, `--reference-doc` li applica. Nessun convertitore da Markdown a Word che salta questo passaggio produrrà un file che il proprietario del template accetterà, e riformattare a mano in Word è un lavoro che rifarai il prossimo trimestre.

**EPUB, LaTeX, reStructuredText, MediaWiki, Org e il resto della matrice.** Nel momento in cui due di questi compaiono nello stesso requisito, la discussione è chiusa. Concatenare strumenti a scopo singolo per simulare una matrice significa che ogni formato è a un caso limite di distanza dal rompersi, e le rotture arrivano separatamente.

C'è una cosa che Pandoc deliberatamente non fa, e taglia nell'altra direzione: non sanifica. L'HTML grezzo in un file Markdown passa dritto nell'output, tag `<script>` inclusi, perché la conversione fedele è il lavoro per cui si è arruolato. `--sandbox` limita l'accesso al filesystem durante la conversione, che è una protezione diversa. Se il file veniva da fuori — un cliente, un repository, l'invio di un modulo — serve un passaggio di sanificazione tuo, e [perché deve avvenire in più di un punto](/blog/sanitising-markdown-safely) vale dieci minuti prima di aprire il risultato in un browser.

## Come scegliere

1. **Scrivi ogni formato di output che questo documento dovrà produrre nella sua vita.** Se DOCX, EPUB, LaTeX o un PDF impaginato compaiono in quella lista, installa Pandoc e smetti di confrontare; ogni ora spesa su un sostituto è un'ora spesa su uno strumento che sostituirai.
2. **Decidi se la destinazione è una persona o un server.** Una persona ha bisogno di un file solo autonomo che si apra con la rete spenta. Un server ha bisogno di un frammento che i tuoi template avvolgeranno. Scegliere quello sbagliato produce o testo senza stile nella casella di posta di qualcuno o un documento con due copie dell'arredamento di pagina.
3. **Conta quante installazioni il lavoro può sopportare.** Una conversione una tantum non dovrebbe richiedere un gestore di pacchetti; una build notturna non dovrebbe richiedere una scheda del browser e una persona dentro. Entrambi gli errori sono comuni ed entrambi ovvi col senno di poi.
4. **Controlla dove va il file prima di convertirlo.** La conversione lato browser tiene il documento sulla tua macchina e puoi verificarlo dalla scheda di rete. Un'API, un editor ospitato e l'endpoint Markdown di GitHub significano tutti che il documento viaggia, il che è irrilevante per un README pubblico e decisivo per un contratto.
5. **Converti un file rappresentativo e apri il risultato altrove.** Non nell'anteprima dello strumento — un browser diverso, una macchina diversa, senza connessione. Quel singolo test cattura frammenti, fogli di stile mancanti, link a font su CDN e tabelle perse tutti insieme, e ci vuole circa un minuto.

## Conclusione

Il motivo per cui "alternativa a Pandoc" è una ricerca così comune è che Pandoc risponde a una domanda più grande di quella che la maggior parte delle persone sta facendo, e rispondere a una domanda più grande costa sempre di più. Se il documento deve diventare un file Word, un EPUB o un PDF impaginato, installa Pandoc e impara i suoi template — sopravviverà a ogni altro strumento nominato qui. Se HTML è l'unico output, scegli in base al motivo per cui sei arrivato qui: una libreria dove la build vive già, un passo di workflow dove CI gira già, un generatore quando la risposta è un sito, e un convertitore nel browser quando vuoi un file solo finito senza che l'installazione di nessuno si metta in mezzo — che è quello che fa [la conversione da Markdown a HTML di TransformPipe](/), gratis, nel tuo stesso browser, senza niente caricato quando non hai fatto l'accesso.

## Domande frequenti

### Qual è la migliore alternativa a Pandoc per Markdown in HTML?

Non ce n'è una sola, perché Pandoc copre diversi lavori insieme. Per una pagina sola finita senza installazione, un convertitore nel browser che produce HTML autonomo; per la conversione dentro codice, marked o markdown-it; per CI, un'API o una GitHub Action; per un sito intero, un generatore di siti statici. Ognuno sostituisce una parte di quello che fa Pandoc, e nessuno sostituisce la matrice di formati.

### Posso usare Pandoc senza installarlo?

Sì, in due modi con compromessi diversi. L'immagine Docker ufficiale esegue il vero Pandoc senza niente installato sull'host tranne Docker, il che tiene il tuo documento in locale. Un front-end web ospitato esegue anche lui Pandoc, ma sulla macchina di qualcun altro, quindi il file viene caricato — va bene per un README pubblico, sbagliato per qualunque cosa riservata.

### Pandoc è eccessivo per convertire un file Markdown in HTML?

Di solito sì. Una conversione semplice restituisce un frammento, quindi serve `--standalone`, e far sembrare quell'output qualcosa significa un flag per il foglio di stile, variabili di template o un file di template nel linguaggio proprio di Pandoc. Per una pagina sola che qualcuno deve leggere, un convertitore che restituisce un documento completo e autonomo salta tutto questo.

### Perché il mio HTML da Pandoc non ha nessuno stile?

Perché non hai passato `--standalone`, oppure l'hai fatto e hai ottenuto il template di default, deliberatamente spoglio. Aggiungi un foglio di stile con `--css` e ora hai due file che devono viaggiare insieme; incorpora gli asset invece se il file deve aprirsi da solo. Quel divario fra "convertito" e "presentabile" è il motivo più comune per cui la gente inizia a cercare un'alternativa.

### Cosa sostituisce i filtri Lua di Pandoc?

remark e l'ecosistema unified, più di ogni altra cosa. Entrambi analizzano il documento in un albero sintattico che puoi riscrivere prima di renderizzare, che è la stessa forma di soluzione — riscrivi l'albero, non la stringa di output. La differenza è che l'albero di Pandoc copre ogni formato che supporta, mentre quello di remark copre Markdown e HTML.

### Le alternative gestiscono tabelle e liste di attività?

Solo se implementano GitHub Flavored Markdown, perché tabelle e liste di attività non sono nella specifica CommonMark. marked, cmark-gfm e markdown-it configurato per GFM lo fanno; un parser CommonMark rigoroso renderizza la tua tabella come un paragrafo pieno di caratteri pipe e non segnala nessun errore. Converti un file con dentro una tabella prima di impegnarti con qualunque strumento di questa pagina.

### Un convertitore nel browser è sicuro per un documento riservato?

Dipende interamente dal fatto che la conversione avvenga nel browser o su un server, e le due cose sembrano identiche dall'esterno. Un convertitore lato browser legge il file con la File API e non lo invia mai, cosa che puoi verificare aprendo la scheda di rete e guardando che non succeda niente. Qualunque cosa ti mostri una barra di avanzamento mentre un server lavora ha il tuo documento.
