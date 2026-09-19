---
title: "StackEdit-Alternativen 2026: Sync, Dateien, Desktop und einmalige Exporte"
description: "StackEdit-Alternativen nach dem Grund gruppiert, aus dem Sie suchen: gescheiterte Synchronisation, Dokumente als Dateien, eine Desktop-App oder ein einzelner Export"
date: 2026-09-07
tag: Workflow
keywords: stackedit alternative, stackedit alternativen, stackedit offline, browser markdown editor alternative, markdown editor google drive sync, self-hosted markdown editor, markdown workspace zu dateien, stackedit html export
---

Irgendwo mitten in einem Dokument hört die Synchronisationsanzeige auf, sich selbst zuzustimmen. Die Kopie im Tab hat einen Absatz, den die Kopie in Google Drive nicht hat. Die Verbindung zu GitHub will erneut autorisiert werden. Ein Laptop, der seit einem Monat nicht geöffnet wurde, wacht auf und hält eine ältere Version derselben Datei, und bietet fröhlich an, sie zu behalten. Meist geht nichts verloren. Aber zwanzig Minuten sind in die Rohrleitungen eines Dokuments geflossen statt in das Dokument, und das ist der Moment, in dem die meisten Leute anfangen zu suchen.

Der andere Weg zu dieser Seite ist leiser. Nichts ist kaputtgegangen. Sie haben einfach bemerkt, dass Ihr Geschriebenes in einem Browser-Tab lebt, in Speicher, den Sie nicht sehen können, auf einer Maschine, auf der das Löschen von Website-Daten ein normaler Akt der Haushaltsführung ist, und Sie hätten es lieber in einem Ordner, den Sie auflisten können.

### Kurzfassung

Wenn die Synchronisation kaputtgegangen ist, ist die dauerhafte Lösung meist, aufzuhören, einen Workspace zu haben, und stattdessen einen Ordner zu haben: ein Git-Repository, oder Syncthing, oder ein Cloud-Client, mit einem beliebigen Editor obendrauf. Wenn Sie Dateien statt eines Workspace wollen, arbeiten Obsidian, VS Code und Zettlr alle direkt an `.md`-Dateien auf der Platte und fügen nichts hinzu, das Sie nicht sehen können. Wenn Sie eine Anwendung wollen, die da ist, ob ein Browser läuft oder nicht, ist Mark Text kostenlos unter der MIT-Lizenz, und Typora ist ein kleiner einmaliger Kauf. Und wenn Sie eigentlich nur ein Dokument als Webseite verschicken wollten, gibt es in diesem Job überhaupt keinen Workspace — es ist eine Konvertierung, und sie dauert etwa eine Minute.

## StackEdit zu seinen eigenen Bedingungen

Es lohnt sich, präzise darüber zu sein, was Sie ersetzen würden, denn StackEdit ist nicht eine Funktion. Die eigene Seite beschreibt einen Editor, der Sie „offline schreiben lässt wie bei jeder Desktop-Anwendung“, Dateien mit Google Drive, Dropbox und GitHub synchronisiert, sie als Blogbeiträge zu Blogger, WordPress und Zendesk veröffentlicht, und Sie wählen lässt, ob die Ausgabe als Markdown, als HTML, oder formatiert über die Handlebars-Template-Engine herausgeht. Die Syntax, die es handhabt, wird als GitHub Flavored Markdown, Markdown Extra und CommonMark aufgeführt, plus LaTeX-Mathe-Ausdrücke, UML-Diagramme, ABC-Notation-Partituren und Emojis. Die Seite gibt an, unter einer Apache License lizenziert zu sein (geprüft auf stackedit.io, 9. September 2026).

Das Repository füllt den Rest. Das Projekt ist Apache-2.0-lizenziert und beschreibt sich selbst als voll ausgestatteten, quelloffenen Markdown-Editor, basierend auf PageDown, der Markdown-Bibliothek, die Stack Overflow nutzt. Es gibt eine Chrome-App und eine Chrome-Erweiterung, ein einbettbares `stackedit.js` zum Einbauen des Editors in die eigene Website, ein Helm-Chart zum Deployen auf Kubernetes mit konfigurierten Dropbox-, Google-, GitHub- und WordPress-Zugangsdaten, und ein Community-Forum unter community.stackedit.io (geprüft auf github.com, 9. September 2026).

Es sind also vier getrennte Produkte in einem Tab gebündelt: ein Editor, ein Workspace, ein Synchronisationsclient und ein Publisher. Genau dieses Bündeln ist der Grund, warum StackEdit zu ersetzen verwirrend ist. Leute sagen „ich brauche eine StackEdit-Alternative“ und meinen vier verschiedene Dinge, und die Alternative, die eines davon beantwortet, ist für die anderen oft nutzlos. Ein Desktop-Editor ersetzt den Editor und nichts vom Rest. Ein Repository ersetzt den Workspace und die Synchronisation und gibt Ihnen überhaupt keinen Editor. Ein Konverter ersetzt nichts und beendet den Job, den Sie eigentlich fertigstellen wollten.

Die andere strukturelle Tatsache zählt mehr als jedes Feature: ein StackEdit-Dokument ist ein Datensatz in einem Workspace, und der Workspace ist die primäre Sache. Dateien in Drive oder einem Repository sind, wohin der Workspace synchronisiert, nicht wo das Dokument lebt. Jede andere Option auf dieser Seite dreht das um — die Datei ist primär, und die Werkzeuge sind austauschbar obendrauf. Fast jeder Grund zu gehen läuft darauf hinaus, diese Umkehrung zu wollen.

## Kurzvergleich: das Cheat Sheet

| Option | Der Grund, den sie beantwortet | Was sie ist | Wo die Dokumente leben | Preis |
| --- | --- | --- | --- | --- |
| StackEdit | Was Sie jetzt haben | Browser-Workspace mit Sync und Veröffentlichung | Browser-Speicher, gespiegelt zu einem Anbieter | Kostenlos, Apache-Lizenz |
| Git-Repository, beliebiger Editor | Sync, die Sie prüfen und rückgängig machen können | Versionskontrolle, keine Sync | Dateien auf der Platte, Historie im Repo | Kostenlos |
| Syncthing | Sync ohne Dienst dazwischen | Fortlaufende Dateisynchronisation zwischen eigenen Geräten | Dateien auf der Platte, auf jedem Gerät | Kostenlos, MPL-2.0 |
| Ein Cloud-Client | Sync, für die Sie schon bezahlen | Ordnersynchronisation auf Betriebssystemebene | Dateien in einem synchronisierten Ordner | Im Speicherkonto eingeschlossen |
| Obsidian | Dateien, mit einer echten Anwendung darüber | Desktop- und Mobil-App über einem Ordner | Reine `.md`-Dateien in einem Vault | Kostenlos für jeden Zweck |
| VS Code | Dateien, neben dem Code, den sie dokumentieren | Editor mit eingebauter Markdown-Vorschau | Dateien im geöffneten Ordner | Kostenlos |
| Zettlr | Dateien, mit angehängten Referenzen | Eine Schreib- und Publikations-Werkbank | Dateien auf der Platte | Kostenlos, spendenfinanziert |
| Mark Text | Eine kostenlose Desktop-Anwendung | Einbereichs-Editor, HTML- und PDF-Ausgabe | Dateien auf der Platte | Kostenlos, MIT |
| Typora | Eine Desktop-Anwendung zum Einleben | Einbereichs-Editor mit breitem Export | Dateien auf der Platte | 14,99 $, bis zu drei Geräte |
| HedgeDoc | Der Browser-Tab, auf einem Server, den Sie betreiben | Kollaborative Markdown-Notizen in Echtzeit | Ihr Server | Kostenlos, AGPLv3 |
| Ein Browser-Konverter | Ein Dokument zu einer Seite, kein Workspace | Markdown zu HTML, lokal konvertiert | Nirgends — die Datei bleibt bei Ihnen | Kostenlos |
| Pandoc | Viele Dokumente, viele Formate, skriptgesteuert | Kommandozeilen-Dokumentkonverter | Dateien auf der Platte | Kostenlos, GPL |

Lesen Sie die Tabelle als vier Gruppen statt zwölf Optionen. Zeilen zwei bis vier ersetzen die Synchronisation. Zeilen fünf bis sieben ersetzen den Workspace durch Dateien. Zeilen acht und neun ersetzen den Tab durch eine Anwendung. Zeile zehn behält den Tab und verschiebt den Server, mit dem er spricht. Zeilen elf und zwölf ersetzen nichts und stellen ein Dokument fertig. Wo Sie landen, hängt ganz davon ab, welches der vier Dinge kaputtgegangen ist.

## Grund eins: die Synchronisation ist kaputtgegangen

Das ist der häufige Fall, und die Ausfälle haben eine Form. Ein Workspace ist an ein Anbieterkonto gebunden, ein Dokument, geschrieben während man beim falschen Google-Konto angemeldet war, landet also irgendwo, wo Sie nicht danach suchen werden. Autorisierungs-Tokens laufen ab oder werden widerrufen, wenn ein Administrator eine Workspace-Richtlinie verschärft, und der Tab lässt Sie weiter tippen, während die Verbindung zum Anbieter tot ist. Zwei Browser, oder ein Browser und ein Telefon, halten je eine Kopie, und ein Konflikt muss von einer Person gelöst werden, die zwei Versionen desselben Absatzes liest. Und wenn ein Dokument nur im Speicher eines Browsers existiert, weil die Synchronisation nie verbunden wurde, ist das Löschen von Website-Daten ein Datenverlust, verkleidet als Wartung.

Nichts davon ist StackEdit-spezifisch. Es ist, was passiert, wenn Synchronisation eine Funktion innerhalb einer Anwendung ist statt einer Schicht darunter. Die Alternativen unten verschieben sie nach unten.

### Git als Synchronisationsschicht

Ein Repository ist kein Sync-Dienst, und das ist der Punkt. Nichts passiert, bis Sie committen, was heißt, die Version, die Sie haben, ist die Version, die Sie gemacht haben, und die Merge-Konflikte sind explizit statt eines Dialogs, der fragt, welchen von zwei Absätzen Sie meinten. Sie bekommen Historie, ein Absatz, den Sie vor drei Wochen gelöscht haben, ist also wiederherstellbar, was Ihnen kein Cloud-Client und kein Browser-Workspace geben wird.

| Vorteile | Nachteile |
| --- | --- |
| Jede Version ist wiederherstellbar, mit einer Nachricht, warum | Sie müssen committen, und Sie werden es vergessen |
| Konflikte sind sichtbar und zeilenweise lösbar | Merge-Konflikte in Prosa sind unangenehm zu lesen |
| Funktioniert mit jedem Editor auf dieser Seite, und mit keinem | Keine Telefon-Story ohne eine App, die Git spricht |
| Das Remote ist auch der Veröffentlichungs-Auslöser | Ein Repository ist eine Gewohnheit, keine Einstellung |

**Für wen ist das?** Für jeden, dessen Dokumente ohnehin schon nahe am Code sitzen, und für jeden, der einmal Arbeit verloren hat und das nicht wieder vorhat. Es verwandelt Veröffentlichen auch von einem Knopf in einen Build, was ein Gewinn ist, kein Verlust: einen Branch zu pushen kann das Dokument rendern und deployen, und [direkt aus einem Repository zu veröffentlichen](/blog/publish-markdown-from-github-actions) ist ein gut ausgetretener Pfad.

### Syncthing — Synchronisation ohne irgendetwas dazwischen

Syncthing beschreibt sich selbst als ein fortlaufendes Dateisynchronisationsprogramm, das Dateien zwischen zwei oder mehr Computern in Echtzeit synchronisiert. Die eigene Seite ist direkt über die Architektur: keine Ihrer Daten wird jemals irgendwo anders gespeichert als auf Ihren eigenen Computern, und es gibt keinen zentralen Server, der kompromittiert werden könnte. Es läuft auf macOS, Windows, Linux, FreeBSD, Solaris, OpenBSD und anderen Plattformen und wird über eine Weboberfläche verwaltet (geprüft auf syncthing.net, 9. September 2026). Der Code ist MPL-2.0-lizenziert (geprüft auf github.com, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Kein Konto, kein Anbieter, kein Kontingent | Zwei Geräte müssen beide wach sein, um zu synchronisieren |
| Die Dateien bleiben schlichte Dateien in einem schlichten Ordner | Einrichtung ist pro Gerät, und die erste kostet einen Abend |
| Nichts, was in sechs Monaten neu autorisiert werden muss | Keine Historie: eine schlechte Änderung verbreitet sich so schnell wie eine gute |
| Funktioniert für einen Ordner mit allem, nicht nur Markdown | Ein Telefon ist möglich, aber nicht der einfache Fall |

**Für wen ist das?** Jemanden, der seine Dokumente auf drei Maschinen will und keine Firma dazwischen. Kombinieren Sie es mit einem Repository, wenn Sie auch Historie wollen, denn Syncthing ist sehr gut darin, jedes Gerät einig zu machen, und hat überhaupt keine Meinung dazu, welche Version die richtige war.

### HedgeDoc — derselbe Tab, auf einem Server, den Sie kontrollieren

Wenn das, was Ihnen an StackEdit gefiel, war, dass es ein Browser-Tab war, und was Ihnen nicht gefiel, wessen Browser-Tab es war, ist die selbstgehostete Option HedgeDoc. Es lässt Sie kollaborative Markdown-Notizen in Echtzeit erstellen, ist AGPLv3-lizenziert, hat eine Installationsanleitung für Selbst-Hosting und eine Demo-Instanz, und es gibt eine Alpha von HedgeDoc 2 (geprüft auf github.com, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Mehrere Menschen gleichzeitig in einem Dokument | Sie betreiben jetzt einen Server, mit Backups |
| Nichts zu installieren für jeden, der es nutzt | Notizen leben in Ihrer Datenbank, Exportieren ist also ein Job |
| Die URL gehört Ihnen und geht nirgendwo hin | Allein ist es mehr Infrastruktur, als eine einzelne Schreiberin braucht |
| Ein Browser-Workspace, dessen Speicher Sie sichern können | Kein Dateiordner, außer Sie exportieren ihn in einen |

**Für wen ist das?** Ein Team, das gemeinsames Entwerfen mehr will als Dateien, und jemanden hat, der schon Dinge betreibt. Für eine Person tauscht das ein Synchronisationsproblem gegen ein Betriebsproblem, und das zweite ist größer.

## Grund zwei: Sie wollen die Dokumente als Dateien

Der zweite Grund hat nichts damit zu tun, dass etwas kaputtgegangen ist. Es ist das Unbehagen, nicht auf Ihre Arbeit zeigen zu können. Ein Ordner mit `.md`-Dateien kann aufgelistet, durchgrept, gezippt, auf einen Stick kopiert, von allem geöffnet und in fünfzig Jahren gelesen werden. Ein Workspace kann exportiert werden, und Export ist etwas, an das man sich erinnern muss.

Alle drei Optionen unten sind gewöhnliche Anwendungen über einem gewöhnlichen Ordner, und zwischen ihnen zu wechseln ist kostenlos, weil keine von ihnen die Dateien besitzt. Der Tausch ist, dass keine von ihnen von selbst irgendetwas synchronisiert, was das Thema des ehrlichen Abschnitts weiter unten ist. Für das Schreiberlebnis selbst — wie die Bereiche angeordnet sind, wie sich Tippen anfühlt — geht [der Vergleich der Markdown-Editoren](/blog/best-markdown-editors) mehr in die Tiefe, als hier nützlich ist; was folgt, handelt von Speicherung.

### Obsidian — ein Ordner, mit einer Anwendung darüber

Obsidian öffnet ein Verzeichnis von Markdown-Dateien, nennt es einen Vault, und fügt Verlinkung, Suche und ein Plugin-System hinzu. Die Dateien bleiben die Dateien; löschen Sie Obsidian, und der Ordner bleibt unverändert. Die Website gibt an, Ihre Notizen lokal als reine Text-Markdown-Dateien zu speichern, offene Dateiformate zu nutzen, sodass Sie nie eingesperrt sind, und dass es mobile Anwendungen neben der Desktop-Anwendung gibt. Die Lizenzseite gibt an, dass Obsidian für jeden Zweck kostenlos ist, einschließlich privater, kommerzieller und gemeinnütziger Nutzung, und dass kommerzielle Lizenzen optionale Lizenzen sind, die helfen, das Projekt nutzerfinanziert zu halten (geprüft auf obsidian.md, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Reine Dateien auf der Platte, keine Datenbank, kein Exportschritt | Seine Link-Syntax ist eigen und reist nicht überallhin |
| Kostenlos für kommerzielle Nutzung, kein Konto zu erstellen | Das Plugin-Ökosystem ist eine Art, einen Nachmittag zu verlieren |
| Desktop und Telefon, über welchem Ordner auch immer Sie zeigen | Synchronisation ist eine eigene Entscheidung, die Sie jetzt besitzen |
| Suche über alles, was Sie je geschrieben haben | Es will Ihr ganzes Notizsystem sein, nicht ein Dokument |

**Für wen ist das?** Jemanden mit einem Werk statt eines Dokuments — die Person, die zweihundert StackEdit-Dokumente hat und angefangen hat zu bemerken, dass eines zu finden schwerer ist als es zu schreiben.

### VS Code — der Ordner, den Sie schon offen haben

Wenn Ihre Dokumente neben Code sitzen, läuft der Editor schon. Die Dokumentation gibt an, dass VS Code Markdown-Dateien von Haus aus unterstützt und Sie zwischen der Quelle und einer Vorschau der Datei umschalten können (geprüft auf code.visualstudio.com, 9. September 2026), und die Git-Integration bedeutet, die Sync-Frage und die Versionsfrage werden vom selben Werkzeug gleichzeitig beantwortet.

| Vorteile | Nachteile |
| --- | --- |
| Schon installiert, bei den meisten Entwicklern | Es ist eine IDE, und sieht beim Prosaschreiben auch so aus |
| Git, Terminal und Dateien im selben Fenster | Export braucht eine Erweiterung, und Erweiterungen variieren |
| Kostenlos, und gleich auf Windows, macOS und Linux | Kein Telefon |
| Erweiterungen decken Linting, Tabellen und Rechtschreibprüfung ab | Die Vorschau-Gestaltung ist nicht die exportierte Gestaltung |

**Für wen ist das?** Entwicklerinnen, und jeden, dessen Dokumente Dokumentation sind. Die README und die Release Notes gehören neben das, was sie beschreiben, ein Argument, das nichts mit Editoren zu tun hat.

### Zettlr — Dateien, mit angehängten Referenzen

Zettlr nennt sich selbst eine All-in-one-Publikations-Werkbank, die den Prozess von ersten Notizen bis zur Zeitschrifteneinreichung oder einem Buchmanuskript abdeckt, mit Referenzmanager-Integration und Zitationsunterstützung. Die Seite gibt an, es sei kostenlose Open-Source-Software, spendenfinanziert, ohne erzwungene Cloud-Synchronisation und ohne Telemetrie, verfügbar für Windows, macOS und Linux (geprüft auf zettlr.com, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Zitate und Bibliografien als erstklassiges Feature | Auf akademisches Schreiben ausgerichtet, und entsprechend geformt |
| Kostenlos, ohne Cloud-Komponente, die man ablehnen muss | Schwerer als ein Notizeneditor, wenn Sie nur Notizen schreiben |
| Reine Dateien auf der Platte, Projektordner, Exporte | Seine Exportkette erwartet, dass Sie ein bisschen Pandoc lernen |
| Lange Dokumente und Manuskripte sind der Designfall | Kein Telefon-Werkzeug |

**Für wen ist das?** Jeden, dessen Dokumente Quellen haben. Wenn Ihr StackEdit-Workspace voller LaTeX-Ausdrücke und halbfertiger Zitate ist, ist das das Nächste an einem Zuhause dafür, das auch nur ein Ordner ist.

## Grund drei: Sie wollen eine Anwendung, keinen Tab, und Sie wollen sie offline

StackEdit wirbt für Offline-Schreiben, und die Behauptung stimmt in dem bestimmten Sinn, dass ein Browser eine Anwendung cachen und sie ohne Netzwerk laufen lassen kann. Was Leute mit Offline meinen, ist üblicherweise breiter als das, und die Lücke zwischen beidem ist, wo die Frustration lebt.

Ein Browser-Workspace ist offlinefähig, aber nicht local-first. Die Anwendung muss in diesem Browser, in diesem Profil, mindestens einmal geladen worden sein. Ein privates Fenster beginnt mit nichts. Ein anderer Browser ist eine andere Installation mit einem anderen Speicher. Website-Daten, gelöscht von Ihnen, von einer Richtlinie, oder von einer gutmeinenden Datenschutz-Erweiterung, nehmen die Dokumente mit, außer ein Synchronisationsanbieter war bereits verbunden. Und ein Tab, der nicht offen ist, ist keine Anwendung: ihn versehentlich zu schließen ist ein einziger Tastendruck, und die Sitzung wiederherzustellen ist eine andere Operation als eine Datei zu öffnen. Nichts davon ist ein Defekt bei StackEdit. Es ist, was Browser-Speicher ist.

Eine Anwendung auf der Platte ändert das alles in einem Zug. Das Dokument ist eine Datei mit einem Pfad. Der Editor ist im Dock. Backups decken es schon ab, weil Backups die Platte abdecken. Zwei Optionen lohnt es sich zu nennen, und sie stehen zu beiden Seiten eines sehr kleinen Preises.

### Mark Text — kostenlos, MIT, und Rendern-beim-Tippen

Mark Text beschreibt sich selbst als einfachen Open-Source-Markdown-Editor mit Fokus auf Geschwindigkeit und Benutzbarkeit. Er hat Quelltext-, Schreibmaschinen- und Fokus-Modi, gibt HTML und PDF aus, ist MIT-lizenziert und läuft auf Linux, macOS und Windows (geprüft auf github.com, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Kostenlos unter der MIT-Lizenz, kein Konto | Prüfen Sie die jüngste Aktivität des Repositorys, bevor Sie sich festlegen |
| Rendert beim Tippen, die Syntax kommt also nicht in den Weg | Nur HTML- und PDF-Ausgabe |
| Lokale Dateien, nichts hochgeladen, nichts zu autorisieren | Keine eigene Synchronisation |
| Drei Schreibmodi, einschließlich einer reinen Quellansicht | Keine mobile Version |

**Für wen ist das?** Jemanden, der die Editor-Hälfte von StackEdit kostenlos ersetzt, auf einer Maschine, die er selbst verwaltet.

### Typora — die bezahlte, und das Exportmenü ist der Grund

Typora ersetzt das Markdown durch sein Rendering beim Tippen, und seine Exportliste ist die breiteste unter den Editoren hier. Die Seite gibt einen Preis von 14,99 $ ohne Steuer an, eine Lizenz für bis zu drei Geräte, und eine 15-tägige kostenlose Testphase, und listet Export zu PDF mit Lesezeichen zusammen mit docx, OpenOffice, LaTeX, MediaWiki und EPUB (geprüft auf typora.io, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Export zu Formaten, die kein Browser-Editor erreicht | Bezahlt, und nur Desktop |
| Ein Bereich: keine Quelle und Vorschau, die aufeinander abzustimmen sind | Die Syntax zu verstecken passt manchen Schreiberinnen und manchen nicht |
| Lokale Dateien; die Testphase ist lang genug zum Entscheiden | Kein Workspace, und kein Synchronisierer |
| Themes kontrollieren, wie das exportierte HTML aussieht | Ein Dokument auf einmal, absichtlich |

**Für wen ist das?** Jemanden, der die meisten Tage schreibt und braucht, dass das Dokument als etwas anderes als Markdown herausgeht. Wenn die wiederkehrende Aufgabe „schick das als Word-Datei“ ist, zahlt sich das Exportmenü sofort aus.

Es gibt auch die kleinere Browser-Option. Dillinger ist der andere bekannte Editor in einem Tab, und er ist um ein Dokument herum geformt statt um einen Workspace: ein Editor, eine Vorschau und ein Exportmenü. Als StackEdit-Ersatz ergibt er nur Sinn, wenn Sie weniger bewegliche Teile wollten statt anderer, und [dieselbe Vier-Wege-Frage gilt fürs Verlassen von ihm](/blog/dillinger-alternatives).

## Grund vier: Sie wollten eine Konvertierung, und der Export ist der ganze Job

Hier ist der Fall, der überhaupt keine Editor-Frage ist. Jemand hat nach dem Dokument als Webseite gefragt. Sie sind auf der Suche nach einer StackEdit-Alternative gelandet, weil StackEdit ist, wo das Dokument ist, aber was Sie brauchen, ist kein neuer Ort zum Schreiben — es ist eine Datei, die auf der Maschine einer anderen Person korrekt öffnet. Das ist der Job eines Konverters, und es ist eine Minute Arbeit statt einer Migration.

### Was StackEdits HTML-Ausgabe tatsächlich ist

StackEdits Seite beschreibt die Ausgabe als Markdown, HTML, oder formatiert über die Handlebars-Template-Engine (geprüft auf stackedit.io, 9. September 2026). Der Handlebars-Teil ist das, was Leute übersehen: die Verpackung um das gerenderte Dokument ist Ihre eigene, Sie können also produzieren, was auch immer ein Veröffentlichungsziel erwartet. Es ist auch ein Template, das Sie schreiben müssen, und bis Sie eines schreiben, bekommen Sie den Standard des Werkzeugs statt eines für eine Empfängerin entworfenen Dokuments.

Dieser Standard ist, wo drei bestimmte Dinge schiefgehen, und alle drei lohnt es sich zu prüfen, bevor Sie irgendetwas verschicken:

1. **Ist es ein Dokument oder ein Fragment?** Ein Rendering Ihres Markdown — Überschriften, Absätze, Tabellen — ist nicht dasselbe wie eine Datei mit einem Doctype, einem Head und Styles. Allein geöffnet, rendert ein Fragment als schwarzer Text in der Standardschrift des Browsers über die volle Fensterbreite, was gültiges HTML ist und für jeden, der es bekommt, kaputt aussieht.
2. **Fragt es das Netzwerk nach irgendetwas?** Ein verlinktes Stylesheet oder eine Webschrift von einem CDN sieht auf Ihrer Maschine gut aus, wo der Browser sie im Cache hat, und sieht in einem Zug falsch aus. Es sagt dem Browser der Empfängerin auch, eine Anfrage irgendwohin zu schicken, was manche Empfänger bemerken.
3. **Überleben die cleveren Teile?** LaTeX-Ausdrücke, UML-Diagramme und ABC-Partituren werden innerhalb des Editors von Bibliotheken gerendert, die auf der Seite laufen. Ob sie in der exportierten Datei als Bilder, als Markup, oder als der eingetippte Quelltext ankommen, ist nichts, das man annehmen sollte. Exportieren Sie ein Dokument mit jedem davon und schauen Sie hin.

Die Eigenschaft, die Sie wollen, ist eine selbstständige Datei: ein Dokument, Styles inline, keine externen Anfragen, sodass es auf einem Laptop ohne Verbindung identisch rendert. [Was das im Detail bedeutet, und wie man es prüft](/blog/self-contained-html-explained) ist ein eigenes Thema, und es ist der Unterschied zwischen jemandem ein Dokument zu schicken und ihm ein Dokument plus Anleitung zu schicken.

### Ein Konverter, ohne angehängten Workspace

Für den Einzeldokument-Fall ist ein browserseitiger Konverter der kürzeste Weg. Kopieren Sie das Markdown aus dem Editor heraus, oder laden Sie die `.md`-Datei herunter, und [konvertieren Sie sie zu einer selbstständigen HTML-Datei](/) — TransformPipe macht das im Browser, und abgemeldet wird nichts irgendwohin hochgeladen, was für ein noch nicht veröffentlichtes Dokument der ganze Punkt ist. Es gibt kein Konto, keinen Workspace, und nichts zu synchronisieren, weil das Werkzeug nicht versucht, irgendetwas zu behalten.

Dieselbe Form deckt die unangenehmen Jobs am Rand des Verlassens eines Workspace ab: ein Dokument, das heute für eine Kollegin zu einer Seite werden muss, ein Export, den Sie prüfen wollen, bevor Sie dem Rest vertrauen, eine Datei von jemand anderem, die Sie lesen und rendern müssen, ohne dessen Werkzeuge zu übernehmen.

### Pandoc, wenn es zweihundert davon sind

Wenn die Antwort auf „wie viele Dokumente“ eine Zahl ist statt „dieses hier“, wandert der Job zur Kommandozeile. Pandoc liest und schreibt rund vierzig Formate, ist kostenlos und GPL-lizenziert, und wird die Ausgabe in ein vollständiges Dokument packen statt in ein Fragment, wenn Sie danach fragen. Es hat auch keine Meinung zu Ihrem Workspace, was Sie wollen, wenn die Aufgabe ist, ein Verzeichnis zu durchlaufen, das aus einem Export kam, und alles davon in etwas anderes zu verwandeln. [Markdown von der Kommandozeile zu HTML zu machen](/blog/markdown-to-html-from-the-command-line) ist eine engere Frage als Pandocs volle Bandbreite, und für einen Einzelfall ist es meist mehr Werkzeug, als der Job braucht — aber für eine Migration ist es genau die richtige Menge.

## Was ein Browser-Workspace mit Synchronisation wirklich wert ist

Jede Option oben hat einen Preis, und die ehrliche Version dieses Artikels sagt klar, dass StackEdits Form eine gute Form ist. Sie ist bequem auf eine Art, die „nutz einfach Dateien“ nicht ist, und das Gegenteil vorzutäuschen bringt Leute dazu zu wechseln und es dann still zu bereuen.

**Jemand anderes hat Synchronisation für Sie gelöst.** Google Drive, Dropbox und GitHub, verkabelt und funktionierend, ist echte Ingenieursarbeit, die Sie nicht machen mussten. Ziehen Sie zu einem Dateiordner um, und das wird Ihr Job. Die Optionen sind ein Repository, an das Sie sich erinnern müssen zu committen, ein Peer-to-Peer-Werkzeug, das zwei wache Geräte gleichzeitig braucht, oder ein Cloud-Client ohne Historie, der gerne einen Fehler auf jede Maschine verbreitet, die Sie besitzen. Jedes davon funktioniert. Keines davon ist mühelos, und der Aufwand wiederholt sich.

**Keine Installation, auf jeder Maschine.** Ein gesperrter Arbeitslaptop, ein geliehener Desktop, ein Bibliothekscomputer: ein Browser-Workspace ist auf allen davon verfügbar, und ein Desktop-Editor auf keinem. Wenn ein Teil des Grundes, StackEdit zu nutzen, ist, dass Sie keine Software installieren können, ist die ganze Desktop-Gruppe oben keine Option, und die ehrlichen Alternativen sind ein anderes Browser-Werkzeug oder ein selbstgehostetes.

**Ein Telefon, das funktioniert.** Browser-Editoren sind auf einem Telefon nutzbar auf eine Art, wie ordnerbasierte Desktop-Anwendungen es nicht sind, außer die Anwendung hat eine eigene mobile App und Sie haben getrennt gelöst, den Ordner aufs Telefon zu bekommen.

**Veröffentlichen war ein Knopf.** StackEdit postet zu Blogger, WordPress und Zendesk. Dateien und ein Repository ersetzen das durch eine Pipeline, die Sie bauen. Besser, mit der Zeit — versioniert, überprüfbar, automatisiert — und es ist nicht kostenlos. Es ist ein Nachmittag, und dann eine Wartungsfläche.

**Gehen kostet auch etwas.** Ein Workspace muss Dokument für Dokument geleert werden, oder über welchen Massenweg auch immer existiert, und die Dokumente, die herauskommen, sind vielleicht nicht die Dokumente, an die Sie sich erinnern. StackEdits Syntaxliste enthält Markdown Extra und CommonMark neben GitHub Flavored Markdown, plus LaTeX, UML und ABC-Notation. Manches davon ist Standard, manches Erweiterung, und Erweiterungen sind genau das, was ein anderes Werkzeug nicht erkennen wird: ein Diagramm wird ein Codeblock, eine Formel wird wörtliche Dollarzeichen und Text. Das ist keine Beschädigung, es ist [der Unterschied zwischen Dialekten](/blog/commonmark-gfm-and-the-flavours), und es ist der Teil einer Migration, der länger dauert als erwartet. Konvertieren Sie zuerst zwei oder drei Ihrer kompliziertesten Dokumente und entscheiden Sie mit denen vor sich.

**Und die Sache, die sich nicht ändert.** Ihr Markdown ist Ihr Markdown. Jedes Werkzeug hier liest dieselben Dateien, die Entscheidung ist also umkehrbar auf eine Art, wie das Verlassen eines proprietären Dokumentformats es nicht ist. Das lohnt sich zu sagen, weil es den Einsatz senkt: Sie wählen, wo Dokumente leben und wer sie bewegt, nicht ob Sie sie nächstes Jahr lesen können.

## Wie man wählt

1. **Benennen Sie in einem Satz, was kaputtgegangen ist.** „Sync ist gescheitert“, „ich will Dateien“, „ich will eine App“, „ich brauche eine HTML-Datei“ führen zu vier verschiedenen Antworten, und ein Werkzeug zu wählen, bevor man den Grund benennt, ist, wie Leute zweimal migrieren.
2. **Entscheiden Sie, wer für Synchronisation verantwortlich ist, bevor Sie sich für einen Editor entscheiden.** Wenn die Antwort „ich, mit einem Repository“ ist, können Sie jeden Editor auf dieser Seite nutzen; wenn die Antwort „der Dienst von jemand anderem“ ist, sind Ihre realistischen Optionen ein Browser-Workspace oder eine Anwendung, die Sync verkauft, und diese Einschränkung lohnt sich, früh zu kennen.
3. **Prüfen Sie, ob Sie überhaupt Software installieren können.** Auf einer verwalteten Maschine ist die ganze Desktop-Gruppe nicht verfügbar, und der nützliche Vergleich ist zwischen Browser-Werkzeugen und einem selbstgehosteten statt zwischen Editoren.
4. **Exportieren Sie zuerst Ihre drei schlimmsten Dokumente.** Das mit einer Tabelle, das mit einer Formel, das mit einem Diagramm. Überstehen diese drei es, wird der Rest es auch; tun sie es nicht, haben Sie es in zehn Minuten gelernt statt nach dem Verschieben von zweihundert Dateien.
5. **Öffnen Sie das exportierte HTML woanders, mit ausgeschaltetem Netzwerk.** Ein anderer Browser, idealerweise eine andere Maschine. Dieser eine Test fängt Fragmente, fehlende Styles, CDN-Schriften und Diagramme, die nicht mitgereist sind, und es ist der einzige Test, der widerspiegelt, was die Empfängerin sieht.
6. **Zählen Sie die wiederkehrende Arbeit, nicht die Einrichtung.** Ein Repository kostet einen Commit pro Sitzung, für immer. Ein Cloud-Client kostet nichts pro Sitzung und gibt Ihnen keine Historie. Ein Workspace kostet eine Autorisierung alle paar Monate. Wählen Sie den Preis, den Sie tatsächlich weiterzahlen werden.

## Fazit

Es gibt keine einzelne StackEdit-Alternative, weil StackEdit vier Werkzeuge in einem Tab ist, und fast niemand will alle vier ersetzen. Wenn die Synchronisation kaputtgegangen ist, legen Sie sie unter Ihre Dateien mit einem Repository oder Syncthing und nutzen Sie einen beliebigen Editor. Wenn Sie die Dokumente als Dateien wollen, sind Obsidian, VS Code und Zettlr alle nur Anwendungen über einem Ordner und kosten Sie nichts, in beide Richtungen auszuprobieren. Wenn Sie etwas auf der Platte wollen, das ohne Browser öffnet, ist Mark Text kostenlos und Typoras Exportmenü sein kleines Geld wert. Und wenn der ganze Auftrag ein Dokument war, das jemand als Webseite braucht, migrieren Sie nichts — konvertieren Sie die Datei, prüfen Sie, dass sie mit ausgeschaltetem Netzwerk öffnet, und [schicken Sie sie als eine selbstständige Seite](/blog/share-a-markdown-document-as-a-link). Die Workspace-Frage kann auf eine Woche warten, in der nichts fällig ist.

## FAQ

### Was ist die beste StackEdit-Alternative?

Das hängt davon ab, welchen Teil von StackEdit Sie ersetzen. Für die Workspace-plus-Dateien-Hälfte ist Obsidian über einem synchronisierten Ordner die nächste einzelne Antwort; für die Editor-Hälfte auf einem Desktop ist Mark Text die kostenlose Option und Typora die bezahlte; für den Browser-Tab selbst behält ein selbstgehostetes HedgeDoc die Form und verschiebt die Speicherung auf einen Server, den Sie kontrollieren.

### Ist StackEdit kostenlos und quelloffen?

Ja. Die Website gibt an, unter einer Apache License lizenziert zu sein, und das Repository ist Apache-2.0, beschrieben als voll ausgestatteter Open-Source-Markdown-Editor, basierend auf PageDown (geprüft auf stackedit.io und github.com, 9. September 2026). Quelloffen zu sein ist auch der Grund, warum der Selbst-Hosting-Weg überhaupt existiert.

### Kann ich StackEdit selbst hosten, statt es zu verlassen?

Das Repository enthält ein Helm-Chart zum Deployen auf Kubernetes, mit Konfiguration für Dropbox-, Google-, GitHub- und WordPress-Zugangsdaten, und ein einbettbares `stackedit.js` zum Einbauen des Editors in eigene Seiten (geprüft auf github.com, 9. September 2026). Wenn Ihr Einwand die gehostete Instanz betrifft statt das Werkzeug, ist das eine kleinere Änderung als der Wechsel des Editors.

### Warum hat mein StackEdit-Dokument aufgehört, mit Google Drive zu synchronisieren?

Die üblichen Ursachen sind eine abgelaufene oder widerrufene Autorisierung, ein Workspace, der an ein anderes Anbieterkonto gebunden ist als das, bei dem Sie angemeldet sind, oder zwei Kopien, die auseinandergedriftet sind und eine Person brauchen, die sie in Einklang bringt. Die dauerhafte Abhilfe ist kein anderer Knopf, sondern eine andere Anordnung: das Dokument als Datei behalten und ein Repository oder ein Synchronisationswerkzeug es bewegen lassen.

### Gibt es eine StackEdit-Alternative, die offline funktioniert?

Jeder Desktop-Editor funktioniert offline im vollen Sinn, weil die Datei auf der Platte ist und die Anwendung kein Netzwerk braucht, um sie zu öffnen. Browser-Editoren sind offlinefähig statt local-first: sie müssen einmal in diesem Browser-Profil geladen worden sein, und Website-Daten zu löschen entfernt, was nicht synchronisiert wurde.

### Ändern sich meine Dokumente, wenn ich sie aus StackEdit heraushole?

Das reine Markdown nicht. Die Erweiterungen vielleicht: LaTeX-Ausdrücke, UML-Diagramme und ABC-Notation werden unter der Syntax aufgeführt, die StackEdit handhabt, und ein Werkzeug, das sie nicht umsetzt, zeigt stattdessen den Quelltext. Bewegen Sie zuerst Ihr kompliziertestes Dokument und schauen Sie es sich im neuen Werkzeug an, bevor Sie den Rest bewegen.

### Brauche ich überhaupt einen Editor, wenn ich nur eine HTML-Datei will?

Nein, und das ist der häufigste Fehler in dieser ganzen Suche. Wenn die Aufgabe ist „mach aus diesem Markdown eine Seite, die ich schicken kann“, macht ein Konverter das ohne Konto, ohne Workspace, und ohne irgendetwas zu synchronisieren, und das Einzige, das sich danach zu prüfen lohnt, ist, dass die zurückgegebene Datei korrekt öffnet, mit ausgeschaltetem Netzwerk.
