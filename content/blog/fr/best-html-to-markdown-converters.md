---
title: "Les meilleurs convertisseurs HTML vers Markdown en 2026 : comparés et testés"
description: "Comparatif des convertisseurs HTML vers Markdown en 2026 : outils en ligne, bibliothèques, extracteurs et clippers, ce qu’ils gardent et ce qu’ils perdent"
date: 2026-09-08
tag: Conversion
keywords: meilleur convertisseur html vers markdown, convertisseur html markdown en ligne, convertir un fichier html en markdown, page web en markdown, alternative à turndown, html vers markdown en ligne de commande, enregistrer une page web en markdown, convertir html en markdown sans téléverser
---

Convertir du HTML en Markdown n’est pas une traduction. C’est une démolition accompagnée d’une liste de ce qu’il faut garder. Le HTML sait exprimer une mise en page sur trois colonnes, un tableau imbriqué dans une cellule de tableau, une couleur posée sur un seul mot et un composant qui n’existe qu’une fois JavaScript passé. Markdown sait exprimer des titres, des paragraphes, de l’emphase, des listes, des liens, des images, du code et — si la variante le permet — un tableau plat. Chaque convertisseur de cette page décide de ce qu’il jette, et ils ne sont pas d’accord entre eux.

### En bref

Choisissez selon ce qu’est votre HTML. Pour un **fragment propre ou une page écrite à la main**, à peu près n’importe quel convertisseur fait l’affaire et les différences sont cosmétiques. Pour une **page entière enregistrée**, la conversion est la moitié facile — la moitié difficile consiste à retrouver l’article au milieu de la navigation, du bandeau de cookies et du pied de page, et c’est précisément ce que fait un extracteur comme Readability avant qu’un convertisseur n’entre en scène. Pour **un fichier que vous avez sur le disque et une seule conversion à faire**, un outil qui tourne dans le navigateur est le chemin le plus court, rien n’est téléversé, et les options gratuites sont passées en revue plus bas. Pour **un build ou un script**, prenez la bibliothèque de votre langage : Turndown en JavaScript, markdownify ou html2text en Python, Pandoc quand la sortie doit être autre chose que du Markdown.

## Pourquoi « il convertit du HTML » ne vous apprend presque rien

Passer du HTML au Markdown se fait en deux étapes, et la plupart des outils n’en avouent qu’une. La première est l’extraction : décider quelle partie du document est le document. La seconde est la traduction : transformer en syntaxe Markdown les éléments que vous avez gardés. Une bibliothèque qui réussit parfaitement la seconde et saute la première vous rendra un magnifique rendu Markdown d’un menu de navigation, d’un formulaire d’inscription à une infolettre et d’une liste d’articles connexes, avec l’article quelque part au milieu.

Cette séparation explique l’essentiel des déceptions. Quelqu’un enregistre une page depuis son navigateur, dépose le fichier `.html` dans un convertisseur, et reçoit quatre cents lignes de listes de liens avant le premier paragraphe. Le convertisseur a fait son travail. Personne n’avait fait l’autre. Les extracteurs existent pour cela — Readability est le plus connu, et c’est la mécanique derrière le mode lecture de Firefox — et les extensions de navigateur qui clippent une page en Markdown sont un extracteur et un convertisseur vissés l’un à l’autre, ce qui explique qu’elles se comportent tellement mieux sur une vraie page web qu’une bibliothèque nue.

Vient ensuite la question de ce qui survit à la traduction, et c’est là que les convertisseurs diffèrent réellement. Les tableaux en sont l’exemple le plus bruyant : ils ne figurent pas dans la spécification CommonMark, un convertisseur doit donc implémenter les tableaux du GitHub Flavored Markdown de manière délibérée, et ceux qui ne le font pas aplatissent un `<table>` en une suite de paragraphes ou laissent passer le HTML brut tel quel. Les listes de tâches, le texte barré, les listes de définitions, les notes de bas de page, `<figure>` et `<figcaption>`, `<sup>` et `<sub>`, et les blocs de code portant un langage relèvent tous de la même catégorie : implémentés par certains, ignorés par d’autres, et jamais mentionnés sur une page de comparatif.

Enfin, il y a ce qu’il advient de tout ce pour quoi Markdown n’a pas de mots. Un convertisseur dispose de trois options, et chacune se défend. Il peut supprimer la construction, ce qui perd de l’information en silence. Il peut émettre du HTML brut en ligne, ce qui conserve l’information et rend le Markdown moins portable, puisque l’outil suivant de la chaîne risque de l’échapper. Ou il peut approximer — un tableau imbriqué devient un tableau plat, un `<span>` stylé devient du texte ordinaire. Savoir laquelle des trois votre outil choisit est plus utile que n’importe quelle liste de fonctionnalités, parce que c’est la différence entre un fichier que vous pouvez lire et un fichier que vous devez réparer.

## Comparatif rapide : l’aide-mémoire

| Outil | Idéal pour | Capacité principale | Prix |
| --- | --- | --- | --- |
| TransformPipe | Un fichier ou une page enregistrée, converti tout de suite | Conversion dans le navigateur, retire le mobilier de la page, garde tableaux et listes de tâches | Gratuit |
| Turndown | Applications JavaScript et extensions de navigateur | Le convertisseur JS par défaut ; des règles que vous pouvez remplacer ; greffon GFM pour les tableaux | Gratuit, MIT |
| Pandoc | Du HTML qui doit devenir plusieurs formats | Lit le HTML, écrit une quarantaine de formats, garde ou refuse le HTML brut à la demande | Gratuit, GPL |
| html2text | Scripts Python voulant du texte brut lisible | CLI et bibliothèque, liens en références, suppression des liens | Gratuit, GPLv3 |
| markdownify | Scripts Python voulant une structure fidèle | Fondé sur BeautifulSoup, options par balise, gestion des tableaux | Gratuit, MIT |
| node-html-markdown | Convertir de très grandes quantités de HTML | Embarque un analyseur HTML, donc aucun DOM n’est nécessaire | Gratuit, MIT |
| html-to-md | Une petite dépendance dans un bundle JS | Petit, sans dépendances, gère les éléments de tableau | Gratuit, MIT |
| html-to-markdown (Go) | Un CLI et une bibliothèque Go issus d’un même projet | Binaire installable, greffon de tableaux avec alignement et fusions | Gratuit, MIT |
| Mozilla Readability | Trouver l’article à l’intérieur d’une page | Extraction, pas conversion — produit du HTML nettoyé | Gratuit, Apache 2.0 |
| Postlight Parser | Extraction avec sortie Markdown intégrée | `contentType` valant html, markdown ou text | Gratuit, Apache 2.0 / MIT |
| MarkDownload | Clipper la page que vous avez sous les yeux | Readability puis Turndown, depuis la barre du navigateur | Gratuit, Apache 2.0 |
| Obsidian Web Clipper | Clipper directement dans un coffre | Extraction et conversion via defuddle, modèles, nettoyage | Gratuit, MIT |
| Notion Web Clipper | Enregistrer des pages dans Notion | Enregistre en blocs Notion ; du Markdown seulement via un export ultérieur | Offre gratuite disponible |
| L’« Enregistrer sous » du navigateur | Obtenir le HTML au départ | Ce n’est pas un convertisseur — c’est la source de la plupart des mauvaises entrées | Gratuit |

## Les meilleurs convertisseurs HTML vers Markdown en 2026

### TransformPipe — idéal pour un fichier ou une page enregistrée à convertir tout de suite

TransformPipe prend un fichier `.html`, `.htm` ou `.xhtml` et rend du Markdown dans votre navigateur. Il n’y a rien à installer et aucun compte n’est exigé, et hors connexion le fichier n’est envoyé nulle part : il est lu, converti et affiché sur votre propre machine.

| Avantages | Inconvénients |
| --- | --- |
| Déconnecté, rien n’est téléversé | Un document à la fois, ce n’est pas un robot d’exploration |
| Retire le mobilier de la page avant la conversion, pas après | Ce n’est pas un extracteur : il coupe par élément, pas en lisant la page |
| Tableaux, texte barré, blocs de code et listes de tâches survivent | Le navigateur fait le travail, un très gros fichier est donc limité par la machine |
| La même conversion tourne dans l’API, le CLI, l’action GitHub et le serveur MCP | Aucune configuration par balise |

**Prix :** gratuit. Un compte ajoute l’historique, le partage et une API, gratuits eux aussi.

**Détails techniques et fonctionnalités**

- Construit sur node-html-markdown, qui analyse avec node-html-parser plutôt qu’avec un DOM — la conversion identique tourne donc dans un onglet de navigateur, dans une tâche d’intégration continue et derrière l’API, au lieu d’une implémentation par endroit
- `<script>`, `<style>`, `<noscript>`, `<template>`, `<svg>`, `<iframe>`, `<head>`, `<nav>` et `<footer>` sont retirés avant la traduction, en même temps que les commentaires HTML
- Les tableaux et le texte barré sont pris en charge par l’analyseur ; les cases à cocher à l’intérieur d’éléments de liste sont retraduites en `- [x]` et `- [ ]`, une liste de tâches arrive donc bien comme une liste de tâches
- Les suites de lignes vides sont regroupées, alors qu’une page convertie en est autrement remplie
- Convertit aussi Word, CSV, TSV et JSON en Markdown, et le Markdown de nouveau en un fichier HTML autonome

**Pour qui ?** Pour quiconque a un fichier et une raison de ne pas le confier à un serveur — un export enregistré, une page d’un wiki interne, le document d’un client. Si le voyage retour vous intéresse ensuite, [le côté Markdown vers HTML est un comparatif entièrement différent](/blog/best-markdown-to-html-converters), avec d’autres modes de défaillance.

### Turndown — la meilleure bibliothèque JavaScript, et celle à laquelle tout le reste se mesure

Turndown est un convertisseur HTML vers Markdown écrit en JavaScript, et c’est le choix par défaut du monde JS, de très loin. Il fonctionne dans le navigateur comme dans Node, et son système de règles explique sa présence dans tant d’autres outils : vous pouvez remplacer le gestionnaire de n’importe quel élément sans avoir à forker quoi que ce soit.

| Avantages | Inconvénients |
| --- | --- |
| Les règles se remplacent élément par élément, ce qui rend le HTML étrange traitable | Les tableaux exigent le greffon GFM ; le cœur ne les gère pas |
| Tourne dans le navigateur et dans Node | Passe par un DOM plutôt que par son propre analyseur |
| Très répandu, son comportement est donc bien documenté par les rapports de bogues des autres | Aucune extraction : il convertit ce que vous lui donnez, mobilier compris |
| `keep`, `remove` et l’option `blankReplacement` offrent trois façons de traiter ce dont vous ne voulez pas | La configuration est du code, pas des options en ligne de commande |

**Prix :** gratuit, sous licence MIT (vérifié sur github.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- `addRule` enregistre un gestionnaire contre un nom de balise, une liste de noms de balises ou une fonction de filtrage ; `keep` laisse un élément sous forme de HTML brut ; `remove` le supprime avec son contenu
- Des options pour le style de titre (ATX ou setext), le marqueur de puce, le caractère de clôture des blocs de code, les délimiteurs d’emphase et de gras, et le style de lien — y compris les liens en références
- `turndown-plugin-gfm` ajoute les tableaux, le texte barré et d’autres constructions du GitHub Flavored Markdown
- Parce qu’il est fondé sur le DOM, le document que vous lui donnez est celui qu’un navigateur construirait — le HTML mal formé est réparé par l’analyseur avant même que Turndown ne le voie

**Pour qui ?** Pour les développeurs JavaScript, et pour quiconque écrit une extension de navigateur ou un gestionnaire de collage dans un éditeur. Son omniprésence est une fonctionnalité : quand une page se convertit mal, quelqu’un a en général déjà écrit la règle.

### Pandoc — idéal quand le HTML doit devenir autre chose que du Markdown

Pandoc est un convertisseur de documents en ligne de commande écrit en Haskell qui lit et écrit une quarantaine de formats. HTML en entrée et Markdown en sortie est l’une de ses plus petites tâches, et la raison de l’employer est en général que le Markdown n’est pas le terminus.

| Avantages | Inconvénients |
| --- | --- |
| Un seul outil pour aller du HTML au Markdown, et du Markdown à presque tout | Exige une installation et un terminal |
| Son écrivain Markdown peut émettre ou refuser le HTML brut, à la demande | Son dialecte Markdown étendu n’est pas le GFM, sauf si vous demandez le GFM |
| Des filtres Lua permettent de réécrire le document en pleine conversion | Aucune extraction : une page entière se convertit en page entière |
| Encaisse de très gros documents sans navigateur dans le chemin | Le nombre d’options est une courbe d’apprentissage à lui seul |

**Prix :** gratuit, sous licence GPL.

**Détails techniques et fonctionnalités**

- `pandoc -f html -t gfm` choisit le GitHub Flavored Markdown en sortie, ce que vous voulez si les tableaux et les listes de tâches comptent
- Tout ce que Markdown ne sait pas exprimer retombe en HTML brut dans la sortie ; désactiver l’extension `raw_html` sur l’écrivain est la façon de refuser cela et d’accepter la perte à la place
- `--wrap=none` l’empêche de couper les paragraphes en dur, ce qui rend autrement les diffs illisibles dans un dépôt
- Les filtres Lua et les modèles travaillent sur son modèle de document interne, vous pouvez donc supprimer ou réécrire des classes entières d’éléments avant que le Markdown ne soit écrit

**Pour qui ?** Pour quiconque convertit selon un calendrier, convertit beaucoup de fichiers, ou convertit du HTML vers quelque chose qui n’est pas du Markdown du tout. C’est aussi la bonne réponse quand le Markdown doit être versionné dans un dépôt et y rester lisible en diff.

### html2text — idéal pour Python quand vous voulez que ce soit lisible

html2text est un script et une bibliothèque Python qui transforment du HTML en texte lisible, simple, proche de l’ASCII, et qui se trouve être aussi du Markdown valide. L’accent est mis sur la lisibilité : il a été écrit pour rendre les pages web agréables à lire sous forme de texte, et ses réglages par défaut le reflètent.

| Avantages | Inconvénients |
| --- | --- |
| Un outil en ligne de commande et une bibliothèque en une seule installation | GPLv3, que certains projets ne peuvent pas accepter |
| Des options pour les liens en références, ignorer les liens, ignorer les images | La sortie est réglée pour la lecture, pas pour l’aller-retour |
| Ancien et stable | La gestion des tableaux est plus faible que celle des bibliothèques orientées structure |
| Un retour à la ligne raisonnable pour une sortie texte | Mal adapté à du HTML très imbriqué |

**Prix :** gratuit, sous licence GPLv3 (vérifié sur github.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- S’exécute comme `html2text [filename [encoding]]` ou comme bibliothèque depuis Python
- `--ignore-links` et `--ignore-images` retirent ce qui rend une sortie texte bruyante ; `--reference-links` déplace les URL en bas au lieu de les laisser en ligne
- `--escape-all` échappe les caractères spéciaux de façon agressive, ce qui compte quand le texte source contient de la ponctuation Markdown
- `--mark-code` marque les blocs de code avec `[code]` et `[/code]` ; `--backquote-code-style` est l’option qui produit des clôtures à trois accents graves

**Pour qui ?** Pour les scripts Python produisant du texte destiné à des humains ou à un index de recherche — corps de courriels, résumés, textes de notification. Si ce qu’il vous faut est une copie structurelle fidèle du HTML, l’entrée suivante convient mieux.

### markdownify — la meilleure bibliothèque Python pour garder la structure

markdownify convertit du HTML en Markdown en utilisant BeautifulSoup comme analyseur, avec des options par balise. Là où html2text optimise pour du texte lisible, markdownify optimise pour une correspondance fidèle des éléments qu’il reconnaît.

| Avantages | Inconvénients |
| --- | --- |
| Sous licence MIT, plus facile à adopter que la GPLv3 | Tire BeautifulSoup avec lui, il n’est donc pas sans dépendances |
| Des options par balise, y compris pour les tableaux dépourvus de ligne d’en-tête | Plus lent que les options compilées ou embarquant leur analyseur |
| Convertir ou retirer certaines balises en les nommant | Aucune étape d’extraction |
| Familier à quiconque utilise déjà BeautifulSoup | Moins de commodités en ligne de commande que html2text |

**Prix :** gratuit, sous licence MIT (vérifié sur github.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Construit sur BeautifulSoup, dont les options d’analyseur sont transmises telles quelles : vous choisissez donc l’analyseur HTML sous-jacent
- Les listes `strip` et `convert` vous laissent nommer les balises à retirer, ou les seules balises à garder
- `table_infer_header` décide du sort d’un tableau sans ligne d’en-tête, qui est le problème de tableau le plus courant dans du HTML réel
- Le style de titre, les caractères de puce et le traitement du langage des blocs de code sont tous configurables

**Pour qui ?** Pour du code Python qui doit préserver la structure du document — importer un CMS hérité, convertir un export de documentation, alimenter en Markdown un modèle qu’un mur de texte égarerait.

### node-html-markdown — idéal pour convertir beaucoup de HTML

node-html-markdown est un convertisseur HTML vers Markdown en TypeScript dont le but affiché est le débit. Il analyse avec node-html-parser au lieu de s’appuyer sur un DOM, ce qui explique à la fois sa rapidité et le fait qu’il tourne là où une bibliothèque fondée sur le DOM ne le peut pas.

| Avantages | Inconvénients |
| --- | --- |
| Aucun DOM requis, il tourne donc partout où JavaScript tourne | Une communauté plus petite que celle de Turndown |
| Conçu dès l’origine pour le volume | Ses traducteurs personnalisés relèvent de sa propre API, pas de celle de Turndown |
| Gère les tableaux et le texte barré sans greffon | Certains traitements d’éléments sont tranchés et doivent être remplacés |
| Des traducteurs personnalisés par élément | Aucune extraction |

**Prix :** gratuit, sous licence MIT (vérifié sur github.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Porter son analyseur comme dépendance signifie le même chemin de code dans un navigateur, dans Node, dans un worker et dans une fonction sans serveur — aucune émulation de DOM à installer
- Les traducteurs s’enregistrent par nom d’élément et peuvent remplacer un nœud, l’ignorer, ou refuser d’y descendre
- Des options pour le marqueur de puce, la clôture des blocs de code, les délimiteurs d’emphase et de gras, et le fait de garder ou non les images en data-URI
- Le README du projet indique qu’il a été écrit pour convertir de très grands volumes de HTML ; traitez les chiffres de débit publiés comme une affirmation du projet, non comme une mesure indépendante

**Pour qui ?** Pour quiconque convertit du HTML en masse ou dans un environnement dépourvu de DOM. C’est aussi, pour exactement cette raison, le moteur sous le convertisseur de ce site : une seule conversion qui se comporte de la même façon dans un onglet de navigateur et sur un serveur.

### html-to-md — la meilleure petite dépendance

html-to-md est un petit convertisseur JavaScript sans dépendances, utilisable dans Node et dans le navigateur au travers d’un bundler. C’est l’option vers laquelle se tourner quand le convertisseur est un détail dans un ensemble plus vaste plutôt que l’objet du projet.

| Avantages | Inconvénients |
| --- | --- |
| Petit et sans dépendances | Moins de points d’extension que Turndown |
| Liste documentée des balises prises en charge, tableaux compris | Écosystème plus restreint, donc moins d’exemples détaillés |
| Fonctionne dans Node et dans le navigateur | Pas destiné au HTML inhabituel ou mal imbriqué |

**Prix :** gratuit, sous licence MIT (vérifié sur github.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Les balises prises en charge sont documentées explicitement, et comprennent `table`, `thead`, `tbody`, `tr`, `th` et `td`
- Aucune dépendance, il ajoute donc un module plutôt qu’un arbre
- `skipTags`, `emptyTags` et `ignoreTags` décident de ce qui saute et si le contenu part avec ; `aliasTags` fait correspondre une balise inhabituelle à un gestionnaire existant ; `tagListener` vous confie une balise précise à traiter vous-même

**Pour qui ?** Pour les projets frontaux où la taille du bundle est une contrainte réelle et où le HTML à convertir se tient à peu près bien.

### html-to-markdown (Go) — idéal si vous voulez un binaire et une bibliothèque

html-to-markdown, de JohannesKaufmann, est une bibliothèque Go accompagnée d’un outil en ligne de commande bâti à partir d’elle. C’est cette combinaison qui séduit : la même conversion dans un enchaînement shell et à l’intérieur d’un service Go.

| Avantages | Inconvénients |
| --- | --- |
| Un vrai CLI, installable en binaire sans environnement d’exécution à gérer | Go uniquement, pour un usage en bibliothèque |
| Le greffon de tableaux implémente les tableaux GFM, alignement et fusions compris | Jeu de greffons plus restreint que celui des bibliothèques JS |
| Lit depuis un fichier ou depuis l’entrée standard | Moins écrit à son sujet qu’au sujet de Turndown, donc moins d’exemples |
| Rapide, et ni Node ni Python nécessaires sur la machine | Aucune extraction |

**Prix :** gratuit, sous licence MIT (vérifié sur github.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- `html2markdown --input file.html --output file.md`, ou du HTML acheminé par l’entrée standard
- Distribué sous forme de formule Homebrew, de paquet Debian, de binaires précompilés et via `go install`
- Un greffon de tableaux qui implémente les tableaux du GitHub Flavored Markdown avec l’alignement et le traitement de `rowspan` et `colspan`
- Des règles peuvent être ajoutées en Go pour les éléments que les réglages par défaut traitent mal

**Pour qui ?** Pour les services Go, et pour quiconque veut convertir du HTML en Markdown dans un script shell sur une machine où installer Node ou Python est une corvée.

### Mozilla Readability et Postlight Parser — idéaux pour trouver l’article

Ces deux-là ne sont pas des convertisseurs, et c’est justement la raison de les connaître. Readability prend une page et rend l’article : titre, signature, et le contenu sous forme de HTML nettoyé, sans la navigation, les barres latérales ni le texte de remplissage. Postlight Parser fait le même travail et sait vous rendre le résultat directement en Markdown.

| Avantages | Inconvénients |
| --- | --- |
| Ils résolvent le problème que les convertisseurs ne touchent pas | Readability produit du HTML, il vous faut donc encore un convertisseur derrière |
| Readability est la mécanique derrière le mode lecture de Firefox, il est donc très éprouvé | Les deux exigent un DOM, donc JSDOM ou un navigateur dans Node |
| Postlight Parser peut renvoyer html, markdown ou text | L’extraction est heuristique : elle prend parfois trop, parfois trop peu |
| Les deux sont sous licence permissive | Ni l’un ni l’autre n’est un convertisseur de documents au sens général |

**Prix :** gratuit. Readability est sous Apache 2.0 ; Postlight Parser est sous double licence Apache 2.0 et MIT (vérifié sur github.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Le `parse()` de Readability renvoie un objet contenant le contenu de l’article sous forme de chaîne HTML, plus un `textContent` dont les balises ont été retirées
- Readability a besoin d’un document DOM : dans Node on l’associe donc à JSDOM ; dans une extension de navigateur, le document vivant est déjà là
- Postlight Parser accepte une option `contentType` valant `html`, `markdown` ou `text`, et extrait aussi des métadonnées comme l’auteur et la date
- Les deux travaillent sur une page unique : aucun n’explore un site, et aucun ne connaît le balisage particulier du vôtre à moins que vous ne l’étendiez

**Pour qui ?** Pour quiconque convertit des pages web plutôt que des fichiers HTML. Extraction d’abord, conversion ensuite, c’est la chaîne qu’emploie tout bon clipper, et la construire soi-même prend un après-midi.

### MarkDownload — la meilleure extension pour la page que vous avez devant vous

MarkDownload est une extension de navigateur qui clippe la page courante en Markdown. Son implémentation est la chaîne recommandée, livrée dans un paquet : Readability simplifie la page, puis Turndown convertit ce qui reste.

| Avantages | Inconvénients |
| --- | --- |
| Extraction et conversion en un clic | Ne convertit que ce qui est dans le navigateur, une page à la fois |
| Disponible pour Firefox, Chrome, Edge et Safari | Dépend de la justesse des suppositions de l’extracteur |
| Entête de métadonnées et modèles pour le fichier enregistré | Les permissions de l’extension sont larges par nécessité |
| Open source, les règles de conversion sont donc inspectables | Ce n’est pas une chaîne scriptable |

**Prix :** gratuit, sous licence Apache 2.0 (vérifié sur github.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Utilise Readability.js pour simplifier la page et Turndown pour convertir le HTML simplifié
- Des options pour le traitement des images, les modèles d’entête de métadonnées et le motif de nom de fichier
- Fonctionne depuis la barre d’outils ou depuis un menu contextuel sur une sélection, vous pouvez donc clipper une partie de page
- Parce qu’elle s’exécute après que le navigateur a affiché la page, le contenu ajouté par JavaScript est inclus — ce qu’un fichier `.html` enregistré rate souvent

**Pour qui ?** Pour quiconque lit sur le web et tient ses notes dans des fichiers. Clipper la page affichée est aussi la seule façon praticable de capturer une page dont le contenu n’existe qu’une fois les scripts passés.

### Obsidian Web Clipper — idéal si le Markdown part dans un coffre

Le clipper maison d’Obsidian enregistre les pages web en notes Markdown, avec des modèles qui décident du nom de fichier, des propriétés et de la partie de la page conservée. Il utilise defuddle pour l’extraction et la conversion plutôt que le duo Readability et Turndown, et il nettoie le HTML au passage.

| Avantages | Inconvénients |
| --- | --- |
| Des modèles par site, une recette et un article scientifique se clippent donc différemment | Pensé pour Obsidian ; moins utile si vos notes vivent ailleurs |
| Extraction, conversion et nettoyage dans une seule extension | Le comportement d’extraction diffère de celui de Readability, pour le meilleur et pour le pire |
| Chrome, Firefox, Safari et Edge, plus les navigateurs fondés sur Chromium | Les modèles sont un petit langage de plus à apprendre |
| Les propriétés sont capturées en entête de métadonnées, pas perdues | Une page à la fois |

**Prix :** gratuit, sous licence MIT, les marques et les éléments marketing étant exclus de la licence. Obsidian lui-même s’utilise gratuitement sans inscription ; une licence commerciale coûte 50 $ par utilisateur et par an (vérifié sur obsidian.md, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Utilise defuddle pour l’extraction de contenu et la conversion en Markdown, et DOMPurify pour le nettoyage
- Les modèles peuvent fixer le titre de la note, le dossier, les propriétés et le contenu, avec des règles par site
- Des surlignages et des sélections peuvent être clippés plutôt que la page entière
- La sortie est un simple fichier `.md` dans un dossier de coffre, qui est un répertoire de fichiers comme un autre

**Pour qui ?** Pour les utilisateurs d’Obsidian, évidemment — mais aussi pour quiconque veut un clipper qui écrit de vrais fichiers dans un dossier. Si vos notes sont ailleurs et que vous cherchez à les faire sortir plutôt qu’à les faire entrer, [le côté export de Notion, Obsidian et Confluence est un problème à lui seul](/blog/markdown-from-notion-obsidian-and-confluence).

### Notion Web Clipper — celui qui ne vous donne pas de Markdown

Le clipper de Notion enregistre une page web dans une page Notion. Il mérite de figurer ici précisément parce que les gens s’en saisissent en attendant du Markdown et récupèrent des blocs Notion, qui sont une tout autre chose, vivant dans la base de données de quelqu’un d’autre.

| Avantages | Inconvénients |
| --- | --- |
| S’intègre bien si Notion est déjà l’endroit où vivent vos notes | Le résultat, ce sont des blocs Notion, pas un fichier Markdown |
| Immédiatement consultable et partageable à l’intérieur de Notion | Obtenir du Markdown suppose une deuxième étape : l’export maison de Notion |
| Aucun fichier à gérer | Le Markdown exporté est l’interprétation de Notion, pas celle de la page |
| Offre gratuite disponible | Vous avez désormais deux conversions entre la page et votre fichier |

**Prix :** Notion propose une offre gratuite à 0 $ par membre et par mois (vérifié sur notion.com, le 8 septembre 2026) ; le clipper vient avec le compte.

**Pour qui ?** Pour les utilisateurs de Notion qui capturent leurs lectures. Si le but est un fichier Markdown, clippez avec quelque chose qui en produit un, ou convertissez directement le HTML enregistré — passer par Notion signifie deux conversions et deux occasions de perdre les tableaux.

### L’« Enregistrer sous » du navigateur — la source de la plupart des mauvaises entrées

Enregistrer une page depuis un navigateur est la manière dont naissent la plupart des fichiers HTML qui demandent à être convertis, et il vaut la peine de comprendre ce que vous obtenez. « Page web, complète » vous donne le balisage plus un dossier de ressources. « Page web, HTML seulement » vous donne le balisage tel qu’il a été livré, ce qui pour un site moderne peut signifier un document presque vide accompagné d’un script qui aurait construit la page. Ni l’un ni l’autre n’est l’article.

| Avantages | Inconvénients |
| --- | --- |
| Toujours disponible, rien à installer, aucune extension | Enregistre la page entière, mobilier compris |
| Capture la page telle qu’elle était, horodatage inclus | « HTML seulement » peut rater le contenu ajouté par JavaScript |
| Fonctionne pour les pages derrière une connexion où vous êtes déjà | Les dossiers de ressources font pointer les liens relatifs vers votre disque |

**Prix :** gratuit.

**Pour qui ?** Pour quiconque a besoin du HTML sur le disque pour d’autres raisons. Comme première étape d’une conversion, cela fonctionne, tant que vous savez que le convertisseur va convertir tout ce que vous avez enregistré — ce qui est le sujet de la section suivante.

## Ce que le HTML ne peut pas garder en devenant du Markdown

Tous les outils ci-dessus produiront du Markdown à partir de votre HTML. Aucun ne peut produire du Markdown qui veuille dire la même chose, parce que Markdown n’en a pas le vocabulaire. Voici ce qui disparaît, et ce que cela coûte.

**La mise en page.** Markdown n’a pas de colonnes, pas de flottants, pas de largeurs et pas d’autre ordre que celui du texte. Un comparatif sur deux colonnes posé sur une grille devient une colonne après l’autre : tout ce qui venait de gauche, puis tout ce qui venait de droite. Les mots sont tous là et la relation entre eux a disparu. Si c’est la mise en page qui portait le sens — un avant-après, deux options côte à côte — alors le Markdown n’est pas une copie avec pertes, c’est une copie fausse, et aucune option de convertisseur n’y remédie.

**Les classes, les identifiants et les styles en ligne.** Ils s’évaporent, et c’est bien ainsi : Markdown n’a pas de mise en forme. Mais ils sont fréquemment la seule chose qui signale un encadré, un avertissement, une note d’obsolescence ou une citation mise en exergue. Du HTML qui dit `<div class="warning">` devient un paragraphe ordinaire, et le lecteur perd le signal indiquant que ce paragraphe-là est celui qui compte. Un convertisseur doté de règles par élément — Turndown, markdownify, la bibliothèque Go — peut recevoir l’instruction de transformer une classe connue en bloc de citation ou en préfixe gras. C’est une règle par classe, écrite par vous, pour chaque site.

**Les tableaux imbriqués et les cellules fusionnées.** Les tableaux GFM sont une grille de cellules simples : pas de `rowspan`, pas de `colspan`, pas de contenu en blocs, et certainement pas de tableau à l’intérieur d’une cellule. Le greffon de tableaux de la bibliothèque Go traite les fusions en les dépliant, ce qui est la meilleure réponse disponible et n’est toujours pas l’original. Un tableau imbriqué dans une cellule n’a aucune représentation du tout, et les convertisseurs l’aplatissent, le suppriment ou laissent du `<table>` brut au milieu de votre Markdown. Les tableaux sont ce que l’on perd le plus souvent, dans les deux sens, et [la manière dont les tableaux cassent à la conversion](/blog/markdown-tables-that-survive-conversion) mérite d’être connue avant de convertir un document qui en dépend.

**Tout ce qui est interactif.** Les formulaires, les boutons, les éléments `<details>`, les onglets, les accordéons, les lecteurs intégrés, le canvas, le SVG. Markdown sait porter un lien vers une chose mais pas la chose. Les convertisseurs divergent sur le fait de les supprimer ou d’émettre du HTML brut, et du HTML brut dans du Markdown est une décision à conséquences : il survit si le moteur de rendu suivant autorise le HTML brut, il est échappé en soupe de balises visible si le suivant ne l’autorise pas.

**Les URL relatives.** Celle-ci est silencieuse et casse des choses des semaines plus tard. Une page écrite avec `src="/img/diagram.png"` se convertit en Markdown portant exactement ce chemin, et ce chemin se résout désormais par rapport à l’endroit où le Markdown a atterri, qui n’est pas le site d’origine. Chaque image et la moitié des liens pointent vers rien. Certains outils réécrivent les URL relatives en absolues à partir de l’adresse de la page ; une bibliothèque nue qui convertit un fichier sur le disque n’a aucune adresse d’où partir. Vérifiez les trois premiers liens de toute page convertie, car [des liens et des images qui fonctionnent encore après la conversion](/blog/images-and-links-that-still-work) n’arrivent pas par accident.

**Le code, parfois.** Un bloc `<pre><code>` se convertit en général proprement. Un bloc de code dont la coloration repose sur des `<span>` par jeton — c’est ce qu’émet tout coloriseur syntaxique — devient un bloc clôturé si le convertisseur est raisonnable, et un fatras de caractères égarés s’il ne l’est pas. Le langage figure normalement dans un nom de classe du genre `language-python`, et un convertisseur qui le lit vous donne une clôture annotée, tandis que celui qui ne le lit pas donne une clôture nue et perd la coloration de l’autre côté. [Ce qui survit réellement dans un bloc de code](/blog/code-blocks-in-markdown) est la partie vérifiable : convertissez-en un et regardez-le.

**Et la différence entre une page et un article.** Voilà le coût réel, et ce n’est pas un problème de syntaxe. Convertir un article propre — une page de documentation, un chapitre exporté, un fragment écrit à la main — est un problème résolu, et tous les outils présentés ici s’en tirent bien. Convertir une page entière est un autre métier. Une page d’actualité enregistrée contient un bandeau de titre, une barre de navigation, une bannière de cookies, une invitation à s’abonner, une liste d’articles connexes, une section de commentaires, un pied de page à soixante liens et une mention légale. Passez-la dans un convertisseur nu et vous obtenez tout cela en Markdown, dans l’ordre de lecture, avec l’article quelque part au milieu. La conversion est correcte et la sortie est inutilisable.

Les coûts d’une erreur à cet endroit sont précis. Si vous convertissez pour qu’un humain lise, il ne lira pas, et il accusera l’outil plutôt que l’étape d’extraction manquante. Si vous convertissez pour un index de recherche ou pour un modèle, vous venez d’indexer le même menu de navigation une fois par page, ce qui évince le contenu que vous vouliez stocker. Et si vous convertissez de nombreuses pages, vous découvrirez le problème à l’échelle : mille documents, chacun commençant par les mêmes quarante lignes. Le remède est toujours le même et toujours en amont — soit un extracteur avant le convertisseur, soit un outil qui retire le mobilier structurel, soit un sélecteur qui nomme l’élément que vous voulez vraiment. Décider cela après coup revient à tout convertir deux fois.

## Comment choisir

1. **Demandez-vous si votre entrée est une page ou un fragment.** Un fragment a besoin d’un convertisseur. Une page entière a besoin d’une extraction d’abord, sinon le convertisseur traduira fidèlement le bandeau de cookies et vous corrigerez à la main pendant une heure.
2. **Convertissez un fichier représentatif avant de vous engager.** Pas le plus simple — celui qui porte le tableau, le bloc de code et l’encadré. L’outil qui garde ces trois-là garde presque tout le reste, et vous le saurez en une minute plutôt qu’après deux cents documents.
3. **Décidez de ce qu’il advient de ce que Markdown ne sait pas exprimer.** Supprimé, gardé en HTML brut, ou approximé : choisissez délibérément. Si le Markdown part vers un endroit qui échappe le HTML brut, le garder revient à le corrompre.
4. **Mettez en balance le nombre d’installations et le nombre de conversions.** Un seul fichier ne justifie pas un gestionnaire de paquets, un environnement d’exécution et un arbre de dépendances. Une tâche nocturne ne justifie pas un onglet de navigateur et une personne pour cliquer dedans.
5. **Vérifiez où va le fichier.** Un convertisseur en ligne qui téléverse détient votre document, ce qui est sans importance pour une page publique et constitue toute la question pour une page interne. La conversion côté navigateur est vérifiable : ouvrez le panneau réseau et regardez ne rien se passer.
6. **Regardez les liens et les images de la sortie, pas seulement le texte.** Des URL relatives qui se convertissent en URL relatives, c’est l’échec qui ressemble à une réussite, et il n’apparaît que lorsque quelqu’un d’autre ouvre le fichier ailleurs.

## Conclusion

Le meilleur convertisseur HTML vers Markdown est celui qui réussit l’extraction — [le mode d’emploi détaille chaque point de départ](/blog/convert-html-to-markdown) — parce que la traduction est presque devenue un produit de base et que l’extraction est l’origine de tout résultat décevant. Pour une page que vous avez sous les yeux, clippez-la avec une extension qui fait d’abord tourner un extracteur. Pour un fichier que vous avez déjà, [la conversion HTML vers Markdown de TransformPipe](/html-to-markdown) retire le mobilier de la page, garde les tableaux, les blocs de code et les listes de tâches, et le fait dans votre navigateur, sans rien téléverser et sans rien installer. Pour un build ou un script, prenez la bibliothèque de votre langage — Turndown, markdownify, node-html-markdown, le CLI en Go, [comparés côte à côte sur les règles, les tableaux, les blocs de code et les espaces](/blog/turndown-and-html-to-markdown-libraries) — et acceptez que la mise en page, la mise en forme et les tableaux imbriqués ne feront pas le voyage. Cette perte n’est pas un défaut de l’outil. C’est la définition même de Markdown, et la raison pour laquelle le fichier est lisible à l’arrivée.

## FAQ

### Quel est le meilleur convertisseur HTML vers Markdown gratuit ?

Pour un fichier unique, un convertisseur qui tourne dans le navigateur est la meilleure option gratuite : rien à installer, rien à téléverser, et du Markdown en retour en une seconde, sans frais. Côté code, Turndown en JavaScript, markdownify en Python et le CLI Go html-to-markdown sont tous gratuits et sous licence MIT, et Pandoc est gratuit sous GPL.

### Comment convertir une page web entière en Markdown ?

Prenez un clipper, pas un convertisseur. Une extension comme MarkDownload ou l’Obsidian Web Clipper fait d’abord passer un extracteur sur la page affichée, ce qui écarte la navigation et les bandeaux, et ne convertit qu’ensuite ce qui reste. Enregistrer la page en `.html` et convertir le fichier vous donne la page entière, mobilier compris.

### Pourquoi mon Markdown converti est-il plein de liens de navigation ?

Parce que vous avez converti la page et non l’article. Les convertisseurs nus traduisent chaque élément que vous leur confiez, et une page enregistrée n’est majoritairement pas l’article. Soit vous extrayez d’abord le contenu avec quelque chose comme Readability, soit vous prenez un outil qui retire les éléments structurels — entêtes, navigation, pieds de page, scripts — avant de convertir.

### Les convertisseurs HTML vers Markdown gardent-ils les tableaux ?

Certains oui, certains ont besoin d’un greffon, et aucun n’en garde un compliqué. Turndown réclame `turndown-plugin-gfm` pour les tableaux ; node-html-markdown, html-to-md et la bibliothèque Go les gèrent directement. Aucun convertisseur ne peut conserver fidèlement un tableau imbriqué ou une cellule fusionnée, parce que les tableaux GFM sont une grille plate de cellules simples.

### Puis-je convertir du HTML en Markdown en ligne de commande ?

Oui. Pandoc lit le HTML et écrit du GFM, html2text est un CLI Python, et le projet Go html-to-markdown livre un binaire `html2markdown` installable qui lit l’entrée standard. Pour une tâche à l’intérieur d’une intégration continue, un convertisseur doté d’une API REST ou d’une action GitHub retire l’installation de votre exécuteur.

### Qu’advient-il du CSS et des styles en ligne ?

Ils sont jetés, parce que Markdown n’a pas de mise en forme. C’est généralement ce que vous voulez, et occasionnellement une perte réelle : un nom de classe est souvent la seule marque distinguant un encadré d’avertissement, une note ou une citation en exergue d’un paragraphe ordinaire. Les convertisseurs à règles par élément savent faire correspondre une classe connue à un bloc de citation ou à un préfixe gras, mais cette règle, c’est vous qui l’écrivez.

### Est-il sûr de convertir un fichier HTML que quelqu’un m’a envoyé ?

Convertir est sûr au sens où la sortie est du Markdown, c’est-à-dire du texte. Les risques sont ailleurs : ouvrir d’abord le HTML dans un navigateur exécute ce qu’il contient, et le Markdown peut transporter du HTML brut jusqu’au moteur de rendu suivant si le convertisseur le laisse passer. Convertissez sans ouvrir, et vérifiez si votre convertisseur retire les `<script>` ou les garde.
