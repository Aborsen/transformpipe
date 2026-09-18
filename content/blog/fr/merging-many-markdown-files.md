---
title: Faire d’un dossier de fichiers Markdown un document unique
description: "Fusionner un dossier de fichiers Markdown en un seul : ordre, niveaux de titre, liens entre fichiers, chemins d’images et sommaire, avec des scripts"
updated: 2026-09-09
date: 2026-07-16
tag: Conversion
keywords: fusionner des fichiers markdown, combiner plusieurs fichiers markdown, concaténer markdown, plusieurs fichiers markdown en un seul html, sommaire markdown, ancres de titres markdown, fusionner des fichiers markdown avec pandoc, générateur de sommaire markdown, mdbook summary.md
---

Un manuel tient rarement dans un seul fichier. C’est un dossier — une introduction, six chapitres, une annexe — pour que deux personnes puissent en modifier des parties différentes en même temps. Puis quelqu’un réclame l’ensemble sous forme d’une page unique. Réunir les fichiers ne demande qu’un `cat`, et le résultat est faux de la même poignée de façons à chaque fois.

### En bref

`cat *.md > handbook.md` se trompe d’ordre, vous donne un `<h1>` par chapitre, transforme le front matter de chaque fichier en titre égaré, et laisse pointer dans le vide tous les liens qui visaient un fichier voisin. Corrigez dans cet ordre : décidez où habite l’ordre de lecture (un manifeste vaut mieux que des préfixes numériques), rétrogradez chaque titre d’un niveau en surveillant les clôtures de code, retirez le front matter à la lecture de chaque partie, et réécrivez `03-deploy.md#tls` en `#tls` avant toute conversion. Pandoc fait les trois premiers points avec `--shift-heading-level-by=1`, `--file-scope` et `--toc`. Au-delà de quelques dizaines de parties, cessez de fusionner et prenez un outil de livre.

Les défaillances ont toutes la même forme : quelque chose, dans chaque fichier, avait été écrit relativement à ce fichier, et après la fusion il n’existe plus de « ce fichier ». Un niveau de titre était relatif à un document qui commençait à `#`. Un lien était relatif à un répertoire. Un chemin d’image était relatif à un dossier situé deux niveaux plus bas. Un identifiant d’ancre était unique dans un chapitre et ne l’est pas à travers dix.

Rien de tout cela ne s’annonce. Un document fusionné s’affiche. Il s’affiche simplement de travers — le sommaire saute au mauvais chapitre, une image devient une icône cassée, et un lien ouvre une boîte de dialogue de téléchargement pour un fichier absent. Chacune de ces choses est découverte par un lecteur, jamais par le build.

Ce qui suit, c’est le travail entier : un ordre qui survit à une insertion, un script de fusion que vous pouvez lire et exécuter, la réécriture des liens et des images, les collisions d’ancres, le sommaire, ce dont Pandoc se charge déjà, ce qu’exige l’impression, et le moment où la fusion est le mauvais outil et où le livre est le bon.

## Ce qui casse, et dans quel ordre

Prenez-les dans cette séquence. L’ordre d’abord, parce que toutes les corrections suivantes supposent que vous savez quelle partie venait d’où ; les liens en dernier, parce qu’ils ont besoin des identifiants que le convertisseur finira par produire.

| Ce qui casse | Ce que vous voyez | Pourquoi | La correction |
| --- | --- | --- | --- |
| L’ordre | Le chapitre 10 avant le chapitre 2 | Un glob trie des chaînes, pas des nombres | Des préfixes complétés par des zéros, ou un manifeste |
| Les niveaux de titre | Dix éléments `<h1>`, aucun plan | Chaque partie a été écrite pour tenir seule | Rétrograder chaque titre d’un niveau |
| Les commentaires de code | `# install the agent` devient un titre | Un `sed` aveugle ne voit pas une clôture de code | Suivre l’état des clôtures pendant la réécriture |
| Le front matter | `title: Running jobs` arrive en `<h2>` | Plus rien ne cherche d’en-tête après le premier fichier | Retirer le bloc à la lecture de chaque partie |
| Les séparateurs | Un titre de chapitre se change en titre | `---` sous une ligne de texte, c’est la syntaxe setext | Séparer avec `***` |
| Les liens entre fichiers | Un lien vers un fichier qui n’est plus là | `03-deploy.md#tls` nommait un voisin | Réécrire en `#tls` |
| Les liens vers un fichier entier | Un lien sans fragment à viser | `[deploying](03-deploy.md)` n’a pas d’ancre | Associer chaque nom de fichier à l’identifiant de son titre |
| Les chemins d’images | Une icône d’image cassée | Les chemins relatifs se résolvent désormais depuis le fichier fusionné | Rebaser les chemins de chaque partie, ou les intégrer |
| Les collisions d’ancres | Deux titres « Vue d’ensemble », un seul identifiant | Les identifiants viennent du texte des titres | Préfixer par fichier source, ou renommer |
| Les identifiants de notes | Une note de bas de page atterrit sur la mauvaise | Chaque partie recommence sa numérotation à `[^1]` | Analyser fichier par fichier, ou préfixer les étiquettes |
| Le sommaire | Des entrées qui ne mènent nulle part | La règle de slug a deviné autrement que le moteur de rendu | Le générer depuis la sortie, pas depuis l’entrée |
| Les sauts de page | Les chapitres s’enchaînent en milieu de page dans le PDF | Markdown n’a pas de syntaxe de saut de page | Une règle CSS de fragmentation à chaque couture |

Le reste de cet article, c’est ce tableau, une ligne après l’autre, avec le code.

## L’ordre, correctement

`cat *.md` vous donne ce que produit le glob, et un glob trie des chaînes, pas des nombres : `chapter10.md` vient avant `chapter2.md`, parce que `1` se classe avant `2` et que la comparaison s’arrête là. Répartir les parties dans des sous-dossiers ne change rien. L’ordre peut habiter à trois endroits, et ils ne se valent pas.

### Les préfixes numériques, et le problème du remplissage par des zéros

Complétez le préfixe numérique par des zéros et le tri devient l’ordre de lecture :

```
handbook/
  00-introduction.md
  10-installing.md
  20-configuration.md
  30-running-jobs.md
  90-appendix-glossary.md
```

Des pas de dix laissent la place d’insérer une partie plus tard. Deux chiffres offrent cent emplacements, ce qui est plus qu’il n’en faut à un manuel et moins qu’il n’en faut à un corpus de documentation ; trois chiffres font bureaucratique et n’obligent jamais à renuméroter.

Le remplissage doit être uniforme. Mêler `9-intro.md` et `10-setup.md` reproduit le bogue d’origine à plus petite échelle, puisque `1` se classe toujours avant `9`. Et recompléter plus tard revient à renommer tous les fichiers, ce qui invalide tous les liens entrants, tous les signets et l’historique que `git log --follow` suivait. Choisissez une largeur le premier jour et tenez-vous-y.

Deux autres coûts méritent d’être nommés. Les préfixes fuient : si le même dossier est aussi publié par un générateur, `10-installing` se retrouve dans l’URL, et l’en retirer est encore une règle dans encore un fichier de configuration. Et le tri de chaînes dépend des paramètres régionaux — un même glob peut ordonner différemment des noms de fichiers accentués ou à casse mélangée sur deux machines, une divergence que personne ne remarque jusqu’au jour où l’intégration continue produit un document que l’auteur n’arrive pas à reproduire. Le `sort -V` des GNU coreutils est un « tri naturel des nombres (de version) à l’intérieur d’un texte » (vérifié sur man7.org, le 9 septembre 2026), ce qui esquive entièrement la question du remplissage — mais il n’est pas présent sur tous les systèmes où tournera votre script : vérifiez donc `sort --version` avant qu’un build en dépende.

### Un fichier manifeste

Si renommer est exclu parce que d’autres documents pointent vers ces chemins, ou si l’ordre doit différer de l’alphabet pour une raison quelconque, gardez l’ordre dans un fichier et lisez celui-ci à la place :

```bash
grep -vE '^[[:space:]]*(#|$)' order.txt | xargs cat > handbook.md
```

Un chemin par ligne ; les lignes vides et les commentaires en `#` disparaissent. Voilà tout le mécanisme, et c’est pourquoi le manifeste l’emporte : l’ordre devient une chose que l’on peut lire, relire dans une pull request et commenter.

Bien souvent, le dépôt en possède déjà un, et en ajouter un second est la manière dont les deux se mettent à diverger :

- **mdBook** utilise `SUMMARY.md`. « Le fichier de sommaire sert à mdBook pour savoir quels chapitres inclure, dans quel ordre ils doivent apparaître, quelle est leur hiérarchie et où se trouvent les fichiers sources. Sans ce fichier, il n’y a pas de livre. » (vérifié sur rust-lang.github.io, le 9 septembre 2026)
- **MkDocs** utilise la clé `nav` de `mkdocs.yml`, qui « sert à déterminer le format et la disposition de la navigation globale du site ». Si vous l’omettez, « `nav` contiendra une liste imbriquée, triée alphanumériquement, de tous les fichiers Markdown trouvés dans le `docs_dir` » — c’est-à-dire de nouveau le problème du glob, avec un fichier de configuration devant. (vérifié sur mkdocs.org, le 9 septembre 2026)
- **Quarto** liste les parties d’un livre sous `book: chapters:` dans `_quarto.yml`. (vérifié sur quarto.org, le 9 septembre 2026)

N’importe lequel de ces fichiers est déjà la source de vérité. Lisez-le plutôt que de le dupliquer. `SUMMARY.md` est une liste imbriquée de liens Markdown : les chemins s’en extraient donc d’une seule expression.

```bash
grep -oE '\]\(([^)]+\.md)\)' SUMMARY.md | sed -E 's|^\]\((.*)\)$|\1|'
```

L’ordre de la sortie est l’ordre du fichier, qui est l’ordre du livre.

### L’ordre dans le front matter

La troisième option garde l’ordre à l’intérieur de chaque partie, sous forme de clé numérique dans son propre en-tête :

```yaml
---
title: Running jobs
order: 30
---
```

L’ordre voyage avec le fichier : déplacez-le, renommez-le, il sait toujours où il va. Rien n’a besoin d’être renuméroté, et il n’y a pas de second fichier à oublier. C’est un avantage réel, et il se paie au triple.

Il vous faut désormais un analyseur YAML pour trier, parce qu’un `grep` sur `order:` se casse la première fois que quelqu’un met la valeur entre guillemets ou l’indente sous une autre clé. L’ordre est invisible : personne ne peut voir la séquence de lecture sans lancer l’outil. Et rien n’empêche deux parties de revendiquer `order: 30`, auquel cas l’égalité est tranchée par le comportement de votre tri sur des clés identiques, en général l’ordre des noms de fichiers, et jamais écrit nulle part. Ce qu’un convertisseur fait de cet en-tête au moment du rendu est une autre question, et [il existe quatre réponses possibles](/blog/front-matter-and-what-converters-do-with-it), dont une seule vous convient.

### Lequel préférer

| Où habite l’ordre | Coût | Échoue quand | Idéal pour |
| --- | --- | --- | --- |
| Des préfixes numériques complétés par des zéros | Un renommage pour insérer ou réordonner | Le remplissage est incohérent, ou les paramètres régionaux diffèrent | Un dossier appartenant à une seule personne |
| Un fichier manifeste | Une ligne à ajouter par nouvelle partie | Quelqu’un ajoute un fichier et oublie la ligne | Tout ce qui est relu dans une pull request |
| Une clé dans le front matter de chaque fichier | Un analyseur YAML dans le script de fusion | Deux parties revendiquent le même numéro | Des fichiers qui circulent entre les dossiers |

Préférez le manifeste, et préférez celui que le dépôt possède déjà. C’est la seule option où l’ordre de lecture est un artefact relisible plutôt qu’une propriété émergente, et la seule où « ce chapitre manque au build » se manifeste par une ligne absente dans un diff plutôt que par un fichier auquel personne n’a pensé. Le mode de défaillance compte davantage que la commodité : une ligne de manifeste oubliée fait disparaître un chapitre en silence, mais une coquille dans un préfixe aussi, et une seule des deux se voit dans une relecture de code.

Utilisez aussi des préfixes si cela vous plaît — ils rendent le dossier lisible dans un listing — mais laissez le manifeste décider. L’ordre par front matter ne vaut la peine que lorsque des parties circulent vraiment entre des répertoires, ce qui est plus rare qu’il n’y paraît.

## Les trois retouches, et un script qui les applique

Chaque partie a besoin des mêmes trois changements à l’entrée : ses titres rétrogradés, son front matter retiré, et une rupture visible placée devant elle. Voici chacun d’eux, puis le script qui fait les trois en une passe.

### Rétrograder les titres

Chaque partie a été écrite pour tenir seule : chacune commence donc par un unique titre en `#`. Enchaînez-en dix et le document compte dix éléments `<h1>` et aucun plan.

Il y a deux réponses. Traiter chaque `#` comme un titre de chapitre et ne rien mettre au-dessus, ce qui fonctionne tant que le fichier n’est jamais qu’une pile de chapitres. Ou rétrograder chaque titre d’un niveau et ajouter un unique titre en `#`. `sed 's/^#/##/'` abîme votre code en chemin : un commentaire `# install the agent` à l’intérieur d’un bloc clôturé est rétrogradé lui aussi. Suivez les clôtures.

Il y a aussi un plafond. CommonMark fixe la séquence d’ouverture d’un titre ATX à « 1 à 6 caractères `#` non échappés », et « plus de six caractères `#` n’est pas un titre » (vérifié sur spec.commonmark.org, le 9 septembre 2026) — un septième dièse vous donne un paragraphe qui commence par des dièses. Une partie qui utilise déjà `######` pour quelque chose n’a donc nulle part où aller, et la passe de rétrogradation doit laisser ces titres tranquilles plutôt que de les changer discrètement en texte. En pratique, un document qui emploie six niveaux de titre vous dit qu’il aurait dû être deux documents.

### Séparer les parties

Une rupture visible indique au lecteur qu’une partie s’est terminée et qu’une autre commence. `---` seul sur une ligne devient un `<hr>`, mais directement sous une ligne de texte c’est de la syntaxe setext, qui change cette ligne en `<h2>`. Séparez les parties par `***` : le même `<hr>`, jamais un soulignement de titre.

Laissez une ligne vide de part et d’autre. Un séparateur collé à la dernière ligne de la partie précédente, c’est le même accident setext par un autre chemin.

### Retirer le front matter

Ce sont les mêmes tirets qui causent le dernier problème. Les parties écrites pour un site statique s’ouvrent sur un bloc de front matter, et après le premier fichier plus rien n’en cherche : le `---` d’ouverture devient un filet, les clés deviennent un paragraphe, et le `---` de fermeture le souligne — setext de nouveau, si bien que `title: Running jobs` arrive en `<h2>` au milieu du document. C’est le résultat de rendu, et c’est toujours celui que vous obtenez dès que plus rien ne cherche le bloc.

Retirez-le à la lecture de chaque partie, et uniquement tout en haut du fichier, pour qu’un séparateur `---` situé plus bas survive :

```bash
awk 'NR == 1 && /^---$/ { fm = 1; next }
     fm && /^---$/       { fm = 0; next }
     !fm                 { print }' "$file"
```

Si les titres présents dans ces en-têtes valent la peine d’être conservés — et c’est en général le cas, puisque ce sont les noms des chapitres —, extrayez-les avant de jeter le bloc et émettez chacun comme un titre. C’est la version à écrire si les parties ne commencent pas déjà par un titre en `#` qui leur est propre.

### Le script, en shell

Il lit un manifeste, retire le front matter de chaque partie, rétrograde ses titres hors des clôtures de code, et pose un filet entre les parties.

```bash
#!/bin/sh
# merge.sh — one document from a manifest of Markdown parts.
set -eu

manifest=${1:-order.txt}
out=${2:-handbook.md}
: > "$out"

grep -vE '^[[:space:]]*(#|$)' "$manifest" | while IFS= read -r part; do
  if [ -s "$out" ]; then printf '\n***\n\n' >> "$out"; fi

  awk '
    # A front matter block, but only at the very top of the file.
    NR == 1 && /^---[[:space:]]*$/ { fm = 1; next }
    fm && /^---[[:space:]]*$/      { fm = 0; next }
    fm                             { next }

    # Track fences, so nothing inside a code block is rewritten.
    /^[[:space:]]*(```|~~~)/ { fence = !fence; print; next }

    # Demote a real heading, unless it is already at the sixth level.
    !fence && /^#+[ \t]/ {
      hashes = $0
      sub(/[^#].*$/, "", hashes)
      if (length(hashes) < 6) { print "#" $0 } else { print }
      next
    }

    { print }
  ' "$part" >> "$out"

  printf '\n' >> "$out"
done
```

Une réserve honnête : `fence` est un unique drapeau qui couvre les deux caractères de clôture, il bascule donc sur une ligne de tildes située à l’intérieur d’un bloc clôturé par des accents graves. C’est rare, et il vaut mieux le savoir avant de reprocher au script un chapitre dont tous les titres sont ressortis un niveau trop haut.

### La même chose en Node

La version shell convient à une chaîne figée. Dès l’instant où vous devez réécrire des liens ou rebaser des images, il vous faut savoir de quel fichier provient chaque ligne au moment où vous la réécrivez, et c’est bien plus facile dans un vrai programme :

```js
// merge.mjs — node merge.mjs order.txt handbook.md
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [manifest = 'order.txt', out = 'handbook.md'] = process.argv.slice(2);
const root = dirname(manifest);

const parts = readFileSync(manifest, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

// No `m` flag: `^` is the start of the string, so only a block at the very
// top of the file is removed.
const stripFrontMatter = (text) =>
  text.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/, '');

const demote = (text) => {
  let fenced = false;

  return text.split(/\r?\n/).map((line) => {
    if (/^\s{0,3}(?:`{3,}|~{3,})/.test(line)) {
      fenced = !fenced;
      return line;
    }

    if (fenced) return line;

    const heading = line.match(/^(#{1,6})[ \t]/);
    return heading && heading[1].length < 6 ? `#${line}` : line;
  }).join('\n');
};

const merged = parts
  .map((part) => demote(stripFrontMatter(readFileSync(join(root, part), 'utf8'))).trim())
  .join('\n\n***\n\n');

writeFileSync(out, `${merged}\n`);
```

L’équivalent Python, ce sont les mêmes quarante lignes avec `re` et `pathlib` ; rien là-dedans n’exige de bibliothèque. Quel que soit le langage, gardez les trois transformations comme des fonctions distinctes qui prennent du texte et renvoient du texte, car la réécriture des liens et des images de la section suivante vient se glisser entre elles et vous voudrez tester chacune séparément.

Quand la fusion tourne à chaque commit, [convertir du Markdown depuis un terminal](/blog/markdown-to-html-from-the-command-line) couvre le versant intégration continue, et [convertir un dossier fichier par fichier](/blog/batch-convert-markdown-files) est l’autre moitié du même problème — celle où la sortie reste un ensemble de pages.

## Les liens entre fichiers, et ceux que vous allez manquer

C’est la partie que la plupart des guides sautent, et c’est celle que les lecteurs remarquent en premier, parce qu’un lien cassé est un clic qui ne mène nulle part plutôt qu’un paragraphe qui a l’air légèrement de travers.

À l’intérieur du dossier, `[retries](30-running-jobs.md#retries)` est correct. Après la fusion, la cible se trouve dans le même document et le nom de fichier doit disparaître, faute de quoi le lien désigne un fichier qui ne se trouve plus à côté du lecteur :

```bash
sed -E 's|\]\([0-9A-Za-z._/-]+\.md#|](#|g' handbook.md > tmp && mv tmp handbook.md
```

Cela règle la forme courante. Il y en a quatre autres, et chacune mérite d’être dite à voix haute.

**Un lien vers un fichier entier.** `[deploying](03-deploy.md)` n’a pas de fragment à conserver : il n’y a donc rien vers quoi une expression régulière puisse le réécrire. Il lui faut l’identifiant du titre de ce fichier, ce qui suppose de construire une table pendant la lecture des parties — nom de fichier vers identifiant de son premier titre — et de la consulter dans une seconde passe. C’est la raison d’écrire la fusion dans un langage doté d’un dictionnaire.

**Les liens de style référence.** `[retries]: 30-running-jobs.md#retries` se trouve au bas du fichier, dans un bloc de définitions, et le motif en ligne ci-dessus ne le touche jamais. Il lui faut sa propre règle, ancrée en début de ligne :

```bash
sed -E 's|^(\[[^]]+\]:[[:space:]]*)[0-9A-Za-z._/-]+\.md#|\1#|' handbook.md > tmp && mv tmp handbook.md
```

**Les liens en HTML brut.** `<a href="30-running-jobs.md">` traverse l’analyseur intact, parce que Markdown laisse passer le HTML brut à dessein. Aucun outil de réécriture conscient du Markdown ne le trouvera. Cherchez `href=` au grep dans la source autant que dans la sortie.

**Les destinations encodées et entre chevrons.** Un chemin contenant une espace arrive sous la forme `](<03 deploy.md#tls>)` ou `](03%20deploy.md#tls)`, et aucun des deux ne correspond à une classe de caractères qui supposait ni espaces ni signes pour cent. Les noms de fichiers contenant des espaces méritent d’être proscrits pour cette seule raison.

### Retrouver ceux qui vous ont échappé

Ne faites pas confiance à la réécriture. Cherchez dans le Markdown fusionné tout ce qui pointe encore vers un fichier :

```bash
grep -nE '\]\([^)#][^)]*\.md' handbook.md
grep -n 'href="' handbook.md
```

Vérifiez ensuite le HTML converti, là où cela compte vraiment. Chaque lien interne devrait avoir une cible portant cet identifiant, et les deux listes se comparent :

```bash
grep -oE 'href="#[^"]+"' handbook.html | sed -E 's/.*"#(.*)"/\1/' | sort -u > wanted
grep -oE 'id="[^"]+"'    handbook.html | sed -E 's/.*"(.*)"/\1/'  | sort -u > present
comm -23 wanted present
```

`comm -23` affiche les lignes présentes seulement dans le premier fichier : tous les liens vers un fragment qui n’ont nulle part où atterrir. Un résultat vide, c’est le contrôle qui passe. Mettez-le dans le build, parce qu’il ne coûte rien et que c’est le seul de ces contrôles qu’un document qui s’affiche ne peut pas tromper.

### Les chemins d’images après la fusion

`![Flow](img/flow.png)` dans `handbook/chapters/03-deploy.md` se résout par rapport à `handbook/chapters/`. Déplacez cette ligne dans `handbook.md` à la racine du dépôt, et le navigateur cherche `img/flow.png` à côté du fichier fusionné, ne trouve rien, et dessine l’icône d’image cassée. Rien n’a changé dans la ligne ; c’est ce par rapport à quoi elle s’exprimait qui a changé.

Chaque destination d’image relative doit donc être rebasée du répertoire propre à la partie vers celui de la sortie. Dans le script Node, à l’endroit où vous connaissez déjà les deux :

```js
import { relative, sep } from 'node:path';

const rebaseImages = (text, from, to) =>
  text.replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (match, head, target) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(target)) return match;
    return head + relative(to, join(from, target)).split(sep).join('/');
  });
```

Le garde-fou laisse tranquilles les chemins absolus, les fragments et tout ce qui porte un schéma ; le `split(sep).join('/')` est là parce que Windows renvoie des barres obliques inverses et qu’une URL n’est pas un chemin de système de fichiers. Exécutez-le avant la réécriture des liens, et uniquement sur les destinations d’images, pour qu’il n’entre pas en conflit avec la passe qui transforme les liens en `.md#` en fragments.

Des chemins corrects rendent le Markdown fusionné correct. Ils ne rendent pas le HTML transportable : le fichier ne fonctionne toujours que tant que ces images se trouvent au bon endroit à côté de lui, ce qui ne sera plus vrai une fois que quelqu’un l’aura envoyé par courriel. Le remède consiste à intégrer les images en URI de données, ou à convertir avec un outil qui produit un fichier autonome — [lesquels de vos images et de vos liens fonctionnent encore après un déplacement du fichier](/blog/images-and-links-that-still-work) est toute la question, et elle mérite d’être réglée avant tout envoi.

## Les collisions d’ancres, et ce que chaque moteur de rendu en fait

Les identifiants de titres viennent du texte des titres : une `## Vue d’ensemble` dans le chapitre d’installation et une `## Vue d’ensemble` dans le chapitre sur les tâches veulent donc toutes deux le même identifiant. Dans dix chapitres écrits par quatre personnes, « Vue d’ensemble », « Configuration », « Dépannage » et « Exemples » vont tous apparaître plus d’une fois. Chacun est une collision.

La suite dépend entièrement de ce qui convertit le fichier.

| Ce qui l’affiche | Ce que reçoit la seconde « Vue d’ensemble » | Source |
| --- | --- | --- |
| github-slugger, la règle que suivent les ancres de GitHub | `overview-1`, puis `overview-2` | `slugger.slug('foo')` renvoie `foo`, puis `foo-1` ; licence ISC (vérifié sur github.com, le 9 septembre 2026) |
| markdown-it-anchor | `overview-1` | Les identifiants générés automatiquement « ajoutent toujours un suffixe en cas de collision » ; `uniqueSlugStartIndex` vaut 1 par défaut ; Unlicense (vérifié sur github.com, le 9 septembre 2026) |
| Pandoc avec `--file-scope` | Un identifiant préfixé d’après le nom de fichier | « des préfixes fondés sur les noms de fichiers seront ajoutés aux identifiants afin de les distinguer, et les liens internes seront ajustés en conséquence » (vérifié sur pandoc.org, le 9 septembre 2026) |
| Un convertisseur sans déduplication | Le même identifiant, deux fois, dans un seul document | Le navigateur saute au premier venu |

Chacun de ces comportements se défend et aucun ne s’accorde avec un autre. Un lien écrit `[voir](#overview)` est donc imprévisible d’un outil à l’autre : chez l’un il atteint la section du premier chapitre, chez un autre un élément qui n’existe que parce que l’outil a compté, chez un troisième un identifiant en double au sujet duquel la spécification n’a jamais rien promis. Pire, le suffixe dépend de l’ordre du document : insérer un chapitre renumérote toutes les collisions qui suivent et redirige en silence des liens qui fonctionnaient.

Trois remèdes, le meilleur d’abord.

**Rendez les titres distincts.** `## Configurer l’agent` et `## Configurer une tâche` font une meilleure documentation indépendamment de la fusion, et ils suppriment le problème au lieu de le gérer. Un lecteur qui parcourt un sommaire comportant dix entrées « Vue d’ensemble » identiques n’est aidé par aucune quantité de suffixes.

**Préfixez par fichier source au moment de la fusion.** Si renommer n’est pas envisageable, réécrivez chaque titre à la lecture pour que son identifiant porte la partie dont il vient — `deploy-overview`, `installing-overview`. Là où la syntaxe existe, un identifiant explicite sur le titre est exact :

```
## Overview {#deploy-overview}
```

Cette accolade en fin de ligne est une extension, pas du CommonMark : Pandoc la gère, et dans le monde JavaScript elle réclame un greffon. Si votre convertisseur ne la connaît pas, préfixez plutôt le texte du titre, ou acceptez la déduplication propre à l’outil et générez le sommaire depuis la sortie pour que les deux s’accordent.

**Lisez les identifiants produits par le convertisseur.** Ne devinez pas la règle de slug. Convertissez une fois, regardez le HTML, et prenez les identifiants là. TransformPipe préfixe chaque identifiant de titre par `doc-`, et son onglet de source HTML montre le fichier exact — ce qui est un exemple particulier du point général : la seule règle de slug fiable est celle que vous pouvez lire dans la sortie.

La même collision frappe les notes de bas de page, ce que l’on remarque bien plus tard. Chaque partie qui a des notes les commence à `[^1]` : un document fusionné a donc quatre définitions `[^1]` et quatre appels qui se résolvent tous vers celle que l’analyseur a retenue. Soit vous analysez chaque fichier séparément, ce à quoi sert exactement le `--file-scope` de Pandoc, soit vous préfixez les étiquettes à la lecture de chaque partie.

## Le sommaire

Une fois les parties rétrogradées, chaque `##` est un chapitre — un sommaire qui n’attend que d’être généré. Il y a quatre façons d’en obtenir un, et la question décisive est la même dans tous les cas : la cible de l’entrée correspond-elle à l’identifiant que le moteur de rendu émettra réellement ?

| Voie | Ce qu’elle coûte | Quand elle a raison |
| --- | --- | --- |
| À la main | Il vieillit en silence, et personne ne le remarque pendant des mois | Cinq chapitres qui ne bougeront pas |
| Généré au moment de la fusion | Vous possédez la règle de slug, et elle doit coïncider avec celle du convertisseur | La fusion est déjà un script |
| doctoc | Une installation Node ; il écrit dans le fichier entre des marqueurs | Un README dans un dépôt git, rafraîchi à chaque commit |
| markdown-toc | Une installation Node ; un marqueur `<!-- toc -->` | Le même travail, si vous préférez ce style de marqueur |
| Depuis le convertisseur | Rien, et les identifiants coïncident par construction | Vous convertissez en HTML de toute façon |

**Généré au moment de la fusion.** Parcourez le fichier fusionné une fois, hors des clôtures, et imprimez une entrée par titre :

```bash
awk '/^```/ { fence = !fence; next }
     !fence && /^## / {
       title = substr($0, 4)
       slug  = tolower(title)
       gsub(/[^a-z0-9 -]/, "", slug)
       gsub(/ /, "-", slug)
       printf "- [%s](#%s)\n", title, slug
     }' handbook.md
```

Cette règle de slug — tout en minuscules, ponctuation supprimée, espaces changées en traits d’union — tient pour des titres anglais et diverge sur les accents et les doublons. Elle suppose aussi que l’identifiant est le slug nu : un convertisseur qui préfixe les identifiants veut ce préfixe dans le lien. Les entrées générées et les titres viennent du même texte : renommer un chapitre renomme donc son entrée.

**doctoc** « génère des sommaires pour les fichiers Markdown d’un dépôt git local. Les liens sont compatibles avec les ancres générées par GitHub ou d’autres sites ». Installez-le avec `npm install -g doctoc`, marquez l’emplacement avec `<!-- START doctoc -->` et `<!-- END doctoc -->`, puis lancez `doctoc handbook.md` ; `--github`, `--maxlevel` et `--title` contrôlent le style des ancres, la profondeur et le titre qu’il écrit au-dessus de la liste. Sous licence MIT (vérifié sur github.com, le 9 septembre 2026).

**markdown-toc** fait le même travail avec un marqueur plus court : placez `<!-- toc -->` là où vous voulez la liste et lancez `markdown-toc -i handbook.md` pour l’écrire sur place, entre `<!-- toc -->` et `<!-- tocstop -->`. Installation avec `npm install -g markdown-toc`. Sous licence MIT (vérifié sur github.com, le 9 septembre 2026).

Les deux visent les ancres de GitHub, ce qui est exactement juste quand le fichier fusionné sera lu sur GitHub et exactement faux quand il passe par un convertisseur doté d’une autre règle d’identifiants. C’est là le piège : un sommaire généré selon une règle de slug et rendu par une autre produit une page où chaque entrée est un lien et où aucun ne fait bouger la page.

**Depuis le convertisseur**, le décalage est évité par construction, puisque l’outil qui numérote les titres est celui qui écrit la liste. Si le HTML est de toute façon la destination, c’est la réponse correcte la moins coûteuse.

Quelle que soit la voie, parcourez le fichier fusionné une fois avant de l’expédier :

- [ ] Aucun `#` à l’intérieur d’un bloc de code n’a été rétrogradé
- [ ] Il ne reste aucun `.md)` dans un lien
- [ ] Chaque entrée du sommaire mène quelque part
- [ ] Chaque image se charge une fois le dossier déplacé
- [ ] Le contrôle `comm -23` ci-dessus n’affiche rien

## Les réponses propres à Pandoc, et le cas de l’impression

Pandoc traite plusieurs de ces problèmes par des options, ce qui est une bonne raison d’y recourir avant d’écrire un script — et une bonne raison de savoir exactement quels problèmes il vous laisse.

Face à plusieurs entrées, « pandoc les concaténera toutes (avec des lignes vides entre elles) avant l’analyse » : l’ordre reste donc à votre charge — listez les fichiers dans l’ordre voulu, ou développez un manifeste dans la ligne de commande. Les options utiles :

| Option | Ce que dit le manuel |
| --- | --- |
| `--shift-heading-level-by` | « Décale les niveaux de titre d’un entier positif ou négatif. Par exemple, avec `--shift-heading-level-by=-1`, les titres de niveau 2 deviennent des titres de niveau 1, et les titres de niveau 3 des titres de niveau 2. » |
| `--file-scope` | « Analyse chaque fichier individuellement avant de les combiner, pour les documents multifichiers. Cela permet aux notes de bas de page de fichiers différents portant les mêmes identifiants de fonctionner comme prévu. » |
| `--toc` | « Inclut un sommaire généré automatiquement … dans le document de sortie. » |
| `--toc-depth` | « Indique le nombre de niveaux de section à inclure dans le sommaire. La valeur par défaut est 3. » |
| `--number-sections` | « Numérote les titres de section dans une sortie LaTeX, ConTeXt, HTML, Docx, ms ou EPUB. Par défaut, les sections ne sont pas numérotées. » |

(Tout vérifié sur pandoc.org, le 9 septembre 2026.)

`--shift-heading-level-by=1`, c’est la passe de rétrogradation faite correctement : elle s’exécute sur le document analysé, si bien qu’un `#` à l’intérieur d’un bloc clôturé reste un commentaire dans un exemple de code et n’est pas touché. C’est toute la raison pour laquelle l’awk ci-dessus avait besoin d’un drapeau de clôture et pour laquelle celle-ci n’en a pas besoin. `--file-scope` est le remède aux ancres et aux notes, et il va plus loin que la déduplication — il préfixe les identifiants d’après les noms de fichiers et ajuste les liens internes en conséquence, c’est-à-dire le préfixage à la fusion décrit plus haut, gratuitement.

Une fusion présentable tient donc en une commande :

```bash
pandoc --standalone --toc --toc-depth=2 --file-scope \
  --shift-heading-level-by=1 \
  --metadata title="Handbook" \
  $(grep -vE '^[[:space:]]*(#|$)' order.txt) \
  -o handbook.html
```

Ce qu’elle ne fait pas : rebaser vos chemins d’images, ni réécrire un lien `03-deploy.md#tls` en dehors de l’ajustement de `--file-scope`. Quant au front matter, c’est une affaire de lecteur : le dialecte Markdown propre à Pandoc lit un bloc de métadonnées YAML comme des métadonnées et non comme du texte, ce qui fait disparaître l’accident setext, mais le jeu d’extensions dépend du lecteur que vous sélectionnez — vérifiez-le avant de vous y fier. Si Pandoc est plus d’outil que ce travail n’en demande, [les options plus modestes sont ici](/blog/pandoc-alternatives-for-markdown-to-html).

### Si la destination est un PDF

Un manuel fusionné est très souvent en route vers l’impression, et l’impression pose une exigence que l’écran n’a pas : les chapitres commencent sur une nouvelle page. Markdown n’a pas de syntaxe de saut de page : la rupture doit donc venir du HTML ou du moteur PDF.

Via un navigateur ou n’importe quel moteur de rendu HTML vers PDF, c’est une règle CSS de fragmentation. Posez un marqueur à chaque couture à la place du `***` :

```html
<div class="chapter-break"></div>
```

et fixez les règles dans la feuille de style :

```css
@page { size: A4; margin: 20mm; }

.chapter-break { break-before: page; }
h1, h2, h3 { break-after: avoid-page; }
p { orphans: 3; widows: 3; }
```

`break-before: page` fait commencer le chapitre suivant sur une feuille neuve. `break-after: avoid-page` sur les titres empêche qu’un titre de chapitre reste échoué en bas d’une page avec son premier paragraphe au verso, ce qui est de loin le résultat le plus laid de l’impression d’un document fusionné. `orphans` et `widows` font la même chose pour les paragraphes. Les moteurs plus anciens veulent aussi l’ancienne graphie `page-break-before: always` ; définir les deux est sans danger.

Un `\newpage` brut n’atteint qu’un PDF fondé sur LaTeX : c’est donc la bonne réponse via l’écrivain LaTeX de Pandoc, et cela ne fait absolument rien via un navigateur. [Toutes les routes de Markdown vers PDF, et ce que chacune coûte](/blog/markdown-to-pdf) est la version longue de cette décision.

## Quand c’est un livre, et non un document

La fusion a raison quand la sortie est une page unique. Elle cesse d’avoir raison dès que vous voulez des chapitres numérotés, des renvois qui survivent à une réorganisation, ou un champ de recherche — et la version honnête de cette phrase, c’est qu’un manuel fusionné n’a qu’un seul mécanisme de navigation, le sommaire en tête, et qu’un lecteur arrivé onze écrans plus bas n’a aucune idée d’où il se trouve.

Au-delà d’une certaine taille, le fichier fusionné est un livre qui se fait passer pour un document. Les symptômes sont précis : le script de fusion s’est doté d’une passe de réécriture des liens, d’une passe de préfixage des identifiants et d’un générateur de sommaire, c’est-à-dire qu’il est devenu un générateur de site statique sans tests ; réordonner deux chapitres impose de tout relancer et de revérifier chaque ancre ; et la sortie est assez volumineuse pour que son ouverture prenne un instant visible.

Un outil de livre résout pour vous l’ordre, les ancres et la navigation, et vous facture une étape de build en échange.

| Outil | L’ordre vient de | Sortie | Licence |
| --- | --- | --- | --- |
| mdBook | `SUMMARY.md` | Un site statique, écrit en Rust | MPL 2.0 |
| MkDocs | `nav` dans `mkdocs.yml` | Un site statique, écrit en Python | BSD à 2 clauses |
| Quarto | `chapters:` dans `_quarto.yml` | HTML, PDF, Typst, Word, EPUB, AsciiDoc | MIT |
| Honkit | Une arborescence source de style GitBook | Un site web ou un livre numérique : PDF, EPUB, MOBI | Apache 2.0 |
| Pandoc | L’ordre dans lequel vous listez les fichiers | Tout ce que porte sa propre liste de formats : HTML, PDF, EPUB, Word et davantage | GPL |

(Licences et sorties vérifiées sur rust-lang.github.io, mkdocs.org, quarto.org, pandoc.org et github.com, le 9 septembre 2026. Honkit est un fork de GitBook Legacy.)

Ce que cela coûte mérite d’être dit franchement, car « prenez simplement mdBook » est un conseil qui ignore la moitié du problème. Vous acquérez une chaîne d’outils : un environnement d’exécution à installer sur chaque machine qui construit la documentation, un fichier de configuration à maintenir valide, un thème à tenir à jour, et une tâche d’intégration continue qui peut désormais échouer pour des raisons sans rapport avec ce que quiconque a écrit. Vous acquérez une cible de déploiement, puisque la sortie est un répertoire de fichiers qu’il faut héberger quelque part. Et vous perdez l’artefact que vous vouliez au départ : un outil de livre vous donne un site, pas un fichier que l’on joint à un courriel, et si quelqu’un réclame le manuel entier sous forme d’une page unique, vous en revenez à la fusion, ou à la vue d’impression que l’outil offre éventuellement.

La ligne de partage n’est pas le nombre de fichiers. C’est de savoir si le document est lu une fois ou habité. Un manuel gardé pendant des années vaut mieux en site ; un manuel qui sort une fois — pour un client, un régulateur, un nouvel arrivant — vaut mieux fusionné. L’endroit où vit la source est une question distincte des deux, et la réponse à celle-là est presque toujours le dépôt.

## Comment choisir la fusion à construire

1. **Décidez où habite l’ordre avant d’écrire une ligne du script.** Dans les noms de fichiers, chaque insertion est un renommage ; dans un manifeste, chaque nouvelle partie est une ligne que quelqu’un doit penser à ajouter — et la conséquence d’un oubli est un chapitre qui, en silence, ne part pas, ce qu’aucun test n’attrapera à moins d’en écrire un qui compare le manifeste au répertoire.
2. **Rétrogradez après l’analyse, pas avant.** Une expression régulière sur du texte brut ne sait pas distinguer un titre d’un commentaire dans un exemple shell : suivez donc vous-même l’état des clôtures, ou confiez le travail à un analyseur ; le prix de l’erreur, c’est un bloc de code qui devient une entrée de plan, et elle sera dans le sommaire en haut de la page.
3. **Réécrivez les liens et les chemins d’images dans la passe même qui lit chaque fichier.** C’est le seul moment où vous savez de quelle partie vient une ligne, et c’est exactement ce dont vous avez besoin pour changer `03-deploy.md#tls` en `#tls` et `img/flow.png` en `chapters/img/flow.png` — faites-le plus tard et vous devinez.
4. **Rendez les identifiants de titres uniques à la source plutôt que de compter sur le moteur de rendu.** Chaque outil déduplique autrement et certains pas du tout : un document qui dépend du compteur est un document dont les liens changent de sens dès que quelqu’un insère un chapitre.
5. **Générez le sommaire depuis la sortie, pas depuis l’entrée.** Une liste construite avec votre règle de slug et rendue par un convertisseur qui en a une autre est une page de liens qui échouent tous discrètement, et l’échec discret est le genre coûteux.
6. **Ouvrez le fichier fusionné ailleurs avant de l’envoyer.** Une autre machine, un autre navigateur, le réseau coupé, le dossier d’images laissé derrière : ce seul test attrape d’un coup les chemins relatifs cassés, les ancres manquantes et les styles liés à un CDN, et il prend une minute.
7. **Écrivez quelque part la taille à laquelle vous cesserez de fusionner.** Vingt parties, ou le jour où un second format de sortie devient nécessaire, ou la première demande de recherche : choisissez le déclencheur à l’avance, car l’alternative consiste à le découvrir sous la forme d’un problème de maintenance dix-huit mois plus tard.

Commencez par les noms de fichiers, avant qu’il y en ait vingt : l’ordre est le seul de ces problèmes qui empire avec le temps, et le seul dont le remède — renommer — devient plus coûteux chaque mois où on le laisse traîner. Pour le HTML lui-même, déposez les parties ensemble sur [TransformPipe](/) : plusieurs fichiers d’un coup sont enchaînés en un seul document, dans l’ordre, séparés par un filet, avec les identifiants de titres visibles dans l’onglet source pour que le sommaire puisse être confronté à eux plutôt que deviné. Depuis un terminal, `tp push handbook/*.md --merge --share link` affiche un lien à transmettre. Dans les deux cas, la fusion est la partie facile ; les trois passes sur les liens, les images et les ancres sont le travail, et ce sont elles qui séparent un document qui s’affiche d’un document qui se lit.

## FAQ

### Comment combiner plusieurs fichiers Markdown en un seul ?

Concaténez-les dans un ordre délibéré, puis appliquez trois retouches en chemin : retirez le front matter de chaque partie, rétrogradez ses titres d’un niveau en sautant les clôtures de code, et posez un filet `***` entre les parties. `cat *.md > out.md` fait la concaténation et aucune des retouches, ce qui explique que sa sortie ait l’air juste et se comporte mal.

### Pourquoi le chapitre 10 est-il avant le chapitre 2 dans mon fichier fusionné ?

Parce qu’un glob de shell trie les noms de fichiers comme des chaînes, et que dans une comparaison de chaînes `1` vient avant `2` et que la comparaison s’arrête là. Complétez les préfixes numériques par des zéros pour que tous les noms aient la même largeur, ou gardez l’ordre de lecture dans un fichier manifeste et lisez celui-ci au lieu de faire un glob.

### Comment empêcher chaque chapitre de devenir un H1 ?

Rétrogradez chaque titre d’un niveau et donnez au document fusionné un titre unique qui lui appartient. Ne le faites pas avec `sed 's/^#/##/'`, qui réécrira aussi les commentaires `#` à l’intérieur des blocs de code clôturés ; suivez les clôtures, ou utilisez le `--shift-heading-level-by=1` de Pandoc, qui décale le document analysé et ne peut donc pas toucher à un exemple de code.

### Que deviennent les liens entre les fichiers après la fusion ?

Ils pointent vers des fichiers qui ne se trouvent plus à côté du lecteur. Un lien avec un fragment — `03-deploy.md#tls` — devient `#tls` ; un lien vers un fichier entier a besoin de l’identifiant du titre de ce fichier, ce qui suppose de construire une table nom de fichier vers identifiant pendant la lecture des parties. Ensuite, cherchez au grep `.md)` dans le fichier fusionné et, dans le HTML converti, les liens vers un fragment sans identifiant correspondant.

### Deux chapitres ont le même titre — quelle ancre l’emporte ?

Cela dépend du moteur de rendu, et c’est bien le problème. La règle de slug de GitHub ajoute `-1` et `-2` aux répétitions, markdown-it-anchor suffixe lui aussi en cas de collision, Pandoc sous `--file-scope` préfixe les identifiants d’après le nom de fichier, et un convertisseur sans déduplication émet deux fois le même identifiant et laisse le navigateur sauter au premier. Renommez les titres, ou préfixez-les par fichier source au moment de la fusion.

### Ai-je besoin d’un générateur de site statique ou d’un outil de livre ?

Seulement si la sortie est un ensemble de pages plutôt qu’une seule. Un outil de livre vous donne l’ordre, des ancres uniques, la navigation et la recherche, en échange d’une chaîne d’outils, d’un fichier de configuration et d’une étape de build, et ce qu’il produit est un répertoire à héberger — pas un fichier que l’on joint à un courriel. Si l’on vous a demandé un document, la fusion reste la bonne réponse.

### Puis-je fusionner des fichiers Markdown sans rien installer ?

Oui. Un convertisseur qui travaille côté navigateur et accepte plusieurs fichiers à la fois les enchaînera en un seul document, dans l’ordre, et vous rendra le HTML, sans rien installer et sans rien téléverser. La contrepartie, c’est que la réécriture des liens, des images et des ancres décrite plus haut n’est pas faite pour vous : effectuez donc ces passes sur le Markdown d’abord, et convertissez en dernier.
