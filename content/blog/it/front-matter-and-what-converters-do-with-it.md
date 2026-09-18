---
title: "Il front matter di Markdown, e cosa ne fanno i convertitori"
description: "Il blocco in testa a un file Markdown viene eliminato, renderizzato, trasformato in tabella o letto come metadati: dipende dallo strumento che usi."
date: 2026-08-18
tag: Sintassi
keywords: front matter markdown, front matter yaml, rimuovere il front matter, convertitore markdown con front matter, front matter toml, front matter json, front matter hugo, front matter jekyll, metadati markdown
---

Arriva un file, lo converti, e la pagina si apre con una riga orizzontale, poi un titolo in grassetto che dice `title: Q3 review date: 2026-08-04 draft: false`. Niente è rotto. Il convertitore ha fatto esattamente quello che la specifica di Markdown dice di fare con tre trattini, un paragrafo, e altri tre trattini. Il blocco che intendevi come metadati è, per un parser che non ha mai sentito parlare di front matter, semplicemente testo.

### In breve

Il front matter è un blocco di metadati in testa a un file `.md`, e non compare in nessuna specifica di Markdown — non in CommonMark, non in GFM. Proprio per questo, ogni strumento decide da sé, e ci sono solo quattro esiti possibili: il blocco viene **eliminato** e scartato, **renderizzato** come contenuto del documento, **trasformato in una tabella**, oppure **letto come metadati** e usato. I generatori di siti statici lo leggono; i convertitori semplici e le librerie lo renderizzano, il che sembra un difetto ed è invece letteralismo; GitHub lo tabula. Se il file sta andando verso qualcosa che lo renderizzerà, elimina prima il blocco o usa uno strumento con un'opzione per il front matter, e non scrivere mai una regola `---` nuda in testa a un documento.

Il front matter è entrato in Markdown di traverso. Jekyll voleva variabili per pagina, ha scelto un blocco YAML delimitato da `---`, e ogni generatore da allora ha copiato la convenzione senza che nessuno la scrivesse in una specifica. Il risultato è un costrutto che una dozzina di strumenti largamente usati supporta, che nessuno di essi supporta in modo identico, e che un parser ha tutto il diritto di ignorare del tutto.

Questa è la frizione. Non puoi dire guardando un file cosa succederà alla sua intestazione, e non puoi dirlo nemmeno leggendo l'elenco delle funzioni di un convertitore, perché “supporta Markdown” non dice niente su un blocco che non è Markdown. Il fallimento è silenzioso in entrambe le direzioni: un renderer stampa i tuoi metadati nel documento dove i lettori li vedono, e un lettore di metadati elimina in silenzio una regola `---` che intendevi come divisore visibile.

Questo pezzo parla di quali strumenti fanno cosa, del perché il comportamento di rendering sia difendibile piuttosto che rotto, di cosa succede con le intestazioni TOML e JSON, e dell'unica vera trappola — che `---` è contemporaneamente un delimitatore di front matter, una regola orizzontale e una sottolineatura di intestazione setext, e quale dei tre diventi dipende da dove cade.

## Un blocco che nessuna specifica di Markdown definisce

Prendi l'esempio più piccolo possibile e falllo passare per un parser senza supporto al front matter. Questo è `marked`, la libreria dietro moltissime anteprime e convertitori:

```md
---
title: Notes
date: 2026-01-01
---

Body
```

L'output non è quello che darebbe un generatore:

```html
<hr>
<h2>title: Notes
date: 2026-01-01</h2>
<p>Body</p>
```

Letto come lo legge un parser è inevitabile. Il primo `---` non ha niente sopra di sé, quindi è un'interruzione tematica — un `<hr>`. Le due righe `chiave: valore` sono un paragrafo. Il `---` di chiusura sta direttamente sotto un paragrafo, e in Markdown una riga di trattini sotto un paragrafo è una sottolineatura di intestazione setext, che trasforma il paragrafo sopra in un `<h2>`. Tre trattini, un paragrafo, tre trattini: regola, intestazione. Il convertitore è fedele alla sola specifica che esiste per i caratteri che gli sono stati dati.

Metti una riga vuota dentro il blocco, cosa che YAML permette e le persone fanno quando l'intestazione cresce, e la forma cambia ancora:

```html
<hr>
<p>title: Notes</p>
<h2>date: 2026-01-01</h2>
```

Ora la prima chiave è un paragrafo e solo l'ultima diventa un'intestazione, perché una sottolineatura setext reclama solo il paragrafo immediatamente sopra di sé. Stessa intenzione, due documenti diversi, e nessuno dei due è un difetto. È la stessa classe di problema delle [differenze tra le varianti di Markdown](/blog/commonmark-gfm-and-the-flavours), con un'aggravante: le varianti almeno documentano cosa aggiungono. Il front matter è una convenzione piuttosto che un'estensione, quindi non c'è niente contro cui verificare uno strumento.

I quattro esiti qui sotto sono esaustivi. Uno strumento può buttare via il blocco, stamparlo, formattarlo, o usarlo. Tutto quello che incontrerai nella realtà è uno di questi quattro, e la sola domanda che vale la pena farsi su un convertitore è quale abbia scelto.

## Confronto rapido: cosa fa ogni strumento con il blocco

| Strumento | Cosa fa con il front matter | Delimitatori che riconosce | Cosa ottieni | Prezzo |
| --- | --- | --- | --- | --- |
| Jekyll | Lo legge come metadati; una pagina ha bisogno del blocco per essere elaborata affatto | `---` YAML | Variabili di pagina nei template, blocco sparito dall'output | Gratis, MIT |
| Hugo | Lo legge come metadati | `---` YAML, `+++` TOML, `{` e `}` JSON | Parametri di pagina, blocco sparito dall'output | Gratis, Apache 2.0 |
| Eleventy | Lo legge come metadati tramite gray-matter | `---` YAML, più un suffisso di linguaggio come `---json` | Voci della cascata di dati, blocco sparito dall'output | Gratis, MIT |
| MkDocs | Lo legge come metadati di pagina | `---` YAML | `page.meta` nei template, blocco sparito dall'output | Gratis, BSD |
| Docusaurus | Lo legge come metadati di pagina | `---` YAML | Posizione nella sidebar, slug e tag; blocco sparito | Gratis, MIT |
| Pandoc | Lo legge come metadati, con l'estensione attivata | `---` per aprire, `---` o `...` per chiudere | Variabili di template, e un blocco titolo con `--standalone` | Gratis, GPL |
| marked | Lo renderizza come contenuto | Nessuno | Un `<hr>` e un `<h2>` delle tue chiavi | Gratis, MIT |
| markdown-it | Lo renderizza come contenuto a meno di aggiungere un plugin | Nessuno integrato | Un `<hr>` e un `<h2>` delle tue chiavi | Gratis, MIT |
| remark con remark-frontmatter | Lo riconosce, non lo interpreta, lo elimina dall'HTML | `---` YAML, `+++` TOML, fence personalizzati | Un nodo `yaml` nell'albero e niente nell'HTML | Gratis, MIT |
| Python-Markdown con `meta` | Lo elimina e lo espone come stringhe | `---` iniziale opzionale, `---` o `...` finale, oppure una riga vuota | `md.Meta` come liste di stringhe | Gratis, BSD |
| gray-matter | Lo separa e lo interpreta per te | `---` di default, configurabile, suffissi di linguaggio | `data`, `content`, ed `excerpt` su richiesta | Gratis, MIT |
| GitHub | Lo trasforma in una tabella | `---` YAML | Una tabella a due righe sopra il tuo documento | Gratis |
| GitLab | Lo mostra com'è in un riquadro sopra il documento | `---` YAML, `+++` TOML, `;;;` JSON | Il blocco grezzo, visibile, in cima | Gratis |
| Anteprima di VS Code | Lo nasconde | `---` YAML | Niente; l'anteprima parte dalla tua prima intestazione | Gratis |
| Obsidian | Lo legge come proprietà e lo mostra nel proprio pannello | `---` YAML | Campi tipizzati, con `tags` e `aliases` riservati | Gratis |
| Un'espressione regolare tua | Lo elimina, di solito correttamente | Quello che dice il pattern | Una stringa più corta, e un caso limite in attesa | Gratis |

La lista di delimitatori di GitLab è la più ampia di ogni strumento qui: YAML con `---`, TOML con `+++`, JSON con `;;;`, e un identificatore di linguaggio aggiunto al delimitatore, come in `---php` (verificato su docs.gitlab.com, l'8 settembre 2026).

## I quattro destini, uno alla volta

### Eliminato: il blocco viene rimosso e dimenticato

Il comportamento più semplice, e il più comune dentro una build. Lo strumento trova il blocco, lo rimuove dal testo, e non fa altro. L'estensione `meta` di Python-Markdown è esplicita sull'ordine — la sua documentazione dice che tutti i metadati vengono eliminati dal documento prima di qualsiasi ulteriore elaborazione da parte di Markdown — e `remark-frontmatter` finisce nello stesso punto per l'output HTML, perché il nodo che aggiunge all'albero non ha nessun handler HTML e quindi non produce niente.

| Pro | Contro |
| --- | --- |
| L'output è il documento, senza nessun metadato che vi trapeli dentro | I metadati sono spariti, quindi un titolo deve arrivare da qualche altra parte |
| Niente da configurare una volta attivato | Silenzioso: una regola `---` in testa a un corpo viene eliminata con la stessa allegria |
| Funziona per qualunque chiave, YAML valido o no, nella versione grezza | Una versione a espressione regolare si rompe su un valore che contiene una riga di tre trattini |

**Per chi è.** Chiunque converta file usciti da un generatore e destinati a qualcosa che non ha bisogno dei metadati: un README trasformato in pagina, una cartella di documentazione renderizzata per una review, un insieme di note esportate per un cliente. Se ti serve solo la prosa, eliminare è la risposta giusta e la più economica da organizzare.

La separazione di `remark-frontmatter` vale la pena capirla se usi unified, perché è facile aspettarsi troppo dal plugin. Aggiunge un nodo di tipo `yaml` — o `toml` — che porta il testo grezzo come stringa, e il suo readme è chiaro sul fatto che non interpreta i dati al suo interno; è un compito separato per qualcosa come `vfile-matter`. Quindi installarlo ti compra l'eliminazione, non i metadati. È una divisione del lavoro sensata e una sorpresa per chiunque l'abbia installato sperando in `data.title`.

### Renderizzato: il convertitore è letterale, non rotto

Ogni libreria Markdown generica senza funzione per il front matter finisce qui, e così ogni convertitore costruito su una di esse il cui autore non ha mai preso una decisione sulle intestazioni. Ottieni l'`<hr>` e l'`<h2>`, e sembra che lo strumento abbia mangiato il tuo file.

| Pro | Contro |
| --- | --- |
| Fedele: niente nell'input viene eliminato in silenzio | I tuoi metadati appaiono nel documento, dove i lettori li leggono |
| Prevedibile una volta che conosci la regola | Sembra un difetto, quindi le persone lo segnalano come tale |
| Nessun plugin, e nessun dubbio su cosa sia stato scartato | La forma esatta dipende dalle righe vuote dentro il blocco |

**Per chi è.** Nessuno lo scelte deliberatamente, ed è comunque il comportamento predefinito corretto per una libreria. Un parser che indovinasse quali paragrafi fossero metadati sbaglierebbe da qualche parte, e l'errore sarebbe irrecuperabile, perché il testo sarebbe sparito. Renderizzare conserva l'informazione nel documento e lascia la decisione a chi chiama, che è dove appartiene. `marked` non ha nessuna opzione per il front matter, e il consiglio abituale è far passare prima la stringa attraverso `gray-matter`. Nemmeno `markdown-it` ha una regola per il front matter; i plugin per esso funzionano trovando il blocco e non renderizzando niente, passando il testo grezzo a una callback così puoi fare quello che vuoi.

La conseguenza pratica è che “il convertitore ha rovinato la mia intestazione” e “il convertitore non ha nessuna opinione sulle intestazioni” sono lo stesso evento. Se stai scegliendo tra strumenti, questa è una delle cose che [un confronto di funzioni non ti dirà](/blog/best-markdown-to-html-converters), e bastano un file e dieci secondi per scoprirlo.

### Trasformato in tabella: renderizzato, ma formattato

GitHub legge il blocco, lo riconosce, e lo renderizza come una tabella sopra il tuo documento — le chiavi nella riga di intestazione, i valori nell'unica riga sotto. È un accomodamento deliberato, e ha senso per un code host: GitHub Pages gira su Jekyll, quindi il front matter in un repository è di solito un metadato reale piuttosto che un incidente, e mostrarlo batte stamparlo come intestazione.

| Pro | Contro |
| --- | --- |
| Il blocco è riconoscibile come metadato, non confuso con la prosa | Un'intestazione con una dozzina di chiavi diventa una tabella larga una dozzina di colonne |
| Niente è nascosto a chi sfoglia il repository | Valori lunghi, liste e YAML annidato si leggono male in una cella di tabella |
| Coerente su ogni file `.md` renderizzato in un repository | Non puoi disattivarlo per un singolo file |

**Per chi è.** Per i lettori, non per le build. È la decisione giusta per un code host e irrilevante per una pipeline, ed è il motivo per cui un file può sembrare ordinato su GitHub e arrivare come una regola e un'intestazione nel tuo convertitore. GitLab fa una scelta simile e mostra il blocco com'è in un riquadro in cima al documento, che è lo stesso istinto con meno formattazione.

### Letto come metadati: il blocco fa qualcosa

Il destino per cui il blocco è stato inventato. Lo strumento interpreta il YAML, usa le chiavi, e le rimuove dal contenuto.

Jekyll l'ha iniziato: un file che comincia con il blocco viene elaborato, e un file che non lo ha viene copiato intatto, motivo per cui un blocco `---` vuoto è una cosa reale che le persone scrivono apposta. Hugo determina il formato dai delimitatori e trasforma le chiavi in parametri di pagina, con `title`, `date`, `draft`, `weight`, `description`, `slug` e `layout` tra quelli standard. MkDocs esporta il blocco come `page.meta`. Docusaurus usa `id`, `title`, `sidebar_position` e `slug`. Obsidian legge il blocco come proprietà tipizzate e le mostra in un pannello invece che nel corpo della nota, riservando `tags`, `aliases` e `cssclasses` al proprio comportamento.

Pandoc è quello interessante, perché è un convertitore piuttosto che un generatore e legge comunque il blocco. L'estensione si chiama `yaml_metadata_block`, e appartiene al dialetto Markdown proprio di Pandoc, quindi quando il formato di input è `commonmark` o `gfm` la nomini sul formato invece di presumerla:

```bash
pandoc -f gfm+yaml_metadata_block -t html --standalone notes.md -o notes.html
```

Tre dettagli dal manuale vale la pena portarsi dietro. Il delimitatore di apertura è una riga di tre trattini, e quello di chiusura può essere `---` o tre punti. Il blocco non deve stare in testa al file — può stare ovunque nel documento, a patto che una riga vuota lo preceda quando non è all'inizio. E `title`, `author`, `date` e `abstract` sono usati dai template predefiniti, mentre qualunque altra chiave diventa una variabile di template impostata automaticamente dai metadati, che è come le persone infilano una stringa di versione in un piè di pagina senza toccare il corpo del documento (verificato su pandoc.org, l'8 settembre 2026).

| Pro | Contro |
| --- | --- |
| I metadati fanno quello per cui sono stati scritti | Funziona solo quando entrambe le parti concordano sui nomi delle chiavi |
| Il corpo del documento resta pulito | Un YAML non valido diventa un fallimento della build invece di una stranezza |
| Un titolo nel file significa un titolo nell'output | Le chiavi sono per-strumento: `weight` non significa niente per Jekyll |

**Per chi è.** Chiunque il cui Markdown viva in un repository e sia costruito da qualcosa — un sito di documentazione, un blog, una cartella di runbook. Se i file sono la fonte di verità, il front matter è dove appartengono le parti di una pagina che non sono prosa, ed è gran parte di ciò che fa funzionare del tutto [la documentazione che vive nel repository](/blog/documentation-that-lives-in-the-repo).

Se vuoi l'interpretazione senza il generatore, `gray-matter` è la libreria che quasi tutto in JavaScript usa per questo. Restituisce `data` — il blocco interpretato come oggetto — `content`, che è l'input con il blocco rimosso, ed `excerpt` se lo chiedi. Gestisce front matter YAML, JSON e JavaScript pronti all'uso; TOML e CoffeeScript sono disponibili aggiungendo un motore. I delimitatori sono configurabili tramite un'opzione `delimiters`, e un linguaggio può essere nominato sul delimitatore di apertura come `---toml`. Ha licenza MIT. In Python, `python-frontmatter` riempie lo stesso ruolo sopra PyYAML.

```js
import matter from "gray-matter";
import { marked } from "marked";

const { data, content } = matter(raw);
const html = marked.parse(content);

// data.title is now yours to put in the <title> element.
```

Due righe, e il blocco passa dal secondo destino al quarto.

## TOML, JSON e i delimitatori su cui nessuno si è accordato

YAML con `---` è il predefinito ovunque, ma non è l'unica convenzione, e le alternative falliscono in modo diverso.

Il front matter TOML è delimitato da `+++`, che Hugo supporta da quando esiste. A differenza di `---`, `+++` non significa niente in Markdown, quindi un convertitore semplice non produce né una regola né un'intestazione. Produce un paragrafo di testo letterale:

```html
<p>+++
title = &quot;Notes&quot;
+++</p>
```

Questo è, si può discutere, migliore, perché è ovviamente sbagliato e nessuno lo scambia per un'intestazione reale, e si può discutere che sia peggiore, perché i tuoi metadati sono ora prosa visibile in testa a una pagina. In entrambi i casi, uno strumento che riconosce il front matter YAML non riconoscerà necessariamente il TOML: `gray-matter` ha bisogno di un motore aggiunto per esso, `remark-frontmatter` ha un preset TOML che devi richiedere, e il `yaml_metadata_block` di Pandoc è, come dice il nome, YAML.

Il front matter JSON è più strano, perché in Hugo non ci sono delimitatori affatto — il file inizia con `{` e l'oggetto finisce con `}`. Eleventy prende l'altra strada e ti lascia scrivere `---json` sul delimitatore di apertura, che è una funzione di gray-matter piuttosto che di Eleventy. Per un parser Markdown, un oggetto JSON non delimitato in testa a un file è un paragrafo di parentesi e virgolette, con escape delle entità e stampato. GitLab riconosce `;;;` per il JSON, che è una quarta convenzione per la stessa idea.

| Formato | Delimitatori | Riconosciuto da | Cosa ne fa un parser semplice |
| --- | --- | --- | --- |
| YAML | `---` a `---`, oppure `...` per chiudere in Pandoc | Tutto ciò che supporta il front matter | Un `<hr>` più un `<h2>` delle tue chiavi |
| TOML | `+++` a `+++` | Hugo, GitLab, remark con il preset TOML | Un paragrafo visibile di `+++` letterali e chiavi |
| JSON | `{` a `}`, senza fence | Hugo | Un paragrafo visibile di parentesi e virgolette |
| JSON | `---json` a `---` | Eleventy, e gray-matter sotto di esso | Un paragrafo visibile, o un'intestazione se il fence è nudo |
| JSON | `;;;` a `;;;` | GitLab | Un paragrafo visibile di punti e virgola e chiavi |

La lezione è ristretta e utile. YAML è l'unico formato con un supporto vicino all'universale, quindi a meno che uno strumento nella tua catena non richieda altro, scrivi YAML. I delimitatori esotici non comprano niente tranne un insieme più piccolo di strumenti che capiranno il file in due anni.

## La trappola: il delimitatore è anche una regola orizzontale

Tutto quanto sopra è una questione di sapere quale strumento hai in mano. Questa parte è un'ambiguità reale nella sintassi, e taglia in entrambe le direzioni.

`---` su una riga da sola ha tre significati in Markdown, decisi interamente dal contesto. Con del testo direttamente sopra, è una sottolineatura di intestazione setext. Con una riga vuota sopra, è un'interruzione tematica — un `<hr>`. E all'inizio esatto di un file, è quello che ogni parser di front matter sta cercando. Niente nella sintassi distingue il terzo caso dal secondo: la posizione è tutto il segnale.

Considera allora un documento che si apre con un divisore, cosa che le persone scrivono per motivi estetici più spesso di quanto ti aspetteresti:

```md
---

Notes from the incident review, 4 August.

---

## Timeline
```

Un parser di front matter legge il primo `---`, cerca il successivo, lo trova quattro righe più sotto, e prende tutto quello che c'è in mezzo come metadati. Cosa succede dopo dipende dallo strumento. Un'interpretazione YAML di `Notes from the incident review, 4 August.` riesce — YAML è felice di leggere una frase nuda come stringa — quindi niente si rompe; il parser semplicemente ottiene una stringa dove si aspettava un oggetto. Alcuni strumenti lo ignorano, alcuni lo registrano, e tutti restituiscono un contenuto con la tua riga iniziale rimossa. Il documento che ottieni indietro comincia da `## Timeline`, e nessun errore è stato segnalato da nessuna parte.

Fai in modo che quella prima riga sia qualcosa che YAML non ama e ottieni il fallimento opposto: una build che si ferma con un errore di parsing che punta a della prosa. Entrambi gli esiti vengono dalla stessa causa, che è che il delimitatore non è riservato a un solo compito.

L'altra direzione morde quando i file vengono combinati. Concatena diversi file che iniziano ognuno con un'intestazione, e solo il primo blocco è in posizione di front matter. Il resto finisce a metà documento, dove tre trattini significano regola e intestazione — motivo per cui [unire tanti file Markdown](/blog/merging-many-markdown-files) ha bisogno che i blocchi vengano rimossi mentre ogni file viene letto invece che sistemati dopo.

Dentro il blocco, gli stessi caratteri riservano un'altra sorpresa. L'estensione `meta` di Python-Markdown termina i metadati alla prima riga vuota o al primo delimitatore di chiusura, qualunque venga prima, quindi una riga vuota nel mezzo di un'intestazione lunga la tronca e le chiavi restanti diventano testo del corpo. Anche le librerie che renderizzano il blocco lo dividono alla riga vuota, come mostrato prima, solo in un paragrafo e un'intestazione invece che così.

Tre abitudini eliminano l'intera classe di problema:

- Scrivi le regole orizzontali come `***` o `___`, mai come `---`. Producono lo stesso identico `<hr>` e non possono essere confuse con un delimitatore o una sottolineatura di intestazione.
- Tieni il `---` di apertura sulla primissima riga del file, senza riga vuota e senza byte-order mark prima. La maggior parte dei parser richiede il delimitatore all'inizio della stringa e altrimenti conclude in silenzio che non c'è front matter.
- Non lasciare righe vuote dentro il blocco. YAML le permette, diversi lettori di front matter no, e gli strumenti che renderizzano il blocco cambiano forma a causa loro.

## Dove eliminarlo e andare avanti fallisce, e cosa costa

Eliminare è la risposta ovvia per la conversione, e di solito è quella giusta. Ecco cosa costa davvero, perché il costo non è mai sulla pagina di nessuno strumento.

**Il titolo se ne va con lui.** L'unico pezzo di metadato che ogni formato di output vuole è il titolo, ed eliminare lo cancella. Un file HTML senza `<title>` mostra il nome del file nella scheda del browser, cosa che qualcuno vede nella sua barra delle schede e nei suoi segnalibri. Un documento chiamato `final-v3.html` seduto in una scheda è una piccola indignità che una modifica di due righe evita: interpreta il blocco, tieni `title`, metti lo nella head. Lo stesso vale per la descrizione, che è ciò che un client di chat legge per costruire l'anteprima di un link.

**Le date smettono di essere date.** Una data YAML non è una stringa nella maggior parte dei parser. Un timestamp è un tipo YAML risolto piuttosto che testo, quindi dato `date: 2026-08-18`, js-yaml restituisce un `Date` di JavaScript e PyYAML restituisce un `datetime.date` (verificato su yaml.org, l'8 settembre 2026). È comodo finché non entra in gioco un fuso orario e un documento datato il 18 si renderizza come il 17 da qualche parte a ovest di te. Metti il valore tra virgolette quando vuoi i caratteri che hai digitato.

**I tipi YAML sono un pericolo di per sé.** Il caso classico è il problema della Norvegia. PyYAML è un parser YAML 1.1 completo, e YAML 1.1 definiva `y`, `yes`, `n`, `no`, `on` e `off` come booleani, quindi `country: NO` torna come `False` (PyYAML 6.0.3, verificato su pypi.org, l'8 settembre 2026). js-yaml ha smesso di convertire quelle parole in booleani e legge i numeri secondo le regole YAML 1.2, quindi le stesse parole tornano come stringhe (js-yaml 5.4.1, verificato su github.com/nodeca/js-yaml, l'8 settembre 2026). La stessa intestazione quindi significa cose diverse in una build Python e in una build Node, che è un bug genuinamente sgradevole quando un sito di documentazione viene costruito da una e controllato dall'altra. E `version: 1.10` è il numero 1.1 in entrambe, perché è un numero a virgola mobile — metti tra virgolette i numeri di versione o perdi lo zero finale.

**Un due punti in un titolo è un errore di parsing.** Questo è il difetto di front matter più comune che esista. `title: Release 2.1: what changed` non è YAML valido: il secondo due punti inizia una nuova mappatura, e il parser segnala un'indentazione sbagliata su una riga che sembra perfettamente a posto a una persona. La correzione sono le virgolette, e il motivo per saperlo in anticipo è che il messaggio d'errore non menziona mai il due punti.

**Le tabulazioni sono illegali.** YAML proibisce le tabulazioni nell'indentazione, quindi un editor configurato per inserirle rompe una lista annidata in un'intestazione con un errore sui caratteri di tabulazione, e niente nel file sembra sbagliato a schermo.

**Un'espressione regolare non è un parser.** Un'eliminazione fatta a mano — trova dal primo `---` al successivo `---` e scartalo — sono tre righe e funziona su quasi ogni file. Fallisce su un valore che contiene una riga di tre trattini, su un file la cui prima riga è una regola, e su un'intestazione chiusa con `...`. Quasi ogni file va bene; l'eccezione ti costa un documento con il primo paragrafo mancante e nessun errore a spiegare dove sia andato.

**E a volte i metadati erano il punto.** I file esportati da strumenti di appunti e conoscenza portano proprietà nell'intestazione — stato, proprietario, data di revisione, tag — e quelle sono spesso la parte che qualcuno voleva conservare. Eliminare il blocco butta via la metà strutturata dell'esportazione e conserva solo la prosa, il che è una perdita reale quando la struttura era il motivo della migrazione. Vale la pena controllarlo prima di uno spostamento in blocco fuori da [Notion, Obsidian o Confluence](/blog/markdown-from-notion-obsidian-and-confluence), perché quegli strumenti non sono d'accordo su se le proprietà escano come front matter, come semplici righe `chiave: valore` senza nessun delimitatore, o non escano affatto.

## Cosa controllare prima di consegnare il file

1. **Convertí un file reale e guarda l'inizio dell'output.** Dieci secondi di osservazione ti dicono con quale dei quattro destini hai a che fare, e nessun elenco di funzioni te lo dirà: una regola e un'intestazione significano che lo strumento renderizza, una prima intestazione pulita significa che elimina o legge, una tabella significa GitHub.
2. **Decidi se hai bisogno dei metadati prima di scegliere lo strumento.** Se un titolo, una data o una descrizione devono arrivare all'output, hai bisogno di uno strumento nella quarta categoria o di un passaggio di parsing tuo, e mettere `gray-matter` davanti a un renderer sono due righe — economico da aggiungere, costoso da scoprire di aver dimenticato dopo che le pagine sono pubblicate.
3. **Valida il YAML per conto suo, una volta.** Fai passare il blocco attraverso un parser YAML separatamente e cogli il due punti senza virgolette, la tabulazione, il booleano che era un codice paese e il numero di versione che ha perso lo zero. Saltalo e ognuno di questi arriva più tardi come un fallimento della build o, peggio, come un valore sbagliato che nessuno controlla.
4. **Cerca `---` nel documento prima di convertire o concatenare.** Ogni corrispondenza è una regola, una sottolineatura di intestazione o un delimitatore, e quale dei tre sia dipende interamente dalla riga sopra. Sostituire le regole intenzionali con `***` rimuove l'ambiguità in modo permanente, ed è un trova-e-sostituisci piuttosto che un progetto.
5. **Concorda i nomi delle chiavi con qualunque cosa le legga.** `weight` non significa niente per Jekyll, `layout` non significa niente per Docusaurus, `draft` non significa niente per un convertitore semplice, e una chiave non riconosciuta non è un errore — è silenzio. Una chiave che niente legge è un commento con passaggi in più, e una chiave scritta male che qualcosa legge è una pagina che si pubblica quando volevi che non lo facesse.

## Conclusione

Il front matter è una convenzione che ha superato la sua origine senza mai diventare parte del linguaggio, quindi il blocco in testa al tuo file non ha nessun significato definito e quattro destini possibili. I generatori lo leggono, Pandoc lo legge se richiesto, le librerie lo renderizzano perché renderizzare è il comportamento predefinito onesto per un testo che un parser non riconosce, e GitHub lo tabula per i lettori. Sapere quale si applica è la differenza tra una pagina che parte dalla tua prima intestazione e una pagina che parte da una riga orizzontale e un'intestazione piena di due punti. Per scoprire cosa diventa un file specifico, [convertilo e guarda l'inizio](/) — la risposta richiede meno tempo a ottenersi che a discuterne. Quando i metadati contano, separali con un parser prima che il renderer li veda, e scrivi le tue regole come `***` da ora in poi.

## FAQ

### Cos'è il front matter in un file Markdown?

È un blocco di metadati in testa al file, convenzionalmente YAML delimitato da righe di tre trattini, che contiene cose come il titolo, la data, i tag e il layout. È stato diffuso da Jekyll e copiato praticamente da ogni generatore di siti statici da allora. Non fa parte della sintassi Markdown, motivo per cui gli strumenti non sono d'accordo su di esso.

### Il front matter fa parte di CommonMark o di GitHub Flavored Markdown?

No. Nessuna delle due specifiche lo menziona, e nessuna riserva il delimitatore `---` per esso. Il supporto è un'estensione o una convenzione per-strumento, quindi un parser strettamente conforme ha ragione a renderizzare il blocco come un'interruzione tematica seguita da un'intestazione setext.

### Perché il mio HTML convertito inizia con una riga e un'intestazione piena di due punti?

Perché il convertitore non ha nessun supporto per il front matter e ha interpretato il blocco alla lettera. Il `---` di apertura è diventato un `<hr>`, le tue righe `chiave: valore` sono diventate un paragrafo, e il `---` di chiusura ha sottolineato quel paragrafo in un `<h2>`. Elimina il blocco prima di convertire, o usa uno strumento che lo riconosce.

### Come rimuovo il front matter prima di convertire un file?

In JavaScript, fai passare il testo attraverso `gray-matter` e dai il suo `content` al tuo renderer. In Python, usa `python-frontmatter`, oppure l'estensione `meta` di Python-Markdown, che elimina il blocco prima di qualsiasi altra elaborazione. Con Pandoc, attiva `yaml_metadata_block` così il blocco viene trattato come metadato invece che come contenuto.

### GitHub mostra il front matter YAML?

Sì, come una tabella sopra il documento, con le chiavi nella riga di intestazione e i valori nella riga sotto. È una scelta deliberata piuttosto che un incidente di rendering, e significa che un file può sembrare corretto su GitHub e uscire come una regola e un'intestazione in un convertitore senza supporto al front matter.

### Posso usare il front matter TOML o JSON invece di YAML?

Puoi, e restringi l'insieme di strumenti che capiranno il file. TOML è delimitato da `+++`, e JSON è o parentesi senza fence oppure un delimitatore di apertura `---json` secondo lo strumento; il supporto per entrambi è molto più irregolare di quello per YAML. Un parser Markdown semplice renderizza entrambi come un paragrafo visibile piuttosto che come una regola e un'intestazione.

### Una regola orizzontale in testa al mio documento verrà confusa con il front matter?

Può succedere. Un parser che cerca il front matter prende il primo `---` come delimitatore di apertura e tutto fino al `---` successivo come metadati, quindi un documento che si apre con una regola può perdere il suo primo paragrafo senza nessun errore segnalato da nessuna parte. Scrivi le regole come `***` e tieni l'ambiguità fuori dai tuoi file.
