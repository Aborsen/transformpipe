---
title: "Los mejores conversores de JSON a Markdown en 2026: comparados y puestos a prueba"
description: Comparamos las formas de pasar JSON a Markdown legible —jq, jtbl, Miller, pandas y el navegador— según qué forma de dato admite cada una y qué decide por ti
date: 2026-09-08
tag: Conversión
keywords: convertidor json a markdown, convertir json a tabla markdown, json a markdown online, jq json a markdown, json lines a markdown, json anidado a markdown, json a markdown en python, json a markdown por linea de comandos
---

JSON no tiene encabezados. Tampoco tiene párrafos, ni negrita, ni tablas, ni listas en el sentido que Markdown le da a la palabra. Tiene objetos, arreglos, cadenas, números, booleanos y null, y ese es todo su vocabulario. Markdown tiene encabezados, párrafos, listas, tablas y bloques de código. Ninguna de las dos especificaciones dice cuál de lo primero se convierte en cuál de lo segundo, así que cada conversor de JSON a Markdown se ha inventado una respuesta, y las respuestas no coinciden. Esa es la diferencia real entre las herramientas de esta página — no la velocidad, ni la licencia, sino qué decidió cada una que debía parecer tu dato.

### Resumen rápido

Elige según la forma de tu archivo, no según la lista de funciones de la herramienta. Un **arreglo de objetos planos** —la forma que tienen la mayoría de las respuestas de API y las exportaciones— es la única forma sobre la que una tabla Markdown dice la verdad, y casi todo lo de aquí la convierte en tabla sin problema. Los **objetos anidados** son donde las herramientas se separan: unas aplanan las claves en columnas con puntos, otras convierten cada nivel en un encabezado hasta quedarse sin niveles, y otras se rinden e imprimen JSON tal cual. **JSON Lines** —un registro por línea, que es la forma habitual de una exportación de registros— no es JSON válido, así que media lista de estas herramientas rechaza el archivo sin más. Un conversor de navegador toma esas decisiones de forma por ti y te dice cuáles son; jq, Miller y jtbl te dejan tomarlas tú mismo desde la terminal; pandas es la respuesta dentro de un script de Python.

## Por qué decir «convierte JSON» casi no dice nada

Convertir Markdown a HTML es una traducción entre dos formatos que, en líneas generales, están de acuerdo en qué es un documento. Convertir JSON a Markdown no es una traducción en absoluto. Es una interpretación, y la herramienta está adivinando la intención. `{"name": "Ada", "roles": ["admin", "billing"]}` podría razonablemente ser un encabezado llamado Name con un párrafo debajo, una etiqueta en negrita junto a un valor, una tabla de dos filas, una lista con viñetas o una lista de definiciones. Una persona razonable elegiría de forma distinta según si ese objeto es uno entre miles o el archivo entero.

Así que lo primero que hay que averiguar de cualquier herramienta de esta lista es qué formas reconoce y qué hace con cada una. Solo hay cuatro preguntas que importan. ¿Qué pasa con un arreglo de objetos? ¿Qué pasa con un arreglo de valores sueltos? ¿Qué pasa con el anidamiento, y hasta qué profundidad lo sigue el conversor antes de rendirse? ¿Y qué pasa con un archivo que no es un único valor JSON?

Las respuestas casi nunca están en la página principal de la herramienta, y son el producto entero. Un conversor que convierte cada objeto en una tabla de clave-valor de dos columnas te va a devolver una exportación de novecientos registros como novecientas tablitas. Un conversor que solo tabula el arreglo del nivel superior va a convertir en cadena, en silencio, cualquier objeto anidado, así que una columna de tu tabla, en teoría legible, va a contener `{"city":"Leeds","postcode":"LS1 1AA"}` en una tipografía proporcional donde ni siquiera se alinea bien. Las dos herramientas «convierten JSON a Markdown». Ningún resultado de los dos es lo que pediste.

Lo segundo que hay que averiguar es a dónde va el archivo. Las exportaciones de JSON son, con mucha frecuencia, justo lo que no pegarías en el cuadro de texto de un desconocido: fichas de usuario, historiales de pedidos, respuestas de API con tokens dentro, un volcado de base de datos que alguien te mandó para que lo miraras. Un conversor que corre en tu navegador o en tu propia máquina evita que esa pregunta llegue a plantearse. Uno alojado no la evita, y la respuesta honesta a ese cambio depende por completo del archivo.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad principal | Precio |
| --- | --- | --- | --- |
| TransformPipe | Leer un archivo JSON como si fuera un documento | Tablas, secciones y listas elegidas según la forma, en el navegador, sin subir nada | Gratis |
| jq | Decidir tú mismo la forma | Filtra y reestructura el JSON; el Markdown lo montas tú | Gratis, MIT |
| jtbl | Una tabla en la terminal, JSON Lines incluido | Lee de la entrada estándar, `-m` imprime una tabla Markdown | Gratis, MIT |
| Miller (`mlr`) | Archivos grandes y cambios de formato | Lee JSON y JSON Lines, `--omd` escribe Markdown | Gratis, BSD de dos cláusulas |
| json2md | Construir un documento, no convertir uno | Un formato de instrucciones que genera encabezados, listas, tablas, código | Gratis, MIT |
| pandas + tabulate | Dentro de un script de Python | `read_json`, `json_normalize`, `to_markdown` | Gratis, BSD de tres cláusulas |
| Extensiones de VS Code | El archivo ya está abierto | Conversión local en el editor; la calidad varía por extensión | Gratis |
| TableConvert | Pegar una tabla en una pestaña del navegador | Arreglo JSON a tabla Markdown con vista previa en vivo | Gratis (comprobado en tableconvert.com, el 8 de septiembre de 2026) |
| Un script propio | Una forma que es tuya y no va a cambiar | Exactamente el mapeo que quieres, y ningún otro | Gratis |
| Un asistente | Algo puntual que vas a leer tú mismo | Entiende la intención; también descarta filas sin avisar | Varía |
| Pandoc | Este no es su trabajo | Su lector `json` es el árbol interno de pandoc, no tu dato | Gratis, GPL |

## Los mejores conversores de JSON a Markdown en 2026

### TransformPipe — mejor para leer un archivo JSON como documento

Convierte un archivo `.json` a Markdown en tu navegador, y elige una manera de mostrarlo según la forma del dato en lugar de aplicar una sola regla a todo. No hace falta instalar nada ni tener cuenta, y sin haber iniciado sesión el archivo no se envía a ningún sitio: se lee, se analiza y se muestra en tu propia máquina.

| A favor | En contra |
| --- | --- |
| Las reglas de forma son fijas y están explicadas, así que el resultado es predecible | Son las reglas de la herramienta, no las tuyas: no hay lenguaje de plantillas |
| Lee JSON Lines igual que JSON, sin que se lo pidas | Un documento cada vez, no una carpeta entera |
| No se sube nada sin haber iniciado sesión | El navegador hace el trabajo, así que un archivo muy grande depende de la máquina |
| También convierte Markdown a HTML, y HTML, Word y CSV de vuelta a Markdown | |

**Precio:** gratis. Una cuenta añade historial, compartir y una API, también gratis.

**Detalles técnicos**

- Un arreglo de objetos cuyos valores son todos escalares se convierte en tabla, con las claves como columnas —recogidas de todas las filas en el orden en que aparecen por primera vez, así que un campo que solo aparece en el registro cuarenta sigue teniendo su columna
- Un arreglo de valores sueltos se convierte en lista con viñetas; un arreglo de cosas distintas entre sí se convierte en una sección numerada por cada una
- Un objeto pone primero sus claves escalares como etiquetas en negrita, y luego le da su propio encabezado a cada clave anidada, para que los datos superficiales se lean antes de que empiecen los profundos
- Pasados tres niveles de profundidad, un valor se imprime como bloque de código `json` en lugar de encabezado, porque un encabezado en el nivel siete ya no es un encabezado
- `null` se escribe como *null* en cursiva en vez de omitirse, y un arreglo vacío lo dice, porque ausente y vacío son dos hechos distintos sobre el dato
- Las claves se convierten en título para mostrarlas: `created_at` y `createdAt` salen los dos como «Created at»
- La misma conversión está disponible por API REST, por una CLI sin dependencias, por una GitHub Action y por un servidor MCP

**¿Para quién es?** Para quien lo siguiente que va a hacer sea «leer esto» o «mandarle esto a alguien». Una respuesta de API, una exportación de un panel de administración, un registro que alguien adjuntó a un ticket — los casos en los que quieres el dato legible en un minuto y no quieres escribir un script ni pensar en la forma.

### jq — mejor para decidir tú mismo la forma

jq es un procesador de JSON por línea de comandos escrito en C portable, sin dependencias en tiempo de ejecución. No tiene salida en Markdown y, aun así, es la herramienta a la que más gente termina recurriendo, porque la parte difícil de este trabajo no es imprimir barras verticales — es seleccionar los registros correctos y aplanarlos en filas primero.

| A favor | En contra |
| --- | --- |
| Reestructura cualquier JSON en cualquier otro JSON, que es el problema real | Sin salida Markdown: las filas las montas tú |
| Instalado en todas partes, sin runtime, un solo binario | Su propio lenguaje, con una curva de aprendizaje real |
| Se combina con cualquier otra herramienta por tubería | Maneja JSON Lines de forma natural, un valor a la vez |

**Precio:** gratis, licencia MIT.

**Detalles técnicos**

- Un lenguaje de filtros sobre JSON: selección, mapeo, agrupación, orden y aritmética
- `@tsv` y `@csv` producen salida delimitada, que luego puedes pasar a un paso de CSV a Markdown en lugar de montar la tabla a mano
- La interpolación de cadenas te deja escribir Markdown directamente —`"| \(.name) | \(.email) |"` por registro— con el encabezado y la línea separadora escritos por ti
- `--slurp` junta un flujo de valores en un solo arreglo, que es como haces que un archivo JSON Lines se comporte como uno normal
- `-r` imprime cadenas sin comillas en vez de JSON entrecomillado, que es la opción que la gente olvida y luego se pregunta por qué cada celda tiene comillas alrededor

**¿Para quién es?** Para quien ya sepa jq, y para quien su archivo necesite filtrarse antes de darle forma. Si la respuesta incluye «solo las peticiones fallidas, agrupadas por día», necesitas jq o algo parecido antes de que ningún conversor entre en juego. Ocupa el mismo lugar en una cadena de procesos que [un paso de Markdown a HTML en la línea de comandos](/blog/markdown-to-html-from-the-command-line): una etapa que le hace una sola cosa al texto.

### jtbl — mejor para una tabla en la terminal, JSON Lines incluido

jtbl es una pequeña herramienta de línea de comandos en Python que lee JSON de la entrada estándar y lo imprime como tabla. Su salida por defecto es una tabla de terminal, y `-m` convierte esa tabla en Markdown.

| A favor | En contra |
| --- | --- |
| Lee un arreglo JSON de objetos o JSON Lines, sin necesitar ninguna opción | Solo tablas: no tiene ninguna otra forma de mostrar el dato |
| `-m` para Markdown, `-c` para CSV, `-H` para HTML | Los valores anidados hay que aplanarlos antes de que los vea |
| Pensada para tuberías, así que jq va delante | Una instalación de Python, no siempre disponible en un servidor |

**Precio:** gratis, licencia MIT.

**Detalles técnicos**

- La entrada llega por tubería en JSON sobre stdin: o un arreglo JSON de objetos, o JSON Lines
- Los formatos de salida se elegien por opción: tabla de texto por defecto, Markdown, CSV, HTML o una tabla con bordes dibujados
- Pensada para ir al final de una tubería de `jq`, que es exactamente donde tiene sentido el reparto de trabajo — jq decide las filas, jtbl las imprime

**¿Para quién es?** Para quien trabaja en una terminal y quiere la tabla ya. Es el camino más corto y honesto de un registro en JSON Lines a una tabla Markdown que puedes pegar en un ticket.

### Miller (`mlr`) — mejor para archivos grandes y cambios de formato

Miller es un procesador de datos de línea de comandos escrito en Go, sin dependencias en tiempo de ejecución. Lee CSV, TSV, JSON y JSON Lines, y escribe Markdown, lo que lo convierte en la herramienta rara donde esta conversión es un formato de salida incluido de fábrica en lugar de algo que montas tú.

| A favor | En contra |
| --- | --- |
| Markdown es un formato de salida de primera clase (`--omd`) | Tiene su propio vocabulario de verbos y opciones que aprender |
| Lee JSON Lines directamente (`--ijsonl`), sin necesitar «tragárselo» entero | Está orientado a registros: el JSON muy anidado hay que aplanarlo antes |
| Trabaja en flujo, así que el tamaño del archivo no es un problema de memoria | Una instalación, y una terminal |
| Una sola herramienta para filtrar, ordenar, recortar e imprimir | No es interactivo: sin vista previa, sin deshacer |

**Precio:** gratis, licencia BSD de dos cláusulas.

**Detalles técnicos**

- Los formatos de entrada incluyen JSON, JSON Lines, CSV, TSV y datos indexados por posición; `--ijson` e `--ijsonl` indican cuál tienes
- `--omd` escribe salida Markdown; `--omd-aligned` rellena las columnas hasta un ancho uniforme, para que el archivo en bruto también se pueda leer
- Desde la versión 6.11.0, Miller admite Markdown también como formato de entrada, no solo de salida (comprobado en miller.readthedocs.io, el 8 de septiembre de 2026)
- Verbos como `cut`, `filter`, `sort` y `head` se ejecutan antes del escritor, así que puedes recortar una exportación grande a las columnas que merece la pena tabular en el mismo comando

**¿Para quién es?** Para quien tenga un archivo demasiado grande para abrir, una exportación en JSON Lines, o la costumbre de convertir entre CSV y JSON. Si vas a instalar una sola herramienta de línea de comandos para esto, instala esta.

### json2md — mejor para construir un documento, no convertir uno

json2md es una biblioteca de JavaScript que convierte una estructura JSON concreta en Markdown. La distinción importa más que cualquier otra cosa de esta página: no lee tu JSON. Lee una descripción en JSON de un documento Markdown, en su propia forma, y la imprime.

| A favor | En contra |
| --- | --- |
| Genera estructura de documento real: encabezados, párrafos, listas, tablas, código, enlaces | Tu dato tiene que transformarse primero a su forma de entrada |
| Una dependencia pequeña en un proyecto de Node | No convierte JSON arbitrario, a pesar del nombre |
| Se extiende con tus propios conversores para tipos de bloque nuevos | Solo JavaScript |

**Precio:** gratis, licencia MIT.

**Detalles técnicos**

- Se instala desde npm y se usa como función dentro de Node o de un empaquetado
- Sus tipos de bloque documentados van de `h1` a `h6`, párrafos, citas, imágenes, listas ordenadas y sin ordenar, bloques de código, tablas, enlaces y líneas horizontales
- La entrada es un arreglo de objetos de una sola clave —un encabezado, luego un párrafo, luego una tabla—, así que el mapeo de tu dato al documento es código que escribes tú, y la biblioteca se encarga del escape y la maquetación

**¿Para quién es?** Para desarrolladores que generan un documento Markdown a partir de datos en un servicio de Node: un informe nocturno, un registro de cambios, un resumen que se manda por correo a un equipo. Es la herramienta equivocada para mirar un archivo JSON que te acaban de mandar, y la correcta para producir un documento a partir de registros que ya entiendes.

### pandas más tabulate — mejor dentro de un script de Python

pandas lee JSON en un DataFrame y escribe Markdown a partir de uno. `read_json` se encarga del análisis, `json_normalize` aplana el anidamiento en columnas, y `to_markdown` imprime la tabla.

| A favor | En contra |
| --- | --- |
| Aplanar, filtrar, ordenar y tipar, todo en una sola biblioteca | Una dependencia pesada para una sola tabla |
| `json_normalize` aplana el anidamiento de forma predecible | Aplanar multiplica columnas deprisa |
| Ya instalado en casi cualquier trabajo con datos | Solo tablas: un DataFrame no es un documento |

**Precio:** gratis. pandas es BSD de tres cláusulas; `tabulate`, que exige `to_markdown`, es MIT.

**Detalles técnicos**

- `pandas.read_json` para un arreglo JSON de registros; `lines=True` para JSON Lines
- `pandas.json_normalize` aplana claves anidadas en columnas con puntos, así que un registro con un objeto `address` se convierte en columnas `address.city` y `address.postcode`
- `DataFrame.to_markdown()` exige el paquete `tabulate` y devuelve la tabla como cadena
- El índice viene incluido por defecto, que es por lo que la primera columna de tu tabla es una serie sin nombre de `0`, `1`, `2` hasta que pasas `index=False`
- `tablefmt` se pasa directamente a tabulate, donde `github` es la tabla al estilo GFM y `pipe` añade dos puntos de alineación

**¿Para quién es?** Para quien ya esté dentro de un script o un notebook de Python. Si el JSON necesita algún análisis real antes de convertirse en tabla, aquí es donde ibas a terminar de todos modos — el mismo razonamiento que hace que [Python sea un sitio sensato para el paso de Markdown a HTML](/blog/markdown-to-html-in-python) se aplica igual aquí.

### Extensiones de VS Code — mejor si el archivo ya está abierto

El Marketplace tiene extensiones que convierten una selección JSON en una tabla Markdown, y si el archivo ya está en tu editor, este es el camino más corto que hay. También es la opción donde tienes que fijarte en la extensión concreta y no en la categoría.

| A favor | En contra |
| --- | --- |
| Sin herramienta nueva, sin terminal, sin subir nada | La calidad y el mantenimiento varían muchísimo |
| Funciona sobre una selección, así que puedes convertir parte de un archivo | La mayoría solo maneja un arreglo plano y nada más |
| La conversión se hace localmente en el editor | Una extensión abandonada es un riesgo silencioso |

**Precio:** gratis.

**Detalles técnicos**

- Las extensiones corren en el proceso del editor, así que una extensión local convierte localmente — pero compruébalo, porque algunas llaman a un servicio alojado
- La mayoría de las implementaciones toman un arreglo de objetos y producen una tabla; el anidamiento, el trato a `null` y el escape de barras verticales son donde se diferencian
- El propio soporte de JSON de VS Code —formato, plegado, validación de esquema— es aparte y no produce Markdown

**¿Para quién es?** Para desarrolladores que convierten un fragmento al vuelo. Comprueba qué hace la extensión con un objeto anidado y con un valor que contenga una barra vertical antes de confiarle nada que vayas a mandar a otra persona.

### TableConvert — mejor para pegar una tabla en una pestaña del navegador

TableConvert es un conversor de tablas online con una página dedicada a JSON a Markdown: pegas un arreglo JSON, obtienes una tabla Markdown, y puedes editarla en una cuadrícula si quieres.

| A favor | En contra |
| --- | --- |
| Pegar y listo, con vista previa en vivo | Solo tablas, a partir de un arreglo de objetos |
| Su propia página declara que la conversión se hace localmente en el navegador | El anidamiento y JSON Lines no son su trabajo |
| Una cuadrícula editable entre la entrada y la salida | Es uno de muchos sitios parecidos, y varían en qué hacen con tu dato |

**Precio:** gratis, sin registro (comprobado en tableconvert.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- La entrada es un arreglo JSON pegado, un archivo subido o una tabla extraída de una página
- Los formatos de salida incluyen Markdown junto con los demás formatos de tabla que maneja el sitio
- La cuadrícula intermedia te deja renombrar una columna o borrar una fila antes de quedarte con el Markdown

**¿Para quién es?** Para quien tenga un arreglo plano en el portapapeles y un hueco con forma de tabla que rellenar. Para un archivo entero, o uno con estructura de verdad, un conversor que lea formas distintas de «arreglo de objetos» te ahorra el trabajo de reestructurarlo tú.

### Un script propio — mejor cuando la forma es tuya y no va a cambiar

Treinta líneas en el lenguaje que ya usas, que mapean tu JSON a tu Markdown. Cualquiera que haga esta conversión más de dos veces termina aquí, y para una forma interna estable es la respuesta correcta.

| A favor | En contra |
| --- | --- |
| Exactamente el mapeo que quieres, y nada más | Ahora los casos raros son tuyos |
| Sin dependencias, en casi cualquier lenguaje | Hay que reescribirlo cuando la forma cambia |
| Se ajusta a tu compilación, tu CI, tus nombres | Nadie más del equipo conoce las reglas |

**Precio:** gratis, y cuesta una tarde.

**Detalles técnicos**

- Cualquier lenguaje habitual analiza JSON desde su biblioteca estándar, así que el análisis no es el trabajo
- El trabajo son las cuatro decisiones: tabla, lista, sección, o retroceso a bloque de código — más el escape
- Escapa las barras verticales y las barras invertidas dentro de las celdas, y sustituye los saltos de línea dentro de una celda por `<br>`, porque una fila de tabla Markdown no puede contener un salto de línea real
- Decide qué aspecto tienen `null`, `""`, `0`, `false` y una clave ausente, y déjalo escrito, porque un lector no puede distinguirlos si todos parecen una celda vacía

**¿Para quién es?** Para equipos con una exportación que se repite y una opinión firme sobre cómo debería leerse. No para quien tiene un archivo hoy y ya está.

### Un asistente — mejor para algo puntual que vas a leer tú mismo

Pegar JSON en un asistente y pedirle una tabla Markdown funciona, entiende la intención mejor que cualquier regla fija, y es la opción menos fiable de esta lista para cualquier cosa que no vayas a comprobar.

| A favor | En contra |
| --- | --- |
| Interpreta lo que significa el dato, no solo su forma | Las filas desaparecen y nadie te avisa |
| Maneja registros desordenados e inconsistentes con soltura | Los valores se reordenan, se reformatean y se «arreglan» |
| Sin instalar nada, sin escribir código | Tu dato va a un servicio salvo que el modelo sea local |

**Precio:** varía según el servicio y el plan.

**Detalles técnicos**

- Úsalo mejor sobre datos que puedas revisar a simple vista: si no puedes contar las filas en la salida, no puedes verificarla
- Un conversor determinista y un asistente no siempre coinciden, y eso es útil: ejecuta los dos sobre el mismo archivo y la diferencia te muestra qué celdas «arregló» el asistente por su cuenta
- Un servidor MCP mete una conversión determinista dentro del asistente, que es la combinación que merece la pena tener: el modelo decide qué convertir, el conversor decide cómo sale
- El resultado sigue siendo Markdown, que todavía tiene que convertirse en algo que alguien pueda abrir — [llevar la salida de un asistente a una página que se pueda compartir](/blog/ai-output-to-a-shareable-page) es un paso aparte

**¿Para quién es?** Para quien tenga un caso raro y la paciencia de comprobarlo. No para quien vaya a mandarle el resultado a un cliente.

### Pandoc — la herramienta que no hace esto

Pandoc convierte entre unos cuarenta formatos de documento, y este no es uno de ellos. Su formato de entrada `json` es «la versión JSON del AST nativo» — el árbol de documento propio de pandoc, serializado como JSON, no tu dato. Dale una respuesta de API y obtendrás un error, no un documento.

**¿Para quién es?** Para nadie, en esta conversión. Pandoc es la respuesta correcta para [Markdown a HTML y los formatos alrededor](/blog/best-markdown-to-html-converters), y el sitio equivocado donde buscar para JSON.

## Lo que las tablas comparativas no cuentan

Todas las herramientas de arriba van a producir Markdown a partir de tu JSON. Lo que decide si el resultado se puede leer es un conjunto de decisiones que ninguna anuncia.

**El arreglo de objetos planos es la única forma sobre la que una tabla dice la verdad.** Una tabla tiene una fila por registro y una columna por campo, así que necesita registros con los mismos campos y valores que sean cosas sueltas. Así es como suele ser una respuesta de API, un CSV convertido a JSON y una exportación de base de datos, y por eso todas las herramientas de aquí lo manejan y tantas se quedan ahí. En el momento en que un valor es a su vez un objeto o un arreglo, la tabla tiene que mentir: o la celda contiene un fragmento de JSON convertido en cadena, o el número de columnas explota, o el dato anidado se descarta. No hay una cuarta opción. Una herramienta que aplana —pandas con `json_normalize`, la mayoría de las CLI con un paso explícito de aplanado— elige la explosión de columnas, y un registro con tres objetos anidados puede acabar en una tabla de treinta columnas que nadie puede leer. Una herramienta que se niega a tabular un registro con valores anidados elige secciones en su lugar, que es más largo y más legible.

**Los arreglos de valores sueltos son listas, y tratarlos como tablas es el error clásico.** `["admin", "billing", "read-only"]` es una lista con viñetas. Convertido en tabla se vuelve una tabla de una columna con un encabezado sin sentido, que es peor que el JSON en bruto. Convertido en una cadena unida por comas dentro de la celda de otra tabla, funciona bien hasta el momento en que uno de los valores contiene una coma.

**El anidamiento tiene que dejar de convertirse en encabezados en algún punto, y la herramienta elige dónde.** Markdown tiene seis niveles de encabezado. JSON tiene tantos como quiera. Un conversor que mapea profundidad a nivel de encabezado se queda sin niveles en seis y entonces, o fija todo lo más profundo en `######`, lo que aplana estructura real en aparentes hermanos, o sigue generando marcado más profundo que ningún visor muestra de forma distinta. La alternativa es parar antes e imprimir el subárbol que queda como bloque de código con cerca, lo que admite la derrota con honestidad: la estructura queda visible, con sangría, y claramente es un volcado de datos y no prosa. El conversor de arriba se detiene en tres niveles justo por eso. Sea lo que sea que haga tu herramienta, averígualo, porque un documento cuyos encabezados terminan en el nivel seis tiene un índice que no significa nada.

**Null, vacío, ausente y false son cuatro hechos distintos y una celda vacía.** Un conversor que omite `null` produce una celda indistinguible de una clave ausente, que a su vez es indistinguible de una cadena vacía. En una exportación de pedidos, «sin descuento aplicado» y «el campo de descuento no existe en este registro» son cosas distintas, y un lector que ve dos celdas en blanco no puede recuperar cuál es cuál. Este es el fallo que hace que una tabla convertida sea sutilmente incorrecta en vez de obviamente rota, y merece la pena comprobarlo en un archivo que ya conoces antes de confiar en uno que no.

**JSON Lines no es JSON válido, y es lo que suele ser una exportación de registros.** El formato JSON Lines es un valor JSON por línea, en UTF-8, terminado en salto de línea. Cada línea se analiza bien; el archivo entero no, porque una secuencia de valores sin un arreglo que los envuelva no es un documento JSON. Así que `JSON.parse` y `json.loads` fallan los dos con un archivo `.jsonl` perfectamente válido, y cualquier conversor que llame a uno de los dos sin una alternativa rechaza el archivo con un error de sintaxis que señala a la línea 2. Las herramientas se diferencian bastante aquí: Miller y jtbl leen JSON Lines de forma nativa, pandas necesita `lines=True`, jq quiere `--slurp` para convertirlo en arreglo, y un conversor de navegador que recurre al análisis línea por línea lee el archivo sin que se lo pidas. Si tu dato viene de una cadena de registros, de una cola de mensajes o de `docker logs`, esto es lo primero que hay que probar y lo más probable que te detenga.

**Las barras verticales, las barras invertidas y los saltos de línea dentro de un valor rompen la tabla que acabas de conseguir.** Una barra vertical termina una celda de tabla Markdown en cualquier sitio donde aparezca, así que un valor como `error | retrying` divide una celda en dos y desplaza el resto de la fila. Un salto de línea dentro de un valor no se puede expresar en una fila de tabla en absoluto — la única salida es `<br>`, que es HTML dentro de tu Markdown. Cualquier conversor que construya tablas uniendo cadenas sin escapar va a producir una tabla que se ve mal justo en las filas que tenían el dato interesante, que es un caso particular del problema general de [las tablas que sobreviven a una conversión](/blog/markdown-tables-that-survive-conversion).

**El orden de las claves es el único orden que tienes, y no significa nada.** Los objetos JSON no tienen un orden de claves definido en la especificación, aunque en la práctica cualquier implementación conserva el orden del archivo. Los conversores, por tanto, escriben las columnas en el orden en que ven las claves por primera vez, lo que quiere decir que el orden de columnas de tu tabla es un accidente de quien escribió el serializador. Peor aún: si registros posteriores traen un campo que el primer registro no tenía, un conversor que solo lee el primer objeto para el encabezado descarta esa columna en silencio para todas las filas. Recoger las claves de todos los registros es el comportamiento correcto, y no el universal.

**Los números, las fechas y los identificadores dejan de ser ellos mismos.** Markdown no tiene tipos. Un entero largo sigue siendo legible; un flotante como `0.30000000000000004` llega exactamente como lo guardó JSON; una marca de tiempo ISO se queda como marca de tiempo ISO salvo que la herramienta decida embellecerla. Un cero inicial en un código de producto sobrevive si era una cadena y desaparece si era un número. Nada de esto es culpa del conversor y todo termina en tu documento, así que una tabla convertida es una instantánea para leer, no un formato de intercambio de datos. Si alguien va a calcular sobre ello, mándale el JSON.

## Cómo elegir

1. **Mira tu archivo antes de mirar herramientas.** Ábrelo y contesta una pregunta: ¿es un arreglo de registros planos, o es un documento anidado? Si es lo primero, casi cualquier cosa de aquí funciona y puedes elegir por comodidad. Si es lo segundo, la mayoría de estas herramientas van a producir algo ilegible y necesitas una que renderice secciones en lugar de tablas.
2. **Prueba el caso JSON Lines si existe alguna posibilidad.** Un archivo `.json` de una aplicación suele ser un único valor; un archivo `.json` o `.jsonl` de un registro, una cola o una exportación masiva suele ser un valor por línea. Convertir con la suposición equivocada te da, en el mejor caso, un error de análisis, y en el peor, solo el primer registro.
3. **Decide si el resultado es para leer o para procesar.** Una tabla Markdown es un documento. Si el siguiente paso es una hoja de cálculo o un script, convierte a CSV en su lugar y evita el rodeo — vas a perder los tipos de todos modos, y al menos el CSV lo admite.
4. **Cuenta las instalaciones frente a las veces que vas a hacer esto.** Un archivo hoy no justifica un gestor de paquetes. Un informe nocturno no justifica una pestaña de navegador y una persona pendiente de ella. Equivocarse en esto es como un equipo acaba con un paso de conversión sin documentar que solo funciona en un portátil.
5. **Comprueba qué pasó con las filas raras, no con las tres primeras.** Busca un registro con un null, un objeto anidado, un valor con una barra vertical y un campo que las demás filas no tienen. Convierte ese registro y lee el resultado. Todos los fallos descritos en esta página aparecen en esa única prueba, y lleva dos minutos.

## Conclusión

No hay una forma correcta de convertir JSON a Markdown, lo que quiere decir que el mejor conversor de JSON a Markdown es el que toma decisiones que coinciden con el archivo que tienes delante. Cuando la forma que tienes es una lista de registros, [el camino de la tabla es el que conviene leer](/blog/convert-json-to-markdown-table). Para un arreglo de registros planos, elige por comodidad: una pestaña del navegador, una tubería de terminal, o tres líneas de pandas. Para un documento anidado que de verdad necesitas leer, elige una herramienta que renderice secciones y listas en lugar de forzarlo todo dentro de una tabla, y comprueba en qué punto deja de convertir profundidad en encabezados. Eso es lo que hace [la conversión de JSON a Markdown de TransformPipe](/json-to-markdown) en el navegador, gratis, con las reglas fijas y sin subir nada mientras no hayas iniciado sesión. Para cualquier cosa recurrente, Miller o una tubería de jq en un script te van a durar más que cualquier cosa que montes a mano.

## Preguntas frecuentes

### ¿Cuál es el mejor conversor gratuito de JSON a Markdown?

Para un archivo que quieres leer ahora, un conversor de navegador es la mejor opción gratuita: sin instalar nada, sin subir nada, y admite formas distintas de un arreglo plano. En la línea de comandos, Miller y jtbl son los dos gratuitos, de código abierto y escriben tablas Markdown directamente.

### ¿Cómo convierto JSON a una tabla Markdown?

Si tu JSON es un arreglo de objetos con valores escalares, cualquier herramienta de aquí lo hace: pégalo en un conversor de navegador, pásalo por `jtbl -m`, ejecuta `mlr --ijson --omd cat`, o llama a `to_markdown()` sobre un DataFrame de pandas. Si los objetos contienen objetos o arreglos anidados, aplánalos antes o acepta que la tabla va a llevar JSON convertido en cadena en algunas celdas.

### ¿Puedo convertir JSON anidado a Markdown?

Sí, pero no a una tabla. El JSON anidado se convierte de forma razonable en encabezados y secciones, con cada nivel de anidamiento pasando a ser un nivel de encabezado hasta que el conversor se queda sin niveles — seis es el límite que da Markdown, y la mayoría de las herramientas paran antes e imprimen lo que queda como bloque de código con cerca. Comprueba dónde traza esa línea tu conversor antes de convertir un archivo muy anidado.

### ¿Por qué falla la conversión de mi archivo JSON?

Casi siempre porque es JSON Lines y no JSON: un valor JSON válido por línea, que el archivo entero no es. Un analizador al que le das ese archivo falla en la segunda línea. O le dices a tu herramienta que es JSON delimitado por líneas —`lines=True` en pandas, `--ijsonl` en Miller, `--slurp` en jq— o usas un conversor que recurre por su cuenta al análisis línea por línea.

### ¿Convertir JSON a Markdown pierde datos?

Pierde tipos, y puede perder distinciones. Markdown no tiene noción de número, fecha ni null, así que todo se vuelve texto, y un conversor que muestra `null` como celda vacía lo ha hecho indistinguible de un campo ausente o de una cadena vacía. Trata el Markdown como algo para leer y guarda el JSON como el registro real.

### ¿Puede Pandoc convertir JSON a Markdown?

No, no tu JSON. El formato de entrada `json` de Pandoc es su propio AST de documento serializado como JSON, así que solo lee archivos que pandoc mismo produjo. Es la herramienta correcta para convertir entre formatos de documento y la equivocada para datos.

### ¿Debería usar jq o un conversor?

Normalmente, los dos. jq sirve para elegir y reestructurar los registros —filtrar, agrupar, aplanar, seleccionar columnas— y un conversor sirve para imprimirlos. Un filtro de jq que también monta Markdown a mano funciona y se vuelve inmantenible enseguida, así que deja las barras verticales y el escape a algo cuyo trabajo sea exactamente eso.
