---
title: Toutes les alternatives à Pandoc qui valent le détour, triées par ce que vous cherchez
description: Pandoc reste imbattable pour DOCX, EPUB, les citations et le PDF composé. Si seul le HTML compte, voici les alternatives, triées par ce que vous cherchez.
date: 2026-08-14
tag: Conversion
keywords: pandoc markdown vers html, pandoc html autonome, alternative à pandoc, pandoc sans installation, convertir markdown sans pandoc, markdown vers docx, markdown vers pdf
---

Personne ne cherche une alternative à Pandoc parce que Pandoc serait mauvais. On la cherche parce qu’on voulait un fichier HTML et qu’on s’est retrouvé à lire sur les variables de template, ou parce que l’option PDF a réclamé une distribution TeX, ou parce qu’il n’y a pas de terminal sur la machine où vit le document. L’outil n’est pas le problème. La distance entre l’outil et la tâche l’est.

### En bref

Pandoc est la bonne réponse chaque fois que le pipeline produit autre chose que du HTML — DOCX, EPUB, LaTeX, un PDF composé, une bibliographie —, et rien d’autre sur cette page n’en approche. Si le HTML est la seule sortie, l’alternative qu’il vous faut dépend de la raison qui vous amène ici : **un convertisseur dans le navigateur** si vous voulez zéro installation et un fichier fini ; **marked ou markdown-it** si la conversion se fait à l’intérieur d’un code que vous faites déjà tourner ; **une API hébergée ou une GitHub Action** si cela se passe en CI et que vous ne voulez pas d’étape de paquet dans le runner ; **un générateur de site statique** si la réponse est un site plutôt qu’un document. La partie honnête est en bas de page : quatre tâches où chaque substitut de cette page échoue, et où il faut installer Pandoc à la place.

## Le frottement, nommé précisément

Convertir du Markdown en HTML avec Pandoc tient en une ligne. Ce n’est pas là qu’est le coût.

Le coût est dans la deuxième ligne. Un simple `pandoc -t html` renvoie un fragment — titres et paragraphes sans doctype, sans `<head>`, rien qu’un navigateur traitera comme une page. `--standalone` règle cela en enveloppant votre contenu dans le template par défaut de Pandoc, délibérément sobre, et dès que vous voulez qu’il ressemble à quelque chose, vous voilà dans `--css` pour une feuille de style, `-V` pour des variables de template, ou `--template` avec un fichier écrit dans le propre langage de template de Pandoc : `$body$`, `$for(author)$`, `$if(toc)$`. Aucun autre outil ne lit ce fichier. Il fait désormais partie de votre build, et quelqu’un doit l’entretenir.

Vient ensuite le problème de la feuille de style. `--css` vous laisse avec un fichier HTML qui a besoin d’un second fichier à côté de lui, exactement ce qu’il ne faut pas si le plan était d’envoyer la page par e-mail à un collègue. Pandoc peut intégrer les ressources à la place, mais l’option qui fait cela a été renommée entre deux versions majeures, vérifiez donc `pandoc --help` plutôt qu’une réponse de forum vieille de quatre ans.

Rien de tout cela n’est difficile. C’est une vraie quantité de configuration pour une seule page, et cette quantité ne diminue pas quand la tâche est petite. Cette asymétrie est toute la raison d’être de cet article.

## Ce pour quoi Pandoc reste imbattable

Soyons d’abord justes envers lui, parce que le compte-rendu juste est aussi le plus utile — il vous dit quand arrêter de lire.

Pandoc lit un document dans une représentation interne, puis réécrit cette représentation dans un autre format. L’indirection est toute l’astuce : personne n’a eu à écrire un convertisseur Markdown-vers-DOCX, parce que chaque lecteur peut alimenter chaque écrivain. Cette seule décision de conception explique pourquoi la liste de formats compte des dizaines d’entrées, et pourquoi aucun outil plus petit ne l’a jamais rattrapé.

**Une matrice de formats.** Un fichier source, plusieurs sorties, gardées synchronisées. HTML pour le site, DOCX pour le relecteur qui annote dans Word, EPUB pour le lecteur dans un train. Chaque alternative ci-dessous fait bien une seule sortie. Pandoc fait la matrice.

**L’écriture académique.** Mathématiques, renvois, figures numérotées, et `--citeproc` avec un fichier BibTeX et un style CSL, si bien que la bibliographie se met en forme toute seule dans le style que la revue impose. Rien d’autre dans cet article n’a même de processeur de citations.

**Une sortie Word dans un style maison.** `--reference-doc` prend polices, styles de titres et espacements d’une `.docx` existante et les applique à la vôtre. Si un modèle est arrivé du service juridique ou marketing, cette option est à elle seule la raison d’installer Pandoc.

**Les filtres.** Un filtre Lua ou JSON réécrit le document tant qu’il est encore un arbre — renuméroter chaque tableau, retirer une section, réécrire chaque lien interne, faire remonter chaque titre d’un niveau. Faire la même chose avec une expression régulière sur le HTML fini fonctionne, jusqu’au jour où ce n’est plus le cas.

```bash
pandoc -f gfm -t docx notes.md -o notes.docx
pandoc -f gfm -t epub book.md -o book.epub
pandoc -f gfm --citeproc --bibliography=refs.bib paper.md -o paper.pdf
```

La troisième ligne porte un avertissement qu’il vaut la peine de connaître avant de la taper. Markdown vers PDF n’est pas l’un des écrivains de Pandoc. Pandoc fabrique un PDF en confiant le document à un moteur séparé, et le moteur par défaut est un moteur TeX, ce pipeline signifie donc en général installer aussi une distribution TeX — une installation bien plus lourde que Pandoc lui-même, et la raison la plus courante pour laquelle quelqu’un décide que Pandoc est plus qu’il n’en voulait. `--pdf-engine` peut à la place pointer vers un moteur basé sur HTML ou sur Typst, bien plus léger, et qui gère les mathématiques et la mise en page différemment.

## Comparatif rapide : le pense-bête

| Outil | Idéal pour | Fonction clé | Prix |
| --- | --- | --- | --- |
| Pandoc | Toute sortie autre que HTML | Des dizaines de formats, des templates, des filtres Lua, `--citeproc` | Gratuit, GPL |
| Pandoc dans Docker | Garder la matrice sans l’installer | L’image officielle, exécutée contre un répertoire monté | Gratuit, GPL |
| TransformPipe | Un fichier fini, aucune installation, rien téléversé | Du HTML autonome aux styles intégrés, converti dans le navigateur | Gratuit |
| Dillinger | Rédiger là où rien n’est installé | Éditeur dans le navigateur, export HTML et PDF, synchronisation avec Drive et Dropbox | Gratuit, MIT |
| StackEdit | Écrire dans un navigateur sans connexion | Éditeur dans le navigateur, fonctionne hors ligne une fois chargé, synchronise et publie | Gratuit, Apache 2.0 |
| Typora | Une application de bureau plutôt qu’une commande | Édition WYSIWYG, export vers HTML, PDF et Word | 14,99 $ en un seul paiement |
| Obsidian | Exporter depuis des notes que vous tenez déjà | Coffre local ; export PDF dans l’application, HTML via des plugins | Gratuit ; licence commerciale payante en option |
| VS Code | Convertir le fichier déjà ouvert | Aperçu construit sur markdown-it, export via des extensions | Gratuit |
| marked | Conversion à l’intérieur d’une application JavaScript | Petit, rapide, GFM d’origine | Gratuit, MIT |
| markdown-it | Conformité à la spécification et plugins | Conforme à CommonMark, échappe le HTML brut par défaut | Gratuit, MIT |
| remark / rehype | Modifier le document, pas seulement l’afficher | Un AST que l’on peut parcourir, plus un assainisseur dans le pipeline | Gratuit, MIT |
| Python-Markdown | Un script de build Python | API d’extension mature, le moteur derrière MkDocs | Gratuit, BSD |
| markdown-it-py | CommonMark en Python | Un portage de markdown-it, même forme de plugins | Gratuit, MIT |
| mistune | La vitesse en Python | Python pur, rapide, à base de plugins | Gratuit, BSD |
| cmark-gfm | Un tout petit binaire dans un build | GFM en C, sortie en fragment, aucun runtime à installer | Gratuit, open source |
| API hébergée, CLI, GitHub Action | CI sans étape de paquet | La conversion comme une requête ou une étape de workflow | Palier gratuit ; compte requis pour les clés |
| Générateurs de site statique | Un site plutôt qu’un document | Navigation, templates, flux, de nombreuses pages à la fois | Gratuit |
| API Markdown de GitHub | Afficher le GFM exactement comme GitHub | Point de terminaison HTTP renvoyant un fragment HTML | Gratuit, avec limite de débit |

## Les alternatives, selon la raison de votre recherche

Chaque section ci-dessous répond à une phrase différente. Trouvez la vôtre et passez le reste. Si vous voulez le paysage complet plutôt que la question façonnée par Pandoc, [le comparatif complet des convertisseurs](/blog/best-markdown-to-html-converters) couvre les mêmes outils avec une pondération différente.

### Pandoc lui-même — la référence à laquelle vous vous mesurez

Il mérite sa propre section, parce que la moitié des gens qui cherchent une alternative cherchent en réalité la permission de continuer à utiliser celui-ci.

| Avantages | Inconvénients |
| --- | --- |
| Convertit entre des formats que rien d’autre ne touche | Un binaire à installer, et un terminal où taper |
| `--standalone` produit un document entier, pas un fragment | Les templates sont un langage que seul Pandoc lit |
| Les filtres réécrivent le document sous forme d’arbre | La sortie PDF a besoin d’un moteur séparé, souvent TeX |
| `--sandbox` restreint l’accès au système de fichiers pour une entrée non fiable | Le HTML brut passe tel quel : aucun assainissement |

**Prix :** gratuit, sous licence GPL.

**Détails techniques et fonctions**

- Écrit en Haskell, distribué comme un binaire unique pour les principales plateformes
- Son propre dialecte étendu par défaut, avec des lecteurs CommonMark et GFM sélectionnables par option
- `--standalone` pour un document complet ; une option séparée intègre images et CSS
- `--citeproc`, `--bibliography` et des styles CSL pour les références
- Des filtres Lua et JSON pour réécrire l’arbre syntaxique abstrait en cours de conversion

**Pour qui ?** Quiconque a un document qui doit devenir autre chose qu’une page web, maintenant ou dans les prochains mois. Le langage de template est un prix raisonnable pour la matrice de formats. C’est un mauvais prix pour un seul README.

### TransformPipe — aucune installation, et un fichier qui s’ouvre partout

Un convertisseur dans le navigateur convient à un document qui ne fait partie d’aucun build. Vous ouvrez une page, y déposez le fichier `.md`, et téléchargez le HTML. Il vaut la peine de savoir [quels convertisseurs en ligne téléversent votre fichier et lesquels ne le font pas](/blog/best-online-document-converters) avant d’en choisir un. Déconnecté, rien n’est téléversé : le fichier est lu, analysé et rendu sur votre propre machine, ce que vous pouvez vérifier en regardant l’onglet réseau ne rien faire pendant que ça travaille.

| Avantages | Inconvénients |
| --- | --- |
| Rien à installer, aucun terminal | Un document à la fois, ou plusieurs enchaînés en un seul — pas un site |
| L’export est un fichier autonome unique aux styles intégrés | Aucun langage de template, les mises en page sont donc celles proposées |
| Déconnecté, le fichier ne quitte jamais la machine | Le navigateur fait le travail, un fichier très volumineux est donc limité par la machine |
| Assainit contre une même liste blanche, dans le navigateur comme sur le serveur | Rien en dehors du HTML : pas de DOCX, pas d’EPUB, pas de PDF composé |

**Prix :** gratuit. Créer un compte ajoute l’historique des conversions, des liens de partage et des clés d’API, et ne coûte rien non plus.

**Détails techniques et fonctions**

- Lit le GitHub Flavored Markdown, les tableaux, listes de tâches, texte barré et blocs de code délimités survivent donc
- Ce qui se télécharge est une page entière : un doctype, un `<head>`, le CSS dans un bloc `<style>`, et pas une seule requête externe
- Tout HTML brut de la source est filtré au passage contre une liste blanche fixe
- S’enregistre en `.html`, `.md` ou texte brut ; un PDF sort de la boîte de dialogue d’impression du navigateur plutôt que d’un moteur TeX
- Convertit aussi HTML, Word, CSV/TSV et JSON vers Markdown
- Le même convertisseur est accessible de quatre autres façons : une API REST, une CLI, une GitHub Action et un serveur MCP

**Pour qui ?** Quiconque a pour étape suivante « envoyer ça à une personne », et quiconque est sur une machine où installer un binaire relève de la décision de quelqu’un d’autre. C’est le substitut le plus proche de `pandoc --standalone --embed-resources`, sans l’installation et sans le template.

### Dillinger et StackEdit — quand vous êtes encore en train d’écrire

Les deux sont des éditeurs Markdown dans le navigateur avec export, et les deux sont la bonne réponse à une question différente : pas « convertir ce fichier » mais « écrire ce document et obtenir du HTML à la fin ». Dillinger exporte en HTML et PDF et synchronise avec Dropbox, Google Drive, OneDrive et GitHub. StackEdit continue de fonctionner sans connexion une fois chargé, et publie vers plusieurs destinations quand il en a une.

| Avantages | Inconvénients |
| --- | --- |
| Écrire et exporter sans quitter le navigateur | Pensés éditeur d’abord : aucun des deux n’est fait pour convertir des fichiers déjà existants |
| Synchronisation cloud vers les endroits habituels | Le document passe par un service hébergé |
| Gratuit et open source | Le style de l’export est celui de l’outil, pas le vôtre |
| StackEdit fonctionne hors ligne une fois chargé | La syntaxe étendue de StackEdit voyage mal vers d’autres analyseurs |

**Prix :** gratuit. Dillinger est sous licence MIT ; StackEdit sous licence Apache 2.0.

**Détails techniques et fonctions**

- Aperçu en direct à côté de la source, avec le confort habituel d’un éditeur
- Export en HTML et PDF depuis le navigateur, aucune installation locale
- Des destinations de synchronisation et de publication incluant Drive, Dropbox, OneDrive et GitHub
- Les documents vivent dans le stockage du navigateur ou dans le compte connecté, pas sur votre système de fichiers par défaut

**Pour qui ?** Les gens qui composent maintenant plutôt que de convertir plus tard. Si le fichier existe déjà sur le disque et que vous voulez seulement du HTML en sortie, un convertisseur est un chemin plus court qu’un éditeur.

### Typora — une application de bureau plutôt qu’une commande

La réponse sans terminal pour quelqu’un qui écrit du Markdown tous les jours. Typora remplace la syntaxe par son rendu au fil de la frappe, garde les fichiers sur votre propre disque, et exporte en HTML, PDF et Word depuis un menu.

| Avantages | Inconvénients |
| --- | --- |
| Confortable pour écrire pendant des heures | Payant, et bureau uniquement |
| Exporte en HTML, PDF et Word avec des thèmes | Ni un outil de traitement par lots, ni une étape de build |
| Les fichiers restent sur votre machine | Le WYSIWYG masque la syntaxe, ce que certains rédacteurs n’aiment pas |

**Prix :** 14,99 $ hors taxes, un achat unique couvrant jusqu’à trois appareils, avec un essai gratuit de 15 jours (vérifié sur typora.io, le 8 septembre 2026).

**Détails techniques et fonctions**

- Édition WYSIWYG sur de simples fichiers `.md` du système de fichiers local
- Export en HTML, PDF, Word et plusieurs autres formats depuis le menu de l’application
- Les thèmes sont du CSS, le style de l’export est donc modifiable sans langage de template
- Gère tableaux, notes de bas de page, mathématiques et diagrammes comme des fonctions de l’éditeur

**Pour qui ?** Quiconque écrit du Markdown quotidiennement et veut une application plutôt qu’une commande. Il couvre les sorties HTML, PDF et Word de Pandoc pour un document à la fois, à la souris, et n’en couvre aucune dans un script.

### Obsidian — exporter depuis les notes que vous tenez déjà

Pas un convertisseur, mais souvent la raison pour laquelle quelqu’un n’en a pas besoin : le document est déjà dans un coffre de fichiers Markdown locaux, et l’export n’est qu’à un clic de menu. L’export PDF est intégré à l’application. L’export HTML vient de plugins communautaires, ce qui est une vraie distinction — le produit central ne le promet pas.

| Avantages | Inconvénients |
| --- | --- |
| Fichiers locaux, aucun téléversement, fonctionne hors ligne | L’export HTML dépend d’un plugin communautaire, pas de l’application centrale |
| Export PDF intégré | Les liens wiki et les insertions sont une syntaxe Obsidian, pas du GFM |
| Gratuit pour un usage personnel et commercial | Pas un pipeline : les exports se produisent quand une personne clique |

**Prix :** gratuit pour tous les usages, y compris commercial ; des licences commerciales facultatives se vendent à l’année (vérifié sur obsidian.md, le 8 septembre 2026).

**Détails techniques et fonctions**

- Les coffres sont d’ordinaires répertoires de fichiers `.md`, n’importe quel autre outil peut donc les lire aussi
- Les `[[liens wiki]]`, insertions et encadrés sont des extensions : vérifiez ce que fait votre analyseur cible avec eux
- L’écosystème de plugins couvre l’export, la publication et la génération de site
- Rien ne quitte la machine, sauf si vous activez un service de synchronisation ou de publication

**Pour qui ?** Les gens dont le Markdown vit déjà dans un coffre. L’avertissement porte sur la syntaxe : une note pleine de `[[liens wiki]]` convertie par un analyseur GFM strict produit des doubles crochets littéraux dans la sortie, parce que ces crochets ne sont pas du Markdown.

### VS Code — le chemin le plus court si le fichier est déjà ouvert

Le volet d’aperçu de VS Code est du markdown-it en dessous, et l’export arrive via des extensions plutôt que par l’éditeur lui-même. Pour un README déjà ouvert dans un onglet, cela bat toute installation.

| Avantages | Inconvénients |
| --- | --- |
| Déjà installé, pour la plupart des développeurs | L’export a besoin d’une extension, et les extensions varient en qualité |
| Le comportement de l’aperçu correspond à la gestion CommonMark de markdown-it | Le style de l’aperçu n’est pas le style de l’export |
| Les extensions couvrent HTML, PDF et diapositives | Convertit ce qui est ouvert : ni un lot, ni un build |

**Prix :** gratuit.

**Détails techniques et fonctions**

- Aperçu intégré rendu par markdown-it, avec les fonctions GFM activées pour l’aperçu
- Les extensions d’export enveloppent le fragment dans un document et intègrent ou lient une feuille de style — laquelle des deux dépend de l’extension
- Les réglages d’espace de travail peuvent ajouter une feuille de style d’aperçu personnalisée
- Rien n’est téléversé ; la conversion se fait dans le processus de l’éditeur

**Pour qui ?** Les développeurs qui ont besoin du fichier actuellement dans l’éditeur, et rien de plus. Vérifiez ce que l’extension met autour du fragment avant d’envoyer le résultat à qui que ce soit, parce que « ça avait l’air bien dans l’aperçu » n’est pas la même affirmation que « ça s’ouvre bien sur le portable de quelqu’un d’autre ».

### marked et markdown-it — la voie JavaScript

Si la conversion a sa place à l’intérieur d’un code que vous faites déjà tourner, une bibliothèque est plus petite qu’un binaire et plus facile à raisonner. marked est petit et rapide, avec le GFM activé par défaut. markdown-it est conforme à CommonMark, a un système de plugins structuré, et échappe le HTML brut sauf indication contraire — le réglage par défaut le plus sûr des deux.

| Avantages | Inconvénients |
| --- | --- |
| Une seule dépendance, aucune installation séparée à documenter | Les deux renvoient un fragment : l’enveloppe est votre travail |
| Le HTML autour de la sortie est du HTML que vous avez écrit, pas un template hérité | Aucune matrice de formats — HTML uniquement |
| markdown-it échappe le HTML brut par défaut | La qualité des plugins varie selon l’écosystème |
| Fonctionne aussi bien dans Node que dans le navigateur | La coloration syntaxique et l’assainissement sont des décisions séparées |

**Prix :** gratuit, les deux sous licence MIT.

**Détails techniques et fonctions**

- marked : GFM par défaut, des moteurs de rendu personnalisés par type de nœud, un lexer que l’on peut appeler pour obtenir des tokens plutôt que du HTML
- markdown-it : passe la suite de tests CommonMark, `html: false` par défaut, des règles ajoutables et réordonnables
- Aucun des deux n’assainit pour vous ; la réponse documentée est un assainisseur dédié sur la sortie
- Les deux sont le moteur à l’intérieur d’outils plus grands, les rapports de bogues et les cas limites sont donc bien connus

**Pour qui ?** Tout projet qui a déjà un build Node. [Le comparatif JavaScript complet](/blog/markdown-to-html-in-javascript) passe en revue les différences sérieusement, et [convertir depuis un terminal](/blog/markdown-to-html-from-the-command-line) donne le script d’enveloppe en entier — une quinzaine de lignes, ce qui est la mesure honnête de ce que vaut pour vous le `--standalone` de Pandoc.

### remark et rehype — quand il faut modifier le document

L’écosystème unified analyse le Markdown en un AST, permet de le réécrire, puis effectue le rendu. C’est la seule alternative ici qui rivalise avec les filtres Lua de Pandoc, et elle rivalise bien.

| Avantages | Inconvénients |
| --- | --- |
| Un vrai arbre syntaxique que l’on peut parcourir, interroger et réécrire | L’option la plus lourde de cette page |
| rehype-sanitize est une étape du pipeline, pas une réflexion après coup | Le pipeline demande un vrai apprentissage |
| Des plugins pour le GFM, le front matter, les titres, les liens | Excessif pour transformer un fichier en une page |
| Fait tourner MDX et Docusaurus, il est donc bien éprouvé | Reste limité au HTML au bout du compte |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctions**

- Deux formats d’arbre — mdast pour Markdown, hast pour HTML — et un plugin pour convertir l’un en l’autre
- remark-gfm pour les tableaux et les listes de tâches ; remark-frontmatter pour l’en-tête YAML
- Les mêmes arbres servent à construire des linters, des formateurs et des codemods sur la prose
- L’assainissement se fait sur l’arbre, avant que le HTML n’existe, ce qui est plus strict que filtrer des chaînes

**Pour qui ?** Les équipes qui doivent modifier le document en transit : réécrire chaque lien relatif, extraire les titres pour la navigation, imposer un style maison. Si vous alliez chercher un filtre Lua, voici le substitut.

### Python-Markdown, markdown-it-py et mistune — la voie Python

La même logique dans un autre langage. Python-Markdown est l’option mature au vaste catalogue d’extensions, et c’est le moteur derrière MkDocs. markdown-it-py est un portage de markdown-it, il apporte donc la conformité CommonMark et la même forme de plugins. mistune est le rapide.

| Avantages | Inconvénients |
| --- | --- |
| S’intègre naturellement si le build est déjà en Python | Sortie en fragment dans les trois cas |
| L’API d’extension de Python-Markdown est bien documentée et largement utilisée | Python-Markdown n’est pas conforme à CommonMark dans chaque détail |
| markdown-it-py apporte la conformité à la spécification et un modèle de plugins familier | Trois bibliothèques signifient trois jeux de cas limites |
| mistune est assez rapide pour de gros lots | La coloration et l’assainissement restent à votre charge |

**Prix :** gratuit. Python-Markdown est sous licence BSD, markdown-it-py sous licence MIT, mistune sous licence BSD.

**Détails techniques et fonctions**

- Python-Markdown : des extensions officielles pour les tableaux, les notes de bas de page, les listes d’attributs et la table des matières
- markdown-it-py : un portage de l’analyseur JavaScript, utilisé là où le comportement CommonMark doit correspondre
- mistune : Python pur avec un système de plugins, aucune dépendance compilée
- Les trois renvoient une chaîne, l’enveloppe du document est donc un template dans votre propre code

**Pour qui ?** Les projets Python, les builds de documentation, et tout ce qui importe déjà depuis PyPI. Testez d’abord un document contenant un tableau : les trois bibliothèques ne sont pas d’accord sur les tableaux, parce que ce sont dans les trois cas des extensions et non de la syntaxe de base.

### cmark-gfm — le petit binaire à l’intérieur d’un build

Le fork de GitHub de l’implémentation de référence de CommonMark, écrit en C, avec les extensions GFM ajoutées. Il est rapide, n’a aucun runtime à installer à côté, et renvoie un fragment sans style ni enveloppe.

| Avantages | Inconvénients |
| --- | --- |
| Minuscule et rapide, aucun runtime de langage requis | Fragment uniquement : rien qui ressemble à `--standalone` |
| Implémente les extensions GFM, tableaux compris | Les extensions sont ce qu’il y a dans la boîte, et rien de plus |
| Sensé à l’intérieur d’un Makefile ou d’une image de conteneur | Il faut le compiler ou trouver un paquet pour votre plateforme |

**Prix :** gratuit, open source — cmark est sous licence BSD, et le fork cmark-gfm de GitHub porte sa propre notice.

**Détails techniques et fonctions**

- CommonMark plus les extensions GFM : tableaux, listes de tâches, texte barré, liens automatiques, notes de bas de page en option
- Une bibliothèque C aussi bien qu’un binaire en ligne de commande, il s’intègre donc dans d’autres programmes
- Des options contrôlent la gestion du HTML brut, ce qui compte pour une entrée non fiable
- Aucun template, aucun CSS, aucune intégration de ressources — par conception

**Pour qui ?** Les builds qui fournissent déjà leur propre mise en page et n’ont besoin que du corps. C’est ce qui se rapproche le plus de la vitesse de Pandoc et de la commodité d’un binaire unique, sans aucune de ses capacités.

### Une API hébergée, une CLI ou une GitHub Action — la CI sans étape de paquet

Le cas de la CI est un problème à part. Installer Pandoc dans un runner est une étape qui télécharge un binaire à chaque job, et TeX dans un runner est pire encore. Les alternatives sont une requête à une API, une CLI sans dépendance, ou une étape de workflow qui fait la conversion pour vous.

| Avantages | Inconvénients |
| --- | --- |
| Rien d’installé dans le runner, donc rien à mettre en cache ni à figer | Une API signifie que le document quitte la machine |
| Une seule étape de workflow, et la même conversion que la page web | Une clé dans les secrets du dépôt à créer et à faire tourner |
| La sortie est un fichier complet et autonome, prêt à publier | HTML uniquement : une publication qui a besoin d’un PDF a quand même besoin d’un moteur |
| La CLI n’a aucun arbre de dépendances à auditer | Un service hébergé est une dépendance que vous ne contrôlez pas |

**Prix :** palier gratuit ; un compte est requis pour émettre des clés d’API.

**Détails techniques et fonctions**

- Point de terminaison REST prenant du Markdown et renvoyant un document HTML complet
- Une CLI sans dépendances, pour un runner qui n’a qu’un shell et rien d’autre
- Une GitHub Action pour convertir sur un push, une fusion ou un tag de publication
- Un serveur MCP, pour le cas où ce qui fait la conversion est un modèle plutôt qu’une personne

**Pour qui ?** Quiconque reconstruit une page à chaque commit. [Publier depuis un workflow](/blog/publish-markdown-from-github-actions) détaille la version pull request, où la sortie est jointe à la PR plutôt que déployée. Le compromis de confidentialité est réel et mérite d’être dit sans détour : une conversion dans le navigateur garde le fichier local, un appel d’API non.

### Pandoc dans Docker — sauter l’installation, garder la matrice

*Pandoc sans installation* signifie en général l’une de deux choses. La première est une interface web qui fait tourner Pandoc sur le serveur de quelqu’un d’autre, ce qui convient à un README public et pas à un projet de contrat. La seconde est l’image de conteneur officielle, qui garde votre machine propre et garde chaque format.

```bash
docker run --rm -v "$PWD:/data" pandoc/core -f gfm -t html -s README.md -o README.html
```

| Avantages | Inconvénients |
| --- | --- |
| Toute la matrice de formats, rien d’installé sur l’hôte | Vous avez installé Docker à la place, ce qui est plus lourd |
| Reproductible : l’image fige la version pour tout le monde | Les volumes montés et les permissions de fichiers deviennent votre problème |
| Des variantes d’image existent pour les pipelines LaTeX plus lourds | Plus lent à chaque exécution qu’un binaire local |

**Prix :** gratuit, sous licence GPL.

**Pour qui ?** Les équipes qui veulent un Pandoc unique et figé sur plusieurs machines, et quiconque a un portable verrouillé qui a Docker mais pas de gestionnaire de paquets. C’est le juste milieu honnête : on saute l’installation sans confier son document à un inconnu.

### Les générateurs de site statique — la réponse quand vous vouliez un site

Hugo, Eleventy, MkDocs, Docusaurus et Jekyll transforment tous du Markdown en HTML, et aucun d’eux n’est un convertisseur au sens où cette page l’entend. Chacun est un système de build. Il veut un répertoire, un fichier de configuration, un ensemble de templates et une cible de déploiement ; en échange, il rend navigation, recherche, flux et liens croisés sur toutes les pages à la fois.

| Avantages | Inconvénients |
| --- | --- |
| Navigation et templates sur de nombreux documents | Beaucoup trop de machinerie pour un fichier unique |
| Builds rapides, documentation approfondie, déployé partout | Un fichier de configuration et une étape de build à maintenir en vie pour toujours |
| Thèmes, plugins et une histoire de déploiement | La sortie est un répertoire de pages, pas un fichier qu’on peut envoyer par e-mail |

**Prix :** gratuit. Hugo est sous licence Apache 2.0 ; Eleventy, Docusaurus et Jekyll sont sous licence MIT ; MkDocs est sous licence BSD.

**Détails techniques et fonctions**

- Chacun embarque un moteur Markdown : Goldmark dans Hugo, markdown-it dans Eleventy par défaut, Python-Markdown dans MkDocs
- Le front matter pilote titres, dates, étiquettes et ordre de navigation
- La sortie est une arborescence de fichiers HTML avec des ressources partagées, destinée à être servie
- Le déploiement fait partie du modèle : une commande de build et un hébergeur

**Pour qui ?** Quiconque a en sortie un ensemble de pages qui se référencent entre elles. Un fichier et un destinataire, c’est une forme totalement inadaptée à un générateur — cette tâche veut un document, pas un site web.

### L’API Markdown de GitHub — le GFM affiché exactement comme GitHub l’affiche

Un point de terminaison HTTP qui prend du Markdown et renvoie du HTML. C’est le seul moyen d’obtenir le rendu propre à GitHub sans aspirer une page, et la sortie est un fragment qui n’est enveloppé dans rien.

| Avantages | Inconvénients |
| --- | --- |
| Comportement GitHub Flavored Markdown identique au bit près | Le document est téléversé sur GitHub pour être rendu |
| Aucune installation du tout : une requête HTTP | Limité en débit, et l’authentification est requise pour relever la limite |
| Utile pour vérifier ce que le GFM fait vraiment | Sortie en fragment, avec les noms de classes de GitHub sur certains éléments |

**Prix :** gratuit, avec limite de débit.

**Pour qui ?** Quiconque doit faire correspondre précisément le rendu de GitHub, et personne qui a besoin d’une page finie. Traitez-la comme une implémentation de référence que l’on peut appeler, pas comme une voie d’export.

## Les tâches qui exigent vraiment Pandoc

C’est la section qu’une page de comparatif laisse en général de côté, la voici donc sans les précautions oratoires. Quatre tâches ne devraient être tentées avec rien de ce qui précède.

**Tout ce qui a une bibliographie.** Si le document cite des sources et que les citations doivent être mises en forme selon un style, `--citeproc` avec un fichier BibTeX et un style CSL est l’outil. Il n’existe aucun substitut sur cette page. Le faire à la main, c’est entretenir une liste de références qui devient obsolète dès qu’un co-auteur réorganise une section.

**Un PDF composé avec une vraie mise en page.** Veuves, orphelines, placement des figures, numéros de page, renvois qui disent « voir page 14 ». L’impression en PDF d’un navigateur donne un document lisible, pas un document composé, parce que le navigateur met en page un document web puis le découpe en pages. Si la sortie doit avoir l’air composée, Pandoc qui confie la main à un moteur TeX ou Typst est la voie, et l’installation supplémentaire en est le prix.

**Du DOCX dans le modèle de quelqu’un d’autre.** Quand un modèle `.docx` arrive avec des polices, des styles de titres et des espacements imposés, `--reference-doc` les applique. Aucun convertisseur Markdown-vers-Word qui saute cette étape ne produira un fichier que le propriétaire du modèle acceptera, et reformater à la main dans Word est un travail que vous referez le trimestre prochain.

**EPUB, LaTeX, reStructuredText, MediaWiki, Org et le reste de la matrice.** Dès que deux d’entre eux apparaissent dans le même cahier des charges, le débat est clos. Enchaîner des outils à usage unique pour simuler une matrice signifie que chaque format n’est jamais qu’à un cas limite d’un outil de la panne, et les pannes arrivent séparément.

Il y a une chose que Pandoc ne fait délibérément pas, et cela joue dans l’autre sens : il n’assainit pas. Le HTML brut d’un fichier Markdown passe tel quel dans la sortie, balises `<script>` comprises, parce que la conversion fidèle est le travail qu’il s’est engagé à faire. `--sandbox` restreint l’accès au système de fichiers pendant la conversion, ce qui est une protection différente. Si le fichier vient de l’extérieur — un client, un dépôt, un formulaire soumis —, vous avez besoin de votre propre étape d’assainissement, et [pourquoi cela doit se faire à plus d’un endroit](/blog/sanitising-markdown-safely) vaut dix minutes de lecture avant d’ouvrir le résultat dans un navigateur.

## Comment choisir

1. **Notez chaque format de sortie que ce document devra produire sur toute sa vie.** Si DOCX, EPUB, LaTeX ou un PDF composé figure sur cette liste, installez Pandoc et arrêtez de comparer ; chaque heure passée sur un substitut est une heure passée sur un outil que vous remplacerez.
2. **Décidez si la destination est une personne ou un serveur.** Une personne a besoin d’un fichier autonome unique qui s’ouvre réseau coupé. Un serveur a besoin d’un fragment que vos templates envelopperont. Se tromper produit soit du texte sans style dans la boîte de réception de quelqu’un, soit un document avec deux copies du mobilier de page.
3. **Comptez les installations que la tâche peut supporter.** Une conversion ponctuelle ne devrait pas exiger de gestionnaire de paquets ; un build nocturne ne devrait pas exiger un onglet de navigateur et un humain dedans. Les deux erreurs sont courantes, et les deux sont évidentes après coup.
4. **Vérifiez où va le fichier avant de le convertir.** La conversion côté navigateur garde le document sur votre machine, et vous pouvez le vérifier depuis l’onglet réseau. Une API, un éditeur hébergé et le point de terminaison Markdown de GitHub signifient tous que le document voyage, ce qui est sans importance pour un README public et décisif pour un contrat.
5. **Convertissez un fichier représentatif et ouvrez le résultat ailleurs.** Pas dans l’aperçu de l’outil — un autre navigateur, une autre machine, sans connexion. Ce seul test attrape d’un coup les fragments, les feuilles de style manquantes, les liens de polices CDN et les tableaux perdus, et il prend environ une minute.

## Conclusion

Si « alternative à Pandoc » est une recherche aussi courante, c’est que Pandoc répond à une question plus large que celle que la plupart des gens posent, et répondre à une question plus large coûte toujours plus cher. Si le document doit devenir un fichier Word, un EPUB ou un PDF composé, installez Pandoc et apprenez ses templates — il survivra à tous les autres outils nommés ici. Si le HTML est la seule sortie, choisissez selon la raison qui vous amène : une bibliothèque là où le build vit déjà, une étape de workflow là où la CI tourne déjà, un générateur quand la réponse est un site, et un convertisseur dans le navigateur quand ce que vous voulez est un fichier fini sans qu’aucune installation ne fasse obstacle — ce que fait [la conversion Markdown vers HTML de TransformPipe](/), gratuitement, dans votre propre navigateur, sans rien téléverser quand vous êtes déconnecté.

## FAQ

### Quelle est la meilleure alternative à Pandoc pour Markdown vers HTML ?

Il n’y en a pas une seule, parce que Pandoc couvre plusieurs tâches à la fois. Pour une page finie sans installation, un convertisseur dans le navigateur qui produit du HTML autonome ; pour une conversion à l’intérieur d’un code, marked ou markdown-it ; pour la CI, une API ou une GitHub Action ; pour un site entier, un générateur de site statique. Chacun remplace une partie de ce que fait Pandoc, et aucun ne remplace la matrice de formats.

### Puis-je utiliser Pandoc sans l’installer ?

Oui, de deux façons aux compromis différents. L’image Docker officielle fait tourner le vrai Pandoc sans rien installer sur l’hôte à part Docker, ce qui garde votre document en local. Une interface web hébergée fait aussi tourner Pandoc, mais sur la machine de quelqu’un d’autre, le fichier est donc téléversé — très bien pour un README public, faux pour tout ce qui est confidentiel.

### Pandoc est-il excessif pour convertir un seul fichier Markdown en HTML ?

En général, oui. Une conversion nue renvoie un fragment, il faut donc `--standalone`, et faire ressembler cette sortie à quelque chose demande une option de feuille de style, des variables de template ou un fichier de template dans le propre langage de Pandoc. Pour une page que quelqu’un doit lire, un convertisseur qui renvoie directement un document complet et autonome évite tout cela.

### Pourquoi mon HTML Pandoc n’a-t-il aucun style ?

Parce que vous n’avez pas passé `--standalone`, ou que vous l’avez fait et obtenu le template par défaut, délibérément sobre. Ajoutez une feuille de style avec `--css`, et vous avez désormais deux fichiers qui doivent voyager ensemble ; intégrez plutôt les ressources si le fichier doit s’ouvrir seul. Cet écart entre « converti » et « présentable » est la raison la plus courante pour laquelle on se met à chercher une alternative.

### Qu’est-ce qui remplace les filtres Lua de Pandoc ?

remark et l’écosystème unified, de plus près que tout autre. Les deux analysent le document en un arbre syntaxique que l’on peut réécrire avant le rendu, ce qui est la même forme de solution — réécrire l’arbre, pas la chaîne de sortie. La différence est que l’arbre de Pandoc couvre chaque format qu’il prend en charge, tandis que celui de remark couvre Markdown et HTML.

### Les alternatives gèrent-elles les tableaux et les listes de tâches ?

Seulement si elles implémentent le GitHub Flavored Markdown, parce que les tableaux et les listes de tâches ne sont pas dans la spécification CommonMark. marked, cmark-gfm et markdown-it configuré en GFM le font ; un analyseur CommonMark strict affiche votre tableau comme un paragraphe plein de barres verticales et ne signale aucune erreur du tout. Convertissez un fichier contenant un tableau avant de vous engager sur un outil de cette page.

### Un convertisseur dans le navigateur est-il sûr pour un document confidentiel ?

Cela dépend entièrement du fait que la conversion se passe dans le navigateur ou sur un serveur, et les deux ont l’air identiques de l’extérieur. Un convertisseur côté navigateur lit le fichier avec l’API File et ne l’envoie jamais, ce que vous pouvez vérifier en ouvrant l’onglet réseau et en regardant qu’il ne se passe rien. Tout ce qui affiche une barre de progression pendant qu’un serveur travaille a votre document.
