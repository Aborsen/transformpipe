---
title: "JSON in tabella Markdown: cosa converte in modo netto e cosa no"
description: "JSON in una tabella Markdown: la sola forma che funziona, cosa fare con nidificazione, chiavi mancanti e JSON Lines, e quando le sezioni battono una tabella"
date: 2026-09-02
tag: Conversione
keywords: json in tabella markdown, convertire json in tabella markdown, array json in tabella markdown, json annidato in tabella markdown, json lines in tabella markdown, jq appiattire json, json in tabella online
---

### In breve

Una tabella Markdown è onesta su esattamente una forma di JSON: un array di oggetti i cui valori sono tutti scalari, con le stesse chiavi in ogni record. Dagliela e qualunque convertitore farà la cosa giusta. Dagli qualunque altra cosa — un oggetto annidato, un array dentro un campo, record con chiavi diverse — e lo strumento deve scegliere tra trasformare il JSON in una cella come stringa, far esplodere il numero di colonne, oppure perdere dati, e non ti dirà quale ha scelto. Appiattisci deliberatamente prima di convertire, di solito con `jq` o `mlr`, oppure accetta che il rendering onesto sia fatto di sezioni piuttosto che di una tabella.

Hai un file JSON e vuoi una tabella. L'istinto è giusto: una tabella è la forma leggibile più densa per dei record, e una tabella Markdown sopravvive a essere incollata in una pull request, un ticket, una pagina wiki e un'email in un modo che un blocco di codice JSON non fa. Qualcuno può scorrere una tabella con lo sguardo. Nessuno scorre quattrocento righe di JSON formattato.

Il problema è che il modello di dati di JSON e il modello di dati di una tabella non hanno la stessa forma, e si sovrappongono solo a volte. Una tabella è un rettangolo: colonne fisse, una riga per record, un valore per cella. JSON è un albero, di profondità qualunque, senza nessun obbligo che oggetti fratelli concordino su niente. Ogni volta che l'albero non è già un rettangolo, convertirlo in uno butta via qualcosa — e quale cosa venga buttata via è una decisione che il tuo convertitore prende in silenzio, nei due secondi tra il momento in cui rilasci il file e il momento in cui leggi l'output.

Quindi la domanda utile non è "quale strumento converte JSON in una tabella Markdown". Quasi tutti lo fanno, e [il confronto tra loro è un testo separato](/blog/best-json-to-markdown-converters). La domanda utile è quale forma ha il tuo file, cosa fa una tabella a quella forma, e cosa dovresti fare prima al file. Ecco quello che segue, caso per caso, con i comandi.

## Perché una tabella Markdown è una promessa sui dati

Quando dai a qualcuno una tabella, stai affermando tre cose senza dirle a voce alta. Ogni riga è lo stesso tipo di cosa. Ogni colonna significa la stessa cosa in ogni riga. E ogni cella contiene un solo valore.

JSON non garantisce nessuna delle tre. Un array può contenere una stringa, un oggetto e un altro array fianco a fianco. Due oggetti nello stesso array possono non condividere nessuna chiave. Un solo campo può contenere un oggetto con dodici chiavi sotto. Quando una di queste cose è vera e rendi comunque una tabella, la tabella è ancora una tabella — si allinea, ha una riga di intestazione, sembra finita — e ora sta facendo affermazioni che i dati non supportano. È peggio di un output ovviamente rotto, perché nessuno controlla una tabella che si rende bene.

Ecco la forma del fallimento in un esempio. Prendi un record come questo:

```json
{
  "id": 4102,
  "customer": { "name": "Ada Okonjo", "email": "ada@example.com" },
  "items": ["SKU-11", "SKU-40"],
  "discount": null,
  "note": "call before delivery | after 4pm"
}
```

Ogni tabulazione ingenua di quel record è sbagliata in un modo diverso. Metti `customer` in una cella e la cella contiene `{"name":"Ada Okonjo","email":"ada@example.com"}`, che è JSON che finge di essere prosa. Appiattiscilo e ottieni due colonne, `customer.name` e `customer.email`, cosa corretta e che fa iniziare a salire il numero di colonne. Metti `items` in una cella e hai unito una lista con virgole, il che va bene finché un elemento non contiene una virgola. Lascia `discount` vuoto e chi legge non può distinguere "nessuno sconto" da "campo assente". E `note` contiene una pipe, che in una tabella Markdown termina la cella — quindi quella riga ora ha una colonna in più dell'intestazione, e il renderer scarterà l'eccesso oppure sposterà tutto quello che segue.

Un record. Cinque modi distinti per una tabella di essere sottilmente falsa. Moltiplica per il numero di record e hai un documento che sembra autorevole e non lo è.

## Riferimento rapido: quale forma JSON diventa quale Markdown

Questo è il bigliettino. Trova la forma di livello superiore del tuo file nella prima colonna e il rendering che non mente nella quarta.

| Forma JSON | Sembra | Si tabula in modo netto? | Rendering onesto | Fai questo prima |
| --- | --- | --- | --- | --- |
| Array di oggetti piatti, stesse chiavi | `[{"id":1,"name":"a"},{"id":2,"name":"b"}]` | Sì | Tabella: chiavi come colonne, una riga per oggetto | Niente |
| Array di oggetti piatti, chiavi diverse | `[{"id":1},{"id":2,"tier":"pro"}]` | Sì, con lacune | Tabella con l'unione di tutte le chiavi, vuoti segnati | Raccogli le chiavi da ogni record, non solo dal primo |
| Array di oggetti con un oggetto annidato | `[{"id":1,"user":{"name":"a"}}]` | No | Tabella sulle colonne appiattite `user.name` | Appiattisci con `jq`, `mlr flatten`, o `json_normalize` |
| Array di oggetti con un campo array | `[{"id":1,"tags":["x","y"]}]` | No | Tabella più una cella unita, o una riga per tag | Decidi: unire in una cella, o esplodere in righe |
| Array di valori semplici | `["admin","billing"]` | No | Elenco puntato | Niente — non tabellarlo |
| Array di array | `[["a",1],["b",2]]` | Sì, senza intestazione | Tabella con intestazioni inventate o dalla prima riga | Decidi se la prima riga è dato o intestazione |
| Array di cose diverse tra loro | `[1,"two",{"three":3}]` | No | Una sezione numerata ciascuna | Dividi per tipo, o rendi come sezioni |
| Singolo oggetto piatto | `{"name":"a","tier":"pro"}` | Solo come chiave/valore | Tabella a due colonne, o etichette in grassetto | Niente, ma considera un elenco di definizioni invece |
| Singolo oggetto profondamente annidato | un file di configurazione, una busta API | No | Intestazioni per livello, blocco di codice oltre la profondità tre | Trova l'array dentro e tabula quello |
| Oggetto di oggetti, con chiave id | `{"u1":{...},"u2":{...}}` | Sì, dopo un passaggio | Tabella con la chiave come proprio prima campo | `to_entries` per trasformare le chiavi in un campo |
| JSON Lines | un valore JSON per riga | Sì, se letto come righe | Tabella, una volta che il file è letto correttamente | Dì allo strumento che è delimitato per riga |
| Numero, stringa, booleano al livello superiore | `42` | No | Una frase | Niente da convertire |

Due cose da notare. Solo tre righe di quella tabella dicono "sì" senza riserve, e le due forme più comuni nel mondo reale — oggetti annidati e campi array — non sono tra queste. E l'ultima colonna è dove sta il lavoro: la differenza tra una buona e una cattiva tabella Markdown è quasi sempre qualcosa che hai fatto al JSON prima della conversione, non il convertitore che hai scelto.

## La forma di cui una tabella è onesta

Un array di oggetti, ogni valore uno scalare, le stesse chiavi in ogni record. Questa è la forma che restituisce un endpoint API paginato, la forma che diventa un CSV quando qualcuno lo converte in JSON, e la forma che produce un `SELECT` senza join.

```json
[
  { "sku": "SKU-11", "name": "Wide flange", "price": 12.5, "stock": 40 },
  { "sku": "SKU-40", "name": "Narrow flange", "price": 9.0, "stock": 0 },
  { "sku": "SKU-72", "name": "Bracket", "price": 3.25, "stock": 118 }
]
```

Questo converte in questo, e ogni strumento è d'accordo:

```markdown
| sku | name | price | stock |
| --- | --- | --- | --- |
| SKU-11 | Wide flange | 12.5 | 40 |
| SKU-40 | Narrow flange | 9 | 0 |
| SKU-72 | Bracket | 3.25 | 118 |
```

Nota che `9.0` è uscito come `9`. I numeri JSON non hanno nessuna nozione di cifre significative, quindi un serializzatore che legge il file in un tipo numerico e lo scrive di nuovo fuori ti dà la rappresentazione più corta. Se sono prezzi in un documento che qualcuno leggerà, è un fastidio estetico; se è una stringa di versione o un codice prodotto che era numerico per caso, lo zero iniziale o finale è perso per sempre. Un campo che deve conservare la sua forma stampata esatta deve essere una stringa nel JSON, e non c'è niente che il convertitore possa fare in seguito.

Ecco i modi per fare questa conversione, con il comando esatto:

| Strada | Comando o passaggio | Serve |
| --- | --- | --- |
| Browser | Rilascia il file `.json` su una pagina di conversione e leggi la tabella | Un browser |
| Miller | `mlr --ijson --omd cat data.json` | `mlr` installato |
| jtbl | `cat data.json \| jtbl -m` | Python, `pip install jtbl` |
| pandas | `pd.read_json("data.json").to_markdown(index=False)` | pandas e tabulate |
| jq, a mano | costruisci intestazione e righe tu stesso con `@tsv` e `sed` | `jq` e pazienza |
| Foglio di calcolo | JSON in CSV, apri, copia, incolla in un editor consapevole di Markdown | Un foglio di calcolo |

**Per chi è questo:** per chiunque abbia un export da un pannello di amministrazione, un endpoint di elenco, o il risultato di una query. Se il tuo file ha questa forma, smetti di leggere il resto di questa pagina e scegli qualunque riga sopra che richieda il minor numero di installazioni. Non c'è nessuna decisione interessante da prendere.

**Cosa controllare comunque:** le ultime tre righe, non le prime tre. La paginazione significa che i record interessanti sono spesso alla fine, e un convertitore che legge il primo oggetto per la sua intestazione avrà scartato qualunque campo che appare solo più tardi.

## Le forme scomode, caso per caso

Tutto quello che segue è una forma dove la tabella deve rinunciare a qualcosa. Per ognuna c'è un rendering difendibile, uno che non lo è, e un comando che ti porta dall'uno all'altro.

### Un oggetto annidato dentro un campo

```json
[
  { "id": 1, "user": { "name": "Ada", "city": "Leeds" }, "total": 42.0 },
  { "id": 2, "user": { "name": "Ben", "city": "Hull" }, "total": 18.5 }
]
```

Ci sono esattamente tre cose che un convertitore può fare con `user`, e vale la pena sapere quale fa il tuo.

| Approccio | Risultato | Costo |
| --- | --- | --- |
| Trasformare l'oggetto in stringa dentro la cella | `{"name":"Ada","city":"Leeds"}` in una cella | Illeggibile, e una `"` o una `\|` dentro la rompe la riga |
| Appiattire in colonne con punto | `user.name`, `user.city` | Il numero di colonne cresce con ogni chiave annidata |
| Scartare il campo | Tabella con solo `id` e `total` | Perdita di dati silenziosa, e nessun avviso |

Appiattire è la scelta predefinita giusta e la ragione è aritmetica. Un record con tre oggetti annidati di quattro chiavi ciascuno diventa una tabella di quindici colonne, che è leggibile su uno schermo largo e illeggibile in un commento di pull request. Quindi appiattisci, poi seleziona: decidi quali delle colonne appiattite vuoi davvero, e scarta il resto deliberatamente invece di lasciare che lo strumento le scarti per caso.

```bash
mlr --ijson --omd flatten data.json
```

Il verbo `flatten` di Miller trasforma `user.name` in un campo con quel nome, e `--omd` scrive una tabella Markdown. Per scegliere le colonne dopo, aggiungi un `cut`:

```bash
mlr --ijson --omd flatten then cut -o -f id,user.name,total data.json
```

**Per chi è questo:** risposte API, che quasi sempre avvolgono i campi interessanti in una busta o attaccano un record collegato. Questa è la forma reale più comune, e quella dove il default di un convertitore conta di più.

### Un array dentro un campo

```json
[
  { "id": 1, "tags": ["urgent", "billing"] },
  { "id": 2, "tags": [] }
]
```

Un array dentro un campo è una relazione uno-a-molti, e una tabella è un rettangolo. Qualcosa deve piegarsi.

| Approccio | Risultato | Costo |
| --- | --- | --- |
| Unire in una cella | `urgent, billing` | Un valore che contiene il separatore diventa ambiguo |
| Una colonna per posizione | `tags.0`, `tags.1`, `tags.2` | Il numero di colonne è fissato dall'array più lungo; per lo più vuoto |
| Una riga per elemento | `id` ripetuto, un `tag` ciascuno | Il numero di righe si moltiplica; `id` non è più unico |
| Solo il conteggio | `tags` diventa `2` | Perde i valori, conserva la forma |

Unire è quello che fanno la maggior parte dei convertitori ed è di solito corretto per la lettura, a patto che il separatore sia uno che i tuoi valori non possono contenere. `; ` è più sicuro di `, `. Esplodere in una riga per elemento è corretto se la tabella verrà ordinata o filtrata per tag, ed è quello che vuoi se il passaggio successivo è un foglio di calcolo piuttosto che un documento. Le colonne posizionali quasi non sono mai giuste: trasformano la posizione di un elemento in un titolo di colonna, e la posizione in un array JSON non porta nessun significato a meno che qualcuno l'abbia promesso.

Per unire, in jq:

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json
```

Per esplodere, una riga per tag:

```bash
jq '[.[] | . as $row | .tags[] | { id: $row.id, tag: . }]' data.json
```

Quel secondo filtro perde interamente il record con l'array vuoto, perché `.tags[]` su `[]` non produce niente. Se un record senza tag ha comunque bisogno di una riga, conservalo esplicitamente:

```bash
jq '[.[] | . as $row | (if (.tags | length) == 0 then [null] else .tags end)[] | { id: $row.id, tag: . }]' data.json
```

Questa è la forma della maggior parte del lavoro di appiattimento: tre righe di jq per conservare un caso che la riga singola scarta.

**Per chi è questo:** qualunque cosa con etichette, ruoli, permessi, categorie o voci di riga. Se stai convertendo un export di ordini, le voci di riga sono un array dentro un campo e hai questa decisione da prendere che tu la noti o no.

### Record le cui chiavi differiscono

```json
[
  { "id": 1, "email": "a@example.com" },
  { "id": 2, "phone": "+44 20 7000 0000" },
  { "id": 3, "email": "c@example.com", "phone": "+44 20 7000 0001" }
]
```

Una tabella ha bisogno di un'intestazione sola. Questi record hanno tre insiemi di chiavi diversi tra loro, quindi l'intestazione deve essere l'unione — `id`, `email`, `phone` — con vuoti dove un record non porta un campo.

Il fallimento qui è specifico e comune: un convertitore che costruisce la sua intestazione solo dal primo oggetto. Questo produce una tabella a due colonne, e il numero di telefono del record 2 non è affatto nel documento. Nessun errore, nessun avviso, nessuna lacuna nella tabella da notare. Questo è il default più dannoso in tutta quest'area, perché l'output sembra completo.

Controllalo in un comando. Chiedi a jq l'unione delle chiavi e conta le colonne nel tuo output:

```bash
jq -r '[.[] | keys[]] | unique | join(",")' data.json
```

Se quella lista è più lunga della riga di intestazione della tua tabella, il tuo convertitore ha letto il primo record e si è fermato. Cambia strumento oppure forza tu la forma, dando a ogni record ogni chiave:

```bash
jq --argjson cols '["id","email","phone"]' \
   '[.[] | . as $r | reduce $cols[] as $c ({}; .[$c] = ($r[$c] // null))]' data.json
```

Nota che `//` in quel filtro è l'operatore alternativo di jq, non un commento: sostituisce il lato destro quando il sinistro è `null` o `false`. Questo è un pericolo tutto suo — un campo il cui valore reale è `false` verrà sostituito con `null`. Se i tuoi dati hanno booleani, usa un controllo `has` esplicito invece.

| Approccio | Risultato | Costo |
| --- | --- | --- |
| Unione di tutte le chiavi | Ogni campo presente, vuoti dove assente | Tabella larga, sparsa |
| Chiavi dal primo record | Stretta, ordinata, colonne mancanti | Perdita silenziosa di ogni campo successivo |
| Chiavi presenti in ogni record | Solo i campi comuni | Perde le differenze, che spesso sono il punto |
| Raggruppa per insieme di chiavi, una tabella ciascuno | Diverse tabelle oneste | Chi legge deve riconciliarle |

**Per chi è questo:** export da qualunque cosa con campi opzionali — un CRM, un prodotto di modulistica, un flusso di eventi dove il payload varia per tipo di evento. Se i record vengono da percorsi di codice diversi, assumi che gli insiemi di chiavi differiscano finché non hai controllato.

### Un array di valori semplici

```json
["admin", "billing", "read-only"]
```

Questo è un elenco. Renderizzato come tabella diventa una singola colonna con un'intestazione inventata, il che è più markup che contenuto e meno leggibile di quanto era il JSON. Renderizzato come elenco puntato è finito:

```markdown
- admin
- billing
- read-only
```

Il solo caso per una tabella è quando i valori sono coppie di qualcosa, e allora non sono più valori semplici. Se l'elenco è lungo e ordinato, un elenco numerato porta l'ordinamento che un elenco puntato butta via — [la differenza tra un elenco ordinato e non ordinato è anche un'affermazione sui dati](/blog/markdown-line-breaks-and-lists).

**Per chi è questo:** enumerazioni, insiemi di permessi, liste di elementi ammessi. Quasi mai vale la pena un convertitore: una sostituzione lo trasforma in un elenco in meno tempo di quanto ci vuole ad apriere uno strumento.

### Un array di array

```json
[
  ["sku", "name", "price"],
  ["SKU-11", "Wide flange", 12.5],
  ["SKU-40", "Narrow flange", 9.0]
]
```

Questo è un CSV che è passato per un serializzatore JSON, e si tabula perfettamente — con un'ambiguità che niente nel file risolve. La prima riga è un'intestazione, o è un dato che sembra tale per caso? JSON non ha modo di dirlo. Un convertitore deve indovinare, e le due ipotesi producono documenti diversi: uno con `sku | name | price` come intestazione, uno con `Column 1 | Column 2 | Column 3` come intestazione e `sku` come valore nella prima riga.

Guarda il file e decidi, poi dillo allo strumento. Se non si lascia dire, aggiungi tu l'intestazione. Dato che questa forma è in realtà dati tabellari vestiti da JSON, [la strada CSV è spesso più corta](/blog/best-csv-to-markdown-converters): convertí l'array di array in CSV, e usa uno strumento da CSV a Markdown con un flag di intestazione esplicito.

**Per chi è questo:** risultati di query BigQuery e simili, export di foglio di calcolo tramite un'API JSON, qualunque cosa dove un campo `values` contiene righe.

### Un array di cose diverse tra loro

```json
[42, "pending", { "id": 7 }, [1, 2]]
```

Un array eterogeneo non è un insieme di record e nessuna tabella lo descrive. Il rendering onesto è una sezione numerata per elemento, ciascuna rendendo secondo il proprio tipo — un numero come frase, un oggetto come piccola tabella chiave/valore, un array annidato come elenco.

Se un file ti dà questo al livello superiore, di solito è un log misto o un fixture assemblato a mano, e la mossa giusta prima è filtrare per il tipo che ti interessa:

```bash
jq '[.[] | select(type == "object")]' data.json
```

Ora hai un array di oggetti e uno dei casi precedenti si applica.

**Per chi è questo:** quasi nessuno di proposito. Succede in fixture di test, in file modificati a mano, e in flussi di eventi dove chi produce ha cambiato forma tra un rilascio e l'altro.

### Un singolo oggetto che non è affatto una lista

Un file di configurazione, una busta API, un record recuperato per id. Non c'è nessun array da cui fare righe, quindi una tabella può solo essere un elenco chiave/valore a due colonne:

```markdown
| Field | Value |
| --- | --- |
| name | Wide flange |
| price | 12.5 |
```

Questo è leggibile per una manciata di campi scalari e inutile oltre una dozzina, e collassa del tutto nel momento in cui un valore è annidato. Per un singolo record, etichette in grassetto con i valori a fianco si leggono meglio dell'arredamento di una tabella, e la nidificazione diventa intestazioni. Se l'oggetto è una busta — `{"meta": {...}, "data": [...]}` — la tabella che vuoi davvero sta su `.data`, e il primo passaggio è dirlo:

```bash
jq '.data' response.json
```

**Per chi è questo:** chiunque abbia recuperato una cosa sola piuttosto che una lista. Controlla se c'è un array interno prima di accettare una tabella chiave/valore; nove volte su dieci la forma interessante è un livello più sotto.

## Appiattire prima: jq, e i file che non sono un solo valore JSON

Due problemi stanno davanti a tutto quello sopra. Il file potrebbe non essere un solo valore JSON, e la forma potrebbe non essere ancora un rettangolo. Entrambi si risolvono prima che qualunque convertitore veda i dati, ed entrambi si risolvono con la stessa manciata di comandi.

**Il file è JSON Lines.** Un valore JSON per riga, terminato da un a capo, senza array che lo avvolge. Ogni riga è valida; il file non lo è, perché una sequenza nuda di valori non è un documento JSON. `JSON.parse` e `json.loads` falliscono entrambi sulla riga 2, e il messaggio di errore dice "token inaspettato" piuttosto che "questo è JSON Lines", quindi le persone concludono che il file sia corrotto. Non lo è. È l'output normale di una pipeline di log, di `docker logs`, di un consumatore di coda di messaggi, e della maggior parte degli endpoint di export in blocco.

Il rimedio è un flag, e ogni strumento lo chiama in modo diverso:

| Strumento | Leggere JSON Lines | Scrivere JSON Lines |
| --- | --- | --- |
| jq | default: legge un flusso di valori | `jq -c` — compatto, un valore per riga |
| jq, come array | `jq -s` o `jq --slurp` | `jq -c '.[]'` |
| Miller | `mlr --ijsonl` | `mlr --ojsonl` |
| pandas | `pd.read_json(path, lines=True)` | `df.to_json(path, orient="records", lines=True)` |
| jtbl | legge l'input delimitato per riga come arriva | non applicabile |
| Python stdlib | `json.loads` per riga in un ciclo | `json.dumps` per riga |

Quindi la prima mossa canonica su un file `.jsonl` è trasformarlo in un array:

```bash
jq -s '.' events.jsonl > events.json
```

e l'ultima mossa canonica, se il prossimo strumento vuole righe, è smontare di nuovo l'array con `jq -c '.[]'`. Vale la pena saperlo: `jq -s` legge l'intero file in memoria. Su un log multi-gigabyte è lo strumento sbagliato, e Miller invece scorre in streaming — anche se una tabella con un milione di righe non è un documento che qualcuno leggerà, quindi la risposta vera per un file di quella dimensione è filtrare prima.

**La forma ha bisogno di appiattimento.** La funzione `flatten` di jq appiattisce gli *array* annidati, non gli oggetti, il che sorprende chi ci prova per nome. Appiattire oggetti in chiavi con punto si fa con i percorsi:

```bash
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]' data.json
```

Questo si legge come: per ogni record, trova ogni percorso che finisce in uno scalare, trasforma il percorso in una stringa con punti, accoppialo con il valore a quel percorso, e ricostruisci il record da quelle coppie. `leaf_paths` è `paths(scalars)`; `getpath` recupera un valore per percorso; `from_entries` trasforma coppie chiave/valore di nuovo in un oggetto. L'output è un array di oggetti piatti, che è la sola forma che si tabula onestamente, e puoi darla a qualunque convertitore del bigliettino.

Due avvertenze su quel filtro. Gli indici di array diventano parte della chiave, quindi `tags` con due elementi produce `tags.0` e `tags.1` — il problema delle colonne posizionali di prima, che arriva dalla porta di servizio. E un oggetto vuoto o un array vuoto non hanno nessun percorso foglia affatto, quindi quei campi svaniscono dal record appiattito del tutto. Se una delle due cose conta, gestisci gli array separatamente prima di appiattire:

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json | \
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]'
```

**I record sono con chiave id piuttosto che elencati.** Una forma comune è un oggetto le cui chiavi sono identificativi:

```json
{ "u1": { "name": "Ada" }, "u2": { "name": "Ben" } }
```

Non c'è nessun array qui, ma ce n'è uno che si nasconde. `to_entries` produce `[{"key":"u1","value":{...}}, ...]`, e un passaggio in più promuove la chiave a campo del record:

```bash
jq '[to_entries[] | { id: .key } + .value]' users.json
```

Ora è un array di oggetti piatti con `id` come prima colonna, e l'identificativo che faceva doppio servizio come chiave è un valore come qualunque altro.

**In Python, `json_normalize` fa gran parte di questo in una sola chiamata.** `pd.json_normalize(records, sep=".")` appiattisce oggetti annidati in colonne con punto; `max_level` la ferma a una profondità; `record_path` e `meta` gestiscono il caso di esplosione, prendendo un array annidato come fonte delle righe e portando con sé i campi genitore. Poi `to_markdown(index=False)` scrive la tabella, che richiede il pacchetto `tabulate` installato insieme a pandas. Entrambi sono gratuiti e open source, pandas sotto BSD a 3 clausole e tabulate sotto MIT.

**Per chi è questa sezione:** per chiunque convertí la stessa forma più di una volta. Un filtro jq in uno script di shell è un passaggio di conversione che puoi leggere, revisionare e correggere. Una sequenza di clic no.

## Dove la tabella mente, e cosa costa

Assumi che la forma sia giusta e l'appiattimento fatto. C'è ancora un insieme di modi in cui una tabella Markdown rappresenta male il JSON da cui viene, e nessuno di essi produce un errore.

**Una pipe in un valore divide la cella.** In GitHub Flavored Markdown, `|` delimita le celle ovunque in una riga di tabella, incluso dentro quello che intendevi come testo. `call before 4pm | or leave with neighbour` diventa due celle, la riga guadagna una colonna, e il renderer scarta l'eccesso o disallinea il resto. La via di fuga è una barra rovesciata — `\|` — ed è compito del convertitore applicarla. Testalo: metti una pipe in un valore, converti, e guarda. Questa è un'istanza di un problema più ampio che vale la pena capire per intero, perché [le tabelle si rompono nel passaggio tra formati più di ogni altra cosa in Markdown](/blog/markdown-tables-that-survive-conversion).

**Un a capo in un valore non può essere espresso affatto.** Una riga di tabella Markdown è una riga. Una stringa JSON può contenere `\n`, e spesso lo fa — un campo descrizione, un messaggio di log, un indirizzo. Non c'è nessun Markdown per un a capo dentro una cella; la sola strada è un `<br>` letterale, che è HTML grezzo dentro il tuo Markdown, e che verrà rimosso da qualunque renderer che sanitizza. I convertitori variamente emettono `<br>`, sostituiscono l'a capo con uno spazio, oppure emettono l'a capo grezzo e rompono la tabella. Tutti e tre sono difendibili e solo uno è quello che vuoi, quindi scopri quale fa il tuo.

**Le celle vuote confondono quattro fatti diversi.** `null`, una stringa vuota, una chiave mancante e `false` diventano tutti una cella vuota nella maggior parte dei convertitori. In una tabella di ordini, "nessuno sconto" e "il campo sconto non è presente in questo record" sono affermazioni diverse, e chi legge non può capire quale delle due dal vuoto. Scrivere un *null* in corsivo per null, un trattino per assente e lasciare le stringhe vuote genuinamente vuote costa tre righe in un convertitore e risparmia a chi legge di indovinare. Controlla cosa fa il tuo su un record che costruisci tu stesso.

**I valori lunghi distruggono il layout senza romperlo.** Un blob base64, uno stack trace, una colonna con un UUID per riga: una tabella Markdown non ha larghezze di colonna, quindi un valore lungo rende la sua colonna larga come se stessa e schiaccia ogni altra colonna in una striscia. La tabella è valida e illeggibile. Il rimedio non è nel convertitore — è scartare la colonna, oppure troncarla deliberatamente con un marcatore, prima di convertire. `jq 'map(.token |= .[0:12] + "…")'` è più brutto dell'alternativa di fingere che il problema sia estetico.

**I tipi sono spariti, e il documento non lo dice.** Markdown non ha tipi. Una volta convertito, `"12.50"` e `12.5` sono entrambi il testo `12.5`, `true` è la parola true, e `2026-09-02T00:00:00Z` è una stringa che sembra una data a una persona e a niente in particolare a una macchina. Va bene per un documento e squalifica per qualunque cosa a valle. Se chi riceve calcolerà sui numeri, invia il JSON o un CSV e lascialo analizzare; la tabella Markdown serve per leggere.

**L'ordine delle righe è quello che il file aveva.** Gli array JSON sono ordinati e l'ordine è significativo, quindi un convertitore deve conservarlo — ma niente lo ordina per te, e una tabella che nessuno ha ordinato è una tabella nell'ordine di inserimento, che raramente è l'ordine che chi legge vuole. Ordina prima di convertire: `jq 'sort_by(.total) | reverse'` non costa niente e fa una tabella che risponde a una domanda.

**L'ordine delle colonne è un incidente.** Gli oggetti JSON non hanno un ordine di chiavi definito nella specifica, anche se ogni implementazione pratica conserva l'ordine con cui ha letto. Quindi le tue colonne escono nell'ordine qualunque in cui il serializzatore dall'altra parte le ha emesse per caso, il che significa che l'identificativo potrebbe essere la sesta colonna. Metti le colonne nell'ordine di cui chi legge ha bisogno con una selezione esplicita — `mlr cut -o -f id,name,total` conserva l'ordine che hai elencato, e la costruzione di oggetti di jq fa lo stesso.

Il costo di tutto questo, sommato, non è che la tabella sia sbagliata. È che la tabella sembra giusta. Un errore di parsing JSON ti ferma; una riga disallineata da una pipe non mascherata viene spedita, letta, citata in una decisione, e scoperta sei settimane dopo.

## Quando una tabella è il rendering sbagliato

A volte la risposta onesta è che i dati non sono tabellari e nessuna quantità di appiattimento lo cambierà. Tre segnali, e cosa fare invece.

**Le colonne superano le righe.** Una singola risposta API appiattita a sessanta chiavi con punto e un record non è una tabella; è un record, e un record si legge meglio come valori etichettati che come un rettangolo di sessanta colonne che nessuno può scorrere. Rendi i campi scalari come etichette in grassetto con i valori a fianco, e dai a ogni sezione annidata la sua intestazione.

**Ogni riga ha bisogno di un paragrafo.** Se un campo è una descrizione, il corpo di un commento, un diff o un messaggio di log, e chi legge deve davvero leggerlo, una cella di tabella è il contenitore sbagliato. Il rendering che funziona è una sezione per record: un'intestazione che porta l'identificativo, i campi corti come elenco compatto, e il campo lungo come proprio paragrafo o blocco recintato. È più lungo di una tabella diverse volte, ed è la versione che qualcuno può leggere.

**La struttura è l'informazione.** In un file di configurazione, un albero di permessi o un grafo di dipendenze, la nidificazione è quello che stai cercando di comunicare. Appiattirla in chiavi con punto trasforma la struttura in prefissi di stringa e chiede a chi legge di ricostruire l'albero in testa. Intestazioni per i livelli, elenchi indentati per le foglie, e un blocco recintato `json` per qualunque cosa oltre circa tre livelli — profondo abbastanza per vedere la forma, superficiale abbastanza che le intestazioni significhino ancora qualcosa. Un blocco recintato con una info string `json` ottiene anche l'evidenziazione della sintassi nella maggior parte dei renderer, il che fa un lavoro vero per la leggibilità; [cosa è una info string e cosa ne fanno i renderer](/blog/code-blocks-in-markdown) vale la pena saperlo prima di fare affidamento su questo.

Quel rendering misto — tabelle dove i dati sono rettangolari, elenchi dove è una sequenza, intestazioni dove è un albero, blocchi di codice dove è più profondo di quanto un documento dovrebbe andare — è quello che un convertitore da JSON a Markdown sceglie davvero quando converte. È la ragione per cui [la conversione da JSON a Markdown di TransformPipe](/json-to-markdown) sceglie un rendering per forma piuttosto che forzarne uno, nel browser, senza caricare niente quando non hai fatto l'accesso.

| Segnale nei dati | Tabella? | Rendering migliore |
| --- | --- | --- |
| Molti record, pochi campi scalari | Sì | Tabella |
| Un record, molti campi | No | Etichette in grassetto, intestazioni per le parti annidate |
| Un campo che contiene prosa | No | Sezione per record, prosa come paragrafo |
| Nidificazione profonda che conta | No | Intestazioni per livello, blocco recintato oltre tre |
| Un elenco di valori semplici | No | Elenco puntato o numerato |
| Record di due o tre campi, decine di essi | Sì | Tabella, ordinata |

## Come scegliere il rendering

1. **Leggi le prime dieci righe del file prima di aprire qualunque strumento.** La forma di livello superiore decide tutto a valle, e ci vogliono dieci secondi: `head -c 400 data.json` ti dice se hai un array di record o una busta annidata, e una busta annidata significa che la tua tabella sta su un campo interno piuttosto che sul file.
2. **Chiediti se il file è un solo valore JSON o uno per riga.** Sbaglialo e ottieni un errore di parsing nel migliore dei casi e solo il primo record nel peggiore. `head -n 3` e un'occhiata a se ogni riga è un oggetto completo lo risolve, e il rimedio è un flag per strumento.
3. **Appiattisci di proposito, poi seleziona le colonne di proposito.** L'appiattimento automatico produce ogni colonna che i dati possono dare, il che per record API reali è più colonne di quante un documento possa contenere. Scegli le colonne e il loro ordine esplicitamente, o chi legge riceve l'opinione del serializzatore invece della tua.
4. **Costruisci il record scomodo e convertilo prima di fidarti dello strumento.** Un record con un null, una chiave mancante, un oggetto annidato, un campo array, una pipe in una stringa e un a capo in una stringa. Ogni fallimento di questa pagina si mostra in quella singola conversione, e trovarli lì costa due minuti invece di una ritrattazione.
5. **Decidi se l'output è per essere letto o elaborato.** Una tabella Markdown è un documento: i tipi sono spariti e niente può analizzarla di nuovo in modo affidabile. Se il passaggio successivo è un foglio di calcolo o uno script, convertí in CSV e salta il viaggio di andata e ritorno.
6. **Se le colonne superano le righe, smetti di fare una tabella.** Quel rapporto è il segnale più chiaro che i dati sono un record piuttosto che una lista, e un record si rende come valori etichettati. Forzare un rettangolo a quel punto ti costa la sola cosa per cui serviva la conversione, che è che qualcuno possa leggerla.

## Conclusione

Un array di oggetti piatti con chiavi coerenti converte in una tabella Markdown senza decisioni e senza perdite, e se questo è il tuo file la scelta dello strumento conta a malapena. Tutto il resto è una decisione che qualcuno deve prendere: appiattire la nidificazione o renderla come sezioni, unire il campo array o esploderlo in righe, prendere l'unione delle chiavi o accettare le lacune, ed escapare le pipe prima che un valore che ne contiene una sposti una riga che nessuno rilegge. Prendi quelle decisioni tu stesso con `jq` o `mlr` mentre i dati sono ancora JSON, oppure usa un convertitore le cui regole sono scritte così sai cosa ha fatto. La sola cosa da non fare è dare un albero a un rettangolo e assumere che l'output sia vero perché si allinea.

## Domande frequenti

### Come convertire un array JSON in una tabella Markdown?

Se ogni oggetto nell'array ha le stesse chiavi e tutti i valori sono scalari, qualunque convertitore lo gestisce: rilascia il file su un convertitore nel browser, esegui `mlr --ijson --omd cat data.json`, fallo passare per `jtbl -m`, oppure chiama `to_markdown(index=False)` su un DataFrame pandas. Se gli oggetti contengono oggetti o array annidati, appiattiscili prima, perché altrimenti alcune celle conterranno JSON trasformato in stringa.

### Cosa succede al JSON annidato in una tabella Markdown?

Una di tre cose, secondo lo strumento: il valore annidato viene trasformato in stringa dentro una singola cella, appiattito in colonne con punto come `user.name`, oppure scartato. Appiattire è la sola delle tre che conserva i dati leggibili, e fa crescere il numero di colonne, quindi appiattisci e poi seleziona le colonne che vuoi piuttosto che accettarle tutte.

### Come gestire record con chiavi diverse?

Costruisci l'intestazione dall'unione delle chiavi su tutti i record, non dal primo record. Controlla cosa ha fatto il tuo convertitore con `jq -r '[.[] | keys[]] | unique | join(",")'` e confronta quella lista con la riga di intestazione nel tuo output — se l'output è più corto, i campi dei record successivi sono stati scartati in silenzio.

### Posso fare una tabella Markdown da JSON Lines?

Sì, una volta che lo strumento sa che il file è delimitato per riga. Miller lo legge con `--ijsonl`, pandas con `lines=True`, e jq tratta un flusso di valori come il suo input normale, quindi `jq -s '.' events.jsonl` trasforma il file in un array che qualunque altro strumento accetterà. Un convertitore senza nessun indizio fallirà alla riga 2 con un errore di sintassi, che si legge come corruzione del file e non lo è.

### Cosa rompe una tabella Markdown generata da JSON?

Caratteri pipe e a capo dentro i valori stringa. Una pipe termina una cella ovunque appaia, quindi una non mascherata aggiunge una colonna a quella riga, e un a capo non può essere rappresentato in una riga di tabella affatto. Un buon convertitore maschera le pipe come `\|` e sostituisce gli a capo con `<br>` o uno spazio; testa entrambi i casi su un valore che controlli tu prima di fidarti dell'output.

### Dovrei convertire JSON in CSV invece?

Se il passaggio successivo è un foglio di calcolo, uno script o qualunque cosa che analizzerà i dati, sì — anche il CSV perde i tipi ma almeno è progettato per essere letto indietro, mentre una tabella Markdown è un documento senza nessun parser affidabile. Convertí in Markdown quando qualcuno lo leggerà in un ticket, una pull request o una pagina.

### Perché il mio numero appare diverso dopo la conversione?

Perché è passato per un tipo numerico JSON lungo la strada. `9.0` diventa `9`, `007` diventa `7` se era un numero piuttosto che una stringa, e un float che non può essere rappresentato esattamente in binario arriva con le cifre che JSON ha memorizzato. Qualunque campo la cui forma stampata conta — un codice prodotto, una versione, un prezzo a decimali fissi — deve essere una stringa nei dati di origine; nessun convertitore può ripristinare uno zero che non ha mai ricevuto.
