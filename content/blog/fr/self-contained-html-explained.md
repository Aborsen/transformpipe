---
title: "HTML autonome expliqué : ce qu'est vraiment un document HTML en un seul fichier"
description: "Ce que contient un document HTML en un seul fichier, ce que coûtent en octets les styles et images intégrés, comment prouver qu'il ne charge rien, et quand l'éviter"
date: 2026-08-14
tag: Publication
keywords: html en un seul fichier, html autonome, css inline dans un fichier html, images en data uri, document html hors connexion, pièce jointe html par email, archiver une page web
---

Un collègue vous envoie un fichier HTML. Vous l'ouvrez dans le train, ou sur un ordinateur portable hors ligne depuis vendredi, et l'une de deux choses se produit. Soit vous obtenez le document — titres, tableaux, images, tout y est —, soit vous obtenez du Times New Roman noir sur toute la largeur de la fenêtre, avec trois icônes d'image cassée à l'endroit des schémas. Les deux fichiers sont du HTML valide. Un seul des deux est un document.

La différence tient à ce que le fichier a besoin d'autre chose pour être lui-même. Une page sur le web ressemble normalement à un sommaire : elle nomme une feuille de style, quelques polices, une poignée d'images, et le navigateur va chercher chacune d'elles à son tour. Cela fonctionne à merveille quand la page vit à une adresse et que le lecteur a une connexion. Cela échoue complètement quand la page est une pièce jointe dans une boîte mail, un fichier dans une archive, ou une pièce à conviction dans un dossier que quelqu'un ouvrira dans quatre ans.

### En bref

Un document HTML en un seul fichier est un fichier `.html` unique qui s'affiche correctement même câble réseau débranché, parce que tout ce dont il a besoin se trouve à l'intérieur : la feuille de style est un bloc `<style>` intégré plutôt qu'un `<link>`, les images sont des URI de données plutôt que des chemins, et aucune police, aucun script ni aucun traqueur n'est chargé depuis où que ce soit. Vérifiez-le en coupant la connexion, en ouvrant le fichier, puis en observant que l'onglet réseau n'enregistre rien — une requête pour le fichier lui-même s'il est servi, et zéro ensuite. C'est le bon format pour archiver, pour envoyer par courriel, et pour remettre un document à quelqu'un en dehors de votre organisation, car il survit au trajet et ne révèle rien de son parcours. Les coûts sont réels et méritent d'être dits : le fichier pèse environ un tiers de plus que ses images, rien à l'intérieur ne peut être mis en cache, et vous ne pouvez pas corriger une coquille sans tout renvoyer.

## Ce que « HTML en un seul fichier » signifie exactement

L'expression est employée à la légère, autant donc la préciser. Un document HTML en un seul fichier tient une seule promesse : ouvert depuis un disque local, sans réseau d'aucune sorte, il s'affiche comme son auteur l'a voulu. Cette promesse a trois conséquences, et elles forment toute la définition.

Chaque règle de style est dans le document. Il n'y a pas de `<link rel="stylesheet">` pointant vers un `styles.css` voisin, ni vers un CDN. Les règles se trouvent dans un élément `<style>` placé dans l'en-tête, ou dans des attributs `style=` sur les éléments, ou les deux.

Chaque image est dans le document. Pas `src="diagram.png"`, qui est un chemin résolu par rapport à l'endroit où le lecteur a rangé le fichier, et pas `src="https://…/diagram.png"`, qui est une requête. Les octets eux-mêmes sont encodés dans l'attribut `src` sous forme d'URI de données, ou l'image est du SVG en ligne, ce qui relève du balisage plutôt que d'un chargement.

Rien d'autre n'est demandé du tout. Pas de police web, pas de balise de mesure d'audience, pas de jeu d'icônes, pas de jQuery « juste pour la table des matières » chargé depuis un CDN. C'est la clause que l'on brise par accident, et c'est celle qui compte le plus, car une seule balise de lien suffit à transformer un document autonome en page qui signale discrètement chaque ouverture.

Ce qu'un document HTML en un seul fichier ne promet *pas*, c'est que ses liens fonctionnent. `<a href="https://example.com/spec">` reste une adresse sur internet, et c'est très bien ainsi — un document qui coupe ses propres sources est pire, pas mieux. L'autonomie porte sur la présentation, pas sur le monde extérieur que votre texte cite.

## Le comparatif rapide : le tableau de bord

| Format | Ce que c'est | A besoin du réseau | Le lecteur peut modifier | Coût principal |
| --- | --- | --- | --- | --- |
| HTML en un seul fichier | Un fichier `.html`, styles intégrés, images en URI de données | Non | Seulement en éditant le balisage | Fichier plus lourd, rien de mis en cache |
| HTML plus un dossier d'annexes | Un fichier `.html` à côté d'un `styles.css` et d'un dossier `images/` | Non, si le dossier voyage avec lui | Seulement en éditant le balisage | Casse dès qu'un fichier est déplacé ou envoyé seul par email |
| HTML lié à un CDN | Un fichier `.html` qui charge polices et CSS à l'ouverture | Oui | Seulement en éditant le balisage | S'affiche mal hors connexion ; se trahit à chaque ouverture |
| MHTML (`.mhtml`) | Une page et ses annexes dans un même conteneur MIME | Non | Non | Chrome et Edge l'écrivent ; Firefox ne l'ouvre pas sans extension |
| Archive web Safari (`.webarchive`) | L'équivalent d'Apple | Non | Non | Pratiquement réservé à Safari |
| PDF | Une mise en page fixe, polices intégrées | Non | Non, sans éditeur de PDF | Se réorganise mal sur téléphone ; l'extraction du texte varie |
| Word (`.docx`) | Une archive zip de XML, styles inclus | Non | Oui, entièrement | Rendu différent selon les versions de Word et les visionneuses |
| Source Markdown (`.md`) | Du texte brut ponctué | Non | Oui, dans n'importe quel éditeur | La plupart des lecteurs voient la source, pas un document |
| Lien hébergé | Une page servie depuis une adresse | Oui, toujours | Non | Demande un hébergement, et l'adresse peut pourrir ou être révoquée |
| Capture d'écran (`.png`) | Une image du document | Non | Non | Pas de texte sélectionnable, pas de liens, pas de recherche |

Les deux lignes qui méritent une comparaison attentive sont la première et la deuxième, car elles se ressemblent sans être équivalentes. Un fichier HTML avec un `styles.css` voisin s'affiche parfaitement depuis `file://` — le CSS se charge sans protester depuis un disque local. Il s'affiche parfaitement jusqu'au moment où quelqu'un sort le `.html` du dossier et l'attache à un email, ce qu'un lecteur qui n'a jamais réfléchi aux annexes fera très exactement. L'autonomie n'est pas d'abord une propriété technique. C'est une propriété qui survit au fait d'être manipulée par des gens.

## Des styles intégrés, et les polices qui, discrètement, ne le sont pas

### Pourquoi la feuille de style liée doit disparaître

Un `<link rel="stylesheet" href="…">` est une deuxième requête, et chaque requête supplémentaire est une façon pour le document d'arriver incomplet. En local, la feuille de style doit se trouver au bon endroit relatif. À distance, l'hôte doit encore exister, encore servir ce chemin, et rester joignable depuis le réseau du lecteur — ce qui, dans une banque ou un hôpital, est très souvent faux.

L'intégration est la solution, et elle n'a rien de subtil : prenez le CSS qui aurait vécu dans le fichier voisin et placez-le dans un bloc `<style>` de l'en-tête. La typographie, les bordures de tableau, les fonds des blocs de code et les règles d'impression d'un document représentent quelques kilo-octets de texte, qui se compressent bien et ne coûtent rien qui vaille la peine d'être mesuré.

Il y a un bénéfice de second ordre que l'on ne remarque qu'après s'être fait piéger une fois. Une feuille de style intégrée ne peut pas être modifiée sous le document. Si votre CSS maison est versionné à une URL et que quelqu'un réécrit l'échelle des titres le trimestre prochain, tout ancien document qui la liait se réaffichera avec la nouvelle échelle — y compris celui attaché à un contrat. Un document qui porte ses styles en lui s'affichera en décembre exactement comme en août, parce que les règles et le texte forment un seul et même artefact.

### L'attribut `style=` n'est pas la même chose

Deux techniques sont appelées « styles intégrés » et elles ne se comportent pas de la même façon. Un élément `<style>` dans l'en-tête contient du vrai CSS : sélecteurs, media queries, `@media print`, pseudo-classes, tout. Un attribut `style=` sur un élément ne contient que des déclarations — pas de sélecteurs, pas de media queries, pas de `:hover`, et aucun moyen de dire « chaque cellule de tableau dans ce document ».

Pour un document que vous archivez ou envoyez par email, c'est le bloc `<style>` qu'il vous faut. Les styles en attribut ne comptent que dans un seul contexte, celui de l'email HTML : les clients de messagerie ont longtemps supprimé les blocs `<style>`, et le compromis là-bas consiste à pousser les déclarations sur les éléments. C'est une raison de garder les deux cas séparés dans votre tête. Une *pièce jointe* HTML en un seul fichier et un *corps d'email* HTML sont deux produits différents avec des contraintes différentes, et un outil qui produit l'un ne produit pas forcément l'autre.

### Les polices : la promesse qu'une seule balise de lien brise

Voici la clause la plus souvent brisée, en général avec de bonnes intentions.

Vous intégrez le CSS avec soin. Vous intégrez chaque image. Puis, parce que le document doit ressembler au reste de vos supports, vous ajoutez une ligne :

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
```

Le fichier n'est plus autonome. Ouvrez-le réseau coupé, et la police retombe sur ce que la pile indique ensuite, ce qui change la longueur des lignes, les sauts de page et parfois la largeur des tableaux. Ouvrez-le réseau branché, et le document fait une requête vers un tiers au moment même de la lecture — depuis l'adresse IP du lecteur, sur son réseau d'entreprise, avec son agent utilisateur, à chaque fois que le fichier est ouvert. Pour une note interne, ce n'est que négligé. Pour un document que vous avez remis à un client, à un régulateur ou à la partie adverse, c'est un fait sur votre fichier que vous n'aviez pas l'intention de créer.

Il existe trois issues honnêtes, et la première est en général la bonne.

**Utilisez une pile de polices système.** `font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` s'affiche dans une police que le lecteur possède déjà, ce qui veut dire : instantanément, hors ligne, sur toutes les plateformes, pour zéro octet. Le document ne ressemble plus à votre marque. Il ressemble à un document, ce qui pour un mémo, une spécification ou des notes de version est le bon résultat.

**Intégrez la police en URI de données dans une règle `@font-face`.** Cela fonctionne, et c'est coûteux. Une seule graisse d'un WOFF2 latin seul pèse typiquement quelques dizaines de kilo-octets avant encodage ; une famille avec le romain, le gras et les deux italiques représente quatre fontes, et le base64 ajoute un tiers sur chacune. Vous échangez une portion fixe et non négligeable du fichier contre une typographie de marque dans un document que personne ne jugera sur sa typographie. Vérifiez aussi la licence avant de le faire : de nombreuses licences de polices commerciales autorisent la diffusion web depuis un domaine que vous contrôlez et ne disent rien d'utile sur la redistribution du binaire dans un fichier envoyé par email à un inconnu.

**Placez le fichier de police à côté du HTML.** C'est le motif du dossier d'annexes sous un nom plus élégant, et il échoue au même endroit : dès que quelqu'un fait voyager le `.html` seul.

## Les images en URI de données, et ce que cela coûte en octets

Une URI de données place les octets là où le chemin aurait été. La syntaxe est un schéma, un type de média, un encodage et la charge utile :

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..." alt="Deployment topology">
```

Le base64 encode trois octets d'entrée en quatre caractères de sortie. C'est une **hausse de 33 %** avant même de compter le préambule `data:image/png;base64,`, et cela ne se récupère pas en étant malin. Un PNG de 1,5 Mo devient environ 2 Mo de texte plantés au milieu de votre balisage. Six captures d'écran de cette taille, et le document est un fichier texte de 12 Mo.

La compression récupère moins que ce que l'on espère. Gzip et Brotli font un travail correct sur du base64 de données déjà compressées — mais correct seulement, car un PNG ou un JPEG est déjà dense en entropie ; c'est l'encodage qui se compresse, pas l'image. Et la compression ne s'applique que sur HTTP. Un fichier posé sur un disque, ou joint à un email, a sa taille non compressée complète, et c'est cette taille qui se heurte aux limites.

Ces limites méritent d'être nommées, car c'est là que le compromis cesse d'être théorique :

| Là où le fichier va | Ce qui coince en premier |
| --- | --- |
| Pièce jointe email | Le plafond de pièce jointe le plus strict de la chaîne, et ce n'est pas le vôtre |
| Passerelle mail d'entreprise | Des scanners qui mettent en quarantaine ou réécrivent les gros joints HTML |
| Un convertisseur ou une API | Un plafond de taille de requête — TransformPipe limite une conversion à 10 Mo, et un document gardé dans un compte à 4 Mo, parce qu'une fonction Vercel refuse une requête ou une réponse au-delà de 4,5 Mo |
| Un navigateur sur téléphone | La mémoire, et le temps passé à décoder plusieurs mégaoctets de base64 avant le premier affichage |
| Une revue de code | Rien du tout, et c'est le problème : le diff est illisible |

Deux techniques rendent le coût gérable.

**Redimensionnez avant d'encoder.** La plupart des captures d'écran intégrées font deux ou trois fois la largeur à laquelle elles sont affichées. Réduire de moitié les dimensions en pixels d'une capture divise le fichier par environ quatre, et le surcoût de 33 % de l'encodage s'applique ensuite à un nombre bien plus petit. Cette seule étape apporte plus que n'importe quel débat sur les formats.

**Utilisez le SVG comme balisage, pas comme base64.** Un schéma, un logo, un graphique ou une icône dessinés en SVG peuvent être collés dans le document sous forme d'un élément `<svg>`. Il n'y a alors aucun surcoût d'encodage, le résultat est du texte qui se compresse remarquablement bien, et il reste net à n'importe quel zoom. Si une image de votre document est un trait, elle ne devrait presque jamais être un PNG en base64.

Ce que les URI de données ne peuvent pas réparer, c'est une image que vous avez pointée ailleurs. `<img src="diagram.png">` continue de signifier `diagram.png` relatif au dossier du lecteur, et un convertisseur qui intègre les styles n'aura pas nécessairement intégré cette image-là aussi. L'ensemble complet de ce qui casse quand un fichier déménage est un sujet à part entière — [les chemins relatifs, les identifiants d'ancre et les liens de référence échouent chacun différemment](/blog/images-and-links-that-still-work) — et l'habitude pratique consiste à ouvrir la source HTML et à lire chaque valeur `src=` avant d'envoyer quoi que ce soit.

## Comment vérifier qu'un fichier est vraiment autonome

Ne faites confiance à aucune affirmation, y compris la nôtre. La vérification prend environ une minute et elle est concluante.

**1. Débranchez la machine.** Coupez le Wi-Fi, débranchez le câble, passez le portable en mode avion. Faites cela en premier, car c'est la seule étape qu'un cache tiède ne peut pas tromper. Un fichier déjà ouvert une fois peut avoir chaque police et chaque feuille de style dans le cache HTTP du navigateur, et il s'affichera parfaitement tout en dépendant entièrement du réseau.

**2. Ouvrez le fichier depuis `file://`.** Double-cliquez dessus, ou glissez-le dans une fenêtre de navigateur. Observez la police, les bordures de tableau, les fonds des blocs de code et chaque image. Une police de repli est le signe habituel : si les titres paraissent plus étroits ou plus larges que dans votre souvenir, quelque chose était chargé.

**3. Ouvrez les outils de développement, allez dans l'onglet réseau, et rechargez avec lui ouvert.** C'est le vrai test. Sur un document `file://`, le bon résultat est une liste de requêtes qui ne contient que le document et rien d'autre — pas de CSS, pas de polices, pas d'images, pas de balises de mesure. Si une ligne apparaît, cliquez dessus et lisez l'URL ; voilà votre fuite, nommée et localisée.

**4. Cherchez dans la source les quatre choses qui chargent.** Ouvrez le fichier dans un éditeur de texte et cherchez `<link`, `<script src`, `url(` et `src="http`. Chaque résultat est soit quelque chose que vous avez intégré délibérément, soit une dépendance que vous ignoriez avoir. `url(` capture les cas de polices et d'images de fond que l'onglet réseau manquera si la règle ne s'est jamais appliquée à quelque chose visible à l'écran.

**5. Essayez-le dans un second navigateur, sur une seconde machine, depuis un autre dossier.** Copiez le fichier sur une clé USB, branchez-la sur une machine qui ne l'a jamais vu, et ouvrez-le là. Cela capture d'un coup les chemins relatifs, les ressources en cache et les différences de polices selon la plateforme. C'est aussi, incidemment, une répétition de ce que votre lecteur s'apprête à faire.

**6. Imprimez-le en PDF pendant que vous y êtes.** L'aperçu avant impression révèle si le document a des règles d'impression, et si quelque chose est coupé au bord de la page. Si un PDF est le résultat final visé, [le dialogue d'impression du navigateur lui-même est un chemin raisonnable pour y arriver](/blog/markdown-to-pdf) et un document HTML en un seul fichier est exactement l'entrée qu'il souhaite.

Une remarque sur les scripts. Un fichier autonome peut légitimement contenir du JavaScript en ligne — un bouton pour la table des matières, un interrupteur de mode sombre — et un script en ligne n'est pas une dépendance réseau. C'est en revanche du code exécutable dans un document que quelqu'un ouvrira d'un double-clic, ce qui est un risque différent. Si la source du document était du Markdown venu de l'extérieur de votre organisation, du HTML brut dans la source peut faire passer `<script>`, `onerror=` et des URL `javascript:` directement dans la sortie, et [assainir contre une liste blanche fixe est ce qui arrête cela](/blog/sanitising-markdown-safely). Cherchez `<script` dans tout fichier que vous n'avez pas produit vous-même avant de l'ouvrir.

## Ce que vaut un fichier unique

Le format gagne sa place dans trois situations. Ce ne sont pas les mêmes, et chacune valorise une propriété différente.

### Archiver

Un document archivé a une seule exigence : il doit encore s'afficher quand tout autour de lui a changé. Cela inclut le CDN qui servait ses polices, le compartiment S3 qui hébergeait ses images, l'entreprise qui hébergeait les deux, et la version de navigateur qui était courante au moment de l'écriture.

| Propriété | Pourquoi l'archivage s'en soucie |
| --- | --- |
| Aucune requête externe | Les hôtes sollicités ne répondront pas tous encore |
| Styles figés dans le fichier | Le document ne peut pas être réaffiché par le CSS ultérieur de quelqu'un d'autre |
| Texte brut sur disque | Cherchable avec grep, diffable en principe, lisible par des outils qui n'existent pas encore |
| Un fichier, un objet | Rien à perdre ; pas de dossier à garder ensemble |

Le HTML est un bon format d'archivage pour une raison qui n'a rien à voir avec la mode : c'est du texte, sa spécification est publique, et les navigateurs continuent d'afficher les vieux documents. Un document HTML en un seul fichier est un objet texte auto-descriptif, et c'est la propriété qui survit aux formats qui exigent une application précise.

Ce n'est pas un format de *préservation* au sens institutionnel — c'est à cela que servent les conteneurs WARC et leurs outils, et une bibliothèque ou des archives nationales utiliseront ceux-là. Pour une équipe qui garde l'état d'une décision, un manuel d'exploitation tel qu'il était lors d'un incident, ou un rapport tel qu'il a été signé, un fichier unique est la version pragmatique de la même idée.

**Pour qui c'est fait :** pour quiconque doit répondre à « que disait-on à l'époque ? » sans pouvoir compter sur un lien.

### Envoyer par email

L'email est l'environnement le plus rude qu'un document rencontre, parce que rien n'y est sous votre contrôle. Le client, la passerelle, la connexion et l'appareil du lecteur sont tous des décisions de quelqu'un d'autre.

Une pièce jointe HTML en un seul fichier se comporte bien dans cet environnement pour une raison simple : il n'y a rien qui puisse manquer. Attendez-vous à ce que le lecteur la télécharge plutôt que de la voir dans un volet d'aperçu, et attendez-vous à ce que certains systèmes de messagerie se méfient des pièces jointes `.html` en général — un zip, ou un lien vers le fichier, est le contournement habituel quand une passerelle bloque. Ce que vous évitez, c'est l'échec bien plus fréquent qui consiste à envoyer un `.html` en laissant son dossier `images/` derrière, ce qui produit un document plein d'icônes d'images cassées et un email de relance.

| Propriété | Pourquoi l'email s'en soucie |
| --- | --- |
| Une seule pièce jointe | Aucun dossier à zipper, rien à rassembler pour le lecteur |
| S'affiche hors ligne | Le lecteur peut l'ouvrir en avion, en train, ou sur un portable verrouillé |
| Aucun chargement | Le document ne signale ni quand, ni où, ni combien de fois il a été lu |
| Du texte, pas un conteneur | Il s'ouvre dans un navigateur que le lecteur a déjà |

**Pour qui c'est fait :** quiconque envoie un document terminé à une personne nommée, en particulier en dehors de ses propres systèmes. Les alternatives — et là où chacune échoue — [méritent d'être lues avant d'en choisir une](/blog/share-a-markdown-document-as-a-link).

### Le remettre à quelqu'un en dehors de votre entreprise

C'est le cas où l'autonomie cesse d'être une commodité et devient une question d'hygiène. Quand un document quitte votre organisation, il est examiné par des gens et des systèmes qui ne vous doivent rien.

Un fichier qui charge depuis un CDN est un fichier qui fait des requêtes depuis l'intérieur du réseau du destinataire. Son équipe de sécurité peut le remarquer ; son proxy peut le bloquer ; son auditeur peut demander à quoi servait la requête. Un fichier qui ne charge rien ne soulève aucune de ces questions, et il peut être vérifié simplement en le lisant — ce qu'un destinataire prudent fera précisément.

Il y a une réciproque qui mérite d'être énoncée, car elle vous concerne en tant que lecteur. Un document HTML en un seul fichier que vous recevez est plus facile à vérifier qu'une page, mais il n'est pas automatiquement sûr : le script en ligne s'exécute à l'ouverture, et `file://` est un contexte permissif. Lisez la source, ou ouvrez le fichier JavaScript désactivé, si vous avez une raison quelconque de vous méfier de l'expéditeur.

| Propriété | Pourquoi une remise externe s'en soucie |
| --- | --- |
| Aucune requête vers des tiers | Rien qu'un proxy puisse bloquer ou qu'un audit de sécurité puisse questionner |
| Aucun traçage | Le document ne peut pas révéler qu'il a été ouvert, ce qui est le but |
| Vérifiable | Le tout peut être lu dans un éditeur de texte |
| Ni compte ni installation | Le destinataire l'ouvre dans le navigateur qu'il a déjà |

**Pour qui c'est fait :** quiconque envoie un document à travers une frontière d'entreprise — propositions, spécifications, comptes rendus d'incident, livrables, tout ce qu'un avocat pourrait un jour brandir.

## Où un fichier unique est la mauvaise réponse, et ce que cela coûte

Le format a de vrais inconvénients. Une page qui n'énumère que les avantages vend quelque chose.

**Le fichier est plus lourd, et la hausse n'est pas marginale.** Le base64 ajoute un tiers à chaque image intégrée, et intégrer des ressources partagées signifie que chaque document porte sa propre copie. Dix rapports qui intègrent chacun le même logo et les deux mêmes schémas portent dix copies de chacun. Si vous produisez des documents en volume, le coût cumulé est réel, et la déduplication qu'apporteraient des ressources partagées est exactement ce à quoi vous avez renoncé.

**Rien à l'intérieur ne peut être mis en cache.** Une page hébergée charge sa feuille de style une fois et la réutilise sur chaque page du site ; la deuxième page est presque gratuite. Un fichier unique n'a pas de deuxième page. Chaque document paie ses propres styles, ses propres polices et ses propres images, à chaque transfert. C'est le bon compromis pour un document qui voyage seul, et le mauvais pour un site avec navigation.

**Modifier signifie tout renvoyer.** Une coquille dans une page hébergée est une correction d'une ligne que chaque lecteur voit à sa prochaine visite. Une coquille dans une pièce jointe est une nouvelle pièce jointe, un email d'excuse, et deux versions du document dans la boîte du destinataire sans indication de laquelle est actuelle. Les fichiers uniques n'ont pas de chemin de mise à jour ; c'est intrinsèque, pas une fonctionnalité manquante.

**Il n'y a aucune mesure d'audience, par construction.** Si vous devez savoir si la proposition a été lue, il vous faut un lien, et un lien est l'opposé d'un fichier autonome. On ne peut pas avoir les deux propriétés dans un seul artefact.

**Les très gros fichiers se comportent mal.** Plusieurs mégaoctets de base64 doivent être décodés avant que le navigateur puisse afficher les images, et sur un téléphone à mémoire modeste, c'est une pause visible ou pire. Il existe une taille au-delà de laquelle un fichier unique est une mauvaise expérience tout en étant techniquement correct, et les documents chargés de captures d'écran l'atteignent vite.

**Ce n'est pas un site web.** Pas de navigation entre documents, pas de recherche, pas de flux, pas de liens croisés qui se résolvent. Un ensemble de documents qui se référencent mutuellement veut un hébergement, et prétendre le contraire produit un dossier de fichiers avec des liens morts entre eux.

**Certaines visionneuses ne coopéreront pas.** Les passerelles mail qui mettent en quarantaine les pièces jointes HTML, les systèmes de gestion documentaire qui n'indexent pas le HTML, les outils de revue qui n'affichent rien — ce sont des problèmes de politique, pas des problèmes techniques, et ils clôturent le débat dans certaines organisations quel que soit le mérite. Quand cela arrive, le PDF est le format que l'institution accepte, et un document HTML en un seul fichier est la meilleure entrée possible pour en produire un.

## Comment choisir

1. **Partez de l'endroit où le fichier sera ouvert, pas de ce qui est commode à produire.** Un document ouvert depuis une boîte mail sur un portable déconnecté doit être autonome ; une page ouverte depuis une URL avec un cache tiède ne devrait pas l'être, car vous jetteriez la mise en cache pour rien.
2. **Comptez les requêtes, pas les fonctionnalités.** Ouvrez l'onglet réseau sur le résultat et regardez le nombre de lignes. Tout nombre au-dessus de un signifie que le fichier a des dépendances, et chaque dépendance est un endroit où le document peut arriver incomplet.
3. **Redimensionnez les images avant de les intégrer, car le surcoût d'encodage de 33 % multiplie tout ce qu'on lui donne.** Une capture d'écran deux fois plus large que son affichage coûte quatre fois les octets nécessaires, et ce gaspillage est de loin le principal contributeur à un fichier unique boursouflé.
4. **Décidez une bonne fois pour toutes, par écrit, du sort des polices web.** Soit le document utilise une pile de polices système et reste honnête, soit il intègre des graisses dont vous avez vérifié la licence ; une police liée est la décision de faire une requête depuis la machine du lecteur, et cela ne devrait pas arriver par accident.
5. **Si le document va changer, n'envoyez pas de fichier.** Les pièces jointes n'ont pas de chemin de mise à jour, donc tout ce qui est encore à l'état de brouillon veut un lien, et tout ce qui est définitif veut un fichier. Envoyer un fichier pour quelque chose d'inachevé garantit une seconde version en circulation.
6. **Testez-le comme votre lecteur l'ouvrira, sur une machine qui ne l'a jamais vu, hors ligne.** Chaque échec décrit sur cette page — la police de repli, l'image cassée, la feuille de style manquante, la requête surprise — se révèle dans ce seul test, et aucun d'eux ne se révèle dans l'aperçu de l'outil lui-même.

## Conclusion

Un document HTML en un seul fichier est une petite idée avec un bénéfice précis : il s'affiche partout pareil parce qu'il ne demande rien, ce qui en fait le bon format pour les archives, les pièces jointes et tout ce qui traverse une frontière d'entreprise. Les coûts sont tout aussi précis — un tiers d'octets en plus sur chaque image, aucune mise en cache, et aucun moyen de corriger une erreur sans tout renvoyer — c'est donc le mauvais format pour un site, pour un brouillon, ou pour tout ce dont vous avez besoin d'accusés de lecture. Si vous avez un fichier Markdown et une personne qui attend un document, [la conversion dans le navigateur](/) produit exactement cela : un fichier HTML avec ses styles intégrés, rien de chargé, et, non connecté, rien d'envoyé nulle part au passage. Débranchez ensuite la machine et ouvrez-le, car une affirmation d'autonomie que vous n'avez pas testée n'est qu'une affirmation.

## FAQ

### Qu'est-ce qu'un document HTML en un seul fichier ?

C'est un fichier `.html` unique qui s'affiche correctement sans aucune connexion réseau, parce que sa feuille de style est un bloc `<style>` intégré, ses images sont incrustées en URI de données ou en SVG en ligne, et il ne charge ni police, ni script, ni traqueur. Ouvert depuis un disque local, il ne fait aucune requête du tout. Les liens dans le texte pointent toujours vers internet, et c'est voulu — l'autonomie porte sur la présentation, pas sur les sources citées.

### Comment vérifier qu'un fichier HTML est vraiment autonome ?

Débranchez d'abord la machine du réseau, pour qu'aucune ressource en cache ne flatte le résultat, puis ouvrez le fichier et rechargez-le avec l'onglet réseau des outils de développement ouvert. Le bon résultat est une liste de requêtes contenant le document et rien d'autre. Chercher `<link`, `<script src`, `url(` et `src="http` dans la source capture tout ce que l'onglet réseau a manqué parce que la règle ne s'est jamais appliquée.

### De combien l'intégration des images alourdit-elle le fichier ?

Le base64 encode trois octets en quatre caractères, chaque image intégrée grossit donc d'environ 33 % avant même de compter le préambule du type de média, et la compression n'en récupère qu'une partie parce que les données photographiques et PNG sont déjà denses. Redimensionner une capture d'écran à la largeur à laquelle elle est réellement affichée économise généralement bien plus que n'importe quel choix d'encodage. Un trait devrait être du SVG en ligne, qui n'a aucun surcoût d'encodage.

### Puis-je utiliser une police web dans un fichier autonome ?

Pas depuis un CDN — c'est une requête réseau, qui à la fois change la police quand le lecteur est hors ligne et signale chaque ouverture à un tiers. Vous pouvez intégrer une graisse en base64 dans une règle `@font-face` si la licence autorise la redistribution, au prix de quelques dizaines de kilo-octets par graisse. Pour la plupart des documents, une pile de polices système est le meilleur compromis : instantanée, gratuite, et disponible sur toutes les plateformes.

### Le HTML en un seul fichier vaut-il mieux qu'un PDF pour envoyer un document ?

Ils optimisent des choses différentes. Le HTML se réorganise selon l'écran du lecteur, garde le texte sélectionnable et cherchable, et se lit dans n'importe quel navigateur sans application supplémentaire ; un PDF fixe la mise en page, ce qui compte quand la pagination fait partie du contenu ou quand une institution n'accepte que des PDF. Une réponse pratique consiste à produire d'abord le HTML et à l'imprimer en PDF quand un PDF est spécifiquement exigé.

### Est-il sûr d'ouvrir un fichier HTML autonome que quelqu'un m'a envoyé ?

Plus sûr qu'une page hébergée sur un point, et pas sur un autre. Il ne charge rien, donc il ne peut pas téléphoner à la maison ni charger de code distant, mais le JavaScript en ligne à l'intérieur s'exécute quand même quand vous l'ouvrez. Si vous avez une raison de vous méfier de l'expéditeur, lisez d'abord la source à la recherche de `<script`, ou ouvrez le fichier avec JavaScript désactivé.

### Pourquoi un fichier HTML que j'ai reçu paraît-il sans style ?

Presque toujours parce qu'il n'était pas autonome : il liait une feuille de style qui ne se trouve plus à côté de lui, ou qui vit sur un hôte que votre réseau ne peut pas joindre. Un navigateur à qui l'on donne du HTML sans CSS applicable l'affiche dans sa police serif par défaut sur toute la largeur de la fenêtre, ce qui donne au fichier l'air d'un brouillon en texte brut plutôt que d'un document. Demandez à l'expéditeur une version avec les styles intégrés.
