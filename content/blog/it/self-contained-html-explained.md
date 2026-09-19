---
title: "HTML autosufficiente: cos'è davvero un documento HTML in un unico file"
description: Cosa contiene un HTML in un unico file, quanto costano in byte stili e immagini incorporati, come verificare che non scarichi nulla, e quando è sbagliato usarlo
date: 2026-08-14
tag: Pubblicazione
keywords: html autosufficiente, html in un unico file, css inline nel file html, immagini data uri, documento html offline, allegato html per email, archiviare una pagina web
---

Un collega ti manda un file HTML. Lo apri in treno, o su un portatile che non è in rete dal venerdì, e succede una di due cose. O ottieni il documento — titoli, tabelle, immagini, tutto — oppure ottieni un Times New Roman nero a tutta larghezza della finestra, con tre icone di immagine rotta dove dovevano stare i diagrammi. Entrambi i file sono HTML valido. Solo uno dei due è un documento.

La differenza è se il file ha bisogno di qualcos'altro per essere se stesso. Una pagina sul web è normalmente un indice: nomina un foglio di stile, alcuni font, una manciata di immagini, e il browser va a prenderli uno per uno. Funziona alla perfezione quando la pagina vive a un indirizzo e il lettore ha una connessione. Fallisce del tutto quando la pagina è un allegato in una casella di posta, un file dentro un archivio, o un documento che qualcuno aprirà da una cartella fra quattro anni.

### In breve

Un documento HTML in un unico file è un singolo file `.html` che si visualizza correttamente con la rete staccata, perché tutto ciò di cui ha bisogno è già dentro: il foglio di stile è un blocco `<style>` inline invece di un `<link>`, le immagini sono data URI invece di percorsi, e nessun font, script o tracker viene scaricato da nessuna parte. Si verifica staccando la rete, aprendo il file, e guardando che il pannello di rete non registri nulla — una richiesta per il file stesso quando è servito, e zero dopo. È il formato giusto per archiviare, per spedire per email, e per consegnare un documento a qualcuno fuori dalla tua organizzazione, perché sopravvive al viaggio e non racconta a nessuno dove è stato. I costi sono reali e vale la pena dirli: il file è circa un terzo più grande delle sue immagini, niente al suo interno si può metter in cache, e non puoi correggere un errore di battitura senza rispedire tutto da capo.

## Cosa significa esattamente "HTML in un unico file"

La frase viene usata con leggerezza, quindi vale la pena definirla con precisione. Un documento HTML in un unico file fa una sola promessa: aperto da un disco locale, senza rete di alcun tipo, si visualizza come l'autore intendeva. Quella promessa ha tre conseguenze, e sono l'intera definizione.

Ogni regola di stile è nel documento. Non c'è nessun `<link rel="stylesheet">` che punta a un `styles.css` nella cartella accanto, e nessuno che punta a un CDN. Le regole stanno in un elemento `<style>` nell'head, oppure come attributi `style=` sugli elementi, o entrambe le cose.

Ogni immagine è nel documento. Non `src="diagram.png"`, che è un percorso che si risolve rispetto a dove il lettore ha messo il file, e non `src="https://…/diagram.png"`, che è una richiesta. I byte stessi sono codificati nell'attributo `src` come data URI, oppure l'immagine è SVG inline, che è markup e non una richiesta.

Non viene richiesto nient'altro. Nessun web font, nessun beacon di analytics, nessun set di icone, nessun jQuery preso da un CDN "solo per l'indice". Questa è la clausola che si rompe per errore, ed è quella che conta di più, perché basta un solo tag link per trasformare un documento autosufficiente in una pagina che silenziosamente segnala ogni volta che viene aperta.

Quello che un documento HTML in un unico file *non* promette è che i suoi link funzionino. `<a href="https://example.com/spec">` resta un indirizzo su internet, e va bene così — un documento che elimina le proprie citazioni è peggio, non meglio. L'autosufficienza è una dichiarazione sulla presentazione, non sul mondo esterno a cui il testo si riferisce.

## Confronto rapido: il bigliettino

| Formato | Cos'è | Serve la rete | Il lettore può modificarlo | Costo principale |
| --- | --- | --- | --- | --- |
| HTML in un unico file | Un file `.html`, stili inline, immagini come data URI | No | Solo modificando il markup | File più grande, niente in cache |
| HTML più una cartella di risorse | Un file `.html` accanto a `styles.css` e a una cartella `images/` | No, se la cartella viaggia insieme | Solo modificando il markup | Si rompe appena un file viene spostato o spedito da solo |
| HTML che collega un CDN | Un file `.html` che scarica font e CSS al momento dell'apertura | Sì | Solo modificando il markup | Si visualizza male offline; segnala ogni apertura |
| MHTML (`.mhtml`) | Una pagina e le sue risorse in un unico contenitore MIME | No | No | Chrome ed Edge lo scrivono; Firefox non lo apre senza un'estensione |
| Web archive di Safari (`.webarchive`) | L'equivalente di Apple | No | No | Praticamente solo su Safari |
| PDF | Un layout di pagina fisso con i font incorporati | No | No, senza un editor di PDF | Si adatta male a un telefono; l'estrazione del testo varia |
| Word (`.docx`) | Uno zip di XML, con gli stili inclusi | No | Sì, completamente | Si visualizza diversamente tra versioni e visualizzatori di Word |
| Sorgente Markdown (`.md`) | Testo semplice con la punteggiatura | No | Sì, in qualunque editor | La maggior parte dei lettori vede il sorgente, non un documento |
| Link ospitato | Una pagina servita da un indirizzo | Sì, sempre | No | Serve un hosting, e l'indirizzo può decadere o essere revocato |
| Screenshot (`.png`) | Una foto del documento | No | No | Nessun testo selezionabile, nessun link, nessuna ricerca |

Le due righe da confrontare con attenzione sono la prima e la seconda, perché sembrano equivalenti e non lo sono. Un file HTML con un `styles.css` accanto si visualizza perfettamente da `file://` — il CSS si carica da un disco locale senza problemi. Si visualizza perfettamente fino al momento in cui qualcuno tira fuori l'`.html` dalla cartella e lo allega a un'email, che è esattamente ciò che farà un lettore che non ha mai pensato alle risorse collegate. L'autosufficienza non è principalmente una proprietà tecnica. È una proprietà che sopravvive a essere maneggiata da persone.

## Gli stili inline, e i font che silenziosamente non lo sono

### Perché il foglio di stile collegato deve andarsene

Un `<link rel="stylesheet" href="…">` è una seconda richiesta, e ogni richiesta in più è un modo per il documento di arrivare incompleto. In locale, il foglio di stile deve stare nella posizione relativa giusta. In remoto, l'host deve esistere ancora, servire ancora quel percorso, ed essere ancora raggiungibile dalla rete del lettore — cosa che, dentro una banca o un ospedale, molto spesso non è.

Portare tutto inline è la soluzione, e non è una sottigliezza: prendi il CSS che sarebbe stato nel file accanto e mettilo in un blocco `<style>` nell'head. La tipografia di un documento, i bordi delle tabelle, gli sfondi dei blocchi di codice e le regole di stampa sono qualche kilobyte di testo, che si comprime bene e non costa niente di misurabile.

C'è un beneficio di secondo ordine che la gente nota solo dopo essersi già scottata. Un foglio di stile inline non può essere cambiato sotto al documento. Se il tuo CSS aziendale è versionato a un URL e qualcuno riscrive la scala dei titoli il trimestre prossimo, ogni vecchio documento che lo collegava si ridisegna con la nuova scala — incluso quello allegato a un contratto. Un documento con gli stili al suo interno si visualizza a dicembre esattamente come si visualizzava ad agosto, perché le regole e il testo sono lo stesso manufatto.

### L'attributo `style=` non è la stessa cosa

Due tecniche vengono chiamate entrambe "stili inline" e si comportano diversamente. Un elemento `<style>` nell'head contiene CSS vero: selettori, media query, `@media print`, pseudo-classi, tutto. Un attributo `style=` su un elemento contiene solo dichiarazioni — nessun selettore, nessuna media query, nessun `:hover`, e nessun modo di dire "ogni cella di tabella in questo documento".

Per un documento che stai archiviando o spedendo per email, il blocco `<style>` è quello che vuoi. Gli stili sugli attributi contano in esattamente un contesto, che è l'email HTML: i client di posta hanno storicamente eliminato i blocchi `<style>`, e lo scambio in quel caso è spingere le dichiarazioni sugli elementi. È un motivo per tenere separati i due casi nella tua testa. Un *allegato* HTML in un unico file e un *corpo* di email HTML sono due prodotti diversi con vincoli diversi, e uno strumento che produce l'uno non sta necessariamente producendo l'altro.

### I font: la promessa che un solo tag link rompe

Ecco la clausola che si rompe più spesso, di solito con buone intenzioni.

Metti inline il CSS con cura. Incorpori ogni immagine. Poi, perché il documento dovrebbe somigliare al resto del tuo materiale, aggiungi una riga:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
```

Il file non è più autosufficiente. Aprilo con la rete spenta e i caratteri tornano a quello che dice il resto della pila, il che cambia la lunghezza delle righe, le interruzioni di pagina e forse la larghezza delle tabelle. Aprilo con la rete accesa, e il documento fa una richiesta a terzi nel momento stesso della lettura — dall'indirizzo IP del lettore, sulla sua rete aziendale, con il suo user agent, ogni singola volta che il file viene aperto. Per un appunto interno è solo trascurato. Per un documento che hai consegnato a un cliente, un ente regolatore o la controparte legale, è un fatto sul tuo file che non intendevi creare.

Ci sono tre uscite oneste, e la prima di solito è quella giusta.

**Usa una pila di font di sistema.** `font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` si visualizza in un carattere che il lettore ha già, il che significa che si visualizza all'istante, offline, su ogni piattaforma, a costo zero. Il documento non somiglia al tuo marchio. Somiglia a un documento, che per un memo, una specifica o una serie di note di rilascio è il risultato giusto.

**Incorpora il font come data URI in una regola `@font-face`.** Funziona ed è costoso. Un singolo peso di un WOFF2 solo-latino sono tipicamente decine di kilobyte prima della codifica; una famiglia con regolare, grassetto ed entrambi i corsivi sono quattro font, e il base64 aggiunge un altro terzo su ognuno. Stai scambiando un pezzo fisso e consistente di file per una tipografia di marca in un documento che nessuno giudicherà per la sua tipografia. Controlla anche la licenza prima di farlo: molte licenze commerciali di font permettono di servirli via web da un dominio che controlli e non dicono niente di utile sulla ridistribuzione del binario dentro un file che spedisci per email a uno sconosciuto.

**Spedisci il file del font accanto all'HTML.** Questo è lo schema della cartella di risorse con un nome più elegante, e fallisce nello stesso punto: la prima volta che qualcuno rispedisce l'`.html` da solo.

## Le immagini come data URI, e cosa costa in byte

Un data URI mette i byte dove sarebbe andato il percorso. La sintassi è uno schema, un tipo di media, una codifica e il payload:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..." alt="Deployment topology">
```

Base64 codifica tre byte in ingresso come quattro caratteri in uscita. Questo è un **aumento del 33%** prima ancora di contare il preambolo `data:image/png;base64,`, e non è recuperabile in nessun modo. Un PNG da 1,5 MB diventa circa 2 MB di testo seduto in mezzo al tuo markup. Sei screenshot di quella dimensione, e il documento è un file di testo da 12 MB.

La compressione recupera meno di quanto si spera. Gzip e Brotli fanno un lavoro discreto sul base64 di dati già compressi — ma solo discreto, perché un PNG o un JPEG è già denso di entropia; quello che viene compresso è la codifica, non l'immagine. E la compressione si applica solo su HTTP. Un file su un disco, o allegato a un'email, resta alla dimensione piena non compressa, ed è quella dimensione che incontra i limiti.

Vale la pena nominare quei limiti, perché è lì che lo scambio smette di essere teorico:

| Dove finisce il file | Cosa morde per primo |
| --- | --- |
| Allegato email | Il tetto più stretto della catena, che non è il tuo |
| Gateway di posta aziendale | Scanner che mettono in quarantena o riscrivono allegati HTML grandi |
| Un convertitore o un'API | Un tetto sulla dimensione della richiesta — TransformPipe limita una conversione a 10 MB, e un documento tenuto in un account a 4 MB, perché una Function di Vercel rifiuta una richiesta o una risposta oltre 4,5 MB |
| Un browser su telefono | Memoria, e il tempo passato a decodificare diversi megabyte di base64 prima del primo rendering |
| Una revisione del codice | Nulla, e questo è il problema: il diff è illeggibile |

Due tecniche rendono il costo gestibile.

**Ridimensiona prima di codificare.** La maggior parte degli screenshot incorporati sono due o tre volte più grandi della larghezza a cui vengono mostrati. Dimezzare le dimensioni in pixel di uno screenshot ne riduce il file a circa un quarto, e il 33% di sovraccarico della codifica si applica poi a un numero molto più piccolo. Questo singolo passaggio fa più di qualunque discussione sul formato.

**Usa l'SVG come markup, non come base64.** Un diagramma, un logo, un grafico o un'icona disegnati come SVG possono essere incollati nel documento come elemento `<svg>`. Non c'è nessun sovraccarico di codifica, il risultato è testo che si comprime benissimo, e resta nitido a ogni zoom. Se un'immagine nel tuo documento è disegno al tratto, non dovrebbe quasi mai essere un PNG in base64.

Quello che i data URI non possono correggere è un'immagine puntata altrove. `<img src="diagram.png">` significa ancora `diagram.png` relativo alla cartella del lettore, e un convertitore che porta inline gli stili non necessariamente ha portato inline anche quello. L'insieme completo delle cose che si rompono quando un file si sposta è un argomento a sé — [i percorsi relativi, gli id di ancora e i link di riferimento si rompono ognuno in modo diverso](/blog/images-and-links-that-still-work) — e l'abitudine pratica è aprire il sorgente HTML e leggere ogni valore `src=` prima di spedire qualcosa.

## Come verificare che il file sia davvero autosufficiente

Non fidarti dell'affermazione, nemmeno della nostra. La verifica richiede circa un minuto ed è conclusiva.

**1. Stacca la macchina.** Spegni il Wi-Fi, stacca il cavo, metti il portatile in modalità aereo. Fallo per primo, perché è l'unico passaggio che non può essere ingannato da una cache calda. Un file che hai già aperto una volta può avere ogni font e foglio di stile seduto nella cache HTTP del browser, e si visualizzerà perfettamente pur dipendendo interamente dalla rete.

**2. Apri il file da `file://`.** Fai doppio clic, o trascinalo in una finestra del browser. Guarda il carattere, i bordi delle tabelle, gli sfondi dei blocchi di codice e ogni immagine. Un font di riserva è il solito indizio: se i titoli sembrano più stretti o più larghi di come li ricordi, qualcosa stava venendo scaricato.

**3. Apri gli strumenti per sviluppatori, vai al pannello di rete, e ricarica con quello aperto.** Questo è il vero test. Su un documento `file://` il risultato corretto è un elenco di richieste che contiene il documento e nient'altro — nessun CSS, nessun font, nessuna immagine, nessun beacon. Se compare una riga, cliccaci sopra e leggi l'URL: quella è la tua falla, nominata e localizzata.

**4. Cerca nel sorgente le quattro cose che scaricano qualcosa.** Apri il file in un editor di testo e cerca `<link`, `<script src`, `url(` e `src="http`. Ogni corrispondenza è o qualcosa che hai portato inline deliberatamente, o una dipendenza che non sapevi di avere. `url(` cattura i casi di font e immagine di sfondo che il pannello di rete perderà se la regola non ha mai trovato corrispondenza a schermo.

**5. Provalo in un secondo browser, su una seconda macchina, da una cartella diversa.** Copia il file su una chiavetta USB, inseriscila in una macchina che non lo ha mai visto, e aprilo lì. Questo cattura in un colpo i percorsi relativi, le risorse in cache e le differenze di font tra piattaforme. È anche, non per caso, una prova generale di quello che il tuo lettore sta per fare.

**6. Stampalo in PDF già che ci sei.** L'anteprima di stampa rivela se il documento ha regole di stampa, e se qualcosa viene tagliato al margine della pagina. Se un PDF è la consegna finale, [il dialogo di stampa del browser è una strada ragionevole per ottenerne uno](/blog/markdown-to-pdf) e un documento HTML in un unico file è l'input che vuole.

Una nota sugli script. Un file autosufficiente può legittimamente contenere JavaScript inline — un interruttore per l'indice, uno switch per la modalità scura — e lo script inline non è una dipendenza di rete. È però codice eseguibile dentro un documento che qualcuno aprirà con un doppio clic, che è un rischio diverso. Se la fonte del documento era Markdown arrivato da fuori la tua organizzazione, l'HTML grezzo nella fonte può portare `<script>`, `onerror=` e URL `javascript:` dritti nell'output, e [sanificare contro una lista fissa di elementi permessi è ciò che lo impedisce](/blog/sanitising-markdown-safely). Cerca `<script` in qualunque file che non hai prodotto tu prima di aprirlo.

## Quanto vale un file unico

Il formato si guadagna il suo posto in tre situazioni. Non sono la stessa situazione, e ognuna valorizza una proprietà diversa.

### Archiviazione

Un documento archiviato ha un solo requisito: deve visualizzarsi ancora quando tutto ciò che lo circonda è cambiato. Questo include il CDN che serviva i suoi font, il bucket S3 che teneva le sue immagini, l'azienda che ospitava entrambi, e la versione del browser che era corrente quando è stato scritto.

| Proprietà | Perché all'archiviazione importa |
| --- | --- |
| Nessuna richiesta esterna | Gli host a cui verrebbe chiesto qualcosa non risponderanno più tutti |
| Stili congelati nel file | Il documento non può essere ridisegnato dal CSS futuro di qualcun altro |
| Testo semplice su disco | Cercabile con grep, in linea di principio confrontabile riga per riga, e leggibile da strumenti che non esistono ancora |
| Un file, un oggetto | Niente da perdere; nessuna cartella da tenere insieme |

HTML è un buon formato d'archivio per un motivo che non ha niente a che fare con la moda: è testo, la sua specifica è pubblica, e i browser continuano a visualizzare documenti vecchi. Un documento HTML in un unico file è un oggetto di testo che descrive se stesso, che è la proprietà che dura più a lungo dei formati che richiedono un'applicazione specifica.

Non è un formato di *conservazione* nel senso istituzionale — è quello per cui esistono i contenitori WARC e i loro strumenti, e una biblioteca o un archivio nazionale useranno quelli. Per una squadra che tiene traccia dello stato di una decisione, di un runbook com'era durante un incidente, o di un rapporto com'era al momento dell'approvazione, un file unico è la versione pragmatica della stessa idea.

**Per chi è?** Per chiunque debba rispondere "cosa diceva questo, all'epoca?" e non possa contare su un link.

### Email

L'email è l'ambiente più duro che un documento incontra, perché niente al suo interno è sotto il tuo controllo. Il client del lettore, il gateway, la connessione e il dispositivo sono tutte decisioni di qualcun altro.

Un allegato HTML in un unico file si comporta bene in quell'ambiente per un motivo semplice: non c'è niente che possa andare perso. Aspettati che il lettore lo scarichi invece di vederlo in un riquadro di anteprima, e aspettati che alcuni sistemi di posta siano sospettosi degli allegati `.html` in generale — uno zip, o un link al file, è il solito rimedio quando un gateway obietta. Quello che eviti è il fallimento molto più comune di spedire un `.html` con la sua cartella `images/` lasciata indietro, che produce un documento pieno di icone di immagine rotta e un'email di seguito.

| Proprietà | Perché all'email importa |
| --- | --- |
| Un solo allegato | Niente cartella da zippare, niente da ricomporre per il lettore |
| Si visualizza offline | Il lettore potrebbe aprirlo su un aereo, su un treno, o su un portatile bloccato |
| Nessuna richiesta | Il documento non segnala quando, dove o quante volte è stato letto |
| Testo, non un contenitore | Si apre in un browser che il lettore ha già |

**Per chi è?** Per chiunque spedisca un documento finito a una persona specifica, in particolare fuori dai propri sistemi. Le alternative — e dove ognuna di esse fallisce — [vale la pena leggerle prima di scegliere](/blog/share-a-markdown-document-as-a-link).

### Consegnarlo a qualcuno fuori dalla tua azienda

Questo è il caso in cui l'autosufficienza smette di essere una comodità e diventa una questione di igiene. Quando un documento lascia la tua organizzazione, viene esaminato da persone e sistemi che non ti devono niente.

Un file che scarica qualcosa da un CDN è un file che fa richieste dall'interno della rete del destinatario. Il loro team di sicurezza potrebbe notarlo; il loro proxy potrebbe bloccarlo; il loro revisore potrebbe chiedere a cosa serviva quella richiesta. Un file che non scarica niente non solleva nessuna di queste domande, e può essere revisionato semplicemente leggendolo — che è esattamente ciò che farà un destinatario prudente.

C'è un rovescio della medaglia che vale la pena dire, perché riguarda te quando sei tu il lettore. Un documento HTML in un unico file che ricevi è più facile da revisionare di una pagina, ma non è automaticamente sicuro: lo script inline al suo interno viene eseguito quando lo apri, e `file://` è un contesto permissivo. Leggi il sorgente, o apri il file con JavaScript disattivato, se hai qualche motivo per essere cauto sul mittente.

| Proprietà | Perché a una consegna esterna importa |
| --- | --- |
| Nessuna richiesta a terzi | Niente che un proxy possa bloccare o una revisione di sicurezza possa contestare |
| Nessun tracciamento | Il documento non può dirti che è stato aperto, che è il punto |
| Verificabile | L'intero contenuto si può leggere in un editor di testo |
| Nessun account, nessuna installazione | Il destinatario lo apre nel browser che ha già |

**Per chi è?** Per chiunque spedisca un documento oltre il confine di un'azienda — proposte, specifiche, resoconti di incidenti, consegne, qualunque cosa un avvocato potrebbe un giorno tirare fuori.

## Dove un file unico è la risposta sbagliata, e cosa costa

Il formato ha svantaggi reali. Una pagina che elenca solo i benefici sta vendendo qualcosa.

**Il file è più grande, e l'aumento non è marginale.** Il base64 aggiunge un terzo a ogni immagine incorporata, e portare inline le risorse condivise significa che ogni documento porta con sé la propria copia. Dieci rapporti che incorporano ognuno lo stesso logo e i medesimi due diagrammi portano dieci copie di ciascuno. Se produci documenti in volume, il costo aggregato è reale e la deduplicazione che avresti ottenuto da risorse condivise è esattamente ciò a cui hai rinunciato.

**Niente al suo interno si può metter in cache.** Una pagina ospitata scarica il suo foglio di stile una volta e lo riusa su ogni pagina del sito; la seconda pagina è quasi gratis. Un file unico non ha una seconda pagina. Ogni documento paga i propri stili, i propri font e le proprie immagini, ogni volta che viene trasferito. È lo scambio giusto per un documento che viaggia da solo e quello sbagliato per un sito con la navigazione.

**Modificarlo significa rispedire tutto.** Un errore di battitura in una pagina ospitata è una correzione di una riga che ogni lettore vede alla visita successiva. Un errore di battitura in un allegato è un nuovo allegato, un'email di scuse, e due versioni del documento nella casella del destinatario senza nessuna indicazione di quale sia quella attuale. I file unici non hanno un percorso di aggiornamento; è intrinseco, non una funzione mancante.

**Non c'è nessuna analitica, per costruzione.** Se devi sapere se la proposta è stata letta, ti serve un link, e un link è l'opposto di un file autosufficiente. Non puoi avere entrambe le proprietà in un unico manufatto.

**I file molto grandi si comportano male.** Diversi megabyte di base64 devono essere decodificati prima che il browser possa disegnare le immagini, e su un telefono con memoria modesta questo è una pausa visibile o peggio. C'è una dimensione oltre la quale un file unico è un'esperienza scadente anche se è tecnicamente corretto, e i documenti pieni di screenshot la raggiungono in fretta.

**Non è un sito web.** Nessuna navigazione fra documenti, nessuna ricerca, nessun feed, nessun collegamento incrociato che si risolva. Un insieme di documenti che si riferiscono l'uno all'altro vuole un hosting, e far finta di no produce una cartella di file con link morti fra di loro.

**Alcuni visualizzatori non collaboreranno.** Gateway di posta che mettono in quarantena gli allegati HTML, sistemi di gestione documentale che non indicizzano l'HTML, strumenti di revisione che non visualizzano nulla — sono problemi di policy, non tecnici, e in alcune organizzazioni chiudono la discussione indipendentemente dai meriti. Quando succede, un PDF è il formato che l'istituzione accetta, e un documento HTML in un unico file è il miglior input possibile per produrne uno.

## Come scegliere

1. **Parti da dove il file verrà aperto, non da cosa è comodo produrre.** Un documento aperto da una casella di posta su un portatile disconnesso deve essere autosufficiente; una pagina aperta da un URL con una cache calda non dovrebbe esserlo, perché stai buttando via la cache per niente.
2. **Conta le richieste, non le funzioni.** Apri il pannello di rete sull'output e guarda il numero di righe. Qualunque numero sopra uno significa che il file ha dipendenze, e ogni dipendenza è un punto in cui il documento può arrivare incompleto.
3. **Ridimensiona le immagini prima di incorporarle, perché il 33% di sovraccarico della codifica moltiplica qualunque cosa gli dai in pasto.** Uno screenshot al doppio della sua larghezza di visualizzazione costa quattro volte i byte di cui ha bisogno, e quello sperpero è il singolo contributo più grande a un file unico rigonfio.
4. **Decidi sui web font una volta, per scritto.** O il documento usa una pila di font di sistema e resta onesto, o incorpora font di cui hai verificato la licenza; un font collegato è una decisione di fare una richiesta dalla macchina del lettore, e non dovrebbe succedere per caso.
5. **Se il documento cambierà, non spedire un file.** Gli allegati non hanno un percorso di aggiornamento, quindi qualunque cosa sia ancora in bozza vuole un link, e qualunque cosa sia definitiva vuole un file. Spedire un file per qualcosa non finito garantisce una seconda versione in circolazione.
6. **Provalo come lo aprirà il tuo lettore, su una macchina che non lo ha mai visto, offline.** Ogni fallimento descritto in questa pagina — il font di riserva, l'immagine rotta, il foglio di stile mancante, la richiesta a sorpresa — si manifesta in quell'unico test, e nessuno di essi si manifesta nell'anteprima dello strumento stesso.

## Conclusione

Un documento HTML in un unico file è un'idea piccola con un risultato specifico: si visualizza uguale ovunque perché non chiede niente, il che lo rende il formato giusto per gli archivi, gli allegati e qualunque cosa attraversi il confine di un'azienda. I costi sono altrettanto specifici — un terzo di byte in più su ogni immagine, nessuna cache, e nessun modo di correggere un errore senza rispedire tutto — quindi è il formato sbagliato per un sito, per una bozza, o per qualunque cosa su cui ti servano conferme di lettura. Se hai un file Markdown e una persona che aspetta un documento, [convertirlo nel browser](/) produce esattamente questo: un file HTML con gli stili inline, niente scaricato, e, da disconnessi, niente caricato da nessuna parte nel processo. Poi stacca la macchina e aprilo, perché un'affermazione di autosufficienza che non hai verificato è solo un'affermazione.

## FAQ

### Cos'è un documento HTML in un unico file?

È un singolo file `.html` che si visualizza correttamente senza connessione di rete, perché il suo foglio di stile è un blocco `<style>` inline, le sue immagini sono incorporate come data URI o SVG inline, e non scarica font, script o tracker da nessuna parte. Aperto da un disco locale non fa nessuna richiesta. I link nel testo puntano ancora a internet, ed è voluto — l'autosufficienza riguarda la presentazione, non le citazioni.

### Come verifico se un file HTML è davvero autosufficiente?

Stacca prima la macchina, così nessuna risorsa in cache può falsare il risultato, poi apri il file e ricaricalo con il pannello di rete degli strumenti per sviluppatori aperto. Il risultato corretto è un elenco di richieste con il documento e nient'altro. Cercare nel sorgente `<link`, `<script src`, `url(` e `src="http` cattura qualunque cosa il pannello di rete abbia perso perché la regola non ha mai trovato corrispondenza.

### Quanto più grande rende il file incorporare le immagini?

Il base64 codifica tre byte come quattro caratteri, quindi ogni immagine incorporata cresce di circa il 33% prima di contare il preambolo del tipo di media, e la compressione ne recupera solo una parte perché i dati fotografici e i PNG sono già densi. Ridimensionare uno screenshot alla larghezza a cui viene effettivamente mostrato di solito fa risparmiare molto più di qualunque scelta di codifica. Il disegno al tratto dovrebbe essere SVG inline, che non ha nessun sovraccarico di codifica.

### Posso usare un web font in un file autosufficiente?

Non da un CDN — quella è una richiesta di rete, che cambia il carattere quando il lettore è offline e segnala ogni apertura a terzi. Puoi incorporare un font come base64 dentro una regola `@font-face` se la licenza permette la ridistribuzione, al costo di decine di kilobyte per peso. Per la maggior parte dei documenti una pila di font di sistema è lo scambio migliore: istantaneo, gratuito, e disponibile su ogni piattaforma.

### L'HTML in un unico file è meglio di un PDF per spedire un documento?

Ottimizzano cose diverse. L'HTML si adatta allo schermo del lettore, mantiene il testo selezionabile e cercabile, e si può leggere in qualunque browser senza un'applicazione in più; un PDF fissa il layout della pagina, il che conta quando l'impaginazione è parte del contenuto o quando un'istituzione accetta solo PDF. Una risposta pratica è produrre prima l'HTML e stamparlo in PDF quando un PDF è specificamente richiesto.

### È sicuro aprire un file HTML autosufficiente che qualcuno mi ha spedito?

Più sicuro di una pagina ospitata per un aspetto e non per l'altro. Non scarica niente, quindi non può telefonare a casa né caricare codice remoto, ma lo JavaScript inline al suo interno viene comunque eseguito quando lo apri. Se hai motivo di essere cauto sul mittente, leggi prima il sorgente cercando `<script`, oppure apri il file con JavaScript disattivato.

### Perché un file HTML che ho ricevuto sembra senza stile?

Quasi sempre perché non era autosufficiente: collegava un foglio di stile che non gli sta più accanto, o uno su un host che la tua rete non può raggiungere. Un browser a cui viene dato HTML senza nessun CSS applicabile lo visualizza nel suo font serif predefinito a tutta larghezza della finestra, ed è per questo che il file sembra una bozza di testo semplice invece che un documento. Chiedi al mittente una versione con gli stili inline.
