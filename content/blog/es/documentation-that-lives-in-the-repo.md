---
title: "Documentación que vive junto al código"
description: "Por qué la documentación en el repositorio se mantiene más cerca de lo cierto: los cuatro tipos de documento, un directorio que escala y dónde falla"
updated: 2026-09-09
date: 2026-07-29
tag: Workflow
keywords: documentación en markdown, docs as code, plantilla de readme, cómo escribir un buen readme, herramienta de documentación interna, docs en git, diataxis, registro de decisiones de arquitectura, estructura de una carpeta docs, archivo contributing, markdownlint, corrector de estilo de prosa
---

La wiki dice que el servicio escucha en el puerto 8080. Se movió al 8443 la primavera pasada. Nadie mintió: quien movió el puerto editó un archivo de configuración, un test y un manifiesto de despliegue, ninguno cerca de la frase que ahora es falsa.

Ese es el argumento a favor de los docs as code. Que el Markdown esté en el repositorio no vuelve correcto un documento. Pone la frase equivocada delante de la persona que está a punto de equivocarla, mientras el archivo sigue abierto.

No es una victoria gratuita, y la mayoría de los equipos que lo intentan terminan con una carpeta `docs/` que nadie abre. La diferencia entre los dos resultados no es la herramienta. Es si los documentos están ordenados por lo que el lector vino a hacer, si alguien figura como responsable de cada uno, y si la revisión que atrapa un puerto equivocado es la misma que atrapa un nombre de función equivocado.

### Resumen rápido

Pon en el repositorio todo lo que un commit pueda desmentir, y revisa el párrafo en el mismo pull request que el comportamiento que describe — ese es todo el mecanismo, y lo demás existe para sostenerlo. Ordena los archivos según los cuatro tipos de documentación para que el lector sepa qué archivo responde su pregunta, guarda las decisiones como registros fechados en vez de documentos de diseño, y deja que `CODEOWNERS`, un linter de Markdown, un corrector de prosa y un verificador de enlaces hagan fallar el build ante los errores baratos. Después publica las páginas ya renderizadas, porque quien más necesita la documentación no puede clonar un repositorio y no debería tener que hacerlo.

## Lo que el repositorio realmente aporta

**La misma revisión.** Un pull request que cambia un comportamiento y no toca ninguna documentación es una omisión visible — quien revisa puede ver el hueco mientras el cambio todavía está ahí delante. Arreglar la wiki después es una tarea aparte, y las tareas aparte pierden contra lo que sea que esté ardiendo en ese momento.

**La misma historia.** `git log -S'8080' -- docs/` encuentra el commit que añadió o quitó una cadena, lo que fecha la frase que empezó a estar mal. `git blame` te da el commit detrás de un párrafo, y desde ahí el pull request y el razonamiento que la prosa nunca recibió. Las historias de una wiki guardan revisiones, casi nunca decisiones.

**Las mismas herramientas.** Los docs en git son archivos de texto: grep los encuentra, y un verificador de enlaces puede hacer fallar el build por una ruta relativa muerta. La documentación de una función todavía sin publicar vive en la misma rama que el código y sale cuando esa rama se fusiona — ni una semana antes, ni un mes después.

**Las mismas direcciones.** Un enlace relativo de un archivo a otro es una ruta que una herramienta puede resolver y un build puede hacer fallar. Un enlace de wiki es una URL, y una página de wiki renombrada deja cada enlace hacia ella apuntando a la nada, algo que un lector descubre meses después asumiendo que el documento se borró a propósito.

**El mismo lanzamiento.** La documentación que se fusiona con el código no puede describir una versión que todavía no salió, ni quedarse atrás de una que ya salió. En una wiki, la página y el despliegue son dos eventos que alguien tiene que acordarse de alinear, y el hueco entre ambos es exactamente donde vive el número de puerto equivocado.

El límite honesto: nada de esto obliga a nadie a escribir el documento. Lo que hace es volver visible el hecho de no escribirlo, que es una promesa más pequeña que la que suele hacer la defensa habitual de los docs as code.

## Los cuatro tipos de documentación, y por qué mezclarlos oculta los cuatro

La mayoría de la documentación interna es imposible de encontrar por un motivo que no tiene nada que ver con la búsqueda. Una página llamada «Primeros pasos» abre como una lección, tres pantallas más abajo se convierte en una lista de claves de configuración, y termina con dos párrafos sobre por qué el equipo eligió Postgres. Cada parte es exacta. Nada de ella es localizable, porque quien busca la clave de configuración no abre una página llamada «Primeros pasos», y quien está aprendiendo el sistema deja de leer en la tabla.

Diátaxis es el marco que le pone nombre al problema. Es el trabajo de Daniele Procida, e identifica cuatro tipos de documentación que sirven a cuatro necesidades distintas del lector: tutoriales, guías prácticas, referencia técnica y explicación (comprobado en diataxis.fr, el 9 de septiembre de 2026). Lo que lo hace útil no es que existan cuatro categorías. Es que un solo documento puede servir bien a una sola de ellas, y que un documento que intenta servir a dos no sirve a ninguna.

| Tipo | Orientado a | La pregunta del lector | Qué aspecto tiene | Cómo se estropea |
| --- | --- | --- | --- | --- |
| Tutorial | Aprender | «Enséñame esto» | Una actividad práctica desde cero hasta un resultado que funciona | Asume un paso que el principiante no dio, y pierde la confianza |
| Guía práctica | Un objetivo | «¿Cómo hago X?» | Instrucciones a través de un problema, para alguien ya competente | Se detiene a explicar, y el lector competente pierde el hilo |
| Referencia | Información | «¿Qué opciones hay?» | Descripción neutral de la maquinaria, calcada de la estructura del código | Aconseja, especula o vende, y deja de ser fiable |
| Explicación | Comprensión | «¿Por qué es así?» | Un tratamiento discursivo que permite reflexionar, leído lejos del trabajo | Se convierte en instrucciones que nadie sigue |

Las distinciones son más marcadas de lo que parecen. Diátaxis es explícito en que las guías prácticas son totalmente distintas de los tutoriales y que ambos se confunden constantemente: un tutorial sirve a quien aprende y aún no sabe lo que quiere, mientras que una guía práctica sirve al trabajo de quien ya es competente y sabe exactamente lo que necesita. La referencia está pensada para ser austera — su trabajo es dar certeza, y la propia web lo resume diciendo que casi nadie lee material de referencia, lo consulta, con una estructura que calca la estructura del producto (comprobado en diataxis.fr, el 9 de septiembre de 2026). La explicación es la única sin un límite natural, y por eso se expande sobre todo lo demás si se la deja.

**Lo que esto cambia dentro de un repositorio.** Ordenar por tipo es casi gratis cuando los documentos son archivos. Una carpeta por tipo es el movimiento obvio:

```
docs/
  tutorials/       first-deploy.md
  how-to/          rotate-the-signing-key.md, restore-from-backup.md
  reference/       configuration.md, http-api.md, error-codes.md
  explanation/     why-we-left-the-monolith.md
  decisions/       0007-postgres-over-dynamodb.md
```

Si cuatro carpetas son más ceremonia de la que tu repositorio merece, la versión más barata también funciona: nombra cada archivo según su tipo y no mezcles los tipos dentro de él. `restore-from-backup.md` es una guía práctica y no debería contener ningún párrafo que explique el formato del backup; la explicación tiene su propio archivo y un enlace. La prueba es una sola frase — si no puedes decir cuál de los cuatro es un documento, son dos documentos.

**Por qué esta es la sección que más rinde.** Los demás fallos de este texto se pueden recuperar. Una frase desactualizada se corrige en cuanto alguien la nota; un linter que falta se añade en una tarde. Un conjunto de documentación ordenado por equipo, por servicio o por el orden en que se escribió permanece imposible de encontrar para siempre, porque nada en él le dice al lector dónde mirar, y la respuesta habitual — añadir una página que indexe las demás páginas — crea un quinto documento que también se queda obsoleto.

## Una carpeta de docs que escala

Los repositorios fallan en la documentación en dos direcciones. Una pone todo en el README hasta que tiene cuatro mil palabras y nadie lee más allá del comando de instalación. La otra crea `docs/` el primer día, la llena con tres esbozos y un `architecture.md` que describe un diseño abandonado en el segundo mes. Lo que funciona es un número pequeño de archivos con trabajos distintos, cada uno de los cuales alguien puede notar cuando está mal.

| Archivo | Qué es | Quién lo escribe | Qué lo vuelve incorrecto |
| --- | --- | --- | --- |
| `README.md` | El índice y el camino más corto a una copia funcionando | Quien cambia la instalación | Un comando que ya no funciona |
| `docs/` | Todo lo que el README superó, ordenado por tipo | Quien cambia el comportamiento | Un commit al código que describe |
| `docs/decisions/` | Un registro fechado por cada decisión de arquitectura | Quien tomó la decisión | Nada — un registro superado sigue siendo cierto sobre su propio momento |
| `CONTRIBUTING.md` | Cómo proponer un cambio y qué se va a comprobar | Quien mantiene el proyecto | Un cambio en el proceso de revisión o en las herramientas |
| `CHANGELOG.md` | Qué cambió para el lector, por cada versión | Quien publica | Una versión que sale sin su entrada |
| `CODEOWNERS` | A quién se le pide revisar qué rutas | Los líderes de equipo | Un equipo que cambia de nombre, una persona que se va |

**El README es un índice, no un manual.** Su trabajo es llevar a un desconocido hasta una copia funcionando y luego señalar todo lo demás. Cada sección que crece más de una pantalla se convierte en un archivo dentro de `docs/`, con una línea que apunta hacia él. Esta es la regla estructural más fiable de todas, porque un README que se mantiene corto se sigue leyendo, y un README que nadie lee es donde las instrucciones de instalación equivocadas se esconden más tiempo.

**`docs/` guarda lo que un commit puede desmentir.** Claves de configuración, comportamiento de la API, pasos de despliegue, códigos de error, el manual de la alerta que despierta a alguien a las tres de la madrugada. Son los documentos cuya falsedad la causa un cambio en el código, que es justo por lo que van al lado de él. Cualquier cosa cuya falsedad la causa una decisión y no un commit no gana nada por estar en git.

### Los registros de decisiones, y por qué le ganan a un documento de diseño

Un documento de diseño describe un sistema tal como alguien esperaba que fuera, con una fecha que el documento rara vez lleva, y se vuelve falso la primera vez que el plan cambia. Nadie lo actualiza, porque actualizarlo significa reescribir una narrativa, y nadie lo borra, porque todavía podría tener razón en algo.

Un registro de decisión de arquitectura tiene otra forma. Captura una única decisión y su razonamiento — una elección de diseño justificada que responde a un requisito arquitectónicamente significativo — junto con las compensaciones y consecuencias que trajo consigo. La práctica la popularizó Michael Nygard en una entrada de 2011, «Documenting Architecture Decisions», y el formato se apoya en trabajo anterior de Zdun y otros sobre decisiones de arquitectura sostenibles (comprobado en adr.github.io, el 9 de septiembre de 2026). La plantilla de Nygard es de la que parte la mayoría de los equipos; MADR — Markdown Architectural Decision Records — es una plantilla simplificada para el mismo trabajo, con doble licencia MIT o CC0 (comprobado en adr.github.io, el 9 de septiembre de 2026).

```markdown
# 7. Postgres over DynamoDB for the ledger

- Status: accepted
- Date: 2026-03-04
- Deciders: payments team

## Context

We need transactional writes across the ledger and the balance
cache. The rest of the estate is DynamoDB.

## Decision

Postgres, on the managed instance the billing service already uses.

## Consequences

One more datastore to operate, and a second connection pool in the
worker. In exchange, the double-write bug that closed BILL-412
becomes structurally impossible rather than tested for.
```

La razón por la que un registro sobrevive a un documento de diseño es que nunca está mal. Es una afirmación sobre lo que un equipo sabía y decidió en una fecha concreta. Cuando la decisión se revierte, no se edita el registro 7 — se escribe el registro 12, se marca el 7 como reemplazado, y se enlazan los dos. El resultado es una carpeta que se lee como una historia del razonamiento, que es justo lo que necesita quien se incorpora al equipo y lo que `git log` nunca termina de dar, porque un commit registra lo que cambió y no lo que se rechazó.

Numerar los archivos (`0007-postgres-over-dynamodb.md`) los mantiene ordenados y le da a cada uno un nombre estable para citar en un pull request. Mantenlos cortos. Un registro que tarda una hora en escribirse no se va a escribir, y los cuatro apartados de arriba bastan para responder la pregunta de dentro de un año, que siempre es alguna versión de «por qué demonios es así».

### CONTRIBUTING, y las comprobaciones que debería nombrar

`CONTRIBUTING.md` puede vivir en la raíz del repositorio, en `docs/` o en `.github/`, y GitHub muestra un enlace a él cuando alguien abre un pull request o un issue, además de en la barra lateral del repositorio (comprobado en docs.github.com, el 9 de septiembre de 2026). Esa ubicación es todo su valor: es el único documento que ve quien contribuye por primera vez, justo en el momento en que lo necesita.

Que se limite a lo que quien contribuye tiene que hacer, no a lo que el proyecto cree. Los pasos para correr los tests, la convención de mensajes de commit si existe, qué va a comprobar la integración continua y por lo tanto qué va a fallar, cuánto suele tardar la revisión, y dónde preguntar. Si tu documentación vive en `docs/`, este es también el lugar para decirlo — quien no sabe que los docs están en el repositorio no va a ir a buscarlos.

### CHANGELOG, y por qué no es el registro de commits

El changelog es el único archivo de la carpeta escrito para alguien fuera del repositorio. Keep a Changelog es la convención que vale la pena adoptar, en parte por sus seis categorías — Added, Changed, Deprecated, Removed, Fixed, Security — y sobre todo por su argumento de que un registro de commits es un mal changelog porque está lleno de ruido: commits de fusión, títulos oscuros, ajustes de documentación (comprobado en keepachangelog.com, el 9 de septiembre de 2026). Un commit documenta un paso en la evolución del código fuente. Una entrada de changelog documenta una diferencia relevante, a menudo repartida entre varios commits, para un lector que nunca vio el código. [Convertir ese archivo en notas que la gente de verdad lee](/blog/release-notes-from-markdown) es un oficio distinto, y el fallo siempre es el mismo: publicar el diff en vez de la consecuencia.

## Las herramientas, comparadas

Puedes llevar un conjunto de documentación con un repositorio y ningún generador: archivos Markdown, un conversor cuando alguien necesita una página, y nada que mantener. Eso deja de funcionar en el punto donde los lectores necesitan navegación, búsqueda entre documentos, y una URL estable por página. Las herramientas de abajo son las que conviene conocer antes de elegir.

| Herramienta | Qué necesita | Qué construye | Licencia | A quién le sirve |
| --- | --- | --- | --- | --- |
| Markdown puro más un conversor | Nada, si el conversor corre en el navegador | Un archivo HTML autocontenido por documento | Depende del conversor | Un puñado de manuales y READMEs; documentos con un destinatario concreto |
| MkDocs | Python | Un sitio HTML estático a partir de Markdown y un único archivo YAML | BSD 2-Clause | Proyectos en Python que quieren un sitio de docs la misma tarde |
| Material for MkDocs | Python, como tema de MkDocs | El mismo sitio, con búsqueda, navegación y tarjetas sociales integradas | MIT, con acceso anticipado a nuevas funciones para patrocinadores | Equipos que quieren que se vea bien sin escribir CSS |
| Docusaurus | Node.js, React | Un sitio estático con páginas MDX y documentación con versiones | MIT (su propia documentación es Creative Commons) | Docs de producto que deben servir varias versiones publicadas a la vez |
| Sphinx con MyST | Python | HTML, LaTeX para PDF, ePub y Texinfo desde una sola fuente | BSD 2-Clause; MyST-Parser es MIT | Referencia de API generada desde el código, y cualquier cosa que necesite PDF |
| Hugo | Nada más que el binario; escrito en Go | Un sitio estático de cualquier forma, no solo docs | Apache 2.0 | Documentación que comparte sitio con las páginas de marketing |
| mdBook | Nada más que el binario; escrito en Rust | Un libro en línea con capítulos e índice | MPL 2.0 | Material lineal — manuales, guías, formación |
| Docsify | Un servidor web; carga desde una CDN | Ningún archivo estático: renderiza el Markdown en el navegador | MIT | Una carpeta `docs/` que quieres servir sin añadir un paso de build |

Comprobado en mkdocs.org y github.com/mkdocs/mkdocs, squidfunk.github.io/mkdocs-material, docusaurus.io y github.com/facebook/docusaurus, sphinx-doc.org y github.com/sphinx-doc/sphinx, github.com/executablebooks/MyST-Parser, gohugo.io, github.com/rust-lang/mdBook y github.com/docsifyjs/docsify, el 9 de septiembre de 2026.

**MkDocs** es la distancia más corta entre una carpeta de Markdown y un sitio de documentación: un archivo YAML, un comando, HTML estático de salida (comprobado en mkdocs.org, el 9 de septiembre de 2026). Está escrito en Python y con licencia BSD 2-Clause. Si tu proyecto ya es Python, no hay nada que discutir.

**Material for MkDocs** es un tema y no un generador, y es la razón por la que la mayoría conoce MkDocs. Aporta búsqueda, navegación responsiva y generación de tarjetas sociales sin que escribas ni una línea de CSS, bajo licencia MIT, con un programa Insiders que da a los patrocinadores acceso anticipado a nuevas funciones (comprobado en squidfunk.github.io, el 9 de septiembre de 2026). El precio es que tu sitio se va a parecer a muchos otros sitios, lo que para documentación interna es más ventaja que problema.

**Docusaurus** está construido sobre React y MDX y produce archivos HTML estáticos, con el versionado de documentos como función de primera clase (comprobado en docusaurus.io, el 9 de septiembre de 2026). El versionado es la razón para elegirlo: si mantienes tres versiones publicadas y cada una necesita su propio árbol de documentación, nada más aquí lo hace con tanta limpieza. El coste es una cadena de herramientas de Node y la posibilidad de que tu documentación adquiera componentes React, que son código, lo que significa que la documentación ahora tiene un build que puede romperse.

**Sphinx** es la más antigua y la más capaz, genera HTML, LaTeX para PDF, ePub y Texinfo desde una sola fuente, y es BSD 2-Clause y está escrita en Python (comprobado en sphinx-doc.org y github.com/sphinx-doc/sphinx, el 9 de septiembre de 2026). Su marcado nativo es reStructuredText, que es una barrera real para quien solo conoce Markdown; MyST-Parser la elimina añadiendo a Sphinx un analizador de CommonMark extendido, con licencia MIT y construido sobre markdown-it-py (comprobado en github.com/executablebooks/MyST-Parser, el 9 de septiembre de 2026). Elige esta cuando necesites referencia de API generada y un PDF desde la misma fuente.

**Hugo** es un único binario de Go bajo licencia Apache 2.0 que construye sitios estáticos de cualquier forma, documentación incluida (comprobado en gohugo.io, el 9 de septiembre de 2026). Elígelo cuando los docs son una sección de un sitio más grande, o cuando nadie quiere gestionar un entorno de Python o Node en el servidor de build.

**mdBook** es una utilidad en Rust, con licencia MPL 2.0, que convierte Markdown en un libro en línea (comprobado en github.com/rust-lang/mdBook, el 9 de septiembre de 2026). Los libros son lineales, que es exactamente lo equivocado para una referencia y exactamente lo correcto para un manual o un curso que se espera leer de principio a fin.

**Docsify** es la rara: no construye nada. Carga desde una CDN, renderiza tu Markdown en el navegador en el momento de la petición, y no produce ningún HTML estático, bajo licencia MIT (comprobado en github.com/docsifyjs/docsify, el 9 de septiembre de 2026). Eso elimina el paso de build por completo, al precio de un sitio cuyo contenido es invisible para cualquier cosa que no ejecute JavaScript.

**Y ningún generador en absoluto** sigue siendo una respuesta real, más a menudo de lo que la lista anterior sugiere. Si lo que tienes son once archivos Markdown y una necesidad ocasional de entregarle uno a alguien que no usa git, un conversor y un enlace le ganan a un pipeline de build que hay que mantener verde. El umbral es la navegación: en el momento en que un lector necesita moverse entre documentos sin conocer sus nombres de archivo, quieres un generador, y [las tres preguntas que deciden si ya cruzaste ese umbral](/blog/static-site-generator-or-converter) merecen respuesta antes de instalar uno.

## La revisión es lo que mantiene un documento cierto

Todo mecanismo de este texto se reduce a un solo hábito: el párrafo cambia en el mismo pull request que el comportamiento. Todo lo demás existe para que ese hábito se mantenga cuando la persona está cansada y el lanzamiento es un viernes.

**El cambio de docs viaja con el cambio de código.** No un issue de seguimiento, no un ticket para el próximo sprint. Quien revisa y ve una clave de configuración renombrada sin ningún cambio bajo `docs/reference/` pide uno, y pedirlo cuesta un comentario. La misma petición una semana después cuesta una reunión, y la semana siguiente no cuesta nada porque ya nadie se acuerda.

**`CODEOWNERS` le pone un nombre a la carpeta.** El archivo vive en `.github/`, en la raíz del repositorio o en `docs/` — GitHub busca en ese orden y usa el primero que encuentra — y a quienes son dueños del código se les pide revisión automáticamente cuando un pull request toca rutas que poseen, aunque no en pull requests en borrador. Solo se convierte en una barrera cuando alguien con permisos de administrador activa las revisiones obligatorias y exige la aprobación de los dueños del código. La sintaxis se parece a la de gitignore, y gana el último patrón que coincide, lo cual sorprende a más de uno (comprobado en docs.github.com, el 9 de septiembre de 2026).

```
/docs/reference/http-api.md   @acme/platform
/docs/how-to/                 @acme/sre
/docs/decisions/              @acme/architecture
```

Dos reglas lo hacen útil en vez de decorativo. Que las carpetas tengan dueño, no todo el árbol, porque un único dueño sobre `docs/` significa que cada cambio de documentación espera a las mismas tres personas, y la cola le enseña a todos a saltársela. Y tener presente la regla del último patrón: uno amplio al final del archivo anula en silencio a cada uno específico de arriba.

**El linting atrapa lo que la revisión hace mal.** Quien revisa lee buscando sentido y no ve la estructura. Las máquinas hacen justo lo contrario.

| Comprobación | Herramienta | Qué atrapa | Licencia |
| --- | --- | --- | --- |
| Estructura de Markdown | markdownlint | Niveles de encabezado que se saltan, marcadores de lista inconsistentes, espacios sobrantes, bloques de código sin cerrar | MIT |
| Prosa | Vale | Desvío de terminología, palabras prohibidas, reglas de estilo de tu propia guía | MIT |
| Enlaces | lychee | Rutas relativas muertas, anclas rotas, URLs externas que dejaron de resolver | Apache 2.0 o MIT |

markdownlint es un corrector de estilo en Node.js para Markdown y CommonMark con más de sesenta reglas integradas, con licencia MIT, y se ejecuta con `markdownlint-cli2` o una GitHub Action (comprobado en github.com/DavidAnson/markdownlint, el 9 de septiembre de 2026). Activa un conjunto pequeño de reglas y deja el resto apagado — un conjunto de documentación que hace fallar la integración continua por la longitud de línea entrena a quien contribuye a añadir `<!-- markdownlint-disable -->` y dejar de leer la salida.

Vale es un corrector de prosa consciente del marcado, con licencia MIT, que entiende la estructura del documento en vez de buscar patrones en el texto crudo, y lee sus reglas desde un `.vale.ini` en el repositorio. Puedes partir de estilos publicados — el de Microsoft y el de Google entre ellos — o escribir el tuyo en YAML (comprobado en vale.sh, el 9 de septiembre de 2026). Las reglas que vale la pena tener primero son de terminología, no de estilo: una sola forma de escribir el nombre de tu propio producto, una sola palabra para lo que sigues llamando de tres maneras distintas.

lychee es un verificador de enlaces asíncrono y rápido escrito en Rust, con doble licencia Apache 2.0 o MIT, con una `lycheeverse/lychee-action` oficial para flujos de trabajo (comprobado en github.com/lycheeverse/lychee, el 9 de septiembre de 2026). Corre los enlaces internos en cada pull request y los externos según un calendario — las comprobaciones externas fallan por razones que no tienen nada que ver con tu cambio, y una comprobación obligatoria que falla por capricho se acaba ignorando, y después eliminando.

**Haz fallar el build, pero solo por lo que un lector notaría.** Un enlace relativo roto es un lector que se encuentra un 404, así que debería bloquear la fusión. Un punto final que falta en una lista no lo es, así que no debería. La lista de comprobaciones bloqueantes es una promesa sobre lo que nunca llegará a un lector, y cada elemento de esa lista que no cumpla ese criterio hace menos creíble toda la lista.

## La caducidad, y por qué «revisado por última vez» le gana a un número de versión

Un documento no anuncia que se volvió falso. Se queda ahí, seguro de sí mismo. El contrapeso no es la disciplina — son metadatos que vuelven visible la edad, y una cadencia que actúa sobre ellos.

Pon un pequeño bloque de front matter al principio de cualquier cosa que caduque con el tiempo:

```markdown
---
title: Restoring the ledger from backup
owner: payments
last-checked: 2026-09-09
review: quarterly
---
```

Tres campos, cada uno con un solo trabajo. `owner` es un equipo, no una persona, porque la gente cambia de equipo y un nombre que ya se fue es peor que ningún nombre. `last-checked` es la fecha en que alguien leyó el documento y confirmó que seguía funcionando — no la fecha del último commit, que cambia cuando arreglas una errata y no le dice nada al lector. `review` es cuánto tiempo se confía en la frase.

**Por qué «revisado por última vez» le gana a un número de versión.** Un número de versión le dice al lector qué versión describía el documento. No le dice si alguien lo revisó desde entonces, y caduca de la manera más engañosa posible: un documento marcado `v4.2` junto a un producto en `v4.9` parece obsoleto aunque cada palabra siga siendo cierta, mientras que un documento sin ninguna marca parece vigente para siempre. Una fecha no da lugar a ambigüedad. «Revisado por última vez hace 14 meses» es un hecho sobre el que el lector puede actuar sin saber nada de tu ritmo de lanzamientos, y es el mismo hecho tanto si lanzas cada semana como dos veces al año. Los conversores y los generadores de sitios estáticos tratan el front matter de manera distinta — algunos lo eliminan, algunos lo renderizan como un párrafo de líneas `clave: valor` al principio de la página — así que conviene saber [qué hace tu cadena de herramientas con la cabecera](/blog/front-matter-and-what-converters-do-with-it) antes de contar con que se muestre.

**La cadencia tiene que ser lo bastante pequeña para que ocurra.** Una revisión trimestral de cuarenta documentos es un día que nadie tiene. Una revisión trimestral de los seis documentos que despiertan a alguien de noche es una hora, y esos seis son donde el error cuesta más. Ordena por consecuencia: primero los manuales y las instrucciones de instalación, después la referencia, la explicación al final — la explicación envejece despacio porque las razones por las que un sistema tiene cierta forma rara vez cambian sin que quede marcado en un registro de decisión.

**Hábitos que lo mantienen honesto.**

- [ ] Los cambios de documentación viajan en el mismo pull request que el comportamiento que describen.
- [ ] Cada documento nombra a un responsable; `CODEOWNERS` lo hace sin necesidad de una reunión.
- [ ] Reescribe el párrafo equivocado en vez de añadir una corrección debajo.
- [ ] Todo lo que caduca con el tiempo lleva la fecha en que se revisó por última vez.
- [ ] Los documentos que nadie va a mantener se borran, no se etiquetan como «puede estar desactualizado».

El último es el que provoca más discusión y el que más importa. Una página borrada envía al lector a preguntarle a alguien; una página desactualizada lo envía con toda confianza al puerto equivocado. La solución intermedia — un aviso que diga «esta página puede estar desactualizada» — es la peor de las tres, porque traslada el riesgo a un lector que no tiene forma de evaluarlo y deja que el equipo sienta que ya resolvió el problema.

**Otro fallo que merece nombrarse.** Las instrucciones de instalación se estropean más rápido que cualquier otra cosa y se descubren las últimas, porque solo las ejecutan quienes recién se incorporan, y quien recién se incorpora asume que el fallo es suyo. Va a pasar dos horas antes de preguntar. La solución es barata y nadie la aplica: que quien se incorpore a continuación arregle el README como su primer pull request, mientras el dolor todavía está fresco y antes de que aprenda los rodeos que vuelven invisible el error.

## Dónde los docs as code fallan, y qué funciona en su lugar

Aquí está la parte que la defensa habitual se salta. Quienes más necesitan la documentación interna son con frecuencia quienes no pueden llegar a ella.

Quien lidera soporte necesita la ruta de escalado en el momento en que un cliente está gritando. Quien diseña y recién se incorpora necesita la guía de bienvenida antes de que existan sus cuentas. Quien vende necesita la respuesta a «¿esto hace SSO?» en medio de una llamada. GitHub renderiza bien el Markdown, pero llegar hasta ese renderizado cuesta una cuenta, acceso al repositorio y un ida y vuelta por SSO, y un árbol de archivos le pide a alguien sin perfil técnico que opere la herramienta interna de documentación de otra persona. «Manda un pull request contra los docs» es una frase que termina la conversación. Se oye como *esto no es para ti*, y se oye correctamente, porque quien lo dice acaba de describirle un flujo con rama, fork, revisión y cola de fusión a alguien cuyo trabajo es responder tickets.

La búsqueda es la segunda brecha, y es peor de lo que parece. La búsqueda interna de la empresa indexa la wiki, la unidad compartida y el sistema de tickets. La búsqueda de código sí abarca los repositorios de toda una organización, pero ordena por código, y le pide al lector que adivine qué repositorio guarda la respuesta — una adivinanza que alguien de ingeniería hace bien y casi nadie más. El resultado es un conjunto de documentación completo, correcto e invisible para la mayor parte de la empresa.

El tercero es la carga de revisión. Corregir una errata se convierte en una rama, un pull request y una espera. A ingeniería casi no le molesta; quien escribe dos veces al año se rinde, y su conocimiento se queda en su cabeza. Es una pérdida real, no pequeña — quien lleva soporte y ya respondió la misma pregunta cuarenta veces sabe algo que nadie en ingeniería sabe, y el camino de contribución que construiste garantiza que nunca lo va a escribir.

**Lo que sí funciona.** Tres cosas, en orden de lo que aportan.

Primero, divide según qué puede desmentir a un documento, no según quién lo escribió.

| Documento | Dónde pertenece | Qué lo vuelve incorrecto |
| --- | --- | --- |
| Instalación, configuración, comportamiento de la API, despliegue | El repositorio | Un commit |
| Manuales de operación | El repositorio, publicado como página | Un cambio de nombre en el código al que llaman |
| Rutas de escalado, bienvenida, «cómo pido X» | La wiki, o donde ya viva soporte | Un cambio de proceso, no un commit |
| Política de RRHH, notas de reuniones, registros de decisiones | La wiki | Una decisión, no un commit |

Mover ese último grupo a git solo compra fricción. Sacar el primer grupo de ahí compra desvío.

Segundo, publica las páginas ya renderizadas, para que la fuente de verdad y la superficie de lectura sean cosas distintas. El lector recibe una URL; el repositorio guarda el archivo. Nadie fuera del equipo llega a aprender nunca qué es una rama.

Tercero, haz que el camino de contribución encaje con quien contribuye. Alguien de ingeniería manda un pull request. Alguien de soporte manda un mensaje al canal nombrado en `CODEOWNERS`, o abre un issue desde una plantilla, y alguien que ya está en el repositorio escribe el párrafo. Lo que quieres es el conocimiento, no el commit de git — insistir en lo segundo es cómo se pierde lo primero.

**Publicar, en concreto.** La fuente de verdad no tiene que ser la superficie de lectura. Renderiza el Markdown y entrégale a la gente una página. Puede ser tan sencillo como soltar el archivo en TransformPipe y enviar el HTML autocontenido, o [publicar un enlace de solo lectura](/blog/share-a-markdown-document-as-a-link): «cualquiera con el enlace» para un manual público, «solo estas direcciones» para cualquier cosa interna. Revocarlo elimina el token, así que un enlace ya enviado deja de funcionar. Escala hasta [una GitHub Action que publica el Markdown que cambió un pull request](/blog/publish-markdown-from-github-actions), o un paso `tp push` [dentro del script de lanzamiento](/blog/markdown-to-html-from-the-command-line).

Un archivo autocontenido importa más aquí de lo que suena. Una página que trae su hoja de estilos desde una CDN deja de verse bien en el momento en que alguien la abre en un avión, y le dice a quien la abre algo sobre por dónde ha andado el archivo. Un solo archivo con sus estilos incluidos se abre igual en todas partes, incluso desde un adjunto de correo en un portátil sin conexión, que es justo la situación con la que más probablemente se va a encontrar un manual de escalado.

Sabe cuándo esta no es la forma correcta. Una página por documento le sienta bien a un documento con destinatario: un manual, un registro de decisión, notas de lanzamiento, un README que va a un cliente. Un conjunto que ya cruzó el umbral de la navegación descrito antes quiere un generador en su lugar, y la página pasa a ser un complemento y no un reemplazo.

## Cómo decidir qué va dónde

1. **Pregunta qué volvería falso el documento.** Si la respuesta es un commit, pertenece al repositorio, porque ahí es el único lugar donde el cambio y la frase se encuentran. Si la respuesta es una decisión o una conversación, git te compra fricción y te cuesta la audiencia.
2. **Nombra cuál de los cuatro tipos es antes de escribir una línea.** Un documento que no puedes clasificar son dos documentos, y publicarlo como uno solo garantiza que ninguno de sus dos lectores lo encuentre.
3. **Dale a cada documento un responsable y una fecha.** Un documento sin responsable es uno del que nadie responde, y uno sin fecha es uno que nadie puede juzgar; ambos sobreviven la revisión indefinidamente porque no hay nada concreto que objetar.
4. **Pon la revisión donde ocurre el cambio.** Los docs en el mismo pull request que el comportamiento cuestan un comentario; los docs en un ticket de seguimiento cuestan un sprint y casi nunca llegan.
5. **Automatiza solo lo que un lector notaría.** Un enlace muerto y un nombre de producto equivocado merecen hacer fallar un build. La longitud de línea no, y un build que falla por eso entrena a la gente a desactivar la comprobación que también atrapa el enlace muerto.
6. **Elige un generador según lo que se rompa sin él.** Si nadie se pierde sin navegación ni búsqueda, un conversor y un enlace son menos que mantener que un build; si los lectores no encuentran el segundo documento, necesitabas un generador hace dos meses.
7. **Dale a quien no es de ingeniería una superficie de lectura y un camino de contribución que no sea git.** De lo contrario la documentación es correcta, actual, y la leen las ocho personas que la escribieron.

## Conclusión

La wiki se desvía porque no es donde ocurre el cambio; el repositorio se mantiene porque sí lo es. Ese es todo el argumento, y sobrevive al contacto con la realidad solo si quien no puede usar git de todos modos recibe una página que puede abrir. Elige el documento que hoy está más equivocado — normalmente las instrucciones de instalación —, arréglalo en una rama, revísalo como código, y después envíale a quien lo necesitó la semana pasada un enlace en vez de una ruta de repositorio. [Convertir el Markdown a un archivo HTML autocontenido](/) tarda más o menos lo mismo que adjuntarlo, ocurre en tu navegador sin subir nada, y el conjunto completo de opciones está en [los docs](/docs).

## Preguntas frecuentes

### ¿Qué es Diátaxis, y tengo que adoptarlo entero?

Diátaxis es un marco de documentación de Daniele Procida que ordena la documentación en tutoriales, guías prácticas, referencia y explicación según la necesidad del lector (comprobado en diataxis.fr, el 9 de septiembre de 2026). No tienes que adoptar su estructura de carpetas ni su vocabulario. La parte útil es la prueba: nombra cuál de los cuatro es un documento antes de escribirlo, y divídelo si no puedes.

### ¿La documentación debería vivir en el mismo repositorio que el código que describe?

Para cualquier cosa que un commit pueda volver falsa, sí — ese es todo el mecanismo, y un repositorio de docs separado reintroduce el hueco que estabas intentando cerrar. Para documentación que abarca muchos servicios, un repositorio separado se puede defender, pero espera el mismo desvío que tenía la wiki, porque el cambio y la frase vuelven a estar en pull requests distintos.

### ¿Cuál es la diferencia entre un ADR y un documento de diseño?

Un documento de diseño describe un sistema previsto y se vuelve falso cuando el plan cambia. Un registro de decisión de arquitectura captura una decisión, su contexto y sus consecuencias en una fecha, y sigue siendo cierto para siempre porque es una afirmación sobre un momento (comprobado en adr.github.io, el 9 de septiembre de 2026). Un registro se reemplaza con uno nuevo, no se edita.

### ¿Necesito un generador de sitios estáticos para documentación interna?

No hasta que los lectores necesiten moverse entre documentos sin conocer los nombres de archivo. Por debajo de ese umbral, archivos Markdown más un conversor es menos de mantener y nunca rompe el build. Por encima, elige de la tabla anterior según lo que tu equipo ya use — los equipos de Python recurren a MkDocs, los de Node a Docusaurus, y quien quiera un solo binario, a Hugo o mdBook.

### ¿Cómo evito que la documentación se quede desactualizada sin tener a alguien escribiendo a tiempo completo?

Haz visible la edad y haz pequeña la revisión. Una fecha `last-checked` en el front matter le dice al lector lo que un número de versión no puede, y una pasada trimestral solo sobre los documentos cuyo error despierta a alguien de noche es una hora en vez de un día. Borra lo que nadie va a mantener en vez de etiquetarlo como dudoso.

### ¿Cómo lee documentación guardada en un repositorio quien no es de ingeniería?

Dale una página ya renderizada, no una ruta de repositorio. Publicar el Markdown como un archivo HTML autocontenido o como un enlace de solo lectura significa que recibe una URL que se abre en cualquier parte, sin cuenta, sin acceso al repositorio y sin nada que instalar — y para las contribuciones, enrútalas por el canal nombrado en `CODEOWNERS` en vez de por un pull request.

### ¿Qué linters vale la pena poner en la integración continua para documentación?

Tres, y solo con reglas que un lector notaría: markdownlint para la estructura, Vale para la terminología, y un verificador de enlaces como lychee para las rutas muertas (comprobado en github.com/DavidAnson/markdownlint, vale.sh y github.com/lycheeverse/lychee, el 9 de septiembre de 2026). Corre las comprobaciones de enlaces internos en cada pull request y las externas según un calendario, porque una URL externa que falla un martes no tiene nada que ver con tu cambio.
