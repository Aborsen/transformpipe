import type { Locale } from './i18n/locales';

/*
 * What has shipped, one entry per thing a reader would notice.
 *
 * A typed array rather than the Markdown file this replaced. The file read well in the repository
 * and could not carry what a card needs: an entry has a date that has to sort and be handed to
 * `Intl`, and a version only when it shipped in a tagged release. Both were prose in the headings
 * — "9 September 2026" — so the page could not order entries without parsing an English month
 * name, and the sitemap got no date at all.
 *
 * The body stays Markdown and is rendered by the product's own converter, which was the good half
 * of the file and is kept: a release note that breaks the renderer breaks a customer's document
 * too, and this is a better place to find that out.
 *
 * The rule that keeps this file true is in CLAUDE.md: a tagged release is not shipped until its
 * entry is here, and anything a person using the product would notice gets an entry between tags.
 * Nothing enforces it — a missing entry breaks no build, which is exactly why it is written down.
 *
 * English, deliberately. The chrome around these is translated; five translations per entry is a
 * cost that gets skipped after the second release, and `src/lib/i18n/content.ts` draws the same
 * line for the blog.
 */
export interface ChangelogEntry {
  /** ISO, and the only order that matters: the page sorts on it rather than trusting this list. */
  date: string;
  /** The tag it shipped in, where there is one. Most entries shipped between tags. */
  version?: string;
  title: string;
  /** Markdown. Kept to a few sentences — a card that needs scrolling is an article. */
  body: string;
  /**
   * The address of this entry's own page, when it has earned one.
   *
   * Optional, and most entries will never have it. A slug means there is more to say than a card
   * should hold — what the thing does, why it works the way it does, what it replaced — and that
   * the words are worth a page a search engine can land somebody on. An entry with no slug is a
   * card and nothing else, which is what a changelog mostly is.
   *
   * Kebab-case, unique, and permanent once shipped: it is a URL from the day it deploys.
   */
  slug?: string;
  /**
   * The long version, by language. Required wherever there is a slug and meaningless without one.
   *
   * English is not optional and the rest are: this is the one place the English-only rule bends,
   * because a release note that somebody searched for is worth having in their language, and there
   * are a handful of these rather than one per release. A language with nothing written falls back
   * to English, which is what the reader would have got anyway.
   */
  detail?: ChangelogDetail;
}

/** One entry's page, in English and in whatever else somebody has written. */
export type ChangelogDetail = { en: ChangelogDetailText } & Partial<
  Record<Locale, ChangelogDetailText>
>;

export interface ChangelogDetailText {
  /**
   * The page's heading and its `<title>`, when this language has one of its own.
   *
   * Absent on `en`, where the entry's own title is already it. Present on a translation, because a
   * German page indexed under an English headline and a German description is the mismatch this
   * whole feature exists to avoid: somebody searching in German finds a result that reads as the
   * wrong language and does not click it.
   */
  title?: string;
  /**
   * The card's summary in this language, shown above the piece.
   *
   * The entry's own `body` stays English — that is the rule, and the list is built from it. This is
   * the same sentence for the one page where an English paragraph between a German heading and a
   * German piece would read as a mistake.
   */
  summary?: string;
  /**
   * Markdown, capped at DETAIL_LIMIT characters, and the cap is the point: this is the piece a
   * reader arrives at from a search, and the question it answers is "what is this and does it help
   * me". Past three thousand characters it stops answering that and starts being an article, which
   * is what content/blog is for.
   */
  body: string;
  /** 100-165 characters, like the blog's, and checked at build time for the same reason. */
  description: string;
  /** Comma-separated. The phrases somebody would have typed, not the words. */
  keywords: string;
}

/** What a detail page may weigh. See `detail` — past this it is an article, not a release note. */
export const DETAIL_LIMIT = 3000;

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-09-18',
    title: 'The whole blog reads in French',
    slug: 'blog-in-french',
    detail: {
      en: {
        description:
          'Every article on the TransformPipe blog now has a French text of its own, written for French readers rather than machine-translated, with dates and links unchanged.',
        keywords:
          'markdown guides in french, french markdown blog, markdown documentation translated, markdown tutorials in french, multilingual markdown blog',
        body: `\`/fr/blog\` is now the whole index and not a shelf with four things on it: every piece that exists in English exists in French, at the same address with a \`/fr\` in front of it. German has the same. Spanish and Italian have four articles each, and are listed as four.

### What a translation is here

Not a pass through a machine. The register is French, sentences are rebuilt where a literal one would read as English wearing French words, and the search terms are the phrases somebody types in French rather than the English phrases translated. The description is written to length for French, which runs longer than English, instead of being trimmed out of the original.

What is identical: the date the piece was written, every link target, every code block, every table, and every "checked on" citation, which keeps the date it was actually checked on. A translation is not a new article and is not dated as one.

### The address does not change

\`/fr/blog/markdown-escaping\` is the French text of \`/blog/markdown-escaping\`. The language is the prefix and the slug after it is the same in every language, so a cross-reference between two articles does not depend on which language you happen to be reading. A link in the prose points at the French page when there is one and at the English page when there is not, which is why a half-finished language has no dead ends in it.

The tags are translated one word at a time and the same word every time — Conversion, Syntaxe, Publication, Sécurité, Automatisation, Code, Workflow. The filter chips on the index are built from whatever the articles say, so two spellings would make two chips.

### What is still English

The API and the connector answer in one language, and that language is English. So does the page a share link opens, which the server renders for a reader it knows nothing about — there is nothing to pick a language from there but \`Accept-Language\`, and guessing wrong is worse than English.

And Spanish and Italian, for fifty-nine of the sixty-three. An article a language does not have is not listed in that language, not linked to, and claims no \`hreflang\`: a crawler follows an alternate that was never written and finds nothing, which is worse than claiming nothing at all.

Related: [escaping characters in Markdown](/blog/markdown-escaping), and [CommonMark, GFM and the flavours](/blog/commonmark-gfm-and-the-flavours).`,
      },
      de: {
        title: 'Der ganze Blog liest sich auf Französisch',
        summary: `Alle dreiundsechzig Artikel liegen jetzt neben dem englischen und dem deutschen Text auch auf Französisch vor. Sie sind geschrieben und nicht maschinell übersetzt: Die Prosa ist neu gebaut statt übertragen, und die Suchbegriffe sind die, die ein französischer Leser wirklich eingibt — während Datum, Links, Code und jede Prüfangabe genau so bleiben, wie sie waren.`,
        description:
          'Jeder Artikel im TransformPipe-Blog hat jetzt einen französischen Text: für das Französische geschrieben statt maschinell übersetzt, Daten und Links unverändert.',
        keywords:
          'markdown blog auf französisch, markdown anleitungen französisch, mehrsprachige markdown dokumentation, markdown blog sprachen, übersetzte markdown artikel',
        body: `\`/fr/blog\` ist jetzt das vollständige Verzeichnis und kein Regal mit vier Stücken darauf: Was es auf Englisch gibt, gibt es auf Französisch, unter derselben Adresse mit einem \`/fr\` davor. Für Deutsch gilt dasselbe. Spanisch und Italienisch haben je vier Artikel und führen auch vier.

### Was hier eine Übersetzung ist

Kein Durchlauf durch eine Maschine. Das Register ist französisch, Sätze werden neu gebaut, wo ein wörtlicher wie Englisch in französischen Wörtern klingen würde, und die Suchbegriffe sind die Wendungen, die jemand auf Französisch eingibt, nicht die übersetzten englischen. Die Beschreibung wird für das Französische auf Länge geschrieben, das länger läuft als das Englische, und nicht aus dem Original gekürzt.

Gleich bleibt: das Datum, an dem das Stück entstand, jedes Linkziel, jeder Codeblock, jede Tabelle und jede Prüfangabe mit dem Tag, an dem tatsächlich nachgesehen wurde. Eine Übersetzung ist kein neuer Artikel und wird auch nicht als einer datiert.

### Die Adresse ändert sich nicht

\`/fr/blog/markdown-escaping\` ist der französische Text von \`/blog/markdown-escaping\`. Die Sprache steckt im Präfix, der Slug dahinter ist in jeder Sprache derselbe — ein Querverweis zwischen zwei Artikeln hängt also nicht daran, in welcher Sprache Sie gerade lesen. Ein Link in der Prosa zeigt auf die französische Seite, wo es eine gibt, und auf die englische, wo nicht; deshalb hat eine halb fertige Sprache keine toten Enden.

Die Tags werden Wort für Wort übersetzt und jedes Mal gleich — Conversion, Syntaxe, Publication, Sécurité, Automatisation, Code, Workflow. Die Filter-Chips im Verzeichnis entstehen aus dem, was die Artikel sagen; zwei Schreibweisen wären zwei Chips.

### Was weiterhin englisch ist

Die API und der Konnektor antworten in einer Sprache, und diese Sprache ist Englisch. Ebenso die Seite, die ein Freigabelink öffnet: Der Server baut sie für einen Leser, über den er nichts weiß, und dort gibt es außer \`Accept-Language\` nichts, woraus sich eine Sprache wählen ließe — falsch zu raten wäre schlechter als Englisch.

Und Spanisch und Italienisch, für neunundfünfzig der dreiundsechzig Stücke. Ein Artikel, den eine Sprache nicht hat, wird in ihr nicht geführt, nicht verlinkt und beansprucht kein \`hreflang\`: Ein Crawler folgt einer Alternative, die nie geschrieben wurde, und findet nichts — schlechter, als gar nichts zu behaupten.

Weiter: [Zeichen in Markdown maskieren](/blog/markdown-escaping) und [CommonMark, GFM und die Dialekte](/blog/commonmark-gfm-and-the-flavours).`,
      },
    },
    body:
      'All sixty-three articles now exist in French alongside the English and German. They are '
      + 'written rather than machine-translated: the prose is rebuilt rather than transposed, and '
      + 'the search terms are the ones a French reader actually types — while the dates, the '
      + 'links, the code and every checked-on citation stay exactly as they were.',
  },
  {
    date: '2026-09-18',
    title: 'Publishing a public link waits for a confirmed address',
    slug: 'public-links-need-a-confirmed-address',
    detail: {
      en: {
        description:
          'Publishing a TransformPipe document to a link anybody can open now needs a confirmed email address, on all three routes. Sharing with named people does not.',
        keywords:
          'confirm email before sharing a link, public share link verification, why can i not publish a link, email confirmation required to share, share a document without verifying email',
        body: `Two kinds of sharing live behind one dialog and they are not the same act. Naming addresses publishes nothing: each reader has to sign in as the address you named, so the document is handed to people you chose. A link puts a page at \`/s/<token>\` on our domain that anybody holding the URL can read, and that is a page on the open internet with somebody else's content on it.

### Why the second one is held back

An address nobody has proved cannot be recovered, cannot be told anything, and costs nothing to make a hundred of. A hundred of them publishing pages under our domain is the shape of a phishing campaign, and the domain is shared with everybody else using the product.

So two things wait for a confirmation and everything else does not: publishing to a link, and accumulating storage — an unconfirmed account keeps ten documents. Converting, downloading, the API, the connector and sharing with named people all work from the first minute.

### Confirming it

A six-digit code from the account menu, good for ten minutes. Signed in through Google there was never anything to confirm: the provider asserts the address, so those accounts could always publish.

The check is read at the moment of the request rather than carried on your session, which means confirming takes effect on your very next request instead of your next sign-in — the behaviour anybody expects after typing a code.

### Three doors, and two of them were open

A link can be published three ways: \`PUT /api/v1/documents/:id/share\`, \`POST /api/v1/documents?share=link\`, and the app's own \`PUT /api/documents/:id/share\`. Only the first of them asked. That is the actual fix here — the rule existed and had two holes in it, because a rule written three times is a rule maintained in one of them.

It is one function now and all three call it. A refusal is a 403 that says what to do: confirm the address, and note that sharing with named addresses works either way.

Related: [sharing a document as a link](/blog/share-a-markdown-document-as-a-link), and [whether an online converter is safe](/blog/is-an-online-converter-safe).`,
      },
      de: {
        title: 'Ein öffentlicher Link wartet auf eine bestätigte Adresse',
        summary: `Ein Dokument mit benannten Personen zu teilen funktioniert wie immer, ob die Adresse des Kontos bestätigt ist oder nicht. Es als Link zu veröffentlichen, den jeder öffnen kann, verlangt jetzt zuerst die Bestätigung — auf jedem Weg, der das kann, und genau das war der Fehler: Zwei der drei haben nicht gefragt.`,
        description:
          'Ein Dokument als Link zu veröffentlichen, den jeder öffnen kann, verlangt jetzt eine bestätigte E-Mail-Adresse. Das Teilen mit benannten Personen verlangt sie nicht.',
        keywords:
          'e-mail bestätigen vor dem teilen, öffentlicher freigabelink bestätigung, warum kann ich keinen link veröffentlichen, dokument teilen ohne bestätigte adresse, freigabelink e-mail bestätigung',
        body: `Hinter einem Dialog stecken zwei Arten des Teilens, und sie sind nicht dieselbe Handlung. Adressen zu benennen veröffentlicht nichts: Jeder Leser muss sich mit genau der benannten Adresse anmelden, das Dokument geht also an Personen, die Sie gewählt haben. Ein Link legt unter \`/s/<token>\` eine Seite auf unsere Domain, die jeder lesen kann, der die URL hat — eine Seite im offenen Internet mit dem Inhalt einer anderen Person darauf.

### Warum das Zweite zurückgehalten wird

Eine Adresse, die niemand nachgewiesen hat, lässt sich nicht wiederherstellen, ihr lässt sich nichts mitteilen, und hundert davon anzulegen kostet nichts. Hundert solcher Konten, die Seiten unter unserer Domain veröffentlichen, sehen aus wie eine Phishing-Kampagne — und die Domain teilen alle, die das Produkt benutzen.

Zwei Dinge warten deshalb auf eine Bestätigung und alles andere nicht: einen Link zu veröffentlichen und Speicher anzusammeln — ein unbestätigtes Konto behält zehn Dokumente. Konvertieren, Herunterladen, die API, der Konnektor und das Teilen mit benannten Adressen gehen ab der ersten Minute.

### Wie Sie bestätigen

Ein sechsstelliger Code aus dem Kontomenü, zehn Minuten gültig. Wer sich über Google anmeldet, hatte nie etwas zu bestätigen: Der Anbieter versichert die Adresse, solche Konten konnten immer veröffentlichen.

Geprüft wird im Moment der Anfrage und nicht anhand Ihrer Sitzung. Eine Bestätigung wirkt deshalb bei der nächsten Anfrage und nicht erst bei der nächsten Anmeldung — was nach dem Eintippen eines Codes auch jeder erwartet.

### Drei Türen, und zwei davon standen offen

Ein Link lässt sich auf drei Wegen veröffentlichen: \`PUT /api/v1/documents/:id/share\`, \`POST /api/v1/documents?share=link\` und der eigene Weg der App, \`PUT /api/documents/:id/share\`. Gefragt hat nur der erste. Das ist die eigentliche Korrektur: Die Regel gab es, und sie hatte zwei Löcher, weil eine dreimal geschriebene Regel nur an einer Stelle gepflegt wird.

Jetzt ist es eine Funktion, und alle drei rufen sie auf. Eine Ablehnung ist ein 403, der sagt, was zu tun ist: die Adresse bestätigen — und dass das Teilen mit benannten Adressen so oder so funktioniert.

Weiter: [ein Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link) und [ob ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe).`,
      },
    },
    body:
      'Sharing a document with named people works as it always has, whether or not the address on '
      + 'the account has been confirmed. Publishing one to a link anybody can open now asks for '
      + 'the confirmation first — on every route that can do it, which was the actual bug: two of '
      + 'the three were not asking.',
  },
  {
    date: '2026-09-18',
    title: 'A daily limit on share notices, and a rate limit on the rest',
    slug: 'share-notice-limits',
    detail: {
      en: {
        description:
          'An account may send fifty share notices a day, and every endpoint here answers 429 past sixty requests a minute. Access is never held back with the mail.',
        keywords:
          'share notice email limit, api rate limit 429, how many documents can i share a day, too many requests document api, retry-after rate limit',
        body: `Two counters, counting two different things, and it is worth knowing which one you have met. One is about mail leaving our domain; the other is about how fast anybody may ask this application for anything.

### Fifty notices a day, and a notice is not access

Adding somebody to a document writes the access. The email telling them is a courtesy on top of it, and the two were always separate here. Past fifty in a day the notice is simply not sent: the person is still added, the document still opens for them, and the response says which addresses were actually written to rather than claiming all of them.

Fifty is far above what sharing a document looks like and far below what a mailing looks like. What is being protected is not the cost of a send — it is the domain. A burst of unwanted mail signed by our SPF and DKIM ends with the sending domain disabled, and the first thing that stops working after that is the confirmation code somebody needs to sign in.

### Sixty requests a minute, now on the app too

The public API and the connector have counted calls per caller per minute for as long as they have existed, and answer \`429\` with a \`retry-after\` saying how many seconds until the minute turns. The app's own endpoints were left out of it on the grounds that only our pages call them — true of the pages and false of the endpoints. A session cookie is a credential like any other, and those routes write to the database, send mail and make outbound requests.

They are counted by account where there is one and by address where there is not, so one runaway script cannot spend somebody else's allowance. An AI summary has its own smaller budget, twenty a day, because that call costs money in a way an ordinary one does not.

### What it does not do

It does not queue. A request over the limit is refused, with the seconds to wait, and retrying is yours to do. It is also not a precise limiter: a row per caller per minute in Postgres means two calls arriving together can read the same count, which at this size is the right trade against running a second system beside the database.

And a counter that cannot be reached counts as room to spare. A limiter that locks everybody out when its own table is unavailable is worse than the thing it was guarding against.

Related: [sharing a document as a link](/blog/share-a-markdown-document-as-a-link), and [converting documents with an API](/blog/converting-documents-with-an-api).`,
      },
      de: {
        title: 'Ein Tageslimit für Freigabe-Benachrichtigungen, ein Ratenlimit für den Rest',
        summary: `Ein Konto darf fünfzig Freigabe-Benachrichtigungen am Tag senden. Jemanden zu einem Dokument hinzuzufügen geht auch darüber hinaus weiterhin — es kommt nur keine E-Mail mehr darüber. Die eigenen Endpunkte der App sind jetzt so ratenbegrenzt, wie es die öffentliche API immer war: Ein Skript in einer Schleife bekommt eine 429 statt allem, wonach es fragt.`,
        description:
          'Ein Konto darf fünfzig Freigabe-Benachrichtigungen am Tag senden, und jeder Endpunkt antwortet ab sechzig Anfragen pro Minute mit 429. Der Zugriff bleibt frei.',
        keywords:
          'limit für freigabe e-mails, api ratenlimit 429, wie viele dokumente pro tag teilen, zu viele anfragen dokumenten api, retry-after ratenbegrenzung',
        body: `Zwei Zähler, die zwei verschiedene Dinge zählen — und es lohnt zu wissen, an welchen von beiden Sie gestoßen sind. Der eine betrifft Post, die unsere Domain verlässt; der andere, wie schnell überhaupt jemand diese Anwendung etwas fragen darf.

### Fünfzig Benachrichtigungen am Tag, und eine Benachrichtigung ist kein Zugriff

Jemanden zu einem Dokument hinzuzufügen schreibt den Zugriff. Die E-Mail, die es ihm sagt, ist eine Höflichkeit obendrauf, und beides war hier immer getrennt. Jenseits von fünfzig am Tag wird die Benachrichtigung einfach nicht gesendet: Die Person ist trotzdem hinzugefügt, das Dokument öffnet sich für sie, und die Antwort nennt die Adressen, die wirklich angeschrieben wurden, statt alle zu behaupten.

Fünfzig liegt weit über dem, wie das Teilen eines Dokuments aussieht, und weit unter dem, wie ein Rundschreiben aussieht. Geschützt wird nicht der Preis eines Versands, sondern die Domain: Ein Schub unerwünschter Post, signiert mit unserem SPF und DKIM, endet damit, dass die Absenderdomain abgeschaltet wird — und das Erste, was danach nicht mehr funktioniert, ist der Bestätigungscode, den jemand zum Anmelden braucht.

### Sechzig Anfragen pro Minute, jetzt auch in der App

Die öffentliche API und der Konnektor zählen Aufrufe pro Aufrufer und Minute, solange es sie gibt, und antworten mit \`429\` und einem \`retry-after\`, das die Sekunden bis zur nächsten Minute nennt. Die eigenen Endpunkte der App waren davon ausgenommen, weil nur unsere Seiten sie aufrufen — was für die Seiten stimmt und für die Endpunkte nicht. Ein Sitzungscookie ist eine Zugangsberechtigung wie jede andere, und diese Routen schreiben in die Datenbank, senden Post und rufen nach außen.

Gezählt wird nach Konto, wo es eines gibt, und sonst nach Adresse: Ein außer Kontrolle geratenes Skript kann so nicht das Guthaben einer anderen Person verbrauchen. Eine KI-Zusammenfassung hat ihr eigenes, kleineres Budget von zwanzig am Tag, weil dieser Aufruf auf eine Weise Geld kostet, wie ein gewöhnlicher es nicht tut.

### Was es nicht tut

Es stellt nichts in eine Warteschlange. Eine Anfrage über dem Limit wird abgelehnt, mit den Sekunden, die zu warten sind; der erneute Versuch liegt bei Ihnen. Es ist auch kein exakter Begrenzer: Eine Zeile pro Aufrufer und Minute in Postgres heißt, dass zwei gleichzeitige Aufrufe denselben Stand lesen können — in dieser Größe der richtige Handel dafür, kein zweites System neben der Datenbank zu betreiben.

Und ein Zähler, der nicht erreichbar ist, gilt als Luft nach oben. Ein Begrenzer, der alle aussperrt, sobald seine eigene Tabelle fehlt, ist schlimmer als das, wovor er schützen sollte.

Weiter: [ein Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link) und [Dokumente über eine API konvertieren](/blog/converting-documents-with-an-api).`,
      },
    },
    body:
      'An account may send fifty share notices a day. Adding somebody to a document still works '
      + 'past that — they simply get no email about it. The app\'s own endpoints are now rate '
      + 'limited the way the public API has always been, so a script in a loop gets a 429 instead '
      + 'of everything it asks for.',
  },
  {
    date: '2026-09-18',
    title: 'Install it, and it works without a network',
    slug: 'install-as-an-app',
    detail: {
      en: {
        description:
          'TransformPipe installs as an app in Chrome, Edge and Safari, opens in its own window, and converts documents with no connection at all.',
        keywords:
          'offline markdown converter, install markdown converter as an app, markdown to html without internet, progressive web app document converter, convert documents offline',
        body: `Most web apps that install are a shortcut with extra steps: the window is different and the offline behaviour is a spinner. This one is the opposite case — the thing that needed the network was never the conversion, it was fetching the page.

### Why it works with no connection

Every conversion here has always run in the browser — the Markdown parser, the HTML reader, the \`.docx\` and \`.xlsx\` readers, the zip reader for a Notion or Obsidian export. None of them ever needed a server, which is the same reason nothing you convert is uploaded. Installing simply removes the last thing that needed the network: fetching the page itself.

So an installed copy opened on a plane, on a train, or on a locked-down machine starts, accepts a file, converts it, and downloads the result. A page you visited before is cached at its own address, so the documentation and the articles you have read are there too.

### What still needs the network

Anything that involves the account: the saved document list, saving, sharing, the AI summary, and signing in. Those are asked for the moment you use them, and say so plainly when there is no connection rather than hanging.

Nothing about the account's data is cached — \`/api\` is never stored, and neither is a shared document at \`/s/\`. A cache that held somebody's documents on a shared machine would be a worse bargain than a slower page.

### It changes nothing if you do not install it

The site is the same site. Installing is an option the browser offers once the page says it is installable; ignoring it costs nothing, and uninstalling leaves no trace beyond the browser's own cache.

Related: [what a Markdown to HTML converter is for](/blog/markdown-to-html-converter), and [whether an online converter is safe](/blog/is-an-online-converter-safe).`,
      },
      de: {
        title: 'Installieren Sie es, und es arbeitet ohne Netz',
        summary: `Chrome, Edge und Safari bieten inzwischen an, TransformPipe als App zu installieren — eigenes Fenster, eigenes Symbol, keine Adresszeile. Ohne Verbindung geöffnet startet es trotzdem und konvertiert trotzdem: jede Konvertierung läuft ohnehin im Browser. Dokumente im Konto brauchen das Netz, wie eh und je.`,
        description:
          'TransformPipe lässt sich in Chrome, Edge und Safari als App installieren, öffnet ein eigenes Fenster und konvertiert Dokumente ganz ohne Verbindung.',
        keywords:
          'markdown konverter offline, markdown konverter als app installieren, markdown in html ohne internet, dokumente offline konvertieren, progressive web app dokumentenkonverter',
        body: `Die meisten Web-Apps, die sich installieren lassen, sind eine Verknüpfung mit Zusatzschritten: das Fenster sieht anders aus, und offline erscheint ein Ladekreis. Hier liegt es umgekehrt — was das Netz brauchte, war nie die Konvertierung, sondern das Laden der Seite selbst.

### Warum es ohne Verbindung funktioniert

Jede Konvertierung hier lief schon immer im Browser — der Markdown-Parser, der HTML-Leser, die Leser für \`.docx\` und \`.xlsx\`, der Zip-Leser für einen Notion- oder Obsidian-Export. Keiner von ihnen hat je einen Server gebraucht, und aus demselben Grund wird nichts hochgeladen, was Sie konvertieren. Die Installation nimmt nur noch das Letzte weg, das ein Netz brauchte: die Seite selbst zu laden.

Eine installierte Kopie startet also im Flugzeug, im Zug oder auf einem abgeschotteten Rechner, nimmt eine Datei an, konvertiert sie und lädt das Ergebnis herunter. Eine Seite, die Sie vorher besucht haben, liegt unter ihrer eigenen Adresse im Cache — die Dokumentation und die Artikel, die Sie gelesen haben, sind also ebenfalls da.

### Was weiterhin ein Netz braucht

Alles, was am Konto hängt: die Liste der gespeicherten Dokumente, das Speichern, das Teilen, die KI-Zusammenfassung und das Anmelden. Das wird in dem Moment angefragt, in dem Sie es benutzen, und sagt ohne Verbindung klar, dass es gerade nicht geht, statt hängen zu bleiben.

Nichts von den Daten des Kontos liegt im Cache — \`/api\` wird nie gespeichert, und ein geteiltes Dokument unter \`/s/\` ebenso wenig. Ein Cache, der auf einem gemeinsam genutzten Rechner die Dokumente einer Person aufbewahrt, wäre ein schlechteres Geschäft als eine langsamere Seite.

### Ohne Installation ändert sich nichts

Die Seite bleibt dieselbe Seite. Die Installation ist ein Angebot, das der Browser macht, sobald die Seite sich als installierbar meldet; sie zu ignorieren kostet nichts, und eine Deinstallation hinterlässt nichts außer dem Cache des Browsers selbst.

Weiter: [wozu ein Markdown-nach-HTML-Konverter da ist](/blog/markdown-to-html-converter) und [ob ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe).`,
      },
    },
    body:
      'Chrome, Edge and Safari now offer to install TransformPipe as an app — its own window, its '
      + 'own icon, no address bar. Opened with no connection it still starts and still converts: '
      + 'every conversion runs in the browser anyway. Documents on the account need the network, '
      + 'as they always did.',
  },
  {
    date: '2026-09-18',
    title: 'A document in a chat looks like a document',
    slug: 'assistant-connector-cards',
    detail: {
      en: {
        description:
          'The TransformPipe connector draws a real card for a document an assistant saves or opens — name, size, counts, first lines, and a button that opens it.',
        keywords:
          'mcp connector document converter, claude markdown connector, convert documents from an assistant, mcp apps card, save a document from a chat',
        body: `A tool result is text, and text is what an assistant does with it: "Saved as report.md, 12 KB, id 3f1a…". Read once that is fine. Read five times in a row it is a wall you have to search for the one id you need.

### What changed

The connector always returned the facts; it returned them as sentences, which is what a tool result is. A chat full of "Saved as report.md, 12 KB, id 3f1a…" is a chat you have to read carefully to use. Now:

- Saving or converting a document draws the document.
- Asking what is on the account draws a list whose rows open, instead of printing an id per line.
- A delete that has not been confirmed draws the document it is about to remove, by name, with the button that removes it — which is the one place where "are you sure" should show you the thing rather than its id.

### It degrades to what it was

An assistant that does not draw these yet gets exactly the sentences it always did. The card is an extra payload alongside the text, not instead of it, so nothing breaks and nothing is missing — a host learns to draw it and the same connector starts looking different.

### What the connector can do

Convert in either direction, save, list, search, summarise, share — privately, by link, or to named addresses — read a document's version history, and report what the account is using. A read-only connection is genuinely read-only: it cannot save, share or delete, and that is enforced on the credential rather than on the tools.

Connect it at \`https://transformpipe.com/api/mcp\`. It signs in with your account; nothing is shared with the assistant's operator.

Related: [converting documents from an assistant](/blog/converting-documents-from-an-assistant), and [the same thing with an API](/blog/converting-documents-with-an-api).`,
      },
      de: {
        title: 'Ein Dokument im Chat sieht aus wie ein Dokument',
        summary: `Ein Assistent, der über den Connector ein Dokument speichert oder öffnet, kann dafür jetzt eine Karte zeichnen — den Namen, das Gewicht, die Zählungen, die ersten Zeilen und eine Schaltfläche, die es hier öffnet — statt eines Absatzes Text. Hosts, die noch keine Karten zeichnen, bekommen dieselben Sätze wie immer.`,
        description:
          'Der TransformPipe-Konnektor zeichnet für jedes Dokument, das ein Assistent speichert oder öffnet, eine Karte: Name, Größe, Zählwerte, erste Zeilen, Knopf.',
        keywords:
          'mcp konnektor dokumentenkonverter, claude markdown konnektor, dokumente aus dem chat konvertieren, mcp apps karte, dokument aus einem chat speichern',
        body: `Ein Werkzeugergebnis ist Text, und Text ist, was ein Assistent daraus macht: „Gespeichert als report.md, 12 KB, id 3f1a…". Einmal gelesen ist das in Ordnung. Fünfmal hintereinander ist es eine Wand, in der Sie die eine id suchen müssen, die Sie brauchen.

### Was sich geändert hat

Der Konnektor hat die Fakten immer geliefert; er hat sie als Sätze geliefert, was ein Werkzeugergebnis nun einmal ist. Ein Chat voller „Gespeichert als report.md, 12 KB, id 3f1a…" ist ein Chat, den man genau lesen muss, um ihn zu benutzen. Jetzt gilt:

- Wer ein Dokument speichert oder konvertiert, bekommt das Dokument gezeichnet.
- Die Frage, was auf dem Konto liegt, ergibt eine Liste, deren Zeilen sich öffnen lassen, statt einer id pro Zeile.
- Ein Löschen, das noch nicht bestätigt ist, zeichnet das Dokument, um das es geht, mit Namen und mit dem Knopf, der es entfernt — die eine Stelle, an der „Sind Sie sicher?" die Sache selbst zeigen sollte und nicht ihre id.

### Es fällt zurück auf das, was es war

Ein Assistent, der solche Karten noch nicht zeichnet, bekommt genau die Sätze, die er immer bekommen hat. Die Karte ist eine zusätzliche Nutzlast neben dem Text, nicht an seiner Stelle: es geht nichts kaputt und es fehlt nichts — ein Host lernt, sie zu zeichnen, und derselbe Konnektor sieht auf einmal anders aus.

### Was der Konnektor kann

In beide Richtungen konvertieren, speichern, auflisten, suchen, zusammenfassen, teilen — privat, per Link oder an benannte Adressen —, die Versionsgeschichte eines Dokuments lesen und melden, was das Konto verbraucht. Eine nur lesende Verbindung liest wirklich nur: sie kann nicht speichern, teilen oder löschen, und das wird an der Zugangsberechtigung durchgesetzt, nicht an den Werkzeugen.

Verbinden Sie ihn unter \`https://transformpipe.com/api/mcp\`. Er meldet sich mit Ihrem Konto an; mit dem Betreiber des Assistenten wird nichts geteilt.

Weiter: [Dokumente aus einem Assistenten heraus konvertieren](/blog/converting-documents-from-an-assistant) und [dasselbe über eine API](/blog/converting-documents-with-an-api).`,
      },
    },
    body:
      'An assistant that saves or opens a document through the connector can now draw a card for '
      + 'it — the name, what it weighs, the counts, the first lines, and a button that opens it '
      + 'here — instead of a paragraph of text. Asking what is on the account draws a list whose '
      + 'rows open the document rather than printing an id per line, and a delete that has not been '
      + 'confirmed draws the document it would remove, by name, with the button that removes it. '
      + 'Hosts that do not draw cards yet get the same sentences they always did.',
  },
  {
    date: '2026-09-18',
    title: 'Contact is Support, and it opens on the form',
    slug: 'support-page',
    detail: {
      en: {
        description:
          'TransformPipe support is two fields that write a GitHub issue for you. Nothing is sent from the page, and the old /contact address still lands in the right place.',
        keywords:
          'transformpipe support, report a conversion bug, request a file format, markdown converter help, report a shared document',
        body: `A blank "New issue" page is where a bug report goes to die. It asks somebody who noticed that tables came out empty to invent a format for saying so — a title, a structure, what is worth mentioning — and most people close the tab instead. So the two questions that actually matter are asked here, on \`/support\`, above everything else on the page.

### What the button does

It opens GitHub's new-issue page with the title and the body already written from what you typed. Nothing is sent from this page: no request, no copy, no queue. The issue exists only once you press Submit on GitHub, where you can read exactly what is about to be public first — which also means a GitHub account is needed for that last step.

Embedding GitHub's own form was the first idea and is not possible. \`github.com\` answers with \`x-frame-options: deny\`, which is the correct answer to a site asking to put somebody's session in an iframe.

### Why an issue and not a mailbox

Because that is where the answers are. A public issue is findable by the next person with the same problem, a fix links back to the report that caused it, and nothing is lost in one person's inbox. The cost is that a report is public; the form exists so you can see what will be, before it is.

### What to send, and what to send elsewhere

A file that converted wrongly is the most useful thing there is — attach it if you can share it, say what you expected instead, and name the browser if it looked right somewhere else. A conversion that is wrong on one file is usually wrong on a shape, and the file is how the shape gets found. A format we do not convert yet is a request worth making; several of the ones here started as one.

A shared document that should not be published has a faster route: every page a share link opens carries a "Report this document" link at its foot, which identifies the document without your having to describe it and needs no account. Questions about what is stored, and requests to delete an account and everything in it, go to the issues like anything else.

The old \`/contact\` address redirects here permanently, so a link to it from anywhere still lands in the right place.

Related: [Markdown tables that survive conversion](/blog/markdown-tables-that-survive-conversion), and [what not to keep from a \`.docx\`](/blog/what-not-to-keep-from-a-docx).`,
      },
      de: {
        title: 'Kontakt heißt Support, und es beginnt mit dem Formular',
        summary: `\`/contact\` heißt jetzt \`/support\`, und das Erste darauf sind zwei Felder: was passiert ist und was Sie erwartet haben. Der Knopf öffnet einen GitHub-Issue, in dem beides schon steht — von der Seite selbst wird nichts gesendet, und der Issue entsteht erst, wenn Sie dort auf Absenden drücken. Die alte Adresse leitet weiter, ein Link darauf landet also weiterhin richtig.`,
        description:
          'Der Support von TransformPipe sind zwei Felder, die einen GitHub-Issue vorschreiben. Von der Seite geht nichts weg, und die alte Adresse /contact leitet weiter.',
        keywords:
          'transformpipe support, konvertierungsfehler melden, dateiformat vorschlagen, hilfe markdown konverter, geteiltes dokument melden',
        body: `Eine leere Seite „Neues Issue" ist der Ort, an dem Fehlermeldungen sterben. Sie verlangt von jemandem, dem gerade leere Tabellen aufgefallen sind, eine Form dafür zu erfinden — einen Titel, einen Aufbau, eine Vorstellung davon, was erwähnenswert ist —, und die meisten schließen stattdessen den Tab. Die zwei Fragen, auf die es wirklich ankommt, stehen deshalb hier, auf \`/support\`, über allem anderen.

### Was der Knopf tut

Er öffnet die Issue-Seite von GitHub, in der Titel und Text schon aus dem stehen, was Sie getippt haben. Von dieser Seite geht nichts weg: keine Anfrage, keine Kopie, keine Warteschlange. Der Issue entsteht erst, wenn Sie auf GitHub auf Absenden drücken — wo Sie vorher genau lesen können, was öffentlich wird. Für diesen letzten Schritt wird ein GitHub-Konto gebraucht.

Das echte Formular einzubetten war die erste Idee und ist nicht möglich: \`github.com\` antwortet mit \`x-frame-options: deny\`, was die richtige Antwort an eine Seite ist, die fremde Sitzungen in einen iframe holen will.

### Warum ein Issue und kein Postfach

Weil dort die Antworten liegen. Ein öffentlicher Issue ist für die nächste Person mit demselben Problem auffindbar, eine Korrektur verweist zurück auf die Meldung, die sie ausgelöst hat, und nichts versandet im Postfach einer einzelnen Person. Der Preis ist, dass eine Meldung öffentlich ist; das Formular gibt es, damit Sie vorher sehen, was das sein wird.

### Was hierher gehört und was woandershin

Eine Datei, die falsch konvertiert wurde, ist das Nützlichste überhaupt — hängen Sie sie an, wenn Sie sie weitergeben können, schreiben Sie, was Sie erwartet hatten, und nennen Sie den Browser, falls es woanders richtig aussah. Was bei einer Datei falsch ist, ist meist bei einer Form falsch, und die Datei ist der Weg zu dieser Form. Ein Format, das wir noch nicht konvertieren, ist ein Wunsch, der sich lohnt: Mehrere der vorhandenen haben so angefangen.

Für ein geteiltes Dokument, das nicht veröffentlicht sein sollte, gibt es einen schnelleren Weg: Jede Seite, die ein Freigabelink öffnet, trägt am Fuß einen Link „Dieses Dokument melden". Er benennt das Dokument, ohne dass Sie es beschreiben müssen, und braucht kein Konto. Fragen dazu, was gespeichert wird, und die Bitte, ein Konto samt allem darin zu löschen, gehen wie alles andere in die Issues.

Die alte Adresse \`/contact\` leitet dauerhaft hierher, ein Link darauf landet also weiterhin richtig.

Weiter: [Markdown-Tabellen, die eine Konvertierung überleben](/blog/markdown-tables-that-survive-conversion) und [was ein Konverter aus einer \`.docx\` nicht behalten sollte](/blog/what-not-to-keep-from-a-docx).`,
      },
    },
    body:
      '`/contact` is now `/support`, and the first thing on it is two fields: what happened, and '
      + 'what you expected. The button opens a GitHub issue with both already written into it — '
      + 'nothing is sent from the page, and the issue exists once you press Submit there. The old '
      + 'address redirects, so a link to it still lands in the right place.',
  },
  {
    date: '2026-09-18',
    title: 'Words that CSS held apart stay apart',
    slug: 'words-css-held-apart',
    detail: {
      en: {
        description:
          'A stats row laid out with flex or grid serialises as 39words in every clipper. The TransformPipe extension reads the layout inside the page and puts the spaces back.',
        keywords:
          'web clipper missing spaces, words run together html to markdown, flex gap no whitespace markdown, breadcrumbs converted without spaces, save web page as markdown correctly',
        body: `Open a page's markup and look at the row of counts under an article heading. Very often there is not a single space character in it: \`<span>39</span><span>words</span>\`, and the gap you see on screen is a \`gap\` property on a flex container. The space is in the stylesheet, not in the document.

Every converter that comes after that sees the string and not the page — ours included — so the words arrive glued together. It is not an exotic shape either. A row of stats, a tag list, a breadcrumb trail and a pagination strip all look like this in any current framework.

### Why this can only be fixed inside the page

The one place that can tell whether two elements are laid out side by side is the page itself, while \`getComputedStyle\` still exists. By the time HTML has been copied out to be converted, the layout is gone with the stylesheet and no amount of guessing recovers it: nothing in \`<span>39</span><span>words</span>\` says whether a space belongs there or not.

So the extension clones the document, walks the clone beside the living one, and wherever the real element lays its children out as flex or grid items, the copy gets a space after each of them. The copy is what gets converted. Your page is not touched, and this runs only in the moment you press the button — there is no content script sitting in your tabs.

A file you drop on the site gets none of this, because there is no layout to read. That is the difference between converting a page and converting a copy of its markup, and it is most of the reason the extension exists.

### What it does not cover

Flex and grid, and nothing else. Space made by a margin on an inline-block, by absolute positioning, or by generated content in a \`::before\` is still invisible in the markup, and still comes out closed up.

Converting a selection is also untouched: a selected range is cloned straight out of the document, so a stat row lifted as a selection can still arrive as \`39words\`. Press the button without selecting anything and the whole-page path gives you the spaces.

Related: [saving a web page as Markdown](/blog/save-a-web-page-as-markdown), and [Turndown and the HTML-to-Markdown libraries](/blog/turndown-and-html-to-markdown-libraries).`,
      },
      de: {
        title: 'Wörter, die das CSS auseinanderhielt, bleiben auseinander',
        summary: `Eine Zeile wie \`39 words · 1 heading · 1 table\` besteht meist aus getrennten Elementen, deren Abstand aus dem Layout kommt und nicht aus dem Markup — konvertiert wurde sie also als \`39words1heading1table\`. Die Erweiterung liest die Seite jetzt mit ihrem Layout in der Hand und setzt diese Leerzeichen vor der Konvertierung zurück. Kennzahlenzeilen, Tag-Listen und Brotkrumen kommen wieder als Sätze heraus.`,
        description:
          'Eine mit Flex oder Grid gesetzte Kennzahlenzeile wird in jedem Clipper zu 39words. Die TransformPipe-Erweiterung liest das Layout und setzt die Leerzeichen zurück.',
        keywords:
          'clipper verschluckt leerzeichen, wörter zusammengeklebt html in markdown, flex gap kein leerzeichen markdown, brotkrumen ohne leerzeichen konvertiert, webseite korrekt als markdown speichern',
        body: `Sehen Sie sich im Markup einer Seite die Zeile mit den Zählwerten unter einer Artikelüberschrift an. Sehr oft steht darin kein einziges Leerzeichen: \`<span>39</span><span>words</span>\` — und der Abstand, den Sie auf dem Schirm sehen, ist eine \`gap\`-Eigenschaft an einem Flex-Container. Das Leerzeichen steckt im Stylesheet, nicht im Dokument.

Jeder Konverter danach sieht die Zeichenkette und nicht die Seite, der unsere eingeschlossen; die Wörter kommen also aneinandergeklebt an. Und das ist keine exotische Form: Eine Kennzahlenzeile, eine Tag-Liste, eine Brotkrumenspur und eine Seitennummerierung sehen in jedem aktuellen Framework so aus.

### Warum das nur in der Seite selbst zu beheben ist

Die einzige Stelle, die erkennen kann, ob zwei Elemente nebeneinander gesetzt sind, ist die Seite selbst, solange es dort \`getComputedStyle\` gibt. Sobald das HTML zum Konvertieren herauskopiert ist, ist das Layout mit dem Stylesheet verschwunden, und kein Raten holt es zurück: An \`<span>39</span><span>words</span>\` steht nicht, ob dort ein Leerzeichen hingehört.

Die Erweiterung klont deshalb das Dokument, geht den Klon neben dem lebenden Original durch, und wo das echte Element seine Kinder als Flex- oder Grid-Elemente setzt, bekommt die Kopie nach jedem von ihnen ein Leerzeichen. Konvertiert wird die Kopie. Ihre Seite wird nicht verändert, und das alles läuft nur in dem Moment, in dem Sie den Knopf drücken — in Ihren Tabs sitzt kein Skript.

Eine Datei, die Sie auf der Seite ablegen, bekommt davon nichts, weil es dort kein Layout zu lesen gibt. Das ist der Unterschied zwischen einer Seite und einer Kopie ihres Markups, und er ist ein guter Teil des Grundes, warum es die Erweiterung gibt.

### Was nicht erfasst wird

Flex und Grid, und nichts weiter. Abstand, der von einem Margin an einem Inline-Block, von absoluter Positionierung oder von erzeugtem Inhalt in einem \`::before\` kommt, ist im Markup weiterhin unsichtbar und kommt weiterhin zusammengeschoben heraus.

Auch eine Markierung bleibt unberührt: Ein markierter Bereich wird direkt aus dem Dokument geklont, eine als Markierung gehobene Kennzahlenzeile kann also nach wie vor als \`39words\` ankommen. Drücken Sie den Knopf, ohne etwas zu markieren, dann geht es über den Weg für die ganze Seite — und die Leerzeichen sind da.

Weiter: [eine Webseite als Markdown sichern](/blog/save-a-web-page-as-markdown) und [Turndown und die HTML-nach-Markdown-Bibliotheken](/blog/turndown-and-html-to-markdown-libraries).`,
      },
    },
    body:
      'A row like `39 words · 1 heading · 1 table` is usually built as separate elements with the '
      + 'space between them coming from the layout rather than from the markup — so it converted as '
      + '`39words1heading1table`. The extension now reads the page with its layout in hand and puts '
      + 'those spaces back before converting. Stat rows, tag lists and breadcrumbs come out as '
      + 'sentences again.',
  },
  {
    date: '2026-09-18',
    title: 'A document somebody shared with you is a document',
    slug: 'documents-shared-with-you',
    detail: {
      en: {
        description:
          'A document shared with you on TransformPipe opens with the card every other screen gives it — name, size, counts — and buttons that keep a copy or take the text.',
        keywords:
          'open a shared markdown document, save a copy of a shared document, document shared with me, markdown share link, download a shared document as html',
        body: `A link handed to somebody should open the document, not the product. That is why this page has no history, no dropzone and no account of its own — and for a while it took the idea too far: what it put above the document was a line of small print, which read as a preview of something rather than as the thing itself.

### The same card as everywhere else

Above the document now: its name, a badge saying it was shared with you, what it weighs, when it was converted, and its word, heading and table counts. It is the card the converter puts above a document it has just made, because it is the same object, and a reader deciding whether to keep something wants the same facts an owner does.

### The verbs are what differ

**Save a copy** puts it on your own account, and it is a copy: the sender's document stays theirs and nothing you do here reaches it. **Share** is about that copy, so pressing it saves one first rather than offering to republish somebody else's document. **Copy Markdown** takes the text, and **Download** gives you a self-contained \`.html\` file that opens anywhere with no connection.

Signed out, none of those sit there disabled explaining themselves: they open the sign-in dialog, because somebody who has just pressed Save has already said what they want. The dialog, not straight to Google — whoever was sent the link was sent it at an address that may well not be a Google account.

### Two pages, and which one you get

A link that anybody may open is \`/s/<token>\`, rendered by the server, running no script, and cacheable — which is what keeps a popular document off the database. A document shared with named addresses cannot be handed to a reader nobody has identified, so that link sends you to \`/open/<token>\`, the app's own view, which knows how to ask you to sign in as the address it was shared with.

Neither is indexed. Both carry a "Report this document" link at the foot, and a link that was never shared or has since been revoked says so rather than showing a stale page.

Related: [sharing a document as a link](/blog/share-a-markdown-document-as-a-link), and [turning AI output into a shareable page](/blog/ai-output-to-a-shareable-page).`,
      },
      de: {
        title: 'Ein Dokument, das jemand mit Ihnen geteilt hat, ist ein Dokument',
        summary: `Die Seite, die ein Freigabelink öffnet, trägt jetzt dieselbe Karte, die jeder andere Bildschirm über ein Dokument setzt — Name, Gewicht, Entstehungszeit und die Zählwerte — statt einer Zeile Kleingedrucktem. **Kopie speichern** legt es in Ihr eigenes Konto, **Teilen** veröffentlicht diese Kopie, und **Markdown kopieren** nimmt den Text. Abgemeldet öffnen diese Knöpfe den Anmeldedialog, statt untätig ausgegraut dazustehen.`,
        description:
          'Ein mit Ihnen geteiltes Dokument öffnet jetzt mit derselben Karte wie überall sonst — Name, Größe, Zählwerte — und mit Knöpfen für eine Kopie oder den Text.',
        keywords:
          'geteiltes markdown dokument öffnen, kopie eines geteilten dokuments speichern, mit mir geteiltes dokument, markdown freigabelink, geteiltes dokument als html herunterladen',
        body: `Ein Link, den man jemandem gibt, sollte das Dokument öffnen und nicht das Produkt. Deshalb hat diese Seite keinen Verlauf, keine Ablagefläche und kein eigenes Konto — und eine Zeit lang trieb sie den Gedanken zu weit: Über dem Dokument stand eine Zeile Kleingedrucktes, die sich wie die Vorschau auf etwas las und nicht wie die Sache selbst.

### Dieselbe Karte wie überall sonst

Über dem Dokument steht jetzt: sein Name, ein Abzeichen, dass es mit Ihnen geteilt wurde, sein Gewicht, der Zeitpunkt der Umwandlung und die Zahl seiner Wörter, Überschriften und Tabellen. Es ist die Karte, die der Konverter über ein frisch erzeugtes Dokument setzt, denn es ist dasselbe Objekt — und wer entscheidet, ob er etwas behalten will, braucht dieselben Angaben wie ein Besitzer.

### Unterschiedlich sind die Verben

**Kopie speichern** legt es in Ihr eigenes Konto, und es ist eine Kopie: Das Dokument des Absenders bleibt sein Dokument, und nichts, was Sie hier tun, erreicht es. **Teilen** bezieht sich auf diese Kopie und speichert deshalb zuerst eine, statt anzubieten, das Dokument einer anderen Person neu zu veröffentlichen. **Markdown kopieren** nimmt den Text, und **Herunterladen** gibt Ihnen eine eigenständige \`.html\`-Datei, die sich überall ohne Verbindung öffnet.

Abgemeldet steht keiner dieser Knöpfe ausgegraut da und erklärt sich: Sie öffnen den Anmeldedialog, denn wer gerade Speichern gedrückt hat, hat schon gesagt, was er will. Der Dialog, nicht direkt Google — wer diesen Link bekommen hat, hat ihn an eine Adresse bekommen, die gut und gern kein Google-Konto sein kann.

### Zwei Seiten, und welche Sie bekommen

Ein Link, den jeder öffnen darf, ist \`/s/<token>\`: vom Server gebaut, ohne jedes Skript, und zwischenspeicherbar — was ein viel gelesenes Dokument von der Datenbank fernhält. Ein Dokument, das für benannte Adressen geteilt ist, lässt sich keinem unbekannten Leser aushändigen; dieser Link schickt Sie deshalb auf \`/open/<token>\`, die eigene Ansicht der App, die Sie mit der Adresse anmelden kann, für die geteilt wurde.

Indexiert wird keine der beiden. Beide tragen am Fuß einen Link „Dieses Dokument melden", und ein Link, der nie geteilt oder inzwischen widerrufen wurde, sagt das, statt eine veraltete Seite zu zeigen.

Weiter: [ein Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link) und [aus einer KI-Ausgabe eine teilbare Seite machen](/blog/ai-output-to-a-shareable-page).`,
      },
    },
    body:
      'The page a share link opens now carries the same card every other screen puts above a '
      + 'document — the name, what it weighs, when it was made, and the counts — instead of a line '
      + 'of small print. **Save a copy** puts it on your own account, **Share** publishes that copy, '
      + 'and **Copy Markdown** takes the text. Signed out, those buttons open the sign-in dialog '
      + 'rather than sitting there disabled.',
  },
  {
    date: '2026-09-18',
    title: 'The connector says who it is',
    slug: 'connector-identity',
    detail: {
      en: {
        description:
          'The TransformPipe connector hands an assistant a title, a sentence about what its tools do, its website and its icons — the same mark as the favicon.',
        keywords:
          'mcp connector icon, mcp server identity, what a connector shows before you connect it, add a custom connector, transformpipe mcp connector',
        body: `A connector in an assistant is a row in a list — something a person picks before they know much about it. That row used to be one word and a version number, because a name and a version were all the protocol asked for when connectors were new.

### What the server says about itself

The handshake at \`/api/mcp\` now answers with a title, a sentence about what the tools do, the address of the site, and three icons. These are the protocol's own fields for a listing — the Implementation object in the 2025-11-25 schema — so a client that has never heard of them ignores what it does not recognise and still reads the name.

The same handshake hands over a short set of instructions, and every tool carries a readable title and says whether it changes anything, destroys anything, or reaches outside the account. \`tp_usage\` and \`tp_delete_document\` look identical to somebody holding only the names.

### Where the pictures come from

One drawing: \`brand/mark.svg\`, the same fused **T** and **p** as the favicon and the phone icon, rendered to 192 and 512 pixels and offered as the SVG as well. PNG is first in the list because a client that draws icons at all can draw a PNG.

Their addresses are built from the request rather than written down. The specification asks a client to check that an icon is served from the same origin as the server, and a hard-coded production address fails that check on every preview deployment.

### The token comes before the introduction

Every message to \`/api/mcp\` needs a token, the handshake included, so a client reads this identity once it is connected rather than while somebody is still choosing. It was tried the other way and undone the same night: an unauthenticated handshake made Claude's own **Add custom connector** dialogue conclude there was no sign-in here, warn that anybody with the URL could use the connector, and offer a field for an API key this server does not take.

So the 401 stays first. It is how a client learns there is an account behind the address at all — it names the discovery document and the scopes, and the sign-in starts from there. Nothing about anybody's documents is readable without that token, which is the part worth more than a picture in a directory.

Related: [converting documents from an assistant](/blog/converting-documents-from-an-assistant), and [converting documents with an API](/blog/converting-documents-with-an-api).`,
      },
      de: {
        title: 'Der Connector sagt, wer er ist',
        summary: `Ein Assistent, der TransformPipe als Connector hinzufügt, bekommt jetzt Symbol, Name und einen Satz darüber, was die Werkzeuge tun. Lesbar ist das, sobald verbunden ist: Ohne Anmeldung ist von einem Konto nichts zu sehen — und das bleibt so.`,
        description:
          'Der TransformPipe-Connector übergibt einem Assistenten Titel, einen Satz zu seinen Werkzeugen, Website und Symbole — dieselbe Marke wie das Favicon.',
        keywords:
          'mcp connector symbol, mcp server identität, eigenen connector hinzufügen, was zeigt ein connector vor dem verbinden, transformpipe connector einrichten',
        body: `Ein Connector ist in einem Assistenten eine Zeile in einer Liste — etwas, das man auswählt, bevor man viel darüber weiß. Diese Zeile war früher ein Wort und eine Versionsnummer, denn Name und Version waren alles, was das Protokoll in seinen Anfängen verlangte.

### Was der Server über sich selbst sagt

Der Handschlag unter \`/api/mcp\` antwortet jetzt mit einem Titel, einem Satz darüber, was die Werkzeuge tun, der Adresse der Seite und drei Symbolen. Das sind die Felder, die das Protokoll selbst für eine Auflistung vorsieht — das Implementation-Objekt im Schema vom 25.11.2025 —, und ein Client, der sie nicht kennt, überliest sie und findet trotzdem den Namen.

Derselbe Handschlag übergibt eine kurze Anleitung, und jedes Werkzeug trägt einen lesbaren Titel und sagt, ob es etwas ändert, etwas zerstört oder über das Konto hinausgreift. \`tp_usage\` und \`tp_delete_document\` sehen für jemanden, der nur die Namen hat, gleich aus.

### Woher die Bilder kommen

Aus einer Zeichnung: \`brand/mark.svg\`, dasselbe verschmolzene **T** und **p** wie im Favicon und im Symbol auf dem Telefon, gerendert auf 192 und 512 Pixel und zusätzlich als SVG angeboten. PNG steht zuerst in der Liste, denn ein Client, der überhaupt Symbole zeichnet, zeichnet PNG.

Die Adressen dazu werden aus der Anfrage gebaut, statt fest hinterlegt zu sein. Die Spezifikation verlangt, dass ein Client prüft, ob ein Symbol von derselben Herkunft wie der Server kommt — und eine fest eingetragene Produktionsadresse fällt bei dieser Prüfung in jeder Vorschau-Bereitstellung durch.

### Das Token kommt vor der Vorstellung

Jede Nachricht an \`/api/mcp\` braucht ein Token, der Handschlag eingeschlossen. Ein Client liest diese Identität also, sobald er verbunden ist, und nicht schon während der Auswahl. Der umgekehrte Weg war kurz in Betrieb und noch in derselben Nacht zurückgenommen: Ein Handschlag ohne Token brachte Claudes eigenen Dialog **Add custom connector** zu dem Schluss, hier gebe es keine Anmeldung — er warnte, jeder mit der URL könne den Connector benutzen, und bot ein Feld für einen API-Schlüssel an, den dieser Server nicht annimmt.

Der 401 bleibt deshalb vorne. Er ist der Weg, auf dem ein Client überhaupt erfährt, dass hinter der Adresse ein Konto steht: Er nennt das Discovery-Dokument und die Berechtigungen, und von dort beginnt die Anmeldung. Ohne dieses Token ist von den Dokumenten nichts lesbar — und das ist mehr wert als ein Bild in einem Verzeichnis.

Weiter: [Dokumente aus einem Assistenten konvertieren](/blog/converting-documents-from-an-assistant) und [Dokumente über eine API konvertieren](/blog/converting-documents-with-an-api).`,
      },
    },
    body:
      'The connector now carries an icon, a name and a sentence about what it does, so an assistant '
      + 'shows what it is connected to rather than a bare URL. It is read after signing in, not '
      + 'before: every message needs a token, `initialize` included, because a server that answers '
      + 'one without a token is a server a client reads as having no sign-in at all.',
  },
  {
    date: '2026-09-17',
    title: 'A browser extension',
    slug: 'browser-extension',
    detail: {
      en: {
        description:
          'The TransformPipe extension turns the page you are reading into Markdown from the toolbar — in Chrome, Edge and Firefox, with nothing uploaded.',
        keywords:
          'markdown converter chrome extension, save web page as markdown, html to markdown browser extension, convert article to markdown, web clipper markdown, firefox markdown extension',
        body: `The thing that makes this worth installing is not the button. It is that the conversion happens inside the page, where \`getComputedStyle\` still exists and the extension can see what a reader sees rather than what the markup says.

### What it does that a copy and paste does not

A web page is not a document. Selecting an article and pasting it into an editor brings the menus with it, loses the table structure, and turns every code block into prose. The extension reads the page the way a reader sees it: it finds the article, drops the furniture, keeps the headings, the tables, the lists and the code fences, and puts back the spaces that CSS was holding — a row of stats laid out as flex items serialises as \`39words\` in every other clipper, and arrives here as "39 words".

Selecting part of the page first converts the selection instead of the article, which is the fastest way to lift one table out of a documentation page.

### The side panel

The same thing, kept open beside the page. It converts each tab as you arrive at it, so moving through a set of search results means reading the Markdown of each one rather than pressing a button per page. It remembers whether you prefer the panel or the popup.

### All ten conversions, offline

The extension carries the site's converters rather than calling it: Markdown to HTML, HTML to Markdown, \`.docx\`, \`.csv\`, \`.xlsx\`, JSON, plain text, a Notion or Confluence export, an Obsidian vault. Nothing is uploaded, nothing needs a network, and none of it depends on an account.

### With an account

Signed in, **Save** puts the document on the account and **Share** opens the same dialogue the site has: private, anybody with the link, or named addresses who each sign in. The extension asks for no host permissions — it can only read a page at the moment you press the button, which is what \`activeTab\` means and why the permission list is as short as it is.

Chrome and Edge install it from the Web Store; Firefox from its own listing.

Related: [saving a web page as Markdown](/blog/save-a-web-page-as-markdown), and [what a converter should keep from a \`.docx\`](/blog/what-not-to-keep-from-a-docx).`,
      },
      de: {
        title: 'Eine Browser-Erweiterung',
        summary: `Die Seite, die Sie gerade lesen, als Markdown — ohne sie zu verlassen: ein Druck auf die Schaltfläche in der Symbolleiste, und der Artikel kommt ohne Navigation, Seitenleiste und Cookie-Hinweis zurück. Kopieren, herunterladen, oder die ganze Seite als eigenständige \`.html\`-Datei mit ihren Bildern darin speichern. Angemeldet legen **Speichern** und **Teilen** ein Dokument in Ihrem Konto ab.`,
        description:
          'Die TransformPipe-Erweiterung macht aus der Seite, die Sie gerade lesen, per Knopf in der Symbolleiste Markdown — in Chrome, Edge und Firefox, ohne Upload.',
        keywords:
          'markdown konverter chrome erweiterung, webseite als markdown speichern, html in markdown browser erweiterung, artikel in markdown umwandeln, web clipper markdown, firefox markdown erweiterung',
        body: `Was die Installation lohnend macht, ist nicht der Knopf. Es ist, dass die Konvertierung in der Seite selbst stattfindet, wo \`getComputedStyle\` noch existiert und die Erweiterung sehen kann, was ein Leser sieht, statt nur, was im Markup steht.

### Was es kann, was Kopieren und Einfügen nicht kann

Eine Webseite ist kein Dokument. Wer einen Artikel markiert und in einen Editor einfügt, nimmt die Menüs mit, verliert den Bau der Tabellen und macht aus jedem Codeblock Fließtext. Die Erweiterung liest die Seite so, wie ein Mensch sie sieht: sie findet den Artikel, lässt das Mobiliar weg, behält Überschriften, Tabellen, Listen und Code-Zäune und setzt die Leerzeichen zurück, die das CSS gehalten hat — eine Reihe von Kennzahlen, als Flex-Elemente gesetzt, wird in jedem anderen Clipper zu \`39words\` und kommt hier als "39 words" an.

Markieren Sie vorher einen Teil der Seite, wird die Markierung konvertiert statt des Artikels — der schnellste Weg, eine einzelne Tabelle aus einer Dokumentationsseite zu heben.

### Die Seitenleiste des Browsers

Dasselbe, offen neben der Seite. Sie konvertiert jeden Tab, sobald Sie ihn aufrufen: Wer sich durch eine Reihe von Suchtreffern bewegt, liest das Markdown jedes Treffers, statt pro Seite einen Knopf zu drücken. Sie merkt sich, ob Sie die Leiste oder das Popup bevorzugen.

### Alle zehn Konvertierungen, offline

Die Erweiterung bringt die Konverter der Seite mit, statt sie aufzurufen: Markdown zu HTML, HTML zu Markdown, \`.docx\`, \`.csv\`, \`.xlsx\`, JSON, reiner Text, ein Notion- oder Confluence-Export, ein Obsidian-Tresor. Nichts wird hochgeladen, nichts braucht ein Netz, und nichts davon hängt an einem Konto.

### Mit Konto

Angemeldet legt **Speichern** das Dokument auf das Konto, und **Teilen** öffnet denselben Dialog wie die Seite: privat, für alle mit dem Link, oder für benannte Adressen, die sich jeweils anmelden. Die Erweiterung verlangt keine Host-Berechtigungen — sie darf eine Seite nur in dem Moment lesen, in dem Sie den Knopf drücken, was \`activeTab\` bedeutet und warum die Liste der Berechtigungen so kurz ist.

Chrome und Edge installieren sie aus dem Web Store, Firefox aus dem eigenen Verzeichnis.

Weiter: [eine Webseite als Markdown sichern](/blog/save-a-web-page-as-markdown) und [was ein Konverter aus einer \`.docx\` behalten sollte](/blog/what-not-to-keep-from-a-docx).`,
      },
    },
    body:
      'The page you are on, as Markdown, without leaving it: press the button in the toolbar and '
      + 'the article comes back without the navigation, the sidebar or the cookie notice. Copy it, '
      + 'download it, or save the page as a self-contained `.html` file with its pictures inside. '
      + 'The side panel is the same thing kept open beside the page, converting each tab as you '
      + 'arrive at it, and the ten conversions the site has run inside the extension too — nothing '
      + 'is uploaded and none of it needs a network. Signed in, Save and Share put a document on '
      + 'your account and publish a link or name the people who may read it. '
      + '[What it is and what it never does](/extension).',
  },
  {
    date: '2026-09-17',
    title: 'A shared document says where it came from',
    slug: 'shared-document-provenance',
    detail: {
      en: {
        description:
          'A shared TransformPipe page says at its foot what made it and offers a way to convert a file of your own; the downloaded .html carries the same line.',
        keywords:
          'share a markdown document as a link, what made this page, shared document footer, self-contained html footer, convert a file like this one',
        body: `Somebody who opens a link you sent has no reason to know what made the page they are reading. It is a document at an address, with no menu and no product around it — which is deliberate, and left a reader with nowhere to go when what they wanted was to do the same thing with a file of their own.

### What is at the foot of a shared page

One line under the document: that it is a shared document, when it was converted, and a link to report it if it should not be public. Under that, a short block naming what made the page, what the site converts, and two links — one to the converter, one to the account that keeps documents.

Nothing above the document moved. The card at the top is the same card the app puts over any document — the name, what it weighs, when it was made, the counts — with **Save to your account** and **Download .html** where they were.

### The downloaded file carries the line too

The self-contained \`.html\` ends with the document's name, when it was converted, and *made with TransformPipe*. That file is the one that gets emailed and opened on a machine with no network, so the line is text and a link and nothing else: no script, no image, no web font. The shared page runs no script either — it is HTML rendered once on the way out.

### Why the foot and not the top

A shared link is somebody else's document, and the top of it belongs to them. A banner over the first paragraph would be an advertisement in the middle of something a colleague sent to be read, and the document is the reason the page exists.

### What it does not do

It does not change the document. The Markdown, the HTML and every heading, table and link in them are exactly what they were, so a link you shared last month renders the same today. The two links carry \`?from=shared\` and \`?from=file\` in the address, and that marker is the whole of what is added — no identifier for the reader, no request to anywhere, nothing written to their browser.

Related: [sharing a Markdown document as a link](/blog/share-a-markdown-document-as-a-link), and [what a self-contained HTML file is](/blog/self-contained-html-explained).`,
      },
      de: {
        title: 'Ein geteiltes Dokument sagt, woher es kommt',
        summary: `Wer einen von Ihnen geteilten Link öffnet, findet am Fuß der Seite eine Zeile darüber, was sie gemacht hat, und einen Weg, etwas Eigenes zu konvertieren. Die heruntergeladene \`.html\` trägt dieselbe Zeile leise in ihrer Fußzeile. Am Dokument selbst hat sich nichts geändert.`,
        description:
          'Eine geteilte TransformPipe-Seite nennt am Fuß, was sie gemacht hat, und bietet den Weg zur eigenen Konvertierung; die `.html` trägt dieselbe Zeile.',
        keywords:
          'markdown dokument als link teilen, wer hat diese seite gemacht, fußzeile eines geteilten dokuments, eigenständige html datei mit fußzeile, eigene datei konvertieren',
        body: `Wer einen Link öffnet, den Sie verschickt haben, hat keinen Anlass zu wissen, was die Seite gemacht hat, die er liest. Es ist ein Dokument unter einer Adresse, ohne Menü und ohne Produkt darum herum — das ist Absicht, und es ließ einen Leser ohne Weg zurück, wenn er dasselbe mit einer eigenen Datei tun wollte.

### Was am Fuß einer geteilten Seite steht

Eine Zeile unter dem Dokument: dass es ein geteiltes Dokument ist, wann es konvertiert wurde, und ein Link, um es zu melden, falls es nicht öffentlich sein sollte. Darunter ein kurzer Block, der nennt, was die Seite gemacht hat, was die Seite konvertiert, und zwei Links — einen zum Konverter, einen zum Konto, das Dokumente aufbewahrt.

Über dem Dokument hat sich nichts verschoben. Die Karte oben ist dieselbe, die die App über jedes Dokument setzt — Name, Gewicht, Entstehungszeit, die Kennzahlen — mit **Save to your account** und **Download .html** an ihrem Platz.

### Die heruntergeladene Datei trägt die Zeile ebenfalls

Die in sich geschlossene \`.html\` endet mit dem Namen des Dokuments, dem Zeitpunkt der Konvertierung und *made with TransformPipe*. Genau diese Datei wird per E-Mail verschickt und auf Rechnern ohne Netz geöffnet, deshalb ist die Zeile Text und ein Link und sonst nichts: kein Skript, kein Bild, keine Web-Schrift. Auch die geteilte Seite führt kein Skript aus — sie ist HTML, einmal beim Ausliefern erzeugt.

### Warum unten und nicht oben

Ein geteilter Link ist das Dokument eines anderen Menschen, und der Anfang gehört ihm. Ein Banner über dem ersten Absatz wäre Werbung mitten in etwas, das eine Kollegin zum Lesen geschickt hat — und das Dokument ist der Grund, warum die Seite existiert.

### Was es nicht tut

Es verändert das Dokument nicht. Das Markdown, das HTML und jede Überschrift, Tabelle und Verknüpfung darin sind unverändert, ein Link von letztem Monat sieht also heute genauso aus. Die beiden Links tragen \`?from=shared\` und \`?from=file\` in der Adresse, und dieser Vermerk ist alles, was hinzukommt — keine Kennung für den Leser, keine Anfrage irgendwohin, nichts, was in seinem Browser gespeichert wird.

Weiter: [ein Markdown-Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link) und [was eine in sich geschlossene HTML-Datei ist](/blog/self-contained-html-explained).`,
      },
    },
    body:
      'Somebody who opens a link you shared now finds a line at the foot of it about what made the '
      + 'page, and a way to convert something of their own. The downloaded `.html` carries the same '
      + 'line, quietly, in its footer. Nothing about the document itself changed.',
  },
  {
    date: '2026-09-17',
    title: 'Your documents, two letters away',
    slug: 'keyboard-shortcuts',
    detail: {
      en: {
        description:
          'Cmd K over TransformPipe opens your last five documents, every conversion and every page, and finds any of them by typing two letters.',
        keywords:
          'keyboard shortcuts document converter, cmd k command palette, find a saved document by name, jump to a converted document, keyboard navigation markdown converter',
        body: `There is one shortcut in this app, and everything else is reached through it: \`⌘K\`, or \`Ctrl K\` away from a Mac. It is bound once, on the bar that sits above every page, so it works on the converter, in the history, in the documentation and halfway down an article. Pressing it again closes what it opened.

### What is in the box before you type

The five documents you converted most recently, newest first, each with the conversion that made it. A palette that opens on an empty list makes you type before it tells you anything, and the answer most of the time is one of the last few things you were working on.

Which documents those are depends on where your documents are. Signed in, it is the account's history; signed out, it is what this browser has converted and not saved. When there are more than five, a sixth row goes to the history for the rest.

Under them: the ten conversions with the file extensions each one takes, the live preview, the places — history, documentation, blog, changelog — and every static page with its address.

### The keys

- \`↑\` and \`↓\` walk the list, and so do \`Ctrl P\` and \`Ctrl N\`. The list wraps at both ends.
- \`Return\` opens whatever is highlighted.
- \`Esc\` closes the box and leaves you where you were.
- The mouse works too: moving over a row highlights it, and clicking opens it.

Typing filters on the row's name, on the detail beside it and on the group it sits in, ignoring case and accents — so \`konvertieren\` finds itself whichever way it is capitalised, and a search reaches every document in the history rather than only the five on show.

### What it cannot find

Words inside your documents. That search asks the server, which takes a moment and needs somewhere to show what it found with the context around it, so it stays on the history page where it already lives. This box answers while you are still typing, which it can only do because the list is already in the browser — no request goes out when you open it.

Related: [what to look for in an online document converter](/blog/best-online-document-converters), and [sharing a Markdown document as a link](/blog/share-a-markdown-document-as-a-link).`,
      },
      de: {
        title: 'Ihre Dokumente, zwei Buchstaben entfernt',
        summary: `\`⌘K\` öffnet jetzt auf den fünf Dokumenten, die Sie zuletzt konvertiert haben, und wer tippt, durchsucht sie nach Namen — neben den Konvertierungen und den Seiten, und zwar jedes Dokument der Liste, nicht nur die fünf. \`Alle Dokumente ansehen\` führt zum Verlauf.`,
        description:
          'Cmd K öffnet über TransformPipe Ihre letzten fünf Dokumente, jede Konvertierung und jede Seite — gefunden mit zwei getippten Buchstaben.',
        keywords:
          'tastenkürzel dokumentenkonverter, cmd k befehlspalette, gespeichertes dokument nach namen finden, zu einem konvertierten dokument springen, markdown konverter mit tastatur bedienen',
        body: `Es gibt in dieser App ein Tastenkürzel, und alles andere ist darüber erreichbar: \`⌘K\`, abseits eines Macs \`Strg K\`. Es hängt einmal an der Leiste, die über jeder Seite steht, und funktioniert deshalb im Konverter, im Verlauf, in der Dokumentation und mitten in einem Artikel. Ein zweiter Druck schließt wieder, was der erste geöffnet hat.

### Was im Feld steht, bevor Sie tippen

Die fünf Dokumente, die Sie zuletzt konvertiert haben, das neueste zuerst, jedes mit der Konvertierung, aus der es kam. Eine Palette, die sich auf einer leeren Liste öffnet, verlangt erst das Tippen, bevor sie etwas verrät — und die Antwort ist meistens eines der letzten Dinge, an denen Sie gearbeitet haben.

Welche Dokumente das sind, hängt davon ab, wo Ihre Dokumente liegen. Angemeldet ist es der Verlauf des Kontos; abgemeldet das, was dieser Browser konvertiert und nicht gespeichert hat. Sind es mehr als fünf, führt eine sechste Zeile zum Verlauf mit dem Rest.

Darunter: die zehn Konvertierungen samt den Dateiendungen, die jede annimmt, die Live-Vorschau, die Ziele — Verlauf, Dokumentation, Blog, Changelog — und jede feste Seite mit ihrer Adresse.

### Die Tasten

- \`↑\` und \`↓\` gehen durch die Liste, \`Strg P\` und \`Strg N\` ebenso. Die Liste läuft an beiden Enden um.
- \`Eingabe\` öffnet, was hervorgehoben ist.
- \`Esc\` schließt das Feld und lässt Sie dort, wo Sie waren.
- Die Maus geht auch: Wer über eine Zeile fährt, hebt sie hervor, ein Klick öffnet sie.

Getippt wird nach dem Namen der Zeile, nach der Angabe daneben und nach der Gruppe gefiltert, ohne Rücksicht auf Groß- und Kleinschreibung und auf Akzente — \`konvertieren\` findet sich also in jeder Schreibweise, und eine Suche erreicht jedes Dokument im Verlauf, nicht nur die fünf sichtbaren.

### Was es nicht finden kann

Wörter innerhalb Ihrer Dokumente. Diese Suche fragt den Server, braucht einen Moment und einen Ort, an dem sich der Fund mit seinem Umfeld zeigen lässt — sie bleibt deshalb auf der Verlaufsseite, wo sie längst zu Hause ist. Dieses Feld antwortet, während Sie noch tippen, und das kann es nur, weil die Liste bereits im Browser liegt: Beim Öffnen geht keine Anfrage hinaus.

Weiter: [worauf es bei einem Online-Dokumentenkonverter ankommt](/blog/best-online-document-converters) und [ein Markdown-Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link).`,
      },
    },
    body:
      '`⌘K` now opens on the five documents you converted last, and typing searches them by name '
      + 'alongside the conversions and the pages — every document in the list, not only the five. '
      + '`See all documents` goes to the history.',
  },
  {
    date: '2026-09-17',
    title: 'The cookie question, asked properly',
    slug: 'cookie-consent',
    detail: {
      en: {
        description:
          'What TransformPipe stores in your browser and when: two categories, analytics off until you allow it, and Google’s tags writing nothing before you answer.',
        keywords:
          'cookie banner document converter, what cookies does this site use, reject analytics cookies, google consent mode, change cookie settings',
        body: `There are two categories of storage on this site, and only one of them is a question. Necessary is the sign-in session and the look you picked; analytics is Google Analytics, through Google Tag Manager, counting how many people arrive and which pages they read. There is no third category, because there is no advertising here.

### What is stored, and when

Before you answer, nothing of ours. The page denies every storage category — analytics, and all three advertising ones — in the markup, before the tag manager loads, so Google's tags start in a state where they write no cookie and send cookieless pings at most. The switch for analytics turns that denial into permission, and nothing else does.

Your answer itself is kept in this browser's local storage, under \`m2h.consent\`, with the version of the question and the moment you answered it. That is why the banner appears once rather than on every visit, and it is read back on the next one so a granted category is granted again.

Three other things live in local storage and are not cookies and not optional: the theme, the language, and the conversions you have made in this browser and not saved. They never leave the machine.

### The three answers, one click each

**Accept all**, **Only necessary**, or **Customise** to see the switches. Refusing is a button of its own and the close cross in the corner as well — a banner where "no" costs more clicks than "yes" is not a question, and the regulators who write about this say so in as many words.

Inside the switches, Necessary is on and cannot be turned off: refusing the session cookie means refusing to sign in. Analytics is the one switch that moves.

### Changing your mind

The [cookies page](/cookies) has a button that reopens the same switches, and it shows what you chose and when. Choosing again replaces the answer; clearing the site's data in your browser removes it, and the question comes back on the next visit.

Nothing here has anything to do with converting a file. That runs in your browser either way, with or without analytics, signed in or not.

Related: [whether an online converter is safe](/blog/is-an-online-converter-safe), and [sanitising Markdown safely](/blog/sanitising-markdown-safely).`,
      },
      de: {
        title: 'Die Cookie-Frage, richtig gestellt',
        summary: `Ein Banner beim ersten Besuch, mit drei Antworten von je einem Klick: annehmen, nur notwendige, oder die Schalter öffnen. Die Analyse ist das einzige Optionale auf dieser Seite und bleibt aus, bis sie erlaubt ist — vor einer Antwort schreiben Googles Tags nichts in Ihren Browser. Die Antwort bleibt in diesem Browser, die Frage kommt also einmal; der Knopf am Fuß der [Cookie-Seite](/cookies) öffnet sie wieder, und die Seiten zu Datenschutz und Cookies sagen das alles jetzt auch.`,
        description:
          'Was TransformPipe wann in Ihrem Browser speichert: zwei Kategorien, Analyse aus bis zur Zustimmung, und Googles Tags schreiben vor Ihrer Antwort nichts.',
        keywords:
          'cookie banner dokumentenkonverter, welche cookies nutzt diese seite, analyse cookies ablehnen, google consent mode, cookie einstellungen ändern',
        body: `Auf dieser Seite gibt es zwei Kategorien von Speicherung, und nur eine davon ist eine Frage. Notwendig ist die Anmeldesitzung und das gewählte Erscheinungsbild; die Analyse ist Google Analytics über Google Tag Manager und zählt, wie viele Menschen ankommen und welche Seiten sie lesen. Eine dritte Kategorie gibt es nicht, denn hier wird nicht geworben.

### Was gespeichert wird, und wann

Vor Ihrer Antwort nichts von uns. Die Seite verweigert jede Speicherkategorie — die Analyse und alle drei Werbekategorien — bereits im Markup, bevor der Tag Manager lädt. Googles Tags starten damit in einem Zustand, in dem sie kein Cookie schreiben und höchstens cookielose Signale senden. Erst der Schalter für die Analyse macht aus dieser Verweigerung eine Erlaubnis, und sonst tut das nichts.

Ihre Antwort selbst liegt im lokalen Speicher dieses Browsers, unter \`m2h.consent\`, mit der Version der Frage und dem Zeitpunkt der Antwort. Deshalb erscheint das Banner einmal und nicht bei jedem Besuch; beim nächsten Mal wird die Antwort wieder eingelesen, damit eine erlaubte Kategorie erneut erlaubt ist.

Drei weitere Dinge liegen im lokalen Speicher, sind keine Cookies und nicht wählbar: das Erscheinungsbild, die Sprache und die Konvertierungen, die Sie in diesem Browser gemacht und nicht gespeichert haben. Sie verlassen den Rechner nie.

### Drei Antworten, je ein Klick

**Alle akzeptieren**, **Nur notwendige** — oder **Anpassen** für die Schalter. Das Ablehnen ist ein eigener Knopf und zusätzlich das Kreuz in der Ecke: Ein Banner, auf dem das Nein mehr Klicks kostet als das Ja, ist keine Frage, und die Aufsichtsbehörden schreiben genau das.

Hinter den Schaltern ist **Notwendig** an und nicht abschaltbar: Das Sitzungscookie abzulehnen hieße, sich nicht anzumelden. Die **Analyse** ist der eine Schalter, der sich bewegt.

### Wenn Sie es sich anders überlegen

Die [Cookie-Seite](/cookies) hat einen Knopf, der dieselben Schalter wieder öffnet, und sie zeigt, was Sie gewählt haben und wann. Eine neue Wahl ersetzt die alte; wer die Websitedaten im Browser löscht, entfernt sie, und beim nächsten Besuch steht die Frage wieder da.

Mit dem Konvertieren einer Datei hat alles das nichts zu tun. Das läuft ohnehin in Ihrem Browser — mit Analyse oder ohne, angemeldet oder nicht.

Weiter: [ob ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe) und [Markdown sicher bereinigen](/blog/sanitising-markdown-safely).`,
      },
    },
    body:
      'A banner on a first visit, with three answers of one click each: accept, only necessary, or '
      + 'open the switches. Analytics is the single optional thing on this site and it stays off '
      + 'until it is allowed — before an answer, Google’s tags write nothing to your browser. The '
      + 'answer is kept in this browser, so the banner is asked once; the button at the foot of the '
      + '[cookies page](/cookies) reopens it, and the privacy and cookies pages now say all of this.',
  },
  {
    date: '2026-09-16',
    title: 'A bar you can type into',
    slug: 'command-palette',
    detail: {
      en: {
        description:
          'The TransformPipe header is built around a search box: press Cmd K and every conversion, page and recent document is two letters and one Return away.',
        keywords:
          'command palette web app, cmd k search box, switch between conversions, document converter navigation, find a page without a menu',
        body: `Ten conversions, a handful of destinations and every page the footer lists is more than a row of links can carry. The old bar carried them anyway, so getting anywhere meant opening a menu, reading it, and picking — reasonable the first time and slow every time after, once you already know where you are going.

### The bar now holds four things

The wordmark, which goes home. A control naming the conversion you are on — not the word "Converter", but *Markdown to HTML* or *Excel to a Markdown table* — which opens the ten of them and the live preview. The search box. Then the destinations as glyphs with their names in the tooltip, and the account menu.

The control keeps the conversion's name everywhere in the app, including on pages that are not conversions, because that is the question it exists to answer: which one you are coming back to. All ten names are drawn into the same cell with nine of them invisible, so the control is as wide as the longest name in whatever language is on and stops resizing under your cursor as you switch between them.

### The box is a button

Nothing is typed into the bar itself. Clicking it, or pressing \`⌘K\` — \`Ctrl K\` away from a Mac — opens a box over the page with the whole app in one list: your recent documents, the ten conversions with the extensions each one takes, the destinations, and the static pages with their addresses. Two letters and \`Return\` is the shortest way through any of it. The hint on the right of the box shows \`⌘\` or \`Ctrl\` depending on the machine, read after the page loads, because the server has no keyboard.

### The trail moved out of the page

Where you are — the crumbs from the blog down to an article, or from the documentation down to a section — used to be printed by each page inside its own content. It now sits in a strip of its own directly under the bar, in the same place on every page, and the pages still decide what it says.

### What it is not

Not a command line. Every row in the box goes somewhere — a conversion, a page, a document — and nothing in it converts, saves, deletes or shares. It also does not search inside your documents; that lives in the history, which can show what it found.

Related: [what a Markdown to HTML converter is for](/blog/markdown-to-html-converter), and [Markdown editors worth using](/blog/best-markdown-editors).`,
      },
      de: {
        title: 'Eine Leiste, in die man tippen kann',
        summary: `Die Kopfzeile ist um ein Suchfeld herum neu gebaut: \`⌘K\` drücken — abseits eines Macs \`Strg K\` — und jede Konvertierung und jede Seite der App ist zwei Buchstaben entfernt. Die Leiste selbst liegt jetzt unter der Seite statt darüber, die Konvertierung, in der Sie sind, steht als Erstes darauf, und der Pfad, der sagt, wo Sie sind, ist aus der Seite in eine eigene Zeile darunter gezogen.`,
        description:
          'Die Kopfzeile von TransformPipe ist um ein Suchfeld gebaut: Strg K, und jede Konvertierung, jede Seite und jedes Dokument ist zwei Buchstaben entfernt.',
        keywords:
          'befehlspalette web app, cmd k suchfeld, zwischen konvertierungen wechseln, navigation im dokumentenkonverter, seite ohne menü finden',
        body: `Zehn Konvertierungen, eine Handvoll Ziele und jede Seite, die die Fußzeile aufführt: Das ist mehr, als eine Reihe von Links tragen kann. Die alte Leiste trug es trotzdem, und so hieß jeder Weg: Menü öffnen, lesen, auswählen — beim ersten Mal vernünftig und jedes weitere Mal langsam, wenn man sein Ziel längst kennt.

### Die Leiste hält jetzt vier Dinge

Die Wortmarke, die nach Hause führt. Ein Bedienelement, das die Konvertierung benennt, in der Sie gerade sind — nicht das Wort *Konverter*, sondern *Markdown zu HTML* oder *Excel zu einer Markdown-Tabelle* —, und das die zehn Konvertierungen und die Live-Vorschau öffnet. Das Suchfeld. Dahinter die Ziele als Zeichen, deren Namen im Tooltip stehen, und das Konto-Menü.

Das Bedienelement behält den Namen der Konvertierung überall in der App, auch auf Seiten, die keine Konvertierung sind — denn das ist die Frage, für die es da ist: zu welcher Sie zurückkehren. Alle zehn Namen liegen in derselben Zelle, neun davon unsichtbar, damit das Element so breit ist wie der längste Name in der eingestellten Sprache und beim Wechseln nicht unter dem Zeiger die Breite ändert.

### Das Feld ist ein Knopf

In die Leiste selbst wird nichts getippt. Ein Klick darauf oder \`⌘K\` — abseits eines Macs \`Strg K\` — öffnet über der Seite ein Feld mit der ganzen App in einer Liste: Ihre letzten Dokumente, die zehn Konvertierungen samt den Endungen, die jede annimmt, die Ziele und die festen Seiten mit ihren Adressen. Zwei Buchstaben und \`Eingabe\` sind der kürzeste Weg durch all das. Der Hinweis rechts im Feld zeigt \`⌘\` oder \`Strg\`, je nach Rechner, und wird erst nach dem Laden gelesen — der Server hat keine Tastatur.

### Der Pfad ist aus der Seite ausgezogen

Wo Sie sind — vom Blog hinunter zu einem Artikel, von der Dokumentation hinunter zu einem Abschnitt — druckte früher jede Seite selbst in ihren eigenen Inhalt. Jetzt steht der Pfad in einem eigenen Streifen direkt unter der Leiste, auf jeder Seite an derselben Stelle, und die Seiten entscheiden weiterhin, was darin steht.

### Was es nicht ist

Keine Kommandozeile. Jede Zeile im Feld führt irgendwohin — zu einer Konvertierung, einer Seite, einem Dokument —, und nichts darin konvertiert, speichert, löscht oder teilt. Es sucht auch nicht innerhalb Ihrer Dokumente; das liegt im Verlauf, der den Fund auch zeigen kann.

Weiter: [wozu ein Markdown-nach-HTML-Konverter da ist](/blog/markdown-to-html-converter) und [Markdown-Editoren, die sich lohnen](/blog/best-markdown-editors).`,
      },
    },
    body:
      'The header is rebuilt around a search box: press `⌘K` — `Ctrl K` away from a Mac — and every '
      + 'conversion and every page in the app is two letters away. The bar itself now sits under the '
      + 'page rather than on top of it, the conversion you are on is the first thing on it, and the '
      + 'trail saying where you are moved out of the page and into a line of its own underneath.',
  },
  {
    date: '2026-09-16',
    title: 'A new mark',
    slug: 'new-logo',
    detail: {
      en: {
        description:
          'TransformPipe has a drawn wordmark — a T and a p sharing one stem — and the same two letters are the icon in the tab, on a phone and in the store.',
        keywords:
          'transformpipe logo, new favicon, wordmark and app icon, what the tp mark is, icon on a phone home screen',
        body: `The old mark was \`T>pipe\` set in whatever monospace the machine had, with the caret borrowed from a shell prompt. It cost nothing and looked like what it was: a typeface the browser happened to own, which meant the name was a slightly different shape on every screen it appeared on.

### What the mark is

A capital **T** and a lower-case **p** fused along the stem they share, with the rest of the word — *ipe* — beside them. The T is the colour of the text around it and the p is cyan. Because it is drawn rather than set, it is the same shape at any size, on any machine, and in a screenshot somebody takes of it.

It is inline SVG in the page rather than an image file, for the two things an image cannot do: take the colour of the text it sits next to, and arrive in the same breath as the markup instead of a request later, which is what leaves a hole in the corner a visitor looks at first.

### Where it appears

The two fused letters alone, on a dark rounded square, are the icon. At sixteen pixels a whole word is a smudge; two overlapping letters are still two letters.

One drawing produces all of it. The browser tab and the bookmark take the SVG; an iPhone home screen and an Android launcher take PNGs, the Android one drawn smaller inside its square so a launcher can crop it without cutting the letters; \`favicon.ico\` exists for the things that ask for it without reading the page first — a link unfurl, a feed reader, a connector list. The browser extension uses the same icon in the toolbar and on its Web Store listing, and an assistant adding the connector is handed the same file.

Nothing else changed: no colours on the site moved, and no page was redrawn around it.

Related: [saving a web page as Markdown](/blog/save-a-web-page-as-markdown), and [what to look for in an online document converter](/blog/best-online-document-converters).`,
      },
      de: {
        title: 'Ein neues Zeichen',
        summary: `Der Name ist jetzt eine Zeichnung und nicht mehr sechs Zeichen Festbreitenschrift: ein \`T\` und ein \`p\`, die einen Stamm teilen. Dasselbe Paar für sich allein ist das Symbol — Tab, Lesezeichen, Startbildschirm des Telefons und Android-Launcher bekommen also ein echtes Symbol statt eines Buchstabens, den der Browser geraten hat.`,
        description:
          'TransformPipe hat eine gezeichnete Wortmarke — ein T und ein p mit gemeinsamem Stamm — und dieselben zwei Buchstaben sind das Symbol im Tab und im Store.',
        keywords:
          'transformpipe logo, neues favicon, wortmarke und app symbol, was das tp zeichen ist, symbol auf dem home bildschirm',
        body: `Das alte Zeichen war \`T>pipe\`, gesetzt in der Festbreitenschrift, die der jeweilige Rechner gerade hatte, mit einem Größer-Zeichen aus der Eingabeaufforderung. Es kostete nichts und sah aus wie das, was es war: eine Schrift, die der Browser zufällig besaß — der Name hatte also auf jedem Bildschirm eine etwas andere Gestalt.

### Was das Zeichen ist

Ein großes **T** und ein kleines **p**, verschmolzen an dem Stamm, den beide teilen, und daneben der Rest des Wortes: *ipe*. Das T hat die Farbe des umgebenden Textes, das p ist türkis. Weil es gezeichnet und nicht gesetzt ist, hat es in jeder Größe, auf jedem Rechner und in jedem Bildschirmfoto dieselbe Gestalt.

Es liegt als SVG in der Seite und nicht als Bilddatei, wegen der zwei Dinge, die ein Bild nicht kann: die Farbe des Textes neben sich annehmen, und im selben Atemzug wie das Markup ankommen statt eine Anfrage später — was sonst ein Loch genau in der Ecke lässt, auf die ein Besucher zuerst schaut.

### Wo es auftaucht

Die beiden verschmolzenen Buchstaben allein, auf einem dunklen, abgerundeten Quadrat, sind das Symbol. Bei sechzehn Pixeln ist ein ganzes Wort ein Fleck; zwei überlappende Buchstaben sind noch zwei Buchstaben.

Alles entsteht aus einer Zeichnung. Browser-Tab und Lesezeichen nehmen das SVG; ein iPhone-Startbildschirm und ein Android-Launcher nehmen PNGs, das für Android kleiner in seinem Quadrat, damit der Launcher beschneiden kann, ohne die Buchstaben zu treffen; \`favicon.ico\` gibt es für alles, was danach fragt, ohne vorher die Seite zu lesen — eine Link-Vorschau, ein Feedreader, eine Connector-Liste. Die Browser-Erweiterung benutzt dasselbe Symbol in der Symbolleiste und im Web Store, und ein Assistent, der den Connector hinzufügt, bekommt dieselbe Datei.

Sonst hat sich nichts geändert: Keine Farbe der Seite ist verschoben, und keine Seite wurde darum herum neu gezeichnet.

Weiter: [eine Webseite als Markdown sichern](/blog/save-a-web-page-as-markdown) und [worauf es bei einem Online-Dokumentenkonverter ankommt](/blog/best-online-document-converters).`,
      },
    },
    body:
      'The name is now a drawing rather than six characters of monospace: a `T` and a `p` sharing '
      + 'one stem. The same pair, on its own, is the icon — so the tab, the bookmark, the phone '
      + 'home screen and the Android launcher all get a real icon instead of a letter the browser '
      + 'guessed at.',
  },
  {
    date: '2026-09-14',
    title: 'An Obsidian vault, in one document',
    slug: 'obsidian-vault-to-markdown',
    detail: {
      en: {
        description:
          'Zip an Obsidian vault, drop it on TransformPipe, and get one Markdown document back — every note in order with a table of contents, converted in your browser.',
        keywords:
          'obsidian vault to markdown, export obsidian notes to one file, merge obsidian notes, obsidian to html, convert obsidian wikilinks',
        body: `A vault is a good place to write and an awkward thing to hand over. Two hundred files is not a document, and the person you are sending them to has no Obsidian and no interest in installing one.

### What it is for

A vault is a good place to write and an awkward place to hand something over. Sending somebody two hundred files is not sending them anything; this makes the readable object that a vault does not have — one document you can print, publish, attach, or read on a phone.

### Wikilinks

\`[[Some note]]\` keeps its words and drops its address. Once every note is one document there is nowhere for the link to point: the file it named is now a heading in the same page. Keeping a dead link that looks live is worse than keeping the phrase, so the phrase is what survives. An ordinary Markdown link to an outside address is untouched.

### What is skipped

Anything that is not a note: \`.obsidian/\` and its settings, attachments, templates that are not written as notes, and the plugins' own data. Nested folders keep their order, so a vault organised by folder reads in the order it was organised in.

### Nothing is uploaded

The archive is unpacked and converted in your browser. A vault is usually somebody's private notes, and the only safe way to convert private notes is not to send them anywhere — which is the same reason this site has no upload step for any of its ten conversions.

Related: [an Obsidian vault in detail](/blog/convert-obsidian-vault-to-markdown), and [Markdown out of Notion, Obsidian and Confluence](/blog/markdown-from-notion-obsidian-and-confluence).`,
      },
      de: {
        title: 'Ein Obsidian-Tresor, in einem Dokument',
        summary: `Eine zehnte Konvertierung: legen Sie einen gezippten Obsidian-Tresor ab und bekommen ein einziges Markdown-Dokument zurück — jede Notiz der Reihe nach, mit Inhaltsverzeichnis. \`[[Wikilinks]]\` behalten ihre Worte; in einem Dokument zusammengeführt gibt es nichts mehr, worauf sie zeigen könnten.`,
        description:
          'Obsidian-Tresor zippen, auf TransformPipe ablegen und ein einziges Markdown-Dokument bekommen: jede Notiz der Reihe nach, mit Inhaltsverzeichnis.',
        keywords:
          'obsidian tresor in markdown umwandeln, obsidian notizen in eine datei exportieren, obsidian notizen zusammenführen, obsidian in html umwandeln, obsidian wikilinks konvertieren',
        body: `Ein Tresor ist ein guter Ort zum Schreiben und ein unhandliches Ding zum Weitergeben. Zweihundert Dateien sind kein Dokument, und die Person, der Sie sie schicken, hat kein Obsidian und keine Lust, eines zu installieren.

### Wofür das gut ist

Ein Tresor ist ein guter Ort zum Schreiben und ein unhandlicher Ort zum Übergeben. Jemandem zweihundert Dateien zu schicken heißt, ihm nichts zu schicken; das hier macht das lesbare Objekt, das ein Tresor nicht hat — ein Dokument, das man drucken, veröffentlichen, anhängen oder auf dem Telefon lesen kann.

### Wikilinks

\`[[Some note]]\` behält seine Wörter und verliert seine Adresse. Sobald jede Notiz in einem Dokument steht, gibt es kein Ziel mehr: die Datei, die der Link benannt hat, ist jetzt eine Überschrift auf derselben Seite. Einen toten Link zu behalten, der lebendig aussieht, ist schlechter, als die Wörter zu behalten — also bleiben die Wörter. Ein gewöhnlicher Markdown-Link auf eine Adresse draußen bleibt unangetastet.

### Was übersprungen wird

Alles, was keine Notiz ist: \`.obsidian/\` samt seinen Einstellungen, Anhänge, Vorlagen, die nicht als Notizen geschrieben sind, und die Daten der Plugins. Verschachtelte Ordner behalten ihre Reihenfolge, ein nach Ordnern organisierter Tresor liest sich also in der Reihenfolge, in der er organisiert wurde.

### Nichts wird hochgeladen

Das Archiv wird in Ihrem Browser entpackt und konvertiert. Ein Tresor sind meist die privaten Notizen eines Menschen, und der einzige sichere Weg, private Notizen zu konvertieren, ist, sie nirgendwohin zu schicken — derselbe Grund, aus dem diese Seite für keine ihrer zehn Konvertierungen einen Upload hat.

Weiter: [ein Obsidian-Tresor im Detail](/blog/convert-obsidian-vault-to-markdown) und [Markdown aus Notion, Obsidian und Confluence](/blog/markdown-from-notion-obsidian-and-confluence).`,
      },
    },
    body:
      'A tenth conversion: drop a zipped Obsidian vault and get one Markdown document back — every '
      + 'note in order, with a table of contents. `[[Wikilinks]]` keep their words; merged into one '
      + 'document there is nowhere left for them to point, so the address does not carry over, the '
      + 'same rule this app already applies to a Notion or Confluence export.',
  },
  {
    date: '2026-09-14',
    title: 'Plain text and Excel, converted honestly',
    slug: 'plain-text-and-excel',
    detail: {
      en: {
        description:
          'Two conversions for the files nobody calls documents: a .txt escaped so it says what it says, and an .xlsx as one Markdown table per sheet.',
        keywords:
          'txt to markdown, convert plain text to markdown, escape markdown characters, excel to markdown table, xlsx to markdown converter',
        body: `"Add *stars* next to failing tests." Typed into a \`.txt\` note to a colleague, that sentence means what it says. Handed to a Markdown renderer it means something else — "stars" comes out in italics — and a line about a review convention has been quietly reformatted. Two conversions exist for the two files nobody thinks of as documents, a text file and a workbook, and both are plain about what they can carry.

### Plain text → Markdown

\`/text-to-markdown\` takes a \`.txt\` and escapes every character Markdown would otherwise notice: \`*\`, \`_\`, a backtick, square brackets, a tilde, a leading \`#\`, \`>\`, \`-\` or \`1.\`, and the backslash itself. It also translates plain text's own conventions into Markdown's, since Markdown turns a single line break into a space: a wrapped line stays a break, a blank line stays a new paragraph.

\`.txt\` used to be accepted on Markdown → HTML as though it already were Markdown, and is not any more. That conversion takes \`.md\`, \`.markdown\`, \`.mdown\` and \`.mkd\` — the files somebody actually wrote as Markdown.

### Excel → Markdown table

\`/excel-to-markdown\` reads an \`.xlsx\` and gives back one Markdown table per sheet that has rows in it, with a table of contents once there is more than one. The first row of each sheet becomes the header row. Dates arrive as plain ISO dates rather than Excel's serial numbers.

### What a spreadsheet loses

A Markdown table is text in a grid and nothing else, so everything else a workbook is goes: a formula arrives as the last value Excel saved for it, merged cells flatten, number and currency formats become the raw text, and colours, conditional formatting, charts, pivot tables, images and cell comments have no representation at all. Empty sheets are skipped, and a workbook with no rows anywhere is refused rather than converted into nothing. \`.xls\`, the format before 2007, is not read — save it as \`.xlsx\` first.

If the grid was the document, this works. If the formatting was carrying meaning, a Markdown table is the wrong destination, and finding that out here is better than finding it out after you have pasted the result somewhere.

### Both run in your browser

The escaping and the workbook reader are JavaScript in your own tab, so neither file is uploaded. The API converts an \`.xlsx\` posted as the body too, which is the one case with no browser to run them in.

Related: [Excel to a Markdown table in full](/blog/convert-excel-to-markdown-table), and [what escaping is actually for](/blog/markdown-escaping).`,
      },
      de: {
        title: 'Reintext und Excel, ehrlich konvertiert',
        summary: `Zwei weitere Konvertierungen. Reintext → Markdown maskiert Markdowns eigene Zeichen vor der Umwandlung, sodass eine \`.txt\` mit einem wörtlich gemeinten Sternchen oder Unterstrich weiterhin dasselbe sagt, statt versehentlich hervorgehoben zu werden — bei Markdown → HTML wurde eine \`.txt\` früher angenommen, als wäre sie schon Markdown, und wird es nicht mehr. Excel → Markdown-Tabelle macht aus einer \`.xlsx\`-Arbeitsmappe eine Tabelle pro Blatt, mit Inhaltsverzeichnis, sobald es mehr als eine ist.`,
        description:
          'Zwei Konvertierungen für die Dateien, die niemand Dokument nennt: eine maskierte .txt, die sagt, was dasteht, und eine .xlsx als Tabelle pro Blatt.',
        keywords:
          'txt in markdown umwandeln, reintext in markdown, markdown zeichen maskieren, excel in markdown tabelle, xlsx in markdown konverter',
        body: `„Ein *Sternchen* neben jeden fehlgeschlagenen Test." In einer \`.txt\` an eine Kollegin getippt sagt dieser Satz genau das. Einem Markdown-Renderer übergeben sagt er etwas anderes — „Sternchen" steht dann kursiv da —, und aus einer Zeile über eine Konvention ist unbemerkt eine umformatierte geworden. Für die zwei Dateien, die niemand für Dokumente hält, eine Textdatei und eine Arbeitsmappe, gibt es je eine Konvertierung, und beide sagen offen, was sie tragen können.

### Reintext → Markdown

\`/text-to-markdown\` nimmt eine \`.txt\` und maskiert jedes Zeichen, das Markdown sonst bemerken würde: \`*\`, \`_\`, ein Backtick, eckige Klammern, eine Tilde, ein führendes \`#\`, \`>\`, \`-\` oder \`1.\` und den Backslash selbst. Außerdem übersetzt es die Gewohnheiten von Reintext in die von Markdown, denn Markdown macht aus einem einzelnen Zeilenumbruch ein Leerzeichen: Ein Umbruch bleibt ein Umbruch, eine leere Zeile bleibt ein neuer Absatz.

Eine \`.txt\` wurde früher bei Markdown → HTML angenommen, als wäre sie schon Markdown; das ist vorbei. Diese Konvertierung nimmt \`.md\`, \`.markdown\`, \`.mdown\` und \`.mkd\` — die Dateien, die wirklich als Markdown geschrieben wurden.

### Excel → Markdown-Tabelle

\`/excel-to-markdown\` liest eine \`.xlsx\` und gibt pro Tabellenblatt mit Zeilen eine Markdown-Tabelle zurück, bei mehreren zusätzlich ein Inhaltsverzeichnis. Die erste Zeile jedes Blatts wird zur Kopfzeile. Datumswerte erscheinen als reine ISO-Daten statt als Excels eigene Seriennummern.

### Was eine Tabellenkalkulation verliert

Eine Markdown-Tabelle ist Text in einem Raster und sonst nichts, also fällt alles Übrige weg: Eine Formel kommt als der Wert an, den Excel zuletzt gespeichert hat, verbundene Zellen werden flach, Zahlen- und Währungsformate werden zum rohen Text, und Farben, bedingte Formatierung, Diagramme, Pivot-Tabellen, Bilder und Zellkommentare haben überhaupt keine Entsprechung. Leere Blätter werden übersprungen, und eine Arbeitsmappe ohne jede Zeile wird abgelehnt, statt zu nichts konvertiert zu werden. \`.xls\`, das Format vor 2007, wird nicht gelesen — speichern Sie es vorher als \`.xlsx\`.

War das Raster das Dokument, funktioniert das hier. Trug die Formatierung die Bedeutung, ist eine Markdown-Tabelle das falsche Ziel, und das hier zu erfahren ist besser, als es zu erfahren, nachdem Sie das Ergebnis irgendwo eingefügt haben.

### Beides läuft in Ihrem Browser

Die Maskierung und der Leser für die Arbeitsmappe sind JavaScript in Ihrem eigenen Tab; keine der beiden Dateien wird hochgeladen. Die API konvertiert außerdem eine \`.xlsx\`, die als Rumpf gesendet wird — der eine Fall, in dem kein Browser da ist, der das täte.

Weiter: [Excel in eine Markdown-Tabelle, ausführlich](/blog/convert-excel-to-markdown-table) und [wozu Maskierung da ist](/blog/markdown-escaping).`,
      },
    },
    body:
      'Two more conversions. Raw text → Markdown escapes Markdown\'s own characters before '
      + 'converting, so a `.txt` file with a literal asterisk or underscore in it comes out saying '
      + 'the same thing rather than gaining accidental emphasis — `.txt` used to be accepted on '
      + 'Markdown → HTML as though it already were Markdown, and no longer is. Excel → Markdown '
      + 'table turns an `.xlsx` workbook into one table per sheet, with a table of contents once '
      + 'there is more than one.',
  },
  {
    date: '2026-09-14',
    title: 'Notion and Confluence exports, in one document',
    slug: 'notion-and-confluence-exports',
    detail: {
      en: {
        description:
          'Drop a Notion or Confluence export .zip on TransformPipe and get one Markdown document back — every page in order, with a table of contents.',
        keywords:
          'notion export to markdown, confluence to markdown, convert notion zip to markdown, confluence space export html to markdown, merge notion pages into one document',
        body: `Both tools export a folder of files, one per page, with names nobody chose. Two conversions read that folder and give back a single Markdown document instead: every page in order, under its own heading, with a table of contents at the top.

### Notion

Export a page or a workspace with **Export as Markdown & CSV**, include subpages, and drop the \`.zip\` exactly as it downloaded. Notion appends a 32-character id to every file name; those come off. A database exported alongside a page arrives as a \`.csv\` and becomes a Markdown table in place, where the page referred to it.

### Confluence

Export a space with **Export → HTML** and drop that \`.zip\`. Confluence's HTML carries a great deal of furniture — breadcrumbs, the page tree, the footer with the export date, the attachment table — and none of it is content, so none of it survives. Macros that render to text keep their text; macros that render to a Confluence-only widget do not.

### Links between pages

A link from one exported page to another keeps its words and loses its address. Merged into one document there is nowhere left for it to point: the file it named does not exist any more, and a link to a missing file is worse than a phrase. The same rule applies to an Obsidian vault's \`[[Wikilinks]]\`, which are the same problem in a different syntax.

### It runs in your browser

The zip is read, unpacked and converted on your own machine. Nothing is uploaded, which matters more here than usual: a Confluence space export is a company's internal documentation, and the shortest safe path for it is the one that never leaves.

Related: [a Notion export in detail](/blog/convert-notion-export-to-markdown), and [one Confluence page](/blog/convert-confluence-page-to-markdown).`,
      },
      de: {
        title: 'Notion- und Confluence-Exporte, in einem Dokument',
        summary: `Zwei neue Konvertierungen: legen Sie die .zip aus Notions „Export as Markdown & CSV" oder aus dem „Export → HTML" eines Confluence-Bereichs ab, und Sie bekommen ein einziges Markdown-Dokument zurück — jede Seite der Reihe nach, mit Inhaltsverzeichnis, eine Notion-Datenbank als Tabelle darin.`,
        description:
          'Legen Sie die .zip aus einem Notion- oder Confluence-Export auf TransformPipe ab und bekommen Sie ein Markdown-Dokument: alle Seiten der Reihe nach.',
        keywords:
          'notion export in markdown umwandeln, confluence in markdown umwandeln, notion zip in markdown konvertieren, confluence space export html in markdown, notion seiten zu einem dokument zusammenführen',
        body: `Beide Werkzeuge exportieren einen Ordner voller Dateien, eine pro Seite, mit Namen, die niemand gewählt hat. Zwei Konvertierungen lesen diesen Ordner und geben stattdessen ein einziges Markdown-Dokument zurück: jede Seite der Reihe nach, unter ihrer eigenen Überschrift, mit einem Inhaltsverzeichnis oben.

### Notion

Exportieren Sie eine Seite oder einen Workspace mit **Export as Markdown & CSV**, schließen Sie die Unterseiten ein, und legen Sie die \`.zip\` genau so ab, wie sie heruntergeladen wurde. Notion hängt an jeden Dateinamen eine 32-stellige id; die fällt weg. Eine Datenbank, die neben einer Seite exportiert wurde, kommt als \`.csv\` an und wird an Ort und Stelle zu einer Markdown-Tabelle, dort, wo die Seite sich auf sie bezogen hat.

### Confluence

Exportieren Sie einen Space mit **Export → HTML** und legen Sie diese \`.zip\` ab. Das HTML von Confluence trägt eine Menge Mobiliar mit sich — Brotkrumen, den Seitenbaum, die Fußzeile mit dem Exportdatum, die Tabelle der Anhänge —, und nichts davon ist Inhalt, also überlebt nichts davon. Makros, die zu Text werden, behalten ihren Text; Makros, die zu einem Widget werden, das es nur in Confluence gibt, nicht.

### Links zwischen Seiten

Ein Link von einer exportierten Seite auf eine andere behält seine Wörter und verliert seine Adresse. In einem Dokument zusammengeführt gibt es kein Ziel mehr: die Datei, die er benannt hat, existiert nicht mehr, und ein Link auf eine fehlende Datei ist schlechter als eine Wortfolge. Dieselbe Regel gilt für die \`[[Wikilinks]]\` eines Obsidian-Tresors, die dasselbe Problem in einer anderen Syntax sind.

### Es läuft in Ihrem Browser

Die Zip-Datei wird auf Ihrem eigenen Rechner gelesen, entpackt und konvertiert. Nichts wird hochgeladen, was hier mehr zählt als sonst: Der Export eines Confluence-Space ist die interne Dokumentation eines Unternehmens, und der kürzeste sichere Weg für sie ist der, der nirgendwohin führt.

Weiter: [ein Notion-Export im Detail](/blog/convert-notion-export-to-markdown) und [eine einzelne Confluence-Seite](/blog/convert-confluence-page-to-markdown).`,
      },
    },
    body:
      'Two new conversions: drop the .zip from Notion\'s "Export as Markdown & CSV" or a '
      + 'Confluence space\'s "Export → HTML", and get one Markdown document back — every page in '
      + 'order, with a table of contents, a Notion database included as a table. A link from one '
      + 'page to another in the export keeps its words; merged into one document there is nowhere '
      + 'left for it to point, so the address does not carry over.',
  },
  {
    date: '2026-09-11',
    title: 'A PDF from the API, without a browser',
    slug: 'markdown-to-pdf-api',
    detail: {
      en: {
        description:
          'GET /api/v1/documents/:id.pdf turns a saved Markdown document into a PDF on the server — no headless Chrome, no build step, one authenticated request.',
        keywords:
          'markdown to pdf api, convert markdown to pdf without a browser, md to pdf command line, generate pdf in ci, markdown to pdf rest api',
        body: `\`GET /api/v1/documents/:id.pdf\`, with an API key, returns a laid-out PDF of a saved document. It is meant for the case that has no browser in it: a scheduled job, a CI step that attaches a report to a release, a script that mails a weekly summary.

### Why this exists separately from printing

Most Markdown-to-PDF tools are a headless Chrome in a trench coat. That gives an exact rendering and costs a browser: several hundred megabytes of dependency, a sandbox to keep it in, a start-up per request, and a memory ceiling that a long document reaches before a person does. None of that fits inside a serverless function, and a service that quietly starts a browser per request is a service that is slow and expensive for the one case that could have been neither.

This lays the document out directly — headings, paragraphs, lists, tables, code blocks and rules — with no browser anywhere in the path. It starts immediately and finishes in milliseconds.

### What it is not

It is not a pixel-for-pixel copy of the preview. The app's own **Print or save as PDF** still uses the browser's own rendering, which is exact, and that has not changed: if you want the page as you see it, print it. If you want a PDF from a machine, ask for one.

### Using it

    curl -H "Authorization: Bearer tp_live_…" \\
      https://transformpipe.com/api/v1/documents/<id>.pdf -o report.pdf

The same document is available as \`.docx\`, \`.html\` and \`.md\` by changing the extension, so one saved document is four formats without a second conversion.

Related: [the ways Markdown becomes a PDF](/blog/markdown-to-pdf), and [converting documents with an API](/blog/converting-documents-with-an-api).`,
      },
      de: {
        title: 'Ein PDF aus der API, ohne Browser',
        summary: `\`GET /api/v1/documents/:id.pdf\` setzt ein Dokument auf dem Server als PDF, für ein Skript oder einen CI-Lauf, der keinen Browser zum Drucken hat. Die App selbst nutzt dafür weiterhin „Drucken oder als PDF sichern" — das ist die exakte Darstellung des Browsers, und dies ersetzt sie nicht.`,
        description:
          'GET /api/v1/documents/:id.pdf macht aus einem gespeicherten Markdown-Dokument ein PDF auf dem Server — ohne Headless-Chrome, in einer einzigen Anfrage.',
        keywords:
          'markdown in pdf api, markdown ohne browser in pdf umwandeln, md in pdf kommandozeile, pdf in ci erzeugen, markdown in pdf rest api',
        body: `\`GET /api/v1/documents/:id.pdf\` liefert mit einem API-Schlüssel ein gesetztes PDF eines gespeicherten Dokuments. Gedacht ist es für den Fall, in dem kein Browser vorkommt: ein geplanter Job, ein CI-Schritt, der einem Release einen Bericht anhängt, ein Skript, das eine Wochenübersicht verschickt.

### Warum das getrennt vom Drucken existiert

Die meisten Werkzeuge von Markdown nach PDF sind ein Headless-Chrome im Trenchcoat. Das ergibt eine exakte Darstellung und kostet einen Browser: mehrere hundert Megabyte Abhängigkeit, eine Sandbox, in der er bleibt, ein Start pro Anfrage und eine Speichergrenze, die ein langes Dokument früher erreicht als ein Mensch. Nichts davon passt in eine Serverless-Funktion, und ein Dienst, der still pro Anfrage einen Browser startet, ist langsam und teuer für den einen Fall, der weder das eine noch das andere hätte sein müssen.

Hier wird das Dokument direkt gesetzt — Überschriften, Absätze, Listen, Tabellen, Codeblöcke und Linien —, ohne Browser irgendwo im Weg. Es startet sofort und ist in Millisekunden fertig.

### Was es nicht ist

Es ist keine pixelgenaue Kopie der Vorschau. **Drucken oder als PDF sichern** in der App benutzt weiterhin die Darstellung des Browsers selbst, die exakt ist, und daran ändert sich nichts: Wenn Sie die Seite so wollen, wie Sie sie sehen, drucken Sie sie. Wenn Sie ein PDF von einer Maschine wollen, fragen Sie danach.

### So benutzen Sie es

    curl -H "Authorization: Bearer tp_live_…" \\
      https://transformpipe.com/api/v1/documents/<id>.pdf -o report.pdf

Dasselbe Dokument gibt es als \`.docx\`, \`.html\` und \`.md\`, indem Sie die Endung ändern — ein gespeichertes Dokument sind also vier Formate ohne eine zweite Konvertierung.

Weiter: [die Wege von Markdown zum PDF](/blog/markdown-to-pdf) und [Dokumente über eine API konvertieren](/blog/converting-documents-with-an-api).`,
      },
    },
    body:
      '`GET /api/v1/documents/:id.pdf` lays a document out as a PDF on the server, for a script '
      + 'or a CI job that has no browser to print from. The app itself still uses "Print or save '
      + 'as PDF" for that — it is the browser\'s own, exact rendering, and this does not replace it.',
  },
  {
    date: '2026-09-11',
    title: 'Download a saved document as Word',
    slug: 'markdown-to-word',
    detail: {
      en: {
        description:
          'Convert Markdown to a real .docx on TransformPipe: headings, tables, lists and code survive, and Word opens it without a plugin or a headless browser.',
        keywords:
          'markdown to word, convert md to docx, markdown to docx converter, download markdown as word document, markdown table to word',
        body: `A saved document can be downloaded as a \`.docx\`, built from the same HTML the preview already shows. Word, Pages, LibreOffice and Google Docs all open it as an ordinary document — headings are Word headings, tables are Word tables, lists nest, and code keeps its monospace.

### What survives the trip

Headings one to six, paragraphs, bold and italic, ordered and unordered lists with their nesting, tables with their header row, block quotes, horizontal rules, links with their text and their address, and fenced code. What does not: anything that only exists in a browser — a live embed, a collapsible section, a mermaid diagram that was never rendered to an image.

Remote images are deliberately left out. A converter that fetches every picture a document mentions is a converter that makes a request to any address the document's author chose, and the trade — a picture, for a server that follows strangers' links — is not worth making.

### Why it needs a save first

The conversion runs on the account's copy of the document, which is what the download endpoint reads. Converting a file you have only just dropped is the browser's job and does not involve the account at all; \`.docx\` is the one direction that does.

### The other direction

Dropping a \`.docx\` on the converter reads it back into Markdown — headings, tables, lists and all — which is the round trip most people actually want: a Word document out of a colleague's mailbox, into Markdown, into a repository.

### From a script

\`GET /api/v1/documents/:id.docx\` with an API key returns the same file, for a build that publishes documentation as Word for people who want it that way.

Related: [Markdown to Word, in full](/blog/markdown-to-word), and [reading a \`.docx\` back into Markdown](/blog/convert-docx-to-markdown).`,
      },
      de: {
        title: 'Ein gespeichertes Dokument als Word herunterladen',
        summary: `Das Download-Menü eines gespeicherten Dokuments bietet jetzt eine \`.docx\` an, an Ort und Stelle aus demselben HTML gebaut, das die Vorschau bereits anzeigt. Kein Browser im Hintergrund — es braucht vorher ein Speichern, denn die Konvertierung läuft auf der Kopie im Konto.`,
        description:
          'Markdown auf TransformPipe in eine echte .docx umwandeln: Überschriften, Tabellen, Listen und Code bleiben, und Word öffnet die Datei ohne Plug-in.',
        keywords:
          'markdown in word umwandeln, md in docx konvertieren, markdown docx konverter, markdown als word dokument herunterladen, markdown tabelle in word',
        body: `Ein gespeichertes Dokument lässt sich als \`.docx\` herunterladen, gebaut aus demselben HTML, das die Vorschau ohnehin zeigt. Word, Pages, LibreOffice und Google Docs öffnen es als gewöhnliches Dokument — Überschriften sind Word-Überschriften, Tabellen sind Word-Tabellen, Listen verschachteln sich, und Code behält seine Festbreitenschrift.

### Was die Reise übersteht

Überschriften eins bis sechs, Absätze, Fett und Kursiv, geordnete und ungeordnete Listen samt ihrer Verschachtelung, Tabellen mit ihrer Kopfzeile, Blockzitate, Trennlinien, Links mit ihrem Text und ihrer Adresse und eingezäunter Code. Was nicht: alles, was es nur in einem Browser gibt — eine lebende Einbettung, ein aufklappbarer Abschnitt, ein Mermaid-Diagramm, das nie zu einem Bild gerendert wurde.

Bilder von fremden Adressen bleiben absichtlich draußen. Ein Konverter, der jedes Bild holt, das ein Dokument erwähnt, ist ein Konverter, der eine Anfrage an jede Adresse stellt, die der Autor des Dokuments gewählt hat — und der Handel, ein Bild gegen einen Server, der Fremden hinterherläuft, lohnt sich nicht.

### Warum vorher gespeichert werden muss

Die Konvertierung läuft auf der Kopie des Dokuments im Konto, und die liest der Endpunkt für den Download. Eine Datei zu konvertieren, die Sie gerade erst abgelegt haben, ist Sache des Browsers und hat mit dem Konto überhaupt nichts zu tun; \`.docx\` ist die eine Richtung, die es doch hat.

### Die andere Richtung

Legen Sie eine \`.docx\` auf den Konverter, wird sie zurück nach Markdown gelesen — Überschriften, Tabellen, Listen und alles —, und das ist der Weg, den die meisten tatsächlich wollen: ein Word-Dokument aus dem Postfach einer Kollegin, nach Markdown, in ein Repository.

### Aus einem Skript

\`GET /api/v1/documents/:id.docx\` liefert mit einem API-Schlüssel dieselbe Datei — für einen Build, der Dokumentation als Word veröffentlicht, für Leute, die sie so haben wollen.

Weiter: [Markdown nach Word, ausführlich](/blog/markdown-to-word) und [eine \`.docx\` zurück nach Markdown lesen](/blog/convert-docx-to-markdown).`,
      },
    },
    body:
      'The download menu on a saved document now offers a `.docx`, built on the spot from the '
      + 'same HTML the preview already renders. No headless browser involved — it needs a save '
      + 'first, since the conversion runs on the account\'s copy.',
  },
  {
    date: '2026-09-11',
    title: 'Webhooks: a signed notice when a document is created or shared',
    slug: 'webhooks',
    detail: {
      en: {
        description:
          'Register a URL and TransformPipe posts a signed notice when a document is created or shared: HMAC-SHA256, in the header shape Stripe uses.',
        keywords:
          'document webhook, verify hmac sha256 webhook signature, webhook signature verification in node, x-transformpipe-signature header, webhook when a document is created',
        body: `Two things happen on an account that another program might want to know about the moment they happen: a document was created, and a document was shared. **Account menu → Webhooks** is where you name an \`https://\` URL that should hear about them, and read the secret its deliveries are signed with.

### What arrives

A \`POST\` whose JSON body has three keys — the event, the time, and the data:

\`\`\`json
{
  "event": "document.created",
  "created_at": "2026-09-11T09:12:44.000Z",
  "data": { "id": "…", "name": "release-notes.md", "kind": "markdown-to-html", "size": 4193 }
}
\`\`\`

\`document.shared\` carries the \`id\` and \`name\`, the \`mode\` the document is now in, the share \`url\`, and \`notified\`, the addresses a share notice actually went to. Neither event carries the document's text: a receiver that needs it has the id and an API key.

### Checking the signature

Each delivery has an \`x-transformpipe-signature\` header shaped \`t=<unix seconds>,v1=<hex>\`, where \`v1\` is HMAC-SHA256 over the string \`<t>.<body>\`, keyed with this webhook's secret — the shape Stripe and GitHub both use, so verification code you already have usually needs only a different secret.

\`\`\`js
import { createHmac, timingSafeEqual } from 'node:crypto';

// \`raw\` is the body as it arrived. A parsed and re-encoded copy will not hash the same.
export function verify(raw, header, secret) {
  const [t, v1] = header.split(',').map((part) => part.split('=')[1]);
  const want = createHmac('sha256', secret).update(\`\${t}.\${raw}\`).digest('hex');

  return (
    v1.length === want.length &&
    timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(want, 'hex'))
  );
}
\`\`\`

Reject a \`t\` more than a few minutes old and a captured delivery cannot be replayed at you later. The secret begins \`whsec_\` and can be read again from the dialog whenever you need it — unlike an API key, it is presented by us to you, so seeing it twice while setting a receiver up is legitimate rather than a leak.

### One attempt, no queue

A delivery is one request with a five-second timeout. There is no retry and no queue: a receiver that is down misses that event, and the next event tries again on its own. The dialog shows the last status, or the last error, for every URL. Redirects are not followed, and the address is checked as a public one again at the moment of posting rather than only when it was registered.

### Why an API key cannot register one

Webhooks are managed from a signed-in session only. A key that could register a webhook would turn a point-in-time leak into a standing feed of every document that came after it, which is a much worse thing to lose than a key.

Related: [converting documents with an API](/blog/converting-documents-with-an-api), and [publishing from GitHub Actions](/blog/publish-markdown-from-github-actions).`,
      },
      de: {
        title: 'Webhooks: eine signierte Nachricht, wenn ein Dokument erstellt oder geteilt wird',
        summary: `Im Konto-Menü → Webhooks hinterlegen Sie eine URL, die für zwei Ereignisse einen signierten POST erhält, \`document.created\` und \`document.shared\`. Verwaltet wird das absichtlich nur aus einer Sitzung — es bleibt außerhalb der skriptbaren API, damit ein geleakter API-Schlüssel nicht zu einem dauerhaften Strom aller folgenden Dokumente werden kann.`,
        description:
          'Hinterlegen Sie eine URL, und TransformPipe schickt einen signierten POST, sobald ein Dokument erstellt oder geteilt wird: HMAC-SHA256 im Header.',
        keywords:
          'webhook für dokumente, hmac sha256 webhook signatur prüfen, webhook signatur verifizieren node, x-transformpipe-signature header, webhook bei neuem dokument',
        body: `Zwei Dinge geschehen in einem Konto, von denen ein anderes Programm sofort erfahren möchte: Ein Dokument wurde erstellt, und ein Dokument wurde geteilt. Im **Konto-Menü → Webhooks** hinterlegen Sie eine \`https://\`-URL, die davon hören soll, und lesen das Geheimnis, mit dem signiert wird.

### Was ankommt

Ein \`POST\`, dessen JSON-Rumpf drei Schlüssel hat — das Ereignis, den Zeitpunkt und die Daten:

\`\`\`json
{
  "event": "document.created",
  "created_at": "2026-09-11T09:12:44.000Z",
  "data": { "id": "…", "name": "release-notes.md", "kind": "markdown-to-html", "size": 4193 }
}
\`\`\`

\`document.shared\` trägt \`id\` und \`name\`, den \`mode\`, in dem das Dokument jetzt ist, die \`url\` zum Teilen und \`notified\` — die Adressen, an die wirklich eine Nachricht ging. Den Text des Dokuments trägt keines der Ereignisse: Ein Empfänger, der ihn braucht, hat die id und einen API-Schlüssel.

### Die Signatur prüfen

Jede Zustellung hat einen Header \`x-transformpipe-signature\` in der Form \`t=<Unix-Sekunden>,v1=<hex>\`. \`v1\` ist HMAC-SHA256 über die Zeichenkette \`<t>.<Rumpf>\`, mit dem Geheimnis dieses Webhooks als Schlüssel — dieselbe Form, die Stripe und GitHub verwenden, sodass vorhandener Prüfcode meist nur ein anderes Geheimnis braucht.

\`\`\`js
import { createHmac, timingSafeEqual } from 'node:crypto';

// \`raw\` ist der Rumpf, wie er ankam. Neu kodiert ergibt er einen anderen Hash.
export function verify(raw, header, secret) {
  const [t, v1] = header.split(',').map((part) => part.split('=')[1]);
  const want = createHmac('sha256', secret).update(\`\${t}.\${raw}\`).digest('hex');

  return (
    v1.length === want.length &&
    timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(want, 'hex'))
  );
}
\`\`\`

Weisen Sie ein \`t\` zurück, das älter als ein paar Minuten ist, und eine mitgeschnittene Zustellung lässt sich später nicht wiederholen. Das Geheimnis beginnt mit \`whsec_\` und lässt sich im Dialog wieder anzeigen: Anders als ein API-Schlüssel wird es von uns Ihnen gegenüber vorgezeigt, es beim Einrichten zweimal zu lesen ist also legitim.

### Ein Versuch, keine Warteschlange

Eine Zustellung ist eine Anfrage mit fünf Sekunden Zeitlimit. Es gibt keinen zweiten Versuch und keine Warteschlange: Ein Empfänger, der gerade nicht läuft, verpasst dieses Ereignis, das nächste versucht es von sich aus wieder. Der Dialog nennt pro URL den letzten Status oder den letzten Fehler. Weiterleitungen werden nicht verfolgt, und die Adresse wird beim Senden erneut geprüft, nicht nur beim Anlegen.

### Warum ein API-Schlüssel keinen anlegen kann

Webhooks werden ausschließlich aus einer angemeldeten Sitzung verwaltet. Ein Schlüssel, der einen Webhook anlegen könnte, würde aus einem punktuellen Leck einen dauerhaften Strom aller künftigen Dokumente machen — ein schlimmerer Verlust als der eines Schlüssels.

Weiter: [Dokumente über eine API konvertieren](/blog/converting-documents-with-an-api) und [aus GitHub Actions veröffentlichen](/blog/publish-markdown-from-github-actions).`,
      },
    },
    body:
      'Account menu → Webhooks registers a URL that gets a signed POST for two events, '
      + '`document.created` and `document.shared`. Session-only to manage, on purpose — it stays '
      + 'off the scriptable API, so a leaked API key cannot turn into a standing feed of every '
      + 'document that comes after it.',
  },
  {
    date: '2026-09-11',
    title: 'Link a document to an earlier one, and see what changed',
    slug: 'document-versions',
    detail: {
      en: {
        description:
          'Push with ?replaces= and two documents become versions of one thing: a chain in the history, a line-level diff, and one endpoint that reads it.',
        keywords:
          'markdown document versions, diff two markdown documents, version history for converted documents, replaces parameter api, compare two versions of a document',
        body: `Every push here makes a brand-new document, and that is not an accident to be fixed: a link somebody pasted into a comment three weeks ago has to keep showing what that commit said. But a release note pushed every Friday really is the same document seven times, and nothing could say so. Now something can.

### Saying it

One parameter, on the push that creates the newer document:

    curl -H "Authorization: Bearer tp_live_…" --data-binary @v2.md \\
      "https://transformpipe.com/api/v1/documents?name=notes.md&replaces=<id>"

The CLI spells it \`--replaces <id>\`, and the GitHub Action takes a \`replaces\` input. The id of the earlier document is what \`tp list\` prints, and what the Action's \`documents\` output carries. It has to be a document on the same account, or the request comes back 404 rather than linking to something you cannot see.

### What you get

In the history, a linked document carries a chain icon. Opening it lists the whole chain oldest first, and any entry with something before it can be compared against it: a line-level diff, computed in your browser from the two sources it already fetched, so nothing on the server is doing the comparing.

From a program, \`GET /api/v1/documents/:id/versions\` — or \`tp versions <id>\` — answers with the chain from any member of it — the ancestors it replaces, and everything that went on to replace those — each with its \`id\`, \`name\`, \`created_at\` and its own \`replaces\`. The assistant connector exposes the same thing as \`tp_document_versions\`. Every document in a list also carries \`replaces\`, so a client with the list in hand can work out the chains without a request per row.

### Why nothing is inferred

A converter that guessed would be wrong in the way that costs you something. Two files with the same name are often not versions of each other — a \`README.md\` from two different repositories, the same report for two different months — and a tool that chained them would quietly present one as the successor of the other. So the name means nothing here, the conversion means nothing, and the time means nothing: a document is a version of another one because somebody said so, one document at a time.

### What it is not

It is not automatic history. Nothing in this app edits a document in place, so no version appears without a push, and there is no revert: an older version is still its own document, at its own address, with its own share link. Deleting an older one does not delete the newer — the link simply goes away, and what is left is the unrelated document it would have been anyway.

Related: [release notes out of Markdown](/blog/release-notes-from-markdown), and [publishing from GitHub Actions](/blog/publish-markdown-from-github-actions).`,
      },
      de: {
        title: 'Ein Dokument mit einem früheren verknüpfen und sehen, was sich geändert hat',
        summary: `Ein Push kann jetzt sagen, dass er eine neue Version eines früheren Dokuments ist — \`?replaces=\` in der API, \`--replaces\` im CLI, eine Eingabe \`replaces\` in der Action. Das ist freiwillig: Nichts verknüpft Dokumente von selbst, und ein gewöhnlicher Push bleibt das unverbundene Dokument, das er immer war. Verknüpfte Dokumente bekommen ein Kettensymbol im Verlauf und einen zeilenweisen Vergleich mit der Version davor.`,
        description:
          'Mit ?replaces= werden zwei Dokumente zu Versionen derselben Sache: eine Kette im Verlauf, ein zeilenweiser Vergleich, ein Endpunkt dafür.',
        keywords:
          'markdown dokument versionen, zwei markdown dokumente vergleichen, versionsverlauf für konvertierte dokumente, replaces parameter api, zwei versionen eines dokuments vergleichen',
        body: `Jeder Push erzeugt hier ein ganz neues Dokument, und das ist kein Versehen, das behoben werden müsste: Ein Link, den jemand vor drei Wochen in einen Kommentar geschrieben hat, muss weiter zeigen, was dieser Commit sagte. Eine Release-Notiz, die jeden Freitag gepusht wird, ist aber wirklich siebenmal dasselbe Dokument — und nichts konnte das sagen. Jetzt kann es etwas.

### Wie man es sagt

Ein Parameter, am Push, der das neuere Dokument anlegt:

    curl -H "Authorization: Bearer tp_live_…" --data-binary @v2.md \\
      "https://transformpipe.com/api/v1/documents?name=notes.md&replaces=<id>"

Das CLI schreibt es \`--replaces <id>\`, und die GitHub Action nimmt eine Eingabe \`replaces\`. Die id des früheren Dokuments gibt \`tp list\` aus, und die Ausgabe \`documents\` der Action trägt sie ebenfalls. Sie muss zu einem Dokument desselben Kontos gehören, sonst antwortet die Anfrage mit 404, statt auf etwas zu verweisen, das Sie nicht sehen können.

### Was dabei herauskommt

Im Verlauf trägt ein verknüpftes Dokument ein Kettensymbol. Wer es öffnet, sieht die ganze Kette, das Älteste zuerst, und jeder Eintrag mit einem Vorgänger lässt sich mit ihm vergleichen: ein zeilenweiser Vergleich, in Ihrem Browser aus den beiden Quellen berechnet, die er ohnehin geholt hat — auf dem Server vergleicht also nichts.

Aus einem Programm antwortet \`GET /api/v1/documents/:id/versions\` — oder \`tp versions <id>\` — mit der Kette, ausgehend von jedem ihrer Mitglieder: den Vorgängern, die es ersetzt, und allem, was diese wiederum ersetzt hat, jeweils mit \`id\`, \`name\`, \`created_at\` und eigenem \`replaces\`. Der Connector für Assistenten bietet dasselbe als \`tp_document_versions\`. Auch in einer Liste trägt jedes Dokument sein \`replaces\`, sodass ein Client mit der Liste in der Hand die Ketten ohne eine Anfrage pro Zeile bilden kann.

### Warum nichts erraten wird

Ein Konverter, der riete, läge auf die Weise falsch, die Sie etwas kostet. Zwei Dateien mit demselben Namen sind oft keine Versionen voneinander — eine \`README.md\` aus zwei Repositories, derselbe Bericht für zwei Monate —, und ein Werkzeug, das sie verkettet, würde still das eine als Nachfolger des anderen ausgeben. Also bedeutet der Name hier nichts, die Konvertierung nichts und der Zeitpunkt nichts: Ein Dokument ist die Version eines anderen, weil jemand es gesagt hat, ein Dokument auf einmal.

### Was es nicht ist

Es ist kein automatischer Verlauf. Nichts in dieser App ändert ein Dokument an Ort und Stelle, also entsteht ohne Push keine Version, und es gibt kein Zurücksetzen: Eine ältere Version bleibt ihr eigenes Dokument, an ihrer eigenen Adresse, mit ihrem eigenen Link. Ein älteres zu löschen löscht das neuere nicht — die Verknüpfung fällt einfach weg, und übrig bleibt das unverbundene Dokument, das es sonst gewesen wäre.

Weiter: [Release Notes aus Markdown](/blog/release-notes-from-markdown) und [aus GitHub Actions veröffentlichen](/blog/publish-markdown-from-github-actions).`,
      },
    },
    body:
      'A push can now say it is a new version of an earlier document — `?replaces=` in the API, '
      + '`--replaces` from the CLI, a `replaces` input in the Action. It is opt-in: nothing links '
      + 'documents on its own, and a plain push stays the unrelated document it has always been. '
      + 'Linked documents get a chain icon in the history and a line-by-line diff against the '
      + 'version before them.',
  },
  {
    date: '2026-09-11',
    title: 'History search now looks inside your documents',
    slug: 'full-text-search',
    detail: {
      en: {
        description:
          'The search box over your history now matches what is written inside a saved document, not only its file name, and ranks the matches by relevance.',
        keywords:
          'search inside documents, full text search markdown documents, find a document by its content, search converted files, postgres full text search documents',
        body: `Nobody remembers what they called a file. They remember a sentence that was in it, the name of the customer it was about, or the one command the runbook contained. The box at the top of your history used to be unable to help with any of that, because it only ever compared what you typed against file names.

### Two searches, one box

Type into it and two things now happen at once. The name filter runs where it always did — in the browser, over every row on the page, instantly, on saved and unsaved conversions alike. And a moment later, if you are signed in, the server answers with the saved documents whose text matches, ranked by how well it matches, and those rows join the ones the name already found.

You do not choose between them. A query that is half a file name and half a remembered phrase finds both kinds of row, and a query that matches nothing by content simply leaves the name filter as it was. The request is debounced, so typing is not a request per keystroke, and a search that fails leaves the list working rather than replacing it with an error.

### Where the index comes from

Each saved document carries a \`tsvector\` of its Markdown, written at the moment the document is saved and indexed in Postgres. Matching is \`websearch_to_tsquery\`, so the syntax is the one every search box has taught people: \`"a quoted phrase"\` for words in order, \`or\` between alternatives, a leading \`-\` to exclude.

It is a deliberately plain configuration — no stemming and no stop-word list. Words match as they were typed, which means \`convert\` does not find \`converting\`, and also means nothing you search for is silently reinterpreted. Searching the Markdown source rather than the rendered page has a side effect worth knowing: a link's address, a fenced code block and a heading are all searchable text.

### What it does not reach

A conversion that is only in this browser has no row in the database, so nothing is indexed for it and it still matches by name alone — which is the honest consequence of conversions staying local until you save them. Documents somebody shared with you are not covered either; the chip that lists them filters by name.

From a script the same thing is one parameter: \`GET /api/v1/documents?q=…\`, or \`tp list --q "…"\`, returning the matches best first, the newer of two equal ones ahead of the older.

Related: [batch-converting Markdown files](/blog/batch-convert-markdown-files), and [documentation that lives in the repository](/blog/documentation-that-lives-in-the-repo).`,
      },
      de: {
        title: 'Die Suche im Verlauf schaut jetzt in Ihre Dokumente',
        summary: `Die Suche im Verlauf traf früher nur Dateinamen. Angemeldet findet sie ein Dokument jetzt auch an dem, was darin geschrieben steht — das Namensfeld arbeitet genau wie vorher, es ist nur nicht mehr der einzige Weg hinein.`,
        description:
          'Das Suchfeld über Ihrem Verlauf findet gespeicherte Dokumente jetzt auch an ihrem Inhalt, nicht nur am Dateinamen, und sortiert nach Relevanz.',
        keywords:
          'in dokumenten suchen, volltextsuche markdown dokumente, dokument am inhalt finden, konvertierte dateien durchsuchen, volltextsuche postgres dokumente',
        body: `Niemand erinnert sich daran, wie er eine Datei genannt hat. Man erinnert sich an einen Satz, der darin stand, an den Namen der Kundin, um die es ging, oder an den einen Befehl, den das Runbook enthielt. Das Feld über Ihrem Verlauf konnte dabei bisher nicht helfen, denn es verglich das Getippte immer nur mit Dateinamen.

### Zwei Suchen, ein Feld

Wer hineintippt, löst jetzt beides gleichzeitig aus. Der Namensfilter läuft dort, wo er immer lief — im Browser, über jede Zeile der Seite, sofort, für gespeicherte und ungespeicherte Konvertierungen gleichermaßen. Und einen Augenblick später antwortet der Server, sofern Sie angemeldet sind, mit den gespeicherten Dokumenten, deren Text passt, nach Güte des Treffers sortiert; diese Zeilen kommen zu denen hinzu, die der Name schon gefunden hat.

Sie müssen sich nicht entscheiden. Eine Anfrage, die halb Dateiname und halb erinnerte Wortfolge ist, findet beides, und eine, die inhaltlich nichts trifft, lässt den Namensfilter, wie er war. Die Anfrage ist entprellt, ein Tastendruck ist also keine Anfrage, und eine fehlgeschlagene Suche lässt die Liste arbeiten, statt sie durch einen Fehler zu ersetzen.

### Woher der Index kommt

Jedes gespeicherte Dokument trägt einen \`tsvector\` seines Markdown, geschrieben im Moment des Speicherns und in Postgres indexiert. Verglichen wird mit \`websearch_to_tsquery\`, die Syntax ist also die, die jedes Suchfeld den Leuten beigebracht hat: \`"eine Wortfolge in Anführungszeichen"\` für Wörter in dieser Reihenfolge, \`or\` zwischen Alternativen, ein vorangestelltes \`-\` zum Ausschließen.

Die Konfiguration ist absichtlich schlicht — keine Wortstammbildung, keine Liste von Füllwörtern. Wörter treffen so, wie sie getippt wurden: \`konvert\` findet also kein \`konvertieren\`, und umgekehrt wird nichts, was Sie suchen, still umgedeutet. Dass die Markdown-Quelle durchsucht wird und nicht die gesetzte Seite, hat eine Nebenwirkung, die man kennen sollte: Die Adresse eines Links, ein Codeblock und eine Überschrift sind ebenfalls durchsuchbarer Text.

### Was sie nicht erreicht

Eine Konvertierung, die nur in diesem Browser liegt, hat keine Zeile in der Datenbank, also ist für sie nichts indexiert, und sie trifft weiter allein über den Namen — die ehrliche Folge davon, dass Konvertierungen lokal bleiben, bis Sie speichern. Dokumente, die jemand mit Ihnen geteilt hat, sind ebenfalls nicht erfasst; der Chip, der sie auflistet, filtert nach Namen.

Aus einem Skript ist dasselbe ein Parameter: \`GET /api/v1/documents?q=…\` oder \`tp list --q "…"\`, und zurück kommen die Treffer, die besten zuerst, bei gleicher Güte der neuere vor dem älteren.

Weiter: [viele Markdown-Dateien auf einmal konvertieren](/blog/batch-convert-markdown-files) und [Dokumentation, die im Repository lebt](/blog/documentation-that-lives-in-the-repo).`,
      },
    },
    body:
      'Searching your history used to match file names only. Signed in, it now also finds a '
      + 'document by what is written inside it — the name box still works exactly as before, it '
      + 'just stops being the only way in.',
  },
  {
    date: '2026-09-11',
    title: 'A Summary tab, generated once and kept',
    slug: 'ai-summary',
    detail: {
      en: {
        description:
          'A saved document gets a Summary tab: three to five sentences from Gemini Flash, written on the first open, then stored and free to read again.',
        keywords:
          'ai document summary, summarise a markdown document, free ai summarizer for documents, gemini document summary, summarise a docx',
        body: `A history with forty documents in it is forty names, and a name tells you almost nothing about a report somebody else converted three weeks ago. The question in front of that list is always the same — what is this, and is it the one I want — and opening each candidate to find out is the slow way to answer it.

### What the tab holds

A saved document has a third tab beside **Preview** and **Markdown**, called **AI Summary**: three to five sentences of plain prose saying what the document says. No headings, no bullet points, no restating the title — the point is something you can read in ten seconds and then decide.

It needs a saved document, and says so rather than leaving the tab mysteriously empty: the text is stored on the document, so there has to be a document to store it on.

### Generated once

The first open asks the model. What comes back is written onto the document along with the time it was made, and every open after that reads that copy — no second call, no waiting, and nothing counted against anything. **Regenerate** is there for a document that has moved on since, and is the only thing that asks again.

The model is Gemini Flash, called directly rather than through a gateway, with its reasoning turned off: three sentences is a small task, and there is no sense paying a bigger model's latency for it. The first 60,000 characters of the source are what it reads, which is a token budget rather than a judgement about long documents — a summary only needs to have read the thing once.

### The limit

Twenty summaries a day per account. Past that the request comes back saying so and asking you to try again tomorrow; reading summaries you already have is unaffected, because those never reach the model. The count is per account per day and lives in its own tally, so a burst of ordinary API requests cannot eat into it.

### From a program

\`POST /api/v1/documents/:id/summary\` returns the same text with the same cache behind it — \`?force\` to regenerate — and \`tp summary <id>\` is the same thing from the CLI. An assistant with the connector attached calls \`tp_summarize_document\`, which is how a chat can triage a folder of documents without pasting any of them into the conversation.

It is a summary, not an extract: a document whose value is in its exact numbers or its table is a document to open. This is for deciding whether to.

Related: [free AI document summarisers, compared](/blog/free-ai-document-summarizer), and [turning an assistant's output into a page](/blog/ai-output-to-a-shareable-page).`,
      },
      de: {
        title: 'Ein Tab mit der KI-Zusammenfassung, einmal erzeugt und behalten',
        summary: `Ein gespeichertes Dokument hat jetzt einen dritten Tab neben Vorschau und Markdown: drei bis fünf Sätze darüber, was darin steht, damit Sie erkennen können, was etwas ist, ohne es zu öffnen. Das erste Öffnen erzeugt sie; danach ist erneutes Lesen kostenlos. Neu erstellen ist ein Klick, für ein Dokument, das sich seither weiterbewegt hat.`,
        description:
          'Ein gespeichertes Dokument bekommt einen Tab mit einer Zusammenfassung: drei bis fünf Sätze von Gemini Flash, einmal erzeugt und dann behalten.',
        keywords:
          'ki zusammenfassung dokument, markdown dokument zusammenfassen, dokumente automatisch zusammenfassen, gemini zusammenfassung, docx zusammenfassen',
        body: `Ein Verlauf mit vierzig Dokumenten ist zunächst vierzig Namen, und ein Name sagt fast nichts über einen Bericht, den jemand anderes vor drei Wochen konvertiert hat. Vor dieser Liste steht immer dieselbe Frage — was ist das, und ist es das gesuchte —, und jeden Kandidaten zu öffnen ist die langsame Art, sie zu beantworten.

### Was in dem Tab steht

Ein gespeichertes Dokument hat neben **Vorschau** und **Markdown** einen dritten Tab, **KI-Zusammenfassung**: drei bis fünf Sätze schlichte Prosa darüber, was das Dokument sagt. Keine Überschriften, keine Stichpunkte, keine Wiederholung des Titels — gedacht ist es als etwas, das man in zehn Sekunden liest und danach entscheidet.

Es braucht ein gespeichertes Dokument und sagt das auch, statt den Tab rätselhaft leer zu lassen: Der Text wird am Dokument abgelegt, es muss also ein Dokument geben, an dem das geschehen kann.

### Einmal erzeugt

Das erste Öffnen fragt das Modell. Was zurückkommt, wird mit dem Zeitpunkt seiner Entstehung an das Dokument geschrieben, und jedes weitere Öffnen liest diese Kopie — kein zweiter Aufruf, kein Warten, keine Anrechnung. **Neu erstellen** ist für ein Dokument gedacht, das sich seither weiterbewegt hat, und ist das Einzige, was erneut fragt.

Das Modell ist Gemini Flash, direkt aufgerufen und nicht über ein Gateway, mit abgeschaltetem Nachdenken: Drei Sätze sind eine kleine Aufgabe, und es hat keinen Sinn, dafür die Wartezeit eines größeren Modells zu bezahlen. Gelesen werden die ersten 60.000 Zeichen der Quelle — ein Budget an Token, kein Urteil über lange Dokumente: Eine Zusammenfassung muss die Sache genau einmal gelesen haben.

### Die Grenze

Zwanzig Zusammenfassungen pro Konto und Tag. Darüber hinaus kommt die Anfrage mit genau dieser Auskunft zurück und der Bitte, es morgen erneut zu versuchen; vorhandene Zusammenfassungen zu lesen bleibt davon unberührt, denn die erreichen das Modell nie. Gezählt wird pro Konto und Tag in einer eigenen Rechnung, sodass ein Schwall gewöhnlicher API-Anfragen dieses Budget nicht aufbrauchen kann.

### Aus einem Programm

\`POST /api/v1/documents/:id/summary\` liefert denselben Text mit demselben Zwischenspeicher dahinter — \`?force\` erzeugt ihn neu —, und \`tp summary <id>\` ist dasselbe aus dem CLI. Ein Assistent mit angeschlossenem Connector ruft \`tp_summarize_document\` auf, und so kann ein Chat einen Ordner voller Dokumente sortieren, ohne eines davon in das Gespräch einzufügen.

Es ist eine Zusammenfassung, kein Auszug: Ein Dokument, dessen Wert in seinen exakten Zahlen oder seiner Tabelle liegt, ist ein Dokument zum Öffnen. Dies hier ist dafür da, das zu entscheiden.

Weiter: [kostenlose KI-Zusammenfasser im Vergleich](/blog/free-ai-document-summarizer) und [die Ausgabe eines Assistenten als Seite](/blog/ai-output-to-a-shareable-page).`,
      },
    },
    body:
      'A saved document now has a third tab beside Preview and Markdown: three to five sentences '
      + 'that say what it says, so you can tell what something is without opening it. The first '
      + 'open generates it; after that, reading it again is free. Regenerate is one click, for a '
      + 'document that has moved on since.',
  },
  {
    date: '2026-09-11',
    title: 'Nothing reaches your account until you save it',
    slug: 'conversions-stay-in-your-browser',
    detail: {
      en: {
        description:
          'Converting a file on TransformPipe no longer touches your account: the conversion stays in your browser until you press Save, and signing in uploads nothing.',
        keywords:
          'convert documents without uploading, private markdown converter, does an online converter upload my file, browser based document conversion, secure file converter',
        body: `The question behind this one is the one every online converter gets asked and most answer badly: does my file leave the machine. Here the answer is no unless you press **Save**, and it is worth saying exactly why that is possible.

Now a conversion stays in the browser that made it. **Save** is what puts it in the account, and nothing else does.

### What that means in practice

- Drop a file, read it, download the result, close the tab: nothing left our machine and nothing is on the account.
- Signing in uploads nothing. The history shows what is local and what is saved, and says which is which.
- Sharing needs a saved document, because a link has to point at something that exists — and it says so, instead of the Share button being mysteriously unavailable.
- Deleting a saved document deletes it. The local copy is the browser's, and clearing site data removes it.

### Why the conversion never needed a server

Every one of the ten conversions runs in JavaScript in your browser: Markdown, HTML, \`.docx\`, \`.csv\`, \`.xlsx\`, JSON, plain text, and the zip readers for a Notion, Confluence or Obsidian export. There was never a technical reason to send the file anywhere — the upload existed because the account existed, which is the wrong way round.

An account is for the documents you decide to keep, not a record of everything you looked at. If you never sign in, this site never receives a file at all.

Related: [whether an online converter is safe](/blog/is-an-online-converter-safe), and [sharing a document as a link](/blog/share-a-markdown-document-as-a-link).`,
      },
      de: {
        title: 'Nichts erreicht Ihr Konto, bevor Sie es speichern',
        summary: `Eine Datei zu konvertieren legte sie früher in Ihrem Konto ab. Ablegen, ansehen, Tab schließen — und sie war da, zusammen mit allem anderen, worauf Sie je einen Blick geworfen hatten. Jetzt bleibt eine Konvertierung in diesem Browser, und **Speichern** ist das, was sie ins Konto legt.`,
        description:
          'Eine Konvertierung auf TransformPipe berührt Ihr Konto nicht mehr: Sie bleibt in Ihrem Browser, bis Sie speichern, und das Anmelden lädt nichts hoch.',
        keywords:
          'dokumente ohne upload konvertieren, privater markdown konverter, lädt ein online konverter meine datei hoch, konvertierung im browser, sichere dateikonvertierung',
        body: `Hinter dieser Änderung steht die Frage, die jedem Online-Konverter gestellt und von den meisten schlecht beantwortet wird: verlässt meine Datei den Rechner. Hier lautet die Antwort nein, solange Sie nicht **Speichern** drücken — und es lohnt sich zu sagen, warum das überhaupt möglich ist.

Jetzt bleibt eine Konvertierung in dem Browser, der sie gemacht hat. **Speichern** legt sie ins Konto, und sonst tut das nichts.

### Was das in der Praxis heißt

- Datei ablegen, lesen, Ergebnis herunterladen, Tab schließen: Nichts hat unsere Maschine verlassen und nichts liegt auf dem Konto.
- Das Anmelden lädt nichts hoch. Der Verlauf zeigt, was lokal und was gespeichert ist, und sagt, was davon was ist.
- Teilen braucht ein gespeichertes Dokument, denn ein Link muss auf etwas zeigen, das existiert — und genau das steht da, statt dass der Knopf rätselhaft nicht verfügbar wäre.
- Ein gespeichertes Dokument zu löschen löscht es. Die lokale Kopie gehört dem Browser, und das Löschen der Websitedaten entfernt sie.

### Warum die Konvertierung nie einen Server brauchte

Jede der zehn Konvertierungen läuft in JavaScript in Ihrem Browser: Markdown, HTML, \`.docx\`, \`.csv\`, \`.xlsx\`, JSON, reiner Text und die Zip-Leser für einen Notion-, Confluence- oder Obsidian-Export. Es gab nie einen technischen Grund, die Datei irgendwohin zu schicken — den Upload gab es, weil es das Konto gab, und das ist die falsche Reihenfolge.

Ein Konto ist für die Dokumente da, die Sie behalten wollen, und nicht als Protokoll von allem, was Sie angesehen haben. Wenn Sie sich nie anmelden, bekommt diese Seite überhaupt nie eine Datei.

Weiter: [ob ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe) und [ein Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link).`,
      },
    },
    body:
      'Converting a file used to put it in your account. Drop, look, close the tab — and it was '
      + 'there, along with everything else you had ever glanced at. Signing in was worse: whatever '
      + 'this browser had converted was uploaded in one go, so twenty-five things you had looked '
      + 'at became twenty-five documents you had never asked to keep.\n\n'
      + 'Now a conversion stays in this browser, and **Save** puts it in the account. The history '
      + 'shows both and says which is which; sharing still needs a saved document, and says so '
      + 'rather than being mysteriously unavailable.\n\n'
      + 'The connector and the API always worked this way — `tp_convert_markdown` saves '
      + 'nothing, `tp_save_document` saves — so this is the interface catching up with them.',
  },
  {
    date: '2026-09-11',
    title: 'Paste it, or type it and watch',
    slug: 'paste-and-live-preview',
    detail: {
      en: {
        description:
          'Paste Markdown instead of dropping a file, or type it at /markdown-live-preview and watch the document appear beside it. Nothing is uploaded.',
        keywords:
          'markdown live preview, paste markdown and convert, markdown editor with preview, online markdown preview, convert pasted text to html',
        body: `There are two different jobs hiding behind "convert this Markdown". One is finished work: a file exists, and you want the other format of it. The other is unfinished: you are writing, and you want to see what it looks like. A dropzone answers the first well and the second not at all, which is why there are now two answers.

### Pasting instead of dropping

Under the dropzone there is a button that opens a box you can paste into. The text becomes a file with that conversion's own extension and goes down exactly the path a dropped file goes down — the same conversion, the same size limit, the same preview, download, save, share and history. Nothing about the result is different, because nothing about the machinery is.

It is there for the conversions whose source is text: Markdown → HTML, HTML → Markdown, plain text, CSV or TSV, and JSON. On the five whose source is a file and nothing else — Word, Excel, and the Notion, Confluence and Obsidian exports — the button is visible but disabled, with the reason, because there is genuinely nothing to paste from a \`.zip\`. A character count in the box tells you where the limit is before a refusal does.

### The other question, at its own address

\`/markdown-live-preview\` is Markdown on the left, the document on the right, re-rendered about a fifth of a second after you stop typing. Both panes take their height from the window, so a tall screen is a tall editor, and there is a fullscreen for when it is not enough.

It is the same converter underneath — the same renderer, the same sanitiser, the same document styles — so what you are looking at is what a downloaded file contains. A preview that disagreed with the file would be worse than no preview. It opens with a short example rather than an empty box, which a reader who arrives with their own text never sees.

### Nothing leaves the tab

The live preview has no account, no history and no network. Your text is never sent anywhere and never saved; closing the tab is how you delete it. That is also what lets the page work with nothing but the bundle loaded.

### Between the two

They hand work to each other. Paste Markdown into the converter and the button beside it takes you to the live preview with your text already in it, rather than to the example. Write something in the live preview and **Convert and keep** sends it the other way, to the converter, where the history, the share link and the other formats live.

Related: [converting Markdown to HTML online](/blog/convert-markdown-to-html-online), and [Markdown editors worth using](/blog/best-markdown-editors).`,
      },
      de: {
        title: 'Einfügen, oder tippen und zusehen',
        summary: `Alles hier brauchte eine Datei, was eine sonderbare Forderung an jemanden ist, der das Markdown in der Zwischenablage hat. Der Konverter nimmt jetzt auch eingefügten Text — bei jeder Konvertierung außer denen, deren Quelle nur eine Datei sein kann —, und zurück kommt dasselbe Dokument, mit derselben Vorschau, demselben Herunterladen, Speichern und Teilen. Dazu eine Seite für die andere Frage: \`/markdown-live-preview\` ist Markdown links und das Dokument rechts, während getippt wird. Nichts wird hochgeladen und nichts gespeichert; der Text bleibt im Tab.`,
        description:
          'Markdown einfügen statt eine Datei ablegen — oder es unter /markdown-live-preview tippen und daneben zusehen. Nichts wird hochgeladen.',
        keywords:
          'markdown live vorschau, markdown einfügen und umwandeln, markdown editor mit vorschau, markdown vorschau online, eingefügten text in html umwandeln',
        body: `Hinter „wandle dieses Markdown um" verstecken sich zwei verschiedene Aufgaben. Die eine ist fertige Arbeit: Eine Datei existiert, und Sie wollen das andere Format davon. Die andere ist unfertig: Sie schreiben, und Sie wollen sehen, wie es aussieht. Ein Ablagefeld beantwortet die erste gut und die zweite überhaupt nicht — deshalb gibt es jetzt zwei Antworten.

### Einfügen statt ablegen

Unter dem Ablagefeld sitzt ein Knopf, der ein Feld zum Einfügen öffnet. Der Text wird zu einer Datei mit der Endung dieser Konvertierung und nimmt genau den Weg, den eine abgelegte Datei nimmt — dieselbe Konvertierung, dieselbe Größengrenze, dieselbe Vorschau, dasselbe Herunterladen, Speichern, Teilen und derselbe Verlauf. Am Ergebnis ist nichts anders, weil an der Mechanik nichts anders ist.

Es gibt das Feld für die Konvertierungen, deren Quelle Text ist: Markdown → HTML, HTML → Markdown, Reintext, CSV oder TSV und JSON. Bei den fünf, deren Quelle nur eine Datei sein kann — Word, Excel und die Exporte aus Notion, Confluence und Obsidian —, ist der Knopf sichtbar, aber abgeschaltet, mitsamt Begründung: Aus einer \`.zip\` gibt es wirklich nichts einzufügen. Eine Zeichenzahl im Feld zeigt die Grenze, bevor eine Ablehnung es tut.

### Die andere Frage, an eigener Adresse

\`/markdown-live-preview\` ist Markdown links, das Dokument rechts, neu gesetzt etwa eine Fünftelsekunde nachdem Sie aufhören zu tippen. Beide Hälften nehmen ihre Höhe vom Fenster, ein hoher Bildschirm ist also ein hoher Editor, und für den Fall, dass das nicht reicht, gibt es Vollbild.

Darunter arbeitet derselbe Konverter — dieselbe Darstellung, dieselbe Bereinigung, dieselben Dokumentstile —, was Sie ansehen, ist also das, was eine heruntergeladene Datei enthält. Eine Vorschau, die der Datei widerspricht, wäre schlimmer als keine. Die Seite beginnt mit einem kurzen Beispiel statt mit einem leeren Feld, das niemand sieht, der mit eigenem Text ankommt.

### Nichts verlässt den Tab

Die Live-Vorschau hat kein Konto, keinen Verlauf und kein Netz. Ihr Text wird nirgendwohin geschickt und nie gespeichert; ihn zu löschen heißt, den Tab zu schließen. Genau das erlaubt es der Seite auch, zu arbeiten, wenn nur das Bundle geladen ist.

### Zwischen beiden

Die beiden geben sich die Arbeit weiter. Fügen Sie Markdown im Konverter ein, führt der Knopf daneben Sie mit Ihrem Text in die Live-Vorschau, nicht zum Beispiel. Schreiben Sie dort etwas, schickt **Umwandeln und behalten** es in die andere Richtung, zum Konverter, wo Verlauf, Link zum Teilen und die übrigen Formate liegen.

Weiter: [Markdown online in HTML umwandeln](/blog/convert-markdown-to-html-online) und [Markdown-Editoren, die sich lohnen](/blog/best-markdown-editors).`,
      },
    },
    body:
      'Everything here needed a file, which is an odd thing to ask of somebody holding the '
      + 'Markdown in their clipboard. The converter now takes pasted text as well as a dropped '
      + 'file — for every conversion except Word, where there is nothing to paste — and '
      + 'what comes back is the same document, with the same preview, download, save and share.\n\n'
      + 'And a page for the other question: `/markdown-live-preview` is Markdown on the left and '
      + 'the document on the right, as it is typed. Nothing is uploaded and nothing is saved; the '
      + 'text stays in the tab. It is the converter underneath, so what is on the right is what a '
      + 'downloaded file contains.\n\n'
      + 'Both panes take their height from the window, so a tall screen is a tall editor, and '
      + 'there is a fullscreen for when that is still not enough. Text pasted on the converter '
      + 'arrives here already rendered, and '
      + '`Convert and keep` sends it back the other way — to the document screen, with the '
      + 'history, the share link and the other formats.',
  },
  {
    date: '2026-09-11',
    title: 'Every conversion, everywhere it can go',
    slug: 'ten-conversions',
    detail: {
      en: {
        description:
          'The ten conversions TransformPipe runs, what each one is for, and which of them a script or an assistant can ask for instead of a browser.',
        keywords:
          'document converter formats, convert word to markdown, convert excel to markdown table, convert a notion export to markdown, markdown conversion api',
        body: `Ten conversions, each on its own page, each running in the browser:

- **Markdown → HTML** (\`/\`) — the document as a page, downloadable as one self-contained file.
- **HTML → Markdown** (\`/html-to-markdown\`) — a saved page or an export back to text, with the headings, links, lists and tables kept and the furniture dropped.
- **Word → Markdown** (\`/word-to-markdown\`) — a \`.docx\`: the structure comes across, the fonts and the margins do not.
- **Excel → Markdown table** (\`/excel-to-markdown\`) — an \`.xlsx\` sheet as a real table.
- **CSV → Markdown table** (\`/csv-to-markdown\`) — \`.csv\` or \`.tsv\`, with the header row as the header.
- **JSON → Markdown** (\`/json-to-markdown\`) — a list of records becomes a table, nested objects become headings, one value per line is understood too.
- **Plain text → Markdown** (\`/text-to-markdown\`) — a \`.txt\` read as text, so an asterisk somebody typed stays an asterisk.
- **Notion → Markdown** (\`/notion-to-markdown\`) — the whole export \`.zip\`, a section per page.
- **Confluence → Markdown** (\`/confluence-to-markdown\`) — a space export, the same way.
- **Obsidian → Markdown** (\`/obsidian-to-markdown\`) — a zipped vault, every note in order.

### One list, three ways in

The app, the API and the assistant connector read the same list of conversions, which is why a menu cannot offer something the dropzone refuses. \`POST /api/v1/documents?kind=<id>\` takes any of the ten by the id in its address. Through the connector, \`tp_convert_to_markdown\` takes HTML, CSV, TSV or JSON, and \`tp_save_document\` takes the same with \`from\`, so a stored document knows what it was made from — which is what the chips in the history and the badge on a row are reading.

### Why a Word file cannot come through an assistant

A tool call is JSON and a \`.docx\` is a zip of bytes. An assistant never holds the file, only the text somebody extracted from it, so there is nothing useful to pass. An HTTP request body does carry bytes, which makes the API the one place a file can go: send the \`.docx\` as the body with \`?kind=word-to-markdown\`, and the same for an \`.xlsx\` or any of the three \`.zip\` exports.

### What they all have in common

Every one of them ends in Markdown, because Markdown is what a document is stored as here — the rendering, the sharing, the API and the assistant tools all stand on that one shape. And every one of them runs on your machine: nothing is uploaded unless you save it, none of the ten needs an account, and the limit is the file size rather than a plan.

Related: [Markdown out of Notion, Obsidian and Confluence](/blog/markdown-from-notion-obsidian-and-confluence), and [converting documents with an API](/blog/converting-documents-with-an-api).`,
      },
      de: {
        title: 'Jede Konvertierung, überall wo sie möglich ist',
        summary: `Die App konvertierte fünf Dinge, die beiden anderen Wege hinein nicht: einem Assistenten ließ sich nur Markdown übergeben, und die API lehnte Word schlicht ab. Jetzt nimmt \`tp_convert_to_markdown\` über den Konnektor HTML, CSV, TSV oder JSON, und \`tp_save_document\` dasselbe mit \`from\`, sodass ein Dokument weiß, woraus es gemacht wurde. Und die API nimmt eine \`.docx\` als Anfragekörper — die eine Stelle, an die eine Word-Datei gehen kann, denn eine Datei sind Bytes und ein Werkzeugaufruf ist JSON.`,
        description:
          'Die zehn Konvertierungen von TransformPipe, wofür jede gedacht ist und welche davon ein Skript oder ein Assistent statt eines Browsers anfordern kann.',
        keywords:
          'dokumente konvertieren formate, word in markdown umwandeln, excel in markdown tabelle umwandeln, notion export in markdown, api zum konvertieren von dokumenten',
        body: `Zehn Konvertierungen, jede auf ihrer eigenen Seite, jede im Browser:

- **Markdown → HTML** (\`/\`) — das Dokument als Seite, herunterladbar als eine in sich geschlossene Datei.
- **HTML → Markdown** (\`/html-to-markdown\`) — eine gespeicherte Seite oder ein Export zurück zu Text: Überschriften, Links, Listen und Tabellen bleiben, das Mobiliar fällt weg.
- **Word → Markdown** (\`/word-to-markdown\`) — eine \`.docx\`: der Bau kommt mit, die Schriften und Ränder nicht.
- **Excel → Markdown-Tabelle** (\`/excel-to-markdown\`) — ein \`.xlsx\`-Blatt als echte Tabelle.
- **CSV → Markdown-Tabelle** (\`/csv-to-markdown\`) — \`.csv\` oder \`.tsv\`, mit der Kopfzeile als Kopfzeile.
- **JSON → Markdown** (\`/json-to-markdown\`) — eine Liste von Datensätzen wird eine Tabelle, verschachtelte Objekte werden Überschriften, ein Wert pro Zeile wird auch verstanden.
- **Reiner Text → Markdown** (\`/text-to-markdown\`) — eine \`.txt\` wird als Text gelesen, damit ein getipptes Sternchen ein Sternchen bleibt.
- **Notion → Markdown** (\`/notion-to-markdown\`) — die ganze Export-\`.zip\`, ein Abschnitt pro Seite.
- **Confluence → Markdown** (\`/confluence-to-markdown\`) — ein Space-Export, genauso.
- **Obsidian → Markdown** (\`/obsidian-to-markdown\`) — ein gepackter Tresor, jede Notiz in ihrer Reihenfolge.

### Eine Liste, drei Wege hinein

Die App, die API und der Konnektor für Assistenten lesen dieselbe Liste von Konvertierungen — deshalb kann ein Menü nichts anbieten, was die Ablagefläche ablehnt. \`POST /api/v1/documents?kind=<id>\` nimmt jede der zehn über die id in ihrer Adresse. Über den Konnektor nimmt \`tp_convert_to_markdown\` HTML, CSV, TSV oder JSON, und \`tp_save_document\` dasselbe mit \`from\`: ein abgelegtes Dokument weiß dann, woraus es gemacht wurde — genau das lesen die Filter in der Chronik und das Abzeichen an einer Zeile.

### Warum eine Word-Datei nicht durch einen Assistenten kommt

Ein Werkzeugaufruf ist JSON, eine \`.docx\` ist ein Zip aus Bytes. Ein Assistent hält nie die Datei, sondern nur den Text, den jemand daraus gezogen hat — es gibt also nichts Brauchbares zu übergeben. Ein HTTP-Anfragekörper trägt dagegen Bytes, und damit ist die API die eine Stelle, an die eine Datei gehen kann: die \`.docx\` als Körper mit \`?kind=word-to-markdown\`, und ebenso eine \`.xlsx\` oder eine der drei \`.zip\`-Exporte.

### Was allen gemeinsam ist

Jede endet in Markdown, denn Markdown ist hier die Form, in der ein Dokument liegt — die Darstellung, das Teilen, die API und die Werkzeuge für Assistenten stehen alle auf dieser einen Form. Und jede läuft auf Ihrem Rechner: hochgeladen wird nichts, solange Sie nicht speichern, keine der zehn braucht ein Konto, und die Grenze ist die Dateigröße und kein Tarif.

Weiter: [Markdown aus Notion, Obsidian und Confluence](/blog/markdown-from-notion-obsidian-and-confluence) und [Dokumente über eine API konvertieren](/blog/converting-documents-with-an-api).`,
      },
    },
    body:
      'The app converted five things and the other two ways in did not. An assistant could only '
      + 'be handed Markdown, and the API refused Word outright.\n\n'
      + 'Now `tp_convert_to_markdown` takes HTML, CSV, TSV or JSON through the connector, and '
      + '`tp_save_document` takes the same with `from`, so a document is stored knowing what it '
      + 'was made from. And the API accepts a `.docx` as the request body — the one place a Word '
      + 'file can go, because a file is bytes and a tool call is JSON: an assistant never holds '
      + 'the file, only the text somebody extracted from it.',
  },
  {
    date: '2026-09-11',
    title: 'The Connect button now connects',
    slug: 'connector-oauth',
    detail: {
      en: {
        description:
          'Connecting an assistant to TransformPipe is an OAuth 2.1 flow with PKCE: you approve a named client, and it walks away with a token for your documents only.',
        keywords:
          'connect claude to transformpipe, mcp connector oauth, mcp authorization pkce, revoke an assistant access, oauth 2.1 authorization server',
        body: `Approving an assistant is one page and one button, and this is what is behind them.

### What approving actually does

You sign in here with the account you already use, read a page that names the client and the address it is about to act as, and press **Connect**. What the client walks away with is a token issued by this site — not your session, not an API key. It reaches the documents on the account and nothing else: not the account, not the sign-in, not your API keys. A read-only connection cannot save, share or delete, and that is enforced on the credential rather than on the tools.

TransformPipe has to be its own authorization server for this: the MCP specification forbids a resource accepting a token issued by somebody else, so the sign-in session cannot simply be handed over.

### The order of events

1. The assistant POSTs \`/api/mcp\` with no token and gets a 401 naming where to look.
2. It reads \`/.well-known/oauth-protected-resource\`, then \`/.well-known/oauth-authorization-server\`, to find the endpoints.
3. It identifies itself — by a metadata document it publishes, or by registering here. No secret either way: a client running on somebody else's machine cannot keep one, which is what PKCE is for.
4. It sends you to \`/authorize\` with a challenge. \`code_challenge_method=S256\` is required; a plain challenge is refused outright.
5. You approve with a POST from the page you were shown, so a link on its own authorises nothing.
6. It exchanges the code and its verifier at \`/token\`.

### What the tokens do afterwards

A code lives five minutes and is burnt at the start of its exchange, before anything is checked against it, so a copy replayed while the first call is still in flight gets nothing. Refresh tokens rotate: handing one in revokes it and issues a fresh pair. Handing in one that has already been rotated ends the whole grant — the access token, the refresh token beside it and every rotation before them — because a refresh token presented twice is the only signal anyone gets that it has been copied.

Take it back from the account menu, under MCP connector; it stops working on the next call.

### Why the button had done nothing

Two headers on our own page. It asked browsers to send no referrer, and Chrome derives a form POST's \`Origin\` from that same setting, so the page's own submission arrived claiming to come from nowhere — and the check that stops another site approving things for you stopped the page itself. Behind that, the page's \`form-action\` named only this site, so the trip back to the assistant was refused by the policy after the code had already been minted. It now names the one address the request will actually be sent to, and nothing else.

Related: [converting documents from an assistant](/blog/converting-documents-from-an-assistant), and [whether an online converter is safe](/blog/is-an-online-converter-safe).`,
      },
      de: {
        title: 'Der Connect-Knopf verbindet jetzt',
        summary: `Einen Assistenten zu genehmigen tat nichts. Die Seite sagte, das Formular komme nicht von hier — und hatte auf falsche Weise recht: die Genehmigungsseite bat Browser, keinen Referrer zu senden, und Chrome leitet den Origin einer Seite aus derselben Einstellung ab. So kam das eigene Formular der Seite von nirgendwo, und die Prüfung, die andere Websites am Genehmigen hindert, hielt die Seite selbst auf. Verbunden worden war darüber noch nie etwas. Dahinter saß ein zweiter Fehler: die Seite darf den Browser nur zu dem Assistenten schicken, der gefragt hat — und sie nannte lange nur uns selbst, sodass die Rückreise von der Seite selbst abgelehnt wurde. Jetzt nennt sie genau diese eine Adresse.`,
        description:
          'Einen Assistenten zu verbinden ist ein OAuth-2.1-Fluss mit PKCE: Sie genehmigen einen benannten Client, und der erhält ein Token für Ihre Dokumente, sonst nichts.',
        keywords:
          'claude mit transformpipe verbinden, mcp konnektor oauth, mcp autorisierung pkce, zugriff eines assistenten entziehen, oauth 2.1 autorisierungsserver',
        body: `Einen Assistenten zu genehmigen ist eine Seite und ein Knopf. Das steht dahinter.

### Was das Genehmigen tatsächlich tut

Sie melden sich mit dem Konto an, das Sie ohnehin benutzen, lesen eine Seite, die den Client und die Adresse nennt, als die er handeln wird, und drücken **Connect**. Was er mitnimmt, ist ein Token dieser Website — nicht Ihre Sitzung und kein API-Schlüssel. Es erreicht die Dokumente des Kontos und nichts weiter: nicht das Konto, nicht die Anmeldung, nicht Ihre API-Schlüssel. Eine nur lesende Verbindung kann nicht speichern, teilen oder löschen — durchgesetzt an der Berechtigung, nicht an den Werkzeugen.

TransformPipe muss dafür sein eigener Autorisierungsserver sein: laut MCP-Spezifikation darf eine Ressource kein fremdes Token annehmen, die Anmeldesitzung lässt sich also nicht weitergeben.

### Die Reihenfolge der Ereignisse

1. Der Assistent schickt ein POST an \`/api/mcp\` ohne Token und bekommt eine 401, die sagt, wo nachzusehen ist.
2. Er liest \`/.well-known/oauth-protected-resource\`, dann \`/.well-known/oauth-authorization-server\`, um die Endpunkte zu finden.
3. Er sagt, wer er ist — über ein Metadatendokument, das er veröffentlicht, oder indem er sich hier registriert. Ein Geheimnis gibt es nie: ein Client auf dem Rechner eines anderen kann keines hüten, und genau dafür ist PKCE da.
4. Er schickt Sie mit einer Challenge an \`/authorize\`. \`code_challenge_method=S256\` ist Pflicht; eine einfache Challenge wird abgelehnt.
5. Sie genehmigen mit einem POST von der Seite, die Ihnen gezeigt wurde — ein Link allein genehmigt nichts.
6. Er tauscht Code und Verifier an \`/token\` ein.

### Was die Token danach tun

Ein Code lebt fünf Minuten und wird zu Beginn des Tauschs verbrannt, bevor etwas gegen ihn geprüft wird: eine Kopie, die während des ersten Aufrufs eintrifft, bekommt nichts. Refresh-Token rotieren — wer eines einreicht, entwertet es und erhält ein frisches Paar. Wer eines vorlegt, das schon rotiert wurde, beendet die ganze Berechtigung: Zugriffstoken, Refresh-Token und jede Rotation davor. Ein zweimal vorgelegtes Refresh-Token ist das einzige Zeichen dafür, dass es kopiert wurde.

Zurücknehmen können Sie das im Konto-Menü unter MCP-Konnektor; beim nächsten Aufruf ist Schluss.

### Warum der Knopf nie etwas getan hat

Zwei Kopfzeilen auf unserer eigenen Seite. Sie bat Browser, keinen Referrer zu senden, und Chrome leitet den \`Origin\` eines Formular-POSTs aus derselben Einstellung ab — das eigene Formular der Seite kam also von nirgendwo, und die Prüfung, die fremde Websites am Genehmigen hindert, hielt die Seite selbst auf. Dahinter nannte ihr \`form-action\` nur diese Website: die Rückreise zum Assistenten lehnte die Richtlinie ab, nachdem der Code längst erzeugt war. Jetzt steht dort nur die eine Adresse, an die die Anfrage geht.

Weiter: [Dokumente aus einem Assistenten heraus konvertieren](/blog/converting-documents-from-an-assistant) und [ob ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe).`,
      },
    },
    body:
      'Approving an assistant did nothing. The page said the form had not come from here, and it '
      + 'was right in a way that was wrong: the approval page asked browsers not to send a '
      + 'referrer, and Chrome takes a page’s origin off the same setting — so the page’s own '
      + 'form arrived claiming to come from nowhere, and the check that stops another site '
      + 'approving things for you stopped the page itself.\n\n'
      + 'Nothing had ever been connected through it. The tests could not see this, because a test '
      + 'is not a browser and sends whichever headers it is told to; the database could, and said '
      + 'so plainly: every request shown, none ever approved.\n\n'
      + 'Behind that sat a second one. The page tells the browser it may only send you to the '
      + 'assistant that asked — and it had been saying it may send you nowhere but back to '
      + 'us, so approving worked and the trip back to the assistant was refused by the page '
      + 'itself. It now names that one address, and nothing else.',
  },
  {
    date: '2026-09-11',
    title: 'An assistant can say who it is without registering',
    slug: 'client-id-metadata',
    detail: {
      en: {
        description:
          'A client can identify itself with a Client ID Metadata Document — an https address it publishes — instead of registering a fresh client on every connection.',
        keywords:
          'client id metadata document, mcp client registration, dynamic client registration alternative, connect an assistant without registering, oauth client identity url',
        body: `There are three ways a client can tell an authorization server who it is: register itself, be configured by hand, or publish a document at an address and use that address as its name. This server now reads the third.

### What a metadata document is

Its \`client_id\` is an https URL. The document at that URL says what the client is called, where it may be sent back to, and optionally what it is asking for. The server fetches it while you are authorizing rather than keeping a registration of its own. It is \`draft-ietf-oauth-client-id-metadata-document-00\`, as the MCP authorization spec of 2025-11-25 profiles it, and Claude prefers it as soon as a server says it is supported.

### What it replaces

Dynamic client registration (RFC 7591) mints a client here on every connection. Reconnecting the same assistant made another one, so the table held five rows all called "Claude" — none of which could be told from the others, or from a stranger who had registered under the same name. A published document has one address, and the address is the identity: what it says can change, what it is cannot. Registration still works, because clients that only do that exist.

### What the server will and will not fetch

A \`client_id\` here is a URL handed over by a stranger and then fetched by our server, which is a request forgery waiting to be written badly. So: https only; a path, because a bare origin identifies a host rather than a client and anyone who can serve a file at a domain root would otherwise speak for the whole domain; no fragment and no credentials; the URL in canonical form, and repeated inside the document it names. Redirects are not followed, the address is resolved and refused if it is private, there is a timeout inside the one the client gives the whole endpoint, a 64 KB cap, and the body has to be JSON before it is parsed. Answers are held for an hour at most and failures for a minute, so a \`client_id\` that 404s does not turn every press of the button into another fetch.

### What the approval page says about it

Where the client's description was published, and that it was read just now. And a warning when every address it may be sent back to is a program on your own machine: the document is published by the real client, but binding a port is all it takes to catch the code that comes back, and no page can tell two programs on your computer apart. That one is yours to judge.

Related: [converting documents from an assistant](/blog/converting-documents-from-an-assistant), and [converting documents with an API](/blog/converting-documents-with-an-api).`,
      },
      de: {
        title: 'Ein Assistent kann sagen, wer er ist, ohne sich zu registrieren',
        summary: `Einen Assistenten zu verbinden bedeutete bisher, dass er sich hier zuerst registriert — und Claude legte bei jeder Verbindung einen neuen Client an. Er kann sich jetzt stattdessen über ein Metadatendokument ausweisen: eine Adresse, die er veröffentlicht und die dieser Server liest, so wie es die MCP-Spezifikation vorzieht. Für Clients, die das nicht können, funktioniert die Registrierung weiterhin. Die Genehmigungsseite sagt nun dazu, wo die Beschreibung eines Clients veröffentlicht ist, und warnt, wenn er nur an ein Programm auf Ihrem eigenen Rechner zurückgeschickt werden kann — denn dort kann jedes Programm darum bitten.`,
        description:
          'Ein Client kann sich mit einem Client ID Metadata Document ausweisen — einer Adresse, die er veröffentlicht — statt sich bei jeder Verbindung neu zu registrieren.',
        keywords:
          'client id metadata document, mcp client registrierung, dynamische client registrierung alternative, assistent ohne registrierung verbinden, oauth client identität url',
        body: `Ein Client kann einem Autorisierungsserver auf drei Wegen sagen, wer er ist: sich registrieren, von Hand eingetragen werden, oder ein Dokument unter einer Adresse veröffentlichen und diese Adresse als Namen benutzen. Den dritten liest dieser Server jetzt.

### Was ein Metadatendokument ist

Seine \`client_id\` ist eine https-URL. Das Dokument unter dieser URL sagt, wie der Client heißt, wohin er zurückgeschickt werden darf und wahlweise, worum er bittet. Der Server holt es während Ihrer Autorisierung, statt eine eigene Registrierung zu führen. Es ist \`draft-ietf-oauth-client-id-metadata-document-00\` in der Fassung, die die MCP-Autorisierungsspezifikation vom 25.11.2025 daraus macht, und Claude bevorzugt es, sobald ein Server sagt, dass er es unterstützt.

### Was es ersetzt

Die dynamische Client-Registrierung (RFC 7591) legt hier bei jeder Verbindung einen Client an. Denselben Assistenten erneut zu verbinden ergab einen weiteren, und so standen fünf Zeilen in der Tabelle, alle „Claude" — keine davon von den anderen zu unterscheiden, und auch nicht von einem Fremden, der sich unter demselben Namen registriert hätte. Ein veröffentlichtes Dokument hat eine Adresse, und die Adresse ist die Identität: was es sagt, kann sich ändern, was es ist, nicht. Die Registrierung funktioniert weiterhin, denn es gibt Clients, die nur das können.

### Was der Server holt und was nicht

Eine \`client_id\` ist hier eine URL, die ein Fremder übergibt und unser Server dann abruft — eine Server-Side Request Forgery, die nur darauf wartet, schlecht geschrieben zu werden. Also: nur https; ein Pfad, denn ein nackter Origin bezeichnet einen Host und keinen Client, und sonst spräche jeder, der eine Datei im Wurzelverzeichnis einer Domain ablegen kann, für die ganze Domain; kein Fragment und keine Zugangsdaten; die URL in kanonischer Form und im Dokument selbst wiederholt. Weiterleitungen werden nicht gefolgt, die Adresse wird aufgelöst und abgelehnt, wenn sie privat ist, es gibt eine eigene Zeitgrenze innerhalb der, die der Client dem ganzen Endpunkt gibt, eine Obergrenze von 64 KB, und der Körper muss JSON sein, bevor er gelesen wird. Antworten werden höchstens eine Stunde gehalten, Fehlschläge eine Minute — eine \`client_id\`, die mit 404 antwortet, macht so nicht aus jedem Knopfdruck einen neuen Abruf.

### Was die Genehmigungsseite dazu sagt

Wo die Beschreibung des Clients veröffentlicht ist, und dass sie gerade eben gelesen wurde. Und eine Warnung, wenn jede Adresse, an die er zurückgeschickt werden darf, ein Programm auf Ihrem eigenen Rechner ist: das Dokument veröffentlicht der echte Client, aber um den zurückkommenden Code zu fangen, genügt es, einen Port zu belegen, und keine Seite kann zwei Programme auf Ihrem Rechner auseinanderhalten. Das zu beurteilen bleibt Ihnen.

Weiter: [Dokumente aus einem Assistenten heraus konvertieren](/blog/converting-documents-from-an-assistant) und [Dokumente über eine API konvertieren](/blog/converting-documents-with-an-api).`,
      },
    },
    body:
      'Connecting an assistant used to mean it registered itself here first, and Claude made a '
      + 'new client every time somebody connected. It can now identify itself with a metadata '
      + 'document instead — an address it publishes, which this server reads — which is '
      + 'what the MCP specification prefers. Registration still works for clients that do not.\n\n'
      + 'The approval page changed with it. It now says where a client’s description was '
      + 'published, and warns when the only place it can be sent back to is a program on your own '
      + 'computer, because anything running there can ask to be sent there too.',
  },
  {
    date: '2026-09-10',
    title: 'This page',
    slug: 'the-changelog',
    detail: {
      en: {
        description:
          'What the TransformPipe changelog lists and what it deliberately leaves out: changes you would notice, one typed list, and entries written in English.',
        keywords:
          'transformpipe changelog, what has shipped, markdown converter release notes, product updates and changes',
        body: `A changelog is only useful if you can trust what is not in it, so this says what gets an entry.

### What does

Anything a person using TransformPipe would notice: a conversion that did not exist before, a new page, another way to sign in, a limit that moved, a bug that was visibly wrong. A tagged release carries its version number; most of what has shipped went out between tags and carries none, which is why the list is longer than the list of releases.

### What does not

Refactors, dependency bumps, build and infrastructure work — anything invisible from outside. The note at the top of the page says so, which is the reason to keep it true: an entry about a moved file would make that note a lie, and a changelog you have to filter is one you stop reading.

### One list, several places

Every entry comes off a single typed list in the repository. The page, the five prerendered languages, the \`lastmod\` in the sitemap and the handful of entries with pages of their own all read it — there is no second file to keep in step and none to forget. The bodies are Markdown, rendered by the product's own converter: a release note that breaks the renderer would break a customer's document too, and this is a better place to find that out.

### English, deliberately

The chrome is translated — the heading, the lede, the panel, and the dates and month names, which \`Intl\` renders in your language. The entries themselves are not. Five translations per entry, per release, forever is a cost that gets skipped after the second release, and a changelog with three languages missing is worse than one that is honestly English. Where an entry has earned a page of its own, that page can be translated, because there are a handful of those rather than one per release.

Related: [release notes from Markdown](/blog/release-notes-from-markdown), and [documentation that lives in the repo](/blog/documentation-that-lives-in-the-repo).`,
      },
      de: {
        title: 'Diese Seite',
        summary: `Ein Changelog, unter \`/changelog\` und aus der Fußzeile verlinkt. Jedes Release und dazwischen die Änderungen, die es wert sind, genannt zu werden — gelesen aus einer einzigen typisierten Liste und dargestellt von dem Konverter, den das Produkt verkauft.`,
        description:
          'Was das Changelog von TransformPipe aufführt und was absichtlich fehlt: sichtbare Änderungen, eine einzige Liste, und Einträge auf Englisch.',
        keywords:
          'transformpipe changelog, was wurde veröffentlicht, release notes markdown konverter, produktänderungen übersicht',
        body: `Ein Changelog ist nur dann brauchbar, wenn man dem trauen kann, was nicht darin steht. Also: was einen Eintrag bekommt.

### Was hineingehört

Alles, was jemand bemerkt, der TransformPipe benutzt: eine Konvertierung, die es vorher nicht gab, eine neue Seite, ein weiterer Weg zur Anmeldung, eine verschobene Grenze, ein Fehler, der sichtbar falsch war. Ein getaggtes Release trägt seine Versionsnummer; das meiste ging zwischen den Tags hinaus und trägt keine — deshalb ist die Liste länger als die Liste der Releases.

### Was nicht

Umbauten im Code, Abhängigkeiten, Build- und Infrastrukturarbeit — alles, was von außen unsichtbar ist. Der Hinweis oben auf der Seite sagt das, und genau deshalb muss es stimmen: ein Eintrag über eine verschobene Datei würde diesen Hinweis zur Lüge machen, und ein Changelog, das man erst filtern muss, liest man irgendwann nicht mehr.

### Eine Liste, mehrere Orte

Jeder Eintrag kommt aus einer einzigen typisierten Liste im Repository. Die Seite, die fünf vorgerenderten Sprachen, das \`lastmod\` in der Sitemap und die Handvoll Einträge mit eigener Seite lesen alle daraus — es gibt keine zweite Datei, die mitgepflegt werden müsste, und keine, die man vergessen kann. Die Texte sind Markdown und werden von dem Konverter des Produkts selbst gesetzt: eine Release-Notiz, die den Renderer bricht, würde auch das Dokument einer Kundin brechen, und hier fällt es besser auf.

### Englisch, mit Absicht

Der Rahmen ist übersetzt — Überschrift, Vorspann, die Jahresleiste und die Daten und Monatsnamen, die \`Intl\` in Ihrer Sprache setzt. Die Einträge selbst nicht. Fünf Übersetzungen pro Eintrag, pro Release, auf Dauer sind ein Aufwand, den man nach dem zweiten Release sein lässt, und ein Changelog, in dem drei Sprachen fehlen, ist schlechter als eines, das ehrlich englisch ist. Wo ein Eintrag sich eine eigene Seite verdient hat, kann diese Seite übersetzt werden — davon gibt es eine Handvoll und nicht eine pro Release.

Weiter: [Release Notes aus Markdown](/blog/release-notes-from-markdown) und [Dokumentation, die im Repository lebt](/blog/documentation-that-lives-in-the-repo).`,
      },
    },
    body:
      'A changelog, at `/changelog` and linked from the footer. Every release and, between them, ' +
      'the changes worth naming — read from one typed list and rendered by the converter the ' +
      'product sells.',
  },
  {
    date: '2026-09-10',
    title: 'A page for an address that is not a page',
    slug: 'not-found-page',
    detail: {
      en: {
        description:
          'The TransformPipe 404: three named ways out instead of the host error page, and no more rendering the converter under an address nobody typed.',
        keywords:
          'page not found, 404 page, mistyped url markdown converter, soft 404 fix, where did the page go',
        body: `If you are reading this, you probably arrived at a 404 and wondered what the site does with one.

### What it offers

The number, a line saying the address is not a page, and three ways out named rather than hinted at: convert a file, read the documentation, browse the blog. The converter comes first and is the one filled button, because somebody who typed the domain by hand was looking for it. A last line says that if a link on this site sent you here, that is a bug rather than a typo — which tells you whether to retype the address or to report it.

It carries the site's own header and footer and is re-rendered in your language, so landing on it does not feel like being thrown out of the site.

### Why a typo used to render the converter

The router asks an address one question: which screen does it want. Its last branch was the converter, the default screen — so every path it did not recognise rendered the Markdown screen. One wrong letter in a URL looked like a working front page with a stranger's path in the address bar, and nothing anywhere said the address was wrong. That last branch is now "not found"; the converter is returned only for an address that is genuinely one of the ten conversions' own, or a shared document.

The host answers most unknown addresses before the app's code runs at all, but it answers them by serving the 404 file — and then this is what decides what you see.

### Two soft 404s went with it

A link to an article that does not exist used to answer 200, which a crawler files as a real page and then keeps. And \`/de/history\` was a plain 404 in four of the five languages, so the screen worked until somebody reloaded it.

### What it does not do

Guess what you meant, or redirect. A 404 that quietly sends you somewhere else is how a broken link stays broken: nobody finds out it is wrong, including whoever wrote it.

Related: [how to open an .md file](/blog/how-to-open-md-file), and [what a Markdown to HTML converter is for](/blog/markdown-to-html-converter).`,
      },
      de: {
        title: 'Eine Seite für eine Adresse, die keine Seite ist',
        summary: `Es gab keine: eine nicht erkannte Adresse bekam die Fehlerseite des Hosts, auf der es nichts zu klicken gab. Jetzt gibt es eine 404-Seite mit dem Rahmen der Website und drei Wegen hinaus, einmal geschrieben und in der Sprache der Leserin neu gesetzt. Zwei weiche 404er kamen mit heraus: ein Link auf einen Artikel, den es nicht gibt, antwortete mit 200, was ein Crawler als echte Seite aufnimmt; und \`/de/history\` war in vier Sprachen eine schlichte 404, sodass der Bildschirm funktionierte, bis jemand neu lud.`,
        description:
          'Die 404-Seite von TransformPipe: drei benannte Wege hinaus statt der Fehlerseite des Hosts, und kein Konverter mehr unter einer Adresse, die niemand getippt hat.',
        keywords:
          'seite nicht gefunden, 404 fehlerseite, adresse falsch getippt markdown konverter, weiche 404 beheben, wo ist die seite hin',
        body: `Wenn Sie das lesen, sind Sie wahrscheinlich auf einer 404 gelandet und haben sich gefragt, was diese Website daraus macht.

### Was sie anbietet

Die Zahl, einen Satz, dass diese Adresse keine Seite ist, und drei Wege hinaus, benannt statt angedeutet: eine Datei konvertieren, die Dokumentation lesen, im Blog stöbern. Der Konverter steht vorn und ist der einzige gefüllte Knopf, denn wer die Domain von Hand getippt hat, wollte ihn. Eine letzte Zeile sagt, dass ein Link dieser Website, der Sie hierher geschickt hat, ein Fehler und kein Tippfehler ist — daran erkennen Sie, ob Sie die Adresse neu tippen oder sie melden sollten.

Die Seite trägt Kopf und Fuß der Website und wird in Ihrer Sprache neu gesetzt: hier zu landen fühlt sich nicht an wie ein Hinauswurf.

### Warum ein Tippfehler früher den Konverter zeigte

Der Router stellt einer Adresse eine Frage: welchen Bildschirm will sie. Sein letzter Zweig war der Konverter, der Standardbildschirm — jeder Pfad, den er nicht erkannte, ergab also den Markdown-Bildschirm. Ein falscher Buchstabe in einer URL sah aus wie eine funktionierende Startseite mit einem fremden Pfad in der Adresszeile, und nirgends stand, dass die Adresse falsch war. Dieser letzte Zweig heißt jetzt „nicht gefunden"; den Konverter gibt es nur noch für eine Adresse, die wirklich einer der zehn Konvertierungen gehört, oder für ein geteiltes Dokument.

Die meisten unbekannten Adressen beantwortet der Host, bevor der Code der App überhaupt läuft — aber er beantwortet sie, indem er die 404-Datei ausliefert, und was Sie dann sehen, entscheidet dies hier.

### Zwei weiche 404er kamen mit

Ein Link auf einen Artikel, den es nicht gibt, antwortete mit 200, was ein Crawler als echte Seite aufnimmt und dann behält. Und \`/de/history\` war in vier der fünf Sprachen eine schlichte 404, sodass der Bildschirm funktionierte, bis jemand neu lud.

### Was sie nicht tut

Raten, was Sie gemeint haben, oder weiterleiten. Eine 404, die Sie still woanders hinschickt, ist der Grund, warum ein kaputter Link kaputt bleibt: niemand erfährt davon, auch nicht, wer ihn geschrieben hat.

Weiter: [wie man eine .md-Datei öffnet](/blog/how-to-open-md-file) und [wozu ein Markdown-nach-HTML-Konverter da ist](/blog/markdown-to-html-converter).`,
      },
    },
    body:
      'There was none: an unmatched address got the host’s own error page, with nothing to ' +
      'click. There is now a 404 carrying the site’s chrome and three ways out, written once ' +
      'and re-rendered in the reader’s language.\n\n' +
      'Two soft 404s came out with it. A link to an article that does not exist answered 200, ' +
      'which a crawler indexes as a real page; and `/de/history` was a plain 404 in four ' +
      'languages, so the screen worked until somebody reloaded it.',
  },
  {
    date: '2026-09-10',
    title: 'The blog in German',
    slug: 'blog-in-german',
    detail: {
      en: {
        description:
          'All sixty-three TransformPipe articles exist in German, written rather than machine-translated, with the search terms a German reader would actually type.',
        keywords:
          'markdown guides in german, german documentation markdown converter, translated markdown tutorials, transformpipe blog languages',
        body: `Sixty-three articles, and every one of them now exists in English, in German and in French. German went first, an article at a time, which is why the machinery described below exists at all. Spanish and Italian have a handful rather than a blog.

### What a translation is here

Not a literal one. The register is formal, the prose is rebuilt rather than transposed, and the keywords are written around the phrase a German reader would actually type — not the English phrase translated word for word, which is how a page ends up ranking for something nobody searches for.

What does not change: the date, every link target, every code block, every table's structure, and every "checked on" citation, which keeps the date the claim was actually checked on. A statement about another tool's behaviour was true on a particular day, and translating a sentence does not re-check it.

### A language has what it has

Each language's index lists only its own articles. An article claims an \`hreflang\` for a language only where there is text in it, so a search engine is never pointed at a translation that does not exist. A language with nothing translated gets no index at all, rather than a heading over an empty list. The covers are drawn per language, because the headline is part of the picture.

The language switcher follows the same rule: on an article your language has, it takes you to that article; on one it does not, it takes you to that language's index, which lists what it does have. Following the prefix blindly would offer a German address for a piece with no German text — a 404 dressed as a translation.

### New articles do not work this way any more

An article written from the middle of September 2026 onwards ships in all five languages in the same commit, or it is not finished. The backlog is the argument for that rule: fifty-six articles went out in English, German followed one at a time, and the other three never started, because "translate it later" is a decision nobody makes on purpose. What is left of the backlog gets translated when somebody chooses to; the rule is about not growing it.

Related: [escaping in Markdown](/blog/markdown-escaping), and [CommonMark, GFM and the flavours](/blog/commonmark-gfm-and-the-flavours).`,
      },
      de: {
        title: 'Der Blog auf Deutsch',
        summary: `Neunundzwanzig der sechsundfünfzig Artikel liegen auf Deutsch vor, und der Blog kann von nun an Artikel für Artikel übersetzt werden. Die Regel dahinter lautet überall: eine Sprache hat, was sie hat. Ihre Übersicht führt nur ihre eigenen Artikel, ein Artikel beansprucht ein \`hreflang\` nur für die Sprachen, in denen wirklich Text steht, und eine Sprache ohne Übersetzungen bekommt gar keine Übersicht statt einer Überschrift über einer leeren Liste. Die Titelbilder werden pro Sprache gezeichnet, denn die Schlagzeile ist Teil des Bildes.`,
        description:
          'Alle dreiundsechzig Artikel von TransformPipe liegen auf Deutsch vor — geschrieben statt maschinell übersetzt, mit den Suchbegriffen deutscher Leser.',
        keywords:
          'markdown anleitungen auf deutsch, markdown konverter dokumentation deutsch, markdown tutorials übersetzt, transformpipe blog sprachen',
        body: `Dreiundsechzig Artikel, und jeder einzelne liegt inzwischen auf Englisch, auf Deutsch und auf Französisch vor. Deutsch kam zuerst, Artikel für Artikel — deshalb gibt es die Mechanik, um die es weiter unten geht, überhaupt. Spanisch und Italienisch haben eine Handvoll und noch keinen Blog.

### Was eine Übersetzung hier ist

Keine wörtliche. Das Register ist förmlich, die Prosa wird neu gebaut statt übertragen, und die Suchbegriffe werden um die Formulierung herum geschrieben, die eine deutsche Leserin tatsächlich eintippt — nicht um die Wort für Wort übersetzte englische, mit der eine Seite am Ende für etwas rankt, das niemand sucht.

Was sich nicht ändert: das Datum, jedes Linkziel, jeder Codeblock, der Bau jeder Tabelle und jede Angabe „geprüft am", die das Datum behält, an dem wirklich geprüft wurde. Eine Aussage über das Verhalten eines anderen Werkzeugs stimmte an einem bestimmten Tag, und eine Übersetzung prüft sie nicht neu.

### Eine Sprache hat, was sie hat

Die Übersicht jeder Sprache führt nur ihre eigenen Artikel. Ein Artikel beansprucht ein \`hreflang\` für eine Sprache nur dort, wo wirklich Text steht — eine Suchmaschine wird also nie auf eine Übersetzung geschickt, die es nicht gibt. Eine Sprache ohne Übersetzungen bekommt gar keine Übersicht statt einer Überschrift über einer leeren Liste. Und die Titelbilder werden pro Sprache gezeichnet, denn die Schlagzeile ist Teil des Bildes.

Die Sprachumschaltung folgt derselben Regel: bei einem Artikel, den Ihre Sprache hat, führt sie zu diesem Artikel; bei einem, den sie nicht hat, zur Übersicht dieser Sprache, die zeigt, was da ist. Dem Präfix blind zu folgen würde eine deutsche Adresse für einen Text ohne deutschen Inhalt anbieten — eine 404 im Gewand einer Übersetzung.

### Für neue Artikel gilt das nicht mehr

Ein Artikel, der ab Mitte September 2026 geschrieben wird, erscheint in allen fünf Sprachen im selben Commit, oder er ist nicht fertig. Der Rückstand ist das Argument für diese Regel: sechsundfünfzig Artikel gingen auf Englisch hinaus, Deutsch folgte einer nach dem anderen, und die drei übrigen Sprachen begannen nie, denn „später übersetzen" ist eine Entscheidung, die niemand absichtlich trifft. Was vom Rückstand bleibt, wird übersetzt, wenn jemand sich dafür entscheidet; die Regel soll ihn nur nicht größer werden lassen.

Weiter: [Escaping in Markdown](/blog/markdown-escaping) und [CommonMark, GFM und die Varianten](/blog/commonmark-gfm-and-the-flavours).`,
      },
    },
    body:
      'Twenty-nine of the fifty-six articles are in German, and the blog can now be translated ' +
      'one article at a time.\n\n' +
      'The rule throughout is that a language has what it has. Its index lists only its own ' +
      'articles, an article claims an `hreflang` only for the languages that actually have text, ' +
      'and a language with nothing translated gets no index at all rather than a heading over an ' +
      'empty list. Covers are drawn per language, because the headline is part of the picture.',
  },
  {
    date: '2026-09-09',
    title: 'Email that arrives',
    slug: 'email-deliverability',
    detail: {
      en: {
        description:
          'TransformPipe sends two messages: a welcome, and a notice when somebody shares a document with you. Why they used not to arrive, and what fixed it.',
        keywords:
          'why do my emails go to spam, dmarc record for transactional email, serverless function not sending email, shared document notification email, spf dkim and dmarc explained',
        body: `Mail from a product is mostly a thing to be suspicious of, so it is worth saying how little of it there is here. Two messages: a welcome, the first time an account is actually used, and a notice to somebody an account has shared a document with. No digests, no product news, nothing you have to unsubscribe from.

### Why they were not arriving

Three faults, one after the other. The notice was first wired to an endpoint the application never calls. Then it was fixed to fire after the response had gone out — which is the natural thing to write and the wrong thing in a serverless function, because the platform may freeze the instance the moment a response is sent, and a request that has not left yet never does. Three addresses were added on a live deployment and the mail provider logged nothing at all: not a failure, an absence.

So a send is now part of the request that triggered it, and awaited, with a four-second timeout so a provider having a bad minute cannot turn a share into a slow share. The third fault was duller than the other two: the key was genuinely missing from the first builds.

### Why they were going to spam

SPF and DKIM were in place from the start and were never the problem. The record that was missing was DMARC — the DNS entry that says what a receiver should do with mail failing the other two — and a young domain sending automated mail without it is treated harshly. That is DNS rather than code, which is part of why it took three attempts to find.

What the code can do is not make it worse. Both MIME parts rather than text alone, because text-only automated mail from a domain with no sending history is what a filter distrusts most. A subject that leads with the document's name instead of a raw address beside a quoted filename, a pair whose shape filters know. And a Reply-To pointing at the person who shared it, because a message you cannot answer reads as machinery.

### What these messages are not

No images and no tracking pixel; the HTML part is the same words as the plain part, rendered by the product's own converter. A document's name is printed inside a code span, so a file called \`[Confirm your account](https://elsewhere.example)\` arrives as text rather than as a live link in a message carrying our signature. A deployment with no key configured sends nothing and says nothing, and a share that worked is never reported as failed because the mail was not. All of it is in English whatever your language: it goes to an address we know nothing else about.

Related: [sharing a document as a link](/blog/share-a-markdown-document-as-a-link), and [whether an online converter is safe](/blog/is-an-online-converter-safe).`,
      },
      de: {
        title: 'E-Mail, die ankommt',
        summary: `Eine Willkommensnachricht, einmal beim ersten Gebrauch eines Kontos, und ein Hinweis an jemanden, mit dem ein Dokument geteilt wurde. Beides brauchte drei Anläufe: Der Hinweis hing an einem Endpunkt, den die Anwendung nie aufruft, ging danach erst nach der Antwort hinaus, sodass die Anfrage die Funktion nie verließ, und scheiterte schließlich an einem Schlüssel, der in den ersten Builds tatsächlich fehlte. Für die Zustellbarkeit fehlte DMARC, nicht SPF und DKIM.`,
        description:
          'TransformPipe verschickt zwei Nachrichten: ein Willkommen und einen Hinweis auf ein geteiltes Dokument. Warum sie früher nicht ankamen und was es behoben hat.',
        keywords:
          'e-mail landet im spam, dmarc eintrag einrichten, zustellbarkeit von transaktionsmails, hinweis auf geteiltes dokument, unterschied spf dkim dmarc',
        body: `Post von einem Produkt ist meistens etwas, dem man misstrauen sollte — also sei gesagt, wie wenig davon es hier gibt. Zwei Nachrichten: ein Willkommen, wenn ein Konto zum ersten Mal wirklich benutzt wird, und ein Hinweis an jemanden, mit dem ein Konto ein Dokument geteilt hat. Keine Zusammenfassungen, keine Produktneuigkeiten, keine Liste, von der Sie sich abmelden müssten.

### Warum sie nicht ankamen

Drei Fehler, einer nach dem anderen. Der Hinweis hing zuerst an einem Endpunkt, den die Anwendung nie aufruft. Dann wurde er abgeschickt, nachdem die Antwort schon hinaus war — das Naheliegende, wenn man es schreibt, und in einer serverlosen Funktion das Falsche: Die Plattform darf die Instanz in dem Moment einfrieren, in dem die Antwort geht, und eine Anfrage, die noch nicht draußen war, geht nie mehr hinaus. Auf einer laufenden Bereitstellung wurden drei Adressen hinzugefügt, und der Mail-Dienst hat gar nichts protokolliert: kein Fehlschlag, eine Abwesenheit.

Ein Versand gehört deshalb jetzt zu der Anfrage, die ihn ausgelöst hat, und wird abgewartet — mit vier Sekunden Zeitgrenze, damit ein Dienst mit einer schlechten Minute aus dem Teilen kein langsames Teilen macht. Der dritte Fehler war nüchterner als die beiden anderen: Der Schlüssel fehlte in den ersten Builds wirklich.

### Warum sie im Spam landeten

SPF und DKIM waren von Anfang an eingerichtet und nie das Problem. Was fehlte, war DMARC — der DNS-Eintrag, der sagt, was ein Empfänger mit Post tun soll, die an den beiden anderen scheitert. Eine junge Domain, die ohne ihn automatische Post verschickt, wird streng behandelt. Das ist DNS und nicht Code, was erklärt, warum es dauerte.

Was der Code tun kann, ist, es nicht schlimmer zu machen: beide MIME-Teile statt nur Text, denn eine reine Textnachricht von einer Domain ohne Versandgeschichte ist genau das, was ein Filter am wenigsten mag. Eine Betreffzeile, die mit dem Namen des Dokuments beginnt statt mit einer nackten Adresse neben einem Dateinamen in Anführungszeichen — ein Paar, dessen Form Filter kennen. Und ein Reply-To auf die Person, die geteilt hat, denn eine Nachricht, die man nicht beantworten kann, liest sich wie Maschinerie.

### Was diese Nachrichten nicht sind

Keine Bilder und kein Zählpixel; der HTML-Teil sind dieselben Worte wie der Textteil, gesetzt vom Konverter des Produkts selbst. Der Name eines Dokuments steht in einer Code-Spanne, damit eine Datei namens \`[Confirm your account](https://elsewhere.example)\` als Text ankommt und nicht als klickbarer Link in einer Nachricht, die unsere Signatur trägt. Eine Bereitstellung ohne Schlüssel verschickt nichts und sagt nichts, und ein Teilen, das geklappt hat, wird nie als gescheitert gemeldet, weil die Post es nicht tat. Alles davon ist englisch: Es geht an eine Adresse, über die wir sonst nichts wissen.

Weiter: [ein Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link) und [ob ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe).`,
      },
    },
    body:
      'A welcome message, sent once when an account is first used, and a notice to somebody a ' +
      'document has been shared with.\n\n' +
      'Both took three attempts. The notice was wired to an endpoint the app never calls, then ' +
      'fired after the response so the request never left the function, then blocked by a key ' +
      'that was genuinely absent from the first builds. Deliverability needed DMARC, not just ' +
      'SPF and DKIM.',
  },
  {
    date: '2026-09-09',
    title: 'Signing in with an email address',
    slug: 'sign-in-with-email',
    detail: {
      en: {
        description:
          'Sign in to TransformPipe with an address and a password, or with Google. What an unconfirmed address may do, and where the session cookie comes from.',
        keywords:
          'sign in with email and password, account for a markdown converter, reset my password, confirm my email address, sign in with google',
        body: `Handing a third party a new relationship in order to keep a text file is a lot to ask, and for the first weeks it was the only thing on offer. There is now a form beside the Google button. If the address is the same one, it is the same account.

### It is a dialogue, not a page

Signing in, signing up, asking for a reset link and entering the confirmation code are four views of one dialogue, over whatever you were already doing. Somebody here is usually in the middle of converting something, and a navigation loses the document they had open; changing your mind between "sign in" and "sign up" costs nothing for the same reason. Google sits below the form rather than above it — the form is what the dialogue is for now, and the button that leaves the page belongs after the one that does not.

No password rules are listed anywhere in it. The identity service enforces its own minimum, this application does not know what that minimum is, and a list of requirements that disagrees with the server is worse than no list at all: it tells you a password is fine and then refuses it. You get whatever the service actually said instead.

### Where the session comes from

Identity is Neon Auth's rather than ours, Google included — that is its provider, not a second integration here. The service lives on its own hostname, so letting the page talk to it directly would make its session cookie a third-party cookie for this site, and browsers are steadily refusing to carry those. Everything under \`/api/auth/\` is forwarded through this origin instead, and the cookie coming back has its Domain attribute stripped off. It then belongs to this site, first-party, and is carried without argument.

### Until the address is confirmed

An unconfirmed account keeps ten documents rather than five hundred, and cannot publish a document to a link anybody can open. Sharing with named addresses works either way, because that names people and asks each of them to sign in — it puts no page on the open web.

Neither limit is a trial or a paywall. An address nobody has proved cannot be recovered, cannot be told anything, and costs nothing to make a hundred of, so the two things held back are the two that matter: accumulating storage, and putting a page on the public internet under our domain. Entering the code lifts both on your very next request rather than your next sign-in. An account that arrived through Google is confirmed already — the provider asserts the address, so there was never anything here to confirm.

Related: [sharing a document as a link](/blog/share-a-markdown-document-as-a-link), and [turning an assistant's output into a page](/blog/ai-output-to-a-shareable-page).`,
      },
      de: {
        title: 'Anmelden mit einer E-Mail-Adresse',
        summary: `Google war der einzige Weg herein. Jetzt gibt es einen Dialog mit Anmelden, Registrieren, Passwort-Zurücksetzen und einem Einmalcode — und ein Konto mit unbestätigter Adresse wird zurückgehalten: kein Veröffentlichen per Link und zehn Dokumente statt fünfhundert, bis die Adresse bestätigt ist.`,
        description:
          'Bei TransformPipe mit Adresse und Passwort anmelden oder mit Google. Was ein unbestätigtes Konto darf und woher das Cookie der Sitzung kommt.',
        keywords:
          'mit e-mail adresse anmelden, konto für markdown konverter, passwort zurücksetzen, e-mail adresse bestätigen, mit google anmelden',
        body: `Einem Dritten eine neue Beziehung zu überlassen, nur um eine Textdatei zu behalten, ist viel verlangt — und in den ersten Wochen war es das Einzige, was hier angeboten wurde. Neben dem Google-Knopf steht jetzt ein Formular. Ist es dieselbe Adresse, ist es dasselbe Konto.

### Ein Dialog, keine Seite

Anmelden, Registrieren, einen Link zum Zurücksetzen anfordern und den Bestätigungscode eingeben sind vier Ansichten eines Dialogs, der sich über das legt, was Sie gerade getan haben. Wer hier ist, konvertiert meist gerade etwas, und ein Seitenwechsel würde das offene Dokument verlieren; die Meinung zwischen „Anmelden“ und „Registrieren“ zu ändern kostet aus demselben Grund nichts. Google steht unter dem Formular und nicht darüber: Das Formular ist der Zweck dieses Dialogs, und der Knopf, der die Seite verlässt, gehört hinter den, der es nicht tut.

Regeln für das Passwort stehen nirgends darin. Der Identitätsdienst setzt seine eigene Mindestanforderung durch, diese Anwendung kennt sie nicht, und eine Liste von Anforderungen, die dem Server widerspricht, ist schlechter als keine Liste: Sie sagt Ihnen, ein Passwort sei in Ordnung, und weist es dann ab. Sie sehen stattdessen, was der Dienst tatsächlich gesagt hat.

### Woher die Sitzung kommt

Die Identität gehört Neon Auth und nicht uns, Google eingeschlossen — das ist dessen Anbieter, keine zweite Anbindung hier. Der Dienst liegt auf einem eigenen Hostnamen: Würde die Seite direkt mit ihm sprechen, wäre sein Sitzungs-Cookie für diese Seite ein Drittanbieter-Cookie, und Browser verweigern solche zunehmend. Alles unter \`/api/auth/\` läuft deshalb über diese Herkunft, und dem Cookie auf dem Rückweg wird das Domain-Attribut genommen. Es gehört dann dieser Seite, ist erstanbieterisch und wird ohne Diskussion mitgeführt.

### Bis die Adresse bestätigt ist

Ein unbestätigtes Konto behält zehn Dokumente statt fünfhundert und kann kein Dokument unter einem Link veröffentlichen, den jede Person öffnen kann. Das Teilen mit benannten Adressen geht in beiden Fällen, denn es benennt Menschen und verlangt von jedem eine Anmeldung — es stellt keine Seite ins offene Netz.

Keine der beiden Grenzen ist eine Testphase oder eine Bezahlschranke. Eine Adresse, die niemand nachgewiesen hat, lässt sich nicht wiederherstellen, ihr lässt sich nichts mitteilen, und hundert davon kosten nichts. Zurückgehalten werden deshalb genau die zwei Dinge, auf die es ankommt: Speicher anzusammeln und eine Seite unter unserer Domain ins öffentliche Netz zu stellen. Den Code einzugeben hebt beides bei der nächsten Anfrage auf, nicht erst bei der nächsten Anmeldung. Ein Konto, das über Google kam, ist ohnehin bestätigt — der Anbieter versichert die Adresse, es gab hier also nie etwas zu bestätigen.

Weiter: [ein Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link) und [aus der Ausgabe eines Assistenten eine Seite machen](/blog/ai-output-to-a-shareable-page).`,
      },
    },
    body:
      'Google was the only way in. There is now a dialogue with sign-in, sign-up, a password ' +
      'reset and a one-time code, and an unconfirmed account is held back: no publishing by ' +
      'link, and ten documents rather than five hundred, until the address is confirmed.',
  },
  {
    date: '2026-09-09',
    title: 'Five languages',
    slug: 'five-languages',
    detail: {
      en: {
        description:
          'The interface, the documentation and every page of prose read in English, German, French, Spanish and Italian. What is translated here, and what is not.',
        keywords:
          'document converter in german, markdown converter in french, convert markdown to html in spanish, change the interface language, multilingual online converter',
        body: `The switcher in the header names each language in itself — Deutsch, Français, Español, Italiano — because that is the only name a reader of it recognises. Choosing one takes you to the same page in that language, and it stays chosen.

### The language is in the address

\`/de/docs\`, \`/fr/csv-to-markdown\`, \`/es/markdown-to-html\`: one address per page per language, which is what a search engine needs in order to offer somebody the right one. English deliberately keeps the bare paths. Sixty-eight pages were already indexed at them, and moving English under a prefix of its own would have traded everything a search engine knows about this site for a tidier scheme.

A browser asking for a language nobody has written here lands on English, rather than on a redirect to something it cannot read. Dates and month names are not translated by hand at all — \`Intl\` renders them, which is also why English here reads "8 September 2026" and not the American order.

### One catalogue, checked by the build

Every sentence the interface says lives in one typed catalogue, with English as the source. A key added in English and forgotten in German does not compile, which removes the failure mode of every string table that is checked by hand.

Types cannot see everything, though. A list of three sections satisfies the same type as a list of five, so a translator who dropped a paragraph would ship a page missing it, in one language, silently. So a build step walks each language against English — same keys, same list lengths, nothing empty, the same placeholders — and it runs inside the build, so a language that does not line up stops a deploy instead of reaching a reader. It found 192 missing keys the first time it ran.

### The blog is a different thing

An article is a file rather than a string, and a translation of one is another file beside it, so the blog is translated a piece at a time. English, German and French have all sixty-three. Where a language has nothing, it lists nothing, links to nothing and claims no \`hreflang\` for it: a heading over an empty index is worse than an honest absence.

### What stays in English

The API's messages and the connector's, because an API answers in one language. The consent page an assistant sends you to, and the server's own copy of a shared document: both are rendered for a reader we know nothing about, at an address with no language in it, and guessing wrong on a consent screen is worse than English. The entries in this changelog are English too — a page like this one is written in another language when it is worth having in it.

Related: [what a Markdown to HTML converter is for](/blog/markdown-to-html-converter), and [choosing among online document converters](/blog/best-online-document-converters).`,
      },
      de: {
        title: 'Fünf Sprachen',
        summary: `Oberfläche, Dokumentation und alle Textseiten liegen auf Englisch, Deutsch, Französisch, Spanisch und Italienisch vor — die Sätze in einem einzigen typisierten Katalog, dazu ein Build-Schritt, der jede Sprache gegen das Englische prüft: gleiche Schlüssel, gleiche Listenlängen, nichts leer, dieselben Platzhalter. Beim ersten Lauf fand er 192 fehlende Schlüssel. Die Sprache steht in der Adresse — \`/de/docs\`, \`/fr/csv-to-markdown\` —, und Englisch behält die bloßen Pfade, weil achtundsechzig Seiten dort schon indexiert waren.`,
        description:
          'Oberfläche, Dokumentation und alle Textseiten gibt es auf Englisch, Deutsch, Französisch, Spanisch und Italienisch. Was hier übersetzt ist und was nicht.',
        keywords:
          'dokumentenkonverter auf deutsch, markdown konverter deutsche oberfläche, sprache der oberfläche umstellen, markdown in html auf deutsch, mehrsprachiger online konverter',
        body: `Die Sprachauswahl in der Kopfzeile nennt jede Sprache so, wie sie sich selbst nennt — Deutsch, Français, Español, Italiano —, denn das ist der einzige Name, den ihre Leser wiedererkennen. Die Auswahl führt auf dieselbe Seite in dieser Sprache und bleibt gewählt.

### Die Sprache steht in der Adresse

\`/de/docs\`, \`/fr/csv-to-markdown\`, \`/es/markdown-to-html\`: eine Adresse pro Seite und Sprache, denn nur so kann eine Suchmaschine die passende anbieten. Englisch behält bewusst die bloßen Pfade. Achtundsechzig Seiten waren dort schon indexiert; Englisch unter ein eigenes Präfix zu schieben hätte alles, was eine Suchmaschine über diese Seite weiß, gegen ein ordentlicheres Schema getauscht.

Ein Browser, der eine Sprache verlangt, die hier niemand geschrieben hat, landet auf Englisch statt auf einer Weiterleitung zu etwas, das er nicht lesen kann. Datumsangaben und Monatsnamen werden gar nicht von Hand übersetzt: \`Intl\` setzt sie, weshalb im Englischen „8 September 2026“ steht und nicht die amerikanische Reihenfolge.

### Ein Katalog, vom Build geprüft

Jeder Satz, den die Oberfläche sagt, liegt in einem typisierten Katalog, und das Englische ist die Quelle. Ein Schlüssel, der im Englischen hinzukommt und im Deutschen vergessen wird, kompiliert nicht — damit ist die Schwachstelle jeder handgeprüften Textsammlung weg.

Typen sehen aber nicht alles. Eine Liste mit drei Abschnitten erfüllt denselben Typ wie eine mit fünf; wer beim Übersetzen einen Absatz verliert, liefert also eine Seite aus, der er fehlt — in einer Sprache, unbemerkt. Ein Build-Schritt läuft deshalb jede Sprache gegen das Englische ab: gleiche Schlüssel, gleiche Listenlängen, nichts leer, dieselben Platzhalter. Er steckt im Build, also hält eine Sprache, die nicht zusammenpasst, die Auslieferung auf, statt bei Lesern zu landen. Beim ersten Lauf fand er 192 fehlende Schlüssel.

### Das Blog ist etwas anderes

Ein Artikel ist eine Datei und keine Zeichenkette, seine Übersetzung eine weitere Datei daneben — das Blog wird also Stück für Stück übersetzt. Englisch, Deutsch und Französisch haben alle dreiundsechzig. Wo eine Sprache nichts hat, listet sie nichts, verlinkt nichts und beansprucht kein \`hreflang\` dafür: Eine Überschrift über einem leeren Verzeichnis ist schlechter als ein ehrliches Fehlen.

### Was englisch bleibt

Die Meldungen der API und des Connectors, denn eine API antwortet in einer Sprache. Die Zustimmungsseite, auf die ein Assistent Sie schickt, und die serverseitige Fassung eines geteilten Dokuments: Beide werden für Leser gesetzt, über die wir nichts wissen, an einer Adresse ohne Sprache — und auf einer Zustimmungsseite falsch zu raten ist schlechter als Englisch. Die Einträge dieses Änderungsprotokolls sind ebenfalls englisch; eine Seite wie diese wird übersetzt, wenn sie es wert ist.

Weiter: [wozu ein Markdown-nach-HTML-Konverter da ist](/blog/markdown-to-html-converter) und [wie man unter Online-Dokumentenkonvertern wählt](/blog/best-online-document-converters).`,
      },
    },
    body:
      'The interface, the documentation and the pages of words are in English, German, French, ' +
      'Spanish and Italian, with the words in one typed catalogue and a build step that walks ' +
      'every language against English: same keys, same array lengths, nothing empty, the same ' +
      'placeholders. It found 192 missing keys on its first run.\n\n' +
      'The language is in the address — `/de/docs`, `/fr/csv-to-markdown` — and English keeps the ' +
      'bare paths, because sixty-eight pages were already indexed at them.',
  },
  {
    date: '2026-09-09',
    title: 'An embed, and the frame policy the app never had',
    slug: 'embed-the-converter',
    detail: {
      en: {
        description:
          'A page at /embed is the TransformPipe converter with no chrome, to frame in your own site. The file converts in the visitor’s browser and reaches no server.',
        keywords:
          'embed a document converter in my site, iframe markdown to html converter, add a file converter to a web page, postmessage iframe integration, white label markdown converter',
        body: `A dropzone, the document it produced, a copy button and a download. That is the whole of \`/embed\`: no header, no footer, no blog, no account, no history — nothing that would look like our navigation turning up inside somebody else's page.

### What the host controls

\`?conversion=\` decides which conversion the frame opens on, and \`?theme=dark\` or \`?theme=light\` decides how it looks. The host chooses the theme rather than the visitor's operating system, because a widget that follows the OS lands as a dark rectangle in a light page for half the audience.

Results come back by \`postMessage\` to the parent window, and every message carries \`source: 'TransformPipe'\` — a host listening on \`window\` hears from every frame it has and from its own scripts, so without a name to check, the first handler anybody writes fires on somebody else's message. One message is sent on load, so a host can wait for the frame instead of guessing at a timeout. Check \`event.origin\` at your end.

### Why frame it rather than proxy it

The conversion runs in the visitor's browser, exactly as it does here. Your reader drops a file and it reaches neither your server nor ours. A host that wants server-side conversion should call the API; what the embed offers is the one thing an API cannot, which is the file never leaving the machine it is on.

It is also anonymous on purpose. The embed is rendered instead of the application rather than as the application with its chrome hidden, and it sits above the part that asks the server who is signed in — so a page on any domain framing it never causes a credentialed request to us. There is no cookie banner in it either: asking for consent inside somebody else's page is asking on their behalf.

### Everything else now refuses to be framed

The embed needed a \`frame-ancestors\` rule, and writing one exposed that no route had ever had one. Every other address now says no — \`frame-ancestors 'none'\` and \`X-Frame-Options: DENY\` — so the converter that has an account behind it cannot be put in a frame at all. \`/embed\` and its translations (\`/de/embed\` and the rest) allow any ancestor and carry \`noindex\`, because a chromeless converter is not a page anybody should arrive at from a search.

Keeping a document, sharing it and the history stay on transformpipe.com. The embed has no session to reach them with, and that is the design rather than a limitation.

Related: [converting Markdown to HTML in JavaScript](/blog/markdown-to-html-in-javascript), and [whether an online converter is safe](/blog/is-an-online-converter-safe).`,
      },
      de: {
        title: 'Ein Embed, und die Frame-Regel, die die App nie hatte',
        summary: `\`/embed\` ist der Konverter ohne alles Beiwerk, für eine Seite, die ihn beherbergen will, und er spricht per \`postMessage\` mit seinem Gastgeber. Ihn hinzuzufügen hieß, die fehlende Regel endlich aufzuschreiben: Jede andere Route weigert sich nun überhaupt, in einen Frame gestellt zu werden — was vorher nirgends stand.`,
        description:
          'Die Seite /embed ist der TransformPipe-Konverter ohne Beiwerk, zum Einbetten in die eigene Seite. Die Datei wird im Browser umgewandelt und erreicht keinen Server.',
        keywords:
          'konverter in eigene seite einbetten, markdown konverter im iframe, dateikonverter auf website einbinden, postmessage einbindung iframe, konverter ohne upload einbetten',
        body: `Ein Ablagefeld, das entstandene Dokument, ein Knopf zum Kopieren und einer zum Herunterladen. Das ist alles, was unter \`/embed\` steht: keine Kopfzeile, keine Fußzeile, kein Blog, kein Konto, kein Verlauf — nichts, das aussähe wie unsere Navigation in der Seite eines anderen.

### Was der Gastgeber bestimmt

\`?conversion=\` legt fest, mit welcher Konvertierung der Frame öffnet, und \`?theme=dark\` oder \`?theme=light\`, wie er aussieht. Das Erscheinungsbild wählt der Gastgeber und nicht das Betriebssystem des Besuchers, denn ein Baustein, der dem System folgt, landet für die Hälfte des Publikums als dunkles Rechteck in einer hellen Seite.

Ergebnisse kommen per \`postMessage\` beim übergeordneten Fenster heraus, und jede Nachricht trägt \`source: 'TransformPipe'\`. Wer auf \`window\` lauscht, hört von jedem Frame und von den eigenen Skripten — ohne einen Namen zum Prüfen feuert die erste Behandlung, die jemand schreibt, also auf fremde Nachrichten. Beim Laden geht eine Nachricht hinaus, damit ein Gastgeber auf den Frame warten kann, statt eine Zeitspanne zu raten. Prüfen Sie \`event.origin\` auf Ihrer Seite.

### Warum einbetten und nicht weiterleiten

Die Konvertierung läuft im Browser des Besuchers, genau wie hier. Ihr Leser legt eine Datei ab, und sie erreicht weder Ihren Server noch unseren. Wer serverseitig umwandeln will, ruft die API; das Embed bietet das Einzige, was eine API nicht kann — dass die Datei den Rechner nie verlässt, auf dem sie liegt.

Es ist außerdem bewusst anonym. Das Embed wird anstelle der Anwendung gezeichnet und nicht als Anwendung mit versteckter Umgebung, und es liegt über dem Teil, der den Server fragt, wer angemeldet ist. Eine Seite auf irgendeiner Domain löst durch das Einbetten also nie eine Anfrage mit Anmeldedaten bei uns aus. Einen Cookie-Hinweis gibt es darin ebenfalls nicht: In der Seite eines anderen um Zustimmung zu bitten heißt, an dessen Stelle zu fragen.

### Alles andere verweigert sich dem Frame

Das Embed brauchte eine \`frame-ancestors\`-Regel, und sie zu schreiben machte sichtbar, dass keine Route je eine hatte. Jede andere Adresse sagt nun Nein — \`frame-ancestors 'none'\` und \`X-Frame-Options: DENY\` —, der Konverter mit dem Konto dahinter lässt sich also überhaupt nicht in einen Frame stellen. \`/embed\` und seine Sprachfassungen (\`/de/embed\` und die übrigen) erlauben jeden Vorfahren und tragen \`noindex\`, denn ein Konverter ohne Beiwerk ist keine Seite, auf der jemand aus einer Suche landen sollte.

Ein Dokument zu behalten, es zu teilen und der Verlauf bleiben auf transformpipe.com. Das Embed hat keine Sitzung, mit der es dorthin käme, und das ist so gebaut und keine Einschränkung.

Weiter: [Markdown mit JavaScript in HTML umwandeln](/blog/markdown-to-html-in-javascript) und [ob ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe).`,
      },
    },
    body:
      '`/embed` is the converter with no chrome, for a page that wants to host it, and it talks ' +
      'to its host with `postMessage`. Adding it meant writing the rule that was missing: every ' +
      'other route now refuses to be framed at all, which nothing had said before.',
  },
  {
    date: '2026-09-09',
    title: 'The connector has its own dialogue',
    slug: 'connector-consent-page',
    detail: {
      en: {
        description:
          'Connecting an assistant to TransformPipe has its own dialogue and its own consent page: what the assistant may do, and why read-only really is read-only.',
        keywords:
          'connect an assistant to a document converter, mcp connector setup, oauth read only access, revoke an assistant’s access, add an mcp server by url',
        body: `Open the account menu, choose the connector, and the screen is about one thing: connecting an assistant. It used to be the API keys dialogue, on the argument that both are ways into the same account — and that was the wrong argument, because somebody who had just chosen "MCP connector" landed on a screen headed "API keys" with a key generator at the top, and had to work out whether they were in the right place.

### The dialogue

The address to add, which is \`/api/mcp\` on whatever origin you are actually on rather than a hostname written down somewhere — a preview deployment hands out its own. The one-line command, for a client that takes one. And the assistants currently connected, each with when it was, and a way to cut it off. Nothing here makes a key, and connecting an assistant no longer involves pasting one.

### The page the assistant sends you to

A client that supports OAuth sends you here to approve it, and what arrives is a page rendered by the server with no scripts in it at all. It names the account it would act as, and then says, in plain sentences: that it can read the documents on this account and their share links; whether it can save, share and delete, or cannot; that sharing publishes a page anybody holding the link can open; and that it cannot reach your account, your sign-in or your API keys. The address it will send you back to is printed. If the client published its own metadata, where that was read from is printed too.

If every address it wants to be sent back to is on this machine, the page says so and says why it matters: any program on your computer can ask to be sent there, and no server can tell them apart. That is the one thing on the page only the person at the keyboard can judge.

### Read-only is read-only

A connection granted \`documents:read\` without \`documents:write\` is refused on anything that changes something — a 403, with an \`insufficient_scope\` header saying what it would have needed. The check sits on the credential rather than on individual routes, and it works from a list of safe methods rather than a list of unsafe ones, so a route added later is covered by default. The first version had that the other way round.

An approval also cannot be driven from somewhere else. A pending request is recorded against the browser session it was shown to and can only be approved from that one; the approving endpoint checks \`Origin\` and \`Sec-Fetch-Site\`; and a request nobody approved goes stale after half an hour. Any grant can be taken back from the account menu.

Related: [converting documents from an assistant](/blog/converting-documents-from-an-assistant), and [converting documents with an API](/blog/converting-documents-with-an-api).`,
      },
      de: {
        title: 'Der Connector hat seinen eigenen Dialog',
        summary: `TransformPipe zu einem Assistenten hinzuzufügen öffnete früher den Dialog für API-Schlüssel — eine Fläche mit der Überschrift „API keys“ und einem Schlüsselgenerator obenan, sodass jemand, der „MCP connector“ gewählt hatte, erst herausfinden musste, dass er am richtigen Ort war. Es ist jetzt ein eigener Dialog, mit der Adresse, dem einzeiligen Befehl und den bereits verbundenen Assistenten.`,
        description:
          'Einen Assistenten mit TransformPipe zu verbinden hat einen eigenen Dialog und eine Zustimmungsseite: was er darf, und warum nur lesend wirklich nur lesend ist.',
        keywords:
          'assistenten mit dokumentenkonverter verbinden, mcp connector einrichten, oauth nur lesender zugriff, zugriff eines assistenten entziehen, mcp server per adresse hinzufügen',
        body: `Öffnen Sie das Kontomenü und wählen den Connector, geht es um eine Sache: einen Assistenten zu verbinden. Früher war das der Dialog für API-Schlüssel, mit der Begründung, beides führe in dasselbe Konto — und die Begründung war falsch, denn wer gerade „MCP connector“ gewählt hatte, landete auf einer Fläche mit der Überschrift „API keys“ und einem Schlüsselgenerator obenan und musste erst herausfinden, ob er richtig war.

### Der Dialog

Die Adresse, die hinzugefügt wird: \`/api/mcp\` auf der Herkunft, auf der Sie tatsächlich sind, und nicht ein irgendwo notierter Hostname — eine Vorschau-Bereitstellung nennt ihre eigene. Dazu der einzeilige Befehl für Programme, die einen nehmen. Und die derzeit verbundenen Assistenten, jeder mit dem Zeitpunkt und einem Weg, ihn zu trennen. Nichts hier erzeugt einen Schlüssel, und einen Assistenten zu verbinden heißt nicht mehr, einen einzufügen.

### Die Seite, auf die der Assistent Sie schickt

Ein Programm mit OAuth schickt Sie zur Zustimmung hierher, und was kommt, ist eine vom Server gesetzte Seite ganz ohne Skripte. Sie benennt das Konto, in dessen Namen gehandelt würde, und sagt dann in klaren Sätzen: dass die Dokumente dieses Kontos und ihre Teilen-Links gelesen werden können; ob gespeichert, geteilt und gelöscht werden darf oder eben nicht; dass Teilen eine Seite veröffentlicht, die jede Person mit dem Link öffnen kann; und dass Ihr Konto, Ihre Anmeldung und Ihre API-Schlüssel unerreichbar bleiben. Die Adresse, an die Sie zurückgeschickt werden, steht da; hat das Programm eigene Angaben veröffentlicht, auch, woher sie gelesen wurden.

Liegt jede Adresse, an die es zurückgeschickt werden will, auf diesem Rechner, sagt die Seite das und sagt, warum es zählt: Jedes Programm auf Ihrem Rechner darf verlangen, dorthin geschickt zu werden, und kein Server kann sie auseinanderhalten. Das ist das Einzige auf dieser Seite, das nur der Mensch davor beurteilen kann.

### Nur lesend ist wirklich nur lesend

Eine Verbindung mit \`documents:read\` und ohne \`documents:write\` wird bei allem abgewiesen, was etwas ändert — mit 403 und einem \`insufficient_scope\`-Kopf, der sagt, was gefehlt hätte. Die Prüfung sitzt an der Berechtigung und nicht an einzelnen Routen, und sie arbeitet mit einer Liste der unbedenklichen Methoden statt mit einer Liste der bedenklichen: Eine später hinzugefügte Route ist damit von vornherein erfasst. In der ersten Fassung war es umgekehrt.

Eine Zustimmung lässt sich auch nicht von außen auslösen. Eine offene Anfrage wird der Browsersitzung zugeordnet, der sie gezeigt wurde, und kann nur aus dieser bestätigt werden; die bestätigende Stelle prüft \`Origin\` und \`Sec-Fetch-Site\`; und eine Anfrage, die niemand bestätigt, verfällt nach einer halben Stunde. Jede Erteilung lässt sich im Kontomenü zurücknehmen.

Weiter: [Dokumente aus einem Assistenten konvertieren](/blog/converting-documents-from-an-assistant) und [Dokumente mit einer API konvertieren](/blog/converting-documents-with-an-api).`,
      },
    },
    body:
      'Adding TransformPipe to an assistant used to open the API keys dialogue — a screen headed ' +
      '"API keys" with a key generator at the top, so a person who chose "MCP connector" had to ' +
      'work out they were in the right place. It is its own dialogue now, with the address, the ' +
      'one-line command and the assistants already connected.',
  },
  {
    date: '2026-09-09',
    title: 'A guard for the failures that only happen on the platform',
    slug: 'deploy-checks',
    detail: {
      en: {
        description:
          'A check that runs inside every build and refuses the mistakes that only fail once deployed: a specifier Node will not resolve, and a config pattern it rejects.',
        keywords:
          'function invocation failed on vercel, esm import missing js extension, cannot import json in a serverless function, vercel.json invalid source pattern, check before deploying',
        body: `Types pass, the bundler builds, the dev server serves — and the deployment answers 500 on every request. That gap is what this script is for. All three of those tools resolve modules and read configuration the way a bundler does; the deployed function does neither, and the script checks exactly the difference. It runs inside \`npm run build\` and exits non-zero, so neither mistake can reach a push again.

### What it refuses

**A relative import with no extension.** The API runs as ESM on Node, where \`./faq\` does not resolve and \`./faq.js\` does. One such line, reached from the server's own import graph, answered every \`/api\` route with FUNCTION_INVOCATION_FAILED.

**A \`.json\` import in that graph.** \`import { version } from '../package.json'\` type-checks, builds, and works in the dev server. The deployed bundle carries modules and not the repository, so the file is simply not there and the import throws at module load — which is every request, so the whole API returned 500.

**A \`source\` pattern the platform's router will not parse.** The symptom here is not a failing deploy: an invalid pattern is rejected before a build starts, so there is no deployment at all and production quietly stays on the commit before. The patterns are parsed with the same library the platform parses them with.

**A version that disagrees with itself.** \`shared/version.ts\` must equal \`package.json\`. It is a copy precisely because a JSON import is the failure above, and a copy nobody checks goes stale; the extension's manifest and the release tag read one of them, the connector reads the other.

### How it decides what to look at

The rule applies to the files the deployed function actually loads, and that set is not "everything under \`server/\`" — it follows imports wherever they lead, which is how a file under \`src/lib\` became part of the server in the first place. So it starts at the function's entry point and walks. A type-only import is skipped: it is erased at compile time, so its specifier never becomes something a runtime has to resolve.

### What it is not

Not a test suite and not a linter. It knows four specific ways the platform differs from a laptop and nothing else; it will not notice a logic error, and it warns rather than fails if the library it parses patterns with is not installed, because the point is to catch the mistake on the machine where it is being made. Each rule was proved by putting its bug back and watching the check fail.

Related: [documentation that lives in the repository](/blog/documentation-that-lives-in-the-repo), and [publishing Markdown from GitHub Actions](/blog/publish-markdown-from-github-actions).`,
      },
      de: {
        title: 'Ein Schutz für die Fehler, die nur auf der Plattform auftreten',
        summary: `Zwei Dinge hatten die Produktion lahmgelegt, und keines von beiden konnte lokal scheitern: ein Import ohne Endung, den ein Bundler verdeckt und Node verweigert, und ein Muster in \`vercel.json\`, das überhaupt keine Bereitstellung erzeugt. Beides wird jetzt vor dem Build geprüft, und der Schutz wurde bewiesen, indem jeder der beiden Fehler noch einmal eingebaut wurde.`,
        description:
          'Eine Prüfung in jedem Build, die die Fehler abweist, die erst nach der Bereitstellung auftreten: ein Import, den Node nicht auflöst, und ein ungültiges Muster.',
        keywords:
          'function invocation failed beheben, esm import ohne endung in node, json import in serverloser funktion, ungültiges muster in vercel.json, prüfung vor dem deploy',
        body: `Die Typen stimmen, der Bundler baut, der Entwicklungsserver liefert aus — und die Bereitstellung antwortet auf jede Anfrage mit 500. Für genau diesen Abstand gibt es dieses Skript. Alle drei Werkzeuge lösen Module auf und lesen Konfiguration so, wie ein Bundler es tut; die ausgelieferte Funktion tut beides nicht, und das Skript prüft genau den Unterschied. Es steckt in \`npm run build\` und endet mit einem Fehlercode, damit keiner der beiden Fehler noch einmal bis zu einem Push kommt.

### Was es abweist

**Einen relativen Import ohne Endung.** Die API läuft als ESM auf Node, wo \`./faq\` nicht auflöst und \`./faq.js\` schon. Eine einzige solche Zeile, erreichbar aus dem Importgraphen des Servers, beantwortete jede \`/api\`-Route mit FUNCTION_INVOCATION_FAILED.

**Einen \`.json\`-Import in diesem Graphen.** \`import { version } from '../package.json'\` besteht die Typprüfung, baut und läuft im Entwicklungsserver. Das ausgelieferte Bündel trägt Module und nicht das Repository, die Datei ist also einfach nicht da, und der Import scheitert beim Laden des Moduls — und das ist jede Anfrage, weshalb die ganze API 500 lieferte.

**Ein \`source\`-Muster, das der Router der Plattform nicht liest.** Das Symptom ist hier keine fehlgeschlagene Auslieferung: Ein ungültiges Muster wird abgewiesen, bevor ein Build beginnt, es gibt also überhaupt keine Bereitstellung, und die Produktion bleibt still auf dem vorherigen Commit. Die Muster werden mit derselben Bibliothek gelesen, mit der die Plattform sie liest.

**Eine Version, die sich selbst widerspricht.** \`shared/version.ts\` muss mit \`package.json\` übereinstimmen. Es ist eine Kopie, eben weil ein JSON-Import der Fehler von oben ist, und eine Kopie, die niemand prüft, veraltet; das Manifest der Erweiterung und das Release-Tag lesen die eine, der Connector die andere.

### Wie es entscheidet, wohin es schaut

Die Regel gilt für die Dateien, die die ausgelieferte Funktion wirklich lädt, und diese Menge ist nicht „alles unter \`server/\`“ — sie folgt den Importen, wohin sie führen, und genau so wurde eine Datei unter \`src/lib\` überhaupt Teil des Servers. Es beginnt deshalb am Eingangspunkt der Funktion und läuft von dort. Ein Import, der nur Typen holt, wird übersprungen: Er wird beim Kompilieren getilgt, seine Angabe muss also nie zur Laufzeit aufgelöst werden.

### Was es nicht ist

Keine Testsuite und kein Linter. Es kennt vier bestimmte Unterschiede zwischen der Plattform und einem Laptop und sonst nichts; einen Denkfehler bemerkt es nicht, und wenn die Bibliothek zum Lesen der Muster fehlt, warnt es statt zu scheitern — denn der Zweck ist, den Fehler auf der Maschine zu fangen, auf der er gemacht wird. Jede Regel wurde bewiesen, indem ihr Fehler wieder eingebaut wurde und die Prüfung fiel.

Weiter: [Dokumentation, die im Repository lebt](/blog/documentation-that-lives-in-the-repo) und [Markdown aus GitHub Actions veröffentlichen](/blog/publish-markdown-from-github-actions).`,
      },
    },
    body:
      'Two things had taken production down and neither could fail locally: an extensionless ' +
      'import that a bundler hides and Node refuses, and a `vercel.json` pattern that produces ' +
      'no deployment at all. Both are now checked before the build, and the guard was proved by ' +
      'reintroducing each bug.',
  },
  {
    date: '2026-09-09',
    title: 'Share an article',
    slug: 'share-an-article',
    detail: {
      en: {
        description:
          'Three plain share links at the foot of every TransformPipe article — X, LinkedIn and Reddit — with no third-party script watching the reader.',
        keywords:
          'share a blog article, share buttons without tracking, add share links to a blog, share an article on linkedin, submit a link to reddit',
        body: `Every article here ends with three links: X, LinkedIn and Reddit. Each is an ordinary anchor to that network's own compose screen, with the article's address and its headline already filled in, opening in a new tab so a half-read article is not lost behind it.

### Why links and not buttons

All three networks publish a script that draws its own button, keeps a count, and sees everybody who loads the page it sits on. This site's claim is that a document you convert is never sent anywhere, and a page that quietly loaded three trackers under the prose would be making that claim with its fingers crossed. A plain anchor does the same work: nothing runs until the reader clicks, and the only request that leaves is the one they asked for.

The names are spelled out rather than drawn, for a duller reason. The icon set this site uses has a LinkedIn glyph and the old Twitter bird, no X mark and no Reddit one — a bird beside a real logo beside an approximate Snoo reads as three different decisions, where three words read as one.

### What it does not do

It is for the articles, not for your documents. Sharing something you converted is a different screen with different rules: private, a link anybody with it can open, or named addresses that each sign in. And nothing here publishes on your behalf — the link opens the network's own compose box, and the network asks you before anything is posted.

Related: [sharing a Markdown document as a link](/blog/share-a-markdown-document-as-a-link), and [turning assistant output into a page somebody can open](/blog/ai-output-to-a-shareable-page).`,
      },
      de: {
        title: 'Einen Artikel teilen',
        summary: `X, LinkedIn und Reddit, unter dem Text statt darüber — geteilt wird ein Artikel, den man gelesen hat.`,
        description:
          'Drei einfache Links am Fuß jedes Artikels auf TransformPipe: X, LinkedIn und Reddit, ohne Skript eines Dritten, das den Leser beobachtet.',
        keywords:
          'artikel teilen button, share buttons ohne tracking, teilen links im blog einbauen, artikel auf linkedin teilen, link bei reddit einreichen',
        body: `Jeder Artikel hier endet mit drei Links: X, LinkedIn und Reddit. Jeder davon ist ein gewöhnlicher Anker auf das Eingabefenster des jeweiligen Netzwerks, in dem die Adresse des Artikels und seine Überschrift schon stehen, und jeder öffnet einen neuen Tab, damit ein halb gelesener Artikel nicht dahinter verschwindet.

### Warum Links und keine Schaltflächen

Alle drei Netzwerke bieten ein Skript an, das seine eigene Schaltfläche zeichnet, mitzählt und jeden sieht, der die Seite lädt, auf der es sitzt. Diese Seite behauptet, dass ein Dokument, das Sie konvertieren, nirgendwohin geschickt wird — und eine Seite, die darunter still drei Zähldienste lädt, würde diese Behauptung mit gekreuzten Fingern aufstellen. Ein einfacher Anker leistet dasselbe: Es läuft nichts, bevor der Leser klickt, und nach draußen geht nur die Anfrage, um die er gebeten hat.

Die Namen stehen als Wörter da, statt gezeichnet zu sein, und der Grund ist banal. Der Symbolsatz dieser Seite hat ein LinkedIn-Zeichen und den alten Twitter-Vogel, aber kein X und kein Reddit — ein Vogel neben einem echten Logo neben einem ungefähren Snoo sieht nach drei verschiedenen Entscheidungen aus, drei Wörter nach einer.

### Was es nicht tut

Es gilt für die Artikel, nicht für Ihre Dokumente. Etwas zu teilen, das Sie konvertiert haben, ist ein anderer Dialog mit anderen Regeln: privat, ein Link für alle, die ihn haben, oder benannte Adressen, die sich jeweils anmelden. Und hier wird nichts in Ihrem Namen veröffentlicht — der Link öffnet das Eingabefenster des Netzwerks, und das Netzwerk fragt Sie, bevor etwas erscheint.

Weiter: [ein Markdown-Dokument als Link teilen](/blog/share-a-markdown-document-as-a-link) und [KI-Ausgabe als Seite, die jemand öffnen kann](/blog/ai-output-to-a-shareable-page).`,
      },
    },
    body: 'X, LinkedIn and Reddit, under the prose rather than above it — somebody shares an ' +
      'article they have read.',
  },
  {
    date: '2026-09-09',
    version: '2.0.0',
    title: 'TransformPipe, and four conversions',
    slug: 'transformpipe-2-0',
    detail: {
      en: {
        description:
          'Version 2.0.0 renamed M2H to TransformPipe and added four ways in — HTML, Word, CSV and TSV, and JSON — each conversion at an address of its own.',
        keywords:
          'transformpipe 2.0.0, m2h renamed transformpipe, convert word csv json to markdown, json to markdown table, markdown converter release notes',
        body: `Version 2.0.0 is where the product got the name it has now. Until then it was M2H, which did one thing: Markdown in, HTML out. The name was accurate and it was also a ceiling — a converter called M2H cannot grow a Word reader without lying about itself.

### Four ways in

Markdown had been the only thing the app would accept. From 2.0.0 it also reads HTML, a \`.docx\`, a \`.csv\` or \`.tsv\`, and JSON, and each of those becomes Markdown — which then becomes any of the things the converter could already hand back.

JSON is the one that needed a decision. There is no single correct rendering of arbitrary JSON, so the converter picks one per shape: an array of flat objects becomes a table, an array of scalars a list, an object a heading per nested key, and anything nested past three levels a fenced code block, because a heading at depth seven is not a heading.

### Why each conversion has an address

\`/word-to-markdown\`, \`/csv-to-markdown\`, \`/json-to-markdown\` — pages, not tabs on one screen. "Word to markdown" is a thing people type into a search box, and a page that answers exactly that question is more use than a general converter that could also do it. The conversion you land on is the one already selected.

### Also in this release

An assistant can act on an account through a connector, with no API key pasted into a chat window. The blog went from twenty articles to fifty-six, each with a cover the build refuses to ship without. And the blog stopped being handed to everybody who opened the converter — 952 kB of Markdown had been sitting in the main bundle.

### Where it went next

Ten conversions now, not five: plain text, Excel, a Notion or Confluence export and a zipped Obsidian vault followed. Conversion moved out of the account and into the browser entirely, an API endpoint lays a saved document out as a PDF, and the same converters run in a browser extension and in an installable app. This release was the turn, not the destination.

Related: [JSON into a Markdown table](/blog/convert-json-to-markdown-table), and [converting documents from an assistant](/blog/converting-documents-from-an-assistant).`,
      },
      de: {
        title: 'TransformPipe, und vier Konvertierungen',
        summary: `Die Umbenennung, unter transformpipe.com, und vier Formate hinein statt einem: HTML, Word, CSV und TSV sowie JSON. Jede Konvertierung hat eine eigene Adresse, denn „word to markdown" ist etwas, das Menschen in ein Suchfeld tippen.

JSON wird je nach Gestalt gerendert statt nach einer Regel für alles — ein Array flacher Objekte wird eine Tabelle, ein Array von Skalaren eine Liste, ein Objekt eine Überschrift pro verschachteltem Schlüssel, und alles jenseits von drei Ebenen ein eingezäunter Block, denn eine Überschrift in Tiefe sieben ist keine Überschrift.

Außerdem: Ein Assistent kann über einen Konnektor auf einem Konto arbeiten, ohne dass irgendwo ein API-Schlüssel eingefügt wird; sechsundfünfzig Artikel statt zwanzig, jeder mit einem Titelbild, ohne das der Build nicht ausliefert; und das Blog wird nicht mehr an alle geschickt, die den Konverter öffnen — es waren 952 kB Markdown im Haupt-Bundle.`,
        description:
          'Version 2.0.0 machte aus M2H TransformPipe und brachte vier Formate hinein: HTML, Word, CSV und TSV sowie JSON, jedes unter einer eigenen Adresse.',
        keywords:
          'transformpipe 2.0.0, m2h heißt jetzt transformpipe, word csv json in markdown umwandeln, json in markdown tabelle, versionshinweise markdown konverter',
        body: `Mit Version 2.0.0 bekam das Produkt den Namen, den es heute trägt. Davor hieß es M2H und tat eine Sache: Markdown hinein, HTML hinaus. Der Name war zutreffend und war zugleich eine Decke — ein Konverter, der M2H heißt, kann keinen Word-Leser bekommen, ohne über sich selbst zu lügen.

### Vier Wege hinein

Markdown war bis dahin das Einzige, was die App annahm. Ab 2.0.0 liest sie außerdem HTML, eine \`.docx\`, eine \`.csv\` oder \`.tsv\` und JSON, und aus jedem davon wird Markdown — und daraus dann jedes Format, das der Konverter ohnehin schon zurückgeben konnte.

JSON war der Fall, der eine Entscheidung brauchte. Für beliebiges JSON gibt es keine einzig richtige Darstellung, also wählt der Konverter eine je nach Gestalt: Ein Array flacher Objekte wird eine Tabelle, ein Array von Skalaren eine Liste, ein Objekt eine Überschrift pro verschachteltem Schlüssel, und alles, was tiefer als drei Ebenen verschachtelt ist, ein eingezäunter Codeblock — denn eine Überschrift in Tiefe sieben ist keine Überschrift.

### Warum jede Konvertierung eine Adresse hat

\`/word-to-markdown\`, \`/csv-to-markdown\`, \`/json-to-markdown\` — Seiten, keine Reiter auf einem Bildschirm. „Word to markdown" ist etwas, das Menschen in ein Suchfeld tippen, und eine Seite, die genau diese Frage beantwortet, nützt mehr als ein allgemeiner Konverter, der es auch könnte. Die Konvertierung, auf der Sie ankommen, ist schon ausgewählt.

### Ebenfalls in dieser Version

Ein Assistent kann über einen Konnektor auf einem Konto arbeiten, ohne dass irgendwo in einem Chatfenster ein API-Schlüssel eingefügt wird. Das Blog wuchs von zwanzig auf sechsundfünfzig Artikel, jeder mit einem Titelbild, ohne das der Build nichts ausliefert. Und das Blog wird nicht mehr an jeden geschickt, der den Konverter öffnet — 952 kB Markdown hatten im Haupt-Bundle gelegen.

### Wie es weiterging

Heute sind es zehn Konvertierungen, nicht fünf: reiner Text, Excel, ein Notion- oder Confluence-Export und ein gezippter Obsidian-Tresor kamen dazu. Die Konvertierung zog ganz aus dem Konto in den Browser, ein API-Endpunkt setzt ein gespeichertes Dokument als PDF, und dieselben Konverter laufen in einer Browser-Erweiterung und in einer installierbaren App. Diese Version war die Wende, nicht das Ziel.

Weiter: [JSON in eine Markdown-Tabelle](/blog/convert-json-to-markdown-table) und [Dokumente aus einem Assistenten heraus konvertieren](/blog/converting-documents-from-an-assistant).`,
      },
    },
    body:
      'The rename, at transformpipe.com, and four formats in rather than one: HTML, Word, CSV ' +
      'and TSV, and JSON. Each conversion has an address of its own, because "word to markdown" ' +
      'is a thing people type into a search box.\n\n' +
      'JSON picks a rendering per shape rather than one rule for everything — an array of flat ' +
      'objects becomes a table, an array of scalars a list, an object a heading per nested key, ' +
      'and anything past three levels a fenced block, because a heading at depth seven is not a ' +
      'heading.\n\n' +
      'Also: an assistant can act on an account through a connector that needs no API key ' +
      'pasted anywhere; fifty-six articles, up from twenty, each with a cover the build refuses ' +
      'to ship without; and the blog stopped being sent to everybody who opened the converter, ' +
      'which had been 952 kB of Markdown in the main bundle.',
  },
  {
    date: '2026-09-08',
    version: '1.1.0',
    title: 'A blog, and real HTML for every page',
    slug: 'prerendered-pages',
    detail: {
      en: {
        description:
          'Version 1.1.0 gave every address real prerendered HTML with its own title, description and structured data, and opened the blog with twenty articles.',
        keywords:
          'transformpipe 1.1.0, prerendered html for a single page app, sitemap and robots txt, self-contained html download, seo for a javascript app',
        body: `Before this release the site was one JavaScript bundle behind one HTML file. Every address served that same file, so every address had the same title and the same description: a crawler, a link preview, or a reader with scripts switched off got the shell and nothing in it.

### Real HTML for every address

Each page a stranger can arrive on is now written out as a file of its own, with its own title, description, canonical link and structured data, plus a \`sitemap.xml\` and a \`robots.txt\` that were simply absent before. The app still takes over once it loads; what changed is what arrives first.

### Twenty articles

The blog opened with twenty articles at \`/blog\`, written as Markdown and rendered by the converter the site is for. That was deliberate and still is: a change that breaks the renderer breaks these pages before it breaks somebody's document, which is a better place to find out.

The FAQ arrived with it — under the dropzone and again in the documentation, read from one list, so the two cannot drift apart.

### The download stopped needing a network

The \`.html\` a conversion hands back was meant to stand on its own and did not quite: it linked its typeface from Google Fonts. A file that phones out in order to render is not a file you can archive, mail to somebody behind a firewall, or read on a plane. Everything is inside it now, including the font.

### Where it went next

The prerenderer writes every page in five languages, the blog stands at sixty-three articles in English, German and French, and the changelog you came from is prerendered off the same typed list — this page with it. The counts have grown; the rule has not changed.

Related: [what self-contained HTML means](/blog/self-contained-html-explained), and [a static site generator or a converter](/blog/static-site-generator-or-converter).`,
      },
      de: {
        title: 'Ein Blog, und echtes HTML für jede Seite',
        summary: `Zwanzig Artikel unter \`/blog\`, gerendert von dem Konverter, den sie beschreiben. Ein FAQ unter der Ablagefläche und noch einmal in der Dokumentation, aus einer Liste.

Jede Seite, auf der ein Fremder landet, ist jetzt eine echte Datei mit eigenem Titel, eigener Beschreibung, kanonischem Link und strukturierten Daten, dazu \`sitemap.xml\` und \`robots.txt\`. Und die heruntergeladene \`.html\` wurde wirklich eigenständig — sie hatte ihre Schrift bis dahin von Google Fonts geladen.`,
        description:
          'Version 1.1.0 gab jeder Adresse echtes, vorgerendertes HTML mit eigenem Titel und eigener Beschreibung — und eröffnete das Blog mit zwanzig Artikeln.',
        keywords:
          'transformpipe 1.1.0, vorgerendertes html single page app, sitemap und robots txt, eigenständige html datei herunterladen, seo für javascript app',
        body: `Vor dieser Version war die Seite ein JavaScript-Bündel hinter einer einzigen HTML-Datei. Jede Adresse lieferte dieselbe Datei aus, also hatte jede Adresse denselben Titel und dieselbe Beschreibung: Ein Crawler, eine Link-Vorschau oder ein Leser mit abgeschalteten Skripten bekam die Hülle und nichts darin.

### Echtes HTML für jede Adresse

Jede Seite, auf der ein Fremder ankommen kann, wird jetzt als eigene Datei geschrieben — mit eigenem Titel, eigener Beschreibung, kanonischem Link und strukturierten Daten, dazu eine \`sitemap.xml\` und eine \`robots.txt\`, die vorher einfach fehlten. Die App übernimmt weiterhin, sobald sie geladen ist; geändert hat sich, was vorher ankommt.

### Zwanzig Artikel

Das Blog begann mit zwanzig Artikeln unter \`/blog\`, als Markdown geschrieben und von dem Konverter gerendert, um den es auf dieser Seite geht. Das war Absicht und ist es weiterhin: Eine Änderung, die den Renderer beschädigt, beschädigt diese Seiten, bevor sie das Dokument eines Menschen beschädigt — und das ist der bessere Ort, um davon zu erfahren.

Das FAQ kam mit: unter der Ablagefläche und noch einmal in der Dokumentation, aus einer einzigen Liste gelesen, damit die beiden nicht auseinanderlaufen können.

### Der Download brauchte kein Netz mehr

Die \`.html\`, die eine Konvertierung zurückgibt, sollte für sich stehen und tat es nicht ganz: Sie lud ihre Schrift von Google Fonts. Eine Datei, die zum Anzeigen nach draußen telefoniert, ist keine Datei, die man archivieren, an jemanden hinter einer Firewall schicken oder im Flugzeug lesen kann. Jetzt steckt alles darin, die Schrift eingeschlossen.

### Wie es weiterging

Der Prerenderer schreibt jede Seite in fünf Sprachen, das Blog steht bei dreiundsechzig Artikeln auf Englisch, Deutsch und Französisch, und das Changelog, aus dem Sie kommen, wird aus derselben getippten Liste vorgerendert — diese Seite mit ihm. Die Zahlen sind gewachsen; die Regel ist dieselbe.

Weiter: [was eigenständiges HTML bedeutet](/blog/self-contained-html-explained) und [Static-Site-Generator oder Konverter](/blog/static-site-generator-or-converter).`,
      },
    },
    body:
      'Twenty articles at `/blog`, rendered by the converter they describe. An FAQ under the ' +
      'dropzone and again in the documentation, from one list.\n\n' +
      'Every page a stranger arrives on is now a real file with its own title, description, ' +
      'canonical link and structured data, plus `sitemap.xml` and `robots.txt`. And the ' +
      'downloaded `.html` became genuinely self-contained — it used to link its typeface from ' +
      'Google Fonts.',
  },
  {
    date: '2026-09-08',
    version: '1.0.0',
    title: 'Markdown in, a document out',
    slug: 'markdown-in-a-document-out',
    detail: {
      en: {
        description:
          'Version 1.0.0, the first release: Markdown to HTML with a preview and a download, an account with a history, sharing by link, and an API, a CLI and an Action.',
        keywords:
          'transformpipe 1.0.0, m2h first release, markdown to html converter with preview, markdown converter api and cli, github action markdown to html',
        body: `The first tag, under the product's first name: M2H, a Markdown-to-HTML converter. One direction, one format in, one format out — and, unusually for a first release, an API, a CLI and a GitHub Action on the same day.

### What it did

Drop a Markdown file and get three things: a preview of the document, the HTML source behind it, and a download of one \`.html\` file meant to stand on its own — it still linked its typeface from Google Fonts, which 1.1.0 fixed. An account kept a history that followed you between machines, and a document could be shared by link or with named addresses, who got a read-only page rather than the converter.

### Why a script could use it from the start

A public API with revocable keys and quotas, a CLI with no dependencies, and a GitHub Action that comments rendered links on a pull request. A converter is a thing people reach for repeatedly — the second time you convert a release note by hand you want the build to do it — so the machine-readable way in was not left for later.

The documentation at \`/docs\` shipped with it, its screenshots captured from the running app rather than drawn, so they cannot quietly show an interface that no longer exists.

### What it did not do

Anything but Markdown. No Word, no CSV, no JSON, no HTML back into Markdown, no PDF, and no pasting — it wanted a file. Converting also put the result on your account, because the history was the point; that is the part of this release that has since been undone, and a conversion now stays in your browser until you press Save.

### Where it went next

1.1.0 brought the blog and real HTML for every page; 2.0.0 brought the name and four more formats in. Today it reads ten, converts entirely in the browser, and the same converters run in a browser extension, in an installable app, and behind a connector an assistant can use.

Related: [what a Markdown to HTML converter is for](/blog/markdown-to-html-converter), and [converting documents with an API](/blog/converting-documents-with-an-api).`,
      },
      de: {
        title: 'Markdown rein, ein Dokument raus',
        summary: `Die erste Veröffentlichung. Ein Konverter mit Vorschau, einer Ansicht des HTML-Quelltexts und einem eigenständigen Download; Konten und ein Verlauf über Geräte hinweg; Teilen per Link oder per Adresse, mit einer Seite nur zum Lesen.

Eine öffentliche API mit widerrufbaren Schlüsseln und Kontingenten, ein CLI ohne Abhängigkeiten und eine GitHub Action, die gerenderte Links an einen Pull Request kommentiert. Dokumentation unter \`/docs\`, mit Screenshots aus der laufenden App.`,
        description:
          'Version 1.0.0, die erste Veröffentlichung: Markdown zu HTML mit Vorschau, ein Konto mit Verlauf, Teilen per Link und dazu API, CLI und GitHub Action.',
        keywords:
          'transformpipe 1.0.0, m2h erste version, markdown zu html konverter mit vorschau, markdown konverter api und cli, github action markdown zu html',
        body: `Der erste Tag, unter dem ersten Namen des Produkts: M2H, ein Konverter von Markdown nach HTML. Eine Richtung, ein Format hinein, ein Format hinaus — und, für eine erste Veröffentlichung ungewöhnlich, am selben Tag eine API, ein CLI und eine GitHub Action.

### Was es konnte

Eine Markdown-Datei ablegen und drei Dinge bekommen: eine Vorschau des Dokuments, den HTML-Quelltext dahinter und den Download einer \`.html\`-Datei, die für sich stehen sollte — sie lud ihre Schrift noch von Google Fonts, was 1.1.0 behoben hat. Ein Konto führte einen Verlauf, der zwischen Rechnern mitkam, und ein Dokument ließ sich per Link oder an benannte Adressen teilen, die eine Seite nur zum Lesen bekamen statt des Konverters.

### Warum ein Skript es von Anfang an benutzen konnte

Eine öffentliche API mit widerrufbaren Schlüsseln und Kontingenten, ein CLI ohne Abhängigkeiten und eine GitHub Action, die gerenderte Links an einen Pull Request kommentiert. Ein Konverter ist etwas, zu dem man immer wieder greift — beim zweiten von Hand konvertierten Änderungshinweis möchten Sie, dass der Build es tut —, also blieb der maschinenlesbare Weg hinein nicht für später liegen.

Die Dokumentation unter \`/docs\` kam mit, ihre Screenshots aus der laufenden App aufgenommen statt gezeichnet, damit sie nicht unbemerkt eine Oberfläche zeigen können, die es nicht mehr gibt.

### Was es nicht konnte

Alles außer Markdown. Kein Word, kein CSV, kein JSON, kein HTML zurück nach Markdown, kein PDF und kein Einfügen — es wollte eine Datei. Und eine Konvertierung legte ihr Ergebnis auf das Konto, denn der Verlauf war der Sinn der Sache; das ist der Teil dieser Version, der seither zurückgenommen wurde: Eine Konvertierung bleibt jetzt in Ihrem Browser, bis Sie speichern.

### Wie es weiterging

1.1.0 brachte das Blog und echtes HTML für jede Seite, 2.0.0 den Namen und vier weitere Formate hinein. Heute liest es zehn, konvertiert vollständig im Browser, und dieselben Konverter laufen in einer Browser-Erweiterung, in einer installierbaren App und hinter einem Konnektor, den ein Assistent benutzen kann.

Weiter: [wozu ein Markdown-nach-HTML-Konverter da ist](/blog/markdown-to-html-converter) und [Dokumente über eine API konvertieren](/blog/converting-documents-with-an-api).`,
      },
    },
    body:
      'The first release. A converter with a preview, an HTML source view and a self-contained ' +
      'download; accounts and history across devices; sharing by link or by address, with a ' +
      'read-only page.\n\n' +
      'A public API with revocable keys and quotas, a dependency-free CLI, and a GitHub Action ' +
      'that comments rendered links on a pull request. Documentation at `/docs`, with ' +
      'screenshots captured from the running app.',
  },
];

/**
 * Newest first, sorted here rather than trusted from the list above.
 *
 * An entry added in the wrong place is the likeliest edit to this file, and it would put a March
 * change above a September one with nothing failing.
 */
export const CHANGELOG: ChangelogEntry[] = [...ENTRIES].sort((a, b) =>
  b.date.localeCompare(a.date)
);

/** The newest entry's date, for the sitemap. Real, unlike the deploy date. */
export const CHANGELOG_UPDATED = CHANGELOG[0].date;

export interface ChangelogMonth {
  /** `YYYY-MM`, which is what `formatMonth` turns into the reader's words. */
  key: string;
  entries: ChangelogEntry[];
}

export interface ChangelogYear {
  year: string;
  months: ChangelogMonth[];
}

/**
 * The entries as a year of months of entries, newest first at every level.
 *
 * Grouping here rather than in the page, because the prerenderer needs the same shape and the two
 * must not disagree about which month an entry falls in. Both take it from this.
 *
 * A year holds one month today and the page is built for the year it holds three: the grouping is
 * what makes a changelog readable once it is longer than a screen, and adding it later would mean
 * restructuring a page somebody had already learned.
 */
export function changelogByYear(): ChangelogYear[] {
  const years: ChangelogYear[] = [];

  for (const entry of CHANGELOG) {
    const year = entry.date.slice(0, 4);
    const key = entry.date.slice(0, 7);

    let holding = years.find((one) => one.year === year);

    if (!holding) {
      holding = { year, months: [] };
      years.push(holding);
    }

    let month = holding.months.find((one) => one.key === key);

    if (!month) {
      month = { key, entries: [] };
      holding.months.push(month);
    }

    month.entries.push(entry);
  }

  return years;
}

/** Every year with an entry in it, newest first — what a year navigation is built from. */
export const CHANGELOG_YEARS: string[] = [
  ...new Set(CHANGELOG.map((entry) => entry.date.slice(0, 4))),
];

/** Every entry that has a page of its own, newest first. */
export const CHANGELOG_PAGES: ChangelogEntry[] = CHANGELOG.filter(
  (entry) => Boolean(entry.slug)
);

/**
 * One entry's page in the language asked for, falling back to English.
 *
 * The fallback is not a failure: the rule for this file is English, and a translation is the
 * exception somebody wrote on purpose. A reader in a language nobody has written yet gets the
 * English piece under a translated heading, which is what the changelog list already does.
 */
export function detailIn(
  detail: ChangelogDetail,
  locale: Locale
): ChangelogDetailText {
  return detail[locale] ?? detail.en;
}

/** One entry by its slug, for the router and the page. */
export function changelogEntryBySlug(
  slug: string
): ChangelogEntry | undefined {
  return CHANGELOG_PAGES.find((entry) => entry.slug === slug);
}

/**
 * What is wrong with the entries, as sentences, or nothing.
 *
 * Called by the prerenderer, so a bad entry fails the build rather than shipping a page with an
 * empty body or two entries at the same address. The rules are the blog's, for the same reasons:
 * a description a search result can show whole, a body that is not endless, and one page per URL.
 */
export function changelogProblems(): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const entry of CHANGELOG) {
    const where = `${entry.date} "${entry.title}"`;

    if (!entry.slug) {
      if (entry.detail) {
        problems.push(`${where}: has a detail but no slug, so nothing can reach it`);
      }

      continue;
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.slug)) {
      problems.push(`${where}: slug "${entry.slug}" is not kebab-case`);
    }

    if (seen.has(entry.slug)) {
      problems.push(`${where}: slug "${entry.slug}" is used twice`);
    }

    seen.add(entry.slug);

    if (!entry.detail) {
      problems.push(`${where}: has a slug and no detail`);

      continue;
    }

    for (const [language, text] of Object.entries(entry.detail)) {
      const said = `${where} [${language}]`;

      if (!text.body.trim()) {
        problems.push(`${said}: empty body`);
      }

      if (text.body.length > DETAIL_LIMIT) {
        problems.push(
          `${said}: body is ${text.body.length} characters, over ${DETAIL_LIMIT}`
        );
      }

      /* The page supplies the h1, so a heading in the body would be a second one. */
      if (/^#\s/m.test(text.body)) {
        problems.push(`${said}: body has a top-level heading of its own`);
      }

      const length = text.description.length;

      if (length < 100 || length > 165) {
        problems.push(`${said}: description is ${length} characters, want 100-165`);
      }

      if (text.keywords.split(',').filter((one) => one.trim()).length < 4) {
        problems.push(`${said}: keywords should be at least four phrases`);
      }
    }
  }

  return problems;
}
