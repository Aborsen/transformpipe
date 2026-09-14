---
title: "Markdown zu HTML in VS Code: Vorschau, Export und Konvertieren beim Speichern"
description: "Die VS-Code-Vorschau läuft mit markdown-it, aber das Vorschau-Stylesheet ist nie das exportierte Stylesheet. Was jeder Export-Weg um das Fragment herum setzt."
date: 2026-08-25
tag: Konvertieren
keywords: markdown zu html vs code, vscode markdown vorschau, markdown nach html exportieren vscode, markdown.styles, vscode markdown export erweiterung, markdown beim speichern konvertieren, markdown all in one print to html
---

Die Datei ist schon offen. Sie drücken Strg+Umschalt+V, die Vorschau erscheint, und sie sieht aus wie die Seite, die Sie wollten — Überschriften sinnvoll dimensioniert, Code in einem Monospace-Block mit getöntem Hintergrund, Tabellen mit Rahmen. Also suchen Sie nach dem Export-Befehl, und es gibt keinen. VS Code stellt Markdown dar; es gibt Ihnen keine `.html`-Datei in die Hand.

Diese Lücke ist, wo die meisten Probleme in diesem Artikel leben. Die Vorschau ist eine Webview mit eigenem Stylesheet, gebaut zum Lesen einer Datei innerhalb des Editors. Jeder Weg, der eine tatsächliche HTML-Datei erzeugt — eine Erweiterung, ein Terminalbefehl, ein Task — trifft seine eigenen Entscheidungen darüber, was um das gerenderte Fragment herum kommt, und keiner davon erbt standardmäßig das Aussehen der Vorschau.

### Kurzfassung

VS Code hat keinen eingebauten Markdown-zu-HTML-Export. Die Vorschau läuft mit **markdown-it**, was Sie sehen ist also CommonMark plus das, was VS Code obendrauf hinzufügt, und ihr Aussehen kommt aus dem eigenen Vorschau-Stylesheet des Editors — was **nicht** das ist, was irgendein Exporteur in Ihre Datei setzt. Für eine `.html`-Datei installieren Sie entweder eine Erweiterung (Markdown All in One druckt nach HTML; Markdown PDF schreibt HTML, PDF, PNG oder JPEG; Markdown Preview Enhanced bietet einen Offline-HTML-Export, der seine Assets einbettet) oder führen einen Konverter aus dem integrierten Terminal aus und verdrahten ihn mit einem Task. Geht die Datei an eine Person statt in ein Repository, ist ein Konverter, der ein vollständiges, eigenständiges Dokument erzeugt, ein kürzerer Weg als den Editor dazu zu bringen, sich richtig zu verhalten.

## Was die eingebaute Vorschau tatsächlich ist

VS Codes Markdown-Vorschau ist eine Webview, die markdown-it ausführt, denselben CommonMark-konformen Parser, den mehrere andere Werkzeuge nutzen. Diese eine Tatsache erklärt das meiste davon, was die Vorschau darstellt und was nicht.

CommonMark gibt Ihnen Überschriften, Betonung, Listen, Blockzitate, eingezäunte Codeblöcke, Links und Bilder. markdown-its Standardkonfiguration fügt Tabellen und Durchgestrichenes hinzu, die also auch dargestellt werden. VS Code fügt obendrauf Task-Listen-Checkboxen hinzu, weshalb `- [x] erledigt` in der Vorschau eine angehakte Box zeigt und kein wörtliches Klammernpaar. Fußnoten sind weder in CommonMark noch in markdown-its Standardeinstellungen, `[^1]` erscheint also als wörtlicher Text, bis Sie eine Erweiterung installieren, die ein Plugin dafür beisteuert. Mermaid-Diagramme, PlantUML und Mathematik sind dieselbe Geschichte, außer dass Mathematik einen eigenen Schalter hat: `markdown.math.enabled`.

Das Verhalten, das Sie ohne Erweiterung ändern können, ist eine kurze Liste, und es lohnt sich, sie zu kennen, denn zwei dieser Einstellungen ändern das HTML statt nur das Aussehen:

| Einstellung | Standard | Was sie ändert |
| --- | --- | --- |
| `markdown.preview.breaks` | `false` | Ob ein einzelner Zeilenumbruch zu einem `<br>` wird |
| `markdown.preview.linkify` | `true` | Ob nackte URLs zu Links werden |
| `markdown.preview.typographer` | `false` | Typografische Anführungszeichen, Gedankenstriche und Auslassungspunkte |
| `markdown.math.enabled` | `true` | Mathematik-Darstellung in der Vorschau |
| `markdown.styles` | `[]` | Zusätzliche Stylesheets, geladen in die Vorschau |
| `markdown.preview.fontFamily` | Editor-Standard | Schriftart des Vorschau-Textkörpers |
| `markdown.preview.scrollPreviewWithEditor` | `true` | Scroll-Synchronisation, Editor zur Vorschau |
| `markdown.preview.scrollEditorWithPreview` | `true` | Scroll-Synchronisation, Vorschau zum Editor |

`breaks` und `linkify` sind die beiden, die über das Aussehen hinaus zählen. Schalten Sie `breaks` ein, und jeder weiche Zeilenumbruch in Ihrer Quelle wird ein `<br>` in der gerenderten Ausgabe, was die Struktur des Dokuments ändert und nicht nur seine Darstellung — dieselbe Quelle, zwei verschiedene Bäume. Haben Sie sich je gefragt, warum ein Werkzeug Ihre hart umgebrochenen Absätze respektiert und ein anderes sie zu einem Block zusammenfügt, ist diese Einstellung das ganze Argument, und ihr Standardwert unterscheidet sich zwischen Werkzeugen.

Zwei weitere Einstellungen gehören auf diese Liste, obwohl sie nichts an der Ausgabe ändern, denn sie fangen die Fehler, die eine Konvertierung dauerhaft macht. `markdown.validate.enabled` schaltet Link-Prüfung im Editor ein: ein relativer Link auf eine nicht existierende Datei, oder ein Überschriften-Anker, der zu keiner Überschrift passt, wird unterstrichen, wo Sie ihn noch reparieren können. `markdown.updateLinksOnFileMove.enabled` bietet an, Links umzuschreiben, wenn Sie eine Markdown-Datei im Explorer verschieben oder umbenennen. Beide lohnen sich, in einem Dokumentations-Repository eingeschaltet zu haben, denn ein kaputter relativer Link in der Quelle ist ein kaputter Link in jedem Format, in das Sie ihn konvertieren, und die Konvertierung meldet es nicht.

Die Befehle sind `Markdown: Open Preview` (Strg+Umschalt+V, Cmd+Umschalt+V unter macOS) und `Markdown: Open Preview to the Side` (Strg+K V). Es gibt einen dritten Befehl, den man sich merken sollte: `Markdown: Change preview security settings`, der steuert, ob die Vorschau entfernte Bilder lädt und ob sie Skripte ausführt. Die Vorschau ist eine Webview mit einer Content-Security-Policy, eine `.md`-Datei mit einem `<script>`-Tag darf es also standardmäßig nicht ausführen. Das ist eine Eigenschaft der Webview. Es ist keine Eigenschaft von irgendetwas, das Sie exportieren, und die beiden zu verwechseln ist, wie Leute enden, eine Seite zu veröffentlichen, die sie nie geprüft haben.

## Schnellvergleich: die Übersicht

| Weg | Was er erzeugt | Stile in der Ausgabe | Wo er läuft | Lizenz |
| --- | --- | --- | --- | --- |
| Eingebaute Vorschau | Nichts — nur eine gerenderte Ansicht | Editor-Vorschau-Stylesheet, nicht exportierbar | Webview im Editor | Kostenlos, MIT (VS-Code-Quelle) |
| Aus der Vorschau kopieren | Rich Text in der Zwischenablage | Was auch immer die Zielanwendung entscheidet | Editor | Kostenlos |
| Markdown All in One | `.html` neben der `.md` | Optional VS Codes eigene Vorschau-Stylesheets | Editor-Befehl | Kostenlos, MIT |
| Markdown PDF | `.html`, `.pdf`, `.png`, `.jpeg` | Eigener Standard plus `markdown-pdf.styles` | Editor, braucht einen Chromium-Browser | Kostenlos, MIT |
| Markdown Preview Enhanced | `.html` offline oder CDN-gehostet | Theme des eigenen Renderers | Editor-Befehl, eigene Vorschau | Kostenlos, NCSA-Lizenz |
| Pandoc im integrierten Terminal | Was auch immer Sie verlangen | Der Vorlage, oder keins | Terminal, braucht eine Installation | Kostenlos, GPL |
| Ein Konverter hinter `tasks.json` | Was auch immer der Konverter erzeugt | Die des Konverters | Task Runner | Hängt vom Konverter ab |
| Run-on-Save-Erweiterung | Löst eines der oberen aus | Nicht seine Sache | Bei jedem passenden Speichern | Kostenlos, Apache 2.0 |
| Ein browserseitiger Konverter | Eine eigenständige `.html` | Inline, in der Datei | Ein Browser-Tab | Kostenlos |

Lesen Sie diese Tabelle über die dritte Spalte. Der gewählte Weg ist meist eine Entscheidung darüber, welches CSS in der Datei landet, und es ist die Spalte, die niemand prüft, bis die Datei schon in jemandes Posteingang liegt. Jede in diesem Artikel genannte Lizenz, in dieser Spalte und darunter, ist eine kostenlose, quelloffene, aus dem eigenen Manifest des Projekts gelesen (geprüft im Repository jedes Projekts, 8. September 2026).

## Das Vorschau-Stylesheet ist nicht das exportierte Stylesheet

Das ist der Teil, der Leute überrascht, es lohnt sich also, es unumwunden zu sagen: Das Aussehen der VS-Code-Markdown-Vorschau wird von Stylesheets erzeugt, die zur Webview des Editors gehören. Sie sind nicht an Ihr Dokument angehängt. Sie werden nicht in irgendetwas geschrieben, das Sie exportieren. Ein Exporteur, der sie nicht absichtlich kopiert, erzeugt eine Datei, die mit den Browser-Standards rendert — Times New Roman in voller Fensterbreite, Überschriften, die nur größer sind, Codeblöcke, die sich nur dadurch unterscheiden, dass sie Monospace sind.

Die Schichtung innerhalb der Vorschau macht die Trennung deutlicher. Drei CSS-Quellen erreichen die Webview, in dieser Reihenfolge: zuerst VS Codes eingebaute Vorschau-Stile, dann alle Stylesheets, die Erweiterungen über den `markdown.previewStyles`-Contribution-Point beigesteuert haben, dann Ihre eigenen `markdown.styles`. Die dokumentierte Reihenfolge ist eingebaut, dann beigesteuert, dann Nutzer — weshalb Ihre `markdown.styles`-Regel über die einer Erweiterung gewinnt, und weshalb eine Erweiterung, die überschreibbar sein will, beisteuert statt einzuschleusen.

Keine dieser drei Schichten ist Teil der Konvertierung. Sie gestalten eine Ansicht des Dokuments. Die Konvertierung — Markdown-Text rein, HTML-Tags raus — passiert vor all diesen und weiß nichts von ihnen.

Es gibt eine zweite, leisere Version derselben Überraschung, und sie erwischt Entwickler eher als Schreiber. Erweiterungen können der Vorschau Syntax über den `markdown.markdownItPlugins`-Contribution-Point hinzufügen: Die Erweiterung gibt eine `extendMarkdownIt`-Funktion zurück, VS Code übergibt ihr die markdown-it-Instanz, und das Plugin ist wirksam. Das betrifft nur die Vorschau. Es betrifft nicht, wie das Dokument exportiert oder anderswo verarbeitet wird. Sie können also ein Fußnoten-Plugin installieren, Ihre Fußnoten schön dargestellt sehen, einen Export ausführen, und wörtliches `[^1]` in der Ausgabe bekommen — denn der Exporteur hat seinen eigenen Parser, seinen eigenen Plugin-Satz, und kein Wissen davon, was der Vorschau aufgetragen wurde.

Die praktische Regel, die daraus folgt: **Die Vorschau ist ein Lesewerkzeug, und der Export ist ein getrenntes Programm.** Verifizieren Sie den Export, indem Sie die exportierte Datei öffnen, in einem Browser, nicht im Editor. Alles, was Sie aus der Vorschau über die Datei schließen, die Sie gleich verschicken, ist eine Vermutung.

## Die Erweiterungen, die tatsächlich exportieren

Drei Erweiterungen decken fast das alles ab, und sie unterscheiden sich genau so, wie es die dritte Spalte der Übersicht andeutet — darin, was sie um das Fragment herum setzen.

### Aus der Vorschau kopieren — der Weg, den Leute zuerst probieren

Bevor sie irgendetwas installieren, wählen die meisten Menschen alles in der Vorschau aus, kopieren, und fügen es dort ein, wo der Inhalt gebraucht wird. Das funktioniert, im engen Sinne, dass die Zwischenablage Rich Text trägt und das Ziel es darstellt. Es lohnt sich zu wissen, was genau passiert, denn das Ergebnis ist weder die Vorschau noch eine HTML-Datei.

Die Zwischenablage bekommt eine HTML-Variante der Auswahl, und die empfangende Anwendung wendet dann ihre eigenen Regeln darauf an. Ein E-Mail-Client behält das Fette und die Listen und ersetzt seine eigene Schriftart. Ein Textverarbeitungsprogramm bildet die Überschriften auf seine eigenen Überschriftenstile ab, was oft genau das ist, was Sie wollten. Ein Content-Management-System entfernt das meiste und behält die Struktur. In jedem Fall gehört die Gestaltung dem Ziel, nicht VS Code, und per relativem Pfad referenzierte Bilder kommen meist gar nicht mit.

| Vorteile | Nachteile |
| --- | --- |
| Keine Installation, keine Konfiguration, keine zu verwaltende Datei | Sie bekommen Rich Text, keine Datei, die Sie verschicken oder servieren können |
| Überschriften und Listen überleben in die meisten Ziele | Relative Bilder überleben meist nicht |
| Gut genug, um einen Abschnitt in eine E-Mail einzufügen | Codeblöcke verlieren ihre Hervorhebung und manchmal ihre Monospace-Schrift |

**Für wen ist es geeignet?** Jeden, der ein paar Absätze in eine andere Anwendung schiebt. Es ist keine Konvertierung, und es als eine zu behandeln ist, wie eine Tabelle am anderen Ende als fünf Zeilen aus Pipes ankommt.

### Markdown All in One — der kürzeste Weg zu einer `.html`-Datei

Markdown All in One ist eine allgemeine Markdown-Erweiterung: Tastenkombinationen, Listenfortsetzung, ein Inhaltsverzeichnis, und ein HTML-Export. Der Export-Befehl ist `Markdown: Print current document to HTML`, mit `Markdown: Print documents to HTML` für einen Stapel. Sie schreibt die Datei neben die Quelle.

| Vorteile | Nachteile |
| --- | --- |
| Ein Befehl, kein Browser, keine Installation über die Erweiterung hinaus | Die Ausgabe lehnt sich an VS Codes eigene Vorschau-Stylesheets an |
| Kann das Aussehen der Editor-Vorschau absichtlich reproduzieren | Bilder sind verlinkt, nicht eingebettet, außer Sie schalten das ein |
| Stapelbefehl für einen Ordner voller Dateien | Kein Konverter, den Sie aus einem Build heraus aufrufen können |
| Export beim Speichern ist eine einzige Einstellung | Das HTML ist für eine Webview gestaltet, nicht für Druck oder E-Mail |

**Preis:** kostenlos, MIT-lizenziert.

Die Einstellungen sind der interessante Teil, denn sie sind die Entscheidungen, die der Exporteur für Sie trifft:

| Einstellung | Standard | Wirkung |
| --- | --- | --- |
| `markdown.extension.print.includeVscodeStylesheets` | `true` | Ob VS Codes eigenes Vorschau-CSS in die Datei kommt |
| `markdown.extension.print.imgToBase64` | `false` | Ob Bilder als Daten-URIs eingebettet werden |
| `markdown.extension.print.absoluteImgPath` | `true` | Ob relative Bildpfade zu absoluten umgeschrieben werden |
| `markdown.extension.print.theme` | `light` | Farbschema des exportierten HTML |
| `markdown.extension.print.onFileSave` | `false` | Bei jedem Speichern der `.md` neu exportieren |
| `markdown.extension.print.validateUrls` | `true` | Links während des Exports prüfen |

Zwei davon entscheiden, ob die Datei reist. `absoluteImgPath` schreibt in seinem Standardwert Ihre relativen Bildreferenzen zu absoluten Pfaden auf Ihrer Maschine um, was korrekt ist, solange die Datei dort bleibt, wo sie geschrieben wurde, und kaputt in dem Moment, in dem Sie sie jemandem schicken — sein Computer hat kein `C:\Users\sie\docs\diagramm.png`. `imgToBase64` auf `true` zu setzen bettet stattdessen die Bilder ein, was die Datei größer macht und überall funktionieren lässt. Was Sie davon wollen, hängt davon ab, wohin die Datei geht, und der Standard nimmt an, sie geht nirgendwohin.

**Für wen ist es geeignet?** Jemanden, der die Datei, die er ansieht, als HTML will, jetzt, und sich nicht sehr darum schert, was das CSS ist, solange es nicht nichts ist.

### Markdown PDF — eine Erweiterung, vier Ausgabeformate

Markdown PDF konvertiert das offene Dokument nach PDF, HTML, PNG oder JPEG. Es tut das, indem es einen Chromium-basierten Browser über Puppeteer steuert, entweder einen, auf den Sie zeigen, einen schon installierten, oder einen, den es herunterlädt und verwaltet.

| Vorteile | Nachteile |
| --- | --- |
| HTML und PDF aus einer Konfiguration | Braucht einen Chromium-Browser, heruntergeladen, wenn keiner gefunden wird |
| `markdown-pdf.styles` nimmt Ihre eigenen Stylesheets | Die Browser-Abhängigkeit ist schwer für einen reinen HTML-Job |
| Konvertieren beim Speichern eingebaut | Langsamer als ein Parser, weil es eine Seite rendert |
| Mehrere Formate in einem Lauf über `markdown-pdf.type` | Ausgabe-Gestaltung ist die der Erweiterung, bis Sie sie ersetzen |

**Preis:** kostenlos, MIT-lizenziert.

Die Einstellungen, die man kennen sollte: `markdown-pdf.type` nimmt das Ausgabeformat oder eine Liste davon; `markdown-pdf.convertOnSave` führt die Konvertierung bei jedem Speichern der Datei erneut aus; `markdown-pdf.styles` nimmt eine Liste lokaler Stylesheet-Pfade an. Weil ein echter Browser das Rendering übernimmt, ist der PDF-Pfad das Stärkste hier — Seitengröße, Ränder und Kopfzeilen sind Dinge, die ein Browser kann und ein Markdown-Parser nicht. Ist PDF das eigentliche Ziel statt ein Nebeneffekt, sind die Kompromisse ein eigenes Thema.

**Für wen ist es geeignet?** Jeden, der aus derselben Quelle sowohl PDF als auch HTML braucht und nichts dagegen hat, dass ein Browser heruntergeladen wird, um es zu tun.

### Markdown Preview Enhanced — die mit einem Offline-Export

Markdown Preview Enhanced ersetzt die eingebaute Vorschau durch eine eigene, die Mathematik, Mermaid und PlantUML rendert, und exportiert in mehrere Formate. Ihr HTML-Export ist der einzige der drei, der die Unterscheidung benennt, zu der dieser Artikel immer wieder zurückkehrt: Sie wählen zwischen **HTML (offline)** und **HTML (cdn hosted)**.

| Vorteile | Nachteile |
| --- | --- |
| Offline-Export bettet Assets ein, statt ein CDN zu verlinken | Es ist eine zweite Vorschau, mit eigenem Verhalten und eigenem Theme |
| Diagramme und Mathematik rendern ohne zusätzliche Plugins | Was Sie sehen, ist nicht mehr, was die eingebaute Vorschau zeigt |
| Frontmatter steuert den Export pro Dokument | Skriptausführung muss für manche Features aktiviert werden |
| Export beim Speichern wird im Dokument festgelegt, nicht in den Einstellungen | Die größte der drei Erweiterungen, vom Umfang her |

**Preis:** kostenlos, unter der University of Illinois/NCSA Open Source License.

Der Export wird im eigenen Frontmatter des Dokuments konfiguriert statt in Einstellungen, was eine wirklich gute Idee ist — das Dokument trägt seine eigenen Anweisungen. Die Schlüssel umfassen `offline`, `embed_local_images`, `embed_svg`, `print_background` und `toc`, und Export beim Speichern wird deklariert als:

```yaml
---
export_on_save:
  html: true
---
```

`embed_local_images` wandelt lokale Bilder in Base64 um, dieselbe Entscheidung, die `imgToBase64` in Markdown All in One trifft, und aus demselben Grund. Beachten Sie, dass die Inhaltsverzeichnis-Funktion `enableScriptExecution` verlangt, eingeschaltet in den Einstellungen der Erweiterung, denn sie muss ein Skript in der Vorschau ausführen.

**Für wen ist es geeignet?** Menschen, die Dokumente mit Diagrammen und Gleichungen schreiben, und wollen, dass der Export in der Datei beschrieben wird statt in den Einstellungen einer Maschine.

### Pandoc aus dem integrierten Terminal — überhaupt keine Erweiterung

Das integrierte Terminal ist Teil des Editors, einen Konverter darin auszuführen ist also immer noch, aus VS Code heraus zu konvertieren. Pandoc ist die übliche Wahl, und es erzeugt ein vollständiges Dokument, wenn Sie danach fragen:

```sh
pandoc README.md --standalone --embed-resources --output README.html
```

`--standalone` wickelt das Fragment in ein echtes Dokument mit Doctype und Head. `--embed-resources` zieht Bilder und Stylesheets in die Datei, damit sie mit ausgeschaltetem Netzwerk öffnet. Ohne diese zwei Flags gibt Ihnen Pandoc ein Fragment, was das korrekte Verhalten für eine Bibliothek ist und die falsche Datei zum Verschicken. Es gibt mehr darüber zu sagen, was das pro Lauf kostet und wo es in eine Pipeline gehört, und [die Kommandozeilen-Geschichte ist ein eigener Artikel](/blog/markdown-to-html-from-the-command-line).

**Für wen ist es geeignet?** Jeden, der Pandoc schon hat, oder wer will, dass die Konvertierung ein Befehl ist, den ein Build, ein Kollege oder ein CI-Runner auch ausführen kann.

## Eigenes CSS: markdown.styles, und was es erreicht

`markdown.styles` ist ein Array von Stylesheet-URLs, geladen in die Vorschau. Legen Sie in einem Workspace die Datei ins Repository und referenzieren Sie sie aus `.vscode/settings.json`:

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown.preview.breaks": false,
  "markdown.preview.typographer": true
}
```

Zwei Einschränkungen stolpern Leute. Erstens werden die Pfade relativ zum Workspace-Ordner aufgelöst; absolute Dateisystempfade werden nicht unterstützt, und `file://`-URIs sind nicht die Umgehung — es gibt offene Anfragen im VS-Code-Repository, die genau deshalb um absolute Pfade bitten, weil sie nicht funktionieren. Zweitens ist das aus einem Grund eine Workspace-Einstellung: Ein Stylesheet, das im Repository lebt, reist mit dem Repository, die Vorschau aller sieht also gleich aus. Es in Ihren Nutzereinstellungen zu setzen gestaltet jede Markdown-Datei, die Sie je öffnen, auch die von anderen Leuten, was selten gemeint ist.

Dann der wichtige Teil. `markdown.styles` erreicht die Vorschau und nichts sonst. Es erreicht nicht `Markdown: Print current document to HTML`, es erreicht nicht `markdown-pdf.styles`, und es erreicht nicht den Export von Markdown Preview Enhanced. Jedes davon hat seine eigene Stylesheet-Einstellung, und wollen Sie ein einheitliches Aussehen über Vorschau und Export hinweg, müssen Sie beide Einstellungen auf dieselbe Datei zeigen lassen:

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown-pdf.styles": ["docs/preview.css"]
}
```

Das funktioniert, mit einem Vorbehalt, den man prüfen sollte, bevor man sich darauf verlässt: Das eingebaute Stylesheet der Vorschau liegt in der Webview immer noch unter Ihrem und fehlt im Export, ein Stylesheet, geschrieben als Satz von Überschreibungen über VS Codes Standards, erzeugt also eine deutlich schlichtere Datei, wenn diese Standards nicht da sind. Wollen Sie, dass beide übereinstimmen, schreiben Sie das Stylesheet als vollständiges Stylesheet — Schriftart des Textkörpers, Abstände, Tabellenrahmen, Codeblock-Hintergrund — statt als Patch.

Dieselbe Logik gilt für Syntaxhervorhebung. Die Vorschau hebt Codeblöcke mit der eigenen Maschinerie des Editors hervor, und der Export erbt das nicht. Ein Exporteur, der hervorhebt, tut das mit einem eigenen Theme und eigenen Klassennamen, und einer, der es nicht tut, gibt Ihnen ein einfaches `<pre><code>` mit einer Sprachklasse und nichts, was es einfärbt. Was Hervorhebung auf der Seite tatsächlich braucht, ist ein Stylesheet, und manchmal ein Skript, keines von beidem erscheint per Magie.

## Beim Speichern konvertieren mit einem tasks.json-Eintrag

Passiert die Konvertierung öfter als zweimal, legen Sie sie ins Repository statt in Ihre Finger. Ein Task macht den Befehl zu einer Eigenschaft des Projekts:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "md nach html",
      "type": "shell",
      "command": "pandoc",
      "args": [
        "${file}",
        "--standalone",
        "--embed-resources",
        "--output",
        "${fileDirname}/${fileBasenameNoExtension}.html"
      ],
      "problemMatcher": [],
      "presentation": { "reveal": "silent" },
      "group": { "kind": "build", "isDefault": true }
    }
  ]
}
```

Ihn als Standard-Build-Task zu markieren, wie es die `group`-Eigenschaft oben tut, bedeutet, dass Strg+Umschalt+B ihn ohne Auswahlmenü ausführt — eine Kleinigkeit, die entscheidet, ob der Task genutzt wird. `presentation.reveal` auf `silent` gesetzt hält das Terminal-Panel davon ab, bei jedem Lauf den Fokus zu übernehmen, was zählt, wenn der Lauf Dutzende Male am Tag passiert.

`${file}` ist die Datei im aktiven Editor, `${fileDirname}` ihr Ordner, und `${fileBasenameNoExtension}` ihr Name ohne die Endung, der Task konvertiert also, was auch immer Sie gerade ansehen, und schreibt das Ergebnis daneben. `"problemMatcher": []` sagt VS Code, die Ausgabe nicht nach Compiler-Fehlern zu durchsuchen, was sonst bei jedem Lauf einen Prompt erzeugt.

Jetzt der ehrliche Teil, denn hier hören die Tutorials auf und die Nutzer fangen an zu suchen. **`tasks.json` kann keinen Task beim Speichern einer Datei ausführen.** Die `runOptions.runOn`-Eigenschaft akzeptiert zwei Werte: `default`, was bedeutet, der Task läuft, wenn Sie ihn aufrufen, und `folderOpen`, was bedeutet, er läuft, wenn der enthaltende Ordner geöffnet wird. Es gibt kein `onSave`. Drei Umgehungen existieren, und sie unterscheiden sich wirklich in ihren Kosten.

**Den Task an eine Taste binden.** Die billigste Option, und sie hält den Auslöser explizit. In `keybindings.json`:

```json
{
  "key": "ctrl+alt+h",
  "command": "workbench.action.tasks.runTask",
  "args": "md nach html"
}
```

Ein Tastendruck, keine zusätzliche Erweiterung, und die Konvertierung passiert, wenn Sie entscheiden, dass sie sollte. Für eine Datei, die Sie ein paar Mal am Tag exportieren, ist das die richtige Antwort, und dass es manuell ist, ist ein Feature — Sie schreiben nicht bei jedem Speichern eines halbfertigen Satzes HTML-Dateien.

**Die eigene Speicher-Einstellung des Exporteurs nutzen.** Markdown All in One hat `markdown.extension.print.onFileSave`, Markdown PDF hat `markdown-pdf.convertOnSave`, und Markdown Preview Enhanced liest `export_on_save` aus dem Frontmatter des Dokuments. Von den dreien ist die Frontmatter-Version am besten durchdacht: Sie ist pro Dokument, sie ist in der Versionskontrolle, und eine Datei, die nicht exportiert werden soll, fragt einfach nicht danach.

**Eine File-Watcher-Erweiterung nutzen.** Die Run-on-Save-Erweiterung ist die übliche Wahl. Ihre Konfiguration ist eine Liste regulärer Ausdrücke, gepaart mit Befehlen, unter `emeraldwalk.runonsave` in den Einstellungen:

```json
{
  "emeraldwalk.runonsave": {
    "commands": [
      {
        "match": "\\.md$",
        "cmd": "pandoc \"${file}\" --standalone --embed-resources --output \"${fileDirname}/${fileBasenameNoExt}.html\""
      }
    ]
  }
}
```

Sie ist Apache-2.0-lizenziert und ersetzt ihre eigenen Platzhalter — `${file}`, `${fileDirname}`, `${fileBasenameNoExt}`, `${workspaceFolder}` und ein paar mehr —, die VS Codes Task-Variablen nah genug sind, um verwirrend zu sein. `${fileBasenameNoExt}` hier, `${fileBasenameNoExtension}` in `tasks.json`. Den einen in den anderen zu kopieren erzeugt still eine Datei namens `${fileBasenameNoExtension}.html`.

Die vierte Option ist, den Auslöser des Editors ganz zu überspringen und das Repository ihn besitzen zu lassen: ein Watch-Skript in `package.json`, oder ein Workflow, der bei jedem Push konvertiert, damit das Artefakt für alle vom selben Befehl gebaut wird. Aus einem Pull Request zu veröffentlichen entfernt die Frage, wessen Maschine die richtige Erweiterung installiert hat, was der Fehlermodus jeder Einstellung in diesem Artikel ist.

## Wo der Weg im Editor scheitert, und was es kostet

Im Editor zu konvertieren ist schnell und lokal, und es hat vier Kosten, die erst später auftauchen.

### Die Konfiguration ist pro Maschine, nicht pro Repository

Jede Erweiterungseinstellung in diesem Artikel lebt in einer Einstellungsdatei, und nur die Workspace-Einstellungen reisen mit. `.vscode/settings.json` ist committbar, `markdown.styles`, `markdown-pdf.styles` und `markdown.extension.print.imgToBase64` können also Repository-Eigenschaften sein. Die Erweiterungen selbst können es nicht. Sie können sie in `.vscode/extensions.json` als Empfehlungen auflisten, und eine Empfehlung ist ein Prompt, den jemand ablehnen kann. Ein Kollege, der denselben Export mit einer anderen installierten Erweiterung ausführt, erzeugt eine andere Datei, und nichts im Repository hält fest, welche richtig war.

Das ist der Unterschied zwischen einer Konvertierung und einer Gewohnheit. Ein Befehl in einem Skript ist überprüfbar, diffbar und wiederholbar; eine Abfolge von Tastenanschlägen in jemandes Editor ist keines davon, und das erste Zeichen von Ärger ist meist ein Dokument, das für eine Person falsch und für eine andere in Ordnung aussieht. Zählt die Ausgabe für mehr als eine Person, muss die Konvertierung irgendwo aufgeschrieben sein, das keine Einstellungsdatei auf einem Laptop ist.

### Eine Datei nach der anderen, meistens

Markdown All in One hat einen Stapel-Druckbefehl; der Rest ist um den aktiven Editor herum gebaut. Ist die Aufgabe ein Ordner voller Dokumente, oder ein aus vielen zusammengesetztes Dokument, ist der Editor die falsche Form dafür — erst zusammenzuführen und dann einmal zu konvertieren ist eine andere Operation mit einem anderen Ergebnis, und kein Export-Befehl in einem Texteditor wird das tun.

### Nichts in dieser Pipeline bereinigt

Markdown erlaubt rohes HTML, eine `.md`-Datei kann also `<script>`, `onerror=` und `javascript:`-URLs enthalten. Die eingebaute Vorschau rendert rohes HTML und verlässt sich auf die Content-Security-Policy der Webview, um Skripte am Laufen zu hindern, was Sie beim Lesen schützt. Eine exportierte HTML-Datei hat keine Webview und keine solche Policy: Was auch immer rohes HTML in der Quelle war, ist jetzt in einer Datei, die ein Browser ausführen wird. Für Ihre eigenen Notizen ist das irrelevant. Für eine README, die Sie aus einem Repository gezogen haben, oder ein Dokument, das ein Kunde geschickt hat, [ist es die ganze Frage](/blog/sanitising-markdown-safely), und keine dieser Erweiterungen bewirbt Bereinigung als Schritt.

### Die Chromium-Abhängigkeit ist echt

Der Browser-Download von Markdown PDF ist eine einmalige Unannehmlichkeit auf einem Laptop und ein echtes Problem in CI, wo ein Headless-Runner einen Browser holen und cachen muss, um eine Datei zu erzeugen, die ein Parser in Millisekunden hätte erzeugen können. Brauchen Sie nur HTML, ist ein Browser ein schwerer Weg, es zu bekommen.

### Wenn die Datei einen Leser hat

Die Kosten oben sind alle erträglich, wenn die Ausgabe in ein Repository, einen Build oder ein Vorschau-Panel geht. Sie hören auf, erträglich zu sein, wenn die Ausgabe an eine Person geht, denn dann muss die Datei überleben, Ihre Maschine zu verlassen — sie muss ihre Stile tragen, ihre Bilder auflösen, und korrekt auf einem Computer öffnen, der keine Ihrer Einstellungen hat und keine Ahnung, was eine Webview ist.

Das ist eine spezifische technische Eigenschaft: eine vollständige, eigenständige HTML-Datei, Stile inline, keine externen Anfragen. Manche Exporteure lassen sich dazu konfigurieren, so eine zu erzeugen; die meisten erzeugen etwas zwischen einem Fragment und einem Dokument, und Sie finden heraus, was, indem Sie es sich selbst mailen. Ein Konverter, der für dieses Ergebnis gebaut ist, beginnt stattdessen dort. TransformPipe konvertiert Markdown im Browser zu einer einzigen eigenständigen HTML-Datei, ohne dass etwas hochgeladen wird, wenn Sie abgemeldet sind, was bedeutet, dass die Prüfung, die zählt — sie woanders öffnen, mit ausgeschaltetem Netzwerk — durch Konstruktion besteht statt durch Konfiguration. [Was ein Dokument, das Sie jemandem in die Hand geben, leisten muss](/blog/share-a-markdown-document-as-a-link), ist eine kürzere Liste als das, was der Build eines Repositorys leisten muss, und der Editor ist auf Letzteres optimiert.

## So wählen Sie, in fünf Fragen

1. **Ist die Ausgabe für einen Leser oder für ein Repository?** Ein Leser braucht eine eigenständige Datei, die Stile und Bilder müssen also darin sein; ein Repository braucht einen reproduzierbaren Befehl, der also in der Versionskontrolle leben muss statt in den Erweiterungseinstellungen von jemandem.
2. **Trägt der Exporteur Stile in die Datei?** Tut er es nicht, bekommen Sie Browser-Standards, und ein Dokument in der Standardbreite des Browsers ohne Tabellenrahmen liest sich als kaputt, obwohl das HTML korrekt ist.
3. **Gibt es Bilder?** Relative Pfade brechen, wenn die Datei sich bewegt, und absolute Pfade brechen in dem Moment, in dem sie Ihre Maschine verlässt, außer die Bilder sind als Daten-URIs eingebettet, funktioniert die Datei also nur dort, wo sie geschrieben wurde.
4. **Muss irgendetwas das ohne Sie ausführen?** Ist die Antwort ja, gehört die Konvertierung in einen Befehl, den ein Task, ein Skript oder ein CI-Job aufrufen kann, denn ein Editor-Befehl ist eine Person, die eine Taste drückt, und eine Person ist um 3 Uhr morgens nicht verfügbar.
5. **Haben Sie alles in der Datei selbst geschrieben?** Wenn nicht, muss etwas das rohe HTML bereinigen, bevor die Ausgabe einen Browser erreicht, denn kein Teil des Editor-Wegs erledigt das für Sie.

## Fazit

Markdown zu HTML in VS Code zu konvertieren funktioniert gut für genau den Fall, für den es gebaut wurde: eine Datei, die Sie schon bearbeiten, ein Export, den Sie sich gleich selbst ansehen, auf einer Maschine, die Sie konfiguriert haben. Darüber hinaus sind die zwei Dinge, die Leute vom Editor erwarten — das Aussehen der Vorschau in der exportierten Datei zu reproduzieren, und die Konvertierung automatisch beim Speichern auszuführen — beides Dinge, die er nicht tut, und beides nur zu beheben, indem man eine Erweiterung wählt und ihre Einstellungen sorgfältig liest. Brauchen Sie eine HTML-Datei, die auf dem Computer einer anderen Person korrekt öffnet, ist [Markdown mit einem browserseitigen Konverter zu HTML zu konvertieren](/) weniger Entscheidungen, als drei Erweiterungen zur Übereinstimmung zu bringen, und [der breitere Vergleich der Konverter](/blog/best-markdown-to-html-converters) behandelt die Bibliotheken und Kommandozeilenwerkzeuge, die es sich lohnt, stattdessen in einen Build einzubauen.

## FAQ

### Hat VS Code einen eingebauten Markdown-zu-HTML-Export?

Nein. VS Code liefert eine Markdown-Vorschau und keinen Export-Befehl, eine `.html`-Datei zu erzeugen braucht also entweder eine Erweiterung oder einen aus dem integrierten Terminal ausgeführten Konverter. Der Zweck der Vorschau ist, die Datei im Editor zu lesen, nicht ein auslieferbares Ergebnis zu erzeugen.

### Warum sieht mein exportiertes HTML ganz anders aus als die Vorschau?

Weil das Aussehen der Vorschau aus VS Codes eigenen Webview-Stylesheets kommt, die nicht Teil Ihres Dokuments sind und in keinen Export geschrieben werden. Kopiert der Exporteur sie nicht absichtlich — Markdown All in One hat genau dafür eine Einstellung — rendert die exportierte Datei mit den Browser-Standards.

### Wie nutze ich mein eigenes CSS in der VS-Code-Markdown-Vorschau?

Fügen Sie das Stylesheet zu `markdown.styles` in `.vscode/settings.json` hinzu, mit einem Pfad relativ zum Workspace-Ordner. Absolute Dateisystempfade werden nicht unterstützt, und die Einstellung betrifft nur die Vorschau — für den Export müssen Sie auch die eigene Stil-Option der exportierenden Erweiterung setzen.

### Kann VS Code Markdown jedes Mal beim Speichern zu HTML konvertieren?

Nicht über `tasks.json`, dessen `runOptions.runOn` nur `default` und `folderOpen` akzeptiert. Nutzen Sie die eigene Speicher-Einstellung eines Exporteurs, etwa `markdown.extension.print.onFileSave` oder `markdown-pdf.convertOnSave`, oder eine File-Watcher-Erweiterung, die bei passenden Speichervorgängen einen Befehl ausführt.

### Warum werden meine Fußnoten in der Vorschau dargestellt, aber nicht im Export?

Weil von Erweiterungen beigesteuerte markdown-it-Plugins nur auf die Vorschau angewendet werden und keine Wirkung darauf haben, wie das Dokument exportiert wird. Der Exporteur hat seinen eigenen Parser und seinen eigenen Plugin-Satz, eine Syntax, die die Vorschau versteht, kann also als wörtlicher Text in der Datei landen.

### Rendert die Vorschau GitHub Flavored Markdown?

Größtenteils, in der Praxis: markdown-it behandelt Tabellen und Durchgestrichenes, VS Code fügt Task-Listen-Checkboxen hinzu, und nackte URLs werden zu Links, weil `markdown.preview.linkify` standardmäßig an ist. Es ist keine Garantie für GitHubs exakte Ausgabe, und [die Unterschiede zwischen den Dialekten zu kennen](/blog/commonmark-gfm-and-the-flavours), lohnt sich, bevor Sie annehmen, eine Datei rendert an beiden Orten gleich.

### Welcher Weg gibt mir eine einzelne Datei ohne externe Anfragen?

Der `HTML (offline)`-Export von Markdown Preview Enhanced und Pandocs `--standalone --embed-resources` zielen beide darauf ab, ebenso jeder Konverter, dessen erklärte Ausgabe ein eigenständiges Dokument ist. Testen Sie es auf die einzige Weise, die etwas beweist: Öffnen Sie die Datei auf einer anderen Maschine mit ausgeschaltetem Netzwerk.
