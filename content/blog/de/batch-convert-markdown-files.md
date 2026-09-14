---
title: "Mehrere Markdown-Dateien auf einmal konvertieren, ohne Ihren Build zu belügen"
description: "Einen Ordner Markdown-Dateien konvertieren: wie weit ein Glob reicht, wo die Ausgabe landen sollte, und wie man unveränderte Dateien überspringt"
date: 2026-08-12
tag: Automatisierung
keywords: mehrere markdown dateien konvertieren, markdown stapelkonvertierung, ordner markdown dateien konvertieren, markdown batch konvertierung, xargs markdown, makefile markdown zu html, inkrementeller markdown build, markdown in ci konvertieren
---

Eine einzelne Markdown-Datei zu konvertieren ist ein gelöstes Problem. Auf eine Seite legen, oder einen Befehl tippen, und Sie haben HTML. Hundertvierzig davon zu konvertieren, verteilt auf elf Verzeichnisse, von denen vier seit der Migration niemand geöffnet hat, ist eine andere Aufgabe — und es ist nicht dieselbe Aufgabe hundertvierzigmal erledigt.

Der Konverter ist fast nie der Teil, der bricht. Was bricht, ist der Glob, der still ein Unterverzeichnis übersprang, die zwei `index.md`-Dateien, die zu einer `index.html` wurden, der parallele Lauf, dessen Log vier ineinander verwobene Dateien ist, der Build, der Erfolg meldete, weil nur die letzte Konvertierung geprüft wurde, und der siebzehnminütige Job, der jede Datei neu konvertierte, um einen Absatz zu ändern.

Jeder dieser Fehler ist still. Eine Markdown-Tabelle, die nicht geparst werden konnte, erzeugt trotzdem HTML. Eine Datei, die der Glob nie erreichte, erzeugt überhaupt nichts, und nichts sieht genau aus wie nichts falsch.

### Kurzfassung

Lassen Sie die Shell die Dateien finden und ein kleines Skript eine Datei konvertieren, denn eine Schleife, die Sie an einem einzigen Pfad testen können, ist eine Schleife, die Sie debuggen können. Nutzen Sie `find … -print0 | sort -z` statt eines bloßen `*.md`-Globs: Ein Glob rekursiert nicht, sofern Sie `globstar` nicht einschalten, er überspringt gepunktete Verzeichnisse, er reicht dem Konverter das wörtliche Muster weiter, wenn nichts passt, und er trifft die Argumentlängengrenze, bevor ein großes Repository es tut. Bilden Sie den Ausgabepfad mit Parameter-Expansion ab, damit der Baum seine Form behält — `basename` schlägt `docs/api/index.md` und `docs/guide/index.md` auf dieselbe Datei, und der Build endet trotzdem mit null. Entscheiden Sie dann zwei Dinge bewusst: ob ein Fehler bei Datei vierzig den Lauf stoppt oder gesammelt und am Ende gemeldet wird, und ob Sie tatsächlich viele Seiten oder ein Dokument wollen, denn Zusammenführen ist eine andere Aufgabe mit einer anderen Antwort.

## Einen Ordner zu konvertieren ist eine andere Aufgabe

Eine einzelne Konvertierung hat eine Eingabe, eine Ausgabe und ein Ergebnis. Eine Ordnerkonvertierung hat fünf Entscheidungen, die für eine Datei nicht existieren, und die Standardantwort auf jede ist oft genug falsch, um zu zählen.

**Welche Dateien.** „Das ganze Markdown im Repository" klingt eindeutig, bis man es aufschreibt. Zählt `node_modules` dazu? Das `.github`-Verzeichnis? `CHANGELOG.md` im Root? Eine eingebettete Kopie der Dokumentation von jemand anderem? Das symlink-Verzeichnis, das auf ein Geschwister-Checkout zeigt? Jede davon ist eine echte Antwort auf eine echte Frage, und Ihr Glob wird sie für Sie beantworten, ohne es zu sagen.

**In welcher Reihenfolge.** Die Dateireihenfolge zählt nicht, wenn jede Datei ihre eigene Seite wird. Sie zählt vollständig, wenn die Dateien ein Dokument werden, und sie zählt für Reproduzierbarkeit so oder so: Ein Build, dessen Log bei jedem Lauf Dateien in anderer Reihenfolge listet, ist ein Build, den Sie nicht diffen können.

**Wohin die Ausgabe geht.** Neben die Eingabe, oder in einen separaten Baum. Das ist die Entscheidung, die Leute bereuen, denn beides funktioniert beim ersten Lauf, und nur eine übersteht ein Löschen, eine Umbenennung oder einen relativen Link.

**Was passiert, wenn eine scheitert.** Zweihundert Dateien, eine davon fehlgeformt. Stoppen, oder weitermachen und melden? Beides ist vertretbar. Die Standardantwort — weitermachen und mit null enden — ist es nicht.

**Wie oft.** Ein Ordner, der sich einmal pro Woche ändert, muss nicht nächtlich neu konvertiert werden, und ein in einem Pull Request konvertierter Ordner sollte wahrscheinlich nur das konvertieren, was der Branch berührt hat.

Beachten Sie, dass nichts davon den Konverter betrifft. Welchen Sie nutzen, ist eine separate Frage mit [einem eigenen Vergleich](/blog/best-markdown-to-html-converters), und jeder Ansatz unten funktioniert mit jedem von ihnen, solange der Befehl einen Eingabe- und einen Ausgabepfad nimmt und die Wahrheit über seinen Exit-Status sagt.

## Kurzvergleich: die Übersichtstabelle

| Ansatz | Am besten für | Läuft parallel | Kann den Build scheitern lassen | Überspringt unveränderte Dateien |
| --- | --- | --- | --- | --- |
| `for`-Schleife über einen Glob | Ein kurzes Skript, das jemand nächstes Jahr bearbeitet | Nein | Ja, mit `set -e`, bei der ersten fehlerhaften Datei | Nein |
| `find … -exec … +` | Ein Baum unbekannter Tiefe und unbequemer Namen | Nein | Nicht zuverlässig — der Status gehört nicht dem Befehl | Nein |
| `find -print0 \| xargs -0 -P` | Hunderte Dateien, und Wanduhrzeit | Ja | Ja — Exit 123, falls eine Datei scheiterte | Nein |
| GNU parallel | Parallele Arbeit, deren Ausgabe geordnet bleiben muss | Ja | Ja, mit `--halt now,fail=1` | Nein |
| `make` mit einer Musterregel | Ein Ordner, in dem sich die meisten Dateien nicht geändert haben | Ja, mit `make -j` | Ja, stoppt beim ersten gescheiterten Rezept | Ja, per Änderungszeit |
| Ein Node- oder Python-Skript | Ausgabe, die Sie selbst kontrollieren, samt Hülle | Ja, mit Nebenläufigkeitsgrenze | Nur, wenn Sie den Exit-Code selbst setzen | Nur, wenn Sie es selbst implementieren |
| Ein API- oder CLI-Aufruf pro Datei | Ein Runner ohne Toolchain und ohne Installation | Ja, bis zum Ratenlimit | Ja, pro Aufruf | Nein |
| Ein statischer Seitengenerator | Navigation, Suche und dokumentübergreifende Links | Intern | Ja | Meist, über den eigenen Cache |

Alle sind kostenlos. Die Shell-Werkzeuge sind schon auf der Maschine; der Rest trägt die in jedem Abschnitt unten genannten Lizenzen.

## Jede Art, eine Konvertierung über einen Ordner laufen zu lassen

### Eine `for`-Schleife über einen Glob — am besten für ein Skript, das jemand wieder lesen wird

Das Kürzeste, das funktioniert, und die Version, die man zuerst schreibt, denn man kann sie laut vorlesen.

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"
  output="${output%.md}.html"
  mkdir -p "$(dirname "$output")"
  bin/one.sh "$file" "$output"
done
```

| Vorteile | Nachteile |
| --- | --- |
| Lesbar, und offensichtlich, was passieren wird | Sequenziell: Die Wanduhrzeit ist die Summe jeder Datei |
| `set -e` macht den ersten Fehler zum letzten Ereignis | `globstar` ist eine Bash-Option, `sh script.sh` ändert also das Verhalten |
| Keine Abhängigkeit außer der Shell | Überspringt gepunktete Verzeichnisse, sofern nicht auch `dotglob` gesetzt ist |
| Quoting liegt unter Ihrer Kontrolle, an einer Stelle | Ein Glob, der groß genug ist, die Argumentgrenze zu überschreiten, scheitert auch hier |

**Preis:** kostenlos; Bash ist GPL-lizenziert und schon installiert.

**Technische Details**

- `shopt -s globstar` lässt `**` über Verzeichnistrenner hinweg passen; ohne es verhält sich `**` genau wie `*`, und Ihre Unterverzeichnisse werden still übersprungen
- `shopt -s nullglob` lässt eine leere Übereinstimmung zu nichts expandieren, statt dem Konverter die wörtliche Zeichenkette `docs/**/*.md` als Dateiname zu übergeben
- `${file#docs/}` entfernt die Quellwurzel; `${output%.md}.html` tauscht die Endung, ohne Verzeichnisnamen anzufassen
- Führen Sie das Skript mit `bash script.sh` aus, nie mit `sh script.sh` — `shopt` ist nicht portabel, und ein von dash bereitgestelltes `sh` wird es ablehnen

**Für wen ist das?** Für Repositories mit Dutzenden von Dateien, und für jeden, dessen erste Anforderung ist, dass die nächste Person das Skript ändern kann, ohne eine Handbuchseite zu lesen.

### `find … -exec … +` — am besten für einen Baum unbekannter Tiefe

`find` braucht keine Shell-Option zum Rekursieren, verhält sich in jeder Shell gleich, und kümmert sich nicht darum, was in den Dateinamen steht.

```bash
find docs -type f -name '*.md' -exec bin/one.sh {} +
```

| Vorteile | Nachteile |
| --- | --- |
| Rekursion, Filterung und Beschneidung in einem Ausdruck | Die Frage nach dem Exit-Status ist wirklich trüb |
| Übergibt Namen als Argumente, Leerzeichen und Anführungszeichen überleben also | `-printf` und andere nützliche Primäre sind GNU-spezifisch |
| `+` bündelt Argumente, überschreitet die Längengrenze also nicht | Verzeichnisreihenfolge, nicht sortierte Reihenfolge |
| `-prune` schließt einen ganzen Teilbaum günstig aus | Das Skript muss den Ausgabepfad selbst ableiten |

**Preis:** kostenlos; GNU findutils ist GPL-lizenziert, und ein BSD-`find` liefert mit macOS mit.

**Technische Details**

- `-type f` schließt Verzeichnisse aus, die zufällig auf `.md` enden, was seltener ist als ein Symlink darauf, aber nicht selten genug, um es zu ignorieren
- `-exec cmd {} +` übergibt so viele Pfade pro Aufruf, wie hineinpassen; `-exec cmd {} \;` führt einen Prozess pro Datei aus, was langsamer und leichter nachzuvollziehen ist
- Mit `-exec … \;` ändert ein scheiternder Befehl den eigenen Exit-Status von `find` überhaupt nicht, ein so gebauter Job kann also keinen Konvertierungsfehler melden. GNU `find` dokumentiert einen Status ungleich null, wenn ein mit `+` ausgeführter Befehl scheitert, und Implementierungen unterscheiden sich — was der Grund ist, die Statusfrage zu `xargs` zu verlagern, wo sie niedergeschrieben ist
- `find docs -name node_modules -prune -o -type f -name '*.md' -print` ist das Idiom, um einen Teilbaum auszuschließen; `-not -path '*/node_modules/*'` erzielt dasselbe Ergebnis, durchläuft aber trotzdem alles
- `find` folgt Symlinks nicht, sofern Sie nicht `-L` übergeben, und `-L` auf einem Baum mit einem Link zum eigenen Elternverzeichnis übergeben lässt es bis zur Tiefengrenze schleifen

**Für wen ist das?** Für jeden Baum, der tiefer als eine Ebene ist, und jedes Repository, in dem Sie die Dateinamen nicht selbst kontrollieren.

### `find -print0 | xargs -0 -P` — am besten, wenn die Anzahl in die Hunderte geht

Der Standardweg, damit eine Ordnerkonvertierung in einem Bruchteil der Zeit fertig wird, und der Punkt, an dem Sie aufhören, das Log von oben nach unten lesen zu können.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 8 -n 1 bin/one.sh
```

| Vorteile | Nachteile |
| --- | --- |
| Echte Parallelität aus einem Flag | Ausgabe nebenläufiger Jobs verwebt sich, Zeile für Zeile |
| Ein dokumentierter Gesamt-Exit-Status: 123, falls eine Datei scheiterte | `xargs` führt direkt aus, also keine Umleitung oder Globbing im Befehl |
| NUL-Trennung, jeder legale Dateiname überlebt also | Reihenfolgegarantien sind weg, außer Sie sortieren zuerst und drucken danach |
| `-n` steuert die Batch-Größe, was bei kleinen Dateien zählt | Die Fehlerliste muss außerhalb des Bands gesammelt werden |

**Preis:** kostenlos, GPL-lizenziert, Teil von findutils.

**Technische Details**

- `-print0` und `-0` nutzen NUL als Trenner, das eine Byte, das ein Dateiname nicht enthalten kann — ein Zeilenumbruch in einem Dateinamen ist legal und würde sonst einen Pfad in zwei aufteilen
- `sort -z` sortiert NUL-getrennte Datensätze; die eigene Reihenfolge von `find` ist Verzeichnisreihenfolge, was nicht sortiert und zwischen Maschinen nicht stabil ist. Fügen Sie `LC_ALL=C` hinzu, wenn Sie auf einem Runner dieselbe Reihenfolge wie auf Ihrem Laptop wollen
- `xargs` endet mit 123, falls ein Aufruf zwischen 1 und 125 endete, 124, falls einer mit 125 endete, 125, falls einer von einem Signal getötet wurde, 126, falls der Befehl nicht ausgeführt werden konnte, und 127, falls er nicht gefunden wurde. Diese fünf Codes sind das ganze Fehlermeldungsprotokoll, lassen Sie Ihr Skript also mit ungleich null enden und lassen Sie den Gesamtwert sprechen
- `-P 0` startet so viele Prozesse, wie es kann; `-P "$(nproc)"` ist die übliche Wahl unter Linux, und macOS will stattdessen `sysctl -n hw.ncpu`
- `xargs` führt keine Shell aus. `xargs -0 cmd > out.html` leitet den ganzen Lauf in eine Datei um, nicht eine Datei pro Eingabe; brauchen Sie eine Umleitung, packen Sie sie ins Skript
- `-n 1` startet einen Prozess pro Datei. Bei tausend kleinen Dokumenten dominiert der Prozessstart die eigentliche Konvertierung, und ein Skript, das über `"$@"` schleift und mit `-n 20` aufgerufen wird, ist messbar besser — messen Sie Ihren eigenen Baum, statt einem Verhältnis zu vertrauen

**Für wen ist das?** Für Dokumentationssätze in den Hunderten, und für jeden Build, bei dem die Konvertierung zum langsamen Schritt geworden ist.

### GNU parallel — am besten, wenn parallele Ausgabe trotzdem geordnet sein muss

`parallel` ist `xargs` mit ausgefüllter Ergonomie: geordnete Ausgabe, eine Fehlerpolitik, ein Probelauf, und eine Fortschrittsanzeige.

```bash
find docs -type f -name '*.md' -print0 \
  | parallel -0 -k --halt now,fail=1 bin/one.sh {}
```

| Vorteile | Nachteile |
| --- | --- |
| `-k` puffert jeden Job und druckt in Eingabereihenfolge | Eine weitere Installation, und nicht standardmäßig vorhanden |
| `--halt now,fail=1` stoppt den Lauf beim ersten Fehler | Sein Quoting und seine Ersetzungssyntax ist eine eigene Sprache |
| `--dry-run` druckt die Befehle, ohne sie auszuführen | Puffern, um die Reihenfolge zu halten, kostet Speicher und Platte |
| `--joblog` protokolliert Status und Dauer jedes Jobs | Übertrieben, wenn nichts die Standardausgabe liest |

**Preis:** kostenlos, GPL-lizenziert.

**Technische Details**

- `-k` (`--keep-order`) ist das Flag, das es von `xargs` unterscheidet: Jobs laufen immer noch nebenläufig, die Ausgabe bleibt lesbar
- `--halt` nimmt eine Politik — jetzt stoppen oder wenn die laufenden Jobs enden, bei einer Anzahl oder einem Prozentsatz an Fehlern
- `--joblog DATEI` ist die ehrliche Antwort auf „welche Datei ist gescheitert": eine Tabelle mit dem Exit-Status jedes Jobs, die Sie nach dem Lauf durchsuchen können, statt das Log zu lesen
- `{.}` entfernt die Endung aus der Ersetzungszeichenkette, `{//}` gibt das Verzeichnis — nützlich, und ein weiterer Dialekt, den man sich merken muss
- Es druckt eine Bitte, es in akademischer Arbeit zu zitieren, was keine Lizenzbeschränkung ist, aber Leute überrascht, wenn es das erste Mal in einem Build-Log erscheint

**Für wen ist das?** Für Builds, bei denen die Konvertierung etwas druckt, das ein Mensch liest, und für jeden, der eine Pro-Job-Statustabelle will, ohne eine zu schreiben.

### `make` mit einer Musterregel — am besten, wenn sich die meisten Dateien nicht geändert haben

Das einzige Werkzeug auf dieser Liste, das genau für dieses Problem entworfen wurde: eine Menge Ausgaben, abgeleitet aus einer Menge Eingaben, neu gebaut, wenn die Eingabe neuer ist.

```make
MD  := $(shell find docs -type f -name '*.md')
OUT := $(patsubst docs/%.md,build/%.html,$(MD))

build/%.html: docs/%.md tools/wrapper.html
	@mkdir -p $(@D)
	bin/one.sh $< $@

.PHONY: all clean
all: $(OUT)

clean:
	rm -rf build
```

| Vorteile | Nachteile |
| --- | --- |
| Konvertiert nur, was sich geändert hat, ohne eigenen Cache | Rezepte müssen für immer mit einem Tab eingerückt sein |
| `make -j8` parallelisiert kostenlos, unter Beachtung von Abhängigkeiten | Dateinamen mit Leerzeichen sind praktisch nicht unterstützt |
| Eine geänderte Vorlage macht jede Ausgabe korrekt ungültig | Änderungszeiten sind in einem frischen Klon falsch |
| `make clean` und `make one/file.html` gibt es kostenlos | Die Syntax ist wie nichts anderes im Repository |

**Preis:** kostenlos; GNU make ist GPL-lizenziert.

**Technische Details**

- `tools/wrapper.html` rechts vom Doppelpunkt ist der Teil, den Leute weglassen. Ohne ihn ändert das Bearbeiten der Vorlage nichts, denn jede Ausgabe ist immer noch neuer als ihr eigenes Markdown
- `$(@D)` ist das Verzeichnis der Ausgabe, `mkdir -p $(@D)` erstellt den Baum also im Vorbeigehen
- `$(shell find …)` läuft bei jedem Make-Aufruf, eine neu hinzugefügte Datei wird also aufgenommen, ohne das Makefile anzufassen
- `make -j` ohne Zahl läuft mit unbegrenzten Jobs, was auf einem großen Baum hunderte Prozesse gleichzeitig startet; geben Sie eine Zahl an
- Den Konverter selbst als Voraussetzung hinzuzufügen — eine Lockfile, ein gepinntes Binary, eine Versionsstempeldatei — lässt ein Upgrade alles neu bauen, was Sie wollen und was niemand tut

**Für wen ist das?** Für Repositories, in denen der Docs-Baum groß und meist statisch ist, und wo eine vollständige Konvertierung lange genug dauert, dass es jemandem aufgefallen ist.

### Ein Node- oder Python-Skript — am besten, wenn Sie auch die Hülle wollen

An einem gewissen Punkt hört die Shell auf, der richtige Ort zu sein: Sie wollen, dass das `<title>` des Ausgabedokuments aus der Frontmatter der Datei kommt, oder ein Inhaltsverzeichnis, oder einen Link, umgeschrieben von `.md` zu `.html`. Das ist ein Programm, keine Pipeline.

```js
// convert-all.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import fg from 'fast-glob';
import pLimit from 'p-limit';

const files = await fg('**/*.md', { cwd: 'docs', dot: false, absolute: true });
const limit = pLimit(8);
const failures = [];

await Promise.all(
  files.map((file) =>
    limit(async () => {
      try {
        const output = resolve('build', relative(resolve('docs'), file)).replace(/\.md$/, '.html');
        await mkdir(dirname(output), { recursive: true });
        await writeFile(output, render(await readFile(file, 'utf8')));
      } catch (error) {
        failures.push(`${file}: ${error.message}`);
      }
    })
  )
);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
```

| Vorteile | Nachteile |
| --- | --- |
| Die Ausgabe ist ein Dokument, das Sie entworfen haben, kein Fragment | Es gehört Ihnen, samt Bugs |
| Frontmatter, Titel und Link-Umschreiben sind alle erreichbar | Ein Abhängigkeitsbaum zum Fixieren und Prüfen |
| Fehler sammeln sich zu einer Liste statt einer Log-Zeile | Nebenläufigkeit müssen Sie selbst begrenzen |
| Läuft auf jeder Plattform gleich, was die Shell nicht tut | Langsamer beim Start als ein C- oder Rust-Binary |

**Preis:** kostenlos; `fast-glob` und `p-limit` sind MIT-lizenziert.

**Technische Details**

- `pLimit` ist nicht optional. `Promise.all` über dreitausend Dateien öffnet dreitausend Dateihandles, und der Prozess stirbt mit `EMFILE`, was sich wie ein beschädigtes Dateisystem liest und keines ist
- `process.exitCode = 1` statt `process.exit(1)`, damit ausstehende Schreibvorgänge fertig werden, bevor der Prozess endet
- `dot: false` ist die Vorgabe in den meisten Glob-Bibliotheken, was heißt, `.github/CONTRIBUTING.md` ist unsichtbar, bis Sie es anders sagen — dieselbe Falle, die die Shell stellt, an anderer Stelle
- Fehler zu sammeln und am Ende zu melden ist eine Wahl: Es konvertiert alles und lässt den Job trotzdem scheitern. Die Alternative, beim ersten Fehler zu werfen, lässt den Ausgabebaum halb geschrieben zurück

**Für wen ist das?** Für jedes Repository, in dem das HTML fertig aussehen muss, und jede Konvertierung, die etwas über das Dokument wissen muss statt nur über seine Bytes.

### Ein API- oder CLI-Aufruf pro Datei — am besten, wenn nichts installiert ist

Hat der Runner keinen Konverter, und Sie werden ihm keinen geben, ist die Schleife dieselbe Form, und der Körper ist ein Netzwerkaufruf. TransformPipes abhängigkeitsfreies CLI ist ein Beispiel; ein `curl`-Post an jede beliebige Konvertierungs-API ist derselbe Gedanke mit mehr Flags.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 4 -n 1 -I {} tp push {} --share --json
```

| Vorteile | Nachteile |
| --- | --- |
| Kein Konverter zu installieren, zu fixieren oder zu cachen | Braucht das Netzwerk, kann also nicht Ihr Offline-Build sein |
| Jede Datei kommt als Link zurück, den jemand öffnen kann | Braucht ein Geheimnis in der Umgebung |
| Konvertierungsverhalten kann nicht mit einer lokalen Installation abdriften | Raten- und Größenlimits gelten pro Schlüssel |
| Dieselbe Konvertierung in CI wie auf einem Laptop | Ein Dokument pro Datei summiert sich gegen die Kontogrenze |

**Preis:** kostenlos; Konvertieren und Herunterladen brauchen überhaupt kein Konto, und ein Konto fügt Historie, Teilen und die API innerhalb der unten stehenden Grenzen hinzu (geprüft auf transformpipe.com, 8. September 2026).

**Technische Details**

- Die veröffentlichten Grenzen sind die, gegen die Sie planen sollten: 10 MB für eine zu konvertierende Datei, 4 MB für ein im Konto gehaltenes Dokument, 100 MB und 500 Dokumente pro Konto, und 60 Anfragen pro Minute, gezählt pro Schlüssel (geprüft auf transformpipe.com/docs, 8. September 2026)
- Dieses Ratenlimit ist der Grund für `-P 4` statt `-P 32`. Acht parallele Worker auf einer schnellen Verbindung räumen sechzig Anfragen in deutlich unter einer Minute ab und fangen an, 429er zu sammeln, und ein 429 ist ein Fehler, den Ihr Skript als solchen behandeln muss
- `--retry 3 --retry-connrefused` bei `curl`, oder ein Sleep zwischen Batches, deckt den vorübergehenden Fehler ab, der sonst einen Build im Monat brechen würde
- Posten Sie mit `curl` statt einem CLI, ist `-f` tragend: ohne es endet `curl` bei einem 401 oder 429 mit null und schreibt den Fehlertext in Ihre Ausgabedatei
- Hundert Dateien bedeuten hundert Dokumente und hundert Links. Das ist meist nicht, was irgendjemand wollte, was das Thema eines späteren Abschnitts ist

**Für wen ist das?** Für abgeschottete Runner, und Pipelines, deren Ausgabe eine Menge Links statt eine Menge Dateien ist. Für einen Pull Request speziell macht [eine Action dasselbe ohne Installation auf dem Runner](/blog/publish-markdown-from-github-actions).

### Ein statischer Seitengenerator — die Antwort, wenn „viele Dateien" „eine Website" bedeutet

Hugo, Eleventy, MkDocs, Docusaurus und Jekyll konvertieren alle Verzeichnisse von Markdown zu HTML, und keiner davon ist ein Stapelkonverter. Sie sind Build-Systeme, und der Unterschied zeigt sich in dem, was sie Ihnen zurückgeben.

| Vorteile | Nachteile |
| --- | --- |
| Navigation, Suche, Querverweise und eine Indexseite | Eine Konfigurationsdatei, ein Theme und ein Build-Schritt zu pflegen |
| Eigene inkrementelle Builds und Watch-Modi | Die Ausgabe ist eine Website, keine Menge Dokumente, die Sie mailen können |
| Linkprüfung und Taxonomie über den ganzen Satz | Enormer Overhead für vierzig Dateien, die niemand durchblättert |
| Deployment ist für alle ein gelöstes Problem | Das Theme entscheidet, wie Ihre Seiten aussehen |

**Preis:** kostenlos, alle Open Source.

**Für wen ist das?** Für jeden, der Dokumente veröffentlicht, die aufeinander verweisen und gefunden werden müssen. Kommt Ihr Leser mit einer URL an, die Sie ihm gegeben haben, und geht nach einer Seite, brauchen Sie keinen Generator.

## Die sechs Dinge, die an einem Ordner brechen und nicht an einer Datei

Jeder Fehler unten wurde von irgendwem als Konverter-Bug diagnostiziert. Keiner davon ist einer.

### Wie tief ein Glob geht, und was er fallen lässt

`docs/*.md` rekursiert nicht. Das ist der mit Abstand häufigste Stapelkonvertierungs-Bug, und er ist unsichtbar: Der Job konvertiert die neun Dateien oben im Baum, endet mit null, und die vierzig in Unterverzeichnissen werden schlicht nicht erwähnt. Nichts warnt Sie, denn nichts weiß, was Sie meinten.

Bash braucht `shopt -s globstar`, bevor `**` einen Verzeichnistrenner überquert; ohne es ist `docs/**/*.md` genau `docs/*/*.md` — eine Ebene tiefer, nicht mehr und nicht weniger. zsh hat rekursives `**` ohne Option, weshalb sich eine aus der zsh-Historie eines Kollegen kopierte Zeile in Ihrem Bash-Skript anders verhält, und keiner von Ihnen beiden sieht, warum.

Dann gibt es Dateien, auf die ein Glob prinzipiell nicht passt:

| Was übersprungen wird | Warum | Die Abhilfe |
| --- | --- | --- |
| `.github/CONTRIBUTING.md` | Globs passen nicht auf einen führenden Punkt | `shopt -s dotglob`, oder den Pfad benennen |
| `docs/api/reference.md` | `*` überquert kein `/` | `globstar` und `**`, oder `find` |
| `README.MD` | Groß-/Kleinschreibung zählt unter Linux, nicht unter macOS | `find … -iname '*.md'` |
| `notes.markdown` | Eine andere Endung ist ein anderes Muster | `-name '*.md' -o -name '*.markdown'` |
| Alles, wenn nichts passt | Bash reicht das Muster als Literal durch | `shopt -s nullglob` oder `failglob` |
| Gar nichts, in `node_modules` | Der Glob war zu großzügig | `-prune`, bevor der Durchlauf dorthin kommt |

Die letzte Zeile ist der umgekehrte Fehler und schlimmer, als er aussieht. Ein `**/*.md` an der Wurzel des Repositorys erreicht jedes eingebettete README in jedem installierten Paket, und eine Stapelkonvertierung, die anfängt, HTML für den Changelog einer Abhängigkeit zu erzeugen, ist eine, die eine Woche später still gelöscht wird.

Es gibt auch eine harte Grenze. Jeder Pfad, zu dem ein Glob expandiert, wird ein Argument, und die Gesamtgröße der Argumentliste ist vom Kernel gedeckelt — `getconf ARG_MAX` gibt die Zahl aus. Ein Repository, das groß genug ist, sie zu überschreiten, scheitert mit `Argument list too long`, was eine echte Fehlermeldung ist, die sich wie ein Bug in Ihrem Skript anhört. `find … -exec … +` und `xargs` bündeln beide Argumente, um unter der Grenze zu bleiben, und keines expandiert irgendetwas in der Shell, weshalb jedes Beispiel oben pipet statt globbt, sobald die Anzahl unbekannt ist.

Symlinks verdienen einen Satz bewusster Überlegung statt einer Vorgabe. Ob das `**` einer Shell durch ein verlinktes Verzeichnis absteigt, hat zwischen Releases variiert und unterscheidet sich zwischen Shells, enthält Ihr Baum also Links — ein `docs/shared`, das auf ein Geschwister-Checkout zeigt, ist eine übliche Anordnung —, nutzen Sie `find` und entscheiden Sie ausdrücklich, mit `-L` oder ohne. Raten heißt, dasselbe Repository konvertiert auf zwei Maschinen unterschiedliche Dateimengen.

### Die Reihenfolge, in der die Dateien ankommen

`find` gibt Einträge in Verzeichnisreihenfolge zurück. Verzeichnisreihenfolge ist, was das Dateisystem zurückgibt, sie ist nicht sortiert, und sie ist auf zwei Maschinen mit denselben Dateien nicht gleich. Für eine Konvertierung, bei der jede Datei ihre eigene Seite wird, ist das harmlos. Es hört an drei Stellen auf, harmlos zu sein.

Logs hören auf, diffbar zu sein. Ist die Dateiliste eines Builds bei jedem Lauf in anderer Reihenfolge, können Sie zwei Läufe nicht vergleichen, um zu sehen, was sich geändert hat, und genau diesen Vergleich wollen Sie zuerst, wenn ein nächtlicher Job bricht.

Parallele Planung wird nicht reproduzierbar. Mit acht Workern und ohne Sortierung ändert sich, welche Dateien sich einen Worker teilen, zwischen den Läufen, und ebenso, welche das Ratenlimit trifft.

Und Zusammenfügen wird falsch statt bloß unordentlich. Sobald mehrere Dateien ein Dokument werden, ist Reihenfolge Inhalt. Selbst sortiert kommt `10-api.md` vor `2-setup.md`, denn eine lexikalische Sortierung ist keine numerische. Polstern Sie die Zahlen — `02-setup.md`, `10-api.md` — und jedes Werkzeug, das dieses Verzeichnis jemals liest, bekommt die Reihenfolge kostenlos richtig.

```bash
find docs -type f -name '*.md' -print0 | LC_ALL=C sort -z
```

`LC_ALL=C` zählt mehr, als es aussieht. Die Sortierreihenfolge hängt vom Gebietsschema ab, ein Name mit einem Akzent oder einem führenden Unterstrich kann auf einem Runner also anders sortieren als auf Ihrem Laptop, und der ganze Sinn, die Reihenfolge zu fixieren, war, genau das zu verhindern.

### Neben der Eingabe, oder im eigenen Baum

Es gibt zwei Antworten, und sie sind nicht gleichwertig.

| | Ausgabe neben der Eingabe | Ausgabe in einem separaten Baum |
| --- | --- | --- |
| Relative Links zwischen Dokumenten | Funktionieren unverändert weiter | Funktionieren nur, wenn die Baumform erhalten bleibt |
| Bilder mit relativen Pfaden | Lösen sich auf wie zuvor | Brauchen Kopieren oder Einbetten |
| Aufräumen | Dateien nach Muster löschen, vorsichtig | `rm -rf build` |
| Eine gelöschte `.md` | Hinterlässt unbegrenzt eine verwaiste `.html` | Verschwindet beim nächsten sauberen Build |
| Versionskontrolle | `.gitignore`-Einträge, die gegen die Quelldateien kämpfen | Ein ignoriertes Verzeichnis |
| Die Änderung überprüfen | Erzeugtes HTML in jedem Diff | Nichts Erzeugtes im Diff |
| Deployen | Das ganze Repository ausliefern, oder filtern | Den Host auf ein Verzeichnis zeigen lassen |

Neben der Eingabe gewinnt bei Links und Bildern und verliert bei allem anderen. Die Waisen-Zeile ist die, die es für die meisten Leute entscheidet: Nichts in einem Neben-der-Eingabe-Schema bemerkt, dass `docs/old-api.md` gelöscht wurde, `docs/old-api.html` bleibt also auf der Platte, wird committet, deployt, und wird noch ein Jahr später an irgendwen ausgeliefert. Ein separater Baum, der gelöscht und neu gebaut wird, kann dieses Problem nicht haben, denn die Antwort auf „welche Ausgaben sind veraltet" ist „alle, jedes Mal".

Nutzen Sie einen separaten Baum, behalten Sie seine Form, und nutzen Sie Parameter-Expansion statt `basename`, um das zu tun. `basename` ist hier das falsche Werkzeug, und es scheitert auf die schlimmstmögliche Weise: `docs/api/index.md` und `docs/guide/index.md` werden beide zu `index.html`, das zweite überschreibt still das erste, der Build endet mit null, und welche Seite überlebt, hängt von der Reihenfolge ab, in der die Dateien ankamen — die, laut obigem Abschnitt, nicht fixiert ist.

Das Umschreiben der Links ist der Teil ohne Shell-Lösung. Ein Link auf `../guide/index.md` in Ihrem Markdown übersteht die Konvertierung nur, wenn der Ausgabebaum den Eingabebaum spiegelt und das `.md` im Ziel zu `.html` umgeschrieben wird. Konverter tun das nicht standardmäßig; die meisten lassen den Link genau so stehen, wie geschrieben, zeigend auf eine Datei, die nicht mehr neben der Seite liegt. Das ist ein Programm, keine Pipeline — und [was bricht, wenn ein Dokument sich bewegt](/blog/images-and-links-that-still-work) gilt auch für jeden Bildpfad im Ordner.

### Parallelität, und die Reihenfolge, auf die Sie verzichten

Konvertierung ist eine kleine Menge Arbeit pro Datei und ein Prozessstart pro Datei. Das macht sie nahe der idealen parallelen Arbeitslast, und die Beschleunigung durch `-P` ist real. Was Sie dafür eintauschen, ist jede Reihenfolgegarantie, die Sie hatten.

Standardausgabe verwebt sich. Nicht pro Job — pro Schreibvorgang. Zwei Konverter, die im selben Moment eine dreizeilige Warnung drucken, erzeugen sechs Zeilen in einer Reihenfolge, die keiner von beiden gewählt hat, und so ein Log kann man nicht lesen. Drucken die Jobs irgendetwas, nutzen Sie entweder `parallel -k`, oder lassen Sie jeden Job seine eigene Log-Datei schreiben und fügen Sie sie danach sortiert zusammen.

Geteilter Zustand funktioniert nicht so, wie es aussieht. Jeder `xargs`-Aufruf ist ein separater Prozess, ein in der Schleife hochgezählter Zähler wird also in einer Subshell hochgezählt und ist weg. Fehler an eine gemeinsame Datei anzuhängen funktioniert, braucht aber Sorgfalt beim Verweben; die Version, bei der es nichts zu überlegen gibt, ist eine kleine Datei pro Fehler in einem Verzeichnis, am Ende gezählt:

```bash
# in bin/one.sh
if ! convert "$1" "$2"; then
  mkdir -p build/.failed
  printf '%s\n' "$1" > "build/.failed/$(printf '%s' "$1" | tr / _)"
  exit 1
fi
```

Mehr Worker ist nicht monoton besser. Ab dem Punkt, an dem die CPUs ausgelastet sind, fügen zusätzliche Prozesse nur Konkurrenz hinzu und nichts sonst; und ist der Körper Ihrer Schleife ein Netzwerkaufruf, fügen zusätzliche Worker 429er hinzu. Vier gleichzeitige Anfragen gegen ein Limit von sechzig pro Minute sind bequem. Zweiunddreißig sind ein Ratenlimit-Test mit angehängtem Build.

Die Batch-Größe ist der Parameter, den Leute vergessen. `-n 1` startet einen Prozess pro Datei, und bei kleinen Dokumenten kann der Prozessstart mehr kosten als die Konvertierung. Ein Skript, das über `"$@"` schleift und mit `-n 20` aufgerufen wird, startet ein Zwanzigstel so viele Prozesse. Ob das hilft, hängt von Ihren Dateien und Ihrem Konverter ab, messen Sie also beides — und messen Sie zweimal, denn der erste Lauf liest kalt und der zweite aus dem Seiten-Cache, was ein Unterschied groß genug ist, um eine Schlussfolgerung umzukehren.

### Die Dateien, die sich nicht geändert haben

Hundertvierzig Dateien neu zu konvertieren, um einen Tippfehler zu korrigieren, ist auf einem Laptop vertretbar und in einem Job, der bei jedem Push läuft, unvertretbar. Es gibt drei Wege, die unveränderten zu überspringen, und sie scheitern unterschiedlich.

**Änderungszeit.** Das ist, was `make` tut, und innerhalb einer Arbeitskopie ist es genau richtig: eine Datei bearbeiten, ihre mtime bewegt sich, die Regel feuert. Die Falle ist, dass git keine Änderungszeiten speichert. Ein frischer Klon oder ein Cache-Miss-Checkout stempelt jede Datei mit der Zeit des Checkouts, auf einem CI-Runner sieht also jede Datei neuer aus als jede Ausgabe, und der ganze Baum wird neu gebaut. mtime-basierte inkrementelle Builds funktionieren lokal und tun in CI überhaupt nichts, außer das Ausgabeverzeichnis wird auch aus einem Cache wiederhergestellt, und die wiederhergestellten Ausgaben tragen dann ihre eigenen Zeitstempel — was eine zweite Sache ist, die man richtig machen muss.

**Inhalts-Hash.** Langsamer zu berechnen und überall korrekt, auch bei einem frischen Klon. Speichern Sie den Hash der Eingabe neben der Ausgabe und vergleichen Sie vor dem Konvertieren:

```bash
# in bin/one.sh — $1 ist die .md, $2 ist die .html
stamp="$2.sha256"
now="$(sha256sum "$1" | cut -d' ' -f1)"

if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$now" ] && [ -s "$2" ]; then
  exit 0
fi

convert "$1" "$2" && printf '%s\n' "$now" > "$stamp"
```

`sha256sum` ist GNU coreutils; macOS will `shasum -a 256`. Der `[ -s "$2" ]`-Test ist da, weil ein Hash, der zu einer Ausgabedatei mit null Bytes passt, ein Cache-Eintrag für einen gescheiterten Lauf ist, und ein Cache, der sich an Fehler erinnert, ist schlimmer als gar kein Cache.

**Git fragen, was sich geändert hat.** Das günstigste der drei, wenn die Antwort klein ist, und das einzige, das für ein großes Monorepo skaliert:

```bash
git diff --name-only --diff-filter=ACMR origin/main...HEAD -- '*.md'
```

`--diff-filter=ACMR` schließt Löschungen aus, eine entfernte Datei wird also nicht zu einem Pfad, den Ihr Konverter öffnen soll. Es braucht Historie — ein flacher Klon hat keinen Basis-Commit zum Diffen —, was der Tausch ist: `fetch-depth: 0` kostet Checkout-Zeit auf einem Repository mit jahrelangen Commits.

Egal welchen Sie wählen, eine Regel gilt für alle drei: Der Cache-Schlüssel muss alles enthalten, wovon die Ausgabe abhängt, nicht nur das Markdown. Ändern Sie Ihre HTML-Hülle, Ihr Stylesheet oder die Version des Konverters, ist jede Ausgabe veraltet, während jede Eingabe unverändert ist. Hashen Sie die Vorlage in den Stempel, fügen Sie sie als Voraussetzung im Makefile hinzu, oder akzeptieren Sie, dass die erste Person, die das Stylesheet bearbeitet, einen Nachmittag damit verbringt, sich zu fragen, warum sich die Seite nicht geändert hat.

### Exit-Codes, und was „es hat funktioniert" für zweihundert Dateien bedeutet

Für eine Datei ist Erfolg eindeutig. Für zweihundert hat „hat es funktioniert" drei mögliche Antworten, und Sie müssen sich für eine entscheiden, bevor das Skript geschrieben ist.

**Beim ersten Fehler stoppen.** `set -euo pipefail` und eine schlichte Schleife. Der Ausgabebaum bleibt halb konvertiert, was in Ordnung ist, wenn es ein Build-Verzeichnis ist, das Sie ohnehin löschen, und das Log endet bei der Datei, die brach — was die schnellstmögliche Diagnose ist.

**Alles konvertieren, am Ende scheitern.** Nützlicher, wenn eine Person wartet, denn ein Lauf sagt Ihnen alles über alle sechs kaputten Dateien statt nur über die erste. Es braucht einen expliziten Akkumulator, denn `set -e` würde den Lauf sonst beenden:

```bash
failed=0
for file in docs/**/*.md; do
  bin/one.sh "$file" "$(output_for "$file")" || failed=$((failed + 1))
done

if [ "$failed" -gt 0 ]; then
  echo "$failed files failed" >&2
  exit 1
fi
```

Beachten Sie das `|| failed=$(…)`. Ohne es feuert `set -e` bei der ersten fehlerhaften Datei, und der Akkumulator läuft nie. Mit ihm kann die Schleife nicht scheitern — das explizite `exit 1` am Ende ist also das Einzige, was den Job ehrlich macht, und diesen Block versehentlich zu löschen, erzeugt einen Build, der immer besteht.

**Den parallelen Runner aggregieren lassen.** `xargs` gibt Ihnen 123, wenn irgendein Job scheiterte, `parallel --joblog` gibt Ihnen eine Tabelle, welcher. Beides ist in Ordnung, und beides hängt davon ab, dass Ihr Pro-Datei-Skript tatsächlich mit ungleich null endet, was der Teil ist, der schiefgeht: ein Konverter, der einen Fehler auf die Standardfehlerausgabe schreibt und mit null endet, ein `curl` ohne `-f`, oder ein Skript, das eine Ausnahme fängt, sie loggt und normal zurückkehrt.

Drei Prüfungen lohnen sich unabhängig davon, welche Form Sie gewählt haben:

- [ ] Jede Ausgabe existiert und ist nicht leer — `[ -s "$output" ]`, denn mehrere Fehlermodi erzeugen eine Null-Byte-Datei statt gar keine
- [ ] Die Anzahl der Ausgaben passt zur Anzahl der Eingaben, am Ende des Laufs ausgegeben, denn ein Glob, der still ein Verzeichnis übersprang, zeigt sich hier und nirgends sonst
- [ ] Der ganze Lauf steht unter `set -euo pipefail`, und jeder Konverter hinter einer Pipe ist entweder stattdessen umgeleitet oder von `pipefail` abgedeckt

Diese zweite ist die billigste nützliche Behauptung in der ganzen Pipeline. `find docs -name '*.md' | wc -l` gegen `find build -name '*.html' | wc -l` ist eine Zeile, und sie fängt den Fehler, den kein Exit-Code je melden wird: die Datei, die nie konvertiert wurde, weil nie etwas nach ihr sah.

## Es in CI erledigen, ohne den ganzen Baum zu konvertieren

Die Installationskosten eines Konverters sind [eine Frage, die der Kommandozeilen-Artikel richtig behandelt](/blog/markdown-to-html-from-the-command-line). Die stapelspezifische Frage ist anders: welche Dateien, und wie die Ausgaben herauskommen.

Konvertieren Sie den ganzen Baum auf dem Standard-Branch, und nur die geänderten Dateien in einem Pull Request. Der vollständige Lauf ist Ihre Garantie, dass der Baum konvertierbar ist; der Branch-Lauf ist das schnelle Feedback, und er braucht `fetch-depth: 0`, damit der Diff eine Basis zum Vergleichen hat. Fügen Sie einen `paths`-Filter auf `**.md` hinzu, damit der Job für einen Pull Request, der nur Code berührte, gar nicht erst läuft.

Sind die Ausgaben es wert, behalten zu werden, laden Sie sie als Artefakt hoch statt sie zu committen. Erzeugtes HTML in einem Pull Request macht jedes Review doppelt so lang und jeden Merge zu einem Konflikt, und das Artefakt läuft von selbst ab.

Committen Sie erzeugtes HTML — manche Repositories liefern es direkt aus, und das ist eine legitime Anordnung —, fügen Sie die Prüfung hinzu, die es sicher macht:

```bash
npm run build:docs
git diff --exit-code -- build/
```

`--exit-code` lässt eine nicht committete Neuerzeugung den Job scheitern. Ohne es driftet das committete HTML einen hastigen Merge nach dem anderen vom Markdown weg, und niemand merkt es, bis ein Leser bemerkt, dass die Seite der Quelle widerspricht.

Cachen Sie mit einem aus den Eingaben abgeleiteten Schlüssel — GitHub Actions hat `hashFiles('**/*.md')` genau dafür — und denken Sie daran, Ihre Vorlage und Ihre Lockfile in den Schlüssel aufzunehmen. Ein nur aufs Markdown geschlüsselter Cache liefert Ihnen nach einer Stylesheet-Änderung veraltetes HTML, was das verwirrendste mögliche Ergebnis ist und das am schwersten zuzuordnende.

Zwei kleinere Dinge. Sharden Sie mit einer Matrix nur, wenn die Konvertierung wirklich der langsame Schritt ist: acht parallele Jobs, jeder mit eigenem Checkout und eigener Installation, brauchen insgesamt oft länger als ein Job mit `xargs -P 8`. Und halten Sie die Shell des Runners explizit — GitHub Actions führt einen `run`-Block als `bash -e {0}` aus, was nicht dasselbe ist wie Ihre Login-Shell, und `shopt`-Einstellungen übertragen sich nicht zwischen Schritten.

## Ein Dokument aus vielen, oder viele aus vielen

Auf halbem Weg beim Bau eines Ordnerkonverters entdecken die meisten Leute, dass sie etwas anderes wollten. „Diese vierzig Dateien konvertieren" spaltet sich in zwei Anforderungen, die ähnlich aussehen und es nicht sind.

| | Vierzig Seiten | Ein Dokument |
| --- | --- | --- |
| Was Sie jemandem schicken | Vierzig Links, oder ein Verzeichnis | Ein Link, oder eine Datei |
| Navigation | Was auch immer die Dokumente schon an Links hatten | Ein von Ihnen erzeugtes Inhaltsverzeichnis |
| Überschriftenebenen | Das eigene `#` jeder Datei ist der Seitentitel | Jede Überschrift muss eine Ebene herabgestuft werden |
| Anker-IDs | Duplikate über Dateien hinweg sind harmlos | `#installation` in vier Dateien kollidiert |
| Reihenfolge | Kosmetisch | Inhalt — die falsche Reihenfolge ist ein falsches Dokument |
| Suche | Die eigene Website-Suche des Lesers, falls es eine gibt | Die Browser-Suche, was oft genug ist |
| Größe | Jede Seite ist klein | Eine Datei, und eine Größenobergrenze, an die man denken muss |
| Veralteter Inhalt | Eine Seite pro Quelldatei, mit ihr gelöscht | Alles neu erzeugen, oder es ist falsch |

Soll der Leser den Satz lesen, wollen Sie ein Dokument, und die Konvertierung ist die leichte Hälfte. Markdown zusammenzufügen ist kein `cat`: Reines `cat` klebt die letzte Zeile einer Datei an die erste der nächsten, Überschriften müssen herabgestuft werden, damit das `#` der zweiten Datei nicht ein weiterer Seitentitel wird, und Anker müssen unterschieden werden. [Einen Ordner in ein Dokument zu verwandeln](/blog/merging-many-markdown-files) behandelt die Reihenfolge, die Überschriftenebenen und die Anker-Kollisionen, und es lohnt sich, das zu lesen, bevor Sie die Schleife schreiben, statt danach.

Es gibt eine praktische Obergrenze für die zusammengeführte Antwort: Ein groß genug Dokument ist ein Dokument, das niemand öffnen kann. Browser kommen mit ein paar Megabyte HTML klar und hören auf, angenehm zu sein, weit bevor die Grenzen greifen, die irgendein Konverter setzt — der Konverter hinter dieser Seite lehnt eine zu konvertierende Datei über 10 MB ab und ein gespeichertes Dokument über 4 MB (geprüft auf transformpipe.com/docs, 8. September 2026), was in Markdown ein sehr langes Buch ist. Ist Ihre zusammengeführte Ausgabe nah an einer der beiden Zahlen, ist die ehrliche Antwort keine größere Datei, sondern eine Menge Seiten mit Navigation, was ein Generator ist.

## Wo eine Ordnerschleife aufhört, die Antwort zu sein

Die Schleife ist das richtige Werkzeug für eine begrenzte Menge Dokumente, deren einzige Beziehung ist, dass sie im selben Verzeichnis liegen. Vier Dinge brechen das, und jedes hat Kosten, die es wert sind, benannt zu werden, bevor Sie eine Woche in ein Build-Skript stecken.

**Dokumente, die aufeinander verweisen.** In dem Moment, in dem `docs/api.md` auf `docs/guide.md` verlinkt, erzeugt ein einfacher Konverter eine Seite, deren Links auf `.md`-Dateien zeigen, die nicht da sind. Sie umzuschreiben heißt, das Markdown zu parsen, das Ziel aufzulösen, zu prüfen, ob es existiert, und die Endung umzuschreiben — und zu prüfen, ob es existiert, ist, wo Sie die vier Links entdecken, die schon vorher kaputt waren. Das ist kein Flag an irgendeinem Konverter. Es ist ein echtes Programm, und ein Seitengenerator hat es schon geschrieben.

**Ein Leser, der ohne URL ankommt.** Ein Ordner voller Seiten hat keinen Index, keine Suche und keine Navigation. Muss jemand das richtige Dokument finden, statt es geschickt zu bekommen, bauen Sie eine Website, und das mit einem Shell-Skript zu tun heißt, einen Generator schlecht neu zu implementieren, eine Anforderung nach der anderen. Die Kosten, das früh zuzugeben, sind eine Konfigurationsdatei. Die Kosten, es spät zuzugeben, sind ein Build-Skript, das nur eine Person versteht und niemand anfasst, nachdem sie gegangen ist.

**Dateien, deren Ausgabe nicht existieren sollte.** Entwürfe, Vorlagen, Partials, das `_includes`-Verzeichnis, der archivierte Abschnitt, den jemand „zur Referenz" behalten hat. Ein Glob hat keine Meinung zu irgendeinem davon, sie werden also alle Seiten, und manche dieser Seiten werden von einer Suchmaschine gefunden, bevor sie von Ihnen gefunden werden. Sie auszuschließen heißt eine Liste von Ausnahmen, im Skript, von Hand gepflegt, was genau die Konfigurationsdatei ist, die Sie vermeiden wollten.

**Ein Baum, der seine Form ändert.** Die Schleife kodiert die Form des Baums in ihren Pfadausdrücken. Die Verzeichnisse umzuorganisieren ändert jede Ausgabe-URL, bricht jeden Link, den irgendwer gespeichert hat, und es gibt nichts, von dem umgeleitet werden könnte, denn nichts hat aufgezeichnet, was die alten Pfade waren. Ein Konverter kann das nicht beheben, und ein Generator hilft nur wenig; die eigentliche Antwort ist, die Ausgabepfade bewusst zu entscheiden und sie stabil zu halten, selbst wenn die Quelle sich bewegt.

Nichts davon spricht gegen die Schleife für den Fall, der zu ihr passt: eine Menge Dokumente, konvertiert für Leute, denen die Links gegeben werden. Es spricht dagegen, versehentlich eine in ein Publishing-System hineinwachsen zu lassen, was die übliche Art ist, wie ein fünfzehnzeiliges Skript zu vierhundert Zeilen wird, die niemand löschen kann.

## Wie Sie wählen

1. **Zählen Sie die Dateien, dann zählen Sie sie in einem Jahr noch einmal.** Unter zwanzig ist eine `for`-Schleife mit `set -euo pipefail` die ganze Antwort, und alles Weitere ist ein Hobby. Über ein paar hundert brauchen Sie `find`, NUL-Trennung und `-P`, denn sowohl die Argumentgrenze als auch die Wanduhrzeit werden real statt theoretisch.
2. **Entscheiden Sie neben-oder-getrennt, bevor Sie eine Zeile schreiben.** Ein separater Baum kostet Sie relative Links und Bildpfade und gibt Ihnen einen sauberen Build, eine löschbare Ausgabe und ein Diff ohne erzeugte Dateien darin. Es später zu wählen heißt, jede Ausgabe zu verschieben und jeden Link auf einmal zu reparieren, unter Zeitdruck.
3. **Schreiben Sie die Ein-Datei-Konvertierung zuerst als eigenes Skript.** Ist `bin/one.sh input.md output.html` korrekt und endet mit ungleich null bei Fehlern, ist jeder Ansatz auf dieser Seite eine Ein-Zeilen-Änderung, und Sie können den schwierigen Teil ohne Ordner testen. Lebt die Konvertierungslogik in der Schleife, können Sie sie überhaupt nicht testen.
4. **Wählen Sie Ihre Fehlerpolitik ausdrücklich, und lassen Sie den Job sie beweisen.** Beim ersten Fehler stoppen, oder alles konvertieren und am Ende mit ungleich null enden — beides ist in Ordnung, und die Vorgabe „weitermachen und Erfolg melden" ist es, was einen halb gebauten Docs-Baum in Produktion bringt. Fügen Sie dann die Ausgabenanzahl-Behauptung hinzu, denn kein Exit-Code wird Ihnen je vom Verzeichnis erzählen, das der Glob nie betreten hat.
5. **Fügen Sie inkrementelle Konvertierung nur hinzu, wenn der vollständige Lauf wirklich zu langsam ist, und schlüsseln Sie ihn nach Inhalt.** mtime funktioniert auf einem Laptop und tut in CI still nichts, ein Hash-Stempel ist also die Version, die einen frischen Klon übersteht. Nehmen Sie die Vorlage und die Konverterversion in den Schlüssel auf, oder ein Upgrade lässt Sie Ausgaben der alten Version ausliefern.
6. **Fragen Sie, ob die Antwort ein Dokument ist.** Soll der Empfänger den ganzen Satz lesen, sind vierzig Links ein schlechteres Ergebnis als eine Seite, und die Arbeit verlagert sich von der Schleife zur Zusammenführung. Das ist ein anderes Problem mit anderen Fehlermodi, und das erst hinterher herauszufinden heißt, das Skript zweimal zu schreiben.

## Fazit

Eine Stapelkonvertierung ist eine kleine Menge Konvertieren, verpackt in eine große Menge Buchhaltung, und die Buchhaltung ist, wo die Fehler leben: der Glob, der neun von neunundvierzig Dateien erreichte, der Ausgabepfad, der zwei Seiten zu einer zusammenfaltete, der parallele Lauf, dessen Fehler in eine Subshell gingen, der Cache, der sich an ein Stylesheet erinnerte, das er nie gesehen hatte. Schreiben Sie die Ein-Datei-Konvertierung als Skript, das ehrlich endet, treiben Sie es mit `find` und NUL-Trennung an, damit die Dateimenge bekannt und stabil ist, halten Sie die Ausgabe in einem Baum, den Sie löschen können, und behaupten Sie am Ende die Ausgabenanzahl, damit ein fehlendes Verzeichnis ein gescheiterter Build ist statt einer Seite, die niemand vermisst. Stellt sich dann heraus, dass die Menge ein Dokument statt vierzig ist, haben Sie die beiden Aufgaben getrennt gehalten — und ist es wirklich eine einzelne Datei, die fertig aussehen muss, ist [eine im Browser zu konvertieren](/) kostenlos, braucht keine Installation und lädt nichts hoch, während Sie abgemeldet sind.

## FAQ

### Wie konvertiere ich mehrere Markdown-Dateien auf einmal von einem Terminal aus?

Lassen Sie die Shell auflisten und ein Skript eine Datei konvertieren: `find docs -type f -name '*.md' -print0 | sort -z | xargs -0 -P 8 -n 1 bin/one.sh`. Bauen Sie den Ausgabepfad im Skript mit `${file%.md}.html`, damit der Verzeichnisbaum seine Form behält, und `mkdir -p` das Ziel, bevor Sie schreiben. Setzen Sie `set -euo pipefail` oben ins Skript, und lassen Sie `xargs` 123 zurückgeben, falls eine Datei scheiterte.

### Warum hat meine Stapelkonvertierung Dateien in Unterverzeichnissen übersprungen?

Weil `docs/*.md` nicht rekursiert und `**` nur Verzeichnistrenner überquert, wenn Bashs `globstar`-Option an ist. Ohne `shopt -s globstar` passt das Muster `docs/**/*.md` auf genau eine Ebene tiefer, und jede tiefere Datei wird übersprungen, ohne jeden Fehler. Nutzen Sie stattdessen `find`, oder setzen Sie die Option, und vergleichen Sie die Ein- und Ausgabenanzahl am Ende des Laufs.

### Kann ich einen Ordner Markdown-Dateien parallel konvertieren?

Ja — `xargs -0 -P 8`, GNU `parallel`, oder `make -j8` tun das alle, und die Beschleunigung ist real, weil die meisten Kosten Prozessstart statt Parsen sind. Was Sie verlieren, ist Reihenfolge: nebenläufige Jobs verweben ihre Ausgabe Zeile für Zeile, und ein in der Schleife hochgezählter Zähler lebt in einer Subshell und verschwindet. Nutzen Sie `parallel -k`, wenn die Ausgabe geordnet bleiben muss, und schreiben Sie eine kleine Datei pro Fehler statt an eine Variable anzuhängen.

### Wie überspringe ich Markdown-Dateien, die sich nicht geändert haben?

`make` mit einer Musterregel tut das nach Änderungszeit und braucht keinen eigenen Cache, aber git speichert keine mtimes, in einem frischen CI-Checkout sieht also alles neu aus, und der ganze Baum wird neu gebaut. Ein neben jeder Ausgabe gespeicherter Inhalts-Hash funktioniert überall, auch bei einem frischen Klon. Was auch immer Sie nutzen, nehmen Sie die HTML-Vorlage und die Konverterversion in den Schlüssel auf, oder eine Stylesheet-Änderung lässt jede Seite veraltet.

### Sollte das HTML neben dem Markdown liegen oder in einem separaten Ordner?

Fast immer ein separater Baum: Sie können ihn löschen, er bleibt aus Ihren Diffs heraus, und eine gelöschte Markdown-Datei kann keine verwaiste Seite hinterlassen. Ausgabe neben der Eingabe ist nur eindeutig besser, wenn relative Links und Bildpfade zwischen Dokumenten unangetastet weiterfunktionieren müssen. Nutzen Sie einen separaten Baum, spiegeln Sie die Verzeichnisstruktur — `basename` faltet zwei `index.md`-Dateien zu einer Ausgabe zusammen und endet dabei mit null.

### Warum besteht mein Build, obwohl manche Konvertierungen scheiterten?

Weil nichts geprüft hat. Eine Shell-Schleife läuft nach einem Fehler weiter und endet mit dem Status des letzten Befehls, eine Pipeline meldet die letzte Stufe statt den Konverter, und mehrere Werkzeuge behandeln einen Fehler als Warnung — `curl` endet ohne `-f` bei einem 429 mit null. Nutzen Sie `set -euo pipefail`, leiten Sie um statt zu pipen, und fügen Sie ein explizites `exit 1` nach dem Zählen der Fehler hinzu.

### Ist es besser, vierzig Dateien zu konvertieren oder sie zu einer zusammenzuführen?

Das hängt vollständig vom Leser ab. Vierzig Seiten passen zu jemandem, der mit einem Link zu einer davon ankommt; ein Dokument passt zu jemandem, der den ganzen Satz lesen wird, und es ist ein Link statt vierzig. Zusammenführen ist allerdings kein Zusammenfügen — Überschriftenebenen müssen herabgestuft und doppelte Anker unterschieden werden —, behandeln Sie es also als separate Aufgabe statt als Flag an der Schleife.
