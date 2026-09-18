---
title: "Publier le Markdown d’une pull request avec GitHub Actions"
description: "Afficher le Markdown modifié par une pull request et commenter un lien : le workflow ligne par ligne, pourquoi un fork n’a aucun secret, et le coût des alternatives"
updated: 2026-09-09
date: 2026-08-26
tag: Automatisation
keywords: action github markdown, github actions afficher markdown, aperçu markdown pull request, aperçu documentation pull request, markdown ci, convertir markdown en ci, sécurité pull_request_target, commentaire persistant pull request, concurrence github actions, publier markdown depuis la ci
---

Une pull request qui réécrit un paragraphe montre une ligne rouge, une ligne verte, et beaucoup de retour à la ligne déplacé. Vous voyez quels mots ont changé. Vous ne voyez pas si la section se lit toujours bien, si le tableau reste aligné, ou si la liste numérotée repart de un à mi-chemin. Relire de la prose dans un diff, c’est deviner.

Les personnes dont l’approbation compte vraiment pour le document sont souvent les moins équipées pour lire un diff. Une avocate qui vérifie des conditions, un responsable support qui vérifie un manuel d’exploitation, une designer qui vérifie les mots d’un parcours : elles ouvrent l’onglet « Files changed », rencontrent un mur de rouge et de vert au retour à la ligne déplacé, et répondent que ça a l’air bien. Ce n’est pas une relecture, et personne dans l’histoire n’est fautif.

La solution est petite. Sur chaque pull request, afficher le Markdown qu’elle a modifié, publier chaque fichier, et poster les liens dans un commentaire. La relectrice clique et lit le document. Rien ne change dans le dépôt.

### En bref

Déclenchez sur `pull_request` avec un filtre `paths`, donnez au job un groupe de concurrence pour que deux pushs à une minute d’écart ne se fassent pas concurrence, déclarez `contents: read` et `pull-requests: write` et rien d’autre, et protégez l’étape de publication avec un `if` pour qu’une pull request sans changement Markdown ne fasse strictement rien. Trouver ce qui a changé signifie differ contre le commit de base, ce qui demande l’historique complet — `fetch-depth: 0` — ou une action qui interroge plutôt l’API de GitHub pour obtenir la liste. Postez un seul commentaire et mettez-le à jour sur place plutôt que d’en ajouter un à chaque push. Et connaissez la seule limite que l’on ne peut pas contourner par la configuration avant de construire dessus : une pull request venue d’un fork reçoit un jeton en lecture seule et aucun secret, délibérément, les aperçus de fork n’ont donc lieu qu’en l’absence de votre clé — et `pull_request_target`, le déclencheur qui lève la restriction, est celui par lequel les dépôts se font compromettre.

## Vérifiez ce que GitHub fait déjà

Avant d’ajouter un workflow, vérifiez si vous en avez besoin. Les commits et les pull requests qui incluent des documents de prose peuvent s’afficher en vue source ou en vue rendue, et le bouton qui bascule entre les deux se trouve dans l’en-tête du fichier — l’onglet « Files changed » affichera donc un fichier Markdown modifié plutôt que de differ son texte (vérifié sur docs.github.com, le 9 septembre 2026). Le bouton de rendu enrichi, dans le nom que la plupart des gens lui donnent. Pour un petit fichier, relu par des gens qui ont déjà la pull request ouverte, cela suffit.

Cela cesse de suffire quand le changement s’étend sur plusieurs fichiers, quand la lectrice n’a pas de compte GitHub — une avocate qui vérifie des conditions, une cliente qui lit des notes de version — ou quand vous voulez un lien qui montre encore ce que la branche disait mardi dernier.

## Le workflow, ligne par ligne

Copiez ceci dans `.github/workflows/markdown-preview.yml` :

```yaml
name: Markdown preview

on:
  pull_request:
    paths:
      - '**.md'

concurrency:
  group: markdown-preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true

permissions:
  contents: read
  pull-requests: write

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}

      - if: steps.publish.outputs.urls != ''
        run: echo "${{ steps.publish.outputs.urls }}"
```

C’est tout. La clé est une clé API TransformPipe, stockée comme secret de dépôt ; l’action embarque le convertisseur, et `action.yml` liste ses entrées. Sans liste de fichiers, elle demande à git quels fichiers Markdown la pull request a touchés, publie chacun d’eux, et commente un tableau de nom de fichier, nombre de mots et lien. Les fichiers que la branche a supprimés sont ignorés, un document retiré ne fait donc pas échouer le run.

L’essentiel de ce fichier n’est pas la conversion. C’est la poignée de lignes qui gardent le job économique, cadré, ordonné et silencieux, et chacune répond à un échec que quelqu’un a déjà vécu.

### Le déclencheur, et ce que fait `paths`

`on: pull_request` déclenche le workflow quand une pull request est ouverte, rouverte, ou reçoit un push. Ces trois types d’activité — `opened`, `synchronize` et `reopened` — sont l’ensemble par défaut, et tout ce qu’une pull request peut faire d’autre, un label, une modification de titre ou une relecture, doit être nommé explicitement avec `types` (vérifié sur docs.github.com, le 9 septembre 2026). Pousser un commit sur la branche, c’est `synchronize`, qui est le cas qui compte ici : chaque tour d’édition obtient un aperçu frais sans que personne ait à le demander.

`paths: '**.md'` est la protection la moins chère disponible, parce qu’elle s’exécute avant tout le reste. Une pull request qui ne change que du code ne met jamais le workflow en file du tout : pas de runner, pas de checkout, pas de minute facturée. `'**.md'` correspond à n’importe quelle profondeur. `'docs/**.md'` le restreint à un seul arbre, ce qui est en général ce que vous voulez dans un dépôt où du Markdown vit aussi dans des fixtures de test, un cache `node_modules`, ou une copie embarquée de la documentation de quelqu’un d’autre.

Une conséquence mérite d’être connue avant de transformer cela en vérification de statut obligatoire. La formulation même de GitHub est qu’un workflow ignoré par le filtrage de chemins laisse ses vérifications dans un état en attente, et une pull request qui exige que ces vérifications réussissent est bloquée pour la fusion (vérifié sur docs.github.com, le 9 septembre 2026) — précisément sur les pull requests qui n’avaient rien à prévisualiser. Laissez la vérification optionnelle, ou déplacez le filtre hors de `on:` vers un `if` sur le job, là où le run a lieu, rapporte, et ne fait rien.

### Un groupe de concurrence, pour que deux pushs ne se fassent pas concurrence

Deux commits poussés à une minute d’écart démarrent deux runs. Les deux font leur checkout, les deux publient, les deux commentent, et rien ne signale d’erreur. Le résultat est quand même faux : les runs peuvent finir dans le désordre, le dernier commentaire du fil — celui qu’une relectrice lit — peut donc être celui qui décrit le commit le plus ancien.

`concurrency` corrige l’ordre en refusant d’en avoir deux. Le groupe est une chaîne quelconque, et la clé sur le numéro de la pull request donne une voie par pull request plutôt qu’une voie par dépôt, ce qui ferait attendre dix pull requests ouvertes les unes derrière les autres sans raison. Avec `cancel-in-progress: true`, un nouveau run annule celui déjà en cours ; sans cela, le nouveau run attend. La description même de GitHub du comportement par défaut est qu’un job ou un workflow en attente dans le même groupe est annulé et que celui nouvellement mis en file prend sa place (vérifié sur docs.github.com, le 9 septembre 2026).

Pour un aperçu, annuler est le bon choix : la publication à moitié terminée d’un commit déjà remplacé est un travail dont personne ne veut le résultat. Si le dépôt a plusieurs workflows susceptibles d’entrer en collision, mettez aussi le nom du workflow dans le groupe — `${{ github.workflow }}-${{ github.event.pull_request.number }}` — pour que deux jobs sans rapport ne finissent pas par partager une voie par accident.

### `permissions`, et le 403 que vous obtenez sans elles

Le bloc `permissions` délimite le jeton avec lequel un workflow s’exécute. `contents: read` permet au checkout de lire le dépôt. Poster un commentaire est une portée différente, et demande `pull-requests: write`.

Omettez-la, et le travail est fait puis gaspillé : les documents se publient, l’appel de commentaire revient avec un 403, et le run passe au rouge à sa dernière étape avec les liens laissés dans le journal. Déclarez les deux portées plutôt que de compter sur la valeur par défaut, qui varie selon les réglages du dépôt et de l’organisation.

Déclarer le bloc du tout est ce qui en fait le principe du moindre privilège, car nommer deux portées met toutes les autres à néant. Une étape ajoutée plus tard dans ce job — une dépendance d’une action, un script que quelqu’un colle — ne peut alors pousser aucun commit, ouvrir aucune issue, publier aucun paquet ni lire aucun autre dépôt, quoi qu’elle essaie. Si un job dans un workflow plus large a réellement besoin de plus, donnez-lui son propre bloc `permissions` plutôt que d’élargir celui du fichier.

### Le secret, et ce qu’il peut atteindre

`secrets.TP_API_KEY` est un secret de dépôt qui contient une clé API. L’action la prend en entrée et la remet au convertisseur comme variable d’environnement plutôt que comme argument, ce qui la garde hors de la liste des processus du runner et hors de la ligne de commande échotée dans le journal. GitHub caviarde les valeurs de secrets enregistrées dans la sortie des journaux, et son propre guide indique que tout élément sensible qui n’est pas un secret GitHub doit être masqué à la main avec `::add-mask::` (vérifié sur docs.github.com, le 9 septembre 2026). Le caviardage est un filet de sécurité au-dessus d’une erreur plutôt qu’un endroit où en commettre une : une étape qui encode un secret, le découpe, ou l’envoie quelque part déjoue entièrement le masquage, et n’importe quelle étape de ce job peut le faire.

La clé elle-même n’atteint que les documents, leurs réglages de partage et un chiffre d’usage, et rien d’autre — pas la connexion, pas la liste des clés — une clé fuitée peut donc publier et supprimer des documents mais ne peut ni forger son remplacement ni verrouiller le propriétaire hors de son compte. Elle est montrée une fois et stockée seulement sous forme de hachage, ce qui fait de la rotation un ordre fixe : en forger une nouvelle, la coller dans le secret, révoquer l’ancienne.

Si le dépôt a des contributeurs à qui vous ne confieriez pas la clé en personne, mettez-la dans un secret d’environnement et donnez au job un `environment:`, pour que son usage soit soumis à la règle de protection que cet environnement porte. C’est une vraie frontière. Un simple secret de dépôt n’en est pas une : chaque workflow du dépôt peut le lire, y compris un workflow ajouté sur une branche par n’importe qui ayant l’accès en écriture.

### La protection `if`, pour que rien ne se passe quand rien n’a changé

Le filtre `paths` arrête le workflow quand aucun Markdown n’a changé du tout. La protection `if` couvre le cas un niveau en dessous, où le workflow a tourné parce que quelque chose correspondait, et où l’étape après la publication n’a rien sur quoi travailler.

L’action gère honnêtement son propre cas vide : sans fichiers, elle affiche `No Markdown to publish.`, met `urls` à une chaîne vide et `documents` à `[]`, puis se termine avec le code zéro. Ce qu’elle ne peut pas faire, c’est arrêter les étapes que vous écrivez après elle. `if: steps.publish.outputs.urls != ''` est toute la protection, et une étape ignorée est verte plutôt que rouge — ce qui compte plus qu’il n’y paraît. Un workflow qui passe au rouge pour une raison sur laquelle personne ne peut agir est un workflow que les gens apprennent à ignorer, et alors il passe au rouge pour une vraie raison et se fait ignorer à nouveau.

La même protection avec une condition différente est la façon de traiter un fork délibérément plutôt que par accident :

```yaml
      - if: github.event.pull_request.head.repo.fork == false
        id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

Cette ligne a besoin d’explication, car la restriction derrière elle est la seule chose dans ce workflow que l’on ne peut pas contourner par la configuration.

## Trouver ce qui a changé

Sans entrée `files`, l’action interroge git, en une ligne :

```bash
git diff --name-only --diff-filter=d "$BASE_SHA"...HEAD -- '*.md'
```

Chaque partie de cette ligne porte du poids. `--name-only` demande des chemins plutôt qu’un patch. `--diff-filter=d` écarte les suppressions, un document retiré par la branche n’est donc jamais remis à un convertisseur qui échouerait sur un fichier absent. Le pathspec `'*.md'` filtre à l’intérieur de git plutôt qu’après coup, ce qui garde la liste courte sur une pull request qui a aussi déplacé quatre cents images. Et les trois points ne sont pas une coquille : `A...B` diffe depuis la base de fusion des deux commits plutôt que depuis `A` lui-même, les commits arrivés sur la branche de base après l’ouverture de la pull request n’apparaissent donc pas comme le travail de cette branche.

`$BASE_SHA` vient de `github.event.pull_request.base.sha`, que la charge utile de l’événement fournit gratuitement. Ce commit est toute la question, et c’est la raison de la ligne suivante dans le workflow.

### Pourquoi `fetch-depth: 0`

`actions/checkout` récupère un seul commit par défaut — `fetch-depth` est documenté comme le nombre de commits à récupérer, avec une valeur par défaut de `1` et `0` signifiant tout l’historique pour toutes les branches et tous les tags (vérifié sur github.com, le 9 septembre 2026). C’est rapide, et suffisant pour construire du code. Ce n’est pas suffisant pour répondre à « qu’est-ce qui a changé » : l’action diffe la base de la pull request contre sa tête, et dans un clone superficiel, ce commit de base est absent, le diff échoue donc ou ne rapporte rien.

`fetch-depth: 0` récupère l’historique complet, ce qui coûte du temps réel sur un dépôt avec des années de commits. Si le checkout est déjà l’étape lente, nommez les fichiers vous-même et gardez le clone superficiel :

```yaml
      - uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook/intro.md docs/handbook/style.md
          merge: true
          name: Handbook preview
```

`files` est une liste de chemins séparés par des espaces, transmise telle quelle : un motif comme `docs/*.md` arrive littéralement et ne correspond à rien, construisez donc la liste dans une étape antérieure si vous en avez besoin d’une — le même problème que [convertir tout un dossier de fichiers Markdown](/blog/batch-convert-markdown-files), où énumérer avec `find` et trier avant de transmettre la liste est ce qui garde l’ensemble connaissable. Une liste explicite ne demande aucun historique, mais elle perd la partie qui rend l’ensemble intéressant — traitez-la comme un repli, pas comme le réglage par défaut.

### L’action vers laquelle les gens se tournent à la place

La plupart des workflows n’écrivent pas ce diff eux-mêmes. `tj-actions/changed-files` est l’alternative largement utilisée : sous licence MIT, elle calcule la liste soit à partir de l’API REST de GitHub, soit à partir du `diff` de git lui-même, c’est pourquoi elle fonctionne sur une pull request au `fetch-depth: 1` par défaut et veut quand même `fetch-depth: 0` ou `2` sur un événement `push`. Ses sorties viennent sous plusieurs formes — `all_changed_files`, `added_files`, `modified_files`, `deleted_files` — plus `any_changed`, le booléen qu’un `if` veut (vérifié sur github.com, le 9 septembre 2026).

```yaml
      - id: changed
        uses: tj-actions/changed-files@<commit-sha>
        with:
          files: '**.md'

      - if: steps.changed.outputs.any_changed == 'true'
        id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: ${{ steps.changed.outputs.all_changed_files }}
```

Deux choses sur cet extrait. La version est un SHA de commit à dessein : épingler une action tierce sur un SHA complet plutôt que sur un tag, car un tag est un pointeur mobile que le propriétaire de l’action, ou quiconque reprend ce compte, peut rediriger vers un code différent — et votre workflow le récupérera au prochain run sans aucun diff à lire pour vous. Le second point est le guillemetage. Une liste de chemins interpolée dans une valeur `with:` est une seule chaîne, un nom de fichier contenant une espace arrive donc comme deux fichiers. C’est une propriété de toute liste séparée par des espaces, y compris l’entrée `files` de cette action, pas un bogue chez l’une ou l’autre ; si de tels noms existent dans votre dépôt, écrivez la liste dans un fichier et relisez-la plutôt que de la faire passer par un shell.

## Le problème des forks, et le déclencheur qui le lève

Une limite mérite d’être connue à l’avance. Un événement `pull_request` déclenché depuis un fork ne reçoit aucun secret et un jeton en lecture seule, la pull request d’un fork ne reçoit donc aucun aperçu — et une vérification rouge où l’étape de publication s’est arrêtée faute de clé. C’est GitHub qui tient votre clé API à l’écart d’un code que vous n’avez pas lu — le bon réglage par défaut.

La formulation de GitHub ne laisse aucune place : à l’exception de `GITHUB_TOKEN`, les secrets ne sont pas transmis au runner quand un workflow est déclenché depuis un dépôt forké, et `GITHUB_TOKEN` lui-même n’a que des permissions en lecture seule dans les pull requests venues de forks (vérifié sur docs.github.com, le 9 septembre 2026). Les deux moitiés de ce workflow sont donc mortes sur un fork. L’étape de publication n’a pas de clé et échoue au niveau de l’API ; l’étape de commentaire n’a pas la portée d’écriture et échoue au niveau du commentaire. Déclarer `pull-requests: write` dans le fichier ne change rien, parce que le bloc est un plafond, pas une attribution.

### `pull_request_target`, et pourquoi c’est ainsi que les dépôts se font compromettre

Cherchez un moyen de contourner cela, et la première réponse est toujours le même déclencheur. `pull_request_target` se déclenche sur les mêmes événements que `pull_request`, mais s’exécute dans le contexte de la branche par défaut du dépôt de base plutôt que du commit de fusion — le fichier de workflow est donc le vôtre, le jeton est en écriture, et les secrets sont là (vérifié sur docs.github.com, le 9 septembre 2026).

Cela ressemble à la solution, et c’est une façon bien documentée de perdre un dépôt. Que le fichier de workflow soit le vôtre est la moitié sûre. La moitié dangereuse arrive au moment où le job touche le contenu même de la pull request. Faites le checkout du commit de tête, et tout ce qui suit est le code d’un étranger qui s’exécute dans un job détenant vos secrets et un jeton en écriture : un script de build, une commande de test, le hook d’installation d’une dépendance, une cible de Makefile, un fichier de configuration de linter, un hook git committé dans la branche. L’avertissement de GitHub sur ce déclencheur nomme les conséquences sans détour — empoisonnement de cache, et accès non voulu à des privilèges d’écriture ou à des secrets (vérifié sur docs.github.com, le 9 septembre 2026).

Convertir un fichier Markdown paraît inoffensif, et le danger n’est pas dans la conversion. Il est dans tout ce qu’un job fait pousser autour d’elle : le checkout, le `npm ci` que quelqu’un ajoute six mois plus tard pour qu’une étape de lint fonctionne, le « lançons simplement le script du projet » qui paraît évident sur le moment. Le guide de sécurité de GitHub traite cela comme un motif nommé, et la forme recommandée quand vous avez réellement besoin d’un travail privilégié sur du contenu non fiable, ce sont deux workflows : un workflow `pull_request` qui traite les fichiers du contributeur sans secrets et téléverse le résultat comme artefact, puis un workflow `workflow_run` avec des permissions qui télécharge l’artefact et fait la partie privilégiée (vérifié sur securitylab.github.com, le 9 septembre 2026).

### Ce qu’il faut faire à la place

Cette séparation est correcte, et pour un aperçu de documentation, c’est la mauvaise quantité de machinerie : deux fichiers de workflow, une remise d’artefact, et une classe d’erreur — faire le checkout de la tête dans la moitié privilégiée — dont le mode de défaillance est votre clé entre les mains de quelqu’un d’autre. Deux options plus simples couvrent presque tous les dépôts.

**Publier au push sur la branche par défaut.** Après la fusion, le job tourne sur votre propre branche avec votre propre jeton et vos propres secrets, et la question du fork disparaît parce qu’il n’y a pas de fork dans le tableau :

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'docs/**.md'

permissions:
  contents: read

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 2

      - uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          files: docs/handbook.md
          share: link
```

Deux différences avec la version pull request. `fetch-depth: 2` suffit, parce qu’un push se compare au commit précédent plutôt qu’à une base de fusion. Et `files` est nommé explicitement, parce qu’un événement push ne porte aucune pull request et donc aucun SHA de base contre lequel l’action pourrait differ — sans liste, elle ne trouve rien et se termine à zéro, ce qui est un succès silencieux plutôt qu’une erreur. Ce que vous perdez, c’est l’aperçu avant la fusion ; ce que vous gardez, c’est une page publiée pour chaque version réellement livrée, ce qui pour des notes de version et un manuel est de toute façon ce que les gens voulaient.

**Ou acceptez que les pull requests de fork n’ont pas d’aperçu.** Protégez l’étape avec `if: github.event.pull_request.head.repo.fork == false` pour que le run passe au vert avec une étape ignorée plutôt qu’au rouge avec un 401, et dites-le dans le guide de contribution. Une relectrice sur la pull request d’un fork a toujours le bouton de rendu enrichi, et une mainteneuse qui a besoin du traitement complet peut pousser la branche vers le dépôt, où le workflow a de nouveau une clé.

Une autre habitude, indépendante des forks et peu coûteuse à bien faire : n’interpolez jamais une valeur qu’un contributeur contrôle — un titre de pull request, un nom de branche, un message de commit — directement dans un script `run:`. `${{ }}` substitue le texte avant même que le shell ne le voie, un titre contenant un accent grave ou `$( )` devient donc une commande qui s’exécute avec tout ce que ce job détient. Placez la valeur dans `env:` et référencez-la comme `$VAR`, que le shell traite comme des données.

## Le commentaire, et ce que son lien montre

### Un seul commentaire, mis à jour sur place

Telle que livrée, l’action poste un nouveau commentaire à chaque exécution. Sur une branche qui reçoit quinze pushs en trois jours, cela fait quinze commentaires, quatorze pointant vers des commits que plus personne ne relit, avec la discussion réelle enterrée quelque part au milieu.

La solution est un commentaire persistant : un seul commentaire, réécrit sur place. `marocchino/sticky-pull-request-comment` est le choix habituel — sous licence MIT, indexé sur une entrée `header` pour que plusieurs workflows possèdent chacun leur propre commentaire sans se disputer le même, et elle veut la même `pull-requests: write` que ce workflow déclare déjà (vérifié sur github.com, le 9 septembre 2026). Coupez le commentaire propre de l’action et donnez-lui la sortie :

```yaml
      - id: publish
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
          comment: false

      - if: steps.publish.outputs.urls != ''
        uses: marocchino/sticky-pull-request-comment@<commit-sha>
        with:
          header: markdown-preview
          message: |
            Rendered preview of the Markdown this pull request changes:

            ${{ steps.publish.outputs.urls }}
```

Le compromis est réel, et il vaut la peine d’être fait délibérément plutôt que par défaut. Un commentaire persistant écrase sa propre histoire, le fil cesse donc d’être un registre de ce que la branche disait à chaque tour de relecture. Là où la relecture s’étale sur plusieurs jours et où quelqu’un voudra peut-être vérifier ce qu’il a approuvé mardi, l’entrée `append` de l’action — qui n’accepte que `true` et rien d’autre — ajoute chaque nouveau message au précédent plutôt que de le remplacer (vérifié sur github.com, le 9 septembre 2026), les anciens liens restent donc en dessous des plus récents et le fil reste un registre. Là où le commentaire est une ligne de statut plutôt qu’un registre, remplacez-le et gardez la page silencieuse.

L’endroit où va le lien compte autant que leur nombre. Mettez-le dans le corps du commentaire, pas seulement dans le résumé d’une vérification — une relectrice qui doit cliquer jusqu’à Details pour trouver un lien ne le trouvera pas — et donnez un nom à chaque lien, pour qu’une pull request touchant quatre documents ne présente pas quatre URL nues. Le commentaire propre de l’action est un tableau de nom de fichier, nombre de mots et lien, ce qui est à peu près le minimum permettant à quelqu’un de décider quoi ouvrir en premier.

### Un nouveau document par push, pas un seul qui se fait écraser

L’action publie un document frais à chaque exécution. Écraser une seule page serait plus soigné à regarder et pire à utiliser, car un écrasement fait de chaque ancien lien un menteur. Quelqu’un lit le commentaire lundi, suit le lien jeudi, et obtient le texte de jeudi sous l’approbation de lundi.

Un nouveau document par push maintient chaque lien épinglé au commit qui l’a produit, ce qui rend le commentaire qui s’ajoute ci-dessus digne de son bruit supplémentaire : des liens épinglés ne sont utiles que tant que quelque chose s’y accroche encore. Le coût, ce sont des documents : chaque push en dépense un sur la limite de 500 documents du compte, et atteindre une limite refuse l’écriture plutôt que de supprimer discrètement quoi que ce soit. Nettoyez les anciens aperçus en masse depuis l’historique, ou avec `tp rm` depuis [la ligne de commande](/blog/markdown-to-html-from-the-command-line).

### Qui peut ouvrir le lien

`share` décide qui peut ouvrir le résultat.

| Valeur | Qui peut le lire |
| --- | --- |
| `link` | N’importe qui avec le lien |
| `people` | Seulement les adresses que vous listez, après connexion |
| `none` | Personne sauf vous — le document atterrit dans votre historique |

Dépôt public, aperçu public : `link` convient. Pour un manuel privé, `people` est honnête, avec un piège : l’action publie dans ce mode sans liste d’adresses, le premier lien ne s’ouvre donc pour personne tant que vous n’avez pas nommé les lecteurs — dans la boîte de dialogue de partage, ou avec `PUT /api/v1/documents/:id/share`. Révoquer un partage abandonne le jeton, un lien déjà collé dans un commentaire cesse donc de fonctionner. Mettez `comment: false` pour la sortie `urls` et aucun commentaire du tout.

Ce motif convient aux dépôts où le Markdown est le livrable — [de la documentation qui vit à côté du code](/blog/documentation-that-lives-in-the-repo), [des notes de version écrites pour une lectrice, pas pour un journal de commits](/blog/release-notes-from-markdown), des RFC, des manuels d’exploitation. Si votre Markdown alimente un site statique avec son propre thème et sa propre navigation, un déploiement d’aperçu de votre hébergeur le rend correctement, et ceci ne le fait pas.

## Les alternatives, et ce que chacune coûte

Une page hébergée est une réponse à la question de savoir où vit le document rendu. Ce n’est pas la seule, et pour certains dépôts, ce n’est pas la bonne. Quatre alternatives couvrent ce que les gens font réellement, et chacune achète quelque chose de différent.

| Où vit la page | Ce que ça coûte à mettre en place | Qui peut la voir | Combien de temps ça dure |
| --- | --- | --- | --- |
| Un artefact sur le run (`actions/upload-artifact`) | une étape, aucune clé, aucun compte | quiconque peut lire le dépôt, connecté à GitHub — l’URL de téléchargement demande une connexion | 90 jours par défaut, 1 à 90 avec `retention-days` |
| GitHub Pages (`actions/upload-pages-artifact` puis `actions/deploy-pages`) | `pages: write` et `id-token: write`, un environnement `github-pages`, et un site que vous acceptez d’écraser | internet, sur un site Pages public | jusqu’au prochain déploiement qui le remplace |
| Le HTML converti recommitté sur la branche | `contents: write`, un commit de bot, et du HTML généré dans chaque futur diff | quiconque peut lire le dépôt | pour toujours, dans l’historique |
| Une page hébergée depuis une API ou une action | une clé dans un secret, un compte, et les limites de ce compte | qui que le mode de partage autorise, compte GitHub ou non | jusqu’à ce que quelqu’un la supprime |
| Rien : le bouton de rendu enrichi | aucun workflow du tout | quiconque peut ouvrir la pull request | c’est un onglet, pas un lien |

(Rétention des artefacts, permissions de Pages et exigence de téléchargement vérifiées sur github.com, le 9 septembre 2026.)

**L’artefact est le moins cher et le moins lisible.** Une étape, aucune clé, aucun compte, et la sortie est attachée au run où elle ne peut pas fuiter. Puis quelqu’un doit trouver le run, faire défiler jusqu’aux artefacts, télécharger un zip, le décompresser, et ouvrir un fichier HTML depuis son propre disque — ce qui est aussi le moment où une page qui charge sa feuille de style depuis un CDN cesse de ressembler à quoi que ce soit, un export autonome compte donc plus ici que partout ailleurs. Et l’URL de téléchargement demande une connexion GitHub, ce qui exclut précisément la lectrice pour laquelle tout cet exercice était fait.

**GitHub Pages est la bonne réponse quand la sortie est un site.** `actions/deploy-pages` publie un artefact préalablement téléversé vers Pages, et cela demande `pages: write` pour le déploiement et `id-token: write` pour que le déploiement puisse être vérifié, le job étant pointé vers l’environnement `github-pages`. Ce que ce n’est pas, c’est un aperçu par branche : un dépôt a un seul site Pages, prévisualiser une pull request signifie donc soit écraser ce qui est en ligne, soit inventer une convention de chemin et la nettoyer plus tard, et rien n’expire de lui-même.

**Recommitter le HTML fonctionne, et empoisonne le diff.** Cela demande `contents: write` — la permission que le reste de cet article a évitée — et un commit de bot qui redéclenchera le workflow à moins de s’en prémunir. Le coût durable, c’est la relecture : chaque pull request porte désormais mille lignes de balisage généré que personne ne lit et que tout le monde fait défiler, plus des conflits de fusion dans un fichier qu’aucun humain n’édite. La sortie générée appartient ailleurs que dans l’arbre source, et c’est le cas le plus clair de cela.

**Une page hébergée achète exactement une chose : une lectrice sans compte.** C’est toute la justification, et si personne dans la relecture n’en a besoin, l’artefact est moins cher et le rendu enrichi est encore moins cher. Cela coûte une clé dans un secret et un compte avec des limites — 500 documents, 100 Mo, et 4 Mo pour un seul document. Ces limites sont la raison de nettoyer les anciens aperçus plutôt que de laisser s’accumuler une année de pull requests.

**Et une chose qui ne fonctionne pas : coller le HTML dans le commentaire.** GitHub rend le corps d’un commentaire comme son propre Markdown et retire les balises dont dépend un document converti, `style` en premier. Un commentaire peut porter un lien. Il ne peut pas porter un document.

## Vingt fichiers, deux limites de débit, et les façons dont ça échoue

Une pull request de restructuration touche vingt fichiers Markdown, et la forme du job cesse d’être un détail.

### Une boucle bat une matrice ici

Le réglage par défaut de l’action est un document par fichier, converti et publié l’un après l’autre à l’intérieur d’un seul job. Vingt fichiers, ce sont vingt requêtes dans un seul processus sur un seul runner, et cela prend environ le temps d’un fichier plus dix-neuf allers-retours.

L’instinct est d’éclater en matrice — construire la liste des fichiers dans un job, la passer avec `fromJSON` dans `strategy.matrix` du job suivant, et faire tourner vingt jobs en parallèle. Pour un travail qui prend des minutes par élément, c’est exactement juste. Pour une conversion qui prend un instant, ce sont vingt allocations de runner, vingt checkouts, vingt téléchargements d’action et vingt commentaires à moins de les supprimer, pour économiser quelques secondes d’allers-retours API. La boucle gagne sur tous les axes qui comptent.

Si vous éclatez malgré tout pour une autre raison, trois réglages empêchent que ça fasse mal : `fail-fast: false`, pour qu’un fichier malformé n’annule pas les dix-neuf autres ; `max-parallel`, pour que la salve devienne un filet ; et un job final qui rassemble les sorties et écrit un seul commentaire, car vingt commentaires valent pire que zéro.

La meilleure réponse pour vingt fichiers liés n’est en général pas la parallélisation du tout. `merge: true` les enchaîne en un seul document avec un seul lien, et une relectrice lit un manuel dans l’ordre plutôt que d’ouvrir vingt onglets et de perdre le fil. L’ordre devient alors la chose à bien faire, le même problème qu’a une conversion sur tout un dossier.

### Soixante appels par minute, et mille par heure

Deux limites de débit se trouvent au bout de ce job, et elles appartiennent à des systèmes différents.

L’API compte les appels par appelant et par minute, et refuse le soixante-et-unième avec un 429 et un `Retry-After`, sur le raisonnement qu’une clé qui va plus vite que ça boucle plutôt qu’elle ne travaille. Vingt fichiers dans une boucle, ce sont vingt appels, loin du compte. Vingt jobs en parallèle, chacun retentant sur un délai dépassé, sur un dépôt où trois pull requests sont ouvertes en même temps, c’est ainsi qu’une limite qui semblait généreuse se fait atteindre.

La propre limite de GitHub se trouve sur le commentaire : `GITHUB_TOKEN` obtient 1 000 requêtes par heure et par dépôt, partagées entre chaque workflow de ce dépôt (vérifié sur docs.github.com, le 9 septembre 2026). Un commentaire par run, ce n’est rien. Un commentaire par fichier, sur un monorepo actif, à côté de tout autre workflow dépensant du même budget, c’est un 403 un mardi après-midi que personne ne relie au changement fait lundi. Un seul commentaire persistant par run est la réponse la moins chère aux deux limites à la fois.

### Quand le job passe au rouge, et quand il passe au vert en mentant

Quatre échecs expliquent presque tous les cas. Trois s’annoncent d’eux-mêmes. Le quatrième est celui dont il faut s’inquiéter.

**Un corps que la plateforme refuse.** La conversion accepte jusqu’à 10 Mo, mais un document conservé dans un compte est plafonné à 4 Mo, et la raison n’est pas une politique : une fonction Vercel refuse une requête ou une réponse dont le corps dépasse 4,5 Mo avant même qu’aucun de nos codes ne s’exécute, un document plus gros ne pourrait donc être ni sauvegardé ni relu, et l’appelant obtiendrait le 413 nu de la plateforme au lieu d’une phrase qui s’explique. En CI, l’indice est l’erreur obtenue — un corps JSON avec un message lisible signifie que la requête a atteint l’API et a été refusée par elle ; un 413 nu sans corps signifie qu’elle n’est jamais arrivée. Dans les deux cas, la solution est la même, et ce n’est presque jamais « découper le document » : un fichier Markdown de 4 Mo est en général de la sortie générée qui n’aurait jamais dû se trouver dans l’aperçu, ce à quoi servent le filtre `paths` et une liste `files` explicite.

**Un jeton expiré.** Deux jetons différents peuvent être visés par cela. `GITHUB_TOKEN` est forgé pour le job et cesse de fonctionner quand le job se termine, ce qui ne mord que si vous essayez de le remettre à quelque chose en dehors du run. La clé API est celle qui expire en pratique — révoquée par qui l’a fait tourner, ou supprimée avec le compte. Le symptôme est un 401 à chaque run, y compris les relances de runs qui sont passés la semaine dernière, et c’est le diagnostic : rien n’a changé dans le dépôt, rien dans le dépôt n’est donc la cause. Les clés sont stockées sous forme de hachage et montrées une fois, il n’y a donc rien à inspecter ; forgez-en une nouvelle, mettez à jour le secret, relancez.

**Un secret qui n’a jamais été là.** Un secret référencé sous le mauvais nom n’est pas une erreur. Il s’interpole en chaîne vide, l’étape s’exécute sans clé, et l’échec apparaît au niveau de l’API sous forme d’un 401 qui se lit comme une mauvaise clé plutôt qu’une clé manquante. Vous ne pouvez pas le tester directement, car le contexte `secrets` n’est disponible dans un `if` ni au niveau du job ni au niveau de l’étape (vérifié sur docs.github.com, le 9 septembre 2026). Copiez-le dans `env` au niveau du job et testez la variable à la place :

```yaml
jobs:
  preview:
    runs-on: ubuntu-latest
    env:
      HAS_KEY: ${{ secrets.TP_API_KEY != '' }}
    steps:
      - if: env.HAS_KEY == 'true'
        uses: raudarlabs/transformpipe@main
        with:
          api-key: ${{ secrets.TP_API_KEY }}
```

**Un document qui se convertit et se retrouve vide.** C’est le cas dangereux, parce que tout est vert. Un fichier qui n’est rien d’autre que de l’en-tête YAML se convertit en un document sans corps. Il en va de même pour un fichier dont le contenu est un seul commentaire HTML, ou une page dont le texte vit dans une balise de gabarit que le convertisseur n’exécute pas. Le workflow réussit, le commentaire se poste, le lien ouvre une page blanche, et la relectrice suppose que la page blanche est le document. Protégez-vous avec le nombre de mots que l’action rapporte déjà :

```yaml
      - if: steps.publish.outputs.documents != ''
        env:
          DOCUMENTS: ${{ steps.publish.outputs.documents }}
        run: |
          node -e '
            const docs = JSON.parse(process.env.DOCUMENTS || "[]");
            const empty = docs.filter((d) => d.words < 20);
            if (empty.length > 0) {
              console.error(`Empty after conversion: ${empty.map((d) => d.name).join(", ")}`);
              process.exit(1);
            }
          '
```

Vingt mots, c’est arbitraire, et ce n’est pas grave — l’important n’est pas le seuil mais le fait qu’un document que personne ne peut lire fasse désormais échouer le run au lieu de le laisser passer.

## Le même job sur GitLab, et sur un runner que vous possédez

Rien de ce qui précède ne concerne vraiment GitHub. Le travail consiste à : trouver ce qui a changé, le convertir, le publier, et mettre le lien là où se trouve la relectrice. Seules les deux dernières lignes de cela sont spécifiques à l’hébergeur.

Sur GitLab, les pièces s’alignent presque une pour une. `rules:changes` est le filtre `paths`. `interruptible: true` est ce qui rend un job annulable quand un pipeline plus récent le remplace, et `resource_group` limite la concurrence là où les jobs ne doivent pas se chevaucher. `CI_MERGE_REQUEST_DIFF_BASE_SHA` est décrit dans la documentation comme le SHA de base du diff de la merge request, qui est le commit contre lequel differ, et `CI_MERGE_REQUEST_IID` est le numéro dans l’URL de la merge request, contre lequel un commentaire est posté. Le problème du clone superficiel est le même problème avec un autre bouton : le runner clone superficiellement par défaut, et `GIT_DEPTH` est ce qui change cela (le tout vérifié sur docs.gitlab.com, le 9 septembre 2026).

```yaml
markdown-preview:
  image: node:lts-alpine
  interruptible: true
  variables:
    GIT_DEPTH: 0
  rules:
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
      changes:
        - '**/*.md'
  script:
    - files=$(git diff --name-only --diff-filter=d
        "$CI_MERGE_REQUEST_DIFF_BASE_SHA"...HEAD -- '*.md')
    - node tp.mjs push $files --share link --json > documents.json
```

Sur un runner qui vous appartient — Jenkins, Buildkite, une tâche cron sur une machine dans un placard —, deux des quatre pièces sont tout simplement absentes. Il n’y a pas de charge utile d’événement, vous calculez donc la base vous-même avec `git merge-base origin/main HEAD`, et il n’y a pas de pull request pour commenter, le lien va donc là où votre équipe lit réellement : un message de chat, une annotation de build, un email. Ce qui voyage sans changer, c’est le diff et la requête, et la requête est la partie qui mérite un soin particulier, car [une API de conversion ne vaut que ses messages d’erreur et ses limites publiées](/blog/converting-documents-with-an-api). Si le job convertit tout un arbre plutôt qu’une poignée de fichiers modifiés, [énumérer et ordonner les fichiers est la moitié la plus difficile](/blog/batch-convert-markdown-files).

## Comment choisir ce qu’il faut publier

1. **Déterminez qui est la lectrice avant de choisir une destination.** Si tous ceux dont l’approbation compte ont un compte GitHub, le rendu enrichi et un artefact sont gratuits, et vous pouvez arrêter de lire ; le workflow ne mérite son coût que si l’une des lectrices n’en a pas, car alors un lien est le seul artefact qui fonctionne.
2. **Publiez au push sur la branche par défaut, sauf besoin réel d’un aperçu avant la fusion.** Cela retire d’un coup la question du fork, la question du jeton et la moitié des modes d’échec, et le coût est que la relecture continue de se faire sur le diff.
3. **Ne recourez jamais à `pull_request_target` pour faire fonctionner les aperçus de fork.** Cela remet vos secrets à un job sur le point de faire le checkout du code de quelqu’un d’autre, et le mode d’échec n’est pas un run rouge que vous pouvez corriger, c’est une clé que vous devez faire tourner et un historique que vous devez auditer.
4. **Protégez l’étape de publication pour que les cas gênants soient ignorés plutôt que d’échouer.** Aucun Markdown modifié, ou pull request venue d’un fork : un run vert avec une étape ignorée garde la vérification fiable, et une vérification à laquelle personne ne fait confiance est une vérification que personne ne lit quand cela compte enfin.
5. **Gardez un commentaire par pull request et un document par push.** Un commentaire, car un fil de quinze entrées est un fil que personne ne fait défiler jusqu’au bout ; un nouveau document par push, car écraser une page fait de chaque lien du fil un menteur sur le commit qu’il décrit.
6. **Comptez les requêtes avant d’éclater en parallèle.** Vingt fichiers dans un job, ce sont vingt appels ; vingt jobs, ce sont vingt runners, vingt checkouts et deux limites de débit, et une limite refuse plutôt qu’elle ne met en file.
7. **Vérifiez ce que voit la relectrice, pas ce que dit le run.** Ouvrez le lien depuis le commentaire, déconnecté, sur un téléphone, et voyez si c’est bien le document. Un workflow peut être vert de bout en bout et quand même publier une page vide.

Relire de la prose dans un diff, c’est deviner, et toute la solution tient en un fichier : un déclencheur avec un filtre `paths`, un groupe de concurrence, deux permissions, un secret, et une étape qui publie ce que la branche a changé et laisse un lien là où une relectrice le verra réellement. Commencez par le dépôt dont le Markdown est lu par quelqu’un qui n’écrit pas de code, ouvrez une pull request contre un fichier qui a besoin d’une vraie modification, et voyez si le premier commentaire qui revient parle du texte plutôt que de la mise en forme. Pour voir à quoi ressemble le résultat avant de forger une clé pour cela, convertissez d’abord le fichier à la main — [la conversion Markdown vers HTML de TransformPipe](/) tourne dans votre navigateur, gratuitement, et déconnecté, le fichier n’est envoyé nulle part.

## FAQ

### Puis-je prévisualiser du Markdown depuis une pull request ouverte sur un fork ?

Pas avec un secret, et c’est délibéré. Un événement `pull_request` venu d’un fork obtient un `GITHUB_TOKEN` en lecture seule et aucun secret de dépôt, l’étape de publication n’a donc pas de clé et l’étape de commentaire n’a pas la portée d’écriture. Publiez plutôt au push sur la branche par défaut, ou protégez l’étape pour qu’une pull request de fork la saute proprement.

### `pull_request_target` est-il jamais sûr ?

Seulement quand le job ne touche jamais au contenu de la pull request — aucun checkout de la tête, aucune exécution de quoi que ce soit venu de la branche, aucune installation de dépendance qui pourrait exécuter un script depuis elle. Pour l’étiquetage et le triage, c’est atteignable. Pour tout ce qui lit les fichiers du contributeur, utilisez le motif à deux workflows avec `workflow_run`, ou ne le faites pas du tout.

### Pourquoi mon workflow ne fait-il rien quand je pousse ?

En général le filtre `paths` : il est évalué contre les fichiers que la pull request a changés, un push qui n’a touché aucun fichier correspondant ne met donc jamais un run en file. Le piège associé consiste à faire d’un workflow filtré par `paths` une vérification de statut obligatoire — il ne rapporte jamais sur les pull requests qu’il ignore, la fusion attend donc une vérification qui n’arrivera jamais.

### Ai-je vraiment besoin de `fetch-depth: 0` ?

Seulement si quelque chose dans le job diffe contre le commit de base, ce qui est la façon dont la liste des fichiers modifiés est construite. Un clone superficiel ne contient pas ce commit, le diff échoue donc ou ne rapporte rien. Nommer les fichiers explicitement l’évite, tout comme une action qui interroge l’API de GitHub plutôt que git pour obtenir la liste.

### Comment arrêter le bot qui commente à chaque push ?

Coupez le commentaire propre de l’action avec `comment: false` et postez un commentaire persistant à la place, indexé sur un en-tête pour que le même commentaire soit réécrit sur place à chaque run. Gardez cependant les liens eux-mêmes distincts par push — réutiliser un document pour chaque commit fait que d’anciens liens du fil décrivent un texte qui n’existe plus.

### Que se passe-t-il quand une pull request touche vingt fichiers ?

L’action publie vingt documents depuis un seul job et commente un tableau de vingt lignes, ce qui va bien. Les enchaîner en un seul document avec `merge: true` est en général mieux pour une lectrice. Une matrice de vingt jobs parallèles est l’option à éviter : plus de coût de mise en place que de coût de conversion, et deux limites de débit qui attendent au bout.

### Puis-je faire cela sans compte ni clé API ?

Oui, avec moins. Convertissez le fichier dans un navigateur et collez le lien vous-même, ou faites en sorte que le workflow attache le HTML rendu comme artefact, ce qui ne demande ni clé ni compte — la lectrice a seulement besoin d’être connectée à GitHub pour le télécharger. La clé achète une chose : un lien qui s’ouvre pour quelqu’un qui n’a aucun compte GitHub du tout.
