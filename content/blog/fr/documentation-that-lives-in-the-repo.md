---
title: "Une documentation qui vit à côté du code"
description: "Pourquoi la documentation gardée dans le dépôt reste plus près du vrai : les quatre types de documents, un dossier docs qui tient, la revue contre la dérive"
updated: 2026-09-09
date: 2026-07-29
tag: Workflow
keywords: documentation en markdown, docs as code, modèle de readme, écrire une bonne readme, bonnes pratiques readme, outil de documentation interne, documentation dans git, diataxis, journal des décisions d’architecture, structure du dossier docs, fichier contributing, markdownlint, vale linter de prose
---

La page du wiki affirme que le service écoute sur le port 8080. Il est passé à 8443 au printemps dernier. Personne n’a menti : l’ingénieur qui a déplacé le port a modifié un fichier de configuration, un test et un manifeste de déploiement, et aucun des trois ne se trouvait près de la phrase qui est aujourd’hui fausse.

C’est là tout l’argument des docs as code. Du Markdown dans le dépôt ne rend pas un document correct. Il place la phrase fausse sous les yeux de la personne qui est en train de la rendre fausse, pendant que le fichier est encore ouvert.

Ce n’est pas une victoire gratuite, et la plupart des équipes qui s’y essaient finissent avec un dossier `docs/` que personne n’ouvre. Ce qui sépare les deux issues n’est pas l’outillage. C’est de savoir si les documents sont triés selon ce que le lecteur est venu faire, si quelqu’un est nommé sur chacun d’eux, et si la revue qui rattrape un mauvais numéro de port est la même que celle qui rattrape un mauvais nom de fonction.

### En bref

Mettez dans le dépôt tout ce qu’un commit peut démentir, et relisez le paragraphe dans la même pull request que le comportement qu’il décrit — c’est tout le mécanisme, et le reste n’existe que pour le soutenir. Triez les fichiers selon les quatre types de documentation, pour qu’un lecteur sache quel fichier répond à sa question ; gardez les décisions sous forme de journaux datés plutôt que de documents de conception ; et laissez `CODEOWNERS`, un linter Markdown, un linter de prose et un vérificateur de liens faire échouer le build sur les erreurs bon marché. Publiez ensuite les pages rendues, parce que les gens qui ont le plus besoin de la documentation ne savent pas cloner un dépôt et n’ont pas à ce qu’on le leur demande.

## Ce que le dépôt vous apporte réellement

**La même revue.** Une pull request qui change un comportement sans toucher à la documentation est un manque visible — le relecteur voit le trou pendant que la modification est encore sous ses yeux. Corriger le wiki après coup est une tâche distincte, et les tâches distinctes perdent toujours contre ce qui est en train de brûler.

**Le même historique.** `git log -S'8080' -- docs/` retrouve le commit qui a ajouté ou retiré une chaîne de caractères, ce qui date une phrase devenue fausse. `git blame` vous donne le commit derrière un paragraphe, et de là la pull request et le raisonnement que la prose n’a jamais reçu. Les historiques de wiki conservent des révisions, rarement des décisions.

**Le même outillage.** De la documentation dans git, ce sont des fichiers texte : grep les trouve, et un vérificateur de liens peut faire échouer le build sur un chemin relatif mort. La documentation d’une fonctionnalité non publiée attend dans la branche, aux côtés du code, et sort au moment du merge — ni une semaine trop tôt, ni un mois trop tard.

**Les mêmes adresses.** Un lien relatif d’un fichier vers un autre est un chemin qu’un outil sait résoudre et sur lequel un build sait échouer. Un lien de wiki est une URL, et une page de wiki renommée laisse chaque lien qui la vise pointer dans le vide, ce que découvrira des mois plus tard un lecteur convaincu que le document a été supprimé exprès.

**La même livraison.** Une documentation qui fusionne avec le code ne peut pas décrire une version qui n’est pas encore sortie, ni traîner derrière une version qui l’est. Sur un wiki, la page et le déploiement sont deux événements que quelqu’un doit penser à aligner, et l’écart entre les deux est exactement l’endroit où loge le mauvais numéro de port.

La limite, honnêtement : rien de tout cela ne force qui que ce soit à écrire le document. Cela rend visible le fait de ne pas l’écrire, ce qui est une prétention plus modeste que celle qu’affiche d’ordinaire la promotion des docs as code.

## Les quatre types de documentation, et pourquoi les mélanger les cache tous les quatre

La plupart des documentations internes sont introuvables pour une raison qui n’a rien à voir avec la recherche. Une page intitulée « Premiers pas » commence comme une leçon, devient trois écrans plus bas une liste de clés de configuration, et se termine par deux paragraphes sur les raisons du choix de Postgres. Chaque morceau est exact. Rien n’est trouvable, parce que le lecteur qui cherche la clé de configuration n’ouvre pas une page intitulée « Premiers pas », et que le lecteur qui découvre le système arrête de lire au tableau.

Diátaxis est le cadre qui nomme ce problème. C’est le travail de Daniele Procida, et il distingue quatre types de documentation répondant à quatre besoins distincts : les tutoriels, les guides pratiques, la référence technique et l’explication (vérifié sur diataxis.fr, le 9 septembre 2026). Ce qui le rend utile, ce n’est pas l’existence de quatre catégories. C’est qu’un document ne peut en servir correctement qu’une seule, et qu’un document qui tente d’en servir deux n’en sert aucune.

| Type | Tourné vers | La question du lecteur | À quoi il ressemble | Comment il rate sa cible |
| --- | --- | --- | --- | --- |
| Tutoriel | L’apprentissage | « Apprends-moi ceci » | Une activité concrète, de rien jusqu’à un résultat qui fonctionne | Il suppose une étape que le débutant n’a pas franchie, et celui-ci perd confiance |
| Guide pratique | Un objectif | « Comment fais-je X ? » | Un itinéraire à travers un problème, pour quelqu’un de déjà compétent | Il s’arrête pour expliquer, et le lecteur compétent perd le fil |
| Référence | L’information | « Quelles sont les options ? » | Une description neutre de la mécanique, calquée sur la structure du code | Elle conseille, spécule ou vend, et cesse d’être digne de confiance |
| Explication | La compréhension | « Pourquoi est-ce ainsi ? » | Un traitement discursif qui autorise la réflexion, lu à distance du travail | Elle se transforme en consignes que personne ne suit |

Les distinctions sont plus tranchées qu’elles n’en ont l’air. Diátaxis dit explicitement que les guides pratiques sont entièrement distincts des tutoriels et que les deux sont sans cesse confondus : un tutoriel sert celui qui apprend et ne sait pas encore ce qu’il veut, tandis qu’un guide pratique sert le travail de l’utilisateur déjà compétent, qui le sait. La référence doit être austère — sa mission est la certitude, et la formule du site est qu’on ne lit guère un document de référence, on le consulte, avec une structure qui reflète celle du produit (vérifié sur diataxis.fr, le 9 septembre 2026). L’explication est celle qui n’a aucune frontière naturelle, raison pour laquelle elle déborde sur tout le reste si on la laisse faire.

**Ce que cela change dans un dépôt.** Trier par type ne coûte presque rien quand les documents sont des fichiers. Un répertoire par type est le geste évident :

```
docs/
  tutorials/       first-deploy.md
  how-to/          rotate-the-signing-key.md, restore-from-backup.md
  reference/       configuration.md, http-api.md, error-codes.md
  explanation/     why-we-left-the-monolith.md
  decisions/       0007-postgres-over-dynamodb.md
```

Si quatre répertoires représentent plus de cérémonie que votre dépôt n’en mérite, la version économique suffit : nommez chaque fichier d’après son type et gardez les types non mélangés à l’intérieur. `restore-from-backup.md` est un guide pratique et ne doit contenir aucun paragraphe expliquant le format de sauvegarde ; l’explication obtient son propre fichier et un lien. Le test tient en une phrase — si vous ne savez pas dire lequel des quatre est un document, c’est qu’il y en a deux.

**Pourquoi cette section est celle qui rapporte.** Les autres défauts évoqués ici sont réparables. Une phrase périmée se corrige dès que quelqu’un la remarque ; un linter manquant s’ajoute en un après-midi. Un ensemble documentaire trié par équipe, par service ou par ordre de rédaction reste introuvable pour toujours, parce que rien en lui n’indique au lecteur où chercher, et la réponse habituelle — ajouter une page qui indexe les autres pages — crée un cinquième document qui se périme lui aussi.

## Un dossier docs qui tient à l’échelle

Les dépôts échouent sur la documentation dans deux directions opposées. L’un met tout dans le README jusqu’à ce qu’il fasse quatre mille mots et que personne ne lise au-delà de la commande d’installation. L’autre crée `docs/` dès le premier jour, le remplit de trois ébauches et d’un `architecture.md` qui décrit une conception abandonnée au deuxième mois. Ce qui marche, c’est un petit nombre de fichiers aux rôles distincts, dont chacun peut être reconnu comme faux par quelqu’un.

| Fichier | Ce que c’est | Qui l’écrit | Ce qui le rend faux |
| --- | --- | --- | --- |
| `README.md` | L’index et le plus court chemin vers une copie qui tourne | Celui qui change l’installation | Une commande qui ne marche plus |
| `docs/` | Tout ce qui a débordé du README, trié par type | La personne qui change le comportement | Un commit sur le code qu’il décrit |
| `docs/decisions/` | Un journal daté par décision d’architecture | La personne qui a tranché | Rien — un journal remplacé reste vrai quant à son propre moment |
| `CONTRIBUTING.md` | Comment proposer un changement et ce qui sera vérifié | Les mainteneurs | Un changement dans le processus de revue ou dans la chaîne d’outils |
| `CHANGELOG.md` | Ce qui a changé pour un lecteur, à chaque version | Celui qui livre | Une version qui sort sans son entrée |
| `CODEOWNERS` | Qui est sollicité pour relire quels chemins | Les responsables d’équipe | Une équipe renommée, une personne qui part |

**Le README est un index, pas un manuel.** Son rôle est d’amener un inconnu jusqu’à une copie qui fonctionne, puis de désigner tout le reste. Chaque section qui dépasse un écran devient un fichier dans `docs/`, avec un renvoi d’une ligne laissé derrière elle. C’est la règle de structure la plus fiable de cette page, parce qu’un README qui reste court reste lu, et qu’un README que personne ne lit est l’endroit où des instructions d’installation fausses se cachent le plus longtemps.

**`docs/` contient ce qu’un commit peut démentir.** Les clés de configuration, le comportement de l’API, les étapes de déploiement, les codes d’erreur, la procédure d’intervention pour l’alerte qui réveille quelqu’un à trois heures du matin. Ce sont les documents dont la fausseté est causée par une modification du code, ce qui est précisément pourquoi ils ont leur place à côté de lui. Tout ce dont la fausseté vient d’une décision plutôt que d’un commit ne gagne rien à passer par git.

### Les journaux de décision, et pourquoi ils battent un document de conception

Un document de conception décrit un système tel que quelqu’un a espéré qu’il serait, à une date que le document porte rarement, et il devient faux dès le premier changement de plan. Personne ne le met à jour, parce que le mettre à jour signifie réécrire un récit, et personne ne le supprime, parce qu’il a peut-être encore raison quelque part.

Un journal de décision d’architecture a une tout autre forme. Il consigne une décision unique et sa justification — un choix de conception argumenté répondant à une exigence architecturalement significative — accompagnée des arbitrages et des conséquences qui sont venus avec. La pratique a été popularisée par Michael Nygard dans un billet de 2011, « Documenting Architecture Decisions », et le format prolonge des travaux antérieurs de Zdun et d’autres sur les décisions d’architecture durables (vérifié sur adr.github.io, le 9 septembre 2026). Le modèle de Nygard est celui dont partent la plupart des équipes ; MADR — Markdown Architectural Decision Records — est un modèle épuré pour le même usage, sous double licence MIT ou CC0 (vérifié sur adr.github.io, le 9 septembre 2026).

```markdown
# 7. Postgres over DynamoDB for the ledger

- Status: accepted
- Date: 2026-03-04
- Deciders: payments team

## Context

We need transactional writes across the ledger and the balance
cache. The rest of the estate is DynamoDB.

## Decision

Postgres, on the managed instance the billing service already uses.

## Consequences

One more datastore to operate, and a second connection pool in the
worker. In exchange, the double-write bug that closed BILL-412
becomes structurally impossible rather than tested for.
```

Si un journal survit à un document de conception, c’est qu’il n’est jamais faux. C’est un énoncé sur ce qu’une équipe savait et a choisi à une date donnée. Quand la décision est renversée, vous ne modifiez pas le journal 7 — vous écrivez le journal 12, vous passez le 7 en « remplacé » et vous liez les deux. Le résultat est un répertoire qui se lit comme une histoire du raisonnement, ce dont un nouvel ingénieur a réellement besoin et ce que `git log` ne donne jamais tout à fait, puisqu’un commit consigne ce qui a changé et non ce qui a été écarté.

Numéroter les fichiers (`0007-postgres-over-dynamodb.md`) les maintient dans l’ordre et donne à chacun un nom stable à citer dans une pull request. Gardez-les courts. Un journal qui demande une heure d’écriture ne sera pas écrit, et les quatre titres ci-dessus suffisent à répondre dans un an à la question, qui est toujours une variante de « mais pourquoi diable est-ce ainsi ».

### CONTRIBUTING, et les vérifications qu’il devrait nommer

`CONTRIBUTING.md` peut vivre à la racine du dépôt, dans `docs/` ou dans `.github/`, et GitHub en affiche un lien quand quelqu’un ouvre une pull request ou un ticket, ainsi que dans la barre latérale du dépôt (vérifié sur docs.github.com, le 9 septembre 2026). Cet emplacement fait toute sa valeur : c’est le seul document qu’un contributeur voit la première fois, au moment précis où il en a besoin.

Limitez-le à ce qu’un contributeur doit faire, et non à ce que le projet professe. Les étapes pour lancer les tests, la convention de message de commit s’il y en a une, ce que l’intégration continue vérifiera et donc ce qui échouera, le délai habituel d’une relecture, et où poser une question. Si votre documentation vit dans `docs/`, c’est également ici que vous le dites — un contributeur qui ignore que la documentation est dans le dépôt n’ira pas la chercher.

### CHANGELOG, et pourquoi ce n’est pas le journal des commits

Le changelog est le seul fichier du répertoire écrit pour quelqu’un d’extérieur au dépôt. Keep a Changelog est la convention qui mérite d’être adoptée, en partie pour ses six catégories — Added, Changed, Deprecated, Removed, Fixed, Security — et surtout pour son argument : un journal de commits fait un mauvais changelog parce qu’il est plein de bruit, commits de fusion, titres obscurs, remaniements de documentation (vérifié sur keepachangelog.com, le 9 septembre 2026). Un commit documente une étape dans l’évolution du code source. Une entrée de changelog documente une différence notable, souvent répartie sur plusieurs commits, pour un lecteur qui n’a jamais vu le code. [Transformer ce fichier en notes que les gens lisent vraiment](/blog/release-notes-from-markdown) est un métier à part entière, et le travers est toujours le même : livrer le diff au lieu de la conséquence.

## Les outils, comparés

On peut faire vivre un ensemble documentaire dans un dépôt sans aucun générateur : des fichiers Markdown, un convertisseur quand quelqu’un a besoin d’une page, et rien à maintenir. Cela cesse de fonctionner au moment où les lecteurs ont besoin d’une navigation, d’une recherche transversale et d’une URL stable par page. Les outils ci-dessous sont ceux qu’il vaut la peine de connaître avant de choisir.

| Outil | Ce qu’il exige | Ce qu’il construit | Licence | À qui il convient |
| --- | --- | --- | --- | --- |
| Du Markdown simple plus un convertisseur | Rien, si le convertisseur tourne dans le navigateur | Un fichier HTML autonome par document | Variable selon le convertisseur | Une poignée de procédures et de READMEs ; les documents ayant un destinataire nommé |
| MkDocs | Python | Un site HTML statique à partir de Markdown et d’un seul fichier de configuration YAML | BSD 2-Clause | Les projets Python qui veulent un site de doc le jour même |
| Material for MkDocs | Python, en tant que thème MkDocs | Le même site, avec recherche, navigation et cartes sociales intégrées | MIT, avec accès anticipé aux nouveautés pour les sponsors | Les équipes qui veulent que ce soit beau sans écrire de CSS |
| Docusaurus | Node.js, React | Un site statique avec des pages MDX et une documentation versionnée | MIT (sa propre doc est en Creative Commons) | Une doc produit qui doit servir plusieurs versions publiées à la fois |
| Sphinx avec MyST | Python | HTML, LaTeX pour le PDF, ePub et Texinfo depuis une source unique | BSD 2-Clause ; MyST-Parser est en MIT | La référence d’API générée depuis le code, et tout ce qui exige un PDF |
| Hugo | Rien de plus que le binaire ; écrit en Go | Un site statique de n’importe quelle forme, pas seulement de la doc | Apache 2.0 | Une documentation qui partage un site avec des pages marketing |
| mdBook | Rien de plus que le binaire ; écrit en Rust | Un livre en ligne avec chapitres et table des matières | MPL 2.0 | Du matériel linéaire — manuels, guides, formations |
| Docsify | Un serveur web ; il se charge depuis un CDN | Aucun fichier statique : il rend le Markdown dans le navigateur | MIT | Un dossier `docs/` que vous voulez servir sans ajouter d’étape de build |

Vérifié sur mkdocs.org et github.com/mkdocs/mkdocs, squidfunk.github.io/mkdocs-material, docusaurus.io et github.com/facebook/docusaurus, sphinx-doc.org et github.com/sphinx-doc/sphinx, github.com/executablebooks/MyST-Parser, gohugo.io, github.com/rust-lang/mdBook et github.com/docsifyjs/docsify, le 9 septembre 2026.

**MkDocs** est le plus court trajet entre un répertoire de Markdown et un site de documentation : un fichier YAML, une commande, du HTML statique en sortie (vérifié sur mkdocs.org, le 9 septembre 2026). Il est écrit en Python et publié sous BSD 2-Clause. Si votre projet est déjà en Python, il n’y a rien à discuter.

**Material for MkDocs** est un thème et non un générateur, et c’est la raison pour laquelle la plupart des gens croisent MkDocs. Il fournit la recherche, une navigation adaptative et la génération de cartes sociales sans une ligne de CSS de votre part, sous licence MIT, avec un programme Insiders qui donne aux sponsors un accès anticipé aux nouveautés (vérifié sur squidfunk.github.io, le 9 septembre 2026). En contrepartie, votre site ressemblera à un très grand nombre d’autres sites, ce qui, pour de la documentation interne, est un avantage.

**Docusaurus** repose sur React et MDX et produit des fichiers HTML statiques, avec le versionnement des documents comme fonctionnalité de premier plan (vérifié sur docusaurus.io, le 9 septembre 2026). Le versionnement est la raison de le choisir : si vous maintenez trois versions et que chacune a besoin de son propre arbre documentaire, rien d’autre ici ne le fait aussi proprement. Le prix est une chaîne d’outils Node et le risque que votre documentation acquière des composants React, qui sont du code, ce qui signifie que la documentation a désormais un build capable de casser.

**Sphinx** est le plus ancien et le plus capable : il génère HTML, LaTeX pour le PDF, ePub et Texinfo depuis une source unique, sous BSD 2-Clause et écrit en Python (vérifié sur sphinx-doc.org et github.com/sphinx-doc/sphinx, le 9 septembre 2026). Son balisage natif est reStructuredText, véritable obstacle pour les contributeurs qui ne connaissent que Markdown ; MyST-Parser le lève en ajoutant à Sphinx un analyseur CommonMark étendu, sous licence MIT, construit sur markdown-it-py (vérifié sur github.com/executablebooks/MyST-Parser, le 9 septembre 2026). Choisissez-le quand il vous faut une référence d’API générée et un PDF depuis la même source.

**Hugo** est un unique binaire Go sous licence Apache 2.0 qui construit des sites statiques de toute forme, documentation comprise (vérifié sur gohugo.io, le 9 septembre 2026). Prenez-le quand la doc n’est qu’une section d’un site plus vaste, ou quand personne ne veut gérer un environnement Python ou Node sur la machine de build.

**mdBook** est un utilitaire Rust, sous licence MPL 2.0, qui transforme du Markdown en livre en ligne (vérifié sur github.com/rust-lang/mdBook, le 9 septembre 2026). Un livre est linéaire, ce qui est exactement inadapté à de la référence et exactement adapté à un manuel ou à une formation que vous comptez faire lire du début à la fin.

**Docsify** est l’intrus : il ne construit rien. Il se charge depuis un CDN, rend votre Markdown dans le navigateur au moment de la requête, et ne produit aucun HTML statique, sous licence MIT (vérifié sur github.com/docsifyjs/docsify, le 9 septembre 2026). Cela supprime entièrement l’étape de build, au prix d’un site dont le contenu est invisible pour tout ce qui n’exécute pas de JavaScript.

**Et aucun générateur du tout** reste une vraie réponse, plus souvent que la liste ci-dessus ne le laisse croire. Si ce que vous avez tient en onze fichiers Markdown et un besoin occasionnel d’en remettre un à quelqu’un qui n’utilise pas git, un convertisseur et un lien valent mieux qu’une chaîne de build à garder au vert. Le seuil, c’est la navigation : dès qu’un lecteur doit passer d’un document à l’autre sans connaître leurs noms de fichiers, il vous faut un générateur, et [les trois questions qui décident si vous avez franchi ce seuil](/blog/static-site-generator-or-converter) méritent une réponse avant l’installation.

## La revue est ce qui garde un document vrai

Tous les mécanismes de cette page se ramènent à une seule habitude : le paragraphe change dans la même pull request que le comportement. Tout le reste n’existe que pour que cette habitude tienne quand la personne est fatiguée et que la livraison est vendredi.

**La modification de la doc voyage avec celle du code.** Pas un ticket de suivi, pas une carte pour le prochain sprint. Un relecteur qui voit une clé de configuration renommée et rien sous `docs/reference/` en réclame une, et cette demande coûte un commentaire. La même demande une semaine plus tard coûte une réunion, et la semaine suivante elle ne coûte plus rien parce que personne ne s’en souvient.

**`CODEOWNERS` met un nom sur le répertoire.** Le fichier vit dans `.github/`, à la racine du dépôt ou dans `docs/` — GitHub cherche dans cet ordre et retient le premier qu’il trouve — et les propriétaires de code sont automatiquement sollicités pour relire dès qu’une pull request touche des chemins qui leur appartiennent, sauf sur les pull requests en brouillon. Cela ne devient une barrière que si un administrateur active les relectures obligatoires et exige l’approbation du propriétaire. La syntaxe ressemble à celle de gitignore, et c’est le dernier motif correspondant qui l’emporte, ce qui prend beaucoup de monde à revers (vérifié sur docs.github.com, le 9 septembre 2026).

```
/docs/reference/http-api.md   @acme/platform
/docs/how-to/                 @acme/sre
/docs/decisions/              @acme/architecture
```

Deux règles le rendent utile plutôt que décoratif. Possédez des répertoires, pas l’arbre entier : un propriétaire unique sur `docs/` signifie que toute modification de documentation attend les trois mêmes personnes, et la file d’attente apprend à tout le monde à la contourner. Et gardez en tête la règle du dernier motif : un motif large en bas du fichier écrase silencieusement chacun des motifs précis situés au-dessus.

**Le linting rattrape ce que la relecture fait mal.** Les relecteurs lisent le sens et manquent la structure. Les machines font l’inverse.

| Vérification | Outil | Ce qu’elle attrape | Licence |
| --- | --- | --- | --- |
| Structure Markdown | markdownlint | Des niveaux de titre qui sautent, des marqueurs de liste incohérents, des espaces en fin de ligne, des blocs non refermés | MIT |
| Prose | Vale | La dérive terminologique, les mots proscrits, les règles de style de votre propre guide | MIT |
| Liens | lychee | Les chemins relatifs morts, les ancres cassées, les URL externes qui ne répondent plus | Apache 2.0 ou MIT |

markdownlint est un vérificateur de style Node.js pour Markdown et CommonMark, doté de plus de soixante règles intégrées, sous licence MIT, exécuté via `markdownlint-cli2` ou une GitHub Action (vérifié sur github.com/DavidAnson/markdownlint, le 9 septembre 2026). Activez un petit jeu de règles et laissez le reste éteint — un ensemble documentaire qui fait échouer l’intégration continue sur la longueur des lignes apprend aux contributeurs à ajouter `<!-- markdownlint-disable -->` et à ne plus lire la sortie.

Vale est un linter de prose conscient du balisage, sous licence MIT, qui comprend la structure d’un document au lieu de faire de la reconnaissance de motifs sur le texte brut, et qui lit ses règles dans un `.vale.ini` placé dans le dépôt. Vous pouvez partir de styles publiés — ceux de Microsoft et de Google, entre autres — ou écrire les vôtres en YAML (vérifié sur vale.sh, le 9 septembre 2026). Les règles qui valent le plus dès le départ relèvent de la terminologie, pas du style : une seule orthographe pour le nom de votre produit, un seul mot pour la chose que vous nommez de trois façons.

lychee est un vérificateur de liens rapide et asynchrone écrit en Rust, sous double licence Apache 2.0 ou MIT, avec une action officielle `lycheeverse/lychee-action` pour les workflows (vérifié sur github.com/lycheeverse/lychee, le 9 septembre 2026). Vérifiez les liens internes à chaque pull request et les liens externes selon un calendrier — les contrôles externes échouent pour des raisons sans aucun rapport avec votre modification, et une vérification obligatoire instable finit ignorée, puis retirée.

**Faites échouer le build, mais seulement sur ce qu’un lecteur remarquerait.** Un lien relatif cassé, c’est un lecteur qui tombe sur une 404 : cela doit bloquer une fusion. Un point manquant dans une liste à puces, non : cela ne doit rien bloquer. La liste des vérifications bloquantes est une promesse sur ce qui n’atteindra jamais un lecteur, et chaque élément qui n’atteint pas ce niveau rend la liste entière moins crédible.

## Le vieillissement, et pourquoi « dernière vérification » bat un numéro de version

Un document n’annonce pas qu’il est devenu faux. Il reste là, plein d’assurance. La parade n’est pas la discipline — ce sont des métadonnées qui rendent l’âge visible, et une cadence qui agit dessus.

Placez un petit bloc d’en-tête au sommet de tout ce qui se périme à échéance régulière :

```markdown
---
title: Restoring the ledger from backup
owner: payments
last-checked: 2026-09-09
review: quarterly
---
```

Trois champs, chacun avec une seule mission. `owner` est une équipe, pas une personne, parce que les gens changent d’équipe et qu’un nom parti est pire que pas de nom du tout. `last-checked` est la date à laquelle quelqu’un a lu le document et confirmé qu’il tenait encore — pas la date du dernier commit, qui bouge quand vous corrigez une coquille et n’apprend rien au lecteur. `review` indique combien de temps la phrase mérite d’être crue.

**Pourquoi « dernière vérification » bat un numéro de version.** Un numéro de version indique au lecteur quelle version le document décrivait. Il ne lui dit pas si quelqu’un l’a relu depuis, et il vieillit de la manière la plus trompeuse possible : un document estampillé `v4.2` à côté d’un produit en `v4.9` paraît obsolète même si chaque mot tient encore, tandis qu’un document sans estampille paraît à jour pour l’éternité. Une date, elle, est sans ambiguïté. « Vérifié pour la dernière fois il y a 14 mois » est un fait sur lequel le lecteur peut agir sans rien savoir de votre rythme de publication, et c’est le même fait que vous livriez chaque semaine ou deux fois par an. Les convertisseurs et les générateurs de sites statiques traitent l’en-tête différemment — certains le suppriment, d’autres l’affichent en tête de page sous forme d’un paragraphe de lignes `clé : valeur` — il vaut donc la peine de savoir [ce que votre chaîne d’outils fait de cet en-tête](/blog/front-matter-and-what-converters-do-with-it) avant de compter sur son affichage.

**La cadence doit être assez modeste pour avoir lieu.** Une revue trimestrielle de quarante documents est une journée que personne n’a. Une revue trimestrielle des six documents qui réveillent quelqu’un la nuit est une heure, et ce sont ces six-là dont la fausseté coûte le plus cher. Triez par conséquence : les procédures d’intervention et les instructions d’installation d’abord, la référence ensuite, l’explication en dernier — l’explication vieillit lentement, parce que les raisons pour lesquelles un système a telle forme changent rarement sans un journal de décision pour le marquer.

**Des habitudes qui gardent tout cela honnête.**

- [ ] Les modifications de documentation voyagent dans la même pull request que le comportement qu’elles décrivent.
- [ ] Chaque document nomme un responsable ; `CODEOWNERS` le fait sans convoquer de réunion.
- [ ] Réécrivez le paragraphe faux au lieu d’accoler un correctif en dessous.
- [ ] Tout ce qui se périme à échéance régulière porte la date de sa dernière vérification.
- [ ] Les documents que personne n’entretiendra sont supprimés, pas étiquetés « peut-être obsolète ».

Le dernier point soulève le plus de discussions et compte le plus. Une page supprimée envoie le lecteur poser la question à une personne ; une page périmée l’envoie avec assurance vers le mauvais port. La solution intermédiaire — un bandeau « cette page est peut-être obsolète » — est la pire des trois, parce qu’elle transfère le risque à un lecteur qui n’a aucun moyen de l’évaluer, tout en laissant l’équipe croire que le problème a été traité.

**Un dernier travers à nommer.** Les instructions d’installation pourrissent plus vite que tout le reste et sont découvertes en dernier, parce que seuls les nouveaux arrivants les exécutent et qu’un nouvel arrivant suppose que la faute vient de lui. Il y passera deux heures avant d’oser demander. Le remède est bon marché et personne ne l’applique : la prochaine personne qui arrive corrige le README comme première pull request, tant que la douleur est fraîche et avant d’avoir appris les contournements qui rendent la fausseté invisible.

## Là où les docs as code échouent, et ce qui marche vraiment à la place

Voici la part que la promotion du concept passe sous silence. Les gens qui ont le plus besoin de la documentation interne sont souvent ceux qui ne peuvent pas l’atteindre.

Le responsable du support a besoin du chemin d’escalade au moment exact où un client hurle. Une nouvelle designer a besoin du guide d’arrivée avant que ses comptes n’existent. Un commercial a besoin de la réponse à « est-ce que ça fait du SSO » au milieu d’un appel. GitHub rend bien le Markdown, mais atteindre ce rendu coûte un compte, un accès au dépôt et un détour par le SSO, et une arborescence de fichiers demande à un non-informaticien de manœuvrer l’outil de documentation interne de quelqu’un d’autre. « Ouvre une pull request sur la doc » est une phrase qui met fin à la conversation. Elle est entendue comme *ceci n’est pas pour toi*, et elle est bien entendue, parce que celui qui la prononce vient de décrire un processus comportant une branche, un fork, une relecture et une file de fusion à quelqu’un dont le métier est de répondre à des tickets.

La recherche est la deuxième lacune, et elle est pire qu’il n’y paraît. La recherche d’entreprise indexe le wiki, le disque partagé et l’outil de tickets. La recherche de code, elle, couvre bien les dépôts d’une organisation, mais elle classe du code, et elle demande au lecteur de deviner quel dépôt contient la réponse — une devinette qu’un ingénieur réussit et que personne d’autre ne réussit. Le résultat est un ensemble documentaire complet, exact, et invisible pour la plus grande partie de l’entreprise.

La troisième lacune est la charge de relecture. La correction d’une coquille devient une branche, une pull request et une attente. Les ingénieurs le remarquent à peine ; quelqu’un qui écrit deux fois par an renonce, et son savoir reste dans sa tête. C’est une perte réelle, et pas une petite — l’ingénieur support qui a répondu quarante fois à la même question sait quelque chose qu’aucun ingénieur ne sait, et le chemin de contribution que vous avez bâti garantit qu’il ne l’écrira jamais.

**Ce qui marche vraiment.** Trois choses, par ordre de rendement.

Premièrement, répartissez selon ce qui peut démentir un document, et non selon qui l’a écrit.

| Document | Où il a sa place | Ce qui le rend faux |
| --- | --- | --- |
| Installation, configuration, comportement de l’API, déploiement | Le dépôt | Un commit |
| Les procédures d’intervention | Le dépôt, publiées sous forme de page | Un renommage dans le code qu’elles appellent |
| Chemins d’escalade, arrivée d’un nouveau, « comment demander X » | Le wiki, ou là où le support vit déjà | Un changement de processus, pas un commit |
| Politique RH, comptes rendus de réunion, registres de décisions | Le wiki | Une décision, pas un commit |

Déplacer ce dernier groupe dans git n’achète que de la friction. En sortir le premier groupe achète de la dérive.

Deuxièmement, publiez les pages rendues, pour que la source de vérité et la surface de lecture soient deux choses distinctes. Le lecteur reçoit une URL ; le dépôt garde le fichier. Personne en dehors de l’équipe n’apprend jamais ce qu’est une branche.

Troisièmement, ajustez le chemin de contribution au contributeur. Un ingénieur envoie une pull request. Un ingénieur support envoie un message au canal nommé dans `CODEOWNERS`, ou ouvre un ticket à partir d’un modèle, et quelqu’un déjà présent dans le dépôt rédige le paragraphe. Ce que vous voulez, c’est le savoir, pas le commit git — exiger le second est la façon de perdre le premier.

**Publier, concrètement.** La source de vérité n’a pas à être la surface de lecture. Rendez le Markdown et donnez aux gens une page. Cela peut être aussi modeste que de déposer le fichier sur TransformPipe et d’envoyer le HTML autonome obtenu, ou [de publier un lien en lecture seule](/blog/share-a-markdown-document-as-a-link) : « toute personne disposant du lien » pour une procédure publique, « seulement ces adresses » pour tout ce qui est interne. Révoquer supprime le jeton, si bien qu’un lien déjà envoyé cesse de fonctionner. Cela monte en charge jusqu’à [une GitHub Action qui publie le Markdown modifié par une pull request](/blog/publish-markdown-from-github-actions), ou une étape `tp push` [dans le script de publication](/blog/markdown-to-html-from-the-command-line).

Un fichier autonome compte ici bien plus qu’il n’y paraît. Une page qui va chercher sa feuille de style sur un CDN cesse de s’afficher correctement dès que quelqu’un l’ouvre en avion, et elle en apprend à celui qui l’ouvre un peu trop sur les endroits par où le fichier est passé. Un seul fichier avec ses styles à l’intérieur s’ouvre partout de la même façon, y compris depuis une pièce jointe sur un portable sans connexion, ce qui est précisément la situation qu’une procédure d’escalade a le plus de chances de rencontrer.

Sachez reconnaître quand c’est la mauvaise forme. Une page par document convient à un document qui a un destinataire : une procédure d’intervention, un journal de décision, des notes de version, un README destiné à un client. Un ensemble qui a franchi le seuil de navigation décrit plus haut veut un générateur, et la page devient alors un complément plutôt qu’un remplacement.

## Comment décider de ce qui vit où

1. **Demandez-vous ce qui rendrait le document faux.** Si la réponse est un commit, sa place est dans le dépôt, parce que c’est le seul endroit où la modification et la phrase se rencontrent. Si la réponse est une décision ou une conversation, git vous vend de la friction et vous coûte votre public.
2. **Nommez lequel des quatre types il est avant d’écrire une ligne.** Un document que vous ne savez pas classer est deux documents, et le livrer comme un seul garantit qu’aucun de ses deux lecteurs ne le trouvera.
3. **Donnez à chaque document un responsable et une date.** Un document sans responsable est un document dont on n’interroge personne, et un document sans date est un document que personne ne peut juger ; les deux survivent indéfiniment à la relecture, faute de quoi que ce soit de concret à leur opposer.
4. **Mettez la relecture là où se produit le changement.** De la documentation dans la même pull request que le comportement coûte un commentaire ; de la documentation dans un ticket de suivi coûte un sprint et n’arrive généralement jamais.
5. **N’automatisez que ce qu’un lecteur remarquerait.** Un lien mort et un nom de produit mal écrit méritent de faire échouer un build. La longueur des lignes, non, et un build qui échoue là-dessus apprend aux gens à désactiver la vérification qui attrape aussi le lien mort.
6. **Choisissez un générateur d’après ce qui casse sans lui.** Si personne n’est perdu sans navigation ni recherche, un convertisseur et un lien font moins d’entretien qu’un build ; si les lecteurs ne trouvent pas le deuxième document, il vous fallait un générateur il y a deux mois.
7. **Donnez aux non-informaticiens une surface de lecture et un chemin de contribution qui ne soit pas git.** Sinon la documentation est exacte, à jour, et lue par les huit personnes qui l’ont écrite.

## Conclusion

Le wiki dérive parce qu’il n’est pas là où se produit le changement ; le dépôt tient parce qu’il y est. C’est tout l’argument, et il ne survit au contact du réel que si les gens incapables d’utiliser git obtiennent quand même une page qu’ils peuvent ouvrir. Prenez le document le plus faux aujourd’hui — d’ordinaire les instructions d’installation — corrigez-le dans une branche, relisez-le comme du code, puis envoyez à celui qui en avait besoin la semaine dernière un lien plutôt qu’un chemin de dépôt. [Convertir le Markdown en un fichier HTML autonome](/) prend à peu près le temps qu’il faut pour le mettre en pièce jointe, se passe dans votre navigateur sans rien téléverser, et la liste complète des options se trouve dans [la documentation](/docs).

## FAQ

### Qu’est-ce que Diátaxis, et faut-il tout adopter ?

Diátaxis est un cadre documentaire dû à Daniele Procida qui range la documentation en tutoriels, guides pratiques, référence et explication selon le besoin du lecteur (vérifié sur diataxis.fr, le 9 septembre 2026). Vous n’êtes obligé d’adopter ni la structure de répertoires ni le vocabulaire. La partie utile est le test : nommez lequel des quatre est un document avant de l’écrire, et coupez-le en deux si vous n’y arrivez pas.

### La documentation doit-elle vivre dans le même dépôt que le code qu’elle décrit ?

Pour tout ce qu’un commit peut rendre faux, oui — c’est tout le mécanisme, et un dépôt de documentation séparé réintroduit l’écart que vous cherchiez à fermer. Pour une documentation qui couvre de nombreux services, un dépôt séparé se défend, mais attendez-vous à la même dérive que sur le wiki, puisque la modification et la phrase se retrouvent une fois de plus dans des pull requests différentes.

### Quelle différence entre un ADR et un document de conception ?

Un document de conception décrit un système envisagé et devient faux quand le plan change. Un journal de décision d’architecture consigne une décision, son contexte et ses conséquences à une date donnée, et reste vrai pour toujours parce que c’est un énoncé sur un moment (vérifié sur adr.github.io, le 9 septembre 2026). On remplace un journal par un nouveau au lieu de le modifier.

### Faut-il un générateur de site statique pour de la documentation interne ?

Pas avant que les lecteurs n’aient besoin de passer d’un document à l’autre sans connaître les noms de fichiers. En dessous de ce seuil, des fichiers Markdown et un convertisseur demandent moins d’entretien et ne cassent jamais le build. Au-dessus, choisissez dans le tableau ci-dessus selon ce que votre équipe fait déjà tourner — les équipes Python vont vers MkDocs, les équipes Node vers Docusaurus, et qui veut un seul binaire vers Hugo ou mdBook.

### Comment empêcher la documentation de se périmer sans rédacteur à plein temps ?

Rendez l’âge visible et gardez la revue petite. Une date `last-checked` dans l’en-tête dit au lecteur ce qu’un numéro de version ne peut pas dire, et un passage trimestriel sur les seuls documents dont la fausseté réveille quelqu’un la nuit prend une heure et non une journée. Supprimez ce que personne n’entretiendra au lieu de le signaler comme douteux.

### Comment les non-informaticiens lisent-ils une documentation gardée dans un dépôt ?

Donnez-leur une page rendue, pas un chemin de dépôt. Publier le Markdown sous forme de fichier HTML autonome ou de lien en lecture seule leur donne une URL qui s’ouvre partout, sans compte, sans accès au dépôt et sans rien à installer — et pour les contributions, faites-les passer par le canal nommé dans `CODEOWNERS` plutôt que par une pull request.

### Quels linters méritent leur place dans l’intégration continue ?

Trois, et seulement sur des règles qu’un lecteur remarquerait : markdownlint pour la structure, Vale pour la terminologie, et un vérificateur de liens tel que lychee pour les chemins morts (vérifié sur github.com/DavidAnson/markdownlint, vale.sh et github.com/lycheeverse/lychee, le 9 septembre 2026). Lancez la vérification des liens internes à chaque pull request et celle des liens externes selon un calendrier, parce qu’une URL externe qui tombe un mardi n’a rien à voir avec votre modification.
