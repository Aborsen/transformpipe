---
title: "Les notes de bas de page en Markdown : la syntaxe, et qui la rend vraiment"
description: "Les notes ne figurent dans aucune spécification Markdown. La syntaxe que GitHub et Pandoc acceptent, les analyseurs qui la rendent, et les replis"
date: 2026-08-19
tag: Syntaxe
keywords: notes de bas de page markdown, syntaxe note markdown, note markdown ne fonctionne pas, notes de bas de page github markdown, pandoc notes de bas de page, markdown-it-footnote, notes en ligne markdown
---

### En bref

Les notes de bas de page ne figurent ni dans CommonMark ni dans la spécification GitHub Flavored Markdown : tout outil qui rend `[^1]` le fait au titre d’une extension, et tout outil qui ne le fait pas affiche vos crochets en texte littéral. GitHub les rend sur son site, Pandoc les rend, Hugo les rend, et markdown-it, remark, Python-Markdown et Goldmark les rendent dès lors que vous ajoutez le greffon ou l’extension en le nommant. marked ne le fait pas, sauf extension tierce, et un analyseur CommonMark strict ne le fera jamais. Si une note doit traverser une chaîne d’outils que vous ne maîtrisez pas, ou bien écrivez l’incise dans la phrase, ou bien construisez l’appel et l’ancre à la main, car une note qui devient discrètement `[^1]` dans votre page publiée est la façon la plus courante dont cette fonctionnalité échoue.

Vous avez écrit `[^1]` dans un paragraphe et `[^1]: la note` au bas du fichier. Sur GitHub, le résultat est parfait : un petit numéro en exposant, un filet vers le bas de page, la note en dessous, une petite flèche qui vous ramène. Vous convertissez le même fichier avec autre chose et la page contient, au milieu d’une phrase, les quatre caractères `[^1]`.

Rien n’est cassé. Le convertisseur a analysé votre fichier correctement et a rendu exactement ce que la spécification qu’il implémente lui dit de rendre. Les notes de bas de page ne figurent pas dans cette spécification. Elles ne figurent dans aucune — ni CommonMark, ni la spécification GFM, ni la page de syntaxe du Markdown.pl d’origine. Elles existent parce que PHP Markdown Extra leur a inventé une syntaxe au milieu des années 2000, que tout le monde a copié cette syntaxe, et que GitHub a fini par la livrer sur son propre site sans l’ajouter à la spécification qu’il publie. Cette histoire est toute la raison d’être de cet article.

Il y a donc deux questions qui méritent une réponse, et elles sont distinctes. La première est celle de la syntaxe, puisque presque toutes les implémentations ont copié la même et que les différences sont dans les coins. La seconde est celle des outils qui la comprennent, car c’est elle qui décide si votre document survit au voyage. Ce texte répond aux deux, puis traite la partie que personne n’écrit : quoi faire quand la réponse à la seconde question est « pas celui-ci ».

## La syntaxe, telle que GitHub et Pandoc l’acceptent

Une note de bas de page, ce sont deux morceaux de texte à deux endroits. L’appel va là où le numéro doit apparaître. La définition va où vous voulez, et c’est le moteur de rendu qui la déplace en bas.

```markdown
The estimate assumed a fixed exchange rate.[^1]

[^1]: Which it was not, for most of the period in question.
```

L’appel est un accent circonflexe entre crochets. La définition reprend le même jeton, suivi de deux-points, en début de ligne. C’est la forme que documente GitHub, celle que documente Pandoc, celle que documente Python-Markdown, et celle qu’implémente chacun des greffons ci-dessous. Apprenez-la une fois.

**Les identifiants n’ont pas à être des nombres.** `[^longnote]`, `[^exchange-rate]` et `[^a]` sont tous valides, et employer des mots plutôt que des chiffres est en général la meilleure idée, car le numéro que voit le lecteur est engendré à partir de l’ordre des appels, et non de ce que vous avez tapé. Pandoc énonce la contrainte sans détour : un identifiant ne peut contenir ni espace, ni tabulation, ni saut de ligne, ni les caractères `^`, `[` ou `]`. Tout le reste est permis.

**Le numéro que vous voyez n’est pas l’identifiant que vous avez écrit.** Cela surprend ceux qui étiquettent leurs notes `[^7]` et `[^2]` et s’attendent à lire 7 et 2 en sortie. Les moteurs de rendu numérotent les notes dans l’ordre d’apparition des appels dans le texte, puis renumérotent la liste du bas pour qu’elle corresponde. Étiquetez-les `[^price]` et `[^source]` et la confusion disparaît, parce que vous cessez d’attendre que vos étiquettes survivent.

**Les définitions peuvent vivre n’importe où dans le fichier.** La documentation de GitHub est explicite : le contenu de la note apparaît au bas du document rendu, quel que soit l’endroit de la source où se trouve la définition. La plupart des implémentations se comportent de même. Placer chaque définition juste après le paragraphe qui l’appelle garde la source lisible ; les rassembler toutes à la fin garde la prose propre. Les deux rendent à l’identique.

**Une note peut contenir plusieurs paragraphes, si vous les indentez.** C’est là que les syntaxes divergent légèrement, et c’est de là que viennent la plupart des notes malformées. La règle de Pandoc est que les blocs suivants sont indentés pour montrer qu’ils appartiennent à la note, et que vous pouvez indenter le paragraphe entier ou seulement sa première ligne. Python-Markdown demande quatre espaces ou une tabulation sur les lignes de continuation. Indenter de quatre espaces satisfait les deux.

```markdown
[^longnote]: Here is the first paragraph of the note.

    And here is a second, indented by four spaces so it stays
    attached to the footnote rather than ending it.

        A code block, indented eight, still inside the note.

    - A list item, also inside the note.
```

Cet exemple mérite d’être tapé dans ce qui rend vos documents, car le mode de défaillance est instructif : un paragraphe de continuation qui a perdu son indentation ne produit pas d’erreur. Il produit une note à un seul paragraphe et un paragraphe de prose égaré posé juste sous la ligne de définition, que le moteur de rendu place alors dans le corps du document à l’endroit où la définition se trouvait. Vous obtenez une phrase sur les taux de change au milieu de la section quatre.

**Les sauts de ligne à l’intérieur d’une note suivent les règles habituelles.** La documentation de GitHub note qu’ajouter deux espaces en fin de ligne coupe la ligne à l’intérieur d’une note, exactement comme partout ailleurs. Les règles dans une note sont celles qui valent en dehors.

**Une définition que personne n’appelle n’est pas non plus une erreur.** Supprimez la phrase contenant `[^3]` et laissez `[^3]: …` en bas : les implémentations divergent. Certaines écartent la définition orpheline, certaines la rendent comme une note vers laquelle aucun appel ne pointe, et certaines impriment la ligne de définition en texte littéral parce qu’elle ne fait plus partie d’un groupe de notes. Aucune ne vous prévient. C’est de loin la cause la plus fréquente d’une note « disparue » — l’appel a été effacé en même temps que la phrase qui l’entourait.

## Comparatif rapide : qui rend une note et qui l’imprime

| Outil ou spécification | Notes | Comment les obtenir | `^[…]` en ligne | Licence |
| --- | --- | --- | --- | --- |
| Spécification CommonMark | Non | Indisponible ; les crochets s’affichent en texte | Non | Gratuit, spécification |
| Spécification GFM | Non | Absentes de la spécification, malgré le site | Non | Gratuit, spécification |
| Le moteur de rendu de GitHub | Oui | Actif par défaut, sauf dans les wikis | Non | Hébergé |
| commonmark.js | Non | Implémentation de référence ; syntaxe du cœur seulement | Non | Gratuit, BSD |
| markdown-it | Greffon | `markdown-it-footnote` | Oui | Gratuit, MIT |
| marked | Non | Une extension tierce, ou rien | Non | Gratuit, MIT |
| remark / unified | Greffon | `remark-gfm`, aux côtés des tableaux et des listes de tâches | Non | Gratuit, MIT |
| Python-Markdown | Extension | L’extension officielle `footnotes` | Non | Gratuit, BSD |
| Goldmark | Extension | `extension.Footnote` | Non | Gratuit, MIT |
| Hugo | Oui | L’extension de notes de Goldmark, activée par défaut | Non | Gratuit, Apache 2.0 |
| Pandoc | Oui | L’extension `footnotes`, active dans son propre dialecte | Oui, `inline_notes` | Gratuit, GPL |

Deux lignes de ce tableau méritent d’être soulignées, car ce sont elles qui piègent. La spécification GFM ne contient pas les notes de bas de page ; le mot y apparaît une seule fois, à titre historique, pour décrire ce que d’autres implémentations ont ajouté à la syntaxe d’origine. Et le site de GitHub les rend malgré tout. Un analyseur qui annonce une conformité GFM complète et ignore `[^1]` n’est ni cassé ni menteur — [l’écart entre la spécification et le site](/blog/commonmark-gfm-and-the-flavours) porte exactement sur ce genre de fonctionnalité.

## Le HTML que devient une note

Toutes les implémentations produisent les trois mêmes éléments structurels, sous des noms différents. Connaître la forme vous dit quoi styler, contre quoi assainir, et ce qui a mal tourné quand un lien de note atterrit au mauvais endroit.

L’appel devient un exposant contenant un lien, et le lien porte un identifiant propre afin que quelque chose puisse pointer vers lui en retour. markdown-it-footnote produit ceci :

```html
<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup>
```

Les définitions deviennent un conteneur en fin de document, abritant une liste ordonnée, un élément par note, chacun portant l’identifiant vers lequel pointe l’appel :

```html
<hr class="footnotes-sep">
<section class="footnotes">
  <ol class="footnotes-list">
    <li id="fn1" class="footnote-item">
      <p>Which it was not, for most of the period in question.
        <a href="#fnref1" class="footnote-backref">&#8617;</a></p>
    </li>
  </ol>
</section>
```

Et la troisième chose est cette dernière ancre : le lien de retour. C’est la partie que la plupart des dispositifs de notes bricolés à la main oublient, et celle qui rend les notes utilisables plutôt que décoratives. Sans lui, un lecteur qui clique sur la note 4 d’un long document n’a aucun moyen de revenir à la phrase qu’il lisait, sinon le bouton « précédent » du navigateur — qui fonctionne, jusqu’à ce que la page ait été atteinte par défilement plutôt que par un lien, auquel cas ce bouton quitte le document entièrement.

Les implémentations exposent le lien de retour sous forme de chaîne configurable, ce qui indique assez bien l’importance qu’elles y attachent. La configuration Goldmark de Hugo possède un réglage `backlinkHTML` pour le balisage affiché en fin de note, dont la valeur par défaut est une entité de flèche de retour. Python-Markdown a `BACKLINK_TEXT`, valant `&#8617;` par défaut, et `BACKLINK_TITLE`, valant `Jump back to footnote {} in the text` — un attribut `title` existe précisément parce qu’une flèche seule ne dit rien à un lecteur d’écran. markdown-it-footnote n’emploie pas d’options pour cela ; vous redéfinissez ses règles de rendu, ce qui est la même capacité avec davantage de frappe.

La paire d’identifiants est le mécanisme, et c’est aussi la partie fragile. `#fnref1` et `#fn1` valent pour la page entière. Deux documents rendus sur une même page, ou un même document rendu deux fois, et le second jeu d’appels pointe vers le premier jeu de notes. Toute implémentation sérieuse possède un bouton pour cela, dont il sera question plus bas, et toute implémentation le livre en position éteinte.

## Implémentation par implémentation

### markdown-it — un greffon, et les classes viennent avec

markdown-it ne rend pas les notes tout seul. Le greffon officiel, `markdown-it-footnote`, est sous licence MIT et s’installe depuis npm en une dépendance :

```bash
npm install markdown-it-footnote
```

```javascript
const md = require('markdown-it')().use(require('markdown-it-footnote'));
md.render(source);
```

**Ce que vous obtenez :** le HTML montré plus haut, avec les noms de classes `footnote-ref`, `footnotes-sep`, `footnotes`, `footnotes-list`, `footnote-item` et `footnote-backref`, contre lesquels il vous faudra écrire du CSS, car rien ne les style. Il accepte également les notes en ligne, traitées dans leur propre section plus bas, ce que peu d’implémentations font.

**Pour qui ?** Pour quiconque est déjà sur markdown-it, ce qui recouvre bon nombre d’applications et d’installations de sites statiques. Si vous choisissez un analyseur JavaScript et que les notes sont une exigence, c’est le chemin le plus court — [le comparatif plus large des analyseurs JavaScript](/blog/markdown-to-html-in-javascript) couvre le reste de la décision, mais sur cette fonctionnalité précise markdown-it l’emporte rien qu’en ayant un greffon officiel.

### remark et unified — les notes arrivent avec remark-gfm

remark traite les notes comme faisant partie de GitHub Flavored Markdown, ce qui est une lecture défendable de ce que GitHub rend effectivement, même si ce n’est pas ce que dit la spécification GFM. `remark-gfm` ajoute cinq choses d’un coup : les liens automatiques littéraux, les notes, le texte barré, les tableaux et les listes de tâches. Il est sous licence MIT.

**Ce que vous obtenez :** des nœuds de notes dans l’arbre mdast, ce qui veut dire que vous pouvez agir dessus avant qu’ils ne deviennent du HTML — les compter, les déplacer, vérifier que chaque appel se résout, les extraire dans un document séparé. C’est tout l’intérêt de remark, et les notes font partie des rares constructions où disposer de l’arbre vaut le poids de la chaîne de traitement.

**Pour qui ?** Pour les projets qui font déjà tourner unified, et pour quiconque a besoin de valider les notes plutôt que simplement de les rendre. Une chaîne qui fait échouer la construction quand un appel n’a pas de définition tient en une quinzaine de lignes avec remark et reste impossible avec tout le reste de cette liste.

### marked — GFM, moins les notes

marked implémente CommonMark et GFM, et s’arrête là. Ses options documentées sont `async`, `breaks`, `gfm`, `pedantic`, `renderer`, `silent`, `tokenizer` et `walkTokens` ; il n’y a pas d’option de note, parce que les notes ne figurent dans aucune des deux spécifications qu’il vise. Tout ce qui dépasse cette surface passe par son mécanisme d’extensions, et un paquet tiers `marked-footnote` existe précisément pour cela.

**Ce qui se passe sans lui :** l’appel s’affiche en texte littéral `[^1]` à l’intérieur de votre paragraphe, et la ligne de définition s’affiche en paragraphe de texte littéral disant `[^1]: Which it was not…`. Aucun avertissement, aucune erreur, aucun message de fonctionnalité manquante. Deux lignes de texte là où vous attendiez une note.

**Pour qui ?** Pour les applications qui ont besoin de vitesse et pas de notes — zones de commentaires, messages de discussion, volets d’aperçu. C’est un bon analyseur au périmètre étroit et honnête. Le périmètre est le problème ici : les convertisseurs bâtis sur marked héritent du manque, et ils sont nombreux, y compris celui qui assure la conversion Markdown vers HTML de ce site. Bon à savoir avant de coller un document à notes dans un convertisseur de navigateur et d’en croire le résultat.

### Python-Markdown — une extension officielle, avec des options

Python-Markdown livre les notes comme l’une de ses extensions standard, sous licence BSD, activée par son nom :

```python
import markdown
html = markdown.markdown(source, extensions=['footnotes'])
```

**Ce que vous obtenez :** des appels en exposant, un bloc de notes, des liens de retour, et davantage de configuration que partout ailleurs. `PLACE_MARKER` (par défaut `///Footnotes Go Here///`) vous laisse décider à quel endroit du document les notes atterrissent, plutôt que d’accepter le bas de page. `BACKLINK_TEXT` et `BACKLINK_TITLE` pilotent le lien de retour. `SEPARATOR`, valant `:` par défaut, fixe la chaîne placée entre le préfixe et le nom dans les identifiants qu’il engendre, ce qui explique que ses identifiants de notes ne ressemblent à ceux de personne d’autre. `UNIQUE_IDS`, valant `False` par défaut, évite les collisions entre plusieurs appels à `reset()` — le remède au rendu de plusieurs documents dans une même page. `USE_DEFINITION_ORDER` décide si la liste du bas suit l’ordre des définitions ou celui des appels.

**Pour qui ?** Pour les scripts de construction en Python, et pour les sites MkDocs, où c’est déjà le moteur en place. L’extension est en mode maintenance selon sa propre documentation, ce qui, pour une fonctionnalité aussi stable, relève de la description plutôt que de l’avertissement. Si c’est en Python que se passe votre conversion, [les options Python au complet](/blog/markdown-to-html-in-python) disent par quel analyseur commencer.

### Goldmark et Hugo — éteint par défaut chez l’un, allumé chez l’autre

Goldmark est l’analyseur CommonMark qu’emploient la plupart des programmes Go, sous licence MIT, et il livre une extension de notes que sa propre documentation décrit comme la syntaxe de PHP Markdown Extra. Vous l’activez explicitement, sous le nom `extension.Footnote`, au moment de construire l’analyseur.

Hugo, qui s’appuie sur Goldmark, l’active pour vous. Sa configuration de balisage comporte une section de notes avec `enable` valant `true` par défaut, une chaîne `backlinkHTML`, et `enableAutoIDPrefix` valant `false`. Cette dernière option est le remède aux collisions d’identifiants, et sa valeur par défaut explique que deux pages Hugo rendues dans une même page de liste puissent avoir des liens de notes qui pointent vers les notes l’une de l’autre.

**Pour qui ?** Pour les programmes Go, et pour tous les sites Hugo, dont les auteurs ignorent le plus souvent que les notes sont une extension, parce qu’ils ne les ont jamais vues échouer.

### CommonMark et commonmark.js — les crochets, exactement tels que tapés

CommonMark s’arrête à un cœur que tout le monde avait déjà en commun, et les notes n’en ont jamais fait partie. commonmark.js, l’implémentation de référence écrite par les auteurs de la spécification, ne prend pas les notes en charge et n’offre aucun point d’extension pour en ajouter, à dessein. Il est sous licence BSD.

**Ce qui se passe :** `[^1]` est un paragraphe contenant un accent circonflexe entre crochets. La spécification le dit, l’implémentation de référence le fait, et toute discussion sur la correction de ce comportement se tranche en lisant la spécification.

**Pour qui ?** Pour trancher précisément cette discussion. Quand une différence de rendu vous laisse à vous demander si un outil est bogué ou simplement strict, c’est cet analyseur-là qui vous le dit.

### Pandoc — la prise en charge la plus large, et le seul réglage de placement

Le dialecte Markdown propre à Pandoc a l’extension `footnotes` active, et c’est l’implémentation la plus complète de la syntaxe qui soit disponible. Les notes à plusieurs blocs, les identifiants en toutes lettres, les notes en ligne et la contrainte sur les caractères d’identifiant y sont documentés plutôt que découverts.

**Ce que vous obtenez au-delà de la syntaxe :** deux réglages que rien d’autre dans cette liste ne possède. `--reference-location` décide si les notes vont à la fin du bloc de premier niveau en cours, à la fin de la section en cours, ou à la fin du document — l’option agit sur les générateurs html, epub, markdown, muse et plusieurs générateurs de diapositives. Et `--id-prefix` ajoute un préfixe à chaque identifiant et à chaque lien interne de la sortie HTML, ce qui est la réponse documentée aux identifiants en double lorsque vous produisez des fragments destinés à être inclus dans d’autres pages. Si vous assemblez une page à partir de plusieurs documents convertis, ce réglage fait la différence entre des liens qui fonctionnent et des liens qui pointent tous vers les notes du premier document.

**Pour qui ?** Pour des documents plutôt que pour des pages — tout ce qui comporte des notes, des citations ou un format de sortie autre que HTML. C’est aussi l’outil vers lequel se tourner quand un fichier Markdown à notes doit devenir un fichier Word ou un PDF, car les notes sont une construction native dans ces deux formats et Pandoc sait comment les y transposer. Pandoc est gratuit et sous licence GPL, et l’installation est le seul véritable argument contre lui pour les petits travaux.

### GitHub — la raison pour laquelle on écrit des notes

GitHub rend la syntaxe des notes dans les fichiers Markdown, les tickets, les demandes de fusion et les discussions, en numérotant les appels dans l’ordre et en rassemblant les notes au bas du document rendu. Sa documentation énonce une exception sans détour : les notes ne sont pas prises en charge dans les wikis. Écrivez une note dans une page de wiki et vous obtenez les crochets.

**Pourquoi cette ligne compte plus que les autres :** GitHub est l’endroit où la plupart des gens voient une note se rendre pour la première fois, et son comportement est ce qu’ils supposent être celui de Markdown. Rien sur le site ne vous dit qu’il s’agit de l’extension d’un moteur de rendu plutôt que d’une partie du langage. Il en résulte un flux régulier de fichiers qui fonctionnent au seul endroit où ils ont été écrits et nulle part ailleurs.

## Les notes en ligne : le `^[…]` de Pandoc

Pandoc ajoute une seconde syntaxe qui évite entièrement le problème des deux endroits. C’est une extension distincte, `inline_notes`, et la note prend la place qu’aurait occupée l’appel :

```markdown
Here is an inline note.^[Inline notes are easier to write, since you
don't have to pick an identifier and move down to type the note.]
```

Le manuel indique que notes en ligne et notes ordinaires peuvent être mêlées librement dans un même document, et qu’une note en ligne ne peut pas contenir plusieurs paragraphes — voilà l’arbitrage. Vous renoncez aux notes longues et gagnez de ne plus avoir à inventer un identifiant ni à descendre au bas du fichier. Pour une note d’une phrase, c’est une bonne affaire.

Comme il s’agit d’une extension nommée, vous pouvez l’activer et la désactiver explicitement : `--from markdown+inline_notes` ou `--from markdown-inline_notes`. Cela compte si vous consommez des fichiers venus d’ailleurs et voulez un dialecte prévisible plutôt que ce qu’il plaît aux valeurs par défaut de Pandoc.

`markdown-it-footnote` implémente la même syntaxe, ce qui en fait la seule voie JavaScript qui accepte les deux formes. Rien d’autre dans cette liste ne le fait. GitHub non plus : `^[une note]` sur GitHub donne un accent circonflexe suivi de ce qui ressemble à un lien cassé, échec particulièrement peu secourable puisqu’il ne ressemble même pas à de la syntaxe de note pour qui lit la source.

La règle pratique est que les notes en ligne conviennent aux documents dont vous maîtrisez toute la chaîne. Dès l’instant où le fichier risque d’être lu par GitHub, ou par un analyseur que vous n’avez pas vérifié, la forme à crochets est la plus sûre des deux, et l’inconvénient des deux endroits est le prix de la portabilité.

## Là où les notes échouent, et ce que cela coûte

La réponse évidente — écrivez des notes, cela marche très bien — échoue de cinq façons précises, et toutes les cinq sont silencieuses.

**Le littéral silencieux.** Un analyseur dépourvu de l’extension rend votre appel et votre définition en texte. Il n’y a ni avertissement en console ni indice visuel, hormis les crochets eux-mêmes, que les lecteurs survolent en les prenant pour une coquille. Le coût, c’est un document publié contenant `[^1]`, découvert par quelqu’un d’autre, en général après l’envoi à des gens. C’est l’échec qu’il faut anticiper, car c’est le seul que vous ne pouvez pas voir dans un aperçu qui emploie le même analyseur que l’export.

**Les collisions d’identifiants.** Les identifiants de notes sont `fn1`, `fnref1` et consorts, engendrés par document et uniques à l’intérieur de celui-ci. Mettez deux documents rendus sur une même page — un index de blog affichant les billets entiers, une page de documentation assemblant plusieurs fragments, une vue d’impression d’une section entière — et le `#fn1` du second document se résout sur la note du premier. Les liens fonctionnent. Ils vont au mauvais endroit. Hugo livre `enableAutoIDPrefix` éteint, Python-Markdown livre `UNIQUE_IDS` éteint, et le `--id-prefix` de Pandoc est quelque chose qu’il faut passer : la valeur par défaut est donc à chaque fois la mauvaise. Le coût, c’est une page où tous les liens de notes situés après le premier document sont faux, et aucun journal de construction n’en souffle mot.

**L’assainisseur avale le bloc.** La sortie des notes emploie des balises qu’une liste blanche taillée pour Markdown n’inclut souvent pas. `<section>` est la victime habituelle : un assainisseur bâti pour autoriser exactement ce que produit un moteur GFM a sur sa liste les titres, les paragraphes, les listes, les tableaux, `<sup>` et `<a>`, et pas `<section>`, car le GFM nu n’en produit jamais. Passez-y du HTML de notes et les appels survivent en liens exposants tandis que tout le bloc de notes s’évapore, laissant un document plein de numéros pointant vers rien. Le coût est pire que de perdre les notes, car la page a toujours l’air terminée. Si vous assainissez une sortie convertie — et pour tout ce que vous n’avez pas écrit vous-même, [vous devriez](/blog/sanitising-markdown-safely) —, ajoutez le conteneur de notes à la liste blanche en même temps que vous ajoutez l’extension à l’analyseur, et testez avec un fichier à notes.

**Les allers-retours les perdent.** Un fichier Markdown à notes converti en HTML puis reconverti, ou converti en Word puis reconverti, peut ressortir avec les notes sous forme de paragraphes ordinaires à la fin et les appels sous forme de simples numéros en exposant. Pandoc transpose les notes vers des constructions natives dans les formats qui en ont, et c’est pourquoi il est le bon outil pour ce trajet. Un convertisseur HTML vers Markdown générique n’a aucun moyen de reconnaître qu’une `<section class="footnotes">` a un jour été de la syntaxe de note : il produit donc fidèlement une liste de paragraphes. Le coût, c’est un fichier qui s’affiche correctement et qu’on ne pourra plus jamais éditer comme un fichier à notes.

**Les surprises d’ordre.** Le numéro que voit le lecteur vient de l’ordre des appels, et la liste du bas est ordonnée soit par ordre des appels, soit par ordre des définitions selon l’implémentation — Python-Markdown en fait une option, `USE_DEFINITION_ORDER`, ce qui vous dit que les deux comportements existent bel et bien dans la nature. Déplacez un paragraphe et les numéros se réattribuent, ce qui est correct et signifie aussi qu’une note désignée dans la prose par « voir la note 4 » est une dette d’entretien. Le coût est faible et constant : ne renvoyez jamais à une note par son numéro dans le texte.

Il y a un coût de plus, et c’est la raison d’y réfléchir avant d’écrire cent notes plutôt qu’après. Un document à notes n’est plus du Markdown portable. Il dépend de la liste d’extensions d’un outil précis, et chaque étape ajoutée à sa chaîne est une étape qui pourrait ne pas avoir cette extension. Les tableaux ont la même propriété et reçoivent plus d’attention, parce qu’[un tableau cassé fait du bruit](/blog/markdown-tables-that-survive-conversion) — une rangée de barres verticales est visiblement fausse. Une note cassée est silencieuse, ce qui la rend plus dangereuse.

## Faire survivre une note à un convertisseur qui les ignore

Il arrive que la chaîne soit figée et que l’analyseur qui s’y trouve ne gère pas les notes. Il y a quatre issues, par ordre de coût croissant.

**Écrire l’incise dans la phrase.** L’option honnête, et celle qu’il vaut la peine d’essayer d’abord. La plupart des notes, dans la plupart des documents, sont une parenthèse devenue ambitieuse. Si la note tient en une proposition, mettez-la dans la phrase, entre parenthèses, et supprimez le mécanisme. Cela s’affiche dans tous les analyseurs jamais écrits, cela survit à toutes les conversions, et le lecteur n’a pas à quitter le paragraphe. Le coût est une phrase un peu plus longue, ce qui n’en est en général pas un.

**Construire l’appel et l’ancre à la main.** Une note de bas de page, ce sont deux liens et une liste ordonnée. Vous pouvez les écrire, et le résultat fonctionne dans un analyseur CommonMark nu, car il n’emploie que des liens et du HTML brut :

```markdown
The estimate assumed a fixed exchange rate.<sup id="ref-1"><a href="#note-1">1</a></sup>

## Notes

1. <a id="note-1"></a>Which it was not, for most of the period in question.
   <a href="#ref-1">Back</a>
```

C’est un vrai comportement de note : un numéro en exposant, un saut vers la note, un saut de retour. Cela vous coûte la numérotation manuelle, donc une renumérotation à la main quand vous insérez une note au milieu, et cela dépend de la survie du HTML brut. Deux réserves à connaître avant de vous y engager. D’abord, un analyseur réglé pour échapper le HTML brut — la valeur par défaut de markdown-it est `html: false` — imprimera vos balises `<sup>` en texte, ce qui est un autre échec au même endroit. Ensuite, un assainisseur doit autoriser à la fois les balises et les attributs `id` et `href`, faute de quoi les ancres disparaissent et les liens pendent. Testez-le dans la vraie chaîne, avec le vrai assainisseur, sur une seule note, avant d’en écrire quarante.

**Employer une fois l’outil qui a l’extension.** Si la chaîne est figée mais que vous en maîtrisez une étape, convertissez avec un analyseur qui comprend les notes et remettez à l’étape suivante le HTML plutôt que le Markdown. Pandoc lisant du `markdown` et écrivant du HTML, ou un petit script Node avec markdown-it et son greffon de notes, c’est cinq minutes de travail qui suppriment le problème définitivement. Le coût, c’est que le HTML devient l’artefact que vous entretenez : cela ne vaut donc que lorsque le Markdown est une source que vous convertissez et non un document que des gens continuent d’éditer.

**Sonder avant d’écrire.** Quelle que soit la voie retenue, découvrez ce que fait la chaîne avant d’avoir cent notes dans un document. Mettez ceci dans un fichier et convertissez-le :

```markdown
A reference.[^probe]

An inline note.^[Inline.]

[^probe]: The note, with a second paragraph below.

    Indented four spaces.
```

Quatre réponses pour un seul collage. Un numéro en exposant signifie que l’extension est présente. La note rendue en bas signifie qu’elle a été rassemblée correctement. Un second paragraphe à l’intérieur de la note signifie que la règle d’indentation correspond à ce que vous tapez. Et un `^[Inline.]` visible signifie que les notes en ligne ne sont pas disponibles, ce qui est presque toujours le cas. Consultez ensuite la source HTML et vérifiez que le `href` de l’appel correspond à l’`id` de la note, car c’est cette paire qui rompt en silence quand deux documents partagent une page.

## Comment choisir : les critères avant de s’engager sur des notes

1. **Décidez si la note est une note ou une parenthèse.** Si elle tient en une proposition, mettez-la dans la phrase et sautez tous les problèmes de cet article ; un mécanisme dont vous ne vous servez pas ne peut pas casser dans un convertisseur que vous n’avez pas testé.
2. **Nommez toute la chaîne que le fichier va traverser, puis vérifiez-en le maillon le plus faible.** Éditeur de l’auteur, hébergeur du dépôt, convertisseur, assainisseur, plateforme de publication — les notes ont besoin de l’extension à chaque étape qui analyse du Markdown, et une seule étape qui ne l’a pas transforme vos notes en crochets dans la page publiée.
3. **Employez des identifiants en toutes lettres, pas des nombres.** `[^exchange-rate]` survit à une insertion, à une suppression et à une réorganisation, alors qu’un document étiqueté de `[^1]` à `[^12]` finira par être renuméroté à la main par quelqu’un qui ignorait que le moteur de rendu le fait de toute façon.
4. **Activez l’option de préfixe d’identifiant si plusieurs documents peuvent partager une page.** L’`enableAutoIDPrefix` de Hugo, l’`UNIQUE_IDS` de Python-Markdown et le `--id-prefix` de Pandoc sont tous livrés inactifs : une page de liste ou un fragment assemblé aura donc des liens de notes qui aboutissent à la mauvaise note, et aucune étape de construction ne vous le dira.
5. **Ajoutez le conteneur de notes à la liste blanche de votre assainisseur en même temps que l’extension.** Une liste bâtie pour une sortie GFM ne contient pas de `<section>`, et le résultat est une page où tous les appels survivent et où toutes les notes ont disparu, ce qui a l’air terminé et ne l’est pas.
6. **Réservez les notes en ligne aux chaînes qui vous appartiennent entièrement.** `^[…]` est une vraie commodité dans Pandoc et markdown-it, et il échoue sur GitHub d’une façon qui ne ressemble même pas à une note : un fichier susceptible d’y être lu devrait donc employer la forme à crochets.
7. **Convertissez un fichier à notes et lisez le bas de la sortie.** Pas le haut, et pas l’aperçu : le HTML rendu, dans un navigateur, avec un clic sur un appel et un clic sur le lien de retour. Dix secondes là suffisent à attraper les crochets littéraux, le bloc manquant et le lien qui vise à côté, les trois seules choses qui tournent mal.

## Conclusion

Les notes de bas de page sont une convention largement implémentée sans spécification derrière elle, et tout ce qu’elles ont d’inconfortable découle de ce seul fait. La syntaxe est assez stable pour s’apprendre une fois — `[^nom]` dans le texte, `[^nom]:` en bas, quatre espaces pour poursuivre une note — et la question qui décide si cela fonctionne ne porte jamais sur la syntaxe. Elle porte sur le fait que l’outil précis placé devant votre fichier ait l’extension, et que l’outil suivant l’ait aussi. Vérifiez le maillon le plus faible de la chaîne, gardez des identifiants en toutes lettres, activez le préfixe d’identifiant si deux documents doivent un jour partager une page, et ajoutez le conteneur de notes à l’assainisseur en même temps que le greffon à l’analyseur. Si vous voulez voir ce qu’une construction donnée est devenue au lieu de le supposer, [convertir le fichier en HTML](/) avec la source visible à côté de l’aperçu répond immédiatement : un `<sup>` et un `id` correspondant signifient que la note est réelle, et un paragraphe contenant `[^1]` signifie que vous avez trouvé le maillon faible.

## FAQ

### Les notes de bas de page font-elles partie de Markdown ?

Non. Elles ne figurent ni dans la spécification CommonMark ni dans celle de GitHub Flavored Markdown, et la syntaxe Markdown d’origine ne les a jamais eues. La syntaxe qu’emploie tout le monde vient de PHP Markdown Extra et s’est répandue comme extension, ce qui explique que la prise en charge varie selon l’outil plutôt que selon la version.

### Pourquoi ma note s’affiche-t-elle en `[^1]` dans la sortie ?

Parce que l’analyseur qui a converti votre fichier n’implémente pas les notes. Il a rendu les crochets fidèlement, comme sa spécification l’exige. Ajoutez l’extension ou le greffon de notes à cet analyseur, ou changez-en — et vérifiez chaque étape de la chaîne, car l’échec vient du maillon le plus faible, pas du premier.

### Les notes fonctionnent-elles sur GitHub ?

Oui, dans les fichiers Markdown, les tickets, les demandes de fusion et les discussions. La documentation de GitHub signale une exception : les notes ne sont pas prises en charge dans les wikis. Gardez à l’esprit que le fait que GitHub les rende n’équivaut pas à leur présence dans la spécification GFM : un analyseur qui revendique la conformité GFM et ignore vos notes se comporte correctement.

### Une note peut-elle contenir une liste ou un bloc de code ?

Oui, si vous l’indentez. Quatre espaces sur les lignes de continuation gardent un paragraphe, une liste ou un bloc de code indenté rattachés à la note, aussi bien dans Pandoc que dans Python-Markdown. Perdez l’indentation et le bloc devient du texte courant ordinaire, à l’endroit du document où se trouvait la définition.

### Comment convertir en HTML un fichier Markdown comportant des notes ?

Employez un analyseur dont l’extension est activée : Pandoc, qui l’a active dans son propre dialecte, ou markdown-it avec `markdown-it-footnote`, ou Python-Markdown avec `extensions=['footnotes']`, ou remark avec `remark-gfm`. Ouvrez ensuite le résultat et cliquez sur un appel et sur un lien de retour, car la présence de l’extension ne garantit pas la correspondance des identifiants dès lors que la page contient autre chose.

### Pourquoi mes liens de notes sautent-ils vers la mauvaise note ?

Parce que les identifiants entrent en collision. Les identifiants de notes sont engendrés par document et ne sont uniques qu’à l’intérieur de celui-ci : deux documents rendus sur la même page contiennent donc tous les deux `fn1`, et le navigateur va au premier. Activez l’option de préfixe d’identifiant de votre outil — `enableAutoIDPrefix` dans Hugo, `UNIQUE_IDS` dans Python-Markdown, `--id-prefix` dans Pandoc —, toutes inactives par défaut.

### Quelle est ici la différence entre une note de bas de page et une note de fin ?

En Markdown, aucune au niveau de la syntaxe : vous écrivez le même `[^1]` dans les deux cas et c’est le moteur de rendu qui décide où atterrissent les notes. Pandoc est le seul outil à rendre le placement explicite, avec `--reference-location` qui choisit la fin du bloc, la fin de la section ou la fin du document. Le `PLACE_MARKER` de Python-Markdown fait quelque chose de comparable en vous laissant placer le bloc où vous le voulez.
