---
title: "Los mejores conversores de HTML a Markdown en 2026: comparados y puestos a prueba"
description: Comparamos conversores de HTML a Markdown de 2026 —online, bibliotecas, extractores, recortadores— por qué conservan y qué descartan del artículo
date: 2026-09-08
tag: Conversión
keywords: mejor convertidor html a markdown, convertidor html a markdown online, convertir archivo html a markdown, pagina web a markdown, alternativa a turndown, html a markdown linea de comandos, guardar una pagina web como markdown, convertir html a markdown sin subir archivo
---

Convertir HTML a Markdown no es una traducción. Es una demolición con una lista de lo que hay que conservar. HTML puede describir un diseño a tres columnas, una tabla metida dentro de la celda de otra tabla, un color en una sola palabra y un componente que solo existe después de que se ejecute JavaScript. Markdown puede describir encabezados, párrafos, énfasis, listas, enlaces, imágenes, código y —si el dialecto lo permite— una tabla plana. Cada conversor de esta página está decidiendo qué tirar, y no se ponen de acuerdo.

### Resumen rápido

Elige según qué es tu HTML. Para un **fragmento limpio o una página escrita a mano**, casi cualquier conversor funciona y las diferencias son cosméticas. Para una **página guardada entera**, la conversión es la mitad fácil — la mitad difícil es encontrar el artículo dentro de la navegación, el aviso de cookies y el pie de página, que es lo que hace un extractor como Readability antes de que ningún conversor entre en acción. Para **un archivo que tienes en el disco y una sola conversión que hacer**, una herramienta de navegador es el camino más corto y no sube nada, y las gratuitas están cubiertas más abajo. Para **una compilación o un script**, usa la biblioteca de tu lenguaje: Turndown en JavaScript, markdownify o html2text en Python, Pandoc cuando el resultado tiene que ser algo más que Markdown.

## Por qué decir «convierte HTML» casi no dice nada

HTML a Markdown tiene dos etapas y casi ninguna herramienta admite tener las dos. La primera es la extracción: decidir qué parte del documento es el documento. La segunda es la traducción: convertir los elementos que conservaste en sintaxis Markdown. Una biblioteca que hace bien la segunda y se salta la primera te va a dar una preciosa versión en Markdown de un menú de navegación, un formulario de suscripción y una lista de artículos relacionados, con el artículo en algún punto de en medio.

Esa división explica casi toda la decepción. Alguien guarda una página desde el navegador, suelta el archivo `.html` en un conversor, y recibe cuatrocientas líneas de listas de enlaces antes del primer párrafo. El conversor hizo su trabajo. Nadie había hecho el otro. Los extractores existen para esto —Readability es el más conocido, y es la maquinaria detrás del modo lectura de Firefox— y las extensiones de navegador que recortan páginas a Markdown son un extractor y un conversor pegados con cinta adhesiva, que es justo por lo que se sienten tan superiores sobre una página web real frente a lo que da una biblioteca sola.

Luego está la cuestión de qué sobrevive a la traducción, y aquí es donde los conversores de verdad se diferencian. Las tablas son el ejemplo más ruidoso: no están en la especificación de CommonMark, así que un conversor tiene que implementar a propósito las tablas de GitHub Flavored Markdown, y los que no lo hacen aplanan una `<table>` en una sucesión de párrafos o dejan pasar el HTML en bruto tal cual. Las listas de tareas, el tachado, las listas de definiciones, las notas al pie, `<figure>` y `<figcaption>`, `<sup>` y `<sub>`, y los bloques de código con un lenguaje indicado están todos en la misma categoría: implementados por algunos, ignorados por otros, y jamás mencionados en una página comparativa.

Por último está lo que pasa con todo aquello para lo que Markdown no tiene palabras. Un conversor tiene tres opciones y las tres son defendibles. Puede descartar el elemento, lo que pierde información en silencio. Puede incrustar HTML en bruto, lo que conserva la información y hace el Markdown menos portable, porque la siguiente herramienta de la cadena puede terminar escapándolo. O puede aproximar — una tabla anidada se convierte en una plana, un `<span>` con estilo se convierte en texto normal. Saber cuál de las tres elige tu herramienta dice más que cualquier lista de funciones, porque es la diferencia entre un archivo que puedes leer y uno que tienes que reparar.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad principal | Precio |
| --- | --- | --- | --- |
| TransformPipe | Un archivo o una página guardada, convertido ya | Conversión en el navegador, quita el mobiliario de la página, conserva tablas y listas de tareas | Gratis |
| Turndown | Aplicaciones JavaScript y extensiones de navegador | El conversor JS por defecto; reglas que puedes sobreescribir; plugin GFM para tablas | Gratis, MIT |
| Pandoc | HTML que tiene que acabar en varios formatos | Lee HTML, escribe unos 40 formatos, conserva o rechaza HTML en bruto a petición | Gratis, GPL |
| html2text | Scripts de Python que quieren texto plano legible | CLI más biblioteca, enlaces en estilo referencia, opción de quitar enlaces | Gratis, GPLv3 |
| markdownify | Scripts de Python que quieren estructura fiel | Basado en BeautifulSoup, opciones por etiqueta, trato de tablas | Gratis, MIT |
| node-html-markdown | Convertir mucho HTML | Trae su propio analizador HTML, no necesita un DOM | Gratis, MIT |
| html-to-md | Una dependencia pequeña en un paquete JS | Pequeño, sin dependencias, maneja elementos de tabla | Gratis, MIT |
| html-to-markdown (Go) | Un binario y una biblioteca de Go del mismo proyecto | Binario instalable, plugin de tablas con alineación y celdas combinadas | Gratis, MIT |
| Mozilla Readability | Encontrar el artículo dentro de una página | Extracción, no conversión — devuelve HTML limpio | Gratis, Apache 2.0 |
| Postlight Parser | Extracción con salida en Markdown incluida | `contentType` de html, markdown o text | Gratis, Apache 2.0 / MIT |
| MarkDownload | Recortar la página que estás mirando | Readability y luego Turndown, desde la barra del navegador | Gratis, Apache 2.0 |
| Obsidian Web Clipper | Recortar directo a una bóveda | Extracción y conversión con defuddle, plantillas, saneado | Gratis, MIT |
| Notion Web Clipper | Guardar páginas en Notion | Guarda en bloques de Notion; Markdown solo con una exportación posterior | Plan gratuito disponible |
| «Guardar página como» del navegador | Conseguir el HTML, para empezar | No es un conversor — el origen de casi todo el mal input | Gratis |

## Los mejores conversores de HTML a Markdown en 2026

### TransformPipe — mejor para un archivo o una página guardada que quieres convertir ya

Toma un archivo `.html`, `.htm` o `.xhtml` y devuelve Markdown en tu navegador. No hace falta instalar nada ni tener cuenta, y sin haber iniciado sesión el archivo no se envía a ningún sitio: se lee, se convierte y se muestra en tu propia máquina.

| A favor | En contra |
| --- | --- |
| No se sube nada sin haber iniciado sesión | Un documento a la vez, no un rastreador |
| Quita el mobiliario de la página antes de convertir, no después | No es un extractor: recorta por elemento, no por «leer» la página |
| Tablas, tachado, bloques de código y listas de tareas sobreviven | El navegador hace el trabajo, así que un archivo muy grande depende de la máquina |
| La misma conversión funciona en la API, la CLI, la GitHub Action y el servidor MCP | Sin configuración por etiqueta |

**Precio:** gratis. Una cuenta añade historial, compartir y una API, también gratis.

**Detalles técnicos**

- Construido sobre node-html-markdown, que analiza con node-html-parser en vez de un DOM — así que la misma conversión corre en una pestaña de navegador, en un trabajo de CI y detrás de la API, en lugar de tener una implementación distinta para cada sitio
- `<script>`, `<style>`, `<noscript>`, `<template>`, `<svg>`, `<iframe>`, `<head>`, `<nav>` y `<footer>` se eliminan antes de traducir, junto con los comentarios HTML
- Las tablas y el tachado los maneja el analizador; las casillas dentro de elementos de lista se traducen de vuelta a `- [x]` y `- [ ]`, así que una lista de tareas llega como lista de tareas
- Las secuencias de líneas en blanco se colapsan, que es de lo que normalmente está lleno una página convertida
- También convierte Word, CSV, TSV y JSON a Markdown, y Markdown de vuelta a un archivo HTML autocontenido

**¿Para quién es?** Para quien tenga un archivo y una razón para no mandárselo a un servidor — una exportación guardada, una página de un wiki interno, el documento de un cliente. Si después quieres hacer el viaje contrario, [el lado de Markdown a HTML es una comparativa completamente distinta](/blog/best-markdown-to-html-converters), con sus propios fallos.

### Turndown — mejor biblioteca de JavaScript, y con la que se mide todo lo demás

Turndown es un conversor de HTML a Markdown escrito en JavaScript, y es la opción por defecto en el mundo JS por un margen amplio. Funciona en el navegador y en Node, y su sistema de reglas es la razón por la que aparece dentro de tantas otras herramientas: puedes sustituir el manejador de cualquier elemento sin bifurcar nada.

| A favor | En contra |
| --- | --- |
| Las reglas se pueden sustituir por elemento, lo que hace manejable el HTML raro | Las tablas necesitan el plugin GFM; el núcleo no las hace |
| Funciona en el navegador y en Node | Trabaja a través de un DOM en vez de su propio analizador |
| Muy usado, así que su comportamiento está bien documentado en los reportes de bugs de otros | Sin extracción: convierte lo que le des, mobiliario incluido |
| `keep`, `remove` y la opción `blankReplacement` te dan tres formas de tratar lo que no quieres | La configuración es código, no opciones |

**Precio:** gratis, licencia MIT (comprobado en github.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- `addRule` registra un manejador contra un nombre de etiqueta, una lista de nombres o una función de filtro; `keep` deja un elemento como HTML en bruto; `remove` lo borra junto con su contenido
- Opciones para el estilo de encabezado (ATX o setext), el marcador de viñeta, el carácter de la cerca de código, los delimitadores de énfasis y negrita, y el estilo de enlace — incluidos los enlaces de referencia
- `turndown-plugin-gfm` añade tablas, tachado y otras construcciones de GitHub Flavored Markdown
- Como es un conversor basado en DOM, el documento que le pasas es el que construiría un navegador — el HTML mal formado lo repara el analizador antes de que Turndown lo vea

**¿Para quién es?** Para desarrolladores de JavaScript, y para quien escriba una extensión de navegador o un manejador de pegado en un editor. Su omnipresencia es una ventaja: cuando una página se convierte mal, alguien ya ha escrito la regla probablemente.

### Pandoc — mejor cuando el HTML tiene que acabar siendo algo más que Markdown

Pandoc es un conversor de documentos de línea de comandos escrito en Haskell que lee y escribe alrededor de cuarenta formatos. HTML de entrada y Markdown de salida es uno de sus trabajos más pequeños, y la razón para usarlo suele ser que Markdown no es la última parada.

| A favor | En contra |
| --- | --- |
| Una herramienta para HTML a Markdown, y de Markdown a casi cualquier cosa | Exige instalación y una terminal |
| Su escritor de Markdown puede incluir o rechazar HTML en bruto, a petición | Su dialecto extendido de Markdown no es GFM salvo que se lo pidas |
| Los filtros Lua te dejan reescribir el documento a mitad de la conversión | Sin extracción: una página entera se convierte como página entera |
| Maneja documentos muy grandes sin un navegador de por medio | El número de opciones es su propia curva de aprendizaje |

**Precio:** gratis, licencia GPL.

**Detalles técnicos**

- `pandoc -f html -t gfm` elige GitHub Flavored Markdown como salida, que es lo que quieres si las tablas y las listas de tareas importan
- Todo lo que Markdown no puede expresar cae a HTML en bruto dentro de la salida; desactivar la extensión `raw_html` del escritor es como se rechaza eso y se acepta la pérdida en su lugar
- `--wrap=none` evita que envuelva los párrafos a la fuerza, lo que de otro modo hace ilegibles los diffs en un repositorio
- Los filtros Lua y las plantillas operan sobre su modelo interno de documento, así que puedes descartar o reescribir clases enteras de elemento antes de que se escriba el Markdown

**¿Para quién es?** Para quien convierte de forma programada, convierte muchos archivos, o convierte HTML a algo que no es Markdown en absoluto. También es la respuesta correcta cuando el Markdown tiene que quedar guardado en un repositorio y seguir siendo diferenciable.

### html2text — mejor para Python cuando quieres que se lea bien

html2text es un script y una biblioteca de Python que convierte HTML en texto plano, casi ASCII, y legible, que además resulta ser Markdown válido. El énfasis está en legible: se escribió para que las páginas web fueran agradables de leer como texto, y sus valores por defecto lo reflejan.

| A favor | En contra |
| --- | --- |
| Una herramienta de línea de comandos y una biblioteca en una sola instalación | GPLv3, que algunos proyectos no pueden aceptar |
| Opciones para enlaces en estilo referencia, ignorar enlaces, ignorar imágenes | La salida está pensada para leer, no para volver al formato original |
| Estable desde hace mucho tiempo | El trato de tablas es más flojo que en las bibliotecas orientadas a estructura |
| Ajuste de línea sensato para la salida de texto | No encaja bien con HTML muy anidado |

**Precio:** gratis, licencia GPLv3 (comprobado en github.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- Se ejecuta como `html2text [archivo [codificación]]` o como biblioteca desde Python
- `--ignore-links` e `--ignore-images` quitan las partes que hacen ruido en la salida de texto; `--reference-links` mueve las URL al final en vez de dejarlas en línea
- `--escape-all` escapa los caracteres especiales de forma agresiva, que importa cuando el texto original contiene puntuación de Markdown
- `--mark-code` marca los bloques de código de programa con `[code]` y `[/code]`; `--backquote-code-style` es la opción que genera cercas de triple acento grave

**¿Para quién es?** Para scripts de Python que producen texto para personas o para un índice de búsqueda — cuerpos de correo, resúmenes, texto de notificación. Si lo que necesitas es una copia estructural fiel del HTML, la siguiente entrada encaja mejor.

### markdownify — mejor biblioteca de Python para conservar la estructura

markdownify convierte HTML a Markdown usando BeautifulSoup como analizador, con opciones por etiqueta. Donde html2text optimiza para texto legible, markdownify optimiza para un mapeo fiel de los elementos que reconoce.

| A favor | En contra |
| --- | --- |
| Licencia MIT, más fácil de adoptar que GPLv3 | Depende de BeautifulSoup, así que no va sin dependencias |
| Opciones por etiqueta, incluido qué hacer con tablas sin fila de encabezado | Más lenta que las opciones compiladas con analizador propio |
| Convierte o descarta etiquetas concretas por nombre | Sin etapa de extracción |
| Familiar para quien ya usa BeautifulSoup | Menos comodidades de línea de comandos que html2text |

**Precio:** gratis, licencia MIT (comprobado en github.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- Construida sobre BeautifulSoup, y sus opciones de analizador se pasan directamente, así que eliges el analizador HTML subyacente
- Las listas `strip` y `convert` te dejan nombrar las etiquetas que se eliminan o las únicas que se conservan
- `table_infer_header` decide qué pasa con una tabla sin fila de encabezado, que es el problema de tablas más común en el HTML real
- El estilo de encabezado, los caracteres de viñeta y el trato del lenguaje de código son todos configurables

**¿Para quién es?** Para código en Python que tiene que conservar la estructura del documento — importar un CMS heredado, convertir una exportación de documentación, alimentar Markdown a un modelo al que un muro de texto confundiría.

### node-html-markdown — mejor para convertir mucho HTML

node-html-markdown es un conversor de HTML a Markdown en TypeScript cuyo propósito declarado es el rendimiento. Analiza con node-html-parser en lugar de depender de un DOM, que es a la vez por qué es rápido y por qué corre en sitios donde una biblioteca basada en DOM no puede.

| A favor | En contra |
| --- | --- |
| No necesita DOM, así que corre en cualquier sitio donde haya JavaScript | Una comunidad más pequeña que la de Turndown |
| Diseñado para volumen desde el principio | Los traductores personalizados son su propia API, no la de Turndown |
| Maneja tablas y tachado sin necesitar un plugin | Algunas decisiones de trato son opinionadas y hay que sobreescribirlas |
| Traductores personalizados por elemento | Sin extracción |

**Precio:** gratis, licencia MIT (comprobado en github.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- Llevar su propio analizador como dependencia significa la misma ruta de código en un navegador, en Node, en un worker y en una función sin servidor — sin necesitar ningún sustituto de DOM
- Los traductores se registran por nombre de elemento y pueden sustituir, ignorar o negarse a recorrer un nodo
- Opciones para el marcador de viñeta, la cerca de código, los delimitadores de énfasis y negrita, y si conservar las imágenes con URI de datos
- El README del proyecto declara que se escribió para convertir volúmenes muy grandes de HTML; trata las cifras de rendimiento publicadas como una afirmación del propio proyecto, no como un benchmark independiente

**¿Para quién es?** Para quien convierte HTML en bloque, o en un entorno sin DOM. También es el motor detrás del conversor de este sitio, exactamente por esa razón: una conversión que se comporta igual en una pestaña de navegador y en un servidor.

### html-to-md — mejor dependencia pequeña

html-to-md es un conversor de JavaScript pequeño y sin dependencias, usable en Node y en el navegador a través de un empaquetador. Es la opción a la que recurrir cuando el conversor es un detalle dentro de un paquete más grande y no el objetivo del proyecto.

| A favor | En contra |
| --- | --- |
| Pequeño y sin dependencias | Menos puntos de extensión que Turndown |
| Lista documentada de etiquetas admitidas, tablas incluidas | Comunidad más pequeña, así que hay menos ejemplos resueltos |
| Funciona en Node y en el navegador | No pensado para HTML raro o mal anidado |

**Precio:** gratis, licencia MIT (comprobado en github.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- Las etiquetas admitidas están documentadas explícitamente, e incluyen `table`, `thead`, `tbody`, `tr`, `th` y `td`
- Sin dependencias, así que añade un solo módulo en vez de un árbol entero
- `skipTags`, `emptyTags` e `ignoreTags` decide qué se descarta y si su contenido se va con ello; `aliasTags` mapea una etiqueta poco común a un manejador que ya existe; `tagListener` te entrega una sola etiqueta para que la manejes tú

**¿Para quién es?** Para proyectos de frontend donde el tamaño del paquete es una restricción real y el HTML a convertir se comporta razonablemente bien.

### html-to-markdown (Go) — mejor si quieres un binario y una biblioteca

html-to-markdown de JohannesKaufmann es una biblioteca de Go con una herramienta de línea de comandos construida a partir de ella. Esa combinación es su atractivo: la misma conversión en una tubería de shell y dentro de un servicio de Go.

| A favor | En contra |
| --- | --- |
| Una CLI real, instalable como binario sin runtime que gestionar | Solo Go, para uso como biblioteca |
| El plugin de tablas implementa tablas GFM, con alineación y celdas combinadas | El conjunto de plugins es más pequeño que el de las bibliotecas JS |
| Lee de un archivo o de la entrada estándar | Menos documentado que Turndown, así que hay menos ejemplos |
| Rápido, y no necesita ni Node ni Python en la máquina | Sin extracción |

**Precio:** gratis, licencia MIT (comprobado en github.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- `html2markdown --input archivo.html --output archivo.md`, o HTML pasado por la entrada estándar
- Distribuido como fórmula de Homebrew, paquete de Debian, binarios precompilados y `go install`
- Un plugin de tablas que implementa tablas de GitHub Flavored Markdown con alineación y manejo de `rowspan` y `colspan`
- Se pueden añadir reglas en Go para los elementos que los valores por defecto tratan mal

**¿Para quién es?** Para servicios en Go, y para quien quiera HTML a Markdown en un script de shell en una máquina donde instalar Node o Python es una molestia.

### Mozilla Readability y Postlight Parser — mejores para encontrar el artículo

Estos dos no son conversores, y esa es la razón para conocerlos. Readability toma una página y devuelve el artículo: título, autoría, y el contenido como HTML limpio, sin la navegación, las barras laterales ni el relleno estructural. Postlight Parser hace el mismo trabajo y te entrega el resultado directamente como Markdown si lo pides.

| A favor | En contra |
| --- | --- |
| Resuelven el problema que los conversores no tocan | Readability devuelve HTML, así que igual necesitas un conversor después |
| Readability es la maquinaria detrás del modo lectura de Firefox, así que está muy probada | Los dos necesitan un DOM, lo que implica JSDOM o un navegador dentro de Node |
| Postlight Parser puede devolver html, markdown o text | La extracción es heurística: a veces coge de más o de menos |
| Los dos tienen licencia permisiva | Ninguno es un conversor de documentos en el sentido general |

**Precio:** gratis. Readability es Apache 2.0; Postlight Parser tiene doble licencia Apache 2.0 y MIT (comprobado en github.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- El `parse()` de Readability devuelve un objeto con el contenido del artículo como cadena HTML, más `textContent` con las etiquetas quitadas
- Readability necesita un documento DOM, así que en Node se combina con JSDOM; en una extensión de navegador el documento ya está ahí, en vivo
- Postlight Parser acepta una opción `contentType` con valores `html`, `markdown` o `text`, y también extrae metadatos como el autor y la fecha
- Los dos trabajan sobre una sola página: ninguno rastrea, y ninguno conoce el marcado particular de tu sitio salvo que lo extiendas

**¿Para quién es?** Para quien convierte páginas web y no archivos HTML sueltos. Extracción primero, conversión después, es la cadena que usa cualquier buen recortador, y montarla tú mismo lleva una tarde.

### MarkDownload — mejor extensión de navegador para la página que tienes delante

MarkDownload es una extensión de navegador que recorta la página actual como Markdown. Su implementación es la cadena recomendada en un solo paquete: Readability simplifica la página, y luego Turndown convierte lo que queda.

| A favor | En contra |
| --- | --- |
| Extracción y conversión en un clic | Solo convierte lo que está en el navegador, una página a la vez |
| Disponible para Firefox, Chrome, Edge y Safari | Depende de que el extractor adivine bien |
| Front matter y plantillas para el archivo guardado | Los permisos de la extensión son amplios por necesidad |
| Código abierto, así que las reglas de conversión se pueden inspeccionar | No es una cadena programable |

**Precio:** gratis, licencia Apache 2.0 (comprobado en github.com, el 8 de septiembre de 2026).

**Detalles técnicos**

- Usa Readability.js para simplificar la página y Turndown para convertir el HTML simplificado
- Opciones para el trato de imágenes, plantillas de front matter y el patrón de nombre de archivo
- Funciona desde la barra o desde un menú contextual sobre una selección, así que puedes recortar parte de una página
- Como corre después de que el navegador haya renderizado la página, el contenido añadido por JavaScript queda incluido — algo que un archivo `.html` guardado a menudo se pierde

**¿Para quién es?** Para quien lee en la web y guarda notas en archivos. Recortar la página ya renderizada también es la única forma práctica de capturar una página cuyo contenido no existe hasta que los scripts se han ejecutado.

### Obsidian Web Clipper — mejor si el Markdown va a una bóveda

El recortador propio de Obsidian guarda páginas web como notas Markdown, con plantillas que decidien el nombre de archivo, las propiedades y qué parte de la página se conserva. Usa defuddle para extracción y conversión en lugar de la combinación Readability más Turndown, y sanea el HTML por el camino.

| A favor | En contra |
| --- | --- |
| Plantillas por sitio, así que una receta y un artículo académico se recortan de forma distinta | Pensado para Obsidian; menos útil si tus notas viven en otro sitio |
| Extracción, conversión y saneado en una sola extensión | El comportamiento de extracción difiere del de Readability, para bien y para mal |
| Chrome, Firefox, Safari y Edge, más navegadores basados en Chromium | Las plantillas son un pequeño lenguaje propio que hay que aprender |
| Las propiedades se capturan como front matter, no se pierden | Una página a la vez |

**Precio:** gratis, licencia MIT, con marcas registradas y material de marketing excluidos de la licencia. Obsidian en sí es gratis de usar sin registro; una licencia comercial cuesta 50 dólares por usuario al año (comprobado en obsidian.md, el 8 de septiembre de 2026).

**Detalles técnicos**

- Usa defuddle para extraer el contenido y convertirlo a Markdown, y DOMPurify para sanear
- Las plantillas pueden fijar el título de la nota, la carpeta, las propiedades y el contenido, con reglas por sitio
- Se pueden recortar los resaltados o las selecciones en vez de la página entera
- El resultado es un archivo `.md` plano dentro de la carpeta de una bóveda, que es un directorio de archivos como cualquier otro

**¿Para quién es?** Para usuarios de Obsidian, claro está — pero también para quien quiera un recortador que escriba archivos planos en una carpeta. Si tus notas están en otro sitio y estás intentando sacarlas de ahí en lugar de meterlas, [el lado de exportación de Notion, Obsidian y Confluence es su propio problema](/blog/markdown-from-notion-obsidian-and-confluence).

### Notion Web Clipper — el que no te da Markdown

El recortador de Notion guarda una página web dentro de una página de Notion. Merece la pena incluirlo con precisión porque la gente lo usa esperando Markdown y recibe bloques de Notion, que es otra cosa que vive dentro de la base de datos de otro.

| A favor | En contra |
| --- | --- |
| Encaja bien si Notion ya es donde viven tus notas | El resultado son bloques de Notion, no un archivo Markdown |
| Buscable y compartible dentro de Notion de inmediato | Sacar Markdown de ahí exige un segundo paso: la propia exportación de Notion |
| Nada de archivos que gestionar | El Markdown exportado es la interpretación de Notion, no la de la página |
| Plan gratuito disponible | Ahora tienes dos conversiones entre la página y tu archivo |

**Precio:** Notion tiene un plan gratuito a 0 dólares por miembro al mes (comprobado en notion.com, el 8 de septiembre de 2026); el recortador viene incluido con la cuenta.

**¿Para quién es?** Para usuarios de Notion que guardan material de lectura. Si el objetivo es un archivo Markdown, recorta con algo que produzca uno, o convierte directamente el HTML guardado — pasar por Notion significa dos conversiones y dos ocasiones de perder las tablas.

### «Guardar página como» del navegador — el origen de casi todo el mal input

Guardar una página desde un navegador es como nacen la mayoría de los archivos HTML que necesitan conversión, y vale la pena entender qué obtienes. «Página web, completa» te da el marcado más una carpeta de recursos. «Página web, solo HTML» te da el marcado tal como se entregó, que en un sitio moderno puede ser un documento casi vacío más un script que habría construido la página. Ninguna de las dos opciones es el artículo.

| A favor | En contra |
| --- | --- |
| Siempre disponible, sin instalar nada, sin extensión | Guarda la página entera, mobiliario incluido |
| Captura la página como era, con marca de tiempo y todo | «Solo HTML» puede perder el contenido añadido por JavaScript |
| Funciona en páginas detrás de una sesión ya iniciada | Las carpetas de recursos hacen que los enlaces relativos apunten a tu disco |

**Precio:** gratis.

**¿Para quién es?** Para quien necesite el HTML en disco por otras razones. Como primer paso de una conversión funciona, siempre que sepas que el conversor va a convertir todo lo que guardaste — que es el tema de la sección siguiente.

## Lo que HTML no sobrevive convertido a Markdown

Todas las herramientas de arriba van a producir Markdown a partir de tu HTML. Ninguna puede producir Markdown que signifique lo mismo, porque Markdown no tiene el vocabulario. Esto es lo que se pierde, y lo que cuesta.

**El diseño visual.** Markdown no tiene columnas, ni flotantes, ni anchos, ni ningún orden que no sea el orden del texto. Una comparación en dos columnas montada con una cuadrícula se convierte en una columna detrás de otra: primero todo lo de la izquierda, luego todo lo de la derecha. Las palabras siguen ahí y la relación entre ellas ha desaparecido. Si el diseño llevaba el significado —un antes y un después, un cara a cara entre dos opciones— el Markdown no es una copia con pérdida, es una copia equivocada, y ninguna opción del conversor lo arregla.

**Clases, ids y estilos en línea.** Estos desaparecen, y así debe ser: Markdown no tiene estilo. Pero a menudo son lo único que marca un aviso, una advertencia, una nota obsoleta o una cita destacada. Un HTML que dice `<div class="warning">` se convierte en un párrafo corriente, y el lector pierde la señal de que ese párrafo es el que importa. Un conversor con reglas por elemento —Turndown, markdownify, la biblioteca de Go— se puede configurar para convertir una clase conocida en una cita en bloque o un prefijo en negrita. Eso es una regla por clase, que escribes tú, por sitio.

**Tablas anidadas y celdas combinadas.** Las tablas GFM son una cuadrícula de celdas planas: sin `rowspan`, sin `colspan`, sin contenido de bloque, y desde luego sin una tabla dentro de una celda. El plugin de tablas de la biblioteca de Go maneja las celdas combinadas expandiéndolas, que es la mejor respuesta disponible y sigue sin ser el original. Una tabla anidada dentro de una celda no tiene representación posible, y los conversores, según el caso, la aplanan, la descartan o dejan HTML `<table>` en bruto en medio de tu Markdown. Las tablas son lo más habitual que se pierde en cualquier dirección de esta conversión, y [cómo se rompen las tablas al convertir](/blog/markdown-tables-that-survive-conversion) merece la pena conocerlo antes de convertir un documento que depende de una.

**Cualquier cosa interactiva.** Formularios, botones, elementos `<details>`, pestañas, acordeones, reproductores incrustados, canvas, SVG. Markdown puede llevar un enlace a una cosa pero no la cosa misma. Los conversores se diferencian en si descartan esto o incrustan HTML en bruto, y HTML en bruto dentro de Markdown es una decisión con consecuencias: sobrevive si el siguiente visor permite HTML en bruto, y se escapa en una sopa de etiquetas visible si no lo permite.

**Las URL relativas.** Este fallo es silencioso y se nota semanas después. Una página escrita con `src="/img/diagram.png"` se convierte a Markdown con exactamente esa ruta, y esa ruta ahora se resuelve contra donde sea que termine el Markdown, que no es el sitio original. Cada imagen y la mitad de los enlaces apuntan a la nada. Algunas herramientas reescriben las URL relativas como absolutas usando la dirección de la página; una biblioteca sin más que convierte un archivo en disco no tiene ninguna dirección de la que partir. Comprueba los tres primeros enlaces de cualquier página convertida, porque [que los enlaces y las imágenes sigan funcionando tras la conversión](/blog/images-and-links-that-still-work) no pasa por accidente.

**El código, a veces.** Un bloque `<pre><code>` casi siempre se convierte limpio. Un bloque de código cuyo resaltado son elementos `<span>` por cada token —que es lo que produce cualquier resaltador de sintaxis— se convierte en un bloque con cerca si el conversor es sensato, y en un desastre de caracteres sueltos si no lo es. El lenguaje suele estar en un nombre de clase como `language-python`, y un conversor que lo lee te da una cerca anotada, mientras que uno que no lo hace te da una cerca sin marcar y pierde el resaltado por el camino. [Lo que de verdad sobrevive en un bloque de código](/blog/code-blocks-in-markdown) es lo que se puede comprobar: convierte uno y mira el resultado.

**Y la diferencia entre una página y un artículo.** Este es el coste real, y no es un problema de sintaxis. Convertir un artículo limpio —una página de documentación, un capítulo exportado, un fragmento escrito a mano— es un problema resuelto, y cualquier herramienta de aquí lo hace bien. Convertir una página entera es otro trabajo. Una página de noticias guardada contiene una cabecera, una barra de navegación, un aviso de cookies, un aviso de suscripción, una lista de artículos relacionados, una sección de comentarios, un pie con sesenta enlaces y un aviso legal. Pásala por un conversor sin más y obtienes todo eso convertido a Markdown, en el orden en que se lee, con el artículo en algún punto de en medio. La conversión es correcta y el resultado es inútil.

Los costes de equivocarse aquí son concretos. Si conviertes para que lo lea una persona, no lo va a leer, y va a culpar a la herramienta en lugar del paso de extracción que faltaba. Si conviertes para un índice de búsqueda o un modelo, acabas de indexar el mismo menú de navegación una vez por página, que desplaza al contenido que querías guardar de verdad. Y si conviertes muchas páginas, descubres el problema a escala: mil documentos, cada uno empezando por las mismas cuarenta líneas. La solución es siempre la misma y siempre va al principio — o un extractor antes del conversor, o una herramienta que quita el mobiliario estructural, o un selector que nombre el elemento que de verdad quieres. Decidir eso después significa convertirlo todo dos veces.

## Cómo elegir

1. **Pregúntate si tu entrada es una página o un fragmento.** Un fragmento necesita un conversor. Una página entera necesita extracción primero, o el conversor va a traducir con toda fidelidad el aviso de cookies y vas a acabar editando a mano durante una hora.
2. **Convierte un archivo representativo antes de decidirte por nada.** No el más simple — el que tiene la tabla, el bloque de código y el aviso destacado. La herramienta que conserve esos tres conserva casi todo lo demás, y lo sabrás en un minuto en vez de después de doscientos documentos.
3. **Decide qué pasa con lo que Markdown no puede expresar.** Descartado, conservado como HTML en bruto, o aproximado: elígelo a propósito. Si el Markdown va a un sitio que escapa el HTML en bruto, conservarlo es lo mismo que corromperlo.
4. **Cuenta las instalaciones frente al número de conversiones.** Un archivo no justifica un gestor de paquetes, un runtime y un árbol de dependencias. Un trabajo nocturno no justifica una pestaña de navegador y una persona pendiente de ella.
5. **Comprueba a dónde va el archivo.** Un conversor online que sube el archivo tiene ahora tu documento, lo que es irrelevante para una página pública y la pregunta entera para una interna. La conversión en el navegador se puede verificar: abre el panel de red y observa que no pasa nada.
6. **Mira los enlaces y las imágenes del resultado, no solo el texto.** Que las URL relativas se conviertan en URL relativas es el fallo que parece un éxito, y solo se nota cuando alguien más abre el archivo en otro sitio.

## Conclusión

El mejor conversor de HTML a Markdown es el que hace bien la extracción —[el cómo hacerlo recorre cada punto de partida](/blog/convert-html-to-markdown)— porque la traducción es casi una comodidad y la extracción es de donde viene cualquier resultado decepcionante. Para una página que estás viendo, recórtala con una extensión que corra un extractor primero. Para un archivo que ya tienes, [la conversión de HTML a Markdown de TransformPipe](/html-to-markdown) quita el mobiliario de la página, conserva las tablas, los bloques de código y las listas de tareas, y lo hace en tu navegador sin subir nada y sin instalar nada. Para una compilación o un script, toma la biblioteca de tu lenguaje —Turndown, markdownify, node-html-markdown, la CLI de Go, [comparadas lado a lado en reglas, tablas, bloques de código y espacios en blanco](/blog/turndown-and-html-to-markdown-libraries)— y acepta que el diseño, el estilo y las tablas anidadas no van a venir contigo. Esa pérdida no es un fallo de la herramienta. Es la definición de Markdown, y la razón por la que el archivo se puede leer al otro lado.

## Preguntas frecuentes

### ¿Cuál es el mejor conversor gratuito de HTML a Markdown?

Para un solo archivo, un conversor de navegador es la mejor opción gratuita: sin instalar nada, sin subir nada, y Markdown de vuelta en un segundo, sin coste. Para código, Turndown en JavaScript, markdownify en Python y la CLI html-to-markdown de Go son todos gratuitos y licencia MIT, y Pandoc es gratuito bajo la GPL.

### ¿Cómo convierto una página web entera a Markdown?

Usa un recortador, no un conversor. Una extensión de navegador como MarkDownload o el Obsidian Web Clipper ejecuta primero un extractor sobre la página ya renderizada, lo que descarta la navegación y los avisos, y solo entonces convierte lo que queda. Guardar la página como `.html` y convertir el archivo te da la página entera, mobiliario incluido.

### ¿Por qué mi Markdown convertido está lleno de enlaces de navegación?

Porque convertiste la página en lugar del artículo. Los conversores sin más traducen cualquier elemento que les den, y una página guardada casi nunca es solo el artículo. O extraes primero el contenido con algo como Readability, o usas una herramienta que quita elementos estructurales —cabeceras, navegación, pies, scripts— antes de convertir.

### ¿Los conversores de HTML a Markdown conservan las tablas?

Algunos sí, otros necesitan un plugin, y ninguno conserva una complicada. Turndown necesita `turndown-plugin-gfm` para las tablas; node-html-markdown, html-to-md y la biblioteca de Go las manejan directamente. Ningún conversor puede conservar fielmente una tabla anidada o una celda combinada, porque las tablas GFM son una cuadrícula plana de celdas simples.

### ¿Puedo convertir HTML a Markdown desde la línea de comandos?

Sí. Pandoc lee HTML y escribe GFM, html2text es una CLI de Python, y html-to-markdown de Go trae un binario instalable `html2markdown` que lee la entrada estándar. Para un trabajo dentro de CI, un conversor con API REST o una GitHub Action quita la instalación de encima del runner por completo.

### ¿Qué pasa con el CSS y los estilos en línea?

Se descartan, porque Markdown no tiene estilo. Eso suele ser lo que quieres, y de vez en cuando es una pérdida real: un nombre de clase suele ser la única marca que distingue un aviso, una nota destacada o una cita de un párrafo corriente. Los conversores con reglas por elemento pueden mapear una clase conocida a una cita en bloque o a un prefijo en negrita, pero esa regla la escribes tú.

### ¿Es seguro convertir un archivo HTML que me mandó otra persona?

Convertir es seguro en el sentido de que el resultado es Markdown, que es texto. Los riesgos están en otro sitio: abrir el HTML en un navegador primero ejecuta lo que sea que contenga, y Markdown puede llevar HTML en bruto hasta el siguiente visor si el conversor lo deja pasar. Convierte sin abrir, y comprueba si tu conversor quita el `<script>` o lo conserva.
