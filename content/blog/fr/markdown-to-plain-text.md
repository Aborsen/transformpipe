---
title: "Markdown vers texte : retirer la syntaxe, garder les mots"
description: "Convertir du Markdown en texte brut sans l’abîmer : pourquoi une regex casse sur les clôtures, les échappements, les tableaux et les liens de référence."
date: 2026-08-23
tag: Conversion
keywords: markdown en texte, markdown en texte brut, supprimer le markdown, retirer la mise en forme markdown, markdown en txt, pandoc texte brut, compter les mots d’un markdown
---

### En bref

Employez un analyseur, jamais une expression régulière : le code clôturé, les échappements par barre oblique inverse, les tableaux, les liens de référence et les blocs HTML bruts mettent tous en échec la correspondance de motifs, et ils le font en silence. Pour un document entier, `pandoc -t plain` est la voie correcte la plus courte, avec `--wrap=none` quand la sortie part dans un diff ou dans un grep. À l’intérieur d’une compilation JavaScript ou Python, parcourez le flux de jetons que vous analysez déjà — `strip-markdown` pour remark, `md.parse()` pour markdown-it — parce que chaque élément réclame une décision et que les décisions devraient être visibles dans votre code. Rendre en HTML puis aplatir le résultat avec `lynx -dump` ou le paquet `html-to-text` est l’autre voie honnête, et la seule qui traite correctement le HTML brut.

Markdown est conçu pour rester lisible en tant que texte, et c’est exactement pour cela que l’on sous-estime cette conversion. Le fichier ressemble déjà à de la prose. Retirez quelques astérisques, laissez tomber les dièses, et c’est du texte brut — voilà l’intuition, et elle survit au contact d’environ quatre fichiers.

Puis vous en croisez un avec un bloc Python clôturé plein de `*args`, un tableau dont les nombres ne veulent dire quelque chose qu’à côté de leurs en-têtes de colonnes, un jeu de liens de référence définis tout en bas, et un élément `<details>` enroulé autour de la moitié du contenu. Chaque astérisque que vous retirez est désormais une décision. Certains sont de la mise en forme. Certains sont le code de quelqu’un. L’un d’eux est échappé, et signifie un astérisque littéral sur la page.

La vraie question n’est pas comment supprimer le balisage. C’est ce que vous faites de l’information que ce balisage transportait. Un titre est un titre par sa taille ; dans un fichier `.txt`, il n’y a pas de taille. Un élément de liste en est un par sa puce ; retirez la puce et trois éléments se fondent en une phrase qui dit une chose que personne n’a écrite. Voilà le travail : non pas une suppression, mais un ensemble de choix sur ce qui portera la structure une fois qu’il ne restera plus de balisage pour la porter.

## Comparatif rapide : l’aide-mémoire

| Voie | Idéale pour | Ce qu’elle exige | Ce qu’il advient des tableaux | Licence et prix |
| --- | --- | --- | --- | --- |
| `pandoc -t plain` | Un document entier, fidèlement | Une installation de Pandoc | Conservés en tableau de texte, calés par des espaces | Gratuit, GPL |
| `pandoc -t plain --wrap=none` | Comparer de la prose, faire des grep, une ligne par paragraphe | La même | Les mêmes | Gratuit, GPL |
| remark + `strip-markdown` | Une étape dans une compilation Node | Node, trois paquets | Retirés entièrement par défaut | Gratuit, MIT |
| `mdast-util-to-string` | Une chaîne unique pour un champ d’index de recherche | Node, un analyseur Markdown | Texte des cellules concaténé sans séparateur | Gratuit, MIT |
| Jetons markdown-it | Vous rendez déjà avec markdown-it | Node | Ce que vous écrivez, jeton par jeton | Gratuit, MIT |
| Jetons markdown-it-py | La même chose, en Python | Python | Ce que vous écrivez | Gratuit, MIT |
| `remove-markdown` | Une ligne d’aperçu ou un extrait | Node, un petit paquet | Des barres verticales oubliées dans les cas limites | Gratuit, MIT |
| Rendre en HTML, puis `lynx -dump` | Lire un document dans un terminal | Lynx installé | Dessinés en tableau de texte sur `-width` colonnes | Gratuit, GPL |
| Rendre en HTML, puis `w3m -dump` | La même chose, un autre moteur de rendu | w3m installé | Dessinés en tableau de texte sur `-cols` colonnes | Gratuit, open source |
| `html-to-text` (npm) | La partie texte d’un courriel | Node | Un formateur par sélecteur, `dataTable` pour les vrais tableaux | Gratuit, MIT |
| `get_text()` de BeautifulSoup | Une extraction rapide en Python | Python, bs4 | Aplatis, frontières perdues sans séparateur | Gratuit, MIT |
| `html2text` (Python) | C’est en fait du Markdown que vous vouliez | Python | Des tableaux Markdown à barres verticales — il produit du Markdown | Gratuit, GPLv3 |
| Le téléchargement texte d’un convertisseur de navigateur | Un fichier, tout de suite, sans installation | Un navigateur | La décision du convertisseur, pas la vôtre | Gratuit |
| `sed`, `awk`, une regex que vous avez écrite | Rien que vous comptiez conserver | Rien | Détruits en silence | Gratuit |

Licences et options telles que documentées sur pandoc.org, github.com et linux.die.net (vérifié le 8 septembre 2026).

## Retirer le balisage est un ensemble de décisions, pas une suppression

Avant tout outil, la liste des décisions. Chacune d’elles a une réponse défendable et une réponse mauvaise pour votre cas, et un convertisseur qui ne vous laisse pas voir ses choix les a faits quand même.

| Élément | Ce que le balisage transportait | Ce que le texte brut peut en faire |
| --- | --- | --- |
| Titre | Un rang, et une rupture visuelle | Une ligne à lui seul entouré de lignes vides, des capitales, ou un soulignement de tirets |
| Élément de liste | « Ceci est l’un de plusieurs » | Garder un marqueur `- `, ou perdre la frontière entre les éléments |
| Élément numéroté | Un numéro qui est du contenu | Garder le numéro ; on y fait référence ailleurs |
| Lien | Un texte plus une destination | Le texte seul, le texte avec l’URL en ligne, ou une liste de références numérotées |
| Image | Un texte alternatif et un fichier | Le texte alternatif, ou rien |
| Tableau | L’association ligne-colonne | Des colonnes calées, une ligne par rangée, ou un bloc d’un champ par ligne |
| Bloc de code | « Ne touchez à rien de tout cela » | Verbatim, jamais coupé, jamais épuré |
| Citation | Quelqu’un d’autre l’a dit | Garder `> ` ou une indentation ; l’enlever, et cela devient votre phrase |
| Emphase | Une insistance, ou un terme défini | Rien, ou des capitales, ou des soulignés de retour |
| Note de bas de page | Un marqueur et une note ailleurs | Un marqueur `[1]` et une liste à la fin |

### Les titres

Un titre en texte brut ne dispose d’aucun rang. Les réponses habituelles sont : le poser sur sa propre ligne avec une ligne vide au-dessus et en dessous et laisser la position faire le travail ; le composer en capitales ; ou le souligner de tirets. Notez que la troisième réponse a discrètement réintroduit du balisage — une ligne de texte avec `---` en dessous est un titre setext, du Markdown valide, et votre fichier `.txt` redevient un document au premier aller-retour.

La position seule est le choix le plus sûr et le plus faible. Un document à six niveaux d’imbrication s’aplatit en un flux où un H2 et un H4 se ressemblent, et un lecteur arrivé quatre écrans plus bas ne peut plus dire dans quelle section il se trouve. Si la hiérarchie est le contenu — une spécification, un contrat, un manuel d’exploitation — numérotez les titres avant d’aplatir, car les numéros survivent là où les tailles ne survivent pas.

### Les listes

Gardez la puce. Cela surprend ceux qui veulent « aucun balisage du tout », mais `- ` et `* ` étaient des conventions de liste en texte brut dans le courrier électronique bien avant l’existence de Markdown, et ils se lisent comme des listes pour une personne comme pour la plupart des segmenteurs. Retirez-les et les éléments consécutifs se collent : trois éléments disant « vérifier le disque », « redémarrer le service », « ouvrir un ticket » deviennent une seule ligne qui se lit comme une instruction unique.

Les listes ordonnées sont plus strictes. Le numéro est du contenu, pas de l’ornement, parce qu’autre chose dans le document dit « si l’étape 3 échoue ». Un convertisseur qui renumérote, ou qui abandonne les numéros au profit de puces, a modifié le document. L’imbrication demande aussi que son indentation soit préservée, ce qui vous coûte des colonnes sur la marge de droite — et si vous coupez en outre à 72 caractères, l’indentation doit sortir de ce budget. La [distinction entre listes lâches et listes serrées](/blog/markdown-line-breaks-and-lists) décide si les éléments sont séparés par des lignes vides, et elle mérite d’être tranchée délibérément plutôt qu’héritée.

### Les liens

Trois options, pas de quatrième. Laisser tomber l’URL et garder le texte, ce qui est court et laisse le lecteur incapable de suivre quoi que ce soit. Garder les deux en ligne sous la forme `le guide de déploiement (https://example.com/docs/deploy)`, ce qui est complet et transforme toute phrase contenant une URL de suivi en bouillie. Ou les rassembler en références numérotées à la fin, ce que fait Lynx par défaut et ce que son option `-nolist` désactive.

Choisissez d’après le consommateur. Pour un courriel lu par une personne, la liste de références à la fin est la version polie. Pour un index de recherche, laissez complètement tomber les URL — indexer `utm_source=newsletter` n’aide personne, et les jetons ainsi ajoutés concurrencent les mots qui comptent. Pour un comptage de mots, laissez-les tomber aussi, sinon votre compte inclut une URL de 120 caractères comme un mot et une URL raccourcie comme cinq.

### Les tableaux

C’est la décision qui ne peut pas être remise à plus tard et celle que la plupart des outils tranchent mal pour votre cas. Les colonnes calées ont l’air correctes, et seulement dans une police à chasse fixe, à une largeur qui n’est pas plus étroite que la plus longue rangée ; transférées dans un client de messagerie qui emploie une police proportionnelle, l’alignement s’effondre et les nombres se mélangent. Une ligne par rangée avec un séparateur survit à toutes les largeurs et perd l’association avec l’en-tête dès que la première rangée a défilé. Un bloc d’un champ par ligne — `Région : EMEA`, `Coût : 40`, une ligne vide entre les enregistrements — est verbeux, se lit correctement à toutes les largeurs, et c’est la seule version qui garde un sens lue à voix haute.

Quel que soit votre choix, vérifiez ce que votre outil a fait avant de lui faire confiance, car [les tableaux sont la première chose à casser dans une conversion](/blog/markdown-tables-that-survive-conversion) et l’échec ressemble à une réussite. Et rappelez-vous que les tableaux à barres verticales ne figurent pas du tout dans la spécification CommonMark — ils sont arrivés avec [GitHub Flavored Markdown et les autres variantes](/blog/commonmark-gfm-and-the-flavours) — si bien qu’un analyseur en CommonMark strict n’a jamais vu de tableau. Il a vu un paragraphe plein de barres verticales, et c’est exactement cela qu’il vous rendra.

### Le code, les citations et le reste

Les blocs de code ressortent verbatim ou ils ressortent faux. Pas de coupure de ligne — une commande shell coupée est une commande shell cassée. Aucun épurement à l’intérieur, jamais, pour les raisons que la section suivante développe longuement. Pour certaines destinations, la bonne réponse est de supprimer purement et simplement le code : un échantillon de 400 jetons sur une page de 600 mots dominera un index de recherche et fera correspondre la page à des requêtes sur lesquelles elle n’a rien à dire. [Ce qu’est réellement un bloc clôturé](/blog/code-blocks-in-markdown) compte ici, car il existe plus de façons d’en écrire un que la plupart des épurateurs n’en connaissent.

Les citations ont besoin qu’on leur garde leur `> ` ou une indentation. Retirer le marqueur transforme une citation en votre propre affirmation, ce qui est un changement de sens et non de mise en forme. Les images se réduisent à leur texte alternatif ou à rien, et si ce texte alternatif est vide — image décorative, correctement balisée — la sortie honnête est l’absence totale de sortie.

## Pourquoi la regex que vous alliez écrire est fausse

Le schéma est toujours le même. Quelqu’un écrit six substitutions, les teste sur un README, les livre, et onze mois plus tard il manque une ligne à la facture d’un client. Les expressions régulières ne peuvent pas analyser du Markdown parce que le Markdown est sensible au contexte : ce qu’un caractère signifie dépend du bloc dans lequel il se trouve, et un motif n’a aucune idée du bloc dans lequel il se trouve.

Voici les cinq cas qui la font échouer, dans l’ordre où ils vous mordront.

### Le code clôturé

Une clôture n’est pas un paragraphe, et rien de ce qu’elle contient n’est du balisage. Les `*args` et `**kwargs` de Python, le `#include` du C, un glob shell `*.log`, un diff dont les lignes commencent par `-`, un identifiant snake_case plein de soulignés, un enchaînement shell fait de caractères `|` — un épurateur qui retire globalement les marqueurs d’emphase corrompt chacun d’eux. C’est pire que de laisser le balisage en place, parce que la sortie prétend toujours être du code et qu’elle est désormais fausse. Personne ne s’en aperçoit avant de l’exécuter.

La clôture elle-même est plus variée que le motif naïf ne le suppose :

```text
~~~js
const total = a | b;
~~~
```

CommonMark autorise trois accents graves ou plus, ou trois tildes ou plus, une chaîne d’information après la séquence ouvrante, et jusqu’à trois espaces d’indentation avant elle. Une clôture peut contenir des séquences plus courtes de son propre caractère sans se fermer. À l’intérieur d’un élément de liste, elle est indentée à la colonne du contenu de l’élément. Et, indépendamment de tout cela, quatre espaces d’indentation en début de ligne forment eux-mêmes un bloc de code, sans la moindre clôture. Une regex réglée sur trois accents graves en début de ligne manque les clôtures à tildes, les clôtures indentées et les blocs de code indentés — trois façons de laisser fuiter le traitement du balisage dans le code source de quelqu’un.

### Les caractères échappés

En CommonMark, une barre oblique inverse devant un caractère de ponctuation ASCII rend ce caractère littéral. `\*not emphasis\*` est de la prose à propos d’astérisques. Un épurateur qui retire les barres obliques inverses laisse `*not emphasis*`, que l’outil suivant de la chaîne lira comme de l’emphase. Un épurateur qui retire les astérisques laisse `\not emphasis\`. Les deux ont tort, en sens opposés, et aucune de ces erreurs n’est visible dans un diff de la sortie à moins de la chercher.

Les entités HTML sont le même problème sous un autre chapeau. Un analyseur décode `&amp;` en `&`, `&copy;` en signe de copyright et `&#42;` en astérisque. Une regex laisse le texte de l’entité tel quel dans votre fichier de texte brut : le lecteur reçoit donc `Smith &amp; Sons` dans un corps de courriel, et le comptage de mots compte `&amp;` comme un mot. `\\` — une barre oblique inverse échappée — est le cas qui piège la correction astucieuse, car il faut désormais savoir si la barre oblique inverse que vous regardez a elle-même été échappée par celle qui la précède.

### Les tableaux

Une rangée de barres verticales n’est un tableau que si la rangée de séparation est présente. Sans `| --- | --- |` sous l’en-tête, c’est un paragraphe. Avec, les barres verticales sont de la structure. Un motif qui supprime les caractères `|` à vue détruit les deux : le paragraphe perd sa ponctuation, et le tableau devient une suite de mots sans frontières. `EMEA 40 3 weeks` était naguère quatre cellules avec des en-têtes, et il n’y a aucun moyen de retrouver quel nombre était lequel.

Les cellules compliquent encore l’affaire. Une barre verticale à l’intérieur d’une cellule s’échappe en `\|`. Une barre verticale à l’intérieur de code en ligne n’est pas du tout un séparateur. Les deux-points d’alignement — `:---`, `---:`, `:---:` — sont de la structure qui ne porte aucun mot et doit disparaître. Et les cellules contiennent leur propre balisage en ligne : tout ce que vous avez décidé pour les liens et l’emphase s’applique donc aussi à l’intérieur de chaque cellule.

### Les liens de référence

La regex de tout le monde gère `[text](url)`. Markdown a quatre autres formes de lien, et elles sont toutes courantes dans les fichiers écrits par des gens qui les modifient à la main :

```text
See the [deployment guide][deploy] and the [runbook].

[deploy]: https://example.com/docs/deploy "Deploy"
[runbook]: https://example.com/docs/runbook
```

La forme de référence complète `[text][id]`, la forme réduite `[text][]` et la forme abrégée `[text]` pointent toutes vers une définition qui peut se trouver des centaines de lignes plus loin, en général au bas du fichier. Un motif qui ne connaît que les liens en ligne laisse les crochets dans la prose et laisse le bloc de définitions en guise de paragraphe final d’URL nues — ce qui est exactement la forme de sortie qui paraît correcte à la vérification rapide et qui est manifestement cassée pour qui la reçoit. Ajoutez les liens automatiques entre chevrons `<https://example.com>`, l’autoliaison des URL nues de GFM, et la syntaxe d’image que le motif naïf transforme en `!alt text`, et le nombre de formes à traiter n’est pas de cinq, il approche la douzaine.

### Les blocs HTML

Markdown autorise le HTML brut : un fichier `.md` peut donc contenir tout ce que le HTML peut contenir. En pratique, il contient des `<details>` et des `<summary>` autour de sections repliables, des `<img>` avec un attribut de largeur, des `<br>` pour des sauts de ligne que la syntaxe ne veut pas donner, des `<sub>` et des `<sup>`, des éléments `<table>` entiers écrits à la main, et des `<!-- commentaires -->` qui n’étaient jamais destinés à la publication.

L’effacement des balises par un motif échoue sur tout cela. `<!-- TODO: check these numbers with legal -->` est un commentaire dont une regex promouvra allègrement le texte au rang de prose, dans un document que vous êtes sur le point d’envoyer à quelqu’un. Un élément `<script>` est pire : retirez les balises et le corps JavaScript devient un paragraphe. Les valeurs d’attributs fuient de la même façon — un épurateur qui retire les portions de `<` à `>` doit encore décider si le texte d’un attribut `alt` est du contenu, et un motif ne sait pas distinguer un attribut d’un nœud de texte. Tout ce qui implique du HTML brut dans un fichier que vous n’avez pas écrit vous-même relève d’un véritable analyseur HTML, ce qui est l’un des arguments les plus forts en faveur de la voie « rendre puis aplatir » plus bas.

Il existe un usage honnête pour un épurateur à base de regex : une ligne d’aperçu. S’il vous faut les 140 premiers caractères d’un document pour une carte ou un résultat de recherche, un astérisque de trop est cosmétique et l’échec est visible. Partout où le texte doit être juste, employez un analyseur.

## Là où le texte brut est réellement la bonne sortie

Le texte brut n’est pas un HTML dégradé. Pour plusieurs travaux, c’est le format que le système récepteur accepte réellement, et lui donner du Markdown à la place est l’erreur.

**Le courriel en texte brut.** Un courriel HTML bien formé est un message `multipart/alternative` dont les parties sont rangées de la moins fidèle à la plus fidèle (RFC 2046), ce qui veut dire que la partie `text/plain` précède la partie HTML. Si vous fabriquez cette partie en y collant la source Markdown, votre destinataire lit `**Important**` et `[the invoice](https://…)` avec la ponctuation apparente. La RFC 5322 recommande des lignes d’au plus 78 caractères : coupez donc à 72 et laissez la place aux marqueurs de citation `> ` qu’une réponse ajoutera ; si vous voulez que le client recompose lui-même les paragraphes, c’est à cela que sert `format=flowed` (RFC 3676).

**Les comptages de mots.** `wc -w` sur un fichier `.md` brut compte comme des mots les barres verticales des tableaux, les lignes de clôture, les définitions de références et chaque URL. Un fichier qui annonce 900 mots peut faire 700 mots de prose et 200 mots de syntaxe et de code. `pandoc -t plain file.md | wc -w` donne le nombre sur lequel une personne serait d’accord, et supprimer les blocs de code avant de compter le change encore — c’est pourquoi un comptage de mots n’a de sens qu’accompagné des options qui l’ont produit.

**L’indexation pour la recherche.** Segmenter du Markdown brut met `**`, `](` et `https` dans votre index, fait correspondre des requêtes à l’intérieur d’échantillons de code, et produit des extraits où la syntaxe est visible par l’utilisateur. Les moteurs de recherche des générateurs de sites statiques contournent cela en indexant le HTML construit plutôt que la source, ce qui est la même idée prise par l’autre bout : indexez ce que le lecteur voit. Si vous construisez l’index vous-même, aplatissez d’abord, et décidez explicitement si les blocs de code sont du contenu cherchable ou du bruit.

**La parole et la lecture à voix haute.** Un moteur de synthèse vocale prend une chaîne. Donnez-lui du Markdown et vous obtenez de la ponctuation lue à voix haute, ou des marqueurs collés en silence aux mots voisins. Il faut toutefois être précis ici : sur le web, le HTML sémantique bat le texte aplati à tous les coups — un lecteur d’écran veut de vrais titres, de vraies listes et de vraies cellules de tableau en tant qu’éléments, et les réduire à du texte supprime la navigation dont le lecteur dépend. Le cas du texte brut vaut pour les chaînes de traitement qui acceptent une chaîne de caractères, pas pour les pages qu’une personne ouvre.

**La sortie de terminal.** Un message de commit, un texte de `--help`, une ligne de journal d’intégration continue, un corps de notification. Aucun d’eux n’affiche de balisage, et on y colle pourtant du Markdown dans tous les cas. Notez que `glow` et `mdcat` font le travail inverse — ils rendent du Markdown pour un terminal au moyen de séquences ANSI et de caractères de tracé — ce qui est agréable à lire et n’est pas un fichier `.txt`.

**Comparer de la prose.** C’est le cas auquel on arrive en dernier et qu’on apprécie le plus. Quand deux versions d’un document ne diffèrent que parce que quelqu’un a recomposé les paragraphes, un diff de lignes signale tout le paragraphe comme modifié et ne vous apprend rien. Convertissez les deux versions avec `--wrap=none` pour qu’un paragraphe fasse une ligne, puis comparez avec `git diff --word-diff`, et ce que vous voyez, ce sont les mots qui ont changé. La même astuce rend un `.docx` converti comparable au Markdown qu’il était censé refléter.

## Les outils, un par un

### Pandoc — la voie correcte la plus courte

Pandoc a `plain` parmi ses formats de sortie : tout le travail tient donc dans une commande.

```bash
pandoc -t plain notes.md -o notes.txt
```

| Avantages | Inconvénients |
| --- | --- |
| Un véritable analyseur : tous les cas de la section précédente sont traités | Un binaire Haskell à installer |
| Coupure, colonnes et traitement des commentaires sont des options, pas du code | Les choix de son writer `plain` lui appartiennent, et ne sont configurables qu’en partie |
| Les tableaux survivent en tableaux de texte au lieu de disparaître | Les tableaux calés exigent une police à chasse fixe pour se lire correctement |
| Lit de nombreux formats d’entrée : la même commande sert pour `.docx` et le HTML | Les différences de dialecte Markdown obligent à nommer le reader |

**Prix :** gratuit, sous licence GPL.

**Détails techniques et fonctions**

- `--wrap=auto` est la valeur par défaut et coupe selon `--columns`, qui vaut 72 par défaut ; `--wrap=none` met chaque paragraphe sur une ligne, et `--wrap=preserve` conserve les sauts de ligne de la source (vérifié sur pandoc.org, le 8 septembre 2026)
- `--strip-comments` retire les commentaires HTML de la source au lieu de les laisser passer
- Les liens ressortent sous forme de leur libellé, l’URL abandonnée ; les images ressortent sous forme de leur texte alternatif entre crochets ; le code en ligne ressort sous forme de chaîne nue ; les notes de bas de page deviennent des marqueurs de style `[1]` avec une liste à la fin (vérifié dans la source du writer sur github.com, le 8 septembre 2026)
- L’emphase et le texte fort ressortent en texte nu, à moins d’activer l’extension `gutenberg`, qui ramène les `_soulignés_` pour l’emphase et compose le texte fort en capitales (vérifié sur github.com, le 8 septembre 2026)
- Nommez le reader quand l’entrée est du GitHub Flavored — `-f gfm` — pour que les listes de tâches et les liens automatiques soient lus comme ils ont été écrits

**Pour qui ?** Pour quiconque convertit des documents entiers et peut installer un binaire. C’est la réponse par défaut, et la seule raison de ne pas la prendre est que vous avez besoin que les décisions vivent dans votre propre code.

### remark et `strip-markdown` — une étape dans une compilation Node

La chaîne unified analyse le Markdown en un arbre mdast, et `strip-markdown` est le greffon qui l’aplatit : analyser, épurer, restituer.

| Avantages | Inconvénients |
| --- | --- |
| Un véritable arbre : rien ne dépend de la correspondance de motifs | Trois paquets et une chaîne ESM à mettre en place |
| Les options `keep` et `remove` rendent les décisions explicites | Les valeurs par défaut suppriment plus que les gens ne l’attendent |
| S’installe dans une compilation que vous avez déjà | Plus lent qu’un binaire unique pour un seul fichier |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctions**

- Sa propre description dit qu’il retire tout sauf les paragraphes et le texte
- Par défaut, il retire les blocs de code, le HTML, les séparateurs thématiques, les tableaux et le front matter YAML ou TOML, et il préserve le texte alternatif des images (vérifié sur github.com, le 8 septembre 2026)
- `keep` prend une liste de types de nœuds à laisser intacts ; `remove` prend des types de nœuds à retirer ou à remplacer par un gestionnaire
- Comme il s’exécute avant `remark-stringify`, « garder » un tableau veut dire que le stringifier le réécrit en tableau Markdown — garder les données et retirer le balisage sont deux demandes différentes, et le terrain intermédiaire exige un gestionnaire que vous écrivez

**Pour qui ?** Pour les projets JavaScript qui analysent déjà du Markdown avec remark, et pour quiconque veut voir les décisions élément par élément écrites dans une configuration plutôt que déduites de la sortie.

### `mdast-util-to-string` — une chaîne, pour les machines

Parfois vous voulez une chaîne unique pour un champ d’index de recherche ou pour un extrait, et la structure est sans importance. Cet utilitaire récupère le contenu textuel d’un nœud, en préférant les champs de texte brut et en sérialisant sinon les enfants.

| Avantages | Inconvénients |
| --- | --- |
| Un appel, une chaîne | Les enfants sont joints par un séparateur vide |
| Texte alternatif des images en option, via `includeImageAlt` | Les frontières de blocs disparaissent complètement |
| Minuscule, et déjà dans l’arbre si vous employez remark | Pas pour quoi que ce soit qu’une personne lise |

**Prix :** gratuit, sous licence MIT.

Le séparateur vide est la chose à savoir. Comme l’appel de jointure emploie `''`, un titre se jette droit dans le paragraphe qui le suit : « Tarifs » plus « Nous facturons par siège » devient `TarifsNous facturons par siège`. Pour un champ d’index, c’est en général sans conséquence, puisque le segmenteur coupe de toute façon à la frontière — mais pour un extrait que voit un utilisateur, ou pour un comptage de mots, cela produit un non-sens. Le remède est de parcourir vous-même l’arbre et de joindre les nœuds de niveau bloc par une ligne vide.

**Pour qui ?** Pour quiconque remplit un champ lu par une machine, après avoir vérifié que la concaténation n’a pas d’importance.

### markdown-it et markdown-it-py — parcourir le flux de jetons

Si votre application rend déjà du Markdown avec markdown-it, vous avez déjà l’analyseur lexical. `md.parse(source, {})` renvoie un tableau plat de jetons de types comme `heading_open`, `inline`, `fence` et `table_open`, et vous émettez du texte pour les types que vous voulez.

| Avantages | Inconvénients |
| --- | --- |
| Chaque décision est une branche d’un `switch` que vous pouvez lire | Vous possédez désormais chaque décision, y compris celles que vous oubliez |
| Pas de seconde dépendance, ni de second analyseur pour contredire le premier | Plus de code qu’une option |
| Le même modèle de jetons existe en Python sous le nom markdown-it-py | La disposition des tableaux est entièrement à vous de calculer |

**Prix :** gratuit, sous licence MIT.

**Pour qui ?** Pour les applications dont la sortie doit se conformer à un format maison — un gabarit de courriel précis, un rapport à largeur fixe, une ligne de journal — et pour les équipes qui préfèrent entretenir cinquante lignes de choix explicites plutôt que discuter avec les réglages par défaut d’un convertisseur.

### `remove-markdown` — la regex honnête

Un petit paquet à base d’expressions régulières qui retire la mise en forme Markdown d’une chaîne. C’est à quoi ressemble une version soignée du motif que vous alliez écrire, et il échoue sur les mêmes cas pour les mêmes raisons.

**Prix :** gratuit, sous licence MIT.

**Pour qui ?** Pour personne, s’il s’agit d’un document. C’est un choix raisonnable pour une ligne d’aperçu, un sous-titre de carte ou un corps de notification, là où le texte est court, où la source est la vôtre, et où un caractère égaré est cosmétique.

### Rendre en HTML, puis aplatir

Deux sauts au lieu d’un : du Markdown vers le HTML avec un véritable analyseur Markdown, puis du HTML vers le texte avec un véritable consommateur de HTML. Cela semble du gaspillage et cela règle deux problèmes d’un coup. La question de la variante est tranchée par l’analyseur Markdown, et le HTML brut de la source est traité par un outil dont c’est tout le métier — ce qu’aucun épurateur de niveau Markdown ne peut prétendre.

| Outil | Ce que c’est | Comportement notable |
| --- | --- | --- |
| `lynx -dump` | Un navigateur texte, qui déverse une sortie mise en forme sur la sortie standard | Coupe selon `-width`, 80 par défaut ; ajoute une liste de liens sauf si vous passez `-nolist` ; `-stdin` lit depuis un tube sous UNIX |
| `w3m -dump` | Un autre navigateur texte | `-cols` règle la largeur ; dessine les tableaux |
| `html-to-text` (npm) | Une bibliothèque faite pour cela | `wordwrap`, `selectors` et `formatters` par sélecteur CSS, `preserveNewlines`, `ignoreHref`, `hideLinkHrefIfSameAsText`, `dataTable` |
| `get_text()` de BeautifulSoup | L’accesseur de texte d’un analyseur HTML Python | Concatène les chaînes ; passez un séparateur ou perdez les frontières |

**Prix :** Lynx est gratuit et sous licence GPL ; `html-to-text` est gratuit et sous licence MIT ; BeautifulSoup est gratuit et sous licence MIT. Options citées depuis linux.die.net et github.com (vérifié le 8 septembre 2026).

La voie de la bibliothèque est celle à prendre pour le courriel, car `html-to-text` expose ses décisions de mise en forme par sélecteur : vous dites ce que fait un élément `a`, ce que fait un `table`, et où tombe la coupure, et les réponses vivent dans votre configuration plutôt que dans les conventions de rendu d’un navigateur. La voie du navigateur est celle à prendre pour la lecture, car un navigateur texte a passé trente ans à décider de quoi a l’air un document sur 80 colonnes, et il s’en sort mieux que vous ne le ferez cet après-midi.

Les deux sauts vous coûtent quelque chose. Vous entretenez deux conversions au lieu d’une, et l’étape HTML apporte ses propres conventions — Lynx numérote vos liens et ajoute une liste de références, w3m dispose les tableaux à sa façon. Ni l’un ni l’autre n’a tort ; les deux surprennent si vous ne vous y attendiez pas.

### `html2text` — le nom qui induit en erreur

Il mérite d’être nommé précisément, car c’est le premier résultat de recherche et le mauvais outil pour ce travail. Le `html2text` de Python se décrit comme convertissant du HTML en texte ASCII propre et facile à lire, qui se trouve être aussi du Markdown valide. C’est tout son propos : la sortie est du Markdown. `--ignore-links` et `--reference-links` changent la quantité produite, et `--mark-code` enveloppe le code dans ses propres balises, mais vous convertissez du [HTML vers du Markdown](/blog/convert-html-to-markdown), ce qui est un autre travail avec une autre panoplie d’outils. Il est gratuit et sous licence GPLv3.

**Pour qui ?** Pour quiconque voulait du Markdown. Qui voulait du texte devrait regarder la rubrique du dessus.

### Un convertisseur de navigateur, quand l’installation est le problème

TransformPipe convertit un fichier Markdown dans le navigateur et propose le résultat en téléchargement de texte brut à côté du HTML et du Markdown, sans rien téléverser tant que vous n’êtes pas connecté et avec un plafond de 10 Mo par conversion. Les décisions sur les titres, les liens et les tableaux sont celles de l’outil plutôt que les vôtres, et c’est là l’arbitrage : pas d’installation, pas d’options, et pas de contrôle.

**Prix :** gratuit.

**Pour qui ?** Pour quelqu’un qui a un fichier et aucune envie d’installer une chaîne d’outils Haskell pour l’aplatir — un document à coller dans un ticket, un corps de courriel, une note.

## Là où retirer la syntaxe échoue, et ce que cela coûte

Chacune des voies ci-dessus est un compromis, et il vaut la peine de dire sans détour lesquels de ces compromis sont inévitables.

**La structure n’a nulle part où vivre.** Le texte brut a un seul canal — la suite des caractères — et il doit porter à la fois les mots, la hiérarchie, l’emphase et les relations tabulaires. Une liste de contrôle de trente éléments répartis sur trois niveaux d’imbrication s’aplatit en un mur qu’un lecteur ne peut pas parcourir. Numéroter les titres aide et n’est pas gratuit : vous avez ajouté du texte qui n’était pas dans le document.

**Les tableaux perdent l’association, pas les données.** Chaque valeur survit ; ce qui disparaît, c’est la colonne à laquelle elle appartenait. Le calage la préserve, au prix d’une police à chasse fixe et d’une fenêtre au moins aussi large que la plus large rangée, et il n’y a aucun moyen de garantir l’un ou l’autre dans un client de messagerie. Un champ par ligne la préserve aussi et triple la longueur. Choisissez à l’avance, car le mode de défaillance d’un choix tardif est un tableau qui avait l’air correct dans votre terminal et qui est arrivé en nombres mélangés.

**Les liens ne peuvent pas être à la fois courts et complets.** Les URL en ligne saccagent la ligne ; les URL abandonnées suppriment la destination ; une liste de références à la fin demande au lecteur d’aller y voir. Aucune option n’évite les trois coûts : choisissez donc celui qui convient au lecteur que vous avez réellement.

**L’emphase est parfois du sens.** Un terme en gras à sa première occurrence parce qu’on le définit, un avertissement en gras dans un manuel d’exploitation, une négation en italiques — l’aplatissement supprime le seul signal qui distinguait ces mots de leurs voisins. Les capitales sont le substitut habituel et elles se lisent comme des cris. Dans un document où l’emphase porte une obligation, c’est une modification du document.

**Cela ne fait pas l’aller-retour.** Le texte en sortie n’est pas du Markdown en entrée. Une fois l’arbre disparu, vous ne pouvez plus reconstruire les titres, et tout ce qui veut de la structure en aval devra deviner. Gardez le `.md` comme source de vérité et traitez le `.txt` comme un artefact, régénéré plutôt que modifié.

**Le nombre bouge avec les options.** Comptages de mots, comptages de caractères et temps de lecture dépendent tous du fait que les blocs de code aient été supprimés ou non, que les URL aient été gardées ou non, et que les titres aient été comptés ou non. Un comptage n’est comparable qu’à un autre comptage produit par la même commande, ce qui devient important dès que quelqu’un inscrit une limite de mots dans un accord.

Et le plus grand de tous : si la raison pour laquelle vous voulez du texte brut est que le balisage vous gêne, vérifiez si la réponse n’est pas plutôt le HTML. Un document rendu garde les titres, les listes et les cellules de tableau, s’ouvre partout, et n’exige de vous aucune décision sur ce qui porte la structure. Le texte brut est la bonne sortie quand quelque chose en aval prend une chaîne de caractères. C’est la mauvaise sortie quand le lecteur est une personne avec un navigateur.

## Comment choisir

1. **Nommez le consommateur avant l’outil.** Une personne dans un client de messagerie, un segmenteur, un diff, un moteur de synthèse vocale et un terminal veulent chacun un jeu de décisions différent, et un convertisseur réglé pour l’un produit une sortie vaguement fausse partout ailleurs.
2. **Réglez d’abord la question des tableaux.** C’est la seule décision qui ne peut pas être repoussée : les colonnes calées vous engagent sur une police à chasse fixe et une largeur minimale, et un champ par ligne vous engage sur le triple d’espace vertical. Décider après avoir livré, c’est redécider devant un client.
3. **Employez un analyseur, pas un motif.** Tout fichier comportant une clôture, un échappement, un lien de référence ou un bloc HTML brut mettra en échec une expression régulière, et il le fera en silence — vous obtenez un texte qui se lit bien et auquel il manque une ligne, la sorte d’erreur la plus coûteuse qui soit.
4. **Fixez la largeur de coupure une fois, à la frontière.** `--wrap=none` pour les diffs et les grep, 72 colonnes pour le courriel, la largeur du terminal pour une interface en ligne de commande. Couper deux fois — une fois dans le convertisseur et une fois dans le client — est la façon dont un document se retrouve avec des lignes de trois mots.
5. **Testez sur votre fichier le plus laid.** Celui qui a la liste imbriquée, le bloc `<details>`, le tableau avec une barre verticale échappée dans une cellule et les liens de référence définis tout en bas. C’est ce fichier qui décide si un outil fonctionne ; un README propre ne décide de rien.

## Conclusion

Markdown vers texte est une petite conversion assortie d’une longue liste d’arbitrages, et l’outillage se partage nettement le long d’une seule ligne : les analyseurs font juste et les motifs font faux en silence. Prenez `pandoc -t plain` quand vous voulez le document entier et pouvez installer un binaire, parcourez le flux de jetons quand les décisions doivent vivre dans votre code et se conformer à un format spécifié par quelqu’un d’autre, et rendez en HTML avant d’aplatir quand la source contient du HTML brut que vous n’avez pas écrit. Quand le travail porte sur un seul fichier et que l’installation est l’obstacle, [un convertisseur côté navigateur](/) vous remettra un téléchargement de texte sans rien téléverser. Quelle que soit la voie choisie, gardez le Markdown comme source et traitez le texte comme une sortie — et faites passer votre pire fichier avant de faire confiance aux bons.

## FAQ

### Comment convertir du Markdown en texte brut en ligne de commande ?

`pandoc -t plain input.md -o output.txt` est la réponse correcte la plus courte, et elle coupe à 72 colonnes par défaut. Ajoutez `--wrap=none` si la sortie part dans un diff ou dans un grep, et `--strip-comments` si la source contient des commentaires HTML que vous ne voulez pas voir promus au rang de prose.

### Puis-je me contenter d’une expression régulière pour retirer le Markdown ?

Seulement là où une erreur est cosmétique, comme une ligne d’aperçu ou un sous-titre de carte. Le code clôturé, les échappements par barre oblique inverse, les tableaux, les liens de référence et les blocs HTML bruts mettent chacun en échec la correspondance de motifs à leur manière, et la sortie paraît plausible tout en étant fausse, ce qui explique que le bogue soit d’ordinaire trouvé par un lecteur plutôt que par un test.

### Pourquoi mon texte épuré contient-il encore des crochets ou des URL nues ?

Presque toujours à cause des liens de référence. Les formes `[text][id]` et `[text]` pointent vers des définitions qui se trouvent en général au bas du fichier : un épurateur qui ne gère que `[text](url)` laisse donc les crochets dans la prose et les définitions en bloc final d’URL. Un analyseur résout la référence et vous donne le libellé, la destination, ou les deux, selon ce que vous avez demandé.

### Un comptage de mots sur du Markdown diffère-t-il d’un comptage sur du texte brut ?

Oui, et en général de plus que ce que l’on attend. Compter le fichier brut inclut comme des mots les barres verticales des tableaux, les lignes de clôture, les définitions de références et chaque URL : un fichier qui annonce 900 mots peut en faire 700 de prose. Aplatissez d’abord, décidez si les blocs de code comptent, et consignez la commande à côté du nombre.

### Qu’advient-il des tableaux quand le Markdown devient du texte brut ?

Cela dépend entièrement de l’outil, et les trois réponses sont : les garder en tableaux de texte calés, qui exigent une police à chasse fixe ; aplatir chaque rangée en une ligne, ce qui perd l’association avec l’en-tête ; ou les supprimer, ce que plusieurs épurateurs font par défaut. Vérifiez ce que le vôtre a fait sur un vrai tableau avant de lui faire confiance, car chacun de ces résultats ressemble à une réussite lors d’une vérification rapide.

### `html2text` est-il un outil de Markdown vers texte ?

Non, doublement. Il convertit du HTML et non du Markdown, et sa sortie est délibérément du Markdown valide plutôt que du texte brut — sa propre documentation le dit. Si vous avez du HTML et voulez du texte, `lynx -dump` ou le paquet `html-to-text` sont les outils ; si vous avez du HTML et voulez du Markdown, `html2text` est exactement ce qu’il faut.

### Le texte brut est-il plus accessible que le HTML ?

Pas pour ce qu’une personne ouvre dans un navigateur. Un lecteur d’écran emploie la structure HTML — les titres pour naviguer, les listes pour compter les éléments, les cellules de tableau pour relier une valeur à sa colonne — et aplatir le document supprime tout cela. Le texte brut est la bonne sortie pour une chaîne de traitement qui prend une chaîne de caractères, comme un synthétiseur vocal ou un index de recherche, et non un substitut au balisage sémantique.
