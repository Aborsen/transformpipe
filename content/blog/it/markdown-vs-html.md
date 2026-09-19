---
title: "Markdown o HTML: in cosa scrivere, e quando cambiare"
description: "Markdown o HTML? La scelta dipende da cosa succede dopo al documento - revisione, conversione, layout esatto, parti interattive - e quali limiti sono funzioni"
date: 2026-08-15
tag: Workflow
keywords: markdown o html, differenza tra markdown e html, quando usare markdown, html grezzo dentro markdown, limiti di markdown, html vs markdown documentazione
---

Nessuno si chiede “Markdown o HTML?” in astratto. La domanda arriva attaccata a un file: un runbook che qualcuno deve tenere aggiornato, una pagina che deve somigliare esattamente alla versione stampata, un modello che deve sopravvivere a Outlook. I due formati non competono per lo stesso lavoro, e la discussione si risolve solo chiedendo cosa succede al documento dopo che hai finito di scriverlo.

### In breve

Scrivi Markdown quando il documento verrà letto, revisionato, modificato da altre persone e probabilmente convertito; scrivi HTML quando il layout, l'interattività o il canale di consegna sono il contenuto stesso. I limiti di Markdown sono il motivo per cui è revisionabile — un file che non può esprimere un layout a due colonne non può nemmeno nascondere una modifica a un diff. L'HTML grezzo dentro Markdown è la via d'uscita corretta per una figura, un iframe, un `<details>`, e un segnale d'allarme quando compare ogni tre paragrafi. Le eccezioni in cui conviene iniziare in HTML e restarci sono poche e riconoscibili: modelli di email, tutto ciò che richiede un layout di pagina esatto, e tutto ciò che ha parti in movimento.

La maggior parte dell'attrito che la gente attribuisce al formato è in realtà un abbinamento sbagliato. Qualcuno scrive un documento di policy in HTML perché l'artefatto finale è una pagina web, e diciotto mesi dopo nessuno riesce più a revisionare una modifica, perché il diff è quaranta righe di markup alterato attorno a tre parole cambiate. Qualcun altro scrive una fattura pronta per la stampa in Markdown, scopre che non c'è modo di forzare un'interruzione di pagina, e finisce a incollare `<div style="page-break-after: always">` in mezzo a un paragrafo.

Entrambe le direzioni costano la stessa cosa: il formato ha smesso di corrispondere al futuro del documento. Markdown è un formato di scrittura che si converte in un formato di pubblicazione. HTML è il formato di pubblicazione. Scegliere significa decidere quale dei due lavori domina la vita del file.

Il resto di questo articolo è la decisione, caso per caso, più le parti che la gente sbaglia — cosa Markdown non può davvero fare e perché è una funzione piuttosto che una lacuna, dove la via d'uscita dell'HTML grezzo è legittima, e quanto costa quando la risposta abituale “scrivi Markdown e converti” si rivela sbagliata.

## Cosa decide davvero la scelta

La differenza visibile è la sintassi: `## Titolo` contro `<h2>Titolo</h2>`. È la differenza meno interessante, ed è la sola che trattano la maggior parte dei confronti.

Quello che scegli davvero è dove vive la presentazione. In HTML, struttura e presentazione stanno nello stesso file, o almeno nello stesso repository, collegate da classi e un foglio di stile. Cambi il titolo e potresti dover cambiare il contenitore, la classe, e la regola CSS che lo prende di mira. In Markdown, la presentazione vive completamente fuori dal documento. Il file dice “questo è un titolo di secondo livello” e si rifiuta di dire qualunque cosa su come debba apparire un titolo di secondo livello. Questo unico vincolo è ciò che rende un file Markdown portabile, diffabile e sicuro da consegnare a chi non scrive codice.

Stai anche scegliendo la dimensione della superficie modificabile. Un documento HTML ha migliaia di stati legali, e la maggior parte di essi sono rotti in modo sottile — un `<li>` non chiuso, un `<div>` annidato in un `<p>`, un attributo vagante che un browser ripara in silenzio e un validatore segnala. Un documento Markdown ha un piccolo numero di costrutti e quasi nessun modo di rompere il parsing. Il peggio che di solito succede è che una lista viene resa come un paragrafo, cosa visibile immediatamente.

E stai scegliendo chi è il secondo autore. Questa è la parte che decide la maggior parte dei casi reali. Se la risposta è “un tecnico del supporto alle due di notte”, “un avvocato”, “un product manager” o “qualcuno che tra sei mesi non ha mai visto questo repository”, il formato ha bisogno di una soglia bassa. Se la risposta è “lo stesso sviluppatore front-end che l'ha scritto”, la soglia non conta, e il soffitto sì.

Tre domande risolvono quasi ogni caso:

- **Qual è l'artefatto finale?** Una pagina web, un PDF, un'email, un pannello di aiuto in-app, o un file in un repository che le persone leggono come testo.
- **Chi lo modifica dopo di te?** Un solo sviluppatore, una squadra mista, o il pubblico.
- **C'è qualcosa che deve essere esatto?** Interruzioni di pagina esatte, larghezze di colonna esatte, un rendering esatto in un client specifico. L'esattezza è l'argomento più forte a favore dell'HTML che esista.

## Markdown contro HTML: il bigliettino

Una tabella sola, letta in orizzontale. La terza colonna è l'opzione che la gente si scorda di avere — scrivi Markdown, convertilo, e tratta l'HTML come un prodotto di build piuttosto che un file fonte.

| Domanda | Markdown | HTML scritto a mano | Markdown convertito in HTML |
| --- | --- | --- | --- |
| Costo di scrivere una pagina di prosa | Il più basso: la sintassi non intralcia | Il più alto: tag, annidamento, contenitori | Il più basso, più un passaggio di build |
| Cosa mostra una revisione del codice | Parole cambiate | Parole cambiate sepolte in markup cambiato | Parole cambiate nella fonte; output rigenerato |
| Chi può modificarlo in sicurezza | Chiunque sappia digitare | Chi è a suo agio con il markup | Chiunque, sul lato Markdown |
| Layout esatto — colonne, interruzioni di pagina | Non esprimibile | Controllo completo | Solo quello che offre il modello |
| Parti interattive — moduli, script, widget | Non esprimibile | Nativo | Solo tramite passthrough di HTML grezzo |
| Rendering affidabile nei client di posta | No | Sì, con markup specifico per l'email | No, non senza un modello specifico per l'email |
| Tabelle | Solo griglie semplici, nessuna fusione o annidamento | Qualunque tabella | Quanto buono lo consente il dialetto |
| Attributi di accessibilità — `lang`, `scope`, ARIA | Quasi assenti | Completi | Dal modello, non dalla prosa |
| Rischio di pubblicare uno script per errore | Basso, finché non si consente HTML grezzo | È il tuo script | Dipende interamente dalla sanificazione |
| Leggibile in dieci anni senza strumenti | Sì, è prosa | Sì, ma si legge come markup | La fonte resta leggibile |
| Dove vive lo stile | In nessun punto del file | Nel file o nel suo foglio di stile | Nel convertitore o nel modello |
| Cosa puoi mandare a qualcuno | Un file `.md` che magari non sa aprire | Un file che si apre, se autosufficiente | Un documento HTML completo |

Il pattern in quella tabella è coerente. Markdown vince ogni riga su persone e tempo. HTML vince ogni riga su controllo e consegna. La terza colonna è le vittorie di Markdown su persone e tempo insieme alla consegna dell'HTML, al prezzo di un passaggio di conversione che ora possiedi tu.

## I casi, decisi dalla destinazione

Niente qui sotto è una questione di gusto. Ogni caso ha una destinazione, e la destinazione scegli il formato.

### Documentazione che vive accanto al codice — Markdown

Se il documento sta in un repository accanto alla cosa che descrive, dovrebbe essere Markdown. Viene revisionato nella stessa pull request della modifica che documenta, che è il solo meccanismo che mantiene la documentazione aggiornata in modo affidabile. GitHub, GitLab e ogni host di codice lo rendono senza una build. I nuovi arrivati lo modificano senza imparare una toolchain.

L'alternativa HTML fallisce qui in un modo specifico: la documentazione smette di essere revisionata. Un revisore che vede un diff di markup di 60 righe per una correzione di due frasi lo approva senza leggere, e da lì i documenti si allontanano dalla realtà. [Tenere la documentazione nel repository](/blog/documentation-that-lives-in-the-repo) è più una decisione di flusso di lavoro che di formattazione, e Markdown è il formato che rende il flusso di lavoro abbastanza economico da mantenerlo.

**Per chi è:** squadre di ingegneria, chiunque abbia un documento con un numero di versione legato a una base di codice.

### File README, changelog, guide per contribuire — Markdown

Questi vengono letti come testo tanto spesso quanto come pagine. Un changelog viene grepato, diffato, incollato in una nota di rilascio e occasionalmente letto su un telefono in un terminale. HTML rende peggiore ognuna di quelle cose e non ne migliora nessuna.

**Per chi è:** ogni repository, senza eccezioni degne di discussione.

### Note, bozze e qualunque cosa a cui stai ancora pensando — Markdown

Scrivere HTML mentre componi la prosa divide l'attenzione tra la frase e il suo contenitore. Le persone che scrivono più Markdown non sono sviluppatori che pubblicano siti; sono persone che prendono appunti, e il formato sopravvive perché non intralcia. Un gran numero di editor esiste esattamente per questo, e i migliori rendono la sintassi quasi invisibile.

**Per chi è:** chiunque la cui prima bozza non sia l'artefatto finale.

### Un documento da mandare a una persona specifica — Markdown, convertito

Qui la risposta non è nessuno dei due formati da solo. Vuoi scrivere Markdown e consegnare HTML, perché un file `.md` è una richiesta che il destinatario installi o apra qualcosa, e un file HTML completo è un documento che si apre con quello che già ha.

La proprietà importante dell'output è che sia autosufficiente: doctype, `<head>`, stili incorporati, nessuna richiesta a un CDN per un font o un foglio di stile. Un fragmento — `<h1>Titolo</h1><p>Testo</p>` senza niente attorno — è HTML legale e si rende come testo nero non stilizzato alla larghezza predefinita del browser, che appare rotto a chiunque lo riceva.

**Per chi è:** una proposta, un report, un documento di passaggio, una specifica destinata a un cliente.

### Un sito, un portale di documentazione, un blog — Markdown, convertito da un generatore

Più documenti che si collegano tra loro hanno bisogno di navigazione, feed, ricerca e un modello condiviso. È il lavoro di un generatore di siti statici, e ognuno di essi prende Markdown come input per lo stesso motivo: nessuno vuole scrivere a mano il markup di cento pagine. L'HTML in quell'assetto è generato, e nessun essere umano dovrebbe modificarlo.

**Per chi è:** chiunque pubblichi un insieme di pagine piuttosto che una pagina sola.

### Modelli di email — HTML, e un dialetto specifico di esso

Questo è il caso più chiaro in cui Markdown è il punto di partenza sbagliato, e vale la pena essere precisi sul perché. L'HTML per email non è l'HTML che scrivi per i browser. I client differiscono su quale CSS supportano, alcuni eliminano del tutto un blocco `<style>` così che gli stili devono essere applicati riga per riga su ogni elemento, e il layout viene ancora costruito comunemente con tabelle annidate piuttosto che con flexbox o grid. Outlook su Windows ha per molti anni renderizzato la posta HTML tramite il motore di rendering di Microsoft Word piuttosto che un motore da browser, il che spiega perché tanto markup di email sembra scritto nel 2003 — deve esserlo.

Nessun convertitore Markdown punta a quello. Un convertitore produce HTML conforme agli standard per un browser, e l'HTML conforme agli standard per un browser è esattamente quello che un client di posta ostile stravolge. Puoi scrivere il testo del corpo in Markdown e incollare l'output convertito in un modello, ma il modello stesso è HTML scritto a mano, o costruito da un framework pensato per l'email come MJML, che compila una sua sintassi a componenti nel markup a tabelle annidate che i client tollerano. MJML è gratuito e open source.

**Per chi è:** chiunque mandi posta che deve apparire uguale in più di tre client. Scrivi il modello in HTML una volta; non provare a generarlo.

### Tutto ciò in cui il layout è il contenuto — HTML con CSS

Fatture, certificati, contratti con clausole numerate che non devono spezzarsi tra le pagine, poster, moduli, qualunque cosa con una griglia di colonne fissa o un piè di pagina che deve stare in fondo a ogni pagina stampata. Markdown non può esprimere niente di tutto ciò, e nessuna estensione ragionevole lo farà, perché sono istruzioni di presentazione, e l'intero progetto di Markdown è escludere le istruzioni di presentazione.

Gli strumenti qui sono i CSS per i media impaginati — `@page` per i margini, `break-inside: avoid` per mantenere intera una riga di tabella, `break-after` per forzare una nuova pagina — e operano su HTML. Se la destinazione è un artefatto stampato con regole su come deve stare sulla pagina, inizia in HTML. Se è un documento che semplicemente finisce per diventare un PDF, Markdown convertito in HTML e stampato dal browser di solito basta; [cosa guadagni e cosa perdi su quella strada](/blog/markdown-to-pdf) vale la pena saperlo prima di impegnarti.

**Per chi è:** documenti finanziari, documenti legali, qualunque cosa destinata a una stampante.

### Tutto ciò che ha parti in movimento — HTML

Moduli che si inviano, tab, filtri, grafici che rispondono all'input, una calcolatrice, una casella di ricerca, una tabella che si può ordinare, un lettore video con controlli personalizzati. Non sono documenti con decorazioni; sono piccole applicazioni. Markdown non ha sintassi per loro e non dovrebbe acquisirla.

Il segnale è se il lettore fa qualcosa oltre a leggere. Se clicca su qualcosa che cambia quello che vede, stai costruendo HTML, e la prosa dentro è una piccola parte del file.

**Per chi è:** interfacce applicative, pagine di marketing con interazione, dashboard.

### Contenuto in un database, modificato da personale non tecnico — di solito nessuno dei due, direttamente

Vale la pena nominarlo perché è comune e viene classificato male. Se il marketing modifica i testi tramite un CMS, il formato memorizzato è quello che produce il CMS — spesso HTML da un editor rich-text, a volte una struttura a blocchi JSON. Scegliere Markdown lì significa chiedere agli editor non tecnici di imparare una sintassi e di vedere l'anteprima del proprio lavoro in una seconda finestra. Alcune squadre lo fanno volentieri; di più, smettono in silenzio di usare il CMS.

**Per chi è:** squadre dove l'editor è il pubblico, non lo sviluppatore.

## Cosa Markdown non può fare, deliberatamente

L'elenco sotto si legge come un elenco di funzioni mancanti. È più vicino a una specifica. Ogni voce è stata lasciata fuori perché il formato restasse abbastanza piccolo da leggersi come testo semplice, e ogni omissione compra qualcosa.

**Nessuno stile di nessun tipo.** Non c'è sintassi per colore, font, dimensione, allineamento o spaziatura. Quello che ottieni è un'affermazione sulla struttura — titolo, lista, enfasi — e la decisione sull'aspetto viene rimandata a qualunque cosa renda il file. L'acquisto: un documento si rende correttamente in un host di codice, nell'anteprima di un editor, in un terminale, in un sito statico e in un file HTML convertito, perché nessuno di essi deve concordare con gli altri sull'aspetto.

**Nessun layout.** Nessuna colonna, nessun float, nessuna interruzione di pagina, nessun controllo su dove sta qualunque cosa. Un documento Markdown è una colonna unica di blocchi nell'ordine della fonte. L'acquisto: si riflow su un telefono senza nessun lavoro, e si converte in qualunque layout voglia il modello piuttosto che combatterne uno.

**Nessun attributo sugli elementi.** Il Markdown puro non dà modo di aggiungere una classe, un id, un `lang`, un `title` o un ruolo ARIA. Diverse implementazioni lo aggiungono come estensione — liste di attributi in Python-Markdown, `markdown-it-attrs`, div delimitate in Pandoc — e nel momento in cui usi una di esse, il tuo file è legato a quell'implementazione. L'acquisto: un file senza attributi non può portare presentazione specifica di un'implementazione, quindi resta portabile.

**Le tabelle sono griglie e niente più.** GitHub Flavored Markdown dà una riga di intestazione, l'allineamento per colonna e celle con contenuto inline. Non c'è `colspan`, non c'è `rowspan`, non c'è tabella annidata, non c'è cella con una lista o un'interruzione di paragrafo, non c'è didascalia. Se la tua tabella ha bisogno di qualcosa del genere, ti serve HTML per quella tabella. L'acquisto: la tabella è leggibile nel file fonte, cosa che una tabella HTML non è. Le tabelle sono anche la cosa più comune che si rompe in transito, e [mantenerle intatte durante la conversione](/blog/markdown-tables-that-survive-conversion) ha regole proprie.

**Nessuna nota a piè di pagina, lista di definizioni o formula matematica nella specifica di base.** CommonMark non ne ha nessuna. GFM aggiunge tabelle, liste di attività, testo depennato e autolink, e si ferma lì. Note a piè di pagina, liste di definizioni, formule `$…$` e blocchi di avviso sono tutte estensioni, supportate da alcuni parser e rese come testo letterale in silenzio da altri. L'acquisto: una specifica piccola che molte implementazioni implementano davvero correttamente. Significa anche che “Markdown supporta X” è quasi sempre un'affermazione su un parser piuttosto che su Markdown; [le differenze tra i dialetti](/blog/commonmark-gfm-and-the-flavours) sono da dove vengono la maggior parte delle sorprese fra strumenti diversi.

**Nessun contenuto condizionale, nessun include, nessuna variabile.** Non puoi dire “mostra questo paragrafo solo per l'edizione enterprise” o “inserisci qui il blocco di licenza”. I generatori di siti statici lo aggiungono con il front matter e la sintassi dei template, esattamente il punto in cui il tuo Markdown smette di essere Markdown portabile. L'acquisto: quello che leggi è quello che c'è.

**Nessuna semantica oltre una dozzina di costrutti.** Nessun `<figure>` con `<figcaption>`, nessun `<abbr>`, nessun `<time>`, nessun `<aside>`, nessuna `<section>` con un titolo etichettato. Per i documenti che devono rispettare uno standard di accessibilità, questa è una lacuna reale, e viene colmata dal modello di conversione o dall'HTML grezzo nel file.

Il pattern: Markdown rifiuta di descrivere l'aspetto, e rifiuta di essere estensibile in modi che legherebbero un documento a un solo strumento. Entrambi i rifiuti sono il motivo per cui un file `.md` del 2011 funziona ancora ovunque oggi. Un formato che avesse accettato ogni richiesta di funzione ragionevole sarebbe ormai un HTML peggiore con un ecosistema più piccolo.

## HTML grezzo dentro Markdown: la via d'uscita e il campanello d'allarme

Markdown ha sempre permesso HTML grezzo in mezzo a un documento. Il Markdown originale lo permetteva per progetto, e CommonMark specifica come si comporta l'HTML a livello di blocco e inline. Quindi il rigido aut-aut nel titolo è leggermente falso: puoi scrivere Markdown e passare a HTML per un singolo elemento.

Se sia corretto dipende da quanto spesso lo fai e da cosa stai cercando di ottenere.

### Dove è la risposta giusta

| Caso | Perché l'HTML è corretto qui |
| --- | --- |
| Un blocco richiudibile — `<details><summary>` | Non esiste sintassi Markdown, degrada a testo visibile, ed è una singola coppia di tag |
| Un video o una mappa incorporata via iframe | Markdown non ha sintassi di incorporamento; l'alternativa è un plugin che lega il file a un solo renderer |
| Una figura con una vera didascalia | `<figure>` e `<figcaption>` portano semantica che `![alt](src)` non può |
| Una tabella con una cella unita | La sintassi a griglia non può davvero esprimerlo; una tabella HTML è onesta |
| Un'ancora per collegarsi a metà documento | `<a id="section-3"></a>` dove il renderer non genera id dei titoli |
| Un attributo `lang` su un passaggio citato | Necessario per la pronuncia corretta del lettore di schermo, altrimenti impossibile |
| Un singolo badge o un'immagine inline a larghezza fissa | Raro, contenuto, e ovvio per il prossimo lettore |

Il filo comune: l'elemento è piccolo, autosufficiente, e non c'è nessun costrutto Markdown per esso. Compare una o due volte in un file, un lettore vede cosa fa, e rimuoverlo perderebbe significato piuttosto che decorazione.

### Dove è un campanello d'allarme

L'HTML grezzo ti sta dicendo qualcosa quando si presenta così:

- **Contenitori attorno a prosa ordinaria.** `<div class="callout">` con tre paragrafi normali dentro. Stai reimplementando un modello dentro il contenuto, e ora ogni documento che vuole un callout dipende da una classe CSS che vive da qualche altra parte.
- **Stili inline.** `<span style="color: #c00">` in un paragrafo. Hai messo presentazione in un file il cui intero valore era escludere la presentazione, e sarà sbagliato nel momento in cui la pagina avrà un tema scuro.
- **`<br>` usato per controllare la spaziatura.** Di solito un segnale che il vero problema è come si comportano i ritorni a capo e le liste piuttosto che una funzione mancante.
- **Sezioni intere in HTML.** Se due terzi del file sono markup, è un file HTML con un po' di Markdown dentro. Rinominalo e smetti di far finta.
- **Tabelle in HTML senza motivo strutturale.** Se la tabella è una griglia semplice e qualcuno l'ha scritta in HTML per lo stile, quello stile appartiene al modello.
- **Qualunque cosa che si esegua.** `<script>`, `onclick`, URL `javascript:`. Un documento che esegue codice non è un documento.

Seguono due conseguenze pratiche.

La prima è la portabilità. L'HTML grezzo passa in modo pulito all'output HTML e in nessun altro. Converti quel file in un PDF, un documento Word, testo semplice o una vista da terminale, e l'HTML o scompare, o appare come parentesi angolari letterali, o rompe il convertitore. Più HTML grezzo c'è in un file, più il file si è impegnato in silenzio verso un solo formato di output.

La seconda è la sicurezza, e non è teorica. Perché Markdown permette HTML grezzo, un file `.md` può portare un tag `<script>`, un gestore `onerror` o un link `javascript:`, e un convertitore fedele consegna tutti e tre al browser. Per i tuoi appunti personali questo non conta. Per un README di un repository che non hai scritto, un documento mandato da un cliente, o contenuto inviato dagli utenti, decide se la tua pagina attacca chi la legge — motivo per cui [sanificare è un passaggio separato con regole proprie](/blog/sanitising-markdown-safely) piuttosto che qualcosa che puoi assumere faccia un convertitore. Alcuni parser sfuggono l'HTML grezzo di default e alcuni lo lasciano passare; devi sapere quale stai usando.

Una regola di casa praticabile: l'HTML grezzo è permesso per gli elementi che Markdown non può esprimere, e non è permesso per l'aspetto. Se qualcuno deve aggiungere una classe CSS per farlo apparire giusto, appartiene al modello.

## Revisione, collaboratori e longevità

Questi tre argomenti ricevono meno attenzione della sintassi e decidono più casi reali.

### Il diff della prosa

Il controllo di versione fa il diff delle righe. È il fatto singolo più decisivo su scrivere documenti in un repository, e spiega la maggior parte del vantaggio di Markdown.

In Markdown, cambiare una frase cambia le parole in quella frase. Un revisore vede la vecchia formulazione e la nuova affiancate e può giudicare se è un miglioramento. In HTML, la stessa modifica può arrivare avvolta in attributi cambiati, un blocco rientrato di nuovo o un `</p>` spostato, e il lavoro del revisore diventa archeologia. Peggio, l'HTML tenta la gente a riformattare, e un commit di riformattazione che cambia anche tre parole è un commit che nessuno revisiona davvero.

Due tecniche rendono i diff di Markdown ancora migliori, e nessuna delle due è disponibile in un file pesantemente marcato:

- **Una frase per riga.** Vai a capo ai confini delle frasi piuttosto che a una colonna. Una frase cambiata diventa allora un diff di una riga, e spostare una frase è uno spostamento piuttosto che la riscrittura di un paragrafo. Sembra strano nel file grezzo per circa un giorno.
- **Diff a livello di parola.** `git diff --word-diff` mostra parole cambiate piuttosto che righe cambiate, il che trasforma un paragrafo riformattato da un muro di rosso e verde in una manciata di sostituzioni.

Nessuno dei due trucchi salva l'HTML, perché in HTML il rumore non è spaziatura, è struttura.

### Chi altro deve modificare il file

Chiediti onestamente chi tocca il file dopo di te, poi abbina il formato alla persona meno tecnica su quella lista. È un vincolo di progettazione, non una cortesia.

| Secondo autore | Cosa gli si può chiedere di fare |
| --- | --- |
| Lo stesso sviluppatore | Qualunque cosa. Il formato è una preferenza |
| Un altro sviluppatore, più avanti | Markdown. Non imparerà i tuoi nomi di classe per correggere un errore di battitura |
| Un product manager o un tecnico del supporto | Markdown, con un'anteprima disponibile. Le modifiche in HTML verranno evitate o rotte |
| Un avvocato o una squadra finanziaria | Nessuno dei due: lavoreranno in Word, e qualcuno converte |
| Un traduttore | Markdown, e ti ringrazierà — il markup attorno al testo è dove vivono gli errori di traduzione |
| Il pubblico, via pull request | Markdown, sanificato. I contributi in HTML sono un carico di revisione e una superficie di sicurezza |

Il modo in cui HTML fallisce non è che la gente lo modifichi male. È che non lo modifica affatto. Ti manda un messaggio per chiederti di cambiare una parola, oppure non cambia niente e lascia che il documento diventi obsoleto. Ogni insieme di documentazione morto per obsolescenza è morto in parte per un formato che rendeva rischiosa anche una piccola correzione.

### Longevità

Un file Markdown è un file di testo che si legge correttamente senza nessun software. Aprilo in Blocco note fra quindici anni e i titoli saranno ancora visibilmente titoli. È una proprietà inusuale, e viene dal rifiuto del formato di codificare l'aspetto.

Anche l'HTML è duraturo — i browser continuano a rendere markup vecchio, e un file HTML autosufficiente con gli stili incorporati è uno dei formati di documento a lungo termine migliori che esistano. I problemi vengono da quello da cui l'HTML moderno tende a dipendere piuttosto che dall'HTML stesso: un foglio di stile su un CDN che smette di risolversi, un font da un servizio che ha cambiato i termini, uno script da un pacchetto che non esiste più, nomi di classe che non significano niente senza il framework che li ha definiti. Una pagina che recupera quattro cose dalla rete è a quattro guasti futuri dall'essere illeggibile.

Quindi la classifica sulla longevità è: fonte Markdown prima, HTML autosufficiente secondo, HTML con dipendenze esterne lontano terzo, e qualunque cosa richieda un sistema di build solo per essere renderizzata all'ultimo posto. È un altro argomento per tenere Markdown come fonte di verità e trattare HTML come output — la cosa durevole è il file che puoi ancora leggere, e quella sacrificabile è il file che puoi rigenerare.

## Dove fallisce “scrivi Markdown e converti”, e cosa costa

Il consiglio abituale di questa pagina è quello giusto la maggior parte delle volte. Vale la pena essere specifici su quando non lo è, perché il fallimento raramente è drammatico — è un accumulo lento di soluzioni improvvisate finché qualcuno non nota che la pipeline costa più di quanto valgano i documenti.

**Quando l'output viene modificato a mano.** Nel momento in cui qualcuno apre l'HTML generato e ci corregge qualcosa, il Markdown smette di essere la fonte di verità e hai due file divergenti. La conversione successiva scarta in silenzio la loro correzione. È il modo più comune con cui un flusso di lavoro Markdown-a-HTML marcisce, e la sola difesa è una regola per cui i file generati non vengono mai modificati, applicata metttendoli da qualche parte visibilmente sacrificabile.

**Quando il design richiede controllo per singolo elemento.** Se il brief include “questa citazione in evidenza è larga il 60%, allineata a destra, con il colore del marchio del cliente dietro”, Markdown combatterà per ogni elemento. Puoi esprimerlo con HTML grezzo e stili inline, e a quel punto hai un file HTML con passaggi in più. Costo: ore di soluzioni improvvisate, e un file che nessuno può mantenere.

**Quando l'esattezza è contrattuale.** Qualunque cosa con un layout specificato — un deposito regolatorio, un formato di fattura che il sistema di un cliente analizza, un certificato con un riquadro firma che deve stare in una posizione fissa. Costo: tutto il percorso di rendering deve essere controllato, e il controllo Markdown di un percorso di rendering è il controllo di un modello, un passo indietro.

**Quando il canale ha un suo dialetto.** L'email, trattata sopra. Anche il rich text in-app memorizzato come HTML, e qualunque cosa consumata da un sistema che si aspetta markup specifico. Costo: l'output pulito e conforme agli standard di un convertitore è esattamente l'output sbagliato.

**Quando il documento è interattivo.** Nessuna quantità di conversione produce comportamento. Costo: nullo, se te ne accorgi presto. Notevole, se scrivi quaranta pagine di Markdown prima di scoprire che la sezione 9 ha bisogno di un modulo funzionante.

**Quando il dialetto si sposta.** Il tuo Markdown si rende correttamente sull'host del codice e in modo scorretto nella build, perché i due usano parser diversi. Note a piè di pagina, liste di attività, rientro delle liste annidate e autolink sono i sospetti abituali. Costo: una classe di bug che appare solo nell'output pubblicato, il posto peggiore per trovarne uno.

**Quando il file è davvero enorme.** Un singolo documento di molti megabyte è un pessimo adattamento per una conversione lato browser, e superata una certa soglia è un pessimo adattamento per essere un documento solo. Costo: dividilo, o sposta la conversione in un passaggio di build dove la memoria non è un limite di una scheda.

**Quando la pipeline stessa diventa il lavoro.** Un convertitore, un modello e uno script vanno bene. Quattro convertitori, una catena di plugin, un filtro Lua personalizzato e un container per farlo girare sono un progetto, e il progetto ha bisogno di un proprietario. Costo: chi lo possiede non può andarsene senza un passaggio di consegna, e le pipeline di documentazione hanno il vizio di finire possedute dall'unica persona che capiva il modello.

Nessuno di questi è un argomento contro Markdown per la prosa. Sono un argomento per notare, prima di iniziare, quale dei due lavori — scrivere o presentare — domina il file.

## Come scegliere

Cinque criteri, ciascuno con la conseguenza attaccata.

1. **Nomina l'artefatto finale prima della prima riga.** Se è una pagina web, un PDF o un file in un repository, scrivi Markdown; se è un'email, un documento stampato con layout fisso o un'interfaccia, scrivi HTML. Sbagliare questo costa una riscrittura, e la riscrittura arriva sempre più tardi di quanto dovrebbe.
2. **Abbina il formato alla persona meno tecnica che lo modificherà.** Se un tecnico del supporto o un traduttore deve correggere una frase con breve preavviso, HTML significa che ti chiederanno di farlo tu, e il documento andrà fuori data tra una richiesta e l'altra.
3. **Assumi che ogni modifica verrà revisionata da qualcuno di fretta.** Markdown fa apparire una frase cambiata come una frase cambiata; HTML la fa apparire come un file cambiato, e i revisori approvano quello che non riescono a leggere.
4. **Conta le parti interattive.** Un blocco `<details>` è una via d'uscita; un modulo, una striscia di tab o un grafico significa che il documento è un'applicazione e Markdown è il formato fonte sbagliato per esso.
5. **Decidi chi possiede lo stile, e scrivilo.** Se è il modello, tieni la presentazione completamente fuori dal contenuto; se è chi scrive, hai scelto HTML che l'estensione del file lo dica o no — e la prossima persona che modifica quel file erediterà il tuo CSS insieme alla tua prosa.

## Conclusione

Scrivi Markdown per default, convertilo, e tieni l'HTML come un prodotto di build che non modifichi mai — quell'assetto ti dà prosa revisionabile, editor che non hanno paura del file, e output che si apre ovunque, che è la maggior parte di quello che la gente vuole da un flusso di lavoro documentale. Passa a HTML deliberatamente e completamente quando la destinazione lo richiede: modelli di email che devono sopravvivere al motore di rendering proprio di un client di posta, documenti il cui layout di pagina è parte della specifica, e qualunque cosa con cui il lettore interagisce piuttosto che leggere. Quando il passaggio che ti serve è quello ordinario — Markdown in entrata, una pagina completa e autosufficiente in uscita, niente caricato — [TransformPipe lo fa nel browser](/), gratis e senza installazione; quando è una delle eccezioni, spendi il tempo in HTML e smetti di scusartene.

## Domande frequenti

### Markdown è meglio di HTML?

Nessuno dei due è migliore; rispondono a domande diverse. Markdown è un formato di scrittura ottimizzato per chi modifica testo e revisiona cambiamenti, e HTML è un formato di consegna ottimizzato per il controllo su cosa rende un browser o un client. L'assetto comune — scrivi Markdown, converti in HTML — usa ciascuno per il lavoro in cui è bravo.

### Posso usare HTML dentro un file Markdown?

Sì. Il Markdown originale permetteva HTML grezzo per progetto e CommonMark specifica come si comporta, quindi un blocco `<details>`, un iframe o una tabella con celle unite possono stare in mezzo a un documento Markdown. Usalo per elementi che Markdown non può esprimere, non per l'aspetto, e sappi che l'HTML grezzo sopravvive solo alla conversione in HTML — altri formati di output lo scarteranno o lo stravolgeranno.

### Markdown è sicuro se può contenere HTML?

Solo se qualcosa lo sanifica. Perché l'HTML grezzo è permesso, un file `.md` può portare `<script>`, `onerror=` o un URL `javascript:`, e un renderer fedele li consegnerà tutti al browser. Alcuni parser sfuggono l'HTML grezzo di default e altri lo lasciano passare, quindi controlla quale comportamento ha il tuo prima di convertire un file che non hai scritto tu.

### Dovrei scrivere il mio sito in Markdown o in HTML?

Scrivi il contenuto in Markdown e il modello in HTML. Ogni generatore di siti statici funziona così per un motivo: scrivere a mano il markup per cento pagine è sgradevole e incoerente, mentre scrivere a mano un modello è una quantità di lavoro normale. Le pagine che sono soprattutto interfaccia piuttosto che prosa — una tabella prezzi con un interruttore, un flusso di iscrizione — sono l'eccezione e appartengono all'HTML.

### Perché non posso controllare il layout in Markdown?

Perché il layout è presentazione, e Markdown è stato progettato per escludere la presentazione così che un file potesse rendersi in modo sensato in un terminale, un editor, un host di codice e una pagina convertita. Non c'è sintassi per colonne, interruzioni di pagina o larghezze, e aggiungerla tramite HTML inline lega il documento a un solo formato di output. Se il layout fa parte del requisito, quello è il segnale per scrivere HTML.

### Convertire Markdown in HTML fa perdere qualcosa?

La struttura sopravvive; qualunque cosa il dialetto non supporti non sopravvive. Tabelle, liste di attività, testo depennato e autolink hanno bisogno di GitHub Flavored Markdown piuttosto che del CommonMark puro, e note a piè di pagina, liste di definizioni e formule matematiche sono estensioni che molti parser ignorano. Converti un file rappresentativo e controlla le tabelle e le liste prima di impegnarti con uno strumento.

### Quale formato dovrebbe usare la documentazione se la squadra non è tecnica?

Markdown, ma solo con un'anteprima davanti — un editor Markdown, un wiki che si rende mentre digiti, o un'anteprima di pull request. Chiedere ad autori non tecnici di scrivere sintassi che non possono vedere resa è il motivo per cui alcune squadre concludono che Markdown non funziona per loro, quando il vero problema era l'anteprima assente — e se la risposta è che la squadra preferirebbe restare del tutto in Word, [quale dei due formati dovrebbe possedere la fonte](/blog/markdown-vs-docx-for-documentation) è la decisione da chiudere prima di qualunque strumento.
