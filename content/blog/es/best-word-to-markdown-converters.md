---
title: "Los mejores conversores de Word a Markdown en 2026: todas las formas de convertir Word a Markdown"
description: Comparamos las formas de convertir Word a Markdown en 2026 -conversores de navegador, Pandoc, mammoth, Google Docs y plugins de Word- y lo que pierde un .docx.
date: 2026-09-08
tag: Conversión
keywords: convertir word a markdown, conversor docx a markdown, word a markdown online, mejor conversor word a markdown, convertir docx a markdown linea de comandos, word a markdown sin subir archivo, pandoc docx a markdown, mammoth docx a markdown
---

Un `.docx` es un archivo zip lleno de XML. Descomprímelo y obtienes `document.xml` para el texto, `styles.xml` para los estilos con nombre, `numbering.xml` para las listas, una carpeta `media` para las imágenes, y un puñado de piezas que describen relaciones entre todo eso. Markdown es un archivo de texto con asteriscos. Convertir entre los dos no es traducir. Es una decisión, tomada por la herramienta que elegiste, sobre qué partes de ese archivo importan y cuáles se quedan tiradas en el suelo.

La decisión suele ser invisible hasta que lees el resultado. Los encabezados llegaron. Los párrafos llegaron. Luego la lista numerada empieza en 1, se reinicia en 1 a mitad de camino, y los subelementos se han aplanado al nivel superior. La tabla pasó como pipes pero la celda de cabecera combinada no sobrevivió el viaje. La cita destacada dentro del cuadro de texto simplemente no está, y nada en ningún sitio te dijo que había desaparecido.

Toda herramienta de esta página pierde algo. Lo que las separa es qué pierden, si lo dicen, y si el archivo salió de tu máquina por el camino. Son tres preguntas distintas y las páginas de los proveedores no responden ninguna.

Esta es una comparativa de las formas de meter un documento de Word en Markdown: conversores de navegador, Pandoc, la librería mammoth y su versión para navegador, Google Docs y sus complementos, un plugin que vive dentro del propio Word, y la ruta de copiar y pegar, que funciona mejor de lo que debería. Después viene la parte honesta: la lista de cosas de un `.docx` para las que Markdown no tiene sintaxis, y qué hace cada herramienta cuando se topa con una.

### Resumen rápido

Para un documento que necesitas ya, usa un conversor de navegador: sin instalación, y con una herramienta que corre en el navegador el archivo nunca se sube, algo que importa cuando el documento es un contrato y no un README. Para un repositorio lleno de documentos, o para cualquier cosa que necesite cambios rastreados e imágenes extraídas, instala Pandoc — es la única herramienta de aquí con opciones reales para las dos cosas. Para conversión dentro de tu propio código, mammoth es la librería sobre la que está construido casi todo lo demás, y su propia documentación te dice que generes HTML y conviertas eso a Markdown en vez de usar su escritor de Markdown. Y acepta las pérdidas de entrada: fuentes, márgenes, saltos de página, cuadros de texto y comentarios no tienen equivalente en Markdown, así que ninguna herramienta puede conservarlos, y cualquiera que diga que sí está describiendo otra cosa.

## Por qué convertir un .docx no es un solo trabajo

Leer un archivo de Word son cuatro pasos seguidos. Descomprimes el archivo. Recorres el XML, resolviendo el estilo y la numeración de cada párrafo contra otras partes del archivo. Decides en qué se convierte cada elemento resuelto — un encabezado, un elemento de lista, una fila de tabla, o nada. Luego serializas eso a Markdown, lo que significa elegir un dialecto, porque el CommonMark puro no tiene tablas ni tachado.

Una herramienta puede cuidar uno de esos pasos y descuidar el siguiente. El segundo paso es donde ocurre casi todo el daño, y ocurre por una razón que merece entenderse: en un `.docx`, el significado se guarda por referencia. Un encabezado no está marcado como encabezado. Es un párrafo cuyo `w:pStyle` nombra un estilo, y la propia definición de ese estilo — allá en `styles.xml`— es la que dice que es Heading 1. Un elemento de lista es un párrafo que lleva un elemento `w:numPr` con un `w:numId` y un `w:ilvl`, y si eso es una viñeta o un número vive en `numbering.xml`, en un nivel cuyo `w:numFmt` dice `bullet` o dice `decimal`.

Esa indirección es la razón por la que dos documentos idénticos en pantalla convierten de forma distinta. Si alguien construyó sus encabezados seleccionando texto y poniéndolo en 18pt negrita, no hay ninguna referencia de estilo que resolver, y cualquier conversor de aquí te va a entregar un párrafo. El complemento de Google Docs lo dice en su propio README — un texto que solo es negrita y grande convierte como un párrafo normal. No es un fallo del conversor. Nunca hubo ningún encabezado en el archivo.

El cuarto paso decide el dialecto, y se aplican las mismas reglas que para [Markdown a HTML en la otra dirección](/blog/best-markdown-to-html-converters). Tablas, tachado y listas de tareas son GitHub Flavored Markdown, no CommonMark. Las notas al pie no están en ninguna de las dos especificaciones. Así que el soporte de tablas de un conversor es una afirmación sobre su dialecto de salida, no sobre lo bien que leyó tu documento, y las dos cosas se confunden constantemente.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad principal | Precio |
| --- | --- | --- | --- |
| TransformPipe | Un documento, ahora, sin subirlo | Lee el `.docx` en el navegador; encabezados, listas, enlaces y tablas salen como Markdown | Gratis |
| Pandoc | Lotes, tuberías y cambios rastreados | `--track-changes`, `--extract-media`, ~40 formatos | Gratis, GPL |
| mammoth | Conversión dentro de tu propio código | Versiones para Node y navegador; mapa de estilos de Word a elementos | Gratis, BSD-2-Clause |
| MarkItDown | Alimentar muchos tipos de archivo a una tubería de texto | CLI y librería en Python, muchos formatos de entrada, Markdown de salida | Gratis, MIT |
| Google Docs (nativo) | Un documento que ya está en Drive | Archivo → Descargar → Markdown (.md), y Copiar como Markdown | Gratis con una cuenta de Google |
| Complemento Docs to Markdown | Convertir parte de un Google Doc | Barra lateral en Docs; convierte una selección, no solo el archivo | Gratis, Apache 2.0 |
| Writage | Quienes no van a dejar Word | Abrir y guardar Markdown desde la propia cinta de Word | 29 $ +IVA licencia personal, pago único |
| Copiar y pegar | Unos pocos párrafos, ahora mismo | El portapapeles HTML lleva estructura; un editor que lo entiende la convierte | Gratis |
| Guardar como página web de Word | Sacar HTML de Word sin un conversor | Word escribe el HTML, tú lo conviertes | Incluido con Word |
| LibreOffice, sin interfaz | Archivos `.doc` antiguos y formatos raros | `soffice --convert-to docx` como primer paso | Gratis, MPL 2.0 |
| python-docx | Leer el XML tú mismo | Crea, lee y actualiza `.docx` desde Python | Gratis, MIT |

## Las mejores formas de convertir Word a Markdown en 2026

### TransformPipe — la mejor para un documento que no quieres subir

TransformPipe lee el `.docx` en tu navegador y te devuelve Markdown. Sin sesión iniciada, el archivo nunca se envía a ningún sitio: la página lo lee, tu máquina lo convierte, y el resultado es tuyo. No hace falta instalar nada ni tener cuenta.

Por debajo hace exactamente lo que recomienda la propia documentación de mammoth — mammoth convierte el archivo en HTML, y un paso separado de HTML a Markdown convierte eso en Markdown. Son dos conversiones en vez de una, y es el arreglo que sugieren los propios autores de la librería, porque HTML tiene un elemento para casi todo lo que contiene un `.docx` y Markdown no.

| A favor | En contra |
| --- | --- |
| Nada se sube cuando no has iniciado sesión | El navegador hace el trabajo, así que un documento muy grande está limitado por la máquina |
| Sin instalación, sin terminal, sin cuenta | Un documento a la vez, no un directorio |
| Encabezados, listas, enlaces, tablas, negrita y cursiva llegan bien | Los cambios rastreados se resuelven al texto aceptado; las eliminaciones y comentarios no llegan |
| El Markdown se puede editar in situ antes de descargarlo | Sin opción de extraer las imágenes a una carpeta |

**Precio:** gratis. Una cuenta añade historial, compartir y una API, también gratis.

**Detalles técnicos y funciones**

- Acepta `.docx`; el `.doc` binario antiguo es un formato distinto y necesita convertirse primero
- mammoth lee el archivo, y luego el HTML se convierte a GitHub Flavored Markdown — tablas y tachado incluidos
- El HTML crudo que sobrevive el viaje pasa por un saneador con una lista de permitidos fija antes de renderizarse
- Se descarga como `.md`, o como un archivo HTML autocontenido si el Markdown solo fue un punto de paso
- La misma conversión está disponible desde una API REST, una CLI, una GitHub Action y un servidor MCP

**¿Para quién es?** Para cualquiera con un documento que prefiere no mandar al servidor de un extraño — un contrato, una nota de paciente, un plan sin publicar, un informe interno. La afirmación de privacidad es de las que se pueden comprobar en vez de creer: abre la pestaña de red y observa que no pasa nada mientras convierte.

### Pandoc — el mejor para lotes, imágenes y cambios rastreados

Pandoc es un conversor de documentos de línea de comandos escrito en Haskell que lee y escribe alrededor de cuarenta formatos. Su lector de `.docx` es el más configurable que existe, y es la única herramienta de esta página con una respuesta documentada para los cambios rastreados.

| A favor | En contra |
| --- | --- |
| `--track-changes` acepta `accept`, `reject` o `all` | Necesita instalación y una terminal |
| `--extract-media` escribe las imágenes en un directorio | Su dialecto de Markdown no es GFM salvo que lo pidas |
| Programable, así que cien archivos son el mismo trabajo que uno | Los estilos personalizados necesitan un mapeo que escribes tú |
| Lee y también escribe `.docx`, así que hay ida y vuelta posible | El manual es largo y las banderas son muchas |

**Precio:** gratis, con licencia GPL.

**Detalles técnicos y funciones**

- `--track-changes=accept` es el valor por defecto y procesa inserciones y eliminaciones; `reject` las ignora; `all` incluye inserciones, eliminaciones y comentarios envueltos en spans (comprobado en pandoc.org, el 8 de septiembre de 2026)
- `--extract-media=DIR` saca las imágenes del archivo a una carpeta, o a un zip si le pones nombre a uno
- El dialecto de salida es explícito: `-t gfm` para GitHub Flavored Markdown, `-t commonmark`, o el dialecto extendido propio de Pandoc con sintaxis de notas al pie
- `--wrap=none` evita que reajuste los párrafos a 72 columnas, la primera bandera que casi todo el mundo quiere y la última que encuentra
- Los filtros Lua te dejan reescribir el documento a mitad de la conversión, antes de serializarlo

**¿Para quién es?** Para cualquiera que convierta más de un archivo, cualquiera que necesite las imágenes en disco en vez de perdidas, y cualquiera que trate con un documento que ha pasado por revisión. `--track-changes=all` es lo más parecido a una respuesta real para un manuscrito marcado, y ninguna herramienta de navegador ofrece un equivalente.

### mammoth — la mejor para conversión dentro de tu propio código

mammoth es una librería que convierte `.docx` a HTML, con versiones para Node y para el navegador. Es lo que resulta ser, si escarbas un poco, un número sorprendente de herramientas de «Word a Markdown».

Su idea distintiva es el mapa de estilos. En vez de adivinar, mammoth empareja los estilos con nombre de Word con elementos HTML: `p[style-name='Heading 1'] => h1`, y puedes extender el mapa con los estilos propios de tu organización. Ese es el mecanismo que hace que un documento con un estilo personalizado «Título de capítulo» convierta correctamente, y la ausencia de ese mecanismo es por qué otras herramientas no lo consiguen.

| A favor | En contra |
| --- | --- |
| Corre en Node y en el navegador — `mammoth.browser.js` viene en el paquete | Produce HTML; el paso a Markdown es tuyo |
| Los mapas de estilos gestionan bien los estilos personalizados de Word | Su propio escritor de Markdown está marcado como obsoleto por sus autores |
| Informa de lo que no pudo mapear, en un array `messages` | Sin maquetación de página, porque HTML no tiene página |
| Incluye una CLI para conversiones puntuales | Solo JavaScript |

**Precio:** gratis, con licencia BSD-2-Clause.

**Detalles técnicos y funciones**

- `mammoth.convertToHtml({arrayBuffer})` en el navegador, `{path}` en Node
- `convertToMarkdown` existe y el README marca el soporte de Markdown como obsoleto, recomendando HTML más una librería aparte de HTML a Markdown
- El array `messages` de cada resultado lista los estilos no reconocidos y los elementos no gestionados — el único informe legible por máquina de lo que descartó un conversor, entre todas las herramientas de aquí
- Las imágenes se pueden incrustar como URIs de datos o pasarse a una función de callback para que tú decidas dónde guardarlas
- La forma de línea de comandos es `mammoth documento.docx salida.html`

**¿Para quién es?** Para desarrolladores que integran la conversión en una aplicación, sobre todo en el navegador, donde no hay otra opción real. Lee el array `messages` y muéstraselo a tus usuarios; es la diferencia entre un conversor y un conversor en el que se puede confiar.

### MarkItDown — el mejor para alimentar una tubería en vez de a una persona

MarkItDown es una herramienta de Python de Microsoft que convierte muchos tipos de archivo a Markdown — Word, PowerPoint, Excel, PDF, HTML, CSV, JSON, EPUB y más—, con una CLI y una API de librería.

Es inusualmente honesta sobre su propósito. El README dice que existe para convertir archivos a Markdown para usarlos con modelos de lenguaje y tuberías de análisis de texto, y que aunque el resultado suele ser presentable, está pensado para que lo consuman herramientas y puede no ser la mejor opción para una conversión de alta fidelidad pensada para un lector humano. Créete esa frase. Te dice exactamente cuándo recurrir a ella y cuándo no.

| A favor | En contra |
| --- | --- |
| Un solo comando para una docena de formatos de entrada | La salida está pensada para máquinas, según sus propios autores |
| Librería y CLI, así que entra en una tubería de Python | Necesita Python y un gestor de paquetes |
| Desarrollo activo y muy usado | Menos control sobre los detalles de `.docx` que Pandoc |
| Gestiona también archivos comprimidos e imágenes | No es la herramienta para un documento que alguien va a leer con atención |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- `markitdown ruta-al-archivo.docx > documento.md`, o `-o` para nombrar la salida
- Los formatos que lista el README incluyen PDF, PowerPoint, Word, Excel, imágenes con OCR, audio con transcripción, HTML, CSV, JSON, XML, ZIP, URLs de YouTube y EPUB
- Disponible como librería de Python para usar dentro de un script en vez de desde una terminal

**¿Para quién es?** Para cualquiera que esté montando un corpus. Si el Markdown va a un índice de recuperación o a un prompt, la fidelidad por debajo del nivel de «las palabras están en el orden correcto» no importa, y esta es la vía más rápida para llegar ahí. Si una persona va a leer el resultado, usa otra cosa.

### Google Docs — el mejor cuando el documento ya está en Drive

Google Docs tiene una exportación nativa a Markdown. Archivo → Descargar → Markdown (.md) escribe un archivo `.md`, y hacer clic derecho sobre una selección ofrece Copiar como Markdown, con Pegar desde Markdown para el viaje de vuelta (comprobado en support.google.com, el 8 de septiembre de 2026).

El truco está en cómo se llega hasta ahí. Un `.docx` en tu portátil tiene que subirse a Drive y abrirse en Docs antes de que nada de esto aplique, y la propia importación de Docs ya es una conversión con sus propias pérdidas. Estás corriendo dos conversiones y solo controlando la segunda.

| A favor | En contra |
| --- | --- |
| Sin instalación, y sin ninguna herramienta de terceros implicada | El `.docx` tiene que subirse primero a Google |
| Copiar como Markdown funciona sobre una selección, no solo el archivo entero | La importación de `.docx` de Docs es una conversión propia |
| Pegar desde Markdown hace posible el viaje de vuelta | Sin opciones: te da lo que te da |
| Gratis con una cuenta que probablemente ya tienes | Los comentarios viven en Docs y no salen en el Markdown |

**Precio:** gratis con una cuenta de Google.

**Detalles técnicos y funciones**

- Archivo → Descargar → Markdown (.md) para el documento entero
- Copiar como Markdown con un clic derecho, para una parte de él
- Pegar desde Markdown convierte el Markdown en formato de Docs al entrar

**¿Para quién es?** Para cualquiera cuyos documentos ya viven en Google Docs. Si tu `.docx` está en disco y es confidencial, subirlo para convertirlo es el trato equivocado, y esta es la única opción de la página que exige justo eso. La misma advertencia aplica a documentos que salen de cualquier editor alojado — [qué sobrevive a una exportación desde Notion, Obsidian o Confluence](/blog/markdown-from-notion-obsidian-and-confluence) es una versión de la misma pregunta.

### Docs to Markdown — el mejor para convertir parte de un Google Doc

Docs to Markdown, también conocido por el nombre de su repositorio gd2md-html, es un complemento de Google Docs escrito en Apps Script. Se abre como una barra lateral y convierte el documento, o solo la selección, a Markdown o HTML.

| A favor | En contra |
| --- | --- |
| Convierte una selección, algo que la exportación nativa no puede hacer | Solo Google Docs |
| Código abierto, y pide permisos mínimos | No acepta contribuciones, según su repositorio |
| Es anterior a la exportación nativa y todavía hace cosas que ella no hace | Requiere el mismo paso de subida a Drive |
| Escribe HTML además de Markdown | Los encabezados tienen que ser estilos de encabezado reales, no texto grande en negrita |

**Precio:** gratis, con licencia Apache 2.0.

**Detalles técnicos y funciones**

- Se instala desde Google Workspace Marketplace; corre como barra lateral de Docs
- Solo pide acceso al documento actual y permiso para crear una barra lateral
- Su README es explícito en que el texto que solo es negrita y grande convierte como un párrafo normal

**¿Para quién es?** Para quien redacta en Docs y publica en una plataforma de Markdown, y para cualquiera que necesite una sección en vez de un archivo entero.

### Writage — el mejor para quien no va a dejar Word

Writage es un plugin que se instala en Microsoft Word y añade Markdown a los diálogos de Abrir y Guardar como del propio Word, con una pestaña Writage en la cinta. Es la única opción de aquí que funciona como espera un usuario de Word: Archivo, Guardar como, Markdown.

| A favor | En contra |
| --- | --- |
| Markdown se vuelve un formato que el propio Word lee y escribe | De pago, y por usuario |
| Sin segunda aplicación, sin terminal, sin subida | Solo versiones para Windows y macOS — nada de Word en la web |
| Ida y vuelta: abre Markdown en Word, guárdalo de nuevo | Atado a Word, así que sin conversión por lotes de un directorio |
| Prueba con funcionalidad completa antes de pagar | Otro complemento más en una aplicación que a menudo ya tiene varios |

**Precio:** 29 $ +IVA por una licencia personal, pago único y perpetuo, con actualizaciones gratis durante doce meses tras la compra; las licencias comerciales son 145 $ +IVA para cinco usuarios, también pago único. Hay una prueba gratis de 14 días con funcionalidad completa (comprobado en writage.com, el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Se instala como complemento de Word; la descarga se ofrece como `.msi` para Windows y `.pkg` para macOS
- Añade Markdown a los diálogos de Abrir y Guardar como de Word, y una pestaña Writage a la cinta
- La licencia se activa desde esa pestaña pegando un código

**¿Para quién es?** Para escritores y editores cuya jornada entera pasa en Word y que publican en un sistema de Markdown. Si la alternativa es enseñar a un equipo de autores no técnicos a usar una terminal, treinta dólares por cabeza no es la parte cara del proyecto.

### Copiar y pegar a través del portapapeles HTML — mejor de lo que suena

Cuando copias desde Word, el portapapeles lleva varias representaciones de la misma selección, y una de ellas es HTML. Pega eso en un editor que entienda el portapapeles HTML y lo convierta — muchos editores de Markdown lo hacen, y también las cajas de comentarios de GitHub— y los encabezados, listas, negrita, cursiva, enlaces y a menudo las tablas llegan como Markdown.

| A favor | En contra |
| --- | --- |
| Instantáneo, y no necesita nada instalado | Las imágenes no llegan; son referencias a un portapapeles, no archivos |
| Conserva la estructura en línea sorprendentemente bien | Depende por completo de cómo maneje el pegado el editor de destino |
| Funciona sobre una selección, así puedes tomar solo una sección | Documentos largos significan desplazar, seleccionar y esperar lo mejor |
| Ningún archivo sale de tu máquina | Sin ningún informe de lo que se perdió |

**Precio:** gratis.

**¿Para quién es?** Para cualquiera que mueva unos cientos de palabras. Es la ruta más rápida para una sección de un documento y la peor para uno entero, y el fallo es silencioso: el texto llega, las imágenes no, y nadie se da cuenta hasta que la página ya está publicada.

### Guardar como página web de Word, y luego HTML a Markdown

Word puede escribir HTML él mismo. Guardar como, y elige Página web, filtrada — la opción filtrada es la que deja fuera la mayor parte del XML propio de Word. Luego convierte ese HTML a Markdown con la herramienta que prefieras.

Es una ruta de dos pasos que merece conocerse porque Word es el único programa que entiende su propio documento a la perfección. Lo que produce es HTML verboso con muchísimo estilo en línea, que un buen conversor de HTML a Markdown descarta, dejando la estructura.

| A favor | En contra |
| --- | --- |
| Word mismo hace la lectura, así que nada se malinterpreta | Dos pasos, y el archivo intermedio es grande |
| Las imágenes se escriben en una carpeta junto al HTML | La salida sin filtrar lleva enormes cantidades de marcación de Word |
| Sin software de terceros en el primer paso | Necesita Word, y una segunda herramienta para el segundo paso |

**Precio:** incluido con Word.

**¿Para quién es?** Para cualquiera que tenga Word abierto, un documento que otros conversores han estropeado, y un paso de HTML a Markdown ya disponible. Es también la ruta que probar cuando los estilos personalizados de un documento derrotan a todo lo demás, porque Word los resuelve antes de escribir el HTML. Si vas por aquí, sanea el HTML antes de fiarte de él — [el HTML crudo de cualquier origen merece el mismo trato](/blog/sanitising-markdown-safely).

### LibreOffice, sin interfaz — el preprocesador para archivos viejos y raros

LibreOffice no es un conversor de Markdown y merece una fila igual, porque es la respuesta fiable para el archivo que ninguna otra herramienta va a leer. El viejo formato binario `.doc`, `.rtf`, archivos de WordPerfect, un `.odt` que te envió alguien desde Linux: `soffice --headless --convert-to docx archivoviejo.doc` produce un `.docx`, y todo lo demás de esta página puede leerlo después.

| A favor | En contra |
| --- | --- |
| Lee formatos que nada más en esta lista toca | Dos conversiones, así que dos tandas de pérdidas |
| Programable y sin interfaz, así que entra en una tubería | Una instalación grande para un paso de preprocesamiento |
| Gratis y de código abierto | Su salida `.docx` es su propia interpretación, no el original |

**Precio:** gratis, con licencia MPL 2.0.

**¿Para quién es?** Para cualquiera con un archivo de un formato anterior al propio `.docx`. Convierte primero a `.docx`, luego convierte eso, y espera que las sorpresas estén en el primer paso.

### python-docx — para cuando quieres tomar tú las decisiones

python-docx crea, lee y actualiza archivos `.docx` desde Python. No tiene escritor de Markdown ni de HTML, y esa es la idea: te da los párrafos, los runs, los estilos y las tablas como objetos, y qué emites es enteramente problema tuyo.

| A favor | En contra |
| --- | --- |
| Control completo sobre qué se convierte en qué | Estás escribiendo tú el conversor |
| Lee y escribe, así que también puede editar documentos | Sin salida a Markdown de ningún tipo |
| Bien documentado y con mucho recorrido | Solo vale la pena para una regla que ningún conversor implementa |

**Precio:** gratis, con licencia MIT.

**¿Para quién es?** Para equipos con una norma propia que ningún conversor conoce — un estilo concreto que debe volverse un shortcode concreto, un formato de tabla que hay que remodelar, una estructura de documento que se mapea a un modelo de contenido. Si tu requisito es ordinario, esto es mucho más trabajo del que vale.

## Lo que un .docx lleva y Markdown no puede expresar

Esta es la sección que ninguna página de proveedor va a escribir, porque no hay forma de escribirla que suene bien. Markdown tiene una docena de construcciones. Un `.docx` tiene cientos. La conversión es lossy por definición, y la única pregunta útil es a qué pérdidas estás accediendo. [El inventario completo, con un veredicto para cada elemento](/blog/what-not-to-keep-from-a-docx), va más allá del resumen de abajo.

**Fuentes, tamaños y colores.** Markdown no tiene sintaxis para el tipo de letra, el tamaño de punto ni el color. No es «poco soporte» — es ninguno. Todo conversor de aquí los descarta, y los que parecen no hacerlo están emitiendo HTML crudo con un atributo `style`, que es un documento distinto dentro de un envoltorio con forma de Markdown. Si el significado del documento depende de su tipografía, convertirlo a Markdown destruye el significado y conserva las palabras.

**Márgenes, tamaño de página y saltos de página.** Markdown no tiene páginas. Un documento maquetado para A4 con márgenes en espejo y un salto de página antes de cada capítulo se convierte en un flujo continuo. Pandoc puede emitir un salto de forma o un bloque crudo para un salto de página, y es una marca para que un paso posterior la interprete, no un salto de página. No hay nada que romper.

**Cabeceras, pies de página y números de página.** Estos viven en sus propias partes del archivo y hacen referencia a un concepto — la página— que no existe al otro lado. Todo los descarta en silencio. Nadie los echa de menos hasta que un documento con «Confidencial — página 3 de 12» en el pie se republica sin él.

**Cambios rastreados.** Esta es la que cuesta dinero. Un documento revisado contiene tanto el original como la revisión, marcados como inserciones y eliminaciones. Un conversor sin opinión sobre ellos suele entregarte el texto ya aceptado, lo que significa que las eliminaciones de alguien desaparecen, y su razonamiento con ellas. El `--track-changes` de Pandoc es el único control documentado de esta página: `accept`, `reject`, o `all` para conservarlo todo envuelto en spans. Si un documento ha pasado por revisión legal, convierte con `all` y lee el resultado antes de deshacerte del `.docx`.

**Comentarios.** Los comentarios son una conversación anclada a rangos de texto, y Markdown no tiene ningún ancla a la que sujetarlos. El manual de Pandoc dice que `accept` y `reject` ignoran ambos los comentarios y que solo `all` los incluye. mammoth los deja fuera salvo que añadas tú mismo un mapeo de estilo `comment-reference`, algo que su README documenta y casi nadie hace. Todo lo demás los descarta sin mencionarlo. El hilo de revisión de un documento es a menudo lo más valioso que contiene, y es lo primero que se va.

**Notas al pie y notas finales.** Estas al menos tienen dónde caer, pero solo en algunos dialectos. Las notas al pie no están en CommonMark ni en la especificación de GFM, así que existen como extensiones — el propio dialecto de Markdown de Pandoc tiene sintaxis de notas al pie, y un conversor que apunta a CommonMark estricto tiene que incluirlas en línea, añadirlas como párrafos normales, o descartarlas. Convierte un documento con notas al pie y mira el final de la salida antes de dar el veredicto.

**Cuadros de texto, formas y SmartArt.** Un cuadro de texto no está en el flujo del documento; es un objeto de dibujo con texto dentro. El texto puede estar en cualquier parte del XML en relación con dónde aparece en la página, y suele desaparecer por completo. Esta es la pérdida que a la gente le cuesta más creer, porque la cita destacada estaba justo ahí, en pantalla. Busca en la salida una frase que sabes que estaba en un cuadro de texto. Si falta, nunca estuvo en el texto.

**Tablas más allá de la cuadrícula.** Una tabla simple convierte bien. Una tabla con celdas combinadas, tablas anidadas, una celda que contiene una lista con viñetas, o una fila de cabecera que abarca dos columnas, no lo hace, porque la sintaxis de tabla de Markdown es una cuadrícula de celdas únicas sin combinación y sin contenido de bloque. Los conversores aplanan lo que pueden y descartan el resto, y el resultado suele verse plausible mientras está mal. [Las tablas son lo que más se rompe en cualquier dirección](/blog/markdown-tables-that-survive-conversion), y la única comprobación fiable es contar las columnas.

**La numeración, y por qué depende de un archivo del paquete.** Esto merece su propio párrafo porque explica la queja más común sobre la conversión de `.docx`. Una lista numerada en Word es un conjunto de párrafos que llevan cada uno un `w:numId` y un nivel de sangría; la numeración en sí — si es decimal o romana en minúscula o una viñeta, dónde se reinicia, cómo anidan los niveles— se define en `numbering.xml`. Lee el código fuente de mammoth y puedes ver la consecuencia directamente: un nivel de lista se trata como ordenado cuando su `w:numFmt` es cualquier cosa distinta de `bullet`, y cuando no se encuentra la parte de numeración, la librería recurre a un valor por defecto vacío. Con ese valor vacío, la búsqueda de la numeración de un párrafo no devuelve nada, el párrafo deja de cumplir la regla que lo habría convertido en elemento de lista, y se emite como un párrafo normal.

Por eso la misma herramienta convierte perfectamente las listas de un documento y reduce las de otro a texto plano. No es la herramienta siendo inconsistente. Un archivo tenía una parte de numeración y el otro no, o hacía referencia a definiciones de numeración que no contenía — algo que les pasa a documentos montados por scripts, exportados de otras aplicaciones, o reparados por Word tras un cuelgue. Si las listas de un documento convertido llegan como párrafos, descomprime el `.docx` y busca `word/numbering.xml` antes de culpar al conversor. Y revisa la anidación de lo que sí sobrevive, porque [la sangría de listas y los saltos de línea son su propia trampa aparte](/blog/markdown-line-breaks-and-lists) una vez que el Markdown ya está escrito.

**Campos, referencias cruzadas y una tabla de contenidos.** Una tabla de contenidos de Word es un campo que Word calcula. Convertida, se vuelve el texto que quedó guardado en el campo la última vez que Word lo actualizó — una instantánea con números de página que apuntan a páginas que ya no existen. Las referencias cruzadas van igual. Borra la tabla de contenidos convertida y deja que tu renderizador de Markdown construya una nueva.

## Cómo elegir

1. **Decide adónde puede ir el archivo antes de elegir herramienta.** Un README se puede subir a cualquier cosa. Un contrato firmado, un estado financiero sin publicar o cualquier cosa con el nombre de un paciente no, y elegir un conversor online para uno de esos es una divulgación, no una conversión. La conversión en el navegador es la única opción que mantiene el archivo en la máquina, y puedes verificarlo mirando la pestaña de red.
2. **Cuenta los documentos.** Un archivo no justifica instalar Haskell. Doscientos archivos no justifican una pestaña del navegador y una persona haciendo clic en ella. El coste de instalar se paga una vez y el coste de hacer clic se paga cada vez, lo que invierte la respuesta en algún punto entre cinco archivos y cincuenta.
3. **Averigua si el documento ha sido revisado.** Si tiene cambios rastreados o comentarios, la mayoría de herramientas los va a resolver en silencio y vas a perder la revisión. El `--track-changes=all` de Pandoc es la forma documentada de conservarlos, y si no usas Pandoc, tienes que aceptar que la revisión desaparece.
4. **Comprueba las imágenes antes de borrar el original.** Markdown referencia imágenes; no las contiene. Un conversor que las incrusta como URIs de datos te da un archivo enorme, uno que las extrae te da una carpeta que vigilar, y uno que no hace ninguna de las dos cosas te da Markdown apuntando a la nada. Averigua cuál tienes, y luego conserva el `.docx`.
5. **Convierte un documento representativo y léelo entero.** No la primera pantalla. Las tablas, las listas numeradas, las notas al pie, los cuadros de texto, y una búsqueda de una frase que sabes que estaba en una leyenda. Diez minutos aquí valen más que cualquier tabla comparativa, incluida esta, porque tus documentos no son iguales a los de nadie más.
6. **Asume que vas a querer el original otra vez.** La conversión es de un solo sentido para todo lo que hay en la sección honesta de arriba. Archiva el `.docx` en algún sitio donde puedas encontrarlo, porque el día en que alguien pregunte qué decía el párrafo eliminado es el día en que descubres que la respuesta solo estaba en el archivo que tiraste.

## Conclusión

No hay una forma sin pérdidas de convertir Word a Markdown, y las buenas herramientas son las que son concretas sobre sus pérdidas en vez de callarlas. [La guía paso a paso cubre los pasos y la lista de comprobación](/blog/convert-docx-to-markdown) de qué mirar en el resultado. Para un solo documento, el camino honesto más corto es un conversor que corre en tu navegador, que es lo que hace [la conversión de Word a Markdown de TransformPipe](/word-to-markdown) — gratis, sin instalación, y sin sesión iniciada el `.docx` nunca sale de tu máquina. Para un directorio de archivos, imágenes que necesitan extraerse o un documento que ha pasado por revisión, instala Pandoc y aprende `--track-changes` y `--extract-media`; nada más en esta página se acerca. Para conversión dentro de tu propia aplicación, usa mammoth, lee su array `messages`, y sigue su consejo de generar primero HTML — [cómo funcionan los mapas de estilos de mammoth, y dónde encajan docx4js, docxtemplater y Pandoc a su alrededor](/blog/mammoth-js-and-docx-parsers) es lo siguiente que leer si esa es la ruta que tomas. Y elijas lo que elijas, conserva el original, porque las fuentes, los saltos de página, los comentarios y el cuadro de texto que no notaste no van a volver.

## Preguntas frecuentes

### ¿Cómo convierto Word a Markdown gratis?

Todas las opciones de esta página excepto Writage son gratis. Un conversor de navegador es la ruta más rápida para un archivo y no requiere instalación; Pandoc es gratis y con licencia GPL para la línea de comandos; mammoth y MarkItDown son librerías gratis. Si el documento ya está en Google Docs, Archivo → Descargar → Markdown (.md) tampoco cuesta nada.

### ¿Puedo convertir un .docx a Markdown sin subirlo?

Sí, y merece la pena insistir en ello para cualquier cosa confidencial. Un conversor que corre en el navegador lee el archivo con JavaScript en tu propia máquina y nunca lo envía a ningún sitio, algo que puedes confirmar abriendo la pestaña de red mientras convierte. Pandoc y mammoth corren en local por definición. Google Docs es la excepción: exige subir primero el archivo a Drive.

### ¿Por qué mis listas numeradas salieron como párrafos normales?

Casi con toda seguridad porque al `.docx` le faltaba, o hacía mal referencia a, `numbering.xml`, la parte del archivo que define el aspecto de cada nivel de lista. Sin ella, un conversor no puede saber que esos párrafos eran elementos de lista, así que los emite como párrafos. Descomprime el archivo y busca `word/numbering.xml` antes de asumir que el conversor tiene la culpa.

### ¿Qué pasa con los cambios rastreados y los comentarios?

La mayoría de conversores aceptan los cambios en silencio y descartan los comentarios, así que obtienes texto limpio y pierdes la revisión. Pandoc es la excepción: `--track-changes` acepta `accept`, `reject` o `all`, y su manual dice que solo `all` incluye los comentarios. Si la historia de revisión de un documento importa, convierte con `all` y conserva el original de todos modos.

### ¿Las tablas sobreviven a una conversión de Word a Markdown?

Las cuadrículas simples sí. Las celdas combinadas, las tablas anidadas, las filas de cabecera que abarcan varias columnas y las celdas con listas dentro no, porque la sintaxis de tabla de Markdown no tiene forma de expresar ninguna de esas cosas. Convierte un documento con tu peor tabla dentro y cuenta las columnas del resultado antes de decidir que la herramienta funciona.

### ¿Las imágenes llegan bien?

No automáticamente, y no como parte del Markdown, porque Markdown solo referencia un archivo de imagen. El `--extract-media` de Pandoc las escribe en un directorio, mammoth puede incrustarlas como URIs de datos o pasarlas a tu propio código, y copiar y pegar las pierde por completo. Sea lo que uses, comprueba las imágenes antes de borrar el `.docx`.

### ¿Es mejor Pandoc o un conversor de navegador para convertir Word a Markdown?

Responden preguntas distintas. Pandoc es mejor siempre que hay más de un archivo, imágenes que extraer o cambios rastreados que conservar, y cuesta una instalación y una terminal. Un conversor de navegador es mejor para un documento que quieres convertido ahora mismo sin subirlo, y no tiene opciones que aprender. La mayoría de la gente necesita las dos cosas en momentos distintos.
