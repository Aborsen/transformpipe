---
title: "Wie Sie einen Markdown-Konverter in fünf Minuten beurteilen"
description: "Schreiben Sie auf, was Ihre Situation verlangt, dann testen Sie ein unbequemes Dokument an den Kandidaten. Sieben Prüfungen und ein Bewertungsbogen."
date: 2026-06-23
tag: Konvertieren
keywords: bester markdown zu html konverter, markdown konverter vergleich, markdown editor online, kostenloses markdown tool, markdown konverter ohne anmeldung, markdown konverter mit api, open source markdown konverter, markdown konverter testen, markdown konverter anforderungen
---

Landingpages von Konvertern versprechen weitgehend dasselbe: schnell, kostenlos, sauberes HTML. Nichts davon lässt sich von der Seite ablesen, und die Unterschiede, die Sie einen Nachmittag kosten, bleiben unsichtbar, bis Sie etwas einfügen. Also fügen Sie etwas ein. Ein Dokument und fünf Prüfungen trennen die Werkzeuge, die standhalten, von denen, die Sie eine Woche später überraschen.

### Kurzfassung

Schreiben Sie auf, was Ihre Situation verlangt, bevor Sie ein einziges Werkzeug öffnen: ein Dokument, das Sie an eine Person schicken, eine Dokumentationsseite, Nutzereingaben, die innerhalb einer Anwendung gerendert werden, ein CI-Schritt und ein Langzeitarchiv wollen unterschiedliche Dinge, und das Werkzeug, das für das eine richtig ist, ist für das nächste falsch. Lassen Sie dann ein absichtlich unbequemes Testdokument in derselben Sitzung durch jeden Kandidaten laufen, und lesen Sie die HTML-Quelle statt der Vorschau. Fünf Prüfungen — welchen Dialekt es spricht, was es mit einem Script-Tag macht, ob die Datei für sich allein steht, wohin Ihre Datei ging, und was die API und die Limits tatsächlich sagen — klären das meiste in etwa fünf Minuten. Zwei weitere, Drucken und Überschriften-Ids, brauchen je dreißig Sekunden und fangen die Beschwerden ab, die einen Monat später eintreffen.

Der Grund, warum Feature-Listen nicht helfen, ist, dass jede Feature-Liste eines Konverters dieselbe Liste ist. Tabellen, Code-Hervorhebung, Live-Vorschau, Export. Was sie unterscheidet, ist das Verhalten unter Druck: eine Datei mit etwas, das der Parser noch nie gesehen hat, eine Datei, die jemand anderes geschrieben hat, eine Datei, die auf einer Maschine ohne Netzwerk geöffnet werden muss. Nichts davon steht auf der Seite, und nichts davon ist teuer herauszufinden.

Dieser Text handelt von den Kriterien und dem Testen. Wenn Sie die Werkzeuge selbst gegeneinander aufgereiht sehen wollen, [der Vergleich ist ein eigener Artikel](/blog/best-markdown-to-html-converters); was folgt, ist die Methode, mit der Sie alles auf dieser Liste prüfen würden, einschließlich der Werkzeuge, die nach ihrer Veröffentlichung hinzugefügt wurden.

## Anforderungen zuerst: was Ihre Situation tatsächlich verlangt

Der häufigste Fehler ist nicht, das falsche Werkzeug zu wählen. Es ist, ein Werkzeug zu wählen, bevor entschieden ist, was wahr sein muss. Fünf Situationen decken fast alles ab, wofür Menschen Markdown konvertieren, und jede verlangt etwas, das die anderen völlig ignorieren können.

| Die Situation | Was Sie verlangen müssen | Was Sie gefahrlos ignorieren können | Die Prüfung, die es klärt |
| --- | --- | --- | --- |
| Ein Dokument an eine Person schicken | Eine vollständige HTML-Datei mit inline eingebetteten Styles und Bildern, ohne externe Anfragen, und im Dialekt, den Ihre Datei schon nutzt | Bereinigung, weil Sie die Datei selbst geschrieben haben; eine API; Stapelkonvertierung; Überschriften-Anker | Herunterladen, das Netzwerk ausschalten, auf einer anderen Maschine öffnen |
| Eine Dokumentationsseite | Stabile Überschriften-Ids, ein Dialekt, der zu dem passt, was Ihre Autoren tippen, ein Build, der unbeaufsichtigt läuft und laut scheitert | Eigenständige Ausgabe — die Seite liefert ihr eigenes Stylesheet — und Privatsphäre der Quelle, die ohnehin öffentlich ist | Zweimal aus derselben Eingabe bauen und die beiden HTML-Ausgaben diffen |
| Nutzereingaben innerhalb einer Anwendung rendern | Ein Sanitizer mit einer Allow-Liste, angewendet dort, wo der Nutzer nicht hinkommt, und ein dokumentierter Standard für rohes HTML | Eigenständige Dokumente, Druck-Styling, Download-Buttons, Themes | Die fünf Angriffsvektoren unten einfügen und das gerenderte DOM prüfen |
| Ein CI-Schritt | Keine Installation, oder eine gepinnte Installation; ein Exit-Code, der etwas bedeutet; veröffentlichte Ratenlimits; ein Fehlertext, den ein Skript parsen kann | Eine Benutzeroberfläche, Historie, Teilen, Editorkomfort | Eine fehlerhafte Datei einspeisen und Exit-Code und stderr lesen |
| Ein Archiv, das Sie in zehn Jahren öffnen müssen | Eine Datei pro Dokument, keine externen Assets, ein offenes Format, und eine Lizenz, die Ihnen erlaubt, das Werkzeug weiter zu betreiben | Eine API, Teilen, Geschwindigkeit, Cloud-Sync | Den Export von letztem Jahr heute öffnen, offline, in einem Browser, den Sie damals nicht benutzt haben |

Lesen Sie die zweite und dritte Spalte, und der Konflikt ist offensichtlich. Das Werkzeug, das die erste Zeile gewinnt — ein Konverter, der alles in eine schwere Datei einbettet — passt schlecht zur zweiten, wo dasselbe Stylesheet in vierhundert Seiten einzubetten Verschwendung ist. Das Werkzeug, das die dritte Zeile gewinnt, ist eine Bibliothek, keine Website, und es hat überhaupt keinen Export-Button, weil es nie dazu gedacht war, Ihnen eine Datei zu geben.

Die ersten fünf Minuten werden also nicht mit einem Werkzeug verbracht. Sie werden damit verbracht, drei Zeilen zu schreiben: was die Ausgabe sein muss, wer die Eingabe geschrieben hat, und wo die Konvertierung laufen muss. Alles danach ist Verifikation.

Eine weitere Unterscheidung lohnt sich, bevor Sie anfangen. Ein Konverter macht aus einem Dokument ein Dokument. Ein Generator macht aus einem Verzeichnis eine Website. Wenn Ihre Antwort auf „wohin geht die Ausgabe“ eine URL mit Navigation, Suche und Querverlinkung ist, kaufen Sie in der falschen Kategorie ein, und keine Menge Konverter-Tests wird das beheben.

## Das Testdokument

Das ist absichtlich unbequem. Es enthält GitHub Flavored Markdown, das reines CommonMark nicht kennt, fünf getrennte Wege, Script auf eine Seite zu schleusen, ein Bild, das nicht existiert, und eine Handvoll Konstrukte, die still einen sorgfältigen von einem nachlässigen Parser trennen.

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

Fügen Sie es ein, konvertieren Sie, und lesen Sie das Ergebnis — dann lesen Sie die HTML-Quelle, nicht nur die Vorschau. Eine Vorschau kann richtig aussehen, während die Datei dahinter ein Durcheinander ist, weil die Vorschau von der eigenen Seite des Werkzeugs gerendert wird, mit dem eigenen Stylesheet des Werkzeugs, in einem Browser, der bereits geladen hat, was auch immer das Werkzeug lädt.

Jede Zeile in diesem Dokument ist aus einem Grund da. Das ist, was jede prüft, und wie ein Bestehen aussieht.

| Die Zeile | Was sie prüft | Ein Bestehen sieht so aus |
| --- | --- | --- |
| Der `---`-Block oben | Umgang mit Front Matter | Er verschwindet, oder wird zu einer Tabelle. Ein Absatz mit `key: value`-Zeilen am Anfang Ihres Dokuments ist ein Fehlschlag |
| `# Converter test` | Ob das Werkzeug einen Titel annimmt | Entweder ein `<h1>` oder der Titel wandert in `<title>`. Beides ist vertretbar; ihn still fallen zu lassen nicht |
| Die Pipe-Tabelle | GFM-Tabellen | Eine echte `<table>` mit `<th>`-Zellen und ausgerichteter Mittelspalte |
| `- [x]` und `- [ ]` | GFM-Aufgabenlisten | `<input type="checkbox" disabled>` innerhalb von Listenelementen, keine wörtlichen Klammern |
| Das verschachtelte, träge fortgesetzte Element | Listen-Parsing unter Druck | Ein verschachteltes `<li>`, dessen Text weiterläuft. Zwei getrennte Listenelemente sind ein Fehlschlag |
| `~~Struck through~~` | GFM-Durchstreichung | Ein `<del>`- oder `<s>`-Element, keine sichtbaren Tilden |
| Die bloße URL | GFM-Autolinks | Ein `<a href>`. Reiner Text ist CommonMark-Verhalten, kein Fehler |
| Zwei nachgestellte Leerzeichen | Harte Zeilenumbrüche | Ein `<br>` zwischen den beiden Zeilen |
| `[^1]` und sein Körper | Fußnoten, die in keiner Spezifikation stehen | Ein hochgestellter Link und eine Liste am Fuß, oder das rohe `[^1]` sichtbar gelassen. Stilles Entfernen verliert Ihren Text |
| Der `js`-Zaun | Eingezäunter Code und Info-Strings | `<pre><code class="language-js">`, mit maskiertem Code |
| Die Überschrift mit `&` und Anführungszeichen | Maskierung, und Überschriften-Ids | `&amp;` in der Ausgabe, und idealerweise eine `id`, die Sie verlinken können |
| `<script>` | Rohes HTML durchreichen | Maskiert oder entfernt. Vorhanden und intakt ist ein Fehlschlag |
| Der `javascript:`-Href | URL-Schema-Filterung | Der `href` weg oder umgeschrieben. Ein lebendiger `javascript:`-Link ist ein Fehlschlag |
| `onerror=` an einem Bild | Attribut-Filterung | Das Attribut entfernt. Das Bild darf bleiben; der Handler nicht |
| `<iframe>` | Eingebettete Dokumente | Entfernt, oder maskiert. Ein Iframe in einem Dokument, das Sie mailen, ist die Seite von jemand anderem in Ihrer |
| `<svg onload>` | Der Vektor, den Leute vergessen | Das Element entfernt oder der Handler entfernt. SVG ist Markup, und Markup trägt Handler |
| Das kaputte Bild | Pfad-Behandlung | Das `src` unverändert durchgereicht, oder die Datei eingebettet. Beides ist in Ordnung, solange Sie wissen, welches |
| Der Gedankenstrich und die Ligatur | Kodierung | Beide Zeichen intakt, mit einem `<meta charset>` im Kopf. Mojibake hier heißt Mojibake überall |

Achtzehn Zeilen, ein Einfügen. Behalten Sie die Datei: Sie ist kurz, sie gehört neben Ihre Dokumentation, und sie erneut auszuführen dauert eine Minute, wenn ein Werkzeug seinen Sanitizer oder sein Stylesheet ändert.

## Prüfung eins: welchen Dialekt es spricht

Schauen Sie sich zuerst die Tabelle und die zwei Checkboxen an. Wenn die Tabelle als Absatz aus Pipe-Zeichen herauskam und die Boxen als wörtliche eckige Klammern, läuft der Konverter reines CommonMark oder etwas Ähnliches. Das ist kein Fehler: Tabellen und Aufgabenlisten sind GitHub-Flavored-Markdown-Erweiterungen, und [die Dialekte unterscheiden sich tatsächlich](/blog/commonmark-gfm-and-the-flavours) darin, was sie erkennen.

Es zählt nur, wenn Ihre Dokumente diese Funktionen nutzen. Ein README mit einer Vergleichstabelle und einer Checkliste für die Roadmap nutzt beide. Durchstreichung und die bloße URL sind ebenfalls GFM-Erweiterungen, prüfen Sie also alle vier in einem Durchgang.

Das sind die Konstrukte, die die beiden Dialekte trennen, und wie jeder Fehlschlag auf der Seite aussieht statt in der Spezifikation.

| Konstrukt | Geschrieben als | CommonMark | GFM | Was Sie sehen, wenn es fehlt |
| --- | --- | --- | --- | --- |
| Tabellen | Pipes und eine Trennzeile | Nein | Ja | Ein Absatz aus Pipes und Bindestrichen, vom Browser umgebrochen |
| Aufgabenlisten | `- [x]` am Anfang eines Elements | Nein | Ja | Wörtliches `[x]` und `[ ]` als erste Zeichen jedes Punkts |
| Durchstreichung | `~~text~~` | Nein | Ja | Sichtbare Tilden um die Wörter |
| Autolinks | Eine bloße `https://`-URL | Nein | Ja | Die URL als reiner, nicht klickbarer Text |
| Eingezäunter Code | Dreifache Backticks | Ja | Ja | Nichts — beide handhaben es |
| Info-Strings | Ein Sprachname nach dem Zaun | Ja | Ja | Die Klasse mag sich unterscheiden; prüfen Sie auf `language-js` |
| Fußnoten | `[^1]` und eine Definition | Nein | Nein | Rohes `[^1]` im Text, oder ein still fehlender Absatz |
| Überschriften-Ids | Nichts — sie werden abgeleitet | Nein | Vom Renderer hinzugefügt, nicht vom Parser | Überschriften ohne `id`, also ohne Anker |
| Rohes HTML | Ein HTML-Tag in der Quelle | Durchgereicht | Durchgereicht, von GitHub gefiltert | Hängt ganz vom Werkzeug ab; siehe die nächste Prüfung |
| Zeilenumbrüche | Zwei nachgestellte Leerzeichen | Ja | Ja | Beide Zeilen laufen zusammen, wenn das Werkzeug zuerst Leerraum trimmt |

Zwei Dinge fallen aus dieser Tabelle heraus. Fußnoten stehen in keiner Spezifikation, jedes Werkzeug, das sie unterstützt, tut das also als Erweiterung, und jedes Werkzeug, das es nicht tut, lässt vielleicht den Text fallen statt die Markierung stehen zu lassen — prüfen Sie Referenz und Körper getrennt. Und Überschriften-Ids sind überhaupt kein Parsing-Feature: GitHub fügt sie beim Rendern hinzu, weshalb ein Überschriften-Anker, der auf github.com funktioniert, im HTML Ihres Konverters schlicht nicht existieren kann.

Wenn Ihre Dokumente auf GitHub leben und dort korrekt rendern, ist GFM Ihre Anforderung, und ein reines CommonMark-Werkzeug verliert vier Dinge still. Wenn Ihre Dokumente Prosa mit Überschriften und Links sind, reicht reines CommonMark, und die Dialektfrage ist in zehn Sekunden geklärt.

## Prüfung zwei: was es mit dem Script-Tag macht

Markdown erlaubt rohes HTML, und die meisten Parser reichen es direkt an die Ausgabe weiter; einige maskieren es standardmäßig und lassen es nur auf Anfrage durch. So oder so ist Bereinigung eine separate Entscheidung, die das Werkzeug getroffen hat, mit drei möglichen Ergebnissen.

| Ergebnis in der HTML-Quelle | Was es bedeutet |
| --- | --- |
| `&lt;script&gt;` und das Tag sichtbar auf der Seite | Rohes HTML wird maskiert. Sicher, und in Ordnung für Ihre eigenen Dateien |
| Keine Spur von Script, `onerror`, oder dem `javascript:`-Href | Ein Sanitizer lief gegen eine Allow-Liste |
| `<script>` intakt, oder `onerror=` noch am Bild | Nichts hat gefiltert |

Das dritte Ergebnis beißt nur, wenn das Markdown von woanders als Ihrer eigenen Maschine kam — einer Pull-Request-Beschreibung, einem Support-Ticket, der Ausgabe eines Sprachmodells. Im Test ist die Alert-Box harmlos; mit dem Markdown eines Fremden ist sie es nicht, und sie läuft auf welcher Seite auch immer Sie das Ergebnis einfügen.

Begnügen Sie sich nicht damit, einen Vektor zu testen. Ein Werkzeug kann `<script>` entfernen und alles andere übersehen, weil ein Tag namentlich zu entfernen einfach ist und über Attribute und URL-Schemata nachzudenken nicht. Durchsuchen Sie die Ausgabe nach jedem dieser der Reihe nach.

| Vektor | Was passiert, wenn er überlebt | Was ein sicheres Werkzeug zurückgibt |
| --- | --- | --- |
| `<script>alert('script tag')</script>` | Führt beliebigen Code aus, sobald die Seite lädt | Das Element ganz weg, oder das Ganze zu `&lt;script&gt;`-Text maskiert |
| `<img src=x onerror="alert('handler')">` | Führt Code aus, wenn das absichtlich kaputte Bild scheitert, was sofort passiert | Das `<img>` darf bleiben; `onerror` ist entfernt. Jedes `on*`-Attribut ist ein Handler |
| `[A link](javascript:alert('href'))` | Führt Code aus, wenn die Leserin auf etwas klickt, das wie ein gewöhnlicher Link aussieht | Der `href` entfernt, geleert oder umgeschrieben. Erlaubte Schemata sind meist `http`, `https`, `mailto` und `#` |
| `<iframe src="https://example.com"></iframe>` | Lädt die Seite eines Dritten in Ihre, mit deren Scripts und Cookies | Das Element entfernt. Ein Iframe ist selten etwas, das ein Markdown-Dokument braucht |
| `<svg onload="alert('svg')">…</svg>` | Führt Code über Markup aus, von dem Leute vergessen, dass es Markup ist. SVG kann auch ein eigenes `<script>` tragen | Das Element entfernt, oder Handler und verschachteltes Script daraus entfernt |

Ein Werkzeug, das alle fünf entfernt, läuft mit einer Allow-Liste: Es behält die Elemente und Attribute, die es kennt, und verwirft alles andere. Ein Werkzeug, das manche entfernt und andere nicht, läuft mit einer Deny-Liste, was eine verlorene Position ist — die Liste gefährlicher Dinge wächst, die Liste sicherer Dinge nicht. [Die Details, das richtig zu machen](/blog/sanitising-markdown-safely) zählen, selbst wenn Sie nie selbst einen Sanitizer schreiben, weil sie Ihnen sagen, welche der beiden Sie vor sich haben.

Noch etwas, das Sie prüfen sollten, solange Sie dabei sind: wo die Bereinigung passiert. Ein Konverter, der im Browser bereinigt und nicht auf dem Server, hat nur seine eigene Vorschau geschützt und sonst nichts, weil ein Script direkt an den Endpunkt posten und die Seite umgehen kann. Wenn das Werkzeug eine API hat, führen Sie dieselben Vektoren dagegen aus und vergleichen Sie die beiden Ausgaben.

## Prüfung drei: ob die Ausgabe für sich allein steht

Laden Sie die Datei herunter, schalten Sie Ihr Netzwerk aus, und öffnen Sie sie. Durchsuchen Sie dann die Quelle nach `<link`, `<script` und `http`.

Ein bloßes Fragment gibt Ihnen `<h1>` und `<p>` und sonst nichts: korrektes HTML, öffnet sich als ungestylter Text. Ein vollständiges Dokument, das sein Stylesheet oder seinen Hervorheber von einem CDN zieht, sieht heute richtig aus und geht kaputt im Flugzeug, in einem Intranet, oder wenn das CDN umzieht. Eine eigenständige Datei hat ihre Styles inline, keine Scripts und keine Anfragen. Das ist die, die Sie jemandem mailen können.

Die Suchen lohnen sich einzeln, weil jede eine andere Frage beantwortet.

| Suchen Sie die Quelle nach | Wenn Sie es finden | Was es Sie kostet |
| --- | --- | --- |
| `<!DOCTYPE` | Gut — das ist ein Dokument, kein Fragment | Ohne es haben Sie `<h1>…</h1><p>…</p>` und ein Browser, der bei seiner Standardbreite rendert |
| `<meta charset` | Gut — die Kodierung ist deklariert | Ohne es werden der Gedankenstrich und die Ligatur auf der Maschine von jemand anderem zu Mojibake |
| `<link rel="stylesheet"` | Die Styles leben woanders | Die Datei ist unstyled, sobald dieses Woanders unerreichbar ist |
| `<style>` | Gut — die Styles sind in der Datei | Nichts; das ist, was Sie für ein Dokument wollen, das Sie verschicken |
| `<script` | Etwas will laufen | Bestenfalls ein Hervorheber, schlimmstenfalls ein Tracker. So oder so ist die Datei nicht mehr träge |
| `http://` oder `https://` in einem `src` oder `href` | Ein Asset wird beim Öffnen der Datei geladen | Schriften, Bilder und Hervorheber, die offline verschwinden, und ein Protokoll darüber, dass die Datei geöffnet wurde |
| `data:image` | Ein Bild ist in die Datei eingebettet | Eine größere Datei, die aber überall öffnet. Das ist meist der Tausch, den Sie wollen |

[Was „eigenständig“ tatsächlich bedeutet](/blog/self-contained-html-explained) lohnt sich zu lesen, bevor Sie es verlangen, denn Werkzeuge nutzen die Formulierung locker: manche meinen „ein vollständiges Dokument“, manche meinen „fragt das Netzwerk um nichts“, und nur die zweite Bedeutung übersteht das Flugzeug.

Das fehlende Bild ist im Test aus demselben Grund. Ein Konverter reicht ein Bild-`src` unverändert durch, außer Sie bitten ihn, die Datei einzubetten, sodass ein relativer Pfad gegen den Ort aufgelöst wird, an dem das HTML landet, nicht dort, wo das Markdown lebte. Verschieben Sie das HTML ein Verzeichnis nach oben, und jedes relative Bild geht kaputt — ohne Fehler, ohne Warnung, und meist ohne dass es jemand bemerkt, bis der Empfänger es erwähnt.

## Prüfung vier: wohin Ihre Datei geht, und ob sie dort bleibt

Öffnen Sie den Network-Tab des Browsers, bevor Sie konvertieren. Entweder wird die Datei hochgeladen oder nicht, und die Anfragenliste klärt das. Konvertierung im Browser bedeutet, das Dokument verlässt nie Ihre Maschine; es bedeutet auch, es gibt morgen nichts, worauf man zurückkommen könnte.

Das ist die Prüfung, die es am meisten lohnt selbst durchzuführen statt zu vertrauen, weil es die eine ist, bei der jedes Werkzeug dieselbe Behauptung aufstellt. Vier Schritte, in Reihenfolge, keiner länger als eine Minute.

1. **Beobachten Sie den Network-Tab.** Öffnen Sie ihn, leeren Sie ihn, konvertieren Sie das Testdokument, und lesen Sie die Liste. Eine Konvertierung, die auf Ihrer Maschine passiert, zeigt keine Anfrage, die Ihre Datei trägt. Eine Konvertierung, die hochlädt, zeigt ein `POST` mit Ihrem Inhalt darin, und Sie können diese Anfrage öffnen und genau lesen, was gesendet wurde.
2. **Konvertieren Sie mit ausgeschaltetem Netzwerk.** Laden Sie die Seite, trennen Sie dann die Verbindung, dann konvertieren Sie. Ein browserseitiges Werkzeug funktioniert weiter. Ein serverseitiges Werkzeug scheitert, was keine Kritik ist — es ist eine Antwort, und eine eindeutige.
3. **Finden Sie den Aufbewahrungssatz.** Nicht die Marketingzeile über Privatsphäre: den Satz, der sagt, wie lange eine hochgeladene Datei aufbewahrt wird und was sie löscht. Wenn die Datenschutzerklärung keine Dauer enthält, ist die ehrliche Lesart, dass es keine Richtlinie gibt.
4. **Lesen Sie die AGB nach der Lizenzklausel.** Viele gehostete Werkzeuge nehmen sich eine Lizenz, das zu speichern und zu verarbeiten, was Sie hochladen, was sie brauchen, um überhaupt zu funktionieren. Was zählt, ist der Umfang: ob sie endet, wenn Sie die Datei löschen, und ob sie über den bloßen Betrieb des Dienstes hinausgeht.

[Ob ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe) hat für jedes gegebene Werkzeug eine echte Antwort, und die ist meist in fünfzehn Minuten Lesezeit plus den beiden Tests oben sichtbar.

Das ist der eigentliche Zielkonflikt, nicht Privatsphäre gegen Bequemlichkeit. Ein Werkzeug ohne Konto kann keine Historie führen, kann Ihnen keinen Link zum Verschicken geben, und kann keine API anbieten. Ein Werkzeug mit Konto tut alle drei und hält jetzt Ihre Dokumente. Wenn die Antwort „keines von beidem, ich will das in einem Skript“ ist, hören Sie auf, Websites zu bewerten, und nutzen Sie eine Bibliothek oder einen Kommandozeilen-Konverter; und wenn Sie PDF, DOCX oder LaTeX am anderen Ende brauchen, konvertiert Pandoc zu allen dreien und ist freie Software unter der GPL (geprüft auf pandoc.org, 9. September 2026); ein Browser-Konverter, der Ihnen eine HTML-Datei gibt, konkurriert nicht um diesen Job.

Es gibt eine Zwischenposition, die es wert ist, gekannt zu werden: ein Werkzeug, das im Browser konvertiert, während Sie abgemeldet sind, und Dokumente nur speichert, wenn Sie danach fragen. Es gibt Ihnen standardmäßig die Network-Tab-Antwort, und Historie und Teilen, wenn Sie entscheiden, dass sich der Tausch lohnt. Der Punkt ist, dass die Entscheidung Ihre ist und sichtbar ist, statt für Sie in einem Absatz getroffen zu werden, den Sie nicht gelesen haben.

## Prüfung fünf: die API, die Schlüssel und die Limits

Wenn ein Konverter eine API anbietet, klären vier Fragen die Sache, und die Dokumentation sollte alle vier beantworten, bevor Sie sich anmelden:

- [ ] Kann ein Schlüssel widerrufen werden, und wirkt der Widerruf sofort?
- [ ] Wird der Schlüssel gehasht gespeichert, oder könnte der Support ihn Ihnen zurücklesen?
- [ ] Was ist das Ratenlimit, und wie sieht die Antwort aus, wenn Sie es überschreiten?
- [ ] Was passiert, wenn das Konto voll ist — ein verweigerter Schreibvorgang, oder ein stilles Löschen von etwas Älterem?

Die letzte ist die, die Leute überspringen. Ein Werkzeug, das Ihr ältestes Dokument fallen lässt, um Platz für das neue zu machen, hat etwas über Ihre Daten entschieden, und Sie erfahren es im schlimmsten Moment. Den Schreibvorgang zu verweigern ist das ehrliche Verhalten.

Bevor Sie sich mit all dem befassen, schauen Sie sich die Form der Anfrage an. Eine API, auf der Sie aufbauen können, ist eine, die Sie mit `curl` aufrufen und allein aus der Antwort verstehen können, ohne ein SDK, das für Sie übersetzt.

```bash
# The shape to look for: one endpoint, a bearer key, the document as the body
curl -sS -X POST "https://api.example.com/v1/documents?name=README.md" \
     -H "Authorization: Bearer <key>" \
     --data-binary @README.md

# And the refusal you can act on: a status that means something, and a body a script can parse
# HTTP/1.1 413
# { "error": "document is over 4 MB" }
```

Drei Dinge in diesem Austausch lohnen sich, darauf zu bestehen. Der Schlüssel reist in einem Header statt in einem Query-String, sodass er nicht in Server-Logs und Browser-Historie landet. Der Body ist das Dokument selbst statt eines JSON-Umschlags mit der base64-kodierten Datei darin, was die Größe klein hält und einen Kodierschritt aus Ihrem Skript entfernt. Und der Fehlschlag ist ein Statuscode plus ein parsbarer Body, sodass ein CI-Job „zu groß“ von „zu schnell“ von „nicht Ihres“ unterscheiden kann, ohne Englisch zu lesen.

Drängen Sie dann absichtlich über den Glücksfall hinaus. Schicken Sie eine Datei über dem Limit und lesen Sie den Status. Schicken Sie zwanzig Anfragen in einer Sekunde und lesen Sie den Status. Schicken Sie einen falschen Schlüssel, und einen Schlüssel, der zu einem anderen Konto gehört. Eine gut gebaute API antwortet in diesen vier Fällen mit `413`, `429`, `401` und `404`, mit einem Body, der erklärt, welches; eine schlecht gebaute antwortet viermal mit `500`, oder mit `200` und einer im HTML versteckten Fehlermeldung.

Veröffentlichte Limits sind die andere Hälfte derselben Frage. Ein Limit, das Sie lesen können, ist eines, um das herum Sie planen können; ein Limit, das in der Produktion entdeckt wird, ist ein Ausfall. TransformPipe deckelt ein Konto bei 100 MB und 500 Dokumenten, eine Konvertierung bei 10 MB, ein gespeichertes Dokument bei 4 MB und einen Aufrufer bei 60 Anfragen pro Minute; das Erreichen eines Limits verweigert den Schreibvorgang, statt irgendetwas zu löschen, und die Endpunkte, die Statuscodes und das Schlüsselformat stehen in [der Dokumentation](/docs). Die 4-MB-Zahl ist eher eine Plattform-Einschränkung als eine Vorliebe — die Funktion darunter verweigert eine Anfrage oder einen Antwortkörper über 4,5 MB —, was die Art Sache ist, die man aussprechen sollte statt zu verstecken, denn sie sagt Ihnen die Form dessen, worauf Sie stehen.

Wenn Sie Konvertierung in einen Build oder einen Bot verdrahten statt einen Button zu klicken, [was Sie von einer API für Dokumentkonvertierung verlangen sollten](/blog/converting-documents-with-an-api) geht weiter auf Anfrageformen, Wiederholungsverhalten und die Fehlermodi ein, die nur in einer Pipeline zählen.

## Zwei weitere Prüfungen, und ein Bogen, um alle sieben zu bewerten

Fünf Prüfungen decken die Arten ab, wie ein Konverter laut scheitert. Zwei weitere decken die Arten ab, wie er still scheitert, und keine davon dauert länger als dreißig Sekunden.

**Was die Ausgabe beim Drucken tut.** Öffnen Sie die Druckvorschau. Ein dunkles Theme, das auf Papier dunkel bleibt, verschwendet eine Patrone und macht das Dokument unlesbar in dem einen Format, das Leute sich noch in Besprechungen in die Hand geben. Prüfen Sie drei Dinge: ob die Farben zu hellen Werten wechseln, ob Codeblöcke umbrechen statt am Seitenrand abgeschnitten zu werden, und ob Link-URLs neben dem Linktext gedruckt werden oder ganz verloren gehen. Ein Dokument mit vierzehn Links, das als vierzehn unterstrichene Phrasen druckt, hat das meiste seines Inhalts weggeworfen. TransformPipe schreibt eine eigenständige Datei mit Inline-Styles und ohne Scripts, und wechselt beim Drucken zu hellen Werten; welches Werkzeug Sie auch nutzen, schauen Sie sich die Vorschau einmal an, bevor Sie ihr etwas anvertrauen, das Sie drucken werden.

**Ob die Überschriften Ids tragen, die Sie verlinken können.** Durchsuchen Sie die Ausgabe nach `id="` neben einem `<h2>`. Wenn die Ids fehlen, können Sie keinen Abschnitt verlinken, Sie können kein Inhaltsverzeichnis bauen, ohne JavaScript zu schreiben, und eine Kollegin, die Ihr Dokument zitiert, muss „die Stelle über Limits“ sagen statt eine URL zu schicken. Wenn die Ids existieren, prüfen Sie, ob sie vom Überschriftentext abgeleitet sind statt `heading-3` zu heißen — eine positionelle Id ändert sich in dem Moment, in dem jemand einen Abschnitt darüber einfügt, was jeden Link bricht, der je verschickt wurde. Die Überschrift mit Interpunktion im Testdokument ist da, um zu zeigen, wie die Id gebaut wird: eine gute schlägt den Text, entfernt die Interpunktion, und erzeugt jedes Mal dieselbe Id, wenn diese Überschrift konvertiert wird.

Beide zählen mehr für Dokumentation als für ein Einzeldokument, was das Thema der ganzen Übung ist. Die Prüfungen haben keine universellen Gewichte, und ein Fehlschlag in einer Zeile, die Ihnen egal ist, ist kein Fehlschlag.

Hier ist der Bogen. Kopieren Sie ihn, füllen Sie eine Spalte pro Kandidat aus, und markieren Sie jede Zelle als bestanden, gescheitert oder nicht zutreffend.

| # | Prüfung | Ein Bestehen sieht so aus | Werkzeug A | Werkzeug B |
| --- | --- | --- | --- | --- |
| 1 | Dialekt | Tabelle rendert, Boxen sind Checkboxen, Durchstreichung durchgestrichen, bloße URL verlinkt | | |
| 2 | Bereinigung | Alle fünf Vektoren neutralisiert, auf dem Server wie im Browser | | |
| 3 | Eigenständig | Doctype, Charset, Inline-`<style>`, kein `http` in irgendeinem `src` oder `href` | | |
| 4 | Privatsphäre | Der Network-Tab bestätigt die Behauptung, und eine Aufbewahrungsdauer steht schriftlich fest | | |
| 5 | API und Limits | Bearer-Schlüssel, parsbare Fehler, `413` und `429` wo erwartet, veröffentlichte Limits | | |
| 6 | Druck | Helle Farben auf Papier, Code umgebrochen, Links lesbar | | |
| 7 | Überschriften-Ids | Eine `id` auf jeder Überschrift, vom Text abgeleitet, stabil über Durchläufe | | |
| — | Front Matter | Entfernt oder als Tabelle gerendert, nicht als Absatz aus `key: value`-Zeilen | | |
| — | Kodierung | Gedankenstrich und Ligatur intakt, `<meta charset>` vorhanden | | |
| — | Fußnoten | Gerendert, oder als sichtbare Markierung belassen. Nicht still fallen gelassen | | |

Die drei unnummerierten Zeilen fangen Leute ab, die Dateien aus anderen Systemen konvertieren: Notizen, die aus einem Dokumentationswerkzeug exportiert wurden, Dokumente, die auf einem anderen Betriebssystem geschrieben wurden, akademische Prosa. Bewerten Sie sie, wenn Ihre Dateien von woanders als Ihrem eigenen Editor kommen.

Gewichten Sie die Zeilen, bevor Sie sie summieren. Für ein Dokument, das Sie jemandem schicken, sind Zeile drei und sechs mehr wert als der Rest zusammen, und Zeile zwei ist irrelevant. Für Nutzereingaben innerhalb einer Anwendung ist Zeile zwei der ganze Test, und Zeile drei und sechs gelten nicht. Ein Bogen mit gleichen Gewichten erzeugt eine ordentliche Zahl und das falsche Werkzeug.

## Was fünf Minuten Ihnen nicht sagen können

Ein Testdokument ist ein gutes und ein enges Instrument. Es sagt Ihnen, was ein Werkzeug heute tut, mit einer Datei, in Ihrem Browser. Drei Dinge, die es Ihnen nicht sagen kann, sind die drei, die später am wahrscheinlichsten zählen.

**Eine Punktzahl kann Ihnen nicht sagen, dass Sie die falsche Kategorie Werkzeug bewerten.** Ein statischer Seitengenerator scheitert an fast jeder Prüfung oben — er gibt Ihnen keine Datei, er bereinigt nicht, er hat keine API, und er will eine Konfigurationsdatei und einen Build-Schritt — und ist trotzdem die richtige Antwort, wenn Sie vierzig Seiten veröffentlichen, die untereinander verlinken. Der Bogen misst, wie gut ein Werkzeug den Job macht, für den Sie es getestet haben, und sagt nichts darüber, ob das der Job war, den Sie eigentlich brauchten.

**Ein Fünf-Minuten-Test kann Ihnen nicht sagen, wie ein Werkzeug in einem Jahr sein wird.** Er kann keinen Eigentümerwechsel sehen, keine auftauchende Preisseite, keine API, die einen Pflichtparameter bekommt, oder einen Maintainer, der aufhört zu antworten. Was er sehen kann, sind die Eigenschaften, die diese Dinge vorhersagen. Lizenz ist eine: Eine MIT- oder BSD-Bibliothek kann Ihnen nicht weggenommen werden, weil die Kopie, die Sie haben, lizenziert bleibt, was auch immer als Nächstes passiert. Eigentümerschaft ist eine andere: Ein unabhängiges Open-Source-Projekt, ein Unternehmen mit einem bezahlten Produkt, und ein kostenloser gehosteter Dienst ohne sichtbares Geschäftsmodell scheitern alle unterschiedlich und auf unterschiedlichen Zeitskalen, und der dritte ist der, der ohne Vorwarnung verschwindet. Ob es offline laufen kann, ist die dritte: Ein Werkzeug, das auf Ihrer Maschine läuft, funktioniert weiter, wenn das Unternehmen es nicht mehr tut, und ein Werkzeug, das auf dem Server von jemandem läuft, ist genau so haltbar wie dieser Server.

**Ein Testdokument kann Ihnen nicht sagen, was Ihre eigenen Dokumente enthalten.** Die Datei oben ist eine Kostprobe; Ihre echten Dateien haben ihre eigenen Eigenheiten — eine Tabelle mit hundert Zeilen, eine Galerie von Screenshots, ein Codeblock in einer Sprache, die niemand hervorhebt, eine Überschriftenebene, die von zwei auf vier springt. Lassen Sie auch ein echtes Dokument durchlaufen, idealerweise das größte und hässlichste, das Sie haben. Die Hälfte der Probleme, die Leute mit Konvertern melden, sind gar keine Konverterprobleme; es ist eine einzelne ungewöhnliche Datei, die das Werkzeug nie gesehen hat.

### Die Kriterien, in Reihenfolge

1. **Entscheiden Sie das Ziel, bevor Sie ein Werkzeug öffnen.** Eine Person, eine Seite, eine Anwendung, eine Pipeline oder ein Archiv — die Antwort eliminiert sofort den größten Teil des Marktes, und diesen Schritt zu überspringen ist, wie Leute am Ende einen Seitengenerator gegen einen Konverter bewerten und schließen, dass beide enttäuschend sind.
2. **Passen Sie den Dialekt an die Dateien an, die Sie tatsächlich haben.** Wenn Ihre Dokumente Tabellen oder Aufgabenlisten enthalten, verliert ein reiner CommonMark-Parser sie still, und Sie merken es, wenn eine Kollegin fragt, warum die Vergleichstabelle eine Wand aus Pipes ist.
3. **Entscheiden Sie über Bereinigung, indem Sie fragen, wer die Datei geschrieben hat.** Für Ihre eigenen Notizen zählt es überhaupt nicht; für alles, das von außen kam, bereinigt entweder der Konverter gegen eine Allow-Liste, oder Sie tun es, und es gibt keine dritte Option, die gut endet.
4. **Bestehen Sie auf einem Dokument, keinem Fragment.** Ein Konverter, der `<h1>…</h1><p>…</p>` zurückgibt, hat sich als Bibliothek korrekt verhalten und als Werkzeug versagt, und der Unterschied ist sichtbar, sobald jemand anderes als Sie die Datei öffnet.
5. **Prüfen Sie die Privatsphäre-Behauptung, statt sie zu lesen.** Der Network-Tab beantwortet in zehn Sekunden, wofür eine Datenschutzerklärung eine Seite braucht, um es anzudeuten, und die Antwort ist entweder „nichts wurde gesendet“ oder „hier ist genau, was gesendet wurde“.
6. **Prüfen Sie die Fehlschläge, nicht die Erfolge.** Alles konvertiert einen Absatz. Was Werkzeuge unterscheidet, ist die Reaktion auf eine Datei über dem Limit, eine fehlerhafte Tabelle, einen falschen Schlüssel und zwanzig Anfragen in einer Sekunde — und diese Reaktionen sind das, womit Ihre Automatisierung ihr Leben verbringen wird.
7. **Bevorzugen Sie die Eigenschaft, die den Test überdauert.** Eine großzügige Lizenz, Code, den Sie offline betreiben können, ein offenes Ausgabeformat und veröffentlichte Limits sind alle heute überprüfbar und alle in drei Jahren noch wahr, was mehr ist, als eine Feature-Liste behaupten kann.

Lassen Sie das Testdokument durch das Werkzeug laufen, das Sie jetzt nutzen, und durch das, das Sie erwägen, in einer Sitzung: dieselbe Eingabe, zwei Quellen zum Diffen. Meist gewinnt der Amtsinhaber in einer Zeile und verliert in einer anderen, und der Bogen macht aus einer vagen Vorliebe eine Entscheidung, die Sie jemandem erklären können. Wenn die Zeile, in der Sie verlieren, der eigenständige Export ist, ist [Markdown im Browser zu HTML konvertieren](/) der kürzeste Weg, es zu beheben, kostenlos und ohne Installation; wenn die Zeile, in der Sie verlieren, Dialekt oder Bereinigung ist, ist die Lösung meist eine andere Bibliothek statt einer anderen Website. So oder so, behalten Sie die Datei. Das nächste Werkzeug, das Sie bewerten, kostet fünf Minuten statt eines Nachmittags.

## FAQ

### Womit sollte ich einen Markdown-Konverter testen?

Mit einem absichtlich unbequemen Dokument statt einem Absatz Prosa: eine GFM-Tabelle, Aufgabenlisten, Durchstreichung, eine bloße URL, ein eingezäunter Codeblock, Front Matter, eine Fußnote und die fünf Roh-HTML-Angriffsvektoren. Fügen Sie eine eigene echte Datei hinzu, idealerweise die längste und seltsamste, die Sie haben, denn Ihre Dokumente enthalten Eigenheiten, die keine Kostprobe abdeckt.

### Wie erkenne ich, ob ein Konverter bereinigt?

Konvertieren Sie ein Dokument mit `<script>`, einem `onerror`-Attribut, einem `javascript:`-Link, einem `<iframe>` und einem `<svg onload>`, und lesen Sie dann die HTML-Quelle statt der Vorschau. Wenn alle fünf weg oder maskiert sind, lief eine Allow-Liste; wenn manche überleben, filtert das Werkzeug nach Namen und wird den nächsten Vektor auch verpassen.

### Spielt es eine Rolle, wenn der Konverter nur CommonMark unterstützt?

Nur, wenn Ihre Dateien die vier Dinge nutzen, die CommonMark auslässt: Tabellen, Aufgabenlisten, Durchstreichung und Autolinks für bloße URLs. Prosa mit Überschriften, Listen, Links und Codeblöcken rendert so oder so identisch, prüfen Sie also Ihre eigenen Dokumente, bevor Sie den Dialekt als entscheidenden Faktor behandeln.

### Ist ein im Browser laufender Konverter immer privater?

Er ist privater in dem Sinn, der am meisten zählt — die Datei wird nicht übertragen, und Sie können das im Network-Tab in zehn Sekunden bestätigen. Er ist nicht automatisch in jedem Sinn sicherer, weil ein browserseitiges Werkzeug immer noch rendert, was auch immer HTML das Dokument enthält, sodass die Bereinigungsfrage separat ist und genauso gilt.

### Wie prüfe ich einen Konverter, ohne irgendetwas zu installieren?

Öffnen Sie das Werkzeug, öffnen Sie die Entwicklertools des Browsers, fügen Sie das Testdokument ein und konvertieren Sie. Der Network-Tab beantwortet die Privatsphärefrage, das Elemente-Panel beantwortet die Bereinigungsfrage, und die heruntergeladene Datei beantwortet die Eigenständigkeitsfrage — drei der sieben Prüfungen, ohne Installation und ohne Konto.

### Worauf sollte ich in der API eines Konverters achten, bevor ich darauf aufbaue?

Ein Schlüssel, der als Bearer-Header statt als Query-Parameter gesendet wird, ein Widerruf, der sofort wirkt, gehasht gespeicherte Schlüssel, veröffentlichte Raten- und Größenlimits, und Fehlerantworten, die ein aussagekräftiger Statuscode plus ein parsbarer Body sind. Testen Sie dann absichtlich die Ablehnungen, denn eine Pipeline verbringt die meiste Zeit ihres Lebens auf dem unglücklichen Pfad.

### Wie oft sollte ich den Test erneut ausführen?

Immer, wenn ein Werkzeug eine Änderung an seinem Renderer, seinem Sanitizer oder seinem Stylesheet ankündigt, und einmal im Jahr sowieso. Es dauert eine Minute, sobald die Datei existiert, und dass sich das Verhalten eines Konverters unter Ihnen ändert, ist ein normales Ereignis, kein Skandal — Sie wollen nur derjenige sein, der es bemerkt.
