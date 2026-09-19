---
title: Portare fuori il Markdown da Notion, Obsidian, Confluence e gli altri
description: Ogni percorso di esportazione da Notion, Obsidian, Confluence, Google Docs e Word — cosa produce ognuno, cosa rovina in silenzio, e come ripararlo
updated: 2026-09-14
date: 2026-07-02
tag: Workflow
keywords: esportare notion in markdown, obsidian esportazione html, confluence in markdown, esportare pagina confluence in markdown, google docs in markdown, word in markdown, html in markdown, notion in markdown, evernote esportazione markdown, apple notes esportazione markdown, migrare un wiki in markdown
---

Il documento esiste già: titoli, una tabella, tre screenshot, un riquadro colorato — dentro un'applicazione che non ti darà un file. Portarlo fuori raramente è un solo clic, e il clic che trovi perde qualcosa che noti una settimana dopo.

Quello che rende questo più difficile di quanto sembri è che nessuna di queste applicazioni conserva Markdown. Conservano un albero di blocchi tipizzati, o XHTML pieno di macro, o un modello di documento proprietario, e il pulsante di esportazione è un convertitore che qualcuno ha scritto per andare da quel modello a un formato file. Ogni convertitore scarta ciò che il suo target non può esprimere. La domanda non è mai se qualcosa vada perso; è cosa, e se lo scopri ora o dopo aver già buttato via l'originale.

### In breve

Notion esporta uno zip di Markdown e CSV in cui ogni nome di file e ogni link interno porta un id di pagina, e i callout, i toggle e le colonne arrivano appiattiti. Obsidian è già Markdown ma nel suo proprio dialetto, quindi wikilink, embed e riferimenti a blocco vanno convertiti prima che qualsiasi altra cosa possa leggerli. Confluence non ha alcuna esportazione in Markdown — prendi l'esportazione HTML dello spazio e la converti, perdendo qualunque cosa facessero le macro. Google Docs scarica il Markdown direttamente ma non può portare immagini o commenti in un unico file, e Word e tutto il resto passano per l'HTML. A dieci pagine ripari a mano; a mille diventa un lavoro di riscrittura scriptato, e la riscrittura riguarda nomi di file, link, percorsi degli allegati e ancore, in quest'ordine.

| Sorgente | Percorso di esportazione | Cosa ottieni | Cosa rovina |
| --- | --- | --- | --- |
| Notion | Esporta, formato “Markdown & CSV” | zip: un `.md` per pagina, cartelle, un `.csv` per database | id in ogni nome di file e link, callout, toggle, colonne, commenti |
| Obsidian | nessuna esportazione necessaria — file sul disco | una cartella di `.md` e allegati | wikilink, embed, riferimenti a blocco, callout, blocchi Dataview |
| Confluence Cloud | esportazione dello spazio in HTML (admin dello spazio) | zip di HTML renderizzato più allegati | macro, gerarchia delle pagine, commenti, ancore dei titoli |
| Pagina Confluence | Esporta in Word o PDF | un file per pagina | tutto ciò che è strutturale; il PDF è un vicolo cieco |
| Google Docs | File, Scarica, Markdown | un file `.md` | immagini, commenti, suggerimenti |
| Google Docs | File, Scarica, Pagina web | zip di HTML più una cartella immagini | attributi di stile da rimuovere dopo |
| Word | il `.docx` stesso | uno zip di XML da convertire | titoli finti fatti col grassetto, numerazione delle liste, modifiche tracciate |
| Evernote | esporta come ENEX o HTML | contenitore XML, oppure HTML più una cartella risorse | metadati della nota, task, formattazione fatta a mano |
| Bear | esporta come Markdown o Textbundle | Markdown, con gli asset nel caso Textbundle | la sintassi dei tag propria di Bear si legge come titoli altrove |
| Apple Notes | File, Esporta come, Markdown | un file per nota | allegati, tabelle, ed è solo nota per nota |
| Roam | esporta dall'interno del grafo | leggi l'elenco dei formati nel tuo stesso grafo prima di pianificare | riferimenti a blocco e query non hanno equivalente |

## Notion: uno zip dove ogni nome di file si allunga con un id

Scegli “Markdown & CSV” e Notion costruisce uno zip: un `.md` per pagina, una cartella per ogni pagina che aveva figli o immagini, un `.csv` per database. Ogni nome porta un lungo id esadecimale: Notion identifica le pagine per id, e il titolo è solo un'etichetta.

La finestra di esportazione vale la pena leggerla invece di cliccarci sopra distrattamente. Offre una scelta di formato — PDF, HTML, oppure Markdown & CSV — un menu a tendina “Include content” che può escludere file e immagini, un interruttore “Include subpages”, e un interruttore “Create folders for subpages” (verificato su notion.com, il 9 settembre 2026). Altri due limiti dalla stessa pagina contano prima di pianificare una migrazione intorno a questo: viene esportata solo la vista corrente o predefinita di un database, tutte le viste insieme non sono supportate, e una vista modulo non può essere esportata affatto — esporti invece la vista tabella. Per un'esportazione grande Notion può inviare un link di download via email invece di avviare subito lo scaricamento, il link scade dopo sette giorni, e l'elaborazione può richiedere fino a trenta ore (verificato su notion.com, il 9 settembre 2026). Questo è un fatto di pianificazione, non una nota a margine: se il piano era “esporto venerdì pomeriggio e converto venerdì sera”, forse non è il piano giusto.

Tre cose da aspettarsi:

- **Gli id restano.** Rinomina i file se qualcuno leggerà i nomi, poi correggi i link verso quelli vecchi.
- **I callout si appiattiscono.** Il Markdown non ha un blocco con un'icona e uno sfondo colorato, quindi un callout torna come un paragrafo con l'emoji arenata in testa. I toggle perdono la loro capacità di aprirsi e chiudersi.
- **I database escono come CSV.** Una vista tabella è un file separato, non una tabella Markdown: ricostruirla è un lavoro da foglio di calcolo, e poi [una questione di se le barre verticali sopravvivono](/blog/markdown-tables-that-survive-conversion).

Le immagini stanno nella cartella della pagina sotto nomi generati, raggiunte tramite percorsi relativi codificati con percent-encoding che reggono solo finché la cartella viaggia insieme al file — l'assunzione che [i percorsi relativi fanno funzionare o rompono](/blog/images-and-links-that-still-work).

### Cosa diventa ogni tipo di blocco

| In Notion | Nell'esportazione | Riparazione |
| --- | --- | --- |
| Callout | paragrafo, carattere icona in testa | una convenzione di blockquote con un'introduzione in grassetto |
| Toggle | il sommario come riga, il contenuto come i blocchi dopo di essa | un elemento `<details>`, oppure un titolo e testo semplice |
| Titolo toggle | un titolo, contenuto messo in linea sotto | di solito corretto così com'è |
| Layout a colonne | le colonne una dopo l'altra, nell'ordine del documento | accetta il reflow, oppure ricostruisci come tabella |
| Blocco sincronizzato | il suo contenuto, copiato in ogni pagina che lo mostrava | scegli una sola casa per il testo e collegala |
| Database, pagina intera | un file `.csv`, più un `.md` per ogni riga che aveva un corpo pagina | ricostruisci la tabella, tieni le pagine riga come file |
| Vista database collegata | niente di utile — la vista è una query, non contenuto | ricreala ovunque atterrino le pagine |
| Equazione in linea | il LaTeX, delimitato | dipende del tutto da cosa lo renderizza dopo |
| Commento | assente | copia prima nel corpo qualsiasi cosa non risolta |
| Pannello backlink | assente | era derivato, non conservato |

La riga dei commenti è quella che coglie di sorpresa i team. I thread di discussione non fanno parte del contenuto della pagina, quindi un'esportazione è la pagina senza l'argomentazione che l'ha prodotta. Se le decisioni vivono nei commenti, se ne vanno nel momento in cui lo spazio di lavoro viene archiviato.

### Il suffisso id, e perché non è solo brutto

Una pagina chiamata “Meeting notes” esce come `Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md`, e un link a essa da un'altra pagina è scritto contro esattamente quel nome di file, codificato per gli spazi. L'id è lo stesso che compare nell'URL della pagina nell'app, il che è la parte utile: ti dà una chiave per mappare i vecchi link ai nuovi.

```text
Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md    the file
Meeting%20notes%2021f4c8a1b2c34d5e8f90123456789abc.md    the link
meeting-notes.md    what you want
```

Rinomina i file senza riscrivere i link e hai una cartella di documenti che puntano tutti l'uno all'altro senza che nessuno si risolva. Questo è l'intero problema della migrazione in miniatura, ed è per questo che la rinomina e la riscrittura dei link devono essere un'unica operazione su un'unica mappa, non due passaggi fatti in pomeriggi diversi.

Se la destinazione è un unico documento Markdown invece di una cartella di file separati con una mappa dei link funzionante, il problema dell'id sparisce in un altro modo: [una conversione Notion → Markdown costruita esattamente per questo](/notion-to-markdown) prende lo `.zip` di esportazione senza modifiche, unisce ogni pagina in un unico documento nel suo ordine originale con un indice, e trasforma un link tra pagine nelle parole che mostrava invece che in un nome di file che comunque non si sarebbe risolto fuori dalla sua cartella originale. Non ricostruisce la mappa dei link per singolo file descritta sopra — niente lo fa in automatico, perché richiede di decidere dove vivrà ogni pagina — ma dove l'obiettivo era sempre una sola pagina da leggere o condividere, il suffisso id smette di essere un problema da risolvere. [Il confronto completo tra i percorsi](/blog/convert-notion-export-to-markdown) copre lo script di riscrittura degli id e l'alternativa basata su API in maggiore profondità.

## Obsidian: già Markdown, ma non il dialetto standard

Un vault Obsidian è una cartella di file `.md`, quindi non c'è niente da estrarre: portarlo in HTML è un lavoro di conversione, non un'esportazione. La trappola è che diverse cose che Obsidian capisce sono tutte sue.

```markdown
[[Meeting notes]]            <!-- wikilink, not standard Markdown -->
![[architecture.png]]        <!-- embed, also not standard -->

> [!warning] Careful
> This is an Obsidian callout.
```

Un convertitore standard stampa il wikilink e l'embed come testo letterale, parentesi comprese, e rende il callout come un blockquote con `[!warning]` in cima. Puoi cambiare l'impostazione del vault così che i nuovi link siano link Markdown ordinari, oppure fare trova-e-sostituisci prima di convertire.

L'impostazione è l'interruttore “Use [[Wikilinks]]” sotto Files and links; disattivarlo fa generare a Obsidian link Markdown standard invece che wikilink (verificato su obsidian.md, il 9 settembre 2026). Si applica solo ai nuovi link. Tutto quello già scritto resta com'era, quindi un vault che va avanti da due anni ha comunque bisogno della riscrittura — l'impostazione ferma la crescita del problema, non lo risolve.

### Il dialetto, voce per voce

| Obsidian scrive | Un convertitore standard vede | Cosa fare |
| --- | --- | --- |
| `[[Note]]` | il testo letterale, parentesi comprese | riscrivi come `[Note](note.md)` contro una mappa titolo-percorso |
| `[[Note\|label]]` | testo letterale | riscrivi come `[label](note.md)` |
| `![[image.png]]` | testo letterale | riscrivi come `![](image.png)` |
| `![[Note]]` | testo letterale | metti la nota in linea, oppure collegala — la transclusione non ha equivalente |
| `[[Note#Heading]]` | testo letterale | riscrivi come `note.md#heading`, poi controlla che la regola dello slug corrisponda al tuo renderer |
| `[[Note#^block-id]]` | testo letterale | non c'è un bersaglio a cui collegarsi; metti in linea il testo citato |
| `^block-id` a fine riga | un accento circonflesso e una parola vaganti nell'output | cancellalo una volta che niente lo referenzia più |
| callout `> [!note]` | un blockquote con `[!note]` nella prima riga | togli il marcatore, tieni il blockquote |
| un blocco ```` ```dataview ```` | un blocco di codice che mostra la query | la tabella che renderizzava non era mai nel file |
| `%%commento%%` | il testo, visibile al lettore | cancellalo prima di convertire |

I riferimenti a blocco meritano l'enfasi che dà loro la stessa documentazione di Obsidian: sono specifici di Obsidian e non fanno parte del Markdown standard, quindi non si trasferiscono (verificato su obsidian.md, il 9 settembre 2026). Lo stesso vale per gli embed. Entrambi sono puntatori dentro un grafo, e una cartella di file non è un grafo.

La riga su Dataview è quella che le persone leggono male. Una query Dataview è un blocco di codice delimitato con `dataview` come stringa informativa, e la tabella che stavi guardando in Obsidian era generata al momento della visualizzazione da un plugin. Niente di tutto ciò è nel file. Converti il vault e ottieni il testo della query in un blocco di codice, correttamente, e il lettore non ottiene alcuna tabella.

Il blocco delle proprietà in cima è frontmatter YAML: un convertitore che non lo riconosce rende il `---` iniziale come una linea orizzontale e trasforma quello finale in un titolo fatto con la tua ultima riga di metadati.

Una volta che una nota è Markdown ordinario, la conversione è un lavoro senza sorprese: trascinala su [TransformPipe](https://transformpipe.com) per un'anteprima, una scheda con la sorgente HTML e un `.html` autonomo con stili inline. Più note trascinate insieme si concatenano in un unico documento — oppure salta la pulizia a mano descritta sopra e trascina la cartella del vault stessa, zippata: [la sua conversione da Obsidian a Markdown](/obsidian-to-markdown) legge direttamente i file `.md` all'interno, risolve `[[wikilink]]`, alias e ancore dei titoli nelle parole che mostravano, e unisce ogni nota in un unico documento con un indice, nello stesso passaggio. [La riscrittura completa di wikilink ed embed](/blog/convert-obsidian-vault-to-markdown) copre come farlo a mano, su un vault intero.

### Rendere un vault portabile prima che ti serva esserlo

Quattro abitudini mantengono un vault convertibile senza cambiare come ci scrivi dentro. Disattiva i wikilink, così i nuovi link sono standard. Tieni gli allegati in una cartella dentro il vault invece che fuori, così i percorsi relativi reggono quando la cartella viene copiata. Evita un embed dove basterebbe un link, perché un link degrada in un link mentre un embed degrada in parentesi. E tratta i riferimenti a blocco come un aiuto personale alla navigazione piuttosto che come un modo di costruire un'argomentazione a pezzi, dato che sono l'unico costrutto senza alcuna via di downgrade.

## Confluence: il formato di archiviazione è XHTML, quindi un'esportazione è una conversione

Confluence non conserva Markdown. Una pagina è tenuta nel formato di archiviazione di Confluence, basato su XHTML — tecnicamente XML, dato che non è pienamente conforme a XHTML — e i costrutti propri di Confluence vivono in due namespace: `ac:` per i suoi elementi e `ri:` per gli identificatori di risorsa. Una macro è un `ac:structured-macro`, un'immagine è un `ac:image` che racchiude un `ri:attachment`, e un link a una pagina è un `ac:link` che racchiude un `ri:page` (verificato su confluence.atlassian.com, il 9 settembre 2026).

Niente in quell'elenco ha una forma Markdown. Quindi la strada d'uscita è una che assembli tu, e la prima decisione è quale esportazione ti è permesso lanciare.

| Esportazione | Ambito | Chi può lanciarla | Cosa esce |
| --- | --- | --- | --- |
| Esporta in Word | una pagina | chiunque abbia accesso | un file che Word apre e altri editor spesso no |
| Esporta in PDF | una pagina | chiunque abbia accesso | una pagina renderizzata; i commenti non sono mai inclusi |
| Esportazione dello spazio, HTML | intero spazio | admin dello spazio | zip di HTML renderizzato più allegati |
| Esportazione dello spazio, XML | intero spazio | admin dello spazio | formato di archiviazione, per ripristinare dentro Confluence |
| Esportazione dello spazio, CSV | intero spazio | admin dello spazio | contenuto che puoi visualizzare, allegati e commenti inclusi di default |
| Esportazione dello spazio, PDF | intero spazio | admin dello spazio | un file solo, niente post del blog, niente commenti |

Ogni riga di quella tabella viene dalla documentazione ufficiale di Atlassian, esclusioni comprese: i commenti alle pagine attualmente non vengono esportati durante un'esportazione HTML, i commenti non sono mai inclusi in un'esportazione PDF, i post del blog sono esclusi anche dall'esportazione PDF di uno spazio, e l'esportazione CSV prende tutto ciò che puoi visualizzare, allegati e commenti inclusi (verificato su support.atlassian.com, il 9 settembre 2026). L'esportazione Word della singola pagina è anche documentata come produttrice di un file che solo Microsoft Word apre in modo affidabile, il che la esclude come input per uno script.

Questo lascia l'HTML come unica fonte sensata per una conversione in massa, il che rende il lavoro [una conversione da HTML a Markdown](/html-to-markdown) con davanti un giro nelle cartelle. Due modi per fare il passaggio di conversione:

- Un convertitore o una libreria sull'HTML esportato — pandoc, o qualcosa come turndown in uno script. Le macro arrivano come qualunque HTML in cui si sono renderizzate: un riquadro informativo diventa un `div` semplice, un albero di pagine o un estratto lascia link verso il sito live. [Il confronto su pandoc](/blog/pandoc-alternatives-for-markdown-to-html) copre quando lo strumento più pesante vale l'installazione.
- Un'app del Marketplace che genera Markdown direttamente: va meglio con le macro, ma è una cosa in più da far approvare.

### Cosa diventano le macro

La regola è semplice una volta vista. Una macro che si renderizzava in HTML statico sopravvive come quell'HTML. Una macro che era una query dal vivo sopravvive come istantanea di qualunque cosa mostrasse, oppure come nulla.

| Macro | Nell'esportazione HTML | Dopo la conversione |
| --- | --- | --- |
| Riquadro info, nota, avviso, suggerimento | un `div` con una classe e un'icona | un paragrafo; dagli una convenzione di blockquote |
| Blocco di codice | un `pre` con markup di evidenziazione | un blocco delimitato, di solito con il linguaggio perso |
| Indice | una lista renderizzata di link ad ancora | una lista di link verso ancore che non esistono più |
| Albero pagine, visualizzazione figli | una lista renderizzata di link verso il sito live | link assoluti che tornano dentro Confluence |
| Estratto, inclusione | il testo transcluso, messo in linea | testo duplicato in ogni pagina che lo includeva |
| Issue o filtro Jira | una tabella istantanea, oppure un link | una tabella congelata al giorno dell'esportazione |
| Espandi | il contenuto, espanso | contenuto semplice, nessun toggle |
| Macro allegati | una lista di link a `/download/attachments/...` | link che richiedono una sessione |

Gli allegati sono la trappola ricorrente: stanno dietro URL `/download/attachments/` che si aspettano una sessione. Un'esportazione dello spazio li impacchetta nello zip, una pagina copiata no, quindi un'immagine che sembra a posto mentre sei autenticato è una casella rotta per chiunque altro.

Altre due cose che l'esportazione HTML non conserva in una forma usabile. L'albero delle pagine è espresso in un file indice invece che nella struttura delle cartelle — i nomi di file esportati sono piatti e generati a macchina, quindi la gerarchia va ricostruita dall'indice se vuoi delle cartelle. E le ancore dei titoli cambiano: Confluence genera id che includono il titolo della pagina, quindi ogni link interno alla pagina scritto contro `#PageTitle-Heading` smette di risolversi nel momento in cui il tuo nuovo renderer genera invece `#heading`. Le etichette sono metadati senza equivalente Markdown, e vale la pena scriverle nel frontmatter durante la conversione, perché nient'altro le porterà con sé.

Per il caso comune — un'esportazione di spazio che vuoi come un unico documento leggibile invece che come un albero di cartelle con una struttura funzionante — [una conversione da Confluence a Markdown](/confluence-to-markdown) prende lo `.zip` dell'esportazione HTML dello spazio così come esce da Confluence, converte l'HTML di ogni pagina con lo stesso convertitore dietro [la conversione da HTML a Markdown](/html-to-markdown) descritta sopra, e unisce le pagine in ordine in un unico documento con un indice. Non ricostruisce l'albero delle pagine né riscrive i link `/download/attachments/` — niente lo fa senza decidere dove vivranno le pagine e i loro allegati — ma rimuove il giro nelle cartelle e il passaggio di conversione per file per chiunque avesse come destinazione un unico documento da leggere o condividere fin dall'inizio. [Il confronto completo sulle esportazioni](/blog/convert-confluence-page-to-markdown) copre le app del Marketplace e la differenza tra Server/Data Center.

## Google Docs: due strade d'uscita, nessuna porta la conversazione

Google Docs verso Markdown funziona per lo più bene. File, poi Scarica, offre Markdown (.md) direttamente, e titoli, liste, tabelle, link ed enfasi sopravvivono (verificato su workspaceupdates.googleblog.com, il 9 settembre 2026). Lo stesso aggiornamento ha aggiunto una preferenza sotto Strumenti, Preferenze, Attiva Markdown, che accende Copia come Markdown e Incolla da Markdown — utile per una sezione, non per un documento intero.

I commenti e le modifiche suggerite non sopravvivono. Nemmeno un'immagine, perché un singolo file `.md` non ha dove metterla. Questo ti dà una decisione sulla strada da prendere invece di un'unica risposta.

| Strada | Conserva | Perde | Usala quando |
| --- | --- | --- | --- |
| Scarica come Markdown | titoli, liste, tabelle, link, enfasi | immagini, commenti, suggerimenti | il documento è testo, e vuoi un file solo |
| Scarica come pagina web, zippata | immagini, in una cartella accanto all'HTML | commenti, suggerimenti; aggiunge stili inline da rimuovere | il documento ha screenshot dentro |
| Scarica come Word, poi converti | immagini, stili, modifiche tracciate come markup | commenti, suggerimenti | stai già convertendo `.docx` in massa |

La strada HTML è quella da prendere di default quando ci sono immagini. Lo zip ti dà una cartella immagini e un file HTML, e il passaggio di conversione butta via la minestra di classi e gli attributi `style` inline che Google mette su ogni paragrafo — che è il punto, dato che niente di tutto ciò significa qualcosa in Markdown. [La guida completa per quella conversione](/blog/convert-google-docs-to-markdown) copre i dettagli da conoscere prima di un lotto.

I suggerimenti sono la modalità di fallimento con i denti. Un documento in modalità suggerimenti contiene due versioni di sé stesso, e l'esportazione ne contiene una, scelta per te. Accetta o rifiuta tutto prima di esportare, così il file che converti è il documento che pensi che sia. Lo stesso vale per i commenti: se una decisione è registrata solo in un thread risolto, copiala nel corpo prima, o perdila.

## Word: un convertitore può leggere la struttura, non l'intenzione

Un `.docx` è uno zip di XML, e Word verso Markdown funziona quanto il documento merita. I titoli scritti con gli stili titolo di Word diventano titoli `#`; i titoli finti fatti con 16pt grassetto diventano paragrafi di testo in grassetto. Le liste numerate si dividono allo stesso modo, quindi correggere gli stili in Word batte correggere il Markdown dopo.

Vale la pena dichiararlo come regola, perché decide dove avviene il lavoro. Un convertitore può leggere una struttura che è stata espressa in modo strutturale. Non può leggere l'intenzione. Se il documento è stato formattato a occhio — grassetto invece di titoli, tabulazioni invece di liste, un paragrafo vuoto invece di una regola di spaziatura — la conversione produce un muro di testo piatto che è tecnicamente fedele e inutile, e la correzione più economica è mezz'ora in Word ad applicare gli stili prima di convertire qualsiasi cosa. [Cosa conserva e cosa scarta una conversione `.docx`](/blog/convert-docx-to-markdown) passa in rassegna il resto: modifiche tracciate, commenti, caselle di testo, note a piè di pagina, oggetti incorporati, e le immagini che escono in una cartella accanto al file.

## Evernote, Bear, Apple Notes, Roam e tutto il resto

Questi quattro tornano abbastanza spesso da meritare un nome, e ognuno ha una strada che vale la pena conoscere. L'ultima voce è il ripiego per tutto ciò che non è nominato sopra.

**Evernote.** Seleziona note o un notebook ed esporta come ENEX, HTML a pagina singola, o HTML multipagina; l'esportazione ha un tetto di 100 note alla volta, anche se un intero notebook può andare tutto insieme (verificato su help.evernote.com, il 9 settembre 2026). ENEX è un contenitore XML che solo Evernote e i suoi importatori leggono, quindi a meno che tu non stia migrando verso qualcosa che importa ENEX, prendi l'esportazione HTML multipagina: dà un file HTML per nota, una cartella di risorse condivisa tra loro, e un indice che le collega insieme. Da lì è lo stesso passaggio da HTML a Markdown di tutto il resto.

**Bear.** Una singola nota si esporta come `.txt`, `.md`, `.textbundle`, `.bearnote` o `.rtf`, con HTML, DOCX, PDF, JPG ed ePub disponibili per Bear Pro; più note insieme passano per File, Esporta note sul Mac (verificato su bear.app, il 9 settembre 2026). Prendi Textbundle invece del semplice Markdown quando le note hanno immagini — un Textbundle è il Markdown e i suoi asset in un unico pacchetto, il che è esattamente il problema che un `.md` nudo non può risolvere. I tag di Bear sono scritti come `#tag` nel corpo, e un convertitore standard legge una riga che inizia con `#` come un titolo, quindi una riga di tag va gestita prima della conversione, non dopo.

**Apple Notes.** Sul Mac, File, Esporta come offre PDF e Markdown, e il lato dell'importazione accetta TXT, RTF, RTFD, HTML ed ENEX di Evernote, con un File, Importa Markdown separato (verificato su support.apple.com, il 9 settembre 2026). È per nota: non c'è un'esportazione dell'intera libreria, quindi qualsiasi cosa oltre poche dozzine di note significa selezionare a lotti. Gli allegati non fanno parte dell'esportazione Markdown.

**Roam.** Roam è prima di tutto un outline: ogni punto elenco è un blocco con un id, e sia i riferimenti a blocco sia le query sono puntatori dentro il grafo piuttosto che testo in una pagina. Qualunque formato di esportazione scegli, questi due costrutti non hanno equivalente Markdown — un riferimento va messo in linea come il suo testo oppure eliminato, e una query non ha un risultato da portare con sé. Leggi il menu di esportazione nel tuo stesso grafo prima di pianificare intorno a un formato, e pianifica la riscrittura dei riferimenti in entrambi i casi.

**Tutto il resto.** Per uno strumento senza un convertitore proprio — un wiki vecchio, un CMS, un centro assistenza, un'email — prendi qualunque HTML emetta e fai un passaggio da HTML a Markdown, perché l'HTML è l'unico formato che quasi tutto può produrre. Quando non c'è alcuna esportazione, il browser è l'esportazione: salva la pagina renderizzata, oppure copia fuori la regione dell'articolo. Quello che ottieni è tutta la cornice della pagina oltre al suo contenuto, quindi la conversione è seguita da un passaggio di pulizia, e la pulizia di solito è un solo selettore.

## Migrare mille pagine, dove la risposta a un clic fallisce

Tutto quello sopra descrive un solo documento. Una migrazione è un problema diverso, e la versione onesta va così.

| Scala | Cosa costa davvero | Cosa fare |
| --- | --- | --- |
| Sotto le 10 pagine | un'ora, forse due | correggi a mano, nell'ordine in cui un lettore lo noterebbe |
| Da 10 a 50 | un pomeriggio | correggi a mano, ma tieni una lista dei difetti che si ripetono |
| Da 50 a 200 | una giornata di mani, o mezza giornata di script | scripta i due o tre difetti che si ripetono, correggi a mano il resto |
| 200 e oltre | giorni in entrambi i casi | scrivi lo script, e metti in conto la seconda esecuzione |

La soglia non è più bassa perché lo script non è un convertitore. La conversione è la parte facile — una chiamata di libreria per file. Lo script è un problema di riscrittura, e contiene quattro riscritture separate, ognuna delle quali può essere finita e corretta mentre le altre tre sono rotte.

**Nomi di file.** Togli il suffisso id, trasforma in slug quello che resta, e risolvi le collisioni: due pagine chiamate “Meeting notes” sotto genitori diversi sono un solo nome di file dopo lo slugging. Costruisci una mappa dal vecchio percorso al nuovo e scrivila su disco, perché ti servirà altre tre volte, e di nuovo tra sei mesi quando qualcuno chiederà dove è finita una pagina.

**Link.** Ogni link interno nell'esportazione è scritto contro il vecchio nome di file, con percent-encoding. Riscrivi ognuno tramite la mappa. I link che puntavano invece all'applicazione live — un URL assoluto dentro lo spazio di lavoro o il wiki — sono un secondo insieme, abbinati per id o chiave di pagina invece che per nome di file, e sono quelli che funzionano ancora in silenzio il giorno in cui spegni il vecchio sistema e si rompono in silenzio il giorno dopo.

**Allegati.** Spostali in un'unica directory di asset, riscrivi lo `src` di ogni immagine, e deduplica: lo stesso logo esportato in quaranta cartelle di pagina sono quaranta file. I nomi con spazi, accenti o caratteri emoji vengono normalizzati qui, una volta sola, invece che in qualunque renderer se ne lamenti per primo.

**Ancore.** Gli id dei titoli sono generati da qualunque cosa renderizzi il Markdown, e la nuova regola non corrisponderà alla vecchia. I link interni alla pagina e qualsiasi blocco indice vanno rigenerati, non riscritti.

Fai tutte e quattro in un solo passaggio su un documento analizzato invece che con una catena di espressioni regolari sul testo grezzo. Un'espressione regolare che riscrive `](...)` riscrive anche l'interno di un blocco di codice delimitato, e la pagina in cui te ne accorgi è quella del lotto che documenta proprio la sintassi dei link. Analizza, percorri l'albero, riscrivilo. Una volta che l'albero è giusto, [far girare la conversione su tutta la directory](/blog/batch-convert-markdown-files) è la parte breve.

### Cosa campionare prima di impegnarti in uno script

Scegli sei pagine, non una, e sceglile con cura: la pagina più lunga, la pagina più collegata, quella con più immagini, una pagina densa di database o tabelle, una che si appoggia ai costrutti propri dello strumento — callout, macro, embed — e una scritta da chiunque nel team usi l'applicazione nel modo più insolito. Quest'ultima trova più difetti delle altre cinque messe insieme.

Porta tutte e sei lungo l'intero percorso, fino all'HTML finito, e controllale ognuna contro l'elenco sotto. Qualunque cosa fallisca sul campione è ciò che lo script deve gestire; qualunque cosa lo script non possa gestire è ciò che qualcuno corregge a mano, e ora sai quante pagine sono.

- [ ] **Link.** Prima quelli interni: puntano ancora ai vecchi URL o a nomi di file che non ci sono più.
- [ ] **Immagini.** Apri il file convertito da un posto diverso dalla cartella di esportazione.
- [ ] **Tabelle.** Celle unite e contenuto annidato non hanno forma Markdown; arrivano appiattiti o mancanti.
- [ ] **Callout e riquadri.** Scegli una sostituzione unica, un blockquote con un'introduzione in grassetto, e usala ovunque.
- [ ] **Blocchi di codice.** Controlla che gli indizi sul linguaggio siano arrivati, e che l'autocorrezione non abbia messo virgolette tipografiche nel codice.
- [ ] **Ancore.** Clicca ogni link interno alla pagina, incluso quelli generati da un blocco indice.
- [ ] **Frontmatter.** Decidi quali metadati tieni prima che lo script giri, non dopo.
- [ ] **Codifica.** Spazi non interrompibili, trattini morbidi e virgolette tipografiche viaggiano invisibili e rompono ricerche e diff.
- [ ] **Collisioni.** Due pagine diventate un solo nome di file sono una perdita di dati silenziosa, e l'unico sintomo è un file con il contenuto sbagliato dentro.

### L'ordine delle operazioni

Fai girare lo script in una cartella di output nuova ogni volta, così un'esecuzione andata male viene cancellata invece che districata, e mai nella cartella di esportazione stessa. Confronta la seconda esecuzione con la prima: quel confronto è l'unica cosa che ti dice cosa ha cambiato la tua correzione e cosa ha cambiato per sbaglio. E decidi in anticipo se il vecchio sistema resta fermo mentre gira la migrazione oppure se accetti un delta e ri-esporti le pagine che si sono spostate — entrambe sono strade percorribili, e scoprire dopo quale hai scelto non lo è.

## Come scegliere la strada d'uscita

1. **Esporta una volta sola, e tieni l'archivio.** Se converti sul posto non puoi far ripartire lo script, e lo farai ripartire — probabilmente tre volte.
2. **Scegli la strada in base a cosa devi conservare, non a quanti clic serve.** Se il documento ha screenshot, la strada del Markdown a file singolo era sbagliata prima ancora di iniziare, e nessuna riparazione successiva rimette a posto le immagini.
3. **Preferisci l'esportazione che impacchetta gli asset a quella che li collega.** Un percorso che richiede una sessione è un'immagine funzionante per te e una casella rotta per ogni altro lettore, e non te ne accorgerai, perché sei autenticato.
4. **Decidi cosa sostituisce ogni costrutto prima di convertire, non dopo.** Una convenzione di blockquote scelta in anticipo batte cinquanta improvvisate scoperte in revisione, e la seconda è molto più costosa da districare.
5. **Converti un documento rappresentativo dall'inizio alla fine prima del resto.** Portarlo fino in fondo all'HTML finito ti dice se la correzione è un'impostazione, un trova-e-sostituisci o un convertitore — tre risposte con costi molto diversi.
6. **Conta le pagine prima di scrivere codice.** Sotto una ventina, le mani battono uno script; sopra un paio di centinaia, le mani sono una settimana che non ti torna indietro.
7. **Tieni la mappa vecchio-nuovo qualunque sia la scala.** Senza di essa non puoi scrivere una lista di redirect, e un wiki senza redirect è un wiki in cui ogni segnalibro salvato da chiunque è ora un 404.

## Conclusione

Ognuna di queste applicazioni ti darà qualcosa. L'abilità sta nel sapere cosa, e nel controllarlo prima che l'originale sia sparito: uno zip di Notion i cui link puntano tutti a id, un vault i cui wikilink nient'altro legge, uno spazio Confluence dove le macro erano la parte utile, un Google Doc le cui immagini non sono mai state nel file. Porta un documento reale lungo l'intero percorso per primo, ripara quello che si rompe, e solo allora decidi se il resto è un pomeriggio di mani o uno script con quattro riscritture dentro. Quando il Markdown è finalmente pulito, [TransformPipe](https://transformpipe.com) lo trasforma in una pagina che puoi condividere, e il suo CLI prende un lotto di file in un solo comando, con `--merge` che li concatena in uno.

## FAQ

### Posso esportare una pagina Notion direttamente come Markdown?

Sì — la finestra di esportazione offre Markdown & CSV come formato, e una singola pagina esce come un file `.md` con le sue immagini in una cartella accanto. I database in quell'esportazione diventano file CSV invece che tabelle Markdown, e ogni nome di file e link interno porta l'id della pagina.

### Perché i miei nomi di file Notion hanno codici lunghi dentro?

Perché Notion identifica le pagine per id e il titolo è solo un'etichetta, quindi l'esportazione aggiunge l'id della pagina per tenere unici i nomi. Quell'id è lo stesso che compare nell'URL della pagina, il che lo rende una chiave utilizzabile: costruisci una mappa da id a nuovo nome di file, poi riscrivi link e nomi di file in un solo passaggio.

### Come porto una pagina Confluence in Markdown?

Non c'è un'esportazione Markdown, quindi esporti HTML e lo converti. Un intero spazio si esporta in HTML zippato se sei admin dello spazio, il che è anche l'unica strada che impacchetta gli allegati; una singola pagina offre solo Word e PDF, e il PDF è un vicolo cieco. Le macro arrivano come qualunque HTML in cui si sono renderizzate.

### Le note di Obsidian funzionano in altri strumenti Markdown?

Il Markdown semplice sì. Wikilink, embed, riferimenti a blocco e callout no, perché sono sintassi propria di Obsidian e un parser standard li stampa come testo letterale. Disattiva l'impostazione dei wikilink così i nuovi link sono standard, e riscrivi quelli esistenti prima di convertire.

### Esportare da Google Docs conserva le mie immagini e i commenti?

Le immagini sopravvivono al download come Pagina web, che ti dà uno zip con una cartella immagini, e non sopravvivono al download come Markdown, che è un file singolo senza dove metterle. I commenti e le modifiche suggerite non sopravvivono a nessuna delle due strade, quindi risolvili e accetta o rifiuta ogni suggerimento prima di esportare.

### Qual è il modo più veloce di spostare un intero wiki in Markdown?

Esporta una volta, converti una pagina rappresentativa fino in fondo all'HTML finito, e lascia che quello che si rompe su quella pagina ti dica se ti serve uno script. Se sì, trattalo come un lavoro di riscrittura su nomi di file, link, percorsi degli allegati e ancore invece che come un lavoro di conversione, e tieni la mappa vecchio-nuovo così puoi scrivere i redirect.

### Quali esportazioni conservano commenti e discussioni?

Quasi nessuna. I commenti di Notion non sono nell'esportazione, i commenti alle pagine di Confluence sono assenti dall'esportazione HTML e mai presenti in un PDF, e i commenti di Google Docs non escono in nessun formato di download. Se una decisione esiste solo in un thread di commenti, copiala nel corpo del documento prima di esportare qualsiasi cosa.
