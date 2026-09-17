---
title: "Convertir un CSV en tableau Markdown sans casser les données"
description: "Transformer un CSV en tableau Markdown et déjouer les pièges : virgules entre guillemets, guillemets doublés, sauts de ligne, barres verticales et BOM"
date: 2026-09-03
tag: Conversion
keywords: csv vers tableau markdown, convertir csv en markdown, convertisseur csv markdown, tsv vers tableau markdown, champ csv entre guillemets markdown, tableau markdown depuis un tableur, csv point-virgule vers markdown
---

### En bref

Convertir un CSV en tableau Markdown, c’est deux lignes de travail — une ligne d’en-tête, une ligne de séparation faite de tirets, et une ligne par enregistrement — et à peu près neuf façons de se tromper en silence. Les échecs viennent tous du même endroit : un CSV n’est pas un fichier avec des virgules dedans, c’est un format à guillemets doté de règles, et un convertisseur qui découpe sur les virgules produit un tableau qui a l’air correct et qui dit autre chose que le fichier. Utilisez un outil doté d’un vrai analyseur CSV, échappez les barres verticales en `\|` à la sortie, remplacez les sauts de ligne internes aux cellules par `<br>` parce qu’un tableau Markdown ne peut pas contenir de retour à la ligne, et ajoutez une ligne d’en-tête avant de convertir si votre fichier n’en a pas. Puis vérifiez une ligne difficile de la sortie plutôt que les trois premières.

La mécanique est triviale. C’est ce qui rend ce travail dangereux : parce que la sortie est toujours un tableau d’apparence plausible, rien ne vous prévient quand une valeur a glissé d’une colonne vers la gauche, quand un nom a perdu sa virgule, ou quand une ligne a discrètement perdu son dernier champ. Le tableau s’affiche. Les données sont fausses. Personne ne s’en aperçoit jusqu’à ce que quelqu’un lise un chiffre à voix haute en réunion.

L’essentiel des ennuis vient des tableurs. Un CSV écrit par un programme et lu par un programme a tendance à être propre, parce que les deux bouts ont implémenté les mêmes règles. Un CSV qu’une personne a exporté depuis Excel, Numbers ou un CRM contient des adresses avec des sauts de ligne dedans, des notes avec des guillemets, un premier intitulé de colonne auquel est accroché un octet invisible, et — selon l’endroit où la machine croit se trouver — des points-virgules là où vous attendiez des virgules.

Cet article, c’est la procédure et les pièges. La procédure prend une minute. Les pièges sont l’article, et ils sont dans l’ordre où ils mordent : d’abord les guillemets, parce qu’ils changent le sens même d’une ligne, puis l’échappement à la sortie, puis les problèmes au niveau du fichier qui empêchent la conversion de ressembler à un tableau.

## Comment convertir un CSV en tableau Markdown

Le format cible est fixe et réduit. Un tableau en GitHub Flavored Markdown est une ligne d’en-tête, une ligne de délimitation faite de tirets, et une ligne par enregistrement, les cellules étant séparées par des barres verticales :

```markdown
| id | name | role |
| --- | --- | --- |
| 1 | Ann Rowe | Ops |
| 2 | Li Wei | Sales |
```

Les barres verticales de début et de fin sont facultatives dans la spécification et valent tout de même la peine d’être écrites, parce qu’elles lèvent l’ambiguïté d’une cellule commençant par un espace et parce qu’elles se lisent mieux dans une comparaison. La ligne de délimitation n’est pas décorative : c’est elle qui indique à l’analyseur que le bloc au-dessus est un en-tête et non un paragraphe, et elle doit avoir le même nombre de cellules que l’en-tête. Trompez-vous là-dessus et vous avez un paragraphe plein de barres verticales. Le reste de ce que le format peut et ne peut pas faire est traité dans [l’article sur les tableaux Markdown eux-mêmes](/blog/markdown-tables-that-survive-conversion) ; celui-ci porte sur la façon d’amener vos lignes à cette forme sans en perdre aucune.

Voici toute la procédure.

1. **Ouvrez d’abord le fichier dans un éditeur de texte, pas dans un tableur.** Un tableur vous montrera sa propre interprétation du fichier, ce qui est précisément ce que vous cherchez à vérifier. Un éditeur de texte vous montre les octets : si le séparateur est une virgule, si les champs sont entre guillemets, s’il y a une ligne d’en-tête, et si un enregistrement s’étend sur plus d’une ligne. Trente secondes ici vous épargnent tout le reste.
2. **Confirmez le séparateur.** La virgule est la valeur par défaut, pas la règle. Si la première ligne est `id;name;role`, vous avez un fichier à points-virgules et tout outil fondé sur la virgule vous rendra une cellule par ligne.
3. **Confirmez qu’il y a une ligne d’en-tête.** Si la première ligne est une donnée, ajoutez une ligne d’en-tête avant de convertir. Un tableau Markdown ne peut pas exister sans en-tête, et toute réponse automatique à un en-tête manquant perd quelque chose.
4. **Convertissez avec quelque chose qui analyse plutôt que découpe.** Cela veut dire un lecteur CSV — un convertisseur côté navigateur, une bibliothèque, ou un outil en ligne de commande conçu pour les données tabulaires. Un `cut -d,` ou un `split(',')` est le mauvais instrument, et les dégâts qu’il cause sont invisibles dans la sortie.
5. **Vérifiez l’échappement à la sortie.** Les barres verticales dans les valeurs doivent devenir `\|`. Les sauts de ligne internes doivent devenir `<br>` ou un espace. Les guillemets doublés doivent s’être réduits à un seul.
6. **Regardez la ligne la plus difficile, pas la première.** Trouvez la ligne qui contient une virgule entre guillemets, une apostrophe, un guillemet ou un chemin, et lisez cette ligne dans la sortie face à la même ligne dans la source.

Pour rendre la sixième étape concrète, voici un petit fichier qui porte cinq des pièges d’un coup. Gardez-en un du même genre ; c’est le seul test qui compte.

```csv
id,name,role,notes
1,"Smith, John",Sales,"Joined 2019
Moved from Support"
2,"O""Brien, Ann",Ops,"Owns the a|b routing rule"
3,Li Wei,Support,"Said ""no"" twice"
```

Quatre enregistrements, pas cinq, parce que l’enregistrement 1 contient un retour à la ligne à l’intérieur d’un champ entre guillemets. Une conversion correcte produit ceci :

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | Smith, John | Sales | Joined 2019<br>Moved from Support |
| 2 | O"Brien, Ann | Ops | Owns the a\|b routing rule |
| 3 | Li Wei | Support | Said "no" twice |
```

Chaque différence entre cette sortie et la source est délibérée : les guillemets autour des champs ont disparu parce qu’ils étaient de la syntaxe, les guillemets doublés se sont réduits à un seul, le retour à la ligne est devenu `<br>`, et la barre verticale a été échappée. Rien n’a changé de colonne.

Un découpage naïf sur les virgules produit ceci à la place, et c’est la partie qui vaut qu’on la fixe du regard :

```markdown
| id | name | role | notes |
| --- | --- | --- | --- |
| 1 | "Smith | John" | Sales |
| Moved from Support" | | | |
| 2 | "O""Brien | Ann" | Ops |
| 3 | Li Wei | Support | "Said ""no"" twice" |
```

Le rôle de John est devenu son nom de famille. Le champ des notes a entièrement disparu de la ligne 1, parce que Markdown jette les cellules au-delà du nombre d’en-têtes et que `"Joined 2019` était la cinquième. La ligne de continuation est devenue une ligne à part entière. Ann a le même problème plus des guillemets doublés visibles. Seule la ligne 3 a survécu, et elle a survécu parce qu’elle était ennuyeuse. Le tableau s’affiche parfaitement.

## L’aide-mémoire : tous les pièges en un tableau

| Piège | Dans le CSV | Ce que fait un découpage naïf | Ce que fait une conversion correcte |
| --- | --- | --- | --- |
| Champ entre guillemets | `"Sales"` | Garde les guillemets comme caractères | Les retire ; c’était de la syntaxe |
| Virgule entre guillemets | `"Smith, John"` | Deux cellules ; la ligne gagne une colonne ; la dernière valeur est jetée | Une cellule contenant la virgule |
| Guillemet doublé | `"Said ""no"""` | Laisse `""no""` visible dans la cellule | Se réduit à `"no"` |
| Saut de ligne dans une cellule | un champ entre guillemets sur deux lignes | Coupe l’enregistrement en deux lignes malformées | Remplace le saut par `<br>` ou un espace |
| Barre verticale dans une valeur | une barre verticale nue dans un champ | Ajoute une colonne fantôme à cette ligne | L’échappe en `a\|b` |
| Pas de ligne d’en-tête | la première ligne est une donnée | Promeut des données en intitulés, en silence | Vous ajoutez une ligne d’en-tête avant de convertir |
| Séparateur point-virgule | `id;name;role` | Une cellule par ligne, la ligne entière dedans | Lit le fichier avec `;` comme séparateur |
| Séparateur tabulation | `id<TAB>name` | Une cellule par ligne | Le lit comme du TSV |
| BOM venu d’Excel | `EF BB BF` invisible avant `id` | S’accroche au premier intitulé ; les comparaisons échouent | Le retire, ou lit en `utf-8-sig` |
| Fins de ligne CRLF | chaque ligne finit par `\r\n` | Laisse un `\r` égaré sur le dernier champ de chaque ligne | Pris en charge par le lecteur ; rien de visible |
| Lignes irrégulières | une ligne plus courte que l’en-tête | Ligne courte complétée en silence, ligne longue tronquée | Pareil, mais on vous a prévenu, ou vous avez vérifié |
| Alignement | rien dans le fichier ne l’exprime | Toutes les colonnes alignées à gauche | Des deux-points dans la ligne de délimitation, choisis par vous |

Le motif qui traverse ce tableau mérite d’être nommé. Environ la moitié de ces échecs sont bruyants — un fichier à points-virgules se convertit en une seule colonne et vous le voyez tout de suite. L’autre moitié est silencieuse, et chaque échec silencieux met en jeu les guillemets. C’est pourquoi la vérification porte sur une ligne difficile plutôt que sur un coup d’œil à la sortie.

## Du symptôme à la cause : ce que vous voyez et ce qui l’a provoqué

Parcourez ce tableau quand une conversion a déjà mal tourné. Le symptôme est ce que vous avez remarqué ; la cause est ce qu’il faut corriger dans la source ou dans l’outil.

| Symptôme | Cause | Correction |
| --- | --- | --- |
| Chaque ligne est une seule cellule contenant toute la ligne | Le séparateur est un point-virgule ou une tabulation, et l’outil a supposé une virgule | Fixez le séparateur, ou prenez un outil qui le renifle |
| Une valeur est passée dans la colonne suivante, les valeurs ultérieures décalées à gauche | Une virgule à l’intérieur d’un champ entre guillemets a été traitée comme un séparateur | Utilisez un vrai analyseur CSV |
| La dernière valeur d’une ligne manque | Même cause : la ligne est devenue plus large que l’en-tête, et GFM jette les cellules en trop | Utilisez un vrai analyseur CSV |
| Des guillemets apparaissent autour des valeurs dans le tableau | Les guillemets ont été traités comme des caractères plutôt que comme de la syntaxe | Utilisez un vrai analyseur CSV |
| `""` apparaît dans une cellule | L’échappement par guillemet doublé n’a pas été réduit | Utilisez un vrai analyseur CSV |
| Une ligne apparaît deux fois, la seconde malformée et courte | Un champ entre guillemets contenait un retour à la ligne et l’enregistrement y a été coupé | Convertissez avec un analyseur qui lit les enregistrements multilignes |
| Deux phrases se sont collées sans espace | Un saut de ligne interne a été supprimé au lieu d’être remplacé | Remplacez par `<br>`, ou par un espace |
| `<br>` apparaît en texte littéral dans la sortie | Le Markdown est lu comme du texte brut, pas rendu en HTML | Utilisez un espace à la place, ou rendez le Markdown |
| Une ligne a une colonne de plus que les autres | Une barre verticale non échappée dans une valeur | Échappez en `\|` |
| Le premier intitulé de colonne ne correspond à rien de ce que vous lui comparez | Une marque d’ordre des octets y est accrochée | Lisez le fichier en `utf-8-sig`, ou retirez le BOM |
| Les caractères accentués sont du charabia | Le fichier n’est pas dans l’encodage supposé par le lecteur — souvent du Windows-1252 lu en UTF-8 | Convertissez l’encodage avant d’analyser |
| Tout le bloc se rend en paragraphe de barres verticales | La ligne de délimitation manque, est malformée, ou n’a pas le bon nombre de cellules | Corrigez la ligne de délimitation |
| Le tableau s’affiche mais l’en-tête est votre première ligne de données | Le fichier n’avait pas d’en-tête et l’outil a promu la première ligne | Ajoutez une ligne d’en-tête à la source |
| Un `\r` traîne à la fin de la dernière cellule de chaque ligne | Des fins de ligne CRLF découpées sur `\n` seulement | Utilisez un lecteur qui gère le CRLF |
| Les nombres affichent `0.4567` là où la feuille montrait `45.67%` | L’export a écrit la valeur, pas le format d’affichage | Corrigez l’export, ou la colonne, avant de convertir |

## Les guillemets : virgules, guillemets doublés et sauts de ligne

Tout ce qui suit dans cette section découle d’une seule règle de la RFC 4180 : un champ peut être entouré de guillemets doubles, et à l’intérieur de ces guillemets une virgule est une donnée, un saut de ligne est une donnée, et un guillemet double s’écrit avec deux guillemets doubles. Trois phrases. Chaque échec silencieux d’une conversion CSV est un outil qui n’en a pas implémenté une.

### Une virgule à l’intérieur d’un champ entre guillemets

`"Smith, John",Sales,2026` fait trois champs. Un analyseur lit le guillemet ouvrant, consomme tout jusqu’au guillemet fermant, et vous rend `Smith, John` comme une seule valeur. Un découpage sur les virgules vous en rend quatre, et la ligne est maintenant une cellule plus large que son en-tête.

C’est l’échec qui coûte des données plutôt que de l’allure. La règle des tableaux GFM veut qu’une ligne comptant plus de cellules que l’en-tête voie ses cellules en trop jetées : la ligne élargie ne produit donc aucune erreur, aucun avertissement et aucun débordement — elle perd sa dernière valeur et décale d’une colonne vers la gauche tout ce qui suit le champ fautif. Les noms, les adresses, les intitulés de poste et les notes en texte libre sont les endroits où cela vit. Si une colonne peut contenir une virgule, le piège la concerne.

### Un guillemet doublé vaut un guillemet

À l’intérieur d’un champ entre guillemets, `""` est un `"` littéral. Donc `"She said ""no""."` est un champ unique qui se lit : She said "no". Un outil qui retire les guillemets par motif plutôt que par analyse laisse les paires en place et vous obtenez `She said ""no""` dans la cellule.

Celui-ci est cosmétique jusqu’au moment où il cesse de l’être. Dans une colonne de prose, des guillemets doublés sont laids. Dans une colonne de mesures en pouces, d’exemples de code ou de fragments de JSON, ils changent la valeur. Une cellule contenant `{"id": 1}` qui arrive en `{""id"": 1}` n’est plus du JSON valide, et si quelqu’un la recopie plus tard depuis votre document, il y passera dix minutes.

### Un saut de ligne à l’intérieur d’une cellule

C’est le piège sans réponse propre, et il vaut mieux le comprendre que le contourner.

La RFC 4180 autorise un retour à la ligne dans un champ entre guillemets, et les tableurs en produisent sans arrêt, parce qu’Alt+Entrée dans une cellule est la façon dont les gens écrivent des blocs d’adresse et des notes. Un tableau Markdown n’a aucun moyen de représenter cela. Le format est fondé sur la ligne : une ligne par enregistrement, aucune syntaxe de continuation, aucun échappement pour un retour à la ligne. Quoi que fasse le convertisseur ici, il choisit entre deux mensonges.

```csv
id,address
1,"12 Mill Lane
Bristol
BS1 4AA"
```

Les trois façons dont cela peut atterrir dans un tableau Markdown :

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane<br>Bristol<br>BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane Bristol BS1 4AA |
```

```markdown
| id | address |
| --- | --- |
| 1 | 12 Mill Lane |
| Bristol | |
| BS1 4AA" | |
```

La première garde la structure et met une balise HTML dans votre Markdown. La deuxième garde le Markdown propre et perd la structure, et si l’outil recolle sans espace vous obtenez `12 Mill LaneBristol`. La troisième est ce que fait un découpeur et elle est tout simplement cassée. Préférez la première quand le Markdown sera rendu en HTML, ce qui est le cas habituel, et la deuxième quand il ne le sera pas — un README en texte brut lu dans un terminal, un message de commit, un message de discussion dans un client qui ne rend pas le HTML dans les tableaux. Que Markdown n’ait pas de meilleure option à l’intérieur d’un tableau découle de [la façon dont les sauts de ligne fonctionnent en Markdown en général](/blog/markdown-line-breaks-and-lists) : le saut par deux espaces et le saut par barre oblique inverse sont des constructions en ligne, et une ligne de tableau s’arrête au retour à la ligne quoi qu’il arrive.

Si vos données comportent des sauts de ligne dans une colonne et que la structure compte, la réponse honnête est parfois que cette colonne ne devrait pas être dans le tableau. Déplacez-la en dessous sous forme de liste de définitions, ou renvoyez à la source par un lien.

## L’échappement à la sortie : barres verticales, barres obliques inverses et alignement

Analyser correctement le CSV rend les valeurs justes. Écrire correctement le Markdown les garde justes. Trois choses sont à faire à la sortie, et l’une d’elles est le bogue le plus fréquent des convertisseurs faits maison.

### La barre verticale

Le CSV se moque des barres verticales. Markdown y tient énormément : un `|` non échappé termine la cellule où qu’il apparaisse. Il doit s’écrire `\|`.

Le détail que les gens manquent, c’est que les backticks ne le protègent pas. Une barre verticale dans un segment de code en ligne à l’intérieur d’une cellule de tableau termine quand même la cellule — le tableau est découpé en cellules avant que la syntaxe en ligne ne soit examinée, donc `` `a|b` `` devient deux cellules, la première contenant un segment de code non terminé. La spécification GFM est explicite : l’échappement est requis même à l’intérieur d’autres segments en ligne. Il n’existe aucun autre mécanisme.

```csv
pattern,meaning
"^(a|b)$","a or b, anchored"
```

```markdown
| pattern | meaning |
| --- | --- |
| `^(a\|b)$` | a or b, anchored |
```

Où cela apparaît : les chemins de fichiers dans les exemples de shell, les expressions régulières, les enchaînements de commandes, les options énumérées dans une colonne de documentation, et toute colonne contenant `yes|no|maybe`. Les convertisseurs écrits et testés sur des noms et des nombres ne le rencontrent jamais. Si vous évaluez un outil, mettez délibérément une barre verticale dans une cellule de test.

### La barre oblique inverse

Moins fréquente et bonne à connaître. Une valeur se terminant par une barre oblique inverse, ou contenant une séquence comme `\n` en texte littéral, peut interagir avec l’échappement propre à Markdown — `\|` est une barre verticale échappée, donc une valeur qui se termine légitimement par `...\` suivie d’un séparateur en barre verticale produit quelque chose d’ambigu. Un rédacteur soigneux échappe les barres obliques inverses en `\\` dans le contenu des cellules. La plupart des convertisseurs ne le font pas, et la plupart des données ne le déclenchent jamais. Ne le vérifiez que si vos colonnes contiennent des chemins Windows ou du code.

### Les deux-points d’alignement

Rien dans un CSV n’exprime l’alignement. La colonne de nombres alignée à droite d’un tableur est une propriété d’affichage du tableur, et elle ne survit pas à l’export, encore moins à la conversion. Markdown vous donne trois options par colonne, fixées par des deux-points dans la ligne de délimitation, et les appliquer est une décision que vous prenez après la conversion :

```markdown
| Item | Qty | Price |
| :--- | ---: | ---: |
| Widget | 12 | 4.50 |
| Flange | 3 | 12.00 |
```

`:---` c’est à gauche, `---:` à droite, `:---:` au centre, et un `---` nu laisse cela au moteur de rendu, ce qui en pratique veut dire à gauche. Alignez à droite les colonnes numériques ; c’est la seule retouche manuelle qui améliore de façon fiable un tableau converti, parce qu’une colonne de chiffres alignés à droite se compare à l’œil et une colonne alignée à gauche non. Notez que beaucoup de convertisseurs émettent des tirets nus et vous laissent cela, et que les deux-points sont la seule mise en forme de colonne qu’offre le format — pas de largeurs, pas de couleurs, pas d’alignement par cellule.

### Le remplissage, et pourquoi il ne change rien

Certains outils complètent chaque cellule d’espaces pour que les barres verticales s’alignent dans la source. Cela n’a strictement aucun effet sur le rendu ; c’est uniquement pour celui qui lit le Markdown en texte. Le remplissage rend un tableau large agréable à lire dans un éditeur et horrible à comparer, parce que changer une valeur réécrit toutes les lignes du bloc. Pour un tableau qui vit dans un dépôt et qui est édité, mieux vaut sans remplissage. Pour un tableau que quelqu’un lira en texte brut, remplissez-le.

## La ligne d’en-tête, le séparateur et les octets que vous ne voyez pas

Ces trois-là sont des problèmes au niveau du fichier. Ils sont généralement bruyants, et ils se règlent tous avant la conversion plutôt qu’après.

### Un fichier sans ligne d’en-tête

Les CSV engendrés par des machines n’ont fréquemment pas d’en-tête : un export de journal, un vidage de base de données, un flux de capteur, une réponse paginée d’API écrite directement sur le disque. Un tableau Markdown ne peut pas exister sans en-tête, parce que c’est la ligne de délimitation en dessous qui identifie le bloc comme un tableau.

Chaque convertisseur fait donc l’une de ces trois choses, et aucune n’est bonne :

| Comportement | Résultat |
| --- | --- |
| Promouvoir la première ligne de données | Vous perdez les données de cette ligne, et les intitulés n’ont aucun sens |
| Engendrer des noms de remplacement | `a, b, c` ou `Colonne 1, Colonne 2` — le tableau est lisible et ne dit rien |
| Refuser de convertir | Honnête, et rare |

La plupart des outils prennent discrètement la première option, et c’est pourquoi un fichier de journal converti a si souvent un horodatage à la place des noms de colonnes. La correction tient en une ligne dans un éditeur de texte : ajoutez un en-tête. Vous savez ce que sont les colonnes, et aucune réponse automatique à ce problème ne produit un tableau que quelqu’un puisse lire six mois plus tard.

### Points-virgules, tabulations et autres séparateurs

Un fichier `.csv` n’est pas nécessairement séparé par des virgules. Dans les régions où la virgule est le séparateur décimal, un tableur qui exporte en CSV utilise le séparateur de liste des paramètres régionaux du système, qui est couramment un point-virgule — et le fichier porte quand même l’extension `.csv`. C’est la cause la plus fréquente du « le convertisseur a produit une seule colonne ».

```csv
id;name;price
1;Widget;4,50
```

Notez le second problème dans ce fichier : `4,50` vaut quatre virgule cinq, écrit dans une région qui utilise la virgule comme séparateur décimal. Convertir le séparateur ne convertit pas les nombres. Si ces valeurs vont dans un tableau que des gens liront, décidez s’il faut d’abord les normaliser, parce qu’un tableau mêlant `4,50` et `12.00` est pire que l’un ou l’autre.

Les valeurs séparées par des tabulations sont le même format avec un autre séparateur, et elles se traitent plus facilement en toute sécurité pour une raison : les tabulations n’apparaissent presque jamais dans les valeurs, donc les problèmes de guillemets s’évaporent en grande partie. C’est aussi pourquoi copier une plage depuis un tableur et la coller fonctionne souvent mieux qu’exporter un CSV — le presse-papiers transporte du texte séparé par des tabulations.

| Séparateur | D’où il vient | Que faire |
| --- | --- | --- |
| Virgule | La valeur par défaut, et la plupart des exports programmatiques | Rien |
| Point-virgule | Les exports de tableurs dans les régions à décimale virgule | Fixez le séparateur ; vérifiez aussi le séparateur décimal |
| Tabulation | `.tsv`, `.tab`, et tout ce qui est collé depuis un tableur | Lisez-le comme du TSV |
| Barre verticale | Certains exports de bases de données et de gros systèmes | Fixez le séparateur, et rappelez-vous que chaque valeur doit désormais être échappée à la sortie |
| Largeur fixe | Les rapports d’anciens systèmes | Pas du CSV du tout ; exige d’abord un analyseur par positions de colonnes |

Une source séparée par des barres verticales mérite un instant de réflexion, parce que le séparateur et la syntaxe de sortie sont désormais le même caractère. Analysez-la comme séparée par des barres verticales, puis échappez toutes les barres verticales qui se trouvaient dans les valeurs. Un outil qui la lit comme du CSV produira un tableau d’apparence correcte et faux sur chaque ligne dont les données contenaient une barre verticale.

### Les octets qui précèdent le premier champ

Deux choses invisibles voyagent avec les fichiers écrits sous Windows ou exportés depuis Excel.

Une **marque d’ordre des octets** — les octets `EF BB BF` — peut se trouver tout au début d’un fichier UTF-8. Excel en écrit une quand vous choisissez son format d’enregistrement `CSV UTF-8`, et elle est là au bénéfice des programmes qui devraient sinon deviner l’encodage. Votre lecteur CSV la retirera peut-être, peut-être pas. S’il ne le fait pas, la marque s’accroche à votre premier intitulé de colonne, où elle est invisible dans tous les éditeurs et casse toute comparaison portant sur cet intitulé. Vous obtenez un intitulé qui ressemble à `id`, qui n’est pas égal à `id`, et qu’on ne peut pas expliquer en le regardant.

```python
# Reads the BOM and discards it if present.
with open('data.csv', newline='', encoding='utf-8-sig') as handle:
    rows = list(csv.reader(handle))
```

```bash
# Strips a UTF-8 BOM from the first line only.
sed '1s/^\xEF\xBB\xBF//' data.csv > clean.csv
```

Les **fins de ligne CRLF** sont l’autre. La RFC 4180 spécifie en réalité le CRLF comme séparateur d’enregistrements : un CSV bien formé en comporte donc, et un lecteur doit s’en accommoder. Un outil qui découpe sur `\n` seul laisse un retour chariot collé au dernier champ de chaque ligne, ce qui reste invisible jusqu’à ce que vous compariez une valeur ou la colliez quelque part qui montre les caractères de contrôle.

L’encodage est le troisième problème au niveau du fichier, et le plus bruyant des trois. Un CSV ne porte aucune déclaration de son propre encodage. Un fichier enregistré en Windows-1252 et lu en UTF-8 vous donne du charabia sur chaque nom accentué ; lu en UTF-8 alors qu’il est en UTF-16, il peut ne pas s’analyser du tout. Convertissez le fichier avant de convertir le tableau :

```bash
iconv -f WINDOWS-1252 -t UTF-8 data.csv > data-utf8.csv
```

Aucun de ces trois points n’est difficile. Tous les trois sont invisibles, et tous les trois sont pris en charge par un lecteur digne de ce nom et par aucune des lignes de commande bricolées vers lesquelles on se tourne d’abord.

## Là où un tableau Markdown est la mauvaise réponse

La section honnête. Une partie de ce que contient un tableur n’a aucun équivalent en Markdown, et aucun convertisseur n’y remédie, parce que la limite est dans le format et non dans l’outillage. Savoir lesquelles vous évite de chercher un meilleur outil.

**Les cellules fusionnées.** Il n’y a ni colspan ni rowspan. Un en-tête qui couvre trois colonnes dans la feuille doit devenir un intitulé avec deux voisins vides, ou trois intitulés répétés. Si la source s’appuie sur des cellules fusionnées pour exprimer sa structure, le tableau a besoin d’être repensé avant d’être converti.

**Les en-têtes imbriqués ou groupés.** Deux lignes d’en-tête — un groupe au-dessus, des sous-colonnes en dessous — est une forme courante de tableur et impossible en Markdown, qui a exactement une ligne d’en-tête. Aplatissez-la en noms composés comme `2025 T1` et `2025 T2`, ou passez au HTML brut, auquel cas vous n’écrivez plus un tableau Markdown.

**Tout ce qui est large.** Les tableaux Markdown ne se replient pas et ne défilent pas d’eux-mêmes. Douze colonnes de prose deviennent un tableau plus large que la page, et ce qui se passe ensuite appartient à ce qui le rend : un débordement, un écrasement, ou une barre de défilement si le HTML environnant en fournit une. Supprimez des colonnes avant de convertir, ou transposez pour que les lignes deviennent les colonnes, ou acceptez que ce sera lu sur un grand écran.

**Tout ce qui est long.** Un tableau de mille lignes dans un document n’est pas un tableau, c’est un vidage de données avec des bordures. Il n’y a ni pagination ni tri. Au-delà d’une cinquantaine de lignes, la sortie utile est un tableau de synthèse plus un lien vers le CSV.

**Tout ce qui est interactif.** Pas de tri, pas de filtrage, pas de ligne de totaux qui se recalcule, pas de mise en forme conditionnelle. Si un lecteur a besoin d’interroger les chiffres plutôt que de les lire, le tableau est le mauvais objet.

**Les formules et les formats.** Ceux-là ont déjà disparu avant que le convertisseur ne voie le fichier. Un export CSV contient des valeurs, et les symboles monétaires, les séparateurs de milliers, les pourcentages et les formats de date sont des propriétés d’affichage que l’exportateur a écrites ou non. Si le tableau montre `0.4567` là où la feuille montrait `45.67%`, c’est l’export qui l’a fait.

Il y a aussi des coûts propres aux voies elles-mêmes. Un convertisseur côté navigateur fait le travail sur votre propre machine, ce qui explique que rien ne soit téléversé, et ce même fait implique qu’un très gros fichier est limité par la machine et par l’onglet : TransformPipe plafonne une conversion à 10 Mo, et un document conservé derrière un lien partageable à 4 Mo, parce que la fonction qui le stocke refuse un corps de requête plus gros. Un outil en ligne de commande n’a pas ce plafond et exige bien une installation et quelqu’un qui se souvienne des options. Un greffon de tableur est commode et lie le travail à l’application. Aucun de ces points n’est un défaut ; ce sont les contours de chaque voie, et la comparaison des voies elles-mêmes fait l’objet du [panorama des convertisseurs CSV vers Markdown](/blog/best-csv-to-markdown-converters).

Un coût de plus mérite d’être nommé : le dialecte. Les tableaux ne sont pas dans CommonMark. Ils sont une extension du GitHub Flavored Markdown : un moteur de rendu strictement conforme à CommonMark affiche donc votre tableau converti en paragraphe plein de barres verticales. Avant de convertir cent lignes, confirmez que ce qui rendra le résultat sait faire des tableaux — [les dialectes diffèrent exactement de cette façon](/blog/commonmark-gfm-and-the-flavours), et c’est la première chose à vérifier plutôt que la dernière.

## Comment choisir une voie

1. **Partez de la question de savoir si les lignes peuvent quitter votre machine.** Des données publiques rendent la question sans objet. Des noms, des salaires, des identifiants de patients ou des chiffres non publiés en font la seule question, et cela élimine tout convertisseur hébergé qui téléverse. La conversion côté navigateur et les outils locaux en ligne de commande sont les deux réponses, et la différence entre eux n’apparaît dans aucune liste de fonctionnalités.
2. **Comptez combien de fois vous ferez cela.** Une fois, c’est un dépôt de fichier et un collage. Chaque semaine, c’est un script, et un script veut dire un outil en ligne de commande ou un appel de bibliothèque — parce que, dans un processus hebdomadaire, la partie qu’on oublie est toujours la personne censée ouvrir un onglet de navigateur.
3. **Vérifiez si vous devez aussi remodeler et pas seulement convertir.** Si la réponse comporte le choix de colonnes, le filtrage de lignes ou un tri, prenez un outil qui travaille les données et émet du Markdown à la fin. Supprimer des lignes à la main d’un tableau Markdown terminé est la voie la plus lente possible, et celle qui introduit des erreurs de recopie.
4. **Testez avec votre pire ligne, pas avec un échantillon.** Prenez la ligne qui contient la virgule entre guillemets, le guillemet et la barre verticale, convertissez-la, et lisez la sortie face à la source. Un outil qui survit à cette ligne survivra au fichier ; un outil qui y échoue échoue en silence, et tout le reste à son sujet n’a aucune importance.
5. **Tranchez la question des sauts de ligne internes avant de convertir, pas après.** Si la sortie sera rendue en HTML, `<br>` est le bon choix. Si elle sera lue en texte brut, un espace est le bon choix. L’outil a déjà choisi pour vous : découvrez lequel et prenez un outil qui soit d’accord, parce que corriger cela après coup veut dire éditer chaque cellule concernée.
6. **Regardez le fichier pour y trouver une ligne d’en-tête avant que l’outil ne décide.** Dix secondes dans un éditeur de texte, une ligne tapée s’il en manque une. C’est le seul point de cette liste qui soit gratuit.

## Conclusion

La conversion elle-même, c’est un en-tête, une ligne de tirets et une ligne par enregistrement : vous pourriez la faire à la main. Si les lignes sont encore dans un tableur plutôt que dans un fichier, [commencez plutôt par là](/blog/convert-excel-to-markdown-table). Ce que vous ne pouvez pas faire à la main — de façon fiable, à n’importe quel volume — c’est honorer les règles de mise entre guillemets, et c’est de là que vient chaque échec silencieux. Tout ce qui lit le fichier comme un CSV plutôt que comme du texte avec des virgules dedans traitera correctement les virgules, les guillemets doublés et les enregistrements multilignes ; il ne lui restera plus qu’à échapper les barres verticales et à décider quoi faire des retours à la ligne dans les cellules. Si vous voulez cela fait dans le navigateur sans rien téléverser, [la conversion CSV vers tableau Markdown de TransformPipe](/csv-to-markdown) fait l’analyse RFC 4180, échappe les barres verticales, transforme les sauts de ligne internes en `<br>` et gère le BOM, gratuitement et sans installation. Si vous le voulez dans un script, utilisez un outil conçu pour les données tabulaires. Dans les deux cas, gardez un fichier de test de quatre lignes contenant une virgule entre guillemets, un guillemet doublé, un retour à la ligne intégré et une barre verticale, et faites-y passer tout nouvel outil avant de lui confier de vraies lignes.

## FAQ

### Comment convertir un CSV en tableau Markdown ?

Écrivez les noms de colonnes en une ligne d’en-tête séparée par des barres verticales, ajoutez une ligne de délimitation de cellules `| --- |` avec une cellule par colonne, puis écrivez une ligne par enregistrement avec les valeurs séparées par des barres verticales. Faites-le avec un outil qui analyse vraiment le CSV au lieu de découper sur les virgules, et échappez en `\|` toute barre verticale présente dans les valeurs.

### Pourquoi mon CSV s’est-il converti en une seule colonne ?

Parce que le fichier n’est pas séparé par des virgules. Les exports de tableurs dans les régions qui utilisent la virgule comme séparateur décimal sont couramment séparés par des points-virgules tout en s’appelant `.csv`, et les fichiers TSV sont séparés par des tabulations. Ouvrez la première ligne dans un éditeur de texte, regardez ce qui sépare les intitulés, et dites-le au convertisseur.

### Une cellule de tableau Markdown peut-elle contenir un saut de ligne ?

Non. Le format est d’une ligne par enregistrement sans syntaxe de continuation : un vrai retour à la ligne termine donc la ligne. Un champ CSV contenant un saut de ligne doit devenir `<br>`, qui se rend en saut une fois le Markdown transformé en HTML, ou être aplati en espace. Le convertisseur choisit l’un des deux : découvrez lequel.

### Qu’arrive-t-il à une virgule à l’intérieur d’un champ entre guillemets ?

Avec un vrai analyseur, rien : les guillemets sont consommés comme de la syntaxe et la virgule reste dans la cellule. Avec un découpage sur les virgules, le champ devient deux cellules, la ligne devient plus large que l’en-tête, et comme Markdown jette les cellules au-delà du nombre d’en-têtes, la valeur en fin de ligne disparaît sans le moindre avertissement.

### Comment mettre une barre verticale dans une cellule de tableau Markdown ?

Échappez-la en `\|`. C’est le seul mécanisme, et il s’applique aussi à l’intérieur des segments de code en ligne : les backticks ne protègent pas une barre verticale, parce que la ligne est découpée en cellules avant que la syntaxe en ligne ne soit analysée. Un convertisseur qui n’échappe pas les barres verticales ajoutera une colonne fantôme à chaque ligne qui en contient une.

### Mon CSV n’a pas de ligne d’en-tête. Et maintenant ?

Ajoutez-en une avant de convertir. Un tableau Markdown ne peut pas exister sans en-tête : un convertisseur va donc soit promouvoir votre première ligne de données — en la perdant — soit inventer des noms de remplacement comme `a, b, c`. Vous savez ce que contiennent les colonnes ; taper une ligne est la seule version de ce problème qui produise un tableau lisible plus tard.

### Pourquoi y a-t-il un caractère étrange avant mon premier intitulé de colonne ?

Une marque d’ordre des octets, écrite en tête de fichier par l’export `CSV UTF-8` d’Excel et par quelques autres outils Windows. Elle est invisible dans les éditeurs et s’accroche au premier intitulé : les comparaisons portant sur cet intitulé échouent donc sans raison apparente. Lisez le fichier avec un encodage qui la retire, comme `utf-8-sig` en Python, ou supprimez les trois premiers octets.

### La source d’un tableau Markdown doit-elle avoir les barres verticales alignées ?

Non. Compléter les cellules d’espaces pour aligner les barres verticales sert uniquement à celui qui lit le Markdown en texte ; le rendu est identique dans les deux cas. Le remplissage aide à la lecture et nuit aux comparaisons, puisque modifier une valeur réécrit toutes les lignes du bloc : sans remplissage est donc généralement préférable pour un tableau qui vit dans un dépôt.
