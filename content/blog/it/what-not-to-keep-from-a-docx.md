---
title: "Cosa non conservare da un .docx: la formattazione persa nella conversione a Markdown"
description: Un inventario di cosa porta un file Word che Markdown non può esprimere, quali perdite contano, quali sono abitudini da abbandonare, e cosa fare con le didascalie
date: 2026-08-17
tag: Conversione
keywords: formattazione persa docx markdown, word to markdown perde la formattazione, conversione docx perde gli stili, didascalie word in markdown, riferimenti incrociati word markdown, modifiche tracciate markdown, interruzioni di pagina word markdown
---

Converti un documento Word in Markdown e manca qualcosa. A volte è la citazione evidenziata a pagina due. A volte è la numerazione. A volte non è niente che riesci a nominare, solo la sensazione che il documento assomigliasse a un documento e ora assomigli a un file di testo.

Entrambe le reazioni di solito hanno ragione, e riguardano cose diverse. Un `.docx` porta centinaia di informazioni distinte su come le sue parole dovrebbero apparire. Markdown ne porta una dozzina su cosa sono le sue parole. Convertire fra i due non è compressione; è un cambio di argomento. La domanda interessante non è quanto si è perso ma quali di quelle perdite ti devono importare.

### In breve

La maggior parte di quello che un `.docx` perde nel passaggio a Markdown è presentazione, ed è la parte che avresti comunque sovrascritto: font, dimensioni, colori, margini, interruzioni di pagina, colonne, intestazioni e piè di pagina descrivono tutti una pagina stampata che non esiste più. Quattro perdite sono reali e meritano lavoro: **le modifiche tracciate**, **i commenti**, **le didascalie**, e **i riferimenti incrociati**, perché ognuna porta un significato che non è recuperabile dalle sole parole. Le caselle di testo sono la perdita che la gente nota di meno, perché il testo semplicemente non c'è e niente lo segnala. Correggi didascalie e riferimenti incrociati a mano prima della conversione, conserva lo strato di revisione con uno strumento che ha un flag documentato per questo, e archivia l'originale in ogni caso.

## Cosa ha Markdown, e perché la lista è così corta

Aiuta vedere tutto il formato di destinazione in una volta. Markdown, nella specifica CommonMark, ti dà: paragrafi, sei livelli di titolo, enfasi, enfasi forte, liste ordinate e non ordinate, citazioni a blocco, span di codice, blocchi di codice con fence o indentati, interruzioni tematiche, link, immagini, interruzioni di riga forzate, e HTML grezzo. GitHub Flavored Markdown aggiunge tabelle, voci di lista di attività, barrato e autolink. Le note a piè di pagina non sono in nessuna delle due specifiche; GitHub le visualizza e molti parser no, il che [vale la pena sapere prima di affidarti a qualunque estensione](/blog/commonmark-gfm-and-the-flavours).

Questo è l'intero vocabolario. Non c'è sintassi per un carattere tipografico, un corpo, un colore, un margine, una pagina, una colonna, una didascalia, un riferimento incrociato, un commento, un inserimento, una cancellazione, una casella di testo, una tabulazione o una cella di tabella che si estende su due colonne. Non "supporto limitato" — nessuna sintassi affatto. Qualunque strumento che sembri conservare una di quelle cose sta emettendo HTML grezzo con un attributo `style`, che è un documento diverso travestito da estensione `.md`.

Il motivo per cui la lista è corta è una decisione di progetto, non una svista. Markdown descrive la struttura: questo è un titolo, questa è una lista, questa è una citazione. Come appare un titolo è un problema di qualcun altro, deciso più avanti, da un foglio di stile o da un renderer o da un tema. Word descrive entrambe le cose insieme e ti lascia saltare del tutto la struttura — puoi creare un titolo selezionando una riga, scegliendo 16pt grassetto, e centrando. Word lo visualizzerà esattamente come hai chiesto. Niente nel file registra che fosse un titolo.

Quella singola differenza spiega la maggior parte di quella che la gente chiama perdita di formattazione. Un convertitore legge un `.docx` cercando struttura. Dove il documento ha struttura, la conversione è pulita e leggermente noiosa. Dove il documento ha l'aspetto al posto della struttura, il convertitore non ha niente da leggere, e l'aspetto viene scartato perché non c'è nessun posto dove metterlo. Il documento non ha perso i suoi titoli. Non ne ha mai avuti.

## L'inventario, voce per voce, con un verdetto

Tutto quello che un `.docx` può portare, cosa ne può esprimere Markdown, e se la perdita merita la tua attenzione. "Rimpianto" significa che l'informazione è sparita e non si può ricostruire dalle parole. "Meno male" significa che il documento sta meglio senza. "Da correggere" significa che conta e c'è qualcosa di specifico da fare.

| Cosa porta il file Word | Equivalente Markdown | Verdetto | Cosa fare |
| --- | --- | --- | --- |
| Carattere tipografico e corpo | Nessuno | Meno male | Niente. Decide il renderer |
| Colore del testo ed evidenziazione | Nessuno | Meno male, a meno che il colore portasse un significato | Sostituisci la codifica a colori con parole prima di convertire |
| Grassetto e corsivo | `**` e `*` | Sopravvive | Niente |
| Maiuscoletto, contorno, ombra, spaziatura dei caratteri | Nessuno | Meno male | Niente |
| Apice e pedice | Solo HTML grezzo | Perdita minore | Accetta `<sup>`/`<sub>` nell'output, oppure riscrivi |
| Barrato | `~~` solo in GFM | Sopravvive per lo più | Controlla la variante del tuo renderer |
| Dimensione pagina, margini, orientamento | Nessuno | Meno male | Niente. Non ci sono pagine |
| Interruzioni di pagina | Nessuno | Meno male | Elimina le righe vuote residue e i marcatori superflui |
| Interruzioni di sezione | Nessuno | Meno male | Niente, a meno che le intestazioni cambiassero per sezione |
| Colonne multiple | Nessuno | Meno male | Niente. L'ordine di lettura ora è lineare |
| Intestazioni, piè di pagina, numeri di pagina | Nessuno | Rimpiangi una riga | Sposta "Riservato", la versione o la data nel corpo |
| Filigrane | Nessuno | Rimpiangi se diceva BOZZA | Metti lo stato nel front matter o nella prima riga |
| Tabulazioni, puntini guida, allineamento manuale | Nessuno | Meno male | Converti gli indici puntinati in link veri |
| Interlinea, rientri, spazio prima e dopo | Nessuno | Meno male | Niente |
| Caselle di testo e citazioni evidenziate | Nessuno; il testo di solito svanisce | Rimpiangi, e verifica | Cerca nell'output una frase che sapevi essere in una casella |
| Forme, SmartArt, grafici, diagrammi | Nessuno | Rimpiangi | Esporta come immagini e falli riferimento |
| Immagini inline | Solo riferimento `![]()` | Sopravvive come riferimento | Estrai i file; controlla ogni percorso |
| Modifiche tracciate | Nessuno | Rimpiangi — questa è quella costosa | Converti con uno strumento che le conserva, oppure tieni il `.docx` |
| Commenti | Nessuno | Rimpiangi | Esporta il thread separatamente prima di convertire |
| Note a piè di pagina e di chiusura | Solo sintassi di estensione | Dipende dal renderer | Testa un documento con note dall'inizio alla fine |
| Didascalie | Nessuno | Da correggere | Riscrivi come righe in corsivo o `<figcaption>` HTML |
| Riferimenti incrociati (`REF`, `PAGEREF`) | Nessuno; diventa testo obsoleto | Da correggere | Riscrivi come link di ancora prima o dopo la conversione |
| Campo indice generale | Nessuno | Meno male | Cancellalo; lascia che il renderer ne costruisca uno nuovo |
| Indice analitico e voci d'indice | Nessuno | Rimpiangi, raramente | Accetta la perdita oppure tieni un PDF |
| Segnalibri | Ancore dei titoli, indirettamente | Parziale | Ricrea l'ancora per qualunque cosa a cui puntavi |
| Collegamenti ipertestuali | `[]()` | Sopravvive | Controlla i link relativi e intra-documento |
| Liste numerate e puntate | `1.` e `-` | Di solito sopravvive, a volte collassa | Controlla che `numbering.xml` esista nell'archivio |
| Tabelle semplici | Tabelle GFM | Sopravvive | Conta le colonne |
| Celle unite, tabelle annidate, contenuto a blocchi nelle celle | Nessuno | Rimpiangi | Ridisegna a mano oppure tieni come HTML |
| Stili semantici: Titolo 1-9, Citazione, Didascalia | Titoli, citazioni a blocco | Sopravvive se usati correttamente | Correggi i documenti che simulano titoli con il grassetto |
| Stili decorativi: List Paragraph, Body Text, personalizzati | Nessuno | Meno male | Niente |
| Equazioni (OMML) | Nessuno; a volte testo confuso | Rimpiangi | Riscrivi in TeX o esporta come immagini |
| Controlli di contenuto e campi modulo | Nessuno | Rimpiangi se era un modulo | Il documento era un'applicazione, non un documento |
| Oggetti incorporati: fogli di calcolo, PDF, altri documenti | Nessuno | Rimpiangi | Estraili e conservali a parte |
| Proprietà del documento: autore, titolo, azienda, revisione | Front matter, se lo strumento lo scrive | Parziale | Copia a mano quello che conta nel front matter |
| Metadati di lingua e correzione | Nessuno | Meno male | Niente |
| Campi che calcolano: `DATE`, `STYLEREF`, `SEQ` | Testo congelato in cache | Da correggere | Trova e sostituisci ognuno con testo reale |

## Presentazione: font, dimensioni, colori, e stili senza significato

Questa è la categoria più grande per volume e la più piccola per conseguenza. Un `.docx` registra, per ogni run di caratteri, un insieme di proprietà: famiglia del font, dimensione in mezzi punti, peso, colore come valore esadecimale, evidenziazione, spaziatura, crenatura, se è maiuscoletto. Markdown non ne registra nessuna, e nemmeno l'HTML che un buon convertitore produce lungo la strada. Le proprietà vengono semplicemente lette e ignorate.

Per quasi ogni documento, questo è il risultato giusto. L'11pt Calibri era il predefinito di Word, non una decisione. I titoli blu erano il blu di qualunque tema fosse applicato nel 2019. L'unico paragrafo in Georgia è dove qualcuno ha incollato da un'email. Niente di tutto questo sopravvive, niente dovrebbe, e il documento si legge meglio una volta che un foglio di stile solo decide tutto con coerenza.

C'è un'eccezione, e vale la pena prenderla sul serio. A volte il colore è l'unico posto dove vive un significato. Una specifica dove il testo rosso significa "non ancora concordato". Un listino prezzi dove il verde significa "confermato". Una bozza di traduzione dove i passaggi evidenziati sono quelli da rivedere. Converti quel documento e ottieni un elenco piatto di voci senza modo di distinguere quali fossero quali, e le parole stesse non te lo diranno, perché il punto stesso del colore era che le parole non dovessero farlo.

Il rimedio non è un'impostazione del convertitore. Non c'è sintassi in cui convertire il colore. Il rimedio è passare venti minuti in Word prima, aggiungendo la parola per cui il colore stava — "(non concordato)", "(confermato)", "(da rivedere)" — e poi convertire. È noioso ed è l'unica cosa che funziona, ed è molto più facile prima della conversione che dopo, perché prima della conversione puoi ancora vedere quali erano rossi.

**Gli stili sono lo stesso problema con una superficie diversa.** Il meccanismo di stile di Word è genuinamente buono: un paragrafo porta un `w:pStyle` che nomina il suo stile, e la definizione dello stile vive in `word/styles.xml`. I convertitori leggono il nome dello stile e lo mappano. Heading 1 diventa `#`, Heading 2 diventa `##`, Quote diventa una citazione a blocco. mammoth spedisce una mappa di stili predefinita che fa esattamente questo e ti lascia aggiungere le tue mappature per gli stili aziendali che non può conoscere.

Il problema è che la maggior parte dei documenti Word non usa gli stili per la struttura. Usano Normal per tutto e ricorrono alla barra degli strumenti. Un documento scritto così converte in una lunga sequenza di paragrafi, correttamente, perché è quello che è. Il titolo che vedi a schermo è un paragrafo le cui proprietà di run dicono grassetto e 16pt per caso, e nessun convertitore lo promuoverà, perché promuoverlo significherebbe indovinare — e lo stesso documento ha grassetto 16pt da qualche parte in mezzo a una frase dove qualcuno ha enfatizzato il nome di un prodotto.

Poi c'è l'altra metà della lista di stili: List Paragraph, Body Text, Body Text Indent, No Spacing, più qualunque cosa un template abbia ereditato da un template ereditato dallo stile aziendale di un'azienda del 2011. Descrivono rientro e spaziatura. Non hanno contenuto semantico, non mappano su niente, ed eliminarli non è una perdita di nessun tipo. Se hai convertito un documento e l'output non ha traccia di "List Paragraph", niente è andato storto.

## Arredamento di pagina e contenuto che galleggia

Tutto in questa sezione descrive una pagina stampata. Markdown non ha pagine, e l'HTML reso in un browser non ha pagine finché qualcuno non lo stampa. Quindi queste perdite sono strutturali invece che accidentali — non c'è niente dall'altra parte a riceverle.

**Margini, dimensione pagina, orientamento e colonne** vivono in un elemento di proprietà di sezione, `w:sectPr`, alla fine di una sezione. Registra il formato carta, i quattro margini, il canale di rilegatura, se le pagine si specchiano, e il layout delle colonne. Sparisce tutto. Notevolmente, sparisce anche il problema dell'ordine di lettura che le colonne creano: un layout a due colonne in Word è una sola storia continua che scorre in due riquadri, e convertirlo produce la storia in ordine. La gente si aspetta che questo si rompa e di solito non succede.

**Le interruzioni di pagina** sono un run contenente `<w:br w:type="page"/>`, oppure una proprietà di paragrafo che dice page-break-before. Non c'è Markdown per loro perché non c'è una pagina da interrompere. La maggior parte dei convertitori le elimina in silenzio. Se il tuo output ha una riga vuota strana o un marcatore superfluo dove un capitolo iniziava, quello è il residuo. Cancellalo. Se il documento ha davvero bisogno di interrompersi per la stampa più avanti, il posto dove dirlo è il CSS di qualunque cosa lo renda — `break-before: page` su una classe di titolo — non nel Markdown.

**Intestazioni, piè di pagina e numeri di pagina** sono parti separate nell'archivio: `word/header1.xml`, `word/footer1.xml` e i loro simili, richiamati dalle proprietà di sezione. Tutto le elimina, e normalmente è corretto, perché "Pagina 3 di 12" non ha senso in un documento senza pagine.

Una riga di un piè di pagina di solito merita di essere salvata. Un documento il cui piè di pagina diceva "Riservato — solo uso interno — v4.2 — revisionato il 12 marzo" è stato ora ripubblicato, in un formato facile da condividere, senza niente di tutto ciò. La classificazione, la versione e la data di revisione stavano solo nell'arredamento. Prima di convertire, leggi intestazione e piè di pagina una volta, e metti quello che conta nel front matter o nella prima riga del corpo, dove un lettore lo incontrerà davvero.

**Le filigrane** sono la stessa storia in forma più drammatica. Una filigrana BOZZA è una forma nell'intestazione, disegnata dietro il testo. Converte in niente, quindi una bozza diventa indistinguibile da un documento finale. Di' "Bozza" a parole.

**Le caselle di testo sono la perdita che la gente fatica di più a credere.** Una casella di testo non fa parte del flusso del documento; è un oggetto di disegno, e il testo al suo interno sta in un elemento `w:txbxContent` attaccato a una forma. A seconda di come è stata creata, quella forma può essere avvolta in un blocco di contenuto alternativo che tiene due versioni di se stessa per versioni diverse di Word. I convertitori che percorrono il corpo del documento cercando paragrafi possono non arrivarci mai dentro. Quindi la citazione evidenziata che vedi a schermo, la barra laterale con la definizione chiave dentro, la casella colorata con il riassunto di tre frasi che qualcuno chiederà più avanti — niente di tutto ciò appare nell'output, e nessun errore viene sollevato, perché dal punto di vista del convertitore niente è stato saltato.

L'unico controllo affidabile è cercare. Prendi una frase da ogni elemento in una casella nell'originale, uno per uno, e cercala nel file convertito. Se manca, riscrivila — come citazione a blocco, come titolo, o come paragrafo ordinario nel posto a cui appartiene. E fallo prima di archiviare il `.docx`, perché la ricerca è facile mentre entrambi i file sono aperti e impossibile una volta che ne hai uno solo.

**Forme, SmartArt, grafici e diagrammi** vanno nello stesso modo e per lo stesso motivo, tranne che qui la perdita è indiscutibile: un diagramma di processo è informazione, e Markdown non ha modo di conservarla. Esporta ognuno come PNG o SVG da Word, metti i file in un posto stabile, e falli riferimento. Questo trasforma una perdita totale in una dipendenza da immagine, che è un problema molto più piccolo — anche se non gratuito, dato che [un riferimento a un'immagine che funziona in locale può comunque rompersi quando il file si sposta](/blog/images-and-links-that-still-work).

## Lo strato di revisione: modifiche tracciate e commenti

Questa è la categoria dove una conversione fatta con leggerezza distrugge qualcosa che nessuno può ricostruire.

Un `.docx` revisionato non contiene il testo finale. Contiene entrambi i testi insieme: inserimenti avvolti in `w:ins`, cancellazioni avvolte in `w:del`, ognuno con un autore e una marca temporale, e il testo cancellato conservato per intero dentro la cancellazione. Questo è ciò che rende possibile il riquadro di revisione di Word. È anche ciò che rende un documento Word l'archivio di una negoziazione invece che l'affermazione di una posizione.

Markdown non ha niente per questo. Non c'è sintassi per "questa clausola è stata inserita dalla controparte martedì" e non c'è sintassi per "queste undici parole sono state rimosse". Un convertitore quindi deve scegliere, e la maggior parte sceglie senza dirtelo. Il comportamento abituale è darti il testo come se tutte le modifiche fossero state accettate — che è una delle tre risposte plausibili, applicata in silenzio, a una domanda che non ti è stata fatta. Le cancellazioni di qualcuno ora sono sparite, e con loro il fatto che siano mai state proposte.

Pandoc è lo strumento con un controllo documentato qui: `--track-changes` prende `accept`, `reject` o `all`, e solo `all` conserva entrambe le versioni nell'output, avvolte in span. L'approccio di mammoth è diverso — lavora da una mappa di stili, e il markup di revisione non è qualcosa che i suoi predefiniti mostrano. La conseguenza pratica è la stessa in entrambi i casi: se un documento è passato per la revisione e non stai deliberatamente conservando la revisione, stai convertendo il risultato e scartando l'argomentazione.

**I commenti sono peggio, perché non hanno dove attaccarsi.** Un commento di Word è ancorato a un intervallo di testo con i marcatori `w:commentRangeStart` e `w:commentRangeEnd`, e il testo del commento stesso vive in `word/comments.xml` con un autore, una data, e possibilmente un thread di risposte. Markdown non ha il concetto di annotazione su un intervallo. Anche se un convertitore scrivesse il testo del commento, potrebbe solo metterlo vicino al testo, non su di esso, e l'ancoraggio è metà del significato: "questo" in un commento si riferisce esattamente alle parole a cui era attaccato.

Il manuale di Pandoc dice esplicitamente che `accept` e `reject` ignorano i commenti, e solo `all` li include. mammoth può essere fatto emettere riferimenti ai commenti se aggiungi una mappatura di stile per loro, cosa che la sua documentazione copre e quasi nessuno fa. Tutto il resto li elimina e non dice niente.

Il consiglio onesto è smettere di trattare questo come un problema di conversione. Se il thread di revisione conta — e su un contratto, una specifica o un articolo è spesso la cosa più preziosa nel file — tiralo fuori da Word con i suoi stessi mezzi per primo. Word può stampare o esportare il documento con i commenti, e un PDF della versione marcata è un archivio perfettamente valido. Poi converti il testo pulito in Markdown per il futuro, e tieni la copia marcata per il passato. Due file, ognuno bravo in un lavoro, è un risultato migliore di un file che finge di fare entrambi.

Le note a piè di pagina stanno al confine di questa categoria. Hanno almeno una casa possibile: `word/footnotes.xml` le conserva, e il dialetto Markdown proprio di Pandoc ha una sintassi per note a piè di pagina in cui scriverle. Ma le note a piè di pagina non sono in CommonMark, quindi un convertitore che punta a CommonMark rigoroso deve metterle inline, aggiungerle come paragrafi ordinari alla fine, o scartarle. Converti un documento con note, scorri fino in fondo, e guarda, prima di dare per scontato il comportamento che vuoi sia quello che hai.

## Didascalie, riferimenti incrociati e campi: le perdite che meritano lavoro

Questi meritano una sezione a sé perché sono le uniche perdite in questo articolo dove un pezzo di lavoro specifico e ripetibile converte in modo affidabile un cattivo risultato in uno buono.

**Una didascalia in Word non è una riga di testo sotto un'immagine.** È un paragrafo nello stile Caption che contiene un campo `SEQ` — qualcosa come `SEQ Figure \* ARABIC` — che Word calcola per produrre il numero. Questo è il motivo per cui inserire una nuova figura a metà documento rinumera tutto quello che segue. Il numero non è scritto; è derivato dalla posizione.

Converti quel documento e succedono due cose. Lo stile Caption non ha equivalente Markdown, quindi il paragrafo diventa un paragrafo ordinario, visivamente indistinguibile dal testo del corpo. E il campo collassa a qualunque numero Word abbia calcolato l'ultima volta, congelato. Ora hai un documento dove "Figura 4" è una frase semplice seduta fra due paragrafi, e dirà ancora 4 dopo che avrai cancellato la Figura 2.

Ci sono due rimedi decenti e uno cattivo. Quello cattivo è lasciarli e sperare. Il primo decente è accettare che la didascalia ora è prosa e farla sembrare deliberata: una riga in corsivo subito dopo l'immagine, con la numerazione rimossa del tutto o rinumerata a mano e mai più toccata. Rimuovere i numeri di solito è meglio, perché una didascalia che dice cosa mostra la figura è più utile di una che dice quale figura è, e non può diventare obsoleta.

Il secondo è mantenere la semantica passando all'HTML, cosa che Markdown permette: un elemento `<figure>` che avvolge l'immagine con un `<figcaption>` dentro. Questo dà a un renderer qualcosa di reale da stilizzare e a uno screen reader qualcosa di reale da annunciare. Ti costa la leggibilità del sorgente Markdown in quel punto, ed è lo scambio giusto per documenti dove le figure sono portanti — un articolo, un manuale, un rapporto con venti diagrammi. Il Markdown di Pandoc ha un'estensione `implicit_figures` che tratta un paragrafo contenente solo un'immagine come una figura con il testo alternativo come didascalia, il che vale la pena saperlo se stai già convertendo tramite Pandoc, perché significa che scrivere la didascalia come testo alternativo ti dà la struttura gratis.

**I riferimenti incrociati sono lo stesso meccanismo puntato verso l'interno, e falliscono più silenziosamente.** "Vedi la sezione 4.2 a pagina 11" è, nel file, un campo `REF` che punta a un segnalibro e un campo `PAGEREF` che punta alla pagina dello stesso segnalibro. Word ricalcola entrambi. Markdown non ha nessuno dei due, e nemmeno il segnalibro stesso ha un equivalente, quindi quello che ottieni è il testo in cache: una frase che dice "vedi la sezione 4.2 a pagina 11", in un documento senza sezioni numerate così e senza pagina 11.

Questo è peggio di una didascalia mancante perché non è visibilmente rotto. Si legge come un riferimento incrociato funzionante. Un lettore lo segue, non trova niente, e conclude che il documento è sbagliato invece che convertito.

Il lavoro è meccanico e vale la pena farlo. Cerca nel file convertito "vedi", "sopra", "sotto", "pagina", "sezione", "figura", "tabella" e "appendice", e occupati di ogni corrispondenza:

- Un riferimento a un titolo diventa un link all'ancora di quel titolo. I renderer Markdown generano le ancore dal testo del titolo — di solito in minuscolo con gli spazi sostituiti da trattini, anche se la regola esatta varia per renderer, quindi controllane uno prima di scriverne cinquanta. `[le regole di conservazione](#conservazione-dei-dati)` sopravvive alla rinumerazione perché punta alle parole, non al numero
- Un riferimento a un numero di pagina deve andarsene. Non c'è pagina. Riscrivilo come riferimento alla sezione, oppure cancella la clausola
- Un riferimento a una figura o tabella segue quello che hai deciso sulle didascalie. Se hai eliminato i numeri, il riferimento deve nominare la cosa invece: "il diagramma di deployment" invece di "Figura 4"
- Un riferimento a una clausola numerata in un contratto o standard resta come testo, perché la numerazione fa parte del contenuto e non qualcosa che il renderer calcola

**L'indice generale non richiede lavoro, solo la cancellazione.** Un TOC di Word è un campo, e quello che converte è il testo in cache: un elenco di titoli con puntini guida e numeri di pagina, seduto in cima al tuo documento come paragrafi ordinari. Non può aggiornarsi e diventerà obsoleto entro una settimana. Cancella tutto quanto. Ogni renderer di documentazione e la maggior parte dei generatori di siti statici costruiscono un indice dai titoli, e sarà sempre corretto perché è derivato invece che ricordato.

**Gli altri campi calcolati meritano un passaggio ciascuno.** `DATE` diventa la data in cui è stato aggiornato l'ultima volta, quindi una lettera convertita oggi può dichiarare di essere di qualunque momento qualcuno l'abbia aperta in Word l'ultima volta. I campi `STYLEREF`, comuni nelle intestazioni correnti, ripetono il testo di un titolo e lo congelano. La numerazione automatica delle liste interagisce con tutto questo. La regola generale è semplice: qualunque cosa Word abbia calcolato ora è un fossile dell'ultimo calcolo, quindi leggi ogni numero nel documento convertito una volta e chiediti da dove viene.

## Dove fallisce "converti e poi correggi"

L'approccio ovvio è eseguire la conversione, guardare l'output, e riparare quello che è sbagliato. È l'approccio giusto per la maggior parte dei documenti e fallisce in quattro modi specifici che vale la pena conoscere prima di impegnarsi.

**Non puoi riparare quello che non vedi mancante.** Questo è il problema delle caselle di testo generalizzato. La riparazione funziona quando l'output è visibilmente sbagliato: una tabella con le colonne spostate, un titolo al livello sbagliato, un'immagine rotta. Non funziona quando l'output è silenziosamente incompleto, perché non c'è nessun segnale. Niente in un file convertito dice "qui c'era una barra laterale". L'unica difesa è un confronto con l'originale, e un confronto è possibile solo mentre hai ancora l'originale aperto — il che significa che il controllo deve avvenire al momento della conversione, non più avanti quando qualcuno se ne accorge.

**L'informazione che ti serve per correggere è nel file che hai sostituito.** Quali voci erano rosse. Cosa diceva il piè di pagina. Chi ha proposto di cancellare la terza clausola e perché. Dove si trovava davvero la Figura 4 prima che la numerazione si congelasse. Tutto questo è nel `.docx`, niente è nel Markdown, e nel momento in cui il `.docx` sparisce la riparazione smette di essere possibile e diventa una ricostruzione. Tenere l'originale non è sentimentalismo; è l'unica copia delle risposte.

**Correggerlo dopo significa correggerlo in ogni copia.** Un documento convertito è facile da spostare. Qualcuno lo incolla in un wiki, lo committa in un repository, lo manda a un cliente. Due settimane dopo noti i riferimenti incrociati congelati. Ora la riparazione va fatta in quattro posti, tre dei quali non conosci. Convertire cento documenti moltiplica questo per cento, il che è l'argomento vero per una checklist da eseguire una volta per documento invece di una correzione applicata quando la scopri.

**Alcune cose costano di più da correggere che da rifare.** Un documento con celle unite, tabelle annidate e celle contenenti liste non si può riparare in Markdown, perché la sintassi delle tabelle di Markdown non ha estensioni né contenuto a blocchi nelle celle; puoi solo ridisegnare i dati o tenerli come tabella HTML. [Le tabelle sono la cosa più comune che si rompe in entrambe le direzioni](/blog/markdown-tables-that-survive-conversion) e la meno disposta a essere sistemata dopo il fatto. Un documento costruito interamente da caselle di testo e forme — una brochure, un poster, un layout a una pagina progettato — non è un documento con formattazione da perdere. È un layout, e le parole sono incidentali a esso. Convertirlo produce un frammento di prosa che nessuno vuole, e la risposta onesta è che il file dovrebbe restare un PDF.

Quello che costa, sommato tutto: il tempo non sta nella conversione, che richiede secondi, e non nelle riparazioni ovvie, che richiedono minuti. Sta nel controllo, che richiede dieci-venti minuti per un documento di una certa sostanza, e nel tenere l'originale, che richiede spazio su disco e una convenzione di denominazione. Le squadre che saltano il controllo non lo scoprono subito. Lo scoprono quando qualcuno chiede cosa diceva il paragrafo cancellato.

## Cosa decidere prima di convertire

1. **Stabilisci se il documento ha struttura o solo aspetto.** Apri il pannello degli stili e guarda. Se i titoli sono veri stili Heading, la conversione sarà pulita e il tuo controllo sarà veloce; se tutto è Normal con grassetto manuale, l'output sarà un muro di paragrafi e nessun convertitore ti salverà, quindi la strada più economica è applicare veri stili in Word prima e convertire una volta sola.
2. **Leggi intestazione, piè di pagina e qualunque filigrana prima di toccare qualunque cosa.** Qualunque cosa dicano — una classificazione, una versione, una data di revisione, la parola BOZZA — non esiste da nessun'altra parte nel file e sarà sparita in un passaggio, e un documento ripubblicato senza la propria classificazione è una divulgazione invece che una conversione.
3. **Scopri se il file è stato revisionato.** Le modifiche tracciate e i commenti sono le perdite che non puoi disfare, quindi se la revisione conta, esporta prima un PDF marcato e converti dopo il testo pulito; se salti questo passaggio, stai scegliendo di scartare l'argomentazione e tenere solo il risultato.
4. **Fai l'inventario a mano del contenuto che galleggia.** Conta le caselle di testo, le forme, gli SmartArt e i grafici, scrivi il conteggio, e verifica lo stesso conteggio contro l'output, perché questi sono gli unici elementi che spariscono senza lasciare traccia e il controllo richiede un minuto per elemento.
5. **Decidi la regola per le didascalie una volta, per tutti i tuoi documenti.** O le didascalie diventano righe in corsivo senza numeri, o diventano blocchi `<figure>` e `<figcaption>`; deciderlo documento per documento garantisce un insieme incoerente di file e un secondo passaggio più avanti.
6. **Ripulisci i riferimenti incrociati prima di pubblicare, non dopo.** Ogni "vedi pagina 11" e "come mostrato in Figura 4" ora è testo congelato che si legge come se funzionasse, e una volta che il file è stato copiato in un wiki e in un repository stai correggendo la stessa frase in tre posti.
7. **Tieni il `.docx`, e mettilo da qualche parte facile da trovare.** Ogni perdita in questo articolo è a senso unico, quindi l'originale è il tuo unico archivio di cosa sapeva il documento, e il costo di tenerlo è qualche centinaio di kilobyte contro il costo di non tenerlo, che è una domanda a cui non puoi rispondere affatto.

## Conclusione

La maggior parte di quello che un `.docx` perde nel passaggio a Markdown non valeva la pena tenerlo: il carattere tipografico, il corpo, i margini, le interruzioni di pagina, le colonne, i puntini guida e le due dozzine di stili di paragrafo che descrivevano solo spaziatura. Eliminarli è il punto dell'esercizio, perché un documento che descrive la propria struttura può essere stilizzato con coerenza, cercato, confrontato riga per riga e revisionato in un modo che un documento che descrive il proprio aspetto non può. Le quattro cose che meritano lavoro sono lo strato di revisione, le didascalie, i riferimenti incrociati e qualunque cosa sia seduta in una casella di testo, e tutte e quattro sono più facili da gestire prima della conversione che dopo. [Il percorso passo per passo e la sua checklist](/blog/convert-docx-to-markdown) copre come eseguire la conversione stessa, e [il confronto degli strumenti che la fanno](/blog/best-word-to-markdown-converters) copre quale usare; per un file solo che preferiresti non caricare, [la conversione da Word a Markdown di TransformPipe](/word-to-markdown) gira nel browser, gratis, con il `.docx` che non lascia mai la tua macchina quando sei disconnesso. Qualunque strada prendi, archivia l'originale, perché i font, i piè di pagina, i commenti e la citazione evidenziata che non hai notato non torneranno indietro.

## FAQ

### Perché il mio documento Word perde tutta la formattazione quando lo converto in Markdown?

Perché Markdown non ha sintassi per la maggior parte di essa. Non c'è modo di esprimere un carattere tipografico, un corpo, un colore, un margine o un'interruzione di pagina in Markdown, quindi un convertitore li legge e li ignora tutti. Quello che sopravvive è la struttura — titoli, liste, link, tabelle, enfasi — e solo dove il documento l'ha registrata come struttura invece che come aspetto.

### Perché i miei titoli sono usciti come paragrafi ordinari?

Quasi certamente perché non erano mai stati titoli. Se un titolo è stato creato selezionando una riga e applicando grassetto e un corpo più grande, il file registra proprietà di run, non un titolo, e un convertitore non ha niente da promuovere. Applica veri stili Heading in Word e converti di nuovo; la differenza è immediata.

### Cosa succede alle didascalie quando converto un .docx in Markdown?

Lo stile Caption non ha equivalente Markdown, quindi la didascalia diventa un paragrafo semplice, e il campo `SEQ` che produceva il suo numero collassa all'ultimo valore calcolato da Word. Riscrivi le didascalie come righe in corsivo senza numeri, che non possono diventare obsolete, oppure usa `<figure>` e `<figcaption>` HTML dove le figure contano.

### I riferimenti incrociati possono sopravvivere a una conversione da Word a Markdown?

Non come riferimenti incrociati. Un campo `REF` o `PAGEREF` diventa il testo che Word ha calcolato l'ultima volta, quindi "vedi la sezione 4.2 a pagina 11" arriva sembrando corretto e puntando al niente. Riscrivi ognuno come link Markdown all'ancora del titolo di destinazione, e cancella tutto quello che si riferisce a un numero di pagina.

### Dove sono finite le mie caselle di testo?

Probabilmente da nessuna parte — il testo non è mai stato estratto. Una casella di testo è un oggetto di disegno invece che parte del flusso del documento, e molti convertitori non arrivano al suo interno, senza sollevare nessun errore. Cerca nel file convertito una frase che sapevi essere in ogni casella, e riscrivi quello che manca mentre hai ancora l'originale aperto.

### Dovrei tenere il .docx originale dopo la conversione?

Sì, sempre. Ogni perdita descritta qui è a senso unico, e l'originale è l'unico archivio rimasto di cosa diceva il piè di pagina, quali voci erano evidenziate, chi ha proposto quale cancellazione, e cosa c'era nella barra laterale. Costa qualche centinaio di kilobyte e risponde a domande che il Markdown non può.

### Vale la pena convertire un documento progettato come una brochure?

Di solito no. Una brochure o un poster è un layout in cui le parole sono posizionate invece di un documento in cui scorrono, e convertirlo produce frammenti di prosa scollegati con il design sparito. Se l'artefatto è il design, tienilo come PDF e scrivi la versione Markdown da zero quando te ne serve una.
