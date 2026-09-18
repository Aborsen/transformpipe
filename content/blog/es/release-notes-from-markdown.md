---
title: Notas de versión que la gente lee de verdad
description: "Notas de versión en vez de un registro de commits: los seis tipos de Keep a Changelog, qué es un cambio disruptivo, qué generadores ayudan y qué no pueden escribir"
updated: 2026-09-09
date: 2026-08-14
tag: Workflow
keywords: notas de version en markdown, changelog en markdown, keep a changelog en español, formato de registro de cambios, plantilla de notas de version, versionado semantico cambio disruptivo, changelog desde conventional commits, generador de changelog
---

La mayoría de los registros de cambios son un registro de commits con los hashes quitados. «Se refactorizó el manejador de tokens.» «Se sube de versión una dependencia.» «Se arregla un caso límite en el analizador.» Cada línea es cierta, y ninguna ayuda a quien tiene que decidir si actualizar esta semana. Las notas de versión son un documento distinto con un trabajo distinto: dicen qué cambió para quien lee, qué se rompe, y qué hacer al respecto.

### Resumen rápido

Keep a Changelog te da seis tipos de cambio —Added, Changed, Deprecated, Removed, Fixed, Security— y un encabezado `Unreleased` que hace que el hábito se sostenga, porque siempre hay dónde poner la línea mientras el cambio está fresco (comprobado en keepachangelog.com, el 9 de septiembre de 2026). El versionado semántico le dice a quien lee cuánta atención prestar, pero solo si el proyecto ha escrito qué significa para él un cambio disruptivo. Los generadores —las propias notas de versión de GitHub, release-please, semantic-release, git-cliff, changesets, auto-changelog— van a montar la lista a partir de commits o de archivos de changeset, y ninguno puede escribir las dos frases que dicen por qué existe esta versión y quién se la puede saltar. Mantén el archivo en el repositorio como Markdown, escribe la parte humana a mano, y convierte cuando alguien fuera del repositorio necesite un enlace.

La fricción no es que los registros de cambios sean difíciles de escribir. Es que nadie ha decidido para quién son. Un archivo que tiene que servir a quien mantiene el proyecto y está haciendo un bisect de una regresión, al cliente que decide si actualizar durante el fin de semana, y a quien integra con un analizador que está a punto de romperse, no va a servirle a ninguno de los tres, porque esos tres lectores quieren cosas distintas de las mismas doce líneas.

La segunda fricción es el momento. Las notas de versión escritas la noche del lanzamiento se reconstruyen a partir de `git log`, y la reconstrucción es donde se pierden las razones: quien escribe la línea puede ver que un valor por defecto cambió y no recuerda qué ticket de soporte lo hizo necesario. Para entonces lo único barato que queda es una lista, así que una lista es lo que se publica.

## Qué pertenece a las notas de versión, y qué pertenece al registro de commits

El registro de commits documenta cómo llegó el código hasta aquí, para quien tenga que hacer un bisect de una regresión dentro de dieciocho meses. Las notas de versión son para alguien que nunca ha visto el código y tiene diez segundos.

| El cambio | Registro de commits | Notas de versión |
| --- | --- | --- |
| Se reescribió la lógica de reintentos | `refactor(http): replace retry loop with backoff` | Las peticiones fallidas se reintentan tres veces, con una espera creciente. Nada que configurar. |
| Se renombró una clave de configuración | `feat: rename apiKey to api_key` | `apiKey` ahora es `api_key`. El nombre antiguo sigue funcionando y avisa con un warning. |
| Se arregló el analizador de tablas | `fix: off-by-one in table row parser` | Las tablas de una sola columna ya no pierden su última fila. |

Tres pruebas para una línea candidata: el comportamiento de quien lee cambia, podría haber sufrido el fallo, o notaría la diferencia sin que nadie le avisara. Una línea que no pasa ninguna de las tres se queda en el registro de commits. Las refactorizaciones internas y las subidas de dependencias que no cambian nada observable también se quedan ahí.

Keep a Changelog hace el mismo argumento desde el otro lado, y avisa contra usar un diff del registro de commits como registro de cambios directamente: está lleno de commits de fusión, títulos oscuros y cambios de documentación que entierran lo que quien lee vino a buscar (comprobado en keepachangelog.com, el 9 de septiembre de 2026). No es una queja sobre la higiene de los commits. Un mensaje de commit bien escrito sigue estando escrito para quien revisa con el diff abierto al lado, y quien lee notas de versión no tiene ningún diff ni intención de buscar uno.

Hay un tercer documento que merece separarse, porque es el que más a menudo se cuela dentro de un registro de cambios: la guía de actualización. Una entrada de changelog es una línea y un enlace. Una guía de actualización es una página con ejemplos de código, un orden de operaciones, y la parte sobre vaciar la cola primero. Mezclarlas significa que quien hojea buscando rupturas tiene que leerse el tutorial, y quien hace la migración tiene que encontrar el tutorial dentro de una lista.

## Los seis tipos de cambio, y qué pertenece bajo cada uno

Keep a Changelog 1.1.0 define seis tipos, y la razón para empezar ahí en vez de inventar los propios no es estética: las categorías son consecuencias, así que quien lee y solo le importa una de ellas puede leer un encabezado e irse. La especificación tiene licencia MIT, y sus principios rectores son cortos —los registros de cambios son para humanos, cada versión tiene una entrada, los cambios se agrupan por tipo, las versiones y las secciones son enlazables, lo más nuevo primero, se muestran las fechas de lanzamiento, y se sigue el versionado semántico (comprobado en keepachangelog.com, el 9 de septiembre de 2026).

| Tipo | Qué pertenece ahí | Qué no pertenece | Qué hace quien lee con ello |
| --- | --- | --- | --- |
| Added | Nuevos endpoints, ajustes, comandos, pantallas, formatos aceptados, permisos | Una nueva clase interna; una nueva prueba; un nuevo paso de compilación | Lo lee si estaba esperándolo, lo salta si no |
| Changed | Valores por defecto, límites, tiempos, orden de clasificación, redacción, forma de la salida, códigos de error | Una reescritura con el mismo comportamiento observable | Comprueba si sigue valiendo alguna suposición que hizo |
| Deprecated | Cualquier cosa que todavía funciona y tiene una fecha de fin declarada | Algo que te desagrada pero no tienes plan de quitar | Programa trabajo antes de la fecha que diste |
| Removed | Endpoints, flags, claves de configuración, formatos, soporte de plataforma y runtime | Código interno muerto que nadie podía llamar | Se detiene, lee la línea de migración, planea la actualización |
| Fixed | Un comportamiento erróneo que quien lee podría haber sufrido | Un fallo introducido y arreglado dentro de la misma versión | Averigua si le afectó, y desde cuándo |
| Security | Vulnerabilidades parcheadas, con severidad y qué quedó expuesto | Un endurecimiento al que nadie estuvo expuesto — eso es Changed | Aplica el parche ya, o le explica a alguien por qué no |

### Added

Capacidad nueva, descrita como algo que quien lee ya puede hacer en vez de algo que tú construiste. «Las exportaciones se pueden filtrar por rango de fechas» es una entrada; «se añadió soporte de filtro de rango de fechas al servicio de exportación» es un informe de estado. Added es la sección que la gente hojea al final y la más fácil de sobrellenar, porque cada ticket cerrado se siente como una adición. Si nadie fuera del equipo puede llegar a ella, todavía no es una adición.

### Changed

La sección más infrautilizada y más cara. Changed es donde se mueven los valores por defecto, se aprietan los límites, se acortan los timeouts, los códigos de error se vuelven más específicos y el orden de clasificación se invierte —nada de eso es un arreglo de fallo y todo puede romper a alguien que escribió código contra el comportamiento anterior. Cada línea de Changed debería llevar el valor antiguo y el nuevo, porque «se mejoró el limitador de peticiones» no le dice nada a quien lee sobre lo que puede hacer, y «el margen de ráfaga es de 60 peticiones, antes 120» le dice exactamente si le importa.

### Deprecated

Una obsolescencia sin fecha no es una obsolescencia, es una opinión. La entrada necesita tres cosas: qué queda obsoleto, qué usar en su lugar, y cuándo deja de funcionar —una versión, una fecha, o las dos. Deprecated es también la única sección que describe algo que aún no ha pasado, y por eso es la que quien lee se salta y la que más le cuesta cuando lo hace.

### Removed

La sección que decide si una actualización es segura, así que va cerca del principio de la entrada sea lo que sea que sugiera el orden de la especificación. Cada línea necesita el reemplazo y la forma del trabajo: no solo que `/v1/export` desapareció, sino que `/v2/exports` devuelve el mismo cuerpo con `id` como cadena de texto. Una línea de Removed sin reemplazo está bien cuando de verdad no hay ninguno, y entonces dilo con claridad en vez de dejar que quien lee busque uno.

### Fixed

Fixed lo lee gente que quiere averiguar si un problema que tuvo era este problema. Eso hace que la condición afectada sea más útil que el mecanismo: «las subidas de más de 2 GB fallaban en silencio en conexiones más lentas de 1 Mbps» le permite a quien lee reconocer su propio síntoma, mientras que «se arregló una condición de carrera en el manejador de subidas por fragmentos» no. Si un arreglo cambia un comportamiento en el que alguien había llegado a confiar, pertenece también a Changed, o en su lugar.

### Security

Indica la severidad, qué podía hacer un atacante, y si explotarlo necesitaba autenticación. Si usas identificadores CVE o una escala de severidad, úsalos con consistencia, porque quien decide si aplicar el parche fuera de horario está haciendo aritmética de riesgo y necesita esos datos. Las entradas de Security también son las que más a menudo lee alguien que no es cliente —un auditor, un cuestionario de compras, un equipo de seguridad— así que sobreviven a la propia versión durante años.

### La sección Unreleased como hábito de trabajo

Keep a Changelog pone un encabezado `Unreleased` arriba para que quien lee vea qué viene y para que lanzar se convierta en mover contenido en vez de escribirlo (comprobado en keepachangelog.com, el 9 de septiembre de 2026). El hábito importa más que el encabezado. Cuando existe `Unreleased`, la pull request que cambia un valor por defecto puede añadir la línea que lo describe, revisada por la misma persona que revisa el cambio, en el momento en que los dos todavía recuerdan por qué.

Eso convierte una pregunta difícil —qué cambió en las últimas seis semanas— en cincuenta preguntas fáciles. También le da algo que detectar a la revisión: una pull request que cambia comportamiento observable y no toca ninguna línea del changelog es una omisión visible, que es el refuerzo más barato posible. El coste son los conflictos de fusión, porque todo el mundo edita las mismas líneas arriba del mismo archivo. Dos cosas los reducen: mantener la entrada más nueva arriba de cada subsección para que las adiciones aterricen en un solo sitio, o pasar a un archivo por cambio, que es el problema que resuelven los changesets.

### Agrupa por impacto, no por componente

Dividir las notas en `auth-service`, `billing-worker` y `web` describe cómo se repartió el trabajo, no cómo llega al usuario. Quien lee preguntándose si esta versión rompe su integración tiene que leer cada sección, y no va a leer ninguna.

Keep a Changelog lista Added primero, pero nada obliga a mantener ese orden. Removed y Changed responden la pregunta con la que llega la mayoría de la gente, así que ve primero con ellos, luego Security, luego Fixed, luego Added. La especificación es una estructura, no una hoja de estilos.

En un monorepo donde los equipos consumen paquetes de otros, las notas por componente son la mejor respuesta: cada lector es dueño de un servicio y solo quiere su sección. Dos documentos suelen resolverlo mejor: agrupación por componente para quien lo construye, agrupación por impacto para quien lo usa, y el segundo se deriva del primero lo bastante a menudo como para que valga la pena organizar la fuente así.

### Un formato de changelog que puedes copiar

La estructura es Markdown sencillo, y ese es el punto: se compara con diff, se revisa y se convierte.

```markdown
## [Unreleased]

## [1.4.0] - 2026-08-14

### Removed
- The `/v1/export` endpoint. Use `/v2/exports`; the response is identical
  apart from `id`, now a string.

### Changed
- Session cookies last 30 days instead of 7. Existing sessions are unaffected.

### Fixed
- Uploads over 2 GB no longer fail silently on slow connections.

[Unreleased]: https://example.com/compare/v1.4.0...HEAD
[1.4.0]: https://example.com/compare/v1.3.0...v1.4.0
```

Las fechas en ISO 8601 se ordenan bien y no se pueden malinterpretar entre regiones, que es por lo que la especificación las pide (comprobado en keepachangelog.com, el 9 de septiembre de 2026). Las referencias de enlace al final apuntan cada versión a su propio diff, y mantenerlas como enlaces de estilo referencia en vez de URLs en línea mantiene las entradas legibles en el archivo crudo — que es donde la mayoría de la gente las va a leer.

Dos detalles ahorran discusiones más adelante. Usa `## [1.4.0]` en vez de un encabezado de nivel superior por versión, para que el archivo tenga un solo título y cada versión quede al mismo nivel; un sitio de documentación que renderice el archivo producirá si no una página con varios títulos compitiendo. Y mantén todo el historial en un solo archivo hasta que sea genuinamente inmanejable, momento en el que conviene archivar por año en vez de por versión mayor, porque quien lee busca por fechas.

## Versiones, cambios disruptivos, y los commits debajo

Un número de versión es una promesa sobre cuánto cuidado hay que poner al leer. El versionado semántico 2.0.0 lo dice en una línea cada uno: MAJOR para cambios incompatibles de la API, MINOR para funcionalidad añadida de forma compatible hacia atrás, PATCH para arreglos de fallos compatibles hacia atrás (comprobado en semver.org, el 9 de septiembre de 2026).

| Salto | Qué le promete a quien lee | Qué debería hacer |
| --- | --- | --- |
| PATCH | Nada de lo que dependía ha cambiado de forma | Actualizar, leer solo Fixed y Security |
| MINOR | Existen cosas nuevas; las antiguas se comportan igual | Actualizar, hojear Added por lo que estaba esperando |
| MAJOR | Algo de lo que puede depender desapareció o es distinto | Leer Removed y Changed por completo, planear el trabajo |

La promesa solo se sostiene si el proyecto ha dicho cuál es su superficie pública. La especificación es explícita: el software que use versionado semántico debe declarar una API pública, en el código o en la documentación, y esa declaración debería ser precisa y completa (comprobado en semver.org, el 9 de septiembre de 2026). La mayoría de los proyectos se saltan esto, y entonces cada discusión sobre si un cambio fue disruptivo se convierte en una discusión sobre intenciones.

### Qué cuenta como cambio disruptivo para este proyecto

Esta es la única pregunta de versión que de verdad tiene quien lee, y ninguna especificación puede responderla, porque «incompatible» depende de lo que prometiste. Escribe la respuesta una vez, en la guía de contribución, y la conversación de cada versión se vuelve corta. Una lista razonable de partida de lo que cuenta:

- Quitar o renombrar cualquier cosa invocable: un endpoint, un flag, una clave de configuración, una función exportada, un nombre de evento.
- Quitar un campo de una respuesta, o cambiar su tipo. Añadir uno suele ser seguro; hacer obligatorio un campo que era opcional no lo es.
- Endurecer una validación, de modo que una entrada que antes se aceptaba ahora se rechaza.
- Cambiar un valor por defecto, cuando el valor antiguo estaba haciendo trabajo por gente que nunca lo configuró.
- Cambiar un código de error, un estado de salida, o la forma de un cuerpo de error contra el que ramifica quien llama.
- Dejar de soportar un runtime, un sistema operativo o una versión de base de datos.
- Cambiar el orden de la salida, cuando nada lo prometía pero todo el mundo confiaba en él.
- Arreglar un fallo de una forma que quita un comportamiento en el que se apoyaba la gente. Este es genuinamente discutido, y el manejo honesto es nombrarlo tanto en Changed como en Fixed, y decir a quién afecta.

Luego las cosas que de forma fiable arrancan discusiones y merece la pena decidir de antemano: el formato de los logs, los nombres de las métricas, los nombres de clase HTML, el esquema de base de datos para quien consulta directamente, y cualquier cosa alcanzable por reflexión o por una interfaz de plugin. Si eso no forma parte de la superficie pública, dilo antes de que alguien dependa de ello.

### La versión cero, y la salida de emergencia de las prelanzamientos

La versión mayor cero es para desarrollo inicial: cualquier cosa puede cambiar en cualquier momento, y la API pública no debería considerarse estable (comprobado en semver.org, el 9 de septiembre de 2026). Eso es una licencia real para moverse, y caduca en el momento en que alguien pone eso en producción. Si estás en `0.x` y el changelog ha dejado de mencionar cambios disruptivos porque están permitidos, el número de versión ahora le está escondiendo información a quien lee en vez de dársela.

Los identificadores de prelanzamiento —la parte después de un guion— son para lanzar a gente que aceptó el riesgo, y los metadatos de compilación después de un signo más se ignoran por completo al comparar versiones (comprobado en semver.org, el 9 de septiembre de 2026). Ninguno de los dos sustituye una entrada de changelog. Alguien que actualiza a `2.0.0-rc.1` sigue necesitando la lista, y quizá la necesita más que nadie.

### Conventional Commits como la entrada

Si un generador va a escribir la lista, algo tiene que decirle qué commits importan. Conventional Commits 1.0.0 es la respuesta habitual: un mensaje con la forma `<tipo>[ámbito opcional]: <descripción>`, con un cuerpo y pies opcionales. Nombra `feat` y `fix` y permite otros, sugiriendo `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` y `test`. Los cambios disruptivos se señalan o con un pie `BREAKING CHANGE:` o con un `!` antes de los dos puntos, y la relación con las versiones es directa: `fix` es un PATCH, `feat` es un MINOR, y un cambio disruptivo de cualquier tipo es un MAJOR (comprobado en conventionalcommits.org, el 9 de septiembre de 2026).

Vale la pena adoptarlo, y vale la pena ser honesto sobre qué compra. Hace posible la generación: una herramienta puede clasificar commits en secciones y calcular la siguiente versión sin que nadie intervenga. No hace que las notas sean buenas. La convención limita el prefijo, no la frase de después, y `feat(export): add dateFrom param to POST /exports` es un conventional commit correcto y una línea de changelog pobre.

### Lo que la convención no arregla

Cuatro huecos, todos los cuales aparecen en la salida generada:

- **El destinatario de la frase.** Una descripción de commit está escrita para quien lee el diff. Nada en la convención le pide a quien escribe que escriba para un cliente, así que nadie lo hace.
- **Un cambio, varios commits.** Un cambio visible para el usuario suele llegar como cuatro commits repartidos en dos semanas. Un generador emite cuatro líneas; quien lee necesitaba una.
- **Severidad y urgencia.** No hay ningún tipo `security:` en la especificación, y ninguna forma de decir «crítico, parchear esta noche» en un prefijo. Ese juicio lo añade una persona después, o no se añade.
- **Títulos de squash-merge.** En un repositorio que hace squash, el título de la pull request se convierte en el mensaje del commit y por tanto en la línea del changelog. Eso es o bien un argumento para revisar los títulos de pull request como texto publicado, o un argumento para no generar las notas a partir de ellos.

## Los generadores de changelog, comparados

Todos estos son gratuitos. La diferencia interesante es qué lee cada uno, porque eso fija qué puede llegar a saber.

| Herramienta | Lee | Produce | No puede saber | Licencia |
| --- | --- | --- | --- | --- |
| Notas de versión automáticas de GitHub | Pull requests fusionadas, sus etiquetas y colaboradores | Un cuerpo de release en el release de GitHub, categorizado por etiqueta | Cualquier cosa ausente de un título o etiqueta de pull request; si un cambio te rompe algo | Parte de GitHub |
| release-please | El historial de git, buscando mensajes de Conventional Commits | Una pull request de release, un changelog actualizado, saltos de versión en archivos de lenguaje, etiquetas y releases de GitHub | Cualquier cosa que no esté en un mensaje de commit; no publica a registros de paquetes | Apache 2.0 |
| semantic-release | Mensajes de commit (convención Angular por defecto) y etiquetas de git | La siguiente versión, notas de versión, una etiqueta de git, una publicación a registro y un release de GitHub | Cualquier cosa que no esté en un mensaje de commit; no escribe ningún archivo de changelog salvo que añadas el plugin | MIT |
| git-cliff | El historial de git, vía conventional commits o tus propios analizadores por regex | Un archivo de changelog con la forma que diga la plantilla | Cualquier cosa que no esté en un mensaje de commit | Apache 2.0 o MIT |
| changesets | Archivos Markdown de changeset que escribe a mano un colaborador | Saltos de versión, changelogs y publicación en un monorepo | Cualquier cosa para la que nadie escribió un changeset | MIT |
| auto-changelog | Etiquetas de git, historial de commits, commits de fusión e issues cerrados por palabra clave | Un archivo de changelog en forma compacta, Keep a Changelog o JSON | Cualquier cosa que no esté en un commit, una fusión o un issue enlazado | MIT |

### Las notas de versión generadas automáticamente de GitHub

Integradas en la página de releases de GitHub como alternativa automática a escribir el cuerpo a mano: produce un resumen de las pull requests fusionadas, una lista de colaboradores y un enlace al changelog. Un archivo `.github/release.yml` la controla — declaras categorías y las etiquetas de pull request que caen en cada una, y puedes excluir pull requests por etiqueta o por autor, de forma global o por categoría (comprobado en docs.github.com, el 9 de septiembre de 2026).

**Qué no puede saber:** cualquier cosa que no esté en un título o una etiqueta. Eso la hace exactamente tan buena como tus títulos de pull request, y no tiene ningún concepto de cambio disruptivo salvo que crees una etiqueta para ello y te acuerdes de aplicarla. **Úsala cuando** el público sean desarrolladores que ya lean el repositorio, y la alternativa sea no tener notas en absoluto.

### release-please

Analiza el historial de git buscando mensajes de Conventional Commits y abre una pull request de release que mantiene actualizada mientras se fusiona el trabajo; al fusionarse actualiza el changelog, sube versiones en archivos específicos de cada lenguaje, etiqueta, y crea el release de GitHub. No publica a gestores de paquetes ni gestiona ramificación compleja, y existe una action recomendada, `googleapis/release-please-action`. Licencia Apache 2.0 (comprobado en github.com/googleapis/release-please, el 9 de septiembre de 2026).

**Qué no puede saber:** cualquier cosa ausente de los mensajes de commit. **Úsala cuando** quieras que el changelog se revise antes de publicarse. La pull request de release es la superficie de revisión, y es la única herramienta de esta lista que invita a una persona a editar el texto generado antes de que nadie lo lea — que es exactamente la propiedad que le conviene a un equipo al que le importa la prosa.

### semantic-release

Determina el siguiente número de versión, genera las notas de versión y publica el paquete, dirigido por mensajes de commit bajo una convención formalizada (Angular por defecto) y por etiquetas de git para encontrar el último release. Se configura mediante plugins, y los cuatro activados por defecto son `commit-analyzer`, `release-notes-generator`, `npm` y `github`; escribir un `CHANGELOG.md` en el repositorio necesita `@semantic-release/changelog`, que no es uno de ellos. Licencia MIT (comprobado en github.com/semantic-release/semantic-release y semantic-release.gitbook.io, el 9 de septiembre de 2026).

**Qué no puede saber:** cualquier cosa ausente de los mensajes de commit — y por diseño no hay ningún paso humano, así que nada se edita en el camino. **Úsala cuando** el release deba ser una consecuencia de fusionar y nadie deba tener que decidir nada. Eso es un beneficio genuino y también la contrapartida: los releases completamente automatizados y las notas de versión escritas a mano tiran uno contra el otro, y la mayoría de los equipos lo resuelven publicando las notas generadas para desarrolladores y escribiendo una página humana aparte para todos los demás.

### git-cliff

Un generador de changelog escrito en Rust que sigue Conventional Commits y añade analizadores por regex propios para historiales que no lo hacen. La configuración vive en `cliff.toml`, donde defines analizadores de commits y grupos, y la forma de la salida es una plantilla: usa Tera, cuya sintaxis está basada en Jinja2 y en las plantillas de Django. Disponible en crates.io, npm, PyPI y Docker, con doble licencia Apache 2.0 o MIT (comprobado en github.com/orhun/git-cliff y git-cliff.org, el 9 de septiembre de 2026).

**Qué no puede saber:** cualquier cosa ausente de los mensajes de commit. **Úsalo cuando** tengas un historial existente que no sigue ninguna convención, o cuando la salida tenga que coincidir con un formato que alguien más especificó — los analizadores por regex y la plantilla juntos van a acertar casi cualquier forma, algo que ninguno de los demás promete de verdad.

### changesets

La rareza de la lista, y la razón para mirarla. En vez de leer commits, lee archivos Markdown que los colaboradores escriben a propósito: un changeset declara qué paquetes cambiaron, cuánto subir cada uno, y qué decir sobre ello. A partir de eso sube versiones, escribe changelogs y publica, con los monorepos y los paquetes interdependientes como su foco explícito. Licencia MIT (comprobado en github.com/changesets/changesets, el 9 de septiembre de 2026).

**Qué no puede saber:** cualquier cosa para la que nadie escribió un changeset. **Úsalo cuando** las notas importen más que la automatización. Pedirle a quien escribe que redacte la frase en el momento en que hace el cambio es toda la idea, y evita a la vez los conflictos de fusión de un bloque `Unreleased` compartido y el problema de destinatario de los mensajes de commit. El coste es un paso que la gente olvida, por lo que los equipos que lo adoptan suelen añadir una comprobación que hace fallar una pull request que no lleva ningún changeset.

### auto-changelog

Una herramienta de línea de comandos que genera un changelog a partir de etiquetas de git e historial de commits, incluidos commits de fusión e issues cerrados por palabra clave, con salida compacta, en forma Keep a Changelog o en JSON. No necesita ninguna convención de commits, usa plantillas con Handlebars, soporta GitHub, GitLab, BitBucket y Azure DevOps, y marcará los cambios disruptivos si le pasas un `--breaking-pattern` que coincida con cómo sea que tus mensajes los señalen. Licencia MIT (comprobado en github.com/cookpete/auto-changelog, el 9 de septiembre de 2026).

**Qué no puede saber:** cualquier cosa que no esté en un commit, una fusión o un issue enlazado. **Úsala cuando** hayas heredado un repositorio con años de historial desordenado y quieras algo razonable a partir de él hoy mismo, sin reescribir los commits de nadie ni adoptar antes una convención.

## Lo que un changelog generado deja fuera

La generación es la respuesta obvia, y para la lista de cambios es la correcta. Donde falla es en todo lo que no es una lista, y los fallos son lo bastante consistentes como para nombrarlos.

**La razón por la que existe el release.** Doce entradas no le dicen a quien lee que esta es la versión que arregla los timeouts de exportación de los que todo el mundo se ha estado quejando. Dos frases arriba de la entrada sí. Ninguna herramienta puede escribirlas, porque la razón vive en tickets de soporte y en conversaciones, no en commits.

**Quién puede saltársela.** «Si no usas la integración SAML, aquí no hay nada para ti» ahorra más tiempo de lectura que cualquier otra frase de un changelog, y es la frase que un generador nunca va a producir, porque producirla exige saber qué podría no usar quien lee.

**Severidad, en cualquier dirección.** La salida generada aplana todo a una línea por commit. Un parche de seguridad y un arreglo de tooltip se ven idénticos, y quien lee tiene que averiguar cuál es cuál a partir de la redacción. Marcar las dos entradas que importan es tarea de una persona.

**Problemas conocidos.** El fallo con el que se lanzó, a propósito, porque la alternativa era retrasar el release. No aparece en ningún commit, porque no se arregló. Dejarlo fuera significa que la primera persona que lo sufre abre un ticket, y la segunda, y la undécima.

**La disculpa, cuando se debe una.** Si el último release rompió algo en producción para los clientes, las notas del siguiente release son donde eso se reconoce. El silencio se lee como no haberlo notado.

**Lo que cuesta.** Presupuesta la parte humana en menos de una hora por release para una persona designada, más la revisión de la línea de changelog dentro de cada pull request, que es un vistazo y no una tarea. Esa es la factura entera, y es por lo que el argumento de la automatización total suele ganar por defecto en vez de por mérito. El coste de no pagarla queda repartido y es más difícil de ver: tickets de soporte que en realidad son preguntas de changelog, clientes estancados tres versiones atrás porque nadie les pudo decir si actualizar era seguro, e integradores que se enteran de un campo eliminado por un error en vez de por ti.

El arreglo que funciona es hacer las dos cosas. Deja que un generador monte la lista a partir de commits o de changesets, y luego que una persona añada el resumen, marque las severidades, añada los problemas conocidos y compruebe que cada línea de Removed tiene adónde enviar a quien lee. Primer borrador generado, pasada final humana. Ninguna de las dos mitades es opcional, y la segunda es la que se deja caer.

## Quién lee un release, y qué necesita cada uno

Una página de release atiende a varias personas que llegan con preguntas distintas. Nombrarlas hace evidentes las omisiones, porque la mayoría de los changelogs responden a la primera pregunta e ignoran las otras dos.

| Lector | Llega preguntando | Necesita en la página | Se va sin ello |
| --- | --- | --- | --- |
| Quien actualiza | ¿Debería hacerlo ahora? | Si algo se rompe, el tamaño del cambio, y una razón para molestarse | Se queda en la versión antigua indefinidamente |
| Quien integra | ¿Mi código sigue funcionando? | Cada eliminación y cambio de comportamiento, nombrado exactamente como lo nombra su código | Se entera por un 4xx en producción |
| Quien opera | ¿Qué pasa cuando lo despliego? | Migraciones, reinicios, cambios de configuración, cambios de recursos, cómo revertir | Se encuentra la migración de esquema durante el despliegue |

### Quien actualiza

Alguien en la versión 1.2 decidiendo si gastar una tarde en la 1.4. Lo primero que necesita es un sí o un no sobre rupturas, y luego una frase que diga por qué existe el release. Si se está saltando versiones necesita las entradas de todo lo intermedio, que es un argumento para un solo archivo con todo el historial en vez de una página por release. Las notas que empiezan con funciones nuevas están respondiendo la pregunta que este lector hizo en segundo lugar.

### Quien integra

Alguien cuyo código llama al tuyo. No le importa de qué va el release; le importa si alguno de los seis o siete nombres de los que depende aparece en Removed o Changed. Este lector es la razón por la que las entradas tienen que usar el identificador exacto —`api_key`, `POST /v2/exports`, `EXPORT_TIMEOUT_MS`— porque va a buscar en la página la cadena que contiene su propio código. Una prosa que diga «el ajuste de configuración de exportación» es imposible de buscar y por tanto inútil para este lector.

### Quien opera

Alguien que lo despliega. Sus preguntas apenas tienen que ver con el software: ¿esto necesita una migración?, ¿necesita un reinicio?, ¿cambia el uso de memoria o de conexiones?, ¿se puede revertir después de que corra la migración?, ¿sigue funcionando la versión antigua mientras las dos están vivas? Casi ningún changelog responde a esto, y es la omisión que convierte una actualización rutinaria en un incidente. Un bloque corto de «Desplegando este release» arriba de cualquier entrada que lo necesite es suficiente.

## Escribe la entrada, no el título del ticket

Una plantilla de notas de versión solo ayuda si las líneas de dentro están escritas para quien lee:

- Empieza con el nombre que ya conoce —el endpoint, el ajuste, el elemento de menú— no con el módulo que lo contiene.
- Di lo que es cierto ahora. «Las exportaciones corren en segundo plano» le gana a «Se cambiaron las exportaciones para correr en segundo plano».
- Nombra las cosas exactamente como aparecen en el producto: `api_key`, no «el ajuste de la clave de API».
- Dale a cada línea disruptiva una acción y un plazo. «Pasa a `/v2/exports` antes de la 3.0» es una nota. «Endpoint obsoleto» es un encogimiento de hombros.
- Una línea por cambio. Si necesita tres frases, enlaza a una página con espacio para ellas.

Las cifras reales pertenecen aquí —tamaños, timeouts, número de reintentos, fechas. «Se mejoró el rendimiento» es relleno, porque quien lee no puede comprobarlo y no puede actuar sobre ello.

### Instrucciones de migración como parte de la entrada

Una línea de Removed o Changed que describe el destino pero no el viaje ha movido el trabajo a quien lee, que tiene menos contexto que tú. El arreglo es pequeño: dos o tres líneas extra, indentadas bajo la entrada, diciendo qué cambiar y qué pasa si no se hace.

```markdown
### Removed
- `GET /v1/export`. Use `GET /v2/exports`. The response body is identical
  apart from `id`, now a string rather than an integer. Requests to the old
  path return 410 with a `Link` header pointing at the replacement.

  **Migrating:** change the path, and stop parsing `id` as an integer.
  The official clients do both for you from 2.2 onwards, so upgrading the
  client first is the shorter route.

### Deprecated
- `apiKey` in `config.yaml`, in favour of `api_key`. Both are read in all
  1.x releases; the old name logs a warning at startup. It is removed in
  2.0, not before 1 March 2027.
```

Tres cosas hacen que eso funcione. Nombra el modo de fallo, para que quien lee lo pueda reconocer en sus propios logs. Da una fecha en vez de solo una versión, porque «antes de la 2.0» no se puede planificar cuando nadie sabe cuándo llega la 2.0. Y ofrece primero el camino más barato, que es lo que de verdad quiere alguien con una tarde libre.

### Avisos de obsolescencia que sobreviven a que los ignoren

Una obsolescencia es un mensaje enviado a alguien ocupado, así que asume que se va a pasar por alto. La versión que funciona llega tres veces: en las notas de versión cuando empieza, en el propio software como un warning que nombra el reemplazo, y en las notas de versión otra vez cuando la eliminación se lanza. Repite la entrada en Deprecated en cada release intermedio. Alguien que actualiza de la 1.1 a la 1.9 de un salto lee una entrada, y tiene que ser la que sigue en pie.

Dos modos de fallo merece evitarse. Un warning sin reemplazo nombrado —«este ajuste está obsoleto»— manda a quien lee a buscar, y va a encontrar un post de foro en vez de tu documentación. Y una eliminación que llega antes de lo anunciado destruye el valor de cada futura obsolescencia que escribas, porque las fechas dejan de ser información.

## Cómo llevar un proceso de notas de versión que se mantenga funcionando

1. **Nombra a alguien responsable por release.** Una rotación está bien y una responsabilidad compartida no lo está, porque un changelog sin dueño lo escribe quien se acuerda último, la noche del release, a partir de `git log`.
2. **Escribe la entrada en la pull request que hace el cambio**, ya sea como línea bajo `Unreleased` o como archivo de changeset, para que la describa quien sabe por qué y la revise quien revisa el cambio.
3. **Escribe qué cuenta como cambio disruptivo para tu proyecto, y dónde termina la superficie pública.** Sin eso, cada release repite la misma discusión y la respuesta varía según quien esté más cansado.
4. **Haz visible la omisión en la revisión.** Una comprobación que hace fallar una pull request que toca comportamiento público sin ninguna línea de changelog cuesta una tarde de construir y elimina para siempre la conversación de refuerzo.
5. **Dale a cada línea de Removed y Deprecated una acción y una fecha.** Las dos mitades tienen peso: la acción le dice a quien lee qué cambiar, la fecha le dice para cuándo, y solo el par junto es algo que un equipo puede meter en un sprint.
6. **Mantén el archivo en el repositorio, en Markdown, y deriva todo lo demás de él** —una sola fuente que se compara con diff y se revisa, [de la misma forma en que debería vivir ahí el resto de la documentación](/blog/documentation-that-lives-in-the-repo), con la versión del sitio web, el correo y la página de release como renderizados en vez de copias.
7. **Que alguien fuera del equipo lea la sección superior antes de que salga.** Soporte es el lector ideal: si no puede decir qué cambió, tampoco van a poder los clientes a los que atienden, y te vas a enterar por los tickets.

## De CHANGELOG.md a una página que se puede enviar

El archivo del repositorio sirve a quien lee el repositorio. Soporte, ventas y clientes necesitan un enlace, y ahí es donde suelen atascarse las notas de versión.

Soltar `CHANGELOG.md` en TransformPipe te da un solo archivo `.html` autónomo —estilos incluidos, sin scripts, sin peticiones de red— para adjuntar a un correo o publicar como una página de solo lectura. Esa propiedad vale la pena entenderla antes de enviar nada: [un solo archivo que no le pide nada a la red](/blog/self-contained-html-explained) se abre igual en un portátil sin conexión que en el tuyo, y va a seguir abriéndose dentro de cinco años. Revocar ese enlace más adelante detiene uno que ya enviaste, algo que [compartir un documento Markdown como enlace](/blog/share-a-markdown-document-as-a-link) cubre por completo. Si el release también sale con una nota de portada y una guía de actualización, soltar los tres a la vez [los encadena en un solo documento](/blog/merging-many-markdown-files) en orden.

Para un release que corta CI, lo mismo se ejecuta sin supervisión:

```bash
node cli/tp.mjs push CHANGELOG.md --name "Release 1.4.0" --share link
```

La GitHub Action cubre la mitad de las pull requests, publicando el Markdown que cambió una pull request y comentando los enlaces de vuelta — mira [publicar Markdown desde GitHub Actions](/blog/publish-markdown-from-github-actions). Un generador que abre una pull request de release combina bien con esto: las notas se revisan como texto mientras el diff sigue abierto, y la página publicada viene del archivo que se aprobó en vez de una copia que alguien pegó.

Antes de cualquiera de esas cosas, una comprobación corta sobre la sección superior:

- [ ] Cada línea de Removed y Changed le dice a quien lee qué hacer.
- [ ] Ninguna línea nombra un archivo, un módulo o un número de ticket que quien lee no pueda ver.
- [ ] La versión y la fecha coinciden con la etiqueta.
- [ ] Los cambios disruptivos y los parches de seguridad están marcados como tales, no al mismo nivel que el resto.
- [ ] Alguien fuera del equipo lo leyó y pudo decir qué cambió.

Abre tu changelog y lee su sección más reciente como lo haría un cliente. Corta las líneas que no pasan las tres pruebas, añade la acción que falta a cada cambio disruptivo, escribe las dos frases que ningún generador puede escribir, y luego convierte y envía el enlace — [convertir ese Markdown en un archivo HTML autónomo](/) tarda aproximadamente lo mismo que leer este párrafo, gratis, en el navegador, sin subir nada cuando no has iniciado sesión.

## Preguntas frecuentes

### ¿Cuál es la diferencia entre un changelog y unas notas de versión?

Un changelog es el archivo acumulativo, con la versión más nueva primero, que registra cada release. Las notas de versión son lo que corresponde a una sola versión, escritas para un público concreto y a menudo con un resumen y orientación de migración que el archivo no lleva. En la práctica el changelog es la fuente y las notas de versión son un renderizado de una sección de él.

### ¿Tengo que usar Keep a Changelog?

No, pero sus seis categorías son mejor punto de partida que cualquier cosa que inventes bajo presión de tiempo, y quien las haya visto en otro sitio ya sabe dónde mirar. La especificación es corta y tiene licencia MIT (comprobado en keepachangelog.com, el 9 de septiembre de 2026). Lo que vale la pena conservar de todas formas es agrupar por consecuencia, un encabezado `Unreleased`, y fechas en ISO.

### ¿Debería generar mi changelog a partir de mensajes de commit?

Genera la lista, escribe el resumen. Herramientas como release-please, git-cliff y semantic-release van a clasificar conventional commits en secciones y a calcular la versión, lo que elimina la mitad tediosa del trabajo. No pueden decir por qué existe el release, qué entradas son urgentes, ni quién se lo puede saltar, y esas son las líneas que quien lee recuerda.

### ¿Qué cuenta como cambio disruptivo?

El versionado semántico define MAJOR como un cambio incompatible de la API y exige que declares tu API pública con precisión (comprobado en semver.org, el 9 de septiembre de 2026), así que la respuesta depende de lo que prometiste. Quitar o renombrar cualquier cosa invocable, cambiar el tipo de un campo, endurecer una validación y dejar de soportar un runtime son disruptivos casi en todos los sitios. Escribe tu propia lista antes de la discusión, no durante ella.

### ¿Dónde debería vivir el changelog, en el repositorio o en la web?

En el repositorio, como `CHANGELOG.md`, porque ahí es donde se compara con diff y se revisa junto al cambio que lo causó. Publica desde ahí a donde estén los lectores —un sitio web, una página de release, un archivo enviado por correo— en vez de mantener una segunda copia, que se va a desviar dentro de dos releases.

### ¿Cuánto debería durar una entrada?

Una línea para la mayoría de los cambios, más dos o tres líneas indentadas para cualquier cosa que necesite migración. Si una entrada necesita un párrafo, necesita una página: enlaza a esa página desde la entrada y mantén la lista fácil de hojear, porque el trabajo de la lista es ayudar a alguien a decidir si seguir leyendo.

### ¿Los servicios internos necesitan notas de versión?

Sí, y son más baratas de escribir, porque sabes exactamente quiénes son tus lectores y cómo llaman a las cosas. Los equipos que consumen tu servicio necesitan las mismas tres respuestas —qué se rompió, qué cambió, qué hacer al respecto— y un mensaje en un canal que se pierde en el scroll no es un changelog.
