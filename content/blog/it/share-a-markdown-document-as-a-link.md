---
title: Come condividere un file Markdown con chi non usa Markdown
description: I modi onesti per condividere un file Markdown con chi non installerà nulla — allegato, Gist, repository, file HTML, link — e cosa serve per revocarlo davvero
date: 2026-09-05
tag: Pubblicazione
keywords: condividere un file markdown, pubblicare markdown online, markdown come link condivisibile, ospitare un file markdown, link di sola lettura, mandare markdown a un cliente
---

Hai un file `.md`. L'hai scritto tu, oppure hai salvato [una risposta che un assistente in chat ti ha dato in Markdown](/blog/ai-output-to-a-shareable-page); da qui in poi non fa differenza. Qualcuno deve leggerlo: un cliente, un responsabile, un avvocato, un muratore che ti sta facendo un preventivo per la cucina. Non installerà un editor Markdown, non clonerà un repository, e non dovrebbe doverlo fare. Ogni modo di mettere il documento davanti a questa persona fallisce da qualche parte, e il trucco è sapere dove, prima di premere invio.

### In breve

Scegli in base a cosa succede al file dopo che arriva, non in base a cosa è più veloce per te. Se il lettore lo modificherà e te lo rispedirà, allega il sorgente e digli cos'è. Se deve leggerlo una volta sola, su un telefono, in una riunione, convertilo in un **file HTML autosufficiente** e allega quello, oppure pubblicalo come **link di sola lettura** — in entrambi i casi ottiene un documento invece del sorgente. Un link vale la pena usarlo solo se non chiede niente al lettore: nessun account, nessuna installazione, nessuno script. E un link è davvero revocabile solo se revocarlo uccide l'indirizzo stesso, immediatamente, senza bisogno della collaborazione del lettore — cosa che nessun allegato può mai fare, perché un allegato è una copia.

## Cosa fa la macchina del lettore con il tuo file

L'attrito non è Markdown. Markdown è un file di testo con della punteggiatura dentro, ed è stato pensato apposta perché quella punteggiatura resti leggibile quando niente la rende visivamente. L'attrito sta nel fatto che sistemi operativi, client di posta e telefoni fanno ciascuno un'ipotesi diversa su un'estensione di file per cui non hanno nessuna applicazione, e ognuna di quelle ipotesi è sbagliata in un modo che non puoi vedere dal tuo lato.

Ci sono tre domande distinte nascoste dentro "riesci a leggerlo?" La prima è se il file si apre affatto. La seconda è se si apre come documento o come codice sorgente. La terza è se quello che si apre è la versione che intendevi mostrare, oggi e fra sei mesi. Incollare il testo risponde alla prima e fallisce sulla seconda. Allegare il sorgente può fallire del tutto sulla prima. Un link a un repository risponde alle prime due e fallisce silenziosamente sulla terza, perché l'indirizzo punta a un ramo che si muove.

L'ultima domanda conta più di quanto ci si aspetti. La maggior parte delle condivisioni va storta dopo il momento dell'invio. Il cliente lo inoltra. Il responsabile torna sul link un trimestre dopo. L'ufficio legale chiede la versione che era attuale l'undici del mese. Qualunque cosa scegli deve sopravvivere alla lettura da parte di qualcuno a cui non l'hai mandato, in un momento che non hai scelto.

## Confronto rapido: il bigliettino

| Opzione | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| Incollare il testo nel messaggio | Un appunto breve, senza tabelle o immagini | Funziona in ogni client; niente da aprire | Gratis |
| Allegare il file `.md` | Un lettore che lo modificherà e te lo rispedirà | Senza perdite — esattamente i byte che hai | Gratis |
| Un Gist | Uno snippet o un appunto per qualcuno tecnico | Visualizza il GFM a un URL, conserva le revisioni | Gratis, serve un account GitHub per crearlo |
| Un file in un repository | Un documento che sta accanto al codice | Si visualizza sul posto, versionato con il progetto | Gratis per i repository pubblici |
| Un link di cloud storage | Un file che tieni già in Drive, Dropbox o OneDrive | Un link solo, accesso controllato dall'account | Livello gratuito; piani a pagamento a seconda dello spazio |
| Un allegato HTML autosufficiente | Un documento finito che deve aprirsi offline | Un file solo, stili inline, non chiede niente alla rete | Gratis |
| Un link pubblicato di sola lettura | Qualcuno che legge una volta, su un telefono, senza account | Un indirizzo che non chiede installazioni, e si può ritirare | Gratis |
| Un PDF | Stampa, firma, un archivio fisso | Ogni lettore vede pagine identiche | Gratis con il dialogo di stampa del browser |
| Hosting statico o Pages | Un insieme di documenti che si collegano fra loro | Navigazione, dominio personalizzato, ricerca | Gratis per i repository pubblici; serve mantenere una build |

## I modi per condividere un file Markdown

### Incolla il testo nel messaggio

L'opzione più veloce, e quella che funziona ovunque. Copia il file nell'email, nel messaggio di chat o nel ticket, e il lettore lo ha davanti senza aprire niente.

| Pro | Contro |
| --- | --- |
| Nessun allegato, nessun link, nessuna installazione — è già davanti a lui | La sintassi arriva come punteggiatura, non come formattazione |
| Citabile e cercabile dentro il suo stesso client di posta | Tabelle, immagini e codice si perdono o si rovinano |
| Niente da revocare, perché niente è stato ospitato | I documenti lunghi sono illeggibili come muro di testo nel messaggio |
| Funziona anche quando un filtro di posta elimina gli allegati | Ogni client applica le sue regole Markdown parziali |

**Prezzo:** gratis.

**Cosa succede davvero al testo**

- I titoli arrivano come `## Ambito`, perché nessun client di posta interpreta le intestazioni ATX
- Slack non ha sintassi per titoli o tabelle, quindi entrambi arrivano come caratteri letterali, mentre `*Ambito*` diventa grassetto — lì un solo asterisco è grassetto, non corsivo
- [Le tabelle se la passano peggio di tutte](/blog/markdown-tables-that-survive-conversion): la riga di trattini per l'allineamento non significa niente per uno strumento che non la interpreta, quindi il lettore riceve un paragrafo di barre verticali
- Le immagini restano la riga grezza `![alt](percorso)`, e i percorsi relativi non si sarebbero risolti comunque nel client di qualcun altro
- Alcuni client formattano automaticamente mentre incolli, il che è peggio di niente: metà documento si visualizza e metà no, e dalla cartella degli inviati non puoi dire quale metà

**Per chi è?** Per chi manda qualcosa di breve, definitivo e soprattutto prosa — un paragrafo di stato, una decisione, tre punti elenco. Qualunque cosa più lunga di uno schermo, o con una tabella dentro, vuole una delle opzioni successive.

### Allega il file `.md`

Onesto e senza perdite. Il destinatario riceve esattamente i byte che hai tu, che è l'unica opzione di questa pagina che gli permette di cambiare una parola e rimandartelo indietro.

| Pro | Contro |
| --- | --- |
| Identico byte per byte, quindi torna indietro dopo la modifica | Niente su una macchina standard è registrato per `.md` |
| Piccolo, testo semplice, e confrontabile riga per riga | Su un telefono di solito non si apre affatto |
| Nessun hosting, nessun account, nessun servizio in mezzo | Chi lo apre legge il sorgente, non un documento |
| La scelta giusta quando il file è la consegna | Non puoi ritirarlo, mai |

**Prezzo:** gratis.

**Cosa succede davvero sulla macchina del lettore**

- Un doppio clic su Windows o macOS apre un editor di codice, una finestra "scegli un'app", o niente — l'estensione non ha un gestore predefinito
- I client di posta spesso lo mostrano in anteprima come testo semplice, che è il risultato migliore e del tutto fuori dal tuo controllo
- Alcuni filtri di posta trattano le estensioni sconosciute come sospette, quindi l'allegato può finire in quarantena senza che nessuno dei due lo sappia
- Rinominarlo in `.txt` risolve l'apertura e perde l'associazione con Markdown, il che conta se dovrà modificarlo
- Se lo apre, immagini e link relativi puntano a file che non ha, quindi il documento ha dei buchi

Se il lettore è disposto ma bloccato, [aprire un file `.md`](/blog/how-to-open-md-file) copre cosa funziona su una macchina senza niente di speciale installato. Dì cos'è il file quando lo mandi. "Questo è un file di testo — aprilo con Blocco note o TextEdit, oppure leggilo direttamente nell'anteprima" è una frase che previene la maggior parte della confusione.

**Per chi è?** Per chiunque il cui lettore modificherà il documento, e per chiunque il cui lettore sia abbastanza tecnico da non offendersi per del sorgente. È la scelta sbagliata per un cliente che ha chiesto di vedere una proposta.

### Un Gist

Un Gist è un piccolo documento ospitato con un URL. Visualizza GitHub Flavored Markdown, quindi l'indirizzo del Gist è già una pagina leggibile, e conserva una cronologia delle revisioni perché un Gist è, sotto, un repository Git.

| Pro | Contro |
| --- | --- |
| Visualizza il GFM correttamente — tabelle, liste di attività, codice con fence | Il lettore atterra dentro un'interfaccia da sviluppatore |
| Un URL corto, nessuna installazione per il lettore | Crearne uno richiede un account GitHub, anche se leggerlo no |
| Le revisioni restano, quindi puoi puntare a una versione precisa | Un Gist segreto è non elencato, non privato: chiunque abbia l'URL può leggerlo |
| Modificabile in seguito, nel browser | Cancellarlo è l'unico modo di ritirarlo, ed è permanente |

**Prezzo:** gratis. Leggerlo non richiede nessun account; crearne uno richiede un account GitHub, che è gratuito.

**Cosa vede un non sviluppatore**

- Una pagina con il tuo documento al centro e una barra di Raw, Blame, History e un pulsante per il fork intorno
- Un riquadro "clone this" che offre un indirizzo HTTPS e uno SSH, entrambi privi di significato per lui
- Campi commento sotto, che sembrano un invito a una conversazione che magari non volevi
- Il tuo avatar e nome utente GitHub come firma, il che va bene per un README ed è strano su un preventivo per dei lavori edili
- Su un telefono, i controlli dell'interfaccia occupano una buona parte dello schermo prima che il documento inizi

**Per chi è?** Per chi manda uno snippet, un file di configurazione, una segnalazione di bug o un appunto a un altro sviluppatore. È uno strumento buono usato di continuo per il pubblico sbagliato: la visualizzazione è giusta e il contesto intorno è sbagliato per chiunque non viva già su GitHub. E "segreto" è la parola che inganna: significa che l'URL non è indicizzato né elencato, non che l'accesso sia controllato.

### Un file in un repository

Se il documento appartiene a un progetto, mettilo accanto al codice. GitHub, GitLab e Bitbucket visualizzano tutti il Markdown nella vista dei file, quindi l'URL del file è già una pagina.

| Pro | Contro |
| --- | --- |
| Versionato insieme al codice che descrive | Un repository privato chiede al lettore di accedere |
| Revisionabile — le modifiche arrivano tramite una pull request | Uno pubblico mostra il tuo testo dentro un'interfaccia costruita per sviluppatori |
| Visualizza il GFM, tabelle e liste di attività incluse | Il link punta a un ramo, quindi si muove |
| Gratis, e già parte del flusso di lavoro | La cronologia conserva ogni versione precedente, incluso quella di cui ti penti |

**Prezzo:** gratis per i repository pubblici; quelli privati sono inclusi nei livelli gratuiti di tutti e tre, con limiti e piani a pagamento descritti sulle rispettive pagine dei prezzi.

**I dettagli che decidono**

- Il link predefinito è `/blob/main/documento.md`, che si risolve in quello che dice `main` oggi e non in quello che diceva quando hai mandato il link
- Premere `y` su GitHub riscrive l'indirizzo per fissare il commit, il che risolve il bersaglio mobile ma non l'interfaccia intorno
- La vista Raw serve il file come testo semplice, quindi è un download o un muro di sorgente, non un documento
- I percorsi relativi di immagini e link si risolvono davvero dentro la vista del repository, che è esattamente perché si rompono nel momento in cui il file viene letto altrove, in un'email o in una pagina convertita allo stesso modo
- Cancellare il file lo toglie dall'albero attuale e non dalla cronologia, quindi non è un ritiro in nessun senso che un avvocato accetterebbe

**Per chi è?** Per le squadre. Questa è la casa giusta per [la documentazione che vive nel repository](/blog/documentation-that-lives-in-the-repo), dove il pubblico ha già un account e la cronologia delle versioni è proprio il punto. È la casa sbagliata per un preventivo che hai mandato a un cliente martedì scorso.

### Un link di cloud storage

Tieni già i file in Drive, Dropbox o OneDrive, e ognuno di loro ti darà un link di condivisione per qualunque cosa nella cartella. È la strada di minor resistenza, e quello che il lettore riceve dall'altra parte è meno prevedibile delle altre opzioni qui.

| Pro | Contro |
| --- | --- |
| Nessuno strumento nuovo: il file è già lì | Quello che l'anteprima fa con `.md` varia da provider a provider e cambia senza preavviso |
| Controllo d'accesso per account, che è controllo d'accesso vero | "Chiunque abbia il link" e "persone specifiche" si confondono facilmente, e si clicca per sbaglio |
| Revocare il link funziona davvero | Una richiesta di accesso davanti a un documento che intendevi far leggere a chiunque |
| Scadenza e password esistono su alcuni piani | Spesso il lettore riceve solo un pulsante di download |

**Prezzo:** livello gratuito con ogni account consumer. I piani a pagamento sono a seconda dello spazio, e i controlli sul link come scadenza e password stanno sui livelli a pagamento con alcuni provider — controlla la pagina dei prezzi del provider prima di promettere a un cliente un link con scadenza.

**Cosa controllare prima di mandarne uno**

- Apri il link in una finestra privata. È l'unico modo di scoprire se il tuo lettore incontra un muro di accesso, perché il tuo browser è già autenticato
- Conferma se l'anteprima visualizza il Markdown, mostra il sorgente come testo semplice, o offre un download — esistono tutti e tre i comportamenti, e nessuno viene annunciato
- Controlla se il link permette la modifica. Il predefinito non è sempre di sola lettura, e la differenza conta su un documento con un prezzo dentro
- Ricorda che il file continua a vivere nella tua cartella. Rinominarlo o spostarlo può rompere il link che hai già mandato

**Per chi è?** Per chi condivide con un gruppo di nome dentro un'organizzazione che usa già quel provider, dove l'accesso non è un ostacolo e le liste di accesso sono il punto. Per uno sconosciuto che legge una volta su un telefono, è più attrito di quanto il compito richieda.

### Un file HTML autosufficiente come allegato

Converti il Markdown in un unico file HTML con gli stili inline, e allega quello. Il lettore fa doppio clic e ottiene un documento finito nel browser che ha già, e [cosa deve contenere un file per comportarsi così, quanto costa in byte portare tutto inline, e come dimostrare che non scarica niente](/blog/self-contained-html-explained) vale la pena saperlo prima di affidarti al formato.

| Pro | Contro |
| --- | --- |
| Si apre su qualunque macchina, senza installazione e senza account | È comunque un allegato, quindi i filtri di posta si applicano ancora |
| Funziona con la rete spenta, in treno, in uno scantinato | Più grande del sorgente, perché lo stile viaggia insieme |
| Si stampa ed esporta in PDF con il dialogo del browser stesso | Non puoi ritirarlo — il lettore ne ha una copia |
| Niente è ospitato, quindi niente può andare giù o essere revocato sotto di loro | Non modificabile in nessun modo che apprezzeranno |

**Prezzo:** gratis.

**Perché "autosufficiente" è la parola che conta**

- Un documento completo significa doctype, `<head>`, e un blocco `<style>` inline — non un frammento di tag `<h1>` e `<p>`, che si visualizza come testo nero senza stile a tutta larghezza della finestra
- Nessuna richiesta esterna: nessun foglio di stile da un CDN, nessun web font, nessuna analitica. Un file che scarica il proprio stile sembra rotto offline e racconta a chi lo apre qualcosa su dove è stato
- Le immagini devono essere incorporate invece che collegate, o il documento arriva pieno di buchi su una macchina che non ha la tua cartella
- L'HTML grezzo è legale dentro Markdown, quindi un file convertito può portare un tag `<script>` arrivato insieme al sorgente. Se il Markdown non l'hai scritto tu, [sanificare non è opzionale](/blog/sanitising-markdown-safely) prima di mandare il risultato a qualcun altro
- Il file è l'intero archivio. Sei mesi dopo si apre esattamente come il giorno in cui l'hai mandato, che è la proprietà che nessun link ha

**Per chi è?** Per chiunque il cui lettore abbia bisogno di un documento invece che di una pagina, e per chiunque voglia che l'invio sia definitivo. Proposte, note di passaggio di consegne, verbali di riunione, qualunque cosa finirà archiviata. È anche la risposta quando l'organizzazione del destinatario blocca i domini sconosciuti ma apre volentieri gli allegati.

### Un link pubblicato di sola lettura

Visualizza il Markdown una volta, ospitalo, e passa l'indirizzo. Niente da scaricare, niente da installare, e si legge come un documento su un telefono in ascensore.

| Pro | Contro |
| --- | --- |
| Zero attrito per il lettore: tocca e leggi | Il documento dipende dal fatto che un servizio resti attivo |
| Puoi correggere un errore dopo l'invio | Il lettore non ha una copia, quindi niente sopravvive alla revoca |
| Revocabile, se il link è costruito per esserlo | Inoltrarlo è banale e invisibile per te |
| Si visualizza bene su uno schermo piccolo | Il filtro di posta di un'organizzazione può riscrivere o bloccare l'URL |

**Prezzo:** gratis.

**Cosa deve fare il meccanismo**

- Servire il documento visualizzato, non il sorgente Markdown, e non un visualizzatore che richiede un plug-in
- Portare un token indovinabile con difficoltà nell'indirizzo, e restare fuori dagli indici di ricerca
- Funzionare da disconnesso, alla prima visita, su un telefono, su un portatile aziendale con una policy del browser aggressiva
- Visualizzarsi lato server o spedire l'HTML già pronto, così un lettore con gli script bloccati vede comunque il documento
- Permetterti di uccidere l'indirizzo da solo, senza chiedere niente al lettore

TransformPipe copre entrambe le forme. Lascia cadere il file `.md` su transformpipe.com e scarica un file autosufficiente; accedi e pubblicalo per una pagina di sola lettura a `/s/<token>`. Revocare elimina il token, quindi un link già mandato smette di funzionare. Da terminale è un comando solo:

```bash
node cli/tp.mjs login tp_live_…        # una volta, con una chiave API
node cli/tp.mjs push proposal.md --share link
```

**Per chi è?** Per chiunque mandi un documento a qualcuno che lo leggerà una volta e non lo archivierà mai. Anche per chiunque preveda di rivedere il contenuto: l'indirizzo resta lo stesso mentre il contenuto migliora, che è l'unica cosa che un allegato non può fare.

### Un PDF

Converti in HTML, aprilo, stampa in PDF. Sono due passaggi invece di uno, e comprano una proprietà che nessun'altra opzione ha: ogni lettore vede le stesse pagine nello stesso ordine.

| Pro | Contro |
| --- | --- |
| Apribile universalmente, anche sui telefoni | Larghezza di pagina fissa, si legge male su uno schermo piccolo |
| Impaginazione, che conta per firme e citazioni | L'adattamento è sparito: le tabelle lunghe si spezzano male fra le pagine |
| Accettato da processi che non accetterebbero un link | Modificarlo è uno strumento diverso e un'esperienza peggiore |
| Un archivio fisso: la pagina 4 è pagina 4 per chiunque | Più grande dell'HTML da cui viene |

**Prezzo:** gratis con il dialogo di stampa del browser, che ogni browser moderno include.

**Dettagli da sapere**

- Il foglio di stile di stampa decide il risultato. Un documento che sembra giusto a schermo può perdere i bordi dei blocchi di codice e le righe delle tabelle su carta
- I link sopravvivono come annotazioni cliccabili nell'output PDF della maggior parte dei browser, e i piè di pagina possono aggiungere l'URL della fonte, il che è utile o rumore a seconda del documento
- I titoli di solito diventano segnalibri PDF solo se il convertitore li emette apposta; il percorso di stampa del browser in genere non lo fa
- Il testo resta selezionabile, quindi il documento è cercabile e citabile — uno screenshot non è un sostituto

**Per chi è?** Per chi manda qualcosa dentro un processo: un contratto, una fattura, una domanda, qualunque cosa verrà firmata o archiviata. Non la risposta giusta per un documento che prevedi di rivedere due volte la prossima settimana.

### Hosting statico o Pages

GitHub Pages, GitLab Pages e ogni generatore di siti statici convertono il Markdown in HTML e lo mettono online con navigazione e un dominio personalizzato. Nessuno di loro è un modo di condividere un file solo.

| Pro | Contro |
| --- | --- |
| Navigazione, ricerca e collegamenti incrociati fra molti documenti | Un file di configurazione, un tema e una build da mantenere |
| Un dominio personalizzato, che si legge come tuo e non di un fornitore | Pubblico per impostazione predefinita: il controllo d'accesso richiede piani a pagamento o un proxy davanti |
| Veloce, in cache, e gratis da servire | Pubblicare è un deploy, quindi correggere un errore è un commit e un'attesa |
| Ben documentato e ampiamente diffuso | Ritirare la pubblicazione è un altro deploy, non un interruttore |

**Prezzo:** gratis per i repository pubblici sui principali host; pubblicare da un repository privato richiede uno dei loro piani a pagamento, descritti sulle rispettive pagine dei prezzi.

**Per chi è?** Per chiunque pubblichi un insieme di documenti che si collegano fra loro e si aspetti di essere trovato. Se hai un file solo e una persona a cui mandarlo, il carico è enorme e il modello d'accesso è sbagliato — un hosting statico pubblica per chiunque, e tu volevi pubblicare per un lettore solo.

## Cosa un link di condivisione dovrebbe e non dovrebbe chiedere al lettore

La maggior parte delle delusioni con la condivisione viene da link che chiedono qualcosa al lettore. Mandi un indirizzo aspettandoti che compaia un documento, e quello che compare è un modulo. Dal tuo lato sembrava tutto a posto, perché il tuo browser era già autenticato.

Un link di sola lettura dovrebbe:

- [x] aprirsi in qualunque browser, senza account, senza app e senza estensioni
- [x] mostrare il documento visualizzato, non il sorgente Markdown
- [x] essere leggibile su un telefono, a una misura ragionevole, senza dover pizzicare lo schermo
- [x] funzionare con gli script bloccati, perché molti browser aziendali li bloccano
- [x] essere revocabile solo da te, in qualunque momento, senza l'aiuto del lettore
- [x] portare un indirizzo che non si può indovinare e non è indicizzato

Non dovrebbe:

- [ ] mettere un muro di accesso davanti a un documento che intendevi far leggere a chiunque
- [ ] raccogliere un indirizzo email prima di mostrare qualunque cosa
- [ ] richiedere un browser specifico, o un'app per una "esperienza migliore"
- [ ] scaricare font, stili o analitiche da altri host, il che racconta a terzi chi sta leggendo cosa
- [ ] rompersi quando il lettore lo inoltra a un collega, cosa che farà

C'è un caso intermedio che vale la pena nominare. Quando un documento è davvero riservato, una lista di indirizzi è il controllo giusto: solo i lettori nominati possono aprirlo, e accedono per dimostrare chi sono. È un meccanismo diverso, non un link più rigido. Un link che chiunque può aprire va bene per una proposta, una specifica o dei verbali di riunione; una lista di indirizzi va bene per qualunque cosa saresti scontento di vedere inoltrata. Decidere quale ti serve richiede dieci secondi e previene il fallimento in cui un link "privato" si scopre pubblico, e nessuno l'ha ancora trovato.

## Cosa deve fare la revoca per meritare quel nome

Ogni servizio con un pulsante di condivisione dice che il link può essere revocato. La maggior parte intende qualcosa di più debole di quanto immagini. Revocare è revocare solo se valgono tutti i punti seguenti.

**Uccide l'indirizzo, non l'elenco.** Togliere un documento dal tuo elenco personale di elementi condivisi mentre l'URL continua a risolversi è un riordino, non una revoca. Verificalo aprendo l'indirizzo in una finestra privata dopo aver revocato; se il documento compare, non è successo niente.

**Ha effetto subito.** Una copia servita dalla cache per un'altra ora è un documento ancora leggibile per un'altra ora. Chiedi qual è la durata della cache, e tratta "prima o poi" come una funzione diversa.

**Non richiede niente al lettore.** Qualunque meccanismo che dipenda dal fatto che il destinatario cancelli un file, svuoti una cartella o clicchi su "rimuovi accesso" non è una revoca — è una richiesta.

**Non può essere annullata da qualcun altro.** Se un collega con accesso alla stessa cartella può ricondividere il file, l'indirizzo che hai ucciso torna sotto un altro nome.

**Dice cosa non copre.** Revocare non può richiamare una copia. Qualunque cosa scaricata, stampata, catturata con uno screenshot, inoltrata come allegato o finita in un indice di ricerca è irraggiungibile per sempre. Un link revocato ieri può esistere ancora in un proxy di cache dentro il datore di lavoro di qualcuno.

Quest'ultimo punto è il limite onesto di tutta l'idea. La revoca controlla le letture future di chi ha tenuto il link; non controlla niente su chi ha tenuto il documento. Se il requisito è "questo deve smettere di esistere", nessun meccanismo di condivisione in questa pagina lo garantisce, e non dovresti dire il contrario a un cliente.

## Dove la scelta ovvia fallisce, e cosa costa

La scelta ovvia, una volta che sai che un link è possibile, è mandare sempre un link. È un tocco solo per il lettore e si può correggere dopo l'invio. Ecco cosa costa.

**Un link è una dipendenza.** Il documento è leggibile finché un servizio è attivo, un dominio è rinnovato e un account è in regola. Un allegato non ha nessuna di queste condizioni attaccate. Per qualunque cosa con una vita lunga — un contratto, una specifica che qualcuno citerà fra due anni — la copia è il manufatto più sicuro, e il link è la comodità.

**Un link rende il documento un bersaglio mobile.** La capacità di correggere un errore dopo l'invio è la stessa capacità di cambiare un numero dopo l'accordo. Se il documento è un archivio, quello è un difetto e non una funzione, e il rimedio è una versione fissata o un allegato.

**Un link fallisce dentro l'infrastruttura di qualcun altro.** I sistemi di posta aziendali riscrivono gli URL per la scansione, i client di chat li trasformano in anteprime che non hai chiesto, e alcuni filtri semplicemente rifiutano i domini sconosciuti. Niente di tutto questo è visibile dal lato dell'invio. Gli allegati hanno i loro problemi di filtro, ma falliscono rumorosamente.

**Un link fa trapelare la lettura.** Qualunque documento ospitato può dire al suo proprietario quando è stato aperto. A volte è esattamente quello che vuoi e a volte è una cosa che non vorresti fatta a te. Se il servizio carica anche font o analitiche da altrove, la visita del lettore viene rivelata a soggetti che nessuno dei due ha scelto.

**Un link non è un documento per il lettore.** Non può archiviarlo, annotarlo, o ritrovarlo fra tre mesi cercando nella posta. Molti lettori, ricevuto un link, provano subito a salvare la pagina come file — male. Manda il file se è quello che ne faranno.

Vale la pena nominare anche il fallimento speculare. Allegare sempre un file convertito significa che ogni correzione è una nuova email, nessun lettore è mai sicuro di quale versione sia quella attuale, e il documento ti sfugge di mano nel momento in cui atterra. I due fallimenti sono simmetrici, ed è per questo che la risposta è guardare il documento invece di scegliere un preferito.

## Come scegliere

1. **Parti da cosa succede dopo che arriva.** Se lo modificheranno, allega il sorgente; qualunque altra cosa e staranno modificando una visualizzazione, cosa che faranno male e ti rimanderanno indietro. Se lo archivieranno, manda un file. Se lo leggeranno una volta, manda un link.
2. **Conta cosa deve fare il lettore.** Ogni installazione, account e finestra di dialogo fra l'indirizzo e il documento ti fa perdere una frazione dei tuoi lettori, e la frazione è più alta proprio con le persone che non volevano leggerlo comunque. Zero passaggi è raggiungibile, quindi tratta un passaggio come un costo.
3. **Decidi se il documento può cambiare.** Un link che resta aggiornato va bene per un documento vivo e male per un archivio. Se qualcuno potrebbe dover dimostrare cosa diceva in una data precisa, manda un allegato o fissa una versione, perché "l'ho aggiornato da allora" non è una risposta.
4. **Controlla se saresti scontento di vederlo inoltrato.** Se la risposta è sì, un URL difficile da indovinare non è il controllo che ti serve — serve una lista di indirizzi. Scegliere bene questo all'inizio costa molto meno che scoprirlo da uno screenshot nella discussione di qualcun altro.
5. **Apri la tua condivisione in una finestra privata prima di mandarla.** Questo cattura il muro di accesso, l'anteprima che offre solo il download, l'immagine mancante e il link relativo rotto, tutto in meno di un minuto, ed è l'unico modo di vedere cosa vede il tuo lettore invece di quello che mostra la tua sessione autenticata.

## Conclusione

Condividere un file Markdown non è un problema di conversione, è una domanda sul lettore. Quando la risposta è "lo vuole stampare", [le strade verso il PDF sono qui](/blog/markdown-to-pdf). La domanda: cosa farà la sua macchina con quello che mandi, e cosa ne farà dopo. Breve e definitivo, incollalo. Deve essere modificato, allega il sorgente e digli cos'è. Fa parte di un progetto, mettilo insieme al codice nel repository. Deve essere letto una volta da qualcuno che non ha mai sentito parlare di Markdown, convertilo in un file HTML autosufficiente e allegalo, oppure pubblicalo come link di sola lettura ed essere onesto con te stesso su cosa quella revoca può e non può disfare. [TransformPipe converte il Markdown in un documento HTML completo nel browser](/), gratis, senza niente caricato quando sei disconnesso — e poi, una volta che hai il link o il file, aprilo in una finestra privata e leggilo come farà il tuo lettore.

## FAQ

### Come condivido un file Markdown con qualcuno che non ha un editor Markdown?

Non mandargli Markdown. Convertilo in un file HTML autosufficiente e allegalo, oppure pubblicalo come link di sola lettura — entrambi gli danno un documento visualizzato nel browser che ha già. Manda il sorgente `.md` solo quando deve modificarlo e restituirtelo.

### Posso condividere un file `.md` come link senza creare un account?

Puoi convertire senza account, e ospitarlo in genere richiede un account. La conversione lato browser produce il file HTML senza nessuna registrazione, e quel file può essere allegato a un'email subito. Pubblicare un URL significa che qualcosa deve ospitarlo, ed è lì che entra in gioco un account — ma il lettore non ne ha comunque bisogno.

### Un Gist è un buon modo di condividere un documento con chi non è sviluppatore?

Visualizza il Markdown correttamente e lo circonda con un'interfaccia da sviluppatore: Raw, Blame, History, un riquadro per il clone e campi commento. Per un collega che usa GitHub ogni giorno è invisibile; per un cliente è confuso. Ricorda anche che un Gist segreto è non elencato, non privato, quindi chiunque abbia l'URL può leggerlo.

### È sicuro mandare a qualcuno un file HTML convertito?

Lo è, a patto che la conversione abbia sanificato il sorgente. Markdown permette HTML grezzo, quindi un file `.md` che non hai scritto tu può portare un tag `<script>` o un gestore `onerror` dritto nella pagina convertita. Per i tuoi appunti non conta; per un file arrivato da altrove, controlla che il convertitore sanifichi prima di inoltrare il risultato.

### Cosa succede davvero quando revoco un link di condivisione?

Come minimo, l'indirizzo dovrebbe smettere di risolversi immediatamente, per chiunque, senza che il lettore debba fare niente. Non richiama le copie: qualunque cosa scaricata, stampata, catturata con uno screenshot o messa in cache da un intermediario resta leggibile. La revoca controlla le visite future di chi ha tenuto il link, e niente su chi ha tenuto il documento.

### Dovrei mandare un PDF invece di un link?

Se il documento entra in un processo — firma, invio, archivio — sì, perché un PDF è un archivio fisso che tutti vedono in modo identico. Se verrà letto una volta su un telefono e forse rivisto la settimana prossima, no: le pagine fisse si leggono male su uno schermo piccolo e ogni revisione è un nuovo file.

### Le mie tabelle e immagini sopravviveranno alla condivisione?

Le tabelle sopravvivono se chi visualizza usa GitHub Flavored Markdown, e non sopravvivono se vengono incollate in un messaggio, dove la riga di allineamento diventa una fila di trattini. Le immagini sopravvivono solo se sono incorporate nell'output oppure ospitate a un indirizzo assoluto, perché un percorso relativo punta a una cartella che il tuo lettore non ha.
