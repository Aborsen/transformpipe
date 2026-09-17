---
title: "Excel vers tableau Markdown : chaque voie, et ce que chacune perd"
description: "Comment transformer une plage Excel en tableau Markdown, et ce qu'il advient des dates, des zéros initiaux, des cellules fusionnées et de l'encodage en chemin"
updated: 2026-09-14
date: 2026-09-03
tag: Conversion
keywords: excel vers tableau markdown, convertir excel en markdown, xlsx en tableau markdown, excel csv vers markdown, coller excel dans markdown, tableur vers markdown, générateur de tableau markdown excel, encodage csv excel utf-8
---

Un tableur et un tableau Markdown ressemblent à la même chose dessinée deux fois. Ils ne le sont pas. L'un est une grille de cellules avec des types, des formats, des formules et des zones qui s'étendent sur plusieurs colonnes ; l'autre est un format texte fondé sur la ligne, où une ligne est une ligne, où une cellule s'achève sur une barre verticale, et où tout est une chaîne de caractères. Passer du premier au second n'est pas un problème d'affichage. C'est une décision sur ce qu'il faut jeter.

### En bref

La voie qui ne demande rien du tout à Excel consiste à **déposer directement le fichier `.xlsx`** dans un convertisseur qui lit le zip de XML dont le classeur est fait — chaque feuille devient son propre tableau, avec un sommaire dès qu'il y en a plus d'une. Là où ce n'est pas possible, enregistrez la feuille en **CSV UTF-8** et convertissez le CSV : la voie qui fonctionne partout, et qui vous coûte les formules, la mise en forme et toutes les feuilles sauf l'active. Pour une plage sélectionnée, le **copier-coller** va plus vite : le presse-papiers d'Excel transporte une version des cellules séparée par des tabulations, plus facile à découper que du CSV parce qu'une tabulation n'apparaît presque jamais à l'intérieur d'une valeur. Attendez-vous à des ennuis en trois endroits précis : **les zéros initiaux et les nombres à seize chiffres**, qu'Excel a déjà détruits au moment de la saisie ; **les cellules fusionnées**, qui n'ont aucun équivalent en Markdown ; et **l'encodage**, parce que le simple `CSV (séparateur : point-virgule)` écrit la page de codes ANSI de votre système plutôt que de l'UTF-8. Vérifiez une ligne avec un caractère accentué, une avec un nombre long et une avec une virgule dedans avant de faire confiance aux neuf cents autres.

Le frottement, c'est rarement la conversion. C'est que le tableau qui revient est subtilement faux d'une manière que personne ne remarque avant publication. Une référence article qui se lisait `00417` dans la feuille se lit `417` sur la page. Une date qui se lisait `03/09/2026` à Paris se lit « 3 septembre » pour la moitié de vos lecteurs et « 9 mars » pour l'autre moitié. Un en-tête qui couvrait trois colonnes s'est effondré en une cellule et deux vides, si bien que les colonnes en dessous ne portent plus aucun nom.

Rien de tout cela n'est la faute du convertisseur, et c'est le point qu'il vaut mieux comprendre tôt. L'essentiel des dégâts se produit à l'intérieur du tableur — à l'instant où une valeur a été saisie, ou à l'instant où Excel a écrit un fichier texte — et aucun outil en aval ne peut revenir dessus. Ce que fait une bonne voie de conversion, c'est rendre les dégâts visibles tant que vous pouvez encore les réparer.

Reste la question de savoir où va le fichier. Les tableurs sont les documents les plus sensibles que la plupart des gens convertissent : grilles de salaires, listes de clients, chiffres non publiés, export d'un système de facturation. Un convertisseur qui téléverse est un convertisseur qui détient désormais ces lignes, et cela pèse plus lourd ici que pour un README.

## Ce qu'un tableur contient et qu'un tableau Markdown ne peut pas porter

Les tableaux Markdown viennent de GitHub Flavored Markdown, pas du noyau CommonMark, et la syntaxe est délibérément minuscule : des barres verticales entre les cellules, une ligne par ligne, une rangée de tirets sous l'en-tête pour signaler que l'ensemble est un tableau, et des deux-points facultatifs dans cette rangée pour l'alignement. Voilà l'intégralité des fonctionnalités. Tout ce qu'un tableur sait faire au-delà doit être abandonné, aplati ou déplacé ailleurs.

| Dans le classeur | Dans un tableau Markdown | Ce qui se passe réellement |
| --- | --- | --- |
| Formules | Rien | La valeur reste, la formule disparaît. Le tableau cesse de se mettre à jour |
| Formats de nombre | Rien | Vous obtenez la chaîne affichée, ou le nombre brut, selon la voie |
| Gras, couleur, remplissages | Emphase en ligne seulement, pas de couleur | Une cellule rouge qui voulait dire « en retard » arrive comme un nombre ordinaire |
| Mise en forme conditionnelle | Rien | La règle et le sens disparaissent tous les deux |
| Cellules fusionnées | Rien — ni colspan, ni rowspan | La valeur dans la première cellule, du vide dans les autres |
| Plusieurs feuilles | Un tableau par feuille | Un export CSV n'enregistre que la feuille active |
| Un saut de ligne dans une cellule | Rien | Doit devenir `<br>` ou une espace, sinon le tableau casse |
| Liens hypertexte | `[texte](url)` | Conservés seulement sur les voies qui lisent le presse-papiers riche, pas le texte brut |
| Commentaires et notes | Rien | Supprimés en silence |
| Graphiques, images, tableaux croisés | Rien | Pas tabulaire, pas convertible |
| Largeurs de colonne, volets figés | Rien | La mise en page appartient au lecteur, pas à vous |
| Alignement | `:---`, `:---:`, `---:` | La seule mise en forme qui survit, et vous la posez généralement à la main |

Deux lignes de ce tableau méritent d'être isolées, parce que ce sont celles qui produisent un document cassé plutôt qu'un document plus sobre. Un saut de ligne dans une cellule n'a aucune représentation dans la syntaxe — le tableau est fondé sur la ligne, donc un vrai retour à la ligne termine la rangée — et une zone fusionnée n'en a pas davantage. Tout le reste se dégrade. Ces deux-là corrompent.

La règle du rectangle est l'autre chose à savoir. La spécification de GitHub dit que la ligne d'en-tête fixe le nombre de colonnes : une ligne ultérieure comportant moins de cellules en reçoit des vides, et une ligne qui en comporte plus voit les surnuméraires ignorées. C'est un comportement clément et dangereux, parce qu'une ligne qui a perdu une cellule au profit d'une barre verticale égarée ne produit pas d'erreur. Elle produit un tableau dont une valeur manque discrètement en fin de ligne. [Les tableaux sont, de loin, ce qui casse le plus souvent au passage](/blog/markdown-tables-that-survive-conversion), et voilà pourquoi : le mode de défaillance est un tableau valide au contenu faux.

## Comparatif rapide : les voies de la feuille au tableau

| Voie | Idéale pour | Conserve | Perd | Installation |
| --- | --- | --- | --- | --- |
| Déposer le `.xlsx` directement | Un classeur entier, sans étape d'export | Chaque feuille, comme tableau distinct | Formules, formats — comme toute voie | Aucune |
| Enregistrer en CSV UTF-8, puis convertir | Une feuille entière, de façon fiable | Les valeurs, les caractères accentués | Formules, formats, autres feuilles | Aucune |
| Copier la plage, la coller dans un convertisseur | Une sélection que vous voyez | Les valeurs, sous forme tabulée | Mise en forme, liens hypertexte | Aucune |
| Copier la plage, coller en HTML | Gras, liens, structure fusionnée | Emphase, `<a href>`, colspan | Dépend du convertisseur HTML | Aucune |
| Une formule dans une colonne auxiliaire | Un tableau régénéré souvent | Ce que vous y écrivez | Formats de nombre, sauf avec `TEXTE` | Aucune |
| Un complément Office | Le faire dans Excel, de façon répétée | Ce que le complément met en œuvre | Variable ; peut envoyer la plage à un éditeur | Complément, parfois validation d'un administrateur |
| Une macro VBA | Un classeur que vous maîtrisez | Exactement ce que vous codez | Rien que vous n'ayez choisi | Aucune, mais le fichier devient `.xlsm` |
| Office Scripts | Excel sur le web, automatisation partagée | Exactement ce que vous codez | Exige un compte Microsoft 365 éligible | Aucune |
| Téléchargement depuis Google Sheets | Éviter les choix d'encodage d'Excel | UTF-8 sans discussion | Les mêmes pertes de tableur que tout CSV | Aucune |
| Export depuis LibreOffice Calc | Le contrôle explicite du fichier texte | Votre choix de jeu de caractères et de guillemets | Comme tout CSV | LibreOffice |
| Le retaper | Cinq lignes et quatre colonnes | Votre attention | Vingt minutes, à l'échelle | Aucune |

## Les voies, une par une

### Déposer le `.xlsx` directement — sauter l'export entièrement

Le classeur est déjà un zip de XML — c'est ce que veut dire `.xlsx` — de sorte qu'un convertisseur peut le lire comme il lit un `.docx`, sans étape d'enregistrement intermédiaire. [La conversion Excel → tableau Markdown de TransformPipe](/excel-to-markdown) fait exactement cela : déposez le classeur, et chaque feuille contenant des lignes devient son propre tableau, avec un sommaire dès qu'il y a plus d'une feuille. Personne n'ouvre Excel, personne ne choisit d'encodage, et il n'y a pas de CSV intermédiaire à perdre ou à mal nommer.

| Avantages | Inconvénients |
| --- | --- |
| Aucune boîte de dialogue, aucun encodage à choisir de travers | Cela reste la lecture du fichier par un convertisseur de navigateur — reportez-vous aux pertes de l'aide-mémoire ci-dessus |
| Toutes les feuilles du classeur, pas seulement l'active | Formules, formats et cellules fusionnées sont abandonnés, comme sur toute autre voie |
| Les dates sortent en dates ISO lisibles plutôt qu'en numéros de série | Rien ne sauve une valeur qu'Excel avait déjà abîmée |
| Tourne dans le navigateur : le classeur n'est jamais téléversé | Un `.xlsm` avec macros ou un fichier protégé par mot de passe demande une autre voie |

**Prix :** gratuit, et le fichier reste local — cela vaut la peine d'être vérifié pour un tableur, puisque les tableurs comptent parmi les documents les plus sensibles que l'on convertisse.

**Pour qui ?** Pour quiconque veut le tableau sans la moindre étape d'export, en particulier un classeur à plusieurs feuilles : un seul dépôt produit un document unique avec un sommaire, au lieu d'un export CSV par feuille.

### Enregistrer en CSV, puis convertir — la voie qui marche partout ailleurs

Faites `Fichier > Enregistrer sous`, choisissez `CSV UTF-8 (délimité par des virgules) (*.csv)`, acceptez les deux avertissements qu'Excel affiche, puis convertissez le fichier texte obtenu. C'est l'option la plus terne et la seule qui se comporte de façon identique sur toutes les machines, dans toutes les langues et pour toutes les tailles de fichier.

| Avantages | Inconvénients |
| --- | --- |
| Produit un fichier texte que tout convertisseur sait lire | Seule la feuille active est enregistrée |
| CSV UTF-8 conserve les caractères accentués et non latins | Les formules deviennent des valeurs, les formats des chaînes |
| Le fichier intermédiaire est inspectable — ouvrez-le et regardez | Le BOM en tête piège les lecteurs négligents |
| Fonctionne pareil dans toutes les versions d'Excel qui proposent le format | Une locale à virgule décimale change le séparateur |

**Prix :** gratuit. Excel ne l'est pas, mais l'export en fait partie, et tout convertisseur digne de ce nom de l'autre côté est gratuit.

**Détails techniques**

- La liste d'enregistrement d'Excel contient plusieurs formats texte : `CSV`, `UTF8 CSV`, `Macintosh CSV`, `Windows CSV`, `MSDOS CSV` et `Texte Unicode`, exposés aux macros sous les noms `xlCSV`, `xlCSVUTF8`, `xlCSVMac`, `xlCSVWindows`, `xlCSVMSDOS` et `xlUnicodeText` (vérifié sur learn.microsoft.com, le 8 septembre 2026).
- L'enregistrement en CSV affiche une boîte de dialogue « vous rappelant que seule la feuille de calcul active sera enregistrée dans le nouveau fichier », puis un second avertissement précisant que la feuille peut contenir des fonctionnalités que le format texte ne prend pas en charge (vérifié sur support.microsoft.com, le 8 septembre 2026).
- Le délimiteur de champ suit le séparateur de liste du système, modifiable dans les paramètres régionaux de Windows et dans les options de séparateur d'Excel (vérifié sur support.microsoft.com, le 8 septembre 2026).
- Ce qui atterrit dans le fichier pour une cellule formatée est généralement la chaîne que la cellule affiche, et non la valeur sous-jacente. Autrement dit, une cellule contenant `2.3456` montrée à deux décimales écrit `2.35`, et une date s'écrit dans l'ordre que le format de la cellule impose. Ouvrez une fois le CSV dans un éditeur de texte et vous saurez exactement ce que fait votre exemplaire d'Excel.

Convertissez ensuite le CSV. La [conversion CSV vers tableau Markdown](/csv-to-markdown) d'un convertisseur de navigateur analyse le fichier correctement au lieu de le découper sur les virgules, ce qui compte dès qu'une cellule en contient une, et le fait localement, de sorte que les lignes ne sont pas téléversées — un document conservé est plafonné à 4 Mo et la conversion elle-même à 10 Mo, bien au-delà de tout tableau qu'un être humain lira. Le champ plus large des options en ligne de commande et en bibliothèque est traité dans [le comparatif des convertisseurs CSV](/blog/best-csv-to-markdown-converters) ; Pandoc, Miller et `pandas.to_markdown` lisent tous le CSV correctement et sont la bonne réponse à l'intérieur d'une chaîne de build.

**Pour qui ?** Pour quiconque convertit une feuille entière, et pour quiconque devra recommencer le mois prochain. Le CSV intermédiaire est la fonctionnalité : c'est un fichier que vous pouvez lire, comparer et vérifier avant qu'il ne devienne un tableau.

### Copier la plage et coller — la voie rapide

Sélectionnez les cellules, copiez, et collez dans un convertisseur qui accepte du texte collé. C'est la bonne voie pour une plage plutôt que pour une feuille, et elle vous fait gagner à peu près une minute sur un enregistrement. Ce qui la rend possible, c'est qu'Excel ne met pas du CSV dans le presse-papiers.

| Avantages | Inconvénients |
| --- | --- |
| Aucun fichier, aucune boîte de dialogue, aucun encodage à choisir | Une cellule contenant un saut de ligne casse le collage |
| Le texte tabulé est plus facile à découper que du CSV | Les formats de nombre arrivent sous forme de chaînes affichées |
| Traite une sélection, pas une feuille entière | Les formules et les liens hypertexte ne sont pas dans le texte brut |
| Aucune installation, et rien d'écrit sur le disque | Seulement ce qui était sélectionné : l'en-tête est votre affaire |

**Détails techniques — ce que le presse-papiers transporte vraiment**

| Variante | Forme | À utiliser pour |
| --- | --- | --- |
| Texte brut | Tabulé, `CRLF` entre les lignes, guillemets seulement là où une valeur contient une tabulation, un retour à la ligne ou un guillemet | Presque toutes les conversions |
| HTML | Un vrai `<table>` avec lignes, cellules, styles en ligne, `colspan` et `rowspan`, et `<a href>` pour les liens | Conserver l'emphase et les liens |
| Les formats propres à Excel | Binaires, pour recoller dans un tableur | Rien, hors d'Excel |

La variante texte brut est en pratique du TSV avec le système de guillemets du CSV, et c'est une meilleure nouvelle qu'il n'y paraît. Une virgule dans une valeur est inoffensive parce que le délimiteur est une tabulation, et les tabulations sont rares dans les cellules d'un tableur puisque la touche Tab passe à la cellule suivante. Le cas pathologique qui ruine l'analyse naïve d'un CSV — `Dupont, Jean` dans un seul champ — ne coûte donc rien ici.

Le cas qui la ruine vraiment, c'est une cellule contenant un saut de ligne, saisi avec Alt+Entrée. Excel entoure cette valeur de guillemets doubles et le retour à la ligne part intact dans le presse-papiers ; un outil qui découpe le texte collé sur les retours à la ligne voit alors une ligne devenir deux, et toutes les lignes suivantes se décalent. Cherchez-les dans la feuille avant de copier : ce sont d'ordinaire des adresses, des notes et des descriptions de produit.

**Pour qui ?** Pour quiconque a le classeur ouvert et une plage précise en tête. C'est la voie à choisir quand la réponse ne réclame que douze lignes sur neuf cents.

### Coller en HTML et convertir le HTML — quand la mise en forme compte

Si l'emphase et les liens comptent, ne collez pas en texte. Collez dans quelque chose qui prend la variante HTML du presse-papiers — un champ de texte enrichi, ou un éditeur qui colle du contenu formaté — et convertissez ce HTML en Markdown.

| Avantages | Inconvénients |
| --- | --- |
| Gras, italique et liens hypertexte survivent en Markdown | Le HTML du presse-papiers d'Excel est verbeux et bourré de styles `mso-` |
| Les cellules fusionnées arrivent en vrais `colspan` et `rowspan` | Que le tableau Markdown ne saura de toute façon pas exprimer |
| Bordures et alignement des cellules sont visibles au convertisseur | Que la plupart des convertisseurs ignorent |
| Aucune installation si le convertisseur tourne dans un navigateur | Deux conversions, donc deux occasions de perdre quelque chose |

Le marché est honnête : vous gardez la mise en forme en ligne et vous perdez quand même la structure, parce qu'un tableau Markdown n'a aucun moyen de dire qu'une cellule couvre trois colonnes. Un convertisseur à qui l'on donne un `colspan` ou bien l'abandonne et produit une ligne bancale, ou bien répète la valeur, ou bien se replie sur un tableau HTML brut. [Savoir laquelle de ces trois choses fait votre convertisseur HTML vers Markdown](/blog/best-html-to-markdown-converters) vaut mieux avant d'y coller un en-tête fusionné.

**Pour qui ?** Pour les tableaux dont une colonne contient des liens, ou dans lesquels l'emphase porte du sens — une colonne de statut, une liste de références.

### Construire la ligne dans une formule — la voie qui reste dans la feuille

Vous pouvez faire écrire le Markdown par Excel lui-même. Mettez ceci dans une colonne auxiliaire à côté d'un tableau de cinq colonnes et recopiez vers le bas :

```
="| " & TEXTJOIN(" | ", FALSE, A2:E2) & " |"
```

`TEXTJOIN` prend un délimiteur, un indicateur `ignore_empty` et jusqu'à 252 arguments texte ou plages (vérifié sur support.microsoft.com, le 8 septembre 2026). Passez `FALSE` pour `ignore_empty` et pensez-le vraiment : avec `TRUE`, une cellule vide est sautée plutôt qu'émise, la ligne sort avec une barre verticale en moins, et les valeurs situées après le trou glissent d'une colonne vers la gauche. C'est de loin la façon la plus courante de rater cette astuce.

Deux détails de plus. La concaténation ignore le format de nombre de la cellule : une date arrive donc sous forme de numéro de série et une valeur monétaire perd son symbole ; enveloppez ces cellules dans `TEXT(A2, "yyyy-mm-dd")` pour maîtriser vous-même la chaîne. Et une valeur contenant une barre verticale termine une cellule trop tôt : passez-la par `SUBSTITUTE(A2, "|", "\|")` dans une colonne de préparation si vos données contiennent des chemins de fichiers ou des listes d'options.

La rangée de séparation, vous la tapez à la main, une fois :

```
| Part | Description | Qty | Price | Status |
| --- | --- | --- | ---: | --- |
```

Copiez ensuite la colonne auxiliaire et collez-la sous ces deux lignes. Le presse-papiers livre les lignes sans guillemets, parce qu'une ligne ainsi construite ne contient ni tabulation ni retour à la ligne.

| Avantages | Inconvénients |
| --- | --- |
| Le tableau se régénère quand les données changent | Vous écrivez un convertisseur en formules |
| Aucune installation, aucun téléversement, aucun second outil | L'échappement et les formats de nombre sont entièrement votre affaire |
| Fonctionne sur une vue filtrée ou triée | Pénible au-delà de six colonnes environ |
| `TEXT` donne un contrôle exact sur les dates | Rien ne contrôle votre sortie |

**Pour qui ?** Pour un tableau publié chaque semaine à partir de la même feuille. La colonne auxiliaire est une étape de build qui vit dans le classeur.

### Compléments, macros et Office Scripts — convertir à l'intérieur d'Excel

Il y a trois façons de faire de la conversion un bouton dans Excel plutôt qu'un aller-retour vers un autre outil, et elles diffèrent surtout par l'identité de celui qui a écrit le code et par l'endroit où il s'exécute.

Un **complément Office** installé depuis AppSource tourne dans une vue web à l'intérieur d'Excel et lit le classeur par l'API JavaScript d'Office. Jugez-en un sur deux questions avant de l'installer : la plage est-elle traitée localement ou envoyée au service de l'éditeur, ce que sa déclaration de confidentialité devrait dire franchement, et votre tenant autorise-t-il seulement les compléments — dans les environnements Microsoft 365 administrés, un administrateur doit souvent les approuver. Ne supposez ni l'un ni l'autre à partir de la fiche du magasin.

Une **macro VBA** est la version où le code vous appartient. Elle n'a aucune dépendance, aucun accès réseau sauf si vous en écrivez un, et aucun éditeur tiers. Les coûts sont réels : le classeur doit être enregistré en `.xlsm` pour conserver la macro, les macros contenues dans des fichiers venus d'internet sont bloquées par défaut et doivent être débloquées délibérément, et vous entretenez désormais une routine d'échappement que quelqu'un a écrite une fois et que personne ne teste. Sachant qu'un enregistrement coûte dix secondes, une macro ne vaut le coup que si la conversion revient à intervalles réguliers.

**Office Scripts** est l'automatisation en TypeScript intégrée à Excel sur le web pour les comptes Microsoft 365 éligibles. C'est un meilleur endroit que VBA pour une automatisation partagée et versionnée, et ce n'est pas disponible avec toutes les licences : vérifiez avant de bâtir un plan dessus. **Python dans Excel** est une quatrième possibilité et porte une réserve précise : le Python s'exécute dans le cloud de Microsoft et non sur votre machine, si bien que les données sortent des murs même si le fichier, lui, n'en est pas sorti.

| Avantages | Inconvénients |
| --- | --- |
| Un bouton, dans l'application | Quelqu'un doit être propriétaire du code |
| Aucune manipulation de fichier, aucun presse-papiers | Les compléments peuvent transmettre la plage ; les scripts peuvent exiger une licence |
| Reproductible à l'échelle d'une équipe | La mise en place la plus lourde de toutes les voies présentées ici |

**Pour qui ?** Pour les équipes qui convertissent des feuilles assez souvent pour que dix secondes comptent, et prêtes à entretenir quelque chose pour cela.

### Google Sheets et LibreOffice Calc — le même travail avec de meilleurs réglages par défaut

Si le classeur n'est pas lié à Excel, deux autres tableurs rendent l'étape du fichier texte moins querelleuse.

Google Sheets exporte la feuille courante avec `Fichier > Télécharger > Valeurs séparées par des virgules`, en UTF-8, sans boîte de dialogue ni question de page de codes. Les limites du tableur sont identiques — une feuille, des valeurs et non des formules, des cellules fusionnées aplaties — mais la question de l'encodage ne se pose pas.

LibreOffice Calc fait l'inverse et vous demande tout. Enregistrer en Texte CSV ouvre une boîte de dialogue proposant le jeu de caractères, le délimiteur de champ, le délimiteur de chaîne, « Mettre entre guillemets toutes les cellules de texte » et « Enregistrer le contenu de la cellule comme affiché » — cette dernière case étant le contrôle explicite qu'Excel n'offre pas, puisque la décocher écrit les valeurs sous-jacentes au lieu des chaînes affichées. Si vous avez déjà souhaité exporter une date en `2026-09-03` quel que soit le format de la cellule, c'est cet interrupteur.

| Avantages | Inconvénients |
| --- | --- |
| Sheets : de l'UTF-8 sans aucune décision à prendre | Sheets : le fichier passe par votre compte Google |
| Calc : jeu de caractères, guillemets et délimiteur explicites | Calc : une installation, et une boîte de dialogue à comprendre |
| Calc : valeur affichée ou valeur sous-jacente, à votre choix | Les deux : les mêmes pertes de tableur que toute voie CSV |

**Pour qui ?** Pour quiconque travaille déjà dans Sheets, et pour quiconque s'est fait mordre une fois par les réglages d'encodage d'Excel et veut voir le choix posé au grand jour.

## Ce qu'Excel fait à vos valeurs quand il écrit un CSV

C'est la section à lire deux fois, parce que l'essentiel de ce qui suit est irréversible et que rien n'en est annoncé.

| La valeur | Ce qui en sort | Pourquoi |
| --- | --- | --- |
| `00417` saisi dans une cellule Standard | `417` | Converti en nombre à la saisie. Les zéros n'ont jamais été dans le fichier |
| Un numéro de carte ou de compte à 16 chiffres | Les chiffres au-delà du 15e deviennent des zéros | Excel a « une précision maximale de 15 chiffres significatifs » et « tout chiffre au-delà du 15e est arrondi à zéro » (vérifié sur support.microsoft.com, le 8 septembre 2026) |
| Un très grand nombre | `1.23E+15` | La notation scientifique à l'affichage devient de la notation scientifique dans le texte |
| `2.3456` affiché à deux décimales | `2.35` | La chaîne affichée, pas la valeur stockée |
| Une date | Le format d'affichage de la cellule, dans l'ordre de la locale | Ce qui explique que `03/09/2026` soit ambigu hors de la feuille |
| `=B2*C2` | Le résultat | Le CSV n'a pas de formules |
| Un pourcentage | Le plus souvent avec le signe `%` | L'affichage, encore — vérifiez votre fichier |
| Une valeur avec un séparateur de milliers | Souvent `1,234.50`, entre guillemets | La virgule est dans la chaîne, donc le champ doit être entouré de guillemets |
| Une cellule contenant un Alt+Entrée | Un champ entre guillemets contenant un vrai retour à la ligne | Qu'un lecteur fondé sur la ligne traitera mal s'il n'analyse pas le CSV correctement |
| Un texte commençant par `=`, `+`, `-` ou `@` | Le même texte | Inoffensif en Markdown ; un tableur qui rouvre le CSV peut y voir une formule |

Les deux premières lignes sont celles qui coûtent de l'argent pour de bon. Les zéros initiaux et les identifiants longs sont détruits à la saisie, avant tout export, et le remède est la prévention : formatez la colonne en Texte avant d'y coller les données, ou préfixez chaque valeur d'une apostrophe. La documentation de Microsoft dit explicitement que ces gestes « n'affectent que les nombres saisis après l'application de la mise en forme » et ne rétabliront pas ce qui a déjà été tronqué (vérifié sur support.microsoft.com, le 8 septembre 2026). Si une colonne de références article affiche déjà `417`, la feuille ne sait plus que c'était `00417`, et le Markdown ne le saura pas davantage.

La ligne des dates est celle qui provoque des disputes plutôt que des pertes. Un CSV transporte la chaîne que la cellule montrait : une feuille française exporte donc `03/09/2026` et un lecteur américain y lit mars. Si le tableau doit approcher un autre pays, imposez des dates ISO avant d'exporter — une colonne auxiliaire de `TEXT(A2, "yyyy-mm-dd")`, ou l'option « Enregistrer le contenu de la cellule comme affiché » décochée dans Calc.

## Les cellules fusionnées n'ont aucun équivalent en Markdown

Il n'y a pas de colspan dans un tableau Markdown. Il n'y a pas de rowspan. La grille de barres verticales est strictement rectangulaire, une ligne par rangée, et la ligne d'en-tête fixe le nombre de colonnes pour tout le tableau. Une zone fusionnée ne peut être ni exprimée, ni approchée, ni suggérée.

Ce qui se passe à la sortie est prévisible : la valeur se loge dans la cellule en haut à gauche de la zone fusionnée et les autres cellules sont vides. Un en-tête couvrant `T1`, `T2` et `T3` s'exporte donc en `2026` suivi de deux vides, et le tableau Markdown hérite d'une première ligne portant une étiquette et deux colonnes sans nom.

Quatre issues, dans l'ordre où je les essaierais :

1. **Défusionner et remplir.** Désactivez Fusionner et centrer, puis répétez l'étiquette en largeur ou en hauteur. Le tableau devient plus laid dans la feuille et correct partout ailleurs.
2. **Sortir l'étiquette fusionnée du tableau.** Une cellule fusionnée couvrant tout un tableau est presque toujours un titre. Faites-en un intertitre au-dessus du tableau, ou la phrase de légende du tableau, et supprimez la ligne.
3. **Couper en deux tableaux.** Deux groupes fusionnés de colonnes sont d'ordinaire deux tableaux qu'on avait collés ensemble pour l'impression. Les publier séparément est souvent plus clair que l'original.
4. **Émettre un `<table>` HTML brut à la place.** Le HTML à l'intérieur du Markdown peut porter un `colspan`, et il s'affiche partout où le HTML brut est autorisé. Il apparaît en balisage littéral là où il ne l'est pas, un assainisseur à liste blanche stricte peut le supprimer, et vous avez renoncé à la source en texte lisible qui était la raison d'être du Markdown. C'est le dernier recours, pas la réponse astucieuse.

Notez que les tableaux ne figurent pas du tout dans le CommonMark nu : le tableau à barres verticales est déjà une extension — implémentée par GitHub Flavored Markdown et par la plupart des convertisseurs, et qu'un analyseur CommonMark strict rend comme un paragraphe rempli de barres verticales. [Quelle variante fait le rendu](/blog/commonmark-gfm-and-the-flavours) décide si votre tableau est un tableau, avant que tout le reste ne compte.

## La question de l'encodage : un BOM, une page de codes ANSI et un point-virgule

L'export texte d'Excel a trois façons distinctes de vous remettre un fichier techniquement correct et illisible.

**Le BOM.** `CSV UTF-8` écrit une marque d'ordre des octets — les trois octets `EF BB BF` — avant le premier caractère. La plupart des lecteurs la retirent. Ceux qui ne le font pas placent un caractère invisible devant votre première cellule d'en-tête : la colonne s'appelle alors `﻿Part` et non `Part`. Cela a l'air juste à l'écran et fait échouer chaque comparaison que vous faites dessus. Vous pouvez le voir en une seconde :

```
head -c 3 orders.csv | xxd
```

Si cela affiche `efbbbf`, il y a un BOM. Sous Windows sans shell POSIX, un éditeur qui montre l'encodage dans sa barre d'état vous dit la même chose.

**La page de codes.** Le simple `CSV (séparateur : point-virgule)` n'écrit pas de l'UTF-8. Il écrit la page de codes ANSI de votre système — Windows-1252 en Europe de l'Ouest — et tout caractère hors de cette page est remplacé, définitivement, généralement par un point d'interrogation. Une colonne de noms grecs ou japonais ne survit pas à cet enregistrement, et aucun convertisseur en aval ne peut la récupérer. Même à l'intérieur de la page de codes, le fichier est du charabia pour un lecteur UTF-8 : `£` arrive en `Â£`, une apostrophe courbe en `â€™`, un tiret demi-cadratin en `â€“`. Si vous avez déjà vu des `Â` éparpillés dans un tableau converti, c'était la cause.

**Le délimiteur.** Le séparateur suit le séparateur de liste du système : dans les locales où le séparateur décimal est une virgule, Excel écrit donc des points-virgules. Un lecteur qui ne connaît que la virgule voit alors un unique tableau énorme d'une seule colonne : chaque ligne devient une cellule contenant toutes les valeurs. C'est une défaillance évidente une fois qu'on la connaît, et déroutante la première fois. Changez le séparateur de liste dans les paramètres régionaux avant d'exporter, ou utilisez un convertisseur offrant une option de délimiteur explicite.

Un piège de plus mérite d'être nommé : `Texte Unicode (*.txt)` est de l'UTF-16 délimité par des tabulations, avec son propre BOM. Un convertisseur qui attend de l'UTF-8 voit un octet nul entre chaque lettre et déclare généralement le fichier binaire.

La règle pratique est courte. Choisissez `CSV UTF-8`, vérifiez une fois les trois premiers octets sur la machine d'où vous exportez, et si le délimiteur est un point-virgule, sachez que c'est un réglage régional et non un bug.

## Là où la voie fiable échoue, et ce qu'elle coûte

L'enregistrement en CSV est le bon choix par défaut et il a cinq coûts qu'il vaut mieux énoncer franchement.

**Une feuille à la fois.** Excel enregistre la feuille active et vous prévient qu'il le fait. Un classeur à douze onglets, ce sont douze exports, douze conversions et douze tableaux, et il n'y a pas de sortie combinée parce que le CSV n'a aucune notion de seconde feuille. Si les onglets forment un seul jeu de données découpé par mois, consolidez dans Excel avant d'exporter.

**Les formules ont disparu, et la source de vérité avec elles.** Un tableau de valeurs publié convient jusqu'à ce que quelqu'un demande d'où vient un chiffre. Le classeur le sait encore ; le Markdown, non. Pour un tableau que vous régénérez, gardez la feuille comme source et le Markdown comme artefact — n'allez jamais modifier le tableau en espérant que la feuille suive.

**Le sens qui logeait dans la mise en forme.** Mise en forme conditionnelle, remplissages et couleurs de police portent de l'information dans quantité de tableurs réels : rouge pour « en retard », gris pour « remplacé », gras pour un total. Tout cela est abandonné, et le lecteur du Markdown ne peut pas le deviner. Le remède est de déplacer le sens dans les données — ajouter une colonne `Statut`, marquer les totaux par un mot plutôt que par une graisse — un travail que le convertisseur ne peut pas faire à votre place.

**Ce que le filtre cachait.** Si vous avez laissé en place un filtre automatique ou des colonnes masquées, comparez le fichier exporté à ce que vous voyiez à l'écran plutôt que de supposer ; la bonne habitude est de copier la plage visible plutôt que d'exporter la feuille entière quand un filtre est en jeu.

**La largeur que personne ne lira.** Un tableau de quarante colonnes est du Markdown légal et une sortie illisible : il défile latéralement ou se replie en bouillie, et le texte source devient impossible à modifier à la main. C'est un échec de conception plutôt qu'un échec de conversion, et les réponses sont de couper des colonnes, de transposer un petit tableau pour que les champs descendent le long du côté, ou d'accepter que certaines données veulent rester un tableur et de pointer un lien vers le fichier.

Il y a un sixième coût qui ne porte pas sur les données. Quelqu'un doit vérifier le résultat. Convertissez la feuille, puis lisez la première ligne, la dernière ligne, une ligne avec un caractère accentué et une ligne avec un nombre long. Cela fait quatre vérifications et une trentaine de secondes, et cela attrape presque tout ce que décrit cette page.

## Comment choisir

1. **Partez de la fréquence.** Une seule fois, et l'enregistrement en CSV est terminé avant que vous n'ayez fini de lire la déclaration de confidentialité d'un complément. Chaque semaine, et une colonne auxiliaire ou un script se rembourse en un mois.
2. **Décidez s'il vous faut une plage ou une feuille.** Une sélection appelle le presse-papiers ; une feuille appelle un fichier. Emprunter la voie du fichier pour douze lignes revient à en exporter neuf cents et à en supprimer la plupart.
3. **Cherchez les cellules fusionnées et les sauts de ligne Alt+Entrée avant de convertir, pas après.** Ce sont les deux seules fonctionnalités de tableur qui produisent un tableau cassé plutôt qu'un tableau plus sobre, et toutes deux se réparent en une minute dans la feuille et se déboguent en bien plus longtemps dans la sortie.
4. **Choisissez l'encodage délibérément si les données ne sont pas de l'ASCII pur.** `CSV UTF-8` pour tout ce qui comporte un accent, un symbole monétaire ou une écriture non latine. L'option CSV simple perd ces caractères au moment de l'enregistrement, et rien ensuite ne peut les replacer.
5. **Demandez-vous où vont les lignes.** Pour un tableau de licences open source, cela n'a pas d'importance. Pour la paie, des données de patients ou des chiffres non publiés, c'est toute la question, et un convertisseur qui tourne dans votre navigateur vous laisse vérifier la réponse en regardant le panneau réseau ne rien faire.

## Conclusion

Le résumé honnête d'Excel vers Markdown, c'est que la conversion est facile et que le tableur est difficile. Enregistrez la feuille en CSV UTF-8, convertissez le CSV, et employez le temps gagné à vérifier les trois choses qui cassent : les identifiants dont les zéros initiaux ont disparu à la saisie, les dates dont l'ordre dépend du lecteur, et les cellules fusionnées que le Markdown ne peut pas exprimer et qu'il aplatira sans rien dire. Pour une plage sélectionnée, collez-la plutôt — la variante tabulée du presse-papiers est réellement plus facile à analyser que n'importe quel CSV, et TransformPipe convertit des lignes collées de la même façon qu'un fichier, dans le navigateur, sans rien téléverser quand vous êtes déconnecté. Dans un cas comme dans l'autre, lisez la première et la dernière ligne du résultat avant de le publier. L'outil ne peut pas savoir que `417` était `00417` ; vous, si.

## FAQ

### Comment convertir un fichier Excel en tableau Markdown ?

Enregistrez la feuille en `CSV UTF-8 (délimité par des virgules)` et convertissez ce CSV avec n'importe quel convertisseur qui analyse réellement le CSV au lieu de le découper sur les virgules. Pour une partie de feuille plutôt que pour la feuille entière, copiez la plage et collez-la dans un convertisseur qui accepte du texte collé : Excel met dans le presse-papiers une version des cellules séparée par des tabulations, plus facile à analyser que du CSV.

### Puis-je coller depuis Excel directement dans un fichier Markdown ?

Pas utilement. Ce qui atterrit dans un éditeur de texte brut, ce sont des valeurs séparées par des tabulations, sans barres verticales ni rangée de séparation : cela s'affiche comme un bloc de texte et non comme un tableau. Collez plutôt dans un convertisseur, ou construisez les lignes dans la feuille avec `TEXTJOIN` et collez le Markdown fini.

### Pourquoi mes zéros initiaux ont-ils disparu ?

Parce qu'Excel a converti la valeur en nombre au moment de la saisie, bien avant tout export — `00417` est devenu le nombre 417 et le fichier n'a jamais contenu les zéros. Formatez la colonne en Texte avant de saisir ou de coller les données, ou préfixez chaque valeur d'une apostrophe ; ni l'un ni l'autre ne rétablira les valeurs déjà converties.

### Pourquoi mon CSV exporté utilise-t-il des points-virgules au lieu de virgules ?

Parce que le délimiteur suit le séparateur de liste de votre système, et que dans les locales où la virgule sert de séparateur décimal, ce réglage est un point-virgule. Changez le séparateur de liste dans les paramètres régionaux de Windows avant d'exporter, ou utilisez un convertisseur qui vous laisse indiquer le délimiteur. Un lecteur qui ne connaît que la virgule transforme tout le fichier en une seule colonne.

### Qu'advient-il des cellules fusionnées ?

Elles sont aplaties : la valeur part dans la cellule en haut à gauche de la zone fusionnée et les autres ressortent vides. Les tableaux Markdown n'ont ni colspan ni rowspan : les seuls remèdes sont de défusionner et répéter l'étiquette, de sortir un en-tête fusionné du tableau pour en faire un intertitre, de couper le tableau en deux, ou de se replier sur un tableau HTML brut.

### Convertir un tableur signifie-t-il le téléverser ?

Seulement si l'outil fonctionne ainsi, et beaucoup le font. Un convertisseur qui tourne dans le navigateur lit le fichier sur votre propre machine, ce que vous pouvez confirmer en ouvrant le panneau réseau et en regardant ne rien sortir — cela vaut la peine d'être fait une fois pour tout outil auquel vous comptez confier de vraies données, puisque les tableurs contiennent souvent les lignes les plus sensibles que l'on convertisse.

### Puis-je conserver le gras et les liens hypertexte de la feuille ?

Seulement par la variante HTML du presse-papiers, qui transporte les liens `<a href>` et les styles en ligne, et seulement si vous convertissez ce HTML en Markdown plutôt que de coller en texte brut. La variante texte brut ne contient que des valeurs, et un export CSV n'a aucune mise en forme.

### Suis-je obligé d'exporter d'abord en CSV ?

Non, si le convertisseur lit directement le `.xlsx` — le format est un zip de XML, de même forme qu'un `.docx`, de sorte qu'un convertisseur capable d'ouvrir des zips lit les feuilles d'un classeur sans aucun fichier texte intermédiaire. La voie CSV reste bonne à connaître pour les outils qui n'acceptent que du texte brut, ou pour le moment où vous voulez inspecter les valeurs dans un éditeur avant qu'elles ne deviennent un tableau.
