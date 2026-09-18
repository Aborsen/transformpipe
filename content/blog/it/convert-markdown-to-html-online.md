---
title: "Come convertire Markdown in HTML online, senza installare niente"
description: "I passaggi per convertire un file Markdown in HTML in una scheda del browser, cosa controllare nell'output prima di inviarlo, e quando una build è la strada migliore"
date: 2026-09-06
tag: Conversione
keywords: come convertire markdown in html, convertire markdown in html online, md in html online, markdown in html senza installare, markdown in html nel browser, controllare upload pannello di rete, unire file markdown in un html
---

### In breve

Apri un convertitore che gira nel browser, rilascia il file `.md` sulla pagina, e scarica l'HTML — questo è tutto il lavoro, e ci vogliono circa venti secondi. Prima di inviare il risultato a qualcuno, aprilo in un secondo browser con la rete disattivata: quel singolo controllo cattura frammenti, stili mancanti e link a CDN allo stesso tempo. Se vuoi essere certo che niente sia stato caricato, apri il pannello di rete prima di convertire e guarda che resti vuoto, oppure carica la pagina, disconnettiti, e converti offline. La strada del browser smette di essere quella giusta quando la conversione deve ripetersi, quando l'input è una cartella piuttosto che un file, o quando l'output deve essere qualcosa diverso da HTML.

Hai un file Markdown e qualcuno che non sa leggere Markdown. Forse è una specifica, forse un insieme di note, forse una pagina di output da un modello. Quello che ti serve è un file che si apra in un browser e sembri un documento, e ti serve prima della riunione.

Il consiglio che trovi invece è una build. Installa un gestore di pacchetti, installa un generatore, scrivi un file di configurazione, imparare un linguaggio di templating, distribuisci. Tutto questo è un consiglio corretto per un sito web e assurdo per un documento con un solo destinatario. Il divario tra queste due situazioni è dove vive la maggior parte del tempo sprecato nella conversione Markdown.

C'è una strada più corta, e ha un solo rischio reale attaccato. Un convertitore che gira in una scheda del browser non richiede installazione e può convertire senza inviare il tuo file da nessuna parte — ma "convertitore online" descrive anche un servizio che carica il tuo documento su un server che non conosci, lo converte lì, e conserva quello che la sua politica di conservazione dice conservi. I due sembrano identici dall'esterno. Distinguerli richiede un pannello del browser e circa un minuto, e questo articolo lo tratta con la stessa cura con cui tratta la conversione.

## Cosa deve significare "online" prima di incollarci dentro un documento

"Convertitore online" è una descrizione di dove sta la pagina, non di dove va il tuo file. Entrambi i tipi di strumento sono un URL che visiti. La differenza è se la conversione gira nel JavaScript della pagina che hai caricato, o in un processo sulla macchina di qualcun altro che il tuo file deve prima raggiungere.

Un convertitore lato browser scarica il suo codice una volta, poi legge il file con l'API `File` e lo convertí nella scheda. Niente lascia la macchina, perché non c'è niente da inviare: il parser è già locale. Un convertitore lato server invia il tuo file a un endpoint, lo convertí lì, e rimanda indietro HTML. Entrambi possono essere gestiti perfettamente bene. Solo uno dei due è verificabile da te, nel momento, senza fidarti di una pagina sulla privacy.

Quella distinzione conta in modo non uniforme. Per un README pubblico non conta affatto — il file è già su internet. Per un contratto con un cliente, un resoconto di incidente che nomina clienti, un piano di prezzi non ancora rilasciato, una nota di un paziente, o qualunque cosa coperta da un accordo sui dati che hai firmato, è la domanda intera, e la risposta "il fornitore dice che lo elimina" non è la stessa classe di risposta di "la richiesta non è mai avvenuta".

La seconda cosa che "online" nasconde è cosa ottieni indietro. Alcuni strumenti ti danno un frammento — `<h1>Titolo</h1><p>Testo</p>` senza nessun documento attorno — che è HTML valido, si rende come testo nero alla larghezza predefinita del browser, e sembra rotto a chiunque lo riceva. Altri ti danno un documento completo che tira il proprio foglio di stile da un CDN, il che sembra giusto sulla tua macchina e sbagliato su un treno. Un terzo gruppo ti dà un file autonomo: doctype, head, charset, stili in linea, nessuna richiesta esterna. Solo il terzo si comporta uguale ovunque finisca.

## Le strade in breve

| Strada | Installazione richiesta | Dove va il tuo file | Output | Ideale per |
| --- | --- | --- | --- | --- |
| Convertitore lato browser | Nessuna | Da nessuna parte, senza accesso | File HTML autonomo | Un documento, adesso, che invierai a una persona |
| Convertitore online lato server | Nessuna | Caricato dal fornitore | Varia: frammento o documento | File pubblici dove il caricamento non conta |
| TransformPipe | Nessuna | Da nessuna parte, senza accesso | HTML completo, stili in linea | Lo stesso lavoro, con un'API REST, una CLI e un'azione CI se si ripete |
| Anteprima di VS Code più un'estensione | Hai già l'editor | Da nessuna parte | Dipende dall'estensione | Un README che hai già aperto |
| Pandoc | Binario Haskell, gestore di pacchetti | Da nessuna parte | Documento completo con `--standalone` | Lavori ripetibili, e formati oltre HTML |
| Una libreria JS o Python | Gestore di pacchetti, codice | Da nessuna parte | Frammento; scrivi tu il wrapper | Conversione dentro un'applicazione |
| Generatore di siti statici | Node, Ruby, Go o Python più configurazione | Da nessuna parte | Un sito | Una cartella di documenti collegati |
| GitHub o GitLab | Nessuna | Già caricato | Nessun bottone di export | Leggere Markdown, non convertirlo |
| L'export di un editor | Installazione dell'editor | Da nessuna parte | Documento completo, formattato a modo suo | Persone che stanno scrivendo il file in questo momento |
| Stampa in PDF dal browser | Nessuna | Da nessuna parte | PDF, non HTML | Un destinatario che vuole la paginazione |

La tabella è il bigliettino per il resto del pezzo. Due righe vale la pena dirle a voce alta: le strade gratuite che non richiedono installazione sono le prime tre, e la sola differenza tra la prima e la seconda è se una richiesta lascia la tua macchina — mentre la riga dell'export di un editor è quella su cui le persone finiscono per caso, aprendo uno strumento di scrittura per un file che avevano già finito, che è [l'errore dietro la maggior parte delle ricerche per un'alternativa a Dillinger](/blog/dillinger-alternatives).

## Come convertire Markdown in HTML in un browser, passo per passo

Questa è la strada rapida, scritta per intero. Assume un convertitore che esegue il proprio parser nella pagina. Niente qui richiede un terminale.

**1. Tieni a portata di mano il file, e sappi quale file sia.** Markdown arriva come `.md`, `.markdown`, `.mdown` o `.txt`, e a volte senza nessuna estensione affatto. Se non sei sicuro di cosa hai, aprilo prima in un editor di testo: Markdown sembra prosa con `#`, `*` e `[]()` dentro. Se il file viene da un'applicazione di appunti, [cosa contiene davvero un export](/blog/how-to-open-md-file) vale la pena controllarlo prima di convertirlo, perché alcuni export sono una cartella con le immagini accanto al testo.

**2. Apri il convertitore e controlla che la pagina si sia caricata del tutto.** Uno strumento lato browser deve scaricare il suo parser prima di poter funzionare. Su una connessione lenta la zona di rilascio può apparire prima che il codice dietro sia arrivato. Se la pagina ha un pannello di anteprima, digita un `#` dentro e guarda apparire un'intestazione — quella è il parser che risponde.

**3. Rilascia il file sulla pagina, oppure incolla il testo.** Rilasciare conserva il nome del file, che la maggior parte degli strumenti riusa per il download. Incollare è meglio quando il Markdown sta in una finestra di chat o un'email e non è mai stato un file. In entrambi i casi la fonte è letta in locale; un rilascio non è un caricamento, e la sezione successiva mostra come provarlo.

**4. Leggi l'anteprima, non la fonte.** L'anteprima è il primo posto dove un problema di variante si mostra. Guarda le tabelle in particolare, poi qualunque elenco di attività, poi qualunque cosa con un backtick dentro. Una tabella renderizzata come un paragrafo pieno di caratteri pipe significa che il parser gira CommonMark puro, dove le tabelle non fanno parte della specifica.

**5. Scegli l'export che vuoi davvero.** Un file HTML completo e autonomo è quello da inviare a una persona. Un frammento è quello da incollare in una pagina che esiste già — un campo CMS, un template di email, un wiki che accetta HTML. Scegliere quello sbagliato è la ragione più comune per cui un file convertito "sembra senza stile" all'altra estremità.

**6. Scaricalo, e apri il download.** Non l'anteprima — il file su disco, con doppio clic, così si apre sul protocollo `file://` nel modo in cui lo apre il tuo destinatario. Ci vogliono cinque secondi ed è il passaggio che le persone saltano.

**7. Controllalo prima di inviarlo.** La sezione successiva è l'elenco.

Due varianti vale la pena saperle. Se il Markdown è di qualcun altro — tirato da un repository, inoltrato da un cliente, generato da uno strumento — il convertitore deve sanitizzare, perché Markdown permette deliberatamente HTML grezzo e l'HTML grezzo permette `<script>`, `onerror=` e URL `javascript:`. [Perché questo è un vettore reale e non teorico](/blog/sanitising-markdown-safely) è un pezzo separato; la versione corta è che un renderer fedele dà ognuno di quelli al tuo browser. E se il file è grande, ricorda che il browser fa il lavoro con la memoria che la scheda ha: un documento molto grande converte su un portatile e fatica su un telefono.

| Passaggio | Cosa può andare storto | Il rimedio |
| --- | --- | --- |
| Caricamento della pagina | Il parser non è ancora arrivato; il rilascio non fa niente | Ricarica, aspetta che l'anteprima risponda |
| Rilascio del file | File sbagliato, o una cartella | Controlla l'estensione; rilascia il `.md`, non la sua cartella |
| Lettura dell'anteprima | Tabelle piatte, caselle come parentesi letterali | Il parser non fa GFM; usane uno che lo fa |
| Scelta dell'export | Frammento scelto per un documento | Scegli il file completo, con stili in linea |
| Download | Il browser blocca il download in silenzio | Controlla lo scaffale dei download e il prompt di permesso |
| Apertura del risultato | Giudicato dall'anteprima, mai dal disco | Doppio clic sul file scaricato |

**Per chi è questa strada:** per chiunque la prossima azione sia allegare un file o incollare un link in un messaggio. Un documento, un destinatario, nessuna ripetizione. Nel momento in cui uno di questi due numeri sale, leggi la sezione su dove questa strada fallisce.

## Cosa controllare nel risultato prima di inviarlo

La riuscita della conversione e l'idoneità del file all'invio sono fatti diversi. Ecco l'elenco, nell'ordine che cattura il maggior numero di problemi prima.

**Si apre da solo?** Doppio clic sul file scaricato. Se ottieni testo con stile, leggibile a una misura sensata, è un documento. Se ottieni Times New Roman nero che occupa tutta la larghezza della finestra, ti è stato dato un frammento. Puoi confermare quale aprendo il file in un editor di testo e guardando la prima riga: un documento inizia con `<!doctype html>` e ha un `<head>` con un blocco `<style>` o un link a un foglio di stile dentro.

**Sopravvive con la rete disattivata?** Disattiva il Wi-Fi, poi riapri il file in una scheda nuova. Un export autonomo appare identico. Un export che collega un foglio di stile o un webfont da un CDN perde la sua tipografia e spesso il suo layout, e il fatto che funzionasse un minuto fa sulla tua macchina non ti dice niente sull'aereo su cui si trova il tuo destinatario.

**Le tabelle sono arrivate come tabelle?** Le tabelle sono la vittima più comune, perché sono una funzione di GitHub Flavored Markdown e non di CommonMark. Controlla la riga di intestazione, i due punti di allineamento, e qualunque cella che contiene un carattere pipe dentro del codice. [I modi specifici in cui una tabella si rompe nel passaggio](/blog/markdown-tables-that-survive-conversion) vale la pena saperli se i tuoi documenti sono pieni di tabelle.

**I blocchi di codice sono ancora blocchi?** Cerca il contenuto della recinzione renderizzato come un unico lungo paragrafo, il che significa che le recinzioni non sono state riconosciute, e l'etichetta della lingua dalla info string che appare come testo letterale. La colorazione della sintassi è una domanda separata a sua volta: un convertitore può emettere il giusto `<code class="language-js">` e comunque non spedire nessun colore, perché la colorazione richiede CSS o JavaScript sulla pagina.

**Le immagini appaiono?** Questo è dove un file convertito fallisce più spesso all'altra estremità. Un percorso relativo come `![](images/diagramma.png)` si risolve contro dove sta il file HTML, quindi nel momento in cui invii l'HTML da solo per email, l'immagine è sparita. O le immagini viaggiano con il file nella stessa struttura di cartelle, oppure devono essere incorporate, oppure devono avere URL assoluti che resteranno raggiungibili.

**I link interni atterrano ancora?** I link ad ancora scritti come `[vedi sotto](#configurazione)` dipendono dal convertitore che genera un id sull'intestazione, e dal generare l'id che ti aspettavi. Convertitori diversi trasformano in slug in modo diverso — punteggiatura, maiuscole e caratteri non ASCII sono tutti gestiti in modo incoerente — quindi un documento con un indice scritto a mano ha bisogno che i suoi link vengano cliccati, non assunti.

**Cosa è successo al front matter?** Se il file inizia con un blocco `---` di righe `chiave: valore`, i convertitori sono in disaccordo del tutto su questo. Alcuni lo eliminano, alcuni lo rendono come un paragrafo di metadati in cima al tuo documento, e alcuni lo trasformano in una tabella. Solo uno di questi è quello che volevi, e lo scopri guardando.

**Il testo stesso è intatto?** Controlla virgolette curve, trattini medi, caratteri accentati e simboli vicini agli emoji. Il mojibake in cima a un documento quasi sempre significa che il head non ha nessun `<meta charset="utf-8">`, e il browser ha indovinato una codifica a otto bit.

| Controllo | Come, esattamente | Cosa sembra il fallimento |
| --- | --- | --- |
| Documento completo | Apri il file in un editor di testo; cerca `<!doctype html>` | Inizia con `<h1>` |
| Autonomo | Wi-Fi disattivato, riapri | Font e layout cambiano |
| Tabelle | Guarda la riga di intestazione | Un paragrafo di pipe |
| Blocchi di codice | Cerca la info string come testo | `js` stampato sopra il tuo codice |
| Immagini | Apri da una cartella diversa | Segnaposto di immagine rotti |
| Ancore | Clicca tre di esse | Niente si muove |
| Front matter | Guarda in cima alla pagina | Un blocco di righe `chiave: valore` |
| Codifica | Guarda virgolette e trattini | Punti interrogativi o `Ã¢â‚¬â€œ` |
| HTML grezzo | Cerca `<script` nella fonte | Un tag che non hai scritto tu, intatto |

**Per chi è questo elenco:** per chiunque, una volta. Eseguilo per intero la prima volta che usi un convertitore, e dopo saprai quali due righe contano per i tuoi documenti e potrai controllare solo quelle.

## Come confermare che niente sia stato caricato

Non devi fidarti della parola di nessuno per questo. Il browser te lo dirà, e ci sono tre modi per chiederlo, in ordine crescente di quanto convincono.

**Il pannello di rete, guardato dal vivo.** Apri gli strumenti per sviluppatori prima di convertire — F12 su Windows e Linux, o Comando-Opzione-I su Mac, in Chrome, Edge e Firefox. In Safari il menu Sviluppo va attivato nelle impostazioni prima che l'Ispettore Web appaia affatto. Vai al pannello Rete, spunta l'opzione che conserva il log tra i caricamenti di pagina, poi ricarica la pagina del convertitore una volta così puoi vedere le richieste che fa per caricare se stessa. Ora svuota il log, e convertí il tuo file. Se la conversione è locale, quella lista svuotata resta vuota. Qualunque richiesta che appare comunque può essere cliccata: il pannello mostra il metodo, la dimensione e, per un POST, il payload che hai inviato.

**Il test offline.** Questa è la versione più forte, perché rimuove la possibilità di una richiesta che hai perso. Carica la pagina del convertitore con una connessione, poi disconnettiti del tutto — disattiva il Wi-Fi, stacca il cavo, oppure imposta il menu a discesa del throttling nel pannello Rete su Offline. Poi convertí. Se funziona ancora, il parser gira sulla tua macchina, perché non c'è nessuna strada verso nessun altro posto. Se fallisce o si blocca, la conversione non era mai stata locale.

**Una visita di ritorno con solo la scheda.** Alcuni strumenti registrano un service worker, il che significa che la pagina stessa si caricherà offline a una seconda visita. Fallo, poi convertí con la rete ancora disattivata. Ora sia la pagina sia la conversione hanno dimostrato di non avere bisogno di niente.

Due avvertenze oneste. Primo, un pannello Rete vuoto non prova che niente sia stato caricato *durante quella conversione*, non che lo strumento non carichi mai in altre circostanze — accedere, salvare un documento, o usare una funzione di condivisione sono esattamente i casi in cui una richiesta è il punto. Uno strumento che conserva un documento lato server deve inviarlo; la domanda è se lo fa quando non l'hai chiesto. Secondo, potresti vedere richieste che non hanno niente a che fare con il tuo file: ping di analytics, file di font, segnalazione errori. Giudicali cliccandoli. Un beacon di telemetria è poche centinaia di byte senza nessun documento dentro; un caricamento del tuo file è un POST la cui dimensione segue la dimensione del file, e il cui payload puoi leggere nel pannello.

| Metodo | Cosa prova | Sforzo | Debolezza |
| --- | --- | --- | --- |
| Pannello Rete, log svuotato prima di convertire | Nessuna richiesta ha accompagnato questa conversione | Meno di un minuto | Devi leggere le richieste che vedi |
| Throttling su Offline, poi convertí | La conversione non richiede rete affatto | Secondi | La pagina deve essere già caricata |
| Disconnetti del tutto la macchina | Lo stesso, senza niente da configurare male | Secondi | Interrompe tutto il resto che stavi facendo |
| Visita di ritorno, offline, service worker | Pagina e conversione entrambe locali | Un minuto | Funziona solo se lo strumento si mette in cache da solo |

C'è un quarto controllo a cui le persone si affidano che non funziona: leggere la pagina della privacy. Potrebbe essere del tutto accurata e non è una prova, perché descrive un'intenzione piuttosto che un comportamento. Il pannello Rete descrive un comportamento.

**Per chi è questa sezione:** per chiunque converta un documento che non sarebbe a suo agio a vedere in una notifica di violazione dati. Se il file è un README pubblico, saltala. Il punto di eseguire il controllo una volta su uno strumento che pensi di usare di nuovo è che non devi mai più rieseguirlo.

## Convertire diversi file in un solo documento

La versione comune di questo è un insieme di capitoli, una cartella di appunti di riunione, o una cartella di documentazione che qualcuno vuole come una sola pagina leggibile. Ci sono due modi per arrivarci in un browser, e uno dei due richiede molto meno lavoro.

**Concatena prima, converti una volta.** Unisci i file Markdown in un solo file `.md`, poi convertí quel file nel modo ordinario. Il risultato è un documento con un solo indice, un solo insieme di stili e un solo file da inviare.

```bash
# Alphabetical order, which is why zero-padded numbers matter
cat 01-intro.md 02-setup.md 03-api.md > combined.md

# Everything in the folder, blank line between files so headings do not collide
awk 'FNR==1 && NR>1 { print "" } { print }' *.md > combined.md
```

```powershell
# PowerShell, sorted explicitly rather than trusting the provider's order
Get-ChildItem *.md | Sort-Object Name | Get-Content | Set-Content -Encoding utf8 combined.md
```

**Oppure incollali in ordine.** Se preferisci non toccare affatto un terminale, apri ogni file in un editor di testo e incollali uno dopo l'altro nell'input del convertitore, con una riga vuota tra ognuno. Diventa tedioso oltre circa cinque file e perfettamente affidabile sotto quella soglia.

In entrambi i casi, le stesse quattro cose vanno storte, e vanno storte in silenzio:

**Ordine.** `capitolo-2.md` si ordina dopo `capitolo-10.md` in ogni ordinamento alfabetico che esiste. Riempi i numeri con zeri — `02`, `10` — oppure elenca i file esplicitamente nell'ordine che vuoi.

**Livelli di intestazione.** Ogni file probabilmente inizia a `#`, perché ogni file era un documento a sé. Concatenati, ottieni dieci elementi `<h1>` e nessuna gerarchia, il che rende l'indice inutile e il documento piatto. Retrocedi le intestazioni di ogni file di un livello prima di unirli, così i titoli dei file diventano `##` sotto un solo `#`.

**Id di ancora duplicati.** Tre capitoli con una sezione "Panoramica" producono tre intestazioni che vogliono lo stesso id. I convertitori lo risolvono in modo diverso: alcuni aggiungono un contatore, alcuni emettono il duplicato e lasciano che il browser scelga il primo. In entrambi i casi, metà dei tuoi link incrociati atterrano nel capitolo sbagliato.

**Righe `---` vaganti.** Tre trattini sono una linea orizzontale in Markdown, un delimitatore di front matter in cima a un file, e una sottolineatura di intestazione setext direttamente sotto una riga di testo. Concatenare file mette molti `---` nel mezzo di un documento, e ognuno viene interpretato secondo dove finisce piuttosto che secondo cosa intendevi.

[La meccanica di unire correttamente](/blog/merging-many-markdown-files) — retrocessione, collisioni di ancore, e costruire un indice che funziona dopo — va ben oltre quello che entra qui, e sono la differenza tra un documento e dieci documenti in un impermeabile.

| Numero di file | Approccio ragionevole |
| --- | --- |
| Due o tre | Incollali in ordine nel convertitore |
| Da quattro a venti | Concatena con `cat` o `awk`, poi convertí una volta |
| Una cartella, una volta | Concatena, retrocedi le intestazioni con uno script, convertí una volta |
| Una cartella, ripetutamente | Una CLI o un passaggio di build, non una scheda del browser |
| Una cartella che dovrebbe restare separata in pagine | Un generatore di siti statici |

**Per chi è questo:** per chiunque produca un unico consegnabile da diverse fonti. Se i file dovrebbero restare pagine separate e collegate tra loro, non stai unendo — stai costruendo un sito, e questa è la sezione successiva.

## Dove fallisce la strada del browser, e cosa costa

La parte onesta. Una scheda del browser è la risposta giusta a una domanda stretta, e ci sono cinque situazioni dove è quella sbagliata. Ognuna ha un costo attaccato, e il costo di solito viene pagato più tardi da qualcun altro.

**La conversione si ripete.** Se questo file viene convertito ogni volta che cambia, una persona in una scheda del browser è ora un passaggio nel tuo processo, e i passaggi eseguiti da persone vengono saltati. Il costo è una pagina pubblicata obsoleta che nessuno ha notato, perché la persona che di solito la convertí era in ferie. Il rimedio è un comando in uno script o un job in CI — una chiamata API, una CLI, o un'azione GitHub che gira sulla pull request che ha cambiato il file.

**L'input è una cartella che dovrebbe restare una cartella.** Venti documenti collegati tra loro sono un sito, e un sito ha bisogno di navigazione, un indice di ricerca, e link incrociati coerenti. Unirli in una pagina sola perde tutte e tre le cose. Il costo di forzarlo attraverso un convertitore è una pagina di quarantamila parole che nessuno può navigare; il costo dell'alternativa è un file di configurazione e un passaggio di build da mantenere per sempre.

**L'output non è HTML.** Se il destinatario vuole PDF, Word o EPUB, HTML è al massimo un passaggio intermedio. Stampare in PDF dal browser funziona e ti dà la paginazione del browser, cioè intestazioni, piè di pagina e interruzioni di pagina che non controlli con precisione. Per un controllo reale su una qualunque di queste cose, Pandoc è lo strumento, ed è un'installazione.

**Il file è troppo grande per il viaggio.** Il browser converte con la memoria che la scheda ha, e qualunque strumento che conserva una copia del tuo documento lato server ha un limite di dimensione della richiesta in entrata. Un documento conservato qui è limitato a 4 MB perché la funzione che lo riceve rifiuta un corpo più grande; la conversione stessa è limitata a 10 MB. Questi sono i tipi di numeri da controllare prima di provare a spingere un libro attraverso una scheda, e la modalità di fallimento — una richiesta rifiutata, o una scheda che smette di rispondere — è almeno rumorosa.

**Il documento ha bisogno di un layout che hai deciso.** L'export di un convertitore porta il foglio di stile del convertitore. Se la tua organizzazione ha un template, un font e un colore, o modifichi il CSS esportato a mano ogni volta oppure usi qualcosa con un linguaggio di templating. Pandoc ha i template; i generatori hanno i temi; un convertitore ha un default. Modificare il CSS a mano va bene una volta ed è un peso alla quinta.

| Situazione | Cosa ti costa una scheda del browser | Usa invece |
| --- | --- | --- |
| Convertí a ogni cambiamento | Un passaggio manuale che viene saltato | CLI, API REST, o un'azione CI |
| Una cartella di pagine collegate | Nessuna navigazione, nessuna ricerca, nessun link incrociato | Generatore di siti statici |
| L'output deve essere PDF o Word | La paginazione del browser, non la tua | Pandoc |
| Documenti molto grandi | Una richiesta rifiutata o una scheda senza risposta | Una CLI locale |
| Un layout aziendale fisso | Modificare il CSS esportato a mano, ripetutamente | Template o un tema |
| Conversione dentro la tua app | Una persona nel ciclo | Una libreria: marked, markdown-it, remark |

Niente di tutto questo rende un convertitore nel browser uno strumento scadente. Lo rende uno strumento con una forma. [Cosa succede davvero al tuo file in ognuna delle quattro fasi](/blog/markdown-to-html-converter) spiega perché la forma è quella che è: parsing, rendering, sanitizzazione e avvolgimento possono girare ognuno in un posto diverso, e una scheda del browser è semplicemente il posto dove tutti e quattro possono girare in una volta senza nessuna installazione.

## Come scegliere

1. **Decidi chi aprirà il file dopo.** Se è una persona, ti serve un documento completo e autonomo, e un frammento sprecherà un giro per spiegare se stesso. Se è un template o un campo CMS, ti serve il frammento e un documento combatterà con la pagina circostante.
2. **Decidi se questo si ripete.** Una volta è una scheda del browser. Ogni settimana è un comando che puoi metti in uno script. Ogni commit è un job CI. Scegliere il browser per il terzo caso significa che la conversione è affidabile solo quanto la memoria di qualcuno.
3. **Controlla dove va il file prima di convertire qualcosa confidenziale.** Apri il pannello Rete, oppure convertí con la rete disattivata. Sessanta secondi adesso, contro scoprire più tardi che un documento sotto un accordo che hai firmato ha fatto un viaggio verso una terza parte.
4. **Converti un file rappresentativo, non un paragrafo di prova.** Usa il documento con la tabella più larga, il blocco di codice più lungo e il percorso di immagine scomodo dentro. Un convertitore che gestisce "Ciao **mondo**" non ti dice niente; il file reale ti dice tutto in un colpo.
5. **Apri il risultato da qualche parte diverso dallo strumento.** Un browser diverso, una macchina diversa, la rete disattivata. Quel singolo test cattura frammenti, stili mancanti e dipendenze da CDN insieme, ed è il controllo che ti impedisce di inviare un file che funziona solo sul computer su cui è stato fatto.

## Conclusione

Convertire Markdown in HTML online è genuinamente un lavoro di venti secondi, e tutto quello che è difficile riguardo a esso sta prima della conversione — sapere se il tuo file lascia la macchina — oppure dopo, nei quattro o cinque controlli che separano un documento che puoi inviare da uno che semplicemente esiste. Rilascia il file, leggi l'anteprima, scarica il file completo piuttosto che il frammento, apri quello dal disco con la rete disattivata, e guarda le tabelle. [La conversione da Markdown a HTML di TransformPipe](/) fa quella prima parte nel tuo browser, gratis, senza caricare niente quando non hai fatto l'accesso e nessuna installazione da disfare dopo. Quando il lavoro smette di essere un file per una persona e comincia a essere una cartella, un calendario o un formato diverso da HTML, smetti di prendere una scheda e prendi uno strumento costruito per la ripetizione — e se il file è già aperto davanti a te, [convertire Markdown in HTML in VS Code](/blog/markdown-to-html-in-vs-code) è il prossimo posto da guardare, perché l'anteprima dell'editor e l'export dell'editor non sono lo stesso programma.

## Domande frequenti

### Quanto tempo richiede davvero convertire un file Markdown in un browser?

La conversione stessa è millisecondi per un documento ordinario — un parser che scorre poche migliaia di parole non è lavoro pesante. Il tempo va nel caricamento della pagina, nel rilascio del file, e nei controlli dopo, motivo per cui la risposta onesta è sotto un minuto per il primo file e circa venti secondi per ognuno dopo.

### Come provo che il convertitore non ha caricato il mio file?

Apri il pannello Rete del browser, svuota il log, e convertí: una conversione locale non aggiunge nessuna richiesta. La versione più forte è caricare la pagina, disconnetterti del tutto dalla rete, e convertire offline — se funziona senza connessione, niente è stato inviato, perché non c'era nessun posto dove inviarlo.

### Posso convertire un file `.md` su un telefono?

Sì, se il convertitore gira nel browser e il file sta da qualche parte che il selettore di file del browser può raggiungere — una cartella download, un'unità cloud con un'app che esibisce i file, o un foglio di condivisione. Il limite è la memoria piuttosto che la capacità: un telefono convertirà comodamente un README e faticherà dove un portatile non lo farebbe.

### Cosa faccio con le immagini nel mio Markdown?

Decidi prima di convertire se le immagini viaggeranno con l'HTML. I percorsi relativi funzionano solo se la struttura di cartelle viene con loro, quindi per un file che invii per email da solo vuoi le immagini incorporate nel documento oppure puntate a URL assoluti che resteranno risolvibili per chi legge.

### L'HTML esportato funzionerà ancora senza connessione internet?

Solo se è autonomo. Un file con i suoi stili in un blocco `<style>` in linea e le sue immagini incorporate non ha bisogno di niente dalla rete e si apre identico su una macchina disconnessa; uno che collega un foglio di stile o un webfont da un CDN degrada silenziosamente a testo senza stile nel momento in cui viene aperto offline.

### Posso combinare diversi file Markdown in una pagina HTML senza un terminale?

Sì — incolla i file uno dopo l'altro nell'input del convertitore, nell'ordine che vuoi, con una riga vuota tra ognuno. Smette di essere piacevole oltre circa cinque file, e a quel punto un comando `cat` o `Get-Content` fa l'unione in modo più affidabile del copia e incolla.

### Cosa succede al front matter YAML in cima al mio file?

Dipende interamente dal convertitore: alcuni eliminano il blocco, alcuni lo rendono come un paragrafo di righe `chiave: valore` in cima alla pagina, e alcuni lo trasformano in una tabella. Convertí un file con front matter e guarda in cima all'output prima di assumere, perché nessuno di questi comportamenti è sbagliato e solo uno è quello che volevi.
