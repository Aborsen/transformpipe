---
title: "JSON vers tableau Markdown : ce qui passe proprement et ce qui ne passe pas"
description: "Transformer du JSON en tableau Markdown : la seule forme qui marche, que faire de l'imbrication, des clés absentes et du JSON Lines, et quand préférer des sections"
date: 2026-09-02
tag: Conversion
keywords: json vers tableau markdown, convertir json en tableau markdown, tableau json vers markdown, json imbriqué en tableau markdown, json lines vers markdown, aplatir json jq, json vers tableau en ligne
---

### En bref

Un tableau Markdown est honnête vis-à-vis d'une seule forme de JSON : un tableau d'objets dont toutes les valeurs sont scalaires, avec les mêmes clés dans chaque enregistrement. Donnez-lui cela et n'importe quel convertisseur fera ce qu'il faut. Donnez-lui autre chose — un objet imbriqué, un tableau dans un champ, des enregistrements aux clés différentes — et l'outil doit choisir entre sérialiser du JSON dans une cellule, faire exploser le nombre de colonnes ou perdre des données, et il ne vous dira pas ce qu'il a choisi. Aplatissez délibérément avant de convertir, généralement avec `jq` ou `mlr`, ou acceptez que le rendu honnête soit des sections plutôt qu'un tableau.

Vous avez un fichier JSON et vous voulez un tableau. L'instinct est bon : un tableau est la forme lisible la plus dense pour des enregistrements, et un tableau Markdown survit au collage dans une pull request, un ticket, une page de wiki et un e-mail là où un bloc de code JSON n'y survit pas. Un tableau se parcourt du regard. Personne ne parcourt quatre cents lignes de JSON indenté.

Le problème, c'est que le modèle de données du JSON et celui d'un tableau n'ont pas la même forme, et ne se recouvrent que parfois. Un tableau est un rectangle : des colonnes fixes, une ligne par enregistrement, une valeur par cellule. Le JSON est un arbre, de profondeur quelconque, sans aucune obligation que des objets frères s'accordent sur quoi que ce soit. Chaque fois que l'arbre n'est pas déjà un rectangle, le transformer en rectangle jette quelque chose — et ce qui est jeté relève d'une décision que votre convertisseur prend en silence, dans les deux secondes entre le dépôt du fichier et la lecture de la sortie.

La question utile n'est donc pas « quel outil convertit du JSON en tableau Markdown ». Presque tous le font, et [le comparatif entre eux est un article à part](/blog/best-json-to-markdown-converters). La question utile est de savoir quelle est la forme de votre fichier, ce qu'un tableau fait à cette forme, et ce que vous devriez faire au fichier d'abord. C'est ce qui suit, cas par cas, avec les commandes.

## Pourquoi un tableau Markdown est une promesse sur les données

Quand vous remettez un tableau à quelqu'un, vous affirmez trois choses sans les dire. Chaque ligne est la même sorte de chose. Chaque colonne veut dire la même chose dans chaque ligne. Et chaque cellule contient une valeur.

Le JSON ne garantit aucune des trois. Un tableau peut contenir côte à côte une chaîne, un objet et un autre tableau. Deux objets d'un même tableau peuvent ne partager aucune clé. Un seul champ peut contenir un objet à douze clés. Quand l'une de ces choses est vraie et que vous produisez un tableau quand même, le tableau reste un tableau — il s'aligne, il a une ligne d'en-tête, il a l'air fini — et il pose désormais des affirmations que les données ne soutiennent pas. C'est pire qu'une sortie visiblement cassée, parce que personne ne vérifie un tableau qui s'affiche.

Voici la forme de l'échec en un exemple. Prenez un enregistrement comme celui-ci :

```json
{
  "id": 4102,
  "customer": { "name": "Ada Okonjo", "email": "ada@example.com" },
  "items": ["SKU-11", "SKU-40"],
  "discount": null,
  "note": "call before delivery | after 4pm"
}
```

Chaque mise en tableau naïve de cet enregistrement est fausse d'une façon différente. Mettez `customer` dans une cellule et la cellule contient `{"name":"Ada Okonjo","email":"ada@example.com"}`, c'est-à-dire du JSON qui se fait passer pour de la prose. Aplatissez-le et vous gagnez deux colonnes, `customer.name` et `customer.email`, ce qui est juste et fait commencer l'escalade du nombre de colonnes. Mettez `items` dans une cellule et vous avez joint une liste par des virgules, ce qui va très bien jusqu'à ce qu'un élément contienne une virgule. Laissez `discount` vide et le lecteur ne peut pas distinguer « aucune remise » de « champ absent ». Et `note` contient une barre verticale, qui dans un tableau Markdown termine la cellule — cette ligne a donc maintenant une colonne de plus que l'en-tête, et le moteur de rendu supprimera le surplus ou décalera tout ce qui suit.

Un enregistrement. Cinq façons distinctes pour un tableau d'être discrètement faux. Multipliez par le nombre d'enregistrements et vous obtenez un document qui a l'air de faire autorité et qui n'en a pas.

## Référence rapide : quelle forme de JSON devient quel Markdown

Voici l'aide-mémoire. Trouvez la forme de premier niveau de votre fichier dans la première colonne et le rendu qui ne ment pas dans la quatrième.

| Forme JSON | Ressemble à | Se met en tableau proprement ? | Rendu honnête | À faire d'abord |
| --- | --- | --- | --- | --- |
| Tableau d'objets plats, mêmes clés | `[{"id":1,"name":"a"},{"id":2,"name":"b"}]` | Oui | Tableau : les clés en colonnes, une ligne par objet | Rien |
| Tableau d'objets plats, clés différentes | `[{"id":1},{"id":2,"tier":"pro"}]` | Oui, avec des trous | Tableau avec l'union de toutes les clés, vides marqués | Collecter les clés sur tous les enregistrements, pas seulement le premier |
| Tableau d'objets avec un objet imbriqué | `[{"id":1,"user":{"name":"a"}}]` | Non | Tableau sur des colonnes `user.name` aplaties | Aplatir avec `jq`, `mlr flatten` ou `json_normalize` |
| Tableau d'objets avec un champ tableau | `[{"id":1,"tags":["x","y"]}]` | Non | Tableau plus une cellule jointe, ou une ligne par étiquette | Décider : joindre dans une cellule, ou éclater en lignes |
| Tableau de valeurs simples | `["admin","billing"]` | Non | Liste à puces | Rien — n'en faites pas un tableau |
| Tableau de tableaux | `[["a",1],["b",2]]` | Oui, sans en-tête | Tableau avec des en-têtes inventés ou la première ligne | Décider si la ligne un est une donnée ou un en-tête |
| Tableau de choses hétérogènes | `[1,"two",{"three":3}]` | Non | Une section numérotée chacune | Séparer par type, ou rendre en sections |
| Objet plat unique | `{"name":"a","tier":"pro"}` | Seulement en clé/valeur | Tableau à deux colonnes, ou étiquettes en gras | Rien, mais envisagez plutôt une liste de définitions |
| Objet unique profondément imbriqué | un fichier de configuration, une enveloppe d'API | Non | Des titres par niveau, un bloc de code au-delà du niveau trois | Trouver le tableau à l'intérieur et le mettre en tableau |
| Objet d'objets, indexé par identifiant | `{"u1":{...},"u2":{...}}` | Oui, après une étape | Tableau avec la clé comme première colonne | `to_entries` pour transformer les clés en champ |
| JSON Lines | une valeur JSON par ligne | Oui, si analysé par lignes | Tableau, une fois le fichier lu correctement | Dire à l'outil que c'est délimité par des lignes |
| Nombre, chaîne, booléen au premier niveau | `42` | Non | Une phrase | Rien à convertir |

Deux choses à remarquer. Seules trois lignes de ce tableau disent « oui » sans réserve, et les deux formes les plus courantes dans la réalité — objets imbriqués et champs tableaux — n'en font pas partie. Et la dernière colonne est là où se trouve le travail : la différence entre un bon et un mauvais tableau Markdown est presque toujours quelque chose que vous avez fait au JSON avant la conversion, pas le convertisseur que vous avez choisi.

## La forme vis-à-vis de laquelle un tableau est honnête

Un tableau d'objets, chaque valeur scalaire, les mêmes clés dans chaque enregistrement. C'est la forme que renvoie un point d'entrée d'API paginé, la forme que devient un CSV quand quelqu'un le convertit en JSON, et la forme que produit un `SELECT` sans jointures.

```json
[
  { "sku": "SKU-11", "name": "Wide flange", "price": 12.5, "stock": 40 },
  { "sku": "SKU-40", "name": "Narrow flange", "price": 9.0, "stock": 0 },
  { "sku": "SKU-72", "name": "Bracket", "price": 3.25, "stock": 118 }
]
```

Cela se convertit en ceci, et tous les outils s'accordent :

```markdown
| sku | name | price | stock |
| --- | --- | --- | --- |
| SKU-11 | Wide flange | 12.5 | 40 |
| SKU-40 | Narrow flange | 9 | 0 |
| SKU-72 | Bracket | 3.25 | 118 |
```

Remarquez que `9.0` est sorti en `9`. Les nombres JSON n'ont aucune notion de chiffres significatifs : un sérialiseur qui lit le fichier dans un type numérique et le réécrit vous donne donc la représentation la plus courte. S'il s'agit de prix dans un document que quelqu'un lira, c'est une contrariété cosmétique ; s'il s'agit d'un numéro de version ou d'une référence produit qui se trouvait être numérique, le zéro de tête ou de queue est perdu pour de bon. Un champ qui doit conserver sa forme imprimée exacte doit être une chaîne dans le JSON, et le convertisseur n'y peut rien après coup.

Voici les façons de faire cette conversion, avec la commande exacte :

| Voie | Commande ou étape | Exige |
| --- | --- | --- |
| Navigateur | Déposer le fichier `.json` sur une page de conversion et lire le tableau | Un navigateur |
| Miller | `mlr --ijson --omd cat data.json` | `mlr` installé |
| jtbl | `cat data.json \| jtbl -m` | Python, `pip install jtbl` |
| pandas | `pd.read_json("data.json").to_markdown(index=False)` | pandas et tabulate |
| jq, à la main | construire vous-même l'en-tête et les lignes avec `@tsv` et `sed` | `jq` et de la patience |
| Tableur | JSON vers CSV, ouvrir, copier, coller dans un éditeur qui connaît le Markdown | Un tableur |

**Pour qui :** pour quiconque dispose d'un export d'interface d'administration, d'un point d'entrée de liste ou d'un résultat de requête. Si votre fichier a cette forme, arrêtez de lire le reste de cette page et prenez la ligne ci-dessus qui demande le moins d'installations. Il n'y a aucune décision intéressante à prendre.

**Ce qu'il faut vérifier quand même :** les trois dernières lignes, pas les trois premières. La pagination fait que les enregistrements intéressants sont souvent à la fin, et un convertisseur qui lit le premier objet pour bâtir son en-tête aura abandonné tout champ n'apparaissant que plus tard.

## Les formes délicates, cas par cas

Tout ce qui suit est une forme où le tableau doit céder quelque chose. Pour chacune, il y a un rendu défendable, un rendu qui ne l'est pas, et une commande qui vous mène de l'un à l'autre.

### Un objet imbriqué dans un champ

```json
[
  { "id": 1, "user": { "name": "Ada", "city": "Leeds" }, "total": 42.0 },
  { "id": 2, "user": { "name": "Ben", "city": "Hull" }, "total": 18.5 }
]
```

Il y a exactement trois choses qu'un convertisseur peut faire de `user`, et il vaut la peine de savoir ce que fait le vôtre.

| Approche | Résultat | Coût |
| --- | --- | --- |
| Sérialiser l'objet dans la cellule | `{"name":"Ada","city":"Leeds"}` dans une cellule | Illisible, et un `"` ou un `\|` à l'intérieur casse la ligne |
| Aplatir en colonnes pointées | `user.name`, `user.city` | Le nombre de colonnes croît avec chaque clé imbriquée |
| Abandonner le champ | Tableau avec `id` et `total` seulement | Perte de données silencieuse, sans avertissement |

L'aplatissement est le bon choix par défaut, et la raison est arithmétique. Un enregistrement avec trois objets imbriqués de quatre clés chacun devient un tableau de quinze colonnes, lisible sur un écran large et illisible dans un commentaire de pull request. Aplatissez donc, puis sélectionnez : décidez lesquelles des colonnes aplaties vous voulez vraiment, et abandonnez les autres exprès plutôt que de laisser l'outil les abandonner par accident.

```bash
mlr --ijson --omd flatten data.json
```

Le verbe `flatten` de Miller transforme `user.name` en un champ portant ce nom, et `--omd` écrit un tableau Markdown. Pour choisir les colonnes ensuite, ajoutez un `cut` :

```bash
mlr --ijson --omd flatten then cut -o -f id,user.name,total data.json
```

**Pour qui :** pour les réponses d'API, qui enveloppent presque toujours les champs intéressants ou y attachent un enregistrement lié. C'est la forme réelle la plus courante, et celle où le comportement par défaut d'un convertisseur compte le plus.

### Un tableau dans un champ

```json
[
  { "id": 1, "tags": ["urgent", "billing"] },
  { "id": 2, "tags": [] }
]
```

Un tableau dans un champ est une relation un-à-plusieurs, et un tableau Markdown est un rectangle. Quelque chose doit plier.

| Approche | Résultat | Coût |
| --- | --- | --- |
| Joindre dans une cellule | `urgent, billing` | Une valeur contenant le séparateur devient ambiguë |
| Une colonne par position | `tags.0`, `tags.1`, `tags.2` | Nombre de colonnes fixé par le tableau le plus long ; surtout du vide |
| Une ligne par élément | `id` répété, une `tag` chacune | Le nombre de lignes se multiplie ; `id` n'est plus unique |
| Compter seulement | `tags` devient `2` | Perd les valeurs, garde la forme |

Joindre est ce que font la plupart des convertisseurs et c'est d'ordinaire juste pour la lecture, à condition que le séparateur soit un caractère que vos valeurs ne peuvent pas contenir. `; ` est plus sûr que `, `. Éclater en une ligne par élément est juste si le tableau doit être trié ou filtré par étiquette, et c'est ce que vous voulez si l'étape suivante est un tableur plutôt qu'un document. Les colonnes positionnelles n'ont presque jamais raison : elles transforment la position d'un élément en intitulé de colonne, et la position dans un tableau JSON ne porte aucun sens à moins que quelqu'un n'ait promis le contraire.

Pour joindre, en jq :

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json
```

Pour éclater, une ligne par étiquette :

```bash
jq '[.[] | . as $row | .tags[] | { id: $row.id, tag: . }]' data.json
```

Ce second filtre perd entièrement l'enregistrement au tableau vide, parce que `.tags[]` sur `[]` ne produit rien. S'il faut quand même une ligne pour un enregistrement sans étiquette, conservez-le explicitement :

```bash
jq '[.[] | . as $row | (if (.tags | length) == 0 then [null] else .tags end)[] | { id: $row.id, tag: . }]' data.json
```

C'est la forme de l'essentiel du travail d'aplatissement : trois lignes de jq pour préserver un cas que la version courte abandonne.

**Pour qui :** pour tout ce qui comporte des étiquettes, des rôles, des permissions, des catégories ou des lignes de commande. Si vous convertissez un export de commandes, les lignes de commande sont un tableau dans un champ et vous avez cette décision à prendre, que vous le remarquiez ou non.

### Des enregistrements aux clés différentes

```json
[
  { "id": 1, "email": "a@example.com" },
  { "id": 2, "phone": "+44 20 7000 0000" },
  { "id": 3, "email": "c@example.com", "phone": "+44 20 7000 0001" }
]
```

Un tableau a besoin d'un en-tête unique. Ces enregistrements ont trois jeux de clés différents entre eux : l'en-tête doit donc être leur union — `id`, `email`, `phone` — avec du vide là où un enregistrement ne porte pas un champ.

L'échec, ici, est précis et courant : un convertisseur qui bâtit son en-tête à partir du premier objet seulement. Cela produit un tableau à deux colonnes, et le numéro de téléphone de l'enregistrement 2 n'est nulle part dans le document. Pas d'erreur, pas d'avertissement, pas de trou dans le tableau qui saute aux yeux. C'est le comportement par défaut le plus dommageable de tout ce domaine, parce que la sortie a l'air complète.

Vérifiez-le en une commande. Demandez à jq l'union des clés et comptez les colonnes de votre sortie :

```bash
jq -r '[.[] | keys[]] | unique | join(",")' data.json
```

Si cette liste est plus longue que la ligne d'en-tête de votre tableau, votre convertisseur a lu le premier enregistrement et s'est arrêté. Changez d'outil, ou imposez la forme vous-même en donnant à chaque enregistrement toutes les clés :

```bash
jq --argjson cols '["id","email","phone"]' \
   '[.[] | . as $r | reduce $cols[] as $c ({}; .[$c] = ($r[$c] // null))]' data.json
```

Notez que `//` dans ce filtre est l'opérateur d'alternative de jq, pas un commentaire : il substitue la partie droite quand la gauche vaut `null` ou `false`. C'est un danger en soi — un champ dont la vraie valeur est `false` sera remplacé par `null`. Si vos données contiennent des booléens, utilisez plutôt une vérification explicite avec `has`.

| Approche | Résultat | Coût |
| --- | --- | --- |
| Union de toutes les clés | Chaque champ présent, du vide là où il manque | Tableau large, creux |
| Clés du premier enregistrement | Étroit, net, colonnes manquantes | Perte silencieuse de tout champ ultérieur |
| Clés présentes dans chaque enregistrement | Seulement les champs communs | Perd les différences, qui sont souvent le propos |
| Grouper par jeu de clés, un tableau chacun | Plusieurs tableaux honnêtes | Le lecteur doit les réconcilier |

**Pour qui :** pour les exports de tout ce qui comporte des champs facultatifs — un CRM, un produit de formulaires, un flux d'événements dont la charge varie selon le type. Si les enregistrements viennent de chemins de code différents, supposez que les jeux de clés diffèrent tant que vous n'avez pas vérifié.

### Un tableau de valeurs simples

```json
["admin", "billing", "read-only"]
```

C'est une liste. Rendue en tableau, elle devient une colonne unique avec un en-tête inventé, soit plus de balisage que de contenu et moins lisible que ne l'était le JSON. Rendue en liste à puces, elle est terminée :

```markdown
- admin
- billing
- read-only
```

Le seul cas qui justifie un tableau, c'est quand les valeurs sont des paires de quelque chose, et alors ce ne sont plus des valeurs simples. Si la liste est longue et ordonnée, une liste numérotée porte l'ordre qu'une liste à puces jette — [la différence entre une liste ordonnée et une liste à puces est elle aussi une affirmation sur les données](/blog/markdown-line-breaks-and-lists).

**Pour qui :** pour les énumérations, les jeux de permissions, les listes blanches. Presque jamais digne d'un convertisseur : un chercher-remplacer en fait une liste en moins de temps qu'il n'en faut pour ouvrir un outil.

### Un tableau de tableaux

```json
[
  ["sku", "name", "price"],
  ["SKU-11", "Wide flange", 12.5],
  ["SKU-40", "Narrow flange", 9.0]
]
```

C'est un CSV passé par un sérialiseur JSON, et cela se met parfaitement en tableau — avec une ambiguïté que rien dans le fichier ne résout. La première ligne est-elle un en-tête, ou une donnée qui y ressemble par hasard ? Le JSON n'a aucun moyen de le dire. Un convertisseur doit deviner, et les deux devinettes produisent des documents différents : l'un avec `sku | name | price` en en-tête, l'autre avec `Colonne 1 | Colonne 2 | Colonne 3` en en-tête et `sku` comme valeur de la première ligne.

Regardez le fichier et décidez, puis dites-le à l'outil. S'il ne veut rien entendre, ajoutez l'en-tête vous-même. Comme cette forme est en réalité de la donnée tabulaire déguisée en JSON, [la voie CSV est souvent plus courte](/blog/best-csv-to-markdown-converters) : convertissez le tableau de tableaux en CSV, et prenez un outil CSV vers Markdown doté d'une option d'en-tête explicite.

**Pour qui :** pour BigQuery et les résultats de requête similaires, les exports de tableur via une API JSON, tout ce où un champ `values` contient des lignes.

### Un tableau de choses hétérogènes

```json
[42, "pending", { "id": 7 }, [1, 2]]
```

Un tableau hétérogène n'est pas un ensemble d'enregistrements et aucun tableau ne le décrit. Le rendu honnête est une section numérotée par élément, chacune rendue selon son propre type — un nombre en phrase, un objet en petit tableau clé/valeur, un tableau imbriqué en liste.

Si un fichier vous donne cela au premier niveau, c'est en général un journal mixte ou une fixture assemblée à la main, et le bon premier geste est de filtrer sur le type qui vous intéresse :

```bash
jq '[.[] | select(type == "object")]' data.json
```

Vous avez maintenant un tableau d'objets et l'un des cas précédents s'applique.

**Pour qui :** presque personne exprès. Cela arrive dans les fixtures de test, dans les fichiers modifiés à la main, et dans les flux d'événements dont le producteur a changé de forme entre deux versions.

### Un objet unique qui n'est pas une liste du tout

Un fichier de configuration, une enveloppe d'API, un enregistrement récupéré par identifiant. Il n'y a pas de tableau dont faire des lignes : un tableau Markdown ne peut donc être qu'une liste clé/valeur à deux colonnes :

```markdown
| Field | Value |
| --- | --- |
| name | Wide flange |
| price | 12.5 |
```

C'est lisible pour une poignée de champs scalaires, sans intérêt au-delà d'une douzaine, et cela s'effondre entièrement dès qu'une valeur est imbriquée. Pour un enregistrement unique, des étiquettes en gras avec les valeurs à côté se lisent mieux que du mobilier de tableau, et l'imbrication devient des titres. Si l'objet est une enveloppe — `{"meta": {...}, "data": [...]}` — le tableau que vous voulez vraiment porte sur `.data`, et la première étape est de le dire :

```bash
jq '.data' response.json
```

**Pour qui :** pour quiconque a récupéré une chose plutôt qu'une liste. Cherchez un tableau interne avant d'accepter un tableau clé/valeur ; neuf fois sur dix la forme intéressante est un niveau plus bas.

## Aplatir d'abord : jq, et les fichiers qui ne sont pas une valeur JSON

Deux problèmes se dressent avant tout ce qui précède. Le fichier peut ne pas être une valeur JSON unique, et la forme peut ne pas être encore un rectangle. Les deux se règlent avant qu'aucun convertisseur ne voie les données, et les deux se règlent avec la même poignée de commandes.

**Le fichier est du JSON Lines.** Une valeur JSON par ligne, terminée par un retour à la ligne, sans tableau englobant. Chaque ligne est valide ; le fichier ne l'est pas, parce qu'une suite nue de valeurs n'est pas un document JSON. `JSON.parse` et `json.loads` échouent tous deux à la ligne 2, et le message d'erreur dit « jeton inattendu » plutôt que « ceci est du JSON Lines », si bien que les gens concluent que le fichier est corrompu. Il ne l'est pas. C'est la sortie normale d'un pipeline de journaux, de `docker logs`, d'un consommateur de file de messages, et de la plupart des points d'entrée d'export en masse.

Le remède est une option, et c'est une option différente dans chaque outil :

| Outil | Lire du JSON Lines | Écrire du JSON Lines |
| --- | --- | --- |
| jq | par défaut : lit un flux de valeurs | `jq -c` — compact, une valeur par ligne |
| jq, en tableau | `jq -s` ou `jq --slurp` | `jq -c '.[]'` |
| Miller | `mlr --ijsonl` | `mlr --ojsonl` |
| pandas | `pd.read_json(path, lines=True)` | `df.to_json(path, orient="records", lines=True)` |
| jtbl | lit une entrée délimitée par lignes telle quelle | sans objet |
| Bibliothèque standard Python | `json.loads` par ligne dans une boucle | `json.dumps` par ligne |

Le premier geste canonique sur un fichier `.jsonl` est donc d'en faire un tableau :

```bash
jq -s '.' events.jsonl > events.json
```

et le dernier geste canonique, si l'outil suivant veut des lignes, est de démonter le tableau avec `jq -c '.[]'`. Bon à savoir : `jq -s` lit tout le fichier en mémoire. Sur un journal de plusieurs gigaoctets c'est le mauvais outil, et Miller travaille en flux à la place — cela dit, un tableau d'un million de lignes n'est pas un document que quiconque lira : la vraie réponse pour un fichier de cette taille est de filtrer d'abord.

**La forme demande un aplatissement.** La fonction `flatten` de jq aplatit les *tableaux* imbriqués, pas les objets, ce qui surprend ceux qui s'y fient à cause du nom. Aplatir des objets en clés pointées se fait avec des chemins :

```bash
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]' data.json
```

Cela se lit ainsi : pour chaque enregistrement, trouver tout chemin qui se termine par un scalaire, transformer le chemin en chaîne pointée, l'apparier à la valeur située à ce chemin, et reconstruire l'enregistrement à partir de ces paires. `leaf_paths` vaut `paths(scalars)` ; `getpath` récupère une valeur par son chemin ; `from_entries` retransforme des paires clé/valeur en objet. La sortie est un tableau d'objets plats, la seule forme qui se met honnêtement en tableau, et vous pouvez la confier à n'importe quel convertisseur de l'aide-mémoire.

Deux réserves sur ce filtre. Les indices de tableau font partie de la clé : `tags` avec deux éléments produit donc `tags.0` et `tags.1` — le problème des colonnes positionnelles vu plus haut, revenu par la porte de service. Et un objet vide ou un tableau vide n'a aucun chemin de feuille : ces champs disparaissent donc entièrement de l'enregistrement aplati. Si l'une de ces deux choses compte, traitez les tableaux séparément avant l'aplatissement :

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json | \
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]'
```

**Les enregistrements sont indexés par identifiant plutôt que listés.** Une forme fréquente est un objet dont les clés sont des identifiants :

```json
{ "u1": { "name": "Ada" }, "u2": { "name": "Ben" } }
```

Il n'y a pas de tableau ici, mais il y en a un qui se cache. `to_entries` produit `[{"key":"u1","value":{...}}, ...]`, et une étape de plus promeut la clé en champ de l'enregistrement :

```bash
jq '[to_entries[] | { id: .key } + .value]' users.json
```

C'est maintenant un tableau d'objets plats avec `id` en première colonne, et l'identifiant qui faisait double emploi comme clé est une valeur comme une autre.

**En Python, `json_normalize` fait l'essentiel de tout cela en un appel.** `pd.json_normalize(records, sep=".")` aplatit les objets imbriqués en colonnes pointées ; `max_level` l'arrête à une profondeur donnée ; `record_path` et `meta` traitent le cas de l'éclatement, en prenant un tableau imbriqué comme source de lignes et en traînant les champs parents avec. Ensuite `to_markdown(index=False)` écrit le tableau, ce qui exige le paquet `tabulate` installé à côté de pandas. Les deux sont gratuits et open source, pandas sous BSD 3-clause et tabulate sous MIT.

**Pour qui est cette section :** pour quiconque convertit la même forme plus d'une fois. Un filtre jq dans un script shell est une étape de conversion que vous pouvez lire, relire et corriger. Une suite de clics, non.

## Là où le tableau ment, et ce que cela coûte

Supposons la forme correcte et l'aplatissement fait. Il reste un ensemble de façons dont un tableau Markdown trahit le JSON dont il vient, et aucune ne produit d'erreur.

**Une barre verticale dans une valeur coupe la cellule.** En GitHub Flavored Markdown, `|` délimite les cellules partout dans une ligne de tableau, y compris à l'intérieur de ce que vous entendiez comme du texte. `call before 4pm | or leave with neighbour` devient deux cellules, la ligne gagne une colonne, et le moteur de rendu abandonne le surplus ou désaligne le reste. L'échappement est une barre oblique inverse — `\|` — et c'est au convertisseur de l'appliquer. Testez-le : mettez une barre verticale dans une valeur, convertissez, et regardez. Ce n'est qu'un cas d'un problème plus large qu'il vaut mieux comprendre en entier, parce que [les tableaux cassent au passage d'un format à l'autre plus que tout le reste en Markdown](/blog/markdown-tables-that-survive-conversion).

**Un retour à la ligne dans une valeur ne peut pas être exprimé du tout.** Une ligne de tableau Markdown est une ligne. Une chaîne JSON peut contenir un `\n`, et le fait souvent — un champ de description, un message de journal, une adresse. Il n'existe pas de Markdown pour un saut de ligne dans une cellule ; la seule voie est un `<br>` littéral, c'est-à-dire du HTML brut dans votre Markdown, que tout moteur de rendu qui assainit supprimera. Les convertisseurs, selon les cas, émettent `<br>`, remplacent le retour à la ligne par une espace, ou émettent le retour à la ligne brut et cassent le tableau. Les trois sont défendables et un seul est ce que vous voulez : découvrez ce que fait le vôtre.

**Une cellule vide confond quatre faits différents.** `null`, une chaîne vide, une clé absente et `false` deviennent tous une cellule vide dans la plupart des convertisseurs. Dans un tableau de commandes, « aucune remise » et « le champ remise n'est pas présent dans cet enregistrement » sont deux affirmations différentes, et un lecteur ne peut pas retrouver laquelle depuis un blanc. Écrire un *null* en italique pour null, un tiret cadratin pour l'absence et laisser les chaînes vides réellement vides coûte trois lignes dans un convertisseur et épargne au lecteur d'avoir à deviner. Vérifiez ce que fait le vôtre sur un enregistrement que vous avez construit vous-même.

**Les valeurs longues détruisent la mise en page sans la casser.** Un blob base64, une trace d'appels, une colonne d'UUID par ligne : un tableau Markdown n'a pas de largeur de colonne, donc une valeur longue rend sa colonne aussi large qu'elle-même et comprime toutes les autres en une bande. Le tableau est valide et illisible. Le remède n'est pas dans le convertisseur : c'est de supprimer la colonne, ou de la tronquer exprès avec un marqueur, avant de convertir. `jq 'map(.token |= .[0:12] + "…")'` est plus laid que l'alternative, qui consiste à faire comme si le problème était de présentation.

**Les types ont disparu, et le document ne le dit pas.** Le Markdown n'a pas de types. Une fois converti, `"12.50"` et `12.5` sont tous deux le texte `12.5`, `true` est le mot true, et `2026-09-02T00:00:00Z` est une chaîne qui ressemble à une date pour une personne et à rien de particulier pour une machine. Cela convient à un document et disqualifie tout ce qui vient après. Si le destinataire doit calculer sur les nombres, envoyez le JSON ou un CSV et laissez-le l'analyser ; le tableau Markdown, lui, est fait pour être lu.

**L'ordre des lignes est celui du fichier.** Les tableaux JSON sont ordonnés et l'ordre a du sens : un convertisseur doit donc le préserver — mais rien ne le trie pour vous, et un tableau que personne n'a trié est un tableau en ordre d'insertion, ce qui est rarement l'ordre que veut un lecteur. Triez avant de convertir : `jq 'sort_by(.total) | reverse'` ne coûte rien et fait répondre le tableau à une question.

**L'ordre des colonnes est un accident.** Les objets JSON n'ont pas d'ordre de clés défini dans la spécification, même si toute implémentation pratique préserve l'ordre de lecture. Vos colonnes sortent donc dans l'ordre où le sérialiseur d'en face les a émises, ce qui veut dire que l'identifiant peut se retrouver en sixième colonne. Mettez les colonnes dans l'ordre dont un lecteur a besoin avec une sélection explicite — `mlr cut -o -f id,name,total` garde l'ordre que vous avez listé, et la construction d'objet de jq fait de même.

Le coût de tout cela, additionné, n'est pas que le tableau soit faux. C'est que le tableau a l'air juste. Une erreur d'analyse JSON vous arrête ; une ligne désalignée par une barre verticale non échappée part en production, est lue, est citée dans une décision, et se découvre six semaines plus tard.

## Quand un tableau est le mauvais rendu

Parfois, la réponse honnête est que les données ne sont pas tabulaires et qu'aucun aplatissement ne les rendra telles. Trois signes, et que faire à la place.

**Les colonnes sont plus nombreuses que les lignes.** Une réponse d'API unique aplatie en soixante clés pointées et un enregistrement n'est pas un tableau ; c'est un enregistrement, et un enregistrement se lit mieux en valeurs étiquetées qu'en rectangle de soixante colonnes que personne ne peut faire défiler. Rendez les champs scalaires en étiquettes grasses avec les valeurs à côté, et donnez à chaque section imbriquée son propre titre.

**Chaque ligne demande un paragraphe.** Si un champ est une description, un corps de commentaire, un diff ou un message de journal, et que le lecteur doit réellement le lire, une cellule de tableau est le mauvais contenant. Le rendu qui fonctionne est une section par enregistrement : un titre portant l'identifiant, les champs courts en liste compacte, et le champ long en paragraphe ou en bloc délimité à lui seul. C'est plusieurs fois plus long qu'un tableau et c'est la version que quelqu'un peut lire.

**La structure est l'information.** Dans un fichier de configuration, un arbre de permissions ou un graphe de dépendances, l'imbrication est ce que vous essayez de communiquer. L'aplatir en clés pointées transforme la structure en préfixes de chaînes et demande au lecteur de reconstituer l'arbre dans sa tête. Des titres pour les niveaux, des listes indentées pour les feuilles, et un bloc `json` délimité pour tout ce qui dépasse trois niveaux environ — assez profond pour voir la forme, assez plat pour que les titres veuillent encore dire quelque chose. Un bloc délimité portant une chaîne d'information `json` obtient en plus la coloration syntaxique dans la plupart des moteurs de rendu, ce qui travaille réellement pour la lisibilité ; [ce qu'est une chaîne d'information et ce que les moteurs de rendu en font](/blog/code-blocks-in-markdown) vaut la peine d'être su avant de compter dessus.

Ce rendu mixte — des tableaux là où les données sont rectangulaires, des listes là où c'est une suite, des titres là où c'est un arbre, des blocs de code là où c'est plus profond qu'un document ne devrait aller — est ce qu'un convertisseur JSON vers Markdown choisit réellement quand il convertit. C'est la raison pour laquelle [la conversion JSON vers Markdown de TransformPipe](/json-to-markdown) choisit un rendu par forme au lieu d'en imposer un, dans le navigateur, sans rien téléverser quand vous êtes déconnecté.

| Signal dans les données | Tableau ? | Meilleur rendu |
| --- | --- | --- |
| Beaucoup d'enregistrements, peu de champs scalaires | Oui | Tableau |
| Un enregistrement, beaucoup de champs | Non | Étiquettes en gras, titres pour les parties imbriquées |
| Un champ contenant de la prose | Non | Une section par enregistrement, la prose en paragraphe |
| Une imbrication profonde qui compte | Non | Des titres par niveau, un bloc délimité au-delà de trois |
| Une liste de valeurs simples | Non | Liste à puces ou numérotée |
| Des enregistrements de deux ou trois champs, par dizaines | Oui | Tableau, trié |

## Comment choisir le rendu

1. **Lisez les dix premières lignes du fichier avant d'ouvrir le moindre outil.** La forme de premier niveau décide de tout ce qui suit, et cela prend dix secondes : `head -c 400 data.json` vous dit si vous avez un tableau d'enregistrements ou une enveloppe imbriquée, et une enveloppe imbriquée veut dire que votre tableau porte sur un champ à l'intérieur plutôt que sur le fichier.
2. **Demandez-vous si le fichier est une valeur JSON ou une par ligne.** Se tromper là-dessus donne au mieux une erreur d'analyse et au pire le seul premier enregistrement. `head -n 3` et un coup d'œil pour voir si chaque ligne est un objet complet tranchent la question, et le remède est une option par outil.
3. **Aplatissez exprès, puis sélectionnez les colonnes exprès.** L'aplatissement automatique produit toutes les colonnes que les données peuvent donner, ce qui, pour de vrais enregistrements d'API, fait plus de colonnes qu'un document ne peut en contenir. Choisissez les colonnes et leur ordre explicitement, sinon le lecteur reçoit l'avis du sérialiseur au lieu du vôtre.
4. **Construisez l'enregistrement délicat et convertissez-le avant de faire confiance à l'outil.** Un enregistrement avec un null, une clé absente, un objet imbriqué, un champ tableau, une barre verticale dans une chaîne et un retour à la ligne dans une chaîne. Chaque échec de cette page se manifeste dans cette seule conversion, et les y trouver coûte deux minutes au lieu d'un rectificatif.
5. **Décidez si la sortie doit être lue ou traitée.** Un tableau Markdown est un document : les types ont disparu et rien ne peut le réanalyser sans risque. Si l'étape suivante est un tableur ou un script, convertissez en CSV et épargnez-vous l'aller-retour.
6. **Si les colonnes sont plus nombreuses que les lignes, arrêtez de faire un tableau.** Ce rapport est le signal le plus net que les données sont un enregistrement plutôt qu'une liste, et un enregistrement se rend en valeurs étiquetées. Forcer un rectangle à ce moment-là vous coûte la seule chose pour laquelle la conversion existait : que quelqu'un puisse la lire.

## Conclusion

Un tableau d'objets plats aux clés cohérentes se convertit en tableau Markdown sans décision et sans perte, et si c'est votre fichier, le choix de l'outil n'a presque aucune importance. Tout le reste est une décision que quelqu'un doit prendre : aplatir l'imbrication ou la rendre en sections, joindre le champ tableau ou l'éclater en lignes, prendre l'union des clés ou accepter les trous, et échapper les barres verticales avant qu'une valeur qui en contient une ne décale une ligne que personne ne relira. Prenez ces décisions vous-même avec `jq` ou `mlr` tant que les données sont encore du JSON, ou prenez un convertisseur dont les règles sont écrites, pour savoir ce qu'il a fait. La seule chose à ne pas faire est de confier un arbre à un rectangle en supposant que la sortie est vraie parce qu'elle s'aligne.

## FAQ

### Comment convertir un tableau JSON en tableau Markdown ?

Si chaque objet du tableau a les mêmes clés et que toutes les valeurs sont scalaires, n'importe quel convertisseur s'en sort : déposez le fichier sur un convertisseur de navigateur, lancez `mlr --ijson --omd cat data.json`, faites-le passer par `jtbl -m`, ou appelez `to_markdown(index=False)` sur un DataFrame pandas. Si les objets contiennent des objets ou des tableaux imbriqués, aplatissez-les d'abord, sinon certaines cellules contiendront du JSON sérialisé.

### Qu'arrive-t-il au JSON imbriqué dans un tableau Markdown ?

L'une de trois choses, selon l'outil : la valeur imbriquée est sérialisée dans une seule cellule, elle est aplatie en colonnes pointées comme `user.name`, ou elle est abandonnée. L'aplatissement est le seul des trois qui garde les données lisibles, et il fait croître le nombre de colonnes : aplatissez donc, puis sélectionnez les colonnes voulues au lieu de toutes les accepter.

### Comment traiter des enregistrements aux clés différentes ?

Bâtissez l'en-tête à partir de l'union des clés de tous les enregistrements, pas du premier. Vérifiez ce qu'a fait votre convertisseur avec `jq -r '[.[] | keys[]] | unique | join(",")'` et comparez cette liste à la ligne d'en-tête de votre sortie — si la sortie est plus courte, des champs d'enregistrements ultérieurs ont été abandonnés en silence.

### Puis-je faire un tableau Markdown à partir de JSON Lines ?

Oui, une fois que l'outil sait que le fichier est délimité par lignes. Miller le lit avec `--ijsonl`, pandas avec `lines=True`, et jq traite un flux de valeurs comme son entrée normale, si bien que `jq -s '.' events.jsonl` transforme le fichier en un tableau que tout autre outil acceptera. Un convertisseur sans indication échouera à la ligne 2 avec une erreur de syntaxe, qui se lit comme une corruption de fichier et n'en est pas une.

### Qu'est-ce qui casse un tableau Markdown engendré depuis du JSON ?

Les barres verticales et les retours à la ligne dans les valeurs de type chaîne. Une barre verticale termine une cellule partout où elle apparaît, donc une barre non échappée ajoute une colonne à cette ligne, et un retour à la ligne ne peut pas du tout être représenté dans une ligne de tableau. Un bon convertisseur échappe les barres en `\|` et remplace les retours à la ligne par `<br>` ou une espace ; testez les deux cas sur une valeur que vous maîtrisez avant de faire confiance à la sortie.

### Vaudrait-il mieux convertir le JSON en CSV ?

Si l'étape suivante est un tableur, un script ou quoi que ce soit qui analysera les données, oui — le CSV perd aussi les types mais il est au moins conçu pour être relu, alors qu'un tableau Markdown est un document sans analyseur fiable. Convertissez en Markdown quand une personne va le lire dans un ticket, une pull request ou une page.

### Pourquoi mon nombre a-t-il changé d'apparence après la conversion ?

Parce qu'il est passé par un type numérique JSON en chemin. `9.0` devient `9`, `007` devient `7` si c'était un nombre plutôt qu'une chaîne, et un flottant qui ne se représente pas exactement en binaire arrive avec les chiffres que le JSON a stockés. Tout champ dont la forme imprimée compte — une référence produit, une version, un prix à décimales fixes — doit être une chaîne dans les données source ; aucun convertisseur ne peut restituer un zéro qu'il n'a jamais reçu.
