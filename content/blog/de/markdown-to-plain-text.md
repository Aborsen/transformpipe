---
title: "Markdown zu Text: Syntax entfernen, Wörter behalten"
description: "Markdown in reinen Text umwandeln, ohne ihn zu zerstören: warum ein regulärer Ausdruck an Fences, Tabellen und Referenzlinks scheitert – und was stattdessen hilft"
date: 2026-08-23
tag: Konvertieren
keywords: markdown zu text, markdown in text umwandeln, markdown formatierung entfernen, markdown bereinigen, markdown zu txt, pandoc reiner text, markdown wörter zählen
---

### Kurzfassung

Nehmen Sie einen Parser, nie einen regulären Ausdruck: eingezäunter Code, Backslash-Escapes, Tabellen, Referenzlinks und rohe HTML-Blöcke bringen die Mustersuche alle zum Scheitern, und sie tun es lautlos. Für ein ganzes Dokument ist `pandoc -t plain` der kürzeste korrekte Weg, mit `--wrap=none`, wenn die Ausgabe in einen Diff oder ein Grep geht. Innerhalb eines JavaScript- oder Python-Builds gehen Sie den Token-Strom entlang, den Sie ohnehin schon parsen — `strip-markdown` für remark, `md.parse()` für markdown-it —, denn jedes Element braucht eine Entscheidung, und die Entscheidungen sollten in Ihrem Code sichtbar sein. Nach HTML zu rendern und es dann mit `lynx -dump` oder dem Paket `html-to-text` einzuebnen ist der andere ehrliche Weg, und der einzige, der rohes HTML richtig behandelt.

Markdown ist darauf ausgelegt, als Text lesbar zu sein, und genau deshalb unterschätzen Leute diese Konvertierung. Die Datei sieht schon wie Prosa aus. Ein paar Sternchen entfernen, die Doppelkreuze weglassen, und schon ist es reiner Text — das ist die Intuition, und sie übersteht den Kontakt mit etwa vier Dateien.

Dann stoßen Sie auf eine mit einem eingezäunten Python-Block voller `*args`, einer Tabelle, deren Zahlen nur neben ihren Spaltenüberschriften etwas bedeuten, einem Satz von Referenzlinks, die unten definiert sind, und einem `<details>`-Element, das um die Hälfte des Inhalts gewickelt ist. Jetzt ist jedes Sternchen, das Sie entfernen, eine Entscheidung. Manche davon sind Formatierung. Manche davon sind jemandes Code. Eines davon ist maskiert und bedeutet ein wörtliches Sternchen auf der Seite.

Die eigentliche Frage ist nicht, wie man das Markup löscht. Sie ist, was Sie mit der Information tun, die das Markup getragen hat. Eine Überschrift ist eine Überschrift wegen ihrer Größe; in einer `.txt`-Datei gibt es keine Größe. Ein Listenelement ist ein Element wegen seines Aufzählungszeichens; entfernen Sie das Zeichen, und drei Elemente verschmelzen zu einem Satz, der etwas sagt, das niemand geschrieben hat. Das ist die Aufgabe: nicht Löschen, sondern eine Reihe von Entscheidungen darüber, was die Struktur trägt, sobald kein Markup mehr übrig ist, das sie tragen könnte.

## Kurzvergleich: die Spickzettel-Tabelle

| Weg | Am besten für | Was er braucht | Was mit Tabellen passiert | Lizenz und Preis |
| --- | --- | --- | --- | --- |
| `pandoc -t plain` | Ein ganzes Dokument, originalgetreu | Eine Pandoc-Installation | Bleibt als Text-Tabelle erhalten, mit Leerzeichen aufgefüllt | Kostenlos, GPL |
| `pandoc -t plain --wrap=none` | Prosa diffen, greppen, eine Zeile pro Absatz | Dasselbe | Dasselbe | Kostenlos, GPL |
| remark + `strip-markdown` | Ein Schritt in einem Node-Build | Node, drei Pakete | Standardmäßig vollständig entfernt | Kostenlos, MIT |
| `mdast-util-to-string` | Eine Zeichenkette für ein Suchindexfeld | Node, ein Markdown-Parser | Zellentext ohne Trennzeichen aneinandergehängt | Kostenlos, MIT |
| markdown-it-Tokens | Sie rendern schon mit markdown-it | Node | Was auch immer Sie schreiben, Token für Token | Kostenlos, MIT |
| markdown-it-py-Tokens | Dasselbe, in Python | Python | Was auch immer Sie schreiben | Kostenlos, MIT |
| `remove-markdown` | Eine Vorschauzeile oder ein Schnipsel | Node, ein kleines Paket | Hinterlässt Pipes in Randfällen | Kostenlos, MIT |
| Nach HTML rendern, dann `lynx -dump` | Ein Dokument im Terminal lesen | Lynx installiert | Als Text-Tabelle bei `-width` Spalten gezeichnet | Kostenlos, GPL |
| Nach HTML rendern, dann `w3m -dump` | Dasselbe, ein anderer Renderer | w3m installiert | Als Text-Tabelle bei `-cols` Spalten gezeichnet | Kostenlos, Open Source |
| `html-to-text` (npm) | Der Textteil einer E-Mail | Node | Ein Formatierer pro Selektor, `dataTable` für echte Tabellen | Kostenlos, MIT |
| BeautifulSoup `get_text()` | Eine schnelle Extraktion in Python | Python, bs4 | Abgeflacht, Grenzen ohne Trennzeichen verloren | Kostenlos, MIT |
| `html2text` (Python) | Sie wollten eigentlich Markdown | Python | Markdown-Pipe-Tabellen — es gibt Markdown aus | Kostenlos, GPLv3 |
| Der Text-Download eines Browser-Konverters | Eine Datei, jetzt, keine Installation | Ein Browser | Die Entscheidung des Konverters, nicht Ihre | Kostenlos |
| `sed`, `awk`, ein selbst geschriebener regulärer Ausdruck | Nichts, was Sie behalten wollen | Nichts | Lautlos zerstört | Kostenlos |

Lizenzen und Optionen wie auf pandoc.org, github.com und linux.die.net dokumentiert (geprüft am 8. September 2026).

## Markup zu entfernen ist eine Reihe von Entscheidungen, keine Löschung

Vor jedem Werkzeug die Liste der Entscheidungen. Jede davon hat eine vertretbare Antwort und eine für Ihren Fall falsche, und ein Konverter, der Sie seine Wahl nicht sehen lässt, hat sie trotzdem getroffen.

| Element | Was das Markup trug | Was reiner Text dagegen tun kann |
| --- | --- | --- |
| Überschrift | Rang, und ein optischer Umbruch | Eine eigene Zeile mit Leerzeilen drumherum, Großbuchstaben, oder eine gestrichelte Unterstreichung |
| Listenelement | „Das ist eines von mehreren“ | Ein `- `-Zeichen behalten, oder die Grenze zwischen Elementen verlieren |
| Geordnetes Element | Eine Zahl, die Inhalt ist | Die Zahl behalten; sie wird anderswo referenziert |
| Link | Text plus ein Ziel | Nur Text, Text mit der URL inline, oder eine nummerierte Referenzliste |
| Bild | Alt-Text und eine Datei | Der Alt-Text, oder nichts |
| Tabelle | Zeilen- und Spaltenzuordnung | Aufgefüllte Spalten, eine Zeile pro Reihe, oder ein Feld-pro-Zeile-Block |
| Codeblock | „Fassen Sie nichts davon an“ | Wörtlich, nie umgebrochen, nie entfernt |
| Blockzitat | Jemand anders hat das gesagt | `> ` oder eine Einrückung behalten; weglassen, und es wird Ihr eigener Satz |
| Betonung | Nachdruck, oder ein definierter Begriff | Nichts, oder Großbuchstaben, oder wieder Unterstriche |
| Fußnote | Eine Markierung und eine Notiz anderswo | Eine `[1]`-Markierung und eine Liste am Ende |

### Überschriften

Einer Überschrift in reinem Text steht kein Rang zur Verfügung. Die üblichen Antworten: Sie auf eine eigene Zeile setzen, mit einer Leerzeile darüber und darunter, und die Position die Arbeit machen lassen; sie in Großbuchstaben setzen; oder sie mit Bindestrichen unterstreichen. Zu beachten: Die dritte Antwort hat still und leise wieder Markup eingeführt — eine Textzeile mit `---` darunter ist eine Setext-Überschrift, gültiges Markdown, und Ihre `.txt`-Datei verwandelt sich jetzt wieder zurück in ein Dokument.

Position allein ist die sicherste Wahl und die schwächste. Ein Dokument mit sechs Verschachtelungsebenen flacht zu einem Strom ab, in dem eine H2 und eine H4 identisch aussehen, und ein Leser vier Bildschirme weiter unten kann nicht sagen, in welchem Abschnitt er sich befindet. Wenn die Hierarchie der Inhalt ist — eine Spezifikation, ein Vertrag, ein Runbook —, nummerieren Sie die Überschriften, bevor Sie abflachen, denn die Nummern überleben, wo die Größen es nicht tun.

### Listen

Behalten Sie das Aufzählungszeichen. Das überrascht Leute, die „überhaupt kein Markup“ wollen, aber `- ` und `* ` waren Konventionen für Listen in reinem Text in E-Mails, lange bevor Markdown existierte, und sie lesen sich für einen Menschen und für die meisten Tokenisierer als Listen. Entfernen Sie sie, und aufeinanderfolgende Elemente verschmelzen: Drei Elemente, die „Festplatte prüfen“, „Dienst neu starten“, „Ticket anlegen“ lauten, werden zu einer Zeile, die sich wie eine einzige Anweisung liest.

Geordnete Listen sind strenger. Die Zahl ist Inhalt, nicht Dekoration, denn etwas anderes im Dokument sagt „falls Schritt 3 fehlschlägt“. Ein Konverter, der neu nummeriert oder Zahlen zugunsten von Aufzählungszeichen fallen lässt, hat das Dokument verändert. Verschachtelung braucht ebenfalls ihre Einrückung erhalten, was Sie Spalten am rechten Rand kostet — und wenn Sie zusätzlich bei 72 Zeichen umbrechen, muss die Einrückung aus diesem Budget kommen. Die [Unterscheidung zwischen lockeren und engen Listen](/blog/markdown-line-breaks-and-lists) entscheidet, ob Elemente Leerzeilen zwischen sich bekommen, und es lohnt sich, das bewusst festzulegen, statt es zu übernehmen.

### Links

Drei Optionen, keine vierte. Die URL weglassen und den Text behalten, was kurz ist und den Leser nichts nachverfolgen lässt. Beides inline behalten als `das Deployment-Handbuch (https://example.com/docs/deploy)`, was vollständig ist und jeden Satz mit einer Tracking-URL in ein Durcheinander verwandelt. Oder sie als nummerierte Referenzen am Ende sammeln, was Lynx standardmäßig tut und was seine `-nolist`-Option abschaltet.

Wählen Sie nach Empfänger. Für eine E-Mail, die ein Mensch liest, ist die Referenzliste am Ende die höfliche Version. Für einen Suchindex lassen Sie die URLs ganz weg — `utm_source=newsletter` zu indizieren hilft niemandem, und die Tokens, die sie hinzufügt, konkurrieren mit den Wörtern, die zählen. Für eine Wortzählung lassen Sie sie weg, sonst zählt Ihre Zählung eine 120 Zeichen lange URL als ein Wort und eine gekürzte als fünf.

### Tabellen

Das ist die Entscheidung, die sich nicht aufschieben lässt, und die, bei der die meisten Werkzeuge für Ihren Fall danebenliegen. Aufgefüllte Spalten sehen richtig aus, und das nur in einer Festbreitenschrift bei einer Breite, die nicht schmaler ist als die längste Zeile; weitergeleitet in einen Mail-Client mit einer proportionalen Schrift, bricht die Ausrichtung zusammen und die Zahlen verwürfeln sich. Eine Zeile pro Reihe mit einem Trennzeichen übersteht jede Breite und verliert die Zuordnung zur Kopfzeile, sobald die erste Zeile aus dem Bild gescrollt ist. Ein Feld-pro-Zeile-Block — `Region: EMEA`, `Kosten: 40`, eine Leerzeile zwischen den Datensätzen — ist ausführlich, liest sich bei jeder Breite korrekt, und ist die einzige Version, die vorgelesen Sinn ergibt.

Wofür Sie sich auch entscheiden, prüfen Sie, was Ihr Werkzeug getan hat, bevor Sie ihm vertrauen, denn [Tabellen sind bei jeder Konvertierung das Erste, was bricht](/blog/markdown-tables-that-survive-conversion), und der Fehlschlag sieht wie ein Erfolg aus. Und denken Sie daran, dass Pipe-Tabellen überhaupt nicht in der CommonMark-Spezifikation stehen — sie kamen mit [GitHub Flavored Markdown und den anderen Dialekten](/blog/commonmark-gfm-and-the-flavours) — ein Parser, der striktes CommonMark ausführt, hat also von vornherein nie eine Tabelle gesehen. Er sah einen Absatz voller Pipe-Zeichen, und genau das wird er Ihnen zurückgeben.

### Code, Zitate und der Rest

Codeblöcke kommen wörtlich heraus, oder sie kommen falsch heraus. Kein Umbruch — ein umgebrochener Shell-Befehl ist ein kaputter Shell-Befehl. Niemals Entfernen darin, aus Gründen, die der nächste Abschnitt ausführlich behandelt. Für manche Ziele ist die richtige Antwort, Code ganz wegzulassen: Ein 400-Token-Codebeispiel auf einer 600-Wörter-Seite wird einen Suchindex dominieren und die Seite zu Anfragen passen lassen, zu denen sie nichts zu sagen hat. [Was ein eingezäunter Block eigentlich ist](/blog/code-blocks-in-markdown) zählt hier, denn es gibt mehr Arten, einen zu schreiben, als die meisten Entferner kennen.

Blockzitate brauchen ihr `> ` oder eine erhaltene Einrückung. Die Markierung wegzulassen macht aus einem Zitat Ihre eigene Behauptung, was eine Bedeutungsänderung ist, keine Formatierungsänderung. Bilder reduzieren sich auf ihren Alt-Text oder auf nichts, und wenn der Alt-Text leer ist — dekoratives Bild, korrekt markiert —, ist die ehrliche Ausgabe überhaupt nichts.

## Warum der reguläre Ausdruck, den Sie gerade schreiben wollten, falsch ist

Das Muster ist immer dasselbe. Jemand schreibt sechs Ersetzungen, testet sie an einer README, liefert sie aus, und elf Monate später fehlt in der Rechnung eines Kunden eine Zeile. Reguläre Ausdrücke können Markdown nicht parsen, weil Markdown kontextsensitiv ist: Was ein Zeichen bedeutet, hängt davon ab, in welchem Block es steht, und ein Muster hat keine Ahnung, in welchem Block es steht.

Hier sind die fünf Fälle, die es zum Scheitern bringen, in der Reihenfolge, in der sie Sie beißen werden.

### Eingezäunter Code

Ein Zaun ist kein Absatz, und nichts darin ist Markup. Pythons `*args` und `**kwargs`, Cs `#include`, ein Shell-Glob `*.log`, ein Diff, dessen Zeilen mit `-` beginnen, ein snake_case-Bezeichner voller Unterstriche, eine Shell-Pipeline aus `|`-Zeichen — ein Entferner, der Betonungsmarkierungen global entfernt, verdirbt jedes einzelne davon. Das ist schlimmer, als das Markup drinzulassen, denn die Ausgabe behauptet immer noch, Code zu sein, und ist jetzt falsch. Niemand merkt es, bis er es ausführt.

Der Zaun selbst ist vielfältiger, als das naive Muster erwartet:

```text
~~~js
const total = a | b;
~~~
```

CommonMark erlaubt drei oder mehr Backticks oder drei oder mehr Tilden, einen Info-String nach dem öffnenden Lauf, und bis zu drei Leerzeichen Einrückung davor. Ein Zaun kann kürzere Läufe seines eigenen Zeichens enthalten, ohne zu schließen. Innerhalb eines Listenelements ist er bis zur Inhaltsspalte des Elements eingerückt. Und unabhängig von alldem ist eine Einrückung von vier Leerzeichen selbst ein Codeblock, ganz ohne Zaun irgendwo. Ein auf dreifache Backticks am Zeilenanfang zugeschnittener regulärer Ausdruck übersieht Tilden-Zäune, eingerückte Zäune und eingerückte Codeblöcke — drei Arten, Markup-Behandlung in jemandes Quellcode durchsickern zu lassen.

### Maskierte Zeichen

In CommonMark macht ein Backslash vor einem ASCII-Satzzeichen dieses Zeichen wörtlich. `\*keine Betonung\*` ist Prosa über Sternchen. Ein Entferner, der Backslashes entfernt, hinterlässt `*keine Betonung*`, was das nächste Werkzeug in der Kette als Betonung lesen wird. Ein Entferner, der Sternchen entfernt, hinterlässt `\keine Betonung\`. Beides ist falsch, in entgegengesetzte Richtungen, und keiner der beiden Fehler ist in einem Diff der Ausgabe sichtbar, es sei denn, Sie suchen gezielt danach.

HTML-Entities sind dasselbe Problem mit einem anderen Hut auf. Ein Parser dekodiert `&amp;` zu `&`, `&copy;` zum Copyright-Zeichen und `&#42;` zu einem Sternchen. Ein regulärer Ausdruck lässt den Entity-Text einfach in Ihrer Textdatei stehen, der Leser bekommt also `Smith &amp; Sons` im E-Mail-Text, und die Wortzählung zählt `&amp;` als ein Wort. `\\` — ein maskierter Backslash — ist der Fall, der die clevere Lösung erwischt, denn jetzt müssen Sie wissen, ob der Backslash, den Sie betrachten, selbst durch den davor maskiert wurde.

### Tabellen

Eine Zeile aus Pipes ist nur dann eine Tabelle, wenn die Trennzeile da ist. Ohne `| --- | --- |` unter der Kopfzeile ist es ein Absatz. Mit ihr sind die Pipes Struktur. Ein Muster, das `|`-Zeichen auf Sicht löscht, zerstört beides: Der Absatz verliert seine Interpunktion, und die Tabelle wird zu einer Wortfolge ohne Grenzen. „EMEA 40 3 Wochen“ waren einmal vier Zellen mit Kopfzeilen, und es gibt keine Möglichkeit wiederherzustellen, welche Zahl welche war.

Zellen machen es noch komplizierter. Eine Pipe innerhalb einer Zelle wird als `\|` maskiert. Eine Pipe innerhalb von Inline-Code ist überhaupt kein Trennzeichen. Ausrichtungs-Doppelpunkte — `:---`, `---:`, `:---:` — sind Struktur, die keine Wörter trägt und verschwinden muss. Und Zellen enthalten eigenes Inline-Markup, was auch immer Sie also über Links und Betonung entschieden haben, gilt auch innerhalb jeder Zelle.

### Referenzlinks

Jeder reguläre Ausdruck behandelt `[text](url)`. Markdown hat vier weitere Linkformen, und alle sind in Dateien üblich, die von Menschen geschrieben wurden, die sie von Hand bearbeiten:

```text
See the [deployment guide][deploy] and the [runbook].

[deploy]: https://example.com/docs/deploy "Deploy"
[runbook]: https://example.com/docs/runbook
```

Die vollständige Referenzform `[text][id]`, die zusammengefallene Form `[text][]` und die Kurzform `[text]` zeigen alle auf eine Definition, die Hunderte von Zeilen entfernt sein kann, meist am Ende der Datei. Ein Muster, das nur Inline-Links kennt, lässt die eckigen Klammern in der Prosa stehen und den Definitionsblock als abschließenden Absatz nackter URLs zurück — genau die Form von Ausgabe, die bei einer Stichprobe gut aussieht und für jeden, der sie erhält, offensichtlich kaputt ist. Fügen Sie spitze-Klammer-Autolinks `<https://example.com>`, GFMs nackte-URL-Autolinking und Bildsyntax hinzu, die das naive Muster in `!alt text` verwandelt, und die Zahl der zu behandelnden Formen ist nicht fünf, sie liegt eher bei einem Dutzend.

### HTML-Blöcke

Markdown erlaubt rohes HTML, eine `.md`-Datei kann also alles enthalten, was HTML kann. In der Praxis enthält sie `<details>` und `<summary>` um einklappbare Abschnitte, `<img>` mit einem Breitenattribut, `<br>` für Zeilenumbrüche, die die Syntax nicht hergibt, `<sub>` und `<sup>`, ganze von Hand geschriebene `<table>`-Elemente, und `<!-- Kommentare -->`, die nie veröffentlicht werden sollten.

Tag-Entfernung mit einem Muster scheitert an alldem. `<!-- TODO: check these numbers with legal -->` ist ein Kommentar, dessen Text ein regulärer Ausdruck bereitwillig zu Prosa befördert, in einem Dokument, das Sie gerade jemandem schicken wollen. Ein `<script>`-Element ist schlimmer: Entfernen Sie die Tags, und der JavaScript-Körper wird zu einem Absatz. Attributwerte sickern genauso durch — ein Entferner, der `<`-bis-`>`-Spannen entfernt, muss trotzdem entscheiden, ob der Text eines `alt`-Attributs Inhalt ist, und ein Muster kann ein Attribut nicht von einem Textknoten unterscheiden. Alles mit rohem HTML in einer Datei, die Sie nicht selbst geschrieben haben, gehört einem echten HTML-Parser, was eines der stärksten Argumente für den Render-dann-Einebnen-Weg weiter unten ist.

Es gibt eine ehrliche Verwendung für einen auf regulären Ausdrücken basierenden Entferner: eine Vorschauzeile. Wenn Sie die ersten 140 Zeichen eines Dokuments für eine Karte oder ein Suchergebnis brauchen, ist ein falsches Sternchen kosmetisch und der Fehler sichtbar. Überall dort, wo der Text stimmen muss, nehmen Sie einen Parser.

## Wo reiner Text wirklich die richtige Ausgabe ist

Reiner Text ist keine Abwertung von HTML. Für mehrere Aufgaben ist er das Format, das das empfangende System tatsächlich akzeptiert, und diesen Systemen stattdessen Markdown zu geben ist der Fehler.

**E-Mail in reinem Text.** Eine wohlgeformte HTML-E-Mail ist eine `multipart/alternative`-Nachricht, deren Teile vom am wenigsten originalgetreuen zuerst geordnet sind (RFC 2046), der `text/plain`-Teil kommt also vor dem HTML-Teil. Wenn Sie diesen Teil bauen, indem Sie die Markdown-Quelle hineinkopieren, liest Ihr Empfänger `**Wichtig**` und `[die Rechnung](https://…)` mit sichtbarer Interpunktion. RFC 5322 empfiehlt Zeilen von höchstens 78 Zeichen, brechen Sie also bei 72 um und lassen Sie Platz für die `> `-Zitatzeichen, die eine Antwort hinzufügen wird; wenn Sie wollen, dass der Client die Absätze selbst neu umbricht, ist genau dafür `format=flowed` (RFC 3676) da.

**Wortzählungen.** `wc -w` auf einer rohen `.md`-Datei zählt Tabellen-Pipes, Zaunzeilen, Referenzdefinitionen und jede URL als Wörter. Eine Datei, die 900 Wörter meldet, könnte 700 Wörter Prosa und 200 Wörter Syntax und Code sein. `pandoc -t plain file.md | wc -w` liefert die Zahl, der ein Mensch zustimmen würde, und Codeblöcke vor dem Zählen wegzulassen ändert sie erneut — weshalb eine Wortzählung nur zusammen mit den Flags, die sie erzeugt haben, aussagekräftig ist.

**Suchindizierung.** Rohes Markdown zu tokenisieren steckt `**`, `](` und `https` in Ihren Index, lässt Anfragen innerhalb von Codebeispielen matchen und erzeugt Snippets mit für den Nutzer sichtbarer Syntax. Static-Site-Suchwerkzeuge umgehen das, indem sie das gebaute HTML statt der Quelle indizieren, was dieselbe Einsicht vom anderen Ende her ist: indizieren Sie, was der Leser sieht. Wenn Sie den Index selbst bauen, ebnen Sie zuerst ein, und entscheiden Sie explizit, ob Codeblöcke durchsuchbarer Inhalt sind oder Rauschen.

**Sprache und Vorlesen.** Eine Text-zu-Sprache-Engine nimmt eine Zeichenkette entgegen. Geben Sie ihr Markdown, und Sie bekommen vorgelesene Interpunktion oder Markierungen, die lautlos an die Wörter drumherum geklebt sind. Hier lohnt sich allerdings Genauigkeit: Im Web schlägt semantisches HTML flachen Text jedes Mal — ein Screenreader will echte Überschriften, Listen und Tabellenzellen als Elemente, und sie zu Text abzuflachen entfernt die Navigation, auf die sich der Leser verlässt. Der Reiner-Text-Fall ist für Pipelines, die eine Zeichenkette entgegennehmen, nicht für Seiten, die ein Mensch öffnet.

**Terminal-Ausgabe.** Eine Commit-Nachricht, ein `--help`-Text, eine CI-Log-Zeile, ein Benachrichtigungstext. Keiner davon rendert Markup, und in alle wird trotzdem Markdown hineinkopiert. Zu beachten: `glow` und `mdcat` machen die umgekehrte Aufgabe — sie rendern Markdown für ein Terminal mit ANSI-Escapes und Kastenzeichnung —, was schön zu lesen ist und keine `.txt`-Datei ist.

**Prosa diffen.** Das ist der Fall, zu dem Leute zuletzt kommen und den sie am meisten schätzen. Wenn sich zwei Versionen eines Dokuments nur unterscheiden, weil jemand die Absätze neu umgebrochen hat, meldet ein Zeilen-Diff den ganzen Absatz als geändert und sagt Ihnen nichts. Konvertieren Sie beide Versionen mit `--wrap=none`, sodass ein Absatz eine Zeile ist, und diffen Sie dann mit `git diff --word-diff`, und was Sie sehen, sind die Wörter, die sich geändert haben. Derselbe Trick macht eine konvertierte `.docx` vergleichbar mit dem Markdown, das ihr entsprechen sollte.

## Die Werkzeuge, eines nach dem anderen

### Pandoc — der kürzeste korrekte Weg

Pandoc hat `plain` als Ausgabeformat, die ganze Aufgabe ist also ein einziger Befehl:

```bash
pandoc -t plain notes.md -o notes.txt
```

| Vorteile | Nachteile |
| --- | --- |
| Ein echter Parser, jeder Fall aus dem vorigen Abschnitt wird also behandelt | Eine Haskell-Binärdatei zu installieren |
| Umbruch, Spalten und Kommentarbehandlung sind Flags, kein Code | Die Entscheidungen seines Plain-Writers sind seine eigenen, und nur teilweise konfigurierbar |
| Tabellen überleben als Text-Tabellen, statt zu verschwinden | Aufgefüllte Tabellen brauchen eine Festbreitenschrift, um korrekt zu lesen zu sein |
| Liest viele Eingabeformate, derselbe Befehl bedient also `.docx` und HTML | Unterschiede zwischen Markdown-Dialekten bedeuten, dass Sie den Reader benennen sollten |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details und Funktionen**

- `--wrap=auto` ist die Vorgabe und bricht bei `--columns` um, das standardmäßig 72 ist; `--wrap=none` setzt jeden Absatz auf eine Zeile, und `--wrap=preserve` behält die eigenen Zeilenumbrüche der Quelle (geprüft auf pandoc.org, 8. September 2026)
- `--strip-comments` entfernt HTML-Kommentare aus der Quelle, statt sie durchzureichen
- Links kommen als ihr Label heraus, die URL fällt weg; Bilder kommen als ihr Alt-Text in eckigen Klammern heraus; Inline-Code kommt als bloße Zeichenkette heraus; Fußnoten werden zu Markierungen im `[1]`-Stil mit einer Liste am Ende (geprüft im Quellcode des Writers auf github.com, 8. September 2026)
- Betonung und starke Betonung kommen als bloßer Text heraus, es sei denn, Sie aktivieren die `gutenberg`-Erweiterung, die `_Unterstriche_` für Betonung zurückbringt und starken Text in Großbuchstaben setzt (geprüft auf github.com, 8. September 2026)
- Benennen Sie den Reader, wenn die Eingabe GitHub Flavored ist — `-f gfm` —, damit Aufgabenlisten und Autolinks so gelesen werden, wie sie geschrieben wurden

**Für wen ist das?** Für jeden, der ganze Dokumente konvertiert und eine Binärdatei installieren kann. Es ist die Standardantwort, und der einzige Grund, sie nicht zu nehmen, ist, dass die Entscheidungen in Ihrem eigenen Code leben müssen.

### remark und `strip-markdown` — ein Schritt in einem Node-Build

Die unified-Pipeline parst Markdown zu einem mdast-Baum, und `strip-markdown` ist das Plugin, das ihn abflacht: parsen, entfernen, in Text zurückverwandeln.

| Vorteile | Nachteile |
| --- | --- |
| Ein echter Baum, nichts hängt also von Mustersuche ab | Drei Pakete und eine ESM-Pipeline einzurichten |
| Die Optionen `keep` und `remove` machen die Entscheidungen explizit | Die Vorgaben löschen mehr, als Leute erwarten |
| Sitzt innerhalb eines Builds, den Sie schon haben | Langsamer als eine einzelne Binärdatei für eine Datei |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Die eigene Beschreibung besagt, dass es alles außer Absätzen und Text entfernt
- Standardmäßig entfernt es Codeblöcke, HTML, thematische Trennlinien, Tabellen und YAML- oder TOML-Frontmatter, und es erhält den Alt-Text von Bildern (geprüft auf github.com, 8. September 2026)
- `keep` nimmt eine Liste von Knotentypen entgegen, die unverändert bleiben sollen; `remove` nimmt Knotentypen entgegen, die entfernt oder durch einen Handler ersetzt werden
- Weil es vor `remark-stringify` läuft, bedeutet eine Tabelle zu „behalten“, dass der Stringifier sie wieder als Markdown-Tabelle herausschreibt — die Daten zu behalten und das Markup zu entfernen sind zwei verschiedene Anliegen, und der Mittelweg braucht einen selbst geschriebenen Handler

**Für wen ist das?** Für JavaScript-Projekte, die schon mit remark parsen, und für jeden, der die Element-für-Element-Entscheidungen in der Konfiguration festgehalten haben will, statt sie aus der Ausgabe abzuleiten.

### `mdast-util-to-string` — eine Zeichenkette, für Maschinen

Manchmal wollen Sie eine einzelne Zeichenkette für ein Suchindexfeld oder einen Auszug, und Struktur ist irrelevant. Dieses Hilfsprogramm holt den Textinhalt eines Knotens, bevorzugt reine Textfelder und serialisiert andernfalls die Kinder.

| Vorteile | Nachteile |
| --- | --- |
| Ein Aufruf, eine Zeichenkette | Kinder werden mit einem leeren Trennzeichen verbunden |
| Optionaler Bild-Alt-Text über `includeImageAlt` | Blockgrenzen verschwinden vollständig |
| Winzig, und schon im Baum, wenn Sie remark nutzen | Nichts für etwas, das ein Mensch liest |

**Preis:** kostenlos, MIT-lizenziert.

Das leere Trennzeichen ist das, was man wissen muss. Weil der Verbindungsaufruf `''` verwendet, läuft eine Überschrift direkt in den folgenden Absatz: „Preise“ plus „Wir berechnen pro Platz“ wird zu `PreiseWir berechnen pro Platz`. Für ein Indexfeld ist das meist harmlos, da der Tokenisierer ohnehin an der Grenze aufteilt — aber für ein Snippet, das ein Nutzer sieht, oder eine Wortzählung erzeugt es Unsinn. Die Lösung ist, den Baum selbst zu durchlaufen und Knoten auf Blockebene mit einer Leerzeile zu verbinden.

**Für wen ist das?** Für jeden, der ein maschinell gelesenes Feld füllt und geprüft hat, dass die Verkettung keine Rolle spielt.

### markdown-it und markdown-it-py — den Token-Strom entlanggehen

Wenn Ihre Anwendung Markdown schon mit markdown-it rendert, haben Sie den Lexer bereits. `md.parse(source, {})` liefert ein flaches Array von Tokens mit Typen wie `heading_open`, `inline`, `fence` und `table_open`, und Sie geben Text für die Typen aus, die Sie wollen.

| Vorteile | Nachteile |
| --- | --- |
| Jede Entscheidung ist ein Zweig einer switch-Anweisung, die Sie lesen können | Sie besitzen jetzt jede Entscheidung, auch die, die Sie vergessen |
| Keine zweite Abhängigkeit, und kein zweiter Parser, der dem ersten widerspricht | Mehr Code als ein Flag |
| Dasselbe Token-Modell existiert in Python als markdown-it-py | Das Tabellenlayout müssen Sie vollständig selbst berechnen |

**Preis:** kostenlos, MIT-lizenziert.

**Für wen ist das?** Für Anwendungen, bei denen die Ausgabe zu einem hauseigenen Format passen muss — eine bestimmte E-Mail-Vorlage, ein Bericht mit fester Breite, eine Log-Zeile — und für Teams, die lieber fünfzig Zeilen expliziter Entscheidungen pflegen, als mit den Vorgaben eines Konverters zu streiten.

### `remove-markdown` — der ehrliche reguläre Ausdruck

Ein kleines, auf regulären Ausdrücken basierendes Paket, das Markdown-Formatierung aus einer Zeichenkette entfernt. So sieht eine sorgfältige Version des Musters aus, das Sie schreiben wollten, und es scheitert an denselben Fällen aus denselben Gründen.

**Preis:** kostenlos, MIT-lizenziert.

**Für wen ist das?** Für niemanden, wenn es um ein Dokument geht. Es ist eine vertretbare Wahl für eine Vorschauzeile, einen Karten-Untertitel oder einen Benachrichtigungstext, wo der Text kurz ist, die Quelle Ihnen gehört, und ein verirrtes Zeichen kosmetisch ist.

### Nach HTML rendern, dann einebnen

Zwei Sprünge statt einem: Markdown zu HTML mit einem echten Markdown-Parser, dann HTML zu Text mit einem echten HTML-Konsumenten. Das klingt verschwenderisch und löst zwei Probleme auf einmal. Die Dialektfrage wird vom Markdown-Parser beantwortet, und das rohe HTML in der Quelle wird von einem Werkzeug behandelt, dessen ganze Aufgabe HTML ist — was kein Entferner auf Markdown-Ebene für sich beanspruchen kann.

| Werkzeug | Was es ist | Bemerkenswertes Verhalten |
| --- | --- | --- |
| `lynx -dump` | Ein Textbrowser, der formatierte Ausgabe nach stdout kippt | Bricht bei `-width` um, standardmäßig 80; hängt eine Linkliste an, außer Sie übergeben `-nolist`; `-stdin` liest unter UNIX aus einer Pipe |
| `w3m -dump` | Ein weiterer Textbrowser | `-cols` setzt die Breite; zeichnet Tabellen |
| `html-to-text` (npm) | Eine dafür gebaute Bibliothek | `wordwrap`, `selectors` und `formatters` pro CSS-Selektor, `preserveNewlines`, `ignoreHref`, `hideLinkHrefIfSameAsText`, `dataTable` |
| BeautifulSoup `get_text()` | Der Textzugriff eines Python-HTML-Parsers | Verkettet Zeichenketten; übergeben Sie ein Trennzeichen, oder verlieren Sie die Grenzen |

**Preis:** Lynx ist kostenlos und GPL-lizenziert; `html-to-text` ist kostenlos und MIT-lizenziert; BeautifulSoup ist kostenlos und MIT-lizenziert. Optionen zitiert aus linux.die.net und github.com (geprüft am 8. September 2026).

Der Bibliotheks-Weg ist der, den Sie für E-Mail wählen sollten, denn `html-to-text` legt seine Formatierungsentscheidungen pro Selektor offen: Sie sagen, was ein `a`-Element tut, was eine `table` tut, und wo der Umbruch fällt, und die Antworten leben in Ihrer Konfiguration statt in den Rendering-Konventionen eines Browsers. Der Browser-Weg ist der, den Sie zum Lesen wählen sollten, denn ein Textbrowser hat dreißig Jahre damit verbracht zu entscheiden, wie ein Dokument in 80 Spalten aussieht, und ist darin besser, als Sie es heute Nachmittag sein werden.

Beide Sprünge kosten Sie etwas. Sie pflegen zwei Konvertierungen statt einer, und die HTML-Stufe bringt ihre eigenen Konventionen mit — Lynx nummeriert Ihre Links und hängt eine Referenzliste an, w3m legt Tabellen auf seine Art aus. Keines von beiden ist falsch; beides ist eine Überraschung, wenn Sie es nicht erwartet haben.

### `html2text` — der irreführende Name

Es lohnt sich, das genau zu benennen, denn es ist das erste Suchergebnis und das falsche Werkzeug für diese Aufgabe. Das Python-`html2text` beschreibt sich selbst so, dass es HTML in sauberen, leicht lesbaren reinen ASCII-Text verwandelt, der zufällig auch gültiges Markdown ist. Das ist der Punkt daran: Die Ausgabe ist Markdown. `--ignore-links` und `--reference-links` ändern, wie viel davon es gibt, und `--mark-code` verpackt Code in eigene Tags, aber Sie konvertieren [HTML zu Markdown](/blog/convert-html-to-markdown), was eine andere Aufgabe mit einem anderen Satz an Werkzeugen ist. Es ist kostenlos und GPLv3-lizenziert.

**Für wen ist das?** Für jeden, der Markdown wollte. Wer Text wollte, sollte sich die Zeile darüber ansehen.

### Ein Browser-Konverter, wenn die Installation das Problem ist

TransformPipe konvertiert eine Markdown-Datei im Browser und bietet das Ergebnis als Download in reinem Text neben HTML und Markdown an, ohne dass etwas hochgeladen wird, solange Sie abgemeldet sind, und mit einer Obergrenze von 10 MB pro Konvertierung. Die Entscheidungen über Überschriften, Links und Tabellen trifft das Werkzeug statt Sie, und das ist der Tausch: keine Installation, keine Flags, und keine Kontrolle.

**Preis:** kostenlos.

**Für wen ist das?** Für jemanden mit einer Datei und keiner Lust, eine Haskell-Toolchain zu installieren, nur um sie einzuebnen — ein Dokument, das in ein Ticket eingefügt wird, ein E-Mail-Text, eine Notiz.

## Wo das Entfernen der Syntax scheitert, und was es kostet

Jeder Weg oben ist ein Kompromiss, und es lohnt sich, unverblümt zu sagen, welche Kompromisse unvermeidlich sind.

**Struktur hat keinen Ort, an dem sie leben kann.** Reiner Text hat einen Kanal — die Zeichenfolge —, und der muss die Wörter, die Hierarchie, die Betonung und die tabellarischen Beziehungen alle gleichzeitig tragen. Eine Checkliste mit dreißig Punkten über drei Verschachtelungsebenen flacht zu einer Wand ab, durch die ein Leser nicht navigieren kann. Die Überschriften zu nummerieren hilft und ist nicht umsonst: Sie haben Text hinzugefügt, der nicht im Dokument stand.

**Tabellen verlieren die Zuordnung, nicht die Daten.** Jeder Wert überlebt; was verschwindet, ist, zu welcher Spalte er gehörte. Auffüllen erhält sie, um den Preis, eine Festbreitenschrift und ein Fenster mindestens so breit wie die breiteste Zeile zu verlangen, und keins von beidem lässt sich in einem E-Mail-Client garantieren. Feld-pro-Zeile erhält sie und verdreifacht die Länge. Entscheiden Sie im Voraus, denn der Fehlerfall einer späten Entscheidung ist eine Tabelle, die in Ihrem Terminal richtig aussah und als verwürfelte Zahlen ankam.

**Links können nicht gleichzeitig kurz und vollständig sein.** Inline-URLs zerstören die Zeile; weggelassene URLs entfernen das Ziel; eine Referenzliste am Ende verlangt vom Leser, selbst nachzuschauen. Es gibt keine Option, die alle drei Kosten vermeidet, wählen Sie also die Kosten, die zu dem Leser passen, den Sie tatsächlich haben.

**Betonung ist manchmal Bedeutung.** Ein Begriff, der bei der ersten Verwendung fett ist, weil er gerade definiert wird, eine Warnung in Fett in einem Runbook, eine Verneinung in Kursiv — Abflachen entfernt das einzige Signal, dass sich diese Wörter von denen um sie herum unterscheiden. Großbuchstaben sind der übliche Ersatz, und sie lesen sich wie Schreien. In einem Dokument, in dem Betonung eine Verpflichtung trägt, ist das eine Änderung am Dokument.

**Es lässt sich nicht zurückwandeln.** Ausgehender Text ist nicht eingehendes Markdown. Sobald der Baum weg ist, können Sie die Überschriften nicht wiederherstellen, und alles nachgelagerte, das Struktur will, muss raten. Behalten Sie die `.md` als Quelle der Wahrheit und behandeln Sie die `.txt` als Artefakt, das neu erzeugt statt bearbeitet wird.

**Die Zahl bewegt sich mit den Flags.** Wortzählungen, Zeichenzählungen und Lesezeiten hängen alle davon ab, ob Codeblöcke weggelassen wurden, ob URLs behalten wurden und ob Überschriften mitgezählt wurden. Eine Zählung ist nur mit einer anderen Zählung vergleichbar, die vom selben Befehl erzeugt wurde, was in dem Moment zählt, in dem jemand ein Wortlimit in eine Vereinbarung schreibt.

Und der größte: Wenn der Grund, warum Sie reinen Text wollen, der ist, dass Ihnen das Markup im Weg steht, prüfen Sie, ob die Antwort stattdessen HTML ist. Ein gerendertes Dokument behält die Überschriften, die Listen und die Tabellenzellen, öffnet sich überall, und braucht keine Entscheidungen von Ihnen darüber, was die Struktur trägt. Reiner Text ist die richtige Ausgabe, wenn etwas nachgelagertes eine Zeichenkette entgegennimmt. Es ist die falsche Ausgabe, wenn der Leser ein Mensch mit einem Browser ist.

## Wie Sie wählen

1. **Benennen Sie den Empfänger, bevor Sie das Werkzeug wählen.** Ein Mensch in einem Mail-Client, ein Tokenisierer, ein Diff, eine Sprach-Engine und ein Terminal wollen jeweils eine andere Reihe von Entscheidungen, und ein auf einen davon abgestimmter Konverter erzeugt Ausgaben, die überall sonst leicht falsch sind.
2. **Klären Sie zuerst die Tabellenfrage.** Es ist die einzige Entscheidung, die sich nicht aufschieben lässt: Aufgefüllte Spalten verpflichten Sie auf eine Festbreitenschrift und eine Mindestbreite, und Feld-pro-Zeile verpflichtet Sie auf dreimal so viel vertikalen Platz. Erst nach der Auslieferung zu entscheiden bedeutet, vor einem Kunden neu zu entscheiden.
3. **Nehmen Sie einen Parser, kein Muster.** Jede Datei mit einem Zaun, einer Maskierung, einem Referenzlink oder einem rohen HTML-Block bringt einen regulären Ausdruck zum Scheitern, und zwar lautlos — Sie bekommen Text, der gut liest und eine Zeile vermisst, die teuerste Art, falsch zu sein.
4. **Legen Sie die Umbruchbreite einmal fest, an der Grenze.** `--wrap=none` für Diffs und Greps, 72 Spalten für E-Mail, die eigene Breite des Terminals für eine CLI. Zweimal umzubrechen — einmal im Konverter und einmal im Client — ist, wie ein Dokument mit Drei-Wort-Zeilen endet.
5. **Testen Sie an Ihrer hässlichsten Datei.** Der mit der verschachtelten Liste, dem `<details>`-Block, der Tabelle mit einer maskierten Pipe in einer Zelle und den Referenzlinks, die am Ende definiert sind. Diese Datei entscheidet, ob ein Werkzeug funktioniert; eine saubere README entscheidet nichts.

## Fazit

Markdown zu Text ist eine kleine Konvertierung mit einer langen Liste von Ermessensentscheidungen, und die Werkzeuge teilen sich sauber entlang einer Linie: Parser machen es richtig, und Muster machen es lautlos falsch. Greifen Sie zu `pandoc -t plain`, wenn Sie das ganze Dokument wollen und eine Binärdatei installieren können, gehen Sie den Token-Strom entlang, wenn die Entscheidungen in Ihrem Code leben müssen und zu einem von jemand anderem vorgegebenen Format passen sollen, und rendern Sie nach HTML, bevor Sie einebnen, wenn die Quelle rohes HTML enthält, das Sie nicht selbst geschrieben haben. Wenn die Aufgabe eine Datei ist und die Installation das Hindernis, gibt Ihnen [ein browserseitiger Konverter](/) einen Text-Download, ohne irgendetwas hochzuladen. Für welchen Weg Sie sich auch entscheiden, behalten Sie das Markdown als Quelle und behandeln Sie den Text als Ausgabe — und lassen Sie Ihre schlechteste Datei hindurchlaufen, bevor Sie den guten vertrauen.

## FAQ

### Wie konvertiere ich Markdown in der Kommandozeile in reinen Text?

`pandoc -t plain input.md -o output.txt` ist die kürzeste korrekte Antwort, und es bricht standardmäßig bei 72 Spalten um. Fügen Sie `--wrap=none` hinzu, wenn die Ausgabe in einen Diff oder ein Grep geht, und `--strip-comments`, wenn die Quelle HTML-Kommentare enthält, die Sie nicht zu Prosa befördert haben wollen.

### Kann ich einfach einen regulären Ausdruck nehmen, um Markdown zu entfernen?

Nur dort, wo ein Fehler kosmetisch ist, etwa bei einer Vorschauzeile oder einem Karten-Untertitel. Eingezäunter Code, Backslash-Escapes, Tabellen, Referenzlinks und rohe HTML-Blöcke bringen die Mustersuche jeweils auf eine andere Art zum Scheitern, und die Ausgabe sieht plausibel aus, während sie falsch ist, weshalb der Fehler meist von einem Leser gefunden wird und nicht von einem Test.

### Warum enthält mein bereinigter Text noch Klammern oder nackte URLs?

Fast immer Referenzlinks. Die Formen `[text][id]` und `[text]` zeigen auf Definitionen, die meist am Ende der Datei sitzen, ein Entferner, der nur `[text](url)` behandelt, lässt also die Klammern in der Prosa und die Definitionen als abschließenden Block von URLs zurück. Ein Parser löst die Referenz auf und gibt Ihnen das Label, das Ziel oder beides, je nachdem, was Sie verlangt haben.

### Unterscheidet sich eine Markdown-Wortzählung von einer Wortzählung in reinem Text?

Ja, und meist um mehr, als Leute erwarten. Die rohe Datei zu zählen schließt Tabellen-Pipes, Zaunzeilen, Referenzdefinitionen und jede URL als Wörter ein, eine Datei, die 900 Wörter meldet, kann also 700 Wörter Prosa sein. Ebnen Sie zuerst ein, entscheiden Sie, ob Codeblöcke zählen, und notieren Sie den Befehl zusammen mit der Zahl.

### Was passiert mit Tabellen, wenn Markdown zu reinem Text wird?

Das hängt vollständig vom Werkzeug ab, und die drei Antworten sind: Sie als aufgefüllte Text-Tabellen behalten, die eine Festbreitenschrift brauchen; jede Zeile zu einer Zeile abflachen, was die Zuordnung zur Kopfzeile verliert; oder sie löschen, was mehrere Entferner standardmäßig tun. Prüfen Sie, was Ihres bei einer echten Tabelle getan hat, bevor Sie ihm vertrauen, denn jedes dieser Ergebnisse sieht bei einer Stichprobe wie ein Erfolg aus.

### Ist `html2text` ein Werkzeug von Markdown zu Text?

Nein, gleich zweifach. Es konvertiert HTML statt Markdown, und seine Ausgabe ist bewusst gültiges Markdown statt reiner Text — das sagt seine eigene Dokumentation. Wenn Sie HTML haben und Text wollen, sind `lynx -dump` oder das Paket `html-to-text` die Werkzeuge; wenn Sie HTML haben und Markdown wollen, ist `html2text` genau richtig.

### Ist reiner Text zugänglicher als HTML?

Nicht für irgendetwas, das ein Mensch in einem Browser öffnet. Ein Screenreader nutzt die HTML-Struktur — Überschriften zum Navigieren, Listen um Elemente zu zählen, Tabellenzellen um einen Wert seiner Spalte zuzuordnen —, und das Dokument abzuflachen entfernt das alles. Reiner Text ist die richtige Ausgabe für eine Pipeline, die eine Zeichenkette entgegennimmt, etwa einen Sprachsynthesizer oder einen Suchindex, kein Ersatz für semantisches Markup.
