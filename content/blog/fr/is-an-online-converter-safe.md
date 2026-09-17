---
title: "Un convertisseur Markdown en ligne est-il sûr ? Vérifier plutôt que faire confiance"
description: "La sûreté d’un convertisseur en ligne tient à quatre points vérifiables : le téléversement, la conservation, qui peut lire le fichier, et les conditions"
date: 2026-08-16
tag: Sécurité
keywords: convertisseur en ligne sécurisé, convertir un document en ligne rgpd, convertisseur markdown confidentialité, convertir un fichier sans le téléverser, durée de conservation convertisseur en ligne, conditions d’utilisation convertisseur de fichiers, convertisseur qui tourne dans le navigateur
---

Personne ne lit la politique de confidentialité d’un convertisseur de fichiers. Le document est ouvert, l’échéance est maintenant, la page annonce gratuit et sans inscription, et trente secondes plus tard il y a un fichier HTML dans le dossier des téléchargements et aucun souvenir d’avoir pris une décision. Une décision a pourtant été prise : sur le fait que ce document a quitté les murs, sur qui en détient désormais une copie, pour combien de temps, et sous quelle licence.

### En bref

Un convertisseur est sûr pour un document donné quand vous pouvez répondre à quatre questions à son sujet — le fichier est-il téléversé, combien de temps une copie est-elle conservée, qui d’autre se trouve sur le trajet, et la sortie est-elle assainie. Trois de ces réponses s’observent dans un navigateur en cinq minutes : ouvrez l’onglet réseau, convertissez un fichier de test, et regardez ce qui part ; puis lisez les conditions en cherchant une clause de licence plutôt que le titre rassurant de la page confidentialité. La conversion côté navigateur ne téléverse rien et se vérifie en coupant le réseau, la conversion côté serveur doit lire votre texte en clair pour faire son travail, et un outil hors ligne n’implique aucun réseau mais vous coûte une installation et une chaîne d’approvisionnement. Pour des contrats, des notes médicales, des identifiants, des résultats financiers non publiés et tout ce qui relève d’un accord nommant les sous-traitants autorisés, un téléversement n’est pas un risque à peser — c’est une divulgation.

« Est-ce que c’est sûr » est une question mal formée, parce que la sûreté n’est pas une propriété que possède un convertisseur. Ce qu’un convertisseur possède, c’est un ensemble de comportements, observables pour la plupart, et un ensemble de promesses, toutes lisibles. Ce sont deux natures de preuve différentes, et elles échouent différemment : un comportement peut changer au prochain déploiement, et une promesse peut être vraie sans couvrir ce qui vous préoccupe.

La friction, c’est que la vérification prend cinq minutes et la conversion trente secondes : la vérification n’a donc jamais lieu. Elle ressemble aussi à de la paranoïa, jusqu’à la fois où elle n’en est pas — la note de version qui nomme un client non annoncé, le post-mortem qui contient les noms d’hôtes internes, le README dont l’exemple de configuration contient encore un jeton actif. Ce sont des fichiers ordinaires. Ils passent tous les jours par des convertisseurs ordinaires.

Ce qui suit est la version honnête la plus courte : ce que l’expression « convertisseur en ligne » passe sous silence, comment le découvrir au lieu de le deviner, à quoi servent réellement les trois familles de convertisseurs, et les documents précis pour lesquels un téléversement n’est pas du tout un arbitrage.

## Ce que les gens vérifient, et ce qu’ils devraient vérifier

Regardez quelqu’un choisir un convertisseur et vous le verrez évaluer quatre choses, dont aucune ne porte sur la question.

**Le cadenas.** HTTPS est une affirmation sur le transport. Elle dit que les octets ont été chiffrés entre votre navigateur et ce serveur, et elle ne dit rien sur le fait qu’ils auraient dû être envoyés, sur ce que le serveur en a fait, sur la durée pendant laquelle il les a gardés, ni sur les tiers à qui il les a transmis. Tout convertisseur hébergé qui téléverse votre fichier le téléverse en HTTPS. Celui qui le garde pour toujours aussi.

**L’allure professionnelle du site.** La qualité du design est corrélée au budget, pas au traitement des données. Une zone de glisser-déposer soignée avec une animation de progression est une interface ; la partie intéressante est la requête qui se trouve derrière. À l’inverse, une page brute sans mise en forme peut très bien faire tout le travail localement.

**« Aucune inscription requise. »** Cela veut dire qu’il n’y a pas de compte. Cela ne veut pas dire qu’il n’y a pas de téléversement. Les deux sont confondus en permanence, parce que s’inscrire ressemble au moment où l’on remet quelque chose, et qu’à ce stade le fichier est généralement déjà parti.

**Un chiffre d’utilisation.** La popularité n’est pas un contrôle. Un service utilisé par énormément de monde a une surface d’incident plus grande, pas plus petite, et le nombre affiché en page d’accueil ne vous apprend rien sur la conservation, les sous-traitants ou ce que les conditions disent de votre contenu.

Les quatre questions qui, elles, portent sur le sujet sont plus ternes et ont des réponses :

1. Le fichier est-il téléversé, oui ou non ?
2. Si oui, combien de temps une copie est-elle conservée, et où ?
3. Qui d’autre peut la lire — des employés, des sous-traitants, quiconque détient un lien de résultat ?
4. La sortie est-elle assainie, ou transporte-t-elle tout ce qui se trouvait dans l’entrée directement jusqu’à un navigateur ?

La quatrième est celle que personne ne pose. Les trois premières concernent la confidentialité de votre document. La quatrième concerne le fait que le fichier qu’on vous rend puisse nuire à la personne à qui vous l’envoyez, et elle vaut tout autant pour un convertisseur qui tourne entièrement sur votre propre machine.

## Cinq choses que « convertisseur en ligne » dissimule

L’expression travaille beaucoup. Elle en est venue à signifier « tourne sur le serveur de quelqu’un », mais un navigateur est un environnement d’exécution comme un autre, et un convertisseur écrit pour y tourner fait le travail sur votre machine et ne téléverse rien. Les deux sont en ligne au sens où vous les avez atteints par une URL. Un seul est en ligne au sens où les gens l’entendent.

Voici ce que l’expression dissimule, et comment atteindre chaque point.

| Ce qui est dissimulé | Comment le vérifier | À quoi ressemble une mauvaise réponse |
| --- | --- | --- |
| Si le fichier est téléversé | Onglet réseau ouvert, convertir un fichier de test, guetter une requête sortante de la taille de votre document | Un `POST` transportant du `multipart/form-data`, ou la page qui échoue à convertir réseau coupé |
| Combien de temps une copie est conservée | Chercher une durée dans la politique de confidentialité — heures, jours, « jusqu’à ce que vous le supprimiez » | Des assurances sans le moindre chiffre : « nous prenons votre vie privée très au sérieux » |
| Qui d’autre peut le lire | La liste des sous-traitants, la région, le fait que les résultats soient livrés par un lien devinable | Aucune liste, ou une URL de résultat partageable sans le moindre identifiant |
| Ce que les conditions revendiquent sur votre contenu | Chercher dans les conditions licence, libre de redevances, sous-licenciable, perpétuelle, œuvres dérivées | Une licence de contenu large, sans limitation de finalité et sans échéance |
| Si la sortie est assainie | Convertir un document contenant une balise de script et lire le HTML qui revient | `<script>`, `onerror=` ou `javascript:` toujours présents dans la sortie |

Deux de ces points méritent d’être déployés tout de suite, parce que c’est là que les formulations font le plus de dégâts.

**« Nous ne stockons pas vos fichiers » n’est pas « nous ne recevons pas vos fichiers ».** Une affirmation sur le stockage est une affirmation sur ce qui se passe après le téléversement. Elle concède le téléversement. C’est aussi la phrase la plus répandue sur la page d’accueil d’un convertisseur, et elle est généralement vraie — le fichier est réellement supprimé après traitement —, ce qui est précisément pourquoi elle fonctionne si bien comme substitut de l’affirmation plus forte à laquelle elle ressemble. Si vous voulez l’affirmation plus forte, la formulation à chercher porte sur la transmission : le fichier n’est pas envoyé, la conversion a lieu dans votre navigateur, rien ne quitte votre machine.

**Un convertisseur côté serveur ne peut pas être chiffré de bout en bout.** Cela découle du travail qu’il effectue. Pour transformer du Markdown en HTML, le convertisseur doit analyser le Markdown, donc il doit disposer du texte en clair, donc le chiffrement s’arrête à son serveur et non à l’autre extrémité. TLS protège le trajet. Il ne peut pas empêcher la destination de lire ce qui est arrivé, puisque lire ce qui est arrivé est précisément le service rendu. Tout convertisseur qui met en avant un chiffrement de bout en bout tout en convertissant côté serveur emploie l’expression à la légère ou ignore ce qu’elle signifie, et les deux sont des raisons de lire le reste de la page plus lentement.

## Comparatif rapide : l’aide-mémoire

Il existe trois positions honnêtes qu’un convertisseur peut tenir. Tout le reste est du marketing posé sur l’une d’elles.

| Famille | Où le fichier est lu | Ce qui peut être conservé | Qui d’autre est sur le trajet | Ce que les conditions peuvent revendiquer | Adapté à | Inadapté à |
| --- | --- | --- | --- | --- | --- | --- |
| Côté navigateur | Votre propre machine, par du JavaScript que la page a déjà chargé | Rien — il n’y a aucune copie à garder | Quiconque d’autre a un script sur cette page | Rien sur un contenu qu’il ne reçoit jamais | Tout ce qui n’est pas déjà public ; les conversions ponctuelles rapides ; le travail où l’on veut pouvoir vérifier | Les fichiers très volumineux ; les formats qu’un navigateur ne sait pas analyser ; les lots sans surveillance |
| Côté serveur | La machine du prestataire, dans une région qu’il choisit | Le téléversement, la sortie, les journaux, et tout lien de résultat | Le prestataire, son hébergeur, ses sous-traitants, quiconque a le lien | Une licence pour héberger, copier et traiter votre contenu | Les formats exotiques ; les conversions lourdes ; les chaînes pilotées par API ; les documents publics | Les contrats, les données de santé, les identifiants, tout ce qui relève d’un NDA nommant les sous-traitants |
| Hors ligne | Votre propre machine, par un logiciel que vous avez installé | Ce que l’outil écrit sur le disque, sous votre contrôle | Personne, une fois installé — mais l’installation a une chaîne d’approvisionnement | Rien ; une licence régit le logiciel, pas vos fichiers | Le travail réglementé ; les chaînes reproductibles ; les environnements isolés ; les traitements en masse | Les conversions ponctuelles où une installation est absurde ; les machines où vous ne pouvez rien installer |

La case qui surprend, c’est la troisième colonne de la première ligne. La conversion côté navigateur n’a pas de politique de conservation, non pas parce que le prestataire est généreux, mais parce qu’il n’y a rien sur quoi une politique pourrait porter. C’est une autre catégorie de réponse que « supprimé au bout de vingt-quatre heures », et c’est la seule qui ne dépende pas de quelqu’un tenant une promesse à propos d’une copie qu’il détient.

La case qui surprend dans l’autre sens, c’est la dernière colonne de la troisième ligne. Un outil hors ligne n’est pas automatiquement le choix le plus sûr, parce qu’installer un logiciel est en soi une décision de confiance, et qu’un convertisseur que vous avez installé s’exécute avec l’accès de votre compte utilisateur à tous les fichiers que vous possédez. Le téléversement évité est une exposition plus étroite que le paquet ajouté.

## Comment vérifier plutôt que faire confiance

Tout cela est vérifiable. Rien n’exige d’outillage particulier — un navigateur et dix minutes règlent le cas d’un convertisseur sur lequel vous êtes sur le point de vous appuyer, et les mêmes dix minutes le règlent pour toute l’équipe.

### L’onglet réseau

Ouvrez les outils de développement avant de convertir quoi que ce soit, pas après. Dans Chrome, Edge ou Firefox, c’est F12 ; le panneau que vous voulez s’appelle Réseau. Rechargez la page panneau ouvert, afin de capturer aussi le chargement de la page, puis convertissez un fichier et regardez.

Ce que vous cherchez, c’est une requête qui apparaît au moment où vous convertissez, avec un corps de requête à peu près de la taille de votre document. Filtrez sur `Fetch/XHR` pour couper le bruit. Triez par taille si la liste est longue.

```
# A browser-side conversion, after the page has finished loading
(no new rows appear when you press Convert)

# An upload, in the same panel
POST  /api/convert   xhr   multipart/form-data   1.4 MB   312 ms
GET   /api/result/8f3c1e   xhr   application/json   2.1 kB
```

Deux raffinements font de ce test un bien meilleur test.

D’abord, coupez le réseau et recommencez. Chargez le convertisseur, puis déconnectez-vous — mode avion, ou la case Hors ligne du panneau Réseau — et convertissez. Un convertisseur côté navigateur continue de fonctionner, parce que le code est déjà dans la page et que le fichier n’a jamais eu besoin d’aller où que ce soit. Un convertisseur côté serveur s’arrête. C’est le meilleur test de cinq secondes qui existe, parce qu’on ne peut pas le simuler avec une requête qui se contente de paraître petite.

Ensuite, regardez à qui d’autre la page parle. Un convertisseur qui ne téléverse pas votre document peut tout de même envoyer son nom de fichier, sa taille ou un événement de page à un point de collecte d’analytique, et cela peut compter à soi seul : un nom de fichier comme `plan-social-final.md` est une divulgation même quand le contenu ne l’est pas. Pendant que vous y êtes, comptez les scripts tiers. Chaque script que la page charge s’exécute dans la même origine que le convertisseur, avec le même accès à la page et donc à votre document. Un convertisseur côté navigateur équipé d’un gestionnaire de balises, d’un widget de chat et de deux fournisseurs d’analytique est à un prestataire près d’un téléversement qu’il n’avait pas prévu.

### La politique de confidentialité, lue pour ses substantifs

Lisez la politique en cherchant trois choses et ignorez le reste : ce qui est collecté, combien de temps c’est gardé, et avec qui c’est partagé. Les assurances ne font pas partie des trois. Une phrase contenant une durée vaut plus que trois paragraphes sur le sérieux avec lequel qui que ce soit prend quoi que ce soit.

Si vous ne trouvez pas de phrase sur la conservation, la conclusion honnête est que la durée de conservation est inconnue, et une durée inconnue n’est pas la même chose qu’une durée courte. Traitez le téléversement en conséquence.

### L’énoncé de conservation, pris pour lui-même

Les bons services hébergés énoncent la conservation clairement, et ces énoncés prennent des formes reconnaissables : supprimé immédiatement après traitement, supprimé après un nombre d’heures fixe, gardé jusqu’à ce que vous le supprimiez, gardé aussi longtemps que votre compte existe. Chacune est défendable. Aucune n’est nulle.

Deux détails de l’énoncé de conservation méritent plus d’attention qu’ils n’en reçoivent d’ordinaire.

Le premier est ce qui arrive quand une conversion échoue. Plusieurs services gardent un téléversement en échec plus longtemps qu’un téléversement réussi, afin que le support puisse l’examiner, ce qui est parfaitement sensé et signifie que le document que vous voudriez le plus oublier — celui qui a cassé — est celui qui est gardé le plus longtemps.

Le second est ce que l’énoncé couvre. La conservation décrit d’ordinaire le fichier téléversé et la sortie convertie. Elle décrit rarement les journaux, et c’est dans les journaux que vivent les noms de fichiers, les tailles, les adresses IP et les horodatages. Supprimer le document et garder la ligne de journal qui le concerne est un résultat d’ingénierie tout à fait normal, et une réponse partielle à « est-ce que c’est parti ».

### Les conditions, et la clause de licence

C’est la vérification que presque personne n’effectue, et c’est celle qui produit de temps en temps une vraie surprise. Ouvrez les conditions d’utilisation et cherchez dans le texte ces mots :

```
licence   license   royalty-free   sublicensable   perpetual
irrevocable   worldwide   derivative works   retain   store
third parties   subprocessor   improve our services   training
```

La plupart des services ont besoin d’une licence quelconque sur votre contenu, et le dire n’a rien de sinistre : pour stocker un fichier, le copier entre machines et vous le rendre, un prestataire a besoin de votre autorisation de le stocker, de le copier et de le transmettre. Ce que vous vérifiez, c’est la forme de cette autorisation, et il y a quatre choses à regarder.

Est-elle limitée par sa finalité — « uniquement pour fournir le service » — ou ouverte ? Prend-elle fin quand vous supprimez le fichier et fermez le compte, ou est-elle perpétuelle ? Est-elle sous-licenciable, ce qui l’étend à des parties que vous ne voyez pas ? Et déborde-t-elle de l’exploitation du service vers son amélioration, ce qui, dans l’usage actuel, signifie souvent entraîner des modèles sur ce que vous avez téléversé ?

Une licence limitée par sa finalité, non sous-licenciable et qui s’éteint avec votre contenu est normale et sans problème. Une licence perpétuelle, mondiale et sous-licenciable d’utiliser, d’adapter et de créer des œuvres dérivées à partir de tout ce que vous téléversez, sans aucune limitation de finalité, est une clause que quelqu’un a écrite exprès. Qu’elle compte ou non dépend entièrement du document que vous convertissez et de son propriétaire : pour vos propres notes, pas du tout ; pour le projet d’accord d’un client, c’est toute la décision, et c’est peut-être une décision que votre contrat ne vous autorise pas à prendre.

### Si la sortie est assainie

Voici maintenant l’autre moitié de la sûreté, celle qui n’a rien à voir avec l’endroit où votre fichier est parti.

Markdown autorise le HTML brut par conception : un fichier `.md` peut donc contenir une balise `<script>`, un gestionnaire `onerror` ou une URL `javascript:`, et un convertisseur qui restitue fidèlement transmettra les trois au navigateur. C’est très bien pour un fichier que vous avez écrit. Ce ne l’est pas pour un README récupéré sur le réseau, un document envoyé par un client, ou quoi que ce soit qu’un modèle a produit à partir de matière que vous n’avez pas lue.

Vous pouvez le tester en une minute. Fabriquez un petit fichier contenant les formes connues pour être dangereuses, et convertissez-le :

```markdown
## Sanitiser test

<script>window.__test = 1</script>

<img src=x onerror="window.__test = 2">

[a link](javascript:void 0)

<iframe src="https://example.com"></iframe>

<a href="#" onclick="window.__test = 3">text</a>
```

Ouvrez ensuite le HTML que le convertisseur vous a rendu dans un éditeur de texte — pas dans un navigateur — et cherchez dedans. Si `<script`, `onerror`, `onclick` ou `javascript:` ont survécu, le convertisseur restitue fidèlement et n’assainit pas, et la sortie n’est sûre que dans la mesure où l’entrée l’était. C’est un choix de conception légitime pour un outil destiné à vos propres fichiers, et c’est le mauvais outil pour ceux de quelqu’un d’autre. [Les vecteurs, les listes d’autorisation et l’endroit où le filtrage doit avoir lieu](/blog/sanitising-markdown-safely) constituent la version longue de ce test.

Pendant que le fichier est ouvert dans l’éditeur, cherchez-y aussi `http`. Chaque URL externe présente dans un document exporté est une requête que le navigateur du destinataire effectuera à l’ouverture, ce qui indique à l’autre bout que le fichier a été ouvert, quand, et approximativement d’où. Un export autonome a ses styles et ses polices en ligne et ne demande rien au réseau, une propriété qu’il vaut mieux confirmer que supposer — la différence entre [un fichier et un lien](/blog/share-a-markdown-document-as-a-link) tient largement à cela.

Une dernière chose sur la sortie, parce qu’elle contredit une intuition : un convertisseur qui a tourné entièrement sur votre machine peut tout de même vous remettre un fichier dangereux. La conversion locale protège la confidentialité de votre document. Elle ne fait rien quant au contenu, et un fichier HTML ouvert depuis votre propre disque exécute son JavaScript malgré tout. Un script dans un fichier local peut atteindre le réseau en construisant une URL d’image : « ça n’a jamais quitté mon portable » et « c’est sans danger à ouvrir » sont donc deux affirmations sans rapport.

## Les trois familles de convertisseurs, et à quoi chacune sert

### Côté navigateur — pour tout ce qui n’est pas déjà public

Un convertisseur côté navigateur vous expédie l’analyseur. La page charge du JavaScript, ce JavaScript lit le fichier que vous avez choisi dans le sélecteur, le convertit en mémoire, et vous propose le résultat en téléchargement. Aucune requête ne transporte le document, parce qu’aucune requête n’en a besoin.

| Avantages | Inconvénients |
| --- | --- |
| Rien n’est téléversé, et vous pouvez le prouver en débranchant le câble réseau | L’affirmation repose sur du code que vous n’avez pas lu, vérifié par observation à un instant donné |
| Pas de politique de conservation, puisqu’il n’y a aucune copie à conserver | Les scripts tiers de la même page partagent l’origine et l’accès |
| Pas de compte, pas d’installation, pas d’autorisation à obtenir | La machine est le plafond : un fichier très volumineux épuisera l’onglet |
| Les conditions ne peuvent pas dire grand-chose d’un contenu qui n’arrive jamais | Les formats qui exigent une analyse lourde s’en sortent moins bien qu’avec un serveur |

**Pour qui ?** Pour quiconque convertit un document qui n’est pas déjà public et n’exige pas une installation pour se justifier : une clause de contrat, un projet d’annonce, un compte rendu d’incident, un CV, le fichier d’un client que vous n’avez pas le droit d’envoyer où que ce soit. C’est aussi le choix par défaut correct pour les gens qui veulent pouvoir démontrer la réponse plutôt que la citer, parce que la démonstration est un panneau réseau où il n’y a rien.

**Ce que cela ne règle pas.** L’assainissement est une décision distincte, prise par le même outil, et qu’il vaut la peine de vérifier séparément avec le test ci-dessus. De même pour le fait que la sortie soit un document complet ou un fragment — une question d’utilité plutôt que de sûreté, traitée en détail dans [le comparatif des convertisseurs](/blog/best-markdown-to-html-converters).

### Côté serveur — pour les formats et les volumes qu’un navigateur ne tient pas

Un convertisseur hébergé téléverse le fichier, le convertit sur son infrastructure, et vous donne la sortie ou un lien vers elle. C’est ce que la plupart des gens entendent par convertisseur en ligne, et c’est le bon choix pour un ensemble réel de travaux.

| Avantages | Inconvénients |
| --- | --- |
| Prend en charge des formats qu’un navigateur analyse mal, y compris les vieux fichiers bureautiques et les PDF | Le document est divulgué au prestataire, par définition |
| Convertit des fichiers bien plus gros que ce qu’un onglet peut contenir | La conservation est une politique, c’est-à-dire une phrase que quelqu’un peut réécrire |
| Une API et une file d’attente : le travail peut être sans surveillance et reproductible | Les sous-traitants, les régions et les journaux allongent la liste des parties prenantes |
| Quelqu’un d’autre entretient les analyseurs, les polices et les correctifs | Un résultat livré sous forme d’URL est un identifiant que l’on peut transférer |

**Pour qui ?** Pour les documents publics, la documentation publiée, les textes marketing, tout ce qui est déjà sur le web ouvert, et toute chaîne de traitement où la conversion doit se faire sans personne dans un onglet. C’est aussi la réponse pragmatique quand le format source est réellement difficile, ce qui est souvent le cas en sortie d’une suite bureautique — les arbitrages propres à cette direction sont exposés dans [ce qu’un fichier Word perd sur le chemin du Markdown](/blog/convert-docx-to-markdown).

**Les conditions qui rendent ce choix défendable.** Une durée de conservation annoncée, avec un chiffre dedans. Une liste de sous-traitants que vous pouvez lire. Une licence de contenu limitée par sa finalité. Une région que vous pouvez choisir, si vous avez une obligation en matière de transferts. Un accord de sous-traitance, si vous traitez des données personnelles d’autrui. Et un mécanisme de livraison des résultats qui ne soit pas une URL devinable. Un service qui offre les six est un prestataire raisonnable. Un service qui n’en offre aucun n’est pas moins cher ; il est non documenté, et [les différences de conservation et de décompte entre les services connus](/blog/best-online-document-converters) constituent le vrai comparatif.

### Hors ligne — pour le travail réglementé et les chaînes reproductibles

Un convertisseur hors ligne est un logiciel sur votre machine : un outil en ligne de commande, une application de bureau, une bibliothèque dans un build. Le réseau n’intervient plus après l’installation.

| Avantages | Inconvénients |
| --- | --- |
| Pas de téléversement, pas de conservation, pas de tiers, aucune politique à lire | Une installation, des mises à jour, et une chaîne d’approvisionnement de paquets à laquelle se fier |
| Tourne dans un environnement isolé ou homologué | S’exécute avec l’accès de votre utilisateur à tous les fichiers que vous possédez |
| Scriptable : cent fichiers coûtent autant qu’un seul | La dérive de version entre machines produit des sorties différentes |
| Auditable : le binaire et ses entrées sont à vous | Toujours pas d’assainissement, sauf si l’outil le fait ou si vous l’ajoutez |

**Pour qui ?** Pour le travail réglementé et contractuel où un contrôle documenté compte plus que le confort, pour la conversion en masse, et pour tout ce qui doit tourner de la même façon à chaque fois dans une chaîne de traitement. C’est la seule option sur une machine sans accès à internet, et l’option naturelle dès que la conversion se répète assez souvent pour qu’une personne ouvrant un onglet devienne le maillon lent.

**Le coût que les gens sous-estiment.** Ajouter une dépendance, c’est ajouter un fournisseur. Un convertisseur tiré d’un registre de paquets amène ses dépendances transitives avec lui, et chacune d’elles s’exécute avec le même accès que votre shell. Pesez cela honnêtement face au téléversement que vous évitiez, surtout pour un travail ponctuel sur un seul fichier, où l’installation est le changement le plus lourd apporté à votre machine.

## Quand un téléversement est inacceptable

Pour la plupart des documents, c’est une préférence. Pour certains, ce n’est pas du tout une question d’appréciation, parce que le téléversement est lui-même l’événement : à l’instant où le fichier atteint un tiers, quelque chose a été divulgué, et aucune politique de conservation ne le défait.

| Document | Pourquoi le téléversement est le problème | Que faire à la place |
| --- | --- | --- |
| Contrats non signés, term sheets, offres | Des noms, des prix et des positions divulgués à une partie étrangère à l’accord | Côté navigateur, ou un outil hors ligne sur une machine que vous contrôlez |
| Informations de santé ou dossiers de patients | Traiter les données de santé d’autrui exige une base légale et un accord, pas un formulaire web | Hors ligne, à l’intérieur de l’environnement homologué |
| Données personnelles de personnes identifiables | Vous devenez responsable d’un sous-traitant que vous n’avez pas évalué, et peut-être d’un transfert | Côté navigateur, ou un service hébergé avec un accord signé |
| Identifiants, jetons, clés privées, exemples de `.env` | Le secret est désormais partagé, quoi qu’il advienne du fichier | Côté navigateur ou hors ligne, et faites tourner le secret s’il est déjà parti |
| Résultats financiers, chiffres ou acquisitions non annoncés | De la matière sensible pour le marché remise à un tiers non évalué | Hors ligne, sous les mêmes contrôles que le reste de cette matière |
| Travail client sous un NDA listant les sous-traitants autorisés | Un téléversement vers une partie non listée peut violer l’accord directement | Côté navigateur ou hors ligne, et vérifiez la liste avant de choisir |
| Revues de sécurité, post-mortems, notes d’architecture | Noms d’hôtes, versions et faiblesses connues sont exactement les parties utiles | Hors ligne, ou côté navigateur sur une page sans aucun script tiers |
| Dossiers RH, notes disciplinaires, listes de licenciement | Sensible pour des personnes qui n’ont pas consenti, et le seul nom de fichier peut divulguer | Côté navigateur ou hors ligne ; renommez avant de toucher au moindre outil |

Trois de ces lignes méritent une phrase de plus.

**Le cas des identifiants est de loin le plus fréquent.** Le Markdown des développeurs est plein d’exemples de configuration, et les exemples de configuration sont pleins de choses qui ressemblent à des valeurs fictives et qui, de temps en temps, n’en sont pas. Si un fichier contenant un jeton actif est parti vers un convertisseur hébergé, la bonne réaction n’est pas de vérifier la politique de conservation ; c’est de faire tourner le jeton. La conservation décrit quand une copie est supprimée, pas qui l’a lue avant.

**Le nom de fichier est une donnée.** Les gens protègent les contenus et collent les noms sans y penser. `licenciements-t3-final.md`, `patient-4412-notes.md` et `acquisition-northwind.md` divulguent chacun la partie intéressante avant même que le fichier ne soit analysé, et les noms de fichiers finissent dans les journaux, dans les événements d’analytique et dans les tickets de support bien plus souvent que les contenus.

**Lisez l’accord, pas votre appétence au risque.** Une grande partie du travail client relève de conditions qui précisent quels tiers peuvent traiter la matière. Là où cette liste existe, la question cesse d’être une question de probabilité. Soit le convertisseur est sur la liste, soit le téléversement est un manquement, et c’est une question bien plus facile à trancher que celle de savoir si le prestataire est digne de confiance.

## Là où la réponse évidente échoue, et ce qu’elle coûte

« Prenez un convertisseur côté navigateur » est le bon choix par défaut, et ce n’est pas une réponse complète. Quatre choses clochent si on la traite comme telle.

**C’est une affirmation, vérifiée une fois.** Un panneau réseau vide est une vraie preuve concernant le code qui tournait au moment où vous avez regardé. Un déploiement la semaine suivante peut changer cela, et personne ne revérifie. La conversion côté navigateur est vérifiable d’une manière dont une promesse côté serveur ne l’est pas — c’est une propriété réelle et rare —, mais vérifiable n’est pas vérifié, et la vérification a une date de péremption. Pour un travail où cela compte vraiment, refaites le test hors ligne de temps en temps, et préférez un outil où le fait de fonctionner réseau coupé est une propriété voulue plutôt qu’un accident.

**L’origine est partagée.** Un convertisseur côté navigateur n’est pas un bac à sable vis-à-vis de sa propre page. Tout script que la page charge — analytique, gestionnaire de balises, widget d’assistance, publicité — s’exécute avec un accès complet au modèle objet du document, et donc à tout ce que le convertisseur a en mémoire. C’est le mode de défaillance le plus susceptible de mordre en pratique, parce qu’il n’exige pas que les auteurs du convertisseur soient malhonnêtes, seulement qu’ils aient ajouté un prestataire. Comptez les tiers dans le panneau réseau ; un convertisseur qui n’en a aucun fait une affirmation plus forte que celui qui en a cinq.

**Cela ne vous donne rien à montrer à un auditeur.** C’est le coût qui prend les gens de court. S’il faut prouver comment un document a été traité, « il a été converti localement dans un navigateur et rien n’a été téléversé » est une affirmation vraie sans aucune pièce derrière. Un sous-traitant hébergé avec un accord de sous-traitance, une région nommée, un calendrier de conservation et des journaux d’accès est, du point de vue de la conformité, un contrôle mieux documenté qu’une affirmation dont personne ne peut produire la trace. Parfois la bonne réponse est le téléversement, précisément parce qu’il vient avec de la paperasse.

**Se connecter change le modèle, et cela mérite d’être dit clairement.** Un convertisseur côté navigateur qui propose aussi des comptes, un historique et du partage, ce sont deux produits. Déconnecté, le fichier reste sur votre machine. À l’instant où vous enregistrez un document dans un compte, il est stocké sur un serveur, et tout ce qui figure dans la ligne « côté serveur » du tableau ci-dessus s’y applique : conservation, région, sous-traitants, et un lien qui est un identifiant. Les limites changent généralement aussi. Sur ce site, la conversion est plafonnée à 10 Mo, tandis qu’un document conservé dans un compte est plafonné à 4 Mo, parce que la fonction qui le sert refuse une requête ou un corps de réponse au-delà de 4,5 Mo. Ces chiffres relèvent d’une contrainte d’hébergement plutôt que d’une politique, et ils rappellent utilement qu’un document stocké n’est pas la même chose qu’un document converti.

Il y a aussi un échec plus modeste qui mérite d’être nommé. Les outils côté navigateur sont plus faibles sur les formats qui exigent un vrai travail d’analyse — vieux fichiers bureautiques binaires, PDF dont la structure doit être déduite, tableurs avec des formules. Insister sur une conversion locale pour ceux-là produit une mauvaise conversion, et une mauvaise conversion qu’il faut ensuite reprendre à la main a son propre coût. Mieux vaut connaître la limite que se disputer avec elle.

## Les vérifications, dans l’ordre

1. **Décidez de ce que donnerait le document en cas de fuite avant même de comparer le moindre outil.** S’il est contractuel, réglementé, sensible pour le marché ou appartient à quelqu’un d’autre, la conversion doit avoir lieu sur votre machine, et tout le marché hébergé est hors sujet tant que ce point n’est pas tranché — ce qui vous épargne la lecture de grilles tarifaires que vous n’achèterez jamais.
2. **Convertissez un fichier de test avec le panneau réseau ouvert, puis une seconde fois réseau coupé.** Que rien n’apparaisse dans le panneau et que la conversion fonctionne encore hors ligne est la seule preuve positive dont vous disposiez ; si elle cesse de fonctionner hors ligne, le fichier partait quelque part, quoi qu’ait laissé entendre la page d’accueil.
3. **Comptez les scripts tiers sur la page.** Chacun s’exécute dans l’origine du convertisseur avec accès à votre document : une page qui embarque plusieurs prestataires a donc une frontière de confiance plus large que ce que décrit sa politique de confidentialité, et aucune quantité de traitement local ne la resserre.
4. **Trouvez la phrase sur la conservation et regardez si elle contient un chiffre.** Une durée annoncée est une politique que vous pouvez opposer à quelqu’un ; des assurances sans durée signifient que le délai est inconnu, et un délai inconnu doit être traité comme indéfini.
5. **Cherchez dans les conditions une licence de contenu et lisez ses quatre qualificatifs — finalité, durée, sous-licence, amélioration.** Une licence limitée par sa finalité et qui s’éteint avec votre contenu est ordinaire ; une licence perpétuelle et sous-licenciable est une décision que vous n’avez peut-être pas le droit de prendre au nom d’un client.
6. **Testez l’assainisseur avec un document contenant une balise de script et un gestionnaire `onerror`.** Si ceux-là survivent jusqu’à la sortie, le convertisseur n’est sûr que dans la mesure où son entrée l’était, ce qui convient pour vos propres fichiers et ne convient pas pour ce qui vient de l’extérieur.
7. **Ouvrez le fichier exporté dans un éditeur de texte et cherchez-y `http`.** Chaque URL externe est une requête que le navigateur du destinataire effectuera, ce qui signale en retour que le document a été ouvert ; un export autonome n’en a aucune et se comporte de la même façon dans un train qu’à votre bureau.
8. **Notez quel convertisseur vous avez approuvé, pour quelle classe de documents, et quand vous l’avez vérifié pour la dernière fois.** Deux lignes dans un document d’équipe évitent l’échec le plus courant, qui n’est pas de mal choisir mais de bien choisir une fois et de ne jamais remarquer ensuite que l’outil, les conditions ou le travail ont changé.

## Conclusion

Sûr n’est pas quelque chose qu’un convertisseur est ; c’est quelque chose que vous pouvez établir à propos d’un convertisseur en dix minutes, pour un document donné, et les vérifications sont assez ternes pour qu’il suffise de les écrire une fois pour couvrir toute une équipe. L’essentiel, c’est que la réponse la plus solide est observable plutôt que promise : un convertisseur qui fait le travail dans votre navigateur n’a aucune copie de votre fichier à garder, aucune politique à laquelle vous devriez vous fier, et aucune histoire à raconter en cas de compromission, et vous pouvez confirmer les trois en coupant le réseau et en le regardant continuer. C’est ce que fait [la conversion Markdown vers HTML de TransformPipe](/) — déconnecté, le fichier est lu et converti sur votre propre machine, rien n’est téléversé, et le HTML brut de votre document passe par un assainisseur avant d’atteindre la page. Quand le format exige réellement un serveur, choisissez le service hébergé sur sa phrase de conservation et sa liste de sous-traitants plutôt que sur son nombre de formats, et quand le travail se répète, installez quelque chose et cessez de reposer la question chaque semaine. Ce qu’il ne faut pas faire, c’est convertir un contrat dans un onglet parce que la page était rapide et le cadenas vert.

## FAQ

### Est-il sûr d’utiliser un convertisseur Markdown vers HTML en ligne ?

Cela dépend du fait que le convertisseur téléverse ou non le fichier, et c’est vérifiable plutôt qu’une affaire de confiance : ouvrez le panneau réseau du navigateur, convertissez un document de test, et regardez si quelque chose part. Un convertisseur qui tourne dans votre navigateur traite le fichier sur votre propre machine et n’a rien à conserver, ce qui en fait un choix par défaut raisonnable pour les documents qui ne sont pas déjà publics. Un convertisseur hébergé convient pour la matière publique et pour les formats qu’un navigateur ne sait pas analyser, à condition d’avoir lu son énoncé de conservation.

### Un convertisseur qui tourne dans le navigateur ne téléverse-t-il vraiment pas mon fichier ?

Vous pouvez le tester plutôt que le croire. Chargez la page, déconnectez-vous du réseau, et convertissez : si la conversion fonctionne encore, l’analyseur tourne localement, puisqu’il n’y avait nulle part où envoyer le fichier. Surveillez aussi le panneau réseau pendant une conversion normale, et notez combien de scripts tiers la page charge, puisque chacun d’eux partage l’accès de la page à votre document.

### Combien de temps les convertisseurs en ligne gardent-ils mes documents ?

Les services hébergés honnêtes annoncent un délai — supprimé après traitement, supprimé après un nombre d’heures fixe, ou gardé jusqu’à ce que vous le supprimiez — et ce délai est généralement court. Deux détails passent à la trappe : une conversion en échec est souvent gardée plus longtemps qu’une conversion réussie pour que le support puisse enquêter, et les énoncés de conservation couvrent d’ordinaire le fichier et non les journaux, où vivent les noms de fichiers et les horodatages. Si vous ne trouvez pas de phrase contenant une durée, considérez le délai comme inconnu.

### Les convertisseurs en ligne revendiquent-ils la propriété de mon contenu ?

Presque jamais la propriété, mais la plupart des conditions comportent une licence, parce qu’un service qui stocke un fichier et le restitue a besoin de l’autorisation de le stocker et de le restituer. Lisez cette clause en cherchant quatre qualificatifs : est-elle limitée à la fourniture du service, prend-elle fin quand vous supprimez votre contenu, peut-elle être sous-licenciée, et s’étend-elle à l’amélioration du service ou à l’entraînement de modèles ? Une licence limitée par sa finalité et qui expire avec votre contenu est ordinaire ; une licence perpétuelle et sous-licenciable mérite un second regard, surtout si le document appartient à un client.

### HTTPS suffit-il à rendre un convertisseur sûr ?

Non. HTTPS protège les octets pendant le transport et ne dit rien sur le fait qu’ils auraient dû être envoyés, sur ce que le serveur en fait, ni sur la durée pendant laquelle il les garde. Il ne peut pas non plus rendre une conversion côté serveur chiffrée de bout en bout, puisque le serveur doit lire le texte en clair pour le convertir. Traitez le cadenas comme une exigence minimale plutôt que comme la preuve de quoi que ce soit.

### J’ai déjà téléversé quelque chose de confidentiel. Que dois-je faire ?

Occupez-vous du contenu d’abord, pas de la politique. Si le fichier contenait un jeton, une clé ou un mot de passe, faites-le tourner maintenant, parce que la conservation vous dit quand une copie est supprimée et non qui l’a lue auparavant. Utilisez ensuite la suppression que le service propose, gardez une note de ce qui a été téléversé et quand au cas où vous auriez à le déclarer, et vérifiez si la matière relevait d’un accord limitant les tiers autorisés à la traiter.

### Un convertisseur hors ligne est-il toujours plus sûr qu’un convertisseur en ligne ?

Pas automatiquement. Il supprime le téléversement, la conservation et le tiers, et il ajoute une installation, un circuit de mises à jour et une chaîne d’approvisionnement de paquets qui s’exécute avec l’accès de votre utilisateur à tous les fichiers que vous possédez. Pour le travail réglementé, la conversion en masse et les chaînes reproductibles, c’est la bonne réponse. Pour un fichier unique sur une machine où vous préféreriez ne rien installer, une conversion côté navigateur est le changement le plus léger.
