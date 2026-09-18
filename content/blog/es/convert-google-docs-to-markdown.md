---
title: "Cómo convertir Google Docs a Markdown: todas las rutas y qué cuesta cada una"
description: Google Docs ya exporta Markdown por sí solo. Qué conserva Descargar como Markdown, cuándo conviene la ruta .docx, y qué funciones de Docs no tienen hueco en Markdown
date: 2026-09-04
tag: Conversión
keywords: convertir google docs a markdown, exportar google docs a markdown, google docs a markdown, pasar un documento de google a markdown, descargar documento de google como md, complemento docs to markdown, google docs a markdown con imágenes
---

Un Google Doc no es un archivo. Es un modelo de documento que vive en los servidores de Google, y cualquier forma de sacarlo a tu disco es una exportación — un renderizado con pérdidas de ese modelo hacia otra forma cualquiera. Markdown es la forma más pequeña del menú. Tiene seis niveles de encabezado, énfasis, listas, enlaces, código y, si tienes suerte con el motor, tablas. Todo lo demás en tu documento tiene que descartarse, aplanarse o simularse.

La mayoría de las veces esto es exactamente lo que quieres. Escribiste el borrador donde estaban los comentarios y los colaboradores, y ahora necesita vivir en un repositorio, un sitio estático o un wiki, como texto que un diff pueda leer. La dificultad es que las pérdidas son silenciosas. Descargas el `.md`, echas un vistazo a la primera pantalla, ves tus encabezados, y solo tres semanas después notas que la tabla del apéndice perdió su encabezado combinado, que las imágenes no están, y que los catorce comentarios sin resolver — la razón por la que a alguien le importaba este documento — nunca existieron en la exportación.

Hay cinco rutas de salida, y cada una pierde cosas distintas. La exportación nativa a Markdown, la descarga en `.docx` convertida después, la descarga en HTML comprimido, un complemento que corre dentro de Docs, y el portapapeles. Este artículo trata sobre cuál usar, y sobre las funciones concretas de Google Docs que ninguna ruta puede llevarse, porque Markdown no tiene sintaxis para ellas.

### Resumen rápido

Si el documento es texto — encabezados, párrafos, listas, enlaces, algo de énfasis — usa la exportación nativa: **Archivo → Descargar → Markdown (.md)**, que Google añadió junto con la importación de Markdown, Copiar como Markdown y Pegar desde Markdown (comprobado en workspaceupdates.googleblog.com, el 8 de septiembre de 2026). Si tiene imágenes, tablas con celdas combinadas o notas al pie que necesitas conservar, descárgalo como **`.docx` y convierte eso**, o como **HTML comprimido**, porque las dos llevan estructura que la exportación `.md` no tiene dónde poner. Los comentarios, las sugerencias, los saltos de página, los encabezados y pies de página y los dibujos no se pierden por culpa de un mal conversor — Markdown simplemente no tiene sintaxis para ninguno de ellos, así que resuelve los comentarios y acepta las sugerencias antes de exportar nada.

## Por qué sacar Markdown de un Google Doc es más complicado de lo que parece

La incomodidad empieza por dónde vive realmente el contenido. El texto de un Google Doc está en un sitio, sus comentarios en otro, y sus sugerencias de edición en un tercero. No es una metáfora: los comentarios y sus respuestas son recursos separados en la API de Drive, no forman parte del cuerpo del documento, y cada comentario está o bien anclado a una región de una revisión concreta, o bien sin anclar y pegado al archivo entero (comprobado en developers.google.com, el 8 de septiembre de 2026). Las sugerencias se guardan dentro del documento pero como una capa paralela, por lo que leer un documento mediante programación te obliga a elegir un modo de vista — el modo `SUGGESTIONS_INLINE` de la API es el único cuyos índices puedes usar para una edición posterior, y `PREVIEW_SUGGESTIONS_ACCEPTED` te entrega el texto como se leería si se aceptara cada sugerencia (comprobado en developers.google.com, el 8 de septiembre de 2026).

Una exportación tiene que elegir una capa y descartar las demás. Elige el cuerpo del texto. Así que la conversación de revisión — que es la parte de un Google Doc donde Word, Markdown y todo lo demás están peor — desaparece antes incluso de que empiece la conversión. Ninguna herramienta de esta página puede cambiar eso, y cualquiera que afirme conservar tus comentarios o los está metiendo en un archivo aparte o está describiendo otra cosa.

El segundo problema es que Markdown no es un único destino. El CommonMark puro no tiene tablas, ni tachado, ni listas de tareas; GitHub Flavored Markdown añade los tres; las notas al pie no están en ninguna de las dos especificaciones y existen solo como extensión. Así que «¿conserva las tablas?» es en parte una pregunta sobre el exportador y en parte una pregunta sobre qué motor escribe, y las dos se confunden en cada comparativa que vas a leer. La propia página de ayuda de Google describe la sintaxis que maneja en Docs como encabezados en seis niveles, cursiva, negrita, negrita-y-cursiva, tachado y enlaces (comprobado en support.google.com, el 8 de septiembre de 2026) — una lista corta, y una descripción justa de las ambiciones de la exportación nativa.

El tercer problema son las imágenes. Un archivo `.md` es un único archivo de texto. No hay ninguna carpeta al lado, ningún archivo comprimido alrededor, y la sintaxis de imagen de Markdown es una ruta o una URL — guarda una referencia, nunca los bytes. Cualquier exportación de Markdown en un solo archivo tiene entonces que elegir entre apuntar a algún sitio donde la imagen siga viviendo, incluirla como un blob codificado, o dejar un hueco. Ninguna de esas tres opciones es lo que querías, y por eso el documento cargado de imágenes es el caso en el que la exportación nativa deja de ser la respuesta correcta. [Las rutas relativas y qué se rompe cuando el archivo se muda](/blog/images-and-links-that-still-work) es la versión general de este problema, y se aplica con toda su fuerza en el momento en que un Google Doc se convierte en un `.md` dentro de un repositorio.

## Comparativa rápida: la chuleta

| Ruta | Mejor para | Qué conserva | Qué pierde | Precio |
| --- | --- | --- | --- | --- |
| Archivo → Descargar → Markdown (.md) | Un documento de texto, ahora mismo | Encabezados, listas, enlaces, énfasis, tachado, tablas simples | Imágenes como archivos, comentarios, sugerencias, maquetación de página | Gratis con una cuenta de Google |
| Archivo → Descargar → Word (.docx), y luego convertir | Imágenes, tablas complejas, lotes, cualquier cosa programada | Lo que conserve el segundo conversor; las imágenes como archivos de verdad | Comentarios y sugerencias siguen desapareciendo | Gratis; el conversor puede necesitar instalación |
| Archivo → Descargar → Página web (.html, comprimido) | Documentos donde las imágenes son lo que más importa | Estructura HTML completa más una carpeta de imágenes | Todo lo que Markdown quería, pero conviertes dos veces | Gratis con una cuenta de Google |
| Complemento Docs to Markdown | Convertir parte de un documento | Notas al pie, celdas de tabla combinadas, estructura de encabezados | Las imágenes pasan a ser rutas de marcador que hay que rellenar | Gratis, Apache 2.0 |
| Copiar como Markdown (clic derecho) | Unos pocos párrafos | Formato en línea y enlaces | Todo lo que no esté seleccionado; las imágenes | Gratis, desactivado por defecto |
| Copiar y pegar en un editor de Markdown | Una sección, en una herramienta que ya usas | Lo que entienda el manejador de pegado del editor de destino | Varía enormemente según el editor | Gratis |
| API de Docs + Apps Script | Muchos documentos, según un calendario | Todo lo que programes para conservar | Todo lo que no programes para conservar | Gratis; lo escribes tú |
| Exportación de la API de Drive a `text/markdown` | Automatizar la exportación nativa | Lo mismo que Archivo → Descargar | Lo mismo que Archivo → Descargar | Gratis; se aplica cuota de la API |

## La exportación nativa a Markdown, y lo que conserva de verdad

Google Docs exporta Markdown por sí mismo. La ruta es Archivo → Descargar → Markdown (.md), y llega con tres compañeros: la importación de Markdown, de forma que un `.md` abierto con Archivo → Abrir se convierte en un Doc; Copiar como Markdown en el menú del clic derecho para una selección; y Pegar desde Markdown para el viaje de vuelta (comprobado en support.google.com, el 8 de septiembre de 2026). La importación y la exportación están activadas por defecto. El par de copiar y pegar está desactivado por defecto, y se encuentra en Herramientas → Preferencias → Activar Markdown (comprobado en workspaceupdates.googleblog.com, el 8 de septiembre de 2026). Si Copiar como Markdown no aparece en tu menú contextual, esa es la razón.

La misma exportación está disponible desde código. Los archivos de Google Docs se pueden exportar mediante la API de Drive a nueve tipos MIME — `.docx`, `.odt`, `.rtf`, `.pdf`, `text/plain`, `text/html`, HTML comprimido, EPUB y `text/markdown` (comprobado en developers.google.com, el 8 de septiembre de 2026). Ese último es la exportación nativa por otra puerta, algo que importa si quieres el mismo resultado sin que nadie pulse un menú.

| A favor | En contra |
| --- | --- |
| Sin instalación, sin complemento, sin terceros de por medio | Las imágenes son el punto débil: un `.md` no tiene ninguna carpeta donde ponerlas |
| Todo el documento en una sola acción | Nada se puede seleccionar — es el documento entero o nada |
| Va y viene: importar un `.md` de vuelta a Docs lo convierte otra vez en un Doc | Los comentarios y las sugerencias están ausentes, sin aviso de que existieron |
| Programable mediante la API de Drive con el tipo de exportación `text/markdown` | Ninguna opción en absoluto: sin elegir motor, sin directorio de imágenes, sin front matter |
| Gratis con la cuenta que ya tienes | La maquetación de página, los encabezados y pies de página y los saltos de sección no tienen dónde ir |

**Precio:** gratis con una cuenta de Google.

**Detalles técnicos y funciones**

- Archivo → Descargar → Markdown (.md) para el documento entero; el archivo es texto UTF-8 plano
- Clic derecho → Copiar como Markdown para una selección, una vez marcada la casilla Herramientas → Preferencias → Activar Markdown
- Clic derecho → Pegar desde Markdown convierte el Markdown del portapapeles en formato de Docs
- Archivo → Abrir → Subir, o Drive → Abrir con → Google Docs, importa un archivo `.md` como un Doc
- La API de Drive expone la misma conversión como el tipo MIME de exportación `text/markdown`

**¿Para quién es?** Para cualquiera cuyo documento sea genuinamente texto. Una nota de reunión, una especificación, un borrador de blog, un README que se escribió en Docs porque ahí estaban los revisores. Si puedes desplazarte por todo el documento y no ver más que encabezados, párrafos, listas, enlaces y alguna tabla ocasional, esta es la ruta, y todo lo de más abajo es trabajo innecesario.

## Descargar como .docx, y luego convertir el .docx

La otra ruta es dejar que Google produzca un `.docx` y entregárselo a un conversor hecho para el trabajo. Suena al camino largo y con frecuencia es mejor, por una razón: un `.docx` es un archivo zip con una carpeta `media` dentro, así que las imágenes sobreviven al primer tramo del viaje como archivos de verdad. El segundo tramo ya tiene dónde ponerlas.

Esto también abre la puerta a cada opción que la exportación nativa no tiene. El lector de `.docx` de Pandoc acepta `--extract-media` para escribir las imágenes incrustadas en un directorio y reescribir los enlaces para que coincidan, y `--track-changes` con `accept`, `reject` o `all` para decidir qué pasa con las marcas de revisión — la única respuesta documentada a los cambios rastreados en esta página. Es gratis y con licencia GPL, escrito en Haskell, y hace falta instalarlo. Un conversor de navegador hace el mismo primer paso sin ninguna instalación: lee el `.docx` en tu propia máquina y te devuelve Markdown, que es lo que hace [la conversión de Word a Markdown de TransformPipe](/word-to-markdown), y lo que hace con distinto cuidado [el campo más amplio de conversores de `.docx`](/blog/best-word-to-markdown-converters).

| A favor | En contra |
| --- | --- |
| Las imágenes llegan como archivos de verdad dentro del archivo comprimido, así que un conversor puede extraerlas | Dos conversiones en vez de una, y dos ocasiones de perder algo |
| Opciones de verdad: extracción de imágenes, elección de motor, manejo de tablas | El `.docx` es un archivo intermedio del que hay que llevar la cuenta |
| Programable y por lotes — un directorio de archivos `.docx` es un bucle de shell | El escritor de `.docx` de Google tiene sus propias rarezas que heredar |
| Funciona con las herramientas que ya tiene tu proceso de compilación | Los comentarios y las sugerencias siguen desapareciendo: Google los descartó en la descarga |
| Elige tú el conversor, así que eliges sus concesiones | Más pasos que explicarle a alguien que solo quiere el texto |

**Precio:** gratis. Pandoc es gratis y tiene licencia GPL; un conversor del lado del navegador no cuesta nada y no necesita instalación.

**Detalles técnicos y funciones**

- Archivo → Descargar → Microsoft Word (.docx) produce un archivo estándar de Office Open XML
- Los encabezados sobreviven como párrafos que llevan una referencia `w:pStyle`, que es lo que buscan los conversores
- `pandoc --from docx --to gfm --extract-media=./media informe.docx -o informe.md` escribe las imágenes fuera, junto al texto
- `--track-changes=accept` resuelve las marcas de revisión al texto aceptado en vez de dejar marcado en la prosa
- Un `.docx` también se abre en Word, LibreOffice y cualquier otra cosa, lo que lo convierte en un punto de control útil

**¿Para quién es?** Para cualquiera con imágenes, cualquiera que convierta más de un documento, y cualquiera que necesite que la salida cumpla un objetivo concreto — un sitio de documentación con un directorio de imágenes estricto, un repositorio con un linter, un wiki que solo acepta CommonMark. También para cualquiera que quiera inspeccionar el paso intermedio: si el Markdown está mal, puedes abrir el `.docx` y ver si el problema fue la exportación de Google o tu conversor.

## Descargar como HTML comprimido cuando las imágenes son lo que más importa

Archivo → Descargar → Página web (.html, comprimido) te da un archivo con el documento como HTML y sus imágenes como archivos separados en una carpeta. Es la exportación de mayor fidelidad que ofrece Google del documento visible, y es a la que recurrir cuando las imágenes son lo importante — una revisión de diseño, un manual lleno de capturas de pantalla, un informe con gráficos pegados.

Entonces tienes un problema de HTML a Markdown, que está muy bien resuelto. [Los conversores de HTML a Markdown](/blog/best-html-to-markdown-converters) manejan todos los elementos estructurales; el trabajo está en descartar los estilos en línea de Google, que son abundantes, y en arreglar las rutas de las imágenes para que apunten a donde terminaron.

| A favor | En contra |
| --- | --- |
| Las imágenes salen como archivos en una carpeta, con nombre y completas | El HTML de Google es pesado, lleno de estilos en línea y nombres de clase generados |
| El HTML tiene un elemento para casi todo lo que Docs puede expresar | Dos conversiones, y la segunda necesita configuración |
| Las tablas llegan como marcado `<table>` de verdad, celdas combinadas incluidas | Los nombres de archivo de las imágenes son de Google, no tuyos, y las rutas hay que reescribirlas |
| Fácil de inspeccionar: abre el HTML en un navegador y ve exactamente qué tienes | El zip es un contenedor que descomprimir, un paso más en un script |

**Precio:** gratis con una cuenta de Google.

**Detalles técnicos y funciones**

- El archivo contiene un `.html` y un directorio de imágenes
- Disponible mediante la API de Drive como el tipo de exportación HTML comprimido, además de desde el menú
- Los elementos de encabezado son etiquetas `<h1>`–`<h6>` de verdad, así que la estructura de encabezados se convierte con limpieza
- Las tablas son tablas HTML, lo que significa que `colspan` y `rowspan` sobreviven hasta el HTML — [lo que les pasa después](/blog/markdown-tables-that-survive-conversion) depende por completo del motor de Markdown al que estés convirtiendo
- Los atributos de estilo van en línea en casi todos los elementos y se pueden descartar sin miedo en bloque

**¿Para quién es?** Para documentos cargados de capturas de pantalla, y para cualquiera que quiera ver qué cree Google que contiene el documento antes de decidir qué conservar. El HTML es verboso y es honesto: lo que hay en el archivo es lo que había en el documento.

## Las rutas que no pasan por Archivo → Descargar

Tres salidas que nunca tocan el menú de descarga. Existen porque a veces quieres una parte de un documento, o lo quieres ahora, o lo quieres para doscientos documentos sin que nadie tenga que estar mirando.

### Docs to Markdown, el complemento

Docs to Markdown, conocido por el nombre de su repositorio gd2md-html, es un complemento de Google Docs que se abre como una barra lateral y convierte el documento — o solo la selección — a Markdown o a HTML. Es gratis y con licencia Apache 2.0, se instala desde el Google Workspace Marketplace, y solo pide dos permisos: acceso al documento actual, y permiso para crear una barra lateral (comprobado en github.com/evbacher/gd2md-html, el 8 de septiembre de 2026).

Es más cuidadoso con la estructura del documento que la exportación nativa, y sorprendentemente honesto sobre sus límites. Las notas al pie se convierten en notas al pie de Markdown estándar. Las tablas se convierten en tablas HTML incluso dentro de la salida Markdown, que es como conserva las filas y columnas combinadas; una tabla de una sola celda se convierte en un bloque de código. Las imágenes se convierten en rutas de marcador con la forma `images/image1.png`, y la documentación dice sin rodeos que hay que mover las imágenes a tu propio servidor y cambiar las rutas — y avisa de que el orden de las imágenes en el zip no siempre coincide con el orden en que aparecen en el documento, así que revisa todas. Las ecuaciones lanzan un aviso en rojo que sugiere MathJax o LaTeX si tu plataforma de publicación los admite. Y, como con cualquier conversor de `.docx` y de Docs, los encabezados solo se convierten si son estilos de encabezado de verdad: un texto que simplemente está en negrita y a 18 puntos se convierte como un párrafo normal.

| A favor | En contra |
| --- | --- |
| Convierte una selección, algo que Archivo → Descargar no puede | Solo para Google Docs, y hay que instalarlo |
| Las notas al pie y las celdas de tabla combinadas sobreviven | Las celdas combinadas sobreviven como HTML dentro de tu Markdown, que no todo renderizador acepta |
| Avisa de lo que no pudo convertir en vez de fallar en silencio | Las imágenes son marcadores: sigues teniendo que aportar los archivos |
| Gratis y de código abierto, con un alcance de permisos reducido | Un documento a la vez, en una barra lateral |

**Precio:** gratis, con licencia Apache 2.0.

**¿Para quién es?** Para gente que publica desde Docs con regularidad, sobre todo hacia una plataforma que quiere notas al pie. También para cualquiera que necesite una sección de un documento largo en lugar del documento entero — solo por eso vale la pena instalarlo.

### Copiar y pegar, a través del portapapeles HTML

Copiar desde un Google Doc pone dos cosas en el portapapeles: texto plano y un formato HTML. El formato HTML lleva la estructura — encabezados como elementos de encabezado, listas como listas, enlaces como anclas, negrita como `<b>` o como un estilo. Un editor con un manejador de pegado que lea ese formato y lo convierta puede transformar una selección pegada en Markdown sin que ningún archivo salga a ninguna parte.

Esto funciona mucho mejor de lo que debería, y es la ruta más rápida que existe para unos pocos párrafos. Donde falla es previsible. Los editores se diferencian enormemente en lo que entienden sus manejadores de pegado: algunos convierten encabezados, listas y enlaces y descartan todo lo demás; algunos pegan el formato de texto plano y pierden toda la estructura; algunos pegan HTML crudo dentro de tu archivo Markdown. Las imágenes nunca pasan como archivos — en el mejor caso obtienes una referencia a una URL de Google que solo funciona mientras tienes la sesión iniciada, y en el peor, nada. Y el HTML de Google pone estilos en línea en casi todo, así que un manejador ingenuo produce Markdown lleno de etiquetas `<span>`.

| A favor | En contra |
| --- | --- |
| Instantáneo, sin descarga y sin instalación | El comportamiento depende por completo del editor de destino |
| Conserva el formato en línea y los enlaces sorprendentemente bien | Las imágenes nunca pasan como archivos |
| Funciona con una selección de cualquier tamaño, hasta un solo párrafo | Los documentos largos son tediosos y fáciles de estropear |
| Copiar como Markdown hace la conversión en el propio Docs, si está activado | Los estilos en línea de Google se filtran a través de manejadores de pegado débiles |

**Precio:** gratis. Copiar como Markdown necesita antes marcar Herramientas → Preferencias → Activar Markdown.

**¿Para quién es?** Para cualquiera que mueva una sección, no un documento. Si estás pegando más de unas pocas pantallas, estás haciendo a mano lo que Archivo → Descargar hace en una sola acción.

### Las API de Docs y Drive, para muchos documentos

Si la respuesta tiene que funcionar sin que nadie esté mirando, hay dos niveles. El de bajo esfuerzo es el punto de exportación de la API de Drive con el tipo MIME `text/markdown`: obtienes exactamente la exportación nativa, para cualquier documento que puedas leer, dentro de un script. Eso basta para la mayoría de la automatización, y hereda cada limitación de la exportación nativa.

El de alto esfuerzo es la API de Docs, que te entrega el documento como JSON estructurado — un cuerpo de elementos estructurales, párrafos que llevan estilos con nombre, tablas como filas de celdas, listas resueltas contra propiedades de lista. Entonces tú mismo escribes el Markdown, lo que significa que decides en qué se convierte un salto de página, qué pasa con un chip inteligente, si una sugerencia se acepta o se rechaza, y a dónde van las imágenes. Es trabajo de verdad, y es la única ruta en la que las pérdidas son decisión tuya y no valores por defecto de otra persona.

| A favor | En contra |
| --- | --- |
| Corre según un calendario, sobre cualquier cantidad de documentos | Estás escribiendo y manteniendo un conversor |
| La API de Docs expone el estado de las sugerencias, así que puedes elegir aceptar o rechazar | Ámbitos OAuth, cuotas y credenciales que gestionar |
| Controlas por completo la estrategia de imágenes | Cada función de Docs que olvidas es un fallo silencioso |
| Los comentarios son accesibles mediante la API de Drive, hacia un archivo separado | Nada de esto es rápido |

**Precio:** gratis; se aplican cuotas de la API.

**¿Para quién es?** Para equipos cuya documentación vive de verdad en Docs y tiene que aparecer de forma continua en un repositorio o un sitio. Si eso es una migración puntual de treinta documentos, la ruta `.docx` y un bucle de shell te ganan por mucho a escribir todo esto.

## Lo que tiene Google Docs y para lo que Markdown no tiene sintaxis

Esta es la parte que ninguna exportación puede arreglar, y la que conviene leer antes de culpar a un conversor. Lo que sigue no son fallos de conversión. Son funciones sin equivalente en Markdown, así que cada herramienta o las descarta, o las aplana en otra cosa, o emite HTML y confía en que tu renderizador lo permita.

| Función de Google Docs | Equivalente más cercano en Markdown | Qué pasa en realidad |
| --- | --- | --- |
| Comentarios y respuestas | Ninguno | Se descartan. Son recursos de Drive separados, no contenido del documento |
| Sugerencias de edición | Ninguno | Se aplanan a una sola versión del texto, normalmente con las sugerencias aceptadas |
| Saltos de página | Un separador temático, `---` | Una línea horizontal en una página que ya no tiene páginas, o nada en absoluto |
| Encabezados y pies de página | Ninguno | Se descartan, números de página incluidos |
| Saltos de sección y columnas | Ninguno | Se descartan; el texto a varias columnas se convierte en una sola columna, en orden de lectura |
| Dibujos y gráficos insertados | Una referencia de imagen | Una imagen en el mejor caso, un hueco en el peor; nunca vuelve a ser editable |
| Chips inteligentes (personas, fechas, archivos) | Texto plano o un enlace | Reducidos a su etiqueta, o a un enlace que solo pueden abrir los colegas |
| Ecuaciones | Ninguno en CommonMark ni en GFM | Se descartan, o se emiten como LaTeX si tu plataforma lo renderiza |
| Índice | Una lista de enlaces escrita a mano | Una fotografía estática que deja de coincidir en cuanto editas un encabezado |
| Marcadores y enlaces internos | Anclas de encabezado | Rotos salvo que las reglas de slug de tu renderizador coincidan con las anclas de la exportación |
| Notas al pie | Una extensión, en ninguna especificación | Depende por completo de la herramienta y del renderizador del otro extremo |
| Fuentes, colores, espaciado, márgenes | Ninguno | Se descartan, que suele ser la razón por la que querías Markdown |

Tres de esas filas merecen decirse en voz alta.

**Los comentarios son la pérdida más grande y la menos visible.** Un Google Doc que ha pasado por una revisión real es mitad cuerpo de texto y mitad conversación al margen, y la conversación al margen es donde se tomaron las decisiones. Expórtalo y te quedas con la mitad que una máquina puede comparar. Si esos hilos importan, resuélvelos primero, o copia los que importan dentro del cuerpo del documento como texto antes de exportar. Ninguna ruta de esta página los conserva, y no hay ningún aviso cuando desaparecen.

**Las sugerencias hay que resolverlas antes de exportar, no después.** Un documento en modo sugerencias contiene dos lecturas de sí mismo. Una exportación elige una — normalmente la aceptada — y no vas a poder saber a partir del Markdown qué frases eran una propuesta de alguien y cuáles ya estaban acordadas. Acepta o rechaza todo, y luego exporta. Si no puedes, usa la ruta `.docx` con `--track-changes=all` de Pandoc, que al menos deja la información de revisión en la salida, donde la puedes ver.

**Los enlaces internos se rompen de una forma que no vas a notar.** Las anclas de encabezado en Markdown las genera lo que sea que renderice el archivo, con sus propias reglas de slug, y esas reglas difieren entre GitHub, un generador de sitios estáticos y un conversor del lado del navegador. Una referencia cruzada que funcionaba en Docs se convierte en un enlace a un ancla que no existe, y un enlace interno roto falla en silencio: la página simplemente no se mueve. Revisa cada enlace interno después de una conversión, o descártalos y usa los títulos de las secciones en la propia prosa en su lugar.

## Cómo elegir

1. **Mira el documento antes de elegir una ruta.** Recórrelo de principio a fin y cuenta imágenes, tablas con celdas combinadas, notas al pie, y cualquier cosa dibujada en vez de escrita. Cero en las cuatro cosas significa que la exportación nativa es la correcta y todo lo demás es esfuerzo perdido; una o más significa la ruta `.docx` o de HTML comprimido, porque la exportación nativa no tiene dónde ponerlas.
2. **Ocúpate primero de la capa de revisión.** Resuelve los comentarios, acepta o rechaza las sugerencias, y saca el documento del modo sugerencias. Hazlo después de exportar y estarás reconciliando dos documentos a mano; hazlo antes y la exportación simplemente sale bien.
3. **Decide dónde van a vivir las imágenes antes de convertir.** Un archivo Markdown guarda referencias, no fotografías, así que necesitas un directorio y una convención de rutas. `--extract-media` de Pandoc te elige uno; el complemento te da marcadores `images/image1.png` que rellenar; la exportación nativa no te da ninguno de los dos, y por eso el documento cargado de imágenes sale como `.docx` o como HTML comprimido.
4. **Haz coincidir el motor con el destino.** Si el destino solo renderiza CommonMark, tus tablas y tu tachado no van a aparecer, sin importar lo bien que se hayan convertido. Averigua qué admite la plataforma de destino, y convierte hacia eso, no hacia lo que escriba por defecto la herramienta.
5. **Convierte un documento representativo y léelo entero.** No la primera pantalla — el apéndice, las tablas, las notas al pie, los enlaces internos. Diez minutos con el peor documento que tengas te dicen más que cualquier comparativa, esta incluida, y es la única forma de atrapar lo que falló en silencio.
6. **Pregúntate si el documento debería quedarse en Docs.** Si lo revisa gente que nunca va a abrir una pull request, exportarlo a Markdown una vez al mes es una cinta de correr. Convierte lo que necesita vivir en el repositorio y deja el resto donde están los revisores.

## Conclusión

Sacar Markdown de Google Docs es ya un problema resuelto para el texto y uno sin resolver para todo lo demás. Archivo → Descargar → Markdown (.md) es gratis, nativo y correcto para un documento hecho de encabezados, párrafos, listas y enlaces; para imágenes, tablas combinadas y notas al pie, descarga el `.docx` o el HTML comprimido y conviértelo con una herramienta que tenga opciones — Pandoc si quieres un script, [una conversión de Word a Markdown](/word-to-markdown) del lado del navegador si lo quieres hecho ahora mismo sin que el archivo salga de tu máquina. Y trata los comentarios, las sugerencias, los saltos de página, los encabezados y pies de página y los dibujos como cosas que resuelves en Docs antes de exportar, porque ningún conversor puede llevárselos y los que afirman lo contrario están describiendo otra cosa. La misma advertencia vale para cualquier editor alojado: [lo que conserva una exportación de Notion, Obsidian o Confluence](/blog/markdown-from-notion-obsidian-and-confluence) es la misma pregunta con respuestas distintas.

## Preguntas frecuentes

### ¿Google Docs exporta Markdown de forma nativa?

Sí. Archivo → Descargar → Markdown (.md) escribe un archivo `.md`, y Archivo → Abrir importa uno de vuelta como un Doc; las dos cosas están activadas por defecto (comprobado en workspaceupdates.googleblog.com, el 8 de septiembre de 2026). Copiar como Markdown y Pegar desde Markdown también están disponibles en el menú del clic derecho, pero están desactivados hasta que marcas Herramientas → Preferencias → Activar Markdown.

### ¿Por qué faltan mis imágenes en el Markdown exportado?

Porque un archivo `.md` es un único archivo de texto sin ninguna carpeta al lado, y la sintaxis de imagen de Markdown guarda una ruta, no la imagen. Para conseguir las imágenes como archivos de verdad, descarga el documento como `.docx` y convértelo con algo que extraiga los medios, o descárgalo como HTML comprimido, que llega con un directorio de imágenes dentro del archivo.

### ¿Pasan los comentarios y las sugerencias?

No, por ninguna ruta. Los comentarios y sus respuestas se guardan como recursos de Drive separados en vez de como contenido del documento, así que una exportación del cuerpo del texto no puede incluirlos; las sugerencias son una capa paralela que la exportación aplana a una sola lectura. Resuelve los comentarios y acepta o rechaza las sugerencias antes de exportar.

### ¿Es mejor descargar como .docx y convertir, o usar la exportación a Markdown?

Usa la exportación a Markdown para un documento de texto — es una sola acción y no hay una segunda herramienta en la que equivocarse. Usa la ruta `.docx` cuando necesites las imágenes extraídas a una carpeta, control sobre el motor de salida, los cambios rastreados resueltos de forma explícita, o la misma conversión repetida sobre muchos archivos dentro de un script.

### ¿Cómo convierto solo parte de un Google Doc?

De dos maneras. Selecciona el texto y usa Copiar como Markdown, con Markdown activado en Herramientas → Preferencias, y pégalo donde vaya. O instala el complemento Docs to Markdown, que convierte una selección desde una barra lateral — y ten en cuenta su propio aviso de que una tabla se debe seleccionar por completo o el complemento no verá el elemento de tabla que la contiene.

### ¿Por qué mis encabezados salieron como párrafos normales?

Porque nunca fueron encabezados. Si alguien puso una línea en negrita y a 18 puntos en vez de aplicar el estilo Título 1, no hay ningún encabezado en el documento que un conversor pueda encontrar, y el propio complemento Docs to Markdown lo dice exactamente así en su documentación. Aplica estilos de encabezado de verdad en Docs, y vuelve a exportar.

### ¿Puedo automatizar Google Docs a Markdown para muchos documentos?

Sí, con dos niveles de esfuerzo. La API de Drive puede exportar cualquier Doc directamente al tipo `text/markdown`, lo que te da la exportación nativa dentro de un script (comprobado en developers.google.com, el 8 de septiembre de 2026). Para controlar las imágenes, las sugerencias y las funciones propias de Docs, lee el documento mediante la API de Docs como JSON estructurado y genera el Markdown tú mismo — bastante más trabajo, y la única ruta en la que tú eliges qué se pierde.
