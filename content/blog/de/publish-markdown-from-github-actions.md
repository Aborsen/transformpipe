---
title: "Markdown aus einem Pull Request mit GitHub Actions veröffentlichen"
description: "Das geänderte Markdown eines Pull Requests rendern und verlinken: der Workflow Zeile für Zeile, warum ein Fork keine Secrets bekommt, und was jede Alternative kostet"
updated: 2026-09-09
date: 2026-08-26
tag: Automatisierung
keywords: github action markdown, github actions markdown rendern, markdown vorschau pull request, pull request dokumentation vorschau, ci markdown konvertieren, markdown in ci veröffentlichen, pull_request_target sicherheit, sticky pull request kommentar, github actions nebenläufigkeit, markdown aus ci veröffentlichen
---

Ein Pull Request, der einen Absatz umschreibt, zeigt eine rote Zeile, eine grüne Zeile und jede Menge verschobenen Umbruch. Sie sehen, welche Wörter sich geändert haben. Sie sehen nicht, ob der Abschnitt sich noch gut liest, ob die Tabelle noch ausgerichtet ist oder ob die nummerierte Liste auf halber Strecke wieder bei eins anfängt. Prosa in einem Diff zu prüfen ist Raten.

Die Menschen, deren Zustimmung das Dokument eigentlich braucht, sind oft die, die am wenigsten dafür ausgerüstet sind, ein Diff zu lesen. Eine Anwältin, die Vertragsbedingungen prüft, ein Support-Lead, der ein Runbook prüft, eine Designerin, die die Wörter in einem Ablauf prüft: Sie öffnen den Tab „Files changed“, treffen auf eine Wand aus Rot und Grün mit verschobenem Umbruch, und antworten, es sehe gut aus. Das ist kein Review, und niemand Beteiligtes trägt daran Schuld.

Die Abhilfe ist klein. Bei jedem Pull Request das geänderte Markdown rendern, jede Datei veröffentlichen und die Links in einem Kommentar posten. Die Reviewerin klickt und liest das Dokument. Am Repository ändert sich nichts.

### Kurzfassung

Auslösen bei `pull_request` mit einem `paths`-Filter, dem Job eine Concurrency-Gruppe geben, damit zwei Pushes im Abstand einer Minute nicht gegeneinander laufen, `contents: read` und `pull-requests: write` deklarieren und nichts sonst, und den Veröffentlichungsschritt mit einem `if` absichern, damit ein Pull Request ohne Markdown-Änderung gar nichts tut. Herauszufinden, was sich geändert hat, heißt gegen den Basis-Commit zu diffen, was die volle Historie braucht — `fetch-depth: 0` — oder eine Action, die stattdessen GitHubs API nach der Liste fragt. Einen Kommentar posten und ihn an Ort und Stelle aktualisieren, statt bei jedem Push einen neuen hinzuzufügen. Und die eine Grenze kennen, die sich nicht wegkonfigurieren lässt, bevor Sie darauf aufbauen: Ein Pull Request aus einem Fork bekommt ein Nur-Lese-Token und keine Secrets, absichtlich, Fork-Vorschauen finden also entweder nicht statt oder finden ohne Ihren Schlüssel statt — und `pull_request_target`, der Trigger, der die Beschränkung aufhebt, ist der, an dem Repositories kompromittiert werden.

## Prüfen Sie, was GitHub schon tut

Bevor Sie einen Workflow hinzufügen, prüfen Sie, ob Sie einen brauchen. Commits und Pull Requests, die Prosa-Dokumente enthalten, können in einer Quellansicht oder einer gerenderten Ansicht angezeigt werden, und der Umschalter zwischen beiden sitzt im Kopf der Datei — der Tab „Files changed“ wird eine geänderte Markdown-Datei also rendern, statt ihren Text zu diffen (geprüft auf docs.github.com, 9. September 2026). Der Rich-Diff-Umschalter, im Namen, den die meisten Leute dafür verwenden. Für eine kleine Datei, geprüft von Menschen, die den Pull Request schon offen haben, reicht das.

Es reicht nicht mehr, wenn die Änderung mehrere Dateien umfasst, wenn die Leserin kein GitHub-Konto hat — eine Anwältin, die Vertragsbedingungen prüft, ein Kunde, der Release Notes liest — oder wenn Sie einen Link wollen, der noch zeigt, was der Branch letzten Dienstag sagte.

## Der Workflow, Zeile für Zeile

Kopieren Sie das in `.github/workflows/markdown-preview.yml`:

```yaml
name: Markdown preview

on:
  pull_request:
    paths:
      - '**.md'

concurrency:
  group: markdown-preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}

      - if: steps.publish.outputs.urls != ''
        run: echo "${{ steps.publish.outputs.urls }}"
```

Das ist das Ganze. Der Schlüssel ist ein TransformPipe-API-Key, gespeichert als Repository-Secret; die Action bringt den Konverter mit, und `action.yml` listet ihre Eingaben. Ohne Dateiliste fragt sie git, welche Markdown-Dateien der Pull Request berührt hat, veröffentlicht jede und kommentiert eine Tabelle aus Dateiname, Wortzahl und Link. Dateien, die der Branch gelöscht hat, werden übersprungen, ein entferntes Dokument lässt den Lauf also nicht scheitern.

Der Großteil dieser Datei ist nicht die Konvertierung. Es ist die Handvoll Zeilen, die den Job günstig, abgegrenzt, geordnet und still halten, und jede von ihnen beantwortet einen Fehler, den schon jemand hatte.

### Der Trigger, und was `paths` tut

`on: pull_request` löst den Workflow aus, wenn ein Pull Request geöffnet, wiedereröffnet oder mit einem Push versehen wird. Diese drei Aktivitätstypen — `opened`, `synchronize` und `reopened` — sind die Standardmenge, und alles andere, was ein Pull Request tun kann, ein Label oder eine Titeländerung oder ein Review, muss mit `types` ausdrücklich benannt werden (geprüft auf docs.github.com, 9. September 2026). Einen Commit auf den Branch zu pushen ist `synchronize`, und das ist der Fall, der hier zählt: jede Runde von Änderungen bekommt eine frische Vorschau, ohne dass jemand danach fragt.

`paths: '**.md'` ist die günstigste verfügbare Absicherung, weil sie läuft, bevor irgendetwas anderes läuft. Ein Pull Request, der nur Code ändert, reiht den Workflow überhaupt nie ein: kein Runner, kein Checkout, keine abgerechnete Minute. `'**.md'` trifft in jeder Tiefe. `'docs/**.md'` engt es auf einen Baum ein, was meist das ist, was Sie in einem Repository wollen, in dem Markdown auch in Test-Fixtures, einem `node_modules`-Cache oder einer eingebrachten Kopie fremder Dokumentation lebt.

Eine Folge lohnt sich zu kennen, bevor Sie das zu einem erforderlichen Statuscheck machen. GitHubs eigene Formulierung ist, dass ein durch Pfadfilterung übersprungener Workflow seine Checks in einem ausstehenden Zustand belässt, und ein Pull Request, der diese Checks als erfolgreich verlangt, ist vom Mergen blockiert (geprüft auf docs.github.com, 9. September 2026) — ausgerechnet bei den Pull Requests, die nichts zum Vorschauen hatten. Lassen Sie den Check entweder optional, oder verschieben Sie den Filter aus dem `on:` in ein `if` am Job, wo der Lauf stattfindet, berichtet und nichts tut.

### Eine Concurrency-Gruppe, damit zwei Pushes nicht gegeneinander laufen

Zwei Commits, im Abstand einer Minute gepusht, starten zwei Läufe. Beide checken aus, beide veröffentlichen, beide kommentieren, und nichts meldet einen Fehler. Das Ergebnis ist trotzdem falsch: Die Läufe können in falscher Reihenfolge enden, der letzte Kommentar im Thread — der, den eine Reviewerin liest — kann also der sein, der den älteren Commit beschreibt.

`concurrency` behebt die Reihenfolge, indem es zwei verweigert. Die Gruppe ist eine beliebige Zeichenkette, und sie über die Pull-Request-Nummer zu schlüsseln gibt eine Spur pro Pull Request statt einer Spur pro Repository, was zehn offene Pull Requests grundlos hintereinander warten ließe. Mit `cancel-in-progress: true` bricht ein neuer Lauf den bereits laufenden ab; ohne es wartet der neue Lauf. GitHubs eigene Beschreibung des Standardverhaltens ist, dass ein wartender Job oder Workflow in derselben Gruppe abgebrochen wird und der neu eingereihte an seine Stelle tritt (geprüft auf docs.github.com, 9. September 2026).

Für eine Vorschau ist Abbrechen die richtige Wahl: die halb fertige Veröffentlichung eines Commits, der bereits ersetzt wurde, ist Arbeit, deren Ausgabe niemand will. Wenn das Repository mehrere Workflows hat, die kollidieren könnten, packen Sie den Workflow-Namen ebenfalls in die Gruppe — `${{ github.workflow }}-${{ github.event.pull_request.number }}` —, damit zwei unabhängige Jobs sich nicht aus Versehen eine Spur teilen.

### `permissions`, und der 403, den Sie ohne sie bekommen

Der `permissions`-Block grenzt den Token ein, mit dem ein Workflow läuft. `contents: read` erlaubt dem Checkout, das Repository zu lesen. Einen Kommentar zu posten ist ein anderer Scope und braucht `pull-requests: write`.

Lassen Sie es weg, und die Arbeit wird erledigt und verschwendet: die Dokumente werden veröffentlicht, der Kommentaraufruf kommt mit 403 zurück, und der Lauf wird beim letzten Schritt rot, mit den Links im Log liegen geblieben. Deklarieren Sie beide Scopes, statt sich auf den Standard zu verlassen, der je nach Repository- und Organisationseinstellung variiert.

Den Block überhaupt zu deklarieren ist, was ihn zum Prinzip der minimalen Rechte macht, denn zwei Scopes zu benennen setzt jeden anderen Scope auf keinen. Ein später hinzugefügter Schritt in diesem Job — eine Abhängigkeit einer Action, ein eingefügtes Skript — kann dann keinen Commit pushen, kein Issue öffnen, kein Paket veröffentlichen und kein anderes Repository lesen, was auch immer er versucht. Wenn ein Job in einem größeren Workflow wirklich mehr braucht, geben Sie diesem Job seinen eigenen `permissions`-Block, statt den der Datei zu erweitern.

### Das Secret, und was es erreichen kann

`secrets.TP_API_KEY` ist ein Repository-Secret, das einen API-Key hält. Die Action nimmt ihn als Eingabe und übergibt ihn dem Konverter als Umgebungsvariable statt als Argument, was ihn aus der Prozessliste des Runners und aus der ins Log echoten Befehlszeile heraushält. GitHub schwärzt registrierte Secret-Werte in der Log-Ausgabe, und die eigene Anleitung besagt, dass alles Sensible, das kein GitHub-Secret ist, von Hand mit `::add-mask::` maskiert werden muss (geprüft auf docs.github.com, 9. September 2026). Schwärzung ist ein Sicherheitsnetz über einem Fehler, kein Ort, um einen zu machen: ein Schritt, der ein Secret kodiert, aufteilt oder irgendwohin sendet, umgeht die Maskierung vollständig, und jeder Schritt in diesem Job kann das tun.

Der Schlüssel selbst erreicht Dokumente, ihre Freigabeeinstellungen und eine Nutzungszahl, und sonst nichts — nicht die Anmeldung, nicht die Liste der Schlüssel —, ein geleakter Schlüssel kann also Dokumente veröffentlichen und löschen, aber keinen Ersatz für sich selbst prägen oder den Besitzer aussperren. Er wird einmal angezeigt und nur als Hash gespeichert, was die Rotation zu einer festen Reihenfolge macht: prägen, in das Secret einfügen, den alten widerrufen.

Wenn das Repository Mitwirkende hat, denen Sie den Schlüssel nicht persönlich in die Hand geben würden, packen Sie ihn in ein Umgebungs-Secret und geben Sie dem Job ein `environment:`, sodass die Nutzung durch die Schutzregel dieser Umgebung gesteuert wird. Das ist eine echte Grenze. Ein einfaches Repository-Secret ist es nicht: jeder Workflow im Repository kann es lesen, auch einer, der auf einem Branch von jemandem mit Schreibzugriff hinzugefügt wird.

### Die `if`-Absicherung, damit nichts passiert, wenn nichts sich geändert hat

Der `paths`-Filter stoppt den Workflow, wenn sich überhaupt kein Markdown geändert hat. Die `if`-Absicherung deckt den Fall eine Ebene darunter ab, in dem der Workflow lief, weil etwas gepasst hat, und der Schritt nach der Veröffentlichung nichts zum Arbeiten hat.

Die Action behandelt ihren eigenen Leerfall ehrlich: ohne Dateien druckt sie `No Markdown to publish.`, setzt `urls` auf eine leere Zeichenkette und `documents` auf `[]`, und beendet sich mit Code null. Was sie nicht kann, ist die Schritte zu stoppen, die Sie danach schreiben. `if: steps.publish.outputs.urls != ''` ist die ganze Absicherung, und ein übersprungener Schritt ist grün statt rot — was mehr zählt, als es klingt. Ein Workflow, der aus einem Grund rot wird, den niemand beheben kann, ist ein Workflow, den Leute lernen zu ignorieren, und dann wird er aus einem echten Grund rot und wird wieder ignoriert.

Dieselbe Absicherung mit einer anderen Bedingung ist, wie man einen Fork absichtlich statt aus Versehen behandelt:

```yaml
      - if: github.event.pull_request.head.repo.fork == false
        id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

Diese Zeile braucht Erklärung, denn die Einschränkung dahinter ist die eine Sache in diesem Workflow, die man nicht wegkonfigurieren kann.

## Herausfinden, was sich geändert hat

Ohne `files`-Eingabe fragt die Action git, in einer Zeile:

```bash
git diff --name-only --diff-filter=d "$BASE_SHA"...HEAD -- '*.md'
```

Jeder Teil davon trägt Gewicht. `--name-only` fragt nach Pfaden statt nach einem Patch. `--diff-filter=d` lässt Löschungen weg, ein vom Branch entferntes Dokument wird also nie einem Konverter übergeben, der an einer nicht vorhandenen Datei scheitern würde. Der Pathspec `'*.md'` filtert innerhalb von git statt hinterher, was die Liste bei einem Pull Request kurz hält, der auch vierhundert Bilder verschoben hat. Und die drei Punkte sind kein Tippfehler: `A...B` diffed vom Merge-Base der beiden Commits statt von `A` selbst, Commits, die nach dem Öffnen des Pull Requests auf dem Basis-Branch landeten, tauchen also nicht als Arbeit dieses Branches auf.

`$BASE_SHA` kommt aus `github.event.pull_request.base.sha`, was die Event-Payload umsonst mitliefert. Dieser Commit ist die ganze Frage, und er ist der Grund für die nächste Zeile im Workflow.

### Warum `fetch-depth: 0`

`actions/checkout` holt standardmäßig einen einzelnen Commit — `fetch-depth` ist als Anzahl der zu holenden Commits dokumentiert, mit einem Standard von `1` und `0` bedeutet die gesamte Historie für alle Branches und Tags (geprüft auf github.com, 9. September 2026). Das ist schnell und reicht, um Code zu bauen. Es reicht nicht, um „was hat sich geändert“ zu beantworten: Die Action diffed die Basis des Pull Requests gegen seinen Head, und in einem flachen Klon fehlt dieser Basis-Commit, der Diff scheitert also oder meldet nichts.

`fetch-depth: 0` holt die volle Historie, was auf einem Repository mit Jahren an Commits echte Zeit kostet. Wenn Checkout ohnehin schon der langsame Schritt ist, benennen Sie die Dateien selbst und behalten Sie den flachen Klon:

```yaml
      - uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook/intro.md docs/handbook/style.md
          merge: true
          name: Handbook preview
```

`files` ist eine durch Leerzeichen getrennte Liste von Pfaden, so übergeben, wie sie geschrieben ist: ein Muster wie `docs/*.md` kommt wörtlich an und trifft nichts, bauen Sie die Liste also in einem früheren Schritt, wenn Sie eine brauchen — dasselbe Problem wie [einen ganzen Ordner Markdown-Dateien zu konvertieren](/blog/batch-convert-markdown-files), wo mit `find` aufzuzählen und zu sortieren, bevor Sie die Liste weitergeben, die Menge überschaubar hält. Eine explizite Liste braucht keine Historie, verliert aber den Teil, der das Ganze lohnenswert macht — behandeln Sie sie als Rückfall, nicht als Standard.

### Die Action, zu der Leute stattdessen greifen

Die meisten Workflows schreiben diesen Diff nicht selbst. `tj-actions/changed-files` ist die weit verbreitete Alternative: MIT-lizenziert, und sie berechnet die Liste entweder aus GitHubs REST-API oder aus gits eigenem `diff`, weshalb sie bei einem Pull Request mit dem Standard-`fetch-depth: 1` funktioniert und bei einem `push`-Event trotzdem `fetch-depth: 0` oder `2` will. Ihre Ausgaben kommen in mehreren Formen — `all_changed_files`, `added_files`, `modified_files`, `deleted_files` — plus `any_changed`, dem Boolean, den ein `if` will (geprüft auf github.com, 9. September 2026).

```yaml
      - id: changed
        uses: tj-actions/changed-files@<commit-sha>
        with:
          files: '**.md'

      - if: steps.changed.outputs.any_changed == 'true'
        id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: ${{ steps.changed.outputs.all_changed_files }}
```

Zwei Dinge zu diesem Schnipsel. Die Version ist absichtlich ein Commit-SHA: Eine Third-Party-Action an einen vollständigen SHA zu pinnen statt an einen Tag, denn ein Tag ist ein beweglicher Zeiger, den der Besitzer der Action, oder wer auch immer dieses Konto übernimmt, auf anderen Code umlenken kann — und Ihr Workflow holt ihn beim nächsten Lauf, ohne dass Sie einen Diff zum Lesen haben. Das zweite ist Quoting. Eine Liste von Pfaden, in einen `with:`-Wert interpoliert, ist eine Zeichenkette, ein Dateiname mit einem Leerzeichen kommt also als zwei Dateien an. Das ist eine Eigenschaft jeder durch Leerzeichen getrennten Liste, auch der `files`-Eingabe dieser Action, kein Fehler in beiden; wenn solche Namen in Ihrem Repository existieren, schreiben Sie die Liste in eine Datei und lesen Sie sie zurück, statt sie durch eine Shell zu schicken.

## Das Fork-Problem, und der Trigger, der es aufhebt

Eine Grenze lohnt sich, im Voraus zu kennen. Ein `pull_request`-Event, das aus einem Fork ausgelöst wird, bekommt keine Secrets und ein Nur-Lese-Token, der Pull Request eines Forks bekommt also keine Vorschau — und einen roten Check, an dem der Veröffentlichungsschritt mangels Schlüssel gescheitert ist. Das ist GitHub, das Ihren API-Key von Code fernhält, den Sie nicht gelesen haben — der richtige Standard.

GitHubs Formulierung lässt keinen Raum: Mit Ausnahme von `GITHUB_TOKEN` werden Secrets nicht an den Runner übergeben, wenn ein Workflow aus einem geforkten Repository ausgelöst wird, und `GITHUB_TOKEN` selbst hat bei Pull Requests aus Forks Nur-Lese-Rechte (geprüft auf docs.github.com, 9. September 2026). Beide Hälften dieses Workflows sind auf einem Fork also tot. Der Veröffentlichungsschritt hat keinen Schlüssel und scheitert bei der API; der Kommentarschritt hat keinen Schreib-Scope und scheitert beim Kommentar. `pull-requests: write` in der Datei zu deklarieren ändert nichts, denn der Block ist eine Obergrenze, keine Gewährung.

### `pull_request_target`, und warum daran Repositories kompromittiert werden

Suchen Sie nach einem Weg darum herum, und die erste Antwort ist immer derselbe Trigger. `pull_request_target` löst bei denselben Events wie `pull_request` aus, läuft aber im Kontext des Default-Branchs des Basis-Repositorys statt des Merge-Commits — die Workflow-Datei ist also Ihre, der Token ist beschreibbar, und die Secrets sind da (geprüft auf docs.github.com, 9. September 2026).

Das klingt nach der Lösung, und es ist eine gut dokumentierte Art, ein Repository zu verlieren. Dass die Workflow-Datei Ihre ist, ist die sichere Hälfte. Die unsichere Hälfte kommt in dem Moment, in dem der Job den Inhalt des Pull Requests selbst berührt. Checken Sie den Head-Commit aus, und alles danach ist der Code einer fremden Person, der in einem Job läuft, der Ihre Secrets und ein Schreib-Token hält: ein Build-Skript, ein Testbefehl, der Install-Hook einer Abhängigkeit, ein Makefile-Ziel, die Konfigurationsdatei eines Linters, ein in den Branch committeter Git-Hook. GitHubs Warnung zum Trigger nennt die Folgen unverblümt — Cache-Vergiftung und unbeabsichtigter Zugriff auf Schreibrechte oder Secrets (geprüft auf docs.github.com, 9. September 2026).

Eine Markdown-Datei zu konvertieren sieht harmlos aus, und die Gefahr liegt nicht in der Konvertierung. Sie liegt in allem, was ein Job drumherum wachsen lässt: der Checkout, das `npm ci`, das sechs Monate später jemand hinzufügt, damit ein Lint-Schritt funktioniert, das „führ einfach das eigene Skript des Projekts aus“, das im Moment offensichtlich erscheint. GitHubs Sicherheitsanleitung behandelt das als benanntes Muster, und die empfohlene Form, wenn Sie wirklich privilegierte Arbeit an nicht vertrauenswürdigem Inhalt brauchen, sind zwei Workflows: ein `pull_request`-Workflow, der die Dateien des Beitragenden ohne Secrets behandelt und das Ergebnis als Artefakt hochlädt, dann ein `workflow_run`-Workflow mit Berechtigungen, der das Artefakt herunterlädt und den privilegierten Teil erledigt (geprüft auf securitylab.github.com, 9. September 2026).

### Was stattdessen zu tun ist

Diese Aufteilung ist richtig, und für eine Dokumentationsvorschau ist sie die falsche Menge Maschinerie: zwei Workflow-Dateien, eine Artefaktübergabe, und eine Fehlerklasse — den Head in der privilegierten Hälfte auszuchecken —, deren Fehlermodus Ihr Schlüssel in fremder Hand ist. Zwei schlichtere Optionen decken fast jedes Repository ab.

**Beim Push auf den Default-Branch veröffentlichen.** Nach dem Merge läuft der Job auf Ihrem eigenen Branch mit Ihrem eigenen Token und Ihren eigenen Secrets, und die Fork-Frage verschwindet, weil kein Fork im Spiel ist:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'docs/**.md'

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 2

      - uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook.md
          share: link
```

Zwei Unterschiede zur Pull-Request-Version. `fetch-depth: 2` reicht, weil ein Push gegen den Commit davor vergleicht statt gegen einen Merge-Base. Und `files` wird ausdrücklich benannt, weil ein Push-Event keinen Pull Request trägt und deshalb keinen Basis-SHA, gegen den die Action diffen könnte — ohne Liste findet sie nichts und beendet sich mit null, was ein stiller Erfolg ist statt eines Fehlers. Was Sie verlieren, ist die Vorschau vor dem Merge; was Sie behalten, ist eine veröffentlichte Seite für jede Version, die tatsächlich ausgeliefert wurde, was für Release Notes und ein Handbuch ohnehin das war, was die Leute wollten.

**Oder akzeptieren, dass Fork-Pull-Requests keine Vorschau bekommen.** Sichern Sie den Schritt mit `if: github.event.pull_request.head.repo.fork == false` ab, damit der Lauf grün wird mit einem übersprungenen Schritt statt rot mit einem 401, und sagen Sie das im Contributing-Guide. Eine Reviewerin bei einem Pull Request aus einem Fork hat noch den Rich-Diff-Umschalter, und eine Maintainerin, die die volle Behandlung braucht, kann den Branch ins Repository pushen, wo der Workflow wieder einen Schlüssel hat.

Noch eine Gewohnheit, unabhängig von Forks und billig, richtig zu machen: Interpolieren Sie nie einen Wert, den ein Mitwirkender kontrolliert — einen Pull-Request-Titel, einen Branch-Namen, eine Commit-Nachricht — direkt in ein `run:`-Skript. `${{ }}` ersetzt Text, bevor die Shell ihn überhaupt sieht, ein Titel mit einem Backtick oder `$( )` wird also zu einem Befehl, der mit allem läuft, was dieser Job hält. Legen Sie den Wert in `env:` und referenzieren Sie ihn als `$VAR`, was die Shell als Daten behandelt.

## Der Kommentar, und was sein Link zeigt

### Ein Kommentar, an Ort und Stelle aktualisiert

So wie ausgeliefert, postet die Action bei jedem Lauf einen neuen Kommentar. Bei einem Branch mit fünfzehn Pushes über drei Tage sind das fünfzehn Kommentare, vierzehn davon zeigen auf Commits, die niemand mehr reviewt, mit der eigentlichen Diskussion irgendwo mittendrin vergraben.

Die Abhilfe ist ein Sticky Comment: ein Kommentar, an Ort und Stelle neu geschrieben. `marocchino/sticky-pull-request-comment` ist die übliche Wahl — MIT-lizenziert, über eine `header`-Eingabe geschlüsselt, damit mehrere Workflows jeweils einen eigenen Kommentar besitzen können, ohne um denselben zu streiten, und sie will dasselbe `pull-requests: write`, das dieser Workflow schon deklariert (geprüft auf github.com, 9. September 2026). Schalten Sie den eigenen Kommentar der Action ab und übergeben Sie ihr die Ausgabe:

```yaml
      - id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          comment: false

      - if: steps.publish.outputs.urls != ''
        uses: marocchino/sticky-pull-request-comment@<commit-sha>
        with:
          header: markdown-preview
          message: |
            Rendered preview of the Markdown this pull request changes:

            ${{ steps.publish.outputs.urls }}
```

Der Tausch ist real und es wert, ihn bewusst zu treffen statt standardmäßig. Ein Sticky Comment überschreibt seine eigene Historie, der Thread hört also auf, ein Protokoll dessen zu sein, was der Branch bei jeder Reviewrunde sagte. Wo sich das Review über Tage zieht und jemand womöglich prüfen will, was er am Dienstag freigegeben hat, fügt die `append`-Eingabe der Action — die nur `true` und sonst nichts annimmt — jede neue Nachricht der vorherigen hinzu, statt sie zu ersetzen (geprüft auf github.com, 9. September 2026), die älteren Links bleiben also unter den neueren stehen, und der Thread bleibt ein Protokoll. Wo der Kommentar eine Statuszeile statt eines Protokolls ist, ersetzen Sie ihn und halten die Seite still.

Wo der Link hingeht, zählt genauso viel wie wie viele es sind. Setzen Sie ihn in den Kommentartext, nicht nur in die Zusammenfassung eines Checks — eine Reviewerin, die zu Details durchklicken muss, um einen Link zu finden, findet ihn nicht — und geben Sie jedem Link einen Namen, damit ein Pull Request, der vier Dokumente berührt, nicht vier nackte URLs präsentiert. Der eigene Kommentar der Action ist eine Tabelle aus Dateiname, Wortzahl und Link, was ungefähr das Minimum ist, das jemandem erlaubt zu entscheiden, was zuerst zu öffnen ist.

### Ein neues Dokument pro Push, keines, das überschrieben wird

Die Action veröffentlicht bei jedem Lauf ein frisches Dokument. Eine einzelne Seite zu überschreiben wäre optisch ordentlicher und schlechter zu benutzen, denn ein Überschreiben macht jeden alten Link zu einem Lügner. Jemand liest den Kommentar am Montag, folgt dem Link am Donnerstag, und bekommt Donnerstags Text unter Montags Freigabe.

Ein neues Dokument pro Push hält jeden Link an den Commit gepinnt, der ihn erzeugt hat, was den anhängenden Kommentar oben seinen zusätzlichen Lärm wert macht: gepinnte Links sind nur nützlich, solange noch etwas an ihnen festhält. Der Preis sind Dokumente: jeder Push kostet eines vom Kontolimit von 500 Dokumenten, und ein erreichtes Limit verweigert das Schreiben, statt still etwas zu löschen. Alte Vorschauen in großen Mengen aus der Historie löschen, oder mit `tp rm` über [die Kommandozeile](/blog/markdown-to-html-from-the-command-line).

### Wer den Link öffnen kann

`share` entscheidet, wer das Ergebnis öffnen kann.

| Wert | Wer es lesen kann |
| --- | --- |
| `link` | Jeder mit dem Link |
| `people` | Nur von Ihnen genannte Adressen, nach der Anmeldung |
| `none` | Niemand außer Ihnen — das Dokument landet in Ihrer Historie |

Öffentliches Repository, öffentliche Vorschau: `link` passt. Für ein privates Handbuch ist `people` ehrlich, mit einem Haken: Die Action veröffentlicht in diesem Modus ohne Adressliste, der erste Link öffnet sich also für niemanden, bis Sie die Leserinnen benennen — im Freigabedialog, oder mit `PUT /api/v1/documents/:id/share`. Eine Freigabe zu widerrufen verwirft das Token, ein bereits in einen Kommentar eingefügter Link funktioniert also nicht mehr. Setzen Sie `comment: false` für die `urls`-Ausgabe und gar keinen Kommentar.

Dieses Muster passt zu Repositories, in denen das Markdown das Endprodukt ist — [Dokumentation, die neben dem Code lebt](/blog/documentation-that-lives-in-the-repo), [Release Notes, für eine Leserin geschrieben, nicht für ein Commit-Log](/blog/release-notes-from-markdown), RFCs, Runbooks. Wenn Ihr Markdown eine statische Seite mit eigenem Theme und eigener Navigation füttert, rendert eine Vorschau-Deployment Ihres Hosters es richtig, und das hier nicht.

## Die Alternativen, und was jede kostet

Eine gehostete Seite ist eine Antwort auf die Frage, wo das gerenderte Dokument lebt. Sie ist nicht die einzige, und für manche Repositories ist sie nicht die richtige. Vier Alternativen decken ab, was Leute tatsächlich tun, und jede kauft etwas anderes.

| Wo die Seite lebt | Was der Aufbau kostet | Wer sie sehen kann | Wie lange sie hält |
| --- | --- | --- | --- |
| Ein Artefakt am Lauf (`actions/upload-artifact`) | ein Schritt, kein Schlüssel, kein Konto | jeder, der das Repository lesen kann, angemeldet bei GitHub — die Download-URL braucht einen Login | 90 Tage standardmäßig, 1 bis 90 mit `retention-days` |
| GitHub Pages (`actions/upload-pages-artifact`, dann `actions/deploy-pages`) | `pages: write` und `id-token: write`, eine `github-pages`-Umgebung, und eine Website, die Sie bereit sind zu überschreiben | das Internet, auf einer öffentlichen Pages-Site | bis zum nächsten Deployment, das sie ersetzt |
| Das konvertierte HTML zurück in den Branch committet | `contents: write`, ein Bot-Commit, und generiertes HTML in jedem zukünftigen Diff | jeder, der das Repository lesen kann | für immer, in der Historie |
| Eine gehostete Seite von einer API oder einer Action | ein Schlüssel in einem Secret, ein Konto, und die Limits dieses Kontos | wer auch immer der Freigabemodus erlaubt, mit oder ohne GitHub-Konto | bis jemand sie löscht |
| Nichts: der Rich-Diff-Umschalter | überhaupt kein Workflow | jeder, der den Pull Request öffnen kann | es ist ein Tab, kein Link |

(Artefakt-Aufbewahrung, die Pages-Berechtigungen und die Download-Anforderung geprüft auf github.com, 9. September 2026.)

**Das Artefakt ist das billigste und am wenigsten lesbare.** Ein Schritt, kein Schlüssel, kein Konto, und die Ausgabe hängt am Lauf, wo sie nicht auslaufen kann. Dann muss jemand den Lauf finden, zu den Artefakten scrollen, ein Zip herunterladen, entpacken und eine HTML-Datei von der eigenen Platte öffnen — was auch der Moment ist, in dem eine Seite, die ihr Stylesheet von einem CDN holt, aufhört, wie irgendetwas auszusehen, ein selbstständiger Export zählt hier also mehr als überall sonst. Und die Download-URL braucht einen GitHub-Login, was genau die Leserin ausschließt, für die diese ganze Übung gedacht war.

**GitHub Pages ist die richtige Antwort, wenn die Ausgabe eine Website ist.** `actions/deploy-pages` veröffentlicht ein zuvor hochgeladenes Artefakt auf Pages, und es braucht `pages: write` für das Deployment und `id-token: write`, damit das Deployment verifiziert werden kann, mit dem Job auf die `github-pages`-Umgebung ausgerichtet. Was es nicht ist, ist eine Pro-Branch-Vorschau: ein Repository hat eine Pages-Site, einen Pull Request vorzuschauen heißt also entweder, das Live-Deployment zu überschreiben, oder eine Pfadkonvention zu erfinden und sie später aufzuräumen, und nichts läuft von selbst ab.

**Das HTML zurückzucommitten funktioniert und vergiftet das Diff.** Es braucht `contents: write` — die Berechtigung, die der Rest dieses Artikels vermieden hat — und einen Bot-Commit, der den Workflow erneut auslöst, wenn Sie sich nicht dagegen absichern. Der bleibende Preis ist das Review: Jeder Pull Request trägt jetzt tausend Zeilen generierten Markups, die niemand liest und alle vorbeischrollen, plus Merge-Konflikte in einer Datei, die kein Mensch bearbeitet. Generierte Ausgabe gehört woanders hin als in den Quellbaum, und das ist der klarste Fall davon.

**Eine gehostete Seite kauft genau eine Sache: eine Leserin ohne Konto.** Das ist die ganze Rechtfertigung, und wenn niemand im Review sie braucht, ist das Artefakt billiger und der Rich Diff noch billiger. Sie kostet einen Schlüssel in einem Secret und ein Konto mit Limits — 500 Dokumente, 100 MB, und 4 MB für ein einzelnes Dokument. Diese Limits sind der Grund, alte Vorschauen aufzuräumen, statt ein Jahr an Pull Requests sich ansammeln zu lassen.

**Und eines, das nicht funktioniert: das HTML in den Kommentar einfügen.** GitHub rendert einen Kommentartext als eigenes Markdown und entfernt die Tags, auf die ein konvertiertes Dokument angewiesen ist, `style` allen voran. Ein Kommentar kann einen Link tragen. Er kann kein Dokument tragen.

## Zwanzig Dateien, zwei Rate-Limits, und die Arten, wie es scheitert

Ein umstrukturierender Pull Request berührt zwanzig Markdown-Dateien, und die Form des Jobs hört auf, ein Detail zu sein.

### Eine Schleife schlägt hier eine Matrix

Der Standard der Action ist ein Dokument pro Datei, konvertiert und veröffentlicht nacheinander innerhalb eines einzigen Jobs. Zwanzig Dateien sind zwanzig Anfragen in einem Prozess auf einem Runner, und es dauert etwa so lange wie eine Datei plus neunzehn Round-Trips.

Der Instinkt ist, mit einer Matrix zu fächern — die Dateiliste in einem Job bauen, sie mit `fromJSON` in `strategy.matrix` im nächsten Job einspeisen, und zwanzig Jobs parallel laufen lassen. Für Arbeit, die Minuten pro Element braucht, ist das genau richtig. Für eine Konvertierung, die einen Moment braucht, sind es zwanzig Runner-Zuteilungen, zwanzig Checkouts, zwanzig Action-Downloads und zwanzig Kommentare, sofern Sie sie nicht unterdrücken, um ein paar Sekunden API-Round-Trips zu sparen. Die Schleife gewinnt auf jeder Achse, die zählt.

Wenn Sie aus einem anderen Grund doch fächern, verhindern drei Einstellungen, dass es wehtut: `fail-fast: false`, damit eine fehlerhafte Datei nicht die anderen neunzehn abbricht; `max-parallel`, damit der Ausbruch zu einem Rinnsal wird; und ein abschließender Job, der die Ausgaben sammelt und einen einzigen Kommentar schreibt, denn zwanzig Kommentare sind schlimmer als keiner.

Die bessere Antwort für zwanzig zusammengehörige Dateien ist meist gar keine Parallelität. `merge: true` verkettet sie zu einem Dokument mit einem Link, und eine Reviewerin liest ein Handbuch der Reihe nach, statt zwanzig Tabs zu öffnen und den Faden zu verlieren. Die Reihenfolge wird dann zu dem, was man richtig hinbekommen muss, dasselbe Problem, das eine ordnerweite Konvertierung hat.

### Sechzig Aufrufe pro Minute, und tausend pro Stunde

Zwei Rate-Limits sitzen am Ende dieses Jobs, und sie gehören zu unterschiedlichen Systemen.

Die API zählt Aufrufe pro Anrufer pro Minute und verweigert den einundsechzigsten mit einem 429 und einem `Retry-After`, mit der Begründung, dass ein Schlüssel, der schneller läuft, in einer Schleife hängt statt zu arbeiten. Zwanzig Dateien in einer Schleife sind zwanzig Aufrufe und weit davon entfernt. Zwanzig parallele Jobs, jeder mit erneutem Versuch bei einem Timeout, auf einem Repository, in dem drei Pull Requests gleichzeitig offen sind, ist, wie ein großzügig klingendes Limit gefunden wird.

GitHubs eigenes Limit sitzt auf dem Kommentar: `GITHUB_TOKEN` bekommt 1.000 Anfragen pro Stunde pro Repository, geteilt über jeden Workflow in diesem Repository (geprüft auf docs.github.com, 9. September 2026). Ein Kommentar pro Lauf ist nichts. Ein Kommentar pro Datei, auf einem geschäftigen Monorepo, neben jedem anderen Workflow, der aus demselben Budget ausgibt, ist ein 403 an einem Dienstagnachmittag, den niemand mit der Änderung von Montag verbindet. Ein Sticky Comment pro Lauf ist die günstige Antwort auf beide Limits zugleich.

### Wann der Job rot wird, und wann er grün wird und lügt

Vier Fehlerarten machen fast alle davon aus. Drei kündigen sich an. Die vierte ist die, um die man sich Sorgen machen muss.

**Ein Body, den die Plattform verweigert.** Die Konvertierung akzeptiert bis zu 10 MB, aber ein in einem Konto gehaltenes Dokument ist auf 4 MB gedeckelt, und der Grund ist keine Policy: Eine Vercel-Function verweigert eine Anfrage oder eine Antwort mit einem Body über 4,5 MB, bevor irgendein Code von uns läuft, ein größeres Dokument könnte also weder gespeichert noch zurückgelesen werden, und die aufrufende Seite bekäme den nackten 413 der Plattform statt eines erklärenden Satzes. In der CI ist der Hinweis, welchen Fehler man bekommt — ein JSON-Body mit einer lesbaren Nachricht heißt, die Anfrage hat die API erreicht und wurde von ihr abgelehnt; ein nackter 413 ohne Body heißt, sie ist nie angekommen. So oder so ist die Abhilfe dieselbe, und es ist selten „das Dokument aufteilen“: eine 4-MB-Markdown-Datei ist meist generierte Ausgabe, die nie in der Vorschau hätte sein sollen, wofür der `paths`-Filter und eine explizite `files`-Liste da sind.

**Ein Token, das abgelaufen ist.** Zwei verschiedene Token können damit gemeint sein. `GITHUB_TOKEN` wird für den Job geprägt und funktioniert nicht mehr, wenn der Job endet, was nur zubeißt, wenn Sie versuchen, ihn außerhalb des Laufs an etwas zu übergeben. Der API-Key ist der, der in der Praxis abläuft — widerrufen von wem auch immer ihn rotiert hat, oder gelöscht mit dem Konto. Das Symptom ist ein 401 bei jedem Lauf, auch bei Neuläufen von Läufen, die letzte Woche bestanden, und das ist die Diagnose: nichts im Repository hat sich geändert, nichts im Repository ist also die Ursache. Schlüssel werden als Hash gespeichert und einmal angezeigt, es gibt also nichts zu inspizieren; einen neuen prägen, das Secret aktualisieren, erneut laufen lassen.

**Ein Secret, das nie da war.** Ein unter falschem Namen referenziertes Secret ist kein Fehler. Es interpoliert zu einer leeren Zeichenkette, der Schritt läuft ohne Schlüssel, und der Fehler taucht bei der API als 401 auf, das sich wie ein falscher Schlüssel liest statt wie ein fehlender. Sie können nicht direkt darauf testen, denn der `secrets`-Kontext ist weder auf Job- noch auf Schritt-Ebene in einem `if` verfügbar (geprüft auf docs.github.com, 9. September 2026). Kopieren Sie es auf Job-Ebene in `env` und testen Sie stattdessen die Variable:

```yaml
jobs:
  preview:
    runs-on: ubuntu-latest
    env:
      HAS_KEY: ${{ secrets.TP_API_KEY != '' }}
    steps:
      - if: env.HAS_KEY == 'true'
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

**Ein Dokument, das konvertiert und leer ist.** Das ist das gefährliche, denn alles ist grün. Eine Datei, die nur aus YAML-Frontmatter besteht, konvertiert zu einem Dokument ohne Body. Ebenso eine Datei, deren Inhalt ein einziger HTML-Kommentar ist, oder eine Seite, deren Text in einem Template-Tag lebt, das der Konverter nicht ausführt. Der Workflow gelingt, der Kommentar wird gepostet, der Link öffnet eine leere Seite, und die Reviewerin nimmt an, die leere Seite sei das Dokument. Sichern Sie es mit der Wortzahl ab, die die Action ohnehin meldet:

```yaml
      - if: steps.publish.outputs.documents != ''
        env:
          DOCUMENTS: ${{ steps.publish.outputs.documents }}
        run: |
          node -e '
            const docs = JSON.parse(process.env.DOCUMENTS || "[]");
            const empty = docs.filter((d) => d.words < 20);
            if (empty.length > 0) {
              console.error(`Empty after conversion: ${empty.map((d) => d.name).join(", ")}`);
              process.exit(1);
            }
          '
```

Zwanzig Wörter sind willkürlich, und das ist in Ordnung — der Punkt ist nicht die Schwelle, sondern dass ein Dokument, das niemand lesen kann, den Lauf jetzt scheitern lässt statt ihn bestehen zu lassen.

## Derselbe Job auf GitLab, und auf einem Runner, den Sie besitzen

Nichts davon oben handelt wirklich von GitHub. Der Job ist: herausfinden, was sich geändert hat, es konvertieren, es veröffentlichen, und den Link dorthin legen, wo die Reviewerin ist. Nur die letzten beiden Zeilen davon sind hostspezifisch.

Auf GitLab passen die Teile fast eins zu eins. `rules:changes` ist der `paths`-Filter. `interruptible: true` ist, was einen Job abbrechbar macht, wenn eine neuere Pipeline ihn ersetzt, und `resource_group` begrenzt die Nebenläufigkeit, wo Jobs sich nicht überschneiden dürfen. `CI_MERGE_REQUEST_DIFF_BASE_SHA` ist in der Dokumentation als der Basis-SHA des Merge-Request-Diffs beschrieben, was der Commit ist, gegen den zu diffen ist, und `CI_MERGE_REQUEST_IID` ist die Nummer in der URL des Merge Requests, wogegen ein Kommentar gepostet wird. Das Problem des flachen Klons ist dasselbe Problem mit einem anderen Regler: der Runner klont standardmäßig flach, und `GIT_DEPTH` ist, was das ändert (alles geprüft auf docs.gitlab.com, 9. September 2026).

```yaml
markdown-preview:
  image: node:lts-alpine
  interruptible: true
  variables:
    GIT_DEPTH: 0
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes:
        - '**/*.md'
  script:
    - files=$(git diff --name-only --diff-filter=d
        "$CI_MERGE_REQUEST_DIFF_BASE_SHA"...HEAD -- '*.md')
    - node tp.mjs push $files --share link --json > documents.json
```

Auf einem Runner, der Ihnen gehört — Jenkins, Buildkite, ein Cron-Job auf einer Kiste im Schrank —, sind zwei der vier Teile schlicht nicht da. Es gibt keine Event-Payload, Sie ermitteln die Basis also selbst mit `git merge-base origin/main HEAD`, und es gibt keinen Pull Request zum Kommentieren, der Link geht also dorthin, wo Ihr Team tatsächlich liest: eine Chat-Nachricht, eine Build-Annotation, eine E-Mail. Was unverändert bleibt, sind der Diff und die Anfrage, und die Anfrage ist der Teil, den es sich lohnt, sorgfältig zu gestalten, denn [eine Konvertierungs-API ist nur so brauchbar wie ihre Fehlermeldungen und ihre veröffentlichten Limits](/blog/converting-documents-with-an-api). Wenn der Job einen ganzen Baum statt einer geänderten Handvoll konvertiert, [ist das Aufzählen und Ordnen der Dateien die schwerere Hälfte](/blog/batch-convert-markdown-files).

## Wie man wählt, was zu veröffentlichen ist

1. **Klären Sie, wer die Leserin ist, bevor Sie ein Ziel wählen.** Wenn jeder, dessen Zustimmung zählt, ein GitHub-Konto hat, sind der Rich Diff und ein Artefakt kostenlos, und Sie können aufhören zu lesen; der Workflow verdient sich seinen Aufwand nur, wenn eine der Leserinnen keins hat, denn dann ist ein Link das einzige Artefakt, das funktioniert.
2. **Veröffentlichen Sie beim Push auf den Default-Branch, außer Sie brauchen wirklich die Vorschau vor dem Merge.** Das entfernt die Fork-Frage, die Token-Frage und die Hälfte der Fehlermodi in einem Zug, und der Preis ist, dass das Review weiterhin auf dem Diff stattfindet.
3. **Greifen Sie nie zu `pull_request_target`, um Fork-Vorschauen zum Laufen zu bringen.** Es übergibt Ihre Secrets an einen Job, der gerade dabei ist, fremden Code auszuchecken, und der Fehlermodus ist kein roter Lauf, den Sie beheben können, es ist ein Schlüssel, den Sie rotieren müssen, und eine Historie, die Sie prüfen müssen.
4. **Sichern Sie den Veröffentlichungsschritt so ab, dass die unangenehmen Fälle übersprungen werden statt zu scheitern.** Kein Markdown geändert, oder der Pull Request kam aus einem Fork: ein grüner Lauf mit einem übersprungenen Schritt hält den Check vertrauenswürdig, und ein Check, dem niemand vertraut, ist ein Check, den niemand liest, wenn es endlich zählt.
5. **Behalten Sie einen Kommentar pro Pull Request und ein Dokument pro Push.** Ein Kommentar, weil ein Thread mit fünfzehn Einträgen ein Thread ist, den niemand bis zum Ende durchscrollt; ein neues Dokument pro Push, weil das Überschreiben einer Seite jeden Link im Thread zu einem Lügner darüber macht, welchen Commit er beschreibt.
6. **Zählen Sie die Anfragen, bevor Sie fächern.** Zwanzig Dateien in einem Job sind zwanzig Aufrufe; zwanzig Jobs sind zwanzig Runner, zwanzig Checkouts und zwei Rate-Limits, und ein Limit verweigert statt einzureihen.
7. **Prüfen Sie, was die Reviewerin sieht, nicht was der Lauf sagt.** Öffnen Sie den Link aus dem Kommentar, abgemeldet, auf einem Telefon, und sehen Sie, ob es das Dokument ist. Ein Workflow kann durchweg grün sein und trotzdem eine leere Seite veröffentlichen.

Prosa in einem Diff zu prüfen ist Raten, und die ganze Abhilfe ist eine Datei: ein Trigger mit einem `paths`-Filter, eine Concurrency-Gruppe, zwei Berechtigungen, ein Secret, und ein Schritt, der veröffentlicht, was der Branch geändert hat, und einen Link dort hinterlässt, wo eine Reviewerin ihn tatsächlich sieht. Beginnen Sie mit dem Repository, dessen Markdown von jemandem gelesen wird, der keinen Code schreibt, öffnen Sie einen Pull Request gegen eine Datei, die eine echte Bearbeitung braucht, und sehen Sie, ob der erste zurückkommende Kommentar den Text betrifft statt die Formatierung. Um zu sehen, wie die Ausgabe aussieht, bevor Sie einen Schlüssel dafür prägen, konvertieren Sie die Datei zuerst von Hand — [TransformPipes Markdown-zu-HTML-Konvertierung](/) läuft in Ihrem Browser, kostenlos, und abgemeldet wird die Datei nirgendwohin hochgeladen.

## FAQ

### Kann ich Markdown aus einem auf einem Fork geöffneten Pull Request vorschauen?

Nicht mit einem Secret, und das ist Absicht. Ein `pull_request`-Event aus einem Fork bekommt ein Nur-Lese-`GITHUB_TOKEN` und keine Repository-Secrets, der Veröffentlichungsschritt hat also keinen Schlüssel und der Kommentarschritt keinen Schreib-Scope. Veröffentlichen Sie stattdessen beim Push auf den Default-Branch, oder sichern Sie den Schritt ab, damit der Pull Request eines Forks ihn sauber überspringt.

### Ist `pull_request_target` jemals sicher?

Nur wenn der Job den Inhalt des Pull Requests nie berührt — kein Checkout des Heads, kein Ausführen von irgendetwas aus dem Branch, keine Abhängigkeitsinstallation, die ein Skript daraus ausführen könnte. Für Labeling und Triage ist das erreichbar. Für alles, was die Dateien des Beitragenden liest, nehmen Sie das Zwei-Workflow-Muster mit `workflow_run`, oder tun Sie es gar nicht.

### Warum tut mein Workflow nichts, wenn ich pushe?

Meist der `paths`-Filter: er wird gegen die vom Pull Request geänderten Dateien ausgewertet, ein Push, der keine passende Datei berührt, reiht einen Lauf also nie ein. Die verwandte Falle ist, einen `paths`-gefilterten Workflow zu einem erforderlichen Statuscheck zu machen — er berichtet nie über die Pull Requests, die er überspringt, das Mergen wartet also auf einen Check, der nie ankommt.

### Brauche ich `fetch-depth: 0` wirklich?

Nur wenn etwas im Job gegen den Basis-Commit diffed, was die geänderte Dateiliste erzeugt. Ein flacher Klon enthält diesen Commit nicht, der Diff scheitert also oder meldet nichts. Die Dateien ausdrücklich zu benennen umgeht es, ebenso eine Action, die GitHubs API statt git nach der Liste fragt.

### Wie stoppe ich den Bot, der bei jedem Push kommentiert?

Schalten Sie den eigenen Kommentar der Action mit `comment: false` ab und posten Sie stattdessen einen Sticky Comment, geschlüsselt über einen Header, damit derselbe Kommentar bei jedem Lauf an Ort und Stelle neu geschrieben wird. Halten Sie die Links selbst trotzdem pro Push unterschiedlich — ein Dokument für jeden Commit wiederzuverwenden lässt ältere Links im Thread einen Text beschreiben, der nicht mehr existiert.

### Was passiert, wenn ein Pull Request zwanzig Dateien berührt?

Die Action veröffentlicht zwanzig Dokumente aus einem Job und kommentiert eine Tabelle mit zwanzig Zeilen, was in Ordnung ist. Sie mit `merge: true` zu einem Dokument zu verketten ist meist besser für eine Leserin. Eine Matrix aus zwanzig parallelen Jobs ist die Option, die zu vermeiden ist: mehr Einrichtungsaufwand als Konvertierungsaufwand, und zwei Rate-Limits, die am Ende davon warten.

### Kann ich das ohne Konto oder API-Key tun?

Ja, mit weniger. Konvertieren Sie die Datei in einem Browser und fügen Sie den Link selbst ein, oder lassen Sie den Workflow das gerenderte HTML als Artefakt anhängen, was keinen Schlüssel und kein Konto braucht — die Leserin muss nur bei GitHub angemeldet sein, um es herunterzuladen. Der Schlüssel kauft eine Sache: einen Link, der sich für jemanden öffnet, der überhaupt kein GitHub-Konto hat.
