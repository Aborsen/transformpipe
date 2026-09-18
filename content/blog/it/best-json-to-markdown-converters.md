---
title: "I migliori convertitori da JSON a Markdown nel 2026: confrontati e testati"
description: "Confronto tra i modi per trasformare JSON in Markdown leggibile — jq, jtbl, Miller, pandas e il browser — in base alle forme che ognuno gestisce"
date: 2026-09-08
tag: Conversione
keywords: convertire json in markdown, json in tabella markdown online, jq json in markdown, json lines in markdown, json annidato in markdown, json in markdown con python, convertire json in markdown da riga di comando
---

JSON non ha titoli. Non ha nemmeno paragrafi, niente grassetto, nessuna tabella e nessuna lista nel senso in cui Markdown intende la parola. Ha oggetti, array, stringhe, numeri, booleani e null, e questo è tutto il vocabolario. Markdown ha titoli, paragrafi, liste, tabelle e blocchi di codice. Niente in nessuna delle due specifiche dice quale del primo insieme diventa quale del secondo, quindi ogni convertitore da JSON a Markdown si è inventato una risposta, e le risposte differiscono. Questa è la vera differenza tra gli strumenti in questa pagina — non la velocità, non la licenza, ma cosa ognuno ha deciso che i tuoi dati dovrebbero sembrare.

### In breve

Scegli in base alla forma del tuo file, non in base all'elenco di funzioni dello strumento. Un **array di oggetti piatti** — la forma che ha la maggior parte delle risposte API e degli export — è l'unica forma su cui una tabella Markdown è onesta, e quasi tutto qui la tabellerà. Gli **oggetti annidati** sono dove gli strumenti divergono: alcuni appiattiscono le chiavi in nomi di colonna con i punti, alcuni trasformano ogni livello in un titolo finché non finiscono i livelli di titolo, alcuni rinunciano e stampano JSON. **JSON Lines** — un record per riga, che è di solito cos'è un export di log — non è JSON valido, quindi metà di questi strumenti rifiuta il file a priori. Un convertitore da browser prende le decisioni di forma per te e ti dice quali sono; jq, Miller e jtbl ti lasciano deciderle tu sulla riga di comando; pandas è la risposta dentro uno script Python.

## Perché "converte JSON" non ti dice quasi niente

Convertire Markdown in HTML è una traduzione tra due formati di documento che sono ampiamente d'accordo su cosa sia un documento. Convertire JSON in Markdown non è affatto una traduzione. È un'interpretazione, e lo strumento sta indovinando l'intento. `{"name": "Ada", "roles": ["admin", "billing"]}` potrebbe ragionevolmente essere un titolo chiamato Name con un paragrafo sotto, un'etichetta in grassetto e un valore, una tabella a due righe, una lista a punti, oppure una lista di definizioni. Una persona ragionevole scegliebbe diversamente a seconda che quell'oggetto sia un record tra migliaia oppure l'intero file.

Quindi la prima cosa da stabilire su qualunque strumento qui è quali forme riconosce e cosa fa con ognuna. Ci sono solo quattro domande che contano. Cosa succede a un array di oggetti? Cosa succede a un array di valori semplici? Cosa succede all'annidamento, e quanto in profondità lo strumento lo segue prima di fermarsi? E cosa succede a un file che non è affatto un singolo valore JSON?

Le risposte raramente sono sulla prima pagina dello strumento, e sono l'intero prodotto. Un convertitore che trasforma ogni oggetto in una tabella chiave-valore a due colonne renderà un export di 900 record come 900 piccole tabelle. Un convertitore che tabella solo l'array di primo livello trasformerà silenziosamente in stringa un oggetto annidato dentro una cella, quindi una colonna della tua tabella altrimenti leggibile contiene `{"city":"Leeds","postcode":"LS1 1AA"}` in un font proporzionale senza spaziatura fissa. Entrambi gli strumenti "convertono JSON in Markdown". Nessuno dei due risultati è quello che avevi chiesto.

La seconda cosa da stabilire è dove finisce il file. Gli export JSON hanno una probabilità sproporzionata di contenere cose che non incollaresti nella casella di testo di uno straniero: record utente, storici di ordini, risposte API con token dentro, un dump di database che qualcuno ti ha mandato da guardare. Un convertitore che gira nel tuo browser o sulla tua macchina evita che questa domanda si ponga. Uno ospitato no, e la versione onesta di quel compromesso è che dipende del tutto dal file.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| TransformPipe | Leggere un file JSON come documento | Tabelle, sezioni e liste scelte per forma, nel browser, niente caricato | Gratis |
| jq | Decidere tu la forma | Filtra e rimodella JSON; scrivi tu il Markdown | Gratis, MIT |
| jtbl | Una tabella in un terminale, JSON Lines incluso | Legge stdin, `-m` stampa una tabella Markdown | Gratis, MIT |
| Miller (`mlr`) | File grandi e conversione tra formati | Legge JSON e JSON Lines, `--omd` scrive Markdown | Gratis, BSD a due clausole |
| json2md | Costruire un documento, non convertirne uno | Un formato di istruzioni che emette titoli, liste, tabelle, codice | Gratis, MIT |
| pandas + tabulate | Dentro uno script Python | `read_json`, `json_normalize`, `to_markdown` | Gratis, BSD a tre clausole |
| Estensioni VS Code | Il file già aperto | Conversione locale nell'editor; la qualità varia in base all'estensione | Gratis |
| TableConvert | Una tabella incollata in una scheda del browser | Array JSON in tabella Markdown con anteprima dal vivo | Gratis (verificato su tableconvert.com, l'8 settembre 2026) |
| Uno script scritto a mano | Una forma che è tua e stabile | Esattamente la mappatura che vuoi, e nessun'altra | Gratis |
| Un assistente | Un lavoro occasionale che leggerai | Capisce l'intento; eliminerà anche righe in silenzio | Varia |
| Pandoc | Non questo lavoro | Il suo lettore `json` è l'AST proprio di pandoc, non i tuoi dati | Gratis, GPL |

## I migliori convertitori da JSON a Markdown nel 2026

### TransformPipe — ideale per leggere un file JSON come documento

Converte un file `.json` in Markdown nel tuo browser e scegli una resa per forma piuttosto che applicare una regola a tutto. Non serve installazione né account, e senza aver fatto l'accesso il file non viene mai inviato da nessuna parte: viene letto, analizzato e mostrato sulla tua stessa macchina.

| Pro | Contro |
| --- | --- |
| Le regole di forma sono fisse e dichiarate, quindi l'output è prevedibile | Le regole sono dello strumento, non tue: nessun linguaggio di template |
| Legge JSON Lines oltre a JSON, senza che venga chiesto | Un documento alla volta piuttosto che una directory |
| Niente viene caricato quando non hai fatto l'accesso | Il lavoro lo fa il browser, quindi un file molto grande è limitato dalla macchina |
| Converte anche Markdown in HTML, e HTML, Word e CSV di nuovo in Markdown | |

**Prezzo:** gratis. Un account aggiunge storico, condivisione e un'API, anche questi gratis.

**Dettagli tecnici e funzioni**

- Un array di oggetti i cui valori sono tutti scalari diventa una tabella, con le chiavi come colonne — raccolte su ogni riga nell'ordine di prima apparizione, quindi un campo che compare solo nel quarantesimo record ottiene comunque una colonna
- Un array di valori semplici diventa una lista a punti; un array di cose diverse tra loro diventa una sezione numerata ciascuna
- Un oggetto metti le sue chiavi scalari prima come etichette in grassetto, poi dà a ogni chiave annidata il suo titolo, così i fatti superficiali sono leggibili prima che comincino quelli profondi
- Oltre tre livelli di profondità, un valore viene stampato come blocco di codice `json` con recinzione piuttosto che come titolo, perché un titolo a profondità sette non è un titolo
- `null` viene scritto come `null` in corsivo piuttosto che saltato, e un array vuoto lo dice, perché assente e vuoto sono fatti sui dati
- Le chiavi vengono titolate per la visualizzazione: `created_at` e `createdAt` escono entrambe come "Created at"
- La stessa conversione è disponibile da un'API REST, una CLI senza dipendenze, una GitHub Action e un server MCP

**Per chi è?** Chiunque il cui prossimo passo sia "leggi questo" oppure "manda questo a qualcuno". Una risposta API, un export da un panello di amministrazione, un file di log che qualcuno ha attaccato a un ticket — i casi in cui vuoi i dati leggibili in un minuto e non vuoi scrivere uno script o pensare affatto alla forma.

### jq — ideale per decidere tu la forma

jq è un processore JSON da riga di comando scritto in C portabile senza dipendenze runtime. Non ha output Markdown ed è comunque lo strumento che la maggior parte della gente finisce per usare, perché la parte difficile di questo lavoro non è stampare barre verticali — è selezionare i record giusti e appiattirli in righe prima.

| Pro | Contro |
| --- | --- |
| Rimodella qualunque JSON in qualunque altro JSON, che è il vero problema | Nessun output Markdown: costruisci tu le righe |
| Installato ovunque, nessun runtime, un binario | Un suo linguaggio proprio, e una vera curva di apprendimento |
| Si combina con ogni altro strumento tramite una pipe | Un filtro lungo in uno script shell è codice scrivi-e-scorda |
| Gestisce JSON Lines naturalmente, un valore alla volta | Ottenere la riga di intestazione e la separatrice giuste è manuale |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- Un linguaggio di filtro su JSON: selezione, mappatura, raggruppamento, ordinamento e aritmetica
- `@tsv` e `@csv` producono output delimitato, che puoi poi far passare in un passaggio da CSV a Markdown piuttosto che assemblare una tabella a mano
- L'interpolazione di stringhe ti permette di emettere Markdown direttamente — `"| \(.name) | \(.email) |"` per record — con l'intestazione e la separatrice scritte da te
- `--slurp` raccoglie un flusso di valori in un array unico, che è come fai comportare un file JSON Lines come uno JSON normale
- `-r` stampa stringhe grezze invece di JSON tra virgolette, che è il flag che la gente dimentica e poi si chiede perché ogni cella ha virgolette attorno

**Per chi è?** Chiunque conosca già jq, e chiunque il cui file richieda un filtraggio prima di richiedere una formattazione. Se la risposta comporta "solo le richieste fallite, raggruppate per giorno", ti serve jq o qualcosa di simile prima che qualunque convertitore sia rilevante. Si inserisce nello stesso punto di una pipeline di [un passaggio da Markdown a HTML sulla riga di comando](/blog/markdown-to-html-from-the-command-line): uno stadio che fa una cosa al testo.

### jtbl — ideale per una tabella in un terminale, JSON Lines incluso

jtbl è un piccolo strumento Python da riga di comando che legge JSON dall'input standard e lo stampa come tabella. Il suo output predefinito è una tabella da terminale, e `-m` rende quella tabella Markdown.

| Pro | Contro |
| --- | --- |
| Legge un array JSON di oggetti oppure JSON Lines, nessun flag necessario | Solo tabelle: non ha nessun'altra resa |
| `-m` per Markdown, `-c` per CSV, `-H` per HTML | I valori annidati devono essere appiattiti prima che li veda |
| Pensato per le pipe, quindi jq va davanti a esso | Un'installazione Python, quindi non sempre disponibile su un server |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- L'input è JSON passato via pipe su stdin: sia un array JSON di oggetti sia JSON Lines
- I formati di output sono selezionati per flag: tabella testuale di default, Markdown, CSV, HTML oppure una tabella più elaborata a riquadri
- Pensato per stare in fondo a una pipeline `jq`, che è esattamente dove la divisione del lavoro ha senso — jq decide le righe, jtbl le stampa

**Per chi è?** Persone che lavorano in un terminale e vogliono la tabella subito. È la strada onesta più corta da un log JSON Lines a una tabella Markdown che puoi incollare in un ticket.

### Miller (`mlr`) — ideale per file grandi e conversione tra formati

Miller è un processore di dati da riga di comando scritto in Go senza dipendenze runtime. Legge CSV, TSV, JSON e JSON Lines, e scrive Markdown, il che lo rende il raro strumento in cui questa conversione è un formato di output incorporato piuttosto che qualcosa che assembli.

| Pro | Contro |
| --- | --- |
| Markdown è un formato di output di prima classe (`--omd`) | Un suo proprio vocabolario di verbi e flag da imparare |
| Legge JSON Lines direttamente (`--ijsonl`), nessun raccoglimento necessario | Orientato al record: il JSON profondamente annidato ha bisogno di essere appiattito prima |
| Fa streaming, quindi la dimensione del file non è un problema di memoria | Un'installazione, e un terminale |
| Un solo strumento per filtrare, ordinare, tagliare e stampare | Non interattivo: nessuna anteprima, nessun annulla |

**Prezzo:** gratis, licenza BSD a due clausole.

**Dettagli tecnici e funzioni**

- I formati di input includono JSON, JSON Lines, CSV, TSV e dati indicizzati per posizione; `--ijson` e `--ijsonl` nominano quale hai
- `--omd` scrive output Markdown; `--omd-aligned` imbottisce le colonne a una larghezza uniforme così anche il file grezzo è leggibile
- Da Miller 6.11.0, Markdown è supportato come formato di input oltre che di output (verificato su miller.readthedocs.io, l'8 settembre 2026)
- Verbi come `cut`, `filter`, `sort` e `head` girano prima dello scrittore, quindi puoi restringere un grande export alle colonne che vale la pena tabellare nello stesso comando

**Per chi è?** Chiunque abbia un file troppo grande da apire, un export JSON Lines, oppure l'abitudine di convertire tra CSV e JSON già di suo. Se stai per installare un solo strumento da riga di comando per questo, installa questo.

### json2md — ideale per costruire un documento, non convertirne uno

json2md è una libreria JavaScript che trasforma una struttura JSON specifica in Markdown. La distinzione conta più di qualunque altra cosa in questa pagina: non legge il tuo JSON. Legge una descrizione JSON di un documento Markdown, nella sua propria forma, e stampa quel documento.

| Pro | Contro |
| --- | --- |
| Emette una vera struttura di documento: titoli, paragrafi, liste, tabelle, codice, link | I tuoi dati devono essere trasformati prima nella sua forma di input |
| Una piccola dipendenza in un progetto Node | Non è un convertitore per JSON arbitrario, nonostante il nome |
| Estensibile con tuoi convertitori per nuovi tipi di blocco | Solo JavaScript |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- Installato da npm e usato come funzione in Node o in un bundle
- I suoi tipi di blocco documentati coprono da `h1` a `h6`, paragrafi, citazioni, immagini, liste ordinate e non ordinate, blocchi di codice, tabelle, link e linee orizzontali
- L'input è un array di oggetti a una chiave — un titolo, poi un paragrafo, poi una tabella — quindi la mappatura dai tuoi dati a un documento è codice che scrivi tu, e la libreria gestisce l'escape e l'impaginazione

**Per chi è?** Sviluppatori che generano un documento Markdown da dati in un servizio Node: un report notturno, un changelog, un riassunto mandato per email a un team. È lo strumento sbagliato per guardare un file JSON che ti hanno mandato, e quello giusto per produrre un documento da record che conosci.

### pandas più tabulate — ideale dentro uno script Python

pandas legge JSON in un DataFrame e scrive Markdown da esso. `read_json` gestisce l'analisi, `json_normalize` appiattisce l'annidamento in colonne, e `to_markdown` stampa la tabella.

| Pro | Contro |
| --- | --- |
| Appiattimento, filtraggio, ordinamento e tipizzazione tutto in una libreria | Una dipendenza pesante per una tabella |
| `json_normalize` gestisce l'annidamento in modo prevedibile | L'appiattimento moltiplica le colonne rapidamente |
| Già installato nella maggior parte del lavoro sui dati | Solo tabelle: un DataFrame non è un documento |

**Prezzo:** gratis. pandas ha licenza BSD a tre clausole; `tabulate`, che `to_markdown` richiede, è MIT.

**Dettagli tecnici e funzioni**

- `pandas.read_json` per un array JSON di record; `lines=True` per JSON Lines
- `pandas.json_normalize` appiattisce le chiavi annidate in nomi di colonna con i punti, quindi un record con un oggetto `address` diventa colonne `address.city` e `address.postcode`
- `DataFrame.to_markdown()` richiede il pacchetto `tabulate` e restituisce la tabella come stringa
- L'indice è incluso di default, motivo per cui la prima colonna della tua tabella è una sequenza senza nome di `0`, `1`, `2` finché non passi `index=False`
- `tablefmt` viene passato a tabulate, dove `github` è la tabella a barre in stile GFM e `pipe` aggiunge i due punti di allineamento

**Per chi è?** Chiunque sia già in uno script Python o in un notebook. Se il JSON ha bisogno di un'analisi vera prima di diventare una tabella, questo è dove stavi andando comunque — e lo stesso ragionamento che rende [Python un posto sensato per fare il passaggio da Markdown a HTML](/blog/markdown-to-html-in-python) si applica anche qui.

### Estensioni VS Code — ideali se il file è già aperto

Il Marketplace ha estensioni che convertono una selezione JSON in una tabella Markdown, e se il file è già nel tuo editor questa è la strada più corta che esista. È anche l'opzione in cui devi guardare l'estensione piuttosto che la categoria.

| Pro | Contro |
| --- | --- |
| Nessun nuovo strumento, nessun terminale, nessun caricamento | La qualità e la manutenzione variano enormemente |
| Funziona su una selezione, quindi puoi convertire parte di un file | La maggior parte gestisce un array piatto e niente altro |
| La conversione avviene localmente nell'editor | Un'estensione abbandonata è una responsabilità silenziosa |

**Prezzo:** gratis.

**Dettagli tecnici e funzioni**

- Le estensioni girano nel processo dell'editor, quindi un'estensione locale converte localmente — ma controlla, perché alcune chiamano un servizio ospitato
- La maggior parte delle implementazioni prende un array di oggetti e produce una tabella a barre; annidamento, gestione di `null` ed escape delle barre sono dove differiscono
- Il supporto JSON proprio di VS Code — formattazione, folding, validazione dello schema — è separato e non produce Markdown

**Per chi è?** Sviluppatori che convertono un frammento di passaggio. Controlla cosa fa l'estensione con un oggetto annidato e un valore contenente una barra verticale prima di fidartene con qualunque cosa manderai avanti.

### TableConvert — ideale per una tabella incollata in una scheda del browser

TableConvert è un convertitore di tabelle online con una pagina per JSON a Markdown: incolla un array JSON, ottieni una tabella Markdown, modificala in una griglia se vuoi.

| Pro | Contro |
| --- | --- |
| Incolla e vai, con un'anteprima dal vivo | Solo tabelle, da un array di oggetti |
| La sua pagina dichiara che la conversione avviene localmente nel browser | Annidamento e JSON Lines non sono il suo lavoro |
| Una griglia intermedia tra input e output | Uno di molti siti simili, che variano su cosa fanno con i tuoi dati |

**Prezzo:** gratis, senza registrazione richiesta (verificato su tableconvert.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- L'input è un array JSON incollato, un file caricato, oppure una tabella estratta da una pagina
- I formati di output includono Markdown insieme agli altri formati di tabella che il sito gestisce
- La griglia intermedia ti permette di rinominare una colonna oppure cancellare una riga prima di prendere il Markdown

**Per chi è?** Chiunque abbia un array piatto negli appunti e un buco a forma di tabella da riempire. Per un file intero, oppure un file con struttura, un convertitore che legge forme diverse da "array di oggetti" ti farà risparmiare il rimodellamento.

### Uno script scritto a mano — ideale quando la forma è tua e non cambierà

Trenta righe nel linguaggio che già usi, che mappano il tuo JSON al tuo Markdown. Chiunque faccia questa conversione più di due volte finisce qui, e per una forma interna stabile è la risposta giusta.

| Pro | Contro |
| --- | --- |
| Esattamente la mappatura che vuoi, e niente altro | Adesso possiedi tu i casi limite |
| Nessuna dipendenza, nella maggior parte dei linguaggi | Riscritto quando la forma cambia |
| Si adatta al tuo build, alla tua CI, alla tua nomenclatura | Nessun altro nel team conosce le regole |

**Prezzo:** gratis, e costa un pomeriggio.

**Dettagli tecnici e funzioni**

- Ogni linguaggio mainstream analizza JSON nella sua libreria standard, quindi l'analisi non è il lavoro
- Il lavoro sono le quattro decisioni: tabella, lista, sezione, oppure ripiego con recinzione — più l'escape
- Fai l'escape delle barre verticali e dei backslash nelle celle, e sostituisci gli a capo dentro una cella con `<br>`, perché una riga di tabella Markdown non può contenere un'interruzione di riga
- Decidi come appaiono `null`, `""`, `0`, `false` e una chiave mancante, e scrivilo, perché chi legge non può distinguerli da una cella vuota

**Per chi è?** Team con un export ricorrente e un'opinione forte su come dovrebbe leggersi. Non la persona che ha un file oggi.

### Un assistente — ideale per un lavoro occasionale che leggerai

Incollare JSON in un assistente e chiedere una tabella Markdown funziona, capisce cosa significano i dati meglio di qualunque regola, ed è l'opzione meno affidabile qui per qualunque cosa non controllerai.

| Pro | Contro |
| --- | --- |
| Deduce cosa significano i dati, non solo la loro forma | Le righe spariscono e nessuno te lo dice |
| Gestisce con grazia record disordinati e incoerenti | I valori vengono riordinati, riformattati e sistemati |
| Nessuna installazione, nessun codice | I tuoi dati vanno a un servizio a meno che il modello non sia locale |

**Prezzo:** varia in base al servizio e al piano; controlla la pagina del fornitore.

**Dettagli tecnici e funzioni**

- Meglio usato su dati che puoi controllare a occhio: se non puoi contare le righe nell'output, non puoi verificarlo
- Un convertitore deterministico e un assistente sono in disaccordo in un modo utile — fai girare entrambi sullo stesso file e il diff ti mostra quali celle sono state "utilmente" cambiate
- Un server MCP metti una conversione deterministica dentro l'assistente, che è la versione che vale la pena avere: il modello decide cosa convertire, il convertitore decide cosa è l'output
- L'output è Markdown, che deve comunque diventare qualcosa che una persona possa apire — [portare l'output di un assistente su una pagina condivisibile](/blog/ai-output-to-a-shareable-page) è un passaggio a sé

**Per chi è?** Chiunque abbia un caso scomodo occasionale e la pazienza di controllarlo. Nessuno con un report che va a un cliente.

### Pandoc — lo strumento che non fa questo lavoro

Pandoc convertisce tra circa quaranta formati di documento e questo non è uno di essi. Il suo formato di input `json` è "versione JSON dell'AST nativo" — l'albero di documento proprio di pandoc serializzato come JSON, non i tuoi dati. Dargli in pasto una risposta API produce un errore, non un documento.

**Per chi è?** Per nessuno, per questa conversione. Pandoc è la risposta giusta per [Markdown a HTML e i formati intorno](/blog/best-markdown-to-html-converters), e il posto sbagliato dove cercare per JSON.

## Cosa lasciano fuori le tabelle di confronto

Ogni strumento sopra produrrà Markdown da JSON. Cosa decide se il risultato è leggibile è un insieme di decisioni che nessuno di essi annuncia.

**L'array di oggetti piatti è l'unica forma su cui una tabella è onesta.** Una tabella ha una riga per record e una colonna per campo, quindi ha bisogno di record con gli stessi campi e valori che sono cose singole. È quello che di solito sembrano una risposta API, un CSV convertito in JSON e un export di database, motivo per cui ogni strumento qui lo gestisce e motivo per cui tanti si fermano lì. Nel momento in cui un valore è esso stesso un oggetto o un array, la tabella deve mentire: o la cella contiene un frammento di JSON trasformato in stringa, oppure il conteggio delle colonne esplode, oppure i dati annidati vengono scartati. Non c'è una quarta opzione. Uno strumento che appiattisce — pandas con `json_normalize`, la maggior parte degli strumenti CLI con un passaggio di appiattimento esplicito — scegli l'esplosione delle colonne, e un record con tre oggetti annidati può diventare una tabella a trenta colonne che nessuno può leggere. Uno strumento che si rifiuta di tabellare un record con valori annidati scelgli invece le sezioni, che è più lungo e leggibile.

**Gli array di valori semplici sono liste, e trattarli come tabelle è l'errore classico.** `["admin", "billing", "read-only"]` è una lista a punti. Rendere come tabella diventa una tabella a una colonna con un'intestazione senza senso, che è peggio del JSON grezzo. Rendere come stringa unita da virgole dentro la cella di qualcun altro, va bene fino al punto in cui uno dei valori contiene una virgola.

**L'annidamento deve smettere di diventare titoli da qualche parte, e lo strumento scegli dove.** Markdown ha sei livelli di titolo. JSON ne ha quanti vuole. Un convertitore che mappa la profondità sul livello di titolo finisce a sei e poi o blocca tutto quello più profondo su `######`, appiattendo struttura vera in apparenti fratelli, oppure continua a generare markup più profondo che nessun renderer mostra in modo diverso. L'alternativa è fermarsi prima e stampare il sottoalbero restante come blocco di codice con recinzione, che ammette onestamente la sconfitta: la struttura è visibile, indentata, e chiaramente un dump di dati piuttosto che prosa. Il convertitore da browver qui sopra si ferma a tre livelli esattamente per questo motivo. Qualunque cosa faccia il tuo strumento, scoprilo, perché un documento i cui titoli finiscono a profondità sei ha un indice che non significa niente.

**Null, vuoto, mancante e false sono quattro fatti diversi e una cella vuota.** Un convertitore che salta `null` produce una cella indistinguibile da una chiave mancante, che è indistinguibile da una stringa vuota. In un export di ordini, "nessuno sconto applicato" e "campo sconto non presente in questo record" sono cose diverse, e chi legge, guardando due celle vuote, non può recuperare quale sia quale. Questo è il modo di fallire che rende una tabella convertita sottilmente sbagliata piuttosto che ovviamente rotta, e vale la pena controllarlo su un file che conosci prima di fidarti di uno che non conosci.

**JSON Lines non è JSON valido, ed è di solito cos'è un export di log.** Il formato JSON Lines è un valore JSON per riga, UTF-8, terminato da a capo. Ogni riga si analizza; il file nel suo insieme no, perché una sequenza di valori senza un array che li racchiude non è un documento JSON. Quindi sia `JSON.parse` sia `json.loads` fallisono su un file `.jsonl` perfettamente valido, e qualunque convertitore che chiami uno di questi senza un ripiego rifiuta il file con un errore di sintassi che punta alla riga 2. Gli strumenti differiscono nettamente qui: Miller e jtbl leggono JSON Lines nativamente, pandas ha bisogno di `lines=True`, jq vuole `--slurp` per farne un array, e un convertitore da browser che ricade sull'analisi riga per riga legge il file senza che gli venga detto. Se i tuoi dati vengono da una pipeline di log, una coda di messaggi o `docker logs`, questo è la prima cosa da testare e quella con più probabilità di fermarti.

**Barre verticali, backslash e a capo dentro i valori rompono la tabella che hai appena ottenuto.** Un carattere barra verticale termina una cella in una tabella Markdown ovunque comparisca, quindi un valore come `error | retrying` divide una cella in due e sposta il resto della riga. Un a capo dentro un valore non può essere espresso affatto in una riga di tabella — l'unica via è `<br>`, che è HTML nel tuo Markdown. Qualunque convertitore che costruisca tabelle unendo stringhe senza fare l'escape produrrà una tabella che si rende male esattamente per le righe che contengono i dati interessanti, che è un caso specifico del problema generale delle [tabelle che sopravvivono a una conversione](/blog/markdown-tables-that-survive-conversion).

**L'ordine delle chiavi è l'unico ordine che hai, e non è significativo.** Gli oggetti JSON non hanno un ordine di chiave definito nella specifica, anche se ogni implementazione pratica preserva l'ordine nel file. I convertitori quindi emettono le colonne nell'ordine in cui vedono per la prima volta le chiavi, il che significa che l'ordine delle colonne della tua tabella è un incidente di chiunque abbia scritto il serializzatore. Peggio, se record successivi portano un campo che il primo record non aveva, un convertitore che legge solo il primo oggetto per la sua intestazione scarta silenziosamente quella colonna per ogni riga. Raccogliere le chiavi da tutti i record è il comportamento corretto e non quello universale.

**Numeri, date e identificatori smettono di essere se stessi.** Markdown non ha tipi. Un intero lungo resta leggibile; un float come `0.30000000000000004` arriva esattamente come JSON lo ha conservato; un timestamp ISO resta un timestamp ISO a meno che lo strumento non decida di renderlo più bello. Uno zero iniziale in un codice prodotto sopravvive se era una stringa e scompare se era un numero. Niente di tutto ciò è colpa del convertitore e tutto finisce nel tuo documento, quindi una tabella convertita è un'istantanea per la lettura, non un formato di interscambio dati. Se qualcuno ci deve calcolare sopra, mandagli il JSON.

## Come scegliere

1. **Guarda il tuo file prima di guardare gli strumenti.** Aprilo e rispondi a una domanda: è un array di record piatti, oppure un documento annidato? Se è il primo, quasi tutto qui funziona e dovresti scegliere in base alla comodità. Se è il secondo, la maggior parte di questi strumenti produrrà qualcosa di illeggibile e te ne serve uno che renda sezioni piuttosto che uno che renda tabelle.
2. **Testa il caso JSON Lines se c'è qualunque probabilità che si presenti.** Un file `.json` da un'applicazione è di solito un singolo valore; un file `.json` o `.jsonl` da un log, una coda o un export in blocco è di solito un valore per riga. Convertire con l'assunzione sbagliata ti dà nel migliore dei casi un errore di analisi e nel peggiore solo il primo record.
3. **Decidi se l'output serve per leggere o per elaborare.** Una tabella Markdown è un documento. Se il passo successivo è un foglio di calcolo o uno script, converti in CSV invece e salta il giro a vuoto — perderai i tipi in entrambi i casi, e almeno il CSV lo ammette.
4. **Conta le installazioni contro il numero di volte che lo farai.** Un file oggi non giustifica un gestore di pacchetti. Un report notturno non giustifica una scheda del browser e una persona che ci sta dentro. Sbagliare questo al contrario è come un team finisce con un passaggio di conversione non documentato che gira solo su un laptop.
5. **Controlla cosa è successo alle righe scomode, non alle prime tre.** Trova un record con un null, un oggetto annidato, un valore contenente una barra verticale, e un campo che gli altri record non hanno. Convertilo e leggi l'output. Ogni fallimento descritto in questa pagina si mostra in quel singolo test, e richiede due minuti.

## Conclusione

Non c'è un modo corretto di trasformare JSON in Markdown, il che significa che il miglior convertitore da JSON a Markdown è quello le cui decisioni corrispondono al file che hai davanti. Quando la forma che hai è una lista di record, [la strada della tabella è quella da leggere](/blog/convert-json-to-markdown-table). Per un array di record piatti, scegli in base alla comodità: una scheda del browser, una pipe da terminale, oppure tre righe di pandas. Per un documento annidato che devi davvero leggere, scegli uno strumento che renda sezioni e liste piuttosto che forzare tutto in una tabella, e controlla dove smette di trasformare la profondità in titoli. È quello che fa [la conversione da JSON a Markdown di TransformPipe](/json-to-markdown) nel browser, gratis, con le regole fisse e niente caricato quando non hai fatto l'accesso. Per qualunque cosa ricorrente, Miller oppure una pipeline jq in uno script sopravvivranno a qualunque cosa tu costruisca a mano.

## Domande frequenti

### Qual è il miglior convertitore gratuito da JSON a Markdown?

Per un file che vuoi leggere subito, un convertitore lato browser è la migliore opzione gratuita: nessuna installazione, nessun caricamento, e gestisce forme diverse da un array piatto. Sulla riga di comando, Miller e jtbl sono entrambi gratuiti e open source ed entrambi scrivono tabelle Markdown direttamente.

### Come convertire JSON in una tabella Markdown?

Se il tuo JSON è un array di oggetti con valori scalari, qualunque strumento qui lo farà: incollalo in un convertitore da browser, passalo per una pipe con `jtbl -m`, esegui `mlr --ijson --omd cat`, oppure chiama `to_markdown()` su un DataFrame pandas. Se gli oggetti contengono oggetti o array annidati, appiattiscili prima oppure accetta che la tabella conterrà JSON trasformato in stringa in alcune celle.

### Posso convertire JSON annidato in Markdown?

Sì, ma non in una tabella. JSON annidato converte in modo sensato in titoli e sezioni, con ogni livello di annidamento che diventa un livello di titolo finché il convertitore non finisce le opzioni — sei è il limite che Markdown gli dà, e la maggior parte degli strumenti si ferma prima e stampa la profondità restante come blocco di codice con recinzione. Controlla dove il tuo convertitore traccia quella linea prima di convertire un file profondamente annidato.

### Perché il mio file JSON non si convertei?

Più spesso perché è JSON Lines piuttosto che JSON: un valore JSON valido per riga, cosa che il file nel suo insieme non è. Un parser a cui viene dato quel file fallisce sulla seconda riga. Dì al tuo strumento che è delimitato per riga — `lines=True` in pandas, `--ijsonl` in Miller, `--slurp` in jq — oppure usa un convertitore che ricade da sé sull'analisi riga per riga.

### Convertire JSON in Markdown fa perdere dati?

Fa perdere i tipi, e può far perdere distinzioni. Markdown non ha nozione di un numero, una data o un null, quindi tutto diventa testo, e un convertitore che rende `null` come cella vuota lo ha reso indistinguibile da un campo mancante o da una stringa vuota. Tratta il Markdown come qualcosa da leggere e conserva il JSON come il record.

### Pandoc può convertire JSON in Markdown?

No, non il tuo JSON. Il formato di input `json` di Pandoc è il suo proprio AST di documento serializzato come JSON, quindi legge solo file che pandoc stesso ha prodotto. È lo strumento giusto per convertire tra formati di documento e quello sbagliato per i dati.

### Dovrei usare jq oppure un convertitore?

Entrambi, di solito. jq serve per scegliere e rimodellare i record — filtrare, raggruppare, appiattire, selezionare colonne — e un convertitore serve per stamparli. Un filtro jq che assembla anche Markdown a mano funziona e diventa rapidamente ingestibile, quindi lascia le barre verticali e l'escape a qualcosa il cui lavoro è esattamente quello.
