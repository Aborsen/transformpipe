---
title: "Mi serve un generatore di siti statici? Una guida alla decisione"
description: Un generatore di siti statici ti vende navigazione, template, ricerca e taxonomie, e in cambio ti fa pagare una toolchain. Tre domande decidono se ti serve davvero.
date: 2026-09-04
tag: Pubblicazione
keywords: mi serve un generatore di siti statici, generatore di siti statici o convertitore, alternativa a un generatore di siti statici, mkdocs contro convertitore, quando usare un generatore di siti statici, da markdown a html senza build, il modo più semplice di pubblicare markdown
---

Hai una cartella di file Markdown e da qualche parte devono finire. I consigli che trovi dicono di installare un generatore di siti statici, ce ne sono sei credibili, e ognuno ha una pagina introduttiva che finisce con un sito funzionante in quattro comandi. Nessuna di quelle pagine ti chiede se ti serviva un sito.

Quella è la vera decisione, e di solito viene presa al contrario: prima si scegli lo strumento, poi il requisito viene tirato per farlo entrare. Un generatore è un sistema di build. Si aspetta una cartella organizzata a modo suo, un file di configurazione, un linguaggio di template, un tema, un lockfile e un posto dove pubblicare l'output. In cambio ti dà capacità reali che un convertitore file-per-file non ha: un albero di navigazione calcolato dai file, link tra le pagine che rompono la build quando marciscono, un indice di ricerca, un elenco per tag. Se ti servono queste cose, niente altro basta. Se non ti servono, hai preso in carico una toolchain per produrre pagine che un convertitore avrebbe prodotto senza.

La parte scomoda è che il costo non arriva il giorno dell'installazione. Arriva undici mesi dopo, quando un avviso di sicurezza costringe ad aggiornare una dipendenza, il tema non è stato rilasciato per la nuova versione major, e chi aveva scelto il generatore ha cambiato lavoro.

### In breve

Ti serve un generatore di siti statici quando le pagine devono conoscersi a vicenda — navigazione condivisa, link tra pagine controllati, un indice di ricerca, elenchi per tag o versione — o quando l'output deve essere ricostruito automaticamente ogni volta che la fonte cambia. Non ti serve per un documento con un destinatario, né per una manciata di pagine tra cui nessuno naviga; per quello bastano un convertitore e un link, e non c'è niente da mantenere. Il numero di file è il criterio sbagliato: cinquanta note non collegate non hanno bisogno di nessun generatore, e tre pagine interdipendenti che devono ripubblicarsi a ogni merge sì. Se sei incerto, pubblica prima con un convertitore — la migrazione verso un generatore più avanti è fastidiosa ma limitata, e la toolchain che non hai mai installato non costa niente da tenere in vita.

## Cosa ti dà un generatore, e cosa ti fa pagare per averlo

### Le capacità, descritte come capacità

Le pagine di marketing descrivono i generatori con aggettivi. La descrizione utile è un elenco di cose che fanno e che un convertitore non fa, perché è quello che stai comprando.

**Un albero di navigazione derivato dai file.** Il generatore percorre la tua cartella sorgente, legge il front matter e costruisce una barra laterale e un breadcrumb da quello che trova. Aggiungi un file, e appare nel menu. Un convertitore non ha una cartella; ha il singolo file che gli hai dato, e non può sapere cosa esiste altrove.

**Template, applicati a ogni pagina.** Un solo file di layout, e ogni pagina riceve la stessa intestazione, lo stesso footer, lo stesso link canonico e lo stesso tag di analytics. Cambi il layout e cambiano 200 pagine. Un convertitore applica un foglio di stile a un documento; non applica un involucro condiviso a un insieme.

**Link tra pagine, verificati.** I generatori risolvono i link interni contro l'albero dei file, e la maggior parte fa fallire la build quando un link punta a una pagina che non esiste più. Questo singolo comportamento è l'argomento più forte per un generatore su un set di documentazione, perché il marciume dei link nella documentazione è silenzioso e costante.

**Un indice di ricerca.** Ricerca full-text su tutto l'insieme, costruita in fase di compilazione, servita come file JSON che la pagina carica. Non lo puoi ottenere da file convertiti. La ricerca del browser cerca in un documento; una casella di ricerca li cerca tutti.

**Taxonomie.** Tag, categorie, versioni, autori — ognuno diventa una propria pagina generata di elenco, con paginazione. L'elenco non esiste come file sorgente; è calcolato. È così che si costruiscono un indice di blog, una pagina "tutte le pagine con tag API" e un selettore di versione.

**Build incrementali e un server con ricarica live.** Un generatore sa quali output dipendono da quali input, quindi una modifica di un carattere ricostruisce una pagina invece di tutte, e il browser si aggiorna mentre scrivi. Su un insieme grande è la differenza tra un ciclo di modifica in cui puoi lavorare e uno che devi aspettare, il che nell'arco di un anno è la differenza tra documentazione che viene corretta e documentazione abbandonata.

**Una pipeline di asset.** Immagini ridimensionate e con fingerprint, Sass compilato, CSS e JavaScript raggruppati e con hash per l'invalidazione della cache. L'output punta a `style.a83f1c.css`, e puoi impostarci un header di cache di un anno senza timore.

**Feed, sitemap e redirect.** RSS, `sitemap.xml`, e una mappa di redirect così un vecchio URL continua a funzionare dopo che hai spostato una pagina. Ognuno è un lavoro noioso e ognuno è un vero lavoro che qualcosa deve fare.

### I costi, descritti come costi

**Una toolchain.** Un runtime di cui prima non avevi bisogno su ogni macchina che costruisce il sito: Python per MkDocs e Sphinx, Node per Docusaurus ed Eleventy, un binario Go o Rust per Hugo e mdBook. Poi lo stesso runtime, a una versione compatibile, in CI.

**Un lockfile, e l'albero che ci sta sotto.** Un generatore JavaScript con un tema e una mezza dozzina di plugin risolve verso un grande grafo di dipendenze, e ogni voce al suo interno è qualcosa che può pubblicare un breaking change o un avviso di sicurezza. È la differenza più grande tra i generatori basati su Node e quelli compilati.

**Una build che si rompe un anno dopo.** Non per niente che hai fatto tu. Una dipendenza transitiva smette di supportare la tua versione di runtime, un tema fissa una peer dependency che non si risolve più, l'immagine CI sposta in avanti la versione major del suo runtime predefinito. Il sito è invariato e non si costruisce più.

**Un tema che adesso mantieni tu.** Il tema di ogni generatore è uno che hai scritto tu, nel qual caso ne possiedi per sempre l'accessibilità, la modalità scura e il layout mobile, oppure uno scritto da qualcun altro, nel qual caso possiedi l'aggiornamento ogni volta che cambia. I temi sono dove vive quasi tutta la manutenzione reale di un generatore.

**Configurazione come cosa da imparare.** Un linguaggio di template — Go templates, Jinja, Nunjucks, JSX, Handlebars — più le convenzioni proprie del generatore per il front matter e le regole di cartella. Niente di tutto questo si trasferisce al generatore successivo.

**Qualcuno deve saperlo usare.** È il costo che le persone non prezzano. Un generatore è economico solo finché chi lo ha configurato è ancora in giro e se lo ricorda ancora. Nel momento in cui diventa "il sito della documentazione che nessuno capisce", ogni modifica banale diventa un piccolo progetto di ricerca, e i piccoli progetti di ricerca non si fanno.

## Il numero di documenti è l'asse sbagliato

L'istinto è decidere per volume: un file, usa un convertitore; cinquanta file, usa un generatore. È il test sbagliato, e produce entrambi i modi di fallire. Qualcuno con cinquanta note di riunione non collegate tra loro installa Docusaurus e adesso mantiene React per pubblicare del testo. Qualcuno con tre pagine interdipendenti che devono restare aggiornate dopo ogni merge le converte a mano ed entro due settimane sono già vecchie.

Sono tre domande a decidere davvero, e riguardano tutte relazioni e processi, non conteggi.

| La domanda | Se sì | Se no |
| --- | --- | --- |
| Le pagine devono conoscersi a vicenda? | Ti serve navigazione condivisa, link controllati, un indice di ricerca, elenchi per tag — le cose che solo una build sull'intero insieme può calcolare. Quello è un generatore, o una piattaforma che lo è. | Ogni pagina sta da sola. Un convertitore per documento non è un compromesso; è la forma corretta, e non c'è niente da mantenere in vita tra una pubblicazione e l'altra. |
| Deve ripubblicarsi secondo un calendario o a ogni modifica? | Qualcosa deve girare senza supervisione. Significa un comando, in CI, con versioni fissate — un generatore, o un convertitore più uno script, ma in ogni caso automatizzato. | Una persona che pubblica quando se ne ricorda va bene, e una persona non può eseguire una build in modo affidabile. La conversione manuale è onesta; un passaggio di build manuale è una bugia che ti racconti. |
| Chi deve eseguirla? | Se la risposta include chiunque non usi un terminale, la build deve stare dietro un bottone — un job CI al merge, o una piattaforma ospitata. Un passaggio di build locale li esclude permanentemente. | Se le uniche persone che pubblicano sono quelle che hanno scritto la toolchain, una build locale va bene e il costo di manutenzione resta con chi l'ha scelta. |

La prima domanda riguarda la struttura dell'output. La seconda riguarda se una persona è nel ciclo. La terza riguarda chi resta bloccato quando la toolchain si comporta male, ed è la domanda che più spesso cambia la risposta.

Due sì su tre, e installa il generatore. Tre no, e stai guardando un convertitore e un link. Un sì di solito significa l'opzione di mezzo: un convertitore guidato da uno script, che è un passaggio di build senza un sistema di build.

## Le opzioni oneste, una accanto all'altra

Ogni riga qui è una risposta reale per qualcuno. I generatori sono elencati con il linguaggio in cui sono scritti, perché è il runtime che stai accettando di installare, e con la loro licenza, perché è stabile e verificabile in un modo in cui gli elenchi di funzioni non lo sono.

| Opzione | Cosa produce | Cosa richiede | Chi lo esegue | Adatto a | Costo |
| --- | --- | --- | --- | --- | --- |
| Un convertitore, un file alla volta | Un file HTML autonomo, o un link | Un browser | L'autore, su richiesta | Un documento con un destinatario; un report; output di un modello; qualunque cosa avresti altrimenti inviato per email come `.md` | Gratis |
| Un convertitore più uno script in CI | Una cartella di file HTML, o un documento unito | Una CLI o un'API, un file di workflow | Il runner CI, a ogni push | Una manciata di pagine in un repository che devono restare aggiornate, senza bisogno di template | Gratis; minuti CI |
| MkDocs | Un sito di documentazione con nav e ricerca | Python | L'autore in locale, o CI | Documentazione di progetto scritta in Markdown da sviluppatori | Gratis, BSD-2-Clause (verificato su github.com, il 9 settembre 2026) |
| Docusaurus | Un sito di documentazione React con versioning e i18n | Node, e conoscenza di React per qualsiasi personalizzazione | CI, in pratica | Documentazione di prodotto versionata con un team front-end dietro | Gratis, MIT (verificato su github.com, il 9 settembre 2026) |
| Hugo | Da documentazione a un grande sito di contenuti | Un singolo binario scaricato; Git, Go o Dart Sass per alcune funzioni | Chiunque abbia il binario | Grandi siti di contenuti; team che non vogliono nessun package manager | Gratis, Apache-2.0 (verificato su github.com, il 9 settembre 2026) |
| Eleventy | Quello che imposti tu nei template, senza struttura imposta | Node | L'autore o CI | Persone che vogliono una build con quante meno opinioni possibile | Gratis, MIT (verificato su github.com, il 9 settembre 2026) |
| mdBook | Un libro lineare con indice e ricerca | Un singolo binario scaricato | Chiunque abbia il binario | Manuali, guide, qualsiasi cosa letta dall'inizio alla fine | Gratis, MPL-2.0 (verificato su github.com, il 9 settembre 2026) |
| Sphinx | Documentazione di riferimento con cross-reference ed estrazione API | Python; MyST-Parser per scrivere in Markdown | CI, di solito | Progetti Python; qualunque cosa richieda un vero cross-referencing e autodoc | Gratis, BSD-2-Clause (verificato su github.com, il 9 settembre 2026) |
| Una piattaforma di documentazione | Un sito di documentazione ospitato, costruito per te | Un account, e il tuo repository collegato | La piattaforma | Team che vogliono che la build sia il problema di qualcun altro | Read the Docs Community è "gratis, per sempre" per l'open source; i piani commerciali sono Basic 50 $, Advanced 150 $ e Pro 250 $ al mese, Enterprise da 10.000 $ all'anno (verificato su about.readthedocs.com, il 9 settembre 2026) |
| Il renderer del repository stesso | Markdown reso a un URL del repository | Niente | Nessuno | Documentazione interna letta da persone che hanno già accesso al repository | Gratis |

L'ultima riga è l'opzione che le persone si scordano, e per la documentazione interna di ingegneria è spesso quella corretta. GitHub e GitLab renderizzano entrambi documenti Markdown tenuti in un repository, tabelle ed elenchi di attività incluse, all'URL del file stesso (verificato su docs.github.com e docs.gitlab.com, il 9 settembre 2026). Non c'è build, non c'è tema e non c'è deploy. Quello che perdi è un albero di navigazione, una casella di ricerca limitata alla tua documentazione invece che a tutto il repository, e qualsiasi controllo sulla presentazione — e per una cartella `docs/` letta solo da chi ci fa commit, perdere quelle cose può non costare niente. [Documentazione che vive nel repository](/blog/documentation-that-lives-in-the-repo) è più una disciplina che una toolchain, e la disciplina è la parte che conta.

## Caso uno: un documento che deve raggiungere una persona

È il caso più comune di gran lunga e quello più spesso ipertecnologico. Hai scritto qualcosa — una proposta, una nota di consegna, un report, un riassunto prodotto da un assistente — e una persona o un piccolo gruppo deve leggerlo. È finito. Non verrà aggiornato. Nessuno navigherà da lì a un'altra pagina.

Un generatore è la forma sbagliata per questo su ogni asse. Vuole un sito; tu hai un documento. Il suo output è una cartella di file con link relativi tra loro, il che significa che non puoi inviarlo per email — devi ospitarlo, il che significa una destinazione di deploy, il che significa un dominio o un sottopercorso, il che significa che qualcuno deve ricordarsi che esiste.

Quello che il caso richiede davvero è un singolo file che si renda correttamente ovunque finisca. Significa un documento HTML completo invece di un frammento, con gli stili incorporati e nessuna richiesta verso una CDN, così che appaia uguale su un portatile in aereo e sul tuo. [Cosa rende autonomo un file HTML](/blog/self-contained-html-explained) è una proprietà tecnica ristretta ed è tutta la differenza tra un file che sopravvive a essere reinviato e uno che non ci riesce.

| Cosa ti serve | Convertitore | Generatore |
| --- | --- | --- |
| Inviarlo come allegato | Un file, si apre con un doppio clic | Cartella di file con link relativi; non si può allegare in modo utile |
| Inviarlo come link | Un link pubblicato, revocabile | Un deploy, uno schema di URL e un hosting da tenere in vita |
| Nessuna installazione per chi lo invia | Funziona in una scheda del browser | Un runtime e un'installazione di pacchetti |
| Nessuna installazione per chi legge | Un browser | Un browser |
| Aggiornarlo il mese prossimo | Convertire di nuovo | Ricostruire e ridistribuire |
| Mantenere la fonte privata | Conversione lato browser, senza login: niente caricato | La fonte di solito sta in un repository |

**Per chi è:** per chiunque abbia come azione successiva "manda questo a qualcuno". Se il documento ha un destinatario invece di un pubblico, vuoi un file o un link, non un sito. [I modi per condividere un documento Markdown come link](/blog/share-a-markdown-document-as-a-link) copre cosa chiede ciascun metodo al lettore, la parte che decide se lo legge davvero.

L'unica cosa da tenere d'occhio: convertire un documento scritto da qualcun altro, o da un modello, significa convertire testo che può contenere HTML grezzo, perché Markdown lo permette. Un convertitore che sanifica contro una lista consentita gestisce questo caso. Un generatore di solito non sanifica per niente, sull'assunzione ragionevole che tu abbia scritto tu il contenuto del tuo sito.

## Caso due: una manciata di documenti in un repository

Adesso ci sono otto file in `docs/`, cambiano insieme al codice, e qualcuno fuori dal repository deve poterli leggere. È il caso di mezzo, e qui la decisione sul generatore è davvero ravvicinata.

Fai la prima domanda di sopra. Queste otto pagine devono conoscersi a vicenda? Se sono otto riferimenti indipendenti — una guida all'installazione, un runbook, una nota API, un decision record — allora no. Ognuna si legge da sola, raggiunta da un link che qualcuno ha incollato. Se formano una sequenza, o condividono una barra laterale, o una di esse è una pagina di ingresso che elenca le altre, allora sì, e hai un piccolo sito.

Per il caso indipendente, lo strumento onesto è un convertitore con uno script davanti. Un workflow attivato al push converte i file cambiati e li pubblica, e tutto l'apparato è un ciclo di shell e una chiamata CLI o API. Non c'è linguaggio di template, non c'è tema, e non c'è lockfile oltre a quello che la tua CI ha già. [Convertire in un solo passaggio una cartella di file Markdown](/blog/batch-convert-markdown-files) è la parte meccanica; collegarla a un trigger è il resto.

| Approccio | Passaggio di build | Cosa si rompe | Recupero quando si rompe |
| --- | --- | --- | --- |
| Convertire a mano quando ti ricordi | Nessuno | Niente; la documentazione semplicemente invecchia | Ricordarsene di nuovo |
| Convertitore più uno script CI | Un ciclo e una chiamata CLI | Un flag della CLI cambia, o la versione Node del runner si sposta | Leggere l'output di help di un comando |
| Un generatore in CI | Tutta la build del generatore | Un tema, un plugin, una peer dependency, il runtime | Fare il bisect di un albero di dipendenze che non hai scelto tu |
| Una piattaforma di documentazione | La loro | La loro build, sul loro calendario | Aprire un ticket di supporto |

Lo scambio è semplice. Uno script ti dà meno capacità e modi di fallire molto meno numerosi, e i modi di fallire che ha sono leggibili: un comando, un flag, un codice di uscita. Un generatore ti dà navigazione e ricerca e una build che devi capire per riparare.

**Per chi è:** per repository in cui la documentazione è materiale di riferimento più che un prodotto. Se pubblicare a ogni merge è il requisito reale — e di solito lo è, perché la documentazione pubblicata a mano è documentazione non aggiornata — allora [pubblicare Markdown da un workflow di GitHub Actions](/blog/publish-markdown-from-github-actions) è la stessa quantità di lavoro qualunque sia lo strumento dentro il job. Scegli lo strumento in base a cosa dovrai riparare, non a come sembra il lavoro il giorno in cui lo scrivi.

Una cosa che uno script non può fare, e vale la pena saperlo prima di impegnarti: non può dirti che un link dalla pagina tre alla pagina sette si è rotto. Niente percorre l'insieme. Se le tue otto pagine si linkano molto tra loro, quel controllo mancante ti costerà più dell'albero di dipendenze del generatore.

## Caso tre: un vero sito di documentazione

Qui il generatore è la scelta corretta e l'unica domanda è quale. I segnali sono inequivocabili: decine di pagine, un albero di navigazione che le persone usano per trovare le cose, una casella di ricerca, contributori che non sono chi l'ha configurato, e probabilmente versioni.

Scegli in base a due cose, in quest'ordine. Prima, quale runtime il tuo team già mantiene — perché il generatore che condivide un runtime col tuo progetto non ti costa niente in più in CI, e quello che non lo condivide ti costa per sempre una seconda toolchain. Seconda, la forma dell'output: documentazione di riferimento, un libro lineare, un sito di prodotto versionato o un sito di contenuti generico. Temi e aspetto vengono terzi, e sono la parte che cambierai comunque.

### MkDocs

MkDocs è un generatore di siti statici per documentazione di progetto scritto in Python, rilasciato con licenza BSD-2-Clause (verificato su github.com, il 9 settembre 2026). Le sue fonti sono file Markdown configurati con un unico file YAML, li traduce con la libreria Python Markdown, e il suo server di sviluppo ricarica il browser ogni volta che salvi (verificato su mkdocs.org, il 9 settembre 2026). Quel dettaglio di mezzo risolve la questione delle estensioni prima ancora che tu la ponga: cosa può contenere una pagina è tutto quello che le estensioni di Python Markdown possono esprimere, attivate tramite `markdown_extensions`.

| Pro | Contro |
| --- | --- |
| Un solo file di configurazione, poca superficie da imparare | Una navigazione in ordine deliberato significa scrivere a mano l'elenco `nav`; lascialo fuori e ottieni i file ordinati alfanumericamente (verificato su mkdocs.org, il 9 settembre 2026) |
| Python, che molti team hanno già in CI | Le estensioni predefinite sono `meta`, `toc`, `tables` e `fenced_code`; tutto il resto è qualcosa che attivi e poi devi ricordare (verificato su mkdocs.org, il 9 settembre 2026) |
| Material for MkDocs è un tema maturo, con licenza MIT (verificato su github.com, il 9 settembre 2026) | Gran parte di quello che le persone vogliono viene dal tema, quindi eredita il suo ciclo di aggiornamento |
| Server con ricarica live per la scrittura in locale | Non pensato per niente che non sia documentazione |

**Per chi è:** per documentazione di sviluppo per un progetto che usa già Python, scritta da persone che vogliono scrivere Markdown e modificare un solo file YAML.

### Docusaurus

Docusaurus costruisce siti web di documentazione e ha licenza MIT, basato su JavaScript e React (verificato su github.com, il 9 settembre 2026). La sua documentazione elenca tra le funzioni il versioning dei documenti, l'internazionalizzazione tra locali e MDX — componenti interattivi scritti come JSX e React dentro Markdown (verificato su docusaurus.io, il 9 settembre 2026). È l'argomento a favore e quello contro in un'unica frase: è l'opzione qui che fa più di tutte, sul runtime più grande.

| Pro | Contro |
| --- | --- |
| Versioning e internazionalizzazione integrati, non aggiunti a posteriori | React e Node sono ora dipendenze della tua documentazione |
| MDX, così le pagine possono incorporare componenti live | Tutto arriva tramite npm, quindi l'albero che devi tenere aggiornato è quello di un framework front-end, non di un generatore |
| Integrazioni di ricerca e un'API per plugin | Personalizzare qualsiasi cosa significa scrivere React |
| Rodato: molti grandi progetti lo usano | Gli aggiornamenti di versione major sono veri progetti |

**Per chi è:** per un prodotto con più versioni supportate, più di una lingua, o esempi interattivi nella documentazione — e un team front-end che non si stupirà di un aggiornamento di React.

### Hugo

Hugo è un generatore di siti statici scritto in Go, rilasciato con licenza Apache-2.0 (verificato su github.com, il 9 settembre 2026), e distribuito come binario scaricabile invece che come albero di pacchetti. È l'opzione con la superficie di dipendenze continuativa più piccola e il linguaggio di template più impegnativo.

| Pro | Contro |
| --- | --- |
| Un binario da scaricare; nessun package manager nel ciclo | I template sono `text/template` e `html/template` di Go (verificato su gohugo.io, il 9 settembre 2026), la sintassi meno indulgente di questa pagina |
| Veloce abbastanza che il tempo di build smette di essere un problema | La sua documentazione presume che tu conosca già il suo vocabolario |
| Gestisce siti di contenuti, non solo documentazione: taxonomie, sezioni, feed | Quattro edizioni tra cui scegliere, e la scelta conta |
| I temi si installano come submodule Git, come fa il quick start (verificato su gohugo.io, il 9 settembre 2026), oppure come moduli Hugo | Le convenzioni dei temi variano molto da tema a tema |

Le edizioni di Hugo vale la pena conoscerle prima di installare: il progetto documenta le build standard, deploy, extended ed extended/deploy, dove deploy aggiunge il deploy diretto su Google Cloud Storage, AWS S3 o Azure Storage, ed extended aggiunge la transpilazione LibSass per Sass. La stessa pagina nota che Git, Go e Dart Sass sono comunemente usati insieme a Hugo — Git per i moduli e i submodule dei temi, Go per costruire da sorgente o usare i moduli, Dart Sass per le funzioni Sass moderne — e che il LibSass incorporato è deprecato e "sarà rimosso in una versione futura" (verificato su gohugo.io, il 9 settembre 2026). Quindi la storia del binario singolo è vera, e nel momento in cui vuoi Sass moderno o moduli tema acquisisce dei vicini.

**Per chi è:** per team che non vogliono nessun package manager coinvolto, siti più grandi della documentazione, e chiunque preferisca imparare un linguaggio di template piuttosto che mantenere un albero di dipendenze.

### Eleventy

Eleventy è un generatore di siti statici per Node, con licenza MIT, descritto dal suo stesso repository come qualcosa che trasforma una cartella di template in HTML (verificato su github.com, il 9 settembre 2026). La sua proprietà distintiva è che impone molto poco: nessuna struttura di cartelle richiesta, nessun tema incluso, e una scelta di linguaggi di template.

| Pro | Contro |
| --- | --- |
| Quasi nessuna convenzione imposta; costruisci il sito che vuoi | Costruisci il sito che vuoi, il che significa che lo costruisci tu |
| Molti linguaggi di template — Nunjucks, Liquid, Handlebars, JavaScript, WebC e altri — combinabili in un progetto (verificato su 11ty.dev, il 9 settembre 2026) | Nessun tema predefinito, quindi la presentazione parte da zero |
| Impronta di dipendenze piccola per gli standard JavaScript | Navigazione, ricerca e versioning sono plugin o codice tuo |
| Configurazione in JavaScript semplice invece che un framework | Meno configurazioni di documentazione già pronte rispetto a MkDocs o Docusaurus |

**Per chi è:** per chi ha guardato il tema di un generatore di documentazione e ha voluto cancellarne la maggior parte — e ha il tempo di sostituirlo.

### mdBook

mdBook crea un libro da file Markdown, è scritto in Rust e rilasciato con licenza MPL-2.0 (verificato su github.com, il 9 settembre 2026). Produce bene una cosa sola: un documento lineare con indice, navigazione tra capitoli e ricerca. Un unico `SUMMARY.md` gli dice quali capitoli includere, in che ordine, in che gerarchia e dove si trovano i file sorgente, e il libro costruito risponde a `S` o `/` con una casella di ricerca (verificato su rust-lang.github.io, il 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Un binario, come Hugo; nessun runtime da installare | Libri, non siti: nessuna taxonomia, nessun feed, nessuna pagina di elenco |
| Un unico `SUMMARY.md` definisce tutta la struttura | I temi sono limitati per design |
| Ricerca incluso senza configurazione | Non è lo strumento per documentazione di riferimento in cui saltare tra sezioni |
| Pochissimo da imparare o mantenere | Ecosistema più piccolo degli altri |

**Per chi è:** per manuali, tutorial, guide interne e qualunque cosa con capitoli letti in ordine.

### Sphinx

Sphinx è un generatore di documentazione scritto in Python e rilasciato con licenza BSD 2-Clause, il cui markup predefinito è reStructuredText (verificato su github.com, il 9 settembre 2026). Il supporto Markdown arriva da MyST-Parser, un parser conforme a CommonMark con licenza MIT che fa da ponte verso Sphinx (verificato su github.com, il 9 settembre 2026). Il suo sito descrive la generazione di documentazione API dai docstring per Python, C++ e altri domini; cross-reference verso sezioni, figure, tabelle, citazioni, glossari e oggetti di codice, anche tra progetti separati; e output come HTML, LaTeX per PDF, ePub e Texinfo (verificato su sphinx-doc.org, il 9 settembre 2026). Sono queste tre capacità il motivo per cui sopravvive al proprio peso concettuale.

| Pro | Contro |
| --- | --- |
| Cross-reference vero: linka una funzione, un termine o una pagina e viene controllato | reStructuredText per default, quindi Markdown è un'aggiunta deliberata |
| Documentazione API estratta dal codice sorgente | Il modello concettuale più pesante qui: direttive, ruoli, domini |
| Più formati di output da una sola fonte, PDF incluso | La configurazione è Python, e cresce |
| Consolidato da tempo in progetti scientifici e Python | Eccessivo per un sito di documentazione senza superficie API |

**Per chi è:** per progetti la cui documentazione deve riferirsi al codice con precisione — librerie, software scientifico, qualunque cosa dove "linka alla documentazione di questa funzione" sia un bisogno quotidiano.

### Una piattaforma di documentazione

La quarta categoria non è affatto un generatore: colleghi un repository e qualcos'altro costruisce e ospita il sito. Read the Docs è l'esempio consolidato per progetti Sphinx e MkDocs, e dichiara che Read the Docs Community è "gratis, per sempre" per l'open source, con piani commerciali a Basic 50 $, Advanced 150 $ e Pro 250 $ al mese ed Enterprise a partire da 10.000 $ all'anno (verificato su about.readthedocs.com, il 9 settembre 2026). Costruisce anche la tua documentazione per ogni nuova pull request, il che significa che una modifica si può leggere già pronta prima che venga fusa invece che dopo (verificato su docs.readthedocs.com, il 9 settembre 2026).

| Pro | Contro |
| --- | --- |
| Qualcun altro possiede l'ambiente di build e i suoi aggiornamenti | Possiedi la configurazione ma non l'ambiente in cui gira |
| Anteprime per pull request e build versionate senza file di workflow | Debuggare una build fallita significa leggere i loro log, non i tuoi |
| Un URL e un hosting che non mantieni tu | Prezzi commerciali per i repository privati |
| Persone non tecniche possono avere accesso senza un terminale | Andarsene significa ricostruire la pipeline che avevi evitato |

**Per chi è:** per team che hanno concluso che il generatore è necessario e l'infrastruttura di build non è interessante. È una conclusione ragionevole, ed è l'unica opzione di questa pagina dove il costo di manutenzione del secondo anno è il problema di personale di qualcun altro.

## Il secondo anno, dove vive il costo vero

Ogni pagina introduttiva misura il costo di un generatore in minuti. Quel numero è onesto e irrilevante. L'installazione non è il costo; l'installazione è la cosa più economica che accadrà mai a questo sito.

Ecco la forma del costo reale. Nel primo mese qualcuno configura il generatore, scegli un tema, e ottiene un sito bello da vedere pubblicato a ogni merge. Funziona. Nessuno ci pensa per dieci mesi, che è esattamente quello che un passaggio di build dovrebbe farti guadagnare. All'undicesimo mese succede una di quattro cose.

L'immagine CI aggiorna il suo runtime predefinito, e una dipendenza nativa da qualche parte nell'albero del tema non ha più un binario precompilato per la nuova versione, quindi la build fallisce compilando qualcosa che nessuno sapeva esistesse. Oppure un avviso di sicurezza arriva su una dipendenza transitiva, il bump automatico apre una pull request, e il range di peer dependency del tema rifiuta la nuova versione major — quindi puoi lasciare aperto l'avviso oppure aggiornare il tema, il che cambia il layout del sito. Oppure il tema semplicemente non è più mantenuto, e il fork su cui tutti si sono spostati ha chiavi di configurazione diverse. Oppure niente di tutto questo, e invece qualcuno deve aggiungere una pagina, scopre che la navigazione è dichiarata in un file YAML con una convenzione di ordinamento che non riesce a intuire, e lo chiede in un canale dove l'unica persona che lo sapeva se n'è andata.

Quest'ultimo caso è il più comune e il meno discusso. La vera dipendenza di una toolchain è una persona. Il generatore va bene; è la conoscenza che è evaporata. E il fallimento non è drammatico — sembra documentazione che smette di essere aggiornata, perché il costo di aggiornarla è passato da "modifica un file" a "capisci come si costruisce questa cosa".

I generatori compilati sono decisamente migliori qui. Hugo e mdBook sono binari: fissa la versione, commetti il numero di versione, e la build che funzionava l'anno scorso funziona anche quest'anno perché niente viene risolto in fase di build. Le opzioni basate su Node sono all'estremo opposto: la massima capacità, il maggior numero di parti in movimento, e un lockfile che descrive centinaia di cose che possono cambiare sotto di te.

### E il contrappeso, che è reale

Niente di tutto questo significa "usa sempre un convertitore". Superare un convertitore è una migrazione davvero fastidiosa, e far finta del contrario sarebbe disonesto.

Ecco come si presenta: hai trenta pagine pubblicate da uno script. Adesso qualcuno vuole una barra laterale. Allora ne scrivi una, a mano, in ogni file — oppure scrivi un piccolo passaggio di template, poi un passaggio di generazione della nav, poi un controllore di link, perché le pagine hanno iniziato a riferirsi tra loro. Sei mesi così e hai costruito un cattivo generatore di siti statici senza documentazione e con un solo mantenitore. È peggio, e di parecchio, che adottare MkDocs il primo giorno, ed è un modo comune di finire in un pasticcio.

La migrazione in sé costa: gli URL cambiano a meno che tu non sia attento, il che significa redirect; il front matter va rimodellato in quello che il generatore si aspetta; qualunque cosa il tuo script facesse in modo estemporaneo va riespressa in un linguaggio di template. È una settimana di lavoro, non un giorno.

Quindi la regola onesta è asimmetrica. Partire con un convertitore e passare a un generatore più avanti costa una migrazione limitata, una sola volta, se il requisito cresce davvero. Partire con un generatore che non ti serviva costa manutenzione ogni anno, che il requisito cresca o no. Il primo rischio è una quantità nota; il secondo è un abbonamento. Ma nel momento in cui ti sorprendi a scrivere logica di template attorno a un convertitore, fermati e installa un generatore — è il segnale, ed è inequivocabile quando arriva.

## Sei domande da porsi sulla tua situazione

Rispondi a queste sui documenti che hai davvero, non su quelli che potresti avere l'anno prossimo.

1. **Qualche pagina ha bisogno di un link verso un'altra pagina che non deve rompersi in silenzio?** Se sì, ti serve qualcosa che percorra tutto l'insieme e fallisca quando un link marcisce, il che significa un generatore o una piattaforma — un convertitore per file non può vedere gli altri file, quindi il marciume resta invisibile finché un lettore non lo incontra.
2. **Qualcuno deve cercare in tutto l'insieme?** La ricerca del browser cerca in un documento. Una casella di ricerca ha bisogno di un indice costruito su ogni pagina in fase di compilazione, e niente che converta i file uno alla volta può produrne uno, quindi questa risposta da sola può decidere.
3. **Deve ripubblicarsi senza che una persona decida di farlo?** Se la documentazione deve restare aggiornata dopo ogni merge, il passaggio di pubblicazione deve girare senza supervisione, e allora l'unica domanda è se la cosa senza supervisione è un generatore o uno script di tre righe — ma pubblicare manualmente non è un'opzione che puoi scegliere, perché degrada a nessuna pubblicazione.
4. **Chi è la persona meno tecnica che dovrà pubblicare una modifica?** Se quella persona non usa un terminale, qualsiasi passaggio di build locale la esclude per sempre, e il sito accumulerà una coda di modifiche in attesa di qualcun altro — quindi la build appartiene alla CI o a una piattaforma, qualunque tu scelga.
5. **Quale runtime il tuo team già mantiene funzionante in CI?** Scegliere un generatore su un runtime che non mantieni già raddoppia il numero di toolchain da aggiornare, e la seconda viene sempre aggiornata in ritardo, ed è così che una build di documentazione finisce per essere la cosa più vecchia della tua pipeline.
6. **Se chi ha configurato tutto questo se ne va in sei mesi, qualcun altro può aggiungere una pagina?** Scrivi la risposta con onestà. Se è no, scegli l'opzione con meno configurazione invece che con più capacità — un sito un po' peggiore che chiunque può modificare batte uno migliore che nessuno osa toccare.

Fai il punteggio. Due o più sì nelle domande da uno a tre significa un generatore, e le domande quattro e cinque scelgono quale. Se le domande da uno a tre sono tutte no, stai guardando un problema a forma di documento, e lo strumento per un problema a forma di documento è un convertitore.

## Conclusione

Un generatore di siti statici è la risposta giusta quando le pagine devono conoscersi a vicenda e la build deve funzionare senza di te. È la risposta sbagliata per un documento con un destinatario, per un insieme di note non collegate, e per qualunque situazione in cui nessuno del team capirà ancora la build in un anno. La via di mezzo è reale e sottoutilizzata: un convertitore con uno script davanti pubblica una cartella di pagine a ogni push senza tema, senza lockfile e con un solo comando da debuggare. Se quello che hai è un singolo documento che deve raggiungere qualcuno e apparire giusto quando arriva, [convertire Markdown in un file HTML autonomo](/) richiede un browser e nessuna installazione, e dopo non resta niente da mantenere. Installa il generatore quando la seconda domanda che ti fai sui tuoi documenti è "come li collego tra loro?" — e non prima.

## Domande frequenti

### Mi serve un generatore di siti statici per pubblicare un solo file Markdown?

No. Un generatore produce una cartella di file collegati tra loro, che è esattamente l'output sbagliato per un documento singolo — non puoi allegarlo a un'email, e ospitarlo significa tenere in vita una destinazione di deploy. Convertilo in un file HTML autonomo, oppure pubblicalo come link, e hai finito.

### Un generatore di siti statici è eccessivo per una cartella `docs/` nel mio repository?

Dipende interamente dal fatto che le pagine si riferiscano tra loro. Otto pagine di riferimento indipendenti vanno bene convertite singolarmente, o anche lette come Markdown reso ai loro URL nel repository. Otto pagine con una barra laterale condivisa e link tra loro sono un piccolo sito, e un generatore controllerà i link che altrimenti romperesti.

### Quale generatore di siti statici richiede meno manutenzione?

Quelli distribuiti come un singolo binario, perché niente viene risolto in fase di build. Hugo (Apache-2.0) e mdBook (MPL-2.0) si installano entrambi come binario scaricato, quindi fissare una versione significa che la build che funzionava l'anno scorso funziona ancora. I generatori basati su Node offrono più capacità e una superficie di dipendenze molto più grande da mantenere aggiornata.

### Posso usare un generatore di siti statici senza sapere JavaScript?

Sì. MkDocs e Sphinx sono Python, Hugo è un binario Go e mdBook è un binario Rust — nessuno richiede di scrivere JavaScript. Docusaurus è l'eccezione: personalizzarlo oltre la configurazione significa scrivere React, ed è un motivo legittimo per scegliere qualcos'altro.

### E se parto con un convertitore e lo supero?

Migri, e costa circa una settimana: rimodellare il front matter, riesprimere il comportamento del tuo script in un linguaggio di template, e aggiungere redirect così i vecchi URL continuano a funzionare. È un costo limitato, una tantum, che si confronta bene con il mantenere una build di cui non avevi mai bisogno. Il segnale per migrare è il giorno in cui inizi a scrivere logica di template attorno al convertitore.

### Posso avere la ricerca sui miei documenti senza un generatore?

Non in un modo davvero soddisfacente. La ricerca ha bisogno di un indice costruito su tutto l'insieme, che per definizione è un lavoro da fare in fase di build. Se una casella di ricerca è un requisito, è uno dei motivi più forti di questo elenco per usare un generatore o una piattaforma di documentazione ospitata.

### Pubblicare Markdown su GitHub o GitLab è abbastanza buono?

Per documentazione interna di ingegneria, spesso sì. Entrambi renderizzano documenti Markdown tenuti in un repository — tabelle ed elenchi di attività incluse — all'URL del file stesso, senza build, senza tema e senza deploy (verificato su docs.github.com e docs.gitlab.com, il 9 settembre 2026). Quello che rinunci è la navigazione, la ricerca limitata e il controllo sulla presentazione — che possono non costare niente se gli unici lettori sono le persone che già fanno commit al repository.
