---
title: "Alternative a StackEdit nel 2026: sincronizzazione, file, desktop ed export singoli"
description: "Alternative a StackEdit divise per il motivo che ti ha portato a cercarle: una sincronizzazione che si è rotta, documenti che vuoi come file"
date: 2026-09-07
tag: Workflow
keywords: alternativa a stackedit, alternative a stackedit, stackedit offline, editor markdown senza browser, editor markdown con sync google drive, editor markdown self-hosted, da workspace a file markdown, stackedit export html
---

A metà di un documento l'indicatore di sincronizzazione smette di essere d'accordo con sé stesso. La copia nella scheda ha un paragrafo che quella su Google Drive non ha. La connessione a GitHub chiede di essere autorizzata di nuovo. Un portatile rimasto chiuso per un mese si risveglia con una versione più vecchia dello stesso file e la propone, allegramente, come quella da mantenere. Di solito non si perde niente. Ma venti minuti sono andati nell'impianto idraulico del documento invece che nel documento, ed è in quel momento che la maggior parte delle persone comincia a guardarsi intorno.

L'altra strada che porta a questa pagina è più silenziosa. Non si è rotto niente. Hai solo notato che quello che scrivi vive dentro una scheda del browser, in uno spazio di archiviazione che non puoi vedere, su una macchina dove svuotare i dati del sito è un gesto normale di pulizia, e preferiresti che vivesse in una cartella che puoi elencare.

### In breve

Se è la sincronizzazione ad essersi rotta, la soluzione duratura è di solito smettere di avere uno spazio di lavoro e cominciare ad avere una cartella: un repository Git, oppure Syncthing, oppure un client di archiviazione cloud, con sopra l'editor che preferisci. Se vuoi file al posto di uno spazio di lavoro, Obsidian, VS Code e Zettlr lavorano tutti direttamente su file `.md` sul disco e non aggiungono nulla che tu non possa vedere. Se vuoi un'applicazione presente indipendentemente dal browser, Mark Text è gratis con licenza MIT e Typora è un piccolo acquisto una tantum. E se tutto quello che volevi era un documento trasformato in una pagina web da inviare, in quel compito non c'è nessuno spazio di lavoro: è una conversione, e richiede circa un minuto.

## StackEdit alle sue condizioni

Vale la pena essere precisi su cosa stai per sostituire, perché StackEdit non è una singola funzione. La sua stessa pagina descrive un editor che permette di "scrivere offline come una qualsiasi applicazione desktop", sincronizza i file con Google Drive, Dropbox e GitHub, li pubblica come articoli su Blogger, WordPress e Zendesk, e lascia scegliere se l'output esce come Markdown, come HTML, oppure formattato tramite il motore di template Handlebars. La sintassi gestita è elencata come GitHub Flavored Markdown, Markdown Extra e CommonMark, più espressioni matematiche LaTeX, diagrammi UML, spartiti in notazione ABC ed emoji. La pagina dichiara una licenza Apache License (verificato su stackedit.io, il 9 settembre 2026).

Il repository completa il quadro. Il progetto ha licenza Apache-2.0 e si descrive come un editor Markdown open source completo, basato su PageDown, la libreria Markdown usata da Stack Overflow. Esiste un'app Chrome e un'estensione Chrome, un `stackedit.js` incorporabile per portare l'editor dentro un sito proprio, un chart Helm per il deploy su Kubernetes con le credenziali di Dropbox, Google, GitHub e WordPress configurate, e un forum della comunità su community.stackedit.io (verificato su github.com, il 9 settembre 2026).

Quindi in una sola scheda ci sono quattro prodotti distinti: un editor, uno spazio di lavoro, un client di sincronizzazione e un pubblicatore. Ed è esattamente questo insieme a rendere confusa la sostituzione di StackEdit. Le persone dicono "mi serve un'alternativa a StackEdit" intendendo quattro cose diverse, e l'alternativa che risponde a una di esse è spesso inutile per le altre. Un editor desktop sostituisce l'editor e nient'altro. Un repository sostituisce lo spazio di lavoro e la sincronizzazione e non offre nessun editor. Un convertitore non sostituisce niente e finisce il lavoro che stavi davvero cercando di finire.

L'altro fatto strutturale conta più di qualunque funzione: un documento StackEdit è un record dentro uno spazio di lavoro, ed è lo spazio di lavoro la cosa primaria. I file su Drive o in un repository sono ciò con cui lo spazio di lavoro si sincronizza, non il luogo dove il documento vive. Ogni altra opzione di questa pagina inverte quella relazione: il file è la cosa primaria e gli strumenti sono intercambiabili sopra di esso. Quasi ogni motivo per lasciare StackEdit si riduce a voler quella inversione.

## Confronto rapido: il bigliettino

| Opzione | Il motivo a cui risponde | Che cos'è | Dove vivono i documenti | Prezzo |
| --- | --- | --- | --- | --- |
| StackEdit | Quello che hai ora | Spazio di lavoro nel browser, con sync e pubblicazione | Storage del browser, replicato su un provider | Gratis, licenza Apache |
| Repository Git, con qualsiasi editor | Sync che puoi ispezionare e annullare | Controllo di versione, non sincronizzazione | File sul disco, storico nel repository | Gratis |
| Syncthing | Sync senza nessun servizio in mezzo | Sincronizzazione continua dei file tra i tuoi dispositivi | File sul disco, su ogni dispositivo | Gratis, MPL-2.0 |
| Un client di archiviazione cloud | Sync che stai già pagando | Sincronizzazione della cartella a livello di sistema operativo | File in una cartella sincronizzata | Incluso nell'account di storage |
| Obsidian | File, con un'applicazione vera sopra | App desktop e mobile su una cartella | File `.md` semplici in un vault | Gratis per qualunque uso |
| VS Code | File, accanto al codice che documentano | Editor con anteprima Markdown integrata | File nella cartella che hai aperto | Gratis |
| Zettlr | File, con i riferimenti attaccati | Un ambiente di scrittura e pubblicazione | File sul disco | Gratis, sostenuto da donazioni |
| Mark Text | Un'applicazione desktop gratuita | Editor a un solo riquadro, output HTML e PDF | File sul disco | Gratis, MIT |
| Typora | Un'applicazione desktop in cui vivere | Editor a un solo riquadro con export ampio | File sul disco | 14,99 $, fino a tre dispositivi |
| HedgeDoc | La scheda del browser, su un server tuo | Note Markdown collaborative in tempo reale | Il tuo server | Gratis, AGPLv3 |
| Un convertitore nel browser | Un documento diventa una pagina, niente workspace | Markdown in HTML, convertito in locale | Da nessuna parte: il file resta con te | Gratis |
| Pandoc | Molti documenti, molti formati, via script | Convertitore di documenti da riga di comando | File sul disco | Gratis, GPL |

Leggi la tabella come quattro gruppi invece che come dodici opzioni. Le righe due, tre e quattro sostituiscono la sincronizzazione. Le righe cinque, sei e sette sostituiscono lo spazio di lavoro con dei file. Le righe otto e nove sostituiscono la scheda con un'applicazione. La riga dieci mantiene la scheda e sposta il server con cui parla. Le righe undici e dodici non sostituiscono niente e finiscono un documento. Dove finisci dipende interamente da quale delle quattro cose si è rotta.

## Motivo uno: si è rotta la sincronizzazione

È il caso più comune, e i guasti hanno tutti la stessa forma. Uno spazio di lavoro è legato a un solo account provider, quindi un documento scritto mentre sei collegato con l'account Google sbagliato finisce in un posto dove non andrai a cercarlo. I token di autorizzazione scadono o vengono revocati quando un amministratore stringe una policy dello spazio di lavoro, e la scheda continua a lasciarti scrivere mentre la connessione col provider è morta. Due browser, oppure un browser e un telefono, tengono ognuno una copia, e un conflitto va risolto da una persona che legge due versioni dello stesso paragrafo. E quando un documento esiste solo nello storage di un browser perché la sincronizzazione non è mai stata collegata, svuotare i dati del sito è una perdita di dati travestita da manutenzione.

Niente di tutto questo è specifico di StackEdit. È quello che succede quando la sincronizzazione è una funzione dentro un'applicazione invece che uno strato sotto di essa. Le alternative qui sotto la spostano sotto.

### Git come strato di sincronizzazione

Un repository non è un servizio di sync, ed è proprio questo il punto. Non succede niente finché non fai un commit, il che significa che la versione che hai è quella che hai fatto tu, e i conflitti di merge sono espliciti invece di essere un dialogo che ti chiede quale dei due paragrafi intendevi. Hai uno storico, quindi un paragrafo cancellato tre settimane fa è recuperabile, cosa che nessun client cloud e nessun workspace nel browser ti daranno mai.

| Pro | Contro |
| --- | --- |
| Ogni versione è recuperabile, con un messaggio che dice perché | Devi fare commit, e te ne dimenticherai |
| I conflitti sono visibili e risolvibili riga per riga | I conflitti di merge nella prosa sono fastidiosi da leggere |
| Funziona con qualsiasi editor di questa pagina, e con nessuno | Nessuna storia sul telefono senza un'app che parli Git |
| Il remoto è anche il trigger di pubblicazione | Un repository è un'abitudine, non un'impostazione |

**Per chi è:** per chiunque abbia già i documenti vicino al codice, e per chiunque abbia perso del lavoro una volta e non intenda farlo di nuovo. Trasforma anche la pubblicazione da un bottone in una build, il che è un guadagno più che una perdita: il push di un branch può rendere e distribuire il documento, e [pubblicare direttamente da un repository](/blog/publish-markdown-from-github-actions) è una strada già ben battuta.

### Syncthing — sincronizzazione senza niente in mezzo

Syncthing si descrive come un programma di sincronizzazione file continua che sincronizza i file tra due o più computer in tempo reale. La sua pagina è diretta sull'architettura: nessuno dei tuoi dati viene mai conservato in un posto diverso dai tuoi computer, e non esiste un server centrale che possa essere compromesso. Funziona su macOS, Windows, Linux, FreeBSD, Solaris, OpenBSD e altre piattaforme, e si amministra tramite un'interfaccia web (verificato su syncthing.net, il 9 settembre 2026). Il codice ha licenza MPL-2.0 (verificato su github.com, il 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Nessun account, nessun provider, nessuna quota | Entrambi i dispositivi devono essere svegli per sincronizzarsi |
| I file restano file semplici in una cartella semplice | La configurazione è per dispositivo, e la prima porta via una serata |
| Niente da autorizzare di nuovo dopo sei mesi | Nessuno storico: una modifica sbagliata si propaga alla stessa velocità di una buona |
| Funziona per una cartella di qualsiasi cosa, non solo Markdown | Il telefono è possibile ma non è il caso semplice |

**Per chi è:** per chi vuole i documenti su tre macchine senza un'azienda in mezzo. Abbinalo a un repository se vuoi anche lo storico, perché Syncthing è molto bravo a far concordare ogni dispositivo e non ha nessuna opinione su quale versione fosse quella giusta.

### HedgeDoc — la stessa scheda, su un server che controlli tu

Se quello che ti piaceva di StackEdit era il fatto di essere una scheda del browser, e quello che non ti piaceva era di chi fosse quella scheda, l'opzione self-hosted è HedgeDoc. Permette di creare note Markdown collaborative in tempo reale, ha licenza AGPLv3, offre una guida all'installazione per il self-hosting e un'istanza demo, ed esiste un'alpha di HedgeDoc 2 (verificato su github.com, il 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Più persone nello stesso documento contemporaneamente | Adesso gestisci un server, con i suoi backup |
| Niente da installare per chi lo usa | Le note vivono nel tuo database, quindi esportare è un lavoro |
| L'URL è tuo e non se ne va da nessuna parte | Da solo, è più infrastruttura di quanta serva a chi scrive da solo |
| Uno spazio di lavoro nel browser di cui puoi controllare il backup dello storage | Non è una cartella di file, a meno che tu non lo esporti in una |

**Per chi è:** per un team che vuole scrivere in condiviso più che avere file, e ha già qualcuno che gestisce infrastrutture. Per una singola persona, questo scambia un problema di sincronizzazione con un problema operativo, e il secondo è più grande.

## Motivo due: vuoi i documenti come file

Il secondo motivo non ha niente a che fare con qualcosa che si è rotto. È il disagio di non poter indicare il tuo lavoro con un dito. Una cartella di file `.md` si può elencare, grep-are, comprimere, copiare su una chiavetta, aprire con qualsiasi cosa e leggere tra cinquant'anni. Uno spazio di lavoro si può esportare, ed esportare è una cosa che devi ricordarti di fare.

Tutte le tre opzioni qui sotto sono applicazioni ordinarie sopra una cartella ordinaria, e passare dall'una all'altra è gratis perché nessuna di esse possiede i file. Il compromesso è che nessuna di esse sincronizza niente da sola, ed è il tema della sezione onesta più avanti. Per l'esperienza di scrittura in sé — come sono disposti i riquadri, che sensazione dà digitare — il [confronto tra editor Markdown](/blog/best-markdown-editors) entra più nel dettaglio di quanto sia utile qui; quello che segue riguarda l'archiviazione.

### Obsidian — una cartella, con un'applicazione sopra

Obsidian apre una cartella di file Markdown, la chiama vault e aggiunge collegamenti, ricerca e un sistema di plugin. I file restano i file; disinstalla Obsidian e la cartella resta uguale. Il suo sito dichiara che conserva le note in locale come semplici file di testo Markdown, che usa formati aperti così non resti mai bloccato, e che esistono applicazioni mobili oltre a quella desktop. La pagina della licenza dichiara che Obsidian è gratuito per qualsiasi uso, incluso personale, commerciale e non profit, e che le licenze commerciali sono licenze opzionali che aiutano a mantenere il progetto sostenuto dagli utenti (verificato su obsidian.md, il 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| File semplici sul disco, nessun database, nessun passaggio di export | La sua sintassi di collegamento è tutta sua, e non viaggia dappertutto |
| Gratis per uso commerciale, senza nessun account da creare | L'ecosistema di plugin è un modo per perdere un pomeriggio |
| Desktop e telefono, sopra qualunque cartella tu indichi | La sincronizzazione è una decisione separata che adesso è tua |
| Ricerca su tutto quello che hai mai scritto | Vuole essere il tuo intero sistema di note, non un documento |

**Per chi è:** per chi ha un corpo di lavoro invece di un documento — la persona che ha duecento documenti StackEdit e ha iniziato a notare che trovarne uno è più difficile che scriverlo.

### VS Code — la cartella che hai già aperta

Se i tuoi documenti stanno vicino al codice, l'editor è già in esecuzione. La sua documentazione dichiara che VS Code gestisce i file Markdown fin da subito e che puoi passare dalla fonte a un'anteprima del file (verificato su code.visualstudio.com, il 9 settembre 2026), e la sua integrazione Git fa sì che la domanda sulla sincronizzazione e quella sulla versione ricevano risposta insieme, dallo stesso strumento.

| Pro | Contro |
| --- | --- |
| Già installato, per la maggior parte degli sviluppatori | È un IDE, e sembra un IDE mentre scrivi prosa |
| Git, terminale e file nella stessa finestra | L'export richiede un'estensione, e le estensioni variano |
| Gratis, e uguale su Windows, macOS e Linux | Nessun telefono |
| Le estensioni coprono linting, tabelle e controllo ortografico | Lo stile dell'anteprima non è quello dell'export |

**Per chi è:** per gli sviluppatori, e per chiunque i cui documenti siano documentazione. Il README e le note di rilascio appartengono vicino alla cosa che descrivono, un argomento che non ha niente a che fare con gli editor.

### Zettlr — file, con i riferimenti attaccati

Zettlr si definisce un ambiente di pubblicazione a tutto tondo che copre il processo dalle prime note fino all'invio a una rivista o a un manoscritto di libro, con integrazione di un gestore di riferimenti e supporto alle citazioni. La sua pagina dichiara che è software libero e open source, sostenuto da donazioni, senza sincronizzazione cloud forzata e senza telemetria, disponibile per Windows, macOS e Linux (verificato su zettlr.com, il 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Citazioni e bibliografie come funzione di prima classe | Pensato per la scrittura accademica, e costruito di conseguenza |
| Gratis, senza nessuna componente cloud da cui disattivarsi | Più pesante di un editor di note se scrivi solo note |
| File semplici sul disco, cartelle di progetto, export | La sua catena di export si aspetta che tu impari un po' di Pandoc |
| Documenti e manoscritti lunghi sono il caso pensato dal design | Non è uno strumento da telefono |

**Per chi è:** per chiunque abbia documenti con fonti. Se il tuo spazio di lavoro StackEdit è pieno di espressioni LaTeX e citazioni a metà, questa è la cosa più simile a una casa che sia anche solo una cartella.

## Motivo tre: vuoi un'applicazione, non una scheda, e la vuoi offline

StackEdit pubblicizza la scrittura offline, e l'affermazione è vera nel senso specifico che un browser può mettere in cache un'applicazione e farla funzionare senza rete. Quello che le persone intendono di solito per offline è più ampio, e lo scarto tra le due cose è dove vive la frustrazione.

Uno spazio di lavoro nel browser è capace di funzionare offline ma non è local-first. L'applicazione deve essere stata caricata in quel browser, in quel profilo, almeno una volta. Una finestra privata parte da zero. Un browser diverso è un'installazione diversa con un archivio diverso. I dati del sito svuotati da te, da una policy o da un'estensione per la privacy ben intenzionata si portano via i documenti a meno che un provider di sincronizzazione non fosse già collegato. E una scheda che non è aperta non è un'applicazione: chiuderla per errore è un solo tasto, e ripristinare la sessione è un'operazione diversa dall'apertura di un file. Niente di tutto questo è un difetto di StackEdit. È quello che è lo storage del browser.

Un'applicazione sul disco cambia tutto questo in un colpo. Il documento è un file con un percorso. L'editor è nel dock. I backup lo coprono già, perché i backup coprono il disco. Due opzioni meritano di essere nominate, e stanno ai due lati di un prezzo molto piccolo.

### Mark Text — gratis, MIT, e rendering mentre digiti

Mark Text si descrive come un semplice editor Markdown open source concentrato su velocità e usabilità. Ha codice sorgente, modalità macchina da scrivere e concentrazione, produce HTML e PDF, ha licenza MIT e funziona su Linux, macOS e Windows (verificato su github.com, il 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Gratis con licenza MIT, nessun account | Controlla l'attività recente del repository prima di affidartici |
| Il rendering avviene mentre scrivi, così la sintassi non intralcia | Solo output HTML e PDF |
| File locali, niente caricato, niente da autorizzare | Nessuna sincronizzazione propria |
| Tre modalità di scrittura, incluso un puro sorgente | Nessuna versione mobile |

**Per chi è:** per chi sostituisce la metà "editor" di StackEdit a costo zero, su una macchina che amministra da solo.

### Typora — quello a pagamento, e il menu di export è il motivo

Typora sostituisce il Markdown con il suo rendering mentre digiti, e il suo elenco di export è il più ampio tra gli editor qui. La sua pagina dichiara un prezzo di 14,99 $ senza tasse, una licenza che copre fino a tre dispositivi e una prova gratuita di 15 giorni, ed elenca l'export in PDF con segnalibri insieme a docx, OpenOffice, LaTeX, MediaWiki ed EPUB (verificato su typora.io, il 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Export verso formati che nessun editor da browser raggiunge | A pagamento, e solo desktop |
| Un solo riquadro: niente fonte e anteprima da tenere allineate | Nascondere la sintassi piace a certi scrittori e non ad altri |
| File locali; la prova è lunga abbastanza da decidere | Non è uno spazio di lavoro, e non è un sincronizzatore |
| I temi controllano l'aspetto dell'HTML esportato | Un documento alla volta, per progetto |

**Per chi è:** per chi scrive quasi tutti i giorni e ha bisogno che il documento esca come qualcosa diverso da Markdown. Se il compito ricorrente è "invialo come file Word", il menu di export si ripaga subito.

C'è anche l'opzione da browser più piccola. Dillinger è l'altro editor noto in una scheda, costruito attorno a un documento invece che a uno spazio di lavoro: un editor, un'anteprima e un menu di export. Come sostituto di StackEdit ha senso solo se quello che volevi erano meno parti in movimento invece che parti diverse, e [la stessa domanda a quattro vie si applica anche a chi lascia lui](/blog/dillinger-alternatives).

## Motivo quattro: volevi una sola conversione, e l'export è tutto il lavoro

Ecco il caso che non è affatto una questione di editor. Qualcuno ha chiesto il documento come pagina web. Sei arrivato a cercare un'alternativa a StackEdit perché è lì che vive il documento, ma quello di cui hai bisogno non è un nuovo posto dove scrivere: è un file che si apre correttamente sulla macchina di qualcun altro. È il lavoro di un convertitore, e ci vuole un minuto invece che una migrazione.

### Cosa è davvero l'output HTML di StackEdit

La pagina di StackEdit descrive l'output come Markdown, HTML, oppure formattato tramite il motore di template Handlebars (verificato su stackedit.io, il 9 settembre 2026). La parte di Handlebars è quella che le persone si perdono: l'involucro attorno al documento reso è tuo da definire, quindi puoi produrre qualunque markup si aspetti una destinazione di pubblicazione. È anche un template che devi scrivere tu, e finché non lo scrivi ottieni il predefinito dello strumento invece di un documento pensato per un destinatario.

Quel predefinito è dove vanno storte tre cose specifiche, e tutte le tre vale la pena controllarle prima di inviare qualcosa:

1. **È un documento o un frammento?** Un rendering del tuo Markdown — titoli, paragrafi, tabelle — non è lo stesso di un file con un doctype, una testa e degli stili. Aperto da solo, un frammento si mostra come testo nero nel font predefinito del browser e alla larghezza intera della finestra, il che è HTML valido e sembra rotto a chiunque lo riceva.
2. **Chiede qualcosa alla rete?** Un foglio di stile collegato o un font web da una CDN sembra a posto sulla tua macchina, dove il browser lo ha in cache, e sembra sbagliato su un treno. Dice anche al browser del destinatario di fare una richiesta verso un altro posto, cosa che alcuni destinatari notano.
3. **Le parti sofisticate sopravvivono?** Le espressioni LaTeX, i diagrammi UML e gli spartiti ABC sono resi dentro l'editor da librerie in esecuzione nella pagina. Se arrivano nel file esportato come immagini, come markup o come il testo sorgente che hai digitato non è qualcosa da presumere. Esporta un documento che ne contenga uno di ciascuno e guarda.

La proprietà che vuoi è un file autonomo: un documento, stili incorporati, nessuna richiesta esterna, così che si mostri identico su un portatile senza connessione. [Cosa significhi nel dettaglio, e come verificarlo](/blog/self-contained-html-explained) è un argomento a sé, ed è la differenza tra inviare a qualcuno un documento e inviargli un documento più delle istruzioni.

### Un convertitore, senza nessuno spazio di lavoro attaccato

Per il caso del documento singolo, un convertitore lato browser è la strada più corta. Copia il Markdown fuori dall'editor, oppure scarica il file `.md`, e [convertilo in un file HTML autonomo](/) — TransformPipe lo fa nel browser, e da disconnesso non carica niente da nessuna parte, il che per un documento non ancora pubblicato è tutto il punto. Non c'è nessun account, nessuno spazio di lavoro, e niente da sincronizzare, perché lo strumento non sta cercando di conservare niente.

La stessa forma copre i lavori scomodi ai margini dell'abbandono di uno spazio di lavoro: un documento che deve diventare oggi una pagina per un collega, un export che vuoi controllare prima di fidarti del resto, un file di qualcun altro che devi leggere e rendere senza adottare i suoi strumenti.

### Pandoc, quando ce ne sono duecento

Se la risposta a "quanti documenti" è un numero invece di "questo qui", il lavoro si sposta sulla riga di comando. Pandoc legge e scrive circa quaranta formati, è gratis con licenza GPL, e avvolgerà l'output in un documento completo invece che in un frammento quando glielo chiedi. Non ha nemmeno nessuna opinione sul tuo spazio di lavoro, cosa che vuoi quando il compito è percorrere una cartella uscita da un export e trasformarla tutta in qualcos'altro. [Fare Markdown-in-HTML da un terminale](/blog/markdown-to-html-from-the-command-line) è una domanda più stretta dell'intera gamma di Pandoc, e per un lavoro isolato è di solito più strumento di quanto serva — ma per una migrazione è esattamente la quantità giusta.

## Quanto vale davvero uno spazio di lavoro nel browser con sincronizzazione

Ogni opzione qui sopra ha un costo, e la versione onesta di questo articolo dice chiaramente che la forma di StackEdit è una buona forma. È comodo in un modo in cui "usa semplicemente dei file" non lo è, e far finta del contrario prepara le persone a cambiare e poi rimpiangerlo in silenzio.

**Qualcun altro ha risolto la sincronizzazione per te.** Google Drive, Dropbox e GitHub, collegati e funzionanti, sono un vero pezzo di ingegneria che non hai dovuto fare tu. Passa a una cartella di file e quello diventa il tuo lavoro. Le opzioni sono un repository di cui devi ricordarti di fare il commit, uno strumento peer-to-peer che ha bisogno di due dispositivi svegli insieme, oppure un client cloud senza storico che propagherà volentieri un errore a ogni macchina che possiedi. Ognuna di queste funziona. Nessuna è priva di sforzo, e lo sforzo si ripete.

**Nessuna installazione, su qualsiasi macchina.** Un portatile di lavoro bloccato, un desktop preso in prestito, un computer di biblioteca: uno spazio di lavoro nel browser è disponibile su tutti loro e un editor desktop su nessuno. Se parte del motivo per cui usi StackEdit è che non puoi installare software, tutto il gruppo desktop sopra non è un'opzione, e le alternative oneste sono un altro strumento da browser oppure uno self-hosted.

**Un telefono che funziona.** Gli editor da browser sono utilizzabili su un telefono in un modo in cui le applicazioni desktop basate su cartelle non lo sono, a meno che l'applicazione non abbia una propria app mobile e tu non abbia risolto separatamente il problema di portare la cartella sul telefono.

**Pubblicare era un solo bottone.** StackEdit pubblica su Blogger, WordPress e Zendesk. File e un repository sostituiscono tutto questo con una pipeline che costruisci tu. Meglio, alla lunga — con versioni, revisionabile, automatizzata — ma non è gratis. È un pomeriggio, e poi una superficie di manutenzione.

**Anche andarsene costa qualcosa.** Uno spazio di lavoro va svuotato un documento alla volta, o attraverso qualunque strada in blocco esista, e i documenti che ne escono potrebbero non essere quelli che ricordi. L'elenco di sintassi di StackEdit include Markdown Extra e CommonMark insieme a GitHub Flavored Markdown, più LaTeX, UML e notazione ABC. Alcuni di questi sono standard, alcuni sono estensioni, e le estensioni sono esattamente ciò che uno strumento diverso non riconoscerà: un diagramma diventa un blocco di codice, una formula diventa segni di dollaro letterali e testo. Non è corruzione, è [la differenza tra le varianti](/blog/commonmark-gfm-and-the-flavours), ed è la parte di una migrazione che richiede più tempo del previsto. Convertiti prima due o tre dei tuoi documenti più complicati, e decidi con quelli davanti.

**E la cosa che non cambia.** Il tuo Markdown è il tuo Markdown. Ogni strumento qui legge gli stessi file, quindi la decisione è reversibile in un modo in cui lasciare un formato proprietario non lo è. Vale la pena dirlo perché abbassa la posta in gioco: stai scegliendo dove vivono i documenti e chi li sposta, non se potrai leggerli l'anno prossimo.

## Come scegliere

1. **Nomina in una frase quello che si è rotto.** "La sync ha fallito", "voglio i file", "voglio un'app", "mi serve un solo file HTML" portano a quattro risposte diverse, e scegliere uno strumento prima di nominare il motivo è come si finisce a migrare due volte.
2. **Decidi chi è responsabile della sincronizzazione prima di scegliere un editor.** Se la risposta è "io, con un repository" puoi usare qualsiasi editor di questa pagina; se la risposta è "il servizio di qualcun altro", le tue opzioni realistiche sono uno spazio di lavoro nel browser o un'applicazione che vende sync, e vale la pena conoscere presto quel vincolo.
3. **Controlla se puoi installare software.** Su una macchina gestita tutto il gruppo desktop non è disponibile, e il confronto utile è tra strumenti da browser e uno self-hosted invece che tra editor.
4. **Esporta prima i tuoi tre documenti peggiori.** Quello con una tabella, quello con una formula, quello con un diagramma. Se quei tre sopravvivono, sopravvivrà il resto; se non sopravvivono, l'hai scoperto in dieci minuti invece che dopo aver spostato duecento file.
5. **Apri l'HTML esportato altrove, con la rete spenta.** Un browser diverso, idealmente un'altra macchina. Quel singolo test scova frammenti, stili mancanti, font da CDN e diagrammi che non hanno viaggiato, ed è l'unico test che rispecchia quello che vede il destinatario.
6. **Conta il lavoro che si ripete, non quello di configurazione.** Un repository costa un commit per sessione per sempre. Un client cloud non costa niente per sessione e non ti dà nessuno storico. Uno spazio di lavoro costa un'autorizzazione ogni pochi mesi. Scegli il costo che davvero continuerai a pagare.

## Conclusione

Non esiste un'unica alternativa a StackEdit perché StackEdit è quattro strumenti in una scheda, e quasi nessuno vuole sostituirli tutti e quattro. Se si è rotta la sincronizzazione, metti uno strato sotto i tuoi file con un repository o Syncthing e usa l'editor che preferisci. Se vuoi i documenti come file, Obsidian, VS Code e Zettlr sono tutte semplici applicazioni sopra una cartella e non ti costa niente provarle in entrambe le direzioni. Se vuoi qualcosa sul disco che si apra senza un browser, Mark Text è gratis e il menu di export di Typora vale il suo piccolo prezzo. E se tutta la faccenda era un solo documento che a qualcuno serve come pagina web, non migrare niente: convertilo, controlla che si apra con la rete spenta e [invialo come un'unica pagina autonoma](/blog/share-a-markdown-document-as-a-link). La domanda sullo spazio di lavoro può aspettare una settimana in cui non c'è nessuna scadenza.

## Domande frequenti

### Qual è la migliore alternativa a StackEdit?

Dipende da quale parte di StackEdit stai sostituendo. Per la metà spazio-di-lavoro-più-file, Obsidian sopra una cartella sincronizzata è la risposta singola più vicina; per la metà editor su desktop, Mark Text è l'opzione gratuita e Typora quella a pagamento; per la scheda del browser in sé, un HedgeDoc self-hosted mantiene la forma e sposta l'archiviazione su un server che controlli tu.

### StackEdit è gratuito e open source?

Sì. Il suo sito dichiara una licenza Apache License, e il repository è Apache-2.0, descritto come un editor Markdown open source completo basato su PageDown (verificato su stackedit.io e github.com, il 9 settembre 2026). Essere open source è anche il motivo per cui esiste la strada del self-hosting.

### Posso fare il self-hosting di StackEdit invece di lasciarlo?

Il repository include un chart Helm per il deploy su Kubernetes, con la configurazione per le credenziali di Dropbox, Google, GitHub e WordPress, e uno `stackedit.js` incorporabile per portare l'editor dentro pagine tue (verificato su github.com, il 9 settembre 2026). Se la tua obiezione riguarda l'istanza ospitata e non lo strumento in sé, è un cambiamento più piccolo che passare a un altro editor.

### Perché il mio documento StackEdit ha smesso di sincronizzarsi con Google Drive?

Le cause abituali sono un'autorizzazione scaduta o revocata, uno spazio di lavoro legato a un account provider diverso da quello con cui sei collegato, oppure due copie divergenti che hanno bisogno di una persona per essere riconciliate. La soluzione duratura non è un bottone diverso ma una disposizione diversa: mantieni il documento come file e lascia che un repository o uno strumento di sincronizzazione lo spostino.

### Esiste un'alternativa a StackEdit che funzioni offline?

Qualsiasi editor desktop funziona offline nel senso pieno, perché il file è sul disco e l'applicazione non ha bisogno di rete per aprirlo. Gli editor da browser sono capaci di funzionare offline ma non local-first: devono essere stati caricati in quel profilo browser una volta, e svuotare i dati del sito elimina quanto non è stato sincronizzato.

### I miei documenti cambieranno se li tolgo da StackEdit?

Il Markdown semplice no. Le estensioni forse: le espressioni LaTeX, i diagrammi UML e la notazione ABC sono elencati tra la sintassi gestita da StackEdit, e uno strumento che non le implementa mostrerà il testo sorgente invece di un rendering. Sposta prima il documento più complicato e guardalo nel nuovo strumento prima di spostare il resto.

### Mi serve un editor se voglio solo un file HTML?

No, ed è l'errore più comune in tutta questa ricerca. Se il compito è "trasforma questo Markdown in una pagina che posso inviare", un convertitore lo fa senza account, senza spazio di lavoro e senza niente da sincronizzare, e l'unica cosa da controllare dopo è che il file restituito si apra correttamente con la rete spenta.

