---
title: "Le front matter Markdown, et ce que les convertisseurs en font"
description: "Le bloc en tête d’un fichier Markdown est supprimé, rendu, transformé en tableau ou lu comme métadonnées : c’est l’outil qui décide, pas la syntaxe."
date: 2026-08-18
tag: Syntaxe
keywords: front matter markdown, yaml front matter, supprimer le front matter, convertisseur markdown front matter, toml front matter, json front matter, hugo front matter, jekyll front matter, métadonnées markdown
---

Un fichier arrive, vous le convertissez, et la page s’ouvre sur un filet horizontal suivi d’un titre en gras qui annonce `title: Q3 review date: 2026-08-04 draft: false`. Rien n’est cassé. Le convertisseur a fait exactement ce que la spécification Markdown prescrit pour trois tirets, un paragraphe et trois tirets de plus. Le bloc que vous destiniez aux métadonnées n’est, pour un analyseur qui n’a jamais entendu parler de front matter, que du texte.

### En bref

Le front matter est un bloc de métadonnées placé en tête d’un fichier `.md`, et il ne figure dans aucune spécification Markdown — ni CommonMark, ni GFM. Chaque outil tranche donc pour son compte, et il n’existe que quatre issues possibles : le bloc est **supprimé** et jeté, **rendu** comme contenu du document, **transformé en tableau**, ou **lu comme métadonnées** et exploité. Les générateurs de sites statiques le lisent ; les convertisseurs et bibliothèques ordinaires le rendent, ce qui ressemble à un bug et n’est que de la littéralité ; GitHub le met en tableau. Si le fichier part vers quelque chose qui le rendra, supprimez le bloc d’abord ou prenez un outil doté d’une option front matter — et n’écrivez jamais un simple filet `---` en tête d’un document.

Le front matter est entré dans Markdown par la bande. Jekyll voulait des variables par page, a choisi un bloc YAML encadré par `---`, et tous les générateurs venus ensuite ont recopié la convention sans que personne ne l’inscrive jamais dans une spécification. Le résultat est une construction que douze outils très répandus prennent en charge, qu’aucun d’entre eux ne prend en charge de la même façon, et qu’un analyseur a parfaitement le droit d’ignorer.

Voilà le point de friction. Vous ne pouvez pas deviner en regardant un fichier ce qu’il adviendra de son en-tête, et vous ne le devinerez pas davantage en lisant la liste des fonctionnalités d’un convertisseur, parce que « prend en charge Markdown » ne dit rien d’un bloc qui n’est pas du Markdown. L’échec est silencieux dans les deux sens : un moteur de rendu imprime vos métadonnées dans le document, sous les yeux des lecteurs, et un lecteur de métadonnées efface sans bruit un filet `---` que vous vouliez visible.

Ce texte porte sur les outils qui font quoi, sur les raisons qui rendent le comportement de rendu défendable plutôt que défectueux, sur ce qui se passe avec des en-têtes TOML et JSON, et sur le seul véritable piège : `---` est à la fois un délimiteur de front matter, un filet horizontal et un soulignement de titre setext, et lequel des trois il devient dépend uniquement de l’endroit où il tombe.

## Un bloc qu’aucune spécification Markdown ne définit

Prenez le plus petit exemple possible et passez-le dans un analyseur dépourvu de prise en charge du front matter. Voici `marked`, la bibliothèque qui alimente un très grand nombre d’aperçus et de convertisseurs :

```md
---
title: Notes
date: 2026-01-01
---

Body
```

La sortie n’est pas celle qu’un générateur vous donnerait :

```html
<hr>
<h2>title: Notes
date: 2026-01-01</h2>
<p>Body</p>
```

Lisez-la comme un analyseur et elle devient inévitable. Le premier `---` n’a rien au-dessus de lui : c’est donc une rupture thématique, un `<hr>`. Les deux lignes `key: value` forment un paragraphe. Le `---` de fermeture se trouve juste sous un paragraphe, et en Markdown une ligne de tirets placée sous un paragraphe est un soulignement de titre setext, qui transforme le paragraphe au-dessus en `<h2>`. Trois tirets, un paragraphe, trois tirets : un filet, un titre. Le convertisseur reste fidèle à la seule spécification qui existe pour les caractères qu’on lui a remis.

Insérez une ligne vide à l’intérieur du bloc — ce que YAML autorise et ce que les gens font quand un en-tête s’allonge — et la forme change encore :

```html
<hr>
<p>title: Notes</p>
<h2>date: 2026-01-01</h2>
```

Cette fois, la première clé devient un paragraphe et seule la dernière devient un titre, parce qu’un soulignement setext ne réclame que le paragraphe immédiatement au-dessus de lui. Même intention, deux documents différents, et aucun des deux n’est un bug. C’est la même famille de problèmes que [les différences entre les variantes de Markdown](/blog/commonmark-gfm-and-the-flavours), avec une circonstance aggravante : les variantes, au moins, documentent ce qu’elles ajoutent. Le front matter est une convention plutôt qu’une extension : il n’existe donc aucun texte auquel confronter un outil.

Les quatre issues ci-dessous sont exhaustives. Un outil peut jeter le bloc, l’imprimer, le mettre en forme ou s’en servir. Tout ce que vous croiserez dans la nature relève de l’une de ces quatre catégories, et la seule question qui vaille d’être posée à un convertisseur, c’est laquelle il a choisie.

## Comparatif rapide : ce que chaque outil fait du bloc

| Outil | Ce qu’il fait du front matter | Délimiteurs reconnus | Ce que vous obtenez | Prix |
| --- | --- | --- | --- | --- |
| Jekyll | Le lit comme métadonnées ; une page a besoin du bloc pour être traitée du tout | `---` YAML | Des variables de page dans les gabarits, le bloc absent de la sortie | Gratuit, MIT |
| Hugo | Le lit comme métadonnées | `---` YAML, `+++` TOML, `{` et `}` JSON | Des paramètres de page, le bloc absent de la sortie | Gratuit, Apache 2.0 |
| Eleventy | Le lit comme métadonnées via gray-matter | `---` YAML, plus un suffixe de langage comme `---json` | Des entrées dans la cascade de données, le bloc absent de la sortie | Gratuit, MIT |
| MkDocs | Le lit comme métadonnées de page | `---` YAML | `page.meta` dans les gabarits, le bloc absent de la sortie | Gratuit, BSD |
| Docusaurus | Le lit comme métadonnées de page | `---` YAML | Position dans la barre latérale, slug et étiquettes ; bloc absent | Gratuit, MIT |
| Pandoc | Le lit comme métadonnées, l’extension activée | `---` pour ouvrir, `---` ou `...` pour fermer | Des variables de gabarit, et un bloc de titre avec `--standalone` | Gratuit, GPL |
| marked | Le rend comme contenu | Aucun | Un `<hr>` et un `<h2>` composé de vos clés | Gratuit, MIT |
| markdown-it | Le rend comme contenu, sauf si l’on ajoute un greffon | Aucun d’origine | Un `<hr>` et un `<h2>` composé de vos clés | Gratuit, MIT |
| remark avec remark-frontmatter | Le reconnaît, ne l’analyse pas, le retire du HTML | `---` YAML, `+++` TOML, encadrements personnalisés | Un nœud `yaml` dans l’arbre et rien dans le HTML | Gratuit, MIT |
| Python-Markdown avec `meta` | Le supprime et l’expose sous forme de chaînes | `---` facultatif au début, `---` ou `...` à la fin, ou une ligne vide | `md.Meta`, des listes de chaînes | Gratuit, BSD |
| gray-matter | Le détache et l’analyse pour vous | `---` par défaut, configurable, suffixes de langage | `data`, `content`, et `excerpt` sur demande | Gratuit, MIT |
| GitHub | Le transforme en tableau | `---` YAML | Un tableau de deux lignes au-dessus de votre document | Gratuit |
| GitLab | L’affiche tel quel dans un encadré au-dessus du document | `---` YAML, `+++` TOML, `;;;` JSON | Le bloc brut, visible, en tête | Gratuit |
| Aperçu de VS Code | Le masque | `---` YAML | Rien ; l’aperçu commence à votre premier titre | Gratuit |
| Obsidian | Le lit comme propriétés et les affiche dans son propre panneau | `---` YAML | Des champs typés, avec `tags` et `aliases` réservés | Gratuit |
| Une expression régulière dans votre build | Le supprime, le plus souvent correctement | Ce que dit le motif | Une chaîne plus courte, et un cas limite en embuscade | Gratuit |

La liste de délimiteurs de GitLab est la plus large de tous les outils cités ici : YAML avec `---`, TOML avec `+++`, JSON avec `;;;`, et un indicateur de langage accolé au délimiteur, comme dans `---php` (vérifié sur docs.gitlab.com, le 8 septembre 2026).

## Les quatre destins, un par un

### Supprimé : le bloc est retiré puis oublié

Le comportement le plus simple, et le plus fréquent à l’intérieur d’un build. L’outil repère le bloc, le retire du texte, et n’en fait rien d’autre. L’extension `meta` de Python-Markdown est explicite sur l’ordre des opérations — sa documentation indique que toutes les métadonnées sont retirées du document avant tout autre traitement par Markdown — et `remark-frontmatter` aboutit au même endroit pour une sortie HTML, parce que le nœud qu’il ajoute à l’arbre n’a aucun gestionnaire HTML et ne produit donc rien.

| Avantages | Inconvénients |
| --- | --- |
| La sortie, c’est le document, sans fuite de métadonnées dedans | Les métadonnées ont disparu : un titre devra venir d’ailleurs |
| Rien à configurer une fois l’option activée | Silencieux : un filet `---` en tête d’un corps de texte est supprimé tout aussi volontiers |
| Fonctionne avec n’importe quelles clés, YAML valide ou non, dans sa version fruste | Une version à base d’expression régulière casse sur une ligne de tirets à l’intérieur d’une valeur entre guillemets |

**Pour qui ?** Pour quiconque convertit des fichiers sortis d’un générateur et destinés à un endroit qui n’a pas besoin des métadonnées : un README transformé en page, un dossier de documentation rendu pour relecture, un ensemble de notes exporté pour un client. Si seule la prose vous intéresse, la suppression est la bonne réponse, et la moins coûteuse à mettre en place.

La répartition des rôles de `remark-frontmatter` mérite d’être comprise si vous utilisez unified, car on attend facilement trop du greffon. Il ajoute un nœud de type `yaml` — ou `toml` — qui porte le texte brut sous forme de chaîne, et son readme dit sans détour qu’il n’analyse pas les données qu’il contient ; c’est un travail distinct, confié à quelque chose comme `vfile-matter`. L’installer vous achète donc la suppression, pas les métadonnées. La division du travail est saine, et la surprise réelle pour qui l’avait installé en espérant `data.title`.

### Rendu : le convertisseur est littéral, pas défaillant

Toute bibliothèque Markdown généraliste dépourvue de fonction front matter atterrit ici, et avec elle tout convertisseur bâti sur l’une d’entre elles dont l’auteur n’a jamais tranché la question des en-têtes. Vous récoltez le `<hr>` et le `<h2>`, et l’on croirait que l’outil a mangé votre fichier.

| Avantages | Inconvénients |
| --- | --- |
| Fidèle : rien de ce qui entre n’est effacé en silence | Vos métadonnées apparaissent dans le document, là où les lecteurs les lisent |
| Prévisible une fois la règle connue | Cela ressemble à un défaut, et les gens le signalent comme tel |
| Aucun greffon, et aucun doute sur ce qui a été écarté | La forme exacte dépend des lignes vides à l’intérieur du bloc |

**Pour qui ?** Personne ne choisit cela délibérément, et cela reste le comportement par défaut correct pour une bibliothèque. Un analyseur qui devinerait quels paragraphes sont des métadonnées se tromperait quelque part, et l’erreur serait irrattrapable, puisque le texte aurait disparu. Le rendu conserve l’information dans le document et laisse la décision à l’appelant, c’est-à-dire là où elle a sa place. `marked` n’a aucune option de front matter, et le conseil habituel consiste à passer d’abord la chaîne dans `gray-matter`. `markdown-it` n’a pas davantage de règle pour le front matter ; les greffons qui s’en chargent repèrent le bloc, ne rendent rien, et transmettent le texte brut à une fonction de rappel afin que vous en fassiez ce qu’il vous plaît.

Conséquence pratique : « le convertisseur a massacré mon en-tête » et « le convertisseur n’a aucun avis sur les en-têtes » décrivent le même événement. Si vous hésitez entre plusieurs outils, c’est l’un des points [qu’un comparatif de fonctionnalités ne vous dira pas](/blog/best-markdown-to-html-converters), et il faut un fichier et dix secondes pour le découvrir.

### Transformé en tableau : rendu, mais mis en forme

GitHub lit le bloc, le reconnaît, et le rend sous forme de tableau au-dessus de votre document — les clés sur la ligne d’en-tête, les valeurs sur l’unique ligne qui suit. C’est une concession délibérée, et elle se tient pour un hébergeur de code : GitHub Pages tourne sur Jekyll, donc du front matter dans un dépôt est en général de vraies métadonnées plutôt qu’un accident, et l’afficher vaut mieux que l’imprimer en guise de titre.

| Avantages | Inconvénients |
| --- | --- |
| Le bloc est identifiable comme des métadonnées, non confondu avec de la prose | Un en-tête de douze clés donne un tableau de douze colonnes de large |
| Rien n’est caché à qui parcourt le dépôt | Valeurs longues, listes et YAML imbriqué se lisent mal dans une cellule |
| Cohérent sur chaque fichier `.md` rendu dans un dépôt | Impossible de le désactiver pour un seul fichier |

**Pour qui ?** Pour les lecteurs, pas pour les builds. C’est la bonne décision pour un hébergeur de code et une question sans objet pour une chaîne de traitement ; c’est aussi la raison pour laquelle un fichier peut paraître impeccable sur GitHub et arriver sous forme de filet et de titre dans votre propre convertisseur : deux outils, deux des quatre destins, un fichier inchangé. GitLab fait un choix voisin et montre le bloc tel quel dans un encadré en tête du document, soit le même réflexe avec moins de mise en forme.

### Lu comme métadonnées : le bloc sert à quelque chose

Le destin pour lequel le bloc a été inventé. L’outil analyse le YAML, se sert des clés, et les retire du contenu.

Jekyll a lancé le mouvement : un fichier qui commence par le bloc est traité, un fichier qui ne commence pas par lui est recopié tel quel — ce qui explique qu’un bloc `---` vide soit une chose que l’on écrit vraiment, exprès. Hugo déduit le format des délimiteurs et transforme les clés en paramètres de page, avec `title`, `date`, `draft`, `weight`, `description`, `slug` et `layout` parmi les clés standard. MkDocs expose le bloc sous le nom `page.meta`. Docusaurus utilise `id`, `title`, `sidebar_position` et `slug`. Obsidian lit le bloc comme des propriétés typées et les affiche dans un panneau plutôt que dans le corps de la note, en réservant `tags`, `aliases` et `cssclasses` à son propre fonctionnement.

Pandoc est le cas intéressant, parce qu’il est un convertisseur et non un générateur, et qu’il lit tout de même le bloc. L’extension s’appelle `yaml_metadata_block` et appartient au dialecte Markdown propre à Pandoc : quand le format d’entrée est `commonmark` ou `gfm`, vous devez donc la nommer sur le format au lieu de la supposer acquise :

```bash
pandoc -f gfm+yaml_metadata_block -t html --standalone notes.md -o notes.html
```

Trois détails du manuel valent d’être gardés en tête. Le délimiteur d’ouverture est une ligne de trois traits d’union, et celui de fermeture peut être `---` ou trois points. Le bloc n’est pas obligé de se trouver en tête du fichier — il peut apparaître n’importe où dans le document, à condition qu’une ligne vide le précède lorsqu’il n’est pas au début. Enfin, `title`, `author`, `date` et `abstract` sont utilisés par les gabarits par défaut, tandis que toute autre clé devient une variable de gabarit définie automatiquement à partir des métadonnées : c’est ainsi que l’on fait descendre un numéro de version dans un pied de page sans toucher au corps du document (vérifié sur pandoc.org, le 8 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Les métadonnées font ce pour quoi elles ont été écrites | Cela ne marche que si les deux côtés s’entendent sur le nom des clés |
| Le corps du document reste propre | Un YAML invalide devient un échec de build plutôt qu’une bizarrerie |
| Un titre dans le fichier signifie un titre dans la sortie | Les clés sont propres à chaque outil : `weight` ne dit rien à Jekyll |

**Pour qui ?** Pour quiconque voit son Markdown vivre dans un dépôt et se faire construire par quelque chose — un site de documentation, un blog, un dossier de procédures d’exploitation. Si les fichiers font foi, le front matter est l’endroit où loger les parties d’une page qui ne sont pas de la prose, et c’est l’essentiel de ce qui fait tenir [une documentation qui vit dans le dépôt](/blog/documentation-that-lives-in-the-repo).

Si vous voulez l’analyse sans le générateur, `gray-matter` est la bibliothèque que presque tout l’écosystème JavaScript emploie pour cela. Elle renvoie `data` — le bloc analysé sous forme d’objet —, `content`, qui est l’entrée débarrassée du bloc, et `excerpt` si vous le demandez. Elle gère nativement le front matter YAML, JSON et JavaScript ; TOML et CoffeeScript s’obtiennent en ajoutant un moteur. Les délimiteurs se configurent par une option `delimiters`, et un langage peut être nommé sur le délimiteur d’ouverture, sous la forme `---toml`. Elle est sous licence MIT. En Python, `python-frontmatter` occupe la même place au-dessus de PyYAML.

```js
import matter from "gray-matter";
import { marked } from "marked";

const { data, content } = matter(raw);
const html = marked.parse(content);

// data.title is now yours to put in the <title> element.
```

Deux lignes, et le bloc passe du deuxième destin au quatrième.

## TOML, JSON et les délimiteurs sur lesquels personne ne s’est entendu

YAML avec `---` est la norme partout, mais ce n’est pas la seule convention, et les autres échouent différemment.

Le front matter TOML s’encadre par `+++`, ce que Hugo prend en charge depuis toujours. Contrairement à `---`, `+++` ne signifie strictement rien en Markdown : un convertisseur ordinaire ne produit donc ni filet ni titre. Il produit un paragraphe de texte littéral :

```html
<p>+++
title = &quot;Notes&quot;
+++</p>
```

On peut soutenir que c’est mieux, parce que le résultat est manifestement faux et que personne ne le prend pour un vrai titre ; on peut soutenir que c’est pire, parce que vos métadonnées sont désormais de la prose visible en tête de page. Dans tous les cas, un outil qui reconnaît le front matter YAML ne reconnaîtra pas forcément le TOML : `gray-matter` réclame un moteur supplémentaire, `remark-frontmatter` dispose d’un préréglage TOML qu’il faut demander, et `yaml_metadata_block` de Pandoc est, comme son nom l’indique, du YAML.

Le front matter JSON est plus étrange encore, car chez Hugo il n’y a aucun délimiteur : le fichier commence par `{` et l’objet se termine par `}`. Eleventy prend l’autre chemin et vous laisse écrire `---json` sur le délimiteur d’ouverture, ce qui est une fonctionnalité de gray-matter et non d’Eleventy. Pour un analyseur Markdown, un objet JSON sans encadrement en tête de fichier est un paragraphe d’accolades et de guillemets, échappé en entités puis imprimé. GitLab reconnaît `;;;` pour le JSON, soit une quatrième convention pour la même idée.

| Format | Délimiteurs | Reconnu par | Ce qu’un analyseur ordinaire en fait |
| --- | --- | --- | --- |
| YAML | `---` jusqu’à `---`, ou `...` pour fermer chez Pandoc | Tout ce qui prend le front matter en charge | Un `<hr>` plus un `<h2>` composé de vos clés |
| TOML | `+++` jusqu’à `+++` | Hugo, GitLab, remark avec le préréglage TOML | Un paragraphe visible de `+++` littéraux et de clés |
| JSON | `{` jusqu’à `}`, sans encadrement | Hugo | Un paragraphe visible d’accolades et de guillemets |
| JSON | `---json` jusqu’à `---` | Eleventy, et gray-matter en dessous | Un paragraphe visible, ou un titre si l’encadrement est nu |
| JSON | `;;;` jusqu’à `;;;` | GitLab | Un paragraphe visible de points-virgules et de clés |

La leçon est étroite et utile. YAML est le seul format dont la prise en charge approche l’universalité : à moins qu’un outil de votre chaîne n’exige le contraire, écrivez du YAML. Les délimiteurs exotiques ne vous achètent rien, sinon un ensemble plus réduit d’outils capables de comprendre le fichier dans deux ans.

## Le piège : le délimiteur est aussi un filet horizontal

Tout ce qui précède se résume à savoir quel outil vous tenez en main. Cette partie-ci décrit une véritable ambiguïté de la syntaxe, et elle coupe dans les deux sens.

Seul sur sa ligne, `---` a trois sens en Markdown, décidés entièrement par le contexte. Avec du texte juste au-dessus, c’est un soulignement de titre setext. Avec une ligne vide au-dessus, c’est une rupture thématique, un `<hr>`. Et tout au début d’un fichier, c’est exactement ce que cherche n’importe quel analyseur de front matter. Rien dans la syntaxe ne distingue le troisième cas du deuxième : la position est le seul signal.

Considérez donc un document qui s’ouvre sur un séparateur, chose que l’on écrit pour des raisons esthétiques plus souvent qu’on ne l’imagine :

```md
---

Notes from the incident review, 4 August.

---

## Timeline
```

Un analyseur de front matter lit le premier `---`, cherche le suivant, le trouve quatre lignes plus bas, et prend tout ce qui se trouve entre les deux pour des métadonnées. La suite dépend de l’outil. L’analyse YAML de `Notes from the incident review, 4 August.` réussit — YAML lit volontiers une phrase nue comme une chaîne — donc rien ne lève d’exception ; l’analyseur reçoit simplement une chaîne là où il attendait un objet. Certains outils l’ignorent, d’autres le consignent, et tous renvoient un contenu amputé de votre première ligne. Le document que vous récupérez commence à `## Timeline`, et aucune erreur n’a été signalée nulle part.

Faites de cette première ligne quelque chose que YAML n’aime pas et vous obtenez l’échec inverse : un build qui s’arrête sur une erreur d’analyse pointant vers de la prose. Les deux issues ont la même cause : le délimiteur n’est réservé à aucun usage unique.

L’autre sens du piège mord quand on assemble des fichiers. Concaténez plusieurs fichiers commençant chacun par un en-tête, et seul le premier bloc se retrouve en position de front matter. Les autres atterrissent en plein document, là où trois tirets veulent dire filet et titre — et c’est pourquoi [la fusion de plusieurs fichiers Markdown](/blog/merging-many-markdown-files) exige de retirer les blocs à mesure que chaque fichier est lu, plutôt que de faire le ménage après coup.

À l’intérieur du bloc, les mêmes caractères réservent une dernière surprise. L’extension `meta` de Python-Markdown termine les métadonnées à la première ligne vide ou au premier délimiteur de fermeture, selon ce qui vient en premier : une ligne vide au milieu d’un long en-tête le tronque donc, et les clés restantes deviennent du corps de texte. Les bibliothèques qui rendent le bloc le coupent elles aussi à la ligne vide, comme on l’a vu plus haut, mais en un paragraphe et un titre.

Trois habitudes éliminent toute cette classe de problèmes :

- Écrivez les filets horizontaux `***` ou `___`, jamais `---`. Ils produisent un `<hr>` identique et ne peuvent être confondus ni avec un délimiteur, ni avec un soulignement de titre.
- Gardez le `---` d’ouverture sur la toute première ligne du fichier, sans ligne vide ni marque d’ordre des octets devant lui. La plupart des analyseurs exigent le délimiteur en tête de chaîne et concluent sans bruit, sinon, qu’il n’y a pas de front matter.
- Ne laissez pas de lignes vides à l’intérieur du bloc. YAML les autorise, plusieurs lecteurs de front matter non, et les outils qui rendent le bloc changent de forme à cause d’elles.

## Là où « on supprime et on passe à la suite » échoue, et ce que cela coûte

La suppression est la réponse évidente pour une conversion, et elle a généralement raison. Voici ce qu’elle coûte réellement, parce que ce coût ne figure jamais sur la page d’un outil.

**Le titre part avec.** La seule métadonnée que tous les formats de sortie réclament est le titre, et la suppression l’efface. Un fichier HTML sans `<title>` affiche le nom du fichier dans l’onglet du navigateur, c’est-à-dire ce que quelqu’un voit dans sa barre d’onglets et dans ses signets. Un document nommé `final-v3.html` posé dans un onglet est une petite humiliation qu’une modification de deux lignes évite : analyser le bloc, garder `title`, le placer dans l’en-tête. Il en va de même pour la description, celle que lit une messagerie quand elle fabrique un aperçu de lien.

**Les dates cessent d’être des dates.** Une date YAML n’est pas une chaîne dans la plupart des analyseurs. Un horodatage est un type YAML résolu et non du texte : face à `date: 2026-08-18`, js-yaml renvoie un objet `Date` JavaScript et PyYAML un `datetime.date` (vérifié sur yaml.org, le 8 septembre 2026). C’est commode jusqu’à ce qu’un fuseau horaire s’en mêle et qu’un document daté du 18 s’affiche au 17 quelque part à l’ouest de chez vous. Mettez la valeur entre guillemets quand vous voulez les caractères que vous avez tapés.

**Les types YAML sont un danger en eux-mêmes.** Le cas classique est le problème norvégien. PyYAML est un analyseur YAML 1.1 complet, et YAML 1.1 définissait `y`, `yes`, `n`, `no`, `on` et `off` comme des booléens : `country: NO` revient donc en `False` (PyYAML 6.0.3, vérifié sur pypi.org, le 8 septembre 2026). js-yaml a cessé de convertir ces mots en booléens et lit les nombres selon les règles de YAML 1.2 : les mêmes mots reviennent donc en chaînes (js-yaml 5.4.1, vérifié sur github.com/nodeca/js-yaml, le 8 septembre 2026). Le même en-tête signifie par conséquent des choses différentes dans un build Python et dans un build Node, ce qui devient un bug franchement pénible quand un site de documentation est construit par l’un et vérifié par l’autre. Et `version: 1.10` vaut le nombre 1,1 dans les deux, parce que c’est un flottant : mettez vos numéros de version entre guillemets, ou perdez le zéro final.

**Un deux-points dans un titre est une erreur d’analyse.** C’est le défaut de front matter le plus répandu qui soit. `title: Release 2.1: what changed` n’est pas du YAML valide : le second deux-points ouvre une nouvelle association, et l’analyseur signale une indentation incorrecte sur une ligne qui paraît parfaitement normale à un humain. La solution, ce sont les guillemets, et la raison de le savoir à l’avance est que le message d’erreur ne mentionne jamais le deux-points.

**Les tabulations sont interdites.** YAML proscrit les tabulations dans l’indentation : un éditeur réglé pour en insérer casse donc une liste imbriquée dans un en-tête, avec une erreur parlant de caractères de tabulation, et rien dans le fichier n’a l’air anormal à l’écran.

**Une expression régulière n’est pas un analyseur.** Une suppression maison — trouver du premier `---` au suivant, puis jeter — tient en trois lignes et fonctionne sur presque tous les fichiers. Elle échoue sur une valeur contenant une ligne de trois tirets, sur un fichier dont la première ligne est un filet, et sur un en-tête fermé par `...`. Presque tous les fichiers passent ; l’exception vous coûte un document privé de son premier paragraphe, sans la moindre erreur pour expliquer où il est passé.

**Et parfois, les métadonnées étaient précisément l’enjeu.** Les fichiers exportés depuis des outils de prise de notes et de gestion des connaissances portent des propriétés dans l’en-tête — statut, responsable, date de révision, étiquettes — et c’est fréquemment la partie que quelqu’un tenait à conserver. Supprimer le bloc jette la moitié structurée de l’export et ne garde que la prose, ce qui est une vraie perte quand la structure était la raison même de la migration. Cela vaut d’être vérifié avant un déménagement massif hors de [Notion, Obsidian ou Confluence](/blog/markdown-from-notion-obsidian-and-confluence), car ces outils ne s’accordent pas sur la sortie des propriétés : front matter, simples lignes `key: value` sans le moindre délimiteur, ou rien du tout.

## Ce qu’il faut vérifier avant de transmettre le fichier

1. **Convertissez un vrai fichier et regardez le haut de la sortie.** Dix secondes d’observation vous disent auquel des quatre destins vous avez affaire, et aucune liste de fonctionnalités ne le fera : un filet et un titre signifient que l’outil rend, un premier titre propre qu’il supprime ou qu’il lit, un tableau que vous êtes sur GitHub.
2. **Décidez si vous avez besoin des métadonnées avant de choisir l’outil.** S’il faut qu’un titre, une date ou une description atteigne la sortie, il vous faut un outil de la quatrième catégorie ou votre propre étape d’analyse ; placer `gray-matter` devant un moteur de rendu tient en deux lignes — peu coûteux à ajouter, très coûteux à découvrir oublié une fois les pages publiées.
3. **Validez le YAML à part, une fois.** Passez le bloc dans un analyseur YAML séparé et vous attrapez le deux-points sans guillemets, la tabulation, le booléen qui était un code pays et le numéro de version qui a perdu son zéro. Sautez l’étape, et chacun de ces cas reviendra plus tard sous forme d’échec de build ou, pire, de valeur fausse que personne ne contrôle.
4. **Cherchez `---` dans le document avant de convertir ou de concaténer.** Chaque occurrence est un filet, un soulignement de titre ou un délimiteur, et le choix dépend entièrement de la ligne au-dessus. Remplacer les filets intentionnels par `***` supprime l’ambiguïté définitivement, et c’est un chercher-remplacer, pas un projet.
5. **Mettez-vous d’accord sur les noms de clés avec ce qui les lit.** `weight` ne dit rien à Jekyll, `layout` ne dit rien à Docusaurus, `draft` ne dit rien à un convertisseur ordinaire, et une clé non reconnue n’est pas une erreur — c’est un silence. Une clé que rien ne lit est un commentaire avec des étapes en plus, et une clé mal orthographiée que quelque chose lit est une page qui se publie alors que vous vouliez le contraire.

## Conclusion

Le front matter est une convention qui a débordé son origine sans jamais devenir partie intégrante du langage : le bloc en tête de votre fichier n’a donc aucune signification définie et quatre destins possibles. Les générateurs le lisent, Pandoc le lit quand on le lui demande, les bibliothèques le rendent parce que le rendu est le comportement honnête pour du texte qu’un analyseur ne reconnaît pas, et GitHub le met en tableau à l’usage des lecteurs. Savoir lequel s’applique fait toute la différence entre une page qui commence par votre premier titre et une page qui commence par un filet horizontal suivi d’un titre bourré de deux-points. Pour savoir ce que devient un fichier précis, [convertissez-le et regardez le haut du résultat](/) — obtenir la réponse prend moins de temps que d’en débattre. Quand les métadonnées comptent, détachez-les avec un analyseur avant que le moteur de rendu ne les voie, et écrivez désormais vos filets `***`.

## FAQ

### Qu’est-ce que le front matter dans un fichier Markdown ?

C’est un bloc de métadonnées en tête de fichier, conventionnellement du YAML encadré par des lignes de trois tirets, qui porte des éléments comme le titre, la date, les étiquettes et le gabarit. Jekyll l’a popularisé et presque tous les générateurs de sites statiques venus depuis l’ont recopié. Il ne fait pas partie de la syntaxe Markdown, et c’est précisément pour cela que les outils ne s’accordent pas à son sujet.

### Le front matter fait-il partie de CommonMark ou de GitHub Flavored Markdown ?

Non. Aucune des deux spécifications ne le mentionne, et aucune ne lui réserve le délimiteur `---`. Sa prise en charge est une extension ou une convention propre à chaque outil : un analyseur strictement conforme a donc raison de rendre le bloc comme une rupture thématique suivie d’un titre setext.

### Pourquoi mon HTML converti commence-t-il par un filet et un titre plein de deux-points ?

Parce que le convertisseur n’a aucune prise en charge du front matter et a analysé le bloc à la lettre. Le `---` d’ouverture est devenu un `<hr>`, vos lignes `key: value` sont devenues un paragraphe, et le `---` de fermeture a souligné ce paragraphe pour en faire un `<h2>`. Supprimez le bloc avant la conversion, ou prenez un outil qui le reconnaît.

### Comment retirer le front matter avant de convertir un fichier ?

En JavaScript, passez le texte dans `gray-matter` et donnez son `content` à votre moteur de rendu. En Python, utilisez `python-frontmatter`, ou l’extension `meta` de Python-Markdown, qui retire le bloc avant tout autre traitement. Avec Pandoc, activez `yaml_metadata_block` afin que le bloc soit traité comme des métadonnées et non comme du contenu.

### GitHub affiche-t-il le front matter YAML ?

Oui, sous forme de tableau au-dessus du document, avec les clés en ligne d’en-tête et les valeurs sur la ligne suivante. C’est un choix délibéré et non un accident de rendu, et cela signifie qu’un fichier peut paraître correct sur GitHub tout en ressortant sous forme de filet et de titre dans un convertisseur dépourvu de prise en charge du front matter.

### Puis-je utiliser du front matter TOML ou JSON plutôt que YAML ?

Vous le pouvez, et vous réduisez du même coup l’ensemble des outils capables de comprendre le fichier. Le TOML s’encadre par `+++`, et le JSON se présente soit en accolades sans encadrement, soit avec un délimiteur d’ouverture `---json` selon l’outil ; la prise en charge des deux est bien plus lacunaire que celle de YAML. Un analyseur Markdown ordinaire rend l’un comme l’autre en paragraphe visible plutôt qu’en filet suivi d’un titre.

### Un filet horizontal en tête de document risque-t-il d’être pris pour du front matter ?

Cela peut arriver. Un analyseur en quête de front matter prend le premier `---` pour un délimiteur d’ouverture et tout ce qui va jusqu’au `---` suivant pour des métadonnées : un document qui s’ouvre sur un filet peut donc perdre son premier paragraphe sans qu’aucune erreur ne soit levée nulle part. Écrivez vos filets `***` et gardez l’ambiguïté hors de vos fichiers.
