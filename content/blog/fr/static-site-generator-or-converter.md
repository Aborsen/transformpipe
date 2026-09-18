---
title: "Ai-je besoin d’un générateur de site statique ? Guide de décision"
description: "Un générateur de site statique apporte la navigation, les gabarits, la recherche et les taxonomies, et les facture en chaîne d’outils. Trois questions tranchent."
date: 2026-09-04
tag: Publication
keywords: ai-je besoin d’un générateur de site statique, générateur de site statique ou convertisseur, alternative au générateur de site statique, mkdocs ou convertisseur, quand utiliser un générateur de site statique, markdown vers html sans build, publier du markdown simplement
---

Vous avez un répertoire plein de fichiers Markdown, et il faut bien qu’ils finissent quelque part. Le conseil que vous trouverez partout est d’installer un générateur de site statique ; il en existe six sérieux, et chacun possède une page de démarrage qui s’achève sur un site en état de marche en quatre commandes. Aucune de ces pages ne demande si vous aviez besoin d’un site.

C’est pourtant là qu’est la décision, et on la prend presque toujours à l’envers : l’outil est choisi d’abord, puis le besoin est étiré jusqu’à ce qu’il entre dedans. Un générateur est un système de build. Il attend un répertoire organisé à sa façon, un fichier de configuration, un langage de gabarits, un thème, un fichier de verrouillage et un endroit où déployer sa sortie. En échange, il vous donne des capacités réelles qu’un convertisseur fichier par fichier ne peut pas offrir : une arborescence de navigation calculée à partir des fichiers, des liens entre pages qui font échouer le build lorsqu’ils pourrissent, un index de recherche, une page listant les tags. Si vous en avez besoin, rien d’autre ne fera l’affaire. Sinon, vous vous êtes chargé d’une chaîne d’outils pour fabriquer des pages qu’un convertisseur aurait fabriquées sans elle.

Le désagréable, c’est que le coût n’arrive pas le jour de l’installation. Il arrive onze mois plus tard, le jour où une alerte de sécurité impose de monter une dépendance, où le thème n’a jamais été publié contre la nouvelle version majeure, et où la personne qui avait choisi le générateur a changé d’employeur.

### En bref

Vous avez besoin d’un générateur de site statique quand les pages doivent se connaître les unes les autres — navigation commune, liens croisés vérifiés, index de recherche, listes de tags ou de versions — ou quand la sortie doit être reconstruite automatiquement à chaque modification de la source. Vous n’en avez pas besoin pour un document qui a un destinataire, ni pour une poignée de pages entre lesquelles personne ne navigue ; un convertisseur et un lien y suffisent, et il n’y a rien à entretenir. Le nombre de fichiers est le mauvais critère : cinquante notes sans rapport entre elles ne réclament aucun générateur, et trois pages interdépendantes qui doivent être republiées à chaque merge en réclament un. Dans le doute, publiez d’abord avec un convertisseur — la migration ultérieure vers un générateur est pénible mais bornée, tandis que la chaîne d’outils que vous n’avez jamais installée n’a rien coûté à maintenir en vie.

## Ce qu’un générateur vous donne, et ce qu’il facture pour cela

### Les capacités, nommées comme des capacités

Les pages commerciales décrivent les générateurs avec des adjectifs. La description utile est une liste de choses qu’ils font et qu’un convertisseur ne fait pas, puisque c’est exactement ce que vous achetez.

**Une arborescence de navigation dérivée des fichiers.** Le générateur parcourt votre répertoire source, lit le front matter, et construit à partir de ce qu’il trouve une barre latérale et un fil d’Ariane. Ajoutez un fichier, il apparaît dans le menu. Un convertisseur n’a pas de répertoire ; il a le fichier unique que vous lui avez donné, et il ne peut pas savoir ce qui existe à côté.

**Des gabarits, appliqués à chaque page.** Un fichier de mise en page, et chaque page reçoit le même en-tête, le même pied, le même lien canonique et la même balise d’analyse d’audience. Changez la mise en page et deux cents pages changent avec elle. Un convertisseur applique une feuille de style à un document ; il n’applique pas une enveloppe commune à un ensemble.

**Des liens croisés vérifiés.** Les générateurs résolvent les liens internes contre l’arborescence des fichiers, et la plupart font échouer le build quand un lien pointe vers une page qui n’existe plus. Ce seul comportement est l’argument le plus fort en faveur d’un générateur pour un ensemble documentaire, parce que la décomposition des liens dans une documentation est silencieuse et permanente.

**Un index de recherche.** Une recherche plein texte sur l’ensemble, construite au moment de la compilation, servie sous forme de fichier JSON que la page charge. Vous n’obtiendrez jamais cela de fichiers convertis un par un. La recherche dans la page du navigateur fouille un document ; un champ de recherche les fouille tous.

**Des taxonomies.** Tags, catégories, versions, auteurs — chacun devenant sa propre page de liste générée, avec pagination. La liste n’existe pas comme fichier source ; elle est calculée. C’est ainsi que se fabriquent un index de blog, une page « toutes les pages marquées API » et un sélecteur de version.

**Des builds incrémentaux et un serveur de rechargement à chaud.** Un générateur sait quelles sorties dépendent de quelles entrées : une modification d’un seul caractère reconstruit une page plutôt que toutes, et le navigateur se rafraîchit pendant que vous tapez. Sur un grand ensemble, c’est la différence entre une boucle d’édition dans laquelle on peut travailler et une boucle qu’il faut attendre — ce qui, sur une année, fait la différence entre une documentation qui se corrige et une documentation qu’on laisse en l’état.

**Une chaîne de traitement des ressources.** Images redimensionnées et empreintées, Sass compilé, CSS et JavaScript regroupés et hachés pour invalider les caches. La sortie référence `style.a83f1c.css`, et vous pouvez y poser un en-tête de cache d’un an sans crainte.

**Flux, plans de site et redirections.** RSS, `sitemap.xml`, et une table de redirections pour qu’une ancienne URL continue de fonctionner après le déplacement d’une page. Chacun est ennuyeux et chacun est un vrai travail que quelque chose doit bien accomplir.

### Les coûts, nommés comme des coûts

**Une chaîne d’outils.** Un environnement d’exécution dont vous n’aviez pas besoin auparavant, sur chaque machine qui construit le site : Python pour MkDocs et Sphinx, Node pour Docusaurus et Eleventy, un binaire Go ou Rust pour Hugo et mdBook. Puis le même environnement, dans une version compatible, dans l’intégration continue.

**Un fichier de verrouillage, et l’arbre qu’il y a en dessous.** Un générateur JavaScript avec un thème et une demi-douzaine de greffons se résout en un grand graphe de dépendances, et chaque entrée de ce graphe est une chose susceptible de publier une rupture de compatibilité ou une alerte de sécurité. C’est la différence la plus nette entre les générateurs fondés sur Node et les générateurs compilés.

**Un build qui casse un an plus tard.** Sans que vous y soyez pour rien. Une dépendance transitive abandonne la version de votre environnement d’exécution, un thème épingle une dépendance de pair qui ne se résout plus, l’image d’intégration continue avance d’une version majeure. Le site n’a pas bougé et il ne se construit plus.

**Un thème que vous entretenez désormais.** Le thème d’un générateur est soit celui que vous avez écrit, auquel cas vous êtes responsable pour toujours de son accessibilité, de son mode sombre et de sa mise en page mobile, soit celui qu’un autre a écrit, auquel cas c’est la mise à jour qui vous revient à chaque changement. C’est dans les thèmes que loge l’essentiel de la maintenance réelle d’un générateur.

**Une configuration qu’il faut apprendre.** Un langage de gabarits — gabarits Go, Jinja, Nunjucks, JSX, Handlebars — plus les conventions de front matter et les règles de répertoires propres au générateur. Rien de tout cela ne se transfère au générateur suivant.

**Il faut que quelqu’un s’y connaisse.** Voilà le coût que personne ne chiffre. Un générateur n’est bon marché que tant que la personne qui l’a installé est encore là et s’en souvient encore. Le jour où il devient « le site de doc que personne ne comprend », le moindre changement trivial se transforme en petit projet de recherche, et les petits projets de recherche ne se font pas.

## Le nombre de documents est le mauvais axe

Le réflexe est de décider au volume : un fichier, un convertisseur ; cinquante fichiers, un générateur. C’est le mauvais critère, et il produit les deux échecs à la fois. Quelqu’un avec cinquante comptes rendus de réunion sans rapport entre eux installe Docusaurus et entretient désormais React pour publier du texte. Quelqu’un avec trois pages interdépendantes qui doivent être à jour après chaque merge les convertit à la main, et elles sont périmées en quinze jours.

Trois questions décident réellement, et toutes les trois portent sur des relations et un processus plutôt que sur un comptage.

| La question | Si oui | Si non |
| --- | --- | --- |
| Les pages doivent-elles se connaître les unes les autres ? | Il vous faut une navigation commune, des liens croisés vérifiés, un index de recherche, des listes de tags — les choses que seul un build sur l’ensemble peut calculer. C’est un générateur, ou une plateforme qui en est un. | Chaque page tient seule. Un convertisseur par document n’est pas un compromis ; c’est la forme correcte, et il n’y a rien à maintenir en vie entre deux publications. |
| Faut-il republier selon un calendrier ou à chaque modification ? | Quelque chose doit s’exécuter sans surveillance. Cela veut dire une commande, dans l’intégration continue, avec des versions épinglées — un générateur, ou un convertisseur plus un script, mais automatisé dans les deux cas. | Une personne qui publie quand elle y pense suffit, et une personne ne peut pas lancer un build de façon fiable. La conversion manuelle est honnête ; une étape de build manuelle est un mensonge que l’on se fait à soi-même. |
| Qui doit l’exécuter ? | Si la réponse inclut quiconque n’utilise pas de terminal, le build doit se trouver derrière un bouton — un travail d’intégration continue au merge, ou une plateforme hébergée. Une étape de build locale exclut ces personnes définitivement. | Si les seuls à publier sont ceux qui ont écrit la chaîne d’outils, un build local convient et le coût de maintenance reste chez ceux qui l’ont choisi. |

La première question porte sur la structure de la sortie. La deuxième, sur la présence ou non d’un humain dans la boucle. La troisième, sur qui se retrouve bloqué quand la chaîne d’outils déraille, et c’est celle qui change le plus souvent la réponse.

Deux oui sur trois, et installez le générateur. Trois non, et vous cherchez un convertisseur et un lien. Un seul oui signifie en général l’option intermédiaire : un convertisseur piloté par un script, autrement dit une étape de build sans système de build.

## Les options honnêtes, côte à côte

Chaque ligne de ce tableau est une vraie réponse pour quelqu’un. Les générateurs sont indiqués avec le langage dans lequel ils sont écrits, parce que c’est l’environnement d’exécution que vous acceptez d’installer, et avec leur licence, parce que c’est une donnée stable et vérifiable, ce qu’une liste de fonctionnalités n’est pas.

| Option | Ce qu’elle produit | Ce qu’elle réclame | Qui l’exécute | Convient à | Coût |
| --- | --- | --- | --- | --- | --- |
| Un convertisseur, un fichier à la fois | Un fichier HTML autonome, ou un lien | Un navigateur | L’auteur, à la demande | Un document avec un destinataire ; un rapport ; la sortie d’un modèle ; tout ce que vous auriez sinon envoyé en `.md` par courriel | Gratuit |
| Un convertisseur plus un script en intégration continue | Un répertoire de fichiers HTML, ou un document fusionné | Une commande ou une API, un fichier de workflow | Le runner d’intégration continue, au push | Une poignée de pages dans un dépôt qui doivent rester à jour, sans besoin de gabarits | Gratuit ; minutes d’intégration continue |
| MkDocs | Un site de documentation avec navigation et recherche | Python | L’auteur en local, ou l’intégration continue | La documentation d’un projet écrite en Markdown par des développeurs | Gratuit, BSD-2-Clause (vérifié sur github.com, le 9 septembre 2026) |
| Docusaurus | Un site de documentation React avec versions et internationalisation | Node, et des connaissances React pour tout ce qui sort du cadre | L’intégration continue, en pratique | Une documentation produit versionnée, avec une équipe front derrière | Gratuit, MIT (vérifié sur github.com, le 9 septembre 2026) |
| Hugo | Depuis de la documentation jusqu’à un grand site de contenu | Un unique binaire téléchargé ; Git, Go ou Dart Sass pour certaines fonctions | N’importe qui disposant du binaire | Les grands sites de contenu ; les équipes qui ne veulent aucun gestionnaire de paquets | Gratuit, Apache-2.0 (vérifié sur github.com, le 9 septembre 2026) |
| Eleventy | Ce que vous voulez bien mettre en gabarit, sans structure imposée | Node | L’auteur ou l’intégration continue | Ceux qui veulent un build avec le moins de partis pris possible | Gratuit, MIT (vérifié sur github.com, le 9 septembre 2026) |
| mdBook | Un livre linéaire avec table des matières et recherche | Un unique binaire téléchargé | N’importe qui disposant du binaire | Manuels, guides, tout ce qui se lit du début à la fin | Gratuit, MPL-2.0 (vérifié sur github.com, le 9 septembre 2026) |
| Sphinx | De la documentation de référence avec renvois et extraction d’API | Python ; MyST-Parser pour écrire en Markdown | L’intégration continue, en général | Les projets Python ; tout ce qui réclame de vrais renvois et de l’autodoc | Gratuit, BSD-2-Clause (vérifié sur github.com, le 9 septembre 2026) |
| Une plateforme de documentation | Un site de documentation hébergé, construit pour vous | Un compte, et votre dépôt connecté | La plateforme | Les équipes qui veulent que le build soit le problème de quelqu’un d’autre | Read the Docs Community est « gratuit, pour toujours » pour l’open source ; les offres commerciales sont à 50 $ pour Basic, 150 $ pour Advanced et 250 $ pour Pro par mois, Enterprise à partir de 10 000 $ par an (vérifié sur about.readthedocs.com, le 9 septembre 2026) |
| Le rendu du dépôt lui-même | Du Markdown rendu à l’adresse du dépôt | Rien | Personne | La documentation interne lue par ceux qui ont déjà accès au dépôt | Gratuit |

La dernière ligne est l’option que l’on oublie, et pour de la documentation technique interne elle est souvent la bonne. GitHub et GitLab affichent tous deux les documents Markdown conservés dans un dépôt, tableaux et listes de tâches compris, à l’adresse du fichier lui-même (vérifié sur docs.github.com et docs.gitlab.com, le 9 septembre 2026). Il n’y a ni build, ni thème, ni déploiement. Ce que vous perdez, c’est une arborescence de navigation, un champ de recherche limité à votre documentation plutôt qu’au dépôt entier, et toute maîtrise de la présentation — et pour un répertoire `docs/` lu uniquement par ceux qui y commitent, perdre cela peut ne rien coûter du tout. [Une documentation qui vit dans le dépôt](/blog/documentation-that-lives-in-the-repo) relève davantage de la discipline que de l’outillage, et c’est la discipline qui compte.

## Cas numéro un : un document qui doit atteindre une personne

C’est de loin le cas le plus fréquent, et celui que l’on suroutille le plus souvent. Vous avez écrit quelque chose — une proposition, une note de passation, un rapport, un résumé produit par un assistant — et une personne ou un petit groupe doit le lire. C’est fini. Cela ne sera pas mis à jour. Personne ne naviguera de là vers une autre page.

Un générateur est de la mauvaise forme sur tous les axes. Il veut un site ; vous avez un document. Sa sortie est un répertoire de fichiers reliés par des liens relatifs, ce qui veut dire que vous ne pouvez pas l’envoyer par courriel : il faut l’héberger, donc disposer d’une cible de déploiement, donc d’un domaine ou d’un sous-chemin, donc que quelqu’un se souvienne que cela existe.

Ce dont ce cas a réellement besoin, c’est d’un fichier unique qui s’affiche correctement partout où il atterrit. Cela veut dire un document HTML complet plutôt qu’un fragment, avec ses styles à l’intérieur et aucune requête vers un CDN, pour qu’il ait la même allure sur un portable en avion que sur le vôtre. [Ce qui rend un fichier HTML autonome](/blog/self-contained-html-explained) est une propriété technique étroite, et c’est toute la différence entre un fichier qui survit à une transmission et un fichier qui n’y survit pas.

| Ce dont vous avez besoin | Convertisseur | Générateur |
| --- | --- | --- |
| L’envoyer en pièce jointe | Un fichier, s’ouvre d’un double-clic | Un répertoire de fichiers à liens relatifs ; impossible à joindre utilement |
| L’envoyer sous forme de lien | Un lien publié, révocable | Un déploiement, un schéma d’URL et un hébergement à maintenir en vie |
| Aucune installation pour l’expéditeur | S’exécute dans un onglet de navigateur | Un environnement d’exécution et une installation de paquets |
| Aucune installation pour le lecteur | Un navigateur | Un navigateur |
| Le mettre à jour le mois prochain | Reconvertir | Reconstruire et redéployer |
| Garder la source privée | Déconnecté, la conversion côté navigateur n’envoie rien | La source vit en général dans un dépôt |

**Pour qui ?** Pour quiconque dont l’action suivante est « envoyer ceci à quelqu’un ». Si le document a un destinataire plutôt qu’un public, ce qu’il vous faut est un fichier ou un lien, pas un site. [Les façons de partager un document Markdown sous forme de lien](/blog/share-a-markdown-document-as-a-link) détaillent ce que chaque méthode exige du lecteur, et c’est cela qui décide s’il le lit vraiment.

Un seul point mérite de la prudence : convertir un document écrit par quelqu’un d’autre, ou par un modèle, c’est convertir un texte susceptible de contenir du HTML brut, puisque Markdown l’autorise. Un convertisseur qui assainit contre une liste d’éléments autorisés s’en charge. Un générateur, lui, n’assainit généralement rien du tout, en partant de l’hypothèse raisonnable que vous avez écrit le contenu de votre propre site.

## Cas numéro deux : une poignée de documents dans un dépôt

Il y a maintenant huit fichiers dans `docs/`, ils changent avec le code, et quelqu’un d’extérieur au dépôt doit pouvoir les lire. C’est le cas intermédiaire, et c’est là que la décision est réellement serrée.

Posez la première question ci-dessus. Ces huit pages doivent-elles se connaître les unes les autres ? S’il s’agit de huit références indépendantes — un guide d’installation, une procédure d’exploitation, une note d’API, un journal de décision — alors non. Chacune se lit seule, atteinte par un lien que quelqu’un a collé. Si elles forment une séquence, ou partagent une barre latérale, ou si l’une d’elles est une page d’accueil qui liste les autres, alors oui, et vous avez un petit site.

Pour le cas indépendant, l’outil honnête est un convertisseur avec un script devant lui. Un workflow déclenché au push convertit les fichiers modifiés et les publie, et tout l’appareillage tient dans une boucle shell et un appel de commande ou d’API. Il n’y a ni langage de gabarits, ni thème, ni fichier de verrouillage au-delà de ce que votre intégration continue possède déjà. [Convertir un répertoire de fichiers Markdown en une seule passe](/blog/batch-convert-markdown-files) en est la partie mécanique ; le brancher sur un déclencheur est tout le reste.

| Approche | Étape de build | Ce qui casse | Réparation quand cela casse |
| --- | --- | --- | --- |
| Convertir à la main quand on y pense | Aucune | Rien ; la documentation se périme, voilà tout | Y repenser |
| Convertisseur plus script d’intégration continue | Une boucle et un appel de commande | Une option de commande change, ou la version de Node du runner bouge | Lire l’aide d’une commande |
| Un générateur en intégration continue | Tout le build du générateur | Un thème, un greffon, une dépendance de pair, l’environnement d’exécution | Bissecter un arbre de dépendances que vous n’avez pas choisi |
| Une plateforme de documentation | La leur | Leur build, à leur calendrier | Ouvrir un ticket de support |

L’échange est simple. Un script vous donne moins de capacités et beaucoup moins de modes de défaillance, et ceux qu’il a sont lisibles : une commande, une option, un code de sortie. Un générateur vous donne la navigation et la recherche, et un build qu’il faut comprendre pour le réparer.

**Pour qui ?** Pour les dépôts où la documentation est un matériau de référence plutôt qu’un produit. Si publier au merge est le vrai besoin — et c’est généralement le cas, parce qu’une documentation publiée à la main est une documentation périmée — alors [publier du Markdown depuis un workflow GitHub Actions](/blog/publish-markdown-from-github-actions) représente la même quantité de travail quel que soit l’outil placé dans le job. Choisissez l’outil d’après ce que vous devrez réparer, pas d’après l’allure du job le jour où vous l’écrivez.

Une chose qu’un script ne peut pas faire, et qu’il vaut mieux savoir avant de s’engager : il ne peut pas vous dire qu’un lien de la page trois vers la page sept est cassé. Rien ne parcourt l’ensemble. Si vos huit pages se lient abondamment entre elles, cette vérification manquante vous coûtera plus cher que l’arbre de dépendances du générateur.

## Cas numéro trois : un vrai site de documentation

Ici le générateur est la bonne réponse et la seule question est lequel. Les signes sont sans ambiguïté : des dizaines de pages, une arborescence de navigation dont les gens se servent pour trouver, un champ de recherche, des contributeurs qui ne sont pas celui qui a tout installé, et sans doute des versions.

Choisissez sur deux critères, dans cet ordre. D’abord, quel environnement d’exécution votre équipe entretient déjà — parce que le générateur qui partage un environnement avec votre projet ne coûte rien de plus en intégration continue, tandis que l’autre vous coûte une deuxième chaîne d’outils pour toujours. Ensuite, la forme de la sortie : documentation de référence, livre linéaire, site produit versionné, ou site de contenu généraliste. Les thèmes et l’apparence viennent en troisième, et c’est la partie que vous changerez de toute façon.

### MkDocs

MkDocs est un générateur de site statique pour la documentation de projet, écrit en Python et publié sous licence BSD-2-Clause (vérifié sur github.com, le 9 septembre 2026). Ses sources sont des fichiers Markdown configurés par un unique fichier YAML, il les traduit avec la bibliothèque Python Markdown, et son serveur de développement recharge le navigateur à chaque enregistrement (vérifié sur mkdocs.org, le 9 septembre 2026). Ce détail central règle la question des extensions avant que vous ne la posiez : ce qu’une page peut contenir, c’est ce que les extensions de Python Markdown savent exprimer, activé par `markdown_extensions`.

| Avantages | Inconvénients |
| --- | --- |
| Un seul fichier de configuration, une petite surface à apprendre | Une navigation dans un ordre voulu suppose d’écrire la liste `nav` à la main ; omettez-la et vous obtenez les fichiers triés alphanumériquement (vérifié sur mkdocs.org, le 9 septembre 2026) |
| Python, que beaucoup d’équipes ont déjà en intégration continue | Les extensions par défaut sont `meta`, `toc`, `tables` et `fenced_code` ; tout le reste est à activer, puis à ne pas oublier (vérifié sur mkdocs.org, le 9 septembre 2026) |
| Material for MkDocs est un thème mûr, sous licence MIT (vérifié sur github.com, le 9 septembre 2026) | L’essentiel de ce que les gens veulent vient du thème, donc vous héritez de son cycle de mises à jour |
| Serveur à rechargement à chaud pour écrire en local | Pas conçu pour autre chose que de la documentation |

**Pour qui ?** Pour la documentation technique d’un projet qui utilise déjà Python, écrite par des gens qui veulent rédiger du Markdown et modifier un fichier YAML.

### Docusaurus

Docusaurus construit des sites de documentation, est sous licence MIT et repose sur JavaScript et React (vérifié sur github.com, le 9 septembre 2026). Sa propre documentation mentionne parmi ses fonctions le versionnement des documents, l’internationalisation sur plusieurs locales, et MDX — des composants interactifs écrits en JSX et React à l’intérieur du Markdown (vérifié sur docusaurus.io, le 9 septembre 2026). Voilà l’argument pour et l’argument contre en une seule phrase : c’est l’option qui en fait le plus, sur le plus gros environnement d’exécution.

| Avantages | Inconvénients |
| --- | --- |
| Versionnement et internationalisation intégrés, pas ajoutés après coup | React et Node deviennent des dépendances de votre documentation |
| MDX, donc des pages qui peuvent embarquer des composants vivants | Tout arrive par npm, donc le graphe que vous corrigez est celui d’un framework front, pas d’un générateur |
| Intégrations de recherche et API de greffons | Personnaliser quoi que ce soit veut dire écrire du React |
| Bien éprouvé : beaucoup de gros projets l’utilisent | Les montées de version majeure sont de vrais chantiers |

**Pour qui ?** Pour un produit avec plusieurs versions maintenues, plus d’une langue, ou des exemples interactifs dans la documentation — et une équipe front que la mise à jour de React ne surprendra pas.

### Hugo

Hugo est un générateur de site statique écrit en Go, publié sous Apache-2.0 (vérifié sur github.com, le 9 septembre 2026), et distribué sous forme de binaire téléchargeable plutôt que d’arbre de paquets. C’est l’option dont la surface de dépendances permanente est la plus petite, et dont le langage de gabarits est le plus raide.

| Avantages | Inconvénients |
| --- | --- |
| Un binaire que l’on télécharge ; aucun gestionnaire de paquets dans la boucle | Les gabarits sont ceux de Go, `text/template` et `html/template` (vérifié sur gohugo.io, le 9 septembre 2026), la syntaxe la moins indulgente de cette page |
| Assez rapide pour que le temps de build cesse d’être un sujet | Sa documentation suppose que vous connaissez déjà son vocabulaire |
| Gère des sites de contenu, pas seulement de la documentation : taxonomies, sections, flux | Quatre éditions parmi lesquelles choisir, et le choix compte |
| Les thèmes s’installent comme sous-module Git, comme le fait le guide de démarrage (vérifié sur gohugo.io, le 9 septembre 2026), ou comme modules Hugo | Les conventions varient beaucoup d’un thème à l’autre |

Les éditions de Hugo méritent d’être connues avant l’installation : le projet documente des builds standard, deploy, extended et extended/deploy, où deploy ajoute le déploiement direct vers Google Cloud Storage, AWS S3 ou Azure Storage, et extended ajoute la transpilation LibSass pour Sass. La même page note que Git, Go et Dart Sass sont couramment utilisés aux côtés de Hugo — Git pour les modules et les sous-modules de thème, Go pour compiler depuis les sources ou utiliser les modules, Dart Sass pour les fonctions récentes de Sass — et que le LibSass embarqué est déprécié et « sera supprimé dans une prochaine version » (vérifié sur gohugo.io, le 9 septembre 2026). L’histoire du binaire unique est donc vraie, et dès l’instant où vous voulez du Sass à jour ou des modules de thème, elle se découvre des voisins.

**Pour qui ?** Pour les équipes qui ne veulent aucun gestionnaire de paquets dans l’affaire, pour des sites plus larges qu’une documentation, et pour quiconque préfère apprendre un langage de gabarits plutôt qu’entretenir un arbre de dépendances.

### Eleventy

Eleventy est un générateur de site statique pour Node, sous licence MIT, décrit par son propre dépôt comme transformant un répertoire de gabarits en HTML (vérifié sur github.com, le 9 septembre 2026). Sa propriété distinctive est qu’il impose très peu : aucune disposition de répertoires obligatoire, aucun thème fourni, et un choix de langages de gabarits.

| Avantages | Inconvénients |
| --- | --- |
| Presque aucune convention imposée ; vous construisez le site que vous voulez | Vous construisez le site que vous voulez, ce qui veut dire que vous le construisez |
| Beaucoup de langages de gabarits — Nunjucks, Liquid, Handlebars, JavaScript, WebC et d’autres — mélangeables dans un même projet (vérifié sur 11ty.dev, le 9 septembre 2026) | Aucun thème par défaut, donc la présentation part de rien |
| Une empreinte de dépendances modeste, à l’aune du JavaScript | Navigation, recherche et versionnement sont des greffons ou votre propre code |
| Une configuration en JavaScript ordinaire plutôt qu’un framework | Moins de configurations documentaires toutes prêtes que MkDocs ou Docusaurus |

**Pour qui ?** Pour ceux qui ont regardé le thème d’un générateur de documentation en ayant envie d’en supprimer la majeure partie — et qui ont le temps de la remplacer.

### mdBook

mdBook fabrique un livre à partir de fichiers Markdown, est écrit en Rust et publié sous MPL-2.0 (vérifié sur github.com, le 9 septembre 2026). Il fait une seule chose et la fait bien : un document linéaire avec table des matières, navigation par chapitres et recherche. Un unique `SUMMARY.md` lui indique quels chapitres inclure, dans quel ordre, dans quelle hiérarchie et où se trouvent les fichiers source, et le livre construit répond à `S` ou `/` par un champ de recherche (vérifié sur rust-lang.github.io, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Un binaire, comme Hugo ; aucun environnement d’exécution à installer | Des livres, pas des sites : ni taxonomies, ni flux, ni pages de listes |
| Un seul `SUMMARY.md` définit toute la structure | Les thèmes sont limités par conception |
| Recherche incluse sans configuration | Pas l’outil pour une documentation de référence dans laquelle on saute de page en page |
| Très peu de choses à apprendre ou à entretenir | Un écosystème plus petit que les autres |

**Pour qui ?** Pour les manuels, les tutoriels, les guides internes et tout ce qui se compose de chapitres lus dans l’ordre.

### Sphinx

Sphinx est un générateur de documentation écrit en Python et publié sous licence BSD 2-Clause, dont le balisage par défaut est reStructuredText (vérifié sur github.com, le 9 septembre 2026). La prise en charge de Markdown vient de MyST-Parser, un analyseur conforme à CommonMark sous licence MIT qui fait le pont vers Sphinx (vérifié sur github.com, le 9 septembre 2026). Son propre site décrit la génération de documentation d’API à partir des docstrings pour Python, C++ et d’autres domaines ; des renvois vers des sections, figures, tableaux, citations, glossaires et objets de code, y compris entre projets distincts ; et des sorties en HTML, LaTeX pour le PDF, ePub et Texinfo (vérifié sur sphinx-doc.org, le 9 septembre 2026). Ces trois capacités sont la raison pour laquelle il survit à son propre poids conceptuel.

| Avantages | Inconvénients |
| --- | --- |
| De vrais renvois : pointer vers une fonction, un terme ou une page, et que ce soit vérifié | reStructuredText par défaut, donc Markdown est un ajout délibéré |
| Documentation d’API extraite des sources | Le modèle conceptuel le plus lourd d’ici : directives, rôles, domaines |
| Plusieurs formats de sortie depuis une seule source, PDF compris | La configuration est en Python, et elle grossit |
| Bien établi dans les projets scientifiques et Python | Démesuré pour un site de documentation sans surface d’API |

**Pour qui ?** Pour les projets dont la documentation doit référencer le code avec précision — bibliothèques, logiciels scientifiques, tout ce où « renvoyer vers la doc de cette fonction » est un besoin quotidien.

### Une plateforme de documentation

La quatrième catégorie n’est pas du tout un générateur : vous connectez un dépôt et quelque chose d’autre construit et héberge le site. Read the Docs en est l’exemple de longue date pour les projets Sphinx et MkDocs, et il indique que Read the Docs Community est « gratuit, pour toujours » pour l’open source, avec des offres commerciales à 50 $ pour Basic, 150 $ pour Advanced et 250 $ pour Pro par mois, et Enterprise à partir de 10 000 $ par an (vérifié sur about.readthedocs.com, le 9 septembre 2026). Il construit aussi votre documentation pour chaque nouvelle pull request, ce qui veut dire qu’une modification peut être lue sur place avant d’être intégrée plutôt qu’après (vérifié sur docs.readthedocs.com, le 9 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Quelqu’un d’autre est responsable de l’environnement de build et de ses mises à jour | Vous êtes responsable de la configuration mais pas de l’environnement où elle s’exécute |
| Aperçus de pull request et builds versionnés sans fichier de workflow | Déboguer un build en échec veut dire lire leurs journaux, pas les vôtres |
| Une URL et un hébergement que vous n’entretenez pas | Une tarification commerciale pour les dépôts privés |
| Des non-techniciens peuvent recevoir un accès sans terminal | Partir ailleurs suppose de reconstruire la chaîne que vous aviez évitée |

**Pour qui ?** Pour les équipes ayant conclu que le générateur est nécessaire et que l’infrastructure de build n’a rien d’intéressant. C’est une conclusion raisonnable, et c’est la seule option de cette page où le coût de maintenance de la deuxième année est un problème de personnel chez quelqu’un d’autre.

## La deuxième année, où le coût habite réellement

Toutes les pages de démarrage mesurent le coût d’un générateur en minutes. Ce chiffre est honnête et sans intérêt. L’installation n’est pas le coût ; l’installation est la chose la moins chère qui arrivera jamais à ce site.

Voici la forme du coût réel. Au premier mois, quelqu’un installe le générateur, choisit un thème et obtient un joli site publié au merge. Cela marche. Personne n’y pense pendant dix mois, ce qui est exactement ce qu’une étape de build est censée vous rapporter. Au onzième mois, l’une de ces quatre choses arrive.

L’image d’intégration continue met à jour son environnement d’exécution par défaut, et une dépendance native quelque part dans l’arbre du thème n’a plus de binaire précompilé pour la nouvelle version : le build échoue en compilant quelque chose dont personne ne soupçonnait l’existence. Ou une alerte de sécurité tombe sur une dépendance transitive, la montée automatique ouvre une pull request, et la plage de dépendances de pair du thème refuse la nouvelle version majeure — vous pouvez alors soit laisser l’alerte ouverte, soit mettre le thème à jour, ce qui change la mise en page du site. Ou le thème n’est simplement plus maintenu, et le fork vers lequel tout le monde a migré a d’autres clés de configuration. Ou rien de tout cela n’arrive, et à la place quelqu’un doit ajouter une page, découvre que la navigation est déclarée dans un fichier YAML avec une convention d’ordre qu’il ne peut pas deviner, et pose la question dans un canal où la seule personne qui savait est partie.

Ce dernier cas est le plus fréquent et le moins discuté. La vraie dépendance d’une chaîne d’outils est une personne. Le générateur va très bien ; c’est le savoir qui s’est évaporé. Et l’échec n’a rien de spectaculaire : il ressemble à une documentation qui cesse d’être mise à jour, parce que le coût de la mise à jour est passé de « modifier un fichier » à « comprendre comment cela se construit ».

Les générateurs compilés sont nettement meilleurs sur ce point. Hugo et mdBook sont des binaires : épinglez la version, consignez le numéro, et le build qui marchait l’an dernier marche cette année, parce que rien n’est résolu au moment du build. Les options fondées sur Node sont à l’autre extrémité — le plus de capacités, le plus de pièces mobiles, et un fichier de verrouillage qui décrit des centaines de choses susceptibles de bouger sous vos pieds.

### Et le contrepoids, qui est réel

Rien de tout cela ne veut dire « toujours un convertisseur ». Dépasser les capacités d’un convertisseur donne une migration sincèrement pénible, et prétendre le contraire serait malhonnête.

Voici à quoi cela ressemble : vous avez trente pages publiées par un script. Quelqu’un veut maintenant une barre latérale. Alors vous en écrivez une, à la main, dans chaque fichier — ou vous écrivez une petite étape de gabarit, puis une étape de génération de navigation, puis un vérificateur de liens, parce que les pages ont commencé à se référencer entre elles. Six mois de cela et vous avez construit un mauvais générateur de site statique, sans documentation et avec un seul mainteneur. C’est pire que d’avoir adopté MkDocs dès le premier jour, considérablement pire, et c’est une façon courante d’arriver au désordre.

La migration elle-même coûte : les URL changent si vous n’y prenez pas garde, ce qui suppose des redirections ; le front matter doit être remodelé dans ce que le générateur attend ; tout ce que votre script faisait de façon ad hoc doit être réexprimé dans un langage de gabarits. C’est une semaine de travail, pas une journée.

La règle honnête est donc asymétrique. Commencer par un convertisseur et passer plus tard à un générateur vous coûte une migration bornée, une fois, si le besoin grandit vraiment. Commencer par un générateur dont vous n’aviez pas besoin vous coûte de la maintenance chaque année, que le besoin grandisse ou non. Le premier risque est une quantité connue ; le second est un abonnement. Mais dès l’instant où vous vous surprenez à écrire de la logique de gabarits autour d’un convertisseur, arrêtez et installez un générateur — c’est le signal, et il est sans équivoque quand il arrive.

## Six questions à vous poser sur votre propre situation

Répondez-y au sujet des documents que vous avez réellement, pas de ceux que vous pourriez avoir l’an prochain.

1. **Une page a-t-elle besoin d’un lien vers une autre page qui ne doit pas casser en silence ?** Si oui, il vous faut quelque chose qui parcoure l’ensemble et échoue quand un lien pourrit, donc un générateur ou une plateforme — un convertisseur fichier par fichier ne voit pas les autres fichiers, et la pourriture reste invisible jusqu’à ce qu’un lecteur tombe dessus.
2. **Quelqu’un doit-il pouvoir chercher dans la totalité ?** La recherche du navigateur fouille un document. Un champ de recherche réclame un index construit sur chaque page à la compilation, et rien de ce qui convertit les fichiers un par un ne peut en produire un : cette seule réponse peut donc trancher.
3. **Faut-il republier sans qu’une personne le décide ?** Si la documentation doit être à jour après chaque merge, l’étape de publication doit s’exécuter sans surveillance, et la seule question restante est de savoir si cette chose sans surveillance est un générateur ou un script de trois lignes — mais la publication manuelle n’est pas une option que vous pouvez choisir, parce qu’elle dégénère en absence de publication.
4. **Quelle est la personne la moins technique qui devra publier une modification ?** Si cette personne n’utilise pas de terminal, toute étape de build locale l’exclut définitivement, et le site accumulera une file de corrections en attente de quelqu’un d’autre — donc le build a sa place dans l’intégration continue ou sur une plateforme, au choix.
5. **Quel environnement d’exécution votre équipe maintient-elle déjà en intégration continue ?** Choisir un générateur sur un environnement que vous n’entretenez pas par ailleurs double le nombre de chaînes d’outils à corriger, et la seconde est toujours corrigée en retard — c’est ainsi qu’un build de documentation finit par être la chose la plus ancienne de votre pipeline.
6. **Si la personne qui installe cela part dans six mois, quelqu’un d’autre saura-t-il ajouter une page ?** Notez honnêtement la réponse. Si c’est non, choisissez l’option avec le moins de configuration plutôt que celle avec le plus de capacités — un site un peu moins bon que tout le monde peut modifier vaut mieux qu’un meilleur site que personne n’ose toucher.

Comptez les points. Deux oui ou plus aux questions un à trois signifient un générateur, et les questions quatre et cinq disent lequel. Si les questions un à trois sont toutes non, vous avez un problème en forme de document, et l’outil pour un problème en forme de document est un convertisseur.

## Conclusion

Un générateur de site statique est la bonne réponse quand les pages doivent se connaître les unes les autres et que le build doit tourner sans vous. C’est la mauvaise réponse pour un document qui a un destinataire, pour un ensemble de notes sans rapport entre elles, et pour toute situation où personne dans l’équipe ne comprendra encore le build dans un an. Le terrain intermédiaire existe et reste sous-employé : un convertisseur avec un script devant lui publie un répertoire de pages à chaque push, sans thème, sans fichier de verrouillage et avec une seule commande à déboguer. Si ce que vous avez est un document unique qui doit atteindre quelqu’un et être présentable à l’arrivée, [convertir du Markdown en fichier HTML autonome](/) ne demande qu’un navigateur et aucune installation, et il ne reste rien à entretenir ensuite. Installez le générateur le jour où la deuxième question que vous vous posez sur vos documents est « comment les relier entre eux ? » — et pas avant.

## FAQ

### Ai-je besoin d’un générateur de site statique pour publier un seul fichier Markdown ?

Non. Un générateur produit un répertoire de fichiers reliés entre eux, ce qui est exactement la mauvaise sortie pour un document unique : vous ne pouvez pas le joindre à un courriel, et l’héberger suppose de maintenir une cible de déploiement en vie. Convertissez-le en fichier HTML autonome, ou publiez-le sous forme de lien, et c’est terminé.

### Un générateur de site statique est-il excessif pour un dossier `docs/` dans mon dépôt ?

Cela dépend entièrement de savoir si les pages se référencent entre elles. Huit pages de référence indépendantes se convertissent très bien une par une, ou se lisent même en Markdown rendu à l’adresse de leur dépôt. Huit pages avec une barre latérale commune et des liens croisés forment un petit site, et un générateur vérifiera les liens que vous casseriez sinon.

### Quel générateur de site statique demande le moins de maintenance ?

Ceux qui sont distribués sous forme de binaire unique, parce que rien n’est résolu au moment du build. Hugo (Apache-2.0) et mdBook (MPL-2.0) s’installent tous deux comme un binaire téléchargé, donc épingler une version veut dire que le build qui marchait l’an dernier marche encore. Les générateurs fondés sur Node offrent plus de capacités et une bien plus grande surface de dépendances à maintenir à jour.

### Puis-je utiliser un générateur de site statique sans connaître JavaScript ?

Oui. MkDocs et Sphinx sont en Python, Hugo est un binaire Go, mdBook un binaire Rust — aucun ne vous oblige à écrire du JavaScript. Docusaurus est l’exception : le personnaliser au-delà de la configuration suppose d’écrire du React, et c’est une bonne raison de choisir autre chose.

### Et si je commence par un convertisseur et que je le dépasse ?

Vous migrez, et cela coûte environ une semaine : remodeler le front matter, réexprimer le comportement de votre script dans un langage de gabarits, et ajouter des redirections pour que les anciennes URL continuent de fonctionner. C’est un coût borné, payé une fois, ce qui se compare avantageusement à l’entretien d’un build dont vous n’aviez jamais eu besoin. Le signal de migrer, c’est le jour où vous commencez à écrire de la logique de gabarits autour du convertisseur.

### Puis-je obtenir une recherche sur l’ensemble de mes documents sans générateur ?

Pas de manière satisfaisante. La recherche réclame un index construit sur tout l’ensemble, ce qui est par définition un travail de build. Si un champ de recherche fait partie du cahier des charges, c’est l’une des raisons les plus fortes de la liste pour prendre un générateur ou une plateforme de documentation hébergée.

### Publier du Markdown sur GitHub ou GitLab suffit-il ?

Pour de la documentation technique interne, souvent oui. Tous deux affichent les documents Markdown conservés dans un dépôt — tableaux et listes de tâches compris — à l’adresse du fichier lui-même, sans build, sans thème et sans déploiement (vérifié sur docs.github.com et docs.gitlab.com, le 9 septembre 2026). Ce que vous abandonnez, c’est la navigation, une recherche limitée à votre documentation et la maîtrise de la présentation — ce qui peut ne rien coûter du tout si les seuls lecteurs sont ceux qui commitent déjà dans le dépôt.
