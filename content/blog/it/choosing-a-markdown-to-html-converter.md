---
title: "Come giudicare un convertitore Markdown in cinque minuti"
description: Scrivi cosa richiede la tua situazione, poi fai passare un documento di test scomodo attraverso i candidati. Sette controlli e una scheda di punteggio da copiare.
updated: 2026-09-09
date: 2026-06-23
tag: Conversione
keywords: miglior convertitore markdown html, confronto convertitori markdown, editor markdown online, strumento markdown gratis, convertitore markdown senza registrazione, convertitore markdown con api, convertitore markdown open source, come scegliere un convertitore markdown, requisiti convertitore markdown, testare un convertitore markdown
---

Le landing page dei convertitori promettono più o meno le stesse cose: veloce, gratis, HTML pulito. Niente di tutto questo si verifica dalla pagina, e le differenze che ti costano un pomeriggio restano invisibili finché non incolli qualcosa. Quindi incolla qualcosa. Un documento e cinque controlli separano gli strumenti che tengono da quelli che ti sorprendono una settimana dopo.

### In breve

Scrivi cosa richiede la tua situazione prima di aprire un solo strumento: un documento che stai mandando a una persona, un sito di documentazione, input utente renderizzato dentro un'applicazione, un passaggio CI e un archivio di lungo termine vogliono cose diverse, e lo strumento giusto per uno è sbagliato per il successivo. Poi fai passare uno stesso documento di test deliberatamente scomodo attraverso ogni candidato nella stessa sessione, e leggi la fonte HTML piuttosto che l'anteprima. Cinque controlli — quale variante parla, cosa fa con un tag script, se il file sta in piedi da solo, dove è andato il tuo file, e cosa dicono davvero l'API e i limiti — risolvono la maggior parte della questione in circa cinque minuti. Altri due, la stampa e gli id delle intestazioni, richiedono trenta secondi ciascuno e intercettano i reclami che arrivano un mese dopo.

Il motivo per cui gli elenchi di funzioni non aiutano è che l'elenco di ogni convertitore è lo stesso elenco. Tabelle, evidenziazione del codice, anteprima live, esportazione. Quello che li separa è il comportamento sotto pressione: un file che contiene qualcosa che il parser non ha mai visto, un file che ha scritto qualcun altro, un file che deve aprirsi su una macchina senza rete. Niente di questo è sulla pagina, e niente di questo è costoso da scoprire.

Questo articolo parla dei criteri e del testing. Se quello che vuoi sono gli strumenti stessi messi uno di fronte all'altro, [il confronto è un articolo separato](/blog/best-markdown-to-html-converters); quello che segue è il metodo che useresti per controllare qualunque cosa in quella lista, incluse quelle aggiunte dopo che è stata scritta.

## Prima i requisiti: cosa richiede davvero la tua situazione

L'errore più comune non è scegliere lo strumento sbagliato. È scegliere uno strumento prima di decidere cosa deve essere vero. Cinque situazioni coprono quasi tutto quello per cui la gente converte Markdown, e ognuna richiede qualcosa che le altre possono ignorare del tutto.

| La situazione | Cosa devi richiedere | Cosa puoi ignorare senza rischi | Il controllo che risolve la questione |
| --- | --- | --- | --- |
| Un documento da mandare a una persona | Un file HTML completo con stili incorporati e immagini incorporate, nessuna richiesta esterna, e la variante che il tuo file usa già | Sanificazione, dato che hai scritto tu il file; un'API; conversione in lotto; ancore delle intestazioni | Scaricalo, spegni la rete, apri su una macchina diversa |
| Un sito di documentazione | Id delle intestazioni stabili, una variante che corrisponde a quello che scrivono i tuoi autori, una build che gira senza supervisione e fallisce rumorosamente | Output autonomo — il sito ha il proprio foglio di stile — e privacy della fonte, che è pubblica comunque | Compila due volte dallo stesso input e confronta i due output HTML |
| Renderizzare input utente dentro un'applicazione | Un sanificatore con un'allow-list, applicato dove l'utente non può arrivare, e un default documentato per l'HTML grezzo | Documenti autonomi, stile di stampa, pulsanti di scaricamento, temi | Incolla i cinque vettori d'attacco sotto e ispeziona il DOM renderizzato |
| Un passaggio CI | Nessuna installazione, o un'installazione bloccata a una versione; un codice di uscita che significa qualcosa; limiti di frequenza pubblicati; un corpo d'errore analizzabile da uno script | Un'interfaccia utente, cronologia, condivisione, comodità dell'editor | Alimentalo con un file malformato e leggi il codice di uscita e lo stderr |
| Un archivio da apri tra dieci anni | Un file per documento, nessun asset esterno, un formato aperto, e una licenza che ti lascia continuare a far girare lo strumento | Un'API, condivisione, velocità, sincronizzazione cloud | Apri oggi l'esportazione dell'anno scorso, offline, in un browser che allora non usavi |

Leggi la seconda colonna e la terza e il conflitto è ovvio. Lo strumento che vince la prima riga — un convertitore che incorpora tutto in un unico file pesante — è poco adatto alla seconda, dove incorporare lo stesso foglio di stile in quattrocento pagine è uno spreco. Lo strumento che vince la terza riga è una libreria, non un sito web, e non ha nessun pulsante di esportazione perché non è mai stato pensato per darti un file.

Quindi i primi cinque minuti non si spendono su uno strumento. Si spendono scrivendo tre righe: cosa deve essere l'output, chi ha scritto l'input, e dove deve girare la conversione. Tutto quello che viene dopo è verifica.

C'è un'altra distinzione che vale la pena fare prima di cominciare. Un convertitore trasforma un documento in un documento. Un generatore trasforma una directory in un sito. Se la tua risposta a “dove va l'output” è un URL con navigazione, ricerca e link incrociati, stai facendo shopping nella categoria sbagliata, e nessuna quantità di test dei convertitori lo risolverà.

## Il documento di test

Questo è deliberatamente scomodo. Porta GitHub Flavored Markdown che il CommonMark puro non riconosce, cinque modi separati di far entrare uno script in una pagina, un'immagine che non c'è, e una manciata di costrutti che separano silenziosamente un parser attento da uno trascurato.

````markdown
---
title: Converter test
draft: true
---

# Converter test

| Feature    | Status | Notes    |
| ---------- | :----: | -------- |
| Tables     |   ok   | GFM only |
| Task lists |   ok   | GFM only |

- [x] Ticked box
- [ ] Empty box
  - Nested item
    continued on a lazy line

~~Struck through~~, and a bare URL: https://example.com

A line that ends in two spaces,  
and the line that follows it.

A footnote reference.[^1]

[^1]: The footnote body.

```js
const clean = sanitise(rendered);
```

## A heading with punctuation & a "quote"

<script>alert('script tag')</script>

[A link](javascript:alert('href'))

<img src=x onerror="alert('handler')">

<iframe src="https://example.com"></iframe>

<svg onload="alert('svg')"><circle r="10" /></svg>

![Broken image](does-not-exist.png)

Unicode: an em dash — and a ligature: ﬁ
````

Incollalo, converti, e leggi il risultato — poi leggi la fonte HTML, non solo l'anteprima. Un'anteprima può sembrare giusta mentre il file dietro è un disastro, perché l'anteprima è renderizzata dalla pagina propria dello strumento, con il foglio di stile proprio dello strumento, in un browser che ha già caricato qualunque cosa lo strumento carichi.

Ogni riga di quel documento c'è per un motivo. Questo è cosa chiede ciascuna, e come appare un successo.

| La riga | Cosa sonda | Un successo appare così |
| --- | --- | --- |
| Il blocco `---` in cima | Gestione del front matter | Scompare, o diventa una tabella. Un paragrafo di righe `chiave: valore` in cima al documento è un fallimento |
| `# Converter test` | Se lo strumento presume un titolo | Un `<h1>`, oppure il titolo portato dentro `<title>`. Entrambi sono defendibili; scartarlo silenziosamente non lo è |
| La tabella a pipe | Tabelle GFM | Una vera `<table>` con celle `<th>` e la colonna centrale allineata |
| `- [x]` e `- [ ]` | Elenchi di attività GFM | `<input type="checkbox" disabled>` dentro gli elementi di elenco, non parentesi letterali |
| L'elemento annidato con continuazione pigra | Analisi degli elenchi sotto pressione | Un `<li>` annidato il cui testo continua. Due elementi di elenco separati è un fallimento |
| `~~Struck through~~` | Testo barrato GFM | Un elemento `<del>` o `<s>`, non tilde visibili |
| L'URL nudo | Autolink GFM | Un `<a href>`. Testo semplice è comportamento CommonMark, non un bug |
| Due spazi finali | Ritorni a capo obbligati | Un `<br>` fra le due righe |
| `[^1]` e il suo corpo | Note, che non sono in nessuna delle due specifiche | Un link in apice e un elenco a piè di pagina, oppure il `[^1]` grezzo lasciato visibile. La rimozione silenziosa perde il tuo testo |
| Il fence `js` | Codice recintato e stringhe informative | `<pre><code class="language-js">`, con il codice escapato |
| L'intestazione con `&` e virgolette | Escaping, e id delle intestazioni | `&amp;` nell'output, e idealmente un `id` collegabile |
| `<script>` | Passaggio dell'HTML grezzo | Escapato, o rimosso. Presente e intatto è un fallimento |
| L'href `javascript:` | Filtraggio dello schema URL | L'`href` sparito, o riscritto. Un link `javascript:` vivo è un fallimento |
| `onerror=` su un'immagine | Filtraggio degli attributi | L'attributo rimosso. L'immagine può restare; il gestore no |
| `<iframe>` | Documenti incorporati | Rimosso, o escapato. Un iframe in un documento che mandi per email è la pagina di qualcun altro dentro la tua |
| `<svg onload>` | Il vettore che si dimentica | L'elemento rimosso o il gestore tolto. SVG è marcatura, e la marcatura porta gestori |
| L'immagine rotta | Gestione dei percorsi | Il `src` copiato com'è scritto, o il file incorporato. Entrambi vanno bene purché tu sappia quale |
| L'em dash e la legatura | Codifica | Entrambi i caratteri intatti, con un `<meta charset>` nel head. Mojibake qui significa mojibake ovunque |

Diciotto righe, un incolla. Tieni il file: è corto, appartiene accanto alla tua documentazione, e riprovarlo richiede un minuto quando uno strumento cambia il proprio sanificatore o il proprio foglio di stile.

## Primo controllo: quale variante parla

Guarda prima la tabella e le due caselle. Se la tabella è venuta fuori come un paragrafo di caratteri pipe e le caselle come parentesi quadre letterali, il convertitore gira su CommonMark puro o qualcosa vicino. Non è un bug: tabelle ed elenchi di attività sono estensioni di GitHub Flavored Markdown, e [le varianti differiscono davvero](/blog/commonmark-gfm-and-the-flavours) in quello che riconoscono.

Conta solo se i tuoi documenti usano quelle funzioni. Un README con una tabella di confronto e una checklist di roadmap usa entrambe. Anche il testo barrato e l'URL nudo sono estensioni GFM, quindi controlla tutte e quattro in un unico passaggio.

Questi sono i costrutti che separano i due dialetti, e come appare ciascun fallimento sulla pagina piuttosto che nella specifica.

| Costrutto | Scritto come | CommonMark | GFM | Cosa vedi quando manca |
| --- | --- | --- | --- | --- |
| Tabelle | Pipe e una riga delimitatrice | No | Sì | Un paragrafo di pipe e trattini, avvolto dal browser |
| Elenchi di attività | `- [x]` all'inizio di un elemento | No | Sì | `[x]` e `[ ]` letterali come primi caratteri di ogni punto |
| Testo barrato | `~~testo~~` | No | Sì | Tilde visibili attorno alle parole |
| Autolink | Un URL nudo `https://` | No | Sì | L'URL come testo semplice, non cliccabile |
| Codice recintato | Triple backtick | Sì | Sì | Niente — entrambi lo gestiscono |
| Stringhe informative | Un nome di linguaggio dopo il fence | Sì | Sì | La classe può differire; controlla `language-js` |
| Note | `[^1]` e una definizione | No | No | `[^1]` grezzo nel testo, o un paragrafo silenziosamente mancante |
| Id delle intestazioni | Niente — sono inferiti | No | Aggiunti dal renderer, non dal parser | Intestazioni senza `id`, e quindi senza ancora |
| HTML grezzo | Un tag HTML nella fonte | Passato | Passato, filtrato da GitHub | Dipende interamente dallo strumento; vedi il controllo successivo |
| Ritorni a capo | Due spazi finali | Sì | Sì | Le due righe si uniscono se lo strumento fa il trim degli spazi prima |

Da quella tabella emergono due cose. Le note non sono in nessuna delle due specifiche, quindi qualunque strumento che le supporta lo fa come estensione, e qualunque strumento che non le supporta può scartare il testo invece di lasciare il marcatore — controlla il riferimento e il corpo separatamente. E gli id delle intestazioni non sono affatto una funzione di parsing: GitHub li aggiunge quando renderizza, motivo per cui un'ancora di intestazione che funziona su github.com può semplicemente non esistere nell'HTML che produce il tuo convertitore.

Se i tuoi documenti vivono su GitHub e si renderizzano correttamente lì, GFM è il tuo requisito e uno strumento solo-CommonMark perderà quattro cose silenziosamente. Se i tuoi documenti sono prosa con intestazioni e link, il CommonMark puro basta e la domanda sulla variante si risolve in dieci secondi.

## Secondo controllo: cosa fa con il tag script

Markdown permette HTML grezzo, e la maggior parte dei parser lo passa direttamente all'output; alcuni lo escapano di default e lo lasciano passare solo se richiesto. In entrambi i casi, sanificare è una decisione separata che lo strumento ha preso, con tre possibili risultati.

| Risultato nella fonte HTML | Cosa significa |
| --- | --- |
| `&lt;script&gt;` e il tag visibile nella pagina | L'HTML grezzo è escapato. Sicuro, e adatto ai tuoi file |
| Nessuna traccia dello script, di `onerror`, o dell'href `javascript:` | È girato un sanificatore contro un'allow-list |
| `<script>` intatto, o `onerror=` ancora sull'immagine | Niente l'ha filtrato |

Il terzo risultato morde solo quando il Markdown viene da qualche parte diversa dalla tua macchina — la descrizione di una pull request, un ticket di supporto, l'output di un modello linguistico. Nel test l'alert è innocuo; con il Markdown di uno straniero non lo è, e gira su qualunque pagina in cui incolli il risultato.

Non fermarti a testare un solo vettore. Uno strumento può rimuovere `<script>` e perdere tutto il resto, perché rimuovere un tag per nome è facile e ragionare su attributi e schemi URL non lo è. Cerca nell'output ciascuno di questi, uno per uno.

| Vettore | Cosa fa se sopravvive | Cosa restituisce uno strumento sicuro |
| --- | --- | --- |
| `<script>alert('script tag')</script>` | Esegue codice arbitrario nel momento in cui la pagina si carica | L'elemento sparito del tutto, o l'intera cosa escapata in testo `&lt;script&gt;` |
| `<img src=x onerror="alert('handler')">` | Esegue codice quando l'immagine deliberatamente rotta non si carica, cosa che avviene immediatamente | L'`<img>` può restare; `onerror` è tolto da esso. Qualunque attributo `on*` è un gestore |
| `[A link](javascript:alert('href'))` | Esegue codice quando il lettore clicca qualcosa che sembra un link normale | L'`href` rimosso, svuotato o riscritto. Gli schemi in allow-list sono di solito `http`, `https`, `mailto` e `#` |
| `<iframe src="https://example.com"></iframe>` | Carica la pagina di terzi dentro la tua, con i loro script e i loro cookie | L'elemento rimosso. Un iframe è raramente qualcosa di cui un documento Markdown ha bisogno |
| `<svg onload="alert('svg')">…</svg>` | Esegue codice tramite marcatura che la gente si dimentica essere marcatura. SVG può anche portare il proprio `<script>` | L'elemento rimosso, o il gestore e qualunque script annidato tolti da esso |

Uno strumento che rimuove tutti e cinque gira un'allow-list: conserva gli elementi e gli attributi che conosce e scarta tutto il resto. Uno strumento che ne rimuove alcuni e non altri gira una deny-list, che è una posizione perdente — la lista delle cose pericolose cresce e quella delle cose sicure no. [I dettagli per farlo bene](/blog/sanitising-markdown-safely) contano anche se non scrivi mai un sanificatore tu stesso, perché ti dicono quale dei due hai davanti.

Un'altra cosa da controllare mentre ci sei: dove avviene la sanificazione. Un convertitore che sanifica nel browser e non sul server ha protetto solo la propria anteprima e niente altro, perché uno script può mandare direttamente all'endpoint e saltare la pagina. Se lo strumento ha un'API, fai passare gli stessi vettori attraverso di essa e confronta i due output.

## Terzo controllo: se l'output sta in piedi da solo

Scarica il file, spegni la rete, e apri. Poi cerca nella fonte `<link`, `<script` e `http`.

Un frammento nudo ti dà `<h1>` e `<p>` e niente altro: HTML corretto, si apre come testo senza stile. Un documento completo che tira il proprio foglio di stile o il proprio evidenziatore da un CDN sembra giusto oggi e si rompe su un aereo, su un'intranet, o quando il CDN si sposta. Un file autonomo ha i suoi stili incorporati, nessuno script e nessuna richiesta. È quello che puoi mandare per email a qualcuno.

Le ricerche vale la pena farle una alla volta, perché ognuna risponde a una domanda diversa.

| Cerca nella fonte | Se lo trovi | Cosa ti costa |
| --- | --- | --- |
| `<!DOCTYPE` | Bene — questo è un documento, non un frammento | Senza, hai `<h1>…</h1><p>…</p>` e un browser che renderizza alla sua larghezza predefinita |
| `<meta charset` | Bene — la codifica è dichiarata | Senza, l'em dash e la legatura diventano mojibake sulla macchina di qualcun altro |
| `<link rel="stylesheet"` | Gli stili vivono altrove | Il file è senza stile nel momento in cui quell'altrove non è raggiungibile |
| `<style>` | Bene — gli stili sono nel file | Niente; è questo che vuoi per un documento che mandi |
| `<script` | Qualcosa vuole eseguirsi | Nel migliore dei casi un evidenziatore, nel peggiore un tracker. In ogni caso il file non è più inerte |
| `http://` o `https://` in un `src` o `href` | Un asset viene recuperato quando il file si apre | Font, immagini ed evidenziatori che svaniscono offline, e una traccia del file che è stato aperto |
| `data:image` | Un'immagine è incorporata nel file | Un file più grande, e uno che si apre ovunque. Di solito è lo scambio che vuoi |

[Cosa significa davvero “autonomo”](/blog/self-contained-html-explained) vale la pena leggerlo prima di richiederlo, perché gli strumenti usano la frase in modo vago: alcuni intendono “un documento completo” e altri “non chiede niente alla rete”, e solo il secondo sopravvive all'aereo.

L'immagine mancante è nel test per lo stesso motivo. Un convertitore copia un `src` di immagine com'è scritto a meno che tu non gli chieda di incorporare il file, quindi un percorso relativo si risolve contro il posto dove finisce l'HTML, non dove viveva il Markdown. Sposta l'HTML una directory più in alto e ogni immagine relativa si rompe — senza un errore, senza un avviso, e di solito senza che nessuno se ne accorga finché il destinatario non lo menziona.

## Quarto controllo: dove va il tuo file, e se resta lì

Apri la scheda di rete del browser prima di convertire. Il file viene caricato oppure no, e la lista delle richieste risolve la questione. Convertire nel browser significa che il documento non lascia mai la tua macchina; significa anche che non c'è niente a cui tornare domani.

Questo è il controllo che vale più la pena fare invece di fidarsi, perché è quello su cui ogni strumento fa la stessa affermazione. Quattro passaggi, in ordine, nessuno più lungo di un minuto.

1. **Guarda la scheda di rete.** Aprila, svuotala, converti il documento di test, e leggi la lista. Una conversione che avviene sulla tua macchina non mostra nessuna richiesta che porta il tuo file. Una conversione che carica mostra un `POST` con il tuo contenuto dentro, e puoi apri quella richiesta e leggere esattamente cosa è stato mandato.
2. **Converti con la rete spenta.** Carica la pagina, poi disconnettiti, poi converti. Uno strumento lato browser continua a funzionare. Uno lato server fallisce, il che non è una critica — è una risposta, e una definitiva.
3. **Trova la frase sulla conservazione.** Non la riga di marketing sulla privacy: la frase che dice per quanto tempo un file caricato viene conservato e cosa lo elimina. Se la politica sulla privacy non contiene nessuna durata, la lettura onesta è che non c'è nessuna politica.
4. **Leggi i termini per la clausola sulla licenza.** Molti strumenti ospitati prendono una licenza per conservare ed elaborare quello che carichi, di cui hanno bisogno per funzionare affatto. Quello che conta è l'ambito: se finisce quando elimini il file, e se si estende oltre il far girare il servizio.

[Se un convertitore online è sicuro](/blog/is-an-online-converter-safe) ha una risposta concreta per qualunque strumento dato, e di solito è visibile in quindici minuti di lettura più i due test sopra.

Questo è il vero compromesso, non privacy contro comodità. Uno strumento senza account non può tenere una cronologia, non può darti un link da mandare a qualcuno, e non può offrire un'API. Uno strumento con account fa tutte e tre le cose e adesso tiene i tuoi documenti. Se la risposta è “nessuno dei due, lo voglio in uno script”, smetti di valutare siti web e usa una libreria o un convertitore da riga di comando; e se ti servono PDF, DOCX o LaTeX in uscita, Pandoc converte in tutti e tre ed è software libero sotto GPL (verificato su pandoc.org, il 9 settembre 2026); un convertitore da browser che ti dà un file HTML non è in competizione per quel lavoro.

C'è una posizione intermedia che vale la pena conoscere: uno strumento che converte nel browser mentre sei disconnesso e conserva documenti solo quando glielo chiedi. Ti dà la risposta della scheda di rete di default, e cronologia e condivisione quando decidi che lo scambio vale la pena. Il punto è che la decisione è tua ed è visibile, invece di essere presa per te in un paragrafo che non hai letto.

## Quinto controllo: l'API, le chiavi e i limiti

Se un convertitore offre un'API, quattro domande risolvono la questione, e la documentazione dovrebbe rispondere a tutte e quattro prima che ti registri:

- [ ] Una chiave si può revocare, e la revoca ha effetto immediato?
- [ ] La chiave è conservata con hash, o potrebbe leggertela di nuovo l'assistenza?
- [ ] Qual è il limite di frequenza, e come appare la risposta quando lo superi?
- [ ] Cosa succede quando l'account è pieno — una scrittura rifiutata, o l'eliminazione silenziosa di qualcosa più vecchio?

L'ultima è quella che la gente salta. Uno strumento che elimina il tuo documento più vecchio per fare spazio a quello nuovo ha deciso qualcosa sui tuoi dati, e lo scopri nel momento peggiore. Rifiutare la scrittura è il comportamento onesto.

Prima di tutto questo, guarda la forma della richiesta. Un'API su cui puoi costruire è una che puoi chiamare con `curl` e capire dalla sola risposta, senza un SDK che traduca per te.

```bash
# The shape to look for: one endpoint, a bearer key, the document as the body
curl -sS -X POST "https://api.example.com/v1/documents?name=README.md" \
     -H "Authorization: Bearer <key>" \
     --data-binary @README.md

# And the refusal you can act on: a status that means something, and a body a script can parse
# HTTP/1.1 413
# { "error": "document is over 4 MB" }
```

Tre cose in quello scambio valgono la pena richiederle. La chiave viaggia in un header piuttosto che in un parametro di query, quindi non finisce nei log del server e nella cronologia del browser. Il corpo è il documento stesso piuttosto che un involucro JSON con il file codificato in base64 dentro, il che tiene bassa la dimensione e rimuove un passaggio di codifica dal tuo script. E il fallimento è un codice di stato più un corpo analizzabile, quindi un job CI può distinguere “troppo grande” da “troppo veloce” da “non tuo” senza leggere l'inglese.

Poi spingi deliberatamente oltre il percorso felice. Manda un file oltre il limite e leggi lo stato. Manda venti richieste in un secondo e leggi lo stato. Manda una chiave sbagliata, e una chiave che appartiene a un account diverso. Un'API costruita bene risponde `413`, `429`, `401` e `404` in quei quattro casi, con un corpo che spiega quale; una costruita male risponde `500` quattro volte, oppure `200` con un messaggio d'errore nascosto nell'HTML.

I limiti pubblicati sono l'altra metà della stessa domanda. Un limite che puoi leggere è un limite attorno al quale puoi progettare; un limite scoperto in produzione è un'interruzione. TransformPipe limita un account a 100 MB e 500 documenti, una conversione a 10 MB, un documento conservato a 4 MB e un chiamante a 60 richieste al minuto; raggiungere un limite rifiuta la scrittura invece di eliminare qualcosa, e gli endpoint, gli stati e il formato della chiave sono nella [documentazione](/docs). La cifra di 4 MB è un vincolo della piattaforma piuttosto che una preferenza — la funzione sottostante rifiuta una richiesta o un corpo di risposta più grande di 4,5 MB — che è il genere di cosa che vale la pena dichiarare piuttosto che nascondere, perché ti dice la forma di quello su cui stai poggiando.

Se stai collegando la conversione a una build o a un bot piuttosto che cliccare un pulsante, [cosa richiedere da un'API di conversione documenti](/blog/converting-documents-with-an-api) va oltre nelle forme delle richieste, nel comportamento dei retry e nei modi di fallire che contano solo in una pipeline.

## Altri due controlli, e una scheda per punteggiarli tutti e sette

Cinque controlli coprono i modi in cui un convertitore fallisce rumorosamente. Altri due coprono i modi in cui fallisce silenziosamente, e nessuno richiede più di trenta secondi.

**Cosa fa l'output quando viene stampato.** Apri l'anteprima di stampa. Un tema scuro che resta scuro sulla carta spreca una cartuccia e rende il documento illeggibile nell'unico formato che la gente ancora si passa nelle riunioni. Controlla tre cose: se i colori passano a valori chiari, se i blocchi di codice vanno a capo invece di essere tagliati al margine della pagina, e se gli URL dei link vengono stampati insieme al testo del link o persi del tutto. Un documento con quattordici link che si stampa come quattordici frasi sottolineate ha buttato via la maggior parte del suo contenuto. TransformPipe scrive un unico file autonomo con stili incorporati e nessuno script, e passa a valori chiari quando viene stampato; qualunque strumento tu usi, guarda l'anteprima una volta prima di fidartene con qualcosa che stamperai.

**Se le intestazioni portano id collegabili.** Cerca nell'output `id="` accanto a un `<h2>`. Se gli id mancano, non puoi collegarti a una sezione, non puoi costruire un sommario senza scrivere JavaScript, e un collega che cita il tuo documento deve dire “la parte sui limiti” invece di mandare un URL. Se gli id esistono, controlla che derivino dal testo dell'intestazione piuttosto che essere `heading-3` — un id posizionale cambia nel momento in cui qualcuno inserisce una sezione sopra, il che rompe ogni link mai mandato. L'intestazione con la punteggiatura nel documento di test è lì per mostrare come viene costruito l'id: uno buono trasforma il testo in slug, elimina la punteggiatura, e produce lo stesso id ogni volta che quell'intestazione viene convertita.

Entrambe contano più per la documentazione che per un documento occasionale, il che è il tema di tutto l'esercizio. I controlli non hanno pesi universali, e un fallimento in una riga che non ti interessa non è un fallimento.

Ecco la scheda. Copiala, riempi una colonna per candidato, e marca ogni cella superato, fallito o non applicabile.

| # | Controllo | Un successo appare così | Strumento A | Strumento B |
| --- | --- | --- | --- | --- |
| 1 | Variante | La tabella si renderizza, le caselle sono checkbox, il barrato è barrato, l'URL nudo è collegato | | |
| 2 | Sanificazione | Tutti e cinque i vettori neutralizzati, sul server come nel browser | | |
| 3 | Autonomia | Doctype, charset, `<style>` incorporato, nessun `http` in nessun `src` o `href` | | |
| 4 | Privacy | La scheda di rete conferma l'affermazione, ed esiste per scritto una durata di conservazione | | |
| 5 | API e limiti | Chiave bearer, errori analizzabili, `413` e `429` dove previsto, limiti pubblicati | | |
| 6 | Stampa | Colori chiari sulla carta, codice a capo, link leggibili | | |
| 7 | Id delle intestazioni | Un `id` su ogni intestazione, derivato dal testo, stabile fra le esecuzioni | | |
| — | Front matter | Rimosso o renderizzato come tabella, non come paragrafo di `chiave: valore` | | |
| — | Codifica | Em dash e legatura intatti, `<meta charset>` presente | | |
| — | Note | Renderizzate, o lasciate come marcatore visibile. Non scartate silenziosamente | | |

Le tre righe senza numero intercettano chi converte file da altri sistemi: note esportate da uno strumento di documentazione, documenti scritti su un sistema operativo diverso, prosa accademica. Punteggiale se i tuoi file arrivano da qualche parte diversa dal tuo editor.

Pesa le righe prima di totalizzarle. Per un documento che stai mandando a qualcuno, le righe tre e sei valgono più di tutto il resto insieme, e la riga due è irrilevante. Per input utente dentro un'applicazione, la riga due è l'intero test e le righe tre e sei non si applicano. Una scheda con pesi uguali produce un numero ordinato e lo strumento sbagliato.

## Cosa non possono dirti cinque minuti

Un documento di test è uno strumento buono e stretto. Ti dice cosa fa uno strumento oggi, con un file, nel tuo browser. Tre cose che non può dirti sono le tre più probabili a contare più avanti.

**Un punteggio non può dirti che stai valutando la categoria sbagliata di strumento.** Un generatore di siti statici fallisce quasi ogni controllo sopra — non ti dà un file, non sanifica, non ha un'API, e vuole un file di configurazione e un passaggio di build — ed è ancora la risposta corretta se stai pubblicando quaranta pagine collegate fra loro. La scheda misura quanto bene uno strumento fa il lavoro su cui l'hai testato, e non dice niente su se quello era il lavoro di cui avevi bisogno.

**Un test di cinque minuti non può dirti come sarà uno strumento in un anno.** Non può vedere un cambio di proprietà, una pagina dei prezzi che appare, un'API che acquisisce un parametro obbligatorio, o un mantainer che smette di rispondere. Quello che può vedere sono le proprietà che predicono quelle cose. La licenza è una: una libreria MIT o BSD non ti può essere tolta, perché la copia che hai resta licenziata a te qualunque cosa succeda dopo. La proprietà è un'altra: un progetto open source indipendente, un'azienda con un prodotto a pagamento, e un servizio ospitato gratuito senza modello di business visibile falliscono tutti in modi diversi e su scale temporali diverse, e il terzo è quello che scompare senza avviso. Se può girare offline è la terza: uno strumento che gira sulla tua macchina continua a funzionare quando l'azienda non lo fa, e uno strumento che gira sul server di qualcuno è esattamente tanto duraturo quanto quel server.

**Un documento di test non può dirti cosa contengono i tuoi documenti.** Il file sopra è un campione; i tuoi file reali hanno le proprie abitudini — una tabella con cento righe, una galleria di screenshot, un blocco di codice in un linguaggio che nessuno evidenzia, un livello di intestazione che salta da due a quattro. Fai passare anche un documento vero, idealmente il più grande e il più brutto che hai. Metà dei problemi che la gente segnala con i convertitori non sono problemi del convertitore per niente; sono un singolo file insolito che lo strumento non aveva mai visto.

### I criteri, in ordine

1. **Decidi la destinazione prima di aprire uno strumento.** Una persona, un sito, un'applicazione, una pipeline o un archivio — la risposta elimina la maggior parte del mercato immediatamente, e saltare questo passaggio è come la gente finisce a valutare un generatore di siti contro un convertitore concludendo che entrambi deludono.
2. **Fai corrispondere la variante ai file che hai davvero.** Se i tuoi documenti contengono tabelle o elenchi di attività, un parser solo-CommonMark le perde silenziosamente, e lo scopri quando un collega chiede perché la tabella di confronto è un muro di caratteri pipe.
3. **Decidi sulla sanificazione chiedendoti chi ha scritto il file.** Per le tue note non conta per niente; per qualunque cosa arrivata da fuori, o il convertitore sanifica contro un'allow-list o lo fai tu, e non c'è una terza opzione che finisce bene.
4. **Insisti su un documento, non un frammento.** Un convertitore che restituisce `<h1>…</h1><p>…</p>` si è comportato correttamente come libreria e ha fallito come strumento, e la differenza è visibile nel momento in cui qualcuno diverso da te apre il file.
5. **Verifica l'affermazione sulla privacy invece di leggerla.** La scheda di rete risponde in dieci secondi a quello che una politica sulla privacy impiega una pagina per far intendere, e la risposta è “niente è stato mandato” oppure “ecco esattamente cosa è stato mandato”.
6. **Controlla i fallimenti, non i successi.** Qualunque cosa converte un paragrafo. Quello che separa gli strumenti è la risposta a un file oltre il limite, una tabella malformata, una chiave sbagliata e venti richieste in un secondo — e quelle risposte sono quello che la tua automazione passerà la vita a gestire.
7. **Preferisci la proprietà che sopravvive al test.** Una licenza permissiva, codice che puoi far girare offline, un formato di output aperto e limiti pubblicati sono tutti verificabili oggi e tutti ancora veri in tre anni, il che è più di quanto un elenco di funzioni possa affermare.

Fai passare il documento di test attraverso lo strumento che usi adesso e quello che stai considerando, nella stessa sessione: lo stesso input, due fonti da confrontare. Il più delle volte l'incumbent vince su una riga e perde su un'altra, e la scheda trasforma una preferenza vaga in una decisione che puoi spiegare a qualcun altro. Se la riga su cui perdi è l'esportazione autonoma, [convertire Markdown in HTML nel browser](/) è il modo più corto per risolverla, gratis e senza niente da installare; se la riga su cui perdi è la variante o la sanificazione, la soluzione di solito è una libreria diversa piuttosto che un sito diverso. In ogni caso, tieni il file. Il prossimo strumento che valuti richiederà cinque minuti invece di un pomeriggio.

## Domande frequenti

### Con cosa dovrei testare un convertitore Markdown?

Un documento deliberatamente scomodo piuttosto che un paragrafo di prosa: una tabella GFM, elenchi di attività, testo barrato, un URL nudo, un blocco di codice recintato, front matter, una nota e i cinque vettori d'attacco HTML grezzo. Aggiungi un file vero tuo, idealmente il più lungo e strano che hai, perché i tuoi documenti contengono abitudini che nessun campione copre.

### Come faccio a sapere se un convertitore sanifica?

Converti un documento contenente `<script>`, un attributo `onerror`, un link `javascript:`, un `<iframe>` e un `<svg onload>`, poi leggi la fonte HTML piuttosto che l'anteprima. Se tutti e cinque sono spariti o escapati, è girata un'allow-list; se alcuni sopravvivono, lo strumento filtra per nome e perderà anche il prossimo vettore.

### Conta se il convertitore supporta solo CommonMark?

Solo se i tuoi file usano le quattro cose che CommonMark lascia fuori: tabelle, elenchi di attività, testo barrato e autolink da URL nudo. Prosa con intestazioni, elenchi, link e blocchi di codice si renderizza identica in entrambi i casi, quindi controlla i tuoi documenti prima di trattare la variante come un fattore decisivo.

### Un convertitore che gira nel browser è sempre più privato?

È più privato nel senso che conta più di tutti — il file non viene trasmesso, e puoi confermarlo nella scheda di rete in dieci secondi. Non è automaticamente più sicuro in ogni senso, perché uno strumento lato browser renderizza comunque qualunque HTML il documento contenga, quindi la domanda sulla sanificazione è separata e si applica altrettanto.

### Come controllo un convertitore senza installare niente?

Apri lo strumento, apri gli strumenti per sviluppatori del browser, incolla il documento di test e converti. La scheda di rete risponde alla domanda sulla privacy, il pannello degli elementi risponde alla domanda sulla sanificazione, e il file scaricato risponde alla domanda sull'autonomia — tre dei sette controlli, senza installazione e senza account.

### Cosa dovrei cercare nell'API di un convertitore prima di costruirci sopra?

Una chiave mandata come header bearer piuttosto che come parametro di query, una revoca che ha effetto immediato, chiavi conservate con hash, limiti di frequenza e dimensione pubblicati, e risposte d'errore che sono un codice di stato significativo più un corpo analizzabile. Poi testa deliberatamente i rifiuti, perché una pipeline passa la maggior parte della sua vita sul percorso infelice.

### Ogni quanto dovrei ripetere il test?

Ogni volta che uno strumento annuncia un cambiamento al proprio renderer, al proprio sanificatore o al proprio foglio di stile, e una volta all'anno comunque. Richiede un minuto una volta che il file esiste, e il comportamento di un convertitore che cambia sotto di te è un evento normale piuttosto che uno scandalo — vuoi semplicemente essere tu quello che se ne accorge.
