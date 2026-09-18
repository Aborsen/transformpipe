---
title: "Markdown vers HTML dans VS Code : aperçu, export et conversion à l’enregistrement"
description: "L’aperçu de VS Code tourne avec markdown-it, mais sa feuille de style n’est jamais celle du fichier exporté. Ce que chaque voie d’export met autour du fragment."
date: 2026-08-25
tag: Conversion
keywords: markdown vers html vs code, aperçu markdown vscode, exporter markdown en html vscode, markdown.styles, extension export markdown vscode, convertir markdown à l’enregistrement, markdown all in one print to html
---

Le fichier est déjà ouvert. Vous appuyez sur Ctrl+Maj+V, l’aperçu apparaît, et il ressemble à la page que vous vouliez — des titres dimensionnés avec bon sens, du code dans un bloc à chasse fixe sur fond teinté, des tableaux avec des bordures. Vous partez donc chercher la commande d’export, et il n’y en a pas. VS Code affiche du Markdown ; il ne vous remet pas un fichier `.html`.

C’est dans cet écart que se loge l’essentiel des ennuis dont parle cet article. L’aperçu est une webview dotée de sa propre feuille de style, conçue pour lire un fichier à l’intérieur de l’éditeur. Chaque voie qui produit un vrai fichier HTML — une extension, une commande dans le terminal, une tâche — prend ses propres décisions sur ce qui vient entourer le fragment rendu, et aucune d’elles n’hérite par défaut de l’apparence de l’aperçu.

### En bref

VS Code n’a pas d’export Markdown vers HTML intégré. L’aperçu tourne avec **markdown-it** : ce que vous voyez est donc du CommonMark plus ce que VS Code ajoute par-dessus, et son apparence vient de la feuille de style d’aperçu de l’éditeur — qui n’est **pas** ce qu’un exportateur écrit dans votre fichier. Pour obtenir un fichier `.html`, installez une extension (Markdown All in One imprime en HTML ; Markdown PDF écrit du HTML, du PDF, du PNG ou du JPEG ; Markdown Preview Enhanced propose un export HTML hors ligne qui intègre ses ressources) ou lancez un convertisseur depuis le terminal intégré et branchez-le sur une tâche. Si le fichier part vers une personne plutôt que vers un dépôt, un convertisseur qui produit un document complet et autonome est un chemin plus court que de faire rentrer l’éditeur dans le rang.

## Ce qu’est réellement l’aperçu intégré

L’aperçu Markdown de VS Code est une webview qui exécute markdown-it, le même analyseur conforme à CommonMark qu’emploient plusieurs autres outils. Ce seul fait explique l’essentiel de ce que l’aperçu affiche et de ce qu’il n’affiche pas.

CommonMark vous donne les titres, l’emphase, les listes, les citations, les blocs de code clôturés, les liens et les images. La configuration par défaut de markdown-it ajoute les tableaux et le barré, qui s’affichent donc aussi. VS Code ajoute par-dessus les cases à cocher des listes de tâches, ce qui explique que `- [x] done` donne une case cochée dans l’aperçu et non une paire de crochets littérale. Les notes de bas de page ne sont ni dans CommonMark ni dans les réglages par défaut de markdown-it : `[^1]` reste donc du texte brut tant que vous n’installez pas une extension qui apporte le greffon correspondant. Les diagrammes Mermaid, PlantUML et les mathématiques racontent la même histoire, à ceci près que les mathématiques ont leur propre interrupteur : `markdown.math.enabled`.

Ce que vous pouvez changer sans extension tient en une courte liste, et il vaut la peine de la connaître, car deux de ces réglages modifient le HTML et non l’apparence :

| Réglage | Valeur par défaut | Ce qu’il change |
| --- | --- | --- |
| `markdown.preview.breaks` | `false` | Si un saut de ligne simple devient un `<br>` |
| `markdown.preview.linkify` | `true` | Si les URL nues deviennent des liens |
| `markdown.preview.typographer` | `false` | Guillemets typographiques, tirets et points de suspension |
| `markdown.math.enabled` | `true` | Le rendu des mathématiques dans l’aperçu |
| `markdown.styles` | `[]` | Feuilles de style supplémentaires chargées dans l’aperçu |
| `markdown.preview.fontFamily` | défaut de l’éditeur | Police du corps de l’aperçu |
| `markdown.preview.scrollPreviewWithEditor` | `true` | Synchronisation du défilement, éditeur vers aperçu |
| `markdown.preview.scrollEditorWithPreview` | `true` | Synchronisation du défilement, aperçu vers éditeur |

`breaks` et `linkify` sont les deux qui comptent au-delà de l’apparence. Activez `breaks` et chaque saut de ligne souple de votre source devient un `<br>` dans la sortie rendue, ce qui change la structure du document et pas seulement son rendu — même source, deux arbres différents. Si vous vous êtes déjà demandé pourquoi un outil respecte vos paragraphes coupés à la main quand un autre les recolle en un bloc, ce réglage est toute l’explication, et sa valeur par défaut varie d’un outil à l’autre.

Deux autres réglages méritent leur place dans cette liste bien qu’ils ne changent rien à la sortie, parce qu’ils attrapent les défauts que la conversion rend définitifs. `markdown.validate.enabled` active la vérification des liens dans l’éditeur : un lien relatif vers un fichier inexistant, ou une ancre de titre qui ne correspond à aucun titre, se retrouve souligné là où vous pouvez encore le corriger. `markdown.updateLinksOnFileMove.enabled` propose de réécrire les liens quand vous déplacez ou renommez un fichier Markdown dans l’explorateur. Les deux valent d’être activés dans un dépôt de documentation, car un lien relatif cassé dans la source est un lien cassé dans tous les formats vers lesquels vous la convertissez, et la conversion ne le signale pas.

Les commandes sont `Markdown: Open Preview` (Ctrl+Maj+V, Cmd+Maj+V sous macOS) et `Markdown: Open Preview to the Side` (Ctrl+K V). Il y en a une troisième qui mérite qu’on s’en souvienne : `Markdown: Change preview security settings`, qui décide si l’aperçu charge les images distantes et s’il exécute des scripts. L’aperçu est une webview munie d’une politique de sécurité de contenu : un fichier `.md` contenant une balise `<script>` n’a donc pas le droit de l’exécuter par défaut. C’est une propriété de la webview. Ce n’est une propriété de rien de ce que vous exportez, et confondre les deux est la manière dont on finit par publier une page que l’on n’a jamais inspectée.

## Comparatif rapide : l’aide-mémoire

| Voie | Ce qu’elle produit | Styles dans la sortie | Où elle s’exécute | Licence |
| --- | --- | --- | --- | --- |
| Aperçu intégré | Rien — une vue rendue, c’est tout | Feuille de style d’aperçu de l’éditeur, non exportable | Webview dans l’éditeur | Gratuit, MIT (source de VS Code) |
| Copier depuis l’aperçu | Du texte enrichi dans le presse-papiers | Ce que l’application de destination décide | Éditeur | Gratuit |
| Markdown All in One | Un `.html` à côté du `.md` | Éventuellement les feuilles de style d’aperçu de VS Code | Commande de l’éditeur | Gratuit, MIT |
| Markdown PDF | `.html`, `.pdf`, `.png`, `.jpeg` | Les siennes par défaut, plus `markdown-pdf.styles` | Éditeur, exige un navigateur Chromium | Gratuit, MIT |
| Markdown Preview Enhanced | `.html` hors ligne ou hébergé sur CDN | Le thème de son propre moteur de rendu | Commande de l’éditeur, aperçu maison | Gratuit, licence NCSA |
| Pandoc dans le terminal intégré | Ce que vous demandez | Ceux du gabarit, ou aucun | Terminal, exige une installation | Gratuit, GPL |
| Un convertisseur derrière `tasks.json` | Ce que produit le convertisseur | Ceux du convertisseur | Lanceur de tâches | Dépend du convertisseur |
| L’extension Run on Save | Déclenche n’importe laquelle des voies ci-dessus | Ce n’est pas son affaire | À chaque enregistrement correspondant | Gratuit, Apache 2.0 |
| Un convertisseur côté navigateur | Un `.html` autonome | En ligne, dans le fichier | Un onglet de navigateur | Gratuit |

Lisez ce tableau par sa troisième colonne. La voie que vous choisissez est surtout une décision sur la CSS qui finira dans le fichier, et c’est la colonne que personne ne vérifie avant que le fichier ne soit déjà dans la boîte de réception de quelqu’un. Toutes les licences nommées dans cet article, dans cette colonne comme plus bas, sont des licences libres et open source lues dans le manifeste du projet lui-même (vérifié sur le dépôt de chaque projet, le 8 septembre 2026).

## La feuille de style de l’aperçu n’est pas celle de l’export

C’est le point qui surprend, il vaut donc la peine de le dire sans détour : l’apparence de l’aperçu Markdown de VS Code est produite par des feuilles de style qui appartiennent à la webview de l’éditeur. Elles ne sont pas attachées à votre document. Elles ne sont écrites dans rien de ce que vous exportez. Un exportateur qui ne les recopie pas délibérément produit un fichier qui s’affiche avec les valeurs par défaut du navigateur — du Times New Roman sur toute la largeur de la fenêtre, des titres qui se contentent d’être plus gros, des blocs de code que seule la chasse fixe distingue.

L’empilement à l’intérieur de l’aperçu rend la séparation plus nette. Trois sources de CSS atteignent la webview, dans cet ordre : d’abord les styles d’aperçu intégrés de VS Code, puis les feuilles de style que les extensions apportent via le point de contribution `markdown.previewStyles`, puis vos propres `markdown.styles`. L’ordre documenté est intégré, puis contribué, puis utilisateur — d’où le fait que votre règle `markdown.styles` l’emporte sur celle d’une extension, et le fait qu’une extension qui souhaite rester surchargeable contribue au lieu d’injecter.

Aucune de ces trois couches ne fait partie de la conversion. Elles habillent une vue du document. La conversion — du texte Markdown en entrée, des balises HTML en sortie — a lieu avant elles toutes et ne sait rien d’elles.

Il existe une seconde version, plus discrète, de la même surprise, et elle attrape les développeurs plutôt que les rédacteurs. Les extensions peuvent ajouter de la syntaxe à l’aperçu par le point de contribution `markdown.markdownItPlugins` : l’extension renvoie une fonction `extendMarkdownIt`, VS Code lui passe l’instance markdown-it, et le greffon est actif. Cela ne concerne que l’aperçu. Cela n’affecte en rien la façon dont le document est exporté ou traité ailleurs. Vous pouvez donc installer un greffon de notes de bas de page, regarder vos notes s’afficher magnifiquement, lancer un export, et récupérer un `[^1]` littéral dans la sortie — parce que l’exportateur a son propre analyseur, son propre jeu de greffons, et aucune connaissance de ce qu’on a raconté à l’aperçu.

D’où la règle pratique qui suit : **l’aperçu est un outil de lecture, et l’export est un programme distinct.** Vérifiez l’export en ouvrant le fichier exporté, dans un navigateur, pas dans l’éditeur. Tout ce que vous déduisez de l’aperçu à propos du fichier que vous vous apprêtez à envoyer est une supposition.

## Les extensions qui exportent vraiment

Trois extensions couvrent presque tout le sujet, et elles diffèrent exactement comme la troisième colonne de l’aide-mémoire le laisse entendre — par ce qu’elles mettent autour du fragment.

### Copier depuis l’aperçu — la voie que l’on essaie en premier

Avant d’installer quoi que ce soit, la plupart des gens sélectionnent tout dans l’aperçu, copient, et collent dans ce qui réclame le contenu. Cela fonctionne, au sens étroit où le presse-papiers transporte du texte enrichi et où la destination l’affiche. Il vaut la peine de savoir précisément ce qui se passe, car le résultat n’est ni l’aperçu ni un fichier HTML.

Le presse-papiers reçoit une variante HTML de la sélection, et l’application réceptrice lui applique ensuite ses propres règles. Un client de messagerie garde le gras et les listes et substitue sa propre police. Un traitement de texte fait correspondre les titres à ses propres styles de titre, ce qui est souvent exactement ce que vous vouliez. Un système de gestion de contenu en supprime la majeure partie et conserve la structure. Dans tous les cas, l’habillage est celui de la destination et non celui de VS Code, et les images référencées par un chemin relatif ne suivent en général pas du tout.

| Avantages | Inconvénients |
| --- | --- |
| Aucune installation, aucune configuration, aucun fichier à gérer | Vous obtenez du texte enrichi, pas un fichier à envoyer ou à servir |
| Les titres et les listes survivent dans la plupart des destinations | Les images relatives ne survivent généralement pas |
| Suffisant pour coller une section dans un courriel | Les blocs de code perdent leur coloration et parfois leur chasse fixe |

**Pour qui ?** Pour quiconque déplace quelques paragraphes vers une autre application. Ce n’est pas une conversion, et la traiter comme telle est la manière dont un tableau arrive à l’autre bout sous la forme de cinq lignes de barres verticales.

### Markdown All in One — le chemin le plus court vers un fichier `.html`

Markdown All in One est une extension Markdown généraliste : raccourcis clavier, poursuite des listes, table des matières et export HTML. La commande d’export est `Markdown: Print current document to HTML`, avec `Markdown: Print documents to HTML` pour un lot. Elle écrit le fichier à côté de la source.

| Avantages | Inconvénients |
| --- | --- |
| Une commande, pas de navigateur, rien à installer au-delà de l’extension | La sortie s’appuie sur les feuilles de style d’aperçu de VS Code |
| Peut reproduire délibérément l’apparence de l’aperçu de l’éditeur | Les images sont liées, non intégrées, sauf si vous activez l’option |
| Commande de lot pour un dossier de fichiers | Ce n’est pas un convertisseur appelable depuis une compilation |
| L’export à l’enregistrement tient en un seul réglage | Le HTML est habillé pour une webview, pas pour l’impression ni le courriel |

**Prix :** gratuit, sous licence MIT.

Les réglages sont la partie intéressante, car ce sont les décisions que l’exportateur prend à votre place :

| Réglage | Valeur par défaut | Effet |
| --- | --- | --- |
| `markdown.extension.print.includeVscodeStylesheets` | `true` | Si la CSS d’aperçu de VS Code entre dans le fichier |
| `markdown.extension.print.imgToBase64` | `false` | Si les images sont intégrées sous forme d’URI de données |
| `markdown.extension.print.absoluteImgPath` | `true` | Si les chemins d’images relatifs sont réécrits en chemins absolus |
| `markdown.extension.print.theme` | `light` | Le jeu de couleurs du HTML exporté |
| `markdown.extension.print.onFileSave` | `false` | Réexporter à chaque enregistrement du `.md` |
| `markdown.extension.print.validateUrls` | `true` | Vérifier les liens pendant l’export |

Deux d’entre eux décident si le fichier voyage. À sa valeur par défaut, `absoluteImgPath` réécrit vos références d’images relatives en chemins absolus sur votre machine, ce qui est correct tant que le fichier reste là où il a été écrit et cassé dès l’instant où vous l’envoyez à quelqu’un — son ordinateur n’a aucun `C:\Users\you\docs\diagram.png`. Passer `imgToBase64` à `true` intègre les images à la place, ce qui alourdit le fichier et le fait fonctionner partout. Lequel des deux vous voulez dépend de la destination du fichier, et le réglage par défaut suppose qu’il ne va nulle part.

**Pour qui ?** Pour quelqu’un qui veut le fichier qu’il a sous les yeux, en HTML, tout de suite, et qui se soucie peu de la CSS du moment qu’elle n’est pas absente.

### Markdown PDF — une extension, quatre formats de sortie

Markdown PDF convertit le document ouvert en PDF, HTML, PNG ou JPEG. Pour cela, il pilote un navigateur à base de Chromium via Puppeteer, en utilisant soit un navigateur que vous lui désignez, soit un navigateur déjà installé, soit un navigateur qu’il télécharge et gère lui-même.

| Avantages | Inconvénients |
| --- | --- |
| HTML et PDF depuis une seule configuration | Exige un navigateur Chromium, téléchargé s’il n’en trouve pas |
| `markdown-pdf.styles` accepte vos propres feuilles de style | La dépendance au navigateur est lourde pour un travail purement HTML |
| La conversion à l’enregistrement est native | Plus lent qu’un analyseur, puisqu’il rend une page |
| Plusieurs formats en une passe via `markdown-pdf.type` | L’habillage de la sortie est celui de l’extension tant que vous ne le remplacez pas |

**Prix :** gratuit, sous licence MIT.

Les réglages à connaître : `markdown-pdf.type` prend le format de sortie ou une liste de formats ; `markdown-pdf.convertOnSave` relance la conversion à chaque enregistrement du fichier ; `markdown-pdf.styles` prend une liste de chemins locaux de feuilles de style à appliquer. Comme c’est un vrai navigateur qui assure le rendu, la voie PDF est ce qu’il y a de plus solide ici — format de page, marges et en-têtes sont des choses qu’un navigateur sait faire et qu’un analyseur Markdown ne sait pas. Si le PDF est le but réel plutôt qu’un effet de bord, les compromis forment un sujet à part entière.

**Pour qui ?** Pour quiconque a besoin de PDF autant que de HTML depuis la même source, et que le téléchargement d’un navigateur pour y parvenir ne dérange pas.

### Markdown Preview Enhanced — celle qui a un export hors ligne

Markdown Preview Enhanced remplace l’aperçu intégré par le sien, qui affiche les mathématiques, Mermaid et PlantUML, et exporte vers plusieurs formats. Son export HTML est le seul des trois à nommer la distinction sur laquelle cet article ne cesse de revenir : vous choisissez entre **HTML (offline)** et **HTML (cdn hosted)**.

| Avantages | Inconvénients |
| --- | --- |
| L’export hors ligne intègre les ressources au lieu de lier un CDN | C’est un second aperçu, avec son comportement et son thème propres |
| Diagrammes et mathématiques s’affichent sans greffon supplémentaire | Ce que vous voyez n’est plus ce que montre l’aperçu intégré |
| Le front matter pilote l’export document par document | L’exécution de scripts doit être activée pour certaines fonctions |
| L’export à l’enregistrement se déclare dans le document, pas dans les réglages | La plus vaste des trois extensions, par son périmètre |

**Prix :** gratuit, sous la licence open source de l’université de l’Illinois / NCSA.

L’export se configure dans le front matter du document plutôt que dans les réglages, ce qui est une idée franchement bonne — le document transporte ses propres instructions. Les clés comprennent `offline`, `embed_local_images`, `embed_svg`, `print_background` et `toc`, et l’export à l’enregistrement se déclare ainsi :

```yaml
---
export_on_save:
  html: true
---
```

`embed_local_images` convertit les images locales en base64, ce qui est la même décision que prend `imgToBase64` dans Markdown All in One, et elle compte pour la même raison. Notez que la fonction de table des matières exige d’activer `enableScriptExecution` dans les réglages de l’extension, car elle a besoin d’exécuter un script dans l’aperçu.

**Pour qui ?** Pour les personnes qui rédigent des documents à diagrammes et à équations, et qui veulent que l’export soit décrit dans le fichier plutôt que dans les réglages d’une machine.

### Pandoc depuis le terminal intégré — pas une extension du tout

Le terminal intégré fait partie de l’éditeur : y lancer un convertisseur, c’est donc encore convertir depuis VS Code. Pandoc est le choix habituel, et il produit un document complet quand vous le lui demandez :

```sh
pandoc README.md --standalone --embed-resources --output README.html
```

`--standalone` enveloppe le fragment dans un vrai document, avec un doctype et un en-tête. `--embed-resources` tire les images et les feuilles de style dans le fichier pour qu’il s’ouvre réseau coupé. Sans ces deux options, Pandoc vous rend un fragment, ce qui est le comportement correct pour une bibliothèque et le mauvais fichier à envoyer par courriel. Il y a plus à dire sur ce que cela coûte à chaque exécution et sur la place que cela occupe dans une chaîne, et [l’histoire de la ligne de commande est un article à part](/blog/markdown-to-html-from-the-command-line).

**Pour qui ?** Pour quiconque a déjà Pandoc, ou veut que la conversion soit une commande qu’une compilation, un collègue ou un exécuteur d’intégration continue peut lancer aussi.

## CSS personnalisée : markdown.styles, et jusqu’où elle porte

`markdown.styles` est un tableau d’URL de feuilles de style chargées dans l’aperçu. Dans un espace de travail, mettez le fichier dans le dépôt et référencez-le depuis `.vscode/settings.json` :

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown.preview.breaks": false,
  "markdown.preview.typographer": true
}
```

Deux contraintes font trébucher. D’abord, les chemins sont résolus par rapport au dossier de l’espace de travail ; les chemins absolus du système de fichiers ne sont pas pris en charge, et les URI `file://` ne sont pas le contournement — il existe dans le dépôt de VS Code des demandes ouvertes réclamant les chemins absolus précisément parce qu’ils ne fonctionnent pas. Ensuite, c’est un réglage d’espace de travail pour une bonne raison : une feuille de style qui vit dans le dépôt voyage avec le dépôt, et l’aperçu a donc la même allure pour tout le monde. La définir dans vos réglages utilisateur habille tous les fichiers Markdown que vous ouvrirez un jour, y compris ceux des autres, ce qui est rarement ce que vous vouliez dire.

Vient ensuite le point important. `markdown.styles` atteint l’aperçu et rien d’autre. Elle n’atteint pas `Markdown: Print current document to HTML`, elle n’atteint pas `markdown-pdf.styles`, et elle n’atteint pas l’export de Markdown Preview Enhanced. Chacun a son propre réglage de feuille de style, et si vous voulez une apparence unique entre l’aperçu et l’export, il faut faire pointer les deux réglages vers le même fichier :

```json
{
  "markdown.styles": ["docs/preview.css"],
  "markdown-pdf.styles": ["docs/preview.css"]
}
```

Cela marche, avec une réserve qu’il vaut mieux vérifier avant de s’y fier : la feuille de style intégrée de l’aperçu est toujours sous la vôtre dans la webview et absente de l’export, si bien qu’une feuille de style écrite comme une série de surcharges par-dessus les valeurs par défaut de VS Code produit un fichier beaucoup plus dépouillé quand ces valeurs par défaut ne sont pas là. Si vous voulez que les deux se ressemblent, écrivez une feuille de style complète — police du corps, espacements, bordures de tableaux, fond des blocs de code — et non un correctif.

La même logique vaut pour la coloration syntaxique. L’aperçu colore les blocs de code avec la machinerie propre à l’éditeur, et l’export n’en hérite pas. Un exportateur qui colore le fait avec son propre thème et ses propres noms de classes, et un exportateur qui ne colore pas vous donne un simple `<pre><code>` avec une classe de langage et rien pour le teinter. Ce dont la coloration a réellement besoin sur la page, c’est d’une feuille de style, et parfois d’un script, dont aucun n’apparaît par magie.

## Convertir à l’enregistrement avec une entrée tasks.json

Si la conversion doit avoir lieu plus de deux fois, mettez-la dans le dépôt plutôt que dans vos doigts. Une tâche fait de la commande une propriété du projet :

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "md to html",
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

La marquer comme tâche de compilation par défaut, ce que fait la propriété `group` ci-dessus, signifie que Ctrl+Maj+B la lance sans sélecteur — un détail qui décide si la tâche sera utilisée ou non. `presentation.reveal` à `silent` empêche le panneau du terminal de prendre le focus à chaque exécution, ce qui compte quand l’exécution a lieu des dizaines de fois par jour.

`${file}` est le fichier de l’éditeur actif, `${fileDirname}` son dossier et `${fileBasenameNoExtension}` son nom sans l’extension : la tâche convertit donc ce que vous avez sous les yeux et écrit le résultat à côté. `"problemMatcher": []` indique à VS Code de ne pas analyser la sortie à la recherche d’erreurs de compilation, ce qui sinon provoque une question à chaque exécution.

Maintenant la partie honnête, car c’est là que les tutoriels s’arrêtent et que les utilisateurs se mettent à chercher. **`tasks.json` ne sait pas lancer une tâche quand vous enregistrez un fichier.** La propriété `runOptions.runOn` accepte deux valeurs : `default`, c’est-à-dire que la tâche s’exécute quand vous l’invoquez, et `folderOpen`, c’est-à-dire qu’elle s’exécute à l’ouverture du dossier qui la contient. Il n’y a pas de `onSave`. Trois contournements existent, et ils diffèrent réellement par leur coût.

**Associez la tâche à une touche.** L’option la moins chère, et elle garde le déclencheur explicite. Dans `keybindings.json` :

```json
{
  "key": "ctrl+alt+h",
  "command": "workbench.action.tasks.runTask",
  "args": "md to html"
}
```

Une frappe, aucune extension supplémentaire, et la conversion a lieu quand vous décidez qu’elle doit avoir lieu. Pour un fichier que vous exportez quelques fois par jour, c’est la bonne réponse, et le fait que ce soit manuel est un atout — vous n’écrivez pas des fichiers HTML chaque fois que vous enregistrez une phrase à moitié finie.

**Utilisez le réglage d’enregistrement propre à l’exportateur.** Markdown All in One a `markdown.extension.print.onFileSave`, Markdown PDF a `markdown-pdf.convertOnSave`, et Markdown Preview Enhanced lit `export_on_save` dans le front matter du document. Des trois, la version en front matter est la mieux élevée : elle est par document, elle est sous contrôle de version, et un fichier qui ne doit pas être exporté ne le demande tout simplement pas.

**Utilisez une extension de surveillance de fichiers.** L’extension Run on Save est le choix habituel. Sa configuration est une liste d’expressions régulières associées à des commandes, sous `emeraldwalk.runonsave` dans les réglages :

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

Elle est sous licence Apache 2.0 et remplace ses propres variables — `${file}`, `${fileDirname}`, `${fileBasenameNoExt}`, `${workspaceFolder}` et quelques autres — qui ressemblent assez aux variables de tâche de VS Code pour prêter à confusion. `${fileBasenameNoExt}` ici, `${fileBasenameNoExtension}` dans `tasks.json`. Copier l’une dans l’autre produit silencieusement un fichier nommé `${fileBasenameNoExtension}.html`.

La quatrième option consiste à esquiver complètement le déclencheur de l’éditeur et à laisser le dépôt s’en charger : un script de surveillance dans `package.json`, ou un workflow qui convertit au moment du push, de sorte que l’artefact soit produit par la même commande pour tout le monde. Publier depuis une pull request supprime la question de savoir quelle machine a la bonne extension installée, qui est le mode de défaillance de chacun des réglages de cet article.

## Où la voie « dans l’éditeur » échoue, et ce qu’elle coûte

Convertir dans l’éditeur est rapide et local, et cela coûte quatre choses qui n’apparaissent que plus tard.

### La configuration est par machine, pas par dépôt

Chaque réglage d’extension de cet article vit dans un fichier de réglages, et seuls ceux de l’espace de travail voyagent. `.vscode/settings.json` est versionnable : `markdown.styles`, `markdown-pdf.styles` et `markdown.extension.print.imgToBase64` peuvent donc être des propriétés du dépôt. Les extensions elles-mêmes ne le peuvent pas. Vous pouvez les lister comme recommandations dans `.vscode/extensions.json`, et une recommandation est une invite que l’on peut décliner. Un collègue qui lance le même export avec une autre extension installée produit un autre fichier, et rien dans le dépôt ne consigne laquelle était la bonne.

C’est là toute la différence entre une conversion et une habitude. Une commande dans un script est relisible, comparable et reproductible ; une suite de frappes dans l’éditeur de quelqu’un n’est rien de tout cela, et le premier signe d’ennui est en général un document qui paraît faux à l’un et correct à l’autre. Si la sortie compte pour plus d’une personne, la conversion doit être écrite quelque part qui ne soit pas un fichier de réglages sur un portable.

### Un fichier à la fois, le plus souvent

Markdown All in One a une commande d’impression par lot ; le reste est construit autour de l’éditeur actif. Si le travail porte sur un dossier de documents, ou sur un document assemblé à partir de plusieurs, l’éditeur n’a pas la bonne forme pour cela — fusionner d’abord et convertir une fois est une autre opération, avec un autre résultat, et aucune commande d’export d’un éditeur de texte ne s’en chargera.

### Rien dans cette chaîne n’assainit

Markdown autorise le HTML brut : un fichier `.md` peut donc contenir `<script>`, `onerror=` et des URL `javascript:`. L’aperçu intégré affiche le HTML brut et s’en remet à la politique de sécurité de contenu de la webview pour empêcher les scripts de s’exécuter, ce qui vous protège pendant la lecture. Un fichier HTML exporté n’a ni webview ni politique de ce genre : tout le HTML brut présent dans la source se retrouve dans un fichier qu’un navigateur exécutera. Pour vos propres notes, cela n’a aucune importance. Pour un README récupéré dans un dépôt, ou un document envoyé par un client, [c’est toute la question](/blog/sanitising-markdown-safely), et aucune de ces extensions n’annonce l’assainissement comme une étape.

### La dépendance à Chromium est réelle

Le téléchargement du navigateur par Markdown PDF est une gêne unique sur un portable et un vrai problème en intégration continue, où un exécuteur sans interface doit récupérer et mettre en cache un navigateur pour produire un fichier qu’un analyseur aurait produit en quelques millisecondes. Si le HTML est tout ce qu’il vous faut, un navigateur est un moyen lourd de l’obtenir.

### Quand le fichier a un lecteur

Les coûts ci-dessus sont tous tolérables tant que la sortie va dans un dépôt, une compilation ou un panneau d’aperçu. Ils cessent de l’être quand la sortie va vers une personne, car le fichier doit alors survivre à son départ de votre machine — il doit transporter ses styles, résoudre ses images et s’ouvrir correctement sur un ordinateur qui n’a aucun de vos réglages et aucune idée de ce qu’est une webview.

C’est une propriété technique précise : un fichier HTML complet et autonome, styles en ligne, aucune requête externe. Certains exportateurs peuvent être configurés pour en produire un ; la plupart produisent quelque chose entre un fragment et un document, et vous découvrez lequel en vous l’envoyant par courriel. Un convertisseur conçu pour ce résultat part de là. TransformPipe convertit le Markdown en un unique fichier HTML autonome dans le navigateur, sans rien téléverser quand vous n’êtes pas connecté, ce qui signifie que la vérification qui compte — l’ouvrir ailleurs, réseau coupé — réussit par construction et non par configuration. [Ce qu’un document remis à quelqu’un doit savoir faire](/blog/share-a-markdown-document-as-a-link) est une liste plus courte que ce que doit faire la compilation d’un dépôt, et l’éditeur est optimisé pour la seconde.

## Comment choisir, en cinq questions

1. **La sortie est-elle destinée à un lecteur ou à un dépôt ?** Un lecteur a besoin d’un fichier unique et autonome, styles et images compris à l’intérieur ; un dépôt a besoin d’une commande reproductible, qui doit donc vivre sous contrôle de version plutôt que dans les réglages d’extension de quelqu’un.
2. **L’exportateur emporte-t-il les styles dans le fichier ?** Sinon, vous obtenez les valeurs par défaut du navigateur, et un document à la largeur par défaut du navigateur, sans bordures de tableau, se lit comme cassé même si le HTML est correct.
3. **Y a-t-il des images ?** Les chemins relatifs cassent quand le fichier bouge et les chemins absolus cassent dès qu’il quitte votre machine : à moins que les images ne soient intégrées en URI de données, le fichier ne fonctionne que là où il a été écrit.
4. **Quelque chose doit-il lancer cela sans vous ?** Si oui, la conversion doit tenir dans une commande qu’une tâche, un script ou un travail d’intégration continue peut appeler, car une commande d’éditeur est une personne qui appuie sur une touche, et une personne n’est pas disponible à trois heures du matin.
5. **Avez-vous écrit tout ce que contient le fichier ?** Sinon, quelque chose doit assainir le HTML brut avant que la sortie n’atteigne un navigateur, car aucune partie de la voie « dans l’éditeur » ne le fait pour vous.

## Conclusion

Convertir du Markdown en HTML dans VS Code fonctionne bien pour exactement le cas auquel c’était destiné : un fichier que vous éditez déjà, un export que vous allez regarder vous-même, sur une machine que vous avez configurée. Au-delà, les deux choses que l’on attend de l’éditeur — reproduire l’apparence de l’aperçu dans le fichier exporté, et lancer la conversion automatiquement à l’enregistrement — sont deux choses qu’il ne fait pas, et que l’on ne répare qu’en choisissant une extension et en lisant ses réglages avec attention. S’il vous faut un fichier HTML unique qui s’ouvre correctement sur l’ordinateur de quelqu’un d’autre, convertir [du Markdown vers du HTML avec un convertisseur côté navigateur](/) demande moins de décisions que de mettre trois extensions d’accord, et [le comparatif plus large des convertisseurs](/blog/best-markdown-to-html-converters) couvre les bibliothèques et les outils en ligne de commande qu’il vaut mieux brancher sur une compilation.

## FAQ

### VS Code dispose-t-il d’un export Markdown vers HTML intégré ?

Non. VS Code livre un aperçu Markdown et aucune commande d’export : produire un fichier `.html` demande donc soit une extension, soit un convertisseur lancé depuis le terminal intégré. L’aperçu a pour but de lire le fichier dans l’éditeur, pas de produire un livrable.

### Pourquoi mon HTML exporté ne ressemble-t-il pas du tout à l’aperçu ?

Parce que l’apparence de l’aperçu vient des feuilles de style de la webview de VS Code, qui ne font pas partie de votre document et ne sont écrites dans aucun export. À moins que l’exportateur ne les recopie délibérément — Markdown All in One a un réglage exactement pour cela — le fichier exporté s’affiche avec les valeurs par défaut du navigateur.

### Comment utiliser ma propre CSS dans l’aperçu Markdown de VS Code ?

Ajoutez la feuille de style à `markdown.styles` dans `.vscode/settings.json`, avec un chemin relatif au dossier de l’espace de travail. Les chemins absolus du système de fichiers ne sont pas pris en charge, et le réglage ne concerne que l’aperçu — pour l’export, il faut aussi renseigner l’option de styles propre à l’extension exportatrice.

### VS Code peut-il convertir le Markdown en HTML à chaque enregistrement ?

Pas par `tasks.json`, dont `runOptions.runOn` n’accepte que `default` et `folderOpen`. Employez le réglage d’enregistrement propre à un exportateur, comme `markdown.extension.print.onFileSave` ou `markdown-pdf.convertOnSave`, ou une extension de surveillance qui lance une commande sur les enregistrements correspondants.

### Pourquoi mes notes de bas de page s’affichent-elles dans l’aperçu mais pas dans l’export ?

Parce que les greffons markdown-it apportés par les extensions ne s’appliquent qu’à l’aperçu et n’ont aucun effet sur la façon dont le document est exporté. L’exportateur a son propre analyseur et son propre jeu de greffons : une syntaxe que l’aperçu comprend peut donc ressortir en texte littéral dans le fichier.

### L’aperçu affiche-t-il du GitHub Flavored Markdown ?

Pour l’essentiel, en pratique : markdown-it gère les tableaux et le barré, VS Code ajoute les cases à cocher des listes de tâches, et les URL nues deviennent des liens parce que `markdown.preview.linkify` est actif par défaut. Ce n’est pas une garantie d’obtenir exactement la sortie de GitHub, et [les différences entre les variantes valent d’être connues](/blog/commonmark-gfm-and-the-flavours) avant de supposer qu’un fichier s’affiche de la même façon des deux côtés.

### Quelle voie me donne un fichier unique sans aucune requête externe ?

L’export `HTML (offline)` de Markdown Preview Enhanced et le `--standalone --embed-resources` de Pandoc visent tous deux cet objectif, comme tout convertisseur dont la sortie annoncée est un document autonome. Testez-le de la seule façon qui prouve quelque chose : ouvrez le fichier sur une autre machine, réseau désactivé.
