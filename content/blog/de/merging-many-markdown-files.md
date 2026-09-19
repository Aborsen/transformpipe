---
title: "Aus einem Ordner Markdown-Dateien ein einziges Dokument machen"
description: "Einen Ordner Markdown-Dateien zu einem zusammenführen: Reihenfolge, Überschriftenebenen, dateiübergreifende Links, Bildpfade, Anker, Inhaltsverzeichnis, mit Skripten"
date: 2026-07-16
tag: Konvertieren
keywords: markdown dateien zusammenführen, markdown dateien verbinden, markdown zusammenfügen, mehrere markdown dateien zu einem html, markdown buch aus dateien, markdown inhaltsverzeichnis, markdown überschriften anker, markdown dateien in eine datei, pandoc markdown dateien zusammenführen, markdown inhaltsverzeichnis generator, mdbook summary.md
---

Ein Handbuch lebt selten in einer Datei. Es ist ein Ordner — eine Einleitung, sechs Kapitel, ein Anhang —, damit zwei Menschen gleichzeitig an verschiedenen Teilen arbeiten können. Dann bittet jemand um das Ganze als eine Seite. Die Dateien zu verbinden ist ein `cat` entfernt, und das Ergebnis ist jedes Mal auf die gleiche Handvoll Arten falsch.

### Kurzfassung

`cat *.md > handbuch.md` bringt die Reihenfolge durcheinander, gibt Ihnen ein `<h1>` pro Kapitel, macht aus dem Frontmatter jeder Datei eine verirrte Überschrift und lässt jeden Link, der auf eine Nachbardatei zeigte, ins Leere zeigen. Beheben Sie das in dieser Reihenfolge: entscheiden Sie, wo die Reihenfolge lebt (ein Manifest schlägt numerische Präfixe), stufen Sie jede Überschrift um eine Ebene herab, während Sie Codezäune im Blick behalten, entfernen Sie das Frontmatter beim Einlesen jedes Teils, und schreiben Sie `03-deploy.md#tls` zu `#tls` um, bevor irgendetwas konvertiert wird. Pandoc erledigt die ersten drei mit `--shift-heading-level-by=1`, `--file-scope` und `--toc`. Ab ein paar Dutzend Teilen hören Sie auf zusammenzuführen und nehmen ein Buch-Werkzeug.

Die Fehler haben alle dieselbe Form: Etwas in jeder Datei wurde relativ zu dieser Datei geschrieben, und nach dem Zusammenführen gibt es kein „diese Datei“ mehr. Eine Überschriftenebene war relativ zu einem Dokument, das bei `#` begann. Ein Link war relativ zu einem Verzeichnis. Ein Bildpfad war relativ zu einem Ordner zwei Ebenen tiefer. Eine Anker-ID war innerhalb eines Kapitels eindeutig und nicht über zehn hinweg.

Nichts davon kündigt sich an. Ein zusammengeführtes Dokument stellt sich dar. Es stellt sich nur falsch dar — das Inhaltsverzeichnis springt zum falschen Kapitel, ein Bild ist ein kaputtes Symbol, und ein Link öffnet einen Download-Dialog für eine Datei, die es nicht gibt. Jeden dieser Fehler entdeckt ein Leser, nicht der Build.

Es folgt die ganze Arbeit: eine Reihenfolge, die eine Einfügung übersteht, ein Merge-Skript, das Sie lesen und ausführen können, Link- und Bildumschreibung, Ankerkollisionen, das Inhaltsverzeichnis, was Pandoc schon erledigt, was der Druck braucht, und der Punkt, an dem Zusammenführen das falsche Werkzeug ist und ein Buch das richtige.

## Was bricht, und in welcher Reihenfolge

Arbeiten Sie sie in dieser Abfolge durch. Die Reihenfolge zuerst, weil jede spätere Korrektur voraussetzt, dass Sie wissen, welcher Teil woher kam; Links zuletzt, weil sie die IDs brauchen, die der Konverter am Ende ausgibt.

| Was bricht | Was Sie sehen | Warum | Die Abhilfe |
| --- | --- | --- | --- |
| Reihenfolge | Kapitel 10 vor Kapitel 2 | Ein Glob sortiert Zeichenketten, keine Zahlen | Nullgepolsterte Präfixe, oder ein Manifest |
| Überschriftenebenen | Zehn `<h1>`-Elemente, keine Gliederung | Jeder Teil wurde geschrieben, um für sich zu stehen | Jede Überschrift um eine Ebene herabstufen |
| Codekommentare | `# den Agenten installieren` wird eine Überschrift | Ein blindes `sed` sieht keinen Codezaun | Zaunzustand beim Umschreiben verfolgen |
| Frontmatter | `title: Jobs ausführen` kommt als `<h2>` an | Nichts sucht nach einem Header nach der ersten Datei | Den Block beim Einlesen jedes Teils entfernen |
| Trennzeichen | Ein Kapiteltitel wird zu einer Überschrift | `---` unter einer Textzeile ist Setext-Syntax | Mit `***` trennen |
| Dateiübergreifende Links | Ein Link auf eine Datei, die es nicht mehr gibt | `03-deploy.md#tls` nannte eine Nachbardatei | Zu `#tls` umschreiben |
| Links auf ganze Dateien | Ein Link ohne Fragment, auf das er zielen könnte | `[Bereitstellen](03-deploy.md)` hat keinen Anker | Jeden Dateinamen auf die ID seines Titels abbilden |
| Bildpfade | Ein kaputtes Bildsymbol | Relative Pfade lösen jetzt von der zusammengeführten Datei aus auf | Die Pfade jedes Teils neu verankern, oder sie einbetten |
| Ankerkollisionen | Zwei Überschriften „Überblick“, eine ID | IDs kommen aus dem Überschriftentext | Nach Quelldatei voranstellen, oder umbenennen |
| Fußnoten-IDs | Eine Fußnote landet bei der falschen Notiz | Jeder Teil beginnt seine Nummerierung bei `[^1]` | Pro Datei parsen, oder den Labels ein Präfix geben |
| Inhaltsverzeichnis | Einträge, die nirgendwohin springen | Die Slug-Regel hat anders geraten als der Renderer | Aus der Ausgabe erzeugen, nicht aus der Eingabe |
| Seitenumbrüche | Kapitel laufen im PDF mitten auf der Seite weiter | Markdown hat keine Seitenumbruch-Syntax | Eine CSS-Fragmentierungsregel an jeder Naht |

Der Rest dieses Artikels ist diese Tabelle, Zeile für Zeile, mit dem Code.

## Die Reihenfolge, richtig gemacht

`cat *.md` gibt Ihnen, was der Glob liefert, und ein Glob sortiert Zeichenketten, keine Zahlen: `chapter10.md` kommt vor `chapter2.md`, denn `1` sortiert vor `2`, und der Vergleich hört dort auf. Die Teile in Ordner zu verschachteln ändert nichts. Es gibt drei Orte, an denen die Reihenfolge leben kann, und sie sind nicht gleich gut.

### Numerische Präfixe, und das Problem mit der Nullpolsterung

Polstern Sie das numerische Präfix mit Nullen, und die Sortierung wird zur Lesereihenfolge:

```
handbuch/
  00-einleitung.md
  10-installation.md
  20-konfiguration.md
  30-jobs-ausfuehren.md
  90-anhang-glossar.md
```

Schritte von zehn lassen Platz, später einen Teil einzufügen. Zwei Stellen geben Ihnen hundert Plätze, was mehr ist, als ein Handbuch braucht, und weniger, als ein Dokumentationsset hat; drei Stellen wirken bürokratisch und müssen nie neu nummeriert werden.

Die Polsterung muss einheitlich sein. `9-intro.md` mit `10-setup.md` zu mischen reproduziert den ursprünglichen Fehler in kleinerem Maßstab, denn `1` sortiert immer noch vor `9`. Und später neu zu polstern ist eine Umbenennung jeder Datei, was jeden eingehenden Link, jedes Lesezeichen und die Dateihistorie ungültig macht, der `git log --follow` gefolgt ist. Wählen Sie am ersten Tag eine Breite und behalten Sie sie.

Zwei weitere Kosten sind es wert, genannt zu werden. Präfixe sickern durch: Wird derselbe Ordner auch von einem Generator veröffentlicht, taucht `10-installation` in der URL auf, und es dort zu entfernen ist eine weitere Regel in einer weiteren Konfigurationsdatei. Und Zeichenkettensortierung ist gebietsschemaabhängig — derselbe Glob kann akzentuierte oder gemischt großgeschriebene Dateinamen auf zwei Maschinen unterschiedlich ordnen, ein Unterschied, den niemand bemerkt, bis CI ein Dokument erzeugt, das der Autor nicht reproduzieren kann. GNU coreutils' `sort -V` ist eine „natürliche Sortierung von (Versions-)Zahlen innerhalb von Text“ (geprüft auf man7.org, 9. September 2026), was der Polsterungsfrage vollständig ausweicht — aber es ist nicht auf jedem System, auf dem Ihr Skript laufen wird, prüfen Sie also `sort --version`, bevor ein Build sich darauf verlässt.

### Eine Manifestdatei

Wenn Umbenennen ausscheidet, weil andere Dokumente auf diese Pfade verlinken, oder wenn die Reihenfolge aus irgendeinem Grund vom Alphabet abweichen muss, halten Sie die Reihenfolge in einer Datei fest und lesen Sie die stattdessen ein:

```bash
grep -vE '^[[:space:]]*(#|$)' order.txt | xargs cat > handbuch.md
```

Ein Pfad pro Zeile; Leerzeilen und `#`-Kommentare fallen heraus. Das ist der ganze Mechanismus, und deshalb gewinnt ein Manifest: Die Reihenfolge ist etwas, das man lesen, in einem Pull Request begutachten und kommentieren kann.

Sehr oft hat das Repository schon eines, und ein zweites hinzuzufügen ist, wie die beiden auseinanderdriften:

- **mdBook** benutzt `SUMMARY.md`. „Die Summary-Datei wird von mdBook genutzt, um zu wissen, welche Kapitel einzuschließen sind, in welcher Reihenfolge sie erscheinen sollen, welche Hierarchie sie haben und wo die Quelldateien liegen. Ohne diese Datei gibt es kein Buch.“ (geprüft auf rust-lang.github.io, 9. September 2026)
- **MkDocs** benutzt den `nav`-Schlüssel in `mkdocs.yml`, der „genutzt wird, um Format und Layout der globalen Navigation der Seite zu bestimmen“. Lässt man ihn weg, „enthält `nav` eine alphanumerisch sortierte, verschachtelte Liste aller Markdown-Dateien im `docs_dir`“ — also wieder das Glob-Problem, mit einer Konfigurationsdatei davor. (geprüft auf mkdocs.org, 9. September 2026)
- **Quarto** listet die Teile eines Buchs unter `book: chapters:` in `_quarto.yml` auf. (geprüft auf quarto.org, 9. September 2026)

Jedes davon ist schon die Quelle der Wahrheit. Lesen Sie sie, statt sie zu duplizieren. `SUMMARY.md` ist eine verschachtelte Liste von Markdown-Links, die Pfade kommen also mit einem Ausdruck heraus:

```bash
grep -oE '\]\(([^)]+\.md)\)' SUMMARY.md | sed -E 's|^\]\((.*)\)$|\1|'
```

Die Reihenfolge der Ausgabe ist die Reihenfolge der Datei, die die Reihenfolge des Buchs ist.

### Reihenfolge aus dem Frontmatter

Die dritte Option hält die Reihenfolge innerhalb jedes Teils, als numerischen Schlüssel im eigenen Header:

```yaml
---
title: Jobs ausführen
order: 30
---
```

Die Reihenfolge reist mit der Datei: Verschieben Sie sie, benennen Sie sie um, und sie weiß immer noch, wohin sie gehört. Nichts muss neu nummeriert werden, und es gibt keine zweite Datei zum Vergessen. Das ist ein echter Vorteil, und er wird dreifach bezahlt.

Sie brauchen jetzt einen YAML-Parser zum Sortieren, denn ein `grep` nach `order:` bricht beim ersten Mal, wenn jemand den Wert in Anführungszeichen setzt oder unter einem anderen Schlüssel einrückt. Die Reihenfolge ist unsichtbar — niemand kann die Lesefolge sehen, ohne das Werkzeug laufen zu lassen. Und nichts hindert zwei Teile daran, `order: 30` zu beanspruchen, wobei die Entscheidung dann von dem abhängt, was Ihre Sortierung mit gleichen Schlüsseln macht, was meist die Dateinamensreihenfolge ist und nirgends niedergeschrieben. Was ein Konverter zur Renderzeit mit diesem Header macht, ist eine eigene Frage, und [es gibt vier mögliche Antworten](/blog/front-matter-and-what-converters-do-with-it), von denen Sie nur eine wollen.

### Was zu bevorzugen ist

| Wo die Reihenfolge lebt | Kosten | Scheitert wenn | Am besten für |
| --- | --- | --- | --- |
| Nullgepolsterte Dateinamenspräfixe | Eine Umbenennung zum Einfügen oder Umordnen | Die Polsterung ist inkonsistent, oder das Gebietsschema unterscheidet sich | Einen Ordner, den eine Person besitzt |
| Eine Manifestdatei | Eine Zeile pro neuem Teil hinzufügen | Jemand fügt eine Datei hinzu und vergisst die Zeile | Alles, was in einem Pull Request begutachtet wird |
| Ein Schlüssel im Frontmatter jeder Datei | Ein YAML-Parser im Merge-Skript | Zwei Teile beanspruchen dieselbe Zahl | Dateien, die zwischen Ordnern wandern |

Bevorzugen Sie das Manifest, und bevorzugen Sie das, das das Repository schon hat. Es ist die einzige Option, bei der die Lesereihenfolge ein überprüfbares Artefakt ist statt einer emergenten Eigenschaft, und die einzige, bei der „dieses Kapitel fehlt im Build“ als fehlende Zeile in einem Diff auftaucht statt als Datei, an die niemand gedacht hat. Der Fehlermodus zählt mehr als die Bequemlichkeit: eine vergessene Manifestzeile lässt ein Kapitel still ausfallen, aber das tut auch ein Tippfehler in einem Präfix, und nur einer der beiden ist in einem Code-Review sichtbar.

Benutzen Sie ruhig auch Präfixe — sie machen den Ordner in einer Dateiliste lesbar —, aber lassen Sie das Manifest entscheiden. Reihenfolge aus dem Frontmatter lohnt sich nur, wenn Teile wirklich zwischen Verzeichnissen wandern, was seltener ist, als es klingt.

## Die drei Änderungen, und ein Skript, das sie macht

Jeder Teil braucht auf dem Weg hinein dieselben drei Änderungen: seine Überschriften herabgestuft, sein Frontmatter entfernt, und einen sichtbaren Umbruch davor gesetzt. Hier ist jede einzelne, und dann das Skript, das alle drei in einem Durchgang macht.

### Die Überschriften herabstufen

Jeder Teil wurde geschrieben, um für sich zu stehen, jeder beginnt also mit einem einzigen `#`-Titel. Verketten Sie zehn, und das Dokument hat zehn `<h1>`-Elemente und keine Gliederung.

Es gibt zwei Antworten. Behandeln Sie jedes `#` als Kapiteltitel und setzen Sie nichts darüber, was funktioniert, solange die Datei immer nur ein Stapel von Kapiteln ist. Oder stufen Sie jede Überschrift um eine Ebene herab und fügen einen einzigen `#`-Titel hinzu. `sed 's/^#/##/'` verdirbt dabei Ihren Code: ein Kommentar `# den Agenten installieren` in einem eingezäunten Block wird auch herabgestuft. Verfolgen Sie die Zäune.

Es gibt auch eine Obergrenze. CommonMark setzt die öffnende Folge einer ATX-Überschrift auf „1–6 unmaskierte `#`-Zeichen“, und „mehr als sechs `#`-Zeichen ist keine Überschrift“ (geprüft auf spec.commonmark.org, 9. September 2026) — ein siebtes Doppelkreuz gibt Ihnen einen Absatz, der mit Doppelkreuzen beginnt. Ein Teil, der schon `######` für etwas benutzt, hat also nirgendwohin zu gehen, und der Herabstufungsdurchgang muss die in Ruhe lassen, statt sie still in Text zu verwandeln. In der Praxis sagt Ihnen ein Dokument mit sechs Überschriftenebenen, dass es zwei Dokumente hätte sein sollen.

### Die Teile trennen

Ein sichtbarer Umbruch sagt dem Leser, dass ein Teil endete und ein anderer begann. `***` allein auf einer Zeile wird ein `<hr>`, aber direkt unter einer Textzeile ist es Setext-Syntax und macht diese Zeile zu einem `<h2>`. Trennen Sie die Teile mit `***`: dasselbe `<hr>`, nie eine Überschriftenunterstreichung.

Lassen Sie eine Leerzeile auf beiden Seiten davon. Ein an die letzte Zeile des vorherigen Teils geklebtes Trennzeichen ist derselbe Setext-Unfall auf einem anderen Weg.

### Das Frontmatter entfernen

Dieselben Bindestriche verursachen das letzte Problem. Teile, die für eine statische Seite geschrieben wurden, öffnen mit einem Frontmatter-Block, und nach der ersten Datei sucht nichts mehr nach einem: Das öffnende `---` wird eine Trennlinie, die Schlüssel werden ein Absatz, und das schließende `---` unterstreicht ihn — wieder Setext, `title: Jobs ausführen` kommt also als `<h2>` mitten im Dokument an. Das ist das Rendering-Ergebnis, und Sie bekommen es immer, sobald nichts mehr nach dem Block sucht.

Entfernen Sie ihn beim Einlesen jedes Teils, und nur ganz am Anfang der Datei, damit ein `---`-Trennzeichen weiter unten erhalten bleibt:

```bash
awk 'NR == 1 && /^---$/ { fm = 1; next }
     fm && /^---$/       { fm = 0; next }
     !fm                 { print }' "$file"
```

Wenn die Titel in diesen Headern es wert sind, behalten zu werden — und das sind sie meist, weil es die Kapitelnamen sind —, ziehen Sie sie heraus, bevor Sie den Block verwerfen, und geben jeden als Überschrift aus. Das ist die Version, die zu schreiben ist, wenn die Teile nicht schon mit einem eigenen `#`-Titel beginnen.

### Das Skript, in Shell

Dies liest ein Manifest, entfernt das Frontmatter jedes Teils, stuft seine Überschriften außerhalb von Codezäunen herab und setzt eine Trennlinie zwischen die Teile.

```bash
#!/bin/sh
# merge.sh — ein Dokument aus einem Manifest von Markdown-Teilen.
set -eu

manifest=${1:-order.txt}
out=${2:-handbuch.md}
: > "$out"

grep -vE '^[[:space:]]*(#|$)' "$manifest" | while IFS= read -r part; do
  if [ -s "$out" ]; then printf '\n***\n\n' >> "$out"; fi

  awk '
    # Ein Frontmatter-Block, aber nur ganz am Anfang der Datei.
    NR == 1 && /^---[[:space:]]*$/ { fm = 1; next }
    fm && /^---[[:space:]]*$/      { fm = 0; next }
    fm                             { next }

    # Zäune verfolgen, damit nichts innerhalb eines Codeblocks umgeschrieben wird.
    /^[[:space:]]*(```|~~~)/ { fence = !fence; print; next }

    # Eine echte Überschrift herabstufen, außer sie ist schon auf der sechsten Ebene.
    !fence && /^#+[ \t]/ {
      hashes = $0
      sub(/[^#].*$/, "", hashes)
      if (length(hashes) < 6) { print "#" $0 } else { print }
      next
    }

    { print }
  ' "$part" >> "$out"

  printf '\n' >> "$out"
done
```

Ein ehrlicher Vorbehalt: `fence` ist eine einzige Flagge, die beide Zaunzeichen abdeckt, sie kippt also bei einer Zeile aus Tilden innerhalb eines mit Backticks eingezäunten Blocks. Das ist selten, und es lohnt sich, es zu wissen, bevor Sie dem Skript ein Kapitel anlasten, dessen Überschriften alle um eine Ebene zu flach herauskamen.

### Dasselbe in Node

Die Shell-Version ist gut für eine feste Pipeline. Sobald Sie Links umschreiben oder Bilder neu verankern müssen, müssen Sie an dem Punkt, an dem Sie umschreiben, wissen, aus welcher Datei jede Zeile kam, und das ist in einem echten Programm viel einfacher:

```js
// merge.mjs — node merge.mjs order.txt handbuch.md
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [manifest = 'order.txt', out = 'handbuch.md'] = process.argv.slice(2);
const root = dirname(manifest);

const parts = readFileSync(manifest, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

// Kein `m`-Flag: `^` ist der Anfang der Zeichenkette, es wird also nur ein
// Block ganz am Anfang der Datei entfernt.
const stripFrontMatter = (text) =>
  text.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/, '');

const demote = (text) => {
  let fenced = false;

  return text.split(/\r?\n/).map((line) => {
    if (/^\s{0,3}(?:`{3,}|~{3,})/.test(line)) {
      fenced = !fenced;
      return line;
    }

    if (fenced) return line;

    const heading = line.match(/^(#{1,6})[ \t]/);
    return heading && heading[1].length < 6 ? `#${line}` : line;
  }).join('\n');
};

const merged = parts
  .map((part) => demote(stripFrontMatter(readFileSync(join(root, part), 'utf8'))).trim())
  .join('\n\n***\n\n');

writeFileSync(out, `${merged}\n`);
```

Das Python-Äquivalent sind dieselben vierzig Zeilen mit `re` und `pathlib`; da ist nichts drin, was eine Bibliothek braucht. Welche Sprache auch immer, halten Sie die drei Transformationen als getrennte Funktionen, die Text nehmen und Text zurückgeben, denn die Link- und Bildumschreibung im nächsten Abschnitt schiebt sich zwischen sie, und Sie werden jede einzeln testen wollen.

Wenn das Zusammenführen bei jedem Commit läuft, behandelt [Markdown von einem Terminal aus konvertieren](/blog/markdown-to-html-from-the-command-line) die CI-Seite, und [einen Ordner Datei für Datei zu konvertieren](/blog/batch-convert-markdown-files) ist die andere Hälfte desselben Problems — die, bei der die Ausgabe als viele Seiten bleibt.

## Dateiübergreifende Links, und die, die Sie übersehen werden

Das ist der Teil, den die meisten Anleitungen auslassen, und es ist der Teil, den Leser zuerst bemerken, denn ein kaputter Link ist ein Klick, der nirgendwohin führt, statt eines Absatzes, der nur leicht daneben aussieht.

Innerhalb des Ordners ist `[Wiederholungen](30-running-jobs.md#retries)` korrekt. Nach dem Zusammenführen liegt das Ziel im selben Dokument, und der Dateiname muss weg, sonst zeigt der Link auf eine Datei, die nicht mehr neben dem Leser liegt:

```bash
sed -E 's|\]\([0-9A-Za-z._/-]+\.md#|](#|g' handbuch.md > tmp && mv tmp handbuch.md
```

Das behandelt die häufige Form. Es gibt vier weitere, und jede muss laut ausgesprochen werden.

**Ein Link auf eine ganze Datei.** `[bereitstellen](03-deploy.md)` hat kein Fragment zu behalten, es gibt also nichts, worauf ein regulärer Ausdruck es umschreiben könnte. Er braucht die ID des eigenen Titels dieser Datei, was bedeutet, beim Lesen der Teile eine Abbildung aufzubauen — Dateiname auf die ID ihrer ersten Überschrift — und sie in einem zweiten Durchgang zu konsultieren. Das ist der Grund, das Zusammenführen in einer Sprache mit einem Wörterbuch darin zu schreiben.

**Links im Referenzstil.** `[retries]: 30-running-jobs.md#retries` steht am Ende der Datei in einem Definitionsblock, und das Inline-Muster oben berührt es nie. Es braucht eine eigene Regel, verankert am Zeilenanfang:

```bash
sed -E 's|^(\[[^]]+\]:[[:space:]]*)[0-9A-Za-z._/-]+\.md#|\1#|' handbuch.md > tmp && mv tmp handbuch.md
```

**Rohe HTML-Links.** `<a href="30-running-jobs.md">` läuft unangetastet durch den Parser, denn Markdown lässt rohes HTML absichtlich durch. Kein Markdown-bewusster Umschreiber wird das finden. Grep-en Sie nach `href=` sowohl in der Quelle als auch in der Ausgabe.

**Kodierte und geklammerte Ziele.** Ein Pfad mit einem Leerzeichen kommt als `](<03 deploy.md#tls>)` oder `](03%20deploy.md#tls)` an, und keines passt zu einer Zeichenklasse, die keine Leerzeichen und keine Prozentzeichen angenommen hat. Dateinamen mit Leerzeichen zu verbieten lohnt sich allein aus diesem Grund.

### Die zu finden, die Sie übersehen haben

Trauen Sie der Umschreibung nicht. Prüfen Sie das zusammengeführte Markdown auf alles, was noch auf eine Datei zeigt:

```bash
grep -nE '\]\([^)#][^)]*\.md' handbuch.md
grep -n 'href="' handbuch.md
```

Prüfen Sie dann das konvertierte HTML, wo es tatsächlich zählt. Jeder interne Link sollte ein Ziel mit dieser ID haben, und die beiden Listen sind vergleichbar:

```bash
grep -oE 'href="#[^"]+"' handbuch.html | sed -E 's/.*"#(.*)"/\1/' | sort -u > gewuenscht
grep -oE 'id="[^"]+"'    handbuch.html | sed -E 's/.*"(.*)"/\1/'  | sort -u > vorhanden
comm -23 gewuenscht vorhanden
```

`comm -23` gibt die Zeilen aus, die nur in der ersten Datei stehen: jeder Fragment-Link, der nichts hat, worauf er landen kann. Ein leeres Ergebnis heißt, die Prüfung besteht. Nehmen Sie sie in den Build auf, denn sie kostet nichts, und sie ist die einzige dieser Prüfungen, die sich nicht von einem Dokument täuschen lässt, das sich darstellt.

### Bildpfade nach dem Zusammenführen

`![Ablauf](img/flow.png)` in `handbuch/kapitel/03-deploy.md` löst gegen `handbuch/kapitel/` auf. Verschieben Sie diese Zeile nach `handbuch.md` an der Wurzel des Repositorys, und der Browser sucht nach `img/flow.png` neben der zusammengeführten Datei, findet nichts und zeichnet das kaputte Bildsymbol. Nichts an der Zeile hat sich geändert; nur das, worauf sie sich bezog.

Jedes relative Bildziel muss also vom eigenen Verzeichnis des Teils auf das der Ausgabe neu verankert werden. Im Node-Skript, an dem Punkt, wo Sie beide schon kennen:

```js
import { relative, sep } from 'node:path';

const rebaseImages = (text, from, to) =>
  text.replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (match, head, target) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(target)) return match;
    return head + relative(to, join(from, target)).split(sep).join('/');
  });
```

Der Schutz lässt absolute Pfade, Fragmente und alles mit einem Schema in Ruhe; das `split(sep).join('/')` ist da, weil Windows Backslashes zurückgibt und eine URL kein Dateisystempfad ist. Führen Sie es vor der Linkumschreibung aus, und nur über Bildziele, damit es nicht mit dem Durchgang kollidiert, der `.md#`-Links in Fragmente verwandelt.

Die Pfade richtigzustellen macht das zusammengeführte Markdown korrekt. Es macht das HTML nicht portabel: Die Datei funktioniert immer noch nur, solange diese Bilder richtig daneben liegen, was sie nicht tun werden, nachdem jemand sie per E-Mail verschickt hat. Die Abhilfe ist, die Bilder als Daten-URIs einzubetten, oder mit etwas zu konvertieren, das eine eigenständige Datei erzeugt — [welche Ihrer Bilder und Links noch funktionieren, nachdem die Datei sich bewegt hat](/blog/images-and-links-that-still-work), ist die ganze Frage, und es lohnt sich, sie zu klären, bevor Sie irgendetwas verschicken.

## Ankerkollisionen, und was jeder Renderer damit macht

Überschriften-IDs kommen aus dem Überschriftentext, ein `## Überblick` im Installationskapitel und ein `## Überblick` im Jobs-Kapitel wollen also beide die ID `ueberblick`. In zehn von vier Personen geschriebenen Kapiteln werden „Überblick“, „Konfiguration“, „Fehlerbehebung“ und „Beispiele“ alle mehr als einmal auftauchen. Jedes davon ist eine Kollision.

Was als Nächstes passiert, hängt vollständig davon ab, was die Datei konvertiert.

| Was sie darstellt | Was das zweite „Überblick“ bekommt | Quelle |
| --- | --- | --- |
| github-slugger, die Regel, der GitHubs eigene Anker folgen | `overview-1`, dann `overview-2` | `slugger.slug('foo')` gibt `foo` zurück, dann `foo-1`; ISC-Lizenz (geprüft auf github.com, 9. September 2026) |
| markdown-it-anchor | `overview-1` | Automatisch erzeugte IDs „hängen bei Kollision immer noch ein Suffix an“; `uniqueSlugStartIndex` ist standardmäßig 1; Unlicense (geprüft auf github.com, 9. September 2026) |
| Pandoc mit `--file-scope` | Eine ID mit Präfix aus dem Dateinamen | „Präfixe basierend auf den Dateinamen werden zu Bezeichnern hinzugefügt, um sie zu unterscheiden, und interne Links werden entsprechend angepasst“ (geprüft auf pandoc.org, 9. September 2026) |
| Ein Konverter ohne Deduplizierung | Dieselbe ID, zweimal, in einem Dokument | Der Browser springt zu der, die zuerst kommt |

Jedes dieser Verhaltensweisen ist vertretbar, und keine zwei davon stimmen überein. Ein Link geschrieben als `[siehe](#overview)` ist also über Werkzeuge hinweg unvorhersehbar: auf dem einen erreicht er den Abschnitt des ersten Kapitels, auf dem anderen erreicht er ein Element, das nur existiert, weil das Werkzeug gezählt hat, und auf einem dritten erreicht er eine doppelte ID, über die die Spezifikation nie etwas versprochen hat. Schlimmer noch, das Suffix hängt von der Dokumentreihenfolge ab, ein eingefügtes Kapitel nummeriert also jede Kollision danach neu durch und lenkt still Links um, die früher funktioniert haben.

Drei Abhilfen, die beste zuerst.

**Machen Sie die Überschriften eindeutig.** `## Den Agenten konfigurieren` und `## Einen Job konfigurieren` sind unabhängig vom Zusammenführen die bessere Dokumentation, und sie beseitigen das Problem, statt es zu verwalten. Ein Leser, der ein Inhaltsverzeichnis mit zehn identischen „Überblick“-Einträgen überfliegt, ist mit keiner Menge an Suffixen geholfen.

**Präfix nach Quelldatei zur Merge-Zeit.** Wenn Umbenennen nicht infrage kommt, schreiben Sie jede Überschrift beim Einlesen so um, dass ihre ID den Teil trägt, aus dem sie kam — `deploy-ueberblick`, `installation-ueberblick`. Wo die Syntax verfügbar ist, ist eine explizite ID auf der Überschrift exakt:

```
## Überblick {#deploy-ueberblick}
```

Diese abschließende geschweifte Klammer ist eine Erweiterung, kein CommonMark: Pandoc unterstützt sie, und in der JavaScript-Welt braucht es dafür ein Plugin. Tut Ihr Konverter das nicht, geben Sie stattdessen dem Überschriftentext ein Präfix, oder akzeptieren Sie die eigene Deduplizierung des Werkzeugs und erzeugen das Inhaltsverzeichnis aus der Ausgabe, damit beide übereinstimmen.

**Lesen Sie die IDs, die der Konverter erzeugt hat.** Raten Sie nicht die Slug-Regel. Konvertieren Sie einmal, sehen Sie sich das HTML an, und nehmen Sie die IDs von dort. TransformPipe stellt jeder Überschriften-ID `doc-` voran, und sein HTML-Quelltext-Tab zeigt die genaue Datei — ein konkretes Beispiel für den allgemeinen Punkt, dass die einzig verlässliche Slug-Regel die ist, die Sie in der Ausgabe lesen können.

Dieselbe Kollision trifft Fußnoten, was Leute viel später bemerken. Jeder Teil mit Fußnoten beginnt bei `[^1]`, ein zusammengeführtes Dokument hat also vier `[^1]`-Definitionen und vier Referenzen, die alle zu der auflösen, die der Parser behalten hat. Entweder parsen Sie jede Datei getrennt, wofür genau `--file-scope` von Pandoc da ist, oder geben Sie den Labels beim Einlesen jedes Teils ein Präfix.

## Das Inhaltsverzeichnis

Mit den herabgestuften Teilen ist jedes `##` ein Kapitel — ein Inhaltsverzeichnis, das darauf wartet, erzeugt zu werden. Es gibt vier Wege dorthin, und die entscheidende Frage ist in jedem Fall dieselbe: Passt das Ziel des Eintrags zu der ID, die der Renderer tatsächlich ausgeben wird?

| Weg | Was er kostet | Wann er richtig ist |
| --- | --- | --- |
| Von Hand | Er veraltet still, und niemand merkt es monatelang | Fünf Kapitel, die sich nicht ändern werden |
| Zur Merge-Zeit erzeugt | Sie besitzen die Slug-Regel, und sie muss zu der des Konverters passen | Das Zusammenführen ist schon ein Skript |
| doctoc | Eine Node-Installation; es schreibt in die Datei zwischen Markern | Eine README in einem Git-Repository, bei jedem Commit aufgefrischt |
| markdown-toc | Eine Node-Installation; ein `<!-- toc -->`-Marker | Dieselbe Arbeit, wenn Sie diesen Marker-Stil bevorzugen |
| Vom Konverter | Nichts, und die IDs sind garantiert passend | Sie konvertieren ohnehin nach HTML |

**Zur Merge-Zeit erzeugt.** Laufen Sie einmal durch die zusammengeführte Datei, außerhalb von Zäunen, und geben Sie pro Überschrift einen Eintrag aus:

```bash
awk '/^```/ { fence = !fence; next }
     !fence && /^## / {
       title = substr($0, 4)
       slug  = tolower(title)
       gsub(/[^a-z0-9 -]/, "", slug)
       gsub(/ /, "-", slug)
       printf "- [%s](#%s)\n", title, slug
     }' handbuch.md
```

Diese Slug-Regel — Kleinschreibung, Satzzeichen weg, Leerzeichen zu Bindestrichen — hält für deutsche Überschriften nicht ohne Weiteres, weil Umlaute nicht als ASCII-Kleinbuchstaben durchgehen, und sie weicht bei Duplikaten ab. Sie nimmt auch an, dass die ID der bloße Slug ist: Ein Konverter, der IDs mit Präfix versieht, will dieses Präfix im Link. Erzeugte Einträge und Überschriften kommen aus demselben Text, ein umbenanntes Kapitel benennt also seinen Eintrag um.

**doctoc** „erzeugt Inhaltsverzeichnisse für Markdown-Dateien innerhalb eines lokalen Git-Repositorys. Links sind kompatibel mit Ankern, die von GitHub oder anderen Seiten erzeugt werden“. Installieren Sie es mit `npm install -g doctoc`, markieren Sie die Stelle mit `<!-- START doctoc -->` und `<!-- END doctoc -->`, und führen Sie `doctoc handbuch.md` aus; `--github`, `--maxlevel` und `--title` steuern den Anker-Stil, die Tiefe und die Überschrift, die es über die Liste schreibt. MIT-lizenziert (geprüft auf github.com, 9. September 2026).

**markdown-toc** erledigt dieselbe Arbeit mit einem kürzeren Marker: Setzen Sie `<!-- toc -->`, wo Sie die Liste wollen, und führen Sie `markdown-toc -i handbuch.md` aus, um sie an Ort und Stelle zu schreiben, zwischen `<!-- toc -->` und `<!-- tocstop -->`. Installieren Sie mit `npm install -g markdown-toc`. MIT-lizenziert (geprüft auf github.com, 9. September 2026).

Beide zielen auf GitHubs Anker, was genau richtig ist, wenn die zusammengeführte Datei auf GitHub gelesen wird, und genau falsch, wenn sie durch einen Konverter mit anderer ID-Regel läuft. Das ist die Falle: Ein gegen eine Slug-Regel erzeugtes und von einer anderen dargestelltes Inhaltsverzeichnis erzeugt eine Seite, auf der jeder Eintrag ein Link ist und keiner die Seite bewegt.

**Vom Konverter** vermeidet die Diskrepanz konstruktionsbedingt, denn das Werkzeug, das die Überschriften nummeriert, ist das Werkzeug, das die Liste schreibt. Ist HTML ohnehin das Ziel, ist das die billigste korrekte Antwort.

Welchen Weg auch immer, gehen Sie die zusammengeführte Datei einmal durch, bevor Sie sie versenden:

- [ ] Kein `#` innerhalb eines Codeblocks wurde herabgestuft
- [ ] Kein `.md)` blieb in irgendeinem Link
- [ ] Jeder Inhaltsverzeichnis-Eintrag springt irgendwohin
- [ ] Jedes Bild lädt, mit verschobenem Ordner
- [ ] Die `comm -23`-Prüfung oben gibt nichts aus

## Pandocs eigene Antworten, und der Druckfall

Pandoc behandelt mehrere dieser Probleme mit Flags, was ein guter Grund ist, danach zu greifen, bevor man ein Skript schreibt — und ein guter Grund, genau zu wissen, welche Probleme es Ihnen überlässt.

Bei mehreren Eingaben wird „pandoc sie alle verketten (mit Leerzeilen dazwischen), bevor geparst wird“, die Reihenfolge ist also immer noch Ihre Aufgabe: Listen Sie die Dateien in der gewünschten Reihenfolge auf, oder expandieren Sie ein Manifest in die Kommandozeile. Die nützlichen Flags:

| Flag | Was das Handbuch sagt |
| --- | --- |
| `--shift-heading-level-by` | „Überschriftenebenen um eine positive oder negative Ganzzahl verschieben. Mit `--shift-heading-level-by=-1` werden zum Beispiel Überschriften der Ebene 2 zu Überschriften der Ebene 1, und Überschriften der Ebene 3 zu Ebene 2.“ |
| `--file-scope` | „Jede Datei einzeln parsen, bevor sie für mehrteilige Dokumente kombiniert werden. Das erlaubt Fußnoten in verschiedenen Dateien mit denselben Bezeichnern, sich wie erwartet zu verhalten.“ |
| `--toc` | „Ein automatisch erzeugtes Inhaltsverzeichnis … in das Ausgabedokument einschließen.“ |
| `--toc-depth` | „Die Anzahl der Abschnittsebenen im Inhaltsverzeichnis angeben. Der Standard ist 3.“ |
| `--number-sections` | „Abschnittsüberschriften in LaTeX-, ConTeXt-, HTML-, Docx-, ms- oder EPUB-Ausgabe nummerieren. Standardmäßig werden Abschnitte nicht nummeriert.“ |

(Alle geprüft auf pandoc.org, 9. September 2026.)

`--shift-heading-level-by=1` ist der Herabstufungsdurchgang, richtig gemacht: Er läuft auf dem geparsten Dokument, ein `#` innerhalb eines eingezäunten Blocks ist also ein Kommentar in einem Codebeispiel und bleibt in Ruhe. Das ist der ganze Grund, warum das obige awk eine Zaunflagge brauchte und dies nicht. `--file-scope` ist die Anker- und Fußnotenkorrektur, und es geht über Deduplizierung hinaus — es stellt IDs mit Präfixen aus den Dateinamen voran und passt interne Links entsprechend an, was das oben beschriebene Präfixieren zur Merge-Zeit gratis dazugibt.

Ein brauchbares Zusammenführen ist also ein Befehl:

```bash
pandoc --standalone --toc --toc-depth=2 --file-scope \
  --shift-heading-level-by=1 \
  --metadata title="Handbuch" \
  $(grep -vE '^[[:space:]]*(#|$)' order.txt) \
  -o handbuch.html
```

Was es nicht tut: Ihre Bildpfade neu verankern, oder einen Link `03-deploy.md#tls` außerhalb der Anpassung von `--file-scope` umschreiben. Und Frontmatter ist eine Frage des Readers: Pandocs eigener Markdown-Dialekt liest einen YAML-Metadatenblock als Metadaten statt als Text, was den Setext-Unfall verschwinden lässt, aber die Erweiterungsmenge hängt vom gewählten Reader ab — prüfen Sie das, bevor Sie sich darauf verlassen. Ist Pandoc mehr Werkzeug, als diese Arbeit braucht, [stehen die kleineren Optionen hier](/blog/pandoc-alternatives-for-markdown-to-html).

### Wenn das Ziel ein PDF ist

Ein zusammengeführtes Handbuch ist sehr oft auf dem Weg zum Druck, und der Druck hat eine Anforderung, die der Bildschirm nicht hat: Kapitel beginnen auf einer neuen Seite. Markdown hat keine Seitenumbruch-Syntax, der Umbruch muss also aus dem HTML oder aus der PDF-Engine kommen.

Über einen Browser oder einen beliebigen HTML-zu-PDF-Renderer ist es eine CSS-Fragmentierungsregel. Setzen Sie statt des `***` einen Marker an jede Naht:

```html
<div class="chapter-break"></div>
```

und setzen Sie die Regeln im Stylesheet:

```css
@page { size: A4; margin: 20mm; }

.chapter-break { break-before: page; }
h1, h2, h3 { break-after: avoid-page; }
p { orphans: 3; widows: 3; }
```

`break-before: page` beginnt das nächste Kapitel auf einem frischen Blatt. `break-after: avoid-page` auf den Überschriften verhindert, dass ein Kapiteltitel am Fuß einer Seite gestrandet ist, während sein erster Absatz umseitig steht — das häufigste hässliche Ergebnis beim Drucken eines zusammengeführten Dokuments. `orphans` und `widows` tun dasselbe für Absätze. Ältere Engines wollen zusätzlich die alte Schreibweise `page-break-before: always`; beide zu setzen schadet nicht.

Ein rohes `\newpage` erreicht nur ein LaTeX-basiertes PDF, es ist also die richtige Antwort durch Pandocs LaTeX-Writer und tut durch einen Browser überhaupt nichts. [Jeder Weg von Markdown zu PDF, und was jeder kostet](/blog/markdown-to-pdf) ist die längere Version dieser Entscheidung.

## Wenn es ein Buch ist, kein Dokument

Zusammenführen ist richtig, wenn die Ausgabe eine Seite ist. Es hört auf, richtig zu sein, sobald Sie nummerierte Kapitel wollen, Querverweise, die eine Umordnung überstehen, oder ein Suchfeld — und die ehrliche Version dieses Satzes ist, dass ein zusammengeführtes Handbuch einen Navigationsmechanismus hat, das Inhaltsverzeichnis oben, und ein Leser elf Bildschirme weiter unten keine Ahnung hat, wo er ist.

Ab einer bestimmten Größe ist die zusammengeführte Datei ein Buch, das ein Dokument vorgibt zu sein. Die Symptome sind konkret: Das Merge-Skript hat einen Link-Umschreibungsdurchgang, einen ID-Präfix-Durchgang und einen Inhaltsverzeichnis-Generator angesetzt bekommen, es ist also ein statischer Seitengenerator ohne Tests geworden; zwei Kapitel umzuordnen bedeutet, alles neu laufen zu lassen und jeden Anker neu zu prüfen; und die Ausgabe ist groß genug, dass das Öffnen einen sichtbaren Moment dauert.

Ein Buch-Werkzeug löst Reihenfolge, Anker und Navigation für Sie und berechnet dafür einen Build-Schritt.

| Werkzeug | Reihenfolge kommt aus | Ausgabe | Lizenz |
| --- | --- | --- | --- |
| mdBook | `SUMMARY.md` | Eine statische Seite, in Rust geschrieben | MPL 2.0 |
| MkDocs | `nav` in `mkdocs.yml` | Eine statische Seite, in Python geschrieben | BSD 2-Clause |
| Quarto | `chapters:` in `_quarto.yml` | HTML, PDF, Typst, Word, EPUB, AsciiDoc | MIT |
| Honkit | Ein Quellbaum im GitBook-Stil | Eine Website oder ein E-Book: PDF, EPUB, MOBI | Apache 2.0 |
| Pandoc | Die Reihenfolge, in der Sie die Dateien auflisten | Was auch immer auf seiner eigenen Formatliste steht: HTML, PDF, EPUB, Word und mehr | GPL |

(Lizenzen und Ausgaben geprüft auf rust-lang.github.io, mkdocs.org, quarto.org, pandoc.org und github.com, 9. September 2026. Honkit ist ein Fork von GitBook Legacy.)

Was das kostet, ist es wert, klar gesagt zu werden, denn „nimm einfach mdBook“ ist ein Rat, der die Hälfte des Problems ignoriert. Sie erwerben eine Toolchain: eine Laufzeitumgebung, die auf jeder Maschine installiert werden muss, die die Dokumentation baut, eine Konfigurationsdatei, die gültig gehalten werden muss, ein Theme, das aktuell gehalten werden muss, und einen CI-Job, der jetzt aus Gründen scheitern kann, die nichts mit irgendetwas zu tun haben, das jemand geschrieben hat. Sie erwerben ein Deployment-Ziel, denn die Ausgabe ist ein Verzeichnis von Dateien, das irgendwo gehostet werden muss. Und Sie verlieren das Artefakt, das Sie ursprünglich wollten — ein Buch-Werkzeug gibt Ihnen eine Website, keine Datei, die Sie an eine E-Mail anhängen können, und wenn jemand nach dem ganzen Handbuch als einer Seite fragt, sind Sie wieder beim Zusammenführen, oder bei welcher Druckansicht das Werkzeug zufällig anbietet.

Die Trennlinie ist nicht die Anzahl der Dateien. Es ist, ob das Dokument einmal gelesen oder darin gelebt wird. Ein jahrelang gepflegtes Handbuch ist besser als Website; eines, das einmal hinausgeht — an einen Kunden, eine Aufsichtsbehörde, einen neuen Kollegen — ist besser zusammengeführt. Wo die Quelle lebt, ist eine getrennte Frage von beidem, und die Antwort darauf ist fast immer das Repository.

## Wie Sie entscheiden, welches Zusammenführen Sie bauen

1. **Entscheiden Sie, wo die Reihenfolge lebt, bevor Sie eine Zeile des Skripts schreiben.** In Dateinamen ist jede Einfügung eine Umbenennung; in einem Manifest ist jeder neue Teil eine Zeile, die sich jemand merken muss hinzuzufügen — und die Folge des Vergessens ist ein Kapitel, das still nicht ausgeliefert wird, was kein Test fängt, es sei denn, Sie schreiben einen, der das Manifest gegen das Verzeichnis vergleicht.
2. **Stufen Sie nach dem Parsen herab, nicht davor.** Ein regulärer Ausdruck über rohen Text kann eine Überschrift nicht von einem Kommentar in einem Shell-Beispiel unterscheiden, verfolgen Sie also entweder den Zaunzustand selbst oder übergeben Sie die Arbeit einem Parser; die Kosten, es falsch zu machen, sind ein Codeblock, der zu einem Gliederungseintrag wird, und er wird oben auf der Seite im Inhaltsverzeichnis stehen.
3. **Schreiben Sie Links und Bildpfade im selben Durchgang um, der jede Datei liest.** Das ist der einzige Moment, in dem Sie wissen, aus welchem Teil eine Zeile kam, was genau das ist, was Sie brauchen, um `03-deploy.md#tls` in `#tls` und `img/flow.png` in `kapitel/img/flow.png` zu verwandeln — tun Sie es später, raten Sie nur.
4. **Machen Sie Überschriften-IDs an der Quelle eindeutig, statt sich auf den Renderer zu verlassen.** Jedes Werkzeug dedupliziert anders und manche gar nicht, ein Dokument, das vom Zähler abhängt, ist also ein Dokument, dessen Links ihre Bedeutung ändern, wenn jemand ein Kapitel einfügt.
5. **Erzeugen Sie das Inhaltsverzeichnis aus der Ausgabe, nicht aus der Eingabe.** Eine mit Ihrer Slug-Regel gebaute und von einem Konverter mit einer anderen dargestellte Liste ist eine Seite voller Links, die alle still scheitern, und stilles Scheitern ist die teure Art.
6. **Öffnen Sie die zusammengeführte Datei irgendwo anders, bevor Sie sie versenden.** Eine andere Maschine, ein anderer Browser, das Netzwerk aus, der Bilderordner zurückgelassen — dieser eine Test fängt kaputte relative Pfade, fehlende Anker und CDN-verlinkte Stile auf einmal, und er dauert eine Minute.
7. **Schreiben Sie auf, bei welcher Größe Sie aufhören zusammenzuführen.** Zwanzig Teile, oder der Tag, an dem ein zweites Ausgabeformat gebraucht wird, oder die erste Anfrage nach Suche: Wählen Sie den Auslöser im Voraus, denn die Alternative ist, ihn achtzehn Monate später als Wartungsproblem zu entdecken.

Beginnen Sie mit den Dateinamen, bevor es zwanzig davon gibt: Die Reihenfolge ist das einzige dieser Probleme, das mit der Zeit schlimmer wird, und das einzige, dessen Korrektur — das Umbenennen — jeden Monat teurer wird, den Sie es liegen lassen. Für das HTML selbst legen Sie die Teile zusammen auf [TransformPipe](/) ab: Mehrere Dateien auf einmal werden zu einem Dokument verkettet, in Reihenfolge, durch eine Trennlinie getrennt, mit den Überschriften-IDs sichtbar im Quelltext-Tab, damit das Inhaltsverzeichnis gegen sie geprüft werden kann, statt geraten zu werden. Von einem Terminal aus druckt `tp push handbuch/*.md --merge --share link` einen Link zum Weitergeben. So oder so ist das Zusammenführen der leichte Teil; die drei Durchgänge über Links, Bilder und Anker sind die Arbeit, und sie sind es, was ein Dokument, das sich darstellt, von einem Dokument unterscheidet, das sich lesen lässt.

## FAQ

### Wie kombiniere ich mehrere Markdown-Dateien zu einer?

Verketten Sie sie in einer bewussten Reihenfolge, und machen Sie dabei drei Änderungen: Entfernen Sie das Frontmatter jedes Teils, stufen Sie seine Überschriften um eine Ebene herab und überspringen Sie dabei Codezäune, und setzen Sie eine `***`-Trennlinie zwischen die Teile. `cat *.md > out.md` macht die Verkettung und keine der Änderungen, weshalb die Ausgabe richtig aussieht und sich falsch verhält.

### Warum steht Kapitel 10 vor Kapitel 2 in meiner zusammengeführten Datei?

Weil ein Shell-Glob Dateinamen als Zeichenketten sortiert, und in einem Zeichenkettenvergleich kommt `1` vor `2`, und der Vergleich hört dort auf. Polstern Sie die numerischen Präfixe mit Nullen, damit jeder Dateiname dieselbe Breite hat, oder halten Sie die Lesereihenfolge in einer Manifestdatei fest und lesen Sie die, statt zu globben.

### Wie verhindere ich, dass jedes Kapitel zu einem H1 wird?

Stufen Sie jede Überschrift um eine Ebene herab und geben Sie dem zusammengeführten Dokument einen eigenen einzigen Titel. Tun Sie es nicht mit `sed 's/^#/##/'`, das auch `#`-Kommentare innerhalb eingezäunter Codeblöcke umschreibt; verfolgen Sie die Zäune, oder nehmen Sie Pandocs `--shift-heading-level-by=1`, das das geparste Dokument verschiebt und daher ein Codebeispiel nicht anrühren kann.

### Was passiert mit Links zwischen den Dateien, nachdem ich sie zusammenführe?

Sie zeigen auf Dateien, die nicht mehr neben dem Leser liegen. Ein Link mit einem Fragment — `03-deploy.md#tls` — wird zu `#tls`; ein Link auf eine ganze Datei braucht die ID des Titels dieser Datei, was bedeutet, beim Lesen der Teile eine Abbildung von Dateiname auf ID aufzubauen. Grep-en Sie danach die zusammengeführte Datei nach `.md)` und das konvertierte HTML nach Fragment-Links ohne passende ID.

### Zwei Kapitel haben dieselbe Überschrift — welcher Anker gewinnt?

Das hängt vom Renderer ab, was das Problem ist. GitHubs Slug-Regel hängt `-1` und `-2` an Wiederholungen an, markdown-it-anchor hängt bei Kollision ebenfalls ein Suffix an, Pandoc unter `--file-scope` stellt IDs ein Präfix aus dem Dateinamen voran, und ein Konverter ohne Deduplizierung gibt dieselbe ID zweimal aus und lässt den Browser zur ersten springen. Benennen Sie die Überschriften um, oder geben Sie ihnen zur Merge-Zeit ein Präfix nach Quelldatei.

### Brauche ich einen statischen Seitengenerator oder ein Buch-Werkzeug?

Nur wenn die Ausgabe ein Satz von Seiten ist statt einer. Ein Buch-Werkzeug gibt Ihnen Reihenfolge, eindeutige Anker, Navigation und Suche im Austausch für eine Toolchain, eine Konfigurationsdatei und einen Build-Schritt, und was es erzeugt, ist ein zu hostendes Verzeichnis — keine Datei, die Sie an eine E-Mail anhängen können. Hat jemand um ein Dokument gebeten, ist Zusammenführen immer noch die richtige Antwort.

### Kann ich Markdown-Dateien zusammenführen, ohne etwas zu installieren?

Ja. Ein browserseitiger Konverter, der mehrere Dateien auf einmal annimmt, verkettet sie in Reihenfolge zu einem Dokument und gibt das HTML zurück, ohne dass etwas installiert oder hochgeladen wird. Der Kompromiss ist, dass die oben beschriebene Link-, Bild- und Ankerumschreibung nicht für Sie erledigt wird, machen Sie diese Durchgänge also zuerst über das Markdown und konvertieren Sie zuletzt.
