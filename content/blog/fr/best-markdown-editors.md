---
title: "Le meilleur éditeur Markdown en 2026 : onze comparés sur ce qu'ils font de vos fichiers"
description: "Onze éditeurs Markdown comparés en 2026 — VS Code, Obsidian, Typora, iA Writer, Zettlr, Notion, Vim — jugés sur où va votre texte et ce qui en sort."
date: 2026-09-07
tag: Workflow
keywords: meilleur éditeur markdown, éditeur markdown gratuit, éditeur markdown aperçu en direct, éditeur markdown export html, obsidian ou typora, export markdown notion, éditeur markdown windows, meilleur éditeur markdown mac
---

La plupart des comparatifs d’éditeurs Markdown comparent la frappe. Lequel a la plus belle police, lequel atténue le paragraphe sur lequel vous ne travaillez pas, lequel masque les astérisques. C’est ce que vous remarquez le premier jour, et c’est ce qui compte le moins au sixième mois.

Ce qui compte plus tard est nettement moins séduisant. Où l’éditeur range-t-il votre texte — dans des fichiers que vous voyez dans un gestionnaire de fichiers, ou dans un service auquel il faut réclamer une copie ? Quelle syntaxe ajoute-t-il qu’aucun autre outil ne comprend ? Et que produit-il le jour où quelqu’un demande « tu peux me l’envoyer sous forme de page web ? », la demande qui met au jour tous les raccourcis pris par l’éditeur pendant que vous admiriez la typographie.

Onze éditeurs sont comparés ci-dessous, sur ces critères-là. Certains sont des éditeurs de texte avec une prise en charge de Markdown, d’autres des applications d’écriture, et l’un d’eux n’est pas du tout un éditeur Markdown : il figure dans la liste parce que la moitié des personnes qui lisent ces lignes s’en servent comme tel.

### En bref

Si VS Code est déjà ouvert devant vous, c’est le meilleur éditeur Markdown que vous trouverez sans rien installer, parce que vos fichiers restent des fichiers et que git les connaît déjà. Si vous voulez une application d’écriture confortable posée sur un dossier de simples fichiers `.md`, Typora et iA Writer sont les deux qui valent un achat. Typora coûte 14,99 $ hors taxes, une fois, pour trois appareils au maximum, avec un essai de quinze jours (vérifié sur typora.io, le 8 septembre 2026). iA Writer se paie une fois par plateforme, avec un essai de sept jours et sans carte bancaire (vérifié sur ia.net/writer, le 8 septembre 2026). Obsidian est l’option gratuite dotée du plus vaste écosystème d’extensions. Et si vos documents vivent dans Notion, vous n’avez pas un éditeur Markdown : vous avez une base de données munie de raccourcis clavier d’allure markdownienne, et en sortir un document relève de la conversion, pas de l’enregistrement.

## Les trois questions qui séparent les éditeurs Markdown

**Édite-t-il des fichiers ou des documents ?** C’est la ligne de fracture, et toutes les autres différences en découlent. Un éditeur qui édite des fichiers ouvre un dossier, vous montre les documents `.md` qu’il contient, écrit vos frappes dedans et les laisse là où une sauvegarde, un commit git ou un autre programme peut les retrouver. Une application qui édite des documents les garde dans son propre magasin — une base de données, le stockage local d’un navigateur, un espace de travail synchronisé — et vous donne un bouton d’export à la place. Les deux peuvent donner exactement la même sensation pendant que vous tapez. Elles cessent de se ressembler le jour où vous voulez votre texte ailleurs.

**Quelle syntaxe ajoute-t-il ?** Markdown est un petit langage, et tout éditeur qui a quelques années derrière lui a fait pousser des choses que la spécification ignore. Les wikilinks entre doubles crochets. Les blocs d’encadré. La transclusion, où un document en inclut un autre. Le surlignage entre doubles signes égal. Rien de tout cela n’est dans CommonMark, l’essentiel n’est pas dans GitHub Flavored Markdown, et un convertisseur qui suit la spécification les rendra tels quels, caractère pour caractère. Ce n’est pas le convertisseur qui a tort. C’est votre éditeur qui a écrit quelque chose que lui seul sait lire, dans un fichier qui a toutes les apparences de la portabilité.

**Que produit-il quand le document doit partir ?** Les éditeurs répondent de quatre manières. Certains exportent directement du HTML. Certains n’exportent que du PDF. Certains délèguent à Pandoc, qu’il faut installer séparément. Certains n’ont aucun export et attendent que vous fassiez passer le fichier par autre chose — position tout à fait raisonnable pour un éditeur de texte, et découverte assez surprenante la veille d’une échéance. [Les convertisseurs qui font ce travail correctement](/blog/best-markdown-to-html-converters) forment une catégorie d’outils à part, et savoir dans laquelle on se trouve épargne un après-midi.

Il existe une quatrième question, qui n’intéresse qu’une partie des lecteurs et qui, pour ceux-là, est décisive : le document part-il quelque part ? Un éditeur en ligne garde votre texte sur un serveur. Pour un billet de blog, peu importe. Pour le contrat d’un client, un entretien annuel ou un plan non publié, c’est toute la décision, prise avant que quoi que ce soit de l’expérience d’écriture n’entre en jeu.

## Comparatif rapide : l’aide-mémoire

| Éditeur | Idéal pour | Capacité principale | Prix |
| --- | --- | --- | --- |
| VS Code | Du Markdown qui vit dans un dépôt | Aperçu intégré, édition au niveau du dossier, connaissance de git | Gratuit |
| Obsidian | Un grand ensemble personnel de notes liées | Dossier local de fichiers `.md`, écosystème d’extensions, export PDF | Gratuit pour tous les usages, y compris commerciaux |
| Typora | Une application d’écriture posée sur de simples fichiers | Édition en un seul volet qui rend à la frappe ; export HTML, PDF et Word | 14,99 $ une fois, jusqu’à 3 appareils |
| iA Writer | De la prose longue sur un ordinateur et un téléphone | Modes de concentration, export HTML et PDF avec gabarits | Achat unique par plateforme |
| Zettlr | L’écriture académique avec références | Citations depuis Zotero et consorts ; export via Pandoc | Gratuit, GPL v3 |
| StackEdit | Écrire dans un onglet, y compris hors ligne | Fonctionne hors ligne une fois chargé ; synchronise Drive, Dropbox, GitHub | Gratuit, Apache 2.0 |
| Dillinger | Un document vite fait avec aperçu en direct | Éditeur dans le navigateur avec export HTML et PDF | Gratuit, MIT |
| Notion | Des pages d’équipe, pas des documents Markdown | Raccourcis d’allure Markdown en entrée ; export Markdown, HTML, PDF | Offre gratuite ; offres payantes par utilisateur |
| Vim / Neovim | Ceux qui vivent déjà dans un terminal | Syntaxe, repli et aperçu par extensions ; conversion en une commande shell | Gratuit, open source |
| Nota | Les auteurs macOS prêts à essuyer une bêta | Éditeur posé sur des fichiers Markdown locaux ; macOS seulement | Bêta ; aucun prix annoncé sur le site |
| Mark Text | Un éditeur de bureau gratuit qui rend à la frappe | Édition en un seul volet ; sortie HTML et PDF | Gratuit, MIT |

## Les meilleurs éditeurs Markdown en 2026

### VS Code — le meilleur s’il est déjà ouvert

VS Code est un éditeur de code dont la prise en charge de Markdown est assez bonne pour que la plupart des développeurs n’installent jamais rien d’autre. Il ouvre un dossier plutôt qu’un fichier, ce qui veut dire que vos documents, vos images et votre `.gitignore` tiennent dans une seule fenêtre, et que l’aperçu est à une touche du texte.

| Avantages | Inconvénients |
| --- | --- |
| Déjà installé chez la plupart des développeurs, et gratuit | Pas pensé pour la prose : ni mode concentration, ni compteur de mots par défaut |
| Les fichiers restent des fichiers ordinaires dans un dossier ordinaire | L’export HTML réclame une extension, et leur qualité est inégale |
| L’aperçu suit markdown-it, analyseur conforme à CommonMark | Le style de l’aperçu n’est pas le style de l’export |
| Des extensions ajoutent le linting, l’alignement des tableaux et le collage d’images | La fenêtre est celle d’un développeur, barre latérale pleine de code comprise |

**Prix :** gratuit.

**Détails techniques et fonctionnalités**

- Aperçu côte à côte qui défile avec la source, et repli par niveau de titre
- Complétion des chemins pour les liens et les images, si bien qu’un chemin relatif cassé se voit pendant la frappe
- Des extensions couvrent le linting (markdownlint), l’alignement des tableaux et l’export vers HTML et PDF
- Curseurs multiples et recherche-remplacement par expressions régulières, ce qui sert à la prose plus qu’on ne le croit
- Des snippets, donc une ossature de tableau ou un bloc de front matter tient en trois caractères

**Pour qui ?** Toute personne dont le Markdown vit à côté du code — READMEs, changelogs, documentation dans le dépôt. C’est aussi le meilleur éditeur de cette liste pour [les blocs de code délimités](/blog/code-blocks-in-markdown), puisqu’il connaît déjà tous les langages que vous y mettrez.

### Obsidian — la meilleure application gratuite posée sur un dossier de fichiers

Obsidian ouvre un dossier de fichiers `.md` et considère que les liens entre eux sont l’essentiel. Rien n’est rangé dans un conteneur propriétaire : le dossier qu’il ouvre est un dossier que vous pouvez aussi ouvrir dans VS Code, sauvegarder avec n’importe quoi, ou supprimer sans demander la permission.

| Avantages | Inconvénients |
| --- | --- |
| Vos documents sont de simples fichiers, dans un dossier que vous avez choisi | Sa syntaxe de wikilink n’est ni CommonMark ni GFM : elle voyage mal |
| Gratuit pour l’usage personnel comme professionnel | L’écosystème d’extensions est communautaire, avec la dispersion que cela suppose |
| Un vaste écosystème d’extensions, dont des extensions d’export | L’export HTML est une extension, pas une fonction intégrée |
| Le front matter est traité comme des propriétés de document | Le graphe et les extensions invitent au bricolage plutôt qu’à l’écriture |

**Prix :** gratuit pour tous les usages, personnels, commerciaux et associatifs ; les services payants Sync et Publish ainsi qu’une licence de soutien se vendent à part (vérifié sur obsidian.md/license, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Ouvre un répertoire local ; chaque note est un fichier `.md`, chaque pièce jointe un fichier à côté
- Les liens `[[Nom de note]]` et les inclusions `![[image.png]]` relèvent de la syntaxe propre à Obsidian, absente de toute spécification Markdown ; un réglage permet d’écrire des liens Markdown standard à la place
- Le front matter YAML est lu comme des propriétés structurées et affiché sous forme de champs
- L’export PDF est intégré ; l’export HTML vient d’extensions communautaires
- L’aperçu en direct masque la syntaxe pendant la frappe, avec un mode source qui montre le texte brut

**Pour qui ?** Toute personne qui accumule quelques centaines de notes qui se renvoient les unes aux autres et qui veut que ces notes restent lisibles dans dix ans. Désactivez le réglage des wikilinks dès le premier jour si les notes doivent un jour être publiées, car [l’écart entre la syntaxe d’une application et du Markdown portable](/blog/markdown-from-notion-obsidian-and-confluence) est bon marché à éviter et cher à corriger.

### Typora — le meilleur éditeur payant pour qui déteste voir la syntaxe

Typora est un éditeur de bureau à un seul volet. Pas de source à gauche et d’aperçu à droite : vous tapez `## Titre` et la ligne devient un titre sur place. Pour un auteur que le Markdown brut encombre, c’est la différence entre utiliser Markdown et le supporter.

| Avantages | Inconvénients |
| --- | --- |
| La surface d’écriture la plus calme du lot, sans comptabilité de deux volets | Payant, et réservé au bureau |
| Exporte HTML, PDF et Word depuis le fichier que vous avez sous les yeux | Masquer la syntaxe rend certaines erreurs de structure plus difficiles à voir |
| Les thèmes sont de simples fichiers CSS, dont l’export HTML hérite | Pas un outil de lot : un document à la fois |
| Les fichiers restent des `.md` locaux | Aucun écosystème d’extensions digne de ce nom |

**Prix :** 14,99 $ hors taxes, achat unique couvrant jusqu’à trois appareils, avec un essai gratuit de quinze jours (vérifié sur typora.io, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Édition en un volet : le Markdown est remplacé par son rendu pendant la frappe, la source réapparaissant dès que le curseur entre dans la ligne
- Export vers HTML, PDF et Word ; le HTML reprend le CSS du thème actif
- Les thèmes sont des fichiers CSS dans un dossier, si bien qu’une charte maison est une feuille de style et non un réglage
- Une option copie les images collées dans un dossier relatif à côté du document, ce qui fait toute la différence entre un fichier portable et un fichier qui pointe vers votre bureau
- Fonctionne sur macOS, Windows et Linux

**Pour qui ?** Ceux qui écrivent du Markdown tous les jours, veulent une application plutôt qu’un onglet, et acceptent de payer une fois. C’est le chemin le plus court entre un document terminé et un fichier HTML mis en forme que quelqu’un d’autre pourra ouvrir — et si c’est la limite d’appareils, l’absence de mobile ou un export décevant qui l’écarte, [les alternatives se trient selon celui de ces motifs qui est le vôtre](/blog/typora-alternatives).

### iA Writer — le meilleur pour de la prose longue entre ordinateur et téléphone

iA Writer est une application d’écriture d’abord, un éditeur Markdown ensuite. Elle a des convictions typographiques, un mode de concentration qui grise tout sauf la phrase en cours, et un surlignage des catégories grammaticales qui montre combien d’adjectifs vous avez semés.

| Avantages | Inconvénients |
| --- | --- |
| Conçue pour la prose, pas pour la documentation ni les notes | On paie par plateforme : un Mac et un iPad font deux achats |
| Mac, Windows, iPhone et iPad, avec de simples fichiers dessous | Ni extensions ni extensibilité, et c’est délibéré |
| Export HTML et PDF, avec gabarits pour l’habillage | Mauvais choix pour un document chargé de code |
| Un essai de sept jours sans carte bancaire | Volontairement peu de fonctions, ce que certains auteurs lisent comme un manque |

**Prix :** achat unique par plateforme — « payez une fois par plateforme, c’est à vous pour toujours » — avec un essai gratuit de sept jours et sans carte bancaire (vérifié sur ia.net/writer, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Travaille sur des fichiers `.md` ordinaires dans des dossiers ordinaires, y compris iCloud et Dropbox
- Mode de concentration et coloration par catégorie grammaticale, pensés pour la relecture plutôt que pour le premier jet
- Blocs de contenu : un document peut en inclure un autre par référence, ce qui permet à un manuscrit long de rester découpé en fichiers de chapitres
- Export vers HTML et PDF, avec des gabarits qui pilotent l’habillage
- Disponible pour macOS 10.15 ou plus récent et Windows 10 ou plus récent (vérifié sur ia.net/writer, le 8 septembre 2026)

**Pour qui ?** Les auteurs d’essais, de chapitres et d’articles plutôt que de documentation, qui veulent le même document ouvert sur un portable et sur un téléphone, et qui n’ont aucune envie d’entretenir un écosystème d’extensions.

### Zettlr — le meilleur éditeur gratuit pour l’écriture académique

Zettlr est une application Electron construite avec Vue et TypeScript, destinée à ceux qui écrivent avec des références. Il gère les citations issues d’un gestionnaire bibliographique, la recherche plein texte sur tout un dossier, et l’export via Pandoc plutôt que de réimplémenter la conversion.

| Avantages | Inconvénients |
| --- | --- |
| Citations depuis Zotero, JabRef et d’autres, dans l’éditeur | L’export dépend de Pandoc, souvent de LaTeX, installés à part |
| Gratuit et open source sous GNU GPL v3 | Plus lourd qu’un simple éditeur, Electron oblige |
| Recherche plein texte sur l’ensemble du dossier | Interface plus dense que les applications d’écriture ci-dessus |
| CSS personnalisé, thèmes et mode sombre | Le cadre Zettelkasten ne parle pas à tout le monde |

**Prix :** gratuit, sous licence GNU GPL v3 (vérifié sur github.com/Zettlr/Zettlr, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Electron, Node.js et Vue 3 pour l’interface, avec TypeScript dans le code (vérifié sur github.com/Zettlr/Zettlr, le 8 septembre 2026)
- Export via Pandoc, LaTeX et Textbundle, d’où une longue liste de formats et une installation qui ne se limite pas à l’application
- Coloration du code pour de nombreux langages à l’intérieur des blocs délimités
- Intégration des citations avec les gestionnaires bibliographiques courants
- Thèmes, modes sombres et CSS personnalisé, aussi bien pour l’édition que pour l’export

**Pour qui ?** Quiconque rédige une thèse, un article ou un livre avec bibliographie et veut la sortie de Pandoc sans assembler la ligne de commande à la main. Si vous alliez installer Pandoc de toute façon, Zettlr en est une interface gratuite.

### StackEdit — le meilleur éditeur de navigateur qui continue hors ligne

StackEdit est un éditeur Markdown qui tourne dans un onglet et continue de fonctionner quand la connexion s’arrête. Il synchronise avec les stockages en ligne habituels dès qu’un réseau existe, et il publie directement vers quelques plateformes de blog.

| Avantages | Inconvénients |
| --- | --- |
| Rien à installer, et il fonctionne hors ligne une fois chargé | Les documents vivent dans le stockage du navigateur tant qu’aucun service de synchronisation n’est branché |
| Synchronise avec Google Drive, Dropbox et GitHub | Effacer les données du site est une vraie façon de perdre son travail |
| Publie vers Blogger, WordPress et Zendesk | Sa syntaxe étendue ne survit pas toujours ailleurs |
| Export en Markdown, en HTML, ou via un gabarit Handlebars | Un onglet se ferme vite par mégarde |

**Prix :** gratuit, sous licence Apache 2.0 (vérifié sur stackedit.io, le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- Tourne entièrement dans le navigateur et annonce que l’on peut écrire hors ligne comme avec une application de bureau
- Destinations de synchronisation : Google Drive, Dropbox et GitHub
- Destinations de publication : Blogger, WordPress et Zendesk
- Sortie en Markdown, en HTML, ou mise en forme par le moteur de gabarits Handlebars
- Gère les documents longs avec un sommaire et un plan défilant

**Pour qui ?** Ceux qui travaillent sur une machine où ils n’ont pas le droit d’installer de logiciel, et ceux dont l’étape suivante après l’écriture est une plateforme de blog plutôt qu’un fichier — et si le stockage du navigateur ou la synchronisation est devenu le problème plutôt que le confort, [les alternatives se trient selon la partie de StackEdit que vous remplacez réellement](/blog/stackedit-alternatives).

### Dillinger — le meilleur pour un document, tout de suite

Dillinger tourne dans un onglet : la source d’un côté, l’aperçu de l’autre, et un menu d’enregistrement qui vous rend du HTML ou du PDF, ou pousse le fichier vers Dropbox, Google Drive, OneDrive ou GitHub. C’est l’outil que l’on ouvre quand il faut écrire un document dans les vingt minutes et que rien n’est installé.

| Avantages | Inconvénients |
| --- | --- |
| Ouvrir un onglet, écrire, exporter, fermer l’onglet | Votre document passe par un service hébergé |
| Export HTML et PDF sans compte | Le style de l’export est le sien, pas le vôtre |
| Gratuit et open source sous licence MIT | Pas un éditeur où loger un corpus de travail |
| Synchronisation vers les quatre destinations habituelles | Aucune histoire hors ligne digne de ce nom |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctionnalités**

- Éditeur à deux volets : le Markdown à gauche, l’aperçu rendu à droite
- Import depuis et enregistrement vers Dropbox, Google Drive, OneDrive et GitHub
- Export de la source en `.md` ou du document rendu en HTML ou en PDF
- Ni installation ni compte pour le parcours de base

**Pour qui ?** Quelqu’un qui écrit un document aujourd’hui. Dès qu’un destinataire est en jeu, traitez l’export comme un premier jet du fichier et vérifiez ce qu’il a réellement produit : un aperçu et [un fichier qui s’ouvre correctement ailleurs](/blog/share-a-markdown-document-as-a-link) sont deux choses différentes.

### Notion — celui qui n’est pas un éditeur Markdown

Notion accepte les raccourcis Markdown. Tapez `## ` et vous obtenez un titre ; tapez `- ` et vous obtenez une puce. C’est une aide à la saisie, pas un mode de stockage : ce que Notion conserve, c’est un arbre de blocs dans sa propre base de données, et Markdown n’est que l’un des formats en lesquels cet arbre sera converti au moment de sortir.

| Avantages | Inconvénients |
| --- | --- |
| Bon à ce pour quoi il est fait : pages partagées, bases, structure d’équipe | Pas un éditeur Markdown — l’export est une conversion, avec pertes |
| Export vers Markdown et CSV, HTML, ou PDF | Les bases sortent en CSV, pas en tableaux Markdown |
| Familier à toute équipe qui l’utilise déjà | Les encadrés sortent en HTML, faute d’équivalent Markdown |
| Les ressources sont incluses dans l’archive d’export | Les chemins de dossiers imbriqués peuvent casser l’extraction sous Windows |

**Prix :** offre gratuite disponible ; les offres payantes sont facturées par utilisateur — les chiffres à jour sont sur notion.com/pricing.

**Détails techniques et fonctionnalités**

- Quatre voies d’export : PDF, HTML, « Markdown & CSV », et l’impression depuis le navigateur
- L’export Markdown arrive sous forme d’archive compressée : des fichiers `.md` pour les pages et sous-pages qui ne sont pas des bases, un fichier `.csv` par base occupant une page entière, et des dossiers séparés pour les images et les autres ressources
- La documentation d’aide de Notion indique que les encadrés sont exportés en HTML « faute d’équivalent Markdown », et qu’une vue Formulaire d’une base ne peut pas être exportée du tout
- Les émojis personnalisés n’apparaissent pas dans les exports PDF
- Sous Windows, l’extraction peut échouer quand les chemins de dossiers imbriqués de l’archive dépassent 260 caractères ; les contournements documentés consistent à désactiver la création de dossiers pour les sous-pages, ou à utiliser un autre outil d’extraction

(Tout ce qui précède vérifié sur notion.com/help/export-your-content, le 8 septembre 2026.)

**Pour qui ?** Les équipes qui veulent un espace de travail partagé et s’avouent honnêtement que ce n’est pas un outil Markdown. Si vos documents doivent finir en Markdown portable ou en pages web, prévoyez une étape de nettoyage après chaque export plutôt que d’espérer que celui-ci sorte propre.

### Vim et Neovim — les meilleurs si vous vivez déjà dans un terminal

Vim et Neovim ne sont pas des éditeurs Markdown et le deviennent correctement avec trois ou quatre extensions. L’attrait n’est pas la prise en charge de Markdown ; c’est que l’édition de texte y est la plus rapide qui existe et que vous la connaissez déjà.

| Avantages | Inconvénients |
| --- | --- |
| Une vitesse d’édition que rien d’autre ici n’égale, si la mémoire musculaire est là | Tout est une extension, et c’est vous qui assemblez et entretenez |
| Gratuit et open source ; tourne par SSH, sur n’importe quoi | Aucun modèle de document : un tableau est du texte que vous alignez |
| Aperçu et conversion ne sont que d’autres programmes appelés | La courbe d’apprentissage est celle que l’on sait |
| La configuration est un fichier que l’on peut committer et réutiliser | Rien ne se rend pendant la frappe |

**Prix :** gratuit et open source. Vim est distribué sous sa propre licence charityware ; Neovim est en Apache 2.0.

**Détails techniques et fonctionnalités**

- Des extensions comme vim-markdown ajoutent la coloration syntaxique, le repli par titre et le masquage du balisage
- Les extensions d’aperçu comme markdown-preview.nvim rendent le document dans une fenêtre de navigateur pendant la frappe, via un processus Node
- Les extensions de tableaux comme vim-table-mode maintiennent les tableaux à barres verticales alignés pendant l’édition
- La conversion est à une commande shell : `:%!` et un pipeline, ou un raccourci qui applique un convertisseur au fichier courant
- Toute la configuration est du texte, donc le même environnement vous suit sur chaque machine

**Pour qui ?** Ceux qui s’en servent déjà pour le code. Personne ne devrait apprendre Vim pour écrire du Markdown, et qui connaît Vim ne devrait pas apprendre un second éditeur pour en écrire.

### Nota — le pari intéressant

Nota est un éditeur Markdown pour macOS orienté vers l’écriture et la publication depuis un dossier local de fichiers. Il mérite d’être connu et mérite qu’on le regarde en face : le site décrit une bêta macOS, propose une liste d’attente et une précommande, et n’affiche aucun prix.

| Avantages | Inconvénients |
| --- | --- |
| Construit autour de fichiers Markdown locaux, pas d’un service | macOS uniquement |
| Orienté publication, pas seulement prise de notes | Logiciel en bêta, avec la stabilité que cela suppose |
| Petit et concentré plutôt que plateforme d’extensions | Aucun prix annoncé : budgétez l’inconnu |

**Prix :** non indiqué sur nota.md, qui propose une liste d’attente et une précommande plutôt qu’un tarif affiché (vérifié le 8 septembre 2026).

**Détails techniques et fonctionnalités**

- macOS uniquement, selon le site ; aucune version Windows ou Linux n’est annoncée
- Distribué en bêta à ceux qui rejoignent la liste d’attente, avec une option de précommande
- Travaille sur des fichiers Markdown ordinaires posés sur le disque plutôt que sur des documents dans un service
- Positionné autour de l’écriture et de la publication plutôt que de la prise de notes

**Pour qui ?** Les auteurs sur Mac qui aiment essayer de nouvelles applications et gardent leurs fichiers là où l’application ne les contrôle pas. Parce que les documents sont de simples fichiers `.md`, le coût d’un pari perdu est faible : vous changez d’éditeur et le dossier ne bouge pas. Cette propriété est la raison entière de préférer les éditeurs qui possèdent des fichiers, et elle vaut plus que n’importe quelle fonctionnalité isolée.

### Mark Text — le meilleur éditeur de bureau gratuit à un seul volet

Mark Text est un éditeur de bureau open source qui reprend le rendu à la frappe popularisé par Typora, publié sous licence MIT et construit avec Electron et Vue.

| Avantages | Inconvénients |
| --- | --- |
| Gratuit, sous licence MIT, installable sur les trois systèmes de bureau | Projet communautaire : regardez l’historique récent des commits avant de vous engager |
| Rend à la frappe, dans un seul volet | Moins de formats d’export que les éditeurs payants |
| Produit du HTML et du PDF | Electron, donc l’empreinte mémoire que vous imaginez |
| Fichiers locaux, rien de téléversé | Écosystème de thèmes et d’extensions plus mince |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctionnalités**

- Versions pour Linux, macOS et Windows, en x64 et arm64
- Édition en un volet, la syntaxe étant remplacée par son rendu
- Sortie vers HTML et PDF
- Electron et Vue, donc un code source abordable si vous voulez changer quelque chose

**Pour qui ?** Quiconque veut le modèle d’édition de Typora sans le payer et accepte de dépendre d’un projet communautaire. Si une feuille de route entretenue compte plus pour vous que le prix d’une licence Typora, achetez plutôt Typora.

## La ligne de partage que les comparatifs ne tracent pas

Toutes les listes d’éditeurs Markdown les classent sur un axe. L’axe qui décide de l’ampleur de vos ennuis dans trois ans est binaire, et presque personne ne le met dans le tableau.

**Les éditeurs qui possèdent des fichiers.** VS Code, Obsidian, Typora, iA Writer, Zettlr, Mark Text, Vim et Nota pointent tous vers un répertoire sur un disque. La conséquence est que l’éditeur est remplaçable. Vous pouvez ouvrir le même dossier demain dans un autre éditeur, y passer un convertisseur dans un build, le fouiller avec `grep`, le committer dans git, et le sauvegarder avec l’outil qui sauvegarde déjà tout le reste. Quand l’une de ces applications est abandonnée, vous perdez l’application. Vous ne perdez pas ce que vous avez écrit.

**Les applications qui possèdent des documents.** Notion possède ses documents dans une base. StackEdit, tant qu’aucun service de synchronisation n’est branché, les possède dans le stockage de votre navigateur. Un éditeur hébergé les possède sur un serveur. La conséquence est que récupérer votre texte est une opération que l’éditeur du logiciel implémente, à la fidélité qu’il a choisie, dans les formats qu’il propose. Cette opération se passe généralement bien et, de temps en temps, elle est le pire après-midi du trimestre. Le signe qui ne trompe pas, c’est qu’elle s’appelle « exporter » et non « ouvrir ».

**La syntaxe propriétaire est une fuite lente.** Wikilinks, encadrés, marques de surlignage, requêtes intégrées, transclusion : chacun est commode à l’intérieur de l’application et inerte à l’extérieur. Vous ne le remarquez pas, parce que vous ne lisez jamais ces fichiers ailleurs que dans l’application qui les a écrits. Vous le remarquez le jour où la documentation déménage dans le dépôt, où un collègue ouvre une note dans un autre éditeur, ou où un convertisseur rend `[[Onboarding]]` sous la forme de quatre crochets et d’un mot. Rien n’est corrompu. Ce n’est simplement plus du Markdown, et ça ne l’était plus depuis un an.

**L’aperçu n’est pas l’export.** Chaque éditeur cité ici a un aperçu, et dans chacun d’eux l’aperçu est mis en forme par l’éditeur. Ce qui atterrit dans le HTML exporté, c’est une autre feuille de style, parfois un autre analyseur, et à l’occasion un autre dialecte de Markdown. Les tableaux sont l’endroit où cela se voit en premier, parce que les tableaux ne sont pas du tout dans CommonMark : un éditeur peut en rendre un correctement dans son propre volet et cracher un paragraphe de barres verticales en sortant. [Tester un tableau avant de faire confiance à la chaîne](/blog/markdown-tables-that-survive-conversion) prend une minute et évite un renvoi.

**Ce que chacun fait quand il vous faut du HTML.** C’est la demande qui les trie. Typora, iA Writer, Mark Text, StackEdit et Dillinger exportent du HTML directement, mis en forme à leur façon. Obsidian exporte du PDF nativement et du HTML par extension. VS Code et Vim délèguent à une extension ou à une commande. Zettlr délègue à Pandoc, que vous installez. Notion propose un export HTML d’un arbre de blocs qui n’a jamais été du Markdown. Aucun n’a tort ; ils répondent à des questions différentes. Ce qu’ils ont en commun, c’est que le HTML qu’ils produisent est le HTML qu’ils ont choisi, et si vous avez besoin d’une sortie précise — un seul fichier complet, les styles en ligne, rien à récupérer sur le réseau —, c’est le travail d’un convertisseur, pas d’un éditeur.

**Le coût de sortie est le vrai prix.** Un paiement unique de 14,99 $ n’est pas le coût d’un éditeur. Le coût, c’est ce qu’il faut pour cesser de s’en servir. Pour un éditeur qui possède des fichiers, ce coût est nul : vous le fermez et vous en ouvrez un autre sur le même dossier. Pour une application qui possède les documents, c’est un export, une inspection, une passe de nettoyage sur une syntaxe sans équivalent Markdown, et un lot de chemins de ressources à réparer. Pesez cela avant de peser la police de caractères.

## Comment choisir

1. **Décidez si votre texte doit survivre à l’éditeur.** Si la réponse est oui — et pour des notes, de la documentation et tout ce qui porte votre nom, elle l’est —, prenez quelque chose qui ouvre un dossier de fichiers, parce qu’un dossier de fichiers s’ouvrira avec ce qui existera en 2035.
2. **Accordez l’éditeur au type d’écriture, pas aux tests comparatifs.** La prose appelle iA Writer ou Typora ; la documentation à côté du code appelle VS Code ; un ensemble de notes liées appelle Obsidian ; une bibliographie appelle Zettlr. Se tromper de catégorie, c’est se battre chaque jour contre l’interface pour une chose qu’une autre application fait d’office.
3. **Désactivez la syntaxe propriétaire dès le premier jour.** Si l’éditeur propose des liens Markdown standard à la place des siens, acceptez. Rattraper des centaines de wikilinks plus tard est un chantier de script, et les chantiers de script sur ses propres notes ont la fâcheuse habitude d’avaler un week-end.
4. **Vérifiez l’export avant d’avoir une échéance.** Écrivez un document représentatif — un tableau, un bloc de code délimité, une image, une note de bas de page —, exportez-le, et ouvrez le résultat dans un autre navigateur, réseau coupé. Ce qui est cassé là sera cassé le jour venu, quand vous aurez moins de temps.
5. **Comptez les installations qu’exige l’export.** Un éditeur qui exporte par Pandoc est excellent et représente deux installations. Sur votre propre machine, tant mieux ; sur un portable d’entreprise verrouillé, c’est la raison pour laquelle l’export n’aura jamais lieu.
6. **Soyez honnête sur la destination du document.** S’il est confidentiel, un éditeur qui le range sur le serveur d’un tiers est éliminé, quelle que soit votre affection pour lui. Cette décision passe en premier, parce qu’aucune expérience d’écriture ne mérite qu’on la rejuge ensuite.

## Conclusion

Le meilleur éditeur Markdown est celui qui édite vos fichiers au lieu de posséder vos documents, dans une forme qui convient à l’écriture que vous pratiquez vraiment : VS Code s’il est déjà ouvert, Typora ou iA Writer si vous voulez payer une fois pour une surface plus calme, Obsidian si les notes se renvoient les unes aux autres, Zettlr s’il y a une bibliographie, Vim si vous y vivez déjà. Notion est l’exception qui mérite d’être nommée deux fois, parce que c’est un bon produit et un mauvais éditeur Markdown, et que l’écart n’apparaît qu’à l’export. Quel que soit celui où vous écrivez, gardez la conversion séparée de l’édition : quand le document doit devenir une page web que quelqu’un d’autre pourra ouvrir, [convertissez le Markdown en un fichier HTML autonome](/) dans votre navigateur, où le fichier reste sur votre machine et où la sortie est un fichier unique qui ne demande rien au réseau.

## FAQ

### Quel est le meilleur éditeur Markdown pour débuter ?

Typora, si vous acceptez de payer 14,99 $ une fois, parce qu’il masque la syntaxe et qu’il n’y a rien à configurer. Si vous voulez du gratuit, Mark Text offre le même modèle d’édition sous licence MIT, et StackEdit ne demande aucune installation. Évitez de commencer par Vim ou par une configuration bardée d’extensions : apprenez la syntaxe d’abord, l’outillage ensuite.

### Obsidian est-il un éditeur Markdown ou une application de notes ?

Les deux, et la distinction compte. Il édite des fichiers `.md` ordinaires dans un dossier que vous choisissez, ce qui en fait un vrai éditeur Markdown, mais sa syntaxe de wikilinks et d’inclusions lui appartient en propre plutôt qu’à CommonMark ou à GFM. Basculez le réglage vers les liens Markdown standard si ces notes doivent un jour être converties ou lues ailleurs.

### VS Code est-il bon pour écrire du Markdown ?

Oui, en particulier pour tout ce qui vit dans un dépôt. L’aperçu intégré suit un analyseur conforme à CommonMark, la complétion des chemins attrape les liens d’images cassés pendant la frappe, et git suit déjà le fichier. C’est un mauvais choix pour de la prose longue, parce qu’aucun des meubles propres à l’écriture — modes de concentration, typographie, mises en page sans distraction — n’est présent sans extensions.

### Notion exporte-t-il du vrai Markdown ?

Il exporte du Markdown, avec des trous documentés. Les bases deviennent des fichiers CSV plutôt que des tableaux Markdown, les encadrés sortent en HTML faute d’équivalent Markdown, une vue Formulaire ne peut pas être exportée, et sous Windows les chemins de dossiers imbriqués de l’archive peuvent dépasser la limite de 260 caractères et faire échouer l’extraction (vérifié sur notion.com/help/export-your-content, le 8 septembre 2026). Prévoyez une passe de nettoyage à chaque fois.

### Quel est le meilleur éditeur Markdown gratuit ?

VS Code si vous écrivez près du code, Obsidian si vous bâtissez un ensemble de notes liées — il est gratuit pour l’usage personnel comme commercial — et Zettlr s’il vous faut des citations. Tous les trois gardent votre texte dans de simples fichiers. Pour un onglet de navigateur sans rien installer, StackEdit est gratuit sous Apache 2.0 et fonctionne hors ligne une fois chargé.

### Ai-je besoin d’un éditeur Markdown payant ?

Non. Chacune des tâches évoquées ici se fait avec un logiciel gratuit, et les options gratuites ne sont pas des compromis. Ce que vous payez, c’est une surface d’écriture plus agréable et l’attention continue de quelqu’un à son sujet, ce qui vaut 14,99 $ pour certains et rien du tout pour d’autres. Décidez après quinze jours passés dans un éditeur gratuit, pas avant.

### Quel éditeur Markdown me donne du HTML à envoyer à quelqu’un ?

Typora, iA Writer, Mark Text, StackEdit et Dillinger exportent tous du HTML directement, chacun mis en forme à sa manière. Si ce qu’il vous faut est un fichier unique et autonome — styles en ligne, ni feuilles de style ni polices externes, ouverture identique sur une machine sans connexion —, c’est une étape de conversion et non une fonction d’éditeur, et elle gagne à se faire à part de l’endroit où le texte a été écrit.
