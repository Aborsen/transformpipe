---
title: "Ce qu’il ne faut pas garder d’un .docx : la mise en forme perdue vers Markdown"
description: "Un inventaire de ce qu’un fichier Word transporte et que Markdown ne peut pas exprimer, quelles pertes comptent, et que faire des légendes."
date: 2026-08-17
tag: Conversion
keywords: docx vers markdown mise en forme perdue, word vers markdown perd la mise en forme, conversion docx perd les styles, légendes word markdown, renvois word markdown, suivi des modifications markdown, sauts de page docx markdown
---

Vous convertissez un document Word en Markdown, et quelque chose manque. Parfois c’est la citation mise en exergue à la page deux. Parfois c’est la numérotation. Parfois ce n’est rien que vous puissiez nommer, juste l’impression que le document ressemblait à un document et ressemble maintenant à un fichier texte.

Les deux réactions ont en général raison, et elles parlent de choses différentes. Un `.docx` transporte des centaines d’informations distinctes sur l’apparence que doivent prendre ses mots. Markdown transporte à peu près une douzaine d’informations sur ce que sont ses mots. Convertir de l’un à l’autre n’est pas une compression ; c’est un changement de sujet. La question intéressante n’est pas combien a été perdu, mais lesquelles de ces pertes doivent vous préoccuper.

### En bref

L’essentiel de ce qu’un `.docx` perd en route vers Markdown, c’est de la présentation, et la présentation est justement la partie que vous alliez de toute façon écraser : polices, tailles, couleurs, marges, sauts de page, colonnes, en-têtes et pieds de page décrivent tous une page imprimée qui n’existe plus. Quatre pertes sont réelles et méritent du travail : le **suivi des modifications**, les **commentaires**, les **légendes**, et les **renvois**, parce que chacun porte un sens qu’on ne peut pas reconstituer à partir des seuls mots. Les zones de texte sont la perte la plus souvent manquée, parce que le texte est tout simplement absent et que rien ne vous prévient. Corrigez légendes et renvois à la main avant la conversion, gardez la couche de relecture avec un outil doté d’une option documentée pour cela, et archivez l’original dans tous les cas.

## Ce que Markdown possède, et pourquoi la liste est si courte

Il est utile de voir d’un coup tout le format cible. Markdown, dans la spécification CommonMark, offre : des paragraphes, six niveaux de titre, l’emphase, l’emphase forte, des listes ordonnées et non ordonnées, des citations en bloc, des extraits de code en ligne, des blocs de code balisés ou indentés, des séparateurs thématiques, des liens, des images, des sauts de ligne forcés, et du HTML brut. GitHub Flavored Markdown ajoute les tableaux, les cases à cocher, le texte barré et les liens automatiques. Les notes de bas de page ne figurent dans aucune des deux spécifications ; GitHub les affiche et beaucoup d’analyseurs ne le font pas, ce qu’il [vaut la peine de savoir avant de s’appuyer sur une extension quelconque](/blog/commonmark-gfm-and-the-flavours).

C’est tout le vocabulaire. Il n’existe aucune syntaxe pour une police, un corps de caractère, une couleur, une marge, une page, une colonne, une légende, un renvoi, un commentaire, une insertion, une suppression, une zone de texte, un taquet de tabulation, ou une cellule de tableau qui s’étend sur deux colonnes. Pas « pris en charge de façon limitée » — aucune syntaxe du tout. Tout outil qui semble préserver l’une de ces choses produit en réalité du HTML brut avec un attribut `style`, ce qui est un tout autre document portant une extension `.md`.

Si la liste est courte, c’est un choix de conception, pas un oubli. Markdown décrit une structure : ceci est un titre, ceci est une liste, ceci est une citation. À quoi ressemble un titre, c’est le problème de quelqu’un d’autre, décidé plus tard, par une feuille de style, un moteur de rendu ou un thème. Word décrit les deux à la fois et vous laisse la possibilité de sauter entièrement la structure — vous pouvez fabriquer un titre en sélectionnant une ligne, en choisissant du gras à 16 points, et en centrant. Word l’affichera exactement comme demandé. Rien dans le fichier n’enregistre qu’il s’agissait d’un titre.

Cette seule différence explique l’essentiel de ce que les gens appellent la perte de mise en forme. Un convertisseur lit un `.docx` en cherchant de la structure. Là où le document a une structure, la conversion est propre et un peu ennuyeuse. Là où l’apparence tient lieu de structure, le convertisseur n’a rien à lire, et l’apparence disparaît parce qu’il n’y a nulle part où l’accueillir. Le document n’a pas perdu ses titres. Il n’en a jamais eu.

## L’inventaire, poste par poste, avec un verdict

Tout ce qu’un `.docx` peut transporter, ce que Markdown peut en exprimer, et si la perte mérite votre attention. « À regretter » signifie que l’information a disparu et ne peut pas être reconstituée à partir des mots. « Bon débarras » signifie que le document est meilleur sans elle. « À corriger » signifie que cela compte et qu’il y a une action précise à mener.

| Ce que le fichier Word transporte | Équivalent en Markdown | Verdict | Que faire |
| --- | --- | --- | --- |
| Police et corps de caractère | Aucun | Bon débarras | Rien. Le moteur de rendu décide |
| Couleur du texte et surlignage | Aucun | Bon débarras, sauf si la couleur portait un sens | Remplacer le code couleur par des mots avant de convertir |
| Gras et italique | `**` et `*` | Survit | Rien |
| Petites capitales, contour, ombre, espacement des caractères | Aucun | Bon débarras | Rien |
| Exposant et indice | HTML brut seulement | Perte mineure | Accepter `<sup>`/`<sub>` dans la sortie, ou réécrire |
| Barré | `~~` en GFM seulement | Survit en général | Vérifier le dialecte de votre moteur de rendu |
| Taille de page, marges, orientation | Aucun | Bon débarras | Rien. Il n’y a plus de pages |
| Sauts de page | Aucun | Bon débarras | Supprimer les lignes vides et marqueurs résiduels |
| Sauts de section | Aucun | Bon débarras | Rien, sauf si les en-têtes changeaient par section |
| Colonnes multiples | Aucun | Bon débarras | Rien. L’ordre de lecture est désormais linéaire |
| En-têtes, pieds de page, numéros de page | Aucun | À regretter, en partie | Faire remonter « Confidentiel », la version ou la date dans le corps |
| Filigranes | Aucun | À regretter, si le mot était DRAFT | Mettre le statut dans le frontmatter ou la première ligne |
| Taquets de tabulation, points de suite, alignement manuel | Aucun | Bon débarras | Transformer les sommaires à points en vrais liens |
| Interligne, retraits, espacement avant/après | Aucun | Bon débarras | Rien |
| Zones de texte et citations en exergue | Aucun ; le texte disparaît en général | À regretter, et à vérifier | Rechercher dans la sortie une phrase connue de chaque zone |
| Formes, SmartArt, graphiques, diagrammes | Aucun | À regretter | Exporter en images et y faire référence |
| Images dans le texte | Référence `![]()` seulement | Survit comme référence | Extraire les fichiers ; vérifier chaque chemin |
| Suivi des modifications | Aucun | À regretter — c’est le cas coûteux | Convertir avec un outil qui le conserve, ou garder le `.docx` |
| Commentaires | Aucun | À regretter | Exporter le fil séparément avant de convertir |
| Notes de bas de page et de fin | Syntaxe d’extension seulement | Selon le moteur de rendu | Tester un document à notes de bout en bout |
| Légendes | Aucun | À corriger | Réécrire en lignes italiques ou en `<figcaption>` HTML |
| Renvois (`REF`, `PAGEREF`) | Aucun ; devient du texte figé | À corriger | Réécrire en liens d’ancre avant ou après la conversion |
| Champ de table des matières | Aucun | Bon débarras | Le supprimer ; laisser le moteur de rendu en générer une |
| Index et entrées d’index | Aucun | À regretter, rarement | Accepter la perte ou garder un PDF |
| Signets | Ancres de titre, indirectement | Partiel | Réancrer tout ce vers quoi vous pointiez |
| Hyperliens | `[]()` | Survit | Vérifier les liens relatifs et intra-document |
| Listes numérotées et à puces | `1.` et `-` | Survit en général, s’effondre parfois | Vérifier la présence de `numbering.xml` dans l’archive |
| Tableaux simples | Tableaux GFM | Survit | Compter les colonnes |
| Cellules fusionnées, tableaux imbriqués, contenu de bloc en cellule | Aucun | À regretter | Remanier à la main ou conserver en HTML |
| Styles sémantiques : Titre 1-9, Citation, Légende | Titres, citations en bloc | Survit si bien utilisé | Corriger les documents qui simulent des titres avec du gras |
| Styles décoratifs : Paragraphe de liste, Corps de texte, styles maison | Aucun | Bon débarras | Rien |
| Équations (OMML) | Aucun ; parfois du texte corrompu | À regretter | Réécrire en TeX ou exporter en images |
| Contrôles de contenu et champs de formulaire | Aucun | À regretter, si c’était un formulaire | Le document était une application, pas un document |
| Objets incorporés : tableurs, PDF, autres documents | Aucun | À regretter | Extraire et stocker à côté |
| Propriétés du document : auteur, titre, société, révision | Frontmatter, si l’outil l’écrit | Partiel | Recopier vous-même ce qui compte dans le frontmatter |
| Métadonnées de langue et de relecture | Aucun | Bon débarras | Rien |
| Champs calculés : `DATE`, `STYLEREF`, `SEQ` | Texte figé mis en cache | À corriger | Remplacer chacun par du texte réel |

## Présentation : polices, tailles, couleurs, et styles sans signification

C’est la catégorie la plus volumineuse et celle qui a le moins de conséquences. Un `.docx` enregistre, pour chaque suite de caractères, un ensemble de propriétés : famille de police, taille en demi-points, graisse, couleur en valeur hexadécimale, surlignage, espacement, crénage, présence de petites capitales. Markdown n’en enregistre rien, et le HTML qu’un bon convertisseur produit au passage non plus. Les propriétés sont simplement ignorées à la lecture.

Pour presque tous les documents, c’est le bon résultat. Le Calibri 11 points était le réglage par défaut de Word, pas une décision. Les titres bleus étaient le bleu d’un thème appliqué en 2019. L’unique paragraphe en Georgia est l’endroit où quelqu’un a collé depuis un e-mail. Rien de tout cela ne survit, rien de tout cela ne devrait survivre, et le document se lit mieux une fois qu’une seule feuille de style décide de tout cela de façon cohérente.

Il existe une exception, et elle mérite d’être prise au sérieux. Parfois, la couleur est le seul endroit où loge une signification. Une spécification où le texte rouge signifie « pas encore accepté ». Une liste de prix où le vert signifie « confirmé ». Un brouillon de traduction où les passages surlignés sont ceux à revoir. Convertissez ce document, et vous obtenez une liste plate d’éléments sans aucun moyen de savoir lesquels étaient lesquels, et les mots eux-mêmes ne vous le diront pas, car tout l’intérêt de la couleur était justement que les mots n’aient pas à le faire.

La solution n’est pas un réglage de convertisseur. Il n’existe aucune syntaxe vers laquelle convertir la couleur. La solution consiste à passer vingt minutes dans Word au préalable, à ajouter le mot que la couleur remplaçait — « (non accepté) », « (confirmé) », « (à revoir) » —, puis à convertir. C’est fastidieux et c’est la seule chose qui fonctionne, et c’est bien plus facile avant la conversion qu’après, car avant la conversion vous pouvez encore voir lesquels étaient en rouge.

**Les styles posent le même problème sous une autre forme.** Le mécanisme des styles de Word est réellement bon : un paragraphe porte un `w:pStyle` qui nomme son style, et la définition du style vit dans `word/styles.xml`. Les convertisseurs lisent le nom du style et le font correspondre. Titre 1 devient `#`, Titre 2 devient `##`, Citation devient une citation en bloc. mammoth fournit par défaut une correspondance de styles qui fait exactement cela, et vous laisse ajouter vos propres correspondances pour les styles maison qu’il ne peut pas connaître.

Le problème, c’est que la plupart des documents Word n’utilisent pas les styles pour la structure. Ils utilisent Normal pour tout et se rabattent sur la barre d’outils. Un document écrit ainsi se convertit en une longue suite de paragraphes, correctement, parce que c’est exactement ce qu’il est. Le titre que vous voyez à l’écran est un paragraphe dont les propriétés de caractère indiquent, par hasard, gras et 16 points, et aucun convertisseur ne le promouvra, car le promouvoir voudrait dire deviner — et le même document a du gras en 16 points ailleurs, au milieu d’une phrase, là où quelqu’un a mis en valeur un nom de produit.

Il y a ensuite l’autre moitié de la liste des styles : Paragraphe de liste, Corps de texte, Corps de texte avec retrait, Sans interligne, plus tout ce qu’un modèle a hérité d’un modèle lui-même hérité de la charte maison d’une entreprise datant de 2011. Ceux-là décrivent le retrait et l’espacement. Ils n’ont aucun contenu sémantique, ne correspondent à rien, et les abandonner n’est en rien une perte. Si vous avez converti un document et que la sortie ne garde aucune trace de « Paragraphe de liste », rien ne s’est mal passé.

## Le mobilier de page et le contenu flottant

Tout ce qui suit dans cette section décrit une page imprimée. Markdown n’a pas de pages, et le HTML affiché dans un navigateur n’en a pas non plus, tant que personne ne l’imprime. Ces pertes sont donc structurelles plutôt qu’accidentelles — il n’y a rien de l’autre côté pour les recevoir.

**Marges, taille de page, orientation et colonnes** vivent dans un élément de propriétés de section, `w:sectPr`, en fin de section. Il enregistre le format du papier, les quatre marges, la reliure, si les pages se reflètent, et la disposition en colonnes. Tout cela disparaît. Notamment, le problème d’ordre de lecture que créent les colonnes disparaît aussi : une mise en page à deux colonnes dans Word est un même récit continu, coulé dans deux boîtes, et la conversion produit ce récit dans l’ordre. Les gens s’attendent à ce que cela casse, et cela ne casse en général pas.

**Les sauts de page** sont un fragment de texte contenant `<w:br w:type="page"/>`, ou une propriété de paragraphe indiquant un saut avant. Il n’existe pas de Markdown pour cela, puisqu’il n’y a plus de page à interrompre. La plupart des convertisseurs les suppriment en silence. Si votre sortie a une ligne vide bizarre ou un marqueur perdu là où commençait un chapitre, c’est le résidu. Supprimez-le. Si le document a vraiment besoin d’un saut pour une impression future, l’endroit pour le dire est le CSS de ce qui l’affichera — `break-before: page` sur une classe de titre — pas le Markdown.

**En-têtes, pieds de page et numéros de page** sont des parties séparées dans l’archive : `word/header1.xml`, `word/footer1.xml` et leurs semblables, référencés depuis les propriétés de section. Tout supprime cela, et c’est en général correct, car « Page 3 sur 12 » n’a pas de sens dans un document sans pages.

Une ligne d’un pied de page mérite en général d’être sauvée. Un document dont le pied de page disait « Confidentiel — usage interne uniquement — v4.2 — relu le 12 mars » a maintenant été republié, dans un format facile à partager, sans rien de tout cela dessus. Le classement, la version et la date de relecture n’ont jamais existé que dans ce mobilier. Avant de convertir, lisez une fois l’en-tête et le pied de page, et placez ce qui compte dans le frontmatter ou dans la première ligne du corps, là où un lecteur le rencontrera réellement.

**Les filigranes** racontent la même histoire, en plus dramatique. Un filigrane DRAFT est une forme dans l’en-tête, dessinée derrière le texte. Il se convertit en rien, un brouillon devient donc indiscernable d’un document final. Dites « Brouillon » en toutes lettres.

**Les zones de texte sont la perte que les gens ont le plus de mal à croire.** Une zone de texte ne fait pas partie du flux du document ; c’est un objet de dessin, et le texte qu’elle contient siège dans un élément `w:txbxContent` attaché à une forme. Selon la manière dont elle a été créée, cette forme peut être enveloppée dans un bloc de contenu alternatif qui garde deux versions d’elle-même pour différentes versions de Word. Les convertisseurs qui parcourent le corps du document en cherchant des paragraphes peuvent ne jamais atteindre son intérieur. La citation en exergue que vous voyez à l’écran, l’encart latéral avec la définition clé, la case colorée contenant le résumé en trois phrases dont on vous demandera plus tard — rien de tout cela n’apparaît dans la sortie, et aucune erreur n’est signalée, car du point de vue du convertisseur, rien n’a été sauté.

La seule vérification fiable est la recherche. Prenez une phrase de chaque élément encadré de l’original, une par une, et cherchez-la dans le fichier converti. Si elle manque, retapez-la — en citation en bloc, en titre, ou en simple paragraphe à l’endroit où elle appartient. Et faites-le avant d’archiver le `.docx`, car cette recherche est facile tant que les deux fichiers sont ouverts, et impossible quand il ne vous en reste qu’un.

**Les formes, SmartArt, graphiques et diagrammes** suivent le même chemin et pour la même raison, sauf qu’ici la perte est incontestable : un schéma de processus est une information, et Markdown n’a aucun moyen de la retenir. Exportez chacun d’eux en PNG ou en SVG depuis Word, placez les fichiers quelque part de stable, et référencez-les. Cela transforme une perte totale en une dépendance à une image, ce qui est un problème bien plus petit — mais pas gratuit pour autant, puisque [une référence d’image qui fonctionne localement peut quand même casser quand le fichier se déplace](/blog/images-and-links-that-still-work).

## La couche de relecture : suivi des modifications et commentaires

C’est la catégorie où une conversion négligente détruit quelque chose que personne ne peut reconstruire.

Un `.docx` relu ne contient pas le texte final. Il contient les deux textes à la fois : les insertions enveloppées dans `w:ins`, les suppressions enveloppées dans `w:del`, chacune portant un auteur et un horodatage, et le texte supprimé conservé en entier à l’intérieur de la suppression. C’est ce qui rend possible le volet de révision de Word. C’est aussi ce qui fait d’un document Word le compte-rendu d’une négociation plutôt que l’énoncé d’une position.

Markdown n’a rien pour cela. Il n’existe aucune syntaxe pour « cette clause a été insérée par la partie adverse mardi » et aucune syntaxe pour « ces onze mots ont été supprimés ». Un convertisseur doit donc choisir, et la plupart choisissent sans vous le dire. Le comportement habituel consiste à vous rendre le texte comme si toutes les modifications avaient été acceptées — l’une de trois réponses plausibles, appliquée en silence, à une question qu’on ne vous a jamais posée. Les suppressions de quelqu’un ont désormais disparu, et avec elles le fait même qu’elles aient été proposées.

Pandoc est l’outil doté ici d’un contrôle documenté : `--track-changes` accepte `accept`, `reject` ou `all`, et seul `all` conserve les deux versions dans la sortie, enveloppées dans des balises `span`. L’approche de mammoth est différente — il fonctionne à partir d’une correspondance de styles, et le balisage de révision n’est pas quelque chose que ses réglages par défaut font remonter. La conséquence pratique est la même dans les deux cas : si un document a été relu et que vous ne préservez pas délibérément cette relecture, vous convertissez le résultat et jetez l’argumentation.

**Les commentaires sont pires, car ils n’ont nulle part où s’attacher.** Un commentaire Word est ancré sur une plage de texte par les marques `w:commentRangeStart` et `w:commentRangeEnd`, et le texte du commentaire lui-même vit dans `word/comments.xml` avec un auteur, une date, et éventuellement un fil de réponses. Markdown ne connaît aucune notion d’annotation sur une plage. Même si un convertisseur écrivait le texte du commentaire, il ne pourrait le placer qu’à proximité du texte, pas dessus, et l’ancrage est la moitié du sens : « ceci » dans un commentaire renvoie exactement aux mots auxquels il était attaché.

Le manuel de Pandoc est explicite : `accept` et `reject` ignorent les commentaires, et seul `all` les inclut. mammoth peut être configuré pour émettre des références de commentaires si vous ajoutez une correspondance de style pour cela, ce que sa documentation couvre et que presque personne ne fait. Tout le reste les supprime et ne dit rien.

Le conseil honnête est de cesser de traiter cela comme un problème de conversion. Si le fil de relecture compte — et sur un contrat, une spécification ou un article, c’est souvent la chose la plus précieuse du fichier — sortez-le d’abord de Word selon ses propres termes. Word peut imprimer ou exporter le document avec les commentaires, et un PDF de la version annotée constitue une archive parfaitement valable. Convertissez ensuite le texte propre en Markdown pour l’avenir, et gardez la copie annotée pour le passé. Deux fichiers, chacun bon dans une tâche, valent mieux qu’un seul fichier qui prétend faire les deux.

Les notes de bas de page se situent en bordure de cette catégorie. Elles ont au moins un foyer possible : `word/footnotes.xml` les retient, et le propre dialecte Markdown de Pandoc a une syntaxe de notes pour les y écrire. Mais les notes de bas de page ne figurent pas dans CommonMark, un convertisseur visant un CommonMark strict doit donc les mettre en ligne, les ajouter comme des paragraphes ordinaires en fin de document, ou les abandonner. Convertissez un document à notes, faites défiler jusqu’en bas, et regardez, avant de supposer que le comportement que vous voulez est celui que vous avez.

## Légendes, renvois et champs : les pertes pour lesquelles travailler en vaut la peine

Celles-ci méritent leur propre section, car ce sont les seules pertes de cet article où un travail précis et reproductible transforme de façon fiable un mauvais résultat en un bon.

**Une légende dans Word n’est pas une ligne de texte sous une image.** C’est un paragraphe dans le style Légende contenant un champ `SEQ` — quelque chose comme `SEQ Figure \* ARABIC` — que Word calcule pour produire le numéro. C’est pourquoi insérer une nouvelle figure au milieu d’un document renumérote tout ce qui suit. Le numéro n’est pas écrit ; il est dérivé de la position.

Convertissez ce document, et deux choses se produisent. Le style Légende n’a pas d’équivalent Markdown, le paragraphe devient donc un paragraphe ordinaire, visuellement indiscernable du texte courant. Et le champ s’effondre en la dernière valeur que Word a calculée, figée. Vous avez désormais un document où « Figure 4 » est une simple phrase posée entre deux paragraphes, et elle dira encore 4 après que vous aurez supprimé la Figure 2.

Il existe deux corrections décentes et une mauvaise. La mauvaise consiste à les laisser telles quelles en espérant. La première correction décente consiste à accepter que la légende est désormais de la prose, et à la faire paraître délibérée : une ligne en italique juste après l’image, la numérotation étant soit entièrement supprimée, soit renumérotée à la main et jamais plus retouchée. Supprimer les numéros est en général préférable, car une légende qui dit ce que montre la figure est plus utile qu’une légende qui dit de quelle figure il s’agit, et elle ne peut pas devenir obsolète.

La seconde consiste à conserver la sémantique en passant par du HTML, ce que Markdown autorise : un élément `<figure>` enveloppant l’image, avec un `<figcaption>` à l’intérieur. Cela donne à un moteur de rendu quelque chose de réel à styler, et à un lecteur d’écran quelque chose de réel à annoncer. Cela vous coûte, à cet endroit, la lisibilité de la source Markdown, et c’est le bon compromis pour les documents où les figures sont structurantes — un article, un manuel, un rapport avec vingt diagrammes. Le Markdown de Pandoc dispose d’une extension `implicit_figures` qui traite un paragraphe ne contenant qu’une image comme une figure, avec le texte alternatif comme légende ; cela vaut la peine de le savoir si vous convertissez déjà via Pandoc, car cela signifie qu’écrire la légende comme texte alternatif vous donne la structure gratuitement.

**Les renvois sont le même mécanisme, tourné vers l’intérieur, et ils échouent plus discrètement.** « Voir la section 4.2 page 11 » est, dans le fichier, un champ `REF` pointant vers un signet et un champ `PAGEREF` pointant vers la page de ce même signet. Word recalcule les deux. Markdown n’a ni l’un ni l’autre, et le signet lui-même n’a pas non plus d’équivalent, ce que vous obtenez donc, c’est le texte mis en cache : une phrase qui dit « voir la section 4.2 page 11 », dans un document sans sections numérotées ainsi et sans page 11.

C’est pire qu’une légende manquante, car ce n’est pas visiblement cassé. Cela se lit comme un renvoi qui fonctionne. Un lecteur le suit, ne trouve rien, et en conclut que le document est faux plutôt que converti.

Le travail est mécanique et en vaut la peine. Recherchez dans le fichier converti « voir », « ci-dessus », « ci-dessous », « page », « section », « figure », « tableau » et « annexe », et traitez chaque occurrence :

- Un renvoi vers un titre devient un lien vers l’ancre de ce titre. Les moteurs de rendu Markdown génèrent les ancres à partir du texte du titre — en général en minuscules avec les espaces remplacés par des tirets, même si la règle exacte varie selon le moteur, vérifiez-en donc un avant d’en écrire cinquante. `[les règles de conservation](#conservation-des-donnees)` survit à une renumérotation, car il pointe vers les mots et non vers le numéro.
- Un renvoi vers un numéro de page doit disparaître. Il n’y a pas de page. Réécrivez-le en renvoi vers la section, ou supprimez la proposition.
- Un renvoi vers une figure ou un tableau suit ce que vous avez décidé pour les légendes. Si vous avez supprimé les numéros, le renvoi doit nommer la chose à la place : « le diagramme de déploiement » plutôt que « la Figure 4 ».
- Un renvoi vers une clause numérotée d’un contrat ou d’une norme reste du texte, car la numérotation fait partie du contenu et n’est pas quelque chose que le moteur de rendu calcule.

**La table des matières n’exige aucun travail, seulement une suppression.** Une table des matières Word est un champ, et ce qui se convertit, c’est le texte mis en cache : une liste de titres avec des points de suite et des numéros de page, posée en haut de votre document comme de simples paragraphes. Elle ne peut pas se mettre à jour et dérivera en une semaine. Supprimez-la entièrement. Tout moteur de rendu de documentation, et la plupart des générateurs de site statique, construisent une liste de contenus à partir des titres, et elle sera toujours exacte parce qu’elle est dérivée plutôt que mémorisée.

**Les autres champs calculés méritent chacun une passe.** `DATE` devient la date de sa dernière actualisation, une lettre convertie aujourd’hui peut donc prétendre dater du jour où quelqu’un l’a ouverte pour la dernière fois dans Word. Les champs `STYLEREF`, courants dans les en-têtes courants, répètent le texte d’un titre et le figent. La numérotation automatique des listes s’entremêle avec tout cela. La règle générale est simple : tout ce que Word a calculé est désormais un fossile du dernier calcul, lisez donc une fois chaque nombre du document converti et demandez-vous d’où il vient.

## Là où « convertir puis corriger plus tard » échoue

L’approche évidente consiste à lancer la conversion, à regarder la sortie, et à réparer ce qui ne va pas. C’est la bonne approche pour la plupart des documents, et elle échoue de quatre manières précises qu’il vaut la peine de connaître avant de s’y engager.

**Vous ne pouvez pas réparer ce que vous ne voyez pas comme manquant.** C’est le problème des zones de texte, généralisé. La réparation fonctionne quand la sortie est visiblement fausse : un tableau aux colonnes décalées, un titre au mauvais niveau, une image cassée. Elle ne fonctionne pas quand la sortie est silencieusement incomplète, car il n’y a aucun indice. Rien dans un fichier converti ne dit « il y avait un encart ici ». La seule défense est une comparaison avec l’original, et une comparaison n’est possible que tant que vous avez encore l’original ouvert — ce qui signifie que la vérification doit avoir lieu au moment de la conversion, pas plus tard quand quelqu’un le remarque.

**L’information dont vous avez besoin pour réparer se trouve dans le fichier que vous avez remplacé.** Quels éléments étaient rouges. Ce que disait le pied de page. Qui a proposé de supprimer la troisième clause, et pourquoi. Où se trouvait vraiment la Figure 4 avant que la numérotation ne gèle. Tout cela se trouve dans le `.docx`, rien de tout cela ne se trouve dans le Markdown, et au moment où le `.docx` disparaît, la réparation cesse d’être possible et devient une reconstruction. Garder l’original n’est pas une question de sentiment ; c’est la seule copie des réponses.

**Réparer plus tard signifie réparer dans chaque copie.** Un document converti se déplace facilement. Quelqu’un le colle dans un wiki, le commite dans un dépôt, l’envoie à un client. Deux semaines plus tard, vous remarquez les renvois figés. La réparation doit désormais se faire à quatre endroits, dont trois que vous ne connaissez pas. Convertir cent documents multiplie cela par cent, ce qui est le véritable argument en faveur d’une liste de vérification appliquée une fois par document, plutôt que d’une correction faite à la découverte.

**Certaines choses coûtent plus cher à réparer qu’à refaire.** Un document avec des cellules fusionnées, des tableaux imbriqués et des cellules contenant des listes ne peut pas être réparé pour devenir du Markdown, car la syntaxe de tableau de Markdown n’a ni fusion ni contenu de bloc en cellule ; vous ne pouvez que remanier les données ou les garder comme tableau HTML. [Les tableaux sont ce qui casse le plus souvent dans les deux sens](/blog/markdown-tables-that-survive-conversion) et ce qui se corrige le moins bien après coup. Un document entièrement bâti à partir de zones de texte et de formes — une brochure, une affiche, une page unique conçue graphiquement — n’est pas un document avec une mise en forme à perdre. C’est une mise en page, et les mots y sont accessoires. Le convertir produit un fragment de prose dont personne ne veut, et la réponse honnête est que le fichier devrait rester un PDF.

Ce que cela coûte, additionné : le temps ne se trouve pas dans la conversion, qui prend des secondes, ni dans les réparations évidentes, qui prennent des minutes. Il se trouve dans la vérification, qui prend dix à vingt minutes pour un document d’une certaine ampleur, et dans le fait de garder l’original, qui coûte de l’espace disque et une convention de nommage. Les équipes qui sautent la vérification ne s’en aperçoivent pas immédiatement. Elles s’en aperçoivent quand quelqu’un demande ce que disait le paragraphe supprimé.

## Ce qu’il faut décider avant de convertir

1. **Établissez si le document a une structure ou seulement une apparence.** Ouvrez le volet des styles et regardez. Si les titres sont de vrais styles de titre, la conversion sera propre et votre vérification rapide ; si tout est en Normal avec du gras manuel, la sortie sera un mur de paragraphes et aucun convertisseur ne vous sauvera, le chemin le moins cher consiste donc à appliquer de vrais styles dans Word d’abord, puis à convertir une seule fois.
2. **Lisez l’en-tête, le pied de page et tout filigrane avant de toucher à quoi que ce soit.** Quoi qu’ils disent — une classification, une version, une date de relecture, le mot DRAFT — cela n’existe nulle part ailleurs dans le fichier et disparaîtra en une seule étape, et un document republié sans sa propre classification relève de la divulgation plutôt que de la conversion.
3. **Vérifiez si le fichier a été relu.** Le suivi des modifications et les commentaires sont les pertes que vous ne pouvez pas défaire ; si la relecture compte, exportez d’abord un PDF annoté et convertissez ensuite le texte propre ; si vous sautez cette étape, vous choisissez de jeter l’argumentation et de ne garder que le résultat.
4. **Faites l’inventaire du contenu flottant à la main.** Comptez les zones de texte, les formes, les SmartArt et les graphiques, notez le nombre, et vérifiez ce même nombre dans la sortie, car ce sont les seuls éléments qui disparaissent sans laisser aucune trace, et la vérification prend une minute par élément.
5. **Décidez une bonne fois de la règle des légendes, pour tous vos documents.** Soit les légendes deviennent des lignes en italique sans numéros, soit elles deviennent des blocs `<figure>` et `<figcaption>` ; décider au cas par cas garantit un ensemble de fichiers incohérent et une seconde passe plus tard.
6. **Passez les renvois au crible avant de publier, pas après.** Chaque « voir page 11 » et « comme le montre la Figure 4 » est désormais du texte figé qui se lit comme s’il fonctionnait, et une fois le fichier copié dans un wiki puis dans un dépôt, vous corrigez la même phrase à trois endroits.
7. **Gardez le `.docx`, et rangez-le quelque part où vous le retrouverez.** Chaque perte décrite dans cet article est à sens unique, l’original est donc votre seul registre de ce que le document savait auparavant, et le coût de le garder est de quelques centaines de kilo-octets, à comparer au coût de ne pas le garder, qui est une question à laquelle vous ne pourrez plus répondre du tout.

## Conclusion

L’essentiel de ce qu’un `.docx` perd en route vers Markdown ne valait de toute façon pas la peine d’être gardé : la police, le corps de caractère, les marges, les sauts de page, les colonnes, les points de suite et les deux douzaines de styles de paragraphe qui n’ont jamais décrit que de l’espacement. Les abandonner est tout le but de l’exercice, car un document qui décrit sa propre structure peut être stylé de façon cohérente, cherché, comparé et relu, ce qu’un document qui décrit sa propre apparence ne peut pas être. Les quatre choses qui valent le travail sont la couche de relecture, les légendes, les renvois, et tout ce qui se trouve dans une zone de texte, et les quatre se traitent plus facilement avant la conversion qu’après. [Le parcours pas à pas et sa liste de vérification](/blog/convert-docx-to-markdown) couvre la façon de mener la conversion elle-même, et [le comparatif des outils qui la font](/blog/best-word-to-markdown-converters) couvre lequel choisir ; pour un fichier isolé que vous préféreriez ne pas téléverser, [la conversion de Word vers Markdown de TransformPipe](/word-to-markdown) tourne dans le navigateur, gratuitement, sans que le `.docx` ne quitte jamais votre machine tant que vous êtes déconnecté. Quel que soit le chemin choisi, archivez l’original, car les polices, les pieds de page, les commentaires et la citation en exergue que vous n’avez pas remarquée ne reviendront pas.

## FAQ

### Pourquoi mon document Word perd-il toute sa mise en forme quand je le convertis en Markdown ?

Parce que Markdown n’a de syntaxe pour presque rien de tout cela. Il n’existe aucun moyen d’exprimer une police, un corps de caractère, une couleur, une marge ou un saut de page en Markdown, un convertisseur passe donc outre. Ce qui survit, c’est la structure — titres, listes, liens, tableaux, emphase — et seulement là où le document l’avait enregistrée comme structure plutôt que comme apparence.

### Pourquoi mes titres sont-ils devenus des paragraphes ordinaires ?

Presque certainement parce qu’ils n’ont jamais été des titres. Si un titre a été fabriqué en sélectionnant une ligne puis en appliquant du gras et une taille plus grande, le fichier enregistre des propriétés de caractère, pas un titre, et un convertisseur n’a rien à promouvoir. Appliquez de vrais styles de titre dans Word et convertissez à nouveau ; la différence est immédiate.

### Que deviennent les légendes quand je convertis une .docx en Markdown ?

Le style Légende n’a pas d’équivalent Markdown, la légende devient donc un paragraphe ordinaire, et le champ `SEQ` qui produisait son numéro s’effondre en la dernière valeur calculée par Word. Réécrivez les légendes soit en lignes italiques sans numéros, qui ne peuvent pas devenir obsolètes, soit en HTML `<figure>` et `<figcaption>` là où les figures comptent.

### Les renvois peuvent-ils survivre à une conversion de Word vers Markdown ?

Pas en tant que renvois. Un champ `REF` ou `PAGEREF` devient le texte que Word a calculé en dernier, « voir la section 4.2 page 11 » arrive donc d’apparence correcte tout en ne pointant vers rien. Réécrivez chacun en lien Markdown vers l’ancre du titre visé, et supprimez tout ce qui se réfère à un numéro de page.

### Où sont passées mes zones de texte ?

Probablement nulle part — le texte n’a jamais été extrait. Une zone de texte est un objet de dessin plutôt qu’une partie du flux du document, et beaucoup de convertisseurs n’atteignent pas son intérieur, sans signaler la moindre erreur. Recherchez dans le fichier converti une phrase que vous savez présente dans chaque zone, et retapez ce qui manque tant que vous avez encore l’original ouvert.

### Dois-je garder le .docx original après la conversion ?

Oui, toujours. Chaque perte décrite ici est à sens unique, et l’original est le seul registre restant de ce que disait le pied de page, quels éléments étaient surlignés, qui a proposé quelle suppression, et ce qui se trouvait dans l’encart latéral. Cela coûte quelques centaines de kilo-octets et répond à des questions que le Markdown ne peut pas résoudre.

### Cela vaut-il la peine de convertir un document conçu graphiquement, comme une brochure ?

En général, non. Une brochure ou une affiche est une mise en page dans laquelle les mots sont placés, plutôt qu’un document dans lequel ils coulent, et la convertir produit des fragments de prose décousus, la conception ayant disparu. Si l’artefact, c’est la conception elle-même, gardez-le en PDF et écrivez la version Markdown depuis zéro le jour où vous en aurez besoin.
