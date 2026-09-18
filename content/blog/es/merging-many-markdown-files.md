---
title: Convertir una carpeta de archivos Markdown en un solo documento
description: "Fusionar una carpeta de Markdown en uno solo: orden, niveles de encabezado, enlaces entre archivos, rutas de imagen, anclas duplicadas y el índice, con scripts"
updated: 2026-09-09
date: 2026-07-16
tag: Conversión
keywords: fusionar archivos markdown, combinar archivos markdown, unir varios markdown en uno, varios markdown a un html, libro a partir de archivos markdown, índice de markdown, anclas de encabezado markdown, unir markdown con pandoc, generar índice markdown, mdbook summary.md
---

Un manual rara vez vive en un solo archivo. Es una carpeta —una introducción, seis capítulos, un apéndice— para que dos personas puedan editar partes distintas a la vez. Entonces alguien pide el conjunto entero como una sola página. Juntar los archivos está a un `cat` de distancia, y el resultado sale mal siempre de las mismas pocas maneras.

### Resumen rápido

`cat *.md > manual.md` desordena los archivos, te da un `<h1>` por capítulo, convierte el front matter de cada archivo en un encabezado suelto, y deja cada enlace que apuntaba a un archivo hermano señalando a la nada. Arréglalo en ese orden: decide dónde vive el orden (un manifiesto le gana a los prefijos numéricos), rebaja cada encabezado un nivel llevando la cuenta de los bloques de código, elimina el front matter al leer cada parte, y reescribe `03-despliegue.md#tls` como `#tls` antes de convertir nada. Pandoc hace las primeras tres cosas con `--shift-heading-level-by=1`, `--file-scope` y `--toc`. Pasadas unas pocas docenas de partes, deja de fusionar y usa una herramienta de libros.

Los fallos tienen siempre la misma forma: algo en cada archivo se escribió en relación con ese archivo, y después de la fusión ya no existe «ese archivo». Un nivel de encabezado era relativo a un documento que empezaba en `#`. Un enlace era relativo a un directorio. Una ruta de imagen era relativa a una carpeta dos niveles más abajo. Un id de ancla era único dentro de un capítulo y no entre diez.

Nada de esto avisa. Un documento fusionado se renderiza. Simplemente sale mal: el índice salta al capítulo equivocado, una imagen es un icono roto, y un enlace abre un diálogo de descarga para un archivo que ya no está. Cada uno de esos fallos lo descubre quien lee, no la compilación.

Lo que sigue es el trabajo completo: un orden que sobrevive a una inserción, un script de fusión legible y ejecutable, la reescritura de enlaces e imágenes, las colisiones de anclas, el índice, lo que Pandoc ya resuelve, lo que necesita la impresión, y el punto en el que fusionar es la herramienta equivocada y un libro es la correcta.

## Qué se rompe, y en qué orden

Trabaja en esta secuencia. El orden primero, porque cada arreglo posterior asume que sabes de dónde vino cada parte; los enlaces al final, porque necesitan los ids que el conversor termina generando.

| Qué se rompe | Qué se ve | Por qué | El arreglo |
| --- | --- | --- | --- |
| Orden | El capítulo 10 antes que el 2 | Un glob ordena cadenas de texto, no números | Prefijos con ceros a la izquierda, o un manifiesto |
| Niveles de encabezado | Diez elementos `<h1>`, ningún esquema | Cada parte se escribió para valer por sí sola | Rebajar cada encabezado un nivel |
| Comentarios de código | `# instala el agente` se vuelve un encabezado | Un `sed` a ciegas no distingue un bloque de código | Llevar el estado de los bloques al reescribir |
| Front matter | `title: Ejecución de tareas` llega como un `<h2>` | Nada busca una cabecera después del primer archivo | Eliminar el bloque al leer cada parte |
| Separadores | El título de un capítulo se vuelve un encabezado | `---` bajo una línea de texto es sintaxis setext | Separar con `***` |
| Enlaces entre archivos | Un enlace a un archivo que ya no está | `03-despliegue.md#tls` nombraba a un hermano | Reescribir a `#tls` |
| Enlaces a archivo completo | Un enlace sin fragmento a dónde apuntar | `[desplegando](03-despliegue.md)` no tiene ancla | Mapear cada nombre de archivo al id de su título |
| Rutas de imagen | Un icono de imagen rota | Las rutas relativas ahora se resuelven desde el archivo fusionado | Reajustar cada ruta, o incrustar las imágenes |
| Colisiones de anclas | Dos encabezados «Resumen», un solo id | Los ids salen del texto del encabezado | Prefijar por archivo de origen, o renombrar |
| Ids de notas al pie | Una nota al pie aterriza en el lugar equivocado | Cada parte empieza su numeración en `[^1]` | Analizar por archivo, o prefijar las etiquetas |
| Índice | Entradas que no llevan a ningún lado | La regla de slug adivinó distinto del renderizador | Generarlo a partir de la salida, no de la entrada |
| Saltos de página | Los capítulos siguen a mitad de página en el PDF | Markdown no tiene sintaxis de salto de página | Una regla CSS de fragmentación en cada costura |

El resto de este artículo es esa tabla, fila por fila, con el código.

## El orden, hecho como es debido

`cat *.md` te da lo que produzca el glob, y un glob ordena cadenas de texto, no números: `capitulo10.md` va antes que `capitulo2.md`, porque `1` va antes que `2` y la comparación se detiene ahí. Anidar las partes en carpetas no cambia nada. Hay tres sitios donde puede vivir el orden, y no son igual de buenos.

### Prefijos numéricos, y el problema de los ceros a la izquierda

Rellena el prefijo numérico con ceros y la ordenación se convierte en el orden de lectura:

```
handbook/
  00-introduction.md
  10-installing.md
  20-configuration.md
  30-running-jobs.md
  90-appendix-glossary.md
```

Saltos de diez dejan hueco para insertar una parte más adelante. Dos cifras dan cien huecos, que es más de lo que necesita un manual y menos de lo que tiene un conjunto de documentación entero; tres cifras se ven burocráticas y nunca hace falta renumerarlas.

El relleno tiene que ser uniforme. Mezclar `9-intro.md` con `10-instalacion.md` reproduce el mismo fallo a menor escala, porque el `1` sigue yendo antes que el `9`. Y volver a rellenar más adelante es renombrar todos los archivos, lo que invalida cada enlace entrante, cada marcador y el historial que `git log --follow` estaba siguiendo. Elige un ancho el primer día y mantenlo.

Vale la pena nombrar dos costes más. Los prefijos se filtran: si la misma carpeta también la publica un generador, `10-instalacion` aparece en la URL, y quitarlo ahí es otra regla en otro archivo de configuración. Y ordenar cadenas depende de la configuración regional — el mismo glob puede ordenar nombres de archivo con acentos o mayúsculas de forma distinta en dos máquinas, algo que nadie nota hasta que CI produce un documento que quien lo escribió no puede reproducir. `sort -V` de GNU coreutils es «una ordenación natural (de versión) de números dentro de texto» (comprobado en man7.org, el 9 de septiembre de 2026), lo que evita por completo la cuestión del relleno — pero no está en todos los sistemas donde correrá tu script, así que comprueba `sort --version` antes de que una compilación dependa de ello.

### Un archivo manifiesto

Si renombrar queda descartado porque otros documentos enlazan a estas rutas, o si el orden necesita diferir del alfabeto por cualquier motivo, guarda el orden en un archivo y lee ese en su lugar:

```bash
grep -vE '^[[:space:]]*(#|$)' order.txt | xargs cat > handbook.md
```

Una ruta por línea; las líneas vacías y los comentarios con `#` se descartan. Ese es todo el mecanismo, y es por lo que un manifiesto gana: el orden es algo que se puede leer, revisar en una pull request y comentar.

Muy a menudo el repositorio ya tiene uno, y añadir un segundo es como los dos terminan separándose:

- **mdBook** usa `SUMMARY.md`. «El archivo de resumen lo usa mdBook para saber qué capítulos incluir, en qué orden deben aparecer, cuál es su jerarquía y dónde están los archivos fuente. Sin este archivo, no hay libro.» (comprobado en rust-lang.github.io, el 9 de septiembre de 2026)
- **MkDocs** usa la clave `nav` en `mkdocs.yml`, que «se usa para determinar el formato y la disposición de la navegación global del sitio». Si se omite, «`nav` contendrá una lista anidada, ordenada alfanuméricamente, de todos los archivos Markdown encontrados dentro de `docs_dir`» — que es el mismo problema del glob, con un archivo de configuración delante. (comprobado en mkdocs.org, el 9 de septiembre de 2026)
- **Quarto** lista las partes de un libro bajo `book: chapters:` en `_quarto.yml`. (comprobado en quarto.org, el 9 de septiembre de 2026)

Cualquiera de esos ya es la fuente de verdad. Léelo en lugar de duplicarlo. `SUMMARY.md` es una lista anidada de enlaces Markdown, así que las rutas salen con una sola expresión:

```bash
grep -oE '\]\(([^)]+\.md)\)' SUMMARY.md | sed -E 's|^\]\((.*)\)$|\1|'
```

El orden de la salida es el orden del archivo, que es el orden del libro.

### El orden desde el front matter

La tercera opción mantiene el orden dentro de cada parte, como una clave numérica en su propia cabecera:

```yaml
---
title: Running jobs
order: 30
---
```

El orden viaja con el archivo: muévelo, renómbralo, y sigue sabiendo dónde pertenece. No hay que renumerar nada, y no hay un segundo archivo que olvidar. Es una ventaja real, y se paga tres veces.

Ahora necesitas un analizador de YAML para ordenar, porque un `grep` de `order:` se rompe la primera vez que alguien entrecomilla el valor o lo indenta bajo otra clave. El orden es invisible — nadie puede ver la secuencia de lectura sin ejecutar la herramienta. Y nada impide que dos partes declaren `order: 30`, momento en el que el empate lo rompe lo que sea que haga tu ordenación con claves iguales, que suele ser el orden de archivo y nunca queda escrito en ningún sitio. Lo que hace un conversor con esa cabecera en el momento de renderizar es una pregunta aparte, y [hay cuatro respuestas posibles](/blog/front-matter-and-what-converters-do-with-it), y solo quieres una de ellas.

### Cuál conviene preferir

| Dónde vive el orden | Coste | Falla cuando | Mejor para |
| --- | --- | --- | --- |
| Prefijos numéricos con ceros a la izquierda | Un renombrado para insertar o reordenar | El relleno es inconsistente, o la configuración regional difiere | Una carpeta que gestiona una sola persona |
| Un archivo manifiesto | Una línea que añadir por cada parte nueva | Alguien añade un archivo y se olvida de la línea | Cualquier cosa que se revise en pull request |
| Una clave en el front matter de cada archivo | Un analizador de YAML en el script de fusión | Dos partes declaran el mismo número | Archivos que se mueven entre carpetas |

Prefiere el manifiesto, y prefiere el que ya tenga el repositorio. Es la única opción donde el orden de lectura es un artefacto revisable y no una propiedad emergente, y la única donde «este capítulo falta en la compilación» aparece como una línea que falta en un diff en lugar de como un archivo que nadie tuvo en cuenta. El modo de fallo importa más que la comodidad: una línea olvidada en el manifiesto tira un capítulo en silencio, pero también lo hace una errata en un prefijo, y solo uno de los dos se ve en una revisión de código.

Usa prefijos también si quieres —hacen que la carpeta se lea bien en un listado de archivos— pero deja que el manifiesto decida. El orden por front matter merece la pena solo cuando las partes de verdad se mueven entre directorios, que es más raro de lo que suena.

## Los tres cambios, y un script que los hace

Cada parte necesita los mismos tres cambios al entrar: sus encabezados rebajados, su front matter eliminado, y una separación visible puesta delante. Aquí está cada uno, y luego el script que hace los tres en una sola pasada.

### Rebajar los encabezados

Cada parte se escribió para valer por sí sola, así que cada una empieza con un único título `#`. Encadena diez y el documento tiene diez elementos `<h1>` y ningún esquema.

Hay dos respuestas. Tratar cada `#` como un título de capítulo y no poner nada por encima, lo que funciona mientras el archivo sea solo una pila de capítulos. O rebajar cada encabezado un nivel y añadir un único título `#`. `sed 's/^#/##/'` te destroza el código al hacerlo: un comentario `# instala el agente` dentro de un bloque con fence también se rebaja. Hay que llevar la cuenta de los fences.

También hay un techo. CommonMark pone la secuencia de apertura de un encabezado ATX en «de 1 a 6 caracteres `#` sin escapar», y «más de seis caracteres `#` no es un encabezado» (comprobado en spec.commonmark.org, el 9 de septiembre de 2026) — un séptimo hash te da un párrafo que empieza con hashes. Así que una parte que ya use `######` para algo no tiene adónde ir, y el paso de rebajado tiene que dejarlos en paz en vez de convertirlos en texto sin querer. En la práctica, un documento que usa seis niveles de encabezado está diciendo que debería haber sido dos documentos.

### Separar las partes

Una separación visible le dice al lector que una parte terminó y otra empezó. `---` solo en una línea se convierte en un `<hr>`, pero justo debajo de una línea con texto es sintaxis setext, y convierte esa línea en un `<h2>`. Separa las partes con `***`: el mismo `<hr>`, nunca un subrayado de encabezado.

Deja una línea vacía a cada lado. Un separador pegado a la última línea de la parte anterior es el mismo accidente setext por otra vía.

### Eliminar el front matter

Los mismos guiones causan el último problema. Las partes escritas para un sitio estático empiezan con un bloque de front matter, y después del primer archivo nada busca uno: el `---` de apertura se vuelve una regla, las claves se vuelven un párrafo, y el `---` de cierre lo subraya — setext otra vez, así que `title: Ejecución de tareas` llega como un `<h2>` en mitad del documento. Ese es el resultado de renderizado, y es el que siempre obtienes en cuanto nada está buscando el bloque.

Elimínalo al leer cada parte, y solo en la parte superior del archivo, para que un separador `---` más abajo sobreviva:

```bash
awk 'NR == 1 && /^---$/ { fm = 1; next }
     fm && /^---$/       { fm = 0; next }
     !fm                 { print }' "$file"
```

Si los títulos de esas cabeceras merecen conservarse —y suelen merecerlo, porque son los nombres de los capítulos— sácalos antes de descartar el bloque y emite cada uno como un encabezado. Es la versión que hay que escribir si las partes no empiezan ya con su propio título `#`.

### El script, en shell

Este lee un manifiesto, elimina el front matter de cada parte, rebaja sus encabezados fuera de los bloques de código, y pone una regla entre las partes.

```bash
#!/bin/sh
# merge.sh — one document from a manifest of Markdown parts.
set -eu

manifest=${1:-order.txt}
out=${2:-handbook.md}
: > "$out"

grep -vE '^[[:space:]]*(#|$)' "$manifest" | while IFS= read -r part; do
  if [ -s "$out" ]; then printf '\n***\n\n' >> "$out"; fi

  awk '
    # A front matter block, but only at the very top of the file.
    NR == 1 && /^---[[:space:]]*$/ { fm = 1; next }
    fm && /^---[[:space:]]*$/      { fm = 0; next }
    fm                             { next }

    # Track fences, so nothing inside a code block is rewritten.
    /^[[:space:]]*(```|~~~)/ { fence = !fence; print; next }

    # Demote a real heading, unless it is already at the sixth level.
    !fence && /^#+[ \t]/ {
      hashes = $0
      sub(/[^#].*$/, "", hashes)
      if (length(hashes) < 6) { print "#" $0 } else { print }
      next
    }

    { print }
  ' "$part" >> "$out"

  printf '\n' >> "$out"
done
```

Una advertencia sincera: `fence` es un único indicador que cubre los dos tipos de fence, así que también cambia de estado en una línea de virgulillas dentro de un bloque delimitado con acentos graves. Es raro, y conviene saberlo antes de culpar al script por un capítulo cuyos encabezados salieron todos un nivel demasiado superficiales.

### Lo mismo en Node

La versión en shell está bien para una tubería fija. En el momento en que necesitas reescribir enlaces o reajustar imágenes necesitas saber de qué archivo vino cada línea justo cuando la estás reescribiendo, y eso es mucho más fácil en un programa de verdad:

```js
// merge.mjs — node merge.mjs order.txt handbook.md
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [manifest = 'order.txt', out = 'handbook.md'] = process.argv.slice(2);
const root = dirname(manifest);

const parts = readFileSync(manifest, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

// No `m` flag: `^` is the start of the string, so only a block at the very
// top of the file is removed.
const stripFrontMatter = (text) =>
  text.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*\r?\n?/, '');

const demote = (text) => {
  let fenced = false;

  return text.split(/\r?\n/).map((line) => {
    if (/^\s{0,3}(?:`{3,}|~{3,})/.test(line)) {
      fenced = !fenced;
      return line;
    }

    if (fenced) return line;

    const heading = line.match(/^(#{1,6})[ \t]/);
    return heading && heading[1].length < 6 ? `#${line}` : line;
  }).join('\n');
};

const merged = parts
  .map((part) => demote(stripFrontMatter(readFileSync(join(root, part), 'utf8'))).trim())
  .join('\n\n***\n\n');

writeFileSync(out, `${merged}\n`);
```

El equivalente en Python son los mismos cuarenta renglones con `re` y `pathlib`; no hay nada en él que necesite una librería. Sea cual sea el lenguaje, mantén las tres transformaciones como funciones separadas que reciben texto y devuelven texto, porque la reescritura de enlaces e imágenes de la siguiente sección se inserta entre ellas y vas a querer probar cada una por su cuenta.

Cuando la fusión se ejecuta en cada commit, [convertir Markdown desde una terminal](/blog/markdown-to-html-from-the-command-line) cubre el lado de CI, y [convertir una carpeta archivo por archivo](/blog/batch-convert-markdown-files) es la otra mitad del mismo problema — la que deja la salida en tantas páginas como entró.

## Enlaces entre archivos, y los que se te van a escapar

Esta es la parte que la mayoría de las guías se salta, y es la parte que quien lee nota primero, porque un enlace roto es un clic que no lleva a ningún lado, en vez de un párrafo que se ve un poco raro.

Dentro de la carpeta, `[reintentos](30-ejecucion-de-tareas.md#retries)` es correcto. Después de la fusión, el destino está en el mismo documento y el nombre de archivo tiene que desaparecer, o el enlace apunta a un archivo que ya no está al lado de quien lee:

```bash
sed -E 's|\]\([0-9A-Za-z._/-]+\.md#|](#|g' handbook.md > tmp && mv tmp handbook.md
```

Eso cubre la forma habitual. Hay cuatro más, y cada una merece decirse en voz alta.

**Un enlace a un archivo entero.** `[desplegando](03-despliegue.md)` no tiene fragmento que conservar, así que no hay nada a lo que una expresión regular pueda reescribirlo. Necesita el id del propio título de ese archivo, lo que significa construir un mapa mientras lees las partes —de nombre de archivo al id de su primer encabezado— y consultarlo en una segunda pasada. Esta es la razón para escribir la fusión en un lenguaje que tenga un diccionario.

**Enlaces de estilo referencia.** `[reintentos]: 30-ejecucion-de-tareas.md#retries` se sitúa al final del archivo en un bloque de definiciones, y el patrón en línea de arriba nunca lo toca. Necesita su propia regla, anclada al inicio de línea:

```bash
sed -E 's|^(\[[^]]+\]:[[:space:]]*)[0-9A-Za-z._/-]+\.md#|\1#|' handbook.md > tmp && mv tmp handbook.md
```

**Enlaces en HTML crudo.** `<a href="30-ejecucion-de-tareas.md">` pasa el analizador sin tocarse, porque Markdown deja pasar el HTML crudo por diseño. Ningún reescritor que entienda Markdown lo va a encontrar. Busca `href=` con grep tanto en la fuente como en la salida.

**Destinos codificados y entre corchetes angulares.** Una ruta con un espacio llega como `](<03 despliegue.md#tls>)` o `](03%20despliegue.md#tls)`, y ninguna de las dos coincide con una clase de caracteres que asumió que no había espacios ni símbolos de porcentaje. Los nombres de archivo con espacios merece la pena prohibirlos solo por esto.

### Encontrar los que se te escaparon

No confíes en la reescritura. Comprueba el Markdown fusionado buscando cualquier cosa que todavía apunte a un archivo:

```bash
grep -nE '\]\([^)#][^)]*\.md' handbook.md
grep -n 'href="' handbook.md
```

Luego comprueba el HTML convertido, que es donde de verdad importa. Cada enlace interno debería tener un destino con ese id, y las dos listas se pueden comparar:

```bash
grep -oE 'href="#[^"]+"' handbook.html | sed -E 's/.*"#(.*)"/\1/' | sort -u > wanted
grep -oE 'id="[^"]+"'    handbook.html | sed -E 's/.*"(.*)"/\1/'  | sort -u > present
comm -23 wanted present
```

`comm -23` imprime las líneas presentes solo en el primer archivo: cada enlace de fragmento sin nada donde aterrizar. Un resultado vacío es la comprobación aprobada. Ponlo en la compilación, porque no cuesta nada y es la única de estas comprobaciones a la que no puede engañar un documento que se renderiza sin problema.

### Las rutas de imagen tras la fusión

`![Flujo](img/flujo.png)` en `manual/capitulos/03-despliegue.md` se resuelve contra `manual/capitulos/`. Mueve esa línea a `manual.md` en la raíz del repositorio y el navegador buscará `img/flujo.png` junto al archivo fusionado, no encontrará nada, y dibujará el icono de imagen rota. Nada cambió en la línea; lo que cambió es aquello con lo que era relativa.

Así que cada destino de imagen relativo tiene que reajustarse desde el directorio propio de la parte hasta el de la salida. En el script de Node, en el punto donde ya conoces ambos:

```js
import { relative, sep } from 'node:path';

const rebaseImages = (text, from, to) =>
  text.replace(/(!\[[^\]]*\]\()([^)\s]+)/g, (match, head, target) => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(target)) return match;
    return head + relative(to, join(from, target)).split(sep).join('/');
  });
```

La comprobación deja en paz las rutas absolutas, los fragmentos y cualquier cosa con un esquema; el `split(sep).join('/')` está ahí porque Windows devuelve barras invertidas y una URL no es una ruta de sistema de archivos. Ejecútalo antes de la reescritura de enlaces, y solo sobre destinos de imagen, para que no interfiera con la pasada que convierte los `.md#` en fragmentos.

Arreglar las rutas hace que el Markdown fusionado sea correcto. No hace que el HTML sea portable: el archivo sigue funcionando solo mientras esas imágenes estén en el lugar correcto a su lado, cosa que no pasará después de que alguien lo mande por correo. El arreglo es incrustar las imágenes como URI de datos, o convertir con algo que produzca un archivo autónomo — [qué imágenes y enlaces siguen funcionando después de mover el archivo](/blog/images-and-links-that-still-work) es toda la pregunta, y vale la pena resolverla antes de enviar nada.

## Colisiones de anclas, y qué hace cada renderizador con ellas

Los ids de encabezado salen del texto del encabezado, así que un `## Resumen` en el capítulo de instalación y un `## Resumen` en el capítulo de tareas quieren el mismo id, `resumen`. En diez capítulos escritos por cuatro personas, «Resumen», «Configuración», «Solución de problemas» y «Ejemplos» van a aparecer más de una vez cada uno. Cada aparición es una colisión.

Lo que pasa después depende por completo de qué convierte el archivo.

| Qué lo renderiza | Qué recibe el segundo «Resumen» | Fuente |
| --- | --- | --- |
| github-slugger, la regla que siguen los propios anclajes de GitHub | `resumen-1`, luego `resumen-2` | `slugger.slug('foo')` devuelve `foo`, y luego `foo-1`; licencia ISC (comprobado en github.com, el 9 de septiembre de 2026) |
| markdown-it-anchor | `resumen-1` | Los ids generados «siguen sufijándose en cada colisión»; `uniqueSlugStartIndex` vale 1 por defecto; licencia Unlicense (comprobado en github.com, el 9 de septiembre de 2026) |
| Pandoc con `--file-scope` | Un id prefijado con el nombre de archivo | «se añaden prefijos basados en los nombres de archivo a los identificadores para desambiguarlos, y los enlaces internos se ajustan en consecuencia» (comprobado en pandoc.org, el 9 de septiembre de 2026) |
| Un conversor sin deduplicación | El mismo id, dos veces, en un documento | El navegador salta a lo que aparezca primero |

Cada uno de esos comportamientos es defendible y ninguno coincide con otro. Un enlace escrito como `[ver](#resumen)` es entonces impredecible entre herramientas: en una llega a la sección del primer capítulo, en otra llega a un elemento que solo existe porque la herramienta contó, y en una tercera llega a un id duplicado sobre el que la especificación nunca prometió nada. Peor: el sufijo depende del orden del documento, así que insertar un capítulo renumera cada colisión posterior y reapunta enlaces en silencio que antes funcionaban.

Tres arreglos, del mejor al peor.

**Haz que los encabezados sean distintos.** `## Configurar el agente` y `## Configurar una tarea` son mejor documentación de todas formas, independientemente de la fusión, y eliminan el problema en vez de gestionarlo. A quien lee un índice con diez entradas idénticas de «Resumen» no le ayuda ninguna cantidad de sufijos.

**Prefija por archivo de origen al fusionar.** Si renombrar no está sobre la mesa, reescribe cada encabezado al leerlo para que su id lleve la parte de donde vino — `despliegue-resumen`, `instalacion-resumen`. Donde la sintaxis lo permite, un id explícito en el encabezado es exacto:

```
## Overview {#deploy-overview}
```

Esa llave final es una extensión, no CommonMark: Pandoc la soporta, y en el mundo de JavaScript hace falta un plugin. Si tu conversor no lo hace, prefija el texto del encabezado en su lugar, o acepta la deduplicación propia de la herramienta y genera el índice a partir de la salida para que los dos coincidan.

**Lee los ids que produjo el conversor.** No adivines la regla de slug. Convierte una vez, mira el HTML, y toma los ids de ahí. TransformPipe prefija cada id de encabezado con `doc-`, y su pestaña de fuente HTML muestra el archivo exacto — un ejemplo concreto del punto general: la única regla de slug fiable es la que puedes leer en la salida.

La misma colisión afecta a las notas al pie, y la gente lo nota mucho más tarde. Cada parte que tiene notas al pie las empieza en `[^1]`, así que un documento fusionado tiene cuatro definiciones `[^1]` y cuatro referencias que todas resuelven a la que sea que el analizador se haya quedado. O analiza cada archivo por separado, que es exactamente para lo que sirve `--file-scope` de Pandoc, o prefija las etiquetas al leer cada parte.

## El índice

Con las partes ya rebajadas, cada `##` es un capítulo — un índice esperando a generarse. Hay cuatro formas de conseguir uno, y la pregunta decisiva es la misma en todos los casos: ¿coincide el destino de cada entrada con el id que el renderizador va a generar de verdad?

| Vía | Qué cuesta | Cuándo es correcta |
| --- | --- | --- |
| A mano | Se queda obsoleto en silencio, y nadie lo nota durante meses | Cinco capítulos que no van a cambiar |
| Generado al fusionar | Tú controlas la regla de slug, y debe coincidir con la del conversor | La fusión ya es un script |
| doctoc | Una instalación de Node; escribe dentro del archivo, entre marcadores | Un README en un repositorio git, actualizado en cada commit |
| markdown-toc | Una instalación de Node; un marcador `<!-- toc -->` | El mismo trabajo, si prefieres ese estilo de marcador |
| Desde el conversor | Nada, y los ids coinciden garantizado | Ya estás convirtiendo a HTML de todas formas |

**Generado al fusionar.** Recorre el archivo fusionado una vez, fuera de los fences, e imprime una entrada por encabezado:

```bash
awk '/^```/ { fence = !fence; next }
     !fence && /^## / {
       title = substr($0, 4)
       slug  = tolower(title)
       gsub(/[^a-z0-9 -]/, "", slug)
       gsub(/ /, "-", slug)
       printf "- [%s](#%s)\n", title, slug
     }' handbook.md
```

Esa regla de slug —minúsculas, quitar puntuación, espacios a guiones— vale para encabezados en inglés y se desvía con los acentos y las duplicaciones. También asume que el id es el slug pelado: un conversor que prefija los ids quiere ese prefijo dentro del enlace. Las entradas generadas y los encabezados vienen del mismo texto, así que un capítulo renombrado renombra su propia entrada.

**doctoc** «genera índices para archivos markdown dentro de un repositorio git local. Los enlaces son compatibles con las anclas que genera GitHub u otros sitios». Instálalo con `npm install -g doctoc`, marca el lugar con `<!-- START doctoc -->` y `<!-- END doctoc -->`, y ejecuta `doctoc handbook.md`; `--github`, `--maxlevel` y `--title` controlan el estilo de ancla, la profundidad y el encabezado que escribe encima de la lista. Licencia MIT (comprobado en github.com, el 9 de septiembre de 2026).

**markdown-toc** hace el mismo trabajo con un marcador más corto: pon `<!-- toc -->` donde quieras la lista y ejecuta `markdown-toc -i handbook.md` para escribirla en el sitio, entre `<!-- toc -->` y `<!-- tocstop -->`. Instálalo con `npm install -g markdown-toc`. Licencia MIT (comprobado en github.com, el 9 de septiembre de 2026).

Las dos apuntan a las anclas de GitHub, lo cual es exactamente correcto cuando el archivo fusionado se va a leer en GitHub y exactamente incorrecto cuando pasa por un conversor con una regla de id distinta. Esa es la trampa: un índice generado contra una regla de slug y renderizado por otra produce una página donde cada entrada es un enlace y ninguno mueve la página.

**Desde el conversor** evita el desajuste por construcción, porque la herramienta que numera los encabezados es la herramienta que escribe la lista. Si HTML es el destino de todas formas, es la respuesta más barata y correcta.

Sea cual sea la vía, recorre el archivo fusionado una vez antes de enviarlo:

- [ ] Ningún `#` dentro de un bloque de código se rebajó por error
- [ ] No queda ningún `.md)` en ningún enlace
- [ ] Cada entrada del índice lleva a algún lado
- [ ] Cada imagen carga con la carpeta movida
- [ ] La comprobación con `comm -23` de arriba no imprime nada

## Las respuestas propias de Pandoc, y el caso de la impresión

Pandoc resuelve varios de estos problemas con flags, lo que es una buena razón para recurrir a él antes de escribir un script — y una buena razón para saber exactamente qué problemas te deja a ti.

Dadas varias entradas, «pandoc las concatenará todas (con líneas en blanco entre ellas) antes de analizarlas», así que el orden sigue siendo tuyo: lista los archivos en el orden que quieras, o expande un manifiesto en la línea de comandos. Los flags útiles:

| Flag | Qué dice el manual |
| --- | --- |
| `--shift-heading-level-by` | «Desplaza los niveles de encabezado por un entero positivo o negativo. Por ejemplo, con `--shift-heading-level-by=-1`, los encabezados de nivel 2 se vuelven de nivel 1, y los de nivel 3 se vuelven de nivel 2.» |
| `--file-scope` | «Analiza cada archivo individualmente antes de combinarlos, para documentos multiarchivo. Esto permite que las notas al pie en distintos archivos con el mismo identificador funcionen como se espera.» |
| `--toc` | «Incluye un índice generado automáticamente… en el documento de salida.» |
| `--toc-depth` | «Especifica el número de niveles de sección a incluir en el índice. El valor por defecto es 3.» |
| `--number-sections` | «Numera los encabezados de sección en salida LaTeX, ConTeXt, HTML, Docx, ms o EPUB. Por defecto, las secciones no se numeran.» |

(Todo comprobado en pandoc.org, el 9 de septiembre de 2026.)

`--shift-heading-level-by=1` es el paso de rebajado, hecho como es debido: se ejecuta sobre el documento ya analizado, así que un `#` dentro de un bloque con fence es un comentario en una muestra de código y se deja en paz. Esa es toda la razón por la que el awk de arriba necesitaba un indicador de fence y esto no. `--file-scope` es el arreglo de anclas y notas al pie, y va más allá de la deduplicación — prefija los ids con los nombres de archivo y ajusta los enlaces internos en consecuencia, que es el prefijado al fusionar descrito antes, gratis.

Así que una fusión decente es un solo comando:

```bash
pandoc --standalone --toc --toc-depth=2 --file-scope \
  --shift-heading-level-by=1 \
  --metadata title="Handbook" \
  $(grep -vE '^[[:space:]]*(#|$)' order.txt) \
  -o handbook.html
```

Lo que no hace: reajustar tus rutas de imagen, ni reescribir un enlace `03-despliegue.md#tls` fuera del ajuste de `--file-scope`. Y el front matter es una cuestión de qué lector uses: el propio dialecto de Markdown de Pandoc lee un bloque de metadatos YAML como metadatos y no como texto, lo que hace que el accidente setext desaparezca, pero el conjunto de extensiones depende del lector que elijas — comprúebalo antes de confiar en ello. Si Pandoc es más herramienta de la que necesita este trabajo, [las opciones más pequeñas están aquí](/blog/pandoc-alternatives-for-markdown-to-html).

### Si el destino es un PDF

Un manual fusionado va muy a menudo camino de la imprenta, y la impresión tiene un requisito que la pantalla no: los capítulos empiezan en una página nueva. Markdown no tiene sintaxis de salto de página, así que el salto tiene que venir del HTML o del motor de PDF.

A través de un navegador o cualquier convertidor de HTML a PDF, es una regla CSS de fragmentación. Pon un marcador en cada costura en lugar del `***`:

```html
<div class="chapter-break"></div>
```

y define las reglas en la hoja de estilos:

```css
@page { size: A4; margin: 20mm; }

.chapter-break { break-before: page; }
h1, h2, h3 { break-after: avoid-page; }
p { orphans: 3; widows: 3; }
```

`break-before: page` empieza el siguiente capítulo en una hoja nueva. `break-after: avoid-page` en los encabezados evita que el título de un capítulo quede varado al pie de una página con su primer párrafo en la siguiente, que es el resultado feo más habitual al imprimir un documento fusionado. `orphans` y `widows` hacen lo mismo con los párrafos. Los motores más antiguos quieren también la sintaxis heredada `page-break-before: always`; poner las dos no hace daño.

Un `\newpage` en crudo solo llega a un PDF basado en LaTeX, así que es la respuesta correcta a través del escritor LaTeX de Pandoc y no hace absolutamente nada a través de un navegador. [Todas las rutas de Markdown a PDF, y lo que cuesta cada una](/blog/markdown-to-pdf) es la versión larga de esta decisión.

## Cuándo es un libro, y no un documento

Fusionar es correcto cuando la salida es una sola página. Deja de ser correcto en cuanto quieres capítulos numerados, referencias cruzadas que sobrevivan a la reordenación, o un buscador — y la versión honesta de esa frase es que un manual fusionado tiene un solo mecanismo de navegación, el índice del principio, y quien lee once pantallas más abajo no tiene idea de dónde está.

Pasado cierto tamaño, el archivo fusionado es un libro que finge ser un documento. Los síntomas son concretos: el script de fusión ha ido creciendo una pasada de reescritura de enlaces, una de prefijado de ids y un generador de índice, lo cual equivale a un generador de sitios estáticos sin ninguna prueba; reordenar dos capítulos significa volver a ejecutar todo y revisar cada ancla otra vez; y la salida es lo bastante grande como para que abrirla se note.

Una herramienta de libros resuelve el orden, las anclas y la navegación por ti, y te cobra un paso de compilación por ello.

| Herramienta | El orden viene de | Salida | Licencia |
| --- | --- | --- | --- |
| mdBook | `SUMMARY.md` | Un sitio estático, escrito en Rust | MPL 2.0 |
| MkDocs | `nav` en `mkdocs.yml` | Un sitio estático, escrito en Python | BSD de 2 cláusulas |
| Quarto | `chapters:` en `_quarto.yml` | HTML, PDF, Typst, Word, EPUB, AsciiDoc | MIT |
| Honkit | Un árbol de fuentes al estilo GitBook | Un sitio web o un libro electrónico: PDF, EPUB, MOBI | Apache 2.0 |
| Pandoc | El orden en que listes los archivos | Lo que haya en su propia lista de formatos: HTML, PDF, EPUB, Word y más | GPL |

(Licencias y salidas comprobadas en rust-lang.github.io, mkdocs.org, quarto.org, pandoc.org y github.com, el 9 de septiembre de 2026. Honkit es una bifurcación de GitBook Legacy.)

Lo que eso cuesta merece decirse claro, porque «usa mdBook y ya» es un consejo que ignora la mitad del problema. Adquieres una cadena de herramientas: un entorno de ejecución que instalar en cada máquina que compile la documentación, un archivo de configuración que mantener válido, un tema que mantener actualizado, y un trabajo de CI que ahora puede fallar por razones que no tienen nada que ver con lo que escribió nadie. Adquieres un destino de despliegue, porque la salida es un directorio de archivos que hay que alojar en algún sitio. Y pierdes el artefacto que querías al principio — una herramienta de libros te da un sitio, no un archivo que puedas adjuntar a un correo, y si alguien pide el manual entero como una sola página vuelves a fusionar, o a lo que sea que ofrezca la herramienta como vista de impresión.

La línea divisoria no es el número de archivos. Es si el documento se lee una vez o se vive dentro de él. Un manual que se conserva durante años está mejor como sitio; uno que sale una sola vez —a un cliente, a un regulador, a alguien nuevo— está mejor fusionado. Dónde vive la fuente es una pregunta aparte de las dos, y la respuesta a esa casi siempre es el repositorio.

## Cómo elegir qué fusión construir

1. **Decide dónde vive el orden antes de escribir una línea del script.** En los nombres de archivo, cada inserción es un renombrado; en un manifiesto, cada parte nueva es una línea que alguien debe recordar añadir — y la consecuencia de olvidarla es un capítulo que simplemente no sale, algo que ninguna prueba detecta salvo que escribas una que compare el manifiesto con el directorio.
2. **Rebaja después de analizar, no antes.** Una expresión regular sobre texto crudo no puede distinguir un encabezado de un comentario en una muestra de shell, así que o bien llevas la cuenta de los fences tú mismo, o le pasas el trabajo a un analizador; el coste de hacerlo mal es un bloque de código que se convierte en una entrada del esquema, y va a estar en el índice de la página.
3. **Reescribe enlaces y rutas de imagen en la misma pasada que lee cada archivo.** Es el único momento en que sabes de qué parte vino cada línea, que es exactamente lo que necesitas para convertir `03-despliegue.md#tls` en `#tls` e `img/flujo.png` en `capitulos/img/flujo.png` — hazlo más tarde y estarás adivinando.
4. **Haz que los ids de encabezado sean únicos en el origen, en vez de depender del renderizador.** Cada herramienta deduplica de forma distinta y algunas no deduplican en absoluto, así que un documento que depende del contador es un documento cuyos enlaces cambian de significado cuando alguien inserta un capítulo.
5. **Genera el índice a partir de la salida, no de la entrada.** Una lista construida con tu regla de slug y renderizada por un conversor con otra distinta es una página de enlaces que fallan todos en silencio, y el fallo silencioso es el caro.
6. **Abre el archivo fusionado en otro sitio antes de enviarlo.** Otra máquina, otro navegador, la red apagada, la carpeta de imágenes dejada atrás — esa única prueba detecta a la vez rutas relativas rotas, anclas ausentes y estilos enlazados a un CDN, y lleva un minuto.
7. **Escribe por adelantado el tamaño en el que dejarás de fusionar.** Veinte partes, o el día en que se necesite un segundo formato de salida, o la primera petición de búsqueda: elige el disparador de antemano, porque la alternativa es descubrirlo como problema de mantenimiento dieciocho meses después.

Empieza por los nombres de archivo, antes de que haya veinte de ellos: el orden es el único de estos problemas que empeora con el tiempo, y el único cuyo arreglo —renombrar— se vuelve más caro cada mes que lo dejas pasar. Para el HTML en sí, suelta las partes juntas en [TransformPipe](/): varios archivos a la vez se encadenan en un documento, en orden, separados por una regla, con los ids de encabezado visibles en la pestaña de fuente para que el índice se pueda comprobar contra ellos en lugar de adivinarlo. Desde una terminal, `tp push manual/*.md --merge --share link` imprime un enlace para pasar. De cualquiera de las dos formas, fusionar es la parte fácil; las tres pasadas sobre enlaces, imágenes y anclas son el trabajo, y son lo que separa a un documento que se renderiza de un documento que se lee.

## Preguntas frecuentes

### ¿Cómo combino varios archivos Markdown en uno solo?

Concaténalos en un orden deliberado, y luego haz tres cambios sobre la marcha: elimina el front matter de cada parte, rebaja sus encabezados un nivel evitando los bloques de código, y pon una regla `***` entre las partes. `cat *.md > salida.md` hace la concatenación y ninguno de los cambios, que es por lo que su salida se ve bien y se comporta mal.

### ¿Por qué el capítulo 10 sale antes que el 2 en mi archivo fusionado?

Porque un glob de la shell ordena los nombres de archivo como cadenas de texto, y en una comparación de cadenas el `1` va antes que el `2` y la comparación se detiene ahí. Rellena los prefijos numéricos con ceros para que todos los nombres de archivo tengan el mismo ancho, o guarda el orden de lectura en un archivo manifiesto y lee ese en vez de usar el glob.

### ¿Cómo evito que cada capítulo se convierta en un H1?

Rebaja cada encabezado un nivel y dale al documento fusionado un único título propio. No lo hagas con `sed 's/^#/##/'`, que también reescribirá los comentarios `#` dentro de bloques de código con fence; lleva la cuenta de los fences, o usa `--shift-heading-level-by=1` de Pandoc, que actúa sobre el documento ya analizado y por lo tanto no puede tocar una muestra de código.

### ¿Qué pasa con los enlaces entre los archivos después de fusionarlos?

Apuntan a archivos que ya no están al lado de quien lee. Un enlace con fragmento —`03-despliegue.md#tls`— se convierte en `#tls`; un enlace a un archivo entero necesita el id del título de ese archivo, lo que significa construir un mapa de nombre de archivo a id mientras lees las partes. Después, busca con grep `.md)` en el archivo fusionado y enlaces de fragmento sin id correspondiente en el HTML convertido.

### Dos capítulos tienen el mismo encabezado — ¿cuál ancla gana?

Depende del renderizador, que es el problema. La regla de slug de GitHub añade `-1` y `-2` a las repeticiones, markdown-it-anchor también sufija en cada colisión, Pandoc con `--file-scope` prefija los ids con el nombre de archivo, y un conversor sin deduplicación emite el mismo id dos veces y deja que el navegador salte al primero. Renombra los encabezados, o prefíjalos por archivo de origen al fusionar.

### ¿Necesito un generador de sitios estáticos o una herramienta de libros?

Solo si la salida es un conjunto de páginas y no una sola. Una herramienta de libros te da orden, anclas únicas, navegación y búsqueda a cambio de una cadena de herramientas, un archivo de configuración y un paso de compilación, y lo que produce es un directorio que hay que alojar — no un archivo que puedas adjuntar a un correo. Si alguien pidió un solo documento, fusionar sigue siendo la respuesta correcta.

### ¿Puedo fusionar archivos Markdown sin instalar nada?

Sí. Un conversor que funciona en el navegador y acepta varios archivos a la vez los encadenará en un documento en orden y te devolverá el HTML, sin instalar nada y sin subir nada. La contrapartida es que la reescritura de enlaces, imágenes y anclas descrita arriba no se hace por ti, así que haz esas pasadas sobre el Markdown primero y convierte al final.
