---
title: "I migliori convertitori da Markdown a HTML nel 2026: confrontati e testati"
description: Confronta i convertitori da Markdown a HTML per supporto alle varianti, sanificazione, e se il file che ti restituiscono si apre da solo o arriva come frammento.
date: 2026-09-08
tag: Conversione
keywords: convertire markdown in html, convertitore markdown html online, convertire md in html gratis, libreria markdown html, convertire markdown da riga di comando, html autonomo da markdown, convertire markdown senza installare
---

Ogni convertitore da Markdown a HTML produce HTML. È qui che finisce la somiglianza. Uno restituisce un frammento senza `<html>` intorno, un altro conserva il tag `<script>` che qualcuno ha lasciato nel file, un terzo perde le tue tabelle perché non le ha mai implementate. Il file che ti torna in mano è il prodotto, e le differenze si vedono solo quando lo apri da qualche altra parte rispetto allo strumento che l'ha creato.

### In breve

Scegli in base a cosa deve succedere al file, non al numero di funzioni. Per un documento che manderai a qualcuno, ti serve un **file HTML completo e autonomo** con gli stili incorporati — non un frammento. Per un documento che contiene qualcosa che non hai scritto tu, ti serve un convertitore che **sanifichi**, perché Markdown permette HTML grezzo e l'HTML grezzo permette script. Per una build, scegli la **libreria che il tuo generatore usa già** e fermati lì. Un convertitore lato browser risolve il primo caso senza caricare niente e senza installare niente. Pandoc copre la gamma più ampia di formati, se sei disposto a installarlo. marked, markdown-it e remark sono le librerie su cui è costruito tutto il resto.

## Perché "converte Markdown" non dice quasi niente

Convertire un file Markdown in HTML sono quattro lavori in fila, e uno strumento può essere attento a uno e trascurato sul successivo. Analizza il testo in un albero, renderizza quell'albero in tag HTML, sanifica il risultato, e lo avvolge in un documento. [Cosa succede davvero al tuo file](/blog/markdown-to-html-converter) vale la lettura per intero, ma la versione breve è che i convertitori differiscono in ognuna di queste quattro fasi, e le differenze sono invisibili finché non mordono.

La prima fase decide la variante. Il CommonMark puro ha blocchi di codice recintati ma nessuna tabella, nessun elenco di attività, nessun testo barrato e nessun autolink. GitHub Flavored Markdown aggiunge tutti e quattro. Le note a piè di pagina non sono in nessuna delle due specifiche, quindi un convertitore che le supporta lo fa come estensione. Un file che si rende correttamente su GitHub e viene fuori sbagliato altrove ha di solito incontrato un parser che gira su una variante più piccola — e il fallimento è silenzioso, perché una tabella che il parser non riconosce è solo un paragrafo pieno di caratteri pipe.

La terza fase decide se il tuo documento può attaccare chi lo legge. Markdown è stato progettato per lasciare passare HTML grezzo, il che significa che un file `.md` può contenere `<script>`, `onerror=` e URL `javascript:`, e un convertitore che rende fedelmente li passerà tutti al browser. Questo conta nel momento in cui converti un file che non hai scritto tu — un README di un repository, un documento che ti ha mandato un cliente, qualunque cosa presa dalla rete. [Sanificare non è opzionale](/blog/sanitising-markdown-safely) per quei file, e un numero sorprendente di strumenti lo lascia a te.

La quarta fase decide se il file si apre. Un convertitore che restituisce un frammento — `<h1>Titolo</h1><p>Testo</p>` senza niente attorno — ha fatto il suo lavoro da libreria e ha fallito quello da strumento. Aperto in un browser, quel frammento si rende come testo nero senza stile su sfondo bianco, con il font predefinito del browser e a larghezza piena. È HTML tecnicamente corretto, e sembra rotto a chiunque lo riceva.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| TransformPipe | Mandare a qualcuno un documento finito | HTML autonomo, stili incorporati, convertito nel browser | Gratis |
| Pandoc | Convertire fra molti formati in una volta | Circa 40 formati, modelli, `--standalone` e incorporazione degli allegati | Gratis, GPL |
| marked | Conversione veloce dentro un'app JS | Piccolo, rapido, GFM di serie | Gratis, MIT |
| markdown-it | Correttezza e plugin | Conforme a CommonMark, esclude l'HTML grezzo di default | Gratis, MIT |
| remark / unified | Trasformare il documento, non solo renderizzarlo | Un AST che puoi percorrere e riscrivere | Gratis, MIT |
| commonmark.js | Verificare cosa dice davvero la specifica | L'implementazione di riferimento | Gratis, BSD |
| Showdown | Progetti JS legacy che lo usano già | Convertitore di lunga data, precedente a CommonMark | Gratis, MIT |
| Python-Markdown | Script di build in Python | API di estensione, alimenta MkDocs | Gratis, BSD |
| Goldmark | Programmi Go e siti Hugo | Conforme a CommonMark, veloce, estensibile | Gratis, MIT |
| Dillinger | Scrivere ed esportare in una scheda del browser | Editor con esportazione HTML e PDF, sincronizzazione cloud | Gratis, MIT |
| StackEdit | Scrivere offline in un browser | Editor da browser, si sincronizza con Drive, Dropbox, GitHub | Gratis, Apache 2.0 |
| Typora | Un editor desktop in cui vivi | Modifica WYSIWYG, esporta HTML, PDF, Word | 14,99 $ una tantum |
| VS Code | Convertire mentre stai già programmando | Anteprima integrata (markdown-it), esportazione via estensioni | Gratis |
| Generatori di siti statici | Un sito, non un documento | Hugo, Eleventy, Docusaurus, MkDocs, Jekyll | Gratis |
| GitHub / GitLab | Leggere, non esportare | Renderizza GFM; nessun pulsante di esportazione | Gratis |

## I migliori convertitori da Markdown a HTML nel 2026

### TransformPipe — il migliore per un documento che stai per mandare a qualcuno

TransformPipe convertisce un file Markdown in un documento HTML completo nel tuo browser e te lo restituisce come un unico file con gli stili incorporati. Non c'è installazione, non serve un account, e da disconnesso il file non viene mai mandato da nessuna parte — viene letto, convertito e renderizzato sulla tua stessa macchina.

| Pro | Contro |
| --- | --- |
| L'esportazione è un unico file che non chiede niente alla rete | Non è un generatore di siti: un documento alla volta, o diversi incatenati in uno |
| Niente viene caricato quando non hai fatto l'accesso | È il browser a fare il lavoro, quindi un file molto grande è limitato dalla macchina |
| Sanifica contro un'unica allow-list, nel browser e sul server allo stesso modo | Nessun linguaggio di template per layout personalizzati |
| Convertitore anche per [HTML](/blog/best-html-to-markdown-converters), [Word](/blog/best-word-to-markdown-converters), CSV e [JSON](/blog/best-json-to-markdown-converters) verso Markdown | |

**Prezzo:** gratis. Un account aggiunge cronologia, condivisione e un'API, anche questi gratis.

**Dettagli tecnici e funzioni**

- GitHub Flavored Markdown: tabelle, elenchi di attività, testo barrato, autolink, codice recintato
- L'output è un documento completo — doctype, head, `<style>` incorporato, nessuna richiesta esterna di alcun tipo
- L'HTML grezzo nella fonte passa attraverso un sanificatore con un'allow-list fissa prima di raggiungere la pagina
- Si scarica come `.html`, `.md` o testo semplice, oppure si stampa in PDF tramite la finestra di dialogo del browser
- La stessa conversione è disponibile da un'API REST, una CLI senza dipendenze, una GitHub Action e un server MCP

**Per chi è?** Per chiunque abbia come passo successivo "mandare questo a una persona". L'esportazione autonoma è il punto: si apre allo stesso modo su un portatile senza connessione come sul tuo, [che è una proprietà specifica da capire](/blog/share-a-markdown-document-as-a-link) prima di mandare per email un file `.md` a qualcuno e sperare.

### Pandoc — il migliore per convertire fra molti formati

Pandoc è un convertitore di documenti da riga di comando scritto in Haskell che legge e scrive circa quaranta formati, Markdown e HTML compresi. È lo strumento più capace di questo elenco per un ampio margine, e quello che devi installare.

| Pro | Contro |
| --- | --- |
| Converte fra formati che nient'altro tocca, LaTeX ed EPUB compresi | Richiede un'installazione e un terminale |
| `--standalone` produce un documento completo, non un frammento | Modelli e filtri sono una curva di apprendimento tutta loro |
| I modelli danno controllo esatto sul contenitore | Nessuna sanificazione: l'HTML grezzo passa dritto |
| Gli allegati si possono incorporare così l'output è un unico file | Le differenze di variante fra i suoi dialetti Markdown sorprendono |

**Prezzo:** gratis, licenza GPL.

**Dettagli tecnici e funzioni**

- Un proprio dialetto Markdown esteso, più lettori CommonMark e GFM che selezioni esplicitamente
- `--standalone` avvolge l'output in un documento completo; `--embed-resources` incorpora immagini e CSS
- `--template` e filtri Lua per riscrivere il documento a metà conversione
- `--sandbox` limita l'accesso al filesystem quando converti file di cui non ti fidi

**Per chi è?** Per chiunque converta su base regolare o verso formati diversi da HTML — una pipeline di manoscritti, una build di documentazione, un repository che deve pubblicare EPUB e PDF dalla stessa fonte. [Come si confronta per lavori occasionali da Markdown a HTML](/blog/markdown-to-html-from-the-command-line) è una domanda più stretta, e la risposta è spesso che è più strumento di quanto il lavoro richieda.

### marked — il migliore per la velocità dentro un'app JavaScript

marked è un parser e compilatore Markdown piccolo e veloce per JavaScript, usabile nel browser e in Node. È una delle due librerie a cui la maggior parte dei progetti JS ricorre.

| Pro | Contro |
| --- | --- |
| Molto veloce e molto piccolo | Restituisce un frammento; avvolgerlo è compito tuo |
| GitHub Flavored Markdown supportato di serie | La sanificazione è esplicitamente non sua responsabilità |
| Un'API semplice: una funzione, un oggetto di opzioni | Punti di estensione meno strutturati di quelli di markdown-it |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- GFM di default, con opzioni per i ritorni a capo, gli id delle intestazioni e le liste intelligenti
- Un lexer che puoi chiamare separatamente per ottenere token invece di HTML
- Renderer personalizzati per sovrascrivere come viene emesso ogni tipo di nodo
- Nessun sanificatore integrato: la risposta documentata è passare l'output attraverso DOMPurify

**Per chi è?** Per gli sviluppatori che renderizzano Markdown dentro un'applicazione dove la velocità conta e il documento circostante esiste già — un box di commenti, un riquadro di anteprima, un messaggio di chat.

### markdown-it — il migliore per correttezza e plugin

markdown-it è un parser conforme a CommonMark con un sistema di plugin strutturato. È quello che usa l'anteprima Markdown integrata di VS Code, un ragionevole attestato della sua conformità.

| Pro | Contro |
| --- | --- |
| Passa la suite di test della specifica CommonMark | Leggermente più grande e più lento di marked |
| Esclude l'HTML grezzo di default, quindi `html: false` è l'opzione sicura | Restituisce comunque un frammento |
| Un vero ecosistema di plugin: note, contenitori, attributi, ancore | La qualità dei plugin varia |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- CommonMark di default, con funzioni GFM disponibili tramite preset e plugin
- `html: false` di default — l'HTML grezzo nella fonte viene escluso invece di passare
- Le regole si possono aggiungere, sostituire o riordinare a livello di blocco e inline
- Opzioni linkify e typographer per l'autolinking e la punteggiatura tipografica

**Per chi è?** Per chi vuole che la specifica sia seguita e i punti di estensione documentati, e per chi la sicurezza dell'opzione di default conta più di qualche millisecondo.

### remark e unified — i migliori per cambiare il documento, non solo renderizzarlo

remark analizza il Markdown in un albero sintattico astratto e te lo mette in mano. Renderizzare è un plugin alla fine di una catena; il punto è tutto quello che puoi fare prima.

| Pro | Contro |
| --- | --- |
| Un vero AST che puoi percorrere, interrogare e riscrivere | L'opzione più pesante qui, di gran lunga |
| Un ecosistema di plugin enorme, rehype per l'output HTML compreso | La pipeline unified richiede un vero apprendimento |
| Alimenta MDX e Docusaurus, quindi è ben esercitato | Eccessivo per trasformare un file in una pagina |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- mdast per Markdown, hast per HTML, con plugin per muoversi tra i due
- remark-gfm per tabelle ed elenchi di attività, remark-frontmatter per l'intestazione
- rehype-sanitize come passaggio di prima classe nella pipeline invece che un ripensamento
- Usato per costruire linter, formattatori e codemod sulla prosa, non solo renderer

**Per chi è?** Per le squadre che fanno qualcosa al documento mentre passa — riscrivere link, estrarre intestazioni, imporre uno stile aziendale, generare componenti MDX.

### commonmark.js — il migliore per chiudere un dibattito sulla specifica

commonmark.js è l'implementazione di riferimento di CommonMark, scritta dagli stessi autori della specifica. Il suo scopo è la conformità, non le funzioni.

| Pro | Contro |
| --- | --- |
| La risposta definitiva a "cosa dice la specifica?" | Nessuna tabella, elenco di attività o testo barrato — quelle sono GFM |
| Piccolo e prevedibile | Pochi punti di estensione, per progetto |
| Include un AST | Non pensato come renderer di un'applicazione |

**Prezzo:** gratis, licenza BSD.

**Per chi è?** Per chi confronta parser, ne scrive uno, o deve capire se una differenza di rendering è un bug o una variante. Torna utile quando devi sapere cosa fa il CommonMark puro, il che succede [più spesso di quanto ci si aspetti](/blog/commonmark-gfm-and-the-flavours).

### Showdown — il migliore solo se lo usi già

Showdown è un convertitore Markdown JavaScript precedente a CommonMark e ancora mantenuto. Funziona, e non c'è un motivo forte per scegliere lui per qualcosa di nuovo.

| Pro | Contro |
| --- | --- |
| Di lunga data e stabile | Non conforme a CommonMark, per progetto |
| Gira nel browser e in Node | Differenze di variante rispetto a GFM in casi limite |
| Flag di opzione per la maggior parte dei comportamenti | Ecosistema più piccolo di marked o markdown-it |

**Prezzo:** gratis, licenza MIT.

**Per chi è?** Per progetti già costruiti su di lui. Il lavoro nuovo è servito meglio da markdown-it.

### Python-Markdown — il migliore per script di build in Python

Python-Markdown è l'implementazione Markdown di lunga data per Python, con un'API di estensione su cui è costruita una grande quantità di strumenti di documentazione, MkDocs compreso.

| Pro | Contro |
| --- | --- |
| API di estensione matura con molte estensioni disponibili | Non conforme a CommonMark in ogni dettaglio |
| Adatto naturalmente a una pipeline di build Python | Più lento delle opzioni JS e Go |
| Tabelle, note e liste di attributi come estensioni ufficiali | Output a frammento; avvolgerlo è compito tuo |

**Prezzo:** gratis, licenza BSD.

**Per chi è?** Per progetti Python, e per chiunque estenda MkDocs, dove è già il motore.

### Goldmark — il migliore per Go, e per i siti Hugo

Goldmark è un parser Markdown conforme a CommonMark scritto in Go, noto per essere il motore dentro Hugo da quando ha sostituito Blackfriday.

| Pro | Contro |
| --- | --- |
| Conforme a CommonMark e veloce | Solo Go |
| Estensibile con un AST pulito | Output a frammento |
| Già nel tuo stack se usi Hugo | Meno estensioni già pronte del mondo JS |

**Prezzo:** gratis, licenza MIT.

**Per chi è?** Per programmi Go, e per chi usa Hugo e vuole capire cosa renderizza i propri contenuti.

### Dillinger — il migliore per scrivere ed esportare in una scheda

Dillinger è un editor Markdown online con anteprima live ed esportazione in HTML e PDF, più sincronizzazione con Dropbox, Google Drive, OneDrive e GitHub.

| Pro | Contro |
| --- | --- |
| Scrivi ed esporta senza lasciare il browser | Il tuo documento passa per un servizio ospitato |
| Sincronizzazione cloud verso i soliti posti | Lo stile dell'esportazione è dello strumento, non tuo |
| Gratuito e open source | Prima di tutto un editor: non pensato per convertire file che hai già |

**Prezzo:** gratis, licenza MIT.

**Per chi è?** Per chi sta scrivendo il documento adesso e vuole un link o un file alla fine.

### StackEdit — il miglior editor da browser che funziona offline

StackEdit è un editor Markdown da browser che continua a funzionare senza connessione e si sincronizza con Google Drive, Dropbox e GitHub quando ne ha una.

| Pro | Contro |
| --- | --- |
| Funziona offline una volta caricato | Prima di tutto un editor, come Dillinger |
| Sincronizza e pubblica su diverse destinazioni | La sua sintassi estesa può viaggiare male |
| Gestisce comodamente documenti lunghi | L'esportazione è stilizzata a modo suo |

**Prezzo:** gratis, licenza Apache 2.0.

**Per chi è?** Per chi vuole un editor serio in una scheda del browser e pubblica direttamente da lì.

### Typora — il miglior editor desktop con esportazione

Typora è un editor Markdown desktop con una modalità WYSIWYG — il Markdown viene sostituito dal suo rendering mentre scrivi — ed esportazione in HTML, PDF, Word e altro.

| Pro | Contro |
| --- | --- |
| L'esperienza di scrittura più comoda di questo elenco | A pagamento, e solo desktop |
| Esporta in HTML, PDF e Word con temi | Il WYSIWYG nasconde la sintassi, cosa che ad alcuni non piace |
| File locali, niente caricato | Non uno strumento batch o di build |

**Prezzo:** 14,99 $, un acquisto unico che copre fino a tre dispositivi, con una prova gratuita di 15 giorni (verificato su typora.io, l'8 settembre 2026).

**Per chi è?** Per chi scrive Markdown ogni giorno e vuole un'applicazione invece di una scheda.

### VS Code — il migliore se ci sei già dentro

VS Code fornisce un'anteprima Markdown costruita su markdown-it, e le estensioni aggiungono l'esportazione. Se il file è già aperto nel tuo editor, questa è la strada più corta dal testo alla pagina.

| Pro | Contro |
| --- | --- |
| Già installato, per la maggior parte degli sviluppatori | L'esportazione richiede un'estensione, e le estensioni variano |
| L'anteprima corrisponde al comportamento CommonMark di markdown-it | Non è una pipeline: converte quello che è aperto |
| Le estensioni coprono esportazione HTML, PDF e slide | Lo stile dell'anteprima non è lo stile esportato |

**Prezzo:** gratis.

**Per chi è?** Per gli sviluppatori che convertono un README o una nota di passaggio. [I dettagli per farlo bene in VS Code](/blog/markdown-to-html-converter) dipendono da quale estensione scegli e da cosa mette intorno al frammento.

### Generatori di siti statici — la risposta quando vuoi un sito

Hugo, Eleventy, Docusaurus, MkDocs e Jekyll convertono tutti Markdown in HTML, e nessuno di loro è un convertitore. Sono sistemi di build: si aspettano una directory, un file di configurazione, modelli e una destinazione di deploy, e in cambio ti danno navigazione, feed e link incrociati.

| Pro | Contro |
| --- | --- |
| Navigazione, ricerca e templating su molti documenti | Overhead enorme per un solo file |
| Veloci, ben documentati, ampiamente distribuiti | Un file di configurazione e un passaggio di build da mantenere |
| Ecosistemi di temi e plugin | L'output è un sito, non un documento che puoi mandare per email |

**Prezzo:** gratis.

**Per chi è?** Per chi pubblica un insieme di documenti collegati fra loro. Se hai un file e una persona a cui mandarlo, [non ti serve un generatore](/blog/share-a-markdown-document-as-a-link) — ti serve un file.

### GitHub e GitLab — renderizzatori, non convertitori

Entrambi renderizzano GFM alla perfezione e nessuno dei due ti dà un pulsante di esportazione. Puoi tirare fuori HTML dall'API Markdown di GitHub, e puoi salvare la pagina renderizzata dal tuo browser, ma quello che salvi arriva avvolto nella marcatura e nei foglio di stile della loro applicazione.

**Per chi è?** Per nessuno, per la conversione. Entrambi sono posti eccellenti per leggere Markdown e il posto sbagliato per convertirlo.

## Cosa lasciano fuori le tabelle di confronto

Le pagine dei fornitori competono sulle funzioni. Le cose che decidono davvero se un file convertito funziona raramente sono nell'elenco.

**Se l'output è un documento.** È la delusione più comune. Le librerie restituiscono frammenti, correttamente e per progetto; diversi strumenti online fanno lo stesso. Incolli il risultato in un file, lo apri, e ottieni testo senza stile alla larghezza predefinita del browser. Uno strumento che ti dà un documento completo — doctype, head, stili — ha preso una decisione per tuo conto che una libreria non può prendere.

**Se il file ha bisogno della rete.** Un'esportazione che collega un foglio di stile o un font da un CDN smette di sembrare giusta nel momento in cui viene aperta offline, e dice a chi la apre qualcosa su dove è stato il file. Un file autonomo porta i suoi stili incorporati e non richiede niente. È più grande, ed è l'unica versione che si comporta allo stesso modo ovunque.

**Se l'HTML grezzo sopravvive.** Rendere fedelmente e rendere in sicurezza sono obiettivi diversi, e ogni strumento qui ne sceglie uno. markdown-it esclude l'HTML grezzo a meno che non gli dici il contrario. marked lo lascia passare e lo dice chiaramente. Pandoc lo lascia passare. Se il file arriva da qualcun altro, devi sapere quale dei due stai usando prima di aprire il risultato in un browser.

**Dove va il file.** Un convertitore online che carica è un convertitore online che ha il tuo documento. Per un README pubblico è irrilevante; per un contratto, la nota di un paziente o un piano non annunciato è l'intera domanda. La conversione lato browser significa che il file non lascia mai la macchina, e questo è verificabile — apri la scheda della rete e guarda che non succeda niente.

**Cosa fa con l'intestazione.** Un file Markdown proveniente da un sito statico o da un'app per prendere note di solito inizia con front matter YAML. Alcuni convertitori lo tolgono, alcuni lo rendono come un paragrafo di righe `chiave: valore` in cima al tuo documento, e pochi lo trasformano in una tabella. Nessuna di queste è sbagliata, e solo una era quella che volevi.

## Come scegliere

I criteri sotto sono la versione breve; [i requisiti che vale la pena scrivere prima di confrontare qualunque cosa](/blog/choosing-a-markdown-to-html-converter) vanno più a fondo.

1. **Parti dalla destinazione.** Mandarlo a una persona richiede un documento autonomo. Pubblicare un insieme di pagine richiede un generatore. Renderizzare dentro un'applicazione richiede una libreria. Sono tre strumenti diversi e quello sbagliato è ovvio col senno di poi.
2. **Fai corrispondere la variante al file.** Se il documento ha tabelle o elenchi di attività, il convertitore deve fare GFM, non CommonMark puro. Converti un file rappresentativo e guarda le tabelle prima di impegnarti su qualcosa.
3. **Decidi sulla sanificazione prima di convertire il file di qualcun altro.** Per le tue note non conta. Per qualunque cosa arrivata da fuori, o il convertitore sanifica o lo fai tu.
4. **Conta le installazioni.** Una conversione occasionale non dovrebbe richiedere un gestore di pacchetti. Una build notturna non dovrebbe richiedere una scheda del browser e una persona davanti.
5. **Apri il risultato da qualche altra parte.** Non nell'anteprima dello strumento — in un browser diverso, su una macchina diversa, con la rete spenta. È il test che intercetta frammenti, stili mancanti e link a CDN tutti insieme, e richiede un minuto.

## Conclusione

Il miglior convertitore da Markdown a HTML è quello il cui output sopravvive al viaggio. Se hai un file e lo vuoi convertito nel prossimo minuto, [i passaggi sono qui](/blog/convert-markdown-to-html-online). Per un documento con un destinatario, questo significa un file completo con gli stili incorporati, sanificato, prodotto senza caricare la fonte da nessuna parte — che è quello che fa [la conversione da Markdown a HTML di TransformPipe](/) nel tuo browser, gratis, senza installazione e senza niente per cui iscriversi. Per una build, usa la libreria che il tuo generatore già usa. Per qualunque cosa coinvolga formati oltre HTML, installa Pandoc e impara i suoi modelli; sopravviverà a ogni altro strumento di questa pagina.

## Domande frequenti

### Qual è il miglior convertitore gratuito da Markdown a HTML?

Per un documento finito, un convertitore lato browser che produce HTML autonomo è la migliore opzione gratuita: nessuna installazione, nessun caricamento, e un file che si apre ovunque. Un convertitore lato browser lo fa senza costi. Per la conversione dentro il tuo codice, marked e markdown-it sono entrambi gratuiti e con licenza MIT, e Pandoc è gratuito per la riga di comando.

### Come convertire Markdown in HTML senza installare niente?

Usa un convertitore che gira nel browser. Lascia cadere il file `.md` sulla pagina e scarica l'HTML — nessun gestore di pacchetti, nessun terminale, e con uno strumento lato browser il file non viene mai caricato, cosa che puoi confermare guardando la scheda della rete mentre converte.

### Perché il mio HTML convertito sembra senza stile?

Perché ti hanno dato un frammento invece di un documento. Le librerie restituiscono `<h1>…</h1><p>…</p>` senza `<html>`, `<head>` o stili intorno, e un browser lo renderizza al suo font predefinito e a larghezza piena. Ti serve un convertitore che avvolga l'output in un documento completo, oppure devi scrivere tu quel contenitore.

### I convertitori da Markdown a HTML conservano le tabelle?

Solo se implementano GitHub Flavored Markdown. Le tabelle non fanno parte della specifica CommonMark, quindi un parser strettamente conforme rende una tabella come un paragrafo che contiene caratteri pipe. Se i tuoi documenti hanno tabelle, testane una prima di scegliere un convertitore — [le tabelle sono la cosa più comune che si rompe nel passaggio](/blog/markdown-tables-that-survive-conversion).

### È sicuro convertire un file Markdown che mi ha mandato qualcuno?

Solo con un convertitore che sanifica. Markdown permette HTML grezzo, quindi un file `.md` può portare tag `<script>`, gestori `onerror` e URL `javascript:`, e un renderer fedele li passerà tutti al tuo browser. Controlla se lo strumento sanifica di default prima di aprire il risultato.

### Posso convertire Markdown in HTML da riga di comando o in un job CI?

Sì. Pandoc è la risposta generale, e la maggior parte dei linguaggi ha una libreria con un wrapper a riga di comando. Se il lavoro fa parte di una pull request o di una build notturna, un convertitore con un'API o una GitHub Action rimuove del tutto l'installazione dal tuo runner.

### Qual è la differenza tra marked e Marked 2?

Sono prodotti non collegati con nomi confusamente simili. `marked` è la libreria JavaScript open source descritta sopra. Marked 2 è un'applicazione a pagamento per macOS per l'anteprima Markdown. Cercare uno restituisce affidabilmente l'altro.
