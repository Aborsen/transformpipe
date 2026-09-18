---
title: "Come convertire HTML in Markdown: un metodo per ogni punto di partenza"
description: "Come convertire HTML in Markdown da un file, una scheda del browser, una stringa nel codice o un intero sito, e perché pulire prima la pagina decide il risultato"
date: 2026-09-05
tag: Conversione
keywords: come convertire html in markdown, html in markdown, convertire file html in markdown, pagina web in markdown, html in markdown da riga di comando, turndown markdown, pandoc html markdown, pulire html prima di convertire
---

Quasi tutte le istruzioni per convertire HTML in Markdown nominano uno strumento e si fermano lì. Ecco perché i risultati deludono. Lo strumento è la parte intercambiabile. Quello che decide se finisci con un documento leggibile o quattrocento righe di elenchi di link è da dove viene l'HTML e cosa gli hai fatto prima che il convertitore partisse. Un frammento scritto a mano converte in modo netto con qualunque cosa sul mercato. Una pagina salvata da un sito di notizie converte altrettanto in modo netto, e l'output è inutilizzabile.

### In breve

Scegli il metodo in base a dove sta l'HTML, non a quale libreria è la migliore. Per **un file su disco**, rilascialo in un convertitore lato browser o esegui un comando Pandoc. Per **una pagina che stai guardando**, usa un clipper o copia l'elemento articolo dalla console del browser, perché una pagina salvata nella maggior parte dei casi non è l'articolo. Per **una stringa nel codice**, usa la libreria del tuo linguaggio — Turndown in JavaScript, markdownify o html2text in Python — e per **un intero sito**, crea un mirror, estrai il contenuto, poi converti, in quest'ordine. Intestazioni, link, elenchi, tabelle e codice sopravvivono al viaggio; layout, classi, stili in linea e tabelle annidate no, e nessuna opzione li restituisce.

## Perché la conversione è la metà facile

Convertire HTML in Markdown è un comando. Produrre Markdown che mostreresti a qualcuno sono quattro passaggi, e il comando è l'ultimo di essi. Prima capisci quali byte sono il documento. Poi porti quei byte in un posto dove un convertitore può leggerli. Poi decidi cosa succede ai costrutti per cui Markdown non ha parole. Solo allora converti. Salta i primi tre e il quarto riesce comunque — questa è la trappola. Un convertitore non ha modo di distinguere un banner di cookie da un paragrafo, quindi traduce entrambi, correttamente, e ti restituisce il risultato.

Il secondo passaggio cattura più persone di quanto dovrebbe, perché l'HTML sul tuo schermo e l'HTML nel file spesso non sono lo stesso documento. `curl` e `wget` recuperano quello che il server ha inviato. Se la pagina si assembla da sé in JavaScript dopo — un sito di documentazione costruito su un router lato client, una shell d'applicazione, qualunque cosa renderizzata da un payload JSON — quello che il server ha inviato è un `<div>` vuoto e un tag script. Convertilo e ottieni un file vuoto, poi passi venti minuti a sospettare del convertitore. Il DOM renderizzato vive solo nel browser, motivo per cui "salvare la pagina" e "recuperare la pagina" producono risultati diversi e perché il browser è a volte il solo posto dove la conversione può iniziare.

Il terzo passaggio è quello che fallisce più tardi piuttosto che immediatamente. Una pagina scritta con `<img src="/img/diagramma.png">` converte in Markdown contenente esattamente quel percorso, e il percorso ora si risolve contro dove il Markdown è finito. Ogni immagine punta al nulla. Lo stesso vale per ogni link relativo, ogni ancora verso un'intestazione che il convertitore ha rinominato, e ogni costrutto dipendente dal CSS che portava un significato. La conversione sembrava perfetta nella anteprima del convertitore stesso. Si è rotta quando il file si è spostato, cosa che avviene una settimana dopo e davanti a qualcun altro.

## Confronto rapido: il bigliettino

| Punto di partenza | Strada più corta | Cosa devi fare prima | Cosa ti costa |
| --- | --- | --- | --- |
| Un file `.html`, scritto a mano o un frammento pulito | Qualunque convertitore, browser o CLI | Niente | Niente — questo caso è risolto |
| Un file `.html` salvato da un browser | Convertitore lato browser, o Pandoc | Togli navigazione, intestazione, piè di pagina, script | Dieci minuti di pulizia, oppure uno strumento che li rimuove per te |
| Una pagina aperta in un browser, una volta | Un'estensione clipper, o la console | Lascia che un estrattore trovi l'articolo | Installare un'estensione, oppure una riga di JavaScript |
| Una pagina che si renderizza in JavaScript | La console del browser, o un browser headless | Aspetta il DOM, poi prendi `outerHTML` | `curl` qui non funzionerà affatto |
| Pagine che leggi e conservi ogni settimana | Un clipper nei tuoi appunti | Configuralo una volta | Niente dopo la configurazione |
| Una stringa HTML in Node | Turndown, o node-html-markdown | `remove()` gli elementi che non vuoi | Una dipendenza e poche regole |
| Una stringa HTML in Python | markdownify, o html2text | `strip=[...]` gli elementi che non vuoi | Una dipendenza e poche opzioni |
| HTML in una pipeline di shell o CI | Pandoc, o un convertitore con un'API | Decidi la variante e se l'HTML grezzo passa | Un'installazione sul runner, o una chiamata di rete |
| HTML di email o newsletter | Pandoc, poi molta modifica manuale | Accetta che il layout a tabella sia perso | La maggior parte della struttura; le parole sopravvivono |
| Un intero sito che controlli | Converti dalla fonte, non dall'output | Trova i template e la cartella dei contenuti | Lavoro vero, e la risposta giusta |
| Un intero sito che non controlli | `wget --mirror`, estrattore, convertitore, in quest'ordine | Confermare che ti sia permesso | Ore, e un selettore per sito |
| HTML memorizzato in una colonna di database | La libreria del tuo linguaggio, in un ciclo | Campiona venti righe prima di convertirne un milione | Una brutta ipotesi moltiplicata per il numero di righe |

## Come convertire HTML in Markdown, per punto di partenza

### Un file `.html` su disco

Questo è il caso che tutti hanno e quello con più opzioni. Il file è già locale, non c'è niente da recuperare, e la sola vera domanda è se il file sia un documento o una pagina.

Un frammento scritto a mano, un capitolo esportato, una singola pagina di documentazione — convertilo con qualunque cosa e vai avanti. Una pagina salvata da un browser è diversa. I browser offrono due modalità di salvataggio e producono problemi diversi. "Pagina web, solo HTML" ti dà un file con il markup e nessuna delle risorse, quindi le immagini diventano riferimenti rotti. "Pagina web, completa" ti dà un file più una cartella di risorse e riscrive i percorsi per puntare in quella cartella, il che significa che il tuo Markdown porterà percorsi come `page_files/diagramma.png` — corretti sulla tua macchina, senza senso ovunque altro.

| Strada | Installazione | Buona per | Attenzione a |
| --- | --- | --- | --- |
| Convertitore lato browser | Nessuna | Un file, subito, senza caricarlo | Un documento alla volta |
| Pandoc | Sì, una volta | Scripting, e output oltre Markdown | Nessuna sanitizzazione; l'HTML grezzo passa a meno che lo disattivi |
| `html2text` (Python) | Sì, pip | Output di testo semplice leggibile | GPLv3, e riformatta aggressivamente di default |
| Estensione dell'editor | Sì | Convertire mentre il file è già aperto | Varia enormemente per estensione |
| Incolla in un editor Markdown | Nessuna | Piccoli frammenti | Scarta in silenzio quello che l'editor non capisce |

Con Pandoc, l'intero lavoro è una riga:

```bash
pandoc -f html -t gfm --wrap=none page.html -o page.md
```

`-t gfm` richiede GitHub Flavored Markdown, la variante con tabelle, elenchi di attività e barrato dentro. `--wrap=none` impedisce a Pandoc di ridistribuire i tuoi paragrafi a una larghezza di colonna, il che conta perché un paragrafo ridistribuito produce un diff su ogni riga la prossima volta che qualcuno lo modifica. Due flag in più si guadagnano un posto qui. `--extract-media=media` estrae immagini e altri contenuti multimediali dalla fonte in una cartella e riscrive i riferimenti di conseguenza, il che è il rimedio per il problema dei percorsi delle risorse sopra. E `-t gfm-raw_html` disattiva l'estensione `raw_html`, così i costrutti che Pandoc non può esprimere in Markdown vengono scartati invece di passare come tag HTML. Pandoc accetta anche un URL al posto di un nome di file e lo recupera via HTTP, e `--sandbox` limita il suo accesso ai file a quelli nominati sulla riga di comando, cosa che vale la pena usare su qualunque cosa tu non abbia scritto (verificato su pandoc.org, il 8 settembre 2026).

La strada lato browser scambia i flag con il non avere niente da installare. [La conversione da HTML a Markdown di TransformPipe](/html-to-markdown) legge il file nella pagina, rimuove gli elementi `script`, `style`, `noscript`, `template`, `svg`, `iframe`, `head`, `nav` e `footer` insieme ai commenti HTML, converte quello che resta, e restituisce un file `.md`. Senza aver fatto l'accesso, il file non viene mai inviato da nessuna parte — la conversione avviene sulla tua stessa macchina, cosa che puoi confermare guardando la scheda di rete mentre funziona. La conversione è limitata a 10 MB, molto più HTML di quanto qualunque pagina singola contenga.

**Usa questa strada quando:** hai il file, vuoi il Markdown, e lo fai una o due volte. Se lo fai cento volte, salta alla strada del codice.

### Una pagina aperta in un browser

Qui l'HTML che vuoi non esiste ancora come file, e la versione che otterresti recuperando l'URL potrebbe non corrispondere a quello che stai leggendo. Ci sono tre strade e si adattano a frequenze diverse.

**Ritaglia.** Un'estensione del browser che ritaglia in Markdown esegue un estrattore sulla pagina renderizzata, butta via gli arredi, e converte quello che resta. È il miglior risultato per unità di sforzo per una pagina che stai leggendo, ed è la sola strada che gestisce in modo affidabile il contenuto renderizzato in JavaScript, perché lavora sul DOM vivo. [Il confronto tra convertitori da HTML a Markdown](/blog/best-html-to-markdown-converters) tratta quali estensioni fanno cosa; il punto qui è che è l'estrazione, non la conversione, a farle sembrare migliori di uno strumento nudo.

**Prendi l'elemento che vuoi dalla console.** Apri gli strumenti per sviluppatori, trova l'elemento che contiene l'articolo, e copia il suo markup:

```js
// In the browser console. Pick the selector that actually wraps the article.
copy(document.querySelector('main').outerHTML)
```

`copy()` è una funzione della console DevTools di Chrome e Edge; metti il suo argomento nella clipboard. Incolla il risultato in un file e convertilo. Il valore intero di questa strada è il selettore: hai nominato l'articolo a mano, il che è più preciso di qualunque euristica, e ci vogliono circa quindici secondi una volta che conosci il sito. Per un sito che convertisci ripetutamente, scrivi il selettore da parte. `article`, `main`, `[role="main"]` e `.post-content` coprono una quota sorprendente del web.

**Salva e convertí.** Usa il comando di salvataggio del browser, poi trattato il risultato come un file su disco. Questa è la strada più lenta verso un buon risultato, perché il file salvato contiene tutto: la testata, la navigazione, l'invito a iscriversi, il carosello di articoli correlati, la sezione commenti e un piè di pagina di sessanta link. È ancora la strada giusta quando ti serve la pagina esattamente come era, incluse le parti che un estrattore scarterebbe.

| Strada | Sforzo per pagina | Gestisce pagine JavaScript | Conserva l'intera pagina |
| --- | --- | --- | --- |
| Estensione clipper | Due clic | Sì | No, per design |
| Selettore in console | Quindici secondi | Sì | Solo quello che hai selezionato |
| Salva e convertí | Un minuto, più la pulizia | Dipende dalla modalità di salvataggio | Sì, tutto |
| Vista lettura, poi salva | Due clic | Sì | No |

Quest'ultima riga vale la pena saperla. La Vista lettura di Firefox è costruita sulla libreria Readability di Mozilla, che è lo stesso motore di estrazione usato dalla maggior parte dei clipper. Attivare la Vista lettura e poi salvare ti dà una pagina spogliata senza installare niente.

**Usa questa strada quando:** la pagina è davanti a te. Se ti ritrovi a farlo ogni giorno, installa un clipper e smetti di pensarci.

### Una stringa HTML nel codice

Una volta che l'HTML è una variabile, la conversione è una chiamata di funzione e il lavoro interessante è la configurazione. Ogni libreria in questa categoria ti dà tre leve: quali elementi scartare del tutto, quali conservare come HTML grezzo, e come renderizzare il resto.

In JavaScript, Turndown è la scelta predefinita e quella contro cui gli altri strumenti vengono misurati. Ha licenza MIT e la sua API è piccola:

```js
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const turndown = new TurndownService({
  headingStyle: 'atx',        // "## Heading", not the underlined form
  codeBlockStyle: 'fenced',   // ``` fences, not four-space indents
  bulletListMarker: '-',
  linkStyle: 'inlined',
});

turndown.use(gfm);                                  // tables and strikethrough
turndown.remove(['script', 'style', 'nav', 'footer']); // gone, not converted

const markdown = turndown.turndown(html);
```

Tre di quelle righe sono quelle che contano. `use(gfm)` aggiunge le regole di `turndown-plugin-gfm` per tabelle e barrato — senza, Turndown non ha supporto per le tabelle e una `<table>` passa come HTML grezzo o come una sequenza di testo secondo le tue altre impostazioni. `remove()` elimina elementi e il loro contenuto prima della conversione, che è il tuo passaggio di pulizia. E `addRule()`, non mostrato qui, ti lascia mappare un pattern specifico su un Markdown specifico: un `<div class="warning">` su una citazione, un `<figcaption>` su un corsivo sotto l'immagine, un componente noto su un blocco recintato.

L'alternativa in JavaScript è node-html-markdown, che porta il proprio parser HTML invece di richiedere un DOM. Questo conta se il codice gira in un posto senza uno — una funzione serverless, una CLI, un worker — perché l'opzione dipendente dal DOM ti costringerebbe ad attaccare jsdom alla build. Ha licenza MIT e gestisce tabelle e barrato da sola.

In Python ci sono due opzioni mature con obiettivi diversi. markdownify ha licenza MIT, è costruita su BeautifulSoup, e punta a una struttura fedele: `md(html, heading_style="ATX", strip=['a'])` converte, con `strip` che nomina i tag da rimuovere e `convert` che nomina i soli tag da conservare. Ha opzioni per i caratteri dei punti elenco, una lingua di codice assunta per i blocchi `<pre>`, l'avvolgimento dei paragrafi e l'inferenza dell'intestazione sulle tabelle che ne mancano. html2text ha licenza GPLv3 e punta a un testo leggibile: installa uno strumento da riga di comando con lo stesso nome e accetta flag come `--ignore-links`, `--reference-links`, `--mark-code` e `--escape-all`.

| Libreria | Linguaggio | Licenza | Leva di pulizia | Tabelle |
| --- | --- | --- | --- | --- |
| Turndown | JavaScript | MIT | `remove()`, `keep()`, `addRule()` | Via `turndown-plugin-gfm` |
| node-html-markdown | JavaScript | MIT | Traduttori personalizzati | Integrate |
| markdownify | Python | MIT | `strip=[]`, `convert=[]` | Integrate |
| html2text | Python | GPLv3 | Flag in stile `--ignore-links`, `--ignore-images` | Limitate; punta a testo leggibile |
| Pandoc | Qualunque, via shell | GPL | `-t gfm-raw_html`, `--sandbox` | Integrate |

Se la conversione deve girare dentro un job invece che su una macchina che amministri, un convertitore raggiungibile via HTTP toglie l'installazione dal runner. Inviare HTML a `POST /api/v1/documents?kind=html-to-markdown` converte il corpo e conserva il risultato; il corpo della richiesta è limitato a 4 MB, perché una funzione Vercel rifiuta un corpo più grande con un semplice 413 che nessun codice applicativo vede mai.

**Usa questa strada quando:** la conversione avviene più di una volta, o avviene senza una persona che guarda. Scrivi le regole di pulizia una volta, nel codice, dove sono revisionabili.

### Un intero sito

Questo è il caso in cui il consiglio onesto di solito è "fai qualcos'altro". Se controlli il sito, l'HTML è l'output della build e stai convertendo l'artefatto sbagliato. La fonte — i template più qualunque cosa contenga i contenuti — è più vicina a Markdown di quanto lo siano le pagine renderizzate, e convertire l'HTML renderizzato indietro significa recuperare struttura che la tua build già conosce. Controlla prima se c'è un export. Un CMS con un formato di export, un database con una tabella di contenuti, un repository con la fonte dentro: tutti e tre battono lo scraping del tuo stesso sito.

Se hai davvero solo le pagine renderizzate, l'ordine è fisso e saltare un passaggio costa più che farlo.

1. **Crea un mirror.** Metti le pagine su disco prima di convertire qualunque cosa, così la conversione è ripetibile e non stai recuperando di nuovo a ogni tentativo. `wget --mirror --page-requisites --convert-links --adjust-extension --no-parent https://esempio.com/docs/` percorre la sezione, porta le risorse, riscrive i link per puntare alle copie locali e resta dentro il percorso che hai nominato. Controlla prima i termini del sito e il suo `robots.txt`; "potrei recuperarlo" e "posso recuperarlo" sono domande diverse.
2. **Ottieni l'elenco giusto.** Una sitemap è una fonte di URL migliore di una scansione, perché è la risposta stessa del sito a "quali pagine esistono" e non ti farà camminare in un calendario con mesi infiniti dentro.
3. **Estrai.** Per ogni pagina, isola il contenuto. Sia un selettore CSS trovato a mano — meglio, se il sito usa un solo template — sia un estrattore. Readability di Mozilla ha licenza Apache 2.0, accetta un documento DOM e restituisce un oggetto con `title`, `content`, `textContent`, `excerpt`, `byline`, `lang` e altro. Richiede un vero DOM, quindi in Node lo accoppi con jsdom. Il suo compagno `isProbablyReaderable` ti dà un booleano rapido su se un documento vale la pena affidarglielo affatto, il che è come saltare automaticamente le pagine indice (verificato su github.com/mozilla/readability, il 8 settembre 2026).
4. **Convertí.** Ora il convertitore gira, ed è ora il passaggio noioso che avrebbe dovuto essere fin dall'inizio.
5. **Correggi i link.** Ogni link interno nell'HTML dell'mirror punta a una struttura di URL che non esiste più. Decidi la mappatura da vecchio URL a nuovo percorso di file una volta, applicala a ogni documento, e controlla un campione.

| Passaggio | Cosa costa saltarlo |
| --- | --- |
| Mirror su disco | Recuperare di nuovo l'intero sito ogni volta che cambi una regola |
| Sitemap invece di scansione | Pagine duplicate, archivi paginati, calendari infiniti |
| Estrarre | Mille documenti che apre ognuno con le stesse quaranta righe di navigazione |
| Convertire | — |
| Riscrivere i link | Un corpus di documenti che si collegano tutti al niente |

**Usa questa strada quando:** non hai accesso alla fonte e ti serve comunque il contenuto — un sito in dismissione, la documentazione di un fornitore che sei autorizzato a conservare, un archivio. Preventiva una giornata, non un'ora, e aspettati che il lavoro sul selettore sia per template.

## Pulire prima l'arredamento

Questo è il passaggio che decide il risultato, ed è quello per cui nessuna tabella di confronto ha una colonna. La scoperta è costante su ogni strada sopra: la differenza tra una buona conversione e una cattiva non è quasi mai il convertitore. È se l'input era il documento.

Pensa a una pagina reale. L'articolo che vuoi potrebbe essere il 15% degli elementi. Il resto è una testata, una barra di navigazione primaria, una secondaria, una finestra di consenso ai cookie, un modulo per la newsletter, una riga di condivisione, un carosello di articoli correlati, un thread di commenti e un piè di pagina con una mappa del sito dentro. Un convertitore traduce tutto fedelmente, nell'ordine del documento, il che metti l'articolo da qualche parte nel mezzo di un file molto lungo. L'output è corretto e inutile, e chi legge dà la colpa allo strumento.

Ci sono quattro modi per tagliare, in ordine decrescente di quanto funzionano bene.

**Nomina l'elemento che vuoi.** Un selettore — `main`, `article`, `#content`, `.markdown-body` — è il metodo più preciso disponibile perché hai guardato la pagina e deciso. Ha un limite: è per sito, a volte per template, e si rompe quando il sito viene ridisegnato. Per una manciata di siti che convertí spesso, è imbattibile e prende secondi.

**Esegui un estrattore.** Readability e i suoi parenti valutano gli elementi di un documento in base a quanto testo simile a prosa contengono rispetto al markup e alla densità dei link, poi restituiscono il vincitore. Questo generalizza, che è tutto il punto: funziona su un sito che non hai mai visto, senza configurazione. Occasionalmente sbaglia anche, il più spesso su pagine che non sono affatto articoli — pagine indice, pannelli, risultati di ricerca — dove non c'è un solo blocco di prosa da trovare.

**Rimuovi gli elementi che non vuoi.** Invece di nominare cosa conservare, nomina cosa scartare: `script`, `style`, `nav`, `footer`, `header`, `aside`, `form`, `iframe`, `noscript`, `svg`. Questo è quello che un convertitore generico può fare senza sapere niente della tua pagina, e cattura la maggior parte dell'arredamento su una pagina costruita con elementi semantici. Non ne cattura niente su una pagina costruita interamente da elementi `<div>`, che è una gran parte del web.

**Correggilo dopo.** Convertí tutto, poi elimina il Markdown che non volevi. Questo va bene per un documento e è indifendibile per cento, ed è la scelta predefinita perché non richiede nessuna decisione a monte. Il costo è che fai la stessa modifica una volta per documento, e non puoi rieseguirla quando migliori le tue regole.

| Metodo | Precisione | Generalizza | Sforzo |
| --- | --- | --- | --- |
| Selettore CSS scelto a mano | Massima | No — per sito | Secondi, una volta che conosci il sito |
| Estrattore (Readability e simili) | Buono sugli articoli, scarso su tutto il resto | Sì | Un'installazione e un DOM |
| Elenco di rimozione elementi | Buono su HTML semantico, scarso su una minestra di `<div>` | Sì | Nessuno; i convertitori lo fanno per te |
| Modificare il Markdown dopo | Perfetto, in linea di principio | No | Per documento, per sempre |

Un avvertimento sulla pulizia troppo aggressiva. `<script>` e `<style>` dovrebbero sempre andare — Markdown non può esprimere nessuno dei due, e un tag script nell'input è un tag script in cerca di un posto dove eseguirsi. Ma `<aside>` a volte contiene una citazione in evidenza che appartiene all'articolo, `<header>` dentro un elemento `<article>` è spesso il titolo e la firma piuttosto che la testata del sito, e `<figure>` porta immagini con le loro didascalie. Un elenco di rimozione è uno strumento grezzo. Guarda un documento convertito prima di eseguirlo su mille.

## Cosa sopravvive, e cosa non può

Markdown è un linguaggio piccolo, deliberatamente. HTML non lo è. La conversione è una demolizione con un elenco di cose da conservare, e aiuta conoscere l'elenco prima di iniziare piuttosto che scoprirlo nell'output.

| Costrutto | Sopravvive? | Cosa succede davvero |
| --- | --- | --- |
| Intestazioni `h1`–`h6` | Sì | Diventano `#` fino a `######`, livelli intatti |
| Paragrafi, corsivo, grassetto | Sì | Affidabile ovunque |
| Link | Sì, come testo | L'URL è copiato letteralmente, percorsi relativi inclusi |
| Immagini | Sì, come riferimento | Il `src` è copiato letteralmente; `width`, allineamento e `srcset` sono persi |
| Elenchi ordinati e non ordinati | Sì | La nidificazione sopravvive; numerazione personalizzata e attributi `start` di solito no |
| Citazioni | Sì | Semplice |
| Blocchi di codice | Di solito | Una classe `language-*` diventa un'etichetta di recinzione se il convertitore la legge |
| Codice in linea | Sì | Backtick |
| Tabelle semplici | Con GFM | Solo griglia piatta; richiede una variante o un plugin che implementi le tabelle |
| Linee orizzontali | Sì | `---` |
| Barrato | Con GFM | Altrimenti scartato o conservato come HTML grezzo |
| Elenchi di attività | A volte | Un `<input>` checkbox dentro un elemento di elenco; molti convertitori lo ignorano |
| Elenchi di definizioni | Raramente | Non in CommonMark o GFM; approssimati o scartati |
| Note a piè di pagina | Raramente | Un'estensione in ogni variante che le ha |
| Layout — colonne, float, larghezze | No | Diventa una colonna nell'ordine del documento |
| Classi, id, stili in linea | No | Scartati, insieme a quello che segnalavano |
| Tabelle annidate, `rowspan`, `colspan` | No | Appiattite, scartate, o lasciate come HTML grezzo |
| Form, bottoni, `<details>`, tab | No | Scartati o emessi come HTML grezzo |
| Video incorporato, canvas, SVG | No | Un link nel migliore dei casi |
| Commenti, script, foglio di stile | No | Rimossi, e correttamente |

Quattro di queste righe meritano una frase in più.

**Le tabelle sono il fallimento più rumoroso.** Non sono nella specifica CommonMark, quindi un convertitore deve implementare deliberatamente le tabelle GFM. Quando non lo ha fatto, una `<table>` arriva come una sequenza di paragrafi o come HTML grezzo nel mezzo del tuo documento. Quando lo ha fatto, una griglia semplice passa perfettamente e una complicata no, perché le tabelle GFM non hanno celle che si estendono, contenuto a blocco né nidificazione. [Cosa succede alle tabelle nel passaggio](/blog/markdown-tables-that-survive-conversion) è la cosa più utile da testare su un documento reale prima di impegnarti in una strada.

**I blocchi di codice dipendono dall'evidenziatore.** Un semplice blocco `<pre><code>` converte in modo netto. Un blocco che un evidenziatore di sintassi ha riscritto in centinaia di elementi `<span>` converte in una recinzione se il convertitore è sensato riguardo `<pre>` e in un pasticcio di caratteri vaganti se non lo è. La lingua normalmente sta in un nome di classe, e leggerla è un comportamento opzionale. [I dettagli dei blocchi di codice e delle loro info string](/blog/code-blocks-in-markdown) vale la pena controllarli contro un campione reale.

**Link e immagini sopravvivono come stringhe, non come riferimenti funzionanti.** Questo è il fallimento che sembra un successo. Ogni percorso relativo converte nello stesso percorso relativo, e ora si risolve da un posto diverso. Se il Markdown va in un repository, un wiki o un archivio di note, ti serve un passaggio di riscrittura, e [i link e le immagini che funzionano ancora dopo la conversione](/blog/images-and-links-that-still-work) non avvengono da soli.

**L'HTML grezzo è una scelta che stai facendo che tu te ne accorga o no.** Alcuni convertitori emettono HTML per qualunque cosa non possano esprimere. Questo conserva l'informazione e rende il Markdown meno portabile: sopravvive se il prossimo renderer permette HTML grezzo e si trasforma in un pasticcio di tag visibili se invece lo esclude. Peggio, l'HTML grezzo portato attraverso una conversione porta con sé qualunque cosa avesse dentro. Se la fonte veniva dall'esterno, il Markdown ora contiene una superficie d'attacco per il prossimo renderer, e [la sanitizzazione deve avvenire dove l'HTML viene renderizzato](/blog/sanitising-markdown-safely), non dove è stato convertito.

## Dove fallisce la risposta ovvia

La risposta ovvia è "installa Turndown" o "esegui Pandoc", ed è giusta per la maggioranza dei file. Ecco dove non lo è, e cosa costa ogni fallimento.

**Quando la pagina non è il documento.** Trattato sopra e vale la pena ripeterlo, perché è responsabile della maggior parte dell'output cattivo. Un convertitore nudo su una pagina salvata produce una traduzione corretta di un sito web. Il costo non è un file cattivo — è che non lo noterai finché non lo apri, e su grande scala avrai convertito tutto prima di accorgertene.

**Quando l'HTML non è mai esistito sul server.** Una pagina renderizzata dal client recuperata con `curl` produce un guscio vuoto. Il costo di non saperlo è un giro diagnostico deviante: testerai tre convertitori, otterrai tre file vuoti, e concluderai che HTML in Markdown è rotto. Il segno rivelatore è che la fonte che recuperi è corta e piena di `<script src=...>`. Il rimedio è un browser, dal vivo o headless.

**Quando i significati stavano nel CSS.** Una pagina i cui riquadri, avvisi e note di deprecazione sono marcati solo da nomi di classe perde ognuno di essi. I paragrafi sono tutti presenti e chi legge non sa più quale contasse. Una regola per classe lo risolve — `addRule()` di Turndown, le opzioni per tag di markdownify — al prezzo di una regola per classe per sito, scritta da te. Non c'è una soluzione generale, perché non c'è una convenzione generale.

**Quando la destinazione è più rigida della fonte.** Convertí con uno strumento che emette GFM, poi renderizza con un parser CommonMark stretto, e le tue tabelle diventano paragrafi di caratteri pipe. La variante dell'output deve corrispondere alla variante di qualunque cosa la renderizzerà, ed è una decisione, non un default. Il costo di sbagliarla è un documento che sembrava giusto in un posto e sbagliato nell'altro.

**Quando il documento non era mai prosa.** Un template di email, un pannello, una pagina prezzi disposta come griglia, un modulo. Questi non sono articoli vestiti da HTML; il layout è il contenuto. Convertirli produce un elenco di parole nell'ordine in cui appaiono nel markup, che non è l'ordine in cui qualcuno le ha lette. Il Markdown non è una copia con perdite — è sbagliata, e la mossa onesta è ricostruire piuttosto che convertire.

**Quando stai convertendo l'output della tua stessa build.** Se controlli il sito, convertire l'HTML renderizzato indietro in Markdown significa buttare via informazioni che la tua build già aveva, poi pagare per indovinarle. Il costo è sottile: il risultato è giusto al 90%, quindi viene pubblicato, e il 10% mancante viene scoperto dai lettori nei mesi successivi.

## Come scegliere

1. **Trova l'HTML prima di trovare lo strumento.** Se i byte vengono da un file, un salvataggio, un recupero o un DOM vivo decide l'intero metodo, e scegliere prima una libreria significa scoprire più tardi che non riesce a vedere la pagina che intendevi.
2. **Converti prima un documento difficile, poi tutti gli altri.** Non il più semplice — quello con una tabella, un blocco di codice e un riquadro dentro. Qualunque cosa conservi quei tre conserva quasi tutto il resto, e lo scopri in un minuto invece che dopo duecento file.
3. **Decidi esplicitamente il passaggio di pulizia.** Selettore, estrattore, elenco di rimozione o modifica manuale: sceglilo ora. Sceglierlo dopo significa convertire tutto due volte, e la modifica manuale non scala oltre una decina di documenti.
4. **Fai corrispondere la variante alla destinazione.** Se il Markdown va dove si fa solo CommonMark, tabelle e barrato non arriveranno, per quanto bene il convertitore li abbia emessi.
5. **Decidi cosa succede a quello che Markdown non può esprimere.** Scartato, approssimato, o conservato come HTML grezzo. Conservare HTML grezzo in un documento destinato a un renderer stretto equivale a corromperlo.
6. **Controlla i link e le immagini, non solo il testo.** Apri tre di essi dalla nuova posizione del file convertito. Percorsi relativi che convertono in percorsi relativi è il defetto che passa ogni controllo a occhio finché qualcun altro non apre il file.
7. **Conta le conversioni contro le installazioni.** Un file non giustifica un gestore di pacchetti e un albero di dipendenze. Un job notturno non giustifica una scheda del browser e una persona che ci clicca dentro.

## Conclusione

Convertire bene HTML in Markdown è soprattutto una questione di fare una cosa prima della conversione — e se quello che stai convertendo è una pagina sul web piuttosto che un file, [leggi prima questo](/blog/save-a-web-page-as-markdown). La cosa: decidere quale parte dell'HTML è il documento, e con quale metodo. Nominala con un selettore se conosci il sito, affidala a un estrattore se non lo conosci, e spoglia l'arredamento in entrambi i casi. Dopodiché, qualunque strumento qui farà la traduzione — Turndown in JavaScript, markdownify o html2text in Python, Pandoc quando l'output deve essere più di Markdown, o [la conversione da HTML a Markdown lato browser di TransformPipe](/blog/best-html-to-markdown-converters) quando hai un file e niente da installare. Quello che non ti seguirà è il layout, lo stile e qualunque cosa un nome di classe segnalasse silenziosamente. Non è un limite del convertitore; è la definizione di Markdown, e la ragione per cui il file è leggibile all'altra estremità.

## Domande frequenti

### Come convertire un file HTML in Markdown senza installare niente?

Usa un convertitore che gira nel browser: apri la pagina, rilascia il file `.html`, scarica il `.md`. Con uno strumento lato browser il file non viene mai caricato, cosa che puoi verificare guardando la scheda di rete mentre converte. Se il file è una pagina web salvata piuttosto che un frammento pulito, aspettati di eliminare della navigazione dopo, a meno che lo strumento non la rimuova per te.

### Qual è il comando per convertire HTML in Markdown?

`pandoc -f html -t gfm --wrap=none page.html -o page.md` è la risposta generale. Aggiungi `--extract-media=media` per estrarre le immagini e riscrivere i loro riferimenti, e `-t gfm-raw_html` per scartare i costrutti che Pandoc non può esprimere invece di farli passare come tag HTML. Pandoc accetta anche un URL dove va il nome del file.

### Perché il mio Markdown convertito è pieno di navigazione e avvisi sui cookie?

Perché hai convertito la pagina piuttosto che l'articolo. I convertitori traducono ogni elemento che dai loro, e una pagina salvata nella maggior parte dei casi non è l'articolo. Nomina l'elemento del contenuto con un selettore CSS, esegui prima un estrattore come Readability, oppure usa un convertitore che rimuove gli elementi strutturali prima di iniziare.

### Posso convertire una pagina che si renderizza solo in JavaScript?

Non recuperandola. `curl` e `wget` ricevono quello che il server ha inviato, che per una pagina renderizzata dal client è una shell d'applicazione e un tag script. Ti serve il DOM renderizzato: copia l'elemento dalla console del browser, usa un'estensione clipper, oppure guida un browser headless e prendi `outerHTML` una volta che la pagina si è stabilizzata.

### I convertitori da HTML a Markdown conservano le tabelle?

Quelle semplici, se il convertitore implementa le tabelle GFM — alcuni richiedono un plugin, come `turndown-plugin-gfm` per Turndown. Niente conserva una tabella complicata, perché le tabelle GFM sono una griglia piatta senza celle che si estendono, senza contenuto a blocco e senza nidificazione. Converti una tabella reale e guardala prima di fidarti di una strada.

### Come convertire un intero sito in Markdown?

Crea prima un mirror su disco con qualcosa come `wget --mirror --page-requisites --no-parent`, prendi l'elenco degli URL dalla sitemap piuttosto che da una scansione, estrai il contenuto da ogni pagina, converti, poi riscrivi i link interni ai nuovi percorsi. Controlla i termini del sito prima di iniziare. Se controlli il sito, converti la fonte invece — l'HTML renderizzato ha già buttato via struttura che dovresti indovinare.

### Cosa succede al CSS, alle classi e agli stili in linea?

Vengono scartati, perché Markdown non ha stile. Di solito è quello che vuoi e occasionalmente una perdita reale, dato che un nome di classe è spesso la sola cosa che marca un avviso, un riquadro o una citazione in evidenza. I convertitori con regole per elemento possono mappare una classe nota su una citazione o un prefisso in grassetto, ma quella regola la scrivi tu, per sito.
