---
title: "Markdown vs. HTML: Worin schreiben, und wann wechseln"
description: "Markdown oder HTML? Entscheiden Sie nach dem, was als Nächstes passiert - Review, Konvertierung, exaktes Layout, interaktive Teile - welche Grenzen Funktionen sind"
date: 2026-08-15
tag: Workflow
keywords: markdown vs html, markdown oder html, unterschied zwischen markdown und html, wann markdown benutzen, rohes html in markdown, markdown einschränkungen, html vs markdown dokumentation
---

Niemand fragt „Markdown oder HTML?“ im Abstrakten. Die Frage kommt an einer Datei befestigt: ein Runbook, das jemand aktuell halten muss, eine Seite, die exakt wie die gedruckte Version aussehen muss, eine Vorlage, die Outlook überstehen muss. Die zwei Formate konkurrieren nicht um denselben Job, und der Streit klärt sich nur, indem man fragt, was mit dem Dokument passiert, nachdem Sie fertig geschrieben haben.

### Kurzfassung

Schreiben Sie Markdown, wenn das Dokument gelesen, begutachtet, von anderen Menschen bearbeitet und wahrscheinlich konvertiert wird; schreiben Sie HTML, wenn das Layout, die Interaktivität oder der Zustellungskanal der Inhalt sind. Markdowns Grenzen sind der Grund, warum es überprüfbar ist — eine Datei, die kein zweispaltiges Layout ausdrücken kann, kann auch keine Änderung vor einem Diff verstecken. Rohes HTML innerhalb von Markdown ist der richtige Notausgang für eine Abbildung, ein Iframe, ein `<details>`, und ein Warnsignal, wenn es in jedem dritten Absatz erscheint. Die Ausnahmen, bei denen Sie in HTML beginnen und dabei bleiben sollten, sind eng und erkennbar: E-Mail-Vorlagen, alles, was exaktes Seitenlayout braucht, und alles mit beweglichen Teilen.

Der meiste Reibungsverlust, den Leute dem Format anlasten, ist eigentlich eine Fehlpassung. Jemand schreibt ein Richtliniendokument in HTML, weil das endgültige Artefakt eine Webseite ist, und achtzehn Monate später kann niemand mehr eine Änderung daran begutachten, weil der Diff vierzig Zeilen veränderten Markups um drei veränderte Wörter herum ist. Jemand anders schreibt eine druckreife Rechnung in Markdown, entdeckt, dass es keine Möglichkeit gibt, einen Seitenumbruch zu erzwingen, und landet dabei, `<div style="page-break-after: always">` mitten in einen Absatz zu kleben.

Beide Richtungen kosten dasselbe: Das Format passte nicht mehr zur Zukunft des Dokuments. Markdown ist ein Schreibformat, das in ein Publikationsformat konvertiert. HTML ist das Publikationsformat. Zu wählen bedeutet zu entscheiden, welcher der beiden Jobs das Leben der Datei dominiert.

Der Rest dieses Stücks ist die Entscheidung, Fall für Fall, plus die Teile, die Leute falsch machen — was Markdown wirklich nicht kann und warum das ein Feature statt einer Lücke ist, wo der Roh-HTML-Notausgang legitim ist, und was es kostet, wenn die übliche Antwort „Markdown schreiben und konvertieren“ sich als falsch herausstellt.

## Was die Wahl tatsächlich entscheidet

Der sichtbare Unterschied ist Syntax: `## Überschrift` gegen `<h2>Überschrift</h2>`. Das ist der uninteressanteste Unterschied, und es ist der einzige, den die meisten Vergleiche behandeln.

Was Sie wirklich wählen, ist, wo die Darstellung lebt. In HTML sitzen Struktur und Darstellung in derselben Datei, oder zumindest im selben Repository, verdrahtet durch Klassen und ein Stylesheet. Ändern Sie die Überschrift, müssen Sie vielleicht die Hülle ändern, die Klasse, und die CSS-Regel, die sie anvisiert. In Markdown lebt die Darstellung vollständig außerhalb des Dokuments. Die Datei sagt „das ist eine Überschrift zweiter Ebene“ und weigert sich, irgendetwas darüber zu sagen, wie eine Überschrift zweiter Ebene aussieht. Diese einzige Einschränkung ist es, die eine Markdown-Datei portabel, diffbar und sicher macht, jemandem zu geben, der keinen Code schreibt.

Sie wählen auch die Größe der editierbaren Oberfläche. Ein HTML-Dokument hat tausende legale Zustände, und die meisten davon sind auf subtile Weise kaputt — ein nicht geschlossenes `<li>`, ein `<div>` verschachtelt in einem `<p>`, ein verirrtes Attribut, das ein Browser still repariert und ein Validator meldet. Ein Markdown-Dokument hat eine kleine Anzahl von Konstrukten und fast keine Möglichkeit, das Parsen zu brechen. Das Schlimmste, was meist passiert, ist, dass eine Liste als Absatz dargestellt wird, was sofort sichtbar ist.

Und Sie wählen, wer der zweite Autor ist. Das ist der Teil, der die meisten echten Fälle entscheidet. Ist die Antwort „ein Support-Ingenieur um 2 Uhr nachts“, „eine Anwältin“, „ein Produktmanager“ oder „jemand in sechs Monaten, der dieses Repository nie gesehen hat“, braucht das Format eine niedrige Einstiegshürde. Ist die Antwort „derselbe Frontend-Entwickler, der es geschrieben hat“, zählt die Hürde nicht, und die Decke schon.

Drei Fragen klären fast jeden Fall:

- **Was ist das endgültige Artefakt?** Eine Webseite, ein PDF, eine E-Mail, ein In-App-Hilfe-Panel, oder eine Datei in einem Repository, die Menschen als Text lesen.
- **Wer bearbeitet es nach Ihnen?** Ein Entwickler, ein gemischtes Team, oder die Öffentlichkeit.
- **Muss irgendetwas daran exakt sein?** Exakte Seitenumbrüche, exakte Spaltenbreiten, exaktes Rendering in einem benannten Client. Exaktheit ist das stärkste Argument für HTML, das es gibt.

## Markdown vs. HTML: die Übersicht

Eine Tabelle, quer gelesen. Die dritte Spalte ist die Option, die Leute vergessen zu haben — Markdown schreiben, konvertieren, und das HTML als Build-Produkt behandeln statt als Quelldatei.

| Frage | Markdown | Handgeschriebenes HTML | Markdown, zu HTML konvertiert |
| --- | --- | --- | --- |
| Kosten, eine Seite Prosa zu schreiben | Am niedrigsten: die Syntax ist aus dem Weg | Am höchsten: Tags, Verschachtelung, Hüllen | Am niedrigsten, plus ein Build-Schritt |
| Was ein Code-Review zeigt | Geänderte Wörter | Geänderte Wörter, vergraben in geändertem Markup | Geänderte Wörter in der Quelle; Ausgabe neu erzeugt |
| Wer es sicher bearbeiten kann | Jeder, der tippen kann | Menschen, die mit Markup vertraut sind | Jeder, auf der Markdown-Seite |
| Exaktes Layout — Spalten, Seitenumbrüche | Nicht ausdrückbar | Volle Kontrolle | Nur, was die Vorlage bietet |
| Interaktive Teile — Formulare, Skripte, Widgets | Nicht ausdrückbar | Nativ | Nur über Roh-HTML-Durchreichung |
| Verlässliches Rendering in E-Mail-Clients | Nein | Ja, mit E-Mail-spezifischem Markup | Nein, nicht ohne eine E-Mail-spezifische Vorlage |
| Tabellen | Nur einfache Raster, keine Spannen oder Verschachtelung | Jede Tabelle | So gut, wie es der Dialekt erlaubt |
| Barrierefreiheits-Attribute — `lang`, `scope`, ARIA | Meist abwesend | Vollständig | Aus der Vorlage, nicht aus der Prosa |
| Risiko, versehentlich ein Skript auszuliefern | Niedrig, bis rohes HTML erlaubt ist | Es ist Ihr Skript | Hängt vollständig von der Bereinigung ab |
| In zehn Jahren ohne Werkzeug lesbar | Ja, es ist Prosa | Ja, aber es liest sich als Markup | Quelle bleibt lesbar |
| Wo die Gestaltung lebt | Nirgends in der Datei | In der Datei oder ihrem Stylesheet | Im Konverter oder der Vorlage |
| Was Sie jemandem schicken können | Eine `.md`-Datei, die er vielleicht nicht öffnen kann | Eine Datei, die öffnet, wenn eigenständig | Ein vollständiges HTML-Dokument |

Das Muster in dieser Tabelle ist konsistent. Markdown gewinnt jede Zeile über Menschen und Zeit. HTML gewinnt jede Zeile über Kontrolle und Zustellung. Die dritte Spalte ist Markdowns Menschen-und-Zeit-Gewinne mit HTMLs Zustellung, zum Preis eines Konvertierungsschritts, den Sie jetzt besitzen.

## Die Fälle, entschieden nach Ziel

Nichts unten ist Geschmackssache. Jeder Fall hat ein Ziel, und das Ziel wählt das Format.

### Dokumentation, die neben dem Code lebt — Markdown

Liegt das Dokument in einem Repository neben dem, was es beschreibt, sollte es Markdown sein. Es wird im selben Pull Request begutachtet wie die Änderung, die es dokumentiert, was der einzige Mechanismus ist, der Dokumentation verlässlich aktuell hält. GitHub, GitLab und jeder Code-Host rendern es ohne Build. Neue Kollegen bearbeiten es, ohne eine Toolchain zu lernen.

Die HTML-Alternative scheitert hier auf eine bestimmte Weise: Die Docs hören auf, begutachtet zu werden. Ein Reviewer, der einen 60-zeiligen Markup-Diff für eine Zwei-Satz-Korrektur sieht, genehmigt ihn, ohne zu lesen, und danach driften die Dokumente. [Dokumentation im Repository zu halten](/blog/documentation-that-lives-in-the-repo) ist mehr eine Workflow-Entscheidung als eine Formatierungsfrage, und Markdown ist das Format, das den Workflow billig genug macht, um zu halten.

**Für wen ist es geeignet:** Engineering-Teams, jeder, dessen Dokument eine an eine Codebasis geheftete Versionsnummer hat.

### README-Dateien, Changelogs, Beitragsleitfäden — Markdown

Diese werden ebenso oft als Text gelesen wie als Seiten. Ein Changelog wird gegrept, gedifft, in eine Release Note eingefügt und gelegentlich auf einem Handy in einem Terminal gelesen. HTML macht jeden dieser Fälle schlechter und keinen besser.

**Für wen ist es geeignet:** jedes Repository, ohne dass es sich lohnt, darüber zu streiten.

### Notizen, Entwürfe und alles, worüber Sie noch nachdenken — Markdown

HTML zu schreiben, während man Prosa verfasst, teilt die Aufmerksamkeit zwischen dem Satz und seinem Container. Die Menschen, die am meisten Markdown schreiben, sind keine Entwickler, die Seiten veröffentlichen; es sind Menschen, die Notizen machen, und das Format überlebt, weil es aus dem Weg bleibt. Eine große Zahl von Editoren existiert nur dafür, und die guten machen die Syntax fast unsichtbar.

**Für wen ist es geeignet:** jeden, dessen erster Entwurf nicht das Artefakt ist.

### Ein Dokument, das Sie an eine benannte Person schicken müssen — Markdown, konvertiert

Hier ist die Antwort keines der beiden Formate für sich. Sie wollen Markdown schreiben und HTML übergeben, denn eine `.md`-Datei ist eine Bitte, dass der Empfänger etwas installiert oder öffnet, und eine vollständige HTML-Datei ist ein Dokument, das in dem öffnet, was er schon hat.

Die wichtige Eigenschaft der Ausgabe ist, dass sie eigenständig ist: Doctype, `<head>`, Stile inline, keine Anfrage an ein CDN für eine Schriftart oder ein Stylesheet. Ein Fragment — `<h1>Titel</h1><p>Text</p>` mit nichts drumherum — ist legales HTML und rendert als ungestylter schwarzer Text in der Standardbreite des Browsers, was für jeden, der es bekommt, als kaputt liest.

**Für wen ist es geeignet:** einen Vorschlag, einen Bericht, ein Übergabedokument, eine Spezifikation, die an einen Kunden geht.

### Eine Seite, ein Docs-Portal, ein Blog — Markdown, konvertiert durch einen Generator

Mehrere Dokumente, die aufeinander verweisen, brauchen Navigation, Feeds, Suche und eine gemeinsame Vorlage. Das ist die Aufgabe eines statischen Seitengenerators, und jeder von ihnen nimmt Markdown als Eingabe, aus demselben Grund: Niemand will hundert Seiten Markup von Hand verfassen. Das HTML in dieser Anordnung wird erzeugt, und kein Mensch sollte es bearbeiten.

**Für wen ist es geeignet:** jeden, der ein Set von Seiten veröffentlicht statt einer Seite.

### E-Mail-Vorlagen — HTML, und ein spezifischer Dialekt davon

Das ist der klarste Fall, in dem Markdown der falsche Ausgangspunkt ist, und es lohnt sich, präzise zu sein, warum. HTML-E-Mail ist nicht das HTML, das Sie für Browser schreiben. Clients unterscheiden sich darin, welches CSS sie unterstützen, manche entfernen einen `<style>`-Block komplett, sodass Stile auf jedes Element inline gesetzt werden müssen, und Layout wird immer noch häufig mit verschachtelten Tabellen statt Flexbox oder Grid gebaut. Outlook unter Windows hat seit vielen Jahren HTML-Mail über Microsoft Words Rendering-Engine dargestellt statt über eine Browser-Engine, weshalb so viel E-Mail-Markup aussieht, als sei es 2003 geschrieben worden — es muss.

Kein Markdown-Konverter zielt darauf ab. Ein Konverter gibt standardkonformes HTML für einen Browser aus, und standardkonformes HTML für einen Browser ist genau das, was ein feindseliger Mail-Client verstümmelt. Sie können den Fließtext in Markdown schreiben und die konvertierte Ausgabe in eine Vorlage einfügen, aber die Vorlage selbst ist handgebautes HTML, oder gebaut von einem für E-Mail entworfenen Framework wie MJML, das seine eigene Komponentensyntax in das verschachtelte Tabellen-Markup kompiliert, das Clients tolerieren. MJML ist kostenlos und Open Source.

**Für wen ist es geeignet:** jeden, der Mail verschickt, die in mehr als drei Clients gleich aussehen muss. Schreiben Sie die Vorlage einmal in HTML; versuchen Sie nicht, sie zu generieren.

### Alles, wo das Layout der Inhalt ist — HTML mit CSS

Rechnungen, Zertifikate, Verträge mit nummerierten Klauseln, die nicht über Seiten hinweg brechen dürfen, Poster, Formulare, alles mit einem festen Spaltenraster oder einer Fußzeile, die auf jeder gedruckten Seite unten sitzen muss. Markdown kann nichts davon ausdrücken, und keine vernünftige Erweiterung wird es, weil das Präsentationsanweisungen sind und Markdowns ganzes Design darauf ausgelegt ist, Präsentationsanweisungen auszuschließen.

Die Werkzeuge hier sind CSS Paged Media — `@page` für Ränder, `break-inside: avoid`, um eine Tabellenzeile ganz zu halten, `break-after`, um eine neue Seite zu erzwingen —, und sie operieren auf HTML. Ist das Ziel ein gedrucktes Artefakt mit Regeln, wie es auf der Seite sitzen muss, beginnen Sie in HTML. Ist es ein Dokument, das bloß zufällig als PDF endet, reicht meist Markdown, zu HTML konvertiert und aus dem Browser gedruckt; [was Sie auf diesem Weg gewinnen und verlieren](/blog/markdown-to-pdf), lohnt sich zu wissen, bevor Sie sich festlegen.

**Für wen ist es geeignet:** Finanzdokumente, Rechtsdokumente, alles, was zu einer Druckerei geht.

### Alles mit beweglichen Teilen — HTML

Formulare, die abschicken, Tabs, Filter, Diagramme, die auf Eingaben reagieren, ein Rechner, ein Suchfeld, eine sortierbare Tabelle, ein Videoplayer mit eigenen Bedienelementen. Das sind keine Dokumente mit Dekoration; es sind kleine Anwendungen. Markdown hat keine Syntax dafür und sollte auch keine erwerben.

Der Test ist, ob der Leser irgendetwas anderes tut als lesen. Klickt er auf etwas, das ändert, was er sieht, bauen Sie HTML, und die Prosa darin ist ein kleiner Teil der Datei.

**Für wen ist es geeignet:** Anwendungs-UI, Marketingseiten mit Interaktion, Dashboards.

### Inhalt in einer Datenbank, bearbeitet von nicht-technischem Personal — meist keines von beiden, direkt

Es lohnt sich, das zu benennen, weil es häufig ist und falsch kategorisiert wird. Bearbeitet Marketing den Text über ein CMS, ist das gespeicherte Format, was auch immer das CMS erzeugt — oft HTML aus einem Rich-Text-Editor, manchmal eine JSON-Blockstruktur. Dort Markdown zu wählen bedeutet, nicht-technische Bearbeiter zu bitten, Syntax zu lernen und ihre Arbeit in einem zweiten Fenster in der Vorschau anzusehen. Manche Teams tun das gerne; mehr von ihnen hören still auf, das CMS zu benutzen.

**Für wen ist es geeignet:** Teams, bei denen der Bearbeiter das Publikum ist, nicht der Entwickler.

## Was Markdown absichtlich nicht kann

Die Liste unten liest sich als Liste fehlender Funktionen. Sie ist näher an einer Spezifikation. Jeder Punkt wurde ausgelassen, damit das Format klein genug bleibt, um als reiner Text lesbar zu sein, und jede Auslassung kauft etwas.

**Keine Gestaltung jeder Art.** Es gibt keine Syntax für Farbe, Schriftart, Größe, Ausrichtung oder Abstand. Was Sie bekommen, ist eine Aussage über Struktur — Überschrift, Liste, Betonung —, und die Entscheidung über das Aussehen wird darauf verschoben, was auch immer die Datei darstellt. Der Gewinn: Ein Dokument rendert korrekt in einem Code-Host, der Vorschau eines Editors, einem Terminal, einer statischen Seite und einer konvertierten HTML-Datei, denn keines davon muss den anderen im Aussehen zustimmen.

**Kein Layout.** Keine Spalten, keine Floats, keine Seitenumbrüche, keine Kontrolle darüber, wo etwas sitzt. Ein Markdown-Dokument ist eine einzige Spalte aus Blöcken in Quellreihenfolge. Der Gewinn: Es fließt auf einem Handy ohne jeden Aufwand neu, und es konvertiert in jedes Layout, das die Vorlage will, statt gegen eines anzukämpfen.

**Keine Attribute auf Elementen.** Reines Markdown gibt Ihnen keine Möglichkeit, eine Klasse, eine ID, ein `lang`, einen `title` oder eine ARIA-Rolle hinzuzufügen. Mehrere Implementierungen fügen das als Erweiterung hinzu — Attributlisten in Python-Markdown, `markdown-it-attrs`, eingezäunte Divs in Pandoc —, und in dem Moment, in dem Sie eine davon nutzen, ist Ihre Datei an diese Implementierung gebunden. Der Gewinn: Eine Datei ohne Attribute kann keine implementierungsspezifische Darstellung tragen, sie bleibt also portabel.

**Tabellen sind Raster und nichts weiter.** GitHub Flavored Markdown gibt Ihnen eine Kopfzeile, Ausrichtung pro Spalte, und Zellen mit Inline-Inhalt. Es gibt kein `colspan`, kein `rowspan`, keine verschachtelte Tabelle, keine Zelle mit einer Liste oder einem Absatzumbruch, keine Beschriftung. Braucht Ihre Tabelle etwas davon, brauchen Sie HTML für die Tabelle. Der Gewinn: Die Tabelle ist in der Quelldatei lesbar, was eine HTML-Tabelle nicht ist. Tabellen sind auch das Ding, das am häufigsten unterwegs bricht, und [sie über eine Konvertierung hinweg intakt zu halten](/blog/markdown-tables-that-survive-conversion), hat eigene Regeln.

**Keine Fußnoten, Definitionslisten oder Mathematik in der Basisspezifikation.** CommonMark hat keines davon. GFM fügt Tabellen, Task-Listen, Durchgestrichenes und Autolinks hinzu und hört dort auf. Fußnoten, Definitionslisten, `$…$`-Mathematik und Hinweisblöcke sind alle Erweiterungen, unterstützt von manchen Parsern und von anderen still als wörtlicher Text dargestellt. Der Gewinn: eine kleine Spezifikation, die viele Implementierungen tatsächlich korrekt umsetzen. Es bedeutet auch, dass „Markdown unterstützt X“ fast immer eine Behauptung über einen Parser ist statt über Markdown; [die Unterschiede zwischen den Dialekten](/blog/commonmark-gfm-and-the-flavours) sind, woher die meisten werkzeugübergreifenden Überraschungen kommen.

**Kein bedingter Inhalt, keine Includes, keine Variablen.** Sie können nicht sagen „zeige diesen Absatz nur für die Enterprise-Edition“ oder „füge hier den Lizenzblock ein“. Statische Seitengeneratoren schrauben das mit Frontmatter und Vorlagensyntax an, was genau der Punkt ist, an dem Ihr Markdown aufhört, portables Markdown zu sein. Der Gewinn: Was Sie lesen, ist, was da ist.

**Keine Semantik über ein Dutzend Konstrukte hinaus.** Kein `<figure>` mit einem `<figcaption>`, kein `<abbr>`, kein `<time>`, kein `<aside>`, kein `<section>` mit beschrifteter Überschrift. Für Dokumente, die einen Barrierefreiheitsstandard erfüllen müssen, ist das eine echte Lücke, und sie wird entweder durch die Konvertierungsvorlage oder durch rohes HTML in der Datei gefüllt.

Das Muster: Markdown verweigert sich, Aussehen zu beschreiben, und verweigert sich, auf Arten erweiterbar zu sein, die ein Dokument an ein Werkzeug binden würden. Beide Verweigerungen sind der Grund, warum eine `.md`-Datei von 2011 heute noch überall funktioniert. Ein Format, das jeden vernünftigen Feature-Wunsch akzeptiert hätte, wäre inzwischen ein schlechteres HTML mit einem kleineren Ökosystem.

## Rohes HTML in Markdown: der Notausgang und der Geruch

Markdown hat immer rohes HTML mitten in einem Dokument erlaubt. Das ursprüngliche Markdown erlaubte es mit Absicht, und CommonMark spezifiziert, wie sich Block-Level- und Inline-HTML verhalten. Das strikte Entweder-Oder im Titel ist also leicht falsch: Sie können Markdown schreiben und für ein Element in HTML wechseln.

Ob das richtig ist, hängt davon ab, wie oft Sie es tun und wonach Sie greifen.

### Wo es die richtige Antwort ist

| Fall | Warum HTML hier richtig ist |
| --- | --- |
| Ein zusammenklappbarer Block — `<details><summary>` | Keine Markdown-Syntax existiert, er degradiert zu sichtbarem Text, und es ist ein einziges Tag-Paar |
| Ein eingebettetes Video oder Karten-Iframe | Markdown hat keine Embed-Syntax; die Alternative ist ein Plugin, das die Datei an einen Renderer bindet |
| Eine Abbildung mit echter Bildunterschrift | `<figure>` und `<figcaption>` tragen Semantik, die `![alt](src)` nicht kann |
| Eine Tabelle mit verbundener Zelle | Die Rastersyntax kann es schlicht nicht ausdrücken; eine HTML-Tabelle ist ehrlich |
| Ein Anker, um mitten im Dokument zu verlinken | `<a id="abschnitt-3"></a>`, wo der Renderer keine Überschriften-IDs erzeugt |
| Ein `lang`-Attribut auf einer zitierten Passage | Nötig für korrekte Screenreader-Aussprache, sonst unmöglich |
| Ein einzelnes Badge oder Inline-Bild mit fester Breite | Selten, eingegrenzt, und für den nächsten Leser offensichtlich |

Der gemeinsame Faden: Das Element ist klein, in sich abgeschlossen, und es gibt kein Markdown-Konstrukt dafür. Es erscheint ein- oder zweimal in einer Datei, ein Leser kann sehen, was es tut, und es zu entfernen würde Bedeutung verlieren statt Dekoration.

### Wo es ein Geruch ist

Rohes HTML sagt Ihnen etwas, wenn es so auftaucht:

- **Hüllen um gewöhnliche Prosa.** `<div class="callout">` mit drei normalen Absätzen darin. Sie implementieren eine Vorlage innerhalb des Inhalts neu, und jetzt hängt jedes Dokument, das einen Callout will, von einer CSS-Klasse ab, die woanders lebt.
- **Inline-Stile.** `<span style="color: #c00">` in einem Absatz. Sie haben Präsentation in eine Datei gesetzt, deren ganzer Wert darin bestand, Präsentation auszuschließen, und es wird falsch sein, sobald die Seite ein dunkles Theme hat.
- **`<br>` zur Abstandssteuerung benutzt.** Meist ein Zeichen, dass das eigentliche Problem ist, wie Zeilenumbrüche und Listen sich verhalten, statt einer fehlenden Funktion.
- **Ganze Abschnitte in HTML.** Ist zwei Drittel der Datei Markup, ist es eine HTML-Datei mit etwas Markdown darin. Benennen Sie sie um und hören Sie auf, so zu tun.
- **Tabellen in HTML ohne strukturellen Grund.** Ist die Tabelle ein einfaches Raster und jemand hat sie wegen der Gestaltung in HTML geschrieben, gehört die Gestaltung in die Vorlage.
- **Alles, was läuft.** `<script>`, `onclick`, `javascript:`-URLs. Ein Dokument, das ausführt, ist kein Dokument.

Zwei praktische Konsequenzen folgen daraus.

Die erste ist Portabilität. Rohes HTML läuft sauber durch zur HTML-Ausgabe und nirgendwo sonst. Konvertieren Sie diese Datei in ein PDF, ein Word-Dokument, reinen Text oder eine Terminal-Ansicht, und das HTML verschwindet entweder, erscheint als wörtliche spitze Klammern, oder bricht den Konverter. Je mehr rohes HTML in einer Datei ist, desto mehr hat sich die Datei still auf ein Ausgabeformat festgelegt.

Die zweite ist Sicherheit, und sie ist nicht theoretisch. Weil Markdown rohes HTML erlaubt, kann eine `.md`-Datei ein `<script>`-Tag, einen `onerror`-Handler oder einen `javascript:`-Link tragen, und ein treuer Konverter reicht alle drei an den Browser weiter. Für Ihre eigenen Notizen spielt das keine Rolle. Für eine README aus einem Repository, das Sie nicht geschrieben haben, ein Dokument, das ein Kunde geschickt hat, oder nutzergenerierten Inhalt entscheidet es, ob Ihre Seite ihren Leser angreift — weshalb [Bereinigen ein eigener Schritt mit eigenen Regeln ist](/blog/sanitising-markdown-safely) statt etwas, das man von einem Konverter erwarten kann. Manche Parser maskieren rohes HTML standardmäßig, andere lassen es durch; Sie müssen wissen, welchen Sie benutzen.

Eine brauchbare Hausregel: Rohes HTML ist erlaubt für Elemente, die Markdown nicht ausdrücken kann, und nicht erlaubt für Aussehen. Muss jemand eine CSS-Klasse hinzufügen, damit es richtig aussieht, gehört es in die Vorlage.

## Review, Mitwirkende und Langlebigkeit

Diese drei Argumente bekommen weniger Aufmerksamkeit als Syntax und entscheiden mehr echte Fälle.

### Prosa diffen

Versionskontrolle difft Zeilen. Das ist die einzige folgenreichste Tatsache über das Schreiben von Dokumenten in einem Repository, und sie erklärt den meisten Vorteil von Markdown.

In Markdown ändert das Ändern eines Satzes die Wörter in diesem Satz. Ein Reviewer sieht die alte Formulierung und die neue nebeneinander und kann beurteilen, ob es eine Verbesserung ist. In HTML kann dieselbe Bearbeitung in geänderten Attributen, einem neu eingerückten Block oder einem verschobenen `</p>` ankommen, und die Aufgabe des Reviewers wird Archäologie. Schlimmer noch, HTML verführt Leute zum Umformatieren, und ein Umformatierungs-Commit, der auch drei Wörter ändert, ist ein Commit, den niemand richtig begutachtet.

Zwei Techniken machen Markdown-Diffs noch besser, und keine davon ist in einer stark ausgezeichneten Datei verfügbar:

- **Ein Satz pro Zeile.** Hart umbrechen an Satzgrenzen statt an einer Spalte. Ein geänderter Satz ist dann ein Ein-Zeilen-Diff, und einen Satz zu verschieben ist ein Move statt einer Umschreibung eines Absatzes. Es sieht etwa einen Tag lang seltsam aus in der Rohdatei.
- **Wort-Level-Diffs.** `git diff --word-diff` zeigt geänderte Wörter statt geänderter Zeilen, was einen neu umgebrochenen Absatz von einer Wand aus Rot und Grün in eine Handvoll Ersetzungen verwandelt.

Kein Trick rettet HTML, denn in HTML ist das Rauschen kein Leerraum, es ist Struktur.

### Wer sonst die Datei bearbeiten muss

Fragen Sie ehrlich, wer die Datei nach Ihnen anfasst, und passen Sie dann das Format an die am wenigsten technische Person auf dieser Liste an. Das ist eine Konstruktionsbeschränkung, keine Höflichkeit.

| Zweiter Autor | Was ihm zugemutet werden kann |
| --- | --- |
| Derselbe Entwickler | Alles. Format ist Geschmackssache |
| Ein anderer Entwickler, später | Markdown. Er wird Ihre Klassennamen nicht lernen, um einen Tippfehler zu korrigieren |
| Ein Produktmanager oder Support-Ingenieur | Markdown, mit verfügbarer Vorschau. HTML-Bearbeitungen werden vermieden oder kaputtgemacht |
| Eine Anwältin oder ein Finanzteam | Keines von beiden: Sie werden in Word arbeiten, und jemand konvertiert |
| Ein Übersetzer | Markdown, und er wird es Ihnen danken — Markup um den Text herum ist, wo Übersetzungsfehler leben |
| Die Öffentlichkeit, per Pull Request | Markdown, bereinigt. Beiträge in HTML sind eine Review-Last und eine Sicherheitsfläche |

Der Fehlermodus bei HTML ist nicht, dass Leute es schlecht bearbeiten. Es ist, dass sie es überhaupt nicht bearbeiten. Sie schicken Ihnen eine Nachricht mit der Bitte, ein Wort zu ändern, oder sie ändern nichts und lassen das Dokument veralten. Jedes Dokumentationsset, das an Veralten gestorben ist, starb teilweise an einem Format, das kleine Korrekturen riskant erscheinen ließ.

### Langlebigkeit

Eine Markdown-Datei ist eine Textdatei, die mit gar keiner Software korrekt gelesen wird. Öffnen Sie sie in fünfzehn Jahren im Notepad, und die Überschriften sind immer noch sichtbar Überschriften. Das ist eine ungewöhnliche Eigenschaft, und sie kommt von der Weigerung des Formats, Aussehen zu kodieren.

HTML ist ebenfalls dauerhaft — Browser rendern altes Markup weiterhin, und eine eigenständige HTML-Datei mit ihren Stilen inline ist eines der besseren langfristigen Dokumentformate, die es gibt. Die Probleme kommen von dem, wovon modernes HTML tendenziell abhängt, statt von HTML selbst: ein Stylesheet auf einem CDN, das aufhört aufzulösen, eine Schriftart von einem Dienst, der seine Bedingungen geändert hat, ein Skript aus einem Paket, das nicht mehr existiert, Klassennamen, die ohne das Framework, das sie definiert hat, nichts bedeuten. Eine Seite, die vier Dinge über das Netzwerk holt, ist vier künftige Ausfälle von unlesbar entfernt.

Die Langlebigkeitsreihenfolge ist also: Markdown-Quelle zuerst, eigenständiges HTML zweitens, HTML mit externen Abhängigkeiten weit dahinter, und alles, was ein Build-System braucht, um überhaupt zu rendern, zuletzt. Das ist ein weiteres Argument dafür, Markdown als Quelle der Wahrheit zu halten und HTML als Ausgabe zu behandeln — das Dauerhafte ist die Datei, die Sie noch lesen können, und das Verzichtbare ist die Datei, die Sie neu erzeugen können.

## Wo „Markdown schreiben und konvertieren“ scheitert, und was es kostet

Der übliche Rat auf dieser Seite ist meistens der richtige Rat. Es lohnt sich, konkret zu sein, wann er es nicht ist, denn das Scheitern ist selten dramatisch — es ist eine langsame Anhäufung von Umgehungen, bis jemand bemerkt, dass die Pipeline mehr kostet, als die Dokumente wert sind.

**Wenn die Ausgabe von Hand bearbeitet wird.** In dem Moment, in dem jemand das erzeugte HTML öffnet und etwas darin repariert, hört das Markdown auf, die Quelle der Wahrheit zu sein, und Sie haben zwei divergierende Dateien. Die nächste Konvertierung verwirft still seine Korrektur. Das ist die häufigste Art, wie ein Markdown-zu-HTML-Workflow verrottet, und die einzige Verteidigung ist eine Regel, dass erzeugte Dateien nie bearbeitet werden, durchgesetzt, indem man sie irgendwo offensichtlich Verzichtbares legt.

**Wenn das Design Kontrolle pro Element braucht.** Enthält das Briefing „dieses Pull Quote ist 60 % breit, rechtsbündig, mit der Markenfarbe des Kunden dahinter“, wird Markdown Sie bei jedem Element bekämpfen. Sie können es mit rohem HTML und Inline-Stilen ausdrücken, an welchem Punkt Sie eine HTML-Datei mit Extraschritten haben. Kosten: Stunden an Umgehungen, und eine Datei, die niemand pflegen kann.

**Wenn Exaktheit vertraglich ist.** Alles mit spezifiziertem Layout — eine behördliche Einreichung, ein Rechnungsformat, das das System eines Kunden parst, ein Zertifikat mit einem Unterschriftsfeld, das an fester Position sitzen muss. Kosten: Der ganze Rendering-Pfad muss kontrolliert werden, und Markdown-Kontrolle eines Rendering-Pfads ist Kontrolle einer Vorlage, einen Schritt entfernt.

**Wenn der Kanal seinen eigenen Dialekt hat.** E-Mail, oben behandelt. Auch In-App-Rich-Text, gespeichert als HTML, und alles, das von einem System konsumiert wird, das spezifisches Markup erwartet. Kosten: Die saubere, standardkonforme Ausgabe eines Konverters ist genau die falsche Ausgabe.

**Wenn das Dokument interaktiv ist.** Keine Menge an Konvertierung erzeugt Verhalten. Kosten: keine, wenn Sie es früh bemerken. Erheblich, wenn Sie vierzig Seiten Markdown schreiben, bevor Sie entdecken, dass Abschnitt 9 ein funktionierendes Formular braucht.

**Wenn der Dialekt driftet.** Ihr Markdown rendert korrekt auf Ihrem Code-Host und falsch in Ihrem Build, weil die beiden verschiedene Parser laufen lassen. Fußnoten, Task-Listen, verschachtelte Listeneinrückung und Autolinks sind die üblichen Verdächtigen. Kosten: eine Klasse von Bug, die nur in der veröffentlichten Ausgabe auftaucht, was der schlechteste Ort ist, einen zu finden.

**Wenn die Datei wirklich riesig ist.** Ein einzelnes Dokument von vielen Megabyte passt schlecht zu einer browserseitigen Konvertierung, und ab einem Punkt passt es schlecht dazu, ein einziges Dokument zu sein. Kosten: teilen Sie es auf, oder verschieben Sie die Konvertierung in einen Build-Schritt, wo Speicher kein Tab ist.

**Wenn die Pipeline selbst zur Arbeit wird.** Ein Konverter, eine Vorlage und ein Skript sind in Ordnung. Vier Konverter, eine Plugin-Kette, ein eigener Lua-Filter und ein Container, um ihn auszuführen, sind ein Projekt, und das Projekt braucht einen Besitzer. Kosten: Wer es besitzt, kann nicht gehen ohne Übergabe, und Dokumentationspipelines enden gerne im Besitz der einen Person, die die Vorlage verstanden hat.

Nichts davon ist ein Argument gegen Markdown für Prosa. Es ist ein Argument dafür, vorher zu bemerken, welcher der beiden Jobs — Schreiben oder Präsentieren — die Datei dominiert.

## So wählen Sie

Fünf Kriterien, jedes mit angehängter Konsequenz.

1. **Benennen Sie das endgültige Artefakt vor der ersten Zeile.** Ist es eine Webseite, ein PDF oder eine Datei in einem Repository, schreiben Sie Markdown; ist es eine E-Mail, ein gedrucktes Dokument mit festem Layout oder eine Oberfläche, schreiben Sie HTML. Das falsch zu machen kostet eine Neufassung, und die Neufassung passiert immer später, als sie sollte.
2. **Passen Sie das Format an die am wenigsten technische Person an, die es bearbeiten wird.** Muss ein Support-Ingenieur oder ein Übersetzer kurzfristig einen Satz korrigieren, bedeutet HTML, dass er stattdessen Sie fragen wird, und das Dokument driftet zwischen den Anfragen auseinander.
3. **Nehmen Sie an, jede Änderung wird von jemandem in Eile begutachtet.** Markdown lässt einen geänderten Satz wie einen geänderten Satz aussehen; HTML lässt ihn wie eine geänderte Datei aussehen, und Reviewer genehmigen, was sie nicht lesen können.
4. **Zählen Sie die interaktiven Teile.** Ein `<details>`-Block ist ein Notausgang; ein Formular, ein Tab-Streifen oder ein Diagramm bedeutet, das Dokument ist eine Anwendung, und Markdown ist das falsche Quellformat dafür.
5. **Entscheiden Sie, wer die Gestaltung besitzt, und schreiben Sie es auf.** Ist es die Vorlage, halten Sie Präsentation vollständig aus dem Inhalt heraus; ist es der Autor, haben Sie HTML gewählt, ob die Dateiendung es nun sagt oder nicht — und die nächste Person, die diese Datei bearbeitet, erbt Ihr CSS zusammen mit Ihrer Prosa.

## Fazit

Schreiben Sie standardmäßig Markdown, konvertieren Sie es, und behalten Sie das HTML als Build-Produkt, das Sie nie bearbeiten — diese Anordnung gibt Ihnen überprüfbare Prosa, Bearbeiter, die keine Angst vor der Datei haben, und Ausgabe, die überall öffnet, was das meiste von dem ist, was Menschen sich von einem Dokument-Workflow wünschen. Wechseln Sie bewusst und vollständig zu HTML, wenn das Ziel es verlangt: E-Mail-Vorlagen, die die eigene Rendering-Engine eines Mail-Clients überstehen müssen, Dokumente, deren Seitenlayout Teil der Spezifikation ist, und alles, mit dem der Leser interagiert, statt es zu lesen. Ist der Schritt, den Sie brauchen, der gewöhnliche — Markdown rein, eine vollständige eigenständige Seite raus, nichts hochgeladen —, [macht TransformPipe das im Browser](/), kostenlos und ohne Installation; ist es eine der Ausnahmen, verbringen Sie die Zeit in HTML und hören Sie auf, sich dafür zu entschuldigen.

## FAQ

### Ist Markdown besser als HTML?

Keines ist besser; sie beantworten verschiedene Fragen. Markdown ist ein Schreibformat, optimiert für Menschen, die Text bearbeiten und Änderungen begutachten, und HTML ist ein Zustellungsformat, optimiert für Kontrolle darüber, was ein Browser oder Client darstellt. Die übliche Anordnung — Markdown schreiben, zu HTML konvertieren — nutzt jedes für die Aufgabe, für die es gut ist.

### Kann ich HTML innerhalb einer Markdown-Datei benutzen?

Ja. Das ursprüngliche Markdown erlaubte rohes HTML mit Absicht, und CommonMark spezifiziert, wie es sich verhält, ein `<details>`-Block, ein Iframe oder eine Tabelle mit verbundenen Zellen kann also mitten in einem Markdown-Dokument sitzen. Nutzen Sie es für Elemente, die Markdown nicht ausdrücken kann, nicht für Aussehen, und seien Sie sich bewusst, dass rohes HTML nur die Konvertierung nach HTML übersteht — andere Ausgabeformate lassen es fallen oder verstümmeln es.

### Ist Markdown sicher, wenn es HTML enthalten kann?

Nur, wenn etwas es bereinigt. Weil rohes HTML erlaubt ist, kann eine `.md`-Datei `<script>`, `onerror=` oder eine `javascript:`-URL tragen, und ein treuer Renderer wird alle drei an den Browser weitergeben. Manche Parser maskieren rohes HTML standardmäßig und andere lassen es durch, prüfen Sie also, welches Verhalten Ihrer hat, bevor Sie eine Datei konvertieren, die Sie nicht selbst geschrieben haben.

### Sollte ich meine Website in Markdown oder HTML schreiben?

Schreiben Sie den Inhalt in Markdown und die Vorlage in HTML. Jeder statische Seitengenerator funktioniert aus einem Grund so: Markup für hundert Seiten von Hand zu verfassen ist unangenehm und inkonsistent, während eine Vorlage von Hand zu verfassen ein normaler Arbeitsaufwand ist. Seiten, die größtenteils Oberfläche statt Prosa sind — eine Preistabelle mit einem Umschalter, ein Anmeldeprozess — sind die Ausnahme und gehören in HTML.

### Warum kann ich das Layout in Markdown nicht kontrollieren?

Weil Layout Präsentation ist, und Markdown entworfen wurde, um Präsentation auszuschließen, damit eine Datei sich in einem Terminal, einem Editor, einem Code-Host und einer konvertierten Seite sinnvoll darstellt. Es gibt keine Syntax für Spalten, Seitenumbrüche oder Breiten, und sie über Inline-HTML hinzuzufügen bindet das Dokument an ein einziges Ausgabeformat. Ist Layout Teil der Anforderung, ist das das Signal, HTML zu schreiben.

### Verliert das Konvertieren von Markdown zu HTML etwas?

Struktur überlebt; alles, was der Dialekt nicht unterstützt, nicht. Tabellen, Task-Listen, Durchgestrichenes und Autolinks brauchen GitHub Flavored Markdown statt reines CommonMark, und Fußnoten, Definitionslisten und Mathematik sind Erweiterungen, die viele Parser ignorieren. Konvertieren Sie eine repräsentative Datei und prüfen Sie die Tabellen und Listen, bevor Sie sich auf ein Werkzeug festlegen.

### Welches Format sollte Dokumentation nutzen, wenn das Team nicht technisch ist?

Markdown, aber nur mit einer Vorschau davor — ein Markdown-Editor, ein Wiki, das während des Tippens rendert, oder eine Pull-Request-Vorschau. Nicht-technische Autoren zu bitten, Syntax zu schreiben, die sie nicht gerendert sehen, ist der Grund, warum manche Teams schließen, Markdown funktioniere nicht für sie, wenn das eigentliche Problem die fehlende Vorschau war — und ist die Antwort, dass das Team lieber ganz bei Word bliebe, ist [welches der beiden Formate die Quelle besitzen sollte](/blog/markdown-vs-docx-for-documentation) die Entscheidung, die vor jedem Werkzeug zu klären ist.
