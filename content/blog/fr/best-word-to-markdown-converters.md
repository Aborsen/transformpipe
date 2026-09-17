---
title: "Les meilleurs convertisseurs Word vers Markdown en 2026 : toutes les voies possibles"
description: "Comparatif des façons de convertir Word en Markdown en 2026 — navigateur, Pandoc, mammoth, Google Docs, greffons Word — et ce qu’un .docx perd en chemin"
date: 2026-09-08
tag: Conversion
keywords: convertir word en markdown, convertisseur docx markdown, word vers markdown en ligne, meilleur convertisseur word markdown, convertir docx en markdown ligne de commande, convertir un document word sans téléverser, pandoc docx markdown, mammoth docx markdown
---

Un `.docx` est une archive zip pleine de XML. Décompressez-en un et vous obtenez `document.xml` pour le texte, `styles.xml` pour les styles nommés, `numbering.xml` pour les listes, un dossier `media` pour les images, et une poignée de parties qui décrivent les relations entre tout cela. Markdown est un fichier texte avec des astérisques dedans. Passer de l’un à l’autre n’est pas une traduction. C’est une décision, prise par l’outil que vous avez choisi, sur les parties de cette archive qui comptent et celles qui finissent par terre.

La décision reste en général invisible jusqu’à la lecture de la sortie. Les titres sont arrivés. Les paragraphes sont arrivés. Puis la liste numérotée commence à 1, repart à 1 à mi-chemin, et les sous-éléments se sont aplatis au premier niveau. Le tableau est passé en barres verticales mais la cellule d’en-tête fusionnée n’a pas survécu au voyage. L’exergue placé dans une zone de texte est purement absent, et rien nulle part ne vous a signalé sa disparition.

Chaque outil de cette page perd quelque chose. Ce qui les sépare, c’est ce qu’ils perdent, s’ils le disent, et si le fichier a quitté votre machine au passage. Ce sont trois questions distinctes et les pages des éditeurs n’en traitent aucune.

Voici donc un comparatif des voies pour faire entrer un document Word dans Markdown : les convertisseurs de navigateur, Pandoc, la bibliothèque mammoth et sa version navigateur, Google Docs et ses modules, un greffon qui vit à l’intérieur de Word lui-même, et la voie du copier-coller, qui fonctionne mieux qu’elle ne le mérite. Puis la partie honnête : la liste de ce qu’un `.docx` contient et pour quoi Markdown n’a aucune syntaxe, et ce que fait chaque outil quand il en rencontre un.

### En bref

Pour un document dont vous avez besoin maintenant, prenez un convertisseur de navigateur : aucune installation, et avec un outil côté navigateur le fichier n’est jamais téléversé, ce qui compte quand le document est un contrat plutôt qu’un README. Pour un dépôt entier de documents, ou pour tout ce qui exige le suivi des modifications et l’extraction des images, installez Pandoc : c’est le seul outil ici à offrir de vraies options sur les deux. Pour une conversion dans votre propre code, mammoth est la bibliothèque sur laquelle presque tout le reste est bâti, et sa propre documentation vous dit de produire du HTML et de convertir celui-ci en Markdown plutôt que d’utiliser son écrivain Markdown. Et acceptez les pertes d’emblée : polices, marges, sauts de page, zones de texte et commentaires n’ont aucun équivalent Markdown, donc aucun outil ne peut les garder et tout outil qui prétend le faire parle d’autre chose.

## Pourquoi convertir un .docx n’est pas une seule tâche

Lire un fichier Word, c’est faire quatre choses à la suite. Vous décompressez l’archive. Vous parcourez le XML, en résolvant le style et la numérotation de chaque paragraphe contre d’autres parties de l’archive. Vous décidez de ce que devient chaque élément ainsi résolu : un titre, un élément de liste, une ligne de tableau, ou rien. Puis vous sérialisez tout cela en Markdown, ce qui suppose de choisir un dialecte, car le CommonMark nu n’a ni tableaux ni texte barré.

Un outil peut être soigneux sur l’une de ces étapes et négligent sur la suivante. C’est à la deuxième que se produit l’essentiel des dégâts, et pour une raison qui mérite d’être comprise : dans un `.docx`, le sens est stocké par référence. Un titre n’est pas marqué comme titre. C’est un paragraphe dont le `w:pStyle` nomme un style, et c’est la définition de ce style — ailleurs, dans `styles.xml` — qui dit qu’il s’agit de Titre 1. Un élément de liste est un paragraphe porteur d’un élément `w:numPr` avec un `w:numId` et un `w:ilvl`, et savoir si c’est une puce ou un numéro se trouve dans `numbering.xml`, dans un niveau dont le `w:numFmt` dit `bullet` ou dit `decimal`.

Cette indirection explique pourquoi deux documents identiques à l’écran se convertissent différemment. Si quelqu’un a fabriqué ses titres en sélectionnant du texte et en le passant en gras 18 points, il n’y a aucune référence de style à résoudre, et tous les convertisseurs cités ici vous rendront un paragraphe. Le module pour Google Docs le dit dans son propre README : un texte seulement gras et gros se convertit en paragraphe normal. Ce n’est pas un bug du convertisseur. Il n’y a jamais eu de titre dans le fichier.

La quatrième étape décide du dialecte, et les mêmes règles valent que pour [le trajet inverse, de Markdown vers HTML](/blog/best-markdown-to-html-converters). Tableaux, barré et listes de tâches relèvent de GitHub Flavored Markdown, pas de CommonMark. Les notes de bas de page ne sont dans aucune des deux spécifications. La prise en charge des tableaux par un convertisseur est donc une affirmation sur le dialecte de sa sortie, pas sur la qualité de sa lecture de votre document, et on confond les deux sans arrêt.

## Comparatif rapide : l’aide-mémoire

| Outil | Idéal pour | Capacité principale | Prix |
| --- | --- | --- | --- |
| TransformPipe | Un document, maintenant, sans le téléverser | Lit le `.docx` dans le navigateur ; titres, listes, liens et tableaux en Markdown | Gratuit |
| Pandoc | Les lots, les chaînes automatisées et le suivi des modifications | `--track-changes`, `--extract-media`, ~40 formats | Gratuit, GPL |
| mammoth | Une conversion dans votre propre code | Versions Node et navigateur ; carte des styles Word vers des éléments | Gratuit, BSD-2-Clause |
| MarkItDown | Alimenter une chaîne de traitement avec de nombreux types de fichiers | CLI et bibliothèque Python, beaucoup de formats en entrée, Markdown en sortie | Gratuit, MIT |
| Google Docs (natif) | Un document déjà dans Drive | Fichier → Télécharger → Markdown (.md), et Copier au format Markdown | Gratuit avec un compte Google |
| Module Docs to Markdown | Convertir une partie d’un document Google | Panneau latéral dans Docs ; convertit une sélection, pas seulement le fichier | Gratuit, Apache 2.0 |
| Writage | Les auteurs qui ne quitteront pas Word | Ouvrir et enregistrer du Markdown depuis le ruban de Word | 29 $ HT en licence personnelle, une fois |
| Copier-coller | Quelques paragraphes, tout de suite | Le presse-papiers HTML porte la structure ; un éditeur qui le sait la convertit | Gratuit |
| Enregistrer en page web depuis Word | Obtenir du HTML depuis Word sans convertisseur | Word écrit le HTML, vous convertissez celui-ci | Inclus avec Word |
| LibreOffice, headless | Les vieux fichiers `.doc` et les formats rares | `soffice --convert-to docx` comme première étape | Gratuit, MPL 2.0 |
| python-docx | Lire le XML vous-même | Créer, lire et modifier des `.docx` depuis Python | Gratuit, MIT |

## Les meilleures façons de convertir Word en Markdown en 2026

### TransformPipe — le meilleur pour un document que vous ne voulez pas téléverser

TransformPipe lit le `.docx` dans votre navigateur et vous rend du Markdown. Hors connexion au compte, le fichier n’est envoyé nulle part : il est lu par la page, converti sur votre machine, et le résultat est à vous. Aucune installation, aucun compte obligatoire.

Sous le capot, il fait exactement ce que recommande la documentation de mammoth : mammoth transforme l’archive en HTML, puis une étape distincte de HTML vers Markdown produit le Markdown. Cela fait deux conversions au lieu d’une, et c’est l’arrangement que suggèrent les auteurs de la bibliothèque, parce que le HTML a un élément pour presque tout ce qu’un `.docx` contient, et Markdown non.

| Avantages | Inconvénients |
| --- | --- |
| Rien n’est téléversé tant que vous n’êtes pas connecté | C’est le navigateur qui travaille : un très gros document dépend de la machine |
| Aucune installation, aucun terminal, aucun compte | Un document à la fois, pas un répertoire |
| Titres, listes, liens, tableaux, gras et italique passent | Le suivi des modifications se résout au texte accepté ; suppressions et commentaires ne passent pas |
| Le Markdown se modifie sur place avant le téléchargement | Aucune option pour extraire les images dans un dossier |

**Prix :** gratuit. Un compte ajoute l’historique, le partage et une API, gratuitement aussi.

**Détails techniques et fonctionnalités**

- Accepte le `.docx` ; l’ancien `.doc` binaire est un autre format et demande une conversion préalable
- mammoth lit l’archive, puis le HTML est converti en GitHub Flavored Markdown — tableaux et barré compris
- Le HTML brut qui survit au trajet traverse un nettoyeur à liste d’autorisation fixe avant tout rendu
- Téléchargement en `.md`, ou en fichier HTML autonome si le Markdown n’était qu’une étape intermédiaire
- La même conversion est accessible depuis une API REST, une CLI, une GitHub Action et un serveur MCP

**Pour qui ?** Quiconque détient un document qu’il préférerait ne pas déposer sur le serveur d’un inconnu : un contrat, une note médicale, un plan non publié, un rapport interne. La promesse de confidentialité est de celles que l’on peut vérifier plutôt que croire : ouvrez l’onglet réseau et regardez ne rien se passer pendant la conversion.

### Pandoc — le meilleur pour les lots, les images et le suivi des modifications

Pandoc est un convertisseur de documents en ligne de commande écrit en Haskell, qui lit et écrit une quarantaine de formats. Son lecteur `.docx` est le plus configurable qui existe, et c’est le seul outil de cette page à offrir une réponse documentée sur le suivi des modifications.

| Avantages | Inconvénients |
| --- | --- |
| `--track-changes` accepte `accept`, `reject` ou `all` | Exige une installation et un terminal |
| `--extract-media` écrit les images dans un répertoire | Son dialecte Markdown n’est pas le GFM, sauf si vous demandez le GFM |
| Scriptable : cent fichiers demandent le même travail qu’un | Les styles personnalisés réclament une correspondance que vous écrivez |
| Lit le `.docx` et l’écrit aussi : les aller-retours sont possibles | Le manuel est long et les drapeaux sont nombreux |

**Prix :** gratuit, sous licence GPL.

**Détails techniques et fonctionnalités**

- `--track-changes=accept` est la valeur par défaut et traite insertions et suppressions ; `reject` les ignore ; `all` inclut insertions, suppressions et commentaires enveloppés dans des spans (vérifié sur pandoc.org, le 8 septembre 2026)
- `--extract-media=DIR` sort les images de l’archive vers un dossier, ou vers une archive zip si vous en nommez une
- Le dialecte de sortie est explicite : `-t gfm` pour GitHub Flavored Markdown, `-t commonmark`, ou le dialecte étendu de Pandoc avec sa syntaxe de notes
- `--wrap=none` l’empêche de recouper les paragraphes à 72 colonnes, le premier drapeau que tout le monde veut et le dernier que l’on trouve
- Les filtres Lua permettent de réécrire le document en cours de conversion, avant sa sérialisation

**Pour qui ?** Quiconque convertit plus d’un fichier, quiconque veut les images sur le disque plutôt que perdues, et quiconque manipule un document passé par une relecture. `--track-changes=all` est ce qui ressemble le plus à une vraie réponse pour un manuscrit annoté, et aucun outil de navigateur n’offre d’équivalent.

### mammoth — le meilleur pour une conversion dans votre propre code

mammoth est une bibliothèque qui convertit du `.docx` en HTML, avec des versions pour Node et pour le navigateur. C’est ce que se révèlent être, dès qu’on y regarde, un nombre surprenant d’outils « Word vers Markdown ».

Son idée distinctive est la carte de styles. Au lieu de deviner, mammoth fait correspondre les styles nommés de Word à des éléments HTML : `p[style-name='Heading 1'] => h1`, et vous pouvez étendre la carte aux styles maison de votre organisation. C’est le mécanisme qui fait qu’un document doté d’un style « Titre de chapitre » personnalisé se convertit correctement, et son absence explique que d’autres outils échouent.

| Avantages | Inconvénients |
| --- | --- |
| Tourne dans Node et dans le navigateur — `mammoth.browser.js` est livré dans le paquet | Produit du HTML ; l’étape Markdown vous revient |
| Les cartes de styles gèrent correctement les styles Word personnalisés | Son propre écrivain Markdown est déprécié par ses auteurs |
| Signale ce qu’il n’a pas su associer, dans un tableau `messages` | Aucune mise en page paginée, puisque le HTML n’a pas de page |
| Une CLI est incluse pour les conversions ponctuelles | JavaScript uniquement |

**Prix :** gratuit, sous licence BSD-2-Clause.

**Détails techniques et fonctionnalités**

- `mammoth.convertToHtml({arrayBuffer})` dans le navigateur, `{path}` dans Node
- `convertToMarkdown` existe et le README marque la prise en charge de Markdown comme dépréciée, en recommandant du HTML plus une bibliothèque HTML vers Markdown séparée
- Le tableau `messages` de chaque résultat liste les styles non reconnus et les éléments non traités — le seul relevé lisible par une machine de ce qu’un convertisseur a laissé tomber, parmi tous les outils cités ici
- Les images peuvent être intégrées en URI de données ou confiées à une fonction de rappel pour que vous les écriviez où bon vous semble
- La forme en ligne de commande est `mammoth document.docx output.html`

**Pour qui ?** Les développeurs qui intègrent la conversion à une application, surtout dans le navigateur, où il n’existe pas d’autre véritable option. Lisez le tableau `messages` et remontez-le à vos utilisateurs : c’est la différence entre un convertisseur et un convertisseur digne de confiance.

### MarkItDown — le meilleur pour alimenter une chaîne plutôt qu’une personne

MarkItDown est un outil Python de Microsoft qui convertit de nombreux types de fichiers en Markdown — Word, PowerPoint, Excel, PDF, HTML, CSV, JSON, EPUB et d’autres — avec une CLI et une API de bibliothèque.

Il est d’une honnêteté rare sur son objet. Le README dit qu’il existe pour convertir des fichiers en Markdown à destination des modèles de langage et des chaînes d’analyse textuelle, et que si la sortie est souvent présentable, elle est faite pour être consommée par des outils et n’est peut-être pas la meilleure option pour une conversion fidèle destinée à des lecteurs humains. Croyez cette phrase. Elle vous dit exactement quand y recourir et quand s’abstenir.

| Avantages | Inconvénients |
| --- | --- |
| Une commande pour une douzaine de formats d’entrée | La sortie vise les machines, de l’aveu même de ses auteurs |
| Bibliothèque et CLI : s’insère dans une chaîne Python | Python et un gestionnaire de paquets requis |
| Activement développé et largement utilisé | Moins de contrôle sur les spécificités du `.docx` que Pandoc |
| Gère aussi les archives et les images | Pas l’outil pour un document que quelqu’un lira attentivement |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctionnalités**

- `markitdown chemin-du-fichier.docx > document.md`, ou `-o` pour nommer la sortie
- Les formats listés dans le README comprennent PDF, PowerPoint, Word, Excel, images avec OCR, audio avec transcription, HTML, CSV, JSON, XML, ZIP, URL YouTube et EPUB
- Disponible comme bibliothèque Python pour un usage dans un script plutôt que depuis un shell

**Pour qui ?** Quiconque assemble un corpus. Si le Markdown part vers un index de recherche ou une invite, la fidélité au-delà de « les mots sont dans le bon ordre » n’a pas d’importance, et c’est le chemin le plus rapide. Si un humain doit lire la sortie, prenez autre chose.

### Google Docs — le meilleur quand le document est déjà dans Drive

Google Docs dispose d’un export Markdown natif. Fichier → Télécharger → Markdown (.md) écrit un fichier `.md`, et un clic droit sur une sélection propose Copier au format Markdown, avec Coller depuis Markdown pour le trajet retour (vérifié sur support.google.com, le 8 septembre 2026).

Le piège est la voie d’entrée. Un `.docx` posé sur votre portable doit être téléversé dans Drive et ouvert dans Docs avant que tout cela ne s’applique, et l’import de Docs est lui-même une conversion avec ses propres pertes. Vous enchaînez deux conversions et vous ne contrôlez que la seconde.

| Avantages | Inconvénients |
| --- | --- |
| Aucune installation, et aucun outil tiers en jeu | Le `.docx` doit d’abord être téléversé chez Google |
| Copier au format Markdown fonctionne sur une sélection, pas seulement sur un fichier entier | L’import `.docx` de Docs est une conversion à part entière |
| Coller depuis Markdown rend l’aller-retour possible | Aucune option : vous prenez ce qu’on vous donne |
| Gratuit avec un compte que vous avez probablement | Les commentaires restent dans Docs et ne sortent pas dans le Markdown |

**Prix :** gratuit avec un compte Google.

**Détails techniques et fonctionnalités**

- Fichier → Télécharger → Markdown (.md) pour le document entier
- Copier au format Markdown par clic droit, pour une partie
- Coller depuis Markdown convertit du Markdown en mise en forme Docs à l’entrée

**Pour qui ?** Quiconque a déjà ses documents dans Google Docs. Si votre `.docx` est sur le disque et confidentiel, le téléverser pour le convertir est un mauvais marché, et c’est la seule option de cette page qui l’exige. Le même avertissement vaut pour les documents issus de n’importe quel éditeur hébergé : [ce qui survit à un export depuis Notion, Obsidian ou Confluence](/blog/markdown-from-notion-obsidian-and-confluence) est une variante de la même question.

### Docs to Markdown — le meilleur pour convertir une partie d’un document Google

Docs to Markdown, connu aussi sous le nom de son dépôt gd2md-html, est un module complémentaire pour Google Docs écrit en Apps Script. Il s’ouvre en panneau latéral et convertit le document, ou seulement la sélection, en Markdown ou en HTML.

| Avantages | Inconvénients |
| --- | --- |
| Convertit une sélection, ce que l’export natif ne sait pas faire | Google Docs uniquement |
| Open source, et demande des permissions minimales | N’accepte pas de contributions, selon son dépôt |
| Antérieur à l’export natif, et fait encore des choses qu’il ne fait pas | Exige le même passage par Drive |
| Écrit du HTML autant que du Markdown | Les titres doivent être de vrais styles de titre, pas du gros texte gras |

**Prix :** gratuit, sous licence Apache 2.0.

**Détails techniques et fonctionnalités**

- S’installe depuis le Google Workspace Marketplace ; s’exécute en panneau latéral de Docs
- Ne demande que l’accès au document courant et la permission de créer un panneau latéral
- Son README est explicite : un texte seulement gras et gros se convertit en paragraphe normal

**Pour qui ?** Ceux qui rédigent dans Docs et publient vers une plateforme Markdown, et quiconque a besoin d’une section plutôt que d’un fichier entier.

### Writage — le meilleur pour ceux qui ne quitteront pas Word

Writage est un greffon qui s’installe dans Microsoft Word et ajoute Markdown aux boîtes de dialogue Ouvrir et Enregistrer sous de Word, avec un onglet Writage dans le ruban. C’est la seule option ici qui fonctionne comme un utilisateur de Word l’attend : Fichier, Enregistrer sous, Markdown.

| Avantages | Inconvénients |
| --- | --- |
| Markdown devient un format que Word lui-même lit et écrit | Payant, et par utilisateur |
| Aucune seconde application, aucun terminal, aucun téléversement | Versions Windows et macOS seulement — pas de Word sur le web |
| Aller-retour : ouvrir du Markdown dans Word, le réenregistrer | Lié à Word, donc aucune conversion en lot d’un répertoire |
| Essai à fonctionnalités complètes avant l’achat | Un greffon de plus dans une application qui en compte souvent plusieurs |

**Prix :** 29 $ HT pour une licence personnelle, unique et perpétuelle, avec des mises à jour gratuites pendant douze mois après l’achat ; les licences commerciales sont à 145 $ HT pour cinq utilisateurs, également en achat unique. Un essai gratuit de 14 jours à fonctionnalités complètes est proposé (vérifié sur writage.com, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- S’installe comme complément Word ; le téléchargement est proposé en `.msi` pour Windows et en `.pkg` pour macOS
- Ajoute Markdown aux boîtes Ouvrir et Enregistrer sous de Word, et un onglet Writage au ruban
- La licence s’active depuis cet onglet en collant un code

**Pour qui ?** Les auteurs et les éditeurs dont toute la journée de travail se passe dans Word et qui publient vers un système Markdown. Si l’autre solution consiste à apprendre le terminal à une équipe d’auteurs non techniques, trente dollars par tête n’est pas la partie coûteuse du projet.

### Le copier-coller par le presse-papiers HTML — mieux que ça n’en a l’air

Quand vous copiez depuis Word, le presse-papiers porte plusieurs représentations de la même sélection, et l’une d’elles est du HTML. Collez cela dans un éditeur qui comprend le presse-papiers HTML et le convertit — beaucoup d’éditeurs Markdown le font, et les champs de commentaires de GitHub aussi — et les titres, listes, gras, italiques, liens et souvent les tableaux arrivent en Markdown.

| Avantages | Inconvénients |
| --- | --- |
| Instantané, et ne demande aucune installation | Les images ne passent pas ; ce sont des références à un presse-papiers, pas des fichiers |
| Préserve étonnamment bien la structure en ligne | Dépend entièrement de la gestion du collage par l’éditeur de destination |
| Fonctionne sur une sélection : vous pouvez ne prendre qu’une section | Un long document, c’est faire défiler, sélectionner et espérer |
| Aucun fichier ne quitte votre machine | Aucun relevé de ce qui a été perdu |

**Prix :** gratuit.

**Pour qui ?** Quiconque déplace quelques centaines de mots. C’est la voie la plus rapide pour une section de document et la pire pour un document entier, et le mode d’échec est silencieux : le texte arrive, les images non, et personne ne le remarque avant la publication de la page.

### Enregistrer en page web depuis Word, puis HTML vers Markdown

Word sait écrire du HTML lui-même. Enregistrer sous, puis choisir Page web filtrée — l’option filtrée est celle qui laisse de côté l’essentiel du XML propre à Word. Puis convertissez ce HTML en Markdown avec l’outil de votre choix.

C’est une voie en deux temps, et elle mérite d’être connue parce que Word est le seul programme qui comprenne parfaitement son propre document. Ce qu’il produit est un HTML verbeux, chargé de styles en ligne, dont un convertisseur HTML vers Markdown correct se débarrasse en laissant la structure derrière lui.

| Avantages | Inconvénients |
| --- | --- |
| C’est Word qui lit : rien n’est mal interprété | Deux étapes, et le fichier intermédiaire est volumineux |
| Les images sont écrites dans un dossier à côté du HTML | La sortie non filtrée charrie d’énormes quantités de balisage Word |
| Aucun logiciel tiers à la première étape | Demande Word, et un second outil pour la seconde étape |

**Prix :** inclus avec Word.

**Pour qui ?** Quiconque a Word ouvert, un document que les autres convertisseurs ont massacré, et une étape HTML vers Markdown déjà disponible. C’est aussi la voie à essayer quand les styles personnalisés d’un document viennent à bout de tout le reste, parce que Word les résout avant d’écrire le HTML. Si vous prenez ce chemin, nettoyez le HTML avant de lui faire confiance — [le HTML brut mérite le même traitement quelle que soit sa provenance](/blog/sanitising-markdown-safely).

### LibreOffice, headless — le préprocesseur des fichiers anciens et bizarres

LibreOffice n’est pas un convertisseur Markdown et mérite tout de même sa ligne, parce qu’il est la réponse fiable au fichier qu’aucun autre outil ne veut lire. L’ancien format binaire `.doc`, le `.rtf`, les fichiers WordPerfect, un `.odt` envoyé depuis une machine Linux : `soffice --headless --convert-to docx vieuxfichier.doc` produit un `.docx`, que tout le reste de cette page saura ensuite lire.

| Avantages | Inconvénients |
| --- | --- |
| Lit des formats auxquels rien d’autre ici ne touche | Deux conversions, donc deux séries de pertes |
| Scriptable et sans interface : s’intègre à une chaîne | Une installation volumineuse pour une étape de préparation |
| Gratuit et open source | Sa sortie `.docx` est son interprétation, pas l’original |

**Prix :** gratuit, sous licence MPL 2.0.

**Pour qui ?** Quiconque possède une archive de fichiers plus vieux que le format `.docx` lui-même. Convertissez d’abord en `.docx`, puis convertissez ce résultat, et attendez-vous à ce que les surprises viennent de la première étape.

### python-docx — pour quand vous voulez prendre les décisions vous-même

python-docx crée, lit et modifie des fichiers `.docx` depuis Python. Il n’a ni écrivain Markdown ni écrivain HTML, et c’est tout l’intérêt : il vous donne les paragraphes, les segments, les styles et les tableaux sous forme d’objets, et ce que vous en émettez ne regarde que vous.

| Avantages | Inconvénients |
| --- | --- |
| Contrôle complet sur ce qui devient quoi | C’est vous qui écrivez le convertisseur |
| Lit et écrit : il peut aussi modifier des documents | Aucune sortie Markdown d’aucune sorte |
| Bien documenté et établi de longue date | Ne vaut le coup que pour une règle qu’aucun outil n’implémente |

**Prix :** gratuit, sous licence MIT.

**Pour qui ?** Les équipes dotées d’une règle maison qu’aucun convertisseur ne connaît : un style précis qui doit devenir un raccourci précis, un format de tableau à remodeler, une structure de document qui doit se plier à un modèle de contenu. Si votre besoin est ordinaire, cela représente bien plus de travail que cela n’en vaut la peine.

## Ce qu’un .docx transporte et que Markdown ne sait pas dire

Voici la section qu’une page commerciale n’écrira pas, parce qu’il n’existe aucune façon de l’écrire qui sonne bien. Markdown a une douzaine de constructions. Un `.docx` en a des centaines. La conversion est perdante par définition, et la seule question utile est de savoir à quelles pertes vous consentez. [L’inventaire complet, avec un verdict pour chaque élément](/blog/what-not-to-keep-from-a-docx), va plus loin que le résumé ci-dessous.

**Polices, corps et couleurs.** Markdown n’a aucune syntaxe pour la fonte, le corps ou la couleur. Pas une « prise en charge limitée » : aucune. Tous les convertisseurs cités les abandonnent, et ceux qui semblent ne pas le faire émettent du HTML brut avec un attribut `style`, c’est-à-dire un autre document dans une enveloppe d’allure markdownienne. Si le sens du document dépend de sa typographie, le convertir en Markdown détruit le sens et garde les mots.

**Marges, format de page et sauts de page.** Markdown n’a pas de pages. Un document mis en page pour de l’A4 avec des marges en vis-à-vis et un saut de page avant chaque chapitre devient un flux continu. Pandoc peut émettre un saut de formulaire ou un bloc brut à la place d’un saut de page, et c’est un marqueur qu’une étape ultérieure interprétera, pas un saut de page. Il n’y a rien à rompre.

**En-têtes, pieds de page et numéros de page.** Ils vivent dans leurs propres parties de l’archive et renvoient à une notion — la page — qui n’existe pas de l’autre côté. Tout le monde les supprime en silence. Personne ne les regrette jusqu’au jour où un document portant « Confidentiel — page 3 sur 12 » en pied est republié sans cette mention.

**Le suivi des modifications.** C’est celui qui coûte de l’argent. Un document relu contient à la fois l’original et la révision, balisés en insertions et suppressions. Un convertisseur qui n’a pas d’avis là-dessus vous rendra en général le texte accepté, ce qui veut dire que les suppressions de quelqu’un ont disparu, et son raisonnement avec. Le `--track-changes` de Pandoc est le seul réglage documenté de cette page : `accept`, `reject`, ou `all` pour tout garder enveloppé dans des spans. Si un document est passé par un service juridique, convertissez-le avec `all` et lisez le résultat avant de jeter le `.docx`.

**Les commentaires.** Un commentaire est une conversation attachée à une plage de texte, et Markdown n’a aucune ancre à quoi l’attacher. Le manuel de Pandoc indique que `accept` et `reject` les ignorent tous les deux et que seul `all` les inclut. mammoth les laisse de côté sauf si vous ajoutez vous-même une correspondance de style `comment-reference`, ce que son README documente et que presque personne ne fait. Tout le reste les supprime sans le dire. Le fil de relecture est souvent ce qu’un document a de plus précieux, et c’est la première chose à partir.

**Notes de bas de page et notes de fin.** Celles-là ont au moins un endroit où atterrir, mais seulement dans certains dialectes. Les notes ne sont ni dans CommonMark ni dans la spécification GFM : elles existent donc en extensions — le dialecte Markdown de Pandoc a une syntaxe de notes, et un convertisseur qui vise le CommonMark strict doit les intégrer dans le texte, les ajouter en paragraphes ordinaires, ou les abandonner. Convertissez un document annoté et regardez le bas de la sortie avant de vous engager.

**Zones de texte, formes et SmartArt.** Une zone de texte n’est pas dans le flux du document ; c’est un objet de dessin avec du texte dedans. Ce texte peut se trouver n’importe où dans le XML par rapport à sa position sur la page, et il disparaît fréquemment tout entier. C’est la perte la plus difficile à croire, parce que l’exergue était bien là, à l’écran. Cherchez dans la sortie une phrase dont vous savez qu’elle était dans une zone de texte. Si elle manque, elle n’a jamais été dans le texte.

**Les tableaux qui dépassent la grille.** Un tableau simple se convertit. Un tableau avec cellules fusionnées, tableaux imbriqués, une cellule contenant une liste à puces ou une ligne d’en-tête qui court sur deux colonnes, non, parce que la syntaxe de tableau de Markdown est une grille de cellules simples, sans fusion et sans contenu en blocs. Les convertisseurs aplatissent ce qu’ils peuvent et abandonnent le reste, et le résultat paraît généralement plausible tout en étant faux. [Les tableaux sont ce qui casse le plus souvent dans les deux sens](/blog/markdown-tables-that-survive-conversion), et la seule vérification fiable consiste à compter les colonnes.

**La numérotation, et pourquoi elle dépend d’un seul fichier de l’archive.** Cela mérite son paragraphe, car c’est l’explication de la plainte la plus répandue au sujet de la conversion des `.docx`. Une liste numérotée dans Word est un ensemble de paragraphes portant chacun un `w:numId` et un niveau d’indentation ; la numérotation réelle — décimale, en chiffres romains minuscules ou à puces, l’endroit où elle repart, la façon dont les niveaux s’emboîtent — est définie dans `numbering.xml`. Lisez le code de mammoth et vous en voyez la conséquence directement : un niveau de liste est traité comme ordonné dès que son `w:numFmt` vaut autre chose que `bullet`, et quand la partie de numérotation reste introuvable la bibliothèque retombe sur un défaut vide. Avec ce défaut vide, la recherche de la numérotation d’un paragraphe ne renvoie rien, le paragraphe cesse de correspondre à la règle qui en aurait fait un élément de liste, et il est émis en paragraphe ordinaire.

Voilà pourquoi le même outil convertit parfaitement les listes d’un document et réduit celles d’un autre à du texte plat. Ce n’est pas l’outil qui est inconstant. L’une des archives avait une partie de numérotation et l’autre non, ou bien elle référençait des définitions qu’elle ne contenait pas — ce qui arrive aux documents assemblés par des scripts, exportés depuis d’autres applications, ou réparés par Word après un plantage. Si les listes d’un document converti arrivent en paragraphes, décompressez le `.docx` et cherchez `word/numbering.xml` avant d’accuser le convertisseur. Et vérifiez l’emboîtement de ce qui a survécu, car [l’indentation des listes et les sauts de ligne sont un piège à part entière](/blog/markdown-line-breaks-and-lists) une fois le Markdown écrit.

**Champs, renvois et table des matières.** Une table des matières Word est un champ que Word calcule. Convertie, elle devient le texte mis en cache dans le champ la dernière fois que Word l’a actualisé — un instantané avec des numéros de page, qui pointe vers des pages qui n’existent plus. Les renvois subissent le même sort. Supprimez la table des matières convertie et laissez votre moteur de rendu Markdown en construire une nouvelle.

## Comment choisir

1. **Décidez où le fichier a le droit d’aller avant de choisir un outil.** Un README peut être téléversé n’importe où. Un contrat signé, un état financier non publié ou quoi que ce soit portant le nom d’un patient, non, et choisir un convertisseur en ligne pour l’un d’eux est une divulgation, pas une conversion. La conversion côté navigateur est la seule option qui garde le fichier sur la machine, et vous pouvez le vérifier en surveillant l’onglet réseau.
2. **Comptez les documents.** Un seul fichier ne justifie pas d’installer Haskell. Deux cents fichiers ne justifient pas un onglet de navigateur et quelqu’un qui clique dedans. Le coût d’installation se paie une fois et le coût des clics se paie à chaque fois, ce qui inverse la réponse quelque part entre cinq et cinquante fichiers.
3. **Établissez si le document a été relu.** S’il porte des modifications suivies ou des commentaires, la plupart des outils les résoudront en silence et vous perdrez la relecture. Le `--track-changes=all` de Pandoc est la façon documentée de les garder, et si vous n’utilisez pas Pandoc vous devez accepter que la relecture soit perdue.
4. **Vérifiez les images avant de supprimer la source.** Markdown référence des images ; il n’en contient pas. Un convertisseur qui les intègre en URI de données vous donne un fichier énorme, un qui les extrait vous donne un dossier à surveiller, et un qui ne fait ni l’un ni l’autre vous donne du Markdown qui pointe vers rien. Déterminez ce que vous avez, puis gardez le `.docx`.
5. **Convertissez un document représentatif et lisez-le en entier.** Pas le premier écran. Les tableaux, les listes numérotées, les notes, les zones de texte, et une recherche d’une phrase dont vous savez qu’elle était dans une légende. Dix minutes ici valent mieux que tous les tableaux comparatifs, celui-ci compris, parce que vos documents ne ressemblent à ceux de personne d’autre.
6. **Supposez que vous voudrez de nouveau l’original.** La conversion est à sens unique pour tout ce qui figure dans la section honnête ci-dessus. Archivez le `.docx` là où vous saurez le retrouver, car le jour où quelqu’un demandera ce que disait le paragraphe supprimé est le jour où vous découvrirez que la réponse n’était que dans le fichier que vous avez jeté.

## Conclusion

Il n’existe aucune façon sans perte de convertir Word en Markdown, et les bons outils sont ceux qui sont précis sur leurs pertes au lieu d’être discrets. [Le guide pratique couvre les étapes et la liste de contrôle](/blog/convert-docx-to-markdown) de ce qu’il faut regarder dans le résultat. Pour un document unique, le chemin honnête le plus court est un convertisseur qui tourne dans votre navigateur, ce que fait [la conversion Word vers Markdown proposée ici](/word-to-markdown) — gratuitement, sans installation, et hors connexion au compte le `.docx` ne quitte jamais votre machine. Pour un répertoire de fichiers, des images à extraire ou un document passé par une relecture, installez Pandoc et apprenez `--track-changes` et `--extract-media` ; rien d’autre sur cette page n’en approche. Pour une conversion dans votre propre application, prenez mammoth, lisez son tableau `messages`, et suivez son conseil de produire d’abord du HTML — [le fonctionnement de ses cartes de styles, et la place de docx4js, docxtemplater et Pandoc autour](/blog/mammoth-js-and-docx-parsers) est la lecture suivante si c’est la voie que vous prenez. Et quel que soit votre choix, gardez l’original, parce que les polices, les sauts de page, les commentaires et la zone de texte que vous n’aviez pas remarquée ne reviendront pas.

## FAQ

### Comment convertir Word en Markdown gratuitement ?

Toutes les options de cette page sauf Writage sont gratuites. Un convertisseur de navigateur est la voie la plus rapide pour un fichier et n’exige aucune installation ; Pandoc est gratuit et sous licence GPL en ligne de commande ; mammoth et MarkItDown sont des bibliothèques gratuites. Si le document est déjà dans Google Docs, Fichier → Télécharger → Markdown (.md) ne coûte rien non plus.

### Puis-je convertir un .docx en Markdown sans le téléverser ?

Oui, et il vaut la peine d’y tenir pour tout ce qui est confidentiel. Un convertisseur qui tourne dans le navigateur lit le fichier en JavaScript sur votre propre machine et ne l’envoie nulle part, ce que vous pouvez confirmer en ouvrant l’onglet réseau pendant la conversion. Pandoc et mammoth tournent localement par définition. Google Docs fait exception : il exige de téléverser d’abord le fichier dans Drive.

### Pourquoi mes listes numérotées sont-elles sorties en simples paragraphes ?

Presque certainement parce que le `.docx` n’avait pas de `numbering.xml`, ou le référençait mal — c’est la partie de l’archive qui définit l’aspect de chaque niveau de liste. Sans elle, un convertisseur ne peut pas savoir que ces paragraphes étaient des éléments de liste, et il les émet donc en paragraphes. Décompressez le fichier et cherchez `word/numbering.xml` avant de supposer que le convertisseur est en cause.

### Qu’advient-il des modifications suivies et des commentaires ?

La plupart des convertisseurs acceptent les modifications en silence et suppriment les commentaires : vous obtenez un texte propre et vous perdez la relecture. Pandoc fait exception : `--track-changes` accepte `accept`, `reject` ou `all`, et son manuel précise que seul `all` inclut les commentaires. Si l’historique de relecture d’un document compte, convertissez avec `all` et gardez l’original de toute façon.

### Les tableaux survivent-ils à une conversion de Word vers Markdown ?

Les grilles simples, oui. Les cellules fusionnées, les tableaux imbriqués, les lignes d’en-tête à cheval sur plusieurs colonnes et les cellules contenant des listes, non, parce que la syntaxe de tableau de Markdown n’a aucun moyen d’exprimer tout cela. Convertissez un document contenant votre pire tableau et comptez les colonnes dans la sortie avant de décider que l’outil convient.

### Les images passeront-elles ?

Pas automatiquement, et pas dans le Markdown lui-même, puisque Markdown ne fait jamais que référencer un fichier image. Le `--extract-media` de Pandoc les écrit dans un répertoire, mammoth peut les intégrer en URI de données ou les confier à votre propre code, et le copier-coller les perd entièrement. Quel que soit votre outil, vérifiez les images avant de supprimer le `.docx`.

### Vaut-il mieux Pandoc ou un convertisseur de navigateur pour passer de Word à Markdown ?

Ils répondent à des questions différentes. Pandoc est meilleur dès qu’il y a plus d’un fichier, des images à extraire ou des modifications suivies à préserver, et il coûte une installation et un terminal. Un convertisseur de navigateur est meilleur pour un document à convertir maintenant sans le téléverser, et il n’a aucune option à apprendre. La plupart des gens ont besoin des deux, à des moments différents.
