---
title: "Markdown o Word per la documentazione: quale formato deve possedere la fonte"
description: "Markdown o Word per la documentazione: la scelta dipende dal lavoro del documento - revisione, chi modifica, cronologia, layout, ricerca, firma e pubblicazione"
date: 2026-09-05
tag: Workflow
keywords: markdown o word per la documentazione, markdown vs docx, formato della documentazione, docs as code, word o markdown, docx o markdown, formato della documentazione tecnica
---

Chiedi a un'organizzazione dove viva la sua documentazione e di solito arrivano tre risposte insieme: una cartella di file `.docx` su un'unità condivisa, un wiki che nessuno modifica da quando è cambiato l'organigramma, e una cartella `docs/` in un repository che leggono solo gli ingegneri. Tutte e tre sono in parte attuali. Nessuna delle tre è la fonte di verità, e il motivo non è mai che qualcuno abbia scelto apposta il formato sbagliato. È che nessuno ha mai deciso quale formato avesse il diritto di essere l'originale.

Da lì la discussione si conduce come una questione di gusto. Gli ingegneri dicono che Word è un disastro; il resto dell'azienda dice che Markdown è un rito di iniziazione. Entrambe le parti descrivono un'esperienza reale, e nessuna delle due descrive la decisione vera, che non riguarda affatto le preferenze. Riguarda quello che un documento specifico deve fare — essere revisionato, essere modificato da dodici persone, essere cercabile, essere stampato, essere firmato, essere pubblicato, essere controllato tre anni dopo quando qualcuno chiede perché una clausola dice trenta giorni.

Questo articolo decide caso per caso. È una domanda diversa da [Markdown contro l'HTML scritto a mano](/blog/markdown-vs-html), che riguarda il formato di scrittura contro il formato di pubblicazione; qui entrambi i candidati sono formati di scrittura, e la domanda è quale dei due debba essere l'originale da cui si genera tutto il resto.

### In breve

Decidi in base al lavoro del documento, non al gusto della squadra. Se il documento cambia spesso, viene revisionato da più di una manciata di persone, deve essere cercato e modificato in blocco, e finisce su una pagina web, Markdown nel controllo di versione vince su quasi ogni asse. Se deve essere stampato su un modello, firmato, depositato presso qualcuno che impone un layout, o letto riga per riga da una persona il cui lavoro intero sono i contratti, vince Word, e nessuna quantità di strumenti cambia questo fatto. La maggior parte delle organizzazioni ha bisogno di entrambi — e l'unico assetto che sopravvive è quello in cui un formato è la fonte e l'altro un export generato, mai entrambi come fonti.

## Cos'è un .docx, cos'è un file .md, e cosa produce a valle

Un `.docx` è un archivio zip. Rinominalo, scompattalo, e ottieni una cartella di parti XML: una che contiene il testo del documento, un'altra gli stili con nome, un'altra le definizioni degli elenchi che fanno rinumerare da sole le liste numerate, e una parte delle relazioni che collega identificatori interni a immagini, link, intestazioni e piè di pagina. Il formato è documentato e standardizzato — è Office Open XML, pubblicato come ECMA-376, e tutte le quattro parti della specifica si possono scaricare gratis (verificato su ecma-international.org, 9 settembre 2026) — cosa che conta per la longevità, ma niente di tutto ciò è pensato per essere letto da una persona. Apri la parte principale dell'archivio in un editor di testo e trovi qualche migliaio di caratteri di markup prima della prima frase del tuo documento. [L'anatomia di quell'archivio e cosa decide ogni parte](/blog/convert-docx-to-markdown) merita di essere letta se un giorno devi convertirne uno.

Un file `.md` è testo. Sono le frasi che hai scritto, in UTF-8, con un piccolo insieme di convenzioni sovrapposte: cancelletti per i titoli, asterischi per l'enfasi, trattini per gli elenchi, barre verticali per le tabelle, apici inversi per il codice. Non c'è contenitore, non c'è una parte di stile separata, non c'è tabella delle relazioni. La struttura è codificata come caratteri all'inizio delle righe, il che significa che la struttura è visibile a qualunque cosa sappia leggere una riga di testo.

Quest'unica differenza produce quasi tutto il resto di questa pagina:

- **Cosa può mostrare un diff.** Un cambiamento in un file di testo è un cambiamento in una riga. Un cambiamento in un archivio zip è un cambiamento in un blob binario, quindi gli strumenti che confrontano le versioni non hanno niente su cui lavorare se non il file intero.
- **Cosa può toccarlo uno strumento.** Qualunque cosa sa leggere un file di testo — grep, un linter, uno script di build, un correttore ortografico, un editor su un telefono. Leggere un `.docx` richiede una libreria che capisca il formato, e riscriverlo in sicurezza richiede molto più di quello.
- **Cosa può esprimere il formato.** Word può memorizzare un commento ancorato a un intervallo di caratteri, uno schema di numerazione che si rinumera quando inserisci una voce, un'intestazione che si ripete su ogni pagina e un indice che si aggiorna da solo. Markdown non memorizza niente di tutto ciò, perché non memorizza altro che il testo.
- **Se i byte si descrivono da soli.** Un file Markdown letto senza nessun software mostra comunque i titoli come titoli. Un `.docx` letto senza software mostra XML.
- **Di chi ci si può fidare.** Un file di testo può essere modificato in sicurezza da chiunque, senza formazione, perché ci sono pochissimi modi di rompere il parsing. Un documento Word si può rompere in modi invisibili finché non viene stampato.

L'archivio non è un difetto di progettazione. È il prezzo di ciò che sa fare, e quelle cose sono reali. L'errore è pensare che il prezzo valga la pena per ogni documento, e l'errore opposto è pensare che non valga mai la pena.

## Markdown contro Word per la documentazione: il bigliettino

Una tabella sola, letta in orizzontale. L'ultima colonna è il verdetto onesto piuttosto che un vincitore, perché parecchie di queste righe vanno davvero nella direzione opposta.

| Dimensione | Markdown nel controllo di versione | Word (.docx) | Chi vince, e quando |
| --- | --- | --- | --- |
| Revisionare un cambiamento | Diff a righe: le parole cambiate appaiono come parole cambiate | Modifiche traccianti: ogni modifica attribuita, accettata o rifiutata singolarmente | Markdown per tante piccole modifiche; Word quando ogni frase richiede una decisione |
| Commentare una frase | Commento di revisione su una riga, in una pull request | Commento ancorato a un intervallo di caratteri, con un filo di risposte | Word, chiaramente, per i revisori non tecnici |
| Due persone che modificano insieme | Branch e merge, conflitti segnalati riga per riga | Coautoria in cloud, o copie via email fuse a mano | Markdown per un insieme di file; Word in cloud per un file, un'ora |
| Chi può modificare senza formazione | Chiunque sappia digitare, una volta superato il flusso di lavoro | Chiunque abbia usato un computer | Word, e pretendere il contrario è come i documenti diventano obsoleti |
| Cronologia | Ogni cambiamento, con un messaggio, un autore e un motivo | Istantanee per data e autore, sulla piattaforma che conserva il file | Markdown: l'unità è un cambiamento, non una copia |
| Perché una frase dice quello che dice | Incolpa la riga, leggi il commit, leggi la pull request | Leggi l'elenco delle versioni e indovina | Markdown, e non è nemmeno vicino |
| Ricerca su tutto l'insieme | Ricerca esatta e con espressioni regolari, in un secondo, da qualunque parte | Ricerca della piattaforma, che trova documenti e non righe | Markdown |
| Cambiare una frase in 200 file | Un comando, un diff, una revisione | Apri 200 file, o scrivi uno script contro l'XML | Markdown |
| Layout di pagina, intestazioni, piè di pagina, interruzioni | Non esprimibile | Nativo, ed è il motivo per cui il formato esiste | Word |
| Modello aziendale e stili con nome | Vive nel convertitore o nel tema del sito | Vive nel documento, applicato da chi scrive | Word per un caso isolato; Markdown per la coerenza su centinaia di documenti |
| Numerazione automatica e riferimenti crociati | Non nel formato; alcuni generatori aggiungono ancore | Campi che si rinumerano e si ripuntano da soli | Word |
| Stampa e firma | Richiede un passaggio di conversione in PDF | Il documento è già impaginato | Word |
| Pubblicazione su una pagina web | Una conversione, o un generatore | Markup salva-come-pagina-web, o una conversione passando per Markdown comunque | Markdown |
| Esempi di codice | Blocchi delimitati, linguaggio indicato, mai autocorretti | L'autocorrezione cambia le tue virgolette e i trattini | Markdown, ed è un problema di correttezza |
| Accessibilità | Semantico per costruzione, verificato una volta nel tema | Attributi ricchi disponibili, verificati per ogni documento | Pareggio: Markdown costa meno, Word è più capace |
| Longevità dei byte | Testo: leggibile senza software | Standardizzato e ampiamente leggibile, ma richiede un'applicazione | Markdown |
| Dipendenza dal fornitore | Nessuna che valga la pena nominare | Non il formato; il modello, le macro e le abitudini | Markdown |
| Immagini | Riferite come file separati, che possono andare persi | Portate dentro l'archivio, che non può perderle | Word per un file singolo che viaggia |
| Costo degli strumenti | Un host, un'abitudine di revisione, un passaggio di build che qualcuno possiede | Già installato su ogni scrivania | Word per una piccola squadra senza ingegneri |

Il pattern è coerente al punto da poterlo dire chiaramente: Markdown vince ogni riga su cambiamento, scala e tempo, e Word vince ogni riga su pagine, commenti di revisione e la persona meno tecnica dell'edificio. Qualunque decisione che ignori una delle due metà verrà ribaltata più avanti da chi la eredita.

## Revisione, cronologia, e chi può modificarla

Questi tre argomenti risolvono più casi reali di qualunque discussione sulla sintassi, e il primo viene discusso quasi sempre in modo ingiusto da entrambe le parti.

### Un diff e le modifiche traccianti non sono lo stesso strumento

Un diff mostra la differenza tra due stati. Le modifiche traccianti mostrano gli atti del cambiare: questa persona ha depennato quella clausola, questa persona ha inserito quelle cinque parole, e ciascuna può essere accettata o rifiutata per proprio conto. Sono prodotti diversi, e le discussioni che la gente fa su di essi sono di solito due persone che descrivono lavori diversi.

Per un avvocato che legge un contratto, le modifiche traccianti con commenti a margine sono lo strumento migliore, e non è nemmeno vicino. L'unità di lavoro è la singola proposta — chi ha suggerito questa formulazione, cosa ne ha detto a margine, la accetto o controbatto — e Word modella esattamente quello. Una pull request modella qualcosa d'altro: un insieme coerente di modifiche, proposte insieme, accettate o rifiutate insieme. Puoi approvare un diff riga per riga nella maggior parte degli strumenti di revisione, ma non puoi consegnare a qualcuno un documento con quattordici proposte indipendenti e lasciare che ne prenda nove.

Per dodici persone che modificano un manuale del personale, le modifiche traccianti sono lo strumento peggiore, e anche questo non è vicino. Dodici revisori producono dodici copie. Qualcuno le fonde a mano, il che significa che qualcuno legge lo stesso paragrafo dodici volte e decide quale delle quattro riformulazioni tenere, senza nessuna traccia in seguito di cosa sia stato rifiutato o perché. Il file chiamato `manuale_finale_v3_JS_commenti_aggiornati.docx` non è una battuta sui nomi dei file; è il sintomo visibile di un formato senza un'operazione di merge. La coautoria in cloud elimina le copie, un miglioramento genuino, ma elimina anche la traccia insieme a esse: tutti modificano il documento live, e la cronologia diventa un elenco di orari piuttosto che un elenco di decisioni.

| Modello di revisione | Unità di revisione | Attribuzione | Concorrenza | Traccia successiva |
| --- | --- | --- | --- | --- |
| Modifiche traccianti in file via email | Un inserimento o una cancellazione | Per modifica, per autore | Una persona alla volta per copia | Quello che chi ha fuso si è ricordato |
| Modifiche traccianti in un file co-redatto in cloud | Un inserimento o una cancellazione | Per modifica, mentre è in sospeso | Molte persone insieme | Istantanee cronometrate del documento |
| Pull request su Markdown | Un insieme di modifiche collegate | Per commit e per commento | Molte persone, su branch | Permanente: diff, discussione, decisione |
| Solo commenti, nessuna modifica | Un suggerimento in prosa | Per commento | Molte persone insieme | Il filo di commenti, finché non viene risolto |

La lettura pratica: le modifiche traccianti sono migliori nel negoziare un documento e peggiori nel mantenerlo. La documentazione si mantiene, motivo per cui il formato peggiore nella negoziazione continua a vincere per la documentazione, e motivo per cui i contratti continuano a vivere in Word non importa cosa ne pensi la squadra di ingegneria.

### La colpa, e perché una frase dice quello che dice

Questo è l'argomento che convince gli scettici, e non appare mai in un confronto di funzionalità perché Word non ha niente da metterci in quella colonna.

Un insieme di documentazione che vive da qualche anno contiene frasi che nessuno sa spiegare. “I token di accesso scadono dopo trenta giorni.” Perché trenta? Era una decisione, un compromesso con la squadra di sicurezza, o un errore di battitura su cui qualcuno ha già costruito una libreria client? In un repository, chiedi al file: incolpa la riga, ottieni il commit, leggi il messaggio del commit, seguilo fino alla pull request, leggi la discussione che c'è stata lì e il problema che l'ha provocata. Quella catena richiede circa novanta secondi e produce il motivo o dimostra che non ce n'è mai stato uno, il che è di per sé utile.

In un patrimonio di documenti Word la stessa domanda è irrisolvibile in pratica. La cronologia delle versioni della piattaforma di archiviazione dà istantanee per autore e timestamp — cronologia reale, e meglio di niente — ma l'unità è il documento, non la frase. Puoi scoprire che Priya ha salvato una nuova versione un martedì di marzo. Non puoi scoprire quale dei quaranta cambiamenti in quel salvataggio fosse i trenta giorni, o a cosa stesse rispondendo. Così la frase resta, perché nessuno può giustificare la rimozione di qualcosa che non sa spiegare, e la documentazione accumula affermazioni che non corrispondono più al sistema.

Vale la pena affermare la conseguenza con un costo attaccato: in Word, la provenienza di una frase deve vivere nella memoria di qualcuno o in un registro delle modifiche separato che una persona mantiene, ed entrambi lasciano l'organizzazione quando la persona se ne va.

### Chi può modificarlo, e la frase che chiude la conversazione

“Basta aprire una pull request contro la documentazione.” Detto a una collega delle vendite che ha notato che la pagina dei prezzi descrive un piano ritirato in primavera, quella frase chiude la conversazione. Non aprirà una pull request. Manderà un messaggio, o non farà niente, e la pagina resterà sbagliata per altri sei mesi.

Questo è un vincolo reale, non un problema di formazione, e trattarlo come un problema di formazione è il modo più comune con cui un programma docs-as-code fallisce. Il flusso di lavoro attorno a Markdown — un host, un fork o un branch, un messaggio di commit, una revisione, un merge, un deploy — sono cinque concetti che non hanno niente a che fare con lo scrivere una frase. La soglia di Word è genuinamente più bassa: apri il file, cambia le parole, salva. Chiunque abbia usato un computer supera quella soglia.

Ci sono tre risposte oneste, e quella sbagliata è insistere che la gente imparia.

- **Usa l'editor web dell'host del codice.** Modificare un file nel browser, con un'anteprima, lasciando che l'host crei il branch e la pull request dietro le quinte, trasforma cinque concetti in due: cambia le parole, scrivi una riga sul perché. Funziona, è quello che usano davvero la maggior parte degli assetti di successo, e richiede comunque un account e un giro di prova.
- **Metti sopra una superficie di modifica.** Un sistema di contenuti che scrive Markdown di nuovo nel repository dà agli editor non tecnici un'esperienza di modifica normale mantenendo la fonte nel controllo di versione. Sono più parti mobili da possedere, e qualcuno deve possederle.
- **Accetta la modifica come un messaggio, e mettine un costo.** Qualcuno tecnico fa il cambiamento. Va bene per correzioni occasionali ed è terribile come assetto permanente, perché la coda diventa un collo di bottiglia e il collo di bottiglia diventa obsolescenza.

Qualunque tu scelga, la decisione appartiene alla persona meno tecnica che deve cambiare una frase con breve preavviso — lo stesso principio che fa di un repository la casa giusta per la documentazione che mantengono gli ingegneri fa anche di esso la casa sbagliata per la documentazione che tocca solo la squadra finanziaria. [Cosa appartiene davvero al repository, e come si organizza la cartella](/blog/documentation-that-lives-in-the-repo) è la versione più lunga di quell'argomento.

## Cosa può esprimere Word e Markdown no

Markdown ha circa una dozzina di costrutti. Word ha un modello di pagina. Il divario tra i due non è una questione di funzionalità mancanti che un convertitore potrebbe aggiungere più avanti; è la differenza tra un formato che descrive la struttura e un formato che descrive un artefatto stampato.

Le cose che un `.docx` porta e che non hanno nessun equivalente in Markdown:

- Un modello con stili con nome, così che “Titolo 2” significhi un tipo di carattere, una dimensione, una spaziatura e un colore specifici in ogni documento dell'organizzazione.
- Intestazioni e piè di pagina, numeri di pagina, una copertina, interruzioni di sezione, margini e orientamento cambiati a metà, filigrane.
- Un campo di indice che si aggiorna da solo, didascalie che si numerano da sole, e riferimenti crociati che si ripuntano quando sposti una sezione.
- Interruzioni di pagina e "mantieni con il successivo", che vuol dire controllo su cosa finisce in cima a una pagina.
- Note a piè di pagina rese in fondo alla pagina a cui appartengono, invece che raccolte in fondo al documento.
- Caselle di testo, forme fluttuanti, tabelle con celle unite, e qualunque cosa posizionata rispetto alla pagina piuttosto che al flusso del testo.
- Lo stesso livello di revisione: inserimenti e cancellazioni in sospeso, e fili di commenti ancorati a intervalli di caratteri.

L'inventario completo — voce per voce, con un verdetto su quali perdite contano davvero e quali sono abitudini da abbandonare — è in [cosa non conservare da un .docx](/blog/what-not-to-keep-from-a-docx), e non ha senso ripeterlo qui. Quello che conta per questa decisione è che nessuna di quelle assenze è una lacuna a meno che il lavoro del documento non ne abbia bisogno. Un runbook non ha bisogno di una copertina. Un manuale del personale che viene stampato e consegnato ai nuovi assunti sì. Un contratto di servizio con un riquadro firma che deve stare sopra un piè di pagina fisso ha bisogno del modello di pagina, in modo permanente e non negoziabile.

L'elenco inverso è più corto e viene lasciato fuori da questi confronti quasi sempre, quindi eccolo. Markdown esprime diverse cose che un documento Word gestisce male:

- **Il codice, in sicurezza.** Un blocco delimitato e taggato con un linguaggio sopravvive a copia e incolla, e non viene autocorretto. Word sostituisce mentre digiti, e una delle opzioni documentate si chiama `"Straight quotes" with "smart quotes"` (verificato su support.microsoft.com, 9 settembre 2026); lo stesso meccanismo trasforma i trattini digitati in lineette. Ciascuna sostituzione dentro un esempio di comando significa che il lettore che lo copia ottiene un errore. Questo è un difetto di correttezza, non una preferenza di formattazione.
- **Link che una macchina può controllare.** I link di testo si possono validare in una build, quindi un insieme di documentazione può fallire i propri controlli quando un link muore. Controllare le relazioni dei link dentro duecento archivi è un progetto a sé.
- **Diagrammi come testo.** Un diagramma scritto come testo delimitato vive nel diff, viene revisionato come prosa, e non richiede a nessuno di trovare il file di disegno originale. Un gruppo di forme incollato in Word è un'immagine senza fonte.
- **Front matter.** Un'intestazione leggibile da una macchina che porta un proprietario, una data di revisione e uno stato, che una build può leggere e su cui agire. Word ha le proprietà del documento, e nessuno le compila.

## Alla scala: ricerca, scripting, pubblicazione, longevità, accessibilità

Tutto quanto sopra riguarda un documento solo. Le dimensioni sotto compaiono solo quando ce ne sono duecento, che è esattamente il momento in cui una decisione di formato diventa costosa da ribaltare.

### Ricerca, e cosa significa “cercare” in ciascun caso

La ricerca testuale su una cartella di file Markdown è esatta, veloce e disponibile a chiunque: un'espressione regolare, una frase sensibile alle maiuscole, una ricerca limitata ai titoli, una ricerca che elenca file e numero di riga. Gira su un portatile senza indice e senza servizio, e gira in una build, il che significa che un insieme di documentazione può rispondere a domande su se stesso. Trova ogni pagina che menziona un endpoint deprecato, e ottieni un elenco di righe su cui agire.

La ricerca su un patrimonio Word è ricerca su un indice mantenuto da qualunque cosa conservi i file. Nel migliore dei casi trova documenti, non righe, e li classifica per pertinenza piuttosto che elencarli in modo esaustivo — il design giusto per trovare un documento e quello sbagliato per verificare un'affermazione. Non trova niente dentro uno screenshot, e non ti dirà che la frase compare in un piè di pagina a pagina undici di sei file.

### Modificare via script duecento file

Un prodotto viene rinominato. Un indirizzo di supporto cambia. Un URL si sposta da un dominio a un altro. In Markdown è un comando solo, un diff che leggi prima di fare il commit, e una revisione di qualcuno che controlla i casi limite — quelli dentro gli esempi di codice, quelli dentro il testo dei link, la forma possessiva. L'intero cambiamento è un'unica unità revisionabile ed è successo ovunque, oppure si vede nel diff che non è successo.

In un patrimonio Word lo stesso cambiamento ha tre opzioni: apri ogni file, scripta contro l'XML, o scrivi una macro. Tutte e tre funzionano. Quello che succede davvero è che qualcuno fa i venti file importanti, intende finire, e non finisce — e la metà non fatta è invisibile, perché non c'è nessun diff da guardare e nessun controllo che fallisce. Sei mesi dopo il vecchio nome del prodotto è ancora in quattro proposte spedite ai clienti. Il costo di non poter modificare via script non è il lavoro; è che i cambiamenti parziali non lasciano traccia.

### Pubblicazione su una pagina web

Da Markdown, pubblicare è il caso ordinario: una conversione verso una pagina HTML completa, o un generatore se c'è un insieme di pagine che si collegano tra loro. L'output è markup semantico che eredita il suo stile da un modello, il che significa che l'intero insieme appare coerente perché lo stile non è mai stato dentro i documenti.

Da Word, pubblicare è una deviazione. L'output nativo “salva come pagina web” dell'applicazione porta una grande quantità di markup che esiste per riprodurre il rendering di Word piuttosto che per descrivere il documento, e il risultato è difficile da restilizzare e sgradevole da mantenere. La strada che funziona è quella indiretta: converti il `.docx` in Markdown, rivedi cosa la conversione ha conservato, poi pubblica dal Markdown. Se pubblichi regolarmente da Word, quella deviazione è l'argomento per cambiare quale formato sia la fonte.

### Longevità e dipendenza dal fornitore

L'affermazione sulla longevità di Markdown è la più forte che abbia. Il file è testo; si legge correttamente in qualunque editor, su qualunque sistema operativo, senza nessun software che debba ancora esistere. In vent'anni i titoli saranno ancora visibilmente titoli.

La posizione di Word è migliore della sua reputazione. Il formato è aperto e standardizzato — ECMA-376, equivalente a ISO/IEC 29500 (verificato su ecma-international.org, 9 settembre 2026) — altre applicazioni lo leggono e lo scrivono, e i file di un decennio fa si aprono ancora oggi. Non è dipendenza dal fornitore in senso legale o tecnico. La dipendenza è comportamentale, ed è reale: il modello aziendale, le macro che qualcuno ha scritto, le abitudini di revisione, il fatto che ogni documento presupponga un'applicazione con un modello di pagina. È quello che rende costoso lasciare un patrimonio Word, non il formato del file.

Quindi la classifica per un documento che vuoi leggibile in vent'anni è: Markdown primo, `.docx` secondo, e qualunque documento cloud proprietario che esiste solo dentro l'editor di un fornitore, lontano terzo. Se la longevità è un requisito dichiarato, tieni una fonte Markdown e un PDF esportato, e tratta il file Word modificabile come quello sacrificabile.

### Accessibilità

Word è più capace di quanto la maggior parte degli ingegneri creda. Gli stili dei titoli producono uno schema di documento reale che un lettore di schermo naviga, le immagini hanno un campo di testo alternativo, le tabelle possono avere una riga di intestazione designata, e l'applicazione include un controllo di accessibilità le cui regole pubblicate comprendono il testo alternativo su tutto il contenuto non testuale e un contrasto sufficiente tra testo e sfondo (verificato su support.microsoft.com, 9 settembre 2026). Il problema è che tutto ciò è per documento e dipende dal fatto che chi scrive usi gli stili invece di rendere il testo grande e in grassetto — che è esattamente l'abitudine che rompe anche la conversione.

Markdown è semantico per costruzione. Un titolo è un titolo senza modo di falsificarlo, il testo alternativo fa parte della sintassi dell'immagine, e le liste sono liste. Quello che Markdown non può esprimere è il resto della superficie di accessibilità: un attributo di lingua, l'ambito di una cella di tabella, una didascalia legata a una tabella, ARIA dove serve. Queste arrivano dal modello o dal tema che rende il Markdown, ed è il punto strutturale importante — verifichi un insieme di documentazione Markdown una volta, nel suo tema, e ogni pagina eredita il risultato. Verifichi un patrimonio Word un documento alla volta, per sempre.

## Dove Markdown perde, e quanto costa

Markdown vince su quasi ogni asse a cui una squadra tecnica tiene, e perde completamente ogni volta che il lavoro del documento è essere stampato, firmato, o revisionato da qualcuno che lavora in Word. Vale la pena dirlo chiaramente piuttosto che discuterci attorno, perché i fallimenti sono prevedibili e ciascuno ha un costo a cui puoi attaccare un numero.

**Quando l'artefatto è una pagina stampata.** Qualunque cosa consegnata a una persona su carta ha un layout, e un layout significa pagine, margini, intestazioni e controllo su cosa cade dove. Markdown non può esprimere niente di tutto ciò; una conversione in PDF ti dà quello che decide il modello. Costo: o accetti l'impaginazione del modello, o spendi il tempo per costruire un modello che faccia quello che vuoi, che è un progetto reale con un proprietario.

**Quando qualcosa deve essere firmato.** Un contratto di servizio, un contratto, un riconoscimento di policy. I flussi di firma si aspettano un documento impaginato con posizioni fisse, e l'artefatto firmato è il documento ufficiale. Costo: nullo se converti alla fine, notevole se hai provato a fare di Markdown la cosa firmata.

**Quando il revisore lavora in Word e non si muove.** Un avvocato, un'autorità di regolamentazione, un team acquisti di un cliente. Restituiranno un file con modifiche traccianti, e riportare quelle modifiche in una fonte Markdown è lavoro manuale che nessun convertitore fa bene. Costo: un pomeriggio di una persona per giro di revisione, e il rischio che una modifica venga persa.

**Quando il documento è progettato.** Una proposta, una brochure, un report con il marchio di un cliente sopra. Costo: ore di soluzioni improvvisate, e alla fine l'ammissione che il documento è sempre stato un artefatto di design.

**Quando i revisori non tecnici devono commentare.** Non modificare — commentare. I fili di commenti ancorati di Word sono lo strumento giusto e non c'è un equivalente Markdown che un revisore non tecnico userà. Costo: i commenti arrivano via email invece, non ancorati, e si perdono.

**Quando ci sono moduli e campi da compilare.** Niente in Markdown lo fa. Costo: lo strumento sbagliato del tutto.

**Quando nessuno possiede la pipeline.** Docs as code ha bisogno di un repository, un'abitudine di revisione, una build e qualcuno che mantenga tutti e tre. A una piccola squadra senza ingegneri non si dovrebbe chiedere di gestirne una. Costo: la pipeline si rompe, nessuno la ripara, e la documentazione torna sull'unità condivisa con un passaggio in più di risentimento attaccato.

**Quando il dialetto si sposta.** Markdown è una famiglia di dialetti. Una tabella si rende sull'host del codice e arriva come caratteri di barra nella build, le note a piè di pagina funzionano in un parser e non nel successivo. Costo: bug che compaiono solo nell'output pubblicato.

**Quando le tabelle sono complicate.** Celle unite, tabelle annidate, una cella che contiene una lista. Le tabelle Markdown sono griglie semplici. Costo: o la tabella viene semplificata, che spesso è un miglioramento, oppure diventa HTML grezzo in mezzo alla tua prosa.

## L'ibrido in cui finisce la maggior parte delle organizzazioni, e come evitare che marcisca

Quasi nessuno usa un formato solo. Lo stato finale è un ibrido, e l'ibrido va bene — quello che marcisce è la versione in cui due formati vengono entrambi trattati come originali. È l'assetto in cui qualcuno corregge un errore di battitura nella copia Word un martedì, la fonte Markdown viene rigenerata mercoledì, e la correzione di martedì scompare senza che nessuno se ne accorga per un anno.

Una regola lo previene: **un formato è la fonte, l'altro è un export, e l'export non viene mai modificato.** Tutto il resto è implementazione.

| Documento | Fonte | Export | Chi modifica la fonte |
| --- | --- | --- | --- |
| Riferimento API, runbook, note architetturali | Markdown nel repository | Pagina HTML, o un PDF per un audit | Ingegneri, in pull request |
| Manuale del personale, policy | Markdown nel repository | Un `.docx` o PDF per la stampa e il riconoscimento | Le risorse umane, tramite l'editor web dell'host |
| Contratti, contratti di servizio | Word | PDF per la firma; Markdown solo se deve essere pubblicato | Legale, con modifiche traccianti |
| Proposte e report progettati | Word, dal modello aziendale | PDF | Chi possiede la trattativa |
| Note di riunione, verbali di decisione | Markdown | Nessuno | Chiunque |
| Depositi regolatori e qualunque cosa con un layout imposto | Word | PDF | Chi possiede il deposito |

Tre pratiche mantengono onesto l'assetto, e tutte e tre sono economiche:

1. **Timbra ogni export.** Un file generato lo dice, sulla prima pagina: generato da questa fonte, in questa data, da questo commit. Chi apre l'export e vuole cambiare una parola sa allora dove andare. Senza il timbro, l'export è indistinguibile da un originale e verrà modificato come tale.
2. **Rigenera invece di riparare.** Quando un export è sbagliato, la correzione va nella fonte e l'export viene ricostruito. Se una correzione finisce mai direttamente nell'export, ora hai due fonti e l'orologio è partito.
3. **Nomina un proprietario per tipo di documento, non per documento.** “Tutte le policy sono Markdown, le risorse umane le possiedono” è una regola che la gente può seguire. “Questo è Word perché Priya lo preferisce” è come si torna a tre risposte su dove viva la documentazione.

### Migrare un patrimonio Word verso Markdown

Non iniziare convertendo. Inizia elencando cosa hai e decidendo, per ogni documento, se dovrebbe esistere affatto — un progetto di conversione che inizia con una conversione in blocco produce duecento file Markdown di cui sessanta sono obsoleti e quaranta non erano mai stati documenti, e nessuno li smisterà mai dopo.

Poi converti quelli che sopravvivono, in piccoli lotti, e leggi ogni risultato contro l'originale. I titoli fatti grandi e in grassetto piuttosto che stilizzati arrivano come paragrafi; le liste numerate arrivano come testo semplice quando le definizioni di numerazione non si risolvono; le immagini finiscono come file separati o svaniscono; le didascalie diventano frasi ordinarie che non appartengono più a niente. Le strade di conversione e la lista di controllo per individuare esattamente questi fallimenti sono in [come convertire un .docx in Markdown](/blog/convert-docx-to-markdown), e per un documento singolo senza niente da installare, [la conversione da Word a Markdown di TransformPipe](/word-to-markdown) gira nel browser — da disconnessi, il file non viene caricato da nessuna parte, il che conta quando il documento è una bozza di policy piuttosto che un README pubblico.

Due regole per la migrazione stessa. Lascia in pace i documenti progettati: una brochure convertita in Markdown è una brochure distrutta, e la risposta corretta per essa è tenere il file Word e smettere di far finta che sia documentazione. E tieni i `.docx` originali da qualche parte in sola lettura finché la migrazione non è vecchia abbastanza che nessuno chiede più cosa la conversione abbia scartato.

### Andare nell'altra direzione, per un giro di revisione

La direzione opposta è una routine, non una migrazione. Un revisore ha bisogno di un file Word; la fonte resta in Markdown. Convertilo in `.docx` con un documento di riferimento così che l'output arrivi nel modello aziendale, mandalo, e riporta a mano le modifiche traccianti ricevute nel Markdown. Quest'ultimo passaggio è manuale e non si automatizza: il livello di revisione vive in parti dell'archivio che i convertitori o scartano o appiattiscono in testo ordinario, quindi quello che ottieni indietro è o il documento con tutte le modifiche accettate o un pasticcio. [Ottenere un .docx che qualcuno può davvero modificare](/blog/markdown-to-word) tratta la meccanica dei modelli.

Preventiva la rilettura manuale, e sono un paio d'ore per giro. Se assumi che convertirà in modo impeccabile in entrambe le direzioni, prima o poi pubblicherai una versione con dentro ancora la formulazione rifiutata di un revisore.

## Come decidere

Sei criteri, ciascuno con la conseguenza attaccata, nell'ordine che risolve prima i casi più numerosi.

1. **Nomina l'artefatto che il documento deve diventare.** Una pagina web, una pagina in un repository, un libretto stampato, un PDF firmato, un deposito. Se viene stampato o firmato, la fonte è Word e la discussione è chiusa; se è una pagina web o un file che le persone leggono come testo, la fonte è Markdown e vale lo stesso.
2. **Nomina la persona meno tecnica che deve cambiare una frase con breve preavviso.** Se quella persona è nelle vendite, nelle risorse umane o nel legale, o il formato è Word, o le devi una superficie di modifica che userà davvero — e se non fornisci nessuna delle due, il documento diventa obsoleto tra una richiesta e l'altra e la decisione di formato è stata presa per default.
3. **Conta quanto spesso cambia, e da quante persone.** Sotto una manciata di modifiche l'anno da parte di un solo proprietario, Word non costa niente. Modifiche settimanali da parte di una dozzina di persone hanno bisogno di merge, e Word non ha nessuna operazione di merge, quindi il costo cade su chi consolida le copie.
4. **Chiediti se dovrai mai cambiare una frase ovunque.** Se la risposta è sì — nomi di prodotto, endpoint, indirizzi, formulazioni legali — Markdown è l'unico dei due in cui il cambiamento è un'unità revisionabile piuttosto che un atto di diligenza di cui devi fidarti.
5. **Chiediti se qualcuno avrà bisogno di sapere perché una frase dice quello che dice.** Per i controlli di sicurezza, gli impegni di servizio e qualunque cosa legga un revisore esterno, la provenienza è parte del lavoro del documento, e solo il controllo di versione la registra al livello della frase.
6. **Decidi chi possiede la pipeline prima di costruirla.** Un repository, un'abitudine di revisione e una build hanno bisogno di un proprietario nominato; se non riesci a nominarne uno, scegli il formato che non ha bisogno di nessuna pipeline e rivisitalo quando potrai.

## Conclusione

La documentazione dovrebbe vivere nel formato che corrisponde a quello che deve fare, e per la maggior parte della documentazione che mantiene un'organizzazione tecnica quel formato è Markdown nel controllo di versione — perché le cose che mantengono vera la documentazione sono la revisione, la cronologia, la ricerca e la capacità di cambiare una frase ovunque in una volta, e quelle sono le quattro cose in cui il testo in un repository è più bravo. Word resta la risposta giusta, in modo permanente e senza scuse, per i documenti il cui lavoro è essere impaginati, stampati, firmati, o negoziati clausola per clausola con qualcuno il cui strumento sono le modifiche traccianti. Fai girare entrambi, decidi per tipo di documento quale sia la fonte, genera l'altro, e timbra il file generato così che nessuno lo modifichi per errore — allora il solo lavoro che resta è la conversione al confine, che è un lavoro di un passaggio in entrambe le direzioni e la sola parte di tutto ciò che uno strumento può risolvere per te.

## Domande frequenti

### Markdown è meglio di Word per la documentazione?

Per la documentazione che cambia spesso, viene mantenuta da più persone e finisce su una pagina web, sì — per la revisione, la cronologia, la ricerca e la modifica in blocco, non per niente legato alla sintassi. Per un documento che deve essere stampato su un modello, firmato, o revisionato clausola per clausola, Word è migliore e la differenza non è vicina.

### I colleghi non tecnici possono davvero scrivere documentazione in Markdown?

La sintassi non è l'ostacolo; la maggior parte delle persone impara cancelletti e trattini in dieci minuti. L'ostacolo è il flusso di lavoro attorno a essa — branch, commit, revisioni — quindi dai loro l'editor web dell'host del codice con un'anteprima, oppure un sistema di contenuti che scrive Markdown di nuovo nel repository. Chiedere loro di usare un terminale è come un programma docs-as-code fallisce in silenzio.

### Cosa succede alle modifiche traccianti e ai commenti quando converto un documento Word in Markdown?

Sono la prima cosa persa. Gli inserimenti e le cancellazioni in sospeso vengono accettati in silenzio o scartati, e i fili di commenti non hanno nessun equivalente Markdown, quindi di solito scompaiono senza nessun avviso. Risolvi il livello di revisione in Word prima di convertire, e riporta a mano quello che devi conservare.

### Come stampo un documento Markdown o ne ottengo un PDF?

Convertilo in HTML e stampa quello dal browser, che usa gli stili propri della pagina, oppure converti in `.docx` con un modello aziendale e stampa da lì. In entrambi i casi l'impaginazione la decide il modello piuttosto che il documento, quindi se il layout di pagina conta, il modello è la cosa che devi costruire.

### Dovremmo tenere il .docx originale dopo averlo convertito?

Tienilo in sola lettura finché il Markdown non è stato letto, revisionato e usato per un po'. Le conversioni scartano cose in silenzio — didascalie, numerazione, contenuto fluttuante — e l'originale è il solo modo per scoprire cosa è andato perso, domanda che qualcuno fa sempre circa tre mesi dopo.

### Word blocca la nostra documentazione dentro di sé?

Non al livello del formato: `.docx` è Office Open XML, uno standard documentato pubblicato come ECMA-376 e come ISO/IEC 29500, che diverse applicazioni leggono e scrivono. La dipendenza è comportamentale — il modello, le macro, le abitudini di revisione, e il presupposto che ogni documento abbia pagine — ed è quello che rende costoso spostare un patrimonio di documenti Word, non i file in sé.

### Quale formato è migliore per l'accessibilità?

Word può esprimere di più, incluso un attributo di lingua, righe di intestazione delle tabelle e un controllo di accessibilità, ma ogni documento deve essere redatto correttamente e verificato singolarmente. Markdown è semantico per costruzione ed eredita il resto dal suo modello, quindi verifichi il tema una volta e ogni pagina ne beneficia — di solito la strada più economica per un insieme di documenti tutti accessibili piuttosto che solo alcuni.
