---
title: "Come convertire un CSV in una tabella Markdown senza rovinare i dati"
description: "Trasforma un CSV in una tabella Markdown evitando le trappole: virgolette, doppi apici, a capo nelle celle, pipe, punto e virgola, BOM e intestazione assente"
date: 2026-09-03
tag: Conversione
keywords: csv in tabella markdown, convertire csv in markdown, csv markdown tabella online, tsv in tabella markdown, campo csv tra virgolette markdown, tabella markdown da foglio di calcolo, csv con punto e virgola in markdown
---

### In breve

Convertire un CSV in una tabella Markdown è due righe di lavoro — un'intestazione, una riga di separazione fatta di trattini e una riga per record — e circa nove modi di farlo sbagliato senza che nessuno se ne accorga. Tutti i guasti nascono dallo stesso punto: un CSV non è un file con delle virgole dentro, è un formato tra virgolette con delle regole, e un convertitore che divide sulla virgola produce una tabella che ha un aspetto giusto e dice qualcosa di diverso dal file. Usa uno strumento con un vero parser CSV, maschera le pipe in uscita come `\|`, sostituisci gli a capo dentro una cella con `<br>` perché una tabella Markdown non può contenere un ritorno a capo, e aggiungi una riga di intestazione prima di convertire se il file non ne ha una. Poi controlla la riga più difficile nell'output, non le prime tre.

La meccanica è banale. Ed è proprio questo che rende il lavoro rischioso: siccome l'output ha sempre l'aspetto di una tabella plausibile, niente ti avvisa quando un valore si è spostato di una colonna a sinistra, quando un nome ha perso la sua virgola, o quando una riga ha perso in silenzio il suo ultimo campo. La tabella si mostra. I dati sono sbagliati. Nessuno se ne accorge finché qualcuno non legge un numero ad alta voce in una riunione.

La maggior parte dei problemi arriva dai fogli di calcolo. Un CSV scritto da un programma e letto da un programma tende a essere pulito, perché entrambe le estremità hanno implementato le stesse regole. Un CSV esportato da una persona da Excel, Numbers o un CRM contiene indirizzi con a capo dentro, note con le virgolette, un'intestazione della prima colonna con un byte invisibile attaccato — e, secondo dove la macchina crede di trovarsi, punti e virgola dove ti aspettavi delle virgole.

Questo testo è la procedura e le trappole. La procedura dura un minuto. Le trappole sono l'articolo, e stanno nell'ordine in cui colpiscono: prima le virgolette, perché cambiano cosa significa una riga; poi il mascheramento in uscita; poi i problemi a livello di file che impediscono alla conversione di somigliare a una tabella fin dall'inizio.

## Come convertire un CSV in una tabella Markdown

Il formato di destinazione è fisso e piccolo. Una tabella GitHub Flavored Markdown è una riga di intestazione, una riga di separazione fatta di trattini, e una riga per record, con le celle separate da pipe:

```markdown
| id | name | role |
| --- | --- | --- |
| 1 | Ann Rowe | Ops |
| 2 | Li Wei | Sales |
```

Le pipe iniziali e finali sono opzionali secondo la specifica e vale comunque la pena scriverle, perché rendono inequivocabile una cella con uno spazio iniziale e si leggono meglio in un diff. La riga di separazione non è decorativa: è la riga che dice al parser che il blocco sopra è un'intestazione invece che un paragrafo, e deve avere lo stesso numero di celle dell'intestazione. Se sbagli questo, ottieni un paragrafo pieno di caratteri pipe. Il resto di ciò che il formato può e non può fare è trattato in [il testo dedicato alle tabelle Markdown](/blog/markdown-tables-that-survive-conversion); questo articolo riguarda il portare le tue righe in quella forma senza perderne nessuna.

Ecco la procedura completa.

1. **Apri prima il file in un editor di testo, non in un foglio di calcolo.** Un foglio di calcolo ti mostra la propria interpretazione del file, che è esattamente quello che stai cercando di controllare. Un editor di testo ti mostra i byte: se il separatore è una virgola, se i campi sono tra virgolette, se c'è una riga di intestazione, e se qualche record si estende su più di una riga. Trenta secondi qui risparmiano il resto.
2. **Conferma il separatore.** Le virgole sono il default, non la regola. Se la prima riga legge `id;name;role`, hai un file a punto e virgola, e qualunque strumento basato sulla virgola ti darà una cella per riga.
3. **Conferma che ci sia una riga di intestazione.** Se la prima riga sono già dati, aggiungi una riga di intestazione prima di convertire. Una tabella Markdown non può esistere senza, e ogni risposta automatica a un'intestazione mancante perde qualcosa.
4. **Convertilo con qualcosa che analizza invece di dividere.** Cioè un lettore CSV — un convertitore lato browser, una libreria, o uno strumento da riga di comando pensato per dati tabellari. Un `cut -d,` o uno `split(',')` è lo strumento sbagliato, e il danno che fa è invisibile nell'output.
5. **Controlla il mascheramento in uscita.** Le pipe nei valori devono diventare `\|`. Gli a capo dentro una cella devono diventare `<br>` o uno spazio. I doppi apici devono essersi ridotti a uno solo.
6. **Guarda la riga più difficile, non la prima.** Trova la riga con una virgola tra virgolette, un apostrofo, una virgoletta o un percorso file al suo interno, e leggi quella riga nell'output confrontandola con la stessa riga nella fonte.

Per rendere concreto il punto sei, ecco un piccolo file che porta cinque trappole insieme. Tienine uno simile a portata di mano; è il solo test che conta davvero.

```csv
id,name,role,notes
1,"Smith, John",Sales,"Joined 2019
Moved from Support"
2,"O""Brien, Ann",Ops,"Owns the a|b routing rule"
3,Li Wei,Support,"Said ""no"" twice"
```

Quattro record, non cinque, perché il record 1 contiene un a capo dentro un campo tra virgolette. Una conversione corretta produce questo:

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | Smith, John | Sales | Joined 2019<br>Moved from Support |
| 2 | O"Brien, Ann | Ops | Owns the a\|b routing rule |
| 3 | Li Wei | Support | Said "no" twice |
```

Ogni differenza tra quell'output e la fonte è voluta: le virgolette attorno ai campi sono sparite perché erano sintassi, i doppi apici sono collassati a uno solo, l'a capo è diventato `<br>`, e la pipe è stata mascherata. Niente si è spostato di colonna.

Una divisione ingenua sulla virgola produce questo invece, ed è la parte su cui vale la pena fermarsi a guardare:

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | "Smith | John" | Sales |
| Moved from Support" | | | |
| 2 | "O""Brien | Ann" | Ops |
| 3 | Li Wei | Support | "Said ""no"" twice" |
```

Il ruolo di John è ora il suo cognome. Il campo delle note è svanito del tutto dalla riga 1, perché Markdown scarta le celle oltre il numero dell'intestazione e `"Joined 2019` era la quinta. La riga di continuazione è diventata una riga a sé. Ann ha lo stesso problema più dei doppi apici visibili. Solo la riga 3 è sopravvissuta, ed è sopravvissuta perché era la più semplice. La tabella si mostra perfettamente.

## Il bigliettino: ogni trappola in una tabella

| Trappola | Nel CSV | Cosa fa una divisione ingenua | Cosa fa una conversione corretta |
| --- | --- | --- | --- |
| Campo tra virgolette | `"Sales"` | Tiene le virgolette come caratteri | Le elimina; erano sintassi |
| Virgola dentro le virgolette | `"Smith, John"` | Due celle; la riga cresce di una colonna; l'ultimo valore va perso | Una cella sola contenente la virgola |
| Doppio apice | `"Said ""no"""` | Lascia `""no""` visibile nella cella | Riduce a `"no"` |
| A capo dentro una cella | un campo tra virgolette su due righe | Divide il record in due righe malformate | Sostituisce l'a capo con `<br>` o uno spazio |
| Pipe in un valore | una pipe nuda dentro un campo | Aggiunge una colonna fantasma a quella riga | La maschera come `a\|b` |
| Nessuna riga di intestazione | la prima riga sono dati | Promuove i dati a intestazioni, in silenzio | Aggiungi tu una riga di intestazione prima di convertire |
| Separatore punto e virgola | `id;name;role` | Una cella per riga, tutta la riga dentro | Legge il file con `;` come separatore |
| Separatore tabulazione | `id<TAB>name` | Una cella per riga | Lo legge come TSV |
| BOM da Excel | `EF BB BF` invisibile prima di `id` | Si attacca alla prima intestazione; i confronti falliscono | Lo rimuove, o legge come `utf-8-sig` |
| Fine riga CRLF | ogni riga finisce con `\r\n` | Lascia un `\r` randagio sull'ultimo campo di ogni riga | Gestito dal lettore; niente di visibile |
| Righe irregolari | una riga più corta dell'intestazione | Riga corta riempita in silenzio, riga lunga troncata | Lo stesso, ma te lo dice, oppure lo controlli |
| Allineamento | niente nel file lo esprime | Ogni colonna allineata a sinistra | Due punti nella riga di separazione, scelti da te |

Lo schema in quella tabella vale la pena nominarlo. Circa metà di questi guasti sono rumorosi — un file a punto e virgola si converte in una sola colonna e lo vedi immediatamente. L'altra metà è silenziosa, e ogni caso silenzioso riguarda le virgolette. È per questo che il controllo è una riga difficile, non un'occhiata all'output.

## Dal sintomo alla causa: cosa vedi e cosa lo ha causato

Scorri questa tabella quando una conversione è già andata male. Il sintomo è quello che hai notato; la causa è quello da correggere nella fonte o nello strumento.

| Sintomo | Causa | Rimedio |
| --- | --- | --- |
| Ogni riga è una sola cella con tutta la riga dentro | Il separatore è un punto e virgola o una tabulazione, e lo strumento ha assunto una virgola | Imposta il separatore, o usa uno strumento che lo rileva |
| Un valore è passato nella colonna successiva, i valori dopo si sono spostati a sinistra | Una virgola dentro un campo tra virgolette è stata trattata come separatore | Usa un vero parser CSV |
| Manca l'ultimo valore di una riga | Stessa causa: la riga è diventata più larga dell'intestazione, e GFM scarta le celle in eccesso | Usa un vero parser CSV |
| Le virgolette appaiono attorno ai valori nella tabella | Le virgolette sono state trattate come caratteri invece che sintassi | Usa un vero parser CSV |
| `""` appare dentro una cella | Il doppio apice non è stato ridotto | Usa un vero parser CSV |
| Una riga appare due volte, la seconda malformata e corta | Un campo tra virgolette conteneva un a capo e il record è stato diviso lì | Convertilo con un parser che legge i record su più righe |
| Due frasi si sono fuse senza spazio | Un a capo dentro una cella è stato eliminato invece che sostituito | Sostituiscilo con `<br>`, o con uno spazio |
| `<br>` appare come testo letterale nell'output | Il Markdown viene letto come testo semplice, non reso come HTML | Usa uno spazio invece, oppure rendi il Markdown |
| Una riga ha una colonna in più delle altre | Una pipe non mascherata dentro un valore | Maschera come `\|` |
| L'intestazione della prima colonna non corrisponde a niente con cui la confronti | Un byte order mark è attaccato a essa | Leggi il file come `utf-8-sig`, o rimuovi il BOM |
| I caratteri accentati sono illeggibili (mojibake) | Il file non è nella codifica che il lettore ha assunto — spesso Windows-1252 letto come UTF-8 | Converti la codifica prima di analizzare |
| L'intero blocco si mostra come un paragrafo di pipe | La riga di separazione manca, è malformata, o ha il numero sbagliato di celle | Correggi la riga di separazione |
| La tabella si mostra ma l'intestazione è la tua prima riga di dati | Il file non aveva intestazione e lo strumento ha promosso la riga uno | Aggiungi una riga di intestazione alla fonte |
| Un `\r` randagio appare in fondo all'ultima cella di ogni riga | Fine riga CRLF divise solo su `\n` | Usa un lettore che gestisce il CRLF |
| I numeri appaiono come `0.4567` dove il foglio mostrava `45.67%` | L'export ha scritto il valore, non il formato di visualizzazione | Correggi l'export, o la colonna, prima di convertire |

## Le virgolette: virgole, doppi apici e a capo

Tutto in questa sezione viene da una sola regola dell'RFC 4180: un campo può essere racchiuso tra virgolette doppie, e dentro quelle virgolette una virgola è dato, un a capo è dato, e una virgoletta doppia si scrive come due virgolette doppie. Tre frasi. Ogni guasto silenzioso in una conversione CSV è uno strumento che non ne ha implementata una.

### Una virgola dentro un campo tra virgolette

`"Smith, John",Sales,2026` sono tre campi. Un parser legge la virgoletta di apertura, consuma tutto fino alla virgoletta di chiusura, e ti dà `Smith, John` come un solo valore. Una divisione sulla virgola te ne dà quattro, e ora la riga è più larga della sua intestazione di una colonna.

Questo è il guasto che costa dati, non solo estetica. La regola delle tabelle GFM dice che una riga con più celle dell'intestazione ha le celle in eccesso scartate, quindi la riga allargata non genera errore, non avvisa, e non trabocca — perde il suo ultimo valore e sposta tutto quello che viene dopo il campo incriminato di una colonna a sinistra. Nomi, indirizzi, titoli di lavoro e note in testo libero sono dove questo vive. Se una colonna può contenere una virgola, questa trappola le si applica.

### Un doppio apice significa una sola virgoletta

Dentro un campo tra virgolette, `""` è una `"` letterale. Quindi `"She said ""no""."` è un campo solo che legge: She said "no". Uno strumento che elimina le virgolette per pattern invece che con un parser vero lascia le coppie al loro posto e ottieni `She said ""no""` nella cella.

Questo è cosmetico fino a un certo punto. In una colonna di prosa, i doppi apici sono brutti. In una colonna di misure in pollici, di frammenti di codice, o di frammenti JSON, cambiano il valore. Una cella che legge `{"id": 1}` e arriva come `{""id"": 1}` non è più JSON valido, e se qualcuno più avanti la copia fuori dal tuo documento ci passerà dieci minuti sopra.

### Un a capo dentro una cella

Questa è la trappola senza una risposta pulita, e vale la pena capirla invece di aggirarla.

L'RFC 4180 permette un a capo dentro un campo tra virgolette, e i fogli di calcolo li producono in continuazione, perché Alt+Invio dentro una cella è come si scrivono blocchi di indirizzo e note. Una tabella Markdown non ha modo di rappresentarlo. Il formato è basato su righe: una riga per record, nessuna sintassi di continuazione, nessun modo di mascherare un a capo. Qualunque cosa faccia il convertitore qui, sta scegliendo tra due bugie.

```csv
id,address
1,"12 Mill Lane
Bristol
BS1 4AA"
```

I tre modi in cui questo può finire in una tabella Markdown:

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane<br>Bristol<br>BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane Bristol BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane |
| Bristol | |
| BS1 4AA" | |
```

Il primo conserva la struttura e mette un tag HTML nel tuo Markdown. Il secondo tiene il Markdown pulito e perde la struttura, e se lo strumento unisce senza uno spazio ottieni `12 Mill LaneBristol`. Il terzo è quello che fa uno che divide, ed è semplicemente rotto. Preferisci il primo quando il Markdown verrà reso come HTML, che è il caso normale, e il secondo quando non lo sarà — un README in testo semplice letto in un terminale, un messaggio di commit, un messaggio di chat in un client che non rende l'HTML dentro le tabelle. Perché Markdown non ha un'opzione migliore disponibile dentro una tabella è una conseguenza di [come funzionano gli a capo in Markdown in generale](/blog/markdown-line-breaks-and-lists): l'a capo con due spazi e quello con la barra rovesciata sono costrutti inline, e una riga di tabella finisce all'a capo comunque.

Se i tuoi dati hanno a capo in una colonna e la struttura conta, la risposta onesta è a volte che quella colonna non dovrebbe stare nella tabella. Spostala sotto come elenco di definizioni, oppure fai un link alla fonte.

## Mascherare in uscita: pipe, barre rovesciate e allineamento

Analizzare il CSV correttamente porta i valori giusti. Scrivere il Markdown correttamente li mantiene giusti. Tre cose vanno fatte in uscita, e una di queste è il bug più comune nei convertitori fatti in casa.

### La pipe

Il CSV non si preoccupa delle pipe. Markdown ci tiene moltissimo: una `|` non mascherata chiude la cella dovunque appaia. Va scritta `\|`.

Il dettaglio che si perde è che i backtick non la proteggono. Una pipe dentro uno span di codice inline dentro una cella di tabella chiude comunque la cella — la tabella viene analizzata in celle prima che la sintassi inline venga considerata, quindi `` `a|b` `` diventa due celle, la prima contenente uno span di codice non chiuso. La specifica GFM è esplicita sul fatto che la maschera è richiesta anche dentro altri span inline. Non esiste altro meccanismo.

```csv
pattern,meaning
"^(a|b)$","a or b, anchored"
```

```markdown
| pattern | meaning |
| --- | --- |
| `^(a\|b)$` | a or b, anchored |
```

Dove si vede: percorsi file in esempi di shell, espressioni regolari, pipeline di shell, opzioni elencate in una colonna di documentazione, e ogni colonna che contiene `yes|no|maybe`. I convertitori scritti e testati contro nomi e numeri non lo incontrano mai. Se stai valutando uno strumento, metti una pipe in una cella di test apposta.

### La barra rovesciata

Meno comune e vale la pena saperlo. Un valore che finisce con una barra rovesciata, o che contiene una sequenza come `\n` come testo letterale, può interagire con il mascheramento proprio di Markdown — `\|` è una pipe mascherata, quindi un valore che finisce legittimamente con `...\` seguito da un delimitatore pipe produce qualcosa di ambiguo. Chi scrive con attenzione maschera le barre rovesciate come `\\` nel contenuto della cella. La maggior parte dei convertitori non lo fa, e la maggior parte dei dati non lo attiva mai. Controllalo solo se le tue colonne contengono percorsi Windows o codice.

### I due punti dell'allineamento

Niente in un CSV esprime l'allineamento. Una colonna numerica allineata a destra in un foglio di calcolo è una proprietà visiva del foglio, e non sopravvive all'export, figuriamoci alla conversione. Markdown ti dà tre opzioni per colonna, impostate con i due punti nella riga di separazione, e applicarle è una decisione che prendi dopo la conversione:

```markdown
| Item | Qty | Price |
| :--- | ---: | ---: |
| Widget | 12 | 4.50 |
| Flange | 3 | 12.00 |
```

`:---` è sinistra, `---:` è destra, `:---:` è centro, e un semplice `---` lascia decidere al renderer, che in pratica significa sinistra. Allinea a destra le colonne numeriche; è l'unica modifica manuale che migliora davvero in modo affidabile una tabella convertita, perché una colonna di cifre allineate a destra si confronta a occhio e una allineata a sinistra no. Nota che molti convertitori emettono trattini semplici e lasciano a te questa scelta, e che i due punti sono la sola formattazione di colonna che il formato ha — niente larghezze, niente colori, niente allineamento per singola cella.

### Il riempimento con spazi, e perché non conta

Alcuni strumenti riempiono ogni cella con spazi così che le pipe si allineino nella fonte. Non ha alcun effetto sull'output reso; serve solo a chi legge il Markdown come testo. Il riempimento rende una tabella larga piacevole da leggere in un editor e orribile da confrontare in un diff, perché cambiare un valore riscrive ogni riga del blocco. Per una tabella che vive in un repository e viene modificata, senza riempimento è la scelta migliore. Per una tabella che qualcuno leggerà come testo semplice, riempila.

## La riga di intestazione, il separatore e i byte che non vedi

Questi tre sono problemi a livello di file. Sono di solito rumorosi, e si correggono tutti prima della conversione, non dopo.

### Un file senza riga di intestazione

I CSV generati da macchine spesso non hanno intestazione: un export di log, un dump di database, un feed di sensori, una risposta paginata di un'API scritta direttamente su disco. Una tabella Markdown non può esistere senza intestazione, perché la riga di separazione sotto è quella che identifica il blocco come tabella.

Così ogni convertitore fa una di tre cose, e nessuna è buona:

| Comportamento | Risultato |
| --- | --- |
| Promuove la prima riga di dati | Perdi i dati di quella riga, e le intestazioni non significano niente |
| Genera nomi segnaposto | `a, b, c` oppure `Colonna 1, Colonna 2` — la tabella è leggibile ma non dice niente |
| Si rifiuta di convertire | Onesto, e raro |

La maggior parte degli strumenti prende la prima opzione in silenzio, motivo per cui un file di log convertito ha così spesso un timestamp dove dovrebbero stare i nomi delle colonne. Il rimedio è una riga in un editor di testo: aggiungi un'intestazione. Sai già quali sono le colonne, e nessuna risposta automatica a questo produce mai una tabella che qualcuno possa leggere sei mesi dopo.

### Punto e virgola, tabulazioni e altri separatori

Un file `.csv` non è necessariamente separato da virgole. Nei paesi dove la virgola è il separatore decimale, un foglio di calcolo che esporta CSV usa il separatore di elenco delle impostazioni regionali del sistema, che è comunemente un punto e virgola — e il file conserva comunque l'estensione `.csv`. È la causa più frequente di "il convertitore ha prodotto una sola colonna".

```csv
id;name;price
1;Widget;4,50
```

Nota il secondo problema in quel file: `4,50` è quattro virgola cinquanta, scritto in una locale che usa la virgola come punto decimale. Convertire il separatore non convertisce i numeri. Se quei valori finiranno in una tabella che qualcuno leggerà, decidi se normalizzarli prima, perché una tabella mista di `4,50` e `12.00` è peggio di entrambi presi da soli.

I valori separati da tabulazione sono lo stesso formato con un separatore diverso, e sono più facili da gestire in sicurezza per un motivo: le tabulazioni quasi non appaiono mai dentro i valori, quindi i problemi di virgolette in gran parte svaniscono. È anche per questo che copiare un intervallo da un foglio di calcolo e incollarlo funziona spesso meglio che esportare un CSV — la clipboard porta testo separato da tabulazioni.

| Separatore | Da dove viene | Cosa fare |
| --- | --- | --- |
| Virgola | Il default, e la maggior parte degli export programmatici | Niente |
| Punto e virgola | Export da foglio di calcolo in locale con virgola decimale | Imposta il separatore; controlla anche il separatore decimale |
| Tabulazione | `.tsv`, `.tab`, e qualunque cosa incollata da un foglio di calcolo | Leggilo come TSV |
| Pipe | Alcuni export da database e mainframe | Imposta il separatore, e ricorda che ogni valore ora va mascherato in uscita |
| Larghezza fissa | Report legacy | Non è CSV per niente; serve prima un parser per posizione di colonna |

Una fonte separata da pipe merita un momento di riflessione, perché il separatore e la sintassi di output sono ora lo stesso carattere. Analizzala come separata da pipe, poi maschera qualunque pipe che fosse dentro i valori. Uno strumento che la legge come CSV produrrà una tabella che sembra corretta e che è sbagliata in ogni riga che conteneva una pipe nei suoi dati.

### I byte prima del primo campo

Due cose invisibili viaggiano con i file scritti su Windows o esportati da Excel.

Un **byte order mark** — i byte `EF BB BF` — può stare proprio all'inizio di un file UTF-8. Excel ne scrive uno quando scegli il suo formato di salvataggio `CSV UTF-8`, ed è lì a beneficio dei programmi che altrimenti dovrebbero indovinare la codifica. Il tuo lettore CSV potrebbe rimuoverlo o no. Se non lo fa, il marcatore si attacca alla tua prima intestazione di colonna, dove è invisibile in ogni editor e rompe ogni confronto contro quell'intestazione. Ottieni un'intestazione che sembra `id`, non è uguale a `id`, e non si può spiegare guardandola.

```python
# Legge il BOM e lo scarta se presente.
with open('data.csv', newline='', encoding='utf-8-sig') as handle:
    rows = list(csv.reader(handle))
```

```bash
# Rimuove un BOM UTF-8 dalla prima riga soltanto.
sed '1s/^\xEF\xBB\xBF//' data.csv > clean.csv
```

Le **fine riga CRLF** sono l'altro caso. L'RFC 4180 specifica proprio CRLF come separatore di record, quindi un CSV ben formato le ha e un lettore deve gestirle. Uno strumento che divide solo su `\n` lascia un ritorno a capo attaccato all'ultimo campo di ogni riga, invisibile finché non confronti un valore o non lo incolli da qualche parte che mostra i caratteri di controllo.

La codifica è il terzo problema a livello di file, e il più rumoroso dei tre. Un CSV non porta nessuna dichiarazione della propria codifica. Un file salvato come Windows-1252 e letto come UTF-8 dà caratteri illeggibili in ogni nome accentato; letto come UTF-8 quando in realtà è UTF-16 potrebbe non analizzarsi affatto. Converti il file prima di convertire la tabella:

```bash
iconv -f WINDOWS-1252 -t UTF-8 data.csv > data-utf8.csv
```

Nessuno di questi tre è difficile. Tutti e tre sono invisibili, e tutti e tre sono gestiti da un lettore vero e da nessuna delle scorciatoie a cui si ricorre di solito.

## Dove una tabella Markdown è la risposta sbagliata

La sezione onesta. Alcune cose che un foglio di calcolo contiene non hanno equivalente in Markdown, e nessun convertitore lo risolve, perché il limite sta nel formato e non nello strumento. Sapere quali parti sono queste ti evita di cercare uno strumento migliore.

**Celle unite.** Non esiste colspan né rowspan. Un'intestazione che occupa tre colonne nel foglio deve diventare un'intestazione con due vicine vuote, oppure tre intestazioni ripetute. Se la fonte si appoggia a celle unite per esprimere la sua struttura, la tabella va ridisegnata prima di essere convertita.

**Intestazioni annidate o raggruppate.** Due righe di intestazione — un gruppo sopra, sottocolonne sotto — è una forma comune nei fogli di calcolo e impossibile in Markdown, che ha esattamente una riga di intestazione. Appiattiscila in nomi composti come `2025 Q1` e `2025 Q2`, oppure usa HTML grezzo, e a quel punto non stai più scrivendo una tabella Markdown.

**Qualunque cosa larga.** Le tabelle Markdown non vanno a capo e non scorrono da sole. Dodici colonne di prosa diventano una tabella più larga della pagina, e cosa succede dopo dipende da chi la rende: traboccamento, uno schiacciamento, oppure una barra di scorrimento se l'HTML circostante ne fornisce una. Tagliare colonne prima di convertire, oppure trasporre così che le righe diventino colonne, oppure accettare che verrà letta su uno schermo largo.

**Qualunque cosa lunga.** Una tabella di mille righe in un documento non è una tabella, è un dump di dati con dei bordi. Non c'è paginazione né ordinamento. Sopra circa cinquanta righe, l'output utile è una tabella riassuntiva più un link al CSV.

**Qualunque cosa interattiva.** Nessun ordinamento, nessun filtro, nessuna riga di totale che si ricalcola, nessuna formattazione condizionale. Se chi legge deve interrogare i numeri invece di leggerli, la tabella è lo strumento sbagliato.

**Formule e formati.** Questi sono già persi prima che il convertitore veda il file. Un export CSV contiene valori, e simboli di valuta, separatori delle migliaia, percentuali e formati di data sono proprietà di visualizzazione che l'export ha scritto oppure no. Se la tabella mostra `0.4567` dove il foglio mostrava `45.67%`, è stato l'export a farlo.

Ci sono anche costi specifici delle strade stesse. Un convertitore lato browser fa il lavoro sulla tua macchina, ed è per questo che niente viene caricato, e lo stesso fatto significa che un file molto grande è limitato dalla macchina e dalla scheda: TransformPipe limita una conversione a 10 MB, e un documento tenuto in un link condivisibile a 4 MB, perché la funzione che lo salva rifiuta un corpo di richiesta più grande. Uno strumento da riga di comando non ha questo tetto e richiede un'installazione e qualcuno che si ricordi le opzioni. Un plugin da foglio di calcolo è comodo e lega il lavoro all'applicazione. Nessuno di questi è un difetto; sono la forma di ciascuna strada, e il confronto tra le strade stesse è l'argomento di [la rassegna dei convertitori da CSV a Markdown](/blog/best-csv-to-markdown-converters).

Un altro costo che vale la pena nominare: la variante. Le tabelle non sono in CommonMark. Sono un'estensione di GitHub Flavored Markdown, quindi un renderer strettamente conforme a CommonMark mostra la tua tabella convertita come un paragrafo pieno di pipe. Prima di convertire cento righe, conferma che qualunque cosa renderà il risultato faccia le tabelle affatto — [le varianti differiscono esattamente in questo](/blog/commonmark-gfm-and-the-flavours), ed è la prima cosa da controllare, non l'ultima.

## Come scegliere una strada

1. **Parti da se le righe possono lasciare la tua macchina.** Dati pubblici rendono questa una non-domanda. Nomi, stipendi, identificativi di pazienti o cifre non ancora rilasciate la rendono la sola domanda, ed elimina ogni convertitore ospitato che carica il file. La conversione lato browser e gli strumenti locali da riga di comando sono le due risposte, e la differenza tra loro non è visibile in nessuna lista di funzioni.
2. **Conta quante volte lo farai.** Una volta è un file trascinato e un incolla. Ogni settimana è uno script, e uno script vuol dire uno strumento da riga di comando o una chiamata di libreria — perché la parte di un processo settimanale che si finisce per dimenticare è sempre la persona che doveva aprire una scheda del browser.
3. **Controlla se devi anche riformare, non solo convertire.** Se la risposta include selezionare colonne, filtrare righe o ordinare, scegli uno strumento che fa lavoro sui dati e produce Markdown alla fine. Eliminare righe a mano da una tabella Markdown finita è la strada più lenta possibile e quella che introduce errori di trascrizione.
4. **Testa con la tua riga peggiore, non con un campione.** Prendi la riga con la virgola tra virgolette, la virgoletta e la pipe dentro, convertila, e leggi l'output confrontandolo con la fonte. Uno strumento che supera quella riga supererà il file; uno che la fallisce fallisce in silenzio e tutto il resto che dice di sé è irrilevante.
5. **Decidi sugli a capo dentro le celle prima di convertire, non dopo.** Se l'output verrà reso come HTML, `<br>` è giusto. Se verrà letto come testo semplice, uno spazio è giusto. Lo strumento ha già scelto per te, quindi scopri quale e scegli uno strumento che sia d'accordo, perché correggerlo dopo significa modificare ogni cella coinvolta.
6. **Guarda il file in cerca di una riga di intestazione prima che lo strumento decida.** Dieci secondi in un editor di testo, una riga digitata se manca. È il solo punto di questa lista che è gratis.

## Conclusione

La conversione in sé è un'intestazione, una riga di trattini e una riga per record, e potresti farla a mano. Se le righe sono ancora in un foglio di calcolo invece che in un file, [parti da lì invece](/blog/convert-excel-to-markdown-table). Quello che non puoi fare a mano — in modo affidabile, a qualunque volume — è rispettare le regole delle virgolette, e da lì viene ogni guasto silenzioso. Qualunque cosa legga il file come un CSV invece che come testo con delle virgole dentro otterrà giuste le virgole, i doppi apici e i record multi-riga; poi deve solo mascherare le pipe e decidere cosa fare degli a capo nelle celle. Se vuoi farlo nel browser senza caricare niente, [la conversione da CSV a tabella Markdown di TransformPipe](/csv-to-markdown) fa l'analisi RFC 4180, maschera le pipe, trasforma gli a capo dentro le celle in `<br>` e gestisce il BOM, gratis e senza installare niente. Se lo vuoi in uno script, usa uno strumento pensato per i dati tabellari. In ogni caso, tieni un file di prova di quattro righe con una virgola tra virgolette, un doppio apice, un a capo incorporato e una pipe dentro, e fai passare da lì qualunque cosa nuova prima di fidartene con dati veri.

## Domande frequenti

### Come convertire un CSV in una tabella Markdown?

Scrivi i nomi delle colonne come riga di intestazione separata da pipe, aggiungi una riga di separazione con celle `| --- |`, una per colonna, poi scrivi una riga per record con i valori separati da pipe. Fallo con uno strumento che analizza il CSV correttamente invece di dividere sulla virgola, e maschera ogni pipe nei valori come `\|`.

### Perché il mio CSV si è convertito in una sola colonna?

Perché il file non è separato da virgole. Gli export da foglio di calcolo in locale con la virgola come separatore decimale sono spesso separati da punto e virgola e mantengono comunque il nome `.csv`, e i file TSV sono separati da tabulazione. Apri la prima riga in un editor di testo, guarda cosa separa le intestazioni, e dillo al convertitore.

### Una cella di tabella Markdown può contenere un a capo?

No. Il formato è una riga per record senza sintassi di continuazione, quindi un vero a capo termina la riga. Un campo CSV che contiene un a capo deve diventare `<br>`, che si rende come interruzione una volta che il Markdown diventa HTML, oppure va appiattito a uno spazio. Il convertitore scelto sceglie una delle due, quindi scopri quale.

### Cosa succede a una virgola dentro un campo tra virgolette?

Con un vero parser, niente: le virgolette sono consumate come sintassi e la virgola resta dentro la cella. Con una divisione sulla virgola, il campo diventa due celle, la riga cresce più larga dell'intestazione, e siccome Markdown scarta le celle oltre il numero dell'intestazione, il valore alla fine di quella riga scompare senza alcun avviso.

### Come metto un carattere pipe in una cella di tabella Markdown?

Maschera come `\|`. È il solo meccanismo, e vale anche dentro gli span di codice inline — i backtick non proteggono una pipe, perché la riga viene divisa in celle prima che la sintassi inline venga analizzata. Un convertitore che non maschera le pipe aggiunge una colonna fantasma a ogni riga che ne contiene una.

### Il mio CSV non ha riga di intestazione. Cosa faccio?

Aggiungine una prima di convertire. Una tabella Markdown non può esistere senza intestazione, quindi un convertitore o promuove la tua prima riga di dati — perdendola — oppure inventa nomi segnaposto come `a, b, c`. Sai già cosa contengono le colonne; digitare una riga è la sola versione di questo che produce una tabella leggibile in futuro.

### Perché c'è un carattere strano prima della mia prima intestazione di colonna?

Un byte order mark, scritto all'inizio del file dall'export `CSV UTF-8` di Excel e da altri strumenti Windows. È invisibile negli editor e si attacca alla prima intestazione, quindi i confronti contro quell'intestazione falliscono senza motivo visibile. Leggi il file con una codifica che lo rimuove, come `utf-8-sig` in Python, oppure elimina i primi tre byte.

### La fonte di una tabella Markdown ha bisogno delle pipe allineate?

No. Riempire le celle così che le pipe si allineino serve solo a chi legge il Markdown come testo; l'output reso è identico comunque. Il riempimento aiuta la leggibilità e danneggia i diff, dato che modificare un valore riscrive ogni riga del blocco, quindi senza riempimento è di solito meglio per una tabella che vive in un repository.
