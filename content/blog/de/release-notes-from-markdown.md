---
title: "Release Notes, die tatsächlich gelesen werden"
description: "Release Notes statt eines Commit-Logs schreiben: die sechs Typen von Keep a Changelog, was ein Breaking Change bedeutet, und was Generatoren nicht schreiben können"
date: 2026-08-14
tag: Workflow
keywords: release notes markdown, changelog markdown, keep a changelog, changelog format, release notes vorlage, semantic versioning breaking change, conventional commits changelog, changelog generator
---

Die meisten Changelogs sind ein Commit-Log mit entfernten Hashes. „Token-Handler überarbeitet.“ „Abhängigkeit angehoben.“ „Randfall im Parser behoben.“ Jede Zeile stimmt, und keine davon hilft der Person, die entscheidet, ob sie diese Woche aktualisiert. Release Notes sind ein anderes Dokument mit einer anderen Aufgabe: Sie sagen, was sich für den Leser geändert hat, was bricht, und was zu tun ist.

### Kurzfassung

Keep a Changelog gibt Ihnen sechs Änderungstypen — Added, Changed, Deprecated, Removed, Fixed, Security — und eine `Unreleased`-Überschrift, die die Gewohnheit festigt, denn es gibt immer einen Ort für die Zeile, während die Änderung noch frisch ist (geprüft auf keepachangelog.com, 9. September 2026). Semantic Versioning sagt dem Leser, wie viel Aufmerksamkeit nötig ist, aber nur, wenn das Projekt festgelegt hat, was ein Breaking Change für es bedeutet. Generatoren — GitHubs eigene Release Notes, release-please, semantic-release, git-cliff, changesets, auto-changelog — setzen die Liste aus Commits oder aus Changeset-Dateien zusammen, und keiner von ihnen kann die zwei Sätze schreiben, die sagen, warum dieses Release existiert und wer es überspringen kann. Behalten Sie die Datei im Repository, als Markdown, schreiben Sie den menschlichen Teil von Hand, und konvertieren Sie sie, wenn jemand außerhalb des Repositorys einen Link braucht.

Die Reibung ist nicht, dass Changelogs schwer zu schreiben sind. Es ist, dass niemand entschieden hat, für wen sie sind. Eine Datei, die dem Maintainer dienen muss, der eine Regression bisektiert, dem Kunden, der entscheidet, ob er über ein Wochenende aktualisiert, und dem Integrator, dessen Parser gleich bricht, wird keinem von ihnen dienen, denn diese drei Leser wollen unterschiedliche Dinge aus denselben zwölf Zeilen.

Die zweite Reibung ist das Timing. Release Notes, die am Release-Abend geschrieben werden, werden aus `git log` rekonstruiert, und bei der Rekonstruktion gehen die Gründe verloren: Die Person, die die Zeile schreibt, sieht, dass sich ein Standardwert geändert hat, und kann sich nicht erinnern, welches Support-Ticket ihn nötig gemacht hat. Bis dahin ist das einzig noch Billige eine Liste, eine Liste wird also ausgeliefert.

## Was in Release Notes gehört, und was ins Commit-Log

Das Commit-Log hält fest, wie der Code hierher kam, für den, der in achtzehn Monaten eine Regression bisektieren muss. Release Notes sind für jemanden, der den Code nie gesehen hat und zehn Sekunden Zeit hat.

| Die Änderung | Commit-Log | Release Notes |
| --- | --- | --- |
| Retry-Logik umgeschrieben | `refactor(http): replace retry loop with backoff` | Fehlgeschlagene Anfragen werden dreimal mit wachsender Verzögerung wiederholt. Nichts zu konfigurieren. |
| Config-Schlüssel umbenannt | `feat: rename apiKey to api_key` | `apiKey` heißt jetzt `api_key`. Der alte Name funktioniert weiter und protokolliert eine Warnung. |
| Tabellenparser behoben | `fix: off-by-one in table row parser` | Einspaltige Tabellen verlieren ihre letzte Zeile nicht mehr. |

Drei Tests für eine Kandidatenzeile: Das Verhalten des Lesers ändert sich, er hätte den Fehler treffen können, oder er würde den Unterschied unaufgefordert bemerken. Eine Zeile, die alle drei nicht besteht, bleibt im Commit-Log. Interne Refactorings und Abhängigkeits-Updates, die nichts Beobachtbares ändern, bleiben ebenfalls dort.

Keep a Changelog macht dasselbe Argument aus der anderen Richtung und warnt davor, ein Commit-Log-Diff überhaupt als Changelog zu verwenden: Es ist voller Merge-Commits, unklarer Titel und Dokumentationsänderungen, die begraben, wonach der Leser eigentlich kam (geprüft auf keepachangelog.com, 9. September 2026). Das ist keine Beschwerde über Commit-Hygiene. Eine gut geschriebene Commit-Nachricht ist immer noch für einen Reviewer geschrieben, der den Diff daneben offen hat, und der Leser von Release Notes hat keinen Diff und auch nicht vor, einen zu finden.

Es lohnt sich, ein drittes Dokument abzutrennen, denn es ist das, das am häufigsten in ein Changelog geschmuggelt wird: der Migrationsleitfaden. Ein Changelog-Eintrag ist eine Zeile und ein Link. Ein Migrationsleitfaden ist eine Seite mit Codebeispielen, einer Reihenfolge der Arbeitsschritte, und dem Teil über das vorherige Leeren der Queue. Sie zu vermischen heißt, dass die Person, die nach Breaking Changes überfliegt, das Tutorial lesen muss, und die Person, die die Migration macht, das Tutorial in einer Liste finden muss.

## Die sechs Änderungstypen, und was unter jeden gehört

Keep a Changelog 1.1.0 definiert sechs Typen, und der Grund, dort zu beginnen, statt eigene zu erfinden, ist nicht ästhetisch: Die Kategorien sind Konsequenzen, ein Leser, dem eine davon wichtig ist, kann also eine Überschrift lesen und gehen. Die Spezifikation ist MIT lizenziert, und ihre Leitprinzipien sind kurz — Changelogs sind für Menschen, jede Version bekommt einen Eintrag, Änderungen sind nach Typ gruppiert, Versionen und Abschnitte sind verlinkbar, neueste zuerst, Release-Daten werden gezeigt, und Semantic Versioning wird befolgt (geprüft auf keepachangelog.com, 9. September 2026).

| Typ | Was darunter gehört | Was nicht | Was der Leser damit tut |
| --- | --- | --- | --- |
| Added | Neue Endpunkte, Einstellungen, Befehle, Bildschirme, akzeptierte Formate, Berechtigungen | Eine neue interne Klasse; ein neuer Test; ein neuer Build-Schritt | Liest es, wenn er darauf gewartet hat, überspringt es sonst |
| Changed | Standardwerte, Grenzen, Zeiten, Sortierreihenfolge, Formulierung, Ausgabeform, Fehlercodes | Eine Neufassung mit identischem beobachtbarem Verhalten | Prüft, ob eine seiner Annahmen noch gilt |
| Deprecated | Alles, was noch funktioniert und ein festgelegtes Ende hat | Etwas, das Ihnen nicht gefällt, das zu entfernen Sie aber nicht planen | Plant Arbeit vor dem genannten Datum ein |
| Removed | Endpunkte, Flags, Config-Schlüssel, Formate, Plattform- und Laufzeit-Unterstützung | Toter interner Code, den niemand aufrufen konnte | Hält inne, liest die Migrationszeile, plant das Upgrade |
| Fixed | Falsches Verhalten, das ein Leser plausibel getroffen haben könnte | Ein Fehler, eingeführt und behoben innerhalb desselben Release | Findet heraus, ob er betroffen war, und seit wann |
| Security | Behobene Schwachstellen, mit Schweregrad und dem, was offenlag | Härtung, der niemand ausgesetzt war — das ist Changed | Patcht jetzt, oder erklärt jemandem, warum nicht |

### Added

Neue Fähigkeit, beschrieben als etwas, das der Leser jetzt tun kann, statt als etwas, das Sie gebaut haben. „Exporte lassen sich nach Datumsbereich filtern“ ist ein Eintrag; „Datumsbereichsfilter-Unterstützung zum Export-Service hinzugefügt“ ist ein Statusbericht. Added ist der Abschnitt, den Leute zuletzt überfliegen und am leichtesten überfüllen, denn jedes geschlossene Ticket fühlt sich wie eine Ergänzung an. Kann niemand außerhalb des Teams es erreichen, ist es noch keine Ergänzung.

### Changed

Der am wenigsten genutzte und teuerste Abschnitt. Changed ist, wo sich Standardwerte verschieben, Grenzen enger werden, Timeouts schrumpfen, Fehlercodes spezifischer werden und sich die Sortierreihenfolge umdreht — nichts davon ist eine Fehlerbehebung, und alles davon kann jemanden brechen, der Code gegen das alte Verhalten geschrieben hat. Jede Changed-Zeile sollte den alten und den neuen Wert tragen, denn „Rate-Limiting verbessert“ sagt dem Leser nichts, worauf er reagieren kann, und „die Burst-Erlaubnis liegt bei 60 Anfragen, runter von 120“ sagt ihm genau, ob es ihn betrifft.

### Deprecated

Eine Deprecation ohne Datum ist keine Deprecation, sie ist eine Meinung. Der Eintrag braucht drei Dinge: was veraltet ist, was stattdessen zu nutzen ist, und wann es aufhört zu funktionieren — eine Version, ein Datum, oder beides. Deprecated ist auch der einzige Abschnitt, der etwas beschreibt, das noch nicht passiert ist, weshalb es der ist, den Leser überspringen, und der sie am meisten kostet, wenn sie es tun.

### Removed

Der Abschnitt, der entscheidet, ob ein Upgrade sicher ist, er steht also nahe am Anfang des Eintrags, egal was die Reihenfolge der Spezifikation nahelegt. Jede Zeile braucht den Ersatz und die Form der Arbeit: nicht nur, dass `/v1/export` weg ist, sondern dass `/v2/exports` denselben Body zurückgibt, mit `id` als String. Eine Removed-Zeile ohne Ersatz ist in Ordnung, wenn es wirklich keinen gibt, und dann sagen Sie das klar, statt den Leser suchen zu lassen.

### Fixed

Fixed wird von Leuten gelesen, die herausfinden, ob ein Problem, das sie hatten, dieses Problem war. Das macht den betroffenen Zustand nützlicher als den Mechanismus: „Uploads über 2 GB scheiterten still bei Verbindungen langsamer als 1 Mbit/s“ lässt einen Leser sein eigenes Symptom abgleichen, während „eine Race Condition im Chunked-Upload-Handler behoben“ das nicht tut. Ändert eine Behebung Verhalten, auf das sich manche verlassen hatten, gehört sie auch nach Changed, oder stattdessen.

### Security

Nennen Sie den Schweregrad, was ein Angreifer tun konnte, und ob die Ausnutzung Authentifizierung brauchte. Nutzen Sie CVE-Kennungen oder eine Schweregradskala, nutzen Sie sie konsistent, denn ein Leser, der außerhalb der Arbeitszeit entscheidet, ob er patcht, betreibt Risiko-Arithmetik und braucht die Eingaben dafür. Security-Einträge sind auch die, die am häufigsten von jemandem gelesen werden, der kein Kunde ist — ein Auditor, ein Beschaffungsfragebogen, ein Sicherheitsteam —, sie überleben das Release also um Jahre.

### Der Unreleased-Abschnitt als Arbeitsgewohnheit

Keep a Changelog setzt eine `Unreleased`-Überschrift ganz oben, damit Leser sehen können, was kommt, und damit ein Release zu einer Sache des Verschiebens von Inhalt wird statt ihn zu schreiben (geprüft auf keepachangelog.com, 9. September 2026). Die Gewohnheit zählt mehr als die Überschrift. Existiert `Unreleased`, kann der Pull Request, der einen Standardwert ändert, die Zeile hinzufügen, die ihn beschreibt, geprüft von derselben Person, die die Änderung prüft, in dem Moment, in dem sich beide noch erinnern, warum.

Das macht aus einer schwierigen Frage — was hat sich in den letzten sechs Wochen geändert — fünfzig leichte. Es gibt der Review auch etwas zu fangen: ein Pull Request, der beobachtbares Verhalten ändert und keine Changelog-Zeile berührt, ist eine sichtbare Auslassung, die billigste mögliche Durchsetzung. Die Kosten sind Merge-Konflikte, denn jeder bearbeitet dieselben Zeilen am Anfang derselben Datei. Zwei Dinge verringern sie: den neuesten Eintrag oben in jedem Unterabschnitt halten, damit Ergänzungen an einem Ort landen, oder zu einer Datei pro Änderung wechseln, was das Problem ist, das Changesets lösen soll.

### Nach Wirkung gruppieren, nicht nach Komponente

Notizen in `auth-service`, `billing-worker` und `web` aufzuteilen beschreibt, wie die Arbeit geteilt wurde, nicht, wie sie ankommt. Ein Leser, der fragt, ob dieses Release seine Integration bricht, muss jeden Abschnitt lesen, und wird keinen davon lesen.

Keep a Changelog listet Added zuerst, aber nichts schreibt diese Reihenfolge fest. Removed und Changed beantworten die Frage, mit der die meisten Leser ankommen, führen Sie also mit ihnen, dann Security, dann Fixed, dann Added. Die Spezifikation ist eine Struktur, kein Stylesheet.

In einem Monorepo, wo Teams die Pakete der anderen konsumieren, ist die Gruppierung nach Komponente die bessere Antwort: Jeder Leser besitzt einen Dienst und will nur seinen Abschnitt. Zwei Dokumente regeln das meist — Komponentengruppierung für die, die es bauen, Wirkungsgruppierung für die, die es benutzen —, und das zweite lässt sich oft genug aus dem ersten ableiten, dass es sich lohnt, die Quelle so anzuordnen.

### Ein Changelog-Format zum Kopieren

Die Struktur ist reines Markdown, und das ist der Punkt: Es diffed, es lässt sich prüfen, und es konvertiert.

```markdown
## [Unreleased]

## [1.4.0] - 2026-08-14

### Removed
- The `/v1/export` endpoint. Use `/v2/exports`; the response is identical
  apart from `id`, now a string.

### Changed
- Session cookies last 30 days instead of 7. Existing sessions are unaffected.

### Fixed
- Uploads over 2 GB no longer fail silently on slow connections.

[Unreleased]: https://example.com/compare/v1.4.0...HEAD
[1.4.0]: https://example.com/compare/v1.3.0...v1.4.0
```

ISO-8601-Daten sortieren korrekt und lassen sich über Regionen hinweg nicht falsch lesen, weshalb die Spezifikation danach verlangt (geprüft auf keepachangelog.com, 9. September 2026). Link-Referenzen am Ende zeigen jede Version auf ihren eigenen Diff, und sie als Referenz-Links statt als Inline-URLs zu halten hält die Einträge in der Rohdatei lesbar — und dort werden die meisten Leute sie lesen.

Zwei Details ersparen spätere Streits. Benutzen Sie `## [1.4.0]` statt einer Überschrift oberster Ebene pro Version, damit die Datei einen Titel hat und jede Version auf derselben Ebene sitzt; eine Dokumentations-Site, die die Datei rendert, erzeugt sonst eine Seite mit mehreren konkurrierenden Titeln. Und halten Sie die ganze Historie in einer Datei, bis sie wirklich unhandlich wird, an welchem Punkt Sie nach Jahr archivieren statt nach Hauptversion, denn Leser suchen nach Daten.

## Versionen, Breaking Changes, und die Commits darunter

Eine Versionsnummer ist ein Versprechen, wie sorgfältig zu lesen ist. Semantic Versioning 2.0.0 formuliert es in je einer Zeile: MAJOR für inkompatible API-Änderungen, MINOR für rückwärtskompatibel hinzugefügte Funktionalität, PATCH für rückwärtskompatible Fehlerbehebungen (geprüft auf semver.org, 9. September 2026).

| Anstieg | Was er dem Leser verspricht | Was er tun sollte |
| --- | --- | --- |
| PATCH | Nichts, worauf er sich verlässt, hat die Form geändert | Aktualisieren, nur Fixed und Security lesen |
| MINOR | Neues existiert; Altes verhält sich wie zuvor | Aktualisieren, Added überfliegen auf das, worauf er wartete |
| MAJOR | Etwas, worauf er sich verlassen könnte, ist weg oder anders | Removed und Changed vollständig lesen, die Arbeit planen |

Das Versprechen gilt nur, wenn das Projekt gesagt hat, was seine öffentliche Oberfläche ist. Die Spezifikation ist ausdrücklich, dass Software, die Semantic Versioning nutzt, eine öffentliche API deklarieren muss, im Code oder in der Dokumentation, und dass die Deklaration präzise und umfassend sein sollte (geprüft auf semver.org, 9. September 2026). Die meisten Projekte lassen das aus, und dann wird jeder Streit darüber, ob eine Änderung brach, zu einem Streit über Absichten.

### Was für dieses Projekt als Breaking Change zählt

Das ist die einzige Versionsfrage, die ein Leser tatsächlich hat, und keine Spezifikation kann sie beantworten, denn „inkompatibel“ hängt davon ab, was Sie versprochen haben. Schreiben Sie die Antwort einmal auf, im Contributing Guide, und das Release-Gespräch wird kurz. Eine vernünftige Startliste dessen, was zählt:

- Etwas Aufrufbares entfernen oder umbenennen: einen Endpunkt, ein Flag, einen Config-Schlüssel, eine exportierte Funktion, einen Event-Namen.
- Ein Feld aus einer Antwort entfernen, oder seinen Typ ändern. Eines hinzuzufügen ist meist sicher; ein optionales Feld verpflichtend zu machen nicht.
- Validierung verschärfen, sodass Eingabe, die früher akzeptiert wurde, jetzt abgelehnt wird.
- Einen Standardwert ändern, wenn der alte Standard Arbeit für Leute erledigte, die den Wert nie gesetzt haben.
- Einen Fehlercode, einen Exit-Status, oder die Form eines Fehler-Bodys ändern, nach dem Aufrufer verzweigen.
- Unterstützung für eine Laufzeitumgebung, ein Betriebssystem oder eine Datenbankversion fallen lassen.
- Die Ausgabereihenfolge ändern, wenn nichts die Reihenfolge versprochen hat, sich aber alle darauf verlassen haben.
- Einen Fehler auf eine Weise beheben, die Verhalten entfernt, auf das Leute gebaut haben. Das ist ein echt umstrittener Punkt, und die ehrliche Handhabung ist, ihn sowohl in Changed als auch in Fixed zu nennen und zu sagen, wer betroffen ist.

Dann die Dinge, die zuverlässig Streit auslösen und im Voraus zu entscheiden sich lohnt: Log-Format, Metriknamen, HTML-Klassennamen, das Datenbankschema für jeden, der es direkt abfragt, und alles, was über Reflection oder eine Plugin-Schnittstelle erreichbar ist. Sind diese nicht Teil der öffentlichen Oberfläche, sagen Sie das, bevor sich jemand darauf verlässt.

### Version null, und die Vorab-Release-Ausweichklausel

Hauptversion null ist für die anfängliche Entwicklung: Alles kann sich jederzeit ändern, und die öffentliche API sollte nicht als stabil gelten (geprüft auf semver.org, 9. September 2026). Das ist eine echte Lizenz, sich zu bewegen, und sie läuft in dem Moment ab, in dem jemand das Ding in Produktion bringt. Sind Sie auf `0.x`, und das Changelog hat aufgehört, Breaking Changes zu erwähnen, weil sie erlaubt sind, versteckt die Versionsnummer jetzt Information vor dem Leser, statt sie ihm zu geben.

Vorab-Release-Kennungen — der Teil nach einem Bindestrich — sind zum Ausliefern an Leute, die das Risiko akzeptiert haben, und Build-Metadaten nach einem Pluszeichen werden beim Vergleich von Versionen vollständig ignoriert (geprüft auf semver.org, 9. September 2026). Keines von beiden ersetzt einen Changelog-Eintrag. Wer auf `2.0.0-rc.1` aktualisiert, braucht die Liste immer noch, und wohl mehr als jeder andere.

### Conventional Commits als Eingabeseite

Soll ein Generator die Liste schreiben, muss ihm etwas sagen, welche Commits zählen. Conventional Commits 1.0.0 ist die übliche Antwort: eine Nachricht in der Form `<typ>[optionaler-scope]: <beschreibung>`, mit optionalem Body und Footern. Sie benennt `feat` und `fix` und erlaubt andere, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` und `test` werden vorgeschlagen. Breaking Changes werden entweder durch einen `BREAKING CHANGE:`-Footer oder durch ein `!` vor dem Doppelpunkt signalisiert, und die Abbildung auf Versionen ist direkt: `fix` ist ein PATCH, `feat` ist ein MINOR, und ein Breaking Change jeden Typs ist ein MAJOR (geprüft auf conventionalcommits.org, 9. September 2026).

Das lohnt sich zu übernehmen, und es lohnt sich, ehrlich zu sein, was es bringt. Es macht Generierung möglich: Ein Werkzeug kann Commits in Abschnitte sortieren und die nächste Version berechnen, ganz ohne Mensch im Loop. Es macht die Notizen nicht gut. Die Konvention schränkt das Präfix ein, nicht den Satz danach, und `feat(export): add dateFrom param to POST /exports` ist ein korrekter Conventional Commit und eine schwache Changelog-Zeile.

### Was die Konvention nicht behebt

Vier Lücken, die alle in generierter Ausgabe auftauchen:

- **Das Publikum des Satzes.** Eine Commit-Beschreibung ist für jemanden geschrieben, der den Diff liest. Nichts in der Konvention verlangt vom Autor, für einen Kunden zu schreiben, also tut es niemand.
- **Eine Änderung, mehrere Commits.** Eine nutzersichtbare Änderung kommt oft als vier Commits über zwei Wochen an. Ein Generator gibt vier Zeilen aus; der Leser brauchte eine.
- **Schweregrad und Dringlichkeit.** Es gibt keinen `security:`-Typ in der Spezifikation, und keine Möglichkeit, „kritisch, heute Nacht patchen“ in einem Präfix zu sagen. Dieses Urteil fügt jemand hinterher hinzu, oder gar nicht.
- **Squash-Merge-Titel.** In einem Repository, das squasht, wird der Pull-Request-Titel zur Commit-Nachricht und damit zur Changelog-Zeile. Das ist entweder ein Argument dafür, Pull-Request-Titel als veröffentlichten Text zu prüfen, oder ein Argument dagegen, die Notizen daraus zu generieren.

## Die Changelog-Generatoren im Vergleich

Alle diese sind kostenlos. Der interessante Unterschied ist, was jeder liest, denn das legt fest, was er überhaupt wissen kann.

| Werkzeug | Liest | Erzeugt | Kann nicht wissen | Lizenz |
| --- | --- | --- | --- | --- |
| GitHubs automatische Release Notes | Gemergte Pull Requests, ihre Labels, und Contributors | Einen Release-Body auf dem GitHub-Release, kategorisiert nach Label | Alles, was in keinem Pull-Request-Titel oder -Label steht; ob eine Änderung Sie bricht | Teil von GitHub |
| release-please | Git-Historie, sucht nach Conventional-Commit-Nachrichten | Einen Release-Pull-Request, ein aktualisiertes Changelog, Versions-Anhebungen in Sprachdateien, Tags und GitHub-Releases | Alles, was in keiner Commit-Nachricht steht; publiziert nicht in Registries | Apache 2.0 |
| semantic-release | Commit-Nachrichten (standardmäßig Angular-Konventionen) und Git-Tags | Die nächste Version, Release Notes, einen Git-Tag, eine Registry-Veröffentlichung und ein GitHub-Release | Alles, was in keiner Commit-Nachricht steht; schreibt keine Changelog-Datei, es sei denn, Sie fügen das Plugin hinzu | MIT |
| git-cliff | Git-Historie, über Conventional Commits oder eigene Regex-Parser | Eine Changelog-Datei in der Form, die die Vorlage vorgibt | Alles, was in keiner Commit-Nachricht steht | Apache 2.0 oder MIT |
| changesets | Markdown-Changeset-Dateien, die ein Mitwirkender von Hand schreibt | Versions-Anhebungen, Changelogs und Veröffentlichung über ein Monorepo | Alles, wofür niemand ein Changeset geschrieben hat | MIT |
| auto-changelog | Git-Tags, Commit-Historie, Merge-Commits und Issue-Schließ-Schlüsselwörter | Eine Changelog-Datei in kompakter, Keep-a-Changelog- oder JSON-Form | Alles, was in keinem Commit, Merge oder verlinkten Issue steht | MIT |

### GitHubs automatisch erzeugte Release Notes

In GitHubs Release-Seite eingebaut, als automatisierte Alternative zum manuellen Schreiben des Bodys: Es erzeugt eine Übersicht gemergter Pull Requests, eine Contributor-Liste und einen Changelog-Link. Eine `.github/release.yml`-Datei steuert es — Sie deklarieren Kategorien und die Pull-Request-Labels, die in jede fallen, und Sie können Pull Requests nach Label oder Autor ausschließen, global oder pro Kategorie (geprüft auf docs.github.com, 9. September 2026).

**Was es nicht wissen kann:** alles, was in keinem Titel oder Label steht. Das macht es genau so gut wie Ihre Pull-Request-Titel, und es hat kein Konzept eines Breaking Change, es sei denn, Sie erstellen ein Label dafür und denken daran, es anzuwenden. **Nutzen Sie es, wenn** das Publikum bereits Entwickler sind, die das Repository lesen, und die Alternative gar keine Notizen sind.

### release-please

Parst Git-Historie nach Conventional-Commit-Nachrichten und öffnet einen Release-Pull-Request, den es aktuell hält, während Arbeit gemergt wird; beim Merge aktualisiert es das Changelog, hebt Versionen in sprachspezifischen Dateien an, taggt, und erstellt das GitHub-Release. Es publiziert nicht zu Paketmanagern und behandelt kein komplexes Branch-Management, und es gibt eine empfohlene Action, `googleapis/release-please-action`. Apache-2.0-lizenziert (geprüft auf github.com/googleapis/release-please, 9. September 2026).

**Was es nicht wissen kann:** alles, was in den Commit-Nachrichten fehlt. **Nutzen Sie es, wenn** Sie wollen, dass das Changelog geprüft wird, bevor es ausgeliefert wird. Der Release-Pull-Request ist die Prüffläche, und es ist das einzige Werkzeug hier, das einen Menschen einlädt, den erzeugten Text zu bearbeiten, bevor ihn irgendjemand liest — genau die Eigenschaft, die zu einem Team passt, dem die Prosa wichtig ist.

### semantic-release

Bestimmt die nächste Versionsnummer, erzeugt die Release Notes und veröffentlicht das Paket, gesteuert von Commit-Nachrichten unter einer formalisierten Konvention (standardmäßig Angular) und von Git-Tags, um das letzte Release zu finden. Es wird über Plugins konfiguriert, und die vier standardmäßig aktivierten sind `commit-analyzer`, `release-notes-generator`, `npm` und `github`; eine `CHANGELOG.md` ins Repository zu schreiben braucht `@semantic-release/changelog`, was keines davon ist. MIT-lizenziert (geprüft auf github.com/semantic-release/semantic-release und semantic-release.gitbook.io, 9. September 2026).

**Was es nicht wissen kann:** alles, was in den Commit-Nachrichten fehlt — und per Design gibt es keinen menschlichen Schritt, es wird also unterwegs nichts bearbeitet. **Nutzen Sie es, wenn** das Release eine Konsequenz des Mergens sein soll und niemand irgendetwas entscheiden muss. Das ist ein echter Vorteil, und es ist auch der Tausch: vollautomatisierte Releases und von Hand geschriebene Release Notes ziehen gegeneinander, und die meisten Teams lösen das, indem sie die generierten Notizen für Entwickler veröffentlichen und eine separate menschliche Seite für alle anderen schreiben.

### git-cliff

Ein in Rust geschriebener Changelog-Generator, der Conventional Commits folgt und benutzerdefinierte Regex-Parser für Historien hinzufügt, die das nicht tun. Konfiguration lebt in `cliff.toml`, wo Sie Commit-Parser und Gruppen definieren, und die Ausgabeform ist eine Vorlage: Es nutzt Tera, dessen Syntax auf Jinja2 und Django-Templates basiert. Verfügbar über crates.io, npm, PyPI und Docker, und dual lizenziert unter Apache 2.0 oder MIT (geprüft auf github.com/orhun/git-cliff und git-cliff.org, 9. September 2026).

**Was es nicht wissen kann:** alles, was in den Commit-Nachrichten fehlt. **Nutzen Sie es, wenn** Sie eine bestehende Historie haben, die keiner Konvention folgt, oder wenn die Ausgabe zu einem Format passen muss, das jemand anders vorgegeben hat — die Regex-Parser und die Vorlage zusammen treffen fast jede Form, was keines der anderen wirklich verspricht.

### changesets

Der Ausreißer, und der Grund, ihn anzusehen. Statt Commits zu lesen, liest es Markdown-Dateien, die Mitwirkende bewusst schreiben: Ein Changeset erklärt, welche Pakete sich geändert haben, wie stark jedes anzuheben ist, und was darüber zu sagen ist. Daraus hebt es Versionen an, schreibt Changelogs und veröffentlicht, mit Monorepos und voneinander abhängigen Paketen als ausdrücklichem Fokus. MIT-lizenziert (geprüft auf github.com/changesets/changesets, 9. September 2026).

**Was es nicht wissen kann:** alles, wofür niemand ein Changeset geschrieben hat. **Nutzen Sie es, wenn** die Notizen wichtiger sind als die Automatisierung. Den Autor zu bitten, den Satz genau in dem Moment zu schreiben, in dem er die Änderung macht, ist die ganze Idee, und es umgeht sowohl die Merge-Konflikte eines geteilten `Unreleased`-Blocks als auch das Publikumsproblem von Commit-Nachrichten. Die Kosten sind ein Schritt, den Leute vergessen, weshalb Teams, die es übernehmen, meist eine Prüfung hinzufügen, die einen Pull Request ohne Changeset scheitern lässt.

### auto-changelog

Ein Kommandozeilenwerkzeug, das ein Changelog aus Git-Tags und Commit-Historie erzeugt, einschließlich Merge-Commits und per Schlüsselwort geschlossener Issues, mit Ausgabe als kompakt, Keep a Changelog oder JSON. Es braucht keine Commit-Konvention, templatet mit Handlebars, unterstützt GitHub, GitLab, BitBucket und Azure DevOps, und markiert Breaking Changes, wenn Sie ihm ein `--breaking-pattern` übergeben, das dazu passt, wie Ihre Nachrichten sie markieren. MIT-lizenziert (geprüft auf github.com/cookpete/auto-changelog, 9. September 2026).

**Was es nicht wissen kann:** alles, was in keinem Commit, Merge oder verlinkten Issue steht. **Nutzen Sie es, wenn** Sie ein Repository mit Jahren unordentlicher Historie geerbt haben und heute etwas Brauchbares daraus wollen, ohne die Commits von irgendjemandem umzuschreiben oder erst eine Konvention einzuführen.

## Was ein generiertes Changelog auslässt

Generierung ist die naheliegende Antwort, und für die Liste der Änderungen ist sie die richtige. Wo sie scheitert, ist alles, was keine Liste ist, und die Fehlschläge sind konsistent genug, um sie zu benennen.

**Der Grund, warum das Release existiert.** Zwölf Einträge sagen einem Leser nicht, dass dies das Release ist, das die Export-Timeouts behebt, über die sich alle beschwert haben. Zwei Sätze am Anfang des Eintrags tun das. Kein Werkzeug kann sie schreiben, denn der Grund lebt in Support-Tickets und Gesprächen statt in Commits.

**Wer es überspringen sollte.** „Nutzen Sie die SAML-Integration nicht, ist hier nichts für Sie“ spart mehr Leserzeit als jeder andere Satz in einem Changelog, und es ist der Satz, den ein Generator nie produzieren wird, denn ihn zu produzieren erfordert zu wissen, was ein Leser vielleicht nicht nutzt.

**Schweregrad, in beide Richtungen.** Generierte Ausgabe flacht alles auf eine Zeile pro Commit ab. Ein Sicherheitspatch und eine Tooltip-Korrektur sehen identisch aus, und der Leser muss aus der Formulierung herausarbeiten, was was ist. Die zwei wichtigen Einträge zu markieren ist Menschenarbeit.

**Bekannte Probleme.** Der Fehler, mit dem Sie bewusst ausgeliefert haben, weil die Alternative war, das Release zu verschieben. Er erscheint in keinem Commit, weil er nicht behoben wurde. Ihn wegzulassen heißt, dass die erste Person, die ihn trifft, ein Ticket öffnet, und die zweite, und die elfte.

**Die Entschuldigung, wo eine geschuldet ist.** Hat das letzte Release in Produktion etwas für Kunden kaputt gemacht, ist die nächste Version der Notizen der Ort, das anzuerkennen. Schweigen liest sich wie nicht bemerkt.

**Was es kostet.** Budgetieren Sie den menschlichen Teil mit unter einer Stunde pro Release für eine benannte Person, plus die Prüfung der Changelog-Zeile in jedem Pull Request, was ein Blick ist statt einer Aufgabe. Das ist die ganze Rechnung, und deshalb gewinnt das Argument für volle Automatisierung meist standardmäßig statt aus eigener Kraft. Die Kosten, das nicht zu bezahlen, sind verteilt und schwerer zu sehen: Support-Tickets, die eigentlich Changelog-Fragen sind, Kunden, die drei Versionen zurückhängen, weil niemand ihnen sagen konnte, ob ein Upgrade sicher war, und Integratoren, die von einem entfernten Feld aus einem Fehler erfahren statt von Ihnen.

Die brauchbare Lösung ist beides. Lassen Sie einen Generator die Liste aus Commits oder Changesets zusammensetzen, dann fügt eine Person die Zusammenfassung hinzu, markiert die Schweregrade, fügt die bekannten Probleme hinzu und prüft, dass jede Removed-Zeile einen Ort hat, an den sie den Leser schickt. Generierter erster Entwurf, menschlicher letzter Durchgang. Keine Hälfte ist optional, und die zweite ist die, die weggelassen wird.

## Wer ein Release liest, und was jeder davon braucht

Eine Release-Seite bedient mehrere Leute, die mit unterschiedlichen Fragen ankommen. Sie zu benennen macht die Auslassungen offensichtlich, denn die meisten Changelogs beantworten die erste Frage und ignorieren die anderen zwei.

| Leser | Kommt mit der Frage | Braucht auf der Seite | Geht ohne es |
| --- | --- | --- | --- |
| Der Aktualisierer | Soll ich das jetzt nehmen? | Ob etwas bricht, die Größe der Änderung, und einen Grund, sich die Mühe zu machen | Bleibt unbegrenzt auf der alten Version |
| Der Integrator | Funktioniert mein Code noch? | Jede Entfernung und Verhaltensänderung, genannt genau so, wie sein Code sie nennt | Erfährt es von einem 4xx in Produktion |
| Der Operator | Was passiert, wenn ich es deploye? | Migrationen, Neustarts, Config-Änderungen, Ressourcenverschiebungen, Rollback | Trifft die Schema-Migration während des Deploys |

### Der Aktualisierer

Jemand auf Version 1.2, der entscheidet, ob er einen Nachmittag in 1.4 investiert. Was er zuerst braucht, ist ein Ja oder Nein zu Breaking Changes, dann einen Ein-Satz-Grund, warum das Release existiert. Überspringt er Versionen, braucht er die Einträge für alles dazwischen, was ein Argument für eine Datei mit der ganzen Historie ist statt einer Seite pro Release. Notizen, die mit neuen Funktionen beginnen, beantworten die Frage, die dieser Leser als Zweites gestellt hat.

### Der Integrator

Jemand, dessen Code Ihren aufruft. Es ist ihm egal, worum es im Release geht; ihm ist wichtig, ob einer der sechs oder sieben Namen, von denen er abhängt, in Removed oder Changed auftaucht. Dieser Leser ist der Grund, warum Einträge den exakten Bezeichner benutzen müssen — `api_key`, `POST /v2/exports`, `EXPORT_TIMEOUT_MS` —, denn er wird die Seite nach dem String durchsuchen, den sein eigener Code enthält. Prosa, die „die Export-Konfigurationseinstellung“ sagt, ist unsuchbar und für ihn deshalb nutzlos.

### Der Operator

Jemand, der es deployt. Seine Fragen betreffen kaum die Software: Braucht das eine Migration, braucht es einen Neustart, ändert es Speicher- oder Verbindungsnutzung, lässt es sich zurückrollen, nachdem die Migration gelaufen ist, und funktioniert die alte Version weiter, während beide live sind. Fast kein Changelog beantwortet das, und diese Auslassung macht aus einem Routine-Upgrade einen Vorfall. Ein kurzer Block „Dieses Release deployen“ am Anfang jedes Eintrags, der einen braucht, reicht.

## Schreiben Sie den Eintrag, nicht den Ticket-Titel

Eine Release-Notes-Vorlage hilft nur, wenn die Zeilen darin für einen Leser geschrieben sind:

- Führen Sie mit dem Substantiv, das er kennt — dem Endpunkt, der Einstellung, dem Menüpunkt —, nicht mit dem Modul, das es enthält.
- Sagen Sie, was jetzt gilt. „Exporte laufen im Hintergrund“ schlägt „Exporte geändert, damit sie im Hintergrund laufen“.
- Benennen Sie Dinge genau so, wie sie im Produkt erscheinen: `api_key`, nicht „die API-Schlüssel-Einstellung“.
- Geben Sie jeder Breaking-Zeile eine Handlung und eine Frist. „Vor 3.0 auf `/v2/exports` umsteigen“ ist eine Notiz. „Endpunkt veraltet“ ist ein Schulterzucken.
- Eine Zeile pro Änderung. Braucht es drei Sätze, verlinken Sie auf eine Seite mit Platz dafür.

Echte Zahlen gehören hierher — Größen, Timeouts, Retry-Zahlen, Daten. „Performance verbessert“ ist Füllmaterial, denn der Leser kann es nicht prüfen und nicht darauf reagieren.

### Migrationsanweisungen als Teil des Eintrags

Eine Removed- oder Changed-Zeile, die das Ziel beschreibt, aber nicht die Reise, hat die Arbeit dem Leser übertragen, der weniger Kontext hat als Sie. Die Abhilfe ist klein: zwei oder drei zusätzliche Zeilen, unter dem Eintrag eingerückt, die sagen, was zu ändern ist und was passiert, wenn nicht.

```markdown
### Removed
- `GET /v1/export`. Use `GET /v2/exports`. The response body is identical
  apart from `id`, now a string rather than an integer. Requests to the old
  path return 410 with a `Link` header pointing at the replacement.

  **Migrating:** change the path, and stop parsing `id` as an integer.
  The official clients do both for you from 2.2 onwards, so upgrading the
  client first is the shorter route.

### Deprecated
- `apiKey` in `config.yaml`, in favour of `api_key`. Both are read in all
  1.x releases; the old name logs a warning at startup. It is removed in
  2.0, not before 1 March 2027.
```

Drei Dinge lassen das funktionieren. Es benennt den Fehlerfall, ein Leser kann ihn also in seinen eigenen Logs erkennen. Es gibt ein Datum statt nur einer Version, denn „vor 2.0“ lässt sich nicht einplanen, wenn niemand weiß, wann 2.0 ist. Und es bietet zuerst den billigeren Weg an, was ein Leser mit einem Nachmittag tatsächlich will.

### Deprecation-Hinweise, die es überleben, ignoriert zu werden

Eine Deprecation ist eine Nachricht an jemanden, der beschäftigt ist, gehen Sie also davon aus, dass sie übersehen wird. Die Version, die funktioniert, kommt dreimal an: in den Release Notes, wenn sie beginnt, in der Software selbst als Warnung, die den Ersatz nennt, und in den Release Notes erneut, wenn die Entfernung landet. Wiederholen Sie den Eintrag in Deprecated in jedem dazwischenliegenden Release. Jemand, der in einem Sprung von 1.1 auf 1.9 aktualisiert, liest einen Eintrag, und er muss der sein, der noch steht.

Zwei Fehlermodi lohnt es sich zu vermeiden. Eine Warnung ohne genannten Ersatz — „diese Einstellung ist veraltet“ — schickt den Leser zum Suchen, und er wird einen Forumsbeitrag finden statt Ihrer Dokumentation. Und eine Entfernung, die früher landet als angekündigt, zerstört den Wert jeder künftigen Deprecation, die Sie schreiben, denn die Daten hören auf, Information zu sein.

## Wie Sie einen Release-Notes-Prozess führen, der weiter funktioniert

1. **Benennen Sie einen Verantwortlichen pro Release.** Ein Rotationsplan ist in Ordnung, geteilte Verantwortung nicht, denn ein Changelog ohne Verantwortlichen wird von dem geschrieben, der es zuletzt bemerkt, am Abend des Releases, aus `git log`.
2. **Schreiben Sie den Eintrag im Pull Request, der die Änderung macht**, entweder als Zeile unter `Unreleased` oder als Changeset-Datei, damit die Beschreibung von der Person geschrieben wird, die den Grund kennt, und von der Person geprüft wird, die die Änderung prüft.
3. **Schreiben Sie auf, was für Ihr Projekt als Breaking Change zählt, und wo die öffentliche Oberfläche endet.** Ohne das wiederholt jedes Release denselben Streit, und die Antwort variiert damit, wer gerade am müdesten ist.
4. **Machen Sie die Auslassung in der Review sichtbar.** Eine Prüfung, die einen Pull Request scheitern lässt, der öffentliches Verhalten berührt und keine Changelog-Zeile hat, kostet einen Nachmittag zu bauen und entfernt das Durchsetzungsgespräch dauerhaft.
5. **Geben Sie jeder Removed- und Deprecated-Zeile eine Handlung und ein Datum.** Beide Hälften tragen Last: Die Handlung sagt dem Leser, was zu ändern ist, das Datum sagt ihm, bis wann, und nur das Paar der beiden ist etwas, das ein Team in einen Sprint packen kann.
6. **Behalten Sie die Datei im Repository, in Markdown, und leiten Sie alles andere daraus ab** — eine Quelle, die diffed und geprüft wird, [so wie der Rest der Dokumentation dort leben sollte](/blog/documentation-that-lives-in-the-repo), mit der Website-Version, der E-Mail und der Release-Seite als Darstellungen statt als Kopien.
7. **Lassen Sie jemanden außerhalb des Teams den oberen Abschnitt lesen, bevor er ausgeliefert wird.** Support ist der ideale Leser: Kann er nicht sagen, was sich geändert hat, werden es die Kunden, denen er antwortet, auch nicht können, und Sie werden das über Tickets erfahren.

## Von CHANGELOG.md zu einer Seite, die Sie versenden können

Die Datei im Repository dient Leuten, die das Repository lesen. Support, Vertrieb und Kunden brauchen einen Link, und dort stockt es bei Release Notes meist.

`CHANGELOG.md` in TransformPipe zu ziehen gibt Ihnen eine eigenständige `.html`-Datei — Inline-Styles, keine Skripte, keine Netzwerkanfragen —, die Sie an eine E-Mail hängen oder als schreibgeschützte Seite veröffentlichen können. Diese Eigenschaft lohnt sich zu verstehen, bevor Sie irgendetwas versenden: eine [einzelne Datei, die das Netzwerk um nichts bittet](/blog/self-contained-html-explained), öffnet sich auf einem Laptop ohne Verbindung genauso wie auf Ihrem, und sie wird sich auch in fünf Jahren noch öffnen. Diesen Link später zu widerrufen stoppt einen, den Sie bereits verschickt haben, was [eine Markdown-Datei als Link zu teilen](/blog/share-a-markdown-document-as-a-link) vollständig behandelt. Kommt das Release auch mit einer Begleitnotiz und einem Migrationsleitfaden, verkettet das gleichzeitige Ziehen aller drei sie [zu einem Dokument](/blog/merging-many-markdown-files), in Reihenfolge.

Für ein Release, das von CI geschnitten wird, läuft dasselbe unbeaufsichtigt:

```bash
node cli/tp.mjs push CHANGELOG.md --name "Release 1.4.0" --share link
```

Die GitHub Action deckt die Pull-Request-Hälfte ab, veröffentlicht das Markdown, das ein Pull Request geändert hat, und kommentiert die Links zurück — siehe [Markdown aus GitHub Actions veröffentlichen](/blog/publish-markdown-from-github-actions). Ein Generator, der einen Release-Pull-Request öffnet, passt gut dazu: Die Notizen werden als Text geprüft, während der Diff noch offen ist, und die veröffentlichte Seite kommt aus der Datei, die genehmigt wurde, statt aus einer Kopie, die jemand eingefügt hat.

Bevor irgendetwas davon passiert, eine kurze Prüfung des oberen Abschnitts:

- [ ] Jede Removed- und Changed-Zeile sagt dem Leser, was zu tun ist.
- [ ] Keine Zeile nennt eine Datei, ein Modul oder eine Ticketnummer, die der Leser nicht sehen kann.
- [ ] Version und Datum stimmen mit dem Tag überein.
- [ ] Breaking Changes und Sicherheitskorrekturen sind als solche markiert, nicht gleichrangig mit dem Rest belassen.
- [ ] Jemand außerhalb des Teams hat es gelesen und konnte sagen, was sich geändert hat.

Öffnen Sie Ihr Changelog und lesen Sie seinen jüngsten Abschnitt, wie es ein Kunde täte. Streichen Sie die Zeilen, die an den drei Tests scheitern, fügen Sie jeder Breaking Change die fehlende Handlung hinzu, schreiben Sie die zwei Sätze, die kein Generator schreiben kann, dann konvertieren Sie es und schicken Sie den Link — [dieses Markdown in eine eigenständige HTML-Datei zu verwandeln](/) dauert etwa so lange, wie diesen Absatz zu lesen, kostenlos, im Browser, ohne dass etwas hochgeladen wird, während Sie abgemeldet sind.

## FAQ

### Was ist der Unterschied zwischen einem Changelog und Release Notes?

Ein Changelog ist die kumulative Datei, neueste Version zuerst, die jedes Release festhält. Release Notes sind der Anteil einer Version daran, geschrieben für ein bestimmtes Publikum und oft mit einer Zusammenfassung und Migrationshinweisen, die die Datei nicht hat. In der Praxis ist das Changelog die Quelle und die Release Notes eine Darstellung eines Abschnitts davon.

### Muss ich Keep a Changelog benutzen?

Nein, aber seine sechs Kategorien sind ein besserer Ausgangspunkt als alles, was Sie unter Zeitdruck erfinden würden, und Leser, die sie anderswo gesehen haben, wissen schon, wo sie nachsehen müssen. Die Spezifikation ist kurz und MIT-lizenziert (geprüft auf keepachangelog.com, 9. September 2026). Die Teile, die sich unabhängig davon zu behalten lohnen, sind Gruppierung nach Konsequenz, eine `Unreleased`-Überschrift, und ISO-Daten.

### Sollte ich mein Changelog aus Commit-Nachrichten generieren?

Generieren Sie die Liste, schreiben Sie die Zusammenfassung. Werkzeuge wie release-please, git-cliff und semantic-release sortieren Conventional Commits in Abschnitte und berechnen die Version, was die mühsame Hälfte der Arbeit entfernt. Sie können nicht sagen, warum das Release existiert, welche Einträge dringend sind, oder wer es überspringen kann, und das sind die Zeilen, an die sich Leser erinnern.

### Was zählt als Breaking Change?

Semantic Versioning definiert MAJOR als eine inkompatible API-Änderung und verlangt, dass Sie Ihre öffentliche API präzise deklarieren (geprüft auf semver.org, 9. September 2026), die Antwort hängt also davon ab, was Sie versprochen haben. Etwas Aufrufbares zu entfernen oder umzubenennen, den Typ eines Felds zu ändern, Validierung zu verschärfen und Laufzeit-Unterstützung fallen zu lassen, sind fast überall Breaking Changes. Schreiben Sie Ihre eigene Liste vor dem Streit auf, nicht während er läuft.

### Wo sollte das Changelog leben, im Repository oder auf der Website?

Im Repository, als `CHANGELOG.md`, denn dort diffed und wird es geprüft, neben der Änderung, die es verursacht hat. Veröffentlichen Sie von dort aus, wohin auch immer die Leser sind — eine Website, eine Release-Seite, eine gemailte Datei — statt eine zweite Kopie zu pflegen, die binnen zwei Releases auseinanderdriftet.

### Wie lang sollte ein einzelner Eintrag sein?

Eine Zeile für die meisten Änderungen, plus zwei oder drei eingerückte Zeilen für alles, was eine Migration braucht. Braucht ein Eintrag einen Absatz, braucht er eine Seite: Verlinken Sie von dort auf diese Seite und halten Sie die Liste überfliegbar, denn die Aufgabe der Liste ist, jemandem zu helfen zu entscheiden, ob er weiterliest.

### Brauchen interne Dienste Release Notes?

Ja, und sie sind billiger zu schreiben, denn Sie wissen genau, wer Ihre Leser sind und wie sie Dinge nennen. Die Teams, die Ihren Dienst konsumieren, brauchen dieselben drei Antworten — was ist kaputtgegangen, was hat sich geändert, was ist zu tun — und eine Nachricht in einem Kanal, der wegscrollt, ist kein Changelog.
