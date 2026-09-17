---
title: "Alternatives à Dillinger en 2026 : classées selon la raison de votre départ"
description: "Les alternatives à Dillinger classées par la raison qui vous en fait chercher une : un convertisseur plutôt qu'un éditeur, du hors-ligne, ou bien un script"
date: 2026-09-08
tag: Workflow
keywords: alternative dillinger, alternatives à dillinger, dillinger io alternative, alternative éditeur markdown en ligne, éditeur markdown sans cloud, markdown vers html sans éditeur, éditeur markdown hors ligne
---

Dillinger est un bon logiciel et il est gratuit ; personne ne cherche donc une alternative par agacement envers la frappe. On cherche parce que quelque chose, au bord de l'outil, ne convenait pas : une boîte de dialogue demandant à connecter un Google Drive, un export qui ne s'ouvrait pas comme il apparaissait à l'écran, ou la lente prise de conscience d'avoir ouvert un éditeur alors qu'il fallait un convertisseur et un fichier.

### En bref

Si vous vouliez une conversion unique plutôt qu'une séance d'écriture, la réponse est un convertisseur, pas un autre éditeur — Markdown Live Preview pour jeter un œil, un convertisseur côté navigateur pour un document HTML complet que vous pouvez envoyer. Si l'objection portait sur la connexion au cloud, notez d'abord que Dillinger affirme que les documents restent dans votre navigateur et qu'aucune donnée ne repose sur ses serveurs (vérifié sur dillinger.io, le 9 septembre 2026) ; la demande d'accès n'apparaît que lorsque vous reliez Dropbox, Drive, OneDrive, GitHub ou Bitbucket, et vous pouvez simplement vous en abstenir. Si vous voulez l'outil lui-même sur votre machine, StackEdit reste dans un onglet et fonctionne hors ligne, tandis que Typora, Obsidian et Zettlr sont des applications. Si cela relève d'un build, rien de ce qui précède ne s'applique et Pandoc s'applique.

« Alternative à Dillinger » est une formule qui recouvre quatre recherches. La première est celle de quelqu'un arrivé avec un fichier `.md`, qui en voulait du HTML et a trouvé un éditeur à deux volets doté d'un menu cloud — plus d'outil que la course n'en demandait. La deuxième est celle de quelqu'un qui s'est arrêté devant la demande d'intégration, parce que relier un Drive entier à un site web pour déplacer un fichier est un mauvais marché. La troisième veut le logiciel installé, sur un portable, fonctionnel dans un train, avec les fichiers sur un disque que l'on peut sauvegarder. La quatrième écrit une étape de build et a besoin d'une commande, pas d'un onglet.

Ces quatre-là veulent des choses différentes et une seule veut un éditeur. C'est bon à savoir avant de lire la moindre liste, y compris celle-ci, car la plupart des pages d'« alternatives à Dillinger » répondent aux quatre questions par un tas classé d'éditeurs Markdown, et trois lecteurs sur quatre repartent avec le mauvais outil.

Il existe aussi un cinquième cas qui mérite d'être nommé, puisqu'il revient dans les fils de support : l'export est sorti et il ne ressemblait pas à l'aperçu. Ce n'est pas une raison de changer d'éditeur. C'est une propriété de la façon dont le HTML a été écrit, et cela se répare sans rien migrer.

## Dillinger selon ses propres termes

Dillinger est un éditeur Markdown en navigateur doté d'un aperçu en direct, bâti sur l'éditeur Monaco — le composant d'édition qu'utilise VS Code. Il propose un aperçu synchronisé au défilement, des raccourcis Vim et Emacs derrière un réglage, le glisser-déposer de fichiers Markdown, HTML et images, un mode sombre et un mode Zen plein écran. L'export est décrit comme « Markdown, HTML stylé ou PDF », en téléchargement d'un clic. Les documents s'enregistrent automatiquement dans le stockage de votre navigateur, et le site le dit sans détour : « Aucun compte requis, aucune donnée sur nos serveurs » (vérifié sur dillinger.io, le 9 septembre 2026).

C'est de l'open source. Le dépôt indique la licence MIT et liste la pile technique comme Next.js, Monaco, Tailwind CSS et Zustand, avec un simple `npm run build` et `npm start` pour l'héberger soi-même (vérifié sur github.com/joemccann/dillinger, le 9 septembre 2026). MIT signifie que vous pouvez l'héberger, le forker et le modifier, ce qui est davantage que ce qu'offrent la plupart des outils web gratuits et constitue l'honnête contrepoids à tout ce qui suit.

Les intégrations sont la partie qui fait réagir. Cinq sont listées — GitHub, Dropbox, Google Drive, OneDrive et Bitbucket — pour importer des fichiers et les réenregistrer, et le site note que la connexion Dropbox se fait via OAuth (vérifié sur dillinger.io, le 9 septembre 2026). Rien là-dedans n'est inhabituel ni déplacé. C'est simplement le moment où un éditeur gratuit demande quelque chose qu'un convertisseur n'a jamais à demander, et le moment où beaucoup de gens ferment l'onglet.

| Avantages | Inconvénients |
| --- | --- |
| Rien à installer, et aucun compte à créer | C'est un éditeur : le chemin le plus court reste écrire, puis exporter |
| Monaco offre une vraie édition — curseurs multiples, rechercher-remplacer | La page vient d'un domaine hébergé, le premier chargement exige donc le réseau |
| Les documents persistent dans le stockage du navigateur, rien sur leurs serveurs | Le stockage du navigateur est propre à un navigateur et à un profil, et effacer les données du site l'efface |
| Exporte Markdown, HTML stylé et PDF d'un clic | La synchronisation cloud revient à accorder à un site web l'accès à un disque ou à un dépôt |
| Sous licence MIT, vous pouvez donc l'héberger vous-même | Le style de l'export est celui de l'outil, et « stylé » n'est pas la même chose qu'autonome |

**Licence :** gratuit, MIT (vérifié sur github.com/joemccann/dillinger, le 9 septembre 2026).

**Pour qui ?** Pour quelqu'un qui rédige un document maintenant, dans un navigateur, et veut un aperçu en direct et un fichier à la fin. Sur cette tâche, il est difficile à battre et il n'y a aucune raison de partir. Toutes les raisons qui suivent concernent une autre tâche.

Deux choses méritent vérification avant de décider que l'outil vous a trahi. D'abord, le stockage du navigateur n'est pas une sauvegarde : il vit dans un navigateur sur une machine, et un cache effacé ou une fenêtre privée emporte le document. Ensuite, un export « HTML stylé » et un document HTML autonome sont deux propriétés distinctes. Ouvrez le fichier exporté avec le réseau coupé, dans un autre navigateur. S'il a toujours bonne allure, les styles sont venus avec. S'il devient du texte noir sur fond blanc sur toute la largeur de la fenêtre, le style pointait quelque part que le fichier ne peut pas atteindre — un problème [qu'il vaut la peine de comprendre correctement](/blog/self-contained-html-explained), car il vous suivra jusqu'à l'outil vers lequel vous migrerez.

## Comparatif rapide : l'aide-mémoire

| Outil | À choisir quand | Où vit le texte | Fonctionne sur | Licence |
| --- | --- | --- | --- | --- |
| Dillinger | Vous écrivez maintenant et voulez un aperçu | Le stockage du navigateur, plus un disque cloud si vous en reliez un | N'importe quel navigateur | Gratuit, MIT |
| Un convertisseur en navigateur | Vous avez un fichier et voulez un document HTML fini | Rien ne quitte la machine quand vous n'êtes pas connecté | N'importe quel navigateur | Gratuit |
| Markdown Live Preview | Vous voulez seulement voir le rendu | La page où vous êtes | N'importe quel navigateur | Gratuit, MIT |
| StackEdit | Vous voulez un éditeur en navigateur qui continue hors ligne | Le stockage du navigateur jusqu'à ce que vous branchiez la synchro | N'importe quel navigateur | Gratuit, licence Apache 2.0 |
| Typora | Vous écrivez presque tous les jours et voulez une application | Des fichiers `.md` locaux | macOS, Windows, Linux | Payant, achat unique |
| Obsidian | Beaucoup de notes qui se renvoient les unes aux autres | Un dossier local de votre choix | Ordinateurs, téléphones, tablettes | Gratuit pour tout usage |
| Zettlr | Le document a des citations et un gabarit cible | Des fichiers `.md` locaux | macOS, Windows, Linux | Gratuit, GNU GPL v3 |
| VS Code | Le Markdown est déjà à côté du code | Les fichiers du dossier ouvert | macOS, Windows, Linux | Licence produit ; Code-OSS est MIT |
| Pandoc | La conversion doit tourner sans personne | Là où vos fichiers se trouvent déjà | Ligne de commande | Gratuit, GPL |
| Une API REST ou un CLI | La conversion appartient à une chaîne de traitement | Votre dépôt ou votre runner | Serveur, CI, terminal | Variable |

## Raison une : je veux un convertisseur, pas un éditeur

C'est le groupe le plus nombreux et celui que les listes servent le plus mal. Vous avez déjà un fichier `.md` — un README, un export d'une application de notes, quelque chose qu'un modèle a écrit pour vous — et la tâche consiste à le transformer en page qu'une personne puisse ouvrir. Dillinger sait le faire : collez le texte, utilisez le menu d'export. Mais la forme de l'outil ne convient pas à la course. Il place un curseur devant vous et vous demande d'écrire, alors qu'il ne reste rien à écrire.

Un convertisseur a une autre forme. Vous lui donnez un fichier, il vous en rend un, et il n'y a aucun document à gérer entre les deux. Rien n'est enregistré, rien n'est synchronisé, et il n'y a aucun état à perdre.

### TransformPipe — pour un document HTML fini que vous pouvez envoyer

Un convertisseur côté navigateur prend le fichier Markdown et renvoie un document HTML complet, styles en ligne, en un seul fichier. Il n'y a ni installation ni compte, et hors connexion rien n'est téléversé : le fichier est lu, converti et rendu sur la machine devant vous, ce que vous pouvez confirmer en surveillant l'onglet réseau pendant l'opération.

| Avantages | Inconvénients |
| --- | --- |
| La sortie est un fichier unique qui ne demande rien au réseau | Pas un environnement de rédaction : aucun aperçu en direct dans lequel taper |
| Rien n'est téléversé hors connexion, et aucun compte n'est requis | C'est le navigateur qui travaille, donc un très gros fichier dépend de la machine |
| Le HTML brut présent dans la source passe par une liste d'autorisations fixe avant rendu | Aucun langage de gabarit pour une mise en page sur mesure |
| Convertit aussi HTML, Word, CSV et JSON dans l'autre sens | Un document à la fois, ou plusieurs fusionnés en un |

**Licence :** gratuit d'usage. La conversion est plafonnée à 10 Mo, et un document conservé dans un compte à 4 Mo, parce que la fonction sous-jacente refuse un corps de requête ou de réponse au-delà de 4,5 Mo.

**Détails techniques et fonctionnalités**

- GitHub Flavored Markdown : tableaux, listes de tâches, texte barré, liens automatiques, blocs de code délimités
- La sortie est un document entier — doctype, en-tête, un bloc `<style>` en ligne, aucune requête externe
- Téléchargement en `.html`, `.md` ou texte brut, ou impression en PDF via la boîte de dialogue du navigateur
- La même conversion est disponible depuis une API REST, un CLI sans dépendance, une action GitHub et un serveur MCP

**Pour qui ?** Pour quiconque dont l'étape suivante est « envoyer ceci à quelqu'un ». Si vous êtes arrivé sur Dillinger avec un fichier et reparti avec un document dont vous n'étiez pas sûr qu'il s'ouvrirait sur une autre machine, c'est l'échange qui corrige cela, et il prend à peu près autant de temps que l'export.

### Markdown Live Preview — pour regarder, pas pour livrer

Markdown Live Preview est exactement ce que dit son dépôt : « un petit outil web pour prévisualiser du texte formaté en Markdown », décrit là-bas comme un « éditeur markdown avec aperçu en direct » et publié sous licence MIT (vérifié sur github.com/tanabe/markdown-live-preview, le 9 septembre 2026). Son propre site a refusé une requête automatisée le jour où ces lignes ont été écrites, si bien que tout ce qui précède vient du dépôt et non de la page.

| Avantages | Inconvénients |
| --- | --- |
| Le dépôt est assez petit pour être lu, et sous licence MIT | Un aperçu, pas une chaîne d'export |
| Rien de documenté où se connecter ou synchroniser | Son rendu n'est pas nécessairement celui de votre moteur cible |
| Une seule tâche, accomplie dans la page | Rien à conserver : c'est une surface de brouillon |

**Licence :** gratuit, MIT (vérifié sur github.com/tanabe/markdown-live-preview, le 9 septembre 2026).

**Pour qui ?** Pour quelqu'un qui vérifie qu'un tableau est bien formé, ou qu'une liste imbriquée s'imbrique. C'est la bonne taille pour une question de cinq secondes et la mauvaise pour produire un document. Si votre seule interaction avec Dillinger consistait à y coller du texte pour voir s'il avait bonne allure, ceci le remplace avec moins de choses autour.

### Ce que le groupe des convertisseurs vous apporte

Le fil commun est qu'il n'y a aucun document à perdre. Aucun stockage de navigateur à vider, aucune synchro à configurer, aucune demande OAuth, et aucun brouillon à moitié fini dans un onglet refermé la semaine dernière. L'échange porte sur un fichier contre un autre, puis c'est fini. Pour une part surprenante du trafic derrière cette recherche, c'est toute l'exigence, et tout le reste de la page répond à une question que le lecteur n'a pas posée.

Cela change aussi ce que « sûr » veut dire. Un convertisseur en ligne qui téléverse détient votre document ; un convertisseur qui convertit dans le navigateur ne le détient pas. Cette distinction [mérite vérification plutôt que supposition](/blog/is-an-online-converter-safe) pour tout outil de cette catégorie, y compris ceux d'ici, car les deux conceptions existent et la page dit rarement d'emblée laquelle elle est.

## Raison deux : je le veux hors ligne, ou quelque part que je contrôle

Le deuxième groupe veut l'outil de son côté du réseau. C'est parfois une question de politique interne — une machine professionnelle, le document d'un client, un secteur où « on l'a collé dans un site web » n'est pas une phrase acceptable. C'est parfois pratique : un train, un avion, un bâtiment au wifi déplorable. Et c'est parfois simplement une préférence pour un logiciel qui continue de fonctionner quand une entreprise s'en désintéresse.

Soyez précis sur ce que Dillinger fait et ne fait pas ici, car l'hypothèse réflexe est généralement fausse. Sa propre page indique que l'éditeur continue de fonctionner sans connexion une fois chargé, et que les documents s'enregistrent automatiquement dans le stockage local du navigateur, sans aucune donnée sur ses serveurs (vérifié sur dillinger.io, le 9 septembre 2026). Ce qu'il ne peut pas faire, c'est exister sans le premier chargement : l'application est servie depuis un domaine, donc le code arrive par le réseau chaque fois qu'il n'est pas en cache, et la version que vous obtenez est celle qui est déployée. C'est une propriété différente de celle d'une application signée posée sur votre disque, et pour certains lecteurs c'est toute la différence.

### StackEdit — l'éditeur en navigateur conçu pour fonctionner hors ligne

StackEdit est un éditeur Markdown en navigateur avec aperçu en direct et synchronisation du défilement, et il met l'usage hors ligne en avant : « Même en voyage, StackEdit reste accessible et vous permet d'écrire hors ligne comme n'importe quelle application de bureau. » Il synchronise les fichiers avec Google Drive, Dropbox et GitHub, publie vers Blogger, WordPress et Zendesk, et il est sous licence Apache 2.0 (le tout vérifié sur stackedit.io, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| L'usage hors ligne est un objectif de conception affiché, pas un effet de bord | Cela reste un onglet de navigateur, avec la même dépendance au premier chargement |
| Plus de mobilier rédactionnel que Dillinger : contrôles WYSIWYG, commentaires | Les destinations de synchro sont les mêmes disques cloud que vous évitez peut-être |
| Encaisse les longs documents sans broncher | Sa syntaxe étendue — diagrammes, partitions — voyage mal ailleurs |
| Licence Apache 2.0, donc auto-hébergeable | Le style de l'export lui appartient |

**Licence :** gratuit, licence Apache 2.0 (vérifié sur stackedit.io, le 9 septembre 2026).

**Détails techniques et fonctionnalités**

- GitHub Flavored Markdown, plus des extensions pour les mathématiques LaTeX, les diagrammes UML et les partitions musicales
- Synchronisation avec Google Drive, Dropbox et GitHub ; publication vers Blogger, WordPress et Zendesk
- Un composant intégrable, `stackedit.js`, pour loger l'éditeur dans une autre application
- Des commentaires et des fonctions de collaboration orientées relecture plutôt que rédaction en solitaire

**Pour qui ?** Pour quelqu'un qui appréciait l'onglet de navigateur et veut un éditeur plus sérieux dedans, en particulier là où installer un logiciel n'est pas envisageable. C'est l'échange le plus équivalent de cette page, et la même réserve s'applique : si vous refusiez de relier un disque, StackEdit vous proposera les trois mêmes.

### Typora — l'application, si vous écrivez presque tous les jours

Typora est un éditeur de bureau pour macOS, Windows et Linux qui supprime la fenêtre d'aperçu, le sélecteur de mode et les marqueurs de syntaxe, et affiche le document au fil de la frappe ; ses thèmes sont décrits comme « entièrement configurables par CSS » (les deux vérifiés sur typora.io, le 9 septembre 2026). Sa documentation indique que Typora « permet d'exporter le document courant en PDF, HTML, HTML (sans styles) et en image », et liste Word, OpenOffice, LaTeX, EPUB et le reste comme exports passant par un Pandoc installé (vérifié sur support.typora.io, le 9 septembre 2026). Parce que le thème est du CSS, l'export HTML hérite de la feuille de style active plutôt que d'une apparence maison figée.

| Avantages | Inconvénients |
| --- | --- |
| Un seul volet, pas de vue scindée, pas de bruit syntaxique | Payant, et de bureau uniquement |
| Les thèmes sont du CSS, les exports peuvent donc porter votre propre style | Trois appareils par licence |
| De simples fichiers `.md` sur un disque que vous contrôlez | Un document à la fois ; pas un outil de traitement par lot |
| Aucune intégration à accorder, puisqu'il n'y en a aucune | Remplacer la syntaxe au fil de la frappe convient à certains auteurs et pas à d'autres |

**Prix :** 14,99 $ hors taxe, achat unique couvrant jusqu'à trois appareils, avec un essai gratuit de 15 jours (vérifié sur typora.io, le 9 septembre 2026).

**Pour qui ?** Pour les personnes dont l'habitude du Markdown a débordé d'un onglet. C'est la seule entrée payante ici et la seule où la raison de payer tient à la frappe plutôt qu'à la sortie. Si vous comparez déjà des éditeurs de bureau, les [raisons pour lesquelles on quitte Typora à son tour](/blog/typora-alternatives) méritent lecture avant l'achat, puisque le plafond d'appareils rattrape les gens plus tard plutôt que plus tôt.

### Obsidian — quand les documents se renvoient les uns aux autres

Obsidian travaille sur un dossier de fichiers Markdown posés sur votre propre disque, avec les liens entre notes comme idée organisatrice. Ce n'est ni un convertisseur ni, avant tout, un éditeur pour un document unique ; c'est une application pour une collection. Son site indique qu'il « stocke vos notes localement sous forme de fichiers Markdown en texte brut », propose des versions pour Windows, macOS, Linux, iOS et Android, et évoque « des milliers de plugins » aux côtés d'une API ouverte. Sa page de licence précise qu'il peut être utilisé gratuitement à toutes fins, personnelles, commerciales et associatives comprises, avec des licences payantes optionnelles et non requises, et ne décrit pas l'application comme open source (le tout vérifié sur obsidian.md, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Les fichiers restent dans un dossier que vous avez choisi, en Markdown brut | Une lourdeur énorme si vous n'avez qu'un document |
| Gratuit à toutes fins, usage commercial compris | La page de licence ne revendique pas l'open source, il n'y a donc pas de source à héberger soi-même |
| Fonctionne sur ordinateurs, téléphones et tablettes | Ses liens de type wiki et ses intégrations ne sont pas du Markdown standard |
| Un vaste écosystème de plugins, y compris des plugins d'export | La qualité de l'export dépend du plugin installé |

**Licence :** gratuit à toutes fins ; les licences payantes Catalyst et Commercial sont optionnelles (vérifié sur obsidian.md, le 9 septembre 2026).

**Pour qui ?** Pour quelqu'un dont l'usage de Dillinger était devenu, sans le dire, un système de classement — plusieurs documents, chacun dans un onglet, aucun retrouvable ensuite. C'est le travail d'un dossier et d'une application posée dessus. C'est un grand déplacement pour une petite contrariété, et le [comparatif des éditeurs de cette catégorie](/blog/best-markdown-editors) est un meilleur point de départ que cette page.

### Zettlr — quand le document a une bibliographie et un format cible

Zettlr est une application de rédaction pour Windows, macOS et Linux qui traite l'export comme une étape de premier rang, pilotée par Pandoc via un système de profils : « vous pouvez exporter n'importe quel article avec un gabarit en un seul clic ». Elle s'intègre à des gestionnaires de références dont Zotero et JabRef, et fonctionne avec des gabarits LaTeX et Word (le tout vérifié sur zettlr.com, le 9 septembre 2026). Elle est sous licence GNU GPL v3 (vérifié sur github.com/Zettlr/Zettlr, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Des profils d'export propulsés par Pandoc, avec de vrais gabarits | La puissance de Pandoc vient avec la courbe d'apprentissage de Pandoc |
| Des citations depuis Zotero ou JabRef, dans le document | Plus lourde que tout le reste de ce groupe |
| GPL v3, et vos fichiers restent où vous les avez mis | Orientée écriture académique, ce qui façonne chaque réglage par défaut |
| Recherche plein texte sur tout un projet | Pas un outil de conversion rapide d'un fichier |

**Licence :** gratuit, GNU GPL v3 (vérifié sur github.com/Zettlr/Zettlr, le 9 septembre 2026).

**Pour qui ?** Pour les personnes qui rédigent quelque chose avec des références et un format de sortie imposé — un article, une thèse, un manuscrit. Si vous exportiez depuis Dillinger puis corrigiez le résultat à la main à chaque fois, un outil à gabarits est le correctif structurel.

## Raison trois : je le veux dans l'éditeur que j'ai déjà

Le troisième groupe est composé de développeurs, et la réponse est courte : si le fichier est déjà ouvert dans votre éditeur, c'est là que la conversion devrait se produire. Basculer vers un onglet de navigateur pour rendre un fichier posé sur le disque à cinquante centimètres est le genre d'habitude qui survit longtemps à la raison qui l'a créée.

### VS Code — l'aperçu est déjà installé

VS Code livre un aperçu Markdown bâti sur markdown-it, la même famille de moteur de rendu que celle dans laquelle se situe le problème d'aperçu de Dillinger, et il s'ouvre à côté du fichier d'une frappe. L'export n'est pas intégré ; des extensions le fournissent, et leur qualité varie. Le dépôt source, Code - OSS, est sous licence MIT, tandis que le produit de marque distribué par Microsoft porte une licence produit Microsoft (vérifié sur github.com/microsoft/vscode, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Déjà installé, pour la plupart des développeurs | L'export exige une extension, et les extensions diffèrent |
| L'aperçu reflète le comportement CommonMark de markdown-it | Le style de l'aperçu n'est pas celui de l'export |
| Le fichier ne quitte jamais le dossier où il vit | Pas une chaîne de traitement : il convertit ce qui est ouvert |
| Raccourcis Vim, curseurs multiples, tout ce que Monaco vous donnait | Aucune synchro cloud en direct, ce qui pour ce groupe est justement l'intérêt |

**Licence :** le produit relève d'une licence produit Microsoft ; la source Code - OSS est MIT (vérifié sur github.com/microsoft/vscode, le 9 septembre 2026).

**Détails techniques et fonctionnalités**

- Aperçu côte à côte avec synchronisation du défilement, depuis un raccourci clavier
- markdown-it sous l'aperçu, donc le comportement CommonMark est la référence et les fonctions GFM viennent de préréglages
- Des extensions pour l'export HTML, PDF et diapositives, chacune enveloppant le fragment à sa manière
- Un espace de travail fondé sur un dossier, si bien que le Markdown côtoie le code qu'il documente

**Pour qui ?** Pour quiconque convertit un README ou une note au passage, déjà dans l'éditeur. Il y a là une symétrie amusante : le composant d'édition de Dillinger est Monaco, c'est-à-dire l'éditeur de VS Code extrait pour le navigateur ; un développeur qui quitte Dillinger pour VS Code n'apprend donc aucun nouvel éditeur. Il retire un navigateur d'entre lui et ses fichiers.

Si le Markdown vit dans un dépôt, c'est aussi là que se trouve le reste de l'outillage : analyse statique, orthographe, diffs, relecture. Un document modifié via un outil web puis recollé est un document sans historique, et l'historique est la raison première d'un dépôt.

## Raison quatre : je le veux dans un script

Le quatrième groupe a cessé de vouloir un outil avec un curseur dedans. La conversion a lieu cinquante fois, ou à chaque commit, ou à trois heures du matin, et toute réponse impliquant un onglet de navigateur n'est pas une réponse. Rien dans la catégorie des éditeurs ne sert ce cas, ce qui en fait le groupe le plus susceptible de recevoir la mauvaise recommandation.

### Pandoc — la réponse générale

Pandoc est un convertisseur de documents en ligne de commande qui lit et écrit un grand nombre de formats de balisage. Son propre site indique : « Pandoc is free software, released under the GPL. » (vérifié sur pandoc.org, le 9 septembre 2026). Pour cette tâche, les options pertinentes sont documentées dans son manuel : `--standalone` (`-s`) produit « une sortie avec un en-tête et un pied appropriés (par exemple un fichier HTML, LaTeX, TEI ou RTF autonome, pas un fragment) », et `--embed-resources` produit « un fichier HTML autonome sans dépendance externe, utilisant des URI `data:` pour incorporer le contenu des scripts, feuilles de style, images et vidéos liés » (vérifié sur pandoc.org, le 9 septembre 2026).

```sh
pandoc notes.md -s --embed-resources -o notes.html
```

| Avantages | Inconvénients |
| --- | --- |
| Une commande, reproductible, scriptable, sans onglet | Exige une installation et un terminal |
| `--standalone` et `--embed-resources` produisent un vrai fichier unique | Gabarits et filtres sont un sujet à part entière |
| `--template` donne un contrôle exact sur l'enveloppe | Aucun assainissement : le HTML brut passe tel quel |
| Lit et écrit bien plus que du Markdown et du HTML | Ses dialectes Markdown diffèrent de GFM par endroits |

**Licence :** gratuit, GPL (vérifié sur pandoc.org, le 9 septembre 2026).

**Détails techniques et fonctionnalités**

- `--standalone` enveloppe la sortie dans un document complet au lieu d'émettre un fragment
- `--embed-resources` intègre feuilles de style, scripts et images sous forme d'URI `data:`
- `--template` sélectionne un fichier ou une URL de gabarit, et implique `--standalone`
- `--sandbox` restreint l'accès aux fichiers des lecteurs et des écrivains à ceux nommés sur la ligne de commande, ce qui compte quand l'entrée n'est pas la vôtre

**Pour qui ?** Pour quiconque a une conversion répétée, un répertoire de fichiers, ou un format de sortie autre que HTML. Le marché consiste à échanger une installation et quelques lectures contre une conversion qui n'aura plus jamais besoin d'une personne. Si le terminal est l'endroit où cela doit se passer, [la question plus étroite du Markdown vers HTML en ligne de commande](/blog/markdown-to-html-from-the-command-line) couvre aussi les alternatives à Pandoc.

### Une API, un CLI ou une action CI — quand l'installation est le problème

L'autre forme de cette réponse est une conversion hébergée sans environnement d'exécution à installer : un point de terminaison REST que votre script appelle, un CLI sans dépendance que vous lancez sans gestionnaire de paquets, ou une action qui tourne dans une pull request. C'est la même conversion que celle du navigateur, déplacée là où vit l'automatisation.

| Avantages | Inconvénients |
| --- | --- |
| Rien à installer sur le runner | Un appel réseau, avec tout ce que cela implique |
| La même sortie que la conversion interactive | Des limites de taille s'appliquent à ce que vous pouvez envoyer |
| S'insère dans une pull request ou une tâche nocturne | Moins souple qu'un Pandoc local avec gabarits |

**Pour qui ?** Pour les équipes dont les runners d'intégration continue sont verrouillés, ou pour quiconque ne veut pas d'une installation Haskell dans un conteneur pour transformer un fichier en une page. Il vaut la peine de dire clairement que Pandoc est l'outil le plus capable et qu'un appel hébergé est le plus commode, et que la commodité est une raison légitime de choisir la plus petite des deux choses.

## Là où la réponse évidente échoue, et ce que coûte un changement

Voici la partie autour de laquelle les listes d'alternatives — et celle-ci, jusqu'ici — tournaient. **Un éditeur et un convertisseur sont deux outils différents, et la plupart des gens qui cherchent « alternative à Dillinger » veulent le second.** Recommander un autre éditeur à quelqu'un qui tient un fichier est la mauvaise réponse donnée avec assurance, et c'est la réponse la plus répandue sur internet.

L'indice est ce que vous étiez en train de faire au moment de l'agacement. Si vous tapiez, vous vouliez un éditeur et Dillinger n'en était pas loin : la correction est StackEdit, ou une application, ou rien du tout. Si vous colliez, vous vouliez un convertisseur, et chaque éditeur de chaque liste est un détour avec un curseur dedans. Coller un document fini dans un éditeur pour atteindre son menu d'export est un contournement de l'absence du bon outil, et il reste invisible en tant que contournement parce qu'il ne prend qu'une minute.

Les coûts d'un changement méritent aussi d'être énoncés, car « changer » n'est pas gratuit.

**Changer d'éditeur est une migration, pas un clic.** Les documents dans le stockage de navigateur de Dillinger sont dans le stockage de navigateur de Dillinger. Ils ne sont ni dans un dossier ni dans un dépôt, et aucun autre outil ne les trouvera. Avant de bouger, ouvrez chacun d'eux et téléchargez le Markdown, car dès l'instant où vous vous connectez ailleurs, les anciens brouillons sont à un cache vidé de la disparition. Ce n'est pas une critique de Dillinger — tout outil à stockage navigateur a la même propriété — mais c'est l'étape que l'on saute.

**Un éditeur de bureau déplace le problème vers vos sauvegardes.** Les fichiers locaux sont à vous, ce qui veut dire que le fichier qui n'existe plus est à vous aussi. La synchro cloud de Dillinger existait pour une raison, et la refuser est une décision d'assumer la responsabilité des copies.

**La syntaxe maison ne voyage pas.** Les diagrammes et partitions de StackEdit, les liens wiki et intégrations d'Obsidian, les clés de citation de Zettlr : chacun est utile à l'intérieur de son outil et aucun n'est du Markdown standard. Un document écrit avec eux est portable comme est portable un document écrit dans un dialecte — globalement, jusqu'aux passages intéressants.

**Un export n'est pas un document tant qu'il ne s'ouvre pas ailleurs.** C'est l'échec que l'on reproche à l'éditeur. Un export stylé peut malgré tout référencer un style qu'il ne transporte pas, et le seul test qui l'attrape consiste à ouvrir le fichier dans un autre navigateur, sur une autre machine, réseau coupé. Faites-le une fois avec votre export actuel avant de conclure que l'outil était le problème, car si le nouvel outil se comporte pareil, vous aurez migré pour rien. La propriété que vous testez porte [un nom et une définition](/blog/best-markdown-to-html-converters) qu'il vaut la peine de connaître, et elle décide si un fichier envoyé par e-mail fonctionne.

**Refuser l'intégration ne coûte généralement rien.** La raison la plus fréquente derrière cette recherche est la demande d'accès au cloud, et la correction la plus modeste possible consiste à ne rien connecter : écrire dans l'onglet, exporter, télécharger, terminé. Dillinger fonctionne ainsi par défaut et le dit. Partir à cause d'une boîte de dialogue que vous pouvez fermer est la seule migration de cette page dont personne n'a besoin.

## Comment choisir

1. **Décidez si vous écrivez ou si vous convertissez, et soyez honnête.** S'il ne reste rien à taper, un éditeur est la mauvaise forme et vous le paierez en étapes supplémentaires à chaque fois.
2. **Vérifiez où va le fichier avant de le coller.** Un outil côté navigateur convertit sur votre machine et un outil hébergé reçoit votre document ; les deux conceptions sont légitimes, et une seule est acceptable pour quelque chose de confidentiel.
3. **Testez l'export ailleurs, réseau coupé.** Un fichier qui a bonne allure dans l'outil et mauvaise dans un e-mail est le défaut qui coûte le plus de réputation pour le moins d'effort de détection.
4. **Comptez les installations face au nombre d'exécutions.** Une conversion ne devrait pas exiger un gestionnaire de paquets ; cinquante conversions ne devraient pas exiger une personne qui clique sur un bouton, et le point de bascule arrive plus tôt qu'on ne le croit.
5. **Préférez l'outil qui laisse vos fichiers dans un dossier.** Le stockage du navigateur est commode jusqu'au vidage du cache, et un document introuvable dans un gestionnaire de fichiers est un document déjà partiellement perdu.
6. **N'accordez l'accès au cloud que si la synchro était la fonction voulue.** Relier un Drive ou un dépôt entier pour déplacer un fichier, c'est troquer une permission permanente contre une commodité ponctuelle, alors que le fichier aurait pu être téléchargé.

## Conclusion

Dillinger est un éditeur Markdown en navigateur, gratuit, sous licence MIT, qui garde votre document dans votre navigateur et ne demande rien tant que vous ne réclamez pas de synchronisation — et si la tâche était d'écrire, il reste un endroit raisonnable pour le faire. Si cette recherche existe, c'est que la plupart des gens y arrivent avec un fichier terminé, et qu'un éditeur est le mauvais outil pour un fichier terminé. Pour ce cas, [la conversion Markdown vers HTML de TransformPipe](/) renvoie un document complet et autonome dans le navigateur, sans rien téléverser et sans compte, ce qui correspond à la course plutôt qu'à un nouveau domicile pour votre écriture. Si vous voulez le logiciel sur votre propre disque, StackEdit, Typora, Obsidian et Zettlr sont les véritables alternatives, avec leurs licences ci-dessus. Et si la conversion doit avoir lieu plus de quelques fois, cessez complètement d'évaluer des éditeurs et installez Pandoc.

## FAQ

### Dillinger est-il encore maintenu et peut-on l'utiliser en confiance ?

Le dépôt est public sous licence MIT et le site actuel décrit une pile Next.js et Monaco, il est donc travaillé plutôt qu'abandonné (vérifié sur github.com/joemccann/dillinger et dillinger.io, le 9 septembre 2026). Côté sûreté, ses propres pages affirment que les documents persistent dans le stockage de votre navigateur et qu'aucune donnée ne repose sur ses serveurs, ce qui est une position plus solide que celle de la plupart des éditeurs web gratuits.

### Quelle est la meilleure alternative gratuite à Dillinger ?

Cela dépend de la moitié de Dillinger que vous utilisiez. Pour l'éditeur, StackEdit est gratuit sous licence Apache 2.0 et conçu pour fonctionner hors ligne dans un onglet. Pour la conversion, un convertisseur côté navigateur qui renvoie un fichier HTML autonome est gratuit et évite l'éditeur entièrement.

### Existe-t-il une alternative à Dillinger qui ne se connecte ni à Dropbox ni à Google Drive ?

Plusieurs, et Dillinger lui-même en fait partie si vous refusez l'intégration : rien dans l'éditeur n'exige un disque relié. Si vous préférez que l'option n'existe pas, le dépôt de Markdown Live Preview ne décrit rien d'autre qu'un outil d'aperçu, donc il n'y a aucun disque à relier, et un convertisseur n'a rien à connecter puisqu'il n'y a aucun document à conserver.

### Puis-je héberger Dillinger moi-même ?

Oui. Le dépôt est sous licence MIT et documente un build et un démarrage tout simples (vérifié sur github.com/joemccann/dillinger, le 9 septembre 2026), donc faire tourner votre propre copie est un chemin pris en charge et la licence permet de le modifier. Cela résout l'objection du domaine hébergé sans renoncer à l'éditeur, au prix d'un déploiement à maintenir.

### Pourquoi mon HTML exporté est-il différent de l'aperçu ?

Parce qu'un aperçu est stylé par l'application et qu'un export est stylé par ce que le fichier exporté transporte ou référence. Si le fichier pointe vers un style qu'il n'inclut pas, il s'affiche sans style partout où la référence échoue. Ouvrez votre export dans un autre navigateur, réseau coupé, et vous saurez en une seconde de quel type de fichier il s'agit.

### Ai-je vraiment besoin d'un éditeur pour convertir du Markdown en HTML ?

Non, et c'est la phrase la plus utile de cette page. Un convertisseur prend le fichier et rend un document, sans brouillon à enregistrer, sans synchro à configurer et sans permission à accorder. Si vous n'aviez jamais l'intention d'écrire quoi que ce soit, l'éditeur a toujours été une étape de trop.

### Quelle alternative convient pour un script ou une tâche d'intégration continue ?

Pandoc, gratuit sous GPL, dont les options `--standalone` et `--embed-resources` produisent un fichier HTML unique sans dépendance externe (vérifié sur pandoc.org, le 9 septembre 2026). Là où installer Pandoc sur un runner est l'obstacle, une API de conversion, un CLI sans dépendance ou une action GitHub font le même travail par le réseau.
