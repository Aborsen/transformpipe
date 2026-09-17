---
title: "Convertir du HTML en Markdown : une méthode pour chaque point de départ"
description: "Convertir du HTML en Markdown depuis un fichier, un onglet, une chaîne dans du code ou un site entier, et pourquoi nettoyer l'habillage d'abord décide du résultat"
date: 2026-09-05
tag: Conversion
keywords: convertir html en markdown, html vers markdown, convertir un fichier html en markdown, page web en markdown, html vers markdown en ligne de commande, turndown, pandoc html markdown, nettoyer le html avant conversion
---

La plupart des modes d'emploi pour convertir du HTML en Markdown nomment un outil et s'arrêtent là. C'est pourquoi les résultats déçoivent. L'outil est la pièce interchangeable. Ce qui décide si vous obtenez un document lisible ou quatre cents lignes de listes de liens, c'est d'où venait le HTML et ce que vous en avez fait avant que le convertisseur ne tourne. Un fragment écrit à la main se convertit proprement avec n'importe quoi sur le marché. Une page enregistrée depuis un site d'actualités se convertit tout aussi proprement, et la sortie est inutilisable.

### En bref

Choisissez la méthode d'après l'endroit où se trouve le HTML, pas d'après la meilleure bibliothèque. Pour **un fichier sur le disque**, déposez-le dans un convertisseur côté navigateur ou lancez une commande Pandoc. Pour **une page que vous avez sous les yeux**, prenez une extension de capture ou sortez l'élément d'article par la console du navigateur, parce qu'une page enregistrée n'est majoritairement pas l'article. Pour **une chaîne dans du code**, prenez la bibliothèque de votre langage — Turndown en JavaScript, markdownify ou html2text en Python — et pour **un site entier**, faites un miroir, extrayez le contenu, puis convertissez, dans cet ordre. Titres, liens, listes, tableaux et code survivent au voyage ; la mise en page, les classes, les styles en ligne et les tableaux imbriqués, non, et aucune option ne les rétablit.

## Pourquoi la conversion est la moitié facile

Convertir du HTML en Markdown, c'est une commande. Produire du Markdown que vous montreriez à quelqu'un, c'est quatre étapes, et la commande est la dernière. Vous déterminez d'abord quels octets constituent le document. Vous amenez ensuite ces octets quelque part où un convertisseur peut les lire. Vous décidez ensuite du sort des constructions pour lesquelles le Markdown n'a pas de mots. Alors seulement vous convertissez. Sautez les trois premières et la quatrième réussit quand même — c'est le piège. Un convertisseur n'a aucun moyen de distinguer une bannière de cookies d'un paragraphe : il traduit donc les deux, correctement, et vous remet le résultat.

La deuxième étape attrape plus de monde qu'elle ne le devrait, parce que le HTML à votre écran et le HTML dans le fichier ne sont fréquemment pas le même document. `curl` et `wget` récupèrent ce que le serveur a envoyé. Si la page s'assemble en JavaScript ensuite — un site de documentation bâti sur un routeur côté client, une coquille d'application, tout ce qui se rend depuis une charge JSON — ce que le serveur a envoyé est un `<div>` vide et une balise de script. Convertissez cela et vous obtenez un fichier blanc, puis vous passez vingt minutes à soupçonner le convertisseur. Le DOM rendu ne vit que dans le navigateur, ce qui explique que « enregistrer la page » et « récupérer la page » donnent des résultats différents, et pourquoi le navigateur est parfois le seul endroit où la conversion puisse commencer.

La troisième étape est celle qui échoue plus tard plutôt qu'immédiatement. Une page écrite avec `<img src="/img/diagram.png">` se convertit en un Markdown contenant exactement ce chemin, et le chemin se résout désormais par rapport à l'endroit où le Markdown a atterri. Chaque image pointe vers rien. Il en va de même de chaque lien relatif, de chaque ancre vers un titre que le convertisseur a renommé, et de chaque construction dépendante de la feuille de style qui portait du sens. La conversion avait l'air parfaite dans l'aperçu du convertisseur. Elle a cassé quand le fichier a bougé, c'est-à-dire une semaine plus tard et devant quelqu'un d'autre.

## Comparatif rapide : l'aide-mémoire

| Point de départ | Voie la plus courte | Ce qu'il faut faire d'abord | Ce que cela vous coûte |
| --- | --- | --- | --- |
| Un fichier `.html`, écrit à la main ou fragment propre | N'importe quel convertisseur, navigateur ou ligne de commande | Rien | Rien — ce cas est résolu |
| Un fichier `.html` enregistré depuis un navigateur | Convertisseur côté navigateur, ou Pandoc | Retirer navigation, en-tête, pied de page, scripts | Dix minutes de ménage, ou un outil qui les retire pour vous |
| Une page ouverte dans un navigateur, une fois | Une extension de capture, ou la console | Laisser un extracteur trouver l'article | L'installation d'une extension, ou une ligne de JavaScript |
| Une page qui se rend en JavaScript | La console du navigateur, ou un navigateur sans interface | Attendre le DOM, puis prendre `outerHTML` | `curl` ne fonctionnera pas du tout ici |
| Des pages que vous lisez et conservez chaque semaine | Une extension de capture vers vos notes | La configurer une fois | Rien après l'installation |
| Une chaîne HTML dans Node | Turndown, ou node-html-markdown | Faire `remove()` sur les éléments dont vous ne voulez pas | Une dépendance et quelques règles |
| Une chaîne HTML en Python | markdownify, ou html2text | Faire `strip=[...]` sur les éléments dont vous ne voulez pas | Une dépendance et quelques options |
| Du HTML dans un pipeline shell ou en CI | Pandoc, ou un convertisseur avec une API | Décider de la variante et du passage du HTML brut | Une installation sur l'exécuteur, ou un appel réseau |
| Du HTML d'e-mail ou de newsletter | Pandoc, puis beaucoup de retouches | Accepter que la mise en page en tableaux soit perdue | L'essentiel de la structure ; les mots survivent |
| Un site entier que vous maîtrisez | Convertir depuis la source, pas depuis la sortie | Trouver les gabarits et le répertoire de contenu | Du vrai travail, et la bonne réponse |
| Un site entier que vous ne maîtrisez pas | `wget --mirror`, extracteur, convertisseur, dans cet ordre | Confirmer que vous en avez le droit | Des heures, et un sélecteur par site |
| Du HTML stocké dans une colonne de base de données | La bibliothèque de votre langage, dans une boucle | Échantillonner vingt lignes avant d'en convertir un million | Une mauvaise hypothèse multipliée par le nombre de lignes |

## Comment convertir du HTML en Markdown, selon le point de départ

### Un fichier `.html` sur le disque

C'est le cas que tout le monde a et celui qui offre le plus d'options. Le fichier est déjà local, il n'y a rien à récupérer, et la seule vraie question est de savoir si le fichier est un document ou une page.

Un fragment écrit à la main, un chapitre exporté, une page de documentation isolée : convertissez-le avec n'importe quoi et passez à la suite. Une page enregistrée depuis un navigateur, c'est autre chose. Les navigateurs offrent deux modes d'enregistrement et ils produisent des problèmes différents. « Page web, HTML seulement » vous donne un fichier avec le balisage et aucune ressource, si bien que les images deviennent des références cassées. « Page web, complète » vous donne un fichier plus un dossier de ressources, et réécrit les chemins pour pointer dans ce dossier, ce qui veut dire que votre Markdown portera des chemins comme `page_files/diagram.png` — corrects sur votre machine, dépourvus de sens partout ailleurs.

| Voie | Installation | Bonne pour | À surveiller |
| --- | --- | --- | --- |
| Convertisseur côté navigateur | Aucune | Un fichier, tout de suite, sans le téléverser | Un document à la fois |
| Pandoc | Oui, une fois | Le script, et une sortie autre que du Markdown | Aucun assainissement ; le HTML brut passe sauf si vous le désactivez |
| `html2text` (Python) | Oui, pip | Une sortie proche du texte brut lisible | GPLv3, et il reformate agressivement par défaut |
| Extension d'éditeur | Oui | Convertir pendant que le fichier est déjà ouvert | Très variable d'une extension à l'autre |
| Coller dans un éditeur Markdown | Aucune | Les petits fragments | Abandonne en silence ce que l'éditeur ne comprend pas |

Avec Pandoc, tout le travail tient en une ligne :

```bash
pandoc -f html -t gfm --wrap=none page.html -o page.md
```

`-t gfm` demande du GitHub Flavored Markdown, la variante qui contient les tableaux, les listes de tâches et le texte barré. `--wrap=none` empêche Pandoc de remettre vos paragraphes à une largeur de colonne, ce qui compte parce qu'un paragraphe réenveloppé produit un diff sur chaque ligne à la prochaine retouche. Deux autres options méritent leur place ici. `--extract-media=media` sort les images et autres médias de la source vers un répertoire et réécrit les références en conséquence, ce qui règle le problème de chemins de ressources ci-dessus. Et `-t gfm-raw_html` désactive l'extension `raw_html`, si bien que les constructions que Pandoc ne sait pas exprimer en Markdown sont abandonnées au lieu d'être laissées passer sous forme de balises HTML. Pandoc accepte aussi une URL à la place d'un nom de fichier et ira la chercher en HTTP, et `--sandbox` limite son accès aux fichiers que vous avez nommés sur la ligne de commande, ce qui vaut la peine sur tout ce que vous n'avez pas écrit (vérifié sur pandoc.org, le 8 septembre 2026).

La voie côté navigateur échange les options contre le fait de n'avoir rien à installer. [La conversion HTML vers Markdown de TransformPipe](/html-to-markdown) lit le fichier dans la page, supprime les éléments `script`, `style`, `noscript`, `template`, `svg`, `iframe`, `head`, `nav` et `footer` ainsi que les commentaires HTML, convertit ce qui reste, et rend un fichier `.md`. Déconnecté, le fichier n'est jamais envoyé nulle part — la conversion se fait sur votre propre machine, ce que vous pouvez confirmer en surveillant l'onglet réseau pendant qu'elle tourne. La conversion est plafonnée à 10 Mo, bien plus de HTML que n'en contient une page.

**À prendre quand :** vous avez le fichier, vous voulez le Markdown, et vous le faites une ou deux fois. Si vous le faites cent fois, passez directement à la voie du code.

### Une page ouverte dans un navigateur

Ici le HTML que vous voulez n'existe pas encore sous forme de fichier, et la version que vous obtiendriez en récupérant l'URL peut ne pas correspondre à ce que vous lisez. Il y a trois voies et elles conviennent à des fréquences différentes.

**Capturez-la.** Une extension de navigateur qui capture en Markdown passe un extracteur sur la page rendue, jette l'habillage et convertit ce qui reste. C'est le meilleur résultat par unité d'effort pour une page que vous lisez, et c'est la seule voie qui traite de façon fiable le contenu rendu en JavaScript, parce qu'elle travaille sur le DOM vivant. Le [comparatif des convertisseurs HTML vers Markdown](/blog/best-html-to-markdown-converters) dit quelles extensions font quoi ; le point ici est que c'est l'extraction, et non la conversion, qui les fait paraître meilleures qu'un outil nu.

**Sortez l'élément voulu par la console.** Ouvrez les outils de développement, trouvez l'élément qui contient l'article, et copiez son balisage :

```js
// In the browser console. Pick the selector that actually wraps the article.
copy(document.querySelector('main').outerHTML)
```

`copy()` est une fonction de la console des DevTools de Chrome et d'Edge ; elle place son argument dans le presse-papiers. Collez le résultat dans un fichier et convertissez-le. Tout l'intérêt de cette voie tient dans le sélecteur : vous avez nommé l'article à la main, ce qui est plus exact que n'importe quelle heuristique, et cela prend une quinzaine de secondes une fois le site connu. Pour un site que vous convertissez souvent, notez le sélecteur. `article`, `main`, `[role="main"]` et `.post-content` couvrent une part surprenante du web.

**Enregistrez puis convertissez.** Utilisez la commande d'enregistrement du navigateur, puis traitez le résultat comme un fichier sur le disque. C'est la voie la plus lente vers un bon résultat, parce que le fichier enregistré contient tout : le bandeau, la navigation, l'invitation à s'abonner, la colonne d'articles liés, la section de commentaires et un pied de page de soixante liens. Cela reste la bonne voie quand il vous faut la page exactement telle qu'elle était, y compris les parties qu'un extracteur écarterait.

| Voie | Effort par page | Gère les pages JavaScript | Garde la page entière |
| --- | --- | --- | --- |
| Extension de capture | Deux clics | Oui | Non, par conception |
| Sélecteur dans la console | Quinze secondes | Oui | Seulement ce que vous avez sélectionné |
| Enregistrer puis convertir | Une minute, plus le ménage | Selon le mode d'enregistrement | Oui, tout |
| Mode lecture, puis enregistrer | Deux clics | Oui | Non |

Cette dernière ligne mérite d'être connue. Le mode lecture de Firefox repose sur la bibliothèque Readability de Mozilla, qui est le moteur d'extraction qu'utilisent la plupart des extensions de capture. Activer le mode lecture puis enregistrer vous donne une page nettoyée sans rien installer.

**À prendre quand :** la page est devant vous. Si vous vous surprenez à le faire chaque jour, installez une extension de capture et cessez d'y penser.

### Une chaîne HTML dans du code

Une fois le HTML devenu une variable, la conversion est un appel de fonction et le travail intéressant est la configuration. Chaque bibliothèque de cette catégorie vous donne trois leviers : quels éléments abandonner entièrement, lesquels garder en HTML brut, et comment rendre le reste.

En JavaScript, Turndown est le choix par défaut et celui à l'aune duquel les autres sont mesurés. Sous licence MIT, son API est petite :

```js
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const turndown = new TurndownService({
  headingStyle: 'atx',        // "## Heading", not the underlined form
  codeBlockStyle: 'fenced',   // ``` fences, not four-space indents
  bulletListMarker: '-',
  linkStyle: 'inlined',
});

turndown.use(gfm);                                  // tables and strikethrough
turndown.remove(['script', 'style', 'nav', 'footer']); // gone, not converted

const markdown = turndown.turndown(html);
```

Trois de ces lignes sont celles qui comptent. `use(gfm)` ajoute les règles de `turndown-plugin-gfm` pour les tableaux et le texte barré — sans lui, Turndown n'a aucune prise en charge des tableaux et un `<table>` ressort en HTML brut ou en flot de texte selon vos autres réglages. `remove()` supprime des éléments et leur contenu avant la conversion : c'est votre étape de nettoyage. Et `addRule()`, qui n'apparaît pas ici, vous laisse projeter un motif précis sur un Markdown précis : un `<div class="warning">` sur une citation, un `<figcaption>` sur de l'italique sous l'image, un composant connu sur un bloc délimité.

L'autre option en JavaScript est node-html-markdown, qui embarque son propre analyseur HTML au lieu d'exiger un DOM. Cela compte si le code tourne quelque part où il n'y en a pas — une fonction serverless, un outil en ligne de commande, un worker — parce que l'option dépendante du DOM vous obligerait à agrafer jsdom à votre build. Sous licence MIT, elle gère elle-même les tableaux et le texte barré.

En Python, il y a deux options mûres aux objectifs différents. markdownify est sous licence MIT, bâtie sur BeautifulSoup, et vise la fidélité structurelle : `md(html, heading_style="ATX", strip=['a'])` convertit, `strip` nommant les balises à supprimer et `convert` nommant les seules balises à garder. Elle offre des options pour les caractères de puce, un langage supposé pour les blocs `<pre>`, l'enveloppement des paragraphes et l'inférence d'en-tête sur les tableaux qui n'en ont pas. html2text est sous GPLv3 et vise le texte lisible : elle installe un outil en ligne de commande du même nom et accepte des options comme `--ignore-links`, `--reference-links`, `--mark-code` et `--escape-all`.

| Bibliothèque | Langage | Licence | Levier de nettoyage | Tableaux |
| --- | --- | --- | --- | --- |
| Turndown | JavaScript | MIT | `remove()`, `keep()`, `addRule()` | Via `turndown-plugin-gfm` |
| node-html-markdown | JavaScript | MIT | Traducteurs sur mesure | Intégrés |
| markdownify | Python | MIT | `strip=[]`, `convert=[]` | Intégrés |
| html2text | Python | GPLv3 | Options du type `--ignore-links`, `--ignore-images` | Limités ; elle vise le texte lisible |
| Pandoc | N'importe lequel, via le shell | GPL | `-t gfm-raw_html`, `--sandbox` | Intégrés |

Si la conversion doit tourner dans une tâche plutôt que sur une machine que vous administrez, un convertisseur joignable en HTTP supprime l'installation sur l'exécuteur. Envoyer du HTML à `POST /api/v1/documents?kind=html-to-markdown` convertit le corps de la requête et conserve le résultat ; ce corps est plafonné à 4 Mo, parce qu'une fonction Vercel en refuse un plus gros avec un 413 nu qu'aucun code applicatif ne voit jamais.

**À prendre quand :** la conversion a lieu plus d'une fois, ou sans personne pour la regarder. Écrivez les règles de nettoyage une fois, dans du code, là où elles sont relisibles.

### Un site entier

C'est le cas où le conseil honnête est d'ordinaire « faites autre chose ». Si vous maîtrisez le site, le HTML est la sortie du build et vous convertissez le mauvais artefact. La source — les gabarits plus ce dans quoi le contenu vit — est plus proche du Markdown que les pages rendues, et convertir du HTML rendu en sens inverse revient à récupérer une structure que votre propre build connaît déjà. Cherchez d'abord un export. Un CMS avec un format d'export, une base de données avec une table de contenu, un dépôt contenant la source : les trois battent le fait de moissonner votre propre site.

Si vous n'avez réellement que les pages rendues, l'ordre est fixe et sauter une étape coûte plus cher que de la faire.

1. **Faites un miroir.** Posez les pages sur le disque avant de convertir quoi que ce soit, pour que la conversion soit rejouable et que vous ne récupériez pas tout à chaque tentative. `wget --mirror --page-requisites --convert-links --adjust-extension --no-parent https://example.com/docs/` parcourt la section, apporte les ressources, réécrit les liens vers les copies locales et reste à l'intérieur du chemin que vous avez nommé. Vérifiez d'abord les conditions du site et son `robots.txt` ; « je pourrais le récupérer » et « j'ai le droit de le récupérer » sont deux questions différentes.
2. **Établissez la bonne liste.** Un sitemap est une meilleure source d'URL qu'un parcours automatique, parce que c'est la réponse du site lui-même à « quelles pages existent » et qu'il ne vous entraînera pas dans un calendrier aux mois infinis.
3. **Extrayez.** Page par page, isolez le contenu. Soit un sélecteur CSS que vous avez établi à la main — le mieux, si le site n'utilise qu'un gabarit — soit un extracteur. Readability de Mozilla est sous licence Apache 2.0, prend un document DOM et renvoie un objet avec `title`, `content`, `textContent`, `excerpt`, `byline`, `lang` et d'autres champs. Il lui faut un vrai DOM : en Node, vous l'associez donc à jsdom. Son compagnon `isProbablyReaderable` vous donne un booléen rapide indiquant si un document mérite seulement de lui être confié, ce qui est la façon de sauter automatiquement les pages d'index (vérifié sur github.com/mozilla/readability, le 8 septembre 2026).
4. **Convertissez.** Le convertisseur tourne maintenant, et c'est maintenant l'étape ennuyeuse qu'elle aurait dû être depuis le début.
5. **Réparez les liens.** Chaque lien interne du HTML miroité pointe vers une structure d'URL qui n'existe plus. Décidez une fois de la correspondance entre ancienne URL et nouveau chemin de fichier, appliquez-la à tous les documents, et vérifiez un échantillon.

| Étape | Ce que coûte le fait de la sauter |
| --- | --- |
| Miroir sur le disque | Récupérer tout le site à chaque changement de règle |
| Sitemap plutôt que parcours | Pages en double, archives paginées, calendriers infinis |
| Extraction | Mille documents commençant tous par les mêmes quarante lignes de navigation |
| Conversion | — |
| Réécriture des liens | Un corpus de documents qui se renvoient tous vers rien |

**À prendre quand :** vous n'avez aucun accès à la source et il vous faut le contenu malgré tout — un site qu'on retire, la documentation d'un fournisseur que vous avez le droit de conserver, une archive. Prévoyez une journée, pas une heure, et attendez-vous à un travail de sélecteurs par gabarit.

## Nettoyer l'habillage d'abord

C'est l'étape qui décide du résultat, et c'est celle dont aucun tableau comparatif n'a la colonne. Le constat est constant sur toutes les voies ci-dessus : la différence entre une bonne et une mauvaise conversion n'est presque jamais le convertisseur. C'est de savoir si l'entrée était le document.

Pensez à une page réelle. L'article que vous voulez représente peut-être 15 % des éléments. Le reste, c'est un bandeau, une barre de navigation principale, une barre de navigation secondaire, une fenêtre de consentement aux cookies, un formulaire d'inscription à une lettre d'information, une rangée de partage, une colonne d'articles liés, un fil de commentaires, un pied de page contenant un plan du site et une mention légale. Un convertisseur traduit tout cela fidèlement, dans l'ordre du document, ce qui place l'article quelque part au milieu d'un très long fichier. La sortie est correcte et sans valeur, et le lecteur accuse l'outil.

Il y a quatre façons de couper, par ordre décroissant d'efficacité.

**Nommez l'élément voulu.** Un sélecteur — `main`, `article`, `#content`, `.markdown-body` — est la méthode la plus exacte disponible parce que vous avez regardé la page et décidé. Elle a une limite : elle vaut par site, parfois par gabarit, et elle casse quand le site est refondu. Pour une poignée de sites que vous convertissez souvent, c'est imbattable et cela prend quelques secondes.

**Lancez un extracteur.** Readability et ses cousins notent les éléments d'un document selon la quantité de texte de type prose qu'ils contiennent par rapport au balisage et à la densité de liens, puis renvoient le vainqueur. Cela se généralise, et c'est tout l'intérêt : cela fonctionne sur un site que vous n'avez jamais vu, sans configuration. Cela se trompe aussi de temps en temps, le plus souvent sur des pages qui ne sont pas des articles du tout — pages d'index, tableaux de bord, résultats de recherche — où il n'y a aucun bloc de prose unique à trouver.

**Supprimez les éléments dont vous ne voulez pas.** Au lieu de nommer ce qu'il faut garder, nommez ce qu'il faut jeter : `script`, `style`, `nav`, `footer`, `header`, `aside`, `form`, `iframe`, `noscript`, `svg`. C'est ce qu'un convertisseur généraliste peut faire sans rien savoir de votre page, et cela attrape l'essentiel de l'habillage sur une page bâtie avec des éléments sémantiques. Cela n'en attrape rien sur une page entièrement bâtie de `<div>`, ce qui représente une grande part du web.

**Réparez après coup.** Convertissez tout, puis supprimez le Markdown dont vous ne vouliez pas. C'est acceptable pour un document et indéfendable pour cent, et c'est le comportement par défaut parce qu'il ne demande aucune décision préalable. Le coût, c'est que vous refaites la même retouche une fois par document, et que vous ne pouvez pas rejouer l'opération quand vous améliorez vos règles.

| Méthode | Exactitude | Se généralise | Effort |
| --- | --- | --- | --- |
| Sélecteur CSS que vous avez choisi | La plus haute | Non — par site | Quelques secondes, une fois le site connu |
| Extracteur (Readability et similaires) | Bon sur les articles, faible sur le reste | Oui | Une installation et un DOM |
| Liste d'éléments à supprimer | Bonne sur du HTML sémantique, faible sur la soupe de `<div>` | Oui | Aucun ; les convertisseurs le font pour vous |
| Retoucher le Markdown après | Parfaite, en principe | Non | Par document, indéfiniment |

Une mise en garde contre un nettoyage trop zélé. `<script>` et `<style>` doivent toujours partir — le Markdown ne peut exprimer ni l'un ni l'autre, et une balise de script en entrée est une balise de script qui cherche un endroit où s'exécuter. Mais `<aside>` contient parfois une citation détachée qui appartient à l'article, `<header>` à l'intérieur d'un élément `<article>` est souvent le titre et la signature plutôt que le bandeau du site, et `<figure>` porte les images avec leurs légendes. Une liste de suppression est un instrument grossier. Regardez un document converti avant de la lancer sur un millier.

## Ce qui survit, et ce qui ne le peut pas

Le Markdown est un petit langage, délibérément. Le HTML ne l'est pas. La conversion est une démolition avec une liste de choses à garder, et il vaut mieux connaître la liste avant de commencer que la découvrir dans la sortie.

| Construction | Survit ? | Ce qui se passe réellement |
| --- | --- | --- |
| Titres `h1`–`h6` | Oui | Deviennent `#` à `######`, niveaux intacts |
| Paragraphes, emphase, gras | Oui | Fiable partout |
| Liens | Oui, en texte | L'URL est copiée telle quelle, chemins relatifs compris |
| Images | Oui, en référence | Le `src` est copié tel quel ; `width`, l'alignement et `srcset` disparaissent |
| Listes à puces et numérotées | Oui | L'imbrication survit ; la numérotation personnalisée et l'attribut `start`, généralement pas |
| Citations | Oui | Sans histoire |
| Blocs de code | En général | Une classe `language-*` devient une étiquette de bloc si le convertisseur la lit |
| Code en ligne | Oui | Des accents graves |
| Tableaux simples | Avec GFM | Grille plate seulement ; exige une variante ou un greffon qui implémente les tableaux |
| Filets horizontaux | Oui | `---` |
| Texte barré | Avec GFM | Sinon abandonné ou conservé en HTML brut |
| Listes de tâches | Parfois | Une case `<input>` dans un élément de liste ; beaucoup de convertisseurs l'ignorent |
| Listes de définitions | Rarement | Absentes de CommonMark et de GFM ; approchées ou abandonnées |
| Notes de bas de page | Rarement | Une extension dans toutes les variantes qui en ont |
| Mise en page — colonnes, flottants, largeurs | Non | Devient une colonne dans l'ordre du document |
| Classes, identifiants, styles en ligne | Non | Jetés, avec ce qu'ils signalaient |
| Tableaux imbriqués, `rowspan`, `colspan` | Non | Aplatis, abandonnés, ou laissés en HTML brut |
| Formulaires, boutons, `<details>`, onglets | Non | Abandonnés ou émis en HTML brut |
| Vidéo intégrée, canvas, SVG | Non | Un lien au mieux |
| Commentaires, scripts, feuilles de style | Non | Supprimés, et à juste titre |

Quatre de ces lignes méritent une phrase de plus.

**Les tableaux sont l'échec le plus bruyant.** Ils ne figurent pas dans la spécification CommonMark : un convertisseur doit donc implémenter délibérément les tableaux GFM. Quand il ne l'a pas fait, un `<table>` arrive en suite de paragraphes ou en HTML brut au milieu de votre document. Quand il l'a fait, une grille simple passe parfaitement et une grille compliquée non, parce que les tableaux GFM n'ont ni cellules fusionnées, ni contenu de bloc, ni imbrication. [Ce qui arrive aux tableaux au passage](/blog/markdown-tables-that-survive-conversion) est la chose la plus utile à tester sur un vrai document avant de s'engager sur une voie.

**Les blocs de code dépendent de la coloration syntaxique.** Un bloc `<pre><code>` nu se convertit proprement. Un bloc qu'un colorateur syntaxique a réécrit en centaines d'éléments `<span>` se convertit en bloc délimité si le convertisseur est raisonnable avec `<pre>`, et en fouillis de caractères parasites s'il ne l'est pas. Le langage se trouve normalement dans un nom de classe, et le lire est un comportement facultatif. [Les détails des blocs de code et de leurs chaînes d'information](/blog/code-blocks-in-markdown) valent la peine d'être vérifiés sur un échantillon réel.

**Liens et images survivent en chaînes de caractères, pas en références fonctionnelles.** C'est l'échec qui ressemble à une réussite. Chaque chemin relatif se convertit dans le même chemin relatif, et se résout désormais depuis ailleurs. Si le Markdown part dans un dépôt, un wiki ou un coffre de notes, il vous faut une étape de réécriture, et [des liens et des images qui fonctionnent encore après conversion](/blog/images-and-links-that-still-work) ne se produisent pas tout seuls.

**Le HTML brut est un choix que vous faites, que vous le remarquiez ou non.** Certains convertisseurs émettent du HTML pour tout ce qu'ils ne savent pas exprimer. Cela conserve l'information et rend le Markdown moins portable : cela survit si le moteur de rendu suivant autorise le HTML brut, et se transforme en soupe de balises visibles s'il l'échappe. Pire, du HTML brut transporté à travers une conversion transporte ce qu'il contenait. Si la source venait de l'extérieur, le Markdown détient désormais une surface d'attaque pour le prochain moteur de rendu, et [l'assainissement doit se faire là où le HTML est rendu](/blog/sanitising-markdown-safely), pas là où il a été converti.

## Là où la réponse évidente échoue

La réponse évidente est « installez Turndown » ou « lancez Pandoc », et pour la majorité des fichiers elle est juste. Voici où elle ne l'est pas, et ce que chaque échec coûte.

**Quand la page n'est pas le document.** Déjà traité plus haut et digne d'être répété, parce que cela explique l'essentiel des mauvaises sorties. Un convertisseur nu sur une page enregistrée produit une traduction correcte d'un site web. Le coût n'est pas un mauvais fichier — c'est que vous ne le remarquerez pas avant de l'ouvrir, et qu'à l'échelle vous aurez tout converti avant de le remarquer.

**Quand le HTML n'a jamais existé sur le serveur.** Une page rendue côté client et récupérée avec `curl` donne une coquille. Ne pas le savoir coûte un détour diagnostique : vous testerez trois convertisseurs, obtiendrez trois fichiers vides, et conclurez que la conversion HTML vers Markdown est cassée. L'indice est que la source récupérée est courte et pleine de `<script src=...>`. Le remède est un navigateur, vivant ou sans interface.

**Quand la sémantique était dans le CSS.** Une page dont les encadrés, les avertissements et les avis d'obsolescence ne sont marqués que par des noms de classes les perd tous. Les paragraphes sont tous présents et le lecteur ne sait plus lequel compte. Une règle par classe le répare — le `addRule()` de Turndown, les options par balise de markdownify — au prix d'une règle par classe et par site, écrite par vous. Il n'y a pas de solution générale, parce qu'il n'y a pas de convention générale.

**Quand la destination est plus stricte que la source.** Convertissez avec un outil qui émet du GFM, puis faites le rendu avec un analyseur CommonMark strict, et vos tableaux deviennent des paragraphes de barres verticales. La variante de sortie doit correspondre à celle de ce qui fera le rendu, et c'est une décision, pas un réglage par défaut. Se tromper coûte un document qui avait l'air juste à un endroit et faux au suivant.

**Quand le document n'a jamais été de la prose.** Un gabarit d'e-mail, un tableau de bord, une page de tarifs disposée en grille, un formulaire. Ce ne sont pas des articles déguisés en HTML ; la mise en page est le contenu. Les convertir produit une liste de mots dans l'ordre où ils apparaissent dans le balisage, qui n'est pas l'ordre dans lequel quiconque les a lus. Le Markdown n'est pas une copie avec pertes — c'est une copie fausse, et le geste honnête est de reconstruire plutôt que de convertir.

**Quand vous convertissez la sortie de votre propre build.** Si vous maîtrisez le site, reconvertir le HTML rendu en Markdown revient à jeter de l'information que votre build avait déjà, puis à payer pour la deviner. Le coût est subtil : le résultat est juste à 90 %, il part donc en production, et les 10 % manquants sont découverts par les lecteurs au cours des mois suivants.

## Comment choisir

1. **Trouvez le HTML avant de trouver l'outil.** Que les octets viennent d'un fichier, d'un enregistrement, d'une requête ou d'un DOM vivant décide de toute la méthode, et choisir une bibliothèque d'abord, c'est découvrir ensuite qu'elle ne voit pas la page que vous visiez.
2. **Convertissez un document difficile avant tous les autres.** Pas le plus simple — celui qui contient un tableau, un bloc de code et un encadré. Ce qui garde ces trois choses garde presque tout le reste, et vous l'apprenez en une minute au lieu d'après deux cents fichiers.
3. **Décidez explicitement de l'étape de nettoyage.** Sélecteur, extracteur, liste de suppression ou retouche manuelle : choisissez maintenant. Choisir après revient à tout convertir deux fois, et la retouche manuelle ne tient pas au-delà d'une dizaine de documents.
4. **Accordez la variante à la destination.** Si le Markdown part quelque part qui ne fait que du CommonMark, tableaux et texte barré n'arriveront pas, aussi bien le convertisseur les ait-il émis.
5. **Décidez du sort de ce que le Markdown ne sait pas exprimer.** Abandonné, approché, ou conservé en HTML brut. Garder du HTML brut dans un document destiné à un moteur de rendu strict revient à le corrompre.
6. **Vérifiez les liens et les images, pas seulement le texte.** Ouvrez-en trois depuis le nouvel emplacement du fichier converti. Des chemins relatifs qui se convertissent en chemins relatifs, c'est le défaut qui passe toutes les inspections à l'œil jusqu'à ce que quelqu'un d'autre ouvre le fichier.
7. **Comptez les conversions face aux installations.** Un fichier ne justifie pas un gestionnaire de paquets et un arbre de dépendances. Une tâche nocturne ne justifie pas un onglet de navigateur et quelqu'un pour y cliquer.

## Conclusion

Bien convertir du HTML en Markdown est surtout affaire d'une chose à faire avant la conversion — et si ce que vous convertissez est une page du web plutôt qu'un fichier, [lisez ceci d'abord](/blog/save-a-web-page-as-markdown). Cette chose unique : décider quelle partie du HTML est le document, et par quelle méthode. Nommez-la avec un sélecteur si vous connaissez le site, confiez-la à un extracteur sinon, et retirez l'habillage dans les deux cas. Ensuite, n'importe lequel des outils cités fera la traduction — Turndown en JavaScript, markdownify ou html2text en Python, Pandoc quand la sortie doit être autre chose que du Markdown, ou [une conversion HTML vers Markdown côté navigateur](/blog/best-html-to-markdown-converters) quand vous avez un fichier et rien à installer. Ce qui ne vous suivra pas, c'est la mise en page, le style et tout ce qu'un nom de classe signalait discrètement. Ce n'est pas une faiblesse du convertisseur ; c'est la définition du Markdown, et la raison pour laquelle le fichier est lisible à l'arrivée.

## FAQ

### Comment convertir un fichier HTML en Markdown sans rien installer ?

Prenez un convertisseur qui tourne dans le navigateur : ouvrez la page, déposez le fichier `.html`, téléchargez le `.md`. Avec un outil côté navigateur, le fichier n'est jamais téléversé, ce que vous pouvez vérifier en surveillant l'onglet réseau pendant la conversion. Si le fichier est une page web enregistrée plutôt qu'un fragment propre, attendez-vous à supprimer de la navigation ensuite, sauf si l'outil s'en charge.

### Quelle est la commande pour convertir du HTML en Markdown ?

`pandoc -f html -t gfm --wrap=none page.html -o page.md` est la réponse générale. Ajoutez `--extract-media=media` pour sortir les images et réécrire leurs références, et `-t gfm-raw_html` pour abandonner les constructions que Pandoc ne sait pas exprimer plutôt que de les laisser passer en balises HTML. Pandoc accepte aussi une URL à la place du nom de fichier.

### Pourquoi mon Markdown converti est-il plein de navigation et d'avis sur les cookies ?

Parce que vous avez converti la page et non l'article. Les convertisseurs traduisent chaque élément que vous leur donnez, et une page enregistrée n'est majoritairement pas l'article. Nommez l'élément de contenu par un sélecteur CSS, passez-y d'abord un extracteur comme Readability, ou prenez un convertisseur qui supprime les éléments de structure avant de commencer.

### Puis-je convertir une page qui ne se rend qu'en JavaScript ?

Pas en la récupérant. `curl` et `wget` reçoivent ce que le serveur a envoyé, ce qui, pour une page rendue côté client, est une coquille d'application et une balise de script. Il vous faut le DOM rendu : copiez l'élément depuis la console du navigateur, utilisez une extension de capture, ou pilotez un navigateur sans interface et prenez `outerHTML` une fois la page stabilisée.

### Les convertisseurs HTML vers Markdown gardent-ils les tableaux ?

Les tableaux simples, si le convertisseur implémente les tableaux GFM — certains ont besoin d'un greffon, comme `turndown-plugin-gfm` pour Turndown. Rien ne garde un tableau compliqué, parce qu'un tableau GFM est une grille plate sans cellules fusionnées, sans contenu de bloc et sans imbrication. Convertissez un vrai tableau et regardez-le avant de faire confiance à une voie.

### Comment convertir tout un site web en Markdown ?

Faites-en d'abord un miroir sur le disque avec quelque chose comme `wget --mirror --page-requisites --no-parent`, prenez la liste d'URL dans le sitemap plutôt que dans un parcours automatique, extrayez le contenu de chaque page, convertissez, puis réécrivez les liens internes vers les nouveaux chemins. Vérifiez les conditions du site avant de commencer. Si vous maîtrisez le site, convertissez plutôt la source — le HTML rendu a déjà jeté une structure que vous seriez en train de deviner.

### Qu'advient-il du CSS, des classes et des styles en ligne ?

Ils sont jetés, parce que le Markdown n'a aucun style. C'est en général ce que vous voulez et parfois une vraie perte, puisqu'un nom de classe est souvent la seule chose qui marque un encadré d'avertissement, une note en exergue ou une citation détachée. Les convertisseurs à règles par élément savent projeter une classe connue sur une citation ou un préfixe en gras, mais c'est vous qui écrivez cette règle, site par site.
