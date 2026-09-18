---
title: Rendre du Markdown en HTML avec Python
description: Python-Markdown, markdown2, mistune, markdown-it-py comparés : les extensions que chacun désactive, l’assainissement avec nh3, et un script qui fait échouer un build
updated: 2026-09-09
date: 2026-07-07
tag: Code
keywords: markdown vers html python, python markdown, markdown2 python, mistune, analyseur markdown python, convertir markdown en html python, extensions python markdown, markdown-it-py, pymdown-extensions, assainir html avec nh3, pypandoc
---

`markdown.markdown(text)` est la première ligne que presque tout le monde écrit, et elle fonctionne. Puis un tableau atterrit dans le README, le HTML revient avec des barres verticales plantées au milieu d’un paragraphe, et la recherche commence. Python compte quatre bibliothèques Markdown qu’il vaut la peine de connaître. Ce qui les distingue tient surtout à ce qui est activé par défaut, et à la marge de manœuvre qu’on a pour changer la sortie.

### En bref

Quatre bibliothèques, et le choix est plus étroit qu’il n’y paraît. **Python-Markdown** est celle sur laquelle repose la plupart de l’outillage Python, et elle n’active presque rien par défaut — tableaux, blocs de code, notes de bas de page et identifiants de titres sont tous des extensions qu’il faut nommer explicitement. **markdown2** est un module unique où les mêmes fonctions s’appellent des extras et où l’orthographe change. **mistune** est celle vers laquelle se tourner quand le HTML doit sortir sous une forme précise, parce qu’on sous-classe un moteur de rendu au lieu de passer une expression régulière sur la chaîne finale. **markdown-it-py** est celle qu’il faut choisir quand le même document doit s’afficher à l’identique dans un navigateur, car elle est un portage du markdown-it JavaScript et suit la spécification CommonMark. Aucune des quatre n’assainit le résultat, donc quel que soit votre choix, nh3 intervient ensuite.

Le frottement a toujours la même forme. Un script qui fonctionnait sur un README cesse de fonctionner la semaine où quelqu’un ajoute un tableau, une note de bas de page, ou un bloc de code indiquant un langage. Rien ne plante. L’analyseur lit les caractères de barre verticale comme du texte ordinaire, les enveloppe dans un paragraphe, et renvoie un HTML parfaitement valide et visiblement faux. La dégradation silencieuse est le comportement par défaut de tout analyseur Markdown, parce qu’il n’existe pas de Markdown invalide — tout ce que l’analyseur ne reconnaît pas devient de la prose.

La deuxième chose qui mord, c’est que le travail de la bibliothèque s’arrête plus tôt qu’on ne le croit. Les quatre renvoient un fragment : `<h1>Title</h1><p>Text</p>`, sans doctype, sans `<head>`, sans styles. Écrit dans un fichier `.html` et ouvert, cela donne du Times New Roman noir occupant toute la largeur de la fenêtre. La bibliothèque a fait son travail. Le reste — l’enveloppe, la feuille de style, l’assainisseur — vous revient, et cet article couvre l’ensemble.

## Les quatre bibliothèques en un coup d’œil

| Bibliothèque | Installation | Dialecte et spécification | Comment elle s’étend | Licence | Point fort |
| --- | --- | --- | --- | --- | --- |
| Python-Markdown | `pip install markdown` | Syntaxe Markdown d’origine par défaut ; pas conforme à CommonMark dans chaque détail | Extensions nommées via une API à points d’entrée, plus de grands paquets tiers | Gratuite, BSD-3-Clause | Les builds de documentation, et tout ce qui utilise déjà MkDocs |
| markdown2 | `pip install markdown2` | Son propre dialecte ; pas CommonMark | Une liste de chaînes « extras » passée à un seul appel | Gratuite, MIT | Un appel, une liste, aucun fichier de configuration |
| mistune | `pip install mistune` | « Compatible avec des règles CommonMark raisonnables », selon ses propres mots | Plugins nommés, plus des classes de rendu à sous-classer | Gratuite, BSD-3-Clause | Modifier le HTML produit sans post-traitement |
| markdown-it-py | `pip install markdown-it-py` | Suit la spécification CommonMark pour l’analyse de base | Préréglages, règles nommées individuellement, et mdit-py-plugins | Gratuite, MIT | Correspondre exactement à un front-end JavaScript |

Licences et affirmations de conformité vérifiées sur pypi.org, python-markdown.github.io, mistune.lepture.com et markdown-it-py.readthedocs.io, le 9 septembre 2026. Ce tableau ne contient volontairement aucun chiffre de vitesse : chaque benchmark Markdown publié mesure un corpus différent avec un jeu d’extensions différent, et le seul chiffre qui compte vraiment est celui que vous obtiendrez sur vos propres documents.

## Les quatre bibliothèques en détail

### Python-Markdown, et les extensions qu’elle laisse de côté

Python-Markdown — `pip install markdown`, importée sous le nom `markdown` — est la plus ancienne des quatre. Seule, elle implémente la syntaxe Markdown d’origine et rien de plus. Pas de tableaux. Pas de blocs de code délimités. Pas de notes de bas de page. Ce sont des extensions, et elles restent désactivées tant qu’on ne les nomme pas.

```python
import markdown

html = markdown.markdown(
    text,
    extensions=["tables", "fenced_code", "toc", "sane_lists"],
    extension_configs={"toc": {"anchorlink": True}},
)
```

Les réglages que l’on oublie sont presque toujours les suivants :

| Ce à quoi on s’attendait | Extension | Remarque |
| --- | --- | --- |
| Tableaux façon GitHub | `tables` | |
| Blocs de code à triple accent grave | `fenced_code` | |
| Identifiants et ancres sur les titres | `toc` | remplit aussi `md.toc` |
| Coloration syntaxique | `codehilite` | nécessite Pygments installé |
| Notes de bas de page | `footnotes` | |
| Attributs `{: .note}` sur les éléments | `attr_list` | |
| Un simple retour à la ligne devenant un saut de ligne | `nl2br` | |

`extra` active un lot groupé — `abbr`, `attr_list`, `def_list`, `fenced_code`, `footnotes`, `md_in_html`, `tables` — et vous rapproche de ce que vous pensiez sans doute déjà avoir (vérifié sur python-markdown.github.io, le 9 septembre 2026). Remarquez ce qui manque encore : `nl2br`, `codehilite`, `toc`, `smarty`, `sane_lists` et `meta`. `extra` est une commodité, pas un sur-ensemble, et les deux choses que l’on croit le plus souvent y trouver — les identifiants de titres et la coloration syntaxique — sont exactement celles qu’il laisse de côté.

La liste officielle complète est assez courte pour être lue une fois et cesser de deviner :

| Extension | Ce qu’elle fait | À savoir |
| --- | --- | --- |
| `tables` | Tableaux à barres verticales façon GFM | Dans `extra` |
| `fenced_code` | Blocs délimités par triples accents graves ou tildes | Dans `extra` ; la chaîne d’info devient une classe de langage |
| `footnotes` | Références `[^1]` et une liste de notes | Dans `extra` ; conserve un état entre les documents |
| `attr_list` | `{: .note #id }` après un élément définit classe, id et attributs | Dans `extra` ; la syntaxe est invisible pour tout autre analyseur |
| `def_list` | Listes de définitions | Dans `extra` |
| `abbr` | `*[HTML]: HyperText Markup Language` devient `<abbr>` | Dans `extra` |
| `md_in_html` | Analyse le Markdown à l’intérieur d’un bloc HTML brut marqué `markdown="1"` | Dans `extra` ; la raison pour laquelle une balise `<div>` cesse d’avaler votre texte |
| `codehilite` | Coloration syntaxique via Pygments | Absente d’`extra` ; nécessite Pygments installé et une feuille de style |
| `toc` | Identifiants sur les titres, un marqueur `[TOC]`, et `md.toc` | Absente d’`extra` ; conserve un état |
| `smarty` | Guillemets courbes, tirets demi-cadratin et cadratin, points de suspension | Absente d’`extra` ; change des caractères, donc comparez votre sortie |
| `meta` | Lit un bloc d’en-tête `clé : valeur` dans `md.Meta` | Absente d’`extra` ; ce n’est pas un analyseur YAML |
| `nl2br` | Un simple retour à la ligne devient `<br>` | Absente d’`extra` ; c’est le comportement des commentaires GitHub |
| `sane_lists` | Analyse de listes plus stricte : une liste exige une ligne vide avant elle | Absente d’`extra` |
| `admonition` | Blocs `!!! note` | Absente d’`extra` ; la syntaxe d’encadrés de MkDocs |
| `wikilinks` | `[[Page]]` devient un lien | Absente d’`extra` |
| `legacy_attrs`, `legacy_em` | Compatibilité avec le comportement antérieur à la version 3.0 | Seulement pour d’anciens documents |

Quatre d’entre elles méritent plus qu’une ligne de tableau.

**`codehilite`** ne colore rien par elle-même. Elle confie le code à Pygments, qui émet des éléments `<span>` porteurs de noms de classes, et ces classes ne signifient rien tant qu’une feuille de style ne les définit pas. La documentation de l’extension donne elle-même la commande qui en produit une — `pygmentize -S default -f html -a .codehilite > styles.css` — et ses options incluent `linenums`, `guess_lang`, `css_class`, `pygments_style`, `noclasses` et `use_pygments` (vérifié sur python-markdown.github.io, le 9 septembre 2026). `noclasses=True` écrit à la place les couleurs en attributs `style` en ligne, ce qui est plus lourd et plus laid, et exactement ce qu’il faut si le HTML doit survivre à un collage dans un e-mail. `use_pygments=False` se passe entièrement de Pygments et laisse une classe de langage sur l’élément `<code>`, à charge pour un colorateur côté client de la récupérer plus tard — le bon choix si la page en charge déjà un. [Ce dont la coloration syntaxique a réellement besoin sur la page](/blog/code-blocks-in-markdown) est une histoire plus longue qu’« ajouter une balise ».

**`toc`** fait deux choses, et c’est en général la seconde qu’on veut. Elle remplace un marqueur `[TOC]` dans la source par une liste imbriquée, et elle pose un `id` sur chaque titre. Ses options incluent `anchorlink`, `permalink`, `baselevel`, `separator`, `slugify` et `toc_depth`, et après une conversion l’instance porte à la fois `md.toc`, la table des matières sous forme de chaîne HTML, et `md.toc_tokens`, la même chose sous forme de dictionnaires imbriqués (vérifié sur python-markdown.github.io, le 9 septembre 2026). `md.toc` est disponible que le marqueur ait figuré dans le document ou non, ce qui permet à un template de placer la table des matières dans une barre latérale plutôt qu’en tête du texte. `baselevel` compte lorsque le template affiche déjà un `<h1>` : réglez-le sur 2 et les titres `#` du document ressortent en `<h2>` au lieu d’entrer en conflit avec la page.

**`meta`** a l’air de gérer le front matter, et ce n’est pas le cas. Elle lit un bloc de lignes `clé : valeur` en tête du fichier dans `md.Meta`, tolère les délimiteurs `---`, et sa documentation précise explicitement que le contenu n’est pas analysé comme du YAML. Chaque valeur arrive sous forme de liste de chaînes, une entrée par ligne, si bien que `md.Meta["title"][0]` est le titre et `md.Meta["title"]` une liste d’un seul élément (vérifié sur python-markdown.github.io, le 9 septembre 2026). Si vos fichiers portent du vrai YAML — clés imbriquées, listes, booléens, dates —, lisez l’en-tête avec `python-frontmatter` ou `yaml.safe_load` avant que le texte n’atteigne l’analyseur.

**`attr_list`** est celle qui coûte en portabilité. `{: .warning }` après un paragraphe est une convention propre à Python-Markdown ; sur GitHub, dans un aperçu de navigateur, ou dans l’une des trois autres bibliothèques présentées ici, ce sont cinq caractères littéraux à la fin de votre phrase.

Pour plus d’un document, construisez le convertisseur une seule fois avec `markdown.Markdown(extensions=[...])` et appelez `.reset()` entre les fichiers. Les notes de bas de page et la table des matières conservent un état, donc sans cette réinitialisation, la deuxième page hérite des notes de la première. La documentation dit la même chose avec plus de mots : l’analyseur peut avoir besoin que son état soit réinitialisé entre chaque appel à `convert` (vérifié sur python-markdown.github.io, le 9 septembre 2026). Le corollaire compte pour la section sur la concurrence plus bas — une instance `Markdown` est un objet à état, elle appartient donc à un worker, pas à un pool.

Deux réglages plus discrets, tous deux documentés dans la référence de la bibliothèque (vérifié sur python-markdown.github.io, le 9 septembre 2026). `output_format` prend `"xhtml"` ou `"html"`, et décide si un saut de ligne sort en `<br />` ou en `<br>` ; la valeur par défaut est `"xhtml"`, ce qui surprend ceux qui écrivent du HTML5. Et `tab_length` vaut 4 par défaut — si vos documents indentent les listes imbriquées avec deux espaces, c’est pour cela que l’imbrication s’effondre.

**pymdown-extensions** est ce que la plupart des gens installent réellement par-dessus. C’est un pack sous licence MIT, dans l’espace de noms `pymdownx`, qui embarque Arithmatex, B64, BetterEm, Blocks, Caret, Critic, Details, Emoji, EscapeAll, Extra, FancyLists, Highlight, InlineHilite, Keys, MagicLink, Mark, PathConverter, ProgressBar, Quotes, SaneHeaders, SmartSymbols, Snippets, StripHTML, SuperFences, Tabbed, Tasklist et Tilde (vérifié sur facelessuser.github.io, le 9 septembre 2026). Trois d’entre elles font l’essentiel du travail : `pymdownx.superfences` remplace `fenced_code` et permet aux blocs délimités de s’imbriquer dans des listes et des encadrés, `pymdownx.highlight` centralise la configuration de Pygments que `codehilite` porterait sinon seule, et `pymdownx.tasklist` donne la syntaxe de cases à cocher façon GitHub, pour laquelle Python-Markdown n’a pas d’extension officielle. Si vous vous êtes déjà demandé pourquoi un site MkDocs Material sait faire des onglets et pas votre script, ce pack est la réponse.

**Pour qui ?** Les scripts de build Python, et quiconque a une documentation qui passe déjà par MkDocs, où Python-Markdown est le moteur et où la liste d’extensions est de toute façon un fichier de configuration qu’on modifie déjà.

### markdown2 et ses extras

markdown2 est un module unique, de forme identique mais de vocabulaire différent : les fonctions s’appellent des *extras*, et elles sont, elles aussi, désactivées par défaut.

```python
import markdown2

html = markdown2.markdown(
    text,
    extras=["tables", "fenced-code-blocks", "strike", "header-ids", "footnotes"],
)
```

Il y a plus d’extras que quiconque ne s’en souvient, il est donc utile de les voir regroupés par usage (noms vérifiés sur github.com, le 9 septembre 2026) :

| Ce que vous voulez | Extras |
| --- | --- |
| Les fonctions GFM que vous pensiez déjà avoir | `tables`, `fenced-code-blocks`, `strike`, `task_list`, `header-ids`, `footnotes` |
| Métadonnées et structure | `metadata`, `toc`, `numbering`, `cuddled-lists`, `breaks` |
| Code et mathématiques | `code-friendly`, `highlightjs-lang`, `pyshell`, `latex`, `wavedrom`, `mermaid` |
| Typographie | `smarty-pants`, `middle-word-em`, `tag-friendly` |
| Liens et mise en forme de la sortie | `link-patterns`, `nofollow`, `target-blank-links`, `html-classes`, `xml` |
| Interopérabilité HTML | `markdown-in-html`, `wiki-tables`, `spoiler`, `tg-spoiler`, `admonitions` |

Trois d’entre elles méritent qu’on s’y arrête. `code-friendly` désactive `_` et `__` comme marqueurs d’emphase, ce qui règle le cas d’un document truffé de `some_variable_name` qui se met soudain en italique au milieu du mot. `link-patterns` prend une liste de paires expression régulière/remplacement et transforme automatiquement en lien tout ce qui correspond — `#1234` vers une URL de ticket, `CVE-2026-…` vers un avis de sécurité —, une fonction qu’aucune des trois autres bibliothèques n’offre en une ligne. Et `header-ids` est le nom que markdown2 donne à ce que Python-Markdown appelle `toc` ; si vous changez de bibliothèque et que vos ancres cassent, voilà pourquoi.

Le compromis oppose moins de rouages à un écosystème plus restreint : si vous avez besoin de quelque chose qu’aucune des deux bibliothèques ne fournit, Python-Markdown dispose d’une API d’extension documentée et d’extensions tierces sur lesquelles s’appuyer.

Attention à l’orthographe. Les deux bibliothèques nomment la même fonction différemment — `fenced_code` contre `fenced-code-blocks` —, gardez donc la liste dans une seule constante plutôt que de la retaper à chaque appel. Confondre les deux est la raison la plus courante pour laquelle une page affiche un tableau et une autre affiche des barres verticales.

**Pour qui ?** Un script qui n’a besoin que d’un import, d’un appel et d’une liste de chaînes, sans registre d’extensions, sans objet de configuration et sans second paquet. markdown2 est sous licence MIT (vérifié sur pypi.org, le 9 septembre 2026).

### mistune, pour changer la sortie

mistune est un analyseur Markdown en Python pur, construit autour de plugins et de moteurs de rendu. `mistune.html(text)` est l’appel de confort ; `create_markdown` est là où se prennent les décisions.

```python
import mistune

render = mistune.create_markdown(
    escape=True,
    plugins=["table", "strikethrough", "task_lists", "url"],
)
html = render(text)
```

`escape=True` échappe le HTML brut de la source au lieu de le laisser passer, ce qu’il faut faire quand le Markdown vient de quelqu’un d’autre. Passez `escape=False` quand la source est la vôtre et contient du HTML délibéré.

Les plugins fournis d’origine sont `strikethrough`, `footnotes`, `table`, `url`, `task_lists`, `def_list`, `abbr`, `mark`, `insert`, `superscript`, `subscript`, `math`, `ruby` et `spoiler` (vérifié sur mistune.lepture.com, le 9 septembre 2026). Passez-les sous forme de chaînes, ou importez les fonctions correspondantes — la forme chaîne est une simple recherche dans `mistune.plugins`.

La vraie raison de choisir mistune, c’est le moteur de rendu. Sous-classez `HTMLRenderer`, surchargez la méthode d’un type de nœud, et les images ou les liens sortent sous la forme voulue — avec `loading="lazy"`, par exemple — sans passer d’expression régulière sur la chaîne finale.

```python
from html import escape

import mistune
from mistune import HTMLRenderer


class DocRenderer(HTMLRenderer):
    def image(self, alt, url, title=None):
        attrs = f' title="{escape(title, quote=True)}"' if title else ""
        return (
            f'<img src="{escape(url, quote=True)}" alt="{escape(alt, quote=True)}"'
            f'{attrs} loading="lazy" decoding="async">'
        )

    def heading(self, text, level, **attrs):
        slug = attrs.get("id") or text.lower().replace(" ", "-")
        return f'<h{level} id="doc-{slug}">{text}</h{level}>'


render = mistune.create_markdown(renderer=DocRenderer(), plugins=["table", "footnotes"])
```

Les noms de méthodes sont les types de nœuds, et les signatures sont documentées : `link(self, text, url, title=None)`, `image(self, alt, url, title=None)`, `heading(self, text, level, **attrs)`, `block_code(self, code, info=None)`, `paragraph(self, text)`, `list(self, text, ordered, **attrs)`, `codespan(self, text)`, `inline_html(self, html)`, et le reste (vérifié sur mistune.lepture.com, le 9 septembre 2026). Les plugins ajoutent les leurs : `strikethrough(self, text)`, `table_cell(self, text, align=None, head=False)`.

Cette distinction — surcharger le moteur de rendu plutôt que rapiécer la chaîne — est tout l’argument en faveur de mistune, et il vaut la peine d’être concret sur les raisons. Post-traiter du HTML avec une expression régulière fonctionne jusqu’à ce qu’une balise `<img>` apparaisse dans un bloc de code, ou qu’une valeur d’attribut contienne le caractère que vous cherchiez, ou que quelqu’un écrive `<img>` dans une phrase qui parle de HTML. Le moteur de rendu travaille sur des nœuds déjà analysés, si bien qu’un bloc de code contenant le texte `<img src=x>` n’atteint jamais `image()` ; il atteint `block_code()`, en tant que texte. Il n’existe aucun cas où les deux approches divergent en votre faveur.

`block_code(self, code, info=None)` est le point d’accroche pour la coloration syntaxique : `info` est la chaîne qui suit les accents graves d’ouverture, vous obtenez donc le nom du langage et pouvez confier le corps à Pygments vous-même, avec vos propres noms de classes, sans extension intermédiaire. mistune fournit aussi `RSTRenderer` et `MarkdownRenderer` aux côtés de `HTMLRenderer`, ce qui permet de s’en servir pour normaliser du Markdown plutôt que d’en sortir complètement.

**Pour qui ?** Quiconque doit produire une sortie qui satisfait une contrainte que la bibliothèque ignore — une politique de sécurité de contenu qui interdit les styles en ligne, un pipeline d’images qui réécrit `src`, un système de design dont les tableaux ont besoin d’un `<div>` englobant pour défiler horizontalement. mistune est sous licence BSD-3-Clause (vérifié sur pypi.org, le 9 septembre 2026).

### markdown-it-py, et pourquoi la conformité à CommonMark compte

Quand l’exigence est « conforme à la spécification », markdown-it-py est la réponse directe. C’est un portage Python du markdown-it JavaScript, qui suit CommonMark de près. Les préréglages choisissent un point de départ, et les règles s’activent par leur nom.

```python
from markdown_it import MarkdownIt

md = MarkdownIt("commonmark")
md.enable(["table", "strikethrough"])
html = md.render(text)
```

Les préréglages sont le moyen le plus rapide de dire ce que l’on veut (vérifié sur markdown-it-py.readthedocs.io, le 9 septembre 2026) :

| Préréglage | Ce qu’on obtient |
| --- | --- |
| `zero` | Paragraphes et texte, rien d’autre — un point de départ que l’on enrichit règle par règle |
| `commonmark` | CommonMark strict : code délimité, pas de tableaux, pas de barré, pas de liens automatiques |
| `js-default` | HTML brut désactivé, tableaux et barré activés |
| `gfm-like` | Tableaux, barré et linkify — nécessite le paquet `linkify-it-py` |
| `gfm-like2` | `gfm-like` plus listes de tâches, alertes façon GitHub et barré à tilde simple ; nécessite aussi `linkify-it-py` |

Les règles s’activent et se désactivent par leur nom, aux niveaux core, bloc et en ligne, de façon permanente via `enable()` et `disable()`, ou temporaire via un gestionnaire de contexte. Cette granularité est inhabituelle, et c’est parfois exactement ce qu’on cherche : si votre plateforme ne doit jamais afficher d’images, `md.disable("image")` est une garantie au niveau de l’analyseur, pas un filtre appliqué après coup.

`mdit-py-plugins` est le paquet compagnon — `pip install mdit-py-plugins`, avec en plus `pip install markdown-it-py[linkify]` si vous voulez les préréglages linkify —, et il porte les extensions de syntaxe absentes de la spécification : front matter, notes de bas de page, listes de définitions, conteneurs, ancres, listes de tâches. Elles s’appliquent avec `md.use(plugin)` :

```python
from markdown_it import MarkdownIt
from mdit_py_plugins.front_matter import front_matter_plugin
from mdit_py_plugins.footnote import footnote_plugin

md = MarkdownIt("gfm-like").use(front_matter_plugin).use(footnote_plugin)
html = md.render(text)
```

Voici maintenant, dit sans détour, pourquoi la conformité compte. Un document Markdown rendu deux fois — une fois par votre back-end Python pour la copie envoyée par e-mail, une fois par du JavaScript dans le navigateur pour l’aperçu en direct — doit ressortir identique, et « identique » n’est jamais ce que sont deux analyseurs écrits indépendamment. Les liens de style référence, la continuation paresseuse des citations, le nombre d’accents graves qui referme un bloc, le fait qu’une liste soit lâche ou compacte, ce que fait un tiret bas à l’intérieur d’un mot : ce sont exactement les cas où les implémentations divergent, et chacun d’eux est fixé par la spécification CommonMark et sa suite de tests. Deux analyseurs qui passent tous deux cette suite sont d’accord. Deux analyseurs qui ne la passent pas tous deux le sont jusqu’à ce qu’un rédacteur fasse quelque chose d’un peu inhabituel, et alors l’aperçu et le fichier exporté divergent — le genre de bogue qui prend une journée à trouver, parce que le document a l’air très bien dans l’outil où on le regarde.

markdown-it-py est un portage du markdown-it JavaScript, les deux partagent donc non seulement une spécification, mais une lignée d’implémentation et un vocabulaire de plugins. C’est ce qui se rapproche le plus d’une garantie d’accord. Le dialecte visé compte plus que la bibliothèque choisie ; [CommonMark, GFM et les dialectes](/blog/commonmark-gfm-and-the-flavours) expose les différences, et ces mêmes bibliothèques ont leurs équivalents dans [le rendu de Markdown en JavaScript](/blog/markdown-to-html-in-javascript).

**Pour qui ?** Tout ce qui a un navigateur en face, tout ce où une différence de rendu se traduit par un ticket de support, et quiconque préfère lire une spécification plutôt qu’un changelog. Elle est sous licence MIT (vérifié sur pypi.org, le 9 septembre 2026).

## Assainir le HTML, et le seul ordre qui fonctionne

Aucune de ces quatre bibliothèques n’est un assainisseur. Markdown autorise le HTML brut par construction, une balise `<script>` dans la source reste donc une balise `<script>` dans la sortie, sauf si quelque chose l’échappe ou la retire. Python-Markdown le dit elle-même en toutes lettres : la bibliothèque n’assainit pas sa sortie HTML, et si l’entrée vient d’une source non fiable, l’assainir vous revient (vérifié sur python-markdown.github.io, le 9 septembre 2026).

bleach a été la réponse standard pendant des années, et il vaut la peine de vérifier son statut plutôt que de répéter ce qu’on a entendu la dernière fois. Sa propre page PyPI indique désormais que bleach n’est plus maintenue et qu’il n’y aura plus de nouvelles versions, y compris pour des failles de sécurité ; la dernière version est la 6.4.0, du 5 juin 2026, sous licence Apache 2.0 (vérifié sur pypi.org, le 9 septembre 2026). Un assainisseur non maintenu est une position pire que l’absence d’assainisseur, parce qu’il ressemble à une protection lors d’une revue de code.

La réponse actuelle est nh3, un binding Python sous licence MIT vers ammonia, l’assainisseur HTML écrit en Rust (vérifié sur pypi.org, le 9 septembre 2026). C’est une fonction unique posée sur un analyseur éprouvé, et elle échoue de façon sûre : tout ce qui n’est pas sur la liste blanche est retiré.

```python
import nh3

safe = nh3.clean(
    html,
    tags={"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "table",
          "thead", "tbody", "tr", "th", "td", "em", "strong", "blockquote", "hr",
          "img", "sup", "sub", "del"},
    attributes={
        "a": {"href", "title"},
        "img": {"src", "alt", "title", "loading"},
        "code": {"class"},
        "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"},
    },
    url_schemes={"http", "https", "mailto"},
    id_prefix="doc-",
    link_rel="noopener noreferrer nofollow",
)
```

Chaque argument y fait quelque chose de précis, et les noms de mots-clés sont ceux de la bibliothèque elle-même (vérifié sur nh3.readthedocs.io, le 9 septembre 2026) :

| Argument | Ce qu’il décide |
| --- | --- |
| `tags` | La liste blanche d’éléments. Omettez-le et vous obtenez le jeu par défaut d’ammonia |
| `attributes` | Quels attributs survivent, par balise. `"*"` comme clé s’applique à toutes les balises. Le jeu par défaut n’inclut pas `id` |
| `url_schemes` | Par quoi `href` et `src` peuvent commencer. C’est là que `javascript:` meurt |
| `id_prefix` | Préfixe une chaîne à chaque `id` autorisé, ce qui règle le DOM clobbering |
| `link_rel` | La valeur `rel` ajoutée aux liens ; vaut `noopener noreferrer` par défaut |
| `clean_content_tags` | Balises dont le *contenu* est aussi retiré — le bon traitement pour `script` et `style` |
| `strip_comments` | Activé par défaut, pour que les astuces à base de commentaires conditionnels ne survivent pas |
| `attribute_filter` | Un callback qui peut réécrire une valeur au lieu de supprimer l’attribut |

`clean_content_tags` est celui qu’on oublie le plus souvent. Retirer une balise `<script>` en gardant son texte laisse le JavaScript posé dans le document comme de la prose visible, ce qui est inoffensif et ressemble à un bogue. Retirer la balise et son contenu, voilà ce qu’on voulait vraiment.

Voici maintenant l’ordre, parce que c’est la partie qu’on fait le plus souvent à l’envers. Assainissez après le rendu, jamais avant. Filtrer la source Markdown revient à deviner, parce que c’est l’analyseur qui décide quels caractères deviennent une balise : un `<` dans un bloc de code est du texte, le même `<` dans un paragraphe démarre un élément, et un schéma encodé en pourcentage dans la destination d’un lien est décodé par l’analyseur, pas par votre expression régulière. Tout filtre appliqué à la source doit réimplémenter l’analyseur pour savoir qui est quoi, et s’il pouvait le faire, ce serait l’analyseur. Faites le rendu d’abord, puis nettoyez le HTML — c’est la seule étape où la chaîne que vous inspectez est celle que recevra le navigateur. [Assainir le Markdown en toute sécurité](/blog/sanitising-markdown-safely) détaille les cas d’échec.

Il existe une exception légitime, qui n’en est pas vraiment une : refuser le HTML brut au moment de l’analyse. `mistune.create_markdown(escape=True)` et `MarkdownIt("commonmark")` avec le HTML désactivé signifient tous deux que l’analyseur n’émet jamais de balise brute en premier lieu. C’est une garantie plus forte que l’assainissement, et elle n’est possible que parce qu’elle se produit à l’intérieur de l’analyseur plutôt que devant lui. Utilisez-la quand la source n’est pas fiable et que vous n’avez besoin d’aucun HTML. Utilisez nh3 quand il vous en faut un peu.

TransformPipe est construit de la même façon : marked fait le rendu, puis DOMPurify dans le navigateur et le paquet `xss` côté serveur nettoient le résultat contre une même liste blanche partagée, si bien que les deux côtés produisent le même document. Ses identifiants de titres portent un préfixe `doc-`, ce qui les tient à l’écart du DOM clobbering — exactement le travail que fait `id_prefix` ci-dessus.

## Transformer un fragment en page

Les quatre bibliothèques renvoient un fragment, et un fragment n’est pas un document. Trois choses doivent lui arriver avant que quiconque d’autre puisse ouvrir le fichier : une enveloppe, des styles, et une décision sur ce que le fichier a le droit de demander au réseau.

L’enveloppe est un template, et Jinja2 s’impose parce qu’il est déjà présent dans la plupart des projets Python :

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ title }}</title>
    <style>{{ css }}</style>
  </head>
  <body>
    <main>{{ body|safe }}</main>
  </body>
</html>
```

```python
from jinja2 import Environment, FileSystemLoader, select_autoescape

env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
)
page = env.get_template("page.html").render(title=title, body=safe_html, css=css)
```

Deux pièges en six lignes. Le premier est `|safe`. Avec l’autoéchappement activé — et il devrait l’être —, `{{ body }}` affiche votre HTML comme du texte littéral, et vous obtenez une page qui montre `<p>Hello</p>` en toutes lettres. `|safe` est ce qui dit « cette chaîne est déjà du HTML ». Le second piège suit immédiatement : `|safe` est une promesse que vous faites, la seule chaîne que vous devriez jamais marquer sûre est donc celle qui est déjà passée par nh3. Assainir, puis marquer sûr, dans cet ordre. Un template qui marque comme sûre une sortie d’analyseur non assainie a discrètement réintroduit tous les problèmes que la section précédente venait de résoudre.

Les styles sont la partie que l’on saute et que l’on regrette ensuite. Une feuille de style dans une balise `<link>` rend le fichier HTML dépendant d’un second fichier ; déplacez l’un sans l’autre et la page perd sa mise en forme. Une feuille de style venue d’un CDN rend le fichier dépendant d’un réseau, et révèle à quiconque l’ouvre quelque chose sur l’endroit où le fichier est passé. Lire le CSS sur le disque et le passer dans `{{ css }}` l’intègre en ligne, ce qui est plus lourd mais se comporte de la même façon partout :

```python
from pathlib import Path

css = Path("assets/page.css").read_text(encoding="utf-8")
if use_pygments:
    css += Path("assets/pygments.css").read_text(encoding="utf-8")
```

Cette seconde ligne explique pourquoi `codehilite` n’a pas fini son travail une fois les classes émises — la feuille de style de Pygments doit voyager avec la page, sinon la coloration reste invisible.

Les images sont la dernière dépendance. `<img src="diagram.png">` dans un fichier censé être autonome est une image cassée sur la machine de quelqu’un d’autre. Livrez le dossier entier, ou lisez les octets et intégrez-les en URI `data:`, ce dont a besoin un fichier réellement autonome :

```python
import base64, mimetypes
from pathlib import Path


def inline(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"
```

Le test pour savoir si vous avez fini est simple et prend une minute : copiez le fichier `.html` sur une autre machine, coupez le réseau, et ouvrez-le. Tout ce qui a l’air faux est une dépendance dont vous n’aviez pas remarqué l’existence.

## Un script qui convertit un dossier

Assemblez les pièces, et un dossier entier tient en une quinzaine de lignes.

```python
from pathlib import Path
import markdown, nh3

TEMPLATE = "<!doctype html><meta charset=utf-8><title>{title}</title>{body}"

md = markdown.Markdown(extensions=["tables", "fenced_code", "toc"])
src, out = Path("docs"), Path("build")

for path in sorted(src.rglob("*.md")):
    body = nh3.clean(md.convert(path.read_text(encoding="utf-8")))
    md.reset()
    target = out / path.relative_to(src).with_suffix(".html")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(TEMPLATE.format(title=path.stem, body=body), encoding="utf-8")
    print(f"{path} -> {target}")
```

Trois détails font le travail. `encoding="utf-8"` à la fois en lecture et en écriture, parce que l’encodage par défaut de la plateforme n’est pas UTF-8 partout, et un tiret cadratin suffit à faire échouer le job. `sorted()`, pour que l’ordre du build soit le même sur chaque machine. `md.reset()` à l’intérieur de la boucle, pour la raison exposée plus haut.

Le script ci-dessus tombe dans un piège : `nh3.clean` sans arguments utilise la liste blanche par défaut d’ammonia, et `id` n’en fait pas partie, si bien que les ancres de titres que `toc` vient d’ajouter sont aussitôt retirées. Autorisez l’attribut par balise — `attributes={"h1": {"id"}, "h2": {"id"}}` — et définissez `id_prefix="doc-"`, parce qu’un `id` nu sur un titre peut masquer une propriété du DOM portant le même nom.

Quinze lignes, c’est la démonstration. Ce que cela devient une fois que ça tourne sur une planification, c’est un script qui saute le travail déjà fait, convertit les fichiers en parallèle, et signale à un job de CI que quelque chose a mal tourné. Trois ajouts, donc, et chacun mérite d’être compris plutôt que recopié.

```python
#!/usr/bin/env python3
"""Convert docs/**/*.md to build/**/*.html. Exit non-zero if any file fails."""
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import markdown
import nh3
from jinja2 import Environment, FileSystemLoader, select_autoescape

SRC, OUT = Path("docs"), Path("build")
PAGE = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html"]),
).get_template("page.html")
EXTENSIONS = ["tables", "fenced_code", "footnotes", "attr_list", "toc", "sane_lists"]
TAGS = {"p", "a", "code", "pre", "h1", "h2", "h3", "h4", "ul", "ol", "li", "em",
        "strong", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td"}
ATTRS = {"a": {"href", "title"}, "code": {"class"},
         "h1": {"id"}, "h2": {"id"}, "h3": {"id"}, "h4": {"id"}}


def convert(path: Path) -> tuple[Path, str | None]:
    target = OUT / path.relative_to(SRC).with_suffix(".html")

    if target.exists() and target.stat().st_mtime >= path.stat().st_mtime:
        return path, None

    try:
        md = markdown.Markdown(extensions=EXTENSIONS)
        body = nh3.clean(
            md.convert(path.read_text(encoding="utf-8")),
            tags=TAGS, attributes=ATTRS, id_prefix="doc-",
            url_schemes={"http", "https", "mailto"},
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(PAGE.render(title=path.stem, body=body, toc=md.toc),
                          encoding="utf-8")
    except Exception as error:                      # noqa: BLE001 - report, do not stop
        return path, f"{type(error).__name__}: {error}"

    return path, None


def main() -> int:
    paths = sorted(SRC.rglob("*.md"))

    with ProcessPoolExecutor() as pool:
        results = list(pool.map(convert, paths))

    failures = [(path, error) for path, error in results if error]

    for path, error in failures:
        print(f"{path}: {error}", file=sys.stderr)

    print(f"{len(paths) - len(failures)} of {len(paths)} converted", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
```

**`pathlib` plutôt que `os.path`.** `rglob("*.md")` parcourt l’arborescence, `relative_to` donne la partie du chemin qu’il faut reproduire dans le dossier de sortie, `with_suffix(".html")` le renomme, et `mkdir(parents=True, exist_ok=True)` crée ce qui manque. Tout le calcul de chemin tient en une expression, et c’est la même expression sous Windows et sous Linux — ce qui compte, car un script qui assemble des chemins avec `"/"` produit une sortie dont personne ne remarque qu’elle est fausse avant qu’elle ne tourne sur un agent de build.

**Sauter grâce à l’horodatage.** `target.stat().st_mtime >= path.stat().st_mtime` est le test de péremption utile le moins cher qui soit, et c’est exactement ce que fait `make`. Il a deux modes d’échec connus, qu’il faut connaître tous les deux. Un changement dans le template ou dans la liste d’extensions ne modifie l’horodatage d’aucun fichier source, donc les sorties ne sont pas reconstruites — la solution est de comparer aussi à l’horodatage du template, ou de garder un hachage de la configuration à côté de la sortie. Et un checkout n’est pas une copie : certains systèmes de CI donnent à chaque fichier l’heure du checkout, ce qui fait paraître tout neuf et reconstruit le monde entier. C’est lent plutôt que faux, ce qui est le bon sens dans lequel un cache doit échouer.

**Une correspondance concurrente.** `pool.map` sur un `ProcessPoolExecutor` conserve la forme du code de la boucle et utilise chaque cœur. Des processus plutôt que des threads, parce qu’analyser du Markdown est du Python pur et que le verrou global de l’interpréteur CPython empêche les threads de recouvrir le travail ; le coût est que les arguments et les valeurs de retour sont sérialisés (pickle), c’est pourquoi `convert` renvoie un petit tuple plutôt que le HTML. Il construit aussi sa propre instance `Markdown` par appel — l’instance a un état, la même raison qui justifie `.reset()`, et en partager une entre workers est le moyen le plus sûr de voir une note de bas de page d’une page apparaître au bas d’une autre.

**Un code de sortie.** `return 1 if failures else 0` est ce qui fait de ceci une étape de build plutôt qu’un script que quelqu’un lance. `raise SystemExit(main())` le propage. Les erreurs partent vers stderr et le processus continue de convertir les autres fichiers, un document défaillant donne donc un message d’erreur et un rapport complet, plutôt qu’une pile d’appels et aucune idée du nombre d’autres fichiers touchés. Dans un job GitHub Actions, une sortie non nulle fait échouer l’étape, et le journal contient déjà la liste des fichiers en cause. [Convertir plusieurs fichiers à la fois](/blog/batch-convert-markdown-files) couvre les variantes — sortie à plat, document fusionné unique, surveillance des changements.

## pypandoc, et quand appeler Pandoc en sous-processus est la bonne décision

Aucune des quatre bibliothèques ci-dessus ne lit autre chose que du Markdown, et aucune n’écrit autre chose que du HTML. Dès que le cahier des charges comporte un second format — un document Word qu’il faut d’abord transformer en Markdown, un PDF à la sortie, un manuscrit LaTeX, un EPUB —, la réponse honnête est d’arrêter d’écrire un pipeline d’analyseurs et d’appeler Pandoc.

pypandoc en est le mince enrobage. Il est sous licence MIT, il exige Pandoc lui-même, et il existe en deux saveurs : `pypandoc`, qui attend Pandoc déjà présent sur le système, et `pypandoc_binary`, qui l’embarque. Il existe aussi `download_pandoc()` pour le récupérer à l’exécution (vérifié sur pypi.org, le 9 septembre 2026).

```python
import pypandoc

html = pypandoc.convert_text(
    text, to="html5", format="gfm",
    extra_args=["--standalone", "--embed-resources", "--toc"],
)

pypandoc.convert_file("docs/report.md", to="pdf", outputfile="report.pdf")
```

`convert_text` exige que le format d’entrée soit nommé explicitement ; `convert_file` le déduit de l’extension. Les deux acceptent `extra_args` pour les propres options de Pandoc et `filters` pour ses programmes-filtres. Les trois options ci-dessus sont celles qui transforment un fragment en fichier que quelqu’un d’autre peut ouvrir : `--standalone` produit une sortie avec un en-tête et un pied plutôt qu’un fragment, `--embed-resources` intègre en ligne les scripts, feuilles de style et images liés sous forme d’URI `data:`, et `--toc` génère une table des matières (vérifié sur pandoc.org, le 9 septembre 2026).

Tournez-vous vers lui quand le pipeline dépasse le simple Markdown vers HTML. Ne le faites pas sinon, et sachez clairement ce que vous embarquez : un binaire externe dans chaque environnement où le code tourne, une version de ce binaire qu’il faut figer parce que la sortie change d’une version à l’autre, un sous-processus par document avec le coût de démarrage que cela implique, et un convertisseur qui laisse passer le HTML brut tel quel — Pandoc n’est pas non plus un assainisseur. En échange, il gère les templates, il intègre les ressources, il lit et écrit des formats que rien d’autre ne touche, et il survivra à votre script. [Les alternatives, et quand chacune est le meilleur outil](/blog/pandoc-alternatives-for-markdown-to-html) est la comparaison complète.

## Ce que coûtent les extensions : rien ici n’est portable

Voici la partie que la documentation des bibliothèques ne met jamais en avant. Toute fonction au-delà du CommonMark simple est une extension, les extensions sont propres à chaque bibliothèque, et un document écrit en s’appuyant sur les extensions d’une bibliothèque est un document qui s’affiche correctement à exactement un seul endroit.

Voyons concrètement ce que cela signifie :

| La syntaxe | Où elle s’affiche | Où elle ne s’affiche pas |
| --- | --- | --- |
| `{: .warning #note }` | Python-Markdown avec `attr_list`, MkDocs | GitHub, markdown-it-py, mistune, markdown2 — affiché comme du texte littéral |
| Blocs `!!! note` | Python-Markdown avec `admonition`, MkDocs Material | Partout ailleurs — un paragraphe commençant par trois points d’exclamation |
| `[TOC]` | Python-Markdown avec `toc` | Partout ailleurs — un paragraphe contenant le mot TOC |
| Blocs `~~~` avec attributs | `pymdownx.superfences` | `fenced_code` simple gère le bloc, mais abandonne les attributs |
| Listes de tâches `- [ ]` | GitHub, `pymdownx.tasklist`, le `task_lists` de mistune, `gfm-like2` | Python-Markdown sans extension — un élément de liste commençant par des crochets |
| Notes de bas de page `[^1]` | Python-Markdown, markdown2, mistune, mdit-py-plugins — les quatre, chacune à sa façon | Le CommonMark simple ; et les identifiants générés diffèrent entre les quatre |
| Mathématiques `$x^2$` | `pymdownx.arithmatex`, le `latex` de markdown2, le `math` de mistune | Tout le reste — et chacune des trois émet un balisage différent |

L’échec est silencieux sur chaque ligne. Rien ne plante. Le document contient simplement une phrase qui était autrefois un encadré.

Un document qui s’affiche dans MkDocs n’est donc pas un document qui s’affiche partout. C’est un document qui s’affiche dans MkDocs. Si votre Markdown vit dans un dépôt que des gens lisent aussi sur GitHub, ou se retrouve collé dans un client de messagerie, ou est exporté vers Word par quelqu’un d’une autre équipe, alors les extensions que vous activez sont un coût payé par chaque lecteur qui n’utilise pas votre build. La façon de garder ce coût visible est de noter quelles extensions vos documents ont le droit d’utiliser, de garder cette liste dans une seule constante du code, et de tester un document représentatif — avec un tableau, une note de bas de page, une liste imbriquée et un bloc de code — à travers chaque moteur de rendu qui le verra un jour.

Les notes de bas de page méritent un avertissement spécifique, parce que c’est l’extension la plus susceptible d’être activée par deux bibliothèques différentes dans la même organisation. Les quatre les gèrent, aucune ne génère les mêmes identifiants, et les liens de retour diffèrent. Fusionnez deux documents rendus en une seule page et les ancres entrent en collision. Convertissez un même document avec deux outils différents et les URL des liens de notes changent, ce qui casse tout ce qui pointait vers elles.

Et il y a aussi un coût à l’intérieur de votre propre build. Chaque extension est du code qui tourne sur chaque document. `codehilite` embarque Pygments et une feuille de style. `smarty` réécrit des caractères, un diff de votre sortie après son activation est donc plein de changements que vous n’aviez pas voulus — y compris à l’intérieur de tout ce qui n’était pas censé être de la prose. `nl2br` change ce que signifie un retour à la ligne simple, ce qui change la façon dont un paragraphe se recompose dans chaque document écrit avant que vous ne l’activiez. Les extensions ne sont pas gratuites, et elles ne sont pas réversibles sans un nouveau rendu.

## Comment choisir

1. **Partez de ce qui doit voir la sortie.** Si un navigateur affiche la même source avec une bibliothèque JavaScript, choisissez markdown-it-py et alignez le préréglage ; sinon, l’aperçu et l’export finiront par diverger, et vous l’apprendrez d’un lecteur plutôt que d’un test.
2. **Comptez les extensions dont vous avez réellement besoin avant de choisir la bibliothèque.** Si la liste se limite aux tableaux et au code délimité, les quatre le font. S’il s’agit d’encadrés, d’onglets et de mathématiques, vous choisissez Python-Markdown plus pymdown-extensions que vous le vouliez ou non, et vous acceptez que la source ne s’affiche correctement que là.
3. **Décidez qui a écrit le Markdown.** Pour votre propre dépôt, l’assainissement relève de l’hygiène. Pour tout ce qui vient d’un utilisateur, d’une API ou d’un client, c’est l’exigence autour de laquelle le reste de la conception doit s’articuler — et cela signifie nh3 après le rendu, ou un analyseur configuré pour refuser tout HTML brut.
4. **Demandez-vous s’il faut modifier la sortie ou seulement la produire.** Si le HTML doit porter des attributs, des enveloppes ou des noms de classes particuliers, le moteur de rendu de mistune vous épargne une étape de post-traitement qui finira par se tromper le jour où quelqu’un écrira sur le HTML dans un bloc de code.
5. **Vérifiez que la destination est un document, pas un fragment.** Une bibliothèque renvoie un fragment ; si le fichier part vers une personne, quelque chose doit ajouter le doctype, le head et les styles en ligne, et ce quelque chose est votre template. Testez-le réseau coupé avant de l’envoyer.
6. **Figez ensemble la bibliothèque et la liste d’extensions.** Une version mineure qui change une valeur par défaut, ou un collègue qui ajoute une extension pour corriger une page, change toutes les pages. Les deux doivent vivre dans le même commit que le fichier de dépendances.
7. **Arrêtez-vous et utilisez Pandoc si la liste de formats dépasse un.** Une bibliothèque Markdown-vers-HTML à qui l’on greffe une branche Word et une branche PDF n’est qu’un Pandoc moins bon, avec une suite de tests plus petite.

## Conclusion

Choisissez selon le besoin : Python-Markdown pour les extensions et l’écosystème de documentation construit dessus, markdown2 quand un appel avec une liste d’extras suffit à tout le travail, mistune quand le HTML doit sortir sous une forme précise, markdown-it-py quand il doit correspondre à la spécification et à un navigateur. Ajoutez ensuite nh3 après le rendu, placez le fragment dans un template qui intègre ses propres styles, et donnez au script un code de sortie pour qu’un document défaillant fasse échouer un build plutôt que d’être livré. Si tout ce qu’il vous faut est une page qu’un collègue peut ouvrir, sautez le build entièrement — [convertissez le fichier dans le navigateur](/) et téléchargez le HTML autonome, ou faites en sorte que le script l’envoie en POST à l’API et récupère un lien en lecture seule en un seul appel.

## FAQ

### Quelle bibliothèque Python utiliser pour convertir du Markdown en HTML ?

Python-Markdown si vous êtes déjà dans une chaîne de documentation qui l’utilise, markdown-it-py si un navigateur doit afficher la même source à l’identique, mistune s’il faut modifier le HTML produit, et markdown2 pour un import et un appel. Les quatre sont gratuites et open source, et aucune n’assainit.

### Pourquoi ma sortie Python-Markdown affiche-t-elle des barres verticales au lieu d’un tableau ?

Parce que `tables` est une extension désactivée tant qu’on ne la nomme pas : `markdown.markdown(text, extensions=["tables"])`. Il en va de même pour les blocs de code délimités, les notes de bas de page et les identifiants de titres. Le lot `extra` active sept extensions dont `tables`, mais ni `toc` ni `codehilite`.

### bleach est-il toujours la bonne façon d’assainir du HTML en Python ?

Non. La page PyPI de bleach indique elle-même qu’elle n’est plus maintenue et qu’il n’y aura plus de nouvelles versions, y compris pour des failles de sécurité, la dernière étant la 6.4.0 du 5 juin 2026 (vérifié sur pypi.org, le 9 septembre 2026). nh3, un binding vers la bibliothèque Rust ammonia, est le remplaçant actuel, et prend une liste blanche explicite de balises et d’attributs.

### Faut-il assainir le Markdown ou le HTML ?

Le HTML, toujours, et après le rendu. C’est l’analyseur qui décide quels caractères de la source deviennent des balises, un filtre appliqué sur le Markdown doit donc deviner, et il se trompe sur les blocs de code, les destinations de liens et les caractères échappés. L’alternative est de configurer l’analyseur pour qu’il refuse le HTML brut dès le départ, ce qui est encore plus solide.

### Comment obtenir la coloration syntaxique dans Python-Markdown ?

Activez `codehilite`, installez Pygments, et générez la feuille de style — la documentation de l’extension donne la commande `pygmentize -S default -f html -a .codehilite > styles.css` (vérifié sur python-markdown.github.io, le 9 septembre 2026). Sans cette feuille de style, les classes sont là et les couleurs ne le sont pas. `noclasses=True` écrit des styles en ligne à la place, ce qui survit à un collage sans le CSS.

### Qu’est-ce que pymdown-extensions, et en avez-vous besoin ?

C’est un pack d’extensions sous licence MIT pour Python-Markdown, dans l’espace de noms `pymdownx`, qui comprend SuperFences, Highlight, Tabbed, Tasklist, Details et Arithmatex (vérifié sur facelessuser.github.io, le 9 septembre 2026). Il vous en faut si vous voulez des onglets, des blocs imbriqués, des listes de tâches ou des mathématiques, rien de tout cela n’étant fourni officiellement par Python-Markdown. Vous n’en avez pas besoin pour les tableaux, les notes de bas de page ou les blocs de code.

### Puis-je faire en sorte que Python et JavaScript affichent le même Markdown à l’identique ?

Presque, en utilisant markdown-it-py en Python et markdown-it en JavaScript — le premier est un portage du second, tous deux suivent la spécification CommonMark, et les noms de plugins correspondent en grande partie. Gardez le préréglage et les règles activées dans une configuration partagée unique, car une différence dans cette liste produit une différence de sortie qu’aucun des deux côtés ne signale.
