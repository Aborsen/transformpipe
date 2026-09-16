---
title: "Riassunti AI gratuiti per Markdown, HTML e altri documenti"
description: "I modi gratuiti per riassumere con l’AI un documento Markdown, HTML, Word o CSV: il riassunto integrato, una chat gratuita e quanto costa ognuno in tempo o privacy"
date: 2026-09-14
tag: Workflow
keywords: riassunto ai gratis, riassumere documento con ai, riassumere file markdown, riassumere file html, strumento riassunto documenti gratuito, riassunto ai senza caricare file, riassumere pdf e documenti con ai gratis
---

Un documento arriva nella tua cronologia con un nome e una dimensione, e nessuno dei due ti dice se valga la pena aprirlo. Un riassunto sì — tre frasi che dicono che cosa sia davvero quella cosa, prima che tu ti impegni a leggerla. Ottenerlo, fino a poco fa, voleva dire copiare il testo da qualche parte dove ci fosse un modello AI dietro, che è un costo reale per un documento che stavi cercando di evitare di leggere.

### In breve

**Un convertitore con il riassunto integrato** è la strada con meno attrito: converti o salva il documento, fai clic su Riassunto e torna indietro un risultato in cache — niente copia-incolla, nessun account separato, niente da incollare. [Il riassunto di TransformPipe](/) usa direttamente il modello Gemini Flash di Google, da tre a cinque frasi semplici, messe in cache sul documento perché siano calcolate una volta e lette molte, gratis fino a 20 riassunti al giorno per account. **Un modello di chat gratuito** — ChatGPT o l’app Gemini, entrambi utilizzabili gratuitamente e senza carta di credito — funziona per qualunque documento tu sia disposto a incollare a mano, senza limite giornaliero sulla conversazione in sé ma anche senza cache, senza API e senza alcuna memoria una volta chiusa la chat. **Notion AI** riassume le pagine in modo nativo, ma solo con un piano Business a pagamento da $20 per membro al mese (verificato su notion.com, 14 settembre 2026) — gli spazi di lavoro gratuiti e Plus ottengono una prova limitata, non la cosa vera. Qualunque tu scelga, la domanda onesta è dove finisce il testo prima che tu incolli un contratto o una cartella clinica dentro uno di questi strumenti.

## Che cosa significa davvero “gratis” qui

Ogni opzione qui sotto è gratuita nel senso ordinario — nessuna carta richiesta per provarla — ma “gratis” nasconde differenze reali appena guardi che cosa succede dopo. Un riassunto che generi una volta e non rivedi mai più ti costa il tempo di reincollare il testo fra una settimana. Un riassunto messo in cache sul documento è già lì quando lo apri, senza che tu debba chiedere di nuovo. E un riassunto generato da un servizio che conserva il tuo testo per addestrare qualcosa è un genere di gratis diverso da uno che non lo fa, qualunque cosa dica il cartellino del prezzo.

## Confronto rapido: il bigliettino

| Strumento | Ideale per | Capacità principale | Prezzo |
| --- | --- | --- | --- |
| Il riassunto integrato di TransformPipe | Un documento già presente nella tua cronologia | In cache sul documento, rigenerabile su richiesta, nessun incolla separato | Gratis, 20 al giorno per account |
| ChatGPT (piano gratuito) | Un documento che hai aperto e puoi incollare | Chat di testo gratuita e illimitata da agosto 2026 | Gratis |
| Google Gemini (app, piano gratuito) | Lo stesso, sulla famiglia di modelli di Google | Gemini Flash e Flash-Lite, tetti giornalieri di richieste | Gratis |
| Notion AI | Una pagina che vive già dentro Notion | Riassume e scrive dentro la pagina stessa | Solo piano Business, $20 per membro al mese |
| Un modello locale open source | Qualunque cosa non debba lasciare la tua macchina | Gira interamente offline, nessun account | Gratis, richiede configurazione |
| Copiare dentro una chat qualsiasi | Una volta sola, ovunque tu abbia già una finestra di chat | Nessuno strumento nuovo da imparare | Gratis, la qualità dipende dal modello |

## Il riassunto integrato di TransformPipe — nessun incolla separato

Una volta che un documento è stato convertito o salvato, una scheda Riassunto compare accanto ad Anteprima e Sorgente. Aprirla la prima volta chiama il modello; aprirla di nuovo legge il risultato in cache, perché il senso della cache è che un documento che controlli due volte non debba pensare due volte.

| Pro | Contro |
| --- | --- |
| Nessun testo da copiare da nessuna parte — il documento è già lì | 20 riassunti al giorno per account, non illimitati |
| In cache: il modello gira una volta, il risultato si legge quante volte vuoi | Da tre a cinque frasi per scelta — non un sostituto della lettura di un documento che ti serve davvero nel dettaglio |
| Un pulsante “Rigenera” per quando il documento è cambiato e il riassunto in cache no | Richiede prima che il documento sia salvato su un account — un file convertito ma non salvato non ha nulla su cui mettere in cache il riassunto |
| Disponibile anche via API (`POST /api/v1/documents/:id/summary`), così anche uno script può chiedere la stessa cosa | Richiede che l’installazione abbia una chiave Google AI configurata — chi lo ospita da sé deve usare la propria |

**Prezzo:** gratis, 20 al giorno per account. L’API e la CLI (`tp summary <id>`) attingono alla stessa quota.

**Dettagli tecnici.** Il modello è Gemini Flash di Google, chiamato direttamente con una chiave Google AI Studio invece che attraverso un gateway a pagamento — una scelta progettuale fatta apposta perché mantiene disponibile un piano gratuito reale invece di passare per una quota condivisa. Il prompt si ferma ai primi 60.000 caratteri del documento e chiede da tre a cinque frasi semplici, senza titoli e senza ripetere il titolo, con la modalità di ragionamento esteso del modello disattivata deliberatamente: un riassunto di tre frasi non ha bisogno di un modello che passi il tempo a decidere come esprimersi.

**Per chi è?** Per chiunque abbia in cronologia più documenti di quanti ne riesca a tenere a mente e stia scegliendo quale aprire dopo, o verificando che un salvataggio abbia davvero catturato quello che voleva conservare — senza un secondo strumento, una seconda scheda o un secondo account. Se il documento è uscito da un modello in primo luogo, [trasformare quell’output in una pagina leggibile](/blog/ai-output-to-a-shareable-page) è lo stesso flusso di lavoro un passo prima.

## Il piano gratuito di ChatGPT — incolla e basta, nessun limite sulla conversazione

Da agosto 2026 OpenAI ha rimosso del tutto il tetto di messaggi sulla chat testuale del piano gratuito (riportato all’epoca da Engadget e altri) — gli account gratuiti possono tenere conversazioni lunghe quanto vogliono, anche se restano tetti separati per la generazione di immagini, il caricamento di file e la voce, e l’accesso gratuito è limitato al modello più piccolo tra quelli attuali di OpenAI.

| Pro | Contro |
| --- | --- |
| Nessun limite giornaliero sulla conversazione testuale | Ogni documento è un incolla manuale — niente cronologia, niente cache, nessun “apri questo documento e guarda il suo riassunto” |
| Nessun costo di account, in assoluto | L’accesso ai modelli nel piano gratuito è limitato al più piccolo della gamma attuale |
| Funziona su tutto ciò che riesci a incollare — Markdown, testo semplice, una tabella incollata | Nessun accesso API nel piano gratuito, quindi nessuno script può chiamarlo |
| Interfaccia familiare se già la usi per altro | Che fine fa il testo incollato dipende dalle impostazioni sui dati del tuo account — controllale prima di incollare qualcosa di delicato |

**Prezzo:** gratis per la chat testuale; i piani a pagamento aggiungono modelli più grandi, limiti di caricamento più alti e l’accesso API.

**Per chi è?** Per un riassunto una tantum di un documento che hai davanti adesso, senza nessun interesse a ritrovare lo stesso riassunto automaticamente la prossima volta che apri il file. Se vuoi che l’assistente faccia anche la conversione e la condivisione, non solo la lettura, [un connettore è la strada più corta di una finestra di chat](/blog/converting-documents-from-an-assistant).

## L’app Gemini di Google, piano gratuito

La stessa famiglia di modelli che il riassunto integrato chiama via API è disponibile anche direttamente, nell’interfaccia di chat di Google, senza carta di credito.

| Pro | Contro |
| --- | --- |
| Gratis e senza carta, su gemini.google.com e nelle app per telefono | Il piano gratuito si ferma intorno a 1.000 richieste al giorno con un limite al minuto, non è illimitato |
| I modelli Flash e Flash-Lite restano gratuiti; quelli di livello Pro sono passati dietro un piano a pagamento ad aprile 2026 | Stessa forma “incolla e dimentica” di qualunque finestra di chat — nessuna cronologia dei documenti |
| La stessa qualità di modello che otterresti da una chiamata API a pagamento | Una finestra di chat, non uno strumento per documenti — niente conversione, niente cache, niente link di condivisione |

**Prezzo:** piano gratuito a $0; i piani a pagamento partono da $4.99 al mese per più margine.

**Per chi è?** Per chi vuole proprio Gemini, fuori da qualsiasi convertitore, per documenti che si sente tranquillo a incollare in una chat generalista.

## Notion AI — nativo, ma non nel piano gratuito

Se il documento vive già dentro Notion, Notion AI può riassumere la pagina sul posto, scrivere testo e rispondere a domande su di essa — davvero comodo quando il riassunto è una cosa in più da fare senza uscire dalla pagina.

| Pro | Contro |
| --- | --- |
| Riassume e scrive senza uscire dalla pagina su cui il documento sta già | L’accesso completo all’AI richiede il piano Business, $20 per membro al mese (verificato su notion.com, 14 settembre 2026) |
| Nessuno strumento separato e nessun incolla — legge la pagina a cui è già attaccato | Gli spazi gratuiti e Plus ottengono solo una prova limitata delle funzioni AI, non un uso continuativo |
| Utile oltre il riassunto: scrittura, compilazione automatica dei database, note di riunione | Aiuta solo i documenti che sono pagine di Notion — niente fuori dallo spazio di lavoro |

**Prezzo:** incluso nel piano Business; dal 2026 non è più disponibile come componente aggiuntivo a sé.

**Per chi è?** Per un team che paga già Notion Business, dove il documento in questione è una pagina e non un file da convertire o condividere altrove.

## Un modello locale open source — niente lascia la macchina

Per un documento che davvero non deve raggiungere una rete — legale, medico, non ancora pubblicato — un modello open source eseguito in locale (Llama, Mistral o simili, tramite un runner come Ollama o LM Studio) elimina la domanda su dove finisca il testo, perché il testo non esce mai.

| Pro | Contro |
| --- | --- |
| Non si invia nulla, mai — l’unica risposta onesta per i documenti più delicati | Configurazione vera: un’installazione, il download di un modello da diversi gigabyte e hardware in grado di farlo girare in modo accettabile |
| Nessun account, nessuna quota, nessun limite di frequenza una volta avviato | La qualità dei riassunti resta dietro a quella dei modelli ospitati più grandi, anche se il divario si è ridotto parecchio |
| Funziona offline, all’infinito, senza costi ricorrenti | Nessuna cache e nessuna cronologia dei documenti, a meno che non te la costruisca da solo |

**Prezzo:** gratis, open source; il costo è il tuo tempo e la tua macchina, non un abbonamento.

**Per chi è?** Per chiunque abbia come vincolo reale “questo non può uscire dalla mia macchina” e non “questo deve essere veloce” — sono due problemi diversi con due risposte giuste diverse.

## Dove un riassunto rende di più: il documento che prima erano cinquanta documenti

Il caso in cui un riassunto serve meno è quello che tutti provano per primo: un documento che hai scritto tu la settimana scorsa. Sai già che cosa dice; il riassunto non ti dice niente.

Il caso in cui serve davvero è l’export unito: un intero spazio di lavoro Notion, uno spazio Confluence o un vault Obsidian trasformati in un unico documento Markdown. [Tutti e tre gli export arrivano come uno zip di tante pagine](/blog/markdown-from-notion-obsidian-and-confluence), e unirli produce un singolo documento accurato, completo e del tutto illeggibile a colpo d’occhio — quarantamila parole con un indice, dove l’indice elenca titoli di pagina scritti da qualcuno per un wiki, non per chi legge.

È esattamente la forma che un riassunto di tre frasi sistema. Converti l’export, salvalo, e il riassunto risponde alla domanda “che cosa c’è davvero dentro” senza aprirlo — che è la domanda che ti fai su uno spazio di lavoro archiviato un anno dopo, e quella a cui nessuno può rispondere guardando un nome di file.

| Origine | Dimensione tipica dopo l’unione | A che cosa risponde il riassunto |
| --- | --- | --- |
| [Un export di Notion](/notion-to-markdown) | Ogni pagina dello spazio di lavoro, in ordine | Per quale progetto o squadra era questo spazio, e all’incirca quando |
| [L’export di uno spazio Confluence](/confluence-to-markdown) | Ogni pagina dello spazio, con le macro appiattite | Se questo spazio era documentazione, note di riunione o un registro di decisioni |
| [Un vault Obsidian](/obsidian-to-markdown) | Ogni nota, con i wikilink risolti in parole semplici | Di che cosa parlava davvero il vault, sotto una struttura di cartelle che capiva solo chi l’ha creata |

La quota conta meno di quanto sembri, qui. Venti riassunti al giorno sono pochissimi per uno script che percorre una cartella e tanti per una persona che decide quale degli export archiviati dell’ultimo trimestre aprire — e il risultato resta in cache sul documento, quindi ricontrollare lo stesso archivio il mese prossimo non costa nulla.

## La domanda onesta: dove va il testo prima che tu lo incolli?

Ogni opzione gratuita qui sopra comporta che il testo del tuo documento raggiunga il modello di qualcun altro, tranne quella locale — non è una critica, è il patto che ogni funzione AI ospitata accetta, e l’unica versione disonesta di questo articolo sarebbe quella che finge il contrario. Quello che cambia è che cosa succede a quel testo dopo: se venga usato per addestrare qualcosa, per quanto tempo venga conservato e se le condizioni di un piano gratuito siano diverse da quelle di uno a pagamento. Leggi la pagina delle impostazioni vera dello strumento che usi prima di dargli in pasto un documento che non vorresti vedere riutilizzato — la nota sulla privacy di un convertitore è un inizio, non un sostituto della policy di chi fornisce il modello.

## Come scegliere

1. **Chiediti se ti servirà di nuovo, il riassunto.** Un riassunto in cache su un documento che conservi batte ogni volta una trascrizione di chat da ritrovare, quando vuoi ricontrollare lo stesso documento due volte.
2. **Chiediti dove vive già il documento.** Una pagina di Notion vuole Notion AI, se lo stai già pagando; un file vuole uno strumento che legga i file invece di pretendere un incolla manuale.
3. **Conta quanto spesso lo fai.** Venti al giorno sono tanti per una persona e pochi per uno script che processa una cartella — sappi quale dei due sei prima di sbattere contro il tetto.
4. **Decidi che cosa significhi davvero “non deve lasciare la macchina” per questo documento.** Se la risposta onesta è “niente ospitato”, la strada locale è l’unica davvero coerente, non la più rapida da configurare.
5. **Controlla i limiti veri del piano gratuito prima di farci affidamento.** Un piano gratuito che ha cambiato i suoi tetti negli ultimi sei mesi è abbastanza comune in questa categoria da rendere “verificato oggi sulla pagina del fornitore” migliore di un confronto di un anno fa — questo compreso.

## Conclusione

Un riassunto AI gratuito di un documento è davvero disponibile per diverse strade oneste, e le differenze che contano non riguardano la qualità del riassunto — i modelli sottostanti sono abbastanza vicini, per tre frasi, che la maggior parte delle persone non li distingue. Quello che cambia è l’attrito: se il riassunto è lì quando riapri il documento, se ha richiesto un incolla manuale, e se al documento è mai stato permesso di lasciare la tua macchina. Per un documento già presente in [TransformPipe](/), il riassunto integrato risponde ai primi due punti senza chiedere; per tutto il resto, un modello di chat gratuito è a un incolla di distanza, e un modello locale è l’unica risposta alla terza domanda che non richiede di fidarsi di nessuno.

## Domande frequenti

### Esiste un modo davvero gratuito di riassumere un documento con l’AI?

Sì, più di uno. Un convertitore con un riassuntore integrato che gira su un modello di piano gratuito, un account di chat gratuito come ChatGPT o l’app Gemini in cui incollare il testo, e un modello open source eseguito in locale sono tutti gratuiti e senza carta di credito — cambiano per comodità e per il fatto che il tuo testo raggiunga o meno un server.

### Un riassuntore AI gratuito conserva il mio documento?

Dipende interamente dallo strumento. Un riassunto in cache su un documento che hai già salvato vive insieme a quel documento secondo le regole del tuo account; la cronologia di una finestra di chat dipende dalle impostazioni di conservazione di quel servizio, che vale la pena leggere prima di incollare qualcosa di delicato. Un modello locale non conserva nulla da nessuna parte, perché nulla ha lasciato la tua macchina.

### Quanto dovrebbe essere lungo il riassunto AI di un documento?

Da tre a cinque frasi semplici bastano a decidere se aprire il documento intero — che è il lavoro vero di un riassunto. I riassunti più lunghi iniziano a competere con il documento stesso per la tua attenzione, e a quel punto tanto vale leggere la fonte.

### Posso ottenere un riassunto AI senza caricare il mio file da nessuna parte?

Sì, con un modello locale — il file e il modello restano entrambi sulla tua macchina, quindi per definizione non si carica nulla. Se non è praticabile, uno strumento che lavora nel browser e invia solo il testo estratto a un’API di riassunto, invece di conservare altrove il file originale, è l’opzione più vicina.

### Notion AI è incluso nel piano gratuito di Notion?

No — gli spazi di lavoro Notion gratuiti e Plus ottengono una prova limitata delle funzioni AI, e l’accesso continuativo completo richiede il piano Business da $20 per membro al mese, al 2026. Se riassumere è l’unica funzione AI che ti interessa e il documento non è già una pagina di Notion, un riassuntore gratuito a sé è la strada più economica.

### Posso riassumere in un colpo solo un intero export di Notion o Confluence?

Sì, se prima lo unisci in un unico documento — uno zip di export con tante pagine diventa un solo documento Markdown con un indice, e il riassunto descrive allora l’insieme e non una delle sue pagine. È il caso in cui un riassunto vale di più, perché un export unito da quarantamila parole è esattamente il documento che nessuno apre per scoprire che cos’era.

### Il riassunto viene rifatto ogni volta che apro il documento?

Non dovrebbe, e uno strumento che lo rifà sta consumando la tua quota in silenzio. Un riassunto in cache si calcola una volta, si conserva insieme al documento e si legge a ogni apertura successiva — con un comando di rigenerazione per il caso in cui il documento sia cambiato e le frasi in cache non lo descrivano più.

### Che differenza c’è tra il piano gratuito di ChatGPT e quello a pagamento?

Da agosto 2026 la chat testuale del piano gratuito non ha più un tetto di messaggi, ma gli account gratuiti sono limitati al modello più piccolo tra quelli attuali di OpenAI e hanno tetti separati e più stretti su generazione di immagini, caricamento di file e voce — e nessun accesso API, il che conta se vuoi che a riassumere sia uno script e non una finestra di chat.
