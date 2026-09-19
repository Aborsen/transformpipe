---
title: "Excel nach Markdown-Tabelle: jeder Weg, und was jeder davon verliert"
description: "Wie ein Excel-Bereich zur Markdown-Tabelle wird, und was mit Datumswerten, führenden Nullen, verbundenen Zellen und der Kodierung dabei passiert"
updated: 2026-09-14
date: 2026-09-03
tag: Konvertieren
keywords: excel nach markdown tabelle, excel in markdown umwandeln, xlsx zu markdown tabelle, excel csv nach markdown, excel in markdown einfügen, tabelle nach markdown, excel markdown tabellengenerator, excel csv kodierung utf-8
---

Eine Tabellenkalkulation und eine Markdown-Tabelle sehen aus wie dasselbe, zweimal gezeichnet. Sind sie nicht. Die eine ist ein Raster aus Zellen mit Typen, Formaten, Formeln und Bereichen, die sich über mehrere Spalten erstrecken; die andere ist ein zeilenbasiertes Textformat, in dem eine Zeile eine Zeile ist, eine Zelle an einem Pipe-Zeichen endet, und alles eine Zeichenkette ist. Vom Ersten zum Zweiten zu kommen ist kein Rendering-Problem. Es ist eine Entscheidung darüber, was wegzuwerfen ist.

### Kurzfassung

Der Weg, der überhaupt nichts aus Excel braucht, ist, **die `.xlsx`-Datei direkt hochzuladen** in einen Konverter, der das eigene Zip aus XML des Arbeitsblatts liest — jedes Blatt wird zu seiner eigenen Tabelle, mit einem Inhaltsverzeichnis, sobald es mehr als eines gibt. Wo das keine Option ist, speichern Sie das Blatt als **CSV UTF-8** und konvertieren die CSV — der Weg, der überall funktioniert, und er kostet Sie Formeln, Formatierung und jedes Blatt außer dem aktiven. Für einen ausgewählten Bereich ist **Kopieren und Einfügen** schneller: Excels Zwischenablage trägt eine tabgetrennte Version der Zellen, die leichter zu splitten ist als CSV, weil Tabs so gut wie nie innerhalb eines Werts vorkommen. Erwarten Sie Ärger an drei bestimmten Stellen: **führende Nullen und 16-stellige Zahlen**, die Excel schon zerstört hat, als der Wert eingetippt wurde; **verbundene Zellen**, die überhaupt kein Markdown-Äquivalent haben; und **Kodierung**, weil einfaches `CSV (kommagetrennt)` die ANSI-Codepage Ihres Systems schreibt statt UTF-8. Prüfen Sie eine Zeile mit einem akzentuierten Zeichen, eine mit einer langen Zahl und eine mit einem Komma darin, bevor Sie den anderen neunhundert vertrauen.

Die Reibung ist selten die Konvertierung. Es ist, dass die Tabelle, die Sie zurückbekommen, auf eine Art fein falsch ist, die niemand bemerkt, bis sie veröffentlicht ist. Eine Teilenummer, die im Blatt `00417` lautete, liest sich auf der Seite als `417`. Ein Datum, das im Blatt `03/09/2026` lautete, liest sich für die Hälfte Ihrer Leser als der dritte September und für die andere Hälfte als der neunte März. Eine Kopfzeile, die drei Spalten überspannte, ist zu einer Zelle und zwei Leerstellen zusammengefallen, die Spalten darunter sind jetzt mit nichts beschriftet.

Nichts davon ist Schuld des Konverters, und das ist der Punkt, den man früh verstehen sollte. Der meiste Schaden entsteht innerhalb der Tabellenkalkulation — in dem Moment, in dem ein Wert eingetippt wurde, oder in dem Moment, in dem Excel eine Textdatei geschrieben hat —, und kein nachgelagertes Werkzeug kann das rückgängig machen. Was ein guter Konvertierungsweg tut, ist, den Schaden sichtbar zu machen, während Sie ihn noch beheben können.

Es gibt auch die Frage, wohin die Datei geht. Tabellenkalkulationen gehören zu den sensibelsten Dokumenten, die die meisten Menschen konvertieren: Gehaltsbänder, Kundenlisten, unveröffentlichte Zahlen, ein Export aus einem Abrechnungssystem. Ein Konverter, der hochlädt, ist ein Konverter, der diese Zeilen jetzt hält, und das zählt hier mehr als bei einer README.

## Was eine Tabellenkalkulation enthält, das eine Markdown-Tabelle nicht kann

Markdown-Tabellen kommen aus GitHub Flavored Markdown, nicht aus dem CommonMark-Kern, und die Syntax ist absichtlich klein: Pipes zwischen Zellen, eine Zeile pro Zeile, eine Reihe aus Strichen unter der Kopfzeile, um das Ganze als Tabelle zu markieren, und optionale Doppelpunkte in dieser Reihe für Ausrichtung. Das ist der gesamte Funktionsumfang. Alles, was eine Tabellenkalkulation darüber hinaus tut, muss fallen gelassen, abgeflacht oder woanders hin verschoben werden.

| Im Arbeitsblatt | In einer Markdown-Tabelle | Was tatsächlich passiert |
| --- | --- | --- |
| Formeln | Nichts | Der Wert bleibt, die Formel verschwindet. Die Tabelle aktualisiert sich nicht mehr |
| Zahlenformate | Nichts | Sie bekommen die angezeigte Zeichenkette oder die Rohzahl, je nach Weg |
| Fett, Farbe, Füllungen | Nur Inline-Betonung, keine Farbe | Eine rote Zelle, die „überfällig“ bedeutete, kommt als gewöhnliche Zahl an |
| Bedingte Formatierung | Nichts | Die Regel und die Bedeutung verschwinden beide |
| Verbundene Zellen | Nichts — kein Colspan, kein Rowspan | Wert in der ersten Zelle, Leerstellen im Rest |
| Mehrere Blätter | Eine Tabelle pro Blatt | Ein CSV-Export speichert nur das aktive Blatt |
| Ein Zeilenumbruch in einer Zelle | Nichts | Muss zu `<br>` oder einem Leerzeichen werden, sonst bricht die Tabelle |
| Hyperlinks | `[text](url)` | Nur auf Wegen erhalten, die die Rich-Zwischenablage lesen, nicht reinen Text |
| Kommentare und Notizen | Nichts | Still verworfen |
| Diagramme, Bilder, Pivot-Tabellen | Nichts | Nicht tabellarisch, nicht konvertierbar |
| Spaltenbreiten, fixierte Bereiche | Nichts | Layout ist Sache der Leserin, nicht Ihre |
| Ausrichtung | `:---`, `:---:`, `---:` | Die einzige Formatierung, die überlebt, und Sie setzen sie meist von Hand |

Zwei Zeilen dieser Tabelle lohnt es sich herauszugreifen, denn sie sind es, die ein kaputtes Dokument erzeugen statt eines schlichteren. Ein Zeilenumbruch in einer Zelle hat keine Darstellung in der Syntax — die Tabelle ist zeilenbasiert, ein echter Zeilenumbruch beendet also die Zeile — und ein verbundener Bereich hat auch keine Darstellung. Alles andere verschlechtert sich. Diese beiden verderben.

Die Rechteck-Regel ist die andere Sache, die man kennen sollte. GitHubs Spezifikation sagt, die Kopfzeile legt die Spaltenzahl fest: eine spätere Zeile mit weniger Zellen bekommt leere hinzugefügt, und eine Zeile mit mehr Zellen hat die zusätzlichen ignoriert. Das ist ein gnädiges Verhalten und ein gefährliches, denn eine Zeile, die eine Zelle an ein verirrtes Pipe-Zeichen verloren hat, erzeugt keinen Fehler. Sie erzeugt eine Tabelle mit einem Wert, der still am Ende einer Zeile fehlt. [Tabellen sind das mit Abstand Häufigste, was auf dem Weg über bricht](/blog/markdown-tables-that-survive-conversion), und das ist der Grund: der Fehlermodus ist eine gültige Tabelle mit dem falschen Inhalt.

## Kurzvergleich: die Wege vom Blatt zur Tabelle

| Weg | Am besten für | Behält | Verliert | Installation |
| --- | --- | --- | --- | --- |
| Die `.xlsx` direkt hochladen | Ein ganzes Arbeitsbuch, kein Exportschritt | Jedes Blatt, als eigene Tabelle | Formeln, Formate — wie bei jedem Weg | Keine |
| Als CSV UTF-8 speichern, dann konvertieren | Ein ganzes Blatt, zuverlässig | Werte, akzentuierte Zeichen | Formeln, Formate, andere Blätter | Keine |
| Bereich kopieren, in einen Konverter einfügen | Eine Auswahl, die Sie sehen können | Werte, in tabgetrennter Form | Formatierung, Hyperlinks | Keine |
| Bereich kopieren, als HTML einfügen | Fett, Links, verbundene Struktur | Betonung, `<a href>`, Colspan | Hängt vom HTML-Konverter ab | Keine |
| Eine Formel in einer Hilfsspalte | Eine Tabelle, die Sie oft neu erzeugen | Was auch immer Sie hineinschreiben | Zahlenformate, außer Sie nutzen `TEXT` | Keine |
| Ein Office-Add-in | Es innerhalb von Excel wiederholt zu tun | Was auch immer das Add-in umsetzt | Variiert; kann den Bereich an einen Anbieter senden | Add-in, manchmal Admin-Freigabe |
| Ein VBA-Makro | Ein Arbeitsbuch, das Sie kontrollieren | Genau das, was Sie kodieren | Nichts, was Sie nicht gewählt haben | Keine, aber die Datei wird `.xlsm` |
| Office Scripts | Excel im Web, geteilte Automatisierung | Genau das, was Sie kodieren | Braucht ein berechtigtes Microsoft-365-Konto | Keine |
| Google-Sheets-Download | Excels Kodierungsentscheidungen ausweichen | UTF-8 ohne Diskussion | Dieselben Tabellenkalkulations-Eigenschaften wie jede CSV | Keine |
| LibreOffice-Calc-Export | Ausdrückliche Kontrolle über die Textdatei | Ihre Wahl von Zeichensatz und Quoting | Wie jede CSV | LibreOffice |
| Neu eintippen | Fünf Zeilen und vier Spalten | Ihre Aufmerksamkeit | Zwanzig Minuten, in großem Maßstab | Keine |

## Die Wege, einer nach dem anderen

### Die `.xlsx` direkt hochladen — den Export ganz überspringen

Das Arbeitsbuch ist bereits ein Zip aus XML — das bedeutet `.xlsx` —, ein Konverter kann es also genauso lesen wie eine `.docx`, ohne einen Speichern-unter-Schritt dazwischen. [TransformPipes Excel-→-Markdown-Tabellen-Konvertierung](/excel-to-markdown) tut genau das: das Arbeitsbuch hineinziehen, und jedes Blatt mit Zeilen darin wird zu seiner eigenen Tabelle, mit einem Inhaltsverzeichnis, sobald es mehr als ein Blatt gibt. Niemand öffnet Excel, niemand wählt eine Kodierung, und es gibt keine CSV-Zwischenstufe, die verloren oder falsch benannt werden könnte.

| Vorteile | Nachteile |
| --- | --- |
| Kein Speichern-unter-Dialog, keine Kodierungsentscheidung, die schiefgehen kann | Immer noch die Lesart eines Browser-Konverters der Datei — die Verluste im Cheat Sheet oben prüfen |
| Jedes Blatt im Arbeitsbuch, nicht nur das aktive | Formeln, Formate und verbundene Zellen fallen weg, wie bei jedem anderen Weg |
| Datumswerte kommen als reine ISO-Daten heraus, nicht als Seriennummern | Nichts rettet einen Wert, den Excel schon bei der Eingabe verstümmelt hat |
| Läuft im Browser: das Arbeitsbuch wird nie hochgeladen | Eine makrofähige `.xlsm` oder eine passwortgeschützte Datei braucht einen anderen Weg |

**Preis:** kostenlos, und die Datei bleibt lokal — es lohnt sich, das für eine Tabellenkalkulation zu bestätigen, da Tabellenkalkulationen zu den sensibelsten Dokumenten neigen, die irgendwer konvertiert.

**Für wen ist das?** Für jeden, der die Tabelle ohne jeden Exportschritt will, besonders bei einem Arbeitsbuch mit mehreren Blättern: ein Upload erzeugt ein Dokument mit einem Inhaltsverzeichnis, statt eines CSV-Exports pro Blatt.

### Als CSV speichern, dann konvertieren — der Weg, der überall sonst funktioniert

Nutzen Sie `Datei > Speichern unter`, wählen Sie `CSV UTF-8 (Comma delimited) (*.csv)`, akzeptieren Sie die zwei Warnungen, die Excel zeigt, und konvertieren Sie dann die entstandene Textdatei. Es ist die langweiligste Option und die einzige, die auf jeder Maschine, jeder Locale und jeder Dateigröße identisch funktioniert.

| Vorteile | Nachteile |
| --- | --- |
| Erzeugt eine reine Textdatei, die jeder Konverter lesen kann | Nur das aktive Blatt wird gespeichert |
| CSV UTF-8 behält akzentuierte und nicht-lateinische Zeichen | Formeln werden zu Werten, Formate werden zu Zeichenketten |
| Die Zwischendatei ist inspizierbar — öffnen und ansehen | Das BOM am Anfang bringt unachtsame Leser durcheinander |
| Funktioniert gleich in jeder Excel-Version, die das Format anbietet | Eine Locale mit Dezimalkomma ändert das Trennzeichen |

**Preis:** kostenlos. Excel ist es nicht, aber der Export ist Teil davon, und jeder Konverter, der auf der anderen Seite etwas taugt, ist kostenlos.

**Technische Details**

- Excels Speichern-unter-Liste enthält mehrere Textformate: `CSV`, `UTF8 CSV`, `Macintosh CSV`, `Windows CSV`, `MSDOS CSV` und `Unicode Text`, den Makros als `xlCSV`, `xlCSVUTF8`, `xlCSVMac`, `xlCSVWindows`, `xlCSVMSDOS` und `xlUnicodeText` zugänglich (geprüft auf learn.microsoft.com, 8. September 2026).
- Das Speichern als CSV zeigt einen Dialog, der „daran erinnert, dass nur das aktuelle Arbeitsblatt in die neue Datei gespeichert wird“, und eine zweite Warnung, dass das Blatt Funktionen enthalten könnte, die das Textformat nicht unterstützt (geprüft auf support.microsoft.com, 8. September 2026).
- Das Feldtrennzeichen folgt dem Systemlistentrennzeichen, das in den Windows-Regionseinstellungen und in Excels eigenen Trennzeicheneinstellungen änderbar ist (geprüft auf support.microsoft.com, 8. September 2026).
- Was für eine formatierte Zelle in der Datei landet, ist im Allgemeinen die von der Zelle angezeigte Zeichenkette, nicht der zugrunde liegende Wert. Das heißt, eine Zelle mit `2,3456`, angezeigt mit zwei Nachkommastellen, schreibt `2,35`, und ein Datum schreibt in der Reihenfolge, die das Format der Zelle nutzt. Öffnen Sie die CSV einmal in einem Texteditor, und Sie wissen genau, was Ihre Excel-Kopie tut.

Dann die CSV konvertieren. Ein Browser-Konverter, [die CSV-zu-Markdown-Tabellen-Konvertierung](/csv-to-markdown), parst die Datei richtig, statt an Kommas zu splitten, was in dem Moment zählt, in dem eine Zelle eines enthält, und tut es lokal, sodass die Zeilen nicht hochgeladen werden — ein gespeichertes Dokument ist auf 4 MB gedeckelt und die Konvertierung selbst auf 10 MB, was weit mehr ist, als irgendwer in einer Tabelle lesen wird. Das breitere Feld an Kommandozeilen- und Bibliotheksoptionen behandelt [der CSV-Konverter-Vergleich](/blog/best-csv-to-markdown-converters); Pandoc, Miller und `pandas.to_markdown` lesen CSV alle korrekt und sind die richtige Antwort innerhalb eines Builds.

**Für wen ist das?** Für jeden, der ein ganzes Blatt konvertiert, und für jeden, der es nächsten Monat wieder tun muss. Die Zwischen-CSV ist das Feature: es ist eine Datei, die Sie lesen, diffen und prüfen können, bevor sie zu einer Tabelle wird.

### Bereich kopieren und einfügen — der schnelle Weg

Zellen auswählen, kopieren, und in einen Konverter einfügen, der eingefügten Text akzeptiert. Das ist der richtige Weg für einen Bereich statt eines Blatts, und er ist um etwa eine Minute schneller als Speichern-unter. Was ihn funktionieren lässt: Excel legt kein CSV auf die Zwischenablage.

| Vorteile | Nachteile |
| --- | --- |
| Keine Datei, kein Dialog, keine Kodierungsentscheidung | Eine Zelle mit einem Zeilenumbruch darin bricht das Einfügen |
| Tabgetrennter Text ist leichter zu splitten als CSV | Zahlenformate kommen als Anzeigezeichenketten an |
| Handhabt eine Auswahl, kein ganzes Blatt | Formeln und Hyperlinks stehen nicht im reinen Text |
| Keine Installation, nichts wird auf die Platte geschrieben | Nur das Ausgewählte, die Kopfzeile ist Ihr Problem |

**Technische Details — was die Zwischenablage tatsächlich trägt**

| Variante | Form | Nutzen Sie es für |
| --- | --- | --- |
| Reiner Text | Tabgetrennt, `CRLF` zwischen Zeilen, Quoting nur dort, wo ein Wert einen Tab, Zeilenumbruch oder ein Anführungszeichen enthält | Fast jede Konvertierung |
| HTML | Eine echte `<table>` mit Zeilen, Zellen, Inline-Styles, `colspan` und `rowspan`, und `<a href>` für Links | Betonung und Links behalten |
| Excels eigene Formate | Binär, zum Zurückeinfügen in eine Tabellenkalkulation | Nichts, außerhalb von Excel |

Die Variante mit reinem Text ist effektiv TSV mit CSV-artigem Quoting, und das ist eine bessere Nachricht, als es klingt. Ein Komma in einem Wert ist harmlos, weil das Trennzeichen ein Tab ist, und Tabs sind selten in Tabellenkalkulationszellen, weil das Drücken von Tab zur nächsten Zelle springt. Der pathologische Fall, der naives CSV-Parsen ruiniert — `Schmidt, Hans` in einem Feld — kostet hier also nichts.

Der Fall, der es doch ruiniert, ist eine Zelle mit einem Zeilenumbruch, eingetippt mit Alt+Enter. Excel packt diesen Wert in doppelte Anführungszeichen, und der Zeilenumbruch geht intakt auf die Zwischenablage, ein Werkzeug, das den eingefügten Text an Zeilenumbrüchen splittet, sieht also eine Zeile zu zwei werden, und jede Zeile danach verschiebt sich. Durchsuchen Sie das Blatt danach, bevor Sie kopieren: sie sind meist Adressen, Notizen und Produktbeschreibungen.

**Für wen ist das?** Für jeden mit dem offenen Arbeitsbuch und einem bestimmten Bereich im Kopf. Der Weg, zu dem man greift, wenn die Antwort nur zwölf Zeilen von neunhundert braucht.

### Als HTML einfügen und das HTML konvertieren — wenn die Formatierung zählt

Wenn Betonung und Links wichtig sind, fügen Sie nicht als Text ein. Fügen Sie in etwas ein, das die HTML-Variante der Zwischenablage annimmt — ein Rich-Text-Feld, oder einen Editor, der formatierten Inhalt einfügt — und konvertieren Sie stattdessen dieses HTML zu Markdown.

| Vorteile | Nachteile |
| --- | --- |
| Fett, Kursiv und Hyperlinks überleben als Markdown | Excels Zwischenablagen-HTML ist geschwätzig und voller `mso-`-Styles |
| Verbundene Zellen kommen als echtes `colspan` und `rowspan` an | Was die Markdown-Tabelle dann trotzdem nicht ausdrücken kann |
| Zellrahmen und Ausrichtung sind für den Konverter sichtbar | Die meisten Konverter ignorieren beides |
| Keine Installation, wenn der Konverter im Browser läuft | Zwei Konvertierungen bedeuten zwei Chancen, etwas zu verlieren |

Der Tausch ist ehrlich: Sie behalten die Inline-Formatierung und verlieren trotzdem die Struktur, weil eine Markdown-Tabelle keine Möglichkeit hat zu sagen, dass eine Zelle drei Spalten überspannt. Ein Konverter, der ein `colspan` bekommt, lässt es entweder fallen und erzeugt eine ausgefranste Zeile, oder wiederholt den Wert, oder fällt zurück darauf, eine rohe HTML-Tabelle auszugeben. [Was Ihr HTML-zu-Markdown-Konverter davon tut](/blog/best-html-to-markdown-converters) lohnt sich zu wissen, bevor Sie eine verbundene Kopfzeile hineinfügen.

**Für wen ist das?** Tabellen, in denen eine Spalte Links enthält, oder in denen Betonung eine Bedeutung trägt — eine Statusspalte, eine Liste von Referenzen.

### Die Zeile in einer Formel bauen — der Weg, der im Blatt bleibt

Sie können Excel das Markdown selbst schreiben lassen. Setzen Sie das in eine Hilfsspalte neben eine fünfspaltige Tabelle und ziehen Sie es herunter:

```
="| " & TEXTJOIN(" | ", FALSE, A2:E2) & " |"
```

`TEXTJOIN` nimmt ein Trennzeichen, eine `ignore_empty`-Flagge und bis zu 252 Textargumente oder Bereiche (geprüft auf support.microsoft.com, 8. September 2026). Übergeben Sie `FALSE` für `ignore_empty` und meinen Sie es ernst: mit `TRUE` wird eine leere Zelle übersprungen statt ausgegeben, die Zeile kommt einen Pipe kurz heraus, und die Werte nach der Lücke rutschen eine Spalte nach links. Das ist die mit Abstand häufigste Art, wie dieser Trick schiefgeht.

Zwei weitere Details. Verkettung ignoriert das Zahlenformat der Zelle, ein Datum kommt also als seine Seriennummer an und ein Währungswert verliert sein Symbol; packen Sie diese Zellen in `TEXT(A2, "JJJJ-MM-TT")`, um die Zeichenkette selbst zu kontrollieren. Und ein Wert mit einem Pipe darin beendet eine Zelle vorzeitig, führen Sie ihn also durch `SUBSTITUTE(A2, "|", "\|")` in einer Vorbereitungsspalte, wenn Ihre Daten Dateipfade oder Optionslisten enthalten.

Die Trennzeile tippen Sie einmal von Hand:

```
| Teil | Beschreibung | Menge | Preis | Status |
| --- | --- | --- | ---: | --- |
```

Dann kopieren Sie die Hilfsspalte und fügen sie unter diese zwei Zeilen. Die Zwischenablage übergibt die Zeilen unquotiert, weil eine gebaute Zeile keine Tabs und keine Zeilenumbrüche enthält.

| Vorteile | Nachteile |
| --- | --- |
| Die Tabelle erzeugt sich neu, wenn sich die Daten ändern | Sie schreiben einen Konverter in Formeln |
| Keine Installation, kein Upload, kein zweites Werkzeug | Escaping und Zahlenformate sind ganz Ihr Problem |
| Funktioniert bei einer gefilterten oder sortierten Ansicht | Ab etwa sechs Spalten fummelig |
| `TEXT` gibt exakte Kontrolle über Datumswerte | Nichts prüft Ihre Ausgabe |

**Für wen ist das?** Eine Tabelle, die jede Woche aus demselben Blatt veröffentlicht wird. Die Hilfsspalte ist ein Build-Schritt, der im Arbeitsbuch lebt.

### Add-ins, Makros und Office Scripts — innerhalb von Excel konvertieren

Es gibt drei Wege, die Konvertierung zu einem Knopf in Excel zu machen statt zu einem Ausflug zu einem anderen Werkzeug, und sie unterscheiden sich vor allem darin, wer den Code geschrieben hat und wo er läuft.

Ein **Office-Add-in**, aus AppSource installiert, läuft in einer Web-Ansicht innerhalb von Excel und liest das Arbeitsbuch über die Office-JavaScript-API. Beurteilen Sie eines anhand zweier Fragen, bevor Sie es installieren: ob der Bereich lokal verarbeitet oder an den Dienst des Anbieters gesendet wird, was seine Datenschutzerklärung klar sagen sollte, und ob Ihr Mandant Add-ins überhaupt erlaubt — in verwalteten Microsoft-365-Umgebungen muss ein Administrator sie oft genehmigen. Nehmen Sie nicht an, das Marketplace-Listing impliziere eines von beidem.

Ein **VBA-Makro** ist die Version, bei der Sie den Code besitzen. Es hat keine Abhängigkeit, keinen Netzwerkzugriff, außer Sie schreiben einen, und keinen Anbieter. Die Kosten sind real: das Arbeitsbuch muss als `.xlsm` gespeichert werden, um das Makro zu behalten, Makros in Dateien, die aus dem Internet kamen, werden standardmäßig blockiert und müssen bewusst freigegeben werden, und Sie warten jetzt eine Escaping-Routine, die jemand einmal geschrieben hat und niemand testet. Da Speichern-unter zehn Sekunden kostet, lohnt sich ein Makro nur, wenn die Konvertierung nach Zeitplan geschieht.

**Office Scripts** ist die in Excel im Web eingebaute TypeScript-Automatisierung für berechtigte Microsoft-365-Konten. Es ist ein besserer Ort als VBA für geteilte, versionierte Automatisierung, und nicht jede Lizenz hat Zugriff darauf, prüfen Sie also, bevor Sie darauf planen. **Python in Excel** ist eine vierte Möglichkeit und trägt einen besonderen Vorbehalt: Das Python läuft in Microsofts Cloud statt auf Ihrer Maschine, die Daten verlassen also das Gebäude, auch wenn die Datei es nicht getan hat.

| Vorteile | Nachteile |
| --- | --- |
| Ein Knopf, innerhalb der Anwendung | Jemand muss den Code besitzen |
| Keine Dateihandhabung, keine Zwischenablage | Add-ins können den Bereich übertragen; Scripts brauchen womöglich eine Lizenz |
| Wiederholbar im ganzen Team | Der meiste Einrichtungsaufwand hier |

**Für wen ist das?** Teams, die Blätter oft genug konvertieren, dass die zehn Sekunden zählen, und bereit sind, etwas dafür zu warten.

### Google Sheets und LibreOffice Calc — derselbe Job mit besseren Standardwerten

Wenn das Arbeitsbuch nicht an Excel gebunden ist, machen zwei andere Tabellenkalkulationen den Textdatei-Schritt weniger streitanfällig.

Google Sheets exportiert das aktuelle Blatt mit `Datei > Herunterladen > Kommagetrennte Werte`, in UTF-8, ohne Dialog und ohne Codepage-Frage. Die Tabellenkalkulations-Einschränkungen sind identisch — ein Blatt, Werte statt Formeln, verbundene Zellen abgeflacht —, aber die Kodierungsfrage stellt sich nicht.

LibreOffice Calc geht den anderen Weg und fragt Sie nach allem. Speichern als Text-CSV öffnet einen Dialog mit dem Zeichensatz, dem Feldtrennzeichen, dem Stringtrennzeichen, „Alle Textzellen unter Anführungszeichen“ und „Zellinhalt wie angezeigt speichern“ — dieses letzte Kästchen ist die ausdrückliche Kontrolle, die Excel nicht bietet, denn es zu deaktivieren schreibt die zugrunde liegenden Werte statt der angezeigten Zeichenketten. Wenn Sie je ein Datum als `2026-09-03` exportiert haben wollten, unabhängig vom Format der Zelle, ist das der Schalter.

| Vorteile | Nachteile |
| --- | --- |
| Sheets: UTF-8, ohne Entscheidungen zu treffen | Sheets: die Datei läuft über Ihr Google-Konto |
| Calc: expliziter Zeichensatz, Quoting und Trennzeichen | Calc: eine Installation, und ein Dialog zum Verstehen |
| Calc: angezeigter oder zugrunde liegender Wert, Ihre Wahl | Beide: dieselben Tabellenkalkulations-Verluste wie jede CSV |

**Für wen ist das?** Für jeden, der schon in Sheets ist, und für jeden, der einmal von Excels Kodierungsstandards gebissen wurde und die Wahl sichtbar haben will.

## Was Excel mit Ihren Werten macht, wenn es CSV schreibt

Das ist der Abschnitt, den man zweimal liest, denn das meiste davon ist nicht umkehrbar und nichts davon wird angekündigt.

| Der Wert | Was herauskommt | Warum |
| --- | --- | --- |
| `00417`, in eine Standardzelle getippt | `417` | Beim Eintippen zu einer Zahl gezwungen. Die Nullen waren nie in der Datei |
| Eine 16-stellige Karten- oder Kontonummer | Ziffern nach der 15. werden zu Nullen | Excel hat „eine maximale Genauigkeit von 15 signifikanten Ziffern“ und „alle Zahlen nach der 15. Ziffer werden auf null abgerundet“ (geprüft auf support.microsoft.com, 8. September 2026) |
| Eine sehr große Zahl | `1,23E+15` | Wissenschaftliche Notation in der Anzeige wird zu wissenschaftlicher Notation im Text |
| `2,3456`, mit zwei Nachkommastellen angezeigt | `2,35` | Die angezeigte Zeichenkette, nicht der gespeicherte Wert |
| Ein Datum | Das Anzeigeformat der Zelle, in der Reihenfolge der Locale | Weshalb `03/09/2026` außerhalb des Blatts mehrdeutig ist |
| `=B2*C2` | Das Ergebnis | CSV hat keine Formeln |
| Ein Prozentsatz | Meist mit dem `%`-Zeichen | Wieder die Anzeige — prüfen Sie Ihre Datei |
| Ein Wert mit Tausendertrennzeichen | Oft `1.234,50`, unter Anführungszeichen | Das Komma steht in der Zeichenkette, das Feld muss also gequotet werden |
| Eine Zelle mit Alt+Enter darin | Ein gequotetes Feld mit einem echten Zeilenumbruch | Was ein zeilenbasierter Leser falsch handhabt, sofern er nicht CSV richtig parst |
| Text, der mit `=`, `+`, `-` oder `@` beginnt | Derselbe Text | Als Markdown harmlos; eine Tabellenkalkulation, die die CSV neu öffnet, könnte es als Formel behandeln |

Die ersten zwei Zeilen sind die, die echtes Geld kosten. Führende Nullen und lange Kennungen werden bei der Eingabe zerstört, vor jedem Export, und die Abhilfe ist Vorbeugung: die Spalte vor der Eingabe der Daten als Text formatieren, oder jedem Wert ein Apostroph voranstellen. Microsofts eigene Anleitung ist ausdrücklich, dass diese Schritte „nur Zahlen betreffen, die eingegeben werden, nachdem die Formatierung angewendet wurde“, und nicht wiederherstellen, was schon abgeschnitten wurde (geprüft auf support.microsoft.com, 8. September 2026). Wenn eine Teilenummer-Spalte schon `417` liest, weiß das Blatt nicht mehr, dass es `00417` war, und das Markdown wird es auch nicht wissen.

Die Datumszeile ist die, die Streit verursacht statt Verluste. Eine CSV trägt die Zeichenkette, die die Zelle zeigte, ein britisches Blatt exportiert also `03/09/2026`, und ein amerikanischer Leser parst es als März. Wenn die Tabelle in die Nähe eines anderen Landes geht, erzwingen Sie ISO-Daten vor dem Export — eine Hilfsspalte mit `TEXT(A2, "JJJJ-MM-TT")`, oder Calcs „Zellinhalt wie angezeigt speichern“ ausgeschaltet.

## Verbundene Zellen haben kein Markdown-Äquivalent

Es gibt kein Colspan in einer Markdown-Tabelle. Es gibt kein Rowspan. Das Pipe-Raster ist streng rechteckig, eine Zeile pro Reihe, und die Kopfzeile legt die Spaltenzahl für die ganze Tabelle fest. Ein verbundener Bereich kann nicht ausgedrückt, angenähert oder angedeutet werden.

Was auf dem Weg hinaus passiert, ist vorhersehbar: der Wert sitzt in der oberen linken Zelle des verbundenen Bereichs, und die anderen Zellen darin sind leer. Eine Kopfzeile, die `Q1`, `Q2` und `Q3` überspannt, exportiert also als `2026`, gefolgt von zwei Leerstellen, und die Markdown-Tabelle bekommt eine erste Zeile mit einem Label und zwei namenlosen Spalten.

Vier Auswege, in der Reihenfolge, in der ich sie probieren würde:

1. **Trennen und auffüllen.** Zellen verbinden und zentrieren ausschalten, dann das Label quer oder untereinander wiederholen. Die Tabelle wird im Blatt hässlicher und überall sonst korrekt.
2. **Das verbundene Label aus der Tabelle heben.** Eine verbundene Zelle, die eine ganze Tabelle überspannt, ist fast immer ein Titel. Machen Sie sie zu einer Überschrift über der Tabelle, oder zum Beschriftungssatz der Tabelle, und löschen Sie die Zeile.
3. **In zwei Tabellen aufteilen.** Zwei verbundene Spaltengruppen sind meist zwei Tabellen, die zum Drucken zusammengeklebt wurden. Sie getrennt zu veröffentlichen ist oft klarer als das Original.
4. **Eine rohe HTML-`<table>` ausgeben.** HTML in Markdown kann `colspan` tragen, und es rendert überall, wo rohes HTML erlaubt ist. Es zeigt sich als wörtliches Markup, wo das nicht der Fall ist, ein Sanitizer mit einer engen Allow-Liste könnte es entfernen, und Sie haben die lesbare Klartextquelle aufgegeben, die der Grund für Markdown war. Es ist der letzte Ausweg, nicht die clevere Antwort.

Beachten Sie, dass Tabellen überhaupt nicht in reinem CommonMark stehen, die gewöhnliche Pipe-Tabelle ist also schon eine Erweiterung — eine, die GitHub Flavored Markdown und die meisten Konverter umsetzen, und die ein strikter CommonMark-Parser als Absatz voller Pipes rendert. [Welcher Dialekt rendert](/blog/commonmark-gfm-and-the-flavours) entscheidet, ob Ihre Tabelle eine Tabelle ist, bevor irgendetwas davon zählt.

## Die Kodierungsfrage: ein BOM, eine ANSI-Codepage und ein Semikolon

Excels Textexport hat drei getrennte Arten, Ihnen eine Datei zu übergeben, die technisch korrekt ist und sich wie Kauderwelsch liest.

**Das BOM.** `CSV UTF-8` schreibt ein Byte Order Mark — die drei Bytes `EF BB BF` — vor das erste Zeichen. Die meisten Leser entfernen es. Die, die es nicht tun, setzen ein unsichtbares Zeichen vor Ihre erste Kopfzellen, die Spalte heißt also `﻿Teil` statt `Teil`. Es sieht am Bildschirm richtig aus und scheitert bei jedem Vergleich, den Sie dagegen machen. Sie sehen es in einer Sekunde:

```
head -c 3 orders.csv | xxd
```

Wenn das `efbbbf` ausdruckt, ist ein BOM da. Unter Windows ohne POSIX-Shell zeigt Ihnen ein Editor, der die Kodierung in seiner Statusleiste anzeigt, dasselbe.

**Die Codepage.** Einfaches `CSV (Comma delimited)` schreibt kein UTF-8. Es schreibt die ANSI-Codepage Ihres Systems — Windows-1252 in Westeuropa —, und jedes Zeichen außerhalb davon wird ersetzt, dauerhaft, meist durch ein Fragezeichen. Eine Spalte griechischer oder japanischer Namen übersteht dieses Speichern nicht, und kein nachgelagerter Konverter kann sie wiederherstellen. Selbst innerhalb der Codepage ist die Datei für einen UTF-8-Leser Mojibake: `£` kommt als `Â£` an, ein geschwungenes Apostroph als `â€™`, ein Halbgeviertstrich als `â€"`. Wenn Sie je `Â` verstreut durch eine konvertierte Tabelle gesehen haben, war das die Ursache.

**Das Trennzeichen.** Das Trennzeichen folgt dem Systemlistentrennzeichen, in Locales, in denen das Dezimaltrennzeichen ein Komma ist, schreibt Excel also Semikolons stattdessen. Ein reiner Komma-Leser sieht dann eine einzige riesige einspaltige Tabelle: jede Zeile wird zu einer Zelle, die alle Werte enthält. Es ist ein offensichtlicher Fehler, sobald Sie ihn kennen, und verwirrend beim ersten Mal. Ändern Sie entweder das Listentrennzeichen in den Regionseinstellungen vor dem Export, oder nutzen Sie einen Konverter mit einer ausdrücklichen Trennzeichenoption.

Eine weitere Falle, die man kennen sollte: `Unicode Text (*.txt)` ist tabgetrenntes UTF-16, mit eigenem BOM. Ein Konverter, der UTF-8 erwartet, sieht ein Nullbyte zwischen jedem Buchstaben und meldet die Datei meist als binär.

Die praktische Regel ist kurz. Wählen Sie `CSV UTF-8`, prüfen Sie die ersten drei Bytes einmal für die Maschine, von der Sie exportieren, und wenn das Trennzeichen ein Semikolon ist, wissen Sie, dass es eine Locale-Einstellung ist, kein Fehler.

## Wo der zuverlässige Weg scheitert, und was es kostet

Speichern-als-CSV ist die richtige Standardwahl, und sie hat fünf Kosten, die man klar benennen sollte.

**Ein Blatt auf einmal.** Excel speichert das aktive Arbeitsblatt und warnt Sie davor. Ein Arbeitsbuch mit zwölf Reitern sind zwölf Exporte, zwölf Konvertierungen und zwölf Tabellen, und es gibt keine kombinierte Ausgabe, weil CSV kein Konzept eines zweiten Blatts kennt. Wenn die Reiter ein Datensatz sind, aufgeteilt nach Monat, konsolidieren Sie innerhalb von Excel vor dem Export.

**Die Formeln sind weg, und damit auch die Quelle der Wahrheit.** Eine veröffentlichte Wertetabelle ist in Ordnung, bis jemand fragt, woher eine Zahl kam. Das Arbeitsbuch weiß es noch; das Markdown nicht. Für eine Tabelle, die Sie neu erzeugen, behalten Sie das Blatt als Quelle und das Markdown als Artefakt — bearbeiten Sie nie die Tabelle in der Erwartung, das Blatt stimme zu.

**Die Bedeutung, die in der Formatierung lebte.** Bedingte Formatierung, Füllungen und Schriftfarben tragen in sehr vielen echten Tabellenkalkulationen Informationen: Rot für überfällig, Grau für ersetzt, Fett für eine Summe. All das fällt weg, und die Leserin des Markdown kann es nicht erkennen. Die Abhilfe ist, die Bedeutung in Daten zu verschieben — eine `Status`-Spalte hinzufügen, Summen mit einem Wort statt mit einem Gewicht markieren —, was Arbeit ist, die der Konverter nicht für Sie tun kann.

**Was der Filter verborgen hat.** Wenn Sie einen Autofilter oder verborgene Spalten an Ort und Stelle gelassen haben, prüfen Sie die exportierte Datei gegen das, was Sie am Bildschirm sahen, statt es anzunehmen; die sichere Gewohnheit ist, den sichtbaren Bereich zu kopieren, statt das ganze Blatt zu exportieren, wenn ein Filter im Spiel ist.

**Die Breite, die niemand lesen wird.** Eine vierzigspaltige Tabelle ist legales Markdown und unlesbare Ausgabe: sie scrollt entweder seitwärts oder bricht zu Brei um, und der rohe Text wird von Hand unbearbeitbar. Das ist ein Designfehler, kein Konvertierungsfehler, und die Antworten sind, Spalten zu streichen, eine kleine Tabelle zu transponieren, sodass die Felder seitlich verlaufen, oder zu akzeptieren, dass manche Daten eine Tabellenkalkulation bleiben wollen, und stattdessen auf die Datei zu verlinken.

Es gibt einen sechsten Kostenpunkt, der nichts mit Daten zu tun hat. Jemand muss das Ergebnis prüfen. Konvertieren Sie das Blatt, dann lesen Sie die erste Zeile, die letzte Zeile, eine Zeile mit einem akzentuierten Zeichen und eine Zeile mit einer langen Zahl. Das sind vier Prüfungen und etwa dreißig Sekunden, und es fängt fast alles auf dieser Seite ab.

## Wie man wählt

1. **Beginnen Sie damit, wie oft Sie das tun werden.** Einmal, und Speichern-als-CSV ist fertig, bevor Sie die Datenschutzerklärung eines Add-ins zu Ende gelesen haben. Wöchentlich, und eine Hilfsspalte oder ein Skript zahlt sich innerhalb eines Monats aus.
2. **Entscheiden Sie, ob Sie einen Bereich oder ein Blatt brauchen.** Eine Auswahl will die Zwischenablage; ein Blatt will eine Datei. Den Dateiweg für zwölf Zeilen zu nutzen heißt, neunhundert zu exportieren und die meisten zu löschen.
3. **Suchen Sie nach verbundenen Zellen und Alt+Enter-Zeilenumbrüchen vor der Konvertierung, nicht danach.** Sie sind die einzigen zwei Tabellenkalkulations-Funktionen, die eine kaputte Tabelle statt einer schlichteren erzeugen, und beide brauchen eine Minute zum Beheben im Blatt und viel länger zum Debuggen in der Ausgabe.
4. **Wählen Sie die Kodierung bewusst, wenn die Daten nicht reines ASCII sind.** `CSV UTF-8` für alles mit einem Akzent, einem Währungssymbol oder einer nicht-lateinischen Schrift. Die einfache CSV-Option verliert diese Zeichen im Moment des Speicherns, und nichts später kann sie zurückbringen.
5. **Fragen Sie, wohin die Zeilen gehen.** Für eine Tabelle mit Open-Source-Lizenzen spielt es keine Rolle. Für Gehaltsabrechnungen, Patientendaten oder unveröffentlichte Zahlen ist es die ganze Frage, und ein Konverter, der in Ihrem Browser läuft, lässt Sie die Antwort verifizieren, indem Sie zusehen, wie das Netzwerkpanel nichts tut.

## Fazit

Die ehrliche Zusammenfassung von Excel zu Markdown ist, dass die Konvertierung leicht ist und die Tabellenkalkulation schwer. Speichern Sie das Blatt als CSV UTF-8, konvertieren Sie die CSV, und verbringen Sie die gesparte Zeit damit, die drei Dinge zu prüfen, die brechen: Kennungen, deren führende Nullen beim Eintippen verschwanden, Datumswerte, deren Reihenfolge von der Leserin abhängt, und verbundene Zellen, die Markdown nicht ausdrücken kann und die es still abflacht. Für einen ausgewählten Bereich fügen Sie ihn stattdessen ein — die tabgetrennte Variante der Zwischenablage ist tatsächlich leichter zu parsen als jede CSV, und TransformPipe konvertiert eingefügte Zeilen genauso wie es eine Datei konvertiert, im Browser, ohne Upload, wenn Sie abgemeldet sind. So oder so, lesen Sie die erste und letzte Zeile des Ergebnisses, bevor Sie es veröffentlichen. Das Werkzeug kann nicht wissen, dass `417` einmal `00417` war, und Sie können es.

## FAQ

### Wie konvertiere ich eine Excel-Datei in eine Markdown-Tabelle?

Speichern Sie das Blatt als `CSV UTF-8 (Comma delimited)` und konvertieren Sie diese CSV mit einem beliebigen Konverter, der CSV richtig parst, statt an Kommas zu splitten. Für einen Teil eines Blatts statt des ganzen kopieren Sie den Bereich und fügen ihn in einen Konverter ein, der eingefügten Text akzeptiert — Excel legt eine tabgetrennte Version der Zellen auf die Zwischenablage, was leichter zu parsen ist als CSV.

### Kann ich aus Excel direkt in eine Markdown-Datei einfügen?

Nicht sinnvoll. Was in einem reinen Texteditor landet, sind tabgetrennte Werte ohne Pipes und ohne Trennzeile, es rendert also als Textblock statt als Tabelle. Fügen Sie es in einen Konverter ein, oder bauen Sie die Zeilen im Blatt mit `TEXTJOIN` und fügen Sie das fertige Markdown ein.

### Warum sind meine führenden Nullen verschwunden?

Weil Excel den Wert beim Eintippen zu einer Zahl gemacht hat, lange vor jedem Export — `00417` wurde die Zahl 417, und die Datei enthielt die Nullen nie. Formatieren Sie die Spalte vor der Eingabe oder dem Einfügen der Daten als Text, oder stellen Sie jedem Wert ein Apostroph voran; keines von beidem stellt Werte wieder her, die schon gezwungen wurden.

### Warum benutzt meine exportierte CSV Semikolons statt Kommas?

Weil das Trennzeichen dem Listentrennzeichen Ihres Systems folgt, und in Locales, die ein Komma als Dezimaltrennzeichen nutzen, ist diese Einstellung ein Semikolon. Ändern Sie das Listentrennzeichen in den Windows-Regionseinstellungen vor dem Export, oder nutzen Sie einen Konverter, der Ihnen erlaubt, das Trennzeichen anzugeben. Ein reiner Komma-Leser macht aus der ganzen Datei eine einzige Spalte.

### Was passiert mit verbundenen Zellen?

Sie werden abgeflacht: der Wert geht an die obere linke Zelle des verbundenen Bereichs, und der Rest kommt leer heraus. Markdown-Tabellen haben kein Colspan oder Rowspan, die einzigen Abhilfen sind also, zu trennen und das Label zu wiederholen, eine verbundene Kopfzeile aus der Tabelle in eine Überschrift zu heben, die Tabelle in zwei zu teilen, oder auf eine rohe HTML-Tabelle zurückzufallen.

### Bedeutet das Konvertieren einer Tabellenkalkulation, sie hochzuladen?

Nur, wenn das Werkzeug so funktioniert, und viele tun das. Ein Konverter, der im Browser läuft, liest die Datei auf Ihrer eigenen Maschine, was Sie bestätigen können, indem Sie das Netzwerkpanel öffnen und zusehen, wie nichts es verlässt — es lohnt sich, das einmal für jedes Werkzeug zu tun, dem Sie echte Daten geben wollen, da Tabellenkalkulationen zu den sensibelsten Zeilen neigen, die irgendwer konvertiert.

### Kann ich Fettschrift und Hyperlinks aus dem Blatt behalten?

Nur über die HTML-Variante der Zwischenablage, die `<a href>`-Links und Inline-Styles trägt, und dann nur, wenn Sie dieses HTML zu Markdown konvertieren, statt es als reinen Text einzufügen. Die Variante mit reinem Text hat Werte und sonst nichts, und ein CSV-Export hat überhaupt keine Formatierung.

### Muss ich zuerst nach CSV exportieren?

Nein, wenn der Konverter `.xlsx` direkt liest — das Format ist ein Zip aus XML, dieselbe Form wie eine `.docx`, ein Konverter, der Zips öffnet, kann die Blätter eines Arbeitsbuchs also ohne eine Textdatei dazwischen lesen. Der CSV-Weg bleibt wissenswert für Werkzeuge, die nur reinen Text akzeptieren, oder für den Moment, in dem Sie die Werte in einem Editor prüfen wollen, bevor sie zu einer Tabelle werden.
