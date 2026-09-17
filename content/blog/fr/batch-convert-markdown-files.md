---
title: "Convertir plusieurs fichiers Markdown d’un coup, sans mentir à votre build"
description: "Convertir un dossier de fichiers Markdown : jusqu’où va un glob, où doit atterrir la sortie, xargs et l’ordre, sauter les fichiers inchangés, des codes honnêtes"
date: 2026-08-12
tag: Automatisation
keywords: convertir plusieurs fichiers markdown, conversion markdown par lot, convertir un dossier de fichiers markdown, conversion markdown en masse, xargs markdown, makefile markdown vers html, build markdown incrémental, convertir markdown en ci
---

Convertir un fichier Markdown est un problème résolu. Déposez-le sur une page, ou tapez une commande, et vous avez du HTML. En convertir cent quarante, répartis dans onze répertoires dont quatre que personne n’a ouverts depuis la migration, est un autre travail — et ce n’est pas le même travail fait cent quarante fois.

Le convertisseur n’est presque jamais la pièce qui casse. Ce qui casse, c’est le glob qui a discrètement sauté un sous-répertoire, les deux fichiers `index.md` devenus un seul `index.html`, l’exécution parallèle dont le journal est quatre fichiers entrelacés, le build qui a annoncé un succès parce que seule la dernière conversion avait été vérifiée, et la tâche de dix-sept minutes qui a reconverti chaque fichier pour changer un paragraphe.

Chacune de ces défaillances est silencieuse. Un tableau Markdown qui n’a pas pu être analysé produit quand même du HTML. Un fichier que le glob n’a jamais atteint ne produit rien du tout, et rien ressemble exactement à rien d’anormal.

### En bref

Laissez le shell trouver les fichiers et laissez un petit script en convertir un seul, parce qu’une boucle que vous pouvez tester sur un chemin unique est une boucle que vous pouvez déboguer. Utilisez `find … -print0 | sort -z` plutôt qu’un simple glob `*.md` : un glob ne descend pas dans l’arborescence tant que vous n’avez pas activé `globstar`, il ignore les répertoires commençant par un point, il passe le motif littéral à votre convertisseur quand rien ne correspond, et il atteindra la limite de longueur des arguments avant qu’un grand dépôt ne le fasse. Construisez le chemin de sortie par expansion de paramètre pour que l’arborescence garde sa forme — `basename` écrase `docs/api/index.md` et `docs/guide/index.md` sur le même fichier, et le build se termine quand même par zéro. Décidez ensuite délibérément de deux choses : si un échec sur le quarantième fichier arrête l’exécution ou s’il est collecté puis signalé à la fin, et si vous voulez réellement beaucoup de pages ou un seul document, parce que fusionner est un autre travail dont la réponse est différente.

## Convertir un dossier est un autre travail

Une conversion unique a une entrée, une sortie et un résultat. Une conversion de dossier comporte cinq décisions qui n’existent pas pour un seul fichier, et la réponse par défaut à chacune est fausse assez souvent pour que cela compte.

**Quels fichiers.** « Tout le Markdown du dépôt » a l’air sans ambiguïté jusqu’au moment où vous l’écrivez. Est-ce que cela inclut `node_modules` ? Le répertoire `.github` ? Le `CHANGELOG.md` à la racine ? Une copie vendorisée de la documentation de quelqu’un d’autre ? Le répertoire en lien symbolique qui pointe vers une copie de travail voisine ? Chacun de ces cas est une vraie réponse à une vraie question, et votre glob va y répondre à votre place, sans le dire.

**Dans quel ordre.** L’ordre des fichiers n’a aucune importance quand chaque fichier devient sa propre page. Il en a toute une quand les fichiers deviennent un seul document, et il compte pour la reproductibilité dans les deux cas : un build dont le journal liste les fichiers dans un ordre différent à chaque exécution est un build que vous ne pouvez pas comparer.

**Où va la sortie.** À côté de l’entrée, ou dans une arborescence séparée. C’est la décision que les gens regrettent, parce que les deux fonctionnent à la première exécution et qu’une seule survit à une suppression, à un renommage ou à un lien relatif.

**Ce qui se passe quand un fichier échoue.** Deux cents fichiers, l’un d’eux mal formé. Arrêter, ou continuer et signaler ? Les deux se défendent. Le comportement par défaut — continuer et sortir avec zéro — ne se défend pas.

**À quelle fréquence.** Un dossier qui change une fois par semaine n’a pas besoin d’être reconverti chaque nuit, et un dossier converti dans une pull request ne devrait probablement convertir que ce que la branche a touché.

Remarquez que rien de tout cela ne concerne le convertisseur. Lequel vous utilisez est une question séparée, avec [son propre comparatif](/blog/best-markdown-to-html-converters), et chacune des approches ci-dessous fonctionne avec n’importe lequel d’entre eux, du moment que la commande prend un chemin d’entrée et un chemin de sortie et dit la vérité sur son code de sortie.

## Comparatif rapide : l’aide-mémoire

| Approche | Idéal pour | Tourne en parallèle | Peut faire échouer le build | Saute les fichiers inchangés |
| --- | --- | --- | --- | --- |
| Boucle `for` sur un glob | Un script court que quelqu’un modifiera l’an prochain | Non | Oui, avec `set -e`, dès le premier fichier fautif | Non |
| `find … -exec … +` | Une arborescence de profondeur inconnue aux noms pénibles | Non | Pas de façon fiable — le code de sortie n’est pas celui de la commande | Non |
| `find -print0 \| xargs -0 -P` | Des centaines de fichiers, et le temps d’horloge | Oui | Oui — code 123 si un fichier a échoué | Non |
| GNU parallel | Du travail parallèle dont la sortie doit rester ordonnée | Oui | Oui, avec `--halt now,fail=1` | Non |
| `make` avec une règle de motif | Un dossier dont la plupart des fichiers n’ont pas changé | Oui, avec `make -j` | Oui, s’arrête à la première recette en échec | Oui, à la date de modification |
| Un script Node ou Python | Une sortie que vous maîtrisez, habillage compris | Oui, avec une limite de concurrence | Seulement si vous fixez le code de sortie vous-même | Seulement si vous l’implémentez |
| Un appel API ou CLI par fichier | Un runner sans chaîne d’outils et sans installation | Oui, jusqu’à la limite de débit | Oui, par appel | Non |
| Un générateur de site statique | Navigation, recherche et liens entre documents | En interne | Oui | En général, via son propre cache |

Tous sont gratuits. Les outils du shell sont déjà sur la machine ; le reste porte les licences indiquées dans chaque section ci-dessous.

## Toutes les manières de lancer une conversion sur un dossier

### Une boucle `for` sur un glob — idéal pour un script que quelqu’un relira

La chose la plus courte qui fonctionne, et la version à écrire en premier, parce que vous pouvez la lire à voix haute.

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"
  output="${output%.md}.html"
  mkdir -p "$(dirname "$output")"
  bin/one.sh "$file" "$output"
done
```

| Avantages | Inconvénients |
| --- | --- |
| Lisible, et il est évident de voir ce qu’elle va faire | Séquentielle : le temps d’horloge est la somme de tous les fichiers |
| `set -e` fait du premier échec la dernière chose qui arrive | `globstar` est une option bash, donc `sh script.sh` change le comportement |
| Aucune dépendance au-delà du shell | Ignore les répertoires commençant par un point sauf si vous activez aussi `dotglob` |
| Le quoting est sous votre contrôle, en un seul endroit | Un glob assez gros pour dépasser la limite d’arguments échoue ici aussi |

**Prix :** gratuit ; bash est sous licence GPL et déjà installé.

**Détails techniques**

- `shopt -s globstar` fait que `**` traverse les séparateurs de répertoire ; sans cela, `**` se comporte exactement comme `*` et vos sous-répertoires sont ignorés en silence
- `shopt -s nullglob` fait qu’une correspondance vide s’étend à rien, au lieu de passer la chaîne littérale `docs/**/*.md` au convertisseur comme nom de fichier
- `${file#docs/}` retire la racine source ; `${output%.md}.html` remplace l’extension sans toucher aux noms de répertoires
- Lancez le script avec `bash script.sh`, jamais `sh script.sh` — `shopt` n’est pas portable, et un `sh` fourni par dash le refusera

**Pour qui ?** Pour les dépôts comptant quelques dizaines de fichiers, et pour quiconque a d’abord besoin que la personne suivante puisse modifier le script sans lire une page de manuel.

### `find … -exec … +` — idéal pour une arborescence de profondeur inconnue

`find` n’a besoin d’aucune option de shell pour descendre, se comporte pareil dans tous les shells, et se moque de ce que contiennent les noms de fichiers.

```bash
find docs -type f -name '*.md' -exec bin/one.sh {} +
```

| Avantages | Inconvénients |
| --- | --- |
| Récursion, filtrage et élagage dans une seule expression | La question du code de sortie est réellement trouble |
| Passe les noms en arguments : espaces et guillemets survivent | `-printf` et d’autres primaires utiles sont propres à GNU |
| `+` groupe les arguments, donc pas de dépassement de la limite de longueur | Ordre du répertoire, pas ordre trié |
| `-prune` exclut tout un sous-arbre à peu de frais | C’est au script de dériver lui-même le chemin de sortie |

**Prix :** gratuit ; GNU findutils est sous licence GPL, et un `find` BSD est livré avec macOS.

**Détails techniques**

- `-type f` exclut les répertoires qui se trouvent finir par `.md`, ce qui est plus rare qu’un lien symbolique vers l’un d’eux mais pas assez rare pour être ignoré
- `-exec cmd {} +` passe autant de chemins par invocation qu’il en tient ; `-exec cmd {} \;` lance un processus par fichier, ce qui est plus lent et plus simple à raisonner
- Avec `-exec … \;`, une commande en échec ne change pas du tout le code de sortie de `find` lui-même : une tâche construite ainsi ne peut pas signaler un échec de conversion. GNU `find` documente un code non nul quand une commande lancée avec `+` échoue, et les implémentations diffèrent — c’est la raison de déplacer la question du code de sortie vers `xargs`, où elle est écrite noir sur blanc
- `find docs -name node_modules -prune -o -type f -name '*.md' -print` est l’idiome pour exclure un sous-arbre ; `-not -path '*/node_modules/*'` donne le même résultat mais parcourt quand même l’ensemble
- `find` ne suit pas les liens symboliques sauf si vous passez `-L`, et passer `-L` sur une arborescence contenant un lien vers son propre parent bouclera jusqu’à la limite de profondeur

**Pour qui ?** Pour toute arborescence plus profonde qu’un niveau, et tout dépôt dont vous ne contrôlez pas personnellement les noms de fichiers.

### `find -print0 | xargs -0 -P` — idéal quand le compte se chiffre en centaines

La manière standard de faire tenir une conversion de dossier dans une fraction du temps, et le moment où vous cessez de pouvoir lire le journal de haut en bas.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 8 -n 1 bin/one.sh
```

| Avantages | Inconvénients |
| --- | --- |
| Du vrai parallélisme avec une seule option | La sortie des tâches concurrentes s’entrelace, ligne par ligne |
| Un code de sortie agrégé documenté : 123 si un fichier a échoué | `xargs` exécute directement : ni redirection ni globbing dans la commande |
| Séparation par NUL : tout nom de fichier légal survit | Les garanties d’ordre disparaissent sauf à trier d’abord et afficher ensuite |
| `-n` règle la taille des lots, ce qui compte pour les petits fichiers | La liste des échecs doit être collectée hors bande |

**Prix :** gratuit, sous licence GPL, partie de findutils.

**Détails techniques**

- `-print0` et `-0` utilisent NUL comme séparateur, le seul octet qu’un nom de fichier ne peut pas contenir — un saut de ligne dans un nom de fichier est légal et couperait sinon un chemin en deux
- `sort -z` trie des enregistrements séparés par NUL ; l’ordre propre de `find` est l’ordre du répertoire, qui n’est pas trié et n’est pas stable d’une machine à l’autre. Ajoutez `LC_ALL=C` si vous voulez le même ordre sur un runner que sur votre portable
- `xargs` sort avec 123 si une invocation est sortie entre 1 et 125, 124 si l’une est sortie avec 125, 125 si l’une a été tuée par un signal, 126 si la commande n’a pas pu être lancée et 127 si elle est introuvable. Ces cinq codes constituent tout le protocole de remontée d’erreurs : faites donc sortir votre script avec un code non nul et laissez l’agrégat parler
- `-P 0` lance autant de processus qu’il le peut ; `-P "$(nproc)"` est le choix habituel sous Linux, et macOS veut `sysctl -n hw.ncpu` à la place
- `xargs` ne lance pas de shell. `xargs -0 cmd > out.html` redirige toute l’exécution dans un seul fichier, pas un fichier par entrée ; s’il vous faut une redirection, mettez-la dans le script
- `-n 1` démarre un processus par fichier. Pour un millier de petits documents, le démarrage du processus domine la conversion elle-même, et `-n 20` avec un script qui boucle sur `"$@"` est nettement meilleur — mesurez sur votre propre arborescence plutôt que de vous fier à un ratio

**Pour qui ?** Pour les ensembles de documentation qui se comptent en centaines, et tout build où la conversion est devenue l’étape lente.

### GNU parallel — idéal quand une sortie parallèle doit rester ordonnée

`parallel`, c’est `xargs` avec l’ergonomie complétée : sortie ordonnée, politique d’échec, exécution à blanc et affichage de la progression.

```bash
find docs -type f -name '*.md' -print0 \
  | parallel -0 -k --halt now,fail=1 bin/one.sh {}
```

| Avantages | Inconvénients |
| --- | --- |
| `-k` met chaque tâche en tampon et affiche dans l’ordre d’entrée | Une installation de plus, et elle n’est pas là par défaut |
| `--halt now,fail=1` arrête l’exécution au premier échec | Sa syntaxe de quoting et de substitution est un langage à part entière |
| `--dry-run` affiche les commandes sans les exécuter | La mise en tampon qui préserve l’ordre coûte de la mémoire et du disque |
| `--joblog` enregistre le statut et la durée de chaque tâche | Démesuré quand rien ne lit la sortie standard |

**Prix :** gratuit, sous licence GPL.

**Détails techniques**

- `-k` (`--keep-order`) est l’option qui le sépare de `xargs` : les tâches tournent toujours en parallèle, la sortie reste lisible
- `--halt` prend une politique — arrêter tout de suite ou quand les tâches en cours se terminent, sur un nombre ou un pourcentage d’échecs
- `--joblog FICHIER` est la réponse honnête à « quel fichier a échoué ? » : un tableau donnant le code de sortie de chaque tâche, que vous pouvez filtrer après coup au lieu de lire le journal
- `{.}` retire l’extension de la chaîne de substitution, `{//}` donne le répertoire — utile, et un dialecte de plus à retenir
- Il affiche une demande de citation dans les travaux universitaires, ce qui n’est pas une restriction de licence mais surprend bel et bien la première fois que cela apparaît dans un journal de build

**Pour qui ?** Pour les builds où la conversion affiche quelque chose qu’un humain lit, et pour quiconque veut un tableau de statut par tâche sans avoir à l’écrire.

### `make` avec une règle de motif — idéal quand la plupart des fichiers n’ont pas changé

Le seul outil de cette liste conçu exactement pour ce problème : un ensemble de sorties dérivées d’un ensemble d’entrées, reconstruites quand l’entrée est plus récente.

```make
MD  := $(shell find docs -type f -name '*.md')
OUT := $(patsubst docs/%.md,build/%.html,$(MD))

build/%.html: docs/%.md tools/wrapper.html
	@mkdir -p $(@D)
	bin/one.sh $< $@

.PHONY: all clean
all: $(OUT)

clean:
	rm -rf build
```

| Avantages | Inconvénients |
| --- | --- |
| Ne convertit que ce qui a changé, sans cache à vous | Les recettes doivent être indentées par une tabulation, pour toujours |
| `make -j8` parallélise gratuitement, en respectant les dépendances | Les noms de fichiers avec des espaces sont de fait non pris en charge |
| Un gabarit modifié invalide toutes les sorties, correctement | Les dates de modification sont fausses dans un clone frais |
| `make clean` et `make one/file.html` viennent sans effort | La syntaxe ne ressemble à rien d’autre dans le dépôt |

**Prix :** gratuit ; GNU make est sous licence GPL.

**Détails techniques**

- `tools/wrapper.html` à droite des deux-points est la partie que les gens omettent. Sans elle, modifier le gabarit ne change rien, parce que chaque sortie reste plus récente que son propre Markdown
- `$(@D)` est le répertoire de la sortie, donc `mkdir -p $(@D)` crée l’arborescence au fur et à mesure
- `$(shell find …)` s’exécute à chaque invocation de make : un fichier nouvellement ajouté est donc pris en compte sans toucher au Makefile
- `make -j` sans nombre lance un nombre illimité de tâches, ce qui, sur une grande arborescence, démarrera des centaines de processus d’un coup ; donnez-lui un nombre
- Ajouter le convertisseur lui-même comme prérequis — un fichier de verrouillage, un binaire épinglé, un fichier d’empreinte de version — fait qu’une mise à jour reconstruit tout, ce que vous voulez et que personne ne fait

**Pour qui ?** Pour les dépôts dont l’arborescence de documentation est grande et surtout statique, et où une conversion complète dure assez longtemps pour que quelqu’un l’ait remarqué.

### Un script Node ou Python — idéal quand vous voulez aussi l’habillage

À un certain point, le shell cesse d’être le bon endroit : vous voulez que le `<title>` du document de sortie vienne du frontmatter du fichier, ou un sommaire, ou un lien réécrit de `.md` vers `.html`. C’est un programme, pas un pipeline.

```js
// convert-all.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import fg from 'fast-glob';
import pLimit from 'p-limit';

const files = await fg('**/*.md', { cwd: 'docs', dot: false, absolute: true });
const limit = pLimit(8);
const failures = [];

await Promise.all(
  files.map((file) =>
    limit(async () => {
      try {
        const output = resolve('build', relative(resolve('docs'), file)).replace(/\.md$/, '.html');
        await mkdir(dirname(output), { recursive: true });
        await writeFile(output, render(await readFile(file, 'utf8')));
      } catch (error) {
        failures.push(`${file}: ${error.message}`);
      }
    })
  )
);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
```

| Avantages | Inconvénients |
| --- | --- |
| La sortie est un document que vous avez conçu, pas un fragment | Il est à vous, bogues compris |
| Frontmatter, titres et réécriture des liens sont tous accessibles | Un arbre de dépendances à épingler et à auditer |
| Les échecs s’accumulent en une liste plutôt qu’en une ligne de journal | La concurrence, c’est à vous de la borner |
| Tourne pareil sur toutes les plateformes, ce que le shell ne fait pas | Démarrage plus lent qu’un binaire C ou Rust |

**Prix :** gratuit ; `fast-glob` et `p-limit` sont sous licence MIT.

**Détails techniques**

- `pLimit` n’est pas facultatif. Un `Promise.all` sur trois mille fichiers ouvre trois mille descripteurs de fichiers et le processus meurt avec `EMFILE`, ce qui se lit comme un système de fichiers corrompu alors que ce n’en est pas un
- `process.exitCode = 1` plutôt que `process.exit(1)`, pour que les écritures en attente s’achèvent avant que le processus ne parte
- `dot: false` est la valeur par défaut dans la plupart des bibliothèques de glob, ce qui veut dire que `.github/CONTRIBUTING.md` est invisible tant que vous ne dites pas le contraire — le même piège que tend le shell, posé ailleurs
- Collecter les échecs et les signaler à la fin est un choix : cela convertit tout et fait quand même échouer la tâche. L’alternative, lever une erreur au premier échec, laisse l’arborescence de sortie à moitié écrite

**Pour qui ?** Pour tout dépôt où le HTML doit avoir l’air fini, et toute conversion qui a besoin de savoir quelque chose du document plutôt que de ses seuls octets.

### Un appel API ou CLI par fichier — idéal quand rien n’est installé

Si le runner n’a pas de convertisseur et que vous n’allez pas lui en donner un, la boucle a la même forme et le corps est un appel réseau. Le CLI sans dépendances de TransformPipe en est un exemple ; un post `curl` vers n’importe quelle API de conversion est la même idée avec plus d’options.

```bash
find docs -type f -name '*.md' -print0 \
  | sort -z \
  | xargs -0 -P 4 -n 1 -I {} tp push {} --share --json
```

| Avantages | Inconvénients |
| --- | --- |
| Aucun convertisseur à installer, à épingler ou à mettre en cache | Exige le réseau : ce ne peut donc pas être votre build hors ligne |
| Chaque fichier revient sous forme de lien que quelqu’un peut ouvrir | Exige un secret dans l’environnement |
| Le comportement de conversion ne peut pas dériver avec une installation locale | Les limites de débit et de taille s’appliquent par clé |
| La même conversion en intégration continue que sur un portable | Un document par fichier, cela s’additionne face au quota du compte |

**Prix :** gratuit ; convertir et télécharger ne demandent aucun compte, et un compte ajoute l’historique, le partage et l’API dans les limites ci-dessous (vérifié sur transformpipe.com, le 8 septembre 2026).

**Détails techniques**

- Les limites publiées sont celles à anticiper : 10 Mo pour un fichier à convertir, 4 Mo pour un document conservé dans un compte, 100 Mo et 500 documents par compte, et 60 requêtes par minute comptées par clé (vérifié sur transformpipe.com/docs, le 8 septembre 2026)
- Cette limite de débit est la raison de `-P 4` et non de `-P 32`. Huit ouvriers parallèles sur une connexion rapide épuiseront soixante requêtes en bien moins d’une minute et commenceront à collecter des 429, et un 429 est un échec que votre script doit traiter comme tel
- `--retry 3 --retry-connrefused` sur `curl`, ou une pause entre les lots, couvre l’échec transitoire qui casserait sinon un build par mois
- Si vous postez avec `curl` plutôt qu’avec un CLI, `-f` est porteur : sans lui, `curl` sort avec zéro sur un 401 ou un 429 et écrit le corps de l’erreur dans votre fichier de sortie
- Cent fichiers, cela fait cent documents et cent liens. Ce n’est généralement pas ce que quiconque voulait, sujet d’une section plus loin

**Pour qui ?** Pour les runners verrouillés, et les chaînes dont la sortie est un ensemble de liens plutôt qu’un ensemble de fichiers. Pour une pull request en particulier, [une action fait la même chose sans rien installer sur le runner](/blog/publish-markdown-from-github-actions).

### Un générateur de site statique — la réponse quand « beaucoup de fichiers » veut dire « un site »

Hugo, Eleventy, MkDocs, Docusaurus et Jekyll convertissent tous des répertoires de Markdown en HTML, et aucun d’eux n’est un convertisseur par lot. Ce sont des systèmes de build, et la différence se voit dans ce qu’ils vous rendent.

| Avantages | Inconvénients |
| --- | --- |
| Navigation, recherche, liens croisés et une page d’index | Un fichier de configuration, un thème et une étape de build à maintenir |
| Leurs propres builds incrémentaux et modes de surveillance | La sortie est un site, pas un ensemble de documents que vous pouvez envoyer par courriel |
| Vérification des liens et taxonomie sur l’ensemble | Une charge démesurée pour quarante fichiers que personne ne parcourt |
| Le déploiement est un problème résolu pour tous | C’est le thème qui décide de quoi vos pages ont l’air |

**Prix :** gratuit, tous open source.

**Pour qui ?** Pour quiconque publie des documents qui se lient entre eux et doivent être trouvés. Si votre lecteur arrive avec une URL que vous lui avez donnée et repart après une page, vous n’avez pas besoin d’un générateur.

## Les six choses qui cassent sur un dossier et pas sur un fichier

Chacune des défaillances ci-dessous a été diagnostiquée comme un bogue du convertisseur par quelqu’un. Aucune n’en est un.

### Jusqu’où descend un glob, et ce qu’il laisse tomber

`docs/*.md` ne descend pas dans l’arborescence. C’est de loin le bogue de conversion par lot le plus fréquent, et il est invisible : la tâche convertit les neuf fichiers du haut de l’arborescence, sort avec zéro, et les quarante des sous-répertoires ne sont tout simplement pas mentionnés. Rien ne vous prévient, parce que rien ne sait ce que vous vouliez dire.

Bash a besoin de `shopt -s globstar` avant que `**` ne traverse un séparateur de répertoire ; sans cela, `docs/**/*.md` est exactement `docs/*/*.md` — un niveau en dessous, ni plus ni moins. zsh a le `**` récursif sans option, ce qui explique qu’une ligne copiée depuis l’historique zsh d’un collègue se comporte différemment dans votre script bash sans qu’aucun de vous deux ne voie pourquoi.

Il y a ensuite les fichiers qu’un glob refuse de faire correspondre par principe :

| Ce qui est ignoré | Pourquoi | Le remède |
| --- | --- | --- |
| `.github/CONTRIBUTING.md` | Les globs ne correspondent pas à un point initial | `shopt -s dotglob`, ou nommer le chemin |
| `docs/api/reference.md` | `*` ne traverse pas `/` | `globstar` et `**`, ou `find` |
| `README.MD` | Correspondance sensible à la casse sous Linux, pas sous macOS | `find … -iname '*.md'` |
| `notes.markdown` | Une autre extension est un autre motif | `-name '*.md' -o -name '*.markdown'` |
| Tout, quand rien ne correspond | Bash laisse passer le motif tel quel | `shopt -s nullglob` ou `failglob` |
| Rien du tout, dans `node_modules` | Le glob était trop généreux | `-prune`, avant que le parcours n’y arrive |

La dernière ligne est la défaillance inverse, et elle est pire qu’elle n’en a l’air. Un `**/*.md` à la racine du dépôt atteint chaque README vendorisé de chaque paquet installé, et une conversion par lot qui se met à produire du HTML pour le changelog d’une dépendance est une conversion qu’on supprimera discrètement une semaine plus tard.

Il existe aussi une limite dure. Chaque chemin auquel un glob s’étend devient un argument, et la taille totale de la liste d’arguments est plafonnée par le noyau — `getconf ARG_MAX` en affiche le nombre. Un dépôt assez gros pour la dépasser échoue avec `Argument list too long`, un vrai message d’erreur qui sonne comme un bogue dans votre script. `find … -exec … +` et `xargs` groupent tous deux les arguments pour rester sous la limite, et ni l’un ni l’autre n’étend quoi que ce soit dans le shell — c’est pourquoi tous les exemples ci-dessus passent par un tube plutôt que par un glob dès que le compte est inconnu.

Les liens symboliques méritent une phrase de réflexion délibérée plutôt qu’un comportement par défaut. Que le `**` d’un shell descende ou non à travers un répertoire lié a varié entre les versions et diffère d’un shell à l’autre : si votre arborescence contient des liens — un `docs/shared` pointant vers une copie de travail voisine est un montage courant —, utilisez `find` et décidez explicitement, avec `-L` ou sans. Deviner, c’est accepter que le même dépôt convertisse un ensemble de fichiers différent sur deux machines.

### L’ordre dans lequel les fichiers arrivent

`find` renvoie les entrées dans l’ordre du répertoire. L’ordre du répertoire est ce que le système de fichiers veut bien rendre, il n’est pas trié, et il n’est pas le même sur deux machines portant les mêmes fichiers. Pour une conversion où chaque fichier devient sa propre page, c’est inoffensif. Cela cesse de l’être en trois endroits.

Les journaux cessent d’être comparables. Quand la liste des fichiers d’un build est dans un ordre différent à chaque exécution, vous ne pouvez pas comparer deux exécutions pour voir ce qui a changé, et c’est exactement cette comparaison que vous voulez d’abord quand une tâche nocturne casse.

L’ordonnancement parallèle cesse d’être reproductible. Avec huit ouvriers et sans tri, la répartition des fichiers entre les ouvriers change d’une exécution à l’autre, et avec elle celui qui touche la limite de débit.

Et la concaténation devient fausse plutôt que simplement brouillonne. Dès que plusieurs fichiers deviennent un seul document, l’ordre est du contenu. Même trié, `10-api.md` vient avant `2-setup.md`, parce qu’un tri lexical n’est pas un tri numérique. Complétez les nombres par des zéros — `02-setup.md`, `10-api.md` — et tout outil qui lira un jour ce répertoire aura le bon ordre gratuitement.

```bash
find docs -type f -name '*.md' -print0 | LC_ALL=C sort -z
```

`LC_ALL=C` compte plus qu’il n’y paraît. L’ordre de tri dépend de la locale : un nom portant un accent ou un tiret bas initial peut donc se trier autrement sur un runner que sur votre portable, et tout l’intérêt de figer l’ordre était d’empêcher cela.

### À côté de l’entrée, ou dans sa propre arborescence

Il y a deux réponses, et elles ne sont pas équivalentes.

| | Sortie à côté de l’entrée | Sortie dans une arborescence séparée |
| --- | --- | --- |
| Liens relatifs entre documents | Continuent de fonctionner sans changement | Ne fonctionnent que si la forme de l’arborescence est préservée |
| Images à chemins relatifs | Se résolvent comme avant | Demandent une copie ou un embarquement |
| Nettoyage | Supprimer les fichiers selon un motif, prudemment | `rm -rf build` |
| Un `.md` supprimé | Laisse un `.html` orphelin derrière lui, indéfiniment | Disparaît au prochain build propre |
| Gestion de versions | Des entrées `.gitignore` qui se battent avec les fichiers source | Un seul répertoire ignoré |
| Relire la modification | Du HTML généré dans chaque diff | Rien de généré dans le diff |
| Déploiement | Livrer tout le dépôt, ou le filtrer | Pointer l’hébergeur sur un seul répertoire |

À côté de l’entrée gagne sur les liens et les images, et perd sur tout le reste. La ligne de l’orphelin est celle qui tranche pour la plupart des gens : rien, dans un schéma à côté de l’entrée, ne remarque que `docs/old-api.md` a été supprimé ; `docs/old-api.html` reste donc sur le disque, se fait committer, se fait déployer, et est encore servi à quelqu’un un an plus tard. Une arborescence séparée que l’on supprime et reconstruit ne peut pas avoir ce problème, parce que la réponse à « quelles sorties sont périmées ? » est « toutes, à chaque fois ».

Si vous utilisez une arborescence séparée, gardez-en la forme, et faites-le par expansion de paramètre plutôt qu’avec `basename`. `basename` est le mauvais outil ici, et il échoue de la pire manière possible : `docs/api/index.md` et `docs/guide/index.md` deviennent tous deux `index.html`, le second écrase le premier en silence, le build sort avec zéro, et quelle page survit dépend de l’ordre dans lequel les fichiers sont arrivés — lequel, d’après la section précédente, n’est pas fixé.

La réécriture des liens est la partie qui n’a pas de solution en shell. Un lien vers `../guide/index.md` dans votre Markdown survit à la conversion seulement si l’arborescence de sortie reflète celle d’entrée et si le `.md` de la cible est réécrit en `.html`. Les convertisseurs ne le font pas par défaut ; la plupart laissent le lien exactement tel qu’il est écrit, pointant vers un fichier qui n’est plus à côté de la page. C’est un programme, pas un pipeline — et [ce qui casse quand un document se déplace](/blog/images-and-links-that-still-work) vaut aussi pour chaque chemin d’image du dossier.

### Le parallélisme, et l’ordre auquel vous renoncez

Une conversion, c’est peu de travail par fichier et un lancement de processus par fichier. Cela en fait une charge presque idéalement parallèle, et l’accélération obtenue par `-P` est réelle. Ce que vous échangez contre elle, c’est toute garantie d’ordre que vous aviez.

La sortie standard s’entrelace. Pas par tâche — par écriture. Deux convertisseurs qui affichent un avertissement de trois lignes au même instant produisent six lignes dans un ordre qu’aucun des deux n’a choisi, et un journal pareil ne se lit pas. Si les tâches affichent quoi que ce soit, utilisez soit `parallel -k`, soit faites écrire à chaque tâche son propre fichier de journal et concaténez-les ensuite dans l’ordre trié.

L’état partagé ne fonctionne pas comme il en a l’air. Chaque invocation de `xargs` est un processus distinct : un compteur incrémenté dans la boucle est incrémenté dans un sous-shell et disparaît. Ajouter les échecs à un fichier commun fonctionne mais demande de la prudence quant à l’entrelacement ; la version où il n’y a rien à réfléchir est un petit fichier par échec dans un répertoire, comptés à la fin :

```bash
# in bin/one.sh
if ! convert "$1" "$2"; then
  mkdir -p build/.failed
  printf '%s\n' "$1" > "build/.failed/$(printf '%s' "$1" | tr / _)"
  exit 1
fi
```

Plus d’ouvriers n’est pas monotoniquement mieux. Passé le point où les processeurs sont occupés, des processus supplémentaires n’ajoutent que de la contention ; et si le corps de votre boucle est un appel réseau, des ouvriers supplémentaires ajoutent des 429. Quatre requêtes simultanées contre une limite de soixante par minute, c’est confortable. Trente-deux, c’est un test de limite de débit avec un build accroché derrière.

La taille des lots est le paramètre que l’on oublie. `-n 1` démarre un processus par fichier, et pour de petits documents le lancement du processus peut coûter plus cher que la conversion. Un script qui boucle sur `"$@"` et qu’on invoque avec `-n 20` démarre vingt fois moins de processus. Si cela aide dépend de vos fichiers et de votre convertisseur : chronométrez donc les deux — et chronométrez-les deux fois, parce que la première exécution lit à froid et la seconde depuis le cache de pages, une différence assez grande pour renverser une conclusion.

### Les fichiers qui n’ont pas changé

Reconvertir cent quarante fichiers pour corriger une coquille se défend sur un portable et ne se défend pas dans une tâche qui tourne à chaque poussée. Il y a trois façons de sauter ceux qui n’ont pas changé, et elles échouent différemment.

**La date de modification.** C’est ce que fait `make`, et à l’intérieur d’une copie de travail c’est exactement juste : vous modifiez un fichier, sa mtime bouge, la règle se déclenche. Le piège, c’est que git n’enregistre pas les dates de modification. Un clone frais ou une extraction après échec de cache estampille chaque fichier à l’heure de l’extraction : sur un runner d’intégration continue, chaque fichier a donc l’air plus récent que chaque sortie et toute l’arborescence se reconstruit. Les builds incrémentaux fondés sur la mtime fonctionnent en local et ne font absolument rien en intégration continue, sauf si le répertoire de sortie est lui aussi restauré depuis un cache — et les sorties restaurées portent alors leurs propres horodatages, ce qui fait une deuxième chose à réussir.

**L’empreinte du contenu.** Plus lente à calculer et correcte partout, y compris dans un clone frais. Stockez l’empreinte de l’entrée à côté de la sortie et comparez avant de convertir :

```bash
# in bin/one.sh — $1 is the .md, $2 is the .html
stamp="$2.sha256"
now="$(sha256sum "$1" | cut -d' ' -f1)"

if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$now" ] && [ -s "$2" ]; then
  exit 0
fi

convert "$1" "$2" && printf '%s\n' "$now" > "$stamp"
```

`sha256sum` vient de GNU coreutils ; macOS veut `shasum -a 256`. Le test `[ -s "$2" ]` est là parce qu’une empreinte qui correspond à un fichier de sortie de zéro octet est une entrée de cache pour une exécution ratée, et un cache qui se souvient des échecs est pire que pas de cache du tout.

**Demander à git ce qui a changé.** La moins chère des trois quand la réponse est courte, et la seule qui tienne l’échelle d’un gros monodépôt :

```bash
git diff --name-only --diff-filter=ACMR origin/main...HEAD -- '*.md'
```

`--diff-filter=ACMR` exclut les suppressions : un fichier retiré ne devient donc pas un chemin que votre convertisseur est prié d’ouvrir. Cela réclame de l’historique — un clone superficiel n’a aucun commit de base auquel se comparer —, et c’est le marché : `fetch-depth: 0` coûte du temps d’extraction sur un dépôt qui a des années de commits.

Quelle que soit votre préférence, une règle vaut pour les trois : la clé de cache doit contenir tout ce dont la sortie dépend, pas seulement le Markdown. Changez votre habillage HTML, votre feuille de style ou la version du convertisseur, et chaque sortie est périmée alors que chaque entrée est inchangée. Faites entrer le gabarit dans l’empreinte, ajoutez-le comme prérequis dans le Makefile, ou acceptez que la première personne à modifier la feuille de style passe un après-midi à se demander pourquoi la page n’a pas changé.

### Les codes de sortie, et ce que « ça a marché » veut dire pour deux cents fichiers

Pour un fichier, le succès est sans ambiguïté. Pour deux cents, « est-ce que ça a marché ? » a trois réponses possibles et vous devez en choisir une avant d’écrire le script.

**S’arrêter au premier échec.** `set -euo pipefail` et une boucle toute simple. L’arborescence de sortie reste convertie à moitié, ce qui convient s’il s’agit d’un répertoire de build que vous supprimez de toute façon, et le journal s’arrête au fichier qui a cassé — le diagnostic le plus rapide possible.

**Tout convertir, échouer à la fin.** Plus utile quand une personne attend, parce qu’une seule exécution vous parle des six fichiers cassés au lieu du premier. Il faut un accumulateur explicite, sans quoi `set -e` mettrait fin à l’exécution :

```bash
failed=0
for file in docs/**/*.md; do
  bin/one.sh "$file" "$(output_for "$file")" || failed=$((failed + 1))
done

if [ "$failed" -gt 0 ]; then
  echo "$failed files failed" >&2
  exit 1
fi
```

Notez le `|| failed=$(…)`. Sans lui, `set -e` se déclenche au premier fichier fautif et l’accumulateur ne tourne jamais. Avec lui, la boucle ne peut pas échouer — le `exit 1` explicite de la fin est donc la seule chose qui rende la tâche honnête, et supprimer ce bloc par mégarde produit un build qui passe toujours.

**Laisser l’exécuteur parallèle agréger.** `xargs` vous donne 123 quand une tâche a échoué, `parallel --joblog` vous donne un tableau disant laquelle. Les deux conviennent, et les deux dépendent du fait que votre script par fichier sorte réellement avec un code non nul, ce qui est la partie qui tourne mal : un convertisseur qui écrit une erreur sur la sortie d’erreur et sort avec zéro, un `curl` sans `-f`, ou un script qui attrape une exception, la journalise et rend la main normalement.

Trois vérifications valent la peine d’être ajoutées quelle que soit la forme retenue :

- [ ] Chaque sortie existe et n’est pas vide — `[ -s "$output" ]`, parce que plusieurs modes de défaillance produisent un fichier de zéro octet plutôt qu’aucun fichier
- [ ] Le nombre de sorties correspond au nombre d’entrées, affiché à la fin de l’exécution, parce qu’un glob qui a discrètement sauté un répertoire se voit ici et nulle part ailleurs
- [ ] Toute l’exécution est sous `set -euo pipefail`, et tout convertisseur derrière un tube est soit redirigé à la place, soit couvert par `pipefail`

La deuxième est l’assertion utile la moins chère de toute la chaîne. `find docs -name '*.md' | wc -l` face à `find build -name '*.html' | wc -l` tient en une ligne, et elle attrape la défaillance qu’aucun code de sortie ne signalera jamais : le fichier qui n’a jamais été converti parce que rien n’est jamais allé le chercher.

## Le faire en intégration continue sans convertir toute l’arborescence

Le coût d’installation d’un convertisseur est [une question que l’article sur la ligne de commande traite comme il faut](/blog/markdown-to-html-from-the-command-line). La question propre au lot est différente : quels fichiers, et comment les sorties ressortent.

Convertissez toute l’arborescence sur la branche par défaut, et seulement les fichiers modifiés sur une pull request. L’exécution complète est votre garantie que l’arborescence est convertible ; l’exécution sur la branche est le retour rapide, et elle a besoin de `fetch-depth: 0` pour que le diff ait une base à laquelle se comparer. Ajoutez un filtre `paths` sur `**.md` pour que la tâche ne se lance pas du tout sur une pull request qui n’a touché que du code.

Si les sorties valent la peine d’être conservées, téléversez-les comme artefact plutôt que de les committer. Du HTML généré dans une pull request rend chaque relecture deux fois plus longue et chaque fusion conflictuelle, et l’artefact expire tout seul.

Si vous committez malgré tout du HTML généré — certains dépôts le servent directement, et c’est un montage légitime —, ajoutez la vérification qui rend cela sûr :

```bash
npm run build:docs
git diff --exit-code -- build/
```

`--exit-code` fait échouer la tâche quand une régénération n’a pas été committée. Sans lui, le HTML committé s’écarte du Markdown une fusion hâtive à la fois, et personne ne s’en aperçoit avant qu’un lecteur ne remarque que la page contredit la source.

Mettez en cache sur une clé dérivée des entrées — GitHub Actions a `hashFiles('**/*.md')` exactement pour cela — et pensez à inclure votre gabarit et votre fichier de verrouillage dans la clé. Un cache indexé sur le seul Markdown vous servira du HTML périmé après un changement de feuille de style, le résultat le plus déroutant possible et le plus difficile à attribuer.

Deux choses plus petites. Ne découpez en matrice que si la conversion est vraiment l’étape lente : huit tâches parallèles ayant chacune son extraction et son installation prennent souvent plus de temps au total qu’une tâche avec `xargs -P 8`. Et gardez explicite le shell du runner — GitHub Actions exécute un bloc `run` avec `bash -e {0}`, ce qui n’est pas votre shell de connexion, et les réglages de `shopt` ne se transmettent pas d’une étape à l’autre.

## Un document à partir de plusieurs, ou plusieurs à partir de plusieurs

À mi-chemin de la construction d’un convertisseur de dossier, la plupart des gens découvrent qu’ils voulaient autre chose. « Convertir ces quarante fichiers » se scinde en deux besoins qui se ressemblent et n’en sont pas un seul.

| | Quarante pages | Un document |
| --- | --- | --- |
| Ce que vous envoyez à quelqu’un | Quarante liens, ou un répertoire | Un lien, ou un fichier |
| Navigation | Les liens que les documents avaient déjà | Un sommaire que vous générez |
| Niveaux de titre | Le `#` propre à chaque fichier est le titre de la page | Chaque titre doit être rétrogradé d’un niveau |
| Identifiants d’ancre | Les doublons d’un fichier à l’autre sont inoffensifs | `#installation` dans quatre fichiers entre en collision |
| Ordre | Cosmétique | Du contenu — le mauvais ordre fait un mauvais document |
| Recherche | La recherche du site du lecteur, s’il y en a une | La recherche du navigateur, qui suffit souvent |
| Taille | Chaque page est petite | Un seul fichier, et un plafond de taille auquel penser |
| Contenu périmé | Une page par fichier source, supprimée avec lui | Tout régénérer, sinon c’est faux |

Si le lecteur va lire l’ensemble, c’est un document qu’il vous faut, et la conversion en est la moitié facile. Concaténer du Markdown n’est pas un `cat` : un `cat` brut colle la dernière ligne d’un fichier à la première du suivant, les titres doivent être rétrogradés pour que le `#` du deuxième fichier ne devienne pas un autre titre de page, et les ancres doivent être désambiguïsées. [Transformer un dossier en un seul document](/blog/merging-many-markdown-files) traite de l’ordre, des niveaux de titre et des collisions d’ancres, et cela vaut la peine d’être lu avant d’écrire la boucle plutôt qu’après.

Il y a un plafond pratique à la réponse fusionnée : un document assez gros est un document que personne ne peut ouvrir. Les navigateurs encaissent quelques mégaoctets de HTML et cessent d’être agréables bien avant les limites qu’impose n’importe quel convertisseur — celui qui fait tourner ce site refuse un fichier à convertir de plus de 10 Mo et un document stocké de plus de 4 Mo (vérifié sur transformpipe.com/docs, le 8 septembre 2026), ce qui, en Markdown, fait un très long livre. Si votre sortie fusionnée approche l’un ou l’autre de ces nombres, la réponse honnête n’est pas un fichier plus gros, c’est un ensemble de pages avec une navigation, autrement dit un générateur.

## Là où une boucle sur un dossier cesse d’être la réponse

La boucle est le bon outil pour un ensemble borné de documents dont la seule relation est d’habiter le même répertoire. Quatre choses brisent cela, et chacune a un coût qu’il vaut mieux nommer avant de passer une semaine sur un script de build.

**Des documents qui se lient entre eux.** À l’instant où `docs/api.md` pointe vers `docs/guide.md`, un simple convertisseur produit une page dont les liens visent des fichiers `.md` qui ne sont pas là. Les réécrire suppose d’analyser le Markdown, de résoudre la cible, de vérifier qu’elle existe et de réécrire l’extension — et vérifier qu’elle existe est le moment où vous découvrez les quatre liens qui étaient déjà cassés. Ce n’est l’option d’aucun convertisseur. C’est un vrai programme, et un générateur de site l’a déjà écrit.

**Un lecteur qui arrive sans URL.** Un dossier de pages n’a ni index, ni recherche, ni navigation. Si quelqu’un doit trouver le bon document au lieu de se le faire envoyer, vous construisez un site, et le faire avec un script shell revient à réimplémenter mal un générateur, un besoin à la fois. Le coût de l’admettre tôt, c’est un fichier de configuration. Le coût de l’admettre tard, c’est un script de build qu’une seule personne comprend et que plus personne ne touchera après son départ.

**Des fichiers dont la sortie ne devrait pas exister.** Les brouillons, les gabarits, les fragments, le répertoire `_includes`, la section archivée que quelqu’un a gardée « pour référence ». Un glob n’a d’opinion sur aucun d’eux : ils deviennent donc tous des pages, et certaines de ces pages seront trouvées par un moteur de recherche avant de l’être par vous. Les exclure veut dire une liste d’exceptions, dans le script, maintenue à la main, exactement le fichier de configuration que vous cherchiez à éviter.

**Une arborescence qui change de forme.** La boucle encode la forme de l’arborescence dans ses expressions de chemin. Réorganisez les répertoires et toutes les URL de sortie changent, tous les liens que quelqu’un avait enregistrés cassent, et il n’y a rien depuis quoi rediriger parce que rien n’a consigné les anciens chemins. Un convertisseur ne peut pas réparer cela et un générateur n’aide qu’un peu ; la vraie réponse est de décider les chemins de sortie délibérément et de les garder stables même quand la source bouge.

Rien de tout cela ne plaide contre la boucle dans le cas qui lui convient : un ensemble de documents, converti pour des gens à qui l’on donnera les liens. Cela plaide contre le fait d’en faire pousser une en système de publication par accident, la manière habituelle dont un script de quinze lignes devient quatre cents lignes que personne ne peut supprimer.

## Comment choisir

1. **Comptez les fichiers, puis recomptez-les tels qu’ils seront dans un an.** En dessous de vingt, une boucle `for` avec `set -euo pipefail` est toute la réponse et le reste est un loisir. Au-delà de quelques centaines, il vous faut `find`, la séparation par NUL et `-P`, parce que la limite d’arguments et le temps d’horloge deviennent tous deux réels plutôt que théoriques.
2. **Tranchez à-côté-ou-séparé avant d’écrire une ligne.** Une arborescence séparée vous coûte les liens relatifs et les chemins d’images, et vous donne un build propre, une sortie supprimable et un diff sans fichiers générés dedans. La choisir plus tard veut dire déplacer chaque sortie et réparer chaque lien d’un coup, sous la pression du temps.
3. **Écrivez d’abord la conversion d’un seul fichier comme son propre script.** Si `bin/one.sh input.md output.html` est correct et sort avec un code non nul en cas d’échec, chaque approche de cette page tient en une ligne à changer, et vous pouvez tester la partie difficile sans dossier. Si la logique de conversion vit dans la boucle, vous ne pouvez pas la tester du tout.
4. **Choisissez votre politique d’échec explicitement, et faites-la prouver par la tâche.** S’arrêter au premier fichier fautif, ou tout convertir et sortir avec un code non nul à la fin — les deux conviennent, et le comportement par défaut, « continuer et annoncer un succès », est ce qui met une arborescence de documentation à moitié construite en production. Ajoutez ensuite l’assertion sur le nombre de sorties, parce qu’aucun code de sortie ne vous parlera jamais du répertoire où le glob n’est jamais entré.
5. **N’ajoutez la conversion incrémentale que si l’exécution complète est vraiment trop lente, et indexez-la sur le contenu.** La mtime marche sur un portable et ne fait silencieusement rien en intégration continue : une empreinte est donc la version qui survit à un clone frais. Incluez le gabarit et la version du convertisseur dans la clé, sinon une mise à jour vous laissera servir la sortie de l’ancienne.
6. **Demandez-vous si la réponse est un seul document.** Si le destinataire va lire tout l’ensemble, quarante liens sont un moins bon livrable qu’une seule page, et le travail se déplace de la boucle vers la fusion. C’est un autre problème, aux modes de défaillance différents, et le découvrir après coup veut dire écrire le script deux fois.

## Conclusion

Une conversion par lot, c’est une petite quantité de conversion emballée dans une grande quantité de comptabilité, et c’est dans la comptabilité que vivent les défauts : le glob qui a atteint neuf fichiers sur quarante-neuf, le chemin de sortie qui a replié deux pages en une, l’exécution parallèle dont les échecs sont partis dans un sous-shell, le cache qui se souvenait d’une feuille de style qu’il n’avait jamais vue. Écrivez la conversion d’un seul fichier comme un script qui sort honnêtement, pilotez-le avec `find` et la séparation par NUL pour que l’ensemble des fichiers soit connaissable et stable, gardez la sortie dans une arborescence que vous pouvez supprimer, et vérifiez le nombre de sorties à la fin pour qu’un répertoire manquant soit un build en échec plutôt qu’une page dont personne ne remarque l’absence. Ensuite, quand l’ensemble se révélera être un document plutôt que quarante, vous aurez gardé les deux travaux séparés — et quand il s’agit vraiment d’un seul fichier qui doit avoir l’air fini, [en convertir un dans le navigateur](/) est gratuit, ne demande aucune installation et ne téléverse rien tant que vous n’êtes pas connecté.

## FAQ

### Comment convertir plusieurs fichiers Markdown d’un coup depuis un terminal ?

Laissez le shell énumérer et laissez un script convertir un seul fichier : `find docs -type f -name '*.md' -print0 | sort -z | xargs -0 -P 8 -n 1 bin/one.sh`. Construisez le chemin de sortie dans le script avec `${file%.md}.html` pour que l’arborescence garde sa forme, et faites un `mkdir -p` de la destination avant d’écrire. Mettez `set -euo pipefail` en tête du script et laissez `xargs` renvoyer 123 si un fichier a échoué.

### Pourquoi ma conversion par lot a-t-elle sauté les fichiers des sous-répertoires ?

Parce que `docs/*.md` ne descend pas dans l’arborescence et que `**` ne traverse les séparateurs de répertoire que si l’option `globstar` de bash est activée. Sans `shopt -s globstar`, le motif `docs/**/*.md` correspond à exactement un niveau en dessous, et tout fichier plus profond est ignoré sans la moindre erreur. Utilisez `find` à la place, ou activez l’option, et comparez le nombre d’entrées et de sorties à la fin de l’exécution.

### Puis-je convertir un dossier de fichiers Markdown en parallèle ?

Oui — `xargs -0 -P 8`, GNU `parallel` ou `make -j8` le font tous, et l’accélération est réelle parce que l’essentiel du coût est le démarrage des processus plutôt que l’analyse. Ce que vous perdez, c’est l’ordre : les tâches concurrentes entrelacent leur sortie ligne par ligne, et un compteur incrémenté dans la boucle vit dans un sous-shell et disparaît. Utilisez `parallel -k` si la sortie doit rester ordonnée, et écrivez un petit fichier par échec au lieu d’alimenter une variable.

### Comment sauter les fichiers Markdown qui n’ont pas changé ?

`make` avec une règle de motif le fait à la date de modification et ne demande aucun cache à vous, mais git ne stocke pas les mtimes : dans une extraction d’intégration continue fraîche, tout a donc l’air neuf et toute l’arborescence se reconstruit. Une empreinte de contenu stockée à côté de chaque sortie fonctionne partout, y compris dans un clone frais. Quelle que soit votre méthode, incluez le gabarit HTML et la version du convertisseur dans la clé, sinon un changement de feuille de style laissera chaque page périmée.

### Le HTML doit-il aller à côté du Markdown ou dans un dossier séparé ?

Une arborescence séparée, dans presque tous les cas : vous pouvez la supprimer, elle reste hors de vos diffs, et un fichier Markdown supprimé ne peut pas laisser de page orpheline derrière lui. La sortie à côté de l’entrée n’est clairement meilleure que si les liens relatifs et les chemins d’images entre documents doivent continuer de fonctionner sans être touchés. Si vous prenez une arborescence séparée, reproduisez la structure des répertoires — `basename` repliera deux fichiers `index.md` en une seule sortie, et sortira avec zéro en le faisant.

### Pourquoi mon build passe-t-il alors que certaines conversions ont échoué ?

Parce que rien n’a vérifié. Une boucle shell continue après un échec et sort avec le code de la dernière commande, un tube rapporte l’étape finale plutôt que le convertisseur, et plusieurs outils traitent une erreur comme un avertissement — `curl` sort avec zéro sur un 429 quand `-f` manque. Utilisez `set -euo pipefail`, redirigez au lieu de mettre en tube, et ajoutez un `exit 1` explicite après avoir compté les échecs.

### Vaut-il mieux convertir quarante fichiers ou les fusionner en un seul ?

Cela dépend entièrement du lecteur. Quarante pages conviennent à quelqu’un qui arrive avec un lien vers l’une d’elles ; un document convient à quelqu’un qui va lire l’ensemble, et c’est un lien plutôt que quarante. Fusionner n’est pourtant pas concaténer — les niveaux de titre doivent être rétrogradés et les ancres en double désambiguïsées — alors traitez cela comme un travail à part plutôt que comme une option de la boucle.
