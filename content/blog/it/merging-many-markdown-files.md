---
title: "Trasformare una cartella di file Markdown in un unico documento"
description: "Unire una cartella di file Markdown in uno solo: ordine, livelli di titolo, link fra i file, percorsi immagine, ancore duplicate e indice, con gli script"
updated: 2026-09-09
date: 2026-07-16
tag: Conversione
keywords: unire file markdown, combinare file markdown, concatenare markdown, più file markdown in un html, libro markdown da più file, indice markdown, ancore dei titoli markdown, unire file markdown in uno solo, pandoc unire file markdown, generatore di indice markdown, mdbook summary.md
---

Un manuale raramente vive in un file solo. È una cartella — un'introduzione, sei capitoli, un'appendice — così due persone possono modificare parti diverse insieme. Poi qualcuno chiede il tutto come una pagina sola. Unire i file è a un `cat` di distanza, e il risultato è sbagliato negli stessi pochi modi ogni volta.

### In breve

`cat *.md > handbook.md` sbaglia l'ordine, dà un `<h1>` per ogni capitolo, trasforma il front matter di ogni file in un titolo estraneo, e lascia ogni link che puntava a un file vicino a puntare sul niente. Correggili in quest'ordine: decidi dove vive l'ordine (un manifesto batte i prefissi numerici), retrocedi ogni titolo di un livello tenendo traccia dei fence di codice, togli il front matter man mano che leggi ogni parte, e riscrivi `03-deploy.md#tls` in `#tls` prima che qualunque cosa venga convertita. Pandoc fa le prime tre cose con `--shift-heading-level-by=1`, `--file-scope` e `--toc`. Oltre qualche decina di parti, smetti di unire e usa uno strumento per libri.

I fallimenti hanno tutti la stessa forma: qualcosa in ogni file era stato scritto in modo relativo a quel file, e dopo l'unione non esiste più "quel file". Un livello di titolo era relativo a un documento che iniziava da `#`. Un link era relativo a una directory. Un percorso immagine era relativo a una cartella due livelli più in basso. Un id di ancora era unico dentro un capitolo e non attraverso dieci.

Niente di tutto questo si annuncia. Un documento unito si renderizza. Semplicemente si renderizza male — l'indice salta al capitolo sbagliato, un'immagine è un'icona rotta, e un link apre una finestra di download per un file che non c'è. Ognuna di queste cose la scopre un lettore, non la build.

Quello che segue è il lavoro intero: un ordine che sopravvive a un inserimento, uno script di unione leggibile ed eseguibile, la riscrittura di link e immagini, le collisioni di ancore, l'indice, cosa già gestisce Pandoc, cosa serve per la stampa, e il punto in cui unire è lo strumento sbagliato e un libro è quello giusto.

## Cosa si rompe, e in che ordine

Procedi in questa sequenza. Prima l'ordine, perché ogni correzione successiva presuppone che tu sappia da dove viene ogni parte; i link per ultimi, perché hanno bisogno degli id che il convertitore emette solo alla fine.

| Cosa si rompe | Cosa vedi | Perché | La correzione |
| --- | --- | --- | --- |
| L'ordine | Il capitolo 10 prima del capitolo 2 | Un glob ordina stringhe, non numeri | Prefissi con zeri iniziali, o un manifesto |
| I livelli di titolo | Dieci elementi `<h1>`, nessuna struttura | Ogni parte era scritta per stare da sola | Retrocedi ogni titolo di un livello |
| I commenti nel codice | `# install the agent` diventa un titolo | Un `sed` alla cieca non vede un fence di codice | Tieni traccia dello stato del fence mentre riscrivi |
| Il front matter | `title: Running jobs` arriva come un `<h2>` | Niente cerca un'intestazione dopo il primo file | Togli il blocco man mano che ogni parte viene letta |
| I separatori | Il titolo di un capitolo diventa un'intestazione | Un `---` sotto una riga di testo è sintassi setext | Separa con `***` |
| I link fra i file | Un link verso un file che non c'è più | `03-deploy.md#tls` nominava un file vicino | Riscrivi in `#tls` |
| I link a un file intero | Un link senza nessun frammento a cui puntare | `[deploying](03-deploy.md)` non ha un'ancora | Mappa ogni nome di file all'id del suo titolo |
| I percorsi immagine | Un'icona di immagine rotta | I percorsi relativi ora si risolvono dal file unito | Ricalcola i percorsi di ogni parte, o incorporali |
| Le collisioni di ancore | Due titoli "Overview", un id solo | Gli id vengono dal testo del titolo | Metti un prefisso per file di origine, o rinomina |
| Gli id delle note | Una nota atterra sulla nota sbagliata | Ogni parte inizia la sua numerazione da `[^1]` | Analizza per file, o metti un prefisso alle etichette |
| L'indice | Voci che non saltano da nessuna parte | La regola di slug indovinava diversamente dal renderer | Genera dall'output, non dall'input |
| Le interruzioni di pagina | I capitoli continuano a metà pagina nel PDF | Markdown non ha sintassi per l'interruzione di pagina | Una regola CSS di frammentazione a ogni giuntura |

Il resto di questo articolo è questa tabella, una riga alla volta, con il codice.

## L'ordine, fatto bene

`cat *.md` dà quello che produce il glob, e un glob ordina stringhe, non numeri: `chapter10.md` viene prima di `chapter2.md`, perché `1` ordina prima di `2` e il confronto si ferma lì. Annidare le parti in cartelle non cambia niente. Ci sono tre posti in cui l'ordine può vivere, e non sono ugualmente buoni.

### Prefissi numerici, e il problema degli zeri iniziali

Metti uno zero iniziale al prefisso numerico e l'ordinamento diventa l'ordine di lettura:

```
handbook/
  00-introduction.md
  10-installing.md
  20-configuration.md
  30-running-jobs.md
  90-appendix-glossary.md
```

Passi di dieci lasciano spazio per inserire una parte più avanti. Due cifre danno cento posizioni, che sono più di quante ne serva un manuale e meno di quante ne abbia un insieme di documentazione; tre cifre sembrano burocratiche e non devono mai essere rinumerate.

L'aggiunta degli zeri deve essere uniforme. Mescolare `9-intro.md` con `10-setup.md` riproduce il bug originale su scala più piccola, perché `1` ordina comunque prima di `9`. E rimettere gli zeri più avanti è una ridenominazione di ogni file, il che invalida ogni link in entrata, ogni segnalibro e la cronologia del file che `git log --follow` stava seguendo. Scegli una larghezza il primo giorno e mantienila.

Valgono la pena altri due costi. I prefissi trapelano: se la stessa cartella viene anche pubblicata da un generatore, `10-installing` compare nell'URL, e toglierlo lì è un'altra regola in un altro file di configurazione. E l'ordinamento di stringhe dipende dalla locale — lo stesso glob può ordinare diversamente nomi di file accentati o con maiuscole miste su due macchine, cosa che nessuno nota finché CI non produce un documento che l'autore non riesce a riprodurre. Il `sort -V` di GNU coreutils è un "ordinamento naturale di numeri (di versione) dentro il testo" (verificato su man7.org, 9 settembre 2026), il che aggira del tutto la questione degli zeri iniziali — ma non è su ogni sistema su cui girerà il tuo script, quindi controlla `sort --version` prima che una build ne dipenda.

### Un file manifesto

Se rinominare è escluso perché altri documenti puntano a questi percorsi, o se l'ordine deve differire dall'alfabeto per qualunque motivo, tieni l'ordine in un file e leggi quello:

```bash
grep -vE '^[[:space:]]*(#|$)' order.txt | xargs cat > handbook.md
```

Un percorso per riga; le righe vuote e i commenti con `#` vengono scartati. Questo è l'intero meccanismo, ed è il motivo per cui un manifesto vince: l'ordine è una cosa che si può leggere, rivedere in una pull request e commentare.

Molto spesso il repository ne ha già uno, e aggiungerne un secondo è il modo in cui i due finiscono per divergere:

- **mdBook** usa `SUMMARY.md`. "Il file summary viene usato da mdBook per sapere quali capitoli includere, in che ordine devono apparire, quale sia la loro gerarchia e dove stiano i file sorgente. Senza questo file, non c'è nessun libro." (verificato su rust-lang.github.io, 9 settembre 2026)
- **MkDocs** usa la chiave `nav` in `mkdocs.yml`, che "serve a determinare il formato e il layout della navigazione globale del sito". Ometterla e "`nav` conterrà un elenco annidato, ordinato in modo alfanumerico, di tutti i file Markdown trovati dentro `docs_dir`" — che è di nuovo il problema del glob, con un file di configurazione davanti. (verificato su mkdocs.org, 9 settembre 2026)
- **Quarto** elenca le parti di un libro sotto `book: chapters:` in `_quarto.yml`. (verificato su quarto.org, 9 settembre 2026)

Uno qualunque di questi è già la fonte di verità. Leggilo invece di duplicarlo. `SUMMARY.md` è un elenco annidato di link Markdown, quindi i percorsi escono con un'espressione sola:

```bash
grep -oE '\]\(([^)]+\.md)\)' SUMMARY.md | sed -E 's|^\]\((.*)\)$|\1|'
```

L'ordine dell'output è l'ordine del file, che è l'ordine del libro.

### L'ordine dal front matter

La terza opzione tiene l'ordine dentro ogni parte, come una chiave numerica nella propria intestazione:

```yaml
---
title: Running jobs
order: 30
---
```

L'ordine viaggia con il file: spostalo, rinominalo, e sa comunque dove appartiene. Niente va rinumerato, e non c'è un secondo file da dimenticare. Questo è un vantaggio reale, e si paga tre volte.

Ora serve un parser YAML per ordinare, perché un `grep` per `order:` si rompe la prima volta che qualcuno mette il valore fra virgolette o lo indenta sotto un'altra chiave. L'ordine è invisibile — nessuno può vedere la sequenza di lettura senza eseguire lo strumento. E niente impedisce a due parti di dichiarare `order: 30`, nel qual caso il pareggio viene risolto da qualunque cosa faccia il tuo ordinamento con chiavi uguali, che di solito è l'ordine dei nomi di file e non è mai scritto da nessuna parte. Cosa fa un convertitore con quell'intestazione al momento del rendering è una domanda a parte, e [ci sono quattro risposte possibili](/blog/front-matter-and-what-converters-do-with-it), una sola delle quali è quella che vuoi.

### Quale preferire

| Dove vive l'ordine | Costo | Fallisce quando | Ideale per |
| --- | --- | --- | --- |
| Prefissi con zeri iniziali nel nome del file | Una ridenominazione per inserire o riordinare | Gli zeri sono incoerenti, o la locale è diversa | Una cartella che una persona sola possiede |
| Un file manifesto | Una riga da aggiungere per ogni nuova parte | Qualcuno aggiunge un file e dimentica la riga | Qualunque cosa venga rivista in una pull request |
| Una chiave nel front matter di ogni file | Un parser YAML nello script di unione | Due parti dichiarano lo stesso numero | File che si spostano fra cartelle |

Preferisci il manifesto, e preferisci quello che il repository ha già. È la sola opzione dove l'ordine di lettura è un artefatto rivedibile invece che una proprietà emergente, e l'unica dove "questo capitolo manca dalla build" compare come una riga mancante in un diff invece che come un file a cui nessuno ha pensato. La modalità di fallimento conta più della comodità: una riga di manifesto dimenticata elimina un capitolo in silenzio, ma lo stesso fa un errore di battitura in un prefisso, e solo uno dei due è visibile in una revisione del codice.

Usa anche i prefissi se vuoi — rendono la cartella leggibile in un elenco di file — ma lascia che sia il manifesto a decidere. L'ordine nel front matter vale la pena solo quando le parti si spostano davvero fra directory, cosa più rara di quanto sembri.

## Le tre modifiche, e uno script che le fa

Ogni parte ha bisogno delle stesse tre modifiche in entrata: i suoi titoli retrocessi, il suo front matter tolto, e una rottura visibile messa davanti. Ecco ciascuna, e poi lo script che fa tutte e tre in un solo passaggio.

### Retrocedere i titoli

Ogni parte era scritta per stare da sola, quindi ognuna inizia con un singolo titolo `#`. Concatenane dieci e il documento ha dieci elementi `<h1>` e nessuna struttura.

Ci sono due risposte. Trattare ogni `#` come un titolo di capitolo e non mettere niente sopra, il che funziona finché il file resta sempre una pila di capitoli. Oppure retrocedere ogni titolo di un livello e aggiungere un unico titolo `#`. `sed 's/^#/##/'` corrompe il codice facendolo: un commento `# install the agent` dentro un blocco tra fence viene retrocesso anche lui. Tieni traccia dei fence.

C'è anche un tetto. CommonMark mette la sequenza di apertura di un titolo ATX a "1–6 caratteri `#` non sfuggiti", e "più di sei caratteri `#` non è un titolo" (verificato su spec.commonmark.org, 9 settembre 2026) — un settimo cancelletto dà un paragrafo che inizia con dei cancelletti. Quindi una parte che usa già `######` per qualcosa non ha dove andare, e il passaggio di retrocessione deve lasciarla stare invece di trasformarla silenziosamente in testo. In pratica un documento che usa sei livelli di titolo sta dicendo che avrebbe dovuto essere due documenti.

### Separare le parti

Una rottura visibile dice al lettore che una parte è finita e un'altra è iniziata. Un `---` da solo su una riga diventa un `<hr>`, ma direttamente sotto una riga di testo è sintassi setext, e trasforma quella riga in un `<h2>`. Separa le parti con `***`: sempre lo stesso `<hr>`, mai una sottolineatura di titolo.

Lascia una riga vuota da entrambi i lati. Un separatore incollato all'ultima riga della parte precedente è lo stesso incidente setext per un'altra via.

### Togliere il front matter

Gli stessi trattini causano l'ultimo problema. Le parti scritte per un sito statico si aprono con un blocco di front matter, e dopo il primo file niente ne cerca uno: il `---` di apertura diventa una riga di separazione, le chiavi diventano un paragrafo, e il `---` di chiusura lo sottolinea — di nuovo setext, quindi `title: Running jobs` arriva come un `<h2>` a metà documento. Questo è il risultato del rendering, ed è quello che si ottiene sempre una volta che niente sta più cercando quel blocco.

Toglilo man mano che ogni parte viene letta, e solo in cima al file, così un separatore `---` più in basso sopravvive:

```bash
awk 'NR == 1 && /^---$/ { fm = 1; next }
     fm && /^---$/       { fm = 0; next }
     !fm                 { print }' "$file"
```

Se i titoli in quelle intestazioni valgono la pena di essere conservati — e di solito lo sono, perché sono i nomi dei capitoli — estraili prima di togliere il blocco ed emetti ognuno come un titolo. Questa è la versione da scrivere se le parti non iniziano già con un proprio titolo `#`.

### Lo script, in shell

Questo legge un manifesto, toglie il front matter di ogni parte, retrocede i suoi titoli fuori dai fence di codice, e mette una riga di separazione fra le parti.

```bash
#!/bin/sh
# merge.sh — one document from a manifest of Markdown parts.
set -eu

manifest=${1:-order.txt}
out=${2:-handbook.md}
: > "$out"

grep -vE '^[[:space:]]*(#|$)' "$manifest" | while IFS= read -r part; do
  if [ -s "$out" ]; then printf '\n***\n\n' >> "$out"; fi

  awk '
    # A front matter block, but only at the very top of the file.
    NR == 1 && /^---[[:space:]]*$/ { fm = 1; next }
    fm && /^---[[:space:]]*$/      { fm = 0; next }
    fm                             { next }

    # Track fences, so nothing inside a code block is rewritten.
    /^[[:space:]]*(```|~~~)/ { fence = !fence; print; next }

    # Demote a real heading, unless it is already at the sixth level.
    !fence && /^#+[ \t]/ {
      hashes = $0
      sub(/[^#].*$/, "", hashes)
      if (length(hashes) < 6) { print "#" $0 } else { print }
      next
    }

    { print }
  ' "$part" >> "$out"

  printf '\n' >> "$out"
done
```

Un avvertimento onesto: `fence` è un flag unico che copre entrambi i caratteri di fence, quindi si attiva anche su una riga di tilde dentro un blocco delimitato da backtick. È raro, e vale la pena saperlo prima di dare la colpa allo script per un capitolo i cui titoli sono usciti tutti di un livello troppo superficiale.

### La stessa cosa in Node

La versione shell va bene per una pipeline fissa. Nel momento in cui serve riscrivere link o ricalcolare le immagini, serve sapere da quale file viene ogni riga nel punto in cui la si sta riscrivendo, ed è molto più facile in un programma vero:

```js
// merge.mjs — node merge.mjs order.txt handbook.md
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [manifest = 'order.txt', out = 'handbook.md'] = process.argv.slice(2);
const root = dirname(manifest);

const parts = readFileSync(manifest, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

// No `m` flag: `^` is the start of the string, so only a block at the very
// top of the file is removed.
const stripFrontMatter = (text) =>
  text.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/, '');

const demote = (text) => {
  let fenced = false;

  return text.split(/\r?\n/).map((line) => {
    if (/^\s{0,3}(?:`{3,}|~{3,})/.test(line)) {
      fenced = !fenced;
      return line;
    }

    if (fenced) return line;

    const heading = line.match(/^(#{1,6})[ \t]/);
    return heading && heading[1].length < 6 ? `#${line}` : line;
  }).join('\n');
};

const merged = parts
  .map((part) => demote(stripFrontMatter(readFileSync(join(root, part), 'utf8'))).trim())
  .join('\n\n***\n\n');

writeFileSync(out, `${merged}\n`);
```

L'equivalente Python sono le stesse quaranta righe con `re` e `pathlib`; non c'è niente in esso che richieda una libreria. Qualunque sia il linguaggio, mantieni le tre trasformazioni come funzioni separate che prendono testo e restituiscono testo, perché la riscrittura di link e immagini nella sezione successiva si inserisce fra di esse e vorrai testare ognuna per conto suo.

Quando l'unione gira a ogni commit, [convertire Markdown da un terminale](/blog/markdown-to-html-from-the-command-line) copre il lato CI, e [convertire una cartella file per file](/blog/batch-convert-markdown-files) è l'altra metà dello stesso problema — quella in cui l'output resta come pagine multiple.

## I link fra i file, e quelli che ti sfuggiranno

Questa è la parte che la maggior parte delle guide salta, ed è la parte che i lettori notano per prima, perché un link rotto è un clic che non porta da nessuna parte invece di un paragrafo che sembra leggermente sbagliato.

Dentro la cartella, `[retries](30-running-jobs.md#retries)` è corretto. Dopo l'unione, la destinazione è nello stesso documento e il nome del file deve sparire, o il link punta a un file che non sta più accanto al lettore:

```bash
sed -E 's|\]\([0-9A-Za-z._/-]+\.md#|](#|g' handbook.md > tmp && mv tmp handbook.md
```

Questo gestisce la forma comune. Ce ne sono altre quattro, e ognuna va detta ad alta voce.

**Un link a un file intero.** `[deploying](03-deploy.md)` non ha nessun frammento da conservare, quindi non c'è niente che un'espressione regolare possa riscrivere. Serve l'id del titolo di quel file, il che significa costruire una mappa mentre si leggono le parti — dal nome di file all'id del suo primo titolo — e consultarla in un secondo passaggio. Questo è il motivo per scrivere l'unione in un linguaggio che abbia un dizionario.

**I link in stile riferimento.** `[retries]: 30-running-jobs.md#retries` sta in fondo al file in un blocco di definizione, e il pattern inline sopra non lo tocca mai. Serve una regola propria, ancorata all'inizio di una riga:

```bash
sed -E 's|^(\[[^]]+\]:[[:space:]]*)[0-9A-Za-z._/-]+\.md#|\1#|' handbook.md > tmp && mv tmp handbook.md
```

**I link HTML grezzi.** `<a href="30-running-jobs.md">` passa attraverso il parser intatto, perché Markdown lascia passare l'HTML grezzo di proposito. Nessun riscrittore consapevole di Markdown lo troverà. Cerca con grep `href=` sia nella fonte che nell'output.

**Destinazioni codificate e tra parentesi angolari.** Un percorso con uno spazio arriva come `](<03 deploy.md#tls>)` oppure `](03%20deploy.md#tls)`, e nessuno dei due corrisponde a una classe di caratteri che presumeva niente spazi e niente segni percentuale. I nomi di file con spazi valgono la pena di essere vietati solo per questo motivo.

### Trovare quelli che ti sono sfuggiti

Non fidarti della riscrittura. Controlla il Markdown unito per qualunque cosa punti ancora a un file:

```bash
grep -nE '\]\([^)#][^)]*\.md' handbook.md
grep -n 'href="' handbook.md
```

Poi controlla l'HTML convertito, che è dove conta davvero. Ogni link interno dovrebbe avere una destinazione con quell'id, e i due elenchi sono confrontabili:

```bash
grep -oE 'href="#[^"]+"' handbook.html | sed -E 's/.*"#(.*)"/\1/' | sort -u > wanted
grep -oE 'id="[^"]+"'    handbook.html | sed -E 's/.*"(.*)"/\1/'  | sort -u > present
comm -23 wanted present
```

`comm -23` stampa le righe presenti solo nel primo file: ogni link a frammento senza niente su cui atterrare. Un risultato vuoto è il controllo che passa. Mettilo nella build, perché non costa niente ed è l'unico di questi controlli che non può essere ingannato da un documento che si renderizza.

### I percorsi immagine dopo l'unione

`![Flow](img/flow.png)` in `handbook/chapters/03-deploy.md` si risolve rispetto a `handbook/chapters/`. Sposta quella riga in `handbook.md` alla radice del repository e il browser cerca `img/flow.png` accanto al file unito, non trova niente, e disegna l'icona dell'immagine rotta. Niente nella riga è cambiato; è cambiato ciò rispetto a cui era relativa.

Quindi ogni destinazione immagine relativa deve essere ricalcolata dalla directory propria della parte a quella dell'output. Nello script Node, nel punto in cui si conoscono già entrambe:

```js
import { relative, sep } from 'node:path';

const rebaseImages = (text, from, to) =>
  text.replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (match, head, target) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(target)) return match;
    return head + relative(to, join(from, target)).split(sep).join('/');
  });
```

La guardia lascia stare i percorsi assoluti, i frammenti e qualunque cosa con uno schema; lo `split(sep).join('/')` c'è perché Windows restituisce backslash e un URL non è un percorso di filesystem. Eseguila prima della riscrittura dei link, e solo sulle destinazioni delle immagini, così non entra in conflitto con il passaggio che trasforma i link `.md#` in frammenti.

Sistemare i percorsi rende corretto il Markdown unito. Non rende l'HTML portabile: il file continua a funzionare solo finché quelle immagini stanno nel posto giusto accanto a esso, cosa che non accadrà più dopo che qualcuno lo manda per email. La correzione è incorporare le immagini come data URI, o convertire con qualcosa che produca un file autonomo — [quali fra le tue immagini e i tuoi link continuano a funzionare dopo che il file si sposta](/blog/images-and-links-that-still-work) è l'intera domanda, e vale la pena risolverla prima di inviare qualunque cosa.

## Le collisioni di ancore, e cosa ne fa ogni renderer

Gli id dei titoli vengono dal testo del titolo, quindi un `## Overview` nel capitolo dell'installazione e un `## Overview` nel capitolo dei job vogliono entrambi l'id `overview`. In dieci capitoli scritti da quattro persone, "Overview", "Configuration", "Troubleshooting" ed "Examples" compariranno tutti più di una volta. Ognuno di questi è una collisione.

Cosa succede dopo dipende interamente da cosa converte il file.

| Cosa lo renderizza | Cosa ottiene il secondo "Overview" | Fonte |
| --- | --- | --- |
| github-slugger, la regola che seguono le stesse ancore di GitHub | `overview-1`, poi `overview-2` | `slugger.slug('foo')` restituisce `foo`, poi `foo-1`; licenza ISC (verificato su github.com, 9 settembre 2026) |
| markdown-it-anchor | `overview-1` | Gli id generati automaticamente "hanno comunque un suffisso in caso di collisione"; `uniqueSlugStartIndex` di default è 1; licenza Unlicense (verificato su github.com, 9 settembre 2026) |
| Pandoc con `--file-scope` | Un id con un prefisso dal nome del file | "verranno aggiunti agli identificatori dei prefissi basati sui nomi dei file per disambiguarli, e i link interni verranno adattati di conseguenza" (verificato su pandoc.org, 9 settembre 2026) |
| Un convertitore senza deduplicazione | Lo stesso id, due volte, in un documento | Il browser salta a qualunque venga prima |

Ognuno di questi comportamenti è difendibile e non ce ne sono due che concordano. Un link scritto come `[see](#overview)` è quindi imprevedibile fra strumenti diversi: su uno raggiunge la sezione del primo capitolo, su un altro raggiunge un elemento che esiste solo perché lo strumento ha contato, e su un terzo raggiunge un id duplicato di cui la specifica non ha mai promesso niente. Peggio ancora, il suffisso dipende dall'ordine del documento, quindi inserire un capitolo rinumera ogni collisione successiva e ripunta in silenzio i link che prima funzionavano.

Tre correzioni, la migliore per prima.

**Rendi i titoli distinti.** `## Configuring the agent` e `## Configuring a job` sono documentazione migliore a prescindere dall'unione, e rimuovono il problema invece di gestirlo. Un lettore che scorre un indice con dieci voci "Overview" identiche non è aiutato da nessuna quantità di suffissi.

**Metti un prefisso in base al file di origine al momento dell'unione.** Se rinominare non è un'opzione, riscrivi ogni titolo mentre lo leggi così che il suo id porti la parte da cui viene — `deploy-overview`, `installing-overview`. Dove la sintassi è disponibile, un id esplicito sul titolo è preciso:

```
## Overview {#deploy-overview}
```

Quella parentesi graffa finale è un'estensione, non CommonMark: Pandoc la supporta, e nel mondo JavaScript serve un plugin. Se il tuo convertitore non ce l'ha, metti il prefisso al testo del titolo invece, oppure accetta la deduplicazione dello strumento stesso e genera l'indice dall'output così che i due concordino.

**Leggi gli id che il convertitore ha prodotto.** Non indovinare la regola di slug. Converti una volta, guarda l'HTML, e prendi gli id da lì. TransformPipe mette un prefisso `doc-` su ogni id di titolo, e la sua scheda del sorgente HTML mostra il file esatto — che è un esempio specifico del punto generale, cioè che la sola regola di slug affidabile è quella che si può leggere nell'output.

La stessa collisione colpisce le note a piè di pagina, cosa che si nota molto più tardi. Ogni parte che ha note le inizia da `[^1]`, quindi un documento unito ha quattro definizioni `[^1]` e quattro riferimenti che risolvono tutti verso qualunque il parser abbia tenuto. O si analizza ogni file separatamente, che è esattamente a cosa serve `--file-scope` di Pandoc, o si mette un prefisso alle etichette man mano che si legge ogni parte.

## L'indice

Con le parti retrocesse, ogni `##` è un capitolo — un indice che aspetta di essere generato. Ci sono quattro modi per ottenerne uno, e la domanda decisiva è la stessa in ogni caso: la destinazione della voce corrisponde all'id che il renderer emetterà davvero?

| Strada | Cosa costa | Quando è giusta |
| --- | --- | --- |
| A mano | Invecchia in silenzio, e nessuno se ne accorge per mesi | Cinque capitoli che non cambieranno |
| Generato al momento dell'unione | Possiedi tu la regola di slug, e deve corrispondere a quella del convertitore | L'unione è già uno script |
| doctoc | Un'installazione Node; scrive nel file fra due marcatori | Un README in un repository git, aggiornato a ogni commit |
| markdown-toc | Un'installazione Node; un marcatore `<!-- toc -->` | Lo stesso lavoro, se preferisci quello stile di marcatore |
| Dal convertitore | Niente, e gli id sono garantiti corrispondere | Si sta comunque convertendo in HTML |

**Generato al momento dell'unione.** Percorri il file unito una volta, fuori dai fence, e stampa una voce per titolo:

```bash
awk '/^```/ { fence = !fence; next }
     !fence && /^## / {
       title = substr($0, 4)
       slug  = tolower(title)
       gsub(/[^a-z0-9 -]/, "", slug)
       gsub(/ /, "-", slug)
       printf "- [%s](#%s)\n", title, slug
     }' handbook.md
```

Quella regola di slug — minuscolo, punteggiatura tolta, spazi in trattini — vale per i titoli in inglese e diverge su accenti e duplicati. Presume anche che l'id sia lo slug nudo: un convertitore che mette un prefisso agli id vuole quel prefisso nel link. Le voci generate e i titoli vengono dallo stesso testo, quindi un capitolo rinominato rinomina la sua voce.

**doctoc** "genera indici per file markdown dentro un repository git locale. I link sono compatibili con le ancore generate da GitHub o da altri siti". Installalo con `npm install -g doctoc`, segna il punto con `<!-- START doctoc -->` e `<!-- END doctoc -->`, ed esegui `doctoc handbook.md`; `--github`, `--maxlevel` e `--title` controllano lo stile dell'ancora, la profondità e il titolo che scrive sopra l'elenco. Licenza MIT (verificato su github.com, 9 settembre 2026).

**markdown-toc** fa lo stesso lavoro con un marcatore più corto: metti `<!-- toc -->` dove vuoi l'elenco ed esegui `markdown-toc -i handbook.md` per scriverlo sul posto, fra `<!-- toc -->` e `<!-- tocstop -->`. Installa con `npm install -g markdown-toc`. Licenza MIT (verificato su github.com, 9 settembre 2026).

Entrambi puntano alle ancore di GitHub, il che è esattamente giusto quando il file unito verrà letto su GitHub ed esattamente sbagliato quando passa per un convertitore con una regola di id diversa. Questa è la trappola: un indice generato secondo una regola di slug e renderizzato con un'altra produce una pagina dove ogni voce è un link e nessuna di esse muove la pagina.

**Dal convertitore** evita la discordanza per costruzione, perché lo strumento che numera i titoli è lo strumento che scrive l'elenco. Se l'HTML è comunque la destinazione, questa è la risposta corretta più economica.

Qualunque sia la strada, percorri il file unito una volta prima di spedirlo:

- [ ] Nessun `#` dentro un blocco di codice è stato retrocesso
- [ ] Nessun `.md)` è rimasto in nessun link
- [ ] Ogni voce dell'indice salta da qualche parte
- [ ] Ogni immagine si carica con la cartella spostata
- [ ] Il controllo `comm -23` sopra non stampa niente

## Le risposte di Pandoc, e il caso della stampa

Pandoc gestisce diversi di questi problemi con dei flag, il che è un buon motivo per ricorrervi prima di scrivere uno script — e un buon motivo per sapere esattamente quali problemi lascia a te.

Dati più input, "pandoc li concatenerà tutti (con righe vuote fra loro) prima di analizzarli", quindi l'ordine resta da fornire: elenca i file nell'ordine voluto, oppure espandi un manifesto sulla riga di comando. I flag utili:

| Flag | Cosa dice il manuale |
| --- | --- |
| `--shift-heading-level-by` | "Sposta i livelli di titolo di un intero positivo o negativo. Per esempio, con `--shift-heading-level-by=-1`, i titoli di livello 2 diventano titoli di livello 1, e i titoli di livello 3 diventano titoli di livello 2." |
| `--file-scope` | "Analizza ogni file individualmente prima di combinarlo per documenti multi-file. Questo permette a note a piè di pagina in file diversi con gli stessi identificatori di funzionare come previsto." |
| `--toc` | "Include un indice generato automaticamente … nel documento di output." |
| `--toc-depth` | "Specifica il numero di livelli di sezione da includere nell'indice. Il default è 3." |
| `--number-sections` | "Numera i titoli di sezione in output LaTeX, ConTeXt, HTML, Docx, ms o EPUB. Di default, le sezioni non sono numerate." |

(Tutto verificato su pandoc.org, 9 settembre 2026.)

`--shift-heading-level-by=1` è il passaggio di retrocessione, fatto bene: gira sul documento analizzato, quindi un `#` dentro un blocco tra fence è un commento in un campione di codice e viene lasciato stare. Questo è l'intero motivo per cui l'awk sopra aveva bisogno di un flag per il fence e questo no. `--file-scope` è la correzione per ancore e note, e va oltre la deduplicazione — mette un prefisso agli id dai nomi dei file e adatta i link interni di conseguenza, il che è il prefisso al momento dell'unione descritto prima, gratis.

Quindi un'unione dignitosa è un comando solo:

```bash
pandoc --standalone --toc --toc-depth=2 --file-scope \
  --shift-heading-level-by=1 \
  --metadata title="Handbook" \
  $(grep -vE '^[[:space:]]*(#|$)' order.txt) \
  -o handbook.html
```

Cosa non fa: ricalcolare i percorsi delle immagini, o riscrivere un link `03-deploy.md#tls` fuori dall'adattamento di `--file-scope`. E il front matter è una questione di reader: il dialetto Markdown proprio di Pandoc legge un blocco di metadati YAML come metadati invece che come testo, il che fa sparire l'incidente setext, ma l'insieme di estensioni dipende dal reader selezionato — controllalo prima di farci affidamento. Se Pandoc è più strumento di quanto serva per questo lavoro, [le opzioni più piccole sono qui](/blog/pandoc-alternatives-for-markdown-to-html).

### Se la destinazione è un PDF

Un manuale unito è molto spesso diretto verso la stampa, e la stampa ha un requisito che lo schermo non ha: i capitoli iniziano su una nuova pagina. Markdown non ha sintassi per l'interruzione di pagina, quindi l'interruzione deve venire dall'HTML o dal motore PDF.

Attraverso un browser o un qualunque renderer da HTML a PDF, è una regola CSS di frammentazione. Metti un marcatore a ogni giuntura invece del `***`:

```html
<div class="chapter-break"></div>
```

e imposta le regole nel foglio di stile:

```css
@page { size: A4; margin: 20mm; }

.chapter-break { break-before: page; }
h1, h2, h3 { break-after: avoid-page; }
p { orphans: 3; widows: 3; }
```

`break-before: page` fa iniziare il capitolo successivo su un foglio nuovo. `break-after: avoid-page` sui titoli impedisce che il titolo di un capitolo resti isolato in fondo a una pagina con il suo primo paragrafo nella pagina successiva, che è il risultato brutto più comune della stampa di un documento unito. `orphans` e `widows` fanno lo stesso per i paragrafi. I motori più vecchi vogliono anche la vecchia sintassi `page-break-before: always`; impostarle entrambe è innocuo.

Un `\newpage` grezzo raggiunge solo un PDF basato su LaTeX, quindi è la risposta giusta attraverso il writer LaTeX di Pandoc e non fa niente attraverso un browser. [Ogni strada da Markdown a PDF, e quanto costa ciascuna](/blog/markdown-to-pdf) è la versione più lunga di questa decisione.

## Quando è un libro, non un documento

Unire è giusto quando l'output è una pagina sola. Smette di esserlo quando servono capitoli numerati, riferimenti incrociati che sopravvivono a un riordino, o una casella di ricerca — e la versione onesta di questa frase è che un manuale unito ha un solo meccanismo di navigazione, l'indice in cima, e un lettore undici schermate più in basso non ha idea di dove si trovi.

Oltre una certa dimensione il file unito è un libro che finge di essere un documento. I sintomi sono specifici: lo script di unione ha fatto crescere un passaggio di riscrittura link, uno di prefisso agli id e un generatore di indice, il che equivale a dire che è diventato un generatore di siti statici senza test; riordinare due capitoli significa rieseguire tutto e ricontrollare ogni ancora; e l'output è abbastanza grande che aprirlo richiede un momento visibile.

Uno strumento per libri risolve ordine, ancore e navigazione al posto tuo, e ti fa pagare un passaggio di build per questo.

| Strumento | L'ordine viene da | Output | Licenza |
| --- | --- | --- | --- |
| mdBook | `SUMMARY.md` | Un sito statico, scritto in Rust | MPL 2.0 |
| MkDocs | `nav` in `mkdocs.yml` | Un sito statico, scritto in Python | BSD 2-Clause |
| Quarto | `chapters:` in `_quarto.yml` | HTML, PDF, Typst, Word, EPUB, AsciiDoc | MIT |
| Honkit | Un albero sorgente in stile GitBook | Un sito o un ebook: PDF, EPUB, MOBI | Apache 2.0 |
| Pandoc | L'ordine in cui elenchi i file | Qualunque cosa sia nel suo elenco di formati: HTML, PDF, EPUB, Word e altro | GPL |

(Licenze e output verificati su rust-lang.github.io, mkdocs.org, quarto.org, pandoc.org e github.com, 9 settembre 2026. Honkit è un fork di GitBook Legacy.)

Vale la pena dire chiaramente cosa costa, perché "usa e basta mdBook" è un consiglio che ignora metà del problema. Si acquisisce una toolchain: un runtime da installare su ogni macchina che costruisce i documenti, un file di configurazione da mantenere valido, un tema da tenere aggiornato, e un job CI che ora può fallire per motivi che non c'entrano niente con quello che qualcuno ha scritto. Si acquisisce una destinazione di deploy, perché l'output è una cartella di file che va ospitata da qualche parte. E si perde l'artefatto che si voleva all'inizio — uno strumento per libri dà un sito, non un file da allegare a un'email, e se qualcuno chiede l'intero manuale come una pagina sola si torna a unire, oppure a qualunque vista di stampa lo strumento offra per caso.

La linea di confine non è il numero di file. È se il documento viene letto una volta o abitato. Un manuale conservato per anni è meglio come sito; uno che esce una volta sola — a un cliente, a un ente regolatore, a un nuovo assunto — è meglio unito. Dove vive la fonte è una domanda a parte da entrambe, e la risposta a quella è quasi sempre il repository.

## Come scegliere quale unione costruire

1. **Decidi dove vive l'ordine prima di scrivere una riga dello script.** Nei nomi di file, ogni inserimento è una ridenominazione; in un manifesto, ogni nuova parte è una riga che qualcuno deve ricordarsi di aggiungere — e la conseguenza del dimenticarla è un capitolo che silenziosamente non viene spedito, cosa che nessun test noterà a meno di scriverne uno che confronti il manifesto con la directory.
2. **Retrocedi dopo l'analisi, non prima.** Un'espressione regolare sul testo grezzo non può distinguere un titolo da un commento in un campione di shell, quindi o tieni traccia tu stesso dello stato del fence o affida il lavoro a un parser; il costo di sbagliarlo è un blocco di codice che diventa una voce nella struttura, e sarà nell'indice in cima alla pagina.
3. **Riscrivi link e percorsi immagine nello stesso passaggio che legge ogni file.** Quello è l'unico momento in cui sai da quale parte viene una riga, che è esattamente ciò che serve per trasformare `03-deploy.md#tls` in `#tls` e `img/flow.png` in `chapters/img/flow.png` — farlo dopo significa indovinare.
4. **Rendi gli id dei titoli unici alla fonte invece di affidarti al renderer.** Ogni strumento deduplica in modo diverso e alcuni non lo fanno affatto, quindi un documento che dipende dal contatore è un documento i cui link cambiano significato quando qualcuno inserisce un capitolo.
5. **Genera l'indice dall'output, non dall'input.** Un elenco costruito con la tua regola di slug e renderizzato da un convertitore con una diversa è una pagina di link che falliscono tutti in silenzio, e il fallimento silenzioso è quello costoso.
6. **Apri il file unito da qualche altra parte prima di inviarlo.** Una macchina diversa, un browser diverso, la rete spenta, la cartella delle immagini lasciata indietro — quel singolo test cattura percorsi relativi rotti, ancore mancanti e stili collegati a un CDN tutti insieme, e ci vuole un minuto.
7. **Scrivi la dimensione alla quale smetterai di unire.** Venti parti, oppure il giorno in cui serve un secondo formato di output, oppure la prima richiesta di ricerca: scegli il trigger in anticipo, perché l'alternativa è scoprirlo come un problema di manutenzione diciotto mesi dopo.

Comincia dai nomi di file, prima che ce ne siano venti: l'ordine è l'unico di questi problemi che peggiora col tempo, e l'unico la cui correzione — rinominare — diventa più costosa ogni mese che passa. Per l'HTML in sé, trascina le parti insieme su [TransformPipe](/): più file alla volta vengono concatenati in un unico documento, in ordine, separati da una riga, con gli id dei titoli visibili nella scheda del sorgente così che l'indice possa essere controllato invece che indovinato. Da un terminale, `tp push handbook/*.md --merge --share link` stampa un link da condividere. In entrambi i casi, l'unione è la parte facile; i tre passaggi su link, immagini e ancore sono il lavoro, e sono ciò che separa un documento che si renderizza da un documento che si legge.

## Domande frequenti

### Come combino più file Markdown in uno solo?

Concatenali in un ordine deliberato, poi fai tre modifiche man mano: togli il front matter di ogni parte, retrocedi i suoi titoli di un livello saltando i fence di codice, e metti una riga `***` fra le parti. `cat *.md > out.md` fa la concatenazione e nessuna delle modifiche, motivo per cui il suo output sembra giusto e si comporta male.

### Perché il capitolo 10 viene prima del capitolo 2 nel mio file unito?

Perché un glob di shell ordina i nomi di file come stringhe, e in un confronto di stringhe `1` viene prima di `2` e il confronto si ferma lì. Metti uno zero iniziale ai prefissi numerici così che ogni nome di file abbia la stessa larghezza, oppure tieni l'ordine di lettura in un file manifesto e leggi quello invece di usare il glob.

### Come impedisco che ogni capitolo diventi un H1?

Retrocedi ogni titolo di un livello e dai al documento unito un unico titolo proprio. Non farlo con `sed 's/^#/##/'`, che riscriverà anche i commenti `#` dentro i blocchi di codice tra fence; tieni traccia dei fence, oppure usa `--shift-heading-level-by=1` di Pandoc, che sposta il documento analizzato e quindi non può toccare un campione di codice.

### Cosa succede ai link fra i file dopo che li unisco?

Puntano a file che non sono più accanto al lettore. Un link con un frammento — `03-deploy.md#tls` — diventa `#tls`; un link a un file intero ha bisogno dell'id del titolo di quel file, il che significa costruire una mappa nome-file-a-id mentre si leggono le parti. Dopo, cerca con grep `.md)` nel file unito e nell'HTML convertito i link a frammento senza un id corrispondente.

### Due capitoli hanno lo stesso titolo — quale ancora vince?

Dipende dal renderer, ed è questo il problema. La regola di slug di GitHub aggiunge `-1` e `-2` ai ripetuti, markdown-it-anchor mette anch'esso un suffisso in caso di collisione, Pandoc sotto `--file-scope` mette un prefisso agli id dal nome del file, e un convertitore senza deduplicazione emette lo stesso id due volte e lascia che il browser salti al primo. Rinomina i titoli, oppure mettici un prefisso per file di origine al momento dell'unione.

### Serve un generatore di siti statici o uno strumento per libri?

Solo se l'output è un insieme di pagine invece di una sola. Uno strumento per libri dà ordine, ancore uniche, navigazione e ricerca in cambio di una toolchain, un file di configurazione e un passaggio di build, e quello che produce è una cartella da ospitare — non un file da allegare a un'email. Se qualcuno ha chiesto un documento solo, unire resta la risposta giusta.

### Posso unire file Markdown senza installare niente?

Sì. Un convertitore lato browser che accetta più file insieme li concatenerà in un unico documento in ordine e restituirà l'HTML, senza niente da installare e niente caricato. Lo scambio è che la riscrittura di link, immagini e ancore descritta sopra non viene fatta per te, quindi fai prima quei passaggi sul Markdown e converti per ultimo.
