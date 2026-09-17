---
title: "Convertir du Markdown en HTML en ligne, sans rien installer"
description: "Les étapes pour convertir un fichier Markdown en HTML dans un onglet, ce qu'il faut vérifier dans le résultat avant de l'envoyer, et quand un build vaut mieux"
date: 2026-09-06
tag: Conversion
keywords: convertir markdown en html, convertir markdown en html en ligne, md vers html en ligne, markdown vers html sans installation, markdown html navigateur, vérifier onglet réseau téléversement, fusionner des fichiers markdown en html
---

### En bref

Ouvrez un convertisseur qui tourne dans le navigateur, déposez le fichier `.md` sur la page, et téléchargez le HTML — c'est tout le travail, et cela prend une vingtaine de secondes. Avant d'envoyer le résultat où que ce soit, ouvrez-le dans un second navigateur avec le réseau coupé : cette seule vérification attrape d'un coup les fragments, les styles manquants et les liens vers un CDN. Si vous voulez être certain que rien n'a été téléversé, ouvrez le panneau réseau avant de convertir et regardez-le rester vide, ou chargez la page, déconnectez-vous, et convertissez hors ligne. La voie du navigateur cesse d'être la bonne quand la conversion doit se répéter, quand l'entrée est un répertoire plutôt qu'un fichier, ou quand la sortie doit être autre chose que du HTML.

Vous avez un fichier Markdown et quelqu'un qui ne sait pas lire le Markdown. Peut-être est-ce une spécification, peut-être un jeu de notes, peut-être une page produite par un modèle. Ce qu'il vous faut, c'est un fichier qui s'ouvre dans un navigateur et ressemble à un document, et il vous le faut avant la réunion.

Le conseil que vous trouvez à la place, c'est un build. Installez un gestionnaire de paquets, installez un générateur, écrivez un fichier de configuration, apprenez un langage de gabarits, déployez. Tout cela est un conseil juste pour un site web et absurde pour un document destiné à un seul destinataire. C'est dans l'écart entre ces deux situations que vit l'essentiel du temps perdu en conversion Markdown.

Il existe un chemin plus court, et il a un risque réel attaché. Un convertisseur qui tourne dans un onglet ne demande aucune installation et peut convertir sans envoyer votre fichier nulle part — mais « convertisseur en ligne » décrit aussi un service qui téléverse votre document vers un serveur dont vous ne savez rien, l'y convertit, et conserve ce que sa politique de rétention dit qu'il conserve. De l'extérieur, les deux sont identiques. Les distinguer demande un panneau du navigateur et à peu près une minute, et cet article traite cela avec autant de soin que la conversion elle-même.

## Ce que « en ligne » doit vouloir dire avant d'y coller un document

« Convertisseur en ligne » décrit où se trouve la page, pas où va votre fichier. Les deux sortes d'outil sont une URL que l'on visite. La différence est de savoir si la conversion tourne dans le JavaScript de la page que vous avez chargée, ou dans un processus sur la machine de quelqu'un d'autre, que votre fichier doit d'abord atteindre.

Un convertisseur côté navigateur télécharge son code une fois, puis lit le fichier avec l'API `File` et le convertit dans l'onglet. Rien ne quitte la machine, parce qu'il n'y a rien à envoyer : l'analyseur est déjà local. Un convertisseur côté serveur envoie votre fichier à un point d'entrée, le convertit là-bas, et renvoie du HTML. Les deux peuvent être parfaitement bien opérés. Un seul est vérifiable par vous, sur le moment, sans avoir à croire une page de confidentialité.

Cette distinction pèse inégalement. Pour un README public, elle ne pèse rien — le fichier est déjà sur internet. Pour un contrat client, un compte rendu d'incident nommant des clients, une grille tarifaire non publiée, une note médicale, ou tout ce que couvre un accord sur les données que vous avez signé, c'est toute la question, et la réponse « le fournisseur dit qu'il le supprime » n'est pas de la même classe que « la requête n'a jamais eu lieu ».

La seconde chose que « en ligne » dissimule, c'est ce que vous récupérez. Certains outils vous remettent un fragment — `<h1>Titre</h1><p>Texte</p>`, sans document autour — ce qui est du HTML valide, s'affiche en texte noir à la largeur par défaut du navigateur, et paraît cassé à tous ceux qui le reçoivent. D'autres vous remettent un document complet qui tire sa feuille de style d'un CDN, ce qui a l'air juste sur votre machine et faux dans un train. Un troisième groupe vous donne un fichier autonome : doctype, head, jeu de caractères, styles en ligne, aucune requête externe. Seul le troisième se comporte de la même façon partout où il atterrit.

## Les voies en un coup d'œil

| Voie | Installation nécessaire | Où va votre fichier | Sortie | Idéale pour |
| --- | --- | --- | --- | --- |
| Convertisseur côté navigateur | Aucune | Nulle part, déconnecté | Fichier HTML autonome | Un document, tout de suite, à envoyer à une personne |
| Convertisseur en ligne côté serveur | Aucune | Téléversé chez le fournisseur | Variable : fragment ou document | Les fichiers publics, où le téléversement est sans conséquence |
| TransformPipe | Aucune | Nulle part, déconnecté | HTML complet, styles en ligne | Le même travail, avec une API REST, une ligne de commande et une action CI si cela se répète |
| L'aperçu de VS Code plus une extension | Vous avez déjà l'éditeur | Nulle part | Selon l'extension | Un README déjà ouvert |
| Pandoc | Binaire Haskell, gestionnaire de paquets | Nulle part | Document complet avec `--standalone` | Les tâches répétables, et les formats au-delà du HTML |
| Une bibliothèque JS ou Python | Gestionnaire de paquets, du code | Nulle part | Un fragment ; l'enveloppe, c'est vous | La conversion à l'intérieur d'une application |
| Générateur de site statique | Node, Ruby, Go ou Python plus configuration | Nulle part | Un site | Un répertoire de documents liés entre eux |
| GitHub ou GitLab | Aucune | Déjà téléversé | Pas de bouton d'export | Lire du Markdown, pas le convertir |
| L'export d'un éditeur | Installation de l'éditeur | Nulle part | Document complet, stylé à sa façon | Les gens en train d'écrire le fichier |
| Imprimer en PDF depuis le navigateur | Aucune | Nulle part | Du PDF, pas du HTML | Un destinataire qui veut de la pagination |

Ce tableau est l'aide-mémoire du reste de l'article. Deux lignes méritent d'être dites à voix haute : les voies gratuites sans installation sont les trois premières, et la seule différence entre la première et la deuxième est qu'une requête quitte ou non votre machine — tandis que la ligne de l'export d'éditeur est celle sur laquelle les gens atterrissent par accident, en ouvrant un outil d'écriture pour un fichier déjà terminé, ce qui est [l'erreur derrière la plupart des recherches d'une alternative à Dillinger](/blog/dillinger-alternatives).

## Comment convertir du Markdown en HTML dans un navigateur, étape par étape

Voici la voie rapide, écrite en entier. Elle suppose un convertisseur qui fait tourner son analyseur dans la page. Rien ici n'exige un terminal.

**1. Ayez le fichier sous la main, et sachez de quel fichier il s'agit.** Le Markdown arrive en `.md`, `.markdown`, `.mdown` ou `.txt`, et parfois sans aucune extension. Si vous n'êtes pas sûr de ce que vous avez, ouvrez-le d'abord dans un éditeur de texte : le Markdown ressemble à de la prose avec des `#`, des `*` et des `[]()` dedans. Si le fichier sort d'une application de prise de notes, [ce que contient réellement un export](/blog/how-to-open-md-file) mérite un coup d'œil avant de le convertir, parce que certains exports sont un dossier avec les images à côté du texte.

**2. Ouvrez le convertisseur et vérifiez que la page est entièrement chargée.** Un outil côté navigateur doit télécharger son analyseur avant de pouvoir travailler. Sur une connexion lente, la zone de dépôt peut apparaître avant que le code derrière elle ne soit arrivé. Si la page a un volet d'aperçu, tapez-y un `#` et regardez apparaître un titre : c'est l'analyseur qui répond.

**3. Déposez le fichier sur la page, ou collez le texte.** Le dépôt conserve le nom de fichier, que la plupart des outils réutilisent pour le téléchargement. Le collage vaut mieux quand le Markdown est dans une fenêtre de discussion ou un e-mail et n'a jamais été un fichier. Dans les deux cas la source est lue localement ; un dépôt n'est pas un téléversement, et la section suivante montre comment le prouver.

**4. Lisez l'aperçu, pas la source.** L'aperçu est le premier endroit où un problème de variante se manifeste. Regardez les tableaux en particulier, puis les listes de tâches, puis tout ce qui contient un accent grave. Un tableau rendu en paragraphe plein de barres verticales signifie que l'analyseur fait du CommonMark nu, où les tableaux ne font pas partie de la spécification.

**5. Choisissez l'export que vous voulez vraiment.** Un fichier HTML complet et autonome, c'est celui qu'on envoie à une personne. Un fragment, c'est celui qu'on colle dans une page qui existe déjà — un champ de CMS, un gabarit d'e-mail, un wiki qui accepte le HTML. Choisir le mauvais est de loin la première raison pour laquelle un fichier converti « a l'air sans style » à l'arrivée.

**6. Téléchargez-le, et ouvrez le téléchargement.** Pas l'aperçu — le fichier sur le disque, double-cliqué, pour qu'il s'ouvre par le protocole `file://` comme votre destinataire l'ouvrira. Cela prend cinq secondes et c'est l'étape que les gens sautent.

**7. Vérifiez-le avant de l'envoyer.** La section suivante est la liste.

Deux variantes méritent d'être connues. Si le Markdown est celui de quelqu'un d'autre — tiré d'un dépôt, transmis par un client, engendré par un outil — le convertisseur doit assainir, parce que le Markdown autorise délibérément le HTML brut et que le HTML brut autorise `<script>`, `onerror=` et les URL `javascript:`. [Pourquoi c'est un vecteur réel et non théorique](/blog/sanitising-markdown-safely) fait l'objet d'un autre article ; la version courte est qu'un moteur de rendu fidèle remet chacune de ces choses à votre navigateur. Et si le fichier est gros, souvenez-vous que le navigateur travaille avec la mémoire dont dispose l'onglet : un très gros document se convertit sur un portable et peine sur un téléphone.

| Étape | Ce qui peut mal tourner | Le remède |
| --- | --- | --- |
| Chargement de la page | L'analyseur n'est pas encore arrivé ; le dépôt ne fait rien | Rechargez, attendez que l'aperçu réponde |
| Dépôt du fichier | Mauvais fichier, ou un dossier | Vérifiez l'extension ; déposez le `.md`, pas son répertoire |
| Lecture de l'aperçu | Tableaux à plat, cases à cocher en crochets littéraux | L'analyseur ne fait pas de GFM ; prenez-en un qui en fait |
| Choix de l'export | Fragment choisi pour un document | Prenez le fichier complet, styles en ligne |
| Téléchargement | Le navigateur bloque le téléchargement sans rien dire | Regardez la barre de téléchargements et la demande d'autorisation |
| Ouverture du résultat | Jugé depuis l'aperçu, jamais depuis le disque | Double-cliquez le fichier téléchargé |

**Pour qui est cette voie :** pour quiconque a pour geste suivant de joindre un fichier ou de coller un lien dans un message. Un document, un destinataire, aucune répétition. Dès que l'un de ces nombres augmente, lisez la section sur les échecs de cette voie.

## Ce qu'il faut vérifier dans le résultat avant de l'envoyer

Que la conversion réussisse et que le fichier soit bon à envoyer sont deux faits différents. Voici la liste, dans l'ordre qui attrape le plus de problèmes le plus tôt.

**S'ouvre-t-il tout seul ?** Double-cliquez le fichier téléchargé. Si vous obtenez du texte stylé et lisible à une justification raisonnable, c'est un document. Si vous obtenez du Times New Roman noir courant sur toute la largeur de la fenêtre, on vous a remis un fragment. Vous pouvez confirmer lequel en ouvrant le fichier dans un éditeur de texte et en regardant la première ligne : un document commence par `<!doctype html>` et a un `<head>` contenant un bloc `<style>` ou un lien de feuille de style.

**Survit-il au réseau coupé ?** Coupez le Wi-Fi, puis rouvrez le fichier dans un onglet neuf. Un export autonome a exactement la même allure. Un export qui lie une feuille de style ou une police web depuis un CDN perd sa typographie et souvent sa mise en page, et le fait que cela ait fonctionné il y a une minute sur votre machine ne vous dit rien de l'avion où se trouve votre destinataire.

**Les tableaux sont-ils passés en tableaux ?** Les tableaux sont la victime la plus fréquente, parce que c'est une fonctionnalité de GitHub Flavored Markdown et non de CommonMark. Vérifiez la ligne d'en-tête, les deux-points d'alignement, et toute cellule contenant une barre verticale à l'intérieur de code. [Les façons précises dont un tableau casse au passage](/blog/markdown-tables-that-survive-conversion) valent la peine d'être connues si vos documents sont chargés de tableaux.

**Les blocs de code sont-ils encore des blocs ?** Cherchez le contenu des blocs rendu en un seul long paragraphe, signe que les délimiteurs n'ont pas été reconnus, et l'étiquette de langage de la chaîne d'information apparaissant en texte littéral. La coloration syntaxique est encore une autre question : un convertisseur peut émettre le bon `<code class="language-js">` et ne livrer aucune couleur, parce que la coloration exige du CSS ou du JavaScript sur la page.

**Les images apparaissent-elles ?** C'est là qu'un fichier converti échoue le plus souvent à l'arrivée. Un chemin relatif comme `![](images/diagram.png)` se résout par rapport à l'endroit où se trouve le fichier HTML : dès que vous envoyez le HTML seul par e-mail, l'image a disparu. Soit les images voyagent avec le fichier dans la même arborescence, soit il faut les incorporer, soit il leur faut des URL absolues qui resteront joignables.

**Les liens internes atterrissent-ils encore ?** Les liens d'ancre écrits `[voir plus bas](#configuration)` dépendent du fait que le convertisseur engendre un identifiant sur le titre, et qu'il engendre celui que vous attendiez. Les convertisseurs ne fabriquent pas les slugs de la même façon — ponctuation, casse et caractères non ASCII sont tous traités de façon incohérente — si bien qu'un document avec un sommaire écrit à la main demande que ses liens soient cliqués, pas supposés.

**Qu'est devenu le front matter ?** Si le fichier commence par un bloc `---` de lignes `clé : valeur`, les convertisseurs sont en total désaccord. Certains le suppriment, certains le rendent en paragraphe de métadonnées en haut de votre document, et quelques-uns en font un tableau. Un seul de ces comportements est celui que vous vouliez, et vous le découvrez en regardant.

**Le texte lui-même est-il intact ?** Vérifiez les guillemets typographiques, les tirets cadratins, les caractères accentués et les symboles voisins des emoji. Du charabia en haut d'un document veut presque toujours dire que le head n'a pas de `<meta charset="utf-8">`, et que le navigateur a deviné un encodage sur huit bits.

| Vérification | Comment, exactement | À quoi ressemble l'échec |
| --- | --- | --- |
| Document complet | Ouvrez le fichier dans un éditeur de texte ; cherchez `<!doctype html>` | Cela commence par `<h1>` |
| Autonome | Wi-Fi coupé, rouvrir | Polices et mise en page changent |
| Tableaux | Regardez la ligne d'en-tête | Un paragraphe de barres verticales |
| Blocs de code | Cherchez la chaîne d'information en texte | `js` imprimé au-dessus de votre code |
| Images | Ouvrez depuis un autre dossier | Des images cassées |
| Ancres | Cliquez-en trois | Rien ne bouge |
| Front matter | Regardez le haut de la page | Un bloc de lignes `clé : valeur` |
| Encodage | Regardez guillemets et tirets | Des points d'interrogation ou `Ã¢â‚¬â€œ` |
| HTML brut | Cherchez `<script` dans la source | Une balise que vous n'avez pas écrite, intacte |

**Pour qui est cette liste :** pour tout le monde, une fois. Déroulez-la en entier la première fois que vous utilisez un convertisseur, et vous saurez ensuite quelles deux lignes comptent pour vos documents et pourrez ne vérifier que celles-là.

## Comment confirmer que rien n'a été téléversé

Vous n'avez à croire personne sur parole. Le navigateur vous le dira, et il y a trois façons de le lui demander, par ordre croissant de force de conviction.

**Le panneau réseau, surveillé en direct.** Ouvrez les outils de développement avant de convertir — F12 sous Windows et Linux, ou Commande-Option-I sur un Mac, dans Chrome, Edge et Firefox. Dans Safari, le menu Développement doit d'abord être activé dans les réglages pour que l'inspecteur web apparaisse. Allez au panneau Réseau, cochez l'option qui conserve le journal entre les chargements de page, puis rechargez une fois la page du convertisseur pour voir les requêtes qu'elle fait pour se charger elle-même. Videz maintenant le journal, et convertissez votre fichier. Si la conversion est locale, cette liste vidée reste vide. Toute requête qui apparaîtrait peut être cliquée : le panneau montre la méthode, la taille et, pour un POST, la charge que vous avez envoyée.

**Le test hors ligne.** C'est la version la plus forte, parce qu'elle élimine la possibilité d'une requête qui vous aurait échappé. Chargez la page du convertisseur avec une connexion, puis déconnectez-vous entièrement — coupez le Wi-Fi, débranchez le câble, ou mettez la liste déroulante de limitation du panneau Réseau sur Hors ligne. Convertissez alors. Si cela fonctionne encore, l'analyseur tourne sur votre machine, parce qu'il n'y a aucune route vers ailleurs. Si cela échoue ou reste bloqué, la conversion n'a jamais été locale.

**Une visite de retour avec l'onglet pour seul bagage.** Certains outils enregistrent un service worker, ce qui veut dire que la page elle-même se chargera hors ligne à la seconde visite. Faites-le, puis convertissez avec le réseau toujours coupé. La page et la conversion ont désormais toutes deux démontré qu'elles n'ont besoin de rien.

Deux réserves honnêtes. D'abord, un panneau réseau vide prouve que rien n'a été téléversé *pendant cette conversion*, pas que l'outil ne téléverse jamais en d'autres circonstances — se connecter, enregistrer un document ou utiliser une fonction de partage sont exactement les cas où la requête est le propos. Un outil qui conserve un document côté serveur doit bien l'envoyer ; la question est de savoir s'il le fait quand vous ne l'avez pas demandé. Ensuite, vous verrez peut-être des requêtes sans rapport avec votre fichier : mesures d'audience, fichiers de polices, remontée d'erreurs. Jugez-les en cliquant dessus. Une balise de télémétrie fait quelques centaines d'octets sans document dedans ; le téléversement de votre fichier est un POST dont la taille suit celle du fichier, et dont vous pouvez lire la charge dans le panneau.

| Méthode | Ce qu'elle prouve | Effort | Faiblesse |
| --- | --- | --- | --- |
| Panneau réseau, journal vidé avant conversion | Aucune requête n'a accompagné cette conversion | Moins d'une minute | Vous devez lire les requêtes que vous voyez |
| Limitation sur Hors ligne, puis convertir | La conversion n'a besoin d'aucun réseau | Quelques secondes | La page doit déjà être chargée |
| Déconnecter la machine entièrement | Pareil, sans réglage à rater | Quelques secondes | Interrompt tout ce que vous faisiez d'autre |
| Visite de retour, hors ligne, service worker | Page et conversion toutes deux locales | Une minute | Ne marche que si l'outil se met en cache |

Il existe une quatrième vérification vers laquelle les gens se tournent et qui ne fonctionne pas : lire la page de confidentialité. Elle peut être parfaitement exacte et elle n'est pas une preuve, parce qu'elle décrit une intention plutôt qu'un comportement. Le panneau réseau, lui, décrit un comportement.

**Pour qui est cette section :** pour quiconque convertit un document qu'il n'aimerait pas voir figurer dans un avis de fuite de données. Si le fichier est un README public, sautez-la. L'intérêt de faire la vérification une fois sur un outil que vous comptez réutiliser, c'est que vous n'aurez plus jamais à la refaire.

## Réunir plusieurs fichiers en un seul document

La version courante, c'est un jeu de chapitres, un dossier de comptes rendus, ou un répertoire de documentation que quelqu'un veut en une page lisible. Il y a deux façons d'y arriver dans un navigateur, et l'une demande bien moins de travail.

**Concaténez d'abord, convertissez une fois.** Joignez les fichiers Markdown en un seul `.md`, puis convertissez ce fichier de la manière habituelle. Le résultat est un document avec un sommaire, un jeu de styles et un fichier à envoyer.

```bash
# Alphabetical order, which is why zero-padded numbers matter
cat 01-intro.md 02-setup.md 03-api.md > combined.md

# Everything in the folder, blank line between files so headings do not collide
awk 'FNR==1 && NR>1 { print "" } { print }' *.md > combined.md
```

```powershell
# PowerShell, sorted explicitly rather than trusting the provider's order
Get-ChildItem *.md | Sort-Object Name | Get-Content | Set-Content -Encoding utf8 combined.md
```

**Ou collez-les dans l'ordre.** Si vous préférez ne pas toucher à un terminal, ouvrez chaque fichier dans un éditeur de texte et collez-les l'un après l'autre dans l'entrée du convertisseur, avec une ligne vide entre chacun. C'est fastidieux au-delà de cinq fichiers environ et parfaitement fiable en deçà.

Dans les deux cas, ce sont les mêmes quatre choses qui tournent mal, et elles tournent mal en silence :

**L'ordre.** `chapter-2.md` se classe après `chapter-10.md` dans tous les tris alphabétiques du monde. Complétez les nombres par des zéros — `02`, `10` — ou listez les fichiers explicitement dans l'ordre voulu.

**Les niveaux de titres.** Chaque fichier commence probablement par `#`, parce que chaque fichier était son propre document. Concaténés, vous obtenez dix éléments `<h1>` et aucune hiérarchie, ce qui rend le sommaire inutile et le document plat. Rétrogradez d'un niveau les titres de chaque fichier avant de joindre, pour que les titres de fichiers deviennent des `##` sous un `#` unique.

**Les identifiants d'ancre en double.** Trois chapitres avec une section « Vue d'ensemble » produisent trois titres qui veulent le même identifiant. Les convertisseurs résolvent cela différemment : certains ajoutent un compteur, certains émettent le doublon et laissent le navigateur prendre le premier. Dans les deux cas, la moitié de vos renvois atterrissent dans le mauvais chapitre.

**Les lignes `---` égarées.** Trois tirets sont un filet horizontal en Markdown, un délimiteur de front matter en haut d'un fichier, et un soulignement de titre setext juste sous une ligne de texte. Concaténer des fichiers met beaucoup de `---` au milieu d'un document, et chacun est interprété selon l'endroit où il tombe plutôt que selon ce que vous vouliez dire.

[La mécanique d'une fusion faite correctement](/blog/merging-many-markdown-files) — rétrogradation, collisions d'ancres, et construction d'un sommaire qui fonctionne ensuite — dépasse largement ce qui tient ici, et c'est la différence entre un document et dix documents dans un imperméable.

| Nombre de fichiers | Approche raisonnable |
| --- | --- |
| Deux ou trois | Les coller dans l'ordre dans le convertisseur |
| Quatre à vingt | Concaténer avec `cat` ou `awk`, puis convertir une fois |
| Un répertoire, une fois | Concaténer, rétrograder les titres par un script, convertir une fois |
| Un répertoire, de façon répétée | Une ligne de commande ou une étape de build, pas un onglet |
| Un répertoire qui devrait rester des pages séparées | Un générateur de site statique |

**Pour qui :** pour quiconque produit un livrable unique à partir de plusieurs sources. Si les fichiers doivent rester des pages séparées reliées entre elles, vous ne fusionnez pas — vous construisez un site, et c'est la section suivante.

## Là où la voie du navigateur échoue, et ce qu'elle coûte

La partie honnête. Un onglet de navigateur est la bonne réponse à une question étroite, et il y a cinq situations où c'est la mauvaise. Chacune a un coût attaché, et le coût est généralement payé plus tard par quelqu'un d'autre.

**La conversion se répète.** Si ce fichier est converti à chaque modification, une personne dans un onglet est désormais une étape de votre processus, et les étapes tenues par des personnes finissent par être sautées. Le coût, c'est une page publiée périmée que personne n'a remarquée, parce que la personne qui convertit d'habitude était en congé. Le remède est une commande dans un script ou une tâche en CI — un appel d'API, un outil en ligne de commande, ou une GitHub Action qui tourne sur la pull request ayant modifié le fichier.

**L'entrée est un répertoire qui devrait rester un répertoire.** Vingt documents qui se lient les uns aux autres forment un site, et un site a besoin d'une navigation, d'un index de recherche et de renvois cohérents. Les fusionner en une page perd les trois. Le coût de forcer le passage par un convertisseur, c'est une page de quarante mille mots que personne ne peut parcourir ; le coût de l'alternative, c'est un fichier de configuration et une étape de build à maintenir pour toujours.

**La sortie n'est pas du HTML.** Si le destinataire veut du PDF, du Word ou de l'EPUB, le HTML est au mieux une étape intermédiaire. Imprimer en PDF depuis le navigateur fonctionne et vous donne la pagination du navigateur, c'est-à-dire des en-têtes, des pieds de page et des sauts de page que vous ne maîtrisez pas précisément. Pour un vrai contrôle sur tout cela, Pandoc est l'outil, et c'est une installation.

**Le fichier est trop gros pour le voyage.** Le navigateur convertit avec la mémoire dont dispose l'onglet, et tout outil qui garde une copie de votre document côté serveur a une limite de taille de requête à l'entrée. Un document conservé ici est plafonné à 4 Mo parce que la fonction qui le reçoit refuse un corps plus gros ; la conversion elle-même est plafonnée à 10 Mo. Ce sont les ordres de grandeur à vérifier avant d'essayer de faire passer un livre par un onglet, et le mode de défaillance — une requête rejetée, ou un onglet qui ne répond plus — a au moins le mérite d'être bruyant.

**Le document a besoin d'une mise en page que vous avez décidée.** L'export d'un convertisseur porte la feuille de style du convertisseur. Si votre organisation a un gabarit, une police et une couleur, vous modifiez le CSS exporté à la main chaque fois, ou vous prenez quelque chose doté d'un langage de gabarits. Pandoc a des gabarits ; les générateurs ont des thèmes ; un convertisseur a un réglage par défaut. Modifier le CSS à la main, cela va une fois et devient un passif à la cinquième.

| Situation | Ce que l'onglet vous coûte | À utiliser à la place |
| --- | --- | --- |
| Conversion à chaque modification | Une étape manuelle qui finit sautée | Ligne de commande, API REST, ou action CI |
| Un répertoire de pages liées | Pas de navigation, pas de recherche, pas de renvois | Générateur de site statique |
| La sortie doit être du PDF ou du Word | La pagination du navigateur, pas la vôtre | Pandoc |
| Documents très volumineux | Une requête rejetée ou un onglet figé | Un outil local en ligne de commande |
| Une charte graphique maison fixe | Modifier le CSS exporté à la main, encore et encore | Des gabarits ou un thème |
| Conversion à l'intérieur de votre propre application | Une personne dans la boucle | Une bibliothèque : marked, markdown-it, remark |

Rien de tout cela ne fait d'un convertisseur de navigateur un mauvais outil. Cela en fait un outil avec une forme. [Ce qui arrive réellement à votre fichier à chacune des quatre étapes](/blog/markdown-to-html-converter) explique pourquoi la forme est ce qu'elle est : analyse, rendu, assainissement et enveloppe peuvent chacun tourner à un endroit différent, et un onglet de navigateur est simplement l'endroit où les quatre peuvent tourner à la fois sans rien installer.

## Comment choisir

1. **Déterminez qui ouvre le fichier ensuite.** Si c'est une personne, il vous faut un document complet et autonome, et un fragment coûtera un aller-retour d'explications. Si c'est un gabarit ou un champ de CMS, il vous faut le fragment, et un document se battra contre la page qui l'entoure.
2. **Déterminez si cela se reproduira.** Une fois, c'est un onglet. Chaque semaine, c'est une commande que vous pouvez mettre dans un script. À chaque commit, c'est une tâche de CI. Choisir le navigateur pour le troisième cas, c'est rendre la conversion aussi fiable que la mémoire de quelqu'un.
3. **Vérifiez où va le fichier avant de convertir quelque chose de confidentiel.** Ouvrez le panneau réseau, ou convertissez réseau coupé. Soixante secondes maintenant, contre la découverte plus tard qu'un document couvert par un accord que vous avez signé est parti faire un tour chez un tiers.
4. **Convertissez un fichier représentatif, pas un paragraphe de test.** Prenez le document avec le tableau le plus large, le bloc de code le plus long et le chemin d'image le plus tordu. Un convertisseur qui gère « Bonjour **le monde** » ne vous apprend rien ; le vrai fichier vous apprend tout d'un coup.
5. **Ouvrez le résultat ailleurs que dans l'outil.** Un autre navigateur, une autre machine, le réseau coupé. Ce seul test attrape ensemble les fragments, les styles manquants et les dépendances à un CDN, et c'est la vérification qui vous empêche d'envoyer un fichier qui ne fonctionne que sur l'ordinateur où il a été fabriqué.

## Conclusion

Convertir du Markdown en HTML en ligne est vraiment un travail de vingt secondes, et tout ce qu'il a de difficile se situe soit avant la conversion — savoir si votre fichier quitte la machine — soit après, dans les quatre ou cinq vérifications qui séparent un document que vous pouvez envoyer d'un document qui se contente d'exister. Déposez le fichier, lisez l'aperçu, téléchargez le fichier complet plutôt que le fragment, ouvrez-le depuis le disque avec le réseau coupé, et regardez les tableaux. [La conversion Markdown vers HTML de TransformPipe](/) fait cette première partie dans votre navigateur, gratuitement, sans rien téléverser quand vous êtes déconnecté et sans installation à défaire ensuite. Quand le travail cesse d'être un fichier pour une personne et devient un répertoire, un calendrier ou un format autre que HTML, cessez de tendre la main vers un onglet et prenez un outil bâti pour la répétition — et si le fichier est déjà ouvert devant vous, [convertir du Markdown en HTML dans VS Code](/blog/markdown-to-html-in-vs-code) est l'endroit suivant où regarder, parce que l'aperçu de l'éditeur et l'export de l'éditeur ne sont pas le même programme.

## FAQ

### Combien de temps prend réellement la conversion d'un fichier Markdown dans un navigateur ?

La conversion elle-même prend des millisecondes pour un document ordinaire — un analyseur qui parcourt quelques milliers de mots ne travaille pas dur. Le temps part dans le chargement de la page, le dépôt du fichier et les vérifications qui suivent, ce qui explique que la réponse honnête soit moins d'une minute pour le premier fichier et une vingtaine de secondes pour tous les suivants.

### Comment prouver que le convertisseur n'a pas téléversé mon fichier ?

Ouvrez le panneau Réseau du navigateur, videz le journal, et convertissez : une conversion locale n'ajoute aucune requête. La version plus forte consiste à charger la page, à vous déconnecter entièrement du réseau, et à convertir hors ligne — si cela fonctionne sans connexion, rien n'a été envoyé, puisqu'il n'y avait nulle part où l'envoyer.

### Puis-je convertir un fichier `.md` sur un téléphone ?

Oui, si le convertisseur tourne dans le navigateur et si le fichier se trouve quelque part que le sélecteur de fichiers du navigateur peut atteindre — un dossier de téléchargements, un espace de stockage en ligne dont l'application expose les fichiers, ou une feuille de partage. La limite est la mémoire plutôt que la capacité : un téléphone convertira un README sans peine et peinera là où un portable ne peinerait pas.

### Que faire des images de mon Markdown ?

Décidez avant de convertir si les images voyageront avec le HTML. Les chemins relatifs ne fonctionnent que si l'arborescence suit : pour un fichier que vous envoyez seul par e-mail, vous voulez donc soit des images incorporées au document, soit des URL absolues qui se résoudront encore pour le lecteur.

### Le HTML exporté fonctionnera-t-il encore sans connexion internet ?

Seulement s'il est autonome. Un fichier dont les styles tiennent dans un bloc `<style>` en ligne et dont les images sont incorporées n'a besoin de rien du réseau et s'ouvre à l'identique sur une machine déconnectée ; celui qui lie une feuille de style ou une police web depuis un CDN se dégrade discrètement en texte sans style dès qu'il est ouvert hors ligne.

### Puis-je réunir plusieurs fichiers Markdown en une page HTML sans terminal ?

Oui — collez les fichiers l'un après l'autre dans l'entrée du convertisseur, dans l'ordre voulu, avec une ligne vide entre chacun. Cela cesse d'être agréable au-delà de cinq fichiers environ, et à ce moment-là une seule commande `cat` ou `Get-Content` fait la jonction plus fiablement qu'un copier-coller.

### Qu'advient-il du front matter YAML en haut de mon fichier ?

Cela dépend entièrement du convertisseur : certains suppriment le bloc, certains le rendent en paragraphe de lignes `clé : valeur` en haut de la page, et quelques-uns en font un tableau. Convertissez un fichier avec du front matter et regardez le haut de la sortie avant de supposer quoi que ce soit, car aucun de ces comportements n'est faux et un seul est celui que vous voulez.
