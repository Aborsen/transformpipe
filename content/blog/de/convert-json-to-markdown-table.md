---
title: "JSON zu Markdown-Tabelle: Was sauber konvertiert und was nicht"
description: "JSON in eine Markdown-Tabelle verwandeln: die eine Form, die funktioniert, was mit Verschachtelung und JSON Lines zu tun ist, und wann Abschnitte besser sind."
date: 2026-09-02
tag: Konvertieren
keywords: json in markdown tabelle umwandeln, json array markdown tabelle, verschachteltes json tabelle, json lines markdown, jq json flach machen, json zu tabelle online, json tabelle konvertieren
---

### Kurzfassung

Eine Markdown-Tabelle ist ehrlich über genau eine JSON-Form: ein Array von Objekten, deren Werte alle skalar sind, mit denselben Schlüsseln in jedem Datensatz. Geben Sie ihr das, und jeder Konverter macht das Richtige. Geben Sie ihr irgendetwas anderes — ein verschachteltes Objekt, ein Array in einem Feld, Datensätze mit unterschiedlichen Schlüsseln —, und das Werkzeug muss wählen zwischen JSON in eine Zelle stringifizieren, die Spaltenzahl explodieren lassen oder Daten verwerfen, und es wird Ihnen nicht sagen, wofür es sich entschieden hat. Flachen Sie absichtlich ab, bevor Sie konvertieren, meist mit `jq` oder `mlr`, oder akzeptieren Sie, dass die ehrliche Darstellung Abschnitte sind statt einer Tabelle.

Sie haben eine JSON-Datei und wollen eine Tabelle. Der Instinkt ist richtig: Eine Tabelle ist die dichteste lesbare Form für Datensätze, und eine Markdown-Tabelle übersteht das Einfügen in einen Pull Request, ein Ticket, eine Wiki-Seite und eine E-Mail auf eine Art, die ein Codeblock aus JSON nicht kann. Jemand kann eine Tabelle überfliegen. Niemand überfliegt vierhundert Zeilen hübsch formatiertes JSON.

Das Problem ist, dass das Datenmodell von JSON und das Datenmodell einer Tabelle nicht dieselbe Form haben und sich nur manchmal überschneiden. Eine Tabelle ist ein Rechteck: feste Spalten, eine Zeile pro Datensatz, ein Wert pro Zelle. JSON ist ein Baum, beliebig tief, ohne die Anforderung, dass Geschwisterobjekte sich in irgendetwas einig sein müssen. Wann immer der Baum noch kein Rechteck ist, wirft die Umwandlung in eines etwas weg — und was weggeworfen wird, entscheidet Ihr Konverter still, in den zwei Sekunden zwischen dem Ablegen der Datei und dem Lesen der Ausgabe.

Die nützliche Frage ist also nicht „welches Werkzeug konvertiert JSON in eine Markdown-Tabelle“. Fast alle tun das, und [der Vergleich zwischen ihnen ist ein eigener Text](/blog/best-json-to-markdown-converters). Die nützliche Frage ist, welche Form Ihre Datei hat, was eine Tabelle mit dieser Form macht, und was Sie zuerst mit der Datei tun sollten. Das folgt jetzt, Fall für Fall, mit den Befehlen.

## Warum eine Markdown-Tabelle ein Versprechen über die Daten ist

Wenn Sie jemandem eine Tabelle geben, behaupten Sie drei Dinge, ohne sie auszusprechen. Jede Zeile ist dieselbe Art von Ding. Jede Spalte bedeutet in jeder Zeile dasselbe. Und jede Zelle enthält einen Wert.

JSON garantiert keins von den dreien. Ein Array kann eine Zeichenkette, ein Objekt und ein weiteres Array nebeneinander enthalten. Zwei Objekte im selben Array können überhaupt keine Schlüssel teilen. Ein einzelnes Feld kann ein Objekt mit zwölf Schlüsseln darunter enthalten. Wenn irgendetwas davon zutrifft und Sie trotzdem eine Tabelle rendern, ist die Tabelle immer noch eine Tabelle — sie fluchtet, sie hat eine Kopfzeile, sie sieht fertig aus — und sie behauptet jetzt Dinge, die die Daten nicht stützen. Das ist schlimmer als eine offensichtlich kaputte Ausgabe, weil niemand eine Tabelle prüft, die rendert.

Hier ist die Form des Fehlschlags an einem Beispiel. Nehmen Sie einen Datensatz wie diesen:

```json
{
  "id": 4102,
  "customer": { "name": "Ada Okonjo", "email": "ada@example.com" },
  "items": ["SKU-11", "SKU-40"],
  "discount": null,
  "note": "call before delivery | after 4pm"
}
```

Jede naive Tabellierung dieses Datensatzes ist auf eine andere Art falsch. Setzen Sie `customer` in eine Zelle, und die Zelle enthält `{"name":"Ada Okonjo","email":"ada@example.com"}`, was JSON ist, das sich als Prosa ausgibt. Flachen Sie es ab, und Sie gewinnen zwei Spalten, `customer.name` und `customer.email`, was korrekt ist und die Spaltenzahl steigen lässt. Setzen Sie `items` in eine Zelle, und Sie haben eine Liste mit Kommas verbunden, was in Ordnung ist, bis ein Element ein Komma enthält. Lassen Sie `discount` leer, und die Leserin kann nicht unterscheiden „kein Rabatt“ von „Feld fehlt“. Und `note` enthält eine Pipe, die in einer Markdown-Tabelle die Zelle beendet — diese Zeile hat also jetzt eine Spalte mehr als die Kopfzeile, und der Renderer wird den Überschuss entweder verwerfen oder alles danach verschieben.

Ein Datensatz. Fünf verschiedene Arten, wie eine Tabelle still unwahr sein kann. Multiplizieren Sie das mit der Anzahl der Datensätze, und Sie haben ein Dokument, das autoritativ aussieht und es nicht ist.

## Schnellreferenz: welche JSON-Form zu welchem Markdown wird

Das ist die Übersicht. Finden Sie die oberste Form Ihrer Datei in der ersten Spalte und die Darstellung, die nicht lügt, in der vierten.

| JSON-Form | Sieht aus wie | Tabelliert sauber? | Ehrliche Darstellung | Zuerst das tun |
| --- | --- | --- | --- | --- |
| Array flacher Objekte, gleiche Schlüssel | `[{"id":1,"name":"a"},{"id":2,"name":"b"}]` | Ja | Tabelle: Schlüssel als Spalten, eine Zeile pro Objekt | Nichts |
| Array flacher Objekte, unterschiedliche Schlüssel | `[{"id":1},{"id":2,"tier":"pro"}]` | Ja, mit Lücken | Tabelle mit Vereinigung aller Schlüssel, Leerstellen markiert | Schlüssel über jeden Datensatz sammeln, nicht nur den ersten |
| Array von Objekten mit verschachteltem Objekt | `[{"id":1,"user":{"name":"a"}}]` | Nein | Tabelle über abgeflachte `user.name`-Spalten | Mit `jq`, `mlr flatten` oder `json_normalize` abflachen |
| Array von Objekten mit Array-Feld | `[{"id":1,"tags":["x","y"]}]` | Nein | Tabelle plus zusammengefügte Zelle, oder eine Zeile pro Tag | Entscheiden: in eine Zelle zusammenfügen, oder in Zeilen aufsprengen |
| Array reiner Werte | `["admin","billing"]` | Nein | Aufzählungsliste | Nichts — nicht in eine Tabelle packen |
| Array von Arrays | `[["a",1],["b",2]]` | Ja, ohne Kopfzeile | Tabelle mit erfundenen oder Kopfzeilen aus Zeile eins | Entscheiden, ob Zeile eins Daten oder eine Kopfzeile ist |
| Array unähnlicher Dinge | `[1,"two",{"three":3}]` | Nein | Ein nummerierter Abschnitt pro Element | Nach Typ splitten, oder als Abschnitte rendern |
| Einzelnes flaches Objekt | `{"name":"a","tier":"pro"}` | Nur als Schlüssel/Wert | Zweispaltige Tabelle, oder fette Labels | Nichts, aber eine Definitionsliste erwägen |
| Einzelnes tief verschachteltes Objekt | eine Konfigurationsdatei, ein API-Umschlag | Nein | Überschriften pro Ebene, Codeblock ab Tiefe drei | Das Array darin finden und das tabellieren |
| Objekt von Objekten, mit Id als Schlüssel | `{"u1":{...},"u2":{...}}` | Ja, nach einem Schritt | Tabelle mit dem Schlüssel als eigener erster Spalte | `to_entries`, um Schlüssel in ein Feld zu verwandeln |
| JSON Lines | ein JSON-Wert pro Zeile | Ja, wenn zeilenweise gelesen | Tabelle, sobald die Datei richtig gelesen wird | Dem Werkzeug sagen, dass es zeilengetrennt ist |
| Zahl, Zeichenkette, Boolean auf oberster Ebene | `42` | Nein | Ein Satz | Nichts zu konvertieren |

Zwei Dinge fallen auf. Nur drei Zeilen in dieser Tabelle sagen uneingeschränkt „ja“, und die zwei häufigsten realen Formen — verschachtelte Objekte und Array-Felder — gehören nicht dazu. Und die letzte Spalte ist, wo die Arbeit liegt: Der Unterschied zwischen einer guten und einer schlechten Markdown-Tabelle ist fast immer etwas, das Sie vor der Konvertierung mit dem JSON getan haben, nicht der Konverter, den Sie gewählt haben.

## Die Form, über die eine Tabelle ehrlich ist

Ein Array von Objekten, jeder Wert skalar, dieselben Schlüssel in jedem Datensatz. Das ist die Form, die ein paginierter API-Endpunkt zurückgibt, die Form, zu der eine CSV wird, wenn jemand sie in JSON umwandelt, und die Form, die ein `SELECT` ohne Joins erzeugt.

```json
[
  { "sku": "SKU-11", "name": "Wide flange", "price": 12.5, "stock": 40 },
  { "sku": "SKU-40", "name": "Narrow flange", "price": 9.0, "stock": 0 },
  { "sku": "SKU-72", "name": "Bracket", "price": 3.25, "stock": 118 }
]
```

Das wird zu Folgendem, und jedes Werkzeug ist sich einig:

```markdown
| sku | name | price | stock |
| --- | --- | --- | --- |
| SKU-11 | Wide flange | 12.5 | 40 |
| SKU-40 | Narrow flange | 9 | 0 |
| SKU-72 | Bracket | 3.25 | 118 |
```

Beachten Sie: `9.0` kam als `9` heraus. JSON-Zahlen kennen keine signifikanten Stellen, sodass ein Serialisierer, der die Datei in einen Zahlentyp einliest und wieder herausschreibt, Ihnen die kürzeste Darstellung gibt. Wenn das Preise in einem Dokument sind, das jemand liest, ist das ein kosmetisches Ärgernis; wenn es eine Versionszeichenkette oder ein Produktcode ist, der zufällig numerisch war, ist die führende oder abschließende Null für immer weg. Ein Feld, das seine exakte gedruckte Form behalten muss, muss im JSON eine Zeichenkette sein, und der Konverter kann im Nachhinein nichts dagegen tun.

Hier sind die Wege für diese Konvertierung, mit dem genauen Befehl:

| Weg | Befehl oder Schritt | Braucht |
| --- | --- | --- |
| Browser | Die `.json`-Datei auf eine Konverter-Seite ziehen und die Tabelle lesen | Einen Browser |
| Miller | `mlr --ijson --omd cat data.json` | `mlr` installiert |
| jtbl | `cat data.json \| jtbl -m` | Python, `pip install jtbl` |
| pandas | `pd.read_json("data.json").to_markdown(index=False)` | pandas und tabulate |
| jq, von Hand | Kopfzeile und Zeilen selbst mit `@tsv` und `sed` bauen | `jq` und Geduld |
| Tabellenkalkulation | JSON zu CSV, öffnen, kopieren, in einen Markdown-fähigen Editor einfügen | Eine Tabellenkalkulation |

**Für wen das ist:** Für alle mit einem Export aus einem Admin-Panel, einem Listen-Endpunkt oder einem Abfrageergebnis. Wenn Ihre Datei diese Form hat, hören Sie auf, den Rest dieser Seite zu lesen, und wählen Sie die Zeile oben mit den wenigsten Installationen. Es gibt keine interessante Entscheidung zu treffen.

**Was Sie trotzdem prüfen sollten:** die letzten drei Zeilen, nicht die ersten drei. Paginierung bedeutet, die interessanten Datensätze stehen oft am Ende, und ein Konverter, der das erste Objekt für seine Kopfzeile liest, hat jedes Feld fallen gelassen, das erst später auftaucht.

## Die unbequemen Formen, Fall für Fall

Alles Folgende ist eine Form, bei der die Tabelle etwas aufgeben muss. Für jede gibt es eine vertretbare Darstellung, eine unvertretbare, und einen Befehl, der Sie von der einen zur anderen bringt.

### Ein verschachteltes Objekt in einem Feld

```json
[
  { "id": 1, "user": { "name": "Ada", "city": "Leeds" }, "total": 42.0 },
  { "id": 2, "user": { "name": "Ben", "city": "Hull" }, "total": 18.5 }
]
```

Es gibt genau drei Dinge, die ein Konverter mit `user` tun kann, und es lohnt sich zu wissen, welches Ihrer es tut.

| Ansatz | Ergebnis | Kosten |
| --- | --- | --- |
| Das Objekt in die Zelle stringifizieren | `{"name":"Ada","city":"Leeds"}` in einer Zelle | Unlesbar, und ein `"` oder ein `\|` darin bricht die Zeile |
| Zu gepunkteten Spalten abflachen | `user.name`, `user.city` | Spaltenzahl wächst mit jedem verschachtelten Schlüssel |
| Das Feld fallen lassen | Tabelle nur mit `id` und `total` | Stiller Datenverlust, keine Warnung |

Abflachen ist der richtige Standard, und der Grund ist Arithmetik. Ein Datensatz mit drei verschachtelten Objekten zu je vier Schlüsseln wird zu einer Tabelle mit fünfzehn Spalten, die auf einem breiten Bildschirm noch lesbar ist und in einem Pull-Request-Kommentar unlesbar. Also abflachen, dann auswählen: entscheiden, welche der abgeflachten Spalten Sie wirklich wollen, und den Rest absichtlich fallen lassen, statt es das Werkzeug versehentlich tun zu lassen.

```bash
mlr --ijson --omd flatten data.json
```

Millers `flatten`-Verb macht aus `user.name` ein Feld dieses Namens, und `--omd` schreibt eine Markdown-Tabelle. Um danach Spalten auszuwählen, fügen Sie ein `cut` an:

```bash
mlr --ijson --omd flatten then cut -o -f id,user.name,total data.json
```

**Für wen das ist:** API-Antworten, die fast immer die interessanten Felder in einen Umschlag packen oder einen verwandten Datensatz anhängen. Das ist die häufigste reale Form, und die, bei der der Standardwert eines Konverters am meisten zählt.

### Ein Array in einem Feld

```json
[
  { "id": 1, "tags": ["urgent", "billing"] },
  { "id": 2, "tags": [] }
]
```

Ein Array in einem Feld ist eine Eins-zu-viele-Beziehung, und eine Tabelle ist ein Rechteck. Etwas muss nachgeben.

| Ansatz | Ergebnis | Kosten |
| --- | --- | --- |
| In eine Zelle zusammenfügen | `urgent, billing` | Ein Wert, der das Trennzeichen enthält, wird mehrdeutig |
| Eine Spalte pro Position | `tags.0`, `tags.1`, `tags.2` | Spaltenzahl vom längsten Array bestimmt; meist leer |
| Eine Zeile pro Element | `id` wiederholt, ein `tag` je Zeile | Zeilenzahl multipliziert sich; `id` ist nicht mehr eindeutig |
| Nur zählen | `tags` wird zu `2` | Verliert die Werte, behält die Form |

Zusammenfügen ist, was die meisten Konverter tun, und es ist meist beim Lesen korrekt, sofern das Trennzeichen eines ist, das Ihre Werte nicht enthalten können. `; ` ist sicherer als `, `. Das Aufsprengen in eine Zeile pro Element ist richtig, wenn die Tabelle sortiert oder nach Tag gefiltert werden soll, und es ist das, was Sie wollen, wenn der nächste Schritt eine Tabellenkalkulation statt eines Dokuments ist. Positionsspalten sind fast nie richtig: Sie machen die Position eines Elements zu einer Spaltenüberschrift, und Position in einem JSON-Array trägt keine Bedeutung, außer jemand hätte das versprochen.

Zum Zusammenfügen, in jq:

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json
```

Zum Aufsprengen, eine Zeile pro Tag:

```bash
jq '[.[] | . as $row | .tags[] | { id: $row.id, tag: . }]' data.json
```

Dieser zweite Filter verliert den Datensatz mit leerem Array vollständig, weil `.tags[]` auf `[]` nichts erzeugt. Wenn ein Datensatz ohne Tags trotzdem eine Zeile braucht, behalten Sie ihn explizit:

```bash
jq '[.[] | . as $row | (if (.tags | length) == 0 then [null] else .tags end)[] | { id: $row.id, tag: . }]' data.json
```

Das ist die Form der meisten Abflach-Arbeit: drei Zeilen jq, um einen Fall zu bewahren, den der Einzeiler fallen lässt.

**Für wen das ist:** alles mit Labels, Rollen, Berechtigungen, Kategorien oder Positionen. Wenn Sie einen Bestellungsexport konvertieren, sind die Positionen ein Array in einem Feld, und Sie haben diese Entscheidung zu treffen, ob Sie es bemerken oder nicht.

### Datensätze mit unterschiedlichen Schlüsseln

```json
[
  { "id": 1, "email": "a@example.com" },
  { "id": 2, "phone": "+44 20 7000 0000" },
  { "id": 3, "email": "c@example.com", "phone": "+44 20 7000 0001" }
]
```

Eine Tabelle braucht eine Kopfzeile. Diese Datensätze haben drei verschiedene Schlüsselmengen untereinander, also muss die Kopfzeile die Vereinigung sein — `id`, `email`, `phone` — mit Leerstellen, wo ein Datensatz ein Feld nicht trägt.

Der Fehlschlag hier ist spezifisch und häufig: ein Konverter, der seine Kopfzeile nur aus dem ersten Objekt baut. Das ergibt eine zweispaltige Tabelle, und die Telefonnummer von Datensatz 2 steht überhaupt nicht im Dokument. Kein Fehler, keine Warnung, keine Lücke in der Tabelle, die auffiele. Das ist der schädlichste Standardwert in diesem ganzen Bereich, weil die Ausgabe vollständig aussieht.

Prüfen Sie es mit einem Befehl. Fragen Sie jq nach der Vereinigung der Schlüssel und zählen Sie die Spalten in Ihrer Ausgabe:

```bash
jq -r '[.[] | keys[]] | unique | join(",")' data.json
```

Wenn diese Liste länger ist als die Kopfzeile Ihrer Tabelle, hat Ihr Konverter den ersten Datensatz gelesen und aufgehört. Wechseln Sie entweder das Werkzeug, oder erzwingen Sie die Form selbst, indem Sie jedem Datensatz jeden Schlüssel geben:

```bash
jq --argjson cols '["id","email","phone"]' \
   '[.[] | . as $r | reduce $cols[] as $c ({}; .[$c] = ($r[$c] // null))]' data.json
```

Beachten Sie: `//` in diesem Filter ist jqs Alternativ-Operator, kein Kommentar: Er setzt die rechte Seite ein, wenn die linke `null` oder `false` ist. Das ist selbst eine Gefahr — ein Feld, dessen echter Wert `false` ist, wird durch `null` ersetzt. Wenn Ihre Daten Booleans haben, nutzen Sie stattdessen eine explizite `has`-Prüfung.

| Ansatz | Ergebnis | Kosten |
| --- | --- | --- |
| Vereinigung aller Schlüssel | Jedes Feld vorhanden, Leerstellen wo abwesend | Breite Tabelle, dünn besetzt |
| Schlüssel aus dem ersten Datensatz | Schmal, ordentlich, fehlende Spalten | Stiller Verlust jedes späteren Feldes |
| Schlüssel in jedem Datensatz vorhanden | Nur die gemeinsamen Felder | Verliert die Unterschiede, die oft der Punkt sind |
| Nach Schlüsselmenge gruppieren, je eine Tabelle | Mehrere ehrliche Tabellen | Die Leserin muss sie selbst zusammenführen |

**Für wen das ist:** Exporte aus allem mit optionalen Feldern — einem CRM, einem Formularprodukt, einem Ereignisstrom, dessen Payload je nach Ereignistyp variiert. Wenn die Datensätze aus verschiedenen Codepfaden kommen, nehmen Sie an, dass die Schlüsselmengen sich unterscheiden, bis Sie es geprüft haben.

### Ein Array reiner Werte

```json
["admin", "billing", "read-only"]
```

Das ist eine Liste. Als Tabelle gerendert wird sie zu einer einzelnen Spalte mit einer erfundenen Kopfzeile, was mehr Markup als Inhalt ist und weniger lesbar als das JSON war. Als Aufzählungsliste gerendert ist sie fertig:

```markdown
- admin
- billing
- read-only
```

Der einzige Fall für eine Tabelle ist, wenn die Werte Paare von etwas sind, und dann sind es keine reinen Werte mehr. Wenn die Liste lang und geordnet ist, trägt eine nummerierte Liste die Reihenfolge, die eine Aufzählungsliste wegwirft — [der Unterschied zwischen einer geordneten und einer ungeordneten Liste ist auch eine Behauptung über die Daten](/blog/markdown-line-breaks-and-lists).

**Für wen das ist:** Aufzählungen, Berechtigungsmengen, Freigabelisten. Fast nie einen Konverter wert: ein Suchen-und-Ersetzen macht daraus eine Liste, schneller als ein Werkzeug zu öffnen.

### Ein Array von Arrays

```json
[
  ["sku", "name", "price"],
  ["SKU-11", "Wide flange", 12.5],
  ["SKU-40", "Narrow flange", 9.0]
]
```

Das ist eine CSV, die durch einen JSON-Serialisierer gelaufen ist, und sie tabelliert perfekt — mit einer Mehrdeutigkeit, die nichts in der Datei auflöst. Ist die erste Zeile eine Kopfzeile, oder sind es Daten, die zufällig so aussehen? JSON hat keine Möglichkeit, das zu sagen. Ein Konverter muss raten, und die beiden Vermutungen erzeugen unterschiedliche Dokumente: eines mit `sku | name | price` als Kopfzeile, eines mit `Column 1 | Column 2 | Column 3` als Kopfzeile und `sku` als Wert in der ersten Zeile.

Sehen Sie sich die Datei an und entscheiden Sie, dann sagen Sie es dem Werkzeug. Wenn es sich nicht sagen lässt, fügen Sie die Kopfzeile selbst hinzu. Weil diese Form eigentlich tabellarische Daten in JSON-Verkleidung ist, ist der [CSV-Weg oft kürzer](/blog/best-csv-to-markdown-converters): Das Array von Arrays zu CSV konvertieren und ein CSV-zu-Markdown-Werkzeug mit einer expliziten Kopfzeilen-Option nutzen.

**Für wen das ist:** BigQuery und ähnliche Abfrageergebnisse, Tabellenkalkulations-Exporte über eine JSON-API, alles, wo ein `values`-Feld Zeilen enthält.

### Ein Array unähnlicher Dinge

```json
[42, "pending", { "id": 7 }, [1, 2]]
```

Ein heterogenes Array ist keine Menge von Datensätzen, und keine Tabelle beschreibt es. Die ehrliche Darstellung ist ein nummerierter Abschnitt pro Element, jedes nach seinem eigenen Typ gerendert — eine Zahl als Satz, ein Objekt als kleine Schlüssel/Wert-Tabelle, ein verschachteltes Array als Liste.

Wenn eine Datei Ihnen das auf oberster Ebene gibt, ist es meist ein gemischtes Log oder eine handzusammengestellte Testdatei, und der richtige erste Schritt ist, nach dem Typ zu filtern, der Sie interessiert:

```bash
jq '[.[] | select(type == "object")]' data.json
```

Jetzt haben Sie ein Array von Objekten, und einer der früheren Fälle greift.

**Für wen das ist:** fast niemanden mit Absicht. Es passiert in Testdaten, in handbearbeiteten Dateien und in Ereignisströmen, deren Produzent zwischen Releases die Form geändert hat.

### Ein einzelnes Objekt, das gar keine Liste ist

Eine Konfigurationsdatei, ein API-Umschlag, ein per Id abgerufener Datensatz. Es gibt kein Array, aus dem Zeilen entstehen könnten, also kann eine Tabelle nur eine zweispaltige Schlüssel/Wert-Auflistung sein:

```markdown
| Field | Value |
| --- | --- |
| name | Wide flange |
| price | 12.5 |
```

Das ist für eine Handvoll skalarer Felder lesbar und ab etwa einem Dutzend sinnlos, und es bricht vollständig zusammen, sobald ein Wert verschachtelt ist. Für einen einzelnen Datensatz lesen sich fett gedruckte Labels mit den Werten daneben besser als Tabellenmöbel, und Verschachtelung wird zu Überschriften. Wenn das Objekt ein Umschlag ist — `{"meta": {...}, "data": [...]}` —, ist die Tabelle, die Sie eigentlich wollen, über `.data`, und der erste Schritt ist, das zu sagen:

```bash
jq '.data' response.json
```

**Für wen das ist:** alle, die eine einzelne Sache statt einer Liste abgerufen haben. Prüfen Sie auf ein inneres Array, bevor Sie eine Schlüssel/Wert-Tabelle akzeptieren; neunmal von zehn ist die interessante Form eine Ebene tiefer.

## Zuerst abflachen: jq, und Dateien, die kein einzelner JSON-Wert sind

Zwei Probleme stehen vor allem oben Genannten. Die Datei ist vielleicht kein einzelner JSON-Wert, und die Form ist vielleicht noch kein Rechteck. Beide werden behoben, bevor irgendein Konverter die Daten sieht, und beide werden mit derselben Handvoll Befehle behoben.

**Die Datei ist JSON Lines.** Ein JSON-Wert pro Zeile, durch Zeilenumbruch getrennt, kein umschließendes Array. Jede Zeile ist gültig; die Datei ist es nicht, weil eine bloße Folge von Werten kein JSON-Dokument ist. `JSON.parse` und `json.loads` scheitern beide bei Zeile 2, und die Fehlermeldung sagt „unerwartetes Token“ statt „das ist JSON Lines“, sodass Leute schließen, die Datei sei beschädigt. Ist sie nicht. Es ist die normale Ausgabe einer Log-Pipeline, `docker logs`, eines Message-Queue-Konsumenten und der meisten Bulk-Export-Endpunkte.

Die Lösung ist ein einziges Flag, und es ist in jedem Werkzeug ein anderes:

| Werkzeug | JSON Lines lesen | JSON Lines schreiben |
| --- | --- | --- |
| jq | Standard: liest einen Strom von Werten | `jq -c` — kompakt, ein Wert pro Zeile |
| jq, als Array | `jq -s` oder `jq --slurp` | `jq -c '.[]'` |
| Miller | `mlr --ijsonl` | `mlr --ojsonl` |
| pandas | `pd.read_json(path, lines=True)` | `df.to_json(path, orient="records", lines=True)` |
| jtbl | liest zeilengetrennte Eingabe, wie sie kommt | nicht zutreffend |
| Python-Standardbibliothek | `json.loads` je Zeile in einer Schleife | `json.dumps` je Zeile |

Der kanonische erste Schritt bei einer `.jsonl`-Datei ist also, sie zu einem Array zu machen:

```bash
jq -s '.' events.jsonl > events.json
```

und der kanonische letzte Schritt, wenn das nächste Werkzeug Zeilen will, ist, das Array wieder auseinanderzunehmen mit `jq -c '.[]'`. Wissenswert: `jq -s` liest die ganze Datei in den Speicher. Bei einem mehrere Gigabyte großen Log ist das das falsche Werkzeug, und Miller streamt stattdessen — obwohl eine Tabelle mit einer Million Zeilen kein Dokument ist, das irgendjemand liest, sodass die eigentliche Antwort für eine Datei dieser Größe ist, zuerst zu filtern.

**Die Form muss abgeflacht werden.** jqs `flatten`-Funktion flacht verschachtelte *Arrays* ab, nicht Objekte, was überrascht, wer sie nach dem Namen greift. Objekte in gepunktete Schlüssel abzuflachen geschieht über Pfade:

```bash
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]' data.json
```

Das liest sich als: für jeden Datensatz jeden Pfad finden, der in einem Skalar endet, den Pfad in eine gepunktete Zeichenkette verwandeln, ihn mit dem Wert an diesem Pfad paaren und den Datensatz aus diesen Paaren neu aufbauen. `leaf_paths` ist `paths(scalars)`; `getpath` holt einen Wert per Pfad; `from_entries` verwandelt Schlüssel/Wert-Paare zurück in ein Objekt. Die Ausgabe ist ein Array flacher Objekte, was die eine Form ist, die ehrlich tabelliert, und Sie können sie jedem Konverter aus der Übersichtstabelle geben.

Zwei Vorbehalte zu diesem Filter. Array-Indizes werden Teil des Schlüssels, sodass `tags` mit zwei Elementen `tags.0` und `tags.1` erzeugt — das Positionsspalten-Problem von vorhin, das durch die Hintertür wiederkommt. Und ein leeres Objekt oder leeres Array hat überhaupt keine Blattpfade, sodass diese Felder aus dem abgeflachten Datensatz komplett verschwinden. Wenn beides zählt, behandeln Sie Arrays separat, bevor Sie abflachen:

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json | \
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]'
```

**Die Datensätze sind per Id verschlüsselt, statt aufgelistet zu sein.** Eine häufige Form ist ein Objekt, dessen Schlüssel Kennungen sind:

```json
{ "u1": { "name": "Ada" }, "u2": { "name": "Ben" } }
```

Hier gibt es kein Array, aber eines versteckt sich. `to_entries` erzeugt `[{"key":"u1","value":{...}}, ...]`, und ein weiterer Schritt befördert den Schlüssel zu einem Feld des Datensatzes:

```bash
jq '[to_entries[] | { id: .key } + .value]' users.json
```

Jetzt ist es ein Array flacher Objekte mit `id` als erster Spalte, und die Kennung, die als Schlüssel Doppeldienst geleistet hat, ist ein Wert wie jeder andere.

**In Python erledigt `json_normalize` das meiste davon in einem Aufruf.** `pd.json_normalize(records, sep=".")` flacht verschachtelte Objekte in gepunktete Spalten ab; `max_level` stoppt es bei einer Tiefe; `record_path` und `meta` handhaben den Aufspreng-Fall, nehmen ein verschachteltes Array als Zeilenquelle und führen die übergeordneten Felder mit. Dann schreibt `to_markdown(index=False)` die Tabelle, was das `tabulate`-Paket neben pandas installiert braucht. Beide sind frei und quelloffen, pandas unter BSD-3-Clause und tabulate unter MIT.

**Für wen dieser Abschnitt ist:** alle, die dieselbe Form mehr als einmal konvertieren. Ein jq-Filter in einem Shell-Skript ist ein Konvertierungsschritt, den Sie lesen, prüfen und reparieren können. Eine Klickfolge ist das nicht.

## Wo die Tabelle lügt, und was das kostet

Angenommen, die Form stimmt und das Abflachen ist erledigt. Es gibt trotzdem eine Reihe von Arten, wie eine Markdown-Tabelle das JSON, aus dem sie stammt, falsch darstellt, und keine davon erzeugt einen Fehler.

**Eine Pipe in einem Wert spaltet die Zelle.** In GitHub Flavored Markdown grenzt `|` Zellen überall in einer Tabellenzeile ab, auch innerhalb dessen, was Sie als Text meinten. `call before 4pm | or leave with neighbour` wird zu zwei Zellen, die Zeile gewinnt eine Spalte, und der Renderer wirft den Überschuss weg oder verschiebt den Rest. Die Maskierung ist ein Backslash — `\|` — und es ist Aufgabe des Konverters, ihn anzuwenden. Testen Sie es: Setzen Sie eine Pipe in einen Wert, konvertieren Sie, und schauen Sie hin. Das ist ein Beispiel eines größeren Problems, das sich lohnt, vollständig zu verstehen, denn [Tabellen brechen auf dem Weg zwischen Formaten mehr als alles andere in Markdown](/blog/markdown-tables-that-survive-conversion).

**Ein Zeilenumbruch in einem Wert kann überhaupt nicht ausgedrückt werden.** Eine Markdown-Tabellenzeile ist eine Zeile. Eine JSON-Zeichenkette kann `\n` enthalten, und tut es oft — ein Beschreibungsfeld, eine Log-Nachricht, eine Adresse. Es gibt kein Markdown für einen Zeilenumbruch innerhalb einer Zelle; der einzige Weg ist ein wörtliches `<br>`, was rohes HTML innerhalb Ihres Markdowns ist und von jedem Renderer entfernt wird, der bereinigt. Konverter geben verschieden `<br>` aus, ersetzen den Zeilenumbruch durch ein Leerzeichen, oder geben den rohen Zeilenumbruch aus und brechen die Tabelle. Alle drei sind vertretbar, und nur eine davon ist das, was Sie wollen, also finden Sie heraus, welche Ihres macht.

**Leere Zellen vermengen vier verschiedene Tatsachen.** `null`, eine leere Zeichenkette, ein fehlender Schlüssel und `false` werden in den meisten Konvertern alle zu einer leeren Zelle. In einer Bestelltabelle sind „kein Rabatt“ und „das Rabattfeld ist in diesem Datensatz nicht vorhanden“ unterschiedliche Behauptungen, und eine Leserin kann aus einer Leerstelle nicht erschließen, welche davon gilt. Ein kursives *null* für null zu schreiben, einen Gedankenstrich für abwesend, und leere Zeichenketten wirklich leer zu lassen, kostet drei Zeilen in einem Konverter und erspart der Leserin das Raten. Prüfen Sie, was Ihres bei einem selbst konstruierten Datensatz tut.

**Lange Werte zerstören das Layout, ohne es zu brechen.** Ein Base64-Blob, ein Stacktrace, eine UUID-je-Zeile-Spalte: Eine Markdown-Tabelle hat keine Spaltenbreiten, also macht ein langer Wert seine Spalte so breit wie sich selbst und quetscht jede andere Spalte in einen Streifen. Die Tabelle ist gültig und unlesbar. Die Lösung liegt nicht im Konverter — sie ist, die Spalte fallen zu lassen, oder sie absichtlich mit einer Markierung zu kürzen, bevor konvertiert wird. `jq 'map(.token |= .[0:12] + "…")'` ist hässlicher als die Alternative, so zu tun, als sei das Problem nur ein Präsentationsproblem.

**Typen sind weg, und das Dokument sagt es nicht.** Markdown hat keine Typen. Einmal konvertiert, sind `"12.50"` und `12.5` beide der Text `12.5`, `true` ist das Wort true, und `2026-09-02T00:00:00Z` ist eine Zeichenkette, die für einen Menschen wie ein Datum aussieht und für eine Maschine wie nichts Bestimmtes. Das ist für ein Dokument in Ordnung und disqualifizierend für alles Nachgelagerte. Wenn der Empfänger mit den Zahlen rechnen wird, schicken Sie das JSON oder eine CSV und lassen Sie ihn parsen; die Markdown-Tabelle ist zum Lesen.

**Die Zeilenreihenfolge ist, was auch immer die Datei hatte.** JSON-Arrays sind geordnet, und die Reihenfolge ist bedeutsam, also muss ein Konverter sie bewahren — aber nichts sortiert sie für Sie, und eine Tabelle, die niemand sortiert hat, ist eine Tabelle in Einfügereihenfolge, was selten die Reihenfolge ist, die eine Leserin will. Sortieren Sie vor der Konvertierung: `jq 'sort_by(.total) | reverse'` kostet nichts und macht die Tabelle zur Antwort auf eine Frage.

**Die Spaltenreihenfolge ist ein Zufall.** JSON-Objekte haben in der Spezifikation keine definierte Schlüsselreihenfolge, obwohl jede praktische Implementierung die Reihenfolge bewahrt, in der sie gelesen wurde. Ihre Spalten kommen also in welcher Reihenfolge auch immer heraus, die der Serialisierer auf der anderen Seite zufällig ausgegeben hat, was heißt, dass die Kennung Spalte sechs sein könnte. Bringen Sie die Spalten mit einer expliziten Auswahl in die Reihenfolge, die eine Leserin braucht — `mlr cut -o -f id,name,total` behält die von Ihnen genannte Reihenfolge, und jqs Objektkonstruktion tut dasselbe.

Die Kosten von all dem, zusammengerechnet, sind nicht, dass die Tabelle falsch ist. Es ist, dass die Tabelle richtig aussieht. Ein JSON-Parse-Fehler stoppt Sie; eine durch eine unmaskierte Pipe verschobene Zeile wird ausgeliefert, gelesen, in einer Entscheidung zitiert, und sechs Wochen später gefunden.

## Wenn eine Tabelle die falsche Darstellung ist

Manchmal ist die ehrliche Antwort, dass die Daten nicht tabellarisch sind und keine Menge Abflachen das ändert. Drei Anzeichen, und was stattdessen zu tun ist.

**Die Spalten übertreffen die Zeilen zahlenmäßig.** Eine einzelne API-Antwort, abgeflacht zu sechzig gepunkteten Schlüsseln und einem Datensatz, ist keine Tabelle; sie ist ein Datensatz, und ein Datensatz liest sich besser als beschriftete Werte denn als sechzigspaltiges Rechteck, das niemand durchscrollen kann. Rendern Sie die skalaren Felder als fette Labels mit Werten daneben, und geben Sie jedem verschachtelten Abschnitt seine eigene Überschrift.

**Jede Zeile braucht einen Absatz.** Wenn ein Feld eine Beschreibung, ein Kommentartext, ein Diff oder eine Log-Nachricht ist, und die Leserin es tatsächlich lesen muss, ist eine Tabellenzelle der falsche Behälter. Die Darstellung, die funktioniert, ist ein Abschnitt pro Datensatz: eine Überschrift mit der Kennung, die kurzen Felder als kompakte Liste, und das lange Feld als eigener Absatz oder eingezäunter Block. Das ist um ein Vielfaches länger als eine Tabelle, und es ist die Version, die jemand lesen kann.

**Die Struktur ist die Information.** In einer Konfigurationsdatei, einem Berechtigungsbaum oder einem Abhängigkeitsgraphen ist die Verschachtelung das, was Sie vermitteln wollen. Sie zu gepunkteten Schlüsseln abzuflachen verwandelt die Struktur in Zeichenketten-Präfixe und bittet die Leserin, den Baum im Kopf wieder zusammenzusetzen. Überschriften für die Ebenen, eingerückte Listen für die Blätter, und ein eingezäunter `json`-Block für alles jenseits von etwa drei Ebenen — tief genug, um die Form zu sehen, flach genug, dass die Überschriften noch etwas bedeuten. Ein eingezäunter Block mit einem `json`-Info-String bekommt in den meisten Renderern auch Syntaxhervorhebung, was echte Arbeit für die Lesbarkeit leistet; [was ein Info-String ist und was Renderer damit tun](/blog/code-blocks-in-markdown) lohnt sich zu wissen, bevor Sie sich darauf verlassen.

Diese gemischte Darstellung — Tabellen, wo die Daten rechteckig sind, Listen, wo es eine Folge ist, Überschriften, wo es ein Baum ist, Codeblöcke, wo es tiefer ist, als ein Dokument gehen sollte — ist das, was ein JSON-zu-Markdown-Konverter tatsächlich entscheidet, wenn er konvertiert. Das ist der Grund, warum [TransformPipes JSON-zu-Markdown-Konvertierung](/json-to-markdown) eine Darstellung pro Form wählt statt eine zu erzwingen, im Browser, ohne dass abgemeldet irgendetwas hochgeladen wird.

| Signal in den Daten | Tabelle? | Bessere Darstellung |
| --- | --- | --- |
| Viele Datensätze, wenige skalare Felder | Ja | Tabelle |
| Ein Datensatz, viele Felder | Nein | Fette Labels, Überschriften für verschachtelte Teile |
| Ein Feld mit Prosa | Nein | Abschnitt pro Datensatz, Prosa als Absatz |
| Tiefe Verschachtelung, die zählt | Nein | Überschriften pro Ebene, eingezäunter Block ab drei |
| Eine Liste reiner Werte | Nein | Aufzählungs- oder nummerierte Liste |
| Datensätze mit zwei oder drei Feldern, Dutzende davon | Ja | Tabelle, sortiert |

## Wie man die Darstellung wählt

1. **Lesen Sie die ersten zehn Zeilen der Datei, bevor Sie irgendein Werkzeug öffnen.** Die oberste Form entscheidet alles Nachgelagerte, und es dauert zehn Sekunden: `head -c 400 data.json` sagt Ihnen, ob Sie ein Array von Datensätzen oder einen verschachtelten Umschlag haben, und ein verschachtelter Umschlag bedeutet, Ihre Tabelle ist über einem Feld darin statt über der ganzen Datei.
2. **Fragen Sie, ob die Datei ein einzelner JSON-Wert ist oder einer pro Zeile.** Verpassen Sie das, und Sie bekommen bestenfalls einen Parse-Fehler und schlimmstenfalls nur den ersten Datensatz. `head -n 3` und ein Blick darauf, ob jede Zeile ein vollständiges Objekt ist, klärt das, und die Lösung ist ein Flag pro Werkzeug.
3. **Absichtlich abflachen, dann absichtlich Spalten auswählen.** Automatisches Abflachen erzeugt jede Spalte, die die Daten hergeben können, was für echte API-Datensätze mehr Spalten sind, als ein Dokument fassen kann. Wählen Sie die Spalten und ihre Reihenfolge explizit, sonst bekommt die Leserin die Meinung des Serialisierers statt Ihrer.
4. **Konstruieren Sie den unbequemen Datensatz und konvertieren Sie ihn, bevor Sie dem Werkzeug vertrauen.** Ein Datensatz mit einem null, einem fehlenden Schlüssel, einem verschachtelten Objekt, einem Array-Feld, einer Pipe in einer Zeichenkette und einem Zeilenumbruch in einer Zeichenkette. Jeder Fehlschlag auf dieser Seite zeigt sich in dieser einen Konvertierung, und ihn dort zu finden kostet zwei Minuten statt einer Rücknahme.
5. **Entscheiden Sie, ob die Ausgabe gelesen oder verarbeitet werden soll.** Eine Markdown-Tabelle ist ein Dokument: Typen sind weg, und nichts kann sie sicher zurückparsen. Wenn der nächste Schritt eine Tabellenkalkulation oder ein Skript ist, konvertieren Sie zu CSV und überspringen Sie den Umweg.
6. **Wenn die Spalten die Zeilen zahlenmäßig übertreffen, hören Sie auf, eine Tabelle zu bauen.** Dieses Verhältnis ist das klarste Signal, dass die Daten ein Datensatz statt einer Liste sind, und ein Datensatz rendert als beschriftete Werte. Ein Rechteck an dieser Stelle zu erzwingen kostet Sie das Einzige, wofür die Konvertierung überhaupt gedacht war, nämlich dass jemand sie lesen kann.

## Fazit

Ein Array flacher Objekte mit konsistenten Schlüsseln konvertiert ohne Entscheidungen und ohne Verluste zu einer Markdown-Tabelle, und wenn das Ihre Datei ist, spielt die Wahl des Werkzeugs kaum eine Rolle. Alles andere ist eine Entscheidung, die jemand treffen muss: die Verschachtelung abflachen oder als Abschnitte rendern, das Array-Feld zusammenfügen oder in Zeilen aufsprengen, die Vereinigung der Schlüssel nehmen oder die Lücken akzeptieren, und die Pipes maskieren, bevor ein Wert mit einer darin eine Zeile verschiebt, die niemand noch einmal liest. Treffen Sie diese Entscheidungen selbst mit `jq` oder `mlr`, solange die Daten noch JSON sind, oder nutzen Sie einen Konverter, dessen Regeln aufgeschrieben sind, damit Sie wissen, was er getan hat. Das eine, was man nicht tun sollte, ist, einem Rechteck einen Baum zu geben und anzunehmen, die Ausgabe sei wahr, weil sie fluchtet.

## FAQ

### Wie konvertiere ich ein JSON-Array in eine Markdown-Tabelle?

Wenn jedes Objekt im Array dieselben Schlüssel hat und alle Werte skalar sind, kann jeder Konverter das: die Datei auf einen Browser-Konverter ziehen, `mlr --ijson --omd cat data.json` ausführen, sie durch `jtbl -m` leiten, oder `to_markdown(index=False)` auf einem pandas-DataFrame aufrufen. Wenn die Objekte verschachtelte Objekte oder Arrays enthalten, flachen Sie zuerst ab, sonst enthalten manche Zellen stringifiziertes JSON.

### Was passiert mit verschachteltem JSON in einer Markdown-Tabelle?

Eines von drei Dingen, je nach Werkzeug: Der verschachtelte Wert wird in eine einzelne Zelle stringifiziert, er wird zu gepunkteten Spalten wie `user.name` abgeflacht, oder er wird fallen gelassen. Abflachen ist die einzige der drei Optionen, die die Daten lesbar hält, und es lässt die Spaltenzahl wachsen — flachen Sie also ab und wählen Sie dann die Spalten aus, die Sie wollen, statt alle zu akzeptieren.

### Wie gehe ich mit Datensätzen mit unterschiedlichen Schlüsseln um?

Bauen Sie die Kopfzeile aus der Vereinigung der Schlüssel über jeden Datensatz, nicht aus dem ersten. Prüfen Sie, was Ihr Konverter getan hat, mit `jq -r '[.[] | keys[]] | unique | join(",")'`, und vergleichen Sie diese Liste mit der Kopfzeile in Ihrer Ausgabe — wenn die Ausgabe kürzer ist, wurden Felder aus späteren Datensätzen still fallen gelassen.

### Kann ich eine Markdown-Tabelle aus JSON Lines erstellen?

Ja, sobald das Werkzeug weiß, dass die Datei zeilengetrennt ist. Miller liest sie mit `--ijsonl`, pandas mit `lines=True`, und jq behandelt einen Strom von Werten als normale Eingabe, sodass `jq -s '.' events.jsonl` die Datei in ein Array verwandelt, das jedes andere Werkzeug akzeptiert. Ein Konverter ohne Hinweis scheitert bei Zeile 2 mit einem Syntaxfehler, was wie Dateibeschädigung aussieht und es nicht ist.

### Was bricht eine aus JSON erzeugte Markdown-Tabelle?

Pipe-Zeichen und Zeilenumbrüche in Zeichenkettenwerten. Eine Pipe beendet eine Zelle, wo auch immer sie auftaucht, sodass eine unmaskierte dieser Zeile eine Spalte hinzufügt, und ein Zeilenumbruch kann in einer Tabellenzeile überhaupt nicht dargestellt werden. Ein guter Konverter maskiert Pipes als `\|` und ersetzt Zeilenumbrüche durch `<br>` oder ein Leerzeichen; testen Sie beide Fälle an einem Wert, den Sie kontrollieren, bevor Sie der Ausgabe vertrauen.

### Sollte ich JSON stattdessen zu CSV konvertieren?

Wenn der nächste Schritt eine Tabellenkalkulation, ein Skript oder irgendetwas ist, das die Daten parsen wird, ja — CSV verliert Typen auch, ist aber wenigstens dafür gedacht, zurückgelesen zu werden, während eine Markdown-Tabelle ein Dokument ohne verlässlichen Parser ist. Konvertieren Sie zu Markdown, wenn eine Person es in einem Ticket, einem Pull Request oder auf einer Seite lesen wird.

### Warum sieht meine Zahl nach der Konvertierung anders aus?

Weil sie unterwegs durch einen JSON-Zahlentyp gelaufen ist. `9.0` wird zu `9`, `007` wird zu `7`, wenn es eine Zahl statt einer Zeichenkette war, und eine Gleitkommazahl, die binär nicht exakt darstellbar ist, kommt mit den Ziffern an, die JSON gespeichert hat. Jedes Feld, dessen gedruckte Form zählt — ein Produktcode, eine Version, ein Preis mit fester Dezimalstelle — muss in den Quelldaten eine Zeichenkette sein; kein Konverter kann eine Null wiederherstellen, die er nie erhalten hat.
