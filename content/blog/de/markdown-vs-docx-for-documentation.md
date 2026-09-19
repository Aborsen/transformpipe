---
title: "Markdown oder Word für Dokumentation: Welches Format den Ursprung stellt"
description: "Markdown oder Word für Dokumentation, entschieden danach, was die Dokumente leisten müssen - Review, Historie, Layout, Suche und Unterschrift."
date: 2026-09-05
tag: Workflow
keywords: markdown oder word dokumentation, docx vs markdown, dokumentationsformat wählen, docs as code, word dokument in markdown, technische dokumentation format, welches format für handbuch
---

Fragen Sie eine Organisation, wo ihre Dokumentation lebt, bekommen Sie meist drei Antworten gleichzeitig: einen Ordner mit `.docx`-Dateien auf einem gemeinsamen Laufwerk, ein Wiki, das seit der letzten Umstrukturierung niemand mehr bearbeitet hat, und ein `docs/`-Verzeichnis in einem Repository, das nur Entwickler lesen. Alle drei sind teilweise aktuell. Keines von ihnen ist die verbindliche Quelle, und der Grund ist nie, dass jemand absichtlich das falsche Dateiformat gewählt hat. Es liegt daran, dass nie jemand entschieden hat, welches Format das Original sein darf.

Die Diskussion wird dann als Geschmacksfrage geführt. Entwickler sagen, Word sei ein Chaos; der Rest des Unternehmens sagt, Markdown sei eine Mutprobe. Beide Seiten beschreiben echte Erfahrungen, und keine beschreibt die eigentliche Entscheidung, die überhaupt nichts mit Vorlieben zu tun hat. Es geht darum, was ein bestimmtes Dokument leisten muss — geprüft werden, von zwölf Leuten geändert werden, durchsuchbar sein, gedruckt werden, unterschrieben werden, veröffentlicht werden, in drei Jahren geprüft werden, wenn jemand fragt, warum eine Klausel dreißig Tage vorsieht.

Dieser Text entscheidet das pro Aufgabe. Es ist eine andere Frage als [Markdown gegen handgeschriebenes HTML](/blog/markdown-vs-html), bei der es um Schreibformat gegen Veröffentlichungsformat geht; hier sind beide Kandidaten Schreibformate, und die Frage ist, welches das Original sein sollte, aus dem alles andere erzeugt wird.

### Kurzfassung

Entscheiden Sie nach der Aufgabe des Dokuments, nicht nach dem Geschmack des Teams. Wenn sich das Dokument oft ändert, von mehr als einer Handvoll Leuten geprüft wird, in großen Mengen durchsucht und bearbeitet werden muss und am Ende auf einer Webseite landet, gewinnt Markdown in Versionskontrolle auf fast jeder Achse. Wenn es nach einer Vorlage gedruckt, unterschrieben, bei jemandem eingereicht werden muss, der ein Layout vorschreibt, oder zeilenweise von jemandem gelesen wird, dessen ganzer Job Verträge sind, gewinnt Word, und kein noch so gutes Werkzeug ändert daran etwas. Die meisten Organisationen brauchen beides — und die einzige Anordnung, die überlebt, ist ein Format als Quelle und das andere als generierter Export, niemals beide als Quellen.

## Was eine .docx ist, was eine .md-Datei ist, und was daraus flussabwärts entsteht

Eine `.docx` ist ein Zip-Archiv. Benennen Sie sie um, entpacken Sie sie, und Sie erhalten ein Verzeichnis aus XML-Teilen: einen mit dem Text des Dokuments, einen mit den benannten Formatvorlagen, einen mit den Listendefinitionen, die nummerierte Listen sich selbst neu nummerieren lassen, und einen Beziehungsteil, der interne Kennungen auf Bilder, Hyperlinks, Kopf- und Fußzeilen abbildet. Das Format ist dokumentiert und standardisiert — es ist Office Open XML, veröffentlicht als ECMA-376, und alle vier Teile der Spezifikation lassen sich kostenlos herunterladen (geprüft auf ecma-international.org, 9. September 2026) — was für die Langlebigkeit zählt, aber keiner dieser Teile ist dafür gedacht, von einem Menschen gelesen zu werden. Öffnen Sie den Hauptteil des Archivs in einem Texteditor, und Sie sehen mehrere tausend Zeichen Markup, bevor der erste Satz Ihres Dokuments kommt. [Die Anatomie dieses Archivs und was jeder Teil entscheidet](/blog/convert-docx-to-markdown) lohnt sich zu lesen, falls Sie jemals eines konvertieren müssen.

Eine `.md`-Datei ist Text. Es sind die Sätze, die Sie geschrieben haben, in UTF-8, mit einer kleinen Menge an Konventionen obendrauf: Doppelkreuze für Überschriften, Sternchen für Betonung, Bindestriche für Listenpunkte, Pipes für Tabellen, Backticks für Code. Es gibt keinen Container, keinen separaten Formatteil, keine Beziehungstabelle. Die Struktur wird als Zeichen am Zeilenanfang kodiert, was heißt, dass die Struktur für alles sichtbar ist, was eine Textzeile lesen kann.

Genau dieser eine Unterschied erzeugt fast alles andere auf dieser Seite:

- **Was ein Diff zeigen kann.** Eine Änderung an einer Textdatei ist eine Änderung an einer Zeile. Eine Änderung an einem Zip-Archiv ist eine Änderung an einem binären Blob, sodass die Werkzeuge, die Versionen vergleichen, außer der ganzen Datei nichts zum Arbeiten haben.
- **Was Werkzeuge damit anfangen können.** Eine Textdatei kann alles lesen — grep, ein Linter, ein Build-Skript, eine Rechtschreibprüfung, ein Editor auf einem Telefon. Eine `.docx` zu lesen braucht eine Bibliothek, die das Format versteht, und sie sicher zurückzuschreiben braucht mehr als das.
- **Was das Format ausdrücken kann.** Word kann einen Kommentar speichern, der an einen Zeichenbereich verankert ist, ein Nummerierungsschema, das sich neu nummeriert, wenn Sie ein Element einfügen, eine Kopfzeile, die sich auf jeder Seite wiederholt, und ein Inhaltsverzeichnis, das sich selbst aktualisiert. Markdown speichert nichts davon, weil es nichts außer dem Text speichert.
- **Ob die Bytes sich selbst beschreiben.** Eine Markdown-Datei, mit gar keiner Software gelesen, zeigt Überschriften trotzdem als Überschriften. Eine `.docx`, mit gar keiner Software gelesen, zeigt XML.
- **Wem man sie anvertrauen kann.** Eine Textdatei kann jemand ohne Schulung sicher bearbeiten, weil es sehr wenige Arten gibt, den Parse-Vorgang zu zerstören. Ein Word-Dokument kann auf Arten kaputtgehen, die unsichtbar bleiben, bis es gedruckt wird.

Das Archiv ist kein Konstruktionsfehler. Es ist der Preis für das, was es kann, und diese Dinge sind real. Der Fehler ist, anzunehmen, der Preis lohne sich für jedes Dokument, und der gegenteilige Fehler ist, anzunehmen, er lohne sich nie.

## Markdown gegen Word-Dokumentation: die Übersichtstabelle

Eine Tabelle, quer gelesen. Die letzte Spalte ist das ehrliche Urteil statt eines Siegers, weil mehrere dieser Zeilen tatsächlich in die andere Richtung gehen.

| Dimension | Markdown in Versionskontrolle | Word (.docx) | Wer gewinnt, und wann |
| --- | --- | --- | --- |
| Eine Änderung prüfen | Zeilen-Diff: geänderte Wörter erscheinen als geänderte Wörter | Nachverfolgte Änderungen: jede Bearbeitung zugeordnet, einzeln angenommen oder abgelehnt | Markdown bei vielen kleinen Änderungen; Word, wenn jeder Satz eine Entscheidung braucht |
| Einen Satz kommentieren | Review-Kommentar auf einer Zeile, in einem Pull Request | Kommentar, verankert an einem Zeichenbereich, mit einem Antwort-Thread | Word, eindeutig, für nicht-technische Prüfer |
| Zwei Leute bearbeiten gleichzeitig | Branch und Merge, Konflikte zeilengenau markiert | Gemeinsames Bearbeiten in der Cloud, oder per E-Mail verschickte Kopien, händisch zusammengeführt | Markdown bei mehreren Dateien; Cloud-Word bei einer Datei, einer Stunde |
| Wer ohne Schulung bearbeiten kann | Jeder, der tippen kann, sobald der Workflow sitzt | Jeder, der schon einen Computer benutzt hat | Word, und alles andere zu behaupten ist der Grund, warum Docs veralten |
| Historie | Jede Änderung, mit Nachricht, Autor und Grund | Schnappschüsse nach Zeit und Autor, auf der Plattform, die die Datei speichert | Markdown: die Einheit ist eine Änderung, keine Kopie |
| Warum ein Satz sagt, was er sagt | Die Zeile per Blame prüfen, den Commit lesen, den Pull Request lesen | Die Versionsliste lesen und raten | Markdown, und das ist nicht knapp |
| Suche über den ganzen Bestand | Exakte und reguläre Suche, in einer Sekunde, von überall | Plattformsuche, die Dokumente findet statt Zeilen | Markdown |
| Eine Formulierung in 200 Dateien ändern | Ein Befehl, ein Diff, ein Review | 200 Dateien öffnen, oder ein Skript gegen das XML schreiben | Markdown |
| Seitenlayout, Kopf- und Fußzeilen, Seitenumbrüche | Nicht ausdrückbar | Nativ, und der Grund, warum es das Format überhaupt gibt | Word |
| Hausvorlage und benannte Formate | Lebt im Konverter oder im Theme der Website | Lebt im Dokument, angewendet von der schreibenden Person | Word für einen Einzelfall; Markdown für Konsistenz über Hunderte hinweg |
| Automatische Nummerierung und Querverweise | Nicht im Format; manche Generatoren fügen Anker hinzu | Felder, die sich selbst neu nummerieren und neu verweisen | Word |
| Drucken und Unterschreiben | Braucht einen Konvertierungsschritt zu PDF | Das Dokument ist schon paginiert | Word |
| Veröffentlichung als Webseite | Eine Konvertierung, oder ein Generator | Speichern-als-Webseite-Markup, oder eine Konvertierung über Markdown ohnehin | Markdown |
| Codebeispiele | Eingezäunte Blöcke, sprachlich markiert, nie autokorrigiert | Autokorrektur ändert Ihre Anführungszeichen und Bindestriche | Markdown, und das ist eine Korrektheitsfrage |
| Barrierefreiheit | Semantisch durch Konstruktion, einmal im Theme geprüft | Reiche Attribute verfügbar, pro Dokument geprüft | Unentschieden: Markdown ist billiger, Word ist leistungsfähiger |
| Langlebigkeit der Bytes | Text: mit keiner Software lesbar | Standardisiert und weit verbreitet lesbar, braucht aber eine Anwendung | Markdown |
| Lock-in | Nichts Nennenswertes | Nicht das Format; die Vorlage, die Makros und die Gewohnheiten | Markdown |
| Bilder | Als separate Dateien referenziert, die verschwinden können | Im Archiv mitgeführt, kann nicht verschwinden | Word für eine einzelne, reisende Datei |
| Werkzeugkosten | Ein Host, eine Review-Gewohnheit, ein Build-Schritt, den jemand betreut | Schon auf jedem Schreibtisch installiert | Word für ein kleines Team ohne Entwickler |

Das Muster ist konsistent genug, um es klar zu sagen: Markdown gewinnt jede Zeile über Änderung, Skalierung und Zeit, und Word gewinnt jede Zeile über Seiten, Review-Kommentare und die am wenigsten technische Person im Gebäude. Jede Entscheidung, die eine der beiden Hälften ignoriert, wird später von wem auch immer sie erbt, rückgängig gemacht werden.

## Review, Historie, und wer sie bearbeiten darf

Diese drei Argumente entscheiden mehr reale Fälle als alles, was mit Syntax zu tun hat, und das erste davon wird von beiden Seiten regelmäßig unfair geführt.

### Ein Diff und nachverfolgte Änderungen sind nicht dasselbe Werkzeug

Ein Diff zeigt Ihnen den Unterschied zwischen zwei Zuständen. Nachverfolgte Änderungen zeigen Ihnen die Akte des Änderns: diese Person hat jene Klausel gestrichen, jene Person hat diese fünf Wörter eingefügt, und jede kann für sich angenommen oder abgelehnt werden. Das sind verschiedene Produkte, und die Diskussionen darüber sind meist zwei Leute, die verschiedene Aufgaben beschreiben.

Für einen Anwalt, der einen Vertrag liest, sind nachverfolgte Änderungen mit Randkommentaren das bessere Instrument, und das ist nicht knapp. Die Arbeitseinheit ist der einzelne Vorschlag — wer hat diese Formulierung vorgeschlagen, was haben sie am Rand dazu gesagt, nehme ich das an oder mache ich einen Gegenvorschlag — und Word bildet genau das ab. Ein Pull Request bildet etwas anderes ab: eine zusammenhängende Menge von Änderungen, gemeinsam vorgeschlagen, gemeinsam angenommen oder abgelehnt. Sie können in den meisten Review-Werkzeugen ein Diff Zeile für Zeile freigeben, aber Sie können niemandem ein Dokument mit vierzehn unabhängigen Vorschlägen in die Hand geben und sie neun davon nehmen lassen.

Für zwölf Leute, die ein Mitarbeiterhandbuch bearbeiten, sind nachverfolgte Änderungen das schlechtere Instrument, und das ist auch nicht knapp. Zwölf Prüfer erzeugen zwölf Kopien. Jemand führt sie händisch zusammen, was heißt, dass jemand denselben Absatz zwölfmal liest und entscheidet, welche von vier Umformulierungen bleibt, ohne dass hinterher ein Protokoll existiert, was abgelehnt wurde oder warum. Die Datei namens `handbuch_final_v3_JS_kommentare_aktualisiert.docx` ist kein Witz über Namensgebung; sie ist das sichtbare Symptom eines Formats ohne Merge-Operation. Gemeinsames Bearbeiten in der Cloud beseitigt die Kopien, was eine echte Verbesserung ist, beseitigt aber das Protokoll gleich mit: alle bearbeiten das lebende Dokument, und die Historie wird zu einer Liste von Zeitpunkten statt einer Liste von Entscheidungen.

| Review-Modell | Einheit der Prüfung | Zuordnung | Gleichzeitigkeit | Protokoll danach |
| --- | --- | --- | --- | --- |
| Nachverfolgte Änderungen in verschickten Dateien | Eine Einfügung oder Löschung | Pro Änderung, nach Autor | Eine Person nach der anderen pro Kopie | Was auch immer sich der Zusammenführende gemerkt hat |
| Nachverfolgte Änderungen in einer gemeinsam bearbeiteten Cloud-Datei | Eine Einfügung oder Löschung | Pro Änderung, solange sie ansteht | Viele Leute gleichzeitig | Zeitlich gestempelte Schnappschüsse des Dokuments |
| Pull Request auf Markdown | Eine Menge zusammenhängender Änderungen | Pro Commit und pro Kommentar | Viele Leute, auf Branches | Dauerhaft: Diff, Diskussion, Entscheidung |
| Nur Kommentare, keine Bearbeitung | Ein Vorschlag in Prosa | Pro Kommentar | Viele Leute gleichzeitig | Der Kommentar-Thread, bis er aufgelöst wird |

Die praktische Lesart: Nachverfolgte Änderungen sind besser darin, ein Dokument zu verhandeln, und schlechter darin, eines zu pflegen. Dokumentation wird gepflegt, weshalb das Format, das schlecht im Verhandeln ist, bei Docs immer wieder gewinnt, und warum Verträge in Word bleiben, egal wie das Entwicklungsteam darüber denkt.

### Blame, und warum ein Satz sagt, was er sagt

Das ist das Argument, das Skeptiker überzeugt, und es taucht nie in einem Feature-Vergleich auf, weil Word nichts hat, das es in diese Spalte eintragen könnte.

Ein Dokumentationsbestand, der seit ein paar Jahren lebt, enthält Sätze, die niemand erklären kann. „Zugriffstoken laufen nach dreißig Tagen ab.“ Warum dreißig? War es eine Entscheidung, ein Kompromiss mit dem Sicherheitsteam, oder ein Tippfehler, um den herum jemand inzwischen eine Client-Bibliothek gebaut hat? In einem Repository fragen Sie die Datei: die Zeile per Blame prüfen, den Commit bekommen, die Commit-Nachricht lesen, ihr zum Pull Request folgen, die dort geführte Diskussion und das auslösende Issue lesen. Diese Kette dauert etwa neunzig Sekunden, und sie liefert entweder den Grund oder beweist, dass es nie einen gab, was für sich genommen nützlich ist.

In einem Word-Bestand ist dieselbe Frage in der Praxis unbeantwortbar. Die Versionshistorie der Speicherplattform liefert Schnappschüsse nach Autor und Zeitstempel — echte Historie, und besser als nichts —, aber die Einheit ist das Dokument, nicht der Satz. Sie können herausfinden, dass Priya an einem Dienstag im März eine neue Version gespeichert hat. Sie können nicht herausfinden, welche der vierzig Änderungen in dieser Speicherung die dreißig Tage waren oder worauf sie reagiert hat. Also bleibt der Satz, weil niemand rechtfertigen kann, etwas zu entfernen, das er nicht erklären kann, und die Dokumentation sammelt Behauptungen an, die nicht mehr zum System passen.

Die Konsequenz ist es wert, mit einem Preisschild versehen zu werden: In Word muss die Herkunft eines Satzes im Gedächtnis von jemandem oder in einem separaten, von Hand gepflegten Änderungsprotokoll leben, und beides verlässt die Organisation, wenn die Person geht.

### Wer bearbeiten darf, und der Satz, der das Gespräch beendet

„Stellen Sie doch einfach einen Pull Request gegen die Docs.“ Wenn Sie das einer Kollegin im Vertrieb sagen, die bemerkt hat, dass die Preisseite einen Tarif beschreibt, der im Frühjahr eingestellt wurde, beendet dieser Satz das Gespräch. Sie wird keinen Pull Request stellen. Sie wird eine Nachricht schicken, oder sie wird nichts tun, und die Seite wird in sechs Monaten immer noch falsch sein.

Das ist eine reale Einschränkung, kein Schulungsproblem, und sie als Schulungsproblem zu behandeln ist die häufigste Art, wie ein Docs-as-Code-Programm scheitert. Der Workflow rund um Markdown — ein Host, ein Fork oder Branch, eine Commit-Nachricht, ein Review, ein Merge, ein Deploy — sind fünf Konzepte, die nichts mit dem Schreiben eines Satzes zu tun haben. Die Einstiegshürde von Word ist tatsächlich niedriger: Datei öffnen, Wörter ändern, speichern. Jeder, der schon einen Computer benutzt hat, schafft das.

Es gibt drei ehrliche Antworten, und die falsche ist zu bestehen, dass Leute es lernen.

- **Den Web-Editor des Code-Hosts nutzen.** Eine Datei im Browser zu bearbeiten, mit Vorschau, und den Host im Hintergrund den Branch und den Pull Request erstellen zu lassen, macht aus fünf Konzepten zwei: die Wörter ändern, eine Zeile schreiben, warum. Das funktioniert, es ist das, was die meisten erfolgreichen Arrangements tatsächlich nutzen, und es braucht immer noch ein Konto und eine Einführung.
- **Eine Bearbeitungsoberfläche darüberlegen.** Ein Content-System, das Markdown zurück ins Repository schreibt, gibt nicht-technischen Redakteuren eine normale Bearbeitungserfahrung und hält die Quelle in der Versionskontrolle. Das sind mehr bewegliche Teile zu betreuen, und jemand muss sie betreuen.
- **Die Änderung als Nachricht akzeptieren, und die Kosten tragen.** Jemand Technisches macht die Änderung. Das ist in Ordnung für gelegentliche Korrekturen und schrecklich als Dauerlösung, weil die Warteschlange zum Engpass wird und der Engpass zur Veralterung.

Egal, wofür Sie sich entscheiden, die Entscheidung gehört der am wenigsten technischen Person, die kurzfristig einen Satz ändern muss — dasselbe Prinzip, das ein Repository zur richtigen Heimat für Docs macht, die Entwickler pflegen, macht es auch zur falschen Heimat für Docs, die nur die Finanzabteilung anfasst. [Was tatsächlich ins Repository gehört und wie das Verzeichnis aufgebaut ist](/blog/documentation-that-lives-in-the-repo) ist die längere Version dieses Arguments.

## Was Word ausdrücken kann und Markdown nicht

Markdown hat etwa ein Dutzend Konstrukte. Word hat ein Seitenmodell. Die Lücke zwischen beiden ist keine Frage fehlender Funktionen, die ein Konverter später vielleicht hinzufügt; es ist der Unterschied zwischen einem Format, das Struktur beschreibt, und einem Format, das ein gedrucktes Artefakt beschreibt.

Die Dinge, die eine `.docx` mitführt und für die es überhaupt keine Markdown-Entsprechung gibt:

- Eine Vorlage mit benannten Formaten, sodass „Überschrift 2“ in jedem Dokument der Organisation eine bestimmte Schrift, Größe, einen bestimmten Abstand und eine bestimmte Farbe bedeutet.
- Kopf- und Fußzeilen, Seitenzahlen, ein Deckblatt, Abschnittswechsel, mittendrin geänderte Ränder und Ausrichtung, Wasserzeichen.
- Ein Inhaltsverzeichnisfeld, das sich selbst aktualisiert, Bildunterschriften, die sich selbst nummerieren, und Querverweise, die sich neu ausrichten, wenn Sie einen Abschnitt verschieben.
- Seitenumbrüche und „Zusammenhalten mit nächstem“, also Kontrolle darüber, was oben auf einer Seite landet.
- Fußnoten, die am Fuß der Seite dargestellt werden, zu der sie gehören, statt am Ende des Dokuments gesammelt zu werden.
- Textfelder, frei schwebende Formen, Tabellen mit verbundenen Zellen, und alles, was relativ zur Seite statt zum Textfluss positioniert ist.
- Die Review-Schicht selbst: anstehende Einfügungen und Löschungen, und Kommentar-Threads, verankert an Zeichenbereichen.

Das vollständige Inventar — Punkt für Punkt, mit einem Urteil, welche Verluste tatsächlich zählen und welche Gewohnheiten es wert sind, aufgegeben zu werden — steht in [was man aus einer .docx nicht übernehmen sollte](/blog/what-not-to-keep-from-a-docx), es lohnt sich nicht, das hier zu wiederholen. Für diese Entscheidung zählt, dass keine dieser Abwesenheiten eine Lücke ist, sofern die Aufgabe des Dokuments sie nicht braucht. Ein Runbook braucht kein Deckblatt. Ein Mitarbeiterhandbuch, das gedruckt und neuen Mitarbeitenden in die Hand gedrückt wird, schon. Ein Statement of Work mit einem Unterschriftsfeld, das fest über einer festen Fußzeile sitzen muss, braucht das Seitenmodell, dauerhaft und nicht verhandelbar.

Die umgekehrte Liste ist kürzer und wird in solchen Vergleichen völlig ausgelassen, also hier ist sie. Markdown drückt mehrere Dinge aus, mit denen ein Word-Dokument schlecht umgeht:

- **Code, sicher.** Ein eingezäunter Block mit Sprachmarkierung übersteht Kopieren und Einfügen, und er wird nicht autokorrigiert. Word ersetzt beim Tippen, und eine der dokumentierten Optionen heißt `"Gerade Anführungszeichen" durch "typografische Anführungszeichen"` (geprüft auf support.microsoft.com, 9. September 2026); derselbe Mechanismus verwandelt getippte Bindestriche in Gedankenstriche. Jede dieser Ersetzungen innerhalb eines Befehlsbeispiels bedeutet, dass die Person, die es kopiert, einen Fehler bekommt. Das ist ein Korrektheitsfehler, keine Formatierungsvorliebe.
- **Links, die eine Maschine prüfen kann.** Textlinks können in einem Build validiert werden, sodass ein Dokumentationsbestand seine eigenen Prüfungen nicht besteht, wenn ein Link tot ist. Die Hyperlink-Beziehungen in zweihundert Archiven zu prüfen ist ein Projekt.
- **Diagramme als Text.** Ein als Text geschriebenes Diagramm lebt im Diff, wird wie Prosa geprüft und verlangt von niemandem, die ursprüngliche Zeichendatei zu finden. Eine in Word eingefügte Gruppe von Formen ist ein Bild ohne Quelle.
- **Front Matter.** Ein maschinenlesbarer Kopf mit Besitzer, Prüfdatum und Status, den ein Build lesen und danach handeln kann. Word hat Dokumenteigenschaften, und niemand füllt sie aus.

## In großem Maßstab: Suche, Skripting, Veröffentlichung, Langlebigkeit, Barrierefreiheit

Alles bisher galt für ein einzelnes Dokument. Die folgenden Dimensionen tauchen erst auf, wenn es zweihundert davon gibt, und genau dann wird eine Formatentscheidung teuer, sie umzukehren.

### Suche, und was „Suche“ in jedem Fall bedeutet

Textsuche über ein Verzeichnis von Markdown-Dateien ist exakt, schnell und für alles verfügbar: ein regulärer Ausdruck, eine Groß-/Kleinschreibung beachtende Phrase, eine auf Überschriften beschränkte Suche, eine Suche, die Datei und Zeilennummer auflistet. Sie läuft auf einem Laptop ohne Index und ohne Dienst, und sie läuft in einem Build, was heißt, dass ein Dokumentationsbestand Fragen über sich selbst beantworten kann. Finden Sie jede Seite, die einen veralteten Endpunkt erwähnt, und Sie bekommen eine Liste von Zeilen, nach denen Sie handeln können.

Suche über einen Word-Bestand ist Suche über einen Index, den führt, wer auch immer die Dateien speichert. Bestenfalls findet sie Dokumente, keine Zeilen, und sie sortiert sie nach Relevanz statt sie erschöpfend aufzulisten — was das richtige Design ist, um ein Dokument zu finden, und das falsche, um eine Behauptung zu prüfen. Sie findet nichts innerhalb eines Screenshots, und sie sagt Ihnen nicht, dass die Formulierung in einer Fußzeile auf Seite elf von sechs Dateien vorkommt.

### Eine Änderung über zweihundert Dateien hinweg skripten

Ein Produkt wird umbenannt. Eine Support-Adresse ändert sich. Eine URL zieht von einer Domain zur nächsten um. In Markdown ist das ein Befehl, ein Diff, das Sie vor dem Commit lesen, und ein Review von jemandem, der die Randfälle prüft — die in Codebeispielen, die im Linktext, die Possessivform. Die ganze Änderung ist eine überprüfbare Einheit, und entweder ist sie überall passiert, oder es ist im Diff sichtbar, dass sie es nicht ist.

In einem Word-Bestand hat dieselbe Änderung drei Optionen: jede Datei öffnen, gegen die XML-Teile skripten, oder ein Makro schreiben. Alle drei funktionieren. Was tatsächlich passiert, ist, dass jemand die wichtigsten zwanzig Dateien erledigt, vorhat fertigzumachen, und es nicht tut — und die Hälfte, die nicht erledigt wurde, ist unsichtbar, weil es kein Diff gibt, das man sich ansehen könnte, und keine fehlschlagende Prüfung. Sechs Monate später steht der alte Produktname immer noch in vier Angeboten, die an Kunden verschickt werden. Die Kosten dafür, eine Änderung nicht skripten zu können, sind nicht die Arbeit; es ist, dass unvollständige Änderungen keine Spur hinterlassen.

### Veröffentlichung als Webseite

Von Markdown aus ist Veröffentlichung der gewöhnliche Fall: eine Konvertierung zu einer vollständigen HTML-Seite, oder ein Generator, wenn es eine Menge von Seiten gibt, die untereinander verlinken. Die Ausgabe ist semantisches Markup, das sein Styling von einer Vorlage erbt, was heißt, dass der ganze Bestand einheitlich aussieht, weil das Styling nie in den Dokumenten war.

Von Word aus ist Veröffentlichung ein Umweg. Die eigene Speichern-als-Webseite-Ausgabe der Anwendung führt eine große Menge Markup mit sich, das existiert, um Words Darstellung zu reproduzieren statt das Dokument zu beschreiben, und das Ergebnis ist schwer neu zu stylen und unangenehm zu pflegen. Der Weg, der funktioniert, ist der indirekte: die `.docx` zu Markdown konvertieren, prüfen, was die Konvertierung behalten hat, dann aus dem Markdown veröffentlichen. Wenn Sie regelmäßig aus Word veröffentlichen, ist dieser Umweg das Argument dafür, zu ändern, welches Format die Quelle ist.

### Langlebigkeit und Lock-in

Markdowns Langlebigkeitsanspruch ist der stärkste, den es hat. Die Datei ist Text; sie liest sich korrekt in jedem Editor, auf jedem Betriebssystem, ohne dass irgendeine Software noch existieren muss. In zwanzig Jahren werden die Überschriften noch sichtbar Überschriften sein.

Words Position ist besser als sein Ruf. Das Format ist ein offener, standardisierter — ECMA-376, gleichwertig zu ISO/IEC 29500 (geprüft auf ecma-international.org, 9. September 2026) —, andere Anwendungen lesen und schreiben es, und Dateien von vor einem Jahrzehnt öffnen sich heute noch. Es ist kein Lock-in im rechtlichen oder technischen Sinn. Das Lock-in ist verhaltensbedingt, und es ist real: die Firmenvorlage, die Makros, die jemand geschrieben hat, die Review-Gewohnheiten, die Tatsache, dass jedes Dokument eine Anwendung mit Seitenmodell voraussetzt. Das macht einen Word-Bestand teuer zu verlassen, nicht das Dateiformat.

Die Rangfolge für ein Dokument, das Sie in zwanzig Jahren noch lesen wollen, lautet also: zuerst Markdown, dann `.docx`, und ein proprietäres Cloud-Dokument, das nur im Editor eines einzigen Anbieters existiert, weit abgeschlagen an dritter Stelle. Wenn Langlebigkeit eine erklärte Anforderung ist, behalten Sie eine Markdown-Quelle und ein exportiertes PDF, und behandeln Sie die bearbeitbare Word-Datei als die entbehrliche.

### Barrierefreiheit

Word ist hier fähiger, als die meisten Entwickler annehmen. Überschriftenformate erzeugen eine echte Dokumentgliederung, die ein Screenreader navigiert, Bilder haben ein Alt-Text-Feld, Tabellen können eine ausgewiesene Kopfzeile haben, und die Anwendung liefert eine Barrierefreiheitsprüfung, deren veröffentlichte Regeln alternativen Text für alle Nicht-Text-Inhalte und ausreichenden Kontrast zwischen Text und Hintergrund vorsehen (geprüft auf support.microsoft.com, 9. September 2026). Der Haken ist, dass all das pro Dokument gilt und davon abhängt, dass die Autorin Formatvorlagen benutzt statt Text einfach groß und fett zu machen — genau die Gewohnheit, die auch die Konvertierung zerstört.

Markdown ist durch Konstruktion semantisch. Eine Überschrift ist eine Überschrift ohne Möglichkeit, das vorzutäuschen, Alt-Text ist Teil der Bildsyntax, und Listen sind Listen. Was Markdown nicht ausdrücken kann, ist der Rest der Barrierefreiheitsoberfläche: ein Sprachattribut, Tabellen-Scope, eine mit einer Tabelle verknüpfte Bildunterschrift, ARIA wo nötig. Die kommen aus der Vorlage oder dem Theme, das das Markdown rendert, und das ist der wichtige strukturelle Punkt — Sie prüfen einen Markdown-Dokumentationsbestand einmal, in seinem Theme, und jede Seite erbt das Ergebnis. Sie prüfen einen Word-Bestand ein Dokument nach dem anderen, für immer.

## Wo Markdown verliert, und was das kostet

Markdown gewinnt auf fast jeder Achse, die einem technischen Team wichtig ist, und es verliert vollständig, wann immer die Aufgabe des Dokuments ist, gedruckt, unterschrieben oder von jemandem geprüft zu werden, der in Word arbeitet. Das ist es wert, klar gesagt statt drumherum diskutiert zu werden, weil die Fehlschläge vorhersehbar sind und jeder von ihnen Kosten hat, die man beziffern kann.

**Wenn das Artefakt eine gedruckte Seite ist.** Alles, das einer Person auf Papier gegeben wird, hat ein Layout, und ein Layout bedeutet Seiten, Ränder, Kopfzeilen und Kontrolle darüber, was wo landet. Markdown kann nichts davon ausdrücken; eine Konvertierung zu PDF gibt Ihnen, was auch immer die Vorlage entscheidet. Kosten: Entweder Sie akzeptieren die Paginierung der Vorlage, oder Sie stecken die Zeit hinein, eine Vorlage zu bauen, die tut, was Sie wollen, was ein echtes Projekt mit einem Besitzer ist.

**Wenn etwas unterschrieben werden muss.** Ein Statement of Work, ein Vertrag, eine Richtlinienbestätigung. Unterschrifts-Workflows erwarten ein paginiertes Dokument mit festen Positionen, und das unterschriebene Artefakt ist das Protokoll. Kosten: keine, wenn Sie am Ende konvertieren, erheblich, wenn Sie versucht hätten, Markdown zum unterschriebenen Ding zu machen.

**Wenn die prüfende Person in Word arbeitet und nicht wechseln wird.** Ein Anwalt, ein Regulierer, ein Auditor, das Einkaufsteam eines Kunden. Sie werden eine Datei mit nachverfolgten Änderungen zurückschicken, und diese Änderungen zurück in eine Markdown-Quelle zu lesen ist manuelle Arbeit, die kein Konverter gut macht. Kosten: ein Nachmittag pro Review-Runde, und das Risiko, dass eine Änderung übersehen wird.

**Wenn das Dokument gestaltet ist.** Ein Angebot, eine Broschüre, ein Bericht mit dem Branding eines Kunden. Kosten: Stunden von Umwegen, und irgendwann das Eingeständnis, dass das Dokument immer ein Gestaltungsartefakt war.

**Wenn nicht-technische Prüfer kommentieren müssen.** Nicht bearbeiten — kommentieren. Words verankerte Kommentar-Threads sind das richtige Werkzeug, und es gibt keine Markdown-Entsprechung, die eine nicht-technische Prüferin nutzen wird. Kosten: Kommentare kommen per E-Mail statt, unverankert, und gehen verloren.

**Wenn es Formulare und ausfüllbare Felder gibt.** Nichts in Markdown tut das. Kosten: das völlig falsche Werkzeug.

**Wenn niemand die Pipeline besitzt.** Docs as Code braucht ein Repository, eine Review-Gewohnheit, einen Build und jemanden, der alle drei pflegt. Einem kleinen Team ohne Entwickler sollte man nicht zumuten, so etwas zu betreiben. Kosten: Die Pipeline geht kaputt, niemand repariert sie, und die Docs wandern zurück auf das gemeinsame Laufwerk, mit einem zusätzlichen Schritt Frust im Gepäck.

**Wenn der Dialekt driftet.** Markdown ist eine Familie von Dialekten. Eine Tabelle rendert auf Ihrem Code-Host und kommt als Pipe-Zeichen in Ihrem Build heraus, Fußnoten funktionieren in einem Parser und im nächsten nicht. Kosten: Fehler, die nur in der veröffentlichten Ausgabe auftauchen.

**Wenn die Tabellen kompliziert sind.** Verbundene Zellen, verschachtelte Tabellen, eine Zelle mit einer Liste darin. Markdown-Tabellen sind einfache Gitter. Kosten: Entweder die Tabelle wird vereinfacht, was oft eine Verbesserung ist, oder sie wird zu rohem HTML mitten in Ihrer Prosa.

## Die Mischform, bei der die meisten Organisationen landen, und wie man verhindert, dass sie verrottet

Fast niemand fährt ein einziges Format. Der Endzustand ist eine Mischform, und die Mischform ist in Ordnung — was verrottet, ist die Version davon, in der zwei Formate beide als Originale behandelt werden. Das ist die Anordnung, bei der jemand am Dienstag einen Tippfehler in der Word-Kopie korrigiert, die Markdown-Quelle am Mittwoch neu generiert wird, und die Korrektur vom Dienstag ein Jahr lang unbemerkt verschwindet.

Eine Regel verhindert das: **ein Format ist die Quelle, das andere ist ein Export, und der Export wird nie bearbeitet.** Alles andere ist Umsetzung.

| Dokument | Quelle | Export | Wer die Quelle bearbeitet |
| --- | --- | --- | --- |
| API-Referenz, Runbooks, Architekturnotizen | Markdown im Repository | HTML-Seite, oder ein PDF für ein Audit | Entwickler, in Pull Requests |
| Mitarbeiterhandbuch, Richtlinien | Markdown im Repository | Eine `.docx` oder PDF zum Drucken und Bestätigen | HR, über den Web-Editor des Hosts |
| Verträge, Statements of Work | Word | PDF zur Unterschrift; Markdown nur, wenn es veröffentlicht werden muss | Rechtsabteilung, in nachverfolgten Änderungen |
| Angebote und gestaltete Berichte | Word, aus der Hausvorlage | PDF | Wer auch immer den Deal besitzt |
| Besprechungsnotizen, Entscheidungsprotokolle | Markdown | Keiner | Jeder |
| Regulatorische Einreichungen und alles mit vorgeschriebenem Layout | Word | PDF | Wer die Einreichung besitzt |

Drei Praktiken halten das Arrangement ehrlich, und alle drei sind billig:

1. **Jeden Export stempeln.** Eine generierte Datei sagt das auf ihrer ersten Seite: erzeugt aus dieser Quelle, an diesem Datum, aus diesem Commit. Wer den Export öffnet und ein Wort ändern will, weiß dann, wohin. Ohne den Stempel ist der Export von einem Original nicht zu unterscheiden und wird wie eines bearbeitet.
2. **Neu generieren statt reparieren.** Wenn ein Export falsch ist, geht die Korrektur in die Quelle, und der Export wird neu gebaut. Wenn eine Korrektur je direkt in den Export geht, haben Sie jetzt zwei Quellen, und die Uhr läuft.
3. **Einen Besitzer pro Dokumenttyp benennen, nicht pro Dokument.** „Alle Richtlinien sind Markdown, HR besitzt sie“ ist eine Regel, der man folgen kann. „Diese hier ist Word, weil Priya es bevorzugt“ ist der Weg zurück zu drei Antworten darauf, wo die Dokumentation lebt.

### Einen Word-Bestand nach Markdown migrieren

Fangen Sie nicht mit der Konvertierung an. Fangen Sie damit an, aufzulisten, was Sie haben, und pro Dokument zu entscheiden, ob es überhaupt existieren sollte — ein Konvertierungsprojekt, das mit einer Massenkonvertierung beginnt, erzeugt zweihundert Markdown-Dateien, von denen sechzig überholt sind und vierzig nie Dokumente waren, und niemand wird sie hinterher je durchsortieren.

Dann konvertieren Sie die, die übrig bleiben, in kleinen Chargen, und lesen Sie jedes Ergebnis gegen das Original. Überschriften, die nur groß und fett gemacht statt formatiert wurden, kommen als Absätze an; nummerierte Listen kommen als reiner Text an, wenn die Nummerierungsdefinitionen sich nicht auflösen; Bilder landen als separate Dateien oder verschwinden; Bildunterschriften werden zu gewöhnlichen Sätzen, die zu nichts mehr gehören. Die Konvertierungswege und die Checkliste, um genau diese Fehler zu erkennen, stehen in [wie man eine .docx zu Markdown konvertiert](/blog/convert-docx-to-markdown), und für ein einzelnes Dokument, ohne etwas zu installieren, läuft [TransformPipes Word-zu-Markdown-Konvertierung](/word-to-markdown) im Browser — abgemeldet wird die Datei nirgendwohin hochgeladen, was zählt, wenn das Dokument ein Richtlinienentwurf statt eines öffentlichen READMEs ist.

Zwei Regeln für die Migration selbst. Lassen Sie die gestalteten Dokumente in Ruhe: eine zu Markdown konvertierte Broschüre ist eine zerstörte Broschüre, und die richtige Antwort dafür ist, die Word-Datei zu behalten und aufzuhören, so zu tun, als sei sie Dokumentation. Und behalten Sie die ursprünglichen `.docx`-Dateien irgendwo schreibgeschützt, bis die Migration alt genug ist, dass niemand mehr fragt, was die Konvertierung fallen gelassen hat.

### Die andere Richtung, für eine Review-Runde

Die entgegengesetzte Richtung ist Routine, keine Migration. Eine Prüferin braucht eine Word-Datei; die Quelle bleibt in Markdown. Konvertieren Sie zu `.docx` mit einem Referenzdokument, damit die Ausgabe in der Hausvorlage ankommt, schicken Sie sie los, und lesen Sie die zurückkommenden nachverfolgten Änderungen von Hand ins Markdown zurück. Dieser letzte Schritt ist manuell, und er lässt sich nicht automatisieren: Die Review-Schicht lebt in Teilen des Archivs, die Konverter entweder fallen lassen oder zu gewöhnlichem Text abflachen, sodass Sie entweder das Dokument mit allen angenommenen Änderungen zurückbekommen oder ein Durcheinander. [Eine .docx zu bekommen, die jemand tatsächlich bearbeiten kann](/blog/markdown-to-word) behandelt die Vorlagenmechanik.

Planen Sie für das manuelle Zurücklesen ein paar Stunden pro Runde ein. Nehmen Sie an, es konvertiere sauber in beide Richtungen, und Sie werden irgendwann eine Version veröffentlichen, in der die abgelehnte Formulierung eines Prüfers noch drinsteht.

## Wie man entscheidet

Sechs Kriterien, jedes mit der zugehörigen Konsequenz, in der Reihenfolge, die die meisten Fälle zuerst klärt.

1. **Benennen Sie das Artefakt, zu dem das Dokument werden muss.** Eine Webseite, eine Seite in einem Repository, ein gedrucktes Heft, ein unterschriebenes PDF, eine Einreichung. Wenn es gedruckt oder unterschrieben wird, ist die Quelle Word, und die Diskussion ist vorbei; wenn es eine Webseite oder eine Datei ist, die Leute als Text lesen, ist die Quelle Markdown, und dasselbe gilt.
2. **Benennen Sie die am wenigsten technische Person, die kurzfristig einen Satz ändern muss.** Wenn diese Person im Vertrieb, in HR oder in der Rechtsabteilung sitzt, ist entweder das Format Word, oder Sie schulden ihr eine Bearbeitungsoberfläche, die sie tatsächlich benutzt — und wenn Sie keines von beidem liefern, veraltet das Dokument zwischen Anfragen, und die Formatentscheidung wurde per Default getroffen.
3. **Zählen Sie, wie oft es sich ändert und von wie vielen Leuten.** Unter einer Handvoll Änderungen im Jahr durch eine Besitzerin kostet Word nichts. Wöchentliche Änderungen durch ein Dutzend Leute brauchen Merges, und Word hat keine Merge-Operation, sodass die Kosten bei demjenigen landen, der die Kopien konsolidiert.
4. **Fragen Sie, ob Sie je eine Formulierung überall ändern müssen.** Wenn die Antwort ja ist — Produktnamen, Endpunkte, Adressen, Rechtstext —, ist Markdown das einzige der beiden, bei dem die Änderung eine überprüfbare Einheit ist statt ein Akt von Sorgfalt, dem Sie einfach vertrauen müssen.
5. **Fragen Sie, ob jemand je wissen muss, warum ein Satz sagt, was er sagt.** Für Sicherheitskontrollen, Serviceversprechen und alles, was ein Auditor liest, ist Herkunft Teil der Aufgabe des Dokuments, und nur Versionskontrolle protokolliert das auf Satzebene.
6. **Entscheiden Sie, wer die Pipeline besitzt, bevor Sie eine bauen.** Ein Repository, eine Review-Gewohnheit und ein Build brauchen einen benannten Besitzer; wenn Sie keinen benennen können, wählen Sie das Format, das keine Pipeline braucht, und überdenken Sie es, wenn Sie einen benennen können.

## Fazit

Dokumentation sollte in dem Format leben, das zu ihrer Aufgabe passt, und für den größten Teil der Dokumentation, die eine technische Organisation pflegt, ist dieses Format Markdown in Versionskontrolle — weil das, was Dokumentation wahr hält, Review, Historie, Suche und die Fähigkeit ist, eine Formulierung überall auf einmal zu ändern, und das sind die vier Dinge, in denen Text in einem Repository am besten ist. Word bleibt die richtige Antwort, dauerhaft und ohne Entschuldigung, für Dokumente, deren Aufgabe es ist, layoutet, gedruckt, unterschrieben oder Klausel für Klausel mit jemandem verhandelt zu werden, dessen Werkzeug nachverfolgte Änderungen sind. Betreiben Sie beides, entscheiden Sie pro Dokumenttyp, welches die Quelle ist, generieren Sie das andere, und stempeln Sie die generierte Datei, damit sie niemand versehentlich bearbeitet — dann ist die einzig verbleibende Arbeit die Konvertierung an der Grenze, die in beide Richtungen ein einzelner Schritt ist und der einzige Teil davon, den ein Werkzeug für Sie lösen kann.

## FAQ

### Ist Markdown besser als Word für Dokumentation?

Für Dokumentation, die sich oft ändert, von mehreren Leuten gepflegt wird und am Ende auf einer Webseite landet, ja — wegen Review, Historie, Suche und Massenbearbeitung, nicht wegen der Syntax. Für ein Dokument, das nach einer Vorlage gedruckt, unterschrieben oder Klausel für Klausel geprüft werden muss, ist Word besser, und der Unterschied ist nicht knapp.

### Können nicht-technische Kolleginnen und Kollegen wirklich Dokumentation in Markdown schreiben?

Die Syntax ist nicht das Hindernis; die meisten Leute lernen Doppelkreuze und Bindestriche in zehn Minuten. Das Hindernis ist der Workflow drumherum — Branches, Commits, Reviews —, geben Sie ihnen also den Web-Editor des Code-Hosts mit Vorschau, oder ein Content-System, das Markdown zurück ins Repository schreibt. Sie zu bitten, ein Terminal zu benutzen, ist der Grund, warum ein Docs-as-Code-Programm leise scheitert.

### Was passiert mit nachverfolgten Änderungen und Kommentaren, wenn ich ein Word-Dokument zu Markdown konvertiere?

Sie sind das Erste, was verloren geht. Anstehende Einfügungen und Löschungen werden entweder stillschweigend angenommen oder verworfen, und Kommentar-Threads haben überhaupt keine Markdown-Entsprechung, sodass sie meist ohne Warnung verschwinden. Lösen Sie die Review-Schicht in Word auf, bevor Sie konvertieren, und lesen Sie von Hand aus, was Sie behalten müssen.

### Wie drucke ich ein Markdown-Dokument oder bekomme ein PDF daraus?

Konvertieren Sie es zu HTML und drucken Sie das aus einem Browser, der die eigenen Styles der Seite nutzt, oder konvertieren Sie zu `.docx` mit einer Hausvorlage und drucken Sie von dort. So oder so entscheidet die Vorlage über die Paginierung, nicht das Dokument, also ist die Vorlage das, was Sie bauen müssen, wenn das Seitenlayout wichtig ist.

### Sollten wir die ursprüngliche .docx nach der Konvertierung behalten?

Behalten Sie sie schreibgeschützt, bis das Markdown eine Weile gelesen, geprüft und genutzt wurde. Konvertierungen lassen still Dinge fallen — Bildunterschriften, Nummerierung, frei schwebende Inhalte —, und das Original ist die einzige Möglichkeit herauszufinden, was verloren ging, was eine Frage ist, die jemand immer drei Monate später stellt.

### Sperrt uns Word bei unserer Dokumentation ein?

Nicht auf Formatebene: `.docx` ist Office Open XML, ein dokumentierter Standard, veröffentlicht als ECMA-376 und als ISO/IEC 29500, den mehrere Anwendungen lesen und schreiben. Das Lock-in ist verhaltensbedingt — die Vorlage, die Makros, die Review-Gewohnheiten und die Annahme, dass jedes Dokument Seiten hat —, und das macht einen Bestand von Word-Dokumenten teuer zu verlagern, nicht die Dateien selbst.

### Welches Format ist besser für Barrierefreiheit?

Word kann mehr ausdrücken, einschließlich eines Sprachattributs, Tabellenkopfzeilen und einer Barrierefreiheitsprüfung, aber jedes Dokument muss korrekt verfasst und einzeln geprüft werden. Markdown ist durch Konstruktion semantisch und erbt den Rest von seiner Vorlage, sodass Sie das Theme einmal prüfen und jede Seite davon profitiert — was meist der günstigere Weg zu einem Satz von Dokumenten ist, die alle barrierefrei sind statt nur manche.
