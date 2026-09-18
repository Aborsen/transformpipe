---
title: "Los mejores conversores de Markdown a HTML en 2026: comparados y probados"
description: Comparamos conversores de Markdown a HTML por el dialecto que soportan, si sanean el resultado y si el archivo que entregan se abre solo o llega como fragmento.
date: 2026-09-08
tag: Conversión
keywords: mejor conversor markdown a html, convertir markdown a html online, convertir md a html, libreria markdown a html, markdown a html linea de comandos, html autocontenido desde markdown, convertir markdown a html sin instalar
---

Todo conversor de Markdown a HTML produce HTML. Ahí se acaba el parecido. Uno devuelve un fragmento sin ningún `<html>` alrededor, otro conserva la etiqueta `<script>` que alguien dejó olvidada en el archivo, un tercero pierde tus tablas porque nunca las implementó. El archivo que recibes es el producto, y las diferencias solo se ven cuando lo abres en otro sitio distinto de la herramienta que lo generó.

### Resumen rápido

Elige según lo que necesitas que le pase al archivo, no según el número de funciones. Para un documento que vas a enviar a alguien, necesitas un **archivo HTML completo y autocontenido**, con los estilos en línea — no un fragmento. Para un documento con contenido que no escribiste tú, necesitas que el conversor **sanee** el resultado, porque Markdown permite HTML crudo y el HTML crudo permite scripts. Para una compilación, elige la **librería que ya usa tu generador** y no sigas buscando. Un conversor que corre en el navegador cubre el primer caso sin subir nada y sin instalar nada; Pandoc cubre el abanico más amplio de formatos si estás dispuesto a instalarlo; marked, markdown-it y remark son las librerías sobre las que está construido casi todo lo demás.

## Por qué «convierte Markdown» no te dice casi nada

Convertir un archivo Markdown a HTML son cuatro trabajos seguidos, y una herramienta puede cuidar uno y descuidar el siguiente. Analiza el texto y lo convierte en un árbol, renderiza ese árbol como etiquetas HTML, sanea el resultado, y lo envuelve en un documento. [Lo que le pasa realmente a tu archivo](/blog/markdown-to-html-converter) merece leerse completo, pero la versión corta es que los conversores difieren en cada una de esas cuatro etapas, y las diferencias son invisibles hasta que muerden.

La primera etapa decide el dialecto. El CommonMark puro tiene bloques de código con cercas pero no tablas, ni listas de tareas, ni tachado, ni autoenlaces. GitHub Flavored Markdown añade las cuatro cosas. Las notas al pie no están en ninguna de las dos especificaciones, así que un conversor que las soporta lo hace como extensión propia. Un archivo que se ve bien en GitHub y sale mal en otro sitio normalmente se ha topado con un analizador que corre un dialecto más pequeño — y el fallo es silencioso, porque una tabla que el analizador no reconoce es solo un párrafo lleno de caracteres de pipe.

La tercera etapa decide si tu documento puede atacar a quien lo lee. Markdown se diseñó para dejar pasar HTML crudo, lo que significa que un archivo `.md` puede contener `<script>`, `onerror=` y URLs `javascript:`, y un conversor que renderiza fielmente se lo va a entregar todo al navegador. Esto importa en el momento en que conviertes un archivo que no escribiste tú — un README de un repositorio, un documento que te envió un cliente, cualquier cosa sacada de la red. [Sanear no es opcional](/blog/sanitising-markdown-safely) para esos archivos, y sorprende cuántas herramientas te dejan esa parte a ti.

La cuarta etapa decide si el archivo se abre. Un conversor que devuelve un fragmento — `<h1>Título</h1><p>Texto</p>` sin nada alrededor— ha hecho su trabajo como librería y lo ha fallado como herramienta. Abierto en un navegador, ese fragmento se renderiza como texto negro sin estilo, con la fuente por defecto del navegador y el ancho completo de la ventana. Es HTML técnicamente correcto y se ve roto para todo el que lo recibe.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad principal | Precio |
| --- | --- | --- | --- |
| TransformPipe | Enviarle a alguien un documento terminado | HTML autocontenido, estilos en línea, convertido en el navegador | Gratis |
| Pandoc | Convertir entre muchos formatos a la vez | ~40 formatos, plantillas, `--standalone` e incrustación de recursos | Gratis, GPL |
| marked | Conversión rápida dentro de una app JS | Pequeño, veloz, GFM de fábrica | Gratis, MIT |
| markdown-it | Corrección y plugins | Compatible con CommonMark, escapa el HTML crudo por defecto | Gratis, MIT |
| remark / unified | Transformar el documento, no solo renderizarlo | Un AST que puedes recorrer y reescribir | Gratis, MIT |
| commonmark.js | Comprobar qué dice realmente la especificación | La implementación de referencia | Gratis, BSD |
| Showdown | Proyectos JS antiguos que ya lo usan | Conversor veterano, anterior a CommonMark | Gratis, MIT |
| Python-Markdown | Scripts de compilación en Python | API de extensiones, motor de MkDocs | Gratis, BSD |
| Goldmark | Programas en Go y sitios Hugo | Compatible con CommonMark, rápido, extensible | Gratis, MIT |
| Dillinger | Escribir y exportar en una sola pestaña | Editor con exportación a HTML y PDF, sincronización en la nube | Gratis, MIT |
| StackEdit | Escribir sin conexión en el navegador | Editor en el navegador, sincroniza con Drive, Dropbox, GitHub | Gratis, Apache 2.0 |
| Typora | Un editor de escritorio en el que vives | Edición WYSIWYG, exporta a HTML, PDF, Word | 14,99 $ pago único |
| VS Code | Convertir mientras ya estás programando | Vista previa integrada (markdown-it), exportación por extensiones | Gratis |
| Generadores de sitios estáticos | Un sitio, no un documento | Hugo, Eleventy, Docusaurus, MkDocs, Jekyll | Gratis |
| GitHub / GitLab | Leer, no exportar | Renderiza GFM; sin botón de exportar | Gratis |

## Los mejores conversores de Markdown a HTML en 2026

### TransformPipe — el mejor para un documento que vas a enviar a alguien

TransformPipe convierte un archivo Markdown en un documento HTML completo dentro de tu navegador y lo entrega como un solo archivo con los estilos en línea. No hace falta instalar nada, no hace falta cuenta, y sin sesión iniciada el archivo nunca se envía a ningún sitio — se lee, se convierte y se renderiza en tu propia máquina.

| A favor | En contra |
| --- | --- |
| La exportación es un solo archivo que no le pide nada a la red | No es un generador de sitios: un documento a la vez, o varios fusionados en uno |
| Nada se sube cuando no has iniciado sesión | El navegador hace el trabajo, así que un archivo muy grande está limitado por la máquina |
| Sanea contra una única lista de permitidos, tanto en el navegador como en el servidor | Sin lenguaje de plantillas para maquetas a medida |
| También convierte [HTML](/blog/best-html-to-markdown-converters), [Word](/blog/best-word-to-markdown-converters), CSV y [JSON](/blog/best-json-to-markdown-converters) de vuelta a Markdown | |

**Precio:** gratis. Una cuenta añade historial, compartir y una API, también gratis.

**Detalles técnicos y funciones**

- GitHub Flavored Markdown: tablas, listas de tareas, tachado, autoenlaces, código con cercas
- La salida es un documento completo — doctype, head, `<style>` en línea, sin ninguna petición externa
- El HTML crudo del origen pasa por un saneador con una lista de permitidos fija antes de llegar a la página
- Se descarga como `.html`, `.md` o texto plano, o se imprime a PDF con el propio diálogo del navegador
- La misma conversión está disponible desde una API REST, una CLI sin dependencias, una GitHub Action y un servidor MCP

**¿Para quién es?** Para cualquiera cuyo siguiente paso sea «enviarle esto a una persona». La exportación autocontenida es lo esencial: se abre igual en un portátil sin conexión que en el tuyo, [una propiedad concreta que merece entenderse](/blog/share-a-markdown-document-as-a-link) antes de mandar un `.md` por correo y esperar lo mejor.

### Pandoc — el mejor para convertir entre muchos formatos

Pandoc es un conversor de documentos de línea de comandos escrito en Haskell que lee y escribe alrededor de cuarenta formatos, Markdown y HTML entre ellos. Es la herramienta más capaz de esta lista, con diferencia, y la única que hay que instalar.

| A favor | En contra |
| --- | --- |
| Convierte entre formatos que nada más toca, incluidos LaTeX y EPUB | Necesita instalación y una terminal |
| `--standalone` produce un documento completo, no un fragmento | Plantillas y filtros son su propia curva de aprendizaje |
| Las plantillas dan control exacto sobre el envoltorio | Sin saneado: el HTML crudo pasa directo |
| Los recursos se pueden incrustar, así la salida es un solo archivo | Las diferencias de dialecto entre sus variantes de Markdown sorprenden a la gente |

**Precio:** gratis, con licencia GPL.

**Detalles técnicos y funciones**

- Su propio dialecto de Markdown extendido, más lectores de CommonMark y GFM que se seleccionan explícitamente
- `--standalone` envuelve la salida en un documento completo; `--embed-resources` incrusta imágenes y CSS
- `--template` y filtros Lua para reescribir el documento a mitad de la conversión
- `--sandbox` restringe el acceso al sistema de archivos al convertir archivos en los que no confías

**¿Para quién es?** Para cualquiera que convierta según un calendario, o hacia formatos distintos de HTML — una cadena de manuscritos, una compilación de documentación, un repositorio que tiene que publicar EPUB y PDF desde la misma fuente. [Cómo se compara para trabajos puntuales de Markdown a HTML](/blog/markdown-to-html-from-the-command-line) es una pregunta más estrecha, y la respuesta suele ser que es más herramienta de la que el trabajo pide.

### marked — el mejor por velocidad dentro de una app de JavaScript

marked es un analizador y compilador de Markdown pequeño y rápido para JavaScript, usable en el navegador y en Node. Es una de las dos librerías a las que recurre la mayoría de proyectos JS.

| A favor | En contra |
| --- | --- |
| Muy rápido y muy pequeño | Devuelve un fragmento; envolverlo es cosa tuya |
| GitHub Flavored Markdown soportado de fábrica | Sanear explícitamente no es su responsabilidad |
| Una API simple: una función, un objeto de opciones | Puntos de extensión menos estructurados que los de markdown-it |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- GFM por defecto, con opciones para saltos de línea, ids de encabezado y listas inteligentes
- Un lexer que puedes llamar por separado para obtener tokens en vez de HTML
- Renderizadores personalizados para sobrescribir cómo se emite cualquier tipo de nodo
- Sin saneador integrado: la respuesta documentada es pasar la salida por DOMPurify

**¿Para quién es?** Para desarrolladores que renderizan Markdown dentro de una aplicación donde la velocidad importa y el documento alrededor ya existe — una caja de comentarios, un panel de vista previa, un mensaje de chat.

### markdown-it — el mejor por corrección y plugins

markdown-it es un analizador compatible con CommonMark con un sistema de plugins estructurado. Es lo que usa la propia vista previa de Markdown de VS Code, un aval razonable de su conformidad.

| A favor | En contra |
| --- | --- |
| Pasa el conjunto de pruebas de la especificación CommonMark | Algo más grande y lento que marked |
| Escapa el HTML crudo por defecto, así que `html: false` es la opción segura | Sigue devolviendo un fragmento |
| Un ecosistema de plugins real: notas al pie, contenedores, atributos, anclas | La calidad de los plugins varía |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- CommonMark por defecto, con funciones de GFM disponibles mediante presets y plugins
- `html: false` por defecto — el HTML crudo del origen se escapa en vez de pasar
- Las reglas se pueden añadir, sustituir o reordenar a nivel de bloque y en línea
- Opciones de linkify y typographer para autoenlaces y puntuación inteligente

**¿Para quién es?** Para quien quiere que se siga la especificación y los puntos de extensión estén documentados, y para quien le importa más el valor por defecto seguro que unos milisegundos.

### remark y unified — los mejores para cambiar el documento, no solo renderizarlo

remark analiza el Markdown y te entrega un árbol de sintaxis abstracta. Renderizar es un plugin al final de una cadena; lo importante es todo lo que puedes hacer antes de eso.

| A favor | En contra |
| --- | --- |
| Un AST real que puedes recorrer, consultar y reescribir | La opción más pesada de esta lista, con diferencia |
| Un ecosistema de plugins enorme, incluido rehype para la salida HTML | La tubería de unified exige un aprendizaje real |
| Impulsa MDX y Docusaurus, así que está bien probado | Excesivo para convertir un archivo en una página |

**Precio:** gratis, con licencia MIT.

**Detalles técnicos y funciones**

- mdast para Markdown, hast para HTML, con plugins para moverse entre ambos
- remark-gfm para tablas y listas de tareas, remark-frontmatter para la cabecera
- rehype-sanitize como paso de primera clase en la tubería, no como un añadido tardío
- Se usa para construir linters, formateadores y codemods sobre prosa, no solo renderizadores

**¿Para quién es?** Para equipos que le hacen algo al documento por el camino — reescribir enlaces, extraer encabezados, forzar un estilo de casa, generar componentes MDX.

### commonmark.js — el mejor para zanjar una discusión sobre la especificación

commonmark.js es la implementación de referencia de CommonMark, escrita por los propios autores de la especificación. Su propósito es la conformidad, no las funciones.

| A favor | En contra |
| --- | --- |
| La respuesta definitiva a «¿qué dice la especificación?» | Sin tablas, listas de tareas ni tachado — eso es GFM |
| Pequeño y predecible | Pocos puntos de extensión, por diseño |
| Incluye un AST | No pensado como renderizador de una aplicación |

**Precio:** gratis, con licencia BSD.

**¿Para quién es?** Para quien compara analizadores, escribe uno, o intenta averiguar si una diferencia de renderizado es un fallo o un dialecto. Recurre a él cuando necesites saber qué hace el CommonMark puro, que es [más a menudo de lo que la gente espera](/blog/commonmark-gfm-and-the-flavours).

### Showdown — el mejor solo si ya lo usas

Showdown es un conversor de Markdown en JavaScript anterior a CommonMark y todavía mantenido. Funciona, y no hay una razón de peso para elegirlo en algo nuevo.

| A favor | En contra |
| --- | --- |
| Veterano y estable | No compatible con CommonMark, por diseño |
| Corre en el navegador y en Node | Diferencias de dialecto frente a GFM en casos límite |
| Opciones para casi todo su comportamiento | Ecosistema más pequeño que marked o markdown-it |

**Precio:** gratis, con licencia MIT.

**¿Para quién es?** Para proyectos ya construidos sobre él. El trabajo nuevo está mejor servido con markdown-it.

### Python-Markdown — el mejor para scripts de compilación en Python

Python-Markdown es la implementación veterana de Markdown para Python, con una API de extensiones sobre la que está construida gran parte de las herramientas de documentación, MkDocs incluido.

| A favor | En contra |
| --- | --- |
| API de extensiones madura, con muchas disponibles | No compatible con CommonMark en cada detalle |
| Ajuste natural para una tubería de compilación en Python | Más lento que las opciones de JS y Go |
| Tablas, notas al pie y listas de atributos como extensiones oficiales | Salida en fragmento; envolverla es cosa tuya |

**Precio:** gratis, con licencia BSD.

**¿Para quién es?** Para proyectos en Python, y para quien extiende MkDocs, donde ya es el motor.

### Goldmark — el mejor para Go, y para sitios Hugo

Goldmark es un analizador de Markdown en Go compatible con CommonMark, conocido por ser el motor dentro de Hugo desde que sustituyó a Blackfriday.

| A favor | En contra |
| --- | --- |
| Compatible con CommonMark y rápido | Solo Go |
| Extensible con un AST limpio | Salida en fragmento |
| Ya está en tu stack si usas Hugo | Menos extensiones ya hechas que en el mundo JS |

**Precio:** gratis, con licencia MIT.

**¿Para quién es?** Para programas en Go, y para usuarios de Hugo que quieren entender qué está renderizando su contenido.

### Dillinger — el mejor para escribir y exportar en una pestaña

Dillinger es un editor de Markdown online con vista previa en vivo y exportación a HTML y PDF, más sincronización con Dropbox, Google Drive, OneDrive y GitHub.

| A favor | En contra |
| --- | --- |
| Escribes y exportas sin salir del navegador | Tu documento pasa por un servicio alojado |
| Sincronización en la nube con los sitios habituales | El estilo de la exportación es de la herramienta, no el tuyo |
| Gratis y de código abierto | Pensado ante todo como editor: no para convertir archivos que ya tienes |

**Precio:** gratis, con licencia MIT.

**¿Para quién es?** Para quien está escribiendo el documento ahora mismo y quiere un enlace o un archivo al final.

### StackEdit — el mejor editor en el navegador que funciona sin conexión

StackEdit es un editor de Markdown en el navegador que sigue funcionando sin conexión y sincroniza con Google Drive, Dropbox y GitHub cuando la tiene.

| A favor | En contra |
| --- | --- |
| Funciona sin conexión una vez cargado | Pensado ante todo como editor, igual que Dillinger |
| Sincroniza y publica en varios destinos | Su sintaxis extendida puede viajar mal |
| Gestiona documentos largos con comodidad | La exportación lleva su propio estilo |

**Precio:** gratis, con licencia Apache 2.0.

**¿Para quién es?** Para quien quiere un editor serio en una pestaña del navegador y publica desde ahí.

### Typora — el mejor editor de escritorio con exportación

Typora es un editor de Markdown de escritorio con un modo de edición WYSIWYG — el Markdown se sustituye por su renderizado mientras escribes— y exportación a HTML, PDF, Word y más.

| A favor | En contra |
| --- | --- |
| La experiencia de escritura más cómoda de esta lista | De pago, y solo de escritorio |
| Exporta a HTML, PDF y Word con temas | El WYSIWYG esconde la sintaxis, algo que no gusta a todos |
| Archivos locales, nada se sube | No es una herramienta de lotes ni de compilación |

**Precio:** 14,99 $, pago único que cubre hasta tres dispositivos, con quince días de prueba gratis (comprobado en typora.io, el 8 de septiembre de 2026).

**¿Para quién es?** Para quien escribe Markdown a diario y quiere una aplicación en vez de una pestaña.

### VS Code — el mejor si ya lo tienes abierto

VS Code trae una vista previa de Markdown construida sobre markdown-it, y las extensiones añaden la exportación. Si el archivo ya está abierto en tu editor, este es el camino más corto de texto a página.

| A favor | En contra |
| --- | --- |
| Ya instalado, para la mayoría de desarrolladores | La exportación necesita una extensión, y las extensiones varían |
| La vista previa coincide con el comportamiento CommonMark de markdown-it | No es una tubería: convierte lo que está abierto |
| Las extensiones cubren exportación a HTML, PDF y diapositivas | El estilo de la vista previa no es el de la exportación |

**Precio:** gratis.

**¿Para quién es?** Para desarrolladores que convierten un README o una nota de paso. [Los detalles de hacerlo bien en VS Code](/blog/markdown-to-html-converter) se reducen a qué extensión eliges y qué pone alrededor del fragmento.

### Generadores de sitios estáticos — la respuesta cuando quieres un sitio

Hugo, Eleventy, Docusaurus, MkDocs y Jekyll convierten todos Markdown a HTML, y ninguno es un conversor. Son sistemas de compilación: esperan un directorio, un archivo de configuración, plantillas y un destino de despliegue, y a cambio te dan navegación, feeds y enlaces cruzados.

| A favor | En contra |
| --- | --- |
| Navegación, búsqueda y plantillas a través de muchos documentos | Sobrecarga enorme para un solo archivo |
| Rápidos, bien documentados, muy usados | Un archivo de configuración y un paso de compilación que mantener |
| Ecosistemas de temas y plugins | La salida es un sitio, no un documento que puedas enviar por correo |

**Precio:** gratis.

**¿Para quién es?** Para cualquiera que publique un conjunto de documentos que se enlazan entre sí. Si tienes un archivo y una persona a la que enviárselo, [no necesitas un generador](/blog/share-a-markdown-document-as-a-link) — necesitas un archivo.

### GitHub y GitLab — renderizadores, no conversores

Ambos renderizan GFM estupendamente y ninguno tiene un botón de exportar. Puedes sacar HTML de la API de Markdown de GitHub, y puedes guardar la página renderizada desde el navegador, pero lo que guardas viene envuelto en la marcación y las hojas de estilo propias de su aplicación.

**¿Para quién es?** Para nadie, en cuanto a conversión. Los dos son sitios excelentes para leer Markdown y el lugar equivocado para convertirlo.

## Lo que las tablas comparativas dejan fuera

Las páginas de los proveedores compiten por funciones. Las cosas que de verdad decantan si un archivo convertido funciona rara vez están en la lista.

**Si la salida es un documento.** Este es el chasco más común. Las librerías devuelven fragmentos, con corrección y por diseño; varias herramientas online hacen lo mismo. Pegas el resultado en un archivo, lo abres, y obtienes texto sin estilo con el ancho por defecto del navegador. Una herramienta que te entrega un documento completo — doctype, head, estilos— ha tomado una decisión en tu nombre que una librería no puede tomar.

**Si el archivo necesita la red.** Una exportación que enlaza una hoja de estilos o una fuente desde un CDN deja de verse bien en el momento en que se abre sin conexión, y le dice a quien lo abre algo sobre dónde ha estado el archivo. Un archivo autocontenido lleva sus estilos en línea y no pide nada. Es más grande, y es la única versión que se comporta igual en todas partes.

**Si el HTML crudo sobrevive.** Renderizar con fidelidad y renderizar de forma segura son objetivos distintos, y cada herramienta de esta lista elige uno. markdown-it escapa el HTML crudo salvo que se le indique lo contrario. marked lo deja pasar y lo dice. Pandoc lo deja pasar. Si el archivo viene de otra persona, necesitas saber cuál de las dos cosas estás usando antes de abrir el resultado en un navegador.

**Adónde va el archivo.** Un conversor online que sube el archivo es un conversor online que tiene tu documento. Para un README público esto no importa; para un contrato, una nota de paciente o un plan sin anunciar, es toda la pregunta. La conversión en el navegador significa que el archivo nunca sale de la máquina, y eso es verificable — abre la pestaña de red y observa que no pasa nada.

**Qué hace con la cabecera.** Un archivo Markdown de un sitio estático o una app de notas suele empezar con front matter en YAML. Algunos conversores lo eliminan, otros lo renderizan como un párrafo de líneas `clave: valor` al principio del documento, y unos pocos lo convierten en tabla. Ninguna de esas es incorrecta, y solo una es la que tú querías.

## Cómo elegir

Los criterios de abajo son la versión corta; [los requisitos que merece la pena escribir antes de comparar nada](/blog/choosing-a-markdown-to-html-converter) van más allá.

1. **Empieza por el destino.** Enviárselo a una persona necesita un documento autocontenido. Publicar un conjunto de páginas necesita un generador. Renderizar dentro de una aplicación necesita una librería. Son tres herramientas distintas y la equivocada se ve obvia en retrospectiva.
2. **Ajusta el dialecto al archivo.** Si el documento tiene tablas o listas de tareas, el conversor tiene que hacer GFM, no CommonMark puro. Convierte un archivo representativo y mira las tablas antes de comprometerte con nada.
3. **Decide sobre el saneado antes de convertir el archivo de otra persona.** Para tus propias notas no importa. Para cualquier cosa que venga de fuera, o el conversor sanea, o lo haces tú.
4. **Cuenta las instalaciones.** Una conversión puntual no debería necesitar un gestor de paquetes. Una compilación nocturna no debería necesitar una pestaña del navegador con una persona delante.
5. **Abre el resultado en otro sitio.** No en la vista previa de la herramienta — en otro navegador, en otra máquina, con la red apagada. Esa es la prueba que atrapa fragmentos, estilos que faltan y enlaces a un CDN de una sola vez, y lleva un minuto.

## Conclusión

El mejor conversor de Markdown a HTML es el que produce un resultado que sobrevive al viaje. Si tienes un archivo y quieres convertirlo en el próximo minuto, [los pasos están aquí](/blog/convert-markdown-to-html-online). Para un documento con un destinatario, eso significa un archivo completo con los estilos en línea, saneado, producido sin subir el origen a ningún sitio — que es lo que hace [la conversión de Markdown a HTML de TransformPipe](/) en tu navegador, gratis, sin instalación y sin nada que registrar. Para una compilación, usa la librería de la que ya depende tu generador. Para cualquier cosa que implique formatos más allá de HTML, instala Pandoc y aprende sus plantillas; va a durar más que cualquier otra herramienta de esta página.

## Preguntas frecuentes

### ¿Cuál es el mejor conversor gratis de Markdown a HTML?

Para un documento terminado, un conversor que corre en el navegador y produce HTML autocontenido es la mejor opción gratuita: sin instalación, sin subida, y un archivo que se abre en cualquier sitio. Un conversor de navegador hace esto sin ningún coste. Para conversión dentro de tu propio código, marked y markdown-it son gratis y con licencia MIT, y Pandoc es gratis para la línea de comandos.

### ¿Cómo convierto Markdown a HTML sin instalar nada?

Usa un conversor que corra en el navegador. Suelta el archivo `.md` sobre la página y descarga el HTML — sin gestor de paquetes, sin terminal, y con una herramienta que corre en el navegador el archivo nunca se sube, algo que puedes confirmar viendo la pestaña de red mientras convierte.

### ¿Por qué mi HTML convertido se ve sin estilo?

Porque te dieron un fragmento en vez de un documento. Las librerías devuelven `<h1>…</h1><p>…</p>` sin `<html>`, `<head>` ni estilos alrededor, y un navegador lo renderiza con su fuente por defecto y el ancho completo de la ventana. Necesitas un conversor que envuelva la salida en un documento completo, o necesitas escribir tú ese envoltorio.

### ¿Los conversores de Markdown a HTML conservan las tablas?

Solo si implementan GitHub Flavored Markdown. Las tablas no forman parte de la especificación CommonMark, así que un analizador estrictamente conforme renderiza una tabla como un párrafo con caracteres de pipe. Si tus documentos tienen tablas, prueba uno antes de elegir conversor — [las tablas son lo que más se rompe en el camino](/blog/markdown-tables-that-survive-conversion).

### ¿Es seguro convertir un archivo Markdown que me envió alguien?

Solo con un conversor que sanee. Markdown permite HTML crudo, así que un archivo `.md` puede llevar etiquetas `<script>`, manejadores `onerror` y enlaces `javascript:`, y un renderizador fiel se los va a pasar todos a tu navegador. Comprueba si la herramienta sanea por defecto antes de abrir el resultado.

### ¿Puedo convertir Markdown a HTML desde la línea de comandos o un trabajo de CI?

Sí. Pandoc es la respuesta general, y la mayoría de lenguajes tienen una librería con un envoltorio de CLI. Si el trabajo forma parte de una pull request o una compilación nocturna, un conversor con una API o una GitHub Action elimina la instalación de tu runner por completo.

### ¿Cuál es la diferencia entre marked y Marked 2?

Son productos sin relación con nombres confusamente parecidos. `marked` es la librería de JavaScript de código abierto descrita arriba. Marked 2 es una aplicación de pago para macOS de vista previa de Markdown. Buscar uno te devuelve el otro con fiabilidad.
