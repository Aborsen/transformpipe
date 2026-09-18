---
title: "Il miglior editor Markdown nel 2026: undici a confronto per quello che fanno ai tuoi file"
description: Undici editor Markdown a confronto nel 2026 — VS Code, Obsidian, Typora, iA Writer, Zettlr, Notion e Vim — giudicati su dove tengono il testo e cosa esportano.
date: 2026-09-07
tag: Workflow
keywords: miglior editor markdown, editor markdown gratis, editor markdown con anteprima live, editor markdown che esporta in html, obsidian o typora, esportare notion in markdown, editor markdown per windows, miglior editor markdown per mac
---

La maggior parte dei confronti fra editor Markdown si concentra sulla scrittura: quale ha il font più bello, quale attenua il paragrafo su cui non stai lavorando, quale nasconde gli asterischi. È la parte che si nota il primo giorno, e quella che conta meno dal sesto mese in poi.

Quello che conta più avanti è più prosaico. Dove tiene il testo l'editor — in file che vedi in un file manager, oppure in un servizio a cui devi chiedere una copia? Che sintassi aggiunge, che nessun altro strumento capisce? E cosa esce fuori quando qualcuno chiede “puoi mandarmelo come pagina web”, la richiesta che smaschera ogni scorciatoia presa dall'editor mentre tu ti godevi il font.

Qui sotto ne confrontiamo undici, su questi termini. Alcuni sono editor di testo con supporto Markdown, altri sono applicazioni di scrittura, e uno non è affatto un editor Markdown — è in lista perché metà di chi legge questo articolo lo usa come tale.

### In breve

Se hai già VS Code aperto, è il miglior editor Markdown che troverai senza installare niente, perché i tuoi file restano file e git li conosce già. Se vuoi un'applicazione di scrittura comoda sopra una cartella di semplici file `.md`, Typora e iA Writer sono le due che vale la pena pagare. Typora costa 14,99 $ senza tasse, una tantum, per un massimo di tre dispositivi, con una prova di 15 giorni (verificato su typora.io, l'8 settembre 2026). iA Writer si paga una volta per piattaforma, con una prova di 7 giorni e nessuna carta richiesta (verificato su ia.net/writer, l'8 settembre 2026). Obsidian è quello gratuito con l'ecosistema di plugin più grande. Se i tuoi documenti vivono in Notion, non hai un editor Markdown: hai un database con scorciatoie da tastiera a forma di Markdown, e tirare fuori il documento è un lavoro di conversione, non un salvataggio.

## Le tre domande che separano gli editor Markdown

**Modifica file, o documenti?** È la linea di frattura da cui discende ogni altra differenza. Un editor che modifica file apre una cartella, ti mostra i documenti `.md` che contiene, scrive i tuoi tasti dentro quei documenti e li lascia dove un backup, un commit git o un altro programma possono trovarli. Un'applicazione che modifica documenti li tiene nel proprio archivio — un database, lo storage locale del browser, uno spazio di lavoro sincronizzato — e ti offre un pulsante di esportazione al loro posto. Mentre scrivi, i due possono sembrare identici. Smettono di sembrarlo il giorno in cui vuoi il tuo testo altrove.

**Che sintassi aggiunge?** Markdown è un linguaggio piccolo, e ogni editor sopravvissuto qualche anno ha fatto crescere cose che la specifica non prevede: wikilink fra doppie parentesi quadre, blocchi di callout, la transclusione — un documento che include un altro —, l'evidenziazione con il doppio segno di uguale. Niente di tutto questo è in CommonMark, la maggior parte non è nemmeno in GitHub Flavored Markdown, e un convertitore che segue la specifica renderà tutto questo come i caratteri letterali che hai digitato. Non è il convertitore a sbagliare: è il tuo editor ad aver scritto qualcosa che solo il tuo editor legge, in un file che sembra portabile.

**Cosa produce quando il documento deve uscire?** Gli editor rispondono in quattro modi diversi. Alcuni esportano HTML direttamente. Alcuni esportano solo PDF. Alcuni si appoggiano a Pandoc, che devi installare a parte. Alcuni non hanno nessuna esportazione e si aspettano che tu faccia passare il file per qualcos'altro — una posizione ragionevole per un editor di testo, e una scoperta spiacevole con una scadenza addosso. I [convertitori che fanno bene questo lavoro](/blog/best-markdown-to-html-converters) sono una categoria di strumento separata, e sapere in quale categoria ti trovi risparmia un pomeriggio.

C'è una quarta domanda che conta solo per alcuni, ma per quelli conta moltissimo: se il documento viene mai mandato da qualche parte. Un editor online tiene il tuo testo su un server. Per un post di un blog, chi se ne importa. Per il contratto di un cliente, una valutazione del personale o un piano non ancora annunciato, questa è l'intera decisione, presa prima che l'esperienza di scrittura conti in alcun modo.

## Confronto rapido: il bigliettino

| Editor | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| VS Code | Scrivere Markdown che vive in un repository | Anteprima integrata, modifica a livello di cartella, consapevolezza di git | Gratis |
| Obsidian | Un grande insieme personale di note collegate | Cartella locale di file `.md`, ecosistema di plugin, esportazione PDF | Gratis per qualunque uso, anche commerciale |
| Typora | Un'applicazione di scrittura sopra file semplici | Modifica a riquadro unico che si rende mentre scrivi; esportazione HTML, PDF e Word | 14,99 $ una tantum, fino a 3 dispositivi |
| iA Writer | Prosa lunga fra desktop e telefono | Modalità focus, esportazione HTML e PDF con modelli | Acquisto unico per piattaforma |
| Zettlr | Scrittura accademica con citazioni | Citazioni da Zotero e altri; esportazione tramite Pandoc | Gratis, GPL v3 |
| StackEdit | Scrivere in una scheda del browser, anche offline | Funziona offline una volta caricato; si sincronizza con Drive, Dropbox, GitHub | Gratis, Apache 2.0 |
| Dillinger | Un documento rapido con anteprima live | Editor da browser con esportazione HTML e PDF | Gratis, MIT |
| Notion | Pagine di squadra, non documenti Markdown | Scorciatoie in stile Markdown come input; esporta in Markdown, HTML, PDF | Piano gratuito; piani a pagamento a utente |
| Vim / Neovim | Chi vive già in un terminale | Sintassi guidata da plugin, folding, anteprima; conversione da riga di comando | Gratis, open source |
| Nota | Chi scrive su macOS ed è disposto a usare una beta | Editor su file Markdown locali; solo macOS | Beta; nessun prezzo indicato sul sito |
| Mark Text | Un editor desktop gratuito che si rende mentre scrivi | Modifica a riquadro unico; output HTML e PDF | Gratis, MIT |

## I migliori editor Markdown nel 2026

### VS Code — ideale se lo hai già aperto

VS Code è un editor per codice con un supporto Markdown abbastanza buono che la maggior parte degli sviluppatori non installa mai altro. Apre una cartella invece di un file, il che significa che i tuoi documenti, le tue immagini e il tuo `.gitignore` stanno tutti nella stessa finestra, e l'anteprima è a un tasto di distanza dal testo.

| Pro | Contro |
| --- | --- |
| Già installato per la maggior parte degli sviluppatori, e gratuito | Non pensato per la prosa: nessuna modalità focus, nessun conteggio parole di serie |
| I file restano file normali in una cartella normale | L'esportazione in HTML richiede un'estensione, e la qualità delle estensioni varia |
| L'anteprima segue il parser markdown-it, conforme a CommonMark | Lo stile dell'anteprima non è lo stile dell'esportazione |
| Le estensioni aggiungono linting, formattazione delle tabelle e incolla-immagini | La finestra è quella di uno sviluppatore, con una barra laterale piena di codice |

**Prezzo:** gratis.

**Dettagli tecnici e funzioni**

- Anteprima affiancata che scorre insieme alla fonte, più il folding per livello di intestazione
- Completamento dei percorsi per link e immagini, così un percorso relativo rotto si vede mentre lo digiti
- Le estensioni coprono linting (markdownlint), allineamento delle tabelle ed esportazione in HTML e PDF
- Modifica multi-cursore e trova-e-sostituisci con espressioni regolari, che contano per la prosa più di quanto si pensi
- Snippet, quindi lo scheletro di una tabella o un blocco di front matter sono tre caratteri

**Per chi è?** Per chiunque tenga il proprio Markdown accanto al codice — README, changelog, documentazione nel repository. È anche il miglior editor di questa lista per i [blocchi di codice recintati](/blog/code-blocks-in-markdown), perché conosce già ogni linguaggio che ci metterai dentro.

### Obsidian — la migliore applicazione gratuita sopra una cartella di file

Obsidian apre una cartella di file `.md` e tratta i link fra di essi come il punto centrale. Niente è conservato in un contenitore proprietario: la cartella che apre è una cartella che puoi apri anche in VS Code, salvare con qualunque strumento o eliminare senza chiedere permesso.

| Pro | Contro |
| --- | --- |
| I tuoi documenti sono file semplici in una cartella che hai scelto tu | La sua sintassi dei wikilink non è CommonMark né GFM, quindi viaggia male |
| Gratuito per uso personale e commerciale | L'ecosistema di plugin è mantenuto dalla community, con tutta la varianza che comporta |
| Un ecosistema di plugin ampio, con plugin di esportazione compresi | L'esportazione HTML è un plugin, non una funzione integrata |
| Il front matter è di prima classe, come proprietà del documento | Il grafo e i plugin invitano a giocherellare più che a scrivere |

**Prezzo:** gratis per qualsiasi uso, compreso personale, commerciale e no-profit; servizi di Sync e Publish a pagamento e una licenza da sostenitore sono venduti separatamente (verificato su obsidian.md/license, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Apre una directory locale; ogni nota è un file `.md`, ogni allegato un file accanto
- I link `[[Nome nota]]` e gli embed `![[immagine.png]]` sono sintassi propria di Obsidian, non parte di nessuna specifica Markdown; c'è un'opzione per scrivere link Markdown standard invece
- Il front matter YAML viene letto come proprietà strutturate e mostrato come campi
- L'esportazione PDF è integrata; quella HTML arriva da plugin della community
- L'anteprima live nasconde la sintassi mentre scrivi, con una modalità sorgente che mostra il testo grezzo

**Per chi è?** Per chiunque stia accumulando qualche centinaio di note che si riferiscono a vicenda, e voglia poterle ancora leggere fra dieci anni. Disattiva l'opzione dei wikilink il primo giorno se quelle note verranno mai pubblicate, perché la [differenza fra la sintassi di un'app e il Markdown portabile](/blog/markdown-from-notion-obsidian-and-confluence) costa poco evitarla ora e molto risolverla dopo.

### Typora — il miglior editor a pagamento per chi non vuole vedere la sintassi

Typora è un editor desktop a riquadro unico. Non c'è una fonte a sinistra e un'anteprima a destra: scrivi `## Titolo` e la riga diventa un'intestazione sul posto. Per chi trova rumoroso il Markdown grezzo, è la differenza fra usare Markdown e tollerarlo.

| Pro | Contro |
| --- | --- |
| La superficie di scrittura più tranquilla di questo elenco, senza la contabilità di due riquadri | A pagamento, e solo desktop |
| Esporta HTML, PDF e Word dal file che stai guardando | Nascondere la sintassi rende più difficili da vedere alcuni errori strutturali |
| I temi sono file CSS semplici, quindi l'esportazione HTML li eredita | Non è uno strumento batch: un documento alla volta |
| I file restano file `.md` locali | Nessun vero ecosistema di plugin |

**Prezzo:** 14,99 $ senza tasse, un acquisto unico che copre fino a tre dispositivi, con una prova gratuita di 15 giorni (verificato su typora.io, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Modifica a riquadro unico: il Markdown viene sostituito dal suo rendering mentre scrivi, con la fonte di nuovo visibile quando il cursore entra nella riga
- Esportazione in HTML, PDF e Word; l'HTML prende il CSS del tema attivo
- I temi sono file CSS in una cartella, quindi uno stile aziendale è un foglio di stile e non un'impostazione
- Un'opzione per copiare le immagini incollate in una cartella relativa accanto al documento, che è la differenza fra un file portabile e uno con link al tuo desktop
- Funziona su macOS, Windows e Linux

**Per chi è?** Per chi scrive Markdown ogni giorno, vuole un'applicazione invece di una scheda del browser, ed è contento di pagare una volta. È il percorso più corto da un documento finito a un file HTML stilizzato che qualcun altro può aprire — e se il limite ai dispositivi, l'assenza di qualcosa per mobile o un'esportazione deludente sono quello che ti fa scartare Typora, [le alternative si ordinano da sole in base al motivo che è tuo](/blog/typora-alternatives).

### iA Writer — il migliore per prosa lunga fra desktop e telefono

iA Writer è prima un'applicazione di scrittura e poi un editor Markdown. Ha idee precise sulla tipografia, una modalità focus che oscura tutto tranne la frase corrente, e un'evidenziazione che marca le parti del discorso così vedi quanti aggettivi hai usato.

| Pro | Contro |
| --- | --- |
| Costruito per la prosa, non per documentazione o note | Paghi per piattaforma, quindi un Mac e un iPad sono due acquisti |
| Mac, Windows, iPhone e iPad, con file semplici sotto | Nessun plugin, nessuna estensibilità, di proposito |
| Esportazione HTML e PDF, con modelli per il contenitore | Poco adatto a documenti densi di codice |
| Una prova di 7 giorni senza carta richiesta | Deliberatamente poche funzioni, che alcuni leggono come mancanze |

**Prezzo:** acquisto unico per piattaforma — “paghi una volta per piattaforma, e lo possiedi per sempre” — con una prova gratuita di 7 giorni e nessuna carta di credito richiesta (verificato su ia.net/writer, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Funziona su file `.md` normali in cartelle normali, incluse le directory di iCloud e Dropbox
- Modalità focus ed evidenziazione sintattica delle parti del discorso, pensate per revisionare più che per buttare giù una bozza
- Blocchi di contenuto: un documento può includerne un altro tramite riferimento, il modo in cui un manoscritto lungo come un libro resta diviso in file di capitolo separati
- Esportazione in HTML e PDF, con modelli che controllano il contenitore
- Disponibile per macOS 10.15 o successivo e Windows 10 o successivo (verificato su ia.net/writer, l'8 settembre 2026)

**Per chi è?** Per chi scrive saggi, capitoli e articoli piuttosto che documentazione, vuole lo stesso documento aperto su un portatile e su un telefono, e non vuole un ecosistema di plugin da mantenere.

### Zettlr — il miglior editor gratuito per la scrittura accademica

Zettlr è un'applicazione Electron costruita con Vue e TypeScript, pensata per chi scrive con riferimenti bibliografici. Gestisce citazioni da un reference manager, ricerca full-text su tutta una cartella, ed esporta tramite Pandoc invece di reimplementare la conversione da solo.

| Pro | Contro |
| --- | --- |
| Citazioni da Zotero, JabRef e altri, dentro l'editor | L'esportazione dipende da Pandoc, e spesso da LaTeX, installati separatamente |
| Gratuito e open source sotto GNU GPL v3 | Più pesante di un editor semplice, essendo Electron |
| Ricerca full-text su tutta la cartella | L'interfaccia è più densa delle applicazioni di scrittura viste sopra |
| CSS personalizzato, temi e modalità scura | L'impostazione da Zettelkasten non è per tutti |

**Prezzo:** gratis, con licenza GNU GPL v3 (verificato su github.com/Zettlr/Zettlr, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Electron, Node.js e Vue 3 per il front end, con TypeScript nel codice (verificato su github.com/Zettlr/Zettlr, l'8 settembre 2026)
- Esportazione tramite Pandoc, LaTeX e Textbundle, motivo per cui l'elenco dei formati è lungo e l'installazione non è solo l'app
- Evidenziazione del codice per molti linguaggi dentro i blocchi recintati
- Integrazione con i reference manager più comuni
- Temi, modalità scure e CSS personalizzato sia per la modifica che per l'esportazione

**Per chi è?** Per chi scrive una tesi, un paper o un libro con bibliografia, e vuole l'output di Pandoc senza montare la riga di comando a mano. Se avresti installato Pandoc comunque, Zettlr è un front end gratuito per lui.

### StackEdit — il miglior editor da browser che continua a funzionare offline

StackEdit è un editor Markdown che gira in una scheda del browser e continua a funzionare quando la connessione non c'è. Si sincronizza con lo storage cloud consueto quando ha rete, e può pubblicare direttamente su alcune piattaforme di blogging.

| Pro | Contro |
| --- | --- |
| Niente da installare, e funziona offline una volta caricato | I documenti vivono nello storage del browser finché non collegi un provider di sincronizzazione |
| Si sincronizza con Google Drive, Dropbox e GitHub | Svuotare i dati del sito è un modo reale di perdere il lavoro |
| Pubblica su Blogger, WordPress e Zendesk | La sua sintassi estesa non sempre sopravvive altrove |
| Esportazione come Markdown, HTML, o tramite un modello Handlebars | Una scheda del browser si chiude per errore con facilità |

**Prezzo:** gratis, con licenza Apache 2.0 (verificato su stackedit.io, l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Gira interamente nel browser e dichiara che puoi scrivere offline come con un'applicazione desktop
- Destinazioni di sincronizzazione: Google Drive, Dropbox e GitHub
- Destinazioni di pubblicazione: Blogger, WordPress e Zendesk
- Output come Markdown, come HTML, o formattato tramite il motore di template Handlebars
- Gestisce documenti lunghi con un indice e una struttura scorrevole

**Per chi è?** Per chi lavora su una macchina dove non può installare software, e per chi il passo successivo alla scrittura è una piattaforma di blog piuttosto che un file — e se lo storage del browser o la sincronizzazione sono diventati il problema invece della comodità, [le alternative si ordinano in base a cosa di StackEdit stai davvero sostituendo](/blog/stackedit-alternatives).

### Dillinger — il migliore per un documento, adesso

Dillinger gira in una scheda del browser: fonte da un lato, anteprima dall'altro, e un menu di salvataggio che ti restituisce HTML o PDF o spinge il file su Dropbox, Google Drive, OneDrive o GitHub. È lo strumento che apri quando hai un documento da scrivere nei prossimi venti minuti e niente installato.

| Pro | Contro |
| --- | --- |
| Apri una scheda, scrivi, esporta, chiudi la scheda | Il tuo documento passa per un servizio ospitato |
| Esportazione HTML e PDF senza account | Lo stile dell'esportazione è dello strumento, non tuo |
| Gratuito e open source sotto licenza MIT | Non un editor dove conservare un corpo di lavoro |
| Sincronizzazione cloud verso le solite quattro destinazioni | Nessuna storia offline degna di nota |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- Editor a due riquadri: Markdown a sinistra, anteprima renderizzata a destra
- Importa da e salva su Dropbox, Google Drive, OneDrive e GitHub
- Esporta la fonte come `.md` o il documento renderizzato come HTML o PDF
- Nessuna installazione e nessun account necessari per il flusso base

**Per chi è?** Per chi scrive un documento oggi. Per qualunque cosa abbia un destinatario, tratta l'esportazione come una prima bozza del file e controlla cosa produce davvero — un'anteprima e [un file che si apre correttamente altrove](/blog/share-a-markdown-document-as-a-link) sono due cose diverse.

### Notion — quello che non è un editor Markdown

Notion accetta scorciatoie in stile Markdown. Scrivi `## ` e ottieni un'intestazione; scrivi `- ` e ottieni un elenco puntato. È assistenza all'input, non archiviazione: quello che Notion conserva è un albero di blocchi nel proprio database, e Markdown è uno dei formati in cui convertirà quell'albero quando esce.

| Pro | Contro |
| --- | --- |
| Bravo in quello per cui è pensato: pagine condivise, database, struttura di squadra | Non è un editor Markdown — l'esportazione è una conversione, con perdite |
| Esporta in Markdown e CSV, HTML, o PDF | I database escono come CSV, non come tabelle Markdown |
| Familiare per ogni squadra che lo usa già | I blocchi callout esportano come HTML, perché Markdown non ha un equivalente |
| Gli allegati sono inclusi nell'archivio di esportazione | Percorsi di cartelle annidate possono rompere l'estrazione su Windows |

**Prezzo:** piano gratuito disponibile; i piani a pagamento sono a utente — controlla notion.com/pricing per le cifre attuali.

**Dettagli tecnici e funzioni**

- Quattro strade di esportazione: PDF, HTML, “Markdown & CSV”, e la stampa tramite il browser
- L'esportazione Markdown arriva come archivio compresso: file `.md` per le pagine e sottopagine non-database, un file `.csv` per ogni database a pagina intera, e cartelle separate per immagini e altri allegati
- La documentazione di aiuto di Notion afferma che i blocchi callout vengono esportati come HTML “perché non c'è un equivalente Markdown”, e che una vista Modulo di un database non si può esportare affatto
- Le emoji personalizzate non appaiono nelle esportazioni PDF
- Su Windows, l'estrazione può fallire quando i percorsi di cartelle annidate nell'archivio superano i 260 caratteri; le soluzioni documentate sono disattivare la creazione di cartelle per le sottopagine, o usare uno strumento di estrazione diverso

(Tutto quanto sopra verificato su notion.com/help/export-your-content, l'8 settembre 2026.)

**Per chi è?** Per le squadre che vogliono uno spazio di lavoro condiviso e sono oneste con sé stesse sul fatto che non è uno strumento Markdown. Se i tuoi documenti devono finire come Markdown portabile o come pagine web, pianifica un passaggio di pulizia dopo ogni esportazione invece di sperare che questa venga fuori pulita.

### Vim e Neovim — i migliori se vivi già in un terminale

Vim e Neovim non sono editor Markdown e diventano buoni con tre o quattro plugin. L'attrattiva non è il supporto Markdown; è che la modifica del testo è la più veloce disponibile ovunque, e la conosci già.

| Pro | Contro |
| --- | --- |
| Velocità di modifica che nessuno in questo elenco pareggia, se hai la memoria muscolare | Tutto è un plugin, e sei tu ad assemblarlo e mantenerlo |
| Gratuito e open source; gira via SSH, su qualunque cosa | Nessun modello di documento: una tabella è testo che allinei tu |
| Anteprima e conversione sono solo altri programmi che chiami | La curva di apprendimento è quella nota |
| La configurazione è un file che puoi commettere e riusare | Niente si rende mentre scrivi |

**Prezzo:** gratuito e open source. Vim è distribuito sotto la propria licenza charityware; Neovim è Apache 2.0.

**Dettagli tecnici e funzioni**

- Plugin come vim-markdown aggiungono evidenziazione sintattica, folding per intestazione e occultamento della marcatura
- Plugin di anteprima come markdown-preview.nvim renderizzano il documento in una finestra del browser mentre scrivi, usando un processo Node
- Plugin per tabelle come vim-table-mode mantengono allineate le tabelle a pipe mentre le modifichi
- La conversione è a un comando di distanza: `:%!` e una pipeline, o un mapping che chiama un convertitore sul file corrente
- L'intera configurazione è testo, quindi lo stesso setup ti segue su ogni macchina

**Per chi è?** Per chi lo usa già per il codice. Nessuno dovrebbe imparare Vim per scrivere Markdown, e chi conosce Vim non dovrebbe imparare un secondo editor per scriverlo.

### Nota — la scommessa interessante

Nota è un editor Markdown per macOS pensato per scrivere e pubblicare da una cartella locale di file. Vale la pena conoscerlo, e vale la pena essere lucidi: il sito descrive una beta macOS, offre una lista d'attesa e un pre-ordine, e non indica un prezzo sulla pagina.

| Pro | Contro |
| --- | --- |
| Costruito attorno a file Markdown locali, non a un servizio | Solo macOS |
| Pensato per pubblicare, non solo per prendere note | Software in beta, con la stabilità che ne consegue |
| Piccolo e mirato invece che una piattaforma di plugin | Nessun prezzo indicato sul sito, quindi bilancio sull'ignoto |

**Prezzo:** non indicato su nota.md, che offre una lista d'attesa e un pre-ordine invece di un prezzo elencato (verificato l'8 settembre 2026).

**Dettagli tecnici e funzioni**

- Solo macOS, secondo il sito; non c'è nessuna build per Windows o Linux annunciata
- Distribuito come beta a chi si iscrive alla lista d'attesa, con un'opzione di pre-ordine
- Funziona su file Markdown normali su disco piuttosto che documenti in un servizio
- Posizionato attorno alla scrittura e alla pubblicazione più che alla presa di note

**Per chi è?** Per chi scrive su Mac e ama provare applicazioni nuove, e tiene i propri file da qualche parte che l'applicazione non controlla. Dato che i documenti sono normali file `.md`, il costo se la scommessa non paga è basso — cambi editor e la cartella resta intatta. Questa proprietà è l'intera ragione per preferire gli editor che possiedono i file, e vale più di qualunque singola funzione.

### Mark Text — il miglior editor desktop gratuito a riquadro unico

Mark Text è un editor desktop open source con l'approccio “si rende mentre scrivi” che Typora ha reso popolare, distribuito sotto licenza MIT e costruito con Electron e Vue.

| Pro | Contro |
| --- | --- |
| Gratuito, licenza MIT, e installabile su tutti e tre i desktop | Progetto della community: controlla la cronologia dei commit recenti prima di fidartene |
| Si rende mentre scrivi, in un unico riquadro | Meno formati di esportazione degli editor a pagamento |
| Produce output HTML e PDF | Electron, quindi l'impatto sulla memoria è quello che ti aspetti |
| File locali, niente caricato | Meno temi ed estensioni |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici e funzioni**

- Build per Linux, macOS e Windows, su x64 e arm64
- Modifica a riquadro unico con la sintassi sostituita dal suo rendering
- Output in HTML e PDF
- Electron e Vue, quindi la fonte è accessibile se vuoi cambiare qualcosa

**Per chi è?** Per chi vuole il modello di modifica di Typora senza pagarlo, ed è a suo agio a dipendere da un progetto della community. Se una roadmap mantenuta conta per te più del prezzo di una licenza Typora, compra Typora.

## La distinzione che le pagine di confronto non tracciano

Ogni elenco di editor Markdown li classifica su un solo asse. L'asse che decide quanti guai avrai fra tre anni è binario, e quasi nessuno lo mette in tabella.

**Editor che possiedono i file.** VS Code, Obsidian, Typora, iA Writer, Zettlr, Mark Text, Vim e Nota puntano tutti a una directory su un disco. La conseguenza è che l'editor è sostituibile. Puoi apri la stessa cartella in un secondo editor domani, farci passare un convertitore in una build, cercarla con `grep`, commetterla in git, e farne il backup con lo stesso strumento che fa il backup di tutto il resto. Quando una di queste applicazioni viene abbandonata, perdi l'applicazione. Non perdi la scrittura.

**Applicazioni che possiedono i documenti.** Notion possiede i suoi documenti in un database. StackEdit, finché non collega un provider di sincronizzazione, li possiede nello storage del tuo browser. Un editor ospitato li possiede su un server. La conseguenza è che tirare fuori il tuo testo è un'operazione che il fornitore implementa, alla fedeltà che il fornitore ha scelto, nei formati che il fornitore offre. Quell'operazione va di solito bene, e occasionalmente è il pomeriggio peggiore del trimestre. Il segnale è che si chiama “esportazione” e non “apertura”.

**La sintassi proprietaria è una perdita lenta.** Wikilink, callout, marcature di evidenziazione, query incorporate, transclusione — ciascuna è comoda dentro l'applicazione e inerte fuori. Non te ne accorgi, perché leggi quei file solo dentro l'applicazione che li ha scritti. Te ne accorgi il giorno in cui la documentazione si sposta nel repository, o un collega apre una nota in un editor diverso, o un convertitore rende `[[Onboarding]]` come quattro parentesi letterali e una parola. Niente si corrompe. Semplicemente non è più Markdown, e non lo è da un anno.

**L'anteprima non è l'esportazione.** Ogni editor qui ha un'anteprima, e in ognuno l'anteprima è stilizzata dall'editor. Quello che finisce nell'HTML esportato è un foglio di stile diverso, a volte un parser diverso, e occasionalmente una variante diversa di Markdown. Le tabelle sono dove questo si vede prima di tutto, perché le tabelle non sono affatto in CommonMark: un editor può renderne una correttamente nel proprio riquadro ed emettere un paragrafo di caratteri pipe in uscita. [Testare una tabella prima di fidarti della pipeline](/blog/markdown-tables-that-survive-conversion) richiede un minuto e risparmia un secondo invio.

**Cosa fa ciascuno quando serve HTML.** Questa è la richiesta che li separa. Typora, iA Writer, Mark Text, StackEdit e Dillinger esportano HTML direttamente, a modo loro. Obsidian esporta PDF di serie e HTML tramite plugin. VS Code e Vim delegano a un'estensione o a un comando. Zettlr delega a Pandoc, che installi tu. Notion offre l'esportazione HTML di un albero di blocchi che non è mai stato Markdown fin dall'inizio. Nessuno di loro sbaglia; stanno rispondendo a domande diverse. Quello che hanno in comune è che l'HTML che producono è l'HTML che hanno scelto loro, e se ti serve un tipo specifico di output — un unico file completo, stili incorporati, niente scaricato da una rete — quello è un lavoro da convertitore, non da editor.

**Il costo di uscita è il vero prezzo.** 14,99 $ una tantum non è il costo di un editor. Il costo è quanto serve per smettere di usarlo. Per un editor che possiede i file, quel costo è zero: lo chiudi e apri un altro sulla stessa cartella. Per un'applicazione che possiede i documenti, è un'esportazione, un'ispezione, un passaggio di pulizia sulla sintassi che non ha equivalente Markdown, e una serie di percorsi di allegati da sistemare. Pesa questo prima del font.

## Come scegliere

1. **Decidi se il tuo testo deve sopravvivere all'editor.** Se la risposta è sì — e per note, documentazione e qualunque cosa porti il tuo nome, lo è — scegli qualcosa che apre una cartella di file, perché una cartella di file può essere aperta da qualunque cosa esista nel 2035.
2. **Fai corrispondere l'editor al tipo di scrittura, non alle recensioni.** La prosa vuole iA Writer o Typora; la documentazione accanto al codice vuole VS Code; un insieme di note collegate vuole Obsidian; una bibliografia vuole Zettlr. Scegliere la categoria sbagliata significa litigare ogni giorno con l'interfaccia per qualcosa che un'applicazione diversa fa di serie.
3. **Disattiva la sintassi proprietaria il primo giorno.** Se l'editor offre link Markdown standard al posto della propria sintassi, accetta l'offerta. Adattare centinaia di wikilink più avanti è un lavoro di scripting, e i lavori di scripting sulle tue note hanno il vizio di mangiarsi un fine settimana.
4. **Controlla l'esportazione prima di avere una scadenza.** Scrivi un documento rappresentativo — una tabella, un blocco di codice recintato, un'immagine, una nota a piè di pagina — esportalo, e apri il risultato in un browser diverso con la rete spenta. Quello che lì è rotto lo sarà anche allora, quando avrai meno tempo.
5. **Conta le installazioni che richiede l'esportazione.** Un editor che esporta tramite Pandoc è eccellente e sono due installazioni. Sul tuo computer va benissimo; su un portatile di lavoro bloccato è il motivo per cui l'esportazione non avviene mai.
6. **Sii onesto su dove va a finire il documento.** Se è confidenziale, un editor che lo conserva sul server di qualcun altro è escluso, non importa quanto ti piaccia. Questa decisione viene prima, perché nessuna esperienza di scrittura vale la pena di rimetterla in discussione più tardi.

## Conclusione

Il miglior editor Markdown è quello che modifica i tuoi file invece di possedere i tuoi documenti, nella forma che si adatta alla scrittura che fai davvero: VS Code se è già aperto, Typora o iA Writer se vuoi pagare una volta per una superficie più tranquilla, Obsidian se le note si collegano fra loro, Zettlr se c'è una bibliografia, Vim se ci vivi già. Notion è l'eccezione che vale la pena nominare due volte, perché è un buon prodotto e un povero editor Markdown, e il divario diventa visibile solo all'esportazione. Qualunque tu usi per scrivere, tieni la conversione separata dalla modifica: quando il documento deve diventare una pagina web che qualcun altro può aprire, [convertilo in un file HTML autonomo](/) nel tuo browser, dove il file resta sulla tua macchina e l'output è un unico file che non chiede niente alla rete.

## Domande frequenti

### Qual è il miglior editor Markdown per chi comincia?

Typora, se sei disposto a pagare 14,99 $ una volta, perché nasconde la sintassi e non c'è niente da configurare. Se vuoi gratuito, Mark Text offre lo stesso modello di modifica sotto licenza MIT, e StackEdit non richiede alcuna installazione. Evita di iniziare con Vim o un setup pieno di plugin; imparare prima la sintassi e gli strumenti dopo.

### Obsidian è un editor Markdown o un'app per prendere note?

Entrambi, e la distinzione conta. Modifica normali file `.md` in una cartella che scegli tu, il che lo rende un vero editor Markdown, ma la sua sintassi di wikilink ed embed è propria di Obsidian, non CommonMark o GFM. Passa all'opzione dei link Markdown standard se quelle note verranno mai convertite o lette altrove.

### VS Code è adatto a scrivere Markdown?

Sì, in particolare per qualunque cosa viva in un repository. L'anteprima integrata segue un parser conforme a CommonMark, il completamento dei percorsi intercetta i link alle immagini rotti mentre li digiti, e git tiene già traccia del file. È poco adatto alla prosa lunga, perché nessuno degli strumenti pensati per la scrittura — modalità focus, tipografia, layout senza distrazioni — c'è senza estensioni.

### Notion esporta Markdown vero?

Esporta Markdown, con lacune documentate. I database diventano file CSV invece di tabelle Markdown, i blocchi callout escono come HTML perché Markdown non ha un equivalente, una vista Modulo non si può esportare, e su Windows i percorsi di cartelle annidate nell'archivio possono superare il limite di 260 caratteri e fallire l'estrazione (verificato su notion.com/help/export-your-content, l'8 settembre 2026). Metti in conto un passaggio di pulizia ogni volta.

### Qual è il miglior editor Markdown gratuito?

VS Code se scrivi vicino al codice, Obsidian se stai costruendo un insieme di note collegate — è gratuito per uso personale e commerciale — e Zettlr se hai bisogno di citazioni. Tutti e tre tengono il tuo testo in file semplici. Per una scheda del browser senza niente installato, StackEdit è gratuito sotto Apache 2.0 e funziona offline una volta caricato.

### Mi serve un editor Markdown a pagamento?

No. Ogni lavoro di questa pagina si può fare con software gratuito, e le opzioni gratuite non sono compromessi. Paghi per una superficie di scrittura più piacevole e per l'attenzione continua di qualcuno su di essa, il che vale 14,99 $ per alcuni e niente per altri. Decidi dopo due settimane in un editor gratuito, non prima.

### Quale editor Markdown mi dà un HTML che posso mandare a qualcuno?

Typora, iA Writer, Mark Text, StackEdit e Dillinger esportano tutti HTML direttamente, ciascuno a modo suo. Se quello che ti serve è un unico file autonomo — stili incorporati, nessun foglio di stile o font esterno, che si apre identico su una macchina senza connessione — quello è un passaggio di conversione e non una funzione da editor, e vale la pena farlo separatamente da dove hai scritto il testo.
