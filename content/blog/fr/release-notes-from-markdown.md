---
title: "Des notes de version que les gens lisent vraiment"
description: "Écrire des notes de version, pas un journal de commits : les six types de Keep a Changelog, un changement cassant, ce que les générateurs ne peuvent pas écrire"
updated: 2026-09-09
date: 2026-08-14
tag: Workflow
keywords: notes de version markdown, changelog markdown, keep a changelog, format changelog, modèle notes de version, versionnage sémantique changement cassant, conventional commits changelog, générateur de changelog
---

La plupart des changelogs sont un journal de commits auquel on a retiré les hachages. « Refonte du gestionnaire de jetons. » « Montée de version d'une dépendance. » « Correction d'un cas limite dans le parseur. » Chaque ligne est vraie, et aucune n'aide la personne qui décide si elle met à jour cette semaine. Les notes de version sont un document différent, avec un rôle différent : elles disent ce qui a changé pour le lecteur, ce qui casse, et quoi faire.

### En bref

Keep a Changelog vous donne six types de changement — Added, Changed, Deprecated, Removed, Fixed, Security — et un intitulé `Unreleased` qui ancre l'habitude, parce qu'il existe toujours un endroit où mettre la ligne pendant que le changement est encore frais (vérifié sur keepachangelog.com, le 9 septembre 2026). Le versionnage sémantique dit au lecteur quelle attention accorder, mais seulement si le projet a écrit ce que signifie pour lui un changement cassant. Les générateurs — les notes de version propres à GitHub, release-please, semantic-release, git-cliff, changesets, auto-changelog — assembleront la liste à partir des commits ou de fichiers de changeset, et aucun d'eux ne peut écrire les deux phrases qui disent pourquoi cette version existe et qui peut se permettre de la sauter. Gardez le fichier dans le dépôt, en Markdown, écrivez la partie humaine à la main, et convertissez-le quand quelqu'un en dehors du dépôt a besoin d'un lien.

Le frottement n'est pas que les changelogs sont difficiles à écrire. C'est que personne n'a décidé pour qui ils sont faits. Un fichier qui doit servir le mainteneur en train de bisecter une régression, le client qui décide de mettre à jour un week-end, et l'intégrateur dont le parseur est sur le point de casser, ne servira aucun des trois, parce que ces trois lecteurs veulent des choses différentes des mêmes douze lignes.

Le second frottement, c'est le moment de l'écriture. Des notes de version écrites le soir de la sortie sont reconstruites à partir de `git log`, et c'est dans cette reconstruction que les raisons se perdent : la personne qui écrit la ligne voit qu'une valeur par défaut a changé et ne se rappelle plus quel ticket de support l'a rendue nécessaire. À ce stade, la seule chose qui reste bon marché est une liste, alors c'est une liste qui sort.

## Ce qui va dans les notes de version, et ce qui va dans le journal de commits

Le journal de commits enregistre comment le code en est arrivé là, pour celui qui devra bisecter une régression dans dix-huit mois. Les notes de version sont pour quelqu'un qui n'a jamais vu le code et qui a dix secondes.

| Le changement | Journal de commits | Notes de version |
| --- | --- | --- |
| Logique de nouvelle tentative réécrite | `refactor(http): replace retry loop with backoff` | Les requêtes échouées sont retentées trois fois, avec un délai croissant. Rien à configurer. |
| Clé de configuration renommée | `feat: rename apiKey to api_key` | `apiKey` s'appelle désormais `api_key`. L'ancien nom fonctionne toujours et affiche un avertissement. |
| Parseur de tableau corrigé | `fix: off-by-one in table row parser` | Les tableaux à une seule colonne ne perdent plus leur dernière ligne. |

Trois tests pour une ligne candidate : le comportement du lecteur change, il aurait pu rencontrer le bug, ou il remarquerait la différence sans qu'on le lui dise. Une ligne qui échoue aux trois reste dans le journal de commits. Les refontes internes et les montées de dépendances qui ne changent rien d'observable y restent aussi.

Keep a Changelog tient le même raisonnement dans l'autre sens, et met en garde contre l'usage d'un diff de journal de commits comme changelog : c'est plein de commits de fusion, de titres obscurs et de changements de documentation qui enterrent ce que le lecteur était venu chercher (vérifié sur keepachangelog.com, le 9 septembre 2026). Ce n'est pas une critique de l'hygiène des commits. Un message de commit bien écrit reste écrit pour un relecteur qui a le diff ouvert à côté, et le lecteur des notes de version n'a ni diff, ni l'intention d'en chercher un.

Il y a un troisième document qui mérite d'être séparé, car c'est celui que l'on glisse le plus souvent dans un changelog en douce : le guide de migration. Une entrée de changelog, c'est une ligne et un lien. Un guide de migration, c'est une page avec des exemples de code, un ordre des opérations, et le passage sur la vidange préalable de la file. Les mélanger fait que la personne qui survole pour repérer les ruptures doit lire le tutoriel, et que celle qui fait la migration doit retrouver le tutoriel au milieu d'une liste.

## Les six types de changement, et ce qui va sous chacun

Keep a Changelog 1.1.0 définit six types, et la raison de partir de là plutôt que d'en inventer n'est pas esthétique : les catégories sont des conséquences, un lecteur qui se soucie de l'une d'elles peut donc lire un seul titre et repartir. La spécification est sous licence MIT, et ses principes directeurs sont brefs — les changelogs sont pour des humains, chaque version obtient une entrée, les changements sont groupés par type, versions et sections sont liables, du plus récent au plus ancien, les dates de sortie sont affichées, et le versionnage sémantique est suivi (vérifié sur keepachangelog.com, le 9 septembre 2026).

| Type | Ce qui va dessous | Ce qui n'y va pas | Ce que le lecteur en fait |
| --- | --- | --- | --- |
| Added | Nouveaux points d'accès, réglages, commandes, écrans, formats acceptés, permissions | Une nouvelle classe interne ; un nouveau test ; une nouvelle étape de build | Le lit s'il l'attendait, le saute sinon |
| Changed | Valeurs par défaut, limites, délais, ordre de tri, formulation, forme de sortie, codes d'erreur | Une réécriture au comportement observable identique | Vérifie si une de ses hypothèses tient toujours |
| Deprecated | Tout ce qui fonctionne encore et a une fin annoncée | Quelque chose que vous n'aimez pas mais que vous ne prévoyez pas de retirer | Planifie du travail avant la date donnée |
| Removed | Points d'accès, options, clés de configuration, formats, prise en charge de plateformes et de runtimes | Du code interne mort que personne ne pouvait appeler | S'arrête, lit la ligne de migration, planifie la mise à jour |
| Fixed | Un comportement erroné que le lecteur a pu plausiblement rencontrer | Un bug introduit et corrigé dans la même version | Cherche s'il a été touché, et depuis quand |
| Security | Vulnérabilités corrigées, avec la gravité et ce qui était exposé | Un durcissement auquel personne n'était exposé — cela va dans Changed | Corrige tout de suite, ou explique à quelqu'un pourquoi pas |

### Added

Une nouvelle capacité, décrite comme une chose que le lecteur peut désormais faire plutôt que comme une chose que vous avez construite. « Les exports peuvent être filtrés par plage de dates » est une entrée ; « ajout de la prise en charge du filtre par plage de dates au service d'export » est un compte rendu de statut. Added est la section que les gens survolent en dernier et la plus facile à surcharger, parce que chaque ticket fermé donne l'impression d'un ajout. Si personne en dehors de l'équipe ne peut y accéder, ce n'est pas encore un ajout.

### Changed

La section la moins utilisée et la plus coûteuse. Changed, c'est là où les valeurs par défaut se déplacent, où les limites se resserrent, où les délais se raccourcissent, où les codes d'erreur deviennent plus précis et où l'ordre de tri s'inverse — rien de tout cela n'est une correction de bug, et tout cela peut casser quelqu'un qui a écrit du code contre l'ancien comportement. Chaque ligne de Changed devrait porter l'ancienne valeur et la nouvelle, car « limitation de débit améliorée » ne dit au lecteur rien sur quoi agir, tandis que « le seuil de rafale est de 60 requêtes, contre 120 auparavant » lui dit exactement s'il doit s'en soucier.

### Deprecated

Une dépréciation sans date n'est pas une dépréciation, c'est une opinion. L'entrée a besoin de trois choses : ce qui est déprécié, quoi utiliser à la place, et quand cela cessera de fonctionner — une version, une date, ou les deux. Deprecated est aussi la seule section qui décrit quelque chose qui ne s'est pas encore produit, ce qui explique pourquoi c'est celle que les lecteurs sautent, et celle qui leur coûte le plus quand ils le font.

### Removed

La section qui décide si une mise à jour est sûre, elle doit donc se trouver près du début de l'entrée, quel que soit l'ordre suggéré par la spécification. Chaque ligne a besoin du remplacement et de la forme du travail : pas seulement que `/v1/export` a disparu, mais que `/v2/exports` renvoie le même corps, avec `id` désormais en chaîne de caractères. Une ligne Removed sans remplacement est acceptable quand il n'y en a vraiment aucun, et il faut alors le dire clairement plutôt que de laisser le lecteur en chercher un.

### Fixed

Fixed est lu par des gens qui cherchent à savoir si un problème qu'ils ont eu était celui-là. Cela rend la condition affectée plus utile que le mécanisme : « les envois de plus de 2 Go échouaient silencieusement sur des connexions à moins de 1 Mbit/s » permet à un lecteur de reconnaître son propre symptôme, alors que « correction d'une situation de compétition dans le gestionnaire d'envoi par blocs » ne le permet pas. Si une correction change un comportement sur lequel certains s'étaient mis à compter, elle appartient aussi à Changed, ou à Changed à la place.

### Security

Indiquez la gravité, ce qu'un attaquant pouvait faire, et si l'exploitation demandait une authentification. Si vous utilisez des identifiants CVE ou une échelle de gravité, utilisez-les de façon cohérente, car un lecteur qui décide de patcher en dehors des heures ouvrées fait un calcul de risque et a besoin de ces données. Les entrées Security sont aussi celles que lit le plus souvent quelqu'un qui n'est pas client — un auditeur, un questionnaire d'achat, une équipe de sécurité —, elles survivent donc à la version de plusieurs années.

### La section Unreleased comme habitude de travail

Keep a Changelog place un intitulé `Unreleased` en haut, pour que les lecteurs voient ce qui arrive et pour que sortir une version devienne une affaire de déplacer du contenu plutôt que de l'écrire (vérifié sur keepachangelog.com, le 9 septembre 2026). L'habitude compte plus que l'intitulé. Quand `Unreleased` existe, la pull request qui change une valeur par défaut peut ajouter la ligne qui la décrit, relue par la même personne qui relit le changement, au moment où tous deux se souviennent encore pourquoi.

Cela transforme une question difficile — qu'est-ce qui a changé ces six dernières semaines — en cinquante questions faciles. Cela donne aussi quelque chose à repérer en relecture : une pull request qui change un comportement observable sans toucher à une ligne de changelog est une omission visible, la forme d'application la moins chère possible. Le coût, ce sont les conflits de fusion, puisque tout le monde modifie les mêmes lignes en haut du même fichier. Deux choses les réduisent : garder l'entrée la plus récente en haut de chaque sous-section pour que les ajouts atterrissent au même endroit, ou passer à un fichier par changement, ce qui est le problème que les changesets existent pour résoudre.

### Grouper par impact, pas par composant

Découper les notes en `auth-service`, `billing-worker` et `web` décrit comment le travail a été réparti, pas comment il arrive. Un lecteur qui se demande si cette version casse son intégration doit lire chaque section, et n'en lira aucune.

Keep a Changelog liste Added en premier, mais rien n'impose cet ordre. Removed et Changed répondent à la question avec laquelle arrivent la plupart des lecteurs, menez donc avec eux, puis Security, puis Fixed, puis Added. La spécification est une structure, pas une feuille de style.

Dans un monorepo où des équipes consomment les paquets des autres, le regroupement par composant est la meilleure réponse : chaque lecteur possède un service et ne veut que sa section. Deux documents règlent en général la question — un regroupement par composant pour ceux qui le construisent, un regroupement par impact pour ceux qui l'utilisent —, et le second se déduit assez souvent du premier pour que cela vaille la peine d'organiser la source ainsi.

### Un format de changelog à copier

La structure est du Markdown ordinaire, et c'est bien le but : cela diffe, cela se relit, et cela se convertit.

```markdown
## [Unreleased]

## [1.4.0] - 2026-08-14

### Removed
- The `/v1/export` endpoint. Use `/v2/exports`; the response is identical
  apart from `id`, now a string.

### Changed
- Session cookies last 30 days instead of 7. Existing sessions are unaffected.

### Fixed
- Uploads over 2 GB no longer fail silently on slow connections.

[Unreleased]: https://example.com/compare/v1.4.0...HEAD
[1.4.0]: https://example.com/compare/v1.3.0...v1.4.0
```

Les dates ISO 8601 se trient correctement et ne peuvent pas être mal lues d'une région à l'autre, c'est pourquoi la spécification les exige (vérifié sur keepachangelog.com, le 9 septembre 2026). Les références de liens en bas pointent chaque version vers son propre diff, et les garder en style référence plutôt qu'en URL en ligne garde les entrées lisibles dans le fichier brut — ce qui est là où la plupart des gens les liront.

Deux détails évitent des disputes plus tard. Utilisez `## [1.4.0]` plutôt qu'un titre de premier niveau par version, pour que le fichier ait un seul titre et que chaque version se trouve au même niveau ; un site de documentation qui rend le fichier produirait sinon une page avec plusieurs titres concurrents. Et gardez tout l'historique dans un seul fichier jusqu'à ce qu'il devienne réellement ingérable, moment auquel vous archivez par année plutôt que par version majeure, car les lecteurs cherchent des dates.

## Versions, changements cassants, et les commits en dessous

Un numéro de version est une promesse sur le soin de lecture requis. Semantic Versioning 2.0.0 le formule en une ligne chacun : MAJOR pour les changements d'API incompatibles, MINOR pour une fonctionnalité ajoutée de façon rétrocompatible, PATCH pour des corrections de bugs rétrocompatibles (vérifié sur semver.org, le 9 septembre 2026).

| Incrément | Ce qu'il promet au lecteur | Ce qu'il devrait faire |
| --- | --- | --- |
| PATCH | Rien dont il dépend n'a changé de forme | Mettre à jour, lire seulement Fixed et Security |
| MINOR | De nouvelles choses existent ; les anciennes se comportent comme avant | Mettre à jour, survoler Added pour ce qu'il attendait |
| MAJOR | Quelque chose dont il dépendait peut-être a disparu ou changé | Lire Removed et Changed en entier, planifier le travail |

La promesse ne tient que si le projet a dit ce qu'est sa surface publique. La spécification est explicite : un logiciel qui utilise le versionnage sémantique doit déclarer une API publique, dans le code ou dans la documentation, et cette déclaration devrait être précise et complète (vérifié sur semver.org, le 9 septembre 2026). La plupart des projets sautent cette étape, et alors chaque débat sur le caractère cassant ou non d'un changement devient un débat sur les intentions.

### Ce qui compte comme un changement cassant pour ce projet

C'est la seule question de version qu'un lecteur ait vraiment, et aucune spécification ne peut y répondre, parce que « incompatible » dépend de ce que vous avez promis. Écrivez la réponse une fois, dans le guide de contribution, et la conversation à chaque version devient courte. Une liste de départ raisonnable de ce qui compte :

- Retirer ou renommer quoi que ce soit d'appelable : un point d'accès, une option, une clé de configuration, une fonction exportée, un nom d'événement.
- Retirer un champ d'une réponse, ou changer son type. En ajouter un est en général sûr ; rendre obligatoire un champ optionnel ne l'est pas.
- Resserrer une validation, de sorte qu'une entrée auparavant acceptée soit désormais rejetée.
- Changer une valeur par défaut, quand l'ancienne faisait le travail pour des gens qui n'avaient jamais défini la valeur.
- Changer un code d'erreur, un code de sortie, ou la forme d'un corps d'erreur sur lequel les appelants font des branchements.
- Abandonner la prise en charge d'un runtime, d'un système d'exploitation ou d'une version de base de données.
- Changer l'ordre de sortie, quand rien ne promettait cet ordre mais que tout le monde s'y fiait.
- Corriger un bug d'une façon qui retire un comportement sur lequel des gens avaient bâti. C'est un point réellement contesté, et la gestion honnête consiste à le nommer à la fois dans Changed et dans Fixed, et à dire qui est concerné.

Puis les sujets qui déclenchent invariablement des disputes et qu'il vaut la peine de trancher à l'avance : le format des journaux, les noms de métriques, les noms de classes HTML, le schéma de base de données pour quiconque le requête directement, et tout ce qui est accessible par réflexion ou par une interface de plugin. Si ceux-là ne font pas partie de la surface publique, dites-le avant que quelqu'un ne s'y fie.

### La version zéro, et l'échappatoire des pré-versions

La version majeure zéro sert au développement initial : tout peut changer à tout moment, et l'API publique ne devrait pas être considérée comme stable (vérifié sur semver.org, le 9 septembre 2026). C'est une vraie licence de bouger, et elle expire au moment où quelqu'un met la chose en production. Si vous êtes en `0.x` et que le changelog a cessé de mentionner des changements cassants parce qu'ils sont permis, le numéro de version cache désormais de l'information au lecteur plutôt que de la lui donner.

Les identifiants de pré-version — la partie après un trait d'union — servent à livrer à des gens qui ont accepté le risque, et les métadonnées de build après un signe plus sont totalement ignorées lors de la comparaison des versions (vérifié sur semver.org, le 9 septembre 2026). Ni l'un ni l'autre ne remplace une entrée de changelog. Quelqu'un qui met à jour vers `2.0.0-rc.1` a toujours besoin de la liste, et sans doute plus que quiconque.

### Conventional Commits comme entrée du système

Si un générateur doit écrire la liste, quelque chose doit lui dire quels commits comptent. Conventional Commits 1.0.0 est la réponse habituelle : un message de la forme `<type>[scope optionnel]: <description>`, avec un corps et des pieds optionnels. Elle nomme `feat` et `fix` et en autorise d'autres, en suggérant `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` et `test`. Les changements cassants sont signalés soit par un pied `BREAKING CHANGE:`, soit par un `!` avant les deux-points, et la correspondance vers les versions est directe : `fix` est un PATCH, `feat` est un MINOR, et un changement cassant de n'importe quel type est un MAJOR (vérifié sur conventionalcommits.org, le 9 septembre 2026).

Cela vaut la peine d'être adopté, et il vaut la peine d'être honnête sur ce que cela apporte. Cela rend la génération possible : un outil peut trier les commits en sections et calculer la prochaine version sans personne dans la boucle. Cela ne rend pas les notes bonnes. La convention contraint le préfixe, pas la phrase qui suit, et `feat(export): add dateFrom param to POST /exports` est à la fois un commit conventionnel correct et une piètre ligne de changelog.

### Ce que la convention ne règle pas

Quatre lacunes, qui apparaissent toutes dans la sortie générée :

- **Le public de la phrase.** Une description de commit est écrite pour quiconque lit le diff. Rien dans la convention ne demande à l'auteur d'écrire pour un client, alors personne ne le fait.
- **Un changement, plusieurs commits.** Un changement visible pour l'utilisateur arrive souvent en quatre commits sur deux semaines. Un générateur produit quatre lignes ; le lecteur en voulait une.
- **La gravité et l'urgence.** Il n'existe pas de type `security:` dans la spécification, ni de moyen de dire « critique, à corriger ce soir » dans un préfixe. Ce jugement est ajouté par une personne après coup, ou pas du tout.
- **Les titres de fusion en squash.** Sur un dépôt qui fusionne en squash, le titre de la pull request devient le message de commit et donc la ligne de changelog. C'est soit un argument pour relire les titres de pull request comme du texte publié, soit un argument pour ne pas générer les notes à partir d'eux.

## Les générateurs de changelog, comparés

Tous sont gratuits. La différence intéressante est ce que chacun lit, car cela fixe ce qu'il peut savoir au mieux.

| Outil | Lit | Produit | Ne peut pas savoir | Licence |
| --- | --- | --- | --- | --- |
| Notes de version automatiques de GitHub | Les pull requests fusionnées, leurs labels, et les contributeurs | Un corps de release sur la release GitHub, catégorisé par label | Tout ce qui est absent d'un titre ou d'un label de pull request ; si un changement vous casse | Fait partie de GitHub |
| release-please | L'historique git, à la recherche de messages Conventional Commit | Une pull request de release, un changelog mis à jour, des montées de version dans des fichiers de langue, des tags et des releases GitHub | Tout ce qui n'est pas dans un message de commit ; ne publie pas vers des registres | Apache 2.0 |
| semantic-release | Les messages de commit (conventions Angular par défaut) et les tags git | La prochaine version, les notes de version, un tag git, une publication de registre et une release GitHub | Tout ce qui n'est pas dans un message de commit ; n'écrit aucun fichier de changelog sauf ajout du plugin | MIT |
| git-cliff | L'historique git, via Conventional Commits ou vos propres analyseurs regex | Un fichier de changelog dans la forme que dicte le gabarit | Tout ce qui n'est pas dans un message de commit | Apache 2.0 ou MIT |
| changesets | Des fichiers de changeset Markdown qu'un contributeur écrit à la main | Des montées de version, des changelogs et une publication à travers un monorepo | Tout ce pour quoi personne n'a écrit de changeset | MIT |
| auto-changelog | Les tags git, l'historique des commits, les commits de fusion et les mots-clés de fermeture d'issue | Un fichier de changelog en forme compacte, Keep a Changelog ou JSON | Tout ce qui n'est ni dans un commit, ni dans une fusion, ni dans une issue liée | MIT |

### Les notes de version générées automatiquement par GitHub

Intégrées à la page de release de GitHub comme alternative automatisée à l'écriture manuelle du corps : elle produit un aperçu des pull requests fusionnées, une liste de contributeurs et un lien de changelog. Un fichier `.github/release.yml` la pilote — vous déclarez des catégories et les labels de pull request qui tombent dans chacune, et vous pouvez exclure des pull requests par label ou par auteur, globalement ou par catégorie (vérifié sur docs.github.com, le 9 septembre 2026).

**Ce qu'elle ne peut pas savoir :** tout ce qui n'est ni dans un titre ni dans un label. Cela la rend exactement aussi bonne que vos titres de pull request, et elle n'a aucune notion de changement cassant à moins que vous ne créiez un label pour cela et pensiez à l'appliquer. **Utilisez-la quand** le public est déjà composé de développeurs qui lisent le dépôt, et que l'alternative serait pas de notes du tout.

### release-please

Analyse l'historique git à la recherche de messages Conventional Commit et ouvre une pull request de release qu'il maintient à jour au fil des fusions ; à la fusion, il met à jour le changelog, monte les versions dans des fichiers spécifiques à chaque langage, tague, et crée la release GitHub. Il ne publie pas vers des gestionnaires de paquets et ne gère pas de stratégie de branches complexe, et il existe une action recommandée, `googleapis/release-please-action`. Sous licence Apache 2.0 (vérifié sur github.com/googleapis/release-please, le 9 septembre 2026).

**Ce qu'il ne peut pas savoir :** tout ce qui est absent des messages de commit. **Utilisez-le quand** vous voulez que le changelog soit relu avant d'être livré. La pull request de release est la surface de relecture, et c'est le seul outil ici qui invite une personne à modifier le texte généré avant que quiconque ne le lise — exactement la propriété qui convient à une équipe qui se soucie de la prose.

### semantic-release

Détermine le prochain numéro de version, génère les notes de version et publie le paquet, piloté par des messages de commit sous une convention formalisée (Angular par défaut) et par des tags git pour retrouver la dernière release. Il se configure via des plugins, et les quatre activés par défaut sont `commit-analyzer`, `release-notes-generator`, `npm` et `github` ; écrire un `CHANGELOG.md` dans le dépôt demande `@semantic-release/changelog`, qui n'en fait pas partie. Sous licence MIT (vérifié sur github.com/semantic-release/semantic-release et semantic-release.gitbook.io, le 9 septembre 2026).

**Ce qu'il ne peut pas savoir :** tout ce qui est absent des messages de commit — et par conception, il n'y a aucune étape humaine, rien n'est donc édité en chemin. **Utilisez-le quand** la release devrait être une conséquence de la fusion et que personne ne devrait avoir à décider quoi que ce soit. C'est un vrai bénéfice, et c'est aussi le compromis : des releases entièrement automatisées et des notes écrites à la main tirent en sens opposés, et la plupart des équipes règlent cela en publiant les notes générées pour les développeurs et en écrivant une page humaine séparée pour tous les autres.

### git-cliff

Un générateur de changelog écrit en Rust qui suit Conventional Commits et ajoute des analyseurs regex personnalisés pour les historiques qui ne le font pas. La configuration vit dans `cliff.toml`, où vous définissez des analyseurs de commit et des groupes, et la forme de sortie est un gabarit : il utilise Tera, dont la syntaxe s'inspire de Jinja2 et de Django. Disponible via crates.io, npm, PyPI et Docker, et à double licence Apache 2.0 ou MIT (vérifié sur github.com/orhun/git-cliff et git-cliff.org, le 9 septembre 2026).

**Ce qu'il ne peut pas savoir :** tout ce qui est absent des messages de commit. **Utilisez-le quand** vous avez un historique existant qui ne suit aucune convention, ou quand la sortie doit correspondre à un format que quelqu'un d'autre a spécifié — les analyseurs regex et le gabarit ensemble atteignent presque n'importe quelle forme, ce qu'aucun des autres ne promet vraiment.

### changesets

L'exception, et la raison de s'y intéresser. Plutôt que de lire les commits, il lit des fichiers Markdown que les contributeurs écrivent délibérément : un changeset déclare quels paquets ont changé, de combien monter chacun, et quoi en dire. À partir de là, il monte les versions, écrit les changelogs et publie, avec les monorepos et les paquets interdépendants comme cible explicite. Sous licence MIT (vérifié sur github.com/changesets/changesets, le 9 septembre 2026).

**Ce qu'il ne peut pas savoir :** tout ce pour quoi personne n'a écrit de changeset. **Utilisez-le quand** les notes comptent plus que l'automatisation. Demander à l'auteur d'écrire la phrase au moment même où il fait le changement, c'est toute l'idée, et cela évite à la fois les conflits de fusion d'un bloc `Unreleased` partagé et le problème de public des messages de commit. Le coût est une étape que les gens oublient, c'est pourquoi les équipes qui l'adoptent ajoutent en général une vérification qui fait échouer une pull request sans changeset.

### auto-changelog

Un outil en ligne de commande qui génère un changelog à partir des tags git et de l'historique des commits, y compris les commits de fusion et les issues fermées par mot-clé, avec une sortie compacte, Keep a Changelog ou JSON. Il n'exige aucune convention de commit, se gabarise avec Handlebars, prend en charge GitHub, GitLab, BitBucket et Azure DevOps, et marquera les changements cassants si vous lui donnez un `--breaking-pattern` correspondant à la façon dont vos messages les signalent. Sous licence MIT (vérifié sur github.com/cookpete/auto-changelog, le 9 septembre 2026).

**Ce qu'il ne peut pas savoir :** tout ce qui n'est ni dans un commit, ni dans une fusion, ni dans une issue liée. **Utilisez-le quand** vous avez hérité d'un dépôt avec des années d'historique désordonné et que vous voulez quelque chose de correct dès aujourd'hui, sans réécrire les commits de personne ni adopter une convention au préalable.

## Ce qu'un changelog généré laisse de côté

La génération est la réponse évidente, et pour la liste des changements, c'est la bonne. Là où elle échoue, c'est tout ce qui n'est pas une liste, et les échecs sont assez cohérents pour être nommés.

**La raison pour laquelle la version existe.** Douze entrées ne disent pas à un lecteur que c'est la version qui corrige les délais d'export dont tout le monde se plaignait. Deux phrases en haut de l'entrée le font. Aucun outil ne peut les écrire, parce que la raison vit dans des tickets de support et des conversations plutôt que dans des commits.

**Qui devrait la sauter.** « Si vous n'utilisez pas l'intégration SAML, il n'y a rien ici pour vous » économise plus de temps de lecteur que n'importe quelle autre phrase d'un changelog, et c'est la phrase qu'un générateur ne produira jamais, car la produire suppose de savoir ce qu'un lecteur pourrait ne pas utiliser.

**La gravité, dans les deux sens.** La sortie générée aplatit tout en une ligne par commit. Un correctif de sécurité et une correction de bulle d'aide se ressemblent, et le lecteur doit deviner lequel est lequel d'après la formulation. Marquer les deux entrées qui comptent est un travail de personne.

**Les problèmes connus.** Le bug avec lequel vous avez livré délibérément, parce que l'alternative était de retarder la version. Il n'apparaît dans aucun commit, parce qu'il n'a pas été corrigé. Le laisser de côté fait que la première personne qui le rencontre ouvre un ticket, puis la deuxième, puis la onzième.

**L'excuse, là où elle est due.** Si la dernière version a cassé quelque chose en production pour des clients, les notes de la version suivante sont l'endroit où le reconnaître. Le silence se lit comme si on ne l'avait pas remarqué.

**Ce que cela coûte.** Budgétez la partie humaine à moins d'une heure par version pour une personne nommée, plus la relecture de la ligne de changelog dans chaque pull request, qui est un coup d'œil plutôt qu'une tâche. C'est toute la facture, et c'est pourquoi l'argument pour l'automatisation complète gagne en général par défaut plutôt que sur le fond. Le coût de ne pas la payer est diffus et plus difficile à voir : des tickets de support qui sont en réalité des questions de changelog, des clients bloqués trois versions en arrière parce que personne n'a pu leur dire si la mise à jour était sûre, et des intégrateurs qui apprennent la disparition d'un champ par une erreur plutôt que par vous.

L'arrangement qui fonctionne, c'est les deux à la fois. Laissez un générateur assembler la liste à partir des commits ou des changesets, puis qu'une personne ajoute le résumé, marque les gravités, ajoute les problèmes connus et vérifie que chaque ligne Removed a un endroit où envoyer le lecteur. Premier jet généré, dernière passe humaine. Aucune des deux moitiés n'est optionnelle, et c'est la seconde qu'on abandonne.

## Qui lit une version, et ce qu'il faut à chacun

Une page de release sert plusieurs personnes qui arrivent avec des questions différentes. Les nommer rend les omissions évidentes, car la plupart des changelogs répondent à la première question et ignorent les deux autres.

| Lecteur | Arrive en demandant | A besoin sur la page | Repart sans cela |
| --- | --- | --- | --- |
| Celui qui met à jour | Dois-je le faire maintenant ? | Si quelque chose casse, l'ampleur du changement, et une raison de s'en donner la peine | Reste sur l'ancienne version indéfiniment |
| L'intégrateur | Mon code va-t-il continuer à fonctionner ? | Chaque suppression et changement de comportement, nommés exactement comme son code les nomme | L'apprend par un 4xx en production |
| L'exploitant | Que se passe-t-il quand je le déploie ? | Migrations, redémarrages, changements de configuration, déplacements de ressources, retour arrière | Rencontre la migration de schéma pendant le déploiement |

### Celui qui met à jour

Quelqu'un sur la version 1.2 qui décide de passer un après-midi sur la 1.4. Ce dont il a besoin en premier, c'est d'un oui ou d'un non sur la casse, puis d'une phrase disant pourquoi la version existe. S'il saute des versions, il a besoin des entrées pour tout l'intervalle, ce qui est un argument pour un seul fichier avec tout l'historique plutôt qu'une page par version. Des notes qui commencent par les nouvelles fonctionnalités répondent à la question que ce lecteur pose en second.

### L'intégrateur

Quelqu'un dont le code appelle le vôtre. Il se moque du sujet de la version ; ce qui l'intéresse, c'est si l'un des six ou sept noms dont il dépend apparaît dans Removed ou Changed. Ce lecteur est la raison pour laquelle les entrées doivent utiliser l'identifiant exact — `api_key`, `POST /v2/exports`, `EXPORT_TIMEOUT_MS` —, car il cherchera dans la page la chaîne que son propre code contient. Une prose qui dit « le réglage de configuration de l'export » n'est pas cherchable, et donc inutile pour lui.

### L'exploitant

Quelqu'un qui le déploie. Ses questions concernent à peine le logiciel : cela demande-t-il une migration, un redémarrage, cela change-t-il l'usage de la mémoire ou des connexions, peut-on revenir en arrière après que la migration a tourné, et l'ancienne version continue-t-elle de fonctionner pendant que les deux sont en vie. Presque aucun changelog n'y répond, et c'est cette omission qui transforme une mise à jour de routine en incident. Un court bloc « Déployer cette version » en haut de toute entrée qui en a besoin suffit.

## Écrire l'entrée, pas le titre du ticket

Un modèle de notes de version n'aide que si les lignes dedans sont écrites pour un lecteur :

- Menez avec le nom qu'il connaît — le point d'accès, le réglage, l'élément de menu — pas avec le module qui le contient.
- Dites ce qui est vrai maintenant. « Les exports tournent en arrière-plan » vaut mieux que « Modification des exports pour qu'ils tournent en arrière-plan ».
- Nommez les choses exactement comme elles apparaissent dans le produit : `api_key`, pas « le réglage de la clé API ».
- Donnez à chaque ligne cassante une action et une échéance. « Passez à `/v2/exports` avant la 3.0 » est une note. « Point d'accès déprécié » est un haussement d'épaules.
- Une ligne par changement. Si cela demande trois phrases, faites un lien vers une page qui a la place.

Les chiffres réels ont leur place ici — tailles, délais, nombres de tentatives, dates. « Performance améliorée » est du remplissage, car le lecteur ne peut ni le vérifier ni agir dessus.

### Les instructions de migration comme partie de l'entrée

Une ligne Removed ou Changed qui décrit la destination mais pas le trajet a déplacé le travail vers le lecteur, qui a moins de contexte que vous. La solution est petite : deux ou trois lignes en plus, en retrait sous l'entrée, disant quoi changer et ce qui se passe si on ne le fait pas.

```markdown
### Removed
- `GET /v1/export`. Use `GET /v2/exports`. The response body is identical
  apart from `id`, now a string rather than an integer. Requests to the old
  path return 410 with a `Link` header pointing at the replacement.

  **Migrating:** change the path, and stop parsing `id` as an integer.
  The official clients do both for you from 2.2 onwards, so upgrading the
  client first is the shorter route.

### Deprecated
- `apiKey` in `config.yaml`, in favour of `api_key`. Both are read in all
  1.x releases; the old name logs a warning at startup. It is removed in
  2.0, not before 1 March 2027.
```

Trois choses font que cela fonctionne. Cela nomme le mode de défaillance, un lecteur peut donc le reconnaître dans ses propres journaux. Cela donne une date plutôt qu'une simple version, car « avant la 2.0 » n'est pas planifiable si personne ne sait quand la 2.0 sortira. Et cela propose d'abord le chemin le moins coûteux, ce qu'un lecteur avec un après-midi devant lui veut réellement.

### Des avis de dépréciation qui survivent à être ignorés

Une dépréciation est un message envoyé à quelqu'un d'occupé, supposez donc qu'il sera manqué. La version qui fonctionne arrive trois fois : dans les notes de version quand elle commence, dans le logiciel lui-même sous forme d'avertissement nommant le remplacement, et dans les notes de version à nouveau quand le retrait a lieu. Répétez l'entrée dans Deprecated à chaque version intermédiaire. Quelqu'un qui passe de la 1.1 à la 1.9 d'un coup lit une seule entrée, et elle doit être celle qui reste debout.

Deux modes d'échec valent la peine d'être évités. Un avertissement sans remplacement nommé — « ce réglage est déprécié » — envoie le lecteur chercher, et il trouvera un message de forum plutôt que votre documentation. Et un retrait qui arrive plus tôt qu'annoncé détruit la valeur de chaque future dépréciation que vous écrirez, car les dates cessent d'être une information.

## Comment faire tourner un processus de notes de version qui continue de fonctionner

1. **Nommez un responsable par version.** Un roulement convient, une responsabilité partagée non, car un changelog sans responsable est écrit par celui qui le remarque en dernier, le soir de la sortie, à partir de `git log`.
2. **Écrivez l'entrée dans la pull request qui fait le changement**, soit comme ligne sous `Unreleased`, soit comme fichier de changeset, pour que la description soit écrite par la personne qui connaît la raison et relue par la personne qui relit le changement.
3. **Écrivez ce qui compte comme changement cassant pour votre projet, et où s'arrête la surface publique.** Sans cela, chaque version répète le même débat, et la réponse varie selon qui est le plus fatigué.
4. **Rendez l'omission visible en relecture.** Une vérification qui fait échouer une pull request touchant un comportement public sans ligne de changelog coûte un après-midi à construire et retire définitivement la conversation sur l'application de la règle.
5. **Donnez à chaque ligne Removed et Deprecated une action et une date.** Les deux moitiés portent leur part : l'action dit au lecteur quoi changer, la date lui dit d'ici quand, et seule la paire des deux est quelque chose qu'une équipe peut mettre dans un sprint.
6. **Gardez le fichier dans le dépôt, en Markdown, et déduisez-en tout le reste** — une source unique qui diffe et se relit, [comme le reste de la documentation devrait y vivre](/blog/documentation-that-lives-in-the-repo), la version du site, l'email et la page de release étant des rendus plutôt que des copies.
7. **Faites lire la section du haut par quelqu'un en dehors de l'équipe avant la livraison.** Le support est le lecteur idéal : s'il ne peut pas dire ce qui a changé, les clients auxquels il répond ne le pourront pas non plus, et vous le découvrirez par des tickets.

## De CHANGELOG.md à une page que vous pouvez envoyer

Le fichier dans le dépôt sert des gens qui lisent le dépôt. Le support, les ventes et les clients ont besoin d'un lien, et c'est là que les notes de version calent en général.

Déposer `CHANGELOG.md` dans TransformPipe vous donne un fichier `.html` autonome — styles intégrés, aucun script, aucune requête réseau — à joindre à un email ou à publier comme page en lecture seule. Cette propriété mérite d'être comprise avant d'envoyer quoi que ce soit : un [fichier unique qui ne demande rien au réseau](/blog/self-contained-html-explained) s'ouvre sur un portable sans connexion exactement comme sur le vôtre, et il s'ouvrira encore dans cinq ans. Révoquer ce lien plus tard arrête celui que vous avez déjà envoyé, ce que [partager un document Markdown en lien](/blog/share-a-markdown-document-as-a-link) couvre en détail. Si la version sort aussi avec une note d'accompagnement et un guide de migration, déposer les trois d'un coup [les enchaîne en un seul document](/blog/merging-many-markdown-files), dans l'ordre.

Pour une version découpée par la CI, la même chose tourne sans surveillance :

```bash
node cli/tp.mjs push CHANGELOG.md --name "Release 1.4.0" --share link
```

La GitHub Action couvre la moitié pull request, en publiant le Markdown qu'une pull request a changé et en commentant les liens en retour — voir [publier du Markdown depuis GitHub Actions](/blog/publish-markdown-from-github-actions). Un générateur qui ouvre une pull request de release se marie bien avec cela : les notes sont relues comme du texte pendant que le diff est encore ouvert, et la page publiée provient du fichier qui a été approuvé, pas d'une copie que quelqu'un a collée.

Avant tout cela, une courte vérification de la section du haut :

- [ ] Chaque ligne Removed et Changed dit au lecteur quoi faire.
- [ ] Aucune ligne ne nomme un fichier, un module ou un numéro de ticket que le lecteur ne peut pas voir.
- [ ] La version et la date correspondent au tag.
- [ ] Les changements cassants et les correctifs de sécurité sont marqués comme tels, pas mis au même niveau que le reste.
- [ ] Quelqu'un en dehors de l'équipe l'a lu et a pu dire ce qui avait changé.

Ouvrez votre changelog et lisez sa section la plus récente comme le ferait un client. Coupez les lignes qui échouent aux trois tests, ajoutez l'action manquante à chaque changement cassant, écrivez les deux phrases qu'aucun générateur ne peut écrire, puis convertissez-le et envoyez le lien — [transformer ce Markdown en fichier HTML autonome](/) prend à peu près le temps de lire ce paragraphe, gratuitement, dans le navigateur, sans rien envoyer quand vous êtes déconnecté.

## FAQ

### Quelle est la différence entre un changelog et des notes de version ?

Un changelog est le fichier cumulatif, la version la plus récente en premier, qui enregistre chaque sortie. Les notes de version sont la part d'une version dans ce fichier, écrites pour un public particulier et portant souvent un résumé et des conseils de migration que le fichier n'a pas. En pratique, le changelog est la source et les notes de version en sont un rendu pour une section.

### Dois-je utiliser Keep a Changelog ?

Non, mais ses six catégories sont un meilleur point de départ que tout ce que vous inventeriez sous la pression du temps, et les lecteurs qui les ont déjà vues ailleurs savent déjà où regarder. La spécification est courte et sous licence MIT (vérifié sur keepachangelog.com, le 9 septembre 2026). Ce qui vaut la peine d'être gardé quoi qu'il arrive, c'est le groupement par conséquence, un intitulé `Unreleased`, et des dates ISO.

### Devrais-je générer mon changelog à partir des messages de commit ?

Générez la liste, écrivez le résumé. Des outils comme release-please, git-cliff et semantic-release trieront les commits conventionnels en sections et calculeront la version, ce qui retire la moitié fastidieuse du travail. Ils ne peuvent pas dire pourquoi la version existe, quelles entrées sont urgentes, ni qui peut la sauter, et ce sont les lignes dont les lecteurs se souviennent.

### Qu'est-ce qui compte comme un changement cassant ?

Le versionnage sémantique définit MAJOR comme un changement d'API incompatible et exige que vous déclariez précisément votre API publique (vérifié sur semver.org, le 9 septembre 2026), la réponse dépend donc de ce que vous avez promis. Retirer ou renommer quoi que ce soit d'appelable, changer le type d'un champ, resserrer la validation et abandonner la prise en charge d'un runtime sont cassants presque partout. Écrivez votre propre liste avant le débat plutôt que pendant.

### Où le changelog devrait-il vivre, dans le dépôt ou sur le site ?

Dans le dépôt, en `CHANGELOG.md`, car c'est là qu'il diffe et se relit, aux côtés du changement qui l'a provoqué. Publiez depuis là vers où que soient les lecteurs — un site, une page de release, un fichier envoyé par email — plutôt que de maintenir une deuxième copie, qui divergera en moins de deux versions.

### Quelle devrait être la longueur d'une entrée ?

Une ligne pour la plupart des changements, plus deux ou trois lignes en retrait pour tout ce qui demande une migration. Si une entrée a besoin d'un paragraphe, elle a besoin d'une page : faites un lien vers cette page depuis l'entrée et gardez la liste survolable, car le rôle de la liste est d'aider quelqu'un à décider s'il lit plus loin.

### Les services internes ont-ils besoin de notes de version ?

Oui, et elles sont moins coûteuses à écrire, car vous savez exactement qui sont vos lecteurs et comment ils nomment les choses. Les équipes qui consomment votre service ont besoin des trois mêmes réponses — ce qui a cassé, ce qui a changé, quoi faire — et un message dans un canal qui défile n'est pas un changelog.
