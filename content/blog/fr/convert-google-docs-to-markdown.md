---
title: "Convertir un Google Docs en Markdown : chaque voie et ce qu'elle coûte"
description: "Google Docs exporte désormais du Markdown. Ce que garde Fichier → Télécharger, quand la voie .docx vaut mieux, et ce que le Markdown ne sait pas porter"
date: 2026-09-04
tag: Conversion
keywords: google docs en markdown, convertir google doc en markdown, exporter google docs en markdown, export markdown google docs, module docs to markdown, télécharger google doc en md, google doc vers markdown avec images
---

Un document Google n'est pas un fichier. C'est un modèle de document qui vit sur les serveurs de Google, et toute façon de le poser sur votre disque est un export — un rendu avec pertes de ce modèle vers une autre forme. Le Markdown est la plus petite forme du menu. Il a six niveaux de titres, l'emphase, les listes, les liens, le code et, avec un peu de chance sur la variante, les tableaux. Tout le reste de votre document doit être abandonné, aplati ou simulé.

La plupart du temps, c'est exactement ce que vous voulez. Vous avez écrit le brouillon là où étaient les commentaires et les relecteurs, et il doit maintenant vivre dans un dépôt, un site statique ou un wiki, sous forme de texte qu'un diff sait lire. Le frottement, c'est que les pertes sont silencieuses. Vous téléchargez le `.md`, vous jetez un œil au premier écran, vous voyez vos titres, et vous ne remarquez que trois semaines plus tard que le tableau de l'annexe a perdu son en-tête fusionné, que les images ont disparu, et que les quatorze commentaires non résolus — la raison pour laquelle quiconque s'intéressait à ce document — n'ont jamais existé dans l'export.

Il y a cinq sorties, et elles perdent des choses différentes. L'export Markdown natif, le téléchargement en `.docx` converti ensuite, le téléchargement en HTML compressé, un module complémentaire tournant dans Docs, et le presse-papiers. Cet article traite du choix de la voie, et des fonctionnalités précises de Google Docs qu'aucune voie ne peut porter, parce que le Markdown n'a pas de syntaxe pour elles.

### En bref

Si le document est du texte — titres, paragraphes, listes, liens, un peu d'emphase — prenez l'export natif : **Fichier → Télécharger → Markdown (.md)**, que Google a ajouté en même temps que l'import Markdown, « Copier au format Markdown » et « Coller depuis Markdown » (vérifié sur workspaceupdates.googleblog.com, le 8 septembre 2026). S'il contient des images, des tableaux à cellules fusionnées ou des notes de bas de page à conserver, téléchargez-le en **`.docx` et convertissez ce fichier**, ou en **HTML compressé**, parce que ces deux formats portent une structure que l'export `.md` n'a nulle part où loger. Commentaires, suggestions, sauts de page, en-têtes, pieds de page et dessins ne sont pas perdus par un mauvais convertisseur — le Markdown n'a tout simplement aucune syntaxe pour eux : résolvez les commentaires et acceptez les suggestions avant d'exporter quoi que ce soit.

## Pourquoi sortir du Markdown d'un document Google est plus retors qu'il n'y paraît

La difficulté commence par l'endroit où le contenu vit réellement. Le texte d'un document Google est à un endroit, ses commentaires à un autre, et ses modifications suggérées à un troisième. Ce n'est pas une métaphore : les commentaires et leurs réponses sont des ressources distinctes dans l'API Drive, et non une partie du corps du document, et chaque commentaire est soit ancré à une région d'une révision précise, soit non ancré et rattaché au fichier dans son ensemble (vérifié sur developers.google.com, le 8 septembre 2026). Les suggestions sont stockées dans le document, mais comme une couche parallèle, ce qui explique que lire un document par programme impose de choisir un mode de vue — le mode `SUGGESTIONS_INLINE` de l'API est le seul dont les index puissent servir à une modification ultérieure, et `PREVIEW_SUGGESTIONS_ACCEPTED` vous remet le texte tel qu'il se lirait si toutes les suggestions étaient acceptées (vérifié sur developers.google.com, le 8 septembre 2026).

Un export doit choisir une couche et jeter les autres. Il choisit le texte du corps. La conversation de relecture — la partie d'un document Google que Word, le Markdown et tout le reste traitent le plus mal — a donc disparu avant même le début de la conversion. Aucun outil de cette page n'y changera rien, et tout outil prétendant conserver vos commentaires les place soit dans un fichier séparé, soit parle d'autre chose.

Le deuxième problème est que le Markdown n'est pas une cible unique. Le CommonMark nu n'a ni tableaux, ni texte barré, ni listes de tâches ; GitHub Flavored Markdown ajoute les trois ; les notes de bas de page ne figurent dans aucune des deux spécifications et n'existent que comme extension. « Est-ce qu'il garde les tableaux ? » est donc en partie une question sur l'exportateur et en partie une question sur la variante qu'il écrit, et les deux sont confondues dans tous les comparatifs que vous lirez. La page d'aide de Google décrit la syntaxe qu'il traite dans Docs comme des titres sur six niveaux, l'italique, le gras, le gras-italique, le barré et les liens (vérifié sur support.google.com, le 8 septembre 2026) — une liste courte, et une description honnête des ambitions de l'export natif.

Le troisième problème, ce sont les images. Un fichier `.md` est un fichier texte, un seul. Il n'y a pas de dossier à côté, pas d'archive autour, et la syntaxe d'image du Markdown est un chemin ou une URL : elle porte une référence, jamais les octets. Tout export Markdown en fichier unique doit donc soit pointer vers un endroit où l'image vit encore, soit l'incorporer sous forme de blob encodé, soit laisser un trou. Aucune de ces trois réponses n'est celle que vous vouliez, et c'est pourquoi le document chargé d'images est le cas où l'export natif cesse d'être la bonne réponse. [Les chemins relatifs et ce qui casse quand le fichier bouge](/blog/images-and-links-that-still-work) est la version générale de ce problème, et il s'applique de plein fouet dès qu'un document Google devient un `.md` dans un dépôt.

## Comparatif rapide : l'aide-mémoire

| Voie | Idéale pour | Ce qu'elle garde | Ce qu'elle abandonne | Prix |
| --- | --- | --- | --- | --- |
| Fichier → Télécharger → Markdown (.md) | Un document texte, tout de suite | Titres, listes, liens, emphase, barré, tableaux simples | Les images comme fichiers, commentaires, suggestions, mise en page |  Gratuit avec un compte Google |
| Fichier → Télécharger → Word (.docx), puis convertir | Images, tableaux complexes, lots, tout ce qui est scripté | Ce que garde le second convertisseur ; les images en vrais fichiers | Commentaires et suggestions toujours perdus | Gratuit ; le convertisseur peut demander une installation |
| Fichier → Télécharger → Page Web (.html, compressée) | Les documents où les images comptent le plus | La structure HTML complète plus un dossier d'images | Rien que le Markdown voulait, mais vous convertissez deux fois | Gratuit avec un compte Google |
| Module Docs to Markdown | Convertir une partie d'un document | Notes de bas de page, cellules fusionnées, structure des titres | Les images deviennent des chemins fictifs à remplir | Gratuit, licence Apache 2.0 |
| Copier au format Markdown (clic droit) | Quelques paragraphes | La mise en forme en ligne et les liens | Tout ce qui n'est pas sélectionné ; les images | Gratuit, désactivé par défaut |
| Copier-coller dans un éditeur Markdown | Une section, vers un outil que vous utilisez déjà | Ce que comprend le gestionnaire de collage de l'éditeur cible | Très variable selon l'éditeur | Gratuit |
| API Docs + Apps Script | Beaucoup de documents, à intervalles réguliers | Tout ce que vous codez pour le garder | Tout ce que vous ne codez pas | Gratuit ; c'est vous qui l'écrivez |
| Export `text/markdown` via l'API Drive | Automatiser l'export natif | La même chose que Fichier → Télécharger | La même chose que Fichier → Télécharger | Gratuit ; quotas d'API applicables |

## L'export Markdown natif, et ce qu'il garde vraiment

Google Docs exporte lui-même du Markdown. Le chemin est Fichier → Télécharger → Markdown (.md), et il arrive accompagné de trois compagnons : l'import Markdown, qui transforme un `.md` ouvert par Fichier → Ouvrir en document Docs ; « Copier au format Markdown » dans le menu contextuel pour une sélection ; et « Coller depuis Markdown » pour le trajet retour (vérifié sur support.google.com, le 8 septembre 2026). L'import et l'export sont actifs par défaut. Le couple copier-coller, lui, est désactivé par défaut et se trouve derrière Outils → Préférences → Activer le Markdown (vérifié sur workspaceupdates.googleblog.com, le 8 septembre 2026). Si « Copier au format Markdown » n'apparaît pas dans votre menu contextuel, c'est à cause de ce réglage.

Le même export est accessible au code. Les fichiers Google Docs peuvent être exportés via l'API Drive vers neuf types MIME — `.docx`, `.odt`, `.rtf`, `.pdf`, `text/plain`, `text/html`, HTML compressé, EPUB et `text/markdown` (vérifié sur developers.google.com, le 8 septembre 2026). Le dernier est l'export natif par une autre porte, ce qui compte si vous voulez le même résultat sans qu'un être humain clique dans un menu.

| Avantages | Inconvénients |
| --- | --- |
| Aucune installation, aucun module, aucun tiers au milieu | Les images sont le point faible : un `.md` seul n'a pas de dossier où les mettre |
| Le document entier en une action | Rien n'est sélectionnable — c'est le document ou rien |
| Aller-retour : réimportez un `.md` dans Docs et il redevient un document | Commentaires et suggestions sont absents, sans le moindre avertissement |
| Scriptable via l'API Drive avec le type d'export `text/markdown` | Aucune option : pas de choix de variante, pas de dossier d'images, pas de front matter |
| Gratuit avec le compte que vous avez déjà | Mise en page, en-têtes, pieds de page et sauts de section n'ont nulle part où aller |

**Prix :** gratuit avec un compte Google.

**Détails techniques et fonctionnalités**

- Fichier → Télécharger → Markdown (.md) pour le document entier ; le fichier est du texte UTF-8 brut
- Clic droit → Copier au format Markdown pour une sélection, une fois Outils → Préférences → Activer le Markdown coché
- Clic droit → Coller depuis Markdown transforme du Markdown présent dans le presse-papiers en mise en forme Docs
- Fichier → Ouvrir → Importer, ou Drive → Ouvrir avec → Google Docs, importe un fichier `.md` comme document
- L'API Drive expose la même conversion sous le type MIME d'export `text/markdown`

**Pour qui ?** Pour quiconque a un document qui est vraiment du texte. Une note de réunion, une spécification, un brouillon d'article, un README écrit dans Docs parce que c'est là qu'étaient les relecteurs. Si vous pouvez faire défiler tout le document sans rien voir d'autre que des titres, des paragraphes, des listes, des liens et un tableau de temps en temps, c'est la bonne voie et tout ce qui suit est du travail inutile.

## Télécharger en .docx, puis convertir le .docx

L'autre voie consiste à laisser Google produire un `.docx` et à confier celui-ci à un convertisseur conçu pour ce travail. Cela a l'air du chemin le plus long, et c'est fréquemment le meilleur, pour une raison : un `.docx` est une archive zip contenant un dossier `media`, si bien que les images survivent à la première étape du voyage sous forme de vrais fichiers. La seconde étape a alors un endroit où les poser.

Cela ouvre aussi la porte à toutes les options dont l'export natif est dépourvu. Le lecteur `.docx` de Pandoc accepte `--extract-media` pour écrire les images incorporées dans un répertoire et réécrire les liens en conséquence, et `--track-changes` avec `accept`, `reject` ou `all` pour décider du sort des marques de révision — la seule réponse documentée au suivi des modifications dans cette page. Pandoc est gratuit, sous licence GPL, écrit en Haskell, et il faut l'installer. Un convertisseur de navigateur fait la même première étape sans installation : lire le `.docx` sur votre propre machine et vous rendre du Markdown, ce que fait [la conversion Word vers Markdown de TransformPipe](/word-to-markdown), et ce que fait avec plus ou moins de soin [l'ensemble du champ des convertisseurs `.docx`](/blog/best-word-to-markdown-converters).

| Avantages | Inconvénients |
| --- | --- |
| Les images arrivent en vrais fichiers dans l'archive, donc un convertisseur peut les extraire | Deux conversions au lieu d'une, et deux occasions de perdre quelque chose |
| De vraies options : extraction d'images, choix de variante, traitement des tableaux | Le `.docx` est un fichier intermédiaire dont il faut suivre la trace |
| Scriptable et traitable par lots — un répertoire de `.docx` est une boucle shell | Le générateur de `.docx` de Google a ses propres bizarreries dont vous héritez |
| Fonctionne avec les outils que votre build possède déjà | Commentaires et suggestions restent perdus : Google les a abandonnés au téléchargement |
| Vous choisissez votre convertisseur, donc vous choisissez ses compromis | Plus d'étapes à expliquer à quelqu'un qui veut simplement le texte |

**Prix :** gratuit. Pandoc est gratuit et sous licence GPL ; un convertisseur côté navigateur ne coûte rien et ne demande aucune installation.

**Détails techniques et fonctionnalités**

- Fichier → Télécharger → Microsoft Word (.docx) produit une archive Office Open XML standard
- Les titres survivent comme des paragraphes portant une référence `w:pStyle`, ce que les convertisseurs cherchent
- `pandoc --from docx --to gfm --extract-media=./media report.docx -o report.md` écrit les images à côté du texte
- `--track-changes=accept` résout les marques de révision vers le texte accepté plutôt que de laisser du balisage dans la prose
- Un `.docx` s'ouvre aussi dans Word, LibreOffice et tout le reste, ce qui en fait un point de contrôle utile

**Pour qui ?** Pour quiconque a des images, quiconque convertit plus d'un document, et quiconque a besoin que la sortie satisfasse une cible précise — un site de documentation au répertoire d'images strict, un dépôt avec un linter, un wiki qui n'accepte que du CommonMark. Également pour quiconque veut inspecter l'intermédiaire : si le Markdown est faux, vous pouvez ouvrir le `.docx` et voir si le problème venait de l'export de Google ou de votre convertisseur.

## Télécharger en HTML compressé quand les images comptent le plus

Fichier → Télécharger → Page Web (.html, compressée) vous donne une archive contenant le document en HTML et ses images en fichiers séparés dans un dossier. C'est l'export le plus fidèle que Google propose du document visible, et celui qu'il faut choisir quand les illustrations sont le propos — une revue de design, un manuel d'exploitation plein de captures d'écran, un rapport avec des graphiques collés dedans.

Vous avez ensuite un problème de HTML vers Markdown, et c'est un problème bien résolu. Les [convertisseurs HTML vers Markdown](/blog/best-html-to-markdown-converters) gèrent tous les éléments de structure ; le travail consiste à jeter les styles en ligne de Google, qui sont abondants, et à rectifier les chemins d'images pour qu'ils pointent là où les images ont atterri.

| Avantages | Inconvénients |
| --- | --- |
| Les images ressortent en fichiers dans un dossier, nommés et complets | Le HTML de Google est lourd de styles en ligne et de noms de classes générés |
| Le HTML a un élément pour presque tout ce que Docs sait exprimer | Deux conversions, et la seconde demande à être configurée |
| Les tableaux arrivent en vrai balisage `<table>`, cellules fusionnées comprises | Les noms de fichiers d'images sont ceux de Google, pas les vôtres, et les chemins sont à réécrire |
| Facile à inspecter : ouvrez le HTML dans un navigateur et voyez exactement ce que vous avez | Le zip est un conteneur à décompresser, soit une étape de plus dans un script |

**Prix :** gratuit avec un compte Google.

**Détails techniques et fonctionnalités**

- L'archive contient un fichier `.html` et un répertoire d'images
- Disponible via l'API Drive sous le type d'export HTML compressé, autant que depuis le menu
- Les éléments de titre sont de vraies balises `<h1>`–`<h6>`, donc la structure des titres se convertit proprement
- Les tableaux sont des tableaux HTML, ce qui veut dire que `colspan` et `rowspan` survivent jusqu'au HTML — [ce qui leur arrive ensuite](/blog/markdown-tables-that-survive-conversion) dépend entièrement de la variante de Markdown vers laquelle vous écrivez
- Les attributs de style sont en ligne sur presque chaque élément et peuvent être jetés en bloc sans risque

**Pour qui ?** Pour les documents chargés de captures d'écran, et pour quiconque veut voir ce que Google pense que le document contient avant de décider quoi garder. Le HTML est verbeux et il est honnête : ce qui est dans le fichier est ce qui était dans le document.

## Les voies qui ne passent pas par Fichier → Télécharger

Trois sorties qui ne touchent jamais au menu de téléchargement. Elles existent parce que l'on veut parfois une partie de document, ou qu'on la veut tout de suite, ou qu'on la veut pour deux cents documents sans personne dans la boucle.

### Docs to Markdown, le module complémentaire

Docs to Markdown, connu sous le nom de son dépôt gd2md-html, est un module complémentaire Google Docs qui s'ouvre en panneau latéral et convertit le document — ou seulement la sélection — en Markdown ou en HTML. Il est gratuit, sous licence Apache 2.0, s'installe depuis le Google Workspace Marketplace et ne demande que deux permissions : l'accès au document courant, et l'autorisation de créer un panneau latéral (vérifié sur github.com/evbacher/gd2md-html, le 8 septembre 2026).

Il est plus attentif à la structure du document que l'export natif, et exceptionnellement honnête sur ses limites. Les notes de bas de page deviennent des notes Markdown standard. Les tableaux deviennent des tableaux HTML, y compris dans la sortie Markdown, et c'est ainsi qu'il conserve lignes et colonnes fusionnées ; un tableau d'une seule cellule devient un bloc de code. Les images deviennent des chemins fictifs de la forme `images/image1.png`, et la documentation vous dit franchement que vous devez déplacer les images vers votre serveur et corriger les chemins — en avertissant que l'ordre des images dans le zip n'est pas toujours celui de leur apparition dans le document : vérifiez-les toutes. Les équations déclenchent un avertissement en rouge suggérant MathJax ou LaTeX si votre plateforme de publication les prend en charge. Et, comme avec tout convertisseur `.docx` ou Docs, les titres ne se convertissent que si ce sont de vrais styles de titre : un texte simplement gras et grand se convertit en paragraphe ordinaire.

| Avantages | Inconvénients |
| --- | --- |
| Convertit une sélection, ce que Fichier → Télécharger ne sait pas faire | Google Docs uniquement, et il faut l'installer |
| Notes de bas de page et cellules fusionnées survivent | Les cellules fusionnées survivent en HTML dans votre Markdown, que tous les moteurs de rendu n'acceptent pas |
| Il vous prévient de ce qu'il n'a pas su convertir au lieu d'échouer en silence | Les images sont des chemins fictifs : les fichiers restent à votre charge |
| Gratuit et open source, avec un périmètre de permissions étroit | Un document à la fois, dans un panneau latéral |

**Prix :** gratuit, licence Apache 2.0.

**Pour qui ?** Pour les gens qui publient régulièrement depuis Docs, surtout vers une plateforme qui veut des notes de bas de page. Également pour quiconque a besoin d'une section d'un long document plutôt que du tout — cela suffit à justifier l'installation.

### Copier-coller, par le presse-papiers HTML

Copier depuis un document Google met deux choses dans le presse-papiers : du texte brut et une variante HTML. La variante HTML porte la structure — les titres en éléments de titre, les listes en listes, les liens en ancres, le gras en `<b>` ou en style. Un éditeur dont le gestionnaire de collage lit cette variante et la convertit peut transformer une sélection collée en Markdown sans qu'aucun fichier ne quitte quoi que ce soit.

Cela fonctionne bien mieux que cela ne le devrait, et c'est la voie la plus rapide qui existe pour quelques paragraphes. Là où cela casse est prévisible. Les éditeurs diffèrent énormément par ce que comprennent leurs gestionnaires de collage : certains convertissent titres, listes et liens et jettent tout le reste ; certains collent la variante texte brut et perdent toute structure ; certains collent du HTML brut dans votre fichier Markdown. Les images ne passent jamais en tant que fichiers — au mieux vous obtenez une référence vers une URL Google qui ne fonctionne que tant que vous êtes connecté, au pire rien. Et le HTML de Google pose des styles en ligne sur presque tout, si bien qu'un gestionnaire naïf produit du Markdown jonché de balises `<span>`.

| Avantages | Inconvénients |
| --- | --- |
| Instantané, sans téléchargement ni installation | Le comportement dépend entièrement de l'éditeur cible |
| Conserve étonnamment bien la mise en forme en ligne et les liens | Les images ne passent jamais en tant que fichiers |
| Fonctionne sur une sélection de n'importe quelle taille, y compris un paragraphe | Les longs documents sont fastidieux et faciles à rater |
| « Copier au format Markdown » fait la conversion dans Docs lui-même, s'il est activé | Les styles en ligne de Google fuient à travers les gestionnaires faibles |

**Prix :** gratuit. « Copier au format Markdown » exige d'abord de cocher Outils → Préférences → Activer le Markdown.

**Pour qui ?** Pour quiconque déplace une section, pas un document. Si vous collez plus de quelques écrans, vous faites à la main ce que Fichier → Télécharger fait en une action.

### Les API Docs et Drive, pour beaucoup de documents

Si la réponse doit tourner sans personne, il y a deux niveaux. Le moins coûteux est le point d'entrée d'export de l'API Drive avec le type MIME `text/markdown` : vous obtenez exactement l'export natif, pour tout document que vous pouvez lire, dans un script. C'est suffisant pour la plupart des automatisations, et cela hérite de toutes les limites de l'export natif.

Le plus coûteux est l'API Docs, qui vous remet le document en JSON structuré — un corps d'éléments de structure, des paragraphes portant des styles nommés, des tableaux en rangées de cellules, des listes résolues contre des propriétés de liste. Vous écrivez ensuite le Markdown vous-même, ce qui veut dire que vous décidez de ce que devient un saut de page, de ce qui arrive à une puce intelligente, de l'acceptation ou du rejet d'une suggestion, et de l'endroit où vont les images. C'est du vrai travail, et c'est la seule voie où les pertes sont vos choix plutôt que les réglages par défaut de quelqu'un d'autre.

| Avantages | Inconvénients |
| --- | --- |
| Tourne à intervalles réguliers, sur un nombre quelconque de documents | Vous écrivez et entretenez un convertisseur |
| L'API Docs expose l'état des suggestions : vous pouvez choisir accepter ou rejeter | Périmètres OAuth, quotas et identifiants à gérer |
| Vous maîtrisez complètement la stratégie d'images | Chaque fonctionnalité de Docs que vous oubliez est un bug silencieux |
| Les commentaires sont accessibles via l'API Drive, vers un fichier séparé | Rien là-dedans n'est rapide |

**Prix :** gratuit ; les quotas d'API s'appliquent.

**Pour qui ?** Pour les équipes dont la documentation vit réellement dans Docs et doit apparaître en continu dans un dépôt ou sur un site. S'il s'agit d'une migration unique de trente documents, la voie `.docx` et une boucle shell battront de loin l'écriture de tout cela.

## Ce que Google Docs possède et pour quoi le Markdown n'a aucune syntaxe

C'est la partie qu'aucun export ne peut réparer, et celle qu'il vaut mieux lire avant d'accuser un convertisseur. Les éléments ci-dessous ne sont pas des échecs de conversion. Ce sont des fonctionnalités sans équivalent Markdown : chaque outil les abandonne, les aplatit en autre chose, ou émet du HTML en espérant que votre moteur de rendu l'autorise.

| Fonctionnalité Google Docs | Équivalent Markdown le plus proche | Ce qui se passe réellement |
| --- | --- | --- |
| Commentaires et réponses | Aucun | Abandonnés. Ce sont des ressources Drive distinctes, pas du contenu de document |
| Modifications suggérées | Aucun | Aplaties en une version du texte, suggestions généralement acceptées |
| Sauts de page | Une séparation thématique, `---` | Une ligne horizontale sur une page qui n'a pas de pages, ou rien du tout |
| En-têtes et pieds de page | Aucun | Abandonnés, numéros de page compris |
| Sauts de section et colonnes | Aucun | Abandonnés ; un texte multicolonne devient une colonne dans l'ordre de lecture |
| Dessins et graphiques insérés | Une référence d'image | Une image au mieux, un trou au pire ; jamais modifiable à nouveau |
| Puces intelligentes (personnes, dates, fichiers) | Du texte brut ou un lien | Réduites à leur libellé, ou à un lien que seuls des collègues peuvent ouvrir |
| Équations | Aucun en CommonMark ni en GFM | Abandonnées, ou émises en LaTeX si votre plateforme le rend |
| Sommaire | Une liste de liens écrite à la main | Un instantané figé qui cesse de correspondre dès que vous modifiez un titre |
| Signets et liens internes | Ancres de titres | Cassés, sauf si les règles de slug de votre moteur de rendu correspondent aux ancres de l'export |
| Notes de bas de page | Une extension, dans aucune spécification | Dépend entièrement de l'outil et du moteur de rendu à l'arrivée |
| Polices, couleurs, interlignes, marges | Aucun | Abandonnés, ce qui est d'ordinaire la raison pour laquelle vous vouliez du Markdown |

Trois de ces lignes méritent d'être dites à voix haute.

**Les commentaires sont la plus grosse perte et la moins visible.** Un document Google passé par une vraie relecture est à moitié du corps de texte et à moitié une conversation en marge, et c'est dans la marge que les décisions ont été prises. Exportez-le et vous gardez la moitié qu'une machine sait comparer. Si ces fils comptent, résolvez-les d'abord, ou recopiez ceux qui comptent dans le document, en texte, avant d'exporter. Aucune voie de cette page ne les conserve, et rien ne vous prévient quand ils s'en vont.

**Les suggestions doivent être traitées avant l'export, pas après.** Un document en mode suggestion contient deux lectures de lui-même. Un export en choisit une — normalement la version acceptée — et vous ne pourrez pas déduire du Markdown quelles phrases étaient la proposition de quelqu'un et lesquelles étaient validées. Acceptez ou rejetez tout, puis exportez. Si vous ne le pouvez pas, prenez la voie `.docx` avec le `--track-changes=all` de Pandoc, qui met au moins l'information de révision dans la sortie, là où vous pouvez la voir.

**Les liens internes cassent d'une façon que vous ne remarquerez pas.** Les ancres de titres en Markdown sont engendrées par ce qui rend le fichier, selon ses propres règles de slug, et ces règles diffèrent entre GitHub, un générateur de site statique et un convertisseur de navigateur. Un renvoi qui fonctionnait dans Docs devient un lien vers une ancre qui n'existe pas, et un lien interne cassé échoue en silence : la page ne bouge simplement pas. Vérifiez chaque lien interne après une conversion, ou supprimez-les et nommez les sections dans la prose à la place.

## Comment choisir

1. **Regardez le document avant de choisir une voie.** Faites-le défiler d'un bout à l'autre et comptez les images, les tableaux à cellules fusionnées, les notes de bas de page, et tout ce qui a été dessiné plutôt que tapé. Zéro sur les quatre veut dire que l'export natif est le bon et que tout le reste est de l'effort gâché ; un ou plus veut dire la voie `.docx` ou HTML compressé, parce que l'export natif n'a nulle part où les mettre.
2. **Traitez d'abord la couche de relecture.** Résolvez les commentaires, acceptez ou rejetez les suggestions, et sortez le document du mode suggestion. Faites-le après l'export et vous réconcilierez deux documents à la main ; faites-le avant et l'export est simplement juste.
3. **Décidez où vivront les images avant de convertir.** Un fichier Markdown porte des références, pas des illustrations : il vous faut donc un répertoire et une convention de chemins. Le `--extract-media` de Pandoc en choisit une pour vous ; le module vous donne des chemins fictifs `images/image1.png` à remplir ; l'export natif ne donne ni l'un ni l'autre, et c'est pourquoi le document chargé d'images sort en `.docx` ou en HTML compressé.
4. **Accordez la variante à la destination.** Si la cible ne rend que du CommonMark, vos tableaux et votre texte barré n'apparaîtront pas, aussi bien convertis soient-ils. Établissez ce que la plateforme d'arrivée prend en charge, puis convertissez vers cela, et non vers ce que l'outil écrit par défaut.
5. **Convertissez un document représentatif et lisez-le en entier.** Pas le premier écran — l'annexe, les tableaux, les notes de bas de page, les liens internes. Dix minutes sur le pire document que vous ayez vous apprendront plus que n'importe quel comparatif, celui-ci compris, et c'est la seule façon d'attraper ce qui a échoué sans bruit.
6. **Demandez-vous si le document ne devrait pas rester dans Docs.** S'il est relu par des gens qui n'ouvriront jamais une pull request, l'exporter en Markdown une fois par mois est un tapis roulant. Convertissez ce qui doit vivre dans le dépôt et laissez le reste là où sont les relecteurs.

## Conclusion

Sortir du Markdown de Google Docs est désormais un problème résolu pour le texte et non résolu pour tout le reste. Fichier → Télécharger → Markdown (.md) est gratuit, natif et juste pour un document fait de titres, de paragraphes, de listes et de liens ; pour les images, les tableaux fusionnés et les notes de bas de page, téléchargez le `.docx` ou le HTML compressé et convertissez-le avec un outil qui a des options — Pandoc si vous voulez un script, une [conversion Word vers Markdown](/word-to-markdown) côté navigateur si vous le voulez tout de suite sans que le fichier quitte votre machine. Et traitez commentaires, suggestions, sauts de page, en-têtes, pieds de page et dessins comme des choses dont vous vous occupez dans Docs avant d'exporter, parce qu'aucun convertisseur ne peut les porter et que ceux qui prétendent le faire parlent d'autre chose. Le même avertissement vaut pour tout éditeur hébergé : [ce que garde un export de Notion, d'Obsidian ou de Confluence](/blog/markdown-from-notion-obsidian-and-confluence) est la même question avec d'autres réponses.

## FAQ

### Google Docs sait-il exporter du Markdown nativement ?

Oui. Fichier → Télécharger → Markdown (.md) écrit un fichier `.md`, et Fichier → Ouvrir en réimporte un comme document ; les deux sont actifs par défaut (vérifié sur workspaceupdates.googleblog.com, le 8 septembre 2026). « Copier au format Markdown » et « Coller depuis Markdown » sont aussi disponibles dans le menu contextuel, mais ils restent inactifs tant que vous n'avez pas coché Outils → Préférences → Activer le Markdown.

### Pourquoi mes images manquent-elles dans le Markdown exporté ?

Parce qu'un fichier `.md` est un fichier texte unique sans dossier à côté, et que la syntaxe d'image du Markdown porte un chemin, pas l'illustration. Pour obtenir les images en vrais fichiers, téléchargez le document en `.docx` et convertissez-le avec quelque chose qui extrait les médias, ou téléchargez-le en HTML compressé, dont l'archive arrive avec un répertoire d'images.

### Les commentaires et les suggestions passent-ils ?

Non, sur aucune voie. Commentaires et réponses sont stockés comme des ressources Drive distinctes plutôt que comme du contenu de document : un export du corps de texte ne peut donc pas les inclure ; les suggestions sont une couche parallèle que l'export aplatit en une seule lecture. Résolvez les commentaires et acceptez ou rejetez les suggestions avant d'exporter.

### Vaut-il mieux télécharger en .docx et convertir, ou utiliser l'export Markdown ?

Prenez l'export Markdown pour un document texte : c'est une seule action et il n'y a pas de second outil à rater. Prenez la voie `.docx` quand il vous faut des images extraites dans un dossier, le contrôle de la variante de sortie, un traitement explicite du suivi des modifications, ou la même conversion répétée sur de nombreux fichiers dans un script.

### Comment convertir seulement une partie d'un document Google ?

De deux façons. Sélectionnez le texte et utilisez « Copier au format Markdown », après avoir activé le Markdown dans Outils → Préférences, puis collez-le à destination. Ou installez le module Docs to Markdown, qui convertit une sélection depuis un panneau latéral — en notant son propre avertissement : un tableau doit être sélectionné en entier, sinon le module ne verra pas l'élément de tableau qui le contient.

### Pourquoi mes titres sont-ils sortis en paragraphes ordinaires ?

Parce que ce n'étaient pas des titres. Si quelqu'un a mis une ligne en gras et en 18 pt au lieu d'appliquer le style Titre 1, il n'y a aucun titre dans le document qu'un convertisseur puisse trouver, et le module Docs to Markdown le dit exactement ainsi dans sa propre documentation. Appliquez de vrais styles de titre dans Docs, puis exportez de nouveau.

### Puis-je automatiser la conversion de nombreux documents Google en Markdown ?

Oui, à deux niveaux d'effort. L'API Drive peut exporter n'importe quel document directement vers le type `text/markdown`, ce qui vous donne l'export natif dans un script (vérifié sur developers.google.com, le 8 septembre 2026). Pour maîtriser les images, les suggestions et les fonctionnalités propres à Docs, lisez le document via l'API Docs sous forme de JSON structuré et engendrez le Markdown vous-même — bien plus de travail, et la seule voie où c'est vous qui choisissez les pertes.
