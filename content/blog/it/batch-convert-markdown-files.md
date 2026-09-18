---
title: "Come convertire più file Markdown insieme, senza mentire al tuo build"
description: "Convertire una cartella di file Markdown: quanto arriva un glob, dove far finire l'output, xargs e ordine, saltare i file invariati, e codici di uscita onesti"
date: 2026-08-12
tag: Automazione
keywords: convertire più file markdown insieme, conversione markdown in batch, convertire una cartella di markdown, xargs markdown, makefile da markdown a html, build incrementale markdown, convertire markdown in ci, script per convertire markdown
---

Convertire un singolo file Markdown è un problema risolto. Lascialo cadere su una pagina, o digita un comando, e hai HTML. Convertirne centoquaranta, distribuiti su undici directory, quattro delle quali nessuno ha più aperto dalla migrazione, è un lavoro diverso — e non è lo stesso lavoro fatto centoquaranta volte.

Il convertitore quasi mai è la parte che si rompe. Quello che si rompe è il glob che ha saltato in silenzio una sottodirectory, i due file `index.md` diventati un solo `index.html`, l'esecuzione parallela il cui log è composto da quattro file intrecciati, il build che ha segnalato successo perché solo l'ultima conversione è stata controllata, e il job di diciassette minuti che ha riconvertito ogni file per cambiare un paragrafo.

Ognuno di questi fallimenti è silenzioso. Una tabella Markdown che non si è lasciata analizzare produce comunque HTML. Un file che il glob non ha mai raggiunto non produce assolutamente niente, e niente ha esattamente l'aspetto di niente di sbagliato.

### In breve

Lascia che sia la shell a trovare i file e che uno script piccolo converta un file, perché un ciclo che puoi testare su un singolo percorso è un ciclo che puoi debuggare. Usa `find … -print0 | sort -z` invece di un nudo glob `*.md`: un glob non ricorre a meno che tu non attivi `globstar`, salta le directory con il punto, passa al convertitore il pattern letterale quando niente corrisponde, e raggiunge il limite di lunghezza degli argomenti prima che lo faccia un repository grande. Costruisci il percorso di output con l'espansione dei parametri, così l'albero mantiene la sua forma — `basename` fa collassare `docs/api/index.md` e `docs/guide/index.md` sullo stesso file e il build esce comunque con zero. Poi decidi due cose in modo consapevole: se un errore sul file quaranta ferma l'esecuzione oppure viene raccolto e segnalato alla fine, e se in realtà vuoi molte pagine oppure un solo documento, perché unire è un lavoro diverso con una risposta diversa.

## Convertire una cartella è un lavoro diverso

Una singola conversione ha un input, un output e un risultato. Una conversione di cartella ha cinque decisioni che non esistono per un singolo file, e la risposta predefinita a ognuna è sbagliata abbastanza spesso da contare.

**Quali file.** "Tutto il Markdown nel repository" suona non ambiguo finché non lo scrivi. Include `node_modules`? La directory `.github`? Il `CHANGELOG.md` alla radice? Una copia di documentazione di qualcun altro tenuta come vendored? La directory in symlink che punta a un checkout gemello? Ognuna di queste è una risposta vera a una domanda vera, e il tuo glob la darà per te, senza dirlo.

**In che ordine.** L'ordine dei file non conta quando ogni file diventa una pagina propria. Conta del tutto quando i file diventano un solo documento, e conta per la riproducibilità in ogni caso: un build il cui log elenca i file in un ordine diverso a ogni esecuzione è un build che non puoi confrontare.

**Dove finisce l'output.** Accanto all'input, oppure in un albero separato. È la decisione che la gente rimpiange, perché entrambe funzionano alla prima esecuzione e solo una sopravvive a una cancellazione, a una rinomina o a un link relativo.

**Cosa succede quando uno fallisce.** Duecento file, uno malformato. Fermarsi, oppure continuare e segnalare? Entrambe sono defendibili. Quella predefinita — continuare e uscire con zero — non lo è.

**Con quale frequenza.** Una cartella che cambia una volta a settimana non ha bisogno di essere riconvertita ogni notte, e una cartella convertita in una pull request dovrebbe probabilmente convertire solo quello che il branch ha toccato.

Nota che niente di tutto questo riguarda il convertitore. Quale usare è una domanda separata con [un proprio confronto](/blog/best-markdown-to-html-converters), e ogni approccio qui sotto funziona con qualunque di essi, purché il comando prenda un percorso di input e un percorso di output e dica la verità sul suo stato di uscita.

## Confronto rapido: il bigliettino

| Approccio | Ideale per | Gira in parallelo | Può far fallire il build | Salta i file invariati |
| --- | --- | --- | --- | --- |
| Ciclo `for` su un glob | Uno script breve che qualcuno modificherà l'anno prossimo | No | Sì, con `set -e`, al primo file rotto | No |
| `find … -exec … +` | Un albero di profondità sconosciuta e nomi scomodi | No | Non in modo affidabile — lo stato non appartiene al comando | No |
| `find -print0 \| xargs -0 -P` | Centinaia di file, e il tempo reale che passa | Sì | Sì — uscita 123 se un file è fallito | No |
| GNU parallel | Lavoro parallelo il cui output deve restare ordinato | Sì | Sì, con `--halt now,fail=1` | No |
| `make` con una regola a pattern | Una cartella dove la maggior parte dei file non è cambiata | Sì, con `make -j` | Sì, si ferma alla prima ricetta fallita | Sì, per data di modifica |
| Uno script Node o Python | Output che controlli tu, involucro compreso | Sì, con un limite di concorrenza | Solo se imposti tu il codice di uscita | Solo se lo implementi tu |
| Una chiamata API o CLI per file | Un runner senza toolchain e senza installazione | Sì, fino al limite di frequenza | Sì, per chiamata | No |
| Un generatore di siti statici | Navigazione, ricerca e link tra documenti | Internamente | Sì | Di solito, tramite la sua cache |

Sono tutti gratuiti. Gli strumenti da shell sono già sulla macchina; il resto porta le licenze indicate in ogni sezione qui sotto.

## Ogni modo per far girare una conversione su una cartella

### Un ciclo `for` su un glob — ideale per uno script che qualcuno leggerà di nuovo

La cosa più corta che funziona, e la versione da scrivere per prima, perché puoi leggerla ad alta voce.

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"
  output="${output%.md}.html"
  mkdir -p "$(dirname "$output")"
  bin/one.sh "$file" "$output"
done
```

| Pro | Contro |
| --- | --- |
| Leggibile, e ovvio cosa farà | Sequenziale: il tempo reale è la somma di ogni file |
| `set -e` fa del primo fallimento l'ultima cosa che succede | `globstar` è un'opzione di bash, quindi `sh script.sh` cambia il comportamento |
| Nessuna dipendenza oltre alla shell | Salta le directory con il punto a meno che non imposti anche `dotglob` |
| Il quoting è sotto il tuo controllo, in un solo posto | Un glob grande abbastanza da superare il limite degli argomenti fallisce anche qui |

**Prezzo:** gratis; bash ha licenza GPL ed è già installata.

**Dettagli tecnici**

- `shopt -s globstar` fa in modo che `**` attraversi i separatori di directory; senza, `**` si comporta esattamente come `*` e le tue sottodirectory vengono saltate in silenzio
- `shopt -s nullglob` fa in modo che una corrispondenza vuota si espanda a niente, invece di passare al convertitore la stringa letterale `docs/**/*.md` come nome di file
- `${file#docs/}` rimuove la radice della sorgente; `${output%.md}.html` scambia l'estensione senza toccare i nomi di directory
- Esegui lo script con `bash script.sh`, mai con `sh script.sh` — `shopt` non è portabile, e uno `sh` fornito da dash lo rifiuterà

**Per chi è?** Repository con decine di file, e chiunque il cui primo requisito sia che la prossima persona possa modificare lo script senza leggere un manuale.

### `find … -exec … +` — ideale per un albero di profondità sconosciuta

`find` non ha bisogno di nessuna opzione di shell per ricorrere, si comporta allo stesso modo in ogni shell, e non si preoccupa di cosa c'è nei nomi dei file.

```bash
find docs -type f -name '*.md' -exec bin/one.sh {} +
```

| Pro | Contro |
| --- | --- |
| Ricorsione, filtraggio e potatura in un'unica espressione | La questione dello stato di uscita è davvero incerta |
| Passa i nomi come argomenti, quindi spazi e virgolette sopravvivono | `-printf` e altri primari utili sono specifici di GNU |
| `+` raggruppa gli argomenti, quindi non supera il limite di lunghezza | Ordine di directory, non ordine ordinato |
| `-prune` esclude un intero sottoalbero a basso costo | Lo script deve derivare da solo il percorso di output |

**Prezzo:** gratis; GNU findutils ha licenza GPL, e macOS include un `find` in stile BSD.

**Dettagli tecnici**

- `-type f` esclude le directory che per caso finiscono in `.md`, cosa più rara di un symlink verso una, ma non abbastanza rara da ignorarla
- `-exec cmd {} +` passa quanti più percorsi ci stanno per invocazione; `-exec cmd {} \;` esegue un processo per file, che è più lento e più facile da seguire
- Con `-exec … \;` un comando fallito non cambia affatto lo stato di uscita di `find`, quindi un job costruito così non può segnalare un fallimento di conversione. GNU `find` documenta uno stato diverso da zero quando un comando eseguito con `+` fallisce, e le implementazioni differiscono — motivo per spostare la questione dello stato su `xargs`, dove è scritta nero su bianco
- `find docs -name node_modules -prune -o -type f -name '*.md' -print` è l'idioma per escludere un sottoalbero; `-not -path '*/node_modules/*'` ottiene lo stesso risultato ma percorre comunque tutto
- `find` non segue i symlink a meno che non passi `-L`, e passare `-L` su un albero con un link verso il proprio genitore lo farà ciclare finché non colpisce il limite di profondità

**Per chi è?** Qualunque albero più profondo di un livello, e qualunque repository dove non controlli tu personalmente i nomi dei file.

### `find -print0 | xargs -0 -P` — ideale quando il conteggio arriva alle centinaia

Il modo standard per far finire una conversione di cartella in una frazione del tempo, e il punto in cui smetti di poter leggere il log dall'alto in basso.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 8 -n 1 bin/one.sh
```

| Pro | Contro |
| --- | --- |
| Parallelismo reale da un solo flag | L'output di job concorrenti si intreccia, riga per riga |
| Uno stato di uscita aggregato documentato: 123 se un file è fallito | `xargs` esegue direttamente, quindi niente redirezione o glob nel comando |
| Separazione con NUL, quindi ogni nome di file legale sopravvive | Le garanzie di ordine sono sparite a meno che tu non ordini prima e stampi dopo |
| `-n` controlla la dimensione del batch, cosa che conta per i file piccoli | La lista dei fallimenti va raccolta fuori banda |

**Prezzo:** gratis, licenza GPL, parte di findutils.

**Dettagli tecnici**

- `-print0` e `-0` usano NUL come separatore, l'unico byte che un nome di file non può contenere — un a capo in un nome di file è legale e altrimenti dividerebbe un percorso in due
- `sort -z` ordina record separati da NUL; l'ordine proprio di `find` è l'ordine di directory, che non è ordinato e non è stabile tra macchine diverse. Aggiungi `LC_ALL=C` se vuoi lo stesso ordine su un runner e sul tuo laptop
- `xargs` esce con 123 se un'invocazione è uscita tra 1 e 125, 124 se una è uscita con 125, 125 se una è stata uccisa da un segnale, 126 se il comando non poteva essere eseguito, e 127 se non è stato trovato. Questi cinque codici sono tutto il protocollo di segnalazione degli errori, quindi fai uscire il tuo script con un valore diverso da zero e lascia parlare l'aggregato
- `-P 0` esegue quanti più processi può; `-P "$(nproc)"` è la scelta abituale su Linux, e macOS vuole invece `sysctl -n hw.ncpu`
- `xargs` non esegue una shell. `xargs -0 cmd > out.html` reindirizza tutta l'esecuzione in un unico file, non un file per input; se ti serve una redirezione, mettila nello script
- `-n 1` avvia un processo per file. Per mille documenti piccoli, l'avvio del processo domina la conversione stessa, e uno script che cicla su `"$@"` invocato con `-n 20` è misurabilmente migliore — misura il tuo albero invece di fidarti di un rapporto

**Per chi è?** Insiemi di documentazione nell'ordine delle centinaia, e qualunque build dove la conversione è diventata il passaggio lento.

### GNU parallel — ideale quando l'output parallelo deve restare ordinato

`parallel` è `xargs` con l'ergonomia riempita: output ordinato, una politica di fallimento, una prova a secco e una barra di avanzamento.

```bash
find docs -type f -name '*.md' -print0 \
  | parallel -0 -k --halt now,fail=1 bin/one.sh {}
```

| Pro | Contro |
| --- | --- |
| `-k` mette in buffer ogni job e stampa nell'ordine di input | Un'altra installazione, e non è presente di default |
| `--halt now,fail=1` ferma l'esecuzione al primo fallimento | Il suo quoting e la sua sintassi di sostituzione sono un linguaggio a sé |
| `--dry-run` stampa i comandi senza eseguirli | Il buffering per mantenere l'ordine costa memoria e disco |
| `--joblog` registra lo stato e la durata di ogni job | Eccessivo quando niente legge l'output standard |

**Prezzo:** gratis, licenza GPL.

**Dettagli tecnici**

- `-k` (`--keep-order`) è il flag che lo distingue da `xargs`: i job girano comunque in concorrenza, l'output resta comunque leggibile
- `--halt` accetta una politica — fermarsi subito o quando i job in corso finiscono, a un conteggio o a una percentuale di fallimenti
- `--joblog FILE` è la risposta onesta a "quale file è fallito": una tabella con lo stato di uscita di ogni job, che puoi grepare dopo l'esecuzione invece di leggere il log
- `{.}` rimuove l'estensione dalla stringa di sostituzione, `{//}` dà la directory — utile, e un altro dialetto da ricordare
- Stampa una richiesta di citarlo in lavori accademici, che non è una restrizione di licenza ma sorprende la gente la prima volta che compare in un log di build

**Per chi è?** Build dove la conversione stampa qualcosa che una persona legge, e chiunque voglia una tabella di stato per job senza scriverne una.

### `make` con una regola a pattern — ideale quando la maggior parte dei file non è cambiata

L'unico strumento in questa lista pensato esattamente per questo problema: un insieme di output derivato da un insieme di input, ricostruito quando l'input è più recente.

```make
MD  := $(shell find docs -type f -name '*.md')
OUT := $(patsubst docs/%.md,build/%.html,$(MD))

build/%.html: docs/%.md tools/wrapper.html
	@mkdir -p $(@D)
	bin/one.sh $< $@

.PHONY: all clean
all: $(OUT)

clean:
	rm -rf build
```

| Pro | Contro |
| --- | --- |
| Converte solo ciò che è cambiato, senza una tua cache | Le ricette devono essere indentate con un tab, per sempre |
| `make -j8` parallelizza gratis, rispettando le dipendenze | I nomi di file con spazi sono praticamente non supportati |
| Un template cambiato invalida ogni output, correttamente | I tempi di modifica sono sbagliati in un clone appena fatto |
| `make clean` e `make one/file.html` vengono gratis | La sintassi non è come niente altro nel repository |

**Prezzo:** gratis; GNU make ha licenza GPL.

**Dettagli tecnici**

- `tools/wrapper.html` a destra dei due punti è la parte che la gente lascia fuori. Senza, modificare il template non cambia niente, perché ogni output è ancora più recente del proprio Markdown
- `$(@D)` è la directory dell'output, quindi `mkdir -p $(@D)` crea l'albero mentre procede
- `$(shell find …)` gira ogni volta che make viene invocato, quindi un file aggiunto di recente viene raccolto senza toccare il Makefile
- `make -j` senza numero gira con job illimitati, il che su un albero grande avvia centinaia di processi in una volta; dagli un numero
- Aggiungere il convertitore stesso come prerequisito — un lockfile, un binario fissato, un file di timbro di versione — fa ricostruire tutto a un aggiornamento, che è quello che vuoi e quello che nessuno fa

**Per chi è?** Repository dove l'albero della documentazione è grande e per lo più statico, e dove una conversione completa richiede tanto tempo da farsi notare da qualcuno.

### Uno script Node o Python — ideale quando vuoi anche l'involucro

A un certo punto la shell smette di essere il posto giusto: vuoi che il `<title>` del documento di output venga dal frontmatter del file, o un indice, o un link riscritto da `.md` a `.html`. Quello è un programma, non una pipeline.

```js
// convert-all.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import fg from 'fast-glob';
import pLimit from 'p-limit';

const files = await fg('**/*.md', { cwd: 'docs', dot: false, absolute: true });
const limit = pLimit(8);
const failures = [];

await Promise.all(
  files.map((file) =>
    limit(async () => {
      try {
        const output = resolve('build', relative(resolve('docs'), file)).replace(/\.md$/, '.html');
        await mkdir(dirname(output), { recursive: true });
        await writeFile(output, render(await readFile(file, 'utf8')));
      } catch (error) {
        failures.push(`${file}: ${error.message}`);
      }
    })
  )
);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
```

| Pro | Contro |
| --- | --- |
| L'output è un documento che hai progettato tu, non un frammento | È tuo, bug compresi |
| Frontmatter, titoli e riscrittura dei link sono tutti raggiungibili | Un albero di dipendenze da fissare e verificare |
| I fallimenti si raccolgono in una lista invece che in una riga di log | La concorrenza la devi limitare tu |
| Gira allo stesso modo su ogni piattaforma, cosa che la shell non fa | Più lento a partire di un binario C o Rust |

**Prezzo:** gratis; `fast-glob` e `p-limit` hanno licenza MIT.

**Dettagli tecnici**

- `pLimit` non è opzionale. `Promise.all` su tremila file apre tremila descrittori di file e il processo muore con `EMFILE`, che si legge come un filesystem corrotto e non lo è
- `process.exitCode = 1` invece di `process.exit(1)`, così le scritture in sospeso finiscono prima che il processo se ne vada
- `dot: false` è il predefinito nella maggior parte delle librerie di glob, il che significa che `.github/CONTRIBUTING.md` è invisibile finché non dici il contrario — la stessa trappola che tende la shell, in un altro posto
- Raccogliere i fallimenti e segnalarli alla fine è una scelta: converte tutto e fa comunque fallire il job. L'alternativa, lanciare un'eccezione al primo errore, lascia l'albero di output scritto a metà

**Per chi è?** Qualunque repository dove l'HTML deve sembrare finito, e qualunque conversione che deve sapere qualcosa sul documento invece che solo sui suoi byte.

### Una chiamata API o CLI per file — ideale quando non c'è niente installato

Se il runner non ha un convertitore e tu non gliene darai uno, il ciclo ha la stessa forma e il corpo è una chiamata di rete. La CLI senza dipendenze di TransformPipe è un esempio; un post `curl` verso qualunque API di conversione è la stessa idea con più flag.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 4 -n 1 -I {} tp push {} --share --json
```

| Pro | Contro |
| --- | --- |
| Nessun convertitore da installare, fissare o cachare | Serve la rete, quindi non può essere il tuo build offline |
| Ogni file torna come un link che qualcuno può aprire | Serve un segreto nell'ambiente |
| Il comportamento della conversione non può divergere con un'installazione locale | Limiti di frequenza e dimensione valgono per chiave |
| La stessa conversione in CI e su un laptop | Un documento per file si somma contro il limite dell'account |

**Prezzo:** gratis; convertire e scaricare non richiedono nessun account, e un account aggiunge storico, condivisione e l'API entro i limiti qui sotto (verificato su transformpipe.com, l'8 settembre 2026).

**Dettagli tecnici**

- I limiti pubblicati sono quelli su cui pianificare: 10 MB per un file da convertire, 4 MB per un documento conservato in un account, 100 MB e 500 documenti per account, e 60 richieste al minuto contate per chiave (verificato su transformpipe.com/docs, l'8 settembre 2026)
- Quel limite di frequenza è il motivo di `-P 4` e non `-P 32`. Otto worker paralleli su una connessione rapida esauriscono sessanta richieste ben entro un minuto e cominciano a raccogliere 429, e un 429 è un fallimento che il tuo script deve trattare come tale
- `--retry 3 --retry-connrefused` su `curl`, oppure una pausa tra i batch, copre il fallimento transitorio che altrimenti romperebbe un build al mese
- Se posti con `curl` invece che con una CLI, `-f` è portante: senza, `curl` esce con zero su un 401 o un 429 e scrive il corpo dell'errore nel tuo file di output
- Cento file significano cento documenti e cento link. Di solito non è quello che qualcuno voleva, il che è l'argomento di una sezione successiva

**Per chi è?** Runner isolati, e pipeline il cui output è un insieme di link piuttosto che un insieme di file. Per una pull request in particolare, [un'azione fa la stessa cosa senza installazione sul runner](/blog/publish-markdown-from-github-actions).

### Un generatore di siti statici — la risposta quando "molti file" significa "un sito"

Hugo, Eleventy, MkDocs, Docusaurus e Jekyll convertono tutti directory di Markdown in HTML, e nessuno di loro è un convertitore batch. Sono sistemi di build, e la differenza si vede in quello che ti restituiscono.

| Pro | Contro |
| --- | --- |
| Navigazione, ricerca, link tra documenti e una pagina indice | Un file di configurazione, un tema e un passaggio di build da mantenere |
| Build incrementali e modalità watch proprie | L'output è un sito, non un insieme di documenti che puoi mandare per email |
| Controllo dei link e taxonomy su tutto l'insieme | Overhead enorme per quaranta file che nessuno sfoglia |
| Il deployment è un problema risolto per tutti loro | Il tema decide come appaiono le tue pagine |

**Prezzo:** gratis, tutti open source.

**Per chi è?** Chiunque pubblichi documenti che si collegano tra loro e devono essere trovati. Se chi legge arriva con un URL che gli hai dato e se ne va dopo una pagina, non ti serve un generatore.

## Le sei cose che si rompono su una cartella e non su un file

Ogni fallimento qui sotto è stato diagnosticato come un bug del convertitore da qualcuno. Nessuno di essi lo è.

### Quanto in profondità arriva un glob, e cosa lascia cadere

`docs/*.md` non ricorre. Questo è di gran lunga il bug più comune nelle conversioni batch, ed è invisibile: il job converte i nove file in alto nell'albero, esce con zero, e i quaranta nelle sottodirectory semplicemente non vengono menzionati. Niente ti avvisa, perché niente sa cosa intendevi.

Bash ha bisogno di `shopt -s globstar` prima che `**` attraversi un separatore di directory; senza, `docs/**/*.md` è esattamente `docs/*/*.md` — un livello sotto, non più e non meno. zsh ha `**` recursivo senza opzione, motivo per cui una riga copiata dalla storia zsh di un collega si comporta diversamente nel tuo script bash e nessuno dei due vede perché.

Poi ci sono i file su cui un glob non corrisponderà per principio:

| Cosa viene saltato | Perché | La correzione |
| --- | --- | --- |
| `.github/CONTRIBUTING.md` | I glob non corrispondono a un punto iniziale | `shopt -s dotglob`, oppure nomina il percorso |
| `docs/api/reference.md` | `*` non attraversa `/` | `globstar` e `**`, oppure `find` |
| `README.MD` | Corrispondenza sensibile alle maiuscole su Linux, non su macOS | `find … -iname '*.md'` |
| `notes.markdown` | Un'estensione diversa è un pattern diverso | `-name '*.md' -o -name '*.markdown'` |
| Tutto, quando niente corrisponde | Bash passa il pattern come letterale | `shopt -s nullglob` o `failglob` |
| Assolutamente niente, in `node_modules` | Il glob era troppo generoso | `-prune`, prima che il percorso ci arrivi |

L'ultima riga è il fallimento opposto ed è peggiore di quanto sembri. Un `**/*.md` alla radice del repository raggiunge ogni README incorporato in ogni pacchetto installato, e una conversione batch che comincia a produrre HTML per il changelog di una dipendenza è una che verrà silenziosamente cancellata una settimana dopo.

C'è anche un limite rigido. Ogni percorso a cui un glob si espande diventa un argomento, e la dimensione totale della lista di argomenti è limitata dal kernel — `getconf ARG_MAX` stampa il numero. Un repository grande abbastanza da superarlo fallisce con `Argument list too long`, che è un messaggio d'errore vero e sembra un bug nel tuo script. Sia `find … -exec … +` sia `xargs` raggruppano gli argomenti per restare sotto il limite, e nessuno dei due espande niente nella shell, motivo per cui ogni esempio sopra fa una pipe invece che un glob non appena il conteggio è sconosciuto.

I symlink meritano una frase di riflessione deliberata invece di un comportamento predefinito. Se il `**` di una shell scenda attraverso una directory in symlink varia tra release e differisce tra shell, quindi se il tuo albero contiene link — un `docs/shared` che punta a un checkout gemello è una disposizione comune — usa `find` e decidi esplicitamente, con `-L` o senza. Indovinare significa che lo stesso repository converte insiemi di file diversi su due macchine.

### L'ordine in cui arrivano i file

`find` restituisce le voci nell'ordine di directory. L'ordine di directory è quello che il filesystem restituisce, non è ordinato, e non è lo stesso su due macchine con gli stessi file. Per una conversione dove ogni file diventa una pagina propria, è innocuo. Smette di essere innocuo in tre punti.

I log smettono di essere confrontabili. Quando la lista dei file di un build è in un ordine diverso a ogni esecuzione, non puoi confrontare due esecuzioni per vedere cosa è cambiato, e la prima cosa che vuoi quando un job notturno si rompe è esattamente quel confronto.

La pianificazione parallela diventa non riproducibile. Con otto worker e nessun ordinamento, quali file condividono un worker cambia tra le esecuzioni, e così cambia anche quale colpisce il limite di frequenza.

E la concatenazione diventa sbagliata invece che semplicemente disordinata. Nel momento in cui più file diventano un documento, l'ordine è contenuto. Anche ordinato, `10-api.md` viene prima di `2-setup.md`, perché un ordinamento lessicale non è numerico. Imbottisci i numeri — `02-setup.md`, `10-api.md` — e ogni strumento che leggerà mai quella directory ottiene l'ordine giusto gratis.

```bash
find docs -type f -name '*.md' -print0 | LC_ALL=C sort -z
```

`LC_ALL=C` conta più di quanto sembri. L'ordine di ordinamento dipende dal locale, quindi un nome con un accento o un trattino basso iniziale può ordinarsi diversamente su un runner rispetto al tuo laptop, e tutto il senso di fissare l'ordine era impedire esattamente questo.

### Accanto all'input, o nel proprio albero

Ci sono due risposte e non sono equivalenti.

| | Output accanto all'input | Output in un albero separato |
| --- | --- | --- |
| Link relativi tra documenti | Continuano a funzionare invariati | Funzionano solo se la forma dell'albero è mantenuta |
| Immagini con percorsi relativi | Si risolvono come prima | Serve copiarle o incorporarle |
| Pulizia | Cancellare i file che corrispondono a un pattern, con cautela | `rm -rf build` |
| Un `.md` cancellato | Lascia indefinitamente un `.html` orfano | Svanisce alla prossima build pulita |
| Controllo di versione | Voci di `.gitignore` che combattono i file sorgente | Una directory ignorata |
| Revisionare la modifica | HTML generato in ogni diff | Niente di generato nel diff |
| Deployare | Spedire tutto il repository, oppure filtrarlo | Puntare l'host a una directory |

Accanto all'input vince su link e immagini, e perde su tutto il resto. La riga degli orfani è quella che decide per la maggior parte delle persone: niente in uno schema accanto all'input nota che `docs/old-api.md` è stato cancellato, quindi `docs/old-api.html` resta sul disco, viene commesso, viene deployato, e viene ancora servito a qualcuno un anno dopo. Un albero separato che viene cancellato e ricostruito non può avere quel problema, perché la risposta a "quali output sono obsoleti" è "tutti, ogni volta".

Se usi un albero separato, mantieni la sua forma, e usa l'espansione dei parametri invece di `basename` per farlo. `basename` è lo strumento sbagliato qui e fallisce nel modo peggiore possibile: `docs/api/index.md` e `docs/guide/index.md` diventano entrambi `index.html`, il secondo sovrascrive silenziosamente il primo, il build esce con zero, e quale pagina sopravvive dipende dall'ordine con cui i file sono arrivati — che, secondo la sezione qui sopra, non è fisso.

La riscrittura dei link è la parte senza soluzione da shell. Un link a `../guide/index.md` nel tuo Markdown sopravvive alla conversione solo se l'albero di output rispecchia l'albero di input e il `.md` nel target viene riscritto in `.html`. I convertitori non lo fanno di default; la maggior parte lascia il link esattamente come scritto, puntando a un file che non è più accanto alla pagina. Quello è un programma, non una pipeline — e [cosa si rompe quando un documento si sposta](/blog/images-and-links-that-still-work) vale anche per ogni percorso di immagine nella cartella.

### Parallelismo, e l'ordine a cui rinunci

La conversione è una piccola quantità di lavoro per file e un avvio di processo per file. Questo la rende vicina al carico di lavoro parallelo ideale, e l'accelerazione da `-P` è reale. Quello che scambi è ogni garanzia di ordine che avevi.

L'output standard si intreccia. Non per job — per scrittura. Due convertitori che stampano un avviso di tre righe nello stesso momento producono sei righe in un ordine che nessuno dei due ha scelto, e un log così non si può leggere. Se i job stampano qualcosa, usa `parallel -k`, oppure fai scrivere a ogni job il proprio file di log e concatenali dopo in ordine ordinato.

Lo stato condiviso non funziona come sembra. Ogni invocazione di `xargs` è un processo separato, quindi un contatore incrementato dentro il ciclo viene incrementato in una subshell ed è perso. Aggiungere i fallimenti a un file condiviso funziona ma richiede attenzione all'intreccio; la versione in cui non c'è niente da pensare è un piccolo file per fallimento in una directory, contato alla fine:

```bash
# in bin/one.sh
if ! convert "$1" "$2"; then
  mkdir -p build/.failed
  printf '%s\n' "$1" > "build/.failed/$(printf '%s' "$1" | tr / _)"
  exit 1
fi
```

Più worker non è monotonicamente meglio. Superato il punto in cui le CPU sono occupate, i processi in più aggiungono solo contesa e niente altro; e se il corpo del tuo ciclo è una chiamata di rete, worker in più aggiungono 429. Quattro richieste concorrenti contro un limite di sessanta al minuto sono comode. Trentadue sono un test del limite di frequenza con un build attaccato.

La dimensione del batch è il parametro che la gente dimentica. `-n 1` avvia un processo per file, e per documenti piccoli l'avvio del processo può costare più della conversione stessa. Uno script che cicla su `"$@"` e viene invocato con `-n 20` avvia un ventesimo dei processi. Se questo aiuta dipende dai tuoi file e dal tuo convertitore, quindi misura entrambi — e misura due volte, perché la prima esecuzione legge a freddo e la seconda dalla cache di pagina, una differenza grande abbastanza da rovesciare una conclusione.

### I file che non sono cambiati

Riconvertire centoquaranta file per correggere un errore di battitura è defendibile su un laptop e indefendibile in un job che gira a ogni push. Ci sono tre modi per saltare quelli invariati, e falliscono in modo diverso.

**Tempo di modifica.** È quello che fa `make`, e dentro una copia di lavoro è esattamente giusto: modifichi un file, il suo mtime si muove, la regola scatta. La trappola è che git non registra i tempi di modifica. Un clone appena fatto o un checkout con cache mancata timbra ogni file con l'ora del checkout, quindi su un runner CI ogni file sembra più recente di ogni output, e tutto l'albero viene ricostruito. Le build incrementali basate su mtime funzionano in locale e non fanno assolutamente niente in CI a meno che anche la directory di output venga ripristinata da una cache, e gli output ripristinati portano poi i propri timestamp — che è una seconda cosa da far funzionare bene.

**Hash del contenuto.** Più lento da calcolare e corretto ovunque, incluso un clone appena fatto. Conserva l'hash dell'input accanto all'output e confronta prima di convertire:

```bash
# in bin/one.sh — $1 is the .md, $2 is the .html
stamp="$2.sha256"
now="$(sha256sum "$1" | cut -d' ' -f1)"

if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$now" ] && [ -s "$2" ]; then
  exit 0
fi

convert "$1" "$2" && printf '%s\n' "$now" > "$stamp"
```

`sha256sum` è di GNU coreutils; macOS vuole `shasum -a 256`. Il test `[ -s "$2" ]` c'è perché un hash che corrisponde a un file di output di zero byte è una voce di cache per un'esecuzione fallita, e una cache che si ricorda i fallimenti è peggio di nessuna cache.

**Chiedere a git cosa è cambiato.** Il più economico dei tre quando la risposta è piccola, e l'unico che scala fino a un grande monorepo:

```bash
git diff --name-only --diff-filter=ACMR origin/main...HEAD -- '*.md'
```

`--diff-filter=ACMR` esclude le cancellazioni, quindi un file rimosso non diventa un percorso che il tuo convertitore deve aprire. Ha bisogno della storia — un clone superficiale non ha un commit base con cui confrontarsi — che è lo scambio: `fetch-depth: 0` costa tempo di checkout su un repository con anni di commit.

Qualunque tu scelga, una regola vale per tutti e tre: la chiave della cache deve includere tutto ciò da cui l'output dipende, non solo il Markdown. Cambia il tuo involucro HTML, il tuo foglio di stile, o la versione del convertitore, e ogni output è obsoleto mentre ogni input è invariato. Metti il template nell'hash del timbro, aggiungilo come prerequisito nel Makefile, oppure accetta che la prima persona che modifica il foglio di stile passerà un pomeriggio a chiedersi perché la pagina non è cambiata.

### Codici di uscita, e cosa significa "ha funzionato" per duecento file

Per un file, il successo è inequivocabile. Per duecento, "ha funzionato" ha tre risposte possibili e devi scegliere una prima che lo script sia scritto.

**Fermarsi al primo fallimento.** `set -euo pipefail` e un ciclo semplice. L'albero di output resta convertito a metà, che va bene se è una directory di build che cancelli comunque, e il log finisce al file che si è rotto — la diagnosi più rapida possibile.

**Convertire tutto, fallire alla fine.** Più utile quando una persona sta aspettando, perché un'esecuzione ti dice di tutti e sei i file rotti invece che solo del primo. Serve un accumulatore esplicito, perché `set -e` altrimenti terminerebbe l'esecuzione:

```bash
failed=0
for file in docs/**/*.md; do
  bin/one.sh "$file" "$(output_for "$file")" || failed=$((failed + 1))
done

if [ "$failed" -gt 0 ]; then
  echo "$failed files failed" >&2
  exit 1
fi
```

Nota il `|| failed=$(…)`. Senza, `set -e` scatta al primo file rotto, e l'accumulatore non gira mai. Con esso, il ciclo non può fallire — quindi l'`exit 1` esplicito alla fine è l'unica cosa che rende onesto il job, e cancellare quel blocco per errore produce un build che passa sempre.

**Lasciare che il runner parallelo aggreghi.** `xargs` ti dà 123 quando un job qualsiasi è fallito, `parallel --joblog` ti dà una tabella su quale. Entrambi vanno bene, ed entrambi dipendono dal fatto che il tuo script per file esca davvero con un valore diverso da zero, cosa che è la parte che va storta: un convertitore che scrive un errore sull'errore standard ed esce con zero, un `curl` senza `-f`, oppure uno script che intercetta un'eccezione, la registra e ritorna normalmente.

Tre controlli vale la pena aggiungere indipendentemente dalla forma scelta:

- [ ] Ogni output esiste e non è vuoto — `[ -s "$output" ]`, perché diversi modi di fallire producono un file di zero byte invece di nessuno
- [ ] Il conteggio degli output corrisponde al conteggio degli input, stampato alla fine dell'esecuzione, perché un glob che ha silenziosamente saltato una directory si mostra qui e in nessun altro posto
- [ ] Tutta l'esecuzione è sotto `set -euo pipefail`, e qualunque convertitore dietro una pipe è reindirizzato invece, oppure coperto da `pipefail`

Quel secondo è l'affermazione utile più economica in tutta la pipeline. `find docs -name '*.md' | wc -l` contro `find build -name '*.html' | wc -l` è una riga, e intercetta il fallimento che nessun codice di uscita segnalerà mai: il file che non è mai stato convertito perché niente ha mai guardato verso di esso.

## Farlo in CI senza convertire tutto l'albero

Il costo di installazione di un convertitore è [una domanda che l'articolo sulla riga di comando tratta come si deve](/blog/markdown-to-html-from-the-command-line). La domanda specifica del batch è diversa: quali file, e come uscire con gli output.

Converti tutto l'albero sul branch predefinito, e solo i file cambiati in una pull request. L'esecuzione completa è la tua garanzia che l'albero sia convertibile; l'esecuzione sul branch è il feedback rapido, e ha bisogno di `fetch-depth: 0` perché il diff abbia una base con cui confrontarsi. Aggiungi un filtro `paths` su `**.md` così il job non gira affatto per una pull request che ha toccato solo codice.

Se gli output vale la pena conservarli, caricali come artefatto invece di commetterli. L'HTML generato in una pull request rende ogni revisione due volte più lunga e ogni merge un conflitto, e l'artefatto scade da solo.

Se invece committi l'HTML generato — alcuni repository lo servono direttamente, ed è una disposizione legittima — aggiungi il controllo che lo rende sicuro:

```bash
npm run build:docs
git diff --exit-code -- build/
```

`--exit-code` fa fallire il job su una rigenerazione non committata. Senza, l'HTML committato si allontana dal Markdown un merge frettoloso alla volta, e nessuno se ne accorge finché un lettore non nota che la pagina contraddice la fonte.

Metti in cache con una chiave derivata dagli input — GitHub Actions ha `hashFiles('**/*.md')` esattamente per questo — e ricorda di includere il tuo template e il tuo lockfile nella chiave. Una cache con chiave basata solo sul Markdown ti servirà HTML obsoleto dopo un cambio di foglio di stile, che è il risultato più confuso possibile e il più difficile da attribuire.

Due cose più piccole. Fai sharding con una matrice solo quando la conversione è davvero il passaggio lento: otto job paralleli, ognuno con il proprio checkout e la propria installazione, spesso richiedono in totale più tempo di un unico job con `xargs -P 8`. E mantieni esplicita la shell del runner — GitHub Actions esegue `bash -e {0}` per un blocco `run`, che non è la stessa cosa della tua shell di login, e le impostazioni di `shopt` non passano tra gli step.

## Un documento da molti, oppure molti da molti

A metà della costruzione di un convertitore di cartelle, la maggior parte delle persone scopre di volere qualcos'altro. "Convertire questi quaranta file" si divide in due requisiti che sembrano uguali e non lo sono.

| | Quaranta pagine | Un documento |
| --- | --- | --- |
| Cosa invii a qualcuno | Quaranta link, oppure una directory | Un link, oppure un file |
| Navigazione | Qualunque link i documenti avessero già | Un indice che generi tu |
| Livelli di titolo | Il `#` di ogni file è il titolo della pagina | Ogni titolo va retrocesso di un livello |
| Id di ancora | I duplicati tra file sono innocui | `#installation` in quattro file collide |
| Ordinamento | Cosmetico | Contenuto — l'ordine sbagliato è un documento sbagliato |
| Ricerca | La ricerca del sito di chi legge, se esiste | La ricerca del browser, che spesso basta |
| Dimensione | Ogni pagina è piccola | Un file, e un tetto di dimensione da considerare |
| Contenuto obsoleto | Una pagina per file sorgente, cancellata con esso | Rigenera tutto o è sbagliato |

Se chi legge leggerà l'insieme, vuoi un documento, e la conversione è la metà facile. Concatenare Markdown non è `cat`: un `cat` semplice attacca l'ultima riga di un file alla prima del successivo, i titoli vanno retrocessi così che il `#` del secondo file non diventi un altro titolo di pagina, e le ancore vanno disambiguate. [Trasformare una cartella in un solo documento](/blog/merging-many-markdown-files) tratta l'ordine, i livelli di titolo e le collisioni di ancore, e vale la pena leggerlo prima di scrivere il ciclo piuttosto che dopo.

C'è un tetto pratico sulla risposta unita: un documento grande abbastanza è un documento che nessuno può aprire. I browser gestiscono qualche megabyte di HTML e smettono di essere piacevoli ben prima dei limiti imposti da qualunque convertitore — il convertitore dietro questo sito rifiuta un file oltre i 10 MB da convertire e un documento conservato oltre i 4 MB (verificato su transformpipe.com/docs, l'8 settembre 2026), che in Markdown è un libro molto lungo. Se il tuo output unito è vicino a uno dei due numeri, la risposta onesta non è un file più grande, è un insieme di pagine con navigazione, che è un generatore.

## Dove un ciclo su cartella smette di essere la risposta

Il ciclo è lo strumento giusto per un insieme limitato di documenti la cui unica relazione è vivere nella stessa directory. Quattro cose rompono questo, e ognuna ha un costo che vale la pena nominare prima di passare una settimana su uno script di build.

**Documenti che si collegano tra loro.** Nel momento in cui `docs/api.md` si collega a `docs/guide.md`, un convertitore semplice produce una pagina i cui link puntano a file `.md` che non ci sono. Riscriverli significa analizzare il Markdown, risolvere il target, verificare che esista, e riscrivere l'estensione — e verificare che esista è dove scopri i quattro link già rotti in partenza. Non è un flag su nessun convertitore. È un programma vero, e un generatore di siti lo ha già scritto.

**Un lettore che arriva senza un URL.** Una cartella di pagine non ha indice, non ha ricerca, non ha navigazione. Se qualcuno deve trovare il documento giusto piuttosto che riceverlo direttamente, stai costruendo un sito, e farlo con uno script shell significa reimplementare male un generatore, un requisito alla volta. Il costo di ammetterlo presto è un file di configurazione. Il costo di ammetterlo tardi è uno script di build che solo una persona capisce e che nessuno toccherà dopo che se ne sarà andata.

**File il cui output non dovrebbe esistere.** Bozze, template, parziali, la directory `_includes`, la sezione archiviata che qualcuno ha tenuto "per riferimento". Un glob non ha opinioni su nessuno di questi, quindi diventano tutti pagine, e alcune di quelle pagine saranno trovate da un motore di ricerca prima che tu le trovi. Escluderli significa una lista di eccezioni, nello script, mantenuta a mano, che è esattamente il file di configurazione che stavi evitando.

**Un albero che cambia forma.** Il ciclo codifica la forma dell'albero nelle sue espressioni di percorso. Riorganizza le directory e ogni URL di output cambia, ogni link che qualcuno ha salvato si rompe, e non c'è niente da cui reindirizzare perché niente ha registrato quali fossero i vecchi percorsi. Un convertitore non può risolverlo e un generatore aiuta solo un po'; la vera risposta è decidere i percorsi di output di proposito e mantenerli stabili anche quando la sorgente si sposta.

Niente di tutto ciò argomenta contro il ciclo per il caso a cui si adatta: un insieme di documenti, convertiti per persone a cui verranno dati i link. Argomenta contro il farlo crescere per caso in un sistema di pubblicazione, che è il modo abituale in cui uno script di quindici righe diventa quattrocento righe che nessuno può cancellare.

## Come scegliere

1. **Conta i file, poi contali di nuovo in un anno.** Sotto venti, un ciclo `for` con `set -euo pipefail` è tutta la risposta e qualunque cosa in più è un hobby. Oltre qualche centinaio, ti serve `find`, la separazione NUL e `-P`, perché sia il limite degli argomenti sia il tempo reale diventano problemi veri e non teorici.
2. **Decidi accanto-o-separato prima di scrivere una riga.** Un albero separato ti costa i link relativi e i percorsi delle immagini e ti dà un build pulito, un output cancellabile e un diff senza file generati dentro. Sceglierlo dopo significa spostare ogni output e riparare ogni link in una volta, sotto pressione di tempo.
3. **Scrivi prima la conversione a singolo file come script proprio.** Se `bin/one.sh input.md output.html` è corretto ed esce con un valore diverso da zero quando fallisce, ogni approccio in questa pagina è un cambiamento di una riga e puoi testare la parte difficile senza una cartella. Se la logica di conversione vive dentro il ciclo, non puoi testarla per niente.
4. **Scegli esplicitamente la tua politica di fallimento, e fai in modo che il job la dimostri.** Fermati al primo file rotto, oppure converti tutto ed esci con un valore diverso da zero alla fine — entrambe vanno bene, e il predefinito di "continua e segnala successo" è quello che mette in produzione un albero di documentazione costruito a metà. Poi aggiungi l'affermazione sul conteggio degli output, perché nessun codice di uscita ti dirà mai della directory in cui il glob non è mai entrato.
5. **Aggiungi la conversione incrementale solo quando l'esecuzione completa è davvero troppo lenta, e usa come chiave il contenuto.** Mtime funziona su un laptop e non fa silenziosamente niente in CI, quindi un timbro hash è la versione che sopravvive a un clone appena fatto. Includi il template e la versione del convertitore nella chiave, o un aggiornamento ti lascerà a servire output dalla versione vecchia.
6. **Chiediti se la risposta è un solo documento.** Se chi riceve leggerà tutto l'insieme, quaranta link sono un risultato peggiore di una pagina, e il lavoro si sposta dal ciclo alla fusione. È un problema diverso con modi di fallire diversi, e scoprirlo dopo significa scrivere lo script due volte.

## Conclusione

Una conversione batch è una piccola quantità di conversione avvolta in una grande quantità di contabilità, ed è nella contabilità che vivono i difetti: il glob che ha raggiunto nove file su quarantanove, il percorso di output che ha collassato due pagine in una, l'esecuzione parallela i cui fallimenti sono finiti in una subshell, la cache che si ricordava un foglio di stile che non aveva mai visto. Scrivi la conversione a singolo file come uno script che esce onestamente, guidalo con `find` e la separazione NUL così l'insieme dei file è conoscibile e stabile, tieni l'output in un albero che puoi cancellare, e verifica il conteggio degli output alla fine così una directory mancante è un build fallito invece che una pagina di cui nessuno si accorge sia sparita. Poi, quando l'insieme si rivela essere un solo documento invece di quaranta, avrai tenuto separati i due lavori — e quando è davvero un unico file che deve sembrare finito, [convertirne uno nel browser](/) è gratis, non richiede installazione, e non carica niente mentre non hai fatto l'accesso.

## Domande frequenti

### Come convertire più file Markdown insieme da un terminale?

Lascia che sia la shell a enumerare e che uno script converta un file: `find docs -type f -name '*.md' -print0 | sort -z | xargs -0 -P 8 -n 1 bin/one.sh`. Costruisci il percorso di output dentro lo script con `${file%.md}.html` così l'albero di directory mantiene la sua forma, e fai `mkdir -p` sulla destinazione prima di scrivere. Metti `set -euo pipefail` in cima allo script e lascia che `xargs` restituisca 123 se un file è fallito.

### Perché la mia conversione batch ha saltato i file nelle sottodirectory?

Perché `docs/*.md` non ricorre e `**` attraversa i separatori di directory solo quando l'opzione `globstar` di bash è attiva. Senza `shopt -s globstar` il pattern `docs/**/*.md` corrisponde esattamente a un livello sotto, e ogni file più profondo viene saltato senza nessun errore. Usa `find` invece, oppure imposta l'opzione, e confronta il conteggio di input e output alla fine dell'esecuzione.

### Posso convertire una cartella di file Markdown in parallelo?

Sì — `xargs -0 -P 8`, GNU `parallel`, oppure `make -j8` lo fanno tutti, e l'accelerazione è reale perché la maggior parte del costo è l'avvio del processo piuttosto che l'analisi. Quello che perdi è l'ordine: i job concorrenti intrecciano il loro output riga per riga, e un contatore incrementato nel ciclo vive in una subshell e svanisce. Usa `parallel -k` se l'output deve restare ordinato, e scrivi un piccolo file per fallimento invece di appendere a una variabile.

### Come faccio a saltare i file Markdown che non sono cambiati?

`make` con una regola a pattern lo fa in base al tempo di modifica e non ha bisogno di una tua cache, ma git non conserva gli mtime, quindi in un checkout CI appena fatto tutto sembra nuovo e tutto l'albero viene ricostruito. Un hash del contenuto conservato accanto a ogni output funziona ovunque, incluso un clone appena fatto. Qualunque tu usi, includi nella chiave il template HTML e la versione del convertitore, o un cambio di foglio di stile lascerà ogni pagina obsoleta.

### L'HTML deve andare accanto al Markdown o in una cartella separata?

Un albero separato, in quasi tutti i casi: puoi cancellarlo, resta fuori dai tuoi diff, e un file Markdown cancellato non può lasciare dietro una pagina orfana. L'output accanto all'input è chiaramente migliore solo quando i link relativi e i percorsi delle immagini tra documenti devono continuare a funzionare invariati. Se usi un albero separato, rispecchia la struttura delle directory — `basename` collasserà due file `index.md` in un solo output e uscirà con zero mentre lo fa.

### Perché il mio build passa quando alcune conversioni sono fallite?

Perché niente ha controllato. Un ciclo shell continua dopo un fallimento e esce con lo stato dell'ultimo comando, una pipeline segnala l'ultimo stadio piuttosto che il convertitore, e diversi strumenti trattano un errore come un avviso — `curl` esce con zero su un 429 senza `-f`. Usa `set -euo pipefail`, reindirizza invece di fare una pipe, e aggiungi un `exit 1` esplicito dopo aver contato i fallimenti.

### È meglio convertire quaranta file oppure unirli in uno?

Dipende del tutto da chi legge. Quaranta pagine si adattano a chi arriva con il link a una di esse; un documento si adatta a chi leggerà l'insieme, ed è un link invece di quaranta. Unire non è concatenare, però — i livelli di titolo vanno retrocessi e le ancore duplicate vanno disambiguate — quindi trattalo come un lavoro separato piuttosto che come un flag sul ciclo.
