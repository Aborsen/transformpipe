---
title: "Alternatives à StackEdit en 2026 : synchronisation, fichiers, bureau et exports ponctuels"
description: "Des alternatives à StackEdit selon votre raison de chercher : synchronisation en panne, documents en fichiers, une application de bureau, ou un seul export."
date: 2026-09-07
tag: Workflow
keywords: alternative à stackedit, alternatives à stackedit, stackedit hors ligne, éditeur markdown dans le navigateur, synchroniser markdown avec google drive, éditeur markdown auto-hébergé, passer d’un espace de travail markdown à des fichiers, exporter stackedit en html
---

Quelque part au milieu d’un document, l’indicateur de synchronisation cesse de se mettre d’accord avec lui-même. La copie ouverte dans l’onglet contient un paragraphe que la copie sur Google Drive n’a pas. La connexion à GitHub réclame une nouvelle autorisation. Un ordinateur portable qu’on n’a pas rouvert depuis un mois se réveille avec une version plus ancienne du même fichier et propose, tout content, de la garder. En général, rien n’est réellement perdu. Mais vingt minutes sont parties dans la plomberie du document plutôt que dans le document lui-même, et c’est le moment où la plupart des gens se mettent à chercher autre chose.

L’autre chemin qui mène à cette page est plus silencieux. Rien ne s’est cassé. Vous avez simplement remarqué que ce que vous écrivez vit dans un onglet de navigateur, dans un espace de stockage que vous ne voyez pas, sur une machine où effacer les données d’un site est un geste d’entretien ordinaire, et vous préféreriez que ce soit dans un dossier que vous pouvez lister.

### En bref

Si c’est la synchronisation qui a lâché, la solution durable consiste en général à ne plus avoir d’espace de travail et à avoir un dossier à la place : un dépôt Git, ou Syncthing, ou un client de stockage en ligne, avec n’importe quel éditeur par-dessus. Si vous voulez des fichiers plutôt qu’un espace de travail, Obsidian, VS Code et Zettlr travaillent tous directement sur des fichiers `.md` sur le disque et n’ajoutent rien que vous ne puissiez voir. Si vous voulez une application présente qu’un navigateur tourne ou non, Mark Text est gratuit sous licence MIT et Typora est un petit achat unique. Et si tout ce que vous vouliez vraiment, c’était transformer un document en page web à envoyer, il n’y a même pas d’espace de travail dans cette tâche-là — c’est une conversion, et cela prend à peu près une minute.

## StackEdit selon ses propres termes

Il vaut la peine d’être précis sur ce que vous remplaceriez, car StackEdit n’est pas une seule fonctionnalité. Sa propre page décrit un éditeur qui vous laisse « écrire hors ligne comme n’importe quelle application de bureau », synchronise vos fichiers avec Google Drive, Dropbox et GitHub, les publie comme billets de blog sur Blogger, WordPress et Zendesk, et vous laisse choisir si la sortie se fait en Markdown, en HTML, ou mise en forme via le moteur de gabarits Handlebars. La syntaxe qu’il gère est annoncée comme GitHub Flavored Markdown, Markdown Extra et CommonMark, plus les expressions mathématiques LaTeX, les diagrammes UML, les partitions en notation ABC et les émojis. La page indique qu’il est distribué sous licence Apache (vérifié sur stackedit.io, le 9 septembre 2026).

Le dépôt complète le tableau. Le projet est sous licence Apache-2.0 et se décrit comme un éditeur Markdown open source complet, bâti sur PageDown, la bibliothèque Markdown qu’utilise Stack Overflow. Il existe une application Chrome et une extension Chrome, un `stackedit.js` embarquable pour intégrer l’éditeur à son propre site, un chart Helm pour le déployer sur Kubernetes avec des identifiants Dropbox, Google, GitHub et WordPress déjà configurés, et un forum communautaire à community.stackedit.io (vérifié sur github.com, le 9 septembre 2026).

Il y a donc quatre produits distincts empaquetés dans un seul onglet : un éditeur, un espace de travail, un client de synchronisation et un outil de publication. C’est précisément ce regroupement qui rend le remplacement de StackEdit si déroutant. Les gens disent « il me faut une alternative à StackEdit » en pensant à quatre choses différentes, et l’alternative qui répond à l’une d’elles est souvent inutile pour les trois autres. Un éditeur de bureau remplace l’éditeur et rien d’autre. Un dépôt remplace l’espace de travail et la synchronisation, sans vous donner le moindre éditeur. Un convertisseur ne remplace rien du tout et termine simplement le travail que vous cherchiez à finir.

L’autre fait structurel compte plus que n’importe quelle fonctionnalité : un document StackEdit est un enregistrement dans un espace de travail, et l’espace de travail est la chose première. Les fichiers dans Drive ou dans un dépôt sont ce vers quoi l’espace de travail se synchronise, pas l’endroit où le document vit réellement. Toutes les autres options de cette page inversent cela — le fichier est premier et les outils sont interchangeables par-dessus. Presque toutes les raisons de partir reviennent à vouloir cette inversion.

## Comparatif rapide : le pense-bête

| Option | La raison à laquelle elle répond | Ce que c’est | Où vivent les documents | Prix |
| --- | --- | --- | --- | --- |
| StackEdit | Ce que vous avez maintenant | Espace de travail navigateur avec sync et publication | Stockage du navigateur, reflété chez un fournisseur | Gratuit, licence Apache |
| Dépôt Git, éditeur au choix | Une sync que vous pouvez inspecter et défaire | Contrôle de version, pas de la sync | Fichiers sur le disque, historique dans le dépôt | Gratuit |
| Syncthing | Sync sans aucun service entre les deux | Synchronisation de fichiers continue entre vos propres appareils | Fichiers sur le disque, sur chaque appareil | Gratuit, MPL-2.0 |
| Un client de stockage en ligne | Une sync que vous payez déjà | Synchronisation de dossier au niveau du système | Fichiers dans un dossier synchronisé | Inclus avec le compte de stockage |
| Obsidian | Des fichiers, avec une vraie application par-dessus | Application de bureau et mobile sur un dossier | Fichiers `.md` bruts dans un coffre | Gratuit pour tout usage |
| VS Code | Des fichiers, à côté du code qu’ils documentent | Éditeur avec aperçu Markdown intégré | Fichiers dans le dossier ouvert | Gratuit |
| Zettlr | Des fichiers, avec des références attachées | Un atelier d’écriture et de publication | Fichiers sur le disque | Gratuit, financé par les dons |
| Mark Text | Une application de bureau gratuite | Éditeur à un seul volet, sortie HTML et PDF | Fichiers sur le disque | Gratuit, MIT |
| Typora | Une application de bureau où s’installer | Éditeur à un seul volet, export très large | Fichiers sur le disque | 14,99 $, jusqu’à trois appareils |
| HedgeDoc | L’onglet du navigateur, sur un serveur que vous contrôlez | Notes Markdown collaboratives en temps réel | Votre serveur | Gratuit, AGPLv3 |
| Un convertisseur dans le navigateur | Un document vers une page, sans espace de travail | Markdown vers HTML, converti localement | Nulle part — le fichier reste chez vous | Gratuit |
| Pandoc | Beaucoup de documents, beaucoup de formats, scripté | Convertisseur de documents en ligne de commande | Fichiers sur le disque | Gratuit, GPL |

Lisez le tableau comme quatre groupes plutôt que douze options. Les lignes deux à quatre remplacent la synchronisation. Les lignes cinq à sept remplacent l’espace de travail par des fichiers. Les lignes huit et neuf remplacent l’onglet par une application. La ligne dix garde l’onglet et déplace le serveur auquel il parle. Les lignes onze et douze ne remplacent rien et terminent un document. Où vous atterrissez dépend entièrement de ce qui, parmi ces quatre choses, s’est cassé.

## Raison une : c’est la synchronisation qui a lâché

C’est le cas le plus fréquent, et les pannes ont toutes la même forme. Un espace de travail est lié à un compte fournisseur unique, si bien qu’un document écrit alors que vous étiez connecté au mauvais compte Google atterrit à un endroit où vous n’irez pas le chercher. Les jetons d’autorisation expirent ou sont révoqués quand un administrateur resserre une politique d’espace de travail, et l’onglet continue à vous laisser taper pendant que la connexion au fournisseur est morte. Deux navigateurs, ou un navigateur et un téléphone, gardent chacun une copie, et un conflit doit être résolu par une personne qui lit deux versions du même paragraphe. Et quand un document n’existe que dans le stockage d’un seul navigateur parce que la synchronisation n’a jamais été branchée, effacer les données du site est une perte de données déguisée en entretien.

Rien de tout cela n’est propre à StackEdit. C’est ce qui arrive quand la synchronisation est une fonctionnalité à l’intérieur d’une application plutôt qu’une couche en dessous. Les alternatives ci-dessous la font descendre.

### Git comme couche de synchronisation

Un dépôt n’est pas un service de synchronisation, et c’est exactement le but. Rien ne se passe tant que vous ne committez pas, ce qui veut dire que la version que vous avez est celle que vous avez faite, et les conflits de fusion sont explicites plutôt qu’un dialogue vous demandant lequel des deux paragraphes vous vouliez vraiment. Vous obtenez un historique, un paragraphe supprimé il y a trois semaines reste donc récupérable, ce qu’aucun client de stockage en ligne et aucun espace de travail navigateur ne vous offrira.

| Avantages | Inconvénients |
| --- | --- |
| Chaque version est récupérable, avec un message expliquant pourquoi | Il faut committer, et vous l’oublierez |
| Les conflits sont visibles et se résolvent ligne par ligne | Les conflits de fusion en prose sont pénibles à lire |
| Fonctionne avec tous les éditeurs de cette page, et avec aucun en particulier | Pas de solution téléphone sans une application qui parle Git |
| Le dépôt distant est aussi le déclencheur de publication | Un dépôt est une habitude, pas un réglage |

**Pour qui ?** Pour quiconque a déjà ses documents près du code, et pour quiconque a perdu du travail une fois et ne compte pas recommencer. Cela transforme aussi la publication d’un bouton en une compilation, ce qui est un gain plutôt qu’une perte : pousser une branche peut rendre et déployer le document, et [publier directement depuis un dépôt](/blog/publish-markdown-from-github-actions) est un chemin bien balisé.

### Syncthing — de la synchronisation sans rien au milieu

Syncthing se décrit comme un programme de synchronisation de fichiers en continu qui synchronise des fichiers entre deux ordinateurs ou plus en temps réel. Sa page est franche sur l’architecture : aucune de vos données n’est jamais stockée ailleurs que sur vos propres ordinateurs, et il n’y a pas de serveur central qui pourrait être compromis. Il tourne sur macOS, Windows, Linux, FreeBSD, Solaris, OpenBSD et d’autres plateformes, et s’administre par une interface web (vérifié sur syncthing.net, le 9 septembre 2026). Le code est sous licence MPL-2.0 (vérifié sur github.com, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Pas de compte, pas de fournisseur, pas de quota | Les deux appareils doivent être allumés en même temps pour synchroniser |
| Les fichiers restent de simples fichiers dans un dossier ordinaire | La mise en place se fait appareil par appareil, et la première prend une soirée |
| Rien à réautoriser dans six mois | Pas d’historique : une mauvaise modification se propage aussi vite qu’une bonne |
| Fonctionne pour un dossier de n’importe quoi, pas seulement du Markdown | Un téléphone est possible mais n’est pas le cas simple |

**Pour qui ?** Pour quelqu’un qui veut ses documents sur trois machines sans société intermédiaire. Associez-le à un dépôt si vous voulez aussi un historique, car Syncthing est très doué pour mettre chaque appareil d’accord et n’a aucune opinion sur quelle version était la bonne.

### HedgeDoc — le même onglet, sur un serveur que vous contrôlez

Si ce que vous aimiez dans StackEdit, c’était que ce soit un onglet de navigateur, et ce que vous n’aimiez pas, c’était de qui était ce navigateur, l’option auto-hébergée s’appelle HedgeDoc. Il vous permet de créer des notes Markdown collaboratives en temps réel, il est sous licence AGPLv3, il a un guide d’installation pour l’auto-hébergement et une instance de démonstration, et il existe une version alpha de HedgeDoc 2 (vérifié sur github.com, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Plusieurs personnes dans un même document à la fois | Vous gérez désormais un serveur, avec ses sauvegardes |
| Rien à installer pour quiconque l’utilise | Les notes vivent dans votre base de données, exporter devient donc une tâche |
| L’URL vous appartient et ne bougera pas | Seul, c’est plus d’infrastructure qu’un rédacteur isolé n’en a besoin |
| Un espace de travail navigateur dont vous pouvez sauvegarder le stockage | Pas un dossier de fichiers, à moins de l’exporter comme tel |

**Pour qui ?** Pour une équipe qui préfère la rédaction partagée aux fichiers, et qui a déjà quelqu’un pour faire tourner les choses. Pour une seule personne, cela échange un problème de synchronisation contre un problème d’exploitation, et le second est plus lourd.

## Raison deux : vous voulez les documents comme des fichiers

La deuxième raison n’a rien à voir avec quoi que ce soit de cassé. C’est l’inconfort de ne pas pouvoir montrer du doigt son propre travail. Un dossier de fichiers `.md` peut être listé, grepé, zippé, copié sur une clé, ouvert par n’importe quoi, et lu dans cinquante ans. Un espace de travail peut être exporté, et un export est une chose qu’il faut penser à faire.

Les trois options ci-dessous sont des applications ordinaires par-dessus un dossier ordinaire, et passer de l’une à l’autre ne coûte rien puisque aucune ne possède les fichiers. Le compromis est qu’aucune d’elles ne synchronise quoi que ce soit toute seule, ce qui fait l’objet de la section honnête plus bas. Pour l’expérience d’écriture elle-même — comment les volets sont disposés, ce que taper procure comme sensation — le [comparatif des éditeurs Markdown](/blog/best-markdown-editors) entre bien plus dans le détail que ce qui est utile ici ; ce qui suit parle de stockage.

### Obsidian — un dossier, avec une application par-dessus

Obsidian ouvre un répertoire de fichiers Markdown, l’appelle un coffre, et ajoute des liens, une recherche et un système de plugins. Les fichiers restent les fichiers ; supprimez Obsidian, le dossier ne change pas. Son site indique qu’il stocke vos notes localement en Markdown texte brut, qu’il utilise des formats de fichiers ouverts pour que vous ne soyez jamais enfermé, et qu’il existe des applications mobiles à côté de la version de bureau. Sa page de licence indique qu’Obsidian est gratuit pour tout usage, personnel, commercial et associatif compris, et que les licences commerciales sont des licences facultatives qui aident à garder le projet financé par ses utilisateurs (vérifié sur obsidian.md, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| De simples fichiers sur le disque, pas de base de données, pas d’étape d’export | Sa syntaxe de liens lui est propre et ne voyage pas partout |
| Gratuit pour un usage commercial, sans compte à créer | L’écosystème de plugins est une façon de perdre un après-midi |
| Bureau et téléphone, sur le dossier que vous choisissez | La synchronisation devient une décision séparée, désormais à votre charge |
| Recherche sur tout ce que vous avez jamais écrit | Il veut être tout votre système de notes, pas un seul document |

**Pour qui ?** Pour quelqu’un qui a un corpus plutôt qu’un document — la personne qui a deux cents documents StackEdit et commence à remarquer qu’en retrouver un est plus dur que de l’avoir écrit.

### VS Code — le dossier que vous avez déjà ouvert

Si vos documents sont à côté du code, l’éditeur tourne déjà. Sa documentation indique que VS Code prend en charge les fichiers Markdown d’origine et que vous pouvez basculer entre la source et un aperçu du fichier (vérifié sur code.visualstudio.com, le 9 septembre 2026), et son intégration Git fait que la question de la synchronisation et celle de la version trouvent leur réponse en même temps, dans le même outil.

| Avantages | Inconvénients |
| --- | --- |
| Déjà installé, chez la plupart des développeurs | C’est un IDE, et cela y ressemble même pour écrire de la prose |
| Git, terminal et fichiers dans la même fenêtre | L’export demande une extension, et les extensions varient |
| Gratuit, et identique sous Windows, macOS et Linux | Pas de téléphone |
| Des extensions couvrent le linting, les tableaux et la correction orthographique | Le style de l’aperçu n’est pas celui de l’export |

**Pour qui ?** Pour les développeurs, et pour quiconque dont les documents sont de la documentation. Le README et les notes de version ont leur place à côté de ce qu’ils décrivent, un argument qui n’a rien à voir avec les éditeurs.

### Zettlr — des fichiers, avec des références attachées

Zettlr se présente comme un atelier de publication complet couvrant le processus depuis les premières notes jusqu’à la soumission à une revue ou un manuscrit de livre, avec intégration d’un gestionnaire de références et prise en charge des citations. Sa page indique qu’il s’agit d’un logiciel libre financé par des dons, sans synchronisation cloud forcée et sans télémétrie, disponible pour Windows, macOS et Linux (vérifié sur zettlr.com, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Citations et bibliographies comme fonctionnalité de premier ordre | Pensé pour l’écriture universitaire, et conçu en conséquence |
| Gratuit, sans composant cloud dont il faille se désinscrire | Plus lourd qu’un éditeur de notes si vous n’écrivez que des notes |
| Fichiers bruts sur le disque, dossiers de projet, exports | Sa chaîne d’export vous demande d’apprendre un peu de Pandoc |
| Les documents longs et les manuscrits sont le cas d’usage prévu | Pas d’outil téléphone |

**Pour qui ?** Pour quiconque a des documents avec des sources. Si votre espace de travail StackEdit déborde d’expressions LaTeX et de citations à moitié terminées, c’est ce qui s’en rapproche le plus tout en restant un simple dossier.

## Raison trois : vous voulez une application, pas un onglet, et vous la voulez hors ligne

StackEdit met en avant l’écriture hors ligne, et l’affirmation est vraie dans un sens précis : un navigateur peut mettre en cache une application et la laisser fonctionner sans réseau. Ce que les gens entendent par « hors ligne » est en général plus large que cela, et c’est dans cet écart que vit la frustration.

Un espace de travail navigateur est capable de fonctionner hors ligne sans être local par nature. L’application doit avoir été chargée au moins une fois dans ce navigateur, dans ce profil. Une fenêtre privée démarre sur rien. Un navigateur différent est une installation différente avec un stockage différent. Les données de site effacées par vous, par une politique, ou par une extension de confidentialité bien intentionnée emportent les documents avec elles, sauf si un fournisseur de synchronisation était déjà connecté. Et un onglet qui n’est pas ouvert n’est pas une application : le fermer par accident est une simple pression de touche, et restaurer la session est une opération différente d’ouvrir un fichier. Rien de tout cela n’est un défaut de StackEdit. C’est ce qu’est le stockage d’un navigateur.

Une application sur le disque change tout cela d’un coup. Le document est un fichier avec un chemin. L’éditeur est dans le dock. Les sauvegardes le couvrent déjà, parce que les sauvegardes couvrent le disque. Deux options méritent d’être nommées, situées de part et d’autre d’un prix très modeste.

### Mark Text — gratuit, MIT, et rendu au fil de la frappe

Mark Text se décrit comme un éditeur Markdown open source simple, centré sur la rapidité et la facilité d’usage. Il propose une vue source, des modes machine à écrire et concentration, sort en HTML et PDF, est sous licence MIT, et tourne sur Linux, macOS et Windows (vérifié sur github.com, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Gratuit sous licence MIT, sans compte | Vérifiez l’activité récente du dépôt avant de vous y engager |
| Rend au fil de la frappe, la syntaxe s’efface donc du chemin | Sortie HTML et PDF uniquement |
| Fichiers locaux, rien téléversé, rien à autoriser | Pas de synchronisation propre |
| Trois modes d’écriture, dont une vue source pure | Pas de version mobile |

**Pour qui ?** Pour quelqu’un qui remplace la moitié « éditeur » de StackEdit sans dépenser un centime, sur une machine qu’il administre lui-même.

### Typora — la version payante, et le menu d’export en est la raison

Typora remplace le Markdown par son rendu au fil de la frappe, et sa liste d’exports est la plus large de tous les éditeurs présentés ici. Sa page annonce un prix de 14,99 $ hors taxe, une licence couvrant jusqu’à trois appareils, et quinze jours d’essai gratuit, et liste l’export en PDF avec signets aux côtés de docx, OpenOffice, LaTeX, MediaWiki et EPUB (vérifié sur typora.io, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Export vers des formats qu’aucun éditeur navigateur n’atteint | Payant, et uniquement pour le bureau |
| Un seul volet : pas de source et d’aperçu à garder alignés | Masquer la syntaxe convient à certains rédacteurs, pas à d’autres |
| Fichiers locaux ; la période d’essai suffit pour se décider | Pas un espace de travail, et pas un synchroniseur |
| Les thèmes contrôlent l’apparence du HTML exporté | Un document à la fois, par conception |

**Pour qui ?** Pour quelqu’un qui écrit la plupart des jours et a besoin que le document reparte sous une autre forme que du Markdown. Si la tâche récurrente est « envoyer ça en fichier Word », le menu d’export se rembourse immédiatement.

Il existe aussi la plus petite option navigateur. Dillinger est l’autre éditeur connu dans un onglet, conçu autour d’un document plutôt que d’un espace de travail : un éditeur, un aperçu et un menu d’export. Comme remplaçant de StackEdit, il n’a de sens que si ce que vous vouliez, c’était moins de pièces mobiles plutôt que des pièces différentes, et [la même question à quatre branches s’applique quand on le quitte lui aussi](/blog/dillinger-alternatives).

## Raison quatre : vous vouliez une seule conversion, et l’export est tout le travail

Voici le cas qui n’est pas du tout une question d’éditeur. Quelqu’un a demandé le document sous forme de page web. Vous êtes venu chercher une alternative à StackEdit parce que c’est là que le document se trouve, mais ce dont vous avez besoin n’est pas un nouvel endroit pour écrire — c’est un fichier qui s’ouvre correctement sur la machine de quelqu’un d’autre. C’est le travail d’un convertisseur, et cela prend une minute plutôt qu’une migration.

### Ce qu’est vraiment la sortie HTML de StackEdit

La page de StackEdit décrit la sortie comme du Markdown, du HTML, ou une mise en forme via le moteur de gabarits Handlebars (vérifié sur stackedit.io, le 9 septembre 2026). La partie Handlebars est ce que les gens ratent le plus souvent : l’enveloppe autour du document rendu est à vous de définir, vous pouvez donc produire le balisage attendu par n’importe quelle cible de publication. C’est aussi un gabarit qu’il faut écrire soi-même, et tant que vous n’en avez pas écrit un, ce que vous obtenez, c’est la valeur par défaut de l’outil plutôt qu’un document pensé pour un destinataire.

Cette valeur par défaut est l’endroit où trois choses précises tournent mal, et les trois valent la peine d’être vérifiées avant d’envoyer quoi que ce soit :

1. **Est-ce un document ou un fragment ?** Un rendu de votre Markdown — titres, paragraphes, tableaux — n’est pas la même chose qu’un fichier avec un doctype, un head et des styles. Ouvert seul, un fragment se rend en texte noir dans la police par défaut du navigateur, sur toute la largeur de la fenêtre, ce qui est du HTML parfaitement valide et paraît cassé à quiconque le reçoit.
2. **Demande-t-il quelque chose au réseau ?** Une feuille de style liée ou une police web tirée d’un CDN paraît très bien sur votre machine, où le navigateur l’a en cache, et paraît défaillante dans un train. Cela indique aussi au navigateur du destinataire de faire une requête vers un endroit tiers, une chose que certains destinataires remarquent.
3. **Les parties astucieuses survivent-elles ?** Les expressions LaTeX, les diagrammes UML et les partitions ABC sont rendus à l’intérieur de l’éditeur par des bibliothèques qui tournent sur la page. Qu’ils arrivent dans le fichier exporté comme des images, comme du balisage, ou comme le texte source que vous avez tapé n’est pas quelque chose à supposer. Exportez un document contenant chacun d’eux et regardez.

La propriété que vous voulez, c’est un fichier autonome : un seul document, les styles intégrés, aucune requête externe, pour qu’il se rende à l’identique sur un ordinateur sans connexion. [Ce que cela signifie en détail, et comment le vérifier](/blog/self-contained-html-explained) est un sujet à part entière, et c’est toute la différence entre envoyer un document à quelqu’un et lui envoyer un document plus un mode d’emploi.

### Un convertisseur, sans espace de travail attaché

Pour le cas d’un seul document, un convertisseur côté navigateur est le chemin le plus court. Copiez le Markdown hors de l’éditeur, ou téléchargez le fichier `.md`, et [convertissez-le en un fichier HTML autonome](/) — TransformPipe fait cela dans le navigateur, et une fois déconnecté rien n’est téléversé nulle part, ce qui est tout l’intérêt pour un document que vous n’avez pas encore publié. Il n’y a pas de compte, pas d’espace de travail, et rien à synchroniser, parce que l’outil n’essaie de rien garder.

La même approche couvre les tâches maladroites qui traînent autour de l’abandon d’un espace de travail : un document qui doit devenir une page pour une collègue aujourd’hui, un export que vous voulez vérifier avant de faire confiance au reste, un fichier venu de quelqu’un d’autre que vous devez lire et rendre sans adopter ses outils.

### Pandoc, quand il y en a deux cents

Si la réponse à « combien de documents » est un nombre plutôt que « celui-ci », la tâche se déplace vers la ligne de commande. Pandoc lit et écrit une quarantaine de formats, est gratuit et sous licence GPL, et emballera la sortie dans un document complet plutôt qu’un fragment quand vous le lui demandez. Il n’a pas non plus d’opinion sur votre espace de travail, ce qui est exactement ce qu’il faut quand la tâche consiste à parcourir un répertoire issu d’un export et à tout transformer en autre chose. [Passer du Markdown au HTML depuis un terminal](/blog/markdown-to-html-from-the-command-line) est une question plus étroite que toute l’étendue de Pandoc, et pour un cas isolé c’est en général plus d’outillage que la tâche n’en demande — mais pour une migration, c’est exactement la bonne quantité.

## Ce que vaut réellement un espace de travail navigateur avec synchronisation

Chaque option ci-dessus a un coût, et la version honnête de cet article dit clairement que la forme de StackEdit est une bonne forme. Elle est pratique d’une manière que « prenez simplement des fichiers » ne l’est pas, et prétendre le contraire pousse les gens à changer d’outil puis à le regretter en silence.

**Quelqu’un d’autre a résolu la synchronisation à votre place.** Google Drive, Dropbox et GitHub, câblés et fonctionnels, représentent un vrai travail d’ingénierie que vous n’avez pas eu à faire. Passez à un dossier de fichiers, et cela devient votre travail. Les options sont un dépôt auquel il faut penser à committer, un outil pair-à-pair qui exige deux appareils allumés en même temps, ou un client de stockage sans historique qui propagera volontiers une erreur sur chaque machine que vous possédez. Chacune de ces solutions fonctionne. Aucune n’est sans effort, et l’effort revient sans cesse.

**Aucune installation, sur n’importe quelle machine.** Un ordinateur professionnel verrouillé, un ordinateur de bureau emprunté, un poste de bibliothèque : un espace de travail navigateur est disponible sur les trois, un éditeur de bureau sur aucun. Si une partie de la raison pour laquelle vous utilisez StackEdit est que vous ne pouvez installer aucun logiciel, tout le groupe bureau décrit plus haut n’est pas une option, et les alternatives honnêtes sont un autre outil navigateur ou une solution auto-hébergée.

**Un téléphone qui fonctionne.** Les éditeurs navigateur sont utilisables sur un téléphone d’une manière que les applications de bureau fondées sur un dossier ne le sont pas, à moins que l’application ait sa propre appli mobile et que vous ayez, par ailleurs, résolu la question de faire arriver le dossier sur le téléphone.

**La publication tenait en un bouton.** StackEdit publie sur Blogger, WordPress et Zendesk. Des fichiers et un dépôt remplacent cela par une chaîne que vous construisez vous-même. Meilleure, à terme — versionnée, relisable, automatisée — et ce n’est pas gratuit. C’est un après-midi, puis une surface à entretenir.

**Partir coûte aussi quelque chose.** Un espace de travail doit être vidé document par document, ou par quelque chemin en masse qui existerait, et les documents qui en ressortent ne sont peut-être pas ceux dont vous vous souvenez. La liste de syntaxes de StackEdit inclut Markdown Extra et CommonMark aux côtés de GitHub Flavored Markdown, plus LaTeX, UML et la notation ABC. Une partie de tout cela est standard, une autre est une extension, et les extensions sont précisément ce qu’un outil différent ne reconnaîtra pas : un diagramme devient un bloc de code, une formule devient des signes dollar littéraux suivis de texte. Ce n’est pas une corruption, c’est [la différence entre les dialectes](/blog/commonmark-gfm-and-the-flavours), et c’est la partie d’une migration qui prend plus longtemps que prévu. Convertissez d’abord deux ou trois de vos documents les plus compliqués, et décidez en les ayant sous les yeux.

**Et ce qui ne change pas.** Votre Markdown reste votre Markdown. Chaque outil ici lit les mêmes fichiers, la décision est donc réversible d’une manière que ne l’est pas l’abandon d’un format de document propriétaire. Cela vaut la peine de le dire, car cela abaisse l’enjeu : vous choisissez où vivent les documents et qui les déplace, pas si vous pourrez encore les lire l’an prochain.

## Comment choisir

1. **Nommez en une phrase ce qui s’est cassé.** « La sync a lâché », « je veux des fichiers », « je veux une application », « j’ai besoin d’un fichier HTML » mènent à quatre réponses différentes, et choisir un outil avant de nommer la raison est la façon dont les gens finissent par migrer deux fois.
2. **Décidez qui est responsable de la synchronisation avant de choisir un éditeur.** Si la réponse est « moi, avec un dépôt », vous pouvez utiliser n’importe quel éditeur de cette page ; si la réponse est « le service de quelqu’un d’autre », vos options réalistes sont un espace de travail navigateur ou une application qui vend la synchronisation, et cette contrainte vaut la peine d’être connue tôt.
3. **Vérifiez si vous pouvez installer un logiciel, tout simplement.** Sur une machine gérée par une entreprise, tout le groupe bureau est indisponible, et la comparaison utile se fait entre outils navigateur et solution auto-hébergée plutôt qu’entre éditeurs.
4. **Exportez d’abord vos trois pires documents.** Celui avec un tableau, celui avec une formule, celui avec un diagramme. Si ces trois-là survivent, le reste suivra ; sinon, vous l’aurez appris en dix minutes plutôt qu’après avoir déplacé deux cents fichiers.
5. **Ouvrez le HTML exporté ailleurs, réseau coupé.** Un autre navigateur, idéalement une autre machine. Ce seul test attrape les fragments, les styles manquants, les polices tirées d’un CDN et les diagrammes qui n’ont pas voyagé, et c’est le seul test qui reflète ce que voit le destinataire.
6. **Comptez le travail qui revient, pas la mise en place.** Un dépôt coûte un commit par séance, pour toujours. Un client de stockage ne coûte rien par séance et ne donne aucun historique. Un espace de travail coûte une autorisation tous les quelques mois. Choisissez le coût que vous accepterez réellement de continuer à payer.

## Conclusion

Il n’existe pas une seule alternative à StackEdit, parce que StackEdit est quatre outils dans un onglet, et presque personne ne veut remplacer les quatre à la fois. Si c’est la synchronisation qui a lâché, placez-la sous vos fichiers avec un dépôt ou Syncthing, et utilisez l’éditeur de votre choix. Si vous voulez les documents comme des fichiers, Obsidian, VS Code et Zettlr ne sont que des applications par-dessus un dossier, et essayer l’un puis l’autre ne coûte rien dans un sens comme dans l’autre. Si vous voulez quelque chose sur le disque qui s’ouvre sans navigateur, Mark Text est gratuit et le menu d’export de Typora vaut son petit prix. Et si toute la mission était un seul document que quelqu’un attend comme page web, ne migrez rien — convertissez le fichier, vérifiez qu’il s’ouvre réseau coupé, et [envoyez-le comme une seule page autonome](/blog/share-a-markdown-document-as-a-link). La question de l’espace de travail peut bien attendre une semaine où rien n’est urgent.

## FAQ

### Quelle est la meilleure alternative à StackEdit ?

Cela dépend de la partie de StackEdit que vous remplacez. Pour la moitié espace de travail plus fichiers, Obsidian sur un dossier synchronisé est la réponse unique la plus proche ; pour la moitié éditeur sur un bureau, Mark Text est l’option gratuite et Typora la payante ; pour l’onglet du navigateur lui-même, un HedgeDoc auto-hébergé garde la même forme tout en déplaçant le stockage vers un serveur que vous contrôlez.

### StackEdit est-il gratuit et open source ?

Oui. Son site indique qu’il est distribué sous licence Apache, et le dépôt est sous Apache-2.0, décrit comme un éditeur Markdown open source complet, bâti sur PageDown (vérifié sur stackedit.io et github.com, le 9 septembre 2026). Être open source est d’ailleurs la raison même pour laquelle la voie de l’auto-hébergement existe.

### Puis-je auto-héberger StackEdit plutôt que le quitter ?

Le dépôt contient un chart Helm pour le déployer sur Kubernetes, avec une configuration pour les identifiants Dropbox, Google, GitHub et WordPress, et un `stackedit.js` embarquable pour intégrer l’éditeur à ses propres pages (vérifié sur github.com, le 9 septembre 2026). Si votre objection porte sur l’instance hébergée plutôt que sur l’outil, c’est un changement bien plus petit que de changer d’éditeur.

### Pourquoi mon document StackEdit a-t-il cessé de se synchroniser avec Google Drive ?

Les causes habituelles sont une autorisation expirée ou révoquée, un espace de travail lié à un compte fournisseur différent de celui sur lequel vous êtes connecté, ou deux copies qui ont divergé et ont besoin d’une personne pour les réconcilier. La solution durable n’est pas un autre bouton mais un autre agencement : garder le document comme fichier et laisser un dépôt ou un outil de synchronisation le déplacer.

### Existe-t-il une alternative à StackEdit qui fonctionne hors ligne ?

N’importe quel éditeur de bureau fonctionne hors ligne au sens plein, parce que le fichier est sur le disque et que l’application n’a pas besoin de réseau pour l’ouvrir. Les éditeurs navigateur sont capables de fonctionner hors ligne plutôt que d’être locaux par nature : ils doivent avoir été chargés une fois dans ce profil de navigateur, et effacer les données du site supprime ce qui n’a pas été synchronisé.

### Mes documents changeront-ils si je les sors de StackEdit ?

Le Markdown pur, non. Les extensions, peut-être : les expressions LaTeX, les diagrammes UML et la notation ABC figurent parmi la syntaxe que gère StackEdit, et un outil qui ne les implémente pas affichera le texte source à la place d’un rendu. Déplacez d’abord votre document le plus compliqué et regardez-le dans le nouvel outil avant de déplacer le reste.

### Ai-je besoin d’un éditeur si je veux seulement un fichier HTML ?

Non, et c’est l’erreur la plus fréquente de toute cette recherche. Si la tâche est « transformer ce Markdown en une page que je peux envoyer », un convertisseur le fait sans compte, sans espace de travail, et sans rien à synchroniser, et la seule chose qui vaut la peine d’être vérifiée ensuite, c’est que le fichier obtenu s’ouvre correctement réseau coupé.
