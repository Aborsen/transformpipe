---
title: Todas las alternativas a Pandoc que merece la pena conocer, según para qué las quieras
description: "Pandoc no tiene rival en DOCX, EPUB, citas y PDF maquetado. Si solo necesitas HTML, aquí están las alternativas, ordenadas según qué te ha traído hasta aquí"
date: 2026-08-14
tag: Conversión
keywords: pandoc markdown a html, pandoc html autónomo, alternativa a pandoc, convertir markdown sin pandoc, pandoc sin instalar, markdown a docx, markdown a pdf
---

Nadie busca una alternativa a Pandoc porque Pandoc sea malo. Lo busca porque quería un archivo HTML y se encontró leyendo sobre variables de plantilla, o porque la opción de PDF le pedía instalar una distribución de TeX, o porque no hay terminal en la máquina donde vive el documento. La herramienta no es el problema. Lo que sobra es la distancia entre la herramienta y el encargo.

### Resumen rápido

Pandoc es la respuesta correcta siempre que la tubería produzca algo distinto de HTML —DOCX, EPUB, LaTeX, un PDF maquetado, una bibliografía— y nada más en esta página se le acerca en eso. Si HTML es la única salida, la alternativa que conviene depende del motivo por el que estás buscando: **un conversor de navegador** si quieres cero instalación y un solo archivo terminado, **marked o markdown-it** si la conversión ocurre dentro de código que ya ejecutas, **una API alojada o una GitHub Action** si ocurre en CI y no quieres un paso de instalación de paquetes en el runner, **un generador de sitios estáticos** si la respuesta es un sitio y no un documento. La parte honesta está al final: cuatro trabajos donde cada sustituto de esta lista falla y donde hay que instalar Pandoc.

## La fricción, nombrada con precisión

Convertir Markdown a HTML con Pandoc es una línea. Ahí no está el coste.

El coste está en la segunda línea. Un simple `pandoc -t html` devuelve un fragmento —encabezados y párrafos sin doctype, sin `<head>`, nada que un navegador vaya a tratar como una página. `--standalone` lo arregla envolviendo tu contenido en la plantilla por defecto de Pandoc, que es deliberadamente sencilla, y en el momento en que quieres que se parezca a algo entras en `--css` para una hoja de estilos, `-V` para variables de plantilla, o `--template` con un archivo escrito en el propio lenguaje de plantillas de Pandoc: `$body$`, `$for(author)$`, `$if(toc)$`. Ninguna otra herramienta lee ese archivo. Ahora forma parte de tu compilación, y alguien tiene que mantenerlo.

Luego está el problema de la hoja de estilos. `--css` te deja con un archivo HTML que necesita un segundo archivo a su lado, que es exactamente lo que no quieres si el plan era mandarle la página a un compañero por correo. Pandoc puede incrustar los recursos en su lugar, pero la opción que lo hace cambió de nombre entre versiones mayores, así que comprueba `pandoc --help` en vez de fiarte de una respuesta de un foro de hace cuatro años.

Nada de esto es difícil. Es una cantidad de configuración real para una sola página, y esa cantidad no se reduce cuando el encargo es pequeño. Esa asimetría es la razón entera de que exista este artículo.

## En qué Pandoc no tiene rival

Hay que ser justos con él primero, porque el resumen justo es también el útil — te dice cuándo dejar de leer.

Pandoc lee un documento hacia una representación interna y vuelve a escribir esa representación en otro formato. La indirección es el truco: nadie tuvo que escribir un conversor de Markdown a DOCX, porque cualquier lector puede alimentar a cualquier escritor. Esa única decisión de diseño es la razón de que la lista de formatos llegue a docenas de entradas, y de que ninguna herramienta más pequeña la haya alcanzado nunca.

**Una matriz de formatos.** Un archivo fuente, varias salidas, sincronizadas entre sí. HTML para el sitio, DOCX para quien revisa con control de cambios en Word, EPUB para quien lee en un tren. Cada alternativa de abajo hace bien una sola salida. Pandoc hace la matriz.

**Escritura académica.** Matemáticas, referencias cruzadas, figuras numeradas, y `--citeproc` con un archivo BibTeX y un estilo CSL, para que la bibliografía se formatee sola con el estilo que exija la revista. Nada más en este artículo tiene siquiera un procesador de citas.

**Salida a Word con un estilo de casa.** `--reference-doc` toma tipografías, estilos de encabezado y espaciado de un `.docx` existente y los aplica al tuyo. Si llegó una plantilla de un equipo legal o de marketing, esa opción es la razón entera para instalar Pandoc.

**Filtros.** Un filtro Lua o JSON reescribe el documento mientras sigue siendo un árbol —renumerar cada tabla, quitar una sección, reescribir cada enlace interno, subir cada encabezado un nivel. Hacer lo mismo con una expresión regular sobre el HTML terminado funciona bien hasta que deja de funcionar.

```bash
pandoc -f gfm -t docx notes.md -o notes.docx
pandoc -f gfm -t epub book.md -o book.epub
pandoc -f gfm --citeproc --bibliography=refs.bib paper.md -o paper.pdf
```

La tercera línea lleva una advertencia que conviene conocer antes de teclearla. Markdown a PDF no es uno de los escritores de Pandoc. Pandoc hace un PDF entregándole el documento a un motor aparte, y el que trae por defecto es un motor TeX, así que esa tubería suele significar instalar también una distribución de TeX —una instalación mucho mayor que el propio Pandoc, y la razón más común por la que alguien decide que Pandoc es más de lo que quería. `--pdf-engine` puede apuntar en su lugar a un motor basado en HTML o en Typst, que es mucho más pequeño y trata las matemáticas y la maquetación de otra manera.

## Comparativa rápida: la chuleta

| Herramienta | Mejor para | Capacidad clave | Precio |
| --- | --- | --- | --- |
| Pandoc | Cualquier salida que no sea HTML | Docenas de formatos, plantillas, filtros Lua, `--citeproc` | Gratis, GPL |
| Pandoc en Docker | Mantener la matriz sin instalarla | La imagen oficial, ejecutada sobre un directorio montado | Gratis, GPL |
| TransformPipe | Un archivo terminado, sin instalar, sin subir nada | HTML autónomo con estilos incluidos, convertido en el navegador | Gratis |
| Dillinger | Redactar cuando no hay nada instalado | Editor en el navegador, exporta a HTML y PDF, sincroniza con Drive y Dropbox | Gratis, MIT |
| StackEdit | Escribir en el navegador sin conexión | Editor en el navegador, funciona sin conexión una vez cargado, sincroniza y publica | Gratis, Apache 2.0 |
| Typora | Una aplicación de escritorio en vez de un comando | Edición WYSIWYG, exporta a HTML, PDF y Word | 14,99 $ de pago único |
| Obsidian | Exportar desde notas que ya llevas | Bóveda local; exportación a PDF en la app, HTML mediante plugins | Gratis; licencia comercial de pago opcional |
| VS Code | Convertir el archivo que ya tienes abierto | Vista previa construida sobre markdown-it, exportación mediante extensiones | Gratis |
| marked | Conversión dentro de una app de JavaScript | Pequeño, rápido, GFM de serie | Gratis, MIT |
| markdown-it | Conformidad con la especificación y plugins | Compatible con CommonMark, escapa el HTML crudo por defecto | Gratis, MIT |
| remark / rehype | Cambiar el documento, no solo renderizarlo | Un AST que puedes recorrer, más un saneador en la tubería | Gratis, MIT |
| Python-Markdown | Un script de compilación en Python | API de extensiones madura, el motor detrás de MkDocs | Gratis, BSD |
| markdown-it-py | CommonMark en Python | Un port de markdown-it, la misma forma de plugins | Gratis, MIT |
| mistune | Velocidad en Python | Python puro, rápido, basado en plugins | Gratis, BSD |
| cmark-gfm | Un binario diminuto dentro de una compilación | GFM en C, fragmento de salida, sin runtime que instalar | Gratis, código abierto |
| API alojada, CLI, GitHub Action | CI sin paso de instalación de paquetes | Conversión como una petición o un paso de flujo de trabajo | Nivel gratuito; cuenta necesaria para claves |
| Generadores de sitios estáticos | Un sitio en vez de un documento | Navegación, plantillas, feeds, muchas páginas a la vez | Gratis |
| API de Markdown de GitHub | Renderizar GFM exactamente como lo hace GitHub | Endpoint HTTP que devuelve un fragmento HTML | Gratis, con límite de peticiones |

## Las alternativas, según el motivo por el que las buscas

Cada sección de abajo responde a una frase distinta. Encuentra la tuya y salta las demás. Si lo que quieres es el panorama completo y no la pregunta con forma de Pandoc, [la comparativa completa de conversores](/blog/best-markdown-to-html-converters) cubre las mismas herramientas con otro criterio.

### Pandoc mismo — la referencia contra la que estás midiendo

Merece su propia sección, porque la mitad de la gente que busca una alternativa en realidad está buscando permiso para seguir usando esto.

| A favor | En contra |
| --- | --- |
| Convierte entre formatos que nada más toca | Un binario que instalar, y una terminal donde escribir |
| `--standalone` produce un documento completo, no un fragmento | Las plantillas son un lenguaje que solo lee Pandoc |
| Los filtros reescriben el documento como un árbol | La salida a PDF necesita un motor aparte, a menudo TeX |
| `--sandbox` restringe el acceso al sistema de archivos con entrada no fiable | El HTML crudo pasa directo: sin saneado |

**Precio:** gratis, con licencia GPL.

**Detalles técnicos y funciones**

- Escrito en Haskell, distribuido como un único binario para las plataformas principales
- Su propio dialecto extendido por defecto, con lectores de CommonMark y GFM seleccionables por opción
- `--standalone` para un documento completo; una opción aparte incrusta imágenes y CSS
- `--citeproc`, `--bibliography` y estilos CSL para las referencias
- Filtros Lua y JSON para reescribir el árbol de sintaxis abstracta a mitad de conversión

**¿Para quién es?** Para cualquiera cuyo documento tenga que convertirse en algo que no sea una página web, ahora o dentro de unos meses. El lenguaje de plantillas es un precio justo por la matriz de formatos. Es un mal precio por un solo README.

### TransformPipe — sin instalar nada, y un archivo que se abre donde sea

Un conversor de navegador le encaja a un documento que no forma parte de ninguna compilación. Abres una página, sueltas el archivo `.md` encima, y descargas el HTML. Vale la pena saber [qué conversores en línea suben tu archivo y cuáles no](/blog/best-online-document-converters) antes de elegir uno. Sin haber iniciado sesión, no se sube nada: el archivo se lee, se analiza y se renderiza en tu propia máquina, algo que puedes confirmar viendo cómo la pestaña de red no hace nada mientras trabaja.

| A favor | En contra |
| --- | --- |
| Nada que instalar, y ninguna terminal | Un documento a la vez, o varios encadenados en uno — no un sitio |
| La exportación es un único archivo autónomo con los estilos incluidos | Sin lenguaje de plantillas, así que las maquetaciones son las que hay |
| Sin sesión iniciada, el archivo nunca sale de la máquina | El navegador hace el trabajo, así que un archivo muy grande está limitado por la máquina |
| Sanea contra una lista de permitidos, en el navegador y en el servidor por igual | Nada fuera de HTML: sin DOCX, sin EPUB, sin PDF maquetado |

**Precio:** gratis. Registrarse añade historial de conversiones, enlaces para compartir y claves de API, y tampoco cuesta nada.

**Detalles técnicos y funciones**

- Lee GitHub Flavored Markdown, así que las tablas, las listas de tareas, el tachado y el código con fence sobreviven
- Lo que se descarga es una página entera: un doctype, un `<head>`, el CSS dentro de un bloque `<style>`, y ninguna petición externa
- Cualquier HTML crudo de la fuente se filtra contra una lista fija de permitidos al pasar
- Guarda como `.html`, `.md` o texto plano; un PDF sale del diálogo de impresión del navegador en vez de un motor TeX
- También convierte HTML, Word, CSV/TSV y JSON de vuelta a Markdown
- El mismo conversor se puede alcanzar de otras cuatro formas: una API REST, una CLI, una GitHub Action y un servidor MCP

**¿Para quién es?** Para cualquiera cuyo siguiente paso sea «mandarle esto a una persona», y para cualquiera en una máquina donde instalar un binario es decisión de otro. Es el sustituto más cercano a `pandoc --standalone --embed-resources`, sin la instalación y sin la plantilla.

### Dillinger y StackEdit — cuando todavía estás escribiendo el documento

Los dos son editores de Markdown en el navegador con exportación, y los dos son la respuesta correcta a una pregunta distinta: no «convierte este archivo» sino «escribe este documento y consigue HTML al final». Dillinger exporta a HTML y PDF y sincroniza con Dropbox, Google Drive, OneDrive y GitHub. StackEdit sigue funcionando sin conexión una vez cargado, y publica en varios destinos cuando la tiene.

| A favor | En contra |
| --- | --- |
| Escribir y exportar sin salir del navegador | Pensados para editar: ninguno está hecho para convertir archivos que ya tienes |
| Sincronización en la nube con los sitios habituales | El documento pasa por un servicio alojado |
| Gratuitos y de código abierto | El estilo de exportación es de la herramienta, no el tuyo |
| StackEdit funciona sin conexión una vez cargado | La sintaxis extendida de StackEdit puede viajar mal a otros analizadores |

**Precio:** gratis. Dillinger tiene licencia MIT; StackEdit tiene licencia Apache 2.0.

**Detalles técnicos y funciones**

- Vista previa en vivo junto a la fuente, con las comodidades habituales de un editor
- Exportación a HTML y PDF desde el navegador, sin instalación local
- Destinos de sincronización y publicación que incluyen Drive, Dropbox, OneDrive y GitHub
- Los documentos viven en el almacenamiento del navegador o en la cuenta conectada, no en tu sistema de archivos por defecto

**¿Para quién es?** Para gente que está redactando ahora en vez de convirtiendo más tarde. Si el archivo ya existe en el disco y solo quieres HTML a partir de él, un conversor es un camino más corto que un editor.

### Typora — una aplicación de escritorio en vez de un comando

La respuesta sin terminal para quien escribe Markdown todos los días. Typora sustituye la sintaxis por su propio renderizado mientras escribes, mantiene los archivos en tu disco, y exporta a HTML, PDF y Word desde un menú.

| A favor | En contra |
| --- | --- |
| Cómodo para escribir durante horas | De pago, y solo de escritorio |
| Exporta a HTML, PDF y Word con temas | No es una herramienta por lotes ni un paso de compilación |
| Los archivos se quedan en tu máquina | El WYSIWYG esconde la sintaxis, cosa que a algunos escritores no les gusta |

**Precio:** 14,99 $ sin impuestos, pago único que cubre hasta tres dispositivos, con quince días de prueba gratis (comprobado en typora.io, el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Edición WYSIWYG sobre archivos `.md` planos en el sistema de archivos local
- Exportación a HTML, PDF, Word y varios otros formatos desde el menú de la aplicación
- Los temas son CSS, así que el estilo de exportación se puede editar sin un lenguaje de plantillas
- Trata tablas, notas al pie, matemáticas y diagramas como funciones del editor

**¿Para quién es?** Para quien escriba Markdown a diario y quiera una aplicación en vez de un comando. Cubre las salidas a HTML, PDF y Word de Pandoc para un documento a la vez, con un ratón, y no cubre ninguna de ellas dentro de un script.

### Obsidian — exportar desde las notas que ya llevas

No es un conversor, pero a menudo es la razón por la que alguien no necesita uno: el documento ya está en una bóveda de archivos Markdown locales, y la exportación es un elemento de menú de distancia. La exportación a PDF viene incluida en la aplicación. La exportación a HTML viene de plugins de la comunidad, que es una distinción real — el producto principal no la promete.

| A favor | En contra |
| --- | --- |
| Archivos locales, sin subir nada, funciona sin conexión | La exportación a HTML depende de un plugin de la comunidad, no de la app principal |
| Exportación a PDF incluida | Los wikilinks y los embeds son sintaxis de Obsidian, no GFM |
| Gratis para uso personal y comercial | No es una tubería: las exportaciones ocurren cuando alguien hace clic |

**Precio:** gratis para todo tipo de uso, incluido el comercial; hay licencias comerciales opcionales que se venden por año (comprobado en obsidian.md, el 8 de septiembre de 2026).

**Detalles técnicos y funciones**

- Las bóvedas son directorios normales de archivos `.md`, así que cualquier otra herramienta también puede leerlos
- `[[wikilinks]]`, embeds y callouts son extensiones: comprueba qué hace con ellos tu analizador de destino
- El ecosistema de plugins cubre exportación, publicación y generación de sitios
- Nada sale de la máquina salvo que activases un servicio de sincronización o publicación

**¿Para quién es?** Para gente cuyo Markdown ya vive en una bóveda. El aviso está en la sintaxis: una nota llena de `[[wikilinks]]` convertida por un analizador GFM estricto produce corchetes dobles literales en la salida, porque esos corchetes no son Markdown.

### VS Code — el camino más corto si el archivo ya está abierto

El panel de vista previa de VS Code es markdown-it por debajo, y la exportación llega mediante extensiones y no desde el propio editor. Para un README que ya está abierto en una pestaña, eso le gana a instalar cualquier cosa.

| A favor | En contra |
| --- | --- |
| Ya instalado, para la mayoría de los desarrolladores | La exportación necesita una extensión, y las extensiones varían en calidad |
| El comportamiento de la vista previa coincide con el manejo de CommonMark de markdown-it | El estilo de la vista previa no es el estilo exportado |
| Las extensiones cubren HTML, PDF y presentaciones | Convierte lo que está abierto: no es un lote, no es una compilación |

**Precio:** gratis.

**Detalles técnicos y funciones**

- Vista previa integrada renderizada por markdown-it, con funciones GFM activadas para la vista previa
- Las extensiones de exportación envuelven el fragmento en un documento e incrustan o enlazan una hoja de estilos — cuál de las dos, depende de la extensión
- Los ajustes del espacio de trabajo pueden añadir una hoja de estilos de vista previa personalizada
- Nada se sube: la conversión ocurre en el propio proceso del editor

**¿Para quién es?** Para desarrolladores que necesitan el archivo que tienen abierto en el editor y nada más. Comprueba qué pone la extensión alrededor del fragmento antes de mandarle el resultado a nadie, porque «se veía bien en la vista previa» no es la misma afirmación que «se abre bien en el portátil de otra persona».

### marked y markdown-it — la vía de JavaScript

Si la conversión pertenece dentro de código que ya ejecutas, una librería es más pequeña que un binario y más fácil de razonar. marked es pequeño y rápido con GFM activado por defecto. markdown-it cumple CommonMark, tiene un sistema de plugins estructurado, y escapa el HTML crudo salvo que le digas lo contrario — el valor por defecto más seguro de los dos.

| A favor | En contra |
| --- | --- |
| Una sola dependencia, sin instalación aparte que documentar | Los dos devuelven un fragmento: el envoltorio es tarea tuya |
| El HTML alrededor de la salida es HTML que escribiste tú, no una plantilla heredada | Sin matriz de formatos — solo HTML |
| markdown-it escapa el HTML crudo por defecto | La calidad de los plugins varía en el ecosistema |
| Se ejecutan tanto en Node como en el navegador | Resaltado de sintaxis y saneado son decisiones aparte |

**Precio:** gratis, ambas con licencia MIT.

**Detalles técnicos y funciones**

- marked: GFM por defecto, renderizadores personalizados por tipo de nodo, un lexer al que puedes llamar para obtener tokens en vez de HTML
- markdown-it: pasa la suite de CommonMark, `html: false` por defecto, reglas que se pueden añadir y reordenar
- Ninguno de los dos sanea por ti; la respuesta documentada es un saneador dedicado sobre la salida
- Los dos son el motor dentro de herramientas más grandes, así que los informes de fallos y los casos límite están bien recorridos

**¿Para quién es?** Cualquier proyecto que ya tenga una compilación de Node. [La comparativa completa de JavaScript](/blog/markdown-to-html-in-javascript) recorre las diferencias como es debido, y [convertir desde una terminal](/blog/markdown-to-html-from-the-command-line) tiene el script envoltorio completo — unas quince líneas, que es la medida honesta de lo que vale `--standalone` de Pandoc para ti.

### remark y rehype — cuando necesitas cambiar el documento

El ecosistema unified analiza Markdown a un AST, te deja reescribirlo, y luego renderiza. Es la única alternativa de aquí que compite con los filtros Lua de Pandoc, y compite bien.

| A favor | En contra |
| --- | --- |
| Un árbol de sintaxis real que puedes recorrer, consultar y reescribir | La opción más pesada de esta página |
| rehype-sanitize es un paso de la tubería, no una idea de última hora | La tubería exige un aprendizaje genuino |
| Plugins para GFM, front matter, encabezados, enlaces | Excesivo para convertir un solo archivo en una sola página |
| Impulsa MDX y Docusaurus, así que está muy ejercitado | Sigue siendo solo HTML al final |

**Precio:** gratis, licencia MIT.

**Detalles técnicos y funciones**

- Dos formatos de árbol —mdast para Markdown, hast para HTML— y un plugin para convertir uno en el otro
- remark-gfm para tablas y listas de tareas; remark-frontmatter para la cabecera YAML
- Los mismos árboles se usan para construir linters, formateadores y codemods sobre prosa
- El saneado ocurre en el árbol, antes de que exista el HTML, que es más estricto que filtrar cadenas de texto

**¿Para quién es?** Equipos que tienen que alterar el documento en tránsito: reescribir cada enlace relativo, extraer encabezados para la navegación, imponer un estilo de casa. Si estabas recurriendo a un filtro Lua, este es el sustituto.

### Python-Markdown, markdown-it-py y mistune — la vía de Python

La misma lógica en otro lenguaje. Python-Markdown es la opción madura con un catálogo grande de extensiones y es el motor detrás de MkDocs. markdown-it-py es un port de markdown-it, así que trae conformidad con CommonMark y la misma forma de plugins. mistune es la rápida.

| A favor | En contra |
| --- | --- |
| Encaje natural si la compilación ya es Python | Salida en fragmento en los tres casos |
| La API de extensiones de Python-Markdown está bien documentada y muy usada | Python-Markdown no es compatible con CommonMark en todos los detalles |
| markdown-it-py da conformidad con la especificación y un modelo de plugins familiar | Tres librerías significan tres conjuntos de casos límite |
| mistune es lo bastante rápida para lotes grandes | Resaltado y saneado siguen siendo cosa tuya |

**Precio:** gratis. Python-Markdown tiene licencia BSD, markdown-it-py tiene licencia MIT, mistune tiene licencia BSD.

**Detalles técnicos y funciones**

- Python-Markdown: extensiones oficiales para tablas, notas al pie, listas de atributos e índice
- markdown-it-py: un port del analizador de JavaScript, usado donde el comportamiento de CommonMark tiene que coincidir
- mistune: Python puro con un sistema de plugins, sin dependencia compilada
- Las tres devuelven una cadena de texto, así que el envoltorio del documento es una plantilla en tu propio código

**¿Para quién es?** Proyectos en Python, compilaciones de documentación y cualquier cosa que ya importe desde PyPI. Prueba primero un documento con una tabla dentro: las tres librerías no están de acuerdo sobre las tablas, porque las tablas son una extensión en las tres y no sintaxis básica.

### cmark-gfm — el binario pequeño dentro de una compilación

La bifurcación de GitHub de la implementación de referencia de CommonMark, escrita en C, con las extensiones de GFM añadidas. Es rápida, no tiene runtime que instalar a su lado, y te entrega un fragmento sin estilo y sin envoltorio.

| A favor | En contra |
| --- | --- |
| Diminuta y rápida, sin runtime de lenguaje necesario | Solo fragmento: nada parecido a `--standalone` |
| Implementa las extensiones de GFM, tablas incluidas | Las extensiones son lo que hay en la caja y nada más |
| Sensata dentro de un Makefile o una imagen de contenedor | La compilas tú o buscas un paquete para tu plataforma |

**Precio:** gratis, código abierto — cmark tiene licencia BSD, y la bifurcación cmark-gfm de GitHub lleva su propio aviso.

**Detalles técnicos y funciones**

- CommonMark más las extensiones de GFM: tablas, listas de tareas, tachado, autoenlaces, notas al pie opcionales
- Una librería en C además de un binario de línea de comandos, así que se incrusta en otros programas
- Las opciones controlan el manejo de HTML crudo, algo que importa con entrada no fiable
- Sin plantillas, sin CSS, sin incrustación de recursos — a propósito

**¿Para quién es?** Compilaciones que ya aportan su propia maquetación y solo necesitan el cuerpo. Es lo más parecido a la velocidad y la conveniencia de un solo binario de Pandoc, sin nada de su alcance.

### Una API alojada, una CLI o una GitHub Action — CI sin un paso de instalación de paquetes

El caso de CI es su propio problema. Instalar Pandoc en un runner es un paso que descarga un binario en cada tarea, y TeX en un runner es peor. Las alternativas son una petición a una API, una CLI sin dependencias, o un paso de flujo de trabajo que hace la conversión por ti.

| A favor | En contra |
| --- | --- |
| Nada instalado en el runner, así que nada que cachear ni fijar | Una API significa que el documento sale de la máquina |
| Un solo paso de flujo de trabajo, y la misma conversión que la página web | Una clave en los secretos del repositorio, que hay que crear y rotar |
| La salida es un archivo autónomo completo, listo para publicar | Solo HTML: una versión que necesite un PDF sigue necesitando un motor |
| La CLI no tiene árbol de dependencias que auditar | Un servicio alojado es una dependencia que no controlas |

**Precio:** nivel gratuito; hace falta una cuenta para emitir claves de API.

**Detalles técnicos y funciones**

- Endpoint REST que recibe Markdown y devuelve un documento HTML completo
- Una CLI sin dependencias, para un runner que solo tiene una shell y nada más
- Una GitHub Action para convertir al hacer push, al fusionar o en una etiqueta de versión
- Un servidor MCP, para el caso en que quien hace la conversión es un modelo y no una persona

**¿Para quién es?** Cualquiera que reconstruya una página en cada commit. [Publicar desde un flujo de trabajo](/blog/publish-markdown-from-github-actions) recorre la versión para pull requests, donde la salida se adjunta a la PR en vez de desplegarse. La contrapartida de privacidad es real y vale la pena decirla con claridad: una conversión en el navegador mantiene el archivo local, y una llamada a una API no.

### Pandoc en Docker — sin la instalación, con la matriz intacta

*Pandoc sin instalarlo* suele significar una de dos cosas. La primera es un frontend web que ejecuta Pandoc en el servidor de otra persona, lo cual está bien para un README público y mal para un borrador de contrato. La segunda es la imagen de contenedor oficial, que mantiene limpia tu máquina y mantiene todos los formatos.

```bash
docker run --rm -v "$PWD:/data" pandoc/core -f gfm -t html -s README.md -o README.html
```

| A favor | En contra |
| --- | --- |
| Toda la matriz de formatos, nada instalado en el anfitrión | Has instalado Docker en su lugar, que es más grande |
| Reproducible: la imagen fija la versión para todo el mundo | Los volúmenes montados y los permisos de archivo se vuelven problema tuyo |
| Existen imágenes variantes para las tuberías LaTeX más pesadas | Más lenta por ejecución que un binario local |

**Precio:** gratis, licencia GPL.

**¿Para quién es?** Para equipos que quieren un solo Pandoc fijado en varias máquinas, y para cualquiera en un portátil cerrado que tiene Docker pero no gestor de paquetes. Es el término medio honesto: te saltas la instalación sin entregarle tu documento a un extraño.

### Generadores de sitios estáticos — la respuesta cuando querías un sitio

Hugo, Eleventy, MkDocs, Docusaurus y Jekyll convierten todos Markdown a HTML, y ninguno de ellos es un conversor en el sentido de esta página. Cada uno es un sistema de compilación. Quiere un directorio, un archivo de configuración, un conjunto de plantillas y un destino de despliegue; a cambio te devuelve navegación, búsqueda, feeds y enlaces cruzados entre todas las páginas a la vez.

| A favor | En contra |
| --- | --- |
| Navegación y plantillas entre muchos documentos | Demasiada maquinaria para un solo archivo |
| Compilaciones rápidas, documentación completa, desplegado en todas partes | Un archivo de configuración y un paso de compilación que mantener vivo para siempre |
| Temas, plugins y una historia de despliegue | La salida es un directorio de páginas, no un archivo que puedas mandar por correo |

**Precio:** gratis. Hugo tiene licencia Apache 2.0; Eleventy, Docusaurus y Jekyll tienen licencia MIT; MkDocs tiene licencia BSD.

**Detalles técnicos y funciones**

- Cada uno trae su propio motor de Markdown: Goldmark en Hugo, markdown-it en Eleventy por defecto, Python-Markdown en MkDocs
- El front matter dirige títulos, fechas, etiquetas y el orden de navegación
- La salida es un árbol de directorios de HTML con recursos compartidos, pensado para servirse
- El despliegue forma parte del modelo: un comando de compilación y un anfitrión

**¿Para quién es?** Para cualquiera cuya salida sea un conjunto de páginas que se referencian entre sí. Un archivo y un destinatario es la forma equivocada para un generador por completo — ese encargo quiere un documento, no un sitio web.

### La API de Markdown de GitHub — GFM renderizado exactamente como lo hace GitHub

Un endpoint HTTP que recibe Markdown y devuelve HTML. Es la única forma de conseguir el propio renderizado de GitHub sin hacer scraping de una página, y la salida es un fragmento envuelto en nada.

| A favor | En contra |
| --- | --- |
| Comportamiento de GitHub Flavored Markdown idéntico byte a byte | El documento se sube a GitHub para renderizarse |
| Sin ninguna instalación: una sola petición HTTP | Con límite de peticiones, y hace falta autenticación para subirlo |
| Útil para comprobar qué hace GFM en realidad | Salida en fragmento, con nombres de clase de GitHub en algunos elementos |

**Precio:** gratis, con límite de peticiones.

**¿Para quién es?** Para cualquiera que tenga que igualar el renderizado de GitHub con precisión, y para nadie que necesite una página terminada. Trátalo como una implementación de referencia a la que puedes llamar, no como una vía de exportación.

## Los trabajos que de verdad exigen Pandoc

Esta es la sección que una página de comparativas suele dejar fuera, así que aquí está sin suavizar nada. Cuatro trabajos no deberían intentarse con nada de lo de arriba.

**Cualquier cosa con bibliografía.** Si el documento cita fuentes y las citas tienen que formatearse a un estilo, `--citeproc` con un archivo BibTeX y un estilo CSL es la herramienta. No hay sustituto en esta página. Hacerlo a mano significa mantener una lista de referencias que se queda obsoleta la primera vez que un coautor reordena una sección.

**Un PDF maquetado con una diagramación real.** Huérfanas, viudas, colocación de figuras, números de página, referencias cruzadas que dicen «ver página 14». Imprimir desde el navegador a PDF te da un documento legible y no uno maquetado, porque el navegador está construyendo una página web y luego cortándola en páginas. Si la salida tiene que verse compuesta, Pandoc entregándole el trabajo a un motor TeX o Typst es la vía, y la instalación adicional es el precio.

**DOCX con la plantilla de otro.** Cuando llega una plantilla `.docx` con tipografías, estilos de encabezado y espaciado obligatorios, `--reference-doc` la aplica. Ningún conversor de Markdown a Word que se salte este paso va a producir un archivo que la dueña de la plantilla acepte, y reformatear a mano en Word es un trabajo que vas a repetir el trimestre que viene.

**EPUB, LaTeX, reStructuredText, MediaWiki, Org y el resto de la matriz.** En el momento en que aparecen dos de esos en el mismo requisito, la discusión se acaba. Encadenar herramientas de un solo propósito para fingir una matriz significa que cada formato está a un caso límite de una herramienta distinta de romperse, y las roturas llegan por separado.

Hay una cosa que Pandoc deliberadamente no hace, y corta en el otro sentido: no sanea. El HTML crudo en un archivo Markdown pasa directo a la salida, etiquetas `<script>` incluidas, porque una conversión fiel es el trabajo que se comprometió a hacer. `--sandbox` restringe el acceso al sistema de archivos durante la conversión, que es una protección distinta. Si el archivo vino de fuera —un cliente, un repositorio, un formulario— necesitas tu propio paso de saneado, y [por qué eso tiene que pasar en más de un sitio](/blog/sanitising-markdown-safely) merece diez minutos antes de abrir el resultado en un navegador.

## Cómo elegir

1. **Escribe todos los formatos de salida que este documento tendrá que producir a lo largo de su vida.** Si DOCX, EPUB, LaTeX o un PDF maquetado aparecen en esa lista, instala Pandoc y deja de comparar; cada hora gastada en un sustituto es una hora gastada en una herramienta que vas a reemplazar.
2. **Decide si el destino es una persona o un servidor.** Una persona necesita un solo archivo autónomo que se abra con la red apagada. Un servidor necesita un fragmento que tus plantillas vayan a envolver. Elegir mal produce o bien texto sin estilo en el correo de alguien, o un documento con dos copias del andamiaje de la página.
3. **Cuenta cuántas instalaciones puede aguantar el encargo.** Una conversión puntual no debería necesitar un gestor de paquetes; una compilación nocturna no debería necesitar una pestaña de navegador y una persona dentro de ella. Los dos errores son comunes y los dos son obvios en retrospectiva.
4. **Comprueba adónde va el archivo antes de convertirlo.** La conversión en el navegador mantiene el documento en tu máquina, y lo puedes verificar desde la pestaña de red. Una API, un editor alojado y el endpoint de Markdown de GitHub significan todos que el documento viaja, algo irrelevante para un README público y decisivo para un contrato.
5. **Convierte un archivo representativo y abre el resultado en otro sitio.** No en la vista previa de la herramienta — otro navegador, otra máquina, sin conexión. Esa única prueba detecta a la vez fragmentos, hojas de estilos ausentes, enlaces de tipografía a un CDN y tablas perdidas, y lleva alrededor de un minuto.

## Conclusión

La razón de que «alternativa a Pandoc» sea una búsqueda tan habitual es que Pandoc responde a una pregunta más grande de la que casi todo el mundo está haciendo, y responder a una pregunta más grande siempre cuesta más. Si el documento tiene que convertirse en un archivo de Word, un EPUB o un PDF maquetado, instala Pandoc y aprende sus plantillas — va a durar más que cualquier otra herramienta nombrada aquí. Si HTML es la única salida, elige según el motivo por el que llegaste: una librería donde ya vive la compilación, un paso de flujo de trabajo donde ya corre CI, un generador cuando la respuesta es un sitio, y un conversor de navegador cuando lo que quieres es un solo archivo terminado sin que la instalación de nadie se ponga en medio — que es lo que hace [la conversión de Markdown a HTML de TransformPipe](/), gratis, en tu propio navegador, sin subir nada cuando no has iniciado sesión.

## Preguntas frecuentes

### ¿Cuál es la mejor alternativa a Pandoc para pasar Markdown a HTML?

No hay una sola, porque Pandoc cubre varios trabajos a la vez. Para una sola página terminada sin instalar nada, un conversor de navegador que produzca HTML autónomo; para conversión dentro de código, marked o markdown-it; para CI, una API o una GitHub Action; para un sitio entero, un generador de sitios estáticos. Cada uno sustituye una parte de lo que hace Pandoc, y ninguno sustituye la matriz de formatos.

### ¿Puedo usar Pandoc sin instalarlo?

Sí, de dos formas con contrapartidas distintas. La imagen oficial de Docker ejecuta el Pandoc real sin nada instalado en el anfitrión salvo Docker, lo que mantiene tu documento local. Un frontend web alojado también ejecuta Pandoc, pero en la máquina de otra persona, así que el archivo se sube — bien para un README público, mal para cualquier cosa confidencial.

### ¿Es Pandoc excesivo para convertir un solo archivo Markdown a HTML?

Normalmente sí. Una conversión simple devuelve un fragmento, así que necesitas `--standalone`, y hacer que esa salida se parezca a algo significa una opción de hoja de estilos, variables de plantilla o un archivo de plantilla en el propio lenguaje de Pandoc. Para una sola página que alguien tiene que leer, un conversor que devuelve un documento autónomo completo se salta todo eso.

### ¿Por qué mi HTML de Pandoc no tiene ningún estilo?

Porque no pasaste `--standalone`, o lo hiciste y obtuviste la plantilla por defecto, que es deliberadamente sencilla. Añade una hoja de estilos con `--css` y ahora tienes dos archivos que deben viajar juntos; incrusta los recursos en su lugar si el archivo tiene que abrirse solo. Ese hueco entre «convertido» y «presentable» es la razón más común por la que la gente empieza a buscar una alternativa.

### ¿Qué sustituye a los filtros Lua de Pandoc?

remark y el ecosistema unified, más de cerca que cualquier otra cosa. Los dos analizan el documento a un árbol de sintaxis que puedes reescribir antes de renderizar, que es la misma clase de solución — reescribir el árbol, no la cadena de salida. La diferencia es que el árbol de Pandoc abarca cada formato que soporta, mientras que el de remark cubre Markdown y HTML.

### ¿Las alternativas manejan tablas y listas de tareas?

Solo si implementan GitHub Flavored Markdown, porque las tablas y las listas de tareas no están en la especificación de CommonMark. marked, cmark-gfm y markdown-it configurado con GFM sí lo hacen; un analizador estricto de CommonMark renderiza tu tabla como un párrafo lleno de barras verticales y no informa de ningún error. Convierte un archivo con una tabla dentro antes de comprometerte con cualquier herramienta de esta página.

### ¿Es seguro un conversor de navegador para un documento confidencial?

Depende por completo de si la conversión ocurre en el navegador o en un servidor, y las dos cosas se ven idénticas desde fuera. Un conversor en el navegador lee el archivo con la File API y nunca lo envía, algo que puedes verificar abriendo la pestaña de red y viendo que no pasa nada. Cualquier cosa que te muestre una barra de progreso mientras un servidor trabaja tiene ya tu documento.
