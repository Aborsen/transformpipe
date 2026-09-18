---
title: "Comment partager un fichier Markdown avec quelqu'un qui n'utilise pas Markdown"
description: "Les façons honnêtes de partager un fichier Markdown avec un lecteur qui n'installera rien — pièce jointe, Gist, dépôt, HTML, lien — et ce qu'exige un vrai retrait"
date: 2026-09-05
tag: Publication
keywords: partager un fichier markdown, publier du markdown en ligne, markdown en lien partageable, héberger un fichier markdown, lien document lecture seule, envoyer du markdown à un client
---

Vous avez un fichier `.md`. Vous l'avez écrit, ou vous avez sauvegardé [une réponse qu'un assistant conversationnel vous a donnée en Markdown](/blog/ai-output-to-a-shareable-page) ; à partir d'ici, cela ne change rien. Quelqu'un doit le lire : une cliente, un responsable, un avocat, un artisan qui chiffre des travaux dans votre cuisine. Cette personne n'installera pas d'éditeur Markdown, elle ne clonera pas de dépôt, et elle ne devrait pas avoir à le faire. Chaque façon de lui mettre le document sous les yeux échoue quelque part, et tout l'art consiste à savoir où, avant d'appuyer sur envoyer.

### En bref

Choisissez selon ce qui arrive au fichier une fois reçu, pas selon ce qui est le plus rapide pour vous. Si le lecteur va le modifier et vous le renvoyer, joignez la source et dites ce qu'elle est. S'il doit le lire une seule fois, sur un téléphone, en réunion, convertissez-le en **fichier HTML autonome** et joignez-le, ou publiez-le comme **lien en lecture seule** — dans les deux cas, il obtient un document plutôt qu'une source. Un lien ne vaut la peine que s'il ne demande rien au lecteur : ni compte, ni installation, ni script. Et un lien n'est réellement révocable que si le révoquer tue l'adresse elle-même, immédiatement, sans que le lecteur ait à faire quoi que ce soit — ce qu'aucune pièce jointe ne peut jamais faire, puisqu'une pièce jointe est une copie.

## Ce que la machine du lecteur fait de votre fichier

Le frottement n'est pas le Markdown. Le Markdown est un fichier texte ponctué, conçu pour que la ponctuation reste lisible quand rien ne la met en forme. Le frottement vient de ce que les systèmes d'exploitation, les clients mail et les téléphones font chacun une supposition différente sur une extension de fichier pour laquelle ils n'ont aucune application, et chacune de ces suppositions est fausse d'une manière que vous ne pouvez pas voir de votre côté.

Trois questions distinctes se cachent dans « pouvez-vous lire ceci ? ». La première est de savoir si le fichier s'ouvre du tout. La deuxième, s'il s'ouvre comme un document ou comme du code source. La troisième, si ce qui s'ouvre est bien la version que vous vouliez leur montrer, aujourd'hui comme dans six mois. Coller le texte répond à la première et échoue à la deuxième. Joindre la source peut échouer d'emblée à la première. Un lien de dépôt répond aux deux premières et échoue silencieusement à la troisième, parce que l'adresse pointe vers une branche qui bouge.

La dernière question pèse plus lourd qu'on ne l'attend. La plupart des partages tournent mal après le moment de l'envoi. Le client le transfère. Le responsable revient sur le lien un trimestre plus tard. Le service juridique demande la version qui était en vigueur le onze. Quel que soit votre choix, il doit survivre à être lu par quelqu'un à qui vous ne l'avez pas envoyé, à un moment que vous n'avez pas choisi.

## Le comparatif rapide : le tableau de bord

| Option | Idéal pour | Capacité clé | Prix |
| --- | --- | --- | --- |
| Coller le texte dans le message | Une courte note sans tableaux ni images | Fonctionne dans tous les clients ; rien à ouvrir | Gratuit |
| Joindre le fichier `.md` | Un lecteur qui va le modifier et le renvoyer | Sans perte — exactement les octets que vous avez | Gratuit |
| Un Gist | Un extrait ou une note pour quelqu'un de technique | Affiche le GFM à une URL, garde les révisions | Gratuit, un compte GitHub est nécessaire pour en créer un |
| Un fichier dans un dépôt | Un document qui vit à côté du code | S'affiche sur place, versionné avec le projet | Gratuit pour les dépôts publics |
| Un lien de stockage cloud | Un fichier déjà conservé dans Drive, Dropbox ou OneDrive | Un lien, accès contrôlé par compte | Palier gratuit ; forfaits payants tarifés au stockage |
| Une pièce jointe HTML autonome | Un document fini qui doit s'ouvrir hors connexion | Un seul fichier, styles intégrés, ne demande rien au réseau | Gratuit |
| Un lien publié en lecture seule | Quelqu'un qui lit une fois, sur un téléphone, sans compte | Une adresse qui ne demande aucune installation, et qui peut être retirée | Gratuit |
| Un PDF | Impression, signature, un enregistrement fixe | Chaque lecteur voit des pages identiques | Gratuit via le dialogue d'impression du navigateur |
| Hébergement statique ou Pages | Un ensemble de documents qui se lient entre eux | Navigation, domaine personnalisé, recherche | Gratuit pour les dépôts publics ; une étape de build à maintenir |

## Les façons de partager un fichier Markdown

### Coller le texte dans le message

L'option la plus rapide, et celle qui fonctionne partout. Copiez le fichier dans l'email, le message de chat ou le ticket, et le lecteur l'a sans rien ouvrir.

| Avantages | Inconvénients |
| --- | --- |
| Pas de pièce jointe, pas de lien, pas d'installation — c'est déjà devant lui | La syntaxe arrive comme de la ponctuation, pas comme une mise en forme |
| Citable et cherchable dans son propre client mail | Tableaux, images et code sont perdus ou déformés |
| Rien à révoquer, puisque rien n'a été hébergé | Les longs documents sont illisibles en mur de texte dans un message |
| Fonctionne même si un filtre mail retire les pièces jointes | Chaque client applique ses propres règles Markdown partielles |

**Prix :** gratuit.

**Ce qui arrive réellement au texte**

- Les titres arrivent en `## Portée`, parce qu'aucun client mail n'interprète les titres ATX
- Slack n'a pas de syntaxe pour les titres ni les tableaux, les deux passent donc en caractères littéraux, tandis que `*Portée*` ressort en gras — un seul astérisque y est du gras, pas de l'italique
- [Les tableaux s'en sortent le plus mal](/blog/markdown-tables-that-survive-conversion) : la ligne d'alignement en tirets ne signifie rien pour un outil qui ne la parse pas, le lecteur reçoit donc un paragraphe de barres verticales
- Les images restent la ligne brute `![alt](chemin)`, et les chemins relatifs n'allaient de toute façon jamais se résoudre dans le client de quelqu'un d'autre
- Certains clients mettent en forme automatiquement au collage, ce qui est pire que rien : la moitié du document s'affiche et l'autre non, et on ne peut pas savoir laquelle depuis le dossier envoyé

**Qui devrait l'utiliser ?** Quiconque envoie quelque chose de court, définitif et surtout composé de texte — un paragraphe de statut, une décision, trois puces. Tout ce qui dépasse un écran, ou qui contient un tableau, veut l'une des options ci-dessous.

### Joindre le fichier `.md`

Honnête et sans perte. Le destinataire reçoit exactement les octets que vous avez, et c'est la seule option de cette page qui lui permette de changer un mot et de vous le renvoyer.

| Avantages | Inconvénients |
| --- | --- |
| Byte pour byte, il fait donc l'aller-retour à travers une édition | Rien sur une machine standard n'est enregistré pour `.md` |
| Petit, texte brut, et diffable | Sur un téléphone, il ne s'ouvre en général sur rien du tout |
| Aucun hébergement, aucun compte, aucun service intermédiaire | Le lecteur qui l'ouvre effectivement lit une source, pas un document |
| Le bon choix quand le fichier est le livrable | Vous ne pouvez jamais le retirer |

**Prix :** gratuit.

**Ce qui arrive réellement sur la machine du lecteur**

- Un double-clic sous Windows ou macOS ouvre un éditeur de code, une boîte de dialogue « choisir une application », ou rien — l'extension n'a pas de gestionnaire par défaut
- Les clients mail l'affichent souvent en aperçu comme du texte brut, ce qui est le meilleur résultat possible et entièrement hors de votre contrôle
- Certains filtres mail traitent les extensions inconnues comme suspectes, la pièce jointe peut donc être mise en quarantaine sans que ni vous ni le destinataire ne le sachiez
- La renommer en `.txt` règle l'ouverture et perd l'association avec Markdown, ce qui compte s'il doit la modifier
- S'il l'ouvre malgré tout, les images et les liens relatifs pointent vers des fichiers qu'il n'a pas, le document a donc des trous

Si le lecteur est de bonne volonté mais coincé, [ouvrir un fichier `.md`](/blog/how-to-open-md-file) couvre ce qui fonctionne sur une machine sans rien de particulier installé. Dites ce qu'est le fichier au moment de l'envoi. « C'est un fichier texte — ouvrez-le dans le Bloc-notes ou TextEdit, ou lisez-le simplement dans l'aperçu » est une phrase qui évite l'essentiel de la confusion.

**Qui devrait l'utiliser ?** Quiconque a un lecteur qui va modifier le document, et quiconque a un lecteur assez technique pour que la source ne soit pas une insulte. C'est le mauvais choix pour une cliente qui voulait voir une proposition.

### Un Gist

Un Gist est un petit document hébergé avec une URL. Il affiche le GitHub Flavored Markdown, l'adresse du Gist est donc déjà une page lisible, et il conserve un historique de révisions parce qu'un Gist est un dépôt Git en dessous.

| Avantages | Inconvénients |
| --- | --- |
| Affiche correctement le GFM — tableaux, listes de tâches, code entre balises | Le lecteur atterrit dans une interface de développeur |
| Une URL courte, aucune installation pour le lecteur | En créer un demande un compte GitHub, même si lire n'en demande pas |
| Les révisions sont conservées, vous pouvez donc pointer vers une version précise | Un Gist secret n'est pas listé, pas privé : quiconque a l'URL peut le lire |
| Modifiable après coup, dans le navigateur | Supprimer est le seul retrait, et il est définitif |

**Prix :** gratuit. Lire ne demande aucun compte ; en créer un demande un compte GitHub, qui est gratuit.

**Ce que voit une personne non développeuse**

- Une page avec votre document au milieu et une barre d'outils faite de Raw, Blame, History et un bouton de fork tout autour
- Un encart « clone this » proposant une adresse HTTPS et une adresse SSH, qui ne lui disent rien ni l'une ni l'autre
- Des champs de commentaire en dessous, qui ressemblent à une invitation à une conversation que vous ne souhaitez peut-être pas
- Votre avatar et votre nom d'utilisateur GitHub comme signature, ce qui convient à un README et paraît étrange sur un devis pour des travaux
- Sur un téléphone, l'habillage de l'interface prend une bonne part de l'écran avant que le document ne commence

**Qui devrait l'utiliser ?** Quelqu'un qui envoie un extrait, un fichier de configuration, un rapport de bug ou une note à un autre développeur. C'est un bon outil, utilisé constamment pour le mauvais public : le rendu est juste et l'environnement est faux pour quiconque ne vit pas déjà sur GitHub. Et « secret » est le mot qui piège les gens — il signifie que l'URL n'est ni indexée ni listée, pas que l'accès est contrôlé.

### Un fichier dans un dépôt

Si le document appartient à un projet, mettez-le à côté du code. GitHub, GitLab et Bitbucket affichent tous les trois le Markdown dans la vue de fichier, l'URL du fichier est donc déjà une page.

| Avantages | Inconvénients |
| --- | --- |
| Versionné avec le code qu'il décrit | Un dépôt privé demande au lecteur de se connecter |
| Vérifiable — les changements passent par une pull request | Un dépôt public montre votre texte dans une interface construite pour des développeurs |
| Affiche le GFM, tableaux et listes de tâches compris | Le lien pointe vers une branche, il bouge donc |
| Gratuit, et déjà intégré au flux de travail | L'historique garde chaque ancienne version, y compris celle que vous regrettez |

**Prix :** gratuit pour les dépôts publics ; les dépôts privés sont inclus dans les paliers gratuits des trois, avec des limites et des paliers payants décrits sur leurs propres pages tarifaires.

**Les détails qui font la différence**

- Le lien par défaut est `/blob/main/doc.md`, qui résout vers ce que dit `main` aujourd'hui plutôt que ce qu'il disait quand vous avez envoyé le lien
- Appuyer sur `y` sur GitHub réécrit l'adresse pour fixer le commit, ce qui règle la cible mouvante mais pas l'interface autour
- La vue Raw sert le fichier en texte brut, c'est donc un téléchargement ou un mur de source, pas un document
- Les chemins relatifs d'images et de liens se résolvent bien dans la vue du dépôt, et c'est précisément pour cela qu'ils cassent dès que le fichier est lu ailleurs, dans un email comme dans une page convertie
- Supprimer le fichier le retire de l'arbre courant et non de l'historique, ce n'est donc en aucun sens un retrait qu'un avocat accepterait

**Qui devrait l'utiliser ?** Les équipes. C'est le bon foyer pour [la documentation qui vit dans le dépôt](/blog/documentation-that-lives-in-the-repo), là où le public a déjà un compte et où l'historique des versions est le but recherché. C'est le mauvais foyer pour un devis envoyé à une cliente mardi dernier.

### Un lien de stockage cloud

Vous gardez déjà des fichiers dans Drive, Dropbox ou OneDrive, et chacun d'eux vous donnera un lien de partage pour tout ce qui se trouve dans le dossier. C'est le chemin de moindre résistance, et ce que le lecteur obtient à l'autre bout est moins prévisible que pour les autres options ici.

| Avantages | Inconvénients |
| --- | --- |
| Aucun nouvel outil : le fichier est déjà là | Ce que l'aperçu fait d'un `.md` varie selon le fournisseur et change sans préavis |
| Contrôle d'accès par compte, ce qui est un vrai contrôle d'accès | « Toute personne avec le lien » et « des personnes précises » se confondent et se cliquent mal facilement |
| Révoquer le lien fonctionne réellement | Une demande de connexion devant un document que vous vouliez ouvert à tous |
| Expiration et mots de passe existent sur certains forfaits | Souvent, le lecteur obtient simplement un bouton de téléchargement |

**Prix :** palier gratuit avec tout compte grand public. Les forfaits payants sont tarifés au stockage, et les contrôles de lien comme l'expiration et les mots de passe sont réservés aux paliers payants chez certains fournisseurs — vérifiez la page tarifaire du fournisseur avant de promettre à une cliente un lien qui expire.

**Ce qu'il faut vérifier avant d'en envoyer un**

- Ouvrez le lien dans une fenêtre privée. C'est le seul moyen de savoir si votre lecteur rencontre un mur de connexion, car votre propre navigateur est déjà authentifié
- Confirmez si l'aperçu affiche le Markdown, montre la source en texte brut, ou propose un téléchargement — les trois comportements existent, et aucun n'est annoncé
- Vérifiez si le lien autorise la modification. Le réglage par défaut n'est pas toujours « lecture seule », et la différence compte sur un document où figure un prix
- N'oubliez pas que le fichier continue de vivre dans votre dossier. Le renommer ou le déplacer peut casser le lien déjà envoyé

**Qui devrait l'utiliser ?** Quiconque partage avec un groupe nommé au sein d'une organisation qui utilise déjà ce fournisseur, où la connexion n'est pas un obstacle et où les listes d'accès sont le but. Pour un inconnu qui lit une fois sur un téléphone, c'est plus de frottement que la tâche n'en demande.

### Un fichier HTML autonome en pièce jointe

Convertissez le Markdown en un seul fichier HTML aux styles intégrés, et joignez-le. Le lecteur double-clique et obtient un document fini dans le navigateur qu'il a déjà, et [ce qu'un fichier doit contenir pour se comporter ainsi, ce que coûte l'intégration en octets, et comment prouver qu'il ne charge rien](/blog/self-contained-html-explained) mérite d'être su avant de s'appuyer sur ce format.

| Avantages | Inconvénients |
| --- | --- |
| S'ouvre sur n'importe quelle machine, sans installation ni compte | C'est toujours une pièce jointe, les filtres mail s'appliquent donc toujours |
| Fonctionne réseau coupé, dans un train, dans un sous-sol | Plus lourd que la source, parce que la mise en forme voyage avec elle |
| S'imprime et s'exporte en PDF via le dialogue du navigateur lui-même | Vous ne pouvez pas le retirer — le lecteur en a une copie |
| Rien n'est hébergé, rien ne peut donc tomber ni être révoqué sous ses pieds | Pas modifiable d'une façon qu'il appréciera |

**Prix :** gratuit.

**Pourquoi « autonome » est le mot qui porte tout**

- Un document complet suppose un doctype, un `<head>`, et un bloc `<style>` intégré — pas un fragment de balises `<h1>` et `<p>`, qui s'affiche en texte noir non stylé sur toute la largeur de la fenêtre
- Aucune requête externe : pas de feuille de style CDN, pas de police web, pas de mesure d'audience. Un fichier qui charge sa propre mise en forme paraît cassé hors connexion et révèle à quiconque l'ouvre quelque chose sur d'où il vient
- Les images doivent être intégrées plutôt que liées, sinon le document arrive troué sur une machine qui n'a pas votre dossier
- Le HTML brut est autorisé en Markdown, un fichier converti peut donc transporter une balise `<script>` arrivée avec la source. Si le Markdown n'a pas été écrit par vous, [l'assainissement n'est pas optionnel](/blog/sanitising-markdown-safely) avant d'envoyer le résultat à quelqu'un d'autre
- Le fichier est l'enregistrement complet. Six mois plus tard, il s'ouvre exactement comme le jour où vous l'avez envoyé, ce qui est une propriété qu'aucun lien n'a

**Qui devrait l'utiliser ?** Quiconque a un lecteur qui a besoin d'un document plutôt que d'une page, et quiconque veut que l'envoi soit définitif. Propositions, notes de passation, comptes rendus de réunion, tout ce qui sera archivé. C'est aussi la réponse quand l'organisation du destinataire bloque les domaines inconnus mais ouvre volontiers les pièces jointes.

### Un lien publié en lecture seule

Affichez le Markdown une fois, hébergez-le, et transmettez l'adresse. Rien à télécharger, rien à installer, et cela se lit comme un document sur un téléphone dans un ascenseur.

| Avantages | Inconvénients |
| --- | --- |
| Frottement nul pour le lecteur : toucher et lire | Le document dépend d'un service qui reste en ligne |
| Vous pouvez corriger une coquille après l'envoi | Le lecteur n'en a pas de copie, rien ne survit donc à un retrait |
| Révocable, si le lien est conçu pour ça | Le transfert est trivial et invisible pour vous |
| S'affiche correctement sur un petit écran | Le filtre mail d'une organisation peut réécrire ou bloquer l'URL |

**Prix :** gratuit.

**Ce que le mécanisme doit accomplir**

- Servir le document mis en forme, pas la source Markdown, et pas une visionneuse qui a besoin d'un plug-in
- Porter un jeton impossible à deviner dans l'adresse, et rester hors des index de recherche
- Fonctionner non connecté, dès la première visite, sur un téléphone, sur un portable d'entreprise à la politique de navigateur agressive
- Se rendre côté serveur ou livrer le HTML terminé, pour qu'un lecteur avec les scripts bloqués voie quand même le document
- Vous laisser tuer l'adresse de votre propre chef, sans rien demander au lecteur

TransformPipe fait les deux formes de ceci. Déposez le fichier `.md` sur transformpipe.com et récupérez le téléchargement pour un fichier autonome ; connectez-vous et publiez-le pour une page en lecture seule à `/s/<token>`. Révoquer abandonne le jeton, un lien déjà envoyé cesse donc de fonctionner. Depuis un terminal, c'est une commande :

```bash
node cli/tp.mjs login tp_live_…        # une fois, avec une clé API
node cli/tp.mjs push proposal.md --share link
```

**Qui devrait l'utiliser ?** Quiconque envoie un document à quelqu'un qui le lira une fois et ne le classera jamais. Aussi quiconque prévoit de réviser : l'adresse reste la même pendant que le contenu s'améliore, ce qu'une pièce jointe ne peut pas faire.

### Un PDF

Convertir en HTML, l'ouvrir, imprimer en PDF. Ce sont deux étapes au lieu d'une, et cela achète une propriété qu'aucune autre option ici n'a : chaque lecteur voit les mêmes pages dans le même ordre.

| Avantages | Inconvénients |
| --- | --- |
| Ouvrable partout, y compris sur téléphone | Largeur de page fixe, se lit donc mal sur un petit écran |
| Pagination, ce qui compte pour la signature et la citation | Le réajustement disparaît : les longs tableaux se coupent maladroitement entre les pages |
| Accepté par des processus qui n'accepteraient pas un lien | L'éditer est un autre outil et une pire expérience |
| Un enregistrement fixe : la page 4 est la page 4 pour tout le monde | Plus lourd que le HTML dont il vient |

**Prix :** gratuit via le dialogue d'impression propre au navigateur, que tout navigateur moderne inclut.

**Détails à connaître**

- La feuille de style d'impression décide du résultat. Un document qui a l'air correct à l'écran peut perdre les bordures de ses blocs de code et les lignes de ses tableaux sur papier
- Les liens survivent comme annotations cliquables dans la sortie PDF de la plupart des navigateurs, et les pieds de page peuvent ajouter l'URL source, ce qui est utile ou du bruit selon le document
- Les titres ne deviennent des signets PDF que si le convertisseur les émet délibérément ; le chemin d'impression du navigateur ne le fait généralement pas
- Le texte reste sélectionnable, le document est donc cherchable et citable — une capture d'écran n'en est pas un substitut

**Qui devrait l'utiliser ?** Quiconque envoie quelque chose dans un processus : un contrat, une facture, une soumission, tout ce qui sera signé ou archivé. Pas la bonne réponse pour un document que vous comptez réviser deux fois la semaine prochaine.

### Hébergement statique ou Pages

GitHub Pages, GitLab Pages et chaque générateur de site statique convertissent le Markdown en HTML et le mettent en ligne avec navigation et domaine personnalisé. Aucun d'eux n'est une façon de partager un seul fichier.

| Avantages | Inconvénients |
| --- | --- |
| Navigation, recherche et liens croisés entre de nombreux documents | Un fichier de configuration, un thème et une étape de build à maintenir |
| Un domaine personnalisé, qui se lit comme le vôtre plutôt que celui d'un fournisseur | Public par défaut : le contrôle d'accès demande des paliers payants ou un proxy devant |
| Rapide, mis en cache, et gratuit à servir | Publier est un déploiement, une coquille corrigée est donc un commit et une attente |
| Bien documenté et largement déployé | Dépublier signifie un autre déploiement, pas un interrupteur |

**Prix :** gratuit pour les dépôts publics chez les principaux hébergeurs ; publier depuis un dépôt privé demande l'un de leurs forfaits payants, décrits sur leurs propres pages tarifaires.

**Qui devrait l'utiliser ?** Quiconque publie un ensemble de documents qui se lient entre eux et qui souhaitent être trouvés. Si vous avez un fichier et une personne à qui l'envoyer, la charge de travail est énorme et le modèle d'accès est faux — un hébergement statique publie pour tout le monde, et vous vouliez publier pour un seul lecteur.

## Ce qu'un lien de partage doit et ne doit pas demander au lecteur

La plupart des déceptions liées au partage viennent de liens qui demandent quelque chose au lecteur. Vous envoyez une adresse en attendant qu'un document apparaisse, et ce qui apparaît est un formulaire. De votre côté, cela avait l'air normal, parce que votre navigateur était déjà connecté.

Un lien en lecture seule devrait :

- [x] s'ouvrir dans n'importe quel navigateur, sans compte, sans application et sans extension
- [x] montrer le document mis en forme, pas la source Markdown
- [x] être lisible sur un téléphone, à une largeur de lecture raisonnable, sans avoir à zoomer
- [x] fonctionner avec les scripts bloqués, car de nombreux navigateurs d'entreprise les bloquent
- [x] être révocable par vous seul, à tout moment, sans l'aide du lecteur
- [x] porter une adresse impossible à deviner et non indexée

Il ne devrait pas :

- [ ] mettre un mur de connexion devant un document que vous vouliez ouvert à tous
- [ ] collecter une adresse email avant de montrer quoi que ce soit
- [ ] exiger un navigateur précis, ou une application pour une « meilleure expérience »
- [ ] charger des polices, des styles ou des outils d'analyse depuis d'autres hôtes, ce qui révèle à des tiers qui lit quoi
- [ ] casser quand le lecteur le transfère à une collègue, ce qu'il fera

Il existe un cas intermédiaire qui mérite d'être nommé. Quand un document est réellement confidentiel, une liste d'adresses est le bon contrôle : seuls les lecteurs nommés peuvent l'ouvrir, et ils se connectent pour prouver qui ils sont. C'est un mécanisme différent, pas un lien plus strict. Un lien que n'importe qui peut ouvrir convient à une proposition, une spécification ou des notes de réunion ; une liste d'adresses convient à tout ce dont vous seriez mécontent de voir la diffusion. Décider lequel des deux il vous faut prend dix secondes et évite l'échec où un lien « privé » se révèle en réalité public, simplement pas encore trouvé.

## Ce que révoquer doit accomplir pour mériter le nom de révocation

Chaque service doté d'un bouton de partage affirme que le lien peut être révoqué. La plupart entendent par là quelque chose de plus faible que ce que vous supposez. Révoquer n'est vraiment révoquer que si tout ce qui suit tient.

**Cela tue l'adresse, pas seulement l'entrée dans une liste.** Retirer un document de votre propre liste d'éléments partagés pendant que l'URL continue de résoudre est du rangement, pas une révocation. Testez-le en ouvrant l'adresse dans une fenêtre privée après avoir révoqué ; si le document apparaît encore, rien ne s'est passé.

**Cela prend effet maintenant.** Une copie servie depuis un cache pendant une heure de plus est un document encore lisible une heure de plus. Demandez quelle est la durée de vie du cache, et traitez « éventuellement » comme une fonctionnalité différente.

**Cela ne demande rien au lecteur.** Tout mécanisme qui dépend du destinataire pour supprimer un fichier, vider un dossier ou cliquer sur « retirer l'accès » n'est pas une révocation — c'est une requête.

**Cela ne peut pas être annulé par quelqu'un d'autre.** Si une collègue ayant accès au même dossier peut repartager le fichier, l'adresse que vous avez tuée revient sous un autre nom.

**Cela dit ce que cela ne couvre pas.** Révoquer ne peut pas rappeler une copie. Tout ce qui a été téléchargé, imprimé, capturé en écran, transféré en pièce jointe ou aspiré dans un index de recherche est hors de portée définitivement. Un lien révoqué hier peut encore exister dans un proxy de cache chez l'employeur de quelqu'un.

Ce dernier point est la limite honnête de toute l'idée. Une révocation contrôle les lectures futures des personnes qui ont gardé le lien ; elle ne contrôle rien chez les personnes qui ont gardé le document. Si l'exigence est « cela doit cesser d'exister », aucun mécanisme de partage de cette page ne le livre, et vous ne devriez pas dire le contraire à une cliente.

## Là où le choix évident échoue, et ce que cela coûte

Le choix évident, une fois qu'on sait qu'un lien est possible, est de toujours envoyer un lien. C'est un geste pour le lecteur et cela peut être corrigé après l'envoi. Voici ce que cela coûte.

**Un lien est une dépendance.** Le document reste lisible tant qu'un service tourne, qu'un domaine est renouvelé et qu'un compte est en règle. Une pièce jointe n'a aucune condition de ce genre. Pour tout ce qui a une longue durée de vie — un contrat, une spécification que quelqu'un citera dans deux ans — la copie est l'artefact le plus sûr, et le lien est la commodité.

**Un lien fait du document une cible mouvante.** La capacité de corriger une coquille après l'envoi est la même capacité que celle de changer un chiffre après accord. Si le document est un enregistrement, c'est un défaut plutôt qu'un avantage, et la solution est une version fixée ou une pièce jointe.

**Un lien échoue dans l'infrastructure des autres.** Les systèmes de messagerie d'entreprise réécrivent les URL pour les scanner, les clients de chat les déplient en aperçus dont vous n'avez rien demandé, et certains filtres refusent tout bonnement les domaines inconnus. Rien de tout cela n'est visible du côté de l'envoi. Les pièces jointes ont leurs propres problèmes de filtre, mais elles échouent bruyamment.

**Un lien révèle la lecture.** Tout document hébergé peut dire à son propriétaire quand il a été ouvert. C'est parfois exactement ce que vous voulez, et parfois une chose que vous n'aimeriez pas qu'on vous fasse. Si le service charge aussi des polices ou des outils d'analyse depuis ailleurs, la visite du lecteur est révélée à des parties qu'aucun de vous deux n'a choisies.

**Un lien n'est pas un document pour le lecteur.** Il ne peut ni le classer, ni l'annoter, ni le retrouver dans trois mois en cherchant dans son courrier. Beaucoup de lecteurs, face à un lien, essaient immédiatement de sauvegarder la page en fichier — mal. Envoyez le fichier si c'est ce qu'ils vont en faire.

L'échec en miroir mérite aussi d'être nommé. Toujours joindre un fichier converti signifie que chaque correction est un nouvel email, qu'aucun lecteur n'est jamais sûr de la version en cours, et que le document échappe à votre contrôle dès qu'il arrive. Les deux modes d'échec sont symétriques, et c'est pour cela que la réponse consiste à regarder le document plutôt qu'à choisir un favori.

## Comment choisir

1. **Partez de ce qui arrive après réception.** S'il va le modifier, joignez la source ; sinon, il modifiera une mise en forme, ce qu'il fera mal avant de vous la renvoyer. S'il va le classer, envoyez un fichier. S'il va le lire une fois, envoyez un lien.
2. **Comptez ce que le lecteur doit faire.** Chaque installation, chaque compte et chaque boîte de dialogue entre l'adresse et le document vous fait perdre une fraction de vos lecteurs, et cette fraction est la plus élevée précisément chez les gens qui ne voulaient pas lire au départ. Zéro étape est atteignable, traitez donc une étape comme un coût.
3. **Décidez si le document a le droit de changer.** Un lien qui reste à jour convient à un document vivant et pas à un enregistrement. Si quelqu'un doit un jour prouver ce qu'il disait à une date donnée, envoyez une pièce jointe ou fixez une version, car « je l'ai mis à jour depuis » n'est pas une réponse.
4. **Demandez-vous si vous seriez contrarié de le voir transféré.** Si la réponse est oui, une URL impossible à deviner n'est pas le contrôle qu'il vous faut — une liste d'adresses l'est. Bien choisir dès le départ coûte bien moins cher que de le découvrir via une capture d'écran dans le fil de discussion de quelqu'un d'autre.
5. **Ouvrez votre propre partage dans une fenêtre privée avant de l'envoyer.** Cela capture le mur de connexion, l'aperçu qui ne propose qu'un téléchargement, l'image manquante et le lien relatif cassé, tout cela en moins d'une minute, et c'est le seul moyen de voir ce que votre lecteur voit plutôt que ce que montre votre session authentifiée.

## Conclusion

Partager un fichier Markdown n'est pas un problème de conversion, c'est une question sur le lecteur. Si la réponse est « il veut l'imprimer », [les chemins vers le PDF sont ici](/blog/markdown-to-pdf). La question : que fera sa machine de ce que vous envoyez, et qu'en fera-t-il ensuite. Court et définitif, collez-le. Destiné à être modifié, joignez la source et dites ce qu'elle est. Faisant partie d'un projet, commitez-le à côté du code. Destiné à être lu une fois par quelqu'un qui n'a jamais entendu parler de Markdown, convertissez-le en fichier HTML autonome et joignez-le, ou publiez-le comme lien en lecture seule et soyez honnête avec vous-même sur ce que révoquer ce lien peut et ne peut pas défaire. [TransformPipe convertit le Markdown en document HTML complet dans le navigateur](/), gratuitement, sans rien envoyer tant que vous êtes déconnecté — et ensuite, une fois que vous avez le lien ou le fichier, ouvrez-le dans une fenêtre privée et lisez-le comme le fera votre lecteur.

## FAQ

### Comment partager un fichier Markdown avec quelqu'un qui n'a pas d'éditeur Markdown ?

Ne lui envoyez pas de Markdown. Convertissez-le en fichier HTML autonome et joignez-le, ou publiez-le comme lien en lecture seule — les deux lui donnent un document mis en forme dans le navigateur qu'il a déjà. N'envoyez la source `.md` que s'il doit la modifier et vous la rendre.

### Puis-je partager un fichier `.md` en lien sans créer de compte ?

Vous pouvez convertir sans compte, et héberger demande en général d'en créer un. La conversion côté navigateur produit le fichier HTML sans aucune inscription, et ce fichier peut être joint à un email immédiatement. Publier une URL signifie que quelque chose doit l'héberger, ce qui est là qu'un compte entre en jeu — mais le lecteur, lui, n'en a toujours pas besoin.

### Un Gist est-il une bonne façon de partager un document avec quelqu'un de non technique ?

Il affiche le Markdown correctement et l'entoure d'une interface de développeur : Raw, Blame, History, un encart de clonage et des champs de commentaire. Pour une collègue qui utilise GitHub tous les jours, c'est invisible ; pour une cliente, c'est déroutant. Rappelez-vous aussi qu'un Gist secret est non listé plutôt que privé, quiconque détient l'URL peut donc le lire.

### Est-il sûr d'envoyer à quelqu'un un fichier HTML converti ?

Oui, à condition que la conversion ait assaini la source. Markdown autorise le HTML brut, un fichier `.md` que vous n'avez pas écrit peut donc transporter une balise `<script>` ou un gestionnaire `onerror` directement dans la page convertie. Pour vos propres notes, cela n'a pas d'importance ; pour un fichier venu d'ailleurs, vérifiez que le convertisseur assainit avant de transmettre le résultat.

### Que se passe-t-il réellement quand je révoque un lien de partage ?

Au minimum, l'adresse devrait cesser de résoudre immédiatement, pour tout le monde, sans que le lecteur ait à faire quoi que ce soit. Cela ne rappelle pas les copies : tout ce qui a été téléchargé, imprimé, capturé en écran ou mis en cache par un intermédiaire reste lisible. La révocation contrôle les visites futures des gens qui ont gardé le lien, et rien chez les gens qui ont gardé le document.

### Devrais-je envoyer un PDF plutôt qu'un lien ?

Si le document entre dans un processus — signature, soumission, archive — oui, parce qu'un PDF est un enregistrement fixe que tout le monde voit identiquement. S'il sera lu une fois sur un téléphone et peut-être révisé la semaine prochaine, non : les pages fixes se lisent mal sur un petit écran et chaque révision est un nouveau fichier.

### Mes tableaux et mes images survivront-ils au partage ?

Les tableaux survivent si le moteur de rendu gère le GitHub Flavored Markdown, et ils ne survivent pas au collage dans un message, où la ligne d'alignement devient une ligne de tirets. Les images survivent seulement si elles sont intégrées dans le résultat ou hébergées à une adresse absolue, car un chemin relatif pointe vers un dossier que votre lecteur n'a pas.
