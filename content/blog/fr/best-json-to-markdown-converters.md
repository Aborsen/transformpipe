---
title: "Les meilleurs convertisseurs JSON vers Markdown en 2026 : comparés et testés"
description: "Comparatif des voies qui font du JSON un Markdown lisible — jq, jtbl, Miller, pandas et le navigateur — par les formes gérées et les décisions prises pour vous"
date: 2026-09-08
tag: Conversion
keywords: convertisseur json vers markdown, convertir json en tableau markdown, json vers markdown en ligne, jq json vers markdown, json lines vers markdown, json imbriqué vers markdown, json vers markdown python, convertir json en markdown en ligne de commande
---

JSON n’a pas de titres. Il n’a pas non plus de paragraphes, pas de gras, pas de tableaux et pas de listes au sens où Markdown emploie le mot. Il a des objets, des tableaux, des chaînes, des nombres, des booléens et null, et c’est là tout son vocabulaire. Markdown, lui, a des titres, des paragraphes, des listes, des tableaux et des blocs de code. Rien dans l’une ou l’autre spécification ne dit lequel du premier ensemble devient lequel du second : chaque convertisseur JSON vers Markdown a donc inventé sa propre réponse, et les réponses divergent. C’est là la vraie différence entre les outils de cette page — pas la vitesse, pas la licence, mais ce que chacun a décidé de l’allure que devaient avoir vos données.

### En bref

Choisissez sur la forme de votre fichier, pas sur la liste de fonctionnalités de l’outil. Un **tableau d’objets plats** — la forme qu’ont la plupart des réponses d’API et des exports — est la seule forme au sujet de laquelle un tableau Markdown soit honnête, et presque tout ce qui suit sait la mettre en tableau. Les **objets imbriqués** sont l’endroit où les outils divergent : certains aplatissent les clés en noms de colonnes pointés, certains transforment chaque niveau en titre jusqu’à épuiser les niveaux de titre, certains renoncent et impriment du JSON. **JSON Lines** — un enregistrement par ligne, ce qu’est en général un export de journal — n’est pas du JSON valide, et la moitié de ces outils rejettent donc le fichier d’emblée. Un convertisseur dans le navigateur prend les décisions de forme à votre place et vous dit lesquelles ; jq, Miller et jtbl vous laissent les prendre vous-même en ligne de commande ; pandas est la réponse à l’intérieur d’un script Python.

## Pourquoi « il convertit le JSON » ne vous apprend presque rien

Convertir du Markdown en HTML est une traduction entre deux formats de document qui s’accordent largement sur ce qu’est un document. Convertir du JSON en Markdown n’est pas une traduction du tout. C’est une interprétation, et l’outil devine une intention. `{"name": "Ada", "roles": ["admin", "billing"]}` pourrait raisonnablement être un titre appelé Name avec un paragraphe dessous, une étiquette en gras suivie d’une valeur, un tableau de deux lignes, une liste à puces ou une liste de définitions. Une personne raisonnable choisirait différemment selon que cet objet est un enregistrement parmi des milliers ou le fichier entier.

La première chose à établir au sujet de n’importe quel outil d’ici est donc quelles formes il reconnaît et ce qu’il fait de chacune. Il n’y a que quatre questions qui comptent. Qu’advient-il d’un tableau d’objets ? Qu’advient-il d’un tableau de valeurs simples ? Qu’advient-il de l’imbrication, et jusqu’à quelle profondeur l’outil la suit-il avant de s’arrêter ? Et qu’advient-il d’un fichier qui n’est pas du tout une seule valeur JSON ?

Les réponses figurent rarement sur la page d’accueil de l’outil, et elles sont le produit tout entier. Un convertisseur qui transforme chaque objet en un tableau clé-valeur à deux colonnes rendra un export de 900 enregistrements sous la forme de 900 tableaux minuscules. Un convertisseur qui ne met en tableau que le tableau de premier niveau transformera en silence un objet imbriqué en chaîne de caractères, si bien qu’une colonne de votre tableau par ailleurs lisible contiendra `{"city":"Leeds","postcode":"LS1 1AA"}` dans une police proportionnelle sans chasse fixe. Les deux outils « convertissent le JSON en Markdown ». Aucun des deux résultats n’est ce que vous aviez demandé.

La deuxième chose à établir est où va le fichier. Les exports JSON contiennent, de façon disproportionnée, des choses que vous ne colleriez pas dans la zone de texte d’un inconnu : fiches d’utilisateurs, historiques de commandes, réponses d’API avec des jetons dedans, un extrait de base de données que quelqu’un vous a envoyé pour avis. Un convertisseur qui tourne dans votre navigateur ou sur votre propre machine empêche la question de se poser. Un convertisseur hébergé ne l’empêche pas, et la version honnête de ce compromis est qu’il dépend entièrement du fichier.

## Comparatif rapide : l’aide-mémoire

| Outil | Idéal pour | Capacité principale | Prix |
| --- | --- | --- | --- |
| TransformPipe | Lire un fichier JSON comme un document | Tableaux, sections et listes choisis selon la forme, dans le navigateur, sans rien téléverser | Gratuit |
| jq | Décider de la forme vous-même | Filtre et remodèle le JSON ; le Markdown, c’est vous qui l’écrivez | Gratuit, MIT |
| jtbl | Un tableau dans un terminal, JSON Lines compris | Lit stdin, `-m` imprime un tableau Markdown | Gratuit, MIT |
| Miller (`mlr`) | Les gros fichiers et le brassage de formats | Lit JSON et JSON Lines, `--omd` écrit du Markdown | Gratuit, BSD 2-clause |
| json2md | Construire un document, pas en convertir un | Un format d’instructions qui émet titres, listes, tableaux, code | Gratuit, MIT |
| pandas + tabulate | À l’intérieur d’un script Python | `read_json`, `json_normalize`, `to_markdown` | Gratuit, BSD 3-clause |
| Extensions VS Code | Le fichier est déjà ouvert | Conversion locale dans l’éditeur ; la qualité varie selon l’extension | Gratuit |
| TableConvert | Un tableau collé dans un onglet de navigateur | Tableau JSON vers tableau Markdown, avec aperçu en direct | Gratuit (vérifié sur tableconvert.com, le 8 septembre 2026) |
| Un script écrit à la main | Une forme qui est la vôtre et qui est stable | Exactement la correspondance que vous voulez, et aucune autre | Gratuit |
| Un assistant | Un cas isolé que vous allez lire | Comprend l’intention ; laisse aussi tomber des lignes en silence | Variable |
| Pandoc | Pas cette tâche | Son lecteur `json` est l’AST propre à pandoc, pas vos données | Gratuit, GPL |

## Les meilleurs convertisseurs JSON vers Markdown en 2026

### TransformPipe — idéal pour lire un fichier JSON comme un document

Il convertit un fichier `.json` en Markdown dans votre navigateur et choisit un rendu par forme plutôt que d’appliquer une règle unique à tout. Il n’y a rien à installer et aucun compte n’est exigé, et, déconnecté, le fichier n’est envoyé nulle part : il est lu, analysé et rendu sur votre propre machine.

| Avantages | Inconvénients |
| --- | --- |
| Les règles de forme sont fixes et énoncées, la sortie est donc prévisible | Les règles sont celles de l’outil, pas les vôtres : aucun langage de gabarit |
| Lit JSON Lines aussi bien que JSON, sans qu’on le lui demande | Un document à la fois plutôt qu’un dossier entier |
| Rien n’est téléversé tant que vous n’êtes pas connecté | Le navigateur fait le travail : un très gros fichier est donc limité par la machine |
| Convertit aussi le Markdown en HTML, et le HTML, le Word et le CSV en Markdown | |

**Prix :** gratuit. Un compte ajoute l’historique, le partage et une API, gratuits eux aussi.

**Détails techniques et fonctionnalités**

- Un tableau d’objets dont toutes les valeurs sont scalaires devient un tableau, les clés servant de colonnes — collectées sur l’ensemble des lignes dans l’ordre de première apparition, si bien qu’un champ qui n’apparaît qu’au quarantième enregistrement obtient quand même sa colonne
- Un tableau de valeurs simples devient une liste à puces ; un tableau de choses dissemblables devient une section numérotée par élément
- Un objet place d’abord ses clés scalaires en étiquettes grasses, puis donne à chaque clé imbriquée son propre titre, de sorte que les faits de surface sont lisibles avant que les faits profonds ne commencent
- Au-delà de trois niveaux, une valeur est imprimée comme bloc `json` délimité plutôt que comme titre, parce qu’un titre à la profondeur sept n’est pas un titre
- `null` est écrit sous forme de `null` en italique plutôt que passé sous silence, et un tableau vide le dit, parce qu’absent et vide sont deux faits au sujet des données
- Les clés sont mises en forme pour l’affichage : `created_at` et `createdAt` ressortent tous deux en « Created at »
- La même conversion est disponible depuis une API REST, une CLI sans dépendances, une GitHub Action et un serveur MCP

**Pour qui ?** Pour quiconque dont l’étape suivante est « lire ceci » ou « envoyer ceci à quelqu’un ». Une réponse d’API, un export tiré d’un panneau d’administration, un fichier de journal que quelqu’un a joint à un ticket — les cas où vous voulez les données lisibles en une minute et où vous ne voulez ni écrire un script ni réfléchir à la forme.

### jq — idéal pour décider de la forme vous-même

jq est un processeur JSON en ligne de commande écrit en C portable, sans dépendance d’exécution. Il n’a aucune sortie Markdown et reste l’outil chez lequel la plupart des gens finissent, parce que la partie difficile de cette tâche n’est pas d’imprimer des barres verticales — c’est d’abord de sélectionner les bons enregistrements et de les aplatir en lignes.

| Avantages | Inconvénients |
| --- | --- |
| Remodèle n’importe quel JSON en n’importe quel autre JSON, c’est-à-dire le vrai problème | Aucune sortie Markdown : les lignes, c’est vous qui les construisez |
| Installé partout, aucune machine d’exécution, un seul binaire | Son propre langage, et une vraie courbe d’apprentissage |
| Se compose avec tous les autres outils au travers d’un tube | Un long filtre dans un script shell est du code qui ne se relit pas |
| Traite JSON Lines naturellement, une valeur à la fois | Obtenir la ligne d’en-tête et le séparateur corrects se fait à la main |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctionnalités**

- Un langage de filtres sur JSON : sélection, application, regroupement, tri et arithmétique
- `@tsv` et `@csv` produisent une sortie délimitée, que vous pouvez ensuite passer à une étape CSV vers Markdown plutôt que d’assembler un tableau à la main
- L’interpolation de chaînes permet d’émettre du Markdown directement — `"| \(.name) | \(.email) |"` par enregistrement — l’en-tête et la ligne de séparation restant à votre charge
- `--slurp` rassemble un flux de valeurs en un seul tableau, et c’est ainsi qu’on fait se comporter un fichier JSON Lines comme un fichier JSON
- `-r` imprime les chaînes brutes au lieu de JSON entre guillemets, et c’est l’option que les gens oublient avant de se demander pourquoi chaque cellule est entourée de guillemets

**Pour qui ?** Pour quiconque connaît déjà jq, et pour quiconque a un fichier à filtrer avant de le mettre en forme. Si la réponse comporte « seulement les requêtes en échec, groupées par jour », il vous faut jq ou son équivalent avant qu’un convertisseur quel qu’il soit ne devienne pertinent. Il occupe la même place dans une chaîne de traitement qu’[une étape Markdown vers HTML en ligne de commande](/blog/markdown-to-html-from-the-command-line) : un maillon qui fait une seule chose à du texte.

### jtbl — idéal pour un tableau dans un terminal, JSON Lines compris

jtbl est un petit outil en ligne de commande écrit en Python qui lit du JSON sur l’entrée standard et l’imprime sous forme de tableau. Sa sortie par défaut est un tableau de terminal, et `-m` transforme ce tableau en Markdown.

| Avantages | Inconvénients |
| --- | --- |
| Lit un tableau JSON d’objets ou du JSON Lines, sans option à passer | Des tableaux et rien d’autre : il n’a aucun autre rendu |
| `-m` pour Markdown, `-c` pour CSV, `-H` pour HTML | Les valeurs imbriquées doivent être aplaties avant qu’il ne les voie |
| Conçu pour les tubes, jq se place donc devant | Une installation Python, donc pas toujours disponible sur un serveur |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctionnalités**

- L’entrée est du JSON acheminé sur stdin : soit un tableau JSON d’objets, soit du JSON Lines
- Les formats de sortie se choisissent par option : tableau texte par défaut, sinon Markdown, CSV, HTML ou un tableau dessiné plus élaboré
- Prévu pour se placer en bout d’une chaîne `jq`, et c’est exactement là que la division du travail a du sens — jq décide des lignes, jtbl les imprime

**Pour qui ?** Pour les gens qui travaillent dans un terminal et veulent le tableau tout de suite. C’est le plus court chemin honnête entre un journal JSON Lines et un tableau Markdown collable dans un ticket.

### Miller (`mlr`) — idéal pour les gros fichiers et le brassage de formats

Miller est un processeur de données en ligne de commande écrit en Go, sans dépendance d’exécution. Il lit CSV, TSV, JSON et JSON Lines, et il écrit du Markdown, ce qui en fait l’outil rare où cette conversion est un format de sortie intégré plutôt que quelque chose à assembler.

| Avantages | Inconvénients |
| --- | --- |
| Markdown est un format de sortie de première classe (`--omd`) | Son propre vocabulaire de verbes et d’options à apprendre |
| Lit JSON Lines directement (`--ijsonl`), sans slurp | Orienté enregistrement : un JSON profondément imbriqué doit d’abord être aplati |
| Travaille en flux, la taille du fichier n’est donc pas un problème de mémoire | Une installation, et un terminal |
| Un seul outil pour filtrer, trier, découper et imprimer | Pas interactif : aucun aperçu, aucune annulation |

**Prix :** gratuit, sous licence BSD 2-clause.

**Détails techniques et fonctionnalités**

- Les formats d’entrée comprennent JSON, JSON Lines, CSV, TSV et les données indexées par position ; `--ijson` et `--ijsonl` déclarent celui que vous avez
- `--omd` écrit une sortie Markdown ; `--omd-aligned` complète les colonnes à une largeur uniforme pour que le fichier brut soit lisible lui aussi
- Depuis Miller 6.11.0, Markdown est pris en charge comme format d’entrée en plus du format de sortie (vérifié sur miller.readthedocs.io, le 8 septembre 2026)
- Des verbes comme `cut`, `filter`, `sort` et `head` s’exécutent avant l’écrivain : vous pouvez donc réduire un gros export aux seules colonnes dignes d’un tableau dans la même commande

**Pour qui ?** Pour quiconque a un fichier trop gros pour être ouvert, un export JSON Lines, ou l’habitude de convertir déjà entre CSV et JSON. Si vous devez installer un seul outil en ligne de commande pour cette tâche, installez celui-là.

### json2md — idéal pour construire un document, pas pour en convertir un

json2md est une bibliothèque JavaScript qui transforme une structure JSON bien précise en Markdown. La distinction compte plus que tout le reste de cette page : il ne lit pas votre JSON. Il lit une description JSON d’un document Markdown, dans sa forme à lui, et imprime ce document.

| Avantages | Inconvénients |
| --- | --- |
| Émet une vraie structure de document : titres, paragraphes, listes, tableaux, code, liens | Vos données doivent d’abord être transformées dans sa forme d’entrée |
| Une petite dépendance dans un projet Node | Malgré son nom, ce n’est pas un convertisseur de JSON quelconque |
| Extensible avec vos propres convertisseurs pour de nouveaux types de blocs | JavaScript uniquement |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctionnalités**

- Installé depuis npm et utilisé comme fonction dans Node ou dans un bundle
- Ses types de blocs documentés couvrent `h1` à `h6`, les paragraphes, les citations, les images, les listes ordonnées et non ordonnées, les blocs de code, les tableaux, les liens et les filets horizontaux
- L’entrée est un tableau d’objets à clé unique — un titre, puis un paragraphe, puis un tableau — la correspondance entre vos données et un document est donc du code que vous écrivez, la bibliothèque se chargeant de l’échappement et de la mise en page

**Pour qui ?** Pour les développeurs qui produisent un document Markdown à partir de données dans un service Node : un rapport nocturne, un journal des modifications, un récapitulatif envoyé par courriel à une équipe. C’est le mauvais outil pour regarder un fichier JSON qu’on vous a envoyé, et le bon pour produire un document à partir d’enregistrements que vous comprenez.

### pandas plus tabulate — idéal à l’intérieur d’un script Python

pandas lit du JSON dans un DataFrame et écrit du Markdown à partir d’un DataFrame. `read_json` s’occupe de l’analyse, `json_normalize` aplatit l’imbrication en colonnes, et `to_markdown` imprime le tableau.

| Avantages | Inconvénients |
| --- | --- |
| Aplatissement, filtrage, tri et typage dans une seule bibliothèque | Une dépendance lourde pour un seul tableau |
| `json_normalize` traite l’imbrication de façon prévisible | L’aplatissement multiplie vite les colonnes |
| Déjà installé dans la plupart des travaux sur données | Des tableaux et rien d’autre : un DataFrame n’est pas un document |

**Prix :** gratuit. pandas est sous licence BSD 3-clause ; `tabulate`, dont `to_markdown` a besoin, est sous MIT.

**Détails techniques et fonctionnalités**

- `pandas.read_json` pour un tableau JSON d’enregistrements ; `lines=True` pour JSON Lines
- `pandas.json_normalize` aplatit les clés imbriquées en noms de colonnes pointés : un enregistrement portant un objet `address` devient des colonnes `address.city` et `address.postcode`
- `DataFrame.to_markdown()` exige le paquet `tabulate` et renvoie le tableau sous forme de chaîne
- L’index est inclus par défaut, et c’est pourquoi la première colonne de votre tableau est une suite anonyme de `0`, `1`, `2` jusqu’à ce que vous passiez `index=False`
- `tablefmt` est transmis à tabulate, où `github` désigne le tableau à barres verticales du style GFM et `pipe` ajoute les deux-points d’alignement

**Pour qui ?** Pour quiconque est déjà dans un script Python ou un carnet. Si le JSON demande une véritable analyse avant de devenir un tableau, c’est de toute façon là que vous alliez — et le même raisonnement qui fait de [Python un endroit sensé pour l’étape Markdown vers HTML](/blog/markdown-to-html-in-python) s’applique ici.

### Les extensions VS Code — idéales si le fichier est déjà ouvert

Le Marketplace propose des extensions qui convertissent une sélection JSON en tableau Markdown, et si le fichier est déjà dans votre éditeur, c’est le chemin le plus court qui soit. C’est aussi l’option où il faut regarder l’extension plutôt que la catégorie.

| Avantages | Inconvénients |
| --- | --- |
| Aucun nouvel outil, aucun terminal, aucun téléversement | La qualité et l’entretien varient énormément |
| Travaille sur une sélection : vous pouvez convertir une partie d’un fichier | La plupart traitent un tableau plat et rien d’autre |
| La conversion a lieu localement dans l’éditeur | Une extension abandonnée est un risque silencieux |

**Prix :** gratuit.

**Détails techniques et fonctionnalités**

- Les extensions s’exécutent dans le processus de l’éditeur : une extension locale convertit donc localement — mais vérifiez-le, car certaines appellent un service hébergé
- La plupart des implémentations prennent un tableau d’objets et produisent un tableau à barres verticales ; l’imbrication, le traitement de `null` et l’échappement des barres sont les points où elles diffèrent
- La prise en charge du JSON propre à VS Code — mise en forme, repliement, validation de schéma — est autre chose et ne produit pas de Markdown

**Pour qui ?** Pour les développeurs qui convertissent un fragment au passage. Vérifiez ce que l’extension fait d’un objet imbriqué et d’une valeur contenant une barre verticale avant de lui confier quoi que ce soit que vous transmettrez ensuite.

### TableConvert — idéal pour un tableau collé dans un onglet de navigateur

TableConvert est un convertisseur de tableaux en ligne, doté d’une page JSON vers Markdown : collez un tableau JSON, récupérez un tableau Markdown, modifiez-le dans une grille si vous le souhaitez.

| Avantages | Inconvénients |
| --- | --- |
| Coller et partir, avec un aperçu en direct | Des tableaux et rien d’autre, à partir d’un tableau d’objets |
| Sa page indique que la conversion a lieu localement dans le navigateur | L’imbrication et JSON Lines ne sont pas son affaire |
| Une grille modifiable entre l’entrée et la sortie | Un site parmi beaucoup de semblables, qui diffèrent par ce qu’ils font de vos données |

**Prix :** gratuit, sans inscription (vérifié sur tableconvert.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- L’entrée est un tableau JSON collé, un fichier téléversé, ou un tableau extrait d’une page
- Les formats de sortie comprennent Markdown à côté des autres formats de tableaux que le site gère
- La grille intermédiaire permet de renommer une colonne ou de supprimer une ligne avant de récupérer le Markdown

**Pour qui ?** Pour quiconque a un tableau plat dans le presse-papiers et un trou en forme de tableau à combler. Pour un fichier entier, ou un fichier qui a de la structure, un convertisseur qui lit d’autres formes que « tableau d’objets » vous épargnera le remodelage.

### Un script écrit à la main — idéal quand la forme est la vôtre et qu’elle ne changera pas

Trente lignes dans le langage que vous utilisez déjà, faisant correspondre votre JSON à votre Markdown. Tous ceux qui font cette conversion plus de deux fois finissent ici, et pour une forme interne stable, c’est la bonne réponse.

| Avantages | Inconvénients |
| --- | --- |
| Exactement la correspondance que vous voulez, et rien d’autre | Les cas limites vous appartiennent désormais |
| Aucune dépendance, dans la plupart des langages | À réécrire quand la forme change |
| S’accorde à votre build, à votre intégration continue, à vos conventions de nommage | Personne d’autre dans l’équipe ne connaît les règles |

**Prix :** gratuit, et coûte un après-midi.

**Détails techniques et fonctionnalités**

- Tous les langages courants analysent le JSON dans leur bibliothèque standard : l’analyse n’est donc pas le travail
- Le travail, ce sont les quatre décisions : tableau, liste, section ou repli en bloc délimité — plus l’échappement
- Échappez les barres verticales et les antislashs dans les cellules, et remplacez les retours à la ligne à l’intérieur d’une cellule par `<br>`, parce qu’une ligne de tableau Markdown ne peut pas contenir de saut de ligne
- Décidez de quoi auront l’air `null`, `""`, `0`, `false` et une clé manquante, et écrivez-le quelque part, parce qu’un lecteur ne peut pas les distinguer d’une cellule vide

**Pour qui ?** Pour les équipes qui ont un export récurrent et une opinion arrêtée sur la façon dont il doit se lire. Pas pour la personne qui a un fichier aujourd’hui.

### Un assistant — idéal pour un cas isolé que vous allez lire

Coller du JSON dans un assistant et demander un tableau Markdown fonctionne, comprend l’intention mieux que n’importe quelle règle, et reste l’option la moins digne de confiance d’ici pour tout ce que vous ne vérifierez pas.

| Avantages | Inconvénients |
| --- | --- |
| Déduit ce que les données veulent dire, pas seulement leur forme | Des lignes disparaissent et personne ne vous le dit |
| Traite les enregistrements désordonnés et irréguliers avec élégance | Les valeurs sont rangées, réordonnées et reformatées |
| Rien à installer, aucun code | Vos données partent vers un service, sauf si le modèle est local |

**Prix :** variable selon le service et l’offre ; consultez la page du fournisseur.

**Détails techniques et fonctionnalités**

- À réserver aux données que vous pouvez embrasser du regard : si vous ne pouvez pas compter les lignes de la sortie, vous ne pouvez pas la vérifier
- Un convertisseur déterministe et un assistant se contredisent de façon utile — lancez les deux sur le même fichier, et le diff vous montre quelles cellules ont été « obligeamment » modifiées
- Un serveur MCP place une conversion déterministe à l’intérieur de l’assistant, et c’est la version qui vaut la peine : le modèle décide de ce qu’il faut convertir, le convertisseur décide de ce qu’est la sortie
- La sortie est du Markdown, qui doit encore devenir quelque chose qu’une personne puisse ouvrir — [amener la sortie d’un assistant sur une page partageable](/blog/ai-output-to-a-shareable-page) est une étape à part entière

**Pour qui ?** Pour quiconque a un cas isolé peu commode et la patience de le vérifier. Pour personne dont le rapport part chez un client.

### Pandoc — l’outil qui ne fait pas cela

Pandoc convertit entre une quarantaine de formats de document, et celui-ci n’en fait pas partie. Son format d’entrée `json` est « la version JSON de l’AST natif » — l’arbre documentaire propre à pandoc sérialisé en JSON, pas vos données. Lui donner une réponse d’API produit une erreur, pas un document.

**Pour qui ?** Pour personne, s’agissant de cette conversion. Pandoc est la bonne réponse pour [Markdown vers HTML et les formats qui l’entourent](/blog/best-markdown-to-html-converters), et le mauvais endroit où chercher du JSON.

## Ce que les tableaux comparatifs laissent de côté

Chacun des outils ci-dessus produira du Markdown à partir de JSON. Ce qui décide si le résultat est lisible, c’est un ensemble de décisions qu’aucun d’eux ne met en avant.

**Le tableau d’objets plats est la seule forme au sujet de laquelle un tableau soit honnête.** Un tableau a une ligne par enregistrement et une colonne par champ : il lui faut donc des enregistrements ayant les mêmes champs et des valeurs qui sont des choses uniques. C’est à cela que ressemblent d’ordinaire une réponse d’API, un CSV converti en JSON et un export de base de données, et c’est pourquoi tous les outils d’ici savent le traiter et pourquoi tant d’entre eux s’arrêtent là. À l’instant où une valeur est elle-même un objet ou un tableau, le tableau doit mentir : soit la cellule contient un fragment de JSON changé en chaîne, soit le nombre de colonnes explose, soit les données imbriquées sont abandonnées. Il n’y a pas de quatrième possibilité. Un outil qui aplatit — pandas avec `json_normalize`, la plupart des outils en ligne de commande avec une étape d’aplatissement explicite — choisit l’explosion du nombre de colonnes, et un enregistrement portant trois objets imbriqués peut devenir un tableau de trente colonnes que personne ne peut lire. Un outil qui refuse de mettre en tableau un enregistrement à valeurs imbriquées choisit les sections à la place, ce qui est plus long et lisible.

**Les tableaux de valeurs simples sont des listes, et les traiter comme des tableaux est l’erreur classique.** `["admin", "billing", "read-only"]` est une liste à puces. Rendu sous forme de tableau, il devient un tableau d’une colonne coiffé d’un en-tête vide de sens, ce qui est pire que le JSON brut. Rendu sous forme de chaîne jointe par des virgules à l’intérieur de la cellule de quelqu’un d’autre, il convient parfaitement — jusqu’au moment où l’une des valeurs contient une virgule.

**L’imbrication doit cesser de devenir des titres quelque part, et c’est l’outil qui choisit où.** Markdown a six niveaux de titre. JSON en a autant qu’il lui plaît. Un convertisseur qui fait correspondre la profondeur au niveau de titre arrive au bout à six, puis soit ramène tout ce qui est plus profond à `######`, ce qui aplatit une vraie structure en fratrie apparente, soit continue de produire un balisage plus profond qu’aucun moteur de rendu n’affiche différemment. L’autre solution est de s’arrêter plus tôt et d’imprimer le sous-arbre restant comme bloc de code délimité, ce qui reconnaît honnêtement la défaite : la structure est visible, indentée, et manifestement un déversement de données plutôt que de la prose. Le convertisseur dans le navigateur évoqué plus haut s’arrête à trois niveaux pour exactement cette raison. Quoi que fasse votre outil, renseignez-vous, parce qu’un document dont les titres s’échouent à la profondeur six a un sommaire qui ne veut rien dire.

**Null, vide, manquant et false sont quatre faits différents et une seule cellule vide.** Un convertisseur qui saute `null` produit une cellule qu’on ne peut distinguer d’une clé manquante, elle-même impossible à distinguer d’une chaîne vide. Dans un export de commandes, « aucune remise appliquée » et « champ remise absent de cet enregistrement » sont deux choses différentes, et un lecteur qui regarde deux cellules vides ne peut pas retrouver laquelle est laquelle. C’est le mode de défaillance qui rend un tableau converti subtilement faux plutôt que manifestement cassé, et il vaut la peine de le vérifier sur un fichier que vous connaissez avant de faire confiance à un fichier que vous ne connaissez pas.

**JSON Lines n’est pas du JSON valide, et c’est ce qu’est en général un export de journal.** Le format JSON Lines, c’est une valeur JSON par ligne, en UTF-8, terminée par un retour à la ligne. Chaque ligne s’analyse ; le fichier dans son ensemble, non, parce qu’une suite de valeurs sans tableau englobant n’est pas un document JSON. `JSON.parse` et `json.loads` échouent donc tous deux sur un fichier `.jsonl` parfaitement correct, et tout convertisseur qui appelle l’un d’eux sans solution de repli rejette le fichier avec une erreur de syntaxe qui pointe la ligne 2. Les outils diffèrent nettement ici : Miller et jtbl lisent JSON Lines nativement, pandas a besoin de `lines=True`, jq veut `--slurp` pour en faire un tableau, et un convertisseur de navigateur qui se rabat sur une analyse ligne à ligne lit le fichier sans qu’on le lui dise. Si vos données sortent d’une chaîne de journalisation, d’une file de messages ou de `docker logs`, c’est la première chose à tester et celle qui a le plus de chances de vous arrêter.

**Les barres verticales, les antislashs et les retours à la ligne dans les valeurs cassent le tableau que vous venez d’obtenir.** Une barre verticale termine une cellule dans un tableau Markdown partout où elle apparaît : une valeur comme `error | retrying` coupe donc une cellule en deux et décale le reste de la ligne. Un retour à la ligne à l’intérieur d’une valeur ne peut pas être exprimé du tout dans une ligne de tableau — le seul passage est `<br>`, c’est-à-dire du HTML dans votre Markdown. Tout convertisseur qui construit des tableaux en concaténant des chaînes sans échappement produira un tableau qui s’affiche de travers précisément pour les lignes contenant les données intéressantes, ce qui est un cas particulier du problème général que pose [la survie des tableaux à une conversion](/blog/markdown-tables-that-survive-conversion).

**L’ordre des clés est le seul ordre dont vous disposiez, et il n’est pas signifiant.** Les objets JSON n’ont pas d’ordre de clés défini dans la spécification, même si toute implémentation réelle conserve l’ordre du fichier. Les convertisseurs émettent donc les colonnes dans l’ordre où ils voient les clés pour la première fois, ce qui veut dire que l’ordre des colonnes de votre tableau est un accident dû à qui a écrit le sérialiseur. Pire : si des enregistrements ultérieurs portent un champ absent du premier, un convertisseur qui ne lit que le premier objet pour composer son en-tête abandonne silencieusement cette colonne pour toutes les lignes. Collecter les clés sur l’ensemble des enregistrements est le comportement correct, et non le comportement universel.

**Les nombres, les dates et les identifiants cessent d’être eux-mêmes.** Markdown n’a pas de types. Un entier long reste lisible ; un flottant comme `0.30000000000000004` arrive exactement tel que JSON l’avait stocké ; un horodatage ISO reste un horodatage ISO, sauf si l’outil décide de l’enjoliver. Un zéro initial dans une référence produit survit s’il s’agissait d’une chaîne et disparaît s’il s’agissait d’un nombre. Rien de tout cela n’est la faute du convertisseur et tout cela atterrit dans votre document : un tableau converti est donc un instantané destiné à la lecture, pas un format d’échange de données. Si quelqu’un doit calculer dessus, envoyez-lui le JSON.

## Comment choisir

1. **Regardez votre fichier avant de regarder les outils.** Ouvrez-le et répondez à une seule question : est-ce un tableau d’enregistrements plats, ou est-ce un document imbriqué ? Si c’est le premier cas, presque tout ce qui est ici convient et vous devriez choisir par commodité. Si c’est le second, la plupart de ces outils produiront quelque chose d’illisible et il vous en faut un qui rende des sections plutôt qu’un qui rende des tableaux.
2. **Testez le cas JSON Lines s’il y a la moindre chance qu’il se présente.** Un fichier `.json` issu d’une application est en général une seule valeur ; un fichier `.json` ou `.jsonl` issu d’un journal, d’une file d’attente ou d’un export en masse est en général une valeur par ligne. Convertir avec la mauvaise hypothèse vous donne une erreur d’analyse dans le meilleur des cas, et le seul premier enregistrement dans le pire.
3. **Décidez si la sortie est destinée à la lecture ou au traitement.** Un tableau Markdown est un document. Si l’étape suivante est un tableur ou un script, convertissez plutôt en CSV et épargnez-vous l’aller-retour — vous perdrez les types dans les deux cas, et le CSV a au moins l’honnêteté de l’admettre.
4. **Mettez les installations en regard du nombre de fois où vous ferez cela.** Un fichier aujourd’hui ne justifie pas un gestionnaire de paquets. Un rapport nocturne ne justifie pas un onglet de navigateur et une personne dedans. Prendre cela à l’envers, c’est ainsi qu’une équipe se retrouve avec une étape de conversion non documentée qui ne tourne que sur un seul portable.
5. **Vérifiez ce qui est arrivé aux lignes peu commodes, pas aux trois premières.** Trouvez un enregistrement comportant un null, un objet imbriqué, une valeur contenant une barre verticale, et un champ que les autres enregistrements n’ont pas. Convertissez-le et lisez la sortie. Toutes les défaillances décrites sur cette page se révèlent dans ce seul test, et il prend deux minutes.

## Conclusion

Il n’existe pas de façon correcte de transformer du JSON en Markdown, ce qui veut dire que le meilleur convertisseur JSON vers Markdown est celui dont les décisions correspondent au fichier que vous avez devant vous. Quand la forme que vous avez est une liste d’enregistrements, [c’est la voie du tableau qu’il faut lire](/blog/convert-json-to-markdown-table). Pour un tableau d’enregistrements plats, choisissez par commodité : un onglet de navigateur, un tube dans un terminal, ou trois lignes de pandas. Pour un document imbriqué que vous devez vraiment lire, choisissez un outil qui rend des sections et des listes plutôt que de tout forcer dans un tableau, et vérifiez où il cesse de transformer la profondeur en titres. C’est ce que fait [la conversion JSON vers Markdown de TransformPipe](/json-to-markdown) dans le navigateur, gratuitement, avec des règles fixes et sans rien téléverser tant que vous n’êtes pas connecté. Pour tout ce qui est récurrent, Miller ou une chaîne jq dans un script survivront à ce que vous construirez à la main.

## FAQ

### Quel est le meilleur convertisseur JSON vers Markdown gratuit ?

Pour un fichier que vous voulez lire maintenant, un convertisseur qui s’exécute côté navigateur est la meilleure option gratuite : rien à installer, rien à téléverser, et il traite d’autres formes qu’un tableau plat. En ligne de commande, Miller et jtbl sont tous deux gratuits et open source, et tous deux écrivent des tableaux Markdown directement.

### Comment convertir du JSON en tableau Markdown ?

Si votre JSON est un tableau d’objets à valeurs scalaires, n’importe quel outil d’ici le fera : collez-le dans un convertisseur de navigateur, passez-le dans `jtbl -m`, lancez `mlr --ijson --omd cat`, ou appelez `to_markdown()` sur un DataFrame pandas. Si les objets contiennent des objets ou des tableaux imbriqués, aplatissez-les d’abord ou acceptez que le tableau contienne du JSON changé en chaîne dans certaines cellules.

### Puis-je convertir du JSON imbriqué en Markdown ?

Oui, mais pas en tableau. Le JSON imbriqué se convertit sensément en titres et en sections, chaque niveau d’imbrication devenant un niveau de titre jusqu’à ce que le convertisseur arrive au bout — six est la limite que Markdown lui donne, et la plupart des outils s’arrêtent plus tôt et impriment la profondeur restante en bloc de code délimité. Vérifiez où votre convertisseur trace cette ligne avant de convertir un fichier profondément imbriqué.

### Pourquoi mon fichier JSON refuse-t-il de se convertir ?

Le plus souvent parce que c’est du JSON Lines et non du JSON : une valeur JSON valide par ligne, ce que le fichier dans son ensemble n’est pas. Un analyseur à qui l’on donne ce fichier échoue à la deuxième ligne. Soit vous dites à votre outil que le fichier est délimité par lignes — `lines=True` dans pandas, `--ijsonl` dans Miller, `--slurp` dans jq — soit vous prenez un convertisseur qui se rabat de lui-même sur une analyse ligne à ligne.

### Convertir du JSON en Markdown fait-il perdre des données ?

Cela fait perdre les types, et cela peut faire perdre des distinctions. Markdown n’a aucune notion de nombre, de date ou de null : tout devient du texte, et un convertisseur qui rend `null` sous forme de cellule vide l’a rendu indistinguable d’un champ manquant ou d’une chaîne vide. Traitez le Markdown comme quelque chose à lire et gardez le JSON comme document de référence.

### Pandoc peut-il convertir du JSON en Markdown ?

Non, pas votre JSON. Le format d’entrée `json` de Pandoc est son propre AST documentaire sérialisé en JSON : il ne lit donc que les fichiers que Pandoc a lui-même produits. C’est le bon outil pour convertir entre formats de document et le mauvais pour des données.

### Faut-il utiliser jq ou un convertisseur ?

Les deux, en général. jq sert à choisir et à remodeler les enregistrements — filtrer, grouper, aplatir, sélectionner des colonnes — et un convertisseur sert à les imprimer. Un filtre jq qui assemble en plus le Markdown à la main fonctionne et devient vite impossible à maintenir : laissez donc les barres verticales et l’échappement à quelque chose dont c’est le métier.
