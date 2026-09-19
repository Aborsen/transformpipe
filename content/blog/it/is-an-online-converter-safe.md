---
title: "Un convertitore Markdown online è sicuro? Come verificarlo invece di fidarti"
description: "Se un convertitore online è sicuro dipende da quattro cose verificabili: se il file viene caricato, per quanto viene tenuto, chi lo legge, cosa dicono i termini."
date: 2026-08-16
tag: Sicurezza
keywords: è sicuro un convertitore markdown online, privacy convertitore online, il convertitore carica il mio file, politica di conservazione dei file convertiti, convertire documenti senza caricarli, termini di servizio convertitore online, convertitore che gira nel browser
---

Nessuno legge l'informativa sulla privacy di un convertitore di file. Il documento è aperto, la scadenza è ora, la pagina dice gratis e senza registrazione, e trenta secondi dopo c'è un file HTML nella cartella dei download e nessun ricordo di aver preso una decisione. Una decisione è stata presa comunque: se quel documento ha lasciato l'edificio, chi ne tiene ora una copia, per quanto tempo, e sotto quale licenza.

### In breve

Un convertitore è sicuro per un documento particolare quando puoi rispondere a quattro domande su di esso — se il file viene caricato affatto, per quanto tempo viene tenuta una copia, chi altro è nel percorso, e se l'output viene sanitizzato. Tre di queste sono osservabili in un browser in circa cinque minuti: apri il pannello di rete, converti un file di prova, e guarda cosa esce; poi leggi i termini in cerca di una clausola sulla licenza piuttosto che del titolo sulla privacy. La conversione lato browser non carica niente e si può verificare spegnendo la rete, la conversione lato server deve leggere il tuo testo in chiaro per fare il lavoro affatto, e uno strumento offline non coinvolge la rete ma ti costa un'installazione e una supply chain. Per contratti, note di pazienti, credenziali, dati finanziari non annunciati e qualunque cosa coperta da un accordo che nomina i subprocessor consentiti, un caricamento non è un rischio da pesare — è una divulgazione.

“È sicuro” è la forma sbagliata di domanda, perché la sicurezza non è una proprietà che un convertitore ha. Quello che un convertitore ha è un insieme di comportamenti, la maggior parte dei quali puoi osservare, e un insieme di promesse, tutte leggibili. I due sono tipi diversi di prova e falliscono in modi diversi: il comportamento può cambiare al prossimo deploy, e una promessa può essere vera e non coprire comunque quello a cui tieni.

L'attrito è che il controllo richiede cinque minuti e la conversione trenta secondi, quindi il controllo non avviene mai. Sembra anche paranoia finché non è la volta in cui non lo è — la nota di rilascio che nomina un cliente non annunciato, il post-mortem con dentro gli hostname interni, il README il cui esempio di configurazione ha ancora un token vivo. Sono file ordinari. Passano attraverso convertitori ordinari ogni giorno.

Quello che segue è la versione onesta più corta: cosa lascia fuori la frase “convertitore online”, come scoprirlo invece di indovinare, quali sono davvero i tre tipi di convertitore, e i documenti specifici per cui un caricamento non è affatto un compromesso.

## Cosa controllano le persone, e cosa dovrebbero controllare

Guarda qualcuno scegliere un convertitore e lo vedrai valutare quattro cose, nessuna delle quali riguarda la domanda vera.

**Il lucchetto.** HTTPS è un'affermazione sul trasporto. Dice che i byte sono stati cifrati tra il tuo browser e quel server, e non dice niente su se i byte dovessero essere stati inviati, cosa il server ne ha fatto, per quanto li ha tenuti, o a chi li ha passati. Ogni convertitore ospitato che carica il tuo file lo carica via HTTPS. Così fa ogni convertitore che lo tiene per sempre.

**Quanto professionale sembra il sito.** La qualità del design è correlata al budget, non alla gestione dei dati. Un'area di trascina-e-lascia ordinata con un'animazione di progresso è un front end; la parte interessante è la richiesta dietro di essa. Al contrario, una pagina semplice senza nessuno stile può fare tutto il lavoro in locale.

**“Nessuna registrazione richiesta”.** Significa che non c'è un account. Non significa che non ci sia un caricamento. Le due cose vengono confuse di continuo, perché registrarsi sembra il momento in cui consegni qualcosa, e a quel punto il file di solito è già andato.

**Un'affermazione sull'utilizzo.** La popolarità non è un controllo. Un servizio usato da moltissime persone ha una superficie di incidente più grande, non più piccola, e il numero sulla homepage non dice niente sulla conservazione, sui subprocessor o su cosa dicono i termini sul tuo contenuto.

Le quattro domande che riguardano davvero la questione sono più noiose e a cui si può rispondere:

1. Il file viene caricato affatto?
2. Se sì, per quanto tempo viene tenuta una copia, e dove?
3. Chi altro può leggerlo — staff, subprocessor, chiunque tenga un link al risultato?
4. L'output è sanitizzato, o porta qualunque cosa fosse nell'input direttamente in un browser?

La quarta è quella che nessuno fa. Le prime tre riguardano la confidenzialità del tuo documento. La quarta riguarda se il file che ti viene restituito possa danneggiare chi glielo mandi, e si applica esattamente allo stesso modo a un convertitore che gira interamente sulla tua stessa macchina.

## Cinque cose che “convertitore online” nasconde

La frase fa molto lavoro. È arrivata a significare “gira sul server di qualcuno”, ma un browser è un runtime come un altro, e un convertitore scritto per girare lì fa il lavoro sulla tua macchina e non carica niente. Entrambi sono online nel senso che ci sei arrivato con un URL. Solo uno dei due è online nel senso che le persone intendono.

Ecco cosa nasconde la frase, e come scoprire ognuna di queste cose.

| Cosa è nascosto | Come lo controlli | Come sembra una risposta scarsa |
| --- | --- | --- |
| Se il file viene caricato | Pannello di rete aperto, converti un file di prova, guarda una richiesta in uscita con la dimensione del tuo file | Un `POST` che porta `multipart/form-data`, oppure la pagina che non riesce a convertire con la rete spenta |
| Per quanto viene tenuta una copia | Cerca nell'informativa sulla privacy una durata — ore, giorni, “finché non lo elimini” | Rassicurazione senza nessun numero dentro: “prendiamo sul serio la tua privacy” |
| Chi altro può leggerlo | L'elenco dei subprocessor, la regione, se i risultati vengono consegnati come un link indovinabile | Nessun elenco affatto, o un URL di risultato che puoi condividere senza nessuna credenziale |
| Cosa dicono i termini sul tuo contenuto | Cerca nei termini licenza, royalty-free, sublicenziabile, perpetua, opere derivate | Una licenza ampia sul contenuto senza limite di scopo e senza scadenza |
| Se l'output è sanitizzato | Converti un documento con dentro un tag script e leggi l'HTML che torna | `<script>`, `onerror=` o `javascript:` ancora presenti nell'output |

Due di queste vale la pena approfondirle ora, perché sono dove le parole fanno più danno.

**“Non conserviamo i tuoi file” non è “non riceviamo i tuoi file”.** Un'affermazione sulla conservazione è un'affermazione su cosa succede dopo il caricamento. Concede il caricamento. È anche la frase più comune sulla homepage di un convertitore, ed è di solito vera — il file viene davvero eliminato dopo l'elaborazione — cosa che è esattamente il motivo per cui funziona come sostituto dell'affermazione più forte a cui somiglia. Se vuoi l'affermazione più forte, le parole da cercare riguardano la trasmissione: il file non viene inviato, la conversione avviene nel tuo browser, niente lascia la tua macchina.

**Un convertitore lato server non può essere cifrato end-to-end.** Questo segue dal lavoro che sta facendo. Per trasformare il Markdown in HTML il convertitore deve interpretare il Markdown, il che significa che deve avere il testo in chiaro, il che significa che la cifratura finisce sul loro server, non all'altro capo. TLS protegge il viaggio. Non può proteggere la destinazione da leggere quello che è arrivato, perché leggere quello che è arrivato è il servizio. Qualunque convertitore che pubblicizza la cifratura end-to-end mentre fa la conversione lato server o usa la frase con troppa libertà o non sa cosa significhi, ed entrambi sono motivi per leggere il resto della pagina più lentamente.

## Confronto rapido: il bigliettino

Ci sono tre posizioni oneste che un convertitore può occupare. Tutto il resto è marketing sopra una di queste.

| Tipo | Dove viene letto il file | Cosa può essere conservato | Chi altro è nel percorso | Cosa possono dichiarare i termini | Giusto per | Sbagliato per |
| --- | --- | --- | --- | --- | --- | --- |
| Lato browser | La tua stessa macchina, da JavaScript che la pagina ha già caricato | Niente — non c'è nessuna copia da tenere | Chiunque altro abbia uno script su quella pagina | Niente su un contenuto che non riceve mai | Qualunque cosa non già pubblica; conversioni rapide occasionali; lavoro orientato alla verifica | File molto grandi; formati che un browser non sa interpretare; lotti non presidiati |
| Lato server | La macchina del fornitore, in una regione che sceglie lui | Il caricamento, l'output, i log, e qualunque link al risultato | Il fornitore, il suo hosting, i suoi subprocessor, chiunque abbia il link | Una licenza a ospitare, copiare ed elaborare il tuo contenuto | Formati esotici; conversioni pesanti; pipeline guidate da API; documenti pubblici | Contratti, dati sanitari, credenziali, qualunque cosa sotto un NDA che nomina i subprocessor |
| Offline | La tua stessa macchina, da software che hai installato | Qualunque cosa lo strumento scriva su disco, sotto il tuo controllo | Nessuno, una volta installato — ma l'installazione ha una supply chain | Niente; una licenza governa il software, non i tuoi file | Lavoro regolamentato; pipeline ripetibili; ambienti air-gapped; lavori in blocco | Conversioni occasionali dove un'installazione è assurda; macchine su cui non puoi installare |

La riga che sorprende le persone è la terza colonna della prima riga. La conversione lato browser non ha nessuna politica di conservazione, non perché il fornitore sia generoso ma perché non c'è niente su cui avere una politica. È una categoria di risposta diversa da “eliminato dopo ventiquattro ore”, ed è la sola che non dipende da qualcuno che mantiene una promessa su una copia che tiene.

La riga che sorprende le persone nell'altra direzione è l'ultima colonna della terza riga. Uno strumento offline non è automaticamente la scelta più sicura, perché installare software è di per sé una decisione di fiducia, e un convertitore che hai installato gira con l'accesso del tuo account utente a ogni file che possiedi. Il caricamento che hai evitato è un'esposizione più ristretta del pacchetto che hai aggiunto.

## Come controllare invece di fidarti

Tutto questo è verificabile. Niente richiede strumenti speciali — un browser e dieci minuti risolveranno per te un convertitore su cui stai per contare, e gli stessi dieci minuti lo risolveranno per l'intera squadra.

### Il pannello di rete

Apri gli strumenti per sviluppatori prima di convertire qualcosa, non dopo. In Chrome, Edge o Firefox è F12; il pannello che vuoi è Network. Ricarica la pagina con il pannello aperto così catturi anche il caricamento della pagina, poi converti un file e osserva.

Quello che stai cercando è una richiesta che appare nel momento in cui converti, con un corpo di richiesta grosso più o meno come il tuo documento. Filtra su `Fetch/XHR` per tagliare il rumore. Ordina per dimensione se l'elenco è lungo.

```
# A browser-side conversion, after the page has finished loading
(no new rows appear when you press Convert)

# An upload, in the same panel
POST  /api/convert   xhr   multipart/form-data   1.4 MB   312 ms
GET   /api/result/8f3c1e   xhr   application/json   2.1 kB
```

Due affinamenti rendono questo un test molto migliore.

Primo, spegni la rete e riprova. Carica il convertitore, poi disconnettiti — modalità aereo, oppure la casella Offline nel pannello Network — e converti. Un convertitore lato browser continua a funzionare, perché il codice è già nella pagina e il file non ha mai avuto bisogno di andare da nessuna parte. Uno lato server si ferma. È il test da cinque secondi più forte che esista, perché non può essere falsificato da una richiesta che sembra solo piccola.

Secondo, guarda con cosa altro parla la pagina. Un convertitore che non carica il tuo documento potrebbe comunque mandare il suo nome file, la sua dimensione, o un evento di pagina a un endpoint di analytics, e quello può contare di per sé: un nome file come `elenco-esuberi-finale.md` è una divulgazione anche quando il contenuto non lo è. Mentre sei lì, conta gli script di terze parti. Ogni script che la pagina carica gira nella stessa origine del convertitore, con lo stesso accesso alla pagina e quindi al tuo documento. Un convertitore lato browser con un tag manager, un widget di chat e due fornitori di analytics addosso è a un fornitore di distanza da un caricamento che non intendeva fare.

### L'informativa sulla privacy, letta per i nomi

Leggi la politica cercando tre cose e ignora il resto: cosa viene raccolto, per quanto viene tenuto, e con chi viene condiviso. La rassicurazione non è una delle tre. Una frase con dentro una durata vale più di tre paragrafi su quanto seriamente qualcuno prenda qualcosa.

Se non trovi una frase sulla conservazione, la conclusione onesta è che il periodo di conservazione è sconosciuto, e un periodo sconosciuto non è lo stesso di uno breve. Tratta il caricamento di conseguenza.

### La dichiarazione di conservazione, di per sé

I buoni servizi ospitati dichiarano la conservazione con chiarezza, e le dichiarazioni cadono in forme riconoscibili: eliminato subito dopo l'elaborazione, eliminato dopo un numero fisso di ore, tenuto finché non lo elimini, tenuto per quanto dura il tuo account. Ognuna è difendibile. Nessuna è zero.

Due dettagli nella dichiarazione di conservazione meritano più attenzione di quanta ne ricevano di solito.

Il primo è cosa succede quando una conversione fallisce. Diversi servizi tengono un caricamento fallito più a lungo di uno riuscito così che il supporto possa guardarlo, cosa del tutto sensata e che significa che il documento che vorresti più dimenticare — quello che si è rotto — è quello tenuto più a lungo.

Il secondo è cosa copre la dichiarazione. La conservazione di solito descrive il file caricato e l'output convertito. Raramente descrive i log, e i log sono dove vivono nomi file, dimensioni, indirizzi IP e timestamp. Eliminare il documento e tenere la riga di log su di esso è un esito normale di ingegneria e una risposta parziale a “è sparito”.

### I termini, e la clausola sulla licenza

Questo è il controllo che quasi nessuno fa, ed è quello che occasionalmente produce una vera sorpresa. Apri i termini di servizio e cerca nel testo queste parole:

```
licence   license   royalty-free   sublicensable   perpetual
irrevocable   worldwide   derivative works   retain   store
third parties   subprocessor   improve our services   training
```

La maggior parte dei servizi ha bisogno di una qualche licenza sul tuo contenuto, e dirlo non è sinistro: per conservare un file, copiarlo tra macchine e restituirtelo, un fornitore ha bisogno del tuo permesso a conservarlo, copiarlo e trasmetterlo. Quello che stai controllando è la forma di quel permesso, e ci sono quattro cose da guardare.

È limitata dallo scopo — “solo per fornire il servizio” — o aperta? Finisce quando elimini il file e chiudi l'account, o è perpetua? È sublicenziabile, il che la estende a parti che non puoi vedere? E arriva oltre il gestire il servizio fino al migliorarlo, cosa che nell'uso corrente spesso significa addestrare modelli su ciò che hai caricato?

Una licenza limitata nello scopo, non sublicenziabile, che termina con il tuo contenuto è normale e va bene. Una licenza perpetua, mondiale, sublicenziabile a usare, adattare e creare opere derivate da qualunque cosa carichi, senza limite di scopo, è una clausola che qualcuno ha scritto apposta. Se conta dipende interamente da di chi sia il documento che stai convertendo: per le tue note personali, per niente; per la bozza di un accordo di un cliente, è l'intera decisione, e potrebbe essere una decisione che il contratto non ti permette di prendere.

### Se l'output è sanitizzato

Ora l'altra metà della sicurezza, quella che non ha niente a che fare con dove è andato il tuo file.

Markdown permette HTML grezzo per design, quindi un file `.md` può contenere un tag `<script>`, un handler `onerror` o un URL `javascript:`, e un convertitore che renderizza fedelmente passerà tutti e tre al browser. Va bene per un file che hai scritto tu. Non va bene per un README preso dalla rete, un documento mandato da un cliente, o qualunque cosa un modello abbia generato da materiale che non hai letto.

Puoi testarlo in un minuto. Crea un piccolo file con le forme note come pericolose e convertilo:

```markdown
## Sanitiser test

<script>window.__test = 1</script>

<img src=x onerror="window.__test = 2">

[a link](javascript:void 0)

<iframe src="https://example.com"></iframe>

<a href="#" onclick="window.__test = 3">text</a>
```

Poi apri l'HTML che ti ha dato il convertitore in un editor di testo — non in un browser — e cercalo. Se `<script`, `onerror`, `onclick` o `javascript:` sono sopravvissuti, il convertitore renderizza fedelmente e non sanitizza, e l'output è sicuro solo quanto lo era l'input. È una scelta di design legittima per uno strumento pensato per i tuoi stessi file, ed è lo strumento sbagliato per i file di chiunque altro. [I vettori, le liste di elementi permessi e dove deve avvenire il filtraggio](/blog/sanitising-markdown-safely) è la versione più lunga di questo test.

Mentre il file è aperto nell'editor, cerca anche `http`. Ogni URL esterno in un documento esportato è una richiesta che il browser di chi lo riceve farà quando lo apre, cosa che dice all'altro capo che il file è stato aperto, quando, e più o meno da dove. Un'esportazione autonoma ha i suoi stili e font incorporati e non chiede niente alla rete, cosa che vale la pena confermare piuttosto che presumere — la differenza tra [un file e un link](/blog/share-a-markdown-document-as-a-link) è soprattutto questa.

Un'altra cosa sull'output, perché sconfigge un'intuizione: un convertitore che è girato interamente sulla tua macchina può ancora consegnarti un file pericoloso. La conversione locale protegge la confidenzialità del tuo documento. Non fa niente per il contenuto, e un file HTML aperto dal tuo stesso disco esegue comunque il suo JavaScript. Uno script in un file locale può raggiungere la rete costruendo un URL di immagine, quindi “non ha mai lasciato il mio portatile” e “è sicuro da aprire” sono affermazioni non collegate.

## I tre tipi di convertitore, e a cosa serve ognuno

### Lato browser — per qualunque cosa non sia già pubblica

Un convertitore lato browser ti spedisce il parser. La pagina carica del JavaScript, quel JavaScript legge il file che hai scelto con il selettore di file, lo converte in memoria, e ti offre il risultato come download. Nessuna richiesta porta il documento, perché nessuna richiesta ne ha bisogno.

| Pro | Contro |
| --- | --- |
| Niente viene caricato, e puoi provarlo staccando il cavo di rete | L'affermazione si basa su codice che non hai letto, verificato con l'osservazione in un solo momento |
| Nessuna politica di conservazione, perché non c'è nessuna copia da conservare | Gli script di terze parti sulla stessa pagina condividono l'origine e l'accesso |
| Nessun account, nessuna installazione, nessuna approvazione da ottenere | La macchina è il limite: un file molto grande esaurirà la scheda |
| I termini non possono dire molto su un contenuto che non arriva mai | I formati che richiedono un parsing pesante sono più debole di quanto possa gestire un server |

**Per chi è.** Chiunque converta un documento che non è già pubblico e non ha bisogno di un'installazione per giustificarsi: una clausola contrattuale, un annuncio in bozza, un rapporto d'incidente, un CV, il file di un cliente che non sei autorizzato a mandare in nessun posto. È anche il predefinito giusto per chi vuole poter dimostrare la risposta piuttosto che citarla, perché la dimostrazione è un pannello di rete con dentro niente.

**Cosa non risolve.** Sanitizzare è una decisione separata, presa dallo stesso strumento, e vale la pena controllarla separatamente con il test qui sopra. Così è se l'output sia un documento completo o un frammento — una domanda di utilità piuttosto che di sicurezza, e trattata a lungo in [il confronto tra convertitori](/blog/best-markdown-to-html-converters).

### Lato server — per formati e volumi che un browser non riesce a gestire

Un convertitore ospitato carica il file, lo converte sulla sua infrastruttura, e ti dà l'output o un link a esso. È quello che la maggior parte delle persone intende per convertitore online ed è la scelta corretta per un insieme reale di lavori.

| Pro | Contro |
| --- | --- |
| Gestisce formati che un browser non sa interpretare bene, inclusi vecchi file office e PDF | Il documento viene divulgato al fornitore, per definizione |
| Convertisce file molto più grandi di quanto una scheda possa contenere | La conservazione è una politica, il che significa una frase che qualcuno può riscrivere |
| Un'API e una coda, così il lavoro può essere non presidiato e ripetibile | Subprocessor, regioni e log estendono l'elenco delle parti |
| Qualcun altro mantiene i parser, i font e le correzioni | Un risultato consegnato come URL è una credenziale che può essere reinviata |

**Per chi è.** Documenti pubblici, documentazione pubblicata, testi di marketing, qualunque cosa già sul web aperto, e qualunque pipeline dove la conversione deve avvenire senza una persona in una scheda. È anche la risposta pragmatica quando il formato di partenza è genuinamente difficile, cosa che spesso succede in uscita da una suite office — i compromessi specifici di quella direzione sono spiegati in [cosa perde un file Word nel passaggio a Markdown](/blog/convert-docx-to-markdown).

**Le condizioni che lo rendono difendibile.** Un periodo di conservazione dichiarato con un numero dentro. Un elenco di subprocessor che puoi leggere. Una licenza sul contenuto limitata nello scopo. Una regione che puoi scegliere, se hai un obbligo di trasferimento. Un accordo sul trattamento dei dati, se stai gestendo i dati personali di qualcun altro. E un meccanismo di consegna del risultato che non sia un URL indovinabile. Un servizio che offre tutti e sei è un fornitore ragionevole. Un servizio che non ne offre nessuno non è più economico; è non documentato, e [le differenze di conservazione e misurazione tra quelli conosciuti](/blog/best-online-document-converters) sono il vero confronto.

### Offline — per lavoro regolamentato e pipeline ripetibili

Un convertitore offline è software sulla tua macchina: uno strumento da riga di comando, un'applicazione desktop, una libreria in una build. La rete non è coinvolta dopo l'installazione.

| Pro | Contro |
| --- | --- |
| Nessun caricamento, nessuna conservazione, nessuna terza parte, nessuna politica da leggere | Un'installazione, aggiornamenti, e una supply chain di pacchetti di cui fidarsi |
| Gira in un ambiente air-gapped o approvato | Gira con l'accesso del tuo utente a ogni file che possiedi |
| Scriptabile, quindi cento file costano quanto uno | La deriva di versione tra macchine produce output diverso |
| Verificabile: il binario e i suoi input sono tuoi | Ancora nessuna sanitizzazione a meno che lo strumento la faccia o tu l'aggiunga |

**Per chi è.** Lavoro regolamentato e contrattuale dove un controllo documentato conta più della comodità, conversione in blocco, e qualunque cosa debba girare allo stesso modo ogni volta in una pipeline. È la sola opzione su una macchina senza nessuna via verso internet, e quella naturale una volta che la conversione si ripete abbastanza spesso che una persona che apre una scheda diventa la parte lenta.

**Il costo che le persone sottovalutano.** Aggiungere una dipendenza è aggiungere un fornitore. Un convertitore preso da un registro di pacchetti porta con sé le sue dipendenze transitive, e ognuna di quelle gira con lo stesso accesso della tua shell. Pesalo onestamente contro il caricamento che stavi evitando, specialmente per un lavoro occasionale su un singolo file, dove l'installazione è la modifica più grande alla tua macchina.

## Quando un caricamento è inaccettabile

Per la maggior parte dei documenti questa è una preferenza. Per alcuni non è affatto una questione di giudizio, perché il caricamento è di per sé l'evento: nel momento in cui il file raggiunge una terza parte, qualcosa è stato divulgato, e nessuna politica di conservazione lo annulla.

| Documento | Perché il caricamento è il problema | Cosa fare invece |
| --- | --- | --- |
| Contratti non firmati, term sheet, offerte | Nomi, prezzi e posizioni divulgati a una parte non coinvolta nell'accordo | Lato browser, oppure uno strumento offline su una macchina che controlli |
| Informazioni sanitarie o di pazienti | Elaborare i dati sanitari di qualcun altro richiede una base legale e un accordo, non un modulo web | Offline, dentro l'ambiente approvato |
| Dati personali di persone identificabili | Diventi responsabile di un processor che non hai valutato, e possibilmente di un trasferimento | Lato browser, o un servizio ospitato con un accordo firmato |
| Credenziali, token, chiavi private, esempi `.env` | Il segreto è ora condiviso, qualunque cosa succeda al file | Lato browser o offline, e ruota il segreto se è già andato |
| Dati finanziari non annunciati, risultati, acquisizioni | Materiale sensibile al mercato consegnato a una terza parte non valutata | Offline, sotto gli stessi controlli del resto di quel materiale |
| Lavoro per un cliente sotto un NDA che elenca i subprocessor consentiti | Un caricamento a una parte non elencata può violare l'accordo direttamente | Lato browser o offline, e controlla l'elenco prima di scegliere |
| Security review, post-mortem, note di architettura | Hostname, versioni e debolezze note sono esattamente le parti utili | Offline, o lato browser senza script di terze parti sulla pagina |
| Registri HR, note disciplinari, elenchi di esuberi | Sensibile su persone che non hanno consentito, e il nome del file da solo può divulgare | Lato browser o offline; rinomina prima di toccare qualunque strumento |

Tre di questi meritano una frase in più.

**Il caso delle credenziali è di gran lunga il più comune.** Il Markdown degli sviluppatori è pieno di esempi di configurazione, e gli esempi di configurazione sono pieni di cose che sembrano segnaposto e occasionalmente non lo sono. Se un file con dentro un token vivo è andato a un convertitore ospitato, la risposta corretta non è controllare la politica di conservazione; è ruotare il token. La conservazione descrive quando una copia viene eliminata, non chi l'ha letta prima.

**Il nome del file è un dato.** Le persone proteggono il contenuto e incollano i nomi senza pensarci. `esuberi-q3-finale.md`, `note-paziente-4412.md` e `acquisizione-northwind.md` divulgano ognuno la parte interessante prima ancora che il file venga interpretato, e i nomi file finiscono nei log, negli eventi di analytics e nei ticket di supporto molto più spesso dei contenuti.

**Leggi l'accordo, non la tua propensione al rischio.** Molto lavoro per clienti sta sotto termini che specificano quali terze parti possono elaborare il materiale. Dove esiste quell'elenco, la domanda smette di essere sulla probabilità. O il convertitore è nell'elenco o il caricamento è una violazione, ed è una domanda molto più facile a cui rispondere di quanto sia affidabile il fornitore.

## Dove fallisce la risposta ovvia, e cosa costa

“Usa un convertitore lato browser” è il predefinito giusto e non è una risposta completa. Quattro cose non vanno nel trattarlo come tale.

**È un'affermazione, verificata una volta.** Il pannello di rete che non mostra niente è una prova reale sul codice che stava girando quando hai guardato. Un deploy la settimana successiva può cambiarlo, e nessuno riverifica. La conversione lato browser è verificabile in un modo in cui una promessa lato server non lo è — è una proprietà reale e inusuale — ma verificabile non è lo stesso di verificato, e il controllo ha una data di scadenza. Per lavoro dove questo conta davvero, riesegui il test offline ogni tanto, e preferisci uno strumento dove funzionare con la rete spenta è una proprietà progettata piuttosto che un incidente.

**L'origine è condivisa.** Un convertitore lato browser non è una sandbox contro la propria pagina. Qualunque script che la pagina carichi — analytics, un tag manager, un widget di supporto, una pubblicità — gira con pieno accesso al modello a oggetti del documento e quindi a qualunque cosa il convertitore abbia in memoria. Questo è il modo di fallire più probabile nella pratica, perché non richiede che gli autori del convertitore siano disonesti, solo che abbiano aggiunto un fornitore. Conta le terze parti nel pannello di rete; un convertitore senza nessuna fa un'affermazione più forte di uno con cinque.

**Non ti dà niente da mostrare a un auditor.** Questo è il costo che coglie le persone di sorpresa. Se devi documentare come è stato gestito un documento, “è stato convertito localmente in un browser e niente è stato caricato” è un'affermazione vera senza nessun artefatto dietro. Un processor ospitato con un accordo sul trattamento dei dati, una regione nominata, un piano di conservazione e log di accesso è, dal punto di vista della conformità, un controllo meglio documentato di un'affermazione per cui nessuno può produrre un registro. A volte la risposta giusta è il caricamento, proprio perché arriva con la documentazione.

**Registrarsi cambia il modello, e vale la pena dirlo chiaramente.** Un convertitore lato browser che offre anche account, cronologia e condivisione è due prodotti. Da disconnesso, il file resta sulla tua macchina. Nel momento in cui salvi un documento su un account, viene conservato su un server, e tutto nella riga lato server della tabella qui sopra si applica a esso: conservazione, regione, subprocessor, e un link che è una credenziale. Anche i limiti di solito cambiano. Nel caso di questo strumento la conversione è limitata a 10 MB, mentre un documento tenuto in un account è limitato a 4 MB, perché la funzione che lo serve rifiuta una richiesta o una risposta con un corpo sopra i 4,5 MB. Quei numeri sono un vincolo di hosting piuttosto che una politica, e sono un promemoria utile che un documento conservato è una cosa diversa da uno convertito.

C'è un fallimento più piccolo che vale la pena nominare. Gli strumenti lato browser sono più debole sui formati che richiedono un vero lavoro di parsing — vecchi file office binari, PDF la cui struttura va inferita, foglio di calcolo con formule. Insistere su una conversione locale per quelli produce una conversione scarsa, e una conversione scarsa che poi devi correggere a mano ha un suo costo. Meglio conoscere il confine che discuterci.

## I controlli, in ordine

1. **Decidi come il documento suonerebbe in una fuga di dati prima di confrontare qualunque strumento.** Se è contrattuale, regolamentato, sensibile al mercato o di qualcun altro, la conversione deve avvenire sulla tua macchina, e tutto il mercato ospitato è irrilevante finché quello non è deciso — cosa che ti fa risparmiare la lettura di livelli tariffari che non comprerai mai.
2. **Converti un file di prova con il pannello di rete aperto, poi di nuovo con la rete spenta.** Niente che appaia nel pannello e la conversione che continua a funzionare offline è la sola prova positiva disponibile a te; se smette di funzionare offline, il file stava andando da qualche parte, qualunque cosa dicesse la homepage.
3. **Conta gli script di terze parti sulla pagina.** Ognuno gira nell'origine del convertitore con accesso al tuo documento, quindi una pagina con diversi fornitori addosso ha un confine di fiducia più ampio di quanto descriva la sua dichiarazione sulla privacy, e nessuna quantità di elaborazione locale lo restringe.
4. **Trova la frase sulla conservazione e controlla se ha un numero dentro.** Una durata dichiarata è una politica che puoi far valere; una rassicurazione senza durata significa che il periodo è sconosciuto, e un periodo sconosciuto dovrebbe essere trattato come indefinito.
5. **Cerca nei termini una licenza sul contenuto e leggi i suoi quattro qualificatori — scopo, durata, sublicenza, miglioramento.** Una licenza limitata nello scopo che finisce con il tuo contenuto è ordinaria; una perpetua e sublicenziabile è una decisione che forse non puoi prendere per conto di un cliente.
6. **Testa il sanitizzatore con un documento che contiene un tag script e un handler `onerror`.** Se sopravvivono nell'output, il convertitore è sicuro solo quanto il suo input, cosa che va bene per i tuoi file e sbagliata per qualunque cosa arrivata da fuori.
7. **Apri il file esportato in un editor di testo e cercaci `http`.** Ogni URL esterno è una richiesta che il browser di chi lo riceve farà, cosa che riporta indietro che il documento è stato aperto; un'esportazione autonoma non ne ha nessuno e si comporta uguale su un treno e sulla tua scrivania.
8. **Scrivi quale convertitore hai approvato, per quale classe di documento, e quando l'hai controllato l'ultima volta.** Due righe in un documento di squadra prevengono il fallimento comune, che non è scegliere male ma scegliere bene una volta e poi non notare mai più che lo strumento, i termini o il lavoro sono cambiati.

## Conclusione

Sicuro non è qualcosa che un convertitore è; è qualcosa che puoi stabilire su un convertitore in dieci minuti, per un documento particolare, e i controlli sono abbastanza noiosi che scriverli una volta copre un'intera squadra. La parte importante è che la risposta più forte è osservabile piuttosto che promessa: un convertitore che fa il lavoro nel tuo browser non ha nessuna copia del tuo file da tenere, nessuna politica di cui fidarti, e nessuna storia da raccontare se viene violato, e puoi confermare tutte e tre le cose spegnendo la rete e guardandolo continuare a funzionare. È quello che fa [la conversione da Markdown a HTML di TransformPipe](/): da disconnesso, il file viene letto e convertito sulla tua stessa macchina, niente viene caricato, e l'HTML grezzo nel tuo documento passa attraverso un sanitizzatore prima di raggiungere la pagina. Quando il formato ha davvero bisogno di un server, scegli il servizio ospitato in base alla sua frase sulla conservazione e al suo elenco di subprocessor piuttosto che al numero di formati, e quando il lavoro si ripete, installa qualcosa e smetti di farti la domanda ogni settimana. Quello che non dovresti fare è convertire un contratto in una scheda perché la pagina era rapida e il lucchetto era verde.

## FAQ

### È sicuro usare un convertitore online da Markdown a HTML?

Dipende da se il convertitore carica il file, e questo è verificabile piuttosto che una questione di fiducia: apri il pannello di rete del browser, converti un documento di prova, e guarda se qualcosa lascia la macchina. Un convertitore che gira nel tuo browser elabora il file sulla tua stessa macchina e non ha niente da conservare, il che lo rende un predefinito ragionevole per documenti non già pubblici. Un convertitore ospitato va bene per materiale pubblico e per formati che un browser non sa interpretare, a patto che tu abbia letto la sua dichiarazione di conservazione.

### Un convertitore basato sul browser davvero non carica il mio file?

Puoi testarlo invece di crederci. Carica la pagina, disconnettiti dalla rete, e converti: se la conversione funziona ancora, il parser gira in locale, perché non c'era niente a cui inviarlo. Osserva anche il pannello di rete durante una conversione normale, e nota quanti script di terze parti la pagina carica, perché ognuno condivide l'accesso della pagina al tuo documento.

### Per quanto tempo i convertitori online tengono i miei documenti?

I servizi ospitati onesti dichiarano un periodo — eliminato dopo l'elaborazione, eliminato dopo un numero fisso di ore, o tenuto finché non lo elimini — e il periodo è di solito breve. Due dettagli si perdono spesso: una conversione fallita viene tenuta più a lungo di una riuscita così che il supporto possa indagare, e le dichiarazioni di conservazione di solito coprono il file piuttosto che i log, dove vivono nomi file e timestamp. Se non trovi una frase con dentro una durata, tratta il periodo come sconosciuto.

### I convertitori online rivendicano la proprietà dei miei contenuti?

Quasi mai la proprietà, ma la maggior parte dei termini include una licenza, perché un servizio che conserva e restituisce un file ha bisogno del permesso di conservarlo e restituirlo. Leggi quella clausola per quattro qualificatori: se è limitata a fornire il servizio, se finisce quando elimini il tuo contenuto, se può essere sublicenziata, e se si estende al miglioramento del servizio o all'addestramento di modelli. Una licenza limitata nello scopo che scade con il tuo contenuto è ordinaria; una perpetua e sublicenziabile merita un secondo sguardo, specialmente se il documento appartiene a un cliente.

### HTTPS basta per rendere sicuro un convertitore?

No. HTTPS protegge i byte in transito e non dice niente su se dovessero essere stati inviati, cosa ne fa il server, o per quanto li tiene. Non può nemmeno rendere una conversione lato server cifrata end-to-end, perché il server deve leggere il testo in chiaro per convertirlo. Tratta il lucchetto come un requisito minimo piuttosto che come prova di qualcosa.

### Ho già caricato qualcosa di confidenziale. Cosa dovrei fare?

Occupati prima dei contenuti, non della politica. Se il file contenesse un token, una chiave o una password, ruotala subito, perché la conservazione ti dice quando una copia viene eliminata e non chi l'ha letta prima. Poi usa qualunque eliminazione offra il servizio, tieni una nota di cosa è stato caricato e quando nel caso debba essere segnalato, e controlla se il materiale era coperto da un accordo che limita quali terze parti possono elaborarlo.

### Un convertitore offline è sempre più sicuro di uno online?

Non automaticamente. Rimuove il caricamento, la conservazione e la terza parte, e aggiunge un'installazione, un percorso di aggiornamento e una supply chain di pacchetti che gira con l'accesso del tuo utente a ogni file che possiedi. Per lavoro regolamentato, conversione in blocco e pipeline ripetibili è la risposta giusta. Per un singolo file su una macchina su cui preferiresti non installare niente, una conversione lato browser è la modifica più piccola.
