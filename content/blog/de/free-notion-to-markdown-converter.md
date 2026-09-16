---
title: "Ein kostenloser Notion-zu-Markdown-Konverter: jede Option, und wo kostenlos einen Haken hat"
description: "Die kostenlosen Wege von Notion nach Markdown im Vergleich — Export-Knopf, Browser-Konverter, notion-to-md, Obsidian Importer — und wo kostenlos einen Haken hat"
date: 2026-09-14
tag: Konvertieren
keywords: notion nach markdown konvertieren kostenlos, notion zu markdown konverter, notion markdown export kostenlos, notion export nach markdown online, kostenloser notion konverter, notion md konverter, notion workspace exportieren
---

Suchen Sie nach einem Konverter von Notion nach Markdown, und fast alles, was zurückkommt, ist kostenlos — ein merkwürdiges Ergebnis für eine Suche, in der Geld steckt. Es stimmt trotzdem. Notions eigener Export kostet nichts, die Open-Source-Pakete kosten nichts, die Browser-Konverter kosten nichts, die Editoren, die einen Arbeitsbereich importieren, kosten nichts. Niemand verlangt Geld für die Konvertierung selbst, denn die Konvertierung ist nicht die Stelle, an der die Schwierigkeit sitzt.

Die Schwierigkeit ist, dass jede dieser kostenlosen Optionen auf ihre eigene Art kostenlos ist und jede später eine andere Rechnung schickt. Eine erzeugt Dateinamen mit einer 32-stelligen hexadezimalen ID, die hinten angeschweißt ist. Eine braucht ein Integrationstoken, einen Berechtigungsschritt innerhalb von Notion und ein sauber behandeltes Ratenlimit im Code. Eine schickt Ihren Arbeitsbereich an einen Server, von dem Sie nie gehört haben. Eine kostet einen Nachmittag Ihrer eigenen Zeit, und das ist das einzige wirklich Teure auf dieser Liste.

Dies ist also ein Vergleich, geschrieben auf der Achse, die sie trennt: nicht der Preis, sondern das, was kostenlos kostet. Jedes Werkzeug unten ist wirklich kostenlos — nicht kostenlos im Sinne einer Testphase, nicht kostenlos im Sinne einer Gratisstufe mit einer Wand dahinter — und neben jedem steht die ehrliche Antwort auf „und was dann". Für die Mechanik eines bestimmten Weges statt für die Wahl zwischen ihnen gilt: [die vollständige Anleitung geht jeden Weg Schritt für Schritt durch](/blog/convert-notion-export-to-markdown).

### Kurzfassung

Alle ernstzunehmenden Optionen sind kostenlos, wählen Sie also nach der Form. **Notions eigenes „Export as Markdown & CSV"** ist das, womit alles andere anfängt: echtes Markdown, aber jeder Dateiname und jeder seitenübergreifende Link trägt die 32-stellige Hex-ID der Seite. **Ein Browser-Konverter, der den Export zusammenführt** — [die Notion-→-Markdown-Konvertierung hier](/notion-to-markdown) ist einer — nimmt dasselbe Zip und gibt Ihnen ein Dokument mit Inhaltsverzeichnis, ohne IDs und ohne Skript, und lädt nichts hoch, solange Sie abgemeldet sind; der Tausch ist, dass Seiten zu Abschnitten werden statt zu Dateien. **`notion-to-md`** liest Seiten über Notions API aus Node heraus und lässt Sie die Ausgabe selbst benennen: richtig für einen Build-Schritt, falsch für einen Einzelfall, denn ein Token und eine Berechtigungsfreigabe kommen vor der ersten Codezeile. **Obsidian Importer** ist kostenlos und MIT-lizenziert und der Weg, wenn das Ziel ein Vault ist. **Pandoc** konvertiert den reichhaltigeren HTML-Export lokal. **Kopieren und Einfügen** hört ungefähr bei Seite fünf auf zu funktionieren.

Der Haken ist in jedem Fall Zeit, Einrichtung, Form oder Privatsphäre — nie Geld.

## Warum diese Konvertierung schwerer ist, als sie klingt

Notion identifiziert eine Seite über eine ID, nicht über ihren Titel. Titel ändern sich, zwei Seiten können sich einen teilen, und der Export braucht eindeutige Dateinamen, also schreibt er die ID in den Namen jeder Datei und jedes Ordners, den er anlegt: `Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md`. Jeder Link von einer exportierten Seite auf eine andere zeigt auf genau diesen Dateinamen, prozentkodiert. Benennen Sie die Datei in etwas Lesbares um, und der Link bricht still, denn ein toter relativer Link erzeugt überhaupt keinen Fehler, bis ein Leser darauf klickt.

Diese eine Tatsache trennt die Werkzeuge. Ein Konverter lässt Sie entweder mit den IDs sitzen, schreibt sie in einem Durchgang um, der auch jeden Link umschreibt, oder beseitigt die Notwendigkeit, dass sie überhaupt auflösen, indem er die Seiten zu einem Dokument zusammenführt. Eine vierte Möglichkeit gibt es nicht, und kein Geldbetrag würde eine hervorbringen.

Es gibt eine zweite Schwierigkeit, die mit IDs nichts zu tun hat. Eine Notion-Seite ist nicht nur Text: Sie besteht aus Datenbanken mit Ansichten, Formelspalten, synchronisierten Blöcken, die an mehreren Stellen erscheinen, und Kommentarsträngen, die an der Seite hängen, statt in sie hineingeschrieben zu sein. Markdown hat aus dieser Liste eine Tabelle und sonst nichts, ein Teil des Verlusts ist also strukturell — er passiert im Export, bevor irgendein Konverter beteiligt ist.

Und eine dritte, und hier wird die Kostenlos-Frage interessant. Ein Notion-Arbeitsbereich ist meist die heikelste Dokumentensammlung, die eine kleine Firma besitzt: Einstellungsnotizen, Gehälter, Strategie, halbfertige juristische Entwürfe. Ein kostenloser Online-Konverter, der Ihren Export hochlädt, ist kostenlos, weil Sie in einer anderen Währung bezahlt haben — in Ordnung für ein öffentliches Handbuch, eine Datenübertragung für alles andere, und es lohnt sich, das bewusst zu entscheiden, statt eine Datei auf die Seite zu ziehen, die zufällig zuerst rankte.

## Kurzvergleich: der Spickzettel

| Werkzeug | Am besten für | Kernfähigkeit | Preis |
| --- | --- | --- | --- |
| Notions „Export as Markdown & CSV" | Die Inhalte überhaupt herauszubekommen | Echtes Markdown für jede Seite, CSV für jede Datenbank | Kostenlos, eingebaut |
| Ein Browser-Konverter (`/notion-to-markdown` auf dieser Seite) | Ein Dokument zum Lesen, Archivieren oder Übergeben | Führt das Export-Zip im Browser zu einem Dokument mit Inhaltsverzeichnis zusammen | Kostenlos |
| Der Export plus Ihr eigenes Umschreibeskript | Ein Ordner mit Dateien, die Dateien bleiben müssen | Benennt Dateien um und schreibt Links aus einer ID-Zuordnung um | Kostenlos, kostet Ihre Zeit |
| `notion-to-md` | Einen Build-Schritt oder eine geplante Synchronisation | Liest Seiten über die Notion-API und schreibt Dateien, die Sie benennen | Kostenlos, quelloffen |
| Obsidian Importer | Ein Ziel, das ein Obsidian-Vault ist | Importiert einen Notion-HTML-Export oder liest direkt die API | Kostenlos, MIT |
| Pandoc auf dem HTML-Export | Eine Seite auf einmal, oder eine längere Dokumentkette | HTML rein, Markdown raus, plus jedes andere Format, das es schreibt | Kostenlos, GPL |
| Kopieren und Einfügen | Drei Seiten, einmal, heute | Nichts zu installieren, nichts zu lernen | Kostenlos |

## Die kostenlosen Optionen, eine nach der anderen

### Notions eigener Export — am besten, um die Inhalte überhaupt herauszubekommen

Jeder andere Weg hier beginnt entweder mit diesem Export oder ersetzt ihn durch die API. Notions Export liegt im Seiten- oder Arbeitsbereichsmenü und bietet PDF, HTML sowie Markdown & CSV an; die Markdown-Option schreibt eine `.md` pro Seite und eine `.csv` pro ganzseitiger Datenbank, Bilder und andere Ressourcen werden in Ordner daneben gespeichert (geprüft auf notion.com, 14. September 2026).

| Dafür | Dagegen |
| --- | --- |
| Wirklich kostenlos, eingebaut, kein Konto über das hinaus, das Sie haben | Jeder Dateiname und jeder seitenübergreifende Link trägt die 32-stellige Hex-ID |
| Die Ausgabe ist echtes Markdown, das sich in jedem Editor öffnet | Nur die aktuelle oder die Standardansicht einer Datenbank wird exportiert |
| Datenbanken kommen als CSV heraus, das immerhin maschinenlesbar ist | Eine Formularansicht lässt sich überhaupt nicht exportieren |
| Ressourcen sind enthalten, statt als ablaufende URLs zurückzubleiben | Ein großer Export kommt als per E-Mail geschickter Link, und der Link läuft ab |

**Preis:** kostenlos. Eine benachbarte Funktion ist es nicht: „Include subpages" für einen **PDF**-Export wird auf Notions eigener Hilfeseite als Funktion der Pläne Business oder Enterprise beschrieben (geprüft auf notion.com, 14. September 2026). Der Weg über Markdown & CSV ist nicht so eingeschränkt, was zu wissen sich lohnt, falls jemand in Ihrem Team zu dem Schluss gekommen ist, dass der Export eines Arbeitsbereichs ein Upgrade verlangt.

**Technische Details.** Das ID-Suffix besteht aus 32 hexadezimalen Kleinbuchstaben, vom Titel durch ein Leerzeichen oder einen Unterstrich getrennt, je nach Client-Version, die den Export erzeugt hat. „Create folders for subpages" lässt sich abschalten, um Pfade zu kürzen, was unter Windows zählt, wo ein tief verschachtelter Arbeitsbereich Pfade erzeugt, die länger sind als das Betriebssystem akzeptiert. Sehr große Exporte werden nicht sofort heruntergeladen: Notion schickt stattdessen einen Link per E-Mail, er läuft nach sieben Tagen ab, und die Verarbeitung ist mit bis zu dreißig Stunden dokumentiert — ein Export, der am Nachmittag einer Migration gestartet wird, kommt also womöglich nicht rechtzeitig an.

**Für wen ist das?** Für alle, zuerst. Welchen Weg Sie danach auch wählen: Das ist der offizielle Weg, eine Kopie Ihrer Inhalte aus einem gehosteten Produkt zu bekommen, und es einmal zu tun, bevor Sie es brauchen, ist eine billige Versicherung.

### Ein Browser-Konverter, der den Export zusammenführt — am besten für ein Dokument

Werfen Sie dasselbe Zip in [TransformPipes Notion-→-Markdown-Konvertierung](/notion-to-markdown), und jede Seite wird zu einem Abschnitt eines Dokuments, in der Reihenfolge des Exports, unter einem erzeugten Inhaltsverzeichnis. Ein seitenübergreifender Link behält die Worte, die er anzeigte, und lässt die Adresse fallen, denn sobald zwei Seiten Abschnitte eines Dokuments sind, gibt es keine separate Adresse mehr, auf die man zeigen könnte. Datenbanken kommen als Markdown-Tabellen an, statt als CSV-Dateien daneben zu liegen.

| Dafür | Dagegen |
| --- | --- |
| Keine ID-Zuordnung, keine Umbenennung, kein Skript, keine Installation | Erzeugt ein Dokument, Seiten bleiben also keine separaten Dateien mit eigenen URLs |
| Ein Inhaltsverzeichnis wird aus den Seitentiteln erzeugt | Ein seitenübergreifender Link behält seinen Text, nicht sein Ziel |
| Läuft im Browser: abgemeldet wird das Zip nirgendwohin hochgeladen | Ein Zip auf einmal, kein geplanter Auftrag |
| Datenbanken kommen als Tabellen im selben Dokument wie die Seiten an | Kommentare und Nicht-Standard-Ansichten fehlen weiterhin, weil der Export sie nie hatte |

**Preis:** kostenlos im schlichtesten Sinn — die Konvertierung läuft lokal in der Seite, es gibt also keine Serverkosten, die hereinzuholen wären, und kein Kontingent pro Datei, an das man stößt. Ein Konto ergänzt Verlauf, Freigabe und eine API, ebenfalls kostenlos.

**Technische Details.** Das Zip wird im Browser mit einem reinen JavaScript-Entpacker gelesen, Einträge nach ihrem Pfad im Archiv sortiert, sodass derselbe Export zweimal gleich konvertiert, und der Titel jedes Abschnitts ist der Dateiname ohne sein ID-Suffix. Eine Seite, deren erste Zeile ihren Titel ohnehin schon als Überschrift wiederholt, bekommt diese Überschrift nicht zweimal, und Seiten werden durch eine horizontale Linie getrennt — dieselbe Konvention, die [das Zusammenführen vieler Markdown-Dateien zu einer](/blog/merging-many-markdown-files) überall sonst verwendet.

**Für wen ist das?** Für alle, deren eigentliches Ziel ein Dokument war und kein Ordner: ein als eine lesbare Datei archivierter Arbeitsbereich, ein Projekt-Wiki, das einem Kunden übergeben wird, eine Wissensdatenbank, die in ein Repository eingefügt wird. Wenn das Ziel eine URL pro Seite braucht, ist das die falsche Form, und die nächsten zwei Optionen sind die richtigen.

### Der Export plus Ihr eigenes Umschreibeskript — am besten für Dateien, die Dateien bleiben

Wenn das Ziel eine Doku-Site ist, ein Wiki-Import oder irgendetwas, wo jede Seite ihre eigene Adresse braucht, müssen die IDs sauber herunter: Bauen Sie eine Zuordnung von der ID jeder Datei auf den gewünschten Namen und schreiben Sie dann jeden Dateinamen und jeden Link aus dieser einen Zuordnung um, in einem Durchgang. Die Umbenennung ohne das Umschreiben der Links durchzuführen ist das, was einen Ordner erzeugt, der korrekt aussieht und voller toter Links ist.

| Dafür | Dagegen |
| --- | --- |
| Keine Abhängigkeit, kein Token, kein Konto, nichts hochgeladen | Die teuerste Option hier, gemessen in Ihrer eigenen Zeit |
| Die Ausgabe sind echte Dateien mit echten Namen, was eine Doku-Site will | Eine halb erledigte Aufgabe bricht jeden internen Link, und zwar still |
| Funktioniert offline, auf dem Export, den Sie schon haben | Die Datenbank-CSV wird nicht wieder mit der Seite verbunden, zu der sie gehörte |
| Wiederholbar, sobald geschrieben, und prüfbar, weil Sie es geschrieben haben | Zehn Seiten von Hand sind ein Abend; tausend von Hand sind nicht realistisch |

**Preis:** kostenlos, wenn Sie den Nachmittag nicht mitzählen. Was Sie tun sollten: Zu jedem Stundensatz ist ein sorgfältiges Skript samt Test die teuerste Zeile auf dieser Seite und die einzige, bei der die Kosten unsichtbar bleiben, bis Sie drei Stunden darin stecken.

**Technische Details.** Die ID-Extraktion muss gegen das URL-dekodierte Linkziel laufen, nicht gegen das rohe prozentkodierte, sonst passt das Leerzeichen in `Meeting%20notes` nicht zu einem Muster, das für ein wörtliches Leerzeichen geschrieben wurde. Der Rest — der reguläre Ausdruck, die CSV-Verknüpfung, das Abflachen der Ordner — steht in [der Schritt-für-Schritt-Anleitung](/blog/convert-notion-export-to-markdown) statt hier.

**Für wen ist das?** Für Teams, die einen Dokumentationsbestand in ein System migrieren, das eine Datei pro URL erwartet, wo die Dateinamen und die Links dazwischen Teil des Ergebnisses sind und nicht beiläufig.

### `notion-to-md` — am besten für einen Build-Schritt

Den Arbeitsbereich über Notions offizielle API zu lesen statt über den Export-Knopf umgeht das ID-Problem vollständig, denn nichts zwingt eine ID in einen Dateinamen, wenn Sie derjenige sind, der die Datei schreibt. `notion-to-md` ist das dafür üblicherweise verwendete Node-Paket: Es holt den Blockbaum einer Seite über die API und konvertiert ihn nach Markdown, mit einem Haken für Blocktypen, die es standardmäßig nicht abdeckt.

| Dafür | Dagegen |
| --- | --- |
| Nie ein ID-Suffix, denn Sie wählen jeden Dateinamen | Braucht ein Integrationstoken und diese Integration auf jeder Seite freigegeben — ein Berechtigungsschritt, kein Codeschritt |
| Passt in ein Build-Skript, eine statische Seite oder einen geplanten Spiegel nach git | Eine Seite oder Datenbankabfrage auf einmal; einen Arbeitsbereich zu durchlaufen ist Ihre eigene Rekursion |
| Läuft in CI, ohne Browser und ohne manuellen Klick auf Export | Bildblöcke kommen als Notions eigene temporäre URLs zurück, die ablaufen, wenn Sie sie nicht herunterladen |
| Erweiterbar: nicht unterstützte Blocktypen lassen sich mit einem eigenen Transformer behandeln | Die API ist ratenbegrenzt, und ein Skript, das das ignoriert, scheint zu hängen |

**Preis:** kostenlos, quelloffen. Die Lizenz verdient eine sorgfältige Formulierung: Das veröffentlichte Paket gibt in seinen npm-Metadaten ISC an, während die `LICENSE`-Datei des Repositorys selbst — und die 4.0-Alpha-Linie — MIT tragen (geprüft auf registry.npmjs.org und github.com/souvikinator/notion-to-md, 14. September 2026). Beide sind permissiv; wenn Ihre Organisation Lizenzen formal erfasst, halten Sie fest, welches Artefakt Sie genommen haben.

**Technische Details.** Notions API ist auf durchschnittlich drei Anfragen pro Sekunde und Integration begrenzt, mit einem separaten arbeitsbereichsweiten Limit obendrauf (geprüft auf developers.notion.com, 14. September 2026). Über dem Limit gibt eine Anfrage statt Daten ein `429` mit einem `Retry-After`-Header zurück, eine Warte-und-erneut-versuchen-Schleife gehört also in die erste Fassung des Skripts statt in die, die nach dem ersten Fehlschlag geschrieben wird — bei einem großen Arbeitsbereich ist das der Unterschied zwischen einem Auftrag, der fertig wird, und einem, den Sie abbrechen, weil Sie einen Absturz vermuten.

**Für wen ist das?** Für alle, für die das kein Einzelfall ist: eine Seite, die ihre Inhalte aus Notion baut, ein nächtlicher Spiegel eines Handbuchs in ein Repository, eine Kette, in der „jemand exportiert es jeden Monat von Hand" der Schritt ist, der irgendwann übersprungen wird.

### Obsidian Importer — am besten, wenn das Ziel ein Vault ist

Wenn das Markdown nach Obsidian geht, ist der kürzeste kostenlose Weg Obsidians eigenes Importer-Plugin statt irgendeines allgemeinen Konverters. Es behandelt eine lange Liste von Quellen — Evernote, OneNote, Roam, Bear, Apple Notes, reine HTML- und Markdown-Ordner unter anderem — und bietet Notion in zwei getrennten Geschmacksrichtungen an.

| Dafür | Dagegen |
| --- | --- |
| Kostenlos und MIT-lizenziert, gepflegt von Obsidians eigenem Team (geprüft auf github.com/obsidianmd/obsidian-importer, 14. September 2026) | Nur nützlich, wenn das Ziel ein Vault ist; es ist kein Allzweckkonverter |
| Zwei Wege: den Arbeitsbereich über die API lesen oder das Export-Zip offline importieren | Die eigene Dokumentation rät von Notions Markdown-Export ab und empfiehlt stattdessen den HTML-Export |
| Der API-Weg wandelt Datenbanken und Formeln in Obsidians eigene Datenbankdateien um | Der Zip-Weg erhält keine Datenbanken und braucht im Gegenzug kein Token |
| Ein Vorschauschritt, bevor irgendetwas in den Vault geschrieben wird | Der API-Weg unterliegt denselben Ratenlimits von Notion, ein großer Arbeitsbereich dauert also eine Weile |

**Preis:** kostenlos, MIT-lizenziert.

**Technische Details.** Die dokumentierten Grenzen sind spezifisch genug, um damit zu planen: Auf dem API-Weg wird nur die primäre Ansicht jeder Datenbank importiert, verknüpfte Datenquellen nicht, und eine Handvoll Formelfunktionen rund um Personen und Textgestaltung haben kein Gegenstück. Der Zip-Weg tauscht Datenbanken gegen Unabhängigkeit — kein Token, kein Internet, kein Ratenlimit. Die Empfehlung, HTML statt Markdown zu exportieren, ist hier der interessante Teil, denn hier sagt ein Anbieter unumwunden, dass Notions Markdown-Export Informationen fallen lässt, die der HTML-Export behält (geprüft auf obsidian.md, 14. September 2026).

**Für wen ist das?** Für alle, die einen Arbeitsbereich nach Obsidian bewegen, das häufigste Ziel dieser Konvertierung. Die weitergehende Frage, [was einen Umzug zwischen Notion, Obsidian und Confluence überlebt](/blog/markdown-from-notion-obsidian-and-confluence), lohnt sich vor dem Import statt danach.

### Pandoc auf dem HTML-Export — am besten für eine Seite oder eine längere Kette

Pandoc ist ein Kommandozeilen-Dokumentkonverter, der HTML liest und Markdown schreibt, neben einer langen Liste in beiden Richtungen. Auf Notions HTML-Export statt auf seinen Markdown-Export gerichtet, ist es ein kostenloser, lokaler, skriptbarer Konverter, der beim reichhaltigeren der beiden Exporte beginnt.

| Dafür | Dagegen |
| --- | --- |
| Kostenlos und lokal: Nichts wird hochgeladen, und es läuft in CI so leicht wie auf einem Laptop | Konvertiert Dateien, keine Archive: Das Zip, der Ordnerdurchlauf und die Dateinamen sind Ihr Problem |
| Beginnt beim HTML-Export, der mehr trägt als der Markdown-Export | Eine große Installation für eine einzelne Seite |
| Derselbe Befehl schreibt DOCX, PDF oder LaTeX, wenn Sie ein Flag ändern | Notions exportiertes HTML ist maschinenerzeugt, das Markdown braucht also einen Aufräumdurchgang |
| Feinkörnige Kontrolle über den Markdown-Dialekt, den es schreibt | Kein Begriff von einem Arbeitsbereich, einem Seitenbaum oder einer Datenbank |

**Preis:** kostenlos, GPL-lizenziert (geprüft auf pandoc.org, 14. September 2026).

**Technische Details.** Der entscheidende Punkt ist, dass Notions HTML-Export und sein Markdown-Export nicht derselbe Inhalt in zwei Kostümen sind: Der HTML-Export trägt Formatierung und Struktur, die der Markdown-Schreiber fallen lassen musste, und genau deshalb verlangt Obsidians Importer nach HTML. Pandoc lässt Sie dort anfangen und auf dem Weg hinaus Ihren eigenen Markdown-Geschmack wählen, und die Unterschiede zwischen [den Markdown-Dialekten](/blog/commonmark-gfm-and-the-flavours) entscheiden, wie viel von diesem Markup überlebt.

**Für wen ist das?** Für Leute, die Pandoc ohnehin schon in einem Build haben, oder für alle, die eine Handvoll wichtiger Seiten konvertieren und dabei lieber bei dem Export beginnen, der weniger verloren hat.

### Kopieren und Einfügen — am besten für drei Seiten, einmal

Seite in Notion auswählen, kopieren, in einen Markdown-Editor einfügen, reparieren, was kaputtging. Das gehört auf diese Liste, weil es für eine Handvoll Seiten tatsächlich die schnellste kostenlose Option ist.

| Dafür | Dagegen |
| --- | --- |
| Nichts zu installieren, zu konfigurieren oder zu lernen | Skaliert nicht über ein paar Seiten hinaus, und die Wand kommt abrupt |
| Sie sehen jede Seite, es wird also nichts still verstümmelt | Bilder kommen nicht mit; jedes wird von Hand erneut heruntergeladen |
| Kein Konto, kein Token, kein Upload | Nicht wiederholbar und nicht prüfbar |

**Preis:** kostenlos.

**Für wen ist das?** Für jemanden mit drei Seiten und einer Frist. Bei allem mit Unterseiten, Datenbanken oder Bildern in Menge überholt der Zeitaufwand jede andere Option schnell und ohne Vorwarnung — die fünfte Seite fühlt sich an wie die erste, und bei der vierzigsten merken Sie, dass Sie hätten exportieren sollen.

## Wo kostenlos einen Haken hat

Nichts oben kostet Geld. Jedes kostet etwas, und die Kosten unterscheiden sich so sehr, dass „die sind alle kostenlos" das Unnützeste ist, was Sie über sie wissen können.

**Der Haken ist ein Kontingent.** Die API-Wege — `notion-to-md` und der API-Modus von Obsidian Importer — sind von Notions eigenem Ratenlimit begrenzt statt von irgendjemandes Preisseite. Drei Anfragen pro Sekunde und Integration klingt großzügig, bis Sie merken, dass eine Seite mit verschachtelten Blöcken mehrere Anfragen sind. Der kostenlose Teil ist echt; der unbegrenzte Teil wurde nie behauptet.

**Der Haken ist die Einrichtung.** Ein Integrationstoken ist kostenlos; es zu erstellen, es auf die richtigen Seiten freizugeben, es dort abzulegen, wo ein Build es lesen kann, und daran zu denken, es zu rotieren, ist nicht nichts. Für eine Konvertierung, die Sie genau einmal machen, ist das ein schlechter Tausch gegen einen Klick auf Export, und deshalb kippt die Rangfolge mit der Häufigkeit.

**Der Haken ist ein Plan.** Notions Hilfeseite sagt, dass „Include subpages" für einen PDF-Export einen Business- oder Enterprise-Plan verlangt (geprüft auf notion.com, 14. September 2026). Das ist nicht der Markdown-Weg, aber es erinnert daran, dass „der Export ist kostenlos" pro Format gilt und nicht im Allgemeinen.

**Der Haken sind Ihre Inhalte.** Ein kostenloser gehosteter Konverter läuft auf einem Server, den jemand bezahlt. Das ist für sich genommen nicht finster, aber es heißt, dass „wohin geht mein Export" eine echte Antwort hat, die nicht immer auf der Seite steht. Konvertierung im Browser beantwortet sie schon durch ihre Bauweise: Netzwerk-Tab öffnen, Konvertierung ausführen, zusehen, wie nichts das Gerät verlässt. Ob [ein Online-Konverter sicher ist](/blog/is-an-online-converter-safe), ist für eine bestimmte Datei ebenso sehr eine Frage nach der Datei wie nach dem Werkzeug.

**Der Haken ist Ihr Nachmittag.** Der Skriptweg hat keinen Anbieter, kein Kontingent und keine Datenschutzfrage und ist trotzdem die teuerste Option hier. Freie Software ist keine freie Arbeitskraft, und ein Konverter, den Sie schreiben, ist einer, den Sie pflegen, wenn Notions Export das nächste Mal seine Form ändert.

## Was kein kostenloses Werkzeug zurückholt

Drei Dinge kommen überhaupt nicht aus Notion heraus, in keinem Format, auf keinem Weg, kein Konvertervergleich kann sie also reparieren.

**Kommentare.** Ein Kommentarstrang hängt als Diskussion an einer Seite, statt als Seiteninhalt gespeichert zu sein, und erreicht deshalb keines der Exportformate. Wenn eine Entscheidung nur als Antwort in einem Strang existiert, bewegen Sie sie vor dem Export in den Seitentext; danach ist sie weg statt bloß nicht konvertiert.

**Datenbankansichten jenseits der Standardansicht.** Notion exportiert die Ansicht, die Sie gerade sehen, oder die Standardansicht, nicht alle. Eine Datenbank, die für drei Zielgruppen dreifach gefiltert ist, exportiert als eine der drei; die anderen müssen aus den Zeilen neu aufgebaut werden.

**Synchronisierte Blöcke.** Ein synchronisierter Block ist ein Block, der an mehreren Stellen erscheint, und ein Export hat keine Möglichkeit, das auszudrücken: Jede Stelle bekommt ihre eigene Kopie, ohne Hinweis darauf, dass sie je verbunden waren.

Eine Datenbank kommt ebenso als Momentaufnahme von Zeilen an — eine Markdown-Tabelle hat keine Formeln, Relationen oder Rollups —, wenn diese Zahlen also berechnet statt getippt sind, prüfen Sie [die Tabelle, die herauskam](/blog/markdown-tables-that-survive-conversion), bevor Sie irgendetwas in Notion löschen.

## Wie Sie wählen

1. **Entscheiden Sie die Form der Ausgabe, bevor Sie irgendein Werkzeug ansehen.** Ein Dokument, ein Ordner mit Dateien und eigenen URLs, oder ein Vault. Jede Empfehlung hier folgt aus dieser Antwort, und sie erst nach dem Konvertieren zu treffen heißt, die Konvertierung zweimal zu machen.
2. **Zählen Sie, wie oft das passieren wird.** Einmal, und die Option ohne Einrichtung gewinnt allein über die Zeit — Export klicken, das Zip in einen Browser-Konverter werfen, in Minuten fertig. Wöchentlich oder bei jedem Deploy, und die Einrichtungskosten des API-Wegs amortisieren sich binnen eines Monats auf null.
3. **Fragen Sie, ob die Inhalte Ihren Rechner verlassen dürfen.** Ein Arbeitsbereich mit Gehältern, Einstellungsnotizen oder irgendetwas Unveröffentlichtem streicht gehostete Konverter von der Liste, bevor irgendein Funktionsvergleich beginnt, und übrig bleiben Konvertierung im Browser und lokale Kommandozeilenwerkzeuge.
4. **Prüfen Sie, was Sie gleich verlieren, solange Sie es noch sehen können.** Kommentare, zusätzliche Datenbankansichten und synchronisierte Blöcke fehlen in der Ausgabe, ohne dass ein Fehler darauf hinweist, die einzige verlässliche Prüfung ist also, vorher in die Quelle in Notion zu schauen.
5. **Zählen Sie die Seiten ehrlich.** Drei sind Kopieren und Einfügen. Dreißig sind ein Export und ein Konverter. Dreitausend sind ein API-Skript mit Wiederholungslogik und außerdem ein Export, den zu erzeugen Notion den größten Teil eines Tages kosten kann — beginnen Sie ihn also, bevor Sie ihn brauchen.

## Fazit

Es gibt hier keine kostenpflichtige Stufe zu vergleichen, was diesen Markt ungewöhnlich leicht zu überblicken und ungewöhnlich leicht falsch zu wählen macht. Die Optionen unterscheiden sich in der Form, nicht im Preis: Notions Export bekommt die Inhalte heraus und drückt Ihnen die IDs in die Hand; ein Browser-Konverter macht aus diesem Zip ein lesbares Dokument und lädt nichts hoch; ein Umschreibeskript hält Dateien zu Dateien, zum Preis Ihres Nachmittags; `notion-to-md` und Obsidian Importer lesen die API sauber, für Ketten beziehungsweise für Vaults; Pandoc konvertiert den reichhaltigeren HTML-Export lokal. Wählen Sie danach, wohin das Markdown geht und wie oft Sie das tun werden, testen Sie mit einer Seite, die eine Tabelle, ein Bild und einen Link auf eine andere Seite trägt, und denken Sie daran, dass die einzige Rechnung, die diese Werkzeuge schicken, in Zeit bezahlt wird.

## FAQ

### Gibt es einen wirklich kostenlosen Konverter von Notion nach Markdown, ohne Testphase und ohne Kontingent?

Ja, mehrere. Notions eigener Export nach Markdown & CSV ist kostenlos und eingebaut, ein Browser-Konverter, der den Export zusammenführt, läuft lokal ohne Limit pro Datei, und `notion-to-md`, Obsidian Importer und Pandoc sind alle kostenlose Open-Source-Software. Die Grenzen, denen Sie begegnen, sind Notions API-Ratenlimit und Ihre eigene Maschine, keine Preisseite.

### Was ist der schnellste kostenlose Weg, einen ganzen Notion-Arbeitsbereich zu konvertieren?

Exportieren Sie ihn einmal als Markdown & CSV und konvertieren Sie dann das Zip in einem Schritt statt Seite für Seite. Ein zusammenführender Browser-Konverter erzeugt ein einzelnes Dokument mit Inhaltsverzeichnis, ohne Umbenennen und ohne Skripten; müssen die Seiten separate Dateien bleiben, planen Sie stattdessen Zeit für das Umschreiben der IDs ein, denn das ist der Teil, den kein kostenloses Werkzeug automatisch für Sie erledigt.

### Warum haben meine exportierten Dateinamen lange zufällige Codes darin?

Das sind Seiten-IDs: 32 hexadezimale Zeichen, mit denen Notion eine Seite identifiziert, weil Titel sich ändern und nicht eindeutig sind. Der Export schreibt die ID in jeden Dateinamen und jeden Link zwischen Seiten, sie zu entfernen heißt also, beides gemeinsam aus einer Zuordnung umzuschreiben — oder die Seiten zu einem Dokument zusammenzuführen, wo nichts mehr auf einen Dateinamen auflösen muss.

### Kann ich einen Notion-Export konvertieren, ohne ihn irgendwohin hochzuladen?

Ja. Ein Konverter, der im Browser läuft, liest das Zip mit der eigenen Datei-API der Seite und sendet es nie, was Sie prüfen können, indem Sie das Netzwerkpanel öffnen und zusehen, wie nichts passiert. Lokale Kommandozeilenwerkzeuge wie Pandoc und der Zip-Modus von Obsidian Importer berühren das Netz überhaupt nicht.

### Verlangt die Konvertierung von Notion nach Markdown einen kostenpflichtigen Notion-Plan?

Nicht für den Export nach Markdown & CSV. Notions Hilfeseite sagt allerdings, dass „Include subpages" für einen **PDF**-Export einen Business- oder Enterprise-Plan verlangt (geprüft auf notion.com, 14. September 2026), prüfen Sie also das Format, das Sie brauchen, statt anzunehmen, dass sich das ganze Exportmenü gleich verhält.

### Soll ich als Markdown oder als HTML exportieren?

Das hängt davon ab, was danach passiert. Markdown ist der kürzere Weg, wenn Ihr Konverter es direkt nimmt. Obsidians Dokumentation empfiehlt stattdessen HTML, mit der Begründung, dass Notions Markdown-Export Informationen auslässt — wenn Ihnen Genauigkeit also mehr bedeutet als Bequemlichkeit, exportieren Sie HTML und konvertieren es mit Pandoc oder einem Importer, der es erwartet.

### Erhalten kostenlose Konverter meine Notion-Datenbanken?

Teilweise, und die Unterschiede zählen. Notions Markdown-Export schreibt jede ganzseitige Datenbank als CSV neben die Seiten; ein zusammenführender Browser-Konverter macht aus diesen Zeilen eine Tabelle im selben Dokument; Obsidian Importer erhält Datenbanken auf seinem API-Weg, nicht aber auf dem Zip-Weg. Keiner erhält Formeln, Relationen, Rollups oder irgendeine andere Ansicht als die exportierte.
