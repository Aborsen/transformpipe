---
title: "Da Markdown a testo semplice: via la sintassi, restano le parole"
description: "Convertire Markdown in testo semplice senza romperlo: perché una regex si rompe su fence, escape, tabelle e link di riferimento, e cosa fanno Pandoc, remark e lynx"
date: 2026-08-23
tag: Conversione
keywords: markdown in testo semplice, convertire markdown in testo, togliere la formattazione markdown, markdown in txt, pandoc testo semplice, conteggio parole markdown, da markdown a testo
---

### In breve

Usa un parser, mai un'espressione regolare: i blocchi di codice tra fence, gli escape con la barra inversa, le tabelle, i link di riferimento e i blocchi HTML grezzi rompono tutti il pattern matching, e lo rompono in silenzio. Per un documento intero, `pandoc -t plain` è la strada corretta più breve, con `--wrap=none` quando l'output finisce in un diff o in un grep. Dentro una build JavaScript o Python, percorri lo stream di token che stai già analizzando — `strip-markdown` per remark, `md.parse()` per markdown-it — perché ogni elemento richiede una decisione e le decisioni dovrebbero essere visibili nel tuo codice. Rendere in HTML e poi appiattirlo con `lynx -dump` o con il pacchetto `html-to-text` è l'altra strada onesta, e la sola che gestisce l'HTML grezzo come si deve.

Markdown è pensato per essere leggibile come testo, ed è esattamente per questo che si sottovaluta questa conversione. Il file sembra già prosa. Togli qualche asterisco, elimina i cancelletti, ed è testo semplice — questa è l'intuizione, e sopravvive al contatto con circa quattro file.

Poi ne incontri uno con un blocco Python tra fence pieno di `*args`, una tabella i cui numeri hanno senso solo accanto alle intestazioni di colonna, un gruppo di link di riferimento definiti in fondo, e un elemento `<details>` che avvolge metà del contenuto. Adesso ogni asterisco che togli è una decisione. Alcuni sono formattazione. Alcuni sono il codice di qualcuno. Uno è sfuggito con un escape, e significa un asterisco letterale sulla pagina.

La vera domanda non è come eliminare il markup. È cosa fare con l'informazione che il markup portava. Un'intestazione è un'intestazione per la sua dimensione; in un file `.txt` non c'è dimensione. Una voce di elenco è una voce per il suo punto elenco; togli il punto e tre voci si fondono in una sola frase che dice qualcosa che nessuno ha scritto. Questo è il compito: non eliminare, ma scegliere cosa porta la struttura quando non resta più markup a portarla.

## Confronto rapido: il bigliettino

| Strada | Ideale per | Di cosa ha bisogno | Cosa succede alle tabelle | Licenza e prezzo |
| --- | --- | --- | --- | --- |
| `pandoc -t plain` | Un documento intero, con fedeltà | Un'installazione di Pandoc | Resta una tabella di testo, riempita con spazi | Gratis, GPL |
| `pandoc -t plain --wrap=none` | Confrontare prosa con un diff, grep, una riga per paragrafo | La stessa | Lo stesso | Gratis, GPL |
| remark + `strip-markdown` | Un passaggio in una build Node | Node, tre pacchetti | Rimossa del tutto, di default | Gratis, MIT |
| `mdast-util-to-string` | Una stringa sola per un campo di indice di ricerca | Node, un parser Markdown | Testo delle celle concatenato senza separatore | Gratis, MIT |
| Token di markdown-it | Già rendi con markdown-it | Node | Quello che scrivi tu, token per token | Gratis, MIT |
| Token di markdown-it-py | Lo stesso, in Python | Python | Quello che scrivi tu | Gratis, MIT |
| `remove-markdown` | Una riga di anteprima o uno snippet | Node, un pacchetto piccolo | Pipe rimaste nei casi limite | Gratis, MIT |
| Render in HTML, poi `lynx -dump` | Leggere un documento nel terminale | Lynx installato | Disegnata come tabella di testo a `-width` colonne | Gratis, GPL |
| Render in HTML, poi `w3m -dump` | Lo stesso, un renderer diverso | w3m installato | Disegnata come tabella di testo a `-cols` colonne | Gratis, open source |
| `html-to-text` (npm) | La parte testuale di un'email | Node | Un formattatore per selettore, `dataTable` per le tabelle vere | Gratis, MIT |
| `get_text()` di BeautifulSoup | Un'estrazione rapida in Python | Python, bs4 | Appiattito, i confini si perdono senza un separatore | Gratis, MIT |
| `html2text` (Python) | In realtà volevi Markdown | Python | Tabelle pipe Markdown — produce Markdown | Gratis, GPLv3 |
| Il download testo di un convertitore nel browser | Un file solo, subito, senza installare niente | Un browser | La decisione è del convertitore, non tua | Gratis |
| `sed`, `awk`, una regex scritta da te | Niente che tu voglia davvero conservare | Niente | Distrutto in silenzio | Gratis |

Licenze e opzioni come documentate su pandoc.org, github.com e linux.die.net (verificato l'8 settembre 2026).

## Togliere il markup è un insieme di decisioni, non un'eliminazione

Prima di ogni strumento, l'elenco delle decisioni. Ognuna ha una risposta difendibile e una risposta sbagliata per il tuo caso, e un convertitore che non ti lascia vedere le sue scelte le ha fatte comunque.

| Elemento | Cosa portava il markup | Cosa può fare il testo semplice |
| --- | --- | --- |
| Intestazione | Un rango, e una pausa visiva | Una riga propria con righe vuote attorno, le maiuscole, o una sottolineatura di trattini |
| Voce di elenco | "Questa è una di parecchie" | Tenere un marcatore `- `, o perdere il confine fra le voci |
| Voce numerata | Un numero che è contenuto | Tenere il numero; viene richiamato altrove |
| Link | Testo più una destinazione | Solo il testo, il testo con l'URL in linea, oppure un elenco numerato di riferimenti |
| Immagine | Testo alternativo e un file | Il testo alternativo, o niente |
| Tabella | L'associazione fra riga e colonna | Colonne allineate con spazi, una riga per record, o un blocco campo-per-riga |
| Blocco di codice | "Non toccare niente di questo" | Verbatim, mai andato a capo, mai spogliato |
| Citazione | "Lo ha detto qualcun altro" | Tenere `> ` o un rientro; togliendolo diventa una tua affermazione |
| Enfasi | Accento, o un termine definito | Niente, o le maiuscole, o di nuovo gli underscore |
| Nota a piè di pagina | Un marcatore e una nota altrove | Un marcatore `[1]` e un elenco in fondo |

### Le intestazioni

Un'intestazione in testo semplice non ha nessun rango a disposizione. Le risposte più comuni sono: metterla su una riga propria con una riga vuota sopra e sotto e lasciare che sia la posizione a fare il lavoro; scriverla in maiuscolo; oppure sottolinearla con trattini. Nota che la terza risposta ha silenziosamente reintrodotto il markup — una riga di testo con `---` sotto è un'intestazione in stile setext, Markdown valido, e il tuo file `.txt` torna a essere un documento.

La sola posizione è la scelta più sicura e la più debole. Un documento con sei livelli di annidamento si appiattisce in un flusso dove un H2 e un H4 sembrano identici, e un lettore quattro schermate più in basso non riesce a dire in che sezione si trova. Se la gerarchia è il contenuto — una specifica, un contratto, un runbook — numera le intestazioni prima di appiattire, perché i numeri sopravvivono dove le dimensioni no.

### Gli elenchi

Tieni il punto elenco. Questo sorprende chi vuole "niente markup per niente", ma `- ` e `* ` erano convenzioni di elenco in testo semplice nelle email molto prima che Markdown esistesse, e si leggono come elenchi sia per una persona che per la maggior parte dei tokenizzatori. Toglili e le voci consecutive si concatenano: tre voci che dicono "controlla il disco", "riavvia il servizio", "apri un ticket" diventano una riga sola che si legge come un'unica istruzione.

Gli elenchi numerati sono più severi. Il numero è contenuto, non decorazione, perché qualcos'altro nel documento dice "se il passo 3 fallisce". Un convertitore che rinumera, o che scarta i numeri a favore dei punti elenco, ha cambiato il documento. Anche l'annidamento ha bisogno che il suo rientro sia conservato, il che costa colonne sul margine destro — e se stai anche andando a capo a 72 caratteri, il rientro deve uscire da quel budget. [La distinzione fra elenchi larghi e stretti](/blog/markdown-line-breaks-and-lists) decide se le voci hanno righe vuote fra loro, e vale la pena deciderla apposta invece di ereditarla.

### I link

Tre opzioni, non una quarta. Togli l'URL e tieni il testo, che è breve e lascia il lettore incapace di seguire qualsiasi cosa. Tieni entrambi in linea come `la guida al deploy (https://example.com/docs/deploy)`, che è completo e trasforma qualunque frase con un URL di tracciamento in un pasticcio. Oppure raccoglili come riferimenti numerati in fondo, che è quello che fa Lynx di default e che il suo flag `-nolist` disattiva.

Scegli in base a chi consuma il testo. Per un'email che una persona legge, l'elenco di riferimenti in fondo è la versione educata. Per un indice di ricerca, togli del tutto gli URL — indicizzare `utm_source=newsletter` non aiuta nessuno, e i token che aggiunge competono con le parole che contano. Per un conteggio di parole, togli anch'essi, o il conteggio include un URL di 120 caratteri come una sola parola e uno abbreviato come cinque.

### Le tabelle

Questa è la decisione che non si può rimandare, e quella su cui più strumenti sbagliano per il tuo caso. Le colonne allineate sembrano giuste, e lo sono solo in un font monospaziato a una larghezza non inferiore alla riga più lunga; spedite in un client di posta che usa un font proporzionale, l'allineamento crolla e i numeri si mescolano. Una riga per record con un separatore sopravvive a qualunque larghezza e perde l'associazione con l'intestazione dopo che la prima riga scorre via. Un blocco campo-per-riga — `Regione: EMEA`, `Costo: 40`, una riga vuota fra i record — è prolisso, si legge correttamente a qualunque larghezza, ed è la sola versione che ha senso letta ad alta voce.

Qualunque tu scelga, controlla cosa ha fatto il tuo strumento prima di fidartene, perché [le tabelle sono la prima cosa a rompersi in qualunque conversione](/blog/markdown-tables-that-survive-conversion) e il fallimento sembra un successo. E ricorda che le tabelle a pipe non sono nella specifica CommonMark: sono arrivate con [GitHub Flavored Markdown e le altre varianti](/blog/commonmark-gfm-and-the-flavours) — quindi un parser che segue CommonMark stretto non ha mai visto una tabella. Ha visto un paragrafo pieno di caratteri pipe, e ti restituirà esattamente quello.

### Codice, citazioni e il resto

I blocchi di codice escono verbatim o escono sbagliati. Nessun a capo — un comando di shell andato a capo è un comando di shell rotto. Nessuna rimozione al loro interno, mai, per motivi che la prossima sezione tratta a lungo. Per alcune destinazioni la risposta giusta è togliere il codice del tutto: un campione di codice da 400 token su una pagina di 600 parole dominerà un indice di ricerca e farà corrispondere la pagina a query su cui non ha niente da dire. [Cosa è davvero un blocco tra fence](/blog/code-blocks-in-markdown) conta qui, perché ci sono più modi di scriverne uno di quanti ne conoscano la maggior parte degli strumenti che tolgono la formattazione.

Le citazioni hanno bisogno che il loro `> ` o il rientro siano conservati. Togliere il marcatore trasforma una citazione in una tua affermazione, che è un cambio di significato e non di formattazione. Le immagini si riducono al loro testo alternativo o a niente, e se il testo alternativo è vuoto — un'immagine decorativa, marcata correttamente — l'output onesto è niente del tutto.

## Perché la regex che stavi per scrivere è sbagliata

Lo schema è sempre lo stesso. Qualcuno scrive sei sostituzioni, le prova su un README, le spedisce, e undici mesi dopo alla fattura di un cliente manca una riga. Le espressioni regolari non possono analizzare Markdown perché Markdown è sensibile al contesto: cosa significa un carattere dipende da in quale blocco si trova, e un pattern non ha idea di in quale blocco si trovi.

Ecco i cinque casi che la rompono, nell'ordine in cui ti morderanno.

### Il codice tra fence

Un fence non è un paragrafo, e niente al suo interno è markup. `*args` e `**kwargs` di Python, `#include` del C, un glob di shell `*.log`, un diff le cui righe iniziano con `-`, un identificatore snake_case pieno di underscore, una pipeline di shell fatta di caratteri `|` — uno strumento che rimuove i marcatori di enfasi in modo globale li corrompe tutti. Questo è peggio che lasciare il markup dentro, perché l'output continua a dichiararsi codice ed è ora sbagliato. Nessuno se ne accorge finché non lo esegue.

Il fence stesso è più vario di quanto il pattern naïf si aspetti:

```text
~~~js
const total = a | b;
~~~
```

CommonMark permette tre o più backtick oppure tre o più tilde, una stringa informativa dopo la sequenza di apertura, e fino a tre spazi di rientro prima. Un fence può contenere sequenze più corte del suo stesso carattere senza chiudersi. Dentro una voce di elenco è rientrato alla colonna di contenuto della voce. E separatamente da tutto questo, quattro spazi di rientro iniziale sono già di per sé un blocco di codice, senza nessun fence. Una regex calibrata su tripli backtick a inizio riga perde i fence a tilde, i fence rientrati e i blocchi di codice rientrati — tre modi per far entrare la gestione del markup dentro il codice sorgente di qualcuno.

### I caratteri con escape

In CommonMark una barra inversa prima di un carattere di punteggiatura ASCII rende quel carattere letterale. `\*non enfasi\*` è prosa sugli asterischi. Uno strumento che rimuove le barre inverse lascia `*non enfasi*`, che il prossimo strumento della catena leggerà come enfasi. Uno strumento che rimuove gli asterischi lascia `\non enfasi\`. Entrambi sono sbagliati, in direzioni opposte, e nessuno dei due errori è visibile in un diff dell'output a meno che non lo stia cercando apposta.

Le entità HTML sono lo stesso problema con un cappello diverso. Un parser decodifica `&amp;` in `&`, `&copy;` nel simbolo del copyright e `&#42;` in un asterisco. Una regex lascia il testo dell'entità dentro il file di testo semplice, così il lettore si ritrova `Smith &amp; Sons` nel corpo di un'email, e il conteggio delle parole conta `&amp;` come una parola. `\\` — una barra inversa con escape — è il caso che coglie in castagna anche la correzione furba, perché adesso serve sapere se la barra inversa in questione era a sua volta sfuggita da quella precedente.

### Le tabelle

Una riga di pipe è una tabella solo se c'è la riga delimitatrice. Senza `| --- | --- |` sotto l'intestazione, è un paragrafo. Con essa, le pipe sono struttura. Un pattern che elimina i caratteri `|` a vista distrugge entrambi i casi: il paragrafo perde la sua punteggiatura, e la tabella diventa una sequenza di parole senza confini. `EMEA 40 3 settimane` erano quattro celle con intestazioni, e non c'è modo di recuperare quale numero fosse quale.

Le celle complicano ancora di più le cose. Una pipe dentro una cella è sfuggita come `\|`. Una pipe dentro codice inline non è affatto un delimitatore. I due punti di allineamento — `:---`, `---:`, `:---:` — sono struttura che non porta nessuna parola e deve svanire. E le celle contengono a loro volta markup inline, quindi qualunque cosa sia stata decisa su link ed enfasi si applica anche dentro ogni cella.

### I link di riferimento

La regex di chiunque gestisce `[text](url)`. Markdown ha altre quattro forme di link, e sono tutte comuni nei file scritti a mano:

```text
See the [deployment guide][deploy] and the [runbook].

[deploy]: https://example.com/docs/deploy "Deploy"
[runbook]: https://example.com/docs/runbook
```

La forma di riferimento completa `[text][id]`, la forma collassata `[text][]` e la forma scorciatoia `[text]` puntano tutte a una definizione che può stare centinaia di righe più in là, di solito in fondo al file. Un pattern che conosce solo i link inline lascia le parentesi quadre nella prosa e il blocco di definizioni come un paragrafo finale di URL nudi — che è esattamente la forma di output che sembra a posto a un controllo veloce ed è chiaramente rotta per chi la riceve. Aggiungi gli autolink con parentesi angolari `<https://example.com>`, l'autolinking di URL nudi di GFM, e la sintassi delle immagini che il pattern naïf trasforma in `!alt text`, e il numero di forme da gestire non è cinque, è più vicino a una dozzina.

### I blocchi HTML

Markdown permette HTML grezzo, quindi un file `.md` può contenere qualunque cosa possa contenere l'HTML. In pratica contiene `<details>` e `<summary>` per sezioni comprimibili, `<img>` con un attributo di larghezza, `<br>` per andare a capo dove la sintassi non lo permette, `<sub>` e `<sup>`, intere tabelle `<table>` scritte a mano, e `<!-- commenti -->` che non erano mai destinati alla pubblicazione.

Togliere i tag con un pattern fallisce su tutto questo. `<!-- TODO: controllare questi numeri con l'ufficio legale -->` è un commento che una regex promuoverà volentieri a prosa, in un documento che stai per inviare a qualcuno. Un elemento `<script>` è peggio: togli i tag e il corpo JavaScript diventa un paragrafo. I valori degli attributi si perdono nello stesso modo — uno strumento che rimuove gli intervalli da `<` a `>` deve ancora decidere se il testo di un attributo `alt` sia contenuto, e un pattern non può distinguere un attributo da un nodo di testo. Qualunque cosa coinvolga HTML grezzo in un file che non hai scritto tu appartiene a un vero parser HTML, che è uno degli argomenti più forti a favore della strada rendi-poi-appiattisci più sotto.

C'è un uso onesto per uno strumento basato su regex: una riga di anteprima. Se servono i primi 140 caratteri di un documento per una card o un risultato di ricerca, un asterisco sbagliato è cosmetico e il fallimento è visibile. Ovunque il testo debba essere corretto, usa un parser.

## Dove il testo semplice è davvero l'output giusto

Il testo semplice non è un downgrade dell'HTML. Per diversi compiti è il formato che il sistema ricevente accetta davvero, e dare a quei sistemi Markdown al posto suo è l'errore.

**L'email in testo semplice.** Un'email HTML fatta bene è un messaggio `multipart/alternative` le cui parti sono ordinate dalla meno fedele in su (RFC 2046), il che significa che la parte `text/plain` viene prima di quella HTML. Se costruisci quella parte incollandoci dentro la fonte Markdown, il destinatario legge `**Importante**` e `[la fattura](https://…)` con la punteggiatura in vista. L'RFC 5322 raccomanda righe di non più di 78 caratteri, quindi vai a capo a 72 e lascia spazio per i marcatori di citazione `> ` che una risposta aggiungerà; se vuoi che sia il client a ridisporre i paragrafi da solo, è a questo che serve `format=flowed` (RFC 3676).

**Il conteggio delle parole.** `wc -w` su un file `.md` grezzo conta le pipe delle tabelle, le righe di fence, le definizioni di riferimento e ogni URL come parole. Un file che segnala 900 parole potrebbe essere 700 parole di prosa e 200 di sintassi e codice. `pandoc -t plain file.md | wc -w` dà il numero su cui una persona sarebbe d'accordo, e togliere i blocchi di codice prima di contare lo cambia di nuovo — motivo per cui un conteggio di parole ha senso solo insieme ai flag che lo hanno prodotto.

**L'indicizzazione per la ricerca.** Tokenizzare Markdown grezzo mette `**`, `](` e `https` nell'indice, fa corrispondere le query dentro i campioni di codice, e produce snippet con la sintassi visibile all'utente. Gli strumenti di ricerca dei siti statici evitano il problema indicizzando l'HTML costruito invece della fonte, che è la stessa intuizione vista dall'altro lato: indicizza quello che vede il lettore. Se costruisci l'indice tu stesso, appiattisci prima, e decidi in modo esplicito se i blocchi di codice sono contenuto ricercabile o rumore.

**Il parlato e la lettura ad alta voce.** Un motore di sintesi vocale accetta una stringa. Dagli Markdown e otterrai la punteggiatura letta ad alta voce, oppure marcatori incollati in silenzio alle parole vicine. Vale la pena essere precisi qui, però: sul web, l'HTML semantico batte il testo appiattito ogni volta — uno screen reader vuole intestazioni, elenchi e celle di tabella veri come elementi, e spogliarli in testo rimuove la navigazione su cui il lettore conta. Il caso del testo semplice è per le pipeline che accettano una stringa, non per le pagine che una persona apre.

**L'output nel terminale.** Un messaggio di commit, un testo di `--help`, una riga di log in CI, il corpo di una notifica. Nessuno di questi renderizza il markup, e in tutti finisce comunque del Markdown incollato. Nota che `glow` e `mdcat` fanno il lavoro opposto — renderizzano Markdown per un terminale usando escape ANSI e disegno di riquadri — cosa bellissima da leggere e non un file `.txt`.

**Il confronto della prosa con un diff.** Questo è il caso a cui si arriva per ultimo e che si apprezza più di tutti. Quando due versioni di un documento differiscono solo perché qualcuno ha ridisposto i paragrafi, un diff a righe segnala l'intero paragrafo come cambiato e non dice niente. Converti entrambe le versioni con `--wrap=none` così che un paragrafo sia una riga sola, poi confrontale con `git diff --word-diff`, e quello che appare sono le parole che sono cambiate. Lo stesso trucco rende un `.docx` convertito confrontabile con il Markdown che avrebbe dovuto corrispondergli.

## Gli strumenti, uno alla volta

### Pandoc — la strada corretta più breve

Pandoc ha `plain` come formato di output, quindi il lavoro intero è un comando solo:

```bash
pandoc -t plain notes.md -o notes.txt
```

| Pro | Contro |
| --- | --- |
| Un parser vero, quindi ogni caso della sezione precedente è gestito | Un binario Haskell da installare |
| Andare a capo, colonne e gestione dei commenti sono flag, non codice | Le scelte del suo writer plain sono sue, e solo in parte configurabili |
| Le tabelle sopravvivono come tabelle di testo invece di svanire | Le tabelle allineate hanno bisogno di un font monospaziato per leggersi bene |
| Legge molti formati in ingresso, quindi lo stesso comando serve `.docx` e HTML | Le differenze tra i dialetti Markdown significano che va nominato il reader |

**Prezzo:** gratis, licenza GPL.

**Dettagli tecnici e funzionalità**

- `--wrap=auto` è il default e va a capo a `--columns`, che di default è 72; `--wrap=none` mette ogni paragrafo su una riga sola, e `--wrap=preserve` mantiene gli a capo della fonte (verificato su pandoc.org, l'8 settembre 2026)
- `--strip-comments` rimuove i commenti HTML dalla fonte invece di lasciarli passare
- I link escono come la loro etichetta con l'URL tolto; le immagini escono come il loro testo alternativo tra parentesi quadre; il codice inline esce come stringa nuda; le note a piè di pagina diventano marcatori in stile `[1]` con un elenco in fondo (verificato nel codice del writer su github.com, l'8 settembre 2026)
- L'enfasi e il grassetto escono come testo nudo, a meno che non venga attivata l'estensione `gutenberg`, che riporta gli `_underscore_` per l'enfasi e mette il grassetto in maiuscolo (verificato su github.com, l'8 settembre 2026)
- Nomina il reader quando l'input è GitHub Flavored — `-f gfm` — così le liste di attività e gli autolink si leggono come sono stati scritti

**Per chi è?** Per chiunque converta documenti interi e possa installare un binario. È la risposta di default, e la sola ragione per non sceglierla è che le decisioni devono vivere nel tuo codice.

### remark e `strip-markdown` — un passaggio in una build Node

La pipeline unified analizza Markdown in un albero mdast, e `strip-markdown` è il plugin che lo appiattisce: analizza, spoglia, serializza.

| Pro | Contro |
| --- | --- |
| Un albero vero, quindi niente dipende dal pattern matching | Tre pacchetti e una pipeline ESM da configurare |
| Le opzioni `keep` e `remove` rendono le decisioni esplicite | I default eliminano più di quanto ci si aspetti |
| Si inserisce dentro una build che c'è già | Più lento di un singolo binario per un file solo |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzionalità**

- La sua stessa descrizione dice che rimuove tutto tranne paragrafi e testo
- Di default rimuove blocchi di codice, HTML, separatori tematici, tabelle e front matter YAML o TOML, e conserva il testo alternativo delle immagini (verificato su github.com, l'8 settembre 2026)
- `keep` accetta un elenco di tipi di nodo da lasciare intatti; `remove` accetta tipi di nodo da eliminare o sostituire con un handler
- Perché gira prima di `remark-stringify`, "tenere" una tabella significa che il serializzatore la riscrive come tabella Markdown — tenere i dati e togliere il markup sono due richieste diverse, e la via di mezzo ha bisogno di un handler scritto da te

**Per chi è?** Per i progetti JavaScript che già analizzano Markdown con remark, e per chiunque voglia le decisioni elemento per elemento scritte nella configurazione invece che dedotte dall'output.

### `mdast-util-to-string` — una stringa sola, per le macchine

A volte serve una sola stringa per un campo di indice di ricerca o un estratto, e la struttura non conta. Questa utility ottiene il contenuto testuale di un nodo, preferendo i campi di testo semplice e altrimenti serializzando i figli.

| Pro | Contro |
| --- | --- |
| Una chiamata, una stringa | I figli sono uniti con un separatore vuoto |
| Testo alternativo delle immagini opzionale con `includeImageAlt` | I confini tra i blocchi svaniscono del tutto |
| Piccolissima, e già nell'albero se si usa remark | Non per niente che una persona legga |

**Prezzo:** gratis, licenza MIT.

Il separatore vuoto è la cosa da sapere. Perché la chiamata di unione usa `''`, un'intestazione finisce dritta nel paragrafo che segue: "Prezzi" più "Facciamo pagare per postazione" diventa `PrezziFacciamo pagare per postazione`. Per un campo di indice questo di solito è innocuo, perché il tokenizzatore divide comunque sul confine — ma per uno snippet che un utente vede, o per un conteggio di parole, produce un'assurdità. La correzione è percorrere l'albero da soli e unire i nodi a livello di blocco con una riga vuota.

**Per chi è?** Per chiunque riempia un campo letto da una macchina, e abbia controllato che la concatenazione non conti.

### markdown-it e markdown-it-py — percorrere lo stream di token

Se l'applicazione già renderizza Markdown con markdown-it, il lexer è già disponibile. `md.parse(source, {})` restituisce un array piatto di token con tipi come `heading_open`, `inline`, `fence` e `table_open`, e si emette testo per i tipi voluti.

| Pro | Contro |
| --- | --- |
| Ogni decisione è un ramo di uno switch leggibile | Ogni decisione diventa tua, comprese quelle dimenticate |
| Nessuna seconda dipendenza, e nessun secondo parser in disaccordo col primo | Più codice di un flag |
| Lo stesso modello di token esiste in Python come markdown-it-py | Il layout delle tabelle è tutto da calcolare |

**Prezzo:** gratis, licenza MIT.

**Per chi è?** Per le applicazioni dove l'output deve corrispondere a un formato di casa — un template email specifico, un report a larghezza fissa, una riga di log — e per i team che preferiscono mantenere cinquanta righe di scelte esplicite piuttosto che discutere con i default di un convertitore.

### `remove-markdown` — la regex onesta

Un pacchetto piccolo, basato su regex, che toglie la formattazione Markdown da una stringa. È quello che sembra una versione accurata del pattern che si stava per scrivere, e fallisce sugli stessi casi per gli stessi motivi.

**Prezzo:** gratis, licenza MIT.

**Per chi è?** Per nessuno, per un documento. È una scelta ragionevole per una riga di anteprima, il sottotitolo di una card o il corpo di una notifica, dove il testo è corto, la fonte è propria, e un carattere fuori posto è cosmetico.

### Render in HTML, poi appiattirlo

Due passaggi invece di uno: Markdown in HTML con un vero parser Markdown, poi HTML in testo con un vero consumatore di HTML. Suona dispendioso e invece risolve due problemi insieme. La questione del dialetto è risolta dal parser Markdown, e l'HTML grezzo nella fonte è gestito da uno strumento il cui unico lavoro è l'HTML — cosa che nessuno strumento che spoglia a livello di Markdown può rivendicare.

| Strumento | Cos'è | Comportamento notevole |
| --- | --- | --- |
| `lynx -dump` | Un browser testuale, che scarica l'output formattato su stdout | Va a capo a `-width`, default 80; aggiunge un elenco di link a meno che non venga passato `-nolist`; `-stdin` legge da una pipe su UNIX |
| `w3m -dump` | Un altro browser testuale | `-cols` imposta la larghezza; disegna le tabelle |
| `html-to-text` (npm) | Una libreria costruita per questo | `wordwrap`, `selectors` e `formatters` per selettore CSS, `preserveNewlines`, `ignoreHref`, `hideLinkHrefIfSameAsText`, `dataTable` |
| `get_text()` di BeautifulSoup | L'accessore testuale di un parser HTML Python | Concatena le stringhe; serve passare un separatore o si perdono i confini |

**Prezzo:** Lynx è gratis con licenza GPL; `html-to-text` è gratis con licenza MIT; BeautifulSoup è gratis con licenza MIT. Opzioni citate da linux.die.net e github.com (verificato l'8 settembre 2026).

La strada della libreria è quella da scegliere per l'email, perché `html-to-text` espone le sue decisioni di formattazione per selettore: si dice cosa fa un elemento `a`, cosa fa una `table`, e dove cade l'a capo, e le risposte vivono nella configurazione invece che nelle convenzioni di rendering di un browser. La strada del browser è quella da scegliere per la lettura, perché un browser testuale ha passato trent'anni a decidere come appare un documento in 80 colonne ed è più bravo a farlo di chiunque lo scriva questo pomeriggio.

Entrambi i passaggi costano qualcosa. Si mantengono due conversioni invece di una, e la fase HTML porta le sue convenzioni — Lynx numera i link e aggiunge un elenco di riferimenti, w3m dispone le tabelle a modo suo. Nessuna delle due è sbagliata; entrambe sono sorprese se non erano previste.

### `html2text` — il nome che inganna

Vale la pena nominarlo con precisione, perché è il primo risultato di ricerca e lo strumento sbagliato per questo lavoro. Il pacchetto Python `html2text` si descrive come un convertitore da HTML a testo ASCII semplice e leggibile, che risulta anche Markdown valido. Questo è il punto: l'output è Markdown. `--ignore-links` e `--reference-links` cambiano quanto ne resta, e `--mark-code` avvolge il codice in tag propri, ma qui si sta convertendo [HTML in Markdown](/blog/convert-html-to-markdown), che è un lavoro diverso con strumenti diversi. È gratis, licenza GPLv3.

**Per chi è?** Per chi voleva Markdown. Chi voleva testo dovrebbe guardare la riga sopra.

### Un convertitore nel browser, quando l'installazione è il problema

TransformPipe converte un file Markdown nel browser e offre il risultato come download in testo semplice insieme a HTML e Markdown, senza caricare niente mentre non è stato fatto l'accesso e con un limite di 10 MB per conversione. Le decisioni su intestazioni, link e tabelle sono dello strumento e non tue, che è lo scambio: nessuna installazione, nessun flag, e nessun controllo.

**Prezzo:** gratis.

**Per chi è?** Per chi ha un file solo e nessuna voglia di installare una toolchain Haskell per appiattirlo — un documento da incollare in un ticket, il corpo di un'email, una nota.

## Dove togliere la sintassi fallisce, e quanto costa

Ogni strada qui sopra è un compromesso, e vale la pena essere chiari su quali compromessi sono inevitabili.

**La struttura non ha dove vivere.** Il testo semplice ha un solo canale — la sequenza di caratteri — e deve portare le parole, la gerarchia, l'enfasi e le relazioni tabellari tutte insieme. Una checklist di trenta voci su tre livelli di annidamento si appiattisce in un muro che un lettore non può navigare. Numerare le intestazioni aiuta e non è gratis: viene aggiunto testo che non era nel documento.

**Le tabelle perdono l'associazione, non i dati.** Ogni valore sopravvive; quello che scompare è a quale colonna appartenesse. L'allineamento la conserva, al costo di richiedere un font monospaziato e una finestra larga almeno come la riga più lunga, e non c'è modo di garantire nessuno dei due in un client di posta. Il campo-per-riga la conserva e triplica la lunghezza. Meglio scegliere in anticipo, perché la modalità di fallimento di scegliere tardi è una tabella che sembrava giusta nel terminale ed è arrivata come numeri mescolati.

**I link non possono essere insieme brevi e completi.** Gli URL in linea rovinano la riga; gli URL tolti eliminano la destinazione; un elenco di riferimenti in fondo chiede al lettore di andare a guardare. Non c'è un'opzione che eviti tutti e tre i costi, quindi conviene scegliere il costo che si adatta al lettore che si ha davvero.

**L'enfasi a volte è significato.** Un termine in grassetto al primo uso perché lo si sta definendo, un avvertimento in grassetto in un runbook, una negazione in corsivo — appiattire rimuove il solo segnale che quelle parole differiscano da quelle intorno. Le maiuscole sono il sostituto abituale e si leggono come un urlo. In un documento dove l'enfasi porta un obbligo, questo è un cambiamento al documento.

**Non torna indietro.** Il testo in uscita non è Markdown in entrata. Una volta che l'albero è sparito non si possono ricostruire le intestazioni, e qualunque cosa più a valle voglia struttura dovrà indovinare. Il `.md` resta la fonte di verità e il `.txt` va trattato come un artefatto, da rigenerare invece che modificare.

**Il numero si muove con i flag.** Conteggi di parole, conteggi di caratteri e tempi di lettura dipendono tutti da se i blocchi di codice sono stati tolti, se gli URL sono stati tenuti e se le intestazioni sono state contate. Un conteggio è confrontabile solo con un altro conteggio prodotto dallo stesso comando, il che conta nel momento in cui qualcuno scrive un limite di parole in un contratto.

E il più grande: se il motivo per volere il testo semplice è che il markup è d'intralcio, vale la pena controllare se la risposta è invece l'HTML. Un documento renderizzato conserva le intestazioni, gli elenchi e le celle delle tabelle, si apre ovunque, e non richiede nessuna decisione su cosa porti la struttura. Il testo semplice è l'output giusto quando qualcosa più a valle accetta una stringa. È l'output sbagliato quando il lettore è una persona con un browser.

## Come scegliere

1. **Nomina chi consuma il testo prima dello strumento.** Una persona in un client di posta, un tokenizzatore, un diff, un motore vocale e un terminale vogliono ciascuno un insieme diverso di decisioni, e un convertitore calibrato per uno produce un output leggermente sbagliato per tutti gli altri.
2. **Risolvi prima la questione delle tabelle.** È la sola decisione che non si può rimandare: le colonne allineate impegnano a un font monospaziato e a una larghezza minima, e il campo-per-riga impegna a tre volte lo spazio verticale. Deciderlo dopo aver spedito significa deciderlo di nuovo davanti a un cliente.
3. **Usa un parser, non un pattern.** Qualunque file con un fence, un escape, un link di riferimento o un blocco HTML grezzo romperà un'espressione regolare, e la rompe in silenzio — il testo che ne esce si legge bene e manca una riga, che è il tipo di errore più costoso.
4. **Fissa la larghezza dell'a capo una volta sola, al confine.** `--wrap=none` per i diff e i grep, 72 colonne per l'email, la larghezza del terminale stesso per una CLI. Andare a capo due volte — una nel convertitore e una nel client — è così che un documento finisce con righe di tre parole.
5. **Prova sul file più brutto che c'è.** Quello con l'elenco annidato, il blocco `<details>`, la tabella con una pipe sfuggita in una cella e i link di riferimento definiti in fondo. Quel file decide se uno strumento funziona; un README pulito non decide niente.

## Conclusione

Da Markdown a testo è una conversione piccola con un lungo elenco di decisioni di giudizio, e gli strumenti si dividono in modo netto lungo una linea: i parser lo fanno bene e i pattern lo fanno male in silenzio. Vale la pena ricorrere a `pandoc -t plain` quando serve il documento intero e si può installare un binario, percorrere lo stream di token quando le decisioni devono vivere nel proprio codice e corrispondere a un formato specificato da qualcun altro, e renderizzare in HTML prima di appiattire quando la fonte contiene HTML grezzo scritto da altri. Quando il lavoro è un file solo e l'installazione è l'ostacolo, [un convertitore lato browser](/) restituisce un download in testo senza caricare niente. Qualunque strada si scelga, il Markdown resta la fonte e il testo va trattato come output — e conviene far passare il file peggiore prima di fidarsi dei buoni.

## Domande frequenti

### Come convertire Markdown in testo semplice da riga di comando?

`pandoc -t plain input.md -o output.txt` è la risposta corretta più breve, e va a capo di default a 72 colonne. Si aggiunge `--wrap=none` se l'output finisce in un diff o in un grep, e `--strip-comments` se la fonte contiene commenti HTML che non devono diventare prosa.

### Si può semplicemente usare un'espressione regolare per togliere il Markdown?

Solo dove un errore è cosmetico, come una riga di anteprima o il sottotitolo di una card. Il codice tra fence, gli escape con la barra inversa, le tabelle, i link di riferimento e i blocchi HTML grezzi rompono ciascuno il pattern matching in un modo diverso, e l'output sembra plausibile pur essendo sbagliato, motivo per cui il bug lo trova di solito un lettore e non un test.

### Perché il testo spogliato contiene ancora parentesi o URL nudi?

Quasi sempre sono link di riferimento. Le forme `[text][id]` e `[text]` puntano a definizioni che di solito stanno in fondo al file, quindi uno strumento che gestisce solo `[text](url)` lascia le parentesi nella prosa e le definizioni come un blocco finale di URL. Un parser risolve il riferimento e restituisce l'etichetta, la destinazione, o entrambe, secondo quanto richiesto.

### Un conteggio di parole Markdown è diverso da un conteggio di parole in testo semplice?

Sì, e di solito più di quanto ci si aspetti. Contare il file grezzo include le pipe delle tabelle, le righe di fence, le definizioni di riferimento e ogni URL come parole, quindi un file che segnala 900 parole può essere 700 parole di prosa. Meglio appiattire prima, decidere se i blocchi di codice contano, e registrare il comando insieme al numero.

### Cosa succede alle tabelle quando Markdown diventa testo semplice?

Dipende interamente dallo strumento, e le tre risposte sono: tenerle come tabelle di testo allineate, che hanno bisogno di un font monospaziato; appiattire ogni riga in una linea, che perde l'associazione con l'intestazione; oppure eliminarle, cosa che diversi strumenti fanno di default. Meglio controllare cosa ha fatto lo strumento su una tabella vera prima di fidarsene, perché ognuno di questi risultati sembra un successo a un controllo veloce.

### `html2text` è uno strumento da Markdown a testo?

No, doppiamente. Converte HTML e non Markdown, e il suo output è deliberatamente Markdown valido invece che testo semplice — lo dice la sua stessa documentazione. Se si ha HTML e si vuole testo, `lynx -dump` o il pacchetto `html-to-text` sono gli strumenti giusti; se si ha HTML e si vuole Markdown, `html2text` è esattamente quello giusto.

### Il testo semplice è più accessibile dell'HTML?

Non per niente che una persona apra in un browser. Uno screen reader usa la struttura HTML — le intestazioni per navigare, gli elenchi per contare le voci, le celle di tabella per collegare un valore alla sua colonna — e appiattire il documento rimuove tutto questo. Il testo semplice è l'output giusto per una pipeline che accetta una stringa, come un sintetizzatore vocale o un indice di ricerca, non un sostituto del markup semantico.
