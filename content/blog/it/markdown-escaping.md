---
title: "I caratteri di escape in Markdown: la guida completa"
description: "Quali caratteri il backslash rende letterali, dove l'escape non serve a nulla, quando un riferimento di carattere è la scelta giusta"
updated: 2026-09-14
date: 2026-09-06
tag: Sintassi
keywords: caratteri di escape markdown, escape backslash markdown, escape asterisco markdown, underscore ed enfasi markdown, escape pipe in una tabella markdown, riferimenti di carattere html, caratteri speciali markdown, escape underscore markdown, snake_case markdown, escape backtick markdown
---

Un asterisco che intendevi come testo normale trasforma in corsivo mezza frase. Un anno all'inizio di una riga diventa la voce numero 1.986 di un elenco. Un percorso Windows perde uno dei suoi backslash sulla strada verso la pagina, e nessuno se ne accorge finché qualcuno non lo copia in un terminale. Ognuno di questi è un carattere che fa il suo lavoro documentato in un punto a cui non stavi pensando.

### In breve

Un backslash rende letterale uno qualunque dei **trentadue caratteri di punteggiatura ASCII**, e nulla oltre a quelli — davanti a una lettera, una cifra, uno spazio o un carattere non ASCII è soltanto un backslash, stampato. L'escape non fa **assolutamente nulla** dentro uno code span, un blocco di codice con fence o indentato, un autolink o dell'HTML grezzo, e questa è la regola in cui finisce quasi ogni problema di escape. I **riferimenti di carattere** (`&amp;`, `&lt;`, `&#42;`, `&copy;`) sono l'altra strada, e la sola che funziona dove il backslash è inerte o dove il carattere non è punteggiatura ASCII. La maggior parte dei caratteri ha bisogno dell'escape in una sola posizione — un cancelletto a inizio riga, una pipe dentro una cella di tabella — e uno code span è la risposta portabile a tutto questo, al prezzo di un testo in monospaziato.

Le regole vengono da un solo posto. CommonMark è la specifica che le stabilisce, e la versione 0.31.2, datata 28 gennaio 2024, è quella attuale (verificato su spec.commonmark.org, il 9 settembre 2026). Dice due frasi sui backslash che insieme decidono ogni caso di questa pagina: qualunque carattere di punteggiatura ASCII può essere reso letterale con un backslash, e i backslash davanti a qualunque altro carattere sono trattati come backslash letterali.

Quello che una specifica non può risolvere è che l'escape fallisce in entrambe le direzioni e nessuno dei due fallimenti si annuncia. Se fai troppo poco escape, il carattere viene interpretato: la tua prosa guadagna un'enfasi, un titolo, un elenco, un link. Se ne fai troppo, il backslash sparisce comunque dall'output — `\:` viene reso come un semplice due punti — e così il file si riempie di backslash che non fanno nulla, e chi lo modifica dopo di te non può capire quali contano davvero. In entrambi i casi il risultato sembra giusto in un'anteprima che usa lo stesso parser tuo e sbagliato ovunque altrove.

C'è una versione più breve di questo materiale in [l'articolo sui salti di riga e gli elenchi](/blog/markdown-line-breaks-and-lists), che copre i caratteri che entrano in collisione con i marcatori di elenco e i due modi di interrompere una riga. Questa pagina è il resto: l'intero insieme di caratteri che si può rendere letterale, i quattro contesti dove un backslash è morto, i riferimenti di carattere, cosa un convertitore rende letterale al posto tuo, e la manciata di casi concreti — sintassi dei template, percorsi Windows, simboli del dollaro, `snake_case` — che genera quasi tutte le segnalazioni.

## Cosa fa un backslash, e i trentadue caratteri su cui funziona

Un backslash davanti a un carattere di punteggiatura ASCII gli togli il significato e togli anche se stesso dall'output. L'insieme dei caratteri su cui funziona è fisso, e sono questi trentadue: ``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`` (verificato su spec.commonmark.org, il 9 settembre 2026). È ogni carattere ASCII stampabile che non è né una lettera, né una cifra, né uno spazio.

Tutto il resto è un backslash letterale. `\q` viene reso come `\q`, backslash incluso. Lo stesso vale per `\3`, e lo stesso vale per un backslash davanti a una lineetta lunga o a una virgoletta tipografica, perché quelle sono punteggiatura ma non punteggiatura ASCII. Questa è la metà della regola che la gente si scorda, ed è il motivo per cui un percorso Windows di solito arriva intatto e poi perde esattamente un separatore in un solo punto.

Due conseguenze da tenere a mente prima della tabella. Primo, l'escape è per singolo carattere, non per zona: non esiste un marcatore "da qui in poi è testo letterale" in Markdown, quindi `\*\*non in grassetto\*\*` sono quattro backslash per un solo effetto. Secondo, un escape è inerte ma non invisibile — scompare dalla pagina renderizzata e resta nel file, il che significa che un Markdown con troppi escape si legge come rumore per una persona e converte in modo identico per una macchina.

| Carattere | Cosa significa se non è reso letterale | Dove ha quel significato | Come scriverlo letteralmente |
| :--- | :--- | :--- | :--- |
| `\` | Il carattere di escape stesso | Ovunque nel testo | `\\` |
| `` ` `` | Apre uno code span | Ovunque nel testo in linea | ``\` ``, oppure racchiudi il tratto in più backtick |
| `*` | Enfasi ed enfasi forte; un punto elenco; una linea di separazione | Ovunque nel testo, anche a metà parola; inizio riga | `\*` |
| `_` | Enfasi ed enfasi forte; una linea di separazione | Solo ai confini di parola; inizio riga | `\_` — gli underscore a metà parola non hanno bisogno di nulla |
| `#` | Un titolo ATX; una sequenza di chiusura del titolo | Inizio riga, entro tre spazi dal margine; fine di un titolo | `\#` |
| `>` | Una citazione | Inizio riga | `\>` |
| `-` | Un punto elenco; una sottolineatura setext per `<h2>`; una linea di separazione; un delimitatore di front matter | Inizio riga | `\-` |
| `+` | Un punto elenco | Inizio riga | `\+` |
| `=` | Una sottolineatura setext per `<h1>` | Una riga proprio sotto un paragrafo | `\=` |
| `.` | Un delimitatore di elenco numerato, dopo delle cifre | Inizio riga | `1986\.` |
| `)` | Un delimitatore di elenco numerato, dopo delle cifre; la fine di una destinazione di link | Inizio riga; dentro `(…)` | `1986\)`, `\)` |
| `(` | L'inizio di una destinazione di link | Dentro un link | `\(` |
| `[` `]` | L'etichetta di un link, immagine, riferimento o nota; il marcatore di una task list | Ovunque nel testo | `\[` `\]` |
| `!` | Un'immagine, se seguito da `[` | Ovunque nel testo | `\!` |
| `<` | Un autolink, un tag HTML grezzo, o un blocco HTML | Ovunque nel testo; inizio riga | `\<`, oppure `&lt;` |
| `>` | La fine di un autolink o di un tag HTML grezzo | Dentro `<…>`, dove un backslash è inerte | `&gt;` nella prosa; percent-encoding dentro un URL |
| `&` | L'inizio di un riferimento di carattere | Ovunque nel testo | `&amp;` |
| `\|` | Un confine di cella in una tabella GFM | Solo dentro una riga di tabella — anche dentro uno code span | `\|` |
| `~` | Testo depennato in GFM, in coppia; un fence alternativo | Ovunque nel testo; inizio riga | `\~` |
| `"` `'` | Niente, a meno che la punteggiatura intelligente non sia attiva; delimita un titolo di link | Dentro `(… "…")` | `\"`, oppure `&quot;` |
| `$` | Niente in CommonMark o in GFM; un delimitatore matematico dove quell'estensione è attiva | Solo con un'estensione matematica | `\$`, oppure uno code span |
| `{` `}` | Niente in CommonMark; blocchi di attributi e sintassi di template in altri strumenti | Solo in quegli strumenti | `\{` `\}`, oppure un blocco con fence |
| `:` | Niente in CommonMark; definizioni di note ed emoji shortcode altrove | Solo in quegli strumenti | `\:` |
| `%` `,` `/` `;` `?` `@` `^` | Niente, in nessun punto, in nessun dialetto comune | In nessun posto | Si può rendere letterale, ma non serve mai |

La quarta colonna è dove sta il lavoro vero. Sei di questi caratteri — `#`, `>`, `-`, `+`, `.` e `)` — hanno un significato solo a inizio riga, quindi un cancelletto in mezzo a una frase è solo un cancelletto e un trattino tra due parole è solo un trattino. Renderli letterali dappertutto è un'abitudine presa da strumenti che fanno escape per prudenza, e ti costa un file pieno di backslash senza nessuna differenza nell'output.

## Dove l'escape non serve proprio a nulla

Questa è la regola che genera più confusione, ed è una sola frase nella specifica: gli escape con il backslash non funzionano nei blocchi di codice, negli code span, negli autolink o nell'HTML grezzo (verificato su spec.commonmark.org, il 9 settembre 2026). In tutti e quattro i casi, un backslash è contenuto. Viene stampato.

L'ordine in cui la gente lo scopre è sempre lo stesso. Rendono letterale un carattere, esce comunque sbagliato, quindi lo racchiudono anche fra backtick — e ora il backslash è sulla pagina.

```markdown
a `\*` span
```

viene reso come la parola "a", poi uno code span che contiene `\*`, poi la parola "span" — il backslash visibile sulla pagina, perché dentro lo code span ha perso il potere e ha mantenuto la larghezza. La correzione è togliere l'escape, non aggiungerne un altro.

**Code span e blocchi di codice.** Tutto quello che sta fra i backtick, o dentro un fence, o indentato di quattro spazi, è testo letterale. `\\` resta due backslash; `\_` resta un backslash e un underscore. Questa è una caratteristica, ed è il motivo per cui uno code span è il contenitore giusto per un pattern glob, un'espressione regolare, una stringa di formato `printf` o un percorso Windows — guarda [cos'altro un blocco con fence interpreta e cosa no](/blog/code-blocks-in-markdown) per il lato dell'info string.

**Autolink.** Un autolink è un URL fra parentesi angolari, e il suo contenuto è un URL, non Markdown. Fai l'escape di qualcosa al suo interno e il backslash diventa parte dell'indirizzo: `<https://example.com/a\_b>` produce un link il cui `href` contiene `%5C`, il percent-encoding di un backslash. Il testo del link sembra quasi giusto e la destinazione è sbagliata, che è la combinazione peggiore possibile.

**HTML grezzo.** Dentro un tag, un backslash è un backslash. Provare a rendere letterali le virgolette in un attributo — `<div title="a\"b">` — fa terminare l'attributo alla seconda virgoletta con un backslash spaiato dentro, esattamente come farebbe un browser. Gli attributi HTML si trattano con riferimenti di carattere, `&quot;`, e mai con backslash.

**Blocchi HTML.** Un blocco di HTML grezzo viene passato tutto intero, senza nessun parsing in linea al suo interno, quindi non c'è nulla che debba essere reso letterale in primo luogo. Un asterisco in un blocco HTML è un asterisco. Un backslash che aggiungi per prudenza verrà stampato.

| Contesto | Cosa fa lì un backslash | Cosa usare invece |
| :--- | :--- | :--- |
| Code span, `` `…` `` | Viene stampato, come contenuto | Niente — lo span protegge già il testo |
| Blocco con fence | Viene stampato, come contenuto | Niente |
| Blocco indentato, quattro spazi | Viene stampato, come contenuto | Niente |
| Autolink, `<…>` | Diventa parte dell'URL, percent-encoded | Fai il percent-encoding del carattere in modo corretto |
| Tag o attributo HTML grezzo | Viene stampato, e rompe l'attributo | Un riferimento di carattere: `&quot;`, `&amp;` |
| Blocco HTML | Viene stampato | Niente — la sintassi in linea non viene analizzata lì |
| Destinazione di link, `(…)` | Funziona: `\(` e `\)` sono rispettati | Un backslash, oppure il percent-encoding |
| Titolo di link, `"…"` | Funziona: `\"` è rispettato | Un backslash |
| L'info string di un fence | Funziona | Un backslash |

Le ultime tre righe sono lo specchio delle prime sei, e sorprendono nella direzione opposta: gli escape funzionano nelle destinazioni di link, nei titoli di link e nelle info string. Una parentesi dentro un URL si può rendere letterale invece di fare il percent-encoding, e un titolo che contiene una virgoletta può portarne una.

C'è esattamente un'eccezione documentata alla regola dello code span, ed è della GitHub Flavored Markdown, non di CommonMark. L'estensione delle tabelle dice di includere una pipe nel contenuto di una cella rendendola letterale, anche dentro altri span in linea (verificato su github.github.com, il 9 settembre 2026, specifica versione 0.29-gfm datata 6 aprile 2019). Il motivo è meccanico: il parser delle tabelle divide una riga sulle pipe prima che avvenga qualunque parsing in linea, quindi `\|` deve essere gestito in quella fase precedente, e per questo funziona nell'unico posto dove gli escape altrimenti non arriverebbero. Scrivi `` `x \| y` `` in una cella e ottieni uno code span che contiene `x | y`. Scrivi `` `x | y` `` e ottieni due celle.

## I riferimenti di carattere, e quando sono la scelta migliore

Il secondo modo di scrivere un carattere letterale è nominarne il code point. CommonMark ne riconosce tre forme: `&` più un nome di entità HTML5 valido più `;`, `&#` più una a sette cifre decimali più `;`, e `&#` più `x` o `X` più una a sei cifre esadecimali più `;`. Un code point non valido viene sostituito da U+FFFD, il carattere di sostituzione, e un nome non riconosciuto resta come testo letterale (verificato su spec.commonmark.org, il 9 settembre 2026).

La proprietà che li rende utili è una riga della stessa sezione: i riferimenti non vengono riconosciuti dentro blocchi di codice e code span, e non possono stare al posto di caratteri strutturali. `&#42;` è un asterisco letterale nell'output e non è mai l'inizio di un'enfasi; `&#35;` a inizio riga è un cancelletto, non un titolo. Dove un backslash toglie un significato, un riferimento non ne aveva mai uno da togliere — il carattere arriva dopo che il parser ha già finito di decidere cos'è la riga.

| Riferimento | Carattere | Perché ti servirebbe |
| :--- | :--- | :--- |
| `&amp;` | `&` | Quello che non puoi evitare: un `&` isolato può iniziare un riferimento |
| `&lt;` `&gt;` | `<` `>` | Prosa che parla di HTML, e ovunque l'HTML grezzo sia permesso |
| `&quot;` | `"` | Dentro un attributo HTML, dove un backslash rompe il valore |
| `&#42;` | `*` | Un asterisco letterale che nessun parser può leggere come enfasi |
| `&#95;` | `_` | Lo stesso, per un underscore, in un dialetto con enfasi a metà parola |
| `&#124;` | `\|` | Una pipe in una cella di tabella, in un renderer di cui non ti fidi per il `\|` |
| `&copy;` `&reg;` | `©` `®` | Non sono punteggiatura ASCII, quindi un backslash non può renderli letterali comunque |
| `&nbsp;` | Uno spazio non divisibile | Tenere "10 MB" o "Figura 3" sulla stessa riga |
| `&#x2014;` | Una lineetta lunga | Un carattere che il font o la tastiera del tuo editor rende scomodo |

Un riferimento è la scelta migliore in quattro situazioni. Dove un backslash è inerte — dentro HTML grezzo, o in un valore di attributo. Dove il carattere non è punteggiatura ASCII, quindi non c'è nulla da rendere letterale: `©`, `®`, `†`, uno spazio non divisibile, una lineetta tipografica. Dove il file passerà attraverso uno strumento che elimina o duplica i backslash, perché `&amp;` sopravvive a una sostituzione di stringa ingenua che `\&` non sopravvive. E dove vuoi che il carattere sia immune alle differenze tra dialetti, dato che `&#42;` si comporta in modo identico in qualunque renderer che implementi i riferimenti.

I costi sono reali e vanno detti. Un riferimento è HTML, quindi ha senso solo su un percorso che finisce in HTML: converti lo stesso file [in testo semplice](/blog/markdown-to-plain-text) o in un word processor, e un convertitore che non risolve i riferimenti stamperà `&nbsp;` come sei caratteri visibili. I riferimenti sono un elenco più corto di quanto sembri: solo i caratteri con un nome HTML5 funzionano nella forma nominata, quindi nomi inventati come `&asterisk;` restano testo. E sono illeggibili nella fonte — nessuno che scorre un paragrafo riconosce `&#8212;` a colpo d'occhio.

## I caratteri che contano solo in una posizione

La maggior parte dell'escape che la gente fa è superfluo, perché la maggior parte di questi caratteri è speciale solo in un punto preciso. Imparare le posizioni costa meno che imparare la tabella.

**Inizio riga.** È qui che si decide la struttura a blocchi, ed è qui che un carattere che era stato innocuo per tutto il documento smette improvvisamente di esserlo. Un `#` diventa un titolo. Un `>` diventa una citazione. Un `-` o un `+` diventa un punto elenco — e un `-` sulla riga sotto un paragrafo diventa una sottolineatura setext `<h2>`, trasformando la frase sopra in un titolo. Un `=` su quella riga la rende un `<h1>`. Delle cifre seguite da `.` o `)` diventano un marcatore di elenco numerato, e il numero viene usato: un paragrafo che comincia con "1986. L'anno in cui lo standard è cambiato" viene reso come un elenco numerato il cui primo elemento porta il numero 1.986, perché il marcatore fissa l'attributo di partenza dell'elenco. Tutti questi hanno bisogno di un solo backslash, messo sul carattere e non a inizio riga: `1986\.`, non `\1986.`.

Anche l'indentazione conta come posizione. Un marcatore a livello di blocco funziona ancora con fino a tre spazi davanti, e quattro spazi producono invece un blocco di codice indentato — quindi spostare una riga a destra non disinnesca un cancelletto, e spostarla ancora più a destra lo trasforma in qualcosa di completamente diverso.

**Fine di un titolo.** Una sequenza finale di cancelletti in un titolo ATX è una sequenza di chiusura e viene rimossa: `### Note ###` viene reso come "Note". Se i cancelletti fanno parte del testo, rendi letterale la sequenza — `### Note \###` — e restano.

**Dentro una cella di tabella.** La pipe è il carattere il cui significato speciale è confinato a un solo costrutto, ed è assoluto lì dentro: una pipe non resa letterale chiude la cella, comunque sia racchiusa. Tutto ciò che riguarda [tenere intatta una tabella attraverso una conversione](/blog/markdown-tables-that-survive-conversion) parte da questo unico carattere.

**Nel testo e nella destinazione di un link.** Le parentesi quadre si annidano male, quindi una parentesi quadra dentro il testo di un link va resa letterale: `[a \[b\] c](https://example.com)`. Dentro la destinazione, le parentesi rotonde bilanciate di solito vanno bene e una non bilanciata ha bisogno di `\(` o `\)`. Uno spazio dentro una destinazione non è affatto un problema di escape — un backslash non lo salva, e tutto il link degrada a testo semplice; fai il percent-encoding.

**Dentro il titolo di un link.** Una virgoletta dentro un titolo `"…"` ha bisogno di `\"`, uno dei pochi punti dove un backslash funziona e la gente immagina che non funzioni.

### Il backslash a fine riga

C'è una posizione in cui un backslash non è affatto un escape, e vale la pena conoscere questa collisione. La specifica lo dice chiaramente: un backslash a fine riga è un'interruzione di riga forzata (verificato su spec.commonmark.org, il 9 settembre 2026). Quindi una riga di paragrafo che finisce con un solo backslash non ne stampa uno — emette un `<br>` e unisce la riga successiva a se stessa.

Questo conta in un solo caso comune, ed è un caso Windows. Un percorso di cartella scritto in prosa e che finisce con un separatore, `C:\logs\`, se si trova a fine riga diventa un'interruzione di riga, portandosi via il backslash. Due backslash, `C:\logs\\`, ti danno un backslash letterale e nessuna interruzione. Uno code span ti dà il percorso e nient'altro, che è la risposta giusta.

Alla fine di un blocco — l'ultima riga di un paragrafo, la fine di un titolo — nessuna delle due sintassi di interruzione ha una riga da interrompere, e il backslash viene stampato invece. Questa asimmetria è il lato utile del confronto tra le due forme di interruzione forzata: un backslash rimasto è visibile sulla pagina, mentre gli spazi finali rimasti non lo sono.

## Cosa un convertitore rende letterale al posto tuo in uscita

L'escape non è solo qualcosa che fai a un file di partenza. Ogni conversione, in entrambe le direzioni, inserisce degli escape, e sapere quali ti dice come leggere un output rotto.

**Da Markdown a HTML.** Tre caratteri nel tuo testo non possono viaggiare come se stessi, perché l'HTML li leggerebbe come markup. Un convertitore li sostituisce, in silenzio e sempre.

| Nel tuo Markdown | Nell'HTML | Perché |
| :--- | :--- | :--- |
| `<` nel testo | `&lt;` | Altrimenti il browser inizia a interpretare un tag |
| `&` nel testo | `&amp;` | Altrimenti il browser inizia a interpretare un riferimento |
| `>` nel testo | `&gt;` | Simmetria, e sicurezza nei parser più vecchi |
| `"` in un attributo | `&quot;` | Altrimenti il valore dell'attributo finisce troppo presto |
| `'` in un attributo | `&#39;` | Lo stesso, per attributi tra apici singoli |

Questo è il motivo per cui un `<div>` letterale digitato dentro una frase compare come testo sulla pagina invece di svanire nel markup, e non è una finezza moderna ma un comportamento antico: il documento originale della sintassi Markdown nota che dentro code span e blocchi, le parentesi angolari e le e commerciali vengono sempre codificate automaticamente (verificato su daringfireball.net, il 9 settembre 2026). Un riferimento di carattere che hai scritto tu viene lasciato intatto — un convertitore che ri-facesse l'escape di `&amp;` trasformandolo in `&amp;amp;` romperebbe ogni documento che ne contiene uno.

**Da HTML, Word, CSV o JSON a Markdown.** Qui il convertitore deve inserire dei backslash, e questo è un buon modo per giudicarne uno. Un paragrafo che comincia con "1986. L'anno" deve arrivare come `1986\. L'anno` o il documento acquisisce un elenco che nessuno ha scritto. Una frase che contiene un asterisco, una cella di tabella che contiene una pipe, un titolo il cui testo contiene un cancelletto, un nome di prodotto che contiene un underscore a un confine di parola: ognuno ha bisogno di un backslash inserito a metà conversione, e un convertitore che salta il passaggio restituisce un file che viene renderizzato come un documento diverso da quello che gli è stato dato. [Testare una conversione con un paragrafo scomodo apposta](/blog/convert-html-to-markdown) prima di fidarsi con cento pagine costa un minuto.

**Da testo semplice a Markdown.** Lo stesso problema si presenta senza nulla da convertire: un file `.txt` non è mai stato Markdown, quindi uno qualunque dei trentadue caratteri qui sopra che è finito dentro per caso — un punto elenco scritto come trattino, un marcatore di nota scritto come underscore, un anno a inizio riga — viene letto come formattazione nel momento in cui il file viene trattato come Markdown, anche se nessuno lo intendeva. [La conversione da testo grezzo a Markdown di TransformPipe](/text-to-markdown) esiste esattamente per questo caso: rende letterali i caratteri propri di Markdown nella fonte prima che qualcosa li renderizzi, così il file dice sulla pagina esattamente quello che diceva nel `.txt`, asterischi compresi.

**Perché compare `&amp;lt;` in una pagina.** Perché qualcosa ha avuto due passaggi di escape. `<` è diventato `&lt;`, e poi un secondo passaggio ha trattato quella stringa come testo semplice e ha reso letterale la sua e commerciale in `&amp;`, dando `&amp;lt;` — che il browser rende fedelmente come il testo visibile `&lt;`. A tre e commerciali di profondità, `&amp;amp;lt;`, ci sono tre passaggi. La causa è quasi sempre una pipeline dove due fasi credono entrambe di essere quella responsabile dell'escape: un convertitore che produce HTML, che alimenta un motore di template che fa l'escape dei propri input; oppure un sanitizzatore eseguito dopo l'escape invece che prima. La diagnosi è aritmetica — conta gli strati di `amp;` e sai quante fasi hanno fatto l'escape — e la correzione è togliere una fase di escape, mai aggiungerne una che lo tolga.

Il sintomo speculare è un backslash su una pagina renderizzata dove ti aspettavi un carattere pulito. Significa che un testo con escape Markdown è arrivato a qualcosa che non è un renderer Markdown: un campo di testo semplice, un attributo `title`, uno code span aggiunto dopo che gli escape erano già stati fatti. Oppure gli escape non dovrebbero esserci, oppure il testo non dovrebbe stare in quel contenitore.

## I casi che si presentano davvero

Cinque situazioni spiegano quasi ogni segnalazione reale sull'escape. Nessuna è esotica, e solo una riguarda davvero Markdown.

### Scrivere di Markdown in Markdown

Il documento più difficile da scrivere in Markdown è un documento su Markdown, perché ogni esempio è un costrutto vivo. Fare l'escape carattere per carattere funziona e si legge malissimo: `\*\*grassetto\*\*` nella fonte è peggio della cosa che descrive.

Usa invece gli code span, e usa la regola dell'imbottitura quando l'esempio contiene dei backtick. Uno code span può essere aperto con un numero qualsiasi di backtick e si chiude con lo stesso numero, e uno spazio iniziale e finale viene rimosso, quindi uno span a due backtick con degli spazi dentro contiene un backtick letterale. Per mostrare un blocco con fence, apri il fence esterno con quattro backtick e metti l'esempio a tre backtick dentro:

    ````
    ```js
    const x = 1;
    ```
    ````

Per qualcosa di breve — un frammento di sintassi, un flag, un marcatore — uno code span è al tempo stesso corretto e più corto dell'escape. **Per chi è:** chiunque scriva documentazione, una guida di stile o un README che cita della sintassi.

### Frammenti con sintassi di template

`{{ }}`, `{% %}` e `${…}` generano un flusso costante di domande sull'escape, e nessuna di queste è un problema di Markdown. Le parentesi graffe si possono rendere letterali ma non significano nulla in CommonMark: `{{ name }}` in un paragrafo viene reso come `{{ name }}`. Quello che le consuma è un secondo processore che lavora sullo stesso file — il motore di template di un generatore di siti statici, una build di documentazione, un framework a componenti — eseguito prima di Markdown o dopo.

Quindi un backslash non può aiutare, perché il motore che consuma le parentesi graffe non ha mai sentito parlare degli escape di Markdown. Ogni motore ha il suo meccanismo, e quello di Liquid è l'esempio più chiaro: il suo tag `raw` disattiva temporaneamente l'elaborazione dei tag, e la documentazione dà la sintassi di Handlebars come il motivo per cui ti servirebbe (verificato su shopify.github.io, il 9 settembre 2026). Un blocco di codice con fence non è protezione qui: un motore di template che gira sul file `.md` grezzo non ha idea che il fence esista.

`${…}` è una terza variante della stessa forma: dentro un template literal JavaScript è interpolazione, e l'escape che la blocca è il backslash di JavaScript, nel codice, non quello di Markdown. Fare l'escape nel Markdown ti dà un documento che contiene `\${…}`, che è sbagliato due volte.

**Per chi è:** chiunque documenti un linguaggio di template, uno script di shell o una configurazione CI dentro un sito che è a sua volta costruito con dei template. Trova prima il tag raw del motore esterno; la correzione non passa dal livello Markdown.

### Percorsi Windows

Un percorso come `C:\Users\name\Documents` di solito sopravvive a un renderer Markdown, e questa è la trappola. Ogni backslash è seguito da una lettera, quindi ognuno è un backslash letterale e viene stampato. Poi un percorso nel documento si trova seguito da punteggiatura ASCII e perde un separatore senza nessun avviso: `C:\temp\_new` viene reso come `C:\temp_new`, e `C:\logs\` a fine riga diventa un'interruzione di riga.

Niente nell'output lo segnala. Il percorso resta plausibile, ed è per questo che il bug arriva in un articolo di supporto e viene copiato nel terminale di qualcuno prima che qualcuno se ne accorga. Duplicare ogni backslash funziona e rende la fonte illeggibile. Uno code span funziona, è più corto, e protegge tutto il tratto in una volta — dentro i backtick un backslash è contenuto, sempre, e non resta niente che possa andare storto.

**Per chi è:** chiunque scriva istruzioni di installazione, percorsi di log o file di configurazione per Windows. Metti ogni percorso in uno code span per abitudine, e questa classe di bug scompare.

### Valute e matematica con il simbolo del dollaro

In CommonMark puro e in GFM, `$` non significa nulla. "Costa fra 5 e 10 dollari" viene reso esattamente com'è scritto, e non serve nessun escape. Il problema comincia dove un'estensione matematica è attiva, perché lì `$…$` è un delimitatore e due simboli del dollaro sulla stessa riga diventano un'espressione matematica che contiene la tua frase.

GitHub è il posto dove più persone se lo trovano davanti. La sua documentazione dice che un'espressione in linea è racchiusa da simboli del dollaro, che dentro un'espressione matematica va aggiunto un backslash davanti a un `$` esplicito, e — la parte da ricordare — che fuori da un'espressione matematica ma sulla stessa riga si dovrebbero usare tag span attorno al `$` esplicito (verificato su docs.github.com, il 9 settembre 2026). È un'istruzione a usare dell'HTML grezzo invece di un backslash, e ti dice quanto saldamente sia stato preso il simbolo del dollaro su quella piattaforma.

La risposta portabile è quella di sempre: metti l'importo in uno code span, oppure scrivi la valuta a parole. **Per chi è:** chiunque scriva di prezzi, cifre finanziarie o unità di misura in un repository il cui README viene renderizzato da una piattaforma con la matematica attiva.

### Underscore dentro gli identificatori

Questa è la segnalazione reale più comune, e la buona notizia è che CommonMark ha già risolto la maggior parte del problema. Un underscore può aprire o chiudere un'enfasi solo a un confine di parola, quindi `snake_case_name` viene reso come se stesso, intatto, e non ha bisogno di nessun backslash. Non è così per gli asterischi: `a*b*c` mette in enfasi la `b`, perché `*` non porta nessuna restrizione simile.

Tre forme si rompono ancora, e sono quelle che generano le segnalazioni.

| Cosa scrivi | Cosa ottieni | Perché |
| :--- | :--- | :--- |
| `snake_case_name` | `snake_case_name` | Entrambi gli underscore sono dentro una parola: nessuna enfasi |
| `__init__` | "init" in grassetto | Entrambe le coppie sono a un confine di parola, quindi entrambe possono agire da delimitatore |
| `_private and id_` | "private and id" in corsivo | Un underscore iniziale apre; uno finale, frasi più avanti, chiude |
| `MAX_VALUE and MIN_VALUE` | Invariato | Entrambi sono a metà parola |
| `a*b*c` | `a<em>b</em>c` | Gli asterischi non hanno nessuna regola di confine di parola |

`__init__` è il caso che costa più tempo, perché i nomi dunder di Python sono esattamente il pattern che la regola dell'enfasi è pensata per intercettare, e l'output — un testo in grassetto dove dovrebbe stare un nome di metodo — sembra un incidente di stile piuttosto che un incidente di sintassi. `\_\_init\_\_` lo corregge con quattro backslash. Uno code span lo corregge con due backtick, e in più evita che il nome venga riformattato, corretto dal controllo ortografico o trasformato in un pasticcio di virgolette intelligenti.

La regola del confine di parola è di CommonMark, che è l'altra metà della risposta: un renderer precedente a quella regola, o uno che implementa una regola di enfasi diversa, potrebbe mettere in enfasi gli underscore a metà parola dopo tutto. **Per chi è:** chiunque scriva di codice nella prosa — identificatori, variabili d'ambiente, colonne di database, nomi di flag. Uno code span è corretto in ogni dialetto e comunica in più "questo è un simbolo".

## La parte onesta: l'escape è per-dialetto ai margini

Tutto quello che precede è vero per CommonMark, e CommonMark non è l'unica cosa che renderizza il tuo file. L'insieme dei caratteri che si possono rendere letterali è a sua volta una decisione di dialetto, e la differenza non è piccola.

Il documento originale della sintassi Markdown elenca esattamente quindici caratteri che si possono rendere letterali: backslash, backtick, asterisco, underscore, le parentesi graffe, le parentesi quadre, le parentesi rotonde, cancelletto, più, meno, punto e punto esclamativo (verificato su daringfireball.net, il 9 settembre 2026). CommonMark ha ampliato quell'insieme a tutti i trentadue caratteri di punteggiatura ASCII. Quindi `\|`, `\~`, `\$`, `\:` e `\=` sono escape in un renderer CommonMark e backslash stampati in uno precedente a CommonMark. Un file che fa l'escape per prudenza per il primo è un file con backslash visibili nel secondo, ed entrambi i renderer fanno esattamente quello che dice la loro documentazione.

I margini si muovono anche nell'altra direzione. GFM dà a `|` e `~` significati che CommonMark non ha — un confine di cella e, in coppia, il testo depennato — e aggiunge l'escape della pipe dentro uno code span per gestire il primo dei due (verificato su github.github.com, il 9 settembre 2026). Un'estensione matematica si appropria di `$`. La sintassi dei blocchi di attributi si appropria di `{` e `}`. Gli emoji shortcode e alcune sintassi di note si appropriano di `:`. Ognuno di questi sposta un carattere dalla colonna "non ha mai bisogno di escape" a quella che invece ce l'ha, e nessuno di questi è in una specifica che si possa citare come quella definitiva. [Quanto si allontanano i dialetti e quali funzioni appartengono a quale](/blog/commonmark-gfm-and-the-flavours) è lo sfondo di tutto questo.

Il che lascia una sola risposta portabile, e ha un costo facile da trascurare. Uno code span funziona ovunque: nessun dialetto interpreta il suo contenuto, nessuna estensione si appropria di un carattere al suo interno, e la domanda sull'escape non si pone. Ma uno code span non è un contenitore neutro — cambia il testo. Viene renderizzato in monospaziato, di solito con uno sfondo colorato e una dimensione un po' diversa, e porta con sé la semantica del "questo è codice". Va bene per un percorso, un flag o un identificatore. È sbagliato per il nome di un'azienda che contiene una e commerciale, un prezzo, una frase che parla di un asterisco, o un titolo. Racchiudere della prosa in backtick per evitare un problema di escape scambia un bug sintattico con un bug tipografico, e quello tipografico è il tipo che un designer nota e uno scrittore difende.

Quindi non c'è una risposta unica, solo una breve classifica. Dentro uno code span se il testo è codice. Un backslash se è prosa e un dialetto deve renderizzarla. Un riferimento di carattere se un backslash non può arrivare o il carattere non è punteggiatura ASCII. E riscrivere la frase — spostare l'anno dall'inizio della riga, scrivere la valuta per intero — più spesso di quanto la gente ci provi, perché una frase che non ha bisogno di escape viene renderizzata correttamente in ogni dialetto che esisterà mai.

## Scegliere un escape, in cinque criteri

1. **Decidi se il testo è codice, perché questo risolve la maggior parte dei casi.** Un percorso, un flag, un identificatore o un pattern va dentro uno code span, dove non serve nessun escape e nessuno verrà interpretato; se il testo è prosa, uno code span è lo strumento sbagliato e torni ai backslash.
2. **Controlla la posizione prima di aggiungere qualcosa.** Sei dei caratteri che contano hanno importanza solo a inizio riga, quindi un backslash in mezzo a una frase è quasi sempre un backslash che dovrai spiegare a qualcuno più avanti.
3. **Fai l'escape una volta sola, e sappi quale fase lo fa.** Una pipeline dove due fasi fanno entrambe l'escape produce `&amp;lt;` sulla pagina, e l'unica correzione è togliere una delle due — aggiungere una fase che tolga l'escape per compensare nasconde il difetto e rompe il prossimo documento.
4. **Usa un riferimento di carattere quando il backslash non può arrivare.** Dentro HTML grezzo, in un valore di attributo, o per un carattere che non è punteggiatura ASCII, `&quot;` e `&copy;` funzionano dove `\"` e `\©` non fanno assolutamente nulla.
5. **Renderizza il file dove vivrà davvero prima di impegnarti in uno schema.** L'insieme dei caratteri che si possono rendere letterali, le regole dell'enfasi e il significato di `$`, `|` e `:` variano tutti per dialetto, quindi un documento che sembra giusto nell'anteprima del tuo editor può portare backslash visibili sulla piattaforma che lo pubblica.

## Conclusione

L'escape in Markdown è una regola con una lunga coda: un backslash disinnesca qualunque carattere di punteggiatura ASCII, non fa nulla davanti a qualunque altra cosa, e non fa assolutamente nulla dentro uno code span, un blocco di codice, un autolink o dell'HTML grezzo. Quasi ogni problema è la seconda metà di quella frase che incontra un carattere che era speciale solo in una posizione. I riferimenti di carattere coprono quello che il backslash non può raggiungere, gli code span coprono quello a cui preferiresti non pensare, e una frase riscritta copre il resto. Se vuoi vedere cosa produce davvero un certo file — quali escape sono sopravvissuti, quali caratteri sono stati interpretati, e cosa dice l'HTML — [convertirlo in TransformPipe e leggere l'output](/) è più rapido che ragionarci sopra, ed è il solo modo per trovare l'escape che è svanito senza lasciare traccia.

## Domande frequenti

### Come faccio l'escape di un carattere speciale in Markdown?

Metti un backslash davanti, purché sia uno dei trentadue caratteri di punteggiatura ASCII: `\*` per un asterisco letterale, `\#` per un cancelletto a inizio riga, `\|` per una pipe in una cella di tabella. Davanti a una lettera, una cifra o un carattere non ASCII il backslash non è un escape e viene stampato sulla pagina.

### Perché il mio backslash compare nell'output?

Molto probabilmente perché il testo è dentro uno code span, un blocco di codice, un autolink o dell'HTML grezzo, dove gli escape non funzionano e un backslash è contenuto normale. L'altra possibilità è che tu abbia fatto l'escape di qualcosa che non è punteggiatura ASCII — una lettera, una cifra, una lineetta lunga — che la specifica definisce come un backslash letterale.

### Come scrivo un asterisco o un underscore letterale in Markdown?

Scrivi `\*` o `\_`, oppure usa `&#42;` e `&#95;` se vuoi un carattere che nessun parser possa leggere come enfasi. Gli underscore dentro una parola non hanno bisogno di nulla in CommonMark e in GFM, quindi `snake_case_name` è già sicuro; `__init__` non lo è, perché entrambe le coppie sono a un confine di parola.

### Perché la mia tabella si rompe quando una cella contiene una pipe?

Perché la pipe è un confine di cella e il parser delle tabelle divide la riga su di essa prima che accada qualunque altra cosa, compreso il riconoscimento degli code span. Rendila letterale come `\|`, che è il solo escape che funziona anche dentro uno code span, oppure usa `&#124;`.

### Quando devo usare `&amp;` invece di un backslash?

Quando un backslash non può arrivare al carattere o non ha nulla da togliere: dentro HTML grezzo, dentro un valore di attributo, e per caratteri che non sono punteggiatura ASCII, come `©` e uno spazio non divisibile. I riferimenti di carattere sopravvivono anche a pipeline che eliminano o duplicano i backslash, al prezzo di essere illeggibili nella fonte.

### Perché vedo `&amp;lt;` nel mio output convertito?

Perché il testo ha subito due passaggi di escape: `<` è diventato `&lt;`, poi una seconda fase ha reso letterale quella e commerciale in `&amp;`. Conta gli strati di `amp;` per contare le fasi, poi togline una — di solito un motore di template che fa l'escape di un output che un convertitore aveva già reso letterale.

### L'escape funziona allo stesso modo in ogni strumento Markdown?

Non ai margini. L'insieme dei caratteri che si possono rendere letterali è di trentadue in CommonMark e di quindici nel Markdown originale, e le estensioni per tabelle, matematica, attributi ed emoji si appropriano di caratteri che il CommonMark puro ignora. Uno code span si comporta in modo identico ovunque, ed è per questo che è la risposta portabile — e vale la pena sapere che cambia anche l'aspetto del testo.
