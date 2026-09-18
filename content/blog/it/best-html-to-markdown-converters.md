---
title: "I migliori convertitori da HTML a Markdown nel 2026: confrontati e testati"
description: "Confronto tra i convertitori da HTML a Markdown nel 2026 — strumenti online, librerie, estrattori e clipper — per cosa mantengono, cosa perdono e dove va l'articolo"
date: 2026-09-08
tag: Conversione
keywords: miglior convertitore html markdown, convertire html in markdown online, convertire pagina web in markdown, salvare una pagina web come markdown, convertire html in markdown da riga di comando, convertire html in markdown senza caricare file, alternative a turndown
---

Convertire HTML in Markdown non è una traduzione. È una demolizione con una lista di cose da conservare. HTML può esprimere un layout a tre colonne, una tabella annidata dentro una cella di un'altra tabella, un colore su una sola parola e un componente che esiste solo dopo che JavaScript è stato eseguito. Markdown può esprimere titoli, paragrafi, enfasi, liste, link, immagini, codice e — se il dialetto lo permette — una tabella piatta. Ogni convertitore in questa pagina sta decidendo cosa buttare via, e non sono d'accordo tra loro.

### In breve

Scegli in base a cos'è il tuo HTML. Per un **frammento pulito o una pagina scritta a mano**, quasi qualunque convertitore funziona e le differenze sono cosmetiche. Per una **pagina intera salvata**, la conversione è la metà facile — la metà difficile è trovare l'articolo dentro la navigazione, il banner dei cookie e il footer, che è quello che un estrattore come Readability fa prima che un convertitore entri in gioco. Per **un file che hai sul disco e una sola conversione da fare**, uno strumento lato browser è la strada più corta e non carica niente, e quelli gratuiti sono trattati qui sotto. Per **un build o uno script**, usa la libreria per il tuo linguaggio: Turndown in JavaScript, markdownify o html2text in Python, Pandoc quando l'output deve essere più di Markdown.

## Perché "converte HTML" non ti dice quasi niente

HTML a Markdown ha due fasi e la maggior parte degli strumenti ne ammette solo una. La prima è l'estrazione: decidere quale parte del documento è il documento. La seconda è la traduzione: trasformare gli elementi che hai mantenuto in sintassi Markdown. Una libreria che fa perfettamente la seconda e salta la prima ti darà una splendida resa Markdown di un menu di navigazione, un'iscrizione alla newsletter e una lista di articoli collegati, con l'articolo da qualche parte nel mezzo.

Quella divisione spiega la maggior parte delle delusioni. Qualcuno salva una pagina da un browser, lascia cadere il file `.html` in un convertitore, e ottiene quattrocento righe di liste di link prima del primo paragrafo. Il convertitore ha fatto il suo lavoro. Nessuno aveva fatto l'altro. Gli estrattori esistono per questo — Readability è il più noto, ed è il motore dietro la Reader View di Firefox — e le estensioni del browser che ritagliano pagine in Markdown sono estrattore e convertitore incollati insieme, motivo per cui su una pagina web vera sembrano tanto migliori di una libreria nuda.

Poi c'è la domanda su cosa sopravvive alla traduzione, e qui i convertitori differiscono davvero. Le tabelle sono l'esempio più rumoroso: non sono nella specifica CommonMark, quindi un convertitore deve implementare apposta le tabelle di GitHub Flavored Markdown, e quelli che non lo fanno appiattiranno una `<table>` in una sequenza di paragrafi oppure lasceranno passare l'HTML grezzo intatto. Le liste di attività, il testo barrato, le liste di definizioni, le note, `<figure>` e `<figcaption>`, `<sup>` e `<sub>`, e i blocchi di codice con un linguaggio indicato sono tutti nella stessa categoria: implementati da alcuni, ignorati da altri, e mai menzionati in una pagina di confronto.

Infine, c'è cosa succede a tutto ciò per cui Markdown non ha parole. Un convertitore ha tre opzioni e ognuna è difendibile. Può eliminare il costrutto, perdendo l'informazione in silenzio. Può emettere HTML grezzo in linea, mantenendo l'informazione e rendendo il Markdown meno portabile, dato che il prossimo strumento a valle potrebbe fare l'escape. Oppure può approssimare — una tabella annidata diventa una appiattita, uno `<span>` stilizzato diventa testo semplice. Sapere quale delle tre scelte fa il tuo strumento è più utile di qualunque elenco di funzioni, perché è la differenza tra un file che puoi leggere e un file che devi riparare.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| TransformPipe | Un file o una pagina salvata, convertiti subito | Conversione lato browser, elimina l'arredo della pagina, mantiene tabelle e liste di attività | Gratis |
| Turndown | App JavaScript ed estensioni del browser | Il convertitore JS predefinito; regole che puoi sovrascrivere; plugin GFM per le tabelle | Gratis, MIT |
| Pandoc | HTML che deve diventare diversi formati | Legge HTML, scrive circa 40 formati, mantiene o rifiuta l'HTML grezzo su richiesta | Gratis, GPL |
| html2text | Script Python che vogliono testo semplice leggibile | CLI più libreria, link in stile riferimento, rimozione dei link | Gratis, GPLv3 |
| markdownify | Script Python che vogliono struttura fedele | Basato su BeautifulSoup, opzioni per tag, gestione delle tabelle | Gratis, MIT |
| node-html-markdown | Convertire grandi quantità di HTML | Include un parser HTML, quindi non serve un DOM | Gratis, MIT |
| html-to-md | Una piccola dipendenza in un bundle JS | Piccolo, senza dipendenze, gestisce gli elementi di tabella | Gratis, MIT |
| html-to-markdown (Go) | Una CLI e una libreria Go dallo stesso progetto | Binario installabile, plugin per tabelle con allineamento e celle unite | Gratis, MIT |
| Mozilla Readability | Trovare l'articolo dentro una pagina | Estrazione, non conversione — restituisce HTML pulito | Gratis, Apache 2.0 |
| Postlight Parser | Estrazione con output Markdown incorporato | `contentType` di html, markdown o text | Gratis, Apache 2.0 / MIT |
| MarkDownload | Ritagliare la pagina che stai guardando | Readability poi Turndown, nella barra degli strumenti del browser | Gratis, Apache 2.0 |
| Obsidian Web Clipper | Ritagliare direttamente in un vault | Estrazione e conversione tramite defuddle, template, sanificazione | Gratis, MIT |
| Notion Web Clipper | Salvare pagine in Notion | Salva in blocchi Notion; Markdown solo con un export successivo | Piano gratuito disponibile |
| "Salva pagina come" del browser | Ottenere l'HTML in primo luogo | Non è un convertitore — la fonte della maggior parte degli input scadenti | Gratis |

## I migliori convertitori da HTML a Markdown nel 2026

### TransformPipe — ideale per un file o una pagina salvata che vuoi convertire subito

TransformPipe prende un file `.html`, `.htm` o `.xhtml` e restituisce Markdown nel tuo browser. Non serve installazione né account, e senza aver fatto l'accesso il file non viene mai inviato da nessuna parte: viene letto, convertito e mostrato sulla tua stessa macchina.

| Pro | Contro |
| --- | --- |
| Niente viene caricato quando non hai fatto l'accesso | Un documento alla volta, non un crawler |
| Rimuove l'arredo della pagina prima di convertire, non dopo | Non è un estrattore: taglia per elemento, non leggendo la pagina |
| Tabelle, testo barrato, blocchi di codice e liste di attività sopravvivono | Il lavoro lo fa il browser, quindi un file molto grande è limitato dalla macchina |
| La stessa conversione gira nell'API, nella CLI, nella GitHub Action e nel server MCP | Nessuna configurazione per tag |

**Prezzo:** gratis. Un account aggiunge storico, condivisione e un'API, anche questi gratis.

**Dettagli tecnici e funzioni**

- Costruito su node-html-markdown, che analizza con node-html-parser invece che con un DOM — così la stessa identica conversione gira in una scheda del browser, in un job CI e dietro l'API, invece di un'implementazione per ciascuno
- `<script>`, `<style>`, `<noscript>`, `<template>`, `<svg>`, `<iframe>`, `<head>`, `<nav>` e `<footer>` vengono rimossi prima della traduzione, insieme ai commenti HTML
- Tabelle e testo barrato sono gestiti dal parser; i checkbox dentro elementi di lista vengono tradotti di nuovo in `- [x]` e `- [ ]`, così una lista di attività arriva come una lista di attività
- Le sequenze di righe vuote vengono compresse, cosa di cui una pagina convertita è altrimenti piena
- Converte anche Word, CSV, TSV e JSON in Markdown, e Markdown di nuovo in un file HTML autosufficiente

**Per chi è?** Chiunque abbia un file e un motivo per non darlo a un server — un export salvato, una pagina da un wiki interno, il documento di un cliente. Se poi vuoi fare il viaggio inverso, [il lato Markdown a HTML è un confronto completamente diverso](/blog/best-markdown-to-html-converters), con modi di fallire diversi.

### Turndown — la migliore libreria JavaScript, e quella con cui tutte le altre vengono misurate

Turndown è un convertitore da HTML a Markdown scritto in JavaScript, ed è la scelta predefinita nel mondo JS con largo margine. Funziona nel browser e in Node, e il suo sistema di regole è il motivo per cui compare dentro così tanti altri strumenti: puoi sostituire il gestore per qualunque elemento senza forkare niente.

| Pro | Contro |
| --- | --- |
| Le regole sono sostituibili per elemento, il che rende trattabile l'HTML strano | Le tabelle richiedono il plugin GFM; il nucleo non le fa |
| Gira nel browser e in Node | Lavora tramite un DOM piuttosto che un proprio parser |
| Ampiamente usato, quindi il suo comportamento è ben documentato dai bug report di altri | Nessuna estrazione: converte qualunque cosa tu gli dia, arredo incluso |
| `keep`, `remove` e l'opzione `blankReplacement` ti danno tre modi per gestire ciò che non vuoi | La configurazione è codice, non flag |

**Prezzo:** gratis, licenza MIT (verificato su github.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- `addRule` registra un gestore contro un nome di tag, una lista di nomi di tag o una funzione filtro; `keep` lascia un elemento come HTML grezzo; `remove` cancella l'elemento e il suo contenuto
- Opzioni per lo stile dei titoli (ATX o setext), il marcatore dei punti elenco, il carattere della recinzione di codice, i delimitatori di enfasi e grassetto, e lo stile dei link — inclusi i link in stile riferimento
- `turndown-plugin-gfm` aggiunge tabelle, testo barrato e altri costrutti di GitHub Flavored Markdown
- Perché è un convertitore basato su DOM, il documento che gli passi è il documento che un browser costruirebbe — l'HTML malformato viene riparato dal parser prima che Turndown lo veda

**Per chi è?** Sviluppatori JavaScript, e chiunque scriva un'estensione del browser o un gestore di incolla per un editor. La sua ubiquità è una funzione: quando una pagina converte male, qualcuno di solito ha già scritto la regola.

### Pandoc — ideale quando l'HTML deve diventare più di Markdown

Pandoc è un convertitore di documenti da riga di comando scritto in Haskell che legge e scrive circa quaranta formati. HTML in ingresso e Markdown in uscita è uno dei suoi lavori più piccoli, e il motivo per usarlo di solito è che Markdown non è l'ultima tappa.

| Pro | Contro |
| --- | --- |
| Un solo strumento per HTML a Markdown, e da Markdown a quasi tutto | Richiede un'installazione e un terminale |
| Il suo scrittore Markdown può emettere o rifiutare HTML grezzo, su richiesta | Il suo dialetto Markdown estesо non è GFM a meno che tu non chieda GFM |
| I filtri Lua ti permettono di riscrivere il documento a metà conversione | Nessuna estrazione: una pagina intera converte come una pagina intera |
| Gestisce documenti molto grandi senza un browser in mezzo | Il numero di opzioni è una curva di apprendimento tutta sua |

**Prezzo:** gratis, licenza GPL.

**Dettagli tecnici e funzioni**

- `pandoc -f html -t gfm` seleziona GitHub Flavored Markdown come output, che è quello che vuoi se tabelle e liste di attività contano
- Qualunque cosa Markdown non possa esprimere ricade in HTML grezzo nell'output; disattivare l'estensione `raw_html` sullo scrittore è come rifiutare questo e accettare invece la perdita
- `--wrap=none` gli impedisce di mandare a capo i paragrafi in modo rigido, cosa che altrimenti rende i diff illeggibili in un repository
- I filtri Lua e i template operano sul suo modello di documento interno, quindi puoi eliminare o riscrivere intere classi di elementi prima che il Markdown venga scritto

**Per chi è?** Chiunque convertà secondo una pianificazione, convertà molti file, oppure convertà HTML in qualcosa che non è affatto Markdown. È anche la risposta giusta quando il Markdown deve essere committato in un repository e restare diffabile.

### html2text — il migliore per Python quando lo vuoi leggibile

html2text è uno script e una libreria Python che convertono HTML in testo semplice, leggibile, quasi-ASCII che risulta anche essere Markdown valido. L'enfasi è sulla leggibilità: è stato scritto per rendere le pagine web piacevoli da leggere come testo, e i suoi default lo riflettono.

| Pro | Contro |
| --- | --- |
| Uno strumento da riga di comando e una libreria da un'unica installazione | GPLv3, che alcuni progetti non possono accettare |
| Opzioni per link in stile riferimento, ignorare i link, ignorare le immagini | L'output è calibrato per la lettura, non per il round-trip |
| Duraturo e stabile | La gestione delle tabelle è più debole delle librerie che privilegiano la struttura |
| Interruzione di riga sensata per l'output testuale | Non si adatta a HTML con annidamento pesante |

**Prezzo:** gratis, licenza GPLv3 (verificato su github.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Gira come `html2text [filename [encoding]]` oppure come libreria da Python
- `--ignore-links` e `--ignore-images` eliminano le parti che rendono rumoroso l'output testuale; `--reference-links` sposta gli URL in fondo invece che in linea
- `--escape-all` fa l'escape dei caratteri speciali in modo aggressivo, cosa che conta quando il testo di partenza contiene punteggiatura Markdown
- `--mark-code` marca i blocchi di codice del programma con `[code]` e `[/code]`; `--backquote-code-style` è quello che emette recinzioni a triplo backtick

**Per chi è?** Script Python che producono testo per umani o per un indice di ricerca — corpi di email, digest, testo di notifica. Se ti serve una copia strutturale fedele dell'HTML, la voce successiva è più adatta.

### markdownify — la migliore libreria Python per mantenere la struttura

markdownify converte HTML in Markdown usando BeautifulSoup come parser, con opzioni per tag. Dove html2text ottimizza per testo leggibile, markdownify ottimizza per una mappatura fedele degli elementi che riconosce.

| Pro | Contro |
| --- | --- |
| Licenza MIT, più facile da adottare della GPLv3 | Porta con sé BeautifulSoup, quindi non è senza dipendenze |
| Opzioni per tag, incluso come gestire tabelle senza riga di intestazione | Più lento delle opzioni compilate che possiedono il proprio parser |
| Convertire o eliminare tag specifici per nome | Nessuna fase di estrazione |
| Familiare a chi già usa BeautifulSoup | Meno comodità da riga di comando di html2text |

**Prezzo:** gratis, licenza MIT (verificato su github.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Costruito su BeautifulSoup, e le sue opzioni per il parser vengono passate attraverso, quindi scegli tu il parser HTML sottostante
- Le liste `strip` e `convert` ti permettono di nominare i tag da rimuovere oppure gli unici tag da mantenere
- `table_infer_header` decide cosa succede a una tabella senza riga di intestazione, che è il problema di tabella più comune nell'HTML reale
- Lo stile dei titoli, i caratteri dei punti elenco e la gestione del linguaggio del codice sono tutti configurabili

**Per chi è?** Codice Python che deve preservare la struttura del documento — importare un CMS legacy, convertire un export di documentazione, alimentare Markdown a un modello che si confonderebbe con un muro di testo.

### node-html-markdown — il migliore per convertire molto HTML

node-html-markdown è un convertitore da HTML a Markdown in TypeScript il cui scopo dichiarato è il throughput. Analizza con node-html-parser invece di dipendere da un DOM, il che è sia il motivo per cui è rapido sia il motivo per cui gira in posti dove una libreria basata su DOM non può.

| Pro | Contro |
| --- | --- |
| Nessun DOM richiesto, quindi gira ovunque giri JavaScript | Una comunità più piccola di quella di Turndown |
| Costruito per il volume per progetto | I traduttori personalizzati sono una loro propria API, non quella di Turndown |
| Gestisce tabelle e testo barrato senza plugin | Alcune gestioni degli elementi sono opinionate e vanno sovrascritte |
| Traduttori personalizzati per elemento | Nessuna estrazione |

**Prezzo:** gratis, licenza MIT (verificato su github.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Portare il proprio parser come dipendenza significa lo stesso percorso di codice in un browser, in Node, in un worker e in una funzione serverless — nessuno shim del DOM da installare
- I traduttori sono registrati per nome di elemento e possono sostituire, ignorare, oppure rifiutarsi di scendere in un nodo
- Opzioni per il marcatore dei punti elenco, la recinzione di codice, i delimitatori di enfasi e grassetto, e se mantenere le immagini data-URI
- Il README del progetto dichiara che è stato scritto per convertire volumi molto grandi di HTML; tratta le cifre di throughput pubblicate come l'affermazione del progetto stesso, non come un benchmark indipendente

**Per chi è?** Chiunque convertà HTML in massa oppure in un ambiente senza DOM. È anche il motore sotto il convertitore di questo stesso sito, esattamente per questo motivo: una conversione che si comporta uguale in una scheda del browser e su un server.

### html-to-md — la migliore piccola dipendenza

html-to-md è un piccolo convertitore JavaScript senza dipendenze, usabile in Node e nel browser tramite un bundler. È l'opzione da scegliere quando il convertitore è un dettaglio in un bundle più grande piuttosto che il punto del progetto.

| Pro | Contro |
| --- | --- |
| Piccolo e senza dipendenze | Meno punti di estensione di Turndown |
| Lista documentata di tag supportati, tabelle incluse | Ecosistema più piccolo, quindi meno esempi già scritti |
| Funziona in Node e nel browser | Non pensato per HTML insolito o mal annidato |

**Prezzo:** gratis, licenza MIT (verificato su github.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- I tag supportati sono documentati esplicitamente, e includono `table`, `thead`, `tbody`, `tr`, `th` e `td`
- Nessuna dipendenza, quindi aggiunge un modulo piuttosto che un albero
- `skipTags`, `emptyTags` e `ignoreTags` decidono cosa viene eliminato e se il suo contenuto va con esso; `aliasTags` mappa un tag insolito su un gestore che esiste; `tagListener` ti passa un singolo tag da gestire tu stesso

**Per chi è?** Progetti front-end dove la dimensione del bundle è un vincolo reale e l'HTML da convertire è ragionevolmente ben educato.

### html-to-markdown (Go) — il migliore se vuoi un binario e una libreria

html-to-markdown di JohannesKaufmann è una libreria Go con uno strumento da riga di comando costruito da essa. Quella combinazione è l'attrattiva: la stessa conversione in una pipeline shell e dentro un servizio Go.

| Pro | Contro |
| --- | --- |
| Una vera CLI, installabile come binario senza runtime da gestire | Solo Go, per l'uso come libreria |
| Il plugin per tabelle implementa le tabelle GFM, incluso allineamento e celle unite | L'insieme di plugin è più piccolo di quello delle librerie JS |
| Legge da un file o dall'input standard | Meno documentato di Turndown, quindi meno esempi |
| Rapido, e non serve Node né Python sulla macchina | Nessuna estrazione |

**Prezzo:** gratis, licenza MIT (verificato su github.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- `html2markdown --input file.html --output file.md`, oppure HTML passato via pipe sull'input standard
- Distribuito come formula Homebrew, pacchetto Debian, binari precompilati e con `go install`
- Un plugin per tabelle che implementa le tabelle GitHub Flavored Markdown con allineamento, gestione di `rowspan` e `colspan`
- Si possono aggiungere regole in Go per gli elementi che i default sbagliano

**Per chi è?** Servizi Go, e chiunque voglia HTML a Markdown in uno script shell su una macchina dove installare Node o Python è una scomodità.

### Mozilla Readability e Postlight Parser — i migliori per trovare l'articolo

Questi due non sono convertitori, ed è per questo che vale la pena conoscerli. Readability prende una pagina e restituisce l'articolo: titolo, autore, e il contenuto come HTML pulito con navigazione, barre laterali e materiale di riempimento eliminati. Postlight Parser fa lo stesso lavoro e ti restituirà il risultato direttamente come Markdown.

| Pro | Contro |
| --- | --- |
| Risolvono il problema che i convertitori non toccano | Readability produce HTML, quindi ti serve comunque un convertitore dopo |
| Readability è il motore dietro la Reader View di Firefox, quindi è messo alla prova moltissimo | Entrambi hanno bisogno di un DOM, il che significa JSDOM o un browser in Node |
| Postlight Parser può restituire html, markdown o text | L'estrazione è euristica: a volte prende troppo o troppo poco |
| Entrambi hanno licenze permissive | Nessuno dei due è un convertitore di documenti nel senso generale |

**Prezzo:** gratis. Readability è Apache 2.0; Postlight Parser è a doppia licenza Apache 2.0 e MIT (verificato su github.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Il `parse()` di Readability restituisce un oggetto con il contenuto dell'articolo come stringa HTML, più `textContent` con i tag rimossi
- Readability ha bisogno di un documento DOM, quindi in Node viene accompagnato da JSDOM; in un'estensione del browser il documento vivo è già lì
- Postlight Parser accetta un'opzione `contentType` di `html`, `markdown` o `text`, e estrae anche metadati come autore e data
- Entrambi lavorano su una singola pagina: nessuno dei due esegue crawling, e nessuno conosce il markup particolare del tuo sito a meno che tu non lo estenda

**Per chi è?** Chiunque converta pagine web piuttosto che file HTML. Estrazione prima, conversione dopo, è la pipeline che ogni buon clipper usa, e costruirla da soli richiede un pomeriggio.

### MarkDownload — la migliore estensione del browser per la pagina che hai davanti

MarkDownload è un'estensione del browser che ritaglia la pagina corrente come Markdown. La sua implementazione è la pipeline raccomandata in un solo pacchetto: Readability semplifica la pagina, poi Turndown converte quello che resta.

| Pro | Contro |
| --- | --- |
| Estrazione e conversione in un solo clic | Convertisce solo quello che è nel browser, una pagina alla volta |
| Disponibile per Firefox, Chrome, Edge e Safari | Dipende dal fatto che l'estrattore indovini giusto |
| Front matter e template per il file salvato | I permessi dell'estensione sono ampi per necessità |
| Open source, quindi le regole di conversione sono ispezionabili | Non è una pipeline scriptabile |

**Prezzo:** gratis, licenza Apache 2.0 (verificato su github.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Usa Readability.js per semplificare la pagina e Turndown per convertire l'HTML semplificato
- Opzioni per la gestione delle immagini, template per il front matter, e lo schema del nome file
- Funziona dalla barra degli strumenti oppure da un menu contestuale su una selezione, così puoi ritagliare parte di una pagina
- Perché gira dopo che il browser ha reso la pagina, il contenuto aggiunto da JavaScript viene incluso — cosa che un file `.html` salvato spesso manca

**Per chi è?** Chiunque legga sul web e tenga note in file. Ritagliare la pagina resa è anche l'unico modo pratico per catturare una pagina il cui contenuto non esiste finché gli script non sono girati.

### Obsidian Web Clipper — il migliore se il Markdown va in un vault

Il clipper di Obsidian salva pagine web come note Markdown, con template che decidono il nome del file, le proprietà, e quale parte della pagina viene mantenuta. Usa defuddle per estrazione e conversione invece della coppia Readability-più-Turndown, e sanifica l'HTML lungo la strada.

| Pro | Contro |
| --- | --- |
| Template per sito, quindi una ricetta e un articolo scientifico possono essere ritagliati diversamente | Pensato per Obsidian; meno utile se le tue note vivono altrove |
| Estrazione, conversione e sanificazione in un'estensione | Il comportamento dell'estrazione differisce da quello di Readability, nel bene e nel male |
| Chrome, Firefox, Safari ed Edge, più browser basati su Chromium | I template sono un piccolo linguaggio a sé da imparare |
| Le proprietà vengono catturate come front matter, non perse | Una pagina alla volta |

**Prezzo:** gratis, licenza MIT, con marchi e materiale di marketing esclusi dalla licenza. Obsidian stesso è gratuito da usare senza registrazione; una licenza commerciale costa 50 dollari per utente all'anno (verificato su obsidian.md, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Usa defuddle per l'estrazione del contenuto e la conversione in Markdown, e DOMPurify per sanificare
- I template possono impostare il titolo della nota, la cartella, le proprietà e il contenuto, con regole per sito
- Evidenziazioni e selezioni possono essere ritagliate invece dell'intera pagina
- L'output è un semplice file `.md` in una cartella del vault, che è una directory di file come qualunque altra

**Per chi è?** Utenti di Obsidian, ovviamente — ma anche chiunque voglia un clipper che scriva file semplici in una cartella. Se le tue note stanno altrove e stai cercando di tirarle fuori piuttosto che di metterle dentro, [il lato dell'export di Notion, Obsidian e Confluence è un problema tutto suo](/blog/markdown-from-notion-obsidian-and-confluence).

### Notion Web Clipper — quello che non ti dà Markdown

Il clipper di Notion salva una pagina web in una pagina Notion. Vale la pena elencarlo esattamente perché la gente lo cerca aspettandosi Markdown e ottiene blocchi Notion, che sono una cosa diversa che vive nel database di qualcun altro.

| Pro | Contro |
| --- | --- |
| Si adatta bene se Notion è già dove vivono le tue note | Il risultato sono blocchi Notion, non un file Markdown |
| Ricercabile e condivisibile dentro Notion immediatamente | Ottenere Markdown richiede un secondo passaggio: l'export proprio di Notion |
| Nessun file da gestire | Il Markdown esportato è l'interpretazione di Notion, non della pagina |
| Piano gratuito disponibile | Ora hai due conversioni tra la pagina e il tuo file |

**Prezzo:** Notion ha un piano gratuito a 0 dollari al mese per membro (verificato su notion.com, l'8 settembre 2026); il clipper viene incluso con l'account.

**Per chi è?** Utenti di Notion che catturano materiale di lettura. Se l'obiettivo è un file Markdown, ritaglia con qualcosa che ne produce uno, oppure convertí direttamente l'HTML salvato — passare per Notion significa due conversioni e due occasioni di perdere le tabelle.

### "Salva pagina come" del browser — la fonte della maggior parte degli input scadenti

Salvare una pagina da un browser è come vengono al mondo la maggior parte dei file HTML che devono essere convertiti, e vale la pena capire cosa ottieni. "Pagina web, completa" ti dà il markup più una cartella di risorse. "Pagina web, solo HTML" ti dà il markup com'è stato consegnato, cosa che per un sito moderno può significare un documento quasi vuoto più uno script che avrebbe costruito la pagina. Nessuno dei due è l'articolo.

| Pro | Contro |
| --- | --- |
| Sempre disponibile, nessuna installazione, nessuna estensione | Salva l'intera pagina, arredo incluso |
| Cattura la pagina com'era, timestamp compreso | "Solo HTML" può perdere contenuto aggiunto da JavaScript |
| Funziona per pagine dietro un login in cui sei già entrato | Le cartelle di risorse fanno puntare i link relativi al tuo disco |

**Prezzo:** gratis.

**Per chi è?** Chiunque abbia bisogno dell'HTML sul disco per altri motivi. Come primo passaggio in una conversione funziona, purché sappia che il convertitore convertirà tutto quello che hai salvato — che è l'argomento della prossima sezione.

## Cosa non sopravvive dell'HTML come Markdown

Ogni strumento qui sopra produrrà Markdown dal tuo HTML. Nessuno di essi può produrre Markdown che significhi la stessa cosa, perché Markdown non ha il vocabolario. Ecco cosa se ne va, e cosa costa.

**Layout.** Markdown non ha colonne, non ha float, non ha larghezze e non ha nessun ordine che non sia l'ordine del testo. Un confronto a due colonne impaginato con una griglia diventa una colonna dopo l'altra: tutto da sinistra, poi tutto da destra. Le parole sono tutte lì e la relazione tra di esse è sparita. Se il layout portava il significato — un prima-e-dopo, un affiancamento di due opzioni — il Markdown non è una copia con perdita, è una copia sbagliata, e nessuna opzione di convertitore lo risolve.

**Classi, id e stili in linea.** Questi svaniscono, e dovrebbero: Markdown non ha stile. Ma sono spesso l'unica cosa che marca un riquadro di richiamo, un avviso, una nota deprecata o una citazione in evidenza. HTML che dice `<div class="warning">` diventa un paragrafo ordinario, e chi legge perde il segnale che questo paragrafo è quello che conta. Un convertitore con regole per elemento — Turndown, markdownify, la libreria Go — può essere istruito a trasformare una classe conosciuta in una citazione o in un prefisso in grassetto. È una regola per classe, scritta da te, per sito.

**Tabelle annidate e celle unite.** Le tabelle GFM sono una griglia di celle semplici: niente `rowspan`, niente `colspan`, niente contenuto a blocchi, e di certo nessuna tabella dentro una cella. Il plugin per tabelle della libreria Go gestisce le celle unite espandendole, che è la migliore risposta disponibile e comunque non l'originale. Una tabella annidata in una cella non ha nessuna rappresentazione, e i convertitori variamente la appiattiscono, la eliminano, o lasciano HTML `<table>` grezzo nel mezzo del tuo Markdown. Le tabelle sono la cosa più comune da perdere in entrambe le direzioni, e [come si rompono le tabelle nella conversione](/blog/markdown-tables-that-survive-conversion) vale la pena saperlo prima di convertire un documento che dipende da una.

**Qualunque cosa interattiva.** Form, bottoni, elementi `<details>`, tab, accordion, player incorporati, canvas, SVG. Markdown può contenere un link a una cosa ma non può contenere la cosa. I convertitori differiscono su se eliminarli oppure emettere HTML grezzo, e l'HTML grezzo in Markdown è una decisione con conseguenze: sopravvive se il prossimo renderer permette HTML grezzo, viene fatto l'escape in una minestra di tag visibili se il prossimo renderer non lo permette.

**URL relativi.** Questo è silenzioso e rompe le cose settimane dopo. Una pagina scritta con `src="/img/diagram.png"` converte in Markdown con esattamente quel percorso, e quel percorso adesso si risolve contro qualunque posto finisca il Markdown, che non è il sito originale. Ogni immagine e metà dei link puntano al nulla. Alcuni strumenti riscrivono gli URL relativi in assoluti usando l'indirizzo della pagina; una libreria nuda che convertí un file sul disco non ha nessun indirizzo da cui partire. Controlla i primi tre link in qualunque pagina convertita, perché [link e immagini che continuano a funzionare dopo la conversione](/blog/images-and-links-that-still-work) non capitano per caso.

**Il codice, a volte.** Un blocco `<pre><code>` di solito converte in modo pulito. Un blocco di codice la cui evidenziazione è fatta di elementi `<span>` per singolo token — cosa che ogni evidenziatore di sintassi produce — converte in un blocco con recinzione se il convertitore è sensato, e in un pasticcio di caratteri estranei se non lo è. Il linguaggio normalmente è in un nome di classe come `language-python`, e un convertitore che lo legge ti dà una recinzione annotata, mentre uno che non lo fa ti dà una recinzione nuda e perde l'evidenziazione dall'altra parte. [Cosa sopravvive davvero in un blocco di codice](/blog/code-blocks-in-markdown) è la parte verificabile: convertine uno e guardalo.

**E la differenza tra una pagina e un articolo.** Questo è il costo reale, e non è un problema di sintassi. Convertire un articolo pulito — una pagina di documentazione, un capitolo esportato, un frammento scritto a mano — è un problema risolto, e ogni strumento qui lo fa bene. Convertire una pagina intera è un lavoro diverso. Una pagina di notizie salvata contiene una testata, una barra di navigazione, un banner di cookie, un invito all'iscrizione, una lista di articoli collegati, una sezione commenti, un footer con sessanta link e un avviso legale. Passala per un convertitore nudo e ottieni tutto ciò come Markdown, nell'ordine di lettura, con l'articolo da qualche parte nel mezzo. La conversione è corretta e l'output è inutile.

I costi di sbagliare questo sono specifici. Se stai convertendo per un umano che legge, non leggerà, e darà la colpa allo strumento piuttosto che al passaggio di estrazione mancante. Se stai convertendo per un indice di ricerca o un modello, hai appena indicizzato lo stesso menu di navigazione una volta per pagina, il che soffoca il contenuto che intendevi conservare. E se stai convertendo molte pagine, scoprirai il problema alla scala: mille documenti, ognuno che comincia con le stesse quaranta righe. La correzione è sempre la stessa e sempre a monte — o un estrattore prima del convertitore, oppure uno strumento che rimuove l'arredo strutturale, oppure un selettore che nomina l'elemento che vuoi davvero. Deciderlo dopo significa convertire tutto due volte.

## Come scegliere

1. **Chiediti se il tuo input è una pagina o un frammento.** Un frammento ha bisogno di un convertitore. Una pagina intera ha bisogno prima di un'estrazione, oppure il convertitore tradurrà fedelmente il banner dei cookie e passerai un'ora a modificare a mano.
2. **Convertí un file rappresentativo prima di impegnarti.** Non quello più semplice — quello con la tabella, il blocco di codice e il riquadro di richiamo. Qualunque strumento mantenga quei tre mantiene quasi tutto il resto, e lo saprai in un minuto invece che dopo duecento documenti.
3. **Decidi cosa succede a quello che Markdown non può esprimere.** Eliminato, mantenuto come HTML grezzo, oppure approssimato: scegli di proposito. Se il Markdown va da qualche parte che fa l'escape dell'HTML grezzo, mantenerlo equivale a corromperlo.
4. **Conta le installazioni contro il numero di conversioni.** Un file non giustifica un gestore di pacchetti, un runtime e un albero di dipendenze. Un job notturno non giustifica una scheda del browser e una persona che ci clicca.
5. **Controlla dove finisce il file.** Un convertitore online che carica ha il tuo documento, il che è irrilevante per una pagina pubblica ed è tutta la questione per una pagina interna. La conversione lato browser è verificabile: apri la scheda di rete e guarda che non succede niente.
6. **Guarda i link e le immagini nell'output, non solo il testo.** Gli URL relativi che convertono in URL relativi sono il fallimento che sembra un successo, e si mostra solo quando qualcun altro apre il file da qualche altra parte.

## Conclusione

Il miglior convertitore da HTML a Markdown è quello che fa bene l'estrazione — [la guida percorre ogni punto di partenza](/blog/convert-html-to-markdown) — perché la traduzione è quasi una commodity e l'estrazione è dove nasce ogni risultato deludente. Per una pagina che stai guardando, ritagliala con un'estensione che esegue prima un estrattore. Per un file che hai già, [la conversione da HTML a Markdown di TransformPipe](/html-to-markdown) elimina l'arredo della pagina, mantiene tabelle, blocchi di codice e liste di attività, e lo fa nel tuo browser senza caricare niente e senza installare niente. Per un build o uno script, prendi la libreria per il tuo linguaggio — Turndown, markdownify, node-html-markdown, la CLI Go, [confrontate fianco a fianco su regole, tabelle, blocchi di codice e spaziatura](/blog/turndown-and-html-to-markdown-libraries) — e accetta che layout, stile e tabelle annidate non ti seguiranno. Quella perdita non è un bug nello strumento. È la definizione di Markdown, e il motivo per cui il file è leggibile dall'altra parte.

## Domande frequenti

### Qual è il miglior convertitore gratuito da HTML a Markdown?

Per un singolo file, un convertitore lato browser è la migliore opzione gratuita: nessuna installazione, nessun caricamento, e Markdown pronto in un secondo, senza alcun costo. Per il codice, Turndown in JavaScript, markdownify in Python e la CLI Go html-to-markdown sono tutti gratuiti e con licenza MIT, e Pandoc è gratuito sotto GPL.

### Come convertire un'intera pagina web in Markdown?

Usa un clipper, non un convertitore. Un'estensione del browser come MarkDownload oppure l'Obsidian Web Clipper esegue prima un estrattore sulla pagina resa, il che elimina la navigazione e i banner, e solo dopo converte quello che resta. Salvare la pagina come `.html` e convertire il file ti dà l'intera pagina, arredo incluso.

### Perché il mio Markdown convertito è pieno di link di navigazione?

Perché hai convertito la pagina piuttosto che l'articolo. I convertitori nudi traducono ogni elemento che gli passi, e una pagina salvata per la maggior parte non è l'articolo. Estrai prima il contenuto con qualcosa come Readability, oppure usa uno strumento che rimuove gli elementi strutturali — intestazioni, navigazione, footer, script — prima di convertire.

### I convertitori da HTML a Markdown mantengono le tabelle?

Alcuni sì, alcuni hanno bisogno di un plugin, e nessuno mantiene una complicata. Turndown ha bisogno di `turndown-plugin-gfm` per le tabelle; node-html-markdown, html-to-md e la libreria Go le gestiscono direttamente. Nessun convertitore può mantenere fedelmente una tabella annidata o una cella unita, perché le tabelle GFM sono una griglia piatta di celle semplici.

### Posso convertire HTML in Markdown dalla riga di comando?

Sì. Pandoc legge HTML e scrive GFM, html2text è una CLI Python, e la libreria Go html-to-markdown fornisce un binario installabile `html2markdown` che legge l'input standard. Per un job dentro CI, un convertitore con un'API REST oppure una GitHub Action elimina del tutto l'installazione dal tuo runner.

### Cosa succede a CSS e stili in linea?

Vengono scartati, perché Markdown non ha stile. Di solito è quello che vuoi, e occasionalmente una perdita vera: un nome di classe è spesso l'unico marcatore che distingue un riquadro di avviso, un richiamo o una citazione in evidenza da un paragrafo ordinario. I convertitori con regole per elemento possono mappare una classe conosciuta su una citazione o un prefisso in grassetto, ma quella regola la scrivi tu.

### È sicuro convertire un file HTML che qualcuno mi ha mandato?

Convertire è sicuro nel senso che l'output è Markdown, che è testo. I rischi stanno altrove: aprire prima l'HTML in un browser esegue qualunque cosa ci sia dentro, e Markdown può portare HTML grezzo fino al prossimo renderer se il convertitore lo lascia passare. Converti senza aprire, e controlla se il tuo convertitore elimina `<script>` oppure lo mantiene.
