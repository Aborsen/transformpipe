---
title: "Brauche ich einen Static Site Generator? Ein Entscheidungsleitfaden"
description: "Ein Static Site Generator kauft Navigation, Templates, Suche und Taxonomien – und berechnet dafür eine Toolchain. Drei Fragen entscheiden, ob Sie einen brauchen."
date: 2026-09-04
tag: Veröffentlichen
keywords: brauche ich einen static site generator, static site generator oder konverter, alternative zu static site generator, mkdocs vs konverter, wann static site generator sinnvoll, markdown zu html ohne build, einfachster weg markdown veröffentlichen
---

Sie haben ein Verzeichnis voller Markdown-Dateien, und die müssen irgendwo landen. Der Rat, den Sie finden, lautet: einen Static Site Generator installieren, und davon gibt es sechs seriöse, und jeder hat eine Erste-Schritte-Seite, die in vier Befehlen mit einer laufenden Website endet. Keine dieser Seiten fragt, ob Sie überhaupt eine Website brauchten.

Das ist die Entscheidung, und sie wird meist rückwärts getroffen — zuerst wird das Werkzeug gewählt, dann wird die Anforderung so lange gedehnt, bis sie passt. Ein Generator ist ein Buildsystem. Er erwartet ein Verzeichnis, das nach seinen Regeln angelegt ist, eine Konfigurationsdatei, eine Template-Sprache, ein Theme, eine Lockfile und irgendwo, wohin die Ausgabe deployt wird. Im Gegenzug gibt er Ihnen echte Fähigkeiten, die ein Datei-für-Datei-Konverter nicht bieten kann: einen aus den Dateien berechneten Navigationsbaum, Links zwischen Seiten, die den Build brechen, wenn sie verrotten, einen Suchindex, eine Tag-Auflistung. Wenn Sie das brauchen, tut es nichts anderes. Wenn nicht, haben Sie sich eine Toolchain aufgehalst, um Seiten zu erzeugen, die ein Konverter auch ohne sie erzeugt hätte.

Das Unangenehme ist, dass die Kosten nicht an dem Tag anfallen, an dem Sie ihn installieren. Sie fallen an dem Tag an, elf Monate später, an dem ein Sicherheitshinweis eine Abhängigkeits-Aktualisierung erzwingt, das Theme nicht gegen die neue Hauptversion veröffentlicht wurde, und die Person, die den Generator gewählt hat, den Job gewechselt hat.

### Kurzfassung

Sie brauchen einen Static Site Generator, wenn die Seiten voneinander wissen müssen — gemeinsame Navigation, geprüfte seitenübergreifende Links, ein Suchindex, Tag- oder Versionslisten —, oder wenn die Ausgabe automatisch neu gebaut werden muss, jedes Mal, wenn sich die Quelle ändert. Sie brauchen keinen für ein Dokument mit einem Empfänger, oder für eine Handvoll Seiten, zwischen denen niemand navigiert; das erledigen ein Konverter und ein Link, und es gibt nichts zu pflegen. Die Anzahl der Dateien ist der falsche Test: Fünfzig unabhängige Notizen brauchen keinen Generator, und drei voneinander abhängige Seiten, die bei jedem Merge neu veröffentlicht werden müssen, brauchen einen. Wenn Sie unsicher sind, veröffentlichen Sie zuerst mit einem Konverter — die spätere Migration in einen Generator ist lästig, aber begrenzt, und die Toolchain, die Sie nie installiert haben, hat nichts gekostet, um am Leben zu bleiben.

## Was Ihnen ein Generator gibt, und was er dafür berechnet

### Die Fähigkeiten, als Fähigkeiten benannt

Marketingseiten beschreiben Generatoren mit Adjektiven. Die nützliche Beschreibung ist eine Liste von Dingen, die sie tun und ein Konverter nicht, denn genau das kaufen Sie sich ein.

**Ein aus den Dateien abgeleiteter Navigationsbaum.** Der Generator durchläuft Ihr Quellverzeichnis, liest das Frontmatter und baut aus dem, was er findet, eine Seitenleiste und einen Breadcrumb. Fügen Sie eine Datei hinzu, und sie erscheint im Menü. Ein Konverter hat kein Verzeichnis; er hat die eine Datei, die Sie ihm gegeben haben, und kann nicht wissen, was sonst noch existiert.

**Templates, auf jede Seite angewendet.** Eine Layout-Datei, und jede Seite bekommt denselben Header, Footer, kanonischen Link und Analytics-Tag. Ändern Sie das Layout, und 200 Seiten ändern sich mit. Ein Konverter wendet ein Stylesheet auf ein Dokument an; er wendet keine gemeinsame Hülle auf eine ganze Menge an.

**Geprüfte seitenübergreifende Links.** Generatoren lösen interne Links gegen den Dateibaum auf, und die meisten lassen den Build scheitern, wenn ein Link auf eine Seite zeigt, die es nicht mehr gibt. Dieses eine Verhalten ist das stärkste Argument für einen Generator bei einer Dokumentationssammlung, denn verrottende Links in Docs sind lautlos und konstant.

**Ein Suchindex.** Volltextsuche über die gesamte Sammlung, zur Kompilierzeit gebaut, ausgeliefert als JSON-Datei, die die Seite lädt. Das bekommen Sie aus konvertierten Dateien nicht. Die Browser-Suche-auf-der-Seite durchsucht ein Dokument; eine Suchbox durchsucht alle davon.

**Taxonomien.** Tags, Kategorien, Versionen, Autoren — jede wird zu ihrer eigenen erzeugten Auflistungsseite, mit Paginierung. Die Auflistung existiert nicht als Quelldatei; sie wird berechnet. So entstehen ein Blog-Index, eine Seite „alle mit API getaggten Seiten" und ein Versionsumschalter.

**Inkrementelle Builds und ein Live-Reload-Server.** Ein Generator weiß, welche Ausgaben von welchen Eingaben abhängen, eine Ein-Zeichen-Änderung baut also eine Seite neu statt aller, und der Browser aktualisiert sich, während Sie tippen. Bei einer großen Sammlung ist das der Unterschied zwischen einer Bearbeitungsschleife, in der Sie arbeiten können, und einer, durch die Sie sich warten müssen — was über ein Jahr hinweg der Unterschied ist zwischen Dokumentation, die korrigiert wird, und Dokumentation, die liegen bleibt.

**Eine Asset-Pipeline.** Bilder werden skaliert und mit Fingerabdruck versehen, Sass kompiliert, CSS und JavaScript gebündelt und für Cache-Busting gehasht. Die Ausgabe verweist auf `style.a83f1c.css`, und Sie können darauf ohne Bedenken einen Ein-Jahres-Cache-Header setzen.

**Feeds, Sitemaps und Weiterleitungen.** RSS, `sitemap.xml`, und eine Weiterleitungstabelle, damit eine alte URL weiter funktioniert, nachdem Sie eine Seite verschoben haben. Jedes davon ist langweilig, und jedes davon ist eine echte Aufgabe, die irgendetwas erledigen muss.

### Die Kosten, als Kosten benannt

**Eine Toolchain.** Eine Laufzeitumgebung, die Sie vorher nicht brauchten, auf jeder Maschine, die die Website baut: Python für MkDocs und Sphinx, Node für Docusaurus und Eleventy, eine Go- oder Rust-Binärdatei für Hugo und mdBook. Und dann dieselbe Laufzeitumgebung, in einer kompatiblen Version, in CI.

**Eine Lockfile, und der Baum darunter.** Ein JavaScript-Generator mit einem Theme und einem halben Dutzend Plugins löst sich zu einem großen Abhängigkeitsgraphen auf, und jeder Eintrag darin ist etwas, das eine Breaking Change oder einen Sicherheitshinweis veröffentlichen kann. Das ist der mit Abstand größte Unterschied zwischen den Node-basierten Generatoren und den kompilierten.

**Ein Build, der ein Jahr später bricht.** Nicht wegen irgendetwas, das Sie getan haben. Eine transitive Abhängigkeit stellt die Unterstützung für Ihre Laufzeitversion ein, ein Theme fixiert eine Peer-Abhängigkeit, die nicht mehr auflöst, die Standard-Laufzeitumgebung des CI-Images springt eine Hauptversion weiter. Die Website ist unverändert, und sie baut nicht mehr.

**Ein Theme, das Sie jetzt pflegen.** Das Theme jedes Generators haben entweder Sie selbst geschrieben, dann gehören Ihnen für immer seine Barrierefreiheit, sein Dark Mode und sein mobiles Layout, oder jemand anders hat es geschrieben, dann gehört Ihnen das Upgrade, wann immer es sich ändert. Themes sind der Ort, an dem der Großteil der Generator-Pflege tatsächlich stattfindet.

**Konfiguration als etwas, das man lernen muss.** Eine Template-Sprache — Go-Templates, Jinja, Nunjucks, JSX, Handlebars — plus die eigenen Frontmatter-Konventionen und Verzeichnisregeln des Generators. Nichts davon überträgt sich auf den nächsten Generator.

**Irgendjemand muss es kennen.** Das sind die Kosten, die Leute nicht einpreisen. Ein Generator ist nur billig, solange die Person, die ihn eingerichtet hat, noch da ist und sich noch erinnert. In dem Moment, in dem er zu „der Doku-Website, die niemand versteht" wird, wird jede triviale Änderung zu einem kleinen Rechercheprojekt, und kleine Rechercheprojekte werden nicht erledigt.

## Die Anzahl der Dokumente ist die falsche Achse

Der Instinkt ist, nach Menge zu entscheiden: eine Datei, einen Konverter nehmen; fünfzig Dateien, einen Generator nehmen. Das ist der falsche Test, und er erzeugt beide Fehlermodi. Jemand mit fünfzig unabhängigen Meeting-Notizen installiert Docusaurus und pflegt jetzt React, um Text zu veröffentlichen. Jemand mit drei voneinander abhängigen Seiten, die nach jedem Merge aktuell sein müssen, konvertiert sie von Hand, und sie sind binnen zwei Wochen veraltet.

Drei Fragen entscheiden es tatsächlich, und alle drei drehen sich um Beziehungen und Prozess, nicht um Zählen.

| Die Frage | Wenn ja | Wenn nein |
| --- | --- | --- |
| Müssen die Seiten voneinander wissen? | Sie brauchen gemeinsame Navigation, geprüfte Querverweise, einen Suchindex, Tag-Listen — die Dinge, die nur ein Build über die gesamte Sammlung berechnen kann. Das ist ein Generator, oder eine Plattform, die einer ist. | Jede Seite steht für sich. Ein Konverter pro Dokument ist kein Kompromiss; es ist die richtige Form, und zwischen den Veröffentlichungen gibt es nichts am Leben zu halten. |
| Muss es nach einem Zeitplan oder bei jeder Änderung neu veröffentlicht werden? | Irgendetwas muss unbeaufsichtigt laufen. Das heißt: ein Befehl, in CI, mit fixierten Versionen — ein Generator, oder ein Konverter plus ein Skript, aber so oder so automatisiert. | Ein Mensch, der veröffentlicht, wenn er daran denkt, ist in Ordnung, und ein Mensch kann keinen Build zuverlässig ausführen. Manuelles Konvertieren ist ehrlich; ein manueller Build-Schritt ist eine Lüge, die Sie sich selbst erzählen. |
| Wer muss ihn ausführen? | Wenn die Antwort irgendjemanden einschließt, der kein Terminal benutzt, muss der Build hinter einem Knopf stecken — ein CI-Job bei Merge, oder eine gehostete Plattform. Ein lokaler Build-Schritt schließt diese Person dauerhaft aus. | Wenn nur die Leute veröffentlichen, die die Toolchain geschrieben haben, ist ein lokaler Build in Ordnung, und die Pflegekosten bleiben bei denen, die ihn gewählt haben. |

Die erste Frage handelt von der Struktur der Ausgabe. Die zweite davon, ob ein Mensch im Prozess steckt. Die dritte davon, wer auf der Strecke bleibt, wenn die Toolchain sich danebenbenimmt — und das ist die Frage, die die Antwort am häufigsten ändert.

Zwei Ja von drei, und installieren Sie den Generator. Drei Nein, und Sie schauen sich einen Konverter und einen Link an. Ein Ja bedeutet meist die mittlere Option: ein von einem Skript gesteuerter Konverter, ein Build-Schritt ohne Buildsystem.

## Die ehrlichen Optionen, nebeneinander

Jede Zeile hier ist für irgendjemanden eine echte Antwort. Die Generatoren sind mit dem aufgeführt, worin sie geschrieben sind, denn das ist die Laufzeitumgebung, deren Installation Sie zustimmen, und mit ihrer Lizenz, denn die ist stabil und überprüfbar, auf eine Art, wie Feature-Listen es nicht sind.

| Option | Was es erzeugt | Was es braucht | Wer es ausführt | Passt zu | Kosten |
| --- | --- | --- | --- | --- | --- |
| Ein Konverter, eine Datei nach der anderen | Eine eigenständige HTML-Datei, oder ein Link | Ein Browser | Der Autor, bei Bedarf | Ein Dokument mit einem Empfänger; ein Bericht; Modellausgabe; alles, was Sie sonst als `.md` gemailt hätten | Kostenlos |
| Ein Konverter plus ein Skript in CI | Ein Verzeichnis mit HTML-Dateien, oder ein zusammengeführtes Dokument | Eine CLI oder eine API, eine Workflow-Datei | Der CI-Runner, bei Push | Eine Handvoll Seiten in einem Repository, die aktuell bleiben müssen, ohne Template-Bedarf | Kostenlos; CI-Minuten |
| MkDocs | Eine Doku-Website mit Navigation und Suche | Python | Autor lokal, oder CI | Projektdokumentation, von Entwicklern in Markdown geschrieben | Kostenlos, BSD-2-Clause (geprüft auf github.com, 9. September 2026) |
| Docusaurus | Eine React-Doku-Website mit Versionierung und i18n | Node, und React-Kenntnisse für alles Individuelle | In der Praxis CI | Versionierte Produktdokumentation mit einem Frontend-Team dahinter | Kostenlos, MIT (geprüft auf github.com, 9. September 2026) |
| Hugo | Alles von Docs bis zu einer großen Content-Website | Eine einzige heruntergeladene Binärdatei; Git, Go oder Dart Sass für manche Funktionen | Jeder mit der Binärdatei | Große Content-Websites; Teams, die keinen Paketmanager wollen | Kostenlos, Apache-2.0 (geprüft auf github.com, 9. September 2026) |
| Eleventy | Was auch immer Sie templaten, ohne aufgezwungene Struktur | Node | Autor oder CI | Leute, die einen Build mit möglichst wenig Meinung wollen | Kostenlos, MIT (geprüft auf github.com, 9. September 2026) |
| mdBook | Ein lineares Buch mit Inhaltsverzeichnis und Suche | Eine einzige heruntergeladene Binärdatei | Jeder mit der Binärdatei | Handbücher, Anleitungen, alles, was von vorn nach hinten gelesen wird | Kostenlos, MPL-2.0 (geprüft auf github.com, 9. September 2026) |
| Sphinx | Referenzdokumentation mit Querverweisen und API-Extraktion | Python; MyST-Parser, um in Markdown zu schreiben | Meist CI | Python-Projekte; alles, was echte Querverweise und Autodoc braucht | Kostenlos, BSD-2-Clause (geprüft auf github.com, 9. September 2026) |
| Eine Dokumentationsplattform | Eine gehostete Doku-Website, für Sie gebaut | Ein Konto, und Ihr angebundenes Repository | Die Plattform | Teams, die wollen, dass der Build das Problem von jemand anderem ist | Read the Docs Community ist „free, forever" für Open Source; kommerzielle Pläne sind Basic 50 $, Advanced 150 $ und Pro 250 $ pro Monat, Enterprise ab 10.000 $ pro Jahr (geprüft auf about.readthedocs.com, 9. September 2026) |
| Der eigene Renderer des Repositorys | Gerendertes Markdown an einer Repository-URL | Nichts | Niemand | Interne Docs, gelesen von Leuten, die schon Repository-Zugriff haben | Kostenlos |

Die letzte Zeile ist die Option, die Leute vergessen, und für interne Engineering-Dokumentation ist sie oft die richtige. GitHub und GitLab rendern beide in einem Repository gehaltene Markdown-Dokumente, Tabellen und Aufgabenlisten inbegriffen, an der URL der Datei selbst (geprüft auf docs.github.com und docs.gitlab.com, 9. September 2026). Es gibt keinen Build, kein Theme und kein Deploy. Was Sie verlieren, sind ein Navigationsbaum, eine auf Ihre Docs statt das ganze Repository beschränkte Suchbox, und jede Kontrolle über die Darstellung — und für ein `docs/`-Verzeichnis, das nur von den Leuten gelesen wird, die dazu committen, kostet dieser Verlust womöglich überhaupt nichts. [Dokumentation, die im Repository lebt](/blog/documentation-that-lives-in-the-repo) ist eher eine Disziplin als eine Toolchain, und die Disziplin ist der Teil, der zählt.

## Fall eins: ein Dokument, das einen Menschen erreichen muss

Das ist mit weitem Abstand der häufigste Fall und der, der am häufigsten mit zu viel Werkzeug erschlagen wird. Sie haben etwas geschrieben — einen Vorschlag, eine Übergabenotiz, einen Bericht, eine Zusammenfassung, die ein Assistent erstellt hat —, und ein Mensch oder eine kleine Gruppe muss es lesen. Es ist fertig. Es wird nicht aktualisiert. Niemand wird von dort zu einer anderen Seite navigieren.

Ein Generator ist dafür in jeder Hinsicht die falsche Form. Er will eine Website; Sie haben ein Dokument. Seine Ausgabe ist ein Verzeichnis von Dateien mit relativen Links dazwischen, Sie können es also nicht mailen — Sie müssen es hosten, was ein Deploy-Ziel bedeutet, was eine Domain oder einen Unterpfad bedeutet, was bedeutet, dass sich jemand daran erinnern muss, dass es existiert.

Was der Fall tatsächlich braucht, ist eine einzelne Datei, die überall korrekt gerendert wird, wo sie landet. Das heißt ein vollständiges HTML-Dokument statt eines Fragments, mit Inline-Stilen und ohne Anfragen an ein CDN, damit es auf einem Laptop im Flugzeug genauso aussieht wie auf Ihrem eigenen. [Was eine HTML-Datei eigenständig macht](/blog/self-contained-html-explained) ist eine enge technische Eigenschaft, und sie ist der ganze Unterschied zwischen einer Datei, die eine Weiterleitung übersteht, und einer, die es nicht tut.

| Was Sie brauchen | Konverter | Generator |
| --- | --- | --- |
| Als Anhang verschicken | Eine Datei, öffnet per Doppelklick | Verzeichnis mit Dateien und relativen Links; lässt sich nicht sinnvoll anhängen |
| Als Link verschicken | Ein veröffentlichter Link, widerrufbar | Ein Deploy, ein URL-Schema, und Hosting, das am Leben gehalten werden muss |
| Keine Installation für den Absender | Läuft in einem Browser-Tab | Eine Laufzeitumgebung und eine Paketinstallation |
| Keine Installation für den Leser | Ein Browser | Ein Browser |
| Nächsten Monat aktualisieren | Erneut konvertieren | Neu bauen und neu deployen |
| Die Quelle privat halten | Abgemeldet lädt die browserseitige Konvertierung nichts hoch | Die Quelle liegt meist in einem Repository |

**Für wen das ist:** für jeden, dessen nächste Handlung „das jemandem schicken" ist. Wenn das Dokument einen Empfänger statt eines Publikums hat, wollen Sie eine Datei oder einen Link, keine Website. [Die Wege, ein Markdown-Dokument als Link zu teilen](/blog/share-a-markdown-document-as-a-link) behandelt, was jede Methode vom Leser verlangt — der Teil, der entscheidet, ob er es tatsächlich liest.

Das eine, worauf man achten sollte: Ein von jemand anderem oder von einem Modell geschriebenes Dokument zu konvertieren bedeutet, Text zu konvertieren, der rohes HTML enthalten kann, denn Markdown erlaubt das. Ein Konverter, der gegen eine Allow-List bereinigt, kümmert sich darum. Ein Generator bereinigt meist überhaupt nicht, in der vernünftigen Annahme, dass Sie den Inhalt Ihrer eigenen Website selbst geschrieben haben.

## Fall zwei: eine Handvoll Dokumente in einem Repository

Jetzt gibt es acht Dateien in `docs/`, sie ändern sich mit dem Code, und jemand außerhalb des Repositorys muss sie lesen können. Das ist der mittlere Fall, und hier ist die Generator-Entscheidung wirklich knapp.

Stellen Sie die erste Frage von oben. Müssen diese acht Seiten voneinander wissen? Wenn es acht unabhängige Referenzen sind — eine Installationsanleitung, ein Runbook, eine API-Notiz, ein Entscheidungsprotokoll —, dann nein. Jede wird für sich gelesen, erreicht über einen Link, den jemand eingefügt hat. Wenn sie eine Abfolge bilden, oder eine Seitenleiste teilen, oder eine von ihnen eine Landingpage ist, die die anderen auflistet, dann ja, und Sie haben eine kleine Website.

Für den unabhängigen Fall ist das ehrliche Werkzeug ein Konverter mit einem Skript davor. Ein bei Push ausgelöster Workflow konvertiert die geänderten Dateien und veröffentlicht sie, und der ganze Apparat ist eine Shell-Schleife und ein CLI- oder API-Aufruf. Es gibt keine Template-Sprache, kein Theme, und keine Lockfile über das hinaus, was Ihr CI schon hat. [Ein Verzeichnis von Markdown-Dateien in einem Durchgang zu konvertieren](/blog/batch-convert-markdown-files) ist der mechanische Teil; ihn an einen Trigger anzuschließen ist der Rest.

| Ansatz | Build-Schritt | Was bricht | Wiederherstellung, wenn es bricht |
| --- | --- | --- | --- |
| Von Hand konvertieren, wenn Sie daran denken | Keiner | Nichts; die Docs veralten einfach | Sich wieder daran erinnern |
| Konverter plus ein CI-Skript | Eine Schleife und ein CLI-Aufruf | Ein CLI-Flag ändert sich, oder die Node-Version des Runners springt weiter | Die Hilfeausgabe eines Befehls lesen |
| Ein Generator in CI | Der ganze Build des Generators | Ein Theme, ein Plugin, eine Peer-Abhängigkeit, die Laufzeitumgebung | Einen Abhängigkeitsbaum durchforsten, den Sie nicht gewählt haben |
| Eine Dokumentationsplattform | Ihrer | Ihr Build, nach ihrem Zeitplan | Ein Support-Ticket eröffnen |

Der Tausch ist unkompliziert. Ein Skript gibt Ihnen weniger Fähigkeiten und weit weniger Fehlermodi, und die Fehlermodi, die es hat, sind lesbar: ein Befehl, ein Flag, ein Exit-Code. Ein Generator gibt Ihnen Navigation und Suche und einen Build, den Sie verstehen müssen, um ihn zu reparieren.

**Für wen das ist:** für Repositorys, in denen die Docs Referenzmaterial sind statt eines Produkts. Wenn Veröffentlichen bei Merge die tatsächliche Anforderung ist — und meist ist sie es, denn manuell veröffentlichte Docs sind veraltete Docs —, dann ist [Markdown aus einem GitHub-Actions-Workflow zu veröffentlichen](/blog/publish-markdown-from-github-actions) gleich viel Arbeit, egal welches Werkzeug im Job sitzt. Wählen Sie das Werkzeug danach, was Sie reparieren müssen, nicht danach, wie der Job an dem Tag aussieht, an dem Sie ihn schreiben.

Eine Sache, die ein Skript nicht kann, und die es sich zu wissen lohnt, bevor Sie sich festlegen: Es kann Ihnen nicht sagen, dass ein Link von Seite drei zu Seite sieben kaputtgegangen ist. Nichts durchläuft die Sammlung. Wenn Ihre acht Seiten stark aufeinander verlinken, wird diese fehlende Prüfung Sie mehr kosten als der Abhängigkeitsbaum des Generators.

## Fall drei: eine echte Dokumentations-Website

Hier ist der Generator richtig, und die einzige Frage ist, welcher. Die Anzeichen sind eindeutig: Dutzende Seiten, ein Navigationsbaum, den Leute nutzen, um Dinge zu finden, eine Suchbox, Mitwirkende, die nicht die Person sind, die alles eingerichtet hat, und wahrscheinlich Versionen.

Entscheiden Sie anhand zweier Dinge, in dieser Reihenfolge. Erstens, welche Laufzeitumgebung Ihr Team schon pflegt — denn der Generator, der sich eine Laufzeitumgebung mit Ihrem Projekt teilt, kostet Sie in CI nichts zusätzlich, und der, der das nicht tut, kostet Sie für immer eine zweite Toolchain. Zweitens, die Form der Ausgabe: Referenzdokumentation, ein lineares Buch, eine versionierte Produkt-Website, oder eine allgemeine Content-Website. Themes und Optik kommen an dritter Stelle, und das ist der Teil, den Sie ohnehin ändern werden.

### MkDocs

MkDocs ist ein in Python geschriebener Static Site Generator für Projektdokumentation, veröffentlicht unter der BSD-2-Clause-Lizenz (geprüft auf github.com, 9. September 2026). Seine Quellen sind Markdown-Dateien, konfiguriert mit einer einzigen YAML-Datei, es übersetzt sie mit der Python-Markdown-Bibliothek, und sein Dev-Server lädt den Browser bei jedem Speichern neu (geprüft auf mkdocs.org, 9. September 2026). Dieses mittlere Detail klärt die Erweiterungsfrage, bevor Sie sie stellen: Was eine Seite enthalten kann, ist das, was die Erweiterungen von Python Markdown ausdrücken können, eingeschaltet über `markdown_extensions`.

| Vorteile | Nachteile |
| --- | --- |
| Eine Konfigurationsdatei, kleine Lernfläche | Navigation in bewusster Reihenfolge bedeutet, die `nav`-Liste von Hand auszuschreiben; lassen Sie sie weg, werden die Dateien alphanumerisch sortiert (geprüft auf mkdocs.org, 9. September 2026) |
| Python, das viele Teams schon in CI haben | Die Standarderweiterungen sind `meta`, `toc`, `tables` und `fenced_code`; alles andere müssen Sie aktivieren und sich merken (geprüft auf mkdocs.org, 9. September 2026) |
| Material for MkDocs ist ein ausgereiftes Theme, MIT-lizenziert (geprüft auf github.com, 9. September 2026) | Das meiste, was Leute wollen, kommt vom Theme, Sie erben also seinen Upgrade-Zyklus |
| Live-Reload-Server zum lokalen Schreiben | Für nichts anderes als Dokumentation ausgelegt |

**Für wen es ist:** für Entwicklerdokumentation für ein Projekt, das schon Python nutzt, geschrieben von Leuten, die Markdown schreiben und eine YAML-Datei bearbeiten wollen.

### Docusaurus

Docusaurus baut Dokumentations-Websites und ist MIT-lizenziert, aufgebaut auf JavaScript und React (geprüft auf github.com, 9. September 2026). Die eigene Dokumentation listet Dokumentversionierung, Internationalisierung über mehrere Sprachen und MDX — interaktive, als JSX und React geschriebene Komponenten innerhalb von Markdown — unter seinen Funktionen auf (geprüft auf docusaurus.io, 9. September 2026). Das ist das Argument dafür und das Argument dagegen in einem Satz: Es ist hier die Option, die am meisten tut, auf der größten Laufzeitumgebung.

| Vorteile | Nachteile |
| --- | --- |
| Versionierung und Internationalisierung sind eingebaut, nicht angeflanscht | React und Node sind jetzt Abhängigkeiten Ihrer Dokumentation |
| MDX, Seiten können also lebende Komponenten einbetten | Alles kommt über npm, der Graph, den Sie patchen, gehört also einem Frontend-Framework statt einem Generator |
| Suchintegrationen und eine Plugin-API | Alles anzupassen bedeutet, React zu schreiben |
| Gut erprobt: viele große Projekte nutzen es | Hauptversions-Upgrades sind echte Projekte |

**Für wen es ist:** für ein Produkt mit mehreren unterstützten Versionen, mehr als einer Sprache, oder interaktiven Beispielen in den Docs — und ein Frontend-Team, das ein React-Upgrade nicht überrascht.

### Hugo

Hugo ist ein in Go geschriebener Static Site Generator, veröffentlicht unter Apache-2.0 (geprüft auf github.com, 9. September 2026), und vertrieben als herunterladbare Binärdatei statt als Paketbaum. Es ist die Option mit der kleinsten laufenden Abhängigkeitsfläche und der steilsten Template-Sprache.

| Vorteile | Nachteile |
| --- | --- |
| Eine Binärdatei, die Sie herunterladen; kein Paketmanager im Spiel | Templates sind Gos `text/template` und `html/template` (geprüft auf gohugo.io, 9. September 2026), die unnachsichtigste Syntax auf dieser Seite |
| Schnell genug, dass die Build-Zeit keine Rolle mehr spielt | Seine Dokumentation setzt voraus, dass Sie sein Vokabular schon kennen |
| Behandelt Content-Websites, nicht nur Docs: Taxonomien, Abschnitte, Feeds | Vier Editionen zur Auswahl, und die Wahl zählt |
| Themes installieren als Git-Submodul, wie es der Schnellstart tut (geprüft auf gohugo.io, 9. September 2026), oder als Hugo-Module | Theme-Konventionen unterscheiden sich stark zwischen Themes |

Hugos Editionen lohnt es sich zu kennen, bevor Sie installieren: Das Projekt dokumentiert Standard-, Deploy-, Extended- und Extended/Deploy-Builds, wobei Deploy direktes Deployment zu Google Cloud Storage, AWS S3 oder Azure Storage hinzufügt, und Extended LibSass-Transpiling für Sass hinzufügt. Dieselbe Seite merkt an, dass Git, Go und Dart Sass häufig zusammen mit Hugo genutzt werden — Git für Module und Theme-Submodule, Go zum Bauen aus dem Quellcode oder zur Nutzung von Modulen, Dart Sass für moderne Sass-Funktionen —, und dass eingebettetes LibSass veraltet ist und „in einer künftigen Version entfernt wird" (geprüft auf gohugo.io, 9. September 2026). Die Ein-Binärdatei-Geschichte stimmt also, und in dem Moment, in dem Sie aktuelles Sass oder Theme-Module wollen, bekommt sie Nachbarn.

**Für wen es ist:** für Teams, die keinen Paketmanager im Spiel wollen, Websites größer als Dokumentation, und jeden, der lieber eine Template-Sprache lernt, als einen Abhängigkeitsbaum zu pflegen.

### Eleventy

Eleventy ist ein Static Site Generator für Node, MIT-lizenziert, vom eigenen Repository beschrieben als etwas, das ein Verzeichnis von Templates in HTML verwandelt (geprüft auf github.com, 9. September 2026). Seine besondere Eigenschaft ist, dass es sehr wenig vorschreibt: kein vorgeschriebenes Verzeichnislayout, kein mitgeliefertes Theme, und eine Wahl an Template-Sprachen.

| Vorteile | Nachteile |
| --- | --- |
| Fast keine aufgezwungenen Konventionen; Sie bauen die Website, die Sie wollen | Sie bauen die Website, die Sie wollen, was heißt, Sie bauen sie |
| Viele Template-Sprachen — Nunjucks, Liquid, Handlebars, JavaScript, WebC und mehr — mischbar in einem Projekt (geprüft auf 11ty.dev, 9. September 2026) | Kein Standard-Theme, Darstellung beginnt also bei null |
| Kleiner Abhängigkeits-Fußabdruck nach JavaScript-Maßstäben | Navigation, Suche und Versionierung sind Plugins oder eigener Code |
| Reine JavaScript-Konfiguration statt eines Frameworks | Weniger fertige Doku-Setups als MkDocs oder Docusaurus |

**Für wen es ist:** für Leute, die sich das Theme eines Doku-Generators angesehen und den größten Teil davon löschen wollten — und die Zeit haben, es zu ersetzen.

### mdBook

mdBook erstellt ein Buch aus Markdown-Dateien, ist in Rust geschrieben und unter MPL-2.0 veröffentlicht (geprüft auf github.com, 9. September 2026). Es macht eine Sache gut: ein lineares Dokument mit Inhaltsverzeichnis, Kapitelnavigation und Suche. Eine einzige `SUMMARY.md` sagt ihm, welche Kapitel in welcher Reihenfolge, in welcher Hierarchie und wo die Quelldateien liegen einzuschließen sind, und das gebaute Buch antwortet auf `S` oder `/` mit einer Suchbox (geprüft auf rust-lang.github.io, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Eine Binärdatei, wie Hugo; keine Laufzeitumgebung zu installieren | Bücher, keine Websites: keine Taxonomien, keine Feeds, keine Auflistungsseiten |
| Eine einzige `SUMMARY.md` definiert die ganze Struktur | Themes sind bewusst eingeschränkt |
| Suche ohne Konfiguration inbegriffen | Nicht das Werkzeug für Referenzdokumentation, in der man herumspringt |
| Sehr wenig zu lernen oder zu pflegen | Kleineres Ökosystem als die anderen |

**Für wen es ist:** für Handbücher, Tutorials, interne Anleitungen und alles mit Kapiteln, die der Reihe nach gelesen werden.

### Sphinx

Sphinx ist ein in Python geschriebener Dokumentationsgenerator, veröffentlicht unter einer BSD-2-Clause-Lizenz, dessen Standard-Markup reStructuredText ist (geprüft auf github.com, 9. September 2026). Markdown-Unterstützung kommt von MyST-Parser, einem MIT-lizenzierten, CommonMark-konformen Parser, der die Brücke zu Sphinx schlägt (geprüft auf github.com, 9. September 2026). Die eigene Website beschreibt die Erzeugung von API-Dokumentation aus Docstrings für Python, C++ und andere Domänen; Querverweise auf Abschnitte, Abbildungen, Tabellen, Zitate, Glossare und Code-Objekte, auch projektübergreifend; und Ausgabe als HTML, LaTeX für PDF, ePub und Texinfo (geprüft auf sphinx-doc.org, 9. September 2026). Diese drei Fähigkeiten sind der Grund, warum es sein eigenes konzeptionelles Gewicht übersteht.

| Vorteile | Nachteile |
| --- | --- |
| Echte Querverweise: auf eine Funktion, einen Begriff oder eine Seite verlinken und geprüft bekommen | Standardmäßig reStructuredText, Markdown ist also ein bewusster Zusatz |
| API-Dokumentation aus dem Quellcode extrahiert | Das schwerste konzeptionelle Modell hier: Direktiven, Rollen, Domänen |
| Mehrere Ausgabeformate aus einer Quelle, PDF inbegriffen | Konfiguration ist Python, und sie wächst |
| Seit Langem etabliert in wissenschaftlichen und Python-Projekten | Overkill für eine Doku-Website ohne API-Oberfläche |

**Für wen es ist:** für Projekte, deren Dokumentation präzise auf Code verweisen muss — Bibliotheken, wissenschaftliche Software, alles, wo „auf die Docs dieser Funktion verlinken" ein tägliches Bedürfnis ist.

### Eine Dokumentationsplattform

Die vierte Kategorie ist überhaupt kein Generator: Sie verbinden ein Repository, und etwas anderes baut und hostet die Website. Read the Docs ist das altbekannte Beispiel für Sphinx- und MkDocs-Projekte, und es erklärt, dass Read the Docs Community „free, forever" für Open Source ist, mit kommerziellen Plänen bei Basic 50 $, Advanced 150 $ und Pro 250 $ pro Monat und Enterprise ab 10.000 $ pro Jahr (geprüft auf about.readthedocs.com, 9. September 2026). Es baut außerdem Ihre Dokumentation für jeden neuen Pull Request, eine Änderung lässt sich also an Ort und Stelle lesen, bevor sie landet, statt danach (geprüft auf docs.readthedocs.com, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Jemand anders besitzt die Build-Umgebung und ihre Upgrades | Sie besitzen die Konfiguration, aber nicht die Umgebung, in der sie läuft |
| Pull-Request-Vorschauen und versionierte Builds ohne Workflow-Dateien | Einen fehlgeschlagenen Build zu debuggen heißt, ihre Logs zu lesen, nicht Ihre |
| Eine URL und Hosting, das Sie nicht pflegen | Kommerzielle Preise für private Repositorys |
| Nicht-Entwicklern kann Zugriff ohne Terminal gegeben werden | Eine Migration weg bedeutet, die Pipeline neu zu bauen, die Sie sich gespart haben |

**Für wen es ist:** für Teams, die zu dem Schluss gekommen sind, dass der Generator nötig ist und die Build-Infrastruktur nicht interessant. Das ist ein vernünftiger Schluss, und es ist die einzige Option auf dieser Seite, bei der die Pflegekosten im zweiten Jahr das Personalproblem von jemand anderem sind.

## Das zweite Jahr, wo die Kosten leben

Jede Erste-Schritte-Seite misst die Kosten eines Generators in Minuten. Diese Zahl ist ehrlich und irrelevant. Die Installation sind nicht die Kosten; die Installation ist das Billigste, was dieser Website je passieren wird.

Hier ist die Form der tatsächlichen Kosten. Im ersten Monat richtet jemand den Generator ein, wählt ein Theme und bringt eine gut aussehende Website zum Veröffentlichen bei Merge. Es funktioniert. Zehn Monate lang denkt niemand darüber nach, was genau das ist, was Ihnen ein Build-Schritt einbringen soll. Im elften Monat passiert eins von vier Dingen.

Das CI-Image aktualisiert seine Standard-Laufzeitumgebung, und eine native Abhängigkeit irgendwo im Baum des Themes hat für die neue Version keine vorgebaute Binärdatei mehr, der Build scheitert also beim Kompilieren von etwas, von dem niemand wusste, dass es da war. Oder ein Sicherheitshinweis landet auf einer transitiven Abhängigkeit, das automatisierte Update öffnet einen Pull Request, und der Peer-Abhängigkeitsbereich des Themes lehnt die neue Hauptversion ab — Sie können den Hinweis also entweder offen lassen oder das Theme upgraden, was das Layout der Website ändert. Oder das Theme wird einfach nicht mehr gepflegt, und der Fork, zu dem alle gewechselt sind, hat andere Konfigurationsschlüssel. Oder nichts davon passiert, und stattdessen muss jemand eine Seite hinzufügen, entdeckt, dass die Navigation in einer YAML-Datei mit einer Reihenfolge-Konvention deklariert ist, die er sich nicht erschließen kann, und fragt in einem Kanal, in dem die einzige Person, die es wusste, gegangen ist.

Das Letzte ist das häufigste und das am wenigsten besprochene. Die echte Abhängigkeit einer Toolchain ist ein Mensch. Der Generator ist in Ordnung; das Wissen ist verdunstet. Und der Fehlschlag ist nicht dramatisch — er sieht aus wie Dokumentation, die aufhört, aktualisiert zu werden, weil die Kosten der Aktualisierung von „eine Datei bearbeiten" zu „herausfinden, wie das hier baut" gewechselt sind.

Die kompilierten Generatoren sind hier deutlich besser. Hugo und mdBook sind Binärdateien: Version fixieren, die Versionsnummer committen, und der Build, der letztes Jahr funktioniert hat, funktioniert dieses Jahr, denn zur Build-Zeit wird nichts aufgelöst. Die Node-basierten Optionen sind das andere Ende — die meiste Fähigkeit, die meisten beweglichen Teile, und eine Lockfile, die Hunderte von Dingen beschreibt, die sich unter Ihnen ändern können.

### Und das Gegengewicht, das echt ist

Nichts davon heißt „immer einen Konverter nehmen". Einen Konverter hinter sich zu lassen ist eine wirklich lästige Migration, und das Gegenteil zu behaupten wäre unehrlich.

So sieht es aus: Sie haben dreißig Seiten, die von einem Skript veröffentlicht werden. Jetzt will jemand eine Seitenleiste. Also schreiben Sie eine, von Hand, in jeder Datei — oder Sie schreiben einen kleinen Template-Schritt, und dann einen Navigations-Erzeugungsschritt, und dann einen Link-Checker, weil Seiten angefangen haben, aufeinander zu verweisen. Sechs Monate davon, und Sie haben einen schlechten Static Site Generator ohne Dokumentation und mit einem einzigen Betreuer gebaut. Das ist schlimmer, als am ersten Tag MkDocs zu übernehmen, deutlich schlimmer, und es ist ein gängiger Weg, in einem Durcheinander zu landen.

Die Migration selbst kostet: URLs ändern sich, wenn Sie nicht aufpassen, was Weiterleitungen bedeutet; Frontmatter muss in das umgeformt werden, was der Generator erwartet; alles, was Ihr Skript ad hoc getan hat, muss in einer Template-Sprache neu ausgedrückt werden. Das ist eine Woche Arbeit, kein Tag.

Die ehrliche Regel ist also asymmetrisch. Mit einem Konverter zu beginnen und später zu einem Generator zu wechseln kostet Sie eine begrenzte Migration, einmalig, falls die Anforderung tatsächlich wächst. Mit einem Generator zu beginnen, den Sie nicht brauchten, kostet Sie jedes Jahr Pflege, ob die Anforderung wächst oder nicht. Das erste Risiko ist eine bekannte Größe; das zweite ist ein Abonnement. Aber in dem Moment, in dem Sie sich dabei ertappen, Templating-Logik um einen Konverter herum zu schreiben, halten Sie an und installieren Sie einen Generator — das ist das Signal, und es ist unverkennbar, wenn es ankommt.

## Sechs Fragen, die Sie über Ihre eigene Situation beantworten sollten

Beantworten Sie diese über die Dokumente, die Sie tatsächlich haben, nicht die, die Sie nächstes Jahr haben könnten.

1. **Braucht irgendeine Seite einen Link zu einer anderen Seite, der nicht lautlos brechen darf?** Wenn ja, brauchen Sie etwas, das die gesamte Sammlung durchläuft und scheitert, wenn ein Link verrottet, also einen Generator oder eine Plattform — ein Konverter pro Datei kann die anderen Dateien nicht sehen, die Verrottung ist also unsichtbar, bis ein Leser darauf trifft.
2. **Muss jemand über alles hinweg suchen können?** Die Browser-Suche-auf-der-Seite durchsucht ein Dokument. Eine Suchbox braucht einen zur Kompilierzeit über jede Seite gebauten Index, und nichts, das Dateien einzeln konvertiert, kann einen erzeugen, diese Antwort allein kann es also entscheiden.
3. **Muss es neu veröffentlicht werden, ohne dass ein Mensch das entscheidet?** Wenn die Docs nach jedem Merge aktuell sein müssen, muss der Veröffentlichungsschritt unbeaufsichtigt laufen, und dann ist die einzige Frage, ob das Unbeaufsichtigte ein Generator oder ein Drei-Zeilen-Skript ist — aber manuelles Veröffentlichen ist keine Option, die Sie wählen können, denn es verkommt zu gar keinem Veröffentlichen.
4. **Wer ist die am wenigsten technische Person, die eine Änderung veröffentlichen muss?** Wenn diese Person kein Terminal benutzt, schließt jeder lokale Build-Schritt sie dauerhaft aus, und die Website sammelt eine Warteschlange von Änderungen an, die auf jemand anderen warten — der Build gehört also in CI oder auf eine Plattform, je nachdem, was Sie wählen.
5. **Welche Laufzeitumgebung hält Ihr Team in CI schon am Laufen?** Einen Generator auf einer Laufzeitumgebung zu wählen, die Sie sonst nicht pflegen, verdoppelt die Zahl der Toolchains, die Sie patchen, und die zweite wird immer spät gepatcht, was dazu führt, dass ein Doku-Build zum ältesten Ding in Ihrer Pipeline wird.
6. **Wenn die Person, die das einrichtet, in sechs Monaten geht, kann jemand anders eine Seite hinzufügen?** Schreiben Sie die Antwort ehrlich auf. Ist sie Nein, wählen Sie die Option mit der geringsten Konfiguration statt der meisten Fähigkeit — eine etwas schlechtere Website, die jeder bearbeiten kann, schlägt eine bessere, die niemand anzufassen wagt.

Werten Sie es aus. Zwei oder mehr Ja bei den Fragen eins bis drei bedeutet einen Generator, und die Fragen vier und fünf wählen, welchen. Sind die Fragen eins bis drei alle Nein, schauen Sie sich ein Problem in Dokumentform an, und das Werkzeug für ein Problem in Dokumentform ist ein Konverter.

## Fazit

Ein Static Site Generator ist die richtige Antwort, wenn die Seiten voneinander wissen müssen und der Build ohne Sie laufen muss. Er ist die falsche Antwort für ein Dokument mit einem Empfänger, für eine Sammlung unabhängiger Notizen, und für jede Situation, in der niemand im Team in einem Jahr den Build noch verstehen wird. Der Mittelweg ist real und wird zu wenig genutzt: ein Konverter mit einem Skript davor veröffentlicht bei jedem Push ein Verzeichnis von Seiten, ohne Theme, ohne Lockfile und mit einem Befehl zum Debuggen. Wenn Sie ein einzelnes Dokument haben, das jemanden erreichen muss und beim Ankommen richtig aussehen soll, braucht [Markdown in eine eigenständige HTML-Datei zu konvertieren](/) einen Browser und keine Installation, und danach bleibt nichts zu pflegen übrig. Installieren Sie den Generator, wenn die zweite Frage, die Sie über Ihre Dokumente stellen, lautet „wie verlinke ich die miteinander?" — und nicht davor.

## FAQ

### Brauche ich einen Static Site Generator, um eine einzelne Markdown-Datei zu veröffentlichen?

Nein. Ein Generator erzeugt ein Verzeichnis miteinander verlinkter Dateien, genau die falsche Ausgabe für ein einzelnes Dokument — Sie können es keiner E-Mail anhängen, und es zu hosten heißt, ein Deploy-Ziel am Leben zu halten. Konvertieren Sie es zu einer eigenständigen HTML-Datei, oder veröffentlichen Sie es als Link, und Sie sind fertig.

### Ist ein Static Site Generator Overkill für einen `docs/`-Ordner in meinem Repository?

Das hängt vollständig davon ab, ob die Seiten aufeinander verweisen. Acht unabhängige Referenzseiten sind einzeln konvertiert in Ordnung, oder sogar als gerendertes Markdown an ihren Repository-URLs gelesen. Acht Seiten mit gemeinsamer Seitenleiste und Querverweisen sind eine kleine Website, und ein Generator prüft die Links, die Sie sonst kaputt machen würden.

### Welcher Static Site Generator hat den geringsten Pflegeaufwand?

Die, die als einzelne Binärdatei vertrieben werden, denn zur Build-Zeit wird nichts aufgelöst. Hugo (Apache-2.0) und mdBook (MPL-2.0) installieren beide als heruntergeladene Binärdatei, eine Version zu fixieren heißt also, dass der Build, der letztes Jahr funktioniert hat, weiter funktioniert. Node-basierte Generatoren bieten mehr Fähigkeit und eine viel größere Abhängigkeitsfläche, die gepatcht gehalten werden muss.

### Kann ich einen Static Site Generator nutzen, ohne JavaScript zu kennen?

Ja. MkDocs und Sphinx sind Python, Hugo ist eine Go-Binärdatei, und mdBook ist eine Rust-Binärdatei — keines verlangt, dass Sie JavaScript schreiben. Docusaurus ist die Ausnahme: Es über die Konfiguration hinaus anzupassen bedeutet, React zu schreiben, und das ist ein fairer Grund, etwas anderes zu wählen.

### Was, wenn ich mit einem Konverter beginne und ihn hinter mir lasse?

Sie migrieren, und das kostet etwa eine Woche: Frontmatter umformen, das Verhalten Ihres Skripts in einer Template-Sprache neu ausdrücken, und Weiterleitungen hinzufügen, damit alte URLs weiter funktionieren. Das sind begrenzte, einmalige Kosten, die im Vergleich zur Pflege eines Builds, den Sie nie brauchten, gut abschneiden. Das Signal zur Migration ist der Tag, an dem Sie anfangen, Templating-Logik um den Konverter herum zu schreiben.

### Kann ich Suche über meine Dokumente hinweg bekommen, ohne einen Generator?

Nicht auf eine zufriedenstellende Art. Suche braucht einen über die gesamte Sammlung gebauten Index, was per Definition eine Build-Zeit-Aufgabe ist. Wenn eine Suchbox eine Anforderung ist, ist das einer der stärksten Gründe auf der Liste, einen Generator oder eine gehostete Dokumentationsplattform zu nutzen.

### Reicht es, Markdown auf GitHub oder GitLab zu veröffentlichen?

Für interne Engineering-Dokumentation oft ja. Beide rendern in einem Repository gehaltene Markdown-Dokumente — Tabellen und Aufgabenlisten inbegriffen — an der eigenen URL der Datei, ohne Build, ohne Theme und ohne Deploy (geprüft auf docs.github.com und docs.gitlab.com, 9. September 2026). Was Sie aufgeben, sind Navigation, auf Ihre Docs beschränkte Suche und Kontrolle über die Darstellung — was womöglich überhaupt nichts kostet, wenn die einzigen Leser die Leute sind, die schon zum Repository committen.
