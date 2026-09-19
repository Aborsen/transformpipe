---
title: Scegliere un convertitore Markdown da riga di comando, e farlo girare senza sorprese
description: Convertire Markdown in HTML dal terminale: Pandoc, cmark-gfm, comrak, Node, Python, una chiamata API, e il quoting e il globbing che falliscono in CI
date: 2026-08-26
tag: Workflow
keywords: convertitore markdown cli, markdown in html da riga di comando, convertitore markdown terminale, script markdown in html, markdown in html con node, convertire markdown in batch, convertire cartella di file markdown, pandoc standalone html
---

Un convertitore nel browser è lo strumento giusto per un file. Smette di essere lo strumento giusto nel momento in cui la conversione deve avvenire a ogni commit, oppure quando una cartella contiene quaranta file e nessuno vuole quaranta schede aperte. A quel punto vuoi un comando — qualcosa che un Makefile, uno script di shell o un job CI possano chiamare senza che nessuno clicchi niente.

Il problema è che un comando che funziona e un comando che continua a funzionare sono due cose diverse. La riga che digiti una volta, guardi avere successo e incolli in uno script è la stessa riga che girerà senza controllo mille volte, contro nomi di file che non hai scelto tu, su un runner con una shell diversa, una locale diversa e senza Pandoc installato. Quasi ogni conversione da terminale che fallisce in produzione fallisce per una ragione che non ha niente a che fare col Markdown.

Quindi questo pezzo è in due metà. Prima i convertitori: cosa sono, cosa emettono davvero, e i flag esatti che fanno la differenza tra un frammento e un documento. Poi le parti che le persone sbagliano — il quoting, il globbing, dove finisce l'output, cosa significa davvero il tuo exit code, e quanto costa installare un convertitore a ogni singola esecuzione di CI.

### In breve

Se un convertitore è già sulla macchina, basta una riga: `pandoc -f gfm -t html -s --embed-resources README.md -o README.html` produce un documento completo a file singolo invece di un frammento, e `--sandbox` lo rende più sicuro da puntare contro un file che non hai scritto tu. Se non è installato niente e vuoi che resti così, uno script Node di cinque righe sopra `marked`, una chiamata `python -m markdown`, o un post `curl` verso una API HTTP battono tutti l'installare un convertitore di documenti che userai una volta sola. I fallimenti quasi mai stanno nel parser: sono nomi di file senza virgolette, un glob che ha ordinato `10-api.md` prima di `2-setup.md`, output scritto nell'albero sbagliato, e una pipeline che ha riportato successo perché `tee` è riuscito. In CI il costo onesto di Pandoc è l'installazione a ogni esecuzione, il che è il motivo per cui un binario statico, un'immagine in cache, o una chiamata API spesso vincono solo sul tempo reale di esecuzione.

## Perché il terminale cambia la domanda

In un browser un convertitore Markdown prende quattro decisioni per te e ti mostra subito il risultato. In un terminale prende le stesse quattro decisioni in silenzio, e lo scopri settimane dopo.

**Quale dialetto analizza.** Il CommonMark puro non ha tabelle, né liste di attività, né barrato, né autolink. GitHub Flavored Markdown li ha tutti e quattro. Quasi ogni CLI ha un default, e il default raramente è GFM: il reader di default di Pandoc è il suo proprio dialetto esteso, cmark-gfm viene distribuito con ogni estensione disattivata, comrak le attiva solo con `--gfm` o un `--extension` esplicito. Una tabella che il parser non riconosce non dà errore. Diventa un paragrafo pieno di caratteri pipe, e il job esce con zero.

**Se emette un documento o un frammento.** La maggior parte di questi strumenti sono librerie con un sottile eseguibile attaccato sopra, e una libreria restituisce correttamente `<h1>Title</h1><p>Text</p>` senza niente intorno. Aperto in un browser, è testo nero senza stile nel font di default del browser e a piena larghezza di finestra. È HTML valido e sembra rotto a chiunque lo riceva. Solo alcuni di questi strumenti hanno un flag che lo avvolge.

**Cosa fa con l'HTML grezzo.** Il Markdown è stato progettato per lasciar passare l'HTML, quindi un file `.md` può portare `<script>`, `onerror=` e link `javascript:`. Pandoc lo lascia passare tutto. marked lo lascia passare tutto e lo dice nella sua stessa documentazione. cmark-gfm e comrak lo sopprimono a meno che tu non passi `--unsafe`. markdown-it lo fa escape a meno che tu non attivi la sua opzione `html`. Se il file veniva da fuori del tuo repository, quella scelta è l'intero modello di sicurezza — [la sanificazione è un lavoro separato con le sue proprie regole](/blog/sanitising-markdown-safely).

**Cosa dice alla shell quando fallisce.** Un convertitore che muore a metà file lascia comunque un file parziale sul disco, e se l'hai messo in una pipe, lo stato di uscita della pipeline appartiene all'ultimo comando invece che a quello che è morto. Questo è il modo più comune in cui una build rotta riporta verde.

Nessuna delle quattro è esotica. Tutte e quattro sono invisibili finché qualcuno non apre l'output.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità chiave | Prezzo |
| --- | --- | --- | --- |
| Pandoc | Qualsiasi cosa oltre l'HTML, e un controllo esatto del wrapper | `--standalone`, `--embed-resources`, `--template`, `--sandbox` | Gratis, GPL |
| cmark-gfm | Un renderer GFM piccolo, veloce e prevedibile | C senza dipendenze, estensioni opt-in con `-e` | Gratis, BSD 2-clause |
| comrak | Un binario statico con GFM dietro un flag | Rust, `--gfm`, HTML grezzo disattivato a meno di `--unsafe` | Gratis, BSD 2-clause |
| marked CLI | Una conversione in un repo che ha già Node | `marked -o out.html` che legge lo standard input | Gratis, MIT |
| markdown-it CLI | Conformità a CommonMark da una shell | Distribuisce un eseguibile `markdown-it`; fa escape dell'HTML grezzo di default | Gratis, MIT |
| Uno script Node | Output che controlli tu, wrapper incluso | Cinque righe sopra marked o markdown-it, nessuno strumento nuovo | Gratis |
| Python `markdown_py` | Una build Python che esiste già | `python -m markdown -x tables`, API di estensione | Gratis, BSD 3-clause |
| Go e goldmark | Un singolo binario cross-compilato da consegnare a un runner | Solo libreria; un `main.go` di venti righe diventa la CLI | Gratis, MIT |
| `curl` e una API HTTP | Nessuna toolchain locale, e un link alla fine | Una richiesta, nessuna installazione, l'output può essere una pagina live | Gratis |
| Una CLI senza dipendenze (`tp`) | Passaggi CI che non devono trascinare un albero di pacchetti | `login`, `push`, `list`, `rm`, `usage`, `--json` | Gratis |

## Ogni convertitore Markdown da riga di comando che vale la pena usare

### Pandoc — il migliore quando il wrapper conta quanto l'HTML

Pandoc è un convertitore di documenti scritto in Haskell che legge e scrive una quarantina di formati. Come convertitore Markdown da riga di comando è più strumento di quanto il lavoro richieda, ed è anche l'unico qui che produce un documento completo, autonomo e basato su template senza che tu debba scrivere il meccanismo di template da solo.

| Pro | Contro |
| --- | --- |
| `--standalone` e `--embed-resources` danno un vero documento a file singolo | Un'installazione grande da tenere fissata, su ogni macchina che esegue il job |
| I template e i filtri Lua controllano l'output con precisione | I template sono un secondo linguaggio da imparare |
| `--sandbox` limita l'accesso al filesystem quando l'input non è fidato | Nessuna sanificazione: l'HTML grezzo passa dritto nella pagina |
| Legge GFM, CommonMark e il suo proprio dialetto, selezionati esplicitamente | I suoi dialetti differiscono in modi che sorprendono le persone a metà migrazione |

**Prezzo:** gratis, licenza GPL.

**Dettagli tecnici e funzionalità**

- `-f gfm` seleziona il reader GitHub Flavored Markdown, così tabelle, liste di attività, barrato e autolink vengono analizzati; `-f commonmark` seleziona quello rigoroso
- `-s` (`--standalone`) produce “output with an appropriate header and footer … not a fragment”, nelle parole stesse del manuale
- `--embed-resources` mette inline fogli di stile, script e immagini collegati come URI `data:`; il più vecchio `--self-contained` è ora un sinonimo deprecato di `--embed-resources --standalone`
- `--template FILE` usa il tuo proprio wrapper, e implica `--standalone`
- `-M key=value` imposta un campo di metadati, `--metadata-file` ne legge un intero file YAML o JSON, e un valore dato sulla riga di comando sovrascrive uno nel documento
- `--defaults FILE` sposta un'invocazione lunga in un file YAML che puoi committare
- `--toc`, `-N` per le sezioni numerate, e `--shift-heading-level-by` gestiscono le faccende strutturali
- `--resource-path` dice dove cercare le immagini, separato da `:` su Unix e `;` su Windows
- `--syntax-highlighting=STYLE` sceglie il tema di evidenziazione — sostituisce il deprecato `--highlight-style` — e `--list-highlight-styles` stampa cosa supporta la tua build
- `--file-scope` analizza ogni file separatamente prima di combinarli, il che cambia il comportamento di note a piè di pagina e link su un input multi-file
- `--sandbox` esegue la conversione “limiting IO operations in readers and writers to reading the files specified on the command line”
- `--fail-if-warnings` trasforma un warning in un'uscita diversa da zero, il flag che rende Pandoc onesto dentro uno script

Un documento completo, in un solo comando:

```bash
pandoc -f gfm -t html -s \
  --embed-resources \
  --metadata title="API reference" \
  --toc --fail-if-warnings \
  docs/api.md -o build/api.html
```

`--metadata title=` non è opzionale nella pratica. Senza un titolo Pandoc avvisa e ti dà un documento standalone senza niente di utile nel suo `<title>`, e con `--fail-if-warnings` quel warning diventa un errore — il che è quello che vuoi la prima volta ed è esasperante la quinta volta che te lo dimentichi. Metti l'intera invocazione in un file `--defaults` e l'argomento smette di essere qualcosa che puoi dimenticare.

**Per chi è.** Chiunque abbia come output non solo HTML, chiunque abbia bisogno che il wrapper corrisponda a un template della casa, e chiunque converta file che non ha scritto lui, perché `--sandbox` non ha equivalenti altrove in questo elenco. Se l'HTML è l'unico target e il wrapper non conta, [le opzioni più piccole sono davvero più piccole](/blog/pandoc-alternatives-for-markdown-to-html).

### cmark-gfm — il miglior renderer GFM piccolo e prevedibile

cmark-gfm è il fork di GitHub dell'implementazione di riferimento di CommonMark, scritto in C99 standard senza dipendenze esterne. Fa un solo lavoro, velocemente, e ti consegna un frammento senza alcuno stile.

| Pro | Contro |
| --- | --- |
| Nessuna dipendenza, quindi si compila e va in cache quasi all'istante | Output a frammento: mai doctype, mai head, mai stili |
| Le estensioni sono esplicite, quindi il comportamento è leggibile dal comando | Devi ricordare ogni flag `-e`, ogni volta |
| L'HTML grezzo è soppresso a meno che tu non lo chieda con `--unsafe` | Impacchettato in modo incoerente tra le distribuzioni |
| Segue da vicino la specifica GFM | Niente oltre l'HTML e i suoi formati a forma di AST |

**Prezzo:** gratis, licenza BSD 2-clause.

**Dettagli tecnici e funzionalità**

- `-t` / `--to FORMAT` seleziona il formato di output; qui è l'HTML quello che vuoi
- `-e` / `--extension NAME` abilita un'estensione alla volta, e `--list-extensions` stampa cosa ha davvero la tua build
- `--unsafe` è quello che permette l'HTML grezzo e i link rischiosi; senza di esso vengono rimossi, il che è il default giusto per un file esterno
- `--hardbreaks` trasforma gli a capo singoli in `<br>`, e `--smart` produce virgolette e trattini tipografici
- `--width` controlla l'a capo per i formati di output a forma di testo

```bash
cmark-gfm -e table -e strikethrough -e autolink -e tasklist \
  README.md > build/README.html
```

Esegui `cmark-gfm --list-extensions` prima di committare quella riga. I nomi delle estensioni vengono dalla build, e un nome che la tua macchina accetta non è garantito esistere nella versione che la tua distribuzione spedisce sul runner — il che almeno fallisce rumorosamente, invece di scartare in silenzio le tabelle.

**Per chi è.** Build che convertono molti file e tengono ai secondi, e chiunque voglia l'HTML grezzo soppresso di default senza aggiungere un proprio sanificatore. Non per chi ha bisogno che l'output sia apribile così com'è.

### comrak — il miglior binario statico singolo

comrak è un'implementazione di CommonMark e GFM in Rust che, a differenza di goldmark, distribuisce un vero binario a riga di comando. È conforme a CommonMark 0.31.2 di default e passa per intero la suite GFM (verificato su github.com/kivikakk/comrak, l'8 settembre 2026), e si installa con `cargo install comrak`, da Homebrew, pacman, dnf o Scoop, oppure come binario di release che scarichi una volta.

| Pro | Contro |
| --- | --- |
| Un binario statico: niente da risolvere sulla macchina di destinazione | Output a frammento, come cmark-gfm |
| `--gfm` attiva l'intero set GFM con un solo flag | `cargo install` compila, il che è lento la prima volta |
| L'HTML grezzo e i link rischiosi sono disattivati a meno che tu non passi `--unsafe` | Compilare dal sorgente richiede una toolchain Rust recente |
| Scrive anche XML e CommonMark, utile per l'andata e ritorno | Ecosistema più piccolo dei parser JavaScript |

**Prezzo:** gratis, licenza BSD 2-clause.

**Dettagli tecnici e funzionalità**

- `--gfm` abilita insieme barrato, tabelle, autolink e liste di attività
- `--extension NAME` abilita singole estensioni, incluse alcune fuori da GFM come note a piè di pagina e apice
- `--unsafe` permette l'HTML grezzo e i link pericolosi; entrambi sono disattivati di default
- `--to` seleziona l'output HTML, XML o CommonMark

```bash
comrak --gfm README.md > build/README.html
```

**Per chi è.** Chiunque voglia che la conversione sia un file solo che può copiare su un runner, dentro un container, o sul laptop di un collega senza alcun gestore di pacchetti coinvolto. Scaricare un binario di release e tenerlo nella tua directory degli strumenti è una strategia legittima, ed è la cosa più economica da mettere in cache in questa pagina.

### marked CLI — il migliore quando il repo ha già Node

marked è il piccolo e veloce parser Markdown JavaScript, e installarlo installa anche un eseguibile `marked`. Il suo uso documentato legge dallo standard input e scrive dove dice `-o`.

| Pro | Contro |
| --- | --- |
| Già una dipendenza in moltissimi progetti JavaScript | Output a frammento; il wrapper è un problema tuo |
| GFM è attivo di default, quindi le tabelle funzionano senza flag | Nessuna sanificazione, per progetto esplicito |
| `marked --help` elenca le opzioni, e sono poche | Serve Node su ogni macchina che esegue il job |

**Prezzo:** gratis, licenza MIT.

```bash
npx --yes marked -o build/README.html < README.md
```

Il `--yes` conta più di quanto sembri. Senza di esso, `npx` su una macchina senza copia locale si ferma a chiedere il permesso di scaricare il pacchetto, e un passaggio CI che si ferma a fare una domanda resta appeso finché il job non va in timeout.

**Per chi è.** Progetti che dipendono già da marked per il rendering dentro l'applicazione e vogliono che la build usi lo stesso parser, così la pagina e l'app non possono essere in disaccordo sullo stesso file.

### markdown-it CLI — la migliore conformità da una shell

markdown-it è il parser conforme a CommonMark dietro l'anteprima Markdown di VS Code, e il suo pacchetto dichiara un eseguibile `markdown-it`, così una semplice invocazione `npx` funziona senza nient'altro installato.

| Pro | Contro |
| --- | --- |
| Segue da vicino la specifica CommonMark | Leggermente più lento di marked |
| Fa escape dell'HTML grezzo a meno che tu non attivi l'opzione `html` | Output a frammento |
| Un vero ecosistema di plugin — note a piè di pagina, ancore, container | I plugin sono raggiungibili dalla API, non dalla CLI |

**Prezzo:** gratis, licenza MIT.

```bash
npx --yes markdown-it README.md > build/README.html
```

La CLI è deliberatamente essenziale. Nel momento in cui vuoi un plugin — ancore dei titoli, note a piè di pagina, una sintassi a container — hai smesso di usare la CLI e hai iniziato a scrivere lo script della sezione successiva, il che va bene e richiede cinque righe.

**Per chi è.** Chiunque voglia l'HTML grezzo con escape di default e la specifica seguita, e chiunque stia per passare da una riga sola a uno script.

### Uno script Node — il migliore quando vuoi anche il wrapper

Ogni problema di frammento in questa pagina sparisce nel momento in cui scrivi tu stesso le cinque righe, perché il template è un template literal e l'HTML lo conosci già.

```js
// md2html.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const [input, output] = process.argv.slice(2);
const body = marked.parse(readFileSync(input, 'utf8'));

writeFileSync(
  output,
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${input}</title>
<style>
body{max-width:44rem;margin:2rem auto;padding:0 1rem;font:16px/1.6 system-ui,sans-serif}
table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.4rem .6rem}
pre{overflow-x:auto;background:#f6f8fa;padding:1rem;border-radius:6px}
</style>
</head>
<body>
${body}
</body>
</html>
`
);
```

| Pro | Contro |
| --- | --- |
| L'output è un documento vero, stilizzato come hai deciso tu | È tuo, bug inclusi |
| Qualsiasi parser, qualsiasi plugin, qualsiasi passaggio di post-processing tu voglia | Serve Node, e un lockfile per restare riproducibile |
| Nessun binario nuovo sulla macchina oltre a quello che il repo ha già | La sanificazione resta da aggiungere a te |

**Prezzo:** gratis. La licenza del parser è comunque MIT.

**Dettagli tecnici e funzionalità**

- Scambia `marked` con `markdown-it` e ottieni l'HTML grezzo con escape più i plugin, per altre due righe
- Aggiungi un sanificatore prima di scrivere se l'input non è tuo; la risposta documentata per marked è far passare il suo output attraverso DOMPurify
- `process.exitCode = 1` dentro un `catch` è quello che rende lo script usabile in una pipeline; uno script che lancia un'eccezione esce con un valore diverso da zero, ma uno script che registra l'errore e continua no
- Installa con `npm ci`, non `npm install`, così la versione del parser viene dal lockfile invece che dal calendario

Resisti alla tentazione di comprimere tutto questo in una vera riga sola. `node -e` su una singola riga significa che l'intero programma deve sopravvivere alle regole di quoting della tua shell, che è l'argomento di una sezione più avanti, ed è il posto meno gratificante in questa pagina per fare il furbo.

**Per chi è.** Chiunque abbia bisogno che l'output si apra da solo e non voglia installare un convertitore di documenti per ottenerlo. Per la maggior parte dei repository, la maggior parte delle volte, questa è la risposta.

### Python e `markdown_py` — il migliore dentro una build Python

Python-Markdown è l'implementazione Markdown di lunga data per Python e il motore sotto MkDocs. Installarla ti dà uno script `markdown_py`, e `python -m markdown` fa la stessa cosa senza preoccuparti se la directory degli script è nel tuo `PATH`.

| Pro | Contro |
| --- | --- |
| Già presente nella maggior parte delle toolchain di documentazione Python | Non conforme a CommonMark in ogni dettaglio |
| Una API di estensione matura, con estensioni per tabelle e note a piè di pagina | Le estensioni sono opt-in, quindi l'output semplice non ha tabelle |
| Configurabile da un file YAML o JSON con `-c` | Più lento delle implementazioni in C, Rust e Go |

**Prezzo:** gratis, licenza BSD 3-clause.

**Dettagli tecnici e funzionalità**

- L'uso è `python -m markdown [options] [args]`, e l'HTML va allo standard output
- `-x` / `--extension NAME` carica un'estensione; ripeti il flag per ognuna
- `-c` / `--extension_configs FILE` legge le impostazioni delle estensioni da YAML o JSON, dove appartiene tutto ciò che ha opzioni

```bash
python -m markdown -x tables -x fenced_code -x toc \
  README.md > build/README.html
```

Senza `-x tables` le tue tabelle sono paragrafi di pipe. Questa è la lamentela più comune su Python-Markdown e non è un bug: le tabelle non sono mai state nel Markdown originale né in CommonMark, quindi un'implementazione che le tiene dietro un flag di estensione è precisa, non complicata apposta.

**Per chi è.** Progetti Python, utenti di MkDocs, e chiunque abbia già Python nella propria immagine CI e preferirebbe non aggiungere un secondo runtime per una sola conversione.

### Go e goldmark — il miglior binario da consegnare a un runner

goldmark è un parser Markdown in Go, conforme a CommonMark 0.31.2, ed è il renderer che Hugo usa nella sua configurazione di default (verificato su github.com/yuin/goldmark e gohugo.io, l'8 settembre 2026). È solo libreria: non c'è un comando `goldmark` da installare. Quello che fai invece è scrivere una ventina di righe e compilarle, il che ti dà un singolo binario statico senza alcun runtime da installare da nessuna parte.

| Pro | Contro |
| --- | --- |
| Compila in un singolo binario statico, cross-compilabile da qualsiasi posto | Nessuna CLI finché non ne scrivi una |
| GFM in un'unica estensione: tabelle, barrato, linkify, liste di attività | Mantieni per sempre il piccolo programma |
| Veloce, e già nel tuo stack se usi Hugo | Meno estensioni pronte all'uso rispetto al mondo JavaScript |

**Prezzo:** gratis, licenza MIT.

```go
// md2html.go
package main

import (
	"bytes"
	"fmt"
	"os"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
)

func main() {
	source, err := os.ReadFile(os.Args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	md := goldmark.New(goldmark.WithExtensions(extension.GFM))

	var out bytes.Buffer
	if err := md.Convert(source, &out); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	os.Stdout.Write(out.Bytes())
}
```

**Dettagli tecnici e funzionalità**

- `extension.GFM` include tabelle, barrato, linkify e liste di attività; note a piè di pagina, liste di definizioni e il typographer sono estensioni separate che aggiungi alla stessa lista
- `go build` produce un file solo, e `GOOS` con `GOARCH` lo cross-compila per il runner senza un container
- Restituire un'uscita diversa da zero in caso di fallimento è esplicito qui, il che è più facile da ottenere correttamente che in una shell

**Per chi è.** Team che lavorano in Go, utenti di Hugo che vogliono sapere cosa sta renderizzando i loro contenuti, e chiunque preferisca committare un binario compilato piuttosto che mantenere un passaggio di installazione pacchetti in CI.

### `curl` e una API HTTP — la migliore quando non c'è alcuna toolchain

A volte l'output non è affatto un file sul disco. È una pagina che un collega può aprire, prodotta su una macchina senza Node, senza Python e senza il permesso di installare niente.

| Pro | Contro |
| --- | --- |
| Niente da installare oltre a `curl` | Serve la rete, quindi non può essere la tua build offline |
| L'output può essere un link live invece di un file da allegare | Serve un segreto nell'ambiente |
| Il comportamento della conversione non può derivare da un'installazione locale | Si applicano limiti di frequenza e dimensione |

**Prezzo:** gratis, API inclusa su un account gratuito.

TransformPipe espone una API su `/api/v1` con chiavi revocabili. Manda il Markdown come corpo della richiesta:

```bash
curl -fsS \
  -H "Authorization: Bearer $TP_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-binary @README.md \
  "https://transformpipe.com/api/v1/documents?name=README.md&share=link"
```

**Dettagli tecnici e funzionalità**

- La risposta è JSON con l'id del documento e, grazie a `?share=link`, un URL di sola lettura già attivo
- `GET /api/v1/documents/:id.html` restituisce anche il file HTML, se lo vuoi sul disco
- I limiti sono pubblicati, non da indovinare: 10 MB per un file da convertire, 4 MB per tenerne uno in un account, 100 MB e 500 documenti per account, e 60 richieste al minuto contate per chiave
- `-f` è portante. Senza di esso `curl` esce con zero su un 401 o un 429 e scrive il corpo dell'errore nel tuo file di output
- `-sS` tiene la barra di progresso fuori dai tuoi log ma lascia gli errori veri su stderr
- `--retry 3 --retry-connrefused` copre il fallimento transitorio di rete che altrimenti romperebbe una build al mese senza ragione

Quaranta file rientrano facilmente in 60 richieste al minuto. Migliaia hanno bisogno di una pausa tra le chiamate, oppure di un unico documento unito al loro posto — e [unire è un piccolo problema a sé](/blog/merging-many-markdown-files), con livelli dei titoli e collisioni di ancore da pensare prima.

**Per chi è.** Passaggi di build che vogliono un link condivisibile alla fine, e qualsiasi ambiente dove installare un convertitore è o vietato o non vale il minuto che costa per ogni esecuzione.

### Una CLI senza dipendenze — la migliore per un passaggio CI che deve restare piccolo

L'altra forma della stessa idea è una CLI che avvolge la API, scritta così che installarla non installi nient'altro. `tp` di TransformPipe è un file solo di Node senza dipendenze, apposta: uno strumento che le persone eseguono in CI non dovrebbe trascinarsi dietro un albero di pacchetti.

| Pro | Contro |
| --- | --- |
| Nessuna dipendenza transitiva da controllare, fissare o mettere in cache | È comunque una chiamata di rete e comunque un segreto |
| Legge una chiave da `tp login`, `TP_API_KEY` o `--key` | Serve Node presente, ma nient'altro |
| `--json` su qualsiasi comando, così uno script può leggere il risultato | Pubblica un documento; non è un convertitore di file locale |

**Prezzo:** gratis.

**Dettagli tecnici e funzionalità**

- `tp push README.md --share` converte e pubblica, e stampa il link
- `tp push docs/*.md --merge --share` concatena più file in un unico documento invece di un documento ciascuno
- `tp list`, `tp rm <id>` e `tp usage` coprono il resto, e `--json` su uno qualsiasi di essi è per gli script
- `tp login` salva la chiave in `~/.config/tp/config.json` con permessi `0600`; in CI imposti invece `TP_API_KEY`, perché un runner butta via la sua home directory
- I fallimenti stampano le parole stesse della API ed escono con un valore diverso da zero, così `set -e` li cattura senza alcun wrapper tuo

**Per chi è.** Chiunque metta la conversione in una pipeline e voglia una riga sola invece di un'invocazione `curl` con cinque flag. Per una pull request in particolare, un'action è ancora meno lavoro — [pubblicare Markdown dalle GitHub Actions](/blog/publish-markdown-from-github-actions) rimuove del tutto l'installazione dal runner.

## Dove Pandoc smette di ripagarsi da solo

Pandoc è la raccomandazione di default per convertire Markdown dal terminale, e per la maggior parte di quello che le persone gli chiedono quella raccomandazione è giusta. Vale la pena essere chiari sui quattro punti in cui non lo è, perché nessuno di essi appare in un confronto di funzionalità.

**L'installazione è un costo per ogni esecuzione, non una tantum.** Sul tuo laptop installi Pandoc una volta e te ne dimentichi. In CI lo installi a ogni esecuzione, e quanto costa dipende del tutto da come: un gestore di pacchetti della distribuzione che scarica un pacchetto e le sue dipendenze, un'installazione Homebrew su un runner macOS, il pull di un'immagine Docker, o un pacchetto in cache ripristinato dalla cache del runner. Solo gli ultimi due sono rapidi, ed entrambi sono configurazione extra da mantenere. Confrontalo con un passaggio in un job che ha già Node, o un singolo binario statico che hai committato, o una chiamata HTTP, e l'aritmetica spesso va nella direzione opposta per un lavoro il cui intero output è un README trasformato in una pagina. Non prendere un numero da me — cronometra la tua propria pipeline con l'installazione e senza, due volte ciascuna, e usa quello che hai misurato.

**Non sanifica.** Pandoc renderizza fedelmente, il che significa che l'HTML grezzo nel sorgente arriva nell'output. Per la tua propria documentazione è una funzionalità; è così che le persone incorporano un video o un elemento `<details>`. Per un file che viene da un fork, un cliente o un issue tracker è un vettore, e non c'è un flag `--sanitise` a cui rivolgersi. `--sandbox` protegge la macchina che fa la conversione, non il browser che apre il risultato. Sono problemi diversi con risposte diverse, e confonderli è come un README non fidato finisce renderizzato con un tag script intatto.

**Il suo Markdown non è il Markdown in cui era scritto il tuo file.** Il reader di default di Pandoc è `markdown`, il suo proprio dialetto esteso, non GFM e non CommonMark. Converti un README di GitHub con il reader di default e otterrai differenze — negli autolink, in come viene prodotta un'interruzione di riga forzata, in se un URL nudo diventa un link — che non sono bug e non sono quello che avevi chiesto. `-f gfm` non è un'ottimizzazione. È un flag di correttezza, e ometterlo è il modo più comune in cui una conversione Pandoc va sottilmente storta. Lo stesso vale al contrario: un documento scritto per Pandoc, con i suoi div delimitati e la sua sintassi di citazione, perde quei costrutti in silenzio quando incontra un parser CommonMark rigoroso.

**I template sono un linguaggio.** Nel momento in cui `--standalone` non è del tutto giusto, stai scrivendo un template di Pandoc, imparando la sua sintassi di variabili e i suoi condizionali, e testandolo renderizzando documenti e guardandoli. È uno scambio equo se stai producendo cento documenti che devono apparire tutti uguali. È uno scambio scarso contro le venti righe di HTML nello script Node sopra, se quello di cui avevi davvero bisogno era un foglio di stile e una misura sensata. Sii onesto su quale dei due stai facendo prima di iniziare, perché la strada dei template è difficile da abbandonare una volta che una build ne dipende.

Se qualcosa di tutto ciò ti tocca, gli strumenti più piccoli in questa pagina non sono un compromesso; sono la portata corretta. E se vuoi la visione più ampia, incluse le opzioni per browser e librerie che non toccano mai un terminale, [il confronto completo tra convertitori le copre](/blog/best-markdown-to-html-converters).

## Le cinque cose che si rompono nel terminale, non nel convertitore

Ogni fallimento sotto è stato diagnosticato come un bug del convertitore da qualcuno, almeno una volta, e nessuno di essi lo è.

### Il quoting, e perché il file con uno spazio dentro ha rotto la build

`for file in docs/*.md; do cmark-gfm $file > out.html; done` funziona finché qualcuno non aggiunge `release notes.md`. A quel punto la shell divide la variabile senza virgolette sullo spazio e passa al convertitore due nomi di file che non esistono. Metti tra virgolette ogni espansione, ogni volta:

```bash
cmark-gfm "$file" > "$output"
```

La stessa regola si applica dentro `$(dirname "$file")` e `$(basename "$file" .md)`, entrambi i quali hanno bisogno delle loro virgolette interne oltre che di quelle esterne. I nomi di file da un repository non sono i tuoi nomi di file: arrivano con spazi, apostrofi, e commerciali, caratteri non-ASCII e, in una brutta giornata, un trattino iniziale che il convertitore legge come un flag. Un semplice `--` prima del nome file ferma quest'ultimo caso.

Per qualsiasi cosa ricorsiva, salta il ciclo su un glob e lascia che `find` passi i nomi come dati:

```bash
find docs -name '*.md' -print0 | while IFS= read -r -d '' file; do
  cmark-gfm -e table "$file" > "${file%.md}.html"
done
```

`-print0` e `-d ''` usano NUL come separatore, che è l'unico byte che un nome di file non può contenere. `IFS=` impedisce che gli spazi bianchi iniziali e finali vengano tolti dal nome. È brutto, ed è l'unica versione corretta per qualsiasi nome di file ti verrà mai dato.

Su Windows la modalità di fallimento è diversa e più silenziosa. Le regole di quoting di PowerShell non sono quelle della shell — le virgolette singole sono letterali, le doppie interpolano `$` — e il suo redirect non ti dà in modo affidabile UTF-8; `Out-File` in Windows PowerShell 5.1 usa di default UTF-16 little-endian (verificato su learn.microsoft.com, l'8 settembre 2026). Un file convertito scritto in una codifica che il browser non si aspetta arriva come rumore incomprensibile che sembra esattamente un difetto del convertitore, quindi scrivilo deliberatamente con `| Set-Content -Encoding utf8 out.html` e smetti di indovinare.

### Il globbing di una cartella, e l'ordine che nessuno ha chiesto

`docs/*.md` fa tre cose che le persone non si aspettano. Non ricorre nelle sottodirectory, quindi `docs/api/reference.md` viene saltato in silenzio. Se niente corrisponde, bash passa la stringa letterale `docs/*.md` al convertitore come nome di file, il che produce un errore sconcertante su un file con un asterisco dentro; `shopt -s nullglob` fa invece espandere un glob vuoto in niente. E ordina lessicograficamente, quindi `10-api.md` viene prima di `2-setup.md` ogni singola volta.

Quest'ultimo è solo cosmetico quando converti file per file, ed è un bug vero quando concateni prima di convertire. Imbottisci i numeri — `02-setup.md`, `10-api.md` — e l'ordinamento è corretto gratis, nella shell e in ogni altro strumento che leggerà mai quella directory. Per la ricorsione, o `shopt -s globstar` e usa `docs/**/*.md`, oppure usa `find`, che non ha bisogno di alcuna opzione di shell e si comporta allo stesso modo ovunque.

Se stai concatenando, `cat` non basta. Il semplice `cat` non lascia alcuna riga vuota tra i file, quindi l'ultima riga di uno si unisce alla prima riga del successivo in un unico paragrafo e un titolo può finire incollato al testo sopra di esso:

```bash
awk 'FNR==1 && NR>1 {print ""} 1' docs/*.md > all.md
```

Una riga vuota inserita all'inizio di ogni file tranne il primo. Questa è tutta la correzione, e vale la pena saperlo perché il sintomo — un titolo mancante nel mezzo di un documento lungo — non assomiglia per niente alla sua causa.

### Tenere l'output accanto all'input, senza appiattire l'albero

`basename` è lo strumento sbagliato per una directory di directory, e fallisce nel peggior modo possibile. `docs/api/index.md` e `docs/guide/index.md` diventano entrambi `index.html`, uno sovrascrive l'altro in silenzio, e la build ha successo con una pagina mancante. Niente ti avvisa, e il file che sopravvive è qualunque il glob abbia raggiunto per ultimo.

Usa l'espansione dei parametri, che conserva il percorso:

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"      # strip the leading docs/
  output="${output%.md}.html"       # swap the extension
  mkdir -p "$(dirname "$output")"   # the tree does not exist yet
  cmark-gfm -e table -e strikethrough "$file" > "$output"
done
```

`${file%.md}.html` scambia l'estensione senza toccare alcun nome di directory. `${file#docs/}` rimuove la radice del sorgente, così l'albero di output rispecchia l'albero di input invece di annidarsi dentro una copia di esso. `mkdir -p "$(dirname "$output")"` è la riga che tutti dimenticano, e la sua assenza è un redirect che fallisce su una directory che non esiste — il che almeno fallisce rumorosamente.

Un'altra cosa sui percorsi di output. I link relativi tra i tuoi file Markdown sono relativi al file, quindi un link a `../guide/index.md` sopravvive solo se l'albero di output ha la stessa forma dell'albero di input, e solo se riscrivi anche l'estensione `.md` nel target del link. Appiattisci l'albero e ogni link interno si rompe in un colpo solo, in un modo che nessun flag del convertitore può riparare dopo.

### Gli exit code, e la pipeline che ha mentito

Il comportamento di default di uno script di shell è continuare dopo un fallimento e poi riportare successo. Una riga sistema la maggior parte del problema:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

`-e` si ferma al primo comando che fallisce. `-u` trasforma una variabile non impostata in un errore invece che in una stringa vuota, il che è quello che ti salva da `rm -rf "$BUILD_DIR/"` il giorno in cui `BUILD_DIR` non è mai stata impostata. `-o pipefail` è quella che conta qui, perché lo stato di uscita di una pipeline è per default quello dell'ultimo comando:

```bash
cmark-gfm README.md | tee build/README.html   # reports what tee did
```

Il convertitore può morire alla prima riga e `tee` uscirà comunque con zero, quindi il job è verde e il file è vuoto. Con `pipefail` la pipeline fallisce. Ancora meglio, non usare affatto una pipe: un semplice redirect mantiene lo stato proprio del convertitore, ed è la versione a cui rivolgersi di default.

Poi ci sono gli strumenti la cui idea di fallimento differisce dalla tua. `curl` esce con zero su un HTTP 404 o 429 a meno che tu non passi `-f`. Pandoc esce con zero sui warning a meno che tu non passi `--fail-if-warnings`. `npx` senza `--yes` non fallisce affatto — aspetta una risposta che non arriverà mai. E uno script Node che cattura un errore, lo registra e ritorna normalmente esce con zero, quindi imposta `process.exitCode = 1` nel `catch` o lo script sta mentendo alla tua CI.

Infine, controlla il file vuoto, perché diversi di questi fallimenti ne producono uno invece di nessuno:

```bash
[ -s "$output" ] || { echo "empty output: $output" >&2; exit 1; }
```

### Farlo in CI, dove l'installazione è la parte costosa

Tutto quello sopra presume che il convertitore sia presente. In CI non lo è, e portarcelo di solito è la cosa più lenta del job.

Tre regole lo coprono.

**Fissa la versione, o l'output cambia senza un commit.** `npx marked` usa un'installazione locale se ce n'è una e altrimenti scarica qualunque cosa sia più nuova quella mattina, quindi l'HTML che il tuo job produce può cambiare mentre il tuo repository no. Installa da un lockfile con `npm ci`. Fissa una versione apt o brew dove il packaging lo permette. Usa un tag Docker invece di `latest`. La riproducibilità è l'unica ragione per mettere affatto una conversione in CI, e un convertitore non fissato la butta via mentre sembra funzionare.

**Metti in cache quello che puoi, e preferisci quello che non ha bisogno di cache.** Un binario statico — comrak, o il tuo programma Go compilato — è un file solo da ripristinare e nessuna risoluzione di dipendenze. Un'immagine Docker è un pull solo. Un'installazione da gestore di pacchetti è un grafo di dipendenze risolto da zero a ogni esecuzione. Ordina le tue opzioni in quest'ordine e la risposta è raramente quella che la documentazione suggerisce.

**Tieni il segreto nell'ambiente e fuori dal repository.** Se la conversione è una chiamata API, la chiave viene dallo store dei segreti della CI in una variabile d'ambiente, mai da un file di configurazione che qualcuno ha committato. `tp login` scrive in una home directory che il runner scarta, il che è esattamente il motivo per cui esiste `TP_API_KEY`.

La checklist, quindi, per un passaggio di conversione che gira senza controllo:

- [ ] Versioni fissate in un lockfile e installate con `npm ci`, non `npm install`
- [ ] `npx` con `--yes`, così non si ferma mai a chiedere il permesso di scaricare un pacchetto
- [ ] `set -euo pipefail` in cima a ogni passaggio di shell
- [ ] `curl` con `-f`; Pandoc con `--fail-if-warnings`
- [ ] Un'uscita diversa da zero trattata come un job fallito, non un warning nel log
- [ ] L'output controllato per esistenza e dimensione diversa da zero prima che qualsiasi cosa a valle si fidi di esso
- [ ] La chiave API letta da una variabile d'ambiente, mai da un file committato

## Come scegliere

1. **Parti da quello che è già installato.** Se Pandoc è sulla macchina e nell'immagine, usalo e smetti di leggere, perché il costo di installazione di cui ti preoccupavi è già pagato. Se il repository ha Node e nient'altro, aggiungere un convertitore di documenti a quaranta formati per soddisfare un job di cinque righe è un peso di manutenzione che porterai ancora tra due anni.
2. **Decidi se l'output deve aprirsi da solo.** Se una persona farà doppio clic sul file, ti serve un documento completo con gli stili inline, il che significa Pandoc con `--standalone --embed-resources`, o un tuo proprio template. Ogni altro strumento qui ti dà un frammento, e un frammento mandato per email a un collega si renderizza come testo senza stile a piena larghezza di finestra.
3. **Fai corrispondere il dialetto al file prima di far corrispondere lo strumento al dialetto.** Se i documenti hanno tabelle o liste di attività, il comando deve chiedere GFM esplicitamente: `-f gfm` per Pandoc, `-e table` e simili per cmark-gfm, `--gfm` per comrak, `-x tables` per Python-Markdown. Converti un file rappresentativo e guarda le tabelle prima di committare lo script, perché una tabella che non è stata analizzata correttamente non solleva un errore.
4. **Decidi sull'HTML grezzo prima di convertire il file di qualcun altro.** Per le tue proprie note non conta. Per un README da un fork, o il convertitore sopprime l'HTML grezzo di default — cmark-gfm e comrak lo fanno, e markdown-it lo fa escape — oppure aggiungi un sanificatore, oppure accetti che qualunque cosa fosse in quel file girerà nel browser di chiunque apra l'output.
5. **Conta gli exit code, non le funzionalità.** Qualunque cosa scegli, il suo fallimento deve raggiungere lo stato del job. Questo significa `pipefail`, un redirect invece di una pipe, `-f` su `curl`, `--fail-if-warnings` su Pandoc, e un controllo della dimensione sull'output. Un passaggio di conversione che non può fallire è un passaggio di conversione di cui alla fine smetterai di fidarti, e poi smetterai di leggere.
6. **Cronometra l'installazione una volta, onestamente.** Esegui il job con l'installazione del convertitore e di nuovo con essa in cache o rimossa. Se l'installazione domina, sostituiscila con un binario statico, un'immagine, o una chiamata API, e metti i numeri misurati nella pull request così la prossima persona non deve discuterne di nuovo da zero.

## Conclusione

Scegli la forma più piccola che risponde al problema, poi spendi la tua cura sulla shell invece che sul parser. Per HTML sul disco che deve sembrare finito, Pandoc con `-f gfm -s --embed-resources` è una riga sola ed è la riga giusta; per HTML sul disco in un repository che ha già Node, scrivi lo script di cinque righe con il proprio template e possiedi il wrapper. Per una cartella, metti tra virgolette le tue espansioni, conserva l'albero, e imposta `-euo pipefail` così il job dice la verità su cosa è successo. E per un link che qualcuno può aprire senza alcuna toolchain propria — niente da installare, niente da fissare, niente da mettere in cache — basta una singola richiesta — una volta stabilito [che aspetto deve avere quella richiesta, e cosa deve una API di conversione a uno script quando il file è rotto](/blog/converting-documents-with-an-api) — e la stessa conversione gira [nel browser su TransformPipe](/) gratis, con il file che non lascia mai la tua macchina quando sei disconnesso.

## FAQ

### Qual è il convertitore Markdown da riga di comando più semplice da installare?

comrak, se conti lo scaricare un binario statico come installare qualcosa, perché non c'è nient'altro da risolvere e niente resta sulla macchina dopo. Se Node è già presente, `npx --yes marked` o `npx --yes markdown-it` non installano niente di permanente. Pandoc è il più capace e il più grande, e si guadagna la sua dimensione solo quando ti servono formati oltre l'HTML o un controllo esatto del wrapper.

### Come converto un'intera cartella di file Markdown in una volta?

Lascia che sia la shell a fare il ciclo — nessuno di questi strumenti ha bisogno di una modalità batch. Usa `find … -print0` incanalato in un ciclo `while IFS= read -r -d ''` così i nomi di file scomodi sopravvivono, costruisci il percorso di output con `${file%.md}.html` così l'albero delle directory viene preservato, e fai `mkdir -p` della destinazione prima di reindirizzarci dentro. Metti `set -euo pipefail` in cima, o un fallimento a metà strada riporterà comunque successo.

### Perché il mio HTML convertito non ha stile?

Perché lo strumento ti ha consegnato un frammento, che è quello che la maggior parte di essi è progettata per fare. cmark-gfm, comrak, marked, markdown-it e `python -m markdown` emettono tutti contenuto body senza doctype, senza head e senza stili, e un browser lo renderizza nel suo font di default su tutta la larghezza della finestra. O usi `--standalone --embed-resources` di Pandoc, oppure scrivi il wrapper una volta in uno script e lo riusi ovunque.

### Questi convertitori sanificano l'HTML?

Alcuni sì e altri deliberatamente no, e devi sapere quale hai prima di convertire un file esterno. cmark-gfm e comrak sopprimono l'HTML grezzo a meno che tu non passi `--unsafe`; markdown-it lo fa escape a meno che tu non abiliti la sua opzione `html`; marked lo lascia passare e documenta che la sanificazione non è compito suo; anche Pandoc lo lascia passare. `--sandbox` di Pandoc protegge la macchina che converte, non il browser di chi legge.

### Perché la mia conversione ha successo in CI ma non produce niente?

Quasi sempre una pipeline che ha nascosto il fallimento, o un convertitore che tratta un fallimento come un warning. `cmark-gfm file.md | tee out.html` riporta lo stato di uscita di `tee`, quindi un convertitore morto si legge come successo — usa `set -o pipefail`, oppure reindirizza invece di incanalare. Poi aggiungi `-f` a `curl` e `--fail-if-warnings` a Pandoc, e testa il risultato con `[ -s "$output" ]` prima che qualsiasi cosa a valle dipenda da esso.

### Pandoc è troppo lento per la CI?

La conversione di Pandoc è veloce; è l'installazione a costarti, e ti costa a ogni esecuzione invece che una volta sola. Quanto dipende del tutto dal metodo — il pull di un'immagine Docker o una cache ripristinata sono rapidi, un gestore di pacchetti che risolve le dipendenze da zero no — quindi misura la tua propria pipeline invece di fidarti della cifra pubblicata da chiunque altro. Se l'installazione domina il job, un singolo binario statico o una chiamata HTTP la rimuovono del tutto.

### Posso convertire Markdown in HTML senza alcuna installazione locale?

Sì, in due modi. Manda il file a una API HTTP con `curl` e ricevi indietro JSON, un file HTML, o un link live; oppure, su una pull request, usa una GitHub Action così il runner non installa affatto un convertitore. Entrambi hanno bisogno di una rete e di un segreto, quindi tieni anche un convertitore locale nella build se deve funzionare anche offline.
