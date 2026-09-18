---
title: "Markdown ou Word pour la documentation : quel format doit posséder la source"
description: "Markdown ou Word pour la documentation, tranché par ce qu’elle doit faire : relecture, édition, historique, mise en page, recherche, publication, signature."
date: 2026-09-05
tag: Workflow
keywords: markdown ou word documentation, markdown contre docx, format de documentation, docs as code, word ou markdown pour la documentation, docx contre markdown, format documentation technique
---

Demandez à une organisation où vit sa documentation, et vous obtenez en général trois réponses à la fois : un dossier de fichiers `.docx` sur un lecteur partagé, un wiki que personne n’a modifié depuis la dernière réorganisation, et un répertoire `docs/` dans un dépôt que seuls les ingénieurs lisent. Les trois sont partiellement à jour. Aucun n’est la source de vérité, et la raison n’est jamais que quelqu’un a délibérément choisi le mauvais format de fichier. C’est que personne n’a jamais décidé quel format avait le droit d’être l’original.

Le débat se mène alors comme une question de goût. Les ingénieurs disent que Word est un fouillis ; le reste de l’entreprise dit que Markdown est un rite initiatique. Les deux camps décrivent une expérience réelle, et ni l’un ni l’autre ne décrit la vraie décision, qui n’est pas du tout une affaire de préférence. C’est une affaire de ce qu’un document précis doit faire — être relu, être modifié par douze personnes, être cherché, être imprimé, être signé, être publié, être audité dans trois ans quand quelqu’un demande pourquoi une clause parle de trente jours.

Cet article tranche cela tâche par tâche. C’est une question différente de [Markdown contre HTML écrit à la main](/blog/markdown-vs-html), qui oppose un format d’écriture à un format de publication ; ici, les deux candidats sont des formats d’écriture, et la question est de savoir lequel doit être l’original à partir duquel tout le reste est généré.

### En bref

Décidez selon le rôle du document, pas selon le goût de l’équipe. Si le document change souvent, est relu par plus d’une poignée de personnes, doit pouvoir être cherché et modifié en masse, et finit sur une page web, le Markdown en contrôle de version l’emporte sur presque tous les critères. S’il doit être imprimé sur un modèle, signé, déposé auprès de quelqu’un qui impose une mise en page, ou lu ligne par ligne par une personne dont tout le métier est les contrats, Word l’emporte, et aucun outillage n’y changera rien. La plupart des organisations ont besoin des deux — et le seul arrangement qui tienne est un format comme source et l’autre comme export généré, jamais les deux comme sources.

## Ce qu’est une .docx, ce qu’est un fichier .md, et ce que cela produit en aval

Une `.docx` est une archive zip. Renommez-la, décompressez-la, et vous obtenez un répertoire de parties XML : l’une contenant le texte du document, une autre les styles nommés, une autre les définitions de listes qui font que les listes numérotées se renumérotent elles-mêmes, et une partie de relations qui associe des identifiants internes aux images, hyperliens, en-têtes et pieds de page. Le format est documenté et normalisé — c’est Office Open XML, publié sous le nom ECMA-376, et les quatre parties de la spécification se téléchargent gratuitement (vérifié sur ecma-international.org, le 9 septembre 2026) —, ce qui compte pour la pérennité, mais rien de tout cela n’est destiné à être lu par une personne. Ouvrez la partie principale de l’archive dans un éditeur de texte, et vous obtenez plusieurs milliers de caractères de balisage avant la première phrase de votre document. [L’anatomie de cette archive et ce que décide chaque partie](/blog/convert-docx-to-markdown) vaut la peine d’être lue si vous devez un jour en convertir une.

Un fichier `.md` est du texte. Ce sont les phrases que vous avez écrites, en UTF-8, avec un petit ensemble de conventions posées par-dessus : des dièses pour les titres, des astérisques pour l’emphase, des tirets pour les éléments de liste, des barres verticales pour les tableaux, des accents graves pour le code. Il n’y a ni conteneur, ni partie de style séparée, ni table de relations. La structure est encodée sous forme de caractères en début de ligne, ce qui la rend visible à tout ce qui sait lire une ligne de texte.

Cette seule différence produit presque tout le reste de cette page :

- **Ce qu’un diff peut montrer.** Un changement dans un fichier texte est un changement de ligne. Un changement dans une archive zip est un changement de blob binaire, les outils qui comparent des versions n’ont donc rien d’autre à se mettre sous la dent que le fichier entier.
- **Ce que l’outillage peut toucher.** N’importe quoi peut lire un fichier texte — grep, un linter, un script de build, un correcteur orthographique, un éditeur sur un téléphone. Lire une `.docx` demande une bibliothèque qui comprend le format, et en réécrire une en toute sécurité demande davantage encore.
- **Ce que le format peut exprimer.** Word peut stocker un commentaire ancré à une plage de caractères, un schéma de numérotation qui se renumérote quand on insère un élément, un en-tête qui se répète sur chaque page et une table des matières qui se met à jour toute seule. Markdown ne stocke rien de tout cela, parce qu’il ne stocke rien d’autre que le texte.
- **Si les octets se décrivent eux-mêmes.** Un fichier Markdown lu sans aucun logiciel montre encore des titres comme des titres. Une `.docx` lue sans logiciel montre du XML.
- **À qui on peut confier le fichier.** Un fichier texte peut être modifié sans risque par quelqu’un sans formation, parce qu’il y a très peu de façons d’en casser l’analyse. Un document Word peut se casser de façons invisibles jusqu’à l’impression.

L’archive n’est pas un défaut de conception. C’est le prix de ce qu’elle sait faire, et ces choses sont réelles. L’erreur est de supposer que ce prix vaut la peine d’être payé pour chaque document, et l’erreur inverse est de supposer qu’il ne vaut jamais la peine de l’être.

## Markdown contre Word pour la documentation : le pense-bête

Un seul tableau, à lire ligne par ligne. La dernière colonne est un verdict honnête plutôt qu’un vainqueur, parce que plusieurs de ces lignes penchent réellement de l’autre côté.

| Dimension | Markdown en contrôle de version | Word (.docx) | Qui l’emporte, et quand |
| --- | --- | --- | --- |
| Relire un changement | Diff ligne par ligne : les mots modifiés apparaissent comme modifiés | Modifications suivies : chaque édition attribuée, acceptée ou rejetée individuellement | Markdown pour beaucoup de petits changements ; Word quand chaque phrase demande une décision |
| Commenter une phrase | Commentaire de relecture sur une ligne, dans une pull request | Commentaire ancré à une plage de caractères, avec un fil de réponses | Word, clairement, pour les relecteurs non techniques |
| Deux personnes qui modifient en même temps | Branche et fusion, conflits signalés ligne par ligne | Co-édition dans le cloud, ou copies envoyées par e-mail et fusionnées à la main | Markdown pour un ensemble de fichiers ; Word en ligne pour un fichier, une heure |
| Qui peut modifier sans formation | Quiconque sait taper, une fois passé le cap du flux de travail | Quiconque a déjà utilisé un ordinateur | Word, et prétendre le contraire est ce qui rend la documentation obsolète |
| Historique | Chaque changement, avec un message, un auteur et une raison | Instantanés par date et auteur, sur la plateforme qui stocke le fichier | Markdown : l’unité est un changement, pas une copie |
| Pourquoi une phrase dit ce qu’elle dit | Bloquer la ligne (blame), lire le commit, lire la pull request | Lire la liste des versions et deviner | Markdown, et de loin |
| Recherche dans tout l’ensemble | Recherche exacte ou par expression régulière, en une seconde, depuis n’importe où | Recherche de la plateforme, qui trouve des documents plutôt que des lignes | Markdown |
| Changer une expression dans 200 fichiers | Une commande, un diff, une relecture | Ouvrir 200 fichiers, ou écrire un script contre le XML | Markdown |
| Mise en page, en-têtes, pieds de page, sauts de page | Pas exprimable | Natif, et la raison d’être du format | Word |
| Modèle maison et styles nommés | Vit dans le convertisseur ou le thème du site | Vit dans le document, appliqué par la personne qui écrit | Word pour un cas isolé ; Markdown pour la cohérence sur des centaines de documents |
| Numérotation automatique et renvois | Absent du format ; certains générateurs ajoutent des ancres | Des champs qui se renumérotent et se repointent eux-mêmes | Word |
| Impression et signature | Nécessite une étape de conversion en PDF | Le document est déjà paginé | Word |
| Publier sur une page web | Une conversion, ou un générateur | Balisage d’enregistrement en page web, ou une conversion via Markdown de toute façon | Markdown |
| Exemples de code | Blocs délimités, langage indiqué, jamais corrigés automatiquement | La correction automatique change vos guillemets et vos tirets | Markdown, et c’est une question de justesse |
| Accessibilité | Sémantique par construction, auditée une fois dans le thème | Attributs riches disponibles, audités document par document | Égalité : Markdown coûte moins cher, Word est plus capable |
| Pérennité des octets | Texte : lisible sans aucun logiciel | Normalisé et largement lisible, mais nécessite une application | Markdown |
| Dépendance à un fournisseur | Aucune digne de ce nom | Pas le format ; le modèle, les macros et les habitudes | Markdown |
| Images | Référencées comme des fichiers séparés, qui peuvent disparaître | Transportées à l’intérieur de l’archive, ce qui les en empêche | Word pour un fichier unique qui voyage |
| Coût de l’outillage | Un hébergeur, une habitude de relecture, une étape de build que quelqu’un possède | Déjà installé sur chaque poste | Word pour une petite équipe sans ingénieurs |

Le motif est assez cohérent pour être énoncé sans détour : Markdown l’emporte sur chaque ligne qui parle de changement, d’échelle et de temps, et Word l’emporte sur chaque ligne qui parle de pages, de commentaires de relecture et de la personne la moins technique du bâtiment. Toute décision qui ignore l’une des deux moitiés sera un jour annulée par quiconque en hérite.

## Relecture, historique, et qui peut modifier

Ces trois arguments tranchent plus de cas réels que tout ce qui concerne la syntaxe, et le premier d’entre eux est habituellement débattu de façon malhonnête par les deux camps.

### Un diff et les modifications suivies ne sont pas le même outil

Un diff montre la différence entre deux états. Les modifications suivies montrent les actes de changement : cette personne a barré cette clause, cette autre a inséré ces cinq mots, et chacun peut être accepté ou rejeté séparément. Ce sont des produits différents, et les disputes qu’on a à leur sujet opposent en général deux personnes qui décrivent des métiers différents.

Pour un avocat qui lit un contrat, les modifications suivies avec des commentaires en marge sont le meilleur instrument, et de loin. L’unité de travail est la proposition individuelle — qui a suggéré cette formulation, qu’en a-t-il dit en marge, est-ce que je l’accepte ou la conteste — et Word modélise exactement cela. Une pull request modélise autre chose : un ensemble cohérent de changements, proposés ensemble, acceptés ou rejetés ensemble. On peut approuver un diff ligne par ligne dans la plupart des outils de relecture, mais on ne peut pas remettre à quelqu’un un document contenant quatorze propositions indépendantes et le laisser en garder neuf.

Pour douze personnes qui modifient un livret d’accueil, les modifications suivies sont le pire instrument, et là aussi de loin. Douze relecteurs produisent douze copies. Quelqu’un les fusionne à la main, ce qui veut dire que quelqu’un lit le même paragraphe douze fois et décide laquelle de quatre reformulations garder, sans aucune trace ensuite de ce qui a été rejeté ni pourquoi. Le fichier nommé `livret_final_v3_JS_commentaires_maj.docx` n’est pas une plaisanterie sur les noms de fichiers ; c’est le symptôme visible d’un format sans opération de fusion. La co-édition dans le cloud supprime les copies, ce qui est une vraie amélioration, mais elle supprime la trace en même temps : tout le monde modifie le document en direct, et l’historique devient une liste d’horaires plutôt qu’une liste de décisions.

| Modèle de relecture | Unité de relecture | Attribution | Concurrence | Trace ensuite |
| --- | --- | --- | --- | --- |
| Modifications suivies dans des fichiers envoyés par e-mail | Une insertion ou suppression | Par changement, par auteur | Une personne à la fois par copie | Ce dont s’est souvenu celui qui a fusionné |
| Modifications suivies dans un fichier cloud co-édité | Une insertion ou suppression | Par changement, tant qu’il est en attente | Plusieurs personnes à la fois | Des instantanés datés du document |
| Pull request sur du Markdown | Un ensemble de changements liés | Par commit et par commentaire | Plusieurs personnes, sur des branches | Permanente : diff, discussion, décision |
| Commentaires seuls, aucune modification | Une suggestion en prose | Par commentaire | Plusieurs personnes à la fois | Le fil de commentaires, jusqu’à sa résolution |

La lecture pratique : les modifications suivies sont meilleures pour négocier un document et moins bonnes pour en maintenir un. La documentation se maintient, c’est pourquoi le format mauvais en négociation continue de l’emporter pour la documentation, et pourquoi les contrats continuent de vivre dans Word, quoi qu’en pense l’équipe d’ingénierie.

### Le blame, et pourquoi une phrase dit ce qu’elle dit

C’est l’argument qui convertit les sceptiques, et il n’apparaît jamais dans un comparatif de fonctionnalités parce que Word n’a rien à mettre dans la colonne.

Un ensemble de documentation vivant depuis quelques années contient des phrases que personne ne sait plus expliquer. « Les jetons d’accès expirent après trente jours. » Pourquoi trente ? Était-ce une décision, un compromis avec l’équipe sécurité, ou une coquille autour de laquelle quelqu’un a depuis construit une bibliothèque cliente ? Dans un dépôt, on interroge le fichier : bloquer la ligne (blame), obtenir le commit, lire le message de commit, remonter jusqu’à la pull request, lire l’argumentation qui s’y est tenue et le ticket qui l’a déclenchée. Cette chaîne prend environ quatre-vingt-dix secondes, et elle produit soit la raison, soit la preuve qu’il n’y en a jamais eu, ce qui est en soi utile.

Dans un parc de fichiers Word, la même question est en pratique sans réponse. L’historique des versions de la plateforme de stockage donne des instantanés par auteur et horodatage — un vrai historique, et mieux que rien —, mais l’unité est le document, pas la phrase. On peut découvrir que Priya a enregistré une nouvelle version un mardi de mars. On ne peut pas découvrir lequel des quarante changements de cet enregistrement concernait les trente jours, ni à quoi elle répondait. Alors la phrase reste, parce que personne ne peut justifier de retirer quelque chose qu’il ne sait pas expliquer, et la documentation accumule des affirmations qui ne correspondent plus au système.

La conséquence mérite d’être énoncée avec son coût : dans Word, la provenance d’une phrase doit vivre dans la mémoire de quelqu’un ou dans un journal des changements séparé qu’un humain entretient, et les deux quittent l’organisation en même temps que la personne.

### Qui peut modifier, et la phrase qui clôt la conversation

« Il suffit d’ouvrir une pull request sur la doc. » Dite à un collègue des ventes qui a repéré que la page tarifaire décrit une offre retirée au printemps, cette phrase clôt la conversation. Il n’ouvrira pas de pull request. Il enverra un message, ou ne fera rien, et la page sera encore fausse dans six mois.

C’est une contrainte réelle, pas un problème de formation, et la traiter comme un problème de formation est la façon la plus courante dont un programme *docs as code* échoue. Le flux de travail autour de Markdown — un hébergeur, un fork ou une branche, un message de commit, une relecture, une fusion, un déploiement — ce sont cinq concepts qui n’ont rien à voir avec l’écriture d’une phrase. Le seuil d’entrée de Word est réellement plus bas : ouvrir le fichier, changer les mots, enregistrer. Quiconque a déjà utilisé un ordinateur franchit cette barre.

Il existe trois réponses honnêtes, et la mauvaise est d’insister pour que les gens apprennent.

- **Utiliser l’éditeur web de l’hébergeur de code lui-même.** Modifier un fichier dans un navigateur, avec un aperçu, et laisser l’hébergeur créer la branche et la pull request en coulisses ramène cinq concepts à deux : changer les mots, écrire une ligne sur le pourquoi. Cela fonctionne, c’est ce qu’utilisent la plupart des dispositifs qui réussissent, et cela demande quand même un compte et une prise en main.
- **Poser une surface d’édition par-dessus.** Un système de contenu qui réécrit le Markdown dans le dépôt donne aux éditrices non techniques une expérience d’édition normale, et garde la source en contrôle de version. C’est davantage de rouages à posséder, et quelqu’un doit les posséder.
- **Accepter la modification comme un message, et en assumer le coût.** Quelqu’un de technique fait le changement. C’est très bien pour des corrections occasionnelles et terrible comme dispositif permanent, parce que la file d’attente devient un goulot d’étranglement, et le goulot devient de l’obsolescence.

Quel que soit votre choix, la décision appartient à la personne la moins technique qui doit changer une phrase dans l’urgence — le même principe qui fait d’un dépôt le bon foyer pour une documentation que les ingénieurs entretiennent en fait aussi le mauvais foyer pour une documentation que seule l’équipe finance touche. [Ce qui a vraiment sa place dans le dépôt, et comment le répertoire s’organise](/blog/documentation-that-lives-in-the-repo) est la version longue de cet argument.

## Ce que Word peut exprimer et que Markdown ne peut pas

Markdown compte une douzaine de constructions. Word a un modèle de page. L’écart entre eux n’est pas une question de fonctions manquantes qu’un convertisseur pourrait ajouter plus tard ; c’est la différence entre un format qui décrit une structure et un format qui décrit un artefact imprimé.

Ce qu’une `.docx` porte et qui n’a strictement aucun équivalent en Markdown :

- Un modèle à styles nommés, si bien que « Titre 2 » signifie une police, une taille, un espacement et une couleur précis dans chaque document de l’organisation.
- En-têtes et pieds de page, numéros de page, une page de garde, des sauts de section, des marges et une orientation qui changent en cours de document, des filigranes.
- Un champ de table des matières qui se met à jour tout seul, des légendes qui se numérotent elles-mêmes, et des renvois qui se repointent quand on déplace une section.
- Des sauts de page et un maintien avec le paragraphe suivant, c’est-à-dire un contrôle sur ce qui atterrit en haut d’une page.
- Des notes de bas de page affichées au bas de la page à laquelle elles appartiennent, plutôt que rassemblées en fin de document.
- Des zones de texte, des formes flottantes, des tableaux à cellules fusionnées, et tout ce qui est positionné par rapport à la page plutôt qu’au flux du texte.
- La couche de relecture elle-même : insertions et suppressions en attente, et fils de commentaires ancrés à des plages de caractères.

L’inventaire complet — point par point, avec un verdict sur les pertes qui comptent vraiment et celles qui sont des habitudes bonnes à perdre — se trouve dans [ce qu’il ne faut pas garder d’une .docx](/blog/what-not-to-keep-from-a-docx), inutile de le répéter ici. Ce qui compte pour cette décision, c’est qu’aucune de ces absences n’est un manque à moins que le rôle du document ne l’exige. Un runbook n’a pas besoin de page de garde. Un livret d’accueil imprimé et remis aux nouvelles recrues, si. Un devis dont le bloc de signature doit se trouver au-dessus d’un pied de page fixe a besoin du modèle de page, en permanence et sans négociation possible.

La liste inverse est plus courte, et elle est entièrement absente de ces comparatifs, la voici donc. Markdown exprime plusieurs choses qu’un document Word gère mal :

- **Le code, en toute sécurité.** Un bloc délimité étiqueté d’un langage survit au copier-coller, et n’est jamais corrigé automatiquement. Word remplace au fil de la frappe, et l’une des options documentées s’appelle `« Guillemets droits » par « guillemets courbes »` (vérifié sur support.microsoft.com, le 9 septembre 2026) ; le même mécanisme transforme les tirets tapés en tirets longs. L’une ou l’autre substitution à l’intérieur d’un exemple de commande fait que le lecteur qui la copie obtient une erreur. C’est un défaut de justesse, pas une préférence de mise en forme.
- **Des liens qu’une machine peut vérifier.** Des liens en texte peuvent être validés dans un build, un ensemble de documentation peut donc échouer à ses propres contrôles quand un lien meurt. Vérifier les relations d’hyperliens à l’intérieur de deux cents archives est un projet en soi.
- **Des diagrammes en tant que texte.** Un diagramme écrit en texte délimité vit dans le diff, se relit comme de la prose, et ne demande à personne de retrouver le fichier de dessin d’origine. Un groupe de formes collé dans Word est une image sans source.
- **Le front matter.** Un en-tête lisible par une machine, portant un propriétaire, une date de relecture et un statut, qu’un build peut lire et sur lequel il peut agir. Word a des propriétés de document, que personne ne remplit.

## À grande échelle : recherche, scripts, publication, pérennité, accessibilité

Tout ce qui précède concerne un seul document. Les dimensions ci-dessous n’apparaissent qu’une fois qu’il y en a deux cents, c’est-à-dire exactement au moment où une décision de format devient coûteuse à annuler.

### La recherche, et ce que « chercher » signifie dans chaque cas

La recherche textuelle dans un répertoire de fichiers Markdown est exacte, rapide et accessible à tout : une expression régulière, une phrase sensible à la casse, une recherche restreinte aux titres, une recherche qui liste fichier et numéro de ligne. Elle tourne sur un portable sans index ni service, et elle tourne dans un build, ce qui veut dire qu’un ensemble de documentation peut répondre à des questions sur lui-même. Cherchez chaque page qui mentionne un point d’entrée déprécié, et vous obtenez une liste de lignes sur lesquelles agir.

Chercher dans un parc Word, c’est chercher dans un index maintenu par ce qui stocke les fichiers. Au mieux, cela trouve des documents, pas des lignes, et cela les classe par pertinence plutôt que de les lister de façon exhaustive — la bonne conception pour trouver un document, la mauvaise pour auditer une affirmation. Cela ne trouve rien à l’intérieur d’une capture d’écran, et cela ne vous dira pas que l’expression apparaît dans un pied de page à la page onze de six fichiers.

### Scripter un changement sur deux cents fichiers

Un produit change de nom. Une adresse de support change. Une URL déménage d’un domaine à un autre. En Markdown, c’est une commande, un diff qu’on lit avant de committer, et une relecture par quelqu’un qui vérifie les cas limites — ceux à l’intérieur des exemples de code, ceux à l’intérieur du texte des liens, la forme possessive. Le changement entier est une unité relisible d’un bloc, et soit il s’est produit partout, soit le diff montre qu’il ne s’est pas produit.

Dans un parc Word, le même changement offre trois options : ouvrir chaque fichier, scripter contre les parties XML, ou écrire une macro. Les trois fonctionnent. Ce qui se passe réellement, c’est que quelqu’un traite les vingt fichiers importants, a l’intention de finir, et ne finit pas — et la moitié qui n’a pas été faite est invisible, parce qu’il n’y a ni diff à regarder ni contrôle qui échoue. Six mois plus tard, l’ancien nom du produit se trouve encore dans quatre propositions envoyées à des clients. Le coût de ne pas pouvoir scripter un changement n’est pas le travail ; c’est que les changements partiels ne laissent aucune trace.

### Publier sur une page web

Depuis Markdown, publier est le cas ordinaire : une conversion vers une page HTML complète, ou un générateur s’il y a un ensemble de pages qui se lient entre elles. La sortie est un balisage sémantique qui hérite de son style d’un modèle, ce qui veut dire que tout l’ensemble a l’air cohérent parce que le style n’a jamais été dans les documents.

Depuis Word, publier est un détour. La sortie « enregistrer en page web » de l’application porte une grande quantité de balisage qui existe pour reproduire le rendu de Word plutôt que pour décrire le document, et le résultat est difficile à restyler et désagréable à maintenir. Le chemin qui fonctionne est le chemin indirect : convertir la `.docx` en Markdown, relire ce que la conversion a gardé, puis publier depuis le Markdown. Si vous publiez régulièrement depuis Word, ce détour est l’argument pour changer quel format fait office de source.

### Pérennité et dépendance à un fournisseur

L’argument de pérennité de Markdown est le plus solide qu’il ait. Le fichier est du texte ; il se lit correctement dans n’importe quel éditeur, sur n’importe quel système d’exploitation, sans qu’aucun logiciel n’ait besoin d’exister encore. Dans vingt ans, les titres seront encore visiblement des titres.

La position de Word est meilleure que sa réputation. Le format est ouvert et normalisé — ECMA-376, équivalent à l’ISO/IEC 29500 (vérifié sur ecma-international.org, le 9 septembre 2026) —, d’autres applications le lisent et l’écrivent, et des fichiers vieux de dix ans s’ouvrent aujourd’hui. Ce n’est pas une dépendance à un fournisseur au sens légal ou technique. La dépendance est comportementale, et elle est réelle : le modèle d’entreprise, les macros que quelqu’un a écrites, les habitudes de relecture, le fait que chaque document suppose une application dotée d’un modèle de page. C’est ce qui rend un parc Word coûteux à quitter, pas le format de fichier.

Le classement pour un document que l’on veut lisible dans vingt ans est donc : Markdown en premier, `.docx` en second, et tout document cloud propriétaire qui n’existe qu’à l’intérieur de l’éditeur d’un seul fournisseur loin derrière en troisième. Si la pérennité est une exigence formulée, gardez une source Markdown et un PDF exporté, et traitez le fichier Word modifiable comme le jetable des deux.

### Accessibilité

Word est plus capable ici que la plupart des ingénieurs ne le supposent. Les styles de titre produisent un vrai plan de document qu’un lecteur d’écran peut parcourir, les images ont un champ de texte alternatif, les tableaux peuvent avoir une ligne d’en-tête désignée, et l’application embarque un vérificateur d’accessibilité dont les règles publiées incluent un texte alternatif sur tout contenu non textuel et un contraste suffisant entre texte et fond (vérifié sur support.microsoft.com, le 9 septembre 2026). Le piège est que tout cela se fait document par document et dépend du fait que l’auteur utilise des styles plutôt que de grossir et mettre en gras le texte — exactement l’habitude qui casse aussi la conversion.

Markdown est sémantique par construction. Un titre est un titre sans aucun moyen de le simuler, le texte alternatif fait partie de la syntaxe des images, et les listes sont des listes. Ce que Markdown ne peut pas exprimer, c’est le reste de la surface d’accessibilité : un attribut de langue, la portée d’un tableau, une légende liée à un tableau, de l’ARIA là où il en faut. Cela vient du modèle ou du thème qui affiche le Markdown, ce qui est le point structurel important — on audite un ensemble de documentation Markdown une fois, dans son thème, et chaque page hérite du résultat. On audite un parc Word document par document, pour toujours.

## Là où Markdown perd, et ce que ça coûte

Markdown l’emporte sur presque tous les critères qui importent à une équipe technique, et il perd complètement chaque fois que le rôle du document est d’être imprimé, signé, ou relu par quelqu’un qui travaille dans Word. Cela vaut la peine d’être dit sans détour plutôt qu’en tournant autour, parce que les échecs sont prévisibles et que chacun a un coût qu’on peut chiffrer.

**Quand l’artefact est une page imprimée.** Tout ce qu’on remet à une personne sur papier a une mise en page, et une mise en page signifie des pages, des marges, des en-têtes et un contrôle sur ce qui tombe où. Markdown ne peut rien exprimer de tout cela ; une conversion en PDF donne ce que le modèle décide. Coût : soit vous acceptez la pagination du modèle, soit vous passez le temps de construire un modèle qui fait ce que vous voulez, ce qui est un vrai projet avec un propriétaire.

**Quand quelque chose doit être signé.** Un devis, un contrat, un accusé de réception de politique. Les flux de signature attendent un document paginé aux positions fixes, et l’artefact signé fait office de trace. Coût : nul si vous convertissez à la fin, considérable si vous essayiez de faire de Markdown la chose signée.

**Quand le relecteur travaille dans Word et ne bougera pas.** Un avocat, un régulateur, un auditeur, l’équipe achats d’un client. Il renverra un fichier avec des modifications suivies, et faire revenir ces modifications dans une source Markdown est un travail manuel qu’aucun convertisseur ne fait bien. Coût : un après-midi d’une personne par tour de relecture, et le risque qu’un changement soit oublié.

**Quand le document est un objet de design.** Une proposition, une brochure, un rapport à la charte d’un client. Coût : des heures de contournements, et finalement l’aveu que le document a toujours été un artefact de design.

**Quand des relecteurs non techniques doivent commenter.** Pas modifier — commenter. Les fils de commentaires ancrés de Word sont le bon outil, et il n’existe aucun équivalent Markdown qu’un relecteur non technique utilisera. Coût : les commentaires arrivent par e-mail à la place, sans ancrage, et se perdent.

**Quand il y a des formulaires et des champs à remplir.** Rien en Markdown ne sait faire cela. Coût : le mauvais outil, complètement.

**Quand personne ne possède le pipeline.** Le *docs as code* a besoin d’un dépôt, d’une habitude de relecture, d’un build, et de quelqu’un qui entretient les trois. On ne devrait pas demander à une petite équipe sans ingénieurs d’en faire tourner un. Coût : le pipeline casse, personne ne le répare, et la documentation retourne au lecteur partagé avec, en prime, une pointe de ressentiment.

**Quand le dialecte dérive.** Markdown est une famille de dialectes. Un tableau s’affiche sur votre hébergeur de code et ressort en barres verticales dans votre build, les notes de bas de page marchent dans un analyseur et pas dans le suivant. Coût : des bogues qui n’apparaissent que dans la sortie publiée.

**Quand les tableaux sont compliqués.** Cellules fusionnées, tableaux imbriqués, une cellule contenant une liste. Les tableaux Markdown sont de simples grilles. Coût : soit le tableau est simplifié, ce qui est souvent une amélioration, soit il devient du HTML brut au milieu de votre prose.

## L’hybride où finissent la plupart des organisations, et comment l’empêcher de pourrir

Presque personne ne fonctionne avec un seul format. L’état final est un hybride, et l’hybride est très bien — ce qui pourrit, c’est la version où les deux formats sont traités comme des originaux. C’est le dispositif où quelqu’un corrige une coquille dans la copie Word le mardi, la source Markdown est régénérée le mercredi, et la correction du mardi disparaît sans que personne ne le remarque pendant un an.

Une seule règle empêche cela : **un format est la source, l’autre est un export, et l’export n’est jamais modifié.** Tout le reste est de la mise en œuvre.

| Document | Source | Export | Qui modifie la source |
| --- | --- | --- | --- |
| Référence d’API, runbooks, notes d’architecture | Markdown dans le dépôt | Page HTML, ou un PDF pour un audit | Les ingénieurs, en pull requests |
| Livret d’accueil, politiques | Markdown dans le dépôt | Une `.docx` ou un PDF pour l’impression et l’accusé de réception | Les RH, via l’éditeur web de l’hébergeur |
| Contrats, devis | Word | PDF pour la signature ; Markdown seulement s’il doit être publié | Le juridique, en modifications suivies |
| Propositions et rapports conçus | Word, depuis le modèle maison | PDF | Quiconque possède l’affaire |
| Comptes rendus de réunion, journaux de décisions | Markdown | Aucun | N’importe qui |
| Dépôts réglementaires et tout ce qui a une mise en page imposée | Word | PDF | La personne qui possède le dossier |

Trois pratiques gardent le dispositif honnête, et toutes trois sont bon marché :

1. **Tamponnez chaque export.** Un fichier généré le dit, sur sa première page : généré depuis telle source, à telle date, depuis tel commit. Quiconque ouvre l’export et veut changer un mot sait alors où aller. Sans ce tampon, l’export est indiscernable d’un original et sera modifié comme tel.
2. **Régénérez plutôt que réparez.** Quand un export est faux, la correction va dans la source et l’export est reconstruit. Si jamais une correction va directement dans l’export, vous avez désormais deux sources, et le compte à rebours a commencé.
3. **Nommez un propriétaire par type de document, pas par document.** « Toutes les politiques sont en Markdown, les RH les possèdent » est une règle que les gens peuvent suivre. « Celui-ci est en Word parce que Priya préfère ça » est comment on revient à trois réponses différentes sur l’endroit où vit la documentation.

### Migrer un parc Word vers Markdown

Ne commencez pas par convertir. Commencez par lister ce que vous avez et décider, document par document, s’il doit même exister — un projet de conversion qui commence par une conversion en masse produit deux cents fichiers Markdown dont soixante sont obsolètes et quarante n’ont jamais été des documents, et personne ne les triera jamais après coup.

Convertissez ensuite ceux qui survivent, par petits lots, et relisez chaque résultat contre l’original. Les titres qui avaient été grossis et mis en gras plutôt que stylés arrivent en simples paragraphes ; les listes numérotées arrivent en texte brut quand les définitions de numérotation ne se résolvent pas ; les images atterrissent en fichiers séparés ou disparaissent ; les légendes deviennent des phrases ordinaires qui n’appartiennent plus à rien. Les chemins de conversion et la liste de contrôle pour repérer exactement ces échecs se trouvent dans [comment convertir une .docx en Markdown](/blog/convert-docx-to-markdown), et pour un document isolé sans rien à installer, [la conversion Word vers Markdown de TransformPipe](/word-to-markdown) tourne dans le navigateur — déconnecté, le fichier n’est téléversé nulle part, ce qui compte quand le document est un projet de politique plutôt qu’un README public.

Deux règles pour la migration elle-même. Laissez les documents conçus tranquilles : une brochure convertie en Markdown est une brochure détruite, et la bonne réponse pour elle est de garder le fichier Word et d’arrêter de prétendre que c’est de la documentation. Et gardez les fichiers `.docx` d’origine quelque part en lecture seule jusqu’à ce que la migration soit assez ancienne pour que plus personne ne demande ce que la conversion a laissé tomber.

### Faire le chemin inverse, pour un tour de relecture

Le sens inverse est une routine, pas une migration. Un relecteur a besoin d’un fichier Word ; la source reste en Markdown. Convertissez en `.docx` avec un document de référence pour que la sortie arrive dans le modèle maison, envoyez-la, et faites revenir les modifications suivies renvoyées dans le Markdown à la main. Cette dernière étape est manuelle et ne s’automatise pas : la couche de relecture vit dans des parties de l’archive que les convertisseurs soit abandonnent, soit aplatissent en texte ordinaire, ce qu’on récupère est donc soit le document avec tous les changements acceptés, soit un désordre. [Obtenir une .docx que quelqu’un peut réellement modifier](/blog/markdown-to-word) couvre la mécanique du modèle.

Budgétez la relecture manuelle, et cela fait quelques heures par tour. Supposez que ça convertira proprement dans les deux sens, et vous finirez par publier une version qui contient encore une formulation qu’un relecteur avait rejetée.

## Comment décider

1. **Nommez l’artefact que le document doit devenir.** Une page web, une page dans un dépôt, un livret imprimé, un PDF signé, un dossier déposé. S’il est imprimé ou signé, la source est Word et le débat est clos ; si c’est une page web ou un fichier que les gens lisent comme du texte, la source est Markdown, et de même.
2. **Nommez la personne la moins technique qui doit changer une phrase dans l’urgence.** Si cette personne est aux ventes, aux RH ou au juridique, soit le format est Word, soit vous lui devez une surface d’édition qu’elle utilisera réellement — et si vous n’offrez ni l’un ni l’autre, le document devient obsolète entre deux demandes, et la décision de format a été prise par défaut.
3. **Comptez la fréquence des changements, et par combien de personnes.** En dessous d’une poignée de modifications par an par un seul propriétaire, Word ne coûte rien. Des modifications hebdomadaires par une douzaine de personnes ont besoin de fusions, et Word n’a pas d’opération de fusion, le coût retombe donc sur quiconque consolide les copies.
4. **Demandez-vous si vous devrez un jour changer une expression partout à la fois.** Si la réponse est oui — noms de produits, points d’entrée, adresses, formulations juridiques —, Markdown est le seul des deux où le changement est une unité relisible plutôt qu’un acte de diligence auquel il faut faire confiance.
5. **Demandez-vous si quelqu’un aura besoin de savoir pourquoi une phrase dit ce qu’elle dit.** Pour les contrôles de sécurité, les engagements de service et tout ce qu’un auditeur lit, la provenance fait partie du rôle du document, et seul le contrôle de version l’enregistre au niveau de la phrase.
6. **Décidez qui possède le pipeline avant d’en construire un.** Un dépôt, une habitude de relecture et un build ont besoin d’un propriétaire nommé ; si vous ne pouvez en nommer aucun, choisissez le format qui n’a besoin d’aucun pipeline, et révisez la question quand vous le pourrez.

## Conclusion

La documentation doit vivre dans le format qui correspond à ce qu’elle doit faire, et pour la majeure partie de la documentation qu’une organisation technique entretient, ce format est le Markdown en contrôle de version — parce que ce qui garde une documentation véridique, ce sont la relecture, l’historique, la recherche et la capacité à changer une expression partout à la fois, et ce sont les quatre choses où du texte dans un dépôt excelle. Word reste la bonne réponse, en permanence et sans complexe, pour les documents dont le rôle est d’être mis en page, imprimés, signés, ou négociés clause par clause avec quelqu’un dont l’outil est les modifications suivies. Faites tourner les deux, décidez par type de document lequel est la source, générez l’autre, et tamponnez le fichier généré pour que personne ne le modifie par erreur — alors le seul travail qui reste est la conversion à la frontière, qui est une opération d’une seule étape dans les deux sens, et la seule partie de tout cela qu’un outil peut résoudre à votre place.

## FAQ

### Markdown est-il meilleur que Word pour la documentation ?

Pour une documentation qui change souvent, est entretenue par plusieurs personnes et finit sur une page web, oui — à cause de la relecture, de l’historique, de la recherche et de la modification en masse, pas de la syntaxe. Pour un document qui doit être imprimé sur un modèle, signé, ou relu clause par clause, Word est meilleur, et de loin.

### Des collègues non techniques peuvent-ils vraiment écrire de la documentation en Markdown ?

La syntaxe n’est pas l’obstacle ; la plupart des gens apprennent les dièses et les tirets en dix minutes. L’obstacle est le flux de travail autour — branches, commits, relectures —, donnez-leur donc l’éditeur web de l’hébergeur de code avec un aperçu, ou un système de contenu qui réécrit le Markdown dans le dépôt. Leur demander d’utiliser un terminal est la façon dont un programme *docs as code* échoue en silence.

### Que deviennent les modifications suivies et les commentaires quand je convertis un document Word en Markdown ?

Ce sont la première chose perdue. Les insertions et suppressions en attente sont soit acceptées en silence, soit abandonnées, et les fils de commentaires n’ont strictement aucun équivalent Markdown, ils disparaissent donc en général sans avertissement. Résolvez la couche de relecture dans Word avant de convertir, et relevez à la main tout ce que vous devez conserver.

### Comment imprimer un document Markdown ou en obtenir un PDF ?

Convertissez-le en HTML et imprimez depuis un navigateur, qui utilise les styles propres à la page, ou convertissez en `.docx` avec un modèle maison et imprimez depuis là. Dans les deux cas, la pagination est décidée par le modèle plutôt que par le document, si la mise en page compte, c’est donc le modèle qu’il faut construire.

### Faut-il garder la .docx d’origine après l’avoir convertie ?

Gardez-la en lecture seule jusqu’à ce que le Markdown ait été lu, relu et utilisé un moment. Les conversions abandonnent des choses en silence — légendes, numérotation, contenu flottant — et l’original est le seul moyen de découvrir ce qui a disparu, une question que quelqu’un pose toujours environ trois mois plus tard.

### Word enferme-t-il notre documentation ?

Pas au niveau du format : `.docx` est Office Open XML, une norme documentée publiée sous les noms ECMA-376 et ISO/IEC 29500, que plusieurs applications lisent et écrivent. La dépendance est comportementale — le modèle, les macros, les habitudes de relecture, et le postulat que chaque document a des pages — et c’est cela qui rend un parc de documents Word coûteux à déplacer, pas les fichiers eux-mêmes.

### Quel format est le meilleur pour l’accessibilité ?

Word peut exprimer davantage, y compris un attribut de langue, des lignes d’en-tête de tableau et un vérificateur d’accessibilité, mais chaque document doit être rédigé correctement et audité individuellement. Markdown est sémantique par construction et hérite du reste de son modèle, on audite donc le thème une fois et chaque page en profite — généralement le chemin le moins cher vers un ensemble de documents qui sont tous accessibles plutôt que certains seulement.
