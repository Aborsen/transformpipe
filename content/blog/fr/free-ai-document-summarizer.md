---
title: "Résumé IA gratuit pour vos documents Markdown, HTML et autres"
description: "Les façons gratuites d’obtenir un résumé IA d’un document Markdown, HTML, Word ou CSV : un résumé intégré, un modèle de chat gratuit, et ce que chacun coûte"
date: 2026-09-14
tag: Workflow
keywords: résumé ia gratuit, résumé de document par ia, résumer un fichier markdown, résumer un fichier html, outil de résumé de document gratuit, résumé ia sans téléversement, résumer un fichier avec l’ia gratuitement
---

Un document arrive dans votre historique avec un nom et une taille, et ni l’un ni l’autre ne dit s’il vaut la peine d’être ouvert. Un résumé le dirait — trois phrases qui annoncent ce que la chose est vraiment, avant que vous ne vous engagiez à la lire. Jusqu’ici, en obtenir un voulait dire recopier le texte quelque part où un modèle d’IA attend, ce qui est un coût bien réel pour un document que vous cherchiez justement à éviter de lire.

### En bref

**Un convertisseur avec un résumé intégré** est la voie la moins pénible : convertissez ou enregistrez le document, cliquez sur Résumé, et un résultat mis en cache revient — rien à recopier, pas de compte séparé, rien à coller. [Le résumé de TransformPipe](/) appelle directement le modèle Gemini Flash de Google, trois à cinq phrases simples, mises en cache sur le document pour être calculées une fois et lues autant de fois qu’on veut, gratuitement jusqu’à 20 résumés par jour et par compte. **Un modèle de chat gratuit** — ChatGPT ou l’application Gemini, tous deux utilisables sans carte bancaire — fonctionne pour n’importe quel document que vous acceptez de coller à la main, sans plafond quotidien sur la conversation elle-même, mais sans cache, sans API et sans mémoire une fois la discussion fermée. **Notion AI** résume les pages nativement, mais uniquement dans l’offre payante Business à 20 $ par membre et par mois (vérifié sur notion.com, le 14 septembre 2026) — les espaces gratuits et Plus n’ont droit qu’à un essai limité, pas à la vraie chose. Quel que soit votre choix, la question honnête reste de savoir où part le texte avant que vous ne colliez un contrat ou une note médicale dans l’un d’eux.

## Ce que « gratuit » veut dire ici

Toutes les options ci-dessous sont gratuites au sens ordinaire — aucune carte exigée pour essayer — mais « gratuit » cache de vraies différences dès qu’on regarde la suite. Un résumé que vous générez une fois et ne revoyez jamais vous coûte le temps de recoller le texte dans une semaine. Un résumé mis en cache sur le document est là quand vous ouvrez celui-ci, sans rien redemander. Et un résumé produit par un service qui conserve vos données pour entraîner ses modèles est une gratuité d’une autre nature que celle d’un service qui ne le fait pas, quel que soit le prix affiché.

## Comparatif rapide : l’aide-mémoire

| Outil | Idéal pour | Capacité principale | Prix |
| --- | --- | --- | --- |
| Le résumé intégré de TransformPipe | Un document déjà présent dans votre historique | Mis en cache sur le document, régénérable à la demande, rien à recoller | Gratuit, 20/jour par compte |
| ChatGPT (offre gratuite) | Un document que vous avez sous les yeux et pouvez coller | Chat texte gratuit et illimité depuis août 2026 | Gratuit |
| Google Gemini (application, palier gratuit) | La même chose, sur la famille de modèles maison de Google | Modèles Flash et Flash-Lite, plafonds de requêtes quotidiens | Gratuit |
| Notion AI | Une page qui vit déjà dans Notion | Résume et rédige à l’intérieur même de la page | Offre Business uniquement, 20 $/membre/mois |
| Un modèle open source en local | Tout ce qui ne doit pas quitter votre machine | Fonctionne entièrement hors ligne, sans le moindre compte | Gratuit, installation nécessaire |
| Coller dans n’importe quel assistant | Un cas isolé, là où vous avez déjà une fenêtre de discussion | Aucun nouvel outil à apprendre | Gratuit, qualité variable selon le modèle |

## Le résumé intégré de TransformPipe — rien à recoller

Une fois un document converti ou enregistré, un onglet Résumé s’installe à côté d’Aperçu et de Source. L’ouvrir la première fois appelle le modèle ; l’ouvrir ensuite lit le résultat en cache, parce que l’intérêt d’un cache est justement qu’un document consulté deux fois ne soit pas réfléchi deux fois.

| Avantages | Inconvénients |
| --- | --- |
| Rien à recopier nulle part — le document est déjà là | 20 résumés par jour et par compte, ce n’est pas illimité |
| En cache : le modèle tourne une fois, le résultat se relit autant que vous voulez | Trois à cinq phrases par conception — ce n’est pas un substitut à la lecture d’un document dont vous avez vraiment besoin en détail |
| Un bouton « Régénérer » quand le document a changé et que le résumé en cache, lui, non | Exige d’abord que le document soit enregistré sur un compte — un fichier converti mais non enregistré n’a rien sur quoi attacher le résumé |
| Disponible aussi via l’API (`POST /api/v1/documents/:id/summary`), pour qu’un script demande la même chose | Nécessite qu’une clé Google AI soit configurée sur l’installation — l’héberger soi-même demande votre propre clé |

**Prix :** gratuit, 20 par jour et par compte. L’API et la ligne de commande (`tp summary <id>`) tirent sur le même quota.

**Détails techniques.** Le modèle est Gemini Flash de Google, appelé directement avec une clé Google AI Studio plutôt qu’à travers une passerelle payante — un choix de conception fait précisément parce qu’il préserve un vrai palier gratuit au lieu de passer par un quota partagé. L’invite est plafonnée aux 60 000 premiers caractères du document et demande trois à cinq phrases simples, sans titres, sans répéter le titre, le mode de raisonnement étendu du modèle étant délibérément désactivé : un résumé de trois phrases n’a pas besoin d’un modèle qui prend le temps de décider comment se formuler.

**Pour qui ?** Pour quiconque a dans son historique plus de documents qu’il n’en tient en tête, cherche lequel ouvrir ensuite, ou veut confirmer qu’un enregistrement a bien capturé ce qu’il voulait garder — sans deuxième outil, deuxième onglet ni deuxième compte. Si le document est sorti d’un modèle au départ, [transformer cette sortie en une page lisible par quelqu’un](/blog/ai-output-to-a-shareable-page) est le même flux de travail, une étape plus tôt.

## L’offre gratuite de ChatGPT — collez, sans limite sur la conversation

Depuis août 2026, OpenAI a entièrement supprimé le plafond de messages sur le chat texte de l’offre gratuite (rapporté à l’époque par Engadget et d’autres) — les comptes gratuits peuvent tenir une conversation aussi longue qu’ils le souhaitent, même si des plafonds distincts s’appliquent toujours à la génération d’images, aux téléversements de fichiers et à la voix, et même si l’accès gratuit se limite au plus petit modèle actuel d’OpenAI.

| Avantages | Inconvénients |
| --- | --- |
| Aucune limite quotidienne sur la conversation en texte brut | Chaque document est un collage manuel — pas d’historique, pas de cache, pas de « j’ouvre ce document et je vois son résumé » |
| Aucun coût de compte | L’accès gratuit se limite au plus petit modèle de la gamme actuelle |
| Marche sur tout ce que vous pouvez coller — Markdown, texte brut, un tableau collé | Pas d’accès API dans l’offre gratuite, donc rien à appeler depuis un script |
| Interface familière si vous vous en servez déjà pour autre chose | Le sort du texte collé dépend des réglages de données de votre propre compte — vérifiez-les avant d’y coller quoi que ce soit de sensible |

**Prix :** gratuit pour le chat texte ; les offres payantes ajoutent des modèles plus grands, des plafonds de téléversement plus hauts et l’accès à l’API.

**Pour qui ?** Pour un résumé ponctuel d’un document que vous avez sous les yeux, quand récupérer automatiquement le même résumé la prochaine fois que vous ouvrez le fichier ne vous intéresse pas. Si vous voulez que l’assistant convertisse et partage aussi, plutôt que de seulement lire, [un connecteur est un chemin plus court qu’une fenêtre de discussion](/blog/converting-documents-from-an-assistant).

## L’application Gemini de Google, palier gratuit

La famille de modèles que le résumé intégré appelle par son API est aussi accessible directement, dans l’interface de discussion maison de Google, sans carte bancaire.

| Avantages | Inconvénients |
| --- | --- |
| Gratuit et sans carte, sur gemini.google.com et dans les applications mobiles | Le palier gratuit est plafonné à environ 1 000 requêtes par jour avec une limite par minute, ce n’est pas illimité |
| Les modèles Flash et Flash-Lite restent gratuits ; les modèles de niveau Pro sont passés derrière une offre payante en avril 2026 | Même forme « coller et oublier » que n’importe quelle fenêtre de discussion — aucun historique de documents propre |
| La même qualité de modèle sous-jacent qu’un appel d’API payant | Une fenêtre de discussion, pas un outil documentaire — pas de conversion, pas de cache, pas de lien de partage |

**Prix :** palier gratuit à 0 $ ; les offres payantes commencent à 4,99 $ par mois pour plus de marge.

**Pour qui ?** Pour quelqu’un qui veut Gemini en particulier, hors de tout convertisseur, avec des documents qu’il est à l’aise de coller dans une fenêtre de discussion généraliste.

## Notion AI — natif, mais pas dans l’offre gratuite

Si le document vit déjà dans Notion, Notion AI peut résumer la page sur place, rédiger du texte et répondre à des questions à son sujet — vraiment pratique quand le résumé est une chose de plus à faire sans quitter la page.

| Avantages | Inconvénients |
| --- | --- |
| Résume et rédige sans quitter la page où le document se trouve déjà | L’accès complet à l’IA exige l’offre Business, 20 $ par membre et par mois (vérifié sur notion.com, le 14 septembre 2026) |
| Aucun outil séparé, aucun collage — il lit la page à laquelle il est déjà attaché | Les espaces gratuits et Plus n’ont qu’un essai limité des fonctions d’IA, pas un usage continu |
| Utile au-delà du résumé : rédaction, remplissage automatique de bases, comptes rendus de réunion | N’aide que les documents qui sont des pages Notion — rien en dehors de l’espace de travail |

**Prix :** inclus dans l’offre Business ; il n’est plus proposé comme module autonome depuis 2026.

**Pour qui ?** Pour une équipe qui paie déjà Notion Business et dont le document en question est une page, plutôt qu’un fichier à convertir ou à partager ailleurs.

## Un modèle open source en local — rien ne quitte la machine

Pour un document qui ne doit vraiment pas atteindre un réseau — juridique, médical, non publié — un modèle open source exécuté localement (Llama, Mistral ou équivalent, via un moteur comme Ollama ou LM Studio) supprime la question de savoir où va le texte, puisqu’il ne part jamais.

| Avantages | Inconvénients |
| --- | --- |
| Rien n’est envoyé nulle part, jamais — la seule réponse honnête pour les documents les plus sensibles | Une vraie installation : un logiciel, un modèle de plusieurs gigaoctets à télécharger, et une machine capable de le faire tourner correctement |
| Pas de compte, pas de quota, pas de limite de débit une fois en route | La qualité des résumés reste en retrait des plus gros modèles hébergés, même si l’écart s’est nettement réduit |
| Fonctionne hors ligne, indéfiniment, sans coût récurrent | Aucun cache ni historique de documents, sauf à le construire vous-même |

**Prix :** gratuit, open source ; le coût, c’est votre temps et votre machine, pas un abonnement.

**Pour qui ?** Pour quiconque a pour vraie contrainte « ceci ne peut pas quitter ma machine » plutôt que « ceci doit aller vite » — ce sont deux problèmes différents, avec des bonnes réponses différentes.

## Là où un résumé rapporte le plus : le document qui était cinquante documents

Le cas où un résumé sert le moins est celui que les gens essaient en premier — un document que vous avez écrit vous-même la semaine dernière. Vous savez déjà ce qu’il dit ; le résumé ne vous apprend rien.

Le cas où il sert vraiment, c’est l’export fusionné : un espace Notion entier, un espace Confluence, ou un coffre Obsidian transformé en un seul document Markdown. [Ces trois exports arrivent sous forme d’une archive zip de nombreuses pages](/blog/markdown-from-notion-obsidian-and-confluence), et les fusionner produit un document unique, exact, complet et complètement illisible au premier regard — quarante mille mots avec une table des matières, où la table des matières énumère des titres de pages écrits pour un wiki, pas pour un lecteur qui arrive sans contexte.

C’est exactement la forme qu’un résumé de trois phrases répare. Convertissez l’export, enregistrez-le, et le résumé répond à « qu’y a-t-il vraiment là-dedans » sans qu’il faille l’ouvrir — c’est la question que l’on se pose un an plus tard devant un espace de travail archivé, et celle à laquelle personne ne peut répondre à partir d’un nom de fichier.

| Source | Taille typique une fois fusionné | Ce à quoi le résumé répond |
| --- | --- | --- |
| [Un export Notion](/notion-to-markdown) | Toutes les pages de l’espace de travail, dans l’ordre | Pour quel projet ou quelle équipe cet espace existait, et à peu près quand |
| [Un export d’espace Confluence](/confluence-to-markdown) | Toutes les pages de l’espace, macros aplaties | Si cet espace était de la documentation, des comptes rendus ou un journal de décisions |
| [Un coffre Obsidian](/obsidian-to-markdown) | Toutes les notes, wikiliens résolus en mots simples | De quoi le coffre parlait réellement, sous une arborescence que seul son auteur comprenait |

Le quota compte moins qu’il n’y paraît ici. Vingt résumés par jour, c’est très peu pour un script qui parcourt un dossier et largement assez pour une personne qui décide lequel des exports archivés du trimestre dernier elle va ouvrir — et le résultat est mis en cache sur le document, donc revérifier la même archive le mois prochain ne coûte rien du tout.

## La question honnête : où va le texte avant que vous ne le colliez ?

Toutes les options gratuites ci-dessus supposent que le texte de votre document atteigne le modèle de quelqu’un d’autre, sauf la locale — ce n’est pas une critique, c’est le marché que passe toute fonction d’IA hébergée, et la seule version malhonnête de cet article serait celle qui prétendrait le contraire. Ce qui diffère, c’est ce qui arrive ensuite à ce texte : s’il sert à entraîner quoi que ce soit, combien de temps il est conservé, et si les conditions d’un palier gratuit diffèrent de celles d’un palier payant. Lisez la vraie page de réglages de l’outil que vous utilisez avant de lui donner un document que vous ne voudriez pas voir réemployé — la note de confidentialité d’un convertisseur est un début, pas un substitut à la politique du fournisseur du modèle.

## Comment choisir

1. **Demandez-vous si vous aurez encore besoin du résumé plus tard.** Un résumé en cache sur un document que vous gardez bat une transcription de discussion qu’il faut retrouver, chaque fois que vous voulez revérifier le même document.
2. **Demandez-vous où le document vit déjà.** Une page Notion appelle Notion AI si vous payez déjà pour lui ; un fichier appelle un outil qui lit des fichiers plutôt qu’un outil qui exige un collage manuel.
3. **Comptez la fréquence.** Vingt par jour, c’est beaucoup pour une personne et peu pour un script qui traite un dossier — sachez lequel des deux vous êtes avant de toucher le plafond.
4. **Décidez ce que « ne doit pas quitter la machine » veut dire pour ce document.** Si la réponse honnête est « rien d’hébergé », la voie locale est la seule qui y soit fidèle, pas la plus rapide à mettre en place.
5. **Vérifiez les vraies limites de l’offre gratuite avant d’en dépendre.** Un palier gratuit dont les plafonds ont bougé ces six derniers mois est assez courant dans cette catégorie pour que « vérifié aujourd’hui, sur la page du fournisseur » batte un comparatif d’il y a un an — celui-ci compris.

## Conclusion

Un résumé IA gratuit d’un document est réellement accessible par plusieurs voies honnêtes, et les différences qui comptent ne portent pas sur la qualité du résumé — les modèles sous-jacents sont assez proches pour que, sur trois phrases, la plupart des gens ne les distinguent pas. Ce qui diffère, c’est la friction : le résumé est-il là quand vous rouvrez le document, a-t-il fallu un collage manuel, et le document a-t-il jamais été autorisé à quitter votre machine. Pour un document déjà présent dans [TransformPipe](/), le résumé intégré répond aux deux premières questions sans rien demander ; pour tout le reste, un modèle de chat gratuit est à un collage de distance, et un modèle local est la seule réponse à la troisième question qui n’oblige à faire confiance à personne.

## FAQ

### Existe-t-il un moyen vraiment gratuit de résumer un document avec l’IA ?

Oui, plusieurs. Un convertisseur doté d’un résumé intégré fonctionnant sur un modèle en palier gratuit, un compte de discussion gratuit comme ChatGPT ou l’application Gemini dans lequel vous collez du texte, et un modèle open source exécuté localement sont tous gratuits sans carte bancaire — ils diffèrent par le confort d’usage et par le fait que votre texte atteigne ou non un serveur.

### Un outil de résumé IA gratuit conserve-t-il mon document ?

Cela dépend entièrement de l’outil. Un résumé mis en cache sur un document que vous aviez déjà enregistré vit avec ce document, sous les règles de votre propre compte ; l’historique d’une fenêtre de discussion dépend des réglages de conservation de ce service, qu’il vaut la peine de lire avant d’y coller quoi que ce soit de sensible. Un modèle local ne conserve rien nulle part, puisque rien n’a quitté votre machine.

### Quelle longueur doit faire un résumé IA de document ?

Trois à cinq phrases simples suffisent pour décider d’ouvrir ou non le document complet — c’est le vrai travail d’un résumé. Au-delà, un résumé entre en concurrence avec le document lui-même pour votre attention, et autant lire la source à ce moment-là.

### Puis-je obtenir un résumé IA sans téléverser mon fichier quelque part ?

Oui, avec un modèle local — le fichier et le modèle restent tous deux sur votre machine, donc rien n’est téléversé par définition. À défaut, un outil qui tourne dans le navigateur et n’envoie que le texte extrait à une API de résumé, sans stocker le fichier d’origine ailleurs, est l’option qui s’en approche le plus.

### Notion AI est-il inclus dans l’offre gratuite de Notion ?

Non — les espaces Notion gratuits et Plus obtiennent un essai limité des fonctions d’IA, et l’accès complet et continu exige l’offre Business à 20 $ par membre et par mois en 2026. Si le résumé est la seule fonction d’IA qui vous intéresse et que le document n’est pas déjà une page Notion, un outil de résumé autonome et gratuit revient moins cher.

### Puis-je résumer un export Notion ou Confluence entier d’un seul coup ?

Oui, si vous le fusionnez d’abord en un seul document — une archive d’export de nombreuses pages devient un document Markdown unique avec une table des matières, et le résumé décrit alors l’ensemble plutôt qu’une seule de ses pages. C’est le cas où un résumé vaut le plus cher, parce qu’un export fusionné de quarante mille mots est précisément le document que personne n’ouvre pour savoir ce que c’était.

### Le résumé est-il recalculé chaque fois que j’ouvre le document ?

Il ne devrait pas l’être, et un outil qui le recalcule dépense discrètement votre quota. Un résumé mis en cache est calculé une fois, rangé avec le document, et relu à chaque ouverture ensuite — avec une commande de régénération pour le cas où le document a changé et où les phrases en cache ne le décrivent plus.

### Quelle différence entre l’offre gratuite de ChatGPT et l’offre payante ?

Depuis août 2026, le chat texte de l’offre gratuite n’a plus de plafond de messages en soi, mais les comptes gratuits sont limités au plus petit modèle actuel d’OpenAI et subissent des plafonds distincts, plus serrés, sur la génération d’images, les téléversements de fichiers et la voix — sans accès à l’API, ce qui compte si vous voulez qu’un script, et non une fenêtre de discussion, fasse le travail de résumé.
