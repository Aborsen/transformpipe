---
title: Faire sortir le Markdown de Notion, Obsidian, Confluence et les autres
description: Chaque voie d’export hors de Notion, Obsidian, Confluence, Google Docs et Word — ce qu’elle produit, ce qu’elle abîme en silence, et comment le réparer
updated: 2026-09-14
date: 2026-07-02
tag: Workflow
keywords: exporter notion en markdown, export obsidian vers markdown, confluence vers markdown, exporter une page confluence en markdown, google docs vers markdown, convertir word en markdown, html vers markdown, notion vers markdown vers html, export evernote markdown, apple notes vers markdown, migrer un wiki vers markdown
---

Le document existe déjà : des titres, un tableau, trois captures d’écran, un encart coloré — à l’intérieur d’une application qui ne vous remettra aucun fichier. Le faire sortir tient rarement en un clic, et le clic que vous trouverez perdra quelque chose que vous remarquerez une semaine plus tard.

Ce qui complique les choses, c’est qu’aucune de ces applications ne stocke du Markdown. Elles gardent un arbre de blocs typés, ou du XHTML truffé de macros, ou un modèle de document propriétaire, et le bouton d’export est un convertisseur que quelqu’un a écrit pour passer de ce modèle à un format de fichier. Chaque convertisseur laisse tomber ce que sa cible ne sait pas exprimer. La question n’est jamais de savoir si quelque chose se perd ; elle est de savoir quoi, et si vous le découvrez maintenant ou après avoir jeté la source.

### En bref

Notion exporte un zip de Markdown et de CSV où chaque nom de fichier et chaque lien interne porte un identifiant de page, et où callouts, menus déroulants et colonnes arrivent aplatis. Obsidian est déjà du Markdown, mais dans son propre dialecte : liens wiki, inclusions et références de bloc doivent être convertis avant que quoi que ce soit d’autre puisse les lire. Confluence n’a aucun export Markdown : vous prenez l’export HTML de l’espace et le convertissez, en perdant ce que faisaient les macros. Google Docs télécharge du Markdown directement, mais ne peut pas faire tenir images et commentaires dans un seul fichier, et Word comme tout le reste passent par le HTML. À dix pages, on répare à la main ; à mille, cela devient un travail de réécriture scripté, et ce qui se réécrit, ce sont les noms de fichiers, les liens, les chemins des pièces jointes et les ancres, dans cet ordre.

| Source | Chemin d’export | Ce que vous obtenez | Ce qui est abîmé |
| --- | --- | --- | --- |
| Notion | Export, format « Markdown & CSV » | zip : un `.md` par page, des dossiers, un `.csv` par base de données | des identifiants dans chaque nom de fichier et chaque lien, callouts, menus déroulants, colonnes, commentaires |
| Obsidian | aucun export nécessaire — fichiers sur le disque | un dossier de `.md` et de pièces jointes | liens wiki, inclusions, références de bloc, callouts, blocs Dataview |
| Confluence Cloud | export d’espace en HTML (administrateur d’espace) | zip de HTML rendu plus les pièces jointes | macros, hiérarchie des pages, commentaires, ancres de titres |
| Page Confluence | Export vers Word ou PDF | un fichier par page | tout ce qui est structurel ; le PDF est une impasse |
| Google Docs | Fichier, Télécharger, Markdown | un fichier `.md` | images, commentaires, suggestions |
| Google Docs | Fichier, Télécharger, Page web | zip de HTML plus un dossier d’images | attributs de style à retirer ensuite |
| Word | le `.docx` lui-même | un zip de XML que vous convertissez | titres imités en gras, numérotation des listes, suivi des modifications |
| Evernote | export en ENEX ou en HTML | conteneur XML, ou HTML plus un dossier de ressources | métadonnées de note, tâches, mise en forme refaite à la main |
| Bear | export en Markdown ou en Textbundle | Markdown, avec les fichiers joints dans le cas du Textbundle | la syntaxe de tags propre à Bear se lit ailleurs comme un titre |
| Apple Notes | Fichier, Exporter comme, Markdown | un fichier par note | pièces jointes, tableaux, et c’est note par note uniquement |
| Roam | export depuis l’intérieur du graphe | lisez la liste des formats dans votre propre graphe avant de planifier | références de bloc et requêtes n’ont pas d’équivalent |

## Notion : un zip où chaque nom de fichier gagne un identifiant

Choisissez « Markdown & CSV » et Notion construit un zip : un `.md` par page, un dossier par page ayant eu des sous-pages ou des images, un `.csv` par base de données. Chaque nom porte un long identifiant hexadécimal : Notion identifie les pages par identifiant, et le titre n’est qu’une étiquette.

La boîte de dialogue d’export mérite d’être lue plutôt que refermée d’un clic. Elle propose un choix de format — PDF, HTML ou Markdown & CSV —, un menu « Include content » qui peut exclure fichiers et images, un interrupteur « Include subpages », et un interrupteur « Create folders for subpages » (coché sur notion.com, vérifié le 9 septembre 2026). Deux autres limites de la même page comptent avant de bâtir une migration dessus : seule la vue actuelle ou par défaut d’une base de données est exportée, exporter toutes les vues à la fois n’est pas pris en charge, et une vue formulaire ne s’exporte pas du tout — vous exportez la vue tableau à la place. Pour un export volumineux, Notion peut envoyer un lien de téléchargement par e-mail plutôt que de démarrer le téléchargement, ce lien expire au bout de sept jours, et le traitement peut prendre jusqu’à trente heures (vérifié sur notion.com, le 9 septembre 2026). C’est un fait de planification, pas une note de bas de page : si le plan était « exporter vendredi après-midi et convertir vendredi soir », ce n’est peut-être pas le bon plan.

Trois choses à attendre :

- **Les identifiants restent.** Renommez les fichiers si des personnes doivent lire les noms, puis corrigez les liens vers les anciens.
- **Les callouts s’aplatissent.** Markdown n’a aucun bloc avec icône et fond coloré, un callout revient donc sous forme de paragraphe avec l’emoji échoué au début. Les menus déroulants perdent leur capacité à se replier.
- **Les bases de données partent en CSV.** Une vue tableau est un fichier séparé, pas un tableau Markdown : la reconstruire est un travail de tableur, puis vient [la question de savoir si les barres verticales survivent](/blog/markdown-tables-that-survive-conversion).

Les images se trouvent dans le dossier de la page sous des noms générés, accessibles par des chemins relatifs encodés en pourcentage qui ne tiennent que tant que le dossier voyage avec le fichier — l’hypothèse que [les chemins relatifs font et défont](/blog/images-and-links-that-still-work).

### Ce que devient chaque type de bloc

| Dans Notion | Dans l’export | Réparation |
| --- | --- | --- |
| Callout | paragraphe, caractère d’icône au début | une convention de citation avec une amorce en gras |
| Menu déroulant | le résumé comme ligne, le contenu comme blocs suivants | un élément `<details>`, ou un titre suivi de texte simple |
| Titre déroulant | un titre, contenu intégré en dessous | généralement correct tel quel |
| Disposition en colonnes | les colonnes l’une après l’autre, dans l’ordre du document | accepter le réagencement, ou reconstruire en tableau |
| Bloc synchronisé | son contenu, copié dans chaque page qui l’affichait | choisir un emplacement de référence pour le texte et y renvoyer |
| Base de données, page entière | un fichier `.csv`, plus un `.md` par ligne ayant un corps de page | reconstruire le tableau, garder les pages de ligne comme fichiers |
| Vue de base de données liée | rien d’exploitable — la vue est une requête, pas du contenu | la recréer là où les pages atterrissent |
| Équation en ligne | le LaTeX, délimité | dépend entièrement de ce qui le rendra ensuite |
| Commentaire | absent | copier dans le corps tout ce qui n’est pas résolu, avant l’export |
| Panneau de rétroliens | absent | c’était dérivé, pas stocké |

La ligne des commentaires est celle qui prend les équipes au dépourvu. Les fils de discussion ne font pas partie du contenu de la page, un export est donc la page privée de l’argumentaire qui l’a produite. Si des décisions vivent dans les commentaires, elles disparaissent au moment où l’espace de travail est archivé.

### Le suffixe d’identifiant, et pourquoi il n’est pas seulement inesthétique

Une page nommée « Notes de réunion » ressort sous la forme `Notes de réunion 21f4c8a1b2c34d5e8f90123456789abc.md`, et un lien vers elle depuis une autre page est écrit contre ce nom de fichier exact, encodé en pourcentage pour les espaces. L’identifiant est le même que celui qui apparaît dans l’URL de la page au sein de l’application, ce qui en fait la partie utile : il vous donne une clé pour faire correspondre les anciens liens aux nouveaux.

```text
Meeting notes 21f4c8a1b2c34d5e8f90123456789abc.md    the file
Meeting%20notes%2021f4c8a1b2c34d5e8f90123456789abc.md    the link
meeting-notes.md    what you want
```

Renommez les fichiers sans réécrire les liens et vous obtenez un dossier de documents qui pointent tous les uns vers les autres sans que rien ne se résolve. C’est tout le problème de migration en miniature, et c’est pourquoi le renommage et la réécriture des liens doivent être une seule opération sur une seule table de correspondance, pas deux passes faites des après-midis différents.

Si la destination est un seul document Markdown plutôt qu’un dossier de fichiers séparés avec une table de correspondance des liens qui fonctionne, le problème d’identifiant disparaît autrement : [une conversion Notion → Markdown conçue exactement pour cela](/notion-to-markdown) prend le `.zip` d’export sans modification, fusionne chaque page en un seul document dans son ordre d’origine avec une table des matières, et transforme un lien inter-pages en les mots qu’il affichait plutôt qu’en un nom de fichier qui ne se serait de toute façon pas résolu hors de son dossier d’origine. Elle ne reconstruit pas la table de correspondance des liens par fichier évoquée plus haut — rien ne le fait automatiquement, car cela suppose de décider où chaque page vivra — mais là où l’objectif a toujours été une seule page à lire ou à partager, le suffixe d’identifiant cesse d’être un problème à résoudre. [La comparaison complète des chemins d’export](/blog/convert-notion-export-to-markdown) traite plus en profondeur du script de réécriture des identifiants et de l’alternative fondée sur l’API.

## Obsidian : déjà du Markdown, mais pas le dialecte standard

Un coffre Obsidian est un dossier de fichiers `.md`, il n’y a donc rien à extraire : le faire passer en HTML est un travail de conversion, pas un export. Le piège, c’est que plusieurs choses qu’Obsidian comprend lui sont propres.

```markdown
[[Meeting notes]]            <!-- wikilink, not standard Markdown -->
![[architecture.png]]        <!-- embed, also not standard -->

> [!warning] Careful
> This is an Obsidian callout.
```

Un convertisseur standard imprime le lien wiki et l’inclusion comme du texte littéral, crochets compris, et rend le callout comme une citation avec `[!warning]` en tête. Il faut soit désactiver dans les réglages du coffre les liens wiki pour que les nouveaux liens soient du Markdown ordinaire, soit chercher-remplacer avant de convertir.

Le réglage est l’interrupteur « Use [[Wikilinks]] » sous Fichiers et liens ; le désactiver fait qu’Obsidian génère à la place des liens Markdown standards (vérifié sur obsidian.md, le 9 septembre 2026). Cela ne s’applique qu’aux nouveaux liens. Tout ce qui a déjà été écrit reste tel quel, un coffre qui tourne depuis deux ans a donc de toute façon besoin de la réécriture — le réglage arrête la croissance du problème, il ne le corrige pas.

### Le dialecte, élément par élément

| Obsidian écrit | Un convertisseur standard voit | Que faire |
| --- | --- | --- |
| `[[Note]]` | le texte littéral, crochets compris | réécrire en `[Note](note.md)` à partir d’une table titre-vers-chemin |
| `[[Note\|libellé]]` | texte littéral | réécrire en `[libellé](note.md)` |
| `![[image.png]]` | texte littéral | réécrire en `![](image.png)` |
| `![[Note]]` | texte littéral | intégrer la note, ou la lier — la transclusion n’a pas d’équivalent |
| `[[Note#Titre]]` | texte littéral | réécrire en `note.md#titre`, puis vérifier que la règle de slug correspond à votre moteur de rendu |
| `[[Note#^id-de-bloc]]` | texte littéral | il n’y a aucune cible à lier ; intégrer le texte cité |
| `^id-de-bloc` en fin de ligne | un accent circonflexe et un mot égarés dans la sortie | à supprimer une fois que plus rien n’y renvoie |
| callout `> [!note]` | une citation avec `[!note]` sur la première ligne | retirer le marqueur, garder la citation |
| un bloc ```` ```dataview ```` | un bloc de code montrant la requête | le tableau qu’il affichait n’a jamais été dans le fichier |
| `%%commentaire%%` | le texte, visible pour le lecteur | à supprimer avant conversion |

Les références de bloc méritent l’insistance que leur accorde la documentation d’Obsidian elle-même : elles sont propres à Obsidian et ne font pas partie du Markdown standard, elles ne se transfèrent donc pas (vérifié sur obsidian.md, le 9 septembre 2026). Il en va de même pour les inclusions. Toutes deux sont des pointeurs vers un graphe, et un dossier de fichiers n’est pas un graphe.

La ligne Dataview est celle que les gens interprètent mal. Une requête Dataview est un bloc de code délimité dont la chaîne d’information est `dataview`, et le tableau que vous regardiez dans Obsidian était généré à l’affichage par une extension. Rien de tout cela n’est dans le fichier. Convertissez le coffre et vous obtenez le texte de la requête dans un bloc de code, correctement, et le lecteur n’obtient aucun tableau du tout.

Le bloc de propriétés en haut de la note est du front matter YAML : un convertisseur qui ne le reconnaît pas rend le `---` d’ouverture comme une ligne horizontale et transforme celui de fermeture en un titre fait à partir de votre dernière ligne de métadonnées.

Une fois qu’une note est du Markdown ordinaire, la conversion est un travail sans surprise : déposez-la sur [TransformPipe](https://transformpipe.com) pour un aperçu, un onglet de source HTML et un `.html` autonome aux styles intégrés. Plusieurs fichiers déposés ensemble s’enchaînent en un seul document — ou évitez le nettoyage manuel décrit plus haut et déposez directement le dossier du coffre, zippé : [sa conversion Obsidian → Markdown](/obsidian-to-markdown) lit directement les fichiers `.md` à l’intérieur, résout les `[[liens wiki]]`, les alias et les ancres de titres en les mots qu’ils affichaient, et fusionne chaque note en un seul document avec table des matières, dans la même passe. [La réécriture complète des liens wiki et des inclusions](/blog/convert-obsidian-vault-to-markdown) explique comment faire cela à la main, sur tout un coffre.

### Rendre un coffre portable avant d’en avoir besoin

Quatre habitudes gardent un coffre convertible sans changer votre façon d’y écrire. Désactivez les liens wiki, pour que les nouveaux liens soient standards. Gardez les pièces jointes dans un dossier à l’intérieur du coffre plutôt qu’à l’extérieur, pour que les chemins relatifs tiennent quand le dossier est copié. Évitez une inclusion là où un lien suffirait, car un lien se dégrade en lien tandis qu’une inclusion se dégrade en crochets. Et traitez les références de bloc comme une aide personnelle à la navigation plutôt que comme une façon de construire un raisonnement à partir de fragments, puisqu’elles sont la seule construction sans aucune voie de repli.

## Confluence : le format de stockage est du XHTML, donc un export est une conversion

Confluence ne stocke pas de Markdown. Une page est conservée au format de stockage Confluence, basé sur XHTML — techniquement du XML, puisqu’il ne respecte pas pleinement XHTML —, et les constructions propres à Confluence vivent dans deux espaces de noms : `ac:` pour ses éléments et `ri:` pour les identifiants de ressources. Une macro est un `ac:structured-macro`, une image est un `ac:image` enveloppant un `ri:attachment`, et un lien vers une page est un `ac:link` enveloppant un `ri:page` (vérifié sur confluence.atlassian.com, le 9 septembre 2026).

Rien dans cette liste n’a de forme Markdown. La voie de sortie est donc une voie que vous assemblez vous-même, et la première décision porte sur l’export que vous avez le droit d’exécuter.

| Export | Portée | Qui peut l’exécuter | Ce qui en sort |
| --- | --- | --- | --- |
| Export vers Word | une page | toute personne ayant accès | un fichier que Word ouvre et que d’autres éditeurs, souvent, n’ouvrent pas |
| Export vers PDF | une page | toute personne ayant accès | une page rendue ; les commentaires ne sont jamais inclus |
| Export d’espace, HTML | tout l’espace | administrateur d’espace | zip de HTML rendu plus les pièces jointes |
| Export d’espace, XML | tout l’espace | administrateur d’espace | format de stockage, pour restaurer dans Confluence |
| Export d’espace, CSV | tout l’espace | administrateur d’espace | le contenu visible, pièces jointes et commentaires inclus par défaut |
| Export d’espace, PDF | tout l’espace | administrateur d’espace | un seul fichier, sans les articles de blog, sans commentaires |

Chaque ligne de ce tableau vient de la documentation d’Atlassian elle-même, exclusions comprises : les commentaires de page ne sont actuellement pas exportés lors d’un export HTML, les commentaires ne sont jamais inclus dans un export PDF, les articles de blog sont eux aussi absents d’un export PDF d’espace, et l’export CSV emporte tout ce que vous pouvez consulter, pièces jointes et commentaires compris (vérifié sur support.atlassian.com, le 9 septembre 2026). L’export Word d’une seule page est également documenté comme produisant un fichier que seul Microsoft Word ouvre de façon fiable, ce qui l’écarte comme entrée pour un script.

Reste le HTML comme seule source raisonnable pour une conversion en masse, ce qui fait de ce travail [une conversion HTML vers Markdown](/html-to-markdown) précédée d’un parcours de répertoire. Deux façons de faire la conversion elle-même :

- Un convertisseur ou une bibliothèque sur le HTML exporté — pandoc, ou quelque chose comme turndown dans un script. Les macros arrivent sous la forme HTML dans laquelle elles ont été rendues : un encart d’information devient un `div` ordinaire, un arbre de pages ou un extrait laisse des liens vers le site en ligne. [La comparaison avec pandoc](/blog/pandoc-alternatives-for-markdown-to-html) explique quand l’outil plus lourd mérite son installation.
- Une application du Marketplace qui produit directement du Markdown : meilleure avec les macros, mais une chose de plus à faire approuver.

### Ce que deviennent les macros

La règle est simple une fois qu’on l’a vue. Une macro qui se rendait en HTML statique survit sous cette forme. Une macro qui était une requête en direct survit comme un instantané de ce qu’elle affichait ce jour-là, ou pas du tout.

| Macro | Dans l’export HTML | Après conversion |
| --- | --- | --- |
| Encart info, note, avertissement, astuce | un `div` avec une classe et une icône | un paragraphe ; donnez-lui une convention de citation |
| Bloc de code | un `pre` avec un balisage de coloration | un bloc délimité, généralement sans le langage |
| Table des matières | une liste rendue de liens d’ancrage | une liste de liens vers des ancres qui n’existent plus |
| Arbre de pages, affichage des enfants | une liste rendue de liens vers le site en ligne | des liens absolus retournant vers Confluence |
| Extrait, inclusion | le texte transclus, intégré | du texte dupliqué dans chaque page qui l’incluait |
| Ticket ou filtre Jira | un tableau instantané, ou un lien | un tableau figé au jour de l’export |
| Développer | le contenu, déplié | du contenu ordinaire, sans bascule |
| Macro des pièces jointes | une liste de liens vers `/download/attachments/...` | des liens qui exigent une session |

Les pièces jointes sont le piège récurrent : elles se trouvent derrière des URL `/download/attachments/` qui attendent une session. Un export d’espace les emballe dans le zip, une page copiée ne le fait pas, une image qui paraît correcte tant que vous êtes connecté devient donc une case brisée pour tout le monde d’autre.

Deux autres choses que l’export HTML ne conserve pas sous une forme utilisable. L’arbre des pages est exprimé dans un fichier d’index plutôt que dans l’organisation des dossiers — les noms de fichiers exportés sont plats et générés par la machine, la hiérarchie doit donc être reconstruite à partir de l’index si vous voulez des dossiers. Et les ancres de titres changent : Confluence génère des identifiants qui incluent le titre de la page, si bien que tout lien interne écrit contre `#TitreDePage-Titre` cesse de fonctionner dès que votre nouveau moteur de rendu génère plutôt `#titre`. Les libellés sont des métadonnées sans équivalent Markdown, et méritent d’être écrits dans le front matter pendant la conversion, car rien d’autre ne les portera.

Pour le cas courant — un export d’espace que l’on veut obtenir comme un seul document lisible plutôt que comme une arborescence de dossiers reproduisant la structure de l’espace — [une conversion Confluence → Markdown](/confluence-to-markdown) prend le `.zip` d’export HTML de l’espace tel qu’il sort de Confluence, convertit le HTML de chaque page avec le même convertisseur que celui derrière [la conversion HTML vers Markdown](/html-to-markdown) évoquée plus haut, et fusionne les pages dans l’ordre en un seul document avec table des matières. Elle ne reconstruit pas l’arbre des pages et ne réécrit pas les liens `/download/attachments/` — rien ne le fait sans décider où vivront les pages et leurs pièces jointes — mais elle supprime le parcours de répertoire et l’étape de conversion fichier par fichier pour quiconque visait dès le départ un seul document à lire ou à partager. [La comparaison complète des exports](/blog/convert-confluence-page-to-markdown) traite des applications du Marketplace et de la différence entre Server/Data Center.

## Google Docs : deux voies de sortie, aucune ne conserve la conversation

Google Docs vers Markdown fonctionne globalement bien. Fichier, puis Télécharger, propose directement Markdown (.md), et titres, listes, tableaux, liens et emphases survivent (vérifié sur workspaceupdates.googleblog.com, le 9 septembre 2026). La même mise à jour a ajouté une préférence sous Outils, Préférences, Activer Markdown, qui active Copier en Markdown et Coller depuis Markdown — utile pour un passage, pas pour un document entier.

Les commentaires et les modifications suggérées ne survivent pas. Pas plus qu’une image, puisqu’un unique fichier `.md` n’a nulle part où la mettre. Cela transforme le choix en une décision de voie plutôt qu’en une réponse unique.

| Voie | Conserve | Perd | À utiliser quand |
| --- | --- | --- | --- |
| Télécharger en Markdown | titres, listes, tableaux, liens, emphases | images, commentaires, suggestions | le document est du texte, et vous voulez un seul fichier |
| Télécharger en page web, zippée | images, dans un dossier à côté du HTML | commentaires, suggestions ; ajoute des styles en ligne à retirer | le document contient des captures d’écran |
| Télécharger en Word, puis convertir | images, styles, suivi des modifications comme balisage | commentaires, suggestions | vous convertissez déjà des `.docx` en masse |

La voie HTML est celle à privilégier par défaut dès qu’il y a des images. Le zip donne un dossier d’images et un fichier HTML, et l’étape de conversion retire la soupe de classes et les attributs `style` en ligne que Google pose sur chaque paragraphe — ce qui est le but, puisque rien de tout cela ne veut dire quoi que ce soit en Markdown. [Le guide complet pour cette conversion](/blog/convert-google-docs-to-markdown) détaille ce qu’il faut savoir avant un traitement en lot.

Les suggestions sont le mode d’échec qui mord vraiment. Un document en mode suggestion contient deux versions de lui-même, et l’export en contient une, choisie à votre place. Acceptez ou rejetez tout avant d’exporter, pour que le fichier converti soit bien le document que vous croyez avoir. Il en va de même pour les commentaires : si une décision n’est enregistrée que dans un fil résolu, copiez-la dans le corps du texte avant, sous peine de la perdre.

## Word : un convertisseur peut lire la structure, pas l’intention

Un `.docx` est un zip de XML, et Word vers Markdown fonctionne à peu près aussi bien que le document le mérite. Les titres écrits avec les styles de titre de Word deviennent des titres `#` ; les titres imités avec du gras 16 points deviennent des paragraphes de texte en gras. Les listes numérotées se comportent de la même façon, corriger les styles dans Word l’emporte donc sur corriger le Markdown après coup.

Cela vaut la peine d’être énoncé comme une règle, car elle décide où se fait le travail. Un convertisseur peut lire une structure qui a été exprimée structurellement. Il ne peut pas lire une intention. Si le document a été mis en forme à l’œil — du gras au lieu de titres, des tabulations au lieu de listes, un paragraphe vide au lieu d’une règle d’espacement —, la conversion produit un mur de texte plat, techniquement fidèle et inutile, et la correction la moins coûteuse est une demi-heure dans Word à appliquer des styles avant de convertir quoi que ce soit. [Ce qu’une conversion `.docx` conserve et ce qu’elle abandonne](/blog/convert-docx-to-markdown) passe en revue le reste : suivi des modifications, commentaires, zones de texte, notes de bas de page, objets intégrés, et les images qui ressortent dans un dossier à côté du fichier.

## Evernote, Bear, Apple Notes, Roam et tout le reste

Ces quatre reviennent assez souvent pour être nommés, et chacun a une voie qui mérite d’être connue. La dernière entrée est la solution de repli pour tout ce qui n’est nommé nulle part ci-dessus.

**Evernote.** Sélectionnez des notes ou un carnet et exportez en ENEX, en HTML une page ou en HTML multi-pages ; l’export est plafonné à 100 notes à la fois, bien qu’un carnet entier puisse partir d’un coup (vérifié sur help.evernote.com, le 9 septembre 2026). ENEX est un conteneur XML que seuls Evernote et ses outils d’import savent lire, donc à moins de migrer vers quelque chose qui importe l’ENEX, prenez l’export HTML multi-pages : il donne un fichier HTML par note, un dossier de ressources partagé entre elles, et un index qui les relie. À partir de là, c’est la même étape HTML vers Markdown que pour tout le reste.

**Bear.** Une note isolée s’exporte en `.txt`, `.md`, `.textbundle`, `.bearnote` ou `.rtf`, avec HTML, DOCX, PDF, JPG et ePub disponibles pour Bear Pro ; plusieurs notes à la fois passent par Fichier, Exporter les notes sur le Mac (vérifié sur bear.app, le 9 septembre 2026). Prenez le Textbundle plutôt que le Markdown brut quand les notes contiennent des images — un Textbundle réunit le Markdown et ses fichiers dans un seul paquet, exactement ce qu’un `.md` nu ne sait pas faire. Les tags de Bear s’écrivent `#tag` dans le corps du texte, et un convertisseur standard lit une ligne commençant par `#` comme un titre : une ligne de tags doit donc être traitée avant la conversion, pas après.

**Apple Notes.** Sur Mac, Fichier, Exporter comme propose PDF et Markdown, et le côté import accepte TXT, RTF, RTFD, HTML et l’ENEX d’Evernote, avec un Fichier, Importer du Markdown séparé (vérifié sur support.apple.com, le 9 septembre 2026). C’est note par note : il n’existe pas d’export de toute la bibliothèque, au-delà de quelques dizaines de notes il faut donc sélectionner par lots. Les pièces jointes ne font pas partie de l’export Markdown.

**Roam.** Roam raisonne d’abord en plan : chaque puce est un bloc doté d’un identifiant, et références de bloc comme requêtes sont des pointeurs vers le graphe plutôt que du texte dans une page. Quel que soit le format d’export choisi, ces deux constructions n’ont pas d’équivalent Markdown — une référence doit être intégrée comme son texte ou abandonnée, et une requête n’a aucun résultat à transporter. Lisez le menu d’export dans votre propre graphe avant de planifier autour d’un format, et prévoyez la réécriture des références quoi qu’il arrive.

**Tout le reste.** Pour un outil sans convertisseur propre — un vieux wiki, un CMS, un centre d’aide, un e-mail — prenez le HTML qu’il produit et faites-lui subir une étape HTML vers Markdown, parce que le HTML est le seul format que presque tout sait produire. Quand il n’y a même aucun export, le navigateur est l’export : enregistrez la page rendue, ou copiez seulement la zone de l’article. Ce que vous obtenez, c’est tout l’habillage de la page en plus de son contenu, la conversion est donc suivie d’une étape d’élagage, et cet élagage se résume en général à un seul sélecteur.

## Migrer un millier de pages, là où la réponse en un clic échoue

Tout ce qui précède décrit un document. Une migration est un problème différent, et la version honnête se présente ainsi.

| Échelle | Ce que cela coûte réellement | Que faire |
| --- | --- | --- |
| Moins de 10 pages | une heure, peut-être deux | réparer à la main, dans l’ordre où un lecteur remarquerait |
| 10 à 50 | un après-midi | réparer à la main, en gardant une liste des défauts répétés |
| 50 à 200 | une journée à la main, ou une demi-journée de script | scripter les deux ou trois défauts qui se répètent, corriger le reste à la main |
| 200 et plus | des jours dans un cas comme dans l’autre | écrire le script, et budgéter pour la seconde exécution |

Le seuil n’est pas plus bas parce que le script n’est pas un convertisseur. La conversion est la partie facile — un seul appel de bibliothèque par fichier. Le script est un problème de réécriture, et il contient quatre réécritures distinctes, chacune pouvant être terminée et correcte pendant que les trois autres sont cassées.

**Les noms de fichiers.** Retirez le suffixe d’identifiant, transformez le reste en slug, et résolvez les collisions : deux pages appelées « Notes de réunion » sous des parents différents deviennent un seul nom de fichier après la mise en slug. Construisez une table de correspondance de l’ancien chemin vers le nouveau et écrivez-la sur le disque, car vous en aurez besoin trois fois de plus, et encore dans six mois quand quelqu’un demandera où est passée une page.

**Les liens.** Chaque lien interne dans l’export est écrit contre l’ancien nom de fichier, encodé en pourcentage. Réécrivez chacun via la table de correspondance. Les liens qui pointaient vers l’application en direct plutôt que vers un fichier — une URL absolue dans l’espace de travail ou le wiki — forment un second ensemble, à faire correspondre par identifiant ou par clé de page plutôt que par nom de fichier, et ce sont ceux qui fonctionnent encore silencieusement le jour où vous éteignez l’ancien système, et qui sont silencieusement cassés le lendemain.

**Les pièces jointes.** Déplacez-les dans un seul répertoire de ressources, réécrivez le `src` de chaque image, et dédupliquez : le même logo exporté dans quarante dossiers de page fait quarante fichiers. Les noms avec des espaces, des accents ou des emojis se normalisent ici, une fois pour toutes, plutôt que dans le premier moteur de rendu qui s’en plaindra.

**Les ancres.** Les identifiants de titres sont générés par ce qui rend le Markdown, et la nouvelle règle ne correspondra pas à l’ancienne. Les liens internes à la page et tout bloc de table des matières doivent être régénérés, pas réécrits.

Faites les quatre en une seule passe sur un document analysé plutôt qu’avec une chaîne d’expressions régulières sur le texte brut. Une regex qui réécrit `](...)` réécrit aussi l’intérieur d’un bloc de code délimité, et la page où vous vous en apercevrez est justement celle du lot qui documente la syntaxe des liens. Analysez, parcourez l’arbre, réécrivez-le. Une fois l’arbre correct, [exécuter la conversion sur tout le répertoire](/blog/batch-convert-markdown-files) est la partie courte.

### Que vérifier sur un échantillon avant de s’engager dans un script

Choisissez six pages, pas une seule, et choisissez-les délibérément : la plus longue, la plus liée, celle avec le plus d’images, une page riche en base de données ou en tableaux, une qui s’appuie sur les constructions propres à l’outil — callouts, macros, inclusions — et une écrite par la personne de l’équipe qui utilise l’application de la façon la plus inhabituelle. Cette dernière trouve à elle seule plus de défauts que les cinq autres réunies.

Faites passer les six par tout le chemin, jusqu’au HTML fini, et vérifiez chacune contre la liste ci-dessous. Ce qui échoue sur l’échantillon est ce que le script doit gérer ; ce que le script ne peut pas gérer est ce que quelqu’un corrigera à la main, et vous savez désormais combien de pages cela représente.

- [ ] **Liens.** Les internes d’abord : ils pointent encore vers les anciennes URL ou vers des noms de fichiers qui n’existent plus.
- [ ] **Images.** Ouvrez le fichier converti depuis un autre endroit que le dossier d’export.
- [ ] **Tableaux.** Les cellules fusionnées et le contenu imbriqué n’ont pas de forme Markdown ; ils arrivent aplatis ou manquants.
- [ ] **Callouts et encarts.** Choisissez un seul remplacement, une citation avec une amorce en gras, et utilisez-le partout.
- [ ] **Blocs de code.** Vérifiez que les indications de langage sont passées, et que la correction automatique n’a pas mis de guillemets typographiques dans du code.
- [ ] **Ancres.** Cliquez sur chaque lien interne à la page, y compris ceux qu’un bloc de sommaire a générés.
- [ ] **Front matter.** Décidez quelles métadonnées vous conservez avant que le script tourne, pas après.
- [ ] **Encodage.** Espaces insécables, traits d’union conditionnels et guillemets typographiques voyagent invisiblement et cassent recherches et diffs.
- [ ] **Collisions.** Deux pages devenues un seul nom de fichier constituent une perte de données silencieuse, dont le seul symptôme est un fichier au contenu erroné.

### L’ordre des opérations

Faites tourner le script vers un nouveau dossier de sortie à chaque fois, pour qu’une exécution ratée soit simplement supprimée plutôt qu’à démêler, et jamais vers le dossier d’export lui-même. Comparez la seconde exécution à la première : ce diff est la seule chose qui dit ce que votre correction a changé et ce qu’elle a changé par accident. Et décidez à l’avance si l’ancien système est gelé pendant la migration ou si vous acceptez un décalage et réexportez les pages qui ont bougé — les deux options fonctionnent, et découvrir après coup laquelle vous avez choisie ne fonctionne pas.

## Comment choisir la voie de sortie

1. **Exportez une fois, et gardez l’archive.** Si vous convertissez sur place, vous ne pouvez pas relancer le script, et vous relancerez le script — sans doute trois fois.
2. **Choisissez la voie en fonction de ce qu’il faut absolument garder, pas de ce qui demande le moins de clics.** Si le document contient des captures d’écran, la voie Markdown en un seul fichier était la mauvaise dès le départ, et aucune réparation ultérieure ne remettra les images en place.
3. **Préférez l’export qui embarque les ressources à celui qui se contente de les lier.** Un chemin qui exige une session est une image qui fonctionne pour vous et une case brisée pour tout autre lecteur, et vous ne le remarquerez pas, parce que vous êtes connecté.
4. **Décidez ce qui remplace chaque construction avant de convertir, pas après.** Une convention de citation choisie en amont vaut mieux que cinquante conventions improvisées découvertes en relecture, et la seconde option coûte bien plus cher à défaire.
5. **Convertissez d’abord un document représentatif de bout en bout.** Le pousser jusqu’au HTML fini vous dit si la correction est un réglage, un chercher-remplacer ou un convertisseur — trois réponses aux coûts très différents.
6. **Comptez les pages avant d’écrire du code.** En dessous d’une vingtaine, les mains l’emportent sur un script ; au-delà de deux cents, les mains représentent une semaine que vous ne récupérerez jamais.
7. **Gardez la table de correspondance ancien-vers-nouveau quelle que soit l’échelle.** Sans elle, impossible d’écrire une liste de redirections, et un wiki sans redirections est un wiki où chaque signet enregistré par quelqu’un devient un 404.

## Conclusion

Chacune de ces applications vous donnera quelque chose. Le savoir-faire consiste à savoir quoi, et à le vérifier avant que la source ne disparaisse : un zip Notion dont tous les liens pointent vers des identifiants, un coffre dont les liens wiki ne sont lus par rien d’autre, un espace Confluence où les macros étaient la partie utile, un Google Doc dont les images n’ont jamais été dans le fichier. Faites d’abord passer un vrai document par tout le chemin, réparez ce qui casse, et alors seulement décidez si le reste est un après-midi de travail manuel ou un script contenant quatre réécritures. Une fois le Markdown enfin propre, [TransformPipe](https://transformpipe.com) le transforme en une page partageable, et sa CLI prend un lot de fichiers en une seule commande, `--merge` les enchaînant en un seul document.

## FAQ

### Puis-je exporter une page Notion directement en Markdown ?

Oui — la boîte de dialogue d’export propose Markdown & CSV comme format, et une page isolée ressort comme un fichier `.md` unique avec ses images dans un dossier juste à côté. Les bases de données de cet export deviennent des fichiers CSV plutôt que des tableaux Markdown, et chaque nom de fichier et chaque lien interne porte l’identifiant de la page.

### Pourquoi mes noms de fichiers Notion contiennent-ils de longs codes ?

Parce que Notion identifie les pages par identifiant et que le titre n’est qu’une étiquette : l’export ajoute donc l’identifiant de la page pour garder les noms uniques. Cet identifiant est le même que celui de l’URL de la page, ce qui en fait une clé utilisable : construisez une table de l’identifiant vers le nouveau nom de fichier, puis réécrivez liens et noms de fichiers en une seule passe.

### Comment faire passer une page Confluence en Markdown ?

Il n’existe aucun export Markdown : vous exportez donc du HTML et le convertissez. Un espace entier s’exporte en HTML zippé si vous êtes administrateur d’espace, ce qui est aussi la seule voie qui embarque les pièces jointes ; une page isolée ne propose que Word et PDF, et le PDF est une impasse. Les macros arrivent sous la forme HTML dans laquelle elles ont été rendues.

### Les notes Obsidian fonctionnent-elles dans d’autres outils Markdown ?

Le Markdown pur, oui. Les liens wiki, les inclusions, les références de bloc et les callouts, non, parce que ce sont des syntaxes propres à Obsidian qu’un analyseur standard imprime comme du texte littéral. Désactivez le réglage des liens wiki pour que les nouveaux liens soient standards, et réécrivez les liens existants avant de convertir.

### L’export depuis Google Docs conserve-t-il mes images et mes commentaires ?

Les images survivent au téléchargement en page web, qui donne un zip avec un dossier d’images, et ne survivent pas au téléchargement en Markdown, qui est un fichier unique n’ayant nulle part où les mettre. Commentaires et modifications suggérées ne survivent à aucune des deux voies : résolvez-les, et acceptez ou rejetez chaque suggestion avant d’exporter.

### Quelle est la façon la plus rapide de faire passer tout un wiki en Markdown ?

Exportez une fois, convertissez une page représentative jusqu’au bout en HTML fini, et laissez ce qui casse sur cette page vous dire si un script est nécessaire. Si oui, traitez-le comme un travail de réécriture portant sur les noms de fichiers, les liens, les chemins des pièces jointes et les ancres plutôt que comme un travail de conversion, et gardez la table de correspondance ancien-vers-nouveau pour pouvoir écrire des redirections.

### Quels exports conservent les commentaires et les discussions ?

Presque aucun. Les commentaires de Notion ne sont pas dans l’export, les commentaires de page de Confluence sont absents de l’export HTML et jamais présents dans un PDF, et les commentaires de Google Docs ne ressortent dans aucun format de téléchargement. Si une décision n’existe que dans un fil de commentaires, copiez-la dans le corps du document avant d’exporter quoi que ce soit.
