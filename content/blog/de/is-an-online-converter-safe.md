---
title: "Ist ein Online-Markdown-Konverter sicher? Prüfen statt vertrauen"
description: "Ob ein Online-Konverter sicher ist, hängt von vier prüfbaren Dingen ab: Upload, Aufbewahrungsdauer, wer mitliest, und was die Bedingungen behaupten"
date: 2026-08-16
tag: Sicherheit
keywords: ist markdown konverter sicher, online konverter datenschutz, laedt ein online konverter meine datei hoch, dokumentkonverter aufbewahrungsfrist, dokumente konvertieren ohne hochladen, online konverter nutzungsbedingungen, browserbasierter konverter
---

Niemand liest die Datenschutzerklärung eines Dateikonverters. Das Dokument ist offen, die Frist ist jetzt, die Seite sagt kostenlos und keine Anmeldung, und dreißig Sekunden später liegt eine HTML-Datei im Download-Ordner und keine Erinnerung daran, eine Entscheidung getroffen zu haben. Eine Entscheidung wurde trotzdem getroffen: darüber, ob dieses Dokument das Gebäude verlassen hat, wer jetzt eine Kopie davon besitzt, für wie lange, und unter welcher Lizenz.

### Kurzfassung

Ein Konverter ist für ein bestimmtes Dokument sicher, wenn Sie vier Fragen dazu beantworten können — ob die Datei überhaupt hochgeladen wird, wie lange eine Kopie aufbewahrt wird, wer sonst noch im Pfad liegt, und ob die Ausgabe bereinigt ist. Drei davon sind in etwa fünf Minuten in einem Browser beobachtbar: Netzwerktab öffnen, eine Testdatei konvertieren und beobachten, was das Gerät verlässt; dann die Bedingungen nach einer Lizenzklausel durchsuchen statt nach der Datenschutz-Überschrift. Browserseitige Konvertierung lädt nichts hoch und lässt sich verifizieren, indem man das Netzwerk abschaltet, serverseitige Konvertierung muss Ihren Klartext lesen, um die Arbeit überhaupt zu erledigen, und ein Offline-Werkzeug braucht kein Netzwerk, kostet Sie aber eine Installation und eine Lieferkette. Bei Verträgen, Patientennotizen, Zugangsdaten, unangekündigten Finanzdaten und allem, was unter einer Vereinbarung liegt, die zulässige Unterauftragsverarbeiter benennt, ist ein Upload kein abzuwägendes Risiko — es ist eine Offenlegung.

„Ist es sicher" ist die falsche Form der Frage, denn Sicherheit ist keine Eigenschaft, die ein Konverter hat. Was ein Konverter hat, ist eine Menge von Verhaltensweisen, von denen Sie die meisten beobachten können, und eine Menge von Versprechen, die alle lesbar sind. Beides sind unterschiedliche Arten von Beweis, und sie scheitern auf unterschiedliche Weise: Verhalten kann sich beim nächsten Deploy ändern, und ein Versprechen kann wahr sein und trotzdem nicht das abdecken, was Sie interessiert.

Die Reibung ist, dass das Prüfen fünf Minuten braucht und die Konvertierung dreißig Sekunden, das Prüfen passiert also nie. Es fühlt sich auch nach Paranoia an, bis zu dem einen Mal, an dem es das nicht ist — die Release-Notiz, die einen unangekündigten Kunden nennt, der Postmortem-Bericht mit den internen Hostnamen darin, das README, dessen Konfigurationsbeispiel noch ein lebendes Token enthält. Das sind gewöhnliche Dateien. Sie laufen jeden Tag durch gewöhnliche Konverter.

Was folgt, ist die kürzeste ehrliche Version: was die Phrase „Online-Konverter" auslässt, wie man es herausfindet statt zu raten, wofür die drei Konverterarten tatsächlich gut sind, und die konkreten Dokumente, bei denen ein Upload überhaupt kein Kompromiss ist.

## Was Leute prüfen, und was sie prüfen sollten

Beobachten Sie jemanden bei der Wahl eines Konverters, sehen Sie ihn vier Dinge bewerten, von denen keines mit der Frage zu tun hat.

**Das Vorhängeschloss.** HTTPS ist eine Aussage über die Übertragung. Es besagt, dass die Bytes zwischen Ihrem Browser und diesem Server verschlüsselt wurden, und es sagt nichts darüber, ob die Bytes hätten gesendet werden sollen, was der Server damit gemacht hat, wie lange er sie behalten hat, oder an wen er sie weitergegeben hat. Jeder gehostete Konverter, der Ihre Datei hochlädt, lädt sie über HTTPS hoch. Genauso jeder, der sie für immer behält.

**Wie professionell die Website aussieht.** Designqualität korreliert mit Budget, nicht mit Datenumgang. Ein aufgeräumter Drag-and-Drop-Bereich mit Fortschrittsanimation ist ein Frontend; der interessante Teil ist die Anfrage dahinter. Umgekehrt kann eine schlichte Seite ohne Styling die ganze Arbeit lokal erledigen.

**„Keine Anmeldung erforderlich."** Das heißt, es gibt kein Konto. Es heißt nicht, dass es keinen Upload gibt. Die beiden werden ständig verwechselt, denn sich anzumelden fühlt sich wie der Moment an, in dem man etwas übergibt, und bis dahin ist die Datei meist schon weg.

**Eine Nutzungsbehauptung.** Beliebtheit ist keine Kontrolle. Ein von sehr vielen Menschen genutzter Dienst hat eine größere Vorfallsfläche, nicht eine kleinere, und die Zahl auf der Startseite sagt nichts über Aufbewahrung, Unterauftragsverarbeiter oder das, was die Bedingungen über Ihren Inhalt sagen.

Die vier Fragen, die tatsächlich zählen, sind langweiliger und beantwortbar:

1. Wird die Datei überhaupt hochgeladen?
2. Wenn ja, wie lange wird eine Kopie aufbewahrt, und wo?
3. Wer sonst kann sie lesen — Mitarbeiter, Unterauftragsverarbeiter, jeder mit einem Ergebnislink?
4. Ist die Ausgabe bereinigt, oder trägt sie, was auch immer in der Eingabe stand, direkt in einen Browser?

Die vierte ist die, die niemand stellt. Die ersten drei betreffen die Vertraulichkeit Ihres Dokuments. Die vierte betrifft, ob die Datei, die Sie zurückbekommen, der Person schaden kann, an die Sie sie schicken, und sie gilt genauso für einen Konverter, der vollständig auf Ihrer eigenen Maschine läuft.

## Fünf Dinge, die „Online-Konverter" verbirgt

Die Phrase leistet eine Menge Arbeit. Sie ist dazu gekommen, „läuft auf dem Server von jemandem" zu bedeuten, aber ein Browser ist eine Laufzeitumgebung wie jede andere, und ein Konverter, der geschrieben wurde, um darin zu laufen, erledigt die Arbeit auf Ihrer Maschine und lädt nichts hoch. Beide sind im Sinne von „online" online, dass Sie sie über eine URL erreicht haben. Nur einer davon ist online im Sinne, wie Leute es meinen.

Hier ist, was die Phrase verbirgt, und wie man an jedes Einzelne herankommt.

| Was verborgen ist | Wie Sie es prüfen | Wie eine schlechte Antwort aussieht |
| --- | --- | --- |
| Ob die Datei hochgeladen wird | Netzwerktab offen, eine Testdatei konvertieren, auf eine ausgehende Anfrage mit der Größe Ihrer Datei achten | Ein `POST` mit `multipart/form-data`, oder die Seite scheitert bei ausgeschaltetem Netzwerk am Konvertieren |
| Wie lange eine Kopie aufbewahrt wird | Die Datenschutzerklärung nach einer Dauer durchsuchen — Stunden, Tage, „bis Sie es löschen" | Beruhigung ohne Zahl darin: „wir nehmen Ihre Privatsphäre ernst" |
| Wer sonst sie lesen kann | Die Liste der Unterauftragsverarbeiter, die Region, ob Ergebnisse als erratbarer Link ausgeliefert werden | Gar keine Liste, oder eine Ergebnis-URL, die Sie ohne jede Anmeldeinformation teilen können |
| Was die Bedingungen über Ihren Inhalt behaupten | Die Bedingungen nach Lizenz, gebührenfrei, unterlizenzierbar, unbefristet, abgeleitete Werke durchsuchen | Eine weite Inhaltslizenz ohne Zweckbindung und ohne Ablauf |
| Ob die Ausgabe bereinigt ist | Ein Dokument mit einem Script-Tag konvertieren und das zurückkommende HTML lesen | `<script>`, `onerror=` oder `javascript:` noch in der Ausgabe vorhanden |

Zwei davon verdienen es, jetzt genauer betrachtet zu werden, denn dort richtet die Formulierung den meisten Schaden an.

**„Wir speichern Ihre Dateien nicht" ist nicht „wir erhalten Ihre Dateien nicht."** Eine Aussage über Speicherung ist eine Aussage darüber, was nach dem Upload passiert. Sie gesteht den Upload zu. Es ist auch der häufigste Satz auf der Startseite eines Konverters, und er ist meist wahr — die Datei wird nach der Verarbeitung tatsächlich gelöscht —, was genau der Grund ist, warum er als Ersatz für die stärkere Behauptung funktioniert, der er ähnelt. Wollen Sie die stärkere Behauptung, ist die Formulierung, nach der Sie suchen, eine über Übertragung: Die Datei wird nicht gesendet, die Konvertierung passiert in Ihrem Browser, nichts verlässt Ihre Maschine.

**Ein serverseitiger Konverter kann nicht Ende-zu-Ende-verschlüsselt sein.** Das folgt aus der Arbeit, die er erledigt. Um Markdown in HTML zu verwandeln, muss der Konverter das Markdown parsen, was heißt, er muss den Klartext haben, was heißt, die Verschlüsselung endet an seinem Server, nicht am anderen Ende. TLS schützt die Reise. Es kann das Ziel nicht davor schützen, zu lesen, was ankam, denn zu lesen, was ankam, ist der Dienst. Jeder Konverter, der mit Ende-zu-Ende-Verschlüsselung wirbt, während er serverseitig konvertiert, nutzt die Formulierung entweder locker oder weiß nicht, was sie bedeutet, und beides sind Gründe, den Rest der Seite langsamer zu lesen.

## Kurzvergleich: die Übersichtstabelle

Es gibt drei ehrliche Positionen, die ein Konverter einnehmen kann. Alles andere ist Marketing obendrauf.

| Art | Wo die Datei gelesen wird | Was aufbewahrt werden kann | Wer sonst im Pfad liegt | Was die Bedingungen behaupten können | Richtig für | Falsch für |
| --- | --- | --- | --- | --- | --- | --- |
| Browserseitig | Ihre eigene Maschine, durch JavaScript, das die Seite schon geladen hat | Nichts — es gibt keine Kopie zu behalten | Wer auch immer sonst ein Skript auf dieser Seite hat | Nichts über Inhalt, den es nie erhält | Alles, was nicht schon öffentlich ist; schnelle Einmalkonvertierungen; verifikationsorientierte Arbeit | Sehr große Dateien; Formate, die ein Browser nicht parsen kann; unbeaufsichtigte Stapel |
| Serverseitig | Die Maschine des Anbieters, in einer von ihm gewählten Region | Der Upload, die Ausgabe, Logs und jeder Ergebnislink | Der Anbieter, sein Hosting, seine Unterauftragsverarbeiter, jeder mit dem Link | Eine Lizenz, Ihren Inhalt zu hosten, zu kopieren und zu verarbeiten | Exotische Formate; schwere Konvertierungen; API-gesteuerte Pipelines; öffentliche Dokumente | Verträge, Gesundheitsdaten, Zugangsdaten, alles unter einer NDA, die Unterauftragsverarbeiter benennt |
| Offline | Ihre eigene Maschine, durch installierte Software | Was auch immer das Werkzeug auf die Platte schreibt, unter Ihrer Kontrolle | Niemand, einmal installiert — aber die Installation hat eine Lieferkette | Nichts; eine Lizenz regelt die Software, nicht Ihre Dateien | Regulierte Arbeit; wiederholbare Pipelines; abgeschottete Umgebungen; Massenaufträge | Einmalkonvertierungen, bei denen eine Installation absurd ist; Maschinen, auf denen Sie nichts installieren können |

Die Zeile, die Leute überrascht, ist die dritte Spalte der ersten Zeile. Browserseitige Konvertierung hat keine Aufbewahrungsrichtlinie, nicht weil der Anbieter großzügig ist, sondern weil es nichts gibt, worüber eine Richtlinie existieren könnte. Das ist eine andere Kategorie von Antwort als „gelöscht nach vierundzwanzig Stunden", und es ist die einzige, die nicht davon abhängt, dass jemand ein Versprechen über eine Kopie hält, die er besitzt.

Die Zeile, die Leute in die andere Richtung überrascht, ist die letzte Spalte der dritten Zeile. Ein Offline-Werkzeug ist nicht automatisch die sicherste Wahl, denn Software zu installieren ist selbst eine Vertrauensentscheidung, und ein von Ihnen installierter Konverter läuft mit dem Zugriff Ihres Benutzerkontos auf jede Datei, die Sie besitzen. Der vermiedene Upload ist eine engere Exposition als das hinzugefügte Paket.

## Wie man prüft statt vertraut

All das ist prüfbar. Nichts davon braucht spezielles Werkzeug — ein Browser und zehn Minuten klären einen Konverter, auf den Sie sich gleich verlassen wollen, und dieselben zehn Minuten klären es fürs ganze Team.

### Der Netzwerktab

Öffnen Sie die Entwicklertools, bevor Sie irgendetwas konvertieren, nicht danach. In Chrome, Edge oder Firefox ist das F12; das Panel, das Sie wollen, ist Network. Laden Sie die Seite bei geöffnetem Panel neu, damit Sie auch das Laden der Seite erfassen, dann konvertieren Sie eine Datei und beobachten.

Wonach Sie suchen, ist eine Anfrage, die in dem Moment erscheint, in dem Sie konvertieren, mit einem Anfragekörper etwa in der Größe Ihres Dokuments. Filtern Sie auf `Fetch/XHR`, um Rauschen zu entfernen. Sortieren Sie nach Größe, wenn die Liste lang ist.

```
# Eine browserseitige Konvertierung, nachdem die Seite fertig geladen hat
(keine neuen Zeilen erscheinen, wenn Sie auf Konvertieren drücken)

# Ein Upload, im selben Panel
POST  /api/convert   xhr   multipart/form-data   1.4 MB   312 ms
GET   /api/result/8f3c1e   xhr   application/json   2.1 kB
```

Zwei Verfeinerungen machen daraus einen viel besseren Test.

Erstens: Schalten Sie das Netzwerk aus und versuchen Sie es erneut. Laden Sie den Konverter, dann trennen Sie die Verbindung — Flugmodus, oder das Offline-Kästchen im Network-Panel — und konvertieren Sie. Ein browserseitiger Konverter funktioniert weiter, denn der Code steckt schon in der Seite, und die Datei musste nie irgendwohin. Ein serverseitiger hört auf. Das ist der stärkste Fünf-Sekunden-Test, den es gibt, denn er kann nicht durch eine Anfrage vorgetäuscht werden, die bloß klein aussieht.

Zweitens: Sehen Sie sich an, mit was die Seite sonst noch spricht. Ein Konverter, der Ihr Dokument nicht hochlädt, kann trotzdem seinen Dateinamen, seine Größe oder ein Seitenereignis an einen Analytics-Endpunkt senden, und das kann für sich schon zählen: ein Dateiname wie `mitarbeiterliste-final.md` ist eine Offenlegung, auch wenn der Inhalt es nicht ist. Zählen Sie dabei auch die Drittanbieter-Skripte. Jedes Skript, das die Seite lädt, läuft im selben Ursprung wie der Konverter, mit demselben Zugriff auf die Seite und damit auf Ihr Dokument. Ein browserseitiger Konverter mit einem Tag-Manager, einem Chat-Widget und zwei Analytics-Anbietern ist einen Lieferanten von einem Upload entfernt, den er nicht beabsichtigt hat.

### Die Datenschutzerklärung, gelesen nach Substantiven

Lesen Sie die Erklärung auf der Suche nach drei Dingen und ignorieren Sie den Rest: was gesammelt wird, wie lange es gehalten wird, und mit wem es geteilt wird. Beruhigung ist keines der drei. Ein Satz mit einer Dauer darin ist mehr wert als drei Absätze darüber, wie ernst irgendjemand irgendetwas nimmt.

Finden Sie keinen Satz zur Aufbewahrung, ist die ehrliche Schlussfolgerung, dass die Aufbewahrungsdauer unbekannt ist, und eine unbekannte Dauer ist nicht dasselbe wie eine kurze. Behandeln Sie den Upload entsprechend.

### Die Aufbewahrungsangabe, für sich betrachtet

Die guten gehosteten Dienste geben die Aufbewahrung klar an, und die Angaben fallen in erkennbare Formen: sofort nach der Verarbeitung gelöscht, nach einer festen Stundenzahl gelöscht, aufbewahrt bis Sie löschen, aufbewahrt so lange Ihr Konto existiert. Jede ist vertretbar. Keine ist null.

Zwei Details in der Aufbewahrungsangabe verdienen mehr Aufmerksamkeit, als sie meist bekommen.

Das erste ist, was passiert, wenn eine Konvertierung fehlschlägt. Mehrere Dienste behalten einen fehlgeschlagenen Upload länger als einen erfolgreichen, damit der Support ihn ansehen kann, was völlig sinnvoll ist und bedeutet, dass das Dokument, das Sie am liebsten vergessen würden — das, das kaputtging —, das am längsten aufbewahrte ist.

Das zweite ist, was die Angabe abdeckt. Aufbewahrung beschreibt meist die hochgeladene Datei und die konvertierte Ausgabe. Selten beschreibt sie die Logs, und Logs sind, wo Dateinamen, Größen, IP-Adressen und Zeitstempel leben. Das Dokument zu löschen und die Log-Zeile darüber zu behalten, ist ein normales technisches Ergebnis und eine teilweise Antwort auf „ist es weg".

### Die Bedingungen, und die Lizenzklausel

Das ist die Prüfung, die fast niemand durchführt, und diejenige, die gelegentlich eine echte Überraschung produziert. Öffnen Sie die Nutzungsbedingungen und durchsuchen Sie den Text nach diesen Wörtern:

```
lizenz   license   gebührenfrei   unterlizenzierbar   unbefristet
unwiderruflich   weltweit   abgeleitete werke   aufbewahren   speichern
dritte   unterauftragsverarbeiter   unsere dienste verbessern   training
```

Die meisten Dienste brauchen irgendeine Lizenz an Ihrem Inhalt, und das zu sagen ist nicht finster: Um eine Datei zu speichern, zwischen Maschinen zu kopieren und zurückzugeben, braucht ein Anbieter Ihre Erlaubnis, sie zu speichern, zu kopieren und zu übertragen. Was Sie prüfen, ist die Form dieser Erlaubnis, und es gibt vier Dinge, auf die zu achten ist.

Ist sie zweckgebunden — „ausschließlich um den Dienst bereitzustellen" — oder offen? Endet sie, wenn Sie die Datei löschen und das Konto schließen, oder ist sie unbefristet? Ist sie unterlizenzierbar, was sie auf Parteien ausdehnt, die Sie nicht sehen können? Und reicht sie über den Betrieb des Dienstes hinaus in dessen Verbesserung, was im aktuellen Sprachgebrauch oft heißt, Modelle mit dem zu trainieren, was Sie hochgeladen haben?

Eine zweckgebundene, nicht unterlizenzierbare Lizenz, die mit Ihrem Inhalt endet, ist normal und in Ordnung. Eine unbefristete, weltweite, unterlizenzierbare Lizenz, alles Hochgeladene zu nutzen, anzupassen und daraus abgeleitete Werke zu erstellen, ohne Zweckbindung, ist eine Klausel, die jemand absichtlich geschrieben hat. Ob sie zählt, hängt vollständig davon ab, wessen Dokument Sie konvertieren: für Ihre eigenen Notizen überhaupt nicht; für den Vertragsentwurf eines Kunden ist es die ganze Entscheidung, und es kann eine Entscheidung sein, die Sie vertraglich gar nicht treffen dürfen.

### Ob die Ausgabe bereinigt ist

Nun die andere Hälfte der Sicherheit, die Hälfte, die nichts damit zu tun hat, wohin Ihre Datei gegangen ist.

Markdown erlaubt rohes HTML per Design, eine `.md`-Datei kann also ein `<script>`-Tag, einen `onerror`-Handler oder eine `javascript:`-URL enthalten, und ein treu darstellender Konverter reicht alle drei an den Browser weiter. Das ist in Ordnung für eine Datei, die Sie selbst geschrieben haben. Es ist nicht in Ordnung für ein README, das Sie aus dem Netz gezogen haben, ein Dokument, das ein Kunde geschickt hat, oder alles, was ein Modell aus Material erzeugt hat, das Sie nicht gelesen haben.

Sie können das in einer Minute testen. Erstellen Sie eine kleine Datei mit den bekannt bösen Formen darin und konvertieren Sie sie:

```markdown
## Test des Bereinigers

<script>window.__test = 1</script>

<img src=x onerror="window.__test = 2">

[ein Link](javascript:void 0)

<iframe src="https://example.com"></iframe>

<a href="#" onclick="window.__test = 3">Text</a>
```

Öffnen Sie dann das HTML, das der Konverter Ihnen gegeben hat, in einem Texteditor — nicht in einem Browser — und durchsuchen Sie es. Haben `<script`, `onerror`, `onclick` oder `javascript:` überlebt, stellt der Konverter treu dar und bereinigt nicht, und die Ausgabe ist nur so sicher wie die Eingabe war. Das ist eine legitime Design-Entscheidung für ein auf Ihre eigenen Dateien ausgerichtetes Werkzeug, und es ist das falsche Werkzeug für die Dateien anderer Leute. [Die Angriffsvektoren, die Positivlisten und wo das Filtern passieren muss](/blog/sanitising-markdown-safely) ist die längere Version dieses Tests.

Während die Datei im Editor offen ist, durchsuchen Sie sie auch nach `http`. Jede externe URL in einem exportierten Dokument ist eine Anfrage, die der Browser des Empfängers stellen wird, wenn er die Datei öffnet, was dem anderen Ende mitteilt, dass die Datei geöffnet wurde, wann, und ungefähr von wo. Ein eigenständiger Export hat seine Stile und Schriften inline und bittet das Netzwerk um nichts, was eine Eigenschaft ist, die es wert ist, bestätigt statt angenommen zu werden — der Unterschied zwischen [einer Datei und einem Link](/blog/share-a-markdown-document-as-a-link) ist größtenteils das.

Eine Sache noch zur Ausgabe, denn sie widerlegt eine Intuition: Ein Konverter, der vollständig auf Ihrer Maschine lief, kann Ihnen trotzdem eine gefährliche Datei aushändigen. Lokale Konvertierung schützt die Vertraulichkeit Ihres Dokuments. Sie tut nichts gegen den Inhalt, und eine von Ihrer eigenen Platte geöffnete HTML-Datei führt ihr JavaScript trotzdem aus. Ein Skript in einer lokalen Datei kann das Netzwerk erreichen, indem es eine Bild-URL konstruiert, „es hat meinen Laptop nie verlassen" und „es ist sicher zu öffnen" sind also unabhängige Aussagen.

## Die drei Konverterarten, und wofür jede gut ist

### Browserseitig — für alles, was nicht schon öffentlich ist

Ein browserseitiger Konverter liefert Ihnen den Parser. Die Seite lädt etwas JavaScript, dieses JavaScript liest die Datei, die Sie mit dem Dateiauswahldialog gewählt haben, konvertiert sie im Speicher und bietet Ihnen das Ergebnis als Download an. Keine Anfrage trägt das Dokument, denn keine Anfrage muss es.

| Vorteile | Nachteile |
| --- | --- |
| Nichts wird hochgeladen, und Sie können es beweisen, indem Sie das Netzwerkkabel ziehen | Die Behauptung ruht auf Code, den Sie nicht gelesen haben, verifiziert durch Beobachtung zu einem Zeitpunkt |
| Keine Aufbewahrungsrichtlinie, denn es gibt keine Kopie zum Aufbewahren | Drittanbieter-Skripte auf derselben Seite teilen den Ursprung und den Zugriff |
| Kein Konto, keine Installation, keine Genehmigung einzuholen | Die Maschine ist die Obergrenze: eine sehr große Datei erschöpft den Tab |
| Die Bedingungen können über nie ankommenden Inhalt wenig sagen | Formate, die schwere Verarbeitung brauchen, sind schwächer als bei einem Server |

**Für wen ist das?** Für jeden, der ein Dokument konvertiert, das nicht schon öffentlich ist und keine Installation braucht, um sich zu rechtfertigen: eine Vertragsklausel, eine Ankündigung im Entwurf, ein Vorfallsbericht, ein Lebenslauf, die Datei eines Kunden, die Sie nirgendwohin schicken dürfen. Es ist auch die richtige Vorgabe für Leute, die die Antwort vorführen statt zitieren wollen können, denn die Vorführung ist ein Netzwerkpanel mit nichts darin.

**Was das nicht behebt.** Bereinigen ist eine separate Entscheidung, getroffen vom selben Werkzeug, und es lohnt sich, sie getrennt mit dem obigen Test zu prüfen. Ebenso, ob die Ausgabe ein vollständiges Dokument oder ein Fragment ist — eine Frage der Nützlichkeit statt der Sicherheit, ausführlich behandelt in [dem Konvertervergleich](/blog/best-markdown-to-html-converters).

### Serverseitig — für Formate und Mengen, die ein Browser nicht bewältigt

Ein gehosteter Konverter lädt die Datei hoch, konvertiert sie auf seiner Infrastruktur und gibt Ihnen die Ausgabe oder einen Link dazu. Das ist, was die meisten Leute mit einem Online-Konverter meinen, und es ist die richtige Wahl für einen echten Satz von Aufgaben.

| Vorteile | Nachteile |
| --- | --- |
| Bewältigt Formate, die ein Browser nicht gut parsen kann, einschließlich alter Office-Dateien und PDFs | Das Dokument wird dem Anbieter offengelegt, per Definition |
| Konvertiert Dateien weit größer, als ein Tab halten kann | Aufbewahrung ist eine Richtlinie, was heißt, ein Satz, den jemand umschreiben kann |
| Eine API und eine Warteschlange, die Arbeit kann also unbeaufsichtigt und wiederholbar laufen | Unterauftragsverarbeiter, Regionen und Logs erweitern die Liste der Beteiligten |
| Jemand anders pflegt die Parser, die Schriften und die Fixes | Ein als URL ausgelieferte Ergebnis ist eine weiterleitbare Anmeldeinformation |

**Für wen ist das?** Für öffentliche Dokumente, veröffentlichte Dokumentation, Marketingtexte, alles, was schon im offenen Web steht, und jede Pipeline, in der die Konvertierung ohne eine Person in einem Tab laufen muss. Es ist auch die pragmatische Antwort, wenn das Quellformat wirklich schwierig ist, was oft der Fall ist beim Kommen aus einer Office-Suite — die für diese Richtung spezifischen Kompromisse stehen in [was eine Word-Datei auf dem Weg zu Markdown verliert](/blog/convert-docx-to-markdown).

**Die Bedingungen, die es vertretbar machen.** Eine angegebene Aufbewahrungsfrist mit einer Zahl darin. Eine lesbare Liste der Unterauftragsverarbeiter. Eine zweckgebundene Inhaltslizenz. Eine Region, die Sie wählen können, falls Sie eine Übermittlungspflicht haben. Eine Auftragsverarbeitungsvereinbarung, falls Sie personenbezogene Daten von jemand anderem verarbeiten. Und ein Auslieferungsmechanismus für Ergebnisse, der keine erratbare URL ist. Ein Dienst, der alle sechs bietet, ist ein vernünftiger Lieferant. Ein Dienst, der keinen davon bietet, ist nicht billiger; er ist undokumentiert, und [die Unterschiede bei Aufbewahrung und Zählung zwischen den bekannten](/blog/best-online-document-converters) sind der eigentliche Vergleich.

### Offline — für regulierte Arbeit und wiederholbare Pipelines

Ein Offline-Konverter ist Software auf Ihrer Maschine: ein Kommandozeilenwerkzeug, eine Desktop-Anwendung, eine Bibliothek in einem Build. Das Netzwerk ist nach der Installation nicht mehr beteiligt.

| Vorteile | Nachteile |
| --- | --- |
| Kein Upload, keine Aufbewahrung, kein Dritter, keine Richtlinie zu lesen | Eine Installation, Updates, und eine Paketlieferkette, der man vertrauen muss |
| Läuft in einer abgeschotteten oder genehmigten Umgebung | Läuft mit dem Zugriff Ihres Benutzers auf jede Datei, die Sie besitzen |
| Skriptbar, hundert Dateien kosten also dasselbe wie eine | Versionsdrift zwischen Maschinen erzeugt unterschiedliche Ausgaben |
| Auditierbar: das Programm und seine Eingaben gehören Ihnen | Immer noch keine Bereinigung, es sei denn das Werkzeug tut es oder Sie ergänzen es |

**Für wen ist das?** Für regulierte und vertragliche Arbeit, bei der eine dokumentierte Kontrolle mehr zählt als Bequemlichkeit, für Massenkonvertierung, und für alles, das in einer Pipeline jedes Mal gleich laufen muss. Es ist die einzige Option auf einer Maschine ohne Internetzugang, und die natürliche, sobald sich die Konvertierung oft genug wiederholt, dass eine Person, die einen Tab öffnet, der langsame Teil ist.

**Die Kosten, die Leute unterschätzen.** Eine Abhängigkeit hinzuzufügen heißt, einen Lieferanten hinzuzufügen. Ein aus einer Paketregistrierung gezogener Konverter bringt seine transitiven Abhängigkeiten mit, und jede davon läuft mit demselben Zugriff wie Ihre Shell. Wägen Sie das ehrlich gegen den vermiedenen Upload ab, besonders für einen Einmalauftrag mit einer einzigen Datei, wo die Installation die größere Änderung an Ihrer Maschine ist.

## Wenn ein Upload inakzeptabel ist

Für die meisten Dokumente ist das eine Vorliebe. Für manche ist es überhaupt keine Ermessensfrage, denn der Upload selbst ist das Ereignis: in dem Moment, in dem die Datei einen Dritten erreicht, wurde etwas offengelegt, und keine Aufbewahrungsrichtlinie macht das rückgängig.

| Dokument | Warum der Upload das Problem ist | Was stattdessen zu tun ist |
| --- | --- | --- |
| Unsignierte Verträge, Term Sheets, Angebote | Namen, Preise und Positionen einer nicht am Geschäft beteiligten Partei offengelegt | Browserseitig, oder ein Offline-Werkzeug auf einer von Ihnen kontrollierten Maschine |
| Gesundheits- oder Patientendaten | Die Verarbeitung der Gesundheitsdaten anderer braucht eine Rechtsgrundlage und eine Vereinbarung, kein Webformular | Offline, innerhalb der genehmigten Umgebung |
| Personenbezogene Daten identifizierbarer Personen | Sie werden verantwortlich für einen nicht geprüften Auftragsverarbeiter, und möglicherweise für eine Übermittlung | Browserseitig, oder ein gehosteter Dienst mit unterschriebener Vereinbarung |
| Zugangsdaten, Token, private Schlüssel, `.env`-Beispiele | Das Geheimnis ist jetzt geteilt, was auch immer mit der Datei passiert | Browserseitig oder offline, und das Geheimnis rotieren, falls es schon weg war |
| Unangekündigte Finanzdaten, Ergebnisse, Übernahmen | Marktrelevantes Material, das einem nicht geprüften Dritten übergeben wurde | Offline, unter denselben Kontrollen wie der Rest dieses Materials |
| Kundenarbeit unter einer NDA, die zulässige Unterauftragsverarbeiter auflistet | Ein Upload an eine nicht gelistete Partei kann die Vereinbarung direkt verletzen | Browserseitig oder offline, und die Liste prüfen, bevor Sie wählen |
| Sicherheitsüberprüfungen, Postmortems, Architekturnotizen | Hostnamen, Versionen und bekannte Schwächen sind genau die nützlichen Teile | Offline, oder browserseitig ohne Drittanbieter-Skripte auf der Seite |
| Personalakten, Disziplinarnotizen, Kündigungslisten | Sensibel gegenüber Menschen, die nicht zugestimmt haben, und schon der Dateiname kann offenlegen | Browserseitig oder offline; vor jeder Werkzeugnutzung umbenennen |

Drei davon verdienen noch einen Satz mehr.

**Der Fall der Zugangsdaten ist mit Abstand der häufigste.** Entwickler-Markdown ist voller Konfigurationsbeispiele, und Konfigurationsbeispiele sind voller Dinge, die wie Platzhalter aussehen und es gelegentlich nicht sind. Ist eine Datei mit einem lebenden Token an einen gehosteten Konverter gegangen, ist die richtige Reaktion nicht, die Aufbewahrungsrichtlinie zu prüfen; es ist, das Token zu rotieren. Aufbewahrung beschreibt, wann eine Kopie gelöscht wird, nicht, wer sie vorher gelesen hat.

**Der Dateiname ist Daten.** Leute schützen Inhalte und fügen Namen gedankenlos ein. `q3-entlassungen-final.md`, `patient-4412-notizen.md` und `uebernahme-nordwind.md` legen jeweils den interessanten Teil offen, bevor die Datei überhaupt geparst wird, und Dateinamen landen weit häufiger in Logs, Analytics-Ereignissen und Support-Tickets als Inhalte.

**Lesen Sie die Vereinbarung, nicht die Risikobereitschaft.** Ein großer Teil der Kundenarbeit steht unter Bedingungen, die festlegen, welche Dritten das Material verarbeiten dürfen. Wo diese Liste existiert, hört die Frage auf, eine Wahrscheinlichkeitsfrage zu sein. Entweder steht der Konverter auf der Liste, oder der Upload ist ein Verstoß, und das ist eine viel leichtere Frage zu beantworten, als ob der Anbieter vertrauenswürdig ist.

## Wo die naheliegende Antwort scheitert, und was sie kostet

„Nutzen Sie einen browserseitigen Konverter" ist die richtige Voreinstellung, und sie ist keine vollständige Antwort. Vier Dinge sind falsch daran, sie als eine zu behandeln.

**Es ist eine einmal verifizierte Behauptung.** Das leere Netzwerkpanel ist echter Beweis über den Code, der lief, als Sie hinsahen. Ein Deploy in der folgenden Woche kann das ändern, und niemand prüft erneut. Browserseitige Konvertierung ist auf eine Weise verifizierbar, wie es ein serverseitiges Versprechen nicht ist — das ist eine echte und ungewöhnliche Eigenschaft —, aber verifizierbar ist nicht dasselbe wie verifiziert, und die Prüfung hat ein Verfallsdatum. Für Arbeit, bei der das wirklich zählt, wiederholen Sie den Offline-Test gelegentlich, und bevorzugen Sie ein Werkzeug, bei dem das Funktionieren mit ausgeschaltetem Netzwerk eine entworfene Eigenschaft ist statt eines Zufalls.

**Der Ursprung wird geteilt.** Ein browserseitiger Konverter ist keine Sandbox gegen seine eigene Seite. Jedes Skript, das die Seite lädt — Analytics, ein Tag-Manager, ein Support-Widget, eine Werbung — läuft mit vollem Zugriff auf das Document Object Model und damit auf alles, was der Konverter im Speicher hat. Das ist der Fehlerfall, der in der Praxis am wahrscheinlichsten zuschlägt, denn er erfordert nicht, dass die Autoren des Konverters unehrlich sind, nur dass sie einen Anbieter hinzugefügt haben. Zählen Sie die Dritten im Netzwerkpanel; ein Konverter ohne welche macht eine stärkere Behauptung als einer mit fünf.

**Es gibt Ihnen nichts, was Sie einem Prüfer zeigen können.** Das ist der Kosten, der Leute überrascht. Müssen Sie belegen, wie ein Dokument gehandhabt wurde, ist „es wurde lokal in einem Browser konvertiert und nichts wurde hochgeladen" eine wahre Aussage ohne Beleg dahinter. Ein gehosteter Prozessor mit einer Auftragsverarbeitungsvereinbarung, einer benannten Region, einem Aufbewahrungsplan und Zugriffsprotokollen ist aus Compliance-Sicht eine besser dokumentierte Kontrolle als eine Behauptung, für die niemand einen Beleg vorlegen kann. Manchmal ist die richtige Antwort der Upload, genau weil er mit Papierkram kommt.

**Sich anzumelden ändert das Modell, und das ist es wert, klar gesagt zu werden.** Ein browserseitiger Konverter, der auch Konten, Historie und Teilen anbietet, ist zwei Produkte. Abgemeldet bleibt die Datei auf Ihrer Maschine. In dem Moment, in dem Sie ein Dokument in einem Konto speichern, liegt es auf einem Server, und alles in der serverseitigen Zeile der obigen Tabelle gilt dafür: Aufbewahrung, Region, Unterauftragsverarbeiter, und ein Link, der eine Anmeldeinformation ist. Die Grenzen ändern sich meist auch. Bei diesem Werkzeug ist Konvertierung bei 10 MB gedeckelt, während ein im Konto gehaltenes Dokument bei 4 MB gedeckelt ist, weil die dahinterliegende Funktion eine Anfrage oder Antwort über 4,5 MB ablehnt. Diese Zahlen sind ein Hosting-Zwang statt einer Richtlinie, und sie sind eine nützliche Erinnerung, dass ein gespeichertes Dokument etwas anderes ist als ein konvertiertes.

Es gibt auch einen kleineren Fehlerfall, der es wert ist, genannt zu werden. Browserseitige Werkzeuge sind schwächer bei Formaten, die echte Parsing-Arbeit brauchen — alte binäre Office-Dateien, PDFs, deren Struktur erschlossen werden muss, Tabellenblätter mit Formeln. Auf einer lokalen Konvertierung dafür zu bestehen, erzeugt eine schlechte Konvertierung, und eine schlechte Konvertierung, die man danach von Hand reparieren muss, hat ihre eigenen Kosten. Besser die Grenze zu kennen, als mit ihr zu streiten.

## Die Prüfungen, in Reihenfolge

1. **Entscheiden Sie, wie sich das Dokument in einem Leck lesen würde, bevor Sie überhaupt Werkzeuge vergleichen.** Ist es vertraglich, reguliert, marktrelevant oder gehört jemand anderem, muss die Konvertierung auf Ihrer Maschine passieren, und der ganze gehostete Markt ist irrelevant, bis das geklärt ist — was Ihnen erspart, Tarife zu lesen, die Sie nie kaufen werden.
2. **Konvertieren Sie eine Testdatei mit offenem Netzwerkpanel, dann noch einmal mit ausgeschaltetem Netzwerk.** Dass nichts im Panel erscheint und die Konvertierung trotzdem offline funktioniert, ist der einzige positive Beweis, den Sie haben können; hört sie offline auf zu funktionieren, ging die Datei irgendwohin, was auch immer die Startseite behauptet hat.
3. **Zählen Sie die Drittanbieter-Skripte auf der Seite.** Jedes läuft im Ursprung des Konverters mit Zugriff auf Ihr Dokument, eine Seite mit mehreren Anbietern hat also eine weitere Vertrauensgrenze, als ihre Datenschutzerklärung beschreibt, und keine Menge lokaler Verarbeitung engt das ein.
4. **Finden Sie den Aufbewahrungssatz und prüfen Sie, ob eine Zahl darin steht.** Eine angegebene Dauer ist eine Richtlinie, an die Sie jemanden halten können; Beruhigung ohne Dauer heißt, die Frist ist unbekannt, und eine unbekannte Frist sollte als unbefristet behandelt werden.
5. **Durchsuchen Sie die Bedingungen nach einer Inhaltslizenz und lesen Sie ihre vier Qualifikatoren — Zweck, Dauer, Unterlizenzierung, Verbesserung.** Eine zweckgebundene Lizenz, die mit Ihrem Inhalt endet, ist gewöhnlich; eine unbefristete unterlizenzierbare ist eine Entscheidung, die Sie im Namen eines Kunden vielleicht nicht treffen dürfen.
6. **Testen Sie den Bereiniger mit einem Dokument, das ein Script-Tag und einen `onerror`-Handler enthält.** Überleben die in die Ausgabe, ist der Konverter nur so sicher wie seine Eingabe, was für Ihre eigenen Dateien in Ordnung ist und falsch für alles, was von außen kam.
7. **Öffnen Sie die exportierte Datei in einem Texteditor und durchsuchen Sie sie nach `http`.** Jede externe URL ist eine Anfrage, die der Browser des Empfängers stellen wird, was zurückmeldet, dass das Dokument geöffnet wurde; ein eigenständiger Export hat keine und verhält sich im Zug genauso wie an Ihrem Schreibtisch.
8. **Notieren Sie, welchen Konverter Sie für welche Dokumentklasse genehmigt haben, und wann Sie ihn zuletzt geprüft haben.** Zwei Zeilen in einem Team-Dokument verhindern den häufigsten Fehler, der nicht darin besteht, schlecht zu wählen, sondern einmal gut zu wählen und dann nie zu bemerken, dass sich das Werkzeug, die Bedingungen oder die Aufgabe geändert haben.

## Fazit

Sicher ist nicht etwas, das ein Konverter ist; es ist etwas, das Sie in zehn Minuten über einen Konverter feststellen können, für ein bestimmtes Dokument, und die Prüfungen sind langweilig genug, dass sie einmal aufzuschreiben ein ganzes Team abdeckt. Der wichtige Teil ist, dass die stärkste Antwort beobachtbar statt versprochen ist: Ein Konverter, der die Arbeit in Ihrem Browser erledigt, hat keine Kopie Ihrer Datei zu behalten, keine Richtlinie, der Sie vertrauen müssten, und keine Geschichte zu erzählen, falls er kompromittiert wird, und Sie können alle drei bestätigen, indem Sie das Netzwerk ausschalten und beobachten, wie er weiterläuft. Das ist, was [TransformPipes Markdown-zu-HTML-Konvertierung](/) tut — abgemeldet wird die Datei auf Ihrer eigenen Maschine gelesen und konvertiert, nichts wird hochgeladen, und das rohe HTML in Ihrem Dokument durchläuft einen Bereiniger, bevor es die Seite erreicht. Braucht das Format wirklich einen Server, wählen Sie den gehosteten Dienst nach seinem Aufbewahrungssatz und seiner Liste der Unterauftragsverarbeiter statt nach seiner Formatanzahl, und wiederholt sich die Aufgabe, installieren Sie etwas und hören Sie auf, die Frage wöchentlich zu stellen. Was Sie nicht tun sollten, ist einen Vertrag in einem Tab zu konvertieren, weil die Seite schnell war und das Schloss grün.

## FAQ

### Ist es sicher, einen Online-Markdown-zu-HTML-Konverter zu nutzen?

Es hängt davon ab, ob der Konverter die Datei hochlädt, und das ist prüfbar statt eine Vertrauensfrage: Öffnen Sie das Netzwerkpanel des Browsers, konvertieren Sie ein Testdokument, und sehen Sie, ob etwas das Gerät verlässt. Ein Konverter, der in Ihrem Browser läuft, verarbeitet die Datei auf Ihrer eigenen Maschine und hat nichts aufzubewahren, was ihn zu einer vernünftigen Voreinstellung für nicht schon öffentliche Dokumente macht. Ein gehosteter Konverter ist in Ordnung für öffentliches Material und Formate, die ein Browser nicht parsen kann, sofern Sie seine Aufbewahrungsangabe gelesen haben.

### Lädt ein browserbasierter Konverter meine Datei wirklich nicht hoch?

Sie können es testen statt zu glauben. Laden Sie die Seite, trennen Sie sich vom Netzwerk, und konvertieren Sie: Funktioniert die Konvertierung noch, läuft der Parser lokal, denn es gab nichts, wohin man sie senden könnte. Beobachten Sie das Netzwerkpanel auch bei einer normalen Konvertierung, und achten Sie darauf, wie viele Drittanbieter-Skripte die Seite lädt, denn jedes davon teilt den Zugriff der Seite auf Ihr Dokument.

### Wie lange behalten Online-Konverter meine Dokumente?

Die ehrlichen gehosteten Dienste geben eine Frist an — gelöscht nach der Verarbeitung, gelöscht nach einer festen Stundenzahl, oder aufbewahrt bis Sie löschen — und die Frist ist meist kurz. Zwei Details werden übersehen: Eine gescheiterte Konvertierung wird oft länger aufbewahrt als eine erfolgreiche, damit der Support sie untersuchen kann, und Aufbewahrungsangaben decken meist die Datei ab statt die Logs, wo Dateinamen und Zeitstempel leben. Finden Sie keinen Satz mit einer Dauer darin, behandeln Sie die Frist als unbekannt.

### Beanspruchen Online-Konverter Eigentum an meinem Inhalt?

Fast nie Eigentum, aber die meisten Bedingungen enthalten eine Lizenz, denn ein Dienst, der eine Datei speichert und zurückgibt, braucht die Erlaubnis, sie zu speichern und zurückzugeben. Lesen Sie diese Klausel nach vier Qualifikatoren: ob sie auf die Bereitstellung des Dienstes beschränkt ist, ob sie endet, wenn Sie Ihren Inhalt löschen, ob sie unterlizenziert werden kann, und ob sie sich auf die Verbesserung des Dienstes oder das Training von Modellen erstreckt. Eine zweckgebundene Lizenz, die mit Ihrem Inhalt abläuft, ist gewöhnlich; eine unbefristete unterlizenzierbare ist einen zweiten Blick wert, besonders wenn das Dokument einem Kunden gehört.

### Reicht HTTPS aus, um einen Konverter sicher zu machen?

Nein. HTTPS schützt die Bytes während der Übertragung und sagt nichts darüber, ob sie hätten gesendet werden sollen, was der Server damit macht, oder wie lange er sie behält. Es kann eine serverseitige Konvertierung auch nicht Ende-zu-Ende-verschlüsselt machen, denn der Server muss den Klartext lesen, um ihn zu konvertieren. Behandeln Sie das Schloss als Mindestanforderung statt als Beweis für irgendetwas.

### Ich habe schon etwas Vertrauliches hochgeladen. Was soll ich tun?

Kümmern Sie sich zuerst um den Inhalt, nicht um die Richtlinie. Enthielt die Datei ein Token, einen Schlüssel oder ein Passwort, rotieren Sie es jetzt, denn Aufbewahrung sagt Ihnen, wann eine Kopie gelöscht wird, nicht, wer sie vorher gelesen hat. Nutzen Sie dann, was auch immer der Dienst an Löschung anbietet, notieren Sie sich, was hochgeladen wurde und wann, falls Sie es melden müssen, und prüfen Sie, ob das Material unter einer Vereinbarung stand, die einschränkt, welche Dritten es verarbeiten dürfen.

### Ist ein Offline-Konverter immer sicherer als ein Online-Konverter?

Nicht automatisch. Er entfernt den Upload, die Aufbewahrung und den Dritten, und er fügt eine Installation, einen Update-Pfad und eine Paketlieferkette hinzu, die mit dem Zugriff Ihres Benutzers auf jede Datei läuft, die Sie besitzen. Für regulierte Arbeit, Massenkonvertierung und wiederholbare Pipelines ist er die richtige Antwort. Für eine einzelne Datei auf einer Maschine, auf der Sie lieber nichts installieren, ist eine browserseitige Konvertierung die kleinere Änderung.
