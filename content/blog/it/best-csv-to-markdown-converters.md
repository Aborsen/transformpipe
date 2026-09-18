---
title: "Il miglior convertitore da CSV a tabella Markdown nel 2026: tutte le opzioni a confronto"
description: "Confronto tra i convertitori da CSV e TSV a tabelle Markdown: come gestiscono campi tra virgolette, virgole incluse e interruzioni di riga in una cella"
date: 2026-09-08
tag: Conversione
keywords: convertire csv in tabella markdown, csv in markdown online, tsv in tabella markdown, csv in markdown da riga di comando, excel in tabella markdown, generatore di tabelle markdown da csv, convertire csv in markdown senza caricare file
---

Trasformare un CSV in una tabella Markdown sembra un lavoro di trova-e-sostituisci. Metti una barra verticale dove c'è ogni virgola, aggiungi una riga di trattini sotto la prima riga, fatto. Funziona finché non funziona più, e il file che lo rompe ha una virgola dentro un campo tra virgolette, oppure una descrizione di prodotto con un'interruzione di riga nel mezzo, oppure una colonna di percorsi di file con un carattere barra verticale dentro, e la tabella che ottieni ha il numero sbagliato di colonne in una riga che non noterai finché non lo farà qualcun altro.

### In breve

La differenza tra i convertitori da CSV a Markdown non sono le funzioni, è se analizzano il CSV come si deve o se lo dividono sulle virgole. Uno strumento che segue **RFC 4180** gestisce i campi tra virgolette, le virgole dentro le virgolette, le virgolette doppie che significano una virgoletta letterale, e le interruzioni di riga dentro una cella; uno strumento che divide sulle virgole storpia tutte e quattro le cose e non ti dice niente. Il **/csv-to-markdown** di un convertitore da browser fa l'analisi nel tuo browser senza caricare niente, e trasforma un'interruzione di riga dentro una cella in `<br>` perché una tabella Markdown non può contenerne una vera. **Pandoc** e **Miller** leggono entrambi CSV e TSV correttamente dalla riga di comando; **pandas.to_markdown** è la scelta giusta quando la tabella è l'ultima riga di un'analisi. Qualunque tu scelga, controlla una riga con una virgoletta dentro prima di fidarti del resto.

## Perché un CSV non diventa semplicemente una tabella

Un file CSV è un formato testuale con una specifica, e la specifica è breve abbastanza da leggerla in dieci minuti. RFC 4180 dice che i campi sono separati da virgole, i record da CRLF, e qualunque campo può essere racchiuso tra virgolette doppie. Una volta che un campo è tra virgolette, può contenere virgole, può contenere interruzioni di riga, e una virgoletta doppia dentro va scritta due volte. Questo è quasi tutto il documento, e ogni regola dentro esiste perché i dati di qualcuno contenevano il separatore.

Quindi la prima domanda su qualunque convertitore da CSV a tabella Markdown è se implementa quelle regole o le approssima. L'approssimazione è uno `split(',')` ed è ovunque: negli one-liner da shell, in metà degli snippet sul web, e dentro più strumenti di quanto vorresti sperare. Produce la risposta giusta per dati puliti, il che è quello che la rende così difficile da individuare. `Smith, John` dentro un campo tra virgolette diventa due celle, la riga ora è una cella più larga dell'intestazione, e a seconda di chi scrive dall'altra parte quella cella in più viene o scartata in silenzio o spinge una tabella fuori forma.

La seconda domanda è cosa succede all'uscita, perché le tabelle Markdown hanno le loro regole e sono più rigide di quelle del CSV. Una barra verticale termina una cella ovunque comparisca, quindi un valore che ne contiene una va escapato. Una cella non può contenere affatto un a capo — la tabella è basata su righe, una riga per linea, senza sintassi di continuazione — quindi un campo CSV con un paragrafo dentro deve essere appiattito o la tabella smette di essere una tabella. E non esiste una tabella Markdown senza una riga di intestazione, perché la riga di trattini sotto l'intestazione è quello che fa riconoscere una tabella a un parser in primo luogo. Le tabelle non sono nemmeno nel CommonMark puro, il che è una trappola separata trattata [nell'articolo sui dialetti](/blog/commonmark-gfm-and-the-flavours).

Terzo, c'è la questione di dove finisce il file. I foglio di calcolo sono tra i documenti più delicati che la maggior parte delle persone convertono: estratti di buste paga, liste clienti, export di fatture, risultati non ancora pubblicati. Un convertitore online che carica è un convertitore online che ora tiene le tue righe. Va bene per una tabella di licenze open source ed è un trasferimento di dati per tutto il resto, motivo per cui vale la pena farsi la domanda prima di trascinare il file sulla pagina.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| TransformPipe | Un file che hai e una tabella che ti serve ora | Analisi RFC 4180 nel browser, niente caricato, `<br>` per le interruzioni dentro cella | Gratis |
| Pandoc | Un CSV che è un passaggio in un documento più lungo | Lettori `csv` e `tsv` verso qualunque formato di output che sa scrivere | Gratis, GPL |
| Miller | Filtrare o rimodellare i dati mentre passano | `--c2m` converte CSV in Markdown con un solo flag | Gratis, BSD a due clausole |
| csvkit (`csvlook`) | Leggere un CSV nel terminale prima di convertirlo | Rende un CSV in una tabella a larghezza fissa compatibile con Markdown | Gratis, MIT |
| csv2md | Un comando in uno script | Diversi strumenti separati con questo nome; flag per delimitatore e intestazione | Gratis, MIT (i due sotto) |
| tablesgenerator.com | Modificare la tabella dopo l'importazione | Griglia in stile foglio di calcolo, caricamento CSV, incolla da Excel | Gratis (nessun account menzionato) |
| Estensioni VS Code | Il file è già aperto nel tuo editor | Incolla dagli appunti come tabella Markdown; evidenziazione colonne CSV | Gratis |
| `pandas.to_markdown` | La tabella è la fine di un'analisi | Un metodo su un DataFrame, tramite `tabulate` | Gratis, BSD a tre clausole |
| `tabulate` | Righe in Python che non sono un DataFrame | Formati di tabella `github` e `pipe` | Gratis, MIT |
| Copia-incolla da foglio di calcolo | Un intervallo selezionato, non un file intero | TSV negli appunti, più facile da dividere del CSV | Gratis |
| Un one-liner da shell | Un file che hai già letto e sai essere pulito | `awk` su un delimitatore, nessuna installazione | Gratis |
| Una finestra di chat con un assistente | Una manciata di righe che puoi controllare a occhio | Legge testo incollato, formatta una tabella | Varia |

## Le opzioni CSV e TSV a Markdown, una alla volta

### TransformPipe — ideale per un file che hai e una tabella che ti serve ora

TransformPipe legge un file `.csv` o `.tsv` nel tuo browser e ti restituisce una tabella Markdown, con la prima riga come intestazione. Non serve installazione né account, e senza aver fatto l'accesso il file non viene inviato da nessuna parte — viene letto dal tuo disco dalla pagina, analizzato, e riscritto come testo.

| Pro | Contro |
| --- | --- |
| Un'analisi RFC 4180 vera: campi tra virgolette, virgole incluse, virgolette doppie, celle multi-riga | Un file alla volta; non è un lavoro batch su una directory |
| Un'interruzione di riga dentro una cella diventa `<br>` invece di rompere la tabella | La prima riga viene trattata come intestazione, quindi un file senza intestazione ne va aggiunta una |
| Barre verticali e backslash nei valori sono escapati, quindi un percorso o un'espressione regolare non divide una riga | Nessun allineamento con i due punti: ogni colonna esce allineata a sinistra a meno che non modifichi la riga separatrice |
| Il delimitatore viene individuato dalla prima riga, quindi un export con punto e virgola funziona senza flag | Il lavoro lo fa il browser, quindi un export molto grande è limitato dalla macchina |

**Prezzo:** gratis. Un account aggiunge storico, condivisione e un'API, anche questi gratis.

**Dettagli tecnici e funzioni**

- Il parser sono le regole RFC 4180 e niente altro: una virgoletta apre un campo, una virgoletta doppia dentro una è una virgoletta letterale, e un a capo dentro le virgolette appartiene alla cella invece di terminare la riga
- Il delimitatore viene contato fuori dalle virgolette sulla prima riga tra virgola, tab, punto e virgola e barra verticale, e il più frequente vince; un'estensione `.tsv` forza il tab
- Un byte order mark viene rimosso e le interruzioni di riga CRLF vengono normalizzate prima dell'analisi, quindi un file esportato da Excel su Windows si comporta come qualunque altro
- Le righe corte vengono imbottite con celle vuote fino alla larghezza della riga più larga, quindi un file irregolare produce comunque una tabella rettangolare
- Il nome del file diventa un H1 sopra la tabella, perché una tabella senza titolo è una tabella che nessuno saprà collocare una settimana dopo
- La stessa conversione gira da un'API REST, una CLI senza dipendenze che scegli la conversione dall'estensione del file, una GitHub Action e un server MCP

**Per chi è?** Chiunque abbia un export da foglio di calcolo e un documento in cui incollarlo, specialmente se le righe non sono pubbliche. Tutta la conversione avviene sulla tua macchina, cosa che puoi confermare guardando la scheda di rete non fare niente mentre gira.

### Pandoc — ideale quando il CSV è un passaggio in un documento più lungo

Pandoc è un convertitore di documenti da riga di comando scritto in Haskell, e la sua lista di formati di input include `csv` (che il manuale descrive come una tabella RFC 4180) e `tsv`. Questo lo rende l'unico strumento qui che prenderà un CSV e ti darà Markdown, HTML, LaTeX, DOCX o EPUB con lo stesso comando e un `-t` diverso.

| Pro | Contro |
| --- | --- |
| Legge CSV e TSV nativamente, nessuno script di supporto | Un'installazione, e grande |
| Scrive su ogni formato di output che Pandoc supporta, dallo stesso input | Il dialetto della tabella Markdown dipende da quale estensione dello scrittore è attiva |
| `--standalone` produce un documento completo invece di un frammento | Nessun controllo sul delimitatore: virgola per `csv`, tab per `tsv` |
| Già installato su moltissime macchine di build della documentazione | Più strumento di quanto serva a una singola tabella |

**Prezzo:** gratis, licenza GPL.

**Dettagli tecnici e funzioni**

- `pandoc -f csv -t markdown data.csv` scrive una tabella a barre; `-f tsv` per l'input separato da tab (verificato su pandoc.org, l'8 settembre 2026)
- Il primo record del file viene letto come riga di intestazione, la stessa assunzione che fa ogni altro strumento qui
- Quale sintassi di tabella Markdown esce dipende dalle estensioni della tabella dello scrittore — `pipe_tables` è quella che corrisponde a GitHub, e una tabella a griglia o semplice non verrà mostrata in un parser GFM
- Lo stesso file può andare direttamente a HTML, e `--standalone` lo racchiude in un documento con una testata e stili invece di lasciarti un frammento

**Per chi è?** Chiunque il cui CSV sia un input tra diversi in un build che già usa Pandoc. Se la destinazione è una pagina web piuttosto che Markdown, andarci direttamente è di solito la strada più corta — [il confronto tra convertitori](/blog/best-markdown-to-html-converters) tratta cosa usare per quel tratto.

### Miller — ideale per rimodellare i dati mentre passano

Miller è un processore da riga di comando per CSV, TSV, JSON e JSON Lines, scritto in Go senza dipendenze runtime. Markdown è uno dei suoi formati di output, quindi una conversione è un flag piuttosto che uno script.

| Pro | Contro |
| --- | --- |
| `--c2m` converte CSV in una tabella Markdown con un solo flag | Un'altra installazione, e un linguaggio di comandi da imparare |
| Filtra, ordina, taglia e rinomina colonne nello stesso comando che converte | L'output non è imbottito di default, il che rende più difficile leggere il file grezzo |
| Legge anche le tabelle Markdown, oltre a scriverle | Verbi e flag sono una sintassi vera, non una singola opzione |
| Un unico binario statico, nessun runtime | Eccessivo se stai convertendo un file una volta sola |

**Prezzo:** gratis, open source, licenza BSD a due clausole (verificato su github.com/johnkerl/miller, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- `--omd` seleziona l'output Markdown, `--imd` l'input Markdown, e le scorciatoie `--c2m` e `--m2c` fanno CSV in Markdown e viceversa
- `--omd-aligned` imbottisce le colonne così il codice sorgente della tabella è leggibile per un umano che la modifica dopo
- `--right-align-numeric` emette `---:` nella riga separatrice per le colonne numeriche, che è la sintassi di allineamento che GFM capisce
- Perché la conversione è un formato di output piuttosto che una modalità, `mlr --c2m sort -f region cut -f region,total data.csv` filtra e converte in un solo passaggio

**Per chi è?** Chiunque voglia un sottoinsieme del file piuttosto che tutto — l'ultimo trimestre, tre colonne su undici, righe sopra una soglia. Farlo nel convertitore batte convertire tutto e cancellare righe in Markdown dopo.

### csvlook di csvkit — ideale per leggere il file prima di convertirlo

csvkit è una suite di strumenti da riga di comando per CSV, scritta in Python. `csvlook` rende un CSV nel terminale in quello che la sua stessa documentazione chiama un formato a larghezza fissa compatibile con Markdown — una tabella che puoi leggere, e incollare.

| Pro | Contro |
| --- | --- |
| L'output è documentato come compatibile con Markdown, quindi di solito si incolla direttamente | Costruito per guardare i dati, non per produrre file |
| Individua il dialetto del CSV, quindi delimitatori strani sono spesso gestiti senza flag | L'imbottitura a larghezza fissa rende il codice sorgente verboso |
| Il resto di csvkit — `csvcut`, `csvgrep`, `csvsql` — si combina con esso | Serve Python e pip |
| L'inferenza dei tipi allinea le colonne numeriche | Le opzioni di troncamento possono silenziosamente abbreviare celle larghe |

**Prezzo:** gratis, licenza MIT (verificato su github.com/wireservice/csvkit, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- `csvlook data.csv` stampa la tabella; le pipe funzionano, quindi `csvcut -c 1,3 data.csv | csvlook` la restringe prima
- `--max-rows`, `--max-columns` e `--max-column-width` limitano cosa viene mostrato, e ognuno di essi cambia la tabella invece che solo la vista
- `--no-inference` disattiva il rilevamento dei tipi, cosa che conta per colonne di identificatori che sembrano numeri
- `--snifflimit 0` disattiva il rilevamento del dialetto quando l'ipotesi è sbagliata

**Per chi è?** Persone che vivono in un terminale e vogliono vedere il file prima di decidere qualunque cosa su di esso. Tratta l'output Markdown come una comodità piuttosto che il punto, e controlla i flag di troncamento prima di incollare una tabella larga.

### csv2md — ideale per una riga in uno script, una volta scelto quale

Non esiste un solo csv2md. Ci sono diversi strumenti non collegati con questo nome, in linguaggi diversi, con flag diversi, e cercarne uno restituisce gli altri. Due sono facili da verificare: uno in Python installato con pip, e uno in Ruby installato come gem.

| Pro | Contro |
| --- | --- |
| Fa esattamente un lavoro, quindi non c'è niente da configurare | La collisione di nomi è un rischio vero quando scrivi la documentazione di installazione |
| La versione Python accetta flag per delimitatore, carattere di virgoletta e allineamento | Piccoli strumenti a scopo singolo arrivano e se ne vanno |
| La versione Ruby inverte la conversione, da tabella Markdown a CSV | Un altro gestore di pacchetti nel tuo build |
| Legge da stdin, quindi si inserisce in una pipeline | Il comportamento differisce tra gli strumenti che condividono il nome |

**Prezzo:** gratis, licenza MIT — sia l'implementazione Python sia quella Ruby (verificato su github.com/lzakharov/csv2md e github.com/jonmagic/csv2md, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Lo strumento Python (`pip install csv2md`) documenta `-d` per il delimitatore, `-q` per il carattere di virgoletta, `-C` per selezionare le colonne, `-c` e `-r` per l'allineamento a centro e a destra, e `-H` per dire che il file non ha una riga di intestazione — in quel caso genera intestazioni in stile foglio di calcolo a, b, c
- Quel flag `-H` vale la pena notarlo: è l'unico strumento qui che risponde alla domanda del file senza intestazione con qualcosa di diverso da "la tua prima riga di dati è ora l'intestazione"
- Lo strumento Ruby (`gem install csv2md`) converte CSV in una tabella Markdown in stile GitHub e accetta `-r` per andare nella direzione opposta

**Per chi è?** Script che convertono ripetutamente un file di forma conosciuta. Fissa il pacchetto esatto nelle tue istruzioni, perché "installa csv2md" è un consiglio ambiguo.

### tablesgenerator.com — ideale per modificare la tabella dopo l'importazione

Tables Generator è uno strumento da browser che ti dà una griglia stile foglio di calcolo e genera markup da essa, Markdown tra diversi formati. Il suo valore non è la conversione, sono i venti minuti dopo in cui stai correggendo la tabella.

| Pro | Contro |
| --- | --- |
| Importa un file CSV oppure incolla un intervallo da Excel, Google Sheets o LibreOffice | Le tue righe passano per una pagina ospitata |
| Modifica celle, inserisci e sposta righe e colonne, trasponi l'intera tabella | Una griglia ha limiti di dimensione pratici: la pagina indica un intervallo valido da 1 a 500 righe e da 1 a 20 colonne (verificato su tablesgenerator.com, l'8 settembre 2026) |
| Controlli di allineamento per colonna, e annulla | La modifica manuale non scala oltre una schermata |
| Genera LaTeX, HTML e MediaWiki dalla stessa griglia | Non scriptabile |

**Prezzo:** gratis; nessun account o pagamento è menzionato nella pagina (verificato su tablesgenerator.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Importazione da caricamento di file CSV, da un incolla di Markdown o HTML, oppure da un intervallo di foglio di calcolo copiato
- Trova e sostituisci, formattazione dei numeri, inserimento e rimozione di righe e colonne, trasposizione, salvataggio automatico locale
- La pagina dichiara il supporto per la sintassi delle tabelle GitHub Flavored Markdown, che è il dialetto su cui la maggior parte dei parser si accorda
- Copia negli appunti, oppure scarica il risultato come CSV

**Per chi è?** Chiunque assembli una tabella a mano da più di una fonte, oppure corregga i titoli e l'allineamento di una tabella convertita prima di pubblicarla. Non è lo strumento per righe confidenziali, e non è lo strumento per un file con diecimila di esse.

### Estensioni VS Code — ideali quando il file è già aperto nel tuo editor

Se il CSV è nel tuo repository, la strada più corta è l'editor in cui è già aperto. Due estensioni coprono le due metà del lavoro: una incolla un intervallo di foglio di calcolo copiato come tabella Markdown, l'altra rende leggibile il CSV stesso.

| Pro | Contro |
| --- | --- |
| Nessuna nuova applicazione: la conversione avviene dove vive il file | La qualità e la manutenzione delle estensioni variano |
| Guidata dagli appunti, quindi funziona da Excel e Sheets oltre che dai file | Ogni estensione fa una parte del lavoro |
| Gratis | Solo nell'editor: niente qui gira in CI |
| L'evidenziazione delle colonne rende visibile una virgoletta rotta prima di convertire | Il comportamento sui delimitatori strani dipende dall'estensione |

**Prezzo:** gratis (verificato su marketplace.visualstudio.com, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Excel to Markdown table (csholmq) converte un intervallo di foglio di calcolo copiato negli appunti in una tabella Markdown, dalla command palette o con Shift+Alt+V, e legge un prefisso `^l`, `^c` o `^r` su un'intestazione per impostare l'allineamento di quella colonna
- Rainbow CSV (mechatroner) colora le colonne di un CSV o TSV così una virgoletta mal posizionata è visibile come un cambio di colore, offre l'allineamento delle colonne, e include un comando per copiare in formato Markdown
- La documentazione di Rainbow CSV dichiara che il suo tipo di file Dynamic CSV gestisce i campi multi-riga escapati tra virgolette doppie, che è il caso RFC 4180 che la maggior parte degli evidenziatori sbaglia
- Entrambe lavorano sul file com'è: nessuna aggiunge un passaggio di build

**Per chi è?** Sviluppatori che scrivono documentazione accanto ai dati. Usale in coppia — una per controllare il file, una per produrre la tabella.

### pandas.to_markdown — ideale quando la tabella è la fine di un'analisi

Se le righe sono già passate per pandas, la tabella Markdown è a una sola chiamata di metodo di distanza. `DataFrame.to_markdown()` esiste e richiede che il pacchetto `tabulate` sia installato.

| Pro | Contro |
| --- | --- |
| Un metodo, alla fine di un lavoro che stavi già facendo | L'indice è incluso di default, il che produce una prima colonna senza nome |
| Il lettore CSV di pandas gestisce le virgolette, le codifiche e i delimitatori correttamente | Una dipendenza pesante da aggiungere per una tabella |
| Filtra, raggruppa e ordina prima di convertire, che è di solito il motivo per cui sei qui | Serve Python e uno script, non il rilascio di un file |
| `tablefmt` passa attraverso a tabulate, quindi lo stile della tabella è selezionabile | Non è un convertitore: è una chiamata a libreria dentro il tuo codice |

**Prezzo:** gratis. pandas ha licenza BSD a tre clausole; tabulate, che richiede, è MIT.

**Dettagli tecnici e funzioni**

- `pd.read_csv('data.csv').to_markdown(index=False)` è tutta la conversione, e `index=False` è la parte che la gente dimentica (verificato su pandas.pydata.org, l'8 settembre 2026)
- Il parametro `index` è di default `True`, quindi l'output predefinito porta i numeri di riga in una colonna senza intestazione
- `tablefmt` viene passato a tabulate, e il default documentato emette due punti di allineamento nella riga separatrice
- Tutto quello che pandas fa a un CSV in ingresso — inferenza dei tipi, `na_values`, `thousands`, `encoding` esplicito — succede prima che la tabella venga scritta, nel bene e nel male

**Per chi è?** Chiunque produca una tabella da dati che sta già calcolando: un report settimanale, un risultato di notebook, un riassunto aggiunto a un file Markdown da uno script.

### tabulate — ideale quando hai righe ma non un DataFrame

tabulate è la libreria che pandas chiama, e prende una semplice lista di liste. Se le tue righe vengono da un cursore di database, una risposta JSON o `csv.reader`, questa è la dipendenza più piccola.

| Pro | Contro |
| --- | --- |
| Funziona su qualunque iterabile di righe; nessun DataFrame necessario | La lettura del CSV la fai tu |
| I formati `github` e `pipe` producono entrambi tabelle Markdown | Niente da eseguire: è una libreria, non un comando |
| Piccola, senza catena di dipendenze dietro | Nessuna opinione sui tuoi tipi di dati |

**Prezzo:** gratis, licenza MIT (verificato su pypi.org, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- `tabulate(rows, headers=header, tablefmt='github')` produce una tabella in stile GFM; `tablefmt='pipe'` aggiunge due punti di allineamento nella riga separatrice (verificato su pypi.org, l'8 settembre 2026)
- Accompagnala con il modulo `csv` della libreria standard, che implementa le regole di virgolettatura, piuttosto che con `line.split(',')`
- La gestione dell'intestazione è esplicita: passa tu stesso `headers`, così un file senza intestazione è una tua decisione piuttosto che dello strumento

**Per chi è?** Script Python che hanno già righe in memoria e serve una tabella alla fine. Prendi `csv.reader` per l'input e tabulate per l'output, e avrai evitato entrambi i bug che ha la versione ingenua.

### Copia e incolla da un foglio di calcolo — ideale per un intervallo, non per un file

Copiare celle da Excel, Numbers o Google Sheets metti negli appunti testo separato da tab, non CSV. Questo conta: i tab quasi mai compaiono dentro un valore, quindi dividere su di essi è molto più sicuro che dividere sulle virgole. È il motivo per cui la strada degli appunti funziona così spesso.

| Pro | Contro |
| --- | --- |
| Nessun file da esportare, nessuno strumento da installare | Converte una selezione, non una fonte di verità |
| Il TSV degli appunti evita del tutto il problema della virgola incorporata | Le formule arrivano come valori; la formattazione non arriva affatto |
| Funziona da un intervallo, che è spesso tutto quello che volevi | Una cella con un'interruzione di riga si incolla comunque come più righe |
| Qualunque convertitore consapevole del TSV lo accetta direttamente | Le celle unite collassano in modi che devi controllare |

**Prezzo:** gratis.

**Dettagli tecnici e funzioni**

- Un intervallo copiato è TSV, quindi un percorso di conversione `.tsv` o un'estensione da incolla lo gestisce senza un'impostazione di delimitatore
- Le celle che contengono tab o a capo vengono messe tra virgolette negli appunti dal foglio di calcolo, il che significa che le regole di virgolettatura si applicano comunque
- La formattazione dei numeri è una proprietà di visualizzazione: una cella che mostra £1.234,00 può metter negli appunti `1234`, e una cella che mostra un valore arrotondato può metterci la piena precisione

**Per chi è?** Chiunque converta parte di un foglio una volta sola. Se lo stesso intervallo va convertito ogni settimana, esporta il file e scrivi uno script invece.

### Un one-liner da shell — ideale per un file che hai già letto

`awk -F, '{...}'` è il convertitore da CSV a tabella Markdown più veloce da scrivere e il più facile da sbagliare. È una scelta legittima per esattamente una situazione: un file che hai aperto, guardato, e sai non contenere virgolette, delimitatori incorporati o interruzioni di riga nelle celle.

| Pro | Contro |
| --- | --- |
| Niente da installare; funziona su qualunque macchina con una shell | `-F,` è una divisione, non un'analisi CSV |
| Va bene per file generati da macchina con forma fissa | Fallisce silenziosamente sui campi tra virgolette, che è il peggior modo di fallire che esista |
| Facile da leggere e adattare | Escapare le barre verticali e appiattire gli a capo è tutto a tuo carico |

**Prezzo:** gratis.

**Per chi è?** Qualcuno che converte output che ha generato lui stesso, in uno script che verrà cancellato dopo. Per qualunque cosa venga da un foglio di calcolo, un export di database o un'altra persona, usa uno strumento con un parser. Il costo dell'one-liner non è che si rompe; è che rompe una riga in mezzo a cento.

### Una finestra di chat con un assistente — ideale per una manciata di righe che puoi controllare

Incollare righe in un assistente e chiedere una tabella Markdown funziona, ed è l'unica opzione qui che sistemerà anche i tuoi titoli. Il problema è che sta generando testo piuttosto che trasformandolo, quindi l'output non è garantito contenere gli stessi valori dell'input.

| Pro | Contro |
| --- | --- |
| Gestisce input disordinati e semi-strutturati che un parser rifiuta | I valori possono essere riformattati, arrotondati o riordinati |
| Rinominerà i titoli e riordinerà le colonne se richiesto | Nessuna garanzia che ogni riga sopravviva, in particolare su input lunghi |
| Niente da installare | Incollare significa che i dati lasciano la tua macchina |
| Utile per l'ultimo angolo scomodo di una tabella | Non riproducibile: lo stesso incolla due volte può differire |

**Prezzo:** varia in base all'assistente.

**Per chi è?** Chiunque abbia venti righe sotto gli occhi tutte. Per un export di buste paga, usa un parser; per una lista scarabocchiata di tre colonne, questo è più rapido di tutto quello sopra. [Ottenere un risultato controllato da un assistente e portarlo su una pagina](/blog/ai-output-to-a-shareable-page) è un esercizio breve tutto suo.

## Cosa fa RFC 4180 a un convertitore

Questa è la sezione che la pagina di uno strumento omette da sola, perché ogni voce è un modo di fallire in silenzio. Prendi un file rappresentativo — uno vero, con dentro ancora le righe scomode — e controlla ognuno di questi prima di affidarti a qualunque cosa.

**Una virgola dentro un campo tra virgolette.** `"Smith, John",Sales,2026` sono tre campi, non quattro. Un parser legge le virgolette e mantiene la virgola; una divisione produce quattro celle, e una riga più larga di una cella dell'intestazione. La regola di GFM è che le celle in eccesso oltre il conteggio dell'intestazione vengono scartate, quindi `Sales` e `2026` si spostano a sinistra e l'ultimo valore svanisce. Niente ti avvisa. La riga dice semplicemente qualcosa diverso dal file.

**Una virgoletta doppia è una virgoletta.** Dentro un campo tra virgolette, `""` significa una `"` letterale. Quindi `"She said ""no""."` è un campo che si legge: She said "no". Uno strumento che rimuove le virgolette con un'espressione regolare lascia dentro le doppie, e ottieni `She said ""no""` nella tua tabella. È cosmetico finché il valore non è un esempio di codice o una misura in pollici, a quel punto è sbagliato.

**Un'interruzione di riga dentro una cella.** Questa è quella senza una risposta pulita. RFC 4180 permette un a capo dentro un campo tra virgolette, e i foglio di calcolo li producono costantemente — blocchi di indirizzo, colonne di note, qualunque cosa in cui una persona ha digitato Alt+Invio. Una tabella Markdown non ha modo di rappresentarlo: la tabella è una riga per linea, e un a capo dentro una cella termina la riga. Ogni strumento deve scegliere una menzogna. Eliminare l'interruzione unisce due frasi. Dividere la riga crea una seconda riga malformata. Sostituire l'interruzione con `<br>` mantiene l'interruzione visiva quando il Markdown diventa HTML, e lascia un tag HTML in un file che potrebbe non essere reso come HTML. TransformPipe sostituisce con `<br>`, sul principio che un tag visibile batte una tabella silenziosamente rotta — ma è uno scambio, e [cosa fa Markdown con le interruzioni di riga in generale](/blog/markdown-line-breaks-and-lists) spiega perché non c'è un'opzione migliore disponibile dentro una tabella.

**Una barra verticale dentro un valore.** Il CSV non si preoccupa delle barre verticali; Markdown se ne preoccupa moltissimo. Una `|` non escapata termina la cella ovunque comparisca, anche dentro i backtick, quindi un valore contenente `a|b` aggiunge una colonna fantasma a quella riga. Va escapata come `\|` in uscita. Questo è il fallimento che inganna i convertitori scritti da persone che hanno testato con nomi e numeri: compare in percorsi di file, espressioni regolari, comandi shell e qualunque colonna che contenga una lista di opzioni. Se convertiti dati così, metti una barra verticale in una cella di prova apposta e guarda cosa esce. [L'articolo sulle tabelle](/blog/markdown-tables-that-survive-conversion) tratta cosa fa l'escape dall'altra parte.

**Un file senza riga di intestazione.** I CSV generati da macchina spesso non ne hanno una — un export di log, un dump di database, un feed di sensori. Una tabella Markdown non può esistere senza un'intestazione, perché la riga separatrice sotto è quello che identifica la tabella al parser. Quindi ogni convertitore fa una di tre cose: promuove la tua prima riga di dati a intestazione, il che perde il significato di quella riga; genera titoli segnaposto come a, b, c oppure Colonna 1; oppure si rifiuta. La maggior parte scegli la prima opzione in silenzio, motivo per cui un file di log convertito ha così spesso un timestamp dove dovrebbero stare i nomi delle colonne. Se il tuo file non ha intestazione, aggiungine una prima di convertire. È una riga, ed è l'unica versione di questo che finisce bene.

**Il delimitatore non è sempre una virgola.** Un CSV esportato in un locale che usa la virgola come separatore decimale è molto spesso delimitato da punto e virgola, e finisce comunque in `.csv`. I file separati da tab sono lo stesso formato con un separatore diverso. Un convertitore che assume una virgola trasforma ogni riga in una singola cella che contiene tutto — un fallimento evidente, almeno, che è più di quanto offrano gli altri. Cerca un'opzione di delimitatore, oppure uno strumento che individua la prima riga.

**I byte prima del primo campo.** Un file salvato da Excel su Windows può iniziare con un byte order mark e usare interruzioni di riga CRLF. Il BOM si attacca alla prima intestazione di colonna, dove è invisibile nell'editor e rompe qualunque confronto contro quell'intestazione. Il CRLF lascia un ritorno a capo estraneo alla fine di ogni ultimo campo. Entrambi sono banali da gestire per un convertitore e nessuno dei due viene gestito da una divisione ingenua.

**Righe che non hanno tutte la stessa lunghezza.** Gli export reali hanno righe irregolari. La larghezza della tabella Markdown è impostata dall'intestazione, e le righe del corpo vengono imbottite o troncate per corrispondere senza commento. Imbottire una riga corta è quasi sempre giusto. Troncare una lunga butta via dati, e la riga che viene troncata è di solito quella con il problema di virgolettatura — quindi una riga irregolare vale la pena investigarla piuttosto che imbottirla.

## Dove una tabella Markdown semplicemente non può andare

Alcune delle cose che un foglio di calcolo contiene non hanno nessun equivalente Markdown, e sapere quali parti ti fa risparmiare la ricerca di un convertitore che le gestisca. Nessuno lo fa.

**Celle unite.** Non esiste colspan o rowspan in una tabella Markdown. Un'intestazione unita che si estende su tre colonne deve diventare un titolo in una colonna, con le altre due vuote, oppure tre titoli ripetuti. Se la fonte si basa su celle unite per la sua struttura, la tabella va riprogettata piuttosto che convertita.

**Formule e formati numerici.** Un export CSV contiene valori, non formule — quella perdita succede prima che il convertitore veda il file. La formattazione dei numeri va nello stesso modo: simboli di valuta, separatori delle migliaia, percentuali e formati di data sono proprietà di visualizzazione del foglio di calcolo, e quello che finisce nel CSV è quello che l'esportatore ha scelto di scrivere. Se la tabella convertita mostra `0.4567` dove il foglio mostrava 45,67%, è stato l'export a farlo, non la conversione.

**Tabelle molto larghe.** Le tabelle Markdown non vanno a capo né scorrono da sole. Dodici colonne di prosa si rendono come una tabella più larga della pagina, e cosa succede dopo dipende da qualunque cosa la mostri — overflow orizzontale, una compressione, oppure una barra di scorrimento se l'HTML circostante ne fornisce una. Tagliare colonne prima di convertire, oppure accettare che la tabella verrà letta solo su uno schermo largo.

**Ordinamento, filtri e totali.** Una tabella Markdown è testo. Non ha ordinamento, non ha filtro, non ha una riga di totali che si ricalcola. Se chi legge deve interrogare i numeri, la tabella è l'output sbagliato e un link al CSV è quello giusto. Le tabelle Markdown servono per dati abbastanza piccoli e abbastanza definitivi da leggere.

## Come scegliere

1. **Controlla una riga difficile prima di ogni altra cosa.** Trova un valore nel tuo file con una virgoletta, una virgola dentro le virgolette o un'interruzione di riga, converti quel file, e guarda quella riga nell'output. Se sopravvive, lo strumento ha un parser; se non sopravvive, nessun'altra funzione conta, perché il fallimento è silenzioso e il file è ora sottilmente sbagliato.
2. **Decidi se le righe possono lasciare la macchina.** Per una tabella di dati pubblici questo non è una considerazione. Per qualunque cosa con nomi, salari o numeri non pubblicati dentro, la conversione lato browser o uno strumento locale da riga di comando sono le uniche due opzioni, e la differenza non è visibile in un confronto di funzioni.
3. **Conta quante volte lo farai.** Una volta è un file rilasciato. Ogni settimana è uno script, e uno script parla a favore di Pandoc, Miller o una chiamata a libreria, perché una persona che pilota una scheda del browser è la parte di un processo settimanale che alla fine viene dimenticata.
4. **Chiediti se vuoi tutte le righe.** Se la risposta è no, converti con qualcosa che sappia anche filtrare. Cancellare righe da una tabella Markdown a mano è il modo più lento possibile di farlo, ed è da dove vengono gli errori di trascrizione.
5. **Guarda se il tuo file ha un'intestazione, prima che lo decida lo strumento per te.** Se non ne ha, aggiungine una. La risposta di ogni convertitore a un file senza intestazione perde qualcosa, e la versione in cui fornisci tu i nomi delle colonne è l'unica che produce una tabella che qualcuno potrà leggere in seguito.

## Conclusione

Il miglior convertitore da CSV a tabella Markdown è quello che legge il file come CSV piuttosto che come testo con delle virgole dentro — [la guida elenca ogni trappola per sintomo](/blog/convert-csv-to-markdown-table) — perché tutto il resto del lavoro è facile e quella parte è l'unica che fallisce senza dirtelo. Per un file sul tuo disco e un documento in cui incollarlo, [la conversione da CSV a tabella Markdown del convertitore da browser qui sopra](/csv-to-markdown) fa l'analisi RFC 4180 nel tuo browser, escapa le barre verticali, trasforma le interruzioni di riga dentro cella in `<br>`, e non carica niente — gratis, senza installazione. Per un lavoro ricorrente, metti Miller o Pandoc nello script. Per una tabella alla fine di un'analisi che già stai eseguendo in Python, `to_markdown` era già lì da sempre. Qualunque tu scelga, tieni un file con una virgola tra virgolette e un a capo incorporato come tuo test, e falli passare attraverso qualunque cosa nuova prima di fidarti con righe vere.

## Domande frequenti

### Come convertire un CSV in una tabella Markdown senza caricare il file?

Usa un convertitore che gira nel browser o uno che gira sulla tua macchina. Uno strumento lato browser legge il file con l'API dei file della pagina stessa e non lo invia mai, cosa che puoi verificare aprendo la scheda di rete e guardando che non succede niente; uno strumento da riga di comando come Miller o Pandoc non tocca affatto la rete.

### Cosa succede alle virgole dentro campi tra virgolette?

In uno strumento con un vero parser CSV, niente — le virgolette vengono lette, la virgola resta dentro la cella, e la riga mantiene il suo numero di colonne. In uno strumento che divide sulle virgole, il campo diventa due celle e la riga cresce di una colonna, e siccome Markdown scarta le celle oltre il conteggio dell'intestazione, il valore alla fine di quella riga scompare senza avviso.

### Una cella di tabella Markdown può contenere un'interruzione di riga?

No. Una tabella Markdown è basata su righe, una riga per linea, senza sintassi di continuazione, quindi un vero a capo dentro una cella termina la riga. I convertitori gestiscono un campo CSV che contiene un'interruzione di riga sostituendola con `<br>`, che si rende come un'interruzione quando il Markdown diventa HTML, oppure appiattendola in uno spazio — e la scelta è del convertitore, quindi controlla quale ha fatto il tuo.

### Cosa fanno i convertitori con un CSV senza riga di intestazione?

La maggior parte promuove la prima riga di dati a intestazione, perché una tabella Markdown non può esistere senza una. Alcuni strumenti offrono un flag che genera nomi segnaposto invece — il `csv2md` in Python documenta `-H` esattamente per questo. La risposta affidabile è aggiungere tu stesso una riga di intestazione al file prima di convertire.

### Come convertire un file TSV invece di un CSV?

Qualunque strumento con un'opzione di delimitatore accetta un tab; diversi lo rilevano dall'estensione del file. Pandoc ha un lettore `tsv` separato, Miller legge il TSV nativamente, e un convertitore che individua il delimitatore dalla prima riga lo gestisce senza che gli venga detto. I dati degli appunti copiati da un foglio di calcolo sono già separati da tab, motivo per cui incollare spesso funziona meglio che esportare.

### Una tabella Markdown mantiene l'allineamento delle colonne dal foglio di calcolo?

No, e non ha concetto di allineamento oltre tre opzioni per colonna, impostate da due punti nella riga separatrice. Alcuni strumenti emettono quei due punti — il formato `pipe` di tabulate sì, il suo formato `github` no — e alcuni lasciano ogni colonna allineata a sinistra perché tu la modifichi. L'allineamento a livello di cella, le celle unite e la formattazione numerica non esistono affatto in Markdown.

### Convertire da Excel a Markdown è lo stesso lavoro di CSV a Markdown?

Quasi. Salva il foglio come CSV ed è lo stesso lavoro, con le stesse regole di virgolettatura. Copia un intervallo negli appunti invece e ottieni testo separato da tab, più facile da dividere in sicurezza perché i tab raramente compaiono dentro i valori — ma le formule sono già diventate valori e la formattazione delle celle è già stata scartata nel momento in cui viene prodotto entrambi i formati.
