---
title: Choisir un convertisseur Markdown en ligne de commande, et l’exécuter sans surprise
description: Convertir du Markdown en HTML depuis un terminal — Pandoc, cmark-gfm, comrak, Node, Python, un appel d’API, et les guillemets et globs qui échouent en CI
date: 2026-08-26
tag: Workflow
keywords: convertisseur markdown ligne de commande, markdown vers html terminal, convertir markdown en html script, markdown en html en ci, convertir un dossier de fichiers markdown, script markdown vers html node, pandoc html autonome
---

Un convertisseur dans le navigateur est le bon outil pour un seul fichier. Il cesse de l’être dès que la conversion doit se produire à chaque commit, ou qu’un dossier contient quarante fichiers et que personne ne veut ouvrir quarante onglets. À ce stade, ce qu’il vous faut, c’est une commande — quelque chose qu’un Makefile, un script shell ou une tâche de CI peut appeler sans que personne ne clique sur rien.

Le problème, c’est qu’une commande qui fonctionne et une commande qui continue de fonctionner sont deux choses différentes. La ligne que vous tapez une fois, que vous voyez réussir et que vous collez dans un script est la même ligne qui tournera mille fois sans surveillance, contre des noms de fichiers que vous n’avez pas choisis, sur un runner avec un shell différent, une locale différente et sans Pandoc installé. Presque toute conversion en terminal qui échoue en production échoue pour une raison qui n’a rien à voir avec Markdown.

Ce texte se divise donc en deux moitiés. D’abord les convertisseurs : ce qu’est chacun, ce qu’il produit réellement, et les options précises qui font la différence entre un fragment et un document. Puis les points sur lesquels les gens se trompent — les guillemets, les motifs glob, l’endroit où atterrit la sortie, ce que signifie vraiment votre code de sortie, et ce que coûte l’installation d’un convertisseur à chaque exécution de CI.

### En bref

Si un convertisseur est déjà présent sur la machine, une seule ligne suffit : `pandoc -f gfm -t html -s --embed-resources README.md -o README.html` produit un document complet en un seul fichier plutôt qu’un fragment, et `--sandbox` sécurise davantage son emploi sur un fichier que vous n’avez pas écrit. Si rien n’est installé et que cela doit rester ainsi, un script Node de cinq lignes utilisant `marked`, un appel `python -m markdown`, ou un `curl` vers une API HTTP battent tous l’installation d’un convertisseur de documents que vous n’utiliserez qu’une fois. Les échecs ne se trouvent presque jamais dans l’analyseur : ce sont des noms de fichiers sans guillemets, un glob qui a trié `10-api.md` avant `2-setup.md`, une sortie écrite dans le mauvais arbre de dossiers, et un pipeline qui a annoncé un succès parce que `tee` a réussi. En CI, le coût réel de Pandoc est l’installation à chaque exécution, ce qui explique pourquoi un binaire statique, une image mise en cache, ou un appel d’API l’emportent souvent, rien qu’en temps d’horloge.

## Pourquoi le terminal change la question

Dans un navigateur, un convertisseur Markdown prend quatre décisions à votre place et vous en montre le résultat immédiatement. Dans un terminal, il prend les mêmes quatre décisions en silence, et vous le découvrez des semaines plus tard.

**Quel dialecte il analyse.** Le CommonMark pur n’a ni tableaux, ni listes de tâches, ni texte barré, ni liens automatiques. Le GitHub Flavored Markdown a les quatre. Presque tous les outils en ligne de commande ont un défaut, et ce défaut est rarement GFM : le lecteur par défaut de Pandoc est son propre dialecte étendu, cmark-gfm est livré avec toutes les extensions désactivées, comrak ne les active qu’avec `--gfm` ou un `--extension` explicite. Un tableau que l’analyseur ne reconnaît pas ne provoque pas d’erreur. Il devient un paragraphe plein de barres verticales, et la tâche se termine avec un code de sortie zéro.

**S’il produit un document ou un fragment.** La plupart de ces outils sont des bibliothèques dotées d’un exécutable vissé par-dessus, et une bibliothèque renvoie correctement `<h1>Titre</h1><p>Texte</p>` sans rien autour. Ouvert dans un navigateur, cela donne du texte noir sans mise en forme, dans la police par défaut du navigateur, sur toute la largeur de la fenêtre. C’est du HTML valide, et cela paraît cassé à quiconque le reçoit. Seuls quelques-uns de ces outils ont une option pour l’emballer.

**Ce qu’il fait du HTML brut.** Markdown a été conçu pour laisser passer le HTML, un fichier `.md` peut donc transporter `<script>`, des `onerror=` et des liens `javascript:`. Pandoc laisse tout passer. marked laisse tout passer et le dit dans sa propre documentation. cmark-gfm et comrak le suppriment sauf si vous passez `--unsafe`. markdown-it l’échappe sauf si vous activez son option `html`. Si le fichier vient de l’extérieur de votre dépôt, ce choix constitue tout le modèle de sécurité — [assainir est un travail à part, avec ses propres règles](/blog/sanitising-markdown-safely).

**Ce qu’il dit au shell quand il échoue.** Un convertisseur qui meurt en plein fichier laisse quand même un fichier partiel sur le disque, et si vous l’avez mis dans un tube, le code de sortie du pipeline appartient à la dernière commande plutôt qu’à celle qui est morte. C’est la façon la plus courante qu’un build cassé a de se déclarer vert.

Aucune de ces quatre décisions n’est exotique. Toutes les quatre sont invisibles jusqu’à ce que quelqu’un ouvre la sortie.

## Comparatif rapide : l’antisèche

| Outil | Idéal pour | Capacité clé | Prix |
| --- | --- | --- | --- |
| Pandoc | Tout ce qui dépasse le HTML, et un contrôle précis de l’emballage | `--standalone`, `--embed-resources`, `--template`, `--sandbox` | Gratuit, GPL |
| cmark-gfm | Un moteur GFM petit, rapide et prévisible | C sans dépendances, extensions activables une à une avec `-e` | Gratuit, BSD 2-clauses |
| comrak | Un binaire statique unique avec GFM derrière une option | Rust, `--gfm`, HTML brut désactivé sauf `--unsafe` | Gratuit, BSD 2-clauses |
| marked (CLI) | Une conversion dans un dépôt qui a déjà Node | `marked -o out.html` lisant l’entrée standard | Gratuit, MIT |
| markdown-it (CLI) | La conformité CommonMark depuis un shell | Livre un exécutable `markdown-it` ; échappe le HTML brut par défaut | Gratuit, MIT |
| Un script Node | Une sortie que vous contrôlez, emballage compris | Cinq lignes sur marked ou markdown-it, aucun nouvel outil | Gratuit |
| Python `markdown_py` | Une chaîne Python déjà en place | `python -m markdown -x tables`, API d’extensions | Gratuit, BSD 3-clauses |
| Go et goldmark | Un binaire unique à donner à un runner | Bibliothèque seule ; un `main.go` de vingt lignes devient le CLI | Gratuit, MIT |
| `curl` et une API HTTP | Aucune chaîne d’outils locale, et un lien à la fin | Une requête, aucune installation, sortie pouvant être une page en direct | Gratuit |
| Un CLI sans dépendances (`tp`) | Des étapes de CI qui ne doivent traîner aucun arbre de paquets | `login`, `push`, `list`, `rm`, `usage`, `--json` | Gratuit |

## Tous les convertisseurs Markdown en ligne de commande qui valent la peine

### Pandoc — le meilleur quand l’emballage compte autant que le HTML

Pandoc est un convertisseur de documents écrit en Haskell qui lit et écrit une quarantaine de formats. Comme convertisseur Markdown en ligne de commande, c’est plus d’outil que la tâche n’en demande, et c’est aussi le seul de cette liste à produire un document complet, autonome et gabarisé sans que vous ayez à écrire vous-même la mécanique du gabarit.

| Avantages | Inconvénients |
| --- | --- |
| `--standalone` et `--embed-resources` donnent un vrai document en un seul fichier | Une grosse installation à maintenir à jour sur chaque machine qui exécute la tâche |
| Les gabarits et les filtres Lua contrôlent la sortie avec précision | Les gabarits sont un second langage à apprendre |
| `--sandbox` limite l’accès au système de fichiers quand l’entrée n’est pas fiable | Aucun assainissement : le HTML brut passe directement jusqu’à la page |
| Lit le GFM, le CommonMark et son propre dialecte, choisis explicitement | Ses dialectes diffèrent de façons qui surprennent en pleine migration |

**Prix :** gratuit, sous licence GPL.

**Détails techniques et fonctions**

- `-f gfm` sélectionne le lecteur GitHub Flavored Markdown, tableaux, listes de tâches, texte barré et liens automatiques sont donc analysés ; `-f commonmark` sélectionne le lecteur strict
- `-s` (`--standalone`) produit, selon les mots mêmes du manuel, une « sortie avec un en-tête et un pied de page appropriés… pas un fragment »
- `--embed-resources` intègre feuilles de style, scripts et images liés sous forme d’URI `data:` ; l’ancien `--self-contained` est désormais un synonyme déprécié de `--embed-resources --standalone`
- `--template FICHIER` utilise votre propre emballage, et implique `--standalone`
- `-M clé=valeur` fixe un champ de métadonnées, `--metadata-file` lit tout un fichier YAML ou JSON, et une valeur donnée en ligne de commande l’emporte sur celle du document
- `--defaults FICHIER` déplace une longue invocation dans un fichier YAML que vous pouvez versionner
- `--toc`, `-N` pour des sections numérotées, et `--shift-heading-level-by` s’occupent des tâches structurelles
- `--resource-path` indique où chercher les images, séparés par `:` sous Unix et `;` sous Windows
- `--syntax-highlighting=STYLE` choisit le thème de coloration syntaxique — remplaçant le désormais déprécié `--highlight-style` — et `--list-highlight-styles` affiche ce que votre build prend en charge
- `--file-scope` analyse chaque fichier séparément avant de les combiner, ce qui change le comportement des notes de bas de page et des liens sur une entrée multi-fichiers
- `--sandbox` exécute la conversion « en limitant les opérations d’entrée-sortie des lecteurs et écrivains à la lecture des fichiers spécifiés en ligne de commande »
- `--fail-if-warnings` transforme un avertissement en code de sortie non nul, l’option qui rend Pandoc honnête à l’intérieur d’un script

Un document complet, en une seule commande :

```bash
pandoc -f gfm -t html -s \
  --embed-resources \
  --metadata title="API reference" \
  --toc --fail-if-warnings \
  docs/api.md -o build/api.html
```

`--metadata title=` n’est pas facultatif en pratique. Sans titre, Pandoc avertit et vous donne un document autonome dont le `<title>` ne contient rien d’utile, et avec `--fail-if-warnings`, cet avertissement devient une erreur — ce qui est exactement ce que vous voulez la première fois et exaspérant la cinquième fois que vous l’oubliez. Mettez toute l’invocation dans un fichier `--defaults` et l’argument cesse d’être quelque chose que l’on peut oublier.

**Pour qui ?** Pour quiconque a une sortie qui n’est pas seulement du HTML, quiconque a besoin que l’emballage corresponde à un gabarit maison, et quiconque convertit des fichiers qu’il n’a pas écrits, car `--sandbox` n’a pas d’équivalent ailleurs dans cette liste. Si le HTML est la seule cible et que l’emballage n’a pas d’importance, [les options plus petites sont réellement plus petites](/blog/pandoc-alternatives-for-markdown-to-html).

### cmark-gfm — le meilleur petit moteur GFM prévisible

cmark-gfm est le fork de GitHub de l’implémentation de référence de CommonMark, écrit en C99 standard sans dépendance externe. Il fait un travail unique, à toute vitesse, et vous rend un fragment sans la moindre mise en forme.

| Avantages | Inconvénients |
| --- | --- |
| Aucune dépendance, il se construit et se met en cache presque instantanément | Sortie en fragment : jamais de doctype, jamais d’en-tête, jamais de styles |
| Les extensions sont explicites, le comportement se lit donc depuis la commande | Il faut se souvenir de chaque option `-e`, à chaque fois |
| Le HTML brut est supprimé sauf demande explicite via `--unsafe` | Empaquetage inégal selon les distributions |
| Suit la spécification GFM de près | Rien au-delà du HTML et de ses propres formats en forme d’arbre syntaxique |

**Prix :** gratuit, sous licence BSD 2-clauses.

**Détails techniques et fonctions**

- `-t` / `--to FORMAT` sélectionne le format de sortie ; HTML est celui qui nous intéresse ici
- `-e` / `--extension NOM` active une extension à la fois, et `--list-extensions` affiche ce que votre build possède réellement
- `--unsafe` permet le HTML brut et les liens à risque ; sans elle, ils sont retirés, ce qui est le bon défaut pour un fichier venu de l’extérieur
- `--hardbreaks` transforme les simples retours à la ligne en `<br>`, et `--smart` produit des guillemets et des tirets typographiques
- `--width` contrôle le retour à la ligne pour les formats de sortie de type texte

```bash
cmark-gfm -e table -e strikethrough -e autolink -e tasklist \
  README.md > build/README.html
```

Lancez `cmark-gfm --list-extensions` avant de valider cette ligne. Les noms d’extensions viennent du build, et un nom accepté sur votre machine n’est pas garanti d’exister dans la version que votre distribution installe sur le runner — ce qui échoue bruyamment, au moins, plutôt que de faire disparaître les tableaux en silence.

**Pour qui ?** Les builds qui convertissent beaucoup de fichiers et se soucient des secondes, et quiconque veut que le HTML brut soit supprimé par défaut sans ajouter son propre assainisseur. Pas pour quiconque a besoin que la sortie s’ouvre telle quelle.

### comrak — le meilleur binaire statique unique

comrak est une implémentation de CommonMark et de GFM en Rust qui, contrairement à goldmark, fournit un vrai binaire en ligne de commande. Il est conforme à CommonMark 0.31.2 par défaut et passe intégralement la suite de tests GFM (vérifié sur github.com/kivikakk/comrak, le 8 septembre 2026), et s’installe avec `cargo install comrak`, depuis Homebrew, pacman, dnf ou Scoop, ou comme binaire de version à télécharger une fois.

| Avantages | Inconvénients |
| --- | --- |
| Un seul binaire statique : rien à résoudre sur la machine cible | Sortie en fragment, comme cmark-gfm |
| `--gfm` active tout l’ensemble GFM en une seule option | `cargo install` compile, ce qui est lent la première fois |
| HTML brut et liens à risque sont désactivés sauf `--unsafe` | Construire depuis les sources exige une chaîne Rust récente |
| Écrit aussi du XML et du CommonMark, utile pour les allers-retours | Écosystème plus restreint que les analyseurs JavaScript |

**Prix :** gratuit, sous licence BSD 2-clauses.

**Détails techniques et fonctions**

- `--gfm` active ensemble texte barré, tableaux, liens automatiques et listes de tâches
- `--extension NOM` active des extensions individuelles, y compris certaines hors GFM comme les notes de bas de page et l’exposant
- `--unsafe` autorise le HTML brut et les liens dangereux ; les deux sont désactivés par défaut
- `--to` sélectionne HTML, XML ou CommonMark comme sortie

```bash
comrak --gfm README.md > build/README.html
```

**Pour qui ?** Quiconque veut que la conversion tienne en un seul fichier à copier sur un runner, dans un conteneur, ou sur l’ordinateur d’un collègue sans gestionnaire de paquets impliqué. Télécharger un binaire de version et le garder dans son répertoire d’outils est une stratégie légitime, et c’est la chose la moins coûteuse de cette page à mettre en cache.

### marked (CLI) — le meilleur quand le dépôt a déjà Node

marked est l’analyseur Markdown JavaScript petit et rapide, et l’installer installe aussi un exécutable `marked`. Son usage documenté lit depuis l’entrée standard et écrit là où `-o` le dit.

| Avantages | Inconvénients |
| --- | --- |
| Déjà une dépendance dans énormément de projets JavaScript | Sortie en fragment ; l’emballage est votre problème |
| Le GFM est activé par défaut, les tableaux fonctionnent donc sans option | Aucun assainissement, par conception explicite |
| `marked --help` liste les options, et elles sont peu nombreuses | A besoin de Node sur chaque machine qui exécute la tâche |

**Prix :** gratuit, sous licence MIT.

```bash
npx --yes marked -o build/README.html < README.md
```

Le `--yes` compte plus qu’il n’y paraît. Sans lui, `npx` sur une machine sans copie locale s’arrête pour demander la permission de récupérer le paquet, et une étape de CI qui s’arrête pour poser une question reste bloquée jusqu’à l’expiration du délai du job.

**Pour qui ?** Les projets qui dépendent déjà de marked pour le rendu à l’intérieur de l’application et veulent que le build utilise le même analyseur, pour que la page et l’application ne puissent pas se contredire sur un même fichier.

### markdown-it (CLI) — la meilleure conformité depuis un shell

markdown-it est l’analyseur conforme à CommonMark derrière l’aperçu Markdown de VS Code, et son paquet déclare un exécutable `markdown-it`, un simple appel `npx` fonctionne donc sans rien d’autre d’installé.

| Avantages | Inconvénients |
| --- | --- |
| Suit la spécification CommonMark de près | Légèrement plus lent que marked |
| Échappe le HTML brut sauf activation de l’option `html` | Sortie en fragment |
| Un véritable écosystème d’extensions — notes, ancres, conteneurs | Les extensions sont accessibles depuis l’API, pas depuis le CLI |

**Prix :** gratuit, sous licence MIT.

```bash
npx --yes markdown-it README.md > build/README.html
```

Le CLI est délibérément sommaire. Dès que vous voulez une extension — ancres de titres, notes de bas de page, une syntaxe de conteneur — vous avez cessé d’utiliser le CLI et commencé à écrire le script de la section suivante, ce qui ne pose aucun problème et prend cinq lignes.

**Pour qui ?** Quiconque veut que le HTML brut soit échappé par défaut et la spécification suivie, et quiconque s’apprête à passer d’une ligne unique à un script.

### Un script Node — le meilleur quand vous voulez aussi l’emballage

Chaque problème de fragment de cette page disparaît dès l’instant où vous écrivez vous-même les cinq lignes, parce que le gabarit est un template literal et que vous connaissez déjà le HTML.

```js
// md2html.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const [input, output] = process.argv.slice(2);
const body = marked.parse(readFileSync(input, 'utf8'));

writeFileSync(
  output,
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${input}</title>
<style>
body{max-width:44rem;margin:2rem auto;padding:0 1rem;font:16px/1.6 system-ui,sans-serif}
table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.4rem .6rem}
pre{overflow-x:auto;background:#f6f8fa;padding:1rem;border-radius:6px}
</style>
</head>
<body>
${body}
</body>
</html>
`
);
```

| Avantages | Inconvénients |
| --- | --- |
| La sortie est un vrai document, mis en forme comme vous en avez décidé | Vous le possédez, bogues compris |
| N’importe quel analyseur, n’importe quel plugin, n’importe quelle étape de post-traitement | A besoin de Node, et d’un fichier de verrouillage pour rester reproductible |
| Aucun nouveau binaire sur la machine au-delà de ce que le dépôt a déjà | L’assainissement reste à ajouter vous-même |

**Prix :** gratuit. La licence de l’analyseur est de toute façon MIT.

**Détails techniques et fonctions**

- Remplacez `marked` par `markdown-it` et vous gagnez le HTML brut échappé plus des plugins, pour deux lignes de plus
- Ajoutez un assainisseur avant l’écriture si l’entrée n’est pas la vôtre ; la réponse documentée pour marked est de faire passer sa sortie par DOMPurify
- `process.exitCode = 1` à l’intérieur d’un `catch` est ce qui rend le script utilisable dans un pipeline ; un script qui lève une exception sort avec un code non nul, mais un script qui journalise et continue, non
- Installez avec `npm ci`, pas `npm install`, pour que la version de l’analyseur vienne du fichier de verrouillage plutôt que du calendrier

Résistez à l’envie de compresser cela en une véritable ligne unique. `node -e` sur une seule ligne signifie que tout le programme doit survivre aux règles de guillemets de votre shell, ce qui fait l’objet d’une section plus bas, et c’est l’endroit le moins gratifiant de cette page pour faire preuve d’ingéniosité.

**Pour qui ?** Quiconque a besoin que la sortie s’ouvre seule et ne veut pas installer de convertisseur de documents pour l’obtenir. Pour la plupart des dépôts, la plupart du temps, c’est la bonne réponse.

### Python et `markdown_py` — le meilleur à l’intérieur d’un build Python

Python-Markdown est l’implémentation Markdown historique de Python et le moteur derrière MkDocs. L’installer donne un script `markdown_py`, et `python -m markdown` fait la même chose sans se soucier de savoir si le répertoire des scripts est dans votre `PATH`.

| Avantages | Inconvénients |
| --- | --- |
| Déjà présent dans la plupart des chaînes de documentation Python | Pas conforme à CommonMark dans tous les détails |
| Une API d’extensions mature, avec des extensions pour tableaux et notes | Les extensions sont optionnelles, la sortie brute n’a donc pas de tableaux |
| Configurable depuis un fichier YAML ou JSON avec `-c` | Plus lent que les implémentations en C, Rust et Go |

**Prix :** gratuit, sous licence BSD 3-clauses.

**Détails techniques et fonctions**

- L’usage est `python -m markdown [options] [args]`, et le HTML part vers la sortie standard
- `-x` / `--extension NOM` charge une extension ; répétez l’option pour chacune
- `-c` / `--extension_configs FICHIER` lit les réglages d’extensions depuis du YAML ou du JSON, l’endroit où va tout ce qui a des options

```bash
python -m markdown -x tables -x fenced_code -x toc \
  README.md > build/README.html
```

Sans `-x tables`, vos tableaux sont des paragraphes de barres verticales. C’est la plainte la plus courante contre Python-Markdown, et ce n’est pas un bogue : les tableaux n’ont jamais fait partie du Markdown original ni de CommonMark, une implémentation qui les garde derrière une option d’extension fait donc preuve de précision plutôt que de mauvaise volonté.

**Pour qui ?** Les projets Python, les utilisateurs de MkDocs, et quiconque a déjà Python dans son image de CI et préférerait ne pas ajouter un second runtime pour une seule conversion.

### Go et goldmark — le meilleur binaire à confier à un runner

goldmark est un analyseur Markdown en Go, conforme à CommonMark 0.31.2, et le moteur de rendu que Hugo utilise dans sa configuration par défaut (vérifié sur github.com/yuin/goldmark et gohugo.io, le 8 septembre 2026). C’est une bibliothèque seule : il n’existe pas de commande `goldmark` à installer. Ce que vous faites à la place, c’est écrire une vingtaine de lignes et les compiler, ce qui donne un binaire statique unique, sans aucun runtime à installer où que ce soit.

| Avantages | Inconvénients |
| --- | --- |
| Se compile en un seul binaire statique, cross-compilable depuis n’importe où | Aucun CLI du tout tant que vous n’en écrivez pas un |
| Le GFM en une seule extension : tableaux, texte barré, linkify, listes de tâches | Vous maintenez le petit programme pour toujours |
| Rapide, et déjà dans votre pile si vous utilisez Hugo | Moins d’extensions prêtes à l’emploi que dans le monde JavaScript |

**Prix :** gratuit, sous licence MIT.

```go
// md2html.go
package main

import (
	"bytes"
	"fmt"
	"os"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
)

func main() {
	source, err := os.ReadFile(os.Args[1])
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	md := goldmark.New(goldmark.WithExtensions(extension.GFM))

	var out bytes.Buffer
	if err := md.Convert(source, &out); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	os.Stdout.Write(out.Bytes())
}
```

**Détails techniques et fonctions**

- `extension.GFM` regroupe tableaux, texte barré, linkify et listes de tâches ; notes de bas de page, listes de définitions et le mode typographe sont des extensions séparées à ajouter à la même liste
- `go build` produit un seul fichier, et `GOOS` avec `GOARCH` le cross-compile pour le runner sans conteneur
- Renvoyer un code de sortie non nul en cas d’échec est explicite ici, ce qui est plus facile à faire correctement que dans un shell

**Pour qui ?** Les équipes Go, les utilisateurs de Hugo qui veulent savoir ce qui rend leur contenu, et quiconque préfère versionner un binaire compilé plutôt que de maintenir une étape d’installation de paquet en CI.

### `curl` et une API HTTP — le meilleur quand il n’y a aucune chaîne d’outils

Parfois, la sortie n’est même pas un fichier sur disque. C’est une page qu’un collègue peut ouvrir, produite sur une machine sans Node, sans Python et sans permission d’installer quoi que ce soit.

| Avantages | Inconvénients |
| --- | --- |
| Rien à installer au-delà de `curl` | A besoin du réseau, ce ne peut donc pas être votre build hors ligne |
| La sortie peut être un lien en direct plutôt qu’un fichier à joindre | A besoin d’un secret dans l’environnement |
| Le comportement de conversion ne peut pas dériver avec une installation locale | Des limites de débit et de taille s’appliquent |

**Prix :** gratuit, y compris l’API sur un compte gratuit.

TransformPipe expose une API à `/api/v1` avec des clés révocables. Postez le Markdown comme corps de la requête :

```bash
curl -fsS \
  -H "Authorization: Bearer $TP_API_KEY" \
  -H "Content-Type: text/markdown" \
  --data-binary @README.md \
  "https://transformpipe.com/api/v1/documents?name=README.md&share=link"
```

**Détails techniques et fonctions**

- La réponse est du JSON contenant l’identifiant du document et, à cause de `?share=link`, une URL de lecture seule déjà active
- `GET /api/v1/documents/:id.html` renvoie aussi le fichier HTML, si vous voulez l’avoir sur disque
- Les limites sont publiées plutôt que devinées : 10 Mo pour un fichier à convertir, 4 Mo pour en garder un dans un compte, 100 Mo et 500 documents par compte, et 60 requêtes par minute comptées par clé
- `-f` est essentiel. Sans lui, `curl` sort avec un code zéro sur un 401 ou un 429 et écrit le corps de l’erreur dans votre fichier de sortie
- `-sS` garde la barre de progression hors de vos journaux tout en laissant les vraies erreurs sur stderr
- `--retry 3 --retry-connrefused` couvre l’échec réseau passager qui, sinon, casserait un build par mois sans raison

Quarante fichiers passent facilement sous 60 requêtes par minute. Des milliers ont besoin d’une pause entre les appels, ou d’un seul document fusionné à la place — et [fusionner est un petit problème à part](/blog/merging-many-markdown-files), avec des niveaux de titres et des collisions d’ancres à considérer d’abord.

**Pour qui ?** Les étapes de build qui veulent un lien partageable à la fin, et tout environnement où installer un convertisseur est soit interdit, soit non rentable pour la minute que cela coûte à chaque exécution.

### Un CLI sans dépendances — le meilleur pour une étape de CI qui doit rester légère

L’autre déclinaison de la même idée est un CLI qui enveloppe l’API, écrit de façon à ce que l’installer n’installe rien d’autre. Le `tp` de TransformPipe est un fichier unique de Node sans dépendance, volontairement : un outil que l’on exécute en CI ne devrait pas traîner un arbre de paquets derrière lui.

| Avantages | Inconvénients |
| --- | --- |
| Aucune dépendance transitive à auditer, épingler ou mettre en cache | Reste un appel réseau et un secret |
| Lit une clé depuis `tp login`, `TP_API_KEY` ou `--key` | A besoin de Node, mais de rien d’autre |
| `--json` sur n’importe quelle commande, pour qu’un script lise le résultat | Publie un document ; ce n’est pas un convertisseur local |

**Prix :** gratuit.

**Détails techniques et fonctions**

- `tp push README.md --share` convertit et publie, et affiche le lien
- `tp push docs/*.md --merge --share` enchaîne plusieurs fichiers en un seul document plutôt qu’un document par fichier
- `tp list`, `tp rm <id>` et `tp usage` couvrent le reste, et `--json` sur n’importe laquelle est pour les scripts
- `tp login` stocke la clé dans `~/.config/tp/config.json` avec le mode `0600` ; en CI vous définissez plutôt `TP_API_KEY`, parce qu’un runner jette son répertoire personnel
- Les échecs impriment les mots de l’API elle-même et sortent avec un code non nul, `set -e` les rattrape donc sans aucun emballage de votre part

**Pour qui ?** Quiconque met la conversion dans un pipeline et préfère une seule ligne à un appel `curl` chargé de cinq options. Pour une pull request spécifiquement, une action demande encore moins de travail — [publier du Markdown depuis GitHub Actions](/blog/publish-markdown-from-github-actions) retire complètement l’installation du runner.

## Là où Pandoc cesse de se rentabiliser

Pandoc est la recommandation par défaut pour convertir du Markdown depuis un terminal, et pour la plupart de ce qu’on lui demande, cette recommandation est juste. Il vaut la peine d’être clair sur les quatre endroits où elle ne l’est pas, car aucun d’eux n’apparaît sur un tableau comparatif de fonctionnalités.

**L’installation est un coût récurrent, pas ponctuel.** Sur votre portable, vous installez Pandoc une fois et vous l’oubliez. En CI, vous l’installez à chaque exécution, et ce que cela coûte dépend entièrement de la méthode : un gestionnaire de paquets de distribution qui tire un paquet et ses dépendances, une installation Homebrew sur un runner macOS, un pull d’image Docker, ou un paquet mis en cache restauré depuis le cache du runner. Seules les deux dernières options sont rapides, et toutes deux demandent une configuration supplémentaire à entretenir. Comparez cela à une étape dans un job qui a déjà Node, ou à un binaire statique versionné, ou à un appel HTTP, et l’arithmétique penche souvent de l’autre côté pour un travail dont toute la sortie est un README transformé en une page. Ne prenez pas mon chiffre pour argent comptant — chronométrez votre propre pipeline avec et sans l’installation, deux fois chacun, et utilisez ce que vous avez mesuré.

**Il n’assainit pas.** Pandoc rend fidèlement, ce qui signifie que le HTML brut de la source arrive dans la sortie. Pour votre propre documentation, c’est une fonctionnalité ; c’est ainsi que l’on intègre une vidéo ou un élément `<details>`. Pour un fichier venu d’un fork, d’un client ou d’un système de tickets, c’est un vecteur d’attaque, et il n’existe pas d’option `--sanitise` vers laquelle se tourner. `--sandbox` protège la machine qui effectue la conversion, pas le navigateur qui ouvrira le résultat. Ce sont des problèmes différents aux réponses différentes, et les confondre est la façon dont un README non fiable finit rendu avec une balise script intacte.

**Son Markdown n’est pas le Markdown dans lequel votre fichier a été écrit.** Le lecteur par défaut de Pandoc est `markdown`, son propre dialecte étendu, ni GFM ni CommonMark. Convertissez un README GitHub avec le lecteur par défaut et vous obtiendrez des différences — dans les liens automatiques, dans la façon dont un saut de ligne dur est produit, dans le fait qu’une URL nue devienne ou non un lien — qui ne sont pas des bogues et pas ce que vous demandiez. `-f gfm` n’est pas une optimisation. C’est une option de correction, et l’omettre est la façon la plus courante dont une conversion Pandoc tourne subtilement mal. La réciproque s’applique aussi : un document écrit pour Pandoc, avec ses divs délimités et sa syntaxe de citations, perd silencieusement ces constructions face à un analyseur strictement CommonMark.

**Les gabarits sont un langage.** Dès l’instant où `--standalone` ne convient plus tout à fait, vous voilà en train d’écrire un gabarit Pandoc, d’apprendre sa syntaxe de variables et ses conditions, et de le tester en rendant des documents et en les regardant. C’est un compromis raisonnable si vous produisez cent documents qui doivent tous se ressembler. C’est un mauvais compromis face aux vingt lignes de HTML du script Node ci-dessus, si ce dont vous aviez réellement besoin était une feuille de style et une mesure de page sensée. Soyez honnête sur celui des deux que vous faites réellement avant de commencer, car la voie du gabarit est difficile à abandonner une fois qu’un build en dépend.

Si tout cela vous parle, les outils plus petits de cette page ne sont pas un compromis ; ils sont la bonne échelle. Et pour une vue plus large, incluant les options navigateur et bibliothèque qui ne touchent jamais un terminal, [la comparaison complète des convertisseurs les couvre](/blog/best-markdown-to-html-converters).

## Les cinq choses qui cassent dans le terminal, pas dans le convertisseur

Chacun des échecs ci-dessous a été, au moins une fois, diagnostiqué par quelqu’un comme un bogue du convertisseur, et aucun n’en est un.

### Les guillemets, et pourquoi le fichier avec une espace dans son nom a cassé le build

`for file in docs/*.md; do cmark-gfm $file > out.html; done` fonctionne jusqu’à ce que quelqu’un ajoute `notes de version.md`. Le shell découpe alors la variable non protégée sur l’espace et donne au convertisseur deux noms de fichiers qui n’existent pas. Mettez des guillemets sur chaque expansion, à chaque fois :

```bash
cmark-gfm "$file" > "$output"
```

La même règle s’applique à l’intérieur de `$(dirname "$file")` et `$(basename "$file" .md)`, qui ont besoin de leurs propres guillemets internes en plus des guillemets externes. Les noms de fichiers venus d’un dépôt ne sont pas vos noms de fichiers : ils arrivent avec des espaces, des apostrophes, des esperluettes, des caractères non ASCII, et, un mauvais jour, un tiret initial que le convertisseur lit comme une option. Un simple `--` avant le nom de fichier arrête ce dernier cas.

Pour tout ce qui est récursif, évitez la boucle sur un glob et laissez `find` transmettre les noms comme des données :

```bash
find docs -name '*.md' -print0 | while IFS= read -r -d '' file; do
  cmark-gfm -e table "$file" > "${file%.md}.html"
done
```

`-print0` et `-d ''` utilisent le caractère NUL comme séparateur, le seul octet qu’un nom de fichier ne peut pas contenir. `IFS=` empêche que les blancs de début et de fin soient retirés du nom. C’est laid, et c’est la seule version correcte pour n’importe quel nom de fichier qu’on vous confiera un jour.

Sous Windows, le mode d’échec est différent et plus discret. Les règles de guillemets de PowerShell ne sont pas celles du shell — les guillemets simples sont littéraux, les guillemets doubles interpolent `$` —, et sa redirection ne donne pas fiablement de l’UTF-8 : `Out-File` sous Windows PowerShell 5.1 utilise par défaut l’UTF-16 little-endian (vérifié sur learn.microsoft.com, le 8 septembre 2026). Un fichier converti écrit dans un encodage que le navigateur n’attend pas arrive comme un charabia qui ressemble exactement à une faute du convertisseur, écrivez-le donc délibérément avec `| Set-Content -Encoding utf8 out.html` et cessez de deviner.

### Parcourir un dossier avec un glob, et l’ordre que personne n’a demandé

`docs/*.md` fait trois choses auxquelles on ne s’attend pas. Il ne descend pas dans les sous-dossiers, `docs/api/reference.md` est donc silencieusement ignoré. Si rien ne correspond, bash transmet la chaîne littérale `docs/*.md` au convertisseur comme nom de fichier, ce qui produit une erreur déroutante à propos d’un fichier contenant un astérisque ; `shopt -s nullglob` fait qu’un glob vide se développe en rien du tout à la place. Et il trie lexicalement, `10-api.md` arrive donc toujours avant `2-setup.md`.

Ce dernier point est simplement esthétique quand vous convertissez fichier par fichier, et c’est un vrai bogue quand vous concaténez avant de convertir. Rembourrez les numéros — `02-setup.md`, `10-api.md` — et le tri devient correct gratuitement, dans le shell comme dans tout autre outil qui lira ce dossier un jour. Pour la récursivité, soit `shopt -s globstar` et utilisez `docs/**/*.md`, soit utilisez `find`, qui n’a besoin d’aucune option de shell et se comporte de la même façon partout.

Si vous concaténez, `cat` ne suffit pas. `cat` tout seul ne laisse aucune ligne vide entre les fichiers, la dernière ligne de l’un rejoint donc la première ligne du suivant dans un seul paragraphe, et un titre peut se retrouver collé au texte au-dessus :

```bash
awk 'FNR==1 && NR>1 {print ""} 1' docs/*.md > all.md
```

Une ligne vide insérée au début de chaque fichier sauf le premier. C’est toute la correction, et cela vaut la peine d’être connu parce que le symptôme — un titre manquant au milieu d’un long document — ne ressemble en rien à sa cause.

### Garder la sortie près de l’entrée, sans aplatir l’arborescence

`basename` est le mauvais outil pour un dossier de dossiers, et il échoue de la pire façon possible. `docs/api/index.md` et `docs/guide/index.md` deviennent tous deux `index.html`, l’un écrase silencieusement l’autre, et le build réussit avec une page manquante. Rien ne vous avertit, et le fichier qui survit est celui que le glob a atteint en dernier.

Utilisez l’expansion de paramètres, qui conserve le chemin :

```bash
#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob globstar

for file in docs/**/*.md; do
  output="build/${file#docs/}"      # strip the leading docs/
  output="${output%.md}.html"       # swap the extension
  mkdir -p "$(dirname "$output")"   # the tree does not exist yet
  cmark-gfm -e table -e strikethrough "$file" > "$output"
done
```

`${file%.md}.html` change l’extension sans toucher à aucun nom de dossier. `${file#docs/}` retire la racine source, l’arbre de sortie reproduit donc l’arbre d’entrée plutôt que de s’imbriquer à l’intérieur d’une copie de celui-ci. `mkdir -p "$(dirname "$output")"` est la ligne que tout le monde oublie, et son absence se traduit par une redirection qui échoue sur un dossier qui n’existe pas encore — ce qui, au moins, échoue bruyamment.

Un dernier point sur les chemins de sortie. Les liens relatifs entre vos fichiers Markdown sont relatifs au fichier, un lien vers `../guide/index.md` ne survit donc que si l’arbre de sortie a la même forme que l’arbre d’entrée, et seulement si vous réécrivez aussi l’extension `.md` dans la cible du lien. Aplatissez l’arbre et chaque lien interne casse d’un coup, d’une façon qu’aucune option de convertisseur ne peut réparer après coup.

### Les codes de sortie, et le pipeline qui a menti

Le comportement par défaut d’un script shell est de continuer après un échec, puis de déclarer un succès. Une ligne corrige l’essentiel :

```bash
#!/usr/bin/env bash
set -euo pipefail
```

`-e` arrête à la première commande en échec. `-u` transforme une variable non définie en erreur plutôt qu’en chaîne vide, ce qui vous sauve de `rm -rf "$BUILD_DIR/"` le jour où `BUILD_DIR` n’a jamais été défini. `-o pipefail` est celle qui compte ici, parce que le code de sortie d’un pipeline est par défaut celui de la dernière commande :

```bash
cmark-gfm README.md | tee build/README.html   # reports what tee did
```

Le convertisseur peut mourir dès la première ligne et `tee` sortira quand même avec un code zéro, le job est donc vert et le fichier est vide. Avec `pipefail`, le pipeline échoue. Mieux encore, ne mettez rien dans un tube du tout : une simple redirection conserve le propre statut du convertisseur, et c’est la version à privilégier par défaut.

Il y a ensuite les outils dont l’idée de l’échec diffère de la vôtre. `curl` sort avec un code zéro sur un 404 ou un 429 sauf si vous passez `-f`. Pandoc sort avec un code zéro sur des avertissements sauf si vous passez `--fail-if-warnings`. `npx` sans `--yes` n’échoue même pas — il attend une réponse qui ne viendra jamais. Et un script Node qui attrape une erreur, la journalise et poursuit normalement sort avec un code zéro, fixez donc `process.exitCode = 1` dans le `catch`, sans quoi le script ment à votre CI.

Enfin, vérifiez l’absence de fichier vide, car plusieurs de ces échecs en produisent un plutôt qu’aucun :

```bash
[ -s "$output" ] || { echo "empty output: $output" >&2; exit 1; }
```

### Le faire en CI, où l’installation est la partie coûteuse

Tout ce qui précède suppose que le convertisseur est déjà présent. En CI, il ne l’est pas, et l’y amener est en général la chose la plus lente du job.

Trois règles couvrent l’essentiel.

**Épinglez la version, sans quoi la sortie change sans commit.** `npx marked` utilise une installation locale si elle existe, et récupère sinon la plus récente disponible ce matin-là, le HTML que produit votre job peut donc changer alors que votre dépôt ne bouge pas. Installez depuis un fichier de verrouillage avec `npm ci`. Épinglez une version apt ou brew là où l’empaquetage le permet. Utilisez un tag Docker précis plutôt que `latest`. La reproductibilité est la seule raison de mettre une conversion en CI, et un convertisseur non épinglé la jette par la fenêtre tout en ayant l’air de fonctionner.

**Mettez en cache ce que vous pouvez, et préférez ce qui n’a besoin d’aucun cache.** Un binaire statique — comrak, ou votre programme Go compilé — est un seul fichier à restaurer et aucune résolution de dépendances du tout. Une image Docker est un seul pull. Une installation par gestionnaire de paquets est un graphe de dépendances résolu à neuf à chaque exécution. Classez vos options dans cet ordre, et la réponse n’est que rarement celle que la documentation laisse entendre.

**Gardez le secret dans l’environnement, hors du dépôt.** Si la conversion est un appel d’API, la clé vient du coffre à secrets de la CI vers une variable d’environnement, jamais d’un fichier de configuration que quelqu’un aurait commis. `tp login` écrit dans un répertoire personnel que le runner jette de toute façon, ce qui explique précisément l’existence de `TP_API_KEY`.

La liste de contrôle, donc, pour une étape de conversion qui tourne sans surveillance :

- [ ] Versions épinglées dans un fichier de verrouillage et installées avec `npm ci`, pas `npm install`
- [ ] `npx` reçoit `--yes`, pour ne jamais s’arrêter demander la permission de récupérer un paquet
- [ ] `set -euo pipefail` en tête de chaque étape shell
- [ ] `curl` reçoit `-f` ; Pandoc reçoit `--fail-if-warnings`
- [ ] Un code de sortie non nul est traité comme un job en échec, pas comme un avertissement dans le journal
- [ ] La sortie est vérifiée pour son existence et sa taille non nulle avant que quoi que ce soit en aval ne lui fasse confiance
- [ ] La clé d’API est lue depuis une variable d’environnement, jamais depuis un fichier commis

## Comment choisir

1. **Partez de ce qui est déjà installé.** Si Pandoc est sur la machine et dans l’image, utilisez-le et arrêtez de lire, car le coût d’installation qui vous inquiétait est déjà payé. Si le dépôt a Node et rien d’autre, ajouter un convertisseur de documents en quarante formats pour satisfaire un job de cinq lignes est une charge de maintenance que vous porterez encore dans deux ans.
2. **Décidez si la sortie doit s’ouvrir toute seule.** Si une personne va double-cliquer sur le fichier, il vous faut un document complet avec ses styles en ligne, ce qui signifie Pandoc avec `--standalone --embed-resources`, ou votre propre gabarit. Tous les autres outils de cette page donnent un fragment, et un fragment envoyé par e-mail à un collègue se rend comme du texte sans style, sur toute la largeur de la fenêtre.
3. **Faites correspondre le dialecte au fichier avant de faire correspondre l’outil au dialecte.** Si les documents ont des tableaux ou des listes de tâches, la commande doit demander explicitement le GFM : `-f gfm` pour Pandoc, `-e table` et compagnie pour cmark-gfm, `--gfm` pour comrak, `-x tables` pour Python-Markdown. Convertissez un fichier représentatif et regardez les tableaux avant de valider le script, car un tableau non analysé ne lève pas d’erreur.
4. **Décidez du sort du HTML brut avant de convertir le fichier de quelqu’un d’autre.** Pour vos propres notes, cela n’a pas d’importance. Pour un README venu d’un fork, soit le convertisseur supprime le HTML brut par défaut — cmark-gfm et comrak le font, markdown-it l’échappe —, soit vous ajoutez un assainisseur, soit vous acceptez que tout ce que contenait ce fichier s’exécutera dans le navigateur de quiconque ouvrira la sortie.
5. **Comptez les codes de sortie, pas les fonctionnalités.** Quel que soit votre choix, son échec doit remonter jusqu’au statut du job. Cela signifie `pipefail`, une redirection plutôt qu’un tube, `-f` sur `curl`, `--fail-if-warnings` sur Pandoc, et une vérification de taille sur la sortie. Une étape de conversion qui ne peut pas échouer est une étape de conversion à laquelle vous finirez par ne plus faire confiance, puis que vous cesserez de lire.
6. **Chronométrez l’installation une fois, honnêtement.** Exécutez le job avec le convertisseur installé, puis avec lui mis en cache ou retiré. Si l’installation domine, remplacez-la par un binaire statique, une image, ou un appel d’API, et mettez les chiffres mesurés dans la pull request pour que la prochaine personne n’ait pas à se disputer à ce sujet en repartant de zéro.

## Conclusion

Choisissez la forme la plus petite qui répond au problème, puis dépensez votre attention sur le shell plutôt que sur l’analyseur. Pour du HTML sur disque qui doit avoir l’air fini, Pandoc avec `-f gfm -s --embed-resources` est une seule ligne et la bonne ligne ; pour du HTML sur disque dans un dépôt qui a déjà Node, écrivez le script de cinq lignes avec son propre gabarit et possédez l’emballage. Pour un dossier, mettez des guillemets sur vos expansions, conservez l’arborescence, et fixez `-euo pipefail` pour que le job dise la vérité sur ce qui s’est passé. Et pour un lien que quelqu’un peut ouvrir sans aucune chaîne d’outils à lui — rien à installer, rien à épingler, rien à mettre en cache — une seule requête suffit — une fois qu’on a réglé [ce à quoi cette requête devrait ressembler, et ce qu’une API de conversion doit à un script quand le fichier est cassé](/blog/converting-documents-with-an-api) — et la même conversion tourne [dans le navigateur, chez TransformPipe](/), gratuitement, le fichier ne quittant jamais votre machine quand vous n’êtes pas connecté.

## FAQ

### Quel est le convertisseur Markdown en ligne de commande le plus simple à installer ?

comrak, si l’on considère que télécharger un binaire statique unique revient à installer quelque chose, car il n’y a rien d’autre à résoudre et rien qui reste sur la machine ensuite. Si Node est déjà présent, `npx --yes marked` ou `npx --yes markdown-it` n’installe rien de permanent du tout. Pandoc est le plus capable et le plus volumineux, et il ne mérite sa taille que lorsqu’il vous faut des formats au-delà du HTML ou un contrôle exact de l’emballage.

### Comment convertir tout un dossier de fichiers Markdown d’un coup ?

Laissez le shell faire la boucle — aucun de ces outils n’a besoin d’un mode par lot. Utilisez `find … -print0` relié à une boucle `while IFS= read -r -d ''` pour que les noms de fichiers piégeux survivent, construisez le chemin de sortie avec `${file%.md}.html` pour préserver l’arborescence, et faites un `mkdir -p` sur la destination avant d’y rediriger. Placez `set -euo pipefail` en tête, sinon un échec à mi-parcours continuera de déclarer un succès.

### Pourquoi mon HTML converti n’a-t-il aucun style ?

Parce que l’outil vous a donné un fragment, ce qui est ce que la plupart d’entre eux sont conçus pour faire. cmark-gfm, comrak, marked, markdown-it et `python -m markdown` produisent tous du contenu de corps sans doctype, sans en-tête et sans styles, et un navigateur le rend dans sa police par défaut, sur toute la largeur de la fenêtre. Utilisez soit `--standalone --embed-resources` de Pandoc, soit écrivez l’emballage une fois dans un script et réutilisez-le partout.

### Ces convertisseurs assainissent-ils le HTML ?

Certains le font, d’autres non, délibérément, et il faut savoir lequel vous utilisez avant de convertir un fichier venu de l’extérieur. cmark-gfm et comrak suppriment le HTML brut sauf si vous passez `--unsafe` ; markdown-it l’échappe sauf si vous activez son option `html` ; marked le laisse passer et documente que l’assainissement n’est pas son travail ; Pandoc le laisse passer aussi. Le `--sandbox` de Pandoc protège la machine qui convertit, pas le navigateur du lecteur.

### Pourquoi ma conversion réussit-elle en CI tout en ne produisant rien ?

Presque toujours un pipeline qui a masqué l’échec, ou un convertisseur qui traite un échec comme un avertissement. `cmark-gfm file.md | tee out.html` renvoie le code de sortie de `tee`, un convertisseur mort se lit donc comme un succès — utilisez `set -o pipefail`, ou redirigez plutôt que de mettre en tube. Ajoutez ensuite `-f` à `curl` et `--fail-if-warnings` à Pandoc, et testez le résultat avec `[ -s "$output" ]` avant que quoi que ce soit en aval n’en dépende.

### Pandoc est-il trop lent pour la CI ?

La conversion de Pandoc est rapide ; c’est l’installation qui coûte, et elle coûte à chaque exécution plutôt qu’une seule fois. Combien dépend entièrement de la méthode — un pull d’image Docker ou un cache restauré est rapide, un gestionnaire de paquets résolvant des dépendances à neuf ne l’est pas — mesurez donc votre propre pipeline plutôt que de faire confiance au chiffre publié par quelqu’un d’autre. Si l’installation domine le job, un simple binaire statique ou un appel HTTP l’élimine complètement.

### Puis-je convertir du Markdown en HTML sans aucune installation locale ?

Oui, de deux façons. Postez le fichier vers une API HTTP avec `curl` et récupérez du JSON, un fichier HTML, ou un lien en direct ; ou, sur une pull request, utilisez une GitHub Action pour que le runner n’installe jamais de convertisseur du tout. Les deux ont besoin d’un réseau et d’un secret, gardez donc aussi un convertisseur local dans le build s’il doit également fonctionner hors ligne.
