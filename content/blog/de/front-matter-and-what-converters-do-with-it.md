---
title: "Markdown Front Matter, und was Konverter damit machen"
description: "Der Block oben in einer Markdown-Datei wird entfernt, gerendert, in eine Tabelle verwandelt oder als Metadaten gelesen - je nach Werkzeug."
date: 2026-08-18
tag: Syntax
keywords: markdown front matter, yaml front matter, front matter markdown konverter, front matter entfernen, toml front matter, json front matter, hugo front matter, jekyll front matter, markdown metadaten
---

Eine Datei kommt an, Sie konvertieren sie, und die Seite öffnet sich mit einer horizontalen Linie, dann einer fetten Überschrift, die lautet `title: Q3 review date: 2026-08-04 draft: false`. Nichts ist kaputt. Der Konverter hat genau das getan, was die Markdown-Spezifikation für drei Bindestriche, einen Absatz und drei weitere Bindestriche vorschreibt. Der Block, den Sie als Metadaten gemeint haben, ist für einen Parser, der noch nie von Front Matter gehört hat, einfach Text.

### Kurzfassung

Front Matter ist ein Metadatenblock am Anfang einer `.md`-Datei, und er steht in keiner Markdown-Spezifikation — weder CommonMark noch GFM. Deshalb entscheidet jedes Werkzeug für sich selbst, und es gibt nur vier mögliche Ergebnisse: Der Block wird **entfernt** und verworfen, **gerendert** als Dokumentinhalt, **in eine Tabelle verwandelt**, oder **als Metadaten gelesen** und genutzt. Statische Seitengeneratoren lesen ihn; einfache Konverter und Bibliotheken rendern ihn, was wie ein Fehler aussieht und Wörtlichkeit ist; GitHub tabelliert ihn. Wenn die Datei irgendwohin geht, das sie rendern wird, entfernen Sie den Block zuerst oder nutzen Sie ein Werkzeug mit einer Front-Matter-Option, und schreiben Sie nie eine bloße `---`-Regel am Anfang eines Dokuments.

Front Matter kam auf einem Umweg in Markdown hinein. Jekyll wollte Variablen pro Seite, wählte einen mit `---` eingezäunten YAML-Block, und jeder Generator seither hat die Konvention kopiert, ohne dass sie je jemand in eine Spezifikation geschrieben hätte. Das Ergebnis ist ein Konstrukt, das ein Dutzend weit verbreiteter Werkzeuge unterstützt, das keine zwei davon identisch unterstützen, und das ein Parser vollständig ignorieren darf.

Das ist die Reibung. Sie können einer Datei nicht ansehen, was mit ihrem Kopf passieren wird, und Sie können es auch nicht der Feature-Liste eines Konverters ansehen, weil „unterstützt Markdown" nichts über einen Block aussagt, der kein Markdown ist. Der Fehlschlag ist in beide Richtungen leise: Ein Renderer druckt Ihre Metadaten ins Dokument, wo Leser sie sehen, und ein Metadaten-Leser löscht still eine `---`-Regel, die Sie als sichtbaren Trenner gemeint haben.

Dieser Text handelt davon, welche Werkzeuge was tun, warum das Render-Verhalten vertretbar statt defekt ist, was mit TOML- und JSON-Köpfen passiert, und die eine echte Falle — dass `---` gleichzeitig ein Front-Matter-Trenner, eine horizontale Linie und eine Setext-Überschriften-Unterstreichung ist, und welches der drei es wird, hängt davon ab, wo es landet.

## Ein Block, den keine Markdown-Spezifikation definiert

Nehmen Sie das kleinstmögliche Beispiel und lassen Sie es durch einen Parser ohne Front-Matter-Unterstützung laufen. Das ist `marked`, die Bibliothek hinter vielen Vorschauen und Konvertern:

```md
---
title: Notes
date: 2026-01-01
---

Body
```

Die Ausgabe ist nicht das, was Ihnen ein Generator geben würde:

```html
<hr>
<h2>title: Notes
date: 2026-01-01</h2>
<p>Body</p>
```

Als Parser gelesen, ist es unvermeidlich. Das erste `---` hat nichts darüber, ist also eine thematische Trennung — ein `<hr>`. Die zwei `key: value`-Zeilen sind ein Absatz. Das schließende `---` sitzt direkt unter einem Absatz, und in Markdown macht eine Zeile aus Bindestrichen unter einem Absatz diesen zu einer Setext-Überschriften-Unterstreichung, was den Absatz darüber in ein `<h2>` verwandelt. Drei Bindestriche, ein Absatz, drei Bindestriche: Linie, Überschrift. Der Konverter ist der einzigen Spezifikation treu, die für die Zeichen existiert, die er bekommen hat.

Setzen Sie eine Leerzeile in den Block, was YAML erlaubt und Leute tun, wenn ein Kopf wächst, und die Form ändert sich wieder:

```html
<hr>
<p>title: Notes</p>
<h2>date: 2026-01-01</h2>
```

Jetzt ist der erste Schlüssel ein Absatz, und nur der letzte wird eine Überschrift, weil eine Setext-Unterstreichung nur den Absatz unmittelbar darüber beansprucht. Gleiche Absicht, zwei verschiedene Dokumente, und keines ist ein Fehler. Das ist dieselbe Art von Problem wie [die Unterschiede zwischen den Markdown-Dialekten](/blog/commonmark-gfm-and-the-flavours), mit einer Erschwerung: Dialekte dokumentieren wenigstens, was sie hinzufügen. Front Matter ist eine Konvention statt einer Erweiterung, es gibt also nichts, wogegen man ein Werkzeug prüfen könnte.

Die vier folgenden Ergebnisse sind erschöpfend. Ein Werkzeug kann den Block wegwerfen, drucken, formatieren, oder benutzen. Alles, dem Sie in freier Wildbahn begegnen, ist eines dieser vier, und die einzige Frage, die sich bei einem Konverter lohnt, ist, welches er gewählt hat.

## Schnellvergleich: was jedes Werkzeug mit dem Block macht

| Werkzeug | Was es mit Front Matter macht | Erkannte Trenner | Was Sie am Ende haben | Preis |
| --- | --- | --- | --- | --- |
| Jekyll | Liest es als Metadaten; eine Seite braucht den Block, um überhaupt verarbeitet zu werden | `---` YAML | Seitenvariablen in Vorlagen, Block weg aus der Ausgabe | Kostenlos, MIT |
| Hugo | Liest es als Metadaten | `---` YAML, `+++` TOML, `{` und `}` JSON | Seitenparameter, Block weg aus der Ausgabe | Kostenlos, Apache 2.0 |
| Eleventy | Liest es als Metadaten über gray-matter | `---` YAML, plus ein Sprachsuffix wie `---json` | Einträge in der Daten-Kaskade, Block weg aus der Ausgabe | Kostenlos, MIT |
| MkDocs | Liest es als Seitenmetadaten | `---` YAML | `page.meta` in Vorlagen, Block weg aus der Ausgabe | Kostenlos, BSD |
| Docusaurus | Liest es als Seitenmetadaten | `---` YAML | Sidebar-Position, Slug und Tags; Block weg | Kostenlos, MIT |
| Pandoc | Liest es als Metadaten, mit aktivierter Erweiterung | `---` zum Öffnen, `---` oder `...` zum Schließen | Vorlagenvariablen, und ein Titelblock mit `--standalone` | Kostenlos, GPL |
| marked | Rendert es als Inhalt | Keine | Ein `<hr>` und ein `<h2>` Ihrer Schlüssel | Kostenlos, MIT |
| markdown-it | Rendert es als Inhalt, außer ein Plugin wird hinzugefügt | Keine eingebaut | Ein `<hr>` und ein `<h2>` Ihrer Schlüssel | Kostenlos, MIT |
| remark mit remark-frontmatter | Erkennt es, parst es nicht, entfernt es aus dem HTML | `---` YAML, `+++` TOML, eigene Zäune | Ein `yaml`-Knoten im Baum und nichts im HTML | Kostenlos, MIT |
| Python-Markdown mit `meta` | Entfernt es und stellt es als Zeichenketten bereit | Optionales `---` am Anfang, `---` oder `...` am Ende, oder eine Leerzeile | `md.Meta` als Listen von Zeichenketten | Kostenlos, BSD |
| gray-matter | Trennt es ab und parst es für Sie | `---` standardmäßig, konfigurierbar, Sprachsuffixe | `data`, `content`, und `excerpt` auf Anfrage | Kostenlos, MIT |
| GitHub | Verwandelt es in eine Tabelle | `---` YAML | Eine zweizeilige Tabelle über Ihrem Dokument | Kostenlos |
| GitLab | Zeigt es unverändert in einer Box über dem Dokument | `---` YAML, `+++` TOML, `;;;` JSON | Der rohe Block, sichtbar, oben | Kostenlos |
| VS-Code-Vorschau | Blendet es aus | `---` YAML | Nichts; die Vorschau beginnt bei Ihrer ersten Überschrift | Kostenlos |
| Obsidian | Liest es als Eigenschaften und zeigt sie im eigenen Panel | `---` YAML | Typisierte Felder, mit reserviertem `tags` und `aliases` | Kostenlos |
| Ein Regex in Ihrem eigenen Build | Entfernt es, meist korrekt | Was auch immer das Muster sagt | Eine kürzere Zeichenkette, und ein wartender Randfall | Kostenlos |

GitLabs Trennerliste ist die breiteste aller hier genannten Werkzeuge: YAML mit `---`, TOML mit `+++`, JSON mit `;;;`, und ein Sprachbezeichner, angehängt an den Trenner, wie in `---php` (geprüft auf docs.gitlab.com, 8. September 2026).

## Die vier Schicksale, eins nach dem anderen

### Entfernt: der Block wird beseitigt und vergessen

Das einfachste Verhalten, und das häufigste innerhalb eines Builds. Das Werkzeug findet den Block, entfernt ihn aus dem Text, und tut sonst nichts damit. Python-Markdowns `meta`-Erweiterung ist explizit über die Reihenfolge — ihre Dokumentation sagt, alle Metadaten werden aus dem Dokument entfernt, bevor irgendeine weitere Verarbeitung durch Markdown stattfindet — und `remark-frontmatter` endet für HTML-Ausgabe am selben Punkt, weil der Knoten, den es zum Baum hinzufügt, keinen HTML-Handler hat und also nichts erzeugt.

| Vorteile | Nachteile |
| --- | --- |
| Die Ausgabe ist das Dokument, ohne dass Metadaten hineinlecken | Die Metadaten sind weg, ein Titel muss also woanders herkommen |
| Nichts zu konfigurieren, sobald es eingeschaltet ist | Leise: eine `---`-Regel am Anfang eines Fließtexts wird genauso bereitwillig entfernt |
| Funktioniert für beliebige Schlüssel, gültiges YAML oder nicht, in der groben Version | Eine Regex-Version bricht an einer Zeile aus drei Bindestrichen in einem zitierten Wert |

**Für wen das ist.** Alle, die Dateien konvertieren, die aus einem Generator kamen und irgendwohin gehen, das die Metadaten nicht braucht: ein README, das zu einer Seite wird, ein Dokumentationsordner, der zur Prüfung gerendert wird, eine Sammlung von Notizen, die für einen Kunden exportiert werden. Wenn Sie nur die Prosa brauchen, ist Entfernen die richtige Antwort und die günstigste einzurichten.

Die `remark-frontmatter`-Trennung lohnt sich zu verstehen, wenn Sie unified nutzen, weil man leicht zu viel vom Plugin erwartet. Es fügt einen Knoten vom Typ `yaml` — oder `toml` — hinzu, der den rohen Text als Zeichenkette trägt, und sein Readme ist unmissverständlich, dass es die Daten darin nicht parst; das ist eine separate Aufgabe für so etwas wie `vfile-matter`. Es zu installieren kauft Ihnen also das Entfernen, nicht die Metadaten. Das ist eine sinnvolle Arbeitsteilung und eine Überraschung für jeden, der es in der Hoffnung auf `data.title` installiert hat.

### Gerendert: der Konverter ist wörtlich, nicht kaputt

Jede allgemeine Markdown-Bibliothek ohne Front-Matter-Funktion landet hier, und ebenso jeder Konverter, der auf einer solchen aufgebaut ist, deren Autor nie eine Entscheidung über Köpfe getroffen hat. Sie bekommen das `<hr>` und das `<h2>`, und es sieht aus, als hätte das Werkzeug Ihre Datei gefressen.

| Vorteile | Nachteile |
| --- | --- |
| Treu: nichts in der Eingabe wird still gelöscht | Ihre Metadaten erscheinen im Dokument, wo Leser sie lesen |
| Vorhersehbar, sobald man die Regel kennt | Es sieht wie ein Defekt aus, Leute melden es also als einen |
| Kein Plugin, und kein Zweifel, was verworfen wurde | Die genaue Form hängt von Leerzeilen im Block ab |

**Für wen das ist.** Niemand wählt das absichtlich, und es ist trotzdem der korrekte Standard für eine Bibliothek. Ein Parser, der raten würde, welche Absätze Metadaten sind, läge irgendwo falsch, und der Fehler wäre nicht wiederherstellbar, weil der Text weg wäre. Rendern behält die Information im Dokument und überlässt die Entscheidung dem Aufrufer, wo sie hingehört. `marked` hat keine Front-Matter-Option, und der übliche Rat ist, zuerst `gray-matter` über die Zeichenkette laufen zu lassen. `markdown-it` hat auch keine Front-Matter-Regel; Plugins dafür arbeiten, indem sie den Block finden und nichts rendern, und geben den rohen Text an einen Callback weiter, damit Sie tun können, was Sie wollen.

Die praktische Konsequenz ist, dass „der Konverter hat meinen Kopf zerstört" und „der Konverter hat keine Meinung zu Köpfen" dasselbe Ereignis sind. Wenn Sie zwischen Werkzeugen wählen, ist das eines der Dinge, [die Ihnen ein Feature-Vergleich nicht sagt](/blog/best-markdown-to-html-converters), und es braucht eine Datei und zehn Sekunden, es herauszufinden.

### In eine Tabelle verwandelt: gerendert, aber formatiert

GitHub liest den Block, erkennt ihn, und rendert ihn als Tabelle über Ihrem Dokument — Schlüssel in der Kopfzeile, Werte in der einen Zeile darunter. Das ist eine bewusste Entgegenkommen, und es ergibt Sinn für einen Code-Host: GitHub Pages läuft auf Jekyll, Front Matter in einem Repository ist also meist echte Metadaten statt eines Versehens, und es anzuzeigen ist besser, als es als Überschrift zu drucken.

| Vorteile | Nachteile |
| --- | --- |
| Der Block ist als Metadaten erkennbar, nicht mit Prosa verwechselt | Ein Kopf mit einem Dutzend Schlüsseln wird eine ein Dutzend Spalten breite Tabelle |
| Nichts wird vor jemandem versteckt, der das Repository durchsucht | Lange Werte, Listen und verschachteltes YAML lesen sich schlecht in einer Zelle |
| Konsistent über jede gerenderte `.md`-Datei in einem Repository | Sie können es für eine einzelne Datei nicht ausschalten |

**Für wen das ist.** Leser, nicht Builds. Es ist die richtige Entscheidung für einen Code-Host und irrelevant für eine Pipeline, und es ist der Grund, warum eine Datei auf GitHub ordentlich aussehen und in Ihrem eigenen Konverter als Linie und Überschrift ankommen kann: zwei Werkzeuge, zwei der vier Schicksale, eine unveränderte Datei. GitLab trifft eine verwandte Entscheidung und zeigt den Block unverändert in einer Box oben im Dokument, was derselbe Instinkt mit weniger Formatierung ist.

### Als Metadaten gelesen: der Block tut etwas

Das Schicksal, für das der Block erfunden wurde. Das Werkzeug parst das YAML, nutzt die Schlüssel, und entfernt sie aus dem Inhalt.

Jekyll hat damit angefangen: Eine Datei, die mit dem Block beginnt, wird verarbeitet, und eine, die es nicht tut, wird unverändert durchgereicht, weshalb ein leerer `---`-Block eine echte Sache ist, die Leute absichtlich schreiben. Hugo bestimmt das Format aus den Trennern und verwandelt die Schlüssel in Seitenparameter, mit `title`, `date`, `draft`, `weight`, `description`, `slug` und `layout` unter den Standardschlüsseln. MkDocs stellt den Block als `page.meta` bereit. Docusaurus nutzt `id`, `title`, `sidebar_position` und `slug`. Obsidian liest den Block als typisierte Eigenschaften und zeigt sie in einem Panel statt im Notiztext, wobei `tags`, `aliases` und `cssclasses` für sein eigenes Verhalten reserviert sind.

Pandoc ist der interessante Fall, weil es ein Konverter statt eines Generators ist und trotzdem den Block liest. Die Erweiterung heißt `yaml_metadata_block`, und sie gehört zu Pandocs eigenem Markdown-Dialekt, weshalb Sie sie beim Eingabeformat `commonmark` oder `gfm` beim Format benennen statt sie anzunehmen:

```bash
pandoc -f gfm+yaml_metadata_block -t html --standalone notes.md -o notes.html
```

Drei Details aus dem Handbuch lohnen sich zu behalten. Der öffnende Trenner ist eine Zeile aus drei Bindestrichen, und der schließende darf `---` oder drei Punkte sein. Der Block muss nicht am Anfang der Datei stehen — er darf überall im Dokument vorkommen, sofern eine Leerzeile davor steht, wenn er nicht am Anfang ist. Und `title`, `author`, `date` und `abstract` werden von den Standardvorlagen genutzt, während jeder andere Schlüssel automatisch aus den Metadaten zu einer Vorlagenvariable wird, was der Weg ist, wie Leute eine Versionszeichenkette in eine Fußzeile bekommen, ohne den Dokumentkörper anzufassen (geprüft auf pandoc.org, 8. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Die Metadaten tun, wofür sie geschrieben wurden | Es funktioniert nur, wenn beide Seiten sich über Schlüsselnamen einig sind |
| Der Dokumentkörper bleibt sauber | Ungültiges YAML wird zum Build-Fehlschlag statt zu einer Kuriosität |
| Ein Titel in der Datei bedeutet ein Titel in der Ausgabe | Schlüssel sind pro Werkzeug: `weight` bedeutet Jekyll nichts |

**Für wen das ist.** Alle, deren Markdown in einem Repository lebt und von etwas gebaut wird — einer Dokumentationsseite, einem Blog, einem Ordner von Runbooks. Wenn die Dateien die verbindliche Quelle sind, ist Front Matter, wohin die Teile einer Seite gehören, die keine Prosa sind, und das ist das meiste dessen, was [Dokumentation, die im Repository lebt](/blog/documentation-that-lives-in-the-repo), überhaupt funktionieren lässt.

Wenn Sie das Parsen ohne den Generator wollen, ist `gray-matter` die Bibliothek, die fast alles in JavaScript dafür nutzt. Sie gibt `data` zurück — den geparsten Block als Objekt —, `content`, was die Eingabe ohne den Block ist, und `excerpt`, wenn Sie danach fragen. Sie handhabt YAML, JSON und JavaScript-Front-Matter von Haus aus; TOML und CoffeeScript sind durch Hinzufügen einer Engine verfügbar. Trenner sind über eine `delimiters`-Option konfigurierbar, und eine Sprache kann am öffnenden Trenner benannt werden, als `---toml`. Sie ist MIT-lizenziert. In Python füllt `python-frontmatter` denselben Platz über PyYAML.

```js
import matter from "gray-matter";
import { marked } from "marked";

const { data, content } = matter(raw);
const html = marked.parse(content);

// data.title is now yours to put in the <title> element.
```

Zwei Zeilen, und der Block wechselt vom zweiten zum vierten Schicksal.

## TOML, JSON und die Trenner, auf die sich niemand geeinigt hat

YAML mit `---` ist überall der Standard, aber es ist nicht die einzige Konvention, und die Alternativen scheitern unterschiedlich.

TOML-Front-Matter wird mit `+++` eingezäunt, was Hugo unterstützt, seit es existiert. Anders als `---` bedeutet `+++` in Markdown überhaupt nichts, ein einfacher Konverter erzeugt also weder eine Linie noch eine Überschrift. Er erzeugt einen Absatz aus wörtlichem Text:

```html
<p>+++
title = &quot;Notes&quot;
+++</p>
```

Das ist argumentierbar besser, weil es offensichtlich falsch ist und niemand es für eine echte Überschrift hält, und argumentierbar schlechter, weil Ihre Metadaten jetzt sichtbare Prosa oben auf einer Seite sind. So oder so, ein Werkzeug, das YAML-Front-Matter erkennt, erkennt nicht unbedingt TOML: `gray-matter` braucht eine hinzugefügte Engine dafür, `remark-frontmatter` hat eine TOML-Voreinstellung, um die man bitten muss, und Pandocs `yaml_metadata_block` ist, wie der Name sagt, YAML.

JSON-Front-Matter ist seltsamer, weil es in Hugo überhaupt keine Trenner gibt — die Datei beginnt mit `{`, und das Objekt endet mit `}`. Eleventy geht den anderen Weg und lässt Sie `---json` am öffnenden Trenner schreiben, was ein gray-matter-Feature ist statt eines von Eleventy. Für einen Markdown-Parser ist ein untrenntes JSON-Objekt oben in einer Datei ein Absatz aus geschweiften Klammern und Anführungszeichen, entity-maskiert und gedruckt. GitLab erkennt `;;;` für JSON, was eine vierte Konvention für dieselbe Idee ist.

| Format | Trenner | Erkannt von | Was ein einfacher Parser daraus macht |
| --- | --- | --- | --- |
| YAML | `---` bis `---`, oder `...` zum Schließen in Pandoc | Alles, was überhaupt Front Matter unterstützt | Ein `<hr>` plus ein `<h2>` Ihrer Schlüssel |
| TOML | `+++` bis `+++` | Hugo, GitLab, remark mit der TOML-Voreinstellung | Ein sichtbarer Absatz aus wörtlichem `+++` und Schlüsseln |
| JSON | `{` bis `}`, ohne Zaun | Hugo | Ein sichtbarer Absatz aus geschweiften Klammern und Anführungszeichen |
| JSON | `---json` bis `---` | Eleventy, und gray-matter darunter | Ein sichtbarer Absatz, oder eine Überschrift, wenn der Zaun bloß ist |
| JSON | `;;;` bis `;;;` | GitLab | Ein sichtbarer Absatz aus Semikolons und Schlüsseln |

Die Lehre ist eng und nützlich. YAML ist das einzige Format mit annähernd universeller Unterstützung, schreiben Sie also YAML, außer ein Werkzeug in Ihrer Kette verlangt anderes. Die exotischen Trenner kaufen nichts außer einer kleineren Menge von Werkzeugen, die die Datei in zwei Jahren noch verstehen.

## Die Falle: der Trenner ist auch eine horizontale Linie

Alles oben ist eine Frage, zu wissen, welches Werkzeug Sie in der Hand halten. Dieser Teil ist eine echte Mehrdeutigkeit in der Syntax, und sie schneidet in beide Richtungen.

`---` allein auf einer Zeile hat drei Bedeutungen in Markdown, ganz nach Kontext entschieden. Mit Text direkt darüber ist es eine Setext-Überschriften-Unterstreichung. Mit einer Leerzeile darüber ist es eine thematische Trennung — ein `<hr>`. Und ganz am Anfang einer Datei ist es das, wonach jeder Front-Matter-Parser sucht. Nichts in der Syntax unterscheidet den dritten Fall vom zweiten: Position ist das ganze Signal.

Betrachten Sie also ein Dokument, das mit einem Trenner beginnt, was Leute öfter aus ästhetischen Gründen schreiben, als man erwarten würde:

```md
---

Notes from the incident review, 4 August.

---

## Timeline
```

Ein Front-Matter-Parser liest das erste `---`, sucht nach dem nächsten, findet es vier Zeilen weiter unten, und nimmt alles dazwischen als Metadaten. Was als Nächstes passiert, hängt vom Werkzeug ab. Ein YAML-Parse von `Notes from the incident review, 4 August.` gelingt — YAML liest bereitwillig einen bloßen Satz als Zeichenkette —, es wirft also nichts; der Parser bekommt einfach eine Zeichenkette, wo er ein Objekt erwartet hat. Manche Werkzeuge ignorieren das, manche protokollieren es, und alle geben Inhalt mit entfernter erster Zeile zurück. Das Dokument, das Sie zurückbekommen, beginnt bei `## Timeline`, und nirgendwo wurde ein Fehler ausgelöst.

Machen Sie diese erste Zeile zu etwas, das YAML nicht mag, und Sie bekommen den gegenteiligen Fehlschlag: einen Build, der mit einem Parse-Fehler stoppt, der auf Prosa zeigt. Beide Ergebnisse kommen aus derselben Ursache, nämlich dass der Trenner nicht für einen einzigen Job reserviert ist.

Die andere Richtung beißt, wenn Dateien kombiniert werden. Verketten Sie mehrere Dateien, die jeweils mit einem Kopf beginnen, und nur der erste Block steht in Front-Matter-Position. Der Rest landet mitten im Dokument, wo drei Bindestriche Linie und Überschrift bedeuten — weshalb [das Zusammenführen vieler Markdown-Dateien](/blog/merging-many-markdown-files) die Blöcke entfernen muss, während jede Datei gelesen wird, statt es hinterher aufzuräumen.

Innerhalb des Blocks halten dieselben Zeichen eine weitere Überraschung bereit. Python-Markdowns `meta`-Erweiterung beendet die Metadaten an der ersten Leerzeile oder dem ersten schließenden Trenner, je nachdem, was zuerst kommt, sodass eine Leerzeile mitten in einem langen Kopf ihn abschneidet und die restlichen Schlüssel zu Fließtext werden. Bibliotheken, die den Block rendern, spalten ihn ebenfalls an der Leerzeile, wie zuvor gezeigt, nur in einen Absatz und eine Überschrift statt.

Drei Gewohnheiten beseitigen die ganze Fehlerklasse:

- Schreiben Sie horizontale Linien als `***` oder `___`, nie als `---`. Sie erzeugen ein identisches `<hr>` und können nicht mit einem Trenner oder einer Überschriften-Unterstreichung verwechselt werden.
- Halten Sie das öffnende `---` auf der allerersten Zeile der Datei, ohne Leerzeile und ohne Byte-Order-Mark davor. Die meisten Parser verlangen den Trenner am Anfang der Zeichenkette und schließen sonst still, es gebe kein Front Matter.
- Lassen Sie keine Leerzeilen im Block. YAML erlaubt sie, mehrere Front-Matter-Leser nicht, und die Werkzeuge, die den Block rendern, ändern deswegen die Form.

## Wo Entfernen-und-Weitermachen scheitert, und was es kostet

Entfernen ist die naheliegende Antwort für Konvertierung, und sie ist meist richtig. Hier ist, was es tatsächlich kostet, denn die Kosten stehen nie auf der eigenen Seite eines Werkzeugs.

**Der Titel geht mit weg.** Das eine Stück Metadaten, das jedes Ausgabeformat will, ist der Titel, und Entfernen löscht ihn. Eine HTML-Datei ohne `<title>` zeigt den Dateinamen im Browser-Tab, was jemand in seiner Tableiste und seinen Lesezeichen sieht. Eine Datei namens `final-v3.html` in einem Tab ist eine kleine Peinlichkeit, die eine Zweizeilen-Änderung vermeidet: den Block parsen, `title` behalten, in den Kopf setzen. Dasselbe gilt für die Beschreibung, die das ist, was ein Chat-Client liest, wenn er eine Link-Vorschau baut.

**Daten hören auf, Daten zu sein.** Ein YAML-Datum ist in den meisten Parsern keine Zeichenkette. Ein Zeitstempel ist ein aufgelöster YAML-Typ statt Text, sodass js-yaml bei `date: 2026-08-18` ein JavaScript-`Date`-Objekt zurückgibt und PyYAML ein `datetime.date` (geprüft auf yaml.org, 8. September 2026). Das ist bequem, bis eine Zeitzone ins Spiel kommt und ein am 18. datiertes Dokument irgendwo westlich von Ihnen als der 17. gerendert wird. Setzen Sie den Wert in Anführungszeichen, wenn Sie die Zeichen wollen, die Sie getippt haben.

**YAML-Typen sind an sich schon eine Gefahr.** Der klassische Fall ist das Norwegen-Problem. PyYAML ist ein vollständiger YAML-1.1-Parser, und YAML 1.1 definierte `y`, `yes`, `n`, `no`, `on` und `off` als Booleans, sodass `country: NO` als `False` zurückkommt (PyYAML 6.0.3, geprüft auf pypi.org, 8. September 2026). js-yaml hat aufgehört, diese Wörter in Booleans umzuwandeln, und liest Zahlen nach YAML-1.2-Regeln, sodass dieselben Wörter als Zeichenketten zurückkommen (js-yaml 5.4.1, geprüft auf github.com/nodeca/js-yaml, 8. September 2026). Derselbe Kopf bedeutet also in einem Python-Build und einem Node-Build verschiedene Dinge, was ein echt fieser Fehler ist, wenn eine Dokumentationsseite von dem einen gebaut und vom anderen geprüft wird. Und `version: 1.10` ist in beiden die Zahl 1,1, weil es ein Float ist — setzen Sie Versionsnummern in Anführungszeichen, oder verlieren Sie die abschließende Null.

**Ein Doppelpunkt in einem Titel ist ein Parse-Fehler.** Das ist der häufigste Front-Matter-Defekt überhaupt. `title: Release 2.1: what changed` ist kein gültiges YAML: Der zweite Doppelpunkt beginnt eine neue Zuordnung, und der Parser meldet falsche Einrückung an einer Zeile, die für einen Menschen völlig in Ordnung aussieht. Die Lösung sind Anführungszeichen, und der Grund, es im Voraus zu wissen, ist, dass die Fehlermeldung den Doppelpunkt nie erwähnt.

**Tabs sind unzulässig.** YAML verbietet Tabs in der Einrückung, ein Editor, der so eingestellt ist, sie einzufügen, bricht also eine verschachtelte Liste in einem Kopf mit einem Fehler über Tab-Zeichen, und nichts an der Datei sieht auf dem Bildschirm falsch aus.

**Ein Regex ist kein Parser.** Ein handgestricktes Entfernen — von den ersten `---` bis zu den nächsten `---` matchen und wegwerfen — sind drei Zeilen und funktioniert bei fast jeder Datei. Es scheitert bei einem Wert, der eine Zeile aus drei Bindestrichen enthält, bei einer Datei, deren erste Zeile eine Trennlinie ist, und bei einem mit `...` geschlossenen Kopf. Fast jede Datei ist in Ordnung; die Ausnahme kostet Sie ein Dokument mit fehlendem ersten Absatz und keinem Fehler, der erklärt, wohin er verschwunden ist.

**Und manchmal waren die Metadaten der Punkt.** Aus Notiz- und Wissenswerkzeugen exportierte Dateien tragen Eigenschaften im Kopf — Status, Besitzer, Prüfdatum, Tags —, und das ist häufig der Teil, den jemand behalten wollte. Den Block zu entfernen wirft die strukturierte Hälfte des Exports weg und behält nur die Prosa, was ein echter Verlust ist, wenn die Struktur der Grund für die Migration war. Das lohnt sich zu prüfen, bevor Sie in großem Umfang aus [Notion, Obsidian oder Confluence](/blog/markdown-from-notion-obsidian-and-confluence) migrieren, weil diese Werkzeuge sich uneinig sind, ob Eigenschaften als Front Matter herauskommen, als reine `key: value`-Zeilen ohne Trenner, oder gar nicht.

## Was Sie prüfen sollten, bevor Sie die Datei weitergeben

1. **Konvertieren Sie eine echte Datei und schauen Sie auf den Anfang der Ausgabe.** Zehn Sekunden Hinschauen sagen Ihnen, mit welchem der vier Schicksale Sie es zu tun haben, und keine Feature-Liste tut das: eine Linie und eine Überschrift bedeuten, das Werkzeug rendert, eine saubere erste Überschrift bedeutet, es entfernt oder liest, eine Tabelle bedeutet GitHub.
2. **Entscheiden Sie, ob Sie die Metadaten brauchen, bevor Sie das Werkzeug wählen.** Wenn ein Titel, ein Datum oder eine Beschreibung die Ausgabe erreichen muss, brauchen Sie ein Werkzeug aus der vierten Kategorie oder einen eigenen Parse-Schritt, und `gray-matter` vor einen Renderer zu setzen sind zwei Zeilen — billig hinzuzufügen, teuer zu entdecken, dass Sie es vergessen haben, nachdem die Seiten veröffentlicht sind.
3. **Validieren Sie das YAML separat, einmal.** Lassen Sie den Block durch einen eigenständigen YAML-Parser laufen, und Sie fangen den nicht in Anführungszeichen gesetzten Doppelpunkt, den Tab, den Boolean, der früher ein Ländercode war, und die Versionsnummer, die ihre Null verloren hat. Überspringen Sie das, und jedes davon kommt später als Build-Fehlschlag an oder, schlimmer, als falscher Wert, den niemand prüft.
4. **Durchsuchen Sie das Dokument vor dem Konvertieren oder Zusammenfügen nach `---`.** Jeder Treffer ist eine Linie, eine Überschriften-Unterstreichung oder ein Trenner, und welches davon hängt ganz von der Zeile darüber ab. Die beabsichtigten Linien durch `***` zu ersetzen entfernt die Mehrdeutigkeit dauerhaft, und es ist ein Suchen-und-Ersetzen statt eines Projekts.
5. **Einigen Sie sich mit dem, was sie liest, auf die Schlüsselnamen.** `weight` bedeutet Jekyll nichts, `layout` bedeutet Docusaurus nichts, `draft` bedeutet einem einfachen Konverter nichts, und ein unbekannter Schlüssel ist kein Fehler — er ist Stille. Ein Schlüssel, den nichts liest, ist ein Kommentar mit zusätzlichen Schritten, und ein falsch geschriebener Schlüssel, den etwas liest, ist eine Seite, die veröffentlicht wird, wenn Sie das Gegenteil meinten.

## Fazit

Front Matter ist eine Konvention, die ihren Ursprung überwachsen hat, ohne je Teil der Sprache zu werden, der Block am Anfang Ihrer Datei hat also keine definierte Bedeutung und vier mögliche Schicksale. Generatoren lesen ihn, Pandoc liest ihn auf Anfrage, Bibliotheken rendern ihn, weil Rendern der ehrliche Standard für Text ist, den ein Parser nicht erkennt, und GitHub tabelliert ihn für Leser. Zu wissen, welches davon gilt, ist der Unterschied zwischen einer Seite, die mit Ihrer ersten Überschrift beginnt, und einer, die mit einer horizontalen Linie und einer Überschrift voller Doppelpunkte beginnt. Um herauszufinden, was eine bestimmte Datei wird, [konvertieren Sie sie und schauen Sie auf den Anfang](/) — die Antwort zu bekommen dauert weniger Zeit, als darüber zu streiten. Wenn die Metadaten zählen, trennen Sie sie mit einem Parser ab, bevor der Renderer sie sieht, und schreiben Sie Ihre Trennlinien von jetzt an als `***`.

## FAQ

### Was ist Front Matter in einer Markdown-Datei?

Es ist ein Metadatenblock am Anfang der Datei, üblicherweise YAML, eingezäunt von Zeilen aus drei Bindestrichen, mit Dingen wie Titel, Datum, Tags und Layout. Er wurde von Jekyll populär gemacht und seither von fast jedem statischen Seitengenerator kopiert. Er ist nicht Teil der Markdown-Syntax, was der Grund ist, warum Werkzeuge sich darüber uneinig sind.

### Ist Front Matter Teil von CommonMark oder GitHub Flavored Markdown?

Nein. Keine der beiden Spezifikationen erwähnt es, und keine reserviert den `---`-Trenner dafür. Unterstützung ist eine Erweiterung oder Konvention pro Werkzeug, ein streng konformer Parser hat also recht damit, den Block als thematische Trennung gefolgt von einer Setext-Überschrift zu rendern.

### Warum beginnt mein konvertiertes HTML mit einer Linie und einer Überschrift voller Doppelpunkte?

Weil der Konverter keine Front-Matter-Unterstützung hat und den Block wörtlich geparst hat. Das öffnende `---` wurde ein `<hr>`, Ihre `key: value`-Zeilen wurden ein Absatz, und das schließende `---` hat diesen Absatz zu einem `<h2>` unterstrichen. Entfernen Sie den Block vor dem Konvertieren, oder nutzen Sie ein Werkzeug, das ihn erkennt.

### Wie entferne ich Front Matter, bevor ich eine Datei konvertiere?

In JavaScript geben Sie den Text durch `gray-matter` und übergeben dessen `content` an Ihren Renderer. In Python nutzen Sie `python-frontmatter`, oder Python-Markdowns `meta`-Erweiterung, die den Block vor jeder weiteren Verarbeitung entfernt. Mit Pandoc aktivieren Sie `yaml_metadata_block`, damit der Block als Metadaten statt als Inhalt behandelt wird.

### Zeigt GitHub YAML-Front-Matter an?

Ja, als Tabelle über dem Dokument, mit den Schlüsseln als Kopfzeile und den Werten in der Zeile darunter. Das ist eine bewusste Entscheidung statt eines Render-Zufalls, und es bedeutet, eine Datei kann auf GitHub korrekt aussehen und in einem Konverter ohne Front-Matter-Unterstützung als Linie und Überschrift herauskommen.

### Kann ich TOML- oder JSON-Front-Matter statt YAML nutzen?

Sie können, und Sie verengen die Menge der Werkzeuge, die die Datei verstehen. TOML wird mit `+++` eingezäunt, und JSON ist entweder untrennte geschweifte Klammern oder ein `---json`-öffnender Trenner, je nach Werkzeug; die Unterstützung für beide ist deutlich lückenhafter als für YAML. Ein einfacher Markdown-Parser rendert beides als sichtbaren Absatz statt als Linie und Überschrift.

### Wird eine horizontale Linie am Anfang meines Dokuments für Front Matter gehalten?

Das kann passieren. Ein Parser, der nach Front Matter sucht, nimmt das erste `---` als öffnenden Trenner und alles bis zum nächsten `---` als Metadaten, ein Dokument, das mit einer Linie beginnt, kann also seinen ersten Absatz verlieren, ohne dass irgendwo ein Fehler ausgelöst wird. Schreiben Sie Linien als `***` und halten Sie die Mehrdeutigkeit aus Ihren Dateien heraus.
