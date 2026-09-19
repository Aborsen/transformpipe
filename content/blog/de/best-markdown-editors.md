---
title: "Der beste Markdown-Editor 2026: Elf im Vergleich danach, was sie mit Ihren Dateien machen"
description: "Elf Markdown-Editoren im Vergleich 2026 - VS Code, Obsidian, Typora, iA Writer und mehr - beurteilt danach, wo sie Text speichern und was sie exportieren."
date: 2026-09-07
tag: Workflow
keywords: bester markdown editor, bester kostenloser markdown editor, markdown editor live vorschau, markdown editor html export, obsidian oder typora, notion markdown export, markdown editor windows, bester markdown editor mac
---

Die meisten Vergleiche von Markdown-Editoren vergleichen das Tippen. Welcher hat die schönste Schrift, welcher dimmt den Absatz, an dem Sie nicht arbeiten, welcher versteckt die Sternchen. Das ist der Teil, den Sie am ersten Tag bemerken, und der Teil, der nach sechs Monaten am wenigsten zählt.

Was später zählt, ist unspektakulärer. Wo bewahrt der Editor Ihren Text auf — in Dateien, die Sie in einem Dateimanager sehen können, oder in einem Dienst, bei dem Sie um eine Kopie bitten müssen? Welche Syntax fügt er hinzu, die kein anderes Werkzeug versteht? Und was kommt heraus, wenn jemand sagt „kannst du mir das als Webseite schicken“, was die Anfrage ist, die jede Abkürzung offenlegt, die der Editor genommen hat, während Sie sich an der Schriftart erfreut haben.

Elf Editoren werden im Folgenden unter diesen Bedingungen verglichen. Manche davon sind Texteditoren mit Markdown-Unterstützung, manche sind Schreibanwendungen, einer davon ist überhaupt kein Markdown-Editor und steht auf der Liste, weil die Hälfte der Leser ihn als einen benutzt.

### Kurzfassung

Wenn Sie VS Code schon offen haben, ist es der beste Markdown-Editor, den Sie finden, ohne etwas zu installieren, weil Ihre Dateien Dateien bleiben und git sie bereits kennt. Wenn Sie eine komfortable Schreibanwendung über einem Ordner reiner `.md`-Dateien wollen, sind Typora und iA Writer die beiden, die eine Anschaffung wert sind. Typora kostet $14,99 ohne Steuer, einmalig, für bis zu drei Geräte, mit 15-tägiger Testphase (geprüft auf typora.io, 8. September 2026). iA Writer zahlt man einmal pro Plattform, mit 7-tägiger Testphase und ohne Kreditkarte (geprüft auf ia.net/writer, 8. September 2026). Obsidian ist die kostenlose Option mit dem größten Plugin-Ökosystem. Wenn Ihre Dokumente in Notion leben, haben Sie keinen Markdown-Editor, Sie haben eine Datenbank mit Markdown-förmigen Tastenkürzeln, und das Dokument herauszubekommen ist ein Konvertierungsjob, kein Speichern.

## Die drei Fragen, die Markdown-Editoren unterscheiden

**Bearbeitet er Dateien oder Dokumente?** Das ist die Bruchlinie, und jeder andere Unterschied folgt daraus. Ein Editor, der Dateien bearbeitet, öffnet einen Ordner, zeigt Ihnen die `.md`-Dokumente darin, schreibt Ihre Tastenanschläge in diese Dokumente und lässt sie dort, wo ein Backup, ein git-Commit oder ein anderes Programm sie finden kann. Eine Anwendung, die Dokumente bearbeitet, hält sie in ihrem eigenen Speicher — einer Datenbank, dem lokalen Speicher eines Browsers, einem synchronisierten Arbeitsbereich — und gibt Ihnen stattdessen einen Export-Button. Beide können sich beim Tippen identisch anfühlen. Sie hören auf, sich identisch anzufühlen, an dem Tag, an dem Sie Ihren Text woanders haben wollen.

**Welche Syntax fügt er hinzu?** Markdown ist eine kleine Sprache, und jeder Editor, der seit ein paar Jahren existiert, hat Dinge gewachsen, die die Spezifikation nicht kennt. Wikilinks in doppelten eckigen Klammern. Callout-Blöcke. Transklusion, bei der ein Dokument ein anderes einschließt. Hervorhebung mit doppelten Gleichheitszeichen. Nichts davon steht in CommonMark, das meiste steht nicht in GitHub Flavored Markdown, und ein Konverter, der die Spezifikation befolgt, rendert sie als die wörtlichen Zeichen, die Sie getippt haben. Das ist nicht der Konverter, der falsch liegt. Es ist Ihr Editor, der etwas geschrieben hat, das nur Ihr Editor liest, in einer Datei, die portabel aussieht.

**Was erzeugt er, wenn das Dokument fort muss?** Editoren beantworten das auf vier verschiedene Arten. Manche exportieren HTML direkt. Manche exportieren nur PDF. Manche rufen Pandoc auf, das Sie separat installieren müssen. Manche haben überhaupt keinen Export und erwarten, dass Sie die Datei durch etwas anderes laufen lassen, was eine vernünftige Haltung für einen Texteditor ist und eine überraschende, sie an einer Deadline zu entdecken. [Die Konverter, die diesen Job richtig machen](/blog/best-markdown-to-html-converters), sind eine eigene Kategorie von Werkzeug, und zu wissen, in welcher Kategorie Sie sind, erspart einen Nachmittag.

Es gibt eine vierte Frage, die nur manchen Leuten wichtig ist, und denen, denen sie wichtig ist, ungeheuer: ob das Dokument je irgendwohin gesendet wird. Ein Online-Editor hält Ihren Text auf einem Server. Für einen Blogbeitrag, wen kümmert's. Für den Vertrag eines Kunden, eine Leistungsbeurteilung oder einen unveröffentlichten Plan ist das die ganze Entscheidung, getroffen, bevor irgendetwas an der Schreiberfahrung relevant wird.

## Kurzvergleich: die Übersicht

| Editor | Am besten für | Schlüsselfähigkeit | Preis |
| --- | --- | --- | --- |
| VS Code | Markdown schreiben, das in einem Repository lebt | Eingebaute Vorschau, Bearbeitung auf Ordnerebene, git-Bewusstsein | Kostenlos |
| Obsidian | Eine große persönliche Sammlung verlinkter Notizen | Lokaler Ordner mit `.md`-Dateien, Plugin-Ökosystem, PDF-Export | Kostenlos für alle Zwecke, auch kommerziell |
| Typora | Eine Schreibanwendung über reinen Dateien | Einfenster-Bearbeitung, die beim Tippen rendert; HTML-, PDF- und Word-Export | $14,99 einmalig, bis zu 3 Geräte |
| iA Writer | Lange Prosa auf Desktop und Telefon | Fokusmodi, HTML- und PDF-Export mit Vorlagen | Einmalkauf pro Plattform |
| Zettlr | Akademisches Schreiben mit Zitaten | Zitate aus Zotero und anderen; Export über Pandoc | Kostenlos, GPL v3 |
| StackEdit | Schreiben in einem Browser-Tab, auch offline | Funktioniert offline, sobald geladen; synchronisiert mit Drive, Dropbox, GitHub | Kostenlos, Apache 2.0 |
| Dillinger | Ein schnelles Dokument mit Live-Vorschau | Browser-Editor mit HTML- und PDF-Export | Kostenlos, MIT |
| Notion | Team-Seiten, keine Markdown-Dokumente | Markdown-artige Kürzel als Eingabe; Export zu Markdown, HTML, PDF | Kostenloser Plan; bezahlte Pläne pro Nutzer |
| Vim / Neovim | Leute, die schon im Terminal leben | Plugin-gesteuerte Syntax, Faltung, Vorschau; Konvertierung per Shell-Befehl | Kostenlos, quelloffen |
| Nota | macOS-Autoren, die eine Beta akzeptieren | Editor über lokalen Markdown-Dateien; nur macOS | Beta; kein Preis auf der Website genannt |
| Mark Text | Ein kostenloser Desktop-Editor, der beim Tippen rendert | Einfenster-Bearbeitung; HTML- und PDF-Ausgabe | Kostenlos, MIT |

## Die besten Markdown-Editoren 2026

### VS Code — am besten, wenn er schon offen ist

VS Code ist ein Code-Editor mit Markdown-Unterstützung, die gut genug ist, dass die meisten Entwickler nie etwas anderes installieren. Er öffnet einen Ordner statt einer Datei, was heißt, Ihre Dokumente, Ihre Bilder und Ihre `.gitignore` sind alle in einem Fenster, und die Vorschau ist einen Tastendruck vom Text entfernt.

| Vorteile | Nachteile |
| --- | --- |
| Für die meisten Entwickler schon installiert, und kostenlos | Nicht für Prosa gemacht: kein Fokusmodus, keine Wortzahl-Möbel standardmäßig |
| Dateien bleiben gewöhnliche Dateien in einem gewöhnlichen Ordner | Export zu HTML braucht eine Erweiterung, und Erweiterungen variieren in der Qualität |
| Vorschau folgt dem CommonMark-konformen markdown-it-Parser | Vorschau-Styling ist nicht das Export-Styling |
| Erweiterungen fügen Linting, Tabellenformatierung und Bild-Einfügen hinzu | Das Fenster ist ein Entwicklerfenster, mit einer Seitenleiste voller Code |

**Preis:** kostenlos.

**Technische Details und Funktionen**

- Vorschau nebeneinander, die mit der Quelle scrollt, plus Faltung nach Überschriftenebene
- Pfadvervollständigung für Links und Bildreferenzen, sodass ein kaputter relativer Pfad beim Tippen sichtbar ist
- Erweiterungen decken Linting (markdownlint), Tabellenausrichtung und Export zu HTML und PDF ab
- Mehrfach-Cursor-Bearbeitung und Suchen/Ersetzen mit regulären Ausdrücken, was für Prosa mehr zählt, als Leute erwarten
- Snippets, sodass ein Tabellengerüst oder ein Front-Matter-Block drei Zeichen sind

**Wer sollte ihn nutzen?** Jeder, dessen Markdown neben Code lebt — READMEs, Changelogs, Dokumentation im Repository. Er ist auch der beste Editor auf dieser Liste für [eingezäunte Codeblöcke](/blog/code-blocks-in-markdown), weil der Editor bereits jede Sprache kennt, die Sie in einen packen werden.

### Obsidian — beste kostenlose Anwendung über einem Ordner von Dateien

Obsidian öffnet einen Ordner mit `.md`-Dateien und behandelt die Links zwischen ihnen als den eigentlichen Punkt. Nichts wird in einem proprietären Container gespeichert: Der Ordner, den es öffnet, ist ein Ordner, den Sie auch in VS Code öffnen, mit allem sichern, oder ohne um Erlaubnis zu fragen löschen können.

| Vorteile | Nachteile |
| --- | --- |
| Ihre Dokumente sind reine Dateien in einem Ordner, den Sie gewählt haben | Seine Wikilink-Syntax ist weder CommonMark noch GFM, reist also schlecht |
| Kostenlos für persönliche und kommerzielle Nutzung | Das Plugin-Ökosystem ist community-gepflegt, mit der Streuung, die das bedeutet |
| Ein großes Plugin-Ökosystem, einschließlich Export-Plugins | HTML-Export ist ein Plugin, keine eingebaute Funktion |
| Front Matter ist erstklassig, als Dokumenteigenschaften | Der Graph und die Plugins verleiten zum Herumspielen statt zum Schreiben |

**Preis:** kostenlos für alle Zwecke, einschließlich persönlicher, kommerzieller und gemeinnütziger Nutzung; optionale bezahlte Sync- und Publish-Dienste sowie eine Unterstützer-Lizenz werden separat verkauft (geprüft auf obsidian.md/license, 8. September 2026).

**Technische Details und Funktionen**

- Öffnet ein lokales Verzeichnis; jede Notiz ist eine `.md`-Datei, jeder Anhang eine Datei daneben
- `[[Notizname]]`-Links und `![[bild.png]]`-Einbettungen sind Obsidians eigene Syntax, kein Teil einer Markdown-Spezifikation; es gibt eine Einstellung, um stattdessen standardmäßige Markdown-Links zu schreiben
- YAML-Front-Matter wird als strukturierte Eigenschaften gelesen und als Felder angezeigt
- PDF-Export ist eingebaut; HTML-Export kommt von Community-Plugins
- Live-Vorschau blendet die Syntax beim Tippen aus, mit einem Quellmodus, der den rohen Text zeigt

**Wer sollte es nutzen?** Jeder, der ein paar hundert Notizen ansammelt, die aufeinander verweisen, und will, dass diese Notizen in zehn Jahren noch lesbar sind. Schalten Sie die Wikilink-Einstellung am ersten Tag ab, wenn die Notizen je veröffentlicht werden, denn [der Unterschied zwischen der Syntax einer App und portablem Markdown](/blog/markdown-from-notion-obsidian-and-confluence) ist billig zu vermeiden und teuer, später zu beheben.

### Typora — bester bezahlter Editor für Leute, die die Syntax nicht sehen wollen

Typora ist ein Desktop-Editor mit einem Fenster. Es gibt kein Quellfenster links und Vorschau rechts: Sie tippen `## Überschrift`, und die Zeile wird an Ort und Stelle zur Überschrift. Für Autoren, die rohes Markdown als Lärm empfinden, ist das der Unterschied zwischen Markdown benutzen und Markdown ertragen.

| Vorteile | Nachteile |
| --- | --- |
| Die ruhigste Schreiboberfläche hier, ohne Split-Pane-Buchhaltung | Kostenpflichtig, und nur Desktop |
| Exportiert HTML, PDF und Word aus der Datei, die Sie ansehen | Die Syntax zu verstecken macht manche strukturellen Fehler schwerer zu sehen |
| Themes sind reine CSS-Dateien, der HTML-Export erbt sie also | Kein Stapelwerkzeug: ein Dokument zur Zeit |
| Dateien bleiben lokale `.md`-Dateien | Kein nennenswertes Plugin-Ökosystem |

**Preis:** $14,99 ohne Steuer, ein Einmalkauf, der bis zu drei Geräte abdeckt, mit 15-tägiger kostenloser Testphase (geprüft auf typora.io, 8. September 2026).

**Technische Details und Funktionen**

- Einfenster-Bearbeitung: Das Markdown wird beim Tippen durch seine Darstellung ersetzt, mit wieder sichtbarer Quelle, sobald der Cursor in die Zeile eintritt
- Export zu HTML, PDF und Word; das HTML übernimmt das CSS des gerade aktiven Themes
- Themes sind CSS-Dateien in einem Ordner, sodass ein Hausstil ein Stylesheet ist statt einer Einstellung
- Eine Option, eingefügte Bilder in einen relativen Ordner neben dem Dokument zu kopieren, was der Unterschied zwischen einer portablen Datei und einer mit Links zu Ihrem Desktop ist
- Läuft auf macOS, Windows und Linux

**Wer sollte es nutzen?** Leute, die täglich Markdown schreiben, eine Anwendung statt eines Browser-Tabs wollen, und bereit sind, einmal zu bezahlen. Es ist der kürzeste Weg von einem fertigen Dokument zu einer gestylten HTML-Datei, die jemand anderes öffnen kann — und wenn die Gerätebegrenzung, das Fehlen von irgendetwas Mobilem oder ein enttäuschender Export der Grund ist, warum es für Sie ausscheidet, [sortieren sich die Alternativen danach, welcher dieser Gründe der Ihre ist](/blog/typora-alternatives).

### iA Writer — am besten für lange Prosa über Desktop und Telefon hinweg

iA Writer ist zuerst eine Schreibanwendung und zweitens ein Markdown-Editor. Es hat Meinungen zu Typografie, einen Fokusmodus, der alles außer dem aktuellen Satz ausgraut, und eine Hervorhebung, die Wortarten markiert, damit Sie sehen, wie viele Adjektive Sie verwendet haben.

| Vorteile | Nachteile |
| --- | --- |
| Für Prosa gebaut, nicht für Dokumentation oder Notizen | Sie zahlen pro Plattform, ein Mac und ein iPad sind also zwei Käufe |
| Mac, Windows, iPhone und iPad, mit reinen Dateien darunter | Keine Plugins, keine Erweiterbarkeit, mit Absicht |
| HTML- und PDF-Export, mit Vorlagen für den Rahmen | Keine gute Wahl für codelastige Dokumente |
| 7-tägige Testphase ohne Kreditkarte | Absichtlich wenige Funktionen, was manche Autoren als fehlend lesen |

**Preis:** Einmalkauf pro Plattform — „einmal pro Plattform zahlen, für immer besitzen“ — mit 7-tägiger kostenloser Testphase und ohne Kreditkarte (geprüft auf ia.net/writer, 8. September 2026).

**Technische Details und Funktionen**

- Arbeitet mit gewöhnlichen `.md`-Dateien in gewöhnlichen Ordnern, einschließlich iCloud- und Dropbox-Verzeichnissen
- Fokusmodus und Syntaxhervorhebung nach Wortarten, auf Redigieren statt Entwerfen ausgelegt
- Inhaltsblöcke: Ein Dokument kann ein anderes durch Referenz einschließen, wie ein buchlanges Manuskript in separaten Kapiteldateien bleibt
- Export zu HTML und PDF, mit Vorlagen, die den Rahmen steuern
- Verfügbar für macOS 10.15 oder neuer und Windows 10 oder neuer (geprüft auf ia.net/writer, 8. September 2026)

**Wer sollte es nutzen?** Autoren, die Essays, Kapitel und Artikel statt Dokumentation produzieren, dasselbe Dokument auf Laptop und Telefon offen haben wollen und kein Plugin-Ökosystem pflegen wollen.

### Zettlr — bester kostenloser Editor für akademisches Schreiben

Zettlr ist eine Electron-Anwendung, gebaut mit Vue und TypeScript, für Leute, die mit Referenzen schreiben. Es handhabt Zitate aus einem Literaturverwaltungsprogramm, Volltextsuche über einen Ordner, und Export über Pandoc statt Konvertierung selbst neu zu implementieren.

| Vorteile | Nachteile |
| --- | --- |
| Zitate aus Zotero, JabRef und anderen, im Editor | Export hängt von separat installiertem Pandoc ab, oft auch LaTeX |
| Kostenlos und quelloffen unter der GNU GPL v3 | Schwerer als ein reiner Editor, weil Electron |
| Volltextsuche über den ganzen Ordner | Oberfläche ist dichter als die Schreibanwendungen oben |
| Eigenes CSS, Themes und Dunkelmodus | Der Zettelkasten-Rahmen ist nicht für jeden |

**Preis:** kostenlos, GNU-GPL-v3-lizenziert (geprüft auf github.com/Zettlr/Zettlr, 8. September 2026).

**Technische Details und Funktionen**

- Electron, Node.js und Vue 3 für das Frontend, mit TypeScript im Code (geprüft auf github.com/Zettlr/Zettlr, 8. September 2026)
- Export über Pandoc, LaTeX und Textbundle, weshalb die Formatliste lang ist und die Installation nicht nur die App ist
- Code-Hervorhebung für viele Sprachen innerhalb eingezäunter Blöcke
- Zitat-Integration mit den gängigen Literaturverwaltungen
- Themes, Dunkelmodi und eigenes CSS für Bearbeitung und Export

**Wer sollte es nutzen?** Jeder, der eine Abschlussarbeit, ein Paper oder ein Buch mit Bibliografie schreibt und Pandocs Ausgabe will, ohne die Kommandozeile selbst zusammenzubauen. Wenn Sie Pandoc ohnehin installiert hätten, ist Zettlr ein kostenloses Frontend dafür.

### StackEdit — bester Browser-Editor, der offline weiterarbeitet

StackEdit ist ein Markdown-Editor, der in einem Browser-Tab läuft und weiterarbeitet, wenn die Verbindung es nicht tut. Er synchronisiert mit den üblichen Cloud-Speichern, wenn er ein Netzwerk hat, und kann direkt auf ein paar Blog-Plattformen veröffentlichen.

| Vorteile | Nachteile |
| --- | --- |
| Nichts zu installieren, und funktioniert offline, sobald geladen | Dokumente leben im eigenen Speicher des Browsers, bis Sie einen Sync-Anbieter verbinden |
| Synchronisiert mit Google Drive, Dropbox und GitHub | Das Löschen von Website-Daten ist ein echter Weg, Arbeit zu verlieren |
| Veröffentlicht auf Blogger, WordPress und Zendesk | Seine erweiterte Syntax übersteht anderswo nicht immer |
| Export als Markdown, HTML, oder über eine Handlebars-Vorlage | Ein Browser-Tab ist leicht versehentlich zu schließen |

**Preis:** kostenlos, Apache-2.0-lizenziert (geprüft auf stackedit.io, 8. September 2026).

**Technische Details und Funktionen**

- Läuft vollständig im Browser und gibt an, dass Sie offline schreiben können wie mit einer Desktop-Anwendung
- Sync-Ziele: Google Drive, Dropbox und GitHub
- Veröffentlichungsziele: Blogger, WordPress und Zendesk
- Ausgabe als Markdown, als HTML, oder formatiert über die Handlebars-Vorlagen-Engine
- Handhabt lange Dokumente mit einem Inhaltsverzeichnis und einer scrollbaren Gliederung

**Wer sollte es nutzen?** Leute an einer Maschine, wo sie keine Software installieren können, und Leute, deren nächster Schritt nach dem Schreiben eine Blog-Plattform statt einer Datei ist — und wenn der Browser-Speicher oder die Synchronisierung zum Problem statt zur Bequemlichkeit geworden ist, [sortieren sich die Alternativen danach, welchen Teil von StackEdit Sie eigentlich ersetzen](/blog/stackedit-alternatives).

### Dillinger — am besten für ein Dokument, sofort

Dillinger läuft in einem Browser-Tab: Quelle auf der einen Seite, Vorschau auf der anderen, und ein Speichermenü, das Ihnen HTML oder PDF zurückgibt oder die Datei zu Dropbox, Google Drive, OneDrive oder GitHub schiebt. Es ist das Werkzeug, das Sie öffnen, wenn Sie in den nächsten zwanzig Minuten ein Dokument schreiben müssen und nichts installiert haben.

| Vorteile | Nachteile |
| --- | --- |
| Einen Tab öffnen, schreiben, exportieren, Tab schließen | Ihr Dokument läuft durch einen gehosteten Dienst |
| HTML- und PDF-Export ohne Konto | Export-Styling ist das des Werkzeugs, nicht Ihres |
| Kostenlos und quelloffen unter der MIT-Lizenz | Kein Editor, um einen Werkkorpus zu behalten |
| Cloud-Sync zu den üblichen vier Zielen | Keine nennenswerte Offline-Geschichte |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Zweifenster-Editor: Markdown links, gerenderte Vorschau rechts
- Import von und Speichern zu Dropbox, Google Drive, OneDrive und GitHub
- Export der Quelle als `.md` oder des gerenderten Dokuments als HTML oder PDF
- Keine Installation und kein Konto nötig für den Grundablauf

**Wer sollte es nutzen?** Jemand, der heute ein Dokument schreibt. Für alles mit einem Empfänger dahinter behandeln Sie den Export als ersten Entwurf der Datei und prüfen, was er tatsächlich erzeugt hat — eine Vorschau und [eine Datei, die anderswo korrekt öffnet](/blog/share-a-markdown-document-as-a-link), sind zwei verschiedene Dinge.

### Notion — der, der kein Markdown-Editor ist

Notion akzeptiert Markdown-Kürzel. Tippen Sie `## `, bekommen Sie eine Überschrift; tippen Sie `- `, bekommen Sie einen Aufzählungspunkt. Das ist Eingabehilfe, keine Speicherung: Was Notion aufbewahrt, ist ein Baum aus Blöcken in seiner eigenen Datenbank, und Markdown ist eines der Formate, in das dieser Baum beim Export umgewandelt wird.

| Vorteile | Nachteile |
| --- | --- |
| Gut in dem, wofür es gedacht ist: geteilte Seiten, Datenbanken, Teamstruktur | Kein Markdown-Editor — Export ist eine Konvertierung, mit Verlusten |
| Export zu Markdown und CSV, HTML, oder PDF | Datenbanken kommen als CSV heraus, nicht als Markdown-Tabellen |
| Vertraut für jedes Team, das es schon nutzt | Callout-Blöcke exportieren als HTML, weil Markdown keine Entsprechung hat |
| Assets sind im Export-Archiv enthalten | Verschachtelte Ordnerpfade können die Extraktion unter Windows brechen |

**Preis:** kostenloser Plan verfügbar; bezahlte Pläne werden pro Nutzer berechnet — aktuelle Zahlen unter notion.com/pricing.

**Technische Details und Funktionen**

- Vier Exportwege: PDF, HTML, „Markdown & CSV“, und Drucken über den Browser
- Der Markdown-Export kommt als komprimiertes Archiv an: `.md`-Dateien für Nicht-Datenbank-Seiten und Unterseiten, eine `.csv`-Datei für jede vollseitige Datenbank, und separate Ordner für Bilder und andere Assets
- Notions eigene Hilfedokumentation gibt an, dass Callout-Blöcke als HTML exportiert werden, „da es keine Markdown-Entsprechung gibt“, und dass eine Formular-Ansicht einer Datenbank überhaupt nicht exportiert werden kann
- Eigene Emoji erscheinen nicht in PDF-Exporten
- Unter Windows kann die Extraktion scheitern, wenn die verschachtelten Ordnerpfade im Archiv 260 Zeichen überschreiten; die dokumentierten Abhilfen sind, die Ordnererstellung für Unterseiten abzuschalten oder ein anderes Extraktionswerkzeug zu nutzen

(All das geprüft auf notion.com/help/export-your-content, 8. September 2026.)

**Wer sollte es nutzen?** Teams, die einen geteilten Arbeitsbereich wollen und sich ehrlich eingestehen, dass es kein Markdown-Werkzeug ist. Wenn Ihre Dokumente als portables Markdown oder als Webseiten enden müssen, planen Sie nach jedem Export einen Aufräumschritt ein, statt zu hoffen, dass dieser hier sauber herauskommt.

### Vim und Neovim — am besten, wenn Sie schon im Terminal leben

Vim und Neovim sind keine Markdown-Editoren und werden mit drei oder vier Plugins zu guten. Der Reiz ist nicht die Markdown-Unterstützung; es ist, dass die Textbearbeitung die schnellste ist, die es überall gibt, und Sie sie schon kennen.

| Vorteile | Nachteile |
| --- | --- |
| Bearbeitungsgeschwindigkeit, die nichts auf dieser Liste erreicht, wenn Sie das Muskelgedächtnis haben | Alles ist ein Plugin, und Sie bauen und pflegen es zusammen |
| Kostenlos und quelloffen; läuft über SSH, auf allem | Kein Dokumentmodell: eine Tabelle ist Text, den Sie selbst ausrichten |
| Vorschau und Konvertierung sind nur andere aufgerufene Programme | Die Lernkurve ist die bekannte |
| Konfiguration ist eine Datei, die Sie committen und wiederverwenden können | Nichts rendert beim Tippen |

**Preis:** kostenlos und quelloffen. Vim läuft unter seiner eigenen Charityware-Lizenz; Neovim ist Apache 2.0.

**Technische Details und Funktionen**

- Plugins wie vim-markdown fügen Syntaxhervorhebung, Faltung nach Überschrift und Verbergen des Markups hinzu
- Vorschau-Plugins wie markdown-preview.nvim rendern das Dokument beim Tippen in einem Browserfenster, über einen Node-Prozess
- Tabellen-Plugins wie vim-table-mode halten Pipe-Tabellen ausgerichtet, während Sie sie bearbeiten
- Konvertierung ist einen Shell-Befehl entfernt: `:%!` und eine Pipeline, oder eine Zuordnung, die einen Konverter auf die aktuelle Datei anwendet
- Die ganze Konfiguration ist Text, folgt Ihnen also auf jede Maschine

**Wer sollte es nutzen?** Leute, die es schon für Code nutzen. Niemand sollte Vim lernen, um Markdown zu schreiben, und wer Vim kennt, sollte keinen zweiten Editor lernen, um es zu schreiben.

### Nota — die interessante Wette

Nota ist ein macOS-Markdown-Editor, der auf Schreiben und Veröffentlichen aus einem lokalen Ordner von Dateien ausgerichtet ist. Es lohnt sich, davon zu wissen, und lohnt sich, klarsichtig zu sein: Die Website beschreibt eine macOS-Beta, bietet eine Warteliste und eine Vorbestellung an, und nennt keinen Preis auf der Seite.

| Vorteile | Nachteile |
| --- | --- |
| Um lokale Markdown-Dateien herum gebaut, kein Dienst | Nur macOS |
| Auf Veröffentlichen ausgerichtet, nicht nur Notizen | Beta-Software, mit der Stabilität, die das bedeutet |
| Klein und fokussiert statt einer Plugin-Plattform | Kein Preis auf der Website genannt, also mit dem Unbekannten planen |

**Preis:** nicht auf nota.md genannt, das eine Warteliste und eine Vorbestellung anbietet statt eines gelisteten Preises (geprüft 8. September 2026).

**Technische Details und Funktionen**

- Nur macOS laut Website; es gibt keinen beworbenen Windows- oder Linux-Build
- Als Beta an Leute verteilt, die der Warteliste beitreten, mit Vorbestellungsoption
- Arbeitet mit gewöhnlichen Markdown-Dateien auf der Festplatte statt Dokumenten in einem Dienst
- Um Schreiben und Veröffentlichen ausgerichtet, nicht um Notizen

**Wer sollte es nutzen?** Mac-Autoren, die es genießen, neue Anwendungen auszuprobieren, und ihre Dateien dort behalten, wo die Anwendung sie nicht kontrolliert. Weil die Dokumente gewöhnliche `.md`-Dateien sind, sind die Kosten, falls sich die Wette nicht auszahlt, niedrig — Sie wechseln den Editor, und der Ordner bleibt unverändert. Diese Eigenschaft ist der ganze Grund, dateibesitzende Editoren zu bevorzugen, und sie ist mehr wert als jedes einzelne Feature.

### Mark Text — bester kostenloser Einfenster-Desktop-Editor

Mark Text ist ein quelloffener Desktop-Editor mit dem Rendern-beim-Tippen-Ansatz, den Typora populär gemacht hat, veröffentlicht unter der MIT-Lizenz und gebaut mit Electron und Vue.

| Vorteile | Nachteile |
| --- | --- |
| Kostenlos, MIT-lizenziert, und auf allen drei Desktops installierbar | Community-Projekt: prüfen Sie die jüngste Commit-Historie, bevor Sie sich darauf festlegen |
| Rendert beim Tippen, in einem Fenster | Weniger Exportformate als die bezahlten Editoren |
| Gibt HTML und PDF aus | Electron, also der Speicherverbrauch, den Sie erwarten |
| Lokale Dateien, nichts hochgeladen | Kleinere Theme- und Erweiterungsgeschichte |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details und Funktionen**

- Builds für Linux, macOS und Windows, auf x64 und arm64
- Einfenster-Bearbeitung, bei der die Syntax durch ihre Darstellung ersetzt wird
- Ausgabe zu HTML und PDF
- Electron und Vue, die Quelle ist also zugänglich, wenn Sie etwas ändern wollen

**Wer sollte es nutzen?** Jeder, der Typoras Bearbeitungsmodell will, ohne dafür zu zahlen, und der damit einverstanden ist, sich auf ein Community-Projekt zu verlassen. Wenn eine gepflegte Roadmap Ihnen mehr bedeutet als der Preis einer Typora-Lizenz, kaufen Sie stattdessen Typora.

## Die Trennlinie, die Vergleichsseiten nicht ziehen

Jede Liste von Markdown-Editoren rangiert sie auf einer Achse. Die Achse, die entscheidet, wie viel Ärger Sie in drei Jahren haben werden, ist binär, und fast niemand setzt sie in die Tabelle.

**Editoren, die Dateien besitzen.** VS Code, Obsidian, Typora, iA Writer, Zettlr, Mark Text, Vim und Nota zeigen alle auf ein Verzeichnis auf einer Festplatte. Die Konsequenz ist, dass der Editor ersetzbar ist. Sie können denselben Ordner morgen in einem zweiten Editor öffnen, einen Konverter in einem Build darüber laufen lassen, ihn mit `grep` durchsuchen, in git committen, und mit demselben Werkzeug sichern, das alles andere sichert. Wenn eine dieser Anwendungen aufgegeben wird, verlieren Sie die Anwendung. Sie verlieren nicht das Geschriebene.

**Anwendungen, die Dokumente besitzen.** Notion besitzt seine Dokumente in einer Datenbank. StackEdit besitzt sie, bis Sie einen Sync-Anbieter verbinden, im Speicher Ihres Browsers. Ein gehosteter Editor besitzt sie auf einem Server. Die Konsequenz ist, dass Ihren Text herauszubekommen eine Operation ist, die der Anbieter implementiert, in der Treue, die der Anbieter gewählt hat, in den Formaten, die der Anbieter anbietet. Diese Operation ist meist in Ordnung und gelegentlich der schlimmste Nachmittag des Quartals. Das Verräterische ist, dass sie „Export“ heißt statt „Öffnen“.

**Proprietäre Syntax ist ein langsames Leck.** Wikilinks, Callouts, Hervorhebungsmarkierungen, eingebettete Abfragen, Transklusion — jedes ist bequem innerhalb der Anwendung und wirkungslos außerhalb. Sie bemerken es nicht, weil Sie diese Dateien nur in der Anwendung lesen, die sie geschrieben hat. Sie bemerken es an dem Tag, an dem die Dokumentation ins Repository zieht, oder eine Kollegin eine Notiz in einem anderen Editor öffnet, oder ein Konverter `[[Onboarding]]` als vier wörtliche Klammern und ein Wort rendert. Nichts ist beschädigt. Es ist einfach kein Markdown mehr, und das war es seit einem Jahr nicht mehr.

**Die Vorschau ist nicht der Export.** Jeder Editor hier hat eine Vorschau, und in jedem davon ist die Vorschau vom Editor gestylt. Was im exportierten HTML landet, ist ein anderes Stylesheet, manchmal ein anderer Parser, und gelegentlich ein anderer Markdown-Dialekt. Tabellen sind, wo sich das zuerst zeigt, weil Tabellen überhaupt nicht in CommonMark stehen: Ein Editor kann eine im eigenen Fenster korrekt rendern und beim Export einen Absatz aus Pipe-Zeichen ausgeben. [Eine Tabelle zu testen, bevor Sie der Pipeline vertrauen](/blog/markdown-tables-that-survive-conversion), dauert eine Minute und erspart ein erneutes Verschicken.

**Was jeder tut, wenn Sie HTML brauchen.** Das ist die Anfrage, die sie sortiert. Typora, iA Writer, Mark Text, StackEdit und Dillinger exportieren HTML direkt, auf ihre eigene Art gestylt. Obsidian exportiert PDF eingebaut und HTML über ein Plugin. VS Code und Vim delegieren an eine Erweiterung oder einen Befehl. Zettlr delegiert an Pandoc, das Sie installieren. Notion bietet HTML-Export eines Block-Baums, der nie Markdown war. Keiner von ihnen liegt falsch; sie beantworten unterschiedliche Fragen. Was sie gemeinsam haben, ist, dass das HTML, das sie erzeugen, HTML ist, das sie gewählt haben, und wenn Sie eine bestimmte Art Ausgabe brauchen — eine vollständige Datei, Styles inline, nichts aus einem Netzwerk geladen —, ist das der Job eines Konverters, nicht eines Editors.

**Die Ausstiegskosten sind der eigentliche Preis.** Ein einmaliger Betrag von $14,99 ist nicht die Kosten eines Editors. Die Kosten sind, was es braucht, ihn nicht mehr zu benutzen. Für einen dateibesitzenden Editor sind diese Kosten null: Sie schließen ihn und öffnen einen anderen auf demselben Ordner. Für eine dokumentbesitzende Anwendung ist es ein Export, eine Prüfung, ein Aufräumdurchgang über Syntax ohne Markdown-Entsprechung, und ein Satz von Asset-Pfaden zu reparieren. Wägen Sie das ab, bevor Sie sich für die Schriftart entscheiden.

## Wie man wählt

1. **Entscheiden Sie, ob Ihr Text den Editor überleben muss.** Wenn die Antwort ja ist — und für Notizen, Dokumentation und alles mit Ihrem Namen dran ist sie das —, wählen Sie etwas, das einen Ordner von Dateien öffnet, denn einen Ordner von Dateien kann öffnen, was auch immer 2035 existiert.
2. **Passen Sie den Editor an die Art des Schreibens an, nicht an die Rezensionen.** Prosa will iA Writer oder Typora; Dokumentation neben Code will VS Code; eine verlinkte Menge von Notizen will Obsidian; eine Bibliografie will Zettlr. Die falsche Kategorie zu wählen bedeutet, jeden Tag gegen die Oberfläche zu kämpfen, wegen etwas, das eine andere Anwendung standardmäßig tut.
3. **Schalten Sie proprietäre Syntax am ersten Tag ab.** Wenn der Editor standardmäßige Markdown-Links statt seiner eigenen anbietet, nehmen Sie das Angebot an. Hunderte Wikilinks später nachzurüsten ist ein Skripting-Projekt, und Skripting-Projekte über Ihren eigenen Notizen haben die Angewohnheit, ein Wochenende zu fressen.
4. **Prüfen Sie den Export, bevor Sie eine Deadline haben.** Schreiben Sie ein repräsentatives Dokument — eine Tabelle, einen eingezäunten Codeblock, ein Bild, eine Fußnote —, exportieren Sie es, und öffnen Sie das Ergebnis in einem anderen Browser mit ausgeschaltetem Netzwerk. Was dort kaputt ist, wird dann kaputt sein, wenn Sie weniger Zeit haben.
5. **Zählen Sie die Installationen, die der Export braucht.** Ein Editor, der über Pandoc exportiert, ist ausgezeichnet und sind zwei Installationen. Auf Ihrer eigenen Maschine ist das in Ordnung; auf einem gesperrten Arbeitslaptop ist es der Grund, warum der Export nie stattfindet.
6. **Seien Sie ehrlich, wohin das Dokument geht.** Wenn es vertraulich ist, scheidet ein Editor, der es auf dem Server von jemandem speichert, aus, egal wie sehr Sie ihn mögen. Diese Entscheidung kommt zuerst, weil keine Schreiberfahrung es wert ist, sie später neu zu verhandeln.

## Fazit

Der beste Markdown-Editor ist der, der Ihre Dateien bearbeitet statt Ihre Dokumente zu besitzen, in einer Form, die zu dem Schreiben passt, das Sie tatsächlich tun: VS Code, wenn er schon offen ist, Typora oder iA Writer, wenn Sie einmal für eine ruhigere Oberfläche zahlen wollen, Obsidian, wenn die Notizen aufeinander verweisen, Zettlr, wenn es eine Bibliografie gibt, Vim, wenn Sie schon dort leben. Notion ist die Ausnahme, die es sich lohnt, zweimal zu nennen, weil es ein gutes Produkt und ein schlechter Markdown-Editor ist, und die Lücke erst beim Export sichtbar wird. Egal in welchem Sie schreiben, halten Sie die Konvertierung von der Bearbeitung getrennt: Wenn das Dokument zu einer Webseite werden muss, die jemand anderes öffnen kann, [konvertieren Sie das Markdown zu einer eigenständigen HTML-Datei](/) in Ihrem Browser, wo die Datei auf Ihrer Maschine bleibt und die Ausgabe eine einzelne Datei ist, die das Netzwerk um nichts bittet.

## FAQ

### Was ist der beste Markdown-Editor für Anfänger?

Typora, wenn Sie bereit sind, einmalig $14,99 zu zahlen, weil es die Syntax versteckt und es nichts zu konfigurieren gibt. Wenn Sie kostenlos wollen, gibt Ihnen Mark Text dasselbe Bearbeitungsmodell unter der MIT-Lizenz, und StackEdit braucht überhaupt keine Installation. Fangen Sie nicht mit Vim oder einem stark mit Plugins bestückten Setup an; lernen Sie erst die Syntax, das Werkzeug später.

### Ist Obsidian ein Markdown-Editor oder eine Notiz-App?

Beides, und die Unterscheidung zählt. Es bearbeitet gewöhnliche `.md`-Dateien in einem Ordner, den Sie wählen, was es zu einem echten Markdown-Editor macht, aber seine Wikilink- und Einbettungssyntax ist Obsidians eigene statt CommonMark oder GFM. Schalten Sie die Link-Einstellung auf standardmäßige Markdown-Links, wenn diese Notizen je konvertiert oder anderswo gelesen werden.

### Ist VS Code gut zum Schreiben von Markdown?

Ja, besonders für alles, das in einem Repository lebt. Die eingebaute Vorschau folgt einem CommonMark-konformen Parser, Pfadvervollständigung fängt kaputte Bildlinks beim Tippen ab, und git verfolgt die Datei schon. Es ist eine schlechte Wahl für lange Prosa, weil keines der schreibfokussierten Möbel — Fokusmodi, Typografie, ablenkungsfreie Layouts — ohne Erweiterungen da ist.

### Exportiert Notion echtes Markdown?

Es exportiert Markdown, mit dokumentierten Lücken. Datenbanken werden zu CSV-Dateien statt Markdown-Tabellen, Callout-Blöcke kommen als HTML heraus, weil Markdown keine Entsprechung hat, eine Formular-Ansicht kann überhaupt nicht exportiert werden, und unter Windows können die verschachtelten Ordnerpfade des Archivs die 260-Zeichen-Grenze überschreiten und die Extraktion zum Scheitern bringen (geprüft auf notion.com/help/export-your-content, 8. September 2026). Planen Sie jedes Mal einen Aufräumdurchgang ein.

### Was ist der beste kostenlose Markdown-Editor?

VS Code, wenn Sie in der Nähe von Code schreiben, Obsidian, wenn Sie eine Menge verlinkter Notizen aufbauen — es ist kostenlos für persönliche und kommerzielle Nutzung —, und Zettlr, wenn Sie Zitate brauchen. Alle drei halten Ihren Text in reinen Dateien. Für einen Browser-Tab ohne Installation ist StackEdit kostenlos unter Apache 2.0 und funktioniert offline, sobald geladen.

### Brauche ich einen bezahlten Markdown-Editor?

Nein. Jeder Job auf dieser Seite lässt sich mit kostenloser Software erledigen, und die kostenlosen Optionen sind keine Kompromisse. Sie zahlen für eine schönere Schreiboberfläche und die anhaltende Aufmerksamkeit von jemandem dafür, was manchen Leuten $14,99 wert ist und anderen nichts. Entscheiden Sie nach vierzehn Tagen in einem kostenlosen Editor, nicht davor.

### Welcher Markdown-Editor gibt mir HTML, das ich jemandem schicken kann?

Typora, iA Writer, Mark Text, StackEdit und Dillinger exportieren alle HTML direkt, jeder auf seine eigene Art gestylt. Wenn Sie eine einzelne eigenständige Datei brauchen — Styles inline, keine externen Stylesheets oder Schriften, öffnet identisch auf einer Maschine ohne Verbindung —, ist das ein Konvertierungsschritt statt einer Editor-Funktion, und es lohnt sich, das getrennt von dem Ort zu tun, wo Sie den Text geschrieben haben.
