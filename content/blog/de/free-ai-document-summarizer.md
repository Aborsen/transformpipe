---
title: "Kostenlose KI-Zusammenfassung für Markdown, HTML und andere Dokumente"
description: "Kostenlose Wege zur KI-Zusammenfassung eines Markdown-, HTML-, Word- oder CSV-Dokuments — eingebaut, per freiem Chatmodell, und was jeder Weg wirklich kostet"
date: 2026-09-14
tag: Workflow
keywords: kostenlose ki zusammenfassung, dokument mit ki zusammenfassen, markdown datei zusammenfassen, html datei zusammenfassen, ki textzusammenfassung kostenlos, zusammenfassung ohne upload, dokumente automatisch zusammenfassen
---

Ein Dokument landet in Ihrem Verlauf mit einem Namen und einer Größe, und keines von beidem sagt Ihnen, ob es sich zu öffnen lohnt. Eine Zusammenfassung würde das tun — drei Sätze, die sagen, was das Ding tatsächlich ist, bevor Sie sich aufs Lesen einlassen. Eine solche zu bekommen hieß früher, den Text irgendwohin zu kopieren, wo ein KI-Modell dahintersteht, und das ist ein echter Preis für ein Dokument, dessen Lektüre Sie sich gerade ersparen wollten.

### Kurzfassung

**Ein Konverter mit eingebauter Zusammenfassung** ist der Weg mit der geringsten Reibung: Dokument konvertieren oder speichern, auf Zusammenfassung klicken, und ein zwischengespeichertes Ergebnis kommt zurück — nichts kopieren, kein zweites Konto, nichts einfügen. [Die Zusammenfassung von TransformPipe](/) nutzt Googles Modell Gemini Flash direkt, drei bis fünf schlichte Sätze, am Dokument zwischengespeichert, also einmal berechnet und vielfach gelesen, kostenlos bis zu 20 Zusammenfassungen pro Tag und Konto. **Ein kostenloses Chatmodell** — ChatGPT oder die Gemini-App, beide ohne hinterlegte Karte nutzbar — funktioniert für jedes Dokument, das Sie bereit sind von Hand einzufügen, ohne Tageslimit auf das Gespräch selbst, aber auch ohne Zwischenspeicher, ohne API und ohne Erinnerung daran, sobald der Chat weg ist. **Notion AI** fasst Seiten nativ zusammen, aber nur im kostenpflichtigen Business-Plan zu 20 $ pro Mitglied und Monat (geprüft auf notion.com, 14. September 2026) — kostenlose und Plus-Arbeitsbereiche bekommen eine begrenzte Testphase, nicht die Sache selbst. Was Sie auch wählen: die ehrliche Frage ist, wohin der Text geht, bevor Sie einen Vertrag oder eine Patientennotiz irgendwo davon einfügen.

## Was „kostenlos“ hier tatsächlich heißt

Jede Möglichkeit unten ist im gewöhnlichen Sinn kostenlos nutzbar — keine Karte nötig, um es zu probieren — aber „kostenlos“ verdeckt echte Unterschiede, sobald man anschaut, was danach passiert. Eine Zusammenfassung, die Sie einmal erzeugen und nie wiedersehen, kostet Sie in einer Woche die Zeit, den Text erneut einzufügen. Eine am Dokument zwischengespeicherte Zusammenfassung ist da, wenn Sie es öffnen, ohne dass noch einmal gefragt wird. Und eine Zusammenfassung von einem Dienst, der Ihre Eingabe für das Training behält, ist eine andere Art kostenlos als eine, die das nicht tut, was auch immer das Preisschild sagt.

## Kurzvergleich: der Spickzettel

| Werkzeug | Am besten für | Kernfähigkeit | Preis |
| --- | --- | --- | --- |
| Die eingebaute Zusammenfassung von TransformPipe | Ein Dokument, das schon im Verlauf liegt | Am Dokument zwischengespeichert, auf Wunsch neu erzeugt, kein separates Einfügen | Kostenlos, 20/Tag pro Konto |
| ChatGPT (kostenloser Plan) | Ein Dokument, das Sie offen haben und einfügen können | Unbegrenzter kostenloser Textchat seit August 2026 | Kostenlos |
| Google Gemini (App, kostenlose Stufe) | Dasselbe, auf Googles eigener Modellfamilie | Gemini Flash und Flash-Lite, tägliche Anfragegrenzen | Kostenlos |
| Notion AI | Eine Seite, die ohnehin in Notion liegt | Fasst zusammen und schreibt Entwürfe in der Seite selbst | Nur im Business-Plan, 20 $/Mitglied/Monat |
| Ein lokales Open-Source-Modell | Alles, was den Rechner nicht verlassen darf | Läuft vollständig offline, gar kein Konto | Kostenlos, braucht Einrichtung |
| In irgendeinen Assistenten-Chat kopieren | Ein einmaliger Fall, überall dort, wo Sie schon ein Chatfenster haben | Kein neues Werkzeug zu lernen | Kostenlos, Qualität je nach Modell |

## Die eingebaute Zusammenfassung von TransformPipe — ohne separates Einfügen

Sobald ein Dokument konvertiert oder gespeichert ist, sitzt ein Reiter „Zusammenfassung“ neben Vorschau und Quelltext. Ihn zum ersten Mal zu öffnen ruft das Modell auf; ihn erneut zu öffnen liest das zwischengespeicherte Ergebnis, denn der Sinn eines Zwischenspeichers ist, dass ein Dokument, das Sie zweimal prüfen, nicht zweimal nachdenken sollte.

| Dafür | Dagegen |
| --- | --- |
| Der Text wird nirgendwohin kopiert — das Dokument ist bereits da | 20 Zusammenfassungen pro Tag und Konto, nicht unbegrenzt |
| Zwischengespeichert: das Modell läuft einmal, das Ergebnis lesen Sie so oft Sie wollen | Drei bis fünf Sätze mit Absicht — kein Ersatz für die Lektüre eines Dokuments, das Sie wirklich im Detail brauchen |
| Eine Schaltfläche „Neu erzeugen“, wenn sich das Dokument geändert hat und die gespeicherte Zusammenfassung nicht | Braucht ein Dokument, das zuerst in einem Konto gespeichert ist — eine konvertierte, aber ungespeicherte Datei hat nichts, woran die Zusammenfassung hängen könnte |
| Auch über die API verfügbar (`POST /api/v1/documents/:id/summary`), ein Skript kann also dasselbe verlangen | Setzt voraus, dass in der Installation ein Google-AI-Schlüssel konfiguriert ist — beim Selbsthosten brauchen Sie Ihren eigenen |

**Preis:** kostenlos, 20 am Tag pro Konto. API und CLI (`tp summary <id>`) zehren vom selben Kontingent.

**Technische Details.** Das Modell ist Googles Gemini Flash, direkt gegen einen Schlüssel von Google AI Studio aufgerufen statt über ein kostenpflichtiges Gateway — eine Entscheidung, die genau deshalb so fiel, weil sie eine echte kostenlose Stufe erhält, statt über ein geteiltes Kontingent zu laufen. Der Prompt ist auf die ersten 60.000 Zeichen des Dokuments begrenzt und verlangt drei bis fünf schlichte Sätze, keine Überschriften, keine Wiederholung des Titels, wobei der erweiterte Denkmodus des Modells bewusst abgeschaltet ist: eine Zusammenfassung aus drei Sätzen braucht kein Modell, das Zeit damit verbringt, seine eigene Formulierung abzuwägen.

**Für wen ist das?** Für alle, die mehr Dokumente im Verlauf haben, als sie im Kopf behalten können, und prüfen, welches als Nächstes zu öffnen ist, oder bestätigen wollen, dass ein Speichern tatsächlich das festgehalten hat, was sie behalten wollten — ohne ein zweites Werkzeug, einen zweiten Tab oder ein zweites Konto. Wenn das Dokument ohnehin aus einem Modell kam, ist [diese Ausgabe in eine lesbare Seite zu verwandeln](/blog/ai-output-to-a-shareable-page) derselbe Ablauf einen Schritt früher.

## Der kostenlose Plan von ChatGPT — einfügen, ohne Limit auf das Gespräch

Seit August 2026 hat OpenAI die Nachrichtengrenze für den Textchat im kostenlosen Plan vollständig aufgehoben (damals unter anderem von Engadget berichtet) — kostenlose Konten dürfen so lange Gespräche führen, wie sie mögen, wobei für Bilderzeugung, Datei-Uploads und Sprache weiterhin eigene Grenzen gelten und der kostenlose Zugang auf OpenAIs kleinstes aktuelles Modell beschränkt ist.

| Dafür | Dagegen |
| --- | --- |
| Kein Tageslimit auf das reine Textgespräch | Jedes Dokument ist ein manuelles Einfügen — kein Verlauf, kein Zwischenspeicher, kein „Dokument öffnen und Zusammenfassung sehen“ |
| Überhaupt keine Kontokosten | Der Modellzugang in der kostenlosen Stufe beschränkt sich auf das kleinste Modell der aktuellen Reihe |
| Funktioniert mit allem, was Sie einfügen können — Markdown, reiner Text, eine eingefügte Tabelle | Kein API-Zugang im kostenlosen Plan, den ein Skript aufrufen könnte |
| Vertraute Oberfläche, wenn Sie sie ohnehin für anderes benutzen | Was mit eingefügtem Text geschieht, hängt an den Dateneinstellungen Ihres Kontos — prüfen Sie sie, bevor Sie etwas Heikles einfügen |

**Preis:** kostenlos für den Textchat; kostenpflichtige Stufen bringen größere Modelle, höhere Upload-Grenzen und API-Zugang.

**Für wen ist das?** Für eine einmalige Zusammenfassung eines Dokuments, das Sie gerade vor sich haben, ohne Interesse daran, dieselbe Zusammenfassung beim nächsten Öffnen der Datei automatisch wiederzubekommen. Wenn der Assistent auch konvertieren und teilen soll statt nur zu lesen, ist [ein Connector der kürzere Weg als ein Chatfenster](/blog/converting-documents-from-an-assistant).

## Googles Gemini-App, kostenlose Stufe

Dieselbe Modellfamilie, die die eingebaute Zusammenfassung über ihre API aufruft, gibt es auch direkt, in Googles eigener Chat-Oberfläche, ohne hinterlegte Karte.

| Dafür | Dagegen |
| --- | --- |
| Kostenlos ohne Karte, unter gemini.google.com und in den Mobil-Apps | Die kostenlose Stufe ist auf rund 1.000 Anfragen am Tag samt Minutenlimit gedeckelt, nicht unbegrenzt |
| Flash- und Flash-Lite-Modelle bleiben kostenlos; Modelle der Pro-Stufe wanderten im April 2026 hinter einen Bezahlplan | Dieselbe Form aus Einfügen und Vergessen wie bei jedem Chatfenster — kein eigener Dokumentverlauf |
| Dieselbe zugrunde liegende Modellqualität, die ein bezahlter API-Aufruf liefern würde | Ein Chatfenster, kein Dokumentwerkzeug — keine Konvertierung, kein Zwischenspeicher, kein Freigabelink |

**Preis:** kostenlose Stufe zu 0 $; bezahlte Stufen beginnen bei 4,99 $ im Monat für mehr Spielraum.

**Für wen ist das?** Für jemanden, der ausdrücklich Gemini will, außerhalb jedes Konverters, für Dokumente, die er ohne Bauchschmerzen in ein allgemeines Chatfenster einfügt.

## Notion AI — nativ, aber nicht im kostenlosen Plan

Wenn das Dokument ohnehin in Notion liegt, kann Notion AI die Seite an Ort und Stelle zusammenfassen, Text entwerfen und Fragen dazu beantworten — wirklich bequem, wenn die Zusammenfassung eine weitere Sache ist, die ohne Verlassen der Seite erledigt sein soll.

| Dafür | Dagegen |
| --- | --- |
| Fasst zusammen und entwirft, ohne die Seite zu verlassen, auf der das Dokument schon liegt | Voller KI-Zugang verlangt den Business-Plan, 20 $ pro Mitglied und Monat (geprüft auf notion.com, 14. September 2026) |
| Kein separates Werkzeug, kein Einfügen — es liest die Seite, an der es ohnehin hängt | Kostenlose und Plus-Arbeitsbereiche bekommen nur eine begrenzte Testphase der KI-Funktionen, keine dauerhafte Nutzung |
| Nützlich über das Zusammenfassen hinaus: Entwürfe, Datenbanken automatisch füllen, Besprechungsnotizen | Hilft nur Dokumenten, die Notion-Seiten sind — nichts außerhalb des Arbeitsbereichs |

**Preis:** im Business-Plan enthalten; seit 2026 nicht mehr als eigenständige Erweiterung erhältlich.

**Für wen ist das?** Für ein Team, das ohnehin für Notion Business zahlt und bei dem das fragliche Dokument eine Seite ist statt einer Datei, die anderswo konvertiert oder geteilt werden muss.

## Ein lokales Open-Source-Modell — nichts verlässt den Rechner

Für ein Dokument, das wirklich kein Netz erreichen darf — juristisch, medizinisch, unveröffentlicht — nimmt ein lokal betriebenes Open-Source-Modell (Llama, Mistral oder ähnlich, über einen Runner wie Ollama oder LM Studio) die Frage nach dem Verbleib des Textes vom Tisch, weil er nirgendwohin geht.

| Dafür | Dagegen |
| --- | --- |
| Es wird nie irgendetwas irgendwohin gesendet — die einzige ehrliche Antwort für die heikelsten Dokumente | Echte Einrichtung: eine Installation, ein Modell-Download von mehreren Gigabyte und Hardware, die das erträglich stemmt |
| Kein Konto, kein Kontingent, kein Ratenlimit, sobald es läuft | Die Qualität der Zusammenfassung liegt hinter den größten gehosteten Modellen, auch wenn der Abstand deutlich geschrumpft ist |
| Läuft offline, unbegrenzt, ohne laufende Kosten | Kein Zwischenspeicher und kein Dokumentverlauf, außer Sie bauen ihn selbst |

**Preis:** kostenlos, quelloffen; der Preis sind Ihre eigene Zeit und Ihr Rechner, kein Abonnement.

**Für wen ist das?** Für alle, deren tatsächliche Einschränkung „das darf meinen Rechner nicht verlassen“ lautet statt „das muss schnell gehen“ — das sind zwei verschiedene Probleme mit zwei verschiedenen richtigen Antworten.

## Wo eine Zusammenfassung am meisten bringt: das Dokument, das früher fünfzig Dokumente war

Der Fall, in dem eine Zusammenfassung am wenigsten nützt, ist der, den die meisten zuerst probieren — ein Dokument, das Sie letzte Woche selbst geschrieben haben. Sie wissen bereits, was drinsteht; die Zusammenfassung sagt Ihnen nichts.

Der Fall, in dem sie wirklich nützt, ist der zusammengeführte Export: ein ganzer Notion-Arbeitsbereich, ein Confluence-Bereich oder ein Obsidian-Tresor, verwandelt in ein einziges Markdown-Dokument. [Alle drei Exporte kommen als ZIP aus vielen Seiten an](/blog/markdown-from-notion-obsidian-and-confluence), und sie zusammenzuführen ergibt ein einzelnes Dokument, das korrekt, vollständig und auf einen Blick vollkommen unlesbar ist — vierzigtausend Wörter mit einem Inhaltsverzeichnis, in dem Seitentitel stehen, die jemand für ein Wiki geschrieben hat, nicht für einen Leser, der neu dazukommt.

Genau diese Form bringt eine Zusammenfassung aus drei Sätzen wieder in Ordnung. Den Export konvertieren, speichern, und die Zusammenfassung beantwortet „was steckt eigentlich in diesem Ding“, ohne es zu öffnen — und das ist die Frage, die Sie ein Jahr später zu einem archivierten Arbeitsbereich haben, und die niemand aus einem Dateinamen beantworten kann.

| Quelle | Typische Größe nach dem Zusammenführen | Was die Zusammenfassung beantwortet |
| --- | --- | --- |
| [Ein Notion-Export](/notion-to-markdown) | Jede Seite des Arbeitsbereichs, der Reihe nach | Für welches Projekt oder Team dieser Arbeitsbereich war, und ungefähr wann |
| [Ein Export eines Confluence-Bereichs](/confluence-to-markdown) | Jede Seite des Bereichs, mit aufgelösten Makros | Ob dieser Bereich Dokumentation, Besprechungsnotizen oder ein Entscheidungsprotokoll war |
| [Ein Obsidian-Tresor](/obsidian-to-markdown) | Jede Notiz, Wikilinks zu schlichten Wörtern aufgelöst | Worum es im Tresor tatsächlich ging, unter einer Ordnerstruktur, die nur ihr Autor verstand |

Das Kontingent zählt hier weniger, als es aussieht. Zwanzig Zusammenfassungen am Tag sind sehr wenig für ein Skript, das einen Ordner durchläuft, und reichlich für einen Menschen, der entscheidet, welchen der archivierten Exporte des letzten Quartals er öffnet — und das Ergebnis liegt am Dokument zwischengespeichert, dasselbe Archiv nächsten Monat erneut zu prüfen kostet also gar nichts.

## Die ehrliche Frage: wohin geht der Text, bevor Sie ihn einfügen?

Bei jeder kostenlosen Möglichkeit oben außer der lokalen erreicht der Text Ihres Dokuments das Modell von jemand anderem — das ist keine Kritik, sondern der Handel, den jede gehostete KI-Funktion eingeht, und die einzige unehrliche Fassung dieses Artikels würde so tun, als sei es anders. Verschieden ist, was danach mit diesem Text geschieht: ob er zum Training von irgendetwas verwendet wird, wie lange er aufbewahrt wird und ob sich die Bedingungen einer kostenlosen Stufe von denen einer bezahlten unterscheiden. Lesen Sie die tatsächliche Einstellungsseite des Werkzeugs, das Sie benutzen, bevor Sie es mit einem Dokument füttern, das Sie nicht wiederverwertet sehen möchten — der Datenschutzhinweis eines Konverters ist ein Anfang, kein Ersatz für die Richtlinie des Modellanbieters selbst.

## Wie Sie wählen

1. **Fragen Sie, ob Sie die Zusammenfassung später noch einmal brauchen.** Eine am aufbewahrten Dokument zwischengespeicherte Zusammenfassung schlägt jedes Mal ein Chatprotokoll, das Sie erst suchen müssen, wenn Sie dasselbe Dokument zweimal prüfen wollen.
2. **Fragen Sie, wo das Dokument schon lebt.** Eine Notion-Seite will Notion AI, falls Sie ohnehin dafür zahlen; eine Datei will ein Werkzeug, das Dateien liest, statt ein manuelles Einfügen zu verlangen.
3. **Zählen Sie, wie oft Sie das tun.** Zwanzig am Tag sind viel für einen Menschen und wenig für ein Skript, das einen Ordner abarbeitet — wissen Sie, was von beidem Sie sind, bevor Sie an die Decke stoßen.
4. **Klären Sie, was „darf den Rechner nicht verlassen“ für dieses Dokument tatsächlich bedeutet.** Wenn die ehrliche Antwort „nichts Gehostetes“ lautet, ist der lokale Weg der einzige, der dem wirklich gerecht wird, nicht der am schnellsten eingerichtete.
5. **Prüfen Sie die tatsächlichen Grenzen des kostenlosen Plans, bevor Sie sich darauf verlassen.** Eine kostenlose Stufe, die ihre Grenzen in den letzten sechs Monaten geändert hat, ist in dieser Kategorie häufig genug, dass „heute auf der Seite des Anbieters geprüft“ jeden Vergleich von vor einem Jahr schlägt — diesen eingeschlossen.

## Fazit

Eine kostenlose KI-Zusammenfassung eines Dokuments gibt es tatsächlich auf mehreren ehrlichen Wegen, und die Unterschiede, die zählen, betreffen nicht die Qualität der Zusammenfassung — die zugrunde liegenden Modelle liegen für drei Sätze nah genug beieinander, dass die meisten Menschen sie nicht auseinanderhalten können. Verschieden ist die Reibung: ob die Zusammenfassung da ist, wenn Sie das Dokument wieder öffnen, ob sie ein manuelles Einfügen gebraucht hat und ob das Dokument den Rechner überhaupt jemals verlassen durfte. Für ein Dokument, das schon in [TransformPipe](/) liegt, beantwortet die eingebaute Zusammenfassung die ersten beiden Punkte ungefragt; für alles andere ist ein kostenloses Chatmodell ein Einfügen entfernt, und ein lokales Modell ist die einzige Antwort auf die dritte Frage, die niemandem Vertrauen abverlangt.

## FAQ

### Gibt es einen wirklich kostenlosen Weg, ein Dokument mit KI zusammenzufassen?

Ja, gleich mehrere. Ein Konverter mit eingebauter Zusammenfassung auf einem Modell der kostenlosen Stufe, ein kostenloses Chatkonto wie ChatGPT oder die Gemini-App, in das Sie Text einfügen, und ein lokal betriebenes Open-Source-Modell sind alle kostenlos und ohne Karte zu haben — sie unterscheiden sich in der Bequemlichkeit und darin, ob Ihr Text überhaupt einen Server erreicht.

### Behält ein kostenloser KI-Zusammenfasser mein Dokument?

Das hängt ganz am Werkzeug. Eine Zusammenfassung, die an einem bereits gespeicherten Dokument hängt, lebt mit diesem Dokument unter den Regeln Ihres eigenen Kontos; der Verlauf eines Chatfensters hängt an den Aufbewahrungseinstellungen dieses Dienstes, die zu lesen sich lohnt, bevor Sie etwas Heikles einfügen. Ein lokales Modell behält nirgends etwas, weil nichts Ihren Rechner verlassen hat.

### Wie lang sollte eine KI-Zusammenfassung eines Dokuments sein?

Drei bis fünf schlichte Sätze reichen, um zu entscheiden, ob das vollständige Dokument geöffnet wird — und genau das ist die eigentliche Aufgabe einer Zusammenfassung. Längere Zusammenfassungen konkurrieren mit dem Dokument selbst um Ihre Aufmerksamkeit, und dann können Sie ebenso gut die Quelle lesen.

### Kann ich eine KI-Zusammenfassung bekommen, ohne meine Datei irgendwohin hochzuladen?

Ja, mit einem lokalen Modell — Datei und Modell bleiben beide auf Ihrem Rechner, es wird also per Definition nichts hochgeladen. Andernfalls ist ein browserbasiertes Werkzeug, das nur den extrahierten Text an eine Zusammenfassungs-API schickt, statt die Originaldatei anderswo abzulegen, die nächstbeste Möglichkeit.

### Ist Notion AI im kostenlosen Notion-Plan enthalten?

Nein — kostenlose und Plus-Arbeitsbereiche in Notion bekommen eine begrenzte Testphase der KI-Funktionen, und der volle dauerhafte Zugang verlangt seit 2026 den Business-Plan zu 20 $ pro Mitglied und Monat. Wenn Zusammenfassen die einzige KI-Funktion ist, die Sie wollen, und das Dokument noch keine Notion-Seite ist, ist ein kostenloses eigenständiges Werkzeug der günstigere Weg.

### Kann ich einen ganzen Notion- oder Confluence-Export auf einmal zusammenfassen?

Ja, wenn Sie ihn zuerst zu einem Dokument zusammenführen — aus einem Export-ZIP mit vielen Seiten wird ein Markdown-Dokument mit Inhaltsverzeichnis, und die Zusammenfassung beschreibt dann das Ganze statt einer einzelnen Seite davon. Das ist der Fall, in dem eine Zusammenfassung am meisten wert ist, denn ein zusammengeführter Export mit vierzigtausend Wörtern ist genau das Dokument, das niemand öffnet, um herauszufinden, was es war.

### Läuft die Zusammenfassung jedes Mal neu, wenn ich das Dokument öffne?

Sollte sie nicht, und ein Werkzeug, das sie neu laufen lässt, verbraucht klammheimlich Ihr Kontingent. Eine zwischengespeicherte Zusammenfassung wird einmal berechnet, beim Dokument abgelegt und danach bei jedem Öffnen gelesen — mit einer Bedienmöglichkeit zum Neuerzeugen für den Fall, dass sich das Dokument geändert hat und die gespeicherten Sätze es nicht mehr beschreiben.

### Was ist der Unterschied zwischen dem kostenlosen Plan von ChatGPT und dem Bezahlen dafür?

Seit August 2026 hat der Textchat im kostenlosen Plan selbst keine Nachrichtengrenze mehr, kostenlose Konten sind aber auf OpenAIs kleinstes aktuelles Modell beschränkt und haben eigene, engere Grenzen bei Bilderzeugung, Datei-Uploads und Sprache — und keinen API-Zugang, was zählt, wenn ein Skript statt eines Chatfensters das Zusammenfassen erledigen soll.
