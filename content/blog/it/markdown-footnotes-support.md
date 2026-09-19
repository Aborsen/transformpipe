---
title: "Le note a piè di pagina in Markdown: la sintassi, e chi la renderizza davvero"
description: "Le note a piè di pagina non sono in nessuna specifica Markdown. La sintassi che GitHub e Pandoc accettano, chi la renderizza, l'HTML che diventa"
date: 2026-08-19
tag: Sintassi
keywords: note a piè di pagina markdown, sintassi footnote markdown, note markdown non funzionano, github note a piè di pagina, pandoc footnotes, markdown-it-footnote, note inline markdown
---

### In breve

Le note a piè di pagina non sono in CommonMark e non sono nella specifica della GitHub Flavored Markdown, quindi ogni strumento che renderizza `[^1]` lo fa come estensione, e ogni strumento che non lo fa renderizza le tue parentesi come testo letterale. GitHub le renderizza sul proprio sito, Pandoc le renderizza, Hugo le renderizza, e markdown-it, remark, Python-Markdown e Goldmark le renderizzano una volta che aggiungi il plugin o l'estensione con il nome giusto. marked non lo fa, senza un'estensione di terze parti, e un parser CommonMark rigoroso non lo farà mai. Se una nota deve passare attraverso una catena di strumenti che non controlli, scrivi l'inciso in linea oppure costruisci a mano il riferimento e l'ancora, perché una nota che diventa in silenzio `[^1]` nella pagina pubblicata è il modo più comune in cui questa funzione fallisce.

Hai scritto `[^1]` in un paragrafo e `[^1]: la nota` in fondo al file. Su GitHub sembra perfetto: un piccolo numero in apice, una riga vicino al fondo, la nota sotto, una piccola freccia che ti riporta indietro. Convertti lo stesso file con qualcos'altro e la pagina contiene, in mezzo a una frase, i quattro caratteri `[^1]`.

Non è rotto niente. Il convertitore ha analizzato il tuo file correttamente e ha renderizzato esattamente quello che dice la specifica che implementa. Le note a piè di pagina non sono in quella specifica. Non sono in nessuna specifica — non in CommonMark, non nella specifica GFM, non nella pagina di sintassi originale di Markdown.pl. Esistono perché PHP Markdown Extra ha inventato una sintassi per loro a metà degli anni 2000, tutti hanno copiato quella sintassi, e GitHub alla fine l'ha messa sul proprio sito senza aggiungerla alla specifica che pubblica. Quella storia è l'intero motivo per cui questo articolo deve esistere.

Ci sono quindi due domande da rispondere, e sono diverse. La prima è quale sia la sintassi, dato che quasi ogni implementazione ha copiato la stessa e le differenze stanno negli angoli. La seconda è quali strumenti la capiscono, perché è quello che decide se il tuo documento sopravvive al viaggio. Questo articolo risponde a entrambe, e poi copre la parte che nessuno scrive: cosa fare quando la risposta alla seconda domanda è "non questo".

## La sintassi, come la accettano GitHub e Pandoc

Una nota a piè di pagina è due pezzi di testo in due punti. Il riferimento va dove dovrebbe apparire il numero. La definizione va dove preferisci, e il renderer la sposta in fondo.

```markdown
La stima presupponeva un tasso di cambio fisso.[^1]

[^1]: Cosa che non era, per la maggior parte del periodo in questione.
```

Il riferimento è un accento circonflesso dentro parentesi quadre. La definizione è lo stesso token, seguito da due punti, a inizio riga. È la forma che GitHub documenta, la forma che Pandoc documenta, la forma che Python-Markdown documenta, e la forma che ogni plugin qui sotto implementa. Imparala una volta.

**Gli identificatori non devono essere numeri.** `[^longnote]`, `[^exchange-rate]` e `[^a]` sono tutti validi, e usare parole invece di cifre è di solito l'idea migliore, perché il numero che vede il lettore viene generato dall'ordine dei riferimenti, non da quello che hai scritto tu. Pandoc dichiara il vincolo con chiarezza: gli identificatori non possono contenere spazi, tabulazioni, ritorni a capo, né i caratteri `^`, `[` o `]`. Tutto il resto è permesso.

**Il numero che vedi non è l'identificatore che hai scritto.** Questo sorprende chi etichetta le proprie note `[^7]` e `[^2]` e si aspetta che l'output dica 7 e 2. I renderer numerano le note nell'ordine in cui compaiono i riferimenti nel testo, poi rinumerano l'elenco in fondo per farlo corrispondere. Etichettale `[^prezzo]` e `[^fonte]` e la confusione svanisce, perché smetti di aspettarti che le tue etichette sopravvivano.

**Le definizioni possono stare ovunque nel file.** La documentazione di GitHub è esplicita sul fatto che il contenuto della nota compare in fondo al documento renderizzato indipendentemente da dove si trovi la definizione nella fonte. La maggior parte delle implementazioni si comporta allo stesso modo. Metterne ciascuna subito dopo il paragrafo che la richiama tiene la fonte leggibile; raccoglierle tutte alla fine tiene la prosa pulita. Entrambe vengono renderizzate in modo identico.

**Una nota può contenere più di un paragrafo, se la indenti.** È qui che le sintassi divergono un po', ed è da qui che vengono la maggior parte delle note malformate. La regola di Pandoc è che i blocchi successivi vengono indentati per mostrare che appartengono alla nota, e che puoi indentare l'intero paragrafo o solo la sua prima riga. Python-Markdown richiede quattro spazi o una tabulazione sulle righe di continuazione. Indentare di quattro spazi soddisfa entrambi.

```markdown
[^longnote]: Ecco il primo paragrafo della nota.

    Ed ecco un secondo, indentato di quattro spazi così resta
    attaccato alla nota invece di terminarla.

        Un blocco di codice, indentato di otto, ancora dentro la nota.

    - Una voce di elenco, anche questa dentro la nota.
```

Vale la pena digitare quell'esempio in quello che renderizza i tuoi documenti, perché il modo in cui fallisce è istruttivo: un paragrafo di continuazione che ha perso la sua indentazione non produce un errore. Produce una nota con un solo paragrafo e un paragrafo di prosa vagante subito sotto la riga di definizione, che il renderer piazza poi nel corpo del documento in qualunque punto si trovasse la definizione. Ti ritrovi una frase sul tasso di cambio in mezzo alla sezione quattro.

**I salti di riga dentro una nota seguono le regole abituali.** La documentazione di GitHub nota che aggiungere due spazi a fine riga interrompe la riga anche dentro una nota, esattamente come altrove. Le regole dentro una nota sono le stesse di fuori.

**Una definizione che nessuno richiama non è un errore neanche lei.** Elimina la frase che contiene `[^3]` e lascia `[^3]: …` in fondo, e le implementazioni si comportano diversamente: alcune scartano la definizione orfana, alcune la renderizzano come una nota senza nessun riferimento che punti a lei, e alcune stampano la riga di definizione come testo letterale perché non fa più parte di un gruppo di note. Nessuna te lo dice. Questa è la causa più comune di una nota "scomparsa" — il riferimento è stato eliminato insieme alla frase che lo circondava.

## Confronto rapido: chi renderizza una nota e chi la stampa

| Strumento o specifica | Note a piè di pagina | Come le ottieni | `^[…]` in linea | Licenza |
| --- | --- | --- | --- | --- |
| Specifica CommonMark | No | Non disponibile; le parentesi vengono renderizzate come testo | No | Gratis, specifica |
| Specifica GFM | No | Non nella specifica, nonostante il sito | No | Gratis, specifica |
| Il renderer proprio di GitHub | Sì | Attivo di default, tranne nelle wiki | No | Ospitato |
| commonmark.js | No | Implementazione di riferimento; solo la sintassi principale | No | Gratis, BSD |
| markdown-it | Plugin | `markdown-it-footnote` | Sì | Gratis, MIT |
| marked | No | Un'estensione di terze parti, o niente | No | Gratis, MIT |
| remark / unified | Plugin | `remark-gfm`, insieme a tabelle e task list | No | Gratis, MIT |
| Python-Markdown | Estensione | L'estensione ufficiale `footnotes` | No | Gratis, BSD |
| Goldmark | Estensione | `extension.Footnote` | No | Gratis, MIT |
| Hugo | Sì | L'estensione footnote di Goldmark, attiva di default | No | Gratis, Apache 2.0 |
| Pandoc | Sì | L'estensione `footnotes`, attiva nel suo dialetto | Sì, `inline_notes` | Gratis, GPL |

Due righe di quella tabella meritano di essere sottolineate, perché sono quelle che colgono la gente di sorpresa. La specifica GFM non contiene note a piè di pagina; la parola vi compare una volta, storicamente, per descrivere cosa altre implementazioni hanno aggiunto alla sintassi originale. E il sito di GitHub le renderizza comunque. Un parser che dichiara piena conformità a GFM e ignora `[^1]` non è rotto e non sta mentendo — [lo scarto fra la specifica e il sito](/blog/commonmark-gfm-and-the-flavours) è esattamente questo tipo di funzione.

## L'HTML in cui diventa una nota

Ogni implementazione produce le stesse tre cose strutturali, con nomi diversi sopra. Conoscere la forma ti dice cosa stilizzare, cosa sanitizzare, e cosa è andato storto quando un link a una nota finisce nel posto sbagliato.

Il riferimento diventa un apice che contiene un link, e il link porta un proprio id perché qualcosa possa puntare indietro a lui. markdown-it-footnote emette questo:

```html
<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>
```

Le definizioni diventano un contenitore alla fine del documento, con dentro un elenco ordinato, un elemento per nota, ciascuno con l'id a cui punta il riferimento:

```html
<hr class="footnotes-sep">
<section class="footnotes">
  <ol class="footnotes-list">
    <li id="fn1" class="footnote-item">
      <p>Cosa che non era, per la maggior parte del periodo in questione.
        <a href="#fnref1" class="footnote-backref">&#8617;</a></p>
    </li>
  </ol>
</section>
```

E la terza cosa è quell'ultima ancora: il link di ritorno. È la parte che la maggior parte degli schemi di note fatti a mano si scorda, ed è la parte che rende le note usabili invece che decorative. Senza di lei, un lettore che clicca sulla nota 4 in un documento lungo non ha modo di tornare indietro alla frase che stava leggendo se non il tasto indietro del browser — che funziona, finché la pagina non è stata raggiunta scorrendo piuttosto che con un link, nel qual caso indietro esce del tutto dal documento.

Le implementazioni espongono il link di ritorno come una stringa configurabile, che è un buon indizio di quanto conti per loro. La configurazione di Goldmark in Hugo ha un'impostazione `backlinkHTML` per il markup mostrato alla fine di una nota, con un'entità a forma di freccia di ritorno come valore predefinito. Python-Markdown ha `BACKLINK_TEXT`, predefinito a `&#8617;`, e `BACKLINK_TITLE`, predefinito a `Jump back to footnote {} in the text` — un attributo `title` esiste proprio perché una freccia da sola non dice nulla a uno screen reader. markdown-it-footnote non usa opzioni per questo; sovrascrivi le sue regole di rendering, che è la stessa possibilità con più righe da scrivere.

La coppia di id è il meccanismo, ed è anche la parte fragile. `#fnref1` e `#fn1` sono globali alla pagina. Due documenti renderizzati su una pagina, o un documento renderizzato due volte, e il secondo insieme di riferimenti punta al primo insieme di note. Ogni implementazione seria ha un'impostazione per questo, discussa più avanti, e ogni implementazione la spedisce disattivata.

## Implementazione per implementazione

### markdown-it — un plugin, e le classi arrivano insieme a lui

markdown-it non renderizza le note da solo. Il plugin ufficiale, `markdown-it-footnote`, ha licenza MIT e si installa da npm come una sola dipendenza:

```bash
npm install markdown-it-footnote
```

```javascript
const md = require('markdown-it')().use(require('markdown-it-footnote'));
md.render(source);
```

**Cosa ottieni:** l'HTML mostrato sopra, con i nomi di classe `footnote-ref`, `footnotes-sep`, `footnotes`, `footnotes-list`, `footnote-item` e `footnote-backref`, tutti da cui dovrai scrivere del CSS perché nessuno è già stilizzato. Accetta anche le note in linea, trattate nella sua sezione più avanti, cosa che poche implementazioni fanno.

**Per chi è:** chiunque sia già su markdown-it, il che include moltissime applicazioni e configurazioni di siti statici. Se stai scegliendo un parser JavaScript e le note a piè di pagina sono un requisito, questa è la strada più breve — [il confronto più ampio dei parser JavaScript](/blog/markdown-to-html-in-javascript) copre il resto della decisione, ma su questa singola funzione markdown-it vince avendo, semplicemente, un plugin ufficiale.

### remark e unified — le note arrivano con remark-gfm

remark tratta le note a piè di pagina come parte della GitHub Flavored Markdown, il che è una lettura difendibile di cosa GitHub renderizza davvero anche se non è quello che dice la specifica GFM. `remark-gfm` aggiunge cinque cose insieme: autolink letterali, note a piè di pagina, testo depennato, tabelle e task list. Ha licenza MIT.

**Cosa ottieni:** nodi footnote nell'albero mdast, il che significa che puoi fare delle cose alle note prima che diventino HTML — contarle, spostarle, controllare che ogni riferimento si risolva, estrarle in un documento separato. Questo è il punto di remark, e le note sono uno dei pochi costrutti in cui avere l'albero vale il peso della pipeline.

**Per chi è:** progetti che già girano su unified, e chiunque debba validare le note piuttosto che semplicemente renderizzarle. Una pipeline che fa fallire la build quando un riferimento non ha definizione sono circa quindici righe di codice con remark e impossibile con qualunque altra cosa in questo elenco.

### marked — GFM, meno le note

marked implementa CommonMark e GFM e si ferma lì. Le sue opzioni documentate sono `async`, `breaks`, `gfm`, `pedantic`, `renderer`, `silent`, `tokenizer` e `walkTokens`; non c'è nessuna opzione per le note, perché le note non sono in nessuna delle due specifiche che punta a implementare. Qualsiasi cosa oltre quella superficie passa dal suo meccanismo di estensione, e un pacchetto di terze parti, `marked-footnote`, esiste proprio per questo.

**Cosa succede senza uno di quei plugin:** il riferimento viene renderizzato come il testo letterale `[^1]` dentro il tuo paragrafo, e la riga di definizione viene renderizzata come un paragrafo di testo letterale che dice `[^1]: Cosa che non era…`. Nessun avviso, nessun errore, nessun messaggio di funzione mancante. Due righe di testo dove ti aspettavi una nota.

**Per chi è:** applicazioni che hanno bisogno di velocità e non hanno bisogno di note — caselle di commento, messaggi di chat, riquadri di anteprima. È un buon parser con un perimetro ristretto e onesto. Il perimetro è il problema qui: i convertitori costruiti su marked eredita il vuoto, e ce ne sono molti, incluso quello che fa girare la conversione da Markdown a HTML di questo stesso sito. Vale la pena saperlo prima di incollare un documento con note in un convertitore nel browser e fidarsi del risultato.

### Python-Markdown — un'estensione ufficiale con delle opzioni

Python-Markdown spedisce le note a piè di pagina come una delle sue estensioni standard, con licenza BSD, attivata per nome:

```python
import markdown
html = markdown.markdown(source, extensions=['footnotes'])
```

**Cosa ottieni:** riferimenti in apice, un blocco di note, link di ritorno, e più configurazione di quanto offra chiunque altro. `PLACE_MARKER` (predefinito `///Footnotes Go Here///`) ti lascia decidere dove nel documento vanno a finire le note invece di accettare il fondo pagina. `BACKLINK_TEXT` e `BACKLINK_TITLE` controllano il link di ritorno. `SEPARATOR`, predefinito a `:`, fissa la stringa tra il prefisso e il nome negli id che genera, motivo per cui i suoi id delle note non somigliano a quelli di nessun altro. `UNIQUE_IDS`, predefinito a `False`, evita le collisioni fra chiamate multiple a `reset()` — la correzione per renderizzare più documenti su una pagina. `USE_DEFINITION_ORDER` decide se l'elenco in fondo segue l'ordine delle definizioni o quello dei riferimenti.

**Per chi è:** script di build Python, e siti MkDocs, dove questo è già il motore in uso. L'estensione è in modalità di mantenimento secondo la sua stessa documentazione, il che per una funzione così stabile è una descrizione piuttosto che un avviso. Se il tuo lavoro di conversione avviene in Python, [le opzioni Python nella loro interezza](/blog/markdown-to-html-in-python) coprono da quale parser partire.

### Goldmark e Hugo — spenta di default in uno, accesa nell'altro

Goldmark è il parser CommonMark che usano la maggior parte dei programmi Go, con licenza MIT, e spedisce un'estensione footnote che la sua stessa documentazione descrive come la sintassi di PHP Markdown Extra. La attivi esplicitamente, come `extension.Footnote`, quando costruisci il parser.

Hugo, che usa Goldmark, la attiva per te. La sua configurazione di markup ha una sezione footnote con `enable` impostato su `true` di default, una stringa `backlinkHTML`, e `enableAutoIDPrefix` impostato su `false`. Quest'ultima opzione è la correzione per la collisione degli id, e il suo valore predefinito è il motivo per cui due pagine Hugo renderizzate in una pagina d'indice possono avere link alle note che puntano l'uno alle note dell'altro.

**Per chi è:** programmi Go, e ogni sito Hugo, i cui autori per la maggior parte non si rendono conto che le note a piè di pagina sono un'estensione perché non le hanno mai viste fallire.

### CommonMark e commonmark.js — le parentesi, esattamente come scritte

CommonMark si ferma a un nucleo che tutti avevano già in comune, e le note a piè di pagina non ci sono mai state. commonmark.js, l'implementazione di riferimento scritta dagli stessi autori della specifica, non ha supporto per le note e nessun punto di estensione per aggiungerne uno, di proposito. Ha licenza BSD.

**Cosa succede:** `[^1]` è un paragrafo che contiene un accento circonflesso fra parentesi quadre. La specifica lo dice, l'implementazione di riferimento lo fa, e qualunque discussione su se sia il comportamento corretto si chiude leggendo la specifica.

**Per chi è:** chiudere esattamente quella discussione. Quando una differenza di rendering ti fa chiedere se uno strumento sia rotto o solo rigoroso, questo è il parser che te lo dice.

### Pandoc — il supporto più ampio, e il solo flag per il posizionamento

Il dialetto Markdown proprio di Pandoc ha l'estensione `footnotes` attiva, ed è l'implementazione più completa della sintassi disponibile. Note su più blocchi, identificatori a parola, note in linea, e il vincolo sui caratteri dell'identificatore sono tutti documentati piuttosto che scoperti.

**Cosa ottieni oltre alla sintassi:** due flag che nessun altro in questo elenco possiede. `--reference-location` decide se le note vanno alla fine del blocco di primo livello corrente, alla fine della sezione corrente, o alla fine del documento — l'opzione riguarda i writer html, epub, markdown, muse e diversi writer per slide. E `--id-prefix` aggiunge un prefisso a ogni identificatore e link interno nell'output HTML, che è la risposta documentata alle collisioni di id quando stai generando frammenti da includere in altre pagine. Se stai assemblando una pagina da molti documenti convertiti, quel flag è la differenza tra link che funzionano e link che puntano tutti alle note del primo documento.

**Per chi è:** documenti piuttosto che pagine — qualunque cosa con note, citazioni o un formato di output diverso da HTML. È anche lo strumento a cui rivolgersi quando un file Markdown con note deve diventare un file Word o un PDF, perché le note a piè di pagina sono un costrutto nativo in entrambi quei formati e Pandoc sa come mapparle. Pandoc è gratis e con licenza GPL, e l'installazione è il solo argomento vero contro di lui per lavori piccoli.

### GitHub — il motivo per cui la gente scrive note a piè di pagina, in primo luogo

GitHub renderizza la sintassi delle note nei file Markdown, nelle issue, nelle pull request e nelle discussioni, numerando i riferimenti in ordine e raccogliendo le note in fondo al documento renderizzato. La sua documentazione dichiara esplicitamente un'eccezione: le note a piè di pagina non sono supportate nelle wiki. Scrivi una nota in una pagina wiki e ottieni le parentesi.

**Perché conta più delle altre righe:** GitHub è dove la maggior parte delle persone vede renderizzare una nota per la prima volta, e il suo comportamento è quello che presumono faccia Markdown. Niente sul sito ti dice che questa è l'estensione di un renderer piuttosto che parte del linguaggio. Il risultato è un flusso costante di file che funzionano nell'unico posto dove sono stati scritti e in nessun altro.

## Note in linea: `^[…]` di Pandoc

Pandoc aggiunge una seconda sintassi che evita del tutto il problema dei due punti. È un'estensione separata, `inline_notes`, e la nota va dove sarebbe andato il riferimento:

```markdown
Ecco una nota in linea.^[Le note in linea sono più facili da scrivere, perché
non devi scegliere un identificatore e scorrere fino in fondo per scrivere la nota.]
```

Il manuale dice che note in linea e note ordinarie possono essere mescolate liberamente in un documento, e che una nota in linea non può contenere più paragrafi — che è il compromesso. Rinunci alle note lunghe e guadagni il non dover inventare un identificatore o scorrere fino in fondo al file. Per una nota lunga una sola frase, è un buon affare.

Essendo un'estensione con un nome, puoi attivarla e disattivarla esplicitamente: `--from markdown+inline_notes` o `--from markdown-inline_notes`. Questo conta se stai leggendo file da altrove e vuoi un dialetto prevedibile invece di quello che capita di essere il default di Pandoc.

`markdown-it-footnote` implementa la stessa sintassi, il che lo rende l'unica strada JavaScript che accetta entrambe le forme. Nient'altro in questo elenco lo fa. GitHub no: `^[una nota]` su GitHub è un accento circonflesso seguito da quello che sembra un link rotto, un fallimento particolarmente inutile perché non sembra nemmeno sintassi da nota a chi legge la fonte.

La regola pratica è che le note in linea sono per documenti la cui intera catena controlli tu. Nel momento in cui il file potrebbe essere letto da GitHub, o da un parser che non hai verificato, la forma fra parentesi è la più sicura delle due, e l'inconveniente dei due punti è il prezzo della portabilità.

## Dove le note a piè di pagina falliscono, e cosa costa

La risposta ovvia — scrivi le note, funzionano bene — fallisce in cinque modi specifici, e tutti e cinque sono silenziosi.

**Il letterale silenzioso.** Un parser senza l'estensione renderizza il tuo riferimento e la tua definizione come testo. Non c'è nessun avviso in console e nessun segnale visivo tranne le parentesi stesse, che i lettori scorrono come un errore di battitura. Il costo è un documento pubblicato con `[^1]` dentro, scoperto da qualcun altro, di solito dopo che è già stato inviato a delle persone. Questo è il fallimento da anticipare, perché è il solo che non puoi vedere in un'anteprima che usa lo stesso parser dell'esportazione.

**Collisioni di id.** Gli id delle note sono `fn1`, `fnref1` e simili, generati per documento e unici solo al suo interno. Metti due documenti renderizzati su una pagina — un indice del blog con articoli completi, una pagina di documentazione che assembla diversi frammenti, una vista di stampa di un'intera sezione — e il `#fn1` del secondo documento risolve alla nota del primo. I link funzionano. Vanno nel posto sbagliato. Hugo spedisce `enableAutoIDPrefix` disattivato, Python-Markdown spedisce `UNIQUE_IDS` disattivato, e `--id-prefix` di Pandoc è qualcosa che devi passare tu, quindi il default in ogni caso è quello rotto. Il costo è una pagina in cui ogni link a una nota dopo il primo documento è sbagliato, e niente in nessun log di build lo menziona.

**Il sanitizzatore mangia il blocco.** L'output delle note usa tag che una lista di permessi pensata per Markdown spesso non include. `<section>` è la vittima abituale: un sanitizzatore costruito per permettere esattamente quello che produce un renderer GFM ha titoli, paragrafi, elenchi, tabelle, `<sup>` e `<a>` nella lista, e nessun `<section>`, perché il GFM puro non lo emette mai. Fai passare l'HTML delle note attraverso di lui e i riferimenti sopravvivono come link in apice mentre l'intero blocco di note svanisce, lasciando un documento pieno di numeri che puntano al nulla. Il costo è peggiore che perdere semplicemente le note, perché la pagina sembra ancora finita. Se stai sanitizzando output convertito — e per qualunque cosa tu non abbia scritto tu stesso, [dovresti farlo](/blog/sanitising-markdown-safely) — aggiungi il contenitore delle note alla lista di permessi nello stesso momento in cui aggiungi l'estensione al parser, e testa con un file che contenga delle note.

**I viaggi di andata e ritorno le perdono.** Un file Markdown con note convertito in HTML e poi di nuovo indietro, o in Word e poi indietro, può uscire con le note come paragrafi ordinari alla fine e i riferimenti come semplici numeri in apice. Pandoc mappa le note su costrutti nativi nei formati che li possiedono, motivo per cui è lo strumento giusto per quel viaggio. Un convertitore generico da HTML a Markdown non ha modo di riconoscere che una `<section class="footnotes">` fosse mai sintassi da nota, quindi produce fedelmente un elenco di paragrafi. Il costo è un file che viene renderizzato in modo accettabile e non può mai più essere modificato come note.

**Sorprese nell'ordinamento.** Il numero che vede un lettore viene dall'ordine dei riferimenti, e l'elenco in fondo viene ordinato per ordine dei riferimenti o per ordine delle definizioni a seconda dell'implementazione — Python-Markdown ne fa un'opzione, `USE_DEFINITION_ORDER`, che ti dice che entrambi i comportamenti esistono davvero. Sposta un paragrafo e i numeri si rinumerano, cosa corretta e che significa anche che una nota richiamata in prosa come "vedi nota 4" è un onere di manutenzione. Il costo è piccolo e costante: non riferirti mai a una nota per numero nel testo.

C'è un costo in più, ed è il motivo per pensarci prima di scrivere cento note piuttosto che dopo. Un documento con note a piè di pagina non è più Markdown portabile. Dipende dalla lista di estensioni di uno strumento specifico, e ogni passaggio che aggiungi alla sua catena è un passaggio che potrebbe non avere quell'estensione. Le tabelle hanno la stessa proprietà e ricevono più attenzione, perché [una tabella rotta è rumorosa](/blog/markdown-tables-that-survive-conversion) — una riga di pipe è ovviamente sbagliata. Una nota rotta è silenziosa, il che è quello che la rende più pericolosa.

## Far sopravvivere una nota a un convertitore che non le conosce

A volte la catena è fissa e il parser al suo interno non sa fare le note. Ci sono quattro strade per uscirne, in ordine di quanto ti costano.

**Scrivi l'inciso in linea.** L'opzione onesta, e quella da provare prima. La maggior parte delle note nella maggior parte dei documenti sono una parentesi che ha avuto ambizioni. Se la nota è lunga una sola frase, mettila nella frase, tra parentesi, ed elimina il meccanismo. Viene renderizzata da qualunque parser sia mai stato scritto, sopravvive a qualunque conversione, e il lettore non deve lasciare il paragrafo. Il costo è una frase un po' più lunga, che di solito non è un costo.

**Costruisci a mano il riferimento e l'ancora.** Le note a piè di pagina sono due link e un elenco ordinato. Puoi scriverli, e il risultato funziona in un parser CommonMark puro perché non usa nulla oltre a link e HTML grezzo:

```markdown
La stima presupponeva un tasso di cambio fisso.<sup id="ref-1"><a href="#note-1">1</a></sup>

## Note

1. <a id="note-1"></a>Cosa che non era, per la maggior parte del periodo in questione.
   <a href="#ref-1">Torna indietro</a>
```

Quello è un comportamento da nota reale: un numero in apice, un salto alla nota, un salto di ritorno. Ti costa una numerazione manuale, il che significa rinumerare a mano quando inserisci una nota in mezzo, e dipende dal fatto che l'HTML grezzo sopravviva. Due avvertenze da conoscere prima di impegnarti in questa strada. Primo, un parser configurato per fare l'escape dell'HTML grezzo — il default di markdown-it è `html: false` — stamperà i tuoi tag `<sup>` come testo, che è un fallimento diverso nello stesso punto. Secondo, un sanitizzatore deve permettere sia i tag che gli attributi `id` e `href`, altrimenti le ancore vanno via e i link restano appesi. Testalo nella catena reale, con il sanitizzatore reale, su una sola nota, prima di scriverne quaranta.

**Usa lo strumento che ha l'estensione, una sola volta.** Se la catena è fissa ma controlli un suo passaggio, convertti con un parser che capisce le note e passa al passaggio successivo l'HTML piuttosto che il Markdown. Pandoc che legge `markdown` e scrive HTML, oppure un piccolo script Node con markdown-it e il suo plugin footnote, è un lavoro di cinque minuti che elimina il problema in modo permanente. Il costo è che l'HTML diventa l'artefatto che mantieni, quindi funziona solo quando il Markdown è una fonte che converti piuttosto che un documento che le persone continuano a modificare.

**Fai una prova prima di scrivere.** Qualunque strada scegli, scopri cosa fa la catena prima di avere cento note in un documento. Metti questo in un file e convertilo:

```markdown
Un riferimento.[^prova]

Una nota in linea.^[In linea.]

[^prova]: La nota, con un secondo paragrafo sotto.

    Indentato di quattro spazi.
```

Quattro risposte da un solo incollaggio. Un numero in apice significa che l'estensione è presente. La nota renderizzata in fondo significa che è stata raccolta correttamente. Un secondo paragrafo dentro la nota significa che la regola di indentazione corrisponde a quello che scrivi tu. E un `^[In linea.]` visibile significa che le note in linea non sono disponibili, cosa che è quasi sempre il caso. Poi guarda il codice sorgente HTML e controlla che l'`href` sul riferimento corrisponda all'`id` sulla nota, perché quella coppia è quello che si rompe in silenzio quando due documenti condividono una pagina.

## Come scegliere: criteri prima di impegnarti con le note a piè di pagina

1. **Decidi se la nota è una nota a piè di pagina o una parentesi.** Se è lunga una sola frase, mettila nella frase e salta ogni problema di questo articolo; un meccanismo che non usi non può rompersi in un convertitore che non hai testato.
2. **Dai un nome a tutta la catena che il file percorrerà, poi controlla l'anello più debole.** Editor dell'autore, host del repository, convertitore, sanitizzatore, chi pubblica — le note hanno bisogno dell'estensione a ogni passaggio che analizza Markdown, e un solo passaggio senza di lei trasforma le tue note in parentesi nella pagina pubblicata.
3. **Usa identificatori a parola, non numeri.** `[^tasso-di-cambio]` sopravvive a inserimenti, cancellazioni e riordini, mentre un documento etichettato da `[^1]` a `[^12]` verrà alla fine rinumerato a mano da qualcuno che non sapeva che il renderer lo fa comunque.
4. **Attiva l'opzione del prefisso sugli id se più di un documento può condividere una pagina.** `enableAutoIDPrefix` di Hugo, `UNIQUE_IDS` di Python-Markdown e `--id-prefix` di Pandoc partono tutti disattivati, quindi una pagina d'indice o un frammento assemblato avrà link alle note che risolvono alla nota sbagliata e nessun passaggio di build te lo dirà.
5. **Aggiungi il contenitore delle note alla lista di permessi del tuo sanitizzatore nello stesso momento in cui aggiungi l'estensione.** Una lista costruita per l'output GFM non ha nessun `<section>` dentro, e il risultato è una pagina dove ogni riferimento sopravvive e ogni nota è sparita, che sembra finita e non lo è.
6. **Tieni le note in linea per catene che controlli interamente tu.** `^[…]` è una vera comodità in Pandoc e markdown-it, e fallisce su GitHub in un modo che non sembra nemmeno una nota, quindi un file che potrebbe essere letto lì dovrebbe usare la forma fra parentesi.
7. **Convertti un file con note e leggi il fondo dell'output.** Non l'inizio, e non l'anteprima: l'HTML renderizzato, in un browser, con un clic su un riferimento e un clic sul link di ritorno. Dieci secondi lì colgono le parentesi letterali, il blocco mancante e il link con il target sbagliato, che sono le uniche tre cose che possono andare storte.

## Conclusione

Le note a piè di pagina sono una convenzione ampiamente implementata senza nessuna specifica dietro, e tutto quello che è scomodo in esse deriva da questo solo fatto. La sintassi è stabile abbastanza da imparare una volta — `[^nome]` nel testo, `[^nome]:` in fondo, quattro spazi per continuare una nota — e la domanda che decide se funziona non riguarda mai la sintassi. È se lo strumento specifico davanti al tuo file ha l'estensione, e se lo strumento dopo di lui la ha anche lui. Controlla l'anello più debole della catena, tieni gli identificatori come parole, attiva il prefisso sugli id se due documenti condivideranno mai una pagina, e aggiungi il contenitore delle note al sanitizzatore nello stesso momento del plugin del parser. Se vuoi vedere cosa è diventato davvero un certo costrutto piuttosto che indovinarlo, [convertire il file in HTML](/) con la fonte visibile accanto all'anteprima risponde immediatamente: un `<sup>` con un `id` corrispondente significa che la nota è reale, e un paragrafo che contiene `[^1]` significa che hai trovato l'anello più debole.

## Domande frequenti

### Le note a piè di pagina fanno parte di Markdown?

No. Non sono né nella specifica CommonMark né nella specifica GitHub Flavored Markdown, e il Markdown originale non le ha mai avute. La sintassi che tutti usano viene da PHP Markdown Extra e si è diffusa come estensione, motivo per cui il supporto varia per strumento piuttosto che per versione.

### Perché la mia nota compare come `[^1]` nell'output?

Perché il parser che ha convertito il tuo file non implementa le note. Ha renderizzato le parentesi fedelmente, come richiede la sua specifica. Aggiungi l'estensione o il plugin delle note a quel parser, oppure usa un parser diverso — e controlla ogni passaggio della catena, perché il fallimento viene dall'anello più debole, non dal primo.

### Le note a piè di pagina funzionano su GitHub?

Sì, nei file Markdown, nelle issue, nelle pull request e nelle discussioni. La documentazione di GitHub nota un'eccezione: le note a piè di pagina non sono supportate nelle wiki. Tieni presente che il fatto che GitHub le renderizzi non è la stessa cosa del fatto che la specifica GFM le contenga, quindi un parser che dichiara conformità a GFM e ignora le tue note si comporta correttamente.

### Una nota può contenere un elenco o un blocco di codice?

Sì, se la indenti. Quattro spazi sulle righe di continuazione tengono un paragrafo, un elenco o un blocco di codice indentato attaccati alla nota sia in Pandoc che in Python-Markdown. Perdi l'indentazione e il blocco diventa testo ordinario del corpo, nel punto del documento in cui si trovava la definizione.

### Come convertto un file Markdown con note a piè di pagina in HTML?

Usa un parser con l'estensione attivata: Pandoc, che la ha attiva nel suo dialetto, oppure markdown-it con `markdown-it-footnote`, oppure Python-Markdown con `extensions=['footnotes']`, oppure remark con `remark-gfm`. Poi apri il risultato e clicca su un riferimento e su un link di ritorno, perché il fatto che l'estensione sia presente non garantisce che gli id corrispondano una volta che la pagina contiene qualcos'altro.

### Perché i link delle mie note saltano alla nota sbagliata?

Perché gli id entrano in collisione. Gli id delle note vengono generati per documento e sono unici solo al suo interno, quindi due documenti renderizzati sulla stessa pagina contengono entrambi `fn1`, e il browser va al primo. Attiva l'opzione del prefisso sugli id per il tuo strumento — `enableAutoIDPrefix` in Hugo, `UNIQUE_IDS` in Python-Markdown, `--id-prefix` in Pandoc — tutte disattivate di default.

### Qual è la differenza tra una nota a piè di pagina e una nota di chiusura qui?

In Markdown, nessuna a livello di sintassi: scrivi lo stesso `[^1]` in entrambi i casi e il renderer decide dove vanno le note. Pandoc è il solo strumento che rende esplicito il posizionamento, con `--reference-location` che scegli fra la fine del blocco, la fine della sezione o la fine del documento. `PLACE_MARKER` di Python-Markdown fa qualcosa di simile lasciandoti metter il blocco dove vuoi.
