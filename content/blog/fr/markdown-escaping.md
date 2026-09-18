---
title: "Échapper les caractères en Markdown : la référence complète"
description: "Ce qu’une barre oblique inverse échappe, où l’échappement ne sert à rien, quand une référence de caractère vaut mieux, et les cas qui réécrivent votre texte"
updated: 2026-09-14
date: 2026-09-06
tag: Syntaxe
keywords: échapper caractères markdown, barre oblique inverse markdown, échapper astérisque markdown, tiret bas markdown italique, échapper barre verticale tableau markdown, références de caractères markdown, caractères spéciaux markdown, markdown snake_case souligné, échapper backtick markdown, caractère échappement markdown
---

Un astérisque que vous vouliez littéral met la moitié d’une phrase en italique. Une année en début de ligne devient l’élément 1 986 d’une liste. Un chemin Windows perd l’une de ses barres obliques inverses en route vers la page, et personne ne s’en aperçoit avant que quelqu’un ne le colle dans un terminal. Chacun de ces cas est un caractère qui fait le travail que sa documentation lui prescrit, à un endroit auquel vous ne pensiez pas.

### En bref

Une barre oblique inverse échappe n’importe lequel des **trente-deux signes de ponctuation ASCII**, et rien d’autre — devant une lettre, un chiffre, une espace ou un caractère non ASCII, c’est une simple barre oblique inverse, imprimée telle quelle. L’échappement **ne fait absolument rien** à l’intérieur d’un segment de code, d’un bloc de code clôturé ou indenté, d’un lien automatique ou de HTML brut, et c’est la règle à laquelle presque tout problème d’échappement finit par se ramener. Les **références de caractères** (`&amp;`, `&lt;`, `&#42;`, `&copy;`) constituent l’autre voie, et la seule qui fonctionne là où une barre oblique inverse est inerte ou là où le caractère n’est pas de la ponctuation ASCII. La plupart des caractères ne demandent un échappement que dans une seule position — un dièse en début de ligne, une barre verticale dans une cellule de tableau — et un segment de code est la réponse portable à tout cela, au prix d’un texte à chasse fixe.

Les règles viennent d’un seul endroit. CommonMark est la spécification qui les fixe, et la version 0.31.2, datée du 28 janvier 2024, est la version en vigueur (vérifié sur spec.commonmark.org, le 9 septembre 2026). Elle énonce deux phrases sur les barres obliques inverses qui, à elles deux, tranchent tous les cas de cette page : tout signe de ponctuation ASCII peut être échappé par une barre oblique inverse, et une barre oblique inverse devant un autre caractère est traitée comme une barre oblique inverse littérale.

Ce qu’une spécification ne peut pas régler, c’est que l’échappement échoue dans les deux sens et qu’aucun des deux échecs ne se signale. Trop peu d’échappements, et le caractère est interprété : votre prose gagne de l’emphase, un titre, une liste, un lien. Trop d’échappements, et la barre oblique inverse disparaît quand même de la sortie — `\:` s’affiche en simple deux-points — si bien que le fichier se remplit de barres obliques inverses qui ne font rien, et que la personne suivante à l’éditer ne peut plus dire lesquelles comptent. Les deux ont l’air correctes dans un volet d’aperçu qui partage l’avis de votre analyseur, et fausses partout ailleurs.

Il existe une version plus courte de cette matière dans [le texte consacré aux sauts de ligne et aux listes](/blog/markdown-line-breaks-and-lists), qui traite des caractères entrant en collision avec les marqueurs de liste et des deux façons de couper une ligne. Cette page-ci est le reste : l’ensemble échappable au complet, les quatre contextes où une barre oblique inverse est morte, les références de caractères, ce qu’un convertisseur échappe à votre place, et la poignée de cas réels — syntaxe de gabarit, chemins Windows, signes dollar, `snake_case` — qui produisent la quasi-totalité des plaintes.

## Ce que fait un échappement par barre oblique inverse, et les trente-deux caractères sur lesquels il agit

Une barre oblique inverse placée devant un signe de ponctuation ASCII retire à ce caractère sa signification et se retire elle-même de la sortie. L’ensemble échappable est fixe, et le voici, ces trente-deux caractères : ``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`` (vérifié sur spec.commonmark.org, le 9 septembre 2026). C’est-à-dire tout caractère ASCII imprimable qui n’est ni une lettre, ni un chiffre, ni une espace.

Tout le reste donne une barre oblique inverse littérale. `\q` s’affiche `\q`, barre comprise. Il en va de même pour `\3`, et de même pour une barre oblique inverse placée devant un tiret cadratin ou un guillemet typographique, car ce sont des signes de ponctuation, mais pas de la ponctuation ASCII. C’est la moitié de la règle que les gens oublient, et la raison pour laquelle un chemin Windows survit le plus souvent intact avant de perdre exactement un séparateur, à un seul endroit.

Deux conséquences à retenir avant le tableau. D’abord, l’échappement se fait caractère par caractère, et non par zone : il n’existe pas en Markdown de marqueur « à partir d’ici, texte littéral », si bien que `\*\*pas en gras\*\*` coûte quatre barres obliques inverses pour un seul effet. Ensuite, un échappement est inerte sans être invisible — il disparaît de la page rendue et reste dans le fichier, ce qui veut dire qu’un Markdown suréchappé se lit comme du bruit pour un humain et se convertit à l’identique pour une machine.

| Caractère | Ce qu’il signifie sans échappement | Où il le signifie | Comment l’écrire littéralement |
| :--- | :--- | :--- | :--- |
| `\` | Le caractère d’échappement lui-même | Partout dans le texte | `\\` |
| `` ` `` | Ouvre un segment de code | Partout en ligne | ``\` ``, ou entourer la suite de davantage de backticks |
| `*` | L’emphase et l’emphase forte ; une puce ; un filet horizontal | Partout en ligne, y compris à l’intérieur d’un mot ; en début de ligne | `\*` |
| `_` | L’emphase et l’emphase forte ; un filet horizontal | Aux frontières de mot seulement ; en début de ligne | `\_` — un tiret bas à l’intérieur d’un mot n’a besoin de rien |
| `#` | Un titre ATX ; une séquence de fermeture de titre | En début de ligne, jusqu’à trois espaces de la marge ; en fin de titre | `\#` |
| `>` | Une citation en bloc | En début de ligne | `\>` |
| `-` | Une puce ; un soulignement setext `<h2>` ; un filet horizontal ; une clôture de front matter | En début de ligne | `\-` |
| `+` | Une puce | En début de ligne | `\+` |
| `=` | Un soulignement setext `<h1>` | Une ligne placée juste sous un paragraphe | `\=` |
| `.` | Un délimiteur de liste ordonnée, après des chiffres | En début de ligne | `1986\.` |
| `)` | Un délimiteur de liste ordonnée, après des chiffres ; la fin d’une cible de lien | En début de ligne ; à l’intérieur de `(…)` | `1986\)`, `\)` |
| `(` | Le début d’une cible de lien | Dans un lien | `\(` |
| `[` `]` | Un lien, une image, une référence ou une étiquette de note ; un marqueur de liste de tâches | Partout en ligne | `\[` `\]` |
| `!` | Une image, lorsqu’un `[` suit | Partout en ligne | `\!` |
| `<` | Un lien automatique, une balise HTML brute ou un bloc HTML | Partout en ligne ; en début de ligne | `\<`, ou `&lt;` |
| `>` | La fin d’un lien automatique ou d’une balise HTML brute | À l’intérieur de `<…>`, où une barre oblique inverse est inerte | `&gt;` en prose ; un encodage pour cent à l’intérieur d’une URL |
| `&` | Le début d’une référence de caractère | Partout en ligne | `&amp;` |
| `\|` | Une frontière de cellule dans un tableau GFM | À l’intérieur d’une ligne de tableau seulement — y compris dans un segment de code | `\|` |
| `~` | Le texte barré en GFM, par paires ; une clôture de code alternative | Partout en ligne ; en début de ligne | `\~` |
| `"` `'` | Rien, sauf si la ponctuation typographique est activée ; délimitent le titre d’un lien | À l’intérieur de `(… "…")` | `\"`, ou `&quot;` |
| `$` | Rien en CommonMark ni en GFM ; un délimiteur mathématique là où cette extension est activée | Seulement avec une extension mathématique | `\$`, ou un segment de code |
| `{` `}` | Rien en CommonMark ; des blocs d’attributs et de la syntaxe de gabarit dans d’autres outils | Seulement dans ces outils | `\{` `\}`, ou un bloc clôturé |
| `:` | Rien en CommonMark ; des définitions de notes et des raccourcis d’émojis ailleurs | Seulement dans ces outils | `\:` |
| `%` `,` `/` `;` `?` `@` `^` | Rien, nulle part, dans aucune variante courante | Nulle part | Échappables, jamais nécessaires |

La quatrième colonne est là où se trouve le travail. Six de ces caractères — `#`, `>`, `-`, `+`, `.` et `)` — ne portent leur signification qu’en début de ligne : un dièse au milieu d’une phrase est donc un dièse, et un tiret entre deux mots un tiret. Les échapper partout est une habitude prise auprès d’outils qui échappent par précaution, et elle vous coûte un fichier plein de barres obliques inverses sans le moindre changement dans la sortie.

## Là où l’échappement ne fait absolument rien

C’est la règle qui produit le plus de confusion, et elle tient en une phrase de la spécification : les échappements par barre oblique inverse ne fonctionnent pas dans les blocs de code, les segments de code, les liens automatiques ni le HTML brut (vérifié sur spec.commonmark.org, le 9 septembre 2026). Dans ces quatre contextes, une barre oblique inverse est du contenu. Elle s’imprime.

L’ordre dans lequel les gens le découvrent est toujours le même. Ils échappent un caractère, le résultat reste faux, alors ils l’entourent en plus de backticks — et voilà la barre oblique inverse sur la page.

```markdown
a `\*` span
```

s’affiche comme le mot « a », puis un segment de code contenant `\*`, puis le mot « span » — la barre oblique inverse visible sur la page, parce qu’à l’intérieur du segment de code elle a perdu son pouvoir et conservé sa largeur. Le remède est de supprimer l’échappement, pas d’en ajouter un autre.

**Les segments et les blocs de code.** Tout ce qui se trouve entre les backticks, ou à l’intérieur d’une clôture, ou indenté de quatre espaces, est du texte littéral. `\\` reste deux barres obliques inverses ; `\_` reste une barre oblique inverse suivie d’un tiret bas. C’est une fonctionnalité, et c’est pourquoi un segment de code est le bon conteneur pour un motif glob, une expression régulière, une chaîne de format `printf` ou un chemin Windows — voyez [ce que les blocs clôturés interprètent et n’interprètent pas par ailleurs](/blog/code-blocks-in-markdown) pour le versant chaîne d’information de la question.

**Les liens automatiques.** Un lien automatique est une URL entre chevrons, et son contenu est une URL, pas du Markdown. Échappez quelque chose à l’intérieur et la barre oblique inverse devient partie intégrante de l’adresse : `<https://example.com/a\_b>` produit un lien dont le `href` contient `%5C`, l’encodage pour cent d’une barre oblique inverse. Le texte du lien a presque l’air correct et la destination est fausse, ce qui est la pire combinaison disponible.

**Le HTML brut.** À l’intérieur d’une balise, une barre oblique inverse est une barre oblique inverse. Essayez d’échapper un guillemet droit dans un attribut — `<div title="a\"b">` — et l’attribut se termine au deuxième guillemet, une barre oblique inverse égarée à l’intérieur, exactement comme dans un navigateur. Les attributs HTML s’échappent avec des références de caractères, `&quot;`, et jamais avec des barres obliques inverses.

**Les blocs HTML.** Un bloc de HTML brut est transmis tel quel, sans analyse en ligne à l’intérieur : rien n’y a donc besoin d’être échappé en premier lieu. Un astérisque dans un bloc HTML est un astérisque. Une barre oblique inverse ajoutée par prudence sera imprimée.

| Contexte | Ce qu’y fait une barre oblique inverse | Ce qu’il faut employer à la place |
| :--- | :--- | :--- |
| Segment de code, `` `…` `` | S’imprime, comme contenu | Rien — le segment protège déjà le texte |
| Bloc clôturé | S’imprime, comme contenu | Rien |
| Bloc indenté, quatre espaces | S’imprime, comme contenu | Rien |
| Lien automatique, `<…>` | Devient une partie de l’URL, encodée pour cent | Encoder correctement le caractère pour cent |
| Balise ou attribut HTML brut | S’imprime, et casse l’attribut | Une référence de caractère : `&quot;`, `&amp;` |
| Bloc HTML | S’imprime | Rien — la syntaxe en ligne n’y est pas analysée |
| Cible de lien, `(…)` | Fonctionne : `\(` et `\)` sont honorés | Une barre oblique inverse, ou l’encodage pour cent |
| Titre de lien, `"…"` | Fonctionne : `\"` est honoré | Une barre oblique inverse |
| La chaîne d’information d’une clôture | Fonctionne | Une barre oblique inverse |

Les trois dernières lignes sont l’image inversée des six premières, et elles surprennent dans l’autre sens : les échappements fonctionnent bel et bien dans les cibles de liens, les titres de liens et les chaînes d’information. Une parenthèse à l’intérieur d’une URL peut être échappée plutôt qu’encodée pour cent, et un titre contenant un guillemet droit a le droit d’en porter un.

Il existe exactement une exception documentée à la règle du segment de code, et elle appartient à GitHub Flavored Markdown plutôt qu’à CommonMark. L’extension des tableaux indique qu’une barre verticale s’inclut dans le contenu d’une cellule en l’échappant, y compris à l’intérieur d’autres segments en ligne (vérifié sur github.github.com, le 9 septembre 2026, version de spécification 0.29-gfm datée du 6 avril 2019). La raison est mécanique : l’analyseur de tableaux découpe une ligne sur les barres verticales avant toute analyse en ligne, `\|` doit donc être traité à cette étape antérieure — et il fonctionne par conséquent au seul endroit que les échappements ne peuvent autrement pas atteindre. Écrivez `` `x \| y` `` dans une cellule et vous obtenez un segment de code contenant `x | y`. Écrivez `` `x | y` `` et vous obtenez deux cellules.

## Les références de caractères, et le moment où elles valent mieux

La seconde façon d’écrire un caractère littéral consiste à nommer son point de code. CommonMark reconnaît trois formes : `&` suivi d’un nom d’entité HTML5 valide suivi de `;`, `&#` suivi de un à sept chiffres décimaux suivi de `;`, et `&#` suivi de `x` ou `X`, de un à six chiffres hexadécimaux et de `;`. Un point de code invalide est remplacé par U+FFFD, le caractère de remplacement, et un nom inconnu est laissé tel quel en texte littéral (vérifié sur spec.commonmark.org, le 9 septembre 2026).

La propriété qui les rend utiles tient en une ligne de la même section : les références ne sont pas reconnues dans les blocs et les segments de code, et elles ne peuvent pas tenir lieu de caractères structurels. `&#42;` est un astérisque littéral dans la sortie et jamais le début d’une emphase ; `&#35;` en début de ligne est un dièse, pas un titre. Là où une barre oblique inverse retire une signification, une référence n’en a jamais eu à retirer — le caractère arrive après que l’analyseur a fini de décider ce qu’est la ligne.

| Référence | Caractère | Pourquoi vous y recourriez |
| :--- | :--- | :--- |
| `&amp;` | `&` | Celle qu’on ne peut pas éviter : une esperluette nue peut commencer une référence |
| `&lt;` `&gt;` | `<` `>` | De la prose sur HTML, et partout où le HTML brut est laissé passer |
| `&quot;` | `"` | Dans un attribut HTML, où une barre oblique inverse casse la valeur |
| `&#42;` | `*` | Un astérisque littéral qu’aucun analyseur ne peut lire comme une emphase |
| `&#95;` | `_` | La même chose pour un tiret bas, dans une variante à emphase intramot |
| `&#124;` | `\|` | Une barre verticale dans une cellule de tableau, dans un moteur de rendu dont vous vous méfiez sur le traitement de `\|` |
| `&copy;` `&reg;` | `©` `®` | Ce n’est pas de la ponctuation ASCII : une barre oblique inverse ne peut de toute façon pas les échapper |
| `&nbsp;` | Une espace insécable | Garder « 10 Mo » ou « Figure 3 » sur une seule ligne |
| `&#x2014;` | Un tiret cadratin | Un caractère que la police de votre éditeur ou votre clavier rend malcommode |

Une référence vaut mieux dans quatre situations. Là où une barre oblique inverse est inerte — à l’intérieur de HTML brut, ou dans la valeur d’un attribut. Là où le caractère n’est pas de la ponctuation ASCII, et où il n’y a donc rien à échapper : `©`, `®`, `†`, une espace insécable, un tiret typographique. Là où le fichier passera par un outil qui supprime ou double les barres obliques inverses, car `&amp;` survit à un remplacement de chaîne naïf auquel `\&` ne survit pas. Et là où vous voulez que le caractère soit à l’abri des différences entre variantes, puisque `&#42;` se comporte de façon identique dans tout moteur de rendu qui implémente les références.

Le coût est réel et mérite d’être énoncé. Une référence est du HTML : elle n’a donc de sens que sur un chemin qui aboutit à du HTML. Convertissez le même fichier [en texte brut](/blog/markdown-to-plain-text) ou vers un traitement de texte, et un convertisseur qui ne résout pas les références imprimera `&nbsp;` sous forme de six caractères visibles. Les références sont illisibles dans la source — personne, en parcourant un paragraphe, ne reconnaît `&#8212;` d’un coup d’œil. Et elles forment une liste plus courte qu’il n’y paraît : seuls les caractères dotés d’un nom HTML5 fonctionnent sous la forme nommée, et des noms inventés comme `&asterisk;` retombent en simple texte.

## Les caractères qui ne comptent que dans une seule position

La plupart des échappements que les gens pratiquent sont inutiles, car la plupart de ces caractères ne sont spéciaux qu’à un endroit précis. Apprendre les positions coûte moins cher qu’apprendre le tableau.

**En début de ligne.** C’est là que se décide la structure en blocs, et là qu’un caractère resté inoffensif tout le document cesse brusquement de l’être. Un `#` devient un titre. Un `>` devient une citation en bloc. Un `-` ou un `+` devient une puce — et un `-` sur la ligne située sous un paragraphe devient un soulignement setext `<h2>`, ce qui transforme en titre la phrase qui le précède. Un `=` sur cette ligne en fait un `<h1>`. Des chiffres suivis d’un `.` ou d’un `)` deviennent un marqueur de liste ordonnée, et le nombre est utilisé : un paragraphe commençant par « 1986. L’année où la norme a changé » s’affiche en liste ordonnée dont le premier élément porte le numéro 1 986, parce que le marqueur fixe l’attribut de départ de la liste. Tout cela demande une barre oblique inverse, posée sur le caractère et non en début de ligne : `1986\.`, pas `\1986.`.

L’indentation compte elle aussi comme une position. Un marqueur de niveau bloc fonctionne encore avec jusqu’à trois espaces devant lui, et quatre espaces donnent au contraire un bloc de code indenté — pousser une ligne vers la droite ne désamorce donc pas un dièse, et la pousser davantage la change en tout autre chose.

**En fin de titre.** Une suite de dièses en fin de titre ATX est une séquence de fermeture et se trouve retirée : `### Notes ###` s’affiche « Notes ». Si les dièses font partie du texte, échappez la suite — `### Notes \###` — et ils restent.

**Dans une cellule de tableau.** La barre verticale est le seul caractère dont la signification particulière se limite à une seule construction, et elle y est absolue : une barre verticale non échappée termine la cellule, quel que soit ce dans quoi elle est enveloppée. Tout ce qui touche à [garder un tableau intact au fil d’une conversion](/blog/markdown-tables-that-survive-conversion) commence par ce caractère unique.

**Dans le texte et les cibles de liens.** Les crochets s’imbriquent mal : un crochet à l’intérieur d’un texte de lien doit donc être échappé, `[a \[b\] c](https://example.com)`. À l’intérieur de la cible, des parenthèses équilibrées passent en général sans problème, et une parenthèse déséquilibrée demande `\(` ou `\)`. Une espace dans une cible n’est pas du tout un problème d’échappement — une barre oblique inverse ne la sauvera pas, et le lien entier se dégrade en simple texte ; encodez-la pour cent.

**Dans le titre d’un lien.** Un guillemet droit à l’intérieur d’un titre `"…"` demande `\"`, l’un des rares endroits où une barre oblique inverse fonctionne alors que les gens supposent le contraire.

### La barre oblique inverse en fin de ligne

Il existe une position où une barre oblique inverse n’est pas du tout un échappement, et c’est la collision qu’il vaut la peine de connaître. La spécification le dit sans détour : une barre oblique inverse en fin de ligne est un saut de ligne forcé (vérifié sur spec.commonmark.org, le 9 septembre 2026). Une ligne de paragraphe qui se termine par une unique barre oblique inverse n’en imprime donc aucune — elle émet un `<br>` et attire à elle la ligne suivante.

Cela compte dans exactement un cas courant, et c’est un cas Windows. Un chemin de répertoire écrit en prose et terminé par un séparateur, `C:\logs\`, se retrouve en fin de ligne et se transforme en saut de ligne, emportant la barre avec lui. Deux barres obliques inverses, `C:\logs\\`, vous donnent une barre littérale et aucun saut. Un segment de code vous donne le chemin et rien d’autre, et c’est la bonne réponse.

En fin de bloc — dernière ligne d’un paragraphe, fin d’un titre — aucune des deux syntaxes de saut n’a de ligne à couper, et la barre oblique inverse s’imprime à la place. Cette asymétrie est la moitié utile de la comparaison entre les deux formes de saut forcé : une barre oblique inverse égarée se voit sur la page, alors que des espaces égarées en fin de ligne, non.

## Ce qu’un convertisseur échappe à votre place en sortie

L’échappement n’est pas seulement quelque chose que vous faites subir à un fichier source. Chaque conversion, dans un sens comme dans l’autre, insère des échappements, et savoir lesquels vous apprend à lire une sortie cassée.

**De Markdown vers HTML.** Trois caractères de votre texte ne peuvent pas voyager tels quels, parce que HTML les lirait comme du balisage. Un convertisseur les remplace, en silence et toujours.

| Dans votre Markdown | Dans le HTML | Pourquoi |
| :--- | :--- | :--- |
| `<` dans le texte | `&lt;` | Sinon le navigateur se met à analyser une balise |
| `&` dans le texte | `&amp;` | Sinon le navigateur se met à analyser une référence |
| `>` dans le texte | `&gt;` | La symétrie, et la sûreté dans les analyseurs anciens |
| `"` dans un attribut | `&quot;` | Sinon la valeur de l’attribut se termine trop tôt |
| `'` dans un attribut | `&#39;` | La même chose, pour les attributs entre guillemets simples |

C’est pourquoi un `<div>` littéral tapé dans une phrase apparaît sous forme de texte sur la page au lieu de disparaître dans le balisage, et c’est un comportement ancien plutôt qu’une amabilité moderne : le document de syntaxe Markdown d’origine note que, à l’intérieur des segments et des blocs de code, les chevrons et les esperluettes sont toujours encodés automatiquement (vérifié sur daringfireball.net, le 9 septembre 2026). Une référence de caractère que vous avez écrite vous-même est laissée tranquille — un convertisseur qui réécrirait `&amp;` en `&amp;amp;` casserait tous les documents qui en contiennent une.

**De HTML, Word, CSV ou JSON vers Markdown.** Ici, c’est le convertisseur qui doit insérer les barres obliques inverses, et c’est une façon raisonnable de le juger. Un paragraphe qui commence par « 1986. L’année » doit arriver sous la forme `1986\. L’année`, faute de quoi le document gagne une liste que personne n’a écrite. Une phrase contenant un astérisque, une cellule de tableau contenant une barre verticale, un titre dont le texte contient un dièse, un nom de produit portant un tiret bas à une frontière de mot : chacun réclame une barre oblique inverse insérée en cours de conversion, et un convertisseur qui saute l’étape vous rend un fichier qui s’affiche comme un document différent de celui qu’on lui a confié. [Tester une conversion avec un paragraphe délibérément retors](/blog/convert-html-to-markdown) avant de lui confier cent pages coûte une minute.

**Du texte brut vers Markdown.** Le même problème se pose alors qu’il n’y a rien à convertir : un fichier `.txt` n’a jamais été du Markdown, et n’importe lequel des trente-deux caractères ci-dessus qui s’y trouvait par hasard — une puce tapée avec un tiret, un appel de note écrit avec un tiret bas, une année en début de ligne — se lit comme de la mise en forme dès l’instant où le fichier est traité comme du Markdown, alors que personne n’en voulait. [La conversion Texte brut → Markdown de TransformPipe](/text-to-markdown) existe précisément pour ce cas : elle échappe les caractères propres à Markdown dans la source avant que quoi que ce soit ne la rende, si bien que le fichier dit sur la page exactement ce qu’il disait dans le `.txt`, astérisques compris.

**Pourquoi `&amp;lt;` apparaît sur une page.** Parce que quelque chose a été échappé deux fois. `<` est devenu `&lt;`, puis une seconde passe a traité cette chaîne comme du texte ordinaire et a échappé son esperluette en `&amp;`, ce qui donne `&amp;lt;` — et le navigateur l’affiche fidèlement sous forme du texte visible `&lt;`. Trois esperluettes d’épaisseur, `&amp;amp;lt;`, signifient trois passes. La cause est presque toujours une chaîne de traitement où deux étapes croient chacune être celle qui a la charge de l’échappement : un convertisseur qui produit du HTML et alimente un moteur de gabarits qui échappe automatiquement ses entrées ; ou un assainisseur exécuté après l’échappement au lieu d’avant. Le diagnostic relève de l’arithmétique — comptez les couches de `amp;` et vous savez combien d’étapes ont échappé — et le remède consiste à retirer une étape d’échappement, jamais à en ajouter une de déséchappement.

Le symptôme miroir est une barre oblique inverse sur la page rendue là où vous attendiez un caractère propre. Cela veut dire que du texte échappé pour Markdown a atteint quelque chose qui n’est pas un moteur de rendu Markdown : un champ de texte brut, un attribut `title`, un segment de code ajouté après les échappements. Ou bien les échappements n’ont rien à faire là, ou bien c’est le texte qui n’a rien à faire dans ce conteneur.

## Les cas qui se présentent vraiment

Cinq situations rendent compte de presque toutes les plaintes réelles au sujet de l’échappement. Aucune n’est exotique, et une seule concerne véritablement Markdown.

### Écrire sur Markdown en Markdown

Le document le plus difficile à écrire en Markdown est un document sur Markdown, parce que chaque exemple est une construction vivante. Échapper caractère par caractère fonctionne et se lit affreusement : `\*\*gras\*\*` dans la source est pire que la chose qu’il décrit.

Employez plutôt des segments de code, et servez-vous de la règle de calage lorsque l’exemple contient des backticks. Un segment de code peut s’ouvrir avec un nombre quelconque de backticks et se ferme par le même nombre, et une espace initiale et une espace finale sont retirées — un segment à deux backticks contenant des espaces peut donc renfermer un backtick littéral. Pour montrer un bloc clôturé, ouvrez la clôture extérieure avec quatre backticks et placez-y l’exemple à trois backticks :

    ````
    ```js
    const x = 1;
    ```
    ````

Pour tout ce qui est court — un fragment de syntaxe, une option, un marqueur — un segment de code est à la fois correct et plus bref qu’un échappement. **Pour qui ?** Pour quiconque rédige de la documentation, une charte rédactionnelle ou un README qui cite de la syntaxe.

### Les extraits comportant de la syntaxe de gabarit

`{{ }}`, `{% %}` et `${…}` engendrent un flux continu de questions sur l’échappement, et aucune n’est un problème Markdown. Les accolades sont échappables mais dénuées de sens en CommonMark : `{{ name }}` dans un paragraphe s’affiche `{{ name }}`. Ce qui les dévore, c’est un second processeur travaillant sur le même fichier — le moteur de gabarits d’un générateur de site statique, une construction de documentation, un cadriciel de composants — exécuté soit avant Markdown, soit après.

Une barre oblique inverse ne peut donc pas aider, puisque le moteur qui consomme les accolades n’a jamais entendu parler des échappements de Markdown. Chaque moteur a son propre mécanisme, et celui de Liquid en est l’exemple le plus clair : sa balise `raw` désactive temporairement le traitement des balises, et la documentation cite la syntaxe Handlebars comme la raison pour laquelle on en voudrait (vérifié sur shopify.github.io, le 9 septembre 2026). Un bloc de code clôturé n’est pas non plus une protection ici — un moteur de gabarits qui parcourt le fichier `.md` brut ignore tout de l’existence de la clôture.

`${…}` est une troisième variante de la même forme : à l’intérieur d’un littéral de gabarit JavaScript, c’est de l’interpolation, et l’échappement qui l’arrête est la barre oblique inverse de JavaScript, dans le code, pas celle de Markdown. L’échapper dans le Markdown vous donne un document contenant `\${…}`, ce qui est faux deux fois.

**Pour qui ?** Pour quiconque documente un langage de gabarits, un script shell ou une configuration d’intégration continue à l’intérieur d’un site lui-même construit à partir de gabarits. Trouvez d’abord la directive « brut » du moteur extérieur ; ce n’est pas au niveau de Markdown que le correctif doit se placer.

### Les chemins Windows

Un chemin comme `C:\Users\name\Documents` survit le plus souvent à un moteur de rendu Markdown, et c’est là le piège. Chaque barre oblique inverse est suivie d’une lettre : chacune est donc une barre littérale et s’imprime. Puis un chemin du document se trouve par hasard suivi d’un signe de ponctuation ASCII et perd un séparateur sans un mot d’avertissement : `C:\temp\_new` s’affiche `C:\temp_new`, et `C:\logs\` en fin de ligne devient un saut de ligne.

Rien dans la sortie ne le signale. Le chemin reste un chemin plausible, ce qui explique pourquoi cette erreur atteint un article d’assistance et se retrouve collée dans le terminal de quelqu’un avant que personne ne s’en aperçoive. Doubler chaque barre oblique inverse fonctionne et rend la source illisible. Un segment de code fonctionne, est plus court, et protège toute la suite d’un coup — entre backticks, une barre oblique inverse est du contenu, toujours, et il ne reste plus rien qui puisse mal tourner.

**Pour qui ?** Pour quiconque rédige des instructions d’installation, des emplacements de journaux ou des chemins de configuration pour Windows. Mettez systématiquement chaque chemin dans un segment de code et cette classe de bogues disparaît.

### La monnaie et les mathématiques avec des signes dollar

En CommonMark pur comme en GFM, `$` ne signifie rien. « Cela coûte de $5 à $10 » s’affiche exactement comme écrit, et aucun échappement n’est nécessaire. La difficulté commence là où une extension mathématique est activée, car `$…$` est alors un délimiteur, et deux signes dollar sur une même ligne deviennent une expression mathématique contenant votre phrase.

GitHub est l’endroit où la plupart des gens rencontrent le problème. Sa documentation indique qu’une expression en ligne est entourée de signes dollar, qu’à l’intérieur d’une expression mathématique on ajoute une barre oblique inverse devant un `$` explicite et — la partie qu’il faut retenir — qu’en dehors d’une expression mathématique mais sur la même ligne, il convient d’entourer le `$` explicite de balises `span` (vérifié sur docs.github.com, le 9 septembre 2026). C’est une consigne invitant à recourir à du HTML brut plutôt qu’à une barre oblique inverse, ce qui vous dit avec quelle fermeté le signe dollar est revendiqué sur cette plateforme.

La réponse portable est l’habituelle : mettez le montant dans un segment de code, ou écrivez la monnaie en toutes lettres. **Pour qui ?** Pour quiconque écrit sur des prix, des chiffres financiers ou des unités dans un dépôt dont le README est rendu par une plateforme aux mathématiques activées.

### Les tirets bas à l’intérieur des identifiants

C’est de loin la plainte réelle la plus fréquente, et la bonne nouvelle est que CommonMark en a déjà réglé l’essentiel. Un tiret bas ne peut ouvrir ou fermer une emphase qu’à une frontière de mot : `snake_case_name` s’affiche donc tel quel, intact, et ne demande aucune barre oblique inverse. Il n’en va pas de même des astérisques : `a*b*c` met le `b` en emphase, car `*` ne porte aucune restriction de ce genre.

Trois formes cassent malgré tout, et ce sont elles qui engendrent les signalements.

| Ce que vous écrivez | Ce que vous obtenez | Pourquoi |
| :--- | :--- | :--- |
| `snake_case_name` | `snake_case_name` | Les deux tirets bas sont à l’intérieur d’un mot : aucune emphase |
| `__init__` | « init » en gras | Les deux suites sont à une frontière de mot : toutes deux peuvent servir de délimiteurs |
| `_private and id_` | « private and id » en italique | Un tiret bas initial ouvre ; un tiret bas final, des phrases plus loin, ferme |
| `MAX_VALUE and MIN_VALUE` | Inchangé | Les deux sont intramots |
| `a*b*c` | `a<em>b</em>c` | Les astérisques n’ont pas de règle de frontière de mot |

`__init__` est le cas qui coûte le plus de temps, parce que les noms « dunder » de Python sont exactement le motif que la règle d’emphase est censée attraper, et parce que la sortie — du texte en gras là où devrait figurer un nom de méthode — ressemble à un accident de style plutôt qu’à un accident de syntaxe. `\_\_init\_\_` le corrige en quatre barres obliques inverses. Un segment de code le corrige en deux backticks, et empêche en outre le nom d’être recoupé en fin de ligne, souligné par le correcteur orthographique ou transformé en salade de guillemets typographiques.

La règle de frontière de mot est celle de CommonMark, ce qui constitue l’autre moitié de la réponse : un moteur de rendu antérieur à la spécification, ou qui implémente une autre règle d’emphase, pourra malgré tout mettre en emphase des tirets bas intramots. **Pour qui ?** Pour quiconque écrit sur du code en prose — identifiants, variables d’environnement, colonnes de base de données, noms d’options. Un segment de code est correct dans toutes les variantes et communique « ceci est un symbole » par-dessus le marché.

## La part honnête : aux marges, l’échappement dépend de la variante

Tout ce qui précède est vrai de CommonMark, et CommonMark n’est pas la seule chose qui affiche votre fichier. L’ensemble des caractères échappables est lui-même une décision de variante, et l’écart n’est pas mince.

Le document de syntaxe Markdown d’origine énumère exactement quinze caractères que l’on peut échapper : la barre oblique inverse, le backtick, l’astérisque, le tiret bas, les accolades, les crochets, les parenthèses, le dièse, le plus, le moins, le point et le point d’exclamation (vérifié sur daringfireball.net, le 9 septembre 2026). CommonMark a élargi cela aux trente-deux signes de ponctuation ASCII. `\|`, `\~`, `\$`, `\:` et `\=` sont donc des échappements dans un moteur CommonMark et des barres obliques inverses imprimées dans un moteur antérieur. Un fichier qui échappe par précaution pour l’un est un fichier aux barres obliques inverses visibles dans l’autre, et les deux moteurs font ce que leur documentation annonce.

Les marges bougent aussi dans l’autre sens. GFM donne à `|` et à `~` des significations que CommonMark n’a pas — une frontière de cellule et, par paires, le texte barré — et ajoute l’échappement de la barre verticale dans les segments de code pour composer avec la première (vérifié sur github.github.com, le 9 septembre 2026). Une extension mathématique revendique `$`. La syntaxe des blocs d’attributs revendique `{` et `}`. Les raccourcis d’émojis et certaines syntaxes de notes revendiquent `:`. Chacune de ces extensions fait passer un caractère de la colonne « n’a jamais besoin d’échappement » à une colonne où il en a besoin, et aucune ne figure dans une spécification que l’on pourrait désigner comme faisant autorité. [L’ampleur de la divergence entre les variantes et la question de savoir quelle fonctionnalité appartient à laquelle](/blog/commonmark-gfm-and-the-flavours) forment l’arrière-plan de tout cela.

Reste une réponse portable, et elle a un coût qu’on saute facilement. Un segment de code fonctionne partout : aucune variante n’en interprète le contenu, aucune extension n’y revendique de caractère, et la question de l’échappement ne se pose pas. Mais un segment de code n’est pas une enveloppe neutre — il modifie le texte. Il s’affiche à chasse fixe, le plus souvent sur un fond teinté et dans une taille légèrement différente, et il porte le sens « ceci est du code ». C’est juste pour un chemin, une option ou un identifiant. C’est faux pour un nom d’entreprise contenant une esperluette, pour un prix, pour une phrase parlant d’un astérisque, ou pour un titre. Emballer de la prose dans des backticks pour esquiver un problème d’échappement échange un bogue de syntaxe contre un bogue typographique — et le typographique est du genre qu’une graphiste remarque et qu’un rédacteur défend.

Il n’y a donc pas de réponse unique, seulement un court ordre de préférence. Dans un segment de code si le texte est du code. Une barre oblique inverse s’il s’agit de prose et qu’une variante doit la rendre. Une référence de caractère si la barre oblique inverse ne peut pas atteindre le caractère ou si celui-ci n’est pas de la ponctuation ASCII. Et réécrire la phrase — déplacer l’année hors du début de ligne, écrire la monnaie en toutes lettres — plus souvent que les gens ne s’y essaient, car une phrase qui n’a besoin d’aucun échappement s’affiche correctement dans toutes les variantes qui existeront jamais.

## Choisir un échappement, en cinq critères

1. **Décidez si le texte est du code, car cela répond à l’essentiel.** Un chemin, une option, un identifiant ou un motif a sa place dans un segment de code, où aucun échappement n’est nécessaire et où aucun ne sera interprété ; si le texte est de la prose, un segment de code est le mauvais instrument et vous revoilà avec des barres obliques inverses.
2. **Vérifiez la position avant d’ajouter quoi que ce soit.** Six des caractères qui comptent ne comptent qu’en début de ligne : une barre oblique inverse au milieu d’une phrase est donc presque toujours une barre qu’il faudra expliquer à quelqu’un plus tard.
3. **Échappez une seule fois, et sachez quelle étape le fait.** Une chaîne de traitement où deux étapes échappent produit `&amp;lt;` sur la page, et le seul remède est d’en retirer une — ajouter une étape de déséchappement pour compenser masque le défaut et casse le document suivant à la place.
4. **Prenez une référence de caractère quand la barre oblique inverse ne peut pas atteindre.** À l’intérieur de HTML brut, dans la valeur d’un attribut, ou pour un caractère qui n’est pas de la ponctuation ASCII, `&quot;` et `&copy;` fonctionnent là où `\"` et `\©` ne font absolument rien.
5. **Affichez le fichier là où il vivra réellement avant de vous arrêter à une méthode.** L’ensemble échappable, les règles d’emphase et le sens de `$`, `|` et `:` varient tous selon la variante : un document qui a l’air correct dans l’aperçu de votre éditeur peut porter des barres obliques inverses visibles sur la plateforme qui le publie.

## Conclusion

L’échappement en Markdown est une règle à longue traîne : une barre oblique inverse désamorce n’importe quel signe de ponctuation ASCII, ne fait rien devant quoi que ce soit d’autre, et ne fait absolument rien à l’intérieur d’un segment de code, d’un bloc de code, d’un lien automatique ou de HTML brut. Presque tous les problèmes sont la seconde moitié de cette phrase rencontrant un caractère qui n’a jamais été spécial que dans une seule position. Les références de caractères couvrent ce que la barre oblique inverse ne peut pas atteindre, les segments de code couvrent ce à quoi vous préféreriez ne pas penser, et une phrase réécrite couvre le reste. Si vous voulez voir ce qu’un fichier donné produit réellement — quels échappements ont survécu, quels caractères ont été interprétés, et ce que dit le HTML — [le convertir dans TransformPipe et en lire la sortie](/) va plus vite que d’y réfléchir, et c’est le seul moyen de retrouver l’échappement qui a disparu sans laisser de trace.

## FAQ

### Comment échapper un caractère spécial en Markdown ?

Placez une barre oblique inverse devant lui, à condition qu’il s’agisse de l’un des trente-deux signes de ponctuation ASCII : `\*` pour un astérisque littéral, `\#` pour un dièse en début de ligne, `\|` pour une barre verticale dans une cellule de tableau. Devant une lettre, un chiffre ou un caractère non ASCII, la barre oblique inverse n’est pas un échappement et s’imprime sur la page.

### Pourquoi ma barre oblique inverse apparaît-elle dans la sortie ?

Le plus probablement parce que le texte se trouve dans un segment de code, un bloc de code, un lien automatique ou du HTML brut, où les échappements ne fonctionnent pas et où une barre oblique inverse est du contenu ordinaire. L’autre possibilité est que vous ayez échappé quelque chose qui n’est pas de la ponctuation ASCII — une lettre, un chiffre, un tiret cadratin —, ce que la spécification définit comme une barre oblique inverse littérale.

### Comment écrire un astérisque ou un tiret bas littéral en Markdown ?

Écrivez `\*` ou `\_`, ou employez `&#42;` et `&#95;` si vous voulez un caractère qu’aucun analyseur ne peut lire comme une emphase. Les tirets bas à l’intérieur d’un mot n’ont besoin de rien en CommonMark et en GFM : `snake_case_name` est donc déjà sûr ; `__init__` ne l’est pas, car les deux suites se trouvent à des frontières de mot.

### Pourquoi mon tableau casse-t-il quand une cellule contient une barre verticale ?

Parce que la barre verticale est une frontière de cellule et que l’analyseur de tableaux y découpe la ligne avant toute autre chose, y compris avant la reconnaissance des segments de code. Échappez-la en `\|`, le seul échappement qui fonctionne à l’intérieur d’un segment de code, ou employez `&#124;`.

### Quand faut-il préférer `&amp;` à une barre oblique inverse ?

Quand la barre oblique inverse ne peut pas atteindre le caractère ou n’a rien à en retirer : à l’intérieur de HTML brut, dans la valeur d’un attribut, et pour les caractères qui ne sont pas de la ponctuation ASCII, comme `©` et l’espace insécable. Les références de caractères survivent en outre aux chaînes de traitement qui suppriment ou doublent les barres obliques inverses, au prix d’une source illisible.

### Pourquoi est-ce que je vois `&amp;lt;` dans ma sortie convertie ?

Quelque chose a échappé le texte deux fois : `<` est devenu `&lt;`, puis une seconde étape a échappé cette esperluette en `&amp;`. Comptez les couches de `amp;` pour compter les étapes, puis retirez-en une — le plus souvent un moteur de gabarits qui échappe automatiquement une sortie qu’un convertisseur avait déjà échappée.

### L’échappement fonctionne-t-il de la même façon dans tous les outils Markdown ?

Pas aux marges. L’ensemble échappable compte trente-deux caractères en CommonMark et quinze dans le Markdown d’origine, et les extensions pour les tableaux, les mathématiques, les attributs et les émojis revendiquent des caractères que le CommonMark pur ignore. Un segment de code se comporte de façon identique partout, et c’est pourquoi il est la réponse portable — et pourquoi il vaut la peine de savoir qu’il change aussi l’aspect du texte.
