---
title: "Comment juger un convertisseur Markdown en cinq minutes"
description: "Écrivez ce que votre situation exige, puis faites passer un document volontairement pénible aux candidats. Sept vérifications et une grille à recopier."
date: 2026-06-23
tag: Conversion
keywords: meilleur convertisseur markdown html, comparatif convertisseurs markdown, éditeur markdown en ligne, outil markdown gratuit, convertisseur markdown sans inscription, convertisseur markdown avec api, convertisseur markdown open source, comment choisir un convertisseur markdown, tester un convertisseur markdown
---

Les pages d’accueil des convertisseurs promettent à peu près la même chose : rapide, gratuit, HTML propre. Rien de tout cela n’est vérifiable depuis la page, et les différences qui vous coûteront un après-midi restent invisibles tant que vous n’avez rien collé dedans. Alors collez-y quelque chose. Un document et cinq vérifications séparent les outils qui tiennent de ceux qui vous surprendront une semaine plus tard.

### En bref

Écrivez ce que votre situation exige avant d’ouvrir le moindre outil : un document que vous envoyez à quelqu’un, un site de documentation, une saisie d’utilisateur rendue à l’intérieur d’une application, une étape d’intégration continue et une archive de long terme demandent des choses différentes, et l’outil qui convient à l’une ne convient pas à la suivante. Faites ensuite passer un document de test volontairement pénible à chaque candidat au cours de la même séance, et lisez la source HTML plutôt que l’aperçu. Cinq vérifications — quel dialecte il parle, ce qu’il fait d’une balise de script, si le fichier tient debout tout seul, où est parti votre fichier, et ce que disent réellement l’API et les limites — règlent l’essentiel en cinq minutes environ. Deux de plus, l’impression et les identifiants de titres, prennent trente secondes chacune et attrapent les récriminations qui arrivent un mois plus tard.

Si les listes de fonctionnalités n’aident pas, c’est que la liste de chaque convertisseur est la même liste. Tableaux, coloration du code, aperçu en direct, export. Ce qui les sépare est le comportement sous pression : un fichier contenant quelque chose que l’analyseur n’a jamais vu, un fichier écrit par quelqu’un d’autre, un fichier qui doit s’ouvrir sur une machine sans réseau. Rien de tout cela n’est sur la page, et rien de tout cela ne coûte cher à découvrir.

Ce texte parle des critères et du test. Si ce que vous voulez, ce sont les outils eux-mêmes alignés les uns contre les autres, [le comparatif fait l’objet d’un article séparé](/blog/best-markdown-to-html-converters) ; ce qui suit est la méthode que vous emploieriez pour vérifier n’importe lequel d’entre eux, y compris ceux ajoutés après sa rédaction.

## Les exigences d’abord : ce que votre situation demande vraiment

L’erreur la plus fréquente n’est pas de choisir le mauvais outil. C’est de choisir un outil avant d’avoir décidé ce qui doit être vrai. Cinq situations couvrent presque tout ce pour quoi les gens convertissent du Markdown, et chacune exige quelque chose que les autres peuvent ignorer complètement.

| La situation | Ce que vous devez exiger | Ce que vous pouvez ignorer sans risque | La vérification qui tranche |
| --- | --- | --- | --- |
| Un document à envoyer à quelqu’un | Un fichier HTML complet, styles en ligne et images embarquées, aucune requête externe, et le dialecte que votre fichier utilise déjà | Le nettoyage, puisque vous avez écrit le fichier ; une API ; la conversion en lot ; les ancres de titres | Téléchargez-le, coupez le réseau, ouvrez-le sur une autre machine |
| Un site de documentation | Des identifiants de titres stables, un dialecte conforme à ce que tapent vos auteurs, un build qui tourne sans surveillance et échoue bruyamment | Une sortie autonome — le site livre sa propre feuille de style — et la confidentialité de la source, qui est publique de toute façon | Construisez deux fois depuis la même entrée et comparez les deux sorties HTML |
| Une saisie d’utilisateur rendue dans une application | Un nettoyeur à liste d’autorisation, appliqué là où l’utilisateur ne peut pas l’atteindre, et un comportement par défaut documenté pour le HTML brut | Les documents autonomes, la mise en forme d’impression, les boutons de téléchargement, les thèmes | Collez les cinq vecteurs d’attaque ci-dessous et inspectez le DOM rendu |
| Une étape d’intégration continue | Aucune installation, ou une installation que vous épinglez ; un code de sortie qui veut dire quelque chose ; des limites de débit publiées ; un corps d’erreur analysable par un script | Une interface, un historique, le partage, le confort d’édition | Donnez-lui un fichier malformé et lisez le code de sortie et la sortie d’erreur |
| Une archive à rouvrir dans dix ans | Un fichier par document, aucune ressource externe, un format ouvert, et une licence qui vous laisse continuer à faire tourner l’outil | Une API, le partage, la vitesse, la synchronisation en ligne | Ouvrez aujourd’hui l’export de l’an dernier, hors ligne, dans un navigateur que vous n’utilisiez pas alors |

Lisez la deuxième colonne puis la troisième et le conflit saute aux yeux. L’outil qui gagne la première ligne — un convertisseur qui met tout en ligne dans un seul fichier lourd — convient mal à la deuxième, où intégrer la même feuille de style à quatre cents pages est du gaspillage. L’outil qui gagne la troisième ligne est une bibliothèque, pas un site web, et il n’a aucun bouton d’export parce qu’il n’a jamais été fait pour vous rendre un fichier.

Les cinq premières minutes ne se passent donc pas sur un outil. Elles se passent à écrire trois lignes : ce que la sortie doit être, qui a écrit l’entrée, et où la conversion doit s’exécuter. Tout le reste est de la vérification.

Une distinction de plus mérite d’être posée avant de commencer. Un convertisseur transforme un document en document. Un générateur transforme un répertoire en site. Si votre réponse à « où va la sortie ? » est une URL avec navigation, recherche et liens croisés, vous faites vos courses dans le mauvais rayon, et aucun test de convertisseur n’y changera rien.

## Le document de test

Il est volontairement pénible. Il porte du GitHub Flavored Markdown que le CommonMark nu ne reconnaît pas, cinq façons distinctes de faire entrer un script dans une page, une image absente, et une poignée de constructions qui séparent discrètement un analyseur soigneux d’un analyseur négligent.

````markdown
---
title: Converter test
draft: true
---

# Converter test

| Feature    | Status | Notes    |
| ---------- | :----: | -------- |
| Tables     |   ok   | GFM only |
| Task lists |   ok   | GFM only |

- [x] Ticked box
- [ ] Empty box
  - Nested item
    continued on a lazy line

~~Struck through~~, and a bare URL: https://example.com

A line that ends in two spaces,  
and the line that follows it.

A footnote reference.[^1]

[^1]: The footnote body.

```js
const clean = sanitise(rendered);
```

## A heading with punctuation & a "quote"

<script>alert('script tag')</script>

[A link](javascript:alert('href'))

<img src=x onerror="alert('handler')">

<iframe src="https://example.com"></iframe>

<svg onload="alert('svg')"><circle r="10" /></svg>

![Broken image](does-not-exist.png)

Unicode: an em dash — and a ligature: ﬁ
````

Collez-le, convertissez, et lisez le résultat — puis lisez la source HTML, pas seulement l’aperçu. Un aperçu peut sembler correct alors que le fichier derrière lui est un désastre, parce que l’aperçu est rendu par la page de l’outil, avec la feuille de style de l’outil, dans un navigateur qui a déjà chargé tout ce que l’outil charge.

Chaque ligne de ce document est là pour une raison. Voici ce que chacune interroge, et à quoi ressemble une réussite.

| La ligne | Ce qu’elle sonde | Une réussite ressemble à ceci |
| --- | --- | --- |
| Le bloc `---` en tête | Le traitement du front matter | Il disparaît, ou il devient un tableau. Un paragraphe de lignes `clé : valeur` en haut de votre document est un échec |
| `# Converter test` | Si l’outil suppose un titre | Soit un `<h1>`, soit le titre remonté dans `<title>`. Les deux se défendent ; le supprimer en silence, non |
| Le tableau à barres verticales | Les tableaux GFM | Un vrai `<table>` avec des cellules `<th>` et la colonne centrale alignée |
| `- [x]` et `- [ ]` | Les listes de tâches GFM | `<input type="checkbox" disabled>` dans les éléments de liste, pas des crochets littéraux |
| L’élément imbriqué continué paresseusement | L’analyse des listes sous pression | Un seul `<li>` imbriqué dont le texte se poursuit. Deux éléments distincts sont un échec |
| `~~Struck through~~` | Le barré GFM | Un élément `<del>` ou `<s>`, pas des tildes visibles |
| L’URL nue | Les liens automatiques GFM | Un `<a href>`. Du texte brut est le comportement CommonMark, pas un bug |
| Deux espaces en fin de ligne | Les sauts de ligne forcés | Un `<br>` entre les deux lignes |
| `[^1]` et son corps | Les notes, absentes des deux spécifications | Un lien en exposant et une liste en pied, ou le `[^1]` brut laissé visible. Une suppression silencieuse perd votre texte |
| La clôture `js` | Le code délimité et les chaînes d’information | `<pre><code class="language-js">`, avec le code échappé |
| Le titre avec `&` et des guillemets | L’échappement, et les identifiants de titres | `&amp;` dans la sortie, et idéalement un `id` vers lequel pointer |
| `<script>` | Le passage du HTML brut | Échappé, ou supprimé. Présent et intact est un échec |
| Le `href` en `javascript:` | Le filtrage des schémas d’URL | Le `href` disparu, ou réécrit. Un lien `javascript:` actif est un échec |
| `onerror=` sur une image | Le filtrage des attributs | L’attribut retiré. L’image peut rester ; le gestionnaire, non |
| `<iframe>` | Les documents embarqués | Supprimé, ou échappé. Une iframe dans un document que vous envoyez, c’est la page de quelqu’un d’autre dans la vôtre |
| `<svg onload>` | Le vecteur que l’on oublie | L’élément supprimé ou le gestionnaire retiré. SVG est du balisage, et le balisage porte des gestionnaires |
| L’image cassée | Le traitement des chemins | Le `src` recopié tel quel, ou le fichier embarqué. L’un ou l’autre convient, tant que vous savez lequel |
| Le tiret cadratin et la ligature | L’encodage | Les deux caractères intacts, avec un `<meta charset>` dans l’en-tête. Du charabia ici veut dire du charabia partout |

Dix-huit lignes, un seul collage. Gardez le fichier : il est court, il a sa place à côté de votre documentation, et le rejouer prend une minute quand un outil change de nettoyeur ou de feuille de style.

## Vérification numéro un : quel dialecte il parle

Regardez d’abord le tableau et les deux cases à cocher. Si le tableau est ressorti en paragraphe de barres verticales et les cases en crochets littéraux, le convertisseur applique du CommonMark nu ou presque. Ce n’est pas un bug : tableaux et listes de tâches sont des extensions de GitHub Flavored Markdown, et [les dialectes diffèrent réellement](/blog/commonmark-gfm-and-the-flavours) dans ce qu’ils reconnaissent.

Cela ne compte que si vos documents utilisent ces fonctions. Un README avec un tableau comparatif et une feuille de route à cocher utilise les deux. Le barré et l’URL nue sont aussi des extensions GFM : vérifiez donc les quatre d’un seul coup.

Voici les constructions qui séparent les deux dialectes, et à quoi ressemble chaque échec sur la page plutôt que dans la spécification.

| Construction | Écrite comme | CommonMark | GFM | Ce que vous voyez quand elle manque |
| --- | --- | --- | --- | --- |
| Tableaux | Barres verticales et une ligne de séparation | Non | Oui | Un paragraphe de barres et de tirets, replié par le navigateur |
| Listes de tâches | `- [x]` au début d’un élément | Non | Oui | Des `[x]` et `[ ]` littéraux comme premiers caractères de chaque puce |
| Barré | `~~texte~~` | Non | Oui | Des tildes visibles autour des mots |
| Liens automatiques | Une URL `https://` nue | Non | Oui | L’URL en texte brut, non cliquable |
| Code délimité | Triples accents graves | Oui | Oui | Rien — les deux le gèrent |
| Chaînes d’information | Un nom de langage après la clôture | Oui | Oui | La classe peut différer ; cherchez `language-js` |
| Notes de bas de page | `[^1]` et une définition | Non | Non | Un `[^1]` brut dans le texte, ou un paragraphe silencieusement absent |
| Identifiants de titres | Rien — ils sont déduits | Non | Ajoutés par le moteur de rendu, pas par l’analyseur | Des titres sans `id`, et donc sans ancre |
| HTML brut | Une balise HTML dans la source | Transmis | Transmis, filtré par GitHub | Dépend entièrement de l’outil ; voir la vérification suivante |
| Sauts de ligne | Deux espaces en fin de ligne | Oui | Oui | Les deux lignes se rejoignent si l’outil coupe d’abord les espaces |

Deux choses découlent de ce tableau. Les notes de bas de page ne sont dans aucune des deux spécifications : tout outil qui les prend en charge le fait en extension, et tout outil qui ne le fait pas risque de supprimer le texte plutôt que de laisser le marqueur — vérifiez la référence et le corps séparément. Et les identifiants de titres ne relèvent pas du tout de l’analyse : GitHub les ajoute au moment du rendu, ce qui explique qu’une ancre de titre qui fonctionne sur github.com puisse tout simplement ne pas exister dans le HTML produit par votre convertisseur.

Si vos documents vivent sur GitHub et s’y affichent correctement, le GFM est votre exigence et un outil limité à CommonMark perdra quatre choses en silence. Si vos documents sont de la prose avec des titres et des liens, le CommonMark nu suffit et la question du dialecte est réglée en dix secondes.

## Vérification numéro deux : ce qu’il fait de la balise de script

Markdown autorise le HTML brut, et la plupart des analyseurs le transmettent directement à la sortie ; quelques-uns l’échappent par défaut et ne le laissent passer que sur demande. Dans un cas comme dans l’autre, le nettoyage est une décision distincte prise par l’outil, avec trois issues possibles.

| Issue dans la source HTML | Ce que cela veut dire |
| --- | --- |
| `&lt;script&gt;` et la balise visible dans la page | Le HTML brut est échappé. Sans danger, et parfait pour vos propres fichiers |
| Aucune trace du script, du `onerror` ni du `href` en `javascript:` | Un nettoyeur a tourné contre une liste d’autorisation |
| `<script>` intact, ou `onerror=` toujours sur l’image | Rien ne l’a filtré |

La troisième issue ne mord que lorsque le Markdown vient d’ailleurs que de votre propre machine : la description d’une pull request, un ticket de support, la sortie d’un modèle de langage. Dans le test, la boîte d’alerte est inoffensive ; avec le Markdown d’un inconnu, elle ne l’est pas, et elle s’exécute sur la page où vous collez le résultat.

Ne vous contentez pas de tester un seul vecteur. Un outil peut retirer `<script>` et rater tout le reste, parce que supprimer une balise par son nom est facile et raisonner sur les attributs et les schémas d’URL ne l’est pas. Cherchez chacun de ces éléments dans la sortie, l’un après l’autre.

| Vecteur | Ce qu’il fait s’il survit | Ce que rend un outil sûr |
| --- | --- | --- |
| `<script>alert('script tag')</script>` | Exécute du code arbitraire dès le chargement de la page | L’élément entièrement disparu, ou le tout échappé en texte `&lt;script&gt;` |
| `<img src=x onerror="alert('handler')">` | Exécute du code quand l’image volontairement cassée échoue à charger, c’est-à-dire tout de suite | Le `<img>` peut rester ; `onerror` en est retiré. Tout attribut `on*` est un gestionnaire |
| `[A link](javascript:alert('href'))` | Exécute du code quand le lecteur clique sur ce qui ressemble à un lien ordinaire | Le `href` supprimé, vidé ou réécrit. Les schémas autorisés sont généralement `http`, `https`, `mailto` et `#` |
| `<iframe src="https://example.com"></iframe>` | Charge la page d’un tiers dans la vôtre, avec ses scripts et ses cookies | L’élément supprimé. Une iframe est rarement nécessaire à un document Markdown |
| `<svg onload="alert('svg')">…</svg>` | Exécute du code par un balisage que l’on oublie être du balisage. SVG peut aussi porter son propre `<script>` | L’élément supprimé, ou le gestionnaire et tout script imbriqué retirés |

Un outil qui supprime les cinq applique une liste d’autorisation : il garde les éléments et attributs qu’il connaît et jette tout le reste. Un outil qui en supprime certains et pas d’autres applique une liste d’interdiction, position perdue d’avance — la liste des choses dangereuses s’allonge, celle des choses sûres non. [Les détails d’un nettoyage bien fait](/blog/sanitising-markdown-safely) comptent même si vous n’écrivez jamais de nettoyeur vous-même, parce qu’ils vous disent auquel des deux vous avez affaire.

Une chose de plus à vérifier tant que vous y êtes : où se fait le nettoyage. Un convertisseur qui nettoie dans le navigateur et pas sur le serveur a protégé son propre aperçu et rien d’autre, puisqu’un script peut interroger directement le point d’entrée et contourner la page. Si l’outil a une API, faites-y passer les mêmes vecteurs et comparez les deux sorties.

## Vérification numéro trois : si la sortie tient debout toute seule

Téléchargez le fichier, coupez votre réseau, et ouvrez-le. Puis cherchez dans la source `<link`, `<script` et `http`.

Un simple fragment vous donne des `<h1>` et des `<p>` et rien d’autre : du HTML correct, qui s’ouvre en texte sans style. Un document complet qui va chercher sa feuille de style ou son coloriseur sur un CDN a bonne allure aujourd’hui et casse dans un avion, sur un intranet, ou le jour où le CDN déménage. Un fichier autonome porte ses styles en ligne, sans scripts et sans requêtes. C’est celui-là que vous pouvez envoyer par courriel.

Les recherches valent la peine d’être faites une à une, parce que chacune répond à une question différente.

| Cherchez dans la source | Si vous le trouvez | Ce que cela vous coûte |
| --- | --- | --- |
| `<!DOCTYPE` | Bien — c’est un document, pas un fragment | Sans lui, vous avez `<h1>…</h1><p>…</p>` et un navigateur qui rend à sa largeur par défaut |
| `<meta charset` | Bien — l’encodage est déclaré | Sans lui, le tiret cadratin et la ligature deviennent du charabia sur la machine d’un autre |
| `<link rel="stylesheet"` | Les styles vivent ailleurs | Le fichier est sans style dès que cet ailleurs devient injoignable |
| `<style>` | Bien — les styles sont dans le fichier | Rien ; c’est ce que vous voulez pour un document que vous envoyez |
| `<script` | Quelque chose veut s’exécuter | Au mieux un coloriseur, au pire un traceur. Dans tous les cas le fichier n’est plus inerte |
| `http://` ou `https://` dans un `src` ou un `href` | Une ressource est récupérée à l’ouverture du fichier | Des polices, des images et des coloriseurs qui s’évaporent hors ligne, et une trace de l’ouverture du fichier |
| `data:image` | Une image est embarquée dans le fichier | Un fichier plus gros, et un fichier qui s’ouvre partout. C’est en général le marché que vous voulez |

[Ce que « autonome » veut vraiment dire](/blog/self-contained-html-explained) mérite d’être lu avant d’en faire une exigence, parce que les outils emploient l’expression avec largesse : certains veulent dire « un document complet » et d’autres « ne demande rien au réseau », et seul le second survit à l’avion.

L’image manquante est dans le test pour la même raison. Un convertisseur recopie le `src` d’une image tel quel, sauf si vous lui demandez d’embarquer le fichier : un chemin relatif se résout donc par rapport à l’endroit où atterrit le HTML, pas à celui où vivait le Markdown. Déplacez le HTML d’un répertoire vers le haut et toutes les images relatives cassent — sans erreur, sans avertissement, et généralement sans que personne ne le remarque avant que le destinataire n’en parle.

## Vérification numéro quatre : où va votre fichier, et s’il y reste

Ouvrez l’onglet réseau du navigateur avant de convertir. Ou bien le fichier est téléversé, ou bien il ne l’est pas, et la liste des requêtes tranche. Une conversion dans le navigateur veut dire que le document ne quitte jamais votre machine ; cela veut dire aussi qu’il n’y aura rien à retrouver demain.

C’est la vérification qu’il vaut le plus la peine de faire plutôt que de croire, parce que c’est celle sur laquelle tous les outils font la même promesse. Quatre étapes, dans l’ordre, aucune de plus d’une minute.

1. **Surveillez l’onglet réseau.** Ouvrez-le, videz-le, convertissez le document de test, et lisez la liste. Une conversion qui a lieu sur votre machine ne montre aucune requête portant votre fichier. Une conversion qui téléverse montre un `POST` contenant votre contenu, et vous pouvez ouvrir cette requête et lire exactement ce qui a été envoyé.
2. **Convertissez réseau coupé.** Chargez la page, puis déconnectez-vous, puis convertissez. Un outil côté navigateur continue de fonctionner. Un outil côté serveur échoue, ce qui n’est pas un reproche : c’est une réponse, et une réponse définitive.
3. **Trouvez la phrase sur la rétention.** Pas le slogan sur la confidentialité : la phrase qui dit combien de temps un fichier téléversé est conservé et ce qui le supprime. Si la politique de confidentialité ne contient aucune durée, la lecture honnête est qu’il n’y a pas de politique.
4. **Lisez la clause de licence dans les conditions.** Beaucoup d’outils hébergés prennent une licence pour stocker et traiter ce que vous téléversez, dont ils ont besoin pour fonctionner. Ce qui compte est la portée : si elle prend fin quand vous supprimez le fichier, et si elle dépasse le simple fait de faire tourner le service.

[La question de savoir si un convertisseur en ligne est sûr](/blog/is-an-online-converter-safe) a une vraie réponse pour un outil donné, et cette réponse est en général visible en quinze minutes de lecture plus les deux tests ci-dessus.

Voilà le véritable arbitrage, et ce n’est pas la confidentialité contre le confort. Un outil sans compte ne peut pas tenir d’historique, ne peut pas vous donner un lien à envoyer, et ne peut pas proposer d’API. Un outil avec compte fait les trois et détient désormais vos documents. Si la réponse est « ni l’un ni l’autre, je veux cela dans un script », cessez d’évaluer des sites web et prenez une bibliothèque ou un convertisseur en ligne de commande ; et s’il vous faut du PDF, du DOCX ou du LaTeX en sortie, Pandoc convertit vers les trois et c’est un logiciel libre sous GPL (vérifié sur pandoc.org, le 9 septembre 2026) ; un convertisseur de navigateur qui vous rend un fichier HTML ne se bat pas pour ce poste.

Il existe une position intermédiaire qui mérite d’être connue : un outil qui convertit dans le navigateur tant que vous n’êtes pas connecté et ne stocke les documents que lorsque vous le demandez. Il vous donne par défaut la réponse de l’onglet réseau, et l’historique et le partage le jour où vous jugez le marché intéressant. L’important est que la décision soit la vôtre et qu’elle soit visible, plutôt que prise à votre place dans un paragraphe que vous n’avez pas lu.

## Vérification numéro cinq : l’API, les clés et les limites

Si un convertisseur propose une API, quatre questions la jugent, et la documentation devrait répondre aux quatre avant votre inscription :

- [ ] Une clé peut-elle être révoquée, et la révocation prend-elle effet immédiatement ?
- [ ] La clé est-elle stockée sous forme de hachage, ou le support pourrait-il vous la relire ?
- [ ] Quelle est la limite de débit, et à quoi ressemble la réponse quand vous la franchissez ?
- [ ] Que se passe-t-il quand le compte est plein — un refus d’écriture, ou la suppression silencieuse de quelque chose de plus ancien ?

La dernière est celle que l’on saute. Un outil qui jette votre plus vieux document pour faire de la place au nouveau a pris une décision au sujet de vos données, et vous l’apprenez au pire moment. Refuser l’écriture est le comportement honnête.

Avant tout cela, regardez la forme de la requête. Une API sur laquelle on peut bâtir est une API que l’on peut appeler avec `curl` et comprendre à partir de la seule réponse, sans SDK pour traduire.

```bash
# The shape to look for: one endpoint, a bearer key, the document as the body
curl -sS -X POST "https://api.example.com/v1/documents?name=README.md" \
     -H "Authorization: Bearer <key>" \
     --data-binary @README.md

# And the refusal you can act on: a status that means something, and a body a script can parse
# HTTP/1.1 413
# { "error": "document is over 4 MB" }
```

Trois choses méritent d’être exigées dans cet échange. La clé voyage dans un en-tête plutôt que dans une chaîne de requête, si bien qu’elle n’atterrit ni dans les journaux du serveur ni dans l’historique du navigateur. Le corps est le document lui-même plutôt qu’une enveloppe JSON contenant le fichier encodé en base64, ce qui limite la taille et retire une étape d’encodage de votre script. Et l’échec est un code de statut plus un corps analysable, si bien qu’un job d’intégration continue peut distinguer « trop gros » de « trop vite » et de « pas à vous » sans lire d’anglais.

Poussez ensuite délibérément au-delà du chemin heureux. Envoyez un fichier au-dessus de la limite et lisez le statut. Envoyez vingt requêtes en une seconde et lisez le statut. Envoyez une mauvaise clé, puis une clé appartenant à un autre compte. Une API bien construite répond `413`, `429`, `401` et `404` dans ces quatre cas, avec un corps qui précise lequel ; une API mal construite répond quatre fois `500`, ou `200` avec un message d’erreur caché dans le HTML.

Les limites publiées sont l’autre moitié de la même question. Une limite que l’on peut lire est une limite autour de laquelle on peut concevoir ; une limite découverte en production est une panne. TransformPipe plafonne un compte à 100 Mo et 500 documents, une conversion à 10 Mo, un document conservé à 4 Mo et un appelant à 60 requêtes par minute ; atteindre une limite refuse l’écriture plutôt que de supprimer quoi que ce soit, et les points d’entrée, les statuts et le format des clés sont dans [la documentation](/docs). Le chiffre de 4 Mo est une contrainte de plateforme plutôt qu’une préférence — la fonction sous-jacente refuse une requête ou un corps de réponse de plus de 4,5 Mo — et c’est le genre de chose qu’il vaut mieux énoncer que taire, parce qu’elle vous dit la forme de ce sur quoi vous vous appuyez.

Si vous branchez la conversion dans un build ou un robot plutôt que de cliquer sur un bouton, [ce qu’il faut exiger d’une API de conversion de documents](/blog/converting-documents-with-an-api) va plus loin sur la forme des requêtes, le comportement des relances et les modes d’échec qui ne comptent que dans une chaîne automatisée.

## Deux vérifications de plus, et une grille pour noter les sept

Cinq vérifications couvrent les façons dont un convertisseur échoue bruyamment. Deux de plus couvrent celles dont il échoue en silence, et aucune ne prend plus de trente secondes.

**Ce que donne la sortie à l’impression.** Ouvrez l’aperçu avant impression. Un thème sombre qui reste sombre sur le papier gaspille une cartouche et rend le document illisible dans le seul format que les gens se passent encore de la main à la main en réunion. Vérifiez trois choses : si les couleurs basculent vers des valeurs claires, si les blocs de code se replient au lieu d’être coupés au bord de la page, et si l’URL des liens est imprimée à côté de leur libellé ou purement perdue. Un document de quatorze liens qui s’imprime en quatorze expressions soulignées a jeté l’essentiel de son contenu. TransformPipe écrit un fichier autonome unique, styles en ligne et sans scripts, et bascule vers des valeurs claires à l’impression ; quel que soit votre outil, regardez l’aperçu une fois avant de lui confier quelque chose que vous imprimerez.

**Si les titres portent des identifiants vers lesquels pointer.** Cherchez `id="` à côté d’un `<h2>` dans la sortie. Si les identifiants manquent, vous ne pouvez pas pointer vers une section, vous ne pouvez pas construire de sommaire sans écrire du JavaScript, et un collègue qui cite votre document doit dire « le passage sur les limites » au lieu d’envoyer une URL. Si les identifiants existent, vérifiez qu’ils dérivent du texte du titre plutôt que d’être `heading-3` : un identifiant positionnel change dès que quelqu’un insère une section au-dessus, ce qui casse tous les liens jamais envoyés. Le titre ponctué du document de test est là pour montrer comment l’identifiant est construit : un bon identifiant convertit le texte en slug, laisse tomber la ponctuation, et produit le même résultat à chaque conversion de ce titre.

Ces deux points comptent davantage pour de la documentation que pour un document ponctuel, ce qui est le thème de tout l’exercice. Les vérifications n’ont pas de poids universel, et un échec sur une ligne dont vous vous moquez n’est pas un échec.

Voici la grille. Recopiez-la, remplissez une colonne par candidat, et marquez chaque case réussite, échec ou sans objet.

| # | Vérification | Une réussite ressemble à | Outil A | Outil B |
| --- | --- | --- | --- | --- |
| 1 | Dialecte | Le tableau s’affiche, les cases sont des cases, le barré est barré, l’URL nue est un lien | | |
| 2 | Nettoyage | Les cinq vecteurs neutralisés, sur le serveur comme dans le navigateur | | |
| 3 | Autonomie | Doctype, charset, `<style>` en ligne, aucun `http` dans un `src` ou un `href` | | |
| 4 | Confidentialité | L’onglet réseau confirme la promesse, et une durée de rétention existe par écrit | | |
| 5 | API et limites | Clé en bearer, erreurs analysables, `413` et `429` là où il faut, limites publiées | | |
| 6 | Impression | Couleurs claires sur le papier, code replié, liens lisibles | | |
| 7 | Identifiants de titres | Un `id` sur chaque titre, dérivé du texte, stable d’une exécution à l’autre | | |
| — | Front matter | Supprimé ou rendu en tableau, pas en paragraphe de `clé : valeur` | | |
| — | Encodage | Tiret cadratin et ligature intacts, `<meta charset>` présent | | |
| — | Notes de bas de page | Rendues, ou laissées en marqueur visible. Pas supprimées en silence | | |

Les trois lignes sans numéro attrapent ceux qui convertissent des fichiers venus d’ailleurs : des notes exportées d’un outil de documentation, des documents écrits sur un autre système d’exploitation, de la prose universitaire. Notez-les si vos fichiers viennent d’autre part que de votre propre éditeur.

Pondérez les lignes avant de faire le total. Pour un document que vous envoyez à quelqu’un, les lignes trois et six valent plus que toutes les autres réunies, et la ligne deux n’a aucune importance. Pour une saisie d’utilisateur dans une application, la ligne deux est tout le test et les lignes trois et six ne s’appliquent pas. Une grille à poids égaux produit un chiffre bien net et le mauvais outil.

## Ce que cinq minutes ne peuvent pas vous dire

Un document de test est un bon instrument, et un instrument étroit. Il vous dit ce qu’un outil fait aujourd’hui, avec un fichier, dans votre navigateur. Trois choses qu’il ne peut pas dire sont les trois plus susceptibles de compter plus tard.

**Une note ne peut pas vous dire que vous notez la mauvaise catégorie d’outil.** Un générateur de site statique échoue à presque toutes les vérifications ci-dessus — il ne vous rend pas de fichier, il ne nettoie pas, il n’a pas d’API, et il veut un fichier de configuration et une étape de build — et il reste la bonne réponse si vous publiez quarante pages qui se renvoient les unes aux autres. La grille mesure la qualité d’un outil sur la tâche que vous lui avez donnée, et ne dit rien sur le fait que cette tâche était celle dont vous aviez besoin.

**Un test de cinq minutes ne peut pas vous dire ce que sera un outil dans un an.** Il ne voit ni un changement de propriétaire, ni l’apparition d’une page tarifaire, ni une API qui gagne un paramètre obligatoire, ni un mainteneur qui cesse de répondre. Ce qu’il voit, ce sont les propriétés qui prédisent ces choses. La licence en est une : une bibliothèque MIT ou BSD ne peut pas vous être reprise, parce que la copie que vous détenez vous reste licenciée quoi qu’il advienne. La propriété en est une autre : un projet open source indépendant, une entreprise avec un produit payant et un service hébergé gratuit sans modèle économique visible échouent différemment et à des rythmes différents, et c’est le troisième qui disparaît sans prévenir. La capacité à fonctionner hors ligne est la troisième : un outil qui tourne sur votre machine continue quand l’entreprise s’arrête, et un outil qui tourne sur le serveur de quelqu’un est exactement aussi durable que ce serveur.

**Un document de test ne peut pas vous dire ce que contiennent vos propres documents.** Le fichier ci-dessus est un échantillonneur ; vos vrais fichiers ont leurs propres habitudes — un tableau de cent lignes, une galerie de captures d’écran, un bloc de code dans un langage que personne ne colorise, un niveau de titre qui saute de deux à quatre. Faites passer aussi un vrai document, idéalement le plus gros et le plus laid que vous ayez. La moitié des problèmes que les gens rapportent au sujet des convertisseurs ne sont pas des problèmes de convertisseur : c’est un fichier inhabituel qu’on ne lui avait jamais montré.

### Les critères, dans l’ordre

1. **Décidez de la destination avant d’ouvrir un outil.** Une personne, un site, une application, une chaîne automatisée ou une archive — la réponse élimine aussitôt l’essentiel du marché, et sauter cette étape est la façon dont on finit par comparer un générateur de site à un convertisseur et par conclure que les deux déçoivent.
2. **Accordez le dialecte aux fichiers que vous avez vraiment.** Si vos documents contiennent des tableaux ou des listes de tâches, un analyseur limité à CommonMark les perd en silence, et vous l’apprenez quand un collègue demande pourquoi le tableau comparatif est un mur de barres verticales.
3. **Tranchez la question du nettoyage en demandant qui a écrit le fichier.** Pour vos propres notes, cela n’a aucune importance ; pour tout ce qui arrive de l’extérieur, ou bien le convertisseur nettoie contre une liste d’autorisation, ou bien c’est vous, et il n’y a pas de troisième option qui finisse bien.
4. **Exigez un document, pas un fragment.** Un convertisseur qui rend `<h1>…</h1><p>…</p>` s’est comporté correctement en bibliothèque et a échoué en tant qu’outil, et la différence se voit dès que quelqu’un d’autre que vous ouvre le fichier.
5. **Vérifiez la promesse de confidentialité au lieu de la lire.** L’onglet réseau répond en dix secondes à ce qu’une politique de confidentialité met une page à sous-entendre, et la réponse est soit « rien n’a été envoyé », soit « voici précisément ce qui a été envoyé ».
6. **Vérifiez les échecs, pas les réussites.** N’importe quoi convertit un paragraphe. Ce qui sépare les outils est la réponse à un fichier au-dessus de la limite, à un tableau malformé, à une mauvaise clé et à vingt requêtes en une seconde — et ce sont ces réponses que votre automatisation passera sa vie à gérer.
7. **Préférez la propriété qui survit au test.** Une licence permissive, du code que l’on peut exécuter hors ligne, un format de sortie ouvert et des limites publiées sont tous vérifiables aujourd’hui et tous encore vrais dans trois ans, ce qu’aucune liste de fonctionnalités ne peut prétendre.

Faites passer le document de test à l’outil que vous utilisez aujourd’hui et à celui que vous envisagez, dans la même séance : même entrée, deux sources à comparer. La plupart du temps, le sortant gagne une ligne et en perd une autre, et la grille transforme une préférence vague en une décision que vous pouvez expliquer à quelqu’un d’autre. Si la ligne que vous perdez est l’export autonome, [convertir le Markdown en HTML dans le navigateur](/) est la façon la plus courte d’y remédier, gratuitement et sans rien à installer ; si la ligne que vous perdez est le dialecte ou le nettoyage, le remède est en général une autre bibliothèque plutôt qu’un autre site. Dans tous les cas, gardez le fichier. Le prochain outil que vous évaluerez prendra cinq minutes au lieu d’un après-midi.

## FAQ

### Avec quoi tester un convertisseur Markdown ?

Avec un document volontairement pénible plutôt qu’un paragraphe de prose : un tableau GFM, des listes de tâches, du barré, une URL nue, un bloc de code délimité, du front matter, une note de bas de page et les cinq vecteurs d’attaque en HTML brut. Ajoutez-y un vrai fichier à vous, idéalement le plus long et le plus étrange que vous ayez, parce que vos documents ont des habitudes qu’aucun échantillonneur ne couvre.

### Comment savoir si un convertisseur nettoie ?

Convertissez un document contenant `<script>`, un attribut `onerror`, un lien `javascript:`, une `<iframe>` et un `<svg onload>`, puis lisez la source HTML plutôt que l’aperçu. Si les cinq ont disparu ou sont échappés, une liste d’autorisation a tourné ; si certains survivent, l’outil filtre par nom et ratera aussi le vecteur suivant.

### Est-ce grave si le convertisseur ne prend en charge que CommonMark ?

Seulement si vos fichiers utilisent les quatre choses que CommonMark laisse de côté : tableaux, listes de tâches, barré et liens automatiques sur URL nue. De la prose avec des titres, des listes, des liens et des blocs de code s’affiche à l’identique dans les deux cas : vérifiez donc vos propres documents avant de faire du dialecte un facteur décisif.

### Un convertisseur qui tourne dans le navigateur est-il toujours plus confidentiel ?

Il l’est dans le sens qui compte le plus : le fichier n’est pas transmis, et vous pouvez le confirmer dans l’onglet réseau en dix secondes. Il n’est pas automatiquement plus sûr à tous égards, car un outil côté navigateur affiche quand même le HTML que contient le document : la question du nettoyage reste distincte et s’applique tout autant.

### Comment vérifier un convertisseur sans rien installer ?

Ouvrez l’outil, ouvrez les outils de développement du navigateur, collez le document de test et convertissez. L’onglet réseau répond à la question de la confidentialité, le panneau des éléments à celle du nettoyage, et le fichier téléchargé à celle de l’autonomie — trois des sept vérifications, sans installation et sans compte.

### Que regarder dans l’API d’un convertisseur avant de bâtir dessus ?

Une clé envoyée en en-tête bearer plutôt qu’en paramètre de requête, une révocation à effet immédiat, des clés stockées sous forme de hachage, des limites de débit et de taille publiées, et des réponses d’erreur faites d’un code de statut significatif plus un corps analysable. Testez ensuite les refus délibérément, parce qu’une chaîne automatisée passe l’essentiel de sa vie sur le chemin malheureux.

### À quelle fréquence refaire le test ?

Chaque fois qu’un outil annonce un changement de son moteur de rendu, de son nettoyeur ou de sa feuille de style, et une fois par an de toute façon. Cela prend une minute une fois le fichier écrit, et le comportement d’un convertisseur qui change sous vos pieds est un événement normal plutôt qu’un scandale — vous voulez simplement être celui qui le remarque.
