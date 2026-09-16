---
title: "Un convertitore Notion-Markdown gratuito: tutte le opzioni, e dove il gratis ha un trucco"
description: "Confronta i modi gratuiti per trasformare le pagine Notion in Markdown: l’export, un convertitore nel browser, notion-to-md, e dove il gratis ha un trucco"
date: 2026-09-14
tag: Conversione
keywords: convertire notion in markdown gratis, convertitore notion markdown, notion in markdown gratuito, convertire notion in markdown online, esportare notion in markdown, miglior convertitore notion markdown, da notion a md
---

Cerca un convertitore da Notion a Markdown e quasi tutto quello che torna indietro è gratuito, che è un risultato strano per una ricerca con del denaro dentro. Ed è anche vero. L’export di Notion non costa niente, i pacchetti open source non costano niente, i convertitori nel browser non costano niente, gli editor che importano uno spazio di lavoro non costano niente. Nessuno fa pagare la conversione in sé, perché non è lì che sta la difficoltà.

La difficoltà è che ognuna di queste opzioni gratuite è gratuita in un modo diverso, e ognuna manda un conto diverso più avanti. Una produce nomi di file con un identificatore esadecimale di 32 caratteri saldato in fondo. Una richiede un token di integrazione, un passaggio di permessi dentro Notion e un limite di frequenza gestito come si deve nel codice. Una spedisce il tuo spazio di lavoro a un server di cui non hai mai sentito parlare. Una si prende un pomeriggio del tuo tempo, che è l’unica cosa davvero costosa di questo elenco.

Quindi questo è un confronto scritto sull’asse che le separa davvero: non il prezzo, ma quanto costa il gratis. Ogni strumento qui sotto è gratuito sul serio — non gratuito-come-prova, non gratuito-fino-al-muro — e accanto a ognuno c’è la risposta onesta alla domanda “e poi?”. Per la meccanica di una singola strada invece che per la scelta fra tutte, [la guida completa copre ogni percorso passo per passo](/blog/convert-notion-export-to-markdown).

### In breve

Tutte le opzioni serie sono gratuite, quindi si sceglie sulla forma. **L’“Export as Markdown & CSV” di Notion** è il punto da cui parte tutto il resto: Markdown vero, ma ogni nome di file e ogni link fra pagine si porta dietro l’id della pagina in 32 caratteri esadecimali. **Un convertitore nel browser che unisce l’export** — [la conversione da Notion a Markdown che trovi qui](/notion-to-markdown) è uno di questi — prende lo stesso zip e ti restituisce un unico documento con un indice, senza id e senza script, e senza caricare nulla da nessuna parte quando non hai fatto l’accesso; in cambio le pagine diventano sezioni invece che file. **`notion-to-md`** legge le pagine attraverso l’API di Notion da Node e ti lascia decidere tu i nomi dell’output: giusto per un passaggio di build, sbagliato per una cosa una tantum, visto che un token e una concessione di permessi vengono prima della prima riga di codice. **Obsidian Importer** è gratuito, con licenza MIT, ed è la strada quando la destinazione è un vault. **Pandoc** converte in locale l’export HTML, che è più ricco. **Copia e incolla** smette di funzionare intorno alla quinta pagina.

Il trucco, in ogni caso, è il tempo, la configurazione, la forma o la privacy — mai il denaro.

## Perché questa conversione è più difficile di quanto sembri

Notion identifica una pagina con un id, non con il titolo. I titoli cambiano, due pagine possono averne uno uguale, e l’export ha bisogno di nomi di file univoci: così scrive l’id dentro il nome di ogni file e di ogni cartella che crea, `Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md`. Ogni link da una pagina esportata a un’altra punta esattamente a quel nome di file, con i caratteri codificati in percentuale. Rinomina il file in qualcosa di leggibile e il link si rompe in silenzio, perché un link relativo morto non produce nessun errore finché qualcuno non ci clicca sopra.

Quell’unico fatto separa gli strumenti. Un convertitore o ti lascia in mano gli id, o li riscrive in un passaggio che riscrive anche tutti i link, oppure elimina del tutto il bisogno che risolvano qualcosa unendo le pagine in un documento solo. Non esiste una quarta opzione, e nessuna cifra la farebbe comparire.

C’è una seconda difficoltà che non ha niente a che vedere con gli id. Una pagina di Notion non è solo testo: sono database con viste, colonne calcolate, blocchi sincronizzati mostrati in più punti e thread di commenti attaccati alla pagina invece che scritti dentro di essa. Markdown ha una tabella e nient’altro di quella lista, quindi una parte della perdita è strutturale — succede nell’export, prima che qualsiasi convertitore entri in gioco.

E ce n’è una terza, che è dove la questione del gratis si fa interessante. Uno spazio di lavoro Notion di solito è la raccolta di documenti più delicata che una piccola azienda possieda: colloqui, stipendi, strategia, bozze legali a metà. Un convertitore online gratuito che carica il tuo export è gratuito perché hai pagato in un’altra valuta — accettabile per un manuale pubblico, un trasferimento di dati per tutto il resto, e una cosa da decidere apposta invece che trascinando un file sulla prima pagina uscita in classifica.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| L’“Export as Markdown & CSV” di Notion | Tirare fuori i contenuti, prima di tutto | Markdown vero per ogni pagina, CSV per ogni database | Gratis, integrato |
| Un convertitore nel browser (il `/notion-to-markdown` di questo sito) | Un documento solo da leggere, archiviare o consegnare | Unisce lo zip dell’export in un unico documento con indice, nel browser | Gratis |
| L’export più uno script di riscrittura tuo | Una cartella di file che devono restare file | Rinomina i file e riscrive i link da un’unica mappa di id | Gratis, ti costa tempo |
| `notion-to-md` | Un passaggio di build o una sincronizzazione pianificata | Legge le pagine tramite l’API di Notion e scrive file con i nomi che scegli tu | Gratis, open source |
| Obsidian Importer | Una destinazione che è un vault Obsidian | Importa un export HTML di Notion o legge direttamente l’API | Gratis, MIT |
| Pandoc sull’export HTML | Una pagina per volta, o una pipeline documentale più lunga | HTML in ingresso, Markdown in uscita, più ogni altro formato che sa scrivere | Gratis, GPL |
| Copia e incolla | Tre pagine, una volta sola, oggi | Niente da installare, niente da imparare | Gratis |

## Le opzioni gratuite, una alla volta

### L’export di Notion — ideale per tirare fuori i contenuti

Ogni altra strada qui o parte da questo export o lo sostituisce con l’API. L’export di Notion sta nel menu della pagina o dello spazio di lavoro e offre PDF, HTML e Markdown & CSV; l’opzione Markdown scrive un `.md` per pagina e un `.csv` per ogni database a pagina intera, con immagini e altri allegati salvati in cartelle accanto (verificato su notion.com, 14 settembre 2026).

| Pro | Contro |
| --- | --- |
| Davvero gratuito, integrato, nessun account oltre a quello che hai già | Ogni nome di file e ogni link fra pagine si porta dietro l’id da 32 caratteri esadecimali |
| L’output è Markdown vero, che si apre in qualunque editor | Viene esportata solo la vista corrente o predefinita di un database |
| I database escono come CSV, che è almeno leggibile da una macchina | Una vista modulo non si può esportare affatto |
| Gli allegati sono inclusi invece di restare URL che scadono | Un export grande arriva come link via email, e il link scade |

**Prezzo:** gratis. Una funzione lì vicino non lo è: “Include subpages” per un export **PDF** è descritta sulla pagina di aiuto di Notion come una funzione dei piani Business o Enterprise (verificato su notion.com, 14 settembre 2026). La strada Markdown & CSV non è limitata in quel modo, il che vale la pena saperlo se qualcuno nella tua squadra ha concluso che esportare uno spazio di lavoro richiede un upgrade.

**Dettagli tecnici.** Il suffisso dell’id è di 32 caratteri esadecimali minuscoli, separati dal titolo da uno spazio o da un trattino basso a seconda della versione del client che ha prodotto l’export. “Create folders for subpages” si può disattivare per accorciare i percorsi, il che conta su Windows, dove uno spazio di lavoro molto annidato produce percorsi più lunghi di quanto il sistema operativo accetti. Gli export molto grandi non si scaricano subito: Notion manda un link via email, il link scade dopo sette giorni e l’elaborazione è documentata come capace di arrivare a trenta ore — quindi un export avviato il pomeriggio di una migrazione può non arrivare in tempo per la migrazione stessa.

**Per chi è?** Per tutti, come prima cosa. Qualunque strada tu scelga dopo, questo è il modo ufficiale di portarti via una copia dei tuoi contenuti da un prodotto ospitato da altri, e farlo una volta prima di averne bisogno è un’assicurazione a basso costo.

### Un convertitore nel browser che unisce l’export — ideale per un documento solo

Lascia cadere lo stesso zip su [la conversione da Notion a Markdown di TransformPipe](/notion-to-markdown) e ogni pagina diventa una sezione di un unico documento, nell’ordine dell’export, sotto un indice generato. Un link fra pagine mantiene le parole che mostrava e perde l’indirizzo, perché quando due pagine sono sezioni dello stesso documento non c’è più un indirizzo separato a cui puntare. I database arrivano come tabelle Markdown invece che come file CSV parcheggiati di lato.

| Pro | Contro |
| --- | --- |
| Nessuna mappa di id, nessuna rinomina, nessuno script, nessuna installazione | Produce un documento solo, quindi le pagine non restano file separati con un URL proprio |
| Un indice viene generato dai titoli delle pagine | Un link fra pagine conserva il testo, non la destinazione |
| Gira nel browser: se non hai fatto l’accesso, lo zip non viene caricato da nessuna parte | Uno zip alla volta, non un lavoro pianificato |
| I database arrivano come tabelle nello stesso documento delle pagine | Commenti e viste non predefinite restano assenti, perché l’export non li aveva mai |

**Prezzo:** gratis nel senso più semplice — la conversione gira in locale dentro la pagina, quindi non c’è nessun costo server da recuperare e nessuna quota per file da sbattere. Un account aggiunge cronologia, condivisione e un’API, anche questi gratis.

**Dettagli tecnici.** Lo zip viene letto nel browser con un decompressore in puro JavaScript, le voci ordinate per percorso dentro l’archivio così che lo stesso export si converta allo stesso modo due volte, e il titolo di ogni sezione è il nome del file senza il suffisso dell’id. Una pagina la cui prima riga ripete già il titolo come intestazione non se lo ritrova due volte, e le pagine sono separate da una linea orizzontale — la convenzione che [unire tanti file Markdown in uno](/blog/merging-many-markdown-files) usa ovunque.

**Per chi è?** Per chiunque avesse come obiettivo vero un documento invece di una cartella: uno spazio di lavoro archiviato come unico file leggibile, un wiki di progetto consegnato a un cliente, una knowledge base incollata in un repository. Se la destinazione ha bisogno di un URL per pagina, questa è la forma sbagliata e le due opzioni successive sono quelle giuste.

### L’export più uno script di riscrittura tuo — ideale per i file che devono restare file

Se la destinazione è un sito di documentazione, l’importazione in un wiki o qualunque cosa in cui ogni pagina abbia bisogno di un indirizzo proprio, gli id vanno tolti per bene: costruisci una mappa dall’id di ogni file al nome che vuoi, poi riscrivi ogni nome di file e ogni link a partire da quell’unica mappa, in un passaggio solo. Fare la rinomina senza la riscrittura dei link è ciò che produce una cartella che sembra corretta ed è piena di link morti.

| Pro | Contro |
| --- | --- |
| Nessuna dipendenza, nessun token, nessun account, niente caricato da nessuna parte | L’opzione più costosa qui dentro, misurata nel tuo tempo |
| L’output sono file veri con nomi veri, che è quello che vuole un sito di documentazione | Mezzo lavoro rompe tutti i link interni, in silenzio |
| Funziona offline, sull’export che hai già | Il CSV del database non viene ricongiunto alla pagina a cui apparteneva |
| Ripetibile una volta scritto, e verificabile perché l’hai scritto tu | Dieci pagine a mano sono una serata; mille a mano non sono realistiche |

**Prezzo:** gratis, se non conti il pomeriggio. Cosa che dovresti fare: a qualunque tariffa oraria, uno script fatto bene più i test è la voce più cara di questa pagina, e l’unica in cui il costo resta invisibile finché non ci sei dentro da tre ore.

**Dettagli tecnici.** L’estrazione dell’id deve girare sulla destinazione del link decodificata, non su quella grezza con la codifica percentuale, altrimenti lo spazio in `Meeting%20notes` non corrisponderà a un pattern scritto per uno spazio letterale. Il resto — l’espressione regolare, l’unione del CSV, l’appiattimento delle cartelle — è spiegato in [la guida passo per passo](/blog/convert-notion-export-to-markdown) invece che qui.

**Per chi è?** Per squadre che migrano un insieme di documentazione dentro un sistema che si aspetta un file per URL, dove i nomi dei file e i link fra di essi fanno parte di ciò che si consegna invece di essere un dettaglio marginale.

### `notion-to-md` — ideale per un passaggio di build

Leggere lo spazio di lavoro attraverso l’API ufficiale di Notion invece che dal pulsante di export evita del tutto il problema degli id, perché niente costringe un id dentro un nome di file quando quel file lo scrivi tu. `notion-to-md` è il pacchetto Node usato di solito per questo: tira giù l’albero dei blocchi di una pagina tramite l’API e lo converte in Markdown, con un punto di aggancio per gestire i tipi di blocco che non copre di suo.

| Pro | Contro |
| --- | --- |
| Nessun suffisso di id, mai, perché ogni nome di file lo scegli tu | Richiede un token di integrazione e che l’integrazione sia condivisa su ogni pagina — un passaggio di permessi, non di codice |
| Si incastra in uno script di build, un sito statico o un mirror pianificato dentro git | Una pagina o una query di database alla volta; percorrere uno spazio di lavoro è ricorsione tua |
| Gira in CI senza browser e senza il clic manuale sull’export | I blocchi immagine tornano come URL temporanei di Notion, che scadono se non li scarichi |
| Estensibile: i tipi di blocco non supportati si gestiscono con un trasformatore tuo | L’API ha un limite di frequenza, e uno script che lo ignora sembra piantato |

**Prezzo:** gratis, open source. La licenza va detta con attenzione: il pacchetto pubblicato dichiara ISC nei metadati npm, mentre il file `LICENSE` del repository — e la linea alpha 4.0 — riportano MIT (verificato su registry.npmjs.org e github.com/souvikinator/notion-to-md, 14 settembre 2026). Sono entrambe permissive; se la tua organizzazione registra le licenze in modo formale, registra quale artefatto hai preso.

**Dettagli tecnici.** L’API di Notion è limitata a una media di tre richieste al secondo per integrazione, con un limite a parte a livello di spazio di lavoro sopra a quello (verificato su developers.notion.com, 14 settembre 2026). Oltre il limite una richiesta restituisce `429` con un’intestazione `Retry-After` invece dei dati, quindi un ciclo di attesa e ritentativo va nella prima versione dello script invece che in quella scritta dopo il primo fallimento — per uno spazio di lavoro grande è la differenza fra un lavoro che finisce e uno che interrompi pensando sia andato in crash.

**Per chi è?** Per chiunque questa non sia una cosa una tantum: un sito che costruisce le sue pagine da Notion, un mirror notturno di un manuale dentro un repository, una pipeline in cui “qualcuno lo esporta a mano ogni mese” è il passaggio che prima o poi verrà saltato.

### Obsidian Importer — ideale quando la destinazione è un vault

Se il Markdown va dentro Obsidian, la strada gratuita più corta è il plugin Importer di Obsidian stesso invece di un convertitore generico. Gestisce una lista lunga di origini — Evernote, OneNote, Roam, Bear, Apple Notes, cartelle di HTML e Markdown semplice fra le altre — e offre Notion in due varianti separate.

| Pro | Contro |
| --- | --- |
| Gratuito e con licenza MIT, mantenuto dalla squadra di Obsidian (verificato su github.com/obsidianmd/obsidian-importer, 14 settembre 2026) | Utile solo se la destinazione è un vault; non è un convertitore generico |
| Due strade: leggere lo spazio di lavoro tramite l’API, oppure importare lo zip dell’export offline | La sua documentazione sconsiglia l’export Markdown di Notion e raccomanda quello HTML |
| La strada API converte database e formule nei file di database propri di Obsidian | La strada dello zip non conserva i database, e in cambio non chiede nessun token |
| Un passaggio di anteprima prima che qualcosa venga scritto nel vault | La strada API è soggetta agli stessi limiti di frequenza di Notion, quindi uno spazio di lavoro grande ci mette un po’ |

**Prezzo:** gratis, licenza MIT.

**Dettagli tecnici.** I limiti documentati sono abbastanza precisi da poterci pianificare sopra: sulla strada API viene importata solo la vista principale di ogni database, le origini dati collegate no, e una manciata di funzioni di formula che riguardano le persone e lo stile del testo non ha un equivalente. La strada dello zip scambia i database con l’indipendenza — nessun token, niente internet, nessun limite di frequenza. La raccomandazione di esportare in HTML invece che in Markdown è la parte interessante qui, perché è un fornitore che dice chiaramente che l’export Markdown di Notion perde informazioni che l’export HTML conserva (verificato su obsidian.md, 14 settembre 2026).

**Per chi è?** Per chiunque sposti uno spazio di lavoro dentro Obsidian, che è la destinazione più comune per questa conversione. La domanda più ampia su [che cosa sopravvive a uno spostamento fra Notion, Obsidian e Confluence](/blog/markdown-from-notion-obsidian-and-confluence) vale la pena di leggerla prima dell’importazione invece che dopo.

### Pandoc sull’export HTML — ideale per una pagina sola, o per una pipeline più lunga

Pandoc è un convertitore di documenti da riga di comando che legge HTML e scrive Markdown, fra una lunga lista in entrambe le direzioni. Puntato sull’export HTML di Notion invece che su quello Markdown, è un convertitore gratuito, locale e scriptabile che parte dal più ricco dei due export.

| Pro | Contro |
| --- | --- |
| Gratuito e locale: non si carica niente, e gira in CI con la stessa facilità con cui gira su un portatile | Converte file, non archivi: lo zip, la scansione della cartella e i nomi dei file sono affari tuoi |
| Parte dall’export HTML, che porta più cose di quello Markdown | Un’installazione grossa per una pagina sola |
| Lo stesso comando scrive DOCX, PDF o LaTeX cambiando un’opzione | L’HTML esportato da Notion è generato da una macchina, quindi il Markdown ha bisogno di una passata di pulizia |
| Controllo fine sul dialetto Markdown che scrive | Nessuna nozione di spazio di lavoro, albero di pagine o database |

**Prezzo:** gratis, licenza GPL (verificato su pandoc.org, 14 settembre 2026).

**Dettagli tecnici.** Il fatto rilevante è che l’export HTML di Notion e quello Markdown non sono lo stesso contenuto in due vestiti diversi: quello HTML porta formattazione e struttura che chi scrive il Markdown ha dovuto lasciare per strada, ed è il motivo per cui l’importer di Obsidian chiede l’HTML. Pandoc ti permette di partire da lì e di scegliere il tuo dialetto Markdown all’uscita, e le differenze fra [le varianti di Markdown](/blog/commonmark-gfm-and-the-flavours) decidono quanta di quella marcatura sopravvive.

**Per chi è?** Per chi ha già Pandoc dentro una build, o per chiunque debba convertire una manciata di pagine importanti preferendo partire dall’export che ha perso meno.

### Copia e incolla — ideale per tre pagine, una volta sola

Seleziona la pagina in Notion, copia, incolla in un editor Markdown, sistema quello che si è rotto. Sta in questo elenco perché per una manciata di pagine è davvero l’opzione gratuita più veloce.

| Pro | Contro |
| --- | --- |
| Niente da installare, configurare o imparare | Non scala oltre poche pagine, e il muro arriva di colpo |
| Vedi ogni pagina, quindi niente viene storpiato di nascosto | Le immagini non ti seguono; ognuna va riscaricata a mano |
| Nessun account, nessun token, nessun caricamento | Non è ripetibile e non è verificabile |

**Prezzo:** gratis.

**Per chi è?** Per chi ha tre pagine e una scadenza. Per qualunque cosa abbia sottopagine, database o immagini in quantità, il costo in tempo supera in fretta ogni altra opzione, e senza preavviso — la quinta pagina sembra uguale alla prima, ed è alla quarantesima che ti accorgi che avresti dovuto esportare.

## Dove il gratis ha un trucco

Niente di quanto sopra costa denaro. Ognuna di queste opzioni costa però qualcosa, e i costi sono abbastanza diversi da rendere “sono tutte gratuite” la cosa meno utile che tu possa sapere su di loro.

**Il trucco è una quota.** Le strade che passano dall’API — `notion-to-md` e la modalità API di Obsidian Importer — sono limitate dal limite di frequenza di Notion invece che dal listino di qualcuno. Tre richieste al secondo per integrazione sembrano generose finché non noti che una pagina con blocchi annidati sono diverse richieste. La parte gratuita è reale; quella illimitata non è mai stata promessa.

**Il trucco è la configurazione.** Un token di integrazione è gratuito; crearlo, condividerlo sulle pagine giuste, conservarlo dove una build possa leggerlo e ricordarsi di ruotarlo non è niente di gratis. Per una conversione che farai esattamente una volta è uno scambio pessimo rispetto a un clic su Export, ed è per questo che la classifica si ribalta con la frequenza.

**Il trucco è un piano.** La pagina di aiuto di Notion dice che “Include subpages” per un export PDF richiede un piano Business o Enterprise (verificato su notion.com, 14 settembre 2026). Non è la strada Markdown, ma è un promemoria del fatto che “l’export è gratuito” vale per formato e non in generale.

**Il trucco sono i tuoi contenuti.** Un convertitore ospitato e gratuito gira su un server che qualcuno paga. Non è sinistro di per sé, ma vuol dire che “dove finisce il mio export” ha una risposta reale che non sempre sta scritta sulla pagina. La conversione lato browser risponde per costruzione: apri il pannello di rete, avvia la conversione, guarda che non esce niente. Se [un convertitore online sia sicuro](/blog/is-an-online-converter-safe) per un dato file è tanto una domanda sul file quanto sullo strumento.

**Il trucco è il tuo pomeriggio.** La strada dello script non ha fornitori, né quote, né questioni di privacy, e resta l’opzione più costosa qui dentro. Il software libero non è lavoro gratuito, e un convertitore che scrivi tu è un convertitore che manterrai tu la prossima volta che l’export di Notion cambia forma.

## Che cosa nessuno strumento gratuito recupera

Tre cose non escono da Notion in nessun formato e per nessuna strada, quindi nessun confronto fra convertitori può sistemarle.

**I commenti.** Un thread di commenti è attaccato a una pagina come discussione invece di essere conservato come contenuto della pagina, quindi non raggiunge nessun formato di export. Se una decisione esiste solo come risposta in un thread, spostala nel corpo della pagina prima di esportare; dopo è sparita, non semplicemente non convertita.

**Le viste di database non predefinite.** Notion esporta la vista che stai guardando o quella predefinita, non tutte. Un database filtrato in tre modi per tre pubblici esporta come uno dei tre; gli altri vanno ricostruiti dalle righe.

**I blocchi sincronizzati.** Un blocco sincronizzato è un blocco mostrato in più punti, e un export non ha modo di dirlo: ogni posizione riceve la sua copia, senza nessun segno che fossero mai collegate.

Un database, allo stesso modo, arriva come istantanea di righe — una tabella Markdown non ha formule, relazioni né rollup — quindi se quei numeri sono calcolati invece che digitati, controlla [la tabella che ne è uscita](/blog/markdown-tables-that-survive-conversion) prima di cancellare qualcosa dentro Notion.

## Come scegliere

1. **Decidi la forma dell’output prima di guardare qualunque strumento.** Un documento solo, una cartella di file con URL propri, oppure un vault. Ogni consiglio qui dentro discende da quella risposta, e sceglierla dopo aver convertito significa fare la conversione due volte.
2. **Conta quante volte succederà.** Una volta sola, e l’opzione senza configurazione vince sul tempo da sola — clic su Export, zip su un convertitore nel browser, finito in qualche minuto. Ogni settimana o a ogni deploy, e il costo di configurazione della strada API si ammortizza a zero nel giro di un mese.
3. **Chiediti se il contenuto può lasciare la tua macchina.** Uno spazio di lavoro che contiene stipendi, note sui colloqui o qualunque cosa non ancora pubblicata elimina i convertitori ospitati dalla lista prima ancora che cominci un confronto di funzioni, lasciando la conversione lato browser e gli strumenti locali da riga di comando.
4. **Controlla che cosa stai per perdere finché riesci ancora a vederlo.** Commenti, viste di database aggiuntive e blocchi sincronizzati sono assenti dall’output senza nessun errore che li segnali, quindi l’unica verifica affidabile è guardare la fonte dentro Notion prima.
5. **Conta le pagine con onestà.** Tre sono un copia-incolla. Trenta sono un export più un convertitore. Tremila sono uno script sull’API con gestione dei ritentativi, e anche un export che Notion può metterci quasi un giorno a produrre — quindi avvialo prima di averne bisogno.

## Conclusione

Non c’è nessun piano a pagamento da confrontare, il che rende questo un mercato insolitamente facile in cui fare la spesa e insolitamente facile in cui scegliere male. Le opzioni si distinguono per forma, non per prezzo: l’export di Notion tira fuori i contenuti e ti lascia in mano gli id; un convertitore nel browser trasforma quello zip in un unico documento leggibile e non carica niente; uno script di riscrittura tiene i file come file al prezzo del tuo pomeriggio; `notion-to-md` e Obsidian Importer leggono l’API come si deve, rispettivamente per pipeline e per vault; Pandoc converte in locale l’export HTML, più ricco. Scegli in base a dove va il Markdown e a quanto spesso farai questa cosa, prova con una pagina che contenga una tabella, un’immagine e un link a un’altra pagina, e ricorda che l’unico conto che questi strumenti mandano si paga in tempo.

## Domande frequenti

### Esiste un convertitore da Notion a Markdown davvero gratuito, senza prova e senza quota?

Sì, più d’uno. L’export Markdown & CSV di Notion è gratuito e integrato, un convertitore nel browser che unisce l’export gira in locale senza limiti per file, e `notion-to-md`, Obsidian Importer e Pandoc sono tutti software libero e gratuito. I limiti che incontrerai sono il limite di frequenza dell’API di Notion e la tua macchina, non un listino.

### Qual è il modo gratuito più veloce di convertire un intero spazio di lavoro Notion?

Esportalo una volta come Markdown & CSV, poi converti lo zip in un unico passaggio invece che pagina per pagina. Un convertitore nel browser che unisce produce un solo documento con un indice, senza rinomine né script; se le pagine devono restare file separati, metti in conto il tempo per la riscrittura degli id, perché è la parte che nessuno strumento gratuito fa automaticamente al posto tuo.

### Perché i nomi dei file esportati hanno dentro codici lunghi e casuali?

Sono id di pagina: 32 caratteri esadecimali che Notion usa per identificare una pagina, perché i titoli cambiano e non sono univoci. L’export scrive l’id dentro ogni nome di file e ogni link fra pagine, quindi toglierlo significa riscrivere entrambe le cose insieme a partire da un’unica mappa — oppure unire le pagine in un documento solo, dove non serve più che qualcosa corrisponda a un nome di file.

### Posso convertire un export di Notion senza caricarlo da nessuna parte?

Sì. Un convertitore che gira nel browser legge lo zip con l’API dei file della pagina stessa e non lo invia mai, cosa che puoi verificare aprendo il pannello di rete e guardando che non succede niente. Gli strumenti locali da riga di comando come Pandoc, e la modalità zip di Obsidian Importer, non toccano proprio la rete.

### Convertire Notion in Markdown richiede un piano Notion a pagamento?

Non per l’export Markdown & CSV. La pagina di aiuto di Notion dice però che “Include subpages” per un export **PDF** richiede un piano Business o Enterprise (verificato su notion.com, 14 settembre 2026), quindi controlla il formato che ti serve invece di dare per scontato che tutto il menu di export si comporti allo stesso modo.

### Conviene esportare in Markdown o in HTML?

Dipende da cosa succede dopo. Markdown è la strada più corta se il tuo convertitore lo prende direttamente. La documentazione di Obsidian raccomanda invece l’HTML, sostenendo che l’export Markdown di Notion omette informazioni — quindi se la fedeltà conta più della comodità, esporta in HTML e convertilo con Pandoc o con un importer che se lo aspetta.

### I convertitori gratuiti conservano i miei database di Notion?

In parte, e le differenze contano. L’export Markdown di Notion scrive ogni database a pagina intera come CSV accanto alle pagine; un convertitore nel browser che unisce trasforma quelle righe in una tabella dentro lo stesso documento; Obsidian Importer conserva i database sulla strada API ma non su quella dello zip. Nessuno conserva formule, relazioni, rollup o una vista diversa da quella esportata.
