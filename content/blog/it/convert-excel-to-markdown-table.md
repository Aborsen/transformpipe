---
title: "Da Excel a tabella Markdown: ogni strada, e cosa perde ciascuna"
description: "Come trasformare un intervallo Excel in una tabella Markdown, e cosa succede a date, zeri iniziali, celle unite e alla codifica del file lungo il percorso"
updated: 2026-09-14
date: 2026-09-03
tag: Conversione
keywords: excel in tabella markdown, convertire excel in markdown, xlsx in tabella markdown, csv excel in markdown, incollare excel in markdown, foglio di calcolo in tabella markdown, generatore tabella markdown da excel, csv excel codifica utf-8
---

Un foglio di calcolo e una tabella Markdown sembrano la stessa cosa disegnata due volte. Non lo sono. Il primo è una griglia di celle con tipi, formati, formule e regioni che si estendono su più colonne; la seconda è un formato di testo basato su righe, dove una riga è una riga, una cella finisce a un carattere pipe, e tutto è una stringa. Passare dal primo alla seconda non è un problema di rendering. È una decisione su cosa buttare via.

### In breve

La strada che non richiede niente da Excel è **caricare direttamente il file `.xlsx`** in un convertitore che legge lo zip di XML del foglio di lavoro — ogni foglio diventa una tabella a sé, con un indice quando ce n'è più di uno. Dove non è possibile, salva il foglio come **CSV UTF-8** e convertilo — la strada che funziona ovunque, e costa formule, formattazione e ogni foglio tranne quello attivo. Per un intervallo selezionato, **copia e incolla** è più rapido: la clipboard di Excel porta una versione delle celle separata da tabulazioni, più facile da dividere del CSV perché le tabulazioni quasi non compaiono mai dentro un valore. Aspettati problemi in tre punti precisi: **zeri iniziali e numeri a 16 cifre**, che Excel ha già distrutto quando il valore è stato digitato; **celle unite**, che non hanno alcun equivalente Markdown; e **codifica**, perché il semplice `CSV (delimitato da virgole)` scrive la codepage ANSI del tuo sistema invece di UTF-8. Controlla una riga con un carattere accentato, una con un numero lungo e una con una virgola dentro prima di fidarti delle altre novecento.

L'attrito raramente è la conversione. È che la tabella che ottieni è sbagliata in un modo sottile che nessuno nota finché non è pubblicata. Un codice articolo che nel foglio leggeva `00417` sulla pagina si legge `417`. Una data che nel foglio leggeva `03/09/2026` si legge per metà dei tuoi lettori come il tre settembre e per l'altra metà come il nove marzo. Un'intestazione che occupava tre colonne è collassata in una cella e due spazi vuoti, e le colonne sottostanti sono ora etichettate con niente.

Niente di tutto ciò è colpa del convertitore, e questo è il punto da capire subito. La maggior parte del danno avviene dentro il foglio di calcolo — nel momento in cui un valore è stato digitato, o nel momento in cui Excel ha scritto un file di testo — e nessuno strumento a valle può invertirlo. Quello che fa una buona strada di conversione è rendere il danno visibile mentre puoi ancora correggerlo.

C'è anche la questione di dove finisce il file. I fogli di calcolo sono tra i documenti più sensibili che la maggior parte delle persone converte: fasce salariali, liste di clienti, cifre non pubblicate, un export da un sistema di fatturazione. Un convertitore che carica è un convertitore che ora detiene quelle righe, e questo conta più qui che per un README.

## Cosa contiene un foglio di calcolo che una tabella Markdown non può contenere

Le tabelle Markdown vengono da GitHub Flavored Markdown, non dal nucleo di CommonMark, e la sintassi è deliberatamente piccola: pipe tra le celle, una riga per riga, una riga di trattini sotto l'intestazione per segnare l'intero blocco come tabella, e due punti opzionali in quella riga per l'allineamento. Questo è tutto il set di funzioni. Tutto quello che un foglio di calcolo fa oltre a ciò deve essere scartato, appiattito o spostato altrove.

| Nel foglio di lavoro | In una tabella Markdown | Cosa succede davvero |
| --- | --- | --- |
| Formule | Niente | Il valore resta, la formula sparisce. La tabella non si aggiorna più |
| Formati numerici | Niente | Ottieni la stringa mostrata, o il numero grezzo, secondo la strada |
| Grassetto, colore, riempimenti | Solo enfasi in linea, nessun colore | Una cella rossa che significava "scaduto" arriva come un numero ordinario |
| Formattazione condizionale | Niente | La regola e il significato sparisono entrambi |
| Celle unite | Niente — nessun colspan, nessun rowspan | Valore nella prima cella, spazi vuoti nel resto |
| Più fogli | Una tabella per foglio | Un export CSV salva solo il foglio attivo |
| Un a capo dentro una cella | Niente | Deve diventare `<br>` o uno spazio, altrimenti la tabella si rompe |
| Hyperlink | `[testo](url)` | Conservati solo dalle strade che leggono la clipboard ricca, non il testo semplice |
| Commenti e note | Niente | Scartati in silenzio |
| Grafici, immagini, tabelle pivot | Niente | Non tabellari, non convertibili |
| Larghezza colonne, riquadri bloccati | Niente | Il layout è di chi legge, non tuo |
| Allineamento | `:---`, `:---:`, `---:` | La sola formattazione che sopravvive, e di solito la imposti a mano |

Due righe di quella tabella vale la pena tirarle fuori, perché sono quelle che producono un documento rotto invece che semplicemente più povero. Un a capo dentro una cella non ha rappresentazione nella sintassi — la tabella è basata su righe, quindi un vero a capo termina la riga — e una regione unita non ha rappresentazione neanche lei. Tutto il resto si degrada. Questi due si corrompono.

La regola del rettangolo è l'altra cosa da sapere. La specifica di GitHub dice che la riga di intestazione fissa il numero di colonne: a una riga successiva con meno celle vengono aggiunte celle vuote, e a una riga con più celle vengono ignorate quelle in eccesso. È un comportamento clemente e uno pericoloso, perché una riga che ha perso una cella a causa di una pipe vagante non produce un errore. Produce una tabella con un valore mancante in silenzio alla fine di una riga. [Le tabelle sono la cosa più comune che si rompe nel passaggio](/blog/markdown-tables-that-survive-conversion), ed è per questo: la modalità di guasto è una tabella valida con il contenuto sbagliato.

## Confronto rapido: le strade da un foglio a una tabella

| Strada | Ideale per | Conserva | Perde | Installazione |
| --- | --- | --- | --- | --- |
| Caricare direttamente il `.xlsx` | Un intero libro di lavoro, senza passaggio di export | Ogni foglio, come tabella a sé | Formule, formati — come ogni strada | Nessuna |
| Salvare come CSV UTF-8, poi convertire | Un intero foglio, in modo affidabile | Valori, caratteri accentati | Formule, formati, gli altri fogli | Nessuna |
| Copiare l'intervallo, incollarlo in un convertitore | Una selezione che vedi | Valori, in forma separata da tabulazioni | Formattazione, hyperlink | Nessuna |
| Copiare l'intervallo, incollarlo come HTML | Grassetto, link, struttura unita | Enfasi, `<a href>`, colspan | Dipende dal convertitore HTML | Nessuna |
| Una formula in una colonna d'appoggio | Una tabella che rigeneri spesso | Quello che ci scrivi dentro | Formati numerici, a meno che usi `TEXT` | Nessuna |
| Un componente aggiuntivo Office | Farlo dentro Excel, ripetutamente | Quello che il componente implementa | Varia; può inviare l'intervallo a un fornitore | Componente aggiuntivo, a volte approvazione dell'amministratore |
| Una macro VBA | Un libro di lavoro che controlli | Esattamente quello che programmi | Niente che tu non abbia scelto | Nessuna, ma il file diventa `.xlsm` |
| Office Scripts | Excel sul web, automazione condivisa | Esattamente quello che programmi | Serve un account Microsoft 365 idoneo | Nessuna |
| Download da Google Sheets | Evitare le scelte di codifica di Excel | UTF-8 senza discussioni | Le stesse funzioni di foglio di calcolo di ogni CSV | Nessuna |
| Export da LibreOffice Calc | Controllo esplicito sul file di testo | La tua scelta di charset e virgolette | Come ogni CSV | LibreOffice |
| Ridigitarlo | Cinque righe e quattro colonne | La tua attenzione | Venti minuti, su grande scala | Nessuna |

## Le strade, una per una

### Caricare direttamente il `.xlsx` — saltando del tutto l'export

Il libro di lavoro è già uno zip di XML — è quello che significa `.xlsx` — quindi un convertitore può leggerlo esattamente come legge un `.docx`, senza un passaggio di salva-come in mezzo. [La conversione da Excel a tabella Markdown di TransformPipe](/excel-to-markdown) fa esattamente questo: rilascia il libro di lavoro, e ogni foglio con righe dentro diventa una tabella a sé, con un indice quando c'è più di un foglio. Nessuno apre Excel, nessuno scelgie una codifica, e non c'è nessun CSV intermedio da perdere o rinominare male.

| Pro | Contro |
| --- | --- |
| Nessuna finestra di salva-come, nessuna scelta di codifica da sbagliare | È sempre una lettura del file fatta da un convertitore nel browser — controlla le perdite del bigliettino sopra |
| Ogni foglio del libro di lavoro, non solo quello attivo | Formule, formati e celle unite vengono scartati, come in ogni altra strada |
| Le date arrivano come date ISO semplici invece che come numeri seriali | Niente recupera un valore che Excel ha già rovinato all'inserimento |
| Gira nel browser: il libro di lavoro non viene mai caricato | Un `.xlsm` con macro o un file protetto da password richiedono un'altra strada |

**Prezzo:** gratis, e il file resta sulla tua macchina — vale la pena confermarlo per un foglio di calcolo, dato che i fogli di calcolo tendono a essere tra i documenti più sensibili che chiunque converte.

**Per chi è?** Per chiunque voglia la tabella senza nessun passaggio di export, specialmente per un libro di lavoro con più fogli: un solo caricamento produce un documento con un indice, invece di un export CSV per ogni foglio.

### Salvare come CSV, poi convertire — la strada che funziona ovunque altrove

Usa `File > Salva come`, scegli `CSV UTF-8 (delimitato da virgole) (*.csv)`, accetta i due avvisi che Excel mostra, poi convertilo il file di testo risultante. È l'opzione più noiosa e la sola che si comporta identicamente su ogni macchina, ogni locale e ogni dimensione di file.

| Pro | Contro |
| --- | --- |
| Produce un file di testo semplice che qualunque convertitore può leggere | Viene salvato solo il foglio attivo |
| CSV UTF-8 conserva i caratteri accentati e non latini | Le formule diventano valori, i formati diventano stringhe |
| Il file intermedio è ispezionabile — aprilo e guarda | Il BOM iniziale inganna i lettori distratti |
| Funziona uguale in ogni versione di Excel che offre il formato | Una locale con virgola decimale cambia il delimitatore |

**Prezzo:** gratis. Excel non lo è, ma l'export ne fa parte, e ogni convertitore che vale qualcosa dall'altra parte è gratuito.

**Dettagli tecnici**

- L'elenco salva-come di Excel contiene diversi formati di testo: `CSV`, `UTF8 CSV`, `Macintosh CSV`, `Windows CSV`, `MSDOS CSV` e `Unicode Text`, esposti alle macro come `xlCSV`, `xlCSVUTF8`, `xlCSVMac`, `xlCSVWindows`, `xlCSVMSDOS` e `xlUnicodeText` (verificato su learn.microsoft.com, il 8 settembre 2026).
- Salvare come CSV mostra una finestra che "ricorda che solo il foglio di lavoro corrente sarà salvato nel nuovo file", e un secondo avviso che il foglio potrebbe contenere funzioni che il formato di testo non supporta (verificato su support.microsoft.com, il 8 settembre 2026).
- Il delimitatore di campo segue il separatore di elenco del sistema, modificabile nelle impostazioni Regione di Windows e nelle opzioni di separatore di Excel stesso (verificato su support.microsoft.com, il 8 settembre 2026).
- Quello che finisce nel file per una cella formattata è in genere la stringa che la cella mostra, non il valore sottostante. Questo significa che una cella con `2,3456` mostrata a due decimali scrive `2,35`, e una data scrive nell'ordine che usa il formato della cella. Apri la CSV una volta in un editor di testo e saprai esattamente cosa fa la tua copia di Excel.

Poi convertila. Un convertitore nel browser come [la conversione da CSV a tabella Markdown](/csv-to-markdown) analizza il file correttamente invece di dividerlo sulle virgole, cosa che conta nel momento in cui una cella ne contiene una, e lo fa in locale così le righe non vengono caricate — un documento salvato è limitato a 4 MB e la conversione stessa a 10 MB, molto più di quanto chiunque leggerà in una tabella. Il campo più ampio di opzioni da riga di comando e librerie è trattato in [il confronto tra convertitori CSV](/blog/best-csv-to-markdown-converters); Pandoc, Miller e `pandas.to_markdown` leggono tutti il CSV correttamente e sono la risposta giusta dentro una build.

**Per chi è?** Per chiunque converta un intero foglio, e per chiunque dovrà rifarlo il mese prossimo. Il CSV intermedio è la funzione: è un file che puoi leggere, confrontare e controllare prima che diventi una tabella.

### Copiare l'intervallo e incollare — la strada rapida

Seleziona le celle, copia, e incolla in un convertitore che accetta testo incollato. È la strada giusta per un intervallo piuttosto che un foglio, ed è più rapida di un salva-come di circa un minuto. Quello che la fa funzionare è che Excel non metti CSV nella clipboard.

| Pro | Contro |
| --- | --- |
| Nessun file, nessuna finestra, nessuna scelta di codifica | Una cella con un a capo dentro rompe l'incolla |
| Il testo separato da tabulazioni è più facile da dividere del CSV | I formati numerici arrivano come stringhe visualizzate |
| Gestisce una selezione, non un intero foglio | Formule e hyperlink non sono nel testo semplice |
| Nessuna installazione, e niente scritto su disco | Solo quello che era selezionato, quindi l'intestazione è un problema tuo |

**Dettagli tecnici — cosa porta davvero la clipboard**

| Variante | Forma | Usala per |
| --- | --- | --- |
| Testo semplice | Separato da tabulazioni, `CRLF` tra le righe, virgolette solo dove un valore contiene una tabulazione, un a capo o una virgoletta | Quasi ogni conversione |
| HTML | Una vera `<table>` con righe, celle, stili in linea, `colspan` e `rowspan`, e `<a href>` per i link | Conservare enfasi e link |
| Formati propri di Excel | Binari, per incollare di nuovo in un foglio di calcolo | Niente, fuori da Excel |

La variante di testo semplice è di fatto TSV con virgolette in stile CSV, e questa è una notizia migliore di quanto sembri. Una virgola dentro un valore è innocua perché il delimitatore è una tabulazione, e le tabulazioni sono rare dentro le celle di un foglio di calcolo, perché premere Tab sposta alla cella successiva. Quindi il caso patologico che rovina il parsing ingenuo del CSV — `Smith, John` in un campo — qui non costa niente.

Il caso che invece lo rovina è una cella con un a capo dentro, digitato con Alt+Invio. Excel racchiude quel valore tra virgolette doppie e l'a capo va sulla clipboard intatto, quindi uno strumento che divide il testo incollato sugli a capo vede una riga diventare due, e ogni riga dopo si sposta. Cerca queste celle nel foglio prima di copiare: di solito sono indirizzi, note e descrizioni di prodotto.

**Per chi è?** Per chiunque abbia il libro di lavoro aperto e un intervallo specifico in mente. È la strada da usare quando la risposta ha bisogno solo di dodici righe su novecento.

### Incollare come HTML e convertire l'HTML — quando la formattazione conta

Se l'enfasi e i link contano, non incollare come testo. Incolla in qualcosa che accetta la variante HTML della clipboard — un campo di testo ricco, o un editor che incolla contenuto formattato — e convertilo quell'HTML in Markdown invece.

| Pro | Contro |
| --- | --- |
| Grassetto, corsivo e hyperlink sopravvivono come Markdown | L'HTML della clipboard di Excel è prolisso e pieno di stili `mso-` |
| Le celle unite arrivano come vero `colspan` e `rowspan` | Che la tabella Markdown poi non può comunque esprimere |
| Bordi delle celle e allineamento sono visibili al convertitore | La maggior parte dei convertitori li ignora entrambi |
| Nessuna installazione se il convertitore gira nel browser | Due conversioni significano due occasioni di perdere qualcosa |

Il compromesso è onesto: conservi la formattazione in linea e perdi comunque la struttura, perché una tabella Markdown non ha modo di dire che una cella occupa tre colonne. Un convertitore che riceve un `colspan` lo scarta e produce una riga sfrangiata, oppure ripete il valore, oppure ricade sull'emettere una tabella HTML grezza. [Cosa fa il tuo convertitore da HTML a Markdown](/blog/best-html-to-markdown-converters) vale la pena saperlo prima di incollarci dentro un'intestazione unita.

**Per chi è?** Tabelle dove una colonna contiene link, o dove l'enfasi porta un significato — una colonna di stato, un elenco di riferimenti.

### Costruire la riga in una formula — la strada che resta nel foglio

Puoi far scrivere il Markdown a Excel stesso. Metti questo in una colonna d'appoggio accanto a una tabella di cinque colonne e riempi verso il basso:

```
="| " & TEXTJOIN(" | ", FALSE, A2:E2) & " |"
```

`TEXTJOIN` accetta un delimitatore, un flag `ignore_empty` e fino a 252 argomenti di testo o intervalli (verificato su support.microsoft.com, il 8 settembre 2026). Passa `FALSE` per `ignore_empty` e sul serio: con `TRUE`, una cella vuota viene saltata invece che emessa, la riga esce con una pipe di meno, e i valori dopo il vuoto scivolano una colonna a sinistra. È il modo più comune in cui questo trucco va storto.

Altri due dettagli. La concatenazione ignora il formato numerico della cella, quindi una data arriva come il suo numero seriale e un valore in valuta perde il suo simbolo; racchiudi quelle celle in `TEXT(A2, "aaaa-mm-gg")` per controllare tu la stringa. E un valore che contiene una pipe termina una cella in anticipo, quindi fallo passare per `SUBSTITUTE(A2, "|", "\|")` in una colonna di preparazione se i tuoi dati contengono percorsi di file o elenchi di opzioni.

La riga di separazione la digiti a mano, una volta:

```
| Articolo | Descrizione | Qtà | Prezzo | Stato |
| --- | --- | --- | ---: | --- |
```

Poi copia la colonna d'appoggio e incollala sotto queste due righe. La clipboard consegna le righe senza virgolette, perché una riga costruita così non contiene tabulazioni né a capo.

| Pro | Contro |
| --- | --- |
| La tabella si rigenera quando i dati cambiano | Stai scrivendo un convertitore a formule |
| Nessuna installazione, nessun caricamento, nessun secondo strumento | Escaping e formati numerici sono interamente un problema tuo |
| Funziona su una vista filtrata o ordinata | Diventa scomodo sopra le sei colonne circa |
| `TEXT` dà controllo esatto sulle date | Niente controlla il tuo output |

**Per chi è?** Una tabella pubblicata dallo stesso foglio ogni settimana. La colonna d'appoggio è un passaggio di build che vive nel libro di lavoro.

### Componenti aggiuntivi, macro e Office Scripts — convertire dentro Excel

Ci sono tre modi per fare della conversione un bottone in Excel invece di una gita a un altro strumento, e differiscono soprattutto per chi ha scritto il codice e dove viene eseguito.

Un **componente aggiuntivo Office** installato da AppSource gira in una vista web dentro Excel e legge il libro di lavoro tramite l'API JavaScript di Office. Giudicane uno su due domande prima di installarlo: se l'intervallo viene elaborato in locale o inviato al servizio del fornitore, cosa che la sua informativa sulla privacy dovrebbe dire chiaramente, e se il tuo tenant permette affatto i componenti aggiuntivi — negli ambienti Microsoft 365 gestiti spesso un amministratore deve approvarli. Non dare per scontato che l'elenco sul marketplace implichi né una cosa né l'altra.

Una **macro VBA** è la versione in cui possiedi il codice. Non ha dipendenze, nessun accesso di rete a meno che tu ne scriva uno, e nessun fornitore. I costi sono reali: il libro di lavoro deve essere salvato come `.xlsm` per conservare la macro, le macro nei file arrivati da internet sono bloccate di default e vanno sbloccate deliberatamente, e ora mantieni una routine di escaping che qualcuno ha scritto una volta e nessuno testa. Dato che un salva-come costa dieci secondi, una macro vale la pena solo quando la conversione avviene secondo un calendario.

**Office Scripts** è l'automazione TypeScript integrata in Excel sul web per gli account Microsoft 365 idonei. È un posto migliore di VBA per un'automazione condivisa e versionata, e non ogni licenza vi ha accesso, quindi controlla prima di pianificarci sopra. **Python in Excel** è una quarta possibilità e porta un avvertimento specifico: il Python gira nel cloud di Microsoft invece che sulla tua macchina, quindi i dati lasciano l'edificio anche se il file non lo ha fatto.

| Pro | Contro |
| --- | --- |
| Un bottone, dentro l'applicazione | Qualcuno deve possedere il codice |
| Nessuna gestione file, nessuna clipboard | I componenti aggiuntivi possono trasmettere l'intervallo; gli script possono richiedere una licenza |
| Ripetibile in tutto un team | La configurazione più impegnativa tra le strade qui |

**Per chi è?** Team che convertono fogli abbastanza spesso che i dieci secondi contano, e disposti a mantenere qualcosa per questo.

### Google Sheets e LibreOffice Calc — lo stesso lavoro con impostazioni predefinite migliori

Se il libro di lavoro non è legato a Excel, altre due applicazioni di foglio di calcolo rendono meno controverso il passaggio al file di testo.

Google Sheets esporta il foglio corrente con `File > Scarica > Valori separati da virgola`, in UTF-8, senza finestre e senza domande di codepage. I limiti del foglio di calcolo sono identici — un foglio, valori non formule, celle unite appiattite — ma la questione della codifica non si pone.

LibreOffice Calc va nella direzione opposta e ti chiede tutto. Salvare come CSV di testo apre una finestra con il set di caratteri, il delimitatore di campo, il delimitatore di stringa, "Cita tutte le celle di testo" e "Salva il contenuto della cella come mostrato" — quest'ultima casella è il controllo esplicito che Excel non offre, dato che disattivarla scrive i valori sottostanti invece delle stringhe mostrate. Se hai mai voluto una data esportata come `2026-09-03` indipendentemente dal formato della cella, quello è l'interruttore.

| Pro | Contro |
| --- | --- |
| Sheets: UTF-8 senza decisioni da prendere | Sheets: il file passa dal tuo account Google |
| Calc: charset, virgolette e delimitatore espliciti | Calc: un'installazione, e una finestra da capire |
| Calc: valore mostrato o valore sottostante, a tua scelta | Entrambi: le stesse perdite di ogni strada CSV |

**Per chi è?** Per chiunque sia già in Sheets, e per chiunque sia stato scottato una volta dalle impostazioni predefinite di codifica di Excel e voglia una scelta visibile.

## Cosa fa Excel ai tuoi valori quando scrive un CSV

Questa è la sezione da leggere due volte, perché la maggior parte di ciò non è reversibile e niente di ciò viene annunciato.

| Il valore | Cosa esce | Perché |
| --- | --- | --- |
| `00417` digitato in una cella Generale | `417` | Convertito a numero al momento della digitazione. Gli zeri non sono mai stati nel file |
| Un numero di carta o conto a 16 cifre | Le cifre dopo la 15ª diventano zeri | Excel ha "una precisione massima di 15 cifre significative" e "i numeri oltre la 15ª cifra vengono arrotondati a zero" (verificato su support.microsoft.com, il 8 settembre 2026) |
| Un numero molto grande | `1,23E+15` | La notazione scientifica nella visualizzazione diventa notazione scientifica nel testo |
| `2,3456` mostrato a due decimali | `2,35` | La stringa visualizzata, non il valore memorizzato |
| Una data | Il formato di visualizzazione della cella, nell'ordine della locale | Ecco perché `03/09/2026` è ambiguo fuori dal foglio |
| `=B2*C2` | Il risultato | Il CSV non ha formule |
| Una percentuale | Di solito con il simbolo `%` | Di nuovo la visualizzazione — controlla il tuo file |
| Un valore con separatore delle migliaia | Spesso `1.234,50`, tra virgolette | La virgola è nella stringa, quindi il campo va tra virgolette |
| Una cella con Alt+Invio dentro | Un campo tra virgolette contenente un vero a capo | Che un lettore basato su righe gestisce male a meno che non analizzi correttamente il CSV |
| Testo che inizia con `=`, `+`, `-` o `@` | Lo stesso testo | Innocuo come Markdown; un foglio di calcolo che riapre il CSV potrebbe trattarlo come formula |

Le prime due righe sono quelle che costano soldi veri. Zeri iniziali e identificativi lunghi vengono distrutti all'inserimento, prima di ogni export, e il rimedio è la prevenzione: formatta la colonna come Testo prima di incollarci i dati, oppure metti un apostrofo davanti a ogni valore. Le indicazioni stesse di Microsoft sono esplicite: questi passaggi "influiscono solo sui numeri inseriti dopo che la formattazione è stata applicata" e non ripristinano quello che è già stato troncato (verificato su support.microsoft.com, il 8 settembre 2026). Se una colonna di codici articolo legge già `417`, il foglio non sa più che era `00417`, e neanche il Markdown lo saprà.

La riga delle date è quella che causa discussioni piuttosto che perdite. Un CSV porta la stringa che la cella mostrava, quindi un foglio britannico esporta `03/09/2026` e un lettore americano lo legge come marzo. Se la tabella va vicino a un altro paese, forza le date ISO prima di esportare — una colonna d'appoggio con `TEXT(A2, "aaaa-mm-gg")`, o "Salva il contenuto della cella come mostrato" disattivato in Calc.

## Le celle unite non hanno equivalente Markdown

Non c'è colspan in una tabella Markdown. Non c'è rowspan. La griglia di pipe è strettamente rettangolare, una riga per riga, e la riga di intestazione fissa il numero di colonne per tutta la tabella. Una regione unita non può essere espressa, approssimata o suggerita.

Quello che succede in uscita è prevedibile: il valore sta nella cella in alto a sinistra della regione unita e le altre celle al suo interno sono vuote. Quindi un'intestazione che si estende su `Q1`, `Q2` e `Q3` esporta come `2026` seguito da due spazi vuoti, e la tabella Markdown ottiene una prima riga con un'etichetta e due colonne senza nome.

Quattro via d'uscita, nell'ordine in cui le proverei io:

1. **Separa e riempi.** Disattiva Unisci e centra, poi ripeti l'etichetta in orizzontale o in verticale. La tabella diventa più brutta nel foglio e corretta ovunque altro.
2. **Promuovi l'etichetta unita fuori dalla tabella.** Una cella unita che si estende su un'intera tabella è quasi sempre un titolo. Trasformala in un'intestazione sopra la tabella, o nella frase di didascalia della tabella, ed elimina la riga.
3. **Dividi in due tabelle.** Due gruppi di colonne uniti sono di solito due tabelle incollate insieme per la stampa. Pubblicarle separatamente è spesso più chiaro dell'originale.
4. **Emetti una `<table>` HTML grezza invece.** L'HTML dentro Markdown può portare `colspan`, e viene reso ovunque l'HTML grezzo sia permesso. Appare come markup letterale dove non lo è, un sanitizer con una lista di elementi permessi ristretta potrebbe rimuoverlo, e hai rinunciato alla fonte in testo semplice leggibile che era la ragione di Markdown. È l'ultima risorsa, non la risposta intelligente.

Nota che le tabelle non sono affatto in CommonMark puro, quindi la normale tabella a pipe è già un'estensione — una che GitHub Flavored Markdown e la maggior parte dei convertitori implementano, e che un parser CommonMark stretto rende come un paragrafo pieno di pipe. [Quale variante sta facendo il rendering](/blog/commonmark-gfm-and-the-flavours) decide se la tua tabella è una tabella prima che qualunque cosa di tutto ciò conti.

## La questione della codifica: un BOM, una codepage ANSI e un punto e virgola

L'export di testo di Excel ha tre modi separati per darti un file tecnicamente corretto che si legge come un guazzabuglio.

**Il BOM.** `CSV UTF-8` scrive un byte order mark — i tre byte `EF BB BF` — prima del primo carattere. La maggior parte dei lettori lo rimuove. Quelli che non lo fanno mettono un carattere invisibile davanti alla tua prima cella di intestazione, quindi la colonna si chiama `﻿Articolo` invece di `Articolo`. Sembra giusto sullo schermo e fallisce ogni confronto che ci fai contro. Lo vedi in un secondo:

```
head -c 3 orders.csv | xxd
```

Se questo stampa `efbbbf`, c'è un BOM. Su Windows senza una shell POSIX, un editor che mostra la codifica nella sua barra di stato ti dice la stessa cosa.

**La codepage.** Il semplice `CSV (delimitato da virgole)` non scrive UTF-8. Scrive la codepage ANSI del tuo sistema — Windows-1252 nell'Europa occidentale — e ogni carattere fuori da essa viene sostituito, permanentemente, di solito con un punto interrogativo. Una colonna di nomi greci o giapponesi non sopravvive a quel salvataggio, e nessun convertitore a valle può recuperarla. Anche dentro la codepage, il file è mojibake per un lettore UTF-8: `£` arriva come `Â£`, un apostrofo curvo come `â€™`, un trattino medio come `â€"`. Se hai mai visto `Â` sparso in una tabella convertita, questa era la causa.

**Il delimitatore.** Il separatore segue il separatore di elenco del sistema, quindi nelle locale dove il separatore decimale è una virgola, Excel scrive punti e virgola invece. Un lettore che si aspetta solo virgole vede allora un'unica enorme tabella a una colonna: ogni riga diventa una cella che contiene tutti i valori. È un guasto ovvio una volta che lo conosci, e sconcertante la prima volta. Cambia il separatore di elenco nelle impostazioni Regione prima di esportare, oppure usa un convertitore con un'opzione di delimitatore esplicita.

Un'altra trappola da nominare: `Unicode Text (*.txt)` è delimitato da tabulazioni in UTF-16, con il proprio BOM. Un convertitore che si aspetta UTF-8 vede un byte null tra ogni lettera e di solito segnala il file come binario.

La regola pratica è breve. Scegli `CSV UTF-8`, controlla i primi tre byte una volta per la macchina da cui esporti, e se il delimitatore è un punto e virgola, sappi che è un'impostazione di locale piuttosto che un bug.

## Dove fallisce la strada affidabile, e cosa costa

Salva-come-CSV è la scelta predefinita giusta e ha cinque costi che vale la pena dichiarare chiaramente.

**Un foglio alla volta.** Excel salva il foglio di lavoro attivo e ti avvisa che lo sta facendo. Un libro di lavoro con dodici schede sono dodici export, dodici conversioni e dodici tabelle, e non c'è un output combinato perché il CSV non ha concetto di un secondo foglio. Se le schede sono un unico dataset diviso per mese, consolida dentro Excel prima di esportare.

**Le formule sono sparite, e con esse la fonte di verità.** Una tabella di valori pubblicata va bene finché qualcuno chiede da dove viene un numero. Il libro di lavoro lo sa ancora; il Markdown no. Per una tabella che rigeneri, tieni il foglio come fonte e il Markdown come artefatto — non modificare mai la tabella aspettandoti che il foglio sia d'accordo.

**Il significato che viveva nella formattazione.** Formattazione condizionale, riempimenti e colori del carattere portano informazioni in moltissimi fogli di calcolo reali: rosso per scaduto, grigio per superato, grassetto per un totale. Tutto questo viene scartato, e chi legge il Markdown non può accorgersene. Il rimedio è spostare il significato nei dati — aggiungi una colonna `Stato`, segna i totali con una parola invece che con un peso visivo — un lavoro che il convertitore non può fare al posto tuo.

**Quello che il filtro nascondeva.** Se hai lasciato un filtro automatico o colonne nascoste al loro posto, controlla il file esportato contro quello che vedevi a schermo invece di darlo per scontato; l'abitudine sicura è copiare l'intervallo visibile invece di esportare l'intero foglio quando un filtro è attivo.

**La larghezza che nessuno leggerà.** Una tabella di quaranta colonne è Markdown legale e output illeggibile: scorre lateralmente o si sfalda in poltiglia, e il testo grezzo diventa impossibile da modificare a mano. Questo è un fallimento di design piuttosto che di conversione, e le risposte sono tagliare colonne, trasporre una tabella piccola così che i campi scorrano di lato, oppure accettare che alcuni dati vogliono restare un foglio di calcolo e collegare il file invece.

C'è un sesto costo che non riguarda i dati. Qualcuno deve controllare il risultato. Converti il foglio, poi leggi la prima riga, l'ultima riga, una riga con un carattere accentato e una riga con un numero lungo. Sono quattro controlli e circa trenta secondi, e catturano quasi tutto in questa pagina.

## Come scegliere

1. **Parti da quante volte lo farai.** Una volta, e salva-come-CSV è finito prima che tu finisca di leggere l'informativa sulla privacy di un componente aggiuntivo. Ogni settimana, e una colonna d'appoggio o uno script si ripagano in un mese.
2. **Decidi se hai bisogno di un intervallo o di un foglio.** Una selezione vuole la clipboard; un foglio vuole un file. Usare la strada del file per dodici righe significa esportarne novecento ed eliminarne la maggior parte.
3. **Cerca celle unite e a capo con Alt+Invio prima di convertire, non dopo.** Sono le uniche due funzioni del foglio di calcolo che producono una tabella rotta invece che semplicemente più povera, ed entrambe richiedono un minuto da correggere nel foglio e molto più a lungo da debuggare nell'output.
4. **Scegli la codifica deliberatamente se i dati non sono ASCII puro.** `CSV UTF-8` per qualunque cosa con un accento, un simbolo di valuta o una scrittura non latina. L'opzione CSV semplice perde quei caratteri nel momento del salvataggio, e niente in seguito può rimetterli a posto.
5. **Chiediti dove vanno le righe.** Per una tabella di licenze open source non ha importanza. Per stipendi, dati di pazienti o cifre non ancora rilasciate è la domanda intera, e un convertitore che gira nel tuo browser ti lascia verificare la risposta guardando il pannello di rete che non fa niente.

## Conclusione

Il riassunto onesto di Excel verso Markdown è che la conversione è facile e il foglio di calcolo è difficile. Salva il foglio come CSV UTF-8, converti il CSV, e spendi il tempo risparmiato a controllare le tre cose che si rompono: identificativi i cui zeri iniziali sono spariti quando sono stati digitati, date il cui ordine dipende da chi legge, e celle unite che Markdown non può esprimere e che appiattisce in silenzio. Per un intervallo selezionato, incollalo invece — la variante separata da tabulazioni della clipboard è davvero più facile da analizzare di qualunque CSV, e TransformPipe convertisce le righe incollate esattamente come converte un file, nel browser, senza caricare niente quando non hai fatto l'accesso. In ogni caso, leggi la prima e l'ultima riga del risultato prima di pubblicarlo. Lo strumento non può sapere che `417` era `00417`, e tu puoi.

## Domande frequenti

### Come convertire un file Excel in una tabella Markdown?

Salva il foglio come `CSV UTF-8 (delimitato da virgole)` e convertilo con qualunque convertitore che analizza il CSV correttamente invece di dividerlo sulle virgole. Per parte di un foglio piuttosto che tutto, copia l'intervallo e incollalo in un convertitore che accetta testo incollato — Excel metti una versione delle celle separata da tabulazioni nella clipboard, più facile da analizzare del CSV.

### Posso incollare da Excel direttamente in un file Markdown?

Non in modo utile. Quello che finisce in un editor di testo semplice sono valori separati da tabulazioni senza pipe e senza riga di separazione, quindi si rende come un blocco di testo invece che come una tabella. Incollalo in un convertitore, oppure costruisci le righe nel foglio con `TEXTJOIN` e incolla il Markdown già finito.

### Perché i miei zeri iniziali sono scomparsi?

Perché Excel ha convertito il valore a numero al momento della digitazione, ben prima di ogni export — `00417` è diventato il numero 417 e il file non ha mai contenuto gli zeri. Formatta la colonna come Testo prima di inserire o incollare i dati, oppure metti un apostrofo davanti a ogni valore; nessuno dei due ripristina valori già convertiti.

### Perché il mio CSV esportato usa punti e virgola invece di virgole?

Perché il delimitatore segue il separatore di elenco del tuo sistema, e nelle locale che usano la virgola come separatore decimale quell'impostazione è un punto e virgola. Cambia il separatore di elenco nelle impostazioni Regione di Windows prima di esportare, oppure usa un convertitore che ti permette di specificare il delimitatore. Un lettore che si aspetta solo virgole trasforma l'intero file in un'unica colonna.

### Cosa succede alle celle unite?

Vengono appiattite: il valore va alla cella in alto a sinistra della regione unita e il resto esce vuoto. Le tabelle Markdown non hanno colspan né rowspan, quindi i soli rimedi sono separare e ripetere l'etichetta, promuovere un'intestazione unita fuori dalla tabella in un titolo, dividere la tabella in due, oppure ricadere su una tabella HTML grezza.

### Convertire un foglio di calcolo significa caricarlo?

Solo se lo strumento funziona così, e molti lo fanno. Un convertitore che gira nel browser legge il file sulla tua stessa macchina, cosa che puoi confermare apreno il pannello di rete e guardando che non esce niente — vale la pena farlo una volta per ogni strumento a cui pensi di dare dati veri, dato che i fogli di calcolo tendono a contenere le righe più sensibili che chiunque converte.

### Posso conservare il grassetto e gli hyperlink dal foglio?

Solo tramite la variante HTML della clipboard, che porta link `<a href>` e stili in linea, e solo se poi convertisci quell'HTML in Markdown invece di incollarlo come testo semplice. La variante di testo semplice ha i valori e nient'altro, e un export CSV non ha nessuna formattazione.

### Devo esportare prima in CSV?

No, se il convertitore legge `.xlsx` direttamente — il formato è uno zip di XML, la stessa forma di un `.docx`, quindi un convertitore che apre gli zip può leggere i fogli di un libro di lavoro senza nessun file di testo intermedio. La strada CSV resta utile da conoscere per gli strumenti che accettano solo testo semplice, o per il momento in cui vuoi ispezionare i valori in un editor prima che diventino una tabella.
