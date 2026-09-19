---
title: "Pubblicare Markdown da una pull request con GitHub Actions"
description: "Renderizzare il Markdown di una pull request e commentare un link: il workflow riga per riga, perché un fork non riceve segreti, e cosa costa ogni alternativa"
updated: 2026-09-09
date: 2026-08-26
tag: Automazione
keywords: github action markdown, github actions renderizzare markdown, anteprima markdown pull request, anteprima documentazione pull request, ci markdown, convertire markdown in ci, sicurezza pull_request_target, commento fisso pull request, concorrenza github actions, pubblicare markdown da ci
---

Una pull request che riscrive un paragrafo mostra una riga rossa, una riga verde, e molto testo che va a capo diversamente. Si vede quali parole sono cambiate. Non si vede se la sezione si legge ancora bene, se la tabella è allineata, o se l'elenco numerato riparte da uno a metà. Rivedere la prosa in un diff è indovinare.

Le persone la cui approvazione serve davvero al documento sono spesso quelle meno attrezzate per leggere un diff. Un avvocato che controlla dei termini, un responsabile del supporto che controlla un runbook, un designer che controlla le parole in un flusso: aprono la scheda Files changed, incontrano un muro di rosso e verde con il testo andato a capo diversamente, e rispondono che va bene così. Non è una revisione, e nessuno dei coinvolti ne ha colpa.

La correzione è piccola. A ogni pull request, renderizza il Markdown che ha cambiato, pubblica ogni file, e posta i link in un commento. Il revisore clicca e legge il documento. Niente nel repository cambia.

### In breve

Attiva su `pull_request` con un filtro `paths`, dai al job un gruppo di concorrenza così che due push a un minuto di distanza non entrino in gara, dichiara `contents: read` e `pull-requests: write` e nient'altro, e proteggi il passo di pubblicazione con un `if` così che una pull request che non ha cambiato Markdown non faccia proprio niente. Trovare cosa è cambiato significa confrontare con il commit di base, il che significa la cronologia intera — `fetch-depth: 0` — oppure un'azione che chiede l'elenco all'API di GitHub invece. Posta un commento solo e aggiornalo sul posto invece di aggiungerne uno per ogni push. E sappi il solo limite che non puoi configurare via prima di costruirci sopra: una pull request da un fork riceve un token di sola lettura e nessun segreto, di proposito, quindi le anteprime dai fork o non avvengono o avvengono senza la tua chiave — e `pull_request_target`, il trigger che toglie la restrizione, è quello che fa compromettere i repository.

## Controlla cosa fa già GitHub

Prima di aggiungere un workflow, verifica se ne serve uno davvero. I commit e le pull request che includono documenti di prosa possono essere mostrati in una vista sorgente o in una vista renderizzata, e il pulsante che passa dall'una all'altra sta nell'intestazione del file — quindi la scheda Files changed renderizzerà un file Markdown cambiato invece di fare il diff del suo testo (verificato su docs.github.com, 9 settembre 2026). Il rich-diff toggle, nel nome che usa la maggior parte delle persone. Per un file piccolo, rivisto da persone che hanno già aperto la pull request, questo basta.

Smette di bastare quando il cambiamento riguarda più file, quando il lettore non ha un account GitHub — un avvocato che controlla dei termini, un cliente che legge le note di rilascio — o quando vuoi un link che mostri ancora cosa diceva il branch martedì scorso.

## Il workflow, riga per riga

Copia questo in `.github/workflows/markdown-preview.yml`:

```yaml
name: Markdown preview

on:
  pull_request:
    paths:
      - '**.md'

concurrency:
  group: markdown-preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}

      - if: steps.publish.outputs.urls != ''
        run: echo "${{ steps.publish.outputs.urls }}"
```

Questo è tutto. La chiave è una chiave API di TransformPipe, conservata come segreto del repository; l'azione include il convertitore, e `action.yml` elenca i suoi input. Senza un elenco di file, chiede a git quali file Markdown ha toccato la pull request, pubblica ognuno, e commenta una tabella con nome del file, conteggio delle parole e link. I file che il branch ha eliminato vengono saltati, così un documento rimosso non fa fallire l'esecuzione.

La maggior parte di quel file non è la conversione. Sono la manciata di righe che tengono il job economico, delimitato, ordinato e silenzioso, e ognuna di esse risponde a un fallimento che qualcuno ha già avuto.

### Il trigger, e cosa fa `paths`

`on: pull_request` esegue il workflow quando una pull request viene aperta, riaperta, o riceve un push. Questi tre tipi di attività — `opened`, `synchronize` e `reopened` — sono l'insieme di default, e tutto il resto che una pull request può fare, un'etichetta o una modifica al titolo o una revisione, va nominato esplicitamente con `types` (verificato su docs.github.com, 9 settembre 2026). Un push di un commit sul branch è `synchronize`, che è il caso che conta qui: ogni giro di modifiche ottiene un'anteprima fresca senza che nessuno la chieda.

`paths: '**.md'` è la guardia più economica disponibile, perché gira prima di qualunque altra cosa. Una pull request che cambia solo codice non mette mai in coda il workflow: nessun runner, nessun checkout, nessun minuto fatturato. `'**.md'` corrisponde a qualunque profondità. `'docs/**.md'` lo restringe a un solo albero, il che di solito è quello che si vuole in un repository dove Markdown vive anche in fixture di test, in una cache `node_modules`, o in una copia importata della documentazione di qualcun altro.

Una conseguenza vale la pena saperla prima di rendere questo un controllo di stato richiesto. Le parole stesse di GitHub sono che un workflow saltato dal filtro sui percorsi lascia i suoi controlli in uno stato pendente, e una pull request che richiede che quei controlli siano superati resta bloccata dal merge (verificato su docs.github.com, 9 settembre 2026) — proprio sulle pull request che non avevano niente da mostrare in anteprima. O lascia il controllo facoltativo, oppure sposta il filtro fuori da `on:` e dentro un `if` sul job, dove l'esecuzione avviene, riporta, e non fa niente.

### Un gruppo di concorrenza, così che due push non entrino in gara

Due commit inviati con push a un minuto di distanza avviano due esecuzioni. Entrambe fanno il checkout, entrambe pubblicano, entrambe commentano, e niente dà errore. Il risultato è comunque sbagliato: le esecuzioni possono finire fuori ordine, quindi l'ultimo commento nel thread — quello che un revisore legge — può essere quello che descrive il commit più vecchio.

`concurrency` corregge l'ordinamento rifiutandosi di averne due. Il gruppo è una stringa qualunque, e usare come chiave il numero della pull request dà una corsia per pull request invece di una corsia per repository, il che farebbe mettere in coda dieci pull request aperte l'una dietro l'altra senza motivo. Con `cancel-in-progress: true` una nuova esecuzione cancella quella già in corso; senza, la nuova esecuzione aspetta. La descrizione di GitHub del comportamento di default è che un job o un workflow pendente nello stesso gruppo viene cancellato e quello appena messo in coda prende il suo posto (verificato su docs.github.com, 9 settembre 2026).

Per un'anteprima, cancellare è la scelta giusta: la pubblicazione a metà di un commit già superato è un lavoro di cui nessuno vuole il risultato. Se il repository ha diversi workflow che potrebbero collidere, metti anche il nome del workflow nel gruppo — `${{ github.workflow }}-${{ github.event.pull_request.number }}` — così che due job non correlati non finiscano per condividere una corsia per caso.

### `permissions`, e il 403 che ottieni senza di esse

Il blocco `permissions` delimita il token con cui gira un workflow. `contents: read` lascia che il checkout legga il repository. Postare un commento è uno scope diverso, e serve `pull-requests: write`.

Ometti questo e il lavoro viene fatto e sprecato: i documenti si pubblicano, la chiamata al commento torna 403, e l'esecuzione va in rosso sull'ultimo passo con i link lasciati nel log. Dichiara entrambi gli scope invece di affidarti al default, che varia con le impostazioni del repository e dell'organizzazione.

Dichiarare del tutto il blocco è ciò che lo rende a privilegio minimo, perché nominare due scope imposta ogni altro scope a nessuno. Un passo aggiunto a questo job più avanti — una dipendenza di un'azione, uno script che qualcuno incolla — non può quindi inviare un commit, aprire un issue, pubblicare un pacchetto o leggere un altro repository, qualunque cosa provi. Se un job in un workflow più grande ha davvero bisogno di più, dai a quel job un proprio blocco `permissions` invece di allargare quello del file.

### Il segreto, e cosa può raggiungere

`secrets.TP_API_KEY` è un segreto del repository che contiene una chiave API. L'azione la prende come input e la passa al convertitore come variabile d'ambiente invece che come argomento, il che la tiene fuori dall'elenco processi del runner e fuori dalla riga di comando che finisce nel log. GitHub oscura i valori dei segreti registrati dall'output del log, e la sua stessa indicazione è che qualunque cosa sensibile che non sia un segreto GitHub va mascherata a mano con `::add-mask::` (verificato su docs.github.com, 9 settembre 2026). L'oscuramento è una rete di sicurezza su un errore piuttosto che un posto in cui commetterne uno: un passo che codifica un segreto, lo divide, o lo manda da qualche parte sconfigge completamente il mascheramento, e qualunque passo di questo job può farlo.

La chiave stessa raggiunge i documenti, le loro impostazioni di condivisione e una cifra d'uso, e nient'altro — non l'accesso, non l'elenco delle chiavi — quindi una chiave trapelata può pubblicare ed eliminare documenti ma non può coniare la propria sostituta né bloccare fuori il proprietario. Viene mostrata una volta sola e conservata solo come hash, il che rende la rotazione un ordine fisso: coniare, incollare nel segreto, revocare la vecchia.

Se il repository ha collaboratori a cui non consegneresti la chiave di persona, mettila in un segreto d'ambiente e dai al job un `environment:`, così che usarla sia condizionato da qualunque regola di protezione porti quell'ambiente. Quello è un confine vero. Un semplice segreto di repository non lo è: ogni workflow nel repository può leggerlo, incluso uno aggiunto su un branch da chiunque abbia accesso in scrittura.

### La guardia `if`, così che non succeda niente quando niente è cambiato

Il filtro `paths` ferma il workflow quando non è cambiato nessun Markdown del tutto. La guardia `if` copre il caso un livello più sotto, dove il workflow è girato perché qualcosa ha corrisposto e il passo dopo la pubblicazione non ha niente su cui lavorare.

L'azione gestisce onestamente il proprio caso vuoto: senza file stampa `No Markdown to publish.`, imposta `urls` a una stringa vuota e `documents` a `[]`, ed esce con zero. Quello che non può fare è fermare i passi che scrivi dopo. `if: steps.publish.outputs.urls != ''` è tutta la guardia, e un passo saltato è verde invece che rosso — cosa che conta più di quanto sembri. Un workflow che va in rosso per un motivo su cui nessuno può agire è un workflow che la gente impara a ignorare, e poi va in rosso per un motivo vero e viene ignorato di nuovo.

La stessa guardia con una condizione diversa è come si gestisce un fork di proposito invece che per caso:

```yaml
      - if: github.event.pull_request.head.repo.fork == false
        id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

Quella riga va spiegata, perché la restrizione dietro di essa è l'unica cosa in questo workflow che non si può configurare via.

## Trovare cosa è cambiato

Senza un input `files`, l'azione chiede a git, in una riga sola:

```bash
git diff --name-only --diff-filter=d "$BASE_SHA"...HEAD -- '*.md'
```

Ogni parte di quella riga porta il suo peso. `--name-only` chiede percorsi invece di una patch. `--diff-filter=d` scarta le eliminazioni, così un documento che il branch ha rimosso non viene mai passato a un convertitore che fallirebbe su un file che non c'è. Il pathspec `'*.md'` filtra dentro git invece che dopo, il che tiene corto l'elenco su una pull request che ha anche spostato quattrocento immagini. E i tre punti non sono un errore di battitura: `A...B` fa il diff dalla base di merge dei due commit invece che da `A` stesso, così i commit che sono atterrati sul branch di base dopo l'apertura della pull request non compaiono come lavoro di questo branch.

`$BASE_SHA` viene da `github.event.pull_request.base.sha`, che il payload dell'evento porta gratis. Quel commit è l'intera domanda, ed è il motivo della prossima riga nel workflow.

### Perché `fetch-depth: 0`

`actions/checkout` recupera un commit solo di default — `fetch-depth` è documentato come il numero di commit da recuperare, con un default di `1` e `0` che significa tutta la cronologia per tutti i branch e i tag (verificato su github.com, 9 settembre 2026). Questo è veloce, e basta per costruire il codice. Non basta per rispondere a "cosa è cambiato": l'azione fa il diff fra la base della pull request e la sua testa, e in un clone superficiale quel commit di base manca, quindi il diff fallisce o non riporta niente.

`fetch-depth: 0` recupera la cronologia intera, il che costa tempo reale su un repository con anni di commit. Se il checkout è già il passo lento, nomina i file da solo e mantieni il clone superficiale:

```yaml
      - uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook/intro.md docs/handbook/style.md
          merge: true
          name: Handbook preview
```

`files` è un elenco di percorsi separati da spazi, passato così com'è scritto: un pattern come `docs/*.md` arriva letteralmente e non corrisponde a niente, quindi costruisci l'elenco in un passo precedente se ne serve uno — che è lo stesso problema di [convertire un'intera cartella di file Markdown](/blog/batch-convert-markdown-files), dove enumerare con `find` e ordinare prima di passare l'elenco è ciò che mantiene l'insieme conoscibile. Un elenco esplicito non ha bisogno della cronologia, ma perde la parte che rende utile tutto questo — trattalo come il ripiego, non come il default.

### L'azione a cui la gente ricorre invece

La maggior parte dei workflow non scrive quel diff da soli. `tj-actions/changed-files` è l'alternativa più usata: licenza MIT, e calcola l'elenco o dall'API REST di GitHub o dal `diff` di git stesso, motivo per cui funziona su una pull request al `fetch-depth: 1` di default e vuole comunque `fetch-depth: 0` o `2` su un evento `push`. I suoi output arrivano in diverse forme — `all_changed_files`, `added_files`, `modified_files`, `deleted_files` — più `any_changed`, che è il booleano che vuole un `if` (verificato su github.com, 9 settembre 2026).

```yaml
      - id: changed
        uses: tj-actions/changed-files@<commit-sha>
        with:
          files: '**.md'

      - if: steps.changed.outputs.any_changed == 'true'
        id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: ${{ steps.changed.outputs.all_changed_files }}
```

Due cose su quello snippet. La versione è uno SHA di commit di proposito: fissa un'azione di terze parti a uno SHA completo invece che a un tag, perché un tag è un puntatore mobile che il proprietario dell'azione, o chiunque prenda il controllo di quell'account, può ripuntare verso codice diverso — e il tuo workflow lo scaricherà alla prossima esecuzione senza nessun diff da leggere. La seconda è le virgolette. Un elenco di percorsi interpolato in un valore `with:` è una stringa sola, quindi un nome di file che contiene uno spazio arriva come due file. Questa è una proprietà di ogni elenco separato da spazi, incluso l'input `files` di questa azione, piuttosto che un bug dell'uno o dell'altra; se esistono nomi simili nel tuo repository, scrivi l'elenco in un file e rileggilo invece di passarlo attraverso una shell.

## Il problema del fork, e il trigger che lo elimina

Un limite vale la pena saperlo subito. Un evento `pull_request` sollevato da un fork non riceve segreti e riceve un token di sola lettura, quindi una pull request da fork non riceve anteprima — e un controllo rosso dove il passo di pubblicazione si è fermato per mancanza di una chiave. Questo è GitHub che tiene la tua chiave API lontana da codice che non hai letto — il default giusto.

Le parole di GitHub non lasciano spazio: a eccezione di `GITHUB_TOKEN`, i segreti non vengono passati al runner quando un workflow viene attivato da un repository forkato, e `GITHUB_TOKEN` stesso ha permessi di sola lettura nelle pull request dai fork (verificato su docs.github.com, 9 settembre 2026). Entrambe le metà di questo workflow sono quindi morte su un fork. Il passo di pubblicazione non ha una chiave e fallisce all'API; il passo del commento non ha lo scope di scrittura e fallisce sul commento. Dichiarare `pull-requests: write` nel file non cambia niente, perché il blocco è un tetto piuttosto che una concessione.

### `pull_request_target`, e perché è il modo in cui i repository vengono compromessi

Cerca un modo per aggirare questo e la prima risposta è sempre lo stesso trigger. `pull_request_target` scatta sugli stessi eventi di `pull_request`, ma gira nel contesto del branch di default del repository di base invece che nel commit di merge — così il file del workflow è tuo, il token è scrivibile, e i segreti ci sono (verificato su docs.github.com, 9 settembre 2026).

Sembra la correzione, ed è un modo ben documentato di perdere un repository. Il fatto che il file del workflow sia tuo è la metà sicura. La metà pericolosa arriva nel momento in cui il job tocca il contenuto della pull request stessa. Fai il checkout del commit di testa, e tutto dopo quella riga è codice di uno sconosciuto che gira in un job che contiene i tuoi segreti e un token di scrittura: uno script di build, un comando di test, un hook di installazione di una dipendenza, un target di Makefile, un file di configurazione di un linter, un git hook committato nel branch. L'avviso di GitHub sul trigger nomina chiaramente le conseguenze — avvelenamento della cache, e accesso non voluto a privilegi di scrittura o a segreti (verificato su docs.github.com, 9 settembre 2026).

Convertire un file Markdown sembra innocuo, e il pericolo non è nella conversione. È in tutto quello che cresce intorno a un job: il checkout, l'`npm ci` che qualcuno aggiunge sei mesi dopo perché un passo di lint funzioni, il "esegui semplicemente lo script del progetto" che al momento sembra ovvio. Le linee guida di sicurezza di GitHub trattano questo come uno schema nominato, e la forma raccomandata quando serve davvero lavoro privilegiato su contenuto non fidato è di due workflow: un workflow `pull_request` che gestisce i file del collaboratore senza segreti e carica il risultato come artefatto, poi un workflow `workflow_run` con permessi che scarica l'artefatto e fa la parte privilegiata (verificato su securitylab.github.com, 9 settembre 2026).

### Cosa fare invece

Quella separazione è corretta, e per un'anteprima di documentazione è la quantità sbagliata di macchinario: due file di workflow, un passaggio di artefatto, e una classe di errore — fare il checkout della testa nella metà privilegiata — la cui modalità di fallimento è la tua chiave nelle mani di qualcun altro. Due opzioni più semplici coprono quasi ogni repository.

**Pubblica al push sul branch di default.** Dopo il merge il job gira sul tuo branch con il tuo token e i tuoi segreti, e la domanda sul fork scompare perché non c'è nessun fork nel quadro:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'docs/**.md'

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 2

      - uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook.md
          share: link
```

Due differenze dalla versione per pull request. `fetch-depth: 2` basta, perché un push confronta con il commit precedente invece che con una base di merge. E `files` è nominato esplicitamente, perché un evento push non porta nessuna pull request e quindi nessuno SHA di base con cui l'azione possa fare il diff — senza un elenco non trova niente ed esce con zero, che è un successo silenzioso invece di un errore. Quello che si perde è l'anteprima prima del merge; quello che si mantiene è una pagina pubblicata per ogni versione che è davvero uscita, che per le note di rilascio e un manuale è comunque quello che la gente voleva.

**Oppure accetta che le pull request dai fork non ricevano anteprima.** Proteggi il passo con `if: github.event.pull_request.head.repo.fork == false` così che l'esecuzione vada verde con un passo saltato invece che rossa con un 401, e dillo nella guida per i collaboratori. Un revisore su una pull request da fork ha comunque il rich-diff toggle, e un maintainer che ha bisogno del trattamento completo può inviare il branch con push al repository, dove il workflow ha di nuovo una chiave.

Un'altra abitudine, non collegata ai fork ed economica da fare bene: non interpolare mai un valore che un collaboratore controlla — un titolo di pull request, un nome di branch, un messaggio di commit — direttamente in uno script `run:`. `${{ }}` sostituisce il testo prima che la shell lo veda mai, quindi un titolo che contiene un backtick o `$( )` diventa un comando che gira con qualunque cosa contenga quel job. Metti il valore in `env:` e richiamalo come `$VAR`, che la shell tratta come dati.

## Il commento, e cosa mostra il suo link

### Un commento solo, aggiornato sul posto

Così come viene consegnata, l'azione posta un nuovo commento ogni volta che gira. Su un branch che riceve quindici push in tre giorni, sono quindici commenti, quattordici dei quali puntano a commit che nessuno sta più rivedendo, con la discussione vera sepolta da qualche parte in mezzo a loro.

La correzione è un commento fisso: un commento solo, riscritto sul posto. `marocchino/sticky-pull-request-comment` è la scelta abituale — licenza MIT, con chiave su un input `header` così che diversi workflow possano ciascuno possedere un commento senza litigare per lo stesso, e vuole lo stesso `pull-requests: write` che questo workflow dichiara già (verificato su github.com, 9 settembre 2026). Disattiva il commento proprio dell'azione e dagli l'output:

```yaml
      - id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          comment: false

      - if: steps.publish.outputs.urls != ''
        uses: marocchino/sticky-pull-request-comment@<commit-sha>
        with:
          header: markdown-preview
          message: |
            Rendered preview of the Markdown this pull request changes:

            ${{ steps.publish.outputs.urls }}
```

Lo scambio è reale, e vale la pena farlo deliberatamente invece che per default. Un commento fisso sovrascrive la propria cronologia, quindi il thread smette di essere un archivio di quello che il branch diceva a ogni giro di revisione. Dove la revisione dura giorni e qualcuno potrebbe voler controllare cosa ha approvato martedì, l'input `append` dell'azione — che accetta `true` e nient'altro — aggiunge ogni nuovo messaggio al precedente invece di sostituirlo (verificato su github.com, 9 settembre 2026), così i link più vecchi restano sotto quelli più nuovi e il thread resta un archivio. Dove il commento è una riga di stato invece che un archivio, sostituiscilo e tieni la pagina silenziosa.

Dove va il link conta quanto quanti di essi ci sono. Mettilo nel corpo del commento, non solo nel riepilogo di un controllo — un revisore che deve cliccare su Details per trovare un link non lo troverà — e dai a ogni link un nome, così che una pull request che tocca quattro documenti non presenti quattro URL nudi. Il commento proprio dell'azione è una tabella di nome del file, conteggio delle parole e link, che è più o meno il minimo che lascia a qualcuno decidere cosa aprire per primo.

### Un nuovo documento per ogni push, non uno che viene sovrascritto

L'azione pubblica un documento fresco ogni volta che gira. Sovrascrivere una pagina sola sarebbe più ordinato da guardare e peggiore da usare, perché una sovrascrittura rende bugiardo ogni vecchio link. Qualcuno legge il commento lunedì, segue il link giovedì, e ottiene il testo di giovedì sotto l'approvazione di lunedì.

Un nuovo documento per ogni push mantiene ogni link fissato al commit che lo ha prodotto, il che è ciò che rende il commento che aggiunge invece di sostituire, descritto sopra, degno del suo rumore extra: i link fissati sono utili solo finché qualcosa continua a tenerli. Il costo sono i documenti: ogni push ne spende uno contro il limite di 500 documenti per account, e raggiungere un limite rifiuta la scrittura invece di eliminare silenziosamente qualcosa. Ripulisci le vecchie anteprime in blocco dalla cronologia, oppure con `tp rm` dalla [riga di comando](/blog/markdown-to-html-from-the-command-line).

### Chi può aprire il link

`share` decide chi può aprire il risultato.

| Valore | Chi può leggerlo |
| --- | --- |
| `link` | Chiunque abbia il link |
| `people` | Solo gli indirizzi che elenchi, dopo aver fatto l'accesso |
| `none` | Nessuno tranne te — il documento finisce nella tua cronologia |

Repository pubblico, anteprima pubblica: `link` va bene. Per un manuale privato, `people` è onesto, con un avvertimento: l'azione pubblica in quella modalità senza nessun elenco di indirizzi, quindi il primo link non si apre per nessuno finché non nomini i lettori — nella finestra di condivisione, o con `PUT /api/v1/documents/:id/share`. Revocare una condivisione elimina il token, così un link già incollato in un commento smette di funzionare. Imposta `comment: false` per l'output `urls` e nessun commento del tutto.

Questo schema si adatta ai repository dove il Markdown è il prodotto consegnato — [documentazione che vive accanto al codice](/blog/documentation-that-lives-in-the-repo), [note di rilascio scritte per un lettore, non per un log di commit](/blog/release-notes-from-markdown), RFC, runbook. Se il tuo Markdown alimenta un sito statico con un proprio tema e una propria navigazione, un deployment di anteprima dal tuo host lo renderizza correttamente e questo no.

## Le alternative, e quanto costa ciascuna

Una pagina ospitata è una risposta alla domanda di dove viva il documento renderizzato. Non è la sola, e per alcuni repository non è quella giusta. Quattro alternative coprono quello che la gente fa davvero, e ciascuna compra qualcosa di diverso.

| Dove vive la pagina | Cosa costa configurarla | Chi può vederla | Quanto dura |
| --- | --- | --- | --- |
| Un artefatto sull'esecuzione (`actions/upload-artifact`) | un passo solo, nessuna chiave, nessun account | chiunque possa leggere il repository, con l'accesso fatto su GitHub — l'URL di download richiede un login | 90 giorni di default, da 1 a 90 con `retention-days` |
| GitHub Pages (`actions/upload-pages-artifact` poi `actions/deploy-pages`) | `pages: write` e `id-token: write`, un ambiente `github-pages`, e un sito che sei disposto a sovrascrivere | internet, su un sito Pages pubblico | fino al prossimo deployment che lo sostituisce |
| L'HTML convertito committato nuovamente sul branch | `contents: write`, un commit del bot, e HTML generato in ogni diff futuro | chiunque possa leggere il repository | per sempre, nella cronologia |
| Una pagina ospitata da un'API o un'azione | una chiave in un segreto, un account, e i limiti di quell'account | chiunque la modalità di condivisione permetta, con o senza account GitHub | finché qualcuno non la elimina |
| Niente: il rich-diff toggle | nessun workflow del tutto | chiunque possa aprire la pull request | è una scheda, non un link |

(La conservazione degli artefatti, i permessi di Pages e il requisito di download verificati su github.com, 9 settembre 2026.)

**L'artefatto è il più economico e il meno leggibile.** Un passo solo, nessuna chiave, nessun account, e l'output è allegato all'esecuzione dove non può trapelare. Poi qualcuno deve trovare l'esecuzione, scorrere fino agli artefatti, scaricare uno zip, decomprimerlo, e aprire un file HTML dal proprio disco — che è anche il momento in cui una pagina che recupera il suo foglio di stile da un CDN smette di sembrare qualcosa, quindi un export autonomo conta qui più che altrove. E l'URL di download richiede un login GitHub, il che esclude proprio il lettore per cui era pensato tutto questo esercizio.

**GitHub Pages è la risposta giusta quando l'output è un sito.** `actions/deploy-pages` pubblica su Pages un artefatto caricato in precedenza, e ha bisogno di `pages: write` per il deployment e `id-token: write` così che il deployment possa essere verificato, con il job puntato all'ambiente `github-pages`. Quello che non è, è un'anteprima per branch: un repository ha un solo sito Pages, quindi fare l'anteprima di una pull request significa o sovrascrivere quello che è live o inventare una convenzione di percorso e ripulirla più avanti, e niente scade da solo.

**Committare di nuovo l'HTML funziona, e avvelena il diff.** Ha bisogno di `contents: write` — il permesso che il resto di questo articolo ha evitato — e di un commit del bot che rifarà scattare il workflow a meno di proteggersi da questo. Il costo duraturo è la revisione: ogni pull request ora porta mille righe di markup generato che nessuno legge e tutti scorrono oltre, più conflitti di merge in un file che nessun umano modifica. L'output generato appartiene da un'altra parte rispetto all'albero sorgente, e questo è il caso più chiaro.

**Una pagina ospitata compra esattamente una cosa: un lettore senza un account.** Questa è l'intera giustificazione, e se nessuno nella revisione ne ha bisogno, l'artefatto è più economico e il rich diff lo è ancora di più. Costa una chiave in un segreto e un account con dei limiti — 500 documenti, 100 MB, e 4 MB per ogni singolo documento. Quei limiti sono il motivo per ripulire le vecchie anteprime invece di lasciare che un anno di pull request si accumuli.

**E una che non funziona: incollare l'HTML nel commento.** GitHub renderizza il corpo di un commento come proprio Markdown e toglie i tag da cui dipende un documento convertito, `style` per primo. Un commento può portare un link. Non può portare un documento.

## Venti file, due limiti di frequenza, e i modi in cui fallisce

Una pull request di ristrutturazione tocca venti file Markdown, e la forma del job smette di essere un dettaglio.

### Un ciclo batte una matrice qui

Il default dell'azione è un documento per file, convertito e pubblicato uno dopo l'altro dentro un job solo. Venti file sono venti richieste in un processo solo su un runner solo, e finisce in circa lo stesso tempo di un file più diciannove andate e ritorno.

L'istinto è di distribuire con una matrice — costruire l'elenco dei file in un job, farlo passare con `fromJSON` in `strategy.matrix` nel job successivo, e far girare venti job in parallelo. Per un lavoro che richiede minuti per elemento questo è esattamente giusto. Per una conversione che richiede un attimo sono venti allocazioni di runner, venti checkout, venti download dell'azione e venti commenti a meno di sopprimerli, per risparmiare qualche secondo di andata e ritorno con l'API. Il ciclo vince su ogni asse che conta.

Se distribuisci per qualche altro motivo, tre impostazioni evitano che faccia male: `fail-fast: false`, così che un file malformato non cancelli gli altri diciannove; `max-parallel`, così che l'esplosione diventi un rivolo; e un job finale che raccoglie gli output e scrive un commento solo, perché venti commenti sono peggio di nessuno.

La risposta migliore per venti file collegati di solito non è affatto il parallelismo. `merge: true` li concatena in un documento solo con un link solo, e un revisore legge un manuale in ordine invece di aprire venti schede e perdere il segno. L'ordine diventa allora la cosa da sistemare, che è lo stesso problema che ha una conversione dell'intera cartella.

### Sessanta chiamate al minuto, e mille all'ora

Due limiti di frequenza stanno alla fine di questo job, e appartengono a sistemi diversi.

L'API conta le chiamate per chiamante al minuto e rifiuta la sessantunesima con un 429 e un `Retry-After`, sul ragionamento che una chiave che va più veloce di così sta ciclando invece di lavorare. Venti file in un ciclo sono venti chiamate e per niente vicino a quel limite. Venti job paralleli, ognuno che riprova dopo un timeout, su un repository dove sono aperte tre pull request insieme, è come si trova un limite che sembrava generoso.

Il limite proprio di GitHub sta sul commento: `GITHUB_TOKEN` ottiene 1.000 richieste all'ora per repository, condivise fra ogni workflow di quel repository (verificato su docs.github.com, 9 settembre 2026). Un commento per esecuzione non è niente. Un commento per file, su un monorepo trafficato, insieme a ogni altro workflow che spende dallo stesso budget, è un 403 di un martedì pomeriggio che nessuno collega al cambiamento fatto lunedì. Un commento fisso per esecuzione è la risposta economica a entrambi i limiti insieme.

### Quando il job va in rosso, e quando va in verde e mente

Quattro fallimenti coprono quasi tutti i casi. Tre si annunciano da soli. Il quarto è quello di cui preoccuparsi.

**Un corpo che la piattaforma rifiuta.** La conversione accetta fino a 10 MB, ma un documento conservato in un account è limitato a 4 MB, e il motivo non è una politica: una Vercel Function rifiuta una richiesta o un corpo di risposta oltre 4,5 MB prima che giri qualunque nostro codice, quindi un documento più grande non potrebbe essere né salvato né riletto, e il chiamante otterrebbe il nudo 413 della piattaforma invece di una frase che si spiega. In CI il segnale è quale errore ottieni — un corpo JSON con un messaggio leggibile significa che la richiesta ha raggiunto l'API ed è stata rifiutata da essa; un 413 nudo senza corpo significa che non è mai arrivata. In entrambi i casi la correzione è la stessa, e raramente è "dividi il documento": un file Markdown da 4 MB di solito è output generato che non sarebbe mai dovuto stare nell'anteprima, che è a cosa servono il filtro `paths` e un elenco `files` esplicito.

**Un token scaduto.** Con questo si possono intendere due token diversi. `GITHUB_TOKEN` viene coniato per il job e smette di funzionare quando il job finisce, il che morde solo se provi a passarlo a qualcosa fuori dall'esecuzione. La chiave API è quella che scade in pratica — revocata da chi l'ha ruotata, o eliminata con l'account. Il sintomo è un 401 su ogni esecuzione incluse le riesecuzioni di esecuzioni che erano passate la settimana scorsa, ed è questa la diagnosi: niente nel repository è cambiato, quindi niente nel repository è la causa. Le chiavi sono conservate come hash e mostrate una volta sola, quindi non c'è niente da ispezionare; coniane una nuova, aggiorna il segreto, riesegui.

**Un segreto che non c'era mai stato.** Un segreto richiamato con il nome sbagliato non è un errore. Si interpola in una stringa vuota, il passo gira senza chiave, e il fallimento emerge all'API come un 401 che si legge come una chiave sbagliata invece che mancante. Non puoi testarlo direttamente, perché il contesto `secrets` non è disponibile in un `if` né a livello di job né a livello di passo (verificato su docs.github.com, 9 settembre 2026). Copialo in `env` a livello di job e testa la variabile invece:

```yaml
jobs:
  preview:
    runs-on: ubuntu-latest
    env:
      HAS_KEY: ${{ secrets.TP_API_KEY != '' }}
    steps:
      - if: env.HAS_KEY == 'true'
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

**Un documento che si converte ed è vuoto.** Questo è quello pericoloso, perché tutto è verde. Un file che è solo front matter YAML si converte in un documento senza corpo. Lo stesso vale per un file il cui contenuto è un solo commento HTML, o una pagina il cui testo vive dentro un tag di template che il convertitore non esegue. Il workflow riesce, il commento si posta, il link apre una pagina vuota, e il revisore presume che la pagina vuota sia il documento. Proteggilo con il conteggio delle parole che l'azione già riporta:

```yaml
      - if: steps.publish.outputs.documents != ''
        env:
          DOCUMENTS: ${{ steps.publish.outputs.documents }}
        run: |
          node -e '
            const docs = JSON.parse(process.env.DOCUMENTS || "[]");
            const empty = docs.filter((d) => d.words < 20);
            if (empty.length > 0) {
              console.error(`Empty after conversion: ${empty.map((d) => d.name).join(", ")}`);
              process.exit(1);
            }
          '
```

Venti parole è arbitrario e va bene così — il punto non è la soglia ma che un documento che nessuno può leggere ora fa fallire l'esecuzione invece di superarla.

## Lo stesso job su GitLab, e su un runner tuo

Niente di quanto sopra riguarda davvero GitHub. Il lavoro è: capire cosa è cambiato, convertirlo, pubblicarlo, e mettere il link dove sta il revisore. Solo le ultime due righe di questo sono specifiche dell'host.

Su GitLab, i pezzi si allineano quasi uno a uno. `rules:changes` è il filtro `paths`. `interruptible: true` è ciò che rende un job cancellabile quando una pipeline più recente lo sostituisce, e `resource_group` limita la concorrenza dove i job non devono sovrapporsi. `CI_MERGE_REQUEST_DIFF_BASE_SHA` è descritto nella documentazione come lo SHA di base del diff della merge request, che è il commit con cui confrontare, e `CI_MERGE_REQUEST_IID` è il numero nell'URL della merge request, che è ciò contro cui viene postato un commento. Il problema del clone superficiale è lo stesso problema con una manopola diversa: il runner clona in modo superficiale di default e `GIT_DEPTH` è ciò che lo cambia (tutto verificato su docs.gitlab.com, 9 settembre 2026).

```yaml
markdown-preview:
  image: node:lts-alpine
  interruptible: true
  variables:
    GIT_DEPTH: 0
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes:
        - '**/*.md'
  script:
    - files=$(git diff --name-only --diff-filter=d
        "$CI_MERGE_REQUEST_DIFF_BASE_SHA"...HEAD -- '*.md')
    - node tp.mjs push $files --share link --json > documents.json
```

Su un runner che ti appartiene — Jenkins, Buildkite, un cron job su una macchina in un ripostiglio — due dei quattro pezzi semplicemente non ci sono. Non c'è nessun payload di evento, quindi la base si calcola da soli con `git merge-base origin/main HEAD`, e non c'è nessuna pull request su cui commentare, quindi il link va dove il tuo team legge davvero: un messaggio di chat, un'annotazione di build, un'email. Quello che viaggia inalterato è il diff e la richiesta, e la richiesta è la parte che vale la pena progettare con cura, perché [un'API di conversione è utile solo quanto i suoi messaggi di errore e i suoi limiti pubblicati](/blog/converting-documents-with-an-api). Se il job converte un intero albero invece di una manciata di file cambiati, [enumerare e ordinare i file è la metà più difficile](/blog/batch-convert-markdown-files).

## Come scegliere cosa pubblicare

1. **Capisci chi è il lettore prima di scegliere una destinazione.** Se chiunque la cui approvazione conta ha un account GitHub, il rich diff e un artefatto sono gratis e puoi smettere di leggere; il workflow guadagna il suo tenersi solo quando uno dei lettori non ce l'ha, perché a quel punto un link è l'unico artefatto che funziona.
2. **Pubblica al push sul branch di default a meno che tu non abbia davvero bisogno dell'anteprima prima del merge.** Elimina la domanda sul fork, quella sul token e metà delle modalità di fallimento in una mossa sola, e il costo è che la revisione avviene comunque sul diff.
3. **Non ricorrere mai a `pull_request_target` per far funzionare le anteprime dai fork.** Consegna i tuoi segreti a un job che sta per fare il checkout del codice di qualcun altro, e la modalità di fallimento non è un'esecuzione rossa che puoi correggere, è una chiave che devi ruotare e una cronologia che devi controllare.
4. **Proteggi il passo di pubblicazione così che i casi scomodi vengano saltati invece di fallire.** Nessun Markdown cambiato, oppure la pull request viene da un fork: un'esecuzione verde con un passo saltato mantiene il controllo affidabile, e un controllo di cui nessuno si fida è un controllo che nessuno legge quando alla fine conta davvero.
5. **Mantieni un commento per pull request e un documento per push.** Un commento perché un thread di quindici è un thread che nessuno scorre fino in fondo; un nuovo documento per push perché sovrascrivere una pagina rende bugiardo ogni link nel thread su quale commit descriva.
6. **Conta le richieste prima di distribuire.** Venti file in un job solo sono venti chiamate; venti job sono venti runner, venti checkout e due limiti di frequenza, e un limite rifiuta invece di mettere in coda.
7. **Controlla cosa vede il revisore, non cosa dice l'esecuzione.** Apri il link dal commento, disconnesso, su un telefono, e guarda se è il documento. Un workflow può essere verde dall'inizio alla fine e stare comunque pubblicando una pagina vuota.

Rivedere la prosa in un diff è indovinare, e l'intera correzione è un file solo: un trigger con un filtro `paths`, un gruppo di concorrenza, due permessi, un segreto, e un passo che pubblica quello che il branch ha cambiato e lascia un link dove un revisore lo vedrà davvero. Comincia dal repository il cui Markdown è letto da qualcuno che non scrive codice, apri una pull request contro un file che ha bisogno di una modifica vera, e guarda se il primo commento che torna riguarda il testo invece della formattazione. Per vedere che aspetto ha l'output prima di coniare una chiave per questo, converti prima il file a mano — [la conversione da Markdown a HTML di TransformPipe](/) gira nel tuo browser, gratis, e disconnesso il file non viene caricato da nessuna parte.

## Domande frequenti

### Posso fare l'anteprima del Markdown da una pull request aperta su un fork?

Non con un segreto, ed è voluto. Un evento `pull_request` da un fork riceve un `GITHUB_TOKEN` di sola lettura e nessun segreto del repository, quindi il passo di pubblicazione non ha una chiave e il passo del commento non ha lo scope di scrittura. Pubblica invece al push sul branch di default, oppure proteggi il passo così che la pull request da un fork lo salti in modo pulito.

### `pull_request_target` è mai sicuro?

Solo quando il job non tocca mai il contenuto della pull request — nessun checkout della testa, niente esecuzione di qualcosa dal branch, nessuna installazione di dipendenze che potrebbe eseguire uno script da esso. Per l'etichettatura e il triage questo è raggiungibile. Per qualunque cosa legga i file del collaboratore, usa lo schema a due workflow con `workflow_run`, oppure non farlo affatto.

### Perché il mio workflow non fa niente quando faccio push?

Di solito il filtro `paths`: viene valutato contro i file che la pull request ha cambiato, quindi un push che non ha toccato nessun file corrispondente non mette mai in coda un'esecuzione. La trappola collegata è rendere un workflow filtrato da `paths` un controllo di stato richiesto — non riporta mai niente sulle pull request che salta, quindi il merge aspetta un controllo che non arriverà mai.

### Serve davvero `fetch-depth: 0`?

Solo se qualcosa nel job fa il diff contro il commit di base, che è come viene costruito l'elenco dei file cambiati. Un clone superficiale non contiene quel commit, quindi il diff fallisce o non riporta niente. Nominare i file esplicitamente lo evita, e lo stesso fa un'azione che chiede l'elenco all'API di GitHub invece che a git.

### Come fermo il bot dal commentare a ogni push?

Disattiva il commento proprio dell'azione con `comment: false` e posta invece un commento fisso, con una chiave su un'intestazione così che lo stesso commento venga riscritto sul posto a ogni esecuzione. Mantieni comunque i link distinti per ogni push, però — riusare un documento solo per ogni commit fa sì che i link più vecchi nel thread descrivano un testo che non esiste più.

### Cosa succede quando una pull request tocca venti file?

L'azione pubblica venti documenti da un job solo e commenta una tabella di venti righe, il che va bene. Concatenarli in un documento solo con `merge: true` di solito è meglio per un lettore. Una matrice di venti job paralleli è l'opzione da evitare: più costo di configurazione che costo di conversione, e due limiti di frequenza che aspettano alla fine.

### Posso farlo senza un account o una chiave API?

Sì, con meno. Converti il file in un browser e incolla tu stesso il link, oppure fai allegare al workflow l'HTML renderizzato come artefatto, il che non richiede nessuna chiave e nessun account — il lettore deve solo avere fatto l'accesso a GitHub per scaricarlo. La chiave compra una cosa sola: un link che si apre per qualcuno che non ha nessun account GitHub.
