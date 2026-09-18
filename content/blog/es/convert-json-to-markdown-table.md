---
title: "JSON a tabla Markdown: qué se convierte con limpieza y qué no"
description: Convertir JSON en una tabla Markdown: la forma que funciona sin trampa, qué hacer con el anidado, las claves que faltan y JSON Lines, y cuándo ganan las secciones
date: 2026-09-02
tag: Conversión
keywords: json a tabla markdown, convertir json a tabla markdown, array json a tabla markdown, json anidado a tabla markdown, json lines a tabla markdown, jq aplanar json, json a tabla online
---

### Resumen rápido

Una tabla Markdown es honesta con exactamente una forma de JSON: un array de objetos cuyos valores son todos escalares, con las mismas claves en cada registro. Dale eso y cualquier conversor hará lo correcto. Dale cualquier otra cosa — un objeto anidado, un array dentro de un campo, registros con claves distintas — y la herramienta tiene que elegir entre convertir el JSON en texto dentro de una celda, hacer explotar el número de columnas, o descartar datos, y no te va a decir cuál de las tres eligió. Aplana a propósito antes de convertir, normalmente con `jq` o `mlr`, o acepta que el renderizado honesto son secciones y no una tabla.

Tienes un archivo JSON y quieres una tabla. El instinto es acertado: una tabla es la forma legible más densa para registros, y una tabla Markdown sobrevive a que la pegues en una pull request, un ticket, una página de wiki y un correo de una forma en que un bloque de código con JSON no lo hace. Cualquiera puede escanear una tabla. Nadie escanea cuatrocientas líneas de JSON con sangría.

El problema es que el modelo de datos de JSON y el modelo de datos de una tabla no tienen la misma forma, y solo a veces coinciden. Una tabla es un rectángulo: columnas fijas, una fila por registro, un valor por celda. JSON es un árbol, de cualquier profundidad, sin ninguna obligación de que los objetos hermanos coincidan en nada. Cada vez que el árbol no es ya un rectángulo, convertirlo en uno descarta algo — y qué se descarta es una decisión que tu conversor toma en silencio, en los dos segundos entre que sueltas el archivo y lees la salida.

Así que la pregunta útil no es «qué herramienta convierte JSON a una tabla Markdown». Casi todas lo hacen, y [la comparativa entre ellas es otra pieza aparte](/blog/best-json-to-markdown-converters). La pregunta útil es qué forma tiene tu archivo, qué le hace una tabla a esa forma, y qué deberías hacerle al archivo primero. Eso es lo que sigue, caso por caso, con los comandos.

## Por qué una tabla Markdown es una promesa sobre los datos

Cuando le entregas una tabla a alguien, estás afirmando tres cosas sin decirlas en voz alta. Que cada fila es el mismo tipo de cosa. Que cada columna significa lo mismo en cada fila. Y que cada celda guarda un valor.

JSON no garantiza ninguna de las tres. Un array puede llevar una cadena, un objeto y otro array uno junto a otro. Dos objetos del mismo array pueden no compartir ninguna clave. Un solo campo puede guardar un objeto con doce claves debajo. Cuando algo de eso es cierto y de todos modos renderizas una tabla, la tabla sigue siendo una tabla — se alinea, tiene una fila de encabezado, parece terminada — y ahora está haciendo afirmaciones que los datos no respaldan. Eso es peor que una salida obviamente rota, porque nadie revisa una tabla que se renderiza bien.

Aquí está la forma del fallo en un ejemplo. Toma un registro como este:

```json
{
  "id": 4102,
  "customer": { "name": "Ada Okonjo", "email": "ada@example.com" },
  "items": ["SKU-11", "SKU-40"],
  "discount": null,
  "note": "call before delivery | after 4pm"
}
```

Cada forma ingenua de tabular ese registro está mal de una manera distinta. Pon `customer` en una celda y la celda contiene `{"name":"Ada Okonjo","email":"ada@example.com"}`, que es JSON disfrazado de prosa. Apláñalo y ganas dos columnas, `customer.name` y `customer.email`, que es correcto y empieza a hacer subir el número de columnas. Pon `items` en una celda y has unido una lista con comas, lo que está bien hasta que un elemento contiene una coma. Deja `discount` en blanco y el lector no puede distinguir «sin descuento» de «campo ausente». Y `note` contiene una barra vertical, que en una tabla Markdown termina la celda — así que esa fila ahora tiene una columna más que el encabezado, y el renderizador o descarta el excedente o desplaza todo lo que viene después.

Un registro. Cinco formas distintas de que una tabla sea silenciosamente falsa. Multiplícalo por el número de registros y tienes un documento que parece autorizado y no lo es.

## Referencia rápida: qué forma de JSON se convierte en qué Markdown

Esta es la chuleta. Busca la forma de nivel superior de tu archivo en la primera columna y el renderizado que no miente en la cuarta.

| Forma de JSON | Se parece a | ¿Tabula con limpieza? | Renderizado honesto | Haz esto primero |
| --- | --- | --- | --- | --- |
| Array de objetos planos, mismas claves | `[{"id":1,"name":"a"},{"id":2,"name":"b"}]` | Sí | Tabla: las claves como columnas, una fila por objeto | Nada |
| Array de objetos planos, claves distintas | `[{"id":1},{"id":2,"tier":"pro"}]` | Sí, con huecos | Tabla con la unión de todas las claves, huecos marcados | Reunir las claves de cada registro, no solo del primero |
| Array de objetos con un objeto anidado | `[{"id":1,"user":{"name":"a"}}]` | No | Tabla sobre columnas aplanadas `user.name` | Aplanar con `jq`, `mlr flatten`, o `json_normalize` |
| Array de objetos con un campo array | `[{"id":1,"tags":["x","y"]}]` | No | Tabla más una celda unida, o una fila por etiqueta | Decidir: unir en una celda, o explotar en filas |
| Array de valores simples | `["admin","billing"]` | No | Lista con viñetas | Nada — no lo tabules |
| Array de arrays | `[["a",1],["b",2]]` | Sí, sin encabezado | Tabla con encabezados inventados o de la primera fila | Decidir si la fila uno es dato o encabezado |
| Array de cosas distintas | `[1,"two",{"three":3}]` | No | Una sección numerada para cada uno | Separar por tipo, o renderizar como secciones |
| Objeto plano único | `{"name":"a","tier":"pro"}` | Solo como clave/valor | Tabla de dos columnas, o etiquetas en negrita | Nada, pero considerar una lista de definiciones en su lugar |
| Objeto único muy anidado | un archivo de configuración, un sobre de API | No | Encabezados por nivel, bloque de código a partir del nivel tres | Encontrar el array de dentro y tabular eso |
| Objeto de objetos, indexado por id | `{"u1":{...},"u2":{...}}` | Sí, tras un paso | Tabla con la clave como su propia primera columna | `to_entries` para convertir las claves en un campo |
| JSON Lines | un valor JSON por línea | Sí, si se lee como líneas | Tabla, una vez que el archivo se lee correctamente | Decirle a la herramienta que es de líneas delimitadas |
| Número, cadena o booleano en el nivel superior | `42` | No | Una frase | Nada que convertir |

Dos cosas que notar. Solo tres filas de esa tabla dicen «sí» sin matices, y las dos formas más comunes en el mundo real — objetos anidados y campos array — no están entre ellas. Y la última columna es donde está el trabajo: la diferencia entre una tabla Markdown buena y una mala es casi siempre algo que le hiciste al JSON antes de convertir, no el conversor que elegiste.

## La forma con la que una tabla es honesta

Un array de objetos, cada valor un escalar, las mismas claves en cada registro. Es la forma que devuelve un endpoint de API paginado, la forma en que se convierte un CSV cuando alguien lo pasa a JSON, y la forma que produce un `SELECT` sin joins.

```json
[
  { "sku": "SKU-11", "name": "Wide flange", "price": 12.5, "stock": 40 },
  { "sku": "SKU-40", "name": "Narrow flange", "price": 9.0, "stock": 0 },
  { "sku": "SKU-72", "name": "Bracket", "price": 3.25, "stock": 118 }
]
```

Eso se convierte en esto, y cualquier herramienta coincide:

```markdown
| sku | name | price | stock |
| --- | --- | --- | --- |
| SKU-11 | Wide flange | 12.5 | 40 |
| SKU-40 | Narrow flange | 9 | 0 |
| SKU-72 | Bracket | 3.25 | 118 |
```

Fíjate en que `9.0` salió como `9`. Los números de JSON no tienen ninguna noción de cifras significativas, así que un serializador que lee el archivo en un tipo numérico y lo vuelve a escribir te da la representación más corta. Si son precios en un documento que alguien va a leer, eso es una molestia cosmética; si es una cadena de versión o un código de producto que resultó ser numérico, el cero inicial o final se ha perdido para siempre. Un campo que deba conservar su forma impresa exacta tiene que ser una cadena de texto en el JSON, y no hay nada que el conversor pueda hacer al respecto a posteriori.

Aquí están las formas de hacer esta conversión, con el comando exacto:

| Ruta | Comando o paso | Necesita |
| --- | --- | --- |
| Navegador | Soltar el archivo `.json` en la página de un conversor y leer la tabla | Un navegador |
| Miller | `mlr --ijson --omd cat data.json` | Tener `mlr` instalado |
| jtbl | `cat data.json \| jtbl -m` | Python, `pip install jtbl` |
| pandas | `pd.read_json("data.json").to_markdown(index=False)` | pandas y tabulate |
| jq, a mano | construir el encabezado y las filas tú mismo con `@tsv` y `sed` | `jq` y paciencia |
| Hoja de cálculo | JSON a CSV, abrir, copiar, pegar en un editor consciente de Markdown | Una hoja de cálculo |

**¿Para quién es?** Para cualquiera con una exportación de un panel de administración, un endpoint de listado, o el resultado de una consulta. Si tu archivo tiene esta forma, deja de leer el resto de esta página y elige la fila de arriba que exija menos instalaciones. No hay ninguna decisión interesante que tomar.

**Qué revisar de todos modos:** las últimas tres filas, no las primeras tres. La paginación hace que los registros interesantes suelan estar al final, y un conversor que lee el primer objeto para su encabezado habrá descartado cualquier campo que solo aparece más adelante.

## Las formas incómodas, caso por caso

Todo lo que sigue es una forma donde la tabla tiene que renunciar a algo. Para cada una hay un renderizado defendible, uno que no lo es, y un comando que te lleva de uno al otro.

### Un objeto anidado dentro de un campo

```json
[
  { "id": 1, "user": { "name": "Ada", "city": "Leeds" }, "total": 42.0 },
  { "id": 2, "user": { "name": "Ben", "city": "Hull" }, "total": 18.5 }
]
```

Hay exactamente tres cosas que un conversor puede hacer con `user`, y conviene saber cuál hace el tuyo.

| Enfoque | Resultado | Coste |
| --- | --- | --- |
| Convertir el objeto en texto dentro de la celda | `{"name":"Ada","city":"Leeds"}` en una celda | Ilegible, y una `"` o una `\|` dentro rompe la fila |
| Aplanar a columnas con punto | `user.name`, `user.city` | El número de columnas crece con cada clave anidada |
| Descartar el campo | Tabla solo con `id` y `total` | Pérdida silenciosa de datos, y sin ningún aviso |

Aplanar es la opción correcta por defecto, y la razón es aritmética. Un registro con tres objetos anidados de cuatro claves cada uno se convierte en una tabla de quince columnas, legible en una pantalla ancha e ilegible en un comentario de pull request. Así que aplana, y luego selecciona: decide cuáles de las columnas aplanadas quieres de verdad, y descarta el resto a propósito en vez de dejar que la herramienta las descarte por accidente.

```bash
mlr --ijson --omd flatten data.json
```

El verbo `flatten` de Miller convierte `user.name` en un campo con ese nombre, y `--omd` escribe una tabla Markdown. Para elegir columnas después, añade un `cut`:

```bash
mlr --ijson --omd flatten then cut -o -f id,user.name,total data.json
```

**¿Para quién es?** Para respuestas de API, que casi siempre envuelven los campos interesantes en un sobre o adjuntan un registro relacionado. Es la forma real más común, y aquella donde más importa el valor por defecto de un conversor.

### Un array dentro de un campo

```json
[
  { "id": 1, "tags": ["urgent", "billing"] },
  { "id": 2, "tags": [] }
]
```

Un array dentro de un campo es una relación de uno a muchos, y una tabla es un rectángulo. Algo tiene que ceder.

| Enfoque | Resultado | Coste |
| --- | --- | --- |
| Unir en una sola celda | `urgent, billing` | Un valor que contenga el separador se vuelve ambiguo |
| Una columna por posición | `tags.0`, `tags.1`, `tags.2` | El número de columnas lo fija el array más largo; casi todo vacío |
| Una fila por elemento | `id` repetido, un `tag` cada vez | El número de filas se multiplica; `id` ya no es único |
| Solo contar | `tags` se convierte en `2` | Pierde los valores, conserva la forma |

Unir es lo que hace la mayoría de los conversores y suele ser correcto para leer, siempre que el separador sea uno que tus valores no puedan contener. `; ` es más seguro que `, `. Explotar en una fila por elemento es correcto si la tabla se va a ordenar o filtrar por etiqueta, y es lo que quieres si el siguiente paso es una hoja de cálculo en vez de un documento. Las columnas posicionales casi nunca son correctas: convierten la posición de un elemento en un encabezado de columna, y la posición dentro de un array de JSON no lleva ningún significado a menos que alguien lo haya prometido.

Para unir, en jq:

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json
```

Para explotar, una fila por etiqueta:

```bash
jq '[.[] | . as $row | .tags[] | { id: $row.id, tag: . }]' data.json
```

Ese segundo filtro pierde por completo el registro con el array vacío, porque `.tags[]` sobre `[]` no produce nada. Si un registro sin etiquetas todavía necesita una fila, conviene conservarlo explícitamente:

```bash
jq '[.[] | . as $row | (if (.tags | length) == 0 then [null] else .tags end)[] | { id: $row.id, tag: . }]' data.json
```

Esa es la forma de la mayoría del trabajo de aplanado: tres líneas de jq para conservar un caso que la versión de una línea descarta.

**¿Para quién es?** Para cualquier cosa con etiquetas, roles, permisos, categorías o líneas de pedido. Si estás convirtiendo una exportación de pedidos, las líneas de pedido son un array dentro de un campo y tienes esta decisión que tomar, lo notes o no.

### Registros con claves distintas

```json
[
  { "id": 1, "email": "a@example.com" },
  { "id": 2, "phone": "+44 20 7000 0000" },
  { "id": 3, "email": "c@example.com", "phone": "+44 20 7000 0001" }
]
```

Una tabla necesita un encabezado. Estos registros tienen tres conjuntos de claves distintos entre ellos, así que el encabezado tiene que ser la unión — `id`, `email`, `phone` — con huecos donde un registro no lleve un campo.

El fallo aquí es concreto y frecuente: un conversor que construye su encabezado a partir solo del primer objeto. Eso produce una tabla de dos columnas, y el teléfono del registro 2 no está en el documento en absoluto. Sin error, sin aviso, sin ningún hueco en la tabla que notar. Es el valor por defecto más dañino de toda esta área, porque la salida parece completa.

Compruébalo en un solo comando. Pídele a jq la unión de claves y cuenta las columnas de tu salida:

```bash
jq -r '[.[] | keys[]] | unique | join(",")' data.json
```

Si esa lista es más larga que la fila de encabezado de tu tabla, tu conversor leyó el primer registro y se detuvo. O cambia de herramienta o fuerza tú mismo la forma, dándole a cada registro cada clave:

```bash
jq --argjson cols '["id","email","phone"]' \
   '[.[] | . as $r | reduce $cols[] as $c ({}; .[$c] = ($r[$c] // null))]' data.json
```

Fíjate en que `//` en ese filtro es el operador alternativo de jq, no un comentario: sustituye el lado derecho cuando el izquierdo es `null` o `false`. Eso es un riesgo por sí mismo — un campo cuyo valor real es `false` se sustituirá por `null`. Si tus datos tienen booleanos, usa en su lugar una comprobación explícita con `has`.

| Enfoque | Resultado | Coste |
| --- | --- | --- |
| Unión de todas las claves | Cada campo presente, huecos donde falte | Tabla ancha, dispersa |
| Claves del primer registro | Estrecha, ordenada, columnas ausentes | Pérdida silenciosa de cada campo posterior |
| Claves presentes en cada registro | Solo los campos comunes | Pierde las diferencias, que a menudo son el punto |
| Agrupar por conjunto de claves, una tabla cada uno | Varias tablas honestas | El lector tiene que reconciliarlas |

**¿Para quién es?** Para exportaciones de cualquier cosa con campos opcionales — un CRM, un producto de formularios, un flujo de eventos donde la carga varía según el tipo de evento. Si los registros vinieron de rutas de código distintas, asume que los conjuntos de claves difieren hasta que lo hayas comprobado.

### Un array de valores simples

```json
["admin", "billing", "read-only"]
```

Esto es una lista. Renderizada como tabla se convierte en una sola columna con un encabezado inventado, más marcado que contenido y menos legible que el propio JSON. Renderizada como lista con viñetas está terminada:

```markdown
- admin
- billing
- read-only
```

El único caso para una tabla es cuando los valores son pares de algo, y entonces ya no son valores simples. Si la lista es larga y ordenada, una lista numerada lleva el orden que una lista con viñetas descarta — [la diferencia entre una lista ordenada y una sin ordenar también es una afirmación sobre los datos](/blog/markdown-line-breaks-and-lists).

**¿Para quién es?** Para enumeraciones, conjuntos de permisos, listas blancas. Casi nunca vale la pena un conversor: un buscar y reemplazar la convierte en una lista en menos tiempo del que tarda en abrirse una herramienta.

### Un array de arrays

```json
[
  ["sku", "name", "price"],
  ["SKU-11", "Wide flange", 12.5],
  ["SKU-40", "Narrow flange", 9.0]
]
```

Esto es un CSV que ha pasado por un serializador de JSON, y tabula perfectamente — con una ambigüedad que nada del archivo resuelve. ¿Es la primera fila un encabezado, o es un dato que resulta parecerse a uno? JSON no tiene manera de decirlo. Un conversor tiene que adivinar, y las dos adivinanzas producen documentos distintos: uno con `sku | name | price` como encabezado, otro con `Column 1 | Column 2 | Column 3` como encabezado y `sku` como un valor en la primera fila.

Mira el archivo y decide, y luego dile a la herramienta lo que decidiste. Si no acepta que se lo digas, añade tú mismo el encabezado. Como esta forma es en realidad datos tabulares disfrazados de JSON, [la ruta del CSV suele ser más corta](/blog/best-csv-to-markdown-converters): convierte el array de arrays a CSV, y usa una herramienta de CSV a Markdown que tenga una bandera explícita de encabezado.

**¿Para quién es?** Para resultados de BigQuery y similares, exportaciones de hoja de cálculo a través de una API de JSON, cualquier cosa donde un campo `values` guarde filas.

### Un array de cosas distintas

```json
[42, "pending", { "id": 7 }, [1, 2]]
```

Un array heterogéneo no es un conjunto de registros y ninguna tabla lo describe. El renderizado honesto es una sección numerada por elemento, cada uno renderizado según su propio tipo — un número como una frase, un objeto como una pequeña tabla clave/valor, un array anidado como una lista.

Si un archivo te da esto en el nivel superior, suele ser un registro mixto o un fixture hecho a mano, y el primer movimiento correcto es filtrar por el tipo que te importa:

```bash
jq '[.[] | select(type == "object")]' data.json
```

Ahora tienes un array de objetos y se aplica uno de los casos anteriores.

**¿Para quién es?** Casi nadie a propósito. Ocurre en fixtures de pruebas, en archivos editados a mano, y en flujos de eventos donde el productor cambió de forma entre versiones.

### Un solo objeto que no es una lista en absoluto

Un archivo de configuración, un sobre de API, un registro obtenido por id. No hay array del que sacar filas, así que una tabla solo puede ser un listado de clave/valor de dos columnas:

```markdown
| Field | Value |
| --- | --- |
| name | Wide flange |
| price | 12.5 |
```

Eso es legible para un puñado de campos escalares e inútil pasado más o menos una docena, y se colapsa por completo en cuanto un valor está anidado. Para un solo registro, las etiquetas en negrita con los valores al lado se leen mejor que el mobiliario de una tabla, y el anidado se convierte en encabezados. Si el objeto es un sobre — `{"meta": {...}, "data": [...]}` — la tabla que en realidad quieres está sobre `.data`, y el primer paso es decirlo:

```bash
jq '.data' response.json
```

**¿Para quién es?** Para cualquiera que haya obtenido una sola cosa en lugar de una lista. Busca un array interior antes de aceptar una tabla clave/valor; nueve de cada diez veces la forma interesante está un nivel más abajo.

## Aplanar primero: jq, y los archivos que no son un solo valor JSON

Dos problemas se cruzan delante de todo lo anterior. El archivo puede no ser un solo valor JSON, y la forma puede no ser todavía un rectángulo. Los dos se arreglan antes de que cualquier conversor vea los datos, y los dos se arreglan con el mismo puñado de comandos.

**El archivo es JSON Lines.** Un valor JSON por línea, terminado en salto de línea, sin ningún array que lo envuelva. Cada línea es válida; el archivo no lo es, porque una secuencia desnuda de valores no es un documento JSON. `JSON.parse` y `json.loads` fallan los dos en la línea 2, y el mensaje de error dice «token inesperado» en vez de «esto es JSON Lines», así que la gente concluye que el archivo está corrupto. No lo está. Es la salida normal de una tubería de logs, `docker logs`, un consumidor de cola de mensajes, y la mayoría de los endpoints de exportación masiva.

El arreglo es una sola bandera, y es una bandera distinta en cada herramienta:

| Herramienta | Leer JSON Lines | Escribir JSON Lines |
| --- | --- | --- |
| jq | por defecto: lee una secuencia de valores | `jq -c` — compacto, un valor por línea |
| jq, como array | `jq -s` o `jq --slurp` | `jq -c '.[]'` |
| Miller | `mlr --ijsonl` | `mlr --ojsonl` |
| pandas | `pd.read_json(path, lines=True)` | `df.to_json(path, orient="records", lines=True)` |
| jtbl | lee la entrada delimitada por líneas tal como llega | no aplica |
| Python estándar | `json.loads` por línea en un bucle | `json.dumps` por línea |

Así que el primer movimiento canónico sobre un archivo `.jsonl` es convertirlo en un array:

```bash
jq -s '.' events.jsonl > events.json
```

y el último movimiento canónico, si la siguiente herramienta quiere líneas, es volver a desmontar el array con `jq -c '.[]'`. Vale la pena saber: `jq -s` lee el archivo entero en memoria. En un log de varios gigabytes esta es la herramienta equivocada, y Miller transmite en su lugar — aunque una tabla con un millón de filas no es un documento que nadie vaya a leer, así que la respuesta real para un archivo de ese tamaño es filtrar primero.

**La forma necesita aplanarse.** La función `flatten` de jq aplana *arrays* anidados, no objetos, lo que sorprende a quien la busca solo por el nombre. Aplanar objetos en claves con punto se hace con rutas:

```bash
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]' data.json
```

Eso se lee así: para cada registro, encuentra cada ruta que termina en un escalar, convierte la ruta en una cadena con puntos, empareja esa cadena con el valor en esa ruta, y reconstruye el registro a partir de esos pares. `leaf_paths` es `paths(scalars)`; `getpath` obtiene un valor por ruta; `from_entries` convierte pares clave/valor de vuelta en un objeto. La salida es un array de objetos planos, que es la única forma que tabula con honestidad, y se la puedes entregar a cualquier conversor de la chuleta.

Dos advertencias sobre ese filtro. Los índices de array pasan a formar parte de la clave, así que `tags` con dos elementos produce `tags.0` y `tags.1` — el problema de las columnas posicionales de antes, entrando por la puerta de atrás. Y un objeto vacío o un array vacío no tienen ninguna ruta hoja, así que esos campos desaparecen del registro aplanado por completo. Si algo de eso importa, maneja los arrays por separado antes de aplanar:

```bash
jq '[.[] | .tags = (.tags | join("; "))]' data.json | \
jq '[.[] | [leaf_paths as $p | { key: ($p | join(".")), value: getpath($p) }] | from_entries]'
```

**Los registros están indexados por id en vez de listados.** Una forma habitual es un objeto cuyas claves son identificadores:

```json
{ "u1": { "name": "Ada" }, "u2": { "name": "Ben" } }
```

Aquí no hay ningún array, pero hay uno escondido. `to_entries` produce `[{"key":"u1","value":{...}}, ...]`, y un paso más promueve la clave a un campo del registro:

```bash
jq '[to_entries[] | { id: .key } + .value]' users.json
```

Ahora es un array de objetos planos con `id` como su primera columna, y el identificador que hacía doble trabajo como clave es un valor como cualquier otro.

**En Python, `json_normalize` hace casi todo esto en una sola llamada.** `pd.json_normalize(records, sep=".")` aplana objetos anidados en columnas con punto; `max_level` lo detiene en una profundidad; `record_path` y `meta` manejan el caso de la explosión, tomando un array anidado como origen de las filas y llevando consigo los campos del padre. Luego `to_markdown(index=False)` escribe la tabla, para lo que hace falta el paquete `tabulate` instalado junto a pandas. Los dos son gratis y de código abierto, pandas bajo BSD de 3 cláusulas y tabulate bajo MIT.

**¿Para quién es esta sección?** Para cualquiera que convierta la misma forma más de una vez. Un filtro de jq en un script de shell es un paso de conversión que se puede leer, revisar y arreglar. Una secuencia de clics no.

## Dónde miente la tabla, y qué cuesta

Supón que la forma es correcta y el aplanado está hecho. Todavía queda un conjunto de formas en que una tabla Markdown tergiversa el JSON del que vino, y ninguna produce un error.

**Una barra vertical en un valor divide la celda.** En GitHub Flavored Markdown, `|` delimita celdas en cualquier parte de una fila de tabla, incluso dentro de lo que querías como texto. `call before 4pm | or leave with neighbour` se convierte en dos celdas, la fila gana una columna, y el renderizador descarta el sobrante o desalinea el resto. El escape es una barra invertida — `\|` — y aplicarlo es trabajo del conversor. Pruébalo: pon una barra vertical en un valor, convierte, y mira. Esta es una instancia de un problema más amplio que conviene entender por completo, porque [las tablas se rompen al cruzar entre formatos más que cualquier otra cosa en Markdown](/blog/markdown-tables-that-survive-conversion).

**Un salto de línea en un valor no se puede expresar en absoluto.** Una fila de tabla Markdown es una línea. Una cadena de JSON puede contener `\n`, y a menudo lo hace — un campo de descripción, un mensaje de log, una dirección. No hay Markdown para un salto de línea dentro de una celda; la única ruta es un `<br>` literal, que es HTML crudo dentro de tu Markdown, y que cualquier renderizador que desinfecte va a eliminar. Los conversores emiten variablemente `<br>`, sustituyen el salto de línea por un espacio, o emiten el salto crudo y rompen la tabla. Las tres son defendibles y solo una es lo que quieres, así que averigua cuál hace la tuya.

**Las celdas vacías confunden cuatro hechos distintos.** `null`, una cadena vacía, una clave ausente y `false` se convierten los cuatro en una celda vacía en la mayoría de conversores. En una tabla de pedidos, «sin descuento» y «el campo de descuento no está presente en este registro» son afirmaciones distintas, y un lector no puede recuperar cuál de las dos a partir de un hueco. Escribir un *nulo* en cursiva para null, una raya para lo ausente y dejar las cadenas vacías genuinamente vacías cuesta tres líneas en un conversor y evita que el lector tenga que adivinar. Comprueba qué hace el tuyo con un registro que construyas tú mismo.

**Los valores largos destruyen la maquetación sin romperla.** Un blob en base64, una traza de pila, una columna con un UUID por fila: una tabla Markdown no tiene anchos de columna, así que un valor largo hace que su columna sea tan ancha como él mismo y aprieta a todas las demás en una tira. La tabla es válida e ilegible. El arreglo no está en el conversor — está en descartar la columna, o truncarla a propósito con una marca, antes de convertir. `jq 'map(.token |= .[0:12] + "…")'` es más feo que la alternativa de fingir que el problema es de presentación.

**Los tipos desaparecen, y el documento no lo dice.** Markdown no tiene tipos. Una vez convertido, `"12.50"` y `12.5` son los dos el texto `12.5`, `true` es la palabra true, y `2026-09-02T00:00:00Z` es una cadena que se parece a una fecha para una persona y a nada en particular para una máquina. Está bien para un documento y descalifica cualquier cosa que venga después. Si el receptor va a calcular con los números, envía el JSON o un CSV y deja que ellos lo analicen; la tabla Markdown es para leer.

**El orden de las filas es el que tenía el archivo.** Los arrays de JSON están ordenados y el orden tiene significado, así que un conversor tiene que conservarlo — pero nada lo ordena por ti, y una tabla que nadie ordenó es una tabla en el orden de inserción, que rara vez es el orden que quiere un lector. Ordena antes de convertir: `jq 'sort_by(.total) | reverse'` no cuesta nada y hace que la tabla responda a una pregunta.

**El orden de las columnas es un accidente.** Los objetos de JSON no tienen un orden de claves definido en la especificación, aunque toda implementación práctica conserva el orden en que lo leyó. Así que tus columnas salen en el orden que le dio la gana al serializador del otro extremo, lo que significa que el identificador podría ser la columna seis. Pon las columnas en el orden que necesita un lector con una selección explícita — `mlr cut -o -f id,name,total` conserva el orden que listaste, y la construcción de objetos de jq hace lo mismo.

El coste de todo esto, sumado, no es que la tabla esté mal. Es que la tabla parece bien. Un error de análisis de JSON te detiene; una fila desalineada por una barra vertical sin escapar se publica, se lee, se cita en una decisión, y se encuentra seis semanas después.

## Cuándo una tabla es el renderizado equivocado

A veces la respuesta honesta es que los datos no son tabulares y ninguna cantidad de aplanado lo va a arreglar. Tres señales, y qué hacer en su lugar.

**Las columnas superan en número a las filas.** Una única respuesta de API aplanada a sesenta claves con punto y un solo registro no es una tabla; es un registro, y un registro se lee mejor como valores etiquetados que como un rectángulo de sesenta columnas que nadie puede desplazar. Renderiza los campos escalares como etiquetas en negrita con valores al lado, y dale a cada sección anidada su propio encabezado.

**Cada fila necesita un párrafo.** Si un campo es una descripción, el cuerpo de un comentario, un diff o un mensaje de log, y el lector tiene que leerlo de verdad, una celda de tabla es el contenedor equivocado. El renderizado que funciona es una sección por registro: un encabezado con el identificador, los campos cortos como una lista compacta, y el campo largo como su propio párrafo o bloque delimitado. Es varias veces más largo que una tabla y es la versión que alguien puede leer.

**La estructura es la información.** En un archivo de configuración, un árbol de permisos o un grafo de dependencias, el anidado es lo que estás intentando comunicar. Aplanarlo a claves con punto convierte la estructura en prefijos de texto y le pide al lector que reconstruya el árbol en su cabeza. Encabezados para los niveles, listas con sangría para las hojas, y un bloque delimitado con `json` para cualquier cosa a partir de unos tres niveles — lo bastante profundo para ver la forma, lo bastante superficial para que los encabezados todavía signifiquen algo. Un bloque delimitado con la cadena de información `json` también obtiene resaltado de sintaxis en la mayoría de renderizadores, lo cual hace un trabajo real por la legibilidad; [qué es una cadena de información y qué hacen con ella los renderizadores](/blog/code-blocks-in-markdown) merece saberse antes de confiar en ello.

Ese renderizado mixto — tablas donde los datos son rectangulares, listas donde son una secuencia, encabezados donde son un árbol, bloques de código donde son más profundos de lo que un documento debería llegar — es lo que un conversor de JSON a Markdown está de verdad eligiendo cuando convierte. Es la razón por la que [la conversión de JSON a Markdown de TransformPipe](/json-to-markdown) elige un renderizado por forma en vez de forzar uno solo, en el navegador, sin subir nada cuando no has iniciado sesión.

| Señal en los datos | ¿Tabla? | Renderizado mejor |
| --- | --- | --- |
| Muchos registros, pocos campos escalares | Sí | Tabla |
| Un registro, muchos campos | No | Etiquetas en negrita, encabezados para las partes anidadas |
| Un campo que lleva prosa | No | Sección por registro, la prosa como párrafo |
| Anidado profundo que importa | No | Encabezados por nivel, bloque delimitado a partir del tercero |
| Una lista de valores simples | No | Lista con viñetas o numerada |
| Registros de dos o tres campos, docenas de ellos | Sí | Tabla, ordenada |

## Cómo elegir el renderizado

1. **Lee las primeras diez líneas del archivo antes de abrir ninguna herramienta.** La forma de nivel superior decide todo lo que viene después, y tarda diez segundos: `head -c 400 data.json` te dice si tienes un array de registros o un sobre anidado, y un sobre anidado significa que tu tabla está sobre algún campo de dentro y no sobre el archivo entero.
2. **Pregúntate si el archivo es un solo valor JSON o uno por línea.** Equivocarte aquí te da como mínimo un error de análisis y como mucho solo el primer registro. `head -n 3` y un vistazo a si cada línea es un objeto completo lo resuelve, y el arreglo es una bandera por herramienta.
3. **Aplana a propósito, y luego selecciona columnas a propósito.** El aplanado automático produce cada columna que los datos puedan dar, que para registros de API reales son más columnas de las que aguanta un documento. Elige las columnas y su orden explícitamente, o el lector se queda con la opinión del serializador en vez de la tuya.
4. **Construye el registro incómodo y conviértelo antes de fiarte de la herramienta.** Un registro con un null, una clave ausente, un objeto anidado, un campo array, una barra vertical en una cadena y un salto de línea en una cadena. Cada fallo de esta página aparece en esa única conversión, y encontrarlos ahí cuesta dos minutos en vez de una retractación.
5. **Decide si la salida es para leer o para procesar.** Una tabla Markdown es un documento: los tipos desaparecen y nada puede analizarla de vuelta con seguridad. Si el siguiente paso es una hoja de cálculo o un script, convierte a CSV y sáltate el viaje de ida y vuelta.
6. **Si las columnas superan a las filas, deja de hacer una tabla.** Esa proporción es la señal más clara de que los datos son un registro y no una lista, y un registro se renderiza como valores etiquetados. Forzar un rectángulo en ese punto te cuesta lo único para lo que servía la conversión, que es que alguien pueda leerlo.

## Conclusión

Un array de objetos planos con claves consistentes se convierte en una tabla Markdown sin decisiones y sin pérdidas, y si ese es tu archivo, la elección de herramienta apenas importa. Todo lo demás es una decisión que alguien tiene que tomar: aplanar el anidado o renderizarlo como secciones, unir el campo array o explotarlo en filas, tomar la unión de las claves o aceptar los huecos, y escapar las barras verticales antes de que un valor con una dentro desplace una fila que nadie vuelve a leer. Toma esas decisiones tú mismo con `jq` o `mlr` mientras los datos siguen siendo JSON, o usa un conversor cuyas reglas estén escritas para que sepas qué hizo. Lo único que no hay que hacer es entregarle un árbol a un rectángulo y suponer que la salida es cierta porque se alinea.

## Preguntas frecuentes

### ¿Cómo convierto un array de JSON a una tabla Markdown?

Si cada objeto del array tiene las mismas claves y todos los valores son escalares, cualquier conversor lo maneja: suelta el archivo en un conversor de navegador, ejecuta `mlr --ijson --omd cat data.json`, pásalo por `jtbl -m`, o llama a `to_markdown(index=False)` sobre un DataFrame de pandas. Si los objetos contienen objetos o arrays anidados, aplánalos primero, porque de lo contrario algunas celdas contendrán JSON convertido en texto.

### ¿Qué le pasa al JSON anidado en una tabla Markdown?

Una de tres cosas, según la herramienta: el valor anidado se convierte en texto dentro de una sola celda, se aplana en columnas con punto como `user.name`, o se descarta. Aplanar es la única de las tres que mantiene los datos legibles, y hace crecer el número de columnas, así que aplana y luego selecciona las columnas que quieres en vez de aceptarlas todas.

### ¿Cómo manejo registros con claves distintas?

Construye el encabezado a partir de la unión de claves de cada registro, no del primer registro. Comprueba qué hizo tu conversor con `jq -r '[.[] | keys[]] | unique | join(",")'` y compara esa lista con la fila de encabezado de tu salida — si la salida es más corta, se han descartado en silencio campos de registros posteriores.

### ¿Puedo hacer una tabla Markdown a partir de JSON Lines?

Sí, en cuanto la herramienta sabe que el archivo está delimitado por líneas. Miller lo lee con `--ijsonl`, pandas con `lines=True`, y jq trata una secuencia de valores como su entrada normal, así que `jq -s '.' events.jsonl` convierte el archivo en un array que cualquier otra herramienta aceptará. Un conversor sin ninguna pista fallará en la línea 2 con un error de sintaxis, que se lee como corrupción del archivo y no lo es.

### ¿Qué rompe una tabla Markdown generada a partir de JSON?

Los caracteres de barra vertical y los saltos de línea dentro de valores de cadena. Una barra vertical termina una celda allí donde aparezca, así que una sin escapar añade una columna a esa fila, y un salto de línea no se puede representar en absoluto en una fila de tabla. Un buen conversor escapa las barras verticales como `\|` y sustituye los saltos de línea por `<br>` o un espacio; prueba los dos casos sobre un valor que controles antes de fiarte de la salida.

### ¿Debería convertir el JSON a CSV en vez de a Markdown?

Si el siguiente paso es una hoja de cálculo, un script o cualquier cosa que vaya a analizar los datos, sí — el CSV también pierde tipos pero al menos está diseñado para leerse de vuelta, mientras que una tabla Markdown es un documento sin ningún analizador fiable. Convierte a Markdown cuando una persona lo va a leer en un ticket, una pull request o una página.

### ¿Por qué mi número se ve distinto después de convertir?

Porque pasó por un tipo numérico de JSON en el camino. `9.0` se convierte en `9`, `007` se convierte en `7` si era un número en vez de una cadena, y un flotante que no se puede representar con exactitud en binario llega con las cifras que JSON almacenó. Cualquier campo cuya forma impresa importe — un código de producto, una versión, un precio con decimales fijos — tiene que ser una cadena en los datos de origen; ningún conversor puede devolver un cero que nunca recibió.
