---
title: "Des tableaux Markdown qui survivent à la conversion : toutes les façons d’en casser un"
description: "Pourquoi un tableau Markdown ne s’affiche pas : ligne de séparation, alignement, lignes vides, barres échappées, GFM contre CommonMark, et un tableau des symptômes"
date: 2026-08-29
tag: Syntaxe
keywords: tableau markdown, syntaxe tableau markdown, tableau markdown en html, alignement tableau markdown, tableau markdown ne s’affiche pas, saut de ligne tableau markdown, tableau markdown trop large
---

### En bref

Un tableau Markdown, c’est une ligne d’en-tête, une ligne de séparation faite de tirets, et autant de lignes de données que vous voulez — et toute l’astuce tient dans la ligne de séparation. Supprimez-la, ou laissez son nombre de cellules diverger de celui de l’en-tête, et il n’y a plus de tableau du tout : vous obtenez un paragraphe plein de barres verticales, sans un mot d’avertissement. Les tableaux ne font pas non plus partie de CommonMark ; ils sont arrivés avec GitHub Flavored Markdown, et un analyseur strictement conforme se comporte donc correctement lorsqu’il refuse le vôtre. Laissez une ligne vide au-dessus et en dessous du bloc, échappez toute barre verticale littérale en `\|`, et sortez le `<br>` quand une cellule réclame une seconde ligne, car une ligne de tableau s’arrête là où la ligne s’arrête.

Le tableau est la partie d’un document qui a le plus de chances d’arriver cassée. Un titre, on a du mal à le rater. Un mot en gras a ses astérisques ou ne les a pas. Un tableau, lui, est une grille tenue par de la ponctuation, et un seul caractère de travers quelque part dans le bloc ne produit pas un tableau légèrement faux — il ne produit aucun tableau, parce que l’analyseur cesse de reconnaître la forme et traite l’ensemble comme de la prose.

C’est cette manière d’échouer qui rend les tableaux exaspérants. Pas d’erreur, pas d’avertissement, pas de grille à moitié dessinée. Vous récupérez cinq lignes de texte parsemées de barres verticales, posées là où se trouvait votre tableau, et rien dans la sortie ne vous dit laquelle des cinq posait problème. Dans votre éditeur, le fichier a toujours l’air correct, puisque votre éditeur vous montre la source.

La bonne nouvelle, c’est que les façons d’échouer sont en nombre fini. Presque tout tableau Markdown cassé relève d’une dizaine de causes, chacune avec un symptôme reconnaissable. Cette page les passe toutes en revue : ce qu’est la syntaxe, à quoi sert réellement chaque partie, ce qui se produit quand elle est fausse, et ce que coûte la correction. Si vous avez un tableau cassé sous les yeux à l’instant même, commencez par le tableau des symptômes, deux sections plus bas.

## Ce qu’est vraiment un tableau Markdown

Trois parties, dans cet ordre, sur des lignes consécutives :

```markdown
| Flag | Long form | Takes a value |
| --- | --- | --- |
| `-o` | `--output` | yes |
| `-q` | `--quiet` | no |
```

La première ligne est la ligne d’en-tête. La deuxième est la ligne de séparation — que l’on appelle parfois ligne de délimitation — et c’est elle qui fait de ce bloc un tableau plutôt qu’un paragraphe. Le reste, ce sont les lignes de données. Le bloc s’achève à la première ligne vide, ou à la première ligne qui ouvre une autre construction de niveau bloc, un titre ou une clôture de code par exemple.

Converti en HTML, cela donne à peu près ceci :

```html
<table>
<thead>
<tr><th>Flag</th><th>Long form</th><th>Takes a value</th></tr>
</thead>
<tbody>
<tr><td><code>-o</code></td><td><code>--output</code></td><td>yes</td></tr>
<tr><td><code>-q</code></td><td><code>--quiet</code></td><td>no</td></tr>
</tbody>
</table>
```

Deux choses découlent de cette sortie, et toutes deux expliquent bien des ennuis ultérieurs. D’abord, il y a toujours exactement une ligne d’en-tête, enveloppée dans `<thead>`. Markdown n’a pas de syntaxe pour un tableau sans en-tête, ni pour deux lignes d’en-tête. Ensuite, chaque cellule est un `<th>` ou un `<td>` contenant du contenu en ligne. La syntaxe n’offre aucun mécanisme pour une cellule qui s’étend sur deux colonnes, une cellule qui s’étend sur deux lignes, un tableau imbriqué, ou une cellule qui abriterait un paragraphe et une liste.

À savoir avant d’aller plus loin : l’analyseur cherche une forme, il n’en répare pas une. Si les deux premières lignes ne s’accordent pas sur le nombre de cellules qu’elles portent, le bloc ne devient jamais un tableau, et chacune de ses lignes ressort sous forme de texte. Cette seule règle explique davantage de tableaux cassés que tout le reste de cette page réuni.

## Un tableau Markdown qui ne s’affiche pas : du symptôme à la cause

Repérez le symptôme, puis lisez la section vers laquelle il vous renvoie.

| Symptôme dans la sortie | C’est presque toujours parce que | Correction |
| --- | --- | --- |
| Tout le tableau forme un paragraphe de barres verticales | Pas de ligne de séparation, ou une ligne de séparation dont le nombre de cellules diffère de l’en-tête | Comptez les cellules dans les deux lignes ; elles doivent correspondre exactement |
| Tout le tableau forme un paragraphe, et les tirets ont une drôle d’allure | Un éditeur a transformé `---` en tiret cadratin, ou les barres sont des `｜` pleine chasse venues d’une méthode de saisie | Retapez la ligne de séparation avec de simples traits d’union et des barres ASCII |
| La ligne d’en-tête est collée au paragraphe qui la précède | Pas de ligne vide entre la prose et le tableau | Une ligne vide avant le tableau, et une après |
| Le tableau s’affiche, mais une colonne manque | La ligne de séparation a moins de cellules que le contenu de l’en-tête ne le laisse croire | Comptez les tirets, pas les intitulés |
| Une ligne a une cellule coupée en deux, et sa dernière valeur a disparu | Une `\|` non échappée dans une valeur de cellule | Écrivez-la `\|`, y compris entre accents graves |
| Une cellule est vide alors que la source contient manifestement du texte | Cette ligne avait plus de cellules que l’en-tête, et le surplus a été jeté | Alignez le nombre de cellules, ou échappez la barre égarée |
| Le tableau s’affiche comme un bloc de code | Le bloc est indenté de quatre espaces ou plus | Ramenez à zéro, ou à la colonne de contenu de l’élément de liste |
| Le tableau s’affiche partout sauf dans un outil | Cet outil applique CommonMark sans l’extension des tableaux | Choisissez un analyseur GFM, ou acceptez le repli |
| Deux phrases d’une cellule se sont collées l’une à l’autre | Un `<br>` a été retiré par un assainisseur, ou n’a jamais été là | Vérifiez la liste d’autorisation de l’assainisseur ; il n’y a pas d’autre façon de casser une ligne |
| Une liste à puces dans une cellule est sortie en tirets littéraux | Les cellules ne portent que du contenu en ligne | Restructurez : le tableau est le résumé, le détail va dessous |
| L’alignement est ignoré | Des deux-points du mauvais côté des tirets, ou une feuille de style qui prend le dessus | `:---`, `:---:`, `---:` — les deux-points dans la cellule, contre les tirets |

Deux de ces lignes méritent qu’on insiste, parce que ce sont celles que l’on regarde sans les voir. Une ligne de séparation mal comptée et une barre verticale non échappée produisent toutes deux une sortie qui ressemble à un problème de mise en forme et qui est en réalité un problème de comptage.

## L’aide-mémoire : chaque partie d’un tableau, et ce qu’elle coûte

| Partie | À quoi elle sert | Ce qu’elle fait | Prix |
| --- | --- | --- | --- |
| Ligne d’en-tête | Nommer les colonnes | Devient un `<thead>`, une ligne de `<th>` | Obligatoire ; le tableau sans en-tête n’existe pas |
| Ligne de séparation | Signaler à l’analyseur qu’il s’agit d’un tableau | Fixe le nombre de colonnes pour tout le bloc | Une ligne, et deux comptages de colonnes |
| Tirets | Remplir les cellules de séparation | Un seul `-` par cellule est valide ; `---` est la convention | Rien ; la longueur est cosmétique |
| Deux-points d’alignement | Aligner une colonne à gauche, au centre ou à droite | Émet un attribut `align` ou un style `text-align` par cellule | Un caractère par colonne, et par colonne seulement |
| Barres extérieures | Encadrer la ligne | Facultatives sur chaque ligne, sauf dans un tableau à une colonne | Deux caractères par ligne, et une lisibilité bien meilleure |
| `\|` | Mettre une barre verticale littérale dans une cellule | Échappe le délimiteur, y compris dans le code en ligne | Une barre oblique inverse, et une source un peu plus bruyante |
| `<br>` | Casser une ligne à l’intérieur d’une cellule | Du HTML en ligne, que GFM laisse passer | Une dépendance envers ce qui assainit votre HTML |
| Ligne vide avant et après | Marquer les limites du bloc | Empêche l’en-tête de rejoindre le paragraphe précédent | Deux lignes vides, contre de la portabilité |
| Indentation | Placer un tableau dans un élément de liste | De zéro à trois espaces, c’est bon ; quatre font un bloc de code | De l’attention, chaque fois que le tableau est imbriqué |
| Nombre de cellules d’une ligne de données | Remplir la grille | Les lignes courtes sont complétées, les longues sont tronquées | Le silence quand c’est faux |
| Contenu en ligne uniquement | Garder les cellules analysables | Texte, emphase, code en ligne, liens, images | Ni listes, ni paragraphes, ni clôtures, ni imbrication |
| Conteneur à défilement | Survivre à une page étroite | Un `<div>` auquel votre feuille de style donne `overflow-x: auto` | Des lignes vides dans le conteneur, et la maîtrise du CSS |

Tout ce qui suit développe une ligne de ce tableau.

## Les parties, une par une

### La ligne de séparation — la ligne qui fait le tableau

C’est la ligne porteuse. `| --- | --- | --- |` n’est pas un ornement entre l’en-tête et le corps ; c’est la déclaration qui transforme trois lignes de barres verticales en grille. Supprimez-la et l’analyseur n’a plus aucune raison de voir dans ces lignes autre chose qu’un paragraphe, ce qui est exactement ce qui ressort de l’autre côté.

| Avantages | Inconvénients |
| --- | --- |
| Une seule ligne fait toute la différence entre de la prose et un tableau | Son nombre de cellules doit correspondre exactement à celui de l’en-tête |
| Un tiret par cellule suffit ; personne ne les compte | Rien ne vous prévient quand les comptes divergent |
| Elle porte l’alignement, la mise en forme ne demande donc pas de syntaxe supplémentaire | La ponctuation automatique d’un éditeur peut la détruire sans que cela se voie |
| C’est la chose la plus rapide à vérifier quand un tableau casse | Elle doit être la deuxième ligne — pas la troisième, et pas après un commentaire |

**Prix :** une ligne, et l’habitude de compter deux fois les colonnes avant d’accuser le moteur de rendu.

**Détails techniques et fonctions**

- Chaque cellule de séparation peut contenir des tirets, un deux-points initial facultatif, un deux-points final facultatif, et des espaces. Rien d’autre. Une lettre ou un point égarés et le bloc redevient un paragraphe.
- Le nombre de cellules de la ligne de séparation doit égaler celui de la ligne d’en-tête. C’est l’unique règle stricte de toute la construction.
- Une fois ces deux lignes d’accord, ce nombre de colonnes vaut pour toutes les lignes de données qui suivent.
- `-`, `--` et `-----------` sont identiques pour l’analyseur. Aligner les tirets sur la cellule la plus large, c’est pour l’humain qui éditera le fichier ensuite.
- Les traitements de texte et certains éditeurs convertissent `---` en tiret cadratin au fil de la frappe. Un tiret cadratin est un autre caractère : la ligne de séparation cesse alors d’en être une.

**Pour qui ?** Pour tout le monde, sur chaque tableau, en deuxième ligne. Si un tableau ne s’affiche pas, c’est là qu’il faut regarder en premier, et la plupart du temps vous pouvez vous arrêter là.

### Les deux-points d’alignement — la seule mise en forme dont dispose une colonne

Des deux-points dans la ligne de séparation fixent l’alignement de toute la colonne, en-tête compris :

```markdown
| Left | Centred | Right |
| :--- | :-----: | ----: |
| a | b | 1 |
```

Un deux-points à gauche aligne à gauche, à droite aligne à droite, des deux côtés centre, et aucun laisse la valeur par défaut du moteur de rendu — en général la gauche, mais c’est la décision de la feuille de style et non celle du document.

| Avantages | Inconvénients |
| --- | --- |
| Coûte un caractère et s’applique à chaque ligne de la colonne | Colonne entière seulement : il n’y a pas d’alignement par cellule |
| Les nombres alignés à droite alignent leurs chiffres, et c’est bien là tout l’intérêt | Ce qui est émis diffère d’un moteur de rendu à l’autre |
| Fonctionne avec un seul tiret : `:-:` est une cellule centrée valide | La liste d’autorisation d’un assainisseur peut supprimer l’attribut ou le style |
| L’en-tête et le corps sont toujours d’accord, puisqu’il s’agit d’une seule déclaration | Pas d’alignement vertical, et aucun moyen d’aligner un tableau entier |

**Prix :** un caractère par colonne, et une dépendance envers la sortie que choisit votre moteur de rendu.

**Détails techniques et fonctions**

- Le deux-points se place dans la cellule, contre les tirets. `| :--- |` est correct ; `| : --- |` et `|:|` ne le sont pas.
- Certains moteurs de rendu émettent `<th align="right">`, d’autres `<th style="text-align:right">`. Les deux sont identiques à l’œil dans un navigateur.
- La différence mord à deux endroits : quand vous écrivez votre propre CSS contre cette sortie, et quand le HTML traverse un assainisseur dont la liste d’autorisation accepte `align` ou `style`, mais pas les deux. [Assainir le Markdown sans se tromper](/blog/sanitising-markdown-safely) explique pourquoi il vaut la peine d’exiger une liste d’autorisation partagée.
- L’alignement est le seul réglage par colonne que la syntaxe possède. Ni largeurs, ni couleurs, ni règles de retour à la ligne — tout cela vit dans le CSS ou nulle part.

**Pour qui ?** Pour quiconque a une colonne de nombres, de versions ou de tailles de fichiers. Alignez celles-là à droite et laissez les colonnes de texte tranquilles ; du texte courant centré se lit moins bien qu’il n’y paraît dans l’éditeur.

### Les lignes vides — la frontière dont l’analyseur a besoin

Écrite directement sous une ligne de prose, la ligne d’en-tête d’un tableau peut se faire avaler par ce paragraphe. Les analyseurs ne s’accordent pas sur le droit d’un tableau à interrompre un paragraphe : un fichier qui s’affiche sur votre machine peut donc ne pas s’afficher dans l’outil suivant de la chaîne.

| Avantages | Inconvénients |
| --- | --- |
| Deux lignes vides rendent le bloc non ambigu partout | Faciles à perdre quand les fichiers sont générés ou concaténés |
| Supprime toute une catégorie de différences entre outils | C’est de l’espace blanc : les relecteurs ne remarquent pas son absence |
| Répare aussi les tableaux enveloppés dans du HTML brut | Certains éditeurs suppriment les lignes vides finales à l’enregistrement |

**Prix :** deux lignes vides, en échange d’un tableau qui se comporte pareil dans tous les moteurs de rendu.

**Détails techniques et fonctions**

- Une ligne vide avant la ligne d’en-tête la tient hors du paragraphe précédent. Une ligne vide après la dernière ligne de données referme proprement le bloc.
- Le tableau s’achève aussi à toute ligne qui en ouvre un autre : un titre, une clôture de code, une citation, une ligne horizontale.
- À l’intérieur d’un conteneur HTML brut, les lignes vides ne sont pas facultatives — voyez la section sur les tableaux trop larges, plus bas.
- Les fichiers recousus par un script sont la source habituelle d’une ligne vide manquante. Joignez les documents avec une ligne vide entre eux, pas avec un simple saut de ligne.

**Pour qui ?** Pour tout le monde, à chaque fois. C’est la fiabilité la moins chère que vous achèterez aujourd’hui.

### Les barres verticales dans une cellule — l’échappement que vous oublierez

Une barre verticale non échappée termine la cellule où qu’elle apparaisse. Y compris à l’intérieur d’un code en ligne, car la ligne est découpée sur les barres bien avant que l’analyseur en ligne ne voie les accents graves. Écrivez un enchaînement de commandes shell, une union de types ou une expression régulière avec une alternative, et la ligne gagne discrètement une cellule et perd une valeur.

| Avantages | Inconvénients |
| --- | --- |
| `\|` fonctionne partout dans une cellule, code en ligne compris | Rien dans la sortie cassée ne désigne la barre verticale |
| L’échappement tient en un caractère et ne demande aucune configuration | Une source truffée d’échappements se lit moins bien |
| L’encodage en `%7C` fonctionne dans une destination de lien | La même chaîne dans un bloc clôturé n’a besoin d’aucun échappement, ce qui déroute |

**Prix :** une barre oblique inverse par barre verticale, et une source qui se lit un peu moins bien que la sortie.

**Détails techniques et fonctions**

- Échappez une barre verticale littérale en `\|`. En GFM, c’est honoré à l’intérieur des autres portions en ligne : `` `a \| b` `` donne donc un code en ligne contenant `a | b`.
- Dans une destination de lien, une barre verticale est plus sûre encodée en `%7C`, les règles d’échappement dans les URL étant moins cohérentes d’un analyseur à l’autre.
- Une barre verticale dans un attribut HTML placé dans une cellule découpe la ligne elle aussi. L’analyseur ne lit pas votre HTML.
- La `｜` pleine chasse d’une méthode de saisie chinoise ou japonaise n’est pas du tout le délimiteur : une ligne tapée avec celle-ci ne devient jamais des cellules.
- Les blocs de code clôturés hors d’un tableau n’ont besoin d’aucun échappement. Si une cellule se remplit d’échappements, c’est l’indice que son contenu a sa place dans [un bloc de code](/blog/code-blocks-in-markdown).

**Pour qui ?** Pour quiconque documente une ligne de commande, une expression régulière, une condition OU ou une union de types — c’est-à-dire la plupart des gens qui écrivent des tableaux techniques.

### Les sauts de ligne dans une cellule — impossibles, et `<br>` à la place

Une ligne de tableau s’achève là où la ligne s’achève. Il n’existe aucune syntaxe Markdown pour un retour à la ligne dans une cellule : deux espaces en fin de ligne n’y font rien, quoi qu’ils fassent [ailleurs dans un document](/blog/markdown-line-breaks-and-lists), et une barre oblique inverse finale n’aide pas davantage, l’analyseur ayant déjà décidé que la ligne était terminée.

Le contournement passe par du HTML en ligne :

```markdown
| Step | Notes |
| --- | --- |
| Publish | Creates the link.<br>Sending it is your job. |
```

| Avantages | Inconvénients |
| --- | --- |
| C’est la seule chose qui marche, et elle marche dans la plupart des moteurs de rendu | C’est du HTML dans votre Markdown, ce que certaines chaînes interdisent |
| GFM autorise le HTML en ligne : l’analyseur le laisse passer | Un assainisseur qui retire les balises inconnues recolle les phrases |
| `<br>` et `<br />` s’analysent tous deux | Plusieurs sauts dans une même cellule signalent en général un tableau mal conçu |

**Prix :** une balise HTML, et une dépendance envers ce qui assainit votre HTML pour qu’il la conserve.

**Détails techniques et fonctions**

- Placez la balise en ligne, sans espace avant, exactement là où le saut doit tomber.
- Sa survie dépend de l’étape suivante, pas de l’analyseur. Un convertisseur qui échappe le HTML brut par défaut vous montre un `<br>` littéral ; un autre qui supprime les balises inconnues l’enlève et recolle le texte.
- TransformPipe assainit l’aperçu et le fichier téléchargé avec une seule et même liste d’autorisation : le saut que vous voyez dans l’aperçu est celui du fichier que vous envoyez.
- Si une cellule réclame deux sauts, ou un saut plus une puce, vous êtes en train d’écrire un paragraphe à l’intérieur d’une grille. Sortez-le de là.

**Pour qui ?** Pour quiconque a une colonne « remarques », et avec parcimonie. Un tableau dont chaque cellule porte un `<br>` est un tableau qui lutte contre sa propre forme.

### Les lignes irrégulières — complétées en silence, tronquées en silence

Dès que l’en-tête et la ligne de séparation s’accordent sur un nombre de colonnes, ce nombre fait loi. Une ligne de données qui a moins de cellules est complétée par des cellules vides. Une ligne qui en a plus voit le surplus jeté. Ni l’un ni l’autre ne produit d’avertissement, et les deux ressemblent à une perte de données quand vous les découvrez une semaine plus tard.

| Avantages | Inconvénients |
| --- | --- |
| Les lignes courtes sont licites : on peut omettre les cellules vides finales | Une ligne mal comptée perd sa dernière valeur sans un mot |
| Cette tolérance maintient l’affichage des tableaux édités à la main | Une colonne ajoutée doit l’être sur absolument chaque ligne |
| Le nombre de colonnes se vérifie facilement : comptez les cellules de séparation | Les tableaux générés héritent de ce que le générateur a mal compté |

**Prix :** le silence. C’est la seule partie de la syntaxe qui échoue sans symptôme visible dans la source.

**Détails techniques et fonctions**

- Le nombre de cellules est décidé par la ligne d’en-tête et la ligne de séparation, et par elles seules. Les lignes de données y sont ajustées.
- Une dernière valeur disparue sur une ligne trahit d’ordinaire une barre verticale en trop plus tôt dans la même ligne — souvent une barre non échappée dans une valeur.
- Les colonnes n’ont pas besoin d’être alignées dans la source. Une source irrégulière produit le même HTML qu’une grille soignée ; soignez-la quand même, pour celui qui l’éditera après vous.
- Si vous ajoutez une colonne, ajoutez-la à l’en-tête, à la ligne de séparation et à chaque ligne de données d’un seul geste. Les tableaux à moitié migrés s’affichent quand même, et c’est pourquoi ils passent la relecture.

**Pour qui ?** Personne délibérément. Connaissez la règle, pour qu’une valeur manquante vous envoie compter les barres verticales plutôt qu’accuser le convertisseur.

### Les barres de début et de fin — facultatives, jusqu’à ce qu’elles ne le soient plus

Ces deux blocs produisent un HTML identique :

```markdown
| Name | Size |
| --- | --- |
| logo.svg | 4 KB |

Name | Size
--- | ---
logo.svg | 4 KB
```

| Avantages | Inconvénients |
| --- | --- |
| La forme nue est plus rapide à taper et à générer | Plus difficile à lire, et une cellule manquante s’y repère mal |
| La forme encadrée rend le nombre de colonnes visible d’un coup d’œil | Deux caractères de plus sur chaque ligne |
| Les deux sont du GFM valide : aucune des deux ne menace la portabilité | Un tableau à une colonne a besoin des barres extérieures pour être reconnu |

**Prix :** deux caractères par ligne pour la forme encadrée. Payez-les.

**Détails techniques et fonctions**

- Les barres extérieures sont facultatives sur la ligne d’en-tête, la ligne de séparation et les lignes de données, indépendamment. Vous pouvez les mélanger, même s’il n’y a aucune raison de le faire.
- Le tableau à une colonne est l’exception : sans la moindre barre sur la ligne, rien ne signale à l’analyseur qu’il a affaire à un tableau ; écrivez donc `| En-tête |` et `| --- |`.
- Les espaces autour du contenu d’une cellule sont supprimés : remplir les cellules pour les aligner ne coûte donc rien au rendu.
- Les tabulations dans une ligne sont traitées comme de l’espace blanc, non comme des délimiteurs. Un tableau séparé par des tabulations n’est pas un tableau Markdown.

**Pour qui ?** Utilisez la forme encadrée dans les fichiers que des gens éditent à la main. La forme nue convient très bien à la sortie d’un script, où personne ne lit la source de toute façon.

### L’indentation — trois espaces passent, quatre sont fatals

Jusqu’à trois espaces initiaux sont ignorés. Quatre ou plus transforment la ligne en bloc de code indenté, et le tableau s’affiche en caractères à chasse fixe dans un encadré gris — ce qui a au moins le mérite d’être un symptôme reconnaissable.

| Avantages | Inconvénients |
| --- | --- |
| La tolérance de trois espaces pardonne la plupart des espaces égarés | Quatre espaces, c’est une construction entièrement différente |
| Les tableaux s’imbriquent dans les éléments de liste, correctement indentés | L’indentation requise dépend de la largeur du marqueur de liste |
| L’échec est visible : un bloc de code, pas un paragraphe | Tabulations et espaces mêlés rendent la colonne de contenu ambiguë |

**Prix :** de l’attention, chaque fois que le tableau habite une liste.

**Détails techniques et fonctions**

- Dans un élément de liste, chaque ligne du tableau — en-tête, séparation et données — doit se placer à la colonne de contenu de l’élément, c’est-à-dire là où commence le texte de l’élément lui-même.
- Dans une citation, chaque ligne a besoin de son marqueur `>`, ligne de séparation comprise.
- Un tableau dans une liste dans une citation est licite, et personne ne vous en remerciera.
- Si le tableau s’affiche comme un bloc de code, la correction relève de l’espace blanc, pas de la syntaxe.

**Pour qui ?** Pour quiconque rédige des procédures, où une étape appelle un petit tableau en dessous. Envisagez plutôt un titre et un tableau pleine largeur ; les tableaux imbriqués sont à l’étroit sur un téléphone.

### La variante — les tableaux sont du GFM, pas du CommonMark

Les tableaux ne sont ni dans le Markdown d’origine ni dans le CommonMark nu. Plusieurs extensions les ajoutent, et la version de GitHub Flavored Markdown est celle que suivent la plupart des outils. Un convertisseur appliquant strictement CommonMark sans l’extension des tableaux affiche votre tableau comme un paragraphe de barres verticales — et il a raison. Rien n’est cassé. La fonctionnalité n’est pas là.

| Avantages | Inconvénients |
| --- | --- |
| La syntaxe de tableau de GFM est celle qu’implémente presque tout outil moderne | Un analyseur CommonMark conforme la refuse, à juste titre |
| Le repli est du texte lisible plutôt qu’une erreur | L’échec est silencieux : il voyage loin avant que quiconque le remarque |
| Pandoc, remark, markdown-it et d’autres proposent tous les tableaux | Les extensions divergent aux marges : tableaux en grille, légendes, cellules multilignes |

**Prix :** aucun en GFM. Dans une chaîne hétérogène, le coût est de vérifier chaque analyseur une fois.

**Détails techniques et fonctions**

- GFM définit les tableaux comme une extension de CommonMark, aux côtés des listes de tâches, du texte barré et des liens automatiques. Un outil peut implémenter CommonMark intégralement et ne prendre en charge aucune des quatre.
- Certains écosystèmes exigent d’activer l’extension explicitement — un greffon, un préréglage ou un indicateur — et la livrent désactivée.
- D’autres variantes ajoutent aux tableaux des fonctions que GFM n’a pas, comme les cellules multilignes ou les légendes. Celles-là ne voyagent pas : un document qui en dépend s’affiche en barres verticales dans un moteur de rendu GFM.
- [CommonMark, GFM et les variantes](/blog/commonmark-gfm-and-the-flavours) expose quel analyseur fait quoi, et [le comparatif des convertisseurs](/blog/best-markdown-to-html-converters) couvre les outils qui traitent les tableaux sans configuration.

**Pour qui ?** Pour quiconque voit son fichier traverser plus d’un moteur de rendu. Convertissez tôt un document représentatif et regardez les tableaux avant de bâtir quoi que ce soit par-dessus.

## Là où un tableau Markdown est la mauvaise forme, et ce que cela coûte

La syntaxe ci-dessus couvre les tableaux qui devraient fonctionner et ne fonctionnent pas. Il existe une seconde catégorie : les tableaux qui ne peuvent pas fonctionner, parce que les données n’entrent pas dans ce qu’est un tableau Markdown. C’est la partie qu’une référence de syntaxe passe sous silence, et il vaut la peine d’être honnête sur les solutions de rechange, parce que chacune coûte quelque chose de réel.

**Les cellules fusionnées.** Il n’y a ni `colspan` ni `rowspan`. Un tableau financier avec un en-tête à cheval sur plusieurs colonnes, ou une matrice avec une colonne d’intitulés fusionnée, est inexprimable. Vos options sont un `<table>` HTML brut dans le fichier Markdown, ou une autre présentation. Le tableau HTML fonctionne, et il vous coûte trois choses : plus personne ne le lit dans la source, le diff d’une valeur modifiée devient le diff d’une ligne de HTML, et tout le bloc dépend de l’assainisseur de votre convertisseur pour qu’il autorise `table`, `tr`, `td`, `colspan` et `rowspan`. Bon nombre de listes d’autorisation acceptent les balises et jettent les attributs, ce qui produit un tableau qui s’affiche avec ses fusions discrètement disparues.

**Les cellules au contenu véritable.** Une cellule qui voudrait un paragraphe, une liste à puces, un bloc de code clôturé, une citation ou un tableau imbriqué ne peut pas l’avoir. Les cellules portent du contenu en ligne, point final. La correction habituelle est la bonne : gardez le tableau comme résumé, une valeur courte par cellule, et mettez le détail dans des sections titrées en dessous. Cela se lit mieux sur un téléphone, d’ailleurs, où un tableau à cinq colonnes est pénible quelle que soit la façon dont il a été écrit.

**Tout ce qui comporte une case à cocher.** Les cases des listes de tâches viennent des éléments de liste : un `- [ ]` dans une cellule reste du texte littéral dans la plupart des moteurs de rendu. S’il vous faut une colonne de coches, mettez-y un caractère et dites dans l’en-tête ce qu’il signifie.

**Les liens par référence définis à proximité.** Les définitions de référence de lien sont de niveau bloc : elles ne peuvent donc pas vivre dans un tableau. Des références définies ailleurs dans le document fonctionnent très bien dans les cellules ; la définition doit simplement se trouver hors du bloc.

**Les tableaux qui sont en réalité des données.** Si les lignes viennent d’un tableur, d’un export ou d’une requête, éditer des barres verticales à la main est le mauvais métier — [convertissez plutôt le CSV](/blog/best-csv-to-markdown-converters). Chaque colonne ajoutée signifie toucher chaque ligne, et une ligne mal comptée perd une valeur en silence. Gardez le CSV ou la requête comme source de vérité et générez le Markdown : [convertir un CSV en tableau Markdown](/csv-to-markdown) vous retire entièrement le comptage des mains et réussit l’échappement des valeurs qui contiennent des barres verticales, l’erreur que l’on commet justement à la main.

**Les tableaux trop larges.** Deux problèmes se cachent derrière une seule plainte. Le premier est le fichier source, où un tableau à neuf colonnes est pénible à éditer et impossible à relire. Le second est la page : un tableau HTML prend la largeur que son contenu exige, et un tableau large comprime donc ses colonnes en rubans ou tire la page sur le côté. Les corrections, grossièrement dans l’ordre où elles devraient vous plaire :

- Supprimez une colonne. Les tableaux larges en contiennent d’ordinaire une qui porte la même valeur sur chaque ligne, ou deux qui pourraient n’en faire qu’une.
- Raccourcissez les intitulés. Un intitulé qui ne peut pas passer à la ligne fixe la largeur minimale de la colonne : « Authentification requise » coûte plus cher que « Auth ».
- Transposez-le. Quatre colonnes et trois lignes se lisent souvent mieux dans l’autre sens.
- Coupez-le en deux tableaux partageant une colonne clé.
- Laissez-le défiler, en l’enveloppant dans un conteneur auquel votre feuille de style donne `overflow-x: auto`.

Cette dernière solution a un piège qu’il vaut la peine d’énoncer, car c’est une façon courante de casser un tableau qui allait très bien :

```markdown
<div class="table-scroll">

| Column | Column |
| --- | --- |
| … | … |

</div>
```

Les lignes vides à l’intérieur du conteneur sont obligatoires. Sans elles, le tableau se retrouve dans un bloc HTML brut, l’analyseur laisse le tout tranquille, et vos barres verticales atteignent la page telles quelles. Et le conteneur ne sert que là où vous maîtrisez le CSS. Dans un fichier HTML autonome, c’est la feuille de style livrée par votre convertisseur qui décide si un tableau large défile ou déborde.

## Comment choisir la forme de votre tableau

1. **Comptez les colonnes avant de taper la ligne d’en-tête.** Le compte auquel vous vous engagez dans la ligne de séparation est celui que chaque ligne devra honorer ensuite, et en ajouter une plus tard veut dire éditer toutes les lignes — décidez donc une bonne fois, tant que le tableau ne fait encore que trois lignes.
2. **Déterminez si les données sont écrites ou générées.** La prose a sa place dans un tableau écrit à la main. Les lignes sorties d’un tableur ou d’une API ont la leur dans un tableau généré, parce qu’un humain qui retape quarante lignes de barres verticales en comptera au moins une de travers, et que ce mauvais compte est silencieux.
3. **Demandez-vous si une cellule aura un jour besoin d’une seconde ligne.** Si oui, vous vous engagez sur `<br>` et sur un assainisseur qui le conserve. Si plus d’une cellule en a besoin, le tableau est le mauvais contenant, et la bonne réponse est un tableau court plus des sections.
4. **Vérifiez l’analyseur du bout de la chaîne avant de miser sur un tableau.** Un fichier qui s’affiche sur GitHub et casse dans une compilation rencontre en général un analyseur plus strict, tableaux désactivés, et vous préférez le découvrir sur un fichier de test que dans un document publié.
5. **Convertissez une fois et lisez le HTML, pas l’aperçu.** Un aperçu bâti sur le même analyseur que votre éditeur est d’accord avec votre éditeur par construction. L’élément `<table>` dans la sortie est la seule preuve, et un `<th>` manquant vous dit quelle ligne corriger.

## Conclusion

Les tableaux Markdown sont fragiles d’une manière bien précise : ils échouent complètement plutôt que partiellement, et ils échouent sans le dire, ce qui les fait paraître imprévisibles alors qu’ils ne le sont pas. La ligne de séparation doit correspondre au nombre de cellules de l’en-tête, le bloc a besoin d’une ligne vide de chaque côté, une barre verticale littérale réclame une barre oblique inverse, un saut de ligne réclame `<br>`, et l’ensemble réclame un analyseur qui implémente GFM. Réussissez ces cinq points et un tableau survivra à toutes les conversions que vous lui ferez subir. Prenez le tableau le plus large et le plus échappé que vous ayez, passez-le dans [TransformPipe](https://transformpipe.com), et lisez la source HTML à côté de l’aperçu : une colonne manquante veut dire que les tirets sont mal comptés, et une cellule coupée en deux qu’une barre verticale n’a pas été échappée.

## FAQ

### Pourquoi mon tableau Markdown ne s’affiche-t-il pas du tout ?

Neuf fois sur dix, la ligne de séparation est fautive : absente, sur la mauvaise ligne, ou portant un nombre de cellules différent de la ligne d’en-tête. Comptez les cellules de la première ligne et celles de la deuxième et rendez-les égales. Si elles correspondent déjà, cherchez une ligne vide au-dessus du tableau, et un tiret cadratin là où vous aviez tapé trois traits d’union.

### Ai-je besoin d’une ligne vide avant un tableau Markdown ?

Oui, en pratique. Les analyseurs ne s’accordent pas sur le droit d’un tableau à interrompre un paragraphe : un tableau écrit directement sous une ligne de prose s’affiche dans certains outils et se fait absorber par le paragraphe dans d’autres. Une ligne vide avant la ligne d’en-tête et une après la dernière ligne de données suppriment le désaccord.

### Comment insérer un saut de ligne dans une cellule de tableau Markdown ?

Avec `<br>`, écrit en ligne là où le saut doit tomber. Il n’existe pas de syntaxe Markdown pour cela, parce qu’une ligne de tableau s’achève à la fin de la ligne, et que deux espaces finaux ne font rien dans une cellule. Que la balise survive dépend de l’assainisseur de votre convertisseur plutôt que de son analyseur.

### Comment échapper une barre verticale dans un tableau Markdown ?

Écrivez `\|`. Cela fonctionne dans le texte ordinaire d’une cellule comme dans du code en ligne : `` `a \| b` `` vous donne donc un code en ligne contenant une barre verticale. Dans une destination de lien, encodez-la plutôt en `%7C`, l’échappement à l’intérieur des URL étant traité de façon moins cohérente d’un analyseur à l’autre.

### Comment aligner une colonne dans un tableau Markdown ?

Mettez des deux-points dans la ligne de séparation : `:---` pour la gauche, `:---:` pour le centre, `---:` pour la droite. L’alignement s’applique à toute la colonne, en-tête compris, et il n’y a aucun moyen d’aligner une seule cellule. Ce que le moteur de rendu émet — un attribut `align` ou un style `text-align` — varie, et les deux se ressemblent dans un navigateur.

### Les tableaux font-ils partie du Markdown standard ?

Non. Les tableaux ne sont ni dans le Markdown d’origine ni dans CommonMark ; ils viennent d’extensions, et c’est la version de GitHub Flavored Markdown qu’implémentent la plupart des outils. Un analyseur CommonMark strict affiche votre tableau comme un paragraphe de barres verticales, et il se comporte correctement en faisant cela.

### Que faire d’un tableau Markdown trop large ?

Supprimez une colonne, raccourcissez les intitulés, ou transposez-le — ces solutions réparent la source autant que la page. Si les données réclament vraiment cette largeur, enveloppez le tableau dans un `<div>` auquel votre feuille de style donne `overflow-x: auto`, sans oublier les lignes vides à l’intérieur du conteneur, et acceptez que le conteneur ne serve que là où vous maîtrisez le CSS.
