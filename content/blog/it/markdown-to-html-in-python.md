---
title: "Da Markdown a HTML in Python"
description: "Python-Markdown, markdown2, mistune e markdown-it-py a confronto: le estensioni spente di default, la sanificazione con nh3 e uno script che blocca una build"
updated: 2026-09-09
date: 2026-07-07
tag: Codice
keywords: convertire markdown in html con python, libreria markdown python, python-markdown estensioni, markdown2 python, mistune renderer html, markdown-it-py commonmark, sanificare html con nh3, pymdown-extensions, pypandoc, generare html da markdown in python
---

`markdown.markdown(text)` è la prima riga che scrive quasi chiunque, e funziona. Poi una tabella finisce nel README, l'HTML torna con dei pipe seduti in un paragrafo, e la ricerca comincia. Python ha quattro librerie Markdown che vale la pena conoscere. Le differenze fra loro riguardano soprattutto cosa è acceso di default e quanto puoi cambiare l'output.

### In breve

Quattro librerie, e la scelta è più ristretta di quanto sembri. **Python-Markdown** è quella su cui è costruita la maggior parte degli strumenti Python, e non accende quasi niente: tabelle, code fence, note a piè di pagina e id sulle intestazioni sono tutte estensioni che devi nominare. **markdown2** è un unico modulo dove le stesse funzioni si chiamano extra e la grafia è diversa. **mistune** è quello da usare quando l'HTML deve uscire in una forma precisa, perché sottoclassi un renderer invece di far girare un'espressione regolare sulla stringa finita. **markdown-it-py** è quello da usare quando lo stesso documento deve rendere identico in un browser, perché è un port del markdown-it in JavaScript e segue la specifica CommonMark. Nessuna delle quattro sanifica, quindi qualunque tu scelga, nh3 va dopo.

L'attrito ha sempre la stessa forma. Uno script che funzionava su un README smette di funzionare la settimana in cui qualcuno aggiunge una tabella, o una nota, o un blocco con fence e un linguaggio indicato. Niente genera un errore. Il parser legge i caratteri pipe come testo ordinario, li avvolge in un paragrafo, e restituisce HTML perfettamente valido e visibilmente sbagliato. Il degrado silenzioso è il comportamento di default di ogni parser Markdown, perché non esiste un Markdown non valido: tutto quello che il parser non riconosce diventa prosa.

La seconda cosa che morde è che il lavoro della libreria finisce prima di quanto pensi. Tutte e quattro restituiscono un fragment: `<h1>Titolo</h1><p>Testo</p>` senza doctype, senza `<head>`, senza stili. Scritto in un file `.html` e apri, quello è Times New Roman nero che occupa tutta la larghezza della finestra. La libreria ha fatto il suo lavoro. Il resto — il contenitore, il foglio di stile, il sanificatore — è tuo, e questo articolo lo copre tutto.

## Le quattro librerie in breve

| Libreria | Installazione | Dialetto e specifica | Come si estende | Licenza | Il suo punto forte |
| --- | --- | --- | --- | --- | --- |
| Python-Markdown | `pip install markdown` | Sintassi Markdown originale di default; non conforme a CommonMark in ogni dettaglio | Estensioni nominate con un'API a entry-point, più grandi pacchetti di terze parti | Gratuita, BSD-3-Clause | Build di documentazione, e tutto quello che già usa MkDocs |
| markdown2 | `pip install markdown2` | Un dialetto proprio; non CommonMark | Un elenco di "extra" testuali passato a un'unica chiamata | Gratuita, MIT | Una chiamata, un elenco, nessun file di configurazione |
| mistune | `pip install mistune` | "Compatibile con regole CommonMark ragionevoli", nelle sue stesse parole | Plugin per nome, più classi renderer da sottoclassare | Gratuita, BSD-3-Clause | Cambiare l'HTML emesso senza post-elaborarlo |
| markdown-it-py | `pip install markdown-it-py` | Segue la specifica CommonMark per il parsing di base | Preset, regole nominate singolarmente, e mdit-py-plugins | Gratuita, MIT | Far corrispondere esattamente un front-end JavaScript |

Licenze e affermazioni sulla specifica verificate su pypi.org, python-markdown.github.io, mistune.lepture.com e markdown-it-py.readthedocs.io, il 9 settembre 2026. In quella tabella non ci sono numeri di velocità di proposito: ogni benchmark Markdown pubblicato misura un corpus diverso con un set di estensioni diverso, e il solo numero che conta è quello che ottieni dai tuoi documenti.

## Le quattro librerie in profondità

### Python-Markdown, e le estensioni che lascia spente

Python-Markdown — `pip install markdown`, importata come `markdown` — è la più vecchia delle quattro. Da sola implementa la sintassi Markdown originale e niente di più. Nessuna tabella. Nessun blocco di codice con fence. Nessuna nota a piè di pagina. Sono estensioni, e restano spente finché non le nomini.

```python
import markdown

html = markdown.markdown(
    text,
    extensions=["tables", "fenced_code", "toc", "sane_lists"],
    extension_configs={"toc": {"anchorlink": True}},
)
```

Le opzioni che la gente si perde sono quasi sempre queste:

| Cosa ti aspettavi | Estensione | Nota |
| --- | --- | --- |
| Tabelle in stile GitHub | `tables` | |
| Fence a tripli backtick | `fenced_code` | |
| Id e anchor sulle intestazioni | `toc` | riempie anche `md.toc` |
| Codice evidenziato | `codehilite` | richiede Pygments installato |
| Note a piè di pagina | `footnotes` | |
| Attributi `{: .note}` sugli elementi | `attr_list` | |
| Un singolo a capo che diventa un line break | `nl2br` | |

`extra` accende un gruppo intero — `abbr`, `attr_list`, `def_list`, `fenced_code`, `footnotes`, `md_in_html`, `tables` — e ti porta vicino a quello che probabilmente credevi di avere già (verificato su python-markdown.github.io, il 9 settembre 2026). Nota cosa manca ancora: `nl2br`, `codehilite`, `toc`, `smarty`, `sane_lists` e `meta`. `extra` è una comodità, non un superset, e le due cose che la gente pensa più spesso di avere incluse — gli id sulle intestazioni e il syntax highlighting — sono esattamente le due che lascia fuori.

L'elenco ufficiale completo è breve abbastanza da leggerlo una volta e smettere di indovinare:

| Estensione | Cosa fa | Da sapere |
| --- | --- | --- |
| `tables` | Tabelle a pipe in stile GFM | In `extra` |
| `fenced_code` | Fence a tripli backtick e a tilde | In `extra`; l'info string diventa una classe di linguaggio |
| `footnotes` | Riferimenti `[^1]` e un elenco di note | In `extra`; porta stato tra i documenti |
| `attr_list` | `{: .note #id }` dopo un elemento imposta classe, id e attributi | In `extra`; la sintassi è invisibile a ogni altro parser |
| `def_list` | Liste di definizioni | In `extra` |
| `abbr` | `*[HTML]: HyperText Markup Language` diventa `<abbr>` | In `extra` |
| `md_in_html` | Analizza Markdown dentro un blocco HTML grezzo marcato `markdown="1"` | In `extra`; è il motivo per cui un contenitore `<div>` non ti mangia più il testo |
| `codehilite` | Syntax highlighting via Pygments | Non in `extra`; richiede Pygments installato e un foglio di stile |
| `toc` | Id sulle intestazioni, un marcatore `[TOC]`, e `md.toc` | Non in `extra`; porta stato |
| `smarty` | Virgolette curve, trattini medi e lunghi, puntini di sospensione | Non in `extra`; cambia i caratteri, quindi confronta l'output |
| `meta` | Legge un blocco `chiave: valore` in testa nel file dentro `md.Meta` | Non in `extra`; non è un parser YAML |
| `nl2br` | Un singolo a capo diventa `<br>` | Non in `extra`; è il comportamento dei commenti GitHub |
| `sane_lists` | Parsing più rigido delle liste: una lista richiede una riga vuota prima | Non in `extra` |
| `admonition` | Blocchi `!!! note` | Non in `extra`; è la sintassi dei callout di MkDocs Material |
| `wikilinks` | `[[Pagina]]` diventa un link | Non in `extra` |
| `legacy_attrs`, `legacy_em` | Compatibilità con il comportamento pre-3.0 | Solo per documenti vecchi |

Quattro di queste meritano più di una riga di tabella.

**`codehilite`** non colora niente da sola. Passa il codice a Pygments, che emette elementi `<span>` con nomi di classe, e quei nomi non significano niente finché un foglio di stile non li definisce. La documentazione stessa dell'estensione dà il comando che ne produce uno — `pygmentize -S default -f html -a .codehilite > styles.css` — e le sue opzioni includono `linenums`, `guess_lang`, `css_class`, `pygments_style`, `noclasses` e `use_pygments` (verificato su python-markdown.github.io, il 9 settembre 2026). `noclasses=True` scrive i colori come attributi `style` inline invece che come classi, il che è più pesante e più brutto ed esattamente quello che vuoi se l'HTML deve sopravvivere a essere incollato in una email. `use_pygments=False` salta del tutto Pygments e lascia una classe di linguaggio sull'elemento `<code>` perché un highlighter lato client la raccolga più tardi — la scelta giusta se la pagina ne carica già uno. [Cosa serve davvero al syntax highlighting sulla pagina](/blog/code-blocks-in-markdown) è una storia più lunga di "aggiungi un fence".

**`toc`** fa due lavori e la gente di solito vuole il secondo. Sostituisce un marcatore `[TOC]` nella fonte con una lista annidata, e mette un `id` su ogni intestazione. Le sue opzioni includono `anchorlink`, `permalink`, `baselevel`, `separator`, `slugify` e `toc_depth`, e dopo una conversione l'istanza porta sia `md.toc`, l'indice come stringa HTML, sia `md.toc_tokens`, la stessa cosa come dizionari annidati (verificato su python-markdown.github.io, il 9 settembre 2026). `md.toc` è disponibile che il marcatore sia apparso nel documento o no, il che è quello che permette a un template di metterlo in una barra laterale invece che in testa al testo. `baselevel` conta quando il template renderizza già un `<h1>`: impostalo a 2 e le intestazioni `#` del documento escono come `<h2>` invece di litigare con la pagina.

**`meta`** sembra supporto per il front matter e non lo è. Legge un blocco di righe `chiave: valore` in testa al file dentro `md.Meta`, tollera i delimitatori `---`, e la sua documentazione è esplicita sul fatto che il contenuto non viene analizzato come YAML. Ogni valore arriva come una lista di stringhe, una voce per riga, quindi `md.Meta["title"][0]` è il titolo e `md.Meta["title"]` è una lista di uno (verificato su python-markdown.github.io, il 9 settembre 2026). Se i tuoi file portano vero YAML — chiavi annidate, liste, booleani, date — leggi l'intestazione con `python-frontmatter` o `yaml.safe_load` prima che il testo arrivi al parser.

**`attr_list`** è quella che ti costa portabilità. `{: .warning }` dopo un paragrafo è una convenzione di Python-Markdown; su GitHub, in una preview del browser, o in ognuna delle altre tre librerie qui, sono cinque caratteri letterali alla fine della tua frase.

Per più di un documento, costruisci il convertitore una volta con `markdown.Markdown(extensions=[...])` e chiama `.reset()` tra un file e l'altro. Note e indice portano stato, quindi senza il reset la seconda pagina eredita le note della prima. La documentazione dice la stessa cosa con altre parole: il parser potrebbe aver bisogno che il suo stato venga azzerato tra una chiamata a `convert` e l'altra (verificato su python-markdown.github.io, il 9 settembre 2026). Il corollario conta per la sezione sulla concorrenza più avanti — un'istanza `Markdown` è un oggetto con stato, quindi appartiene a un worker, non a un pool.

Due manopole più piccole, entrambe documentate nel riferimento della libreria (verificato su python-markdown.github.io, il 9 settembre 2026). `output_format` accetta `"xhtml"` o `"html"`, e decide se un a capo esce come `<br />` o come `<br>`; il default è `"xhtml"`, il che sorprende chi scrive HTML5. E `tab_length` ha default 4 — se i tuoi documenti indentano le liste annidate con due spazi, questo è il motivo per cui l'annidamento collassa.

**pymdown-extensions** è quello che quasi tutti installano davvero sopra. È un pacchetto con licenza MIT sotto il namespace `pymdownx`, e porta Arithmatex, B64, BetterEm, Blocks, Caret, Critic, Details, Emoji, EscapeAll, Extra, FancyLists, Highlight, InlineHilite, Keys, MagicLink, Mark, PathConverter, ProgressBar, Quotes, SaneHeaders, SmartSymbols, Snippets, StripHTML, SuperFences, Tabbed, Tasklist e Tilde (verificato su facelessuser.github.io, il 9 settembre 2026). Tre di questi fanno la maggior parte del lavoro: `pymdownx.superfences` sostituisce `fenced_code` e permette ai fence di annidarsi dentro elementi di lista e admonition, `pymdownx.highlight` centralizza la configurazione di Pygments che `codehilite` altrimenti terrebbe per sé, e `pymdownx.tasklist` ti dà la sintassi delle checkbox in stile GitHub per cui Python-Markdown non ha un'estensione ufficiale. Se ti sei mai chiesto perché un sito MkDocs Material riesce a fare contenuto a tab e il tuo script no, questo pacchetto è la risposta.

**Per chi è.** Script di build Python, e chiunque abbia già una documentazione che passa per MkDocs, dove Python-Markdown è il motore e l'elenco di estensioni è un file di configurazione che stai già modificando comunque.

### markdown2 e i suoi extra

markdown2 è un unico modulo con la stessa forma e un vocabolario diverso: le funzioni sono *extra*, e sono spente di default anche loro.

```python
import markdown2

html = markdown2.markdown(
    text,
    extras=["tables", "fenced-code-blocks", "strike", "header-ids", "footnotes"],
)
```

Ci sono più extra di quanti chiunque ricordi, quindi aiuta vederli raggruppati per cosa servono (nomi verificati su github.com, il 9 settembre 2026):

| Cosa vuoi | Extra |
| --- | --- |
| Le funzioni GFM che davi per scontate | `tables`, `fenced-code-blocks`, `strike`, `task_list`, `header-ids`, `footnotes` |
| Metadati e struttura | `metadata`, `toc`, `numbering`, `cuddled-lists`, `breaks` |
| Codice e matematica | `code-friendly`, `highlightjs-lang`, `pyshell`, `latex`, `wavedrom`, `mermaid` |
| Tipografia | `smarty-pants`, `middle-word-em`, `tag-friendly` |
| Link e forma dell'output | `link-patterns`, `nofollow`, `target-blank-links`, `html-classes`, `xml` |
| Interoperabilità con HTML | `markdown-in-html`, `wiki-tables`, `spoiler`, `tg-spoiler`, `admonitions` |

Tre di questi meritano di essere isolati. `code-friendly` disattiva `_` e `__` come marcatori di enfasi, il che è la correzione per un documento pieno di `some_variable_name` che a metà comincia a diventare corsivo. `link-patterns` prende un elenco di coppie espressione regolare/sostituzione e trasforma in link automaticamente qualunque cosa corrisponda — `#1234` in un URL di issue, `CVE-2026-…` in un avviso — una funzione che nessuna delle altre tre librerie qui offre in una riga. E `header-ids` è il nome che markdown2 dà a quello che Python-Markdown chiama `toc`; se cambi libreria e i tuoi anchor si rompono, questo è il motivo.

Il compromesso è meno parti in movimento contro un ecosistema più piccolo: se ti serve qualcosa che nessuna delle due librerie offre, Python-Markdown ha un'API di estensione documentata ed estensioni di terze parti a cui ricorrere.

Attenzione alla grafia. Le due librerie chiamano la stessa funzione in modo diverso — `fenced_code` contro `fenced-code-blocks` — quindi tieni l'elenco in una sola costante piuttosto che riscriverlo a ogni chiamata. Confondere i due è il motivo abituale per cui una pagina renderizza una tabella e un'altra stampa pipe.

**Per chi è.** Uno script che ha bisogno di un import, una chiamata e un elenco di stringhe, senza registro delle estensioni, senza oggetto di configurazione e senza un secondo pacchetto. markdown2 ha licenza MIT (verificato su pypi.org, il 9 settembre 2026).

### mistune, quando vuoi cambiare l'output

mistune è un parser Markdown scritto in puro Python, costruito attorno a plugin e renderer. `mistune.html(text)` è la chiamata di comodo; `create_markdown` è dove vivono le decisioni.

```python
import mistune

render = mistune.create_markdown(
    escape=True,
    plugins=["table", "strikethrough", "task_lists", "url"],
)
html = render(text)
```

`escape=True` mette in escape l'HTML grezzo nella fonte invece di lasciarlo passare, il che è quello che vuoi quando il Markdown viene da qualcun altro. Passa `escape=False` quando la fonte è tua e contiene HTML deliberato.

I plugin che vengono con la libreria sono `strikethrough`, `footnotes`, `table`, `url`, `task_lists`, `def_list`, `abbr`, `mark`, `insert`, `superscript`, `subscript`, `math`, `ruby` e `spoiler` (verificato su mistune.lepture.com, il 9 settembre 2026). Passali come stringhe, oppure importa le funzioni e passa quelle — la forma testuale è una ricerca dentro `mistune.plugins`.

Il vero motivo per ricorrere a mistune è il renderer. Sottoclassa `HTMLRenderer`, sovrascrivi il metodo per un tipo di nodo, e le immagini o i link escono nella forma che vuoi — con `loading="lazy"`, per esempio — senza far girare nessuna espressione regolare sulla stringa finita.

```python
from html import escape

import mistune
from mistune import HTMLRenderer


class DocRenderer(HTMLRenderer):
    def image(self, alt, url, title=None):
        attrs = f' title="{escape(title, quote=True)}"' if title else ""
        return (
            f'<img src="{escape(url, quote=True)}" alt="{escape(alt, quote=True)}"'
            f'{attrs} loading="lazy" decoding="async">'
        )

    def heading(self, text, level, **attrs):
        slug = attrs.get("id") or text.lower().replace(" ", "-")
        return f'<h{level} id="doc-{slug}">{text}</h{level}>'


render = mistune.create_markdown(renderer=DocRenderer(), plugins=["table", "footnotes"])
```

I nomi dei metodi sono i tipi di nodo, e le firme sono documentate: `link(self, text, url, title=None)`, `image(self, alt, url, title=None)`, `heading(self, text, level, **attrs)`, `block_code(self, code, info=None)`, `paragraph(self, text)`, `list(self, text, ordered, **attrs)`, `codespan(self, text)`, `inline_html(self, html)` e il resto (verificato su mistune.lepture.com, il 9 settembre 2026). I plugin aggiungono i loro: `strikethrough(self, text)`, `table_cell(self, text, align=None, head=False)`.

Quella distinzione — sovrascrivere il renderer invece di rattoppare la stringa — è tutto l'argomento a favore di mistune, e vale la pena essere concreti sul perché conti. Post-elaborare HTML con un'espressione regolare funziona finché non appare un `<img>` dentro un blocco di codice, o un valore di attributo contiene il carattere su cui stavi facendo il match, o qualcuno scrive `<img>` in una frase a proposito di HTML. Il renderer lavora su nodi già analizzati, quindi un fence di codice che contiene il testo `<img src=x>` non arriva mai a `image()`; arriva a `block_code()`, come testo. Non c'è un caso in cui i due approcci non siano d'accordo a tuo favore.

`block_code(self, code, info=None)` è l'hook per il syntax highlighting: `info` è la stringa dopo i backtick di apertura, quindi ottieni il nome del linguaggio e puoi passare il corpo a Pygments per conto tuo, con i tuoi nomi di classe, senza un'estensione in mezzo. mistune porta anche `RSTRenderer` e `MarkdownRenderer` insieme a `HTMLRenderer`, il che è come lo usi per normalizzare Markdown piuttosto che per lasciare Markdown del tutto.

**Per chi è.** Chiunque il cui output debba rispettare un vincolo che la libreria non conosce — una content security policy che vieta gli stili inline, una pipeline di immagini che riscrive `src`, un design system le cui tabelle hanno bisogno di un `<div>` contenitore per lo scroll orizzontale. mistune ha licenza BSD-3-Clause (verificato su pypi.org, il 9 settembre 2026).

### markdown-it-py, e perché conta la conformità a CommonMark

Quando il requisito è "corrisponde alla specifica", markdown-it-py è la risposta diretta. È un port Python del markdown-it in JavaScript e segue CommonMark da vicino. I preset scelgono un punto di partenza e le regole si attivano per nome.

```python
from markdown_it import MarkdownIt

md = MarkdownIt("commonmark")
md.enable(["table", "strikethrough"])
html = md.render(text)
```

I preset sono il modo più rapido per dire cosa vuoi (verificato su markdown-it-py.readthedocs.io, il 9 settembre 2026):

| Preset | Cosa ottieni |
| --- | --- |
| `zero` | Paragrafi e testo, nient'altro — un punto di partenza da costruire regola per regola |
| `commonmark` | CommonMark rigoroso: fence di codice, nessuna tabella, nessun strikethrough, nessun autolink |
| `js-default` | HTML grezzo disattivato, tabelle e strikethrough attivi |
| `gfm-like` | Tabelle, strikethrough e linkify — richiede il pacchetto `linkify-it-py` |
| `gfm-like2` | `gfm-like` più liste di task, alert in stile GitHub e strikethrough a singola tilde; richiede anch'esso `linkify-it-py` |

Le regole si attivano e disattivano per nome a livello core, block e inline, in modo permanente tramite `enable()` e `disable()` o in modo temporaneo tramite un context manager. Quel livello di granularità è insolito e a volte è esattamente il punto: se la tua piattaforma non deve mai renderizzare immagini, `md.disable("image")` è una garanzia a livello di parser, non un filtro applicato dopo.

`mdit-py-plugins` è il pacchetto compagno — `pip install mdit-py-plugins`, insieme a `pip install markdown-it-py[linkify]` se vuoi i preset linkify — e porta le estensioni di sintassi che non sono nella specifica: front matter, note a piè di pagina, liste di definizioni, contenitori, anchor, liste di task. Si applicano con `md.use(plugin)`:

```python
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin
from mdit_py_plugins.footnote import footnote_plugin

md = MarkdownIt("gfm-like").use(front_matter_plugin).use(footnote_plugin)
html = md.render(text)
```

Ora il motivo per cui la conformità conta, detto chiaramente. Un documento Markdown renderizzato due volte — una volta dal tuo backend Python per la copia inviata per email, una volta da JavaScript nel browser per la preview live — deve uscire uguale, e "uguale" non è mai una cosa che due parser scritti indipendentemente sono per natura. Link in stile reference, continuazione pigra di una blockquote, quanti backtick chiudono un fence, se una lista è loose o tight, cosa fa un underscore dentro una parola: sono esattamente i casi in cui le implementazioni divergono, e ognuno di essi è fissato dalla specifica CommonMark e dalla sua suite di test. Due parser che passano entrambi quella suite sono d'accordo. Due parser che non la passano entrambi sono d'accordo finché chi scrive non fa qualcosa di leggermente inusuale, e allora la preview e il file esportato litigano — che è il bug che richiede un giorno per essere trovato, perché il documento appare a posto nello strumento con cui lo stai guardando.

markdown-it-py è un port del markdown-it in JavaScript, quindi i due condividono non solo una specifica ma una discendenza di implementazione e un vocabolario di plugin. È quanto più vicino a una garanzia di accordo tu possa avere. Quale dialetto stai puntando conta più di quale libreria scegli; [CommonMark, GFM e i dialetti](/blog/commonmark-gfm-and-the-flavours) mette in chiaro le differenze, e le stesse librerie hanno controparti trattate in [generare HTML da Markdown in JavaScript](/blog/markdown-to-html-in-javascript).

**Per chi è.** Qualunque cosa abbia un browser dall'altra parte, qualunque cosa in cui una differenza di rendering è un ticket di assistenza, e chiunque preferisca leggere una specifica piuttosto che un changelog. Ha licenza MIT (verificato su pypi.org, il 9 settembre 2026).

## Sanificare l'HTML, e il solo ordine che funziona

Nessuna delle quattro è un sanificatore. Markdown permette HTML grezzo per design, quindi un tag `<script>` nella fonte è un tag `<script>` nell'output a meno che qualcosa non lo metta in escape o lo rimuova. Python-Markdown lo dice con le sue stesse parole: la libreria non sanifica il suo output HTML, e se l'input viene da una fonte non fidata, sanificarlo è tua responsabilità (verificato su python-markdown.github.io, il 9 settembre 2026).

bleach è stata la risposta standard per anni, e vale la pena controllarne lo stato piuttosto che ripetere l'ultima cosa sentita. La sua stessa pagina su PyPI dichiara ora che bleach non è più mantenuta e che non ci saranno futuri rilasci, nemmeno per problemi di sicurezza; l'ultimo rilascio è stato 6.4.0 il 5 giugno 2026, sotto Apache 2.0 (verificato su pypi.org, il 9 settembre 2026). Un sanificatore non mantenuto è una posizione peggiore di nessun sanificatore, perché in una code review sembra protezione.

La risposta attuale è nh3, un binding Python con licenza MIT ad ammonia, il sanificatore HTML scritto in Rust (verificato su pypi.org, il 9 settembre 2026). È un'unica funzione sopra un parser molto testato, e fallisce in modo chiuso: qualunque cosa non sia nell'allow-list viene rimossa.

```python
import nh3

safe = nh3.clean(
    html,
    tags={"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "table",
          "thead", "tbody", "tr", "th", "td", "em", "strong", "blockquote", "hr",
          "img", "sup", "sub", "del"},
    attributes={
        "a": {"href", "title"},
        "img": {"src", "alt", "title", "loading"},
        "code": {"class"},
        "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"},
    },
    url_schemes={"http", "https", "mailto"},
    id_prefix="doc-",
    link_rel="noopener noreferrer nofollow",
)
```

Ogni argomento lì fa qualcosa di specifico, e i nomi delle keyword sono quelli della libreria stessa (verificato su nh3.readthedocs.io, il 9 settembre 2026):

| Argomento | Cosa decide |
| --- | --- |
| `tags` | L'allow-list degli elementi. Omettilo e ottieni il set di default di ammonia |
| `attributes` | Quali attributi sopravvivono, per tag. `"*"` come chiave si applica a ogni tag. Il set di default non include `id` |
| `url_schemes` | Con cosa possono iniziare `href` e `src`. È qui che muore `javascript:` |
| `id_prefix` | Antepone una stringa a ogni `id` permesso, che è la correzione per il DOM clobbering |
| `link_rel` | Il valore `rel` aggiunto ai link; default `noopener noreferrer` |
| `clean_content_tags` | Tag di cui viene rimosso anche il *contenuto* — il trattamento giusto per `script` e `style` |
| `strip_comments` | Attivo di default, così i trucchi con i commenti condizionali non sopravvivono |
| `attribute_filter` | Una callback che può riscrivere un valore invece di eliminare l'attributo |

`clean_content_tags` è quella che la gente si perde. Rimuovere un tag `<script>` mantenendone il testo lascia il JavaScript seduto nel documento come prosa visibile, il che è innocuo e sembra un bug. Rimuovere il tag e il suo contenuto è quello che intendevi.

Ora l'ordine, perché è la parte che si fa al contrario. Sanifica dopo il rendering, mai prima. Filtrare la fonte Markdown è una scommessa, perché è il parser a decidere quali caratteri diventano un tag: un `<` dentro un fence di codice è testo, lo stesso `<` in un paragrafo apre un elemento, e uno schema con percent-encoding in una destinazione di link viene decodificato dal parser e non dalla tua espressione regolare. Qualunque filtro che lavora sulla fonte deve reimplementare il parser per sapere quale sia quale, e se potesse farlo sarebbe il parser. Renderizza prima, poi pulisci l'HTML — quello è il solo stadio in cui la stringa che stai ispezionando è la stringa che il browser riceverà. [Sanificare Markdown in modo sicuro](/blog/sanitising-markdown-safely) esamina i casi di guasto in dettaglio.

C'è un'eccezione legittima, e non è davvero un'eccezione: rifiutare l'HTML grezzo al momento del parsing. `mistune.create_markdown(escape=True)` e `MarkdownIt("commonmark")` con l'HTML disattivato significano entrambi che il parser non emette mai un tag grezzo, punto. È una garanzia più forte che sanificare, e ti è disponibile solo perché avviene dentro il parser piuttosto che davanti a lui. Usala quando la fonte non è fidata e non ti serve nessun HTML che passi. Usa nh3 quando ne serve un po'.

TransformPipe è costruito nello stesso modo: marked renderizza, poi DOMPurify nel browser e il pacchetto `xss` sul server puliscono il risultato contro un'unica allow-list condivisa, così entrambi i lati producono lo stesso documento. I suoi id sulle intestazioni portano un prefisso `doc-`, il che li tiene fuori dal territorio del DOM clobbering — lo stesso lavoro che fa `id_prefix` qui sopra.

## Trasformare un fragment in una pagina

Tutte e quattro le librerie restituiscono un fragment, e un fragment non è un documento. Devono succedere tre cose prima che chiunque altro possa aprire il file: un contenitore, degli stili, e una decisione su cosa il file può chiedere alla rete.

Il contenitore è un template, e Jinja2 è la scelta ovvia perché è già dentro la maggior parte dei progetti Python:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title }}</title>
    <style>{{ css }}</style>
  </head>
  <body>
    <main>{{ body|safe }}</main>
  </body>
</html>
```

```python
from jinja2 import Environment, FileSystemLoader, select_autoescape

env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
)
page = env.get_template("page.html").render(title=title, body=safe_html, css=css)
```

Due trappole in sei righe. La prima è `|safe`. Con l'autoescape attivo — e dovrebbe esserlo — `{{ body }}` renderizza il tuo HTML come testo letterale, e ottieni una pagina che mostra `<p>Hello</p>` come parole. `|safe` è quello che dice "questa stringa è già HTML". La seconda segue immediatamente: `|safe` è una promessa che stai facendo, quindi la sola stringa che marchi come sicura è una che è già passata per nh3. Sanifica, poi marca come sicura, in quest'ordine. Un template che marca come sicuro l'output non sanificato del parser ha silenziosamente reintrodotto ogni problema che la sezione precedente aveva risolto.

Gli stili sono la parte che la gente salta e poi rimpiange. Un foglio di stile in un tag `<link>` rende il file HTML dipendente da un secondo file; sposta uno e non l'altro e la pagina resta senza stili. Un foglio di stile da un CDN rende il file dipendente da una rete, e dice a chiunque lo apra qualcosa su dove il file è passato. Leggere il CSS dal disco e passarlo in `{{ css }}` lo incorpora, il che è più pesante e si comporta uguale ovunque:

```python
from pathlib import Path

css = Path("assets/page.css").read_text(encoding="utf-8")
if use_pygments:
    css += Path("assets/pygments.css").read_text(encoding="utf-8")
```

Quella seconda riga è il motivo per cui `codehilite` non è finito quando emette classi — il foglio di stile di Pygments deve viaggiare con la pagina o l'evidenziazione è invisibile.

Le immagini sono l'ultima dipendenza. `<img src="diagram.png">` in un file autonomo è un'immagine rotta sul computer di qualcun altro. Oppure spedisci la cartella, oppure leggi i byte e li incorpori come URI `data:`, il che è quello di cui ha bisogno un file davvero autonomo:

```python
import base64, mimetypes
from pathlib import Path


def inline(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"
```

Il test per sapere se hai finito è semplice e richiede un minuto: copia il file `.html` su un'altra macchina, spegni la rete, e aprilo. Qualunque cosa sembri sbagliata è una dipendenza che non avevi notato di avere.

## Uno script che converte una cartella

Metti insieme i pezzi e un'intera cartella sono circa quindici righe.

```python
from pathlib import Path
import markdown, nh3

TEMPLATE = "<!doctype html><meta charset=utf-8><title>{title}</title>{body}"

md = markdown.Markdown(extensions=["tables", "fenced_code", "toc"])
src, out = Path("docs"), Path("build")

for path in sorted(src.rglob("*.md")):
    body = nh3.clean(md.convert(path.read_text(encoding="utf-8")))
    md.reset()
    target = out / path.relative_to(src).with_suffix(".html")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(TEMPLATE.format(title=path.stem, body=body), encoding="utf-8")
    print(f"{path} -> {target}")
```

Tre dettagli fanno il lavoro. `encoding="utf-8"` sia in lettura che in scrittura, perché la codifica di default della piattaforma non è UTF-8 ovunque e una lineetta lunga basta per rompere il job. `sorted()`, così l'ordine di build è lo stesso su ogni macchina. `md.reset()` dentro il ciclo, per il motivo di sopra.

Una trappola in cui lo script sopra cade: `nh3.clean` senza argomenti usa l'allow-list di default di ammonia, e `id` non ci è dentro, quindi gli anchor delle intestazioni che `toc` ha appena aggiunto vengono rimossi di nuovo subito. Permetti l'attributo per tag — `attributes={"h1": {"id"}, "h2": {"id"}}` — e imposta `id_prefix="doc-"`, perché un `id` nudo su un'intestazione può fare da ombra a una proprietà del DOM con lo stesso nome.

Quindici righe sono la demo. Quello in cui cresce una volta che gira su una pianificazione è uno script che salta il lavoro già fatto, converte i file in parallelo, e avvisa un job di CI quando qualcosa va storto. Sono tre aggiunte, e ognuna vale la pena capirla piuttosto che copiarla.

```python
#!/usr/bin/env python3
"""Convert docs/**/*.md to build/**/*.html. Exit non-zero if any file fails."""
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import markdown
import nh3
from jinja2 import Environment, FileSystemLoader, select_autoescape

SRC, OUT = Path("docs"), Path("build")
PAGE = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
).get_template("page.html")
EXTENSIONS = ["tables", "fenced_code", "footnotes", "attr_list", "toc", "sane_lists"]
TAGS = {"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "em",
        "strong", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td"}
ATTRS = {"a": {"href", "title"}, "code": {"class"},
         "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"}}


def convert(path: Path) -> tuple[Path, str | None]:
    target = OUT / path.relative_to(SRC).with_suffix(".html")

    if target.exists() and target.stat().st_mtime >= path.stat().st_mtime:
        return path, None

    try:
        md = markdown.Markdown(extensions=EXTENSIONS)
        body = nh3.clean(
            md.convert(path.read_text(encoding="utf-8")),
            tags=TAGS, attributes=ATTRS, id_prefix="doc-",
            url_schemes={"http", "https", "mailto"},
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(PAGE.render(title=path.stem, body=body, toc=md.toc),
                          encoding="utf-8")
    except Exception as error:                      # noqa: BLE001 - report, do not stop
        return path, f"{type(error).__name__}: {error}"

    return path, None


def main() -> int:
    paths = sorted(SRC.rglob("*.md"))

    with ProcessPoolExecutor() as pool:
        results = list(pool.map(convert, paths))

    failures = [(path, error) for path, error in results if error]

    for path, error in failures:
        print(f"{path}: {error}", file=sys.stderr)

    print(f"{len(paths) - len(failures)} of {len(paths)} converted", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
```

**`pathlib` invece di `os.path`.** `rglob("*.md")` percorre l'albero, `relative_to` dà la parte del percorso da rispecchiare nella cartella di output, `with_suffix(".html")` la rinomina, e `mkdir(parents=True, exist_ok=True)` crea tutto quello che manca. Il calcolo del percorso intero è un'unica espressione, ed è la stessa espressione su Windows e su Linux — cosa che conta, perché uno script che unisce i percorsi con `"/"` produce un output che nessuno nota essere sbagliato finché non gira su una macchina di build.

**Saltare per mtime.** `target.stat().st_mtime >= path.stat().st_mtime` è il controllo di freschezza più economico e utile che esista, ed è esattamente quello che fa `make`. Ha due modalità di guasto conosciute e dovresti conoscerle entrambe. Un cambiamento al template o all'elenco di estensioni non cambia l'mtime di nessun file sorgente, quindi gli output non si ricostruiscono — la correzione è confrontare anche con l'mtime del template, o tenere un hash della configurazione a fianco dell'output. E un checkout non è una copia: alcuni sistemi di CI danno a ogni file l'ora del checkout, il che fa sembrare tutto nuovo e ricostruisce tutto. È lento piuttosto che sbagliato, che è il verso giusto in cui una cache può fallire.

**Una map concorrente.** `pool.map` su un `ProcessPoolExecutor` mantiene la forma del ciclo e usa ogni core. Processi piuttosto che thread, perché analizzare Markdown è puro Python e il global interpreter lock di CPython significa che i thread non sovrapporranno il lavoro; il costo è che argomenti e valori di ritorno vengono serializzati con pickle, motivo per cui `convert` restituisce una piccola tupla piuttosto che l'HTML. Costruisce anche una propria istanza `Markdown` per chiamata — l'istanza ha stato, che è lo stesso motivo per cui esiste `.reset()`, e condividerne una tra i worker è come ottieni una nota a piè di pagina di una pagina che appare in fondo a un'altra.

**Un exit code.** `return 1 if failures else 0` è quello che rende questo uno step di build piuttosto che uno script che qualcuno lancia. `raise SystemExit(main())` lo propaga. Gli errori vanno su stderr e il processo continua a convertire gli altri file, quindi un documento rotto ti dà un messaggio di errore e un rapporto completo piuttosto che uno stack trace e nessuna idea di quanti altri fossero coinvolti. In un job di GitHub Actions, un exit code diverso da zero fa fallire lo step, e il log contiene già l'elenco dei file rotti. [Convertire molti file in una volta](/blog/batch-convert-markdown-files) copre le varianti — output piatto, un unico documento fuso, osservare i cambiamenti.

## pypandoc, e quando ha senso chiamare Pandoc dall'esterno

Nessuna delle quattro librerie sopra legge niente tranne Markdown, e nessuna scrive niente tranne HTML. Nel momento in cui la descrizione del lavoro contiene un secondo formato — un documento Word che deve prima diventare Markdown, un PDF alla fine, un manoscritto LaTeX, un EPUB — la risposta onesta è smettere di scrivere una pipeline di parser e chiamare Pandoc.

pypandoc è il wrapper sottile. Ha licenza MIT, richiede Pandoc stesso, e viene in due versioni: `pypandoc`, che si aspetta Pandoc già sul sistema, e `pypandoc_binary`, che lo include. C'è anche `download_pandoc()` per scaricarlo a runtime (verificato su pypi.org, il 9 settembre 2026).

```python
import pypandoc

html = pypandoc.convert_text(
    text, to="html5", format="gfm",
    extra_args=["--standalone", "--embed-resources", "--toc"],
)

pypandoc.convert_file("docs/report.md", to="pdf", outputfile="report.pdf")
```

`convert_text` richiede che il formato di input sia nominato esplicitamente; `convert_file` lo deduce dall'estensione. Entrambe accettano `extra_args` per i flag propri di Pandoc e `filters` per i suoi programmi filtro. I tre flag sopra sono quelli che trasformano un fragment in un file che qualcun altro può aprire: `--standalone` produce un output con un'intestazione e un piè di pagina piuttosto che un fragment, `--embed-resources` incorpora script, foglio di stile e immagini collegati come URI `data:`, e `--toc` genera un indice (verificato su pandoc.org, il 9 settembre 2026).

Usalo quando la pipeline è più ampia di Markdown-a-HTML. Non usarlo quando non lo è, ed è bene essere chiari su cosa ti stai portando dietro: un binario esterno in ogni ambiente dove il codice gira, una versione di quel binario che devi fissare perché l'output cambia tra rilasci, un subprocess per documento con il costo di avvio che implica, e un convertitore che lascia passare l'HTML grezzo senza toccarlo — Pandoc non è un sanificatore nemmeno lui. Contro tutto questo, gestisce i template, incorpora gli asset, legge e scrive formati che nessun altro tocca, e durerà più a lungo del tuo script. [Le alternative, e quando ognuna è lo strumento migliore](/blog/pandoc-alternatives-for-markdown-to-html) è il confronto più completo.

## Cosa ti costano le estensioni: qui niente è portabile

Questa è la parte che la documentazione della libreria non mette in prima pagina. Ogni funzione oltre il puro CommonMark è un'estensione, le estensioni sono per-libreria, e un documento scritto contro le estensioni di una libreria è un documento che rende correttamente in esattamente un posto.

Vediamo cosa significa in concreto:

| La sintassi | Dove rende | Dove non rende |
| --- | --- | --- |
| `{: .warning #note }` | Python-Markdown con `attr_list`, MkDocs | GitHub, markdown-it-py, mistune, markdown2 — mostrata come testo letterale |
| Blocchi `!!! note` | Python-Markdown con `admonition`, MkDocs Material | Ovunque altro — un paragrafo che inizia con tre punti esclamativi |
| `[TOC]` | Python-Markdown con `toc` | Ovunque altro — un paragrafo che contiene la parola TOC |
| Fence `~~~` con attributi | `pymdownx.superfences` | `fenced_code` puro gestisce il fence, elimina gli attributi |
| Liste di task `- [ ]` | GitHub, `pymdownx.tasklist`, il `task_lists` di mistune, `gfm-like2` | Python-Markdown senza estensione — un elemento di lista che inizia con parentesi |
| Note `[^1]` | Python-Markdown, markdown2, mistune, mdit-py-plugins — tutte e quattro, diversamente | CommonMark puro; e gli id generati differiscono tra tutte e quattro |
| Matematica `$x^2$` | `pymdownx.arithmatex`, il `latex` di markdown2, il `math` di mistune | Tutto il resto — e ognuna delle tre emette markup diverso |

Il guasto è silenzioso in ogni riga. Niente genera un errore. Il documento contiene semplicemente una frase che era un callout.

Quindi un documento che rende in MkDocs non è un documento che rende ovunque. È un documento che rende in MkDocs. Se il tuo Markdown vive in un repository che la gente legge anche su GitHub, o finisce incollato in un client di chat, o viene esportato in Word da qualcuno di un altro team, allora le estensioni che accendi sono un costo pagato da ogni lettore che non usa la tua build. Il modo per mantenere quel costo visibile è scrivere quali estensioni possono usare i tuoi documenti, tenere l'elenco in un'unica costante nel codice, e testare un documento rappresentativo — con una tabella, una nota, una lista annidata e un fence di codice — attraverso ogni renderer che lo vedrà mai.

Le note a piè di pagina meritano un avviso specifico, perché sono l'estensione più probabile a essere attivata da due librerie diverse nella stessa organizzazione. Tutte e quattro le supportano, nessuna genera gli stessi id, e i link di ritorno differiscono. Fondi due documenti renderizzati in una pagina e gli anchor collidono. Convertine uno con due strumenti diversi e gli URL nei link delle note cambiano, il che rompe qualunque cosa avesse un link diretto a loro.

E c'è un costo anche dentro la tua build. Ogni estensione è codice che gira su ogni documento. `codehilite` tira dentro Pygments e un foglio di stile. `smarty` riscrive i caratteri, quindi un diff del tuo output dopo averla attivata è pieno di cambiamenti che non intendevi — anche dentro qualcosa che non era destinato a essere prosa. `nl2br` cambia cosa significa un a capo morbido, il che cambia come si riadatta un paragrafo in ogni documento scritto prima di averla attivata. Le estensioni non sono gratis e non sono reversibili senza un nuovo rendering.

## Come scegliere

1. **Parti da cosa deve vedere l'output.** Se un browser renderizza la stessa fonte con una libreria JavaScript, scegli markdown-it-py e fai corrispondere il preset; qualunque altra cosa significa che la preview e l'esportazione finiranno per essere in disaccordo, e lo scoprirai da un lettore piuttosto che da un test.
2. **Conta le estensioni di cui hai davvero bisogno prima di scegliere la libreria.** Se l'elenco è tabelle e fence di codice, tutte e quattro lo fanno. Se sono admonition, contenuto a tab e matematica, stai scegliendo Python-Markdown più pymdown-extensions che tu lo volessi o no, e stai accettando che la fonte renda solo lì.
3. **Decidi chi ha scritto il Markdown.** Per il tuo repository, sanificare è igiene. Per qualunque cosa arrivata da un utente, un'API o un client, è il requisito attorno a cui deve piegarsi il resto del design — e significa nh3 dopo il rendering, o un parser configurato per rifiutare del tutto l'HTML grezzo.
4. **Chiediti se devi cambiare l'output o solo produrlo.** Se l'HTML deve portare attributi, contenitori o nomi di classe particolari, il renderer di mistune ti evita uno step di post-elaborazione che sbaglierà il giorno in cui qualcuno scriverà di HTML dentro un blocco di codice.
5. **Controlla che la destinazione sia un documento, non un fragment.** Una libreria restituisce un fragment; se il file va a una persona, qualcosa deve aggiungere il doctype, l'head e gli stili inline, e quel qualcosa è il tuo template. Testalo con la rete spenta prima di inviarlo.
6. **Fissa la libreria e l'elenco di estensioni insieme.** Un rilascio minore che cambia un default, o un collega che aggiunge un'estensione per correggere una pagina, cambia ogni pagina. Entrambi appartengono allo stesso commit del file dei requisiti.
7. **Fermati e usa Pandoc se l'elenco dei formati è più lungo di uno.** Una libreria Markdown-a-HTML che si fa crescere un ramo Word e un ramo PDF è un Pandoc peggiore con una suite di test più piccola.

## Conclusione

Scegli in base al requisito: Python-Markdown per le estensioni e l'ecosistema di documentazione costruito su di esse, markdown2 quando una chiamata con un elenco di extra è tutto il lavoro, mistune quando l'HTML deve uscire in una forma particolare, markdown-it-py quando deve corrispondere alla specifica e a un browser. Poi aggiungi nh3 dopo il rendering, metti il fragment in un template che incorpora i propri stili, e dai allo script un exit code così un documento rotto fa fallire una build invece di essere spedito. Se tutto quello che ti serve è una pagina che un collega possa apire, salta del tutto la build — [convertire il file nel browser](/) e scarica l'HTML autonomo, oppure fai fare al tuo script un POST all'API e ottieni un link di sola lettura in un'unica chiamata.

## FAQ

### Quale libreria Python dovrei usare per convertire Markdown in HTML?

Python-Markdown se sei già in una toolchain di documentazione che la usa, markdown-it-py se un browser deve rendere identicamente la stessa fonte, mistune se devi cambiare l'HTML emesso, e markdown2 se vuoi un solo import e una sola chiamata. Tutte e quattro sono gratuite e open source, e nessuna sanifica.

### Perché il mio output di Python-Markdown mostra caratteri pipe invece di una tabella?

Perché `tables` è un'estensione ed è spenta a meno che non la nomini: `markdown.markdown(text, extensions=["tables"])`. Lo stesso vale per fence di codice, note e id sulle intestazioni. Il gruppo `extra` accende sette estensioni incluse `tables`, ma non `toc` né `codehilite`.

### bleach è ancora il modo giusto per sanificare HTML in Python?

No. La stessa pagina PyPI di bleach dichiara che non è più mantenuta e che non ci saranno futuri rilasci, nemmeno per problemi di sicurezza, con un ultimo rilascio 6.4.0 il 5 giugno 2026 (verificato su pypi.org, il 9 settembre 2026). nh3, un binding alla libreria Rust ammonia, è il sostituto attuale e accetta un'allow-list esplicita di tag e attributi.

### Dovrei sanificare il Markdown o l'HTML?

L'HTML, sempre, e dopo il rendering. È il parser a decidere quali caratteri nella fonte diventano tag, quindi un filtro che gira sul Markdown deve indovinare, e indovina male su fence di codice, destinazioni di link e caratteri con escape. L'alternativa è configurare il parser perché rifiuti del tutto l'HTML grezzo, il che è una garanzia ancora più forte.

### Come ottengo il syntax highlighting in Python-Markdown?

Attiva `codehilite`, installa Pygments, e genera il foglio di stile — la documentazione dell'estensione dà il comando come `pygmentize -S default -f html -a .codehilite > styles.css` (verificato su python-markdown.github.io, il 9 settembre 2026). Senza quel foglio di stile le classi ci sono e i colori no. `noclasses=True` scrive stili inline invece, che sopravvivono a essere incollati da qualche parte senza il CSS.

### Cos'è pymdown-extensions e mi serve?

È un pacchetto di estensioni con licenza MIT per Python-Markdown sotto il namespace `pymdownx`, che include SuperFences, Highlight, Tabbed, Tasklist, Details e Arithmatex (verificato su facelessuser.github.io, il 9 settembre 2026). Ti serve se vuoi contenuto a tab, fence annidati, liste di task o matematica, nessuno dei quali Python-Markdown offre ufficialmente. Non ti serve per tabelle, note o fence di codice.

### Posso far rendere Python e JavaScript lo stesso Markdown in modo identico?

Ci arrivi vicino, usando markdown-it-py in Python e markdown-it in JavaScript — il primo è un port del secondo, entrambi seguono la specifica CommonMark, e i nomi dei plugin coincidono in gran parte. Tieni preset e regole attive in un'unica configurazione condivisa, perché una differenza in quell'elenco produce una differenza nell'output che nessuno dei due lati segnala.
