---
title: "Un convertisseur Notion vers Markdown gratuit : toutes les options, et où le gratuit se paie"
description: "Comparatif des voies gratuites pour convertir des pages Notion en Markdown : le bouton d’export, un convertisseur en ligne, notion-to-md, Obsidian Importer"
date: 2026-09-14
tag: Conversion
keywords: convertir notion en markdown gratuit, convertisseur notion markdown, notion vers markdown gratuit, convertir notion en markdown en ligne, convertisseur notion markdown gratuit, meilleur outil notion vers markdown, export notion markdown
---

Cherchez un convertisseur Notion vers Markdown et presque tout ce qui remonte est gratuit, ce qui est un résultat étrange pour une recherche où il est question d’argent. C’est pourtant vrai. L’export maison de Notion ne coûte rien, les paquets open source ne coûtent rien, les convertisseurs qui tournent dans le navigateur ne coûtent rien, les éditeurs qui importent un espace de travail ne coûtent rien. Personne ne facture la conversion elle-même, parce que la difficulté n’est pas là.

La difficulté, c’est que chacune de ces options gratuites l’est à sa manière, et que chacune envoie une facture différente plus tard. L’une produit des noms de fichiers auxquels un identifiant hexadécimal de 32 caractères est soudé. L’une réclame un jeton d’intégration, une étape d’autorisation à l’intérieur de Notion, et une limite de débit correctement gérée dans le code. L’une envoie votre espace de travail sur un serveur dont vous n’avez jamais entendu parler. L’une prend un après-midi de votre temps, ce qui est la seule chose réellement coûteuse de cette liste.

Voici donc un comparatif écrit sur l’axe qui les sépare : non pas le prix, mais ce que coûte la gratuité. Tous les outils ci-dessous sont vraiment gratuits — pas « gratuits pendant l’essai », pas « gratuits jusqu’au mur du palier gratuit » — et à côté de chacun figure la réponse honnête à la question « et ensuite ? ». Pour la mécanique d’une voie en particulier plutôt que pour le choix entre elles, [le guide complet détaille chaque voie étape par étape](/blog/convert-notion-export-to-markdown).

### En bref

Toutes les options sérieuses sont gratuites : choisissez donc sur la forme. **L’« Export as Markdown & CSV » de Notion** est le point de départ de tout le reste : du vrai Markdown, mais chaque nom de fichier et chaque lien entre pages traîne l’identifiant de 32 caractères hexadécimaux de la page. **Un convertisseur en ligne qui fusionne l’export** — [la conversion Notion vers Markdown proposée ici](/notion-to-markdown) en est un — prend cette même archive zip et vous rend un document unique avec un sommaire, sans identifiants ni script, sans rien téléverser tant que vous n’êtes pas connecté ; en échange, les pages deviennent des sections plutôt que des fichiers. **`notion-to-md`** lit les pages via l’API de Notion depuis Node et vous laisse nommer la sortie vous-même : adapté à une étape de build, inadapté à un besoin ponctuel, puisqu’un jeton et une autorisation précèdent la première ligne de code. **Obsidian Importer** est gratuit, sous licence MIT, et c’est la voie à prendre quand la destination est un coffre. **Pandoc** convertit localement l’export HTML, plus riche. **Le copier-coller** cesse de fonctionner vers la cinquième page.

Ce qui se paie, à chaque fois, c’est du temps, de l’installation, une forme imposée ou de la confidentialité — jamais de l’argent.

## Pourquoi cette conversion est plus difficile qu’elle n’en a l’air

Notion identifie une page par un identifiant, pas par son titre. Les titres changent, deux pages peuvent porter le même, et l’export a besoin de noms de fichiers uniques : il inscrit donc l’identifiant dans le nom de chaque fichier et de chaque dossier qu’il crée, `Notes de réunion 21f4c8a1b2c34d5e8f90123456789abc.md`. Chaque lien d’une page exportée vers une autre pointe vers ce nom de fichier exact, encodé en pourcentages. Renommez le fichier pour qu’il soit lisible et le lien casse en silence, parce qu’un lien relatif mort ne produit aucune erreur tant qu’un lecteur ne clique pas dessus.

Ce seul fait sépare les outils. Un convertisseur vous laisse les identifiants sur les bras, les réécrit dans une passe qui réécrit aussi chaque lien, ou supprime la nécessité même qu’ils se résolvent en fusionnant les pages en un document unique. Il n’y a pas de quatrième option, et aucune somme d’argent n’en produirait une.

Une deuxième difficulté n’a rien à voir avec les identifiants. Une page Notion n’est pas seulement du texte : ce sont des bases de données avec leurs vues, des colonnes de formules, des blocs synchronisés affichés à plusieurs endroits, et des fils de commentaires attachés à la page plutôt qu’écrits dedans. Markdown a un tableau et rien d’autre dans cette liste : une partie des pertes est donc structurelle — elle a lieu dans l’export, avant qu’aucun convertisseur n’entre en jeu.

Et une troisième, là où la question du gratuit devient intéressante. Un espace de travail Notion est en général l’ensemble de documents le plus sensible que possède une petite entreprise : notes de recrutement, salaires, stratégie, brouillons juridiques à moitié finis. Un convertisseur en ligne gratuit qui téléverse votre export est gratuit parce que vous avez payé dans une autre monnaie — acceptable pour un manuel public, un transfert de données pour tout le reste, et une décision à prendre exprès plutôt qu’en faisant glisser un fichier sur la première page venue.

## Comparatif rapide : l’aide-mémoire

| Outil | Idéal pour | Capacité principale | Prix |
| --- | --- | --- | --- |
| L’« Export as Markdown & CSV » de Notion | Sortir le contenu, tout simplement | Du vrai Markdown pour chaque page, un CSV pour chaque base de données | Gratuit, intégré |
| Un convertisseur en ligne (le `/notion-to-markdown` de ce site) | Un document à lire, archiver ou transmettre | Fusionne l’archive d’export en un document unique avec un sommaire, dans le navigateur | Gratuit |
| L’export plus votre propre script de réécriture | Un dossier de fichiers qui doivent rester des fichiers | Renomme les fichiers et réécrit les liens à partir d’une seule table d’identifiants | Gratuit, coûte votre temps |
| `notion-to-md` | Une étape de build ou une synchronisation planifiée | Lit les pages via l’API Notion et écrit des fichiers que vous nommez | Gratuit, open source |
| Obsidian Importer | Une destination qui est un coffre Obsidian | Importe un export HTML de Notion ou lit l’API directement | Gratuit, MIT |
| Pandoc sur l’export HTML | Une page à la fois, ou une chaîne de traitement documentaire | HTML en entrée, Markdown en sortie, plus tous les autres formats qu’il écrit | Gratuit, GPL |
| Le copier-coller | Trois pages, une fois, aujourd’hui | Rien à installer, rien à apprendre | Gratuit |

## Les options gratuites, une par une

### L’export maison de Notion — idéal pour sortir le contenu, tout simplement

Toutes les autres voies présentées ici partent de cet export ou le remplacent par l’API. L’export de Notion se trouve dans le menu de la page ou de l’espace de travail et propose PDF, HTML, et Markdown & CSV ; l’option Markdown écrit un `.md` par page et un `.csv` par base de données en pleine page, les images et autres ressources étant enregistrées dans des dossiers à côté (vérifié sur notion.com, le 14 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Réellement gratuit, intégré, sans autre compte que celui que vous avez déjà | Chaque nom de fichier et chaque lien entre pages traîne l’identifiant de 32 caractères hexadécimaux |
| La sortie est du vrai Markdown, qui s’ouvre dans n’importe quel éditeur | Seule la vue courante ou par défaut d’une base de données est exportée |
| Les bases de données sortent en CSV, au moins lisible par une machine | Une vue formulaire ne peut pas être exportée du tout |
| Les ressources sont incluses plutôt que laissées sous forme d’URL périssables | Un gros export arrive sous forme de lien envoyé par courriel, et ce lien expire |

**Prix :** gratuit. Une fonction voisine ne l’est pas : « Include subpages » pour un export **PDF** est décrite sur la page d’aide de Notion comme une fonction des offres Business ou Enterprise (vérifié sur notion.com, le 14 septembre 2026). La voie Markdown & CSV n’est pas verrouillée ainsi, ce qu’il est utile de savoir si quelqu’un dans votre équipe a conclu qu’exporter un espace de travail exigeait de passer à l’offre supérieure.

**Détails techniques.** Le suffixe d’identifiant fait 32 caractères hexadécimaux en minuscules, séparé du titre par une espace ou un tiret bas selon la version du client qui a produit l’export. « Create folders for subpages » peut être désactivé pour raccourcir les chemins, ce qui compte sous Windows, où un espace de travail profondément imbriqué produit des chemins plus longs que ce que le système accepte. Les très gros exports ne sont pas téléchargés immédiatement : Notion envoie un lien par courriel, ce lien expire au bout de sept jours, et le traitement est documenté comme pouvant prendre jusqu’à trente heures — un export lancé l’après-midi d’une migration risque donc de ne pas arriver à temps.

**Pour qui ?** Pour tout le monde, d’abord. Quelle que soit la voie choisie ensuite, c’est la manière officielle de récupérer une copie de votre contenu hors d’un produit hébergé, et le faire une fois avant d’en avoir besoin est une assurance bon marché.

### Un convertisseur en ligne qui fusionne l’export — idéal pour un document unique

Déposez cette même archive sur [la conversion Notion vers Markdown de TransformPipe](/notion-to-markdown) et chaque page devient une section d’un document unique, dans l’ordre de l’export, sous un sommaire généré. Un lien entre pages conserve les mots qu’il affichait et perd son adresse, parce qu’une fois que deux pages sont des sections d’un même document, il n’y a plus d’adresse distincte à viser. Les bases de données arrivent sous forme de tableaux Markdown plutôt que de fichiers CSV rangés à part.

| Avantages | Inconvénients |
| --- | --- |
| Pas de table d’identifiants, pas de renommage, pas de script, pas d’installation | Produit un document unique : les pages ne restent pas des fichiers séparés avec leur propre URL |
| Un sommaire est généré à partir des titres de pages | Un lien entre pages garde son texte, pas sa cible |
| Tourne dans le navigateur : déconnecté, l’archive n’est téléversée nulle part | Une archive à la fois, pas une tâche planifiée |
| Les bases de données arrivent en tableaux dans le même document que les pages | Les commentaires et les vues non par défaut manquent toujours, puisque l’export ne les contenait pas |

**Prix :** gratuit au sens le plus simple — la conversion s’exécute localement dans la page, il n’y a donc aucun coût de serveur à récupérer ni de quota par fichier à atteindre. Un compte ajoute l’historique, le partage et une API, gratuits eux aussi.

**Détails techniques.** L’archive est lue dans le navigateur avec un décompresseur en pur JavaScript, les entrées étant triées par leur chemin à l’intérieur de l’archive pour qu’un même export se convertisse deux fois de la même manière, et le titre de chaque section est le nom du fichier privé de son suffixe d’identifiant. Une page dont la première ligne répète déjà son titre sous forme de titre de niveau n’obtient pas ce titre deux fois, et les pages sont séparées par un filet horizontal — la convention qu’emploie partout ailleurs [la fusion de plusieurs fichiers Markdown en un seul](/blog/merging-many-markdown-files).

**Pour qui ?** Pour quiconque visait en réalité un document plutôt qu’un dossier : un espace de travail archivé en un seul fichier lisible, un wiki de projet remis à un client, une base de connaissances collée dans un dépôt. Si la destination exige une URL par page, c’est la mauvaise forme, et les deux options suivantes sont les bonnes.

### L’export plus votre propre script de réécriture — idéal pour des fichiers qui restent des fichiers

Si la destination est un site de documentation, un import de wiki ou tout endroit où chaque page a besoin de sa propre adresse, il faut retirer les identifiants proprement : construisez une table qui associe l’identifiant de chaque fichier au nom que vous voulez, puis réécrivez chaque nom de fichier et chaque lien à partir de cette unique table, en une seule passe. Faire le renommage sans la réécriture des liens, c’est ce qui produit un dossier qui a l’air correct et qui est plein de liens morts.

| Avantages | Inconvénients |
| --- | --- |
| Aucune dépendance, aucun jeton, aucun compte, rien de téléversé | L’option la plus coûteuse d’ici, mesurée en votre propre temps |
| La sortie, ce sont de vrais fichiers avec de vrais noms, ce qu’attend un site de documentation | Un travail à moitié fait casse tous les liens internes, en silence |
| Fonctionne hors ligne, sur l’export que vous avez déjà | Le CSV d’une base de données n’est pas raccroché à la page à laquelle il appartenait |
| Reproductible une fois écrit, et vérifiable parce que c’est vous qui l’avez écrit | Dix pages à la main font une soirée ; mille à la main, ce n’est pas réaliste |

**Prix :** gratuit, si l’on ne compte pas l’après-midi. Ce que vous devriez faire : à n’importe quel taux horaire, un script soigné plus ses tests est la ligne la plus chère de cette page, et la seule dont le coût reste invisible jusqu’à ce que vous y soyez depuis trois heures.

**Détails techniques.** L’extraction de l’identifiant doit s’exécuter sur la cible du lien décodée, pas sur la version brute encodée en pourcentages, sinon l’espace de `Notes%20de%20réunion` ne correspondra pas à un motif écrit pour une espace littérale. Le reste — l’expression régulière, la jointure du CSV, l’aplatissement des dossiers — est exposé dans [le guide pas à pas](/blog/convert-notion-export-to-markdown) plutôt qu’ici.

**Pour qui ?** Pour les équipes qui migrent un ensemble de documentation vers un système attendant un fichier par URL, où les noms de fichiers et les liens entre eux font partie du livrable au lieu de lui être accessoires.

### `notion-to-md` — idéal pour une étape de build

Lire l’espace de travail via l’API officielle de Notion plutôt que par le bouton d’export évite entièrement le problème des identifiants, puisque rien n’en impose un dans un nom de fichier quand c’est vous qui écrivez le fichier. `notion-to-md` est le paquet Node couramment utilisé pour cela : il récupère l’arbre de blocs d’une page via l’API et le convertit en Markdown, avec un point d’extension pour traiter les types de blocs qu’il ne couvre pas par défaut.

| Avantages | Inconvénients |
| --- | --- |
| Jamais de suffixe d’identifiant, puisque vous choisissez chaque nom de fichier | Exige un jeton d’intégration et le partage de cette intégration sur chaque page — une étape d’autorisation, pas une étape de code |
| S’intègre à un script de build, un site statique ou un miroir planifié dans git | Une page ou une requête de base de données à la fois ; parcourir un espace de travail, c’est votre propre récursion |
| Tourne en intégration continue, sans navigateur ni clic manuel sur Export | Les blocs image reviennent sous forme d’URL temporaires de Notion, qui expirent si vous ne les téléchargez pas |
| Extensible : les types de blocs non pris en charge peuvent passer par votre propre transformateur | L’API a une limite de débit, et un script qui l’ignore donne l’impression de se figer |

**Prix :** gratuit, open source. La licence mérite d’être énoncée avec soin : le paquet publié déclare ISC dans ses métadonnées npm, tandis que le fichier `LICENSE` du dépôt — et la ligne 4.0 alpha — portent MIT (vérifié sur registry.npmjs.org et github.com/souvikinator/notion-to-md, le 14 septembre 2026). Les deux sont permissives ; si votre organisation enregistre formellement les licences, notez de quel artefact vous êtes parti.

**Détails techniques.** L’API de Notion est limitée à une moyenne de trois requêtes par seconde et par intégration, avec une limite distincte à l’échelle de l’espace de travail par-dessus (vérifié sur developers.notion.com, le 14 septembre 2026). Au-delà de la limite, une requête renvoie un `429` avec un en-tête `Retry-After` au lieu de données : une boucle d’attente et de nouvelle tentative a donc sa place dès la première version du script, et non dans celle écrite après le premier échec — pour un gros espace de travail, c’est la différence entre une tâche qui se termine et une que vous tuez en croyant qu’elle a planté.

**Pour qui ?** Pour quiconque ne fera pas cela une seule fois : un site qui construit ses pages à partir de Notion, un miroir nocturne d’un manuel dans un dépôt, une chaîne de traitement où « quelqu’un l’exporte à la main chaque mois » est l’étape qui finira par sauter.

### Obsidian Importer — idéal quand la destination est un coffre

Si le Markdown part vers Obsidian, le chemin gratuit le plus court est le greffon Importer d’Obsidian lui-même plutôt qu’un convertisseur généraliste. Il gère une longue liste de sources — Evernote, OneNote, Roam, Bear, Apple Notes, ainsi que des dossiers de HTML et de Markdown bruts — et propose Notion en deux variantes distinctes.

| Avantages | Inconvénients |
| --- | --- |
| Gratuit et sous licence MIT, maintenu par l’équipe d’Obsidian elle-même (vérifié sur github.com/obsidianmd/obsidian-importer, le 14 septembre 2026) | Utile uniquement si la destination est un coffre ; ce n’est pas un convertisseur généraliste |
| Deux voies : lire l’espace de travail via l’API, ou importer l’archive d’export hors ligne | Sa propre documentation déconseille l’export Markdown de Notion et recommande l’export HTML |
| La voie API convertit bases de données et formules en fichiers de base de données propres à Obsidian | La voie par l’archive ne préserve pas les bases de données, et ne demande aucun jeton en échange |
| Une étape d’aperçu avant que quoi que ce soit ne soit écrit dans le coffre | La voie API subit les mêmes limites de débit Notion : un gros espace de travail prend du temps |

**Prix :** gratuit, sous licence MIT.

**Détails techniques.** Les limites documentées sont assez précises pour qu’on puisse les anticiper : sur la voie API, seule la vue principale de chaque base de données est importée, les sources de données liées ne le sont pas, et une poignée de fonctions de formule couvrant les personnes et la mise en forme du texte n’ont pas d’équivalent. La voie par l’archive échange les bases de données contre l’indépendance : pas de jeton, pas d’internet, pas de limite de débit. La recommandation d’exporter en HTML plutôt qu’en Markdown est le point intéressant ici, parce que c’est un éditeur qui dit franchement que l’export Markdown de Notion perd des informations que l’export HTML conserve (vérifié sur obsidian.md, le 14 septembre 2026).

**Pour qui ?** Pour quiconque déplace un espace de travail vers Obsidian, la destination la plus fréquente de cette conversion. La question plus large de [ce qui survit à un déplacement entre Notion, Obsidian et Confluence](/blog/markdown-from-notion-obsidian-and-confluence) mérite d’être lue avant l’import plutôt qu’après.

### Pandoc sur l’export HTML — idéal pour une page, ou pour une chaîne de traitement

Pandoc est un convertisseur de documents en ligne de commande qui lit le HTML et écrit du Markdown, parmi une longue liste dans les deux sens. Pointé sur l’export HTML de Notion plutôt que sur son export Markdown, c’est un convertisseur gratuit, local et scriptable, qui part du plus riche des deux exports.

| Avantages | Inconvénients |
| --- | --- |
| Gratuit et local : rien n’est téléversé, et il tourne en intégration continue aussi facilement que sur un portable | Il convertit des fichiers, pas des archives : l’archive, le parcours des dossiers et les noms de fichiers sont votre affaire |
| Part de l’export HTML, qui transporte plus de choses que celui en Markdown | Une grosse installation pour une seule page |
| La même commande écrit du DOCX, du PDF ou du LaTeX en changeant une option | Le HTML exporté par Notion est généré par machine : le Markdown demande donc une passe de nettoyage |
| Contrôle fin du dialecte Markdown qu’il écrit | Aucune notion d’espace de travail, d’arborescence de pages ou de base de données |

**Prix :** gratuit, sous licence GPL (vérifié sur pandoc.org, le 14 septembre 2026).

**Détails techniques.** Le fait pertinent est que l’export HTML de Notion et son export Markdown ne sont pas le même contenu dans deux costumes : celui en HTML transporte de la mise en forme et de la structure que l’écrivain Markdown a dû abandonner, ce qui explique pourquoi l’importateur d’Obsidian réclame du HTML. Pandoc vous permet de partir de là et de choisir votre propre variante de Markdown en sortie, et les différences entre [les variantes de Markdown](/blog/commonmark-gfm-and-the-flavours) décident de la part de ce balisage qui survit.

**Pour qui ?** Pour les gens qui ont déjà Pandoc dans un build, ou pour quiconque convertit une poignée de pages importantes et préfère partir de l’export qui a le moins perdu.

### Le copier-coller — idéal pour trois pages, une fois

Sélectionnez la page dans Notion, copiez, collez dans un éditeur Markdown, réparez ce qui a cassé. Cette méthode a sa place dans cette liste parce que, pour une poignée de pages, c’est vraiment l’option gratuite la plus rapide.

| Avantages | Inconvénients |
| --- | --- |
| Rien à installer, à configurer ni à apprendre | Ne passe pas l’échelle au-delà de quelques pages, et le mur arrive brutalement |
| Vous voyez chaque page, donc rien n’est massacré en silence | Les images ne suivent pas ; chacune est retéléchargée à la main |
| Pas de compte, pas de jeton, pas de téléversement | Ni reproductible, ni vérifiable |

**Prix :** gratuit.

**Pour qui ?** Pour quelqu’un qui a trois pages et une échéance. Dès qu’il y a des sous-pages, des bases de données ou des images en quantité, le coût en temps dépasse rapidement toutes les autres options, et sans prévenir — la cinquième page ressemble à la première, et la quarantième est le moment où vous comprenez que vous auriez dû exporter.

## Où le gratuit se paie

Rien de ce qui précède ne coûte d’argent. Chaque option coûte quelque chose, et les coûts diffèrent assez pour que « elles sont toutes gratuites » soit la chose la moins utile que vous puissiez en savoir.

**Ce qui se paie, c’est un quota.** Les voies passant par l’API — `notion-to-md`, et le mode API d’Obsidian Importer — sont limitées par la limite de débit de Notion plutôt que par la grille tarifaire de qui que ce soit. Trois requêtes par seconde et par intégration paraît généreux jusqu’à ce que vous remarquiez qu’une page avec des blocs imbriqués représente plusieurs requêtes. La gratuité est réelle ; l’illimité n’a jamais été promis.

**Ce qui se paie, c’est l’installation.** Un jeton d’intégration est gratuit ; le créer, le partager sur les bonnes pages, le ranger là où un build peut le lire et penser à le renouveler n’est pas rien. Pour une conversion que vous ferez exactement une fois, c’est un mauvais marché face à un clic sur Export, et c’est pourquoi le classement s’inverse avec la fréquence.

**Ce qui se paie, c’est une offre.** La page d’aide de Notion indique que « Include subpages » pour un export PDF exige une offre Business ou Enterprise (vérifié sur notion.com, le 14 septembre 2026). Ce n’est pas la voie Markdown, mais c’est un rappel que « l’export est gratuit » vaut par format et non en général.

**Ce qui se paie, c’est votre contenu.** Un convertisseur hébergé gratuit tourne sur un serveur que quelqu’un paie. Ce n’est pas sinistre en soi, mais cela veut dire que « où part mon export ? » a une vraie réponse, qui ne figure pas toujours sur la page. La conversion côté navigateur y répond par construction : ouvrez l’onglet réseau, lancez la conversion, regardez ne rien partir. Savoir si [un convertisseur en ligne est sûr](/blog/is-an-online-converter-safe) pour un fichier donné est autant une question sur le fichier que sur l’outil.

**Ce qui se paie, c’est votre après-midi.** La voie du script n’a ni éditeur, ni quota, ni question de confidentialité, et reste l’option la plus chère d’ici. Un logiciel libre n’est pas une main-d’œuvre gratuite, et un convertisseur que vous écrivez est un convertisseur que vous maintiendrez la prochaine fois que l’export de Notion changera de forme.

## Ce qu’aucun outil gratuit ne récupère

Trois choses ne sortent pas de Notion du tout, dans aucun format, par aucune voie : aucun comparatif de convertisseurs ne peut donc y remédier.

**Les commentaires.** Un fil de commentaires est rattaché à une page en tant que discussion plutôt que stocké comme contenu de la page : il n’atteint donc aucun des formats d’export. Si une décision n’existe que sous forme de réponse dans un fil, déplacez-la dans le corps de la page avant d’exporter ; après, elle est perdue et non simplement non convertie.

**Les vues de base de données autres que celle par défaut.** Notion exporte la vue que vous regardez ou celle par défaut, pas toutes. Une base filtrée de trois façons pour trois publics s’exporte comme une des trois ; les autres doivent être reconstruites à partir des lignes.

**Les blocs synchronisés.** Un bloc synchronisé est un bloc affiché à plusieurs endroits, et un export n’a aucun moyen de le dire : chaque emplacement reçoit sa propre copie, sans marqueur indiquant qu’ils ont jamais été liés.

Une base de données, de même, arrive sous forme d’instantané de lignes — un tableau Markdown n’a ni formules, ni relations, ni agrégats — donc si ces nombres sont calculés plutôt que saisis, vérifiez [le tableau qui est ressorti](/blog/markdown-tables-that-survive-conversion) avant de supprimer quoi que ce soit dans Notion.

## Comment choisir

1. **Décidez de la forme de la sortie avant de regarder le moindre outil.** Un document unique, un dossier de fichiers avec leurs propres URL, ou un coffre. Toutes les recommandations d’ici découlent de cette réponse, et choisir après avoir converti revient à faire la conversion deux fois.
2. **Comptez combien de fois cela se produira.** Une seule, et l’option sans installation gagne rien que sur le temps : un clic sur Export, l’archive déposée sur un convertisseur en ligne, c’est fait en quelques minutes. Chaque semaine ou à chaque déploiement, et le coût d’installation de la voie API s’amortit à zéro en moins d’un mois.
3. **Demandez-vous si le contenu a le droit de quitter votre machine.** Un espace de travail contenant des salaires, des notes de recrutement ou quoi que ce soit de non publié élimine les convertisseurs hébergés de la liste avant même le premier comparatif de fonctionnalités, et laisse la conversion côté navigateur et les outils locaux en ligne de commande.
4. **Vérifiez ce que vous vous apprêtez à perdre tant que vous pouvez encore le voir.** Les commentaires, les vues de base supplémentaires et les blocs synchronisés sont absents de la sortie sans la moindre erreur pour le signaler : la seule vérification fiable consiste à regarder la source dans Notion d’abord.
5. **Comptez les pages honnêtement.** Trois, c’est un copier-coller. Trente, c’est un export et un convertisseur. Trois mille, c’est un script sur l’API avec gestion des nouvelles tentatives, et aussi un export que Notion mettra peut-être presque une journée à produire — lancez-le donc avant d’en avoir besoin.

## Conclusion

Il n’y a pas de palier payant à comparer ici, ce qui fait de ce marché un marché exceptionnellement facile à parcourir et exceptionnellement facile à choisir de travers. Les options diffèrent par la forme, pas par le prix : l’export de Notion sort le contenu et vous laisse les identifiants ; un convertisseur en ligne transforme cette archive en un document lisible unique et ne téléverse rien ; un script de réécriture garde les fichiers comme fichiers au prix de votre après-midi ; `notion-to-md` et Obsidian Importer lisent l’API correctement, respectivement pour des chaînes de traitement et pour des coffres ; Pandoc convertit localement l’export HTML, plus riche. Choisissez selon la destination du Markdown et la fréquence à laquelle vous ferez cela, testez avec une page portant un tableau, une image et un lien vers une autre page, et rappelez-vous que la seule facture envoyée par ces outils se règle en temps.

## FAQ

### Existe-t-il un convertisseur Notion vers Markdown réellement gratuit, sans essai ni quota ?

Oui, plusieurs. L’export Markdown & CSV de Notion est gratuit et intégré, un convertisseur en ligne qui fusionne l’export tourne localement sans limite par fichier, et `notion-to-md`, Obsidian Importer et Pandoc sont tous des logiciels libres gratuits. Les limites que vous rencontrerez sont celle de débit de l’API Notion et votre propre machine, pas une grille tarifaire.

### Quelle est la manière gratuite la plus rapide de convertir tout un espace de travail Notion ?

Exportez-le une fois en Markdown & CSV, puis convertissez l’archive en une étape plutôt que page par page. Un convertisseur en ligne qui fusionne produit un document unique avec un sommaire, sans renommage ni script ; si les pages doivent rester des fichiers séparés, prévoyez plutôt du temps pour la réécriture des identifiants, car c’est la partie qu’aucun outil gratuit ne fait automatiquement à votre place.

### Pourquoi mes noms de fichiers exportés contiennent-ils de longs codes apparemment aléatoires ?

Ce sont des identifiants de page : 32 caractères hexadécimaux que Notion utilise pour identifier une page, parce que les titres changent et ne sont pas uniques. L’export inscrit l’identifiant dans chaque nom de fichier et dans chaque lien entre pages : le retirer suppose donc de réécrire les deux ensemble à partir d’une seule table — ou de fusionner les pages en un document unique, où plus rien n’a besoin de se résoudre vers un nom de fichier.

### Puis-je convertir un export Notion sans le téléverser nulle part ?

Oui. Un convertisseur qui tourne dans le navigateur lit l’archive avec l’API de fichiers de la page elle-même et ne l’envoie jamais, ce que vous pouvez vérifier en ouvrant le panneau réseau et en regardant qu’il ne se passe rien. Les outils locaux en ligne de commande comme Pandoc, et le mode archive d’Obsidian Importer, ne touchent jamais au réseau.

### Convertir Notion en Markdown exige-t-il une offre Notion payante ?

Pas pour l’export Markdown & CSV. La page d’aide de Notion indique bien que « Include subpages » pour un export **PDF** exige une offre Business ou Enterprise (vérifié sur notion.com, le 14 septembre 2026) : vérifiez donc le format dont vous avez besoin plutôt que de supposer que tout le menu d’export se comporte pareil.

### Faut-il exporter en Markdown ou en HTML ?

Cela dépend de la suite. Le Markdown est le chemin le plus court si votre convertisseur le prend directement. La documentation d’Obsidian recommande plutôt le HTML, au motif que l’export Markdown de Notion omet des informations — donc si la fidélité compte plus que le confort, exportez en HTML et convertissez-le avec Pandoc ou un importateur qui l’attend.

### Les convertisseurs gratuits conservent-ils mes bases de données Notion ?

En partie, et les différences comptent. L’export Markdown de Notion écrit chaque base de données en pleine page sous forme de CSV à côté des pages ; un convertisseur en ligne qui fusionne transforme ces lignes en tableau à l’intérieur du même document ; Obsidian Importer préserve les bases de données sur sa voie API mais pas sur sa voie par archive. Aucun ne conserve les formules, les relations, les agrégats, ni aucune vue autre que celle exportée.
