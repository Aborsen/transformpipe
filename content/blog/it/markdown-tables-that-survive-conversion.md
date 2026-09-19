---
title: "Tabelle Markdown che sopravvivono alla conversione: tutti i modi in cui si rompono"
description: "Perché una tabella Markdown non si vede: la riga separatore, i due punti di allineamento, le righe vuote, le pipe con escape e GFM contro CommonMark"
date: 2026-08-29
tag: Sintassi
keywords: tabella markdown, sintassi tabella markdown, tabella markdown in html, allineamento tabella markdown, tabella markdown che non si vede, a capo in una cella markdown, tabella markdown troppo larga
---

### In breve

Una tabella Markdown è una riga di intestazione, una riga separatore fatta di trattini, e un numero qualsiasi di righe di corpo — e la riga separatore è tutto il trucco. Toglila, o lascia che il suo numero di celle non corrisponda a quello dell'intestazione, e non c'è nessuna tabella: ottieni un paragrafo pieno di barre verticali, in silenzio. Le tabelle non fanno nemmeno parte di CommonMark; sono arrivate con GitHub Flavored Markdown, quindi un parser strettamente conforme si comporta correttamente quando rifiuta la tua. Lascia una riga vuota sopra e sotto il blocco, fai l'escape di ogni pipe letterale come `\|`, e ricorri a `<br>` quando una cella ha bisogno di una seconda riga, perché una riga di tabella finisce dove finisce la riga.

Una tabella è la parte di un documento più probabile che arrivi rotta. I titoli sono difficili da sbagliare. Una parola in grassetto ha i suoi asterischi o non li ha. Una tabella è una griglia tenuta insieme dalla punteggiatura, e un carattere sbagliato in un punto qualsiasi del blocco non produce una tabella leggermente sbagliata — produce nessuna tabella, perché il parser smette di riconoscere la forma e tratta tutto il blocco come prosa.

Questa modalità di fallimento è ciò che rende le tabelle frustranti. Non c'è errore, non c'è avviso, non c'è una griglia mezza resa. Ottieni cinque righe di testo con caratteri pipe dentro, seduti dove doveva stare la tua tabella, e niente nell'output ti dice quale delle cinque righe fosse il problema. Il file continua a sembrare a posto nel tuo editor, perché il tuo editor ti mostra la fonte.

La buona notizia è che i fallimenti sono un numero finito. Quasi ogni tabella Markdown rotta ha una di circa dieci cause, ciascuna con un sintomo riconoscibile. Questa pagina le attraversa tutte: qual è la sintassi, a cosa serve davvero ciascuna parte, cosa succede quando è sbagliata, e quanto costa la correzione. Se hai una tabella rotta davanti a te proprio adesso, comincia dalla tabella dei sintomi due sezioni più sotto.

## Cos'è davvero una tabella Markdown

Tre parti, in questo ordine, su righe consecutive:

```markdown
| Flag | Long form | Takes a value |
| --- | --- | --- |
| `-o` | `--output` | yes |
| `-q` | `--quiet` | no |
```

La prima riga è la riga di intestazione. La seconda è la riga separatore — chiamata a volte riga delimitatore — ed è quella che fa di questo blocco una tabella invece di un paragrafo. Il resto sono righe di corpo. Il blocco finisce alla prima riga vuota, o alla prima riga che comincia un altro costrutto a livello di blocco come un titolo o una recinzione.

Convertita in HTML, questa diventa più o meno così:

```html
<table>
<thead>
<tr><th>Flag</th><th>Long form</th><th>Takes a value</th></tr>
</thead>
<tbody>
<tr><td><code>-o</code></td><td><code>--output</code></td><td>yes</td></tr>
<tr><td><code>-q</code></td><td><code>--quiet</code></td><td>no</td></tr>
</tbody>
</table>
```

Da questo output derivano due cose, ed entrambe spiegano molti guai successivi. Primo, c'è sempre esattamente una riga di intestazione, avvolta in `<thead>`. Markdown non ha sintassi per una tabella senza intestazione, né per due righe di intestazione. Secondo, ogni cella è un `<th>` o un `<td>` che contiene contenuto inline. Non c'è nessun meccanismo nella sintassi per una cella che si estende su due colonne, una cella che si estende su due righe, una tabella annidata, o una cella che contiene un paragrafo e una lista.

Vale la pena saperlo prima di andare avanti: il parser sta cercando una forma, non riparandone una. Se le prime due righe non sono d'accordo su quante celle contengono, il blocco non diventa mai una tabella, e ogni riga al suo interno viene emessa come testo. Questa singola regola spiega più tabelle rotte di tutto il resto di questa pagina messo insieme.

## Tabella markdown che non si vede: dal sintomo alla causa

Trova il sintomo, poi leggi la sezione a cui punta.

| Symptom in the output | Almost always because | Fix |
| --- | --- | --- |
| Tutta la tabella è un paragrafo di pipe | Nessuna riga separatore, o una riga separatore con un numero di celle diverso dall'intestazione | Conta le celle in entrambe le righe; devono corrispondere esattamente |
| Tutta la tabella è un paragrafo, e i trattini sembrano strani | Un editor ha trasformato `---` in un trattino lungo, oppure le pipe sono a larghezza intera `｜` da un metodo di input | Riscrivi la riga separatore con trattini semplici e pipe ASCII |
| La riga di intestazione è incollata al paragrafo sopra | Nessuna riga vuota tra la prosa e la tabella | Una riga vuota prima della tabella, e una dopo |
| La tabella si vede, ma manca una colonna | La riga separatore ha meno celle di quanto suggerisca il contenuto dell'intestazione | Conta i trattini, non le intestazioni |
| Una riga ha una cella divisa in due, e il suo ultimo valore è sparito | Una `\|` senza escape dentro un valore di cella | Scrivila come `\|`, backtick compresi |
| Una cella è vuota quando la fonte ha chiaramente del testo | Quella riga aveva più celle dell'intestazione, quindi le extra sono state scartate | Fai corrispondere il numero di celle, o fai l'escape della pipe di troppo |
| La tabella si vede come un blocco di codice | Il blocco è rientrato di quattro spazi o più | Riducilo a zero, o alla colonna di contenuto dell'elemento di lista |
| La tabella si vede ovunque tranne che in uno strumento | Quello strumento esegue CommonMark senza l'estensione delle tabelle | Scegli un parser GFM, o accetta il ripiego |
| Due frasi in una cella si sono unite | Un `<br>` è stato rimosso da un sanificatore, o non c'era mai stato | Controlla la lista di elementi ammessi del sanificatore; non c'è altro modo per andare a capo |
| Una lista a punti dentro una cella è uscita come trattini letterali | Le celle contengono solo contenuto inline | Ristruttura: la tabella è il riassunto, il dettaglio va sotto |
| L'allineamento viene ignorato | Due punti dal lato sbagliato dei trattini, o un foglio di stile che lo sovrascrive | `:---`, `:---:`, `---:` — i due punti dentro la cella, contro i trattini |

Due di questi meritano di essere sottolineati perché sono quelli davanti a cui le persone restano immobili. Una riga separatore contata male e una pipe senza escape producono entrambe un output che sembra un problema di formattazione ed è in realtà un problema di conteggio.

## Il prontuario: ogni parte di una tabella, e cosa costa

| Part | What it is for | What it does | Price |
| --- | --- | --- | --- |
| Riga di intestazione | Nominare le colonne | Diventa `<thead>`, una riga di `<th>` | Obbligatoria; non esiste tabella senza intestazione |
| Riga separatore | Dire al parser che questo è una tabella | Fissa il numero di colonne per tutto il blocco | Una riga, e contare le colonne due volte |
| Trattini | Riempire le celle separatrici | Un `-` per cella è valido; `---` è convenzione | Nulla; la lunghezza è estetica |
| Due punti di allineamento | Allineare una colonna a sinistra, al centro o a destra | Emette un attributo `align` o uno stile `text-align` per cella | Un carattere per colonna, e solo per colonna |
| Pipe esterne | Incorniciare la riga | Facoltative su ogni riga tranne che in una tabella a una colonna | Due caratteri a riga, e molta più leggibilità |
| `\|` | Mettere una pipe letterale in una cella | Fa l'escape del delimitatore, span di codice compresi | Una barra rovesciata, e una fonte un po' più rumorosa |
| `<br>` | Andare a capo dentro una cella | HTML inline, che GFM lascia passare | Una dipendenza da qualsiasi cosa sanifichi il tuo HTML |
| Riga vuota prima e dopo | Segnare i confini del blocco | Tiene l'intestazione fuori dal paragrafo precedente | Due righe vuote, in cambio di portabilità |
| Rientro | Posizionare una tabella dentro un elemento di lista | Da zero a tre spazi va bene; quattro è un blocco di codice | Attenzione, ogni volta che la tabella è annidata |
| Numero di celle nelle righe di corpo | Riempire la griglia | Le righe corte vengono imbottite, le righe lunghe vengono troncate | Silenzio quando è sbagliato |
| Solo contenuto inline | Mantenere le celle analizzabili | Testo, enfasi, span di codice, link, immagini | Niente liste, paragrafi, recinzioni o annidamento |
| Wrapper con scorrimento | Sopravvivere a una pagina stretta | Un `<div>` a cui il tuo foglio di stile può dare `overflow-x: auto` | Righe vuote dentro il wrapper, e controllo del CSS |

Tutto quello che segue espande una riga di quella tabella.

## Le parti, una alla volta

### La riga separatore — la riga che fa di questo una tabella

Questa è la riga portante. `| --- | --- | --- |` non è decorazione tra l'intestazione e il corpo; è la dichiarazione che trasforma tre righe di pipe in una griglia. Eliminala e il parser non ha motivo di trattare nessuna di quelle righe come qualcosa diverso da un paragrafo, che è esattamente quello che esce dall'altra parte.

| Pros | Cons |
| --- | --- |
| Una riga è tutta la differenza tra prosa e tabella | Il suo numero di celle deve corrispondere esattamente a quello dell'intestazione |
| Un solo trattino per cella è sufficiente; nessuno li conta | Nulla ti avvisa quando i conteggi non corrispondono |
| Porta l'allineamento, quindi la formattazione non richiede sintassi extra | La punteggiatura intelligente di un editor può distruggerla in modo invisibile |
| È la prima cosa da controllare quando una tabella si rompe | Deve essere la seconda riga — non la terza, e non dopo un commento |

**Prezzo:** una riga, e l'abitudine di contare le colonne due volte prima di dare la colpa al motore di rendering.

**Dettagli tecnici e funzionalità**

- Ogni cella separatrice può contenere trattini, un due punti iniziale facoltativo, un due punti finale facoltativo, e spazi. Nient'altro. Una lettera vagante o un punto e il blocco diventa un paragrafo.
- Il numero di celle nella riga separatore deve essere uguale a quello nella riga di intestazione. È l'unica regola rigida in tutto il costrutto.
- Una volta che i due concordano, quel numero di colonne è fissato per ogni riga di corpo che segue.
- `-`, `--` e `-----------` sono identici per il parser. Allineare i trattini con la cella più larga è per l'essere umano che modificherà il file dopo.
- Alcuni programmi di scrittura e alcuni editor convertono `---` in un trattino lungo mentre digiti. Un trattino lungo è un carattere diverso, quindi la riga separatore smette di essere tale.

**Chi dovrebbe usarla?** Chiunque, su ogni tabella, sulla seconda riga. Se una tabella non si vede, è qui che guardi prima, e per la maggior parte delle volte puoi fermarti qui.

### I due punti di allineamento — la sola formattazione che una colonna ottiene

I due punti nella riga separatore impostano l'allineamento di tutta la colonna, intestazione compresa:

```markdown
| Left | Centred | Right |
| :--- | :-----: | ----: |
| a | b | 1 |
```

Un due punti a sinistra allinea a sinistra, a destra allinea a destra, su entrambi i lati centra, e nessuno lascia il comportamento predefinito del motore di rendering — che di solito è a sinistra, ma è una decisione del foglio di stile e non del documento.

| Pros | Cons |
| --- | --- |
| Costa un carattere e si applica a tutta la riga della colonna | Solo per colonna: non esiste allineamento per singola cella |
| I numeri allineati a destra fanno combaciare le cifre, che è il punto | Cosa emette varia tra i motori di rendering |
| Funziona con un solo trattino, quindi `:-:` è una cella centrata valida | La lista di elementi ammessi di un sanificatore può eliminare l'attributo o lo stile |
| Intestazione e corpo sono sempre d'accordo, perché è una sola dichiarazione | Nessun allineamento verticale, e nessun modo di allineare un'intera tabella |

**Prezzo:** un carattere per colonna, e una dipendenza dalla scelta del tuo motore di rendering su cosa emettere.

**Dettagli tecnici e funzionalità**

- Il due punti va dentro la cella, contro i trattini. `| :--- |` è corretto; `| : --- |` e `|:|` non lo sono.
- Alcuni motori emettono `<th align="right">`, altri `<th style="text-align:right">`. Entrambi sono identici in un browser.
- La differenza si sente in due punti: quando scrivi il tuo CSS contro l'output, e quando l'HTML passa attraverso un sanificatore la cui lista di elementi ammessi permette `align` ma non `style`, o il contrario. [Sanificare Markdown in sicurezza](/blog/sanitising-markdown-safely) spiega perché vale la pena insistere su una sola lista di elementi ammessi condivisa.
- L'allineamento è il solo controllo per colonna che ha la sintassi. Nessuna larghezza, nessun colore, nessuna regola di avvolgimento del testo — quelle vivono nel CSS o in nessun posto.

**Chi dovrebbe usarli?** Chiunque abbia una colonna di numeri, versioni o dimensioni di file. Allinea a destra quelle e lascia in pace le colonne di testo; il testo del corpo centrato è più difficile da leggere di quanto sembri nell'editor.

### Righe vuote — il confine di cui il parser ha bisogno

Scritta direttamente sotto una riga di prosa, la riga di intestazione di una tabella può essere inghiottita da quel paragrafo. I parser non sono d'accordo su se una tabella possa interrompere un paragrafo, quindi un file che si vede sulla tua macchina potrebbe non vedersi nello strumento successivo della catena.

| Pros | Cons |
| --- | --- |
| Due righe vuote rendono il blocco inequivocabile ovunque | Facile da perdere quando i file sono generati o concatenati |
| Elimina un'intera categoria di differenze da strumento a strumento | È spazio bianco, quindi i revisori non notano che manca |
| Corregge anche le tabelle avvolte in HTML grezzo | Alcuni editor rimuovono le righe vuote finali al salvataggio |

**Prezzo:** due righe vuote, in cambio di una tabella che si comporta uguale in ogni motore di rendering.

**Dettagli tecnici e funzionalità**

- Una riga vuota prima della riga di intestazione la tiene fuori dal paragrafo precedente. Una riga vuota dopo l'ultima riga di corpo chiude il blocco in modo netto.
- La tabella finisce anche a qualsiasi riga che inizia un altro blocco: un titolo, una recinzione, una citazione a blocchi, una linea orizzontale.
- Dentro un wrapper HTML grezzo le righe vuote non sono facoltative — vedi la sezione sulle tabelle larghe più sotto.
- I file assemblati da uno script sono la fonte abituale di una riga vuota mancante. Unisci i documenti con una riga vuota tra loro, non con un semplice a capo.

**Chi dovrebbe usarle?** Chiunque, ogni volta. Questa è l'affidabilità più economica che comprerai oggi.

### Pipe dentro una cella — l'escape che ti scorderai

Una pipe senza escape termina la cella ovunque appaia. Questo include dentro uno span di codice, perché la riga viene divisa sulle pipe prima che il parser inline veda mai i backtick. Scrivi una pipeline di shell, un'unione di tipi o un'espressione regolare con un'alternanza, e la riga guadagna silenziosamente una cella e perde un valore.

| Pros | Cons |
| --- | --- |
| `\|` funziona ovunque in una cella, span di codice compresi | Nulla nell'output rotto punta alla pipe |
| L'escape è un carattere e non richiede configurazione | Una fonte con diversi escape si legge peggio |
| La codifica in percentuale come `%7C` funziona dentro una destinazione di link | La stessa stringa in un blocco delimitato non ha bisogno di escape, il che confonde le persone |

**Prezzo:** una barra rovesciata per pipe, e una fonte che si legge un po' peggio dell'output.

**Dettagli tecnici e funzionalità**

- Fai l'escape di una pipe letterale come `\|`. In GFM questo è rispettato dentro altri span inline, quindi `` `a \| b` `` si rende come uno span di codice che contiene `a | b`.
- Una pipe in una destinazione di link è più sicura codificata in percentuale come `%7C`, poiché le regole di escape dentro gli URL sono meno coerenti tra i parser.
- Una pipe dentro un attributo HTML in una cella divide anche lei la riga. Il parser non sta leggendo il tuo HTML.
- La pipe a larghezza intera `｜` da un metodo di input cinese o giapponese non è affatto il delimitatore, quindi una riga digitata con essa non diventa mai celle.
- I blocchi di codice delimitati fuori da una tabella non hanno bisogno di escape. Se una cella si riempie di escape, è un segnale che il contenuto appartiene a [un blocco di codice invece](/blog/code-blocks-in-markdown).

**Chi dovrebbe usarla?** Chiunque documenti una riga di comando, un'espressione regolare, una condizione OR o un'unione di tipi — che è dire la maggior parte delle persone che scrivono tabelle tecniche.

### A capo dentro una cella — impossibile, e `<br>` invece

Una riga di tabella finisce dove finisce la riga. Non esiste sintassi Markdown per un a capo dentro una cella: due spazi finali non fanno nulla qui, qualunque cosa facciano [altrove in un documento](/blog/markdown-line-breaks-and-lists), e nemmeno una barra rovesciata finale aiuta, perché il parser ha già deciso che la riga è finita.

Il rimedio è HTML inline:

```markdown
| Step | Notes |
| --- | --- |
| Publish | Creates the link.<br>Sending it is your job. |
```

| Pros | Cons |
| --- | --- |
| L'unica cosa che funziona, e funziona nella maggior parte dei motori | È HTML dentro il tuo Markdown, cosa che alcune pipeline proibiscono |
| GFM permette HTML inline, quindi il parser lo lascia passare | Un sanificatore che elimina tag sconosciuti riunisce le frasi |
| `<br>` e `<br />` vengono entrambi analizzati | Diverse interruzioni in una sola cella di solito significano che la tabella è sbagliata |

**Prezzo:** un tag HTML, e una dipendenza da qualunque cosa sanifichi il tuo HTML che lo mantenga.

**Dettagli tecnici e funzionalità**

- Metti il tag inline, senza spazio prima, esattamente dove serve l'interruzione.
- Se sopravvive dipende dal passo successivo, non dal parser. Un convertitore che fa l'escape dell'HTML grezzo di default ti mostra un `<br>` letterale; uno che elimina tag sconosciuti lo scarta e riunisce il testo.
- TransformPipe sanifica l'anteprima e il file scaricato contro un'unica lista di elementi ammessi condivisa, quindi l'interruzione che vedi in anteprima è l'interruzione nel file che mandi.
- Se una cella ha bisogno di due interruzioni, o di un'interruzione più un elenco, stai scrivendo un paragrafo dentro una griglia. Portalo fuori.

**Chi dovrebbe usarlo?** Chiunque abbia una colonna "note", con parsimonia. Una tabella dove ogni cella porta un `<br>` è una tabella che combatte contro la propria forma.

### Righe irregolari — imbottite in silenzio, troncate in silenzio

Una volta che l'intestazione e la riga separatore concordano su un numero di colonne, quel numero è legge. Una riga di corpo con meno celle viene imbottita con celle vuote. Una riga di corpo con più celle vede le celle in eccesso scartate. Nessuna delle due produce un avviso, ed entrambe sembrano perdita di dati quando le scopri una settimana dopo.

| Pros | Cons |
| --- | --- |
| Le righe corte sono legali, quindi le celle vuote finali possono essere omesse | Una riga contata male perde il suo ultimo valore senza avviso |
| Il comportamento permissivo mantiene renderizzabili le tabelle modificate a mano | Una colonna aggiunta deve essere aggiunta a ogni singola riga |
| Il numero di colonne è facile da verificare: conta le celle separatrici | Le tabelle generate erediteranno qualunque errore di conteggio del generatore |

**Prezzo:** silenzio. Questa è la sola parte della sintassi che fallisce senza un sintomo che puoi vedere nella fonte.

**Dettagli tecnici e funzionalità**

- I conteggi delle celle sono decisi solo dalle righe di intestazione e separatore. Le righe di corpo vengono adattate a quelli.
- Un ultimo valore caduto in una riga è di solito una pipe di troppo prima nella stessa riga — spesso una senza escape dentro un valore.
- Le colonne non devono essere allineate nella fonte. Una fonte irregolare produce lo stesso HTML di una griglia ordinata; ordinala comunque, per chi la modificherà dopo.
- Se aggiungi una colonna, aggiungila all'intestazione, al separatore e a ogni riga di corpo in una sola modifica. Le tabelle migrate a metà continuano a rendersi, motivo per cui sopravvivono alla revisione.

**Chi dovrebbe usarlo?** Nessuno deliberatamente. Conosci la regola così che un valore mancante ti manda a contare le pipe invece che a dare la colpa al convertitore.

### Pipe iniziali e finali — facoltative, finché non lo sono più

Questi due blocchi producono HTML identico:

```markdown
| Name | Size |
| --- | --- |
| logo.svg | 4 KB |

Name | Size
--- | ---
logo.svg | 4 KB
```

| Pros | Cons |
| --- | --- |
| La forma nuda è più rapida da scrivere e da generare | Più difficile da leggere, e più difficile individuare una cella mancante |
| La forma incorniciata rende visibile il numero di colonne a colpo d'occhio | Due caratteri extra su ogni riga |
| Entrambe sono GFM valido, quindi nessuna è un rischio di portabilità | Una tabella a una colonna ha bisogno delle pipe esterne per essere riconosciuta come tale |

**Prezzo:** due caratteri a riga per la forma incorniciata. Paga il prezzo.

**Dettagli tecnici e funzionalità**

- Le pipe esterne sono facoltative sull'intestazione, sul separatore e sulle righe di corpo, indipendentemente. Puoi mescolarle, anche se non c'è motivo di farlo.
- Una tabella a una colonna è l'eccezione: senza nessuna pipe da nessuna parte sulla riga non c'è nulla che dica al parser che sta guardando una tabella, quindi scrivi `| Header |` e `| --- |`.
- Gli spazi attorno al contenuto della cella vengono rimossi, quindi imbottire le celle per allinearle non costa nulla al rendering.
- I tab dentro una riga sono trattati come spazio bianco, non come delimitatori. Una tabella separata da tabulazioni non è una tabella Markdown.

**Chi dovrebbe usarle?** Usa la forma incorniciata nei file che le persone modificano a mano. La forma nuda va bene per l'output di uno script, dove nessuno legge la fonte comunque.

### Rientro — tre spazi va bene, quattro spazi è fatale

Fino a tre spazi iniziali vengono ignorati. Quattro o più trasformano la riga in un blocco di codice rientrato, e la tabella si rende come testo monospaziato in un riquadro grigio — che almeno è un sintomo distintivo.

| Pros | Cons |
| --- | --- |
| La tolleranza a tre spazi perdona la maggior parte degli spazi bianchi vaganti | Quattro spazi sono un costrutto completamente diverso |
| Le tabelle si annidano dentro elementi di lista, se rientrate correttamente | Il rientro richiesto dipende dalla larghezza del marcatore della lista |
| Il fallimento è visibile: un blocco di codice, non un paragrafo | Tab e spazi mescolati rendono ambigua la colonna di contenuto |

**Prezzo:** attenzione, ogni volta che la tabella vive dentro una lista.

**Dettagli tecnici e funzionalità**

- Dentro un elemento di lista, ogni riga della tabella — intestazione, separatore e corpo — deve stare alla colonna di contenuto dell'elemento, che è la colonna dove comincia il testo dell'elemento stesso.
- Dentro una citazione a blocchi, ogni riga ha bisogno del suo marcatore `>`, riga separatore compresa.
- Una tabella dentro una lista dentro una citazione a blocchi è legale, e nessuno ti ringrazierà per averla scritta.
- Se la tabella si rende come blocco di codice, la correzione è lo spazio bianco, non la sintassi.

**Chi dovrebbe usarlo?** Chiunque scriva procedure, dove un passaggio vuole una piccola tabella sotto. Considera un titolo e una tabella a piena larghezza invece; le tabelle annidate sono strette su un telefono.

### Il dialetto — le tabelle sono GFM, non CommonMark

Le tabelle non sono né nel Markdown originale né nel CommonMark puro. Diverse estensioni le aggiungono, e la versione di GitHub Flavored Markdown è quella che segue la maggior parte degli strumenti moderni. Un convertitore che esegue CommonMark stretto senza l'estensione delle tabelle rende la tua tabella come un paragrafo di pipe — e ha ragione a farlo. Niente è rotto. La funzione semplicemente non è lì.

| Pros | Cons |
| --- | --- |
| La sintassi delle tabelle di GFM è quella che implementa quasi ogni strumento moderno | Un parser CommonMark conforme la rifiuta, correttamente |
| Il ripiego è testo leggibile invece che un errore | Il fallimento è silenzioso, quindi viaggia lontano prima che qualcuno se ne accorga |
| Pandoc, remark, markdown-it e altri offrono tutti le tabelle | Le estensioni differiscono ai margini: tabelle a griglia, didascalie, celle multi-riga |

**Prezzo:** nessuno in GFM. In una pipeline mista, il costo è controllare ogni parser una volta.

**Dettagli tecnici e funzionalità**

- GFM definisce le tabelle come estensione a CommonMark, insieme a liste di attività, testo barrato e autolink. Uno strumento può implementare CommonMark per intero e non supportare nessuna delle quattro.
- Alcuni ecosistemi devono attivare l'estensione esplicitamente — un plugin, una preconfigurazione o un flag — e vengono distribuiti con essa disattivata.
- Altri dialetti aggiungono funzionalità di tabella che GFM non ha, come celle multi-riga o didascalie. Quelle non viaggiano: un documento che ne dipende si rende come pipe in un motore GFM.
- [CommonMark, GFM e i dialetti](/blog/commonmark-gfm-and-the-flavours) stabilisce cosa fa ogni parser, e [il confronto tra convertitori](/blog/best-markdown-to-html-converters) copre quali strumenti gestiscono le tabelle senza configurazione.

**Chi dovrebbe usarle?** Chiunque il cui file passi attraverso più di un motore di rendering. Convertine uno rappresentativo presto e guarda le tabelle prima di costruire qualcosa sopra.

## Dove una tabella Markdown è la forma sbagliata, e cosa costa

La sintassi sopra copre tabelle che dovrebbero funzionare e non funzionano. C'è una seconda categoria: tabelle che non possono funzionare, perché i dati non entrano in quello che è una tabella Markdown. Questa è la parte che un riferimento di sintassi lascia fuori, e vale la pena essere onesti sulle alternative, perché ognuna costa qualcosa di reale.

**Celle unite.** Non esiste colspan e non esiste rowspan. Una tabella finanziaria con un'intestazione che si estende, o una matrice con una colonna etichetta unita, non può essere espressa. Le tue opzioni sono un `<table>` HTML grezzo dentro il file Markdown, o una presentazione diversa. La tabella HTML funziona, e ti costa tre cose: nessuno può leggerla nella fonte, un diff di un valore cambiato diventa un diff di una riga HTML, e tutto il blocco dipende dal fatto che il sanificatore del tuo convertitore permetta `table`, `tr`, `td`, `colspan` e `rowspan`. Molte liste di elementi ammessi permettono i tag e scartano gli attributi, il che produce una tabella che si rende con le estensioni silenziosamente sparite.

**Celle con contenuto vero dentro.** Una cella che vuole un paragrafo, una lista a punti, un blocco di codice delimitato, una citazione a blocchi o una tabella annidata non può averne uno. Le celle contengono solo contenuto inline, punto. La correzione abituale è quella giusta: mantieni la tabella come riassunto, un valore breve per cella, e metti il dettaglio in sezioni intestate sotto. Si legge anche meglio su un telefono, dove una tabella a cinque colonne è dura da seguire comunque sia stata scritta.

**Qualsiasi cosa con una checkbox.** Le checkbox delle liste di attività vengono da elementi di lista, quindi `- [ ]` dentro una cella resta testo letterale nella maggior parte dei motori. Se hai bisogno di una colonna di spunte, metti un carattere dentro e dì nell'intestazione cosa significa.

**Link definiti nei paraggi in stile riferimento.** Le definizioni di riferimento a link sono a livello di blocco, quindi non possono vivere dentro una tabella. I riferimenti definiti altrove nel documento funzionano bene dentro le celle; la definizione deve semplicemente stare fuori dal blocco.

**Tabelle che sono in realtà dati.** Se le righe vengono da un foglio di calcolo, un export o una query, modificare le pipe a mano è il lavoro sbagliato — [convertine invece il CSV](/blog/best-csv-to-markdown-converters). Ogni colonna aggiunta significa toccare ogni riga, e una riga contata male perde un valore in silenzio. Mantieni il CSV o la query come fonte di verità e genera il Markdown: [convertire un CSV in una tabella Markdown](/csv-to-markdown) ti toglie del tutto il compito di contare e gestisce correttamente l'escape sui valori che contengono pipe, che è l'errore che le persone fanno a mano.

**Tabelle larghe.** Due problemi si nascondono dietro una sola lamentela. Il primo è il file sorgente, dove una tabella a nove colonne è misera da modificare e impossibile da revisionare. Il secondo è la pagina: una tabella HTML prende la larghezza che il suo contenuto richiede, quindi una larga o strizza le sue colonne in nastri o tira la pagina di lato. Correzioni, più o meno nell'ordine in cui dovrebbero piacerti:

- Taglia una colonna. Le tabelle larghe di solito contengono una con lo stesso valore in ogni riga, o due che potrebbero essere una.
- Abbrevia le intestazioni. Un'intestazione che non può andare a capo fissa la larghezza minima della colonna, quindi "Richiede autenticazione" costa più di "Auth".
- Trasponila. Quattro colonne e tre righe spesso si leggono meglio nell'altro senso.
- Dividila in due tabelle che condividono una colonna chiave.
- Fai in modo che scorra, avvolgendola in un contenitore a cui il tuo foglio di stile dà `overflow-x: auto`.

Quest'ultima ha una trappola che vale la pena spiegare, perché è un modo comune per rompere una tabella che prima andava bene:

```markdown
<div class="table-scroll">

| Column | Column |
| --- | --- |
| … | … |

</div>
```

Le righe vuote dentro il wrapper sono obbligatorie. Senza di esse la tabella siede dentro un blocco HTML grezzo, il parser lascia tutto il blocco in pace, e le tue pipe arrivano sulla pagina alla lettera. E il wrapper aiuta solo dove controlli il CSS. In un file HTML autonomo, se una tabella larga scorre o esce dai margini è deciso dal foglio di stile del tuo convertitore.

## Come scegliere la forma della tua tabella

1. **Conta le colonne prima di scrivere la riga di intestazione.** Il numero a cui ti impegni nella riga separatore è il numero che ogni riga deve onorare da quel momento, e aggiungerne una più tardi significa modificare ogni riga — quindi decidi una volta, mentre la tabella ha ancora tre righe.
2. **Decidi se i dati sono scritti a mano o generati.** La prosa appartiene a una tabella scritta a mano. Le righe che vengono da un foglio di calcolo o da un'API appartengono a una generata, perché un essere umano che ridigita quaranta righe di pipe sbaglierà il conteggio almeno una volta, e lo sbaglio è silenzioso.
3. **Chiediti se qualche cella avrà mai bisogno di una seconda riga.** Se sì, ti stai impegnando con `<br>` e con un sanificatore che lo mantenga. Se più di una cella ne ha bisogno, la tabella è il contenitore sbagliato, e la risposta giusta è una tabella breve più delle sezioni.
4. **Controlla il parser all'altro capo prima di fare affidamento su una tabella.** Un file che si vede su GitHub e si rompe in una build sta di solito incontrando un parser più severo con le tabelle disattivate, e preferiresti scoprirlo su un file di prova piuttosto che in un documento pubblicato.
5. **Converti una volta e leggi l'HTML, non l'anteprima.** Un'anteprima costruita sullo stesso parser del tuo editor è d'accordo con il tuo editor per costruzione. L'elemento `<table>` nell'output è la sola prova, e un `<th>` mancante lì ti dice quale riga correggere.

## Conclusione

Le tabelle Markdown sono fragili in un modo specifico: falliscono del tutto invece che in parte, e falliscono senza dirlo, il che le fa sembrare imprevedibili quando non lo sono. La riga separatore deve corrispondere al numero di celle dell'intestazione, il blocco ha bisogno di una riga vuota su ogni lato, una pipe letterale ha bisogno di una barra rovesciata, un a capo ha bisogno di `<br>`, e tutta la funzione ha bisogno di un parser che implementi GFM. Fai bene questi cinque punti e una tabella sopravvive a ogni conversione in cui la metterai. Prendi la tabella più larga e più piena di escape che hai, falla passare attraverso [TransformPipe](https://transformpipe.com), e leggi la fonte HTML accanto all'anteprima: una colonna mancante significa che i trattini sono contati male, e una cella divisa in due significa una pipe che non hai protetto con l'escape.

## FAQ

### Perché la mia tabella Markdown non si vede affatto?

Nove volte su dieci la riga separatore è sbagliata: mancante, sulla riga sbagliata, o con un numero di celle diverso dall'intestazione. Conta le celle nella prima riga e le celle nella seconda e falle coincidere. Se già coincidono, controlla una riga vuota sopra la tabella, e un trattino lungo dove avevi digitato tre trattini.

### Serve una riga vuota prima di una tabella Markdown?

Sì, in pratica. I parser non sono d'accordo su se una tabella possa interrompere un paragrafo, quindi una tabella scritta direttamente sotto una riga di prosa si rende in alcuni strumenti e viene assorbita nel paragrafo in altri. Una riga vuota prima della riga di intestazione e una dopo l'ultima riga di corpo elimina il disaccordo.

### Come metto un a capo dentro una cella di una tabella Markdown?

Con `<br>`, scritto inline dove serve l'interruzione. Non esiste sintassi Markdown per questo, perché una riga di tabella finisce alla fine della riga, e due spazi finali non fanno nulla dentro una cella. Se il tag sopravvive dipende dal sanificatore del tuo convertitore, non dal suo parser.

### Come faccio l'escape di un carattere pipe in una tabella Markdown?

Scrivi `\|`. Funziona nel testo di cella ordinario e dentro span di codice, quindi `` `a \| b` `` ti dà uno span di codice che contiene una pipe. In una destinazione di link, codificala in percentuale come `%7C` invece, poiché l'escape dentro gli URL è gestito in modo meno coerente tra i parser.

### Come allineo una colonna in una tabella Markdown?

Metti due punti nella riga separatore: `:---` per sinistra, `:---:` per centro, `---:` per destra. L'allineamento si applica a tutta la colonna, intestazione compresa, e non c'è modo di allineare una singola cella. Cosa emette il motore di rendering — un attributo `align` o uno stile `text-align` — varia, ed entrambi appaiono identici in un browser.

### Le tabelle fanno parte del Markdown standard?

No. Le tabelle non sono né nel Markdown originale né in CommonMark; vengono da estensioni, e la versione di GitHub Flavored Markdown è quella che implementa la maggior parte degli strumenti. Un parser CommonMark stretto rende la tua tabella come un paragrafo di caratteri pipe, e si comporta correttamente nel farlo.

### Cosa faccio con una tabella Markdown troppo larga?

Taglia una colonna, abbrevia le intestazioni, o trasponila — quelle correggono anche la fonte, non solo la pagina. Se i dati hanno davvero bisogno della larghezza, avvolgi la tabella in un `<div>` a cui il tuo foglio di stile dà `overflow-x: auto`, ricordando le righe vuote dentro il wrapper, e accetta che il wrapper aiuta solo dove controlli il CSS.
