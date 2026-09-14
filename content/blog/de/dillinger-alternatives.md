---
title: "Dillinger-Alternativen 2026: Gruppiert nach dem Grund, warum Sie gehen"
description: "Dillinger-Alternativen, gruppiert nach dem Grund, warum Sie eine suchen: ein Konverter statt eines Editors, etwas Offline-fähiges, oder ein Skript"
date: 2026-09-08
tag: Workflow
keywords: dillinger alternative, dillinger alternativen, dillinger io alternative, online markdown editor alternative, markdown editor ohne cloud, markdown zu html ohne editor, offline markdown editor
---

Dillinger ist gute Software und kostenlos, niemand sucht also aus Frust über das Tippen nach einer Alternative. Man sucht, weil etwas am Rand des Werkzeugs nicht gepasst hat: ein Dialog, der um die Verbindung eines Google Drive bittet, ein Export, der sich nicht so öffnete, wie er auf dem Bildschirm aussah, oder die langsame Erkenntnis, dass man einen Editor geöffnet hatte, während man eigentlich einen Konverter und eine Datei brauchte.

### Kurzfassung

Wollten Sie eine einzelne Konvertierung statt einer Schreibsitzung, ist die Antwort ein Konverter, kein weiterer Editor — Markdown Live Preview für einen Blick, ein browserseitiger Konverter für ein vollständiges HTML-Dokument, das Sie verschicken können. War der Einwand die Cloud-Verbindung, beachten Sie zunächst, dass Dillinger sagt, Dokumente blieben in Ihrem Browser und keine Daten lägen auf seinen Servern (geprüft auf dillinger.io, 9. September 2026); die Zugriffsanfrage erscheint nur, wenn Sie Dropbox, Drive, OneDrive, GitHub oder Bitbucket verknüpfen, und Sie können das einfach lassen. Wollen Sie das Werkzeug selbst auf Ihrer Maschine, bleibt StackEdit in einem Tab und funktioniert offline, und Typora, Obsidian und Zettlr sind Anwendungen. Gehört es in einen Build, trifft nichts davon zu, und Pandoc trifft zu.

„Dillinger-Alternative" sind vier Suchen in einer Phrase. Die erste ist jemand, der mit einer `.md`-Datei ankam, HTML daraus wollte und einen Zwei-Spalten-Editor mit Cloud-Menü fand — mehr Werkzeug, als die Besorgung brauchte. Die zweite ist jemand, der bei der Integrationsaufforderung anhielt, denn einen ganzen Drive mit einer Website zu verknüpfen, um eine Datei zu bewegen, ist ein schlechter Tausch. Die dritte will die Software installiert, auf einem Laptop, funktionierend im Zug, mit den Dateien auf einer Platte, die man sichern kann. Die vierte schreibt einen Build-Schritt und braucht einen Befehl, keinen Tab.

Diese vier wollen unterschiedliche Dinge, und nur eine davon will einen Editor. Das ist es wert zu wissen, bevor man irgendeine Liste liest, auch diese, denn die meisten „Dillinger-Alternativen"-Seiten beantworten alle vier Fragen mit einem gerankten Stapel Markdown-Editoren, und drei der vier Leser gehen mit dem falschen Werkzeug.

Es gibt auch einen fünften Fall, der es wert ist, genannt zu werden, denn er taucht in Support-Threads auf: Der Export kam heraus und sah nicht wie die Vorschau aus. Das ist kein Grund, den Editor zu wechseln. Es ist eine Eigenschaft davon, wie das HTML geschrieben wurde, und behebbar, ohne irgendetwas zu migrieren.

## Dillinger auf seinen eigenen Bedingungen

Dillinger ist ein browserbasierter Markdown-Editor mit Live-Vorschau, gebaut auf dem Monaco-Editor — derselben Editing-Komponente, die VS Code nutzt. Er bietet scrollsynchrone Vorschau, Vim- und Emacs-Tastenkombinationen hinter einer Einstellung, Drag-and-Drop von Markdown-, HTML- und Bilddateien, einen Dunkelmodus und einen Vollbild-Zen-Modus. Export wird beschrieben als „Markdown, gestyltes HTML oder PDF", als Ein-Klick-Download. Dokumente speichern sich automatisch im Speicher Ihres Browsers, und die Website sagt es unumwunden: „No account required, no data on our servers" (geprüft auf dillinger.io, 9. September 2026).

Es ist Open Source. Das Repository nennt die MIT-Lizenz und listet den Stack als Next.js, Monaco, Tailwind CSS und Zustand, mit einem schlichten `npm run build` und `npm start`, um es selbst zu betreiben (geprüft auf github.com/joemccann/dillinger, 9. September 2026). MIT heißt, Sie können es hosten, forken und ändern, was mehr ist, als die meisten kostenlosen Web-Werkzeuge bieten, und das ehrliche Gegengewicht zu allem unten.

Die Integrationen sind der Teil, auf den Leute reagieren. Fünf sind gelistet — GitHub, Dropbox, Google Drive, OneDrive und Bitbucket — zum Importieren von Dateien und Zurückspeichern zu ihnen, und die Website vermerkt, dass die Dropbox-Verbindung über OAuth erfolgt (geprüft auf dillinger.io, 9. September 2026). Nichts daran ist ungewöhnlich oder unangemessen. Es ist schlicht der Punkt, an dem ein kostenloser Editor nach etwas fragt, das ein Konverter nie fragen muss, und der Punkt, an dem viele Leute den Tab schließen.

| Vorteile | Nachteile |
| --- | --- |
| Nichts zu installieren, und kein Konto anzulegen | Es ist ein Editor: Der kürzeste Weg ist immer noch schreiben, dann exportieren |
| Monaco bietet echtes Editieren — mehrere Cursor, Suchen und Ersetzen | Die Seite kommt von einer gehosteten Domain, der erste Ladevorgang braucht also das Netzwerk |
| Dokumente bleiben im Browser-Speicher erhalten, nichts auf ihren Servern | Browser-Speicher ist pro Browser und pro Profil, und Website-Daten löschen löscht ihn |
| Exportiert Markdown, gestyltes HTML und PDF mit einem Klick | Cloud-Synchronisierung heißt, einer Website Zugriff auf einen Drive oder ein Repository zu gewähren |
| MIT-lizenziert, Sie können es also selbst hosten | Das Export-Styling ist das des Werkzeugs, und „gestylt" ist nicht dasselbe wie eigenständig |

**Lizenz:** kostenlos, MIT (geprüft auf github.com/joemccann/dillinger, 9. September 2026).

**Für wen ist das?** Für jemanden, der gerade jetzt ein Dokument schreibt, in einem Browser, und eine Live-Vorschau und am Ende eine Datei will. Auf dieser Aufgabe ist es schwer zu schlagen, und es gibt keinen Grund zu gehen. Jeder Grund unten handelt von einer anderen Aufgabe.

Zwei Dinge sind es wert, geprüft zu werden, bevor Sie entscheiden, dass das Werkzeug Sie im Stich gelassen hat. Erstens ist Browser-Speicher kein Backup: Er lebt in einem Browser auf einer Maschine, und ein gelöschter Cache oder ein privates Fenster nimmt das Dokument mit. Zweitens sind ein „gestylter HTML"-Export und ein eigenständiges HTML-Dokument getrennte Eigenschaften. Öffnen Sie die exportierte Datei mit ausgeschaltetem Netzwerk, in einem anderen Browser. Sieht sie noch richtig aus, kamen die Stile mit. Wird sie zu schwarzem Text auf weißem Grund in voller Fensterbreite, zeigte das Styling irgendwohin, das die Datei nicht erreichen kann — ein Problem, [das es sich lohnt, richtig zu verstehen](/blog/self-contained-html-explained), denn es wird Sie zu jedem Werkzeug begleiten, zu dem Sie wechseln.

## Kurzvergleich: die Übersichtstabelle

| Werkzeug | Greifen Sie danach, wenn | Wo der Text lebt | Läuft auf | Lizenz |
| --- | --- | --- | --- | --- |
| Dillinger | Sie gerade schreiben und eine Vorschau wollen | Browser-Speicher, plus ein Cloud-Drive, wenn Sie eines verknüpfen | Jeder Browser | Kostenlos, MIT |
| Ein Browser-Konverter | Sie haben eine Datei und brauchen ein fertiges HTML-Dokument | Nichts verlässt die Maschine, wenn abgemeldet | Jeder Browser | Kostenlos |
| Markdown Live Preview | Sie wollen nur sehen, wie es dargestellt wird | Die Seite, auf der Sie sind | Jeder Browser | Kostenlos, MIT |
| StackEdit | Sie wollen einen Browser-Editor, der offline weiterläuft | Browser-Speicher, bis Sie Sync verbinden | Jeder Browser | Kostenlos, Apache-Lizenz 2.0 |
| Typora | Sie schreiben die meisten Tage und wollen eine Anwendung | Lokale `.md`-Dateien | macOS, Windows, Linux | Bezahlt, einmalig |
| Obsidian | Viele Notizen, die aufeinander verweisen | Ein lokaler Ordner Ihrer Wahl | Desktops, Telefone, Tablets | Kostenlos für alle Zwecke |
| Zettlr | Das Dokument hat Zitate und eine Zielvorlage | Lokale `.md`-Dateien | macOS, Windows, Linux | Kostenlos, GNU GPL v3 |
| VS Code | Das Markdown liegt schon neben Code | Dateien im geöffneten Ordner | macOS, Windows, Linux | Produktlizenz; Code-OSS ist MIT |
| Pandoc | Die Konvertierung muss ohne eine Person laufen | Wo Ihre Dateien schon liegen | Kommandozeile | Kostenlos, GPL |
| Eine REST-API oder ein CLI | Die Konvertierung gehört zu einer Pipeline | Ihr Repository oder Runner | Server, CI, Terminal | Unterschiedlich |

## Grund eins: Ich will einen Konverter, keinen Editor

Das ist die größte Gruppe, und die, der die Listen am schlechtesten dienen. Sie haben schon eine `.md`-Datei — ein README, einen Export aus einer Notiz-App, etwas, das ein Modell für Sie geschrieben hat —, und die Aufgabe ist, sie in eine Seite zu verwandeln, die eine Person öffnen kann. Dillinger kann das: Text einfügen, das Export-Menü nutzen. Aber die Form des Werkzeugs passt nicht zur Besorgung. Es stellt einen Cursor vor Sie und bittet Sie zu schreiben, wenn nichts mehr zu schreiben übrig ist.

Ein Konverter hat eine andere Form. Sie geben ihm eine Datei, er gibt Ihnen eine Datei zurück, und dazwischen gibt es kein Dokument zu verwalten. Nichts wird gespeichert, nichts synchronisiert, und es gibt keinen Zustand zu verlieren.

### TransformPipe — für ein fertiges HTML-Dokument, das Sie verschicken können

Ein browserseitiger Konverter nimmt die Markdown-Datei und gibt ein vollständiges HTML-Dokument zurück, Stile inline, in einer Datei. Es gibt keine Installation und kein Konto, und abgemeldet wird nichts hochgeladen — die Datei wird auf der Maschine vor Ihnen gelesen, konvertiert und dargestellt, was Sie bestätigen können, indem Sie das Netzwerktab dabei beobachten.

| Vorteile | Nachteile |
| --- | --- |
| Die Ausgabe ist eine Datei, die das Netzwerk um nichts bittet | Keine Schreibumgebung: keine Live-Vorschau zum Hineintippen |
| Nichts wird hochgeladen, wenn abgemeldet, und kein Konto ist nötig | Der Browser erledigt die Arbeit, eine sehr große Datei hängt also von der Maschine ab |
| Rohes HTML in der Quelle durchläuft eine feste Positivliste, bevor es dargestellt wird | Keine Vorlagensprache für ein maßgeschneidertes Layout |
| Konvertiert auch HTML, Word, CSV und JSON in die andere Richtung | Ein Dokument auf einmal, oder mehrere zu einem zusammengeführt |

**Lizenz:** kostenlos nutzbar. Konvertierung ist bei 10 MB gedeckelt, ein im Konto gehaltenes Dokument bei 4 MB, weil die dahinterliegende Funktion eine Anfrage oder einen Antwortkörper über 4,5 MB ablehnt.

**Technische Details und Funktionen**

- GitHub Flavored Markdown: Tabellen, Aufgabenlisten, Durchgestrichenes, Autolinks, eingezäunte Codeblöcke
- Die Ausgabe ist ein vollständiges Dokument — Doctype, Head, ein Inline-`<style>`-Block, keine externen Anfragen
- Download als `.html`, `.md` oder reiner Text, oder Druck zu PDF über den eigenen Dialog des Browsers
- Dieselbe Konvertierung ist über eine REST-API, ein abhängigkeitsfreies CLI, eine GitHub Action und einen MCP-Server verfügbar

**Für wen ist das?** Für jeden, dessen nächster Schritt „das jemandem schicken" ist. Kamen Sie mit einer Datei zu Dillinger und gingen mit einem Dokument, bei dem Sie nicht sicher waren, ob es auf einer anderen Maschine öffnet, ist das der Tausch, der es behebt, und er dauert etwa so lang wie der Export.

### Markdown Live Preview — zum Ansehen, nicht zum Verschicken

Markdown Live Preview ist genau das, was sein Repository sagt: „a tiny web tool to preview Markdown formatted text", dort beschrieben als „markdown editor with live preview" und unter MIT-Lizenz veröffentlicht (geprüft auf github.com/tanabe/markdown-live-preview, 9. September 2026). Seine eigene Website verweigerte am Tag, an dem dies geschrieben wurde, eine automatisierte Anfrage, alles oben stammt also aus dem Repository statt von der Seite.

| Vorteile | Nachteile |
| --- | --- |
| Das Repository ist klein genug zu lesen, und MIT-lizenziert | Eine Vorschau, keine Export-Pipeline |
| Nichts dokumentiert, wozu man sich anmelden oder es synchronisieren müsste | Seine Darstellung ist nicht zwangsläufig die Ihres Zielrenderers |
| Eine Aufgabe, erledigt auf der Seite | Nichts zu behalten: Es ist eine Kritzelfläche |

**Lizenz:** kostenlos, MIT (geprüft auf github.com/tanabe/markdown-live-preview, 9. September 2026).

**Für wen ist das?** Für jemanden, der prüft, ob eine Tabelle richtig gebildet ist oder ob eine verschachtelte Liste richtig verschachtelt. Es ist die richtige Größe für eine Fünf-Sekunden-Frage und die falsche für das Erzeugen eines Dokuments. War Ihre einzige Interaktion mit Dillinger, Text einzufügen, um zu sehen, ob er richtig aussieht, ersetzt das es mit weniger drumherum.

### Was die Konverter-Gruppe Ihnen bringt

Der gemeinsame Faden ist, dass es kein Dokument zu verlieren gibt. Kein Browser-Speicher zu leeren, kein Sync zu konfigurieren, kein OAuth-Prompt, und kein halbfertiger Entwurf in einem Tab, den Sie letzte Woche geschlossen haben. Der Tausch ist eine Datei für eine andere, und dann ist es vorbei. Für einen überraschenden Anteil des Verkehrs hinter dieser Suche ist das die ganze Anforderung, und alles andere auf der Seite ist eine Antwort auf eine Frage, die der Leser nicht gestellt hat.

Es ändert auch, was „sicher" bedeutet. Ein Online-Konverter, der hochlädt, hat Ihr Dokument; einer, der im Browser konvertiert, hat es nicht. Dieser Unterschied [lohnt sich zu prüfen statt anzunehmen](/blog/is-an-online-converter-safe), für jedes Werkzeug in dieser Kategorie, auch die hier, denn beide Bauformen existieren, und die Seite führt selten damit an, welche es ist.

## Grund zwei: Ich will es offline, oder irgendwo, das ich kontrolliere

Die zweite Gruppe will das Werkzeug auf ihrer Seite des Netzwerks. Manchmal ist das Richtlinie — eine Arbeitsmaschine, das Dokument eines Kunden, eine Branche, in der „wir haben es in eine Website eingefügt" kein akzeptabler Satz ist. Manchmal ist es praktisch: ein Zug, ein Flugzeug, ein Gebäude mit schlechtem WLAN. Und manchmal ist es einfach eine Vorliebe für Software, die weiterläuft, wenn eine Firma das Interesse verliert.

Seien Sie präzise darüber, was Dillinger hier tut und nicht tut, denn die Reflexannahme ist meist falsch. Die eigene Seite sagt, der Editor funktioniere ohne Verbindung weiter, sobald er geladen ist, und Dokumente speicherten sich automatisch in den lokalen Browserspeicher, ohne Daten auf ihren Servern (geprüft auf dillinger.io, 9. September 2026). Was es nicht kann, ist ohne den ersten Ladevorgang zu existieren: Die Anwendung wird von einer Domain ausgeliefert, der Code kommt also jedes Mal übers Netzwerk an, wenn er nicht im Cache liegt, und die Version, die Sie bekommen, ist die gerade deployte. Das ist eine andere Eigenschaft als eine signierte Anwendung auf Ihrer Platte, und für manche Leser ist das der ganze Unterschied.

### StackEdit — der Browser-Editor, gebaut, um offline zu funktionieren

StackEdit ist ein browserinterner Markdown-Editor mit Live-Vorschau und Scroll-Synchronisierung, und wirbt direkt mit Offline-Nutzung: „Even when you travel, StackEdit is still accessible and lets you write offline just like any desktop application." Es synchronisiert Dateien mit Google Drive, Dropbox und GitHub, veröffentlicht auf Blogger, WordPress und Zendesk und ist unter der Apache-Lizenz 2.0 lizenziert (alles geprüft auf stackedit.io, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Offline-Nutzung ist ein erklärtes Designziel, kein Nebeneffekt | Immer noch ein Browser-Tab, mit derselben Abhängigkeit vom ersten Laden |
| Mehr Schreibwerkzeug als Dillinger: WYSIWYG-Steuerelemente, Kommentare | Sync-Ziele sind dieselben Cloud-Drives, die Sie vielleicht meiden |
| Kommt mit langen Dokumenten klar | Seine erweiterte Syntax — Diagramme, Notenblätter — reist schlecht anderswohin |
| Apache-Lizenz 2.0, kann also selbst gehostet werden | Export-Styling ist sein eigenes |

**Lizenz:** kostenlos, Apache-Lizenz 2.0 (geprüft auf stackedit.io, 9. September 2026).

**Technische Details und Funktionen**

- GitHub Flavored Markdown, plus LaTeX-Mathematik, UML-Diagramme und Musiknoten-Erweiterungen
- Sync mit Google Drive, Dropbox und GitHub; Veröffentlichung auf Blogger, WordPress und Zendesk
- Eine einbettbare Komponente, `stackedit.js`, um den Editor in eine andere Anwendung einzubauen
- Kommentar- und Kollaborationsfunktionen für Review statt Solo-Entwürfe

**Für wen ist das?** Für jemanden, der den Browser-Tab mochte und einen ernsthafteren Editor darin will, besonders wo Software installieren keine Option ist. Es ist der nächstliegende Gleich-für-Gleich-Tausch auf dieser Seite, und derselbe Vorbehalt gilt: Wenn Sie sich am Verbinden eines Drives gestört haben, wird StackEdit Ihnen dieselben drei anbieten.

### Typora — die Anwendung, wenn Sie fast täglich schreiben

Typora ist ein Desktop-Editor für macOS, Windows und Linux, der das Vorschaufenster, den Modus-Umschalter und die Syntaxmarker entfernt und das Dokument beim Tippen darstellt; seine Themes werden als „fully configurable by CSS" beschrieben (beides geprüft auf typora.io, 9. September 2026). Seine Dokumentation sagt, Typora „supports exporting the current document into PDF, HTML, HTML (without styles) and the Image format", und listet Word, OpenOffice, LaTeX, EPUB und den Rest als Exporte, die über ein installiertes Pandoc laufen (geprüft auf support.typora.io, 9. September 2026). Weil das Theme CSS ist, erbt der HTML-Export, welches Stylesheet auch immer aktiv ist, statt eines festen Hausdesigns.

| Vorteile | Nachteile |
| --- | --- |
| Eine Spalte, keine geteilte Ansicht, kein Syntax-Rauschen | Bezahlt, und nur Desktop |
| Themes sind CSS, Exporte können also Ihr eigenes Styling tragen | Drei Geräte pro Lizenz |
| Gewöhnliche `.md`-Dateien auf einer Platte, die Sie kontrollieren | Ein Dokument auf einmal; kein Stapelwerkzeug |
| Keine zu gewährenden Integrationen, weil es keine gibt | Die Syntax beim Tippen zu ersetzen passt manchen Schreibern und anderen nicht |

**Preis:** 14,99 $ ohne Steuer, ein einmaliger Kauf, der bis zu drei Geräte abdeckt, mit 15 Tagen kostenloser Testphase (geprüft auf typora.io, 9. September 2026).

**Für wen ist das?** Für Leute, deren Markdown-Gewohnheit einem Tab entwachsen ist. Es ist der einzige bezahlte Eintrag hier und der einzige, bei dem der Grund zu zahlen das Tippen ist statt die Ausgabe. Vergleichen Sie schon Desktop-Editoren, sind [die Gründe, aus denen Leute wiederum von Typora wegziehen](/blog/typora-alternatives), es wert, gelesen zu werden, bevor Sie kaufen, denn die Gerätegrenze erwischt Leute eher später als früher.

### Obsidian — wenn Dokumente aufeinander verweisen

Obsidian arbeitet über einen Ordner mit Markdown-Dateien auf Ihrer eigenen Platte, mit Links zwischen Notizen als Organisationsidee. Es ist kein Konverter und in erster Linie kein Editor für ein einzelnes Dokument; es ist eine Anwendung für eine Sammlung davon. Die eigene Website sagt, es „stores your notes locally as plain text Markdown files", bietet Builds für Windows, macOS, Linux, iOS und Android, und beschreibt „thousands of plugins" neben einer offenen API. Die Lizenzseite sagt, es könne kostenlos für jeden Zweck genutzt werden, einschließlich persönlicher, kommerzieller und gemeinnütziger Nutzung, mit optionalen kostenpflichtigen Lizenzen, die nicht erforderlich sind, und beschreibt die Anwendung nicht als Open Source (alles geprüft auf obsidian.md, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Dateien bleiben in einem Ordner Ihrer Wahl, in reinem Markdown | Enormer Aufwand, wenn Sie ein einzelnes Dokument haben |
| Kostenlos für jeden Zweck, kommerziell eingeschlossen | Die Lizenzseite behauptet nicht Open Source, es gibt also keinen Quellcode zum Selbsthosten |
| Läuft auf Desktops, Telefonen und Tablets | Seine wiki-artigen Links und Embeds sind kein Standard-Markdown |
| Ein großes Plugin-Ökosystem, einschließlich Export-Plugins | Exportqualität hängt davon ab, welches Plugin Sie installieren |

**Lizenz:** kostenlos für alle Zwecke; bezahlte Catalyst- und Commercial-Lizenzen sind optional (geprüft auf obsidian.md, 9. September 2026).

**Für wen ist das?** Für jemanden, dessen Dillinger-Nutzung sich still zu einem Ablagesystem entwickelt hat — mehrere Dokumente, jedes in einem Tab, keines später auffindbar. Das ist eine Aufgabe für einen Ordner und eine Anwendung darüber. Es ist ein großer Schritt für ein kleines Ärgernis, und [der Vergleich der Editoren in dieser Kategorie](/blog/best-markdown-editors) ist ein besserer Startpunkt als diese Seite.

### Zettlr — wenn das Dokument eine Bibliografie und ein Zielformat hat

Zettlr ist eine Schreibanwendung für Windows, macOS und Linux, die Export als erstklassigen Schritt behandelt, angetrieben von Pandoc über ein Profilsystem: „you can export any paper with a template in just one click". Es integriert mit Literaturverwaltungen einschließlich Zotero und JabRef und arbeitet mit LaTeX- und Word-Vorlagen (alles geprüft auf zettlr.com, 9. September 2026). Es ist unter der GNU GPL v3 lizenziert (geprüft auf github.com/Zettlr/Zettlr, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Export-Profile, angetrieben von Pandoc, mit echten Vorlagen | Pandocs Fähigkeiten kommen mit Pandocs Lernkurve |
| Zitate aus Zotero oder JabRef, im Dokument | Schwerer als alles andere in dieser Gruppe |
| GPL v3, und Ihre Dateien bleiben, wo Sie sie hinlegen | Ausgerichtet auf akademisches Schreiben, was jede Voreinstellung prägt |
| Volltextsuche über ein Projekt | Kein schnelles Ein-Datei-Konvertierungswerkzeug |

**Lizenz:** kostenlos, GNU GPL v3 (geprüft auf github.com/Zettlr/Zettlr, 9. September 2026).

**Für wen ist das?** Für Leute, die etwas mit Referenzen und einem erforderlichen Ausgabeformat schreiben — eine Arbeit, eine Dissertation, ein Manuskript. Haben Sie aus Dillinger exportiert und dann jedes Mal das Ergebnis von Hand repariert, ist ein Werkzeug mit Vorlagen die strukturelle Lösung.

## Grund drei: Ich will es in dem Editor, den ich schon habe

Die dritte Gruppe sind Entwickler, und die Antwort ist kurz: Ist die Datei schon in Ihrem Editor offen, ist das der Ort, an dem die Konvertierung passieren sollte. Zu einem Browser-Tab zu wechseln, um eine Datei darzustellen, die zwei Fuß entfernt auf der Platte liegt, ist die Art Gewohnheit, die den Grund dafür lange überlebt.

### VS Code — die Vorschau ist schon installiert

VS Code liefert eine Markdown-Vorschau, gebaut auf markdown-it, derselben Renderer-Familie, in der Dillingers Vorschauproblem sitzt, und sie öffnet sich neben der Datei per Tastendruck. Export ist nicht eingebaut; Erweiterungen liefern ihn, und ihre Qualität variiert. Das Quell-Repository, Code - OSS, ist MIT-lizenziert, während das gebrandete Produkt, das Microsoft vertreibt, eine Microsoft-Produktlizenz trägt (geprüft auf github.com/microsoft/vscode, 9. September 2026).

| Vorteile | Nachteile |
| --- | --- |
| Für die meisten Entwickler schon installiert | Export braucht eine Erweiterung, und Erweiterungen unterscheiden sich |
| Die Vorschau spiegelt markdown-its CommonMark-Verhalten | Das Styling der Vorschau ist nicht das Export-Styling |
| Die Datei verlässt nie den Ordner, in dem sie lebt | Keine Pipeline: konvertiert nur, was offen ist |
| Vim-Tastenkombinationen, mehrere Cursor, alles, was Monaco bot | Kein Live-Cloud-Sync, was für diese Gruppe der Punkt ist |

**Lizenz:** das Produkt steht unter einer Microsoft-Produktlizenz; die Code-OSS-Quelle ist MIT (geprüft auf github.com/microsoft/vscode, 9. September 2026).

**Technische Details und Funktionen**

- Vorschau nebeneinander mit Scroll-Synchronisierung, per Tastenkombination
- markdown-it unter der Vorschau, CommonMark-Verhalten ist also die Basis, GFM-Funktionen kommen aus Presets
- Erweiterungen für HTML-, PDF- und Folien-Export, jede umschließt das Fragment anders
- Ein ordnerbasierter Workspace, das Markdown liegt also bei dem Code, den es dokumentiert

**Für wen ist das?** Für jeden, der beiläufig ein README oder eine Notiz konvertiert, während er schon im Editor ist. Es gibt hier eine amüsante Symmetrie: Dillingers Editing-Komponente ist Monaco, was VS Codes für den Browser extrahierter Editor ist, ein Entwickler, der Dillinger für VS Code verlässt, lernt also überhaupt keinen neuen Editor. Er entfernt einen Browser zwischen sich und seinen Dateien.

Lebt das Markdown in einem Repository, ist hier auch der Rest der Toolchain — Linting, Rechtschreibung, Diffs, Review. Ein Dokument, das über ein Web-Werkzeug bearbeitet und zurückgeklebt wird, ist ein Dokument ohne Historie, und Historie war die Hauptsache, wofür ein Repository da war.

## Grund vier: Ich will es in einem Skript

Die vierte Gruppe will kein Werkzeug mit einem Cursor darin mehr. Die Konvertierung passiert fünfzigmal, oder bei jedem Commit, oder um drei Uhr morgens, und jede Antwort mit einem Browser-Tab ist keine Antwort. Nichts in der Editor-Kategorie bedient das, weshalb es die Gruppe ist, der am ehesten die falsche Empfehlung gegeben wird.

### Pandoc — die allgemeine Antwort

Pandoc ist ein Kommandozeilen-Dokumentkonverter, der eine große Zahl an Markup-Formaten liest und schreibt. Die eigene Website sagt: „Pandoc is free software, released under the GPL." (geprüft auf pandoc.org, 9. September 2026). Für diese Aufgabe sind die relevanten Flags im Handbuch dokumentiert: `--standalone` (`-s`) erzeugt „output with an appropriate header and footer (e.g. a standalone HTML, LaTeX, TEI, or RTF file, not a fragment)", und `--embed-resources` erzeugt „a standalone HTML file with no external dependencies, using `data:` URIs to incorporate the contents of linked scripts, stylesheets, images, and videos" (geprüft auf pandoc.org, 9. September 2026).

```sh
pandoc notes.md -s --embed-resources -o notes.html
```

| Vorteile | Nachteile |
| --- | --- |
| Ein Befehl, wiederholbar, skriptbar, kein Tab | Braucht eine Installation und ein Terminal |
| `--standalone` und `--embed-resources` erzeugen eine echte einzelne Datei | Vorlagen und Filter sind ihr eigenes Thema |
| `--template` gibt genaue Kontrolle über die Hülle | Kein Bereinigen: rohes HTML läuft direkt durch |
| Liest und schreibt weit mehr als Markdown und HTML | Seine Markdown-Dialekte weichen stellenweise von GFM ab |

**Lizenz:** kostenlos, GPL (geprüft auf pandoc.org, 9. September 2026).

**Technische Details und Funktionen**

- `--standalone` umschließt die Ausgabe in einem vollständigen Dokument statt ein Fragment auszugeben
- `--embed-resources` bettet Stylesheets, Skripte und Bilder als `data:`-URIs ein
- `--template` wählt eine Vorlagendatei oder URL, und impliziert `--standalone`
- `--sandbox` beschränkt den Datei-Zugriff von Lese- und Schreibprogrammen auf die in der Kommandozeile genannten Dateien, was zählt, wenn die Eingabe nicht Ihnen gehört

**Für wen ist das?** Für jeden mit einer wiederholten Konvertierung, einem Verzeichnis voller Dateien, oder einem anderen Ausgabeformat als HTML. Der Tausch ist eine Installation und etwas Lesen gegen eine Konvertierung, die nie wieder eine Person braucht. Gehört das ins Terminal, deckt [die engere Frage, Markdown dort zu HTML zu machen](/blog/markdown-to-html-from-the-command-line), auch die Alternativen zu Pandoc ab.

### Eine API, ein CLI oder eine CI-Action — wenn die Installation das Problem ist

Die andere Form dieser Antwort ist eine gehostete Konvertierung ohne Laufzeitumgebung zu installieren: ein REST-Endpunkt, den Ihr Skript aufruft, ein abhängigkeitsfreies CLI, das Sie ohne Paketmanager ausführen, oder eine Action, die in einem Pull Request läuft. Es ist dieselbe Konvertierung wie die im Browser, verlagert dorthin, wo die Automatisierung lebt.

| Vorteile | Nachteile |
| --- | --- |
| Nichts auf dem Runner zu installieren | Ein Netzwerkaufruf, mit allem, was das mit sich bringt |
| Dieselbe Ausgabe wie die interaktive Konvertierung | Größenlimits gelten für das, was Sie senden können |
| Passt in einen Pull Request oder einen nächtlichen Job | Weniger flexibel als ein lokales Pandoc mit Vorlagen |

**Für wen ist das?** Für Teams, deren CI-Runner abgeschottet sind, oder für jeden, der keine Haskell-Installation in einem Container will, um eine Datei in eine Seite zu verwandeln. Es lohnt sich, klar zu sagen, dass Pandoc das fähigere Werkzeug ist und ein gehosteter Aufruf das bequemere, und dass Bequemlichkeit ein legitimer Grund ist, das kleinere Ding zu wählen.

## Wo die naheliegende Antwort scheitert, und was der Wechsel kostet

Hier ist der Teil, um den die Alternativlisten — und diese hier, bis eben — herumgetanzt sind. **Ein Editor und ein Konverter sind unterschiedliche Werkzeuge, und die meisten, die nach „Dillinger-Alternative" suchen, wollen das zweite.** Jemandem, der eine einzelne Datei in der Hand hält, einen weiteren Editor zu empfehlen, ist die selbstsicher gegebene falsche Antwort, und es ist die häufigste Antwort im Internet.

Der Verräter ist, was Sie taten, als Sie sich geärgert haben. Haben Sie getippt, wollten Sie einen Editor, und Dillinger war nah dran: die Lösung ist StackEdit, oder eine Anwendung, oder gar nichts. Haben Sie eingefügt, wollten Sie einen Konverter, und jeder Editor auf jeder Liste ist ein Umweg mit einem Cursor darin. Ein fertiges Dokument in einen Editor einzufügen, um sein Export-Menü zu erreichen, ist ein Workaround dafür, nicht das richtige Werkzeug zu haben, und es ist als Workaround unsichtbar, weil es nur eine Minute dauert.

Die Kosten des Wechsels sind es auch wert, genannt zu werden, denn „wechseln" ist nicht umsonst.

**Editoren zu wechseln ist eine Migration, kein Klick.** Dokumente in Dillingers Browser-Speicher sind in Dillingers Browser-Speicher. Sie sind nicht in einem Ordner, sie sind nicht in einem Repository, und kein anderes Werkzeug wird sie finden. Bevor Sie umziehen, öffnen Sie jedes einzeln und laden das Markdown herunter, denn sobald Sie sich irgendwo anders anmelden, ist ein geleerter Cache von den alten Entwürfen entfernt. Das ist keine Kritik an Dillinger — jedes Browser-Speicher-Werkzeug hat dieselbe Eigenschaft —, aber es ist der Schritt, den Leute überspringen.

**Ein Desktop-Editor verlagert das Problem auf Ihre Backups.** Lokale Dateien gehören Ihnen, was heißt, die Datei, die nicht mehr existiert, gehört auch Ihnen. Dillingers Cloud-Sync existierte aus einem Grund, und ihn abzulehnen ist eine Entscheidung, für die Kopien verantwortlich zu sein.

**Eigene Syntax reist nicht.** StackEdits Diagramme und Notenblätter, Obsidians Wiki-Links und Embeds, Zettlrs Zitierschlüssel: jedes ist innerhalb seines eigenen Werkzeugs nützlich, und keines ist Standard-Markdown. Ein damit geschriebenes Dokument ist so portabel, wie ein in einem Dialekt geschriebenes Dokument portabel ist — meistens, bis zu den interessanten Teilen.

**Ein Export ist kein Dokument, bis er woanders öffnet.** Das ist der Fehler, den Leute dem Editor anlasten. Ein gestylter Export kann trotzdem auf Styling verweisen, das er nicht mitträgt, und der einzige Test, der das findet, ist, die Datei in einem anderen Browser, auf einer anderen Maschine, mit ausgeschaltetem Netzwerk zu öffnen. Tun Sie das einmal mit Ihrem aktuellen Export, bevor Sie schließen, dass das Werkzeug das Problem war, denn hat das neue Werkzeug dasselbe Verhalten, haben Sie umsonst migriert. Die Eigenschaft, die Sie testen, hat [einen Namen und eine Definition](/blog/best-markdown-to-html-converters), die es wert ist zu kennen, und sie entscheidet, ob eine per E-Mail verschickte Datei funktioniert.

**Die Integration abzulehnen ist meist kostenlos.** Der mit Abstand häufigste Grund bei dieser Suche ist die Cloud-Zugriffsaufforderung, und die kleinstmögliche Lösung ist, nichts zu verbinden: im Tab schreiben, exportieren, herunterladen, fertig. Dillinger funktioniert standardmäßig so, und sagt es auch. Wegen eines Dialogs zu gehen, den man schließen kann, ist die einzige Migration auf dieser Seite, die niemand machen muss.

## Wie Sie wählen

1. **Entscheiden Sie, ob Sie schreiben oder konvertieren, und seien Sie ehrlich damit.** Gibt es nichts mehr zu tippen, ist ein Editor die falsche Form, und Sie werden das jedes einzelne Mal in zusätzlichen Schritten bezahlen.
2. **Prüfen Sie, wohin die Datei geht, bevor Sie sie einfügen.** Ein browserseitiges Werkzeug konvertiert auf Ihrer Maschine, ein gehostetes erhält Ihr Dokument; beide Bauformen sind legitim, und nur eine davon ist für etwas Vertrauliches akzeptabel.
3. **Testen Sie den Export woanders, mit ausgeschaltetem Netzwerk.** Eine Datei, die im Werkzeug richtig und in einer E-Mail falsch aussieht, ist der Fehler, der am meisten Reputation für den geringsten Aufwand zum Finden kostet.
4. **Zählen Sie die Installationen gegen die Anzahl der Läufe.** Eine Konvertierung sollte keinen Paketmanager erfordern; fünfzig Konvertierungen sollten keine Person brauchen, die einen Knopf klickt, und der Kipppunkt kommt früher, als irgendwer erwartet.
5. **Bevorzugen Sie das Werkzeug, das Ihre Dateien in einem Ordner belässt.** Browser-Speicher ist bequem, bis ein Cache geleert wird, und ein Dokument, das Sie mit einem Dateimanager nicht finden, ist ein Dokument, das Sie teilweise schon verloren haben.
6. **Gewähren Sie Cloud-Zugriff nur, wenn der Sync die Funktion ist, die Sie wollten.** Einen ganzen Drive oder ein Repository zu verknüpfen, um eine Datei zu bewegen, ist eine dauerhafte Berechtigung, getauscht gegen eine einmalige Bequemlichkeit, und die Datei hätte auch heruntergeladen werden können.

## Fazit

Dillinger ist ein kostenloser, MIT-lizenzierter, browserbasierter Markdown-Editor, der Ihr Dokument in Ihrem Browser behält und um nichts bittet, bis Sie es zum Synchronisieren bitten — und war die Aufgabe Schreiben, bleibt es ein vernünftiger Ort dafür. Der Grund, warum die Suche existiert, ist, dass die meisten Leute mit einer fertigen Datei dort ankommen, und ein Editor ist das falsche Werkzeug für eine fertige Datei. Für diesen Fall gibt [TransformPipes Markdown-zu-HTML-Konvertierung](/) ein vollständiges, eigenständiges Dokument im Browser zurück, ohne Upload und ohne Konto, was die Besorgung ist, nicht ein neues Zuhause für Ihr Schreiben. Wollen Sie die Software auf Ihrer eigenen Platte, sind StackEdit, Typora, Obsidian und Zettlr die echten Alternativen, mit ihren Lizenzen oben. Und passiert die Konvertierung mehr als eine Handvoll Male, hören Sie ganz auf, Editoren zu bewerten, und installieren Sie Pandoc.

## FAQ

### Wird Dillinger noch gepflegt, und ist es sicher zu nutzen?

Das Repository ist öffentlich unter MIT-Lizenz, und die aktuelle Website beschreibt einen Next.js- und Monaco-Stack, es wird also gearbeitet statt aufgegeben (geprüft auf github.com/joemccann/dillinger und dillinger.io, 9. September 2026). Zur Sicherheit sagen die eigenen Seiten, Dokumente blieben im Speicher Ihres Browsers, und keine Daten lägen auf ihren Servern, was eine stärkere Position ist, als die meisten kostenlosen Web-Editoren einnehmen.

### Was ist die beste kostenlose Dillinger-Alternative?

Das hängt davon ab, welche Hälfte von Dillinger Sie genutzt haben. Für den Editor ist StackEdit kostenlos unter der Apache-Lizenz 2.0 und gebaut, um offline in einem Browser-Tab zu funktionieren. Für die Konvertierung ist ein browserseitiger Konverter, der eine eigenständige HTML-Datei zurückgibt, kostenlos und überspringt den Editor ganz.

### Gibt es eine Dillinger-Alternative, die sich nicht mit Dropbox oder Google Drive verbindet?

Mehrere, und Dillinger selbst ist eine davon, wenn Sie die Integration ablehnen — nichts am Editor erfordert einen verknüpften Drive. Soll die Option gar nicht existieren, beschreibt Markdown Live Previews Repository nichts als ein Vorschauwerkzeug, es gibt also keinen Drive zu verknüpfen, und ein Konverter hat nichts zu verbinden, weil es kein zu behaltendes Dokument gibt.

### Kann ich Dillinger selbst hosten?

Ja. Das Repository ist MIT-lizenziert und dokumentiert einen schlichten Build und Start (geprüft auf github.com/joemccann/dillinger, 9. September 2026), eine eigene Kopie zu betreiben ist also ein unterstützter Weg, und die Lizenz erlaubt, sie zu ändern. Das löst den Einwand der gehosteten Domain, ohne den Editor aufzugeben, um den Preis, ein Deployment zu pflegen.

### Warum sieht mein exportiertes HTML anders aus als die Vorschau?

Weil eine Vorschau von der Anwendung gestylt wird und ein Export von dem, was die exportierte Datei mitträgt oder referenziert. Verweist die Datei auf Styling, das sie nicht enthält, wird sie ungestylt dargestellt, wo immer die Referenz scheitert. Öffnen Sie Ihren Export in einem anderen Browser mit ausgeschaltetem Netzwerk, und Sie wissen binnen einer Sekunde, welche Art Datei Sie haben.

### Brauche ich überhaupt einen Editor, um Markdown zu HTML zu konvertieren?

Nein, und das ist der nützlichste Satz auf der Seite. Ein Konverter nimmt die Datei und gibt ein Dokument zurück, ohne Entwurf zu speichern, ohne Sync zu konfigurieren und ohne Berechtigung zu gewähren. Hatten Sie nie vor, etwas zu schreiben, war der Editor immer ein zusätzlicher Schritt.

### Welche Alternative funktioniert für ein Skript oder einen CI-Job?

Pandoc, das kostenlos unter der GPL ist und dessen Optionen `--standalone` und `--embed-resources` eine einzelne HTML-Datei ohne externe Abhängigkeiten erzeugen (geprüft auf pandoc.org, 9. September 2026). Ist die Installation von Pandoc auf einem Runner das Hindernis, erledigen eine Konvertierungs-API, ein abhängigkeitsfreies CLI oder eine GitHub Action dieselbe Aufgabe übers Netzwerk.
