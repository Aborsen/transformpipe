---
title: "CSV in eine Markdown-Tabelle umwandeln, ohne die Daten zu zerstören"
description: "Eine CSV in eine Markdown-Tabelle umwandeln, und die Fallen dabei: zitierte Kommas, Zeilenumbrüche in Zellen, Pipes, Semikola, BOMs und eine fehlende Kopfzeile"
date: 2026-09-03
tag: Konvertieren
keywords: csv nach markdown tabelle, csv in markdown umwandeln, csv markdown tabelle konverter, tsv nach markdown tabelle, csv zitiertes feld markdown, markdown tabelle aus tabellenkalkulation, semikolon getrennte csv nach markdown
---

### Kurzfassung

Eine CSV in eine Markdown-Tabelle umzuwandeln ist zwei Zeilen Arbeit — eine Kopfzeile, eine Trennzeile aus Bindestrichen und eine Zeile pro Datensatz — und etwa neun Arten, es lautlos falsch zu machen. Alle Fehler kommen von derselben Stelle: Eine CSV ist keine Datei mit Kommas drin, sie ist ein zitiertes Format mit Regeln, und ein Konverter, der auf Kommas aufteilt, erzeugt eine Tabelle, die in Ordnung aussieht und etwas anderes sagt als die Datei. Nehmen Sie ein Werkzeug mit einem echten CSV-Parser, maskieren Sie Pipes auf dem Weg hinaus als `\|`, ersetzen Sie Zeilenumbrüche in Zellen durch `<br>`, weil eine Markdown-Tabelle keinen Zeilenumbruch halten kann, und fügen Sie vor der Konvertierung eine Kopfzeile hinzu, wenn Ihre Datei keine hat. Prüfen Sie dann eine schwierige Zeile in der Ausgabe statt der ersten drei.

Die Mechanik ist trivial. Genau das macht diese Arbeit gefährlich: Weil die Ausgabe immer wie eine plausible Tabelle aussieht, sagt Ihnen nichts, wenn ein Wert eine Spalte nach links gerutscht ist, wenn ein Name sein Komma verloren hat oder wenn eine Zeile still ihr letztes Feld verloren hat. Die Tabelle wird dargestellt. Die Daten sind falsch. Niemand merkt es, bis jemand in einer Besprechung eine Zahl vorliest.

Das meiste Ärgernis kommt aus Tabellenkalkulationen. Eine CSV, die von einem Programm geschrieben und von einem Programm gelesen wurde, ist meist sauber, weil beide Enden dieselben Regeln umgesetzt haben. Eine CSV, die eine Person aus Excel, Numbers oder einem CRM exportiert hat, enthält Adressen mit Zeilenumbrüchen darin, Notizen mit Anführungszeichen, eine erste Spaltenüberschrift mit einem unsichtbar angehängten Byte — und, je nachdem, wo die Maschine glaubt zu stehen, Semikola, wo Sie Kommas erwartet haben.

Dieser Text ist das Verfahren und die Fallen. Das Verfahren dauert eine Minute. Die Fallen sind der Artikel, und sie stehen in der Reihenfolge, in der sie zuschlagen: zuerst das Zitieren, weil es ändert, was eine Zeile überhaupt bedeutet, dann das Maskieren auf dem Weg hinaus, dann die Probleme auf Dateiebene, die verhindern, dass die Konvertierung überhaupt wie eine Tabelle aussieht.

## Wie Sie eine CSV in eine Markdown-Tabelle umwandeln

Das Zielformat ist fest und klein. Eine GitHub-Flavored-Markdown-Tabelle ist eine Kopfzeile, eine Trennzeile aus Bindestrichen und eine Zeile pro Datensatz, mit Zellen, getrennt durch Pipes:

```markdown
| id | name | role |
| --- | --- | --- |
| 1 | Ann Rowe | Ops |
| 2 | Li Wei | Sales |
```

Die führenden und abschließenden Pipes sind laut Spezifikation optional und trotzdem sinnvoll zu schreiben, weil sie eine Zelle mit einem führenden Leerzeichen eindeutig machen und sich in einem Diff besser lesen. Die Trennzeile ist keine Dekoration: Sie ist die Zeile, die dem Parser sagt, dass der Block darüber eine Kopfzeile ist statt eines Absatzes, und sie muss dieselbe Anzahl Zellen haben wie die Kopfzeile. Machen Sie das falsch, haben Sie einen Absatz voller Pipe-Zeichen. Was das Format sonst kann und nicht kann, behandelt [der Text über Markdown-Tabellen selbst](/blog/markdown-tables-that-survive-conversion); dieser Artikel handelt davon, Ihre Zeilen in diese Form zu bringen, ohne eine davon zu verlieren.

Hier ist das ganze Verfahren.

1. **Öffnen Sie die Datei zuerst in einem Texteditor, nicht in einer Tabellenkalkulation.** Eine Tabellenkalkulation zeigt Ihnen ihre eigene Auslegung der Datei, und genau die wollen Sie überprüfen. Ein Texteditor zeigt Ihnen die Bytes: ob der Trenner ein Komma ist, ob Felder zitiert sind, ob es eine Kopfzeile gibt und ob sich ein Datensatz über mehr als eine Zeile erstreckt. Dreißig Sekunden hier sparen den Rest.
2. **Bestätigen Sie den Trenner.** Kommas sind der Standard, nicht die Regel. Liest die erste Zeile `id;name;role`, haben Sie eine Semikolon-Datei, und jedes kommabasierte Werkzeug gibt Ihnen eine Zelle pro Zeile.
3. **Bestätigen Sie, dass es eine Kopfzeile gibt.** Ist die erste Zeile bereits Daten, fügen Sie vor dem Konvertieren eine Kopfzeile hinzu. Eine Markdown-Tabelle kann ohne eine nicht existieren, und jede automatische Antwort auf eine fehlende Kopfzeile verliert etwas.
4. **Konvertieren Sie mit etwas, das parst statt teilt.** Das heißt ein CSV-Reader — ein browserseitiger Konverter, eine Bibliothek, oder ein Kommandozeilenwerkzeug, gebaut für tabellarische Daten. Ein `cut -d,` oder ein `split(',')` ist das falsche Werkzeug, und der Schaden, den es anrichtet, ist in der Ausgabe unsichtbar.
5. **Prüfen Sie das Maskieren auf dem Weg hinaus.** Pipes in Werten müssen zu `\|` werden. Zeilenumbrüche in Zellen müssen zu `<br>` oder einem Leerzeichen werden. Verdoppelte Anführungszeichen müssen zu einfachen zusammengefallen sein.
6. **Sehen Sie sich die schwierigste Zeile an, nicht die erste.** Finden Sie die Zeile mit einem zitierten Komma, einem Apostroph, einem Anführungszeichen oder einem Pfad darin, und lesen Sie diese Zeile in der Ausgabe gegen dieselbe Zeile in der Quelle.

Um Schritt sechs konkret zu machen, hier eine kleine Datei, die fünf der Fallen auf einmal trägt. Behalten Sie so etwas; es ist der einzige Test, der zählt.

```csv
id,name,role,notes
1,"Smith, John",Sales,"Joined 2019
Moved from Support"
2,"O""Brien, Ann",Ops,"Owns the a|b routing rule"
3,Li Wei,Support,"Said ""no"" twice"
```

Vier Datensätze, nicht fünf, denn Datensatz 1 enthält einen Zeilenumbruch innerhalb eines zitierten Feldes. Eine korrekte Konvertierung erzeugt das hier:

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | Smith, John | Sales | Joined 2019<br>Moved from Support |
| 2 | O"Brien, Ann | Ops | Owns the a\|b routing rule |
| 3 | Li Wei | Support | Said "no" twice |
```

Jeder Unterschied zwischen dieser Ausgabe und der Quelle ist beabsichtigt: Die Anführungszeichen um Felder sind weg, weil sie Syntax waren, die verdoppelten Anführungszeichen sind zu einfachen zusammengefallen, der Zeilenumbruch ist zu `<br>` geworden, und die Pipe ist maskiert. Nichts hat die Spalte gewechselt.

Ein naives Aufteilen auf Kommas erzeugt stattdessen das hier, und das ist der Teil, den es sich anzustarren lohnt:

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | "Smith | John" | Sales |
| Moved from Support" | | | |
| 2 | "O""Brien | Ann" | Ops |
| 3 | Li Wei | Support | "Said ""no"" twice" |
```

Johns Rolle ist jetzt sein Nachname. Das Notizfeld ist aus Zeile 1 komplett verschwunden, weil Markdown Zellen jenseits der Kopfzeilenanzahl verwirft und `"Joined 2019` das fünfte war. Die Fortsetzungszeile ist zu einer eigenen Zeile geworden. Ann hat dasselbe Problem plus sichtbar verdoppelte Anführungszeichen. Nur Zeile 3 hat überlebt, und sie hat überlebt, weil sie langweilig war. Die Tabelle wird einwandfrei dargestellt.

## Die Übersichtstabelle: jede Falle an einem Ort

| Falle | In der CSV | Was ein naives Aufteilen tut | Was eine korrekte Konvertierung tut |
| --- | --- | --- | --- |
| Zitiertes Feld | `"Sales"` | Behält die Anführungszeichen als Zeichen | Entfernt sie; sie waren Syntax |
| Komma innerhalb von Anführungszeichen | `"Smith, John"` | Zwei Zellen; die Zeile wächst um eine Spalte; der letzte Wert geht verloren | Eine Zelle, die das Komma enthält |
| Verdoppeltes Anführungszeichen | `"Said ""no"""` | Lässt `""no""` sichtbar in der Zelle | Fällt zu `"no"` zusammen |
| Zeilenumbruch in einer Zelle | ein zitiertes Feld über zwei Zeilen | Teilt den Datensatz in zwei fehlerhafte Zeilen | Ersetzt den Umbruch durch `<br>` oder ein Leerzeichen |
| Pipe in einem Wert | eine nackte Pipe innerhalb eines Feldes | Fügt dieser Zeile eine Phantomspalte hinzu | Maskiert sie als `a\|b` |
| Keine Kopfzeile | erste Zeile ist Daten | Befördert Daten still zu Überschriften | Sie fügen vor dem Konvertieren eine Kopfzeile hinzu |
| Semikolon-Trenner | `id;name;role` | Eine Zelle pro Zeile, die ganze Zeile darin | Liest die Datei mit `;` als Trenner |
| Tabulator-Trenner | `id<TAB>name` | Eine Zelle pro Zeile | Liest sie als TSV |
| BOM aus Excel | unsichtbares `EF BB BF` vor `id` | Hängt sich an die erste Überschrift; Vergleiche schlagen fehl | Entfernt es, oder liest als `utf-8-sig` |
| CRLF-Zeilenenden | jede Zeile endet auf `\r\n` | Lässt ein verirrtes `\r` am letzten Feld jeder Zeile | Vom Reader behandelt; nichts sichtbar |
| Zerfranste Zeilen | eine Zeile kürzer als die Kopfzeile | Kurze Zeile still aufgefüllt, lange Zeile abgeschnitten | Dasselbe, aber Sie wurden informiert, oder Sie haben geprüft |
| Ausrichtung | nichts in der Datei drückt sie aus | Jede Spalte linksbündig | Doppelpunkte in der Trennzeile, von Ihnen gewählt |

Das Muster in dieser Tabelle ist es wert, benannt zu werden. Etwa die Hälfte dieser Fehler ist laut — eine Semikolon-Datei konvertiert in eine Spalte, und Sie sehen es sofort. Die andere Hälfte ist leise, und jeder leise betrifft das Zitieren. Deshalb ist die Prüfung eine schwierige Zeile statt eines Blicks auf die Ausgabe.

## Symptom zu Ursache: was Sie sehen und was es verursacht hat

Arbeiten Sie diese Tabelle durch, wenn eine Konvertierung bereits schiefgegangen ist. Das Symptom ist, was Sie bemerkt haben; die Ursache ist, was in der Quelle oder im Werkzeug zu beheben ist.

| Symptom | Ursache | Abhilfe |
| --- | --- | --- |
| Jede Zeile ist eine Zelle mit der ganzen Zeile darin | Der Trenner ist ein Semikolon oder ein Tabulator, und das Werkzeug hat ein Komma angenommen | Trenner setzen, oder ein Werkzeug nehmen, das ihn erschnüffelt |
| Ein Wert ist in die nächste Spalte gerutscht, spätere Werte nach links verschoben | Ein Komma in einem zitierten Feld wurde als Trenner behandelt | Einen echten CSV-Parser verwenden |
| Der letzte Wert einer Zeile fehlt | Dieselbe Ursache: Die Zeile wurde breiter als die Kopfzeile, und GFM verwirft die zusätzlichen Zellen | Einen echten CSV-Parser verwenden |
| Anführungszeichen erscheinen um Werte in der Tabelle | Anführungszeichen wurden als Zeichen behandelt statt als Syntax | Einen echten CSV-Parser verwenden |
| `""` erscheint innerhalb einer Zelle | Das Escape für verdoppelte Anführungszeichen wurde nicht zusammengeführt | Einen echten CSV-Parser verwenden |
| Eine Zeile erscheint doppelt, die zweite fehlerhaft und kurz | Ein zitiertes Feld enthielt einen Zeilenumbruch, und der Datensatz wurde daran geteilt | Mit einem Parser konvertieren, der mehrzeilige Datensätze liest |
| Zwei Sätze sind ohne Leerzeichen zusammengelaufen | Ein Zeilenumbruch in einer Zelle wurde weggelassen statt ersetzt | Durch `<br>` ersetzen, oder durch ein Leerzeichen |
| `<br>` erscheint als sichtbarer Text in der Ausgabe | Das Markdown wird als reiner Text gelesen, nicht als HTML dargestellt | Stattdessen ein Leerzeichen nehmen, oder das Markdown rendern |
| Eine Zeile hat eine Spalte mehr als die anderen | Eine unmaskierte Pipe innerhalb eines Wertes | Als `\|` maskieren |
| Die erste Spaltenüberschrift passt zu nichts, womit Sie sie vergleichen | Ein Byte Order Mark hängt daran | Die Datei als `utf-8-sig` lesen, oder das BOM entfernen |
| Akzentbuchstaben sind Mojibake | Die Datei hat nicht die vom Reader angenommene Kodierung — oft Windows-1252, gelesen als UTF-8 | Die Kodierung vor dem Parsen konvertieren |
| Der ganze Block wird als Absatz aus Pipes dargestellt | Die Trennzeile fehlt, ist fehlerhaft, oder hat die falsche Zellenzahl | Die Trennzeile reparieren |
| Die Tabelle wird dargestellt, aber die Kopfzeile ist Ihre erste Datenzeile | Die Datei hatte keine Kopfzeile, und das Werkzeug hat Zeile eins befördert | Der Quelle eine Kopfzeile hinzufügen |
| Ein nachgestelltes `\r` erscheint am Ende der letzten Zelle jeder Zeile | CRLF-Zeilenenden, nur an `\n` geteilt | Einen Reader nehmen, der CRLF behandelt |
| Zahlen erscheinen als `0.4567`, wo die Tabelle `45.67%` zeigte | Der Export hat den Wert geschrieben, nicht das Anzeigeformat | Den Export reparieren, oder die Spalte, vor dem Konvertieren |

## Zitieren: Kommas, verdoppelte Anführungszeichen und Zeilenumbrüche

Alles in diesem Abschnitt kommt aus einer Regel in RFC 4180: Ein Feld darf in doppelte Anführungszeichen eingeschlossen werden, und innerhalb dieser Anführungszeichen ist ein Komma Daten, ein Zeilenumbruch ist Daten, und ein doppeltes Anführungszeichen wird als zwei doppelte Anführungszeichen geschrieben. Drei Sätze. Jeder leise Fehler in einer CSV-Konvertierung ist ein Werkzeug, das einen davon nicht umgesetzt hat.

### Ein Komma innerhalb eines zitierten Feldes

`"Smith, John",Sales,2026` sind drei Felder. Ein Parser liest das öffnende Anführungszeichen, verbraucht alles bis zum schließenden und gibt Ihnen `Smith, John` als einen Wert. Ein Aufteilen auf Kommas gibt Ihnen vier, und jetzt ist die Zeile eine Zelle breiter als ihre Kopfzeile.

Das ist der Fehler, der Daten kostet statt nur schlecht auszusehen. GFMs Tabellenregel ist, dass bei einer Zeile mit mehr Zellen als die Kopfzeile die zusätzlichen Zellen verworfen werden, die verbreiterte Zeile also nicht fehlschlägt, nicht warnt und nicht überläuft — sie verliert ihren letzten Wert und verschiebt alles danach um eine Spalte nach links. Namen, Adressen, Berufsbezeichnungen und Freitextnotizen sind die Orte, an denen das passiert. Wenn eine Spalte ein Komma enthalten kann, betrifft sie diese Falle.

### Ein verdoppeltes Anführungszeichen bedeutet ein Anführungszeichen

Innerhalb eines zitierten Feldes ist `""` ein wörtliches `"`. `"She said ""no""."` ist also ein Feld, das liest: She said "no". Ein Werkzeug, das Anführungszeichen nach Muster statt durch Parsen entfernt, lässt die Paare zurück, und Sie bekommen `She said ""no""` in der Zelle.

Das ist kosmetisch, bis es das nicht mehr ist. In einer Spalte aus Prosa sind verdoppelte Anführungszeichen hässlich. In einer Spalte aus Maßangaben in Zoll, aus Codebeispielen oder aus JSON-Fragmenten ändern sie den Wert. Eine Zelle, die `{"id": 1}` liest, die als `{""id"": 1}` ankommt, ist kein gültiges JSON mehr, und wenn jemand es später aus Ihrem Dokument herauskopiert, verbringt er zehn Minuten damit.

### Ein Zeilenumbruch innerhalb einer Zelle

Das ist die Falle ohne saubere Antwort, und es lohnt sich, sie zu verstehen statt sie zu umgehen.

RFC 4180 erlaubt einen Zeilenumbruch innerhalb eines zitierten Feldes, und Tabellenkalkulationen erzeugen sie ständig, denn Alt+Enter innerhalb einer Zelle ist, wie Leute Adressblöcke und Notizen schreiben. Eine Markdown-Tabelle hat keine Möglichkeit, das darzustellen. Das Format ist zeilenbasiert: eine Zeile pro Datensatz, keine Fortsetzungssyntax, kein Escape für einen Zeilenumbruch. Was der Konverter hier auch tut, er wählt zwischen zwei Lügen.

```csv
id,address
1,"12 Mill Lane
Bristol
BS1 4AA"
```

Die drei Arten, wie das in einer Markdown-Tabelle landen kann:

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane<br>Bristol<br>BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane Bristol BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane |
| Bristol | |
| BS1 4AA" | |
```

Die erste behält die Struktur und setzt ein HTML-Tag in Ihr Markdown. Die zweite hält das Markdown sauber und verliert die Struktur, und wenn das Werkzeug ohne Leerzeichen zusammenfügt, bekommen Sie `12 Mill LaneBristol`. Die dritte ist, was ein Aufteiler tut, und sie ist schlicht kaputt. Bevorzugen Sie die erste, wenn das Markdown als HTML dargestellt wird, was der übliche Fall ist, und die zweite, wenn nicht — eine reine Text-README, gelesen im Terminal, eine Commit-Nachricht, eine Chat-Nachricht in einem Client, der kein HTML innerhalb von Tabellen darstellt. Warum Markdown innerhalb einer Tabelle keine bessere Option hat, ist eine Folge davon, [wie Zeilenumbrüche in Markdown allgemein funktionieren](/blog/markdown-line-breaks-and-lists): Der Umbruch mit zwei Leerzeichen und der Umbruch mit Backslash sind Inline-Konstrukte, und eine Tabellenzeile endet am Zeilenumbruch, ganz gleich was.

Wenn Ihre Daten Zeilenumbrüche in einer Spalte haben und die Struktur wichtig ist, ist die ehrliche Antwort manchmal, dass die Spalte nicht in die Tabelle gehört. Verschieben Sie sie darunter als Definitionsliste, oder verlinken Sie auf die Quelle.

## Maskieren auf dem Weg hinaus: Pipes, Backslashes und Ausrichtung

Die CSV korrekt zu parsen bringt die Werte richtig. Das Markdown korrekt zu schreiben hält sie richtig. Drei Dinge sind auf dem Weg hinaus zu erledigen, und eine davon ist der häufigste Fehler in selbstgebauten Konvertern.

### Die Pipe

CSV kümmert sich nicht um Pipes. Markdown sehr wohl: eine unmaskierte `|` beendet die Zelle, wo auch immer sie erscheint. Sie muss als `\|` geschrieben werden.

Das Detail, das Leute übersehen, ist, dass Backticks sie nicht schützen. Eine Pipe innerhalb einer Inline-Code-Spanne innerhalb einer Tabellenzelle beendet die Zelle trotzdem — die Tabelle wird in Zellen zerlegt, bevor Inline-Syntax überhaupt betrachtet wird, `` `a|b` `` wird also zu zwei Zellen, die erste mit einer nicht geschlossenen Code-Spanne. Die GFM-Spezifikation ist ausdrücklich, dass das Maskieren auch innerhalb anderer Inline-Spannen nötig ist. Es gibt keinen anderen Mechanismus.

```csv
pattern,meaning
"^(a|b)$","a or b, anchored"
```

```markdown
| pattern | meaning |
| --- | --- |
| `^(a\|b)$` | a or b, anchored |
```

Wo das auftaucht: Dateipfade in Shell-Beispielen, reguläre Ausdrücke, Shell-Pipelines, aufgezählte Optionen in einer Dokumentationsspalte, und jede Spalte mit `yes|no|maybe`. Konverter, die gegen Namen und Zahlen geschrieben und getestet wurden, treffen das nie. Wenn Sie ein Werkzeug bewerten, setzen Sie absichtlich eine Pipe in eine Testzelle.

### Der Backslash

Weniger häufig und trotzdem wissenswert. Ein Wert, der auf einen Backslash endet, oder eine Folge wie `\n` als wörtlicher Text enthält, kann mit Markdowns eigenem Maskieren interagieren — `\|` ist eine maskierte Pipe, ein Wert, der legitim mit `...\` endet, gefolgt von einem Pipe-Trenner, erzeugt also etwas Mehrdeutiges. Ein sorgfältiger Schreiber maskiert Backslashes in Zelleninhalten als `\\`. Die meisten Konverter tun das nicht, und die meisten Daten lösen es nie aus. Prüfen Sie es nur, wenn Ihre Spalten Windows-Pfade oder Code enthalten.

### Ausrichtungs-Doppelpunkte

Nichts in einer CSV drückt Ausrichtung aus. Eine rechtsbündige Zahlenspalte einer Tabellenkalkulation ist eine Anzeigeeigenschaft der Tabellenkalkulation, sie übersteht weder den Export noch erst recht die Konvertierung. Markdown gibt Ihnen drei Optionen pro Spalte, gesetzt durch Doppelpunkte in der Trennzeile, und sie anzuwenden ist eine Entscheidung, die Sie nach der Konvertierung treffen:

```markdown
| Item | Qty | Price |
| :--- | ---: | ---: |
| Widget | 12 | 4.50 |
| Flange | 3 | 12.00 |
```

`:---` ist links, `---:` ist rechts, `:---:` ist zentriert, und ein nacktes `---` überlässt es dem Renderer, was in der Praxis links bedeutet. Richten Sie numerische Spalten rechtsbündig aus; es ist die eine manuelle Bearbeitung, die eine konvertierte Tabelle zuverlässig verbessert, denn eine Spalte rechtsbündiger Zahlen lässt sich mit dem Auge vergleichen, eine linksbündige nicht. Beachten Sie, dass viele Konverter nackte Bindestriche ausgeben und das Ihnen überlassen, und dass die Doppelpunkte die einzige Spaltenformatierung sind, die das Format hat — keine Breiten, keine Farben, keine Ausrichtung pro Zelle.

### Auffüllen, und warum es keine Rolle spielt

Manche Werkzeuge füllen jede Zelle auf, damit die Pipes in der Quelle fluchten. Das hat keinerlei Wirkung auf die dargestellte Ausgabe; es ist rein für jeden, der das Markdown als Text liest. Auffüllen macht eine breite Tabelle angenehm in einem Editor zu lesen und schrecklich zu diffen, denn das Ändern eines Werts schreibt jede Zeile im Block neu. Für eine Tabelle, die in einem Repository lebt und bearbeitet wird, ist ungepolstert die bessere Wahl. Für eine Tabelle, die jemand als reinen Text liest, polstern Sie sie.

## Die Kopfzeile, der Trenner und die Bytes, die Sie nicht sehen

Diese drei sind Probleme auf Dateiebene. Sie sind meist laut, und alle drei werden vor der Konvertierung behoben, nicht danach.

### Eine Datei ohne Kopfzeile

Maschinell erzeugte CSVs haben häufig keine Kopfzeile: ein Log-Export, ein Datenbank-Dump, ein Sensor-Feed, eine API-Paging-Antwort, direkt auf die Platte geschrieben. Eine Markdown-Tabelle kann ohne Kopfzeile nicht existieren, denn die Trennzeile darunter ist das, was den Block überhaupt als Tabelle identifiziert.

Jeder Konverter tut also eines von drei Dingen, und keines davon ist gut:

| Verhalten | Ergebnis |
| --- | --- |
| Die erste Datenzeile befördern | Sie verlieren die Daten dieser Zeile, und die Überschriften sind bedeutungslos |
| Platzhalternamen erzeugen | `a, b, c` oder `Column 1, Column 2` — die Tabelle ist lesbar und sagt nichts |
| Die Konvertierung verweigern | Ehrlich, und selten |

Die meisten Werkzeuge nehmen die erste Option still, weshalb eine konvertierte Logdatei so oft einen Zeitstempel dort hat, wo die Spaltennamen stehen sollten. Die Abhilfe ist eine Zeile in einem Texteditor: eine Kopfzeile hinzufügen. Sie wissen, was die Spalten sind, und keine automatische Antwort darauf erzeugt je eine Tabelle, die jemand in sechs Monaten lesen kann.

### Semikola, Tabulatoren und andere Trenner

Eine `.csv`-Datei ist nicht zwingend kommagetrennt. In Gebieten, in denen das Komma der Dezimaltrenner ist, verwendet eine Tabellenkalkulation beim Exportieren als CSV den Listentrenner aus den regionalen Systemeinstellungen, und das ist häufig ein Semikolon — und die Datei trägt trotzdem die Endung `.csv`. Das ist die häufigste Ursache für „der Konverter hat eine einzige Spalte erzeugt".

```csv
id;name;price
1;Widget;4,50
```

Beachten Sie das zweite Problem in dieser Datei: `4,50` ist vier Komma fünf, geschrieben in einer Region, die das Komma als Dezimalpunkt verwendet. Den Trenner zu ändern konvertiert die Zahlen nicht. Wenn diese Werte in eine Tabelle gehen, die Menschen lesen, entscheiden Sie, ob sie vorher normalisiert werden sollten, denn eine gemischte Tabelle aus `4,50` und `12.00` ist schlimmer als beides einzeln.

Tabulatorgetrennte Werte sind dasselbe Format mit einem anderen Trenner, und sie lassen sich aus einem Grund sicherer handhaben: Tabulatoren tauchen fast nie innerhalb von Werten auf, die Zitierprobleme verdampfen also meist. Das ist auch, warum das Kopieren eines Bereichs aus einer Tabellenkalkulation und Einfügen oft besser funktioniert als eine CSV zu exportieren — die Zwischenablage trägt tabulatorgetrennten Text.

| Trenner | Woher er kommt | Was zu tun ist |
| --- | --- | --- |
| Komma | Der Standard, und die meisten programmatischen Exporte | Nichts |
| Semikolon | Tabellenkalkulations-Exporte in Regionen mit Komma als Dezimaltrenner | Trenner setzen; auch den Dezimaltrenner prüfen |
| Tabulator | `.tsv`, `.tab`, und alles aus einer Tabellenkalkulation eingefügt | Als TSV lesen |
| Pipe | Manche Datenbank- und Mainframe-Exporte | Trenner setzen, und daran denken, dass jetzt jeder Wert in der Ausgabe maskiert werden muss |
| Feste Breite | Alte Berichte | Überhaupt keine CSV; braucht zuerst einen Parser für Spaltenpositionen |

Eine pipe-getrennte Quelle ist einen Moment Nachdenken wert, denn der Trenner und die Ausgabesyntax sind jetzt dasselbe Zeichen. Parsen Sie sie als pipe-getrennt, und maskieren Sie dann jede Pipe, die innerhalb der Werte stand. Ein Werkzeug, das sie als CSV liest, erzeugt eine Tabelle, die korrekt aussieht und in jeder Zeile falsch ist, die eine Pipe in ihren Daten hatte.

### Die Bytes vor dem ersten Feld

Zwei unsichtbare Dinge reisen mit Dateien mit, die unter Windows geschrieben oder aus Excel exportiert wurden.

Ein **Byte Order Mark** — die Bytes `EF BB BF` — kann ganz am Anfang einer UTF-8-Datei sitzen. Excel schreibt eines, wenn Sie sein Speicherformat „CSV UTF-8" wählen, und es ist da zum Nutzen von Programmen, die sonst die Kodierung raten müssten. Ihr CSV-Reader entfernt es womöglich, oder auch nicht. Tut er es nicht, hängt sich das Zeichen an Ihre erste Spaltenüberschrift, wo es in jedem Editor unsichtbar ist und jeden Vergleich mit dieser Überschrift bricht. Sie bekommen eine Überschrift, die aussieht wie `id`, nicht gleich `id` ist, und sich nicht erklären lässt, indem man sie ansieht.

```python
# Liest das BOM und verwirft es, falls vorhanden.
with open('data.csv', newline='', encoding='utf-8-sig') as handle:
    rows = list(csv.reader(handle))
```

```bash
# Entfernt ein UTF-8-BOM nur aus der ersten Zeile.
sed '1s/^\xEF\xBB\xBF//' data.csv > clean.csv
```

**CRLF-Zeilenenden** sind das andere. RFC 4180 legt tatsächlich CRLF als Datensatztrenner fest, eine wohlgeformte CSV hat sie also, und ein Reader muss damit umgehen können. Ein Werkzeug, das nur an `\n` teilt, lässt ein Wagenrücklaufzeichen am letzten Feld jeder Zeile kleben, was unsichtbar ist, bis Sie einen Wert vergleichen oder ihn irgendwohin einfügen, das Steuerzeichen zeigt.

Kodierung ist das dritte Problem auf Dateiebene und das lauteste der drei. Eine CSV trägt keine Angabe ihrer eigenen Kodierung. Eine als Windows-1252 gespeicherte und als UTF-8 gelesene Datei gibt Ihnen Mojibake bei jedem akzentuierten Namen; als UTF-8 gelesen, obwohl sie eigentlich UTF-16 ist, parst sie womöglich gar nicht. Konvertieren Sie die Datei, bevor Sie die Tabelle konvertieren:

```bash
iconv -f WINDOWS-1252 -t UTF-8 data.csv > data-utf8.csv
```

Keines dieser drei Probleme ist schwierig. Alle drei sind unsichtbar, und alle drei werden von einem ordentlichen Reader behandelt und von keinem der Einzeiler, zu denen Leute zuerst greifen.

## Wo eine Markdown-Tabelle die falsche Antwort ist

Der ehrliche Abschnitt. Manches, was eine Tabellenkalkulation hält, hat kein Markdown-Äquivalent, und kein Konverter behebt das, denn die Einschränkung liegt im Format, nicht im Werkzeug. Zu wissen, welche Teile das sind, erspart Ihnen die Suche nach einem besseren Werkzeug.

**Verbundene Zellen.** Es gibt kein Colspan oder Rowspan. Eine Überschrift, die im Blatt drei Spalten überspannt, muss zu einer Überschrift mit zwei leeren Nachbarn werden, oder zu drei wiederholten Überschriften. Wenn die Quelle sich auf verbundene Zellen verlässt, um ihre Struktur auszudrücken, muss die Tabelle neu entworfen werden, bevor sie konvertiert werden kann.

**Verschachtelte oder gruppierte Überschriften.** Zwei Kopfzeilen — eine Gruppe darüber, Unterspalten darunter — ist eine verbreitete Tabellenkalkulationsform und in Markdown unmöglich, das genau eine Kopfzeile hat. Flachen Sie es zu zusammengesetzten Namen wie `2025 Q1` und `2025 Q2` ab, oder verwenden Sie rohes HTML, wobei Sie dann keine Markdown-Tabelle mehr schreiben.

**Alles Breite.** Markdown-Tabellen brechen und scrollen nicht von selbst um. Zwölf Spalten Prosa werden zu einer Tabelle, breiter als die Seite, und was als Nächstes passiert, hängt von dem ab, was sie darstellt: Überlauf, ein Zusammenquetschen, oder eine Bildlaufleiste, wenn das umgebende HTML eine liefert. Spalten vor dem Konvertieren streichen, oder transponieren, sodass die Zeilen zu Spalten werden, oder akzeptieren, dass sie auf einem breiten Bildschirm gelesen wird.

**Alles Lange.** Eine Tabelle mit tausend Zeilen in einem Dokument ist keine Tabelle, sie ist ein Datenabwurf mit Rahmen. Es gibt keine Seitenaufteilung und keine Sortierung. Oberhalb von etwa fünfzig Zeilen ist die brauchbare Ausgabe eine zusammenfassende Tabelle plus ein Link zur CSV.

**Alles Interaktive.** Kein Sortieren, kein Filtern, keine Summenzeile, die sich neu berechnet, keine bedingte Formatierung. Wenn ein Leser die Zahlen befragen muss statt sie zu lesen, ist die Tabelle das falsche Artefakt.

**Formeln und Formate.** Diese sind schon weg, bevor der Konverter die Datei sieht. Ein CSV-Export enthält Werte, und Währungssymbole, Tausendertrennzeichen, Prozentangaben und Datumsformate sind Anzeigeeigenschaften, die der Exporteur entweder ausgeschrieben hat oder nicht. Zeigt die Tabelle `0.4567`, wo das Blatt `45.67%` zeigte, hat das der Export getan.

Es gibt auch Kosten, die zu den Wegen selbst gehören. Ein browserseitiger Konverter erledigt die Arbeit auf Ihrer eigenen Maschine, weshalb nichts hochgeladen wird, und dieselbe Tatsache bedeutet, dass eine sehr große Datei durch die Maschine und den Tab begrenzt ist: TransformPipe begrenzt eine Konvertierung auf 10 MB, und ein Dokument, das als teilbarer Link aufbewahrt wird, auf 4 MB, weil die Funktion, die es speichert, einen größeren Anfragekörper ablehnt. Ein Kommandozeilenwerkzeug hat keine solche Obergrenze und braucht dafür eine Installation und jemanden, der sich die Flags merkt. Ein Tabellenkalkulations-Plugin ist bequem und bindet die Arbeit an die Anwendung. Keines davon ist ein Mangel; es ist die Form jedes Weges, und der Vergleich der Wege selbst ist das Thema von [der Rundschau der CSV-zu-Markdown-Konverter](/blog/best-csv-to-markdown-converters).

Noch eine Kosten, die es zu nennen lohnt: der Dialekt. Tabellen sind nicht in CommonMark. Sie sind eine GitHub-Flavored-Markdown-Erweiterung, ein strikt CommonMark-konformer Renderer zeigt Ihre konvertierte Tabelle also als Absatz voller Pipes. Bevor Sie hundert Zeilen konvertieren, bestätigen Sie, dass das, was das Ergebnis darstellen wird, überhaupt Tabellen beherrscht — [die Dialekte unterscheiden sich genau darin](/blog/commonmark-gfm-and-the-flavours), und das ist als Erstes zu prüfen, nicht als Letztes.

## Wie Sie einen Weg wählen

1. **Beginnen Sie damit, ob die Zeilen Ihre Maschine verlassen dürfen.** Öffentliche Daten machen das zu keiner Frage. Namen, Gehälter, Patientenkennungen oder unveröffentlichte Zahlen machen es zur einzigen Frage, und sie schließt jeden hochladenden gehosteten Konverter aus. Browserseitige Konvertierung und lokale Kommandozeilenwerkzeuge sind die beiden Antworten, und der Unterschied zwischen ihnen steht in keiner Funktionsliste.
2. **Zählen Sie, wie oft Sie das tun werden.** Einmal ist ein Dateiabwurf und ein Einfügen. Jede Woche ist ein Skript, und ein Skript heißt ein Kommandozeilenwerkzeug oder ein Bibliotheksaufruf — denn der Teil eines wöchentlichen Prozesses, der vergessen wird, ist immer die Person, die eigentlich einen Browser-Tab öffnen sollte.
3. **Prüfen Sie, ob Sie neben dem Konvertieren auch umformen müssen.** Wenn die Antwort Spalten auswählen, Zeilen filtern oder sortieren einschließt, nehmen Sie ein Werkzeug, das Datenarbeit erledigt und am Ende Markdown ausgibt. Zeilen von Hand aus einer fertigen Markdown-Tabelle zu löschen ist der langsamste mögliche Weg und der, der Abschreibfehler einführt.
4. **Testen Sie mit Ihrer schlimmsten Zeile, nicht mit einer Stichprobe.** Nehmen Sie die Zeile mit dem zitierten Komma, dem Anführungszeichen und der Pipe darin, konvertieren Sie sie, und lesen Sie die Ausgabe gegen die Quelle. Ein Werkzeug, das diese Zeile übersteht, übersteht die Datei; ein Werkzeug, das daran scheitert, scheitert lautlos, und alles andere daran ist unerheblich.
5. **Entscheiden Sie sich vor dem Konvertieren über Zeilenumbrüche in Zellen, nicht danach.** Wird die Ausgabe als HTML dargestellt, ist `<br>` richtig. Wird sie als reiner Text gelesen, ist ein Leerzeichen richtig. Das Werkzeug hat sich bereits für Sie entschieden, finden Sie also heraus, wofür, und wählen Sie ein Werkzeug, das dem zustimmt, denn es hinterher zu korrigieren heißt, jede betroffene Zelle zu bearbeiten.
6. **Schauen Sie sich die Datei auf eine Kopfzeile hin an, bevor das Werkzeug entscheidet.** Zehn Sekunden in einem Texteditor, eine Zeile getippt, falls sie fehlt. Das ist der einzige Punkt auf dieser Liste, der kostenlos ist.

## Fazit

Die Konvertierung selbst ist eine Kopfzeile, eine Reihe Bindestriche und eine Zeile pro Datensatz, und Sie könnten es von Hand tun. Liegen die Zeilen noch in einer Tabellenkalkulation statt in einer Datei, [beginnen Sie stattdessen dort](/blog/convert-excel-to-markdown-table). Was Sie von Hand nicht können — verlässlich, bei jedem Umfang — ist, die Zitierregeln zu ehren, und genau daher kommt jeder lautlose Fehler. Alles, was die Datei als CSV liest statt als Text mit Kommas darin, bekommt die Kommas, die verdoppelten Anführungszeichen und die mehrzeiligen Datensätze richtig; dann muss es nur noch die Pipes maskieren und entscheiden, was mit Zeilenumbrüchen in Zellen zu tun ist. Wenn Sie das im Browser erledigt haben wollen, ohne dass etwas hochgeladen wird, macht [TransformPipes CSV-zu-Markdown-Tabellen-Konvertierung](/csv-to-markdown) den RFC-4180-Parse, maskiert Pipes, verwandelt Zeilenumbrüche in Zellen in `<br>` und behandelt das BOM, kostenlos und ohne Installation. Wenn Sie es in einem Skript wollen, nehmen Sie ein Werkzeug, das für tabellarische Daten gebaut ist. So oder so: Behalten Sie eine vierzeilige Testdatei mit einem zitierten Komma, einem verdoppelten Anführungszeichen, einem eingebetteten Zeilenumbruch und einer Pipe darin, und lassen Sie alles Neue erst durch die laufen, bevor Sie es mit echten Zeilen betrauen.

## FAQ

### Wie konvertiere ich eine CSV in eine Markdown-Tabelle?

Schreiben Sie die Spaltennamen als pipe-getrennte Kopfzeile, fügen Sie eine Trennzeile aus `| --- |`-Zellen mit einer Zelle pro Spalte hinzu, und schreiben Sie dann eine Zeile pro Datensatz mit den Werten, pipe-getrennt. Tun Sie das mit einem Werkzeug, das CSV richtig parst statt auf Kommas zu teilen, und maskieren Sie Pipes in den Werten als `\|`.

### Warum hat sich meine CSV in eine einzige Spalte konvertiert?

Weil die Datei nicht kommagetrennt ist. Tabellenkalkulations-Exporte in Regionen, die das Komma als Dezimaltrenner verwenden, sind häufig semikolongetrennt und tragen trotzdem den Namen `.csv`, und TSV-Dateien sind tabulatorgetrennt. Öffnen Sie die erste Zeile in einem Texteditor, sehen Sie, was die Überschriften trennt, und teilen Sie es dem Konverter mit.

### Kann eine Markdown-Tabellenzelle einen Zeilenumbruch enthalten?

Nein. Das Format ist eine Zeile pro Datensatz ohne Fortsetzungssyntax, ein echter Zeilenumbruch beendet die Zeile also. Ein CSV-Feld mit einem Zeilenumbruch muss zu `<br>` werden, was einen Umbruch darstellt, sobald das Markdown zu HTML wird, oder zu einem Leerzeichen abgeflacht werden. Der Konverter wählt eines davon, finden Sie also heraus, welches.

### Was passiert mit einem Komma innerhalb eines zitierten Feldes?

Mit einem echten Parser: nichts — die Anführungszeichen werden als Syntax verbraucht, und das Komma bleibt in der Zelle. Mit einem Komma-Split wird das Feld zu zwei Zellen, die Zeile wächst breiter als die Kopfzeile, und weil Markdown Zellen jenseits der Kopfzeilenanzahl verwirft, verschwindet der Wert am Ende dieser Zeile ohne jede Warnung.

### Wie setze ich ein Pipe-Zeichen in eine Markdown-Tabellenzelle?

Maskieren Sie es als `\|`. Das ist der einzige Mechanismus, und er gilt auch innerhalb von Inline-Code-Spannen — Backticks schützen eine Pipe nicht, weil die Zeile in Zellen zerlegt wird, bevor Inline-Syntax geparst wird. Ein Konverter, der Pipes nicht maskiert, fügt jeder Zeile mit einer Pipe darin eine Phantomspalte hinzu.

### Meine CSV hat keine Kopfzeile. Was jetzt?

Fügen Sie vor dem Konvertieren eine hinzu. Eine Markdown-Tabelle kann ohne Kopfzeile nicht existieren, ein Konverter wird also entweder Ihre erste Datenzeile befördern — und sie damit verlieren — oder Platzhalternamen wie `a, b, c` erfinden. Sie wissen, was die Spalten enthalten; eine Zeile zu tippen ist die einzige Version davon, die eine Tabelle erzeugt, die später jemand lesen kann.

### Warum steht ein seltsames Zeichen vor meiner ersten Spaltenüberschrift?

Ein Byte Order Mark, geschrieben am Dateianfang von Excels „CSV UTF-8"-Export und von manch anderem Windows-Werkzeug. Es ist in Editoren unsichtbar und hängt sich an die erste Überschrift, Vergleiche mit dieser Überschrift schlagen also ohne sichtbaren Grund fehl. Lesen Sie die Datei mit einer Kodierung, die es entfernt, etwa Pythons `utf-8-sig`, oder streichen Sie die ersten drei Bytes.

### Muss die Quelle einer Markdown-Tabelle die Pipes ausgerichtet haben?

Nein. Zellen aufzufüllen, damit die Pipes fluchten, ist rein für jeden, der das Markdown als Text liest; die dargestellte Ausgabe ist so oder so identisch. Auffüllen hilft der Lesbarkeit und schadet Diffs, denn das Bearbeiten eines Werts schreibt jede Zeile im Block neu, ungepolstert ist also meist besser für eine Tabelle, die in einem Repository lebt.
