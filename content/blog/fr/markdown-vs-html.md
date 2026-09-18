---
title: "Markdown ou HTML : dans lequel écrire, et quand changer"
description: "Markdown ou HTML ? Décidez d’après ce qui attend le document — relecture, conversion, mise en page exacte, parties interactives — et quelles limites sont des atouts"
date: 2026-08-15
tag: Workflow
keywords: markdown ou html, différence entre markdown et html, quand utiliser markdown, html brut dans markdown, limites de markdown, markdown vs html, écrire de la documentation en markdown
---

Personne ne demande « Markdown ou HTML ? » dans l’abstrait. La question arrive attachée à un fichier : un manuel d’exploitation que quelqu’un doit tenir à jour, une page qui doit ressembler exactement à la version imprimée, un gabarit qui doit survivre à Outlook. Les deux formats ne se disputent pas le même travail, et la discussion ne se tranche qu’en demandant ce qu’il advient du document une fois que vous avez fini de l’écrire.

### En bref

Écrivez du Markdown quand le document sera lu, relu, modifié par d’autres personnes et probablement converti ; écrivez du HTML quand la mise en page, l’interactivité ou le canal de distribution constituent le contenu. Les limites de Markdown sont précisément ce qui le rend relisible — un fichier incapable d’exprimer une mise en page sur deux colonnes est aussi incapable de dissimuler une modification dans un diff. Le HTML brut au milieu du Markdown est la bonne porte de sortie pour une figure, un iframe, un `<details>` — et un signal d’alarme quand il apparaît un paragraphe sur trois. Les exceptions où il faut commencer en HTML et y rester sont étroites et faciles à reconnaître : les gabarits de courriel, tout ce qui exige une mise en page exacte, et tout ce qui a des pièces mobiles.

L’essentiel des frictions que l’on impute au format relève en réalité d’un mauvais appariement. Quelqu’un rédige un document de politique interne en HTML parce que l’artefact final est une page web, et dix-huit mois plus tard plus personne n’arrive à en relire une modification, parce que le diff fait quarante lignes de balisage remué autour de trois mots changés. Quelqu’un d’autre rédige en Markdown une facture prête à imprimer, découvre qu’il n’existe aucun moyen de forcer un saut de page, et finit par coller `<div style="page-break-after: always">` au milieu d’un paragraphe.

Les deux sens de l’erreur coûtent la même chose : le format a cessé de correspondre à l’avenir du document. Markdown est un format d’écriture qui se convertit en format de publication. HTML est le format de publication. Choisir, c’est décider lequel de ces deux métiers domine la vie du fichier.

Le reste de cet article, c’est cette décision, cas par cas, plus les endroits où l’on se trompe : ce que Markdown ne sait réellement pas faire et pourquoi c’est une qualité plutôt qu’un manque, où la porte de sortie du HTML brut est légitime, et ce que l’on paie quand la réponse habituelle — « écrivez du Markdown et convertissez » — se révèle mauvaise.

## Ce que ce choix tranche vraiment

La différence visible, c’est la syntaxe : `## Titre` contre `<h2>Titre</h2>`. C’est la différence la moins intéressante, et c’est la seule que traitent la plupart des comparatifs.

Ce que vous choisissez en réalité, c’est l’endroit où habite la présentation. En HTML, la structure et la présentation logent dans le même fichier, ou au moins dans le même dépôt, reliées par des classes et une feuille de style. Changez le titre et il vous faudra peut-être changer l’enveloppe, la classe, et la règle CSS qui la vise. En Markdown, la présentation habite entièrement hors du document. Le fichier déclare « ceci est un titre de niveau deux » et refuse de dire quoi que ce soit sur l’apparence d’un titre de niveau deux. Cette unique contrainte est ce qui rend un fichier Markdown portable, comparable ligne à ligne, et sans danger à confier à quelqu’un qui n’écrit pas de code.

Vous choisissez aussi l’étendue de la surface modifiable. Un document HTML possède des milliers d’états licites, et la plupart d’entre eux sont cassés d’une manière ou d’une autre — un `<li>` jamais refermé, un `<div>` imbriqué dans un `<p>`, un attribut égaré que le navigateur répare en silence et qu’un validateur signale. Un document Markdown ne comporte qu’une poignée de constructions et n’offre presque aucun moyen de casser l’analyse. Le pire qui arrive d’ordinaire, c’est qu’une liste s’affiche comme un paragraphe, ce qui se voit immédiatement.

Et vous choisissez qui sera le deuxième auteur. C’est ce point qui tranche la majorité des cas réels. Si la réponse est « un ingénieur d’astreinte à deux heures du matin », « une juriste », « un chef de produit » ou « quelqu’un dans six mois qui n’a jamais vu ce dépôt », il faut un format dont le seuil d’entrée est bas. Si la réponse est « le même développeur front-end que celui qui l’a écrit », le seuil ne compte pas, et c’est le plafond qui compte.

Trois questions règlent presque tous les cas :

- **Quel est l’artefact final ?** Une page web, un PDF, un courriel, un panneau d’aide dans une application, ou un fichier dans un dépôt que les gens lisent comme du texte.
- **Qui le modifie après vous ?** Un développeur, une équipe mixte, ou le grand public.
- **Y a-t-il quelque chose qui doit être exact ?** Des sauts de page exacts, des largeurs de colonne exactes, un rendu exact dans un client donné. L’exactitude est l’argument le plus fort qui existe en faveur de HTML.

## Markdown contre HTML : le tableau de bord

Un seul tableau, à lire en travers. La troisième colonne est l’option que l’on oublie avoir : écrire du Markdown, le convertir, et traiter le HTML comme un produit de compilation plutôt que comme un fichier source.

| Question | Markdown | HTML écrit à la main | Markdown, converti en HTML |
| --- | --- | --- | --- |
| Coût d’écriture d’une page de prose | Le plus bas : la syntaxe s’efface | Le plus élevé : balises, imbrication, enveloppes | Le plus bas, plus une étape de build |
| Ce que montre une relecture de code | Les mots changés | Les mots changés, noyés dans du balisage changé | Les mots changés dans la source ; la sortie est régénérée |
| Qui peut le modifier sans risque | Quiconque sait taper au clavier | Les gens à l’aise avec le balisage | Tout le monde, du côté Markdown |
| Mise en page exacte — colonnes, sauts de page | Inexprimable | Contrôle total | Seulement ce que le gabarit propose |
| Parties interactives — formulaires, scripts, composants | Inexprimable | Natif | Seulement via le passage du HTML brut |
| Rendu fiable dans les clients de courriel | Non | Oui, avec un balisage propre au courriel | Non, pas sans un gabarit propre au courriel |
| Tableaux | Grilles simples seulement, sans fusion ni imbrication | N’importe quel tableau | Aussi bien que la variante l’autorise |
| Attributs d’accessibilité — `lang`, `scope`, ARIA | Le plus souvent absents | Complets | Du gabarit, pas de la prose |
| Risque de livrer un script par accident | Faible, jusqu’à ce que le HTML brut soit permis | C’est votre script | Dépend entièrement de l’assainissement |
| Lisible dans dix ans sans outillage | Oui, c’est de la prose | Oui, mais cela se lit comme du balisage | La source reste lisible |
| Où habite la mise en forme | Nulle part dans le fichier | Dans le fichier ou dans sa feuille de style | Dans le convertisseur ou dans le gabarit |
| Ce que vous pouvez envoyer à quelqu’un | Un fichier `.md` qu’il ne saura peut-être pas ouvrir | Un fichier qui s’ouvre, s’il est autonome | Un document HTML complet |

Le motif qui traverse ce tableau est constant. Markdown gagne toutes les lignes qui parlent de gens et de durée. HTML gagne toutes les lignes qui parlent de contrôle et de distribution. La troisième colonne, ce sont les victoires de Markdown sur les gens et la durée, assorties de la distribution du HTML, au prix d’une étape de conversion dont vous devenez propriétaire.

## Les cas, tranchés par la destination

Rien de ce qui suit ne relève du goût. Chaque cas a une destination, et c’est la destination qui choisit le format.

### La documentation qui vit à côté du code — Markdown

Si le document se trouve dans un dépôt, à côté de ce qu’il décrit, il doit être en Markdown. Il est relu dans la même pull request que la modification qu’il documente, et c’est le seul mécanisme qui maintienne réellement une documentation à jour. GitHub, GitLab et tous les hébergeurs de code le rendent sans build. Les nouveaux arrivants le modifient sans apprendre une chaîne d’outils.

L’option HTML échoue ici d’une manière bien précise : la documentation cesse d’être relue. Un relecteur qui voit un diff de 60 lignes de balisage pour une correction de deux phrases approuve sans lire, et à partir de là les documents dérivent. [Garder la documentation dans le dépôt](/blog/documentation-that-lives-in-the-repo) est une décision de méthode de travail plus que de mise en forme, et Markdown est le format qui rend cette méthode assez peu coûteuse pour qu’on la tienne.

**Pour qui ?** Les équipes de développement, et quiconque a un document dont le numéro de version est accroché à une base de code.

### Les fichiers README, les journaux de versions, les guides de contribution — Markdown

Ces fichiers sont lus comme du texte aussi souvent que comme des pages. Un journal de versions se fouille au grep, se compare, se colle dans une note de publication et se lit parfois dans un terminal depuis un téléphone. HTML dégrade chacun de ces usages et n’en améliore aucun.

**Pour qui ?** Tous les dépôts, sans exception qui vaille la peine d’être discutée.

### Les notes, les brouillons et tout ce à quoi vous réfléchissez encore — Markdown

Écrire du HTML pendant que l’on compose de la prose partage l’attention entre la phrase et son contenant. Les gens qui écrivent le plus de Markdown ne sont pas des développeurs qui publient des sites ; ce sont des gens qui prennent des notes, et le format survit parce qu’il reste à l’écart. Il existe quantité d’éditeurs conçus uniquement pour cela, et les bons rendent la syntaxe presque invisible.

**Pour qui ?** Quiconque a un premier jet qui n’est pas l’artefact.

### Un document à envoyer à une personne précise — du Markdown, converti

Ici, aucun des deux formats ne répond seul. Vous voulez écrire du Markdown et remettre du HTML, parce qu’un fichier `.md` est une demande faite au destinataire d’installer ou d’ouvrir quelque chose, tandis qu’un fichier HTML complet est un document qui s’ouvre avec ce qu’il a déjà.

La propriété importante de la sortie, c’est qu’elle soit autonome : doctype, `<head>`, styles intégrés, aucune requête vers un CDN pour une police ou une feuille de style. Un fragment — `<h1>Titre</h1><p>Texte</p>` sans rien autour — est du HTML parfaitement licite, et il s’affiche en texte noir sans style à la largeur par défaut du navigateur, ce qui, pour toute personne qui le reçoit, ressemble à quelque chose de cassé.

**Pour qui ?** Une proposition commerciale, un rapport, un document de passation, une spécification destinée à un client.

### Un site, un portail de documentation, un blog — du Markdown, converti par un générateur

Plusieurs documents qui se renvoient les uns aux autres ont besoin d’une navigation, de flux, d’une recherche et d’un gabarit commun. C’est le travail d’un générateur de site statique, et tous prennent du Markdown en entrée pour la même raison : personne n’a envie d’écrire cent pages de balisage à la main. Dans ce dispositif, le HTML est généré, et aucun humain ne devrait le modifier.

**Pour qui ?** Quiconque publie un ensemble de pages plutôt qu’une page.

### Les gabarits de courriel — du HTML, et un dialecte bien particulier

C’est le cas le plus net où Markdown est le mauvais point de départ, et la raison mérite d’être énoncée avec précision. Le HTML des courriels n’est pas le HTML que l’on écrit pour les navigateurs. Les clients divergent sur le CSS qu’ils prennent en charge, certains suppriment purement et simplement un bloc `<style>`, si bien que les styles doivent être posés en ligne sur chaque élément, et la mise en page se construit encore couramment avec des tableaux imbriqués plutôt qu’avec flexbox ou grid. Outlook sous Windows affiche depuis des années le courrier HTML au moyen du moteur de rendu de Microsoft Word et non d’un moteur de navigateur, ce qui explique pourquoi tant de balisage de courriel semble avoir été écrit en 2003 : il n’a pas le choix.

Aucun convertisseur Markdown ne vise cette cible. Un convertisseur produit du HTML conforme aux standards, destiné à un navigateur, et le HTML conforme aux standards destiné à un navigateur est exactement ce qu’un client de messagerie hostile saccage. Vous pouvez écrire le corps du texte en Markdown et coller la sortie convertie dans un gabarit, mais le gabarit lui-même est du HTML fabriqué à la main, ou fabriqué par une infrastructure conçue pour le courriel comme MJML, qui compile sa propre syntaxe de composants vers le balisage à tableaux imbriqués que les clients tolèrent. MJML est gratuit et open source.

**Pour qui ?** Quiconque envoie du courrier qui doit avoir la même allure dans plus de trois clients. Écrivez le gabarit en HTML une bonne fois ; n’essayez pas de le générer.

### Tout ce dont la mise en page est le contenu — du HTML et du CSS

Factures, attestations, contrats aux clauses numérotées qui ne doivent pas se couper d’une page à l’autre, affiches, formulaires, tout ce qui comporte une grille de colonnes fixe ou un pied de page qui doit se tenir en bas de chaque page imprimée. Markdown ne sait rien exprimer de tout cela, et aucune extension raisonnable ne le fera, parce qu’il s’agit d’instructions de présentation et que toute la conception de Markdown consiste à exclure les instructions de présentation.

Les outils sont ici ceux du CSS pour les médias paginés — `@page` pour les marges, `break-inside: avoid` pour garder entière une ligne de tableau, `break-after` pour forcer une nouvelle page — et ils s’appliquent à du HTML. Si la destination est un artefact imprimé soumis à des règles sur sa tenue dans la page, commencez en HTML. S’il s’agit d’un document qui finit accessoirement en PDF, du Markdown converti en HTML puis imprimé depuis le navigateur suffit en général ; [ce que l’on gagne et ce que l’on perd par cette voie](/blog/markdown-to-pdf) mérite d’être connu avant de s’y engager.

**Pour qui ?** Les documents financiers, les documents juridiques, tout ce qui part chez un imprimeur.

### Tout ce qui a des pièces mobiles — du HTML

Des formulaires qui s’envoient, des onglets, des filtres, des graphiques qui réagissent à une saisie, une calculatrice, un champ de recherche, un tableau que l’on peut trier, un lecteur vidéo aux commandes personnalisées. Ce ne sont pas des documents agrémentés de décoration ; ce sont de petites applications. Markdown n’a pas de syntaxe pour cela et ne devrait pas en acquérir.

L’indice, c’est de savoir si le lecteur fait autre chose que lire. S’il clique sur quelque chose qui change ce qu’il voit, vous construisez du HTML, et la prose qu’il contient n’est qu’une petite partie du fichier.

**Pour qui ?** Les interfaces applicatives, les pages marketing dotées d’interactions, les tableaux de bord.

### Du contenu en base de données, modifié par des non-techniciens — en général ni l’un ni l’autre, directement

Cela vaut la peine d’être nommé, car c’est fréquent et souvent mal classé. Si le service marketing modifie les textes via un CMS, le format stocké est celui que produit ce CMS — souvent du HTML issu d’un éditeur de texte enrichi, parfois une structure de blocs en JSON. Choisir Markdown à cet endroit, c’est demander à des rédacteurs non techniques d’apprendre une syntaxe et de prévisualiser leur travail dans une seconde fenêtre. Certaines équipes s’en accommodent très bien ; la plupart cessent discrètement d’utiliser le CMS.

**Pour qui ?** Les équipes où le public visé est le rédacteur, pas le développeur.

## Ce que Markdown refuse délibérément de faire

La liste qui suit se lit comme un inventaire de fonctions manquantes. Elle est plus proche d’un cahier des charges. Chaque élément a été écarté pour que le format reste assez petit pour se lire en texte brut, et chaque omission achète quelque chose.

**Aucune mise en forme visuelle, d’aucune sorte.** Il n’existe pas de syntaxe pour la couleur, la police, la taille, l’alignement ou l’espacement. Ce que vous obtenez, c’est une affirmation sur la structure — titre, liste, mise en valeur — et la décision sur l’apparence est reportée sur ce qui rendra le fichier. Ce que cela achète : un même document s’affiche correctement dans un hébergeur de code, dans l’aperçu d’un éditeur, dans un terminal, dans un site statique et dans un fichier HTML converti, parce qu’aucun d’eux n’a besoin de s’entendre avec les autres sur l’apparence.

**Aucune mise en page.** Pas de colonnes, pas de flottants, pas de sauts de page, aucun contrôle sur la position de quoi que ce soit. Un document Markdown est une colonne unique de blocs dans l’ordre du source. Ce que cela achète : il se recompose sur un téléphone sans le moindre effort, et il se convertit vers n’importe quelle mise en page voulue par le gabarit au lieu de lui résister.

**Aucun attribut sur les éléments.** Le Markdown d’origine n’offre aucun moyen d’ajouter une classe, un identifiant, un `lang`, un `title` ou un rôle ARIA. Plusieurs implémentations l’ajoutent en extension — les listes d’attributs de Python-Markdown, `markdown-it-attrs`, les divs encadrées de Pandoc — et dès l’instant où vous en utilisez une, votre fichier est lié à cette implémentation. Ce que cela achète : un fichier sans attributs ne peut pas transporter de présentation propre à un outil, il reste donc portable.

**Les tableaux sont des grilles, et rien de plus.** Le GitHub Flavored Markdown vous donne une ligne d’en-tête, un alignement par colonne, et des cellules contenant du contenu en ligne. Pas de `colspan`, pas de `rowspan`, pas de tableau imbriqué, pas de cellule contenant une liste ou un changement de paragraphe, pas de légende. Si votre tableau a besoin de l’un de ces éléments, il vous faut du HTML pour ce tableau. Ce que cela achète : le tableau reste lisible dans le fichier source, ce qu’un tableau HTML n’est pas. Les tableaux sont par ailleurs ce qui casse le plus souvent en chemin, et [les garder intacts à la conversion](/blog/markdown-tables-that-survive-conversion) obéit à ses propres règles.

**Ni notes de bas de page, ni listes de définitions, ni mathématiques dans la spécification de base.** CommonMark n’en a aucune. GFM ajoute les tableaux, les listes de tâches, le texte barré et les liens automatiques, et s’arrête là. Les notes de bas de page, les listes de définitions, les mathématiques en `$…$` et les blocs d’avertissement sont tous des extensions, prises en charge par certains analyseurs et rendues en silence comme du texte littéral par d’autres. Ce que cela achète : une petite spécification que beaucoup d’implémentations mettent réellement en œuvre correctement. Cela signifie aussi que « Markdown gère X » est presque toujours une affirmation sur un analyseur plutôt que sur Markdown ; [les différences entre les variantes](/blog/commonmark-gfm-and-the-flavours) sont la source de la plupart des surprises d’un outil à l’autre.

**Aucun contenu conditionnel, aucune inclusion, aucune variable.** Vous ne pouvez pas dire « n’affiche ce paragraphe que pour l’édition entreprise » ni « insère ici le bloc de licence ». Les générateurs de sites statiques greffent cela avec du front matter et une syntaxe de gabarit, ce qui est exactement le moment où votre Markdown cesse d’être du Markdown portable. Ce que cela achète : ce que vous lisez est ce qui s’y trouve.

**Aucune sémantique au-delà d’une douzaine de constructions.** Pas de `<figure>` avec `<figcaption>`, pas d’`<abbr>`, pas de `<time>`, pas d’`<aside>`, pas de `<section>` dotée d’un titre qui la nomme. Pour les documents qui doivent satisfaire une norme d’accessibilité, c’est une vraie lacune, et elle est comblée soit par le gabarit de conversion, soit par du HTML brut dans le fichier.

Le motif : Markdown refuse de décrire l’apparence, et refuse d’être extensible d’une manière qui lierait un document à un outil unique. Ces deux refus expliquent qu’un fichier `.md` de 2011 fonctionne encore partout aujourd’hui. Un format qui aurait accepté toutes les demandes de fonctionnalité raisonnables serait devenu un HTML moins bon doté d’un écosystème plus petit.

## Le HTML brut dans du Markdown : la porte de sortie et le symptôme

Markdown a toujours autorisé le HTML brut au milieu d’un document. Le Markdown d’origine le permettait à dessein, et CommonMark spécifie le comportement du HTML de bloc comme du HTML en ligne. L’alternative stricte du titre est donc légèrement fausse : vous pouvez écrire du Markdown et basculer en HTML pour un seul élément.

Que ce soit une bonne idée dépend de la fréquence à laquelle vous le faites et de ce que vous allez y chercher.

### Là où c’est la bonne réponse

| Cas | Pourquoi le HTML a raison ici |
| --- | --- |
| Un bloc repliable — `<details><summary>` | Aucune syntaxe Markdown n’existe, cela dégrade en texte visible, et c’est une seule paire de balises |
| Une vidéo ou une carte intégrée par iframe | Markdown n’a pas de syntaxe d’intégration ; l’autre voie est un greffon qui lie le fichier à un seul moteur de rendu |
| Une figure avec une vraie légende | `<figure>` et `<figcaption>` portent une sémantique que `![alt](src)` ne peut pas porter |
| Un tableau avec une cellule fusionnée | La syntaxe en grille ne sait réellement pas l’exprimer ; un tableau HTML est honnête |
| Une ancre pour pointer au milieu du document | `<a id="section-3"></a>` là où le moteur de rendu ne génère pas d’identifiants de titre |
| Un attribut `lang` sur un passage cité | Nécessaire à la prononciation correcte par un lecteur d’écran, impossible autrement |
| Un badge isolé ou une image en ligne de largeur fixe | Rare, circonscrit, et évident pour le lecteur suivant |

Le fil commun : l’élément est petit, autonome, et il n’existe pas de construction Markdown pour lui. Il apparaît une ou deux fois dans le fichier, un lecteur voit ce qu’il fait, et le retirer ferait perdre du sens plutôt que de la décoration.

### Là où c’est un symptôme

Le HTML brut vous dit quelque chose quand il se présente ainsi :

- **Des enveloppes autour de prose ordinaire.** `<div class="callout">` avec trois paragraphes normaux à l’intérieur. Vous réimplémentez un gabarit à l’intérieur du contenu, et désormais chaque document qui veut un encadré dépend d’une classe CSS qui vit ailleurs.
- **Des styles en ligne.** `<span style="color: #c00">` dans un paragraphe. Vous avez mis de la présentation dans un fichier dont toute la valeur consistait à l’exclure, et ce sera faux dès l’instant où la page aura un thème sombre.
- **Des `<br>` pour régler l’espacement.** Le plus souvent le signe que le vrai problème tient au comportement des sauts de ligne et des listes plutôt qu’à une fonction manquante.
- **Des sections entières en HTML.** Si les deux tiers du fichier sont du balisage, c’est un fichier HTML avec un peu de Markdown dedans. Renommez-le et cessez de faire semblant.
- **Des tableaux en HTML sans raison structurelle.** Si le tableau est une grille simple et que quelqu’un l’a écrit en HTML pour la mise en forme, cette mise en forme a sa place dans le gabarit.
- **Tout ce qui s’exécute.** `<script>`, `onclick`, les URL `javascript:`. Un document qui s’exécute n’est pas un document.

Deux conséquences pratiques en découlent.

La première tient à la portabilité. Le HTML brut passe proprement vers une sortie HTML, et nulle part ailleurs. Convertissez ce fichier en PDF, en document Word, en texte brut ou en vue de terminal, et le HTML disparaît, apparaît sous forme de chevrons littéraux, ou casse le convertisseur. Plus un fichier contient de HTML brut, plus il s’est discrètement engagé auprès d’un format de sortie unique.

La seconde tient à la sécurité, et elle n’est pas théorique. Parce que Markdown autorise le HTML brut, un fichier `.md` peut transporter une balise `<script>`, un gestionnaire `onerror` ou un lien `javascript:`, et un convertisseur fidèle remet les trois au navigateur. Pour vos propres notes, cela n’a pas d’importance. Pour un README venu d’un dépôt que vous n’avez pas écrit, pour un document envoyé par un client, ou pour du contenu soumis par des utilisateurs, cela décide si votre page attaque son lecteur — et c’est pourquoi [l’assainissement est une étape à part, avec ses propres règles](/blog/sanitising-markdown-safely), plutôt qu’une chose qu’on peut supposer faite par un convertisseur. Certains analyseurs échappent le HTML brut par défaut et d’autres le laissent passer ; il faut savoir lequel vous utilisez.

Une règle de maison praticable : le HTML brut est autorisé pour les éléments que Markdown ne sait pas exprimer, et interdit pour l’apparence. S’il faut ajouter une classe CSS pour que cela ait l’air correct, la chose appartient au gabarit.

## Relecture, collaborateurs et longévité

Ces trois arguments reçoivent moins d’attention que la syntaxe et tranchent bien plus de cas réels.

### Comparer de la prose

Le contrôle de version compare des lignes. C’est le fait le plus lourd de conséquences pour qui écrit des documents dans un dépôt, et il explique l’essentiel de l’avantage de Markdown.

En Markdown, modifier une phrase modifie les mots de cette phrase. Un relecteur voit l’ancienne formulation et la nouvelle côte à côte et peut juger s’il s’agit d’une amélioration. En HTML, la même retouche peut arriver emballée dans des attributs changés, un bloc réindenté ou un `</p>` déplacé, et le travail du relecteur tourne à l’archéologie. Pire, le HTML incite à reformater, et un commit de reformatage qui change aussi trois mots est un commit que personne ne relit correctement.

Deux techniques améliorent encore les diffs Markdown, et aucune n’est disponible dans un fichier lourdement balisé :

- **Une phrase par ligne.** Coupez aux frontières de phrase plutôt qu’à une colonne donnée. Une phrase modifiée devient alors un diff d’une ligne, et déplacer une phrase est un déplacement plutôt qu’une réécriture de paragraphe. Cela paraît étrange dans le fichier brut pendant à peu près une journée.
- **Les diffs au mot.** `git diff --word-diff` montre les mots changés plutôt que les lignes changées, ce qui transforme un paragraphe reformaté d’un mur de rouge et de vert en une poignée de substitutions.

Aucune de ces astuces ne sauve le HTML, parce qu’en HTML le bruit n’est pas dans les espaces, il est dans la structure.

### Qui d’autre devra modifier le fichier

Demandez-vous honnêtement qui touchera au fichier après vous, puis accordez le format à la personne la moins technique de cette liste. C’est une contrainte de conception, pas une politesse.

| Deuxième auteur | Ce qu’on peut lui demander |
| --- | --- |
| Le même développeur | N’importe quoi. Le format est une préférence |
| Un autre développeur, plus tard | Markdown. Il n’apprendra pas vos noms de classes pour corriger une coquille |
| Un chef de produit ou un ingénieur du support | Markdown, avec un aperçu disponible. Les retouches en HTML seront évitées ou ratées |
| Une juriste ou une équipe financière | Ni l’un ni l’autre : ils travailleront dans Word, et quelqu’un convertira |
| Un traducteur | Markdown, et il vous en remerciera — le balisage autour du texte est l’endroit où logent les erreurs de traduction |
| Le grand public, par pull request | Markdown, assaini. Les contributions en HTML sont une charge de relecture et une surface d’attaque |

Le mode de défaillance du HTML n’est pas que les gens le modifient mal. C’est qu’ils ne le modifient pas du tout. Ils vous envoient un message pour vous demander de changer un mot, ou bien ils ne changent rien et laissent le document vieillir. Toute documentation morte d’obsolescence est morte en partie d’un format qui faisait paraître risquée la moindre correction.

### La longévité

Un fichier Markdown est un fichier texte qui se lit correctement sans le moindre logiciel. Ouvrez-le dans le Bloc-notes dans quinze ans et les titres seront toujours visiblement des titres. C’est une propriété rare, et elle découle du refus du format d’encoder l’apparence.

Le HTML est durable lui aussi — les navigateurs continuent d’afficher du vieux balisage, et un fichier HTML autonome aux styles intégrés est l’un des meilleurs formats de document à long terme qui soient. Les ennuis viennent de ce dont le HTML moderne a tendance à dépendre, plutôt que du HTML lui-même : une feuille de style sur un CDN qui cesse de répondre, une police venue d’un service qui a changé ses conditions, un script issu d’un paquet qui n’existe plus, des noms de classes qui ne veulent rien dire sans l’infrastructure qui les a définis. Une page qui va chercher quatre choses sur le réseau est à quatre pannes futures de devenir illisible.

Le classement en longévité est donc : d’abord la source Markdown, ensuite le HTML autonome, loin derrière le HTML aux dépendances externes, et en dernier tout ce qui a besoin d’un système de build pour s’afficher. C’est un argument de plus pour garder le Markdown comme source de vérité et traiter le HTML comme une sortie : la chose durable est le fichier que vous savez encore lire, et la chose jetable est le fichier que vous savez régénérer.

## Là où « écrire du Markdown et convertir » échoue, et ce que cela coûte

Le conseil habituel de cet article est le bon conseil la plupart du temps. Il vaut la peine d’être précis sur les moments où il ne l’est pas, car l’échec est rarement spectaculaire : c’est une lente accumulation de contournements, jusqu’à ce que quelqu’un s’aperçoive que la chaîne coûte plus cher que les documents ne valent.

**Quand la sortie est retouchée à la main.** Dès l’instant où quelqu’un ouvre le HTML généré et y corrige quelque chose, le Markdown cesse d’être la source de vérité et vous avez deux fichiers divergents. La conversion suivante jette sa correction en silence. C’est de loin la façon la plus fréquente dont une chaîne Markdown vers HTML pourrit, et la seule défense est une règle interdisant de modifier les fichiers générés, appliquée en les rangeant dans un endroit manifestement jetable.

**Quand la maquette exige un contrôle élément par élément.** Si le cahier des charges comporte « cette citation en exergue fait 60 % de large, alignée à droite, sur un aplat de la couleur de la marque du client », Markdown vous résistera à chaque élément. Vous pouvez l’exprimer avec du HTML brut et des styles en ligne, moyennant quoi vous avez un fichier HTML assorti d’étapes supplémentaires. Coût : des heures de contournements, et un fichier que personne ne peut maintenir.

**Quand l’exactitude est contractuelle.** Tout ce qui a une mise en page imposée — un dépôt réglementaire, un format de facture analysé par le système d’un client, une attestation dont le bloc de signature doit occuper une position fixe. Coût : tout le chemin de rendu doit être contrôlé, et contrôler un chemin de rendu depuis Markdown revient à contrôler un gabarit, à un cran de distance.

**Quand le canal a son propre dialecte.** Le courriel, traité plus haut. Mais aussi le texte enrichi stocké en HTML dans une application, et tout ce qui est consommé par un système qui attend un balisage précis. Coût : la sortie propre et conforme aux standards d’un convertisseur est exactement la mauvaise sortie.

**Quand le document est interactif.** Aucune quantité de conversion ne produit du comportement. Coût : nul, si vous vous en apercevez tôt. Considérable, si vous écrivez quarante pages de Markdown avant de découvrir que la section 9 a besoin d’un formulaire qui fonctionne.

**Quand la variante dérive.** Votre Markdown s’affiche correctement chez votre hébergeur de code et incorrectement dans votre build, parce que les deux font tourner des analyseurs différents. Les notes de bas de page, les listes de tâches, l’indentation des listes imbriquées et les liens automatiques sont les suspects habituels. Coût : une catégorie de bogues qui n’apparaît que dans la sortie publiée, c’est-à-dire au pire endroit possible pour en découvrir un.

**Quand le fichier est réellement énorme.** Un document unique de plusieurs mégaoctets se prête mal à une conversion côté navigateur, et au-delà d’un certain point il se prête mal à être un seul document. Coût : découpez-le, ou déplacez la conversion vers une étape de build où la mémoire n’est pas celle d’un onglet.

**Quand la chaîne devient elle-même le travail.** Un convertisseur, un gabarit et un script, cela va. Quatre convertisseurs, une suite de greffons, un filtre Lua maison et un conteneur pour le faire tourner, cela devient un projet, et un projet a besoin d’un propriétaire. Coût : quiconque en est propriétaire ne peut plus partir sans passation, et les chaînes de documentation ont une fâcheuse tendance à finir entre les mains de la seule personne qui avait compris le gabarit.

Rien de tout cela n’est un argument contre Markdown pour la prose. Ce sont des arguments pour remarquer, avant de commencer, lequel des deux métiers — écrire ou présenter — domine le fichier.

## Comment choisir

Cinq critères, chacun avec sa conséquence attachée.

1. **Nommez l’artefact final avant la première ligne.** Si c’est une page web, un PDF ou un fichier dans un dépôt, écrivez du Markdown ; si c’est un courriel, un document imprimé à mise en page fixe ou une interface, écrivez du HTML. Se tromper là-dessus coûte une réécriture, et la réécriture survient toujours plus tard qu’elle ne le devrait.
2. **Accordez le format à la personne la moins technique qui le modifiera.** Si un ingénieur du support ou un traducteur doit corriger une phrase dans l’urgence, le HTML signifie qu’il vous le demandera à la place, et que le document vieillira entre deux demandes.
3. **Partez du principe que chaque modification sera relue par quelqu’un de pressé.** Markdown fait qu’une phrase modifiée ressemble à une phrase modifiée ; le HTML fait qu’elle ressemble à un fichier modifié, et les relecteurs approuvent ce qu’ils n’arrivent pas à lire.
4. **Comptez les parties interactives.** Un bloc `<details>` est une porte de sortie ; un formulaire, une barre d’onglets ou un graphique signifient que le document est une application et que Markdown est le mauvais format source pour lui.
5. **Décidez qui possède la mise en forme, et écrivez-le quelque part.** Si c’est le gabarit, tenez la présentation entièrement hors du contenu ; si c’est l’auteur, vous avez choisi le HTML, que l’extension du fichier le dise ou non — et la personne qui modifiera ce fichier après vous héritera de votre CSS en même temps que de votre prose.

## Conclusion

Écrivez du Markdown par défaut, convertissez-le, et gardez le HTML comme un produit de compilation auquel vous ne touchez jamais : ce dispositif vous donne de la prose relisible, des rédacteurs que le fichier n’effraie pas, et une sortie qui s’ouvre n’importe où, ce qui représente l’essentiel de ce qu’on attend d’une chaîne documentaire. Passez au HTML délibérément et complètement quand la destination l’exige : les gabarits de courriel qui doivent survivre au moteur de rendu d’un client de messagerie, les documents dont la mise en page fait partie de la spécification, et tout ce avec quoi le lecteur interagit au lieu de le lire. Quand l’étape dont vous avez besoin est l’étape ordinaire — du Markdown en entrée, une page complète et autonome en sortie, rien de téléversé —, [TransformPipe la fait dans le navigateur](/), gratuitement et sans installation ; quand il s’agit de l’une des exceptions, passez le temps qu’il faut dans le HTML et cessez de vous en excuser.

## FAQ

### Markdown est-il meilleur que HTML ?

Ni l’un ni l’autre n’est meilleur ; ils répondent à des questions différentes. Markdown est un format d’écriture optimisé pour des gens qui modifient du texte et relisent des changements, et HTML est un format de distribution optimisé pour le contrôle de ce qu’un navigateur ou un client affiche. Le dispositif courant — écrire du Markdown, convertir en HTML — se sert de chacun pour le travail auquel il excelle.

### Puis-je utiliser du HTML dans un fichier Markdown ?

Oui. Le Markdown d’origine autorisait le HTML brut à dessein et CommonMark en spécifie le comportement : un bloc `<details>`, un iframe ou un tableau à cellules fusionnées peuvent donc se trouver au milieu d’un document Markdown. Servez-vous-en pour les éléments que Markdown ne sait pas exprimer, pas pour l’apparence, et sachez que le HTML brut ne survit qu’à la conversion vers HTML — les autres formats de sortie le suppriment ou l’abîment.

### Markdown est-il sûr s’il peut contenir du HTML ?

Seulement si quelque chose l’assainit. Parce que le HTML brut est permis, un fichier `.md` peut transporter `<script>`, `onerror=` ou une URL `javascript:`, et un moteur de rendu fidèle remettra les trois au navigateur. Certains analyseurs échappent le HTML brut par défaut et d’autres le laissent passer : vérifiez donc le comportement du vôtre avant de convertir un fichier que vous n’avez pas écrit.

### Dois-je écrire mon site web en Markdown ou en HTML ?

Écrivez le contenu en Markdown et le gabarit en HTML. Tous les générateurs de sites statiques fonctionnent ainsi pour une raison : écrire à la main le balisage de cent pages est pénible et incohérent, tandis qu’écrire à la main un seul gabarit représente une quantité de travail normale. Les pages qui relèvent davantage de l’interface que de la prose — un tableau tarifaire avec un interrupteur, un parcours d’inscription — font exception et appartiennent au HTML.

### Pourquoi ne puis-je pas contrôler la mise en page en Markdown ?

Parce que la mise en page relève de la présentation, et que Markdown a été conçu pour exclure la présentation afin qu’un même fichier s’affiche raisonnablement dans un terminal, un éditeur, un hébergeur de code et une page convertie. Il n’existe pas de syntaxe pour les colonnes, les sauts de page ou les largeurs, et l’ajouter par du HTML en ligne lie le document à un format de sortie unique. Si la mise en page fait partie du besoin, c’est le signal qu’il faut écrire du HTML.

### Convertir du Markdown en HTML fait-il perdre quelque chose ?

La structure survit ; tout ce que la variante ne prend pas en charge, non. Les tableaux, les listes de tâches, le texte barré et les liens automatiques exigent le GitHub Flavored Markdown plutôt que le CommonMark simple, et les notes de bas de page, les listes de définitions et les mathématiques sont des extensions que beaucoup d’analyseurs ignorent. Convertissez un fichier représentatif et vérifiez les tableaux et les listes avant de vous engager avec un outil.

### Quel format la documentation doit-elle utiliser si l’équipe n’est pas technique ?

Markdown, mais seulement avec un aperçu sous les yeux — un éditeur Markdown, un wiki qui rend au fil de la frappe, ou un aperçu de pull request. Demander à des auteurs non techniques d’écrire une syntaxe qu’ils ne voient jamais rendue est la raison pour laquelle certaines équipes concluent que Markdown ne leur convient pas, alors que le vrai problème était l’aperçu manquant — et si la réponse est que l’équipe préférerait rester dans Word de bout en bout, [lequel des deux formats doit détenir la source](/blog/markdown-vs-docx-for-documentation) est la décision à trancher avant tout outillage.
