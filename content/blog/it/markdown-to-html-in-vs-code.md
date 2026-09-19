---
title: "Da Markdown a HTML in VS Code: preview, esportazione e conversione al salvataggio"
description: "La preview di VS Code usa markdown-it, ma il suo foglio di stile non è mai quello esportato. Cosa mette ogni percorso di esportazione attorno al fragment"
date: 2026-08-25
tag: Conversione
keywords: da markdown a html in vs code, esportare markdown in html vscode, preview markdown vscode, markdown.styles, estensione export markdown vscode, convertire markdown al salvataggio, markdown all in one stampa in html
---

Il file è già aperto. Premi Ctrl+Shift+V, la preview appare, e sembra la pagina che volevi — titoli dimensionati con criterio, codice in un blocco monospaziato con uno sfondo colorato, tabelle con i bordi. Quindi vai a cercare il comando di esportazione, e non c'è. VS Code renderizza Markdown; non ti dà in mano un file `.html`.

Quel vuoto è dove vive la maggior parte dei guai di questo articolo. La preview è una webview con un proprio foglio di stile, costruita per leggere un file dentro l'editor. Ogni percorso che produce un vero file HTML — un'estensione, un comando da terminale, un task — prende decisioni proprie su cosa mettere attorno al fragment renderizzato, e nessuno di questi eredita l'aspetto della preview di default.

### In breve

VS Code non ha un'esportazione integrata da Markdown a HTML. La preview usa **markdown-it**, quindi quello che vedi è CommonMark più quello che VS Code aggiunge sopra, e il suo aspetto viene dal foglio di stile di preview dell'editor stesso — che **non** è quello che nessun esportatore metterà nel tuo file. Per un file `.html`, o installi un'estensione (Markdown All in One stampa in HTML; Markdown PDF scrive HTML, PDF, PNG o JPEG; Markdown Preview Enhanced offre un'esportazione HTML offline che incorpora i propri asset) oppure lanci un convertitore dal terminale integrato e lo colleghi a un task. Se il file è destinato a una persona piuttosto che a un repository, un convertitore che produce un documento completo e autonomo è una strada più corta che far comportare bene l'editor.

## Cos'è davvero la preview integrata

La preview Markdown di VS Code è una webview che fa girare markdown-it, lo stesso parser conforme a CommonMark usato da vari altri strumenti. Questo unico fatto spiega la maggior parte di quello che la preview renderizza e non renderizza.

CommonMark ti dà titoli, enfasi, liste, blockquote, blocchi di codice con fence, link e immagini. La configurazione di default di markdown-it aggiunge tabelle e strikethrough, quindi anche quelli rendono. VS Code aggiunge sopra le checkbox delle liste di task, motivo per cui `- [x] fatto` mostra una casella spuntata nella preview e non una coppia letterale di parentesi. Le note a piè di pagina non sono né in CommonMark né nei default di markdown-it, quindi `[^1]` rende come testo letterale finché non installi un'estensione che contribuisce un plugin apposito. I diagrammi Mermaid, PlantUML e la matematica seguono la stessa storia, tranne che la matematica ha un proprio interruttore: `markdown.math.enabled`.

Il comportamento che puoi cambiare senza un'estensione è un elenco corto, e vale la pena conoscerlo perché due di queste impostazioni cambiano l'HTML e non solo l'aspetto:

| Impostazione | Default | Cosa cambia |
| --- | --- | --- |
| `markdown.preview.breaks` | `false` | Se un singolo a capo diventa un `<br>` |
| `markdown.preview.linkify` | `true` | Se gli URL nudi diventano link |
| `markdown.preview.typographer` | `false` | Virgolette intelligenti, trattini ed ellissi |
| `markdown.math.enabled` | `true` | Rendering della matematica nella preview |
| `markdown.styles` | `[]` | Fogli di stile extra caricati nella preview |
| `markdown.preview.fontFamily` | default dell'editor | Font del corpo della preview |
| `markdown.preview.scrollPreviewWithEditor` | `true` | Sincronizzazione dello scroll, editor verso preview |
| `markdown.preview.scrollEditorWithPreview` | `true` | Sincronizzazione dello scroll, preview verso editor |

`breaks` e `linkify` sono quelle che contano oltre l'aspetto. Attiva `breaks` e ogni a capo morbido nella tua fonte diventa un `<br>` nell'output renderizzato, il che cambia la struttura del documento e non solo il suo rendering — la stessa fonte, due alberi diversi. Se ti sei mai chiesto perché uno strumento onora i tuoi paragrafi con a capo manuale e un altro li fonde in un blocco, quell'impostazione è tutto l'argomento, e il suo default differisce tra strumenti.

Altre due impostazioni appartengono a questo elenco anche se non cambiano niente nell'output, perché catturano i defetti che la conversione rende permanenti. `markdown.validate.enabled` attiva il controllo dei link dentro l'editor: un link relativo a un file che non esiste, o un anchor a un'intestazione che non corrisponde a nessuna intestazione, viene sottolineato dove puoi ancora correggerlo. `markdown.updateLinksOnFileMove.enabled` offre di riscrivere i link quando sposti o rinomini un file Markdown nell'explorer. Entrambe vale la pena averle attive in un repository di documentazione, perché un link relativo rotto nella fonte è un link rotto in ogni formato in cui lo convertirai, e la conversione non te lo segnala.

I comandi sono `Markdown: Open Preview` (Ctrl+Shift+V, Cmd+Shift+V su macOS) e `Markdown: Open Preview to the Side` (Ctrl+K V). C'è un terzo comando che vale la pena ricordare: `Markdown: Change preview security settings`, che controlla se la preview carica immagini remote e se esegue script. La preview è una webview con una content security policy, quindi un file `.md` che contiene un tag `<script>` non riesce a farlo girare di default. È una proprietà della webview. Non è una proprietà di niente che esporti, e confondere le due cose è come si finisce a pubblicare una pagina che non è mai stata ispezionata.

## Confronto rapido: la scheda riassuntiva

| Percorso | Cosa produce | Stili nell'output | Dove gira | Licenza |
| --- | --- | --- | --- | --- |
| Preview integrata | Niente — solo una vista renderizzata | Foglio di stile di preview dell'editor, non esportabile | Webview nell'editor | Gratuita, MIT (fonte di VS Code) |
| Copiare dalla preview | Rich text negli appunti | Quello che decide l'app di destinazione | Editor | Gratuita |
| Markdown All in One | `.html` a fianco del `.md` | Opzionalmente i fogli di stile di preview di VS Code stesso | Comando dell'editor | Gratuita, MIT |
| Markdown PDF | `.html`, `.pdf`, `.png`, `.jpeg` | Il suo default più `markdown-pdf.styles` | Editor, richiede un browser Chromium | Gratuita, MIT |
| Markdown Preview Enhanced | `.html` offline o ospitato su CDN | Il tema del suo renderer | Comando dell'editor, preview propria | Gratuita, licenza NCSA |
| Pandoc dal terminale integrato | Qualunque cosa tu chieda | Del template, o nessuno | Terminale, richiede un'installazione | Gratuita, GPL |
| Un convertitore dietro `tasks.json` | Quello che produce il convertitore | Del convertitore | Task runner | Dipende dal convertitore |
| Estensione Run on Save | Attiva una qualunque delle precedenti | Non è affare suo | A ogni salvataggio corrispondente | Gratuita, Apache 2.0 |
| Un convertitore lato browser | Un `.html` autonomo | Inline, nel file | Una tab del browser | Gratuita |

Leggi quella tabella dalla terza colonna. Il percorso che scegli è soprattutto una decisione su quale CSS finisce nel file, ed è la colonna che nessuno controlla finché il file non è già nella casella di posta di qualcuno. Ogni licenza nominata in questo articolo, in quella colonna e sotto, è una licenza libera e open source letta dal manifesto stesso del progetto (verificato sul repository di ogni progetto, l'8 settembre 2026).

## Il foglio di stile della preview non è il foglio di stile esportato

Questa è la parte che sorprende la gente, quindi vale la pena dirla chiaramente: l'aspetto della preview Markdown di VS Code è prodotto da fogli di stile che appartengono alla webview dell'editor. Non sono attaccati al tuo documento. Non sono scritti in niente che esporti. Un esportatore che non li copia deliberatamente produce un file che rende ai default del browser — Times New Roman a piena larghezza di finestra, titoli semplicemente più grandi, blocchi di codice distinti solo per essere monospaziati.

La stratificazione dentro la preview rende la separazione più chiara. Tre fonti di CSS raggiungono la webview, in quest'ordine: prima gli stili di preview integrati di VS Code, poi qualunque foglio di stile che le estensioni hanno contribuito tramite il punto di contribuzione `markdown.previewStyles`, poi il tuo `markdown.styles`. L'ordine documentato è integrato, poi contribuito, poi utente — motivo per cui la tua regola in `markdown.styles` vince su quella di un'estensione, e per cui un'estensione che vuole essere sovrascrivibile contribuisce invece di iniettare.

Nessuno di questi tre livelli fa parte della conversione. Danno stile a una vista del documento. La conversione — testo Markdown in ingresso, tag HTML in uscita — avviene prima di tutti loro e non sa nulla di loro.

C'è una seconda versione, più silenziosa, della stessa sorpresa, e colpisce gli sviluppatori piuttosto che chi scrive. Le estensioni possono aggiungere sintassi alla preview tramite il punto di contribuzione `markdown.markdownItPlugins`: l'estensione restituisce una funzione `extendMarkdownIt`, VS Code le passa l'istanza di markdown-it, e il plugin diventa effettivo. Questo riguarda solo la preview. Non influisce su come il documento viene esportato o elaborato altrove. Quindi puoi installare un plugin per le note a piè di pagina, guardare le tue note rendere splendidamente, lanciare un'esportazione, e ottenere `[^1]` letterale nell'output — perché l'esportatore ha un proprio parser, un proprio set di plugin, e nessuna conoscenza di cosa è stato detto alla preview di fare.

La regola pratica che ne segue: **la preview è uno strumento di lettura, e l'esportazione è un programma separato.** Verifica l'esportazione aprendo il file esportato, in un browser, non nell'editor. Qualunque cosa concludi dalla preview sul file che stai per inviare è una supposizione.

## Le estensioni che esportano davvero

Tre estensioni coprono quasi tutto questo, e differiscono esattamente nel modo che suggerisce la terza colonna della scheda riassuntiva — in cosa metttono attorno al fragment.

### Copiare dalla preview — il percorso che la gente prova per primo

Prima di installare qualcosa, la maggior parte delle persone seleziona tutto nella preview, copia, e incolla in quello che serve al contenuto. Funziona, nel senso ristretto che gli appunti portano rich text e la destinazione lo renderizza. Vale la pena sapere con precisione cosa succede, perché il risultato non è né la preview né un file HTML.

Gli appunti ricevono una versione HTML della selezione, e l'applicazione ricevente applica poi le proprie regole. Un client email mantiene il grassetto e le liste e sostituisce il proprio font. Un word processor mappa i titoli sui propri stili di titolo, il che spesso è esattamente quello che volevi. Un sistema di gestione contenuti elimina la maggior parte e mantiene la struttura. In ogni caso lo stile è quello della destinazione, non quello di VS Code, e le immagini con percorso relativo di solito non arrivano affatto.

| Pro | Contro |
| --- | --- |
| Nessuna installazione, nessuna configurazione, nessun file da gestire | Ottieni rich text, non un file che puoi inviare o servire |
| Titoli e liste sopravvivono nella maggior parte delle destinazioni | Le immagini relative in genere non sopravvivono |
| Sufficiente per incollare una sezione in un'email | I blocchi di codice perdono l'evidenziazione e a volte la monospaziatura |

**Per chi è?** Chiunque debba muovere pochi paragrafi in un'altra applicazione. Non è una conversione, e trattarla come tale è come una tabella arriva dall'altra parte come cinque righe di pipe.

### Markdown All in One — la strada più corta verso un file `.html`

Markdown All in One è un'estensione Markdown generalista: scorciatoie da tastiera, continuazione delle liste, un indice, e un'esportazione HTML. Il comando di esportazione è `Markdown: Print current document to HTML`, con `Markdown: Print documents to HTML` per un batch. Scrive il file a fianco della fonte.

| Pro | Contro |
| --- | --- |
| Un comando, nessun browser, nessuna installazione oltre l'estensione | L'output si appoggia ai fogli di stile di preview di VS Code stesso |
| Può riprodurre l'aspetto della preview dell'editor di proposito | Le immagini sono collegate, non incorporate, a meno di attivarlo |
| Comando batch per una cartella di file | Non è un convertitore che puoi chiamare da una build |
| L'esportazione al salvataggio è una singola impostazione | L'HTML è stilizzato per una webview, non per la stampa o l'email |

**Prezzo:** gratuita, licenza MIT.

Le impostazioni sono la parte interessante, perché sono le decisioni che l'esportatore prende per te:

| Impostazione | Default | Effetto |
| --- | --- | --- |
| `markdown.extension.print.includeVscodeStylesheets` | `true` | Se il CSS di preview di VS Code stesso entra nel file |
| `markdown.extension.print.imgToBase64` | `false` | Se le immagini sono incorporate come data URI |
| `markdown.extension.print.absoluteImgPath` | `true` | Se i percorsi relativi delle immagini vengono riscritti come assoluti |
| `markdown.extension.print.theme` | `light` | Schema colori dell'HTML esportato |
| `markdown.extension.print.onFileSave` | `false` | Ri-esporta a ogni salvataggio del `.md` |
| `markdown.extension.print.validateUrls` | `true` | Controlla i link durante l'esportazione |

Due di queste decidono se il file viaggia. `absoluteImgPath` al suo default riscrive i tuoi riferimenti relativi alle immagini come percorsi assoluti sulla tua macchina, che è corretto finché il file resta dove è stato scritto e rotto nel momento in cui lo mandi a qualcun altro — il suo computer non ha nessun `C:\Users\tu\docs\diagram.png`. Impostare `imgToBase64` su `true` incorpora le immagini invece, il che rende il file più grande e lo fa funzionare ovunque. Quale dei due vuoi dipende da dove va il file, e il default assume che non vada da nessuna parte.

**Per chi è?** Qualcuno che vuole il file che sta guardando, come HTML, adesso, e non gli importa molto quale sia il CSS purché non sia niente.

### Markdown PDF — un'estensione, quattro formati di output

Markdown PDF converte il documento aperto in PDF, HTML, PNG o JPEG. Lo fa guidando un browser basato su Chromium attraverso Puppeteer, usando o un browser che indichi tu, uno già installato, o uno che scarica e gestisce da sola.

| Pro | Contro |
| --- | --- |
| HTML e PDF da un'unica configurazione | Richiede un browser Chromium, scaricato se non trovato |
| `markdown-pdf.styles` accetta i tuoi fogli di stile | La dipendenza dal browser è pesante per un lavoro solo HTML |
| La conversione al salvataggio è integrata | Più lenta di un parser, perché renderizza una pagina |
| Più formati in un'unica esecuzione via `markdown-pdf.type` | Lo stile dell'output è dell'estensione finché non lo sostituisci |

**Prezzo:** gratuita, licenza MIT.

Le impostazioni da conoscere: `markdown-pdf.type` accetta il formato di output o un loro elenco; `markdown-pdf.convertOnSave` ripete la conversione ogni volta che il file viene salvato; `markdown-pdf.styles` accetta un elenco di percorsi a fogli di stile locali da applicare. Poiché è un vero browser a fare il rendering, il percorso PDF è il più solido qui — dimensione pagina, margini e intestazioni sono cose che un browser sa fare e un parser Markdown no. Se il PDF è l'obiettivo reale piuttosto che un effetto secondario, i compromessi sono un argomento a parte.

**Per chi è?** Chiunque abbia bisogno di PDF così come di HTML dalla stessa fonte, e a cui non importi che un browser venga scaricato per farlo.

### Markdown Preview Enhanced — quella con l'esportazione offline

Markdown Preview Enhanced sostituisce la preview integrata con una propria, che renderizza matematica, mermaid e PlantUML, ed esporta in vari formati. La sua esportazione HTML è la sola delle tre a nominare la distinzione a cui questo articolo torna sempre: scegli tra **HTML (offline)** e **HTML (ospitato su CDN)**.

| Pro | Contro |
| --- | --- |
| L'esportazione offline incorpora gli asset invece di collegare un CDN | È una seconda preview, con un proprio comportamento e un proprio tema |
| Diagrammi e matematica rendono senza plugin extra | Quello che vedi non è più quello che mostra la preview integrata |
| Il front matter controlla l'esportazione per documento | L'esecuzione di script deve essere attivata per alcune funzioni |
| L'esportazione al salvataggio si dichiara nel documento, non nelle impostazioni | La più grande delle tre estensioni, per ampiezza |

**Prezzo:** gratuita, sotto la licenza University of Illinois/NCSA Open Source.

L'esportazione si configura nel front matter del documento stesso piuttosto che nelle impostazioni, il che è un'idea genuinamente buona — il documento porta le proprie istruzioni. Le chiavi includono `offline`, `embed_local_images`, `embed_svg`, `print_background` e `toc`, e l'esportazione al salvataggio si dichiara così:

```yaml
---
export_on_save:
  html: true
---
```

`embed_local_images` convertie le immagini locali in base64, la stessa decisione che prende `imgToBase64` in Markdown All in One, e conta per lo stesso motivo. Nota che la funzione dell'indice richiede che `enableScriptExecution` sia attivato nelle impostazioni dell'estensione, perché deve far girare uno script nella preview.

**Per chi è?** Chi scrive documenti con diagrammi ed equazioni, e vuole che l'esportazione sia descritta nel file piuttosto che nelle impostazioni di una macchina.

### Pandoc dal terminale integrato — non è un'estensione affatto

Il terminale integrato fa parte dell'editor, quindi lanciare un convertitore lì è comunque convertire da dentro VS Code. Pandoc è la scelta abituale e produce un documento completo quando glielo chiedi:

```sh
pandoc README.md --standalone --embed-resources --output README.html
```

`--standalone` avvolge il fragment in un vero documento con un doctype e un head. `--embed-resources` incorpora immagini e fogli di stile nel file così si apre con la rete spenta. Senza questi due flag Pandoc ti dà un fragment, il che è il comportamento corretto per una libreria e il file sbagliato da inviare per email. C'è di più da dire su quanto costa questo per ogni esecuzione e dove appartiene in una pipeline, e [la versione da riga di comando è un articolo a sé](/blog/markdown-to-html-from-the-command-line).

**Per chi è?** Chiunque abbia già Pandoc, o voglia che la conversione sia un comando che una build, un collega o un runner di CI possano anche eseguire.

## CSS personalizzato: markdown.styles, e cosa raggiunge

`markdown.styles` è un array di URL di fogli di stile caricati nella preview. In un workspace, metti il file nel repository e riferiscilo da `.vscode/settings.json`:

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown.preview.breaks": false,
  "markdown.preview.typographer": true
}
```

Due vincoli fanno cadere in trappola. Primo, i percorsi vengono risolti relativi alla cartella del workspace; i percorsi assoluti del filesystem non sono supportati, e gli URI `file://` non sono un modo per aggirare la cosa — ci sono richieste aperte nel repository di VS Code che chiedono percorsi assoluti proprio perché non funzionano. Secondo, questa è un'impostazione di workspace per un motivo: un foglio di stile che vive nel repository viaggia con il repository, così la preview di tutti ha lo stesso aspetto. Impostarlo nelle tue impostazioni utente dà stile a ogni file Markdown che apri mai, compresi quelli di altre persone, il che raramente è quello che intendevi.

Poi la parte importante. `markdown.styles` raggiunge la preview e niente altro. Non raggiunge `Markdown: Print current document to HTML`, non raggiunge `markdown-pdf.styles`, e non raggiunge l'esportazione di Markdown Preview Enhanced. Ognuna di queste ha una propria impostazione di foglio di stile, e se vuoi un aspetto unico attraverso preview ed esportazione, devi puntare entrambe le impostazioni allo stesso file:

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown-pdf.styles": ["docs/preview.css"]
}
```

Funziona, con un avvertimento da controllare prima di fidartene: il foglio di stile integrato della preview resta comunque sotto il tuo nella webview e assente dall'esportazione, quindi un foglio di stile scritto come un insieme di override sopra i default di VS Code produce un file molto più spoglio quando quei default non ci sono. Se vuoi che le due cose corrispondano, scrivi il foglio di stile come uno stylesheet completo — font del corpo, spaziatura, bordi delle tabelle, sfondo dei blocchi di codice — piuttosto che come una patch.

La stessa logica si applica all'evidenziazione della sintassi. La preview evidenzia i blocchi di codice usando i meccanismi propri dell'editor, e l'esportazione non li eredita. Un esportatore che evidenzia lo fa con un proprio tema e propri nomi di classe, e uno che non lo fa ti dà un semplice `<pre><code>` con una classe di linguaggio e niente che lo colori. Quello di cui l'evidenziazione ha davvero bisogno sulla pagina è un foglio di stile, e a volte uno script, nessuno dei quali appare per magia.

## Convertire al salvataggio con una voce in tasks.json

Se la conversione avverrà più di due volte, metti il comando nel repository piuttosto che nelle tue dita. Un task rende il comando una proprietà del progetto:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "md to html",
      "type": "shell",
      "command": "pandoc",
      "args": [
        "${file}",
        "--standalone",
        "--embed-resources",
        "--output",
        "${fileDirname}/${fileBasenameNoExtension}.html"
      ],
      "problemMatcher": [],
      "presentation": { "reveal": "silent" },
      "group": { "kind": "build", "isDefault": true }
    }
  ]
}
```

Segnarlo come task di build di default, come fa la proprietà `group` sopra, significa che Ctrl+Shift+B lo esegue senza un selettore — una piccola cosa che decide se il task viene davvero usato. `presentation.reveal` impostato su `silent` impedisce al pannello del terminale di prendere il focus a ogni esecuzione, il che conta quando l'esecuzione avviene decine di volte al giorno.

`${file}` è il file nell'editor attivo, `${fileDirname}` la sua cartella e `${fileBasenameNoExtension}` il suo nome senza estensione, quindi il task converte quello che stai guardando e scrive il risultato a fianco. `"problemMatcher": []` dice a VS Code di non scandire l'output in cerca di errori di compilazione, cosa che altrimenti produce un prompt ogni volta che lo lanci.

Ora la parte onesta, perché è qui che i tutorial si fermano e gli utenti cominciano a cercare. **`tasks.json` non può eseguire un task quando salvi un file.** La proprietà `runOptions.runOn` accetta due valori: `default`, che significa che il task gira quando lo invochi, e `folderOpen`, che significa che gira quando la cartella che lo contiene viene aperta. Non c'è `onSave`. Esistono tre soluzioni alternative, e sono genuinamente diverse per costo.

**Legare il task a un tasto.** L'opzione più economica, e mantiene il trigger esplicito. In `keybindings.json`:

```json
{
  "key": "ctrl+alt+h",
  "command": "workbench.action.tasks.runTask",
  "args": "md to html"
}
```

Una pressione di tasto, nessuna estensione extra, e la conversione avviene quando decidi tu che deve avvenire. Per un file che esporti qualche volta al giorno questa è la risposta giusta, e il fatto che sia manuale è una funzione — non stai scrivendo file HTML ogni volta che salvi una frase a metà.

**Usare l'impostazione al salvataggio propria dell'esportatore.** Markdown All in One ha `markdown.extension.print.onFileSave`, Markdown PDF ha `markdown-pdf.convertOnSave`, e Markdown Preview Enhanced legge `export_on_save` dal front matter del documento. Delle tre, la versione nel front matter si comporta meglio: è per documento, è nel controllo di versione, e un file che non deve essere esportato semplicemente non lo chiede.

**Usare un'estensione che osserva i file.** L'estensione Run on Save è la scelta abituale. La sua configurazione è un elenco di espressioni regolari accoppiate a comandi, sotto `emeraldwalk.runonsave` nelle impostazioni:

```json
{
  "emeraldwalk.runonsave": {
    "commands": [
      {
        "match": "\\.md$",
        "cmd": "pandoc \"${file}\" --standalone --embed-resources --output \"${fileDirname}/${fileBasenameNoExt}.html\""
      }
    ]
  }
}
```

Ha licenza Apache 2.0 e sostituisce i propri placeholder — `${file}`, `${fileDirname}`, `${fileBasenameNoExt}`, `${workspaceFolder}` e qualche altro — che sono vicini abbastanza a quelli dei task di VS Code da confondere. `${fileBasenameNoExt}` qui, `${fileBasenameNoExtension}` in `tasks.json`. Copiare uno dentro l'altro produce silenziosamente un file chiamato `${fileBasenameNoExtension}.html`.

La quarta opzione è saltare del tutto il trigger dell'editor e lasciare che sia il repository a possederlo: uno script di watch in `package.json`, o un workflow che converte a ogni push così l'artefatto viene costruito dal medesimo comando per tutti. Pubblicare da una pull request rimuove la domanda su quale macchina abbia installata l'estensione giusta, che è la modalità di guasto di ogni impostazione in questo articolo.

## Dove il percorso nell'editor fallisce, e cosa costa

Convertire nell'editor è veloce e locale, e ha quattro costi che appaiono solo più tardi.

### La configurazione è per macchina, non per repository

Ogni impostazione di estensione in questo articolo vive in un file di impostazioni, e solo quelle di workspace viaggiano. `.vscode/settings.json` è versionabile, quindi `markdown.styles`, `markdown-pdf.styles` e `markdown.extension.print.imgToBase64` possono essere proprietà del repository. Le estensioni stesse non possono. Puoi elencarle in `.vscode/extensions.json` come raccomandazioni, e una raccomandazione è un prompt che qualcuno può rifiutare. Un collega che esegue la stessa esportazione con un'estensione diversa installata produce un file diverso, e niente nel repository registra quale fosse quella giusta.

Questa è la differenza tra una conversione e un'abitudine. Un comando in uno script è verificabile, confrontabile e ripetibile; una sequenza di tasti nell'editor di qualcuno non è nessuna di queste cose, e il primo segno di guaio è di solito un documento che sembra sbagliato a una persona e a posto a un'altra. Se l'output conta per più di una persona, la conversione deve essere scritta da qualche parte che non sia un file di impostazioni su un laptop.

### Un file alla volta, per lo più

Markdown All in One ha un comando di stampa batch; il resto è costruito attorno all'editor attivo. Se il lavoro è una cartella di documenti, o un documento assemblato da molti, l'editor è la forma sbagliata per farlo — fondere prima e convertire una volta è un'operazione diversa con un risultato diverso, e nessun comando di esportazione in un editor di testo lo farà.

### Niente in questa pipeline sanifica

Markdown permette HTML grezzo, quindi un file `.md` può contenere `<script>`, `onerror=` e URL `javascript:`. La preview integrata renderizza HTML grezzo e si appoggia alla content security policy della webview per impedire agli script di girare, il che ti protegge durante la lettura. Un file HTML esportato non ha nessuna webview e nessuna policy del genere: qualunque HTML grezzo fosse nella fonte è ora in un file che un browser eseguirà. Per le tue note personali questo è irrilevante. Per un README che hai tirato da un repository, o un documento che ti ha mandato un cliente, [è tutta la domanda](/blog/sanitising-markdown-safely), e nessuna di queste estensioni presenta la sanificazione come uno dei suoi step.

### La dipendenza da Chromium è reale

Il download del browser di Markdown PDF è un inconveniente occasionale su un laptop e un problema vero in CI, dove un runner headless deve scaricare e mettere in cache un browser per produrre un file che un parser avrebbe potuto fare in millisecondi. Se ti serve solo HTML, un browser è un modo pesante per ottenerlo.

### Quando il file ha un lettore

I costi sopra sono tutti tollerabili quando l'output finisce in un repository, in una build o in un pannello di preview. Diventano intollerabili quando l'output va a una persona, perché allora il file deve sopravvivere a lasciare la tua macchina — deve portare i propri stili, risolvere le proprie immagini, e apirsi correttamente su un computer che non ha nessuna delle tue impostazioni e nessuna idea di cosa sia una webview.

Quella è una proprietà tecnica precisa: un file HTML completo e autonomo, stili inline, nessuna richiesta esterna. Alcuni esportatori si possono configurare per produrne uno; la maggior parte produce qualcosa a metà tra un fragment e un documento, e lo scopri mandandotelo per email. Un convertitore costruito per quel risultato parte già da lì. TransformPipe convertie Markdown in un unico file HTML autonomo nel browser, senza niente caricato quando sei disconnesso, il che significa che il test che conta — aprirlo altrove, con la rete spenta — passa per costruzione piuttosto che per configurazione. [Cosa deve fare un documento che consegni a qualcuno](/blog/share-a-markdown-document-as-a-link) è un elenco più corto di quello che deve fare la build di un repository, e l'editor è ottimizzato per il secondo.

## Come scegliere, in cinque domande

1. **L'output è per un lettore o per un repository?** Un lettore ha bisogno di un unico file autonomo, quindi stili e immagini devono stare dentro; un repository ha bisogno di un comando ripetibile, quindi deve vivere nel controllo di versione piuttosto che nelle impostazioni di estensione di qualcuno.
2. **L'esportatore porta gli stili dentro il file?** Se non lo fa, ottieni i default del browser, e un documento alla larghezza di default del browser senza bordi sulle tabelle si legge come rotto anche se l'HTML è corretto.
3. **Ci sono immagini?** I percorsi relativi si rompono quando il file si sposta e quelli assoluti si rompono nel momento in cui lascia la tua macchina, quindi a meno che le immagini non siano incorporate come data URI, il file funziona solo dove è stato scritto.
4. **Qualcosa ha bisogno di far girare questo senza di te?** Se la risposta è sì, la conversione appartiene a un comando che un task, uno script o un job di CI possono chiamare, perché un comando dell'editor è una persona che preme un tasto e una persona non è disponibile alle 3 del mattino.
5. **Hai scritto tu tutto quello che c'è nel file?** Se no, qualcosa deve sanificare l'HTML grezzo prima che l'output raggiunga un browser, perché nessuna parte del percorso nell'editor lo fa per te.

## Conclusione

Convertire Markdown in HTML in VS Code funziona bene esattamente per il caso per cui è stato costruito: un file che stai già editando, un'esportazione che stai per guardare tu stesso, su una macchina che hai configurato. Oltre questo, le due cose che la gente si aspetta che l'editor faccia — riprodurre l'aspetto della preview nel file esportato, e far girare la conversione automaticamente al salvataggio — sono entrambe cose che non fa, ed entrambe risolvibili solo scegliendo un'estensione e leggendone attentamente le impostazioni. Se ti serve un unico file HTML che si apra correttamente sul computer di qualcun altro, convertire [Markdown in HTML con un convertitore lato browser](/) richiede meno decisioni che far concordare tre estensioni, e [il confronto più ampio tra convertitori](/blog/best-markdown-to-html-converters) copre le librerie e gli strumenti da riga di comando che vale la pena collegare a una build invece.

## FAQ

### VS Code ha un'esportazione integrata da Markdown a HTML?

No. VS Code offre una preview Markdown e nessun comando di esportazione, quindi produrre un file `.html` richiede o un'estensione o un convertitore lanciato dal terminale integrato. Lo scopro della preview è leggere il file nell'editor, non produrre un consegnabile.

### Perché il mio HTML esportato non sembra affatto la preview?

Perché l'aspetto della preview viene dai fogli di stile propri della webview di VS Code, che non fanno parte del tuo documento e non vengono scritti in nessuna esportazione. A meno che l'esportatore non li copi deliberatamente — Markdown All in One ha un'impostazione proprio per questo — il file esportato rende ai default del browser.

### Come uso il mio CSS nella preview Markdown di VS Code?

Aggiungi il foglio di stile a `markdown.styles` in `.vscode/settings.json`, con un percorso relativo alla cartella del workspace. I percorsi assoluti del filesystem non sono supportati, e l'impostazione influisce solo sulla preview — per l'esportazione devi anche impostare la propria opzione di stile dell'estensione che esporti.

### VS Code può convertire Markdown in HTML ogni volta che salvo?

Non tramite `tasks.json`, la cui `runOptions.runOn` accetta solo `default` e `folderOpen`. Usa l'impostazione al salvataggio propria di un esportatore, come `markdown.extension.print.onFileSave` o `markdown-pdf.convertOnSave`, oppure un'estensione che osserva i file e lancia un comando sui salvataggi corrispondenti.

### Perché le mie note a piè di pagina rendono nella preview ma non nell'esportazione?

Perché i plugin di markdown-it contribuiti dalle estensioni si applicano solo alla preview e non hanno effetto su come il documento viene esportato. L'esportatore ha un proprio parser e un proprio set di plugin, quindi una sintassi che la preview capisce può uscire come testo letterale nel file.

### La preview renderizza il GitHub Flavored Markdown?

Per lo più, in pratica: markdown-it gestisce tabelle e strikethrough, VS Code aggiunge le checkbox delle liste di task, e gli URL nudi diventano link perché `markdown.preview.linkify` è attivo di default. Non è una garanzia dell'output esatto di GitHub, e [le differenze tra i dialetti sono da conoscere](/blog/commonmark-gfm-and-the-flavours) prima di assumere che un file renda uguale nei due posti.

### Quale percorso mi dà un unico file senza richieste esterne?

L'esportazione `HTML (offline)` di Markdown Preview Enhanced e `--standalone --embed-resources` di Pandoc puntano entrambi a questo, come qualunque convertitore il cui output dichiarato sia un documento autonomo. Testalo nel solo modo che dimostra qualcosa: apri il file su un'altra macchina con la rete disattivata.
