---
title: "Dokumentation, die neben dem Code lebt"
description: "Warum Dokumentation im Repository näher an der Wahrheit bleibt: vier Arten von Dokumenten, ein mitwachsendes Verzeichnis, Review gegen Drift, und wo es scheitert"
date: 2026-07-29
tag: Workflow
keywords: dokumentation in markdown, docs as code, readme vorlage, readme best practices, eine gute readme schreiben, internes dokumentationswerkzeug, docs in git, diataxis, architekturentscheidungsprotokoll, docs verzeichnisstruktur, contributing datei, markdownlint, vale prosa linter
---

Die Wiki-Seite sagt, der Dienst lauscht auf 8080. Er zog im letzten Frühjahr auf 8443 um. Niemand hat gelogen: Der Ingenieur, der den Port verschoben hat, bearbeitete eine Konfigurationsdatei, einen Test und ein Deployment-Manifest, keines davon in der Nähe des Satzes, der jetzt falsch ist.

Das ist das Argument für Docs as Code. Markdown im Repository macht ein Dokument nicht korrekt. Es stellt den falschen Satz vor die Person, die dabei ist, ihn falsch zu machen, während die Datei noch offen ist.

Es ist kein Selbstläufer, und die meisten Teams, die es versuchen, enden mit einem `docs/`-Ordner, den niemand öffnet. Der Unterschied zwischen den beiden Ausgängen liegt nicht im Werkzeug. Er liegt darin, ob die Dokumente danach sortiert sind, was der Leser vorhatte zu tun, ob jemand für jedes einzelne benannt ist, und ob das Review, das einen falschen Port erkennt, dasselbe Review ist, das einen falschen Funktionsnamen erkennt.

### Kurzfassung

Stecken Sie alles, was ein Commit widerlegen kann, ins Repository, und begutachten Sie den Absatz im selben Pull Request wie das Verhalten, das er beschreibt — das ist der ganze Mechanismus, und alles andere stützt ihn. Sortieren Sie die Dateien nach den vier Arten von Dokumentation, damit ein Leser weiß, welche Datei seine Frage beantwortet, halten Sie Entscheidungen als datierte Protokolle statt als Designdokumente, und lassen Sie `CODEOWNERS`, einen Markdown-Linter, einen Prosa-Linter und einen Link-Checker den Build bei den billigen Fehlern scheitern lassen. Veröffentlichen Sie dann die gerenderten Seiten, denn die Menschen, die die Dokumentation am nötigsten brauchen, können kein Repository klonen und sollten nicht danach gefragt werden.

## Was das Repository tatsächlich gibt

**Dasselbe Review.** Ein Pull Request, der Verhalten ändert und keine Dokumentation berührt, ist eine sichtbare Auslassung — der Reviewer kann die Lücke sehen, während die Änderung noch vor ihm liegt. Das Wiki hinterher zu korrigieren ist eine getrennte Aufgabe, und getrennte Aufgaben verlieren gegen alles, was gerade brennt.

**Dieselbe Historie.** `git log -S'8080' -- docs/` findet den Commit, der eine Zeichenkette hinzugefügt oder entfernt hat, was einen Satz datiert, der falsch geworden ist. `git blame` gibt Ihnen den Commit hinter einem Absatz, und von dort den Pull Request und die Überlegung, die die Prosa nie bekam. Wiki-Historien speichern Revisionen, selten Entscheidungen.

**Dasselbe Werkzeug.** Docs in Git sind Textdateien: grep findet sie, und ein Link-Checker kann den Build bei einem toten relativen Pfad scheitern lassen. Dokumentation für ein unveröffentlichtes Feature liegt im Branch bei dem Code und geht live, wenn er gemerged wird — nicht eine Woche zu früh, nicht einen Monat zu spät.

**Dieselben Adressen.** Ein relativer Link von einer Datei zur anderen ist ein Pfad, den ein Werkzeug auflösen kann und ein Build scheitern lassen kann. Ein Wiki-Link ist eine URL, und eine umbenannte Wiki-Seite lässt jeden Link zu ihr ins Leere zeigen, entdeckt Monate später von einem Leser, der annimmt, das Dokument sei absichtlich gelöscht worden.

**Dasselbe Release.** Dokumentation, die mit dem Code zusammen gemerged wird, kann keine Version beschreiben, die noch nicht draußen ist, und keiner hinterherhinken, die schon draußen ist. In einem Wiki sind die Seite und das Deployment zwei Ereignisse, an die sich jemand erinnern muss, damit sie zusammenpassen, und die Lücke dazwischen ist genau da, wo die falsche Portnummer lebt.

Die ehrliche Grenze: Nichts davon bringt irgendwen dazu, das Dokument zu schreiben. Es macht das Nichtschreiben sichtbar, was ein kleinerer Anspruch ist, als Docs-as-Code-Fürsprache üblicherweise erhebt.

## Die vier Arten von Dokumentation, und warum sie zu mischen alle vier verbirgt

Die meiste interne Dokumentation ist aus einem Grund unauffindbar, der nichts mit der Suche zu tun hat. Eine Seite namens „Erste Schritte" öffnet als Lektion, wird drei Bildschirme weiter unten zu einer Liste von Konfigurationsschlüsseln und endet mit zwei Absätzen darüber, warum das Team sich für Postgres entschieden hat. Jeder Teil davon stimmt. Nichts davon ist auffindbar, denn der Leser, der den Konfigurationsschlüssel sucht, öffnet keine Seite namens „Erste Schritte", und der Leser, der das System lernt, hört bei der Tabelle auf zu lesen.

Diátaxis ist das Framework, das das Problem benennt. Es ist die Arbeit von Daniele Procida, und es identifiziert vier Arten von Dokumentation, die vier verschiedenen Bedürfnissen der Leser dienen: Tutorials, Anleitungen, technische Referenz und Erklärung (geprüft auf diataxis.fr, 9. September 2026). Die Behauptung, die es nützlich macht, ist nicht, dass es vier Kategorien gibt. Es ist, dass ein einzelnes Dokument nur einer davon gut dienen kann, und dass ein Dokument, das versucht, zwei zu bedienen, keiner dient.

| Art | Ausgerichtet auf | Die Frage des Lesers | Wie es aussieht | Wie es schiefgeht |
| --- | --- | --- | --- | --- |
| Tutorial | Lernen | „Bring mir das bei" | Eine praktische Tätigkeit von nichts zu einem Ergebnis, das funktioniert | Es setzt einen Schritt voraus, den der Anfänger nicht gemacht hat, und der verliert das Vertrauen |
| Anleitung | Ein Ziel | „Wie mache ich X?" | Wegweisung durch ein Problem, für jemanden, der schon kompetent ist | Sie hält an, um zu erklären, und der kompetente Leser verliert den Faden |
| Referenz | Information | „Was sind die Optionen?" | Neutrale Beschreibung der Maschinerie, die die Struktur des Codes spiegelt | Sie rät, spekuliert oder verkauft und hört auf, vertrauenswürdig zu sein |
| Erklärung | Verständnis | „Warum ist es so?" | Diskursive Behandlung, die Reflexion erlaubt, gelesen abseits der Arbeit | Sie wird zu Anweisungen, denen niemand folgt |

Die Unterscheidungen sind schärfer, als sie aussehen. Diátaxis stellt ausdrücklich klar, dass Anleitungen sich vollständig von Tutorials unterscheiden und dass die beiden ständig verwechselt werden: Ein Tutorial dient einem Lernenden, der noch nicht weiß, was er will, während eine Anleitung der Arbeit des schon kompetenten Nutzers dient, der es weiß. Referenz soll nüchtern sein — ihre Aufgabe ist Gewissheit, und die Linie der Seite dafür ist, dass man Referenzmaterial kaum liest, man konsultiert es, mit einer Struktur, die die Struktur des Produkts spiegelt (geprüft auf diataxis.fr, 9. September 2026). Erklärung ist die ohne natürliche Grenze, weshalb sie sich in alles andere ausbreitet, wenn man sie lässt.

**Was das im Repository ändert.** Nach Art zu sortieren ist nahezu kostenlos, wenn die Dokumente Dateien sind. Ein Verzeichnis pro Art ist der naheliegende Schritt:

```
docs/
  tutorials/       erstes-deployment.md
  anleitungen/     signierschluessel-rotieren.md, aus-backup-wiederherstellen.md
  referenz/        konfiguration.md, http-api.md, fehlercodes.md
  erklaerung/      warum-wir-den-monolithen-verlassen-haben.md
  entscheidungen/  0007-postgres-statt-dynamodb.md
```

Wenn vier Verzeichnisse mehr Zeremonie sind, als Ihr Repository verdient, funktioniert die billigere Version: Benennen Sie jede Datei nach ihrer Art und halten Sie die Arten darin unvermischt. `aus-backup-wiederherstellen.md` ist eine Anleitung und sollte keinen Absatz enthalten, der das Backup-Format erklärt; die Erklärung bekommt ihre eigene Datei und einen Link. Der Test ist ein einziger Satz — wenn Sie nicht sagen können, welche der vier ein Dokument ist, ist es zwei Dokumente.

**Warum dieser Abschnitt sich auszahlt.** Die anderen Fehler in diesem Stück sind reparabel. Ein veralteter Satz wird korrigiert, sobald jemand ihn bemerkt; ein fehlender Linter wird an einem Nachmittag hinzugefügt. Ein nach Team, nach Dienst oder nach Reihenfolge des Schreibens sortiertes Dokumentationsset bleibt für immer unauffindbar, denn nichts daran sagt einem Leser, wo er suchen soll, und die übliche Reaktion — eine Seite hinzuzufügen, die die anderen Seiten indexiert — erzeugt ein fünftes Dokument, das ebenfalls veraltet.

## Ein Docs-Verzeichnis, das mitwächst

Repositorys scheitern in zwei Richtungen an Dokumentation. Die eine steckt alles in die README, bis sie viertausend Wörter hat und niemand über den Installationsbefehl hinausliest. Die andere legt am ersten Tag `docs/` an, füllt es mit drei Stubs und einer `architecture.md`, die ein im zweiten Monat aufgegebenes Design beschreibt. Was funktioniert, ist eine kleine Anzahl von Dateien mit klaren Aufgaben, von denen jede jemand als falsch erkennen kann.

| Datei | Was sie ist | Wer sie schreibt | Was sie falsch macht |
| --- | --- | --- | --- |
| `README.md` | Der Index und der kürzeste Weg zu einer laufenden Kopie | Wer das Setup ändert | Ein Befehl, der nicht mehr funktioniert |
| `docs/` | Alles, was aus der README herausgewachsen ist, nach Art sortiert | Die Person, die das Verhalten ändert | Ein Commit an dem Code, den es beschreibt |
| `docs/decisions/` | Ein datiertes Protokoll pro Architekturentscheidung | Die Person, die die Entscheidung getroffen hat | Nichts — ein abgelöstes Protokoll bleibt wahr über seinen eigenen Moment |
| `CONTRIBUTING.md` | Wie man eine Änderung vorschlägt und was geprüft wird | Die Maintainer | Eine Änderung am Review-Prozess oder der Toolchain |
| `CHANGELOG.md` | Was sich für einen Leser geändert hat, pro Release | Wer ausliefert | Ein Release, das ohne Eintrag hinausgeht |
| `CODEOWNERS` | Wer gebeten wird, welche Pfade zu begutachten | Die Teamleitungen | Eine Team-Umbenennung, jemand, der geht |

**Die README ist ein Index, kein Handbuch.** Ihre Aufgabe ist es, einen Fremden zu einer laufenden Kopie zu bringen und dann auf alles andere zu zeigen. Jeder Abschnitt, der über einen Bildschirm hinauswächst, wird eine Datei in `docs/`, mit einem einzeiligen Hinweis, der zurückbleibt. Das ist die verlässlichste strukturelle Regel hier, denn eine README, die kurz bleibt, bleibt gelesen, und eine README, die niemand liest, ist der Ort, an dem falsche Setup-Anweisungen am längsten überleben.

**`docs/` hält, was ein Commit widerlegen kann.** Konfigurationsschlüssel, API-Verhalten, Deployment-Schritte, Fehlercodes, das Runbook für den Alarm, der um drei Uhr morgens jemanden weckt. Das sind die Dokumente, deren Falschheit von einer Codeänderung verursacht wird, was genau der Grund ist, warum sie daneben gehören. Alles, dessen Falschheit von einer Entscheidung statt von einem Commit verursacht wird, gewinnt nichts durch Git.

### Entscheidungsprotokolle, und warum sie ein Designdokument schlagen

Ein Designdokument beschreibt ein System, wie jemand hoffte, es würde sein, an einem Datum, das das Dokument selten trägt, und es wird falsch, sobald sich der Plan das erste Mal ändert. Niemand aktualisiert es, denn es zu aktualisieren bedeutet, eine Erzählung umzuschreiben, und niemand löscht es, denn es könnte irgendwo noch stimmen.

Ein Architekturentscheidungsprotokoll hat eine andere Form. Es fasst eine einzelne Entscheidung und ihre Begründung — eine gerechtfertigte Designwahl, die eine architektonisch bedeutsame Anforderung behandelt — zusammen mit den Kompromissen und Konsequenzen, die damit kamen. Die Praxis wurde von Michael Nygard in einem Beitrag von 2011, „Documenting Architecture Decisions", populär gemacht, und das Format baut auf früherer Arbeit von Zdun und anderen zu nachhaltigen Architekturentscheidungen auf (geprüft auf adr.github.io, 9. September 2026). Nygards Vorlage ist die, mit der die meisten Teams beginnen; MADR — Markdown Architectural Decision Records — ist eine gestraffte Vorlage für dieselbe Aufgabe, doppelt lizenziert unter MIT oder CC0 (geprüft auf adr.github.io, 9. September 2026).

```markdown
# 7. Postgres statt DynamoDB für das Hauptbuch

- Status: angenommen
- Datum: 2026-03-04
- Entscheider: Zahlungsteam

## Kontext

Wir brauchen transaktionale Schreibzugriffe über das Hauptbuch und den
Saldo-Cache hinweg. Der Rest des Bestands ist DynamoDB.

## Entscheidung

Postgres, auf der verwalteten Instanz, die der Abrechnungsdienst schon nutzt.

## Konsequenzen

Ein weiterer Datenspeicher zu betreiben, und ein zweiter Connection Pool im
Worker. Im Gegenzug wird der Double-Write-Bug, der BILL-412 schloss,
strukturell unmöglich statt nur getestet.
```

Der Grund, warum ein Protokoll ein Designdokument überlebt, ist, dass es nie falsch ist. Es ist eine Aussage darüber, was ein Team an einem Datum wusste und wählte. Wird die Entscheidung umgekehrt, bearbeiten Sie nicht Protokoll 7 — Sie schreiben Protokoll 12, setzen 7 auf abgelöst und verknüpfen die beiden. Das Ergebnis ist ein Verzeichnis, das sich wie eine Historie der Überlegungen liest, was das ist, was ein neuer Ingenieur tatsächlich braucht und was `git log` nie ganz gibt, denn ein Commit protokolliert, was sich geändert hat, und nicht, was verworfen wurde.

Die Dateien zu nummerieren (`0007-postgres-statt-dynamodb.md`) hält sie geordnet und gibt jeder einen stabilen Namen, um sie in einem Pull Request zu zitieren. Halten Sie sie kurz. Ein Protokoll, das eine Stunde zum Schreiben braucht, wird nicht geschrieben, und die vier Überschriften oben reichen, um in einem Jahr die Frage zu beantworten, die immer eine Version von „warum um alles in der Welt ist es so" ist.

### CONTRIBUTING, und die Prüfungen, die es nennen sollte

`CONTRIBUTING.md` kann im Wurzelverzeichnis des Repositorys, in `docs/` oder in `.github/` liegen, und GitHub zeigt einen Link dazu, wenn jemand einen Pull Request oder ein Issue öffnet, sowie in der Repository-Seitenleiste (geprüft auf docs.github.com, 9. September 2026). Diese Platzierung ist der ganze Wert: Es ist das eine Dokument, das ein Erstbeitragender in dem Moment sieht, in dem er es braucht.

Beschränken Sie es auf das, was ein Beitragender tun muss, nicht auf das, was das Projekt glaubt. Die Schritte, um die Tests laufen zu lassen, die Commit-Nachrichten-Konvention, falls es eine gibt, was CI prüfen wird und daher was scheitern wird, wie lange Review üblicherweise dauert, und wo man fragen kann. Wenn Ihre Dokumentation in `docs/` lebt, ist dies auch der Ort, es zu sagen — ein Beitragender, der nicht weiß, dass die Docs im Repository sind, wird nicht danach suchen.

### CHANGELOG, und warum es nicht das Commit-Log ist

Der Changelog ist die eine Datei im Verzeichnis, die für jemanden außerhalb des Repositorys geschrieben ist. Keep a Changelog ist die Konvention, die es wert ist, übernommen zu werden, teils wegen ihrer sechs Kategorien — Added, Changed, Deprecated, Removed, Fixed, Security — und meist wegen ihres Arguments, dass ein Commit-Log einen schlechten Changelog abgibt, weil es voller Rauschen ist: Merge-Commits, kryptische Titel, Dokumentations-Churn (geprüft auf keepachangelog.com, 9. September 2026). Ein Commit dokumentiert einen Schritt in der Entwicklung der Quelle. Ein Changelog-Eintrag dokumentiert einen bemerkenswerten Unterschied, oft über mehrere Commits hinweg, für einen Leser, der den Code nie gesehen hat. [Diese Datei in Notizen zu verwandeln, die Menschen tatsächlich lesen](/blog/release-notes-from-markdown), ist eine eigene Kunst, und der Fehlermodus ist immer derselbe: den Diff auszuliefern statt der Konsequenz.

## Die Werkzeuge, verglichen

Sie können ein Dokumentationsset aus einem Repository heraus betreiben, ganz ohne Generator: Markdown-Dateien, ein Konverter, wenn jemand eine Seite braucht, und nichts zu warten. Das funktioniert nicht mehr an dem Punkt, an dem Leser Navigation, dokumentübergreifende Suche und eine stabile URL pro Seite brauchen. Die Werkzeuge unten sind die, die es wert sind, vor der Wahl gekannt zu werden.

| Werkzeug | Was es braucht | Was es baut | Lizenz | Wem es passt |
| --- | --- | --- | --- | --- |
| Reines Markdown plus ein Konverter | Nichts, wenn der Konverter im Browser läuft | Eine eigenständige HTML-Datei pro Dokument | Je nach Konverter | Eine Handvoll Runbooks und READMEs; Dokumente mit benanntem Empfänger |
| MkDocs | Python | Eine statische HTML-Seite aus Markdown und einer YAML-Konfigurationsdatei | BSD 2-Clause | Python-Projekte, die noch am selben Nachmittag eine Docs-Seite wollen |
| Material for MkDocs | Python, als MkDocs-Theme | Dieselbe Seite, mit eingebauter Suche, Navigation und Social Cards | MIT, mit frühem Zugriff auf neue Features für Sponsoren | Teams, die es richtig aussehen lassen wollen, ohne CSS zu schreiben |
| Docusaurus | Node.js, React | Eine statische Seite mit MDX-Seiten und versionierter Dokumentation | MIT (die eigenen Docs sind Creative Commons) | Produkt-Docs, die mehrere veröffentlichte Versionen gleichzeitig bedienen müssen |
| Sphinx mit MyST | Python | HTML, LaTeX für PDF, ePub und Texinfo aus einer Quelle | BSD 2-Clause; MyST-Parser ist MIT | API-Referenz aus dem Quellcode generiert, und alles, was PDF braucht |
| Hugo | Nichts außer der Binärdatei; in Go geschrieben | Eine statische Seite jeder Form, nicht nur Docs | Apache 2.0 | Dokumentation, die sich eine Seite mit Marketing-Seiten teilt |
| mdBook | Nichts außer der Binärdatei; in Rust geschrieben | Ein Online-Buch mit Kapiteln und Inhaltsverzeichnis | MPL 2.0 | Lineares Material — Handbücher, Anleitungen, Schulungen |
| Docsify | Ein Webserver; lädt von einem CDN | Gar keine statischen Dateien: Es rendert das Markdown im Browser | MIT | Ein `docs/`-Ordner, den Sie ohne Build-Schritt ausliefern wollen |

Geprüft auf mkdocs.org und github.com/mkdocs/mkdocs, squidfunk.github.io/mkdocs-material, docusaurus.io und github.com/facebook/docusaurus, sphinx-doc.org und github.com/sphinx-doc/sphinx, github.com/executablebooks/MyST-Parser, gohugo.io, github.com/rust-lang/mdBook und github.com/docsifyjs/docsify, 9. September 2026.

**MkDocs** ist die kürzeste Strecke zwischen einem Verzeichnis Markdown und einer Dokumentationsseite: eine YAML-Datei, ein Befehl, statisches HTML heraus (geprüft auf mkdocs.org, 9. September 2026). Es ist in Python geschrieben und BSD-2-Clause-lizenziert. Ist Ihr Projekt schon Python, gibt es nichts zu diskutieren.

**Material for MkDocs** ist ein Theme statt ein Generator, und es ist der Grund, warum die meisten Menschen MkDocs überhaupt begegnen. Es liefert Suche, responsive Navigation und die Erzeugung von Social Cards, ohne dass Sie CSS schreiben, unter der MIT-Lizenz, mit einem Insiders-Programm, das Sponsoren frühen Zugriff auf neue Features gibt (geprüft auf squidfunk.github.io, 9. September 2026). Der Kompromiss ist, dass Ihre Seite wie sehr viele andere Seiten aussehen wird, was für interne Dokumentation ein Vorteil ist.

**Docusaurus** ist auf React und MDX aufgebaut und erzeugt statische HTML-Dateien, mit Dokumentversionierung als erstklassiges Feature (geprüft auf docusaurus.io, 9. September 2026). Versionierung ist der Grund, es zu wählen: Unterstützen Sie drei Releases und braucht jedes seinen eigenen Dokumentationsbaum, tut das hier nichts anderes so sauber. Die Kosten sind eine Node-Toolchain und die Möglichkeit, dass Ihre Dokumentation React-Komponenten erwirbt, die Code sind, was bedeutet, dass die Dokumentation jetzt einen Build hat, der brechen kann.

**Sphinx** ist das älteste und fähigste, erzeugt HTML, LaTeX für PDF, ePub und Texinfo aus einer Quelle, und ist BSD-2-Clause und in Python geschrieben (geprüft auf sphinx-doc.org und github.com/sphinx-doc/sphinx, 9. September 2026). Seine native Markup-Sprache ist reStructuredText, eine echte Hürde für Beitragende, die nur Markdown kennen; MyST-Parser beseitigt sie, indem es Sphinx einen erweiterten CommonMark-Parser hinzufügt, MIT-lizenziert, auf markdown-it-py aufgebaut (geprüft auf github.com/executablebooks/MyST-Parser, 9. September 2026). Wählen Sie das, wenn Sie generierte API-Referenz und ein PDF aus derselben Quelle brauchen.

**Hugo** ist eine einzelne Go-Binärdatei unter der Apache-2.0-Lizenz, die statische Seiten jeder Form baut, Dokumentation eingeschlossen (geprüft auf gohugo.io, 9. September 2026). Wählen Sie es, wenn die Docs ein Abschnitt einer größeren Seite sind, oder wenn niemand eine Python- oder Node-Umgebung auf dem Build-Runner verwalten will.

**mdBook** ist ein Rust-Werkzeug, MPL-2.0-lizenziert, das Markdown in ein Online-Buch verwandelt (geprüft auf github.com/rust-lang/mdBook, 9. September 2026). Bücher sind linear, was genau falsch für Referenz und genau richtig für ein Handbuch oder einen Schulungskurs ist, den Sie von vorn nach hinten gelesen erwarten.

**Docsify** ist der Ausreißer: Es baut nichts. Es lädt von einem CDN, rendert Ihr Markdown im Browser zur Anfragezeit, und erzeugt überhaupt kein statisch gebautes HTML, unter der MIT-Lizenz (geprüft auf github.com/docsifyjs/docsify, 9. September 2026). Das entfernt den Build-Schritt vollständig, zum Preis einer Seite, deren Inhalt für alles unsichtbar ist, das kein JavaScript ausführt.

**Und gar kein Generator** bleibt eine echte Antwort, häufiger als die Liste oben vermuten lässt. Wenn Sie elf Markdown-Dateien haben und gelegentlich eine an jemanden weitergeben müssen, der kein Git benutzt, schlägt ein Konverter und ein Link eine Build-Pipeline, die Sie grün halten müssen. Die Schwelle ist die Navigation: Sobald ein Leser zwischen Dokumenten wechseln muss, ohne ihre Dateinamen zu kennen, wollen Sie einen Generator, und [die drei Fragen, die entscheiden, ob Sie diese Schwelle überschritten haben](/blog/static-site-generator-or-converter), lohnt es sich zu beantworten, bevor Sie einen installieren.

## Review ist, was ein Dokument wahr hält

Jeder Mechanismus in diesem Stück löst sich in eine Gewohnheit auf: Der Absatz ändert sich im selben Pull Request wie das Verhalten. Alles andere existiert, damit diese Gewohnheit hält, wenn die Person müde ist und das Release am Freitag ist.

**Die Docs-Änderung reist mit der Codeänderung.** Nicht ein Follow-up-Issue, nicht ein Ticket im nächsten Sprint. Ein Reviewer, der einen umbenannten Konfigurationsschlüssel sieht und keine Änderung unter `docs/reference/`, bittet um eine, und das Bitten kostet einen Kommentar. Dieselbe Bitte eine Woche später kostet ein Meeting, und die Woche danach kostet sie nichts, weil sich niemand mehr erinnert.

**`CODEOWNERS` setzt einen Namen auf das Verzeichnis.** Die Datei lebt in `.github/`, im Wurzelverzeichnis des Repositorys oder in `docs/` — GitHub sucht in dieser Reihenfolge und nimmt die erste, die es findet —, und Code-Owner werden automatisch zum Review angefragt, wenn ein Pull Request Pfade berührt, die sie besitzen, allerdings nicht bei Entwurfs-Pull-Requests. Es wird erst zu einem Gate, wenn ein Administrator verpflichtende Reviews aktiviert und Code-Owner-Genehmigung verlangt. Die Syntax ähnelt gitignore, und das zuletzt passende Muster gewinnt, was Leute reinlegt (geprüft auf docs.github.com, 9. September 2026).

```
/docs/reference/http-api.md   @acme/platform
/docs/how-to/                 @acme/sre
/docs/decisions/              @acme/architecture
```

Zwei Regeln machen es nützlich statt dekorativ. Besitzen Sie Verzeichnisse, nicht den ganzen Baum, denn ein einziger Owner auf `docs/` bedeutet, dass jede Dokumentationsänderung auf dieselben drei Personen wartet, und die Warteschlange bringt allen bei, sie zu umgehen. Und behalten Sie die Regel des letzten Treffers im Kopf: Ein breites Muster am Ende der Datei überschreibt still jedes spezifische darüber.

**Linting fängt, worin Review schlecht ist.** Reviewer lesen auf Bedeutung und übersehen Struktur. Maschinen tun das Gegenteil.

| Prüfung | Werkzeug | Was sie fängt | Lizenz |
| --- | --- | --- | --- |
| Markdown-Struktur | markdownlint | Überschriftenebenen, die überspringen, inkonsistente Listenmarker, nachgestellte Leerzeichen, unabgeschlossene Zäune | MIT |
| Prosa | Vale | Terminologie-Drift, verbotene Wörter, Stilregeln aus Ihrem eigenen Guide | MIT |
| Links | lychee | Tote relative Pfade, kaputte Anker, externe URLs, die nicht mehr auflösen | Apache 2.0 oder MIT |

markdownlint ist ein Node.js-Stilprüfer für Markdown und CommonMark mit mehr als sechzig eingebauten Regeln, MIT-lizenziert, ausgeführt über `markdownlint-cli2` oder eine GitHub Action (geprüft auf github.com/DavidAnson/markdownlint, 9. September 2026). Schalten Sie einen kleinen Satz ein und lassen Sie den Rest aus — ein Dokumentationsset, das CI wegen Zeilenlänge scheitern lässt, trainiert Beitragende darauf, `<!-- markdownlint-disable -->` hinzuzufügen und aufzuhören, die Ausgabe zu lesen.

Vale ist ein Markup-bewusster Prosa-Linter, MIT-lizenziert, der Dokumentstruktur versteht statt Mustervergleich auf dem rohen Text zu machen, und seine Regeln aus einer `.vale.ini` im Repository liest. Sie können mit veröffentlichten Stilen beginnen — darunter Microsofts und Googles — oder Ihre eigenen in YAML schreiben (geprüft auf vale.sh, 9. September 2026). Die Regeln, die sich zuerst lohnen, sind Terminologie, nicht Stil: eine Schreibweise Ihres eigenen Produktnamens, ein Wort für die Sache, die Sie sonst drei Namen geben.

lychee ist ein schneller asynchroner Link-Checker in Rust, doppelt lizenziert unter Apache 2.0 oder MIT, mit einer offiziellen `lycheeverse/lychee-action` für Workflows (geprüft auf github.com/lycheeverse/lychee, 9. September 2026). Prüfen Sie interne Links bei jedem Pull Request und externe Links nach Zeitplan — externe Prüfungen scheitern aus Gründen, die nichts mit Ihrer Änderung zu tun haben, und eine flatterhafte verpflichtende Prüfung wird ignoriert, dann entfernt.

**Lassen Sie den Build scheitern, aber nur bei dem, was ein Leser bemerken würde.** Ein kaputter relativer Link ist ein Leser, der auf ein 404 stößt, er sollte also einen Merge blockieren. Ein fehlender Punkt in einer Aufzählungsliste ist das nicht, er sollte es also nicht. Die Liste der blockierenden Prüfungen ist ein Versprechen darüber, was nie einen Leser erreichen wird, und jeder Punkt darauf, der diesen Maßstab nicht erfüllt, macht die ganze Liste weniger glaubwürdig.

## Veralten, und warum „zuletzt geprüft" eine Versionsnummer schlägt

Ein Dokument kündigt nicht an, dass es falsch geworden ist. Es sitzt da und wirkt zuversichtlich. Die Gegenmaßnahme ist keine Disziplin — es sind Metadaten, die Alter sichtbar machen, und ein Rhythmus, der danach handelt.

Setzen Sie einen kleinen Frontmatter-Block oben auf alles, was nach einem Zeitplan veraltet:

```markdown
---
title: Das Hauptbuch aus dem Backup wiederherstellen
owner: zahlungen
last-checked: 2026-09-09
review: vierteljährlich
---
```

Drei Felder, jedes mit einer eigenen Aufgabe. `owner` ist ein Team, keine Person, denn Personen wechseln Teams, und ein Name, der gegangen ist, ist schlimmer als kein Name. `last-checked` ist das Datum, an dem jemand das Dokument gelesen und bestätigt hat, dass es noch funktioniert — nicht das Datum des letzten Commits, das sich ändert, wenn Sie einen Tippfehler korrigieren, und dem Leser nichts sagt. `review` ist, wie lange dem Satz vertraut wird.

**Warum „zuletzt geprüft" eine Versionsnummer schlägt.** Eine Versionsnummer sagt dem Leser, welches Release das Dokument beschrieben hat. Sie sagt ihm nicht, ob seitdem jemand hineingesehen hat, und sie veraltet auf die irreführendste mögliche Weise: Ein mit `v4.2` gestempeltes Dokument neben einem `v4.9`-Produkt wirkt veraltet, selbst wenn jedes Wort noch stimmt, während ein ungestempeltes Dokument für immer aktuell wirkt. Ein Datum ist unzweideutig. „Zuletzt geprüft vor 14 Monaten" ist eine Tatsache, nach der der Leser handeln kann, ohne irgendetwas über Ihren Release-Rhythmus zu wissen, und es ist dieselbe Tatsache, egal ob Sie wöchentlich oder zweimal im Jahr ausliefern. Konverter und statische Seitengeneratoren behandeln Frontmatter unterschiedlich — manche entfernen es, manche stellen es als Absatz aus `key: value`-Zeilen oben auf der Seite dar —, es lohnt sich also zu wissen, [was Ihre Toolchain mit dem Header macht](/blog/front-matter-and-what-converters-do-with-it), bevor Sie sich darauf verlassen, dass er angezeigt wird.

**Der Rhythmus muss klein genug sein, um zu passieren.** Ein vierteljährliches Review von vierzig Dokumenten ist ein Tag, den niemand hat. Ein vierteljährliches Review der sechs Dokumente, die nachts jemanden per Pager wecken, ist eine Stunde, und diese sechs sind da, wo Falschheit am meisten kostet. Sortieren Sie nach Konsequenz: Runbooks und Setup-Anweisungen zuerst, Referenz danach, Erklärung zuletzt — Erklärung altert langsam, weil sich die Gründe, warum ein System so geformt ist, wie es ist, selten ändern, ohne dass ein Entscheidungsprotokoll es markiert.

**Gewohnheiten, die es ehrlich halten.**

- [ ] Dokumentationsänderungen reisen im selben Pull Request wie das Verhalten, das sie beschreiben.
- [ ] Jedes Dokument nennt einen Owner; `CODEOWNERS` erledigt das ohne Meeting.
- [ ] Schreiben Sie den falschen Absatz um, statt darunter eine Korrektur anzuhängen.
- [ ] Alles, was nach Zeitplan veraltet, trägt das Datum, an dem es zuletzt geprüft wurde.
- [ ] Dokumente, die niemand pflegen wird, werden gelöscht, nicht als „möglicherweise veraltet" markiert.

Der letzte Punkt verursacht den meisten Streit und zählt am meisten. Eine gelöschte Seite schickt den Leser, eine Person zu fragen; eine veraltete Seite schickt ihn selbstsicher zum falschen Port. Der Zwischenweg — ein Banner mit „diese Seite könnte veraltet sein" — ist der schlechteste der drei, denn er verlagert das Risiko auf einen Leser, der keine Möglichkeit hat, es einzuschätzen, und lässt das Team fühlen, das Problem sei behandelt worden.

**Noch ein Fehler, der es wert ist, benannt zu werden.** Setup-Anweisungen verrotten schneller als alles andere und werden zuletzt entdeckt, denn nur neue Kollegen führen sie aus, und ein neuer Kollege nimmt an, der Fehler liege bei ihm. Sie werden zwei Stunden verbringen, bevor sie fragen. Die Abhilfe ist billig, und niemand macht sie: Wer als Nächstes dazukommt, korrigiert die README als ersten Pull Request, solange der Schmerz noch frisch ist und bevor er die Umgehungen gelernt hat, die die Falschheit unsichtbar machen.

## Wo Docs as Code scheitert, und was stattdessen tatsächlich funktioniert

Hier ist der Teil, den die Fürsprache auslässt. Die Menschen, die interne Dokumentation am nötigsten brauchen, sind häufig die, die nicht an sie herankommen.

Die Support-Leitung braucht den Eskalationspfad in dem Moment, in dem ein Kunde schreit. Eine neue Designerin braucht den Onboarding-Guide, bevor ihre Konten existieren. Ein Vertriebler braucht die Antwort auf „macht es SSO" mitten in einem Anruf. GitHub rendert Markdown gut, aber diese Darstellung zu erreichen kostet ein Konto, Repository-Zugriff und einen SSO-Umweg, und ein Dateibaum bittet einen Nicht-Ingenieur, das interne Dokumentationswerkzeug einer anderen Person zu bedienen. „Stellen Sie einen Pull Request gegen die Docs" ist ein Satz, der das Gespräch beendet. Er wird als *das ist nicht für dich* verstanden, und er wird richtig verstanden, denn die Person, die ihn sagt, hat gerade jemandem, dessen Job das Beantworten von Tickets ist, einen Workflow mit einem Branch, einem Fork, einem Review und einer Merge-Queue darin beschrieben.

Suche ist die zweite Lücke, und sie ist schlimmer, als sie aussieht. Die Firmensuche indexiert das Wiki, das geteilte Laufwerk und das Ticketsystem. Codesuche spannt sich zwar über die Repositorys einer Organisation, aber sie rankt Code, und sie bittet den Leser zu raten, welches Repository die Antwort hält — ein Raten, das ein Ingenieur richtig macht und sonst niemand. Das Ergebnis ist ein Dokumentationsset, das vollständig, korrekt und für die meisten der Firma unsichtbar ist.

Das Dritte ist die Review-Last. Eine Tippfehlerkorrektur wird ein Branch, ein Pull Request und ein Warten. Ingenieure bemerken es kaum; jemand, der zweimal im Jahr schreibt, gibt auf, und sein Wissen bleibt in seinem Kopf. Das ist ein echter Verlust, kein kleiner — der Support-Ingenieur, der dieselbe Frage vierzig Mal beantwortet hat, weiß etwas, das kein Ingenieur weiß, und der Beitragspfad, den Sie gebaut haben, garantiert, dass er es nie aufschreiben wird.

**Was tatsächlich funktioniert.** Drei Dinge, in der Reihenfolge, wie viel sie bringen.

Erstens, teilen Sie nach dem auf, was ein Dokument widerlegen kann, nicht danach, wer es geschrieben hat.

| Dokument | Wohin es gehört | Was es falsch macht |
| --- | --- | --- |
| Setup, Konfiguration, API-Verhalten, Deployment | Das Repository | Ein Commit |
| Runbooks | Das Repository, als Seite veröffentlicht | Eine Umbenennung im Code, den sie aufrufen |
| Eskalationspfade, Onboarding, „wie frage ich nach X" | Das Wiki, oder wo Support schon lebt | Eine Prozessänderung, kein Commit |
| HR-Richtlinien, Meeting-Notizen, Entscheidungsprotokolle | Das Wiki | Eine Entscheidung, kein Commit |

Diese letzte Gruppe nach Git zu verschieben, kauft nur Reibung. Die erste Gruppe daraus zu verschieben, kauft Drift.

Zweitens, veröffentlichen Sie die gerenderten Seiten, damit die Quelle der Wahrheit und die Lesefläche verschiedene Dinge sind. Der Leser bekommt eine URL; das Repository behält die Datei. Niemand außerhalb des Teams lernt je, was ein Branch ist.

Drittens, lassen Sie den Beitragspfad zum Beitragenden passen. Ein Ingenieur schickt einen Pull Request. Ein Support-Ingenieur schickt eine Nachricht an den in `CODEOWNERS` genannten Kanal, oder reicht ein Issue nach Vorlage ein, und jemand, der schon im Repository ist, schreibt den Absatz. Das Wissen ist, was Sie wollen, nicht der Git-Commit — auf Letzterem zu bestehen ist, wie Sie Ersteres verlieren.

**Veröffentlichen, konkret.** Die Quelle der Wahrheit muss nicht die Lesefläche sein. Rendern Sie das Markdown und geben Sie den Menschen eine Seite. Das kann so klein sein wie die Datei auf TransformPipe abzulegen und das eigenständige HTML zu versenden, oder [einen schreibgeschützten Link zu veröffentlichen](/blog/share-a-markdown-document-as-a-link): „jeder mit dem Link" für ein öffentliches Runbook, „nur diese Adressen" für alles Interne. Widerrufen entzieht das Token, ein schon versendeter Link hört also auf zu funktionieren. Es skaliert bis hin zu [einer GitHub Action, die das Markdown veröffentlicht, das ein Pull Request geändert hat](/blog/publish-markdown-from-github-actions), oder einem `tp push`-Schritt [im Release-Skript](/blog/markdown-to-html-from-the-command-line).

**Eine eigenständige Datei zählt hier mehr, als es klingt.** Eine Seite, die ihr Stylesheet von einem CDN zieht, hört auf, richtig auszusehen, sobald jemand sie im Flugzeug öffnet, und sie verrät demjenigen, der sie öffnet, etwas darüber, wo die Datei gewesen ist. Eine Datei mit ihren Stilen inline öffnet überall gleich, auch aus einem E-Mail-Anhang auf einem Laptop ohne Verbindung, was genau die Situation ist, der ein Eskalations-Runbook am ehesten begegnet.

Wissen Sie, wann das die falsche Form ist. Eine Seite pro Dokument passt zu einem Dokument mit einem Empfänger: einem Runbook, einem Entscheidungsprotokoll, Release Notes, einer README, die an einen Kunden geht. Ein Set, das die oben beschriebene Navigationsschwelle überschritten hat, will stattdessen einen Generator, und die Seite ist eine Ergänzung dazu statt ein Ersatz.

## Wie Sie entscheiden, was wohin gehört

1. **Fragen Sie, was das Dokument falsch machen würde.** Ist die Antwort ein Commit, gehört es ins Repository, denn das ist der einzige Ort, an dem die Änderung und der Satz sich treffen. Ist die Antwort eine Entscheidung oder ein Gespräch, kauft Git Ihnen Reibung und kostet Sie das Publikum.
2. **Benennen Sie, welche der vier Arten es ist, bevor Sie eine Zeile schreiben.** Ein Dokument, das Sie nicht klassifizieren können, ist zwei Dokumente, und es als eines auszuliefern garantiert, dass keiner seiner Leser es findet.
3. **Geben Sie jedem Dokument einen Owner und ein Datum.** Ein Dokument ohne Owner ist eines, nach dem niemand gefragt wird, und eines ohne Datum ist eines, das niemand beurteilen kann; beide überleben Review unbegrenzt, weil es nichts Konkretes gibt, wogegen man Einspruch erheben könnte.
4. **Legen Sie das Review dorthin, wo die Änderung passiert.** Docs im selben Pull Request wie das Verhalten kosten einen Kommentar; Docs in einem Follow-up-Ticket kosten einen Sprint und kommen meist nie an.
5. **Automatisieren Sie nur, was ein Leser bemerken würde.** Ein toter Link und ein falscher Produktname sind es wert, dass ein Build daran scheitert. Zeilenlänge nicht, und ein Build, der daran scheitert, trainiert Menschen darauf, die Prüfung abzuschalten, die auch den toten Link fängt.
6. **Wählen Sie einen Generator danach, was ohne ihn kaputtgeht.** Ist niemand ohne Navigation und Suche verloren, sind ein Konverter und ein Link weniger zu pflegen als ein Build; können Leser das zweite Dokument nicht finden, brauchten Sie schon vor zwei Monaten einen Generator.
7. **Geben Sie Nicht-Ingenieuren eine Lesefläche und einen Beitragspfad, der kein Git ist.** Sonst ist die Dokumentation korrekt, aktuell, und wird von den acht Personen gelesen, die sie geschrieben haben.

## Fazit

Das Wiki driftet, weil es nicht dort ist, wo die Änderung passiert; das Repository hält, weil es das ist. Das ist das ganze Argument, und es übersteht den Kontakt mit der Realität nur, wenn die Menschen, die kein Git benutzen können, trotzdem eine Seite bekommen, die sie öffnen können. Wählen Sie das Dokument, das heute am falschesten ist — meist die Setup-Anweisungen —, korrigieren Sie es in einem Branch, begutachten Sie es wie Code, und schicken Sie dann demjenigen, der es letzte Woche brauchte, einen Link statt eines Repository-Pfads. [Das Markdown in eine eigenständige HTML-Datei zu konvertieren](/) dauert etwa so lange wie es anzuhängen, passiert in Ihrem Browser ohne Upload, und die vollständige Liste der Optionen steht in [den Docs](/docs).

## FAQ

### Was ist Diátaxis, und muss ich alles davon übernehmen?

Diátaxis ist ein Dokumentationsframework von Daniele Procida, das Dokumentation nach dem Bedürfnis des Lesers in Tutorials, Anleitungen, Referenz und Erklärung sortiert (geprüft auf diataxis.fr, 9. September 2026). Sie müssen weder die Verzeichnisstruktur noch das Vokabular übernehmen. Der nützliche Teil ist der Test: Benennen Sie, welche der vier ein Dokument ist, bevor Sie es schreiben, und teilen Sie es, wenn Sie es nicht können.

### Sollte Dokumentation im selben Repository leben wie der Code, den sie beschreibt?

Für alles, was ein Commit falsch machen kann, ja — das ist der ganze Mechanismus, und ein getrenntes Docs-Repository führt die Lücke wieder ein, die Sie schließen wollten. Für Dokumentation, die sich über viele Dienste erstreckt, ist ein getrenntes Repository vertretbar, aber erwarten Sie dieselbe Drift, die das Wiki hatte, denn die Änderung und der Satz sind wieder in verschiedenen Pull Requests.

### Was ist der Unterschied zwischen einem ADR und einem Designdokument?

Ein Designdokument beschreibt ein beabsichtigtes System und wird falsch, wenn sich der Plan ändert. Ein Architekturentscheidungsprotokoll fasst eine Entscheidung, ihren Kontext und ihre Konsequenzen an einem Datum zusammen und bleibt für immer wahr, weil es eine Aussage über einen Moment ist (geprüft auf adr.github.io, 9. September 2026). Sie lösen ein Protokoll durch ein neues ab, statt es zu bearbeiten.

### Brauche ich einen statischen Seitengenerator für interne Docs?

Nicht, bevor Leser zwischen Dokumenten wechseln müssen, ohne Dateinamen zu kennen. Unter dieser Schwelle sind Markdown-Dateien plus ein Konverter weniger zu pflegen und brechen nie den Build. Darüber wählen Sie aus der Tabelle oben nach dem, was Ihr Team schon nutzt — Python-Teams greifen zu MkDocs, Node-Teams zu Docusaurus, und wer eine Binärdatei will, zu Hugo oder mdBook.

### Wie stoppe ich, dass Dokumentation veraltet, ohne einen Vollzeit-Autor?

Machen Sie Alter sichtbar und halten Sie das Review klein. Ein `last-checked`-Datum im Frontmatter sagt einem Leser, was eine Versionsnummer nicht kann, und ein vierteljährlicher Durchgang nur durch die Dokumente, deren Falschheit nachts jemanden weckt, ist eine Stunde statt eines Tages. Löschen Sie, was niemand pflegen wird, statt es als zweifelhaft zu kennzeichnen.

### Wie lesen Nicht-Ingenieure Dokumentation, die in einem Repository liegt?

Geben Sie ihnen eine gerenderte Seite, keinen Repository-Pfad. Das Markdown als eigenständige HTML-Datei oder als schreibgeschützten Link zu veröffentlichen bedeutet, dass sie eine URL bekommen, die überall öffnet, ohne Konto, ohne Repository-Zugriff und ohne etwas zu installieren — und für Beiträge leiten Sie sie über den in `CODEOWNERS` genannten Kanal statt über einen Pull Request.

### Welche Linter lohnen sich in CI für Dokumentation?

Drei, und nur bei Regeln, die ein Leser bemerken würde: markdownlint für Struktur, Vale für Terminologie, und ein Link-Checker wie lychee für tote Pfade (geprüft auf github.com/DavidAnson/markdownlint, vale.sh und github.com/lycheeverse/lychee, 9. September 2026). Führen Sie interne Link-Prüfungen bei jedem Pull Request aus und externe nach Zeitplan, denn eine an einem Dienstag scheiternde externe URL hat nichts mit Ihrer Änderung zu tun.
