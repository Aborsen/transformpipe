---
title: "Alternative a Dillinger nel 2026: raggruppate per il motivo per cui lo lasci"
description: Alternative a Dillinger raggruppate per il motivo per cui ne cerchi una — un convertitore invece di un editor, qualcosa offline, qualcosa nell’editor, o uno script
date: 2026-09-08
tag: Workflow
keywords: alternative a dillinger, dillinger io alternativa, editor markdown online alternativa, editor markdown senza cloud, convertire markdown senza editor, editor markdown offline
---

Dillinger è un buon software ed è gratuito, quindi nessuno cerca un’alternativa per frustrazione con la scrittura. La cerca perché qualcosa ai margini dello strumento non andava: un dialogo che chiede di collegare un Google Drive, un export che non si apriva come sembrava sullo schermo, o la lenta scoperta di aver aperto un editor quando serviva un convertitore e un file.

### In breve

Se volevi una conversione sola invece di una sessione di scrittura, la risposta è un convertitore, non un altro editor — Markdown Live Preview per guardare, un convertitore lato browser per un file HTML completo da inviare. Se l’obiezione era la connessione al cloud, nota prima che Dillinger dice che i documenti restano nel tuo browser e che nessun dato sta sui suoi server (verificato su dillinger.io, 9 settembre 2026); la richiesta di accesso appare solo quando collegi Dropbox, Drive, OneDrive, GitHub o Bitbucket, e puoi semplicemente non farlo. Se vuoi lo strumento sulla tua macchina, StackEdit resta in una scheda e funziona offline, e Typora, Obsidian e Zettlr sono applicazioni. Se appartiene a una build, niente di tutto questo si applica e Pandoc sì.

“Alternativa a Dillinger” sono quattro ricerche vestite da una sola frase. La prima è di chi è arrivato con un file `.md`, voleva HTML in uscita, e ha trovato un editor a due riquadri con un menu cloud — più strumento di quanto il compito richiedesse. La seconda è di chi ha incontrato la richiesta di integrazione e si è fermato, perché collegare un intero Drive a un sito per spostare un file è un pessimo scambio. La terza vuole il software installato, su un portatile, che funzioni su un treno, con i file su un disco che può salvare. La quarta sta scrivendo un passaggio di build e ha bisogno di un comando, non di una scheda.

Queste quattro persone vogliono cose diverse e solo una di loro vuole un editor. È la cosa utile da sapere prima di leggere qualunque elenco, incluso questo, perché la maggior parte delle pagine “alternative a Dillinger” risponde a tutte e quattro le domande con un mucchio classificato di editor Markdown, e tre lettori su quattro se ne vanno con lo strumento sbagliato.

C’è anche un quinto caso che vale la pena nominare, perché compare nei thread di supporto: l’export è uscito e non assomigliava all’anteprima. Non è un motivo per cambiare editor. È una proprietà di come è stato scritto l’HTML, e si sistema senza migrare niente.

## Dillinger secondo i suoi stessi termini

Dillinger è un editor Markdown basato su browser con anteprima dal vivo, costruito su Monaco — lo stesso componente di editing che usa VS Code. Offre anteprima sincronizzata allo scroll, scorciatoie Vim ed Emacs dietro un’impostazione, drag and drop di file Markdown, HTML e immagine, una modalità scura e una modalità Zen a schermo intero. L’export è descritto come “Markdown, HTML stilizzato o PDF”, con un download a un clic. I documenti si salvano da soli nello storage del tuo browser, e il sito afferma chiaramente: “Nessun account richiesto, nessun dato sui nostri server” (verificato su dillinger.io, 9 settembre 2026).

È open source. Il repository dichiara la licenza MIT, ed elenca lo stack come Next.js, Monaco, Tailwind CSS e Zustand, con un semplice `npm run build` e `npm start` per farlo girare in proprio (verificato su github.com/joemccann/dillinger, 9 settembre 2026). MIT significa che puoi ospitarlo, forkarlo e modificarlo, che è più di quanto offrano la maggior parte degli strumenti web gratuiti, e la contropartita onesta a tutto quello che segue.

Le integrazioni sono la parte a cui le persone reagiscono. Ne sono elencate cinque — GitHub, Dropbox, Google Drive, OneDrive e Bitbucket — per importare file e salvarli di nuovo, e il sito nota che il collegamento a Dropbox avviene via OAuth (verificato su dillinger.io, 9 settembre 2026). Niente di tutto ciò è insolito o improprio. È semplicemente il punto in cui un editor gratuito chiede qualcosa che un convertitore non deve mai chiedere, ed è il punto dove molte persone chiudono la scheda.

| Pro | Contro |
| --- | --- |
| Niente da installare, e nessun account da creare | È un editor: la strada più corta resta scrivi, poi esporta |
| Monaco offre editing vero — cursori multipli, trova e sostituisci | La pagina arriva da un dominio ospitato, quindi il primo caricamento ha bisogno della rete |
| I documenti persistono nello storage del browser, con niente sui loro server | Lo storage del browser è per browser e per profilo, e pulire i dati del sito lo pulisce |
| Esporta Markdown, HTML stilizzato e PDF in un clic | La sincronizzazione cloud significa concedere a un sito l’accesso a un drive o a un repository |
| Licenza MIT, quindi puoi ospitarlo tu stesso | Lo stile dell’export è quello dello strumento, e “stilizzato” non è lo stesso di autonomo |

**Licenza:** gratis, MIT (verificato su github.com/joemccann/dillinger, 9 settembre 2026).

**Per chi è?** Per chi sta scrivendo un documento adesso, in un browser, e vuole un’anteprima dal vivo e un file alla fine. Su quel compito è difficile fare di meglio e non c’è motivo di lasciarlo. Ogni motivo qui sotto riguarda un compito diverso.

Due cose valgono la pena di controllare prima di concludere che lo strumento ti ha deluso. Primo, lo storage del browser non è un backup: vive in un browser su una macchina, e una cache pulita o una finestra privata si porta via il documento. Secondo, un export “HTML stilizzato” e un documento HTML autonomo sono proprietà separate. Apri il file esportato con la rete disattivata, in un browser diverso. Se sembra ancora giusto, gli stili erano dentro. Se diventa testo nero su bianco a tutta larghezza di finestra, lo stile puntava a qualcosa che il file non può raggiungere — un problema [che vale la pena capire per bene](/blog/self-contained-html-explained), perché ti seguirà in qualunque strumento passi.

## Confronto rapido: il foglietto

| Strumento | Usalo quando | Dove vive il testo | Gira su | Licenza |
| --- | --- | --- | --- | --- |
| Dillinger | Stai scrivendo adesso e vuoi un’anteprima | Storage del browser, più un drive cloud se ne collegi uno | Qualunque browser | Gratis, MIT |
| Un convertitore da browser | Hai un file e ti serve un documento HTML finito | Niente esce dalla macchina quando non hai fatto l’accesso | Qualunque browser | Gratis |
| Markdown Live Preview | Vuoi solo vedere come rende | La pagina su cui sei | Qualunque browser | Gratis, MIT |
| StackEdit | Vuoi un editor da browser che continui a funzionare offline | Storage del browser finché non colleghi la sincronizzazione | Qualunque browser | Gratis, Apache Licence 2.0 |
| Typora | Scrivi quasi ogni giorno e vuoi un’applicazione | File `.md` locali | macOS, Windows, Linux | A pagamento, una tantum |
| Obsidian | Molte note che si richiamano a vicenda | Una cartella locale che scegli tu | Desktop, telefoni, tablet | Gratis per qualunque uso |
| Zettlr | Il documento ha citazioni e un modello di destinazione | File `.md` locali | macOS, Windows, Linux | Gratis, GNU GPL v3 |
| VS Code | Il Markdown sta già accanto al codice | File nella cartella che hai aperto | macOS, Windows, Linux | Licenza di prodotto; Code-OSS è MIT |
| Pandoc | La conversione deve girare senza una persona | Dove stanno già i tuoi file | Riga di comando | Gratis, GPL |
| Una REST API o CLI | La conversione appartiene a una pipeline | Il tuo repository o runner | Server, CI, terminale | Varia |

## Motivo uno: voglio un convertitore, non un editor

È il gruppo più grande e quello che gli elenchi servono peggio. Hai già un file `.md` — un README, un export da un’app di note, qualcosa che un modello ha scritto per te — e il compito è trasformarlo in una pagina che una persona possa aprire. Dillinger può farlo: incolli il testo, usi il menu di export. Ma la forma dello strumento è sbagliata per il compito. Ti metti davanti un cursore e chiede di scrivere, quando non c’è più niente da scrivere.

Un convertitore ha una forma diversa. Gli dai un file, ti dà indietro un file, e non c’è nessun documento da gestire nel mezzo. Niente viene salvato, niente sincronizzato, e non c’è stato da perdere.

### TransformPipe — per un documento HTML finito da inviare

Un convertitore lato browser prende il file Markdown e restituisce un documento HTML completo, stili in linea, in un unico file. Non c’è installazione né account, e senza aver fatto l’accesso niente viene caricato — il file viene letto, convertito e renderizzato sulla macchina davanti a te, cosa che puoi confermare guardando la scheda di rete mentre lavora.

| Pro | Contro |
| --- | --- |
| L’output è un file solo che non chiede niente alla rete | Non è un ambiente di scrittura: nessuna anteprima dal vivo in cui digitare |
| Niente viene caricato quando non hai fatto l’accesso, e nessun account è richiesto | Il browser fa il lavoro, quindi un file molto grande dipende dalla macchina |
| L’HTML grezzo nella fonte passa attraverso una lista consentita fissa prima di renderizzare | Nessun linguaggio di template per un layout su misura |
| Converte anche HTML, Word, CSV e JSON nell’altro senso | Un documento alla volta, o più uniti insieme |

**Licenza:** gratis da usare. La conversione è limitata a 10 MB, e un documento conservato in un account a 4 MB, perché la funzione dietro rifiuta un corpo di richiesta o risposta oltre 4,5 MB.

**Dettagli tecnici e funzioni**

- GitHub Flavored Markdown: tabelle, elenchi di attività, testo barrato, autolink, blocchi di codice delimitati
- L’output è un documento intero — doctype, head, un blocco `<style>` in linea, nessuna richiesta esterna
- Si scarica come `.html`, `.md` o testo semplice, oppure si stampa in PDF tramite la finestra di dialogo del browser
- La stessa conversione è disponibile da una REST API, una CLI senza dipendenze, una GitHub Action e un server MCP

**Per chi è?** Per chiunque il passo successivo sia “manda questo a qualcuno”. Se sei arrivato a Dillinger con un file e ne sei uscito con un documento che non eri sicuro si apriva su un’altra macchina, è lo scambio che lo sistema, e richiede quanto l’export.

### Markdown Live Preview — per guardare, non per consegnare

Markdown Live Preview è esattamente quello che dice il suo repository: “un piccolo strumento web per l’anteprima di testo formattato in Markdown”, descritto lì anche come un “editor markdown con anteprima dal vivo” e rilasciato con licenza MIT (verificato su github.com/tanabe/markdown-live-preview, 9 settembre 2026). Il suo sito ha rifiutato una richiesta automatica nel giorno in cui questo è stato scritto, quindi tutto quanto sopra viene dal repository invece che dalla pagina.

| Pro | Contro |
| --- | --- |
| Il repository è piccolo abbastanza da leggerlo tutto, e con licenza MIT | Un’anteprima, non una pipeline di export |
| Niente documentato da collegare o sincronizzare | Il suo rendering non è necessariamente quello del tuo renderer di destinazione |
| Un solo compito, fatto nella pagina | Niente da conservare: è una superficie da bozza |

**Licenza:** gratis, MIT (verificato su github.com/tanabe/markdown-live-preview, 9 settembre 2026).

**Per chi è?** Per chi sta controllando se una tabella è formata correttamente, o se un elenco annidato si annida bene. È la misura giusta per una domanda di cinque secondi e la misura sbagliata per produrre un documento. Se la tua unica interazione con Dillinger era incollare il testo per vedere se sembrava giusto, questo lo sostituisce con molto meno attorno.

### Cosa ottieni dal gruppo dei convertitori

Il filo comune è che non c’è nessun documento da perdere. Nessuno storage del browser da pulire, nessuna sincronizzazione da configurare, nessuna richiesta OAuth, e nessuna bozza a metà seduta in una scheda che hai chiuso la settimana scorsa. Lo scambio è un file per un altro e poi è finito. Per una fetta sorprendente del traffico dietro questa ricerca, è tutto il requisito, e tutto il resto della pagina è una risposta a una domanda che il lettore non ha fatto.

Cambia anche cosa significa “sicuro”. Un convertitore online che carica ha il tuo documento; uno che converte nel browser non lo ha. Quella distinzione [vale la pena verificarla piuttosto che assumerla](/blog/is-an-online-converter-safe) per qualunque strumento in questa categoria, incluso quelli qui, perché entrambe le progettazioni esistono e la pagina raramente dice apertamente quale delle due sia.

## Motivo due: lo voglio offline, o da qualche parte che controllo

Il secondo gruppo vuole lo strumento sul proprio lato della rete. A volte è una politica — una macchina di lavoro, il documento di un cliente, un settore dove “l’abbiamo incollato in un sito” non è una frase accettabile. A volte è pratico: un treno, un aereo, un edificio con un wifi scadente. E a volte è solo una preferenza per software che continua a funzionare quando un’azienda perde interesse.

Vale la pena essere precisi su cosa fa e non fa Dillinger qui, perché l’assunzione istintiva di solito è sbagliata. La sua pagina dice che l’editor continua a funzionare senza connessione una volta caricato, e che i documenti si salvano da soli nello storage locale del browser senza dati sui suoi server (verificato su dillinger.io, 9 settembre 2026). Quello che non può fare è esistere senza il primo caricamento: l’applicazione viene servita da un dominio, quindi il codice arriva via rete ogni volta che non è in cache, e la versione che ottieni è qualunque versione sia stata deployata. È una proprietà diversa da un’applicazione firmata che sta sul tuo disco, e per alcuni lettori è tutta la differenza.

### StackEdit — l’editor da browser costruito per funzionare offline

StackEdit è un editor Markdown in browser con anteprima dal vivo e scroll sincronizzato, e pubblicizza l’uso offline direttamente: “Anche quando viaggi, StackEdit resta accessibile e ti lascia scrivere offline proprio come qualunque applicazione desktop.” Sincronizza i file con Google Drive, Dropbox e GitHub, pubblica su Blogger, WordPress e Zendesk, ed è concesso in licenza sotto la Apache Licence 2.0 (tutto verificato su stackedit.io, 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| L’uso offline è un obiettivo di progetto dichiarato, non un effetto secondario | Resta una scheda del browser, con la stessa dipendenza dal primo caricamento |
| Più strumenti di scrittura di Dillinger: controlli WYSIWYG, commenti | Le destinazioni di sincronizzazione sono gli stessi drive cloud che magari stai evitando |
| Gestisce documenti lunghi senza lamentarsi | La sua sintassi estesa — diagrammi, spartiti — viaggia male altrove |
| Apache Licence 2.0, quindi si può auto-ospitare | Lo stile dell’export è il suo |

**Licenza:** gratis, Apache Licence 2.0 (verificato su stackedit.io, 9 settembre 2026).

**Dettagli tecnici e funzioni**

- GitHub Flavored Markdown, più matematica LaTeX, diagrammi UML ed estensioni per spartiti musicali
- Sincronizzazione con Google Drive, Dropbox e GitHub; pubblicazione su Blogger, WordPress e Zendesk
- Un componente incorporabile, `stackedit.js`, per mettere l’editor dentro un’altra applicazione
- Funzioni di commento e collaborazione pensate per la revisione più che per la scrittura in solitaria

**Per chi è?** Per chi apprezzava la scheda del browser e vuole un editor più serio dentro di essa, specialmente dove installare software non è un’opzione. È lo scambio più simile su questa pagina, e vale la stessa riserva: se ti sei opposto a collegare un drive, StackEdit ti offrirà gli stessi tre.

### Typora — l’applicazione, se scrivi quasi ogni giorno

Typora è un editor desktop per macOS, Windows e Linux che rimuove la finestra di anteprima, il cambio modalità e i marcatori di sintassi e renderizza il documento mentre scrivi; i suoi temi sono descritti come “completamente configurabili via CSS” (entrambi verificati su typora.io, 9 settembre 2026). La sua documentazione dice che Typora “supporta l’esportazione del documento corrente in PDF, HTML, HTML (senza stili) e formato immagine”, ed elenca Word, OpenOffice, LaTeX, EPUB e il resto come export che passano attraverso un Pandoc installato (verificato su support.typora.io, 9 settembre 2026). Poiché il tema è CSS, l’export HTML eredita qualunque foglio di stile sia attivo invece di un aspetto fisso della casa.

| Pro | Contro |
| --- | --- |
| Un solo riquadro, nessuna vista divisa, nessun rumore di sintassi | A pagamento, e solo desktop |
| I temi sono CSS, quindi gli export possono portare il tuo stile | File `.md` ordinari su un disco che controlli tu |
| Nessuna integrazione da concedere, perché non ce ne sono | Un documento alla volta; non è uno strumento per batch |
| — | Sostituire la sintassi mentre scrivi piace ad alcuni scrittori e non ad altri |

**Prezzo:** 14,99 $ senza tasse, un acquisto una tantum che copre fino a tre dispositivi, con una prova gratuita di 15 giorni (verificato su typora.io, 9 settembre 2026).

**Per chi è?** Per chi ha un’abitudine col Markdown che ha superato una scheda. È l’unica voce a pagamento qui e l’unica dove il motivo per pagare è la scrittura piuttosto che l’output. Se stai già confrontando editor desktop, [i motivi per cui le persone lasciano Typora a loro volta](/blog/typora-alternatives) vale la pena leggerli prima di comprare, visto che il tetto sui dispositivi coglie di sorpresa più avanti che prima.

### Obsidian — quando i documenti si richiamano a vicenda

Obsidian lavora su una cartella di file Markdown sul tuo disco, con i link fra note come idea organizzativa. Non è un convertitore e non è principalmente un editor per un documento; è un’applicazione per una raccolta di essi. Il suo sito dice che “conserva le tue note in locale come file Markdown in testo semplice”, offre versioni per Windows, macOS, Linux, iOS e Android, e descrive “migliaia di plugin” insieme a un’API aperta. La sua pagina sulla licenza dichiara che si può usare gratis per qualunque scopo, incluso uso personale, commerciale e non profit, con licenze a pagamento opzionali non richieste, e non descrive l’applicazione come open source (tutto verificato su obsidian.md, 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| I file restano in una cartella che hai scelto, in Markdown semplice | Un sovraccarico enorme se hai un documento solo |
| Gratis per qualunque scopo, incluso commerciale | La pagina sulla licenza non dichiara open source, quindi non c’è codice da ospitare tu stesso |
| Gira su desktop, telefoni e tablet | I suoi link e embed in stile wiki non sono Markdown standard |
| Un grande ecosistema di plugin, inclusi plugin di export | La qualità dell’export dipende da quale plugin installi |

**Licenza:** gratis per qualunque scopo; le licenze Catalyst e Commercial a pagamento sono opzionali (verificato su obsidian.md, 9 settembre 2026).

**Per chi è?** Per chi il proprio uso di Dillinger era diventato in silenzio un archivio — più documenti, ognuno in una scheda, nessuno più ritrovabile dopo. È un compito per una cartella e un’applicazione sopra di essa. È un salto grande per un fastidio piccolo, e il [confronto fra editor in quella categoria](/blog/best-markdown-editors) è un punto di partenza migliore di questa pagina.

### Zettlr — quando il documento ha una bibliografia e un formato di destinazione

Zettlr è un’applicazione di scrittura per Windows, macOS e Linux che tratta l’export come un passaggio di prima classe, guidato da Pandoc attraverso un sistema di profili: “puoi esportare qualunque documento con un modello in un solo clic”. Si integra con gestori di riferimenti tra cui Zotero e JabRef, e lavora con modelli LaTeX e Word (tutto verificato su zettlr.com, 9 settembre 2026). È concesso in licenza sotto la GNU GPL v3 (verificato su github.com/Zettlr/Zettlr, 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Profili di export alimentati da Pandoc, con modelli veri | La capacità di Pandoc arriva con la curva di apprendimento di Pandoc |
| Citazioni da Zotero o JabRef, dentro il documento | Più pesante di qualunque altra cosa in questo gruppo |
| GPL v3, e i tuoi file restano dove li metti | Pensato per la scrittura accademica, il che modella ogni impostazione predefinita |
| Ricerca full-text su tutto un progetto | Non uno strumento per una conversione rapida di un file |

**Licenza:** gratis, GNU GPL v3 (verificato su github.com/Zettlr/Zettlr, 9 settembre 2026).

**Per chi è?** Per chi scrive qualcosa con riferimenti e un formato di output richiesto — un articolo, una tesi, un manoscritto. Se stavi esportando da Dillinger e poi sistemando il risultato a mano ogni volta, uno strumento con modelli è la soluzione strutturale.

## Motivo tre: lo voglio nell’editor che ho già

Il terzo gruppo è di sviluppatori, e la risposta è breve: se il file è già aperto nel tuo editor, è lì che dovrebbe avvenire la conversione. Passare a una scheda del browser per renderizzare un file che sta sul disco a due passi è il tipo di abitudine che sopravvive molto dopo che il motivo per averla è sparito.

### VS Code — l’anteprima è già installata

VS Code include un’anteprima Markdown costruita su markdown-it, che è la stessa famiglia di renderer in cui sta il problema di anteprima di Dillinger, e si apre accanto al file con una scorciatoia da tastiera. L’export non è incluso; lo forniscono le estensioni, e la loro qualità varia. Il repository sorgente, Code-OSS, è concesso in licenza MIT, mentre il prodotto a marchio distribuito da Microsoft porta una licenza di prodotto Microsoft (verificato su github.com/microsoft/vscode, 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Già installato, per la maggior parte degli sviluppatori | L’export ha bisogno di un’estensione, e le estensioni differiscono |
| L’anteprima riflette il comportamento CommonMark di markdown-it | Lo stile dell’anteprima non è lo stile dell’export |
| Il file non lascia mai la cartella in cui vive | Non è una pipeline: converte solo quello che è aperto |
| Scorciatoie Vim, cursori multipli, tutto quello che dava Monaco | Nessuna sincronizzazione cloud dal vivo, il che per questo gruppo è il punto |

**Licenza:** il prodotto è sotto una licenza di prodotto Microsoft; il codice sorgente Code-OSS è MIT (verificato su github.com/microsoft/vscode, 9 settembre 2026).

**Dettagli tecnici e funzioni**

- Anteprima affiancata con scroll sincronizzato, da una scorciatoia da tastiera
- markdown-it sotto l’anteprima, quindi il comportamento CommonMark è la base e le funzioni GFM arrivano da preset
- Estensioni per export in HTML, PDF e diapositive, ognuna avvolge il frammento in modo diverso
- Uno spazio di lavoro basato su cartella, così il Markdown sta col codice che documenta

**Per chi è?** Per chiunque converta un README o una nota di passaggio mentre è già nell’editor. C’è una simmetria divertente qui: il componente di editing di Dillinger è Monaco, che è l’editor di VS Code estratto per il browser, quindi uno sviluppatore che lascia Dillinger per VS Code non sta imparando affatto un nuovo editor. Sta togliendo un browser fra sé e i propri file.

Se il Markdown vive in un repository, è anche lì che sta il resto della catena di strumenti — linting, controllo ortografico, diff, revisione. Un documento modificato tramite uno strumento web e riportato con un copia-incolla è un documento senza cronologia, e la cronologia era la ragione principale per cui esisteva un repository.

## Motivo quattro: lo voglio in uno script

Il quarto gruppo ha smesso di volere uno strumento con un cursore dentro. La conversione avviene cinquanta volte, o a ogni commit, o alle tre di notte, e qualunque risposta che coinvolga una scheda del browser non è una risposta. Niente nella categoria degli editor serve questo caso, il che è il motivo per cui è il gruppo a cui più spesso viene data la raccomandazione sbagliata.

### Pandoc — la risposta generale

Pandoc è un convertitore di documenti a riga di comando che legge e scrive un gran numero di formati di markup. Il suo sito dichiara: “Pandoc è software libero, rilasciato sotto la GPL” (verificato su pandoc.org, 9 settembre 2026). Per questo compito i flag rilevanti sono documentati nel suo manuale: `--standalone` (`-s`) produce “output con un’intestazione e un piè di pagina appropriati (per esempio un file HTML, LaTeX, TEI o RTF autonomo, non un frammento)”, e `--embed-resources` produce “un file HTML autonomo senza dipendenze esterne, usando URI `data:` per incorporare il contenuto di script, foglio di stile, immagini e video collegati” (verificato su pandoc.org, 9 settembre 2026).

```sh
pandoc notes.md -s --embed-resources -o notes.html
```

| Pro | Contro |
| --- | --- |
| Un comando, ripetibile, scriptabile, nessuna scheda | Richiede un’installazione e un terminale |
| `--standalone` e `--embed-resources` producono un vero file solo | Template e filtri sono un capitolo a parte |
| `--template` dà controllo esatto sull’involucro | Nessuna sanitizzazione: l’HTML grezzo passa dritto |
| Legge e scrive molto più di Markdown e HTML | I suoi dialetti Markdown differiscono da GFM in alcuni punti |

**Licenza:** gratis, GPL (verificato su pandoc.org, 9 settembre 2026).

**Dettagli tecnici e funzioni**

- `--standalone` avvolge l’output in un documento completo invece di produrre un frammento
- `--embed-resources` incorpora foglio di stile, script e immagini come URI `data:`
- `--template` seleziona un file o URL di modello, e implica `--standalone`
- `--sandbox` limita l’accesso ai file di lettura e scrittura ai file nominati sulla riga di comando, il che conta quando l’input non è tuo

**Per chi è?** Per chiunque abbia una conversione ripetuta, una cartella di file, o un formato di output diverso da HTML. Lo scambio è un’installazione e qualche lettura in cambio di una conversione che non ha più bisogno di una persona. Se il terminale è dove appartiene questo compito, la [domanda più stretta su come fare Markdown a HTML lì](/blog/markdown-to-html-from-the-command-line) copre anche le alternative a Pandoc.

### Un’API, una CLI o un’azione CI — quando l’installazione è il problema

L’altra forma di questa risposta è una conversione ospitata senza nessun runtime da installare: un endpoint REST che il tuo script chiama, una CLI senza dipendenze che esegui senza un gestore di pacchetti, o un’azione che gira in una pull request. È la stessa conversione di quella del browser, spostata dove vive l’automazione.

| Pro | Contro |
| --- | --- |
| Niente da installare sul runner | Una chiamata di rete, con tutto quello che implica |
| Lo stesso output della conversione interattiva | I limiti di dimensione si applicano a quello che puoi inviare |
| Si adatta a una pull request o a un job notturno | Meno flessibile di un Pandoc locale con modelli |

**Per chi è?** Per squadre i cui runner CI sono bloccati, o per chiunque non voglia un’installazione Haskell in un container per trasformare un file in una pagina. Vale la pena dirlo chiaramente: Pandoc è lo strumento più capace e una chiamata ospitata è quella più comoda, e la comodità è una ragione legittima per scegliere la cosa più piccola.

## Dove la risposta ovvia fallisce, e cosa costa cambiare

Ecco la parte che gli elenchi di alternative — e questo, finora — hanno girato attorno. **Un editor e un convertitore sono strumenti diversi, e la maggior parte delle persone che cercano “alternativa a Dillinger” vogliono il secondo.** Raccomandare un altro editor a chi ha in mano un file solo è la risposta sbagliata data con sicurezza, ed è la risposta più comune su internet.

Il segnale è cosa stavi facendo quando ti sei infastidito. Se stavi scrivendo, volevi un editor e Dillinger era vicino: la soluzione è StackEdit, o un’applicazione, o niente affatto. Se stavi incollando, volevi un convertitore, e ogni editor su ogni elenco è una deviazione con un cursore dentro. Incollare un documento finito in un editor per raggiungere il suo menu di export è un ripiego per non avere lo strumento giusto, ed è invisibile come ripiego perché richiede solo un minuto.

Vale la pena dichiarare anche i costi del cambiamento, perché “cambiare” non è gratis.

**Cambiare editor è una migrazione, non un clic.** I documenti nello storage del browser di Dillinger sono nello storage del browser di Dillinger. Non sono in una cartella, non sono in un repository, e nessun altro strumento li troverà. Prima di spostarti, apri ognuno e scarica il Markdown, perché nel momento in cui accedi a qualcos’altro le vecchie bozze sono a una cache pulita dal sparire. Non è una critica a Dillinger — ogni strumento con storage nel browser ha la stessa proprietà — ma è il passo che le persone saltano.

**Un editor desktop sposta il problema ai tuoi backup.** I file locali sono tuoi, il che significa che il file che non esiste più è anche tuo. La sincronizzazione cloud di Dillinger esisteva per un motivo, e rifiutarla è una decisione di essere responsabile delle copie.

**La sintassi personalizzata non viaggia.** I diagrammi e gli spartiti di StackEdit, i link wiki e gli embed di Obsidian, le chiavi di citazione di Zettlr: ognuno è utile dentro il proprio strumento e nessuno è Markdown standard. Un documento scritto con quelli è portabile nel modo in cui è portabile un documento scritto in un dialetto — quasi sempre, finché non arrivano le parti interessanti.

**Un export non è un documento finché non si apre da qualche altra parte.** È il fallimento che le persone attribuiscono all’editor. Un export stilizzato può ancora fare riferimento a stili che non porta con sé, e l’unico test che lo scopre è aprire il file in un browser diverso, su una macchina diversa, con la rete spenta. Fallo una volta con il tuo export attuale prima di concludere che il problema era lo strumento, perché se il nuovo strumento ha lo stesso comportamento avrai migrato per niente. La proprietà che stai verificando ha [un nome e una definizione](/blog/best-markdown-to-html-converters) che vale la pena conoscere, e decide se un file inviato per email funziona.

**Rifiutare l’integrazione di solito è gratis.** Il motivo più comune in questa ricerca è la richiesta di accesso al cloud, e la correzione più piccola possibile è non collegare niente: scrivi nella scheda, esporta, scarica, fatto. Dillinger funziona così di default e lo dice. Andarsene per un dialogo che puoi chiudere è la sola migrazione in questa pagina che davvero nessuno deve fare.

## Come scegliere

1. **Decidi se stai scrivendo o convertendo, e sii onesto al riguardo.** Se non c’è più niente da digitare, un editor è la forma sbagliata e continuerai a pagarlo in passaggi extra ogni singola volta.
2. **Controlla dove va il file prima di incollarlo.** Uno strumento lato browser converte sulla tua macchina e uno ospitato riceve il tuo documento; entrambe le progettazioni sono legittime, e solo una delle due è accettabile per qualcosa di confidenziale.
3. **Prova l’export da qualche altra parte, con la rete spenta.** Un file che sembra giusto nello strumento e sbagliato in un’email è il difetto che costa più reputazione per il minimo sforzo di scoprirlo.
4. **Confronta le installazioni con il numero di esecuzioni.** Una conversione non dovrebbe richiedere un gestore di pacchetti; cinquanta conversioni non dovrebbero richiedere una persona che clicca un pulsante, e il punto di incrocio arriva prima di quanto chiunque si aspetti.
5. **Preferisci lo strumento che lascia i tuoi file in una cartella.** Lo storage del browser è comodo finché non si pulisce una cache, e un documento che non trovi con un gestore di file è un documento che hai già parzialmente perso.
6. **Concedi l’accesso al cloud solo quando la sincronizzazione è la funzione che volevi davvero.** Collegare un intero Drive o repository per spostare un file è un permesso permanente scambiato per una comodità una tantum, e il file si poteva scaricare invece.

## Conclusione

Dillinger è un editor Markdown gratuito, con licenza MIT, basato su browser, che tiene il tuo documento nel tuo browser e non chiede niente finché non gli chiedi di sincronizzare — e se il compito era scrivere, resta un posto ragionevole per farlo. Il motivo per cui la ricerca esiste è che la maggior parte delle persone ci arriva con in mano un file finito, e un editor è lo strumento sbagliato per un file finito. Per quel caso, [la conversione da Markdown a HTML di TransformPipe](/) restituisce un documento completo e autonomo nel browser senza niente caricato e nessun account, che è il compito piuttosto che una nuova casa per la tua scrittura. Se vuoi il software sul tuo disco, StackEdit, Typora, Obsidian e Zettlr sono le vere alternative, con le loro licenze sopra. E se la conversione avverrà più di una manciata di volte, smetti del tutto di valutare editor e installa Pandoc.

## Domande frequenti

### Dillinger è ancora mantenuto ed è sicuro da usare?

Il repository è pubblico sotto licenza MIT e il sito attuale descrive uno stack Next.js e Monaco, quindi ci si lavora ancora invece di essere abbandonato (verificato su github.com/joemccann/dillinger e dillinger.io, 9 settembre 2026). Sulla sicurezza, le sue stesse pagine dichiarano che i documenti persistono nello storage del tuo browser e che nessun dato sta sui suoi server, il che è una posizione più forte di quanto prendano la maggior parte degli editor web gratuiti.

### Qual è la migliore alternativa gratuita a Dillinger?

Dipende da quale metà di Dillinger stavi usando. Per l’editor, StackEdit è gratis sotto Apache Licence 2.0 ed è costruito per funzionare offline in una scheda del browser. Per la conversione, un convertitore lato browser che restituisce un unico file HTML autonomo è gratis e salta del tutto l’editor.

### C’è un’alternativa a Dillinger che non si collega a Dropbox o Google Drive?

Diverse, e Dillinger stesso è una di queste se rifiuti l’integrazione — niente nell’editor richiede un drive collegato. Se preferisci che l’opzione non esista nemmeno, il repository di Markdown Live Preview descrive solo uno strumento di anteprima, quindi non c’è nessun drive da collegare, e un convertitore non ha niente da collegare perché non c’è nessun documento da conservare.

### Posso auto-ospitare Dillinger?

Sì. Il repository è concesso in licenza MIT e documenta una build e un avvio semplici (verificato su github.com/joemccann/dillinger, 9 settembre 2026), quindi far girare la tua copia è una strada supportata e la licenza permette di modificarlo. Risolve l’obiezione del dominio ospitato senza rinunciare all’editor, al costo di mantenere un deploy.

### Perché il mio HTML esportato sembra diverso dall’anteprima?

Perché un’anteprima è stilizzata dall’applicazione e un export è stilizzato da qualunque cosa il file esportato porti o richiami. Se il file punta a uno stile che non include, renderizza senza stile ovunque il riferimento fallisca. Apri il tuo export in un altro browser con la rete spenta, e saprai in un secondo che tipo di file hai.

### Serve un editor per convertire Markdown in HTML?

No, ed è la frase più utile di questa pagina. Un convertitore prende il file e restituisce un documento, senza bozza da salvare, nessuna sincronizzazione da configurare e nessun permesso da concedere. Se non avevi mai intenzione di scrivere niente, l’editor era sempre un passaggio in più.

### Quale alternativa funziona per uno script o un job CI?

Pandoc, che è gratis sotto GPL e le cui opzioni `--standalone` e `--embed-resources` producono un unico file HTML senza dipendenze esterne (verificato su pandoc.org, 9 settembre 2026). Dove installare Pandoc su un runner è l’ostacolo, un’API di conversione, una CLI senza dipendenze o una GitHub Action fanno lo stesso lavoro via rete.
